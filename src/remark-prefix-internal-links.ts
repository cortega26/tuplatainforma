const ABSOLUTE_INTERNAL_PATH = /^\/(?!\/)/;

type NodeWithUrlAndChildren = {
  type?: string;
  url?: string;
  children?: NodeWithUrlAndChildren[];
};

export function remarkPrefixInternalLinks(basePath: string) {
  const normalizedBase = normalizeBase(basePath);

  return function transformer(tree: unknown) {
    // Ensure markdown-authored root links honor Astro `base` (e.g. /tuplatainforma)
    // so static link checks resolve against the built route tree.
    walk(tree as NodeWithUrlAndChildren, node => {
      if (node.type !== "link" && node.type !== "definition") return;
      if (typeof node.url !== "string") return;
      if (!ABSOLUTE_INTERNAL_PATH.test(node.url)) return;
      if (
        node.url.startsWith(`${normalizedBase}/`) ||
        node.url === normalizedBase
      )
        return;
      if (node.url.startsWith("/#")) return;

      node.url = `${normalizedBase}${node.url}`;
    });
  };
}

function normalizeBase(base: string) {
  if (!base || base === "/") return "";
  return base.endsWith("/") ? base.slice(0, -1) : base;
}

function walk(
  node: NodeWithUrlAndChildren | undefined,
  visitor: (n: NodeWithUrlAndChildren) => void
) {
  if (!node || typeof node !== "object") return;
  visitor(node);
  if (!Array.isArray(node.children)) return;
  for (const child of node.children) {
    walk(child, visitor);
  }
}
