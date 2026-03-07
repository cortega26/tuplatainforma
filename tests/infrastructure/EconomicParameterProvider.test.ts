import { readFileSync } from "fs";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const SNAPSHOT = JSON.parse(
  readFileSync(
    "src/infrastructure/economic/economic-parameters.snapshot.json",
    "utf-8"
  )
) as {
  uf: number;
  utm: number;
  lastUpdated: string;
};

const LIVE_RESPONSE = {
  uf: { valor: 40123, fecha: "2026-03-01T00:00:00.000Z" },
  utm: { valor: 68000, fecha: "2026-03-01T00:00:00.000Z" },
  ipc: { valor: 0.3 },
  tmc: { valor: 3.75 },
};

const MODE_ENV = "TPI_ECONOMIC_PROVIDER_MODE";
const ORIGINAL_MODE = process.env[MODE_ENV];

function setMode(mode?: "snapshot" | "live") {
  if (mode) {
    process.env[MODE_ENV] = mode;
  } else {
    delete process.env[MODE_ENV];
  }
}

async function loadProviderModule() {
  vi.resetModules();
  const mod = await import("@/infrastructure/economic/EconomicParameterProvider");
  mod.__resetEconomicParameterProviderForTests();
  return mod;
}

describe("EconomicParameterProvider", () => {
  beforeEach(() => {
    vi.restoreAllMocks();
    setMode(undefined);
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    if (ORIGINAL_MODE === undefined) {
      delete process.env[MODE_ENV];
    } else {
      process.env[MODE_ENV] = ORIGINAL_MODE;
    }
  });

  it("uses local snapshot by default without external fetch", async () => {
    const fetchMock = vi.fn();
    vi.stubGlobal("fetch", fetchMock);

    const { getEconomicParameterBundle, getEconomicProviderTelemetry } =
      await loadProviderModule();
    const bundle = await getEconomicParameterBundle();

    expect(bundle.telemetryFlag).toBe("economic_parameters_snapshot");
    expect(bundle.parameters.source).toBe("fallback");
    expect(bundle.parameters.uf).toBe(SNAPSHOT.uf);
    expect(bundle.parameters.utm).toBe(SNAPSHOT.utm);
    expect(bundle.parameters.lastUpdated).toBe(SNAPSHOT.lastUpdated);
    expect(fetchMock).not.toHaveBeenCalled();

    const telemetry = getEconomicProviderTelemetry();
    expect(telemetry.externalFetchCount).toBe(0);
    expect(telemetry.lastSource).toBe("fallback");
  });

  it("returns live payload when live mode is explicitly enabled", async () => {
    setMode("live");
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
    expect(bundle.parameters.lastUpdated).toBe("2026-03-01");
    expect(bundle.parameters.uf).toBe(LIVE_RESPONSE.uf.valor);
    expect(bundle.parameters.utm).toBe(LIVE_RESPONSE.utm.valor);

    const telemetry = getEconomicProviderTelemetry();
    expect(telemetry.externalFetchCount).toBe(1);
    expect(telemetry.lastSource).toBe("live");
  });

  it("falls back to snapshot when live mode fails", async () => {
    setMode("live");
    const fetchMock = vi.fn().mockRejectedValue(new Error("network failure"));
    vi.stubGlobal("fetch", fetchMock);

    const { getEconomicParameterBundle, getEconomicProviderTelemetry } =
      await loadProviderModule();
    const bundle = await getEconomicParameterBundle();

    expect(bundle.telemetryFlag).toBe("economic_parameters_snapshot");
    expect(bundle.parameters.source).toBe("fallback");
    expect(bundle.parameters.uf).toBe(SNAPSHOT.uf);
    expect(bundle.parameters.utm).toBe(SNAPSHOT.utm);
    expect(bundle.fallbackReason).toContain("network failure");

    const telemetry = getEconomicProviderTelemetry();
    expect(telemetry.externalFetchCount).toBe(1);
    expect(telemetry.lastSource).toBe("fallback");
    expect(telemetry.lastFallbackReason).toContain("network failure");
  });

  it("memoizes bundle and performs a single live fetch", async () => {
    setMode("live");
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
