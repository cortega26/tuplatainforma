# Current State

Date: 2026-03-01

- Context layer added: `context/INVARIANTS.md`, `context/CONTRACTS.md`, `context/MODULE_INDEX.md`.
- Canonical URL identity invariant active: `URL.PUBLIC.NO_POST_ID`.
- Route/RSS guardrails active through snapshot comparison gates.
- Frontmatter gate active and blocking on schema/deprecation errors.
- Inline article image gate active through `pnpm run check:images` (AVIF by default with justified exception allowlist).
