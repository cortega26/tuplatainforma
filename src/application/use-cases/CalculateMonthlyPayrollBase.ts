import type { EconomicParameters } from "@/domain/economic/EconomicParameters";

export type PayrollContractType = "indefinido" | "plazo-fijo";

export interface MonthlyPayrollBaseInput {
  grossSalary: number;
  taxableSalary?: number;
  afpRatePercent: number;
  healthSystem: "fonasa" | "isapre";
  isapreAdditionalPercent?: number;
  contractType?: PayrollContractType;
  economicParameters: Pick<
    EconomicParameters,
    "uf" | "afcTopes" | "previsionalTopes"
  >;
}

export interface MonthlyPayrollBaseOutput {
  grossSalary: number;
  taxableSalary: number;
  nonTaxableIncome: number;
  incomeTaxBase: number;
  contractType: PayrollContractType;
  cappedBases: {
    pensionAndHealth: number;
    unemploymentInsurance: number;
  };
  deductions: {
    afp: number;
    health: number;
    unemploymentInsurance: number;
  };
  effectiveRates: {
    afpPercent: number;
    healthPercent: number;
    unemploymentInsurancePercent: number;
  };
  assumptions: {
    usedGrossAsTaxableSalary: boolean;
    pensionAndHealthMonthlyTaxableCapUf: number;
    unemploymentMonthlyTaxableCapUf: number;
  };
}

const DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF = 90;
const DEFAULT_UNEMPLOYMENT_MONTHLY_TAXABLE_CAP_UF = 135.2;

function assertInput(input: MonthlyPayrollBaseInput): void {
  if (!Number.isFinite(input.grossSalary) || input.grossSalary <= 0) {
    throw new Error("grossSalary must be a finite number greater than 0.");
  }
  if (
    input.taxableSalary !== undefined &&
    (!Number.isFinite(input.taxableSalary) || input.taxableSalary <= 0)
  ) {
    throw new Error("taxableSalary must be a finite number greater than 0.");
  }
  if (
    input.taxableSalary !== undefined &&
    input.taxableSalary > input.grossSalary
  ) {
    throw new Error("taxableSalary cannot be greater than grossSalary.");
  }
  if (!Number.isFinite(input.afpRatePercent) || input.afpRatePercent <= 0) {
    throw new Error("afpRatePercent must be a finite number greater than 0.");
  }
  if (
    !Number.isFinite(input.economicParameters.uf) ||
    input.economicParameters.uf <= 0
  ) {
    throw new Error(
      "economicParameters.uf must be a finite number greater than 0."
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

function resolveWorkerUnemploymentInsuranceRatePercent(
  contractType: PayrollContractType
): number {
  return contractType === "indefinido" ? 0.6 : 0;
}

export function calculateMonthlyPayrollBase(
  input: MonthlyPayrollBaseInput
): MonthlyPayrollBaseOutput {
  assertInput(input);

  const taxableSalary = input.taxableSalary ?? input.grossSalary;
  const contractType = input.contractType ?? "indefinido";
  const afpPercent = input.afpRatePercent / 100;
  const isapreAdditionalPercent =
    input.healthSystem === "isapre" ? (input.isapreAdditionalPercent ?? 0) : 0;
  const healthPercent = 0.07 + isapreAdditionalPercent / 100;
  const unemploymentInsurancePercent =
    resolveWorkerUnemploymentInsuranceRatePercent(contractType) / 100;
  const pensionAndHealthMonthlyTaxableCapUf =
    input.economicParameters.previsionalTopes
      ?.pensionAndHealthMonthlyTaxableCapUf ??
    DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF;
  const unemploymentMonthlyTaxableCapUf =
    input.economicParameters.afcTopes?.monthlyTaxableCapUf ??
    DEFAULT_UNEMPLOYMENT_MONTHLY_TAXABLE_CAP_UF;

  const pensionAndHealthBase = Math.min(
    taxableSalary,
    pensionAndHealthMonthlyTaxableCapUf * input.economicParameters.uf
  );
  const unemploymentBase = Math.min(
    taxableSalary,
    unemploymentMonthlyTaxableCapUf * input.economicParameters.uf
  );

  const afp = pensionAndHealthBase * afpPercent;
  const health = pensionAndHealthBase * healthPercent;
  const unemploymentInsurance = unemploymentBase * unemploymentInsurancePercent;
  const incomeTaxBase = Math.max(
    0,
    taxableSalary - afp - health - unemploymentInsurance
  );

  return {
    grossSalary: input.grossSalary,
    taxableSalary,
    nonTaxableIncome: Math.max(0, input.grossSalary - taxableSalary),
    incomeTaxBase,
    contractType,
    cappedBases: {
      pensionAndHealth: pensionAndHealthBase,
      unemploymentInsurance: unemploymentBase,
    },
    deductions: {
      afp,
      health,
      unemploymentInsurance,
    },
    effectiveRates: {
      afpPercent: afpPercent * 100,
      healthPercent: healthPercent * 100,
      unemploymentInsurancePercent: unemploymentInsurancePercent * 100,
    },
    assumptions: {
      usedGrossAsTaxableSalary: input.taxableSalary === undefined,
      pensionAndHealthMonthlyTaxableCapUf,
      unemploymentMonthlyTaxableCapUf,
    },
  };
}
