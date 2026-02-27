export interface ConsumerCreditInput {
  principal: number;
  termMonths: number;
  rateValue: number;
  rateType: "mensual" | "anual";
  monthlyInsurance?: number;
  operatingCosts?: number;
}

export interface ConsumerCreditOutput {
  monthlyRateDecimal: number;
  monthlyPaymentBase: number;
  monthlyPaymentTotal: number;
  totalPaid: number;
  totalInterest: number;
  annualEquivalentRatePercent: number;
  caePercent: number;
}

function assertInput(input: ConsumerCreditInput): void {
  if (!Number.isFinite(input.principal) || input.principal <= 0) {
    throw new Error("principal must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.termMonths) || input.termMonths <= 0) {
    throw new Error("termMonths must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.rateValue) || input.rateValue <= 0) {
    throw new Error("rateValue must be a finite number greater than 0.");
  }
}

function annuityPayment(
  principal: number,
  monthlyRateDecimal: number,
  termMonths: number
): number {
  if (monthlyRateDecimal === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRateDecimal, termMonths);
  return (principal * monthlyRateDecimal * factor) / (factor - 1);
}

function estimateCaePercent(
  netDisbursedPrincipal: number,
  monthlyPaymentTotal: number,
  termMonths: number
): number {
  let low = 0;
  let high = 2;
  let monthlyRate = 0.05;

  for (let i = 0; i < 50; i += 1) {
    monthlyRate = (low + high) / 2;
    const presentValue =
      (monthlyPaymentTotal * (1 - Math.pow(1 + monthlyRate, -termMonths))) /
      monthlyRate;
    if (presentValue > netDisbursedPrincipal) {
      low = monthlyRate;
    } else {
      high = monthlyRate;
    }
  }

  return (Math.pow(1 + monthlyRate, 12) - 1) * 100;
}

export function calculateConsumerCredit(
  input: ConsumerCreditInput
): ConsumerCreditOutput {
  assertInput(input);

  const monthlyInsurance = input.monthlyInsurance ?? 0;
  const operatingCosts = input.operatingCosts ?? 0;
  const monthlyRateDecimal =
    input.rateType === "anual"
      ? Math.pow(1 + input.rateValue / 100, 1 / 12) - 1
      : input.rateValue / 100;

  const monthlyPaymentBase = annuityPayment(
    input.principal,
    monthlyRateDecimal,
    input.termMonths
  );
  const monthlyPaymentTotal = monthlyPaymentBase + monthlyInsurance;
  const totalPaid = monthlyPaymentTotal * input.termMonths + operatingCosts;
  const totalInterest = totalPaid - input.principal;
  const netDisbursedPrincipal = Math.max(1, input.principal - operatingCosts);

  return {
    monthlyRateDecimal,
    monthlyPaymentBase,
    monthlyPaymentTotal,
    totalPaid,
    totalInterest,
    annualEquivalentRatePercent:
      (Math.pow(1 + monthlyRateDecimal, 12) - 1) * 100,
    caePercent: estimateCaePercent(
      netDisbursedPrincipal,
      monthlyPaymentTotal,
      input.termMonths
    ),
  };
}
