import { describe, expect, it } from "vitest";
import { calculateNetSalary } from "@/application/use-cases/CalculateNetSalary";

const UF = 40000;
const UTM = 67294;

describe("calculateNetSalary", () => {
  it("uses explicit taxable salary and contract type for worker deductions", () => {
    const result = calculateNetSalary({
      grossSalary: 1500000,
      taxableSalary: 1350000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      contractType: "plazo-fijo",
      economicParameters: {
        uf: UF,
        utm: UTM,
        afcTopes: { monthlyTaxableCapUf: 135.2 },
        previsionalTopes: { pensionAndHealthMonthlyTaxableCapUf: 90 },
      },
    });

    expect(result.taxableSalary).toBe(1350000);
    expect(result.nonTaxableIncome).toBe(150000);
    expect(result.contractType).toBe("plazo-fijo");
    expect(result.deductions.unemploymentInsurance).toBe(0);
    expect(result.taxableBase).toBeCloseTo(1110105, 6);
  });

  it("caps pension-health and unemployment bases above the official UF limits", () => {
    const result = calculateNetSalary({
      grossSalary: 7000000,
      taxableSalary: 6200000,
      afpRatePercent: 10.77,
      healthSystem: "fonasa",
      contractType: "indefinido",
      economicParameters: {
        uf: UF,
        utm: UTM,
        afcTopes: { monthlyTaxableCapUf: 135.2 },
        previsionalTopes: { pensionAndHealthMonthlyTaxableCapUf: 90 },
      },
    });

    expect(result.cappedBases.pensionAndHealth).toBe(3600000);
    expect(result.cappedBases.unemploymentInsurance).toBe(5408000);
    expect(result.deductions.afp).toBeCloseTo(387720, 6);
    expect(result.deductions.health).toBeCloseTo(252000, 6);
    expect(result.deductions.unemploymentInsurance).toBeCloseTo(32448, 6);
    expect(result.taxableBase).toBeCloseTo(5527832, 6);
  });
});
