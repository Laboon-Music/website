import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

// Design system — link inside running text. Always underlined and bold, in the
// colour of the surrounding text, so it is not distinguished by colour alone
// (WCAG "link in text block") and stays readable on every panel.
// Internal paths use next/link; mailto:, tel: and external URLs a plain <a>.

export function TextLink({
  href,
  className,
  ...props
}: Omit<ComponentProps<"a">, "href"> & { href: string }) {
  const classes = cx(
    "font-semibold underline underline-offset-[0.2em] hover:no-underline",
    className,
  );
  if (href.startsWith("/")) {
    return <Link href={href} className={classes} {...props} />;
  }
  const external = /^https?:/.test(href);
  return (
    <a
      href={href}
      className={classes}
      {...(external && { target: "_blank", rel: "noopener noreferrer" })}
      {...props}
    />
  );
}
