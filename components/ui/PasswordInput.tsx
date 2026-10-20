"use client";

import { useState, type ComponentProps } from "react";
import { useUi } from "@/components/i18n/LocaleProvider";
import { cx } from "@/lib/cx";
import { Input } from "./form-controls";

/**
 * Password input with a "Show / Hide" (from the dictionary) toggle inside the field. Needs an
 * `id` (the toggle points at it); label it with a `<label htmlFor>`.
 */
export function PasswordInput({
  id,
  className,
  ...props
}: Omit<ComponentProps<"input">, "type"> & { id: string }) {
  const ui = useUi();
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <Input
        id={id}
        type={visible ? "text" : "password"}
        className={cx("pr-[118px]", className)}
        {...props}
      />
      <button
        type="button"
        aria-controls={id}
        onClick={() => setVisible((v) => !v)}
        className="absolute top-1/2 right-1.5 h-10 -translate-y-1/2 rounded-full bg-[#eef0ff] px-3.5 text-sm font-bold text-ink transition-colors hover:bg-[#dde0ff] focus-visible:outline-ink"
      >
        {visible ? ui.password.hide : ui.password.show}
      </button>
    </div>
  );
}
