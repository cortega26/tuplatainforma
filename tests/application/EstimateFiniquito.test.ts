import { describe, expect, it } from "vitest";
import { estimateFiniquito } from "@/application/use-cases/EstimateFiniquito";

describe("estimateFiniquito", () => {
  it("estimates years of service, substitute notice and proportional vacation", () => {
    const result = estimateFiniquito({
      monthlySalary: 900000,
      yearsWorked: 4,
      additionalMonthsWorked: 7,
      pendingSalaryDays: 12,
      monthsSinceLastVacationCycle: 8,
      additionalVacationDaysWorked: 15,
      terminationCause: "necesidad",
      noticeGiven: false,
    });

    expect(result.serviceYearsCounted).toBe(5);
    expect(result.cappedServiceYears).toBe(5);
    expect(result.pendingSalaryAmount).toBe(360000);
    expect(result.proportionalVacationDays).toBeCloseTo(10.625, 6);
    expect(result.proportionalVacationAmount).toBeCloseTo(318750, 6);
    expect(result.yearsOfServiceIndemnity).toBe(4500000);
    expect(result.substituteNoticeIndemnity).toBe(900000);
    expect(result.totalEstimate).toBeCloseTo(6078750, 6);
  });

  it("applies the 11-year cap and removes legal indemnities when the cause does not qualify", () => {
    const result = estimateFiniquito({
      monthlySalary: 1200000,
      yearsWorked: 14,
      additionalMonthsWorked: 2,
      monthsSinceLastVacationCycle: 3,
      terminationCause: "renuncia",
      noticeGiven: false,
    });

    expect(result.serviceYearsCounted).toBe(14);
    expect(result.cappedServiceYears).toBe(11);
    expect(result.yearsOfServiceIndemnity).toBe(0);
    expect(result.substituteNoticeIndemnity).toBe(0);
    expect(result.proportionalVacationAmount).toBeCloseTo(150000, 6);
  });

  it("marks judicial cases for professional review while keeping a base estimate", () => {
    const result = estimateFiniquito({
      monthlySalary: 1000000,
      yearsWorked: 2,
      additionalMonthsWorked: 6,
      terminationCause: "judicial",
      noticeGiven: true,
    });

    expect(result.compensationProfile.appliesYearsOfService).toBe(true);
    expect(result.compensationProfile.appliesSubstituteNotice).toBe(false);
    expect(result.compensationProfile.requiresProfessionalReview).toBe(true);
    expect(result.yearsOfServiceIndemnity).toBe(3000000);
  });
});
