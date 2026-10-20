"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { useLocale } from "./LocaleProvider";
import { localePath } from "@/lib/i18n";

/**
 * `next/link` for the site's own pages: a path like `/contact` or `/#faq` goes
 * to the same page in the language of the current page. Anchors (`#top`),
 * `mailto:` and absolute URLs are left alone.
 */
export function LocalizedLink({ href, ...props }: ComponentProps<typeof Link>) {
  const locale = useLocale();
  const target =
    typeof href === "string" && href.startsWith("/") ? localePath(locale, href) : href;
  return <Link href={target} {...props} />;
}
