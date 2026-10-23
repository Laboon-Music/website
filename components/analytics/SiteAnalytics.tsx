"use client";

import { Analytics, type BeforeSendEvent } from "@vercel/analytics/next";

/**
 * Removes the query string and the hash from every URL sent to analytics: the
 * account links carry one-time codes (`?code=…`) and no personal data may leave
 * the page. Page views are still counted per path.
 */
export function stripUrlDetails(event: BeforeSendEvent): BeforeSendEvent {
  try {
    const url = new URL(event.url);
    url.search = "";
    url.hash = "";
    return { ...event, url: url.toString() };
  } catch {
    return event;
  }
}

/** Vercel Web Analytics (cookieless). See docs/features/analytics.md. */
export function SiteAnalytics() {
  return <Analytics beforeSend={stripUrlDetails} />;
}
