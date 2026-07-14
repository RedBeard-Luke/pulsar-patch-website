# Pulsar blog self-improving eval

An autoresearch-style loop (inspired by karpathy/autoresearch): the "program" being
optimized is the blog-generator **prompt** (`.claude/skills/blog-post-generator/SKILL.md`),
the metric is a **score out of 130** (10 posts x 13 criteria), and each round the loop
generates, scores, then rewrites the prompt to attack its weakest criteria, keeping the
best. Runs off the Pulsar site.

## The 13 criteria
Mechanical (scored deterministically by `evaluate.mjs`): 3 subheads, 4 length>=500,
5 one valid category, 6 brand mention, 8 sources-section completeness, 9 no orphan sources.
Judged (adversarial agent): 1 grammar, 2 voice, 7 inline attribution, 10 link integrity,
11 body coherence, 12 section coherence, 13 health-claim safety.

## Files
- `sources.json` — vetted source pool; the generator may cite ONLY these.
- `evaluate.mjs` — deterministic scorer: `node blog-eval/evaluate.mjs <post.md>`
- `generated/round<N>/` — posts produced each round.
- `rounds.json` — score history (feeds the growth chart).

## Scoring
Each round: generate 10 posts -> score each /13 -> sum to /130 -> rewrite the prompt ->
repeat until 130/130 or the round/token cap. The growth chart plots score per round.
