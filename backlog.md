# Monedario Backlog

Priority Score Formula: `Impact x Confidence / Effort`

## Phase 1 - Acquisition Engine

### MB-001 - Establish SEO baseline dashboard
- **Description:** Define the core KPI set for the next 90 days and create a baseline snapshot covering impressions, clicks, CTR, average position, top landing pages, calculator entries, and indexed pages.
- **Impact:** 5
- **Effort:** 2
- **Confidence:** 5
- **Priority Score:** 12.5
- **Status:** DONE
- **Dependencies:** None
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-002 - Validate Search Console and submit sitemap
- **Description:** With founder-confirmed ownership already in place, use authenticated Google Search Console and Bing Webmaster access to submit `sitemap-index.xml`, inspect coverage issues, and document indexation anomalies with real platform data.
- **Impact:** 5
- **Effort:** 2
- **Confidence:** 5
- **Priority Score:** 12.5
- **Status:** TODO
- **Dependencies:** MB-001, MB-032
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-031 - Obtain Search Console and Bing access prerequisites
- **Description:** Obtain authenticated Google Search Console and Bing Webmaster access, or complete the domain/site ownership validation steps required so MB-002 can verify submission and coverage with real platform data. Founder-confirmed manual ownership verification satisfied the prerequisite-validation requirement; any remaining missing agent-side access is tracked separately.
- **Impact:** 5
- **Effort:** 2
- **Confidence:** 4
- **Priority Score:** 10.0
- **Status:** DONE
- **Dependencies:** None
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-032 - Obtain authenticated agent-side Search Console and Bing access
- **Description:** Secure authenticated operational access for the execution environment so future work can submit sitemaps, inspect coverage, and read platform diagnostics directly without relying on founder-side confirmation only.
- **Impact:** 4
- **Effort:** 2
- **Confidence:** 5
- **Priority Score:** 10.0
- **Status:** TODO
- **Dependencies:** MB-031
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-003 - Configure analytics events for content and calculator journeys
- **Description:** Track article scroll depth, outbound official-source clicks, calculator starts, calculator completions, and CTA clicks so SEO traffic can be evaluated beyond pageviews.
- **Impact:** 4
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 5.3
- **Status:** TODO
- **Dependencies:** MB-001
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-004 - Build the keyword universe and URL map
- **Description:** Create the initial keyword set for core Chilean financial decisions and map each term cluster to an existing or planned landing page to avoid cannibalization.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 5
- **Priority Score:** 8.3
- **Status:** DONE
- **Dependencies:** MB-001
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-005 - Rewrite homepage metadata and hero positioning
- **Description:** Replace generic homepage title, description, and H1 framing with a Chile-specific value proposition that clearly signals calculators, guides, and practical financial education.
- **Impact:** 5
- **Effort:** 2
- **Confidence:** 5
- **Priority Score:** 12.5
- **Status:** TODO
- **Dependencies:** MB-004
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-006 - Restructure homepage around problem-based entry points
- **Description:** Reorganize the homepage so users can enter by intent cluster such as sueldo, AFP/APV, crédito, cesantía, impuestos, and presupuesto instead of relying primarily on recency.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 6.7
- **Status:** TODO
- **Dependencies:** MB-004, MB-005
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-007 - Normalize canonical, OG, and metadata consistency
- **Description:** Audit core templates to ensure canonical URLs, Open Graph URLs, Twitter URLs, schema URLs, titles, and descriptions are absolute, consistent, and cluster-aware.
- **Impact:** 5
- **Effort:** 2
- **Confidence:** 4
- **Priority Score:** 10.0
- **Status:** DONE
- **Dependencies:** MB-025
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-008 - Audit tag indexation and sitemap hygiene
- **Description:** Review tag pages, paginated archives, and any low-value URLs to decide which should remain indexable, which should be deprioritized, and which should be excluded from sitemap or indexing paths.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 6.7
- **Status:** DONE
- **Dependencies:** MB-025, MB-007
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-025 - Run full technical SEO crawl
- **Description:** Run a full crawl with Screaming Frog, Sitebulb, or an equivalent crawler to detect broken links, redirect chains, duplicate titles, duplicate descriptions, orphan pages, canonical conflicts, thin pages, and pagination issues, then document results and create follow-up tasks if needed.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 5
- **Priority Score:** 8.3
- **Status:** DONE
- **Dependencies:** None
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-027 - Structured data audit
- **Description:** Review schema implementation for Article, FAQ, HowTo, Breadcrumb, and calculator pages, and verify that each implementation aligns with Google's supported structured data types and page intent.
- **Impact:** 4
- **Effort:** 2
- **Confidence:** 5
- **Priority Score:** 10.0
- **Status:** DONE
- **Dependencies:** None
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-029 - Repair broken citation and link targets found in Sprint 1A crawl
- **Description:** Replace or update the broken official-source URLs found in laws and articles, verify the author profile link behavior, and remove the broken `/cdn-cgi/l/email-protection` internal-link pattern detected on article pages.
- **Impact:** 4
- **Effort:** 2
- **Confidence:** 4
- **Priority Score:** 8.0
- **Status:** DONE
- **Dependencies:** MB-025
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-030 - Remediate structured data on article, glossary, calculator, and hub templates
- **Description:** Remove duplicate `BlogPosting` output on article pages, make article schema URLs absolute, add `BreadcrumbList` where missing, and add justified glossary/hub schema such as `DefinedTerm` or `CollectionPage` only where appropriate.
- **Impact:** 4
- **Effort:** 3
- **Confidence:** 5
- **Priority Score:** 6.7
- **Status:** DONE
- **Dependencies:** MB-027, MB-007
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-028 - SERP intent analysis for priority keywords
- **Description:** Analyze dominant content formats, calculator presence, featured snippets, FAQ boxes, government sources, and ranking patterns for each priority keyword cluster, then update cluster strategy based on observed SERP intent.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 6.7
- **Status:** DONE
- **Dependencies:** MB-004
- **Roadmap Phase:** Phase 1 - Acquisition Engine

### MB-033 - Resolve semantic cluster taxonomy before cluster build
- **Description:** Define the canonical cluster ownership and future hub URL strategy for `sueldo liquido y remuneraciones`, `cesantia y proteccion social`, `UF / inflacion / costo de vida`, and `presupuesto / control financiero`, while deciding how APV relates to pensions vs ahorro. If URL strategy changes are required, prepare the change as an ADR-backed routing decision before implementation.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 6.7
- **Status:** TODO
- **Dependencies:** MB-004, MB-028
- **Roadmap Phase:** Phase 1 - Acquisition Engine

## Phase 2 - Authority Building

### MB-026 - Build internal linking architecture map
- **Description:** For each core cluster hub, map the supporting articles, relevant calculators, glossary definitions, and legal explainers, then design the internal linking structure that reinforces topical authority and next-step navigation.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 5
- **Priority Score:** 8.3
- **Status:** TODO
- **Dependencies:** MB-004, MB-028
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-009 - Create cluster hub for sueldo liquido y remuneraciones
- **Description:** Build a hub page that consolidates sueldo líquido, descuentos, liquidación, impuesto único, and related calculator entry points into one authoritative cluster.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 6.7
- **Status:** TODO
- **Dependencies:** MB-006, MB-026
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-010 - Create cluster hub for AFP y APV
- **Description:** Build a hub page for AFP, APV, Cuenta 2, fondos, cambio de AFP, and retirement planning, with clear paths to related guides and calculators.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 6.7
- **Status:** TODO
- **Dependencies:** MB-006, MB-026
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-011 - Create cluster hub for credito y deuda
- **Description:** Build a hub page connecting CAE, crédito de consumo, prepago, tarjetas, renegociación, and debt diagnosis content into one decision-support structure.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 6.7
- **Status:** TODO
- **Dependencies:** MB-006, MB-026
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-012 - Create cluster hub for cesantia y proteccion social
- **Description:** Build a hub page covering seguro de cesantía, AFC, saldo CIC, access conditions, and adjacent employment-shock support content.
- **Impact:** 4
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 5.3
- **Status:** TODO
- **Dependencies:** MB-006, MB-026
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-013 - Create cluster hub for UF, inflacion y costo de vida
- **Description:** Build a hub page linking UF explainers, calculator tools, arriendo adjustments, inflation context, and practical household impact scenarios.
- **Impact:** 4
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 5.3
- **Status:** TODO
- **Dependencies:** MB-006, MB-026
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-014 - Create cluster hub for impuestos personales
- **Description:** Build a hub page for Operación Renta, devolución, boletas de honorarios, impuesto único, and official tax guidance for individuals in Chile.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 6.7
- **Status:** TODO
- **Dependencies:** MB-006, MB-026
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-015 - Create cluster hub for presupuesto y control financiero
- **Description:** Build a hub page around presupuesto, gastos hormiga, control financiero, and basic planning habits, designed as an entry point for less technical users.
- **Impact:** 4
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 5.3
- **Status:** TODO
- **Dependencies:** MB-006, MB-026
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-016 - Add article-to-calculator internal link modules
- **Description:** Add structured modules that connect relevant articles to the matching calculator, prioritizing sueldo, APV, crédito, cesantía, UF, and arriendo paths.
- **Impact:** 5
- **Effort:** 3
- **Confidence:** 5
- **Priority Score:** 8.3
- **Status:** TODO
- **Dependencies:** MB-006, MB-009, MB-010, MB-011, MB-012, MB-013, MB-014
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-017 - Add contextual glossary and legal explainer link blocks
- **Description:** Insert standardized blocks on relevant pages that route users to glossary definitions and legal explainers when a concept has regulatory or technical friction.
- **Impact:** 4
- **Effort:** 2
- **Confidence:** 4
- **Priority Score:** 8.0
- **Status:** TODO
- **Dependencies:** MB-009, MB-010, MB-011, MB-012, MB-013, MB-014, MB-015
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-018 - Refresh top high-intent evergreen articles
- **Description:** Update the highest-intent pages with improved intros, FAQ sections, stronger source citations, calculator links, and explicit freshness markers.
- **Impact:** 5
- **Effort:** 4
- **Confidence:** 5
- **Priority Score:** 6.3
- **Status:** TODO
- **Dependencies:** MB-004, MB-016, MB-017
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-019 - Strengthen cluster navigation and next-step pathways
- **Description:** Improve local navigation, related-content logic, breadcrumbs, and "next best action" pathways so users can move from discovery to understanding to tool usage.
- **Impact:** 4
- **Effort:** 3
- **Confidence:** 4
- **Priority Score:** 5.3
- **Status:** TODO
- **Dependencies:** MB-009, MB-010, MB-011, MB-012, MB-013, MB-014, MB-015
- **Roadmap Phase:** Phase 2 - Authority Building

### MB-020 - Define content refresh cadence and cluster ownership
- **Description:** Establish a lightweight operating cadence for updating priority clusters, including review frequency, source-check expectations, and ownership by content area.
- **Impact:** 3
- **Effort:** 2
- **Confidence:** 4
- **Priority Score:** 6.0
- **Status:** TODO
- **Dependencies:** MB-018
- **Roadmap Phase:** Phase 2 - Authority Building

## Phase 3 - Conversion and Distribution Readiness

### MB-021 - Define the newsletter or email capture offer
- **Description:** Decide the value proposition for owned audience capture, such as weekly financial clarity, calculator updates, or practical alerts, and align it with Monedario's trust positioning.
- **Impact:** 4
- **Effort:** 2
- **Confidence:** 4
- **Priority Score:** 8.0
- **Status:** IDEA
- **Dependencies:** MB-001, MB-018
- **Roadmap Phase:** Phase 3 - Conversion and Distribution Readiness

### MB-022 - Implement CTA framework by page intent
- **Description:** Define which CTA appears on each template type, such as calculator CTA on explanatory articles, newsletter CTA on evergreen hubs, and deeper-guide CTA on calculators.
- **Impact:** 4
- **Effort:** 2
- **Confidence:** 4
- **Priority Score:** 8.0
- **Status:** IDEA
- **Dependencies:** MB-016, MB-019, MB-021
- **Roadmap Phase:** Phase 3 - Conversion and Distribution Readiness

### MB-023 - Build weekly keyword and performance reporting ritual
- **Description:** Create a recurring weekly scorecard that reviews the watchlist, indexation health, top winners and losers, CTR changes, and opportunities for content refresh or internal-link updates.
- **Impact:** 4
- **Effort:** 2
- **Confidence:** 5
- **Priority Score:** 10.0
- **Status:** TODO
- **Dependencies:** MB-001, MB-002, MB-003, MB-004
- **Roadmap Phase:** Phase 3 - Conversion and Distribution Readiness

### MB-024 - Run limited distribution tests for flagship assets
- **Description:** Promote only the strongest cluster pages and calculators on selected channels such as X, LinkedIn, Reddit, or niche communities, then measure assisted traffic and repeat visits.
- **Impact:** 4
- **Effort:** 3
- **Confidence:** 3
- **Priority Score:** 4.0
- **Status:** IDEA
- **Dependencies:** MB-018, MB-021, MB-022, MB-023
- **Roadmap Phase:** Phase 3 - Conversion and Distribution Readiness
