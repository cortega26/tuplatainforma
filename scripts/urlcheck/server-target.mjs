import { mkdir, mkdtemp, rm, symlink } from "node:fs/promises";
import { spawn } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import http from "node:http";
import { HOST, SITE_BASE } from "./constants.mjs";

export async function startServerTarget({ mode }) {
  const port = Number(process.env.URLCHECK_PORT || (4300 + Math.floor(Math.random() * 200)));
  const tmpRoot = await mkdtemp(path.join(tmpdir(), `urlcheck-${mode}-`));
  const normalizedBase = SITE_BASE.replace(/^\/+|\/+$/g, "");
  const sourceDir = mode === "canary"
    ? path.resolve("scripts/urlcheck/fixtures/site/monedario")
    : path.resolve("dist");
  const serverRoot = normalizedBase ? tmpRoot : sourceDir;

  if (normalizedBase) {
    const targetDir = path.join(tmpRoot, normalizedBase);
    await mkdir(path.dirname(targetDir), { recursive: true });
    await symlink(sourceDir, targetDir, "dir");
  }

  const server = spawn(
    "python3",
    ["-m", "http.server", String(port), "--bind", HOST, "--directory", serverRoot],
    { stdio: "ignore" }
  );

  const targetUrl = normalizedBase
    ? `http://${HOST}:${port}/${normalizedBase}`
    : `http://${HOST}:${port}`;
  await waitForServer(`${targetUrl}/`);

  return {
    targetUrl,
    internalOrigins: new Set([`http://${HOST}:${port}`]),
    contentRoot: sourceDir,
    siteBase: normalizedBase,
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
