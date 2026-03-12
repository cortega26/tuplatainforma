import { describe, expect, it } from "vitest";
import { simulateRetirementProjection } from "@/application/use-cases/SimulateRetirementProjection";

const UF = 39300;

function buildInput(overrides: Partial<Parameters<typeof simulateRetirementProjection>[0]> = {}) {
  return {
    currentAge: 35,
    retirementAge: 65,
    grossSalary: 5000000,
    currentBalance: 15000000,
    annualReturnPercent: 5,
    lifeExpectancyAge: 90,
    contributionDensityPercent: 85,
    currentDate: "2026-03-01",
    economicParameters: {
      uf: UF,
      previsionalTopes: { pensionAndHealthMonthlyTaxableCapUf: 90 },
    },
    ...overrides,
  };
}

describe("simulateRetirementProjection", () => {
  it("fails explicitly when life expectancy does not exceed retirement age", () => {
    expect(() =>
      simulateRetirementProjection(
        buildInput({ retirementAge: 65, lifeExpectancyAge: 65 })
      )
    ).toThrow(
      "lifeExpectancyAge must be greater than retirementAge to estimate pension months."
    );
  });

  it("caps the salary used for contributions at the official imponible limit", () => {
    const result = simulateRetirementProjection(buildInput());

    expect(result.salaryCapClp).toBe(3537000);
    expect(result.taxableSalaryUsedClp).toBe(3537000);
  });

  it("reduces contribution months when lagunas are introduced and returns comparison scenarios", () => {
    const result = simulateRetirementProjection(buildInput());

    expect(result.totalMonths).toBe(360);
    expect(result.monthsWithContributions).toBe(306);
    expect(result.monthsWithoutContributions).toBe(54);
    expect(result.scenarios.map(item => item.label)).toEqual([
      "Base",
      "Conservador",
      "Agresivo",
    ]);
    expect(result.selectedScenario.totalEmployerContributionsToIndividualAccount).toBeGreaterThan(
      0
    );
  });
});
