import {
  BASE_COLORS,
  chair,
  closedLaptop,
  coin,
  debtCreditCard,
  debtFigure,
  debtPaperPile,
  emptyCup,
  groundShadow,
  jarWithCoins,
  seatedSlouchedFigure,
  sideTable,
  standingReachFigure,
} from "./components.mjs";
import { rect, svgDocument } from "./primitives.mjs";

const SCENE_SIZE = { width: 1200, height: 630 };

function warmPalette(background = "#d97706") {
  return {
    background,
    ground: BASE_COLORS.orangeGround,
    primary: BASE_COLORS.blue,
    dark: BASE_COLORS.navy,
    light: BASE_COLORS.cream,
    skin: BASE_COLORS.gold,
    gold: BASE_COLORS.gold,
    glass: "#d9eef1",
  };
}

function savingsPalette(background = "#0d9488") {
  return {
    background,
    ground: BASE_COLORS.tealGround,
    primary: BASE_COLORS.gold,
    dark: BASE_COLORS.navy,
    light: BASE_COLORS.cream,
    skin: BASE_COLORS.gold,
    gold: "#f4b740",
    glass: BASE_COLORS.tealGlass,
  };
}

function renderCesantia({ background }) {
  const palette = warmPalette(background);
  const content = [
    rect(0, 0, SCENE_SIZE.width, SCENE_SIZE.height, { fill: palette.background }),
    groundShadow({ cx: 594, cy: 548, rx: 400, ry: 32, fill: palette.ground }),
    chair({ x: 286, y: 212, palette }),
    seatedSlouchedFigure({ x: 310, y: 120, palette }),
    sideTable({ x: 700, y: 308, palette }),
    closedLaptop({ x: 720, y: 274, palette }),
    emptyCup({ x: 866, y: 250, palette }),
  ].join("");

  return svgDocument({ sceneId: "cesantia", ...SCENE_SIZE, content });
}

function renderDeudaCredito({ background }) {
  const palette = warmPalette(background);
  const content = [
    rect(0, 0, SCENE_SIZE.width, SCENE_SIZE.height, { fill: palette.background }),
    groundShadow({ cx: 350, cy: 566, rx: 154, ry: 34, fill: palette.ground }),
    groundShadow({ cx: 846, cy: 552, rx: 344, ry: 30, fill: palette.ground }),
    debtFigure({ x: 174, y: 12, palette }),
    debtPaperPile({ x: 528, y: 222, palette }),
    debtCreditCard({ x: 816, y: 410, palette }),
  ].join("");

  return svgDocument({ sceneId: "deuda-credito", ...SCENE_SIZE, content });
}

function renderAhorro({ background }) {
  const palette = savingsPalette(background);
  const content = [
    rect(0, 0, SCENE_SIZE.width, SCENE_SIZE.height, { fill: palette.background }),
    groundShadow({ cx: 592, cy: 548, rx: 396, ry: 30, fill: palette.ground }),
    standingReachFigure({ x: 254, y: 120, palette }),
    jarWithCoins({ x: 654, y: 228, palette }),
    coin({ x: 770, y: 240, palette, r: 24 }),
  ].join("");

  return svgDocument({ sceneId: "ahorro", ...SCENE_SIZE, content });
}

export const SVG_SCENE_REGISTRY = {
  cesantia: {
    id: "cesantia",
    label: "Cesantia",
    approvedModelId: "cesantia",
    background: "#d97706",
    render: renderCesantia,
  },
  "deuda-credito": {
    id: "deuda-credito",
    label: "Deuda / Credito",
    approvedModelId: "deuda-credito",
    background: "#d97706",
    render: renderDeudaCredito,
  },
  ahorro: {
    id: "ahorro",
    label: "Ahorro",
    approvedModelId: "ahorro",
    background: "#0d9488",
    render: renderAhorro,
  },
};

export function listSvgSceneIds() {
  return Object.keys(SVG_SCENE_REGISTRY).sort();
}

export function getSvgSceneDefinition(id) {
  return SVG_SCENE_REGISTRY[id] ?? null;
}

export function renderSvgScene(id, options = {}) {
  const scene = getSvgSceneDefinition(id);
  if (!scene) {
    throw new Error(`[svg-scenes] Unknown scene '${id}'.`);
  }

  return scene.render({
    background: options.background || scene.background,
  });
}
