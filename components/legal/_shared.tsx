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

export function DocHeader({
  title,
  version,
  effectiveDate,
  locale = "fr",
}: {
  title: string;
  version: string;
  effectiveDate: string;
  locale?: Locale;
}) {
  return (
    <header>
      <PageTitle>{title}</PageTitle>
      <p className="mt-3.5 text-sm font-semibold text-[#b6bbfe]">
        {locale === "en"
          ? `Version ${version} — effective from ${effectiveDate}`
          : `Version ${version} — en vigueur à compter du ${effectiveDate}`}
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

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="space-y-3.5">
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

export function List({ children }: { children: ReactNode }) {
  return (
    <ul className="space-y-2 [&>li]:relative [&>li]:pl-[22px] [&>li]:before:absolute [&>li]:before:top-[0.68em] [&>li]:before:left-0.5 [&>li]:before:size-2 [&>li]:before:rounded-full [&>li]:before:bg-white [&>li]:before:content-['']">
      {children}
    </ul>
  );
}
