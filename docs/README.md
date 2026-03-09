# Documentation System

This repository uses authority-layered documentation.

## Authority layering

1. `docs/AI_ENGINEERING_CONSTITUTION.md` (constitutional)
2. `AGENTS.md` (execution governance)
3. `context/*.md` (canonical system context)
4. `docs/**` supporting human-facing documentation

## Structure index

- `docs/governance/`
- Governance model and authority policy for contributors and agents.
- `docs/architecture/`
- Architecture boundaries, structure maps, and architecture-level analysis docs.
- `docs/operations/`
- Audits, issue execution records, and closure/performance reports.
- `docs/development/`
- Development planning artifacts and execution backlogs.
- `docs/editorial/`
- Editorial policy and publishing process documentation.
- `docs/research/`
- Research dossiers used as input for audits/planning.
- `docs/domain/`
- Domain-specific contracts, invariants, and ubiquitous language.
- `docs/adr/`
- Architecture Decision Records (single canonical ADR location).
- `docs/reports/`
- Canonical baseline snapshots used by validation scripts.

## Canonical anchors (do not relocate)

- `docs/AI_ENGINEERING_CONSTITUTION.md`
- `docs/TECH_DEBT_BACKLOG.md`
- `AGENTS.md`
- `context/INVARIANTS.md`
- `context/CONTRACTS.md`
- `docs/adr/`

## Validation

Run `pnpm run check:docs` to enforce documentation structure guardrails.
