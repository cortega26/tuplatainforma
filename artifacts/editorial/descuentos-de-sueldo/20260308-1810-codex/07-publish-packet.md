# Publish Packet

- Slug: `descuentos-de-sueldo`
- Final decision: `publish`
- Fecha de corte: `2026-03-08`
- TODO:SOURCE unresolved: `0`

## Artifact checklist

- [x] `01-brief.yaml`
- [x] `02-dossier.md`
- [x] `03-outline.md`
- [x] `04-draft.md`
- [x] `05-math-audit.md`
- [x] `06-compliance.md`
- [x] `07-publish-packet.md`

## Role identity map

- DraftAgent: `codex-draft-sprint-2c`
- MathAuditAgent: `gpt5-math-audit-sprint-2c`
- ComplianceAgent: `gemini-compliance-sprint-2c`

Check: `draft_agent != math_audit_agent != compliance_agent` -> pass

## Reader-facing gate checks

- Respuesta rápida visible: `yes`
- Fecha de corte visible en artículo: `yes`
- Fuentes oficiales visibles: `yes`
- Excepciones relevantes visibles: `yes`
- Tono no promocional: `yes`

## Local command evidence

- `pnpm run check:frontmatter` -> pending at sprint close-out
- `pnpm run check:editorial` -> pending at sprint close-out
- `pnpm run astro check` -> pending at sprint close-out
