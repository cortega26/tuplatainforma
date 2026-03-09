export const SCROLL_DEPTH_MILESTONES = [25, 50, 75, 100] as const;

const OFFICIAL_HOST_SUFFIXES = [".gob.cl"] as const;
const OFFICIAL_HOSTNAMES = new Set([
  "afc.cl",
  "bcn.cl",
  "chileatiende.gob.cl",
  "cmfchile.cl",
  "dt.gob.cl",
  "ine.cl",
  "previsionsocial.gob.cl",
  "sii.cl",
  "spensiones.cl",
  "suseso.cl",
  "superir.gob.cl",
  "tesoreria.cl",
  "si3.bcentral.cl",
]);

export type AnalyticsEventParams = Record<
  string,
  string | number | boolean | undefined
>;

export function getReachedScrollMilestones(progressPercent: number): number[] {
  if (!Number.isFinite(progressPercent) || progressPercent <= 0) {
    return [];
  }

  const normalizedProgress = Math.min(progressPercent, 100);
  return SCROLL_DEPTH_MILESTONES.filter(
    milestone => normalizedProgress >= milestone
  );
}

export function isOfficialSourceUrl(href: string): boolean {
  let url: URL;

  try {
    url = new URL(href);
  } catch {
    return false;
  }

  if (!["http:", "https:"].includes(url.protocol)) {
    return false;
  }

  const hostname = url.hostname.toLowerCase();
  const normalizedHostname = hostname.replace(/^www\./, "");
  if (
    OFFICIAL_HOSTNAMES.has(hostname) ||
    OFFICIAL_HOSTNAMES.has(normalizedHostname)
  ) {
    return true;
  }

  return OFFICIAL_HOST_SUFFIXES.some(
    suffix => hostname.endsWith(suffix) || normalizedHostname.endsWith(suffix)
  );
}

export function cleanAnalyticsParams(
  params: AnalyticsEventParams
): Record<string, string | number | boolean> {
  return Object.fromEntries(
    Object.entries(params).filter(([, value]) => value !== undefined)
  ) as Record<string, string | number | boolean>;
}

export function trackAnalyticsEvent(
  eventName: string,
  params: AnalyticsEventParams = {}
) {
  if (typeof window === "undefined") return;
  window.monedarioAnalytics?.track(eventName, params);
}
