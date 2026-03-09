# Documentation Authority Model

## Purpose

Define and enforce authority layering so documentation remains predictable,
auditable, and non-contradictory.

## Authority hierarchy

| Layer | Path | Role |
|---|---|---|
| 1 | `docs/AI_ENGINEERING_CONSTITUTION.md` | Constitutional source of non-negotiable engineering constraints |
| 2 | `AGENTS.md` | Execution protocol and operational enforcement rules |
| 3 | `context/*.md` | Canonical, agent-facing system context (invariants, contracts, state) |
| 4 | `docs/**` | Human-facing architecture, governance guides, runbooks, ADRs, reports |

## Role separation

### `context/`

- Canonical context for agent execution.
- Must stay concise, stable, and machine-consumable.
- Contains contract/invariant state and current project operating context.

### `docs/`

- Human-facing explanatory and operational documentation.
- Contains governance explanation, architecture rationale, ADRs, reports,
  and editorial/development process docs.

## Change rules

1. No authority inversion.
- Lower layers must not override higher-layer constraints.

2. Canonical anchors must remain stable.
- Keep these paths stable: `docs/AI_ENGINEERING_CONSTITUTION.md`, `AGENTS.md`,
  `context/INVARIANTS.md`, `context/CONTRACTS.md`, `docs/adr/`.

3. ADR location is unique.
- ADR files must live only in `docs/adr/`.

4. Documentation structure guard is mandatory.
- Run `pnpm run check:docs` before merge.

5. Scope discipline for docs changes.
- Documentation-only changes must not modify runtime behavior in `src/**`.

## Current cross-reference policy

Cross-references from `context/*.md` into canonical `docs/**` anchors are
allowed when they point to higher-authority or canonical supporting material,
for example:

- `docs/AI_ENGINEERING_CONSTITUTION.md`
- `docs/editorial/NORMA_YMYL.md`
- `docs/domain/**`
- `docs/adr/**`
- `docs/reports/*.json`
- selected operational reports cited as checkpoint evidence

What is not allowed is residual linkage to deprecated pre-restructure paths
such as `docs/audits/`, `docs/issues/`, root-level report files, or
`internal-docs/` as an active canonical location.

`pnpm run check:docs` enforces this narrower rule so the warning channel stays
actionable instead of flagging legitimate canonical references.
