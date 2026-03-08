export const CLUSTERS = [
  "ahorro-e-inversion",
  "impuestos-personas",
  "pensiones-afp",
  "deuda-credito",
  "seguridad-financiera",
  "sueldo-remuneraciones",
  "empleo-ingresos",
  "general",
] as const;

export type Cluster = (typeof CLUSTERS)[number];
