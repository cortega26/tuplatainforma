# ADR-20260312: Shared Payroll Taxable Base for Salary and APV Calculators

Date: 2026-03-12
Status: Accepted

## Context

`TD-0021` identified that `sueldo-liquido` and `apv` were each rebuilding mandatory deductions from `grossSalary` as if it were always the full imponible base.

That created three concrete problems:

- gross total and imponible salary could not diverge even though the editorial corpus explains that difference,
- pension/health and unemployment caps were not applied from a shared contract,
- worker unemployment contribution stayed effectively hard-coded instead of reflecting `indefinido` vs `plazo-fijo`.

Under `AGENTS.md` Rule 4.3, adding a stable contract field to the economic-parameter bundle requires durable traceability.

## Decision

Adopt a shared monthly payroll engine for salary and APV calculators with these rules:

- `EconomicParameters` now carries explicit `previsionalTopes.pensionAndHealthMonthlyTaxableCapUf`.
- The existing `afcTopes.monthlyTaxableCapUf` remains the source of truth for unemployment taxable caps.
- Salary and APV calculators accept an optional explicit imponible salary; when omitted, they use `grossSalary` as an explicit quick-estimate assumption.
- Worker unemployment contribution is derived from contract type:
  - `indefinido`: `0.6%`
  - `plazo-fijo`: `0%`
- The monthly income-tax base used by both calculators is computed from the shared payroll breakdown after mandatory worker deductions.

Normative values wired in the economic parameter defaults for this change:

- Pension and health cap: `90 UF` from SPensiones, cotización previsional obligatoria.
- Unemployment cap: `135.2 UF` from SPensiones, seguro de cesantía para cotizantes.

## Consequences

Positive:

- Salary and APV now share one source of truth for imponible resolution, caps, and worker deductions.
- UI can represent the difference between bruto total and imponible real without requiring a separate advanced mode.
- Contract type stops being cosmetic in salary-like payroll calculations.

Trade-offs:

- The economic-parameter contract grows one new optional object.
- Existing regression fixtures for salary/APV need to be refreshed because the tax base is now stricter and more realistic.
- Quick estimates still exist when imponible is omitted, but the assumption is now explicit in the UI and output.

## Maintenance rules

1. Keep payroll-cap values in `EconomicParameters`; do not re-hardcode them in individual calculators.
2. If statutory caps change, update the provider defaults, snapshot refresh script, and affected regression fixtures in the same change.
3. If a future calculator needs employer-side payroll costs, add them to the shared payroll engine instead of rebuilding deductions elsewhere.
