import type { Locale } from "@/lib/i18n";

/** Route params of a page under `app/[lang]`, as Next passes them (a promise). */
export const langParams = (lang: Locale) => ({ params: Promise.resolve({ lang }) });
