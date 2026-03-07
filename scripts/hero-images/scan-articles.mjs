#!/usr/bin/env node
import path from "node:path";
import {
  BLOG_DIR,
  MANIFEST_PATH,
  isPublishable,
  listArticleFiles,
  normalizeSlug,
  normalizeStringArray,
  parseFrontmatter,
  readArticleFile,
  splitFrontmatter,
  summarizeBody,
  toRepoRelative,
  writeJson,
} from "./lib.mjs";

function stripBodyForAnalysis(body) {
  return body
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/!\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/\[[^\]]*\]\([^)]*\)/g, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function extractHeadings(body) {
  return body
    .split(/\r?\n/)
    .map(line => line.trim())
    .filter(line => /^##+\s+/.test(line))
    .map(line => line.replace(/^##+\s+/, "").trim())
    .filter(Boolean)
    .slice(0, 8);
}

function extractLeadParagraphs(body) {
  return body
    .split(/\r?\n\r?\n/)
    .map(block => block.trim())
    .filter(
      block =>
        block &&
        !block.startsWith("#") &&
        !block.startsWith("|") &&
        !block.startsWith("```") &&
        !/^[-*]\s+/.test(block)
    )
    .map(block => block.replace(/\s+/g, " ").trim())
    .slice(0, 3);
}

async function main() {
  const files = await listArticleFiles(BLOG_DIR);
  const articles = [];

  for (const filePath of files) {
    const source = await readArticleFile(filePath);
    const { frontmatterRaw, body } = splitFrontmatter(source);

    if (!frontmatterRaw) {
      console.warn(`[scan-articles] Skipping without frontmatter: ${toRepoRelative(filePath)}`);
      continue;
    }

    const frontmatter = parseFrontmatter(frontmatterRaw, filePath);
    if (!isPublishable(frontmatter)) continue;

    const slug = normalizeSlug(frontmatter, filePath);
    const bodyForAnalysis = stripBodyForAnalysis(body);
    const headings = extractHeadings(body);
    const leadParagraphs = extractLeadParagraphs(body);

    articles.push({
      slug,
      title: String(frontmatter.title ?? "").trim(),
      tags: normalizeStringArray(frontmatter.tags),
      category: String(frontmatter.category ?? "general").trim().toLowerCase(),
      cluster: typeof frontmatter.cluster === "string" ? frontmatter.cluster.trim() : "",
      sourcePath: toRepoRelative(filePath),
      heroImage:
        typeof frontmatter.heroImage === "string" && frontmatter.heroImage.trim()
          ? frontmatter.heroImage.trim()
          : "",
      summary: summarizeBody(body, 280),
      leadParagraphs,
      headings,
      bodyExcerpt: bodyForAnalysis.slice(0, 1200),
      wordCount: bodyForAnalysis
        .replace(/\s+/g, " ")
        .trim()
        .split(" ")
        .filter(Boolean).length,
      sourceFile: path.basename(filePath),
    });
  }

  articles.sort((a, b) => a.slug.localeCompare(b.slug));

  const manifest = {
    schemaVersion: 1,
    source: "src/data/blog/**",
    publishableRule: "draft !== true",
    articleCount: files.length,
    publishedCount: articles.length,
    articles,
  };

  await writeJson(MANIFEST_PATH, manifest);

  console.log(`[scan-articles] Total files: ${files.length}`);
  console.log(`[scan-articles] Publishable: ${articles.length}`);
  console.log(`[scan-articles] Manifest: ${toRepoRelative(MANIFEST_PATH)}`);
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
