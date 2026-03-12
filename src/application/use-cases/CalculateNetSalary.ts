import type { EconomicParameters } from "@/domain/economic/EconomicParameters";
import { calculateSecondCategoryTax } from "@/domain/taxation/TaxEngine";
import {
  calculateMonthlyPayrollBase,
  type PayrollContractType,
} from "@/application/use-cases/CalculateMonthlyPayrollBase";

export interface NetSalaryInput {
  grossSalary: number;
  taxableSalary?: number;
  afpRatePercent: number;
  healthSystem: "fonasa" | "isapre";
  isapreAdditionalPercent?: number;
  contractType?: PayrollContractType;
  economicParameters: Pick<
    EconomicParameters,
    "uf" | "utm" | "afcTopes" | "previsionalTopes"
  >;
}

export interface NetSalaryOutput {
  grossSalary: number;
  taxableSalary: number;
  nonTaxableIncome: number;
  taxableBase: number;
  netSalary: number;
  contractType: PayrollContractType;
  cappedBases: {
    pensionAndHealth: number;
    unemploymentInsurance: number;
  };
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
  if (
    !Number.isFinite(input.economicParameters.uf) ||
    input.economicParameters.uf <= 0
  ) {
    throw new Error(
      "economicParameters.uf must be a finite number greater than 0."
    );
  }
}

export function calculateNetSalary(input: NetSalaryInput): NetSalaryOutput {
  assertInput(input);

  const payroll = calculateMonthlyPayrollBase({
    grossSalary: input.grossSalary,
    taxableSalary: input.taxableSalary,
    afpRatePercent: input.afpRatePercent,
    healthSystem: input.healthSystem,
    isapreAdditionalPercent: input.isapreAdditionalPercent,
    contractType: input.contractType,
    economicParameters: input.economicParameters,
  });
  const taxableBase = payroll.incomeTaxBase;
  const taxResult = calculateSecondCategoryTax({
    taxableIncome: taxableBase,
    utm: input.economicParameters.utm,
  });
  const totalDeductions =
    payroll.deductions.afp +
    payroll.deductions.health +
    payroll.deductions.unemploymentInsurance +
    taxResult.taxAmount;
  const netSalary = input.grossSalary - totalDeductions;

  return {
    grossSalary: input.grossSalary,
    taxableSalary: payroll.taxableSalary,
    nonTaxableIncome: payroll.nonTaxableIncome,
    taxableBase,
    netSalary,
    contractType: payroll.contractType,
    cappedBases: payroll.cappedBases,
    deductions: {
      afp: payroll.deductions.afp,
      health: payroll.deductions.health,
      unemploymentInsurance: payroll.deductions.unemploymentInsurance,
      tax: taxResult.taxAmount,
      total: totalDeductions,
    },
    effectiveRates: {
      afpPercent: payroll.effectiveRates.afpPercent,
      healthPercent: payroll.effectiveRates.healthPercent,
      unemploymentInsurancePercent:
        payroll.effectiveRates.unemploymentInsurancePercent,
      marginalTaxPercent: taxResult.marginalRate * 100,
      totalDeductionPercent: (totalDeductions / input.grossSalary) * 100,
    },
  };
}
