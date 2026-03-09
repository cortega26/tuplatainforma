export const READER_FACING_ALLOWLIST_PATHS = new Set([
  "src/pages/about.astro",
  "src/pages/autor.astro",
]);

export const INTERNAL_EDITORIAL_VISIBLE_RULES = [
  {
    id: "home-taxonomy-meta",
    severity: "error",
    reason: "Internal/editorial-facing visible copy",
    regex: /\btaxonom[ií]a de monedario\b/gi,
  },
  {
    id: "home-opening-meta",
    severity: "error",
    reason: "Internal/editorial-facing visible copy",
    regex: /\bapertura editorial\b/gi,
  },
  {
    id: "home-layer-meta",
    severity: "error",
    reason: "Internal/editorial-facing visible copy",
    regex: /\besta capa abre otros frentes\b/gi,
  },
  {
    id: "first-person-editor-note",
    severity: "error",
    reason: "Internal/editorial-facing visible copy",
    regex: /\blo dej[ée]\b/gi,
  },
  {
    id: "home-competition-meta",
    severity: "error",
    reason: "Internal/editorial-facing visible copy",
    regex: /\bno compita con la apertura editorial\b/gi,
  },
  {
    id: "home-width-meta",
    severity: "error",
    reason: "Internal/editorial-facing visible copy",
    regex: /\babrir la portada con m[aá]s amplitud\b/gi,
  },
  {
    id: "revision-correction-meta",
    severity: "error",
    reason: "Internal/editorial-facing visible copy",
    regex: /\bcorrecci[oó]n aplicada en esta revisi[oó]n\b/gi,
  },
  {
    id: "revision-editorial-meta",
    severity: "error",
    reason: "Internal/editorial-facing visible copy",
    regex: /\brefuerzo editorial aplicado en esta revisi[oó]n\b/gi,
  },
  {
    id: "report-taxonomy-aligned",
    severity: "warn",
    reason: "Suspicious meta/editorial-facing visible copy",
    regex: /\balinead[oa]s? con la taxonom[ií]a\b/gi,
  },
  {
    id: "report-open-home",
    severity: "warn",
    reason: "Suspicious meta/editorial-facing visible copy",
    regex: /\bpara abrir la portada\b/gi,
  },
  {
    id: "report-this-layer",
    severity: "warn",
    reason: "Suspicious meta/editorial-facing visible copy",
    regex: /\besta capa\b/gi,
  },
  {
    id: "report-review-note",
    severity: "warn",
    reason: "Suspicious meta/editorial-facing visible copy",
    regex: /\b(aplicad[oa]|ajustad[oa]) en esta revisi[oó]n\b/gi,
  },
  {
    id: "report-editorial-process",
    severity: "warn",
    reason: "Suspicious meta/editorial-facing visible copy",
    regex: /\b(varias revisiones editoriales|proceso editorial dise[nñ]ado|consistencia interna)\b/gi,
    allowedPaths: READER_FACING_ALLOWLIST_PATHS,
  },
];

export function shouldSkipRuleForPath(rule, filePath) {
  return Boolean(rule.allowedPaths?.has(filePath));
}
