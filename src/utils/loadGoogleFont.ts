/**
 * loadGoogleFont.ts — v2
 *
 * Lee fuentes desde el filesystem local en lugar de fetchear desde Google Fonts.
 * Elimina la dependencia de red en build time y el riesgo de fallo en CI.
 *
 * Fuentes requeridas por el sistema visual v3 (Satori):
 *   - Inter 400 → texto UI, labels, pills
 *   - Inter 900 → número/dato ancla en Template C
 *
 * Los archivos .woff2 deben estar en public/fonts/.
 * Ejecutar el script de descarga una sola vez:
 *
 *   node scripts/download-og-fonts.mjs
 *
 * ─── FALLBACK ────────────────────────────────────────────────────────────────
 * Si un archivo no existe en disco (ej. primera vez antes del script),
 * intenta fetch a Google como respaldo. El build no falla en ese caso,
 * pero se loguea una advertencia para que quede registro en CI.
 */

import { readFileSync, existsSync } from "fs";
import { resolve } from "path";

const FONTS_DIR = resolve(process.cwd(), "public/fonts");

interface FontConfig {
  name:   string;
  file:   string;   // nombre del archivo en public/fonts/
  weight: number;
  style:  string;
  googleFamily: string;  // para fallback fetch
  googleWeight: number;
}

const FONTS_CONFIG: FontConfig[] = [
  {
    name:   "Inter",
    file:   "inter-latin-400.woff2",
    weight: 400,
    style:  "normal",
    googleFamily: "Inter",
    googleWeight: 400,
  },
  {
    name:   "Inter",
    file:   "inter-latin-900.woff2",
    weight: 900,
    style:  "normal",
    googleFamily: "Inter",
    googleWeight: 900,
  },
];

// ─── LEER DESDE DISCO ────────────────────────────────────────────────────────

function readFontFromDisk(file: string): ArrayBuffer | null {
  const filePath = resolve(FONTS_DIR, file);
  if (!existsSync(filePath)) return null;

  const buffer = readFileSync(filePath);
  return buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  ) as ArrayBuffer;
}

// ─── FALLBACK: FETCH DESDE GOOGLE ────────────────────────────────────────────

async function fetchFontFromGoogle(
  family: string,
  weight: number,
  text: string
): Promise<ArrayBuffer> {
  console.warn(
    `[og-fonts] Fuente no encontrada en disco. Descargando desde Google Fonts: ${family}:${weight}. ` +
    `Ejecuta "node scripts/download-og-fonts.mjs" para evitar dependencia de red en CI.`
  );

  const API = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(text)}`;
  const css = await (
    await fetch(API, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      },
    })
  ).text();

  const resource = css.match(
    /src: url\((.+?)\) format\('(opentype|truetype|woff2?)'\)/
  );
  if (!resource) throw new Error(`[og-fonts] No se pudo parsear CSS de Google Fonts para ${family}:${weight}`);

  const res = await fetch(resource[1]);
  if (!res.ok) throw new Error(`[og-fonts] Fetch de fuente falló: ${res.status}`);

  return res.arrayBuffer();
}

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────

async function loadGoogleFonts(
  text: string
): Promise<Array<{ name: string; data: ArrayBuffer; weight: number; style: string }>> {
  const fonts = await Promise.all(
    FONTS_CONFIG.map(async ({ name, file, weight, style, googleFamily, googleWeight }) => {
      const data =
        readFontFromDisk(file) ??
        (await fetchFontFromGoogle(googleFamily, googleWeight, text));

      return { name, data, weight, style };
    })
  );

  return fonts;
}

export default loadGoogleFonts;
