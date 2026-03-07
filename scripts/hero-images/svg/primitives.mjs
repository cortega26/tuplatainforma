function attrsToString(attributes = {}) {
  return Object.entries(attributes)
    .filter(([, value]) => value !== undefined && value !== null && value !== false)
    .map(([key, value]) => `${key}="${String(value).replace(/"/g, '&quot;')}"`)
    .join(" ");
}

function tag(name, attributes = {}, content = "") {
  const attrString = attrsToString(attributes);
  if (!content) {
    return `<${name}${attrString ? ` ${attrString}` : ""} />`;
  }
  return `<${name}${attrString ? ` ${attrString}` : ""}>${content}</${name}>`;
}

export function group(content, attributes = {}) {
  return tag("g", attributes, content);
}

export function rect(x, y, width, height, attributes = {}) {
  return tag("rect", { x, y, width, height, ...attributes });
}

export function circle(cx, cy, r, attributes = {}) {
  return tag("circle", { cx, cy, r, ...attributes });
}

export function ellipse(cx, cy, rx, ry, attributes = {}) {
  return tag("ellipse", { cx, cy, rx, ry, ...attributes });
}

export function polygon(points, attributes = {}) {
  return tag(
    "polygon",
    { points: points.map(point => point.join(",")).join(" "), ...attributes },
    ""
  );
}

export function line(x1, y1, x2, y2, attributes = {}) {
  return tag("line", { x1, y1, x2, y2, ...attributes });
}

export function svgDocument({ width = 1200, height = 630, sceneId, content }) {
  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${height}" viewBox="0 0 ${width} ${height}" role="img" aria-label="${sceneId}" data-scene-id="${sceneId}">`,
    content,
    "</svg>",
  ].join("\n");
}
