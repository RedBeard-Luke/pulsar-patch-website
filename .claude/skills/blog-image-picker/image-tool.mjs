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
import { writeFileSync, readFileSync, mkdirSync, rmSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'
import { tmpdir } from 'node:os'
import { execFileSync } from 'node:child_process'

const __dirname = dirname(fileURLToPath(import.meta.url))
const repoRoot = join(__dirname, '..', '..', '..') // .claude/skills/blog-image-picker -> repo root
const ASSET_DIR = join(repoRoot, 'src', 'assets', 'blog')

// Persistent ledger of Pexels photo ids already used on the site, so no photo is
// ever picked twice. `search` auto-excludes these; `save` auto-appends. Lives
// with the skill so it travels with the repo.
const LEDGER = join(__dirname, 'used-pexels-ids.json')
function loadLedger() {
  try { return new Set((JSON.parse(readFileSync(LEDGER, 'utf8')) || []).map(String)) }
  catch { return new Set() }
}
function recordUsed(id) {
  const s = loadLedger()
  s.add(String(id))
  writeFileSync(LEDGER, JSON.stringify([...s], null, 0) + '\n')
}

const API_KEY = process.env.PEXELS_API_KEY
// Only the Pexels-hitting commands need the key; `suggest` doesn't.
function requireKey() {
  if (!API_KEY) {
    console.error(
      'ERROR: PEXELS_API_KEY is not set. Get a free key at https://www.pexels.com/api/ and:\n' +
        '  export PEXELS_API_KEY="your-key"',
    )
    process.exit(2)
  }
}

function parseFlags(args) {
  const flags = {}
  const positional = []
  for (let i = 0; i < args.length; i++) {
    if (args[i].startsWith('--')) {
      const key = args[i].slice(2)
      const next = args[i + 1]
      // Boolean flag when nothing (or another flag) follows it.
      if (next === undefined || next.startsWith('--')) {
        flags[key] = true
      } else {
        flags[key] = next
        i++
      }
    } else positional.push(args[i])
  }
  return { flags, positional }
}

// ── Title -> Pexels query. Strip filler so "Best Low Calorie Margarita" -> "margarita".
const STOP_WORDS = new Set(
  'best low calorie calories healthy easy quick simple homemade the a an for your you with and or vs versus how why what when where who guide guides ultimate perfect delicious amazing favorite favourite my our of to in on off night day minute minutes ingredient ingredients no non without make making tips ideas at is are it that this recipe recipes do does did even ever really actually happen happens happening still more most than then here there about'
    .split(' '),
)
function titleToQuery(title) {
  const words = String(title || '')
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, ' ')
    .split(/\s+/)
    .filter((w) => w && !STOP_WORDS.has(w) && !/^\d+$/.test(w))
  return words.join(' ').trim() || String(title || '').trim()
}

// ── People heuristic (Pexels API has no people filter, so we read the alt text).
const PEOPLE_RE =
  /\b(persons?|people|man|men|woman|women|girls?|boys?|guys?|lady|ladies|gentlem[ae]n|humans?|child(ren)?|kids?|baby|babies|family|families|couples?|friends?|crowd|models?|portrait|faces?|hands?|holding|holds|arms?|fingers?|selfie|bartenders?|waiters?|waitress|chef|barista|drinking|cheers|toasting|smiling|sitting|standing|wearing)\b/i
function hasPeople(alt) {
  return PEOPLE_RE.test(String(alt || ''))
}

function cmdSuggest(positional) {
  const title = positional[0]
  if (!title) { console.error('usage: suggest "<blog title>"'); process.exit(1) }
  console.log(JSON.stringify({ title, suggestedQuery: titleToQuery(title) }, null, 2))
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
  requireKey()
  // Query may be given directly, or derived from a blog title via --title.
  const query = positional[0] || (flags.title ? titleToQuery(flags.title) : '')
  if (!query) {
    console.error('usage: search "<query>" [--title "<blog title>"] [--no-people] [--orientation landscape] [--per 30] [--max-previews 8] [--exclude-ids id,id] [--out <dir>]')
    process.exit(1)
  }
  const orientation = flags.orientation || 'landscape' // horizontal
  const noPeople = flags['no-people'] === true
  // Fetch extra when filtering so we still end up with enough candidates.
  const per = flags.per || (noPeople ? '50' : '30')
  const maxPreviews = parseInt(flags['max-previews'] || '8', 10)
  // Auto-dedup: exclude everything already used (the ledger) plus any explicit
  // --exclude-ids. Pass --no-dedup to ignore the ledger (rarely needed).
  const ledger = flags['no-dedup'] === true ? new Set() : loadLedger()
  const excludeIds = new Set([
    ...ledger,
    ...String(flags['exclude-ids'] || '').split(',').map((s) => s.trim()).filter(Boolean),
  ])
  const outDir = flags.out || join(tmpdir(), 'pulsar-image-picker')
  mkdirSync(outDir, { recursive: true })

  const data = await pexels(
    `search?query=${encodeURIComponent(query)}&orientation=${orientation}&per_page=${per}&size=large`,
  )
  const returned = data.photos || []
  let droppedPeople = 0
  let droppedDup = 0
  const filtered = returned.filter((p) => {
    if (excludeIds.has(String(p.id))) { droppedDup++; return false }
    if (noPeople && hasPeople(p.alt)) { droppedPeople++; return false }
    return true
  })

  const candidates = []
  for (let i = 0; i < filtered.length && candidates.length < maxPreviews; i++) {
    const p = filtered[i]
    const previewPath = join(outDir, `${p.id}.jpg`)
    try {
      await download(p.src.medium || p.src.small || p.src.tiny, previewPath)
    } catch {
      continue
    }
    candidates.push({
      id: p.id,
      photographer: p.photographer,
      photographer_url: p.photographer_url,
      pexels_url: p.url,
      alt: p.alt || '',
      likelyPeople: hasPeople(p.alt), // should be false when --no-people; a heads-up otherwise
      width: p.width,
      height: p.height,
      avg_color: p.avg_color,
      previewPath,
    })
  }
  console.log(
    JSON.stringify(
      { query, orientation, noPeople, returned: returned.length, droppedPeople, droppedDup, kept: candidates.length, previewDir: outDir, candidates },
      null,
      2,
    ),
  )
}

async function cmdSave(positional, flags) {
  requireKey()
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

  // Record so this photo is never picked again (auto-dedup on future searches).
  recordUsed(photoId)

  console.log(
    JSON.stringify(
      {
        saved: `src/assets/blog/${slug}.jpg`,
        optimized,
        recordedToLedger: String(photoId),
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

const run = { suggest: cmdSuggest, search: cmdSearch, save: cmdSave }[cmd]
if (!run) {
  console.error('usage: image-tool.mjs <suggest|search|save> ...')
  process.exit(1)
}
Promise.resolve(run(positional, flags)).catch((err) => {
  console.error(String(err.message || err))
  process.exit(1)
})
