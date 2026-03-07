import sharp from 'sharp';
import fs from 'fs';
console.log("Start SVG Test");
const svg = `
    <svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <radialGradient id="grad" cx="50%" cy="50%" r="50%" fx="50%" fy="50%">
          <stop offset="0%" stop-color="#0d9488" stop-opacity="0.85" />
          <stop offset="100%" stop-color="#0d9488" stop-opacity="1" />
        </radialGradient>
      </defs>
      <rect width="100%" height="100%" fill="url(#grad)" />
      <g transform="translate(450, 165) scale(12)" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
      </g>
    </svg>
`;
try {
  await sharp(Buffer.from(svg)).avif({ effort: 6, quality: 60 }).toFile('test-svg.avif');
  console.log("Done", fs.existsSync('test-svg.avif'));
} catch (e) {
  console.error("Error", e);
}
