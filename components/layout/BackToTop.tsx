"use client";

import { useEffect, useState } from "react";
import { useUi } from "@/components/i18n/LocaleProvider";
import { cx } from "@/lib/cx";

/**
 * Round "back to top" button, phones and tablets only (desktop has the keyboard
 * and wide scrollbars). Appears once the visitor has scrolled one screen down.
 * Follows the OS "reduce motion" setting: no smooth scroll then.
 */
export function BackToTop() {
  const ui = useUi();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    let frame = 0;
    const update = () => {
      frame = 0;
      setVisible(window.scrollY > window.innerHeight * 0.8);
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(frame);
    };
  }, []);

  function goTop() {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    window.scrollTo({ top: 0, behavior: reduced ? "auto" : "smooth" });
  }

  return (
    <button
      type="button"
      onClick={goTop}
      aria-label={ui.backToTop}
      // Hidden from keyboard and screen readers while invisible.
      tabIndex={visible ? 0 : -1}
      aria-hidden={visible ? undefined : true}
      className={cx(
        "fixed right-4 bottom-[calc(16px+env(safe-area-inset-bottom))] z-50 grid size-12 place-items-center rounded-full bg-white text-brand shadow-[0_2px_4px_rgb(15_18_80/0.15),0_10px_30px_-10px_rgb(15_18_80/0.45)] transition-[opacity,translate] duration-300 md:hidden",
        visible
          ? "translate-y-0 opacity-100"
          : "pointer-events-none translate-y-3 opacity-0",
      )}
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-6"
        aria-hidden="true"
      >
        <path d="M12 19V5M5 12l7-7 7 7" />
      </svg>
    </button>
  );
}
