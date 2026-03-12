# Phase 1 Measurement Baseline

Fecha de corte: 2026-03-12

Limitación: este artefacto fija eventos, KPIs y dónde mirar. No contiene datos reales de GA4/GSC porque ese acceso no forma parte del repo.

## Objetivo de medición

Medir si Monedario está cerrando mejor el loop `problema -> owner page -> support/tool -> siguiente paso` en vez de crecer solo por páginas de soporte o tráfico difuso.

## KPIs mínimos de Fase 1

| KPI | Qué mide | Segmento objetivo | Fuente esperada |
|---|---|---|---|
| `organic_clicks_core_owners` | Crecimiento en clicks de las URLs owner prioritarias | owners de sueldo, finiquito, cesantía, honorarios, APV, reforma | GSC |
| `hub_to_owner_ctr` | Si el hub `sueldo-remuneraciones` realmente orienta | `/guias/sueldo-remuneraciones/` | analytics / events |
| `owner_to_tool_ctr` | Si el artículo lleva a acción útil | owner pages con `articleLead` | analytics / events |
| `tool_completion_rate` | Si la herramienta se usa hasta el final | `sueldo-liquido`, `boleta-honorarios-liquido`, `finiquito-indemnizacion`, `seguro-cesantia`, `apv` | analytics / events |
| `core_vs_support_entry_share` | Si el tráfico entra más por owners/tools que por soporte/glosario/leyes | corpus Fase 1 | GSC + analytics |
| `freshness_sla_met` | Tiempo de reacción ante cambios regulatorios | URLs `alto riesgo regulatorio` | editorial ops |

## Eventos a instrumentar o validar

| Evento | Disparador | Parámetros mínimos |
|---|---|---|
| `phase1_hub_select` | Click en CTA principal dentro de `/guias/sueldo-remuneraciones/` | `hub_slug`, `target_href`, `target_type` |
| `article_decision_intro_click` | Click en CTA del bloque `articleLead` | `article_slug`, `cta_type`, `target_href` |
| `calculator_start` | Primer input o click en botón de cálculo | `calculator_slug`, `calculator_name` |
| `calculator_complete` | Resultado calculado correctamente | `calculator_slug`, `calculator_name`, `outcome` |
| `calculator_related_jump` | Cambio desde índice o una calculadora a una alternativa relacionada | `from_calculator`, `to_href` |

## URLs core a seguir

- Hubs:
  - `/guias/sueldo-remuneraciones/`
- Owners:
  - `/posts/como-calcular-sueldo-liquido/`
  - `/posts/liquidacion-de-sueldo/`
  - `/posts/finiquito-e-indemnizaciones-en-chile/`
  - `/posts/seguro-de-cesantia/`
  - `/posts/boleta-honorarios-2026-retencion-cobertura/`
  - `/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/`
  - `/posts/que-es-el-apv/`
  - `/posts/fondos-afp-a-b-c-d-e/`
- Support:
  - `/posts/indemnizacion-anos-de-servicio-chile/`
  - `/posts/seguro-cesantia-cuenta-individual-vs-fondo-solidario/`
- Tools:
  - `/calculadoras/sueldo-liquido/`
  - `/calculadoras/boleta-honorarios-liquido/`
  - `/calculadoras/finiquito-indemnizacion/`
  - `/calculadoras/seguro-cesantia/`
  - `/calculadoras/apv/`

## Baseline manual a completar fuera del repo

| Métrica | Línea base 2026-03-12 | Meta 30 días |
|---|---|---|
| Clicks orgánicos owners core | `pendiente` | `subir` |
| CTR hub -> owner | `pendiente` | `> 20%` |
| CTR owner -> calculadora | `pendiente` | `subir sobre baseline` |
| Completion rate calculadoras nuevas | `pendiente` | `primer baseline usable` |
| Share entradas core vs soporte | `pendiente` | `subir core` |

## Señales de fracaso temprano

- El tráfico nuevo entra a `leyes`, `glosario` o soporte pero no a owners/tools.
- El hub de sueldo aumenta views sin empujar clics a la calculadora o owners.
- Las calculadoras nuevas reciben starts pero no completes.
- `reforma` o `APV` absorben demasiado tiempo editorial sin mover el frente principal.
