import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageShell } from "@/components/layout";
import { BackLink } from "@/components/ui";
import type { Locale } from "@/lib/i18n";
import { alternatesFor } from "@/lib/page-metadata";
import { getLegalDoc, type LegalSlug } from "./registry";

/**
 * Public-page wrapper for a legal document: site chrome + back link.
 * The bare embed variant (app WebView, /legal/<slug>) does NOT use this shell.
 */
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

/** Metadata of the public page of a legal document (title from the registry, hreflang). */
export function legalMetadata(locale: Locale, slug: LegalSlug): Metadata {
  return {
    title: getLegalDoc(locale, slug).entry.metaTitle,
    alternates: alternatesFor(locale, `/${slug}`),
  };
}

/** Full public page of a legal document, e.g. `<LegalPage locale="en" slug="cgu" />`. */
export function LegalPage({ locale, slug }: { locale: Locale; slug: LegalSlug }) {
  const { Component } = getLegalDoc(locale, slug).entry;
  return (
    <LegalPageShell>
      <Component />
    </LegalPageShell>
  );
}
