import { getContent } from "@/content";
import { normalizeLocale, type Locale } from "@/lib/i18n";

// Language of an API request: the forms send their page language as `locale`
// in the JSON body. Server messages (errors) are written in that language.

export function bodyLocale(body: { locale?: unknown } | null): Locale {
  return normalizeLocale(typeof body?.locale === "string" ? body.locale : null);
}

/** Error messages in the language of the request. */
export function errorsFor(locale: Locale) {
  return getContent(locale).ui.errors;
}
