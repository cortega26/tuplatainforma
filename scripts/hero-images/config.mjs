export const COLORS = {
  "Finanzas general / AFP / Empleo / Ahorro": {
    hex: "#0d9488",
    label: "Teal",
    text: "#ffffff",
  },
  "Credito / Deuda / Impuestos / Riesgo": {
    hex: "#d97706",
    label: "Amber",
    text: "#ffffff",
  },
  "Banca / Instituciones / Referencia tecnica": {
    hex: "#475569",
    label: "Slate",
    text: "#ffffff",
  },
  "Educativo / Conceptos / Guias": {
    hex: "#4f46e5",
    label: "Indigo",
    text: "#ffffff",
  },
  "Ahorro activo / Metas / Logros": {
    hex: "#059669",
    label: "Emerald",
    text: "#ffffff",
  },
  "Advertencias / Errores comunes": {
    hex: "#e11d48",
    label: "Rose",
    text: "#ffffff",
  },
  "Fraude / Perdida grave": {
    hex: "#c2410c",
    label: "Red-Amber",
    text: "#ffffff",
  },
  "Salud / FONASA / ISAPRE": {
    hex: "#0284c7",
    label: "Sky",
    text: "#ffffff",
  },
};

export const SCENE_EXAMPLES = {
  A: [
    {
      group: "General",
      label: "Presupuesto",
      postura: "seated at a table, leaning slightly forward",
      objetos: "calculator, stacked papers, coffee cup",
    },
    {
      group: "General",
      label: "Cesantia",
      postura: "seated on a chair, slouched, head slightly down",
      objetos: "closed laptop, empty cup",
    },
    {
      group: "General",
      label: "AFP / Pension",
      postura: "seated in a comfortable chair, relaxed",
      objetos: "small hourglass shape, calendar",
    },
    {
      group: "General",
      label: "Deuda / Credito",
      postura: "standing, one hand raised to head",
      objetos: "pile of documents, credit card shape",
    },
    {
      group: "General",
      label: "Fraude / Estafa",
      postura: "standing, tense posture, looking at hand",
      objetos: "smartphone with alert triangle symbol",
    },
    {
      group: "General",
      label: "Primer sueldo",
      postura: "standing upright, arms slightly raised",
      objetos: "envelope, banknote shape",
    },
    {
      group: "General",
      label: "Declaracion renta",
      postura: "seated at desk, focused forward",
      objetos: "computer screen showing a form, calendar",
    },
    {
      group: "General",
      label: "Ahorro",
      postura: "standing, reaching forward",
      objetos: "jar or container, coin shape",
    },
    {
      group: "Inversion",
      label: "Fondos mutuos",
      postura: "seated at a table, leaning slightly forward",
      objetos: "open laptop with bar chart, small bar chart shape, coffee cup",
    },
    {
      group: "Educacion",
      label: "Que es la UF",
      postura: "seated at a table, leaning slightly forward",
      objetos: "open book shape, calculator, small activity line chart",
    },
    {
      group: "Salud",
      label: "FONASA vs ISAPRE",
      postura: "standing upright, arms slightly extended, comparing posture",
      objetos: "two document shapes side by side, shield shape",
    },
  ],
  B: [
    { label: "Seguro de salud", icono: "shield with checkmark inside" },
    { label: "Hipoteca / Arriendo", icono: "simple key shape" },
    {
      label: "Inversion / Fondos",
      icono: "bar chart, three bars increasing left to right",
    },
    { label: "UF / Indicadores", icono: "activity pulse line" },
    { label: "CAE / Credito educacion", icono: "downward trending line chart" },
    { label: "Renegociacion", icono: "two circular arrows forming a cycle" },
    { label: "AFP / Cotizacion", icono: "hourglass shape" },
    { label: "Cuenta corriente / Banco", icono: "simple smartphone outline" },
  ],
};

export const POSTURAS = [
  {
    label: "Sentado, mesa",
    value: "seated at a table, leaning slightly forward",
  },
  { label: "Sentado, silla", value: "seated on a chair, relaxed posture" },
  {
    label: "Sentado, decaido",
    value: "seated on a chair, slouched, head slightly down",
  },
  { label: "De pie, neutro", value: "standing upright, neutral posture" },
  {
    label: "De pie, mano en cabeza",
    value: "standing, one hand raised to head",
  },
  {
    label: "De pie, mirando objeto",
    value: "standing, looking down at object in hand",
  },
  {
    label: "Dos figuras, hablando",
    value: "two figures standing facing each other, conversational posture",
  },
];

export const OBJETOS_SUGERIDOS = [
  { label: "Calculadora", value: "calculator" },
  { label: "Laptop abierto", value: "open laptop" },
  { label: "Laptop cerrado", value: "closed laptop" },
  { label: "Smartphone", value: "smartphone" },
  { label: "Smartphone + alerta", value: "smartphone with alert triangle symbol" },
  { label: "Papeles apilados", value: "stacked papers" },
  { label: "Documento", value: "single document sheet" },
  { label: "Sobre / carta", value: "envelope" },
  { label: "Taza de cafe", value: "coffee cup" },
  { label: "Taza vacia", value: "empty cup" },
  { label: "Billete", value: "banknote shape" },
  { label: "Moneda", value: "coin shape" },
  { label: "Tarjeta de credito", value: "credit card shape" },
  { label: "Frasco / alcancia", value: "jar or container" },
  { label: "Calendario", value: "calendar" },
  { label: "Reloj de arena", value: "small hourglass shape" },
  { label: "Llave", value: "simple key shape" },
  { label: "Escudo", value: "shield shape" },
  { label: "Grafico de barras", value: "small bar chart" },
  { label: "Flecha hacia abajo", value: "downward arrow" },
  { label: "Flecha hacia arriba", value: "upward arrow" },
];

export const NEGATIVES =
  "Do not include text, letters, numbers, logos, or watermarks. Do not add photorealistic details, skin texture, hair texture, or facial features. Do not add depth of field, bokeh, rim lighting, volumetric light, lens flare, drop shadows, gradients, glows, or neon colors. Do not use 3D rendering or CGI. No cinematic lighting. No realistic anatomy.";

export function lightenHex(hex, amount = 0.45) {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const lr = Math.round(r + (255 - r) * amount);
  const lg = Math.round(g + (255 - g) * amount);
  const lb = Math.round(b + (255 - b) * amount);
  return `#${lr.toString(16).padStart(2, "0")}${lg
    .toString(16)
    .padStart(2, "0")}${lb.toString(16).padStart(2, "0")}`;
}

export function darkenHex(hex, amount = 0.35) {
  const r = Number.parseInt(hex.slice(1, 3), 16);
  const g = Number.parseInt(hex.slice(3, 5), 16);
  const b = Number.parseInt(hex.slice(5, 7), 16);
  const dr = Math.round(r * (1 - amount));
  const dg = Math.round(g * (1 - amount));
  const db = Math.round(b * (1 - amount));
  return `#${dr.toString(16).padStart(2, "0")}${dg
    .toString(16)
    .padStart(2, "0")}${db.toString(16).padStart(2, "0")}`;
}

export function buildPromptA(hex, postura, objetos) {
  const light = lightenHex(hex, 0.45);
  const dark = darkenHex(hex, 0.35);
  return `Create a flat vector editorial illustration for a personal finance website. 2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color ${hex}.

Scene: one geometric human figure ${postura}, shown from behind or as a faceless silhouette - simple circle for head, basic rectangles for body. The figure is near ${objetos}. All objects are flat geometric shapes, same illustration style.

Color palette: use exactly these 5 colors and no others - (1) background ${hex}, (2) white #ffffff for the figure silhouette, (3) light tint ${light} for primary objects, (4) near-white #f1f5f9 for secondary objects, (5) dark accent ${dark} for detail elements. No additional colors, no tints outside this palette, no variations.
Shape style: all shapes are filled with flat color. No outlines, no strokes, no borders on any shape.
Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Composition: all elements within the central 80% of the canvas.
Canvas: 1200x630 pixels, landscape.

${NEGATIVES}`;
}

export function buildPromptB(hex, icono) {
  return `Create a flat vector icon illustration for a personal finance website. 2D flat design, single centered element only.

Background: solid color ${hex}.
Element: ${icono}, as a simple geometric vector icon, centered, occupying 40% of canvas width. White stroke lines only, 2px weight, no fill inside the icon. No other stroke weights.

Color palette: use exactly 2 colors - background ${hex} and stroke #ffffff. No additional colors, no tints, no variations.
Shape style: stroke lines only, no filled shapes, no solid fills inside the icon.
No other elements on the canvas. No decorative background patterns.
Canvas: 1200x630 pixels, landscape.

${NEGATIVES}`;
}

export function buildPromptC(hex, icono) {
  return `Create a flat vector background for a personal finance graphic. 2D flat design only.

Background: solid color ${hex}, fills entire canvas.
Element: small ${icono} icon in the bottom right area. White stroke lines only, 2px weight, no fill. Icon occupies approximately 15% of canvas width.

Color palette: use exactly 2 colors - background ${hex} and stroke #ffffff. No additional colors.
Shape style: stroke lines only for the icon, no filled shapes.
The left two-thirds of the canvas must be completely empty - reserved for text overlay in post-production.
No text, no letters, no numbers anywhere in the image.
Canvas: 1200x630 pixels, landscape.

${NEGATIVES}`;
}
