# Publish Packet

- Slug: `el-poder-del-interes-compuesto`
- Final decision: `publish`
- Fecha de corte: `2025-12-31`
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

- DraftAgent: `codex-draft-local`
- MathAuditAgent: `gpt5-math-audit-canonical-role`
- ComplianceAgent: `gemini-compliance-canonical-role`

Check: `draft_agent != math_audit_agent != compliance_agent` -> pass

## Reader-facing gate checks

- Respuesta rápida visible: `yes`
- Fecha de corte visible en artículo: `yes`
- Nota metodológica enlazada: `yes`
- Tono no promocional: `yes`
- Advertencia de no recomendación: `yes`
- Críticas razonables visibles: `yes`

## Local command evidence

- `pnpm run check:frontmatter` -> pass
- `pnpm run check:editorial` -> pass (con warnings preexistentes del repo en `check:editorial-artifacts` y advertencias no bloqueantes de `description` larga)
- `pnpm run astro check` -> pass
- `pnpm run test` -> pass
- `pnpm run build` -> pass
