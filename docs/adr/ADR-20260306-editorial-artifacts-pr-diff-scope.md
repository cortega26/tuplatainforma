# ADR-20260306: Editorial Artifacts Gate Scoped to PR Diff

Status: Accepted  
Date: 2026-03-06

## Context

`ADR-20260303-editorial-artifacts-gate-phase1.md` introduced `scripts/check-editorial-artifacts.mjs` as a warn-first gate with optional strict mode. After enabling strict mode in CI, unrelated pull requests started failing because the repository still contains legacy YMYL posts without the required artifact bundle.

This behavior conflicts with the canonical pipeline scope in `context/EDITORIAL_AI_PIPELINE.md`: mandatory enforcement applies to new YMYL content and substantive YMYL refreshes, not to unrelated maintenance changes.

## Decision

For `pull_request` CI runs:
- keep `EDITORIAL_ENFORCE=1`
- scope blocking evaluation to YMYL blog entries changed in the PR diff
- also include artifact-only edits under `artifacts/editorial/<slug>/` and `context/editorial/artifacts/<slug>/`

For non-PR runs:
- preserve existing repository-wide behavior (`scope=all`)

Implementation:
- `actions/checkout` in CI fetches full history (`fetch-depth: 0`)
- `.github/workflows/ci.yml` passes `EDITORIAL_SCOPE=changed` and `EDITORIAL_DIFF_BASE_REF=${{ github.base_ref }}` for PR runs
- `scripts/check-editorial-artifacts.mjs` resolves the diff range and filters blocking evaluation to changed editorial targets

## Consequences

- Unrelated PRs are no longer blocked by historical artifact debt outside their diff.
- Any PR that adds or substantively refreshes YMYL content still must satisfy the editorial artifact contract.
- Legacy corpus debt remains visible and must be tracked separately until full backfill is completed.

## Alternatives Considered

1. Keep repository-wide strict mode for all PRs  
   Rejected: blocks unrelated Dependabot/infra fixes on pre-existing editorial debt.

2. Disable strict mode in CI entirely  
   Rejected: weakens enforcement for actual YMYL content changes.

3. Generate placeholder artifacts for legacy posts  
   Rejected: would create misleading compliance evidence and bypass the real editorial process.
