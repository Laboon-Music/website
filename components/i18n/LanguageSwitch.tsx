"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useLocale, useUi } from "./LocaleProvider";
import { fmt, LOCALES, localePath, splitLocale, type Locale } from "@/lib/i18n";

/**
 * Footer link to the same page in the other language. Never automatic: the
 * visitor chooses (see docs/features/i18n.md). Each language is written in its
 * own language, with the right `lang` / `hrefLang`.
 */
export function LanguageSwitch() {
  const locale = useLocale();
  const ui = useUi();
  const { path } = splitLocale(usePathname() ?? "/");
  const others = LOCALES.filter((l): l is Locale => l !== locale);

  return (
    <nav aria-label={ui.language.label}>
      <ul className="flex items-center gap-4">
        {others.map((other) => (
          <li key={other}>
            <Link
              href={localePath(other, path)}
              hrefLang={other}
              lang={other}
              prefetch={false}
              aria-label={fmt(ui.language.switch, { language: ui.language[other] })}
              className="inline-flex min-h-11 items-center text-[13px] font-semibold underline underline-offset-[0.2em] hover:no-underline"
            >
              {ui.language[other]}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
