/* eslint-disable no-console */
import { readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");

const TITLE_RANGE = { min: 20, max: 110 };
const DESCRIPTION_RANGE = { min: 120, max: 200 };

const DEPRECATED_FIELDS = [
  "pubDatetime",
  "modDatetime",
  "canonicalURL",
  "ogImage",
];

const ALLOWED_CATEGORIES = new Set([
  "ahorro-inversion",
  "impuestos",
  "prevision",
  "deuda-credito",
  "seguridad-financiera",
  "empleo-ingresos",
  "general",
]);

function listContentFiles(dirPath) {
  const result = [];
  const entries = readdirSync(dirPath, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      result.push(...listContentFiles(absolutePath));
      continue;
    }
    if (!/\.(md|mdx)$/i.test(entry.name)) continue;
    result.push(absolutePath);
  }

  return result;
}

function extractFrontmatter(filePath) {
  const source = readFileSync(filePath, "utf8");
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  return match ? match[1] : null;
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function parseInlineArray(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;
  const inside = trimmed.slice(1, -1).trim();
  if (!inside) return [];
  return inside
    .split(",")
    .map(item => stripQuotes(item.trim()))
    .filter(Boolean);
}

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  const inlineArray = parseInlineArray(value);
  if (inlineArray) return inlineArray;
  return stripQuotes(value);
}

function parseFrontmatterBlock(block) {
  const lines = block.split(/\r?\n/);
  const parsed = {};

  for (let i = 0; i < lines.length; i += 1) {
    const line = lines[i];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (/^\s/.test(line)) continue;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (rawValue.length > 0) {
      parsed[key] = parseScalar(rawValue);
      continue;
    }

    const listValues = [];
    let cursor = i + 1;
    while (cursor < lines.length) {
      const child = lines[cursor];
      if (/^\s*-\s+/.test(child)) {
        listValues.push(stripQuotes(child.replace(/^\s*-\s+/, "").trim()));
        cursor += 1;
        continue;
      }
      if (/^\s+$/.test(child) || child.trim() === "") {
        cursor += 1;
        continue;
      }
      break;
    }

    if (listValues.length > 0) {
      parsed[key] = listValues;
      i = cursor - 1;
      continue;
    }

    parsed[key] = "";
  }

  return parsed;
}

function parseDate(value) {
  if (value instanceof Date) return value;
  if (typeof value !== "string") return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;
  return parsed;
}

function hasExplicitTimezone(value) {
  if (typeof value !== "string") return false;
  return /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
}

function deriveSlugFromPath(filePath) {
  return path.basename(filePath).replace(/\.(md|mdx)$/i, "");
}

function toHttpsUrlOrNull(value) {
  if (!value) return null;
  if (typeof value !== "string") return null;
  try {
    const parsed = new URL(value);
    if (parsed.protocol !== "https:") return null;
    return parsed.toString();
  } catch {
    return null;
  }
}

function pushIssue(collection, filePath, message) {
  collection.push({ filePath, message });
}

const files = listContentFiles(BLOG_DIR);
const errors = [];
const warnings = [];
const deprecationCounters = new Map(
  DEPRECATED_FIELDS.map(field => [field, 0])
);
const defaultCounters = new Map([
  ["slug_derived", 0],
  ["category_defaulted", 0],
]);
const qualityCounters = new Map([
  ["title_range", 0],
  ["description_range", 0],
]);

const publishableSlugs = new Map();

for (const filePath of files) {
  const relativeFilePath = path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
  const frontmatterBlock = extractFrontmatter(filePath);

  if (!frontmatterBlock) {
    pushIssue(errors, relativeFilePath, "Missing frontmatter block.");
    continue;
  }

  const frontmatter = parseFrontmatterBlock(frontmatterBlock);
  for (const deprecatedField of DEPRECATED_FIELDS) {
    if (deprecatedField in frontmatter) {
      deprecationCounters.set(
        deprecatedField,
        (deprecationCounters.get(deprecatedField) ?? 0) + 1
      );
      pushIssue(
        warnings,
        relativeFilePath,
        `Deprecated field "${deprecatedField}" detected (allowed in Phase 3, migrate in Phase 4).`
      );
    }
  }

  if (typeof frontmatter.title !== "string" || frontmatter.title.trim() === "") {
    pushIssue(errors, relativeFilePath, 'Field "title" is required and must be a non-empty string.');
  }

  if (
    typeof frontmatter.description !== "string" ||
    frontmatter.description.trim() === ""
  ) {
    pushIssue(
      errors,
      relativeFilePath,
      'Field "description" is required and must be a non-empty string.'
    );
  }

  const explicitSlug =
    typeof frontmatter.slug === "string" ? frontmatter.slug.trim() : "";
  const slug = explicitSlug || deriveSlugFromPath(filePath);
  if (!explicitSlug) {
    defaultCounters.set(
      "slug_derived",
      (defaultCounters.get("slug_derived") ?? 0) + 1
    );
    pushIssue(
      warnings,
      relativeFilePath,
      `Missing explicit "slug"; derived slug "${slug}" from filename.`
    );
  }

  const tagsValue = frontmatter.tags;
  const tags = tagsValue ?? [];
  if (!Array.isArray(tags)) {
    pushIssue(errors, relativeFilePath, 'Field "tags" must be an array of strings.');
  } else if (tags.some(tag => typeof tag !== "string")) {
    pushIssue(errors, relativeFilePath, 'Field "tags" must contain only strings.');
  }

  const draft = frontmatter.draft ?? false;
  if (typeof draft !== "boolean") {
    pushIssue(errors, relativeFilePath, 'Field "draft" must be boolean.');
  }

  const featured = frontmatter.featured ?? false;
  if (typeof featured !== "boolean") {
    pushIssue(errors, relativeFilePath, 'Field "featured" must be boolean.');
  }

  const category = frontmatter.category ?? "general";
  if (!Object.hasOwn(frontmatter, "category")) {
    defaultCounters.set(
      "category_defaulted",
      (defaultCounters.get("category_defaulted") ?? 0) + 1
    );
    pushIssue(
      warnings,
      relativeFilePath,
      'Missing "category"; default "general" applied for transition.'
    );
  }
  if (typeof category !== "string" || category.trim() === "") {
    pushIssue(errors, relativeFilePath, 'Field "category" must be a non-empty string.');
  } else if (!ALLOWED_CATEGORIES.has(category)) {
    pushIssue(
      errors,
      relativeFilePath,
      `Field "category" must be one of: ${Array.from(ALLOWED_CATEGORIES).join(", ")}.`
    );
  }

  const pubDateRaw = frontmatter.pubDate ?? frontmatter.pubDatetime;
  const pubDate = parseDate(pubDateRaw);
  if (!pubDateRaw) {
    pushIssue(
      errors,
      relativeFilePath,
      'Missing publication date: define "pubDate" (preferred) or "pubDatetime" (legacy).'
    );
  } else if (!pubDate) {
    pushIssue(errors, relativeFilePath, 'Publication date is not parseable.');
  } else if (typeof pubDateRaw === "string" && !hasExplicitTimezone(pubDateRaw)) {
    pushIssue(
      errors,
      relativeFilePath,
      'Publication date must include explicit timezone (e.g. "Z" or "+00:00").'
    );
  }

  const updatedDateRaw = frontmatter.updatedDate ?? frontmatter.modDatetime ?? null;
  const updatedDate = updatedDateRaw ? parseDate(updatedDateRaw) : null;
  if (updatedDateRaw && !updatedDate) {
    pushIssue(errors, relativeFilePath, 'Field "updatedDate" is not parseable.');
  }
  if (
    typeof updatedDateRaw === "string" &&
    updatedDateRaw &&
    !hasExplicitTimezone(updatedDateRaw)
  ) {
    pushIssue(
      errors,
      relativeFilePath,
      'Field "updatedDate" must include explicit timezone (e.g. "Z" or "+00:00").'
    );
  }
  if (pubDate && updatedDate && updatedDate.getTime() < pubDate.getTime()) {
    pushIssue(
      errors,
      relativeFilePath,
      'Field "updatedDate" must be greater than or equal to "pubDate".'
    );
  }

  const canonicalRaw = frontmatter.canonical ?? frontmatter.canonicalURL;
  if (canonicalRaw) {
    const canonical = toHttpsUrlOrNull(canonicalRaw);
    if (!canonical) {
      pushIssue(
        errors,
        relativeFilePath,
        'Field "canonical" must be an absolute HTTPS URL.'
      );
    }
  }

  if (typeof frontmatter.title === "string") {
    const titleLength = frontmatter.title.trim().length;
    if (titleLength < TITLE_RANGE.min || titleLength > TITLE_RANGE.max) {
      qualityCounters.set(
        "title_range",
        (qualityCounters.get("title_range") ?? 0) + 1
      );
      pushIssue(
        warnings,
        relativeFilePath,
        `Title length ${titleLength} outside recommended range (${TITLE_RANGE.min}-${TITLE_RANGE.max}).`
      );
    }
  }

  if (typeof frontmatter.description === "string") {
    const descriptionLength = frontmatter.description.trim().length;
    if (
      descriptionLength < DESCRIPTION_RANGE.min ||
      descriptionLength > DESCRIPTION_RANGE.max
    ) {
      qualityCounters.set(
        "description_range",
        (qualityCounters.get("description_range") ?? 0) + 1
      );
      pushIssue(
        warnings,
        relativeFilePath,
        `Description length ${descriptionLength} outside recommended range (${DESCRIPTION_RANGE.min}-${DESCRIPTION_RANGE.max}).`
      );
    }
  }

  if (draft === false) {
    publishableSlugs.set(slug, [
      ...(publishableSlugs.get(slug) ?? []),
      relativeFilePath,
    ]);
  }
}

for (const [slug, relatedFiles] of publishableSlugs.entries()) {
  if (relatedFiles.length < 2) continue;
  pushIssue(
    errors,
    relatedFiles.join(", "),
    `Duplicate publishable slug "${slug}".`
  );
}

console.log(`[check-frontmatter] Scanned ${files.length} articles.`);

if (errors.length > 0) {
  console.error(`[check-frontmatter] Errors: ${errors.length}`);
  for (const error of errors) {
    console.error(`- ${error.filePath}: ${error.message}`);
  }
}

if (warnings.length > 0) {
  console.warn(`[check-frontmatter] Warnings: ${warnings.length}`);
  for (const warning of warnings) {
    console.warn(`- ${warning.filePath}: ${warning.message}`);
  }
}

console.log("[check-frontmatter] Deprecation counters:");
for (const field of DEPRECATED_FIELDS) {
  console.log(`- ${field}: ${deprecationCounters.get(field) ?? 0}`);
}

console.log("[check-frontmatter] Transition defaults:");
for (const [key, value] of defaultCounters.entries()) {
  console.log(`- ${key}: ${value}`);
}

console.log("[check-frontmatter] Quality warnings (Level 2):");
for (const [key, value] of qualityCounters.entries()) {
  console.log(`- ${key}: ${value}`);
}

if (errors.length > 0) {
  process.exit(1);
}

console.log("[check-frontmatter] OK (no blocking errors).");
