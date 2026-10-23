// Languages of the website. French is the default and has no URL prefix
// (`/contact`); English lives under `/en` (`/en/contact`).
// See docs/features/i18n.md.

export const LOCALES = ["fr", "en"] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = "fr";

export function isLocale(value: unknown): value is Locale {
  return typeof value === "string" && (LOCALES as readonly string[]).includes(value);
}

/** Coerces an arbitrary value (`?lang=`, header, route param) to a served locale. */
export function normalizeLocale(value?: string | null): Locale {
  const short = value?.toLowerCase().split(/[-_]/)[0];
  return isLocale(short) ? short : DEFAULT_LOCALE;
}

/** URL path of `path` (starting with `/`, may hold `?query` / `#hash`) in `locale`. */
export function localePath(locale: Locale, path: string): string {
  if (locale === DEFAULT_LOCALE) return path;
  if (path === "/") return `/${locale}`;
  if (path.startsWith("/#") || path.startsWith("/?")) return `/${locale}${path.slice(1)}`;
  return `/${locale}${path}`;
}

/** Splits a URL pathname into its locale prefix (if any) and the rest. */
export function splitLocale(pathname: string): { locale: Locale | null; path: string } {
  const [, first, ...rest] = pathname.split("/");
  if (isLocale(first)) return { locale: first, path: `/${rest.join("/")}` };
  return { locale: null, path: pathname };
}

/** Best locale for an `Accept-Language` header (first served language), else the default. */
export function localeFromAcceptLanguage(header?: string | null): Locale {
  for (const part of (header ?? "").split(",")) {
    const lang = part.split(";")[0].trim().toLowerCase().split("-")[0];
    if (isLocale(lang)) return lang;
  }
  return DEFAULT_LOCALE;
}

/** `hreflang` alternates of a page, for `metadata.alternates.languages`. */
export function languageAlternates(path: string): Record<string, string> {
  return {
    ...Object.fromEntries(LOCALES.map((l) => [l, localePath(l, path)])),
    "x-default": localePath(DEFAULT_LOCALE, path),
  };
}

/** Fills `{name}` placeholders of a dictionary text: `fmt("Hi {name}", { name: "Jo" })`. */
export function fmt(template: string, vars: Record<string, string | number>): string {
  return template.replace(/\{(\w+)\}/g, (match, key: string) =>
    key in vars ? String(vars[key]) : match,
  );
}
