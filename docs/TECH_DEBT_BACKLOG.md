# TECH_DEBT_BACKLOG

Fecha de corte: 2026-03-11

## Métricas

### Total de items por urgencia
- **P0:** 1
- **P1:** 6
- **P2:** 9
- **P3:** 1

### Estado de avance (2026-03-11)
- **Completados:** 20 (`TD-0001`, `TD-0002`, `TD-0003`, `TD-0004`, `TD-0005`, `TD-0006`, `TD-0007`, `TD-0008`, `TD-0009`, `TD-0010`, `TD-0011`, `TD-0012`, `TD-0013`, `TD-0014`, `TD-0015`, `TD-0017`, `TD-0018`, `TD-0019`, `FIX-MDX`, `FIX-LINKS-CALC`)
- **En progreso:** 0
- **Backlog sin iniciar:** 1 (`TD-0016`)

> `FIX-MDX`: corregido comentario HTML (`<!-- -->`) en `que-es-el-apv.mdx:25` que rompía el build.
> `FIX-LINKS-CALC`: ampliado `check-internal-links.mjs` para cubrir validación de rutas `/calculadoras/`.

### Top riesgos restantes
| Ranking | ID | Riesgo | Motivo principal |
|---|---|---|---|
| 1 | TD-0016 | Alto | 24 artículos YMYL legacy no tienen paquete de artefactos editorial y bloquean endurecimiento global del gate. |

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
- **Evidencia (actualizada):** `pnpm run astro check` (2026-03-09) reporta `Duplicate id` para slugs como `como-cambiarse-de-afp`, `como-hacer-presupuesto-mensual-chile`, `el-poder-del-interes-compuesto`, `fondos-afp-a-b-c-d-e` e `informe-deudas-cmf-vs-dicom`.
- **Impacto:** Riesgo de sobrescritura silenciosa de contenido, resultados ambiguos en `getCollection()` y diagnósticos menos confiables en validaciones editoriales.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** identificar por qué el loader detecta duplicados para archivos únicos, revisar configuración de colecciones/globs y confirmar si existe duplicación física, alias de carga o colisión de IDs derivadas.
- **Criterios de cierre (checklist verificable):**
- [ ] `pnpm run astro check` no reporta `Duplicate id` para `src/data/blog/**`.
- [ ] Se documenta la causa raíz y la corrección aplicada.
- [ ] `getCollection("blog")` devuelve un conjunto sin colisiones de ID.
- **Owner:** TBD
- **Estado:** Backlog sin iniciar
- **Fecha de creación:** 2026-03-09
- **Última actualización:** 2026-03-09

## TD-0019 — Snapshot base de rutas quedó desalineado del sitio publicado
- **ID:** TD-0019
- **Título corto:** Actualizar baseline de `check:routes`
- **Descripción:** `pnpm run check:routes` compara contra `docs/reports/routes_snapshot_before.json` y reporta rutas "agregadas" aunque la tarea actual no modificó routing ni slugs. El snapshot base quedó atrasado respecto del contenido ya publicado.
- **Evidencia (actualizada):** `pnpm run check:routes` (2026-03-09) informa `before=18 after=30` y lista rutas como `/posts/cae-costo-real-credito-chile/`, `/posts/liquidacion-de-sueldo/` y `/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/` como agregadas sin que este cambio haya tocado helpers de URL ni rutas públicas.
- **Impacto:** Introduce ruido en la verificación de rutas y reduce la capacidad de detectar regresiones reales de URL en cambios futuros.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** refrescar `docs/reports/routes_snapshot_before.json` con el estado publicado correcto y documentar el procedimiento para actualizar baseline solo cuando corresponda.
- **Criterios de cierre (checklist verificable):**
- [ ] `pnpm run check:routes` no reporta altas espurias cuando no hubo cambios de rutas.
- [ ] El baseline refleja el estado actual del sitio publicado.
- [ ] Queda documentado cuándo y cómo se actualiza el snapshot base.
- **Owner:** TBD
- **Estado:** Backlog sin iniciar
- **Fecha de creación:** 2026-03-09
- **Última actualización:** 2026-03-09

## TD-0020 — Ownership temático y taxonomía editorial inconsistentes
- **ID:** TD-0020
- **Título corto:** Alinear ownership editorial entre cluster, category y hubs
- **Descripción:** El corpus actual tiene piezas cuyo `cluster`, `category` y posicionamiento en hubs no cuentan la misma historia editorial. El caso más claro es `que-es-el-apv` (frontera ahorro/previsión). Además, `como-hacer-presupuesto-mensual-chile` e `que-es-el-ipc-chile-como-se-calcula` siguen en `cluster: empleo-ingresos` con `category: general` porque sus casas semánticas definitivas (`presupuesto-control-financiero` y `uf-costo-de-vida`) ya están decididas conceptualmente, pero aún no existen como clusters/hubs productivos.
- **Evidencia (actualizada):** `src/data/blog/que-es-el-apv.mdx` (`cluster: ahorro-e-inversion`) y `src/pages/guias/pensiones-afp/index.astro` todavía comparten frontera editorial sobre APV; `src/data/blog/como-hacer-presupuesto-mensual-chile.md` usa `category: general`, `cluster: empleo-ingresos`; `src/data/blog/que-es-el-ipc-chile-como-se-calcula.md` usa `category: general`, `cluster: empleo-ingresos`; `context/PROJECT_CONTEXT_MASTER.md` ya explicita las separaciones futuras `presupuesto-control-financiero` y `uf-costo-de-vida`; auditoría `docs/research/seo/audits/2026-03-09_content-overlap-audit.md`.
- **Impacto:** Riesgo de crecimiento editorial inconsistente, interlinking ambiguo y mayor probabilidad de canibalización a medida que se agreguen nuevas URLs.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** mantener APV con ownership canónico en `ahorro-e-inversion` y seguir alineando hubs/copy a esa decisión; no "corregir" `presupuesto` ni `IPC` dentro de `empleo-ingresos` con metadata artificial. Resolver esas dos piezas cuando se abra el cluster/hub correspondiente y recién ahí alinear `cluster`, `category`, hubs y metadata de intención.
- **Criterios de cierre (checklist verificable):**
- [ ] APV tiene ownership explícito y consistente entre hub, cluster y category.
- [ ] `como-hacer-presupuesto-mensual-chile` migra a `presupuesto-control-financiero` cuando exista cluster/hub productivo.
- [ ] `que-es-el-ipc-chile-como-se-calcula` migra a `uf-costo-de-vida` cuando exista cluster/hub productivo.
- [ ] `pnpm run audit:topic-overlap` deja de reportar incoherencias taxonómicas activas para estas piezas.
- **Owner:** TBD
- **Estado:** Backlog sin iniciar
- **Fecha de creación:** 2026-03-09
- **Última actualización:** 2026-03-09

## TD-0011 — Pilar CAE/costo real sin artículo editorial
- **ID:** TD-0011
- **Título corto:** Cubrir pilar faltante CAE/costo real
- **Descripción:** Existe brecha editorial en query/pilar de CAE y costo real del crédito; hoy no hay artículo dedicado.
- **Evidencia (actualizada):** `docs/development/BACKLOG_EDITORIAL.md` (ED-009 como TODO), ausencia de pieza pilar en `src/data/blog/` para intención específica de CAE/costo real.
- **Impacto:** Cobertura incompleta del cluster de deuda/crédito y menor capacidad de respuesta a intención informativa.
- **Riesgo:** bajo-medio
- **Severidad (1-5):** 2
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** Crear artículo pilar CAE/costo real con fuentes primarias y enlazado interno desde guías/relacionados.
- **Criterios de cierre (checklist verificable):**
- [ ] Existe artículo pilar publicado para CAE/costo real con frontmatter válido.
- [ ] Incluye fuentes primarias y enlaces internos del cluster correspondiente.
- **Owner:** TBD
- **Estado:** Backlog sin iniciar
- **Fecha de creación:** 2026-03-02
- **Última actualización:** 2026-03-02

## TD-0012 — Falta `updatedDate` en batch original de artículos
- **ID:** TD-0012
- **Título corto:** Normalizar señal de frescura editorial
- **Descripción:** Parte del batch original sigue sin `updatedDate`, lo que dificulta distinguir contenido revisado sustantivamente.
- **Evidencia (actualizada):** revisión de frontmatter en `src/data/blog/` identifica artículos legacy sin `updatedDate`; actualización parcial aplicada en esta intervención para artículos con edición sustantiva.
- **Impacto:** Señal de frescura inconsistente en contenidos de alto impacto informativo.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Agregar `updatedDate` solo en revisiones sustantivas verificables; evitar fechas ficticias o mecánicas.
- **Criterios de cierre (checklist verificable):**
- [ ] Cada artículo del batch original actualizado sustantivamente declara `updatedDate`.
- [ ] No existen `updatedDate` agregados sin cambio editorial real.
- **Owner:** TBD
- **Estado:** En progreso
- **Fecha de creación:** 2026-03-02
- **Última actualización:** 2026-03-02

## TD-0015 — `check:urls:ci` depende de hosts externos para métricas no bloqueantes
- **ID:** TD-0015
- **Título corto:** Aislar escaneo interno del ruido externo en URL checks
- **Descripción:** El flujo `check:urls:ci` sigue consultando hosts externos para reportar `external_failures`; esto introduce timeouts intermitentes y variación de latencia aunque el gate bloqueante solo depende de `internal_broken`.
- **Evidencia (actualizada):** salida de `pnpm run check:urls:ci` (2026-03-04) con `internal_broken=0` y `external_failures` incluyendo `timeout` en `mindicador.cl`.
- **Impacto:** Incrementa ruido operacional y puede ocultar señales internas relevantes en revisiones rápidas.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** M
- **Propuesta de solución:** separar modos de chequeo (`internal-only` bloqueante y `external-observability` informativo) o bloquear recursión externa en CI cuando no se esté ejecutando auditoría de externos.
- **Criterios de cierre (checklist verificable):**
- [ ] `check:urls:ci` no realiza requests a hosts externos por defecto.
- [ ] Se mantiene un comando explícito para auditoría externa no bloqueante.
- [ ] El reporte final distingue claramente estado interno (SLO) de telemetría externa.
- **Owner:** TBD
- **Estado:** Backlog sin iniciar
- **Fecha de creación:** 2026-03-04
- **Última actualización:** 2026-03-04

## TD-0016 — Corpus YMYL legacy sin paquetes de artefactos editoriales
- **ID:** TD-0016
- **Título corto:** Backfill de artefactos YMYL legacy
- **Descripción:** El corpus histórico YMYL tiene 24 artículos sin `artifacts/editorial/<slug>/<run-id>/` mínimos (`01-brief.yaml`, `02-dossier.md`, `fecha_corte`, `sources`), lo que impide endurecer el gate en modo repo-wide sin bloquear PRs no editoriales.
- **Evidencia (actualizada):** `EDITORIAL_ENFORCE=1 pnpm run check:editorial` reporta `ymyl_posts=25 compliant=1 non_compliant=24`; ejemplos: `como-calcular-sueldo-liquido`, `seguro-de-cesantia`, `reforma-previsional-2025-que-cambia-y-como-te-afecta`.
- **Impacto:** Riesgo alto de deuda editorial invisible y de falsos bloqueos en CI cuando el gate se aplica fuera del diff tocado.
- **Riesgo:** alto
- **Severidad (1-5):** 4
- **Urgencia:** P1
- **Esfuerzo estimado:** L
- **Propuesta de solución:** Backfill por cluster de los paquetes editoriales mínimos para cada artículo YMYL legacy y mantener la enforcement estricta de PR limitada al diff hasta cerrar la deuda.
- **Criterios de cierre (checklist verificable):**
- [ ] `EDITORIAL_ENFORCE=1 pnpm run check:editorial` pasa sobre todo el corpus.
- [ ] Cada artículo YMYL publicado tiene `01-brief.yaml` y `02-dossier.md` con `fecha_corte` y `sources` válidos.
- [ ] El backlog editorial deja de requerir scoping por diff para evitar bloqueos ajenos al cambio.
- **Owner:** TBD
- **Estado:** Backlog sin iniciar
- **Fecha de creación:** 2026-03-06
- **Última actualización:** 2026-03-06

## TD-0017 — Fonts con rutas relativas rompen en rutas anidadas
- **ID:** TD-0017
- **Título corto:** Corregir carga de tipografías en rutas anidadas
- **Descripción:** Las reglas `@font-face` en `src/styles/global.css` usan URLs relativas (`../fonts/...`) que en rutas anidadas terminan resolviendo a `/guias/fonts/...` y generan `404`, dejando al navegador en fallback tipográfico.
- **Evidencia (actualizada):** consola del navegador en `http://127.0.0.1:4322/guias/ahorro-e-inversion/` con `404` para `fonts/source-sans-3-latin-400-600.7a19a702.woff2` y `fonts/fraunces-latin-400-700.7234ed86.woff2`; `pnpm run build` (2026-03-08) reporta warnings de Vite indicando que esas referencias no se resolvieron en build y quedan para resolución en runtime.
- **Impacto:** Riesgo de tipografías incorrectas en páginas internas, diferencias visuales entre rutas y ruido de consola que dificulta validar otros cambios frontend.
- **Riesgo:** medio
- **Severidad (1-5):** 3
- **Urgencia:** P2
- **Esfuerzo estimado:** S
- **Propuesta de solución:** Convertir las URLs de `@font-face` a rutas estables resueltas por Astro/Vite (import de assets o rutas absolutas públicas) y verificar carga correcta en `/` y en rutas anidadas.
- **Criterios de cierre (checklist verificable):**
- [ ] No hay `404` de fuentes en rutas anidadas durante navegación local.
- [ ] `pnpm run build` no emite warnings por esas dos referencias de fuentes.
- [ ] La carga de fuentes se verifica al menos en `/` y `/guias/ahorro-e-inversion/`.
- **Owner:** TBD
- **Estado:** Backlog sin iniciar
- **Fecha de creación:** 2026-03-08
- **Última actualización:** 2026-03-08

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
