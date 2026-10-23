"use client";

import { useId, useState } from "react";
import { Button, FormError, PasswordInput } from "@/components/ui";
import { cx } from "@/lib/cx";
import { useLocale, useUi } from "@/components/i18n/LocaleProvider";
import { apiPost } from "@/lib/api";
import { fmt } from "@/lib/i18n";
import {
  apiErrorKey,
  MIN_PASSWORD_LENGTH,
  PASSWORD_RULES,
  passwordProblem,
} from "@/lib/password";

const LABEL = "pl-1 text-[15px] font-semibold";

/**
 * Two password fields with the live checklist of the rules. Sends the one-time
 * code and the password to the API; `invalid_code` is handed to the page
 * (expired or used link), every other error is shown here.
 */
export function NewPasswordForm({
  endpoint,
  field,
  code,
  submitLabel,
  onDone,
  onInvalidCode,
}: {
  /** API path: `/auth/password/reset/confirm` or `/auth/confirm`. */
  endpoint: string;
  /** Name of the password field in the API body. */
  field: "new_password" | "password";
  code: string;
  submitLabel: string;
  onDone: () => void;
  onInvalidCode: () => void;
}) {
  const locale = useLocale();
  const ui = useUi();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const uid = useId();
  const passwordId = `${uid}-password`;
  const confirmId = `${uid}-confirm`;
  const rulesId = `${uid}-rules`;

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problem = passwordProblem(password, confirm);
    setError(problem ? ui.password[problem] : null);
    if (problem) return;

    setSubmitting(true);
    const result = await apiPost(endpoint, { code, [field]: password }, locale);
    setSubmitting(false);
    if (result.ok) return onDone();
    if (result.code === "invalid_code") return onInvalidCode();
    setError(ui.errors[apiErrorKey(result.code)]);
  }

  return (
    <form onSubmit={onSubmit} noValidate className="grid gap-5">
      <div className="grid gap-2">
        <label htmlFor={passwordId} className={LABEL}>
          {ui.password.newLabel}
        </label>
        <PasswordInput
          id={passwordId}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="new-password"
          required
          aria-describedby={rulesId}
        />
        <ul id={rulesId} className="mt-1 grid gap-1.5 pl-1 text-sm text-muted">
          {PASSWORD_RULES.map((rule) => {
            const ok = rule.test(password);
            return (
              <li key={rule.id} className="flex items-center gap-2">
                <span
                  aria-hidden="true"
                  className={cx(
                    "size-4 flex-none rounded-full border-2",
                    ok ? "border-success bg-success" : "border-[#c9ccff]",
                  )}
                />
                {fmt(ui.password.rules[rule.id], { min: MIN_PASSWORD_LENGTH })}
                <span className="sr-only">{ok ? ui.password.ruleMet : ""}</span>
              </li>
            );
          })}
        </ul>
      </div>
      <div className="grid gap-2">
        <label htmlFor={confirmId} className={LABEL}>
          {ui.password.confirmLabel}
        </label>
        <PasswordInput
          id={confirmId}
          value={confirm}
          onChange={(e) => setConfirm(e.target.value)}
          autoComplete="new-password"
          required
        />
      </div>
      <div className="mt-2 grid justify-items-center gap-4">
        <FormError>{error}</FormError>
        <Button
          type="submit"
          loading={submitting}
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
