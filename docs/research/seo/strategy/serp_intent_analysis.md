# Monedario Sprint 2A - SERP Intent Analysis

SERP sample date: 2026-03-08

## Method

- Representative Chile queries were sampled for each priority cluster.
- Ranking-page observations are based on live public search results available during this sprint.
- "Featured snippet / PAA / FAQ" notes are labeled as either `observed` or `inferred`.
- Inference was necessary in some cases because the browser tool exposed ranking pages reliably, but not every Google UI element directly.

## 1. Sueldo liquido y remuneraciones

Representative query set:

- `sueldo liquido chile`
- `calculadora sueldo liquido`
- `descuentos sueldo liquido`
- `liquidacion de sueldo chile`

Observed SERP pattern:

- Dominant ranking page type: calculator landing pages and editorial explainers.
- Calculators rank: yes, strongly.
- Glossary / definition pages rank: weakly.
- Official government pages dominate: no, not for the broad head term.
- Media / editorial explainers dominate: yes; media and HR/payroll explainers appear consistently.
- Featured snippets / PAA / FAQ boxes: `inferred yes`, because the SERP repeatedly surfaces Q-and-A style explainers and answer-oriented calculator pages.
- SERP architecture signal: Google appears comfortable ranking a mixed stack where a calculator owns the head utility term and an explainer owns the "que descuentan / como se calcula" sub-intent.

Implication for Monedario:

- `/calculadoras/sueldo-liquido/` is the correct primary target for the head term.
- `/posts/como-calcular-sueldo-liquido/` should be refreshed around deductions, liquidacion, and payroll components, not re-optimized as another generic "calculadora" page.
- The current `/guias/empleo-ingresos/` page is too broad to serve as a remuneraciones cluster entry point.

Decision:

- Prioritize calculator landing page plus a dedicated `sueldo liquido y remuneraciones` cluster hub first.

Representative sources:

- https://www.greele.cl/
- https://cuantogano.cl/
- https://www.buk.cl/blog/liquidaciones-de-sueldo-como-calcular-el-sueldo-liquido-y-bruto
- https://www.meganoticias.cl/dato-util/511640-como-calcular-sueldo-liquido-que-es-salario-bruto-1ab.html

## 2. AFP / APV / Cuenta 2 / fondos

Representative query set:

- `APV regimen A regimen B chile`
- `que es APV chile`
- `Cuenta 2 AFP chile`
- `fondos AFP A B C D E chile`
- `simulador jubilacion chile`

Observed SERP pattern:

- Dominant ranking page type: provider help centers, AFP sites, and practical explainers.
- Calculators rank: yes for specific simulation terms, but less consistently for the broad explanatory terms.
- Glossary / definition pages rank: weakly compared with provider FAQ/help content.
- Official government pages dominate: partly. Superintendencia-linked or official explanatory sources show up on `Cuenta 2` and pension-rule queries.
- Media / editorial explainers dominate: not as much as provider/association/help-center content.
- Featured snippets / PAA / FAQ boxes: `inferred yes`, especially on APV and Cuenta 2, because result sets skew toward FAQ/help-center formats.
- SERP architecture signal: Google rewards concrete "how it works / what happens if I withdraw / which regime fits" pages more than generic top-of-funnel taxonomy pages.

Implication for Monedario:

- `/posts/que-es-el-apv/` and `/calculadoras/apv/` are a strong article-plus-tool pair.
- `/posts/que-es-la-cuenta-2-afp/`, `/posts/fondos-afp-a-b-c-d-e/`, and `/posts/como-cambiarse-de-afp/` are viable support assets.
- The current taxonomy is messy: APV sits in `ahorro-e-inversion`, while the rest of the pension decision flow sits in `pensiones-afp`.
- `simulador-jubilacion` should not be treated as the lead asset for the whole cluster because provider and official tools are strong on the broad head term.

Decision:

- Refresh existing article set first and keep the APV calculator as the main utility page; defer broad comparison ambitions and resolve taxonomy before building the next pension-related hub.

Representative sources:

- https://ayuda.fintual.cl/es/articles/3207271-que-apv-me-conviene
- https://www.afpcapital.cl/centro-de-ayuda/preguntas-frecuentes/ahorro-previsional-voluntario/concretamente-que-regimenes-de-tributacion-del-ahorro-previsional-voluntario-existen
- https://www.uno.cl/productos/cuenta2
- https://www.spensiones.cl/portal/institucional/594/w3-propertyvalue-9930.html

## 3. Credito / deuda / CAE / prepago / tarjetas

Representative query set:

- `CAE credito chile`
- `prepago credito chile ley 18.010`
- `pago minimo tarjeta de credito chile`
- `renegociacion Superir`
- `informe deudas CMF vs DICOM`

Observed SERP pattern:

- Dominant ranking page type: explainers, legal/procedural pages, and official pages for regulated processes.
- Calculators rank: yes for `credito de consumo`, `prepago`, and repayment-simulation terms.
- Glossary / definition pages rank: sometimes, but usually beneath stronger explainers or official pages.
- Official government pages dominate: yes on `renegociacion Superir`; partly on regulated credit concepts.
- Media / editorial explainers dominate: yes on `pago minimo tarjeta` and cost-of-credit educational queries.
- Featured snippets / PAA / FAQ boxes: `inferred yes`, because the SERP strongly favors answer-style pages and regulation explainers for debt pain-point queries.
- SERP architecture signal: utility pages alone are not enough. Where money pain is high, Google also wants plain-language articles that explain the rule, the risk, and the action path.

Implication for Monedario:

- `credito-consumo`, `informe deudas CMF vs DICOM`, and `renegociacion Superir` are already credible assets.
- There are two obvious content gaps:
  - no explainer page for `prepago de credito`
  - no explainer page for `pago minimo tarjeta`
- `CAE` is semantically dangerous. Monedario already uses `CAE` for `Carga Anual Equivalente`, but many Chilean users mean `Credito con Aval del Estado`.

Decision:

- Create explainer support pages for `prepago credito` and `pago minimo tarjeta` before expanding the broader debt cluster hub; defer student-loan `CAE` targeting due to acronym ambiguity and topical scope risk.

Representative sources:

- https://www.superir.gob.cl/perfil-deudor-requisito-renegociacion/
- https://www.biobiochile.cl/noticias/servicios/toma-nota/2025/03/05/por-que-no-es-conveniente-hacer-solo-el-pago-minimo-de-tu-tarjeta-de-credito.shtml
- https://www.t13.cl/noticia/nacional/revisa-cuanto-sera-pago-minimo-tarjetas-credito-busca-frenar-sobreendeudamiento-6-6-2025
- https://www.autofact.cl/blog/comprar-auto/financiar/carga-anual-equivalente

## 4. Cesantia / AFC / proteccion social

Representative query set:

- `seguro de cesantia chile`
- `saldo AFC`
- `cuanto pagan seguro de cesantia`
- `Fondo Solidario de Cesantia`

Observed SERP pattern:

- Dominant ranking page type: official AFC and ChileAtiende pages, plus simple explainers.
- Calculators rank: sometimes, but they do not dominate the head term.
- Glossary / definition pages rank: rarely as primary pages.
- Official government pages dominate: yes, clearly.
- Media / editorial explainers dominate: only as secondary support.
- Featured snippets / PAA / FAQ boxes: `inferred yes`, because the result sets are highly FAQ/procedural.
- SERP architecture signal: head terms are official-heavy, but problem-solving sub-intents such as saldo, CIC vs FCS, and payout logic still leave room for a well-structured explainer.

Implication for Monedario:

- `/posts/seguro-de-cesantia/` is the right primary informational URL.
- `/calculadoras/seguro-cesantia/` is useful, but it should support specific scenario intent rather than trying to own the entire cluster.
- Monedario should compete on clarity, comparison, and decision routing around official processes, not by trying to outrank AFC on pure brand or official-intake intent.

Decision:

- Refresh the existing article first and keep the calculator as a secondary landing page; defer a larger hub build until the dedicated cesantia / proteccion social cluster is defined cleanly.

Representative sources:

- https://www.afc.cl/empleadores/esta-formando-una-empresa/que-es-el-seguro-de-cesantia/
- https://www.afc.cl/afc-informa/noticias/como-saber-el-saldo-de-mi-seguro-de-cesantia/
- https://www.afc.cl/afiliados/quedo-cesante-o-esta-cobrando-su-seguro/que-es-el-fondo-solidario-de-cesantia/
- https://www.chileatiende.gob.cl/fichas/ver/12016

## 5. UF / inflacion / costo de vida / arriendo

Representative query set:

- `que es la UF chile`
- `valor UF hoy`
- `que es el IPC chile`
- `reajuste arriendo UF IPC`

Observed SERP pattern:

- Dominant ranking page type: official data sources for exact values, explainers for definitions, and calculators for rent adjustment.
- Calculators rank: yes, strongly on `reajuste arriendo` and conversion intent.
- Glossary / definition pages rank: sometimes, but explainers are stronger for broad educational queries.
- Official government pages dominate: yes on exact-value and methodology intent (`Banco Central`, `INE`).
- Media / editorial explainers dominate: yes on "how does this affect your pocket" framing.
- Featured snippets / PAA / FAQ boxes: `inferred yes`, especially on `UF que es` and `reajuste arriendo`.
- SERP architecture signal: this cluster naturally wants a three-layer stack:
  - official-source-backed reference
  - plain-language explainer
  - calculator for conversion or adjustment

Implication for Monedario:

- `/posts/que-es-la-uf/`, `/posts/que-es-el-ipc-chile-como-se-calcula/`, `/calculadoras/conversor-uf/`, and `/calculadoras/reajuste-arriendo/` are the right base assets.
- The missing piece is an explainer article for `reajuste arriendo`.
- This cluster is structurally split today, which hurts semantic clarity.

Decision:

- Prioritize the calculator landing page plus a new `reajuste arriendo` explainer first; build the dedicated UF / inflacion / costo de vida hub after taxonomy alignment.

Representative sources:

- https://si3.bcentral.cl/Siete/ES/Siete/Cuadro/CAP_PRECIOS/MN_CAP_PRECIOS/UF_IVP_DIARIO/UF_IVP_DIARIO
- https://www.ine.gob.cl/nueva-canasta-ipc
- https://ayudaarriendo.cl/calculadora-reajuste-ipc
- https://ayuda.assetplan.cl/hc/es/articles/25775918169115-Reajuste-de-arriendo-por-UF

## 6. Impuestos personales / honorarios / devolucion / operacion renta

Representative query set:

- `Operacion Renta chile`
- `F22 chile`
- `devolucion de impuestos chile`
- `boleta de honorarios retencion 2026`

Observed SERP pattern:

- Dominant ranking page type: official ChileAtiende/SII/TGR pages for core procedural terms, plus explainers for timing and interpretation.
- Calculators rank: rarely on the broad head terms.
- Glossary / definition pages rank: weakly.
- Official government pages dominate: yes, very clearly.
- Media / editorial explainers dominate: yes on seasonal "when / how / what changed" angles.
- Featured snippets / PAA / FAQ boxes: `inferred yes`, because the result sets are strongly procedural and date-driven.
- SERP architecture signal: Google rewards current, date-specific, process-oriented pages more than evergreen taxonomy pages for the head terms.

Implication for Monedario:

- `/posts/operacion-renta-f22-checklist/`, `/posts/devolucion-impuestos-fechas-compensaciones/`, and `/posts/boleta-honorarios-2026-retencion-cobertura/` are strong candidates.
- The battle here is freshness and clarity, not raw keyword coverage.
- This cluster can win despite official dominance if Monedario focuses on "what this means for a person trying to finish the task without mistakes".

Decision:

- Refresh existing articles first with annual freshness markers and exact procedural support; defer major new hub work until seasonal tax pages are updated for the next cycle.

Representative sources:

- https://www.chileatiende.gob.cl/fichas/ver/10199
- https://www.chileatiende.gob.cl/fichas/4228-pago-de-devolucion-de-renta
- https://www.chileatiende.gob.cl/fichas/12016-cotizacion-de-trabajadores-que-emiten-boletas-de-honorarios
- https://www.sii.cl/

## 7. Presupuesto / control financiero / ahorro

Representative query set:

- `presupuesto mensual chile`
- `control de gastos personales chile`
- `fondo de emergencia chile`
- `ahorro mensual chile`

Observed SERP pattern:

- Dominant ranking page type: fragmented mix of planners, templates, media explainers, and generic budgeting articles.
- Calculators rank: sometimes, especially where a worksheet or planner is available.
- Glossary / definition pages rank: not meaningfully.
- Official government pages dominate: no.
- Media / editorial explainers dominate: partly, but the SERP is much less settled than in tax or pension clusters.
- Featured snippets / PAA / FAQ boxes: `inferred yes`, but the bigger signal is SERP fragmentation rather than one dominant UI feature.
- SERP architecture signal: this is a comparatively open cluster. Practical tools, planners, and beginner-friendly guides have room to win.

Implication for Monedario:

- `/posts/como-hacer-presupuesto-mensual-chile/` is a good starting page.
- There is no `fondo de emergencia` article and no budgeting utility/planner page.
- `ahorro-e-inversion` is not a substitute for a beginner money-control cluster.

Decision:

- Create glossary / explainer support pages first, then prioritize a planner or calculator landing page before attempting a broad budget hub.

Representative sources:

- https://calc.cl/recursos/planificador-presupuesto
- https://www.soychile.cl/Iquique/Publirreportajes/2021/10/13/727489/app-financiera.aspx
- https://www.df.cl/df-mas/videos-df-mas/df-mas-crear-un-presupuesto-mensual-y-poner-atencion-al-plazo-los

## Cross-cluster architectural decisions

1. The first build cluster should be `sueldo liquido y remuneraciones`: strongest current asset base, clear calculator-plus-explainer SERP pattern, and direct homepage architecture value.
2. `UF / inflacion / costo de vida / arriendo` is the clearest structural gap after sueldo because the current URLs are good but semantically scattered.
3. `Cesantia / AFC` and `Impuestos personas` should be refresh-led before hub-led because the head SERPs are official-heavy.
4. `Credito / deuda` needs support explainers for `prepago` and `pago minimo tarjeta` before a broader hub expansion.
5. `Presupuesto / control financiero / ahorro` is a good opportunity cluster, but it needs basic asset creation before it can behave like a real section.
