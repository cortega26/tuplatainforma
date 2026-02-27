import { describe, expect, it } from "vitest";
import {
  assertEconomicParameters,
  EconomicParameterInvariantError,
  type EconomicParameters,
} from "@/domain/economic/EconomicParameters";

const validParameters: EconomicParameters = {
  uf: 39300,
  utm: 67294,
  ipc: 0.4,
  tmc: 3.49,
  afcTopes: {
    monthlyTaxableCapUf: 131.9,
  },
  lastUpdated: "2026-02-27",
  source: "live",
};

describe("EconomicParameters.assertEconomicParameters", () => {
  it("accepts a valid economic payload", () => {
    expect(assertEconomicParameters(validParameters)).toEqual(validParameters);
  });

  it("rejects invalid ISO dates", () => {
    expect(() =>
      assertEconomicParameters({
        ...validParameters,
        lastUpdated: "27-02-2026",
      })
    ).toThrow(EconomicParameterInvariantError);
  });

  it("rejects unsupported source values", () => {
    expect(() =>
      assertEconomicParameters({
        ...validParameters,
        source: "cached" as EconomicParameters["source"],
      })
    ).toThrow("source must be explicitly set to 'live' or 'fallback'.");
  });

  it("rejects invalid afcTopes values", () => {
    expect(() =>
      assertEconomicParameters({
        ...validParameters,
        afcTopes: {
          monthlyTaxableCapUf: 0,
        },
      })
    ).toThrow("afcTopes.monthlyTaxableCapUf must be a finite number greater than 0.");
  });
});
