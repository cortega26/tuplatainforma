#!/usr/bin/env node
import fs from "node:fs/promises";
import path from "node:path";
import { chromium } from "playwright";
import sharp from "sharp";
import {
  DOWNLOADS_DIR,
  POOL_ASSETS_DIR,
  POOL_MANIFEST_PATH,
  POOL_RUN_STATE_PATH,
  ensureDirectory,
  parseArgs,
  readJson,
  sha256Hex,
  toRepoRelative,
  writeJson,
} from "./lib.mjs";
import { buildPoolGenerationQueue } from "./pool-lib.mjs";
import { stagePoolImages } from "./stage-pool-images.mjs";

const DEFAULT_CDP_URL = process.env.CHROME_CDP_URL || "http://127.0.0.1:9222";
const DEFAULT_CHATGPT_IMAGES_URL = process.env.CHATGPT_IMAGES_URL || "https://chatgpt.com/images";
const DEFAULT_TIMEOUT_MS = Number.parseInt(process.env.CHATGPT_IMAGE_TIMEOUT_MS || "180000", 10);
const DEFAULT_DELAY_MS = Number.parseInt(process.env.CHATGPT_IMAGE_DELAY_MS || "2500", 10);
const DEFAULT_MAX_FAILURES = Number.parseInt(process.env.CHATGPT_IMAGE_MAX_FAILURES || "5", 10);
const DEFAULT_MAX_ATTEMPTS_PER_ITEM = Number.parseInt(
  process.env.CHATGPT_IMAGE_MAX_ATTEMPTS_PER_ITEM || "3",
  10
);
const DEFAULT_RETRY_BASE_DELAY_MS = Number.parseInt(
  process.env.CHATGPT_IMAGE_RETRY_BASE_DELAY_MS || "8000",
  10
);
const DEFAULT_RETRY_MAX_DELAY_MS = Number.parseInt(
  process.env.CHATGPT_IMAGE_RETRY_MAX_DELAY_MS || "120000",
  10
);
const DEFAULT_BACKOFF_FACTOR = Number.parseFloat(process.env.CHATGPT_IMAGE_BACKOFF_FACTOR || "2");
const DEFAULT_JITTER_MS = Number.parseInt(process.env.CHATGPT_IMAGE_BACKOFF_JITTER_MS || "1200", 10);
const DEFAULT_OUTPUT_FORMAT = (process.env.CHATGPT_IMAGE_OUTPUT_FORMAT || "avif").toLowerCase();
const RATE_LIMIT_POLL_MS = 1500;

const EXT_BY_MIME = new Map([
  ["image/png", ".png"],
  ["image/jpeg", ".jpg"],
  ["image/webp", ".webp"],
  ["image/avif", ".avif"],
]);

function inferExtension(mime = "") {
  return EXT_BY_MIME.get(String(mime).toLowerCase()) || ".png";
}

function runItemKey(poolId, variantNumber) {
  return `${poolId}::v${variantNumber}`;
}

function sleep(ms) {
  if (!Number.isFinite(ms) || ms <= 0) return Promise.resolve();
  return new Promise(resolve => {
    setTimeout(resolve, ms);
  });
}

async function fileCount(dirPath) {
  try {
    const entries = await fs.readdir(dirPath);
    return entries.filter(item => /\.[a-z0-9]+$/i.test(item)).length;
  } catch {
    return 0;
  }
}

async function fileExists(filePath) {
  try {
    const stat = await fs.stat(filePath);
    return stat.isFile();
  } catch {
    return false;
  }
}

function normalizeOutputFormat(value = DEFAULT_OUTPUT_FORMAT) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase();
  return normalized === "source" ? "source" : "avif";
}

function manifestFingerprint(manifest) {
  const summary = {
    count: manifest?.count ?? 0,
    entries: (Array.isArray(manifest?.entries) ? manifest.entries : []).map(entry => ({
      poolId: entry.poolId,
      promptHash: entry.promptHash,
      variants: entry.variants,
    })),
  };
  return sha256Hex(JSON.stringify(summary));
}

async function readRunState(runStatePath) {
  try {
    return await readJson(runStatePath);
  } catch {
    return null;
  }
}

function createRunState(manifest, assetsDir, outputFormat) {
  const now = new Date().toISOString();
  return {
    schemaVersion: 1,
    createdAt: now,
    updatedAt: now,
    assetsDir: toRepoRelative(assetsDir),
    outputFormat,
    manifest: {
      path: toRepoRelative(POOL_MANIFEST_PATH),
      generatedAt: manifest.generatedAt,
      count: manifest.count,
      fingerprint: manifestFingerprint(manifest),
    },
    completedCount: 0,
    failedCount: 0,
    lastSuccessful: null,
    items: {},
  };
}

async function loadOrCreateRunState(runStatePath, manifest, assetsDir, outputFormat, resetState) {
  if (!resetState) {
    const current = await readRunState(runStatePath);
    const expectedFingerprint = manifestFingerprint(manifest);
    if (
      current &&
      current.manifest?.fingerprint === expectedFingerprint &&
      current.assetsDir === toRepoRelative(assetsDir) &&
      current.outputFormat === outputFormat
    ) {
      return current;
    }
  }

  const freshState = createRunState(manifest, assetsDir, outputFormat);
  await writeJson(runStatePath, freshState);
  return freshState;
}

async function persistRunState(runStatePath, state) {
  state.updatedAt = new Date().toISOString();
  await writeJson(runStatePath, state);
}

async function reconcileCompletedKeysWithFiles(state, assetsDir) {
  const completed = new Set();
  const items = state?.items ?? {};
  let changed = false;

  for (const [key, item] of Object.entries(items)) {
    if (item?.status !== "completed" || typeof item.filePath !== "string") continue;
    const absolutePath = path.isAbsolute(item.filePath)
      ? item.filePath
      : path.join(process.cwd(), item.filePath);

    if (await fileExists(absolutePath)) {
      completed.add(key);
      continue;
    }

    items[key] = {
      ...item,
      status: "pending",
      lastError: `Expected generated file missing from ${toRepoRelative(assetsDir)}; requeued.`,
      updatedAt: new Date().toISOString(),
    };
    changed = true;
  }

  if (changed) {
    state.completedCount = Object.values(items).filter(item => item?.status === "completed").length;
  }

  return { completed, changed };
}

function updateRunStateItem(state, key, patch) {
  const current = state.items[key] ?? {};
  state.items[key] = {
    ...current,
    ...patch,
    updatedAt: new Date().toISOString(),
  };
  state.completedCount = Object.values(state.items).filter(item => item?.status === "completed").length;
  state.failedCount = Object.values(state.items).filter(item => item?.status === "failed").length;
}

function computeBackoffDelayMs(attemptNumber, baseDelayMs, maxDelayMs, factor, jitterMs) {
  const exponential = Math.min(maxDelayMs, Math.round(baseDelayMs * factor ** Math.max(0, attemptNumber - 1)));
  const jitter = jitterMs > 0 ? Math.floor(Math.random() * (jitterMs + 1)) : 0;
  return exponential + jitter;
}

function msUntil(isoString) {
  if (typeof isoString !== "string" || !isoString.trim()) return 0;
  const target = Date.parse(isoString);
  if (!Number.isFinite(target)) return 0;
  return Math.max(0, target - Date.now());
}

class RateLimitError extends Error {
  constructor(message, waitMs) {
    super(message);
    this.name = "RateLimitError";
    this.waitMs = waitMs;
  }
}

async function connectToBrowser(cdpUrl) {
  try {
    return await chromium.connectOverCDP(cdpUrl);
  } catch (error) {
    const message = error instanceof Error ? error.message : String(error);
    throw new Error(
      `Could not attach to Chrome at ${cdpUrl}. Start Chrome with remote debugging enabled and the logged-in ChatGPT session open. Under Linux this usually means launching Chrome with --remote-debugging-port=9222. Original error: ${message}`
    );
  }
}

async function getWorkPage(browser, targetUrl) {
  const contexts = browser.contexts();
  if (contexts.length === 0) {
    throw new Error("The attached browser has no contexts. Open Chrome normally and sign in first.");
  }

  const context = contexts[0];
  const existingPage = context.pages().find(page => page.url().includes("chatgpt.com"));
  const page = existingPage ?? (await context.newPage());

  if (!page.url().includes("chatgpt.com")) {
    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  } else if (!page.url().includes("/images")) {
    await page.goto(targetUrl, { waitUntil: "domcontentloaded" });
  }

  return page;
}

async function assertLoggedIn(page) {
  const loginSignals = [
    page.getByRole("button", { name: /inicia sesi[oó]n|iniciar sesi[oó]n|log in|sign in/i }).first(),
    page.locator("[data-testid='login-button']").first(),
    page.locator("text=/create images and upload files|crear imágenes y cargar archivos/i").first(),
  ];

  for (const locator of loginSignals) {
    if ((await locator.count()) === 0) continue;
    if (await locator.isVisible().catch(() => false)) {
      throw new Error(
        "The attached Chrome session is not logged in to ChatGPT Images. Open the same Chrome instance, sign in at https://chatgpt.com/images, confirm you can type into the generator UI manually, and then rerun this script."
      );
    }
  }
}

async function findPromptInput(page) {
  const candidates = [
    { selector: "#prompt-textarea[contenteditable='true']", kind: "contenteditable" },
    { selector: "[contenteditable='true'][role='textbox']", kind: "contenteditable" },
    { selector: "div.ProseMirror[contenteditable='true']", kind: "contenteditable" },
  ];

  const startedAt = Date.now();
  const maxWaitMs = 15000;

  while (Date.now() - startedAt < maxWaitMs) {
    for (const candidate of candidates) {
      const locator = page.locator(candidate.selector).first();
      if ((await locator.count()) === 0) continue;
      if (!(await locator.isVisible().catch(() => false))) continue;
      return { locator, kind: candidate.kind };
    }
    await sleep(250);
  }

  throw new Error(
    "Could not locate the visible ChatGPT image prompt editor. The page layout may have changed, the prior generation may still be running, or the session may not be logged in."
  );
}

async function writePrompt(input, prompt) {
  await input.locator.click();
  if (input.kind === "contenteditable") {
    await input.locator.fill("");
    await input.locator.fill(prompt);
    return;
  }

  await input.locator.fill("");
  await input.locator.fill(prompt);
}

async function captureImageCandidates(page) {
  return page.evaluate(() =>
    Array.from(document.images)
      .map((img, index) => ({
        index,
        src: img.currentSrc || img.src || "",
        width: img.naturalWidth || 0,
        height: img.naturalHeight || 0,
      }))
      .filter(item => item.src && item.width >= 256 && item.height >= 256)
  );
}

async function clickGenerate(page) {
  const selectorCandidates = [
    "button[data-testid='send-button']",
    "button[aria-label*='Send']",
    "button[aria-label*='Enviar']",
    "button[aria-label*='Create']",
    "button[aria-label*='Generar']",
  ];

  for (const selector of selectorCandidates) {
    const locator = page.locator(selector).first();
    if ((await locator.count()) === 0) continue;
    if (!(await locator.isVisible().catch(() => false))) continue;
    if (!(await locator.isEnabled().catch(() => false))) continue;
    await locator.click();
    return;
  }

  await page.keyboard.press("Enter");
}

function parseRateLimitWaitMs(text) {
  const patterns = [
    /wait(?: for)?\s+(\d+)\s*minutes?/i,
    /espera(?:r)?\s+(\d+)\s*minutos?/i,
  ];

  for (const pattern of patterns) {
    const match = text.match(pattern);
    if (!match) continue;
    const minutes = Number.parseInt(match[1] ?? "0", 10);
    if (Number.isFinite(minutes) && minutes > 0) {
      return minutes * 60_000;
    }
  }

  return 5 * 60_000;
}

async function detectRateLimitNotice(page) {
  const text = await page
    .locator("body")
    .innerText()
    .catch(() => "");

  if (!text) return null;

  const normalized = text.replace(/\s+/g, " ").trim();
  const patterns = [
    /you're generating images too quickly/i,
    /rate limits in place/i,
    /generando im[aá]genes demasiado r[aá]pido/i,
    /l[ií]mites de velocidad/i,
  ];

  if (!patterns.some(pattern => pattern.test(normalized))) {
    return null;
  }

  const waitMs = parseRateLimitWaitMs(normalized);
  return {
    message: `ChatGPT Images rate limit detected. Waiting ${Math.ceil(waitMs / 60000)} minute(s) before retrying.`,
    waitMs,
    notice: normalized,
  };
}

async function waitForNewImage(page, seenSources, timeoutMs) {
  const deadline = Date.now() + timeoutMs;

  while (Date.now() < deadline) {
    const rateLimit = await detectRateLimitNotice(page);
    if (rateLimit) {
      throw new RateLimitError(rateLimit.message, rateLimit.waitMs);
    }

    const fresh = (await captureImageCandidates(page)).filter(item => !seenSources.includes(item.src));
    if (fresh.length > 0) {
      return fresh[fresh.length - 1];
    }

    await sleep(RATE_LIMIT_POLL_MS);
  }

  throw new Error(`No generated image detected before timeout (${timeoutMs}ms).`);
}

async function readImageBytes(page, src) {
  const payload = await page.evaluate(async imageSrc => {
    const response = await fetch(imageSrc);
    if (!response.ok) {
      throw new Error(`Failed to fetch generated image: ${response.status}`);
    }

    const blob = await response.blob();
    const bytes = new Uint8Array(await blob.arrayBuffer());

    return {
      bytes: Array.from(bytes),
      mime: blob.type || response.headers.get("content-type") || "image/png",
    };
  }, src);

  return {
    base64: Buffer.from(payload.bytes).toString("base64"),
    mime: payload.mime,
  };
}

async function normalizeImageOutput(bytes, mime, outputFormat) {
  if (outputFormat === "source") {
    return {
      bytes,
      mime,
      ext: inferExtension(mime),
    };
  }

  const buffer = await sharp(bytes).avif({ effort: 6, quality: 64 }).toBuffer();
  return {
    bytes: buffer,
    mime: "image/avif",
    ext: ".avif",
  };
}

async function generateVariant(page, entry, variantNumber, timeoutMs, assetsDir, outputFormat) {
  const input = await findPromptInput(page);
  const before = await captureImageCandidates(page);
  const seenSources = before.map(item => item.src);

  await writePrompt(input, entry.prompt);
  await clickGenerate(page);

  const image = await waitForNewImage(page, seenSources, timeoutMs);
  if (!image?.src) {
    throw new Error(`No generated image detected for ${entry.poolId}.`);
  }

  const payload = await readImageBytes(page, image.src);
  const sourceBytes = Buffer.from(payload.base64, "base64");
  const normalized = await normalizeImageOutput(sourceBytes, payload.mime, outputFormat);
  const assetDir = path.join(assetsDir, entry.poolId);
  await ensureDirectory(assetDir);

  const filePath = path.join(assetDir, `${entry.poolId}--v${variantNumber}${normalized.ext}`);
  await fs.writeFile(filePath, normalized.bytes);

  console.log(
    `- ${entry.poolId}: saved ${toRepoRelative(filePath)} (${normalized.bytes.length} bytes, ${normalized.mime})`
  );

  return {
    filePath,
    bytes: normalized.bytes.length,
    mime: normalized.mime,
    ext: normalized.ext,
  };
}

async function main() {
  const args = parseArgs(process.argv.slice(2));
  const cdpUrl = args.get("--cdp-url", DEFAULT_CDP_URL);
  const targetUrl = args.get("--url", DEFAULT_CHATGPT_IMAGES_URL);
  const timeoutMs = Number.parseInt(args.get("--timeout-ms", String(DEFAULT_TIMEOUT_MS)), 10);
  const delayMs = Number.parseInt(args.get("--delay-ms", String(DEFAULT_DELAY_MS)), 10);
  const maxFailures = Number.parseInt(args.get("--max-failures", String(DEFAULT_MAX_FAILURES)), 10);
  const maxAttemptsPerItem = Number.parseInt(
    args.get("--max-attempts-per-item", String(DEFAULT_MAX_ATTEMPTS_PER_ITEM)),
    10
  );
  const retryBaseDelayMs = Number.parseInt(
    args.get("--retry-base-delay-ms", String(DEFAULT_RETRY_BASE_DELAY_MS)),
    10
  );
  const retryMaxDelayMs = Number.parseInt(
    args.get("--retry-max-delay-ms", String(DEFAULT_RETRY_MAX_DELAY_MS)),
    10
  );
  const backoffFactor = Number.parseFloat(args.get("--backoff-factor", String(DEFAULT_BACKOFF_FACTOR)));
  const jitterMs = Number.parseInt(args.get("--jitter-ms", String(DEFAULT_JITTER_MS)), 10);
  const poolIdFilter = args.get("--pool-id", "").trim();
  const assetsDir = args.get("--assets-dir", "").trim() || POOL_ASSETS_DIR;
  const runStatePath = args.get("--run-state-path", "").trim() || POOL_RUN_STATE_PATH;
  const outputFormat = normalizeOutputFormat(args.get("--output-format", DEFAULT_OUTPUT_FORMAT));
  const stageAfter = args.has("--stage-after");
  const stageOutputDir = args.get("--stage-output-dir", "").trim() || DOWNLOADS_DIR;
  const slugFilter = args.get("--slug", "").trim();
  const resetRunState = args.has("--reset-run-state");

  const manifest = await readJson(POOL_MANIFEST_PATH);
  const entries = (Array.isArray(manifest.entries) ? manifest.entries : []).filter(entry =>
    poolIdFilter ? entry.poolId === poolIdFilter : true
  );
  const runState = await loadOrCreateRunState(runStatePath, manifest, assetsDir, outputFormat, resetRunState);
  const { completed, changed: runStateChanged } = await reconcileCompletedKeysWithFiles(runState, assetsDir);
  if (runStateChanged) {
    await persistRunState(runStatePath, runState);
  }

  const existingCounts = new Map();
  for (const entry of entries) {
    const assetDir = path.join(assetsDir, entry.poolId);
    existingCounts.set(entry.poolId, await fileCount(assetDir));
  }

  const work = buildPoolGenerationQueue(entries, existingCounts, {
    completedKeys: completed,
    limit: args.get("--limit", "0"),
    startAt: args.get("--start-at", "0"),
  });

  if (work.length === 0) {
    console.log("[generate-pool-chatgpt] Nothing to generate. Pool is already complete.");
    if (stageAfter) {
      const result = await stagePoolImages({
        slugFilter,
        assetsDir,
        outputDir: stageOutputDir,
      });
      console.log(
        `[generate-pool-chatgpt] Stage-after complete: assignments=${result.assignmentsCount} copied=${result.copied}`
      );
    }
    return;
  }

  const browser = await connectToBrowser(cdpUrl);
  let failures = 0;
  try {
    const page = await getWorkPage(browser, targetUrl);
    await assertLoggedIn(page);
    console.log(`[generate-pool-chatgpt] Attached to Chrome via ${cdpUrl}`);
    console.log(`[generate-pool-chatgpt] Target page: ${page.url()}`);
    console.log(`[generate-pool-chatgpt] Requests planned: ${work.length}`);
    console.log(`[generate-pool-chatgpt] Assets dir: ${toRepoRelative(assetsDir)}`);
    console.log(`[generate-pool-chatgpt] Run state: ${toRepoRelative(runStatePath)}`);
    if (runState.lastSuccessful?.poolId) {
      console.log(
        `[generate-pool-chatgpt] Last successful item: ${runState.lastSuccessful.poolId} v${runState.lastSuccessful.variantNumber}`
      );
    }
    const carryOverRateLimitMs = msUntil(runState.rateLimitedUntil);
    if (carryOverRateLimitMs > 0) {
      console.log(
        `[generate-pool-chatgpt] Carry-over rate limit in effect. Sleeping ${carryOverRateLimitMs}ms before resuming.`
      );
      await sleep(carryOverRateLimitMs);
    }
    console.log(`[generate-pool-chatgpt] Delay between requests: ${delayMs}ms`);
    console.log(`[generate-pool-chatgpt] Max failures: ${maxFailures}`);
    console.log(`[generate-pool-chatgpt] Max attempts per item: ${maxAttemptsPerItem}`);
    console.log(
      `[generate-pool-chatgpt] Retry backoff: base=${retryBaseDelayMs}ms max=${retryMaxDelayMs}ms factor=${backoffFactor} jitter=${jitterMs}ms`
    );
    console.log(`[generate-pool-chatgpt] Output format: ${outputFormat}`);

    for (const item of work) {
      const key = runItemKey(item.entry.poolId, item.variantNumber);
      updateRunStateItem(runState, key, {
        poolId: item.entry.poolId,
        variantNumber: item.variantNumber,
        status: "in_progress",
      });
      await persistRunState(runStatePath, runState);
      console.log(
        `[generate-pool-chatgpt] Generating ${item.entry.poolId} variant ${item.variantNumber}/${item.entry.variants}`
      );
      let itemCompleted = false;
      let lastFailureMessage = "";

      let attemptNumber = 0;
      while (attemptNumber < maxAttemptsPerItem) {
        try {
          attemptNumber += 1;
          const result = await generateVariant(
            page,
            item.entry,
            item.variantNumber,
            timeoutMs,
            assetsDir,
            outputFormat
          );
          failures = 0;
          itemCompleted = true;
          updateRunStateItem(runState, key, {
            poolId: item.entry.poolId,
            variantNumber: item.variantNumber,
            status: "completed",
            attempts: attemptNumber,
            filePath: result.filePath,
            bytes: result.bytes,
            mime: result.mime,
            ext: result.ext,
            completedAt: new Date().toISOString(),
            lastError: null,
          });
          runState.rateLimitedUntil = null;
          runState.lastSuccessful = {
            poolId: item.entry.poolId,
            variantNumber: item.variantNumber,
            key,
            filePath: toRepoRelative(result.filePath),
            completedAt: new Date().toISOString(),
          };
          await persistRunState(runStatePath, runState);
          break;
        } catch (error) {
          if (error instanceof RateLimitError) {
            const rateLimitedUntil = new Date(Date.now() + error.waitMs).toISOString();
            updateRunStateItem(runState, key, {
              poolId: item.entry.poolId,
              variantNumber: item.variantNumber,
              status: "rate_limited",
              attempts: attemptNumber,
              lastError: error.message,
              rateLimitedUntil,
            });
            runState.rateLimitedUntil = rateLimitedUntil;
            await persistRunState(runStatePath, runState);
            console.error(
              `[generate-pool-chatgpt] RATE LIMITED on ${item.entry.poolId} variant ${item.variantNumber}: ${error.message}`
            );
            attemptNumber -= 1;
            await sleep(error.waitMs);
            continue;
          }

          lastFailureMessage = error instanceof Error ? error.message : String(error);
          updateRunStateItem(runState, key, {
            poolId: item.entry.poolId,
            variantNumber: item.variantNumber,
            status: "retrying",
            attempts: attemptNumber,
            lastError: lastFailureMessage,
          });
          await persistRunState(runStatePath, runState);

          console.error(
            `[generate-pool-chatgpt] FAILED ${item.entry.poolId} variant ${item.variantNumber} attempt ${attemptNumber}/${maxAttemptsPerItem}: ${lastFailureMessage}`
          );

          if (attemptNumber < maxAttemptsPerItem) {
            const backoffMs = computeBackoffDelayMs(
              attemptNumber,
              retryBaseDelayMs,
              retryMaxDelayMs,
              backoffFactor,
              jitterMs
            );
            console.log(
              `[generate-pool-chatgpt] Retrying ${item.entry.poolId} variant ${item.variantNumber} in ${backoffMs}ms`
            );
            await sleep(backoffMs);
          }
        }
      }

      if (!itemCompleted) {
        failures += 1;
        updateRunStateItem(runState, key, {
          poolId: item.entry.poolId,
          variantNumber: item.variantNumber,
          status: "failed",
          attempts: maxAttemptsPerItem,
          lastError: lastFailureMessage,
        });
        await persistRunState(runStatePath, runState);

        if (failures >= maxFailures) {
          throw new Error(
            `Stopping after ${failures} consecutive failed items. Last failure: ${lastFailureMessage}`
          );
        }
      }

      await sleep(delayMs);
    }
  } finally {
    await browser.close();
  }

  if (stageAfter) {
    const result = await stagePoolImages({
      slugFilter,
      assetsDir,
      outputDir: stageOutputDir,
    });
    console.log(
      `[generate-pool-chatgpt] Stage-after complete: assignments=${result.assignmentsCount} copied=${result.copied}`
    );
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});
