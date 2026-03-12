export const CLUSTERS = [
  "ahorro-e-inversion",
  "impuestos-personas",
  "pensiones-afp",
  "deuda-credito",
  "uf-costo-de-vida",
  "seguridad-financiera",
  "sueldo-remuneraciones",
  "empleo-ingresos",
  "general",
] as const;

export type Cluster = (typeof CLUSTERS)[number];
export type HubCluster = Exclude<Cluster, "general">;
export type HubLayer =
  | "ingresos"
  | "prevision"
  | "ahorro-inversion"
  | "impuestos"
  | "deuda"
  | "bolsillo"
  | "otros";

export type GuideHubMeta = {
  nombre: string;
  descripcion: string;
  capa: HubLayer;
  homepageResumen: string;
};

export const GUIDE_HUB_ORDER: HubCluster[] = [
  "sueldo-remuneraciones",
  "empleo-ingresos",
  "pensiones-afp",
  "deuda-credito",
  "uf-costo-de-vida",
  "ahorro-e-inversion",
  "impuestos-personas",
  "seguridad-financiera",
];

export const GUIDE_HUBS: Record<HubCluster, GuideHubMeta> = {
  "pensiones-afp": {
    nombre: "Pensiones y AFP",
    descripcion:
      "Sección sobre previsión obligatoria en Chile: cotización, fondos y decisiones que afectan tu pensión futura.",
    capa: "prevision",
    homepageResumen: "Cotizaciones, fondos, APV y cambios de AFP.",
  },
  "ahorro-e-inversion": {
    nombre: "Ahorro e inversión",
    descripcion:
      "Sección para aprender a ahorrar e invertir según instrumento, costo, impuestos y plazo.",
    capa: "ahorro-inversion",
    homepageResumen: "Depósitos, fondos, ETF y decisiones de largo plazo.",
  },
  "impuestos-personas": {
    nombre: "Impuestos para personas",
    descripcion:
      "Sección para declarar renta, revisar devoluciones y entender tus principales dudas tributarias.",
    capa: "impuestos",
    homepageResumen: "Operación Renta, boletas y devoluciones.",
  },
  "deuda-credito": {
    nombre: "Deuda y crédito",
    descripcion:
      "Sección para entender el CAE, revisar tus deudas y tomar mejores decisiones de crédito.",
    capa: "deuda",
    homepageResumen: "CAE, informe CMF y renegociación.",
  },
  "uf-costo-de-vida": {
    nombre: "UF, inflación y costo de vida",
    descripcion:
      "Sección para entender cómo se conectan UF, IPC y reajustes con tu bolsillo, tu arriendo y otros contratos indexados.",
    capa: "bolsillo",
    homepageResumen: "UF, IPC, reajustes y herramientas para aterrizar montos.",
  },
  "empleo-ingresos": {
    nombre: "Empleo e ingresos",
    descripcion:
      "Sección para cesantía, licencias médicas, finiquito y otros problemas que afectan tu ingreso laboral.",
    capa: "ingresos",
    homepageResumen: "Cesantía, finiquito y continuidad de ingresos.",
  },
  "sueldo-remuneraciones": {
    nombre: "Sueldo y remuneraciones",
    descripcion:
      "Sección para entender tu sueldo líquido, la liquidación y los descuentos de cada mes.",
    capa: "ingresos",
    homepageResumen: "Sueldo líquido, descuentos y liquidación mensual.",
  },
  "seguridad-financiera": {
    nombre: "Seguridad financiera",
    descripcion:
      "Sección para fraudes, cargos no reconocidos y protección de tus cuentas frente a suplantaciones o estafas.",
    capa: "otros",
    homepageResumen: "Fraudes, suplantación y reacción rápida ante cargos.",
  },
};
