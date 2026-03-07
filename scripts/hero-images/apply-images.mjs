#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import {
  DOWNLOADS_DIR,
  PROMPTS_PATH,
  PUBLIC_HERO_DIR,
  ensureDirectory,
  heroPublicPath,
  isPublishable,
  listArticleFiles,
  normalizeSlug,
  parseArgs,
  parseFrontmatter,
  readArticleFile,
  readJson,
  replaceFrontmatterBlock,
  resolveHeroImageFile,
  splitFrontmatter,
  toRepoRelative,
  upsertHeroImageLine,
} from "./lib.mjs";

const ALLOWED_EXTENSIONS = new Set([".avif", ".webp"]);

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

function isAllowedExtension(filePath) {
  return ALLOWED_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

async function findStagedAsset(slug, preferredExt = ".avif") {
  const preferred = path.join(DOWNLOADS_DIR, `${slug}${preferredExt}`);
  if (await fileExists(preferred)) return preferred;

  for (const ext of ALLOWED_EXTENSIONS) {
    const candidate = path.join(DOWNLOADS_DIR, `${slug}${ext}`);
    if (await fileExists(candidate)) return candidate;
  }

  return null;
}

async function copyIfDifferent(sourcePath, targetPath) {
  if (sourcePath === targetPath) return false;

  const sourceBytes = await fs.readFile(sourcePath);
  try {
    const existingBytes = await fs.readFile(targetPath);
    if (existingBytes.equals(sourceBytes)) return false;
  } catch {
    // missing target, continue copy
  }

  await fs.copyFile(sourcePath, targetPath);
  return true;
}

async function loadPublishableIndex() {
  const files = await listArticleFiles();
  const bySlug = new Map();

  for (const filePath of files) {
    const source = await readArticleFile(filePath);
    const { frontmatterRaw } = splitFrontmatter(source);
    if (!frontmatterRaw) continue;
    const frontmatter = parseFrontmatter(frontmatterRaw, filePath);
    if (!isPublishable(frontmatter)) continue;

    const slug = normalizeSlug(frontmatter, filePath);
    bySlug.set(slug, { filePath, source, frontmatterRaw, frontmatter });
  }

  return bySlug;
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const enforcePublicPath = args.has("--enforce-public-path");

  const prompts = await readJson(PROMPTS_PATH);
  const entries = Array.isArray(prompts.entries) ? prompts.entries : [];
  const publishableBySlug = await loadPublishableIndex();

  await ensureDirectory(PUBLIC_HERO_DIR);

  let copied = 0;
  let updated = 0;
  const missing = [];

  for (const entry of entries) {
    const article = publishableBySlug.get(entry.slug);
    if (!article) continue;

    const preferredExt = path.extname(entry.targetImagePath || ".avif") || ".avif";
    const canonicalHeroValue = heroPublicPath(entry.slug, preferredExt);
    const canonicalHeroFile = path.join(
      PUBLIC_HERO_DIR,
      `${entry.slug}${preferredExt}`
    );

    const stagedFile = await findStagedAsset(entry.slug, preferredExt);
    const currentHeroValue =
      typeof article.frontmatter.heroImage === "string"
        ? article.frontmatter.heroImage.trim()
        : "";
    const currentHeroFile = resolveHeroImageFile(article.filePath, currentHeroValue);
    const currentHeroExists = currentHeroFile ? await fileExists(currentHeroFile) : false;

    let sourceAsset = null;
    if (stagedFile && path.extname(stagedFile).toLowerCase() === preferredExt) {
      sourceAsset = stagedFile;
    } else if (
      currentHeroFile &&
      currentHeroExists &&
      isAllowedExtension(currentHeroFile) &&
      path.extname(currentHeroFile).toLowerCase() === preferredExt
    ) {
      sourceAsset = currentHeroFile;
    }

    const canonicalExists = await fileExists(canonicalHeroFile);

    if (sourceAsset) {
      const didCopy = await copyIfDifferent(sourceAsset, canonicalHeroFile);
      if (didCopy) copied += 1;
    }

    const heroMissing = !currentHeroValue;
    const heroBroken = !!currentHeroValue && !currentHeroExists;
    const heroNonCanonical = currentHeroValue !== canonicalHeroValue;
    const shouldUpdate =
      heroMissing || heroBroken || (enforcePublicPath && heroNonCanonical);

    if (!shouldUpdate) {
      if (!canonicalExists && !sourceAsset) {
        missing.push({ slug: entry.slug, reason: "No staged or existing asset to publish." });
      }
      continue;
    }

    if (!(await fileExists(canonicalHeroFile))) {
      missing.push({ slug: entry.slug, reason: "Canonical public asset is missing." });
      continue;
    }

    const updatedFrontmatterRaw = upsertHeroImageLine(
      article.frontmatterRaw,
      canonicalHeroValue
    );
    const updatedSource = replaceFrontmatterBlock(article.source, updatedFrontmatterRaw);

    if (updatedSource !== article.source) {
      await fs.writeFile(article.filePath, updatedSource, "utf8");
      updated += 1;
      console.log(`[apply-images] Updated heroImage for ${entry.slug} -> ${canonicalHeroValue}`);
    }
  }

  console.log(`[apply-images] Copied assets: ${copied}`);
  console.log(`[apply-images] Frontmatter updates: ${updated}`);

  if (missing.length > 0) {
    console.error(`[apply-images] Missing assets for ${missing.length} published article(s):`);
    for (const item of missing) {
      console.error(`- ${item.slug}: ${item.reason}`);
    }
    process.exit(1);
  }

  console.log(`[apply-images] OK. Checked ${entries.length} prompt entries.`);
  console.log(`[apply-images] Public hero directory: ${toRepoRelative(PUBLIC_HERO_DIR)}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
