# Editorial AI Pipeline (Quality-First, Canonical)

Last updated: 2026-03-03
Status: Active (mixed enforcement: scripts + manual review)

Authority order:
1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/*.md`
4. Source code/comments

## 1. Purpose and Scope

- Purpose: define an enforceable multi-model editorial pipeline for quality-first YMYL execution.
- Scope:
  - Mandatory for new YMYL content and substantive YMYL refreshes in `src/data/blog/**`.
  - Mandatory when refresh changes numbers, legal interpretation, eligibility rules, thresholds, or publication decision.
  - Non-YMYL content may follow this pipeline as recommendation.
- Canonical references:
  - `docs/editorial/NORMA_YMYL.md`
  - `context/INVARIANTS.md`
  - `context/CONTRACTS.md`
  - `CONTRACT.YMYL_RESPONSE_STRUCTURE` (in `context/CONTRACTS.md`)

## 2. Canonical Roles (Separation of Duties)

| Phase | Canonical role | Assigned model family |
|---|---|---|
| Research | `ResearchAgent` | Gemini |
| Outline | `OutlineAgent` | GPT-5.2 |
| Draft | `DraftAgent` | Claude |
| Math audit | `MathAuditAgent` | GPT-5.2 |
| Compliance (Chile) | `ComplianceAgent` | Gemini |
| Final proofreading | `CopyEditAgent` | Claude |
| SEO structural pass | `SEOStructureAgent` | GPT-5.2 |
| Final publication decision | `HumanEditor` | Human |

Hard rule:
- `DraftAgent` must be different from both `MathAuditAgent` and `ComplianceAgent` for the same editorial run.

## 3. Artifact Set by Phase

Canonical run folder:
- `artifacts/editorial/<slug>/<run-id>/`
- `run-id` format: `YYYYMMDD-HHMM-<shortid>`

Required artifacts (minimum):
1. `01-brief.yaml`
2. `02-dossier.md`
3. `03-outline.md`
4. `04-draft.md`
5. `05-math-audit.md`
6. `06-compliance.md`
7. `07-publish-packet.md`

Artifact contracts are defined in:
- `CONTRACT.EDITORIAL.BRIEF`
- `CONTRACT.EDITORIAL.DOSSIER`
- `CONTRACT.EDITORIAL.OUTLINE`
- `CONTRACT.EDITORIAL.DRAFT`
- `CONTRACT.EDITORIAL.MATH_AUDIT_REPORT`
- `CONTRACT.EDITORIAL.COMPLIANCE_REPORT`
- `CONTRACT.EDITORIAL.PUBLISH_PACKET`

## 4. Publish Gate (Editorial)

Publication is allowed only when all checks are satisfied:
- `Cut-off date` is present and visible to readers.
- No unsourced critical numbers:
  - each critical number has a source citation; or
  - in draft-only state, unresolved values are marked `TODO:SOURCE`;
  - final publish packet cannot contain unresolved `TODO:SOURCE`.
- Separation of duties proof is present (`draft_agent != math_audit_agent != compliance_agent` by role identity).
- If `requires_calculation=true`, `05-math-audit.md` is mandatory and must end with pass/fail verdict.
- If `regulatory_sensitivity=alta`, `06-compliance.md` plus explicit `HumanEditor` sign-off is mandatory.
- `CONTRACT.YMYL_RESPONSE_STRUCTURE` is satisfied.
- `docs/editorial/NORMA_YMYL.md` checklist and scorecard are attached.

Execution evidence:
- Script-enforced: `pnpm run check:frontmatter`, `pnpm run check:editorial`, `pnpm run check:dialect`.
- Release-enforced (no-regression): `pnpm run check:routes`, `pnpm run check:rss`.
- Manual-enforced: artifact completeness, source traceability, role separation, human sign-off.

## 5. Risk Classification and Escalation

Risk levels:
- `baja`: no legal interpretation changes, no calculations, no threshold updates.
- `media`: calculations or threshold updates without high regulatory sensitivity.
- `alta`: legal/regulatory interpretation updates, tax/pension/labor obligations, or explicit `regulatory_sensitivity=alta`.

Escalation:
- `baja`: pipeline required, human review optional if no compliance flags.
- `media`: pipeline required, human review required.
- `alta`: pipeline + mandatory compliance report + mandatory human sign-off before publish.

## 6. Source and Time Policy

Policy:
- No critical number is publishable without source traceability.
- Every YMYL output must include explicit cut-off date (`fecha de corte`) in visible article content.
- Dossier must include source list with retrieval date and confidence notes.

## 7. Integration with NORMA_YMYL

- `docs/editorial/NORMA_YMYL.md` remains the canonical editorial quality norm.
- This file defines execution workflow and artifact contracts for deterministic enforcement.
- If any conflict appears:
  - Apply authority order.
  - Halt and emit conflict report per `AGENTS.md` Rule 1.2 and Rule 4.2.
