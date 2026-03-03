# ADR-20260303: Editorial AI Pipeline as Enforceable Context Contract

Status: Accepted  
Date: 2026-03-03

## Context

The repository had YMYL editorial policy (`docs/editorial/NORMA_YMYL.md`) and partial automated gates, but no canonical artifact-level pipeline contract for multi-stage AI execution.

This created ambiguity in:
- role separation for draft vs audit/compliance,
- mandatory artifact evidence for publish decisions,
- deterministic handling of cut-off date and number source traceability.

## Decision

Adopt a canonical context-layer pipeline document:
- `context/EDITORIAL_AI_PIPELINE.md`

Extend enforceable registries:
- `context/INVARIANTS.md` with editorial AI invariants:
  - `INVARIANT.EDITORIAL.CUT_OFF_DATE_REQUIRED`
  - `INVARIANT.EDITORIAL.NO_UNSOURCED_NUMBERS`
  - `INVARIANT.EDITORIAL.SEPARATION_OF_DUTIES`
  - `INVARIANT.EDITORIAL.MATH_AUDIT_REQUIRED_WHEN_CALC`
  - `INVARIANT.EDITORIAL.COMPLIANCE_REVIEW_REQUIRED_WHEN_HIGH_RISK`
- `context/CONTRACTS.md` with artifact contracts:
  - `CONTRACT.EDITORIAL.BRIEF`
  - `CONTRACT.EDITORIAL.DOSSIER`
  - `CONTRACT.EDITORIAL.OUTLINE`
  - `CONTRACT.EDITORIAL.DRAFT`
  - `CONTRACT.EDITORIAL.MATH_AUDIT_REPORT`
  - `CONTRACT.EDITORIAL.COMPLIANCE_REPORT`
  - `CONTRACT.EDITORIAL.PUBLISH_PACKET`

Activate protocol usage in:
- `AGENTS.md` (mandatory for YMYL new content and substantive refreshes).

## Alternatives considered

1. Keep only `NORMA_YMYL` without artifact contracts  
Rejected: insufficiently deterministic for multi-agent quality control.

2. Implement full automatic script gate for all new invariants now  
Rejected for this iteration: larger change surface and higher regression risk.

3. Reorganize `docs/` and `context/` folders in the same change  
Rejected: not required to enforce pipeline; unnecessary migration risk.

## Consequences

Positive:
- Deterministic artifact protocol for quality-first YMYL execution.
- Explicit separation of duties and high-risk escalation.
- Stronger traceability for numbers/sources and cut-off date.

Trade-off:
- Some controls remain manual-enforced until dedicated gates are implemented.

## Migration and Compatibility

- No runtime route, canonical URL, RSS policy, or slug identity changes.
- No `src/**` changes.
- Existing gates remain intact.
- New contracts are additive and backward compatible with existing content checks.

## Risks and Mitigation

- Risk: manual-enforced controls may be inconsistently applied.
- Mitigation:
  - mandatory publish packet evidence,
  - mandatory AGENTS protocol activation for YMYL/refresh tasks,
  - existing script gates (`check:frontmatter`, `check:editorial`, `check:dialect`) still required.

## Verification

Executed gates:
- `pnpm run lint`
- `pnpm run check:boundaries`
- `pnpm run format:check` (fails due pre-existing unrelated formatting debt)
- `pnpm run test`
- `pnpm run check:frontmatter`
- `pnpm run check:editorial`
- `pnpm run check:routes`
- `pnpm run check:rss`
- `pnpm run astro check`
- `pnpm run build`
