# Internal Linking Architecture Map

Date: 2026-03-09
Backlog task: `MB-026`

## Objective

Create one canonical map for the Phase 2 cluster-linking architecture using repo-truth only: live hubs, live articles, live calculators, glossary definitions, legal explainers, and the future hub splits already resolved in prior taxonomy work.

## Canonical inputs

- `docs/development/backlog.md` (`MB-026`, `MB-010` to `MB-015`)
- `docs/development/roadmap.md` (Phase 2 - Authority Building)
- `docs/operations/reports/sprints/sprint-2b/taxonomy_and_hub_strategy.md`
- `docs/operations/reports/sprints/sprint-2b/internal_link_pattern_notes.md`
- `src/pages/guias/**`
- `src/data/blog/**`
- `src/pages/calculadoras/**`
- `src/data/glossary/**`
- `src/data/laws/**`

## Role model

| Asset type | Public pattern | Primary role | Must not do |
|---|---|---|---|
| Hub | `/guias/<cluster>/` | Order entry paths and distribute traffic | Replace the pillar article or calculator |
| Article | `/posts/<slug>/` | Explain one concrete question or case | Absorb the full hub navigation role |
| Calculator | `/calculadoras/<slug>/` | Execute a user-specific result | Pretend to be the canonical explainer |
| Glossary | `/glosario/<slug>/` | Define repeated friction terms | Become the main CTA of a cluster |
| Legal explainer | `/leyes/<slug>/` | Provide normative support | Carry the whole educational narrative |

## Cluster map

### 1. `sueldo-remuneraciones`

- Hub: live at `/guias/sueldo-remuneraciones/`
- Primary articles:
  - `/posts/como-calcular-sueldo-liquido/`
  - `/posts/descuentos-de-sueldo/`
  - `/posts/liquidacion-de-sueldo/`
  - `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/`
- Calculator:
  - `/calculadoras/sueldo-liquido/`
- Glossary support:
  - `/glosario/afp/`
  - `/glosario/afc/`
- Legal support:
  - `/leyes/dl-824-impuesto-renta/`
  - `/leyes/ley-19728-seguro-cesantia/`
- Adjacent exits:
  - `/guias/empleo-ingresos/`
  - `/guias/pensiones-afp/`
- Canonical link pattern:
  - Hub -> pillar + calculator + 3 salary satellites first
  - Article -> hub + calculator + at least 1 sibling article
  - Calculator -> hub + pillar + salary satellites
  - Glossary/legal -> contextual support only
- Evidence:
  - This is the only cluster with a production config source of truth in `src/config/sueldoClusterLinks.ts`.

### 2. `pensiones-afp`

- Hub: live at `/guias/pensiones-afp/`
- Primary articles:
  - `/posts/como-cambiarse-de-afp/`
  - `/posts/fondos-afp-a-b-c-d-e/`
  - `/posts/que-es-la-cuenta-2-afp/`
  - `/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/`
- Shared article with taxonomy crossover:
  - `/posts/que-es-el-apv/`
- Calculators:
  - `/calculadoras/apv/`
  - `/calculadoras/simulador-jubilacion/`
- Glossary support:
  - `/glosario/afp/`
  - `/glosario/apv/`
- Legal support:
  - `/leyes/proyecto-reforma-previsional-2025/`
- Adjacent exits:
  - `/guias/sueldo-remuneraciones/`
  - `/guias/ahorro-e-inversion/`
- Canonical link pattern:
  - Hub -> AFP operational article + funds + Cuenta 2 + APV article/calculator pair
  - APV article -> hub + APV calculator + Cuenta 2 + savings/investing exit
  - Retirement calculator -> APV article or hub, but not as the cluster lead asset
  - Salary-deduction intent must exit to `sueldo-remuneraciones`
- Open gap:
  - APV still lives editorially under `ahorro-e-inversion`; `MB-010` should wire this without duplicating an APV pillar in two clusters.

### 3. `deuda-credito`

- Hub: live at `/guias/deuda-credito/`
- Primary articles:
  - `/posts/cae-costo-real-credito-chile/`
  - `/posts/informe-deudas-cmf-vs-dicom/`
  - `/posts/renegociacion-superir/`
  - `/posts/que-es-la-uf/` (supportive cost-of-credit bridge while UF remains split)
- Calculators:
  - `/calculadoras/credito-consumo/`
  - `/calculadoras/prepago-credito/`
  - `/calculadoras/tarjeta-credito/`
  - `/calculadoras/simulador-renegociacion/`
- Glossary support:
  - `/glosario/cae/`
  - `/glosario/ctc/`
  - `/glosario/cmf/`
  - `/glosario/dicom/`
  - `/glosario/tmc/`
  - `/glosario/uf/`
- Legal support:
  - `/leyes/ley-18010-credito-dinero/`
  - `/leyes/ley-21680-registro-deuda-consolidada/`
  - `/leyes/ley-20555-sernac-financiero/`
- Canonical link pattern:
  - Hub -> diagnostic article + formal-exit article + high-intent calculators
  - Credit calculators -> CAE explainer or debt hub before asking for deeper action
  - Debt articles -> relevant calculator only when intent becomes scenario testing
  - Glossary/legal blocks support regulated terms, not the first CTA
- Open gaps:
  - No plain-language explainer yet for `prepago credito`
  - No plain-language explainer yet for `pago minimo tarjeta`

### 4. `empleo-ingresos` as current cesantia/proteccion-social container

- Hub: live at `/guias/empleo-ingresos/`
- Primary articles:
  - `/posts/seguro-de-cesantia/`
  - `/posts/licencia-medica-desde-que-dia-pagan/`
  - `/posts/finiquito-e-indemnizaciones-en-chile/`
- Calculator:
  - `/calculadoras/seguro-cesantia/`
- Glossary support:
  - `/glosario/afc/`
- Legal support:
  - `/leyes/ley-19728-seguro-cesantia/`
- Adjacent exits:
  - `/guias/sueldo-remuneraciones/`
- Canonical link pattern:
  - Hub -> `seguro-de-cesantia` first for income-loss scenarios
  - Cesantia article -> calculator + AFC glossary + unemployment law
  - Licencia/finiquito content stays inside the same contingency hub unless the user problem becomes monthly payroll
- Current-state decision:
  - Keep cesantia/proteccion social inside `empleo-ingresos` until backlog or taxonomy evidence justifies a separate public hub.

### 5. Future `uf-costo-de-vida`

- Future hub: `/guias/uf-costo-de-vida/`
- Current articles split across live clusters:
  - `/posts/que-es-la-uf/`
  - `/posts/que-es-el-ipc-chile-como-se-calcula/`
- Calculators:
  - `/calculadoras/conversor-uf/`
  - `/calculadoras/reajuste-arriendo/`
- Glossary support:
  - `/glosario/uf/`
  - `/glosario/ipc/`
  - `/glosario/utm/` when tax-adjustment context matters
- Legal support:
  - none purpose-built today
- Canonical link pattern when the hub is built:
  - Hub -> UF explainer + IPC explainer + UF converter + rent-adjustment calculator
  - Explainers -> calculators when the reader already has a contract amount or value to test
  - Cross-cluster exits only to debt or budget when intent narrows
- Blocking gaps:
  - No live dedicated hub
  - No plain-language `reajuste arriendo` support article
  - No dedicated legal explainer for rent-adjustment support

### 6. `impuestos-personas`

- Hub: live at `/guias/impuestos-personas/`
- Primary articles:
  - `/posts/operacion-renta-f22-checklist/`
  - `/posts/devolucion-impuestos-fechas-compensaciones/`
  - `/posts/boleta-honorarios-2026-retencion-cobertura/`
- Calculators:
  - none live today
- Glossary support:
  - `/glosario/sii/`
  - `/glosario/utm/`
- Legal support:
  - `/leyes/dl-824-impuesto-renta/`
  - `/leyes/dl-830-codigo-tributario/`
  - `/leyes/ley-21133-honorarios-retencion/`
- Canonical link pattern:
  - Hub -> F22 checklist as the primary entry
  - F22 and devolución articles cross-link as the main procedural path
  - Honorarios article links back to the hub and to tax-law support when retention or annual coverage is the friction
  - No calculator CTA until a real tax tool exists

### 7. Future `presupuesto-control-financiero`

- Future hub: `/guias/presupuesto-control-financiero/`
- Current article inventory:
  - `/posts/como-hacer-presupuesto-mensual-chile/`
- Adjacent bridge asset already live:
  - `/posts/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026/`
- Calculators:
  - none live today
- Glossary support:
  - none budget-specific today
- Legal support:
  - none purpose-built today
- Canonical link pattern when the hub is built:
  - Hub -> presupuesto pillar first
  - Budget pillar -> future emergency-fund or cash-control satellites
  - Exit to `ahorro-e-inversion` only after household-flow basics are resolved
- Blocking gaps:
  - No dedicated hub
  - No budget tool
  - No emergency-fund satellite or comparable second article

## Shared adjacent hub that remains active

### `ahorro-e-inversion`

- Live hub: `/guias/ahorro-e-inversion/`
- Role in this map:
  - receives cross-cluster exits from APV comparative intent
  - receives cross-cluster exits from presupuesto once surplus-management begins
  - should not absorb sueldo or cesantia entry intent

## Repo-truth implications for later backlog items

- `MB-010` is the clean next implementation target because the live pension hub and its assets already exist, but the APV routing still needs canonical cluster wiring.
- `MB-011` should expand around the two documented debt explainer gaps before broadening the hub narrative.
- `MB-012` cannot truthfully assume a brand-new public hub without first reconciling the current taxonomy decision that keeps cesantia inside `empleo-ingresos`.
- `MB-013` and `MB-015` remain future-hub tasks, but both currently lack the minimum supporting asset count required by the prior taxonomy rule.

## Completion statement

`MB-026` is satisfied by this artifact because the repository now has one explicit, cluster-by-cluster source of truth for:

- hub ownership
- supporting article inventory
- calculator inventory
- glossary and legal support inventory
- cross-cluster exits
- gaps that constrain the next hub sprints
