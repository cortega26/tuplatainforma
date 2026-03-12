export const CALCULATOR_FAMILY_ORDER = [
  "ingresos",
  "ahorro-prevision",
  "deuda-credito",
  "vivienda-uf",
] as const;

export type CalculatorFamilyId = (typeof CALCULATOR_FAMILY_ORDER)[number];

export type CalculatorAlternative = {
  href: string;
  label: string;
  when: string;
};

export type CalculatorPortfolioEntry = {
  href: string;
  slug: string;
  title: string;
  description: string;
  icon: string;
  tag: string;
  family: CalculatorFamilyId;
  primaryJtbd: string;
  whenToUse: string;
  notFor: string;
  related: CalculatorAlternative[];
};

export type CalculatorFamilyMeta = {
  title: string;
  description: string;
  chooserPrompt: string;
};

export type CalculatorDecisionGuide = {
  title: string;
  situation: string;
  recommendedHref: string;
  recommendedLabel: string;
  why: string;
};

export const CALCULATOR_FAMILIES: Record<
  CalculatorFamilyId,
  CalculatorFamilyMeta
> = {
  ingresos: {
    title: "Ingresos y protección laboral",
    description:
      "Para decisiones del mes: cuánto entra a tu cuenta, cuánto cubre el seguro de cesantía y qué pasa si se corta el ingreso laboral.",
    chooserPrompt:
      "Úsala cuando tu pregunta nace en la liquidación de sueldo o en una contingencia laboral concreta.",
  },
  "ahorro-prevision": {
    title: "Ahorro y previsión",
    description:
      "Para decidir entre beneficio tributario hoy y saldo previsional de largo plazo, sin mezclar ambas preguntas en una sola herramienta.",
    chooserPrompt:
      "Parte aquí si la decisión es APV o pensión futura, no si buscas cuánto ganas este mes.",
  },
  "deuda-credito": {
    title: "Deuda y crédito",
    description:
      "Separa cuatro momentos distintos: cotizar un crédito nuevo, medir una deuda ya usada, evaluar un prepago o revisar una salida formal.",
    chooserPrompt:
      "La frontera clave es si la deuda todavía no existe, ya existe pero puedes seguir pagándola, o ya no puedes sostenerla.",
  },
  "vivienda-uf": {
    title: "Vivienda, UF y reajustes",
    description:
      "Para convertir montos, revisar cláusulas en UF o IPC y calcular cuánto cambia un arriendo sin mezclarlo con decisiones de deuda.",
    chooserPrompt:
      "Úsala si tu duda viene de una cláusula de contrato o de un monto indexado, no de una cuota crediticia.",
  },
};

export const CALCULATOR_PORTFOLIO: CalculatorPortfolioEntry[] = [
  {
    href: "/calculadoras/sueldo-liquido/",
    slug: "sueldo-liquido",
    title: "Calculadora de Sueldo Líquido",
    description:
      "Calcula tu líquido mensual con AFP, salud e impuesto único, y revisa el desglose de descuentos.",
    icon: "💰",
    tag: "Más usada",
    family: "ingresos",
    primaryJtbd: "Saber cuánto llega a tu cuenta este mes.",
    whenToUse:
      "Cuando estás comparando bruto vs líquido, revisando una oferta o chequeando tu liquidación.",
    notFor:
      "No sirve para proyectar cesantía ni para decidir un APV de largo plazo.",
    related: [
      {
        href: "/calculadoras/seguro-cesantia/",
        label: "Seguro de cesantía",
        when: "si el problema ya no es el sueldo del mes, sino cuánto aguanta tu cobertura si pierdes el trabajo.",
      },
    ],
  },
  {
    href: "/calculadoras/seguro-cesantia/",
    slug: "seguro-cesantia",
    title: "Seguro de Cesantía",
    description:
      "Estima saldo CIC, acceso al fondo solidario y cobertura mensual según contrato, causal y cotizaciones.",
    icon: "🛡️",
    tag: "Contingencia",
    family: "ingresos",
    primaryJtbd:
      "Estimar cuánto colchón laboral tienes si se corta el ingreso.",
    whenToUse:
      "Cuando perdiste la pega, estás evaluando tu riesgo o quieres revisar si cumples mínimos AFC.",
    notFor:
      "No reemplaza el cálculo de sueldo líquido ni una simulación de pensión.",
    related: [
      {
        href: "/calculadoras/sueldo-liquido/",
        label: "Sueldo líquido",
        when: "si todavía estás en etapa de revisar descuentos mensuales y no una salida por cesantía.",
      },
    ],
  },
  {
    href: "/calculadoras/apv/",
    slug: "apv",
    title: "Simulador APV",
    description:
      "Compara Régimen A y B con foco en ahorro tributario, renta imponible y beneficio mensual estimado.",
    icon: "📈",
    tag: "Decisión APV",
    family: "ahorro-prevision",
    primaryJtbd:
      "Elegir cómo aportar al APV según el beneficio tributario que realmente puedes capturar hoy.",
    whenToUse:
      "Cuando ya decidiste evaluar APV y necesitas comparar régimen A, B o una mezcla.",
    notFor:
      "No sirve para proyectar pensión total ni reemplaza un plan previsional completo.",
    related: [
      {
        href: "/calculadoras/simulador-jubilacion/",
        label: "Simulador de jubilación",
        when: "si tu pregunta principal es cuánto saldo o pensión podrías tener al jubilar, no qué régimen APV conviene este año.",
      },
    ],
  },
  {
    href: "/calculadoras/simulador-jubilacion/",
    slug: "simulador-jubilacion",
    title: "Simulador de Jubilación",
    description:
      "Proyecta saldo AFP y pensión estimada considerando edad, ahorro actual, rentabilidad y cronograma previsional.",
    icon: "🏖️",
    tag: "Largo plazo",
    family: "ahorro-prevision",
    primaryJtbd:
      "Traducir tu ahorro previsional a un escenario de pensión futura.",
    whenToUse:
      "Cuando quieres mirar saldo final, edad de retiro o sensibilidad a tus aportes.",
    notFor:
      "No es la herramienta correcta para comparar el beneficio tributario inmediato del APV.",
    related: [
      {
        href: "/calculadoras/apv/",
        label: "Simulador APV",
        when: "si la decisión inmediata es cómo hacer el aporte APV y no cuánto capital acumularás al final.",
      },
    ],
  },
  {
    href: "/calculadoras/credito-consumo/",
    slug: "credito-consumo",
    title: "Calculadora de Crédito de Consumo",
    description:
      "Evalúa una oferta nueva con cuota, interés total, CAE y costos adicionales antes de firmar.",
    icon: "🏦",
    tag: "Oferta nueva",
    family: "deuda-credito",
    primaryJtbd: "Comparar ofertas antes de tomar una deuda nueva.",
    whenToUse:
      "Cuando el crédito todavía no existe y necesitas decidir si firmar o no.",
    notFor:
      "No modela deudas ya cursadas, pagos mínimos de tarjeta ni escenarios de prepago.",
    related: [
      {
        href: "/calculadoras/tarjeta-credito/",
        label: "Tarjeta de crédito",
        when: "si la deuda ya está usada y tu problema es el costo de pagar el mínimo.",
      },
      {
        href: "/calculadoras/prepago-credito/",
        label: "Prepago de crédito",
        when: "si el crédito ya existe y estás evaluando un abono extraordinario.",
      },
    ],
  },
  {
    href: "/calculadoras/tarjeta-credito/",
    slug: "tarjeta-credito",
    title: "Costo Real Tarjeta de Crédito",
    description:
      "Mide cuánto cuesta pagar el mínimo o una cuota fija sobre una deuda ya usada en tu tarjeta.",
    icon: "💳",
    tag: "Deuda usada",
    family: "deuda-credito",
    primaryJtbd:
      "Entender cuánto te cuesta sostener una deuda rotativa que ya existe.",
    whenToUse:
      "Cuando el consumo ya ocurrió y necesitas ver meses, intereses y costo total del pago mínimo.",
    notFor: "No compara créditos nuevos ni reemplaza una renegociación formal.",
    related: [
      {
        href: "/calculadoras/credito-consumo/",
        label: "Crédito de consumo",
        when: "si todavía estás evaluando una oferta nueva y no una deuda rotativa ya cursada.",
      },
      {
        href: "/calculadoras/simulador-renegociacion/",
        label: "Simulador de renegociación",
        when: "si ya no puedes sostener los pagos y necesitas revisar una salida formal.",
      },
    ],
  },
  {
    href: "/calculadoras/prepago-credito/",
    slug: "prepago-credito",
    title: "¿Conviene prepagar el crédito?",
    description:
      "Compara el ahorro por prepago contra la alternativa de invertir o guardar ese dinero.",
    icon: "💡",
    tag: "Abono extra",
    family: "deuda-credito",
    primaryJtbd:
      "Decidir si un monto extraordinario conviene más como prepago o como otra reserva.",
    whenToUse:
      "Cuando el crédito ya existe y tienes caja disponible para hacer un abono.",
    notFor:
      "No sirve para cotizar un préstamo desde cero ni para estimar una salida por insolvencia.",
    related: [
      {
        href: "/calculadoras/credito-consumo/",
        label: "Crédito de consumo",
        when: "si el préstamo todavía no está tomado y tu decisión es si firmarlo.",
      },
      {
        href: "/calculadoras/simulador-renegociacion/",
        label: "Simulador de renegociación",
        when: "si el problema dejó de ser optimización y pasó a ser imposibilidad real de pago.",
      },
    ],
  },
  {
    href: "/calculadoras/simulador-renegociacion/",
    slug: "simulador-renegociacion",
    title: "Simulador Renegociación Superir",
    description:
      "Revisa si calificas para la renegociación gratuita y estima una cuota bajo ese camino formal.",
    icon: "⚖️",
    tag: "Salida formal",
    family: "deuda-credito",
    primaryJtbd:
      "Saber si todavía estás en modo optimización o ya necesitas una salida formal de deudas.",
    whenToUse:
      "Cuando tus deudas te superan y necesitas revisar elegibilidad para renegociar.",
    notFor:
      "No reemplaza una comparación de crédito nuevo ni un cálculo de pago mínimo.",
    related: [
      {
        href: "/calculadoras/prepago-credito/",
        label: "Prepago de crédito",
        when: "si aún puedes ordenar un crédito vigente con caja extra y no necesitas un proceso formal.",
      },
      {
        href: "/calculadoras/tarjeta-credito/",
        label: "Tarjeta de crédito",
        when: "si primero quieres dimensionar una sola deuda rotativa antes de pasar a una solución más estructural.",
      },
    ],
  },
  {
    href: "/calculadoras/conversor-uf/",
    slug: "conversor-uf",
    title: "Conversor UF ↔ Pesos",
    description:
      "Convierte entre UF y pesos al valor oficial del día con una referencia simple para cotizaciones y contratos.",
    icon: "🔄",
    tag: "Referencia",
    family: "vivienda-uf",
    primaryJtbd:
      "Traducir un monto indexado a UF o pesos sin agregar reglas contractuales extra.",
    whenToUse: "Cuando solo necesitas equivalencia actual entre UF y CLP.",
    notFor: "No calcula reajustes ni interpreta cláusulas de arriendo.",
    related: [
      {
        href: "/calculadoras/reajuste-arriendo/",
        label: "Reajuste de arriendo",
        when: "si además de convertir necesitas recalcular una renta según UF, IPC o pesos.",
      },
    ],
  },
  {
    href: "/calculadoras/reajuste-arriendo/",
    slug: "reajuste-arriendo",
    title: "Reajuste de Arriendo",
    description:
      "Calcula cuánto sube un arriendo según UF, IPC o pesos fijos y revisa la lógica de la cláusula.",
    icon: "🏠",
    tag: "Contrato",
    family: "vivienda-uf",
    primaryJtbd:
      "Recalcular un arriendo con la regla exacta que aparece en el contrato.",
    whenToUse:
      "Cuando tienes una cláusula de reajuste y quieres aterrizarla a un nuevo monto.",
    notFor:
      "No reemplaza un conversor simple si solo buscas equivalencia UF a pesos.",
    related: [
      {
        href: "/calculadoras/conversor-uf/",
        label: "Conversor UF",
        when: "si no necesitas aplicar una cláusula y solo quieres convertir montos.",
      },
    ],
  },
];

export const CALCULATOR_DECISION_GUIDES: CalculatorDecisionGuide[] = [
  {
    title: "Quiero saber cuánto me queda este mes",
    situation:
      "Tienes un sueldo bruto, una oferta laboral o una liquidación y tu pregunta es bruto vs líquido.",
    recommendedHref: "/calculadoras/sueldo-liquido/",
    recommendedLabel: "Calculadora de Sueldo Líquido",
    why: "Te responde el depósito mensual; no mezcla esa duda con APV ni pensión futura.",
  },
  {
    title: "Quiero medir mi colchón si pierdo la pega",
    situation:
      "La duda no es el sueldo del mes, sino cuánta cobertura real tienes por AFC.",
    recommendedHref: "/calculadoras/seguro-cesantia/",
    recommendedLabel: "Seguro de Cesantía",
    why: "Modela saldo CIC, causal y mínimos de acceso en vez de descuentos de planilla.",
  },
  {
    title: "Estoy decidiendo un aporte APV",
    situation:
      "Necesitas comparar régimen A, B o una combinación por el beneficio tributario de hoy.",
    recommendedHref: "/calculadoras/apv/",
    recommendedLabel: "Simulador APV",
    why: "Se enfoca en la decisión tributaria del aporte, no en el saldo final de jubilación.",
  },
  {
    title: "Quiero proyectar mi pensión futura",
    situation:
      "Tu pregunta principal es saldo AFP, edad de retiro o resultado previsional de largo plazo.",
    recommendedHref: "/calculadoras/simulador-jubilacion/",
    recommendedLabel: "Simulador de Jubilación",
    why: "Te conviene cuando la conversación ya no es el aporte APV aislado, sino el resultado total.",
  },
  {
    title: "Todavía no firmo el crédito",
    situation:
      "Estás comparando una oferta nueva y quieres revisar cuota, interés y CAE antes de tomarla.",
    recommendedHref: "/calculadoras/credito-consumo/",
    recommendedLabel: "Crédito de Consumo",
    why: "Es la única del portafolio diseñada para una deuda que aún no existe.",
  },
  {
    title: "La deuda ya existe y es una tarjeta",
    situation:
      "Ya hiciste consumos y quieres medir el costo real de pagar el mínimo o una cuota fija.",
    recommendedHref: "/calculadoras/tarjeta-credito/",
    recommendedLabel: "Costo Real Tarjeta de Crédito",
    why: "No sirve cotizar un crédito nuevo si el problema ya es una deuda rotativa en curso.",
  },
  {
    title: "Tengo plata extra y evalúo un abono",
    situation:
      "El crédito sigue vigente, pero tu decisión es si conviene prepagar o guardar ese dinero.",
    recommendedHref: "/calculadoras/prepago-credito/",
    recommendedLabel: "Prepago de Crédito",
    why: "Resuelve una decisión de optimización sobre una deuda existente, no una salida por insolvencia.",
  },
  {
    title: "Ya no puedo sostener las deudas",
    situation:
      "Necesitas revisar si calificas para una renegociación formal y no solo simular una cuota aislada.",
    recommendedHref: "/calculadoras/simulador-renegociacion/",
    recommendedLabel: "Simulador Renegociación Superir",
    why: "Marca la frontera entre optimizar una deuda y entrar a un proceso formal de alivio.",
  },
  {
    title: "Solo necesito convertir UF a pesos",
    situation:
      "Tienes un valor en UF o CLP y buscas una equivalencia simple al valor oficial del día.",
    recommendedHref: "/calculadoras/conversor-uf/",
    recommendedLabel: "Conversor UF ↔ Pesos",
    why: "Es referencia pura; no agrega supuestos de arriendo ni interpreta cláusulas.",
  },
  {
    title: "Necesito recalcular un arriendo",
    situation:
      "Tienes una cláusula en UF, IPC o pesos fijos y quieres ver el nuevo monto del contrato.",
    recommendedHref: "/calculadoras/reajuste-arriendo/",
    recommendedLabel: "Reajuste de Arriendo",
    why: "Aplica la regla del contrato; un conversor simple no alcanza para esa decisión.",
  },
];
