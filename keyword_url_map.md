# Monedario Sprint 2A - Keyword to URL Map

Sample date: 2026-03-08

## Mapping rules

- Only indexable pages with durable search value are mapped.
- `/search/`, `/tags/`, tag detail pages, and paginated archives are intentionally excluded.
- "Current URL" reflects the repo state in Sprint 2A.
- "Recommended target URL" is included when a new page is clearly justified by fit or cannibalization risk.

| Target keyword or keyword group | Current URL if it exists | Recommended target URL | Page type | Fit quality | Recommended action | Notes |
|---|---|---|---|---|---|---|
| sueldo liquido chile, calculadora sueldo liquido, sueldo bruto a liquido | `/calculadoras/sueldo-liquido/` | `/calculadoras/sueldo-liquido/` | Calculator | strong | keep as primary target | This should remain the main ranking URL for head utility intent |
| descuentos sueldo liquido, liquidacion de sueldo chile, impuesto segunda categoria sueldo | `/posts/como-calcular-sueldo-liquido/` | `/posts/como-calcular-sueldo-liquido/` | Article | strong | refresh existing page | Expand the deductions / liquidacion framing so it does not duplicate the calculator page |
| cuanto descuenta la AFP de tu sueldo | `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/` | `/posts/cuanto-descuenta-la-afp-de-tu-sueldo/` | Article | strong | keep as primary target | Should stay AFP-specific, not broad sueldo liquido |
| finiquito chile, indemnizacion anos de servicio | `/posts/finiquito-e-indemnizaciones-en-chile/` | `/posts/finiquito-e-indemnizaciones-en-chile/` | Article | strong | keep as primary target | Good subcluster support for remuneraciones / laboral cashflow |
| licencia medica desde que dia pagan, subsidio licencia medica | `/posts/licencia-medica-desde-que-dia-pagan/` | `/posts/licencia-medica-desde-que-dia-pagan/` | Article | strong | keep as primary target | Strong problem-solving target; adjacent to ingreso protection |
| sueldo liquido y remuneraciones chile | `/guias/empleo-ingresos/` | `/guias/sueldo-liquido-remuneraciones/` (candidate) | Hub / guide | partial | create new page | Current hub is too broad and does not own the remuneraciones head intent cleanly |
| que es APV, APV chile, beneficio tributario APV | `/posts/que-es-el-apv/` | `/posts/que-es-el-apv/` | Article | strong | refresh existing page | Keep article as explanatory target and push comparisons to the calculator |
| simulador APV, APV regimen A vs B | `/calculadoras/apv/` | `/calculadoras/apv/` | Calculator | strong | keep as primary target | Best current fit for transactional utility intent |
| cuenta 2 AFP, ahorro voluntario AFP, retiro cuenta 2 | `/posts/que-es-la-cuenta-2-afp/` | `/posts/que-es-la-cuenta-2-afp/` | Article | strong | keep as primary target | Strong fit for practical explainer intent |
| fondos AFP A B C D E, que fondo AFP me conviene | `/posts/fondos-afp-a-b-c-d-e/` | `/posts/fondos-afp-a-b-c-d-e/` | Article | strong | refresh existing page | Good fit; avoid drifting into unstable "mejor AFP" comparison tables |
| cambiarme de AFP, como cambiar AFP | `/posts/como-cambiarse-de-afp/` | `/posts/como-cambiarse-de-afp/` | Article | strong | keep as primary target | High procedural fit |
| simulador jubilacion chile, proyeccion pension AFP | `/calculadoras/simulador-jubilacion/` | `/calculadoras/simulador-jubilacion/` | Calculator | partial | refresh existing page | Useful asset, but official/provider tools dominate the broad head term |
| AFP APV cuenta 2 fondos chile | `/guias/pensiones-afp/`, `/guias/ahorro-e-inversion/` | taxonomy decision required before new URL | Hubs / guides | weak | defer | Current split creates mixed ownership between previsional and ahorro intents |
| carga anual equivalente, CAE credito chile | `/posts/cae-costo-real-credito-chile/` | `/posts/cae-costo-real-credito-chile/` | Article | strong | keep as primary target | Strong explainer fit for credit-cost CAE |
| credito de consumo simulador, cuota y CAE credito consumo | `/calculadoras/credito-consumo/` | `/calculadoras/credito-consumo/` | Calculator | strong | keep as primary target | Strong utility page |
| prepago credito chile, conviene prepagar credito, ley 18.010 prepago | `/calculadoras/prepago-credito/` | `/posts/prepago-credito-chile-ley-18010/` (candidate) | Calculator + article support | partial | create new page | Calculator alone does not cover legal/procedural explainer intent |
| pago minimo tarjeta de credito, costo real tarjeta, salir del pago minimo | `/calculadoras/tarjeta-credito/` | `/posts/pago-minimo-tarjeta-credito-chile/` (candidate) | Calculator + article support | partial | create new page | SERP shows editorial explainers and regulation commentary, not only calculators |
| informe deudas CMF, CMF vs DICOM, sacar informe deudas gratis | `/posts/informe-deudas-cmf-vs-dicom/` | `/posts/informe-deudas-cmf-vs-dicom/` | Article | strong | keep as primary target | One of the strongest debt pages in the current inventory |
| renegociacion Superir requisitos, quien puede renegociar deudas | `/posts/renegociacion-superir/` | `/posts/renegociacion-superir/` | Article | strong | keep as primary target | Best fit for procedural query set |
| simulador renegociacion deudas | `/calculadoras/simulador-renegociacion/` | `/calculadoras/simulador-renegociacion/` | Calculator | strong | keep as primary target | Good complementary utility |
| CAE chile, credito con aval del estado | `/glosario/cae/` | none yet | Glossary | weak | avoid targeting due to cannibalization | Current glossary uses `CAE` for `Carga Anual Equivalente`; do not target student-loan CAE with this URL |
| seguro de cesantia chile, como cobrar seguro de cesantia, cuanto pagan | `/posts/seguro-de-cesantia/` | `/posts/seguro-de-cesantia/` | Article | strong | refresh existing page | Best current informational target |
| saldo AFC, CIC, Fondo Solidario de Cesantia | `/posts/seguro-de-cesantia/`, `/glosario/afc/` | `/posts/seguro-de-cesantia/` | Article + glossary support | partial | refresh existing page | Needs stronger subhead coverage and internal links for saldo / CIC / FCS sub-intents |
| calculadora seguro de cesantia, estimar pago AFC | `/calculadoras/seguro-cesantia/` | `/calculadoras/seguro-cesantia/` | Calculator | strong | keep as primary target | Good utility fit |
| cesantia AFC proteccion social chile | `/guias/empleo-ingresos/` | `/guias/cesantia-proteccion-social/` (candidate) | Hub / guide | partial | create new page | Current hub is too mixed to own the cesantia cluster |
| que es la UF, por que sube la UF, como afecta la UF | `/posts/que-es-la-uf/` | `/posts/que-es-la-uf/` | Article | strong | keep as primary target | Strong explainer fit |
| UF a pesos, conversor UF CLP | `/calculadoras/conversor-uf/` | `/calculadoras/conversor-uf/` | Calculator | strong | keep as primary target | Good utility fit |
| valor UF hoy | `/calculadoras/conversor-uf/` | `/calculadoras/conversor-uf/` | Calculator | partial | refresh existing page | Useful, but official data sources dominate exact-value intent |
| que es el IPC, inflacion chile, como se calcula el IPC | `/posts/que-es-el-ipc-chile-como-se-calcula/` | `/posts/que-es-el-ipc-chile-como-se-calcula/` | Article | strong | keep as primary target | Good explainer fit |
| reajuste arriendo UF, reajuste arriendo IPC, calculadora reajuste arriendo | `/calculadoras/reajuste-arriendo/` | `/calculadoras/reajuste-arriendo/` | Calculator | strong | keep as primary target | Current best fit for utility intent |
| como calcular reajuste de arriendo, que dice la clausula de reajuste | none | `/posts/reajuste-arriendo-uf-ipc-chile/` (candidate) | Article | missing | create new page | Needed to support the calculator and capture explainer intent |
| UF inflacion costo de vida arriendo chile | none aligned | `/guias/uf-inflacion-costo-de-vida/` (candidate) | Hub / guide | missing | create new page | Structural gap in current architecture |
| Operacion Renta chile, F22 chile, checklist declaracion renta | `/posts/operacion-renta-f22-checklist/` | `/posts/operacion-renta-f22-checklist/` | Article | strong | keep as primary target | Strong current fit |
| devolucion de impuestos chile, estado devolucion renta, compensaciones TGR | `/posts/devolucion-impuestos-fechas-compensaciones/` | `/posts/devolucion-impuestos-fechas-compensaciones/` | Article | strong | refresh existing page | Needs annual freshness and exact payment-state guidance |
| boleta de honorarios retencion 2026, cuanto recibo liquido honorarios | `/posts/boleta-honorarios-2026-retencion-cobertura/` | `/posts/boleta-honorarios-2026-retencion-cobertura/` | Article | strong | keep as primary target | Strong seasonal / procedural fit |
| simulador honorarios, cotizacion honorarios 2026 | none | none yet | Calculator | missing | defer | Valid opportunity, but not required for the next build sprint |
| presupuesto mensual chile, como hacer un presupuesto mensual | `/posts/como-hacer-presupuesto-mensual-chile/` | `/posts/como-hacer-presupuesto-mensual-chile/` | Article | strong | keep as primary target | Best current fit for beginner budgeting intent |
| control de gastos personales, planificador presupuesto mensual | none | `/calculadoras/presupuesto-mensual/` or equivalent planner URL (candidate) | Utility / planner | missing | create new page | SERP is fragmented and rewards planners/templates |
| fondo de emergencia chile, cuanto ahorrar para emergencias | none | `/posts/fondo-de-emergencia-chile/` (candidate) | Article | missing | create new page | Clear gap in current beginner-finance path |
| presupuesto ahorro control financiero chile | none aligned | `/guias/presupuesto-control-financiero/` (candidate) | Hub / guide | missing | create new page | Distinct cluster from `ahorro-e-inversion` |
| ahorro e inversion chile, instrumentos costos impuestos | `/guias/ahorro-e-inversion/`, `/posts/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026/` | `/guias/ahorro-e-inversion/` with pillar support | Hub + pillar article | strong | keep as primary target | Current section is already useful, but it sits downstream of budgeting needs |
| deposito a plazo UF vs pesos | `/posts/deposito-a-plazo-uf-vs-pesos/` | `/posts/deposito-a-plazo-uf-vs-pesos/` | Article | strong | keep as primary target | Strong short-term savings bridge between budget and investment |

## Immediate cannibalization controls

1. Keep `sueldo liquido` as calculator-first intent on `/calculadoras/sueldo-liquido/`; keep the article focused on deductions, liquidacion, and explanation.
2. Keep `APV regimen A o B` split cleanly: calculator for comparison, article for explanation.
3. Do not use `/glosario/cae/` for student-loan `CAE` intent.
4. Add explainer support pages where calculators already exist but educational intent is under-served: `prepago credito`, `pago minimo tarjeta`, and `reajuste arriendo`.
