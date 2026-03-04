#!/usr/bin/env node

import { mkdtemp, rm, symlink } from "node:fs/promises";
import { tmpdir } from "node:os";
import path from "node:path";
import { spawn, spawnSync } from "node:child_process";
import http from "node:http";

const HOST = "127.0.0.1";
const PORT = 4327;
const SITE_BASE = "tuplatainforma";

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 30) {
  for (let i = 0; i < attempts; i += 1) {
    const ok = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        res.resume();
        resolve(res.statusCode && res.statusCode < 500);
      });
      req.on("error", () => resolve(false));
      req.setTimeout(1000, () => {
        req.destroy();
        resolve(false);
      });
    });
    if (ok) return;
    await wait(250);
  }
  throw new Error(`Server did not become ready at ${url}`);
}

async function main() {
  const distDir = path.resolve("dist");
  const tmpRoot = await mkdtemp(path.join(tmpdir(), "linkinator-root-"));
  const mappedRoot = path.join(tmpRoot, SITE_BASE);

  let server;
  try {
    await symlink(distDir, mappedRoot, "dir");

    server = spawn(
      "python3",
      ["-m", "http.server", String(PORT), "--bind", HOST, "--directory", tmpRoot],
      { stdio: "ignore" }
    );

    await waitForServer(`http://${HOST}:${PORT}/${SITE_BASE}/`);

    const target = `http://${HOST}:${PORT}/${SITE_BASE}`;
    const args = [
      "exec",
      "linkinator",
      target,
      "--recurse",
      "--config",
      ".linkinatorrc",
      "--format",
      "json",
    ];
    const result = spawnSync("pnpm", args, { encoding: "utf8" });

    if (result.error) throw result.error;
    if (result.status === null) throw new Error("linkinator did not return an exit code");

    const raw = result.stdout.trim();
    if (!raw) {
      console.error("[check-urls] Linkinator produced no JSON output.");
      process.exit(1);
    }

    let payload;
    try {
      payload = JSON.parse(raw);
    } catch {
      console.error("[check-urls] Failed to parse Linkinator JSON output.");
      console.error(result.stdout);
      console.error(result.stderr);
      process.exit(1);
    }

    const links = Array.isArray(payload.links) ? payload.links : [];
    if (links.length === 0) {
      console.error("[check-urls] Linkinator scanned 0 links. Failing to avoid silent passes.");
      process.exit(1);
    }

    const broken = links.filter(
      (item) => item?.state === "BROKEN" || (typeof item?.status === "number" && item.status >= 400)
    );

    if (result.status !== 0 || broken.length > 0 || payload.passed === false) {
      console.error(
        `[check-urls] Broken URLs detected. scanned=${links.length} broken=${broken.length}`
      );
      const sample = broken.slice(0, 10).map((item) => item.url).filter(Boolean);
      if (sample.length > 0) {
        console.error("[check-urls] Sample broken URLs:");
        for (const url of sample) console.error(`- ${url}`);
      }
      process.exit(1);
    }

    console.log(`[check-urls] OK. scanned=${links.length} broken=0`);
  } finally {
    if (server && !server.killed) {
      server.kill("SIGTERM");
      await wait(100);
      if (!server.killed) server.kill("SIGKILL");
    }
    await rm(tmpRoot, { recursive: true, force: true });
  }
}

main().catch(async (error) => {
  console.error(`[check-urls] FAIL: ${error.message}`);
  process.exit(1);
});
