import { writeFileSync } from "fs";
import { dirname, resolve } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const SNAPSHOT_PATH = resolve(
  __dirname,
  "../src/infrastructure/economic/economic-parameters.snapshot.json"
);
const ECONOMIC_API_URL = "https://mindicador.cl/api";
const FETCH_TIMEOUT_MS = Number(process.env.ECONOMIC_SNAPSHOT_TIMEOUT_MS ?? 12000);
const DEFAULT_AFC_MONTHLY_TAXABLE_CAP_UF = 135.2;
const DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF = 90;

function toIsoDate(value) {
  if (typeof value === "string" && value.length >= 10) {
    return value.slice(0, 10);
  }
  return new Date().toISOString().slice(0, 10);
}

function assertFinitePositive(value, label) {
  if (!Number.isFinite(value) || value <= 0) {
    throw new Error(`${label} must be a finite number greater than 0.`);
  }
}

async function fetchLiveParameters() {
  const response = await fetch(ECONOMIC_API_URL, {
    signal: AbortSignal.timeout(FETCH_TIMEOUT_MS),
  });
  if (!response.ok) {
    throw new Error(
      `mindicador.cl request failed with status ${response.status}.`
    );
  }

  const payload = await response.json();
  const uf = Number(payload?.uf?.valor);
  const utm = Number(payload?.utm?.valor);
  const ipc = Number(payload?.ipc?.valor ?? 0);
  const tmc =
    payload?.tmc?.valor !== undefined ? Number(payload.tmc.valor) : 3.49;
  const lastUpdated = toIsoDate(payload?.uf?.fecha ?? payload?.utm?.fecha);

  assertFinitePositive(uf, "UF");
  assertFinitePositive(utm, "UTM");
  if (!Number.isFinite(ipc)) {
    throw new Error("IPC must be a finite number.");
  }
  assertFinitePositive(tmc, "TMC");

  return {
    uf,
    utm,
    ipc,
    tmc,
    afcTopes: {
      monthlyTaxableCapUf: DEFAULT_AFC_MONTHLY_TAXABLE_CAP_UF,
    },
    previsionalTopes: {
      pensionAndHealthMonthlyTaxableCapUf:
        DEFAULT_PENSION_AND_HEALTH_MONTHLY_TAXABLE_CAP_UF,
    },
    lastUpdated,
    capturedAt: new Date().toISOString(),
    source: "mindicador.cl/api",
  };
}

async function main() {
  const snapshot = await fetchLiveParameters();
  writeFileSync(SNAPSHOT_PATH, `${JSON.stringify(snapshot, null, 2)}\n`);
  console.log(
    `[economic-snapshot] Updated ${SNAPSHOT_PATH} (${snapshot.lastUpdated}).`
  );
}

main().catch(error => {
  console.error("[economic-snapshot] Error:", error.message);
  process.exit(1);
});
