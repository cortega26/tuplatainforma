/**
 * templateConfig.js
 * Sistema visual v3 — monedario
 *
 * Fuente de verdad para: paleta semántica, íconos narrativos,
 * datos ancla (Template C) y label de categoría.
 *
 * No importa nada del runtime de Astro — se puede usar en build y en Antigravity.
 */

// ─── PALETA SEMÁNTICA ────────────────────────────────────────────────────────
// Variantes: base → dark → light (rotar secuencialmente por artículo en misma categoría)

export const CATEGORY_COLORS = {
  "empleo-ingresos": { base: "#0d9488", dark: "#0f766e", light: "#14b8a6" },
  prevision: { base: "#0d9488", dark: "#0f766e", light: "#14b8a6" },
  "ahorro-inversion": { base: "#059669", dark: "#047857", light: "#10b981" },
  "deuda-credito": { base: "#d97706", dark: "#b45309", light: "#f59e0b" },
  impuestos: { base: "#d97706", dark: "#b45309", light: "#f59e0b" },
  "seguridad-financiera": {
    base: "#e11d48",
    dark: "#be123c",
    light: "#f43f5e",
  },
  general: { base: "#475569", dark: "#334155", light: "#64748b" },
  // educativo/glosario — sin categoría Astro propia, se asigna por tag
  educativo: { base: "#4f46e5", dark: "#4338ca", light: "#6366f1" },
};

export const DEFAULT_COLOR = {
  base: "#475569",
  dark: "#334155",
  light: "#64748b",
};

// ─── ÍCONOS NARRATIVOS ───────────────────────────────────────────────────────
// Clave: tag o concepto. Valor: paths SVG (stroke, viewBox 24x24, Lucide-compatible).
// Stroke width: 2. Fill: none. Stroke-linecap: round. Stroke-linejoin: round.

export const ICON_PATHS = {
  // hourglass — cesantía, AFP/pensión
  hourglass:
    "M5 22h14M5 2h14M17 22v-4.172a2 2 0 0 0-.586-1.414L12 12l-4.414 4.414A2 2 0 0 0 7 17.828V22M7 2v4.172a2 2 0 0 0 .586 1.414L12 12l4.414-4.414A2 2 0 0 0 17 6.172V2",

  // calendar — impuestos, fechas límite
  calendar:
    "M8 2v4M16 2v4M3 10h18M5 4h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2z",

  // trending-down — deuda, crédito
  "trending-down": "M22 17l-8.5-8.5-5 5L2 7M16 17h6v-6",

  // shopping-cart — inflación, precios
  "shopping-cart":
    "M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4zM3 6h18M16 10a4 4 0 0 1-8 0",

  // target — ahorro, APV, metas
  target:
    "M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM12 18a6 6 0 1 0 0-12 6 6 0 0 0 0 12zM12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",

  // smartphone — banco, cuenta corriente
  smartphone:
    "M17 2H7a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V4a2 2 0 0 0-2-2zM12 18h.01",

  // alert-triangle — fraude, seguridad
  "alert-triangle":
    "M10.29 3.86 1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0zM12 9v4M12 17h.01",

  // banknote — sueldo, nómina
  banknote:
    "M2 9h20v10a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9zM2 9V7a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v2M12 14a2 2 0 1 0 0-4 2 2 0 0 0 0 4z",

  // shield-check — seguro
  "shield-check": "M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10zM9 12l2 2 4-4",

  // bar-chart-2 — inversión, fondos AFP
  "bar-chart-2": "M18 20V10M12 20V4M6 20v-6",

  // key — hipoteca, arriendo
  key: "M21 2l-2 2m-7.61 7.61a5.5 5.5 0 1 1-7.778 7.778 5.5 5.5 0 0 1 7.777-7.777zm0 0L15.5 7.5m0 0 3 3L22 7l-3-3m-3.5 3.5L19 4",

  // split — presupuesto, gastos
  split:
    "M16 3h5v5M8 3H3v5M12 22v-8.3a4 4 0 0 0-1.172-2.872L3 3M21 3l-7.828 7.828A4 4 0 0 0 12 13.7V22",

  // activity — UF, indicadores
  activity: "M22 12h-4l-3 9L9 3l-3 9H2",

  // refresh-cw — renegociación
  "refresh-cw":
    "M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8M21 3v5h-5M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16M3 21v-5h5",

  // percent — tasas, porcentajes
  percent:
    "M19 5 5 19M6.5 6.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1zM17.5 17.5a.5.5 0 1 0 0-1 .5.5 0 0 0 0 1z",
};

export const DEFAULT_ICON = "activity";

// ─── MAPA SLUG → TEMPLATE C ──────────────────────────────────────────────────
// Si el slug está aquí, se usa Template C con ese dato ancla.
// anchorValue: texto grande (cifra/fecha/palabra clave)
// anchorSub:   sublabel bajo el valor (ej. "MESES")
// anchorRight: label lado derecho junto al ícono (ej. "COBERTURA")
// icon:        clave de ICON_PATHS

export const TEMPLATE_C_DATA = {
  "seguro-de-cesantia": {
    anchorValue: "5",
    anchorSub: "MESES",
    anchorRight: "COBERTURA",
    icon: "hourglass",
  },
  "como-calcular-sueldo-liquido": {
    anchorValue: "tu",
    anchorSub: "SUELDO",
    anchorRight: "LÍQUIDO",
    icon: "banknote",
  },
  "fraude-tarjeta-que-hacer": {
    anchorValue: "24h",
    anchorSub: "PARA",
    anchorRight: "ACTUAR",
    icon: "alert-triangle",
  },
  "cuanto-descuenta-la-afp-de-tu-sueldo": {
    anchorValue: "10%",
    anchorSub: "AFP",
    anchorRight: "DESCUENTO",
    icon: "hourglass",
  },
  "cae-costo-real-credito-chile": {
    anchorValue: "CAE",
    anchorSub: "COSTO",
    anchorRight: "REAL",
    icon: "trending-down",
  },
  "que-es-el-ipc-chile-como-se-calcula": {
    anchorValue: "IPC",
    anchorSub: "QUÉ ES",
    anchorRight: "Y CÓMO AFECTA",
    icon: "activity",
  },
  "como-hacer-presupuesto-mensual-chile": {
    anchorValue: "0",
    anchorSub: "DEUDA",
    anchorRight: "PRESUPUESTO",
    icon: "split",
  },
  "informe-deudas-cmf-vs-dicom": {
    anchorValue: "CMF",
    anchorSub: "vs",
    anchorRight: "DICOM",
    icon: "trending-down",
  },
};

// ─── MAPA SLUG → ÍCONO (Template B) ─────────────────────────────────────────
// Para artículos que usan Template B, qué ícono narrativo mostrar.

export const SLUG_ICON_MAP = {
  "que-es-la-uf": "activity",
  "renegociacion-superir": "refresh-cw",
  "que-es-el-apv": "target",
  "que-es-la-cuenta-2-afp": "bar-chart-2",
  "fondos-afp-a-b-c-d-e": "bar-chart-2",
  "como-cambiarse-de-afp": "refresh-cw",
};

// ─── MAPA CATEGORÍA → LABEL ──────────────────────────────────────────────────

export const CATEGORY_LABELS = {
  "empleo-ingresos": "EMPLEO",
  prevision: "PREVISIÓN · AFP",
  "ahorro-inversion": "AHORRO",
  "deuda-credito": "DEUDA · CRÉDITO",
  impuestos: "IMPUESTOS",
  "seguridad-financiera": "SEGURIDAD",
  general: "FINANZAS",
};

// ─── MAPA CATEGORÍA → ÍCONO FALLBACK (Template B) ───────────────────────────

export const CATEGORY_ICON_MAP = {
  "empleo-ingresos": "banknote",
  prevision: "hourglass",
  "ahorro-inversion": "target",
  "deuda-credito": "trending-down",
  impuestos: "calendar",
  "seguridad-financiera": "shield-check",
  general: "activity",
};
