import { getEconomicParameters } from "@/application/use-cases/GetEconomicParameters";

export interface Indicadores {
  uf: number;
  utm: number;
  fecha: string;
  source: "live" | "fallback";
  telemetryFlag: string;
}

export async function getIndicadores(): Promise<Indicadores> {
  const { parameters, telemetryFlag } = await getEconomicParameters();
  return {
    uf: parameters.uf,
    utm: parameters.utm,
    fecha: parameters.lastUpdated,
    source: parameters.source,
    telemetryFlag,
  };
}

export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

export function fmtFecha(fecha: string): string {
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}
