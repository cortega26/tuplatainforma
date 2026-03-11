# ADR-20260310: Hardened Topic Ownership Gate

Date: 2026-03-10
Status: Accepted

## Context

The repository already declared `sueldo-remuneraciones`, `pensiones-afp`, and `ahorro-e-inversion` as hardened clusters for topic ownership metadata, but enforcement still treated missing `topicRole` / `canonicalTopic` as warning-only in `pnpm run check:frontmatter`.

That mismatch left the contract in an ambiguous state: docs said the metadata was required, while the gate still allowed publishable omissions. Under `AGENTS.md` Rule 4.3, this counts as a CI gate semantics change and needs an ADR.

There was also no machine-validated source of truth for `canonicalTopic` names inside hardened clusters. Kebab-case format alone prevented syntax drift, not semantic drift.

## Decision

Adopt Route A for hardened clusters:

- Published articles in `sueldo-remuneraciones`, `pensiones-afp`, and `ahorro-e-inversion` must declare both `topicRole` and `canonicalTopic`.
- Missing metadata in those clusters is now blocking in `pnpm run check:frontmatter`.
- Hardened clusters use a central `canonicalTopic` registry in `src/config/editorial-topic-policy.mjs`; unregistered topic names are blocked.
- `category: general` is blocked in hardened clusters unless the article is both `topicRole: reference` and `unlisted: true`.
- `support` / `reference` entries without an `owner` stay warning-only outside hardened clusters, but become blocking inside hardened clusters.

## Consequences

Positive:

- Contract text and enforcement now say the same thing.
- Naming drift on `canonicalTopic` is reduced without adding heavy semantic tooling.
- `category: general` no longer works as a soft escape hatch for publishable owner/support content in hardened clusters.
- `pnpm run audit:topic-overlap` becomes more useful as an inspection tool because it now prints a hardened ownership summary.

Trade-offs:

- Adding a new hardened topic now requires updating the central registry.
- The registry is intentionally scoped to hardened clusters only; non-hardened clusters remain rollout territory.
- The policy is stricter, so future editorial expansion in hardened clusters needs slightly more upfront discipline.

## Maintenance rules

1. Add a hardened-cluster `canonicalTopic` to the central registry before publishing the first article that uses it.
2. Prefer stable need-level names (`calcular-sueldo-liquido`, not phrasing variants or year-stamped aliases).
3. Keep `category: general` for explicit reference/debt cases only, not for owner/support pages.
4. If the same hardened-cluster topic needs a new owner or ownership model, update the registry, contracts, and supporting docs together.
