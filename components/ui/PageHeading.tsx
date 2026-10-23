import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

// Design system — heading block of an inner page: <h1> and
// the lighter line under it. One <h1> per page.

/** The page's <h1>: Sora ExtraBold, tight tracking. */
export function PageTitle({ className, ...props }: ComponentProps<"h1">) {
  return (
    <h1
      className={cx(
        "font-title text-[clamp(2rem,4.2vw,3.5rem)] leading-[1.08] font-extrabold tracking-[-0.05em] text-balance",
        className,
      )}
      {...props}
    />
  );
}

/** Sentence under the title (mist blue, 9:1 on the page background). */
export function Lede({ className, ...props }: ComponentProps<"p">) {
  return (
    <p
      className={cx(
        "mt-4 text-[clamp(1.05rem,1.6vw,1.3rem)] leading-normal text-mist",
        className,
      )}
      {...props}
    />
  );
}
