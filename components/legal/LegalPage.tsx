import type { Metadata } from "next";
import type { ReactNode } from "react";
import { PageShell } from "@/components/layout";
import { BackLink } from "@/components/ui";
import { DEFAULT_LOCALE, getLegalDoc, type LegalSlug } from "./registry";

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

/** Metadata of the public page of a legal document (title from the registry). */
export function legalMetadata(slug: LegalSlug): Metadata {
  return { title: getLegalDoc(DEFAULT_LOCALE, slug).entry.metaTitle };
}

/** Full public page of a legal document, e.g. `<LegalPage slug="cgu" />`. */
export function LegalPage({ slug }: { slug: LegalSlug }) {
  const { Component } = getLegalDoc(DEFAULT_LOCALE, slug).entry;
  return (
    <LegalPageShell>
      <Component />
    </LegalPageShell>
  );
}
