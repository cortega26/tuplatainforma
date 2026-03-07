import fs from "fs";
import { Resvg } from "@resvg/resvg-js";
import sharp from "sharp";

const svg = `<svg width="1200" height="630" viewBox="0 0 1200 630" xmlns="http://www.w3.org/2000/svg">
  <rect width="1200" height="630" fill="#d97706" />
  <defs>
    <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#ffffff" stroke-width="1.5" />
    </pattern>
  </defs>
  <rect width="1200" height="630" fill="url(#grid)" opacity="0.08" />
  
  <g transform="translate(360, 60) scale(20)" stroke="#ffffff" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" fill="none">
    <line x1="18" y1="20" x2="18" y2="10" />
    <line x1="12" y1="20" x2="12" y2="4" />
    <line x1="6" y1="20" x2="6" y2="14" />
  </g>

  <rect x="420" y="525" width="360" height="46" rx="23" fill="#ffffff" opacity="0.15" />
  <text x="600" y="555" font-family="Arial, sans-serif" font-size="20" font-weight="bold" fill="#ffffff" text-anchor="middle" letter-spacing="3" opacity="0.9">IMPUESTOS · INVERSIÓN</text>
</svg>`;

const resvg = new Resvg(svg, {
  fitTo: { mode: 'width', value: 1200 }
});
const pngData = resvg.render().asPng();

await sharp(pngData)
  .avif({ quality: 50, effort: 4 })
  .toFile("src/assets/images/blog/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026.avif");

const stats = fs.statSync("src/assets/images/blog/ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026.avif");
console.log("Image saved. Size:", stats.size);
