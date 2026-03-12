export type LinkCard = {
  kind: string;
  title: string;
  description: string;
  href: string;
  cta: string;
};

export type LinkSection = {
  eyebrow?: string;
  title: string;
  description: string;
  items: LinkCard[];
};

const sueldoHubCard: LinkCard = {
  kind: "Sección",
  title: "Sueldo y remuneraciones",
  description:
    "Reúne la guía, la calculadora y las ayudas clave para entender tu sueldo líquido.",
  href: "/guias/sueldo-remuneraciones/",
  cta: "Ver la sección",
};

const sueldoCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Calculadora de sueldo líquido",
  description:
    "Convierte sueldo bruto a líquido con AFP, salud, cesantía e impuesto único en un solo cálculo.",
  href: "/calculadoras/sueldo-liquido/",
  cta: "Calcular sueldo líquido",
};

const sueldoGuideCard: LinkCard = {
  kind: "Guía",
  title: "Cómo calcular tu sueldo líquido",
  description:
    "Explica imponible, descuentos obligatorios, impuesto único y lectura de la liquidación.",
  href: "/posts/como-calcular-sueldo-liquido/",
  cta: "Leer la guía",
};

const afpDiscountCard: LinkCard = {
  kind: "Artículo",
  title: "Cuánto descuenta la AFP de tu sueldo",
  description:
    "Explica el 10% obligatorio, la comisión y cómo ese descuento afecta tu sueldo líquido.",
  href: "/posts/cuanto-descuenta-la-afp-de-tu-sueldo/",
  cta: "Ver el desglose AFP",
};

const honorariosCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Boleta de honorarios 2026",
  description:
    "Úsala si tu ingreso nace en boletas y necesitas separar retención, líquido y cobertura anual orientativa.",
  href: "/calculadoras/boleta-honorarios-liquido/",
  cta: "Calcular líquido por boleta",
};

const empleoHubCard: LinkCard = {
  kind: "Sección",
  title: "Empleo e ingresos",
  description:
    "Pasa aquí cuando el problema ya no es la liquidación del mes sino finiquito, cesantía o interrupción del ingreso.",
  href: "/guias/empleo-ingresos/",
  cta: "Ir a empleo e ingresos",
};

const descuentosCard: LinkCard = {
  kind: "Artículo",
  title: "Descuentos de sueldo en Chile",
  description:
    "Separa descuentos obligatorios, autorizados y prohibidos para que la liquidación no parezca una caja negra.",
  href: "/posts/descuentos-de-sueldo/",
  cta: "Revisar descuentos",
};

const liquidacionCard: LinkCard = {
  kind: "Artículo",
  title: "Liquidación de sueldo: cómo leerla",
  description:
    "Explica haberes, descuentos y el checklist mínimo para detectar errores antes de aceptar la liquidación.",
  href: "/posts/liquidacion-de-sueldo/",
  cta: "Leer la liquidación",
};

const glossaryAfpCard: LinkCard = {
  kind: "Glosario",
  title: "Qué es una AFP",
  description:
    "Aclara qué parte del descuento va a tu cuenta y qué parte corresponde a administración.",
  href: "/glosario/afp/",
  cta: "Abrir definición",
};

const glossaryAfcCard: LinkCard = {
  kind: "Glosario",
  title: "Qué es la AFC",
  description:
    "Explica por qué aparece el seguro de cesantía en la liquidación y quién lo administra.",
  href: "/glosario/afc/",
  cta: "Revisar término",
};

const taxLawCard: LinkCard = {
  kind: "Ley",
  title: "Ley de Impuesto a la Renta",
  description:
    "Base legal del impuesto único de segunda categoría y de los tramos que afectan tu líquido.",
  href: "/leyes/dl-824-impuesto-renta/",
  cta: "Ver ficha legal",
};

const unemploymentLawCard: LinkCard = {
  kind: "Ley",
  title: "Ley del Seguro de Cesantía",
  description:
    "Explica quién aporta el 0,6% y cuándo aplica el seguro de cesantía.",
  href: "/leyes/ley-19728-seguro-cesantia/",
  cta: "Ver ficha legal",
};

export const sueldoClusterHubPrimaryCards: LinkCard[] = [
  sueldoGuideCard,
  sueldoCalculatorCard,
  descuentosCard,
  liquidacionCard,
  afpDiscountCard,
  honorariosCalculatorCard,
];

export const sueldoClusterHubSupportCards: LinkCard[] = [
  glossaryAfpCard,
  glossaryAfcCard,
  taxLawCard,
  unemploymentLawCard,
];

export const sueldoCalculatorSections: LinkSection[] = [
  {
    eyebrow: "Siguiente paso",
    title: "Sigue desde el cálculo a la decisión",
    description:
      "Desde aquí puedes revisar la guía paso a paso, entender la liquidación o ver con más detalle los descuentos que afectan tu resultado.",
    items: [
      sueldoHubCard,
      sueldoGuideCard,
      descuentosCard,
      liquidacionCard,
      empleoHubCard,
    ],
  },
  {
    eyebrow: "Aclaraciones",
    title: "Conceptos y reglas que explican el resultado",
    description:
      "Usa estas ayudas si tu sueldo líquido no coincide con lo esperado o no entiendes un descuento.",
    items: [glossaryAfpCard, glossaryAfcCard, taxLawCard, unemploymentLawCard],
  },
];

const sueldoArticleSectionsBySlug: Record<string, LinkSection[]> = {
  "como-calcular-sueldo-liquido": [
    {
      eyebrow: "Siguiente paso",
      title: "Lleva la guía a tus números reales",
      description:
        "Calcula tu sueldo líquido y después revisa descuentos o liquidación si quieres entender de dónde sale cada monto.",
      items: [
        sueldoCalculatorCard,
        descuentosCard,
        liquidacionCard,
        sueldoHubCard,
        empleoHubCard,
      ],
    },
    {
      eyebrow: "Aclaraciones",
      title: "Conceptos y normas que más traban la lectura de la liquidación",
      description:
        "Usa este bloque si el problema no es el cálculo, sino entender qué significa cada descuento.",
      items: [
        glossaryAfpCard,
        glossaryAfcCard,
        taxLawCard,
        unemploymentLawCard,
      ],
    },
  ],
  "cuanto-descuenta-la-afp-de-tu-sueldo": [
    {
      eyebrow: "Siguiente paso",
      title: "Conecta el descuento AFP con tu sueldo líquido total",
      description:
        "El descuento de AFP es solo una parte del cálculo. Aquí puedes revisar el sueldo líquido completo y entender el resto de la liquidación.",
      items: [
        sueldoCalculatorCard,
        descuentosCard,
        liquidacionCard,
        sueldoHubCard,
        empleoHubCard,
      ],
    },
    {
      eyebrow: "Aclaraciones",
      title: "Reglas y definiciones que aclaran el descuento previsional",
      description:
        "Entra aquí si necesitas una definición rápida o quieres revisar la regla legal detrás del descuento previsional.",
      items: [
        glossaryAfpCard,
        glossaryAfcCard,
        taxLawCard,
        unemploymentLawCard,
      ],
    },
  ],
  "descuentos-de-sueldo": [
    {
      eyebrow: "Siguiente paso",
      title: "Pasa del listado de descuentos al cálculo real",
      description:
        "Después de revisar los descuentos, usa estas ayudas para calcular el resultado final y entender cómo aparece en tu liquidación.",
      items: [
        sueldoCalculatorCard,
        sueldoGuideCard,
        liquidacionCard,
        sueldoHubCard,
        honorariosCalculatorCard,
      ],
    },
    {
      eyebrow: "Aclaraciones",
      title: "Descuentos, conceptos y normas para revisar la liquidación",
      description:
        "Úsalos si quieres pasar del porcentaje al detalle de la liquidación o revisar la base legal del descuento.",
      items: [
        afpDiscountCard,
        glossaryAfpCard,
        glossaryAfcCard,
        taxLawCard,
        unemploymentLawCard,
      ],
    },
  ],
  "liquidacion-de-sueldo": [
    {
      eyebrow: "Siguiente paso",
      title: "Convierte la liquidación en un cálculo comprobable",
      description:
        "Si tu liquidación no te cuadra, revisa el cálculo, los descuentos y la guía paso a paso para detectar la diferencia.",
      items: [
        sueldoCalculatorCard,
        sueldoGuideCard,
        descuentosCard,
        sueldoHubCard,
        empleoHubCard,
      ],
    },
    {
      eyebrow: "Aclaraciones",
      title: "Descuentos y soportes que aclaran cada línea",
      description:
        "Aquí puedes entender cada línea de la liquidación con explicaciones sobre AFP, cesantía e impuesto.",
      items: [
        afpDiscountCard,
        glossaryAfpCard,
        glossaryAfcCard,
        taxLawCard,
        unemploymentLawCard,
      ],
    },
  ],
};

export function getSueldoArticleSections(slug: string): LinkSection[] {
  return sueldoArticleSectionsBySlug[slug] ?? [];
}
