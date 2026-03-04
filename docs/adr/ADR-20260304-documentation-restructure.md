# ADR-20260304: Documentation Taxonomy Restructure

Date: 2026-03-04
Status: Accepted

## Context

Documentation had grown across root-level files and mixed `docs/` subfolders without a consistent taxonomy. Operational artifacts (audits/issues/reports), research, and architecture docs coexisted at the same depth, which increased discovery time and raised path-drift risk.

Governance anchors (`docs/AI_ENGINEERING_CONSTITUTION.md`, `AGENTS.md`, `context/*.md`, `docs/TECH_DEBT_BACKLOG.md`) must remain stable and identifiable.

## Decision

Adopt a layered documentation taxonomy under `docs/`:

- `docs/governance/`
- `docs/architecture/`
- `docs/operations/{audits,issues,reports}`
- `docs/development/`
- `docs/editorial/` (existing)
- `docs/research/`
- `docs/adr/` (canonical ADR path retained)

Move non-authority documents into the new structure using `git mv` semantics, and update all affected references in Markdown and scripts.

## Migration decisions

1. Moved root operational/planning docs into `docs/` (`BACKLOG_EDITORIAL.md`, `audit.md`, `project_structure.md`).
2. Consolidated operational docs into `docs/operations/{audits,issues,reports}`.
3. Moved deep research dossier to `docs/research/`.
4. Moved domain boundary architecture doc to `docs/architecture/`.
5. Kept constitutional/governance anchors at canonical paths.
6. Updated tooling paths:
   - `project_structure.py` output path
   - `git_audit_export.py` default output path
   - `scripts/migrate-images*.mjs` report output path

## Consequences

Positive:

- Deterministic location for each documentation concern.
- Lower risk of path ambiguity during operational updates.
- Better separation between governance, architecture, operations, and research.

Trade-offs:

- Existing references required migration updates.
- Historical docs may still contain workstation-absolute links for source evidence formatting.

## Future maintenance rules

1. Keep authority anchors stable unless an ADR explicitly approves a governance path change.
2. New operational artifacts must go under `docs/operations/`.
3. New research artifacts must go under `docs/research/`.
4. New architecture docs must go under `docs/architecture/` and architecture decisions under `docs/adr/`.
5. Any path move must include link/reference updates and markdown-link verification.
