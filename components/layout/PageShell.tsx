import type { ReactNode } from "react";
import { SiteFooter } from "./SiteFooter";
import { SiteHeader } from "./SiteHeader";

export const MAIN_CONTENT_ID = "contenu";

/**
 * Standard page frame: skip link + wave-disc decor + floating header +
 * <main> + footer. Every public page should use it so the chrome stays
 * consistent. `main` provides the side gutter and the vertical rhythm; the page
 * only sets its own width (`mx-auto w-full max-w-…`).
 */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <div className="relative flex min-h-svh flex-col overflow-x-clip">
      {/* Keyboard / screen reader users jump straight past the header. */}
      <a
        href={`#${MAIN_CONTENT_ID}`}
        className="sr-only z-70 rounded-full bg-white px-5 py-2.5 font-semibold text-ink focus:not-sr-only focus:fixed focus:top-4 focus:left-4"
      >
        Aller au contenu
      </a>
      <div aria-hidden="true" className="bg-disc" />
      <SiteHeader />
      <main
        id={MAIN_CONTENT_ID}
        tabIndex={-1}
        className="relative z-10 flex-1 px-(--gutter) pt-[calc(var(--pill-h)+clamp(56px,9vh,96px))] pb-[clamp(64px,10vw,120px)] outline-none"
      >
        {children}
      </main>
      <SiteFooter />
    </div>
  );
}
