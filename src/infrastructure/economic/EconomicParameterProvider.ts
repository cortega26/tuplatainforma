import {
  assertEconomicParameters,
  type EconomicParameters,
} from "@/domain/economic/EconomicParameters";

type MindicadorResponse = {
  uf?: { valor?: number; fecha?: string };
  utm?: { valor?: number; fecha?: string };
  ipc?: { valor?: number };
  tmc?: { valor?: number };
};

export type EconomicTelemetryFlag =
  | "economic_parameters_live"
  | "economic_parameters_fallback";

export interface EconomicParameterBundle {
  parameters: EconomicParameters;
  telemetryFlag: EconomicTelemetryFlag;
  fallbackReason?: string;
}

const FALLBACK_LAST_UPDATED = new Date().toISOString().slice(0, 10);

const FALLBACK_PARAMETERS: EconomicParameters = {
  uf: 39300,
  utm: 67294,
  ipc: 0,
  tmc: 3.49,
  afcTopes: {
    monthlyTaxableCapUf: 131.9,
  },
  lastUpdated: FALLBACK_LAST_UPDATED,
  source: "fallback",
};

const ECONOMIC_API_URL = "https://mindicador.cl/api";
const FETCH_TIMEOUT_MS = 5000;

let cachedBundlePromise: Promise<EconomicParameterBundle> | undefined;

function toIsoDate(value: string | undefined): string {
  if (value && value.length >= 10) {
    return value.slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

async function fetchLiveEconomicParameters(): Promise<EconomicParameters> {
  const response = await fetch(ECONOMIC_API_URL, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(
      `mindicador.cl request failed with status ${response.status}.`
    );
  }

  const payload = (await response.json()) as MindicadorResponse;
  const liveParameters: EconomicParameters = {
    uf: Number(payload.uf?.valor),
    utm: Number(payload.utm?.valor),
    ipc: Number(payload.ipc?.valor ?? 0),
    tmc: payload.tmc?.valor !== undefined ? Number(payload.tmc.valor) : 3.49,
    afcTopes: {
      monthlyTaxableCapUf: 131.9,
    },
    lastUpdated: toIsoDate(payload.uf?.fecha ?? payload.utm?.fecha),
    source: "live",
  };

  return assertEconomicParameters(liveParameters);
}

function buildFallbackBundle(reason: unknown): EconomicParameterBundle {
  const fallbackReason =
    reason instanceof Error ? reason.message : "Unknown provider error.";

  return {
    parameters: assertEconomicParameters(FALLBACK_PARAMETERS),
    telemetryFlag: "economic_parameters_fallback",
    fallbackReason,
  };
}

async function loadEconomicParameterBundle(): Promise<EconomicParameterBundle> {
  try {
    const parameters = await fetchLiveEconomicParameters();
    return {
      parameters,
      telemetryFlag: "economic_parameters_live",
    };
  } catch (error) {
    return buildFallbackBundle(error);
  }
}

export async function getEconomicParameterBundle(): Promise<EconomicParameterBundle> {
  if (!cachedBundlePromise) {
    cachedBundlePromise = loadEconomicParameterBundle();
  }
  return cachedBundlePromise;
}
