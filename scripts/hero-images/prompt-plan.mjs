import {
  buildPromptA,
  buildPromptB,
  buildPromptC,
  COLORS,
  findApprovedPromptModel,
} from "./config.mjs";
import { normalizeForMatching } from "./lib.mjs";

export const DEFAULT_MODEL_PLAN = {
  provider: "openai",
  model: process.env.OPENAI_IMAGE_MODEL || process.env.DALL_E_MODEL || "dall-e-3",
  quality: "standard",
  size: "1792x1024",
};

const CATEGORY_COLOR_FALLBACK = {
  "ahorro-inversion": "Ahorro activo / Metas / Logros",
  impuestos: "Credito / Deuda / Impuestos / Riesgo",
  prevision: "Finanzas general / AFP / Empleo / Ahorro",
  "deuda-credito": "Credito / Deuda / Impuestos / Riesgo",
  "seguridad-financiera": "Advertencias / Errores comunes",
  "empleo-ingresos": "Finanzas general / AFP / Empleo / Ahorro",
  general: "Banca / Instituciones / Referencia tecnica",
};

const RULES = [
  {
    id: "fraude",
    keywords: ["fraude", "estafa", "suplantacion", "vishing", "smishing"],
    colorKey: "Fraude / Perdida grave",
    template: "A",
    recipeId: "fraude-estafa",
    readerSituation: "Persona revisando una alerta o contacto sospechoso en su telefono.",
    toneClass: "alerta",
  },
  {
    id: "renta",
    keywords: ["impuesto", "renta", "f22", "sii", "retencion"],
    colorKey: "Credito / Deuda / Impuestos / Riesgo",
    template: "A",
    recipeId: "declaracion-renta",
    readerSituation: "Persona completando o revisando formularios y fechas tributarias.",
    toneClass: "serio",
  },
  {
    id: "uf",
    keywords: ["uf", "ipc", "inflacion", "indicador"],
    colorKey: "Educativo / Conceptos / Guias",
    template: "C",
    recipeId: "uf-indicadores",
    readerSituation: "Persona entendiendo un indicador economico que afecta pagos cotidianos.",
    toneClass: "educativo",
  },
  {
    id: "deuda",
    keywords: ["deuda", "credito", "cae", "dicom", "renegociacion"],
    colorKey: "Credito / Deuda / Impuestos / Riesgo",
    template: "A",
    recipeId: "deuda-credito",
    readerSituation: "Persona enfrentando documentos, cuotas o decisiones de deuda.",
    toneClass: "serio",
  },
  {
    id: "ahorro",
    keywords: ["ahorro", "presupuesto", "fondo de emergencia", "meta"],
    colorKey: "Ahorro activo / Metas / Logros",
    template: "A",
    recipeId: "ahorro",
    readerSituation: "Persona organizando ahorro o controlando gastos cotidianos.",
    toneClass: "progreso",
  },
  {
    id: "empleo",
    keywords: ["sueldo", "finiquito", "cesantia", "desempleo", "honorarios"],
    colorKey: "Finanzas general / AFP / Empleo / Ahorro",
    template: "A",
    recipeId: "cesantia",
    readerSituation: "Persona revisando ingresos laborales, pagos o periodos sin trabajo.",
    toneClass: "neutral",
  },
  {
    id: "prevision",
    keywords: ["afp", "pension", "previsional", "cuenta 2"],
    colorKey: "Finanzas general / AFP / Empleo / Ahorro",
    template: "A",
    recipeId: "afp-pension",
    readerSituation: "Persona evaluando ahorro previsional y decisiones de largo plazo.",
    toneClass: "educativo",
  },
  {
    id: "salud",
    keywords: ["fonasa", "isapre", "salud", "licencia medica", "ges", "caec"],
    colorKey: "Salud / FONASA / ISAPRE",
    template: "A",
    recipeId: "fonasa-vs-isapre",
    readerSituation: "Persona comparando cobertura, documentos o protecciones de salud.",
    toneClass: "neutral",
  },
];

function fallbackRecipeId(category = "") {
  if (category === "prevision") return { template: "B", recipeId: "afp-cotizacion" };
  if (category === "deuda-credito") return { template: "B", recipeId: "cae-credito-educacion" };
  if (category === "impuestos") return { template: "A", recipeId: "declaracion-renta" };
  if (category === "ahorro-inversion") return { template: "A", recipeId: "ahorro" };
  if (category === "seguridad-financiera") return { template: "A", recipeId: "fraude-estafa" };
  return { template: "B", recipeId: "cuenta-corriente-banco" };
}

function buildArticleText(article) {
  return [
    article.title,
    article.summary,
    ...(article.leadParagraphs ?? []),
    ...(article.headings ?? []),
    article.bodyExcerpt,
  ]
    .filter(Boolean)
    .join(" ");
}

function normalizeTokens(values) {
  return values
    .filter(Boolean)
    .map(value => normalizeForMatching(value))
    .filter(Boolean);
}

function findRuleEvidence(article, articleText, rule) {
  const originalSegments = normalizeTokens([
    article.title,
    ...(article.leadParagraphs ?? []),
    ...(article.headings ?? []),
    article.summary,
    article.bodyExcerpt,
  ]);

  const matchedKeywords = rule.keywords.filter(keyword =>
    articleText.includes(normalizeForMatching(keyword))
  );

  const evidence = [];
  for (const keyword of matchedKeywords) {
    const normalizedKeyword = normalizeForMatching(keyword);
    const match = originalSegments.find(segment => segment.includes(normalizedKeyword));
    if (match) {
      evidence.push(`text contains '${keyword}' in article body/title context`);
    }
  }

  return {
    matchedKeywords,
    evidence: Array.from(new Set(evidence)).slice(0, 3),
  };
}

function determinePrimaryIntent(article, matchedRuleId) {
  const title = normalizeForMatching(article.title ?? "");
  const combined = normalizeForMatching(
    [article.title, article.summary, ...(article.headings ?? []), ...(article.leadParagraphs ?? [])].join(" ")
  );

  if (matchedRuleId === "fraude") return "alertar";
  if (matchedRuleId === "uf" || matchedRuleId === "prevision") return "explicar";
  if (/\b(vs|versus|diferencia|comparar|conviene)\b/.test(combined)) return "comparar";
  if (/\b(calcula|calcular|simulador|cuanto|cuánto)\b/.test(combined)) return "calcular";
  if (title.startsWith("como ") || /\b(checklist|pasos|como )\b/.test(combined)) return "guiar";
  return "explicar";
}

function buildFallbackReaderSituation(category) {
  if (category === "impuestos") {
    return "Persona revisando documentos y fechas para cumplir una obligacion tributaria.";
  }
  if (category === "prevision") {
    return "Persona evaluando decisiones previsionales de largo plazo.";
  }
  if (category === "ahorro-inversion") {
    return "Persona revisando herramientas o conceptos para mejorar su posicion financiera.";
  }
  return "Persona revisando informacion financiera practica para tomar una decision.";
}

function buildSemanticProfile(article, rule, evidence) {
  const primaryIntent = determinePrimaryIntent(article, rule.id);
  const readerSituation =
    rule.readerSituation || buildFallbackReaderSituation(String(article.category ?? "general"));

  const visualEvidence = [
    ...evidence,
    `primary intent classified as '${primaryIntent}' from article text`,
    `reader situation anchored to scene rule '${rule.id}'`,
  ].slice(0, 4);

  return {
    readerSituation,
    primaryIntent,
    toneClass: rule.toneClass || "neutral",
    visualEvidence,
    sourceSignals: {
      title: String(article.title ?? "").trim(),
      headings: (article.headings ?? []).slice(0, 3),
      leadParagraphs: (article.leadParagraphs ?? []).slice(0, 2),
    },
  };
}

export function selectPromptPlan(article) {
  const category = String(article.category ?? "general").trim().toLowerCase();
  const articleText = normalizeForMatching(buildArticleText(article));
  const metadataText = normalizeForMatching(
    [article.slug, ...(article.tags ?? []), article.cluster ?? ""].join(" ")
  );

  let rule = null;
  let evidence = [];
  let matchedKeywords = [];

  for (const candidate of RULES) {
      const textMatch = findRuleEvidence(article, articleText, candidate);
    if (textMatch.matchedKeywords.length > 0) {
      rule = candidate;
      matchedKeywords = textMatch.matchedKeywords;
      evidence = textMatch.evidence;
      break;
    }
  }

  if (!rule) {
    for (const candidate of RULES) {
      const metadataMatches = candidate.keywords.filter(keyword =>
        metadataText.includes(normalizeForMatching(keyword))
      );
      if (metadataMatches.length > 0) {
        rule = candidate;
        matchedKeywords = metadataMatches;
        evidence = [
          `metadata fallback matched '${metadataMatches[0]}'`,
          "article text did not produce a stronger scene signal",
        ];
        break;
      }
    }
  }

  if (!rule) {
    rule = {
      id: "fallback",
      colorKey:
        CATEGORY_COLOR_FALLBACK[category] ?? "Banca / Instituciones / Referencia tecnica",
      ...fallbackRecipeId(category),
      readerSituation: buildFallbackReaderSituation(category),
      toneClass: "neutral",
    };
    evidence = [
      "used fallback scene after reading article without a dominant visual cue",
      `category fallback applied for '${category || "general"}'`,
    ];
  }

  const colorEntry = COLORS[rule.colorKey] ?? COLORS["Banca / Instituciones / Referencia tecnica"];
  const semantic = buildSemanticProfile(article, rule, evidence);
  const basePlan = {
    ruleId: rule.id,
    colorKey: rule.colorKey,
    hex: colorEntry.hex,
    modelPlan: { ...DEFAULT_MODEL_PLAN },
    semantic,
    matchedKeywords,
  };

  const approvedModel = findApprovedPromptModel(rule.template, rule.recipeId);
  if (!approvedModel) {
    throw new Error(
      `[hero-images] Missing approved prompt model for template '${rule.template}' and recipe '${rule.recipeId}'.`
    );
  }

  if (rule.template === "A") {
    return {
      ...basePlan,
      template: "A",
      approvedModelId: approvedModel.id,
      sceneId: approvedModel.sceneId,
      postura: approvedModel.postura,
      objetos: approvedModel.objetos,
      sceneChoice: approvedModel.label,
    };
  }

  return {
    ...basePlan,
    template: rule.template,
    approvedModelId: approvedModel.id,
    sceneId: approvedModel.sceneId,
    icon: approvedModel.icono,
    iconChoice: approvedModel.label,
  };
}

export function buildPromptFromPlan(plan) {
  if (plan.template === "A") {
    return buildPromptA(plan.hex, plan.postura, plan.objetos);
  }
  if (plan.template === "C") {
    return buildPromptC(plan.hex, plan.icon);
  }
  return buildPromptB(plan.hex, plan.icon);
}
