# Project Structure: tuplatainforma
> *Nota: Se han omitido dependencias, builds y archivos de reporte para optimizar el contexto.*

```text
tuplatainforma/
├── context/
│   ├── CONTRACTS.md
│   ├── CURRENT_STATE.md
│   ├── DOMAIN_CONTRACT_BOUNDARIES.md
│   ├── EDITORIAL_AI_PIPELINE.md
│   ├── EDITORIAL_IMAGE_SYSTEM.md
│   ├── INTER_CLUSTER_LINKING.md
│   ├── INVARIANTS.md
│   ├── MODULE_INDEX.md
│   ├── PHASE1_CLOSURE_REPORT.md
│   ├── PROJECT_CONTEXT_MASTER.md
│   └── TECH_DEBT_BACKLOG.md
├── docs/
│   ├── adr/
│   │   ├── ADR-20260303-editorial-ai-pipeline-enforcement.md
│   │   └── ADR-20260303-editorial-artifacts-gate-phase1.md
│   ├── architecture/
│   │   ├── DOMAIN_CONTRACT_BOUNDARIES.md
│   │   ├── documentation-restructure-workbook.md
│   │   └── project-structure.md
│   ├── audits/
│   ├── development/
│   │   └── BACKLOG_EDITORIAL.md
│   ├── domain/
│   │   └── CONTENT/
│   │       ├── CONTRACTS.md
│   │       ├── INVARIANTS.md
│   │       └── UBIQUITOUS_LANGUAGE.md
│   ├── editorial/
│   │   ├── DEFINITION_OF_DONE.md
│   │   ├── FRONTMATTER_SCHEMA.md
│   │   ├── NORMA_YMYL.md
│   │   ├── PUBLISH_CHECKLIST.md
│   │   └── SEO_ARCHITECTURE.md
│   ├── governance/
│   ├── issues/
│   ├── operations/
│   │   ├── audits/
│   │   │   ├── 2026-02-27_gap-audit_v1.md
│   │   │   ├── 2026-02-27_gap-audit_v1_summary.md
│   │   │   └── repo-audit-export.md
│   │   ├── issues/
│   │   │   ├── ISSUE-001_devolucion-impuestos-fechas-compensaciones.md
│   │   │   ├── ISSUE-002_operacion-renta-f22-checklist.md
│   │   │   ├── ISSUE-003_boleta-honorarios-2026-retencion-cobertura.md
│   │   │   ├── ISSUE-004_licencia-medica-desde-que-dia-pagan.md
│   │   │   ├── ISSUE-005_deposito-a-plazo-uf-vs-pesos.md
│   │   │   ├── ISSUE-006_fondos-mutuos-comisiones-rescate-impuestos.md
│   │   │   ├── ISSUE-007_etf-desde-chile-comisiones-custodia-impuestos.md
│   │   │   └── ISSUE-008_estafas-chile-vishing-portabilidad-falsas-inversiones.md
│   │   └── reports/
│   │       ├── FEATURED_IMAGE_MIGRATION_REPORT.md
│   │       ├── PERFORMANCE_HARDENING_MOBILE_REPORT.md
│   │       ├── PERFORMANCE_REMOTE_CLOSURE_REPORT.md
│   │       └── PHASE1_CLOSURE_REPORT.md
│   ├── reports/
│   │   ├── routes_snapshot_before.json
│   │   ├── rss_snapshot.json
│   ├── research/
│   │   └── deep-research-report.md
│   ├── AI_ENGINEERING_CONSTITUTION.md
│   └── TECH_DEBT_BACKLOG.md
├── archive/
│   └── reports/
│       └── rss_before_phase5.xml
├── output/
│   └── validation/
│       ├── routes_snapshot_after.json
│       └── rss_snapshot_after.json
├── internal-docs/
│   └── tuplatainforma-contexto.md
├── public/
│   ├── fonts/
│   │   ├── fraunces-latin-400-700.7234ed86.woff2
│   │   ├── inter-latin-400.ttf
│   │   ├── inter-latin-400.woff2
│   │   ├── inter-latin-900.ttf
│   │   ├── inter-latin-900.woff2
│   │   └── source-sans-3-latin-400-600.7a19a702.woff2
│   ├── favicon.svg
│   └── tuplatainforma-og.jpg
├── scripts/
│   ├── check-context.mjs
│   ├── check-dialect.mjs
│   ├── check-domain-boundaries.mjs
│   ├── check-editorial-artifacts.mjs
│   ├── check-editorial-guard.mjs
│   ├── check-editorial-structure.mjs
│   ├── check-frontmatter.mjs
│   ├── check-images.mjs
│   ├── check-internal-links.mjs
│   ├── check-no-postid-urls.mjs
│   ├── check-toc-i18n.mjs
│   ├── compare-routes.mjs
│   ├── compare-rss.mjs
│   ├── download-og-fonts.mjs
│   ├── fix-paths.mjs
│   ├── migrate-images-v2.mjs
│   ├── migrate-images-v3.mjs
│   ├── migrate-images.mjs
│   ├── normalize-frontmatter.mjs
│   ├── refresh-economic-snapshot.mjs
│   ├── rss-to-json.mjs
│   └── snapshot-routes.mjs
├── src/
│   ├── application/
│   │   └── use-cases/
│   │       ├── CalculateApvComparison.ts
│   │       ├── CalculateConsumerCredit.ts
│   │       ├── CalculateNetSalary.ts
│   │       ├── CalculateRentAdjustment.ts
│   │       ├── ConvertUf.ts
│   │       ├── EstimateUnemploymentCoverage.ts
│   │       ├── GetEconomicParameters.ts
│   │       ├── SimulateCreditCardCost.ts
│   │       ├── SimulateCreditPrepayment.ts
│   │       ├── SimulateDebtRenegotiation.ts
│   │       └── SimulateRetirementProjection.ts
│   ├── assets/
│   │   ├── icons/
│   │   │   ├── IconArchive.svg
│   │   │   ├── IconArrowLeft.svg
│   │   │   ├── IconArrowNarrowUp.svg
│   │   │   ├── IconArrowRight.svg
│   │   │   ├── IconBrandX.svg
│   │   │   ├── IconCalendar.svg
│   │   │   ├── IconChevronLeft.svg
│   │   │   ├── IconChevronRight.svg
│   │   │   ├── IconEdit.svg
│   │   │   ├── IconFacebook.svg
│   │   │   ├── IconGitHub.svg
│   │   │   ├── IconHash.svg
│   │   │   ├── IconLinkedin.svg
│   │   │   ├── IconMail.svg
│   │   │   ├── IconMenuDeep.svg
│   │   │   ├── IconMoon.svg
│   │   │   ├── IconPinterest.svg
│   │   │   ├── IconRss.svg
│   │   │   ├── IconSearch.svg
│   │   │   ├── IconSunHigh.svg
│   │   │   ├── IconTelegram.svg
│   │   │   ├── IconWhatsapp.svg
│   │   │   └── IconX.svg
│   │   └── images/
│   │       ├── blog/
│   │       │   ├── ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026.avif
│   │       │   ├── boleta-honorarios-2026-retencion-cobertura.avif
│   │       │   ├── cae-costo-real-credito-chile.avif
│   │       │   ├── como-calcular-sueldo-liquido.avif
│   │       │   ├── como-cambiarse-de-afp.avif
│   │       │   ├── como-hacer-presupuesto-mensual-chile.avif
│   │       │   ├── como-invertir-en-etfs-desde-chile.avif
│   │       │   ├── cuanto-descuenta-la-afp-de-tu-sueldo.avif
│   │       │   ├── deposito-a-plazo-uf-vs-pesos.avif
│   │       │   ├── devolucion-impuestos-fechas-compensaciones.avif
│   │       │   ├── estafas-financieras-chile-vishing-smishing-marketplace.avif
│   │       │   ├── finiquito-e-indemnizaciones-en-chile.avif
│   │       │   ├── fondos-afp-a-b-c-d-e.avif
│   │       │   ├── fondos-mutuos-comisiones-rescate-impuestos.avif
│   │       │   ├── fraude-tarjeta-que-hacer.avif
│   │       │   ├── informe-deudas-cmf-vs-dicom.avif
│   │       │   ├── licencia-medica-desde-que-dia-pagan.avif
│   │       │   ├── operacion-renta-f22-checklist.avif
│   │       │   ├── que-es-el-apv.avif
│   │       │   ├── que-es-el-ipc-chile-como-se-calcula.avif
│   │       │   ├── que-es-la-cuenta-2-afp.avif
│   │       │   ├── que-es-la-uf.avif
│   │       │   ├── reforma-previsional-2025-que-cambia-y-como-te-afecta.avif
│   │       │   ├── renegociacion-superir.avif
│   │       │   ├── seguro-de-cesantia.avif
│   │       │   └── suplantacion-identidad-creditos-no-reconocidos.avif
│   │       ├── AstroPaper-v3.png
│   │       ├── AstroPaper-v4.png
│   │       ├── AstroPaper-v5.png
│   │       └── forrest-gump-quote.png
│   ├── components/
│   │   ├── ArticleJsonLd.astro
│   │   ├── ArticlePlaceholder.astro
│   │   ├── BackButton.astro
│   │   ├── BackToTopButton.astro
│   │   ├── Breadcrumb.astro
│   │   ├── Card.astro
│   │   ├── Datetime.astro
│   │   ├── Dropdown.astro
│   │   ├── EditPost.astro
│   │   ├── Footer.astro
│   │   ├── Header.astro
│   │   ├── IndicadorEconomico.astro
│   │   ├── LinkButton.astro
│   │   ├── Pagination.astro
│   │   ├── RelatedPosts.astro
│   │   ├── RevealOnScroll.astro
│   │   ├── SectionDivider.astro
│   │   ├── ShareLinks.astro
│   │   ├── Socials.astro
│   │   └── Tag.astro
│   ├── data/
│   │   ├── blog/
│   │   │   ├── ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026.md
│   │   │   ├── boleta-honorarios-2026-retencion-cobertura.md
│   │   │   ├── cae-costo-real-credito-chile.md
│   │   │   ├── como-calcular-sueldo-liquido.md
│   │   │   ├── como-cambiarse-de-afp.md
│   │   │   ├── como-hacer-presupuesto-mensual-chile.md
│   │   │   ├── como-invertir-en-etfs-desde-chile.md
│   │   │   ├── cuanto-descuenta-la-afp-de-tu-sueldo.md
│   │   │   ├── deposito-a-plazo-uf-vs-pesos.md
│   │   │   ├── devolucion-impuestos-fechas-compensaciones.md
│   │   │   ├── estafas-financieras-chile-vishing-smishing-marketplace.md
│   │   │   ├── finiquito-e-indemnizaciones-en-chile.md
│   │   │   ├── fondos-afp-a-b-c-d-e.md
│   │   │   ├── fondos-mutuos-comisiones-rescate-impuestos.md
│   │   │   ├── fraude-tarjeta-que-hacer.md
│   │   │   ├── informe-deudas-cmf-vs-dicom.md
│   │   │   ├── licencia-medica-desde-que-dia-pagan.md
│   │   │   ├── operacion-renta-f22-checklist.md
│   │   │   ├── que-es-el-apv.mdx
│   │   │   ├── que-es-el-ipc-chile-como-se-calcula.md
│   │   │   ├── que-es-la-cuenta-2-afp.md
│   │   │   ├── que-es-la-uf.md
│   │   │   ├── reforma-previsional-2025-que-cambia-y-como-te-afecta.md
│   │   │   ├── renegociacion-superir.md
│   │   │   ├── seguro-de-cesantia.md
│   │   │   └── suplantacion-identidad-creditos-no-reconocidos.md
│   │   ├── glossary/
│   │   │   ├── afc.md
│   │   │   ├── afp.md
│   │   │   ├── apv.md
│   │   │   ├── cae.md
│   │   │   ├── cmf.md
│   │   │   ├── ctc.md
│   │   │   ├── dicom.md
│   │   │   ├── ipc.md
│   │   │   ├── sbif.md
│   │   │   ├── sernac.md
│   │   │   ├── sii.md
│   │   │   ├── tmc.md
│   │   │   ├── tpm.md
│   │   │   ├── uf.md
│   │   │   └── utm.md
│   │   └── laws/
│   │       ├── dl-824-impuesto-renta.md
│   │       ├── dl-830-codigo-tributario.md
│   │       ├── ley-18010-credito-dinero.md
│   │       ├── ley-19496-proteccion-consumidor.md
│   │       ├── ley-19628-proteccion-datos.md
│   │       ├── ley-19728-seguro-cesantia.md
│   │       ├── ley-20009-tarjetas-fraude.md
│   │       ├── ley-20555-sernac-financiero.md
│   │       ├── ley-20575-datos-comerciales.md
│   │       ├── ley-21133-honorarios-retencion.md
│   │       ├── ley-21236-portabilidad-financiera.md
│   │       ├── ley-21521-fintech.md
│   │       ├── ley-21680-registro-deuda-consolidada.md
│   │       ├── ley-21719-proteccion-datos-modernizacion.md
│   │       └── proyecto-reforma-previsional-2025.md
│   ├── domain/
│   │   ├── content/
│   │   │   └── path.ts
│   │   ├── economic/
│   │   │   └── EconomicParameters.ts
│   │   └── taxation/
│   │       └── TaxEngine.ts
│   ├── i18n/
│   │   └── ui.ts
│   ├── infrastructure/
│   │   └── economic/
│   │       ├── EconomicParameterProvider.ts
│   │       └── economic-parameters.snapshot.json
│   ├── layouts/
│   │   ├── Layout.astro
│   │   ├── Main.astro
│   │   └── PostDetails.astro
│   ├── pages/
│   │   ├── archives/
│   │   │   └── index.astro
│   │   ├── calculadoras/
│   │   │   ├── apv.astro
│   │   │   ├── conversor-uf.astro
│   │   │   ├── credito-consumo.astro
│   │   │   ├── index.astro
│   │   │   ├── prepago-credito.astro
│   │   │   ├── reajuste-arriendo.astro
│   │   │   ├── seguro-cesantia.astro
│   │   │   ├── simulador-jubilacion.astro
│   │   │   ├── simulador-renegociacion.astro
│   │   │   ├── sueldo-liquido.astro
│   │   │   └── tarjeta-credito.astro
│   │   ├── glosario/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── guias/
│   │   │   ├── ahorro-e-inversion/
│   │   │   │   └── index.astro
│   │   │   ├── deuda-credito/
│   │   │   │   └── index.astro
│   │   │   ├── empleo-ingresos/
│   │   │   │   └── index.astro
│   │   │   ├── impuestos-personas/
│   │   │   │   └── index.astro
│   │   │   ├── pensiones-afp/
│   │   │   │   └── index.astro
│   │   │   ├── seguridad-financiera/
│   │   │   │   └── index.astro
│   │   │   └── index.astro
│   │   ├── leyes/
│   │   │   ├── [slug].astro
│   │   │   └── index.astro
│   │   ├── posts/
│   │   │   ├── [...slug]/
│   │   │   │   ├── index.astro
│   │   │   │   └── index.png.ts
│   │   │   └── [...page].astro
│   │   ├── tags/
│   │   │   ├── [tag]/
│   │   │   │   └── [...page].astro
│   │   │   └── index.astro
│   │   ├── 404.astro
│   │   ├── about.astro
│   │   ├── autor.astro
│   │   ├── index.astro
│   │   ├── og.png.ts
│   │   ├── robots.txt.ts
│   │   ├── rss.xml.ts
│   │   └── search.astro
│   ├── scripts/
│   │   └── theme.ts
│   ├── styles/
│   │   ├── global.css
│   │   └── typography.css
│   ├── utils/
│   │   ├── og-templates/
│   │   │   ├── post.js
│   │   │   ├── site.js
│   │   │   └── templateConfig.js
│   │   ├── transformers/
│   │   │   └── fileName.js
│   │   ├── animateCount.ts
│   │   ├── articleView.ts
│   │   ├── categoryIcons.ts
│   │   ├── generateOgImages.ts
│   │   ├── getPath.ts
│   │   ├── getPostsByGroupCondition.ts
│   │   ├── getPostsByTag.ts
│   │   ├── getSortedPosts.ts
│   │   ├── getUniqueTags.ts
│   │   ├── indicadores.ts
│   │   ├── loadGoogleFont.ts
│   │   ├── postFilter.ts
│   │   ├── readingTime.ts
│   │   └── slugify.ts
│   ├── config.ts
│   ├── constants.ts
│   ├── content.config.ts
│   ├── env.d.ts
│   └── remark-collapse.d.ts
├── tests/
│   ├── application/
│   │   └── FinancialUseCases.regression.test.ts
│   ├── domain/
│   │   ├── EconomicParameters.test.ts
│   │   └── TaxEngine.test.ts
│   ├── infrastructure/
│   │   └── EconomicParameterProvider.test.ts
│   └── scripts/
│       └── check-domain-boundaries.test.ts
├── AGENTS.md
├── Dockerfile
├── LICENSE
├── README.md
├── astro.config.ts
├── debug.txt
├── docker-compose.yml
├── eslint.config.js
├── scripts/hero-images/generate_hero.mjs
├── scripts/repo/git_audit_export.py
├── package.json
├── pnpm-lock.yaml
├── scripts/repo/project_structure.py
├── tsconfig.json
└── vitest.config.ts
```
