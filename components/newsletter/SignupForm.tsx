"use client";

import { useId, useState } from "react";
import Turnstile from "@/components/antibot/Turnstile";
import { Button, Checkbox, FormError, Honeypot, Input, TextLink } from "@/components/ui";
import { HOME_CONTENT } from "@/content/home";
import { useProtectedForm } from "@/hooks/useProtectedForm";
import { trackEvent } from "@/lib/analytics";
import { NO_LIST_ERROR } from "@/lib/newsletter";

const T = HOME_CONTENT.signup;

// Newsletter signup (launch and/or beta lists), drawn for the blue areas of the
// home page (white texts). `id` is used by the home page to focus the e-mail
// field from the header button. See docs/features/newsletter-signup.md.
export default function SignupForm({ id }: { id?: string }) {
  const [email, setEmail] = useState("");
  const [wantsLaunch, setWantsLaunch] = useState(true);
  const [wantsBeta, setWantsBeta] = useState(false);
  const form = useProtectedForm("/api/subscribe");
  const uid = useId();
  const emailId = `${uid}-email`;
  const errorId = `${uid}-error`;
  const hasError = form.status === "error";

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!wantsLaunch && !wantsBeta) return form.fail(NO_LIST_ERROR);
    if (await form.submit({ email, wantsLaunch, wantsBeta })) {
      trackEvent("signup_submitted", { launch: wantsLaunch, beta: wantsBeta });
      setEmail("");
    }
  }

  if (form.status === "success") {
    return (
      <div id={id} role="status" className="max-w-[26rem] text-center">
        <p className="font-title text-xl font-extrabold tracking-[-0.03em]">
          {T.successTitle}
        </p>
        <p className="mt-3 leading-normal">{T.successText}</p>
      </div>
    );
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
      <div className="grid w-full justify-items-start gap-2">
        <label htmlFor={emailId} className="pl-[22px] text-[15px] font-semibold">
          {T.emailLabel}
        </label>
        <div className="flex w-full items-stretch sm:w-auto">
          <Input
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
          <Button type="submit" disabled={form.status === "loading"}>
            {form.status === "loading" ? T.submitting : T.submit}
          </Button>
        </div>
      </div>

      <div className="flex flex-col items-start gap-1 self-stretch pl-[22px] text-left">
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
