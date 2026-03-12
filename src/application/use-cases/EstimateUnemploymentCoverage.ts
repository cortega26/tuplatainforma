import type { EconomicParameters } from "@/domain/economic/EconomicParameters";

const DEFAULT_PAYOUT_RATES = [0.7, 0.6, 0.45, 0.4, 0.35, 0.3] as const;
const DEFAULT_MONTHLY_TAXABLE_CAP_UF = 135.2;

const CIC_CONTRIBUTION_RATES = {
  indefinido: 0.022,
  "plazo-fijo": 0.028,
} as const;

const SOLIDARITY_FUND_CONTRIBUTION_RATES = {
  indefinido: 0.008,
  "plazo-fijo": 0.002,
} as const;

const CIC_MINIMUM_CONTRIBUTIONS = {
  indefinido: 10,
  "plazo-fijo": 5,
} as const;

const SOLIDARITY_FUND_REFERENCE = {
  label: "AFC Chile - valores del Fondo de Cesantía Solidario vigentes 2026-03",
  url: "https://www.afcchile.cl/beneficios/valores-superiores-e-inferiores-fcs",
  validUntil: "2027-02-28",
} as const;

export type UnemploymentBalanceSource = "provided" | "estimated";
export type SolidarityFundStatus =
  | "minimum-criteria-met"
  | "needs-more-contributions"
  | "ineligible-cause"
  | "requires-continuity-check";

export interface UnemploymentCoverageInput {
  grossSalary: number;
  contractType: "indefinido" | "plazo-fijo";
  terminationCause:
    | "necesidad"
    | "vencimiento"
    | "liquidacion"
    | "renuncia"
    | "despido-culpa";
  monthsContributed: number;
  currentCicBalance?: number;
  lastThreeContinuousContributions?: boolean;
  economicParameters: Pick<EconomicParameters, "uf" | "afcTopes">;
}

export interface UnemploymentCoverageOutput {
  taxableCapClp: number;
  taxableSalaryClp: number;
  payoutBaseSalaryClp: number;
  balanceSource: UnemploymentBalanceSource;
  monthlyCicContribution: number;
  monthlySolidarityContribution: number;
  cicContributionRatePercent: number;
  solidarityFundContributionRatePercent: number;
  estimatedCicBalance: number;
  minimumContributionsRequired: number;
  meetsMinimumContributions: boolean;
  eligibleForSolidarityFund: boolean;
  solidarityFundStatus: SolidarityFundStatus;
  solidarityFundMinimumContributionsRequired: number;
  solidarityFundReference: {
    label: string;
    url: string;
    validUntil: string;
  };
  assumptions: string[];
  payouts: number[];
  payoutRates: number[];
  monthsCovered: number;
  totalCoverage: number;
}

function assertInput(input: UnemploymentCoverageInput): void {
  if (!Number.isFinite(input.grossSalary) || input.grossSalary <= 0) {
    throw new Error("grossSalary must be a finite number greater than 0.");
  }
  if (
    !Number.isFinite(input.monthsContributed) ||
    input.monthsContributed < 0
  ) {
    throw new Error("monthsContributed must be a finite number >= 0.");
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

export function estimateUnemploymentCoverage(
  input: UnemploymentCoverageInput
): UnemploymentCoverageOutput {
  assertInput(input);

  const taxableCapUf =
    input.economicParameters.afcTopes?.monthlyTaxableCapUf ??
    DEFAULT_MONTHLY_TAXABLE_CAP_UF;
  const taxableCapClp = taxableCapUf * input.economicParameters.uf;
  const taxableSalaryClp = Math.min(input.grossSalary, taxableCapClp);
  const monthlyCicContribution =
    taxableSalaryClp * CIC_CONTRIBUTION_RATES[input.contractType];
  const monthlySolidarityContribution =
    taxableSalaryClp * SOLIDARITY_FUND_CONTRIBUTION_RATES[input.contractType];
  const balanceSource: UnemploymentBalanceSource =
    input.currentCicBalance && input.currentCicBalance > 0
      ? "provided"
      : "estimated";
  const providedCicBalance = input.currentCicBalance ?? 0;

  const estimatedCicBalance =
    balanceSource === "provided"
      ? providedCicBalance
      : monthlyCicContribution * input.monthsContributed;

  const minimumContributionsRequired =
    CIC_MINIMUM_CONTRIBUTIONS[input.contractType];
  const meetsMinimumContributions =
    input.monthsContributed >= minimumContributionsRequired;
  const eligibleCauses: UnemploymentCoverageInput["terminationCause"][] = [
    "necesidad",
    "vencimiento",
    "liquidacion",
  ];
  const meetsSolidarityFundMinimumContributions = input.monthsContributed >= 10;
  const causeEligible = eligibleCauses.includes(input.terminationCause);
  const continuityConfirmed =
    input.lastThreeContinuousContributions === undefined
      ? null
      : input.lastThreeContinuousContributions;

  let solidarityFundStatus: SolidarityFundStatus;
  if (!causeEligible) {
    solidarityFundStatus = "ineligible-cause";
  } else if (!meetsSolidarityFundMinimumContributions) {
    solidarityFundStatus = "needs-more-contributions";
  } else if (continuityConfirmed !== true) {
    solidarityFundStatus = "requires-continuity-check";
  } else {
    solidarityFundStatus = "minimum-criteria-met";
  }

  const eligibleForSolidarityFund =
    solidarityFundStatus === "minimum-criteria-met";

  const payouts: number[] = [];
  for (const payoutRate of DEFAULT_PAYOUT_RATES) {
    const targetPayout = taxableSalaryClp * payoutRate;
    const accumulatedPaid = payouts.reduce((acc, value) => acc + value, 0);
    const availableBalance = estimatedCicBalance - accumulatedPaid;
    payouts.push(
      availableBalance > 0 ? Math.min(targetPayout, availableBalance) : 0
    );
  }

  const totalCoverage = payouts.reduce((acc, value) => acc + value, 0);
  const monthsCovered = payouts.filter(value => value > 0).length;
  const assumptions = [
    balanceSource === "provided"
      ? "Se usó el saldo CIC informado por la persona usuaria."
      : "Se estimó la CIC solo con cotizaciones que van a la cuenta individual, sin rentabilidad, comisiones, retiros previos ni ajustes AFC.",
    "La calculadora no estima montos del Fondo de Cesantía Solidario; solo revisa el filtro mínimo y referencia la tabla oficial vigente.",
  ];

  return {
    taxableCapClp,
    taxableSalaryClp,
    payoutBaseSalaryClp: taxableSalaryClp,
    balanceSource,
    monthlyCicContribution,
    monthlySolidarityContribution,
    cicContributionRatePercent:
      CIC_CONTRIBUTION_RATES[input.contractType] * 100,
    solidarityFundContributionRatePercent:
      SOLIDARITY_FUND_CONTRIBUTION_RATES[input.contractType] * 100,
    estimatedCicBalance,
    minimumContributionsRequired,
    meetsMinimumContributions,
    eligibleForSolidarityFund,
    solidarityFundStatus,
    solidarityFundMinimumContributionsRequired: 10,
    solidarityFundReference: { ...SOLIDARITY_FUND_REFERENCE },
    assumptions,
    payouts,
    payoutRates: [...DEFAULT_PAYOUT_RATES],
    monthsCovered,
    totalCoverage,
  };
}
