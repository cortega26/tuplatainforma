import { describe, expect, it } from "vitest";
import { calculateConsumerCredit } from "@/application/use-cases/CalculateConsumerCredit";
import { simulateCreditCardCost } from "@/application/use-cases/SimulateCreditCardCost";
import { simulateCreditPrepayment } from "@/application/use-cases/SimulateCreditPrepayment";
import {
  calculateAnnuityPayment,
  simulateCreditRepayment,
} from "@/application/use-cases/shared/creditAmortization";

function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

describe("creditAmortization shared engine", () => {
  it("matches the consumer credit annuity payment for amortizing loans", () => {
    const consumerCredit = calculateConsumerCredit({
      principal: 5000000,
      termMonths: 36,
      rateValue: 3.49,
      rateType: "mensual",
      monthlyInsurance: 5500,
      operatingCosts: 120000,
    });

    const sharedPayment = calculateAnnuityPayment(5000000, 0.0349, 36);

    expect(round2(sharedPayment)).toBe(round2(consumerCredit.monthlyPaymentBase));
  });

  it("matches the prepayment baseline simulation for fixed-installment credit", () => {
    const prepayment = simulateCreditPrepayment({
      currentBalance: 5000000,
      monthlyPayment: 180000,
      monthlyRatePercent: 0.8,
      remainingMonths: 48,
      prepaymentAmount: 500000,
      prepaymentCost: 0,
      effect: "reducir-plazo",
      alternativeAnnualReturnPercent: 8,
    });

    const sharedSimulation = simulateCreditRepayment({
      principal: 5000000,
      monthlyRateDecimal: 0.008,
      paymentStrategy: () => 180000,
      maxMonths: 60,
    });

    expect(sharedSimulation.months).toBe(prepayment.withoutPrepayment.months);
    expect(round2(sharedSimulation.totalPaid)).toBe(
      round2(prepayment.withoutPrepayment.totalPaid)
    );
    expect(round2(sharedSimulation.totalInterest)).toBe(
      round2(prepayment.withoutPrepayment.totalInterest)
    );
  });

  it("matches the credit card repayment simulation when using the same floor rule", () => {
    const creditCard = simulateCreditCardCost({
      debt: 650000,
      monthlyRatePercent: 4.2,
      minimumPaymentPercent: 8,
      maxMonths: 240,
    });

    const sharedSimulation = simulateCreditRepayment({
      principal: 650000,
      monthlyRateDecimal: 0.042,
      paymentStrategy: ({ balance }) => balance * 0.08,
      paymentFloor: ({ interest }) => interest + 100,
      maxMonths: 240,
      trackedMonths: 6,
    });

    expect(sharedSimulation.months).toBe(creditCard.baseline.months);
    expect(round2(sharedSimulation.totalPaid)).toBe(
      round2(creditCard.baseline.totalPaid)
    );
    expect(sharedSimulation.firstMonthlyPayments).toEqual(
      creditCard.baseline.firstMonthlyPayments
    );
  });
});
