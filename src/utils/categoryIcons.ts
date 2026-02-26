import { slugifyStr } from "./slugify";

export const CATEGORY_MAP: Record<string, { icon: string; color: string }> = {
  cesantia: { icon: "🛡️", color: "#0d9488" },
  desempleo: { icon: "🛡️", color: "#0d9488" },
  afp: { icon: "📈", color: "#0d9488" },
  fondos: { icon: "📈", color: "#0d9488" },
  apv: { icon: "💰", color: "#0d9488" },
  impuestos: { icon: "📋", color: "#d97706" },
  calculadoras: { icon: "🧮", color: "#d97706" },
  laboral: { icon: "💼", color: "#0d9488" },
  trabajo: { icon: "💼", color: "#0d9488" },
  sueldo: { icon: "💵", color: "#0d9488" },
  liquidacion: { icon: "💵", color: "#0d9488" },
  credito: { icon: "💳", color: "#d97706" },
  creditos: { icon: "💳", color: "#d97706" },
  deudas: { icon: "🏦", color: "#d97706" },
  uf: { icon: "📏", color: "#0d9488" },
  inflacion: { icon: "📊", color: "#0d9488" },
  ipc: { icon: "📊", color: "#0d9488" },
  pensiones: { icon: "👴", color: "#0d9488" },
  arriendos: { icon: "🏠", color: "#d97706" },
  renegociacion: { icon: "🤝", color: "#d97706" },
  sobreendeudamiento: { icon: "⚠️", color: "#d97706" },
  dicom: { icon: "📄", color: "#d97706" },
  cmf: { icon: "🏛️", color: "#0d9488" },
  fraude: { icon: "🔒", color: "#d97706" },
  tarjetas: { icon: "💳", color: "#d97706" },
  "proteccion-social": { icon: "🧷", color: "#0d9488" },
  "reforma-pensiones": { icon: "📜", color: "#0d9488" },
  "cambio-afp": { icon: "🔄", color: "#0d9488" },
  "cuenta-2": { icon: "💼", color: "#0d9488" },
  default: { icon: "📄", color: "var(--color-accent)" },
};

export function getCategoryMeta(tag: string) {
  const slug = slugifyStr(tag.toLowerCase().trim());
  return CATEGORY_MAP[slug] ?? CATEGORY_MAP.default;
}
