import { describe, expect, it } from "vitest";
import { calculateSecondCategoryTax } from "@/domain/taxation/TaxEngine";

const UTM = 67294;

function roundToPeso(value: number): number {
  return Math.round(value);
}

describe("TaxEngine.calculateSecondCategoryTax", () => {
  it("returns zero tax for zero taxable income", () => {
    const result = calculateSecondCategoryTax({ taxableIncome: 0, utm: UTM });
    expect(result.taxAmount).toBe(0);
    expect(result.marginalRate).toBe(0);
  });

  it("keeps first bracket upper boundary exempt", () => {
    const result = calculateSecondCategoryTax({
      taxableIncome: 13.5 * UTM,
      utm: UTM,
    });
    expect(result.taxAmount).toBe(0);
    expect(result.marginalRate).toBe(0);
  });

  it("applies second bracket immediately above the first boundary", () => {
    const result = calculateSecondCategoryTax({
      taxableIncome: 13.5 * UTM + 1,
      utm: UTM,
    });
    expect(result.taxAmount).toBeCloseTo(0.04, 6);
    expect(result.marginalRate).toBe(0.04);
  });

  it("transitions to the top bracket for extreme income", () => {
    const result = calculateSecondCategoryTax({
      taxableIncome: 180 * UTM,
      utm: UTM,
    });
    expect(result.taxAmount).toBeCloseTo(1885577.88, 2);
    expect(result.marginalRate).toBe(0.4);
  });

  it("maintains monotonic tax amount as taxable income increases", () => {
    const low = calculateSecondCategoryTax({
      taxableIncome: 30 * UTM,
      utm: UTM,
    });
    const mid = calculateSecondCategoryTax({
      taxableIncome: 50 * UTM,
      utm: UTM,
    });
    const high = calculateSecondCategoryTax({
      taxableIncome: 70 * UTM,
      utm: UTM,
    });

    expect(low.taxAmount).toBeLessThanOrEqual(mid.taxAmount);
    expect(mid.taxAmount).toBeLessThanOrEqual(high.taxAmount);
  });

  it("uses stable rounding to CLP pesos for UI presentation", () => {
    const result = calculateSecondCategoryTax({
      taxableIncome: 23.123 * UTM,
      utm: UTM,
    });
    expect(roundToPeso(result.taxAmount)).toBe(25903);
  });

  it("throws on invalid taxable income", () => {
    expect(() =>
      calculateSecondCategoryTax({ taxableIncome: -1, utm: UTM })
    ).toThrow("taxableIncome must be a finite number >= 0.");
  });

  it("throws on invalid UTM value", () => {
    expect(() =>
      calculateSecondCategoryTax({ taxableIncome: 1000000, utm: 0 })
    ).toThrow("utm must be a finite number > 0.");
  });
});
