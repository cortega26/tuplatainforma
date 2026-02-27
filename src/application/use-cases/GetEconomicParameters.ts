import type { EconomicParameters } from "@/domain/economic/EconomicParameters";
import {
  getEconomicParameterBundle,
  type EconomicTelemetryFlag,
} from "@/infrastructure/economic/EconomicParameterProvider";

export interface GetEconomicParametersOutput {
  parameters: EconomicParameters;
  telemetryFlag: EconomicTelemetryFlag;
  fallbackReason?: string;
}

export async function getEconomicParameters(): Promise<GetEconomicParametersOutput> {
  const bundle = await getEconomicParameterBundle();
  return {
    parameters: bundle.parameters,
    telemetryFlag: bundle.telemetryFlag,
    fallbackReason: bundle.fallbackReason,
  };
}
