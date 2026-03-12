import { describe, expect, it } from "vitest";
import { simulateCreditPrepayment } from "@/application/use-cases/SimulateCreditPrepayment";

describe("simulateCreditPrepayment", () => {
  it("discounts the prepayment cost from the net benefit comparison", () => {
    const result = simulateCreditPrepayment({
      currentBalance: 10000000,
      monthlyPayment: 240000,
      monthlyRatePercent: 0.9,
      remainingMonths: 72,
      prepaymentAmount: 1000000,
      prepaymentCost: 150000,
      effect: "reducir-plazo",
      alternativeAnnualReturnPercent: 5,
    });

    expect(result.prepaymentCost).toBe(150000);
    expect(result.netSavingsAfterPrepaymentCost).toBeCloseTo(
      result.interestSavings - 150000,
      6
    );
  });

  it("fails when the reported installment does not amortize the credit", () => {
    expect(() =>
      simulateCreditPrepayment({
        currentBalance: 10000000,
        monthlyPayment: 50000,
        monthlyRatePercent: 0.9,
        remainingMonths: 72,
        prepaymentAmount: 1000000,
        prepaymentCost: 0,
        effect: "reducir-plazo",
        alternativeAnnualReturnPercent: 5,
      })
    ).toThrow(/no alcanza a amortizar/i);
  });
});
