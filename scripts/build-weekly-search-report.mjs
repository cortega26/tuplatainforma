import { mkdirSync, readFileSync, writeFileSync, existsSync } from "node:fs";
import path from "node:path";

const DEFAULT_WATCHLIST_PATH = path.resolve(
  "docs/operations/runbooks/weekly-search-performance-watchlist.json"
);

function parseArgs(argv) {
  const options = {
    inputDir: null,
    outputFile: null,
    jsonFile: null,
    watchlistFile: DEFAULT_WATCHLIST_PATH,
    init: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const arg = argv[index];
    if (arg === "--input") {
      options.inputDir = argv[++index] ?? null;
      continue;
    }
    if (arg === "--out") {
      options.outputFile = argv[++index] ?? null;
      continue;
    }
    if (arg === "--json-out") {
      options.jsonFile = argv[++index] ?? null;
      continue;
    }
    if (arg === "--watchlist") {
      options.watchlistFile = argv[++index] ?? DEFAULT_WATCHLIST_PATH;
      continue;
    }
    if (arg === "--init") {
      options.init = true;
      continue;
    }
    if (arg === "--help" || arg === "-h") {
      printUsage(0);
    }

    printUsage(1, `Unknown argument: ${arg}`);
  }

  if (!options.inputDir) {
    printUsage(1, "Missing required argument: --input <directory>");
  }

  if (!options.outputFile) {
    options.outputFile = path.join(
      options.inputDir,
      "weekly-search-scorecard.md"
    );
  }

  if (!options.jsonFile) {
    options.jsonFile = path.join(
      options.inputDir,
      "weekly-search-scorecard.json"
    );
  }

  return options;
}

function printUsage(code, errorMessage) {
  if (errorMessage) {
    console.error(`[weekly-search-report] ${errorMessage}`);
  }
  console.log(`Usage:
  node scripts/build-weekly-search-report.mjs --input <directory> [--out <file>] [--json-out <file>] [--watchlist <file>] [--init]

Input directory files:
  - gsc-pages.csv
  - gsc-queries.csv
  - analytics-events.csv (optional)
  - indexation-summary.json
`);
  process.exit(code);
}

function ensureDirectory(dirPath) {
  mkdirSync(dirPath, { recursive: true });
}

function writeTemplateFile(filePath, content) {
  if (existsSync(filePath)) {
    return;
  }
  writeFileSync(filePath, content, "utf8");
}

function initInputDirectory(inputDir) {
  ensureDirectory(inputDir);

  writeTemplateFile(
    path.join(inputDir, "README.md"),
    `# Weekly Search Reporting Input Bundle

Drop the weekly exports in this folder, then run:

\`\`\`bash
node scripts/build-weekly-search-report.mjs --input ${inputDir}
\`\`\`

Required files:

- \`gsc-pages.csv\`
  - Google Search Console > Search results > Pages
  - Date comparison: last 7 days vs previous 7 days
  - Export with clicks / impressions / CTR / average position deltas
- \`gsc-queries.csv\`
  - Google Search Console > Search results > Queries
  - Same date comparison as pages
- \`indexation-summary.json\`
  - Fill the template with the current Google/Bing sitemap and coverage notes

Optional file:

- \`analytics-events.csv\`
  - GA4 export filtered to the same weekly window
  - Expected columns: \`page_path,event_name,event_count,event_count_previous\`

Notes:

- Keep one folder per week, for example \`output/operations/weekly-search-performance/2026-W11/\`.
- The script supports English or Spanish GSC column headers.
- If analytics export is missing, the scorecard still renders, but CTA/tool signals stay blank.
`,
  );

  writeTemplateFile(
    path.join(inputDir, "indexation-summary.json"),
    JSON.stringify(
      {
        weekLabel: path.basename(inputDir),
        dateRange: {
          currentStart: "2026-03-09",
          currentEnd: "2026-03-15",
          previousStart: "2026-03-02",
          previousEnd: "2026-03-08",
        },
        google: {
          property: "sc-domain:monedario.cl",
          sitemapStatus: "processing",
          indexedPages: null,
          excludedPages: null,
          coverageNotes:
            "Replace this text with what Google Search Console actually shows this week.",
          alerts: [],
          manualActions: "none",
          enhancementIssues: [],
        },
        bing: {
          site: "https://monedario.cl/",
          sitemapStatus: "processing",
          urlsDiscovered: null,
          coverageNotes:
            "Replace this text with what Bing Webmaster actually shows this week.",
          alerts: [],
        },
        notes: [],
      },
      null,
      2
    ) + "\n",
  );

  console.log(
    `[weekly-search-report] Initialized input bundle at ${path.resolve(inputDir)}`
  );
}

function stripBom(value) {
  return value.replace(/^\uFEFF/, "");
}

function parseCsv(text) {
  const source = stripBom(text).replace(/\r\n/g, "\n").replace(/\r/g, "\n");
  const rows = [];
  let current = "";
  let row = [];
  let inQuotes = false;

  for (let index = 0; index < source.length; index += 1) {
    const char = source[index];
    const nextChar = source[index + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        index += 1;
      } else {
        inQuotes = !inQuotes;
      }
      continue;
    }

    if (char === "," && !inQuotes) {
      row.push(current);
      current = "";
      continue;
    }

    if (char === "\n" && !inQuotes) {
      row.push(current);
      rows.push(row);
      row = [];
      current = "";
      continue;
    }

    current += char;
  }

  if (current.length > 0 || row.length > 0) {
    row.push(current);
    rows.push(row);
  }

  const nonEmptyRows = rows.filter(cells =>
    cells.some(cell => cell.trim().length > 0)
  );
  if (nonEmptyRows.length === 0) {
    return [];
  }

  const [headerRow, ...bodyRows] = nonEmptyRows;
  const headers = headerRow.map(cell => cell.trim());

  return bodyRows.map(cells => {
    const record = {};
    headers.forEach((header, index) => {
      record[header] = (cells[index] ?? "").trim();
    });
    return record;
  });
}

function normalizeHeader(value) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function normalizeRecord(record) {
  return Object.fromEntries(
    Object.entries(record).map(([key, value]) => [normalizeHeader(key), value])
  );
}

function firstValue(record, aliases) {
  for (const alias of aliases) {
    const value = record[alias];
    if (value !== undefined && `${value}`.trim() !== "") {
      return `${value}`.trim();
    }
  }
  return "";
}

function parseLocaleNumber(value) {
  if (value === undefined || value === null) return null;
  let text = `${value}`.trim();
  if (!text || text === "-" || /^n\/a$/i.test(text)) return null;

  text = text
    .replace(/\s+/g, "")
    .replace(/\u00A0/g, "")
    .replace(/%$/, "")
    .replace(/^\+/, "");

  const lastComma = text.lastIndexOf(",");
  const lastDot = text.lastIndexOf(".");

  if (lastComma !== -1 && lastDot !== -1) {
    const decimalSeparator = lastComma > lastDot ? "," : ".";
    const thousandSeparator = decimalSeparator === "," ? "." : ",";
    text = text.split(thousandSeparator).join("");
    if (decimalSeparator === ",") {
      text = text.replace(",", ".");
    }
  } else if (lastComma !== -1) {
    const decimalLike = text.length - lastComma - 1 <= 2;
    text = decimalLike ? text.replace(",", ".") : text.replace(/,/g, "");
  } else if (lastDot !== -1) {
    const decimalLike = text.length - lastDot - 1 <= 2;
    text = decimalLike ? text : text.replace(/\./g, "");
  }

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizePathLabel(value) {
  const text = `${value ?? ""}`.trim();
  if (!text) return "";

  try {
    const url = new URL(text);
    return url.pathname.endsWith("/") ? url.pathname : `${url.pathname}/`;
  } catch {
    if (text.startsWith("/")) {
      return text.endsWith("/") ? text : `${text}/`;
    }
    return text;
  }
}

function readSearchCsv(filePath, kind) {
  const content = readFileSync(filePath, "utf8");
  const rows = parseCsv(content).map(normalizeRecord);

  const labelAliases =
    kind === "pages"
      ? [
          "page",
          "pages",
          "top_pages",
          "paginas_principales",
          "pagina",
          "landing_page",
          "url",
        ]
      : ["query", "queries", "top_queries", "consultas_principales", "consulta"];

  return rows
    .map(record => {
      const label = firstValue(record, labelAliases);
      if (!label) return null;

      return {
        label,
        path: kind === "pages" ? normalizePathLabel(label) : null,
        clicks: parseLocaleNumber(firstValue(record, ["clicks", "clics"])) ?? 0,
        clicksDelta:
          parseLocaleNumber(
            firstValue(record, [
              "clicks_difference",
              "click_difference",
              "diferencia_de_clics",
              "delta_clicks",
            ])
          ) ?? 0,
        impressions:
          parseLocaleNumber(firstValue(record, ["impressions", "impresiones"])) ??
          0,
        impressionsDelta:
          parseLocaleNumber(
            firstValue(record, [
              "impressions_difference",
              "impression_difference",
              "diferencia_de_impresiones",
              "delta_impressions",
            ])
          ) ?? 0,
        ctr: parseLocaleNumber(firstValue(record, ["ctr"])) ?? 0,
        ctrDelta:
          parseLocaleNumber(
            firstValue(record, [
              "ctr_difference",
              "diferencia_de_ctr",
              "delta_ctr",
            ])
          ) ?? 0,
        position:
          parseLocaleNumber(
            firstValue(record, ["position", "average_position", "posicion"])
          ) ?? 0,
        positionDelta:
          parseLocaleNumber(
            firstValue(record, [
              "position_difference",
              "average_position_difference",
              "diferencia_de_posicion",
              "delta_position",
            ])
          ) ?? 0,
      };
    })
    .filter(Boolean);
}

function readAnalyticsCsv(filePath) {
  if (!existsSync(filePath)) {
    return {
      pageEvents: new Map(),
      totals: {
        cta_click: { current: 0, previous: 0 },
        calculator_start: { current: 0, previous: 0 },
        calculator_complete: { current: 0, previous: 0 },
      },
      available: false,
    };
  }

  const rows = parseCsv(readFileSync(filePath, "utf8")).map(normalizeRecord);
  const pageEvents = new Map();
  const totals = {
    cta_click: { current: 0, previous: 0 },
    calculator_start: { current: 0, previous: 0 },
    calculator_complete: { current: 0, previous: 0 },
  };

  for (const row of rows) {
    const pagePath = normalizePathLabel(
      firstValue(row, [
        "page_path",
        "page",
        "landing_page",
        "landing_page_query_string",
      ])
    );
    const eventName = firstValue(row, ["event_name", "event"]);
    if (!pagePath || !eventName) continue;

    const current =
      parseLocaleNumber(
        firstValue(row, [
          "event_count",
          "events",
          "event_total",
          "conteo_eventos",
        ])
      ) ?? 0;
    const previous =
      parseLocaleNumber(
        firstValue(row, [
          "event_count_previous",
          "previous_event_count",
          "event_count_prev",
          "conteo_eventos_previos",
        ])
      ) ?? 0;

    const perPage = pageEvents.get(pagePath) ?? {};
    perPage[eventName] = {
      current,
      previous,
    };
    pageEvents.set(pagePath, perPage);

    if (totals[eventName]) {
      totals[eventName].current += current;
      totals[eventName].previous += previous;
    }
  }

  return {
    pageEvents,
    totals,
    available: true,
  };
}

function loadJson(filePath, label) {
  try {
    return JSON.parse(readFileSync(filePath, "utf8"));
  } catch (error) {
    console.error(`[weekly-search-report] Failed to read ${label}: ${error}`);
    process.exit(1);
  }
}

function getDeltaPercent(current, delta) {
  const previous = current - delta;
  if (previous <= 0) {
    return delta > 0 ? 100 : 0;
  }
  return (delta / previous) * 100;
}

function formatSignedNumber(value, digits = 0) {
  const sign = value > 0 ? "+" : "";
  return `${sign}${value.toFixed(digits)}`;
}

function formatMetricPair(current, delta, suffix = "", digits = 0) {
  if (current === null || current === undefined) return "n/d";
  return `${current.toFixed(digits)}${suffix} (${formatSignedNumber(
    delta,
    digits
  )}${suffix})`;
}

function formatPercent(value) {
  if (value === null || value === undefined) return "n/d";
  return `${value.toFixed(1)}%`;
}

function formatPathForMarkdown(value) {
  return value ? `\`${value}\`` : "n/d";
}

function sanitizeMarkdownCell(value) {
  return `${value ?? ""}`.replace(/\|/g, "\\|");
}

function table(headers, rows) {
  const headerLine = `| ${headers.join(" | ")} |`;
  const separatorLine = `| ${headers.map(() => "---").join(" | ")} |`;
  const bodyLines = rows.map(row => {
    const cells = row.map(cell => sanitizeMarkdownCell(cell));
    return `| ${cells.join(" | ")} |`;
  });
  return [headerLine, separatorLine, ...bodyLines].join("\n");
}

function sumMetric(rows, key) {
  return rows.reduce((total, row) => total + (row[key] ?? 0), 0);
}

function aggregateQueryPulse(queryRows, queryThemes) {
  const loweredThemes = (queryThemes ?? []).map(theme => theme.toLowerCase());
  if (loweredThemes.length === 0) {
    return null;
  }

  const matches = queryRows.filter(row =>
    loweredThemes.some(theme => row.label.toLowerCase().includes(theme))
  );
  if (matches.length === 0) {
    return null;
  }

  const impressions = sumMetric(matches, "impressions");
  const clicks = sumMetric(matches, "clicks");
  const impressionsDelta = sumMetric(matches, "impressionsDelta");
  const clicksDelta = sumMetric(matches, "clicksDelta");
  const ctrWeighted =
    impressions > 0
      ? matches.reduce((total, row) => total + row.ctr * row.impressions, 0) /
        impressions
      : 0;
  const positionWeighted =
    impressions > 0
      ? matches.reduce(
          (total, row) => total + row.position * row.impressions,
          0
        ) / impressions
      : 0;

  return {
    queryCount: matches.length,
    clicks,
    clicksDelta,
    impressions,
    impressionsDelta,
    ctr: ctrWeighted,
    position: positionWeighted,
  };
}

function getAnalyticsMetrics(pageEvents, pagePath) {
  const perPage = pageEvents.get(pagePath) ?? {};
  const cta = perPage.cta_click ?? { current: 0, previous: 0 };
  const starts = perPage.calculator_start ?? { current: 0, previous: 0 };
  const completes = perPage.calculator_complete ?? { current: 0, previous: 0 };

  return {
    cta,
    starts,
    completes,
    completionRate:
      starts.current > 0 ? completes.current / starts.current : null,
  };
}

function classifyTrackedPage(entry, pageRow, queryPulse, analyticsMetrics) {
  let status = "steady";
  const reasons = [];
  const actions = [];

  if (!pageRow) {
    status = "watch";
    reasons.push("No apareció en el export de páginas de GSC del rango.");
  }

  if (pageRow) {
    const clickDeltaPct = getDeltaPercent(pageRow.clicks, pageRow.clicksDelta);
    const winner =
      pageRow.clicksDelta >= 10 ||
      clickDeltaPct >= 20 ||
      (pageRow.impressions >= 150 &&
        pageRow.positionDelta <= -0.5 &&
        pageRow.ctrDelta >= 0.3);
    const loser =
      pageRow.clicksDelta <= -10 ||
      clickDeltaPct <= -20 ||
      (pageRow.impressions >= 150 &&
        pageRow.ctrDelta <= -0.7 &&
        pageRow.positionDelta >= 0.5);
    const watch =
      pageRow.impressions >= 150 &&
      ((pageRow.position >= 4 && pageRow.position <= 15) || pageRow.ctr < 3);

    if (loser) {
      status = "loser";
      reasons.push(
        `Clics ${formatSignedNumber(pageRow.clicksDelta)} y CTR ${formatSignedNumber(
          pageRow.ctrDelta,
          1
        )} pp.`
      );
    } else if (winner) {
      status = "winner";
      reasons.push(
        `Clics ${formatSignedNumber(pageRow.clicksDelta)} con posición ${formatSignedNumber(
          -pageRow.positionDelta,
          1
        )} puntos mejor respecto a la semana previa.`
      );
    } else if (watch) {
      status = "watch";
      reasons.push(
        `Impresiones ${pageRow.impressions.toFixed(
          0
        )} con posición ${pageRow.position.toFixed(
          1
        )}; todavía está en zona movible.`
      );
    }

    const refreshNeeded =
      pageRow.impressions >= 150 &&
      pageRow.position >= 4 &&
      pageRow.position <= 15 &&
      pageRow.ctr < 3.5;

    if (refreshNeeded) {
      actions.push({
        type: "refresh",
        text: "Refresh de title/snippet y apertura: hay impresiones con posición 4-15 y CTR débil.",
      });
    }
  }

  if (queryPulse && pageRow && queryPulse.clicksDelta > 0 && pageRow.clicksDelta < 0) {
    if (status === "steady" || status === "watch") {
      status = "action_needed";
    }
    actions.push({
      type: "refresh",
      text: "La demanda del query set sube, pero la landing cae. Revisar intención, snippet y primeras secciones.",
    });
  }

  if (
    entry.role !== "tool" &&
    entry.nextStepPaths?.length &&
    pageRow &&
    pageRow.clicksDelta > 0 &&
    analyticsMetrics.cta.current <= analyticsMetrics.cta.previous
  ) {
    if (status === "steady" || status === "watch") {
      status = "action_needed";
    }
    actions.push({
      type: "internal_linking",
      text: `El tráfico sube, pero los CTA no acompañan. Reforzar enlaces hacia ${entry.nextStepPaths.join(
        ", "
      )}.`,
    });
  }

  if (
    entry.role === "tool" &&
    analyticsMetrics.starts.current >= 10 &&
    analyticsMetrics.completionRate !== null &&
    analyticsMetrics.completionRate < 0.35
  ) {
    if (status === "steady" || status === "watch") {
      status = "action_needed";
    }
    actions.push({
      type: "tool_ux",
      text: `Completion rate ${formatPercent(
        analyticsMetrics.completionRate * 100
      )}. Revisar fricción del formulario o copy del resultado.`,
    });
  }

  if (
    status === "steady" &&
    queryPulse &&
    queryPulse.impressions >= 150 &&
    queryPulse.position >= 4 &&
    queryPulse.position <= 15
  ) {
    status = "watch";
    reasons.push(
      "El query set ya está cerca de primera página completa y merece seguimiento."
    );
  }

  return {
    status,
    reasons,
    actions,
  };
}

function topMovers(rows, key, direction, limit = 5) {
  const sorted = [...rows].sort((left, right) =>
    direction === "desc" ? right[key] - left[key] : left[key] - right[key]
  );
  return sorted.filter(row => (direction === "desc" ? row[key] > 0 : row[key] < 0)).slice(0, limit);
}

function buildIndexationStatus(indexation) {
  const sections = [];

  const googleAlerts = [
    ...(indexation.google?.alerts ?? []),
    ...((indexation.google?.enhancementIssues ?? []).map(
      issue => `Enhancement: ${issue}`
    ) ?? []),
  ];
  if (
    indexation.google?.manualActions &&
    indexation.google.manualActions !== "none"
  ) {
    googleAlerts.push(`Manual action: ${indexation.google.manualActions}`);
  }

  sections.push({
    platform: "Google Search Console",
    status: indexation.google?.sitemapStatus ?? "n/d",
    coverage: indexation.google?.coverageNotes ?? "Sin nota cargada.",
    alerts: googleAlerts,
  });

  sections.push({
    platform: "Bing Webmaster",
    status: indexation.bing?.sitemapStatus ?? "n/d",
    coverage: indexation.bing?.coverageNotes ?? "Sin nota cargada.",
    alerts: indexation.bing?.alerts ?? [],
  });

  return sections;
}

function buildSummary({ watchlist, indexation, pageRows, queryRows, analytics }) {
  const pageByPath = new Map(pageRows.map(row => [row.path, row]));

  const trackedPages = watchlist.pages.map(entry => {
    const pageRow = pageByPath.get(entry.path) ?? null;
    const queryPulse = aggregateQueryPulse(queryRows, entry.queryThemes);
    const analyticsMetrics = getAnalyticsMetrics(analytics.pageEvents, entry.path);
    const decision = classifyTrackedPage(
      entry,
      pageRow,
      queryPulse,
      analyticsMetrics
    );

    return {
      ...entry,
      pageRow,
      queryPulse,
      analyticsMetrics,
      ...decision,
    };
  });

  const topPageWinners = topMovers(pageRows, "clicksDelta", "desc");
  const topPageLosers = topMovers(pageRows, "clicksDelta", "asc");
  const topQueryWinners = topMovers(queryRows, "clicksDelta", "desc");
  const topQueryLosers = topMovers(queryRows, "clicksDelta", "asc");

  const refreshCandidates = trackedPages
    .flatMap(item =>
      item.actions
        .filter(action => action.type === "refresh")
        .map(action => ({ path: item.path, label: item.label, text: action.text }))
    );

  const linkingCandidates = trackedPages
    .flatMap(item =>
      item.actions
        .filter(action => action.type !== "refresh")
        .map(action => ({ path: item.path, label: item.label, text: action.text }))
    );

  const queryQuickWins = queryRows
    .filter(
      row =>
        row.impressions >= 150 &&
        row.position >= 4 &&
        row.position <= 15 &&
        row.ctr < 3.5
    )
    .sort((left, right) => right.impressions - left.impressions)
    .slice(0, 5);

  return {
    generatedAt: new Date().toISOString(),
    site: watchlist.site,
    weekLabel: indexation.weekLabel ?? "weekly-review",
    dateRange: indexation.dateRange ?? null,
    totals: {
      clicks: sumMetric(pageRows, "clicks"),
      clicksDelta: sumMetric(pageRows, "clicksDelta"),
      impressions: sumMetric(pageRows, "impressions"),
      impressionsDelta: sumMetric(pageRows, "impressionsDelta"),
      trackedWinnerCount: trackedPages.filter(item => item.status === "winner")
        .length,
      trackedLoserCount: trackedPages.filter(item => item.status === "loser")
        .length,
      trackedActionCount: trackedPages.filter(
        item => item.status === "action_needed"
      ).length,
    },
    analyticsTotals: analytics.totals,
    trackedPages,
    topPageWinners,
    topPageLosers,
    topQueryWinners,
    topQueryLosers,
    queryQuickWins,
    refreshCandidates,
    linkingCandidates,
    indexationStatus: buildIndexationStatus(indexation),
    notes: indexation.notes ?? [],
    analyticsAvailable: analytics.available,
  };
}

function buildHeadline(summary) {
  const dateLine = summary.dateRange
    ? `${summary.dateRange.currentStart} -> ${summary.dateRange.currentEnd} vs ${summary.dateRange.previousStart} -> ${summary.dateRange.previousEnd}`
    : "Rango no definido en indexation-summary.json";

  return [
    `- Week label: \`${summary.weekLabel}\``,
    `- Date comparison: \`${dateLine}\``,
    `- GSC clicks total: \`${formatMetricPair(
      summary.totals.clicks,
      summary.totals.clicksDelta
    )}\``,
    `- GSC impressions total: \`${formatMetricPair(
      summary.totals.impressions,
      summary.totals.impressionsDelta
    )}\``,
    `- Tracked assets: \`${summary.trackedPages.length}\` (\`${summary.totals.trackedWinnerCount}\` winners, \`${summary.totals.trackedLoserCount}\` losers, \`${summary.totals.trackedActionCount}\` action-needed)`,
    summary.analyticsAvailable
      ? `- Analytics totals: \`cta_click ${summary.analyticsTotals.cta_click.current}\`, \`calculator_start ${summary.analyticsTotals.calculator_start.current}\`, \`calculator_complete ${summary.analyticsTotals.calculator_complete.current}\``
      : "- Analytics totals: `analytics-events.csv` not provided",
  ];
}

function renderMoverTable(rows, kind) {
  if (rows.length === 0) {
    return "_No rows matched this criterion in the current export._";
  }

  return table(
    kind === "pages"
      ? ["URL", "Clicks", "Impressions", "CTR", "Position"]
      : ["Query", "Clicks", "Impressions", "CTR", "Position"],
    rows.map(row => [
      kind === "pages" ? formatPathForMarkdown(row.path) : `\`${row.label}\``,
      formatMetricPair(row.clicks, row.clicksDelta),
      formatMetricPair(row.impressions, row.impressionsDelta),
      `${formatPercent(row.ctr)} (${formatSignedNumber(row.ctrDelta, 1)} pp)`,
      `${row.position.toFixed(1)} (${formatSignedNumber(
        -row.positionDelta,
        1
      )} better)`,
    ])
  );
}

function renderTrackedTable(trackedPages) {
  return table(
    ["URL", "Rol", "Organic", "Query pulse", "Analytics", "Status", "Next move"],
    trackedPages.map(item => {
      const organic = item.pageRow
        ? `Clicks ${formatSignedNumber(item.pageRow.clicksDelta)}, CTR ${formatSignedNumber(
            item.pageRow.ctrDelta,
            1
          )} pp`
        : "n/d";
      const queryPulse = item.queryPulse
        ? `Clicks ${formatSignedNumber(
            item.queryPulse.clicksDelta
          )}, Pos ${item.queryPulse.position.toFixed(1)}`
        : "n/d";
      const analytics =
        item.role === "tool"
          ? `starts ${item.analyticsMetrics.starts.current}, completes ${item.analyticsMetrics.completes.current}, CR ${
              item.analyticsMetrics.completionRate === null
                ? "n/d"
                : formatPercent(item.analyticsMetrics.completionRate * 100)
            }`
          : `cta_click ${item.analyticsMetrics.cta.current} (${formatSignedNumber(
              item.analyticsMetrics.cta.current -
                item.analyticsMetrics.cta.previous
            )})`;
      const nextMove =
        item.actions[0]?.text ?? item.reasons[0] ?? "Seguir igual una semana más.";

      return [
        formatPathForMarkdown(item.path),
        item.role,
        organic,
        queryPulse,
        analytics,
        item.status,
        nextMove,
      ];
    })
  );
}

function renderActionList(items) {
  if (items.length === 0) {
    return "_No action candidates were generated from the current data._";
  }

  return items.map(item => `- ${item.label} (${item.path}): ${item.text}`).join("\n");
}

function buildMarkdown(summary) {
  return `# Weekly Search Performance Scorecard

Generated: \`${summary.generatedAt}\`

## Headline

${buildHeadline(summary).join("\n")}

## Indexation Health

${summary.indexationStatus
  .map(section => {
    const alerts =
      section.alerts.length > 0
        ? section.alerts.map(alert => `  - ${alert}`).join("\n")
        : "  - No explicit alerts logged.";
    return `### ${section.platform}

- Sitemap status: \`${section.status}\`
- Coverage note: ${section.coverage}
- Alerts:
${alerts}`;
  })
  .join("\n\n")}

## Top Winners

### Pages

${renderMoverTable(summary.topPageWinners, "pages")}

### Queries

${renderMoverTable(summary.topQueryWinners, "queries")}

## Top Losers

### Pages

${renderMoverTable(summary.topPageLosers, "pages")}

### Queries

${renderMoverTable(summary.topQueryLosers, "queries")}

## Strategic Watchlist

${renderTrackedTable(summary.trackedPages)}

## Refresh Candidates

${renderActionList(summary.refreshCandidates)}

## Internal Linking / Packaging / Tool UX

${renderActionList(summary.linkingCandidates)}

## Query Quick Wins

${renderMoverTable(summary.queryQuickWins, "queries")}

## Notes

${
  summary.notes.length > 0
    ? summary.notes.map(note => `- ${note}`).join("\n")
    : "- No additional manual notes were logged in `indexation-summary.json`."
}
`;
}

function main() {
  const options = parseArgs(process.argv.slice(2));

  if (options.init) {
    initInputDirectory(options.inputDir);
    return;
  }

  const watchlist = loadJson(options.watchlistFile, "watchlist config");
  const indexation = loadJson(
    path.join(options.inputDir, "indexation-summary.json"),
    "indexation summary"
  );
  const pageRows = readSearchCsv(
    path.join(options.inputDir, "gsc-pages.csv"),
    "pages"
  );
  const queryRows = readSearchCsv(
    path.join(options.inputDir, "gsc-queries.csv"),
    "queries"
  );
  const analytics = readAnalyticsCsv(
    path.join(options.inputDir, "analytics-events.csv")
  );

  const summary = buildSummary({
    watchlist,
    indexation,
    pageRows,
    queryRows,
    analytics,
  });
  const markdown = buildMarkdown(summary);

  ensureDirectory(path.dirname(options.outputFile));
  ensureDirectory(path.dirname(options.jsonFile));
  writeFileSync(options.outputFile, markdown, "utf8");
  writeFileSync(options.jsonFile, JSON.stringify(summary, null, 2) + "\n", "utf8");

  console.log(
    `[weekly-search-report] Scorecard written to ${path.resolve(options.outputFile)}`
  );
  console.log(
    `[weekly-search-report] JSON summary written to ${path.resolve(options.jsonFile)}`
  );
  console.log(
    `[weekly-search-report] Inputs loaded: pages=${pageRows.length} queries=${queryRows.length} analytics=${
      analytics.available ? "yes" : "no"
    }`
  );
}

main();
