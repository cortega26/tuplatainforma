import type { EconomicParameters } from "@/domain/economic/EconomicParameters";
import { calculateSecondCategoryTax } from "@/domain/taxation/TaxEngine";

export interface ApvComparisonInput {
  grossSalary: number;
  monthlyApvContribution: number;
  annualDirectApvContribution?: number;
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
    monthlyContributionForMaxBonus: number;
    annualContributionForMaxBonus: number;
    effectiveAnnualContribution: number;
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
    effectiveMonthlyPayrollContribution: number;
    effectiveAnnualPayrollContribution: number;
    effectiveAnnualDirectContribution: number;
    effectiveAnnualContribution: number;
    monthlyContributionCap: number;
    annualContributionCap: number;
  };
  mixedStrategy: {
    contributionToRegimeA: number;
    contributionToRegimeB: number;
    annualContributionToRegimeA: number;
    annualContributionToRegimeB: number;
    reducedTaxBase: number;
    monthlyTax: number;
    regimeAMonthlyBenefit: number;
    regimeBMonthlyBenefit: number;
    monthlyBenefit: number;
    annualBenefit: number;
  };
  recommendedStrategy: "A" | "B" | "MIXED";
}

function assertInput(input: ApvComparisonInput): void {
  if (!Number.isFinite(input.grossSalary) || input.grossSalary <= 0) {
    throw new Error("grossSalary must be a finite number greater than 0.");
  }
  if (
    !Number.isFinite(input.monthlyApvContribution) ||
    input.monthlyApvContribution < 0
  ) {
    throw new Error(
      "monthlyApvContribution must be a finite number greater than or equal to 0."
    );
  }
  if (
    input.annualDirectApvContribution !== undefined &&
    (!Number.isFinite(input.annualDirectApvContribution) ||
      input.annualDirectApvContribution < 0)
  ) {
    throw new Error(
      "annualDirectApvContribution must be a finite number greater than or equal to 0."
    );
  }
  if (
    input.monthlyApvContribution + (input.annualDirectApvContribution ?? 0) <=
    0
  ) {
    throw new Error("At least one APV contribution must be greater than 0.");
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

  const annualDirectApvContribution = input.annualDirectApvContribution ?? 0;
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

  const monthlyContributionForMaxBonus =
    (40 * input.economicParameters.utm) / 12;
  const annualContributionForMaxBonus = 40 * input.economicParameters.utm;
  const annualApvContribution =
    input.monthlyApvContribution * 12 + annualDirectApvContribution;
  const annualBonus = Math.min(
    annualApvContribution * 0.15,
    6 * input.economicParameters.utm
  );
  const monthlyBenefitA = annualBonus / 12;

  const monthlyContributionCap = 50 * input.economicParameters.uf;
  const annualContributionCap = 600 * input.economicParameters.uf;
  const effectiveMonthlyPayrollContribution = Math.min(
    input.monthlyApvContribution,
    monthlyContributionCap
  );
  const effectiveAnnualPayrollContribution = Math.min(
    effectiveMonthlyPayrollContribution * 12,
    annualContributionCap
  );
  const effectiveAnnualDirectContribution = Math.min(
    annualDirectApvContribution,
    Math.max(0, annualContributionCap - effectiveAnnualPayrollContribution)
  );
  const effectiveAnnualContribution =
    effectiveAnnualPayrollContribution + effectiveAnnualDirectContribution;
  const effectiveMonthlyContribution = effectiveAnnualContribution / 12;
  const reducedTaxBase = Math.max(
    0,
    taxableBase - effectiveMonthlyContribution
  );
  const taxWithRegimeB = calculateSecondCategoryTax({
    taxableIncome: reducedTaxBase,
    utm: input.economicParameters.utm,
  });
  const monthlyBenefitB = taxWithoutApv.taxAmount - taxWithRegimeB.taxAmount;
  const highRateThresholdTaxableBase = 70 * input.economicParameters.utm;
  const annualContributionToRegimeBHighRate = Math.min(
    effectiveAnnualContribution,
    Math.max(0, taxableBase - highRateThresholdTaxableBase) * 12
  );
  const remainingAnnualContribution = Math.max(
    0,
    annualApvContribution - annualContributionToRegimeBHighRate
  );
  const annualContributionToRegimeA = Math.min(
    remainingAnnualContribution,
    annualContributionForMaxBonus
  );
  const annualContributionToRegimeBRemaining = Math.min(
    Math.max(0, remainingAnnualContribution - annualContributionToRegimeA),
    Math.max(0, annualContributionCap - annualContributionToRegimeBHighRate)
  );
  const annualContributionToRegimeB =
    annualContributionToRegimeBHighRate + annualContributionToRegimeBRemaining;
  const contributionToRegimeA = annualContributionToRegimeA / 12;
  const contributionToRegimeB = annualContributionToRegimeB / 12;
  const mixedReducedTaxBase = Math.max(0, taxableBase - contributionToRegimeB);
  const taxWithMixedStrategy = calculateSecondCategoryTax({
    taxableIncome: mixedReducedTaxBase,
    utm: input.economicParameters.utm,
  });
  const mixedRegimeBMonthlyBenefit =
    taxWithoutApv.taxAmount - taxWithMixedStrategy.taxAmount;
  const mixedRegimeAMonthlyBenefit =
    Math.min(
      annualContributionToRegimeA * 0.15,
      6 * input.economicParameters.utm
    ) / 12;
  const mixedMonthlyBenefit =
    mixedRegimeAMonthlyBenefit + mixedRegimeBMonthlyBenefit;
  const mixedAnnualBenefit =
    mixedRegimeAMonthlyBenefit * 12 + mixedRegimeBMonthlyBenefit * 12;

  const recommendedStrategy =
    mixedMonthlyBenefit > monthlyBenefitA &&
    mixedMonthlyBenefit > monthlyBenefitB
      ? "MIXED"
      : monthlyBenefitA >= monthlyBenefitB
        ? "A"
        : "B";

  return {
    taxableBase,
    taxWithoutApv: taxWithoutApv.taxAmount,
    marginalRate: taxWithoutApv.marginalRate,
    regimeA: {
      monthlyContributionForMaxBonus,
      annualContributionForMaxBonus,
      effectiveAnnualContribution: Math.min(
        annualApvContribution,
        annualContributionForMaxBonus
      ),
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
      effectiveMonthlyPayrollContribution,
      effectiveAnnualPayrollContribution,
      effectiveAnnualDirectContribution,
      effectiveAnnualContribution,
      monthlyContributionCap,
      annualContributionCap,
    },
    mixedStrategy: {
      contributionToRegimeA,
      contributionToRegimeB,
      annualContributionToRegimeA,
      annualContributionToRegimeB,
      reducedTaxBase: mixedReducedTaxBase,
      monthlyTax: taxWithMixedStrategy.taxAmount,
      regimeAMonthlyBenefit: mixedRegimeAMonthlyBenefit,
      regimeBMonthlyBenefit: mixedRegimeBMonthlyBenefit,
      monthlyBenefit: mixedMonthlyBenefit,
      annualBenefit: mixedAnnualBenefit,
    },
    recommendedStrategy,
  };
}
