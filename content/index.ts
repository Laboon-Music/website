// Texts of the website, by language. Server code reads them with
// `getContent(locale)`; client components get the interface texts through
// `useUi()` (components/i18n). See docs/features/i18n.md.

import { FAQ_CONTENT as EN_FAQ } from "./en/faq";
import { HOME_CONTENT as EN_HOME } from "./en/home";
import { SITE_CONTENT as EN_SITE } from "./en/site";
import { FAQ_CONTENT as FR_FAQ } from "./fr/faq";
import { HOME_CONTENT as FR_HOME } from "./fr/home";
import { SITE_CONTENT as FR_SITE } from "./fr/site";
import { UI as EN_UI } from "./en/ui";
import { UI as FR_UI } from "./fr/ui";
import type { Locale } from "@/lib/i18n";

const CONTENT = {
  fr: { home: FR_HOME, faq: FR_FAQ, site: FR_SITE, ui: FR_UI },
  en: { home: EN_HOME, faq: EN_FAQ, site: EN_SITE, ui: EN_UI },
} satisfies Record<Locale, unknown>;

export type Content = (typeof CONTENT)["fr"];

export function getContent(locale: Locale): Content {
  return CONTENT[locale];
}
