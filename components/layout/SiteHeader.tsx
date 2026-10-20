"use client";

import type { MouseEventHandler } from "react";
import { useUi } from "@/components/i18n/LocaleProvider";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
import { ButtonLink } from "@/components/ui";
import { Wordmark } from "./Wordmark";

/**
 * Floating white pill: wordmark on the left, "Sign up" on the right.
 * Same on every page; the home page passes its own targets, labels and handlers.
 */
export function SiteHeader({
  logoHref = "/",
  logoLabel,
  ctaHref = "/#rejoindre",
  ctaLabel,
  onCtaClick,
}: {
  logoHref?: string;
  logoLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
  onCtaClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  const ui = useUi();
  return (
    <header className="bar fixed top-[clamp(12px,2.2vw,28px)] left-1/2 z-60 flex h-(--pill-h) w-[min(715px,calc(100%-32px))] -translate-x-1/2 items-center justify-between gap-4 rounded-full bg-white py-1.5 pr-1.5 pl-3.5 shadow-[0_1px_2px_rgb(15_18_80/0.08),0_10px_30px_-12px_rgb(15_18_80/0.28)]">
      <LocalizedLink
        href={logoHref}
        aria-label={logoLabel ?? ui.header.logoLabel}
        className="flex min-h-11 flex-none items-center rounded-full px-1 outline-brand"
      >
        <Wordmark priority className="w-[clamp(96px,9vw,124px)]" />
      </LocalizedLink>
      <ButtonLink variant="text" href={ctaHref} onClick={onCtaClick}>
        {ctaLabel ?? ui.header.join}
      </ButtonLink>
    </header>
  );
}
