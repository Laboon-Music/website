"use client";

import { useId, useState } from "react";
import { CheckBadge } from "./AccountBits";
import { Button, FormError, Input } from "@/components/ui";
import { useLocale, useUi } from "@/components/i18n/LocaleProvider";
import { apiPost } from "@/lib/api";
import { apiErrorKey } from "@/lib/password";

/**
 * Asks the API to e-mail a link (password reset, new confirmation link). The
 * API always answers the same whether the address has an account or not, so the
 * confirmation shown here never reveals it either.
 */
export function EmailRequestForm({
  endpoint,
  submitLabel,
  sentTitle,
  sentText,
}: {
  endpoint: string;
  submitLabel: string;
  sentTitle: string;
  sentText: string;
}) {
  const locale = useLocale();
  const ui = useUi();
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "sent">("idle");
  const [error, setError] = useState<string | null>(null);
  const uid = useId();
  const emailId = `${uid}-email`;
  const errorId = `${uid}-error`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setStatus("loading");
    const result = await apiPost(endpoint, { email: email.trim() }, locale);
    if (result.ok) return setStatus("sent");
    setStatus("idle");
    setError(ui.errors[apiErrorKey(result.code)]);
  }

  if (status === "sent") {
    return (
      <div role="status" className="grid justify-items-center gap-3 text-center">
        <CheckBadge />
        <h2 className="mt-6 font-title text-[clamp(1.5rem,2.4vw,2rem)] font-extrabold tracking-[-0.04em]">
          {sentTitle}
        </h2>
        <p className="max-w-[40ch] text-muted">{sentText}</p>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor={emailId} className="pl-1 text-[15px] font-semibold">
          {ui.account.emailLabel}
        </label>
        <Input
          id={emailId}
          type="email"
          name="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder={ui.account.emailPlaceholder}
          autoComplete="email"
          aria-invalid={error ? true : undefined}
          aria-describedby={error ? errorId : undefined}
        />
      </div>
      <div className="mt-2 grid justify-items-center gap-4">
        <FormError id={errorId}>{error}</FormError>
        <Button
          type="submit"
          loading={status === "loading"}
          loadingLabel={ui.sending}
          fullWidth
          className="px-9 sm:w-auto"
        >
          {submitLabel}
        </Button>
      </div>
    </form>
  );
}
