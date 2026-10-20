import type { ComponentProps } from "react";
import { cx } from "@/lib/cx";

// Design system — the solid Laboon-blue panel (square corners, soft shadow)
// that holds a form, a message or a document. `success` centres a confirmation.

export function Card({
  tone = "default",
  className,
  ...props
}: ComponentProps<"div"> & { tone?: "default" | "success" }) {
  return (
    <div
      className={cx(
        "bg-surface p-6 text-text shadow-[0_2px_4px_rgb(8_10_66/0.2),0_30px_70px_-30px_rgb(6_8_50/0.6)] sm:p-10",
        tone === "success" && "text-center",
        className,
      )}
      {...props}
    />
  );
}
