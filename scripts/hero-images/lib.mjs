import crypto from "node:crypto";
import fs from "node:fs/promises";
import path from "node:path";
import yaml from "js-yaml";

export const REPO_ROOT = process.cwd();
export const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");
export const HERO_SCRIPT_DIR = path.join(REPO_ROOT, "scripts", "hero-images");
export const MANIFEST_PATH = path.join(HERO_SCRIPT_DIR, "manifest.json");
export const PROMPTS_PATH = path.join(HERO_SCRIPT_DIR, "prompts.json");
export const DOWNLOADS_DIR = path.join(HERO_SCRIPT_DIR, "downloads");
export const PUBLIC_HERO_DIR = path.join(REPO_ROOT, "public", "images", "hero");
export const PUBLISHED_HERO_MAX_BYTES = 80 * 1024;

const CONTENT_EXTENSIONS = new Set([".md", ".mdx"]);

export async function listArticleFiles(dir = BLOG_DIR) {
  const files = [];
  const queue = [dir];

  while (queue.length > 0) {
    const current = queue.pop();
    if (!current) continue;

    const entries = await fs.readdir(current, { withFileTypes: true });
    entries.sort((a, b) => a.name.localeCompare(b.name));

    for (const entry of entries) {
      const absolutePath = path.join(current, entry.name);
      if (entry.isDirectory()) {
        queue.push(absolutePath);
        continue;
      }

      if (!CONTENT_EXTENSIONS.has(path.extname(entry.name).toLowerCase())) {
        continue;
      }
      files.push(absolutePath);
    }
  }

  files.sort();
  return files;
}

export function toRepoRelative(absolutePath) {
  return path.relative(REPO_ROOT, absolutePath).replace(/\\/g, "/");
}

export async function readArticleFile(filePath) {
  return fs.readFile(filePath, "utf8");
}

export function splitFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    return { frontmatterRaw: "", body: source, fullFrontmatterBlock: "" };
  }

  return {
    frontmatterRaw: match[1] ?? "",
    body: source.slice(match[0].length),
    fullFrontmatterBlock: match[0],
  };
}

export function parseFrontmatter(frontmatterRaw, sourcePath = "") {
  if (!frontmatterRaw) return {};
  try {
    const parsed = yaml.load(frontmatterRaw, { schema: yaml.JSON_SCHEMA }) ?? {};
    return typeof parsed === "object" ? parsed : {};
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(`[hero-images] Invalid frontmatter in ${sourcePath}: ${message}`);
  }
}

export function isPublishable(frontmatter) {
  return frontmatter?.draft !== true;
}

export function normalizeSlug(frontmatter, sourcePath) {
  if (typeof frontmatter?.slug === "string" && frontmatter.slug.trim()) {
    return frontmatter.slug.trim().toLowerCase();
  }
  return path.basename(sourcePath, path.extname(sourcePath)).toLowerCase();
}

export function normalizeStringArray(value) {
  if (!Array.isArray(value)) return [];
  return value
    .map(item => String(item ?? "").trim().toLowerCase())
    .filter(Boolean);
}

export function summarizeBody(body, maxLength = 280) {
  const withoutCode = body.replace(/```[\s\S]*?```/g, " ");
  const withoutMarkdown = withoutCode
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/[#>*_`~|-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();

  if (withoutMarkdown.length <= maxLength) return withoutMarkdown;
  return `${withoutMarkdown.slice(0, maxLength).trim()}...`;
}

export async function ensureDirectory(dirPath) {
  await fs.mkdir(dirPath, { recursive: true });
}

export async function writeJson(filePath, data) {
  await ensureDirectory(path.dirname(filePath));
  await fs.writeFile(filePath, `${JSON.stringify(data, null, 2)}\n`, "utf8");
}

export async function readJson(filePath) {
  const raw = await fs.readFile(filePath, "utf8");
  return JSON.parse(raw);
}

export function sha256Hex(input) {
  return crypto.createHash("sha256").update(input, "utf8").digest("hex");
}

export function heroPublicPath(slug, ext = ".avif") {
  return `/images/hero/${slug}${ext}`;
}

export function resolveHeroImageFile(sourceFilePath, heroImageValue) {
  if (typeof heroImageValue !== "string" || !heroImageValue.trim()) {
    return null;
  }

  const trimmed = heroImageValue.trim();
  if (trimmed.startsWith("/")) {
    return path.join(REPO_ROOT, "public", trimmed.replace(/^\/+/, ""));
  }

  return path.resolve(path.dirname(sourceFilePath), trimmed);
}

export function normalizeForMatching(value) {
  return String(value ?? "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9\s-]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

export function upsertHeroImageLine(frontmatterRaw, targetValue) {
  const lines = frontmatterRaw.split(/\r?\n/);
  const heroLine = `heroImage: ${targetValue}`;

  const heroIndex = lines.findIndex(line => /^heroImage\s*:/.test(line));
  if (heroIndex >= 0) {
    lines[heroIndex] = heroLine;
    return lines.join("\n");
  }

  const descriptionIndex = lines.findIndex(line => /^description\s*:/.test(line));
  const insertAt = descriptionIndex >= 0 ? descriptionIndex + 1 : lines.length;
  lines.splice(insertAt, 0, heroLine);
  return lines.join("\n");
}

export function replaceFrontmatterBlock(source, updatedFrontmatterRaw) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) {
    throw new Error("[hero-images] Cannot update frontmatter: block not found.");
  }

  const updatedBlock = `---\n${updatedFrontmatterRaw}\n---\n`;
  return `${updatedBlock}${source.slice(match[0].length)}`;
}

export function parseArgs(argv) {
  const flags = new Set();
  const values = new Map();

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    if (!token.startsWith("--")) continue;

    if (token.includes("=")) {
      const [rawKey, rawValue] = token.split("=");
      values.set(rawKey, rawValue ?? "");
      continue;
    }

    const next = argv[index + 1];
    if (next && !next.startsWith("--")) {
      values.set(token, next);
      index += 1;
      continue;
    }

    flags.add(token);
  }

  return {
    has(flag) {
      return flags.has(flag) || values.has(flag);
    },
    get(flag, fallback = "") {
      return values.get(flag) ?? fallback;
    },
  };
}

export function templateFromPromptPath(targetImagePath) {
  const ext = path.extname(targetImagePath);
  return ext || ".avif";
}
