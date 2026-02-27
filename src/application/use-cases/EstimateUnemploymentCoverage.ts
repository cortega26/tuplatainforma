import type { EconomicParameters } from "@/domain/economic/EconomicParameters";

const DEFAULT_PAYOUT_RATES = [0.7, 0.55, 0.45, 0.4, 0.35, 0.3] as const;

export interface UnemploymentCoverageInput {
  grossSalary: number;
  contractType: "indefinido" | "plazo-fijo";
  terminationCause:
    | "necesidad"
    | "vencimiento"
    | "acuerdo"
    | "renuncia"
    | "despido-culpa";
  monthsContributed: number;
  currentCicBalance?: number;
  economicParameters: Pick<EconomicParameters, "uf" | "afcTopes">;
}

export interface UnemploymentCoverageOutput {
  taxableCapClp: number;
  taxableSalaryClp: number;
  monthlyContribution: number;
  estimatedCicBalance: number;
  minimumContributionsRequired: number;
  meetsMinimumContributions: boolean;
  eligibleForSolidarityFund: boolean;
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
    input.economicParameters.afcTopes?.monthlyTaxableCapUf ?? 131.9;
  const taxableCapClp = taxableCapUf * input.economicParameters.uf;
  const taxableSalaryClp = Math.min(input.grossSalary, taxableCapClp);
  const monthlyContribution = taxableSalaryClp * 0.03;

  const estimatedCicBalance =
    input.currentCicBalance && input.currentCicBalance > 0
      ? input.currentCicBalance
      : monthlyContribution * input.monthsContributed * 0.9;

  const minimumContributionsRequired =
    input.contractType === "indefinido" ? 6 : 3;
  const meetsMinimumContributions =
    input.monthsContributed >= minimumContributionsRequired;
  const eligibleCauses: UnemploymentCoverageInput["terminationCause"][] = [
    "necesidad",
    "vencimiento",
    "acuerdo",
  ];
  const eligibleForSolidarityFund =
    eligibleCauses.includes(input.terminationCause) &&
    input.monthsContributed >= 10;

  const payouts: number[] = [];
  for (const payoutRate of DEFAULT_PAYOUT_RATES) {
    const targetPayout = input.grossSalary * payoutRate;
    const accumulatedPaid = payouts.reduce((acc, value) => acc + value, 0);
    const availableBalance = estimatedCicBalance - accumulatedPaid;
    payouts.push(
      availableBalance > 0 ? Math.min(targetPayout, availableBalance) : 0
    );
  }

  const totalCoverage = payouts.reduce((acc, value) => acc + value, 0);
  const monthsCovered = payouts.filter(value => value > 0).length;

  return {
    taxableCapClp,
    taxableSalaryClp,
    monthlyContribution,
    estimatedCicBalance,
    minimumContributionsRequired,
    meetsMinimumContributions,
    eligibleForSolidarityFund,
    payouts,
    payoutRates: [...DEFAULT_PAYOUT_RATES],
    monthsCovered,
    totalCoverage,
  };
}
