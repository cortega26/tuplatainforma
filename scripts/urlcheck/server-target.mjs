import { mkdtemp, rm, symlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import http from "node:http";
import { HOST, SITE_BASE } from "./constants.mjs";

export async function startServerTarget({ mode }) {
  const port = Number(process.env.URLCHECK_PORT || (4300 + Math.floor(Math.random() * 200)));
  const tmpRoot = await mkdtemp(path.join(tmpdir(), `urlcheck-${mode}-`));
  const targetDir = path.join(tmpRoot, SITE_BASE);
  const sourceDir = mode === "canary"
    ? path.resolve("scripts/urlcheck/fixtures/site/tuplatainforma")
    : path.resolve("dist");

  await symlink(sourceDir, targetDir, "dir");

  const server = spawn(
    "python3",
    ["-m", "http.server", String(port), "--bind", HOST, "--directory", tmpRoot],
    { stdio: "ignore" }
  );

  const targetUrl = `http://${HOST}:${port}/${SITE_BASE}`;
  await waitForServer(`${targetUrl}/`);

  return {
    targetUrl,
    internalOrigins: new Set([`http://${HOST}:${port}`]),
    contentRoot: sourceDir,
    siteBase: SITE_BASE,
    async stop() {
      if (!server.killed) {
        server.kill("SIGTERM");
        await wait(120);
        if (!server.killed) server.kill("SIGKILL");
      }
      await rm(tmpRoot, { recursive: true, force: true });
    },
  };
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function waitForServer(url, attempts = 40) {
  for (let i = 0; i < attempts; i += 1) {
    const ok = await new Promise((resolve) => {
      const req = http.get(url, (res) => {
        res.resume();
        const status = res.statusCode || 0;
        resolve(status >= 200 && status < 400);
      });
      req.on("error", () => resolve(false));
      req.setTimeout(1000, () => {
        req.destroy();
        resolve(false);
      });
    });

    if (ok) return;
    await wait(200);
  }

  throw new Error(`server_not_ready:${url}`);
}
