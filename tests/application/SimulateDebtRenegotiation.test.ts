import { describe, expect, it } from "vitest";
import { simulateDebtRenegotiation } from "@/application/use-cases/SimulateDebtRenegotiation";

const UF = 39300;

describe("simulateDebtRenegotiation", () => {
  it("requires more than 90 days of arrears, not just 90", () => {
    const result = simulateDebtRenegotiation({
      debts: [
        { amount: 2000000, overdueDays: 90 },
        { amount: 1800000, overdueDays: 91 },
      ],
      monthlyIncome: 1000000,
      termMonths: 36,
      monthlyRatePercent: 1.2,
      ufValue: UF,
      hasFirstCategoryActivityLast24Months: false,
      hasNotifiedExecutiveProceeding: false,
      hasRequiredDocuments: true,
    });

    expect(result.minimumOverdueDays).toBe(91);
    expect(result.qualifiedDebtCount).toBe(1);
    expect(result.meetsBasicEligibility).toBe(false);
    expect(result.canSubmitApplication).toBe(false);
  });

  it("blocks the legal filter when there was first-category activity in the last 24 months", () => {
    const result = simulateDebtRenegotiation({
      debts: [
        { amount: 2000000, overdueDays: 120 },
        { amount: 1800000, overdueDays: 150 },
      ],
      monthlyIncome: 1000000,
      termMonths: 36,
      monthlyRatePercent: 1.2,
      ufValue: UF,
      hasFirstCategoryActivityLast24Months: true,
      hasNotifiedExecutiveProceeding: false,
      hasRequiredDocuments: true,
    });

    expect(result.requirementChecks.hasNoFirstCategoryActivity).toBe(false);
    expect(result.meetsBasicEligibility).toBe(false);
    expect(result.canSubmitApplication).toBe(false);
  });

  it("distinguishes between meeting the basic filter and being ready to submit formally", () => {
    const result = simulateDebtRenegotiation({
      debts: [
        { amount: 2000000, overdueDays: 120 },
        { amount: 1800000, overdueDays: 150 },
      ],
      monthlyIncome: 1000000,
      termMonths: 36,
      monthlyRatePercent: 1.2,
      ufValue: UF,
      hasFirstCategoryActivityLast24Months: false,
      hasNotifiedExecutiveProceeding: false,
      hasRequiredDocuments: false,
    });

    expect(result.meetsBasicEligibility).toBe(true);
    expect(result.requirementChecks.hasRequiredDocuments).toBe(false);
    expect(result.canSubmitApplication).toBe(false);
  });
});
