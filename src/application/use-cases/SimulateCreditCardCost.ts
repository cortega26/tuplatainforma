import { simulateCreditRepayment } from "@/application/use-cases/shared/creditAmortization";

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
    baseline: simulateCreditRepayment({
      principal: input.debt,
      monthlyRateDecimal,
      paymentStrategy: ({ balance }) => baselinePaymentStrategy(balance),
      paymentFloor: ({ interest }) => interest + 100,
      maxMonths,
      trackedMonths: 6,
    }),
    doubledPayment: simulateCreditRepayment({
      principal: input.debt,
      monthlyRateDecimal,
      paymentStrategy: ({ balance }) => doubledPaymentStrategy(balance),
      paymentFloor: ({ interest }) => interest + 100,
      maxMonths,
      trackedMonths: 6,
    }),
  };
}
