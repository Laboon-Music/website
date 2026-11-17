import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";
import { LEGAL_SLUGS } from "@/lib/legal-slugs";
import { resolveLocale } from "@/lib/locale-params";

/**
 * Public pages of the legal documents (`/cgu`, `/charte`, `/confidentialite`,
 * `/mentions-legales`), read from the Laboon API: the site keeps no copy of the
 * texts. The slug is a dynamic segment on purpose: an empty `generateStaticParams`
 * is what keeps Next from rendering anything at build (the build never needs the
 * API), while each page is cached 300 s after its first request (ISR). Static
 * routes (`/contact`, `/faq`…) win over this segment; any other single-segment
 * URL is a 404 without calling the API.
 * See docs/features/legal-documents.md.
 */

export function generateStaticParams() {
  return [];
}

// Next reads this literally (no constant); same value as the API read in `lib/legal-api.ts`.
export const revalidate = 300;

type Params = { params: Promise<{ lang: string; document: string }> };

async function resolve({ params }: Params) {
  const locale = await resolveLocale(params);
  const { document } = await params;
  if (!(LEGAL_SLUGS as readonly string[]).includes(document)) notFound();
  return { locale, slug: document };
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { locale, slug } = await resolve(props);
  return legalMetadata(locale, slug);
}

export default async function Page(props: Params) {
  const { locale, slug } = await resolve(props);
  return LegalPage({ locale, slug });
}
