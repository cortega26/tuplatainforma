import {
  assertEconomicParameters,
  type EconomicParameters,
} from "@/domain/economic/EconomicParameters";
import { existsSync, readFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

type MindicadorResponse = {
  uf?: { valor?: number; fecha?: string };
  utm?: { valor?: number; fecha?: string };
  ipc?: { valor?: number };
  tmc?: { valor?: number };
};

interface EconomicSnapshotPayload {
  uf: number;
  utm: number;
  ipc?: number;
  tmc?: number;
  afcTopes?: {
    monthlyTaxableCapUf?: number;
  };
  previsionalTopes?: {
    pensionAndHealthMonthlyTaxableCapUf?: number;
  };
  lastUpdated: string;
}

type EconomicProviderMode = "snapshot" | "live";

export type EconomicTelemetryFlag =
  | "economic_parameters_live"
  | "economic_parameters_snapshot"
  | "economic_parameters_fallback";

export interface EconomicParameterBundle {
  parameters: EconomicParameters;
  telemetryFlag: EconomicTelemetryFlag;
  fallbackReason?: string;
}

export interface EconomicProviderTelemetry {
  externalFetchCount: number;
  cacheHitCount: number;
  lastSource?: EconomicParameters["source"];
  lastFallbackReason?: string;
}

const DEFAULT_AFC_MONTHLY_TAXABLE_CAP_UF = 135.2;
const DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF = 90;
const FALLBACK_LAST_UPDATED = new Date().toISOString().slice(0, 10);
const MODULE_DIR = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_FILE_NAME = "economic-parameters.snapshot.json";
const ECONOMIC_PROVIDER_MODE_ENV = "TPI_ECONOMIC_PROVIDER_MODE";
const ECONOMIC_API_URL = "https://mindicador.cl/api";
const FETCH_TIMEOUT_MS = 5000;

const FALLBACK_PARAMETERS: EconomicParameters = {
  uf: 39300,
  utm: 67294,
  ipc: 0,
  tmc: 3.49,
  afcTopes: {
    monthlyTaxableCapUf: DEFAULT_AFC_MONTHLY_TAXABLE_CAP_UF,
  },
  previsionalTopes: {
    pensionAndHealthMonthlyTaxableCapUf:
      DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF,
  },
  lastUpdated: FALLBACK_LAST_UPDATED,
  source: "fallback",
};

let cachedBundlePromise: Promise<EconomicParameterBundle> | undefined;
const telemetryState: EconomicProviderTelemetry = {
  externalFetchCount: 0,
  cacheHitCount: 0,
};

function syncDevTelemetry(): void {
  if (!import.meta.env.DEV) return;
  (
    globalThis as typeof globalThis & {
      __TPI_ECONOMIC_PROVIDER_TELEMETRY__?: EconomicProviderTelemetry;
    }
  ).__TPI_ECONOMIC_PROVIDER_TELEMETRY__ = getEconomicProviderTelemetry();
}

function toIsoDate(value: string | undefined): string {
  if (value && value.length >= 10) {
    return value.slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function normalizeReason(reason: unknown): string {
  return reason instanceof Error ? reason.message : "Unknown provider error.";
}

function resolveEconomicProviderMode(): EconomicProviderMode {
  return process.env[ECONOMIC_PROVIDER_MODE_ENV] === "live"
    ? "live"
    : "snapshot";
}

function resolveSnapshotFilePath(): string {
  const cwdCandidate = resolve(
    process.cwd(),
    "src",
    "infrastructure",
    "economic",
    SNAPSHOT_FILE_NAME
  );
  if (existsSync(cwdCandidate)) return cwdCandidate;

  return resolve(MODULE_DIR, SNAPSHOT_FILE_NAME);
}

function loadSnapshotEconomicParameters(): EconomicParameters {
  const payload = JSON.parse(
    readFileSync(resolveSnapshotFilePath(), "utf-8")
  ) as EconomicSnapshotPayload;

  const snapshotParameters: EconomicParameters = {
    uf: Number(payload.uf),
    utm: Number(payload.utm),
    ipc: Number(payload.ipc ?? 0),
    tmc: payload.tmc !== undefined ? Number(payload.tmc) : 3.49,
    afcTopes: {
      monthlyTaxableCapUf: Number(
        payload.afcTopes?.monthlyTaxableCapUf ??
          DEFAULT_AFC_MONTHLY_TAXABLE_CAP_UF
      ),
    },
    previsionalTopes: {
      pensionAndHealthMonthlyTaxableCapUf: Number(
        payload.previsionalTopes?.pensionAndHealthMonthlyTaxableCapUf ??
          DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF
      ),
    },
    lastUpdated: String(payload.lastUpdated),
    source: "fallback",
  };

  return assertEconomicParameters(snapshotParameters);
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
      monthlyTaxableCapUf: DEFAULT_AFC_MONTHLY_TAXABLE_CAP_UF,
    },
    previsionalTopes: {
      pensionAndHealthMonthlyTaxableCapUf:
        DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF,
    },
    lastUpdated: toIsoDate(payload.uf?.fecha ?? payload.utm?.fecha),
    source: "live",
  };

  return assertEconomicParameters(liveParameters);
}

function buildSnapshotBundle(reason?: unknown): EconomicParameterBundle {
  const bundle: EconomicParameterBundle = {
    parameters: loadSnapshotEconomicParameters(),
    telemetryFlag: "economic_parameters_snapshot",
  };

  if (reason) {
    bundle.fallbackReason = normalizeReason(reason);
  }

  return bundle;
}

function buildFallbackBundle(reason: unknown): EconomicParameterBundle {
  return {
    parameters: assertEconomicParameters(FALLBACK_PARAMETERS),
    telemetryFlag: "economic_parameters_fallback",
    fallbackReason: normalizeReason(reason),
  };
}

function storeTelemetry(bundle: EconomicParameterBundle): void {
  telemetryState.lastSource = bundle.parameters.source;
  telemetryState.lastFallbackReason = bundle.fallbackReason;
  syncDevTelemetry();
}

async function loadEconomicParameterBundle(): Promise<EconomicParameterBundle> {
  if (resolveEconomicProviderMode() === "snapshot") {
    try {
      const bundle = buildSnapshotBundle();
      storeTelemetry(bundle);
      return bundle;
    } catch (snapshotError) {
      const bundle = buildFallbackBundle(snapshotError);
      storeTelemetry(bundle);
      return bundle;
    }
  }

  try {
    telemetryState.externalFetchCount += 1;
    const parameters = await fetchLiveEconomicParameters();
    const bundle: EconomicParameterBundle = {
      parameters,
      telemetryFlag: "economic_parameters_live",
    };
    storeTelemetry(bundle);
    return bundle;
  } catch (liveError) {
    try {
      const bundle = buildSnapshotBundle(
        new Error(`Live fetch failed: ${normalizeReason(liveError)}`)
      );
      storeTelemetry(bundle);
      return bundle;
    } catch (snapshotError) {
      const bundle = buildFallbackBundle(
        new Error(
          `Live fetch failed: ${normalizeReason(liveError)} | Snapshot failed: ${normalizeReason(snapshotError)}`
        )
      );
      storeTelemetry(bundle);
      return bundle;
    }
  }
}

export async function getEconomicParameterBundle(): Promise<EconomicParameterBundle> {
  if (cachedBundlePromise) {
    telemetryState.cacheHitCount += 1;
    syncDevTelemetry();
    return cachedBundlePromise;
  }

  cachedBundlePromise = loadEconomicParameterBundle();
  return cachedBundlePromise;
}

export function getEconomicProviderTelemetry(): EconomicProviderTelemetry {
  return {
    ...telemetryState,
  };
}

export function __resetEconomicParameterProviderForTests(): void {
  cachedBundlePromise = undefined;
  telemetryState.externalFetchCount = 0;
  telemetryState.cacheHitCount = 0;
  telemetryState.lastSource = undefined;
  telemetryState.lastFallbackReason = undefined;
  syncDevTelemetry();
}

export function __getEconomicSnapshotFilePathForTests(): string {
  return resolveSnapshotFilePath();
}
