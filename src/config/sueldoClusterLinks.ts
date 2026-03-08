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
  kind: "Hub",
  title: "Hub de sueldo y remuneraciones",
  description:
    "Ordena la lectura entre guía, calculadora, descuentos y apoyos legales sin mezclar intenciones.",
  href: "/guias/sueldo-remuneraciones/",
  cta: "Abrir hub",
};

const sueldoCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Calculadora de sueldo líquido",
  description:
    "Convierte bruto a líquido con AFP, salud, cesantía e impuesto único en un solo flujo.",
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
    "Aísla el 10% obligatorio, la comisión y el efecto previsional dentro del descuento mensual.",
  href: "/posts/cuanto-descuenta-la-afp-de-tu-sueldo/",
  cta: "Ver el desglose AFP",
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
    "Sirve para entender por qué aparece el seguro de cesantía en la liquidación y quién lo administra.",
  href: "/glosario/afc/",
  cta: "Revisar término",
};

const taxLawCard: LinkCard = {
  kind: "Marco legal",
  title: "Ley de Impuesto a la Renta",
  description:
    "Base legal del impuesto único de segunda categoría y de los tramos que afectan tu líquido.",
  href: "/leyes/dl-824-impuesto-renta/",
  cta: "Ver ficha legal",
};

const unemploymentLawCard: LinkCard = {
  kind: "Marco legal",
  title: "Ley del Seguro de Cesantía",
  description:
    "Resume quién aporta el 0,6%, cuándo aplica y cómo se financia la cobertura de cesantía.",
  href: "/leyes/ley-19728-seguro-cesantia/",
  cta: "Ver ficha legal",
};

export const sueldoClusterHubPrimaryCards: LinkCard[] = [
  sueldoGuideCard,
  sueldoCalculatorCard,
  descuentosCard,
  liquidacionCard,
  afpDiscountCard,
];

export const sueldoClusterHubSupportCards: LinkCard[] = [
  glossaryAfpCard,
  glossaryAfcCard,
  taxLawCard,
  unemploymentLawCard,
];

export const sueldoCalculatorSections: LinkSection[] = [
  {
    eyebrow: "Ruta del cluster",
    title: "Sigue desde el cálculo a la decisión",
    description:
      "Usa el hub para elegir si necesitas explicación paso a paso, lectura de la liquidación, un desglose AFP o ambas cosas.",
    items: [sueldoHubCard, sueldoGuideCard, descuentosCard, liquidacionCard],
  },
  {
    eyebrow: "Soporte",
    title: "Conceptos y reglas que explican el resultado",
    description:
      "Estos apoyos resuelven las dudas más comunes cuando el líquido no coincide con lo esperado.",
    items: [glossaryAfpCard, glossaryAfcCard, taxLawCard, unemploymentLawCard],
  },
];

const sueldoArticleSectionsBySlug: Record<string, LinkSection[]> = {
  "como-calcular-sueldo-liquido": [
    {
      eyebrow: "Siguiente paso",
      title: "Lleva la guía a tus números reales",
      description:
        "Primero calcula tu líquido y luego usa los satélites para bajar al nivel de descuento o lectura de liquidación que te falte.",
      items: [
        sueldoCalculatorCard,
        descuentosCard,
        liquidacionCard,
        sueldoHubCard,
      ],
    },
    {
      eyebrow: "Apoyo contextual",
      title: "Conceptos y normas que más traban la lectura de la liquidación",
      description:
        "Usa este bloque cuando la duda ya no es matemática sino de interpretación del descuento.",
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
        "La comisión previsional por sí sola no explica el depósito final: aquí tienes la calculadora y las páginas que completan la lectura.",
      items: [
        sueldoCalculatorCard,
        descuentosCard,
        liquidacionCard,
        sueldoHubCard,
      ],
    },
    {
      eyebrow: "Apoyo contextual",
      title: "Reglas y definiciones que aclaran el descuento previsional",
      description:
        "Cuando el lector necesita respaldo legal o una definición rápida, este bloque evita mandar tráfico a páginas genéricas.",
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
        "Después de distinguir lo obligatorio de lo voluntario, usa estas piezas para reconstruir el monto exacto.",
      items: [
        sueldoCalculatorCard,
        sueldoGuideCard,
        liquidacionCard,
        sueldoHubCard,
      ],
    },
    {
      eyebrow: "Apoyo contextual",
      title:
        "Activos del cluster para revisar fundamento y lectura de la liquidación",
      description:
        "Estos enlaces sirven cuando la duda cambia desde el porcentaje al documento o al respaldo legal.",
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
        "Si la liquidación te deja dudas, usa estas piezas para separar descuento, cálculo y navegación del cluster.",
      items: [
        sueldoCalculatorCard,
        sueldoGuideCard,
        descuentosCard,
        sueldoHubCard,
      ],
    },
    {
      eyebrow: "Apoyo contextual",
      title: "Descuentos y soportes que aclaran cada línea",
      description:
        "Este bloque conecta la lectura del documento con la explicación de AFP, cesantía e impuesto.",
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
