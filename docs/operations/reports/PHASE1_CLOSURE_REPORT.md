# PHASE 1 CLOSURE REPORT

Fecha de cierre: 2026-02-27

## 1) Summary of Changes

- Se activó infraestructura de pruebas con Vitest (`vitest.config.ts`, `package.json` con `test` y `test:watch`).
- Se agregó guarda mecánica de fronteras de dominio (`scripts/check-domain-boundaries.mjs`) y ejecución en CI.
- CI actualizado para ejecutar: `lint` + `check:boundaries` + `format:check` + `test` + `build`.
- Se añadió suite de regresión y dominio:
  - `tests/domain/TaxEngine.test.ts`
  - `tests/domain/EconomicParameters.test.ts`
  - `tests/application/FinancialUseCases.regression.test.ts`
  - `tests/infrastructure/EconomicParameterProvider.test.ts`
- Se endureció gobernanza económica:
  - Provider con telemetría mínima (`getEconomicProviderTelemetry`) y reset de pruebas.
  - Pruebas explícitas de fallback (`source=fallback`, `lastUpdated`) y memoización (1 fetch externo).
  - Documentación en README: sección **Economic Data Governance & Fallback Strategy**.
- Se eliminó `innerHTML` en calculadoras críticas (`src/pages/calculadoras/*.astro`) reemplazando por renderizado estructurado con DOM API.
- Se removió copy con año fijo en UI financiera principal (`src/pages/index.astro`) y se expuso fuente de datos económica en calculadoras/indicadores.
- Se actualizó backlog de deuda técnica (`docs/TECH_DEBT_BACKLOG.md`) con estado verificable.

## 2) Updated Backlog Statuses

- Completados en este cierre: `TD-0002`, `TD-0003`, `TD-0004`, `TD-0008`, `TD-0010`.
- Ya completado previamente: `TD-0001`.
- Pendientes (backlog): `TD-0005`, `TD-0006`, `TD-0007`, `TD-0009`.

## 3) Regression Equivalence Proof (3 cases per calculator)

| Calculadora | Caso A | Caso B | Caso C |
|---|---|---|---|
| Sueldo líquido | neto `$734.670`, impuesto `$0` | neto `$1.182.650,76`, impuesto `$11.799,24` | neto `$3.450.513,05`, marginal `13,5%` |
| APV | recomendado `A`, beneficio A `$15.000` | recomendado `A`, beneficio A `$33.647` | recomendado `B`, beneficio B `$37.662,50` |
| Conversor UF | `10 UF -> $393.000` | `$1.000.000 -> 25,45 UF` | `2.500,5 UF -> $100.328.686,73` |
| Seguro cesantía | cobertura `$777.600`, FCS `sí` | cobertura `$500.000`, FCS `no` | cobertura `$648.000`, FCS `no` |
| Crédito consumo | cuota `$251.566,68`, CAE `56,75%` | cuota `$491.237,19`, CAE `54,62%` | cuota `$169.701,87`, CAE `29,84%` |
| Tarjeta crédito | base `425` meses, total `$4.992.336,10` | base `21` meses, total `$3.777.036,44` | base `168` meses, total `$1.366.967,60` |
| Prepago crédito | ahorro interés `$1.525.805,22`, conviene prepagar | ahorro interés `-$4.675.827,73`, no conviene prepagar | ahorro interés `$136.551,75`, conviene prepagar |
| Renegociación | califica `sí`, cuota `$110.110,21` | califica `no`, cuota `$74.661,87` | califica `sí`, cuota `$212.841,65` |
| Reajuste arriendo | UF: diferencia `$9.600` | UF: diferencia `$77.500` | IPC: arriendo ajustado `$573.100` |
| Simulador jubilación | saldo `$296.191.641,23` | saldo `$274.240.088,25` | saldo `$179.743.710,49` |

Referencia verificable: `tests/application/FinancialUseCases.regression.test.ts` (30 pruebas).

## Regression Traceability

- Base reference commit: no disponible en este cierre.
- Method used to capture expected outputs: ejecución de los mismos motores de cálculo con fixtures representativos (3 casos por calculadora) antes del hardening de capa de gobernanza/UI.
- Location of regression test suite: `tests/application/FinancialUseCases.regression.test.ts`.
- Input fixtures used: los definidos explícitamente en `FinancialUseCases.regression.test.ts` (salario, APV, UF, crédito, cesantía, renegociación, arriendo y jubilación).
- Date of capture: 2026-02-27.
- Expected outputs were captured from pre-refactor behavior on 2026-02-27 using inputs defined in FinancialUseCases.regression.test.ts

## 4) CI / Quality Logs (local equivalent)

Comando ejecutado:

```bash
pnpm run lint && pnpm run format:check && pnpm run check:boundaries && pnpm run test && pnpm run build
```

Resultado:

- `lint`: OK
- `format:check`: OK
- `check:boundaries`: OK (2 archivos de dominio escaneados)
- `test`: OK (4 archivos, 45 tests, 45 passed)
- `build`: OK (Astro check/build + Pagefind)

## 5) Date Scan Evidence (TD-0002)

- Escaneo global `src/` mantiene matches esperados en contenido editorial (blog, metadata histórica).
- Escaneo focalizado en calculadoras + indicadores + provider económico sin años hardcodeados en strings de UI financiera:

```bash
rg -n "20\\d\\d|/20\\d\\d" src/pages/calculadoras src/components/IndicadorEconomico.astro src/components/BarraIndicadores.astro src/utils/indicadores.ts src/infrastructure/economic/EconomicParameterProvider.ts
```

Resultado: sin matches relevantes de fecha fija en UI financiera.

## 6) Bundle Impact

- Hubo incremento en varios chunks de calculadoras por migración de plantillas string a renderizado DOM estructurado.
- Magnitud: incremento pequeño en términos absolutos (orden de cientos de bytes por chunk gzip).
- Justificación arquitectónica: eliminación de `innerHTML` crítico, reducción de riesgo de regresiones de render y mayor seguridad/mantenibilidad en capa de presentación.

## 7) Remaining Debt (Separated)

- `TD-0005`: limpieza de artefactos legacy (`*.bak`, huérfanos).
- `TD-0006`: plantillas de contribución alineadas al repositorio actual.
- `TD-0007`: reemplazo de placeholder `mailto:[EMAIL_ADDRESS]`.
- `TD-0009`: consolidación de estrategia de tipografías.
