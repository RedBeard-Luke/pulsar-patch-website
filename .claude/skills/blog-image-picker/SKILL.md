---
name: blog-image-picker
description: Pick a free, commercially-licensed hero/inline image for a chosen Pulsar blog post from Pexels, score it /9, optimize it, and wire it into blogData. Every pick is graded so picker quality trends upward over rounds. Use after a blog post has been selected and needs its image. Manual/on-request until re-enabled.
---

> ⏸ **MANUAL / ON-REQUEST ONLY.** This is designed to slot into the daily flow
> *after* the generator's winning post is chosen, but it does NOT run
> automatically and is not scheduled. Run it only when asked. It STAGES the
> result (never commits) so the human reviews the actual photo before pushing.

# Pulsar Blog Image Picker

Given a chosen blog post, find the right hero image from **Pexels** (free for
commercial use, no attribution required, modification allowed —
https://www.pexels.com/license/), optimize it, save it locally, and wire it into
`src/pages/Blog/blogData.js`. One landscape image serves both render targets: the
full-width hero under the wavy border ([BlogPost.jsx](../../../src/pages/Blog/BlogPost.jsx))
and the 4:3 listing thumbnail ([Blog.jsx](../../../src/pages/Blog/Blog.jsx), which
looks up `heroImg` from blogData by id).

## Prerequisites
- `PEXELS_API_KEY` set in the environment (free key at https://www.pexels.com/api/).
  If it's missing, the tool errors with instructions — stop and tell the user to
  set it, don't try another source.

## Inputs
- The **post slug** (the `blogData.js` key, e.g. `zero-proof-spritz`), and
- The post's content — read it from `blogData.js` (or the generated `.md` if the
  post isn't in blogData yet) to understand the subject.

## Steps

1. **Pick the image subject — follow this BINARY rule in order. Do NOT invent a
   scene from scratch.**

   **a. Is there a concrete, nameable thing in the TITLE** — a specific food,
   drink, object, or place? → **Use it.** Get a starting query from `suggest`,
   then refine to the real noun (`margarita` → `margarita cocktail` to dodge the
   Margherita-pizza homonym; "Fasted Old Fashioned For After Work" → `old
   fashioned cocktail`). This covers most RECIPES. Stop here — don't freelance.
   ```
   node .claude/skills/blog-image-picker/image-tool.mjs suggest "<blog title>"
   ```

   **b. No concrete thing in the title?** Then the post is about a FEELING (e.g.
   "Hangovers Aren't Inevitable", "Weekend Plans, Monday Energy"). You MUST pick
   **exactly one row** from the **Feeling Library** below and use its query
   verbatim — do not make up your own scene. Choose the single row whose "Use for"
   best matches the post's core beat. **When unsure, or for any hangover-recovery
   / "feel better" / most SCIENCE posts, use the DEFAULT row ("Fresh
   morning-after").** This is the rule that removes the guesswork.

   ### Feeling Library — closed list; pick ONE, use its query verbatim
   | Feeling / beat | Use for | Query | People |
   |---|---|---|---|
   | **Fresh morning-after** *(DEFAULT)* | recovery, "feel better", waking up clear, most SCIENCE | `sunny bedroom morning light window` | no-people |
   | Hydration / reset | water, cleansing, health basics | `glass of water fresh sunlight table` | no-people |
   | Cozy slow morning | rest, slowing down, easy weekend | `cozy morning coffee sunlight window` | no-people |
   | Focus / fresh start | Monday, energy, planning, productivity | `bright tidy desk morning sunlight` | no-people |
   | Active / outdoors | movement, hikes, fresh air | `sunny morning hike trail nature` | no-people |
   | Night out / social | celebration, going out, friends | `friends celebrating rooftop evening` | people OK |

   The Library's "People" column decides step 2 for feeling-based picks (add rows
   here as the blog grows — but keep it a fixed list, never freeform).

2. **Decide people vs no-people by category.**
   - **RECIPES / any food & drink post → no people.** Pass `--no-people`. The
     Pexels API has no people filter, so the tool drops photos whose description
     implies people (hands, person, etc.) — you still confirm visually in step 4.
   - **LIFESTYLE → people are fine** (often wanted). Omit `--no-people`.
   - **SCIENCE → clean/bright lifestyle or object shots**, NOT clinical/medical
     stock. Usually `--no-people` too.

3. **Search + preview.** Horizontal is the default. Example for a recipe:
   ```
   node .claude/skills/blog-image-picker/image-tool.mjs search "margarita cocktail" --no-people
   ```
   **Dedup is automatic** — the tool keeps a ledger (`used-pexels-ids.json`) of
   every photo already saved and excludes them, and `save` appends to it. So no
   photo is ever picked twice; you don't pass anything. (`--exclude-ids id,id`
   still exists for one-offs; `--no-dedup` bypasses the ledger if ever needed.)
   The tool prints candidates (id, `alt`, `likelyPeople`, `previewPath`) and
   downloads preview thumbnails; `droppedDup` shows how many the ledger skipped.
   **Read the previewPath images and actually LOOK** — don't judge on alt alone.

4. **Shortlist the top 3 candidates — apply the guardrails. Drop a candidate if it:**
   - **shows people** (any person, face, or hands) on a food/drink post,
   - **doesn't match the title's subject** (wrong drink/food/thing),
   - isn't **horizontal**, or is too vertical to crop to a wide hero,
   - shows an identifiable **brand/logo** or real **alcohol-brand label** (hero only),
   - reads **clinical/medical**, or is **text-heavy / watermarked / low-res**.
   Don't hand-pick one winner here — pick the **3 strongest** to take to scoring.
   Prefer bright, clean, natural-light shots, but include some variety (e.g. one
   moodier, one brighter) so the score has a real choice. If fewer than 3 clear
   the bar, run another query (a close synonym) rather than settling.

4b. **Grade the slate of 3, then let the tool pick the winner (/27).** This is the
   generate-N-and-keep-the-best pattern: each candidate is graded /9, the blog's
   slate totals /27, and the highest /9 is the one you actually use. The 3
   deterministic criteria are already in `search` output (`det`/`detScore`); you
   supply the 6 vision criteria as `1`/`0` after **looking at each preview**:
   ```
   # grade all 3 candidates under the SAME --slug. --category drives the light rule;
   # --has-people is your vision verdict (0 = no people visible).
   node .claude/skills/blog-image-picker/image-tool.mjs grade <id1> --slug <slug> --category cocktail --has-people 0 --subject 1 --light 1 --color 1 --nobrand 1 --clean 1 --small 1
   node .claude/skills/blog-image-picker/image-tool.mjs grade <id2> --slug <slug> --category cocktail --has-people 0 --subject 0 --light 1 --color 1 --nobrand 1 --clean 1 --small 1
   node .claude/skills/blog-image-picker/image-tool.mjs grade <id3> --slug <slug> --category cocktail --has-people 0 --subject 1 --light 1 --color 1 --nobrand 1 --clean 1 --small 1
   # then select the winner of the slate
   node .claude/skills/blog-image-picker/image-tool.mjs select <slug>
   ```
   `--category` (`recipe|cocktail|science|lifestyle`) sets the `light` standard
   (moody OK for cocktail/night-out). `--has-people 0|1` is required (vision-confirmed
   peopleOK) unless `--people-ok` (lifestyle, people allowed). `--inline` exempts
   `nobrand` (brands OK on inline). `grade` logs to `eval/image-scores.json`;
   `select` prints the `poolScore` /27, ranks the 3, and names the `winner` +
   `nextStep` (the exact `save` line). Tie-break: more vision passes, then more
   deterministic passes. See **Scoring & the self-improving loop** below.

5. **Save + optimize the WINNER only.** With the `select` winner's `id`:
   ```
   node .claude/skills/blog-image-picker/image-tool.mjs save <photoId> <slug>
   ```
   Writes `src/assets/blog/<slug>.jpg` (capped at 1600px wide, JPEG q80 via `sips`)
   and prints the credit block + the exact `importLine` to use.

6. **Wire it into blogData.js.**
   - Add the printed `importLine` with the other blog image imports at the top.
   - On the post's entry set `heroImg: img<Slug>` and add a descriptive,
     keyword-aware `heroAlt` (satisfies SEO rule S18 — e.g. `heroAlt: 'A grapefruit
     spritz mocktail in a wine glass with a rosemary sprig'`).
   - Also record the credit for our files: `heroImgCredit: { photographer: '...',
     url: '<pexels_url>' }` (not displayed on the site; Pexels doesn't require
     attribution, but we keep the record).

7. **Verify + report. Do NOT commit.**
   - Run `npm run build` to confirm the import resolves and the site builds.
   - Report: which photo was chosen and why, the credit + license line, the file
     saved, and that it's **staged for the user to review the actual image and
     push**. Remind them the picture is the most visible thing — eyeball it before
     it goes live.

## Second / inline body images
Posts can have inline image blocks inside `content` (`{ type: 'image', img,
source, alt }`), sitting under a subhead. Same flow as the hero, with these
differences:
- **Subject = the SUBHEAD it sits under (+ nearby text), NOT the post title.**
  Read the section the block falls in and pick a concrete subject that
  illustrates THAT section. It should also be a *different angle* from the hero,
  so the post isn't two near-identical shots. E.g. Old Fashioned post: hero = the
  finished drink → inline under "THE RECIPE" = a **bottle of whiskey** or the
  ingredients/pour.
- **No repeats — automatic.** The dedup ledger already excludes the hero and every
  other used photo, so a normal `search` can never return them. Use a *different
  query* than the hero to guarantee a different look, not just a different ID.
- **Brand labels are OK on inline images** (unlike the hero). A whiskey bottle with
  a visible brand is fine here. Still avoid people (unless the section calls for
  it), text overlays/watermarks, and low-res.
- **Filename:** save with a descriptive slug that won't collide with the hero:
  `save <id> <slug>-whiskey` → `src/assets/blog/<slug>-whiskey.jpg`.
- **Wire into the CONTENT BLOCK, not the hero:** set that image block's `img` to
  the new import, and give it an `alt` describing the photo (for SEO — the renderer
  uses `block.alt`). Update/keep its `source` caption if you want one.

## Scoring & the self-improving loop
Every picked image is scored **/9** so picker quality is a number we can trend
upward over time — the same idea as the post generator's score, applied to images.
The score also means a pick is defensible ("8/9, only missed `light`") instead of
a gut call.

**Per blog we grade a SLATE of 3 candidates (/27) and use the best.** Like the
generator makes ~10 posts and keeps the best one, the picker grades 3 images per
blog and `select` keeps the top-scoring /9. The /27 is the slate total; only the
winner is saved + wired in. This raises the floor: a single lucky-or-unlucky pick
becomes best-of-3.

**The 9 criteria (each binary):**

*Deterministic — computed free in the tool from Pexels metadata:*
1. `horizontal` — width > height (croppable to a wide hero)
2. `hiRes` — source ≥ 1600px wide (no upscale blur)
3. `peopleOK` — **vision-confirmed** no people when the category requires it. The
   alt-text heuristic (shown as `likelyPeople` in `search`) is only a pre-filter;
   at `grade` time you must LOOK and pass `--has-people 0|1` (or `--people-ok` for
   lifestyle where people are fine). *Fix #2: a faint background silhouette once
   slipped past the alt heuristic — pixels are the source of truth now.*

*Vision — you grade these by looking at the actual preview (`1`/`0` flags on `grade`):*
4. `subject` — clearly shows ONE unambiguous title/subhead subject (a busy or
   mixed composition, e.g. two different drinks, fails)
5. `light` — **category-aware.** Bright, natural, clean light is required for
   `recipe`/`science`/`lifestyle`/morning/recovery posts. For `cocktail`/`night-out`
   posts, warm/moody light passes (as long as it's not murky/underexposed) because
   that fits the cocktail community. Pass `--category` so this is applied + audited.
   *Fix #1: `light` used to punish on-brand moody cocktail shots.*
6. `color` — cohesive, doesn't clash with Pulsar blue/pink
7. `nobrand` — no brand/logo *(hero only; `--inline` auto-passes it)*
8. `clean` — not clinical / text-heavy / watermarked
9. `small` — subject legible at thumbnail + OG size

**The loop — what actually gets better.** There's no prompt to rewrite here; the
thing being optimized is **this file's rules** (the query-derivation binary rule,
the Feeling Library, and the guardrails). The cycle:
1. Pick + `grade` images (during normal use, and/or run the `eval/eval-set.json`
   posts with `--eval` so eval grades don't touch the real ledger).
2. Close a round: `node image-tool.mjs round --label R2 --note "what I changed"`.
   It assigns every un-rounded score to the round, prints `avgScore`, `avgPct`,
   per-criterion pass-rates, and the **`weakest`** criterion, and appends to
   `eval/rounds.json`.
3. **Make ONE rule change that attacks the weakest criterion**, then grade the
   next batch and close another round. Keep the version of this file whose round
   scores are higher. Trend `avgPct` up round over round (chart: `eval/growth.html`).

**Reading the weakest criterion — don't over-correct.** A low pass-rate is a
signal, not always a defect. Baseline R1's weakest was `light` (50%), but it only
failed on **dark cocktail shots**, which fit the cocktail community (Luke's call).
So the right rule change there isn't "force bright cocktail photos" — it's to make
`light` **category-aware** (bright expected for morning/recovery/lifestyle; moody
allowed for cocktail/night-out). That kind of edit is exactly the loop working.

**Levers the loop can pull** (rule changes, in rough order of reach): tighten a
query or add a Feeling Library row; add **query-variant rotation + pagination** so
repeat topics don't return the same tired shots as the pool thins; make a criterion
category-aware; adjust a guardrail threshold. One change per round so you can see
which move helped.

## Notes
- One source only (Pexels) for a clean, uniform license. If Pexels genuinely has
  nothing usable after a few queries, say so and stop — don't silently reach for a
  source with murkier licensing.
- The generated hero image also becomes the social-share (Open Graph) image via
  `blogSeo.js`, so it carries extra weight — pick something that reads well small.
