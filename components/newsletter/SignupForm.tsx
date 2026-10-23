"use client";

import { useRouter } from "next/navigation";
import { useId, useRef, useState } from "react";
import Turnstile from "@/components/antibot/Turnstile";
import { Button, Checkbox, FormError, Honeypot, Input, TextLink } from "@/components/ui";
import { useLocale, useUi } from "@/components/i18n/LocaleProvider";
import type { HOME_CONTENT } from "@/content/fr/home";
import { useProtectedForm } from "@/hooks/useProtectedForm";
import { trackEvent } from "@/lib/analytics";
import { localePath } from "@/lib/i18n";
import { isValidEmail } from "@/lib/validation";

// Newsletter signup (launch and/or beta lists), drawn for the blue areas of the
// home page (white texts). `id` is used by the home page to focus the e-mail
// field from the header button. See docs/features/newsletter-signup.md.
export default function SignupForm({
  id,
  texts: T,
}: {
  id?: string;
  texts: typeof HOME_CONTENT.signup;
}) {
  const ui = useUi();
  const locale = useLocale();
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [wantsLaunch, setWantsLaunch] = useState(true);
  const [wantsBeta, setWantsBeta] = useState(false);
  const form = useProtectedForm("/api/subscribe");
  const uid = useId();
  const emailId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const hasError = form.status === "error";
  const emailRef = useRef<HTMLInputElement>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    // Told at once, in the browser: no round trip, no loading flash.
    if (!isValidEmail(email.trim())) {
      form.fail(ui.errors.invalidEmail);
      emailRef.current?.focus();
      return;
    }
    if (!wantsLaunch && !wantsBeta) return form.fail(ui.errors.noList);
    if (await form.submit({ email, wantsLaunch, wantsBeta })) {
      trackEvent("signup_submitted", { launch: wantsLaunch, beta: wantsBeta });
      // The confirmation lives on its own page. The form stays (button in loading state)
      // until the navigation completes.
      router.push(localePath(locale, "/inscription-envoyee"));
    }
  }

  // noValidate: native browser bubbles use the browser language (often English);
  // the API returns our French messages instead.
  return (
    <form
      id={id}
      noValidate
      onSubmit={handleSubmit}
      {...form.formProps}
      className="signup grid w-full max-w-[26rem] justify-items-center gap-4"
    >
      <Honeypot {...form.honeypot} />
      {/* From sm the field has a fixed width: the group shrinks to it so the form centres it. */}
      <div className="grid w-full justify-items-start gap-2 sm:w-auto">
        <label htmlFor={emailId} className="pl-[22px] text-[15px] font-semibold">
          {T.emailLabel}
        </label>
        <div className="field-row flex w-full items-stretch sm:w-auto">
          <Input
            ref={emailRef}
            joined
            id={emailId}
            type="email"
            name="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder={T.emailPlaceholder}
            autoComplete="email"
            aria-invalid={hasError || undefined}
            aria-describedby={hasError ? errorId : undefined}
            className="min-w-0 flex-1 pl-[22px] sm:w-[clamp(220px,28vw,300px)] sm:flex-none"
          />
          <Button
            type="submit"
            loading={form.status === "loading" || form.status === "success"}
            loadingLabel={ui.sending}
          >
            {T.submit}
          </Button>
        </div>
      </div>

      {/* Shrinks to the longest label so the form centres the block; the boxes stay aligned. */}
      <div className="flex flex-col items-start gap-1 text-left">
        <Checkbox
          label={T.launch}
          checked={wantsLaunch}
          onChange={(e) => setWantsLaunch(e.target.checked)}
        />
        <Checkbox
          label={T.beta}
          checked={wantsBeta}
          onChange={(e) => setWantsBeta(e.target.checked)}
        />
      </div>

      <Turnstile {...form.turnstile} />

      <FormError id={errorId}>{hasError && form.error}</FormError>

      <p className="max-w-[34ch] text-[13px] leading-snug">
        {T.privacyNote} <TextLink href="/confidentialite">{T.privacy}</TextLink>
      </p>
    </form>
  );
}
