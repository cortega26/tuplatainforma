import { circle, ellipse, group, line, polygon, rect } from "./primitives.mjs";

export const BASE_COLORS = {
  navy: "#26284f",
  blue: "#3566ad",
  cream: "#f5f0df",
  gold: "#f2cc73",
  tealGlass: "#9fd8d3",
  tealDark: "#116b63",
  orangeGround: "#ef7a1a",
  tealGround: "#11786f",
};

export function groundShadow({ cx, cy, rx, ry, fill }) {
  return ellipse(cx, cy, rx, ry, { fill });
}

export function chair({ x, y, palette }) {
  return group(
    [
      rect(x, y + 96, 122, 22, { rx: 10, fill: palette.primary }),
      rect(x + 8, y + 18, 22, 96, { rx: 10, fill: palette.primary }),
      polygon(
        [
          [x + 18, y + 118],
          [x + 36, y + 118],
          [x + 14, y + 228],
          [x - 6, y + 228],
        ],
        { fill: palette.dark }
      ),
      polygon(
        [
          [x + 102, y + 118],
          [x + 120, y + 118],
          [x + 132, y + 228],
          [x + 112, y + 228],
        ],
        { fill: palette.dark }
      ),
    ].join(""),
    { "data-object": "chair" }
  );
}

export function sideTable({ x, y, palette }) {
  return group(
    [
      rect(x, y, 160, 18, { rx: 9, fill: palette.primary }),
      rect(x + 18, y + 18, 16, 96, { rx: 8, fill: palette.dark }),
      rect(x + 126, y + 18, 16, 96, { rx: 8, fill: palette.dark }),
    ].join(""),
    { "data-object": "side-table" }
  );
}

export function closedLaptop({ x, y, palette }) {
  return group(
    [
      rect(x, y, 116, 18, { rx: 9, fill: palette.light }),
      rect(x + 12, y + 20, 92, 10, { rx: 5, fill: palette.primary }),
    ].join(""),
    { "data-object": "closed-laptop" }
  );
}

export function emptyCup({ x, y, palette }) {
  return group(
    [
      rect(x, y, 34, 42, { rx: 10, fill: palette.light }),
      line(x + 28, y + 12, x + 44, y + 20, {
        stroke: palette.light,
        "stroke-width": 8,
        "stroke-linecap": "round",
      }),
      line(x + 28, y + 30, x + 44, y + 22, {
        stroke: palette.light,
        "stroke-width": 8,
        "stroke-linecap": "round",
      }),
    ].join(""),
    { "data-object": "empty-cup" }
  );
}

export function paperStack({ x, y, palette }) {
  const centerX = x + 94;
  const centerY = y + 102;

  return group(
    [
      group(
        [
          rect(x + 30, y + 22, 148, 180, { rx: 16, fill: palette.light, opacity: 0.58 }),
          rect(x + 14, y + 10, 148, 180, { rx: 16, fill: palette.light, opacity: 0.8 }),
          rect(x, y, 148, 180, { rx: 16, fill: palette.light }),
          polygon(
            [
              [x + 112, y],
              [x + 148, y],
              [x + 148, y + 36],
            ],
            { fill: "#e7dcc3" }
          ),
          rect(x + 28, y + 36, 68, 10, { rx: 5, fill: palette.primary }),
          rect(x + 28, y + 62, 92, 10, { rx: 5, fill: palette.primary }),
          rect(x + 28, y + 88, 84, 10, { rx: 5, fill: palette.primary }),
          rect(x + 28, y + 114, 96, 10, { rx: 5, fill: palette.primary }),
          circle(x + 114, y + 150, 18, { fill: palette.gold, opacity: 0.9 }),
        ].join(""),
        { transform: `rotate(-4 ${centerX} ${centerY})` }
      ),
    ].join(""),
    { "data-object": "paper-stack" }
  );
}

export function creditCard({ x, y, palette }) {
  const centerX = x + 104;
  const centerY = y + 64;

  return group(
    [
      group(
        [
          rect(x + 14, y - 10, 188, 116, { rx: 28, fill: palette.dark, opacity: 0.28 }),
          rect(x, y, 188, 116, { rx: 28, fill: palette.primary }),
          rect(x, y + 28, 188, 22, { fill: palette.dark }),
          rect(x + 28, y + 62, 36, 28, { rx: 6, fill: palette.gold }),
          rect(x + 122, y + 66, 34, 10, { rx: 5, fill: palette.light, opacity: 0.92 }),
          rect(x + 122, y + 84, 46, 8, { rx: 4, fill: palette.light, opacity: 0.74 }),
          circle(x + 160, y + 88, 12, { fill: palette.gold, opacity: 0.78 }),
          circle(x + 174, y + 88, 12, { fill: palette.light, opacity: 0.78 }),
        ].join(""),
        { transform: `rotate(-8 ${centerX} ${centerY})` }
      ),
    ].join(""),
    { "data-object": "credit-card" }
  );
}

export function debtFigure({ x, y, palette }) {
  return group(
    [
      line(x + 180, y + 124, x + 236, y + 176, {
        stroke: palette.primary,
        "stroke-width": 34,
        "stroke-linecap": "round",
      }),
      line(x + 236, y + 176, x + 198, y + 104, {
        stroke: palette.primary,
        "stroke-width": 32,
        "stroke-linecap": "round",
      }),
      line(x + 116, y + 126, x + 70, y + 180, {
        stroke: palette.primary,
        "stroke-width": 34,
        "stroke-linecap": "round",
      }),
      line(x + 70, y + 180, x + 112, y + 242, {
        stroke: palette.primary,
        "stroke-width": 32,
        "stroke-linecap": "round",
      }),
      polygon(
        [
          [x + 108, y + 112],
          [x + 182, y + 112],
          [x + 194, y + 144],
          [x + 194, y + 286],
          [x + 166, y + 298],
          [x + 118, y + 298],
          [x + 96, y + 286],
          [x + 96, y + 144],
        ],
        { fill: palette.primary }
      ),
      circle(x + 150, y + 48, 40, { fill: palette.skin }),
      rect(x + 138, y + 86, 24, 18, { rx: 9, fill: palette.skin }),
      ellipse(x + 192, y + 102, 14, 18, { fill: palette.skin }),
      ellipse(x + 114, y + 246, 14, 17, { fill: palette.skin }),
      polygon(
        [
          [x + 100, y + 298],
          [x + 188, y + 298],
          [x + 192, y + 332],
          [x + 96, y + 332],
        ],
        { fill: palette.dark }
      ),
      polygon(
        [
          [x + 108, y + 330],
          [x + 144, y + 330],
          [x + 138, y + 534],
          [x + 90, y + 534],
        ],
        { fill: palette.dark }
      ),
      polygon(
        [
          [x + 152, y + 330],
          [x + 188, y + 330],
          [x + 204, y + 534],
          [x + 168, y + 534],
        ],
        { fill: palette.dark }
      ),
      polygon(
        [
          [x + 90, y + 534],
          [x + 142, y + 534],
          [x + 154, y + 560],
          [x + 78, y + 560],
        ],
        { fill: palette.dark }
      ),
      polygon(
        [
          [x + 168, y + 534],
          [x + 218, y + 534],
          [x + 234, y + 560],
          [x + 180, y + 560],
        ],
        { fill: palette.dark }
      ),
    ].join(""),
    { "data-object": "figure", "data-pose": "standing-hand-head", "data-rig": "debt-figure" }
  );
}

export function debtPaperPile({ x, y, palette }) {
  return group(
    [
      rect(x + 38, y + 126, 232, 178, { fill: palette.light }),
      polygon(
        [
          [x + 270, y + 126],
          [x + 304, y + 132],
          [x + 304, y + 310],
          [x + 270, y + 304],
        ],
        { fill: "#bfd1df" }
      ),
      ...[0, 26, 52].map(offset =>
        group(
          [
            rect(x, y + 92 + offset, 258, 22, { fill: "#fbf7ef" }),
            polygon(
              [
                [x + 258, y + 92 + offset],
                [x + 292, y + 98 + offset],
                [x + 292, y + 120 + offset],
                [x + 258, y + 114 + offset],
              ],
              { fill: "#bfd1df" }
            ),
          ].join("")
        )
      ),
      polygon(
        [
          [x + 84, y],
          [x + 292, y],
          [x + 268, y + 118],
          [x + 56, y + 118],
          [x + 72, y + 78],
          [x + 82, y + 34],
        ],
        { fill: "#fcfaf5" }
      ),
      polygon(
        [
          [x + 292, y + 46],
          [x + 356, y + 58],
          [x + 278, y + 132],
          [x + 236, y + 118],
        ],
        { fill: "#d7e3ed" }
      ),
      polygon(
        [
          [x + 246, y + 22],
          [x + 292, y],
          [x + 284, y + 56],
          [x + 258, y + 38],
        ],
        { fill: "#dbe8f1" }
      ),
      rect(x + 116, y + 48, 126, 12, { rx: 2, fill: palette.primary, opacity: 0.82 }),
      rect(x + 108, y + 84, 132, 12, { rx: 2, fill: palette.primary, opacity: 0.82 }),
      rect(x + 94, y + 120, 144, 12, { rx: 2, fill: palette.primary, opacity: 0.82 }),
      line(x + 76, y + 238, x + 234, y + 266, {
        stroke: "#bfd1df",
        "stroke-width": 8,
        "stroke-linecap": "round",
      }),
      line(x + 86, y + 286, x + 222, y + 312, {
        stroke: "#bfd1df",
        "stroke-width": 8,
        "stroke-linecap": "round",
      }),
    ].join(""),
    { "data-object": "paper-stack", "data-layout": "debt-pile" }
  );
}

export function debtCreditCard({ x, y, palette }) {
  return group(
    [
      rect(x + 18, y + 8, 332, 170, { rx: 28, fill: palette.dark, opacity: 0.22 }),
      rect(x, y, 332, 170, { rx: 28, fill: palette.primary }),
      rect(x, y + 64, 332, 34, { fill: palette.dark }),
      rect(x + 42, y + 28, 44, 14, { rx: 4, fill: palette.gold }),
      rect(x + 58, y + 112, 64, 18, { fill: palette.dark }),
      rect(x + 206, y + 120, 96, 12, { rx: 4, fill: palette.light, opacity: 0.92 }),
    ].join(""),
    { "data-object": "credit-card", "data-layout": "debt-card" }
  );
}

export function jarWithCoins({ x, y, palette }) {
  return group(
    [
      rect(x + 34, y, 140, 26, { rx: 13, fill: palette.primary }),
      rect(x + 46, y + 22, 116, 158, { rx: 34, fill: palette.glass, opacity: 0.95 }),
      ellipse(x + 104, y + 22, 56, 10, { fill: palette.dark, opacity: 0.28 }),
      ...[0, 1, 2, 3].map(index =>
        circle(x + 88 + (index % 2) * 34, y + 124 + Math.floor(index / 2) * 32, 24, {
          fill: palette.gold,
        })
      ),
    ].join(""),
    { "data-object": "jar" }
  );
}

export function coin({ x, y, palette, r = 22 }) {
  return group(
    [
      circle(x, y, r, { fill: palette.gold }),
      circle(x, y, r - 8, { fill: "none", stroke: palette.light, "stroke-width": 4 }),
    ].join(""),
    { "data-object": "coin" }
  );
}

export function seatedSlouchedFigure({ x, y, palette }) {
  return group(
    [
      circle(x + 126, y + 44, 42, { fill: palette.skin }),
      polygon(
        [
          [x + 86, y + 86],
          [x + 178, y + 86],
          [x + 172, y + 220],
          [x + 88, y + 220],
        ],
        { fill: palette.primary }
      ),
      polygon(
        [
          [x + 78, y + 104],
          [x + 104, y + 128],
          [x + 72, y + 186],
          [x + 44, y + 162],
        ],
        { fill: palette.primary }
      ),
      polygon(
        [
          [x + 172, y + 102],
          [x + 196, y + 124],
          [x + 190, y + 214],
          [x + 160, y + 210],
        ],
        { fill: palette.primary }
      ),
      polygon(
        [
          [x + 108, y + 220],
          [x + 152, y + 220],
          [x + 160, y + 332],
          [x + 116, y + 332],
        ],
        { fill: palette.dark }
      ),
      polygon(
        [
          [x + 150, y + 218],
          [x + 212, y + 216],
          [x + 216, y + 332],
          [x + 168, y + 332],
        ],
        { fill: palette.dark }
      ),
      ellipse(x + 118, y + 334, 24, 10, { fill: palette.dark }),
      ellipse(x + 198, y + 334, 30, 10, { fill: palette.dark }),
    ].join(""),
    { "data-object": "figure", "data-pose": "seated-slouched" }
  );
}

export function standingHandHeadFigure({ x, y, palette }) {
  return group(
    [
      circle(x + 146, y + 42, 35, { fill: palette.skin }),
      rect(x + 136, y + 74, 20, 20, { rx: 10, fill: palette.skin }),
      polygon(
        [
          [x + 100, y + 98],
          [x + 184, y + 98],
          [x + 192, y + 150],
          [x + 182, y + 206],
          [x + 164, y + 236],
          [x + 118, y + 236],
          [x + 100, y + 206],
          [x + 92, y + 150],
        ],
        { fill: palette.primary }
      ),
      line(x + 104, y + 112, x + 82, y + 176, {
        stroke: palette.primary,
        "stroke-width": 24,
        "stroke-linecap": "round",
      }),
      line(x + 82, y + 176, x + 74, y + 246, {
        stroke: palette.primary,
        "stroke-width": 22,
        "stroke-linecap": "round",
      }),
      ellipse(x + 72, y + 254, 11, 13, { fill: palette.skin }),
      line(x + 182, y + 112, x + 216, y + 144, {
        stroke: palette.primary,
        "stroke-width": 24,
        "stroke-linecap": "round",
      }),
      line(x + 216, y + 144, x + 188, y + 92, {
        stroke: palette.primary,
        "stroke-width": 22,
        "stroke-linecap": "round",
      }),
      ellipse(x + 184, y + 90, 12, 14, { fill: palette.skin }),
      polygon(
        [
          [x + 118, y + 232],
          [x + 166, y + 232],
          [x + 172, y + 264],
          [x + 112, y + 264],
        ],
        { fill: palette.dark }
      ),
      line(x + 128, y + 262, x + 124, y + 340, {
        stroke: palette.dark,
        "stroke-width": 24,
        "stroke-linecap": "round",
      }),
      line(x + 124, y + 340, x + 120, y + 422, {
        stroke: palette.dark,
        "stroke-width": 22,
        "stroke-linecap": "round",
      }),
      line(x + 154, y + 262, x + 164, y + 342, {
        stroke: palette.dark,
        "stroke-width": 24,
        "stroke-linecap": "round",
      }),
      line(x + 164, y + 342, x + 176, y + 420, {
        stroke: palette.dark,
        "stroke-width": 22,
        "stroke-linecap": "round",
      }),
      ellipse(x + 116, y + 428, 24, 11, { fill: palette.dark }),
      ellipse(x + 182, y + 426, 26, 11, { fill: palette.dark }),
    ].join(""),
    { "data-object": "figure", "data-pose": "standing-hand-head" }
  );
}

export function standingReachFigure({ x, y, palette }) {
  return group(
    [
      circle(x + 96, y + 42, 38, { fill: palette.skin }),
      polygon(
        [
          [x + 62, y + 82],
          [x + 150, y + 82],
          [x + 138, y + 228],
          [x + 74, y + 228],
        ],
        { fill: palette.primary }
      ),
      polygon(
        [
          [x + 146, y + 104],
          [x + 244, y + 74],
          [x + 252, y + 92],
          [x + 154, y + 126],
        ],
        { fill: palette.primary }
      ),
      circle(x + 248, y + 92, 12, { fill: palette.skin }),
      polygon(
        [
          [x + 70, y + 104],
          [x + 44, y + 192],
          [x + 66, y + 196],
          [x + 88, y + 124],
        ],
        { fill: palette.primary }
      ),
      polygon(
        [
          [x + 82, y + 228],
          [x + 122, y + 228],
          [x + 132, y + 372],
          [x + 92, y + 372],
        ],
        { fill: palette.dark }
      ),
      polygon(
        [
          [x + 120, y + 228],
          [x + 160, y + 228],
          [x + 196, y + 372],
          [x + 150, y + 372],
        ],
        { fill: palette.dark }
      ),
      ellipse(x + 96, y + 372, 26, 10, { fill: palette.dark }),
      ellipse(x + 188, y + 372, 28, 10, { fill: palette.dark }),
    ].join(""),
    { "data-object": "figure", "data-pose": "standing-reaching" }
  );
}
