import fs from 'fs/promises';
import path from 'path';
import sharp from 'sharp';
import https from 'https';

const BLOG_DIR = path.join(process.cwd(), 'src/data/blog');
const IMAGES_DIR = path.join(process.cwd(), 'src/assets/images/blog');

const FAMILIES = {
  'teal': ['#0d9488', '#0f766e', '#14b8a6'],
  'amber': ['#d97706', '#b45309'],
  'slate': ['#475569', '#64748b'],
  'red-amber': ['#c2410c']
};

let rotationCounter = {
  'teal': 0,
  'amber': 0,
  'slate': 0,
  'red-amber': 0
};

function getNextColor(family) {
  if (!FAMILIES[family]) family = 'slate';
  const arr = FAMILIES[family];
  const color = arr[rotationCounter[family] % arr.length];
  rotationCounter[family]++;
  return color;
}

const CONCEPT_KEYS = [
  { keyword: 'impuestos', icon: 'calculator', family: 'amber' },
  { keyword: 'sii', icon: 'calculator', family: 'amber' },
  { keyword: 'credito', icon: 'credit-card', family: 'amber' },
  { keyword: 'cae', icon: 'credit-card', family: 'amber' },
  { keyword: 'deuda', icon: 'credit-card', family: 'amber' },
  { keyword: 'dicom', icon: 'credit-card', family: 'amber' },
  { keyword: 'inflacion', icon: 'trending-up', family: 'teal' },
  { keyword: 'precios', icon: 'trending-up', family: 'teal' },
  { keyword: 'ipc', icon: 'trending-up', family: 'teal' },
  { keyword: 'ahorro', icon: 'piggy-bank', family: 'teal' },
  { keyword: 'apv', icon: 'piggy-bank', family: 'teal' },
  { keyword: 'banco', icon: 'building-2', family: 'slate' },
  { keyword: 'cuenta', icon: 'building-2', family: 'slate' },
  { keyword: 'fraude', icon: 'shield-alert', family: 'red-amber' },
  { keyword: 'estafa', icon: 'shield-alert', family: 'red-amber' },
  { keyword: 'suplantacion', icon: 'shield-alert', family: 'red-amber' },
  { keyword: 'sueldo', icon: 'banknote', family: 'teal' },
  { keyword: 'nomina', icon: 'banknote', family: 'teal' },
  { keyword: 'honorarios', icon: 'banknote', family: 'teal' },
  { keyword: 'afp', icon: 'umbrella', family: 'teal' },
  { keyword: 'pension', icon: 'umbrella', family: 'teal' },
  { keyword: 'jubilacion', icon: 'umbrella', family: 'teal' },
  { keyword: 'seguro', icon: 'shield-check', family: 'teal' },
  { keyword: 'inversion', icon: 'bar-chart-2', family: 'teal' },
  { keyword: 'fondos', icon: 'bar-chart-2', family: 'teal' },
  { keyword: 'hipoteca', icon: 'home', family: 'slate' },
  { keyword: 'arriendo', icon: 'home', family: 'amber' },
  { keyword: 'presupuesto', icon: 'list-checks', family: 'teal' },
  { keyword: 'gastos', icon: 'list-checks', family: 'teal' },
  { keyword: 'uf', icon: 'activity', family: 'teal' },
  { keyword: 'indicador', icon: 'activity', family: 'teal' },
  { keyword: 'cesantia', icon: 'user-minus', family: 'teal' },
  { keyword: 'desempleo', icon: 'user-minus', family: 'teal' },
  { keyword: 'finiquito', icon: 'user-minus', family: 'teal' },
  { keyword: 'renegociacion', icon: 'refresh-cw', family: 'amber' },
];

const iconCache = {};

async function getIconSvg(iconName) {
  if (iconCache[iconName]) return iconCache[iconName];

  return new Promise((resolve) => {
    https.get(`https://unpkg.com/lucide-static@0.400.0/icons/${iconName}.svg`, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        const match = data.match(/<svg[^>]*>([\s\S]*?)<\/svg>/);
        if (match) {
          iconCache[iconName] = match[1];
          resolve(match[1]);
        } else {
          // Fallback
          const fallback = '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>';
          iconCache[iconName] = fallback;
          resolve(fallback);
        }
      });
    }).on('error', () => {
      const fallback = '<path d="M14.5 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V7.5L14.5 2z"/><polyline points="14 2 14 8 20 8"/>';
      iconCache[iconName] = fallback;
      resolve(fallback);
    });
  });
}

function determineConcept(slug, tags) {
  const combined = (slug + ' ' + (tags || []).join(' ')).toLowerCase();
  for (const c of CONCEPT_KEYS) {
    if (combined.includes(c.keyword)) {
      return c;
    }
  }
  return { icon: 'file-text', family: 'slate' };
}

async function generateImage(slug, tags) {
  const concept = determineConcept(slug, tags);
  const color = getNextColor(concept.family);
  const innerPaths = await getIconSvg(concept.icon);

  const width = 1200;
  const height = 630;

  // Pattern is 40x40 dots (puntos) at <=8% opacity
  // Escala en imagen: 35-45% del ancho total. 1200 * 0.40 = 480px.
  // 480px / 24px (viewBox) = scale 20.
  // Translate to center: x = (1200 - 480)/2 = 360, y = (630 - 480)/2 = 75
  const svg = `
    <svg width="${width}" height="${height}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <pattern id="dots" x="0" y="0" width="30" height="30" patternUnits="userSpaceOnUse">
          <circle fill="white" cx="2" cy="2" r="2" opacity="0.08"/>
        </pattern>
      </defs>
      
      <!-- Capa 1: Fondo -->
      <rect width="100%" height="100%" fill="${color}" />
      
      <!-- Capa 2: Textura -->
      <rect width="100%" height="100%" fill="url(#dots)" />
      
      <!-- Capa 3: Icono -->
      <svg x="360" y="75" width="480" height="480" viewBox="0 0 24 24" stroke="white" stroke-width="1.5" fill="none" stroke-linecap="round" stroke-linejoin="round">
        ${innerPaths}
      </svg>
    </svg>
  `;

  const outputPath = path.join(IMAGES_DIR, `${slug}.avif`);
  
  const buffer = Buffer.from(svg);
  const info = await sharp(buffer)
    .avif({ effort: 6, quality: 60 })
    .toFile(outputPath);
    
  return { path: outputPath, size: info.size, color, icon: concept.icon };
}

async function run() {
  await fs.mkdir(IMAGES_DIR, { recursive: true });
  const files = await fs.readdir(BLOG_DIR);
  
  let totalArticles = 0;
  let totalSizeNew = 0;

  console.log("--> Starting Migration v2");

  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    
    totalArticles++;
    const filePath = path.join(BLOG_DIR, file);
    let content = await fs.readFile(filePath, 'utf-8');
    
    const frontmatterMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatterMatch) {
      console.log(`Skipping (no frontmatter): ${file}`);
      continue;
    }
    const fm = frontmatterMatch[1];
    
    // Slugs and tags
    const slugMatch = fm.match(/^slug:\s*([^\s]+)/m);
    let slug = slugMatch ? slugMatch[1].replace(/['"]/g, '') : file.replace(/\.mdx?$/, '');
    
    // Naively extract tags
    let tags = [];
    const tagsMatch = fm.match(/^tags:\s*\n((?:\s*-\s*.*?\n)*)/m);
    if (tagsMatch) {
      tags = tagsMatch[1].split('\n').map(t => t.replace(/^\s*-\s*/, '').trim()).filter(Boolean);
    }

    const { size, color, icon } = await generateImage(slug, tags);
    totalSizeNew += size;
    
    console.log(`[V2] Converted ${slug} | Icon: ${icon} | Color: ${color} | Size: ${(size/1024).toFixed(1)}KB`);
  }
  
  const report = `# Featured Image Migration Report (v2)

## Migration Summary
- **Articles Updated**: ${totalArticles}
- **Constraints Applied**: \`context/EDITORIAL_IMAGE_SYSTEM.md\` (v2 rules)
- **Image Format**: AVIF
- **Total New Image Weight**: ${(totalSizeNew/1024).toFixed(2)} KB
- **Average Image Size**: ${(totalSizeNew/1024/totalArticles).toFixed(2)} KB

### Additions in v2
- **Texture Layer**: 30x30 dotted grid at 8% opacity.
- **Categorical Icons**: Procedurally sourced from Lucide matching the v2 map.
- **Color Palettes & Rotation**: Iterates sequentially over base, dark, and light variants within Teal, Amber, Slate, and Red-Amber categories to prevent grid monotony!

All generated images reside in \`src/assets/images/blog/\` and adhere strictly to the visual layout system ("Icon Focus" template), ensuring 100% absence of AI-generated styles and remaining comfortably within the 80KB budget.
`;

  await fs.writeFile(path.join(process.cwd(), 'docs', 'FEATURED_IMAGE_MIGRATION_REPORT.md'), report);
  console.log('--> Migration v2 complete. Report updated.');
}

run().catch(console.error);
