import type { EconomicParameters } from "@/domain/economic/EconomicParameters";
import { calculateSecondCategoryTax } from "@/domain/taxation/TaxEngine";

export interface NetSalaryInput {
  grossSalary: number;
  afpRatePercent: number;
  healthSystem: "fonasa" | "isapre";
  isapreAdditionalPercent?: number;
  unemploymentInsuranceRatePercent?: number;
  economicParameters: Pick<EconomicParameters, "utm">;
}

export interface NetSalaryOutput {
  grossSalary: number;
  taxableBase: number;
  netSalary: number;
  deductions: {
    afp: number;
    health: number;
    unemploymentInsurance: number;
    tax: number;
    total: number;
  };
  effectiveRates: {
    afpPercent: number;
    healthPercent: number;
    unemploymentInsurancePercent: number;
    marginalTaxPercent: number;
    totalDeductionPercent: number;
  };
}

function assertInput(input: NetSalaryInput): void {
  if (!Number.isFinite(input.grossSalary) || input.grossSalary <= 0) {
    throw new Error("grossSalary must be a finite number greater than 0.");
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
    input.isapreAdditionalPercent !== undefined &&
    (!Number.isFinite(input.isapreAdditionalPercent) ||
      input.isapreAdditionalPercent < 0)
  ) {
    throw new Error("isapreAdditionalPercent must be >= 0 when provided.");
  }
}

export function calculateNetSalary(input: NetSalaryInput): NetSalaryOutput {
  assertInput(input);

  const afpPercent = input.afpRatePercent / 100;
  const isapreAdditionalPercent =
    input.healthSystem === "isapre" ? (input.isapreAdditionalPercent ?? 0) : 0;
  const healthPercent = 0.07 + isapreAdditionalPercent / 100;
  const unemploymentInsurancePercent =
    (input.unemploymentInsuranceRatePercent ?? 0.6) / 100;

  const afp = input.grossSalary * afpPercent;
  const health = input.grossSalary * healthPercent;
  const unemploymentInsurance =
    input.grossSalary * unemploymentInsurancePercent;
  const taxableBase = Math.max(0, input.grossSalary - afp - health);
  const taxResult = calculateSecondCategoryTax({
    taxableIncome: taxableBase,
    utm: input.economicParameters.utm,
  });
  const totalDeductions =
    afp + health + unemploymentInsurance + taxResult.taxAmount;
  const netSalary = input.grossSalary - totalDeductions;

  return {
    grossSalary: input.grossSalary,
    taxableBase,
    netSalary,
    deductions: {
      afp,
      health,
      unemploymentInsurance,
      tax: taxResult.taxAmount,
      total: totalDeductions,
    },
    effectiveRates: {
      afpPercent: afpPercent * 100,
      healthPercent: healthPercent * 100,
      unemploymentInsurancePercent: unemploymentInsurancePercent * 100,
      marginalTaxPercent: taxResult.marginalRate * 100,
      totalDeductionPercent: (totalDeductions / input.grossSalary) * 100,
    },
  };
}
