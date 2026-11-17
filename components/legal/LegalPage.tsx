import type { Metadata } from "next";
import { notFound } from "next/navigation";
import type { ReactNode } from "react";
import { PageShell } from "@/components/layout";
import { BackLink } from "@/components/ui";
import { getContent } from "@/content";
import type { Locale } from "@/lib/i18n";
import { fetchLegalInForce, type LegalVersion } from "@/lib/legal-api";
import { alternatesFor, NOINDEX } from "@/lib/page-metadata";
import { LegalArticle } from "./LegalArticle";

/**
 * Pages of the version in force of a legal document, read from the Laboon API
 * (the site keeps no copy of the texts). Each page file exports
 * `generateStaticParams = () => []` (nothing is rendered at build, so the build
 * never needs the API) and `revalidate = 300`, then renders one of these.
 * An unknown slug is a 404; an API failure throws (HTTP 5xx, the last cached
 * page stays served). See docs/features/legal-documents.md.
 */

const SLUG = /^[a-z0-9-]{1,64}$/;

async function loadInForce(locale: Locale, slug: string): Promise<LegalVersion> {
  // Checked before any API call: a malformed URL is a missing page.
  if (!SLUG.test(slug)) notFound();
  const result = await fetchLegalInForce(slug, locale);
  if (result.kind === "not_found") notFound();
  return result.doc;
}

function titleOf(doc: LegalVersion): string {
  return `${doc.title} — ${getContent(doc.locale).site.name}`;
}

/** Wrapper of a public page: site chrome + back link. The bare embed does NOT use it. */
export function LegalPageShell({ children }: { children: ReactNode }) {
  return (
    <PageShell>
      <div className="rise mx-auto w-full max-w-[760px]">
        <BackLink />
        <div className="mt-5 break-words">{children}</div>
      </div>
    </PageShell>
  );
}

/** Metadata of the public page of a legal document (title from the API, hreflang). */
export async function legalMetadata(locale: Locale, slug: string): Promise<Metadata> {
  const doc = await loadInForce(locale, slug);
  return { title: titleOf(doc), alternates: alternatesFor(locale, `/${slug}`) };
}

/** Public page of a legal document, e.g. `<LegalPage locale="en" slug="cgu" />`. */
export async function LegalPage({ locale, slug }: { locale: Locale; slug: string }) {
  const doc = await loadInForce(locale, slug);
  return (
    <LegalPageShell>
      {/* The API may answer in another language than the one asked (fallback). */}
      <div lang={doc.locale === locale ? undefined : doc.locale}>
        <LegalArticle doc={doc} />
      </div>
    </LegalPageShell>
  );
}

/** Metadata of the bare embed (`/legal/<slug>`): `noindex`. */
export async function legalEmbedMetadata(
  locale: Locale,
  slug: string,
): Promise<Metadata> {
  return { title: titleOf(await loadInForce(locale, slug)), robots: NOINDEX };
}

/** Bare embed of a legal document, loaded by the app WebView (no chrome). */
export async function LegalEmbed({ locale, slug }: { locale: Locale; slug: string }) {
  const doc = await loadInForce(locale, slug);
  return <LegalEmbedMain locale={locale} doc={doc} />;
}

/** Bare `<main>` shared by the embeds of the version in force and of a frozen version. */
export function LegalEmbedMain({ locale, doc }: { locale: Locale; doc: LegalVersion }) {
  return (
    <main
      // The API may answer in another language than the one asked (fallback).
      lang={doc.locale === locale ? undefined : doc.locale}
      className="mx-auto max-w-3xl px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]"
    >
      <LegalArticle doc={doc} />
    </main>
  );
}
