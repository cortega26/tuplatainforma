# TECH_DEBT_BACKLOG

Fecha de corte: 2026-03-12

## Métricas

### Total de items por urgencia
- **P0:** 3
- **P1:** 11
- **P2:** 13
- **P3:** 1

### Estado de avance (2026-03-12)
- **Completados:** 31 (`TD-0001`, `TD-0002`, `TD-0003`, `TD-0004`, `TD-0005`, `TD-0006`, `TD-0007`, `TD-0008`, `TD-0009`, `TD-0010`, `TD-0011`, `TD-0012`, `TD-0013`, `TD-0014`, `TD-0015`, `TD-0016`, `TD-0017`, `TD-0018`, `TD-0019`, `TD-0020`, `TD-0021`, `TD-0022`, `TD-0023`, `TD-0024`, `TD-0025`, `TD-0026`, `TD-0027`, `TD-0028`, `TD-0029`, `FIX-MDX`, `FIX-LINKS-CALC`)
- **En progreso:** 0
- **Backlog sin iniciar:** 0
- **Backlog en validación/diseño:** 0

> `FIX-MDX`: corregido comentario HTML (`<!-- -->`) en `que-es-el-apv.mdx:25` que rompía el build.
> `FIX-LINKS-CALC`: ampliado `check-internal-links.mjs` para cubrir validación de rutas `/calculadoras/`.

### Top riesgos restantes
| Ranking | ID | Riesgo | Motivo principal |
|---|---|---|---|
| - | - | - | Sin riesgos técnicos abiertos registrados en este backlog. |

### Quick wins (alto impacto / bajo esfuerzo)
- [x] `TD-0007` Corregir email placeholder en enlaces sociales.
- [x] `TD-0005` Limpiar archivos/componentes legacy no usados (`*.bak`, layout/componente huerfano).
- [x] `TD-0006` Alinear plantillas de GitHub con el proyecto real (no AstroPaper upstream).
- [x] `TD-0009` Consolidar estrategia de tipografías (config experimental vs carga real).
- [x] `TD-0022` Corregir cap mensual del Régimen B y copy del recomendador APV.
- [x] `TD-0024` Cambiar “meses mora”/`90` por input coherente de días o meses en renegociación.
- [x] `TD-0026` Validar modo `pesos fijos` de arriendo para bloquear pseudo-resultados en blanco.

---

## TD-0001 — Estrategia de package manager y lockfiles inconsistente
- **ID:** TD-0001
- **Título corto:** Unificar gestor de paquetes y lockfile
- **Descripción:** El repo usa `pnpm` y `npm` en paralelo, con dos lockfiles. Esto abre drift de dependencias y builds no deterministas entre entornos locales, CI y deploy.
- **Evidencia (actualizada):** `package.json` (`packageManager: pnpm@10.30.2`); `package-lock.json` eliminado; `.github/workflows/ci.yml` (`pnpm install --frozen-lockfile`); `.github/workflows/deploy.yml` (`pnpm install --frozen-lockfile` + `pnpm run build`); `Dockerfile` (`corepack prepare pnpm@10.30.2`); `docker-compose.yml` (`pnpm run dev`); `README.md` (flujo `pnpm`).
- **Impacto:** Aumenta riesgo de diferencias entre entornos, fallos intermitentes y fricción de contribución.
- **Riesgo:** alto
- **Severidad (1-5):** 3
- **Urgencia:** P1
- **Esfuerzo estimado:** M
- **Propuesta de solución:** Elegir un único gestor (recomendado: `pnpm` por uso actual en CI), declarar `packageManager` en `package.json`, dejar un lockfile único, alinear workflows/Docker/README/scripts.
- **Criterios de cierre (checklist verificable):**
- [x] Existe un solo lockfile en repo.
- [x] CI y deploy usan el mismo gestor.
- [x] Docker y documentación usan el mismo gestor.
- [x] `npm/pnpm install` no altera árbol de dependencias inesperadamente.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0018 — `astro check` reporta IDs duplicados en artículos del blog
- **ID:** TD-0018
- **Título corto:** Investigar IDs duplicados en loader de contenido
- **Descripción:** `astro check` muestra avisos de `Duplicate id` para varios artículos en `src/data/blog/**` durante el sync de contenido. Aunque el chequeo termina con `0 errors`, el loader indica que entradas posteriores sobreescriben a las anteriores.
- **Evidencia (actualizada):** el warning se observó al inicio de la revisión de repo-truth, pero dejó de reproducirse tras validaciones consecutivas; `pnpm run astro check` pasó dos veces seguidas el 2026-03-11 con `0 errors`, `0 warnings` y solo un hint conocido en `src/layouts/Layout.astro`.
- **Impacto:** Riesgo de sobrescritura silenciosa de contenido, resultados ambiguos en `getCollection()` y diagnósticos menos confiables en validaciones editoriales.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** identificar por qué el loader detecta duplicados para archivos únicos, revisar configuración de colecciones/globs y confirmar si existe duplicación física, alias de carga o colisión de IDs derivadas.
- **Criterios de cierre (checklist verificable):**
- [x] `pnpm run astro check` no reporta `Duplicate id` para `src/data/blog/**`.
- [x] El warning no es reproducible en la validación actual y queda absorbido por el estado vigente del loader.
- [x] `getCollection("blog")` no muestra colisiones activas en las validaciones actuales.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-09
- **Última actualización:** 2026-03-11

## TD-0019 — Snapshot base de rutas quedó desalineado del sitio publicado
- **ID:** TD-0019
- **Título corto:** Actualizar baseline de `check:routes`
- **Descripción:** `pnpm run check:routes` compara contra `docs/reports/routes_snapshot_before.json` y reporta rutas "agregadas" aunque la tarea actual no modificó routing ni slugs. El snapshot base quedó atrasado respecto del contenido ya publicado.
- **Evidencia (actualizada):** `docs/reports/routes_snapshot_before.json` ya refleja `30` rutas publicadas; `pnpm run check:routes` (2026-03-11) retorna `No route changes detected` y `before=30 after=30`.
- **Impacto:** Introduce ruido en la verificación de rutas y reduce la capacidad de detectar regresiones reales de URL en cambios futuros.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** refrescar `docs/reports/routes_snapshot_before.json` con el estado publicado correcto y documentar el procedimiento para actualizar baseline solo cuando corresponda.
- **Criterios de cierre (checklist verificable):**
- [x] `pnpm run check:routes` no reporta altas espurias cuando no hubo cambios de rutas.
- [x] El baseline refleja el estado actual del sitio publicado.
- [x] Queda documentado cuándo y cómo se actualiza el snapshot base.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-09
- **Última actualización:** 2026-03-11

## TD-0020 — Ownership temático y taxonomía editorial inconsistentes
- **ID:** TD-0020
- **Título corto:** Alinear ownership editorial entre cluster, category y hubs
- **Descripción:** El corpus todavía conserva deuda editorial donde `cluster`, `category` y tratamiento en hubs no cuentan exactamente la misma historia. El caso vivo más claro ya no es UF/IPC, sino `como-hacer-presupuesto-mensual-chile`, que sigue en `cluster: empleo-ingresos` con `category: general` mientras su casa semántica definitiva `presupuesto-control-financiero` sigue sin hub productivo.
- **Evidencia (actualizada):** el frente `uf-costo-de-vida` ya quedó endurecido en metadata/frontmatter; el repo mantiene separación entre `canonical owner` y `transitional placement` en `docs/editorial/TOPIC_OWNERSHIP_POLICY.md` y `src/config/editorial-topic-policy.mjs`; `pnpm run audit:topic-overlap` sigue resumiendo transiciones válidas y clasificaciones de hub sin reinterpretar `category: general` como owner definitivo.
- **Impacto:** Riesgo de crecimiento editorial inconsistente, interlinking ambiguo y mayor probabilidad de canibalización a medida que se agreguen nuevas URLs.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** mantener APV con ownership canónico en `ahorro-e-inversion`; conservar presupuesto como única transición explícita pendiente; y seguir endureciendo auditoría/metadata solo cuando exista un cluster productivo real para absorber el cambio.
- **Criterios de cierre (checklist verificable):**
- [x] APV tiene ownership explícito y consistente entre hub, cluster y category.
- [x] `como-hacer-presupuesto-mensual-chile` queda documentado como transición hacia `presupuesto-control-financiero` con condición concreta de migración.
- [x] El frente `uf-costo-de-vida` queda endurecido y sale del registro de transiciones activas.
- [x] `pnpm run audit:topic-overlap` distingue transición válida, core vs related y uso indebido de `category: general`.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-09
- **Última actualización:** 2026-03-11

## TD-0021 — Modelo salarial base insuficiente para calculadoras de sueldo y APV
- **ID:** TD-0021
- **Título corto:** Rehacer base imponible y topes previsionales compartidos
- **Descripción:** Las calculadoras `sueldo-liquido` y `apv` usan `grossSalary` como base total de AFP, salud y parte del cálculo tributario. Eso no cubre imponible real, no imponibles, topes previsionales ni diferencias por tipo de contrato, aunque el propio corpus editorial sí explica esas diferencias.
- **Evidencia (actualizada):** `src/application/use-cases/CalculateMonthlyPayrollBase.ts` centraliza imponible, topes y cotizaciones para sueldo/APV; `src/application/use-cases/CalculateNetSalary.ts` y `src/application/use-cases/CalculateApvComparison.ts` consumen ese motor; `src/pages/calculadoras/sueldo-liquido.astro` y `src/pages/calculadoras/apv.astro` ahora exponen imponible opcional y tipo de contrato; `src/domain/economic/EconomicParameters.ts`, `src/infrastructure/economic/EconomicParameterProvider.ts` y `src/infrastructure/economic/economic-parameters.snapshot.json` versionan tope previsional `90 UF` para AFP/salud y `135,2 UF` para AFC; tests golden agregados en `tests/application/CalculateNetSalary.test.ts` y `tests/application/CalculateApvComparison.test.ts`.
- **Impacto:** Riesgo de falsa precisión en dos calculadoras de alto uso y alto impacto YMYL.
- **Riesgo:** alto
- **Severidad (1-5):** 5
- **Urgencia:** P0
- **Esfuerzo estimado:** L
- **Propuesta de solución:** extraer un motor único de base laboral/imponible con inputs explícitos para imponible, no imponibles, topes AFP/salud/AFC y tipo de contrato; redefinir `sueldo-liquido` como estimador rápido o agregar modo avanzado.
- **Avance actual (2026-03-12):** resuelto con motor compartido `CalculateMonthlyPayrollBase`, inputs visibles de imponible/contrato en ambas calculadoras y fixtures de regresión actualizados. La decisión de contrato quedó trazada en `docs/adr/ADR-20260312-shared-payroll-taxable-base.md`.
- **Criterios de cierre (checklist verificable):**
- [x] `sueldo-liquido` y `apv` comparten una sola fuente de verdad para imponible, topes y cotizaciones.
- [x] Existe input o supuesto visible para diferenciar bruto total vs imponible real.
- [x] El cálculo contempla topes previsionales y causalmente distingue contrato indefinido vs plazo fijo donde corresponda.
- [x] Se agregan fixtures de golden cases con bruto != imponible y con sueldo sobre topes.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-11
- **Última actualización:** 2026-03-12

## TD-0022 — Simulador APV recomienda con un cap de Régimen B incorrecto
- **ID:** TD-0022
- **Título corto:** Corregir cap de Régimen B y rebajar agresividad del recomendador APV
- **Descripción:** El simulador APV calcula el tope mensual con beneficio del Régimen B como `50 UF / 12`, mientras el copy visible lo presenta como `50 UF` mensual. Esto subestima el beneficio tributario, distorsiona la comparación y puede sugerir un régimen equivocado. Además, la decisión A vs B está modelada como binaria pese a que la validación normativa permite combinar aportes bajo ambos regímenes en un mismo año y la conveniencia real depende de la renta líquida imponible, del tramo marginal efectivo y del tope anual bonificable del Régimen A.
- **Evidencia:** `src/application/use-cases/CalculateApvComparison.ts`; `src/pages/calculadoras/apv.astro`; `src/data/blog/que-es-el-apv.mdx`; validación normativa 2026-03-12 en SII (Suplemento Tributario, art. 42 bis) y Superintendencia de Pensiones sobre uso de regímenes A/B y tope conjunto de `600 UF`.
- **Impacto:** La calculadora puede inducir una mala decisión tributaria/previsional justo en el output principal.
- **Riesgo:** crítico
- **Severidad (1-5):** 5
- **Urgencia:** P0
- **Esfuerzo estimado:** M
- **Propuesta de solución:** corregir la fórmula del cap de Régimen B, separar aporte por planilla vs depósito directo si aplica, reemplazar “Recomendado para ti” por una recomendación condicionada y agregar nota explícita sobre casos no cubiertos. Si se mantiene un recomendador, debe contemplar escenario mixto A+B cuando el aporte óptimo no sea puramente binario y explicar la lógica en función de renta imponible/tramo marginal y del tope anual de bonificación del Régimen A.
- **Avance actual (2026-03-12):** el motor ya distingue entre aporte mensual por planilla y aporte directo anual adicional, mantiene el tope mensual de `50 UF` para planilla, aplica el tope anual conjunto de `600 UF` en Régimen B y muestra equivalentes mensuales cuando hay depósitos directos que normalmente se regularizan en Operación Renta. La calculadora conserva la sugerencia orientativa, mantiene la estrategia mixta A+B y ahora muestra el timing tributario correcto para aportes directos.
- **Criterios de cierre (checklist verificable):**
- [x] El cap visible y el cap usado por el motor coinciden.
- [x] La calculadora no subestima el beneficio B por un factor 12.
- [x] El copy distingue recomendación fuerte vs sugerencia condicionada.
- [x] La UX no fuerza una recomendación binaria cuando la estrategia óptima puede ser mixta A+B.
- [x] La lógica mixta, si se implementa, se basa en renta imponible/tramo marginal y no en una banda fija simplificada de sueldo bruto.
- [x] Existen tests para aportes bajo, cerca y sobre el cap mensual/anual.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-11
- **Última actualización:** 2026-03-12

## TD-0023 — Cesantía y jubilación proyectan con supuestos insuficientes para decisión real
- **ID:** TD-0023
- **Título corto:** Endurecer simuladores previsionales de cesantía y jubilación
- **Descripción:** `seguro-cesantia` estima CIC y FCS con proxies demasiado gruesos; `simulador-jubilacion` usa un cronograma simplificado del aporte patronal y no valida escenarios actuariales clave. Ambos outputs son visibles y pueden parecer más exactos de lo que son.
- **Evidencia (actualizada):** `EstimateUnemploymentCoverage` ahora diferencia `balanceSource`, separa CIC vs Fondo Solidario, usa tasas CIC/FCS vigentes por tipo de contrato y expone referencia oficial AFC versionada sin prometer montos FCS; `SimulateRetirementProjection` consume un cronograma versionado en `src/application/use-cases/shared/retirementEmployerContributionSchedule.ts`, aplica tope imponible previsional, modela lagunas (`contributionDensityPercent`) y devuelve escenarios comparativos `conservative/base/aggressive`; `tests/application/EstimateUnemploymentCoverage.test.ts`, `tests/application/SimulateRetirementProjection.test.ts` y `tests/application/FinancialUseCases.regression.test.ts` cubren bordes y regresión.
- **Impacto:** Riesgo alto de decisiones equivocadas en contingencia laboral y planificación previsional.
- **Riesgo:** alto
- **Severidad (1-5):** 4
- **Urgencia:** P1
- **Esfuerzo estimado:** L
- **Propuesta de solución:** dividir cesantía en dos modos (`eligibilidad` y `estimación con saldo real`), modelar FCS solo cuando haya tabla oficial versionada, alinear jubilación con una única fuente de parámetros previsionales y validar expectativa de vida, lagunas y alcance del estimador.
- **Avance actual (2026-03-12):** `seguro-cesantia` ahora distingue saldo real vs saldo estimado, exige confirmación de continuidad para cerrar el filtro base del FCS y deja explícito que los montos FCS se revisan en AFC. `simulador-jubilacion` pasó a usar una sola tabla versionada para el aporte del empleador a la cuenta individual, aplica tope imponible, incorpora lagunas previsionales visibles y muestra escenarios comparativos conservador/base/agresivo, además de fallar explícitamente cuando la expectativa de vida no alcanza para estimar meses de pensión.
- **Criterios de cierre (checklist verificable):**
- [x] Cesantía diferencia claramente CIC real vs saldo estimado.
- [x] Cesantía no promete montos FCS sin tabla/versionado verificable.
- [x] Jubilación usa una sola tabla/versionado para reforma previsional.
- [x] Jubilación falla con mensaje explícito si expectativa de vida <= edad de retiro.
- [x] Se agregan casos borde y escenarios comparativos conservador/base/agresivo.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-11
- **Última actualización:** 2026-03-12

## TD-0024 — Renegociación Superir mezcla unidades de mora y omite filtros legales críticos
- **ID:** TD-0024
- **Título corto:** Separar elegibilidad legal de simulación de cuota en Superir
- **Descripción:** La calculadora usa `months` en el modelo, muestra “Meses mora” en UI, setea `90` por defecto y comunica el requisito legal como `+90 días`. Además, puede marcar `probablemente calificas` sin preguntar por primera categoría, juicios ejecutivos ni completitud documental.
- **Evidencia:** `src/application/use-cases/SimulateDebtRenegotiation.ts`; `src/pages/calculadoras/simulador-renegociacion.astro`; `src/data/blog/renegociacion-superir.md`.
- **Impacto:** Riesgo alto de falso positivo en una herramienta orientada a una decisión formal/regulatoria.
- **Riesgo:** alto
- **Severidad (1-5):** 4
- **Urgencia:** P1
- **Esfuerzo estimado:** M
- **Propuesta de solución:** separar en dos bloques: `filtro legal mínimo` y `simulación financiera`; corregir la unidad temporal; agregar preguntas de exclusión crítica y bajar el lenguaje conclusivo cuando falten antecedentes.
- **Avance actual (2026-03-12):** la calculadora ahora usa `overdueDays` con mínimo legal de `91` días, cambia el input visible a días corridos, agrega preguntas explícitas por primera categoría, juicio ejecutivo/liquidación forzosa notificada y documentación completa, y separa `cumples el filtro básico` de `estás listo para solicitud formal`.
- **Criterios de cierre (checklist verificable):**
- [x] La unidad temporal del input coincide con la regla legal comunicada.
- [x] El default ya no induce `90 meses` como dato implícito.
- [x] La calculadora pregunta por primera categoría y juicios ejecutivos notificados, o explicita que no los cubre antes del resultado.
- [x] El resultado distingue “cumples filtro básico” de “calificas formalmente”.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-11
- **Última actualización:** 2026-03-12

## TD-0025 — Calculadoras de deuda comparten job parcial pero no comparten motor ni framing
- **ID:** TD-0025
- **Título corto:** Consolidar arquitectura de deuda amortizable y comparadores
- **Descripción:** `credito-consumo`, `tarjeta-credito` y `prepago-credito` comparten mecánicas de amortización/costo, pero hoy operan con motores y supuestos separados. Además, `credito-consumo` promete comparación lado a lado sin ofrecerla.
- **Evidencia:** `src/application/use-cases/CalculateConsumerCredit.ts`; `src/application/use-cases/SimulateCreditCardCost.ts`; `src/application/use-cases/SimulateCreditPrepayment.ts`; `src/pages/calculadoras/credito-consumo.astro`; `src/pages/calculadoras/tarjeta-credito.astro`; `src/pages/calculadoras/prepago-credito.astro`.
- **Impacto:** Portafolio menos mantenible, más difícil de ampliar y con promesas UX inconsistentes.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P1
- **Esfuerzo estimado:** M
- **Propuesta de solución:** extraer un motor común de amortización, convertir `credito-consumo` en comparador A/B real y documentar explícitamente cuándo usar tarjeta vs crédito vs prepago.
- **Avance actual (2026-03-12):** se extrajo `src/application/use-cases/shared/creditAmortization.ts` como motor común de amortización, reutilizado por `CalculateConsumerCredit`, `SimulateCreditCardCost` y `SimulateCreditPrepayment`. `credito-consumo` dejó de prometer comparación A/B inexistente y ahora deriva al usuario a la herramienta correcta según necesidad. La landing de calculadoras incorpora un bloque para elegir entre crédito nuevo, tarjeta o prepago, y los tests verifican equivalencia del motor compartido con escenarios ya publicados.
- **Criterios de cierre (checklist verificable):**
- [x] Existe un módulo común de amortización reutilizado por las tres superficies.
- [x] `credito-consumo` cumple o deja de prometer comparación A/B.
- [x] La landing de calculadoras ayuda a escoger la herramienta correcta en deuda/crédito.
- [x] Los tests cubren equivalencia entre motor común y casos actuales donde siga aplicando.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-11
- **Última actualización:** 2026-03-12

## TD-0026 — Faltan inputs críticos y validaciones visibles en prepago y arriendo
- **ID:** TD-0026
- **Título corto:** Endurecer validaciones y supuestos en prepago y arriendo
- **Descripción:** `prepago-credito` no pide comisión de prepago ni valida consistencia entre saldo/cuota/plazo; `reajuste-arriendo` en modo `pesos fijos` puede producir un pseudo-resultado con `$0` si el usuario no ingresa monto.
- **Evidencia:** `src/application/use-cases/SimulateCreditPrepayment.ts`; `src/pages/calculadoras/prepago-credito.astro`; `src/pages/calculadoras/reajuste-arriendo.astro`.
- **Impacto:** Riesgo de recomendaciones binarias engañosas y de outputs basura por inputs incompletos.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** agregar comisión de prepago, validación de coherencia contractual y bloqueo explícito de resultados en blanco; reemplazar `alert()` por errores inline contextualizados.
- **Avance actual (2026-03-12):** `prepago-credito` ahora pide comisión/costo de prepago con supuesto visible en `0`, descuenta ese costo del beneficio neto y rechaza escenarios donde la cuota no amortiza razonablemente el crédito. `reajuste-arriendo` bloquea el modo `pesos fijos` si falta monto y ambas calculadoras muestran errores inline en vez de depender solo de `alert()`.
- **Criterios de cierre (checklist verificable):**
- [x] `prepago-credito` contempla comisión/costo de prepago o explicita antes del cálculo que asume cero.
- [x] `prepago-credito` detecta inputs incompatibles que no amortizan razonablemente.
- [x] `reajuste-arriendo` no devuelve pseudo-resultados con monto vacío.
- [x] Los errores se muestran inline y no solo por `alert()`.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-11
- **Última actualización:** 2026-03-12

## TD-0027 — Portafolio de calculadoras creció sin una taxonomía de decisión visible
- **ID:** TD-0027
- **Título corto:** Reordenar landing y política de creación/fusión de calculadoras
- **Descripción:** El portafolio actual es útil pero se presenta como una lista plana. Eso deja fronteras borrosas entre herramientas cercanas y no explicita una política reusable para crear, extender, fusionar o eliminar calculadoras.
- **Evidencia (actualizada):** `src/config/calculatorPortfolio.ts` centraliza familias, JTBD, fronteras y guías de elección; `src/pages/calculadoras/index.astro` renderiza el landing desde esa fuente de verdad en cuatro familias con ayuda visible para casos cercanos; `docs/operations/runbooks/calculator-portfolio-policy.md` fija el intake obligatorio con JTBD y riesgo de overlap; `tests/application/CalculatorPortfolio.test.ts` evita rutas duplicadas y omisiones de metadata crítica.
- **Impacto:** Mayor riesgo de canibalización, navegación ineficiente y expansión desordenada del producto.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** reordenar `/calculadoras/` por familias (`Ingresos`, `Ahorro/Previsión`, `Deuda/Crédito`, `Vivienda/UF`), agregar ayudantes de elección y convertir la política de portfolio en checklist operativa antes de crear nuevas herramientas.
- **Criterios de cierre (checklist verificable):**
- [x] La landing agrupa calculadoras por familia y no solo por lista plana.
- [x] Existe ayuda visible para escoger entre calculadoras parcialmente cercanas.
- [x] La política de creación/fusión/extensión queda documentada y referenciable en backlog o docs operativos.
- [x] Nuevas propuestas de calculadoras deben declarar JTBD distinto y riesgo de overlap.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-11
- **Última actualización:** 2026-03-12

## TD-0028 — Artículo APV publicado usa bandas de sueldo y recomendación A/B demasiado rígidas
- **ID:** TD-0028
- **Título corto:** Rehacer refresh YMYL de `que-es-el-apv` para recomendación A/B/mixta trazable
- **Descripción:** El artículo `que-es-el-apv.mdx` explica bien la mecánica base del APV, pero hoy traduce la decisión de Régimen A vs B a bandas fijas de sueldo bruto (`<$4.800.000`, `>$4.800.000`, `$4.800.000-$8.000.000`, `>$8.000.000`) y a una recomendación de combinación A+B que no queda suficientemente anclada en fuentes oficiales ni en renta líquida imponible/tramo marginal efectivo. Tras la revisión de `TD-0022`, esa sección quedó desalineada del criterio más defendible para el producto y puede inducir una elección tributaria demasiado simplificada en un artículo YMYL publicado.
- **Evidencia (actualizada):** `src/data/blog/que-es-el-apv.mdx` ahora reemplaza la tabla por sueldo bruto con una respuesta rápida anclada en renta líquida imponible, tasa marginal y remanente del bono A; `artifacts/editorial/que-es-el-apv/20260312-0928-codex/` contiene `brief`, `dossier`, `outline`, `draft`, `math audit`, `compliance`, `publish packet`, `metadata` y `sources`; validación primaria 2026-03-12 en SII (`impuesto2026.htm`, `001_140_5883.htm`, `ja287.htm`, `circu24.pdf`) y Superintendencia de Pensiones (`w3-propertyvalue-9929.html`, `w3-propertyvalue-2929.html`).
- **Impacto:** Riesgo alto de orientación imprecisa en una pieza YMYL publicada que ayuda a elegir un beneficio tributario/previsional.
- **Riesgo:** alto
- **Severidad (1-5):** 4
- **Urgencia:** P1
- **Esfuerzo estimado:** M
- **Propuesta de solución:** ejecutar refresh editorial completo con pipeline YMYL para `que-es-el-apv`; reemplazar la tabla de bandas fijas de sueldo por una respuesta rápida con vigencia y fuentes oficiales; explicar la lógica A/B/mixta como resumen orientativo en función de renta líquida imponible, tramo marginal y agotamiento del tope bonificable del Régimen A; actualizar `updatedDate` y publish packet con math/compliance review.
- **Criterios de cierre (checklist verificable):**
- [x] El artículo ya no usa bandas fijas de sueldo bruto como regla central de decisión A vs B.
- [x] La sección de recomendación A/B/mixta tiene respuesta rápida, vigencia explícita y al menos una fuente oficial crítica por regla.
- [x] La combinación A+B queda presentada como resumen orientativo condicionado, no como regla universal de “muchos asesores”.
- [x] El artículo queda alineado con la lógica vigente del simulador APV o explicita cualquier diferencia residual mientras `TD-0021` siga abierto.
- [x] El refresh incluye artifact chain editorial completo (`brief`, `dossier`, `outline`, `draft`, `math audit`, `compliance`, `publish packet`).
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-12
- **Última actualización:** 2026-03-12

## TD-0029 — Fichas legales de cesantía y reforma previsional quedaron desalineadas del modelado vigente
- **ID:** TD-0029
- **Título corto:** Actualizar fichas legales de cesantía y reforma previsional según parámetros oficiales vigentes
- **Descripción:** Durante `TD-0023` quedó en evidencia que `src/data/laws/ley-19728-seguro-cesantia.md` y `src/data/laws/proyecto-reforma-previsional-2025.md` resumen porcentajes y cronogramas que ya no calzan exactamente con el modelado oficial usado por las calculadoras. El runtime quedó endurecido, pero la capa documental todavía puede inducir una lectura distinta.
- **Evidencia (actualizada):** `src/data/laws/ley-19728-seguro-cesantia.md` ahora explicita la distribución vigente CIC/FCS (1,6% + 0,8% + 0,6% para indefinido; 2,8% + 0,2% para plazo fijo/obra/servicio), los mínimos CIC/FCS y las tablas FCS vigentes al 2026-03-12 con fecha de corte visible; `src/data/laws/proyecto-reforma-previsional-2025.md` distingue implementación actual vs régimen 2033, explicita que hoy solo 0,1% del nuevo 1% va directo a cuenta individual y documenta el cronograma usado por `src/application/use-cases/shared/retirementEmployerContributionSchedule.ts`; validación primaria 2026-03-12 en AFC, ChileAtiende, BCN y Superintendencia de Pensiones.
- **Impacto:** Riesgo de que una ficha legal interna contradiga la lógica visible de calculadoras YMYL ya corregidas.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** refrescar ambas fichas legales con cifras, cortes temporales y notas de alcance alineadas con las fuentes primarias ya usadas por el runtime, sin introducir reglas simplificadas que mezclen cuenta individual con componentes colectivos.
- **Criterios de cierre (checklist verificable):**
- [x] La ficha de cesantía refleja tasas CIC/FCS y mínimos vigentes.
- [x] La ficha de reforma previsional distingue con claridad el tramo que va directo a la cuenta individual.
- [x] Las dos fichas explicitan fecha de corte y fuente primaria crítica.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-12
- **Última actualización:** 2026-03-12

## TD-0011 — Pilar CAE/costo real sin artículo editorial
- **ID:** TD-0011
- **Título corto:** Cubrir pilar faltante CAE/costo real
- **Descripción:** Existe brecha editorial en query/pilar de CAE y costo real del crédito; hoy no hay artículo dedicado.
- **Evidencia (actualizada):** el artículo canónico existe en `src/data/blog/cae-costo-real-credito-chile.md`; la tabla editorial marca ED-009 como `DONE` y el hub de deuda/crédito ya lo enlaza como pieza activa.
- **Impacto:** Cobertura incompleta del cluster de deuda/crédito y menor capacidad de respuesta a intención informativa.
- **Riesgo:** bajo-medio
- **Severidad (1-5):** 2
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** Crear artículo pilar CAE/costo real con fuentes primarias y enlazado interno desde guías/relacionados.
- **Criterios de cierre (checklist verificable):**
- [x] Existe artículo pilar publicado para CAE/costo real con frontmatter válido.
- [x] Incluye fuentes primarias y enlaces internos del cluster correspondiente.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-02
- **Última actualización:** 2026-03-11

## TD-0012 — Falta `updatedDate` en batch original de artículos
- **ID:** TD-0012
- **Título corto:** Normalizar señal de frescura editorial
- **Descripción:** Parte del batch original sigue sin `updatedDate`, lo que dificulta distinguir contenido revisado sustantivamente.
- **Evidencia (actualizada):** revisión repo-truth del corpus publicado (`src/data/blog/**`) al 2026-03-11 muestra `updatedDate` presente en los 30 artículos del blog; el backlog editorial seguía con filas desactualizadas.
- **Impacto:** Señal de frescura inconsistente en contenidos de alto impacto informativo.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Agregar `updatedDate` solo en revisiones sustantivas verificables; evitar fechas ficticias o mecánicas.
- **Criterios de cierre (checklist verificable):**
- [x] Cada artículo del batch original actualizado sustantivamente declara `updatedDate`.
- [x] No existen `updatedDate` faltantes en el corpus publicado actual.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-02
- **Última actualización:** 2026-03-11

## TD-0015 — `check:urls:ci` depende de hosts externos para métricas no bloqueantes
- **ID:** TD-0015
- **Título corto:** Aislar escaneo interno del ruido externo en URL checks
- **Descripción:** El flujo `check:urls:ci` sigue consultando hosts externos para reportar `external_failures`; esto introduce timeouts intermitentes y variación de latencia aunque el gate bloqueante solo depende de `internal_broken`.
- **Evidencia (actualizada):** `scripts/check-urls.mjs` ahora expande `linksToSkip` para omitir hosts externos salvo en `--external-audit`; `pnpm run check:urls:ci` (2026-03-11) retorna `internal_broken=0 external_failures=0`, mientras `pnpm run check:urls:external:audit` sigue reportando `external_failures=2` (`www.dt.gob.cl` 404, `www.pdichile.cl` 403) en modo no bloqueante.
- **Impacto:** Incrementa ruido operacional y puede ocultar señales internas relevantes en revisiones rápidas.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** separar modos de chequeo (`internal-only` bloqueante y `external-observability` informativo) o bloquear recursión externa en CI cuando no se esté ejecutando auditoría de externos.
- **Criterios de cierre (checklist verificable):**
- [x] `check:urls:ci` no realiza requests a hosts externos por defecto.
- [x] Se mantiene un comando explícito para auditoría externa no bloqueante.
- [x] El reporte final distingue claramente estado interno (SLO) de telemetría externa.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-04
- **Última actualización:** 2026-03-11

## TD-0016 — Corpus YMYL legacy sin paquetes de artefactos editoriales
- **ID:** TD-0016
- **Título corto:** Backfill de artefactos YMYL legacy
- **Descripción:** La deuda historica de artefactos YMYL legacy quedo cerrada: todo el corpus publicado ya tiene `artifacts/editorial/<slug>/<run-id>/` minimos (`01-brief.yaml`, `02-dossier.md`, `fecha_corte`, `sources`) para enforcement repo-wide.
- **Evidencia (actualizada):** `EDITORIAL_ENFORCE=1 pnpm run check:editorial` (2026-03-11) reporta `ymyl_posts=28 compliant=28 non_compliant=0` tras backfill de ocho batches: `impuestos-personas`, `empleo-ingresos-laboral`, `sueldo-remuneraciones-core` (`como-calcular-sueldo-liquido`, `cuanto-descuenta-la-afp-de-tu-sueldo`), `prevision-core` (`como-cambiarse-de-afp`, `fondos-afp-a-b-c-d-e`, `que-es-la-cuenta-2-afp`, `reforma-previsional-2025-que-cambia-y-como-te-afecta`), `seguridad-financiera` (`estafas-financieras-chile-vishing-smishing-marketplace`, `fraude-tarjeta-que-hacer`, `suplantacion-identidad-creditos-no-reconocidos`), `deuda-credito-core` (`cae-costo-real-credito-chile`, `informe-deudas-cmf-vs-dicom`, `que-es-la-uf`, `renegociacion-superir`) y `ahorro-inversion-core` (`ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026`, `como-invertir-en-etfs-desde-chile`, `deposito-a-plazo-uf-vs-pesos`, `fondos-mutuos-comisiones-rescate-impuestos`, `interes-compuesto-nota-metodologica`, `que-es-el-apv`).
- **Impacto:** Riesgo alto de deuda editorial invisible y de falsos bloqueos en CI cuando el gate se aplica fuera del diff tocado.
- **Riesgo:** alto
- **Severidad (1-5):** 4
- **Urgencia:** P1
- **Esfuerzo estimado:** L
- **Propuesta de solución:** Backfill por cluster de los paquetes editoriales mínimos para cada artículo YMYL legacy, usando `pnpm run scaffold:editorial-artifacts` para iniciar cada run en la carpeta canónica y manteniendo la enforcement estricta de PR limitada al diff hasta cerrar la deuda.
- **Criterios de cierre (checklist verificable):**
- [x] Existe un scaffold reproducible para crear `artifacts/editorial/<slug>/<run-id>/` con la estructura completa del pipeline.
- [x] `EDITORIAL_ENFORCE=1 pnpm run check:editorial` pasa sobre todo el corpus.
- [x] Cada artículo YMYL publicado tiene `01-brief.yaml` y `02-dossier.md` con `fecha_corte` y `sources` válidos.
- [x] El backlog editorial deja de requerir scoping por diff para evitar bloqueos ajenos al cambio.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-06
- **Última actualización:** 2026-03-11

## TD-0017 — Fonts con rutas relativas rompen en rutas anidadas
- **ID:** TD-0017
- **Título corto:** Corregir carga de tipografías en rutas anidadas
- **Descripción:** Las reglas `@font-face` en `src/styles/global.css` usan URLs relativas (`../fonts/...`) que en rutas anidadas terminan resolviendo a `/guias/fonts/...` y generan `404`, dejando al navegador en fallback tipográfico.
- **Evidencia (actualizada):** `src/styles/global.css` usa rutas absolutas `/fonts/...`; los assets existen en `public/fonts/`; `pnpm run build` (2026-03-11) completa sin warnings de Vite por esas fuentes ni fallos posteriores en `check:urls`.
- **Impacto:** Riesgo de tipografías incorrectas en páginas internas, diferencias visuales entre rutas y ruido de consola que dificulta validar otros cambios frontend.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Convertir las URLs de `@font-face` a rutas estables resueltas por Astro/Vite (import de assets o rutas absolutas públicas) y verificar carga correcta en `/` y en rutas anidadas.
- **Criterios de cierre (checklist verificable):**
- [x] No hay evidencia actual de `404` por esas fuentes en la build/local validation activa.
- [x] `pnpm run build` no emite warnings por esas dos referencias de fuentes.
- [x] La carga usa rutas absolutas estables y assets públicos presentes.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-08
- **Última actualización:** 2026-03-11

## TD-0013 — Respuestas YMYL abstractas en licencia/finiquito
- **ID:** TD-0013
- **Título corto:** Concretar reglas en piezas laborales críticas
- **Descripción:** Artículos de licencia y finiquito tenían respuestas abstractas en puntos de intención de búsqueda y efecto legal.
- **Evidencia (actualizada):** ajustes en `src/data/blog/licencia-medica-desde-que-dia-pagan.md` y `src/data/blog/finiquito-e-indemnizaciones-en-chile.md` con reglas explícitas de pago/causales.
- **Impacto:** Riesgo de mala interpretación de reglas laborales por ambigüedad de redacción.
- **Riesgo:** alto
- **Severidad (1-5):** 4
- **Urgencia:** P1
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Mantener tablas/reglas directas por causal y por tramo de días en artículos YMYL.
- **Criterios de cierre (checklist verificable):**
- [x] Artículo de licencia responde explícitamente regla `<11 días` y pagador.
- [x] Artículo de finiquito enumera causales y efecto legal básico en indemnización.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-02
- **Última actualización:** 2026-03-02

## TD-0014 — Reforma previsional 2025-2027 no explicitada en piezas AFP prioritarias
- **ID:** TD-0014
- **Título corto:** Alinear contenidos AFP a calendario de reforma
- **Descripción:** Faltaba separar en artículos prioritarios AFP qué cambia hoy y qué cambia entre 2025-2027.
- **Evidencia (actualizada):** bloques agregados en `src/data/blog/cuanto-descuenta-la-afp-de-tu-sueldo.md` y `src/data/blog/fondos-afp-a-b-c-d-e.md`.
- **Impacto:** Riesgo de desalineación normativa en contenidos previsionales de alto tráfico.
- **Riesgo:** alto
- **Severidad (1-5):** 4
- **Urgencia:** P1
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Mantener bloque estructurado de vigencia con calendario y distinción "hoy vs después".
- **Criterios de cierre (checklist verificable):**
- [x] Ambos artículos prioritarios incluyen bloque "Qué cambia entre 2025 y 2027".
- [x] Se documenta 7% empleador, fondos generacionales y calendario de implementación.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-02
- **Última actualización:** 2026-03-02

## TD-0002 — Valores financieros hardcodeados con fecha fija
- **ID:** TD-0002
- **Título corto:** Externalizar UF/UTM/TMC y fechas de referencia
- **Descripción:** Varias calculadoras usan constantes numéricas y textos de fecha incrustados (UF, UTM, TMC, IPC, referencias “2025/2026”). Esto envejece resultados y compromete confiabilidad.
- **Evidencia (actualizada):** `src/domain/economic/EconomicParameters.ts` (contrato + invariantes), `src/infrastructure/economic/EconomicParameterProvider.ts` (fuente única + fallback controlado + telemetría + memoización), `src/application/use-cases/GetEconomicParameters.ts`, consumo en `src/pages/calculadoras/{apv,conversor-uf,sueldo-liquido,seguro-cesantia,reajuste-arriendo,simulador-renegociacion}.astro` + `src/utils/indicadores.ts`, documentación en `README.md` ("Economic Data Governance & Fallback Strategy"), pruebas en `tests/infrastructure/EconomicParameterProvider.test.ts`.
- **Impacto:** Riesgo de recomendaciones/cálculos desactualizados, pérdida de confianza y soporte correctivo frecuente.
- **Riesgo:** alto
- **Severidad (1-5):** 5
- **Urgencia:** P0
- **Esfuerzo estimado:** M
- **Propuesta de solución:** Centralizar parámetros económicos en un módulo/fuente única con timestamp; cargar valores dinámicos en build/runtime con fallback explícito y banner de vigencia; eliminar fechas hardcodeadas de copy.
- **Criterios de cierre (checklist verificable):**
- [x] Existe una sola fuente de valores económicos para calculadoras.
- [x] Ninguna calculadora contiene fechas hardcodeadas en texto UI.
- [x] Se muestra fecha/hora efectiva de actualización de datos.
- [x] Fallback y comportamiento offline están documentados y probados.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0003 — Lógica tributaria duplicada entre calculadoras
- **ID:** TD-0003
- **Título corto:** Extraer motor de impuesto de segunda categoría
- **Descripción:** La tabla de tramos y funciones de cálculo están duplicadas en más de una calculadora. Cambios legales futuros pueden quedar aplicados en una página y omitidos en otra.
- **Evidencia (actualizada):** `src/domain/taxation/TaxEngine.ts`; `src/application/use-cases/{CalculateNetSalary,CalculateApvComparison}.ts`; consumo desde `src/pages/calculadoras/sueldo-liquido.astro` y `src/pages/calculadoras/apv.astro`; regresión de tramos/tasa marginal/redondeo en `tests/domain/TaxEngine.test.ts`.
- **Impacto:** Riesgo de resultados inconsistentes, mantenimiento costoso y errores silenciosos.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P1
- **Esfuerzo estimado:** M
- **Propuesta de solución:** Crear util compartida tipada (por ejemplo `src/utils/tax.ts`) con pruebas de casos límite; consumir desde ambas calculadoras.
- **Criterios de cierre (checklist verificable):**
- [x] Existe un único módulo de cálculo tributario reutilizable.
- [x] Calculadoras APV y sueldo líquido usan el mismo módulo.
- [x] Se agregan tests de regresión para tramos y tasa marginal.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0004 — Ausencia de tests automáticos para lógica financiera
- **ID:** TD-0004
- **Título corto:** Incorporar pruebas unitarias para cálculos críticos
- **Descripción:** No existe pipeline de tests; el control actual es lint/formato/build. Las calculadoras contienen lógica numérica extensa y sensible a regresiones.
- **Evidencia (actualizada):** `package.json` (`test: vitest run`); `vitest.config.ts`; `.github/workflows/ci.yml` ejecuta `check:boundaries`, `lint`, `format:check`, `test`, `build`; suites en `tests/domain/`, `tests/application/`, `tests/infrastructure/`.
- **Impacto:** Mayor probabilidad de errores en producción al cambiar reglas financieras o refactorizar.
- **Riesgo:** alto
- **Severidad (1-5):** 4
- **Urgencia:** P1
- **Esfuerzo estimado:** L
- **Propuesta de solución:** Introducir framework de tests (p. ej. Vitest), extraer funciones de cálculo a `src/utils/` y cubrir escenarios base/edge.
- **Criterios de cierre (checklist verificable):**
- [x] CI ejecuta tests y falla ante regresiones.
- [x] Cálculos clave (sueldo, APV, crédito, cesantía) tienen cobertura mínima acordada.
- [x] Casos de borde (0, topes, tasas extremas, plazos) están cubiertos.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0005 — Archivos/componentes legacy no usados
- **ID:** TD-0005
- **Título corto:** Limpiar artefactos legacy y código huérfano
- **Descripción:** Existen respaldos y piezas no utilizadas que aumentan ruido y confusión de mantenimiento.
- **Evidencia (actualizada):** eliminados `src/components/Card.astro.bak`, `src/pages/about.md.bak`, `src/layouts/AboutLayout.astro` y `src/components/BarraIndicadores.astro`; validación de cierre con `rg --files src | rg '\.bak$'` (0) y `rg -n "AboutLayout|BarraIndicadores" src` (0).
- **Impacto:** Riesgo de editar archivos incorrectos y deuda cognitiva para onboarding.
- **Riesgo:** medio
- **Severidad (1-5):** 2
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Eliminar o mover a carpeta de archivo explícita; si se conserva, documentar propósito y estado no productivo.
- **Criterios de cierre (checklist verificable):**
- [x] No quedan `.bak` en rutas productivas.
- [x] Layouts/componentes sin uso se eliminan o documentan explícitamente.
- [x] `rg --files` no devuelve artefactos ambiguos.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0006 — Metadata de contribución aún ligada a AstroPaper upstream
- **ID:** TD-0006
- **Título corto:** Alinear templates de GitHub al proyecto
- **Descripción:** Varias plantillas y docs de contribución apuntan al upstream AstroPaper y contactos externos, no al proyecto actual.
- **Evidencia (actualizada):** `.github/CONTRIBUTING.md`, `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/*` y `.github/CODE_OF_CONDUCT.md` alineados a `cortega26/tuplatainforma`; `rg -n "astro-paper|satnaing|AstroPaper" .github` devuelve 0.
- **Impacto:** Fricción para colaboradores, issues en repos equivocados, ruido de gobernanza.
- **Riesgo:** medio
- **Severidad (1-5):** 2
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Reescribir plantillas con naming, links, contacto y reglas del repo actual.
- **Criterios de cierre (checklist verificable):**
- [x] No quedan referencias a `satnaing/astro-paper` en templates.
- [x] Contactos y enlaces apuntan al repositorio actual.
- [x] Flujo de contribución coincide con stack y scripts reales.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0007 — Email social placeholder en producción
- **ID:** TD-0007
- **Título corto:** Reemplazar `mailto:[EMAIL_ADDRESS]`
- **Descripción:** El enlace de correo en redes sociales contiene placeholder sin configurar, lo que rompe la acción de contacto.
- **Evidencia (actualizada):** ítem `Mail` removido de `SOCIALS` en `src/constants.ts`; `rg -n "\[EMAIL_ADDRESS\]" src` devuelve 0.
- **Impacto:** UX rota y pérdida de canal de contacto.
- **Riesgo:** medio
- **Severidad (1-5):** 2
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Configurar email real o remover temporalmente el ítem de `SOCIALS`.
- **Criterios de cierre (checklist verificable):**
- [x] `SOCIALS` no contiene placeholders.
- [x] Header/footer renderizan sin enlaces `mailto:[EMAIL_ADDRESS]` rotos.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0008 — Fetch repetido a `mindicador.cl` por componente embebido
- **ID:** TD-0008
- **Título corto:** Cachear indicadores económicos por request/build
- **Descripción:** Cada render de `IndicadorEconomico` invoca `getIndicadores()`. En contenidos con múltiples instancias, se repite fetch externo innecesariamente.
- **Evidencia (actualizada):** `src/infrastructure/economic/EconomicParameterProvider.ts` (memoización en módulo con `cachedBundlePromise` + `getEconomicProviderTelemetry()`), `src/utils/indicadores.ts` consume provider unificado, `src/components/IndicadorEconomico.astro` reutiliza la misma fuente y hay validación de una sola llamada externa en `tests/infrastructure/EconomicParameterProvider.test.ts`.
- **Impacto:** Latencia extra, dependencia de red repetida y potencial throttling/fallos intermitentes.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** Memoizar resultado por ciclo de render/build (cache en módulo o singleton), con TTL corto y fallback explícito.
- **Criterios de cierre (checklist verificable):**
- [x] Múltiples componentes en una misma página no disparan múltiples fetchs externos.
- [x] Se mantiene fallback al fallar la API.
- [x] Logs/telemetría mínima confirman reducción de llamadas.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0009 — Estrategia de fuentes duplicada/no alineada
- **ID:** TD-0009
- **Título corto:** Consolidar carga de tipografías
- **Descripción:** La configuración experimental de fuentes (Inter/Playfair) convive con carga manual de Google Fonts (Fraunces/Source Sans 3), sin uso visible de variables experimentales.
- **Evidencia (actualizada):** `astro.config.ts` mantiene `experimental.preserveScriptOrder` pero sin `experimental.fonts`; `src/layouts/Layout.astro` conserva una sola carga manual de Google Fonts (Fraunces + Source Sans 3); `src/styles/global.css` permanece alineado con `--font-display`/`--font-body`.
- **Impacto:** Complejidad innecesaria y posible costo de rendimiento/configuración.
- **Riesgo:** bajo
- **Severidad (1-5):** 1
- **Urgencia:** P3
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Elegir una sola vía de carga (experimental o manual) y remover configuración no usada.
- **Criterios de cierre (checklist verificable):**
- [x] Solo existe una estrategia de carga de fuentes en producción.
- [x] Variables tipográficas usadas y configuradas son consistentes.
- [x] No se descargan fuentes no utilizadas.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27

## TD-0010 — Lógica de calculadoras acoplada a DOM e `innerHTML`
- **ID:** TD-0010
- **Título corto:** Desacoplar motor de cálculo de la capa de presentación
- **Descripción:** Las calculadoras concentran validación, cálculo y render string-based en scripts inline dentro de páginas `.astro`, dificultando testeo y evolución segura.
- **Evidencia (actualizada):** Motores extraídos a `src/application/use-cases/**` (sueldo, APV, UF, cesantía, renegociación, reajuste, tarjeta, crédito consumo, prepago, jubilación); render de resultados en `src/pages/calculadoras/*.astro` migrado a DOM API sin `innerHTML`; regresión funcional en `tests/application/FinancialUseCases.regression.test.ts`.
- **Impacto:** Baja mantenibilidad, alto costo de cambios y riesgo de regressions/errores de rendering.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** L
- **Propuesta de solución:** Extraer motores de cálculo a módulos puros en `src/utils/`, tipar inputs/outputs y dejar en página solo wiring de UI.
- **Criterios de cierre (checklist verificable):**
- [x] Cada calculadora usa funciones puras reutilizables.
- [x] El DOM solo consume resultados tipados.
- [x] Se eliminan concatenaciones `innerHTML` para bloques críticos.
- [x] Hay tests de unidad para motores extraídos.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-02-26
- **Última actualización:** 2026-02-27
