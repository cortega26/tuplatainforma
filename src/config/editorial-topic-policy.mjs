export const TOPIC_ROLES = ["owner", "support", "reference"];

export const HARDENED_OWNERSHIP_CLUSTERS = [
  "sueldo-remuneraciones",
  "pensiones-afp",
  "ahorro-e-inversion",
];

export const PRIMARY_CATEGORY_BY_CLUSTER = {
  "pensiones-afp": ["prevision"],
  "sueldo-remuneraciones": ["empleo-ingresos"],
  "empleo-ingresos": ["empleo-ingresos"],
  "impuestos-personas": ["impuestos"],
  "ahorro-e-inversion": ["ahorro-inversion"],
  "deuda-credito": ["deuda-credito"],
  "seguridad-financiera": ["seguridad-financiera"],
};

export const CANONICAL_TOPIC_REGISTRY = {
  "sueldo-remuneraciones": {
    "calcular-sueldo-liquido": {
      ownerSlug: "como-calcular-sueldo-liquido",
      intentLabel: "calcular sueldo liquido",
    },
    "auditar-liquidacion-sueldo": {
      ownerSlug: "liquidacion-de-sueldo",
      intentLabel: "auditar liquidacion de sueldo",
    },
    "clasificacion-descuentos-sueldo": {
      ownerSlug: "descuentos-de-sueldo",
      intentLabel: "clasificar descuentos de sueldo",
    },
    "descuento-afp-trabajador": {
      ownerSlug: "cuanto-descuenta-la-afp-de-tu-sueldo",
      intentLabel: "descuento AFP del trabajador",
    },
  },
  "pensiones-afp": {
    "cambio-afp": {
      ownerSlug: "como-cambiarse-de-afp",
      intentLabel: "cambiarse de AFP",
    },
    "elegir-fondos-afp": {
      ownerSlug: "fondos-afp-a-b-c-d-e",
      intentLabel: "elegir fondos AFP",
    },
    "cuenta2-afp": {
      ownerSlug: "que-es-la-cuenta-2-afp",
      intentLabel: "cuenta 2 AFP",
    },
    "reforma-previsional-cambios": {
      ownerSlug: "reforma-previsional-2025-que-cambia-y-como-te-afecta",
      intentLabel: "reforma previsional y cambios vigentes",
    },
  },
  "ahorro-e-inversion": {
    "elegir-instrumento-ahorro-inversion": {
      ownerSlug:
        "ahorro-e-inversion-en-chile-instrumentos-costos-impuestos-2026",
      intentLabel: "elegir instrumento de ahorro e inversion",
    },
    "fondos-mutuos-costos-rescate-impuestos": {
      ownerSlug: "fondos-mutuos-comisiones-rescate-impuestos",
      intentLabel: "fondos mutuos costos rescate impuestos",
    },
    "invertir-etfs-desde-chile": {
      ownerSlug: "como-invertir-en-etfs-desde-chile",
      intentLabel: "invertir ETFs desde Chile",
    },
    "apv-beneficio-tributario": {
      ownerSlug: "que-es-el-apv",
      intentLabel: "APV beneficio tributario",
    },
    "deposito-plazo-uf-vs-pesos": {
      ownerSlug: "deposito-a-plazo-uf-vs-pesos",
      intentLabel: "deposito a plazo UF vs pesos",
    },
    "interes-compuesto-caso": {
      ownerSlug: "el-poder-del-interes-compuesto",
      intentLabel: "interes compuesto caso",
    },
  },
};

export const TRANSITIONAL_OWNERSHIP_REGISTRY = {
  "como-hacer-presupuesto-mensual-chile": {
    currentCluster: "empleo-ingresos",
    currentCategory: "general",
    canonicalOwnerCluster: "presupuesto-control-financiero",
    canonicalTopic: "presupuesto-mensual-control-financiero",
    targetHubPath: "/guias/presupuesto-control-financiero/",
    migrationCondition:
      "Migrar solo cuando exista el hub productivo /guias/presupuesto-control-financiero/ y al menos un activo satelite o herramienta adicional que convierta la URL actual en core real del cluster.",
    rationale:
      "La intencion dominante es habito y control financiero del hogar, no continuidad de ingreso laboral ni contingencia de empleo.",
  },
  "que-es-el-ipc-chile-como-se-calcula": {
    currentCluster: "empleo-ingresos",
    currentCategory: "general",
    canonicalOwnerCluster: "uf-costo-de-vida",
    canonicalTopic: "ipc-inflacion-costo-de-vida",
    targetHubPath: "/guias/uf-costo-de-vida/",
    migrationCondition:
      "Migrar solo cuando exista el hub productivo /guias/uf-costo-de-vida/ y al menos un activo satelite o herramienta adicional que ordene la relacion entre IPC, UF y costo de vida.",
    rationale:
      "La necesidad primaria es entender inflacion, reajuste y bolsillo; no pertenece editorialmente al cluster de contingencias laborales.",
  },
};

export function getTransitionalOwnershipEntry(slug) {
  return TRANSITIONAL_OWNERSHIP_REGISTRY[slug] ?? null;
}

export function isDocumentedTransitionalPlacement({ slug, cluster, category }) {
  const entry = getTransitionalOwnershipEntry(slug);
  if (!entry) return false;
  return entry.currentCluster === cluster && entry.currentCategory === category;
}

export function isHardenedOwnershipCluster(cluster) {
  return HARDENED_OWNERSHIP_CLUSTERS.includes(cluster);
}

export function getAllowedCategoriesForCluster(cluster) {
  return PRIMARY_CATEGORY_BY_CLUSTER[cluster] ?? null;
}

export function getCanonicalTopicEntry(cluster, canonicalTopic) {
  return CANONICAL_TOPIC_REGISTRY[cluster]?.[canonicalTopic] ?? null;
}

export function isRegisteredCanonicalTopic(cluster, canonicalTopic) {
  return Boolean(getCanonicalTopicEntry(cluster, canonicalTopic));
}

export function allowsGeneralCategoryInCluster({
  cluster,
  topicRole,
  unlisted,
}) {
  if (!isHardenedOwnershipCluster(cluster)) return true;
  return topicRole === "reference" && unlisted === true;
}
