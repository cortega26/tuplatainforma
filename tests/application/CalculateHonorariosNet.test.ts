import { describe, expect, it } from "vitest";
import { calculateHonorariosNet } from "@/application/use-cases/CalculateHonorariosNet";

describe("calculateHonorariosNet", () => {
  it("calculates monthly net and annual coverage base using the 2026 retention", () => {
    const result = calculateHonorariosNet({
      grossFee: 500000,
      issuedMonthsPerYear: 10,
    });

    expect(result.withholdingRatePercent).toBe(15.25);
    expect(result.withholdingAmount).toBe(76250);
    expect(result.netFeeReceived).toBe(423750);
    expect(result.annualGrossFees).toBe(5000000);
    expect(result.annualCoverageBase).toBe(4000000);
    expect(result.monthlyCoverageBaseEquivalent).toBeCloseTo(333333.3333, 3);
  });

  it("allows an explicit annual gross amount when monthly issuance is irregular", () => {
    const result = calculateHonorariosNet({
      grossFee: 250000,
      annualGrossFees: 3600000,
      withholdingRatePercent: 16,
    });

    expect(result.withholdingAmount).toBe(40000);
    expect(result.netFeeReceived).toBe(210000);
    expect(result.annualGrossFees).toBe(3600000);
    expect(result.annualWithholdingAmount).toBe(576000);
    expect(result.annualCoverageBase).toBe(2880000);
  });
});
