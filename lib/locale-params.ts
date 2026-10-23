import { notFound } from "next/navigation";
import { isLocale, type Locale } from "@/lib/i18n";

/** Route params of every page under `app/[lang]`. */
export type LangParams = { params: Promise<{ lang: string }> };

/** Reads the `[lang]` segment; unknown languages are a 404. */
export async function resolveLocale(params: LangParams["params"]): Promise<Locale> {
  const { lang } = await params;
  if (!isLocale(lang)) notFound();
  return lang;
}
