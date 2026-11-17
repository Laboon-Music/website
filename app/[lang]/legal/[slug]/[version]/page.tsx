import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalEmbedMain } from "@/components/legal/LegalPage";
import { getContent } from "@/content";
import { fetchLegalVersion } from "@/lib/legal-api";
import { resolveLocale } from "@/lib/locale-params";
import { NOINDEX } from "@/lib/page-metadata";

/**
 * Frozen version of a legal document, read from the Laboon API:
 * `/legal/<slug>/<version>?lang=<locale>`. The mobile app opens this URL at its
 * legal gate so the user accepts exactly the text they read. Bare page (no
 * nav/footer), `noindex`. See docs/features/legal-documents.md.
 *
 * Rendered on demand then cached (ISR): `generateStaticParams` is empty, so the build
 * never calls the API and any slug the API knows works. A failing API throws
 * (HTTP 5xx, never cached): the app's viewer relies on a status >= 400.
 */

// Nothing is generated at build time: an empty list is what makes Next cache each
// page after its first request (ISR) instead of rendering it on every request.
export function generateStaticParams() {
  return [];
}

// Next reads this literally (no constant); same value as the API read in `lib/legal-api.ts`.
export const revalidate = 300;

type Params = { params: Promise<{ lang: string; slug: string; version: string }> };

const SLUG = /^[a-z0-9-]{1,64}$/;
const VERSION = /^[1-9]\d{0,8}$/;

async function loadDocument({ params }: Params) {
  const locale = await resolveLocale(params);
  const { slug, version } = await params;
  // Checked before any API call: a malformed URL is a missing page.
  if (!SLUG.test(slug) || !VERSION.test(version)) notFound();

  const result = await fetchLegalVersion(slug, locale, Number(version));
  if (result.kind === "not_found") notFound();
  return { locale, doc: result.doc };
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { doc } = await loadDocument(props);
  return { title: `${doc.title} — ${getContent(doc.locale).site.name}`, robots: NOINDEX };
}

export default async function LegalVersionPage(props: Params) {
  const { locale, doc } = await loadDocument(props);
  return <LegalEmbedMain locale={locale} doc={doc} />;
}
