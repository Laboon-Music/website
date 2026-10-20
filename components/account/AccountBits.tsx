import type { ReactNode } from "react";
import { ButtonLink, Card } from "@/components/ui";

/** White disc with a green tick (decorative: the heading carries the meaning). */
export function CheckBadge() {
  return (
    <div
      aria-hidden="true"
      className="mx-auto grid size-[84px] place-items-center rounded-full bg-white shadow-[0_0_0_10px_rgb(255_255_255/0.14),0_0_0_22px_rgb(255_255_255/0.07)]"
    >
      <svg viewBox="0 0 38 38" className="size-[38px]">
        <path
          d="M9 20l7 7 13-15"
          fill="none"
          stroke="#0a4d2a"
          strokeWidth="4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}

/** Confirmation panel: tick, <h1>, text, optional extra content, button home. */
export function DoneCard({
  title,
  children,
  ctaLabel = "Revenir sur Laboon",
}: {
  title: string;
  children: ReactNode;
  ctaLabel?: string;
}) {
  return (
    <Card tone="success" className="p-6 sm:p-11">
      <CheckBadge />
      <h1 className="mt-8 font-title text-[clamp(1.8rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.04em]">
        {title}
      </h1>
      <p className="mx-auto mt-4 max-w-[40ch] text-muted">{children}</p>
      <ButtonLink href="/" fullWidth className="mt-8 px-9 sm:w-auto">
        {ctaLabel}
      </ButtonLink>
    </Card>
  );
}
