import sharp from 'sharp';
import fs from 'fs';
console.log("Start");
const svg = `<svg width="1200" height="630" xmlns="http://www.w3.org/2000/svg"><rect width="100%" height="100%" fill="blue" /></svg>`;
try {
  await sharp(Buffer.from(svg)).avif().toFile('test.avif');
  console.log("Done", fs.existsSync('test.avif'));
} catch (e) {
  console.error("Error", e);
}
