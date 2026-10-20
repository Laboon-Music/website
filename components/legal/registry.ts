import type { ComponentType } from "react";
import { DEFAULT_LOCALE, normalizeLocale, type Locale } from "@/lib/i18n";
import Cgu from "./content/fr/Cgu";
import CguEn from "./content/en/Cgu";
import Cgv from "./content/fr/Cgv";
import CgvEn from "./content/en/Cgv";
import Charte from "./content/fr/Charte";
import CharteEn from "./content/en/Charte";
import Confidentialite from "./content/fr/Confidentialite";
import ConfidentialiteEn from "./content/en/Confidentialite";
import MentionsLegales from "./content/fr/MentionsLegales";
import MentionsLegalesEn from "./content/en/MentionsLegales";

/**
 * Registry of legal documents, keyed by locale then slug. The slug is used both
 * in the public route (`/<slug>`) and the app WebView embed route
 * (`/legal/<slug>?lang=<locale>`), and must stay in sync with
 * `legal_document.slug` in Supabase.
 *
 * French and English exist. Adding a language = create `content/<locale>/*.tsx`
 * and register it in `LEGAL_CONTENT`. Missing translations fall back to
 * `DEFAULT_LOCALE`.
 */
// The languages and the fallback are those of the site (lib/i18n.ts).
export { DEFAULT_LOCALE, normalizeLocale, type Locale };

export type LegalSlug = "cgu" | "cgv" | "charte" | "confidentialite" | "mentions-legales";

type LegalEntry = { metaTitle: string; Component: ComponentType };

const FR: Record<LegalSlug, LegalEntry> = {
  cgu: { metaTitle: "Conditions Générales d'Utilisation — Laboon", Component: Cgu },
  cgv: { metaTitle: "Conditions Générales de Vente — Laboon", Component: Cgv },
  charte: { metaTitle: "Charte de Bonne Conduite — Laboon", Component: Charte },
  confidentialite: {
    metaTitle: "Politique de confidentialité — Laboon",
    Component: Confidentialite,
  },
  "mentions-legales": {
    metaTitle: "Mentions légales — Laboon",
    Component: MentionsLegales,
  },
};

const EN: Record<LegalSlug, LegalEntry> = {
  cgu: { metaTitle: "Terms of Use — Laboon", Component: CguEn },
  cgv: { metaTitle: "Terms of Sale — Laboon", Component: CgvEn },
  charte: { metaTitle: "Code of Conduct — Laboon", Component: CharteEn },
  confidentialite: { metaTitle: "Privacy Policy — Laboon", Component: ConfidentialiteEn },
  "mentions-legales": {
    metaTitle: "Legal Notice — Laboon",
    Component: MentionsLegalesEn,
  },
};

export const LEGAL_CONTENT: Partial<Record<Locale, Record<LegalSlug, LegalEntry>>> = {
  fr: FR,
  en: EN,
};

export const LEGAL_SLUGS = Object.keys(FR) as LegalSlug[];

export function isLegalSlug(value: string): value is LegalSlug {
  return (LEGAL_SLUGS as string[]).includes(value);
}

/**
 * Resolve a document for a locale, falling back to [DEFAULT_LOCALE] when the
 * requested language has no translation yet. Returns the entry and the locale
 * actually used.
 */
export function getLegalDoc(
  locale: Locale,
  slug: LegalSlug,
): { entry: LegalEntry; locale: Locale } {
  const resolved = LEGAL_CONTENT[locale] ? locale : DEFAULT_LOCALE;
  return { entry: LEGAL_CONTENT[resolved]![slug], locale: resolved };
}
