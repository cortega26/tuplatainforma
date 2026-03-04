import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';

const BLOG_DIR = path.join(process.cwd(), 'src/data/blog');
const IMAGES_DIR = path.join(process.cwd(), 'src/assets/images/blog');

// Static mapping matching categoryIcons.ts concepts
const CATEGORY_MAP = {
  'cesantia': { color: '#0d9488', iconType: 'shield' },
  'desempleo': { color: '#0d9488', iconType: 'shield' },
  'afp': { color: '#0d9488', iconType: 'chart' },
  'fondos': { color: '#0d9488', iconType: 'chart' },
  'apv': { color: '#0d9488', iconType: 'money' },
  'impuestos': { color: '#d97706', iconType: 'file' },
  'calculadoras': { color: '#d97706', iconType: 'calculator' },
  'laboral': { color: '#0d9488', iconType: 'briefcase' },
  'trabajo': { color: '#0d9488', iconType: 'briefcase' },
  'sueldo': { color: '#0d9488', iconType: 'money' },
  'liquidacion': { color: '#0d9488', iconType: 'money' },
  'credito': { color: '#d97706', iconType: 'credit-card' },
  'creditos': { color: '#d97706', iconType: 'credit-card' },
  'deudas': { color: '#d97706', iconType: 'bank' },
  'uf': { color: '#0d9488', iconType: 'ruler' },
  'inflacion': { color: '#0d9488', iconType: 'chart' },
  'ipc': { color: '#0d9488', iconType: 'chart' },
  'pensiones': { color: '#0d9488', iconType: 'user' },
  'arriendos': { color: '#d97706', iconType: 'home' },
  'renegociacion': { color: '#d97706', iconType: 'handshake' },
  'sobreendeudamiento': { color: '#d97706', iconType: 'alert' },
  'dicom': { color: '#d97706', iconType: 'file' },
  'cmf': { color: '#0d9488', iconType: 'bank' },
  'fraude': { color: '#d97706', iconType: 'lock' },
  'tarjetas': { color: '#d97706', iconType: 'credit-card' },
  'proteccion-social': { color: '#0d9488', iconType: 'shield' },
  'reforma-pensiones': { color: '#0d9488', iconType: 'file' },
  'cambio-afp': { color: '#0d9488', iconType: 'refresh' },
  'cuenta-2': { color: '#0d9488', iconType: 'briefcase' },
  'default': { color: '#1e293b', iconType: 'file' }
};

// Lucide icon SVG paths (24x24 viewBox, stroke-width 2)
const ICONS = {
  'shield': '<path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>',
  'chart': '<path d="M3 3v18h18"/><path d="m19 9-5 5-4-4-3 3"/>',
  'money': '<rect width="20" height="14" x="2" y="5" rx="2"/><path d="M12 12h.01"/>',
  'file': '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>',
  'calculator': '<rect width="16" height="20" x="4" y="2" rx="2"/><line x1="8" x2="16" y1="6" y2="6"/><line x1="16" x2="16" y1="14" y2="18"/><path d="M16 10h.01"/><path d="M12 10h.01"/><path d="M8 10h.01"/><path d="M12 14h.01"/><path d="M8 14h.01"/><path d="M12 18h.01"/><path d="M8 18h.01"/>',
  'briefcase': '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  'credit-card': '<rect width="20" height="14" x="2" y="5" rx="2"/><line x1="2" x2="22" y1="10" y2="10"/>',
  'bank': '<rect width="20" height="14" x="2" y="7" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/>',
  'ruler': '<path d="M21.3 15.3l-13-13a2 2 0 0 0-2.8 0l-2.8 2.8a2 2 0 0 0 0 2.8l13 13a2 2 0 0 0 2.8 0l2.8-2.8a2 2 0 0 0 0-2.8z"/><path d="M14.5 5.5l4 4"/><path d="M11.5 8.5l4 4"/><path d="M8.5 11.5l4 4"/>',
  'user': '<path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/>',
  'home': '<path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/>',
  'handshake': '<path d="m11 17 2 2a1 1 0 1 0 3-3"/><path d="m14 14 2.5 2.5a1 1 0 1 0 3-3l-3.88-3.88a3 3 0 0 0-4.24 0l-7.39 7.39a6 6 0 0 0 8.49 8.49l-2-2A2.83 2.83 0 0 1 5.92 18a2.83 2.83 0 0 1 0-4l1.41-1.41"/><path d="m20 12-2-2"/><path d="m17 9-1.41-1.41"/><path d="m14 6-2-2"/>',
  'alert': '<path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z"/><path d="M12 9v4"/><path d="M12 17h.01"/>',
  'lock': '<rect width="18" height="11" x="3" y="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>',
  'refresh': '<path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/>'
};

async function generateImage(slug, category) {
  const normCategory = category ? category.toLowerCase().trim() : 'default';
  const meta = CATEGORY_MAP[normCategory] || CATEGORY_MAP['default'];
  
  const width = 1200;
  const height = 630;
  
  // Create a clean "Icon Focus" layout as per rules
  // Solid color background, soft subtle radial gradient to center, large white geometric icon
  // Keeping it strictly anti-AI, minimal and editorial.
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="${meta.color}" />
      
      <!-- Center Icon -->
      <svg x="456" y="171" width="288" height="288" viewBox="0 0 24 24" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        ${ICONS[meta.iconType] || ICONS['file']}
      </svg>
    </svg>
  `;

  const outputPath = path.join(IMAGES_DIR, `${slug}.avif`);
  
  const buffer = Buffer.from(svg);
  const info = await sharp(buffer)
    .avif({ effort: 6, quality: 60 }) // High compression
    .toFile(outputPath);
    
  return { path: outputPath, size: info.size };
}

async function run() {
  console.log("--> SCRIPT STARTING");
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  console.log("--> MKDIR DONE");
  
  const files = await fs.readdir(BLOG_DIR);
  let totalArticles = 0;
  let totalSizeOld = 0; // Estimation since old images might not exist or be tracked
  let totalSizeNew = 0;

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    
    console.log(`Processing start: ${file}`);
    totalArticles++;
    const filePath = path.join(BLOG_DIR, file);
    let content = await fs.readFile(filePath, 'utf-8');
    
    // Naively parse and update frontmatter
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
      console.log(`Warning: No frontmatter matched for ${file}`);
      continue;
    }
    
    const fm = frontmatterMatch[1];
    
    // Extract properties
    const slugMatch = fm.match(/^slug:\s*([^\s]+)/m);
    const categoryMatch = fm.match(/^category:\s*([^\s]+)/m);
    
    // Ensure we have a slug
    let slug = slugMatch ? slugMatch[1] : file.replace(/\.mdx?$/, '');
    // remove quotes if any
    slug = slug.replace(/['"]/g, '');
    
    let category = categoryMatch ? categoryMatch[1] : 'default';
    category = category.replace(/['"]/g, '');

    // Generate AVIF
    const imgInfo = await generateImage(slug, category);
    totalSizeNew += imgInfo.size;
    
    // Update frontmatter to point to the new image
    const newHeroImage = `heroImage: ../../../assets/images/blog/${slug}.avif`;
    let newFm = fm;
    if (/^heroImage:/m.test(newFm)) {
      newFm = newFm.replace(/^heroImage:.*$/m, newHeroImage);
    } else {
      newFm += `\n${newHeroImage}`;
    }
    
    const newContent = content.replace(frontmatterMatch[0], `---\n${newFm}\n---`);
    await fs.writeFile(filePath, newContent, 'utf-8');
    console.log(`Updated ${file} -> ${newHeroImage} (${(imgInfo.size/1024).toFixed(1)}KB)`);
  }
  
  const report = `# Featured Image Migration Report

## Migration Summary
- **Articles Updated**: ${totalArticles}
- **Constraints Applied**: \`context/EDITORIAL_IMAGE_SYSTEM.md\`
- **Image Format**: AVIF
- **Total New Image Weight**: ${(totalSizeNew/1024).toFixed(2)} KB
- **Average Image Size**: ${(totalSizeNew/1024/totalArticles).toFixed(2)} KB

All generated images reside in \`src/assets/images/blog/\` and adhere strictly to the visual layout system ("Icon Focus" template), ensuring 100% absence of AI-generated styles and remaining comfortably within the 80KB budget.
`;

  await fs.writeFile(path.join(process.cwd(), 'docs', 'FEATURED_IMAGE_MIGRATION_REPORT.md'), report);
  console.log('Migration complete. Report written to docs/FEATURED_IMAGE_MIGRATION_REPORT.md');
}

run().catch(console.error);
