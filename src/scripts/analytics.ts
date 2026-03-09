import {
  cleanAnalyticsParams,
  getReachedScrollMilestones,
  isOfficialSourceUrl,
  type AnalyticsEventParams,
} from "@/utils/analytics";

type AnalyticsConfig = {
  measurementId?: string;
};

type Cleanup = () => void;

declare global {
  interface Window {
    __monedarioAnalyticsConfig__?: AnalyticsConfig;
  }
}

const CLICK_HANDLER_FLAG = "data-analytics-click-handler-attached";
let pageCleanup: Cleanup | null = null;

function getConfig(): AnalyticsConfig {
  return window.__monedarioAnalyticsConfig__ ?? {};
}

function track(eventName: string, params: AnalyticsEventParams = {}) {
  const payload = cleanAnalyticsParams({
    page_path: window.location.pathname,
    page_type: getCurrentPageType(),
    ...params,
  });
  const measurementId = getConfig().measurementId;

  if (measurementId && typeof window.gtag === "function") {
    window.gtag("event", eventName, payload);
    return;
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event: eventName, ...payload });
}

function getCurrentPageType() {
  const typedElement = document.querySelector<HTMLElement>(
    "[data-analytics-page-type]"
  );
  return typedElement?.dataset.analyticsPageType ?? "unknown";
}

function installGlobalClickTracking() {
  if (document.documentElement.hasAttribute(CLICK_HANDLER_FLAG)) {
    return;
  }

  document.documentElement.setAttribute(CLICK_HANDLER_FLAG, "true");
  document.addEventListener("click", event => {
    const target = event.target;
    if (!(target instanceof Element)) return;

    const ctaElement = target.closest<HTMLElement>("[data-analytics-cta]");
    if (ctaElement) {
      const href =
        ctaElement instanceof HTMLAnchorElement ? ctaElement.href : undefined;
      track("cta_click", {
        cta_type: ctaElement.dataset.analyticsCta,
        cta_label:
          ctaElement.dataset.analyticsLabel ?? ctaElement.textContent?.trim(),
        cta_location: ctaElement.dataset.analyticsLocation,
        destination_url: href,
      });
    }

    const anchor = target.closest<HTMLAnchorElement>("a[href]");
    if (!anchor) return;
    if (!isOfficialSourceUrl(anchor.href)) return;

    track("official_source_click", {
      source_url: anchor.href,
      source_domain: new URL(anchor.href).hostname,
      source_label:
        anchor.dataset.analyticsLabel ??
        anchor.textContent?.trim() ??
        anchor.href,
    });
  });
}

function initArticleScrollTracking(): Cleanup {
  const article = document.querySelector<HTMLElement>(
    "[data-analytics-article]"
  );
  if (!article) return () => {};

  const firedMilestones = new Set<number>();
  const articleSlug = article.dataset.analyticsArticle;
  const articleTitle = article.dataset.analyticsArticleTitle;

  const handleScroll = () => {
    const maxScrollableHeight =
      document.documentElement.scrollHeight - window.innerHeight;
    if (maxScrollableHeight <= 0) return;

    const progress = (window.scrollY / maxScrollableHeight) * 100;

    for (const milestone of getReachedScrollMilestones(progress)) {
      if (firedMilestones.has(milestone)) continue;
      firedMilestones.add(milestone);
      track("article_scroll_depth", {
        article_slug: articleSlug,
        article_title: articleTitle,
        scroll_depth_percent: milestone,
      });
    }
  };

  window.addEventListener("scroll", handleScroll, { passive: true });
  handleScroll();

  return () => {
    window.removeEventListener("scroll", handleScroll);
  };
}

function initCalculatorStartTracking(): Cleanup {
  const calculatorRoot = document.querySelector<HTMLElement>(
    "[data-analytics-calculator]"
  );
  if (!calculatorRoot) return () => {};

  let hasStarted = false;
  const calculatorSlug = calculatorRoot.dataset.analyticsCalculator;
  const calculatorName = calculatorRoot.dataset.analyticsCalculatorName;

  const startTracking = (interactionType: string) => {
    if (hasStarted) return;
    hasStarted = true;
    track("calculator_start", {
      calculator_slug: calculatorSlug,
      calculator_name: calculatorName,
      interaction_type: interactionType,
    });
  };

  const handleFocusIn = (event: Event) => {
    if ((event.target as Element | null)?.closest("input, select, textarea")) {
      startTracking("focusin");
    }
  };

  const handleInput = (event: Event) => {
    if ((event.target as Element | null)?.closest("input, select, textarea")) {
      startTracking("input");
    }
  };

  const handleClick = (event: Event) => {
    if ((event.target as Element | null)?.closest("button")) {
      startTracking("click");
    }
  };

  calculatorRoot.addEventListener("focusin", handleFocusIn);
  calculatorRoot.addEventListener("input", handleInput);
  calculatorRoot.addEventListener("click", handleClick);

  return () => {
    calculatorRoot.removeEventListener("focusin", handleFocusIn);
    calculatorRoot.removeEventListener("input", handleInput);
    calculatorRoot.removeEventListener("click", handleClick);
  };
}

function initPageTracking() {
  pageCleanup?.();
  const cleanups = [initArticleScrollTracking(), initCalculatorStartTracking()];
  pageCleanup = () => {
    for (const cleanup of cleanups) {
      cleanup();
    }
  };
}

window.monedarioAnalytics = {
  track,
};

installGlobalClickTracking();
initPageTracking();
document.addEventListener("astro:page-load", initPageTracking);
document.addEventListener("astro:after-swap", initPageTracking);
