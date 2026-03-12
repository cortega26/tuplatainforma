import { mkdtempSync, mkdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { spawnSync } from "node:child_process";
import { tmpdir } from "node:os";
import path from "node:path";
import { afterEach, describe, expect, it } from "vitest";

const SCRIPT_PATH = path.resolve("scripts/build-weekly-search-report.mjs");
const tempRoots: string[] = [];

function createTempRoot() {
  const root = mkdtempSync(path.join(tmpdir(), "tpi-weekly-search-"));
  tempRoots.push(root);
  return root;
}

function runScript(args: string[]) {
  return spawnSync("node", [SCRIPT_PATH, ...args], {
    encoding: "utf8",
  });
}

afterEach(() => {
  for (const root of tempRoots.splice(0)) {
    rmSync(root, { recursive: true, force: true });
  }
});

describe("build-weekly-search-report script", () => {
  it("initializes a weekly input bundle", () => {
    const root = createTempRoot();
    const inputDir = path.join(root, "2026-W11");

    const result = runScript(["--input", inputDir, "--init"]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Initialized input bundle");
    expect(readFileSync(path.join(inputDir, "README.md"), "utf8")).toContain(
      "gsc-pages.csv"
    );
    expect(
      JSON.parse(
        readFileSync(path.join(inputDir, "indexation-summary.json"), "utf8")
      ).weekLabel
    ).toBe("2026-W11");
  });

  it("builds a scorecard with winners, losers, refresh cues, and linking actions", () => {
    const root = createTempRoot();
    const inputDir = path.join(root, "2026-W11");
    mkdirSync(inputDir, { recursive: true });

    const watchlistPath = path.join(root, "watchlist.json");
    writeFileSync(
      watchlistPath,
      JSON.stringify(
        {
          site: "monedario.cl",
          pages: [
            {
              path: "/posts/winner/",
              label: "Winner owner",
              cluster: "alpha",
              role: "owner",
              queryThemes: ["winner query"],
              nextStepPaths: ["/calculadoras/winner/"],
            },
            {
              path: "/posts/loser/",
              label: "Loser owner",
              cluster: "beta",
              role: "owner",
              queryThemes: ["loser query"],
              nextStepPaths: ["/calculadoras/loser/"],
            },
            {
              path: "/calculadoras/tool/",
              label: "Tool page",
              cluster: "gamma",
              role: "tool",
              queryThemes: ["tool query"],
              nextStepPaths: ["/posts/tool-guide/"],
            },
          ],
        },
        null,
        2
      )
    );

    writeFileSync(
      path.join(inputDir, "gsc-pages.csv"),
      [
        "Top pages,Clicks,Clicks Difference,Impressions,Impressions Difference,CTR,CTR Difference,Position,Position Difference",
        "https://monedario.cl/posts/winner/,40,20,500,120,8.0%,1.0%,3.2,-0.8",
        "https://monedario.cl/posts/loser/,15,-12,450,80,2.0%,-1.1%,8.2,1.4",
        "https://monedario.cl/calculadoras/tool/,60,3,120,20,10.0%,0.2%,2.8,-0.1",
      ].join("\n"),
      "utf8"
    );

    writeFileSync(
      path.join(inputDir, "gsc-queries.csv"),
      [
        "Top queries,Clicks,Clicks Difference,Impressions,Impressions Difference,CTR,CTR Difference,Position,Position Difference",
        "winner query chile,35,18,300,90,11.0%,1.3%,3.5,-0.5",
        "loser query chile,40,10,500,150,3.0%,0.1%,7.0,-0.4",
        "tool query chile,30,12,220,60,13.0%,2.0%,2.6,-0.2",
      ].join("\n"),
      "utf8"
    );

    writeFileSync(
      path.join(inputDir, "analytics-events.csv"),
      [
        "page_path,event_name,event_count,event_count_previous",
        "/posts/winner/,cta_click,4,9",
        "/posts/loser/,cta_click,2,3",
        "/calculadoras/tool/,calculator_start,20,18",
        "/calculadoras/tool/,calculator_complete,4,5",
      ].join("\n"),
      "utf8"
    );

    writeFileSync(
      path.join(inputDir, "indexation-summary.json"),
      JSON.stringify(
        {
          weekLabel: "2026-W11",
          dateRange: {
            currentStart: "2026-03-09",
            currentEnd: "2026-03-15",
            previousStart: "2026-03-02",
            previousEnd: "2026-03-08",
          },
          google: {
            sitemapStatus: "processing",
            coverageNotes: "Google still processing indexation.",
            alerts: ["Sitemap still pending read."],
            manualActions: "none",
            enhancementIssues: [],
          },
          bing: {
            sitemapStatus: "processing",
            coverageNotes: "Bing still processing sitemap.",
            alerts: [],
          },
          notes: ["Keep focus on refresh before new content."],
        },
        null,
        2
      ),
      "utf8"
    );

    const markdownOut = path.join(inputDir, "scorecard.md");
    const jsonOut = path.join(inputDir, "scorecard.json");
    const result = runScript([
      "--input",
      inputDir,
      "--watchlist",
      watchlistPath,
      "--out",
      markdownOut,
      "--json-out",
      jsonOut,
    ]);

    expect(result.status).toBe(0);
    expect(result.stdout).toContain("Scorecard written");

    const markdown = readFileSync(markdownOut, "utf8");
    expect(markdown).toContain("Strategic Watchlist");
    expect(markdown).toContain("winner");
    expect(markdown).toContain("loser");
    expect(markdown).toContain("La demanda del query set sube, pero la landing cae");
    expect(markdown).toContain("Completion rate 20.0%");
    expect(markdown).toContain("El tráfico sube, pero los CTA no acompañan");

    const json = JSON.parse(readFileSync(jsonOut, "utf8"));
    expect(json.totals.trackedWinnerCount).toBe(1);
    expect(json.totals.trackedLoserCount).toBe(1);
    expect(json.totals.trackedActionCount).toBe(1);
  });
});
