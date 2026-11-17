import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { LegalPageShell } from "@/components/legal/LegalPage";
import {
  historyTitle,
  LegalVersionHistory,
} from "@/components/legal/LegalVersionHistory";
import { getContent } from "@/content";
import { fmt } from "@/lib/i18n";
import { fetchLegalVersions } from "@/lib/legal-api";
import { LEGAL_SLUGS } from "@/lib/legal-slugs";
import { resolveLocale } from "@/lib/locale-params";
import { alternatesFor } from "@/lib/page-metadata";

/**
 * History of a public legal document (`/cgu/versions`, `/en/cgu/versions`): the
 * versions in force or replaced, read from the Laboon API, each linking to its
 * frozen page. Same caching and build rules as the document page next to it.
 * See docs/features/legal-documents.md.
 */

export function generateStaticParams() {
  return [];
}

// Next reads this literally (no constant); same value as the API read in `lib/legal-api.ts`.
export const revalidate = 300;

type Params = { params: Promise<{ lang: string; document: string }> };

async function load({ params }: Params) {
  const locale = await resolveLocale(params);
  const { document: slug } = await params;
  // Checked before any API call: only the public documents have a history page.
  if (!(LEGAL_SLUGS as readonly string[]).includes(slug)) notFound();
  const result = await fetchLegalVersions(slug, locale);
  if (result.kind === "not_found" || result.versions.length === 0) notFound();
  return { locale, slug, versions: result.versions };
}

export async function generateMetadata(props: Params): Promise<Metadata> {
  const { locale, slug, versions } = await load(props);
  const { ui, site } = getContent(locale);
  return {
    title: fmt(ui.legal.versionsMetaTitle, {
      title: historyTitle(versions),
      site: site.name,
    }),
    alternates: alternatesFor(locale, `/${slug}/versions`),
  };
}

export default async function Page(props: Params) {
  const { locale, slug, versions } = await load(props);
  return (
    <LegalPageShell>
      <LegalVersionHistory locale={locale} slug={slug} versions={versions} />
    </LegalPageShell>
  );
}
