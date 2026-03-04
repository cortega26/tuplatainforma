import fs from 'fs/promises';
import path from 'path';

const BLOG_DIR = path.join(process.cwd(), 'src/data/blog');

async function fixPaths() {
  const files = await fs.readdir(BLOG_DIR);
  let updated = 0;
  
  for (const file of files) {
    if (!file.endsWith('.md') && !file.endsWith('.mdx')) continue;
    
    const filePath = path.join(BLOG_DIR, file);
    let content = await fs.readFile(filePath, 'utf-8');
    
    if (content.includes('heroImage: ../../../assets/images/blog/')) {
      content = content.replace(
        /heroImage: \.\.\/\.\.\/\.\.\/assets\/images\/blog\//g, 
        'heroImage: ../../assets/images/blog/'
      );
      await fs.writeFile(filePath, content, 'utf-8');
      updated++;
    }
  }
  console.log(`Fixed paths in ${updated} files.`);
}

fixPaths().catch(console.error);
