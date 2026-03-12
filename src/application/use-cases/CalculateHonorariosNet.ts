const DEFAULT_WITHHOLDING_RATE_PERCENT = 15.25;
const DEFAULT_COVERAGE_BASE_PERCENT = 80;

export interface HonorariosNetInput {
  grossFee: number;
  withholdingRatePercent?: number;
  issuedMonthsPerYear?: number;
  annualGrossFees?: number;
}

export interface HonorariosNetOutput {
  grossFee: number;
  withholdingRatePercent: number;
  withholdingAmount: number;
  netFeeReceived: number;
  annualGrossFees: number;
  annualWithholdingAmount: number;
  coverageBaseRatePercent: number;
  annualCoverageBase: number;
  monthlyCoverageBaseEquivalent: number;
  annualCoverageWindow: {
    startsOn: string;
    endsOn: string;
  };
  assumptions: string[];
}

function assertInput(input: HonorariosNetInput): void {
  if (!Number.isFinite(input.grossFee) || input.grossFee <= 0) {
    throw new Error("grossFee must be a finite number greater than 0.");
  }
  if (
    input.withholdingRatePercent !== undefined &&
    (!Number.isFinite(input.withholdingRatePercent) ||
      input.withholdingRatePercent <= 0 ||
      input.withholdingRatePercent >= 100)
  ) {
    throw new Error(
      "withholdingRatePercent must be a finite number between 0 and 100."
    );
  }
  if (
    input.issuedMonthsPerYear !== undefined &&
    (!Number.isFinite(input.issuedMonthsPerYear) ||
      input.issuedMonthsPerYear <= 0 ||
      input.issuedMonthsPerYear > 12)
  ) {
    throw new Error(
      "issuedMonthsPerYear must be a finite number between 1 and 12."
    );
  }
  if (
    input.annualGrossFees !== undefined &&
    (!Number.isFinite(input.annualGrossFees) || input.annualGrossFees <= 0)
  ) {
    throw new Error(
      "annualGrossFees must be a finite number greater than 0 when provided."
    );
  }
}

export function calculateHonorariosNet(
  input: HonorariosNetInput
): HonorariosNetOutput {
  assertInput(input);

  const withholdingRatePercent =
    input.withholdingRatePercent ?? DEFAULT_WITHHOLDING_RATE_PERCENT;
  const issuedMonthsPerYear = input.issuedMonthsPerYear ?? 12;
  const withholdingAmount = input.grossFee * (withholdingRatePercent / 100);
  const netFeeReceived = input.grossFee - withholdingAmount;
  const annualGrossFees =
    input.annualGrossFees ?? input.grossFee * issuedMonthsPerYear;
  const annualWithholdingAmount =
    annualGrossFees * (withholdingRatePercent / 100);
  const annualCoverageBase =
    annualGrossFees * (DEFAULT_COVERAGE_BASE_PERCENT / 100);
  const monthlyCoverageBaseEquivalent = annualCoverageBase / 12;

  return {
    grossFee: input.grossFee,
    withholdingRatePercent,
    withholdingAmount,
    netFeeReceived,
    annualGrossFees,
    annualWithholdingAmount,
    coverageBaseRatePercent: DEFAULT_COVERAGE_BASE_PERCENT,
    annualCoverageBase,
    monthlyCoverageBaseEquivalent,
    annualCoverageWindow: {
      startsOn: "2026-07-01",
      endsOn: "2027-06-30",
    },
    assumptions: [
      "El líquido mensual se calcula como bruto menos retención al emitir la boleta.",
      "La base de cobertura anual se estima como 80% del total bruto anual boleteado.",
      "La calculadora no determina por sí sola si quedas eximido por monto anual, causal legal específica o afiliación previsional.",
      "La regularización final ocurre en Operación Renta y puede terminar con devolución o cobro de diferencia.",
    ],
  };
}
