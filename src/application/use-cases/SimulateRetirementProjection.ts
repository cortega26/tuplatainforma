export interface RetirementProjectionInput {
  currentAge: number;
  retirementAge: number;
  grossSalary: number;
  currentBalance: number;
  annualReturnPercent: number;
  lifeExpectancyAge: number;
  currentYear?: number;
}

export interface RetirementProjectionOutput {
  yearsRemaining: number;
  totalMonths: number;
  projectedBalance: number;
  estimatedMonthlyPension: number;
  salaryReplacementPercent: number;
  pensionMonths: number;
  apvExtraProjectionAt100kMonthly: number;
}

const REFORMA_START_YEAR = 2000 + 25;
const REFORMA_FULL_RATE_YEAR = REFORMA_START_YEAR + 8;
const REFORMA_START_RATE = 0.009;
const REFORMA_FINAL_RATE = 0.045;

function employerContributionRateForYear(year: number): number {
  if (year < REFORMA_START_YEAR) return 0;
  if (year >= REFORMA_FULL_RATE_YEAR) return REFORMA_FINAL_RATE;

  return (
    REFORMA_START_RATE +
    ((year - REFORMA_START_YEAR) /
      (REFORMA_FULL_RATE_YEAR - REFORMA_START_YEAR)) *
      (REFORMA_FINAL_RATE - REFORMA_START_RATE)
  );
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
}

export function simulateRetirementProjection(
  input: RetirementProjectionInput
): RetirementProjectionOutput {
  assertInput(input);

  const yearsRemaining = Math.max(0, input.retirementAge - input.currentAge);
  if (yearsRemaining <= 0) {
    throw new Error("retirementAge must be greater than currentAge.");
  }

  const annualReturnDecimal = input.annualReturnPercent / 100;
  const monthlyReturnDecimal = Math.pow(1 + annualReturnDecimal, 1 / 12) - 1;
  const currentYear = input.currentYear ?? new Date().getFullYear();
  const totalMonths = yearsRemaining * 12;

  let projectedBalance = input.currentBalance;
  for (let month = 0; month < totalMonths; month += 1) {
    const year = currentYear + Math.floor(month / 12);
    const workerContribution = input.grossSalary * 0.1;
    const employerContribution =
      input.grossSalary * employerContributionRateForYear(year);

    projectedBalance =
      projectedBalance * (1 + monthlyReturnDecimal) +
      workerContribution +
      employerContribution;
  }

  const pensionMonths = Math.max(
    1,
    (input.lifeExpectancyAge - input.retirementAge) * 12
  );
  const estimatedMonthlyPension = projectedBalance / pensionMonths;
  const salaryReplacementPercent =
    (estimatedMonthlyPension / input.grossSalary) * 100;
  const apvExtraProjectionAt100kMonthly =
    100000 *
    ((Math.pow(1 + monthlyReturnDecimal, totalMonths) - 1) /
      monthlyReturnDecimal);

  return {
    yearsRemaining,
    totalMonths,
    projectedBalance,
    estimatedMonthlyPension,
    salaryReplacementPercent,
    pensionMonths,
    apvExtraProjectionAt100kMonthly,
  };
}
