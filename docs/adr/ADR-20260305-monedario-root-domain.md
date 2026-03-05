# ADR-20260305: Monedario Root-Domain Deployment

## Status

Accepted

## Context

The site was previously configured for GitHub Pages subpath deployment with a hardcoded Astro `base` of `/tuplatainforma`.

The public production domain is now `https://monedario.cl/`, fronted by Cloudflare and served from GitHub Pages. With the old hardcoded subpath, the generated HTML referenced CSS and JS assets under `/tuplatainforma/_astro/...`, which broke styling and client assets when the site was served from the custom-domain root.

This change also includes a public rebrand from `Tu Plata Informa` to `Monedario`.

Relevant constraints:
- `docs/AI_ENGINEERING_CONSTITUTION.md` §2.3 / §4.3: preserve `URL.PUBLIC.NO_POST_ID`.
- `AGENTS.md` Rule 3.2: route-impact verification required.
- `AGENTS.md` Rule 4.3: URL/canonical strategy changes require an ADR.

## Decision

1. Set the public site URL source of truth to `https://monedario.cl/` in `src/config.ts`.
2. Derive Astro `base` from `new URL(SITE.website).pathname.replace(/\\/$/, "") || "/"` instead of hardcoding a repository subpath.
3. Keep internal path generation and markdown-link prefixing base-aware, so the code remains compatible with either root-domain or future subpath deployment.
4. Add `public/CNAME` with `monedario.cl` to make GitHub Pages custom-domain deployment reproducible from the repo.
5. Preserve public route identity by slug; do not alter route shape beyond removing the obsolete deploy-time subpath assumption.

## Consequences

### Positive

- CSS and JS assets resolve correctly at `https://monedario.cl/`.
- Canonical URLs, sitemap, robots, and RSS align with the real public domain.
- Deployment config becomes environment-driven from the site URL source of truth instead of a duplicated hardcoded base.
- Branding is consistent across runtime surfaces and active operational docs.

### Negative

- RSS and canonical baselines that embed the old GitHub Pages URL must be refreshed.
- URL-check fixtures and tests must support empty base-path operation.
- Historical reports may still mention the previous brand/domain; they are preserved as historical records unless they act as live gate inputs.

## Alternatives considered

### Keep `/tuplatainforma` as Astro `base` and rely on Cloudflare rewrites

Rejected. It keeps production correctness dependent on edge rewrite behavior and leaves generated asset URLs semantically wrong for the actual public origin.

### Replace GitHub Pages with another hosting provider

Rejected for this change. The immediate defect is asset path generation, not hosting capability.

## Validation

Required verification for this ADR:
- `pnpm run check:no-postid-urls`
- `pnpm run check:routes`
- `pnpm run check:rss`
- `pnpm run astro check`
- `pnpm run build`
