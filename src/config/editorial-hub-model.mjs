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
  "deuda-credito": {
    core: [
      {
        slug: "cae-costo-real-credito-chile",
        href: "/posts/cae-costo-real-credito-chile/",
        title:
          "CAE de un crédito: qué es, cómo leerla y cuándo te sirve comparar",
        summary:
          "Aterriza el costo real del crédito para que no compares solo la cuota o la tasa nominal.",
      },
      {
        slug: "informe-deudas-cmf-vs-dicom",
        href: "/posts/informe-deudas-cmf-vs-dicom/",
        title:
          "Informe de deudas CMF: cómo sacarlo, qué dice y por qué no es lo mismo que DICOM",
        summary:
          "Aclara qué muestra el informe oficial, qué no incluye y cómo usarlo para ordenar tu situación financiera.",
      },
      {
        slug: "renegociacion-superir",
        href: "/posts/renegociacion-superir/",
        title:
          "Renegociación Superir: qué es, quién puede pedir y cómo hacerlo sin abogado",
        summary:
          "Explica quién puede pedir la renegociación, qué documentos reunir y cómo evitar rechazos.",
      },
    ],
    related: [
      {
        slug: "que-es-la-uf",
        href: "/posts/que-es-la-uf/",
        title:
          "UF en simple: qué es, por qué sube todos los días y cómo te afecta",
        summary:
          "Sirve como salida relacionada cuando una cuota, arriendo u otra obligación está en UF y necesitas entender el reajuste antes de decidir qué hacer.",
        rationale:
          "Su owner canónico ya vive en uf-costo-de-vida; este hub solo puede usarla como puente relacionado cuando la duda nace desde una obligación reajustable.",
      },
    ],
  },
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
  "uf-costo-de-vida": {
    core: [
      {
        slug: "que-es-la-uf",
        href: "/posts/que-es-la-uf/",
        title:
          "UF en simple: qué es, por qué sube todos los días y cómo te afecta",
        summary:
          "Es la base del frente: explica la unidad que traduce la inflación a arriendos, dividendos y otros montos reajustables.",
      },
      {
        slug: "que-es-el-ipc-chile-como-se-calcula",
        href: "/posts/que-es-el-ipc-chile-como-se-calcula/",
        title:
          "Qué es el IPC en Chile: cómo se calcula y por qué afecta tu bolsillo",
        summary:
          "Aterriza el índice que mueve la inflación mensual y ayuda a leer por qué la UF y otros ajustes terminan pegando en tus gastos.",
      },
      {
        slug: "reajuste-arriendo-uf-ipc-chile",
        href: "/posts/reajuste-arriendo-uf-ipc-chile/",
        title:
          "Reajuste de arriendo en Chile: cuándo aplica, UF vs IPC y cómo calcularlo",
        summary:
          "Convierte la teoría en una cláusula concreta: qué manda el contrato, cuándo corresponde el reajuste y cómo estimarlo sin confusiones.",
      },
    ],
    related: [],
  },
};

/**
 * @param {string} cluster
 * @returns {HubArticleAssignmentSet}
 */
export function getHubArticleAssignments(cluster) {
  return HUB_ARTICLE_ASSIGNMENTS[cluster] ?? { core: [], related: [] };
}
