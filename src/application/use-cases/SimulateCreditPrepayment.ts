export interface CreditSimulationOutput {
  months: number;
  totalPaid: number;
  totalInterest: number;
}

export interface CreditPrepaymentInput {
  currentBalance: number;
  monthlyPayment: number;
  monthlyRatePercent: number;
  remainingMonths: number;
  prepaymentAmount: number;
  effect: "reducir-plazo" | "reducir-cuota";
  alternativeAnnualReturnPercent: number;
}

export interface CreditPrepaymentOutput {
  withoutPrepayment: CreditSimulationOutput;
  withPrepayment: CreditSimulationOutput;
  balanceAfterPrepayment: number;
  interestSavings: number;
  monthsSaved: number;
  newMonthlyPaymentIfReducePayment: number | null;
  annualCreditRatePercent: number;
  futureInvestmentValue: number;
  investmentGain: number;
  mathematicallyBetterToPrepay: boolean;
}

function simulateCredit(
  balance: number,
  monthlyRateDecimal: number,
  monthlyPayment: number,
  maxMonths: number
): CreditSimulationOutput {
  let remainingBalance = balance;
  let totalPaid = 0;
  let months = 0;

  while (remainingBalance > 100 && months < maxMonths) {
    const interest = remainingBalance * monthlyRateDecimal;
    const payment = Math.min(monthlyPayment, remainingBalance + interest);
    remainingBalance = remainingBalance + interest - payment;
    totalPaid += payment;
    months += 1;
  }

  return {
    months,
    totalPaid,
    totalInterest: totalPaid - balance,
  };
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

function assertInput(input: CreditPrepaymentInput): void {
  if (!Number.isFinite(input.currentBalance) || input.currentBalance <= 0) {
    throw new Error("currentBalance must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.monthlyPayment) || input.monthlyPayment <= 0) {
    throw new Error("monthlyPayment must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.prepaymentAmount) || input.prepaymentAmount <= 0) {
    throw new Error("prepaymentAmount must be a finite number greater than 0.");
  }
  if (!Number.isFinite(input.remainingMonths) || input.remainingMonths <= 0) {
    throw new Error("remainingMonths must be a finite number greater than 0.");
  }
}

export function simulateCreditPrepayment(
  input: CreditPrepaymentInput
): CreditPrepaymentOutput {
  assertInput(input);

  const monthlyRateDecimal = input.monthlyRatePercent / 100;
  const maxMonths = input.remainingMonths + 12;

  const withoutPrepayment = simulateCredit(
    input.currentBalance,
    monthlyRateDecimal,
    input.monthlyPayment,
    maxMonths
  );

  const balanceAfterPrepayment = Math.max(
    0,
    input.currentBalance - input.prepaymentAmount
  );

  const newMonthlyPaymentIfReducePayment =
    input.effect === "reducir-cuota" && balanceAfterPrepayment > 0
      ? annuityPayment(
          balanceAfterPrepayment,
          monthlyRateDecimal,
          input.remainingMonths
        )
      : null;

  const paymentForSimulation =
    input.effect === "reducir-plazo"
      ? input.monthlyPayment
      : (newMonthlyPaymentIfReducePayment ?? 0);

  const withPrepayment = simulateCredit(
    balanceAfterPrepayment,
    monthlyRateDecimal,
    paymentForSimulation,
    maxMonths
  );

  const interestSavings =
    withoutPrepayment.totalInterest - withPrepayment.totalInterest;
  const monthsSaved = withoutPrepayment.months - withPrepayment.months;
  const investmentMonthlyReturn =
    Math.pow(1 + input.alternativeAnnualReturnPercent / 100, 1 / 12) - 1;
  const futureInvestmentValue =
    input.prepaymentAmount *
    Math.pow(1 + investmentMonthlyReturn, withoutPrepayment.months);
  const investmentGain = futureInvestmentValue - input.prepaymentAmount;

  return {
    withoutPrepayment,
    withPrepayment,
    balanceAfterPrepayment,
    interestSavings,
    monthsSaved,
    newMonthlyPaymentIfReducePayment,
    annualCreditRatePercent: (Math.pow(1 + monthlyRateDecimal, 12) - 1) * 100,
    futureInvestmentValue,
    investmentGain,
    mathematicallyBetterToPrepay: interestSavings > investmentGain,
  };
}
