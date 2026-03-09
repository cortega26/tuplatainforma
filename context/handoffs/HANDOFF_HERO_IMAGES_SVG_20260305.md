# Hero Images SVG Handoff

Last updated: 2026-03-05  
Status: Active handoff for new conversation

## Authority Check
1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/*.md`
4. source code/comments

## Task Brief
- Objective:
  - Continue the hero image system work without losing context from the long conversation.
  - Improve the new deterministic SVG illustration system so it reaches a publishable visual quality.
- In scope:
  - `scripts/hero-images/**`
  - `tests/scripts/**`
  - `context/EDITORIAL_IMAGE_SYSTEM.md`
- Out of scope:
  - runtime pages/components
  - routing
  - package/dependency changes
  - unrelated CI changes
- Invariants/Contracts to preserve:
  - Article reading is used only to classify/select `approvedModelId`.
  - No free-form scene invention from article text.
  - `approvedModelId` must come from the approved visual catalog.
- Required gates:
  - `pnpm run test -- --run tests/scripts/svg-scenes.test.ts tests/scripts/generate-images.test.ts tests/scripts/hero-images-prompt-plan.test.ts tests/scripts/check-hero-prompts.test.ts tests/scripts/hero-images-config.test.ts`
  - `pnpm run format:check`
  - `pnpm run check:boundaries`
- Deliverable:
  - Better SVG scene quality, starting with `deuda-credito`, then extend improvements to `cesantia` and `ahorro`.

## Executive Summary

This repository originally tried to automate hero image generation with OpenAI image models.

Result:
- `dall-e-3` consistently drifted into infographic/finance-dashboard clutter.
- `gpt-image-1` followed instructions better, but still did not produce a stable house style.
- The target visual language is too controlled and too minimal to trust to prompt-based generation.

Decision:
- Pivot to a deterministic SVG scene system.
- Keep article reading only for classification.
- Keep `approvedModelId` as the bridge from article semantics to visual recipe.
- Treat OpenAI generation as optional benchmark/fallback, not as the main system.

## What Was Decided

### 1. Article reading is classification only

Correct rule:
- `article -> classification -> approvedModelId -> render`

Incorrect rule:
- `article -> free-form prompt scene -> model output`

This is already documented and partially enforced.

### 2. Prompt-based image generation is no longer the strategic path

It was tested with:
- `dall-e-3`
- `gpt-image-1`

Findings:
- `dall-e-3`: visually unusable for this brand goal
- `gpt-image-1`: somewhat better, still not reliable enough

### 3. SVG renderer POC now exists

Implemented scene IDs:
- `cesantia`
- `deuda-credito`
- `ahorro`

The POC is directionally better than the AI outputs because it is:
- simpler
- repeatable
- controllable
- brand-consistent

But it is not yet high quality enough to publish.

## Current Evaluation of the SVG POC

User feedback on the POC was essentially:
- much closer in spirit to the reference images than AI outputs
- but the craft quality is still too low

Specific problems called out:
- human anatomy/alignment feels off
- torso is too crude
- arms look unnatural
- lower body connection is weak
- props are too rough
- paper shape looks damaged/awkward
- framing/composition still needs intentional refinement

Conclusion:
- SVG is still the right tool
- but the current SVG implementation is only a first crude draft
- the next step is not more scenes
- the next step is a deeper redesign of anatomy, props, and layout

## Exact Next Step

Start with one scene only:
- `deuda-credito`

Why:
- It exposes most of the craft problems clearly:
  - standing anatomy
  - arm pose
  - paper prop
  - card prop
  - spacing and composition

Expected work for the next iteration:
1. redesign the human body construction
2. create a more intentional torso/pelvis/leg connection
3. improve arm geometry and hand/head pose
4. redesign the paper stack shape cleanly
5. redesign the credit card proportions
6. rebalance layout and visual weight
7. only after `deuda-credito` is good, port the same quality bar to `cesantia` and `ahorro`

## Files That Matter Most

### Canonical docs
- [context/EDITORIAL_IMAGE_SYSTEM.md](/home/carlos/VS_Code_Projects/tuplatainforma/context/EDITORIAL_IMAGE_SYSTEM.md)
- [context/handoffs/HANDOFF_HERO_IMAGES_SVG_20260305.md](/home/carlos/VS_Code_Projects/tuplatainforma/context/handoffs/HANDOFF_HERO_IMAGES_SVG_20260305.md)

### Classification / approved model selection
- [scripts/hero-images/config.mjs](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/config.mjs)
- [scripts/hero-images/prompt-plan.mjs](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/prompt-plan.mjs)
- [scripts/check-hero-prompts.mjs](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/check-hero-prompts.mjs)

### SVG renderer POC
- [scripts/hero-images/svg/primitives.mjs](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/svg/primitives.mjs)
- [scripts/hero-images/svg/components.mjs](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/svg/components.mjs)
- [scripts/hero-images/svg/scene-registry.mjs](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/svg/scene-registry.mjs)
- [scripts/hero-images/render-svg-scenes.mjs](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/render-svg-scenes.mjs)

### Tests
- [tests/scripts/svg-scenes.test.ts](/home/carlos/VS_Code_Projects/tuplatainforma/tests/scripts/svg-scenes.test.ts)
- [tests/scripts/hero-images-prompt-plan.test.ts](/home/carlos/VS_Code_Projects/tuplatainforma/tests/scripts/hero-images-prompt-plan.test.ts)
- [tests/scripts/check-hero-prompts.test.ts](/home/carlos/VS_Code_Projects/tuplatainforma/tests/scripts/check-hero-prompts.test.ts)
- [tests/scripts/hero-images-config.test.ts](/home/carlos/VS_Code_Projects/tuplatainforma/tests/scripts/hero-images-config.test.ts)
- [tests/scripts/generate-images.test.ts](/home/carlos/VS_Code_Projects/tuplatainforma/tests/scripts/generate-images.test.ts)

## Preview Files Already Generated

By scene:
- [scripts/hero-images/previews/cesantia.png](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/previews/cesantia.png)
- [scripts/hero-images/previews/deuda-credito.png](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/previews/deuda-credito.png)
- [scripts/hero-images/previews/ahorro.png](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/previews/ahorro.png)

By real slug:
- [scripts/hero-images/previews/finiquito-e-indemnizaciones-en-chile.png](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/previews/finiquito-e-indemnizaciones-en-chile.png)
- [scripts/hero-images/previews/informe-deudas-cmf-vs-dicom.png](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/previews/informe-deudas-cmf-vs-dicom.png)
- [scripts/hero-images/previews/reforma-previsional-2025-que-cambia-y-como-te-afecta.png](/home/carlos/VS_Code_Projects/tuplatainforma/scripts/hero-images/previews/reforma-previsional-2025-que-cambia-y-como-te-afecta.png)

## Useful Commands

Render all current SVG scenes:

```bash
node scripts/hero-images/render-svg-scenes.mjs
```

Render only one scene:

```bash
node scripts/hero-images/render-svg-scenes.mjs --scene deuda-credito
```

Render by slug when the slug maps to an implemented `approvedModelId`:

```bash
node scripts/hero-images/render-svg-scenes.mjs --slug informe-deudas-cmf-vs-dicom
```

Run the most relevant checks:

```bash
pnpm run test -- --run tests/scripts/svg-scenes.test.ts tests/scripts/generate-images.test.ts tests/scripts/hero-images-prompt-plan.test.ts tests/scripts/check-hero-prompts.test.ts tests/scripts/hero-images-config.test.ts
pnpm run format:check
pnpm run check:boundaries
```

## Current Working Tree Notes

There are in-progress changes already present in the worktree, including:
- hero image pipeline files
- SVG renderer files
- tests
- `scripts/hero-images/downloads/` as untracked/generated local assets
- `scripts/hero-images/previews/` as untracked/generated preview assets

Do not assume a clean tree.
Do not delete or overwrite those files casually.

## Recommended Prompt For A New Conversation

Use this as the first message in the new chat:

```md
Read these first:
- docs/AI_ENGINEERING_CONSTITUTION.md
- AGENTS.md
- context/EDITORIAL_IMAGE_SYSTEM.md
- context/handoffs/HANDOFF_HERO_IMAGES_SVG_20260305.md

Task:
- Continue the deterministic SVG hero image system.
- Focus only on improving `deuda-credito` first.
- Do not add new scenes yet.
- Improve anatomy, prop design, and composition quality.
- Keep article reading as classification only; do not reintroduce free-form prompt generation.

Required checks:
- pnpm run test -- --run tests/scripts/svg-scenes.test.ts tests/scripts/generate-images.test.ts tests/scripts/hero-images-prompt-plan.test.ts tests/scripts/check-hero-prompts.test.ts tests/scripts/hero-images-config.test.ts
- pnpm run format:check
- pnpm run check:boundaries

path: context/handoffs/HANDOFF_HERO_IMAGES_SVG_20260305.md
```

