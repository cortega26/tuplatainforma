# TECH_DEBT_BACKLOG

Fecha de corte: 2026-03-11

## Métricas

### Total de items por urgencia
- **P0:** 1
- **P1:** 6
- **P2:** 9
- **P3:** 1

### Estado de avance (2026-03-11)
- **Completados:** 21 (`TD-0001`, `TD-0002`, `TD-0003`, `TD-0004`, `TD-0005`, `TD-0006`, `TD-0007`, `TD-0008`, `TD-0009`, `TD-0010`, `TD-0011`, `TD-0012`, `TD-0013`, `TD-0014`, `TD-0015`, `TD-0016`, `TD-0017`, `TD-0018`, `TD-0019`, `FIX-MDX`, `FIX-LINKS-CALC`)
- **En progreso:** 0
- **Backlog sin iniciar:** 0
- **Backlog en validación/diseño:** 1 (`TD-0020`)

> `FIX-MDX`: corregido comentario HTML (`<!-- -->`) en `que-es-el-apv.mdx:25` que rompía el build.
> `FIX-LINKS-CALC`: ampliado `check-internal-links.mjs` para cubrir validación de rutas `/calculadoras/`.

### Top riesgos restantes
| Ranking | ID | Riesgo | Motivo principal |
|---|---|---|---|
| 1 | TD-0020 | Medio | El drift taxonómico restante sigue empujando `presupuesto` e `IPC` a un cluster puente mientras faltan hubs futuros. |

### Quick wins (alto impacto / bajo esfuerzo)
- [x] `TD-0007` Corregir email placeholder en enlaces sociales.
- [x] `TD-0005` Limpiar archivos/componentes legacy no usados (`*.bak`, layout/componente hुérfano).
- [x] `TD-0006` Alinear plantillas de GitHub con el proyecto real (no AstroPaper upstream).
- [x] `TD-0009` Consolidar estrategia de tipografías (config experimental vs carga real).

---

## TD-0001 — Estrategia de package manager y lockfiles inconsistente
- **ID:** TD-0001
- **Título corto:** Unificar gestor de paquetes y lockfile
- **Descripción:** El repo usa `pnpm` y `npm` en paralelo, con dos lockfiles. Esto abre drift de dependencias y builds no deterministas entre entornos locales, CI y deploy.
- **Evidencia (actualizada):** `package.json` (`packageManager: pnpm@10.30.2`); `package-lock.json` eliminado; `.github/workflows/ci.yml` (`pnpm install --frozen-lockfile`); `.github/workflows/deploy.yml` (`pnpm install --frozen-lockfile` + `pnpm run build`); `Dockerfile` (`corepack prepare pnpm@10.30.2`); `docker-compose.yml` (`pnpm run dev`); `README.md` (flujo `pnpm`).
- **Impacto:** Aumenta riesgo de diferencias entre entornos, fallos intermitentes y fricción de contribución.
- **Riesgo:** alto
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
- **Descripción:** El corpus actual tiene piezas cuyo `cluster`, `category` y posicionamiento en hubs no cuentan la misma historia editorial. El caso más claro es `que-es-el-apv` (frontera ahorro/previsión). Además, `como-hacer-presupuesto-mensual-chile` e `que-es-el-ipc-chile-como-se-calcula` siguen en `cluster: empleo-ingresos` con `category: general` porque sus casas semánticas definitivas (`presupuesto-control-financiero` y `uf-costo-de-vida`) ya están decididas conceptualmente, pero aún no existen como clusters/hubs productivos.
- **Evidencia (actualizada):** el repo ahora separa `canonical owner` vs `transitional placement` en `docs/editorial/TOPIC_OWNERSHIP_POLICY.md` y `src/config/editorial-topic-policy.mjs`; `src/pages/guias/pensiones-afp/index.astro` consume un modelo explícito `core` vs `related`; `pnpm run audit:topic-overlap` resume placements transitorios y clasificaciones de hub sin reinterpretar `category: general` como owner definitivo.
- **Impacto:** Riesgo de crecimiento editorial inconsistente, interlinking ambiguo y mayor probabilidad de canibalización a medida que se agreguen nuevas URLs.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** mantener APV con ownership canónico en `ahorro-e-inversion`; documentar presupuesto e IPC como placements transitorios explícitos; y endurecer la auditoría para distinguir owner real, related hub treatment y transición válida sin falsos arreglos de metadata.
- **Criterios de cierre (checklist verificable):**
- [x] APV tiene ownership explícito y consistente entre hub, cluster y category.
- [x] `como-hacer-presupuesto-mensual-chile` queda documentado como transición hacia `presupuesto-control-financiero` con condición concreta de migración.
- [x] `que-es-el-ipc-chile-como-se-calcula` queda documentado como transición hacia `uf-costo-de-vida` con condición concreta de migración.
- [x] `pnpm run audit:topic-overlap` distingue transición válida, core vs related y uso indebido de `category: general`.
- **Owner:** TBD
- **Estado:** Completado
- **Fecha de creación:** 2026-03-09
- **Última actualización:** 2026-03-11

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
