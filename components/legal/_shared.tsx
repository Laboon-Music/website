import type { ReactNode } from "react";
import { PageTitle } from "@/components/ui";
import type { Locale } from "./registry";

/**
 * Shared building blocks for legal document bodies. Each document component
 * (Cgu, Cgv, …) renders one <article> composed of these primitives so the same
 * content can be served both as a public page (with site chrome) and as a bare
 * "embed" page loaded by the mobile app WebView.
 *
 * Layout: title and intro sit on the page; the numbered sections sit together
 * in one blue panel (`DocBody`), separated by hairlines.
 */

const ISO_DATE = /^(\d{4})-(\d{2})-(\d{2})$/;

/**
 * An ISO date (`YYYY-MM-DD`, as the API sends it) written for the language
 * ("22 octobre 2026" / "October 22, 2026"). Any other string is already
 * written for display (the TSX documents) and is returned unchanged.
 */
export function formatEffectiveDate(date: string, locale: Locale): string {
  const match = ISO_DATE.exec(date);
  if (!match) return date;
  const [, year, month, day] = match;
  // UTC on both sides: the calendar day never shifts with the server's time zone.
  return new Date(
    Date.UTC(Number(year), Number(month) - 1, Number(day)),
  ).toLocaleDateString(locale === "en" ? "en-US" : "fr-FR", {
    timeZone: "UTC",
    year: "numeric",
    month: "long",
    day: "numeric",
  });
}

export function DocHeader({
  title,
  version,
  effectiveDate,
  locale = "fr",
}: {
  title: string;
  version: string;
  /** ISO date (`YYYY-MM-DD`) or an already formatted text. */
  effectiveDate: string;
  locale?: Locale;
}) {
  const date = formatEffectiveDate(effectiveDate, locale);
  return (
    <header>
      <PageTitle>{title}</PageTitle>
      <p className="mt-3.5 text-sm font-semibold text-[#b6bbfe]">
        {locale === "en"
          ? `Version ${version} — effective from ${date}`
          : `Version ${version} — en vigueur à compter du ${date}`}
      </p>
    </header>
  );
}

/** The blue panel holding all the sections of a document. */
export function DocBody({ children }: { children: ReactNode }) {
  return (
    <div className="space-y-0 bg-surface p-7 text-[17px] leading-[1.65] text-white shadow-[0_2px_4px_rgb(8_10_66/0.2),0_30px_70px_-30px_rgb(6_8_50/0.6)] sm:p-14 [&>section+section]:mt-10 [&>section+section]:border-t [&>section+section]:border-white/22 [&>section+section]:pt-10">
      {children}
    </div>
  );
}

/** Editorial reminder for the "[à compléter]" placeholders still in the V1 text. */
export function TodoNote({ children }: { children: ReactNode }) {
  return <p className="border-2 border-white/40 p-4 text-sm">⚠️ {children}</p>;
}

export function Section({
  title,
  id,
  children,
}: {
  title: string;
  /** Anchor of the section, for a link straight to it (for example `#suppression-compte`). */
  id?: string;
  children: ReactNode;
}) {
  return (
    <section id={id} className="scroll-mt-24 space-y-3.5">
      <h2 className="font-title text-[clamp(1.3rem,2vw,1.6rem)] leading-tight font-extrabold tracking-[-0.04em]">
        {title}
      </h2>
      {children}
    </section>
  );
}

export function Subheading({ children }: { children: ReactNode }) {
  return <h3 className="pt-3 font-title text-[1.05rem] font-semibold">{children}</h3>;
}

export function List({ children, ordered }: { children: ReactNode; ordered?: boolean }) {
  if (ordered) {
    return (
      <ol className="list-decimal space-y-2 pl-6 marker:font-semibold">{children}</ol>
    );
  }
  return (
    <ul className="space-y-2 [&>li]:relative [&>li]:pl-[22px] [&>li]:before:absolute [&>li]:before:top-[0.68em] [&>li]:before:left-0.5 [&>li]:before:size-2 [&>li]:before:rounded-full [&>li]:before:bg-white [&>li]:before:content-['']">
      {children}
    </ul>
  );
}
