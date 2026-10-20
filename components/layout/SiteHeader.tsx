import Link from "next/link";
import type { MouseEventHandler } from "react";
import { ButtonLink } from "@/components/ui";
import { Wordmark } from "./Wordmark";

/**
 * Floating white pill: wordmark on the left, "M'inscrire" on the right.
 * Same on every page; the home page passes its own targets and handlers.
 */
export function SiteHeader({
  logoHref = "/",
  logoLabel = "Laboon, retour à l'accueil",
  ctaHref = "/#rejoindre",
  ctaLabel = "M’inscrire",
  onCtaClick,
}: {
  logoHref?: string;
  logoLabel?: string;
  ctaHref?: string;
  ctaLabel?: string;
  onCtaClick?: MouseEventHandler<HTMLAnchorElement>;
}) {
  return (
    <header className="bar fixed top-[clamp(12px,2.2vw,28px)] left-1/2 z-60 flex h-(--pill-h) w-[min(715px,calc(100%-32px))] -translate-x-1/2 items-center justify-between gap-4 rounded-full bg-white py-1.5 pr-1.5 pl-3.5 shadow-[0_1px_2px_rgb(15_18_80/0.08),0_10px_30px_-12px_rgb(15_18_80/0.28)]">
      <Link
        href={logoHref}
        aria-label={logoLabel}
        className="flex min-h-11 flex-none items-center rounded-full px-1 outline-brand"
      >
        <Wordmark className="w-[clamp(96px,9vw,124px)]" />
      </Link>
      <ButtonLink variant="text" href={ctaHref} onClick={onCtaClick}>
        {ctaLabel}
      </ButtonLink>
    </header>
  );
}
