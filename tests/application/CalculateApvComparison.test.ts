import { describe, expect, it } from "vitest";
import { calculateApvComparison } from "@/application/use-cases/CalculateApvComparison";
import { calculateNetSalary } from "@/application/use-cases/CalculateNetSalary";

const UTM = 67294;
const UF = 39300;
const REGIME_B_PAYROLL_CAP = 50 * UF;
const REGIME_B_ANNUAL_CAP = 600 * UF;
const REGIME_A_MAX_BONUS_CONTRIBUTION = (40 * UTM) / 12;

describe("calculateApvComparison", () => {
  it("uses a 50 UF monthly cap for regime B payroll comparisons", () => {
    const result = calculateApvComparison({
      grossSalary: 2400000,
      monthlyApvContribution: 2500000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });

    expect(result.regimeB.monthlyContributionCap).toBe(REGIME_B_PAYROLL_CAP);
    expect(result.regimeB.effectiveMonthlyContribution).toBe(
      REGIME_B_PAYROLL_CAP
    );
  });

  it("keeps regime B benefit continuous below the cap and clamps it above the payroll cap", () => {
    const belowCap = calculateApvComparison({
      grossSalary: 9000000,
      monthlyApvContribution: REGIME_B_PAYROLL_CAP - 1,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });
    const atCap = calculateApvComparison({
      grossSalary: 9000000,
      monthlyApvContribution: REGIME_B_PAYROLL_CAP,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });
    const aboveCap = calculateApvComparison({
      grossSalary: 9000000,
      monthlyApvContribution: REGIME_B_PAYROLL_CAP + 250000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });

    expect(belowCap.regimeB.effectiveMonthlyContribution).toBe(
      REGIME_B_PAYROLL_CAP - 1
    );
    expect(atCap.regimeB.effectiveMonthlyContribution).toBe(
      REGIME_B_PAYROLL_CAP
    );
    expect(aboveCap.regimeB.effectiveMonthlyContribution).toBe(
      REGIME_B_PAYROLL_CAP
    );
    expect(belowCap.regimeB.monthlyBenefit).toBeLessThan(
      atCap.regimeB.monthlyBenefit
    );
    expect(aboveCap.regimeB.monthlyBenefit).toBe(atCap.regimeB.monthlyBenefit);
  });

  it("keeps direct annual regime B benefit continuous below the annual cap and clamps it above 600 UF", () => {
    const belowAnnualCap = calculateApvComparison({
      grossSalary: 9000000,
      monthlyApvContribution: 0,
      annualDirectApvContribution: REGIME_B_ANNUAL_CAP - 1,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });
    const atAnnualCap = calculateApvComparison({
      grossSalary: 9000000,
      monthlyApvContribution: 0,
      annualDirectApvContribution: REGIME_B_ANNUAL_CAP,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });
    const aboveAnnualCap = calculateApvComparison({
      grossSalary: 9000000,
      monthlyApvContribution: 0,
      annualDirectApvContribution: REGIME_B_ANNUAL_CAP + 250000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });

    expect(belowAnnualCap.regimeB.effectiveAnnualDirectContribution).toBe(
      REGIME_B_ANNUAL_CAP - 1
    );
    expect(atAnnualCap.regimeB.effectiveAnnualDirectContribution).toBe(
      REGIME_B_ANNUAL_CAP
    );
    expect(aboveAnnualCap.regimeB.effectiveAnnualDirectContribution).toBe(
      REGIME_B_ANNUAL_CAP
    );
    expect(belowAnnualCap.regimeB.monthlyBenefit).toBeLessThan(
      atAnnualCap.regimeB.monthlyBenefit
    );
    expect(aboveAnnualCap.regimeB.monthlyBenefit).toBe(
      atAnnualCap.regimeB.monthlyBenefit
    );
  });

  it("limits direct annual regime B room after using the monthly payroll cap", () => {
    const result = calculateApvComparison({
      grossSalary: 9000000,
      monthlyApvContribution: REGIME_B_PAYROLL_CAP,
      annualDirectApvContribution: 1000000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });

    expect(result.regimeB.effectiveAnnualPayrollContribution).toBe(
      REGIME_B_ANNUAL_CAP
    );
    expect(result.regimeB.effectiveAnnualDirectContribution).toBe(0);
    expect(result.regimeB.effectiveAnnualContribution).toBe(
      REGIME_B_ANNUAL_CAP
    );
  });

  it("recommends a mixed strategy when the contribution exceeds the bonus room in low tax brackets", () => {
    const result = calculateApvComparison({
      grossSalary: 2400000,
      monthlyApvContribution: 250000,
      afpRatePercent: 10.77,
      healthSystem: "isapre",
      isapreAdditionalPercent: 2,
      economicParameters: { uf: UF, utm: UTM },
    });

    expect(result.recommendedStrategy).toBe("MIXED");
    expect(result.mixedStrategy.contributionToRegimeA).toBeCloseTo(
      REGIME_A_MAX_BONUS_CONTRIBUTION,
      6
    );
    expect(result.mixedStrategy.contributionToRegimeB).toBeCloseTo(
      250000 - REGIME_A_MAX_BONUS_CONTRIBUTION,
      6
    );
    expect(result.mixedStrategy.monthlyBenefit).toBeGreaterThan(
      result.regimeA.monthlyBenefit
    );
  });

  it("recommends regime B when the entire contribution stays in a >15% marginal bracket", () => {
    const result = calculateApvComparison({
      grossSalary: 8000000,
      monthlyApvContribution: 100000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      economicParameters: { uf: UF, utm: UTM },
    });

    expect(result.recommendedStrategy).toBe("B");
    expect(result.regimeB.monthlyBenefit).toBeGreaterThan(
      result.regimeA.monthlyBenefit
    );
    expect(result.mixedStrategy.contributionToRegimeA).toBe(0);
  });

  it("uses the same taxable base as net salary when gross and taxable income differ", () => {
    const sharedInput = {
      grossSalary: 1500000,
      taxableSalary: 1350000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa" as const,
      contractType: "plazo-fijo" as const,
      economicParameters: {
        uf: UF,
        utm: UTM,
        afcTopes: { monthlyTaxableCapUf: 135.2 },
        previsionalTopes: { pensionAndHealthMonthlyTaxableCapUf: 90 },
      },
    };

    const apv = calculateApvComparison({
      ...sharedInput,
      monthlyApvContribution: 100000,
    });
    const salary = calculateNetSalary(sharedInput);

    expect(apv.taxableSalary).toBe(1350000);
    expect(apv.nonTaxableIncome).toBe(150000);
    expect(apv.taxableBase).toBeCloseTo(salary.taxableBase, 6);
  });

  it("caps payroll deductions before comparing APV regimes for high salaries", () => {
    const result = calculateApvComparison({
      grossSalary: 7000000,
      taxableSalary: 6200000,
      monthlyApvContribution: 250000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      contractType: "indefinido",
      economicParameters: {
        uf: 40000,
        utm: UTM,
        afcTopes: { monthlyTaxableCapUf: 135.2 },
        previsionalTopes: { pensionAndHealthMonthlyTaxableCapUf: 90 },
      },
    });

    expect(result.cappedBases.pensionAndHealth).toBe(3600000);
    expect(result.cappedBases.unemploymentInsurance).toBe(5408000);
    expect(result.taxableBase).toBeCloseTo(5527832, 6);
    expect(result.regimeB.reducedTaxBase).toBeCloseTo(5277832, 6);
  });
});
