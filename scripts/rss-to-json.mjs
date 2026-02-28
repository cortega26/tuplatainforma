/* eslint-disable no-console */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

function parseCliArgs(argv) {
  const args = {
    input: path.join(REPO_ROOT, "dist", "rss.xml"),
    out: path.join(REPO_ROOT, "docs", "reports", "rss_snapshot_after.json"),
  };

  for (let i = 0; i < argv.length; i += 1) {
    const current = argv[i];
    const next = argv[i + 1];
    if (current === "--in" && next) {
      args.input = path.resolve(REPO_ROOT, next);
      i += 1;
      continue;
    }
    if (current === "--out" && next) {
      args.out = path.resolve(REPO_ROOT, next);
      i += 1;
    }
  }

  return args;
}

function decodeXmlEntities(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function getTagValue(xml, tagName) {
  const pattern = new RegExp(
    `<${tagName}(?:\\s+[^>]*)?>([\\s\\S]*?)<\\/${tagName}>`,
    "i"
  );
  const match = xml.match(pattern);
  if (!match?.[1]) return "";
  return decodeXmlEntities(match[1].trim());
}

function parseRssItems(xml) {
  const itemPattern = /<item>([\s\S]*?)<\/item>/g;
  const items = [];

  for (const match of xml.matchAll(itemPattern)) {
    const itemXml = match[1] ?? "";
    const link = getTagValue(itemXml, "link");
    if (!link) continue;
    items.push({
      link,
      title: getTagValue(itemXml, "title"),
      pubDate: getTagValue(itemXml, "pubDate"),
      guid: getTagValue(itemXml, "guid"),
    });
  }

  return items.sort((a, b) => a.link.localeCompare(b.link));
}

const args = parseCliArgs(process.argv.slice(2));
const rssXml = readFileSync(args.input, "utf8");
const items = parseRssItems(rssXml);

const payload = {
  generatedAt: new Date().toISOString(),
  source: path.relative(REPO_ROOT, args.input).replace(/\\/g, "/"),
  total: items.length,
  items,
};

mkdirSync(path.dirname(args.out), { recursive: true });
writeFileSync(args.out, `${JSON.stringify(payload, null, 2)}\n`, "utf8");

console.log(`[rss-to-json] Saved ${items.length} items to ${args.out}`);
