import type { ComponentProps, ReactNode } from "react";
import { cx } from "@/lib/cx";

// Design system — form controls, drawn for the blue panels: white pill fields
// with navy text. An invalid field keeps the exact shape of a normal one: only its
// border turns the error colour (no glow, which changed the silhouette and looked
// broken next to the joined e-mail + button). See docs/design-system.md.

const CONTROL =
  "w-full border-2 border-white bg-white px-5 text-base font-medium text-ink placeholder:text-[#5a60b0] aria-invalid:border-error-accent";

/**
 * Pill input. `joined` glues it to a button on its right (e-mail + submit):
 * square right edge, tucked under the button.
 */
export function Input({
  joined,
  className,
  ...props
}: ComponentProps<"input"> & { joined?: boolean }) {
  return (
    <input
      data-joined={joined || undefined}
      className={cx(
        CONTROL,
        "h-[52px]",
        joined ? "-mr-7 rounded-l-full border-r-0 pr-11" : "rounded-full",
        className,
      )}
      {...props}
    />
  );
}

export function Textarea({ className, ...props }: ComponentProps<"textarea">) {
  return (
    <textarea
      className={cx(
        CONTROL,
        "min-h-44 resize-y rounded-3xl py-4 leading-normal",
        className,
      )}
      {...props}
    />
  );
}

export function Select({ className, children, ...props }: ComponentProps<"select">) {
  return (
    <div className="relative">
      <select
        className={cx(
          CONTROL,
          "h-[52px] cursor-pointer appearance-none rounded-full pr-12",
          className,
        )}
        {...props}
      >
        {children}
      </select>
      <svg
        viewBox="0 0 14 9"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="pointer-events-none absolute top-1/2 right-5 h-[9px] w-3.5 -translate-y-1/2 text-ink"
        aria-hidden="true"
      >
        <path d="M1 1.5l6 6 6-6" />
      </svg>
    </div>
  );
}

/** Visible label wrapping its control (no id/htmlFor wiring needed). */
export function Field({
  label,
  error,
  errorId,
  children,
}: {
  label: string;
  /** Message shown right under this field (not inside the label, so it is not part of its name). */
  error?: ReactNode;
  errorId?: string;
  children: ReactNode;
}) {
  return (
    <div className="grid content-start gap-2">
      <label className="flex flex-col gap-2 text-[15px] font-semibold">
        <span className="pl-1">{label}</span>
        {children}
      </label>
      <FormError id={errorId}>{error}</FormError>
    </div>
  );
}

export function Checkbox({
  label,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { label: ReactNode }) {
  return (
    <label className="flex min-h-8 cursor-pointer items-center gap-2.5 text-[15px] font-medium">
      <input type="checkbox" className={cx("check-input", className)} {...props} />
      {label}
    </label>
  );
}

/** Error line under a form (peach pill, "!" icon); announced by screen readers. */
export function FormError({ children, id }: { children: ReactNode; id?: string }) {
  if (!children) return null;
  return (
    <p
      id={id}
      role="alert"
      className="flex w-fit max-w-full items-start gap-2 rounded-[18px] bg-error-bg py-1.5 pr-3.5 pl-2 text-left text-sm leading-snug font-semibold text-error"
    >
      <span
        aria-hidden="true"
        className="mt-px grid size-[18px] flex-none place-items-center rounded-full bg-error-accent text-xs leading-none font-extrabold text-white"
      >
        !
      </span>
      {children}
    </p>
  );
}

/**
 * Anti-bot honeypot: off-screen and skipped by keyboard / screen readers, so
 * only bots fill it in. See docs/features/antibot.md.
 */
export function Honeypot({
  value,
  onChange,
}: {
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <input
      type="text"
      name="website"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      tabIndex={-1}
      autoComplete="off"
      aria-hidden="true"
      className="absolute -left-[9999px] h-px w-px opacity-0"
    />
  );
}
