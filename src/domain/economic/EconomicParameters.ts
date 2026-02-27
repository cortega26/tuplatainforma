export interface EconomicParameters {
  uf: number;
  utm: number;
  ipc: number;
  tmc?: number;
  afcTopes?: Record<string, number>;
  lastUpdated: string;
  source: "live" | "fallback";
}

const ISO_DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

export class EconomicParameterInvariantError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "EconomicParameterInvariantError";
  }
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function isIsoDate(value: string): boolean {
  if (!ISO_DATE_PATTERN.test(value)) return false;
  const asDate = new Date(`${value}T00:00:00.000Z`);
  return (
    !Number.isNaN(asDate.getTime()) &&
    asDate.toISOString().slice(0, 10) === value
  );
}

export function assertEconomicParameters(
  parameters: EconomicParameters
): EconomicParameters {
  if (!isFiniteNumber(parameters.uf) || parameters.uf <= 0) {
    throw new EconomicParameterInvariantError("UF must be greater than 0.");
  }

  if (!isFiniteNumber(parameters.utm) || parameters.utm <= 0) {
    throw new EconomicParameterInvariantError("UTM must be greater than 0.");
  }

  if (!isFiniteNumber(parameters.ipc)) {
    throw new EconomicParameterInvariantError("IPC must be a finite number.");
  }

  if (parameters.tmc !== undefined) {
    if (!isFiniteNumber(parameters.tmc) || parameters.tmc <= 0) {
      throw new EconomicParameterInvariantError(
        "TMC must be a finite number greater than 0 when provided."
      );
    }
  }

  if (!isIsoDate(parameters.lastUpdated)) {
    throw new EconomicParameterInvariantError(
      "lastUpdated must be an ISO date in YYYY-MM-DD format."
    );
  }

  if (parameters.source !== "live" && parameters.source !== "fallback") {
    throw new EconomicParameterInvariantError(
      "source must be explicitly set to 'live' or 'fallback'."
    );
  }

  if (parameters.afcTopes) {
    for (const [key, value] of Object.entries(parameters.afcTopes)) {
      if (!isFiniteNumber(value) || value <= 0) {
        throw new EconomicParameterInvariantError(
          `afcTopes.${key} must be a finite number greater than 0.`
        );
      }
    }
  }

  return parameters;
}
