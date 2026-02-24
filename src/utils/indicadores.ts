/**
 * Utilidad para obtener indicadores económicos de Chile
 * Fuente: mindicador.cl
 */

export interface Indicadores {
  uf: number;
  utm: number;
  fecha: string;
}

const FALLBACK: Indicadores = {
  uf: 39300,
  utm: 67294,
  fecha: "valor de referencia",
};

export async function getIndicadores(): Promise<Indicadores> {
  try {
    const res = await fetch("https://mindicador.cl/api", {
      signal: AbortSignal.timeout(5000),
    });
    if (!res.ok) throw new Error("Error al obtener indicadores");
    const data = await res.json();
    return {
      uf: data.uf.valor,
      utm: data.utm.valor,
      fecha:
        data.uf.fecha?.slice(0, 10) ?? new Date().toISOString().slice(0, 10),
    };
  } catch {
    return FALLBACK;
  }
}

export function fmt(n: number): string {
  return "$" + Math.round(n).toLocaleString("es-CL");
}

export function fmtFecha(fecha: string): string {
  if (fecha === "valor de referencia") return fecha;
  const [y, m, d] = fecha.split("-");
  return `${d}/${m}/${y}`;
}
