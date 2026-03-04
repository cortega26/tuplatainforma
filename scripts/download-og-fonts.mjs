/**
 * scripts/download-og-fonts.mjs
 *
 * Script de una sola vez: descarga las fuentes Inter necesarias para Satori
 * y las guarda en public/fonts/ para que el build no dependa de red.
 *
 * Uso:
 *   node scripts/download-og-fonts.mjs
 *
 * Solo necesitas correrlo:
 *   - Una vez al configurar el proyecto
 *   - Si cambias las fuentes del sistema OG
 *   - En un nuevo entorno de desarrollo
 *
 * Las fuentes descargadas van al gitrepo (son estáticas, no cambian).
 */

import { writeFileSync, mkdirSync, existsSync } from "fs";
import { resolve, dirname } from "path";
import { fileURLToPath } from "url";

const __dirname = dirname(fileURLToPath(import.meta.url));
const FONTS_DIR = resolve(__dirname, "../public/fonts");

const FONTS = [
  {
    file:   "inter-latin-400.woff2",
    family: "Inter",
    weight: 400,
  },
  {
    file:   "inter-latin-900.woff2",
    family: "Inter",
    weight: 900,
  },
];

const UA =
  "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";

// Caracteres representativos para que Google devuelva un subset útil.
// Incluye: números, letras con tilde, signos comunes en finanzas chilenas.
const SAMPLE_TEXT =
  "ABCDEFGHIJKLMNÑOPQRSTUVWXYZabcdefghijklmnñopqrstuvwxyz0123456789%.,áéíóúÁÉÍÓÚ·$€+-";

async function downloadFont(family, weight, outFile) {
  const api = `https://fonts.googleapis.com/css2?family=${family}:wght@${weight}&text=${encodeURIComponent(SAMPLE_TEXT)}`;

  console.log(`Descargando ${family} ${weight}...`);

  const css = await fetch(api, { headers: { "User-Agent": UA } }).then(r => r.text());

  // Google puede devolver múltiples bloques @font-face (subsets).
  // Tomamos el primero que sea woff2 — generalmente latin.
  let match = css.match(/src: url\((.+?\.woff2)\) format\('woff2'\)/);
  if (!match) {
    // Fallback: cualquier formato
    const fallback = css.match(/src: url\((.+?)\) format\('(opentype|truetype|woff2?)'\)/);
    if (!fallback) throw new Error(`No se encontró URL de fuente en la respuesta CSS para ${family}:${weight}`);
    match = fallback;
  }

  const fontUrl = match[1];
  console.log(`  URL: ${fontUrl}`);

  const fontData = await fetch(fontUrl).then(r => r.arrayBuffer());
  const outPath = resolve(FONTS_DIR, outFile);

  writeFileSync(outPath, Buffer.from(fontData));
  console.log(`  Guardado: public/fonts/${outFile} (${Math.round(fontData.byteLength / 1024)} KB)`);
}

async function main() {
  if (!existsSync(FONTS_DIR)) {
    mkdirSync(FONTS_DIR, { recursive: true });
    console.log(`Directorio creado: public/fonts/`);
  }

  for (const { file, family, weight } of FONTS) {
    const outPath = resolve(FONTS_DIR, file);
    if (existsSync(outPath)) {
      console.log(`Ya existe: public/fonts/${file} — omitiendo.`);
      continue;
    }
    await downloadFont(family, weight, file);
  }

  console.log("\n✓ Fuentes OG listas. Commitea public/fonts/inter-latin-*.woff2 al repo.");
}

main().catch(err => {
  console.error("Error:", err.message);
  process.exit(1);
});
