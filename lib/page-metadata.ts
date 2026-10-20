import type { Metadata } from "next";
import { languageAlternates, localePath, type Locale } from "@/lib/i18n";

/** `alternates` (canonical + hreflang) of an indexable page, e.g. `alternatesFor("en", "/contact")`. */
export function alternatesFor(locale: Locale, path: string): Metadata["alternates"] {
  return { canonical: localePath(locale, path), languages: languageAlternates(path) };
}

/** Pages that must not be indexed (embeds, account links, confirmation). */
export const NOINDEX: Metadata["robots"] = { index: false, follow: false };
