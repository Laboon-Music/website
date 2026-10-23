import type { ComponentProps } from "react";
import { LocalizedLink } from "@/components/i18n/LocalizedLink";
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
  loading,
  loadingLabel,
  children,
  disabled,
  ...props
}: ComponentProps<"button"> &
  StyleProps & {
    /** Shows a spinner in place of the label (the button keeps its size) and disables it. */
    loading?: boolean;
    /** Announced to screen readers while loading, e.g. "Envoi…". */
    loadingLabel?: string;
  }) {
  return (
    <button
      type={type}
      disabled={disabled || loading}
      aria-busy={loading || undefined}
      className={cx(
        buttonClass({ variant, fullWidth }),
        loading && "btn--loading",
        className,
      )}
      {...props}
    >
      {loading ? (
        <>
          {/* The label stays (hidden) so the button keeps its width. */}
          <span className="btn__label" aria-hidden="true">
            {children}
          </span>
          <span className="btn__spinner" aria-hidden="true" />
          <span className="sr-only" role="status">
            {loadingLabel}
          </span>
        </>
      ) : (
        children
      )}
    </button>
  );
}

export function ButtonLink({
  variant,
  fullWidth,
  className,
  ...props
}: ComponentProps<typeof LocalizedLink> & StyleProps) {
  return (
    <LocalizedLink
      className={cx(buttonClass({ variant, fullWidth }), className)}
      {...props}
    />
  );
}
