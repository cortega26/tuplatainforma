import { describe, expect, it } from "vitest";
import { estimateUnemploymentCoverage } from "@/application/use-cases/EstimateUnemploymentCoverage";

const UF = 39300;

describe("estimateUnemploymentCoverage", () => {
  it("marks whether CIC comes from a provided balance or a rough estimate", () => {
    const provided = estimateUnemploymentCoverage({
      grossSalary: 900000,
      contractType: "indefinido",
      terminationCause: "necesidad",
      monthsContributed: 18,
      currentCicBalance: 850000,
      economicParameters: { uf: UF, afcTopes: { monthlyTaxableCapUf: 135.2 } },
    });
    const estimated = estimateUnemploymentCoverage({
      grossSalary: 900000,
      contractType: "indefinido",
      terminationCause: "necesidad",
      monthsContributed: 18,
      economicParameters: { uf: UF, afcTopes: { monthlyTaxableCapUf: 135.2 } },
    });

    expect(provided.balanceSource).toBe("provided");
    expect(provided.estimatedCicBalance).toBe(850000);
    expect(estimated.balanceSource).toBe("estimated");
    expect(estimated.monthlyCicContribution).toBe(19800);
    expect(estimated.estimatedCicBalance).toBe(356400);
  });

  it("keeps FCS as an eligibility review when continuity is not confirmed", () => {
    const result = estimateUnemploymentCoverage({
      grossSalary: 1100000,
      contractType: "indefinido",
      terminationCause: "necesidad",
      monthsContributed: 14,
      economicParameters: { uf: UF, afcTopes: { monthlyTaxableCapUf: 135.2 } },
    });

    expect(result.eligibleForSolidarityFund).toBe(false);
    expect(result.solidarityFundStatus).toBe("requires-continuity-check");
    expect(result.solidarityFundReference.validUntil).toBe("2027-02-28");
  });

  it("uses the updated CIC minimum contributions by contract type", () => {
    const fixedTerm = estimateUnemploymentCoverage({
      grossSalary: 700000,
      contractType: "plazo-fijo",
      terminationCause: "vencimiento",
      monthsContributed: 4,
      economicParameters: { uf: UF, afcTopes: { monthlyTaxableCapUf: 135.2 } },
    });

    expect(fixedTerm.minimumContributionsRequired).toBe(5);
    expect(fixedTerm.meetsMinimumContributions).toBe(false);
    expect(fixedTerm.monthlySolidarityContribution).toBe(1400);
  });
});
