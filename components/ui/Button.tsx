import Link from "next/link";
import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

// Design system — buttons. `Button` for actions, `ButtonLink` for navigation
// styled as a button. The look (halo on hover, asymmetric outline) lives in
// `.btn*` in app/ui.css. See docs/design-system.md.
//
//   primary  blue fill + white outline: on the blue panels (default)
//   outline  white fill + blue outline: secondary action on a panel
//   text     white fill, no outline: inside the white header pill

export type ButtonVariant = "primary" | "outline" | "text";

type StyleProps = { variant?: ButtonVariant; fullWidth?: boolean };

const VARIANTS: Record<ButtonVariant, string> = {
  primary: "btn--reverted",
  outline: "btn--stroke",
  text: "btn--text",
};

export function buttonClass({ variant = "primary", fullWidth }: StyleProps = {}) {
  return cx("btn", VARIANTS[variant], fullWidth && "w-full");
}

export function Button({
  variant,
  fullWidth,
  className,
  type = "button",
  ...props
}: ComponentProps<"button"> & StyleProps) {
  return (
    <button
      type={type}
      className={cx(buttonClass({ variant, fullWidth }), className)}
      {...props}
    />
  );
}

export function ButtonLink({
  variant,
  fullWidth,
  className,
  ...props
}: ComponentProps<typeof Link> & StyleProps) {
  return (
    <Link className={cx(buttonClass({ variant, fullWidth }), className)} {...props} />
  );
}
