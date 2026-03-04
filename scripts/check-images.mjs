import fs from 'fs/promises';
import path from 'path';

const IMAGES_DIR = path.join(process.cwd(), 'src/assets/images/blog');
const MAX_SIZE_BYTES = 80 * 1024;
const ALLOWED_EXTS = ['.avif', '.webp'];

async function checkImages() {
  try {
    await fs.stat(IMAGES_DIR);
  } catch (e) {
    // Directory might not exist yet, that's fine
    console.log(`[check:images] Directory ${IMAGES_DIR} not found, skipping.`);
    return;
  }

  const files = await fs.readdir(IMAGES_DIR);
  let hasErrors = false;

  for (const file of files) {
    const filePath = path.join(IMAGES_DIR, file);
    const stat = await fs.stat(filePath);

    if (stat.isFile()) {
      const ext = path.extname(file).toLowerCase();
      if (!ALLOWED_EXTS.includes(ext)) {
        console.error(`[check:images] ❌ Invalid format: ${file}. Allowed: ${ALLOWED_EXTS.join(', ')}`);
        hasErrors = true;
      }

      if (stat.size > MAX_SIZE_BYTES) {
        console.error(`[check:images] ❌ Budget exceeded: ${file} is ${(stat.size / 1024).toFixed(2)}KB (Max 80KB).`);
        hasErrors = true;
      }
    }
  }

  if (hasErrors) {
    console.error('\n[check:images] Image validation failed. See errors above.');
    process.exit(1);
  } else {
    console.log('[check:images] ✅ All blog images pass format and size constraints.');
  }
}

checkImages().catch(e => {
  console.error(e);
  process.exit(1);
});
