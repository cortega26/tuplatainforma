# Tu Plata Informa

Proyecto educativo de finanzas personales para Chile. Su objetivo es explicar, con lenguaje claro y sin letra chica, temas como AFP, APV, impuestos, inversiones y herramientas prácticas (calculadoras) para que cualquier persona pueda comprender y tomar mejores decisiones con su dinero.

Este sitio es 100% educativo: no solicita datos personales, no ofrece asesoría personalizada ni promueve productos financieros. Todo su contenido busca informar y enseñar de forma responsable y accesible.

## Sitio en producción

- URL: https://cortega26.github.io/tuplatainforma/

## Tecnologías principales

- Astro 5 + TypeScript
- TailwindCSS (Vite plugin)
- Pagefind (búsqueda estática)
- Shiki (resaltado de código)

## Estructura relevante

- src/
  - pages/
    - index.astro (inicio)
    - posts/ (listado y detalles de artículos)
    - tags/ (índice y paginación de etiquetas)
    - calculadoras/ (índice y calculadoras)
    - archives/ (archivo de artículos)
    - search.astro (búsqueda)
    - 404.astro (página de error)
  - data/
    - blog/ (contenido de artículos en Markdown)
  - components/ (componentes UI como Header, Card, Pagination, etc.)
  - layouts/ (plantillas de páginas)
  - utils/ (utilidades para rutas, ordenamiento, etc.)

## Documentación de gobernanza

- Backlog técnico versionado: `docs/TECH_DEBT_BACKLOG.md`
- Reporte de cierre Fase 1: `docs/operations/reports/PHASE1_CLOSURE_REPORT.md`
- Fronteras de dominio: `docs/architecture/DOMAIN_CONTRACT_BOUNDARIES.md`
- Constitución de ingeniería para agentes IA/humanos: `docs/AI_ENGINEERING_CONSTITUTION.md`

## Desarrollo local

Requisitos: Node 20

- Instalar dependencias:
  - pnpm install --frozen-lockfile
- Ejecutar en modo desarrollo:
  - pnpm run dev
- Compilar para producción y generar búsqueda:
  - pnpm run build

Notas:

- El proyecto utiliza una base de despliegue en subdirectorio (/tuplatainforma). Para evitar enlaces rotos, los componentes generan URLs usando import.meta.env.BASE_URL normalizada con barra final.
- La generación de páginas de artículos se basa en contenido Markdown dentro de src/data/blog.

## Editorial Artifact Gate (Phase 1)

- Comando: `pnpm run check:editorial-artifacts`
- Integración: se ejecuta dentro de `pnpm run check:editorial`.
- Modo por defecto: `warn-only` (reporta deuda sin romper el pipeline).
- Modo estricto: `EDITORIAL_ENFORCE=1 pnpm run check:editorial-artifacts` (falla por artefactos/campos obligatorios faltantes).
- Ubicación canónica de artefactos: `artifacts/editorial/<post_id>/<run-id>/` (según `context/EDITORIAL_AI_PIPELINE.md` y `context/CONTRACTS.md`).

## Despliegue (GitHub Pages)

El repositorio incluye un workflow (.github/workflows/deploy.yml) que:

- Ejecuta pnpm install --frozen-lockfile y pnpm run build
- Sube el contenido de dist/ como artifact y lo publica vía GitHub Pages

Asegúrate de que:

- La configuración de Astro (astro.config.ts) mantiene base: "/tuplatainforma"
- La constante SITE.website en src/config.ts apunta a la URL pública con el subpath

## Economic Data Governance & Fallback Strategy

Fuente única:

- Todas las calculadoras que dependen de UF/UTM/TMC/AFC consumen `getEconomicParameters()` y, por debajo, `src/infrastructure/economic/EconomicParameterProvider.ts`.

Estrategia de datos y cache:

- Fuente principal en build/CI: `src/infrastructure/economic/economic-parameters.snapshot.json` (determinística, sin red).
- Modo live opcional solo por env: `TPI_ECONOMIC_PROVIDER_MODE=live`.
- En modo live, el provider intenta `https://mindicador.cl/api` y, si falla, vuelve al snapshot local.
- Se memoiza en módulo (`cachedBundlePromise`) para evitar múltiples lecturas/fetch en un mismo ciclo de ejecución.
- Telemetría mínima disponible vía `getEconomicProviderTelemetry()`:
  - `externalFetchCount`
  - `cacheHitCount`
  - `lastSource`
  - `lastFallbackReason`

Fallback controlado:

- Si falla el snapshot (archivo inválido/faltante), el provider retorna un bundle con:
  - `parameters.source = "fallback"`
  - `parameters.lastUpdated` en formato `YYYY-MM-DD`
  - `telemetryFlag = "economic_parameters_fallback"`
- La UI expone la fuente y fecha de datos en calculadoras e indicadores; cuando aplica fallback se muestra explícitamente el modo fallback.

Refresh del snapshot:

- Comando: `pnpm run economic:snapshot:refresh`
- Este script consulta `mindicador.cl` y actualiza `economic-parameters.snapshot.json` con sello temporal (`capturedAt`).

Validación automatizada:

- Pruebas de fallback y memoización: `tests/infrastructure/EconomicParameterProvider.test.ts`.
- Pruebas de regresión numérica de motores: `tests/application/FinancialUseCases.regression.test.ts`.
- Pruebas de dominio tributario e invariantes económicos: `tests/domain/*.test.ts`.

## Convenciones y accesibilidad

- Enlaces internos usan siempre la base del sitio y terminan con barra final.
- Etiquetas visibles están en español para reforzar el carácter educativo.
- Se incluyen atributos aria y estados activos consistentes.

## Alcance educativo

- El propósito es orientar y educar. El contenido no constituye asesoría financiera ni reemplaza el criterio profesional.
- Se fomenta el uso de herramientas (p. ej., calculadoras) para que cada persona realice sus propios números y comprenda conceptos clave.

## Contribuciones

- Sugerencias de contenido, correcciones y mejoras son bienvenidas mediante issues y pull requests.
- Se prioriza la claridad, precisión y responsabilidad en la comunicación financiera.

## Licencia

Este proyecto se distribuye bajo la licencia MIT. Consulta el archivo LICENSE para más detalles.
