import path from "node:path";
import { readFile, readdir } from "node:fs/promises";
import yaml from "js-yaml";
import { getHistoryUrl, LEGAL_CITATION_REGISTRY } from "./registry.mjs";

const BCN_URL_RE = /https:\/\/www\.bcn\.cl\/leychile\/navegar\?idNorma=(\d+)/g;
const FRONTMATTER_RE = /^---\n([\s\S]*?)\n---\n?/;
const LAW_FILE_EXTENSIONS = new Set([".md", ".mdx"]);

export async function runLegalCitationAudit({
  rootDir,
  verifyBcn = false,
  fetchImpl = globalThis.fetch,
}) {
  const lawsDir = path.join(rootDir, "src", "data", "laws");
  const blogDir = path.join(rootDir, "src", "data", "blog");

  const lawFiles = await listMarkdownFiles(lawsDir);
  const blogFiles = await listMarkdownFiles(blogDir);
  const registryBySlug = new Map(
    LEGAL_CITATION_REGISTRY.map(entry => [entry.slug, entry])
  );
  const issues = [];

  for (const filePath of lawFiles) {
    const relativePath = toRepoRelative(rootDir, filePath);
    const slug = path.basename(filePath, path.extname(filePath));
    const source = await readFile(filePath, "utf8");
    const { data } = parseFrontmatter(source, relativePath);
    const numero = normalizeLawNumber(data.numero);
    const idNorma = extractIdNorma(data.bcnUrl);

    if (!idNorma) {
      issues.push({
        type: "law_missing_idnorma",
        file: relativePath,
        message: `Law frontmatter bcnUrl is missing idNorma: ${String(data.bcnUrl ?? "")}`,
      });
      continue;
    }

    if (!slug.startsWith("dl-") && !numero.startsWith("DL ")) {
      const registryEntry = registryBySlug.get(slug);
      if (!registryEntry) {
        issues.push({
          type: "law_missing_registry_entry",
          file: relativePath,
          message: `Law slug "${slug}" is not covered by the BCN verification registry.`,
        });
        continue;
      }

      if (!numeroIncludesExpected(numero, normalizeLawNumber(registryEntry.numero))) {
        issues.push({
          type: "law_numero_mismatch",
          file: relativePath,
          message: `Law numero mismatch. frontmatter=${String(data.numero)} registry=${registryEntry.numero}`,
        });
      }

      if (idNorma !== registryEntry.canonicalIdNorma) {
        issues.push({
          type: "law_noncanonical_idnorma",
          file: relativePath,
          message: `Expected canonical idNorma=${registryEntry.canonicalIdNorma} for ${registryEntry.numero}, found ${idNorma}.`,
        });
      }
    }
  }

  const aliasMap = buildAliasMap();
  const scannedFiles = [...lawFiles, ...blogFiles];
  for (const filePath of scannedFiles) {
    const relativePath = toRepoRelative(rootDir, filePath);
    const source = await readFile(filePath, "utf8");
    const matches = [...source.matchAll(BCN_URL_RE)];
    for (const match of matches) {
      const idNorma = match[1];
      const registryEntry = aliasMap.get(idNorma);
      if (!registryEntry) continue;

      issues.push({
        type: "alias_idnorma_detected",
        file: relativePath,
        line: getLineNumber(source, match.index ?? 0),
        message: `Found non-canonical BCN idNorma=${idNorma} for Ley ${registryEntry.numero}. Use idNorma=${registryEntry.canonicalIdNorma} or the internal law page /leyes/${registryEntry.slug}/.`,
      });
    }
  }

  const liveChecks = [];
  if (verifyBcn) {
    if (typeof fetchImpl !== "function") {
      throw new Error("verifyBcn requires a fetch implementation.");
    }

    for (const entry of LEGAL_CITATION_REGISTRY) {
      const historyUrl = getHistoryUrl(entry.historyPageId);
      const response = await fetchImpl(historyUrl, {
        headers: { "user-agent": "Mozilla/5.0 legal-citation-audit" },
      });
      if (!response.ok) {
        issues.push({
          type: "history_fetch_failed",
          file: historyUrl,
          message: `Failed to fetch BCN history page (${response.status}).`,
        });
        continue;
      }

      const html = await response.text();
      const parsed = parseHistoryPage(html);
      liveChecks.push({
        slug: entry.slug,
        numero: parsed.numero,
        idNorma: parsed.idNorma,
        historyUrl,
      });

      if (parsed.numero !== entry.numero) {
        issues.push({
          type: "history_numero_mismatch",
          file: historyUrl,
          message: `Registry numero mismatch for ${entry.slug}. history=${parsed.numero ?? "missing"} registry=${entry.numero}`,
        });
      }

      if (parsed.idNorma !== entry.canonicalIdNorma) {
        issues.push({
          type: "history_idnorma_mismatch",
          file: historyUrl,
          message: `Registry idNorma mismatch for ${entry.slug}. history=${parsed.idNorma ?? "missing"} registry=${entry.canonicalIdNorma}`,
        });
      }
    }
  }

  return {
    issues,
    scannedLawFiles: lawFiles.length,
    scannedBlogFiles: blogFiles.length,
    registryEntries: LEGAL_CITATION_REGISTRY.length,
    liveChecks,
  };
}

export function parseHistoryPage(html) {
  const numeroMatch =
    html.match(/Ley N[º°]\s*([0-9.]+)/i) ??
    html.match(/Ley Nº\s*([0-9.]+)/i) ??
    html.match(/LEY NUM\.\s*([0-9.]+)/i);
  const idMatch = html.match(/leychile\.cl\/N\?i=(\d{4,8})/i);

  return {
    numero: numeroMatch?.[1] ?? null,
    idNorma: idMatch?.[1] ?? null,
  };
}

export function extractIdNorma(rawUrl) {
  if (typeof rawUrl !== "string") return null;

  try {
    const parsed = new URL(rawUrl);
    return parsed.searchParams.get("idNorma");
  } catch {
    return null;
  }
}

function buildAliasMap() {
  const map = new Map();
  for (const entry of LEGAL_CITATION_REGISTRY) {
    for (const alias of entry.aliases) {
      map.set(alias, entry);
    }
  }
  return map;
}

async function listMarkdownFiles(rootDir) {
  const entries = await readdir(rootDir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const target = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...(await listMarkdownFiles(target)));
      continue;
    }

    if (LAW_FILE_EXTENSIONS.has(path.extname(entry.name))) {
      files.push(target);
    }
  }

  return files.sort();
}

function parseFrontmatter(source, filePath) {
  const match = source.match(FRONTMATTER_RE);
  if (!match) {
    throw new Error(`Missing frontmatter: ${filePath}`);
  }

  const data = yaml.load(match[1]);
  if (!data || typeof data !== "object") {
    throw new Error(`Invalid frontmatter: ${filePath}`);
  }

  return { data };
}

function normalizeLawNumber(rawValue) {
  return String(rawValue ?? "")
    .replace(/^Ley\s*/i, "")
    .replace(/\s+/g, " ")
    .trim()
    .toUpperCase();
}

function numeroIncludesExpected(frontmatterNumero, expectedNumero) {
  if (frontmatterNumero === expectedNumero) return true;
  return frontmatterNumero.split("/").map(part => part.trim()).includes(expectedNumero);
}

function toRepoRelative(rootDir, filePath) {
  return path.relative(rootDir, filePath).replace(/\\/g, "/");
}

function getLineNumber(source, index) {
  return source.slice(0, index).split("\n").length;
}
