# Publish Checklist (Editorial Gate)

## 1) Gate automático (obligatorio)

Ejecutar antes de publicar:

```bash
pnpm run build
pnpm run lint
```

`build` ya incluye:

- `astro check`
- `astro build`
- `check:toc-i18n`
- `check:editorial-guard`

`check:editorial-guard` valida:

- aparición de `table of contents`
- strings en inglés visibles (patrones bloqueados)
- más de un `H1` por archivo

## 2) Revisión editorial mínima

- Frontmatter alineado con `docs/editorial/FRONTMATTER_SCHEMA.md`.
- Política pilar/tool respetada según `docs/editorial/SEO_ARCHITECTURE.md`.
- Interlinking mínimo:
  - pilar -> tool
  - tool -> pilar
  - anchor explícito

## 3) Criterios de bloqueo (NO PUBLICAR)

- Falla cualquier comando de gate (`build` o `lint`).
- Hay `table of contents` visible.
- Se detecta más de un `H1` en una pieza.
- Falta enlace pilar/tool en clusters con herramienta publicada.
