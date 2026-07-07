type AnalyticsParams = Record<string, string | number | boolean | null | undefined>;

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Pushes to window.dataLayer (GTM) and calls window.gtag (GA4) if present.
 * Safe no-op until an analytics tag is actually installed on the site.
 */
export function trackEvent(event: string, params: AnalyticsParams = {}) {
  if (typeof window === "undefined") return;

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({ event, ...params });

  window.gtag?.("event", event, params);
}
