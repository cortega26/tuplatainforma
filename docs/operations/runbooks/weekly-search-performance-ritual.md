# Weekly Search Performance Ritual

Fecha de corte: 2026-03-12

## Objetivo

Convertir el acceso ya restaurado a Google Search Console, Bing Webmaster y los eventos analíticos del sitio en un loop semanal corto, repo-driven y accionable.

Este ritual no busca construir un BI paralelo. Busca responder todas las semanas:

- qué keywords o landings ganaron o perdieron;
- qué hubs, artículos o calculadoras merecen refresh;
- dónde falta empujar mejor el siguiente paso;
- qué alertas de indexación/cobertura necesitan seguimiento;
- qué cambios editoriales o de packaging conviene hacer primero.

## Fuentes de verdad

- Watchlist estratégica: `docs/operations/runbooks/weekly-search-performance-watchlist.json`
- Script de scorecard: `scripts/build-weekly-search-report.mjs`
- Baseline operacional Phase 1: `docs/operations/reports/phase1_measurement_baseline.md`
- SLA de refresh: `docs/operations/runbooks/phase1-refresh-policy.md`
- Ownership y anti-canibalización: `docs/research/seo/strategy/topic_ownership_matrix.md`
- Keyword targeting: `docs/research/seo/strategy/keyword_url_map.md`
- Acceso autenticado restaurado en Sprint 2E:
  - `output/playwright/search-platform-profile-2e`
  - `output/playwright/search-platform-state-2e-authenticated.json`

## Carpeta semanal

Usar una carpeta por semana:

```bash
node scripts/build-weekly-search-report.mjs \
  --input output/operations/weekly-search-performance/2026-W11 \
  --init
```

Eso crea el bundle mínimo:

- `README.md`
- `indexation-summary.json`

Luego se dejan en esa misma carpeta:

- `gsc-pages.csv`
- `gsc-queries.csv`
- `analytics-events.csv` opcional

## Inputs requeridos

### 1. Google Search Console

Exportar dos vistas con comparación `últimos 7 días vs 7 días previos`:

- `Search results > Pages` -> `gsc-pages.csv`
- `Search results > Queries` -> `gsc-queries.csv`

Campos esperados:

- página o query
- clicks + delta
- impressions + delta
- CTR + delta
- average position + delta

Notas:

- El script soporta headers en español o inglés.
- Si una URL estratégica no aparece, la scorecard la marcará como `watch` para obligar revisión manual.

### 2. Google + Bing indexación

Completar `indexation-summary.json` con lo que realmente muestran esa semana:

- estado del sitemap;
- indexed / excluded si existe;
- alertas o coverage notes;
- manual actions o enhancement issues si aplican.

No hace falta una API para esto. El objetivo es dejar el estado semanal fijado en un artefacto repo-local y comparable.

### 3. Analytics / eventos del sitio

Exportar un CSV simple con esta forma:

```csv
page_path,event_name,event_count,event_count_previous
/calculadoras/sueldo-liquido/,calculator_start,42,31
/calculadoras/sueldo-liquido/,calculator_complete,18,16
/posts/como-calcular-sueldo-liquido/,cta_click,27,29
```

Eventos que más importan hoy:

- `cta_click`
- `calculator_start`
- `calculator_complete`

Si no se exporta `analytics-events.csv`, la scorecard sigue funcionando, pero pierde lectura de packaging/CTA y tool completion.

## Generación del scorecard

Con los archivos en la carpeta semanal:

```bash
node scripts/build-weekly-search-report.mjs \
  --input output/operations/weekly-search-performance/2026-W11
```

Salidas:

- `weekly-search-scorecard.md`
- `weekly-search-scorecard.json`

## Cómo leer la scorecard

### `winner`

Señal útil que merece protección o amplificación.

Reglas principales:

- clicks suben fuerte semana contra semana; o
- mejora posición/CTR con impresiones suficientes.

Qué hacer:

- no tocar de más el owner ganador;
- reforzar enlaces desde home/hub/support si el win todavía no derrama al siguiente paso;
- revisar si el query set ganador abre espacio para una pieza support adicional.

### `loser`

La landing cayó de forma relevante.

Reglas principales:

- clicks bajan fuerte; o
- cae CTR y empeora posición con impresiones suficientes.

Qué hacer:

- revisar title, snippet y primer scroll;
- comparar contra el `query pulse`;
- si la demanda sube pero la landing cae, priorizar refresh inmediato.

### `watch`

No es crisis, pero ya hay señales de oportunidad o riesgo.

Reglas típicas:

- posición entre `4` y `15`;
- CTR débil con impresiones suficientes;
- la URL estratégica no apareció en el export semanal.

Qué hacer:

- decidir si el siguiente empuje es refresh, internal linking o esperar otra semana.

### `action_needed`

Hay una desalineación entre adquisición y journey.

Casos que hoy elevan este estado:

- la demanda del query set sube, pero la landing cae;
- una página gana tráfico, pero `cta_click` no acompaña;
- una calculadora tiene `calculator_start` suficiente y `completion rate` bajo.

Qué hacer:

- `refresh`: title, intro, snippet, vigencia, secciones altas.
- `internal_linking`: empujar mejor hacia owner/tool/hub definido en la watchlist.
- `tool_ux`: reducir fricción de formulario, validaciones o copy del resultado.

## Decisiones semanales obligatorias

Cada corrida debe cerrar con tres decisiones explícitas, aunque sean pequeñas:

1. `Refresh ahora`
   - máximo 1 a 3 URLs.
2. `Internal linking / packaging`
   - máximo 1 a 3 cambios.
3. `Seguimiento de indexación`
   - qué alerta o estado se revisa la próxima semana.

Si la scorecard no produce decisiones, el ritual se está volviendo ceremonial y hay que simplificarlo más.

## Cadencia recomendada

### Lunes o martes

1. Abrir GSC y Bing usando el estado autenticado de Sprint 2E si sigue vigente.
2. Exportar GSC pages/queries.
3. Anotar estado de sitemap/indexación en `indexation-summary.json`.
4. Exportar el CSV mínimo de analytics.
5. Ejecutar el script.

### Mismo bloque de trabajo

1. Leer primero `Top Losers` y `Strategic Watchlist`.
2. Decidir refreshes antes de mirar ideas nuevas.
3. Revisar `Internal Linking / Packaging / Tool UX`.
4. Si algo requiere trabajo mayor, moverlo al backlog; si es un ajuste menor, ejecutarlo en el sprint activo.

## Regla de mantenimiento de la watchlist

`weekly-search-performance-watchlist.json` no se toca cada semana.

Solo se actualiza cuando cambia una de estas cosas:

- abre un hub nuevo;
- una URL cambia de owner a support o viceversa;
- una calculadora entra o sale del portafolio prioritario;
- el plan de refresh cambia la prioridad real del sitio.

## Criterio de salida del ritual

La semana queda cerrada solo si existen:

- el bundle semanal bajo `output/operations/weekly-search-performance/<week>/`;
- una scorecard generada por script;
- 1 a 3 acciones decididas;
- una nota clara de indexación/cobertura para Google y Bing.
