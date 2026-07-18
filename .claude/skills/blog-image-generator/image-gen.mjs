#!/usr/bin/env node
/**
 * Gemini image tool for the blog-image-generator skill.
 *
 * Generates blog hero images with Google's Gemini image model, then optimizes
 * and self-hosts the chosen one. Images are AI-generated (unique, no stock-pool
 * repeats, no hotlinking) — the SEO-correct approach: our own file on our domain.
 *
 * Auth: set GEMINI_API_KEY (free key at https://aistudio.google.com/ → Get API
 * key). Used ONLY by this local skill; never shipped to the browser bundle.
 *
 * Model: defaults to gemini-2.5-flash-image ("Nano Banana"). Override with
 * GEMINI_IMAGE_MODEL if Google changes the name. Docs:
 * https://ai.google.dev/gemini-api/docs/image-generation
 *
 * Subcommands:
 *   generate "<prompt>" <slug> [--n 3] [--out <dir>]
 *       Generates N candidate images and writes them to <dir> as <slug>-<i>.png
 *       so Claude can view + grade them. Prints a JSON summary with the paths.
 *
 *   finalize <sourcePath> <slug> [--max 1600] [--quality 82]
 *       Optimizes the chosen candidate (macOS `sips`: PNG->JPEG, resize long edge
 *       to <=max, quality) and writes it to src/assets/blog/<slug>.jpg. Prints
 *       the import line to wire into blogData.
 */
import { writeFileSync, mkdirSync, copyFileSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..', '..', '..') // .claude/skills/blog-image-generator -> repo root
const ASSET_DIR = join(repoRoot, 'src', 'assets', 'blog')

const API_KEY = process.env.GEMINI_API_KEY
const MODEL = process.env.GEMINI_IMAGE_MODEL || 'gemini-2.5-flash-image'

function parseFlags(args) {
  const flags = {}
  const positional = []
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) { flags[args[i].slice(2)] = args[i + 1]; i++ }
    else positional.push(args[i])
  }
  return { flags, positional }
}

function requireKey() {
  if (!API_KEY) {
    console.error(
      'ERROR: GEMINI_API_KEY is not set. Get a free key at https://aistudio.google.com/ and:\n' +
        '  export GEMINI_API_KEY="AIza...your-key"',
    )
    process.exit(2)
  }
}

// One image generation call. Returns a Buffer of image bytes, or throws with a
// readable message (surfacing safety blocks / quota / bad-model errors).
async function generateOne(prompt) {
  const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:generateContent?key=${API_KEY}`
  const body = {
    contents: [{ role: 'user', parts: [{ text: prompt }] }],
    generationConfig: { responseModalities: ['TEXT', 'IMAGE'] },
  }
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  const json = await res.json().catch(() => ({}))
  if (!res.ok) {
    const msg = json?.error?.message || `${res.status} ${res.statusText}`
    throw new Error(`Gemini API error: ${msg}`)
  }
  const cand = json?.candidates?.[0]
  if (cand?.finishReason === 'SAFETY' || json?.promptFeedback?.blockReason) {
    throw new Error(`Blocked by safety filter (${json?.promptFeedback?.blockReason || 'SAFETY'}). Adjust the prompt.`)
  }
  const parts = cand?.content?.parts || []
  const img = parts.find((p) => p.inlineData?.data)
  if (!img) {
    const text = parts.find((p) => p.text)?.text
    throw new Error(`No image in response${text ? ` (model said: ${text.slice(0, 160)})` : ''}.`)
  }
  return Buffer.from(img.inlineData.data, 'base64')
}

async function cmdGenerate(positional, flags) {
  requireKey()
  const prompt = positional[0]
  const slug = positional[1]
  if (!prompt || !slug) {
    console.error('usage: generate "<prompt>" <slug> [--n 3] [--out <dir>]')
    process.exit(1)
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error(`ERROR: slug "${slug}" must be lowercase-hyphenated (matches the post key).`)
    process.exit(1)
  }
  const n = parseInt(flags.n || '3', 10)
  const outDir = flags.out || join(tmpdir(), 'pulsar-image-gen')
  mkdirSync(outDir, { recursive: true })

  const images = []
  for (let i = 0; i < n; i++) {
    // Vary the prompt slightly per candidate so we get genuine variety, not near-dupes.
    const variant = `${prompt}\n\n(Candidate ${i + 1}: give this one its own distinct composition and angle.)`
    try {
      const buf = await generateOne(variant)
      const path = join(outDir, `${slug}-${i + 1}.png`)
      writeFileSync(path, buf)
      images.push({ candidate: i + 1, path, bytes: buf.length })
    } catch (err) {
      images.push({ candidate: i + 1, error: String(err.message || err) })
    }
  }
  console.log(JSON.stringify({ model: MODEL, slug, outDir, images }, null, 2))
}

function cmdFinalize(positional, flags) {
  const sourcePath = positional[0]
  const slug = positional[1]
  if (!sourcePath || !slug) {
    console.error('usage: finalize <sourcePath> <slug> [--max 1600] [--quality 82]')
    process.exit(1)
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error(`ERROR: slug "${slug}" must be lowercase-hyphenated (matches the post key).`)
    process.exit(1)
  }
  const maxPx = flags.max || '1600'
  const quality = flags.quality || '82'
  mkdirSync(ASSET_DIR, { recursive: true })
  const dest = join(ASSET_DIR, `${slug}.jpg`)

  let optimized = false
  try {
    execFileSync('sips', [
      '-s', 'format', 'jpeg',
      '-Z', String(maxPx),
      '-s', 'formatOptions', String(quality),
      sourcePath,
      '--out', dest,
    ], { stdio: 'ignore' })
    optimized = true
  } catch {
    copyFileSync(sourcePath, dest) // sips unavailable (non-mac) — ship as-is
  }

  console.log(JSON.stringify({
    saved: `src/assets/blog/${slug}.jpg`,
    optimized,
    importLine: `import img${slug.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())} from '../../assets/blog/${slug}.jpg'`,
  }, null, 2))
}

const [cmd, ...rest] = process.argv.slice(2)
const { flags, positional } = parseFlags(rest)
const run = { generate: cmdGenerate, finalize: cmdFinalize }[cmd]
if (!run) {
  console.error('usage: image-gen.mjs <generate|finalize> ...')
  process.exit(1)
}
Promise.resolve(run(positional, flags)).catch((err) => {
  console.error(String(err.message || err))
  process.exit(1)
})
