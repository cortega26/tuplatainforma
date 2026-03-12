# Phase 1 Refresh Policy

Fecha de corte: 2026-03-12

Objetivo: sostener la Fase 1 sin abrir más frentes editoriales. Durante esta ventana, `sueldo-remuneraciones + empleo-ingresos` absorben la mayor parte del refresh operativo; `previsión / APV / reforma` se mantiene como frente oportunista; `deuda / CAE` queda en preparación, no en expansión.

## Reparto de esfuerzo

- `65%` del esfuerzo editorial y UX: `sueldo-remuneraciones` + `empleo-ingresos`
- `25%` del esfuerzo editorial: `pensiones-afp` + `ahorro-e-inversion` solo en URLs ya activas (`reforma`, `fondos AFP`, `APV`)
- `10%` del esfuerzo: preparación Fase 2 (`deuda-credito`, `impuestos-personas` fuera de los owners ya activos)

## SLA por tipo de riesgo

| Tipo | Definición operativa | SLA objetivo | URLs ejemplo |
|---|---|---|---|
| `alto riesgo regulatorio` | Cambios legales, tributarios, previsionales o laborales que alteran reglas, tasas, topes o elegibilidad | `72 horas` desde validación de cambio | `reforma-previsional-2025-que-cambia-y-como-te-afecta`, `que-es-el-apv`, `boleta-honorarios-2026-retencion-cobertura`, `seguro-de-cesantia` |
| `estacional` | Contenido con ventanas de alta consulta o ciclos operativos previsibles | `7 días` antes del hito y revisión durante la ventana | `operacion-renta-f22-checklist`, `devolucion-impuestos-fechas-compensaciones` |
| `perenne` | Explicaciones estructurales que cambian menos, pero sí requieren control de vigencia y enlaces | `revisión trimestral` | `como-calcular-sueldo-liquido`, `liquidacion-de-sueldo`, `descuentos-de-sueldo`, `finiquito-e-indemnizaciones-en-chile` |

## URLs críticas de Fase 1

- `owner` principal:
  - `/posts/como-calcular-sueldo-liquido/`
  - `/posts/liquidacion-de-sueldo/`
  - `/posts/finiquito-e-indemnizaciones-en-chile/`
  - `/posts/seguro-de-cesantia/`
  - `/posts/boleta-honorarios-2026-retencion-cobertura/`
  - `/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/`
  - `/posts/que-es-el-apv/`
  - `/posts/fondos-afp-a-b-c-d-e/`
- `support` obligatoria de Fase 1:
  - `/posts/indemnizacion-anos-de-servicio-chile/`
  - `/posts/seguro-cesantia-cuenta-individual-vs-fondo-solidario/`
- `tools` obligatorias de Fase 1:
  - `/calculadoras/sueldo-liquido/`
  - `/calculadoras/boleta-honorarios-liquido/`
  - `/calculadoras/finiquito-indemnizacion/`
  - `/calculadoras/seguro-cesantia/`
  - `/calculadoras/apv/`

## Gatiladores de refresh

- Cambio en tasas, tramos o topes publicados por SII, AFC, Superintendencia de Pensiones o BCN.
- Cambio en causal, requisito o calendario que afecte elegibilidad práctica del lector.
- Cambio de naming o navegación que rompa el journey `owner -> support -> calculadora`.
- Enlace oficial roto en una URL owner o support de Fase 1.
- Diferencia detectada entre artículo y calculadora para la misma regla.

## Regla operativa de expansión

- No abrir cluster nuevo durante Phase 1.
- No crear más de `2` calculadoras nuevas fuera de las ya definidas en esta fase.
- Si una idea nueva compite por tiempo con una URL crítica, se difiere a Fase 2 salvo riesgo regulatorio alto.
- `leyes` y `glosario` quedan como soporte editorial; no dictan la agenda de adquisición.

## Checklist corto de refresh

1. Confirmar fuente oficial primaria.
2. Actualizar `updatedDate` y fecha de corte visible.
3. Verificar que el bloque `articleLead` siga correcto.
4. Revisar CTA primaria y siguiente paso.
5. Confirmar que la calculadora asociada siga alineada con la regla explicada.
6. Revisar enlaces internos a owner/support/tool.
