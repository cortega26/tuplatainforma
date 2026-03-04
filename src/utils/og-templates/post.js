/**
 * post.js — OG image generator
 * Sistema visual v3 — tuplatainforma
 *
 * Template B: Icon Focus  — artículos técnicos/referencia
 * Template C: Type + Icon — artículos con dato ancla claro
 *
 * Selección automática por slug via TEMPLATE_C_DATA.
 * Íconos: Lucide-compatible, stroke 2px, 24×24 grid.
 * Dimensiones: 1200×630 (OG 1.91:1). Safe area: 1134×596 px.
 */

import satori from "satori";
import { SITE } from "@/config";
import loadGoogleFonts from "../loadGoogleFont";
import {
  CATEGORY_COLORS,
  DEFAULT_COLOR,
  ICON_PATHS,
  DEFAULT_ICON,
  TEMPLATE_C_DATA,
  SLUG_ICON_MAP,
  CATEGORY_LABELS,
  CATEGORY_ICON_MAP,
} from "./templateConfig.js";

const W = 1200;
const H = 630;

// ─── HELPERS ─────────────────────────────────────────────────────────────────

function getColor(category) {
  return CATEGORY_COLORS[category] ?? DEFAULT_COLOR;
}

function getIconPath(iconKey) {
  return ICON_PATHS[iconKey] ?? ICON_PATHS[DEFAULT_ICON];
}

function getCategoryLabel(category) {
  return CATEGORY_LABELS[category] ?? "FINANZAS";
}

function resolveIconForSlug(slug, category) {
  if (SLUG_ICON_MAP[slug]) return SLUG_ICON_MAP[slug];
  if (CATEGORY_ICON_MAP[category]) return CATEGORY_ICON_MAP[category];
  return DEFAULT_ICON;
}

// ─── SVG ICON ELEMENT ────────────────────────────────────────────────────────
// Satori no soporta SVG embebido directamente, se usa un <div> con background SVG
// o se construye con paths como children. Usamos el método path como children.

function iconElement(iconKey, size, color = "#ffffff", opacity = 1) {
  const d = getIconPath(iconKey);
  const scale = size / 24;

  return {
    type: "div",
    props: {
      style: {
        width: `${size}px`,
        height: `${size}px`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        opacity: opacity,
      },
      children: {
        type: "svg",
        props: {
          width: size,
          height: size,
          viewBox: "0 0 24 24",
          fill: "none",
          stroke: color,
          strokeWidth: 2 / scale,
          strokeLinecap: "round",
          strokeLinejoin: "round",
          children: {
            type: "path",
            props: { d },
          },
        },
      },
    },
  };
}

// ─── GRID TEXTURE ────────────────────────────────────────────────────────────
// Satori no soporta <pattern>. Simulamos con una cuadrícula de líneas usando
// borders en un div overlay con baja opacidad.

function gridOverlay(darkColor) {
  // Grid de 40×40 px. Línea superior e izquierda de cada celda.
  // Satori soporta backgroundImage con data URI limitado — usamos approach de
  // div con backgroundImage: repeating-linear-gradient.
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        top: 0,
        left: 0,
        width: "100%",
        height: "100%",
        backgroundImage: [
          `repeating-linear-gradient(0deg, transparent, transparent 39px, ${darkColor}33 39px, ${darkColor}33 40px)`,
          `repeating-linear-gradient(90deg, transparent, transparent 39px, ${darkColor}33 39px, ${darkColor}33 40px)`,
        ].join(", "),
        opacity: 0.07,
      },
    },
  };
}

// ─── RADIAL GLOW ─────────────────────────────────────────────────────────────

function radialGlow(lightColor) {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        top: "50%",
        left: "30%",
        transform: "translate(-50%, -50%)",
        width: "640px",
        height: "640px",
        borderRadius: "50%",
        background: `radial-gradient(circle, ${lightColor}44 0%, transparent 70%)`,
      },
    },
  };
}

// ─── DIVIDER ─────────────────────────────────────────────────────────────────

function verticalDivider() {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        top: "80px",
        left: "560px",
        width: "2px",
        height: "470px",
        background: "#ffffff",
        opacity: 0.15,
      },
    },
  };
}

// ─── SITE WATERMARK ──────────────────────────────────────────────────────────

function siteWatermark() {
  return {
    type: "div",
    props: {
      style: {
        position: "absolute",
        bottom: "28px",
        left: "60px",
        fontFamily: "'Inter', sans-serif",
        fontSize: 18,
        fontWeight: 400,
        color: "#ffffff",
        opacity: 0.3,
        letterSpacing: "2px",
      },
      children: SITE.title,
    },
  };
}

// ─── TEMPLATE B — Icon Focus ──────────────────────────────────────────────────

function templateB(post, color) {
  const slug = post.data.slug;
  const category = post.data.category ?? "general";
  const iconKey = resolveIconForSlug(slug, category);
  const iconSize = 200; // ~40% de 500px zona útil
  const label = getCategoryLabel(category);
  const darkColor = color.dark;
  const lightColor = color.light;

  return {
    type: "div",
    props: {
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        background: color.base,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        overflow: "hidden",
      },
      children: [
        // Textura grid — obligatoria
        gridOverlay(darkColor),

        // Glow sutil detrás del ícono
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              width: "360px",
              height: "360px",
              borderRadius: "50%",
              background: `radial-gradient(circle, ${lightColor}30 0%, transparent 70%)`,
            },
          },
        },

        // Ícono centrado
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -58%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            },
            children: iconElement(iconKey, iconSize, "#ffffff", 0.92),
          },
        },

        // Pill de categoría — tercio inferior
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "80px",
              left: "50%",
              transform: "translateX(-50%)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.12)",
              borderRadius: "26px",
              paddingLeft: "36px",
              paddingRight: "36px",
              paddingTop: "14px",
              paddingBottom: "14px",
            },
            children: {
              type: "span",
              props: {
                style: {
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#ccfbf1",
                  letterSpacing: "5px",
                  opacity: 0.9,
                },
                children: label,
              },
            },
          },
        },

        // Watermark
        siteWatermark(),
      ],
    },
  };
}

// ─── TEMPLATE C — Type + Icon ─────────────────────────────────────────────────

function templateC(post, color, tcData) {
  const category = post.data.category ?? "general";
  const label = getCategoryLabel(category);
  const darkColor = color.dark;
  const lightColor = color.light;
  const iconSize = 140;

  return {
    type: "div",
    props: {
      style: {
        position: "relative",
        width: "100%",
        height: "100%",
        background: color.base,
        display: "flex",
        alignItems: "center",
        overflow: "hidden",
      },
      children: [
        // Textura grid
        gridOverlay(darkColor),

        // Glow radial detrás del número
        radialGlow(lightColor),

        // ── LADO IZQUIERDO: número/dato ancla ──
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              left: "60px",
              top: "0px",
              bottom: "0px",
              width: "480px",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              justifyContent: "center",
            },
            children: [
              // Valor principal (número grande)
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: tcData.anchorValue.length <= 3 ? 280 : 200,
                    fontWeight: 900,
                    color: "#ffffff",
                    lineHeight: 0.9,
                    letterSpacing: "-8px",
                    opacity: 0.97,
                  },
                  children: tcData.anchorValue,
                },
              },
              // Sublabel
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 42,
                    fontWeight: 700,
                    color: "#ccfbf1",
                    letterSpacing: "10px",
                    marginTop: "12px",
                    opacity: 0.9,
                  },
                  children: tcData.anchorSub,
                },
              },
            ],
          },
        },

        // ── DIVISOR VERTICAL ──
        verticalDivider(),

        // ── LADO DERECHO: ícono + label ──
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              right: "60px",
              top: "0px",
              bottom: "0px",
              width: "580px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              gap: "24px",
            },
            children: [
              // Ícono
              iconElement(tcData.icon, iconSize, "#ffffff", 0.92),

              // Label derecho
              {
                type: "div",
                props: {
                  style: {
                    fontFamily: "'Inter', sans-serif",
                    fontSize: 26,
                    fontWeight: 400,
                    color: "#99f6e4",
                    letterSpacing: "6px",
                    opacity: 0.85,
                  },
                  children: tcData.anchorRight,
                },
              },
            ],
          },
        },

        // ── PILL CATEGORÍA — bottom right ──
        {
          type: "div",
          props: {
            style: {
              position: "absolute",
              bottom: "44px",
              right: "60px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.10)",
              borderRadius: "24px",
              paddingLeft: "28px",
              paddingRight: "28px",
              paddingTop: "12px",
              paddingBottom: "12px",
            },
            children: {
              type: "span",
              props: {
                style: {
                  fontFamily: "'Inter', sans-serif",
                  fontSize: 18,
                  fontWeight: 700,
                  color: "#ccfbf1",
                  letterSpacing: "4px",
                  opacity: 0.88,
                },
                children: label,
              },
            },
          },
        },

        // Watermark
        siteWatermark(),
      ],
    },
  };
}

// ─── EXPORT PRINCIPAL ─────────────────────────────────────────────────────────

export default async function postOgImage(post) {
  const slug = post.data.slug;
  const category = post.data.category ?? "general";
  const color = getColor(category);

  const tcData = TEMPLATE_C_DATA[slug];
  const useTemplateC = !!tcData;

  const tree = useTemplateC
    ? templateC(post, color, tcData)
    : templateB(post, color);

  const textSample = post.data.title + SITE.title + (tcData?.anchorValue ?? "");

  return satori(tree, {
    width: W,
    height: H,
    embedFont: true,
    fonts: await loadGoogleFonts(textSample),
  });
}
