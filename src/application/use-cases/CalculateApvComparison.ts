import type { EconomicParameters } from "@/domain/economic/EconomicParameters";
import { calculateSecondCategoryTax } from "@/domain/taxation/TaxEngine";

export interface ApvComparisonInput {
  grossSalary: number;
  monthlyApvContribution: number;
  afpRatePercent: number;
  healthSystem: "fonasa" | "isapre";
  isapreAdditionalPercent?: number;
  economicParameters: Pick<EconomicParameters, "uf" | "utm">;
}

export interface ApvComparisonOutput {
  taxableBase: number;
  taxWithoutApv: number;
  marginalRate: number;
  regimeA: {
    monthlyTax: number;
    monthlyBenefit: number;
    annualBonus: number;
  };
  regimeB: {
    reducedTaxBase: number;
    monthlyTax: number;
    monthlyBenefit: number;
    annualBenefit: number;
    effectiveMonthlyContribution: number;
    monthlyContributionCap: number;
  };
  recommendedRegime: "A" | "B";
}

function assertInput(input: ApvComparisonInput): void {
  if (!Number.isFinite(input.grossSalary) || input.grossSalary <= 0) {
    throw new Error("grossSalary must be a finite number greater than 0.");
  }
  if (
    !Number.isFinite(input.monthlyApvContribution) ||
    input.monthlyApvContribution <= 0
  ) {
    throw new Error(
      "monthlyApvContribution must be a finite number greater than 0."
    );
  }
  if (!Number.isFinite(input.afpRatePercent) || input.afpRatePercent <= 0) {
    throw new Error("afpRatePercent must be a finite number greater than 0.");
  }
  if (
    !Number.isFinite(input.economicParameters.utm) ||
    input.economicParameters.utm <= 0
  ) {
    throw new Error(
      "economicParameters.utm must be a finite number greater than 0."
    );
  }
  if (
    !Number.isFinite(input.economicParameters.uf) ||
    input.economicParameters.uf <= 0
  ) {
    throw new Error(
      "economicParameters.uf must be a finite number greater than 0."
    );
  }
}

export function calculateApvComparison(
  input: ApvComparisonInput
): ApvComparisonOutput {
  assertInput(input);

  const afpPercent = input.afpRatePercent / 100;
  const isapreAdditionalPercent =
    input.healthSystem === "isapre" ? (input.isapreAdditionalPercent ?? 0) : 0;
  const healthPercent = 0.07 + isapreAdditionalPercent / 100;

  const afpDeduction = input.grossSalary * afpPercent;
  const healthDeduction = input.grossSalary * healthPercent;
  const taxableBase = Math.max(
    0,
    input.grossSalary - afpDeduction - healthDeduction
  );

  const taxWithoutApv = calculateSecondCategoryTax({
    taxableIncome: taxableBase,
    utm: input.economicParameters.utm,
  });

  const annualBonus = Math.min(
    input.monthlyApvContribution * 12 * 0.15,
    6 * input.economicParameters.utm
  );
  const monthlyBenefitA = annualBonus / 12;

  const monthlyContributionCap = (50 * input.economicParameters.uf) / 12;
  const effectiveMonthlyContribution = Math.min(
    input.monthlyApvContribution,
    monthlyContributionCap
  );
  const reducedTaxBase = Math.max(
    0,
    taxableBase - effectiveMonthlyContribution
  );
  const taxWithRegimeB = calculateSecondCategoryTax({
    taxableIncome: reducedTaxBase,
    utm: input.economicParameters.utm,
  });
  const monthlyBenefitB = taxWithoutApv.taxAmount - taxWithRegimeB.taxAmount;

  return {
    taxableBase,
    taxWithoutApv: taxWithoutApv.taxAmount,
    marginalRate: taxWithoutApv.marginalRate,
    regimeA: {
      monthlyTax: taxWithoutApv.taxAmount,
      monthlyBenefit: monthlyBenefitA,
      annualBonus,
    },
    regimeB: {
      reducedTaxBase,
      monthlyTax: taxWithRegimeB.taxAmount,
      monthlyBenefit: monthlyBenefitB,
      annualBenefit: monthlyBenefitB * 12,
      effectiveMonthlyContribution,
      monthlyContributionCap,
    },
    recommendedRegime: monthlyBenefitA >= monthlyBenefitB ? "A" : "B",
  };
}
