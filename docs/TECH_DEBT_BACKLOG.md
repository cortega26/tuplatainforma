# TECH_DEBT_BACKLOG

Fecha de corte: 2026-02-27

## Métricas

### Total de items por urgencia
- **P0:** 1
- **P1:** 3
- **P2:** 5
- **P3:** 1

### Estado de avance (2026-02-27)
- **Completados:** 10 (`TD-0001`, `TD-0002`, `TD-0003`, `TD-0004`, `TD-0005`, `TD-0006`, `TD-0007`, `TD-0008`, `TD-0009`, `TD-0010`)
- **En progreso:** 0 (—)
- **Backlog sin iniciar:** 0 (—)

### Top 5 riesgos
| Ranking | ID | Riesgo | Motivo principal |
|---|---|---|---|
| 1 | — | Bajo | Sin ítems abiertos en backlog de deuda técnica al corte 2026-02-27 |

### Quick wins (alto impacto / bajo esfuerzo)
- [x] `TD-0007` Corregir email placeholder en enlaces sociales.
- [x] `TD-0005` Limpiar archivos/componentes legacy no usados (`*.bak`, layout/componente huérfano).
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
