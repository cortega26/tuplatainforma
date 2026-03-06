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
      id: "presupuesto",
      group: "General",
      label: "Presupuesto",
      postura: "standing, slightly bent forward, reaching toward the objects",
      objetos: "calculator, stacked papers",
    },
    {
      id: "cesantia",
      group: "General",
      label: "Cesantia",
      postura: "seated on a chair, slouched, head slightly down",
      objetos: "closed laptop, empty cup",
    },
    {
      id: "afp-pension",
      group: "General",
      label: "AFP / Pension",
      postura: "seated in a comfortable chair, relaxed",
      objetos: "small hourglass shape, calendar",
    },
    {
      id: "deuda-credito",
      group: "General",
      label: "Deuda / Credito",
      postura: "standing, one hand raised to head",
      objetos: "pile of documents, credit card shape",
    },
    {
      id: "fraude-estafa",
      group: "General",
      label: "Fraude / Estafa",
      postura: "standing, tense posture, looking at hand",
      objetos: "smartphone with alert triangle symbol",
    },
    {
      id: "primer-sueldo",
      group: "General",
      label: "Primer sueldo",
      postura: "standing upright, arms slightly raised",
      objetos: "envelope, banknote shape",
    },
    {
      id: "declaracion-renta",
      group: "General",
      label: "Declaracion renta",
      postura: "standing, looking down at the objects in hand",
      objetos: "paper stack, bank card shape",
    },
    {
      id: "ahorro",
      group: "General",
      label: "Ahorro",
      postura: "standing, reaching forward",
      objetos: "glass jar with coins",
    },
    {
      id: "fondos-mutuos",
      group: "Inversion",
      label: "Fondos mutuos",
      postura: "standing upright, looking down at the objects in hand",
      objetos: "open laptop, coin shape",
    },
    {
      id: "que-es-la-uf",
      group: "Educacion",
      label: "Que es la UF",
      postura: "standing upright, one arm slightly extended toward the objects",
      objetos: "open book shape, calculator",
    },
    {
      id: "fonasa-vs-isapre",
      group: "Salud",
      label: "FONASA vs ISAPRE",
      postura: "standing upright, arms slightly extended, comparing posture",
      objetos: "two card shapes side by side, shield shape",
    },
  ],
  B: [
    { id: "seguro-salud", label: "Seguro de salud", icono: "shield with checkmark inside" },
    { id: "hipoteca-arriendo", label: "Hipoteca / Arriendo", icono: "simple key shape" },
    {
      id: "inversion-fondos",
      label: "Inversion / Fondos",
      icono: "bar chart, three bars increasing left to right",
    },
    { id: "uf-indicadores", label: "UF / Indicadores", icono: "activity pulse line" },
    { id: "cae-credito-educacion", label: "CAE / Credito educacion", icono: "downward trending line chart" },
    { id: "renegociacion", label: "Renegociacion", icono: "two circular arrows forming a cycle" },
    { id: "afp-cotizacion", label: "AFP / Cotizacion", icono: "hourglass shape" },
    { id: "cuenta-corriente-banco", label: "Cuenta corriente / Banco", icono: "simple smartphone outline" },
  ],
};

export const APPROVED_PROMPT_MODELS = {
  A: SCENE_EXAMPLES.A.map(scene => ({ ...scene, template: "A", sceneId: `A:${scene.id}` })),
  B: SCENE_EXAMPLES.B.map(scene => ({ ...scene, template: "B", sceneId: `B:${scene.id}` })),
  C: SCENE_EXAMPLES.B.map(scene => ({ ...scene, template: "C", sceneId: `C:${scene.id}` })),
};

export function findApprovedPromptModel(template, idOrLabel) {
  const entries = APPROVED_PROMPT_MODELS[template] ?? [];
  return (
    entries.find(entry => entry.id === idOrLabel) ??
    entries.find(entry => entry.label === idOrLabel) ??
    null
  );
}

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
  "Do not include text, letters, numbers, logos, or watermarks. Do not add photorealistic details, skin texture, hair texture, or facial features. Do not add depth of field, bokeh, rim lighting, volumetric light, lens flare, drop shadows, gradients, glows, or neon colors. Do not use 3D rendering or CGI. No cinematic lighting. No realistic anatomy. Do not add extra objects beyond the named scene props.";

function limitObjectList(objetos, limit = 2) {
  return String(objetos ?? "")
    .split(",")
    .map(item => item.trim())
    .filter(Boolean)
    .slice(0, limit);
}

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
  const objectList = limitObjectList(objetos, 2);
  const objectClause = objectList.join(", ") || "one simple finance object";
  return `Create a flat vector editorial illustration for a personal finance website. 2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color ${hex}.

Scene: one geometric human figure ${postura}, shown from behind or as a faceless silhouette - simple circle for head, basic rectangles for body. The figure is near ${objectClause}. All objects are flat geometric shapes, same illustration style.

Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Color palette: 3 colors maximum, all flat fills.
Composition: all elements within the central 80% of the canvas.
Canvas: 1200x630 pixels, landscape.

${NEGATIVES}`;
}

export function buildPromptB(hex, icono) {
  return `Create a flat vector editorial illustration for a personal finance website. 2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color ${hex}.
Scene: one simple geometric ${icono} icon, centered, occupying 40% of the canvas width. Use flat filled shapes only. No secondary elements.

Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Color palette: 2 colors maximum, all flat fills.
Composition: all elements within the central 80% of the canvas.
Canvas: 1200x630 pixels, landscape.

${NEGATIVES}`;
}

export function buildPromptC(hex, icono) {
  return `Create a flat vector editorial illustration for a personal finance website. 2D flat design, geometric shapes only, no gradients, no photorealism, no 3D rendering.

Background: solid color ${hex}.
Scene: one small geometric ${icono} icon in the bottom right area. Use flat filled shapes only. No other objects.

Lighting: none. Flat uniform background only. No shadows, no highlights, no depth.
Color palette: 2 colors maximum, all flat fills.
Composition: keep the left two-thirds of the canvas completely empty for text overlay. All visible elements must stay within the rightmost 30% of the canvas.
Canvas: 1200x630 pixels, landscape.

${NEGATIVES}`;
}
