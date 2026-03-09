# Sprint 2A Semantic Report

Date: 2026-03-08
Sprint: `Sprint 2A - Keyword Universe and SERP Intent Architecture`

## What was produced

- `docs/research/seo/strategy/keyword_universe.md`
- `docs/research/seo/strategy/keyword_url_map.md`
- `docs/research/seo/strategy/serp_intent_analysis.md`
- Backlog and progress-log updates reflecting:
  - MB-004 complete
  - MB-028 complete
  - MB-031 complete based on founder-confirmed ownership verification
  - MB-002 reclassified without claiming agent-side authenticated platform access

## Highest-value clusters

### 1. Sueldo liquido y remuneraciones

- Best asset base: strong calculator plus strong explainer.
- Best architectural leverage: supports homepage intent architecture, future internal links, and adjacent tax / pension routing.
- Main gap: no dedicated remuneraciones hub; current `empleo-ingresos` section is too broad.

### 2. Impuestos personales / honorarios / devolucion / operacion renta

- Strong existing URLs with clear procedural intent.
- SERP is official-heavy, but Monedario can compete by reducing friction and clarifying process.
- Main gap: freshness discipline and future utility support for honorarios.

### 3. Cesantia / AFC / proteccion social

- Strong article plus calculator pair already exists.
- SERP is official-heavy, so clarity and support intent matter more than broad head-term ambition.
- Main gap: no dedicated section ownership; currently diluted inside `empleo-ingresos`.

### 4. UF / inflacion / costo de vida / arriendo

- Strong asset set already exists across article + calculator surfaces.
- Main gap is structural, not inventory volume: the cluster is scattered across current site areas and lacks a dedicated section page.

## Strongest current URLs

These are the URLs with the best current semantic fit against their search-intent sets:

- `/calculadoras/sueldo-liquido/`
- `/posts/como-calcular-sueldo-liquido/`
- `/posts/que-es-el-apv/`
- `/calculadoras/apv/`
- `/posts/que-es-la-cuenta-2-afp/`
- `/posts/fondos-afp-a-b-c-d-e/`
- `/posts/informe-deudas-cmf-vs-dicom/`
- `/posts/renegociacion-superir/`
- `/posts/seguro-de-cesantia/`
- `/calculadoras/seguro-cesantia/`
- `/posts/que-es-la-uf/`
- `/calculadoras/reajuste-arriendo/`
- `/posts/operacion-renta-f22-checklist/`
- `/posts/devolucion-impuestos-fechas-compensaciones/`
- `/posts/boleta-honorarios-2026-retencion-cobertura/`
- `/posts/como-hacer-presupuesto-mensual-chile/`

## Biggest content and architecture gaps

### Structural gaps

- `empleo-ingresos` currently bundles three different semantic systems:
  - sueldo / remuneraciones
  - cesantia / proteccion social
  - presupuesto / control financiero
- `UF / IPC / arriendo` lacks a dedicated cluster owner even though the component URLs are already useful.
- `APV` is semantically connected to pensions, but the current site places it under `ahorro-e-inversion`, creating future hub and internal-link ambiguity.

### Content gaps

- No explainer article for `prepago de credito`.
- No explainer article for `pago minimo tarjeta de credito`.
- No explainer article for `reajuste de arriendo`.
- No `fondo de emergencia` page.
- No budgeting utility / planner landing page.

### Cannibalization / ambiguity risks

- `sueldo liquido` article vs calculator must remain differentiated.
- `APV` article vs calculator must remain differentiated.
- `CAE` is ambiguous between `Carga Anual Equivalente` and `Credito con Aval del Estado`; the current glossary should not target the student-loan meaning.

## Backlog changes required

- MB-004 -> `DONE`
- MB-028 -> `DONE`
- MB-031 -> `DONE`
  - Reason: founder-confirmed manual ownership verification satisfies the prerequisite-validation portion of the task.
- MB-002 -> `TODO`
  - Reason: ownership is confirmed, but this environment still lacks authenticated Search Console / Bing access for direct submission and coverage review.
- New task `MB-032`
  - Obtain authenticated agent-side Search Console / Bing access for operational use.
- New task `MB-033`
  - Resolve semantic cluster taxonomy and hub URL strategy before the next cluster-build sprint.

## Recommended next sprint

Recommended next sprint: `Sprint 2B - Taxonomy Realignment and First Cluster Build`

Scope of that sprint:

1. Resolve cluster ownership and hub URL strategy for:
   - sueldo liquido y remuneraciones
   - cesantia / proteccion social
   - UF / inflacion / costo de vida
   - presupuesto / control financiero
2. Build the first cluster around `sueldo liquido y remuneraciones`, because it has:
   - the cleanest calculator-plus-explainer SERP pattern
   - the strongest current asset base
   - the highest homepage and internal-link leverage
3. Queue support-page creation for:
   - `prepago de credito`
   - `pago minimo tarjeta`
   - `reajuste de arriendo`

## Source basis for Sprint 2A

Representative live SERP sources used in this sprint included:

- AFC: https://www.afc.cl/
- ChileAtiende: https://www.chileatiende.gob.cl/
- Banco Central de Chile BDE: https://si3.bcentral.cl/
- INE IPC pages: https://www.ine.gob.cl/
- Superir: https://www.superir.gob.cl/
- Provider / market explainers for APV, Cuenta 2, salary, credit-card minimum payment, and rent adjustment where those page types were visibly ranking.
