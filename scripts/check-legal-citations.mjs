#!/usr/bin/env node

import path from "node:path";
import { runLegalCitationAudit } from "./legal-citations/core.mjs";

async function main() {
  const args = new Set(process.argv.slice(2));
  const verifyBcn = args.has("--verify-bcn");
  const rootDir = path.resolve(process.env.LEGAL_CITATION_ROOT || process.cwd());

  const result = await runLegalCitationAudit({ rootDir, verifyBcn });

  if (result.issues.length > 0) {
    console.error("[check-legal-citations] FAIL:");
    for (const issue of result.issues) {
      const location = issue.line
        ? `${issue.file}:${issue.line}`
        : issue.file;
      console.error(`- ${location} :: ${issue.message}`);
    }
    process.exit(1);
  }

  const liveSuffix = verifyBcn
    ? ` live_registry_checks=${result.liveChecks.length}`
    : "";
  console.log(
    `[check-legal-citations] OK. laws=${result.scannedLawFiles} blog=${result.scannedBlogFiles} registry=${result.registryEntries}${liveSuffix}`
  );
}

main().catch(error => {
  console.error(`[check-legal-citations] FAIL: ${error.message}`);
  process.exit(1);
});
