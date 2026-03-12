import type { EconomicParameters } from "@/domain/economic/EconomicParameters";
import {
  getEmployerContributionToIndividualAccountPercentForDate,
  RETIREMENT_EMPLOYER_CONTRIBUTION_SCHEDULE_SOURCE,
  RETIREMENT_EMPLOYER_CONTRIBUTION_SCHEDULE_VERSION,
} from "@/application/use-cases/shared/retirementEmployerContributionSchedule";

export interface RetirementProjectionInput {
  currentAge: number;
  retirementAge: number;
  grossSalary: number;
  currentBalance: number;
  annualReturnPercent: number;
  lifeExpectancyAge: number;
  contributionDensityPercent?: number;
  currentDate?: string;
  economicParameters: Pick<EconomicParameters, "uf" | "previsionalTopes">;
}

export interface RetirementProjectionScenarioOutput {
  id: "selected" | "conservative" | "base" | "aggressive";
  label: string;
  annualReturnPercent: number;
  projectedBalance: number;
  estimatedMonthlyPension: number;
  salaryReplacementPercent: number;
  totalWorkerContributions: number;
  totalEmployerContributionsToIndividualAccount: number;
  apvExtraProjectionAt100kMonthly: number;
}

export interface RetirementProjectionOutput {
  yearsRemaining: number;
  totalMonths: number;
  monthsWithContributions: number;
  monthsWithoutContributions: number;
  taxableSalaryUsedClp: number;
  salaryCapClp: number;
  pensionMonths: number;
  contributionDensityPercent: number;
  employerContributionScheduleVersion: string;
  employerContributionScheduleSource: {
    label: string;
    url: string;
    lastVerified: string;
  };
  excludedBenefits: string[];
  selectedScenario: RetirementProjectionScenarioOutput;
  scenarios: RetirementProjectionScenarioOutput[];
}

const DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF = 90;
const WORKER_CONTRIBUTION_PERCENT = 0.1;
const COMPARISON_SCENARIOS = [
  { id: "conservative", label: "Conservador", annualReturnPercent: 3 },
  { id: "base", label: "Base", annualReturnPercent: 5 },
  { id: "aggressive", label: "Agresivo", annualReturnPercent: 7 },
] as const;

function getMonthStart(dateLike: string): Date {
  const date = new Date(`${dateLike}T00:00:00.000Z`);
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), 1));
}

function addUtcMonths(base: Date, months: number): Date {
  return new Date(
    Date.UTC(base.getUTCFullYear(), base.getUTCMonth() + months, 1)
  );
}

function toIsoDate(date: Date): string {
  return date.toISOString().slice(0, 10);
}

function resolveContributionMonthFlags(
  totalMonths: number,
  contributionDensityPercent: number
): boolean[] {
  const targetContributionMonths = Math.round(
    totalMonths * (contributionDensityPercent / 100)
  );
  const flags: boolean[] = [];
  let contributionMonthsAssigned = 0;

  for (let monthIndex = 0; monthIndex < totalMonths; monthIndex += 1) {
    const expectedContributionMonths = Math.round(
      ((monthIndex + 1) * targetContributionMonths) / totalMonths
    );
    const contributes = expectedContributionMonths > contributionMonthsAssigned;
    flags.push(contributes);
    if (contributes) {
      contributionMonthsAssigned += 1;
    }
  }

  return flags;
}

function assertInput(input: RetirementProjectionInput): void {
  if (!Number.isFinite(input.currentAge) || input.currentAge <= 0) {
    throw new Error("currentAge must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.retirementAge) || input.retirementAge <= 0) {
    throw new Error("retirementAge must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.grossSalary) || input.grossSalary <= 0) {
    throw new Error("grossSalary must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.currentBalance) || input.currentBalance < 0) {
    throw new Error(
      "currentBalance must be a finite number greater than or equal to 0."
    );
  }
  if (
    !Number.isFinite(input.lifeExpectancyAge) ||
    input.lifeExpectancyAge <= 0
  ) {
    throw new Error(
      "lifeExpectancyAge must be a finite number greater than 0."
    );
  }
  if (
    !Number.isFinite(input.annualReturnPercent) ||
    input.annualReturnPercent < 0
  ) {
    throw new Error("annualReturnPercent must be a finite number >= 0.");
  }
  if (
    input.contributionDensityPercent !== undefined &&
    (!Number.isFinite(input.contributionDensityPercent) ||
      input.contributionDensityPercent < 0 ||
      input.contributionDensityPercent > 100)
  ) {
    throw new Error("contributionDensityPercent must be between 0 and 100.");
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

function buildScenario(
  input: RetirementProjectionInput,
  options: {
    id: RetirementProjectionScenarioOutput["id"];
    label: string;
    annualReturnPercent: number;
    totalMonths: number;
    pensionMonths: number;
    taxableSalaryUsedClp: number;
    contributionMonthFlags: boolean[];
    currentDate: string;
  }
): RetirementProjectionScenarioOutput {
  const annualReturnDecimal = options.annualReturnPercent / 100;
  const monthlyReturnDecimal = Math.pow(1 + annualReturnDecimal, 1 / 12) - 1;

  let projectedBalance = input.currentBalance;
  let totalWorkerContributions = 0;
  let totalEmployerContributionsToIndividualAccount = 0;
  const currentMonthStart = getMonthStart(options.currentDate);

  for (let monthIndex = 0; monthIndex < options.totalMonths; monthIndex += 1) {
    const monthDate = addUtcMonths(currentMonthStart, monthIndex);
    projectedBalance *= 1 + monthlyReturnDecimal;

    if (!options.contributionMonthFlags[monthIndex]) {
      continue;
    }

    const monthIsoDate = toIsoDate(monthDate);
    const workerContribution =
      options.taxableSalaryUsedClp * WORKER_CONTRIBUTION_PERCENT;
    const employerContributionRatePercent =
      getEmployerContributionToIndividualAccountPercentForDate(monthIsoDate);
    const employerContribution =
      options.taxableSalaryUsedClp * (employerContributionRatePercent / 100);

    projectedBalance += workerContribution + employerContribution;
    totalWorkerContributions += workerContribution;
    totalEmployerContributionsToIndividualAccount += employerContribution;
  }

  const estimatedMonthlyPension = projectedBalance / options.pensionMonths;
  const salaryReplacementPercent =
    (estimatedMonthlyPension / input.grossSalary) * 100;
  const monthlyApvContribution = 100000;
  const apvExtraProjectionAt100kMonthly =
    monthlyReturnDecimal === 0
      ? monthlyApvContribution *
        options.contributionMonthFlags.filter(Boolean).length
      : options.contributionMonthFlags.reduce((balance, contributes) => {
          const updatedBalance = balance * (1 + monthlyReturnDecimal);
          return contributes
            ? updatedBalance + monthlyApvContribution
            : updatedBalance;
        }, 0);

  return {
    id: options.id,
    label: options.label,
    annualReturnPercent: options.annualReturnPercent,
    projectedBalance,
    estimatedMonthlyPension,
    salaryReplacementPercent,
    totalWorkerContributions,
    totalEmployerContributionsToIndividualAccount,
    apvExtraProjectionAt100kMonthly,
  };
}

export function simulateRetirementProjection(
  input: RetirementProjectionInput
): RetirementProjectionOutput {
  assertInput(input);

  const yearsRemaining = Math.max(0, input.retirementAge - input.currentAge);
  if (yearsRemaining <= 0) {
    throw new Error("retirementAge must be greater than currentAge.");
  }
  const totalMonths = yearsRemaining * 12;
  const pensionMonths = (input.lifeExpectancyAge - input.retirementAge) * 12;
  if (pensionMonths <= 0) {
    throw new Error(
      "lifeExpectancyAge must be greater than retirementAge to estimate pension months."
    );
  }

  const currentDate =
    input.currentDate ?? new Date().toISOString().slice(0, 10);
  const contributionDensityPercent = input.contributionDensityPercent ?? 100;
  const selectedScenarioLabel =
    COMPARISON_SCENARIOS.find(
      scenario => scenario.annualReturnPercent === input.annualReturnPercent
    )?.label ?? "Personalizado";
  const salaryCapUf =
    input.economicParameters.previsionalTopes
      ?.pensionAndHealthMonthlyTaxableCapUf ??
    DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF;
  const salaryCapClp = salaryCapUf * input.economicParameters.uf;
  const taxableSalaryUsedClp = Math.min(input.grossSalary, salaryCapClp);
  const contributionMonthFlags = resolveContributionMonthFlags(
    totalMonths,
    contributionDensityPercent
  );
  const monthsWithContributions = contributionMonthFlags.filter(Boolean).length;
  const scenarios = [
    buildScenario(input, {
      id: "selected",
      label: selectedScenarioLabel,
      annualReturnPercent: input.annualReturnPercent,
      totalMonths,
      pensionMonths,
      taxableSalaryUsedClp,
      contributionMonthFlags,
      currentDate,
    }),
    ...COMPARISON_SCENARIOS.filter(
      scenario => scenario.annualReturnPercent !== input.annualReturnPercent
    ).map(scenario =>
      buildScenario(input, {
        id: scenario.id,
        label: scenario.label,
        annualReturnPercent: scenario.annualReturnPercent,
        totalMonths,
        pensionMonths,
        taxableSalaryUsedClp,
        contributionMonthFlags,
        currentDate,
      })
    ),
  ];
  const selectedScenario = scenarios[0];

  return {
    yearsRemaining,
    totalMonths,
    monthsWithContributions,
    monthsWithoutContributions: totalMonths - monthsWithContributions,
    taxableSalaryUsedClp,
    salaryCapClp,
    pensionMonths,
    contributionDensityPercent,
    employerContributionScheduleVersion:
      RETIREMENT_EMPLOYER_CONTRIBUTION_SCHEDULE_VERSION,
    employerContributionScheduleSource: {
      ...RETIREMENT_EMPLOYER_CONTRIBUTION_SCHEDULE_SOURCE,
    },
    excludedBenefits: [
      "No se incluye PGU.",
      "No se incluye el componente de seguridad social ni la cotización con rentabilidad protegida que no va directo al saldo AFP individual.",
      "No se modelan comisiones, SIS, modalidad de pensión ni beneficios por sobrevivencia.",
    ],
    selectedScenario,
    scenarios,
  };
}
