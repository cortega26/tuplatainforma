/* eslint-disable no-console */
import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

function resolveArg(input, fallback) {
  return path.resolve(REPO_ROOT, input ?? fallback);
}

const beforePath = resolveArg(
  process.argv[2],
  "docs/reports/routes_snapshot_before.json"
);
const afterPath = resolveArg(
  process.argv[3],
  "docs/reports/routes_snapshot_after.json"
);

function loadRoutes(filePath) {
  const raw = readFileSync(filePath, "utf8");
  const parsed = JSON.parse(raw);
  const routes = new Set(parsed.routes.map(entry => entry.route));
  return routes;
}

const beforeRoutes = loadRoutes(beforePath);
const afterRoutes = loadRoutes(afterPath);

const removed = [...beforeRoutes].filter(route => !afterRoutes.has(route)).sort();
const added = [...afterRoutes].filter(route => !beforeRoutes.has(route)).sort();

if (removed.length > 0) {
  console.error("[compare-routes] Removed routes detected:");
  for (const route of removed) {
    console.error(`- ${route}`);
  }
  process.exit(1);
}

if (added.length > 0) {
  console.warn(`[compare-routes] Added routes: ${added.length}`);
  for (const route of added) {
    console.warn(`- ${route}`);
  }
} else {
  console.log("[compare-routes] No route changes detected.");
}

console.log(
  `[compare-routes] before=${beforeRoutes.size} after=${afterRoutes.size}`
);

