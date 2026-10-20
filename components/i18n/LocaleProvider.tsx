"use client";

import { createContext, useContext, type ReactNode } from "react";
import { UI as EN_UI } from "@/content/en/ui";
import { UI as FR_UI } from "@/content/fr/ui";
import type { Locale } from "@/lib/i18n";

// Gives client components the language of the page and its interface texts.
// Server components receive the locale from the route (`params.lang`) and read
// `getContent(locale)` instead. See docs/features/i18n.md.

const UI_BY_LOCALE = { fr: FR_UI, en: EN_UI } satisfies Record<Locale, typeof FR_UI>;

const LocaleContext = createContext<Locale>("fr");

export function LocaleProvider({
  locale,
  children,
}: {
  locale: Locale;
  children: ReactNode;
}) {
  return <LocaleContext.Provider value={locale}>{children}</LocaleContext.Provider>;
}

export function useLocale(): Locale {
  return useContext(LocaleContext);
}

/** Interface texts in the language of the page. */
export function useUi(): typeof FR_UI {
  return UI_BY_LOCALE[useLocale()];
}
