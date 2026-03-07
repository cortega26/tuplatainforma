# ADR-20260307: Inline Article Image AVIF Gate

Date: 2026-03-07
Status: Accepted

## Context

The repository already enforced hero-image constraints and a small asset-budget check for `src/assets/images/blog`, but article-body inline images in `src/data/blog/**/*.md(x)` had no dedicated guardrail.

That gap allowed stale or non-canonical formats to ship inside articles even while surrounding editorial numbers and copy were updated. Under `AGENTS.md` Rule 4.3, changing CI gate semantics requires an ADR.

## Decision

Harden `pnpm run check:images` so it also scans inline images embedded in article bodies and applies these rules:

- Inline article images must use `.avif` by default.
- Non-AVIF inline images are blocked unless the article frontmatter declares an explicit justified exception in `inlineImageExceptions`.
- Each exception entry must match an image `src` exactly and provide a human-readable `reason`.
- Stale or unnecessary exception entries are blocking.
- Local inline image paths must resolve to an existing file.

Frontmatter contract added:

```yaml
inlineImageExceptions:
  - src: /images/posts/example/legacy-chart.webp
    reason: "Legacy upstream chart only exists in this format."
```

## Consequences

Positive:

- Inline article media now follows the same deterministic guard philosophy as hero images.
- Non-AVIF article images require deliberate review and documented rationale.
- Broken or stale exception config is surfaced before build/deploy.

Trade-offs:

- The frontmatter schema gains a new optional field.
- Existing non-AVIF inline images must be converted or explicitly justified before merge.

## Maintenance rules

1. Prefer converting inline images to AVIF instead of adding exceptions.
2. Exceptions must stay narrow, exact-match, and justified in prose.
3. If future policy broadens allowed inline formats, update this ADR and the context contracts/invariants together.
