import type { Metadata } from "next";
import { LegalEmbed, legalEmbedMetadata } from "@/components/legal/LegalPage";
import { resolveLocale } from "@/lib/locale-params";

/**
 * Bare "embed" variant of the version in force of a legal document, loaded by
 * the mobile app in a WebView at `/legal/<slug>?lang=<locale>` (the proxy turns
 * `?lang=` into the language of the route). No site chrome, `noindex` so these
 * duplicates of the public pages are not indexed. Any slug the API knows works.
 * Nothing is rendered at build (the build never needs the API): the first
 * request renders the page, then it is cached 300 s (ISR).
 * See docs/features/legal-documents.md.
 */

export function generateStaticParams() {
  return [];
}

// Next reads this literally (no constant); same value as the API read in `lib/legal-api.ts`.
export const revalidate = 300;

type Params = { params: Promise<{ lang: string; slug: string }> };

async function resolve({ params }: Params) {
  const locale = await resolveLocale(params);
  const { slug } = await params;
  return { locale, slug };
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { locale, slug } = await resolve(props);
  return legalEmbedMetadata(locale, slug);
}

export default async function LegalEmbedPage(props: Params) {
  const { locale, slug } = await resolve(props);
  return LegalEmbed({ locale, slug });
}
