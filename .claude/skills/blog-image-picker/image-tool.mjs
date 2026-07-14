#!/usr/bin/env node
/**
 * Pexels image tool for the blog-image-picker skill.
 *
 * Pexels license: free for commercial use, no attribution required, modification
 * allowed. We still record the photographer + source URL for our own records.
 * https://www.pexels.com/license/
 *
 * Auth: set PEXELS_API_KEY in your environment (free key at
 * https://www.pexels.com/api/). The key is used ONLY by this local skill — it
 * never ships to the browser bundle.
 *
 * Subcommands:
 *   search "<query>" [--orientation landscape] [--per 15] [--out <dir>]
 *       Queries Pexels and downloads small PREVIEW thumbnails to <dir> so Claude
 *       can visually compare candidates. Prints a JSON summary (index, id,
 *       photographer, alt, size, previewPath).
 *
 *   save <photoId> <slug> [--max 1600] [--quality 80]
 *       Downloads the chosen photo full-res, optimizes it (macOS `sips`: resize
 *       to <=max px wide, re-encode JPEG at quality), and writes it to
 *       src/assets/blog/<slug>.jpg. Prints the credit block to record.
 */
import { writeFileSync, mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..', '..', '..') // .claude/skills/blog-image-picker -> repo root
const ASSET_DIR = join(repoRoot, 'src', 'assets', 'blog')

const API_KEY = process.env.PEXELS_API_KEY
if (!API_KEY) {
  console.error(
    'ERROR: PEXELS_API_KEY is not set. Get a free key at https://www.pexels.com/api/ and:\n' +
      '  export PEXELS_API_KEY="your-key"',
  )
  process.exit(2)
}

function parseFlags(args) {
  const flags = {}
  const positional = []
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      flags[args[i].slice(2)] = args[i + 1]
      i++
    } else positional.push(args[i])
  }
  return { flags, positional }
}

async function pexels(path) {
  const res = await fetch(`https://api.pexels.com/v1/${path}`, {
    headers: { Authorization: API_KEY },
  })
  if (!res.ok) {
    throw new Error(`Pexels API ${res.status} ${res.statusText} for ${path}`)
  }
  return res.json()
}

async function download(url, dest) {
  const res = await fetch(url)
  if (!res.ok) throw new Error(`download failed ${res.status} for ${url}`)
  const buf = Buffer.from(await res.arrayBuffer())
  writeFileSync(dest, buf)
  return buf.length
}

async function cmdSearch(positional, flags) {
  const query = positional[0]
  if (!query) {
    console.error('usage: search "<query>" [--orientation landscape] [--per 15] [--out <dir>]')
    process.exit(1)
  }
  const orientation = flags.orientation || 'landscape'
  const per = flags.per || '15'
  const outDir = flags.out || join(tmpdir(), 'pulsar-image-picker')
  mkdirSync(outDir, { recursive: true })

  const data = await pexels(
    `search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${per}&size=large`,
  )
  const photos = data.photos || []
  const candidates = []
  for (let i = 0; i < photos.length; i++) {
    const p = photos[i]
    const previewPath = join(outDir, `${i}-${p.id}.jpg`)
    try {
      await download(p.src.medium || p.src.small || p.src.tiny, previewPath)
    } catch {
      continue
    }
    candidates.push({
      index: i,
      id: p.id,
      photographer: p.photographer,
      photographer_url: p.photographer_url,
      pexels_url: p.url,
      alt: p.alt || '',
      width: p.width,
      height: p.height,
      avg_color: p.avg_color,
      previewPath,
    })
  }
  console.log(
    JSON.stringify({ query, orientation, count: candidates.length, previewDir: outDir, candidates }, null, 2),
  )
}

async function cmdSave(positional, flags) {
  const photoId = positional[0]
  const slug = positional[1]
  if (!photoId || !slug) {
    console.error('usage: save <photoId> <slug> [--max 1600] [--quality 80]')
    process.exit(1)
  }
  if (!/^[a-z0-9-]+$/.test(slug)) {
    console.error(`ERROR: slug "${slug}" must be lowercase-hyphenated (matches the post key).`)
    process.exit(1)
  }
  const maxPx = flags.max || '1600'
  const quality = flags.quality || '80'

  const p = await pexels(`photos/${photoId}`)
  const sourceUrl = p.src.large2x || p.src.original || p.src.large
  mkdirSync(ASSET_DIR, { recursive: true })

  const tmpFile = join(tmpdir(), `pulsar-${slug}-orig.jpg`)
  const bytes = await download(sourceUrl, tmpFile)
  const dest = join(ASSET_DIR, `${slug}.jpg`)

  // Optimize with macOS sips: cap the long edge and re-encode JPEG. If sips
  // isn't available (non-mac), fall back to the downloaded file as-is.
  let optimized = false
  try {
    execFileSync('sips', [
      '-Z', String(maxPx),
      '-s', 'format', 'jpeg',
      '-s', 'formatOptions', String(quality),
      tmpFile,
      '--out', dest,
    ], { stdio: 'ignore' })
    optimized = true
  } catch {
    writeFileSync(dest, Buffer.from(await (await fetch(sourceUrl)).arrayBuffer()))
  }
  try { rmSync(tmpFile, { force: true }) } catch { /* ignore */ }

  console.log(
    JSON.stringify(
      {
        saved: `src/assets/blog/${slug}.jpg`,
        optimized,
        downloadedBytes: bytes,
        credit: {
          photographer: p.photographer,
          photographer_url: p.photographer_url,
          pexels_url: p.url,
          license: 'Pexels License — free for commercial use, no attribution required',
        },
        importLine: `import img${slug.replace(/(^|-)([a-z0-9])/g, (_, __, c) => c.toUpperCase())} from '../../assets/blog/${slug}.jpg'`,
      },
      null,
      2,
    ),
  )
}

const [cmd, ...rest] = process.argv.slice(2)
const { flags, positional } = parseFlags(rest)

const run = { search: cmdSearch, save: cmdSave }[cmd]
if (!run) {
  console.error('usage: image-tool.mjs <search|save> ...')
  process.exit(1)
}
run(positional, flags).catch((err) => {
  console.error(String(err.message || err))
  process.exit(1)
})
