import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const LIVE_RESPONSE = {
  uf: { valor: 39300, fecha: "2026-02-27T00:00:00.000Z" },
  utm: { valor: 67294, fecha: "2026-02-01T00:00:00.000Z" },
  ipc: { valor: 0.2 },
  tmc: { valor: 3.49 },
};

async function loadProviderModule() {
  const mod = await import("@/infrastructure/economic/EconomicParameterProvider");
  mod.__resetEconomicParameterProviderForTests();
  return mod;
}

describe("EconomicParameterProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
  });

  it("returns live payload on successful API call", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => LIVE_RESPONSE,
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getEconomicParameterBundle, getEconomicProviderTelemetry } =
      await loadProviderModule();
    const bundle = await getEconomicParameterBundle();

    expect(bundle.telemetryFlag).toBe("economic_parameters_live");
    expect(bundle.parameters.source).toBe("live");
    expect(bundle.parameters.lastUpdated).toBe("2026-02-27");

    const telemetry = getEconomicProviderTelemetry();
    expect(telemetry.externalFetchCount).toBe(1);
    expect(telemetry.lastSource).toBe("live");
  });

  it("falls back when API request fails and keeps lastUpdated populated", async () => {
    const fetchMock = vi.fn().mockRejectedValue(new Error("network failure"));
    vi.stubGlobal("fetch", fetchMock);

    const { getEconomicParameterBundle, getEconomicProviderTelemetry } =
      await loadProviderModule();
    const bundle = await getEconomicParameterBundle();

    expect(bundle.telemetryFlag).toBe("economic_parameters_fallback");
    expect(bundle.parameters.source).toBe("fallback");
    expect(bundle.parameters.lastUpdated).toMatch(/^\d{4}-\d{2}-\d{2}$/);
    expect(bundle.fallbackReason).toContain("network failure");

    const telemetry = getEconomicProviderTelemetry();
    expect(telemetry.externalFetchCount).toBe(1);
    expect(telemetry.lastSource).toBe("fallback");
    expect(telemetry.lastFallbackReason).toContain("network failure");
  });

  it("memoizes provider bundle and performs a single external fetch", async () => {
    const fetchMock = vi.fn().mockResolvedValue({
      ok: true,
      json: async () => LIVE_RESPONSE,
    });
    vi.stubGlobal("fetch", fetchMock);

    const { getEconomicParameterBundle, getEconomicProviderTelemetry } =
      await loadProviderModule();

    const [first, second, third] = await Promise.all([
      getEconomicParameterBundle(),
      getEconomicParameterBundle(),
      getEconomicParameterBundle(),
    ]);
    const fourth = await getEconomicParameterBundle();

    expect(first.parameters).toEqual(second.parameters);
    expect(second.parameters).toEqual(third.parameters);
    expect(third.parameters).toEqual(fourth.parameters);
    expect(fetchMock).toHaveBeenCalledTimes(1);

    const telemetry = getEconomicProviderTelemetry();
    expect(telemetry.externalFetchCount).toBe(1);
    expect(telemetry.cacheHitCount).toBeGreaterThanOrEqual(1);
  });
});
