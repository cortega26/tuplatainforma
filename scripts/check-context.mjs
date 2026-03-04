 
import { existsSync, readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");

const REQUIRED_CONTEXT_FILES = [
  "context/INVARIANTS.md",
  "context/CONTRACTS.md",
  "context/MODULE_INDEX.md",
  "context/CURRENT_STATE.md",
];

function readText(relativePath) {
  const absolutePath = path.join(REPO_ROOT, relativePath);
  if (!existsSync(absolutePath)) {
    throw new Error(`Missing required file: ${relativePath}`);
  }
  const content = readFileSync(absolutePath, "utf8");
  if (content.trim().length === 0) {
    throw new Error(`File is empty: ${relativePath}`);
  }
  return content;
}

try {
  const files = new Map();
  for (const relativePath of REQUIRED_CONTEXT_FILES) {
    files.set(relativePath, readText(relativePath));
  }

  const invariantsContent = files.get("context/INVARIANTS.md") ?? "";
  const invariantIds =
    invariantsContent.match(/^###\s+`[A-Z0-9_.-]+`/gm) ?? [];
  if (invariantIds.length === 0) {
    throw new Error(
      'No invariant IDs found in context/INVARIANTS.md (expected headings like ### `URL.PUBLIC.NO_POST_ID`).'
    );
  }

  const contractsContent = files.get("context/CONTRACTS.md") ?? "";
  const contractIds = contractsContent.match(/`CONTRACT\.[A-Z0-9_.-]+`/g) ?? [];
  if (contractIds.length === 0) {
    throw new Error(
      "No CONTRACT.* IDs found in context/CONTRACTS.md."
    );
  }

  const agentsContent = readText("AGENTS.md");
  if (!agentsContent.includes("context/*.md")) {
    throw new Error(
      'AGENTS.md must reference "context/*.md" as canonical context.'
    );
  }

  console.log(
    `[check-context] OK. validated=${REQUIRED_CONTEXT_FILES.length} invariantIds=${invariantIds.length} contractIds=${contractIds.length}`
  );
} catch (error) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[check-context] FAIL: ${message}`);
  process.exit(1);
}
