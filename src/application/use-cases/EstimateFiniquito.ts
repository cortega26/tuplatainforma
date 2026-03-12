export type FiniquitoTerminationCause =
  | "necesidad"
  | "mutuo-acuerdo"
  | "renuncia"
  | "disciplinaria"
  | "vencimiento-obra"
  | "judicial";

export interface EstimateFiniquitoInput {
  monthlySalary: number;
  yearsWorked: number;
  additionalMonthsWorked?: number;
  pendingSalaryDays?: number;
  monthsSinceLastVacationCycle?: number;
  additionalVacationDaysWorked?: number;
  terminationCause: FiniquitoTerminationCause;
  noticeGiven?: boolean;
}

export interface EstimateFiniquitoOutput {
  monthlySalary: number;
  serviceYearsCounted: number;
  cappedServiceYears: number;
  pendingSalaryDays: number;
  pendingSalaryAmount: number;
  proportionalVacationDays: number;
  proportionalVacationAmount: number;
  yearsOfServiceIndemnity: number;
  substituteNoticeIndemnity: number;
  totalEstimate: number;
  compensationProfile: {
    appliesYearsOfService: boolean;
    appliesSubstituteNotice: boolean;
    requiresProfessionalReview: boolean;
  };
  assumptions: string[];
}

const MAX_SERVICE_YEARS = 11;
const VACATION_DAYS_PER_YEAR = 15;
const MONTHS_PER_YEAR = 12;
const DAYS_PER_MONTH_FOR_SALARY = 30;
const DAYS_PER_YEAR_FOR_VACATION = 360;

function assertInput(input: EstimateFiniquitoInput): void {
  if (!Number.isFinite(input.monthlySalary) || input.monthlySalary <= 0) {
    throw new Error("monthlySalary must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.yearsWorked) || input.yearsWorked < 0) {
    throw new Error("yearsWorked must be a finite number >= 0.");
  }
  if (
    input.additionalMonthsWorked !== undefined &&
    (!Number.isFinite(input.additionalMonthsWorked) ||
      input.additionalMonthsWorked < 0 ||
      input.additionalMonthsWorked >= 12)
  ) {
    throw new Error(
      "additionalMonthsWorked must be a finite number between 0 and 11."
    );
  }
  if (
    input.pendingSalaryDays !== undefined &&
    (!Number.isFinite(input.pendingSalaryDays) ||
      input.pendingSalaryDays < 0 ||
      input.pendingSalaryDays > 30)
  ) {
    throw new Error(
      "pendingSalaryDays must be a finite number between 0 and 30."
    );
  }
  if (
    input.monthsSinceLastVacationCycle !== undefined &&
    (!Number.isFinite(input.monthsSinceLastVacationCycle) ||
      input.monthsSinceLastVacationCycle < 0 ||
      input.monthsSinceLastVacationCycle > 12)
  ) {
    throw new Error(
      "monthsSinceLastVacationCycle must be a finite number between 0 and 12."
    );
  }
  if (
    input.additionalVacationDaysWorked !== undefined &&
    (!Number.isFinite(input.additionalVacationDaysWorked) ||
      input.additionalVacationDaysWorked < 0 ||
      input.additionalVacationDaysWorked > 30)
  ) {
    throw new Error(
      "additionalVacationDaysWorked must be a finite number between 0 and 30."
    );
  }
}

export function estimateFiniquito(
  input: EstimateFiniquitoInput
): EstimateFiniquitoOutput {
  assertInput(input);

  const additionalMonthsWorked = input.additionalMonthsWorked ?? 0;
  const pendingSalaryDays = input.pendingSalaryDays ?? 0;
  const monthsSinceLastVacationCycle = input.monthsSinceLastVacationCycle ?? 0;
  const additionalVacationDaysWorked = input.additionalVacationDaysWorked ?? 0;
  const serviceYearsCounted =
    input.yearsWorked + (additionalMonthsWorked >= 6 ? 1 : 0);
  const cappedServiceYears = Math.min(serviceYearsCounted, MAX_SERVICE_YEARS);

  const appliesYearsOfService =
    input.terminationCause === "necesidad" ||
    input.terminationCause === "judicial";
  const appliesSubstituteNotice =
    (input.terminationCause === "necesidad" ||
      input.terminationCause === "judicial") &&
    input.noticeGiven !== true;
  const requiresProfessionalReview = input.terminationCause === "judicial";

  const dailySalary = input.monthlySalary / DAYS_PER_MONTH_FOR_SALARY;
  const proportionalVacationDays =
    monthsSinceLastVacationCycle * (VACATION_DAYS_PER_YEAR / MONTHS_PER_YEAR) +
    additionalVacationDaysWorked *
      (VACATION_DAYS_PER_YEAR / DAYS_PER_YEAR_FOR_VACATION);

  const pendingSalaryAmount = dailySalary * pendingSalaryDays;
  const proportionalVacationAmount = dailySalary * proportionalVacationDays;
  const yearsOfServiceIndemnity = appliesYearsOfService
    ? cappedServiceYears * input.monthlySalary
    : 0;
  const substituteNoticeIndemnity = appliesSubstituteNotice
    ? input.monthlySalary
    : 0;

  const totalEstimate =
    pendingSalaryAmount +
    proportionalVacationAmount +
    yearsOfServiceIndemnity +
    substituteNoticeIndemnity;

  return {
    monthlySalary: input.monthlySalary,
    serviceYearsCounted,
    cappedServiceYears,
    pendingSalaryDays,
    pendingSalaryAmount,
    proportionalVacationDays,
    proportionalVacationAmount,
    yearsOfServiceIndemnity,
    substituteNoticeIndemnity,
    totalEstimate,
    compensationProfile: {
      appliesYearsOfService,
      appliesSubstituteNotice,
      requiresProfessionalReview,
    },
    assumptions: [
      "La indemnización por años de servicio se estima como 30 días por año con tope legal de 11 años.",
      "El año fraccionado superior a 6 meses se cuenta como año completo para esta estimación.",
      "El feriado proporcional usa base de 15 días hábiles por año y valor diario mensual dividido por 30.",
      "No incorpora recargos judiciales, cláusulas pactadas, remuneraciones variables complejas ni descuentos en disputa.",
    ],
  };
}
