export interface CreditCardCostInput {
  debt: number;
  monthlyRatePercent: number;
  minimumPaymentPercent: number;
  fixedMonthlyPayment?: number;
  maxMonths?: number;
}

export interface CreditCardScenarioOutput {
  months: number;
  totalPaid: number;
  totalInterest: number;
  firstMonthlyPayments: number[];
}

export interface CreditCardCostOutput {
  usesFixedPayment: boolean;
  baseline: CreditCardScenarioOutput;
  doubledPayment: CreditCardScenarioOutput;
}

function simulateRepayment(
  debt: number,
  monthlyRateDecimal: number,
  paymentStrategy: (balance: number) => number,
  maxMonths: number
): CreditCardScenarioOutput {
  let balance = debt;
  let totalPaid = 0;
  let months = 0;
  const firstMonthlyPayments: number[] = [];

  while (balance > 100 && months < maxMonths) {
    const interest = balance * monthlyRateDecimal;
    const plannedPayment = Math.max(paymentStrategy(balance), interest + 100);
    const realPayment = Math.min(plannedPayment, balance + interest);

    balance = balance + interest - realPayment;
    totalPaid += realPayment;
    months += 1;

    if (months <= 6) {
      firstMonthlyPayments.push(realPayment);
    }
  }

  return {
    months,
    totalPaid,
    totalInterest: totalPaid - debt,
    firstMonthlyPayments,
  };
}

function assertInput(input: CreditCardCostInput): void {
  if (!Number.isFinite(input.debt) || input.debt <= 0) {
    throw new Error("debt must be a finite number greater than 0.");
  }
  if (
    !Number.isFinite(input.monthlyRatePercent) ||
    input.monthlyRatePercent < 0
  ) {
    throw new Error("monthlyRatePercent must be a finite number >= 0.");
  }
  if (
    !Number.isFinite(input.minimumPaymentPercent) ||
    input.minimumPaymentPercent <= 0
  ) {
    throw new Error(
      "minimumPaymentPercent must be a finite number greater than 0."
    );
  }
}

export function simulateCreditCardCost(
  input: CreditCardCostInput
): CreditCardCostOutput {
  assertInput(input);

  const monthlyRateDecimal = input.monthlyRatePercent / 100;
  const minPaymentDecimal = input.minimumPaymentPercent / 100;
  const fixedPayment = input.fixedMonthlyPayment ?? 0;
  const usesFixedPayment = fixedPayment > 0;
  const maxMonths = input.maxMonths ?? 600;

  const baselinePaymentStrategy = usesFixedPayment
    ? () => fixedPayment
    : (balance: number) => balance * minPaymentDecimal;

  const doubledPaymentStrategy = usesFixedPayment
    ? () => fixedPayment * 2
    : (balance: number) => balance * minPaymentDecimal * 2;

  return {
    usesFixedPayment,
    baseline: simulateRepayment(
      input.debt,
      monthlyRateDecimal,
      baselinePaymentStrategy,
      maxMonths
    ),
    doubledPayment: simulateRepayment(
      input.debt,
      monthlyRateDecimal,
      doubledPaymentStrategy,
      maxMonths
    ),
  };
}
