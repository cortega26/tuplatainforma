import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

const REPO_ROOT = path.resolve(process.env.IMAGE_CHECK_ROOT ?? process.cwd());
const IMAGES_DIR = path.join(REPO_ROOT, "src", "assets", "images", "blog");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");
const PUBLIC_DIR = path.join(REPO_ROOT, "public");
const MAX_SIZE_BYTES = 80 * 1024;
const ALLOWED_ASSET_EXTS = [".avif", ".webp"];
const REQUIRED_INLINE_EXT = ".avif";

function toRepoRelative(targetPath) {
  return path.relative(REPO_ROOT, targetPath).replace(/\\/g, "/");
}

async function pathExists(targetPath) {
  try {
    await fs.stat(targetPath);
    return true;
  } catch {
    return false;
  }
}

async function listContentFiles(dirPath) {
  const result = [];
  let entries = [];

  try {
    entries = await fs.readdir(dirPath, { withFileTypes: true });
  } catch {
    return result;
  }

  entries.sort((a, b) => a.name.localeCompare(b.name));

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      result.push(...(await listContentFiles(absolutePath)));
      continue;
    }
    if (!/\.(md|mdx)$/i.test(entry.name)) continue;
    result.push(absolutePath);
  }

  return result;
}

function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { frontmatter: {}, body: source };
  }

  let frontmatter = {};
  try {
    const parsed = yaml.load(match[1], { schema: yaml.JSON_SCHEMA }) ?? {};
    if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
      frontmatter = parsed;
    }
  } catch {
    // check-frontmatter owns YAML/schema validation.
  }

  return {
    frontmatter,
    body: source.slice(match[0].length),
  };
}

function stripCodeFences(body) {
  return body.replace(/```[\s\S]*?```/g, "");
}

function normalizeMarkdownTarget(rawTarget) {
  const trimmed = rawTarget.trim();
  if (!trimmed) return "";

  if (trimmed.startsWith("<") && trimmed.endsWith(">")) {
    return trimmed.slice(1, -1).trim();
  }

  const titleMatch = trimmed.match(/^(\S+)(?:\s+["'][\s\S]*["'])?$/);
  return (titleMatch?.[1] ?? trimmed.split(/\s+/)[0] ?? "").trim();
}

function getLineNumber(source, index) {
  return source.slice(0, index).split(/\r?\n/).length;
}

function extractInlineImages(body) {
  const sanitizedBody = stripCodeFences(body);
  const images = [];

  for (const match of sanitizedBody.matchAll(/!\[[^\]]*]\(([^)]+)\)/g)) {
    const src = normalizeMarkdownTarget(match[1] ?? "");
    if (!src) continue;
    images.push({
      src,
      syntax: "markdown",
      line: getLineNumber(sanitizedBody, match.index ?? 0),
    });
  }

  for (const match of sanitizedBody.matchAll(
    /<img\b[^>]*\bsrc=(["'])(.*?)\1[^>]*>/gi
  )) {
    const src = (match[2] ?? "").trim();
    if (!src) continue;
    images.push({
      src,
      syntax: "html",
      line: getLineNumber(sanitizedBody, match.index ?? 0),
    });
  }

  return images;
}

function extractInlineImageExceptions(frontmatter) {
  const raw = frontmatter?.inlineImageExceptions;
  if (!Array.isArray(raw)) return [];

  return raw
    .filter(entry => entry && typeof entry === "object" && !Array.isArray(entry))
    .map(entry => ({
      src: typeof entry.src === "string" ? entry.src.trim() : "",
      reason: typeof entry.reason === "string" ? entry.reason.trim() : "",
    }))
    .filter(entry => entry.src);
}

function getExtensionFromImageSrc(src) {
  if (!src || src.startsWith("data:")) return "";

  let pathname = src;
  if (/^https?:\/\//i.test(src)) {
    try {
      pathname = new URL(src).pathname;
    } catch {
      pathname = src;
    }
  } else {
    pathname = src.split(/[?#]/)[0] ?? src;
  }

  return path.extname(pathname).toLowerCase();
}

function resolveLocalImagePath(articlePath, src) {
  if (!src || /^https?:\/\//i.test(src) || src.startsWith("data:")) return null;

  const normalizedSrc = src.split(/[?#]/)[0] ?? src;
  if (normalizedSrc.startsWith("/")) {
    return path.join(PUBLIC_DIR, normalizedSrc.replace(/^\/+/, ""));
  }

  return path.resolve(path.dirname(articlePath), normalizedSrc);
}

export async function runImageChecks() {
  const errors = [];
  let checkedAssetFiles = 0;
  let checkedInlineImages = 0;

  if (await pathExists(IMAGES_DIR)) {
    const files = (await fs.readdir(IMAGES_DIR)).sort((a, b) =>
      a.localeCompare(b)
    );

    for (const file of files) {
      const filePath = path.join(IMAGES_DIR, file);
      const stat = await fs.stat(filePath);
      if (!stat.isFile()) continue;

      checkedAssetFiles += 1;
      const ext = path.extname(file).toLowerCase();
      if (!ALLOWED_ASSET_EXTS.includes(ext)) {
        errors.push(
          `[check:images] ❌ Invalid format: ${toRepoRelative(filePath)}. Allowed: ${ALLOWED_ASSET_EXTS.join(", ")}`
        );
      }

      if (stat.size > MAX_SIZE_BYTES) {
        errors.push(
          `[check:images] ❌ Budget exceeded: ${toRepoRelative(filePath)} is ${(stat.size / 1024).toFixed(2)}KB (Max 80KB).`
        );
      }
    }
  } else {
    console.log(
      `[check:images] Directory ${IMAGES_DIR} not found, skipping asset budget scan.`
    );
  }

  const contentFiles = await listContentFiles(BLOG_DIR);
  for (const filePath of contentFiles) {
    const source = await fs.readFile(filePath, "utf8");
    const { frontmatter, body } = splitFrontmatter(source);
    const relativeFilePath = toRepoRelative(filePath);
    const images = extractInlineImages(body);
    if (images.length === 0) continue;

    const exceptions = extractInlineImageExceptions(frontmatter);
    const exceptionBySrc = new Map(exceptions.map(entry => [entry.src, entry]));
    const usedExceptions = new Set();

    for (const image of images) {
      checkedInlineImages += 1;
      const ext = getExtensionFromImageSrc(image.src);
      const exception = exceptionBySrc.get(image.src);

      if (exception) {
        usedExceptions.add(image.src);
      }

      if (ext !== REQUIRED_INLINE_EXT && !exception) {
        errors.push(
          `[check:images] ❌ ${relativeFilePath}:${image.line} inline image "${image.src}" must use ${REQUIRED_INLINE_EXT}; add a justified frontmatter inlineImageExceptions entry only if this is intentionally non-AVIF.`
        );
      }

      if (ext === REQUIRED_INLINE_EXT && exception) {
        errors.push(
          `[check:images] ❌ ${relativeFilePath}:${image.line} inline image "${image.src}" is already AVIF and must not appear in inlineImageExceptions.`
        );
      }

      const resolvedLocalPath = resolveLocalImagePath(filePath, image.src);
      if (resolvedLocalPath && !(await pathExists(resolvedLocalPath))) {
        errors.push(
          `[check:images] ❌ ${relativeFilePath}:${image.line} inline image file not found -> ${toRepoRelative(resolvedLocalPath)}`
        );
      }
    }

    for (const exception of exceptions) {
      if (!usedExceptions.has(exception.src)) {
        errors.push(
          `[check:images] ❌ ${relativeFilePath} declares inlineImageExceptions entry "${exception.src}" that is not used in the article body.`
        );
      }
    }
  }

  if (errors.length > 0) {
    for (const error of errors) {
      console.error(error);
    }
    console.error("\n[check:images] Image validation failed. See errors above.");
    process.exit(1);
  }

  console.log(
    `[check:images] ✅ All blog images pass format and size constraints. assets=${checkedAssetFiles} inline=${checkedInlineImages}`
  );
}

runImageChecks().catch(error => {
  console.error(error);
  process.exit(1);
});
