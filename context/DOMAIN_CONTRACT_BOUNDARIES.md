# Domain Contract Boundaries (Phase 1)

## Layer rules

- `src/domain/**`
  - Must be framework-agnostic and side-effect free.
  - Must not import Astro, UI components, Tailwind, or `fetch`.
- `src/application/**`
  - Orchestrates domain rules and DTO contracts.
  - May depend on `src/domain/**` and infrastructure abstractions.
- `src/infrastructure/**`
  - Handles external I/O (`fetch`, APIs, caching, fallback wiring).
  - Must not contain business formulas that belong in domain/application.
- `src/pages/**` and `src/components/**`
  - Presentation only: collect inputs, invoke use-cases, render outputs.

## Financial contracts introduced in Phase 1

- `src/domain/economic/EconomicParameters.ts`
  - Single economic source-of-truth contract + invariant enforcement.
- `src/infrastructure/economic/EconomicParameterProvider.ts`
  - mindicador adapter, timeout, memoization, controlled fallback telemetry.
- `src/domain/taxation/TaxEngine.ts`
  - Pure second-category tax engine.
- `src/application/use-cases/*`
  - Typed DTO contracts for calculators and economic consumption.
