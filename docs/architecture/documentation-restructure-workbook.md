# Documentation Restructure Workbook

Date: 2026-03-04

Authority Check: `docs/AI_ENGINEERING_CONSTITUTION.md` > `AGENTS.md` > `context/*.md` > source code/comments.

## Stage 1 - Documentation Discovery

Markdown files discovered (excluding build/dependency artifacts): **114**.

| File | Path | Topic | Category | Authority Level |
|---|---|---|---|---|
| CODE_OF_CONDUCT.md | `.github/CODE_OF_CONDUCT.md` | Contributor Covenant Code of Conduct | Community template/process doc | Governance |
| CONTRIBUTING.md | `.github/CONTRIBUTING.md` | How to contribute to Tu Plata Informa | Community template/process doc | Governance |
| ✨-feature-request.md | `.github/ISSUE_TEMPLATE/✨-feature-request.md` | ✨-feature-request | Community template/process doc | Governance |
| 🐞-bug-report.md | `.github/ISSUE_TEMPLATE/🐞-bug-report.md` | 🐞-bug-report | Community template/process doc | Governance |
| 📝-documentation-improvement.md | `.github/ISSUE_TEMPLATE/📝-documentation-improvement.md` | 📝-documentation-improvement | Community template/process doc | Governance |
| PULL_REQUEST_TEMPLATE.md | `.github/PULL_REQUEST_TEMPLATE.md` | PULL_REQUEST_TEMPLATE | Community template/process doc | Governance |
| AGENTS.md | `AGENTS.md` | AGENTS.md | Agent execution protocol | Governance |
| README.md | `README.md` | Tu Plata Informa | Repository overview | Informational |
| CONTRACTS.md | `context/CONTRACTS.md` | Context Contracts Registry | Context registry/policy | Governance |
| CURRENT_STATE.md | `context/CURRENT_STATE.md` | Current State | Context registry/policy | Governance |
| DOMAIN_CONTRACT_BOUNDARIES.md | `context/DOMAIN_CONTRACT_BOUNDARIES.md` | Domain Contract Boundaries (Phase 1) | Layer/domain boundaries | Architecture |
| EDITORIAL_AI_PIPELINE.md | `context/EDITORIAL_AI_PIPELINE.md` | Editorial AI Pipeline (Quality-First, Canonical) | Context registry/policy | Governance |
| EDITORIAL_IMAGE_SYSTEM.md | `context/EDITORIAL_IMAGE_SYSTEM.md` | Editorial Image System | General documentation | Informational |
| INTER_CLUSTER_LINKING.md | `context/INTER_CLUSTER_LINKING.md` | Inter-Cluster Linking Policy (Canonical) | General documentation | Informational |
| INVARIANTS.md | `context/INVARIANTS.md` | Context Invariants Registry | Context registry/policy | Governance |
| MODULE_INDEX.md | `context/MODULE_INDEX.md` | Module Index (Agent Quick Map) | Context registry/policy | Governance |
| PHASE1_CLOSURE_REPORT.md | `archive/context/PHASE1_CLOSURE_REPORT.md` | PHASE 1 CLOSURE REPORT | Closure/performance report | Operational |
| PROJECT_CONTEXT_MASTER.md | `context/PROJECT_CONTEXT_MASTER.md` | PROJECT_CONTEXT_MASTER | Context registry/policy | Governance |
| TECH_DEBT_BACKLOG.md | `archive/context/TECH_DEBT_BACKLOG.md` | TECH_DEBT_BACKLOG | Technical debt snapshot (context) | Operational |
| AI_ENGINEERING_CONSTITUTION.md | `docs/AI_ENGINEERING_CONSTITUTION.md` | AI-Optimized Engineering Constitution | Constitution | Constitutional |
| README.md | `docs/README.md` | Documentation System | Repository overview | Informational |
| TECH_DEBT_BACKLOG.md | `docs/TECH_DEBT_BACKLOG.md` | TECH_DEBT_BACKLOG | Technical debt ledger (canonical) | Governance |
| ADR-20260303-editorial-ai-pipeline-enforcement.md | `docs/adr/ADR-20260303-editorial-ai-pipeline-enforcement.md` | ADR-20260303: Editorial AI Pipeline as Enforceable Context Contract | Architecture decision record | Architecture |
| ADR-20260303-editorial-artifacts-gate-phase1.md | `docs/adr/ADR-20260303-editorial-artifacts-gate-phase1.md` | ADR-20260303: Editorial Artifacts Gate (Phase 1, Warn-First) | Architecture decision record | Architecture |
| ADR-20260304-documentation-restructure.md | `docs/adr/ADR-20260304-documentation-restructure.md` | ADR-20260304: Documentation Taxonomy Restructure | Architecture decision record | Architecture |
| DOMAIN_CONTRACT_BOUNDARIES.md | `docs/architecture/DOMAIN_CONTRACT_BOUNDARIES.md` | Domain Contract Boundaries (Phase 1) | Layer/domain boundaries | Architecture |
| README.md | `docs/architecture/README.md` | Architecture Docs | Documentation index | Governance |
| documentation-restructure-workbook.md | `docs/architecture/documentation-restructure-workbook.md` | Documentation Restructure Workbook | General documentation | Informational |
| project-structure.md | `docs/architecture/project-structure.md` | Project Structure: tuplatainforma | Repository structure snapshot | Architecture |
| BACKLOG_EDITORIAL.md | `docs/development/BACKLOG_EDITORIAL.md` | Backlog Editorial Priorizado | Editorial backlog | Operational |
| README.md | `docs/development/README.md` | Development Docs | Documentation index | Governance |
| CONTRACTS.md | `docs/domain/CONTENT/CONTRACTS.md` | Article Aggregate Contract (DDD) | Domain contracts/invariants | Architecture |
| INVARIANTS.md | `docs/domain/CONTENT/INVARIANTS.md` | Domain Invariants - Article | Domain contracts/invariants | Architecture |
| UBIQUITOUS_LANGUAGE.md | `docs/domain/CONTENT/UBIQUITOUS_LANGUAGE.md` | Ubiquitous Language - Content Context | Domain contracts/invariants | Architecture |
| DEFINITION_OF_DONE.md | `docs/editorial/DEFINITION_OF_DONE.md` | Editorial Definition of Done (DoD) | Editorial process artifact | Operational |
| FRONTMATTER_SCHEMA.md | `docs/editorial/FRONTMATTER_SCHEMA.md` | Frontmatter Schema (Editorial) | Editorial process artifact | Operational |
| NORMA_YMYL.md | `docs/editorial/NORMA_YMYL.md` | NORMA EDITORIAL YMYL - Precision, Credibilidad y Autoridad (v1.0) | YMYL editorial norm | Governance |
| PUBLISH_CHECKLIST.md | `docs/editorial/PUBLISH_CHECKLIST.md` | Publish Checklist (Editorial Gate) | Editorial process artifact | Operational |
| SEO_ARCHITECTURE.md | `docs/editorial/SEO_ARCHITECTURE.md` | SEO Architecture: Pilar + Tool | Editorial process artifact | Operational |
| README.md | `docs/governance/README.md` | Governance Index | Documentation index | Governance |
| README.md | `docs/operations/README.md` | Operations Docs | Documentation index | Governance |
| 2026-02-27_gap-audit_v1.md | `docs/operations/audits/closed/2026/2026-02-27_gap-audit_v1.md` | 2026-02-27_gap-audit_v1 | Audit report | Operational |
| 2026-02-27_gap-audit_v1_summary.md | `docs/operations/audits/closed/2026/2026-02-27_gap-audit_v1_summary.md` | Gap Audit v1 — Decision Summary (2026-02-27) | Audit report | Operational |
| repo-audit-export.md | `docs/operations/audits/closed/2026/repo-audit-export.md` | Repo audit export | Audit report | Operational |
| ISSUE-001_devolucion-impuestos-fechas-compensaciones.md | `docs/operations/issues/ISSUE-001_devolucion-impuestos-fechas-compensaciones.md` | ISSUE-001 — Devolución de impuestos: fechas y compensaciones | Editorial issue execution record | Operational |
| ISSUE-002_operacion-renta-f22-checklist.md | `docs/operations/issues/ISSUE-002_operacion-renta-f22-checklist.md` | ISSUE-002 — Operación Renta F22: checklist de revisión y envío | Editorial issue execution record | Operational |
| ISSUE-003_boleta-honorarios-2026-retencion-cobertura.md | `docs/operations/issues/ISSUE-003_boleta-honorarios-2026-retencion-cobertura.md` | ISSUE-003 — Boleta honorarios 2026: retención y cobertura | Editorial issue execution record | Operational |
| ISSUE-004_licencia-medica-desde-que-dia-pagan.md | `docs/operations/issues/ISSUE-004_licencia-medica-desde-que-dia-pagan.md` | ISSUE-004 — Licencia médica: desde qué día pagan y qué hacer si rechazan | Editorial issue execution record | Operational |
| ISSUE-005_deposito-a-plazo-uf-vs-pesos.md | `docs/operations/issues/ISSUE-005_deposito-a-plazo-uf-vs-pesos.md` | ISSUE-005 — Depósito a plazo: UF vs pesos | Editorial issue execution record | Operational |
| ISSUE-006_fondos-mutuos-comisiones-rescate-impuestos.md | `docs/operations/issues/ISSUE-006_fondos-mutuos-comisiones-rescate-impuestos.md` | ISSUE-006 — Fondos mutuos: comisiones, rescate e impuestos | Editorial issue execution record | Operational |
| ISSUE-007_etf-desde-chile-comisiones-custodia-impuestos.md | `docs/operations/issues/ISSUE-007_etf-desde-chile-comisiones-custodia-impuestos.md` | ISSUE-007 — ETFs desde Chile: comisiones, custodia e impuestos | Editorial issue execution record | Operational |
| ISSUE-008_estafas-chile-vishing-portabilidad-falsas-inversiones.md | `docs/operations/issues/ISSUE-008_estafas-chile-vishing-portabilidad-falsas-inversiones.md` | ISSUE-008 — Estafas en Chile: checklist preventivo multicanal | Editorial issue execution record | Operational |
| FEATURED_IMAGE_MIGRATION_REPORT.md | `docs/operations/reports/migrations/FEATURED_IMAGE_MIGRATION_REPORT.md` | Featured Image Migration Report (v3) | Closure/performance report | Operational |
| PERFORMANCE_HARDENING_MOBILE_REPORT.md | `docs/operations/reports/performance/PERFORMANCE_HARDENING_MOBILE_REPORT.md` | Mobile Performance Hardening Report (Astro / GitHub Pages) | Closure/performance report | Operational |
| PERFORMANCE_REMOTE_CLOSURE_REPORT.md | `docs/operations/reports/performance/PERFORMANCE_REMOTE_CLOSURE_REPORT.md` | Remote Performance Closure Report | Closure/performance report | Operational |
| PHASE1_CLOSURE_REPORT.md | `docs/operations/reports/closures/PHASE1_CLOSURE_REPORT.md` | PHASE 1 CLOSURE REPORT | Closure/performance report | Operational |
| README.md | `docs/research/README.md` | Research Docs | Documentation index | Governance |
| deep-research-report.md | `docs/research/deep-research-report.md` | Estrategia de Contenido SEO para Tu Plata Informa | Research dossier | Informational |
| tuplatainforma-contexto.md | `docs/archive/internal-docs/tuplatainforma-contexto.md` | Contexto Maestro — tuplatainforma | Archived historical local context note (non-canonical) | Informational |
| ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026.md | `src/data/blog/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026.md` | ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026 | Published article content | Informational |
| boleta-honorarios-2026-retencion-cobertura.md | `src/data/blog/boleta-honorarios-2026-retencion-cobertura.md` | boleta-honorarios-2026-retencion-cobertura | Published article content | Informational |
| cae-costo-real-credito-chile.md | `src/data/blog/cae-costo-real-credito-chile.md` | cae-costo-real-credito-chile | Published article content | Informational |
| como-calcular-sueldo-liquido.md | `src/data/blog/como-calcular-sueldo-liquido.md` | como-calcular-sueldo-liquido | Published article content | Informational |
| como-cambiarse-de-afp.md | `src/data/blog/como-cambiarse-de-afp.md` | como-cambiarse-de-afp | Published article content | Informational |
| como-hacer-presupuesto-mensual-chile.md | `src/data/blog/como-hacer-presupuesto-mensual-chile.md` | como-hacer-presupuesto-mensual-chile | Published article content | Informational |
| como-invertir-en-etfs-desde-chile.md | `src/data/blog/como-invertir-en-etfs-desde-chile.md` | como-invertir-en-etfs-desde-chile | Published article content | Informational |
| cuanto-descuenta-la-afp-de-tu-sueldo.md | `src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md` | cuanto-descuenta-la-afp-de-tu-sueldo | Published article content | Informational |
| deposito-a-plazo-uf-vs-pesos.md | `src/data/blog/deposito-a-plazo-uf-vs-pesos.md` | deposito-a-plazo-uf-vs-pesos | Published article content | Informational |
| devolucion-impuestos-fechas-compensaciones.md | `src/data/blog/devolucion-impuestos-fechas-compensaciones.md` | devolucion-impuestos-fechas-compensaciones | Published article content | Informational |
| estafas-financieras-chile-vishing-smishing-marketplace.md | `src/data/blog/estafas-financieras-chile-vishing-smishing-marketplace.md` | estafas-financieras-chile-vishing-smishing-marketplace | Published article content | Informational |
| finiquito-e-indemnizaciones-en-chile.md | `src/data/blog/finiquito-e-indemnizaciones-en-chile.md` | finiquito-e-indemnizaciones-en-chile | Published article content | Informational |
| fondos-afp-a-b-c-d-e.md | `src/data/blog/fondos-afp-a-b-c-d-e.md` | fondos-afp-a-b-c-d-e | Published article content | Informational |
| fondos-mutuos-comisiones-rescate-impuestos.md | `src/data/blog/fondos-mutuos-comisiones-rescate-impuestos.md` | fondos-mutuos-comisiones-rescate-impuestos | Published article content | Informational |
| fraude-tarjeta-que-hacer.md | `src/data/blog/fraude-tarjeta-que-hacer.md` | fraude-tarjeta-que-hacer | Published article content | Informational |
| informe-deudas-cmf-vs-dicom.md | `src/data/blog/informe-deudas-cmf-vs-dicom.md` | informe-deudas-cmf-vs-dicom | Published article content | Informational |
| licencia-medica-desde-que-dia-pagan.md | `src/data/blog/licencia-medica-desde-que-dia-pagan.md` | licencia-medica-desde-que-dia-pagan | Published article content | Informational |
| operacion-renta-f22-checklist.md | `src/data/blog/operacion-renta-f22-checklist.md` | operacion-renta-f22-checklist | Published article content | Informational |
| que-es-el-ipc-chile-como-se-calcula.md | `src/data/blog/que-es-el-ipc-chile-como-se-calcula.md` | que-es-el-ipc-chile-como-se-calcula | Published article content | Informational |
| que-es-la-cuenta-2-afp.md | `src/data/blog/que-es-la-cuenta-2-afp.md` | que-es-la-cuenta-2-afp | Published article content | Informational |
| que-es-la-uf.md | `src/data/blog/que-es-la-uf.md` | que-es-la-uf | Published article content | Informational |
| reforma-previsional-2025-que-cambia-y-como-te-afecta.md | `src/data/blog/reforma-previsional-2025-que-cambia-y-como-te-afecta.md` | reforma-previsional-2025-que-cambia-y-como-te-afecta | Published article content | Informational |
| renegociacion-superir.md | `src/data/blog/renegociacion-superir.md` | renegociacion-superir | Published article content | Informational |
| seguro-de-cesantia.md | `src/data/blog/seguro-de-cesantia.md` | seguro-de-cesantia | Published article content | Informational |
| suplantacion-identidad-creditos-no-reconocidos.md | `src/data/blog/suplantacion-identidad-creditos-no-reconocidos.md` | suplantacion-identidad-creditos-no-reconocidos | Published article content | Informational |
| afc.md | `src/data/glossary/afc.md` | afc | Glossary content | Informational |
| afp.md | `src/data/glossary/afp.md` | afp | Glossary content | Informational |
| apv.md | `src/data/glossary/apv.md` | apv | Glossary content | Informational |
| cae.md | `src/data/glossary/cae.md` | cae | Glossary content | Informational |
| cmf.md | `src/data/glossary/cmf.md` | cmf | Glossary content | Informational |
| ctc.md | `src/data/glossary/ctc.md` | ctc | Glossary content | Informational |
| dicom.md | `src/data/glossary/dicom.md` | dicom | Glossary content | Informational |
| ipc.md | `src/data/glossary/ipc.md` | ipc | Glossary content | Informational |
| sbif.md | `src/data/glossary/sbif.md` | sbif | Glossary content | Informational |
| sernac.md | `src/data/glossary/sernac.md` | sernac | Glossary content | Informational |
| sii.md | `src/data/glossary/sii.md` | sii | Glossary content | Informational |
| tmc.md | `src/data/glossary/tmc.md` | tmc | Glossary content | Informational |
| tpm.md | `src/data/glossary/tpm.md` | tpm | Glossary content | Informational |
| uf.md | `src/data/glossary/uf.md` | uf | Glossary content | Informational |
| utm.md | `src/data/glossary/utm.md` | utm | Glossary content | Informational |
| dl-824-impuesto-renta.md | `src/data/laws/dl-824-impuesto-renta.md` | dl-824-impuesto-renta | Law reference content | Informational |
| dl-830-codigo-tributario.md | `src/data/laws/dl-830-codigo-tributario.md` | dl-830-codigo-tributario | Law reference content | Informational |
| ley-18010-credito-dinero.md | `src/data/laws/ley-18010-credito-dinero.md` | ley-18010-credito-dinero | Law reference content | Informational |
| ley-19496-proteccion-consumidor.md | `src/data/laws/ley-19496-proteccion-consumidor.md` | ley-19496-proteccion-consumidor | Law reference content | Informational |
| ley-19628-proteccion-datos.md | `src/data/laws/ley-19628-proteccion-datos.md` | ley-19628-proteccion-datos | Law reference content | Informational |
| ley-19728-seguro-cesantia.md | `src/data/laws/ley-19728-seguro-cesantia.md` | ley-19728-seguro-cesantia | Law reference content | Informational |
| ley-20009-tarjetas-fraude.md | `src/data/laws/ley-20009-tarjetas-fraude.md` | ley-20009-tarjetas-fraude | Law reference content | Informational |
| ley-20555-sernac-financiero.md | `src/data/laws/ley-20555-sernac-financiero.md` | ley-20555-sernac-financiero | Law reference content | Informational |
| ley-20575-datos-comerciales.md | `src/data/laws/ley-20575-datos-comerciales.md` | ley-20575-datos-comerciales | Law reference content | Informational |
| ley-21133-honorarios-retencion.md | `src/data/laws/ley-21133-honorarios-retencion.md` | ley-21133-honorarios-retencion | Law reference content | Informational |
| ley-21236-portabilidad-financiera.md | `src/data/laws/ley-21236-portabilidad-financiera.md` | ley-21236-portabilidad-financiera | Law reference content | Informational |
| ley-21521-fintech.md | `src/data/laws/ley-21521-fintech.md` | ley-21521-fintech | Law reference content | Informational |
| ley-21680-registro-deuda-consolidada.md | `src/data/laws/ley-21680-registro-deuda-consolidada.md` | ley-21680-registro-deuda-consolidada | Law reference content | Informational |
| ley-21719-proteccion-datos-modernizacion.md | `src/data/laws/ley-21719-proteccion-datos-modernizacion.md` | ley-21719-proteccion-datos-modernizacion | Law reference content | Informational |
| proyecto-reforma-previsional-2025.md | `src/data/laws/proyecto-reforma-previsional-2025.md` | proyecto-reforma-previsional-2025 | Law reference content | Informational |

## Stage 2 - Documentation Graph

### Authority inheritance
1. `docs/AI_ENGINEERING_CONSTITUTION.md`
2. `AGENTS.md`
3. `context/*.md`
4. `docs/**`, `.github/**`, `src/data/**` supporting documents

Internal markdown reference edges: **20**.

| Document | Inbound refs |
|---|---:|
| `docs/editorial/DEFINITION_OF_DONE.md` | 9 |
| `archive/context/TECH_DEBT_BACKLOG.md` | 1 |
| `docs/operations/audits/closed/2026/2026-02-27_gap-audit_v1.md` | 1 |
| `docs/operations/issues/ISSUE-001_devolucion-impuestos-fechas-compensaciones.md` | 1 |
| `docs/operations/issues/ISSUE-002_operacion-renta-f22-checklist.md` | 1 |
| `docs/operations/issues/ISSUE-003_boleta-honorarios-2026-retencion-cobertura.md` | 1 |
| `docs/operations/issues/ISSUE-004_licencia-medica-desde-que-dia-pagan.md` | 1 |
| `docs/operations/issues/ISSUE-005_deposito-a-plazo-uf-vs-pesos.md` | 1 |
| `docs/operations/issues/ISSUE-006_fondos-mutuos-comisiones-rescate-impuestos.md` | 1 |
| `docs/operations/issues/ISSUE-007_etf-desde-chile-comisiones-custodia-impuestos.md` | 1 |
| `docs/operations/issues/ISSUE-008_estafas-chile-vishing-portabilidad-falsas-inversiones.md` | 1 |
| `docs/research/deep-research-report.md` | 1 |

Conceptual clusters:
- Governance cluster: Constitution -> AGENTS -> context registries.
- Editorial execution cluster: audits -> research -> backlog -> issues -> DoD.
- Architecture cluster: ADRs, boundaries, structure maps.

## Stage 3 - Structural Issues Detected

1. Root-level docs existed outside `docs/` (`BACKLOG_EDITORIAL.md`, `audit.md`, `project_structure.md`).
2. Mixed flat `docs/` taxonomy blended architecture, operations, and research artifacts.
3. Duplicate-topic drift risk between `docs/` and `context/` for debt/closure/boundary docs.
4. Operational artifacts were split between `docs/audits`, `docs/issues`, and root-level report files.
5. Absolute workstation links in audit artifacts are brittle under path changes.

## Stage 4 - Target Documentation Architecture

```text
docs/
  governance/
  architecture/
  operations/
    audits/
    issues/
    reports/
  development/
  editorial/
  research/
  adr/
```

Why this improves maintainability:
- deterministic lookup by concern;
- lower drift between governance and operational artifacts;
- scalable folder model for future docs.

## Stage 5 - Migration Plan

| File | Old Path | New Path | Action |
|---|---|---|---|
| BACKLOG_EDITORIAL.md | `BACKLOG_EDITORIAL.md` | `docs/development/BACKLOG_EDITORIAL.md` | move |
| audit.md | `audit.md` | `docs/operations/audits/closed/2026/repo-audit-export.md` | move+rename |
| project_structure.md | `project_structure.md` | `docs/architecture/project-structure.md` | move |
| DOMAIN_CONTRACT_BOUNDARIES.md | `docs/DOMAIN_CONTRACT_BOUNDARIES.md` | `docs/architecture/DOMAIN_CONTRACT_BOUNDARIES.md` | move |
| deep-research-report.md | `docs/deep-research-report.md` | `docs/research/deep-research-report.md` | move |
| 2026-02-27_gap-audit_v1.md | `docs/audits/2026-02-27_gap-audit_v1.md` | `docs/operations/audits/closed/2026/2026-02-27_gap-audit_v1.md` | move |
| 2026-02-27_gap-audit_v1_summary.md | `docs/audits/2026-02-27_gap-audit_v1_summary.md` | `docs/operations/audits/closed/2026/2026-02-27_gap-audit_v1_summary.md` | move |
| ISSUE-001_devolucion-impuestos-fechas-compensaciones.md | `docs/issues/ISSUE-001_devolucion-impuestos-fechas-compensaciones.md` | `docs/operations/issues/ISSUE-001_devolucion-impuestos-fechas-compensaciones.md` | move |
| ISSUE-002_operacion-renta-f22-checklist.md | `docs/issues/ISSUE-002_operacion-renta-f22-checklist.md` | `docs/operations/issues/ISSUE-002_operacion-renta-f22-checklist.md` | move |
| ISSUE-003_boleta-honorarios-2026-retencion-cobertura.md | `docs/issues/ISSUE-003_boleta-honorarios-2026-retencion-cobertura.md` | `docs/operations/issues/ISSUE-003_boleta-honorarios-2026-retencion-cobertura.md` | move |
| ISSUE-004_licencia-medica-desde-que-dia-pagan.md | `docs/issues/ISSUE-004_licencia-medica-desde-que-dia-pagan.md` | `docs/operations/issues/ISSUE-004_licencia-medica-desde-que-dia-pagan.md` | move |
| ISSUE-005_deposito-a-plazo-uf-vs-pesos.md | `docs/issues/ISSUE-005_deposito-a-plazo-uf-vs-pesos.md` | `docs/operations/issues/ISSUE-005_deposito-a-plazo-uf-vs-pesos.md` | move |
| ISSUE-006_fondos-mutuos-comisiones-rescate-impuestos.md | `docs/issues/ISSUE-006_fondos-mutuos-comisiones-rescate-impuestos.md` | `docs/operations/issues/ISSUE-006_fondos-mutuos-comisiones-rescate-impuestos.md` | move |
| ISSUE-007_etf-desde-chile-comisiones-custodia-impuestos.md | `docs/issues/ISSUE-007_etf-desde-chile-comisiones-custodia-impuestos.md` | `docs/operations/issues/ISSUE-007_etf-desde-chile-comisiones-custodia-impuestos.md` | move |
| ISSUE-008_estafas-chile-vishing-portabilidad-falsas-inversiones.md | `docs/issues/ISSUE-008_estafas-chile-vishing-portabilidad-falsas-inversiones.md` | `docs/operations/issues/ISSUE-008_estafas-chile-vishing-portabilidad-falsas-inversiones.md` | move |
| FEATURED_IMAGE_MIGRATION_REPORT.md | `docs/FEATURED_IMAGE_MIGRATION_REPORT.md` | `docs/operations/reports/migrations/FEATURED_IMAGE_MIGRATION_REPORT.md` | move |
| PERFORMANCE_HARDENING_MOBILE_REPORT.md | `docs/PERFORMANCE_HARDENING_MOBILE_REPORT.md` | `docs/operations/reports/performance/PERFORMANCE_HARDENING_MOBILE_REPORT.md` | move |
| PERFORMANCE_REMOTE_CLOSURE_REPORT.md | `docs/PERFORMANCE_REMOTE_CLOSURE_REPORT.md` | `docs/operations/reports/performance/PERFORMANCE_REMOTE_CLOSURE_REPORT.md` | move |
| PHASE1_CLOSURE_REPORT.md | `docs/PHASE1_CLOSURE_REPORT.md` | `docs/operations/reports/closures/PHASE1_CLOSURE_REPORT.md` | move |

## Stage 6 - Migration Execution

Executed all plan items with `git mv` semantics and updated references/scripts.

## Stage 7 - Validation

- Local markdown-link integrity scan: pass (no broken `.md` links).
- `pnpm run check:context`: pass.
- `pnpm run build`: pass.

## Stage 8 - ADR

`docs/adr/ADR-20260304-documentation-restructure.md` created with motivation, decisions, taxonomy, and maintenance rules.
