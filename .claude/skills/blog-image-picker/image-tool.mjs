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

// ── Scoring (the self-improving loop) ──────────────────────────────────────
// Every picked image gets a score /9 so we can trend picker quality upward, the
// same way Stage 3 scores posts. 3 deterministic criteria (computed here, free)
// + 6 vision criteria (graded by Claude looking at the actual pixels, recorded
// via the `grade` command). `round` aggregates the log and names the weakest
// criterion — that's the rule to improve next.
const EVAL_DIR = join(__dirname, 'eval')
const SCORES = join(EVAL_DIR, 'image-scores.json')
const ROUNDS = join(EVAL_DIR, 'rounds.json')
const RUBRIC = {
  det: ['horizontal', 'hiRes', 'peopleOK'], // computed from Pexels metadata
  vision: ['subject', 'light', 'color', 'nobrand', 'clean', 'small'], // graded by eye
}
const MAX_SCORE = RUBRIC.det.length + RUBRIC.vision.length // 9
function loadJsonArray(path) {
  try { return JSON.parse(readFileSync(path, 'utf8')) || [] } catch { return [] }
}
function writeJsonArray(path, arr) {
  mkdirSync(EVAL_DIR, { recursive: true })
  writeFileSync(path, JSON.stringify(arr, null, 2) + '\n')
}
// The 3 deterministic criteria, straight off the photo's metadata.
function detFlags(p, noPeople) {
  const horizontal = p.width > p.height
  const hiRes = p.width >= 1600
  const peopleOK = noPeople ? !hasPeople(p.alt) : true // people allowed -> auto-pass
  const passed = [horizontal, hiRes, peopleOK].filter(Boolean).length
  return { horizontal, hiRes, peopleOK, passed }
}
function truthy(v) {
  if (v === true) return true
  return ['1', 'true', 'y', 'yes', 'pass'].includes(String(v).toLowerCase())
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
  // Keep only a specific photographer/studio (substring match on name + profile
  // URL). Used to pull Google DeepMind's abstract science renders for heavy-science
  // posts: `--photographer "Google DeepMind"` (or `--photographer deepmind`).
  const photographer = flags.photographer ? String(flags.photographer).toLowerCase() : ''
  // Fetch extra when filtering so we still end up with enough candidates.
  const per = flags.per || (photographer ? '80' : noPeople ? '50' : '30')
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
  let droppedPhotographer = 0
  const filtered = returned.filter((p) => {
    if (excludeIds.has(String(p.id))) { droppedDup++; return false }
    if (photographer && !(`${p.photographer || ''} ${p.photographer_url || ''}`.toLowerCase().includes(photographer))) { droppedPhotographer++; return false }
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
    const det = detFlags(p, noPeople)
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
      det, // 3 deterministic criteria (free); vision 6 come from `grade`
      detScore: `${det.passed}/3`,
      previewPath,
    })
  }
  console.log(
    JSON.stringify(
      { query, orientation, noPeople, photographer: photographer || undefined, returned: returned.length, droppedPeople, droppedDup, droppedPhotographer, kept: candidates.length, previewDir: outDir, candidates },
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

// Record the full /9 score for a chosen image. The 3 deterministic criteria are
// recomputed from Pexels metadata; the 6 vision criteria are passed as 1/0 flags
// by Claude after actually looking at the preview. For inline images --inline
// exempts `nobrand` (brand labels are allowed there), so it auto-passes.
//   grade <photoId> --slug <slug> [--hero|--inline] [--people-ok] [--eval] \
//     --subject 1 --light 1 --color 1 --nobrand 1 --clean 1 --small 1 [--note "..."]
async function cmdGrade(positional, flags) {
  requireKey()
  const photoId = positional[0]
  const slug = flags.slug || positional[1]
  if (!photoId || !slug) {
    console.error('usage: grade <photoId> --slug <slug> --category <recipe|cocktail|science|lifestyle> --has-people 0|1 [--inline] [--people-ok] [--eval] --subject 1 --light 1 --color 1 --nobrand 1 --clean 1 --small 1')
    process.exit(1)
  }
  const target = flags.inline === true ? 'inline' : 'hero'
  const peopleAllowed = flags['people-ok'] === true // lifestyle: people are fine
  // Fix #1: `light` is graded CATEGORY-AWARE. Bright is required for morning/
  // recovery/lifestyle/science; warm/moody is acceptable for cocktail/night-out
  // (as long as it's not murky/underexposed). Category is recorded so we can audit
  // the light pass-rate per category. See SKILL.md "Scoring & the self-improving loop".
  const category = String(flags.category || '').toLowerCase()
  // `light` standard by category: cocktail/night-out accept warm/moody; the
  // DeepMind abstract-science renders (science-abstract) are often dark but vivid,
  // so they're judged on "vivid + clean + well-exposed", not daylight brightness.
  let lightRule = 'bright-required'
  if (category === 'cocktail' || category === 'night-out') lightRule = 'moody-ok'
  else if (category === 'science-abstract') lightRule = 'vivid-ok'
  if (!category) {
    console.error('ERROR: pass --category <recipe|cocktail|science|science-abstract|lifestyle>. `light` is graded category-aware (moody OK for cocktail; vivid-dark OK for science-abstract/DeepMind).')
    process.exit(1)
  }

  const p = await pexels(`photos/${photoId}`)
  const horizontal = p.width > p.height
  const hiRes = p.width >= 1600
  // Fix #2: peopleOK is VISION-confirmed, not guessed from alt text. The alt
  // heuristic false-passed a faint background silhouette (37662777), so the grader
  // must LOOK and pass --has-people 0|1. Only --people-ok (people allowed) skips it.
  let peopleOK, peopleSource
  if (peopleAllowed) {
    peopleOK = true; peopleSource = 'allowed'
  } else if (flags['has-people'] !== undefined) {
    peopleOK = !truthy(flags['has-people']); peopleSource = 'vision'
  } else {
    console.error('ERROR: peopleOK is vision-confirmed now — LOOK at the image and pass --has-people 0|1 (or --people-ok for lifestyle posts where people are fine).')
    process.exit(1)
  }
  const det = { horizontal, hiRes, peopleOK }
  const detPassed = [horizontal, hiRes, peopleOK].filter(Boolean).length

  const vision = {}
  for (const k of RUBRIC.vision) {
    if (k === 'nobrand' && target === 'inline') { vision[k] = true; continue } // brands OK inline
    if (flags[k] === undefined) {
      console.error(`ERROR: missing --${k} (pass 1 or 0). All 6 vision criteria must be graded: ${RUBRIC.vision.join(', ')}`)
      process.exit(1)
    }
    vision[k] = truthy(flags[k])
  }
  const visionPassed = RUBRIC.vision.filter((k) => vision[k]).length
  const score = detPassed + visionPassed

  const record = {
    ts: new Date().toISOString(),
    id: String(photoId),
    slug,
    target,
    category,
    lightRule,
    peopleSource,
    isEval: flags.eval === true,
    det,
    vision,
    score,
    max: MAX_SCORE,
    round: null,
    note: flags.note || '',
  }
  const scores = loadJsonArray(SCORES)
  scores.push(record)
  writeJsonArray(SCORES, scores)

  const failed = [
    ...RUBRIC.det.filter((k) => !det[k]),
    ...RUBRIC.vision.filter((k) => !vision[k] && !(k === 'nobrand' && target === 'inline')),
  ]
  console.log(JSON.stringify({ ...record, scoreLabel: `${score}/${MAX_SCORE}`, failed, loggedTo: 'eval/image-scores.json' }, null, 2))
}

// Pick the winner of a candidate slate. Grade 3 (or more) candidates for the same
// --slug, then `select <slug>` reports the pool score /(9*N), ranks them, and marks
// the highest /9 as the one to actually use. Ties break on vision passes, then
// deterministic passes. Only the winner should be saved + wired in.
//   select <slug> [--use]
function candRank(a, b) {
  if (b.score !== a.score) return b.score - a.score
  const vp = (r) => Object.values(r.vision).filter(Boolean).length
  if (vp(b) !== vp(a)) return vp(b) - vp(a)
  const dp = (r) => Object.values(r.det).filter(Boolean).length
  return dp(b) - dp(a)
}
function cmdSelect(positional, flags) {
  const slug = positional[0] || flags.slug
  if (!slug) { console.error('usage: select <slug> [--use]'); process.exit(1) }
  const scores = loadJsonArray(SCORES)
  const cands = scores.filter((s) => !s.round && s.slug === slug && s.winner === undefined)
  if (cands.length < 2) {
    console.error(`ERROR: need >=2 graded candidates for "${slug}" (found ${cands.length}). Grade the slate first, then select.`)
    process.exit(1)
  }
  const ranked = [...cands].sort(candRank)
  const winner = ranked[0]
  cands.forEach((c) => { c.winner = c === winner })
  writeJsonArray(SCORES, scores)

  const poolScore = cands.reduce((a, c) => a + c.score, 0)
  const poolMax = cands.length * MAX_SCORE
  const runnerUp = ranked[1]
  console.log(JSON.stringify({
    slug,
    candidates: ranked.map((c) => ({ id: c.id, score: `${c.score}/${MAX_SCORE}`, failed: [
      ...RUBRIC.det.filter((k) => !c.det[k]),
      ...RUBRIC.vision.filter((k) => !c.vision[k] && !(k === 'nobrand' && c.target === 'inline')),
    ] })),
    poolScore: `${poolScore}/${poolMax}`,
    winner: { id: winner.id, score: `${winner.score}/${MAX_SCORE}` },
    gap: runnerUp ? winner.score - runnerUp.score : null,
    nextStep: `save ${winner.id} ${slug}`,
  }, null, 2))
}

// Close a round: assign every un-rounded score to this round, summarize, and
// name the weakest criterion (lowest pass-rate) — that's the rule to improve
// before the next round. Append to eval/rounds.json for the growth chart.
//   round [--label R2] [--note "what rule I changed this round"]
function cmdRound(positional, flags) {
  const scores = loadJsonArray(SCORES)
  const rounds = loadJsonArray(ROUNDS)
  const pending = scores.filter((s) => !s.round)
  if (!pending.length) {
    console.error('No un-rounded scores. Grade some images first, then close the round.')
    process.exit(1)
  }
  const label = flags.label || positional[0] || `R${rounds.length + 1}`
  pending.forEach((s) => { s.round = label })
  writeJsonArray(SCORES, scores)

  // The round metric measures the images we ACTUALLY use: slate winners
  // (winner === true) plus any solo picks that never went through select
  // (winner === undefined). Losing candidates (winner === false) are archived
  // but excluded from the average, so a bad candidate you rejected can't drag
  // the score of what shipped.
  const used = pending.filter((s) => s.winner !== false)
  const losers = pending.filter((s) => s.winner === false)
  const n = used.length
  const totalScore = used.reduce((a, s) => a + s.score, 0)
  const avgScore = n ? totalScore / n : 0
  // Per-criterion pass-rate over used images (nobrand skips inline).
  const perCriterion = {}
  for (const k of [...RUBRIC.det, ...RUBRIC.vision]) {
    let pass = 0, total = 0
    for (const s of used) {
      if (k === 'nobrand' && s.target === 'inline') continue
      const val = RUBRIC.det.includes(k) ? s.det[k] : s.vision[k]
      total++
      if (val) pass++
    }
    perCriterion[k] = { pass, total, rate: total ? +(pass / total).toFixed(3) : null }
  }
  const ranked = Object.entries(perCriterion).filter(([, v]) => v.total > 0).sort((a, b) => a[1].rate - b[1].rate)
  const weakest = ranked.length ? ranked[0][0] : null

  const summary = {
    label,
    ts: new Date().toISOString(),
    n,
    candidatesGraded: pending.length,
    losersRejected: losers.length,
    avgScore: +avgScore.toFixed(2),
    avgPct: +((avgScore / MAX_SCORE) * 100).toFixed(1),
    perCriterion,
    weakest,
    note: flags.note || '',
  }
  rounds.push(summary)
  writeJsonArray(ROUNDS, rounds)
  console.log(JSON.stringify({ ...summary, improveNext: weakest, historyTo: 'eval/rounds.json' }, null, 2))
}

const [cmd, ...rest] = process.argv.slice(2)
const { flags, positional } = parseFlags(rest)

const run = { suggest: cmdSuggest, search: cmdSearch, save: cmdSave, grade: cmdGrade, select: cmdSelect, round: cmdRound }[cmd]
if (!run) {
  console.error('usage: image-tool.mjs <suggest|search|grade|select|round|save> ...')
  process.exit(1)
}
Promise.resolve(run(positional, flags)).catch((err) => {
  console.error(String(err.message || err))
  process.exit(1)
})
