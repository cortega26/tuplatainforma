/**
 * Calcula el tiempo de lectura estimado de un cuerpo de texto.
 * Velocidad estándar: 200 palabras por minuto (lectura de contenido técnico/financiero).
 * @returns string formateado, ej: "3 min de lectura"
 */
export function getReadingTime(body: string): string {
  const normalizedBody = body.trim();

  if (!normalizedBody) {
    return "1 min de lectura";
  }

  const words = normalizedBody.split(/\s+/).length;
  const minutes = Math.ceil(words / 200);

  return minutes === 1 ? "1 min de lectura" : `${minutes} min de lectura`;
}
