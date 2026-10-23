import type { Metadata } from "next";
import { Faq } from "@/components/faq/Faq";
import { getContent } from "@/content";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { NOINDEX } from "@/lib/page-metadata";

/**
 * Bare variant of the FAQ, loaded by the mobile app in a WebView at
 * `/faq/embed` (`?lang=en` for English). No site chrome, tighter padding,
 * `noindex` (duplicate of the home page FAQ).
 */
export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getContent(locale).ui.faq.metaTitle, robots: NOINDEX };
}

export default async function FaqEmbedPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  return (
    <main className="mx-auto max-w-3xl px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <Faq content={getContent(locale).faq} embed />
    </main>
  );
}
