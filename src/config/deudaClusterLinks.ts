import type { LinkCard, LinkSection } from "./sueldoClusterLinks";

const deudaHubCard: LinkCard = {
  kind: "Sección",
  title: "Deuda y crédito",
  description:
    "Ordena el journey entre diagnóstico, costo real del crédito y salidas formales cuando la deuda ya no se sostiene.",
  href: "/guias/deuda-credito/",
  cta: "Volver al hub",
};

const informeCmfCard: LinkCard = {
  kind: "Guía",
  title: "Informe de deudas CMF vs DICOM",
  description:
    "Aclara qué deudas financieras vigentes aparecen a tu nombre y qué no puedes inferir desde ese reporte.",
  href: "/posts/informe-deudas-cmf-vs-dicom/",
  cta: "Diagnosticar mis deudas",
};

const dicomGratisCard: LinkCard = {
  kind: "Artículo",
  title: "Dónde ver si estás en DICOM gratis",
  description:
    "Separa Informe CMF, Boletín Comercial y reportes privados para no pagar por el reporte equivocado.",
  href: "/posts/donde-ver-si-estoy-en-dicom-gratis/",
  cta: "Separar reportes",
};

const caeGuideCard: LinkCard = {
  kind: "Guía",
  title: "CAE y costo real del crédito",
  description:
    "Sirve cuando todavía estás comparando una oferta o una repactación y necesitas ver más que la cuota.",
  href: "/posts/cae-costo-real-credito-chile/",
  cta: "Entender el costo real",
};

const renegociacionGuideCard: LinkCard = {
  kind: "Guía",
  title: "Renegociación Superir",
  description:
    "Explica el filtro legal mínimo, los documentos y el paso a paso cuando ya estás sobreendeudado.",
  href: "/posts/renegociacion-superir/",
  cta: "Revisar salida formal",
};

const creditCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Calculadora de crédito de consumo",
  description:
    "Úsala para comparar una oferta nueva con cuota, CAE, intereses y costos iniciales.",
  href: "/calculadoras/credito-consumo/",
  cta: "Simular oferta",
};

const tarjetaCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Costo real de tarjeta de crédito",
  description:
    "Mide qué pasa si pagas el mínimo o una cuota fija sobre una deuda rotativa ya usada.",
  href: "/calculadoras/tarjeta-credito/",
  cta: "Medir deuda rotativa",
};

const prepagoCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Prepago de crédito",
  description:
    "Compara cuánto ahorras por prepagar frente a guardar esa caja para otra urgencia.",
  href: "/calculadoras/prepago-credito/",
  cta: "Evaluar prepago",
};

const renegociacionCalculatorCard: LinkCard = {
  kind: "Calculadora",
  title: "Simulador Renegociación Superir",
  description:
    "Separa el filtro legal básico de una simulación de cuota para no confundir elegibilidad con conveniencia.",
  href: "/calculadoras/simulador-renegociacion/",
  cta: "Filtrar elegibilidad",
};

const ufBridgeCard: LinkCard = {
  kind: "Puente",
  title: "UF, inflación y costo de vida",
  description:
    "Entra aquí si tu cuota o repactación está en UF y la duda real es el reajuste, no el reporte ni la mora.",
  href: "/posts/que-es-la-uf/",
  cta: "Entender la UF",
};

export const deudaClusterHubDecisionCards: LinkCard[] = [
  informeCmfCard,
  dicomGratisCard,
  caeGuideCard,
  renegociacionGuideCard,
];

export const deudaClusterHubToolCards: LinkCard[] = [
  creditCalculatorCard,
  tarjetaCalculatorCard,
  prepagoCalculatorCard,
  renegociacionCalculatorCard,
];

const deudaArticleSectionsBySlug: Record<string, LinkSection[]> = {
  "informe-deudas-cmf-vs-dicom": [
    {
      eyebrow: "Siguiente paso",
      title: "Convierte el informe en una decisión concreta",
      description:
        "Después del diagnóstico puedes separar si el problema es reporte comercial, sobreendeudamiento o costo real de una obligación que todavía estás evaluando.",
      items: [
        dicomGratisCard,
        renegociacionGuideCard,
        renegociacionCalculatorCard,
        caeGuideCard,
        deudaHubCard,
      ],
    },
    {
      eyebrow: "No mezcles",
      title: "Problemas vecinos que parecen lo mismo y no lo son",
      description:
        "Usa estas salidas cuando tu duda ya no es el reporte sino la cuota, el prepago o una obligación reajustable en UF.",
      items: [
        creditCalculatorCard,
        tarjetaCalculatorCard,
        prepagoCalculatorCard,
        ufBridgeCard,
        deudaHubCard,
      ],
    },
  ],
  "donde-ver-si-estoy-en-dicom-gratis": [
    {
      eyebrow: "Primero separa",
      title: "Parte por el reporte correcto",
      description:
        "La consulta gratis útil cambia según si buscas deuda financiera vigente, protestos o un problema de mora que ya requiere acción.",
      items: [
        informeCmfCard,
        deudaHubCard,
        renegociacionGuideCard,
        renegociacionCalculatorCard,
        ufBridgeCard,
      ],
    },
    {
      eyebrow: "Después del reporte",
      title: "Qué hacer cuando ya viste el problema",
      description:
        "No te quedes solo con el dato: desde aquí puedes medir costo real, ordenar una deuda rotativa o pasar a una salida formal.",
      items: [
        caeGuideCard,
        creditCalculatorCard,
        tarjetaCalculatorCard,
        prepagoCalculatorCard,
        renegociacionGuideCard,
      ],
    },
  ],
  "cae-costo-real-credito-chile": [
    {
      eyebrow: "Lleva la guía a tus números",
      title: "De la comparación teórica a la oferta real",
      description:
        "Estas herramientas sirven cuando el crédito todavía se puede evitar, renegociar mejor o prepagar antes de que escale.",
      items: [
        creditCalculatorCard,
        prepagoCalculatorCard,
        tarjetaCalculatorCard,
        informeCmfCard,
        deudaHubCard,
      ],
    },
    {
      eyebrow: "Si el problema ya cambió",
      title: "Cuándo dejar de comparar y pasar a ordenar la deuda",
      description:
        "Si la cuota ya no se sostiene, tu siguiente paso no es seguir mirando tasas sino filtrar elegibilidad, reportes y salidas formales.",
      items: [
        renegociacionGuideCard,
        renegociacionCalculatorCard,
        dicomGratisCard,
        informeCmfCard,
        ufBridgeCard,
      ],
    },
  ],
  "renegociacion-superir": [
    {
      eyebrow: "Antes de postular",
      title: "Llega con el diagnóstico ya ordenado",
      description:
        "Superir funciona mejor cuando ya separaste acreedores, mora real y reportes comerciales antes de subir documentos.",
      items: [
        renegociacionCalculatorCard,
        informeCmfCard,
        dicomGratisCard,
        deudaHubCard,
        ufBridgeCard,
      ],
    },
    {
      eyebrow: "Si todavía no es concursal",
      title:
        "Opciones para cuando aún estás en etapa de ordenar, no de insolvencia",
      description:
        "Si tu problema sigue siendo comparar costos, sostener una tarjeta o decidir un prepago, conviene salir de esta guía y medir mejor el caso.",
      items: [
        caeGuideCard,
        creditCalculatorCard,
        tarjetaCalculatorCard,
        prepagoCalculatorCard,
        deudaHubCard,
      ],
    },
  ],
};

export function getDeudaArticleSections(slug: string): LinkSection[] {
  return deudaArticleSectionsBySlug[slug] ?? [];
}
