"use client";

import { useUi } from "@/components/i18n/LocaleProvider";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";

// Design system — "← Back to home" link above the title of an inner page.
export function BackLink({
  href = "/",
  children,
}: {
  href?: string;
  children?: React.ReactNode;
}) {
  const ui = useUi();
  return (
    <LocalizedLink
      href={href}
      className="inline-flex min-h-11 items-center gap-2 text-[15px] font-semibold text-[#c9ccff] transition-colors hover:text-white focus-visible:text-white"
    >
      <span aria-hidden="true">←</span> {children ?? ui.backHome}
    </LocalizedLink>
  );
}
