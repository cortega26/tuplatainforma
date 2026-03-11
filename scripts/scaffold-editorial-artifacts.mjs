import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const REPO_ROOT = path.resolve(__dirname, "..");
const BLOG_DIR = path.join(REPO_ROOT, "src", "data", "blog");
const ARTIFACTS_DIR = path.join(REPO_ROOT, "artifacts", "editorial");

const YMYL_CATEGORIES = new Set([
  "ahorro-inversion",
  "deuda-credito",
  "empleo-ingresos",
  "impuestos",
  "prevision",
  "seguridad-financiera",
]);

const NUMERIC_CLAIM_PATTERN =
  /(?:\$?\d{1,3}(?:[.\s]\d{3})+(?:,\d+)?|\$?\d+(?:[.,]\d+)?\s*%|\$?\d+(?:[.,]\d+)?\s*(?:UF|UTM|CLP|USD)\b|\b\d{2,}(?:[.,]\d+)?\b)/gi;
const DATE_PATTERN = /^\d{4}-\d{2}-\d{2}$/;

function printUsage() {
  console.log(`Usage:
  node scripts/scaffold-editorial-artifacts.mjs --slug <slug> [--slug <slug> ...]
  pnpm run scaffold:editorial-artifacts -- --slug <slug> [--cut-off-date YYYY-MM-DD]

Options:
  --slug <slug>           Blog slug to scaffold. Can be repeated.
  --run-id <run-id>       Override generated run id (default: YYYYMMDD-HHMM-<actor>).
  --cut-off-date <date>   Seed cut-off date in YYYY-MM-DD format (default: today).
  --actor <name>          Suffix used for generated run id (default: codex).
  --force                 Overwrite files if the target run directory already exists.
  --dry-run               Print planned writes without touching the filesystem.
  --help                  Show this message.
`);
}

function parseArgs(argv) {
  const options = {
    slugs: [],
    runId: "",
    cutOffDate: getLocalDateStamp(new Date()),
    actor: "codex",
    force: false,
    dryRun: false,
    help: false,
  };

  for (let index = 0; index < argv.length; index += 1) {
    const token = argv[index];
    switch (token) {
      case "--":
        break;
      case "--slug": {
        const slug = argv[index + 1];
        if (!slug) throw new Error("Missing value for --slug.");
        options.slugs.push(slug.trim());
        index += 1;
        break;
      }
      case "--run-id": {
        const runId = argv[index + 1];
        if (!runId) throw new Error("Missing value for --run-id.");
        options.runId = runId.trim();
        index += 1;
        break;
      }
      case "--cut-off-date": {
        const cutOffDate = argv[index + 1];
        if (!cutOffDate) throw new Error("Missing value for --cut-off-date.");
        options.cutOffDate = cutOffDate.trim();
        index += 1;
        break;
      }
      case "--actor": {
        const actor = argv[index + 1];
        if (!actor) throw new Error("Missing value for --actor.");
        options.actor = actor.trim();
        index += 1;
        break;
      }
      case "--force":
        options.force = true;
        break;
      case "--dry-run":
        options.dryRun = true;
        break;
      case "--help":
      case "-h":
        options.help = true;
        break;
      default:
        if (token.startsWith("--")) {
          throw new Error(`Unknown option: ${token}`);
        }
        options.slugs.push(token.trim());
        break;
    }
  }

  options.slugs = Array.from(new Set(options.slugs.filter(Boolean)));
  return options;
}

function getLocalDateStamp(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function getRunTimestamp(date) {
  const year = String(date.getFullYear());
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");
  return `${year}${month}${day}-${hours}${minutes}`;
}

function sanitizeToken(value, fallback) {
  const normalized = String(value ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
  return normalized || fallback;
}

function buildRunId(explicitRunId, actor) {
  if (explicitRunId) return explicitRunId;
  return `${getRunTimestamp(new Date())}-${sanitizeToken(actor, "codex")}`;
}

function extractFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---\n?/);
  if (!match) return { frontmatter: "", body: source };
  return {
    frontmatter: match[1] ?? "",
    body: source.slice(match[0].length),
  };
}

function stripQuotes(value) {
  return value.replace(/^['"]|['"]$/g, "");
}

function parseInlineArray(rawValue) {
  const trimmed = rawValue.trim();
  if (!trimmed.startsWith("[") || !trimmed.endsWith("]")) return null;
  const inner = trimmed.slice(1, -1).trim();
  if (!inner) return [];
  return inner
    .split(",")
    .map(item => stripQuotes(item.trim()))
    .filter(Boolean);
}

function parseScalar(rawValue) {
  const value = rawValue.trim();
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;
  const inlineArray = parseInlineArray(value);
  if (inlineArray) return inlineArray;
  return stripQuotes(value);
}

function parseFrontmatterBlock(block) {
  if (!block) return {};
  const lines = block.split(/\r?\n/);
  const parsed = {};

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    if (!line.trim() || line.trim().startsWith("#")) continue;
    if (/^\s/.test(line)) continue;

    const separatorIndex = line.indexOf(":");
    if (separatorIndex < 0) continue;

    const key = line.slice(0, separatorIndex).trim();
    const rawValue = line.slice(separatorIndex + 1).trim();

    if (rawValue.length > 0) {
      parsed[key] = parseScalar(rawValue);
      continue;
    }

    const listValues = [];
    let cursor = index + 1;
    while (cursor < lines.length) {
      const child = lines[cursor];
      if (/^\s*-\s+/.test(child)) {
        listValues.push(stripQuotes(child.replace(/^\s*-\s+/, "").trim()));
        cursor += 1;
        continue;
      }
      if (/^\s*$/.test(child)) {
        cursor += 1;
        continue;
      }
      break;
    }

    if (listValues.length > 0) {
      parsed[key] = listValues;
      index = cursor - 1;
      continue;
    }

    parsed[key] = "";
  }

  return parsed;
}

function resolveContentFile(slug) {
  const entries = readdirSync(BLOG_DIR, { withFileTypes: true });
  const match = entries.find(entry => {
    if (!entry.isFile()) return false;
    const ext = path.extname(entry.name).toLowerCase();
    if (ext !== ".md" && ext !== ".mdx") return false;
    return path.basename(entry.name, ext) === slug;
  });

  if (!match) {
    throw new Error(`Slug "${slug}" was not found in src/data/blog.`);
  }

  return path.join(BLOG_DIR, match.name);
}

function humanizeSlug(slug) {
  return slug
    .split("-")
    .filter(Boolean)
    .join(" ");
}

function countNumericClaims(body) {
  const matches = body.match(NUMERIC_CLAIM_PATTERN) ?? [];
  return new Set(matches.map(value => value.trim())).size;
}

function inferRequiresCalculation(frontmatter, body) {
  if (frontmatter.requires_calculation === true) return true;
  if (frontmatter.requires_calculation === false) return false;
  return countNumericClaims(body) > 0;
}

function inferRegulatorySensitivity(frontmatter) {
  const category = String(frontmatter.category ?? "").trim().toLowerCase();
  if (category === "impuestos" || category === "prevision" || category === "empleo-ingresos") {
    return "alta";
  }
  if (YMYL_CATEGORIES.has(category)) {
    return "media";
  }
  return "baja";
}

function inferYmyStatus(frontmatter) {
  if (frontmatter.ymyl === true) return true;
  const category = String(frontmatter.category ?? "").trim().toLowerCase();
  return YMYL_CATEGORIES.has(category);
}

function toRepoRelative(filePath) {
  return path.relative(REPO_ROOT, filePath).replace(/\\/g, "/");
}

function createScaffoldContent({ slug, postPath, frontmatter, body, cutOffDate, runId }) {
  const title = String(frontmatter.title ?? humanizeSlug(slug)).trim() || humanizeSlug(slug);
  const category = String(frontmatter.category ?? "general").trim() || "general";
  const cluster = String(frontmatter.cluster ?? "sin-cluster").trim() || "sin-cluster";
  const queryAnchor = humanizeSlug(slug);
  const requiresCalculation = inferRequiresCalculation(frontmatter, body);
  const regulatorySensitivity = inferRegulatorySensitivity(frontmatter);
  const ymyStatus = inferYmyStatus(frontmatter);

  const brief = `slug: ${slug}
query_anchor: "${queryAnchor}"
ymyl: ${ymyStatus ? "true" : "false"}
requires_calculation: ${requiresCalculation ? "true" : "false"}
regulatory_sensitivity: ${regulatorySensitivity}
target_audience: "TODO: define lector objetivo principal"
cut_off_date: ${cutOffDate}
`;

  const dossier = `# Dossier

- Source article: \`${postPath}\`
- Current title: "${title}"
- Current category: \`${category}\`
- Current cluster: \`${cluster}\`
- Fecha de corte usada para iniciar este run: \`${cutOffDate}\`
- Run id: \`${runId}\`

## Intencion principal

- TODO: resumir la query ancla y la decision que el lector necesita tomar.

## Riesgo YMYL

- TODO: describir por que la pieza es YMYL o, si no lo es, por que igual requiere trazabilidad reforzada.
- Sensibilidad regulatoria inicial inferida: \`${regulatorySensitivity}\`
- Requiere calculo segun heuristica inicial: \`${requiresCalculation ? "si" : "no"}\`

## Fuentes oficiales priorizadas

- TODO: agregar fuentes oficiales con fecha de consulta.
- Sugerencia inicial segun categoria \`${category}\`: revisar regulador, ChileAtiende, BCN y fuente sectorial primaria aplicable.

## Cambios / hallazgos a validar en el articulo actual

- TODO: listar reglas, cifras, plazos o excepciones que exigen verificacion.
- Numeric claims detectados en el cuerpo actual: \`${countNumericClaims(body)}\`

## Decisiones editoriales

- TODO: anotar alcance, exclusions, edge cases y links internos clave.
`;

  const outline = `# Outline

## Respuesta ancla

- TODO: regla concreta + excepciones + vigencia + fuente.

## Secciones

1. TODO: bloque principal
2. TODO: excepciones o casos borde
3. TODO: pasos / checklist / comparativa
4. TODO: FAQ util
`;

  const draft = `# Draft

## Respuesta rapida (regla general)

TODO: completar con regla concreta, excepciones, vigencia y fuentes.

## Cuerpo

TODO: desarrollar el refresh siguiendo \`docs/editorial/NORMA_YMYL.md\`.
`;

  const mathAudit = `# Math Audit

- Run id: \`${runId}\`
- Slug: \`${slug}\`
- Requiere calculo: \`${requiresCalculation ? "si" : "no"}\`

## Checklist

- [ ] Se identificaron todas las cifras criticas.
- [ ] Cada formula o ejemplo numerico fue recalculado.
- [ ] Las unidades, topes y periodos coinciden con las fuentes.

## Veredicto

- TODO: pass / fail
`;

  const compliance = `# Compliance

- Run id: \`${runId}\`
- Slug: \`${slug}\`
- Sensibilidad regulatoria inicial: \`${regulatorySensitivity}\`

## Checklist NORMA_YMYL

- [ ] Respuesta ancla concreta
- [ ] Vigencia explicita
- [ ] Fuente oficial para cada regla critica
- [ ] Excepciones relevantes
- [ ] Sin inferencias sin etiqueta
- [ ] updatedDate consistente si hubo refresh sustantivo

## Observaciones

- TODO: registrar hallazgos y sign-off humano si aplica.
`;

  const publishPacket = `# Publish Packet

- Run id: \`${runId}\`
- Slug: \`${slug}\`
- Source article: \`${postPath}\`

## Estado del paquete

- [ ] Brief listo
- [ ] Dossier listo
- [ ] Outline listo
- [ ] Draft listo
- [ ] Math audit listo o no aplica
- [ ] Compliance listo
- [ ] Fuentes completas
- [ ] Fecha de corte visible para lectores
- [ ] HumanEditor sign-off

## Nota

Este scaffold no vuelve el articulo compliant por si solo. Completar \`sources.yaml\`, dossier y verificaciones antes de reclamar cierre de \`TD-0016\`.
`;

  const metadata = `slug: ${slug}
source_path: ${postPath}
run_id: ${runId}
scaffolded_at: ${new Date().toISOString()}
cut_off_date: ${cutOffDate}
draft_agent: pending-draft-agent
math_audit_agent: pending-math-audit-agent
compliance_agent: pending-compliance-agent
`;

  const sources = `# Add one item per official or primary source.
# The strict editorial gate will keep failing until at least one valid entry exists.
# Example:
# - title: "Nombre de la fuente"
#   publisher: "Organismo"
#   date: ${cutOffDate}
#   url: "https://example.gob.cl/recurso"
`;

  return new Map([
    ["01-brief.yaml", brief],
    ["02-dossier.md", dossier],
    ["03-outline.md", outline],
    ["04-draft.md", draft],
    ["05-math-audit.md", mathAudit],
    ["06-compliance.md", compliance],
    ["07-publish-packet.md", publishPacket],
    ["metadata.yaml", metadata],
    ["sources.yaml", sources],
  ]);
}

function ensureDate(value) {
  if (!DATE_PATTERN.test(value)) {
    throw new Error(`Invalid --cut-off-date "${value}". Expected YYYY-MM-DD.`);
  }
}

function writeScaffold(slug, options) {
  const postPath = resolveContentFile(slug);
  const source = readFileSync(postPath, "utf8");
  const { frontmatter: frontmatterBlock, body } = extractFrontmatter(source);
  const frontmatter = parseFrontmatterBlock(frontmatterBlock);
  const runDir = path.join(ARTIFACTS_DIR, slug, options.runId);

  if (existsSync(runDir) && !options.force) {
    throw new Error(
      `Target run directory already exists for "${slug}": ${toRepoRelative(runDir)}. Use --force or a different --run-id.`
    );
  }

  const files = createScaffoldContent({
    slug,
    postPath: toRepoRelative(postPath),
    frontmatter,
    body,
    cutOffDate: options.cutOffDate,
    runId: options.runId,
  });

  if (!options.dryRun) {
    mkdirSync(runDir, { recursive: true });
  }

  for (const [fileName, content] of files.entries()) {
    const targetPath = path.join(runDir, fileName);
    if (!options.dryRun) {
      writeFileSync(targetPath, content, "utf8");
    }
  }

  return {
    slug,
    postPath: toRepoRelative(postPath),
    runDir: toRepoRelative(runDir),
    fileCount: files.size,
  };
}

function run() {
  try {
    const options = parseArgs(process.argv.slice(2));
    if (options.help) {
      printUsage();
      process.exit(0);
    }

    if (!existsSync(BLOG_DIR)) {
      throw new Error(`Missing blog directory: ${toRepoRelative(BLOG_DIR)}`);
    }

    if (options.slugs.length === 0) {
      throw new Error("At least one --slug is required.");
    }

    ensureDate(options.cutOffDate);
    options.runId = buildRunId(options.runId, options.actor);

    const results = options.slugs.map(slug => writeScaffold(slug, options));
    console.log(
      `[scaffold-editorial-artifacts] ${options.dryRun ? "DRY RUN" : "OK"} created=${results.length} run_id=${options.runId} cut_off_date=${options.cutOffDate}`
    );
    for (const result of results) {
      console.log(
        `- slug=${result.slug} source=${result.postPath} artifact_run=${result.runDir} files=${result.fileCount}`
      );
    }
    console.log(
      "[scaffold-editorial-artifacts] Next step: replace TODOs and add valid sources before expecting pnpm run check:editorial to pass for these slugs."
    );
  } catch (error) {
    console.error(`[scaffold-editorial-artifacts] FAIL: ${error.message}`);
    process.exit(1);
  }
}

run();
