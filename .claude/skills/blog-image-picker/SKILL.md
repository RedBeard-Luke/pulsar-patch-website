---
name: blog-image-picker
description: Pick a free, commercially-licensed hero image for a chosen Pulsar blog post from Pexels, optimize it, and wire it into blogData. Use after a blog post has been selected and needs its hero/thumbnail image. Manual/on-request until re-enabled.
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

4. **Pick the best — apply the guardrails. REJECT a candidate if it:**
   - **shows people** (any person, face, or hands) on a food/drink post,
   - **doesn't match the title's subject** (wrong drink/food/thing),
   - isn't **horizontal**, or is too vertical to crop to a wide hero,
   - shows an identifiable **brand/logo** or real **alcohol-brand label**,
   - reads **clinical/medical**, or is **text-heavy / watermarked / low-res**.
   Prefer bright, clean, natural-light shots that fit Pulsar's vibe. If nothing
   clears the bar, run another query (a close synonym) rather than settling.

5. **Save + optimize.** With the chosen candidate's `id`:
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

## Notes
- One source only (Pexels) for a clean, uniform license. If Pexels genuinely has
  nothing usable after a few queries, say so and stop — don't silently reach for a
  source with murkier licensing.
- The generated hero image also becomes the social-share (Open Graph) image via
  `blogSeo.js`, so it carries extra weight — pick something that reads well small.
