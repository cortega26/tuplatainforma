/* eslint-disable no-console */
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");

function parseArgs(argv) {
  const args = {
    write: false,
    inferCategory: true,
    forcedCategory: null,
  };

  for (const token of argv) {
    if (token === "--write") {
      args.write = true;
      continue;
    }
    if (token === "--infer-category") {
      args.inferCategory = true;
      continue;
    }
    if (token.startsWith("--category=")) {
      args.forcedCategory = token.split("=")[1]?.trim() || "general";
      args.inferCategory = false;
    }
  }

  return args;
}

function listContentFiles(dirPath) {
  const files = [];
  const entries = readdirSync(dirPath, { withFileTypes: true }).sort((a, b) =>
    a.name.localeCompare(b.name)
  );

  for (const entry of entries) {
    const absolutePath = path.join(dirPath, entry.name);
    if (entry.isDirectory()) {
      files.push(...listContentFiles(absolutePath));
      continue;
    }
    if (!/\.(md|mdx)$/i.test(entry.name)) continue;
    files.push(absolutePath);
  }
  return files;
}

function extractFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return null;
  return {
    frontmatter: match[1],
    start: match.index ?? 0,
    end: (match.index ?? 0) + match[0].length,
  };
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function topLevelMatch(line) {
  return line.match(/^([A-Za-z][A-Za-z0-9_-]*):(?:\s*(.*))?$/);
}

function findKeyIndex(lines, key) {
  for (let i = 0; i < lines.length; i += 1) {
    const match = topLevelMatch(lines[i]);
    if (match && match[1] === key) return i;
  }
  return -1;
}

function blockEnd(lines, index) {
  let cursor = index + 1;
  while (cursor < lines.length && /^\s/.test(lines[cursor])) {
    cursor += 1;
  }
  return cursor;
}

function hasKey(lines, key) {
  return findKeyIndex(lines, key) !== -1;
}

function removeKey(lines, key) {
  const index = findKeyIndex(lines, key);
  if (index === -1) return false;
  const end = blockEnd(lines, index);
  lines.splice(index, end - index);
  return true;
}

function renameKey(lines, oldKey, newKey) {
  const oldIndex = findKeyIndex(lines, oldKey);
  if (oldIndex === -1) return false;

  if (hasKey(lines, newKey)) {
    removeKey(lines, oldKey);
    return true;
  }

  lines[oldIndex] = lines[oldIndex].replace(
    new RegExp(`^${oldKey}:(\\s*)`),
    `${newKey}:$1`
  );
  return true;
}

function insertAfter(lines, afterKey, newLines) {
  const afterIndex = findKeyIndex(lines, afterKey);
  const index = afterIndex === -1 ? lines.length : blockEnd(lines, afterIndex);
  lines.splice(index, 0, ...newLines);
}

function insertBefore(lines, beforeKey, newLines) {
  const beforeIndex = findKeyIndex(lines, beforeKey);
  const index = beforeIndex === -1 ? lines.length : beforeIndex;
  lines.splice(index, 0, ...newLines);
}

function getScalarValue(lines, key) {
  const index = findKeyIndex(lines, key);
  if (index === -1) return null;
  const match = topLevelMatch(lines[index]);
  if (!match) return null;
  const raw = (match[2] ?? "").trim();
  if (!raw) return "";
  return stripQuotes(raw);
}

function parseInlineArray(raw) {
  const value = raw.trim();
  if (!value.startsWith("[") || !value.endsWith("]")) return null;
  const inner = value.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map(item => stripQuotes(item.trim()))
    .filter(Boolean);
}

function getTags(lines) {
  const index = findKeyIndex(lines, "tags");
  if (index === -1) return [];

  const headMatch = topLevelMatch(lines[index]);
  if (!headMatch) return [];
  const raw = (headMatch[2] ?? "").trim();

  if (raw.length > 0) {
    const inlineArray = parseInlineArray(raw);
    if (inlineArray) return inlineArray;
    return [stripQuotes(raw)];
  }

  const values = [];
  let cursor = index + 1;
  while (cursor < lines.length) {
    const line = lines[cursor];
    if (!/^\s/.test(line)) break;
    const itemMatch = line.match(/^\s*-\s+(.+)$/);
    if (itemMatch) values.push(stripQuotes(itemMatch[1].trim()));
    cursor += 1;
  }

  return values;
}

function normalizeTag(tag) {
  return stripQuotes(tag.trim()).toLowerCase();
}

function inferCategoryFromContext({ tags, slug, title }) {
  const normalizedTags = tags.map(normalizeTag);
  const slugText = `${slug} ${title}`.toLowerCase();

  const hasTag = candidates =>
    normalizedTags.some(tag => candidates.includes(tag));
  const hasText = candidates =>
    candidates.some(candidate => slugText.includes(candidate));

  if (
    hasTag(["afp", "pensiones", "apv", "cuenta-2", "reforma-pensiones"]) ||
    hasText(["afp", "apv", "pensiones", "cuenta-2"])
  ) {
    return "prevision";
  }

  if (
    hasTag([
      "impuestos",
      "operacion-renta",
      "f22",
      "sii",
      "devolucion",
      "retencion",
      "boletas",
      "honorarios",
      "tgr",
    ]) ||
    hasText(["impuesto", "renta", "f22", "honorarios", "devolucion"])
  ) {
    return "impuestos";
  }

  if (
    hasTag([
      "deudas",
      "credito",
      "creditos",
      "renegociacion",
      "superir",
      "dicom",
      "cmf",
      "historial-crediticio",
      "sobreendeudamiento",
    ]) ||
    hasText(["deuda", "credito", "renegociacion", "superir", "dicom"])
  ) {
    return "deuda-credito";
  }

  if (
    hasTag(["fraude", "seguridad-financiera", "tarjetas", "ley-20009"]) ||
    hasText(["fraude", "estafa", "tarjeta", "seguridad"])
  ) {
    return "seguridad-financiera";
  }

  if (
    hasTag(["sueldo", "liquidacion", "descuentos", "trabajo", "cesantia", "afc", "desempleo"]) ||
    hasText(["sueldo", "cesantia", "trabajo", "liquido"])
  ) {
    return "empleo-ingresos";
  }

  if (
    hasTag([
      "ahorro",
      "inversiones",
      "etf",
      "fondos-mutuos",
      "deposito-a-plazo",
      "uf",
      "ipc",
      "inflacion",
      "arriendos",
    ]) ||
    hasText(["inversion", "ahorro", "deposito", "etf", "fondos", "uf"])
  ) {
    return "ahorro-inversion";
  }

  return null;
}

function deriveSlugFromPath(filePath) {
  return path.basename(filePath).replace(/\.(md|mdx)$/i, "");
}

function replaceFrontmatter(source, replacementFrontmatter, start, end) {
  const prefix = source.slice(0, start);
  const suffix = source.slice(end);
  return `${prefix}---\n${replacementFrontmatter}\n---\n${suffix}`;
}

function normalizeFrontmatterForFile(filePath, args) {
  const source = readFileSync(filePath, "utf8");
  const extracted = extractFrontmatter(source);
  if (!extracted) {
    throw new Error(`Missing frontmatter block: ${filePath}`);
  }

  const lines = extracted.frontmatter.split(/\r?\n/);
  const warnings = [];
  const counters = {
    pubDatetimeToPubDate: 0,
    modDatetimeToUpdatedDate: 0,
    canonicalURLToCanonical: 0,
    ogImageToHeroImage: 0,
    slugAdded: 0,
    categoryAdded: 0,
    draftAdded: 0,
    featuredAdded: 0,
    tagsAdded: 0,
    langAdded: 0,
  };

  if (renameKey(lines, "pubDatetime", "pubDate")) {
    counters.pubDatetimeToPubDate += 1;
  }
  if (renameKey(lines, "modDatetime", "updatedDate")) {
    counters.modDatetimeToUpdatedDate += 1;
  }
  if (renameKey(lines, "canonicalURL", "canonical")) {
    counters.canonicalURLToCanonical += 1;
  }
  if (renameKey(lines, "ogImage", "heroImage")) {
    counters.ogImageToHeroImage += 1;
  }

  if (!hasKey(lines, "slug")) {
    const slug = deriveSlugFromPath(filePath);
    insertAfter(lines, "description", [`slug: ${slug}`]);
    counters.slugAdded += 1;
  }

  if (!hasKey(lines, "category")) {
    const slug = getScalarValue(lines, "slug") ?? deriveSlugFromPath(filePath);
    const title = getScalarValue(lines, "title") ?? "";
    const tags = getTags(lines);

    let category = "general";
    if (args.forcedCategory) {
      category = args.forcedCategory;
    } else if (args.inferCategory) {
      const inferred = inferCategoryFromContext({ tags, slug, title });
      if (inferred) {
        category = inferred;
      } else {
        warnings.push(
          `Category inference fallback to "general" for ${path.basename(filePath)}.`
        );
      }
    }

    if (hasKey(lines, "tags")) {
      insertAfter(lines, "tags", [`category: ${category}`]);
    } else if (hasKey(lines, "slug")) {
      insertAfter(lines, "slug", [`category: ${category}`]);
    } else {
      insertAfter(lines, "description", [`category: ${category}`]);
    }
    counters.categoryAdded += 1;
  }

  if (!hasKey(lines, "draft")) {
    insertBefore(lines, "tags", ["draft: false"]);
    counters.draftAdded += 1;
  }

  if (!hasKey(lines, "featured")) {
    insertBefore(lines, "draft", ["featured: false"]);
    counters.featuredAdded += 1;
  }

  if (!hasKey(lines, "tags")) {
    insertAfter(lines, "pubDate", ["tags: []"]);
    counters.tagsAdded += 1;
  }

  if (!hasKey(lines, "lang")) {
    insertBefore(lines, "draft", ["lang: es-CL"]);
    counters.langAdded += 1;
  }

  const normalizedFrontmatter = lines.join("\n");
  const normalizedSource = replaceFrontmatter(
    source,
    normalizedFrontmatter,
    extracted.start,
    extracted.end
  );

  const normalizedSlug = getScalarValue(lines, "slug") ?? deriveSlugFromPath(filePath);

  return {
    filePath,
    normalizedSource,
    changed: normalizedSource !== source,
    slug: normalizedSlug,
    warnings,
    counters,
  };
}

function mergeCounters(total, partial) {
  for (const [key, value] of Object.entries(partial)) {
    total[key] = (total[key] ?? 0) + value;
  }
}

const args = parseArgs(process.argv.slice(2));
const files = listContentFiles(BLOG_DIR);
const normalized = files.map(filePath => normalizeFrontmatterForFile(filePath, args));

const slugMap = new Map();
for (const file of normalized) {
  slugMap.set(file.slug, [...(slugMap.get(file.slug) ?? []), file.filePath]);
}

const collisions = [...slugMap.entries()].filter(([, paths]) => paths.length > 1);
if (collisions.length > 0) {
  console.error("[normalize-frontmatter] Slug collisions detected:");
  for (const [slug, paths] of collisions) {
    console.error(`- ${slug}`);
    for (const itemPath of paths) {
      console.error(`  - ${path.relative(REPO_ROOT, itemPath)}`);
    }
  }
  process.exit(1);
}

const totalCounters = {};
const warnings = [];
let changedFiles = 0;

for (const file of normalized) {
  mergeCounters(totalCounters, file.counters);
  warnings.push(
    ...file.warnings.map(message => `- ${path.relative(REPO_ROOT, file.filePath)}: ${message}`)
  );
  if (!file.changed) continue;
  changedFiles += 1;
  if (args.write) {
    writeFileSync(file.filePath, file.normalizedSource, "utf8");
  }
}

console.log(`[normalize-frontmatter] Files scanned: ${files.length}`);
console.log(`[normalize-frontmatter] Files changed: ${changedFiles}`);
console.log(
  `[normalize-frontmatter] Mode: ${args.write ? "write" : "dry-run"}`
);
console.log("[normalize-frontmatter] Actions:");
for (const [key, value] of Object.entries(totalCounters)) {
  console.log(`- ${key}: ${value}`);
}

if (warnings.length > 0) {
  console.warn(`[normalize-frontmatter] Warnings: ${warnings.length}`);
  for (const warning of warnings) {
    console.warn(warning);
  }
}

