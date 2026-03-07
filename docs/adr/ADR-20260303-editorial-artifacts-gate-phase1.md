# ADR-20260303: Editorial Artifacts Gate (Phase 1, Warn-First)

Status: Accepted  
Date: 2026-03-03

## Context

Editorial YMYL pipeline requirements exist in `context/EDITORIAL_AI_PIPELINE.md`, `context/INVARIANTS.md`, and `context/CONTRACTS.md`, but there was no deterministic automated gate to report artifact debt per post.

## Decision

Add an offline gate script:
- `scripts/check-editorial-artifacts.mjs`

Expose and integrate commands:
- `check:editorial-artifacts`
- include it in `check:editorial`

Phase 1 enforcement mode:
- default `warn-only` (exit `0`)
- strict opt-in via `EDITORIAL_ENFORCE=1` (exit `1` on violations)

YMYL detection priority:
1. `frontmatter.ymyl=true`
2. category/tag mapping aligned to YMYL scope in `docs/editorial/NORMA_YMYL.md`
3. optional fallback allowlist (`context/EDITORIAL_YMYL_ALLOWLIST.txt`) if present

Artifact path policy:
- canonical: `artifacts/editorial/<post_id>/<run-id>/`
- temporary fallback read support: `context/editorial/artifacts/<post_id>/`

## Consequences

- Non-mutating, deterministic, no-network validation for editorial artifacts.
- Warn-first rollout enables debt visibility without immediate CI breakage.
- Strict mode allows progressive hardening without changing script semantics.

## Rollback

- Revert `package.json` script wiring and remove `scripts/check-editorial-artifacts.mjs`.
