import type { LinkCard, LinkSection } from "@/config/sueldoClusterLinks";

const pensionHubCard: LinkCard = {
  kind: "Sección",
  title: "Pensiones y AFP",
  description:
    "Ordena el frente previsional por decisión: reforma, fondos, AFP, Cuenta 2 y comparaciones cercanas.",
  href: "/guias/pensiones-afp/",
  cta: "Ver sección previsional",
};

const reformaCard: LinkCard = {
  kind: "Guía",
  title: "Reforma previsional 2025",
  description:
    "Aclara qué cambió hoy, qué entra después y por qué el 7% del empleador no equivale a 7% directo en tu AFP.",
  href: "/posts/reforma-previsional-2025-que-cambia-y-como-te-afecta/",
  cta: "Entender el cronograma",
};

const fondosCard: LinkCard = {
  kind: "Guía",
  title: "Fondos AFP A, B, C, D y E",
  description:
    "Sirve para decidir riesgo y horizonte mientras los multifondos siguen vigentes en 2026.",
  href: "/posts/fondos-afp-a-b-c-d-e/",
  cta: "Elegir fondo",
};

const cambioAfpCard: LinkCard = {
  kind: "Guía",
  title: "Cómo cambiarse de AFP",
  description:
    "Úsala si tu decisión ya no es el fondo, sino cambiar administradora y revisar el trámite.",
  href: "/posts/como-cambiarse-de-afp/",
  cta: "Revisar trámite",
};

const cuenta2Card: LinkCard = {
  kind: "Guía",
  title: "Cuenta 2 de la AFP",
  description:
    "Te ayuda cuando buscas ahorro previsional más líquido y quieres compararlo con APV.",
  href: "/posts/que-es-la-cuenta-2-afp/",
  cta: "Comparar con APV",
};

const apvGuideCard: LinkCard = {
  kind: "Relacionado",
  title: "APV: beneficio tributario",
  description:
    "El owner de APV vive en ahorro e inversión, pero aquí entra como comparación directa contra Cuenta 2 y decisiones previsionales cercanas.",
  href: "/posts/que-es-el-apv/",
  cta: "Ir a APV",
};

const apvCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Simulador APV",
  description:
    "Compara Régimen A, B o una mezcla según tu base imponible y beneficio tributario de hoy.",
  href: "/calculadoras/apv/",
  cta: "Comparar regímenes",
};

const retirementCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Simulador de jubilación",
  description:
    "Proyecta saldo AFP y pensión estimada sin sumar como saldo propio los componentes colectivos de la reforma.",
  href: "/calculadoras/simulador-jubilacion/",
  cta: "Proyectar jubilación",
};

export const pensionHubPrimaryCards: LinkCard[] = [
  reformaCard,
  fondosCard,
  cambioAfpCard,
  cuenta2Card,
];

export const pensionHubRelatedCards: LinkCard[] = [
  apvGuideCard,
  apvCalculatorCard,
  retirementCalculatorCard,
];

const pensionArticleSectionsBySlug: Record<string, LinkSection[]> = {
  "reforma-previsional-2025-que-cambia-y-como-te-afecta": [
    {
      eyebrow: "Siguiente paso",
      title: "Usa la reforma como mapa, no como respuesta única",
      description:
        "Después de entender el calendario, separa si tu decisión real hoy es elegir fondos, comparar APV o revisar cuánto entra efectivamente a tu cuenta individual.",
      items: [
        fondosCard,
        apvCalculatorCard,
        retirementCalculatorCard,
        pensionHubCard,
      ],
    },
    {
      eyebrow: "Relacionado",
      title: "Si tu pregunta cambió, salta a la decisión correcta",
      description:
        "No todo lo que toca pensiones se resuelve leyendo la reforma. Estas rutas cubren decisiones más cercanas al bolsillo o al instrumento.",
      items: [cambioAfpCard, cuenta2Card, apvGuideCard],
    },
  ],
  "fondos-afp-a-b-c-d-e": [
    {
      eyebrow: "Siguiente paso",
      title: "Pasa del fondo a la decisión previsional completa",
      description:
        "Elegir multifondo no reemplaza revisar AFP, transición a fondos generacionales ni resultado de largo plazo.",
      items: [
        cambioAfpCard,
        reformaCard,
        retirementCalculatorCard,
        pensionHubCard,
      ],
    },
    {
      eyebrow: "Comparaciones cercanas",
      title: "No mezcles fondo AFP con APV o Cuenta 2",
      description:
        "Si tu pregunta dejó de ser riesgo de multifondo y pasó a ser beneficio tributario o liquidez, cambia de ruta.",
      items: [apvGuideCard, apvCalculatorCard, cuenta2Card],
    },
  ],
  "que-es-el-apv": [
    {
      eyebrow: "Siguiente paso",
      title: "Convierte la lógica tributaria en una decisión real",
      description:
        "Después de entender A, B o mixta, usa el simulador y cruza con Cuenta 2 o reforma si la duda ya cambió.",
      items: [apvCalculatorCard, cuenta2Card, reformaCard, pensionHubCard],
    },
    {
      eyebrow: "No es lo mismo que",
      title: "Distingue APV, fondos AFP y pensión futura",
      description:
        "Estas piezas existen para que no mezcles beneficio tributario, elección de fondo y proyección de jubilación como si fueran la misma conversación.",
      items: [fondosCard, retirementCalculatorCard, cambioAfpCard],
    },
  ],
};

export function getPensionArticleSections(slug: string): LinkSection[] {
  return pensionArticleSectionsBySlug[slug] ?? [];
}
