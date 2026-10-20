import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getLegalDoc, isLegalSlug, LEGAL_SLUGS } from "@/components/legal/registry";
import { getContent } from "@/content";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { NOINDEX } from "@/lib/page-metadata";

/**
 * Bare "embed" variant of each legal document, loaded by the mobile app in a
 * WebView at `/legal/<slug>?lang=<locale>` (the proxy turns `?lang=` into the
 * language of the route). No site chrome (no nav/footer/back link), tighter
 * padding, inherits the theme from the root layout. `noindex` so these
 * duplicates of the public `/<slug>` pages are not indexed.
 */

export function generateStaticParams() {
  return LEGAL_SLUGS.map((slug) => ({ slug }));
}

export const dynamicParams = false;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  if (!isLegalSlug(slug)) {
    return { title: getContent(locale).ui.legal.fallbackTitle, robots: NOINDEX };
  }
  return { title: getLegalDoc(locale, slug).entry.metaTitle, robots: NOINDEX };
}

export default async function LegalEmbedPage({
  params,
}: {
  params: Promise<{ lang: string; slug: string }>;
}) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  if (!isLegalSlug(slug)) notFound();

  const { Component } = getLegalDoc(locale, slug).entry;
  return (
    <main className="mx-auto max-w-3xl px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <Component />
    </main>
  );
}
