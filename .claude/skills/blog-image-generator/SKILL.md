---
name: blog-image-generator
description: Generate a unique, on-brand hero image for a chosen Pulsar blog post with Google's Gemini image model — generate 3 candidates, vision-grade them, keep the best, optimize and self-host. Use after a blog post is chosen and needs its hero/thumbnail. Manual/on-request.
---

> ⏸ **MANUAL / ON-REQUEST ONLY.** Designed to slot into the daily flow *after* the
> winning post is chosen, but it does NOT run automatically and is not scheduled.
> It STAGES the result (never commits) so a human reviews the actual image first.

# Pulsar Blog Image Generator (Gemini)

Generate the hero image instead of finding stock. AI images are **unique** (no
stock-pool repeats, no random/irrelevant matches — the two problems the Pexels
finder hit) and **self-hosted** on our domain, which is the SEO-correct approach.
The tradeoff is quality/brand-fit, so the grading step is the important part:
generate 3, actually LOOK at them, keep the best, and regenerate if none are good
enough. One landscape image serves both the hero (under the wavy border) and the
4:3 thumbnail; it also becomes the Open Graph social image via `blogSeo.js`.

Supersedes the Pexels-based [blog-image-picker](../blog-image-picker/SKILL.md)
(kept as a fallback for real photography).

## Prerequisite
- `GEMINI_API_KEY` set in the environment (free key at https://aistudio.google.com/).
  If missing, the tool errors with instructions — stop and tell the user.

## Inputs
- The **post slug** (the `blogData.js` key, e.g. `zero-proof-spritz`), and
- The post's content (read it from `blogData.js` or the generated `.md`).

## The Pulsar image style (bake this into EVERY prompt)
Compose the prompt as: **[the specific scene from the post]** + this style + the
negatives + landscape framing.

- **Look:** bright, clean, natural daylight, modern lifestyle photography. Real
  photographic look (not illustration/3D/CGI) unless the post clearly calls for
  otherwise. Shallow depth of field, appetizing and fresh. A subtly upbeat, fun
  mood that fits "a good night out and a better morning."
- **Palette:** mostly natural/neutral with subtle Pulsar accents where they fit
  (cyan #44C8E8, pink #DE64A5) — accents, never a color wash.
- **Framing:** wide 16:9 landscape composition, room around the subject so it
  crops cleanly to a 4:3 thumbnail. Hero subject slightly off-center.
- **NEGATIVES (state these explicitly):** no text, no words, no logos, no brand
  labels on bottles/cans, no watermarks, no UI, no distorted or extra hands/
  fingers, no uncanny faces, no medical/clinical imagery, no collage.

## Steps

1. **Understand the post.** Identify the single most photographable subject.
   RECIPES → the finished drink/food, styled. LIFESTYLE → a real human moment/
   scene. SCIENCE → a clean, bright lifestyle/abstract shot (NOT lab/clinical).

2. **Write the prompt** = scene + the Pulsar style block + negatives + landscape.
   Be concrete about the subject (e.g. "a grapefruit spritz mocktail in a
   stemmed wine glass with a rosemary sprig and orange wheel, on a sunny outdoor
   table").

3. **Generate 3 candidates:**
   ```
   node .claude/skills/blog-image-generator/image-gen.mjs generate "<full prompt>" <slug> --n 3
   ```
   It writes `<slug>-1.png … -3.png` and prints their paths.

4. **Grade them — READ each image and score it.** Use the Read tool on each path
   and actually look. Score every candidate on:
   - **Relevant** — matches the post's subject.
   - **On-brand** — bright/clean/natural-light Pulsar look.
   - **Quality** — no artifacts, no distorted hands/faces, sharp, not uncanny.
   - **Appetizing** (recipes) — the food/drink looks genuinely good.
   - **Composition** — clean, uncluttered, subject reads clearly.
   - **Clean** — NO text/logos/brand-labels/watermarks (hard fail if present).
   - **Thumbnail test** — still reads well shrunk to a small 4:3 card.
   Pick the best. **If none clear a solid bar (especially any with text/logos or
   artifacts), regenerate** with a tweaked prompt — up to ~2 more rounds — rather
   than shipping a weak image. Say so if you regenerate.

5. **Finalize the winner:**
   ```
   node .claude/skills/blog-image-generator/image-gen.mjs finalize <chosen-png-path> <slug>
   ```
   Writes `src/assets/blog/<slug>.jpg` (JPEG, ≤1600px, optimized) and prints the
   `importLine`.

6. **Wire into blogData.js.**
   - Add the printed `importLine` with the other blog image imports at the top.
   - Set `heroImg: img<Slug>` on the post entry.
   - Add a descriptive, keyword-aware `heroAlt` (SEO rule S18) that matches what
     the image actually shows.

7. **Verify + report. Do NOT commit.**
   - Run `npm run build` to confirm the import resolves.
   - Report which candidate won and why, note it's **AI-generated** (Gemini) so
     the human knows, and that it's **staged for review** before pushing. The
     image is the most visible thing on the post — they should eyeball it.

## Notes
- Cost is a few cents per run; fine for daily use.
- If generation fails with a model/endpoint error, Google may have renamed the
  model — set `GEMINI_IMAGE_MODEL` to the current one (see the docs link in
  image-gen.mjs) rather than guessing repeatedly.
- Never ship an image with visible text, a logo, or a real brand label — those
  are the most common AI failure modes and the clearest quality/legal red flags.
