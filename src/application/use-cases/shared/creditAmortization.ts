export interface RepaymentStepContext {
  balance: number;
  interest: number;
  month: number;
}

export interface CreditRepaymentSimulation {
  months: number;
  totalPaid: number;
  totalInterest: number;
  firstMonthlyPayments: number[];
}

export interface SimulateCreditRepaymentInput {
  principal: number;
  monthlyRateDecimal: number;
  maxMonths: number;
  paymentStrategy: (context: RepaymentStepContext) => number;
  paymentFloor?: (context: RepaymentStepContext) => number;
  payoffThreshold?: number;
  trackedMonths?: number;
}

export function calculateAnnuityPayment(
  principal: number,
  monthlyRateDecimal: number,
  termMonths: number
): number {
  if (monthlyRateDecimal === 0) return principal / termMonths;
  const factor = Math.pow(1 + monthlyRateDecimal, termMonths);
  return (principal * monthlyRateDecimal * factor) / (factor - 1);
}

export function simulateCreditRepayment(
  input: SimulateCreditRepaymentInput
): CreditRepaymentSimulation {
  const payoffThreshold = input.payoffThreshold ?? 100;
  const trackedMonths = input.trackedMonths ?? 0;
  let balance = input.principal;
  let totalPaid = 0;
  let months = 0;
  const firstMonthlyPayments: number[] = [];

  while (balance > payoffThreshold && months < input.maxMonths) {
    const interest = balance * input.monthlyRateDecimal;
    const context = { balance, interest, month: months + 1 };
    const plannedPayment = input.paymentStrategy(context);
    const minimumPayment = input.paymentFloor ? input.paymentFloor(context) : 0;
    const payment = Math.min(
      Math.max(plannedPayment, minimumPayment),
      balance + interest
    );

    balance = balance + interest - payment;
    totalPaid += payment;
    months += 1;

    if (months <= trackedMonths) {
      firstMonthlyPayments.push(payment);
    }
  }

  return {
    months,
    totalPaid,
    totalInterest: totalPaid - input.principal,
    firstMonthlyPayments,
  };
}
