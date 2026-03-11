/**
 * @typedef {Object} HubArticleAssignment
 * @property {string} slug
 * @property {string} href
 * @property {string} title
 * @property {string} summary
 * @property {string} [rationale]
 */

/**
 * @typedef {Object} HubArticleAssignmentSet
 * @property {HubArticleAssignment[]} core
 * @property {HubArticleAssignment[]} related
 */

export const HUB_ARTICLE_ASSIGNMENTS = {
  "pensiones-afp": {
    core: [
      {
        slug: "como-cambiarse-de-afp",
        href: "/posts/como-cambiarse-de-afp/",
        title: "¿Puedo cambiarme de AFP? Cómo hacerlo y qué considerar en 2026",
        summary:
          "Explica qué mirar antes de cambiarte, cómo hacerlo y qué errores evitar.",
      },
      {
        slug: "fondos-afp-a-b-c-d-e",
        href: "/posts/fondos-afp-a-b-c-d-e/",
        title:
          "Fondos AFP A, B, C, D y E: diferencias, riesgo y cuál te conviene",
        summary:
          "Explica las diferencias entre fondos y cuál puede calzar mejor con tu edad y tolerancia al riesgo.",
      },
      {
        slug: "que-es-la-cuenta-2-afp",
        href: "/posts/que-es-la-cuenta-2-afp/",
        title: "Cuenta 2 de la AFP: ahorro flexible, retiros e impuestos",
        summary:
          "Explica cuándo sirve como ahorro flexible y cómo se diferencia del APV por liquidez e impuestos.",
      },
      {
        slug: "reforma-previsional-2025-que-cambia-y-como-te-afecta",
        href: "/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/",
        title: "Reforma previsional 2025: qué cambia, cuándo y cómo te afecta",
        summary:
          "Resume qué ya rige, qué entra por etapas y qué no debería confundirse con descuentos al trabajador.",
      },
    ],
    related: [
      {
        slug: "cuanto-descuenta-la-afp-de-tu-sueldo",
        href: "/posts/cuanto-descuenta-la-afp-de-tu-sueldo/",
        title:
          "Descuento AFP en tu sueldo: cotización obligatoria, comisión y cómo revisarlo",
        summary:
          "Sirve como salida lateral cuando la duda real es leer la liquidación o entender el impacto mensual en el sueldo.",
        rationale:
          "Su owner canónico vive en sueldo y remuneraciones, no en el núcleo previsional obligatorio.",
      },
      {
        slug: "que-es-el-apv",
        href: "/posts/que-es-el-apv/",
        title: "APV: ahorro con beneficio tributario",
        summary:
          "Se enlaza aquí solo como instrumento relacionado para comparar contra Cuenta 2 o decisiones previsionales vecinas.",
        rationale:
          "Su owner canónico vive en ahorro e inversión; este hub no puede absorberlo como core AFP.",
      },
    ],
  },
};

/**
 * @param {string} cluster
 * @returns {HubArticleAssignmentSet}
 */
export function getHubArticleAssignments(cluster) {
  return HUB_ARTICLE_ASSIGNMENTS[cluster] ?? { core: [], related: [] };
}
