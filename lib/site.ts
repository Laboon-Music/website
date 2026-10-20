import type { MetadataRoute } from "next";
import { LOCALES, localePath } from "./i18n.ts";

// Canonical production URL (laboon-app.com redirects to www).
export const SITE_URL = "https://www.laboon-app.com";
export const PROD_HOSTS = ["www.laboon-app.com", "laboon-app.com"];

/** Pages never worth indexing, even in production (in every language). */
const NOINDEX_PAGES = [
  "/legal/",
  "/faq/embed",
  "/contact/embed",
  "/reset-password",
  "/confirm-email",
  "/inscription-confirmee",
];
const NOINDEX_PATHS = [
  "/api/",
  ...NOINDEX_PAGES.flatMap((page) => LOCALES.map((locale) => localePath(locale, page))),
];

export function isProductionHost(host: string | null | undefined): boolean {
  return !!host && PROD_HOSTS.includes(host);
}

/** robots.txt rules for the given Host header. */
export function robotsFor(host: string | null | undefined): MetadataRoute.Robots {
  if (!isProductionHost(host)) {
    return { rules: { userAgent: "*", disallow: "/" } };
  }
  return {
    rules: { userAgent: "*", allow: "/", disallow: NOINDEX_PATHS },
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}

/** Official contact address shown in the legal documents (GDPR requests, etc.). */
export const CONTACT_EMAIL = "laboon.app@gmail.com";

/** Social networks. Every place that lists them (footer, contact, FAQ, structured data) reads this. */
export const SOCIALS = [
  {
    name: "Instagram",
    handle: "@laboon.app.music",
    href: "https://www.instagram.com/laboon.app.music/",
  },
  {
    name: "Facebook",
    handle: "Laboon",
    href: "https://www.facebook.com/people/LaboonAPPMUSIC/61595076662122/",
  },
] as const;
