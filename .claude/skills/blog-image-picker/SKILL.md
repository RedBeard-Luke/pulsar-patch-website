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

1. **Understand the post.** Read its title, category, `targetKeyword` (if present),
   and body. Identify the single most photographable subject (e.g. "grapefruit
   spritz in a wine glass", "friends toasting at a rooftop bar", "morning light in
   a bedroom"). Note the category: RECIPES → the drink/food; LIFESTYLE → people/
   scenes; SCIENCE → clean abstract/lifestyle, NOT clinical/medical stock.

2. **Form 2–3 search queries.** Concrete and visual. Lead with the subject, add a
   mood/setting word. Examples: `grapefruit spritz cocktail`, `non alcoholic
   cocktail garnish`, `bright bar drinks summer`. Avoid brand names and generic
   filler ("lifestyle", "wellness").

3. **Search + preview.** For each query run:
   ```
   node .claude/skills/blog-image-picker/image-tool.mjs search "<query>" --per 12
   ```
   It downloads preview thumbnails and prints JSON candidates (index, id,
   photographer, `alt`, size, `previewPath`). **Read the previewPath images** (the
   Read tool shows them) and actually LOOK — don't pick on alt text alone.

4. **Pick the best — and apply the guardrails. REJECT a candidate if it:**
   - shows an identifiable **brand/logo** or a real **alcohol-brand label**,
   - reads **clinical/medical** (pills, hospitals, lab coats) — off-brand,
   - is **text-heavy**, watermarked, low-res, or heavily filtered,
   - doesn't genuinely match the post's subject.
   Prefer bright, clean, natural-light, real-moment photos that fit Pulsar's vibe
   (casual, fun, a good night / better morning). Landscape only; the tool already
   requests `orientation=landscape` and `size=large`. If nothing clears the bar,
   run another query rather than settling.

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

## Notes
- One source only (Pexels) for a clean, uniform license. If Pexels genuinely has
  nothing usable after a few queries, say so and stop — don't silently reach for a
  source with murkier licensing.
- The generated hero image also becomes the social-share (Open Graph) image via
  `blogSeo.js`, so it carries extra weight — pick something that reads well small.
