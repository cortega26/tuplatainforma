import {
  calculateAnnuityPayment,
  simulateCreditRepayment,
} from "@/application/use-cases/shared/creditAmortization";

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
  prepaymentCost: number;
  effect: "reducir-plazo" | "reducir-cuota";
  alternativeAnnualReturnPercent: number;
}

export interface CreditPrepaymentOutput {
  withoutPrepayment: CreditSimulationOutput;
  withPrepayment: CreditSimulationOutput;
  balanceAfterPrepayment: number;
  prepaymentCost: number;
  interestSavings: number;
  netSavingsAfterPrepaymentCost: number;
  monthsSaved: number;
  newMonthlyPaymentIfReducePayment: number | null;
  annualCreditRatePercent: number;
  futureInvestmentValue: number;
  investmentGain: number;
  mathematicallyBetterToPrepay: boolean;
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
  if (!Number.isFinite(input.prepaymentCost) || input.prepaymentCost < 0) {
    throw new Error("prepaymentCost must be a finite number >= 0.");
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
  const initialMonthlyInterest = input.currentBalance * monthlyRateDecimal;
  if (input.prepaymentAmount >= input.currentBalance + input.prepaymentCost) {
    throw new Error(
      "El monto de prepago no puede ser igual o mayor al saldo total más el costo informado. En ese caso evalúa liquidación total, no prepago parcial."
    );
  }
  if (input.monthlyPayment <= initialMonthlyInterest) {
    throw new Error(
      "La cuota informada no alcanza a amortizar el crédito: ni siquiera cubre el interés mensual estimado. Revisa saldo, cuota o tasa."
    );
  }
  const maxMonths = input.remainingMonths + 12;

  const withoutPrepayment = simulateCreditRepayment({
    principal: input.currentBalance,
    monthlyRateDecimal,
    paymentStrategy: () => input.monthlyPayment,
    maxMonths,
  });
  if (withoutPrepayment.months >= maxMonths) {
    throw new Error(
      "Los datos no son consistentes: con esa cuota y plazo el crédito no se amortiza razonablemente. Revisa saldo, cuota, tasa o meses restantes."
    );
  }

  const balanceAfterPrepayment = Math.max(
    0,
    input.currentBalance - input.prepaymentAmount
  );

  const newMonthlyPaymentIfReducePayment =
    input.effect === "reducir-cuota" && balanceAfterPrepayment > 0
      ? calculateAnnuityPayment(
          balanceAfterPrepayment,
          monthlyRateDecimal,
          input.remainingMonths
        )
      : null;

  const paymentForSimulation =
    input.effect === "reducir-plazo"
      ? input.monthlyPayment
      : (newMonthlyPaymentIfReducePayment ?? 0);

  const withPrepayment = simulateCreditRepayment({
    principal: balanceAfterPrepayment,
    monthlyRateDecimal,
    paymentStrategy: () => paymentForSimulation,
    maxMonths,
  });
  if (withPrepayment.months >= maxMonths) {
    throw new Error(
      "El escenario con prepago no amortiza razonablemente con los datos ingresados. Revisa la comisión, el plazo o el tipo de efecto elegido."
    );
  }

  const interestSavings =
    withoutPrepayment.totalInterest - withPrepayment.totalInterest;
  const netSavingsAfterPrepaymentCost = interestSavings - input.prepaymentCost;
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
    prepaymentCost: input.prepaymentCost,
    interestSavings,
    netSavingsAfterPrepaymentCost,
    monthsSaved,
    newMonthlyPaymentIfReducePayment,
    annualCreditRatePercent: (Math.pow(1 + monthlyRateDecimal, 12) - 1) * 100,
    futureInvestmentValue,
    investmentGain,
    mathematicallyBetterToPrepay:
      netSavingsAfterPrepaymentCost > investmentGain,
  };
}
