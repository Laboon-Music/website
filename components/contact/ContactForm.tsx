"use client";

import { useEffect, useRef, useState } from "react";
import Turnstile from "@/components/antibot/Turnstile";
import {
  Button,
  ButtonLink,
  Card,
  Field,
  FormError,
  Honeypot,
  Input,
  Select,
  Textarea,
  TextLink,
} from "@/components/ui";
import { useUi } from "@/components/i18n/LocaleProvider";
import { useProtectedForm } from "@/hooks/useProtectedForm";
import { trackEvent } from "@/lib/analytics";
import { CONTACT_LIMITS, CONTACT_SUBJECTS, DEFAULT_CONTACT_SUBJECT } from "@/lib/contact";
import { fmt } from "@/lib/i18n";
import { isValidEmail } from "@/lib/validation";

// Contact form (/contact). See docs/features/contact-form.md.
export default function ContactForm() {
  const ui = useUi();
  const t = ui.contact;
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>(DEFAULT_CONTACT_SUBJECT);
  const [message, setMessage] = useState("");
  const form = useProtectedForm("/api/contact");
  const nameRef = useRef<HTMLInputElement>(null);
  const emailRef = useRef<HTMLInputElement>(null);
  const messageRef = useRef<HTMLTextAreaElement>(null);
  const [invalid, setInvalid] = useState<"name" | "email" | "message" | null>(null);

  // Checked in the browser first: an empty or wrong field is told at once, without
  // the round trip (and the loading state flashing) of a server answer.
  function firstProblem() {
    if (!name.trim()) return { field: "name", message: ui.errors.nameRequired } as const;
    if (!isValidEmail(email.trim())) {
      return { field: "email", message: ui.errors.invalidEmail } as const;
    }
    if (message.trim().length < CONTACT_LIMITS.messageMin) {
      const short = fmt(ui.errors.messageShort, { min: CONTACT_LIMITS.messageMin });
      return { field: "message", message: short } as const;
    }
    return null;
  }

  // The confirmation is much shorter than the form: without this the page stays scrolled to
  // where the send button was and lands on the footer.
  useEffect(() => {
    if (form.status === "success") window.scrollTo({ top: 0, behavior: "instant" });
  }, [form.status]);

  // A browser-side problem is shown under its own field; anything else (server) at the bottom.
  const fieldError = (field: "name" | "email" | "message") =>
    form.status === "error" && invalid === field ? form.error : null;
  const generalError = form.status === "error" && !invalid ? form.error : null;

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const problem = firstProblem();
    setInvalid(problem?.field ?? null);
    if (problem) {
      form.fail(problem.message);
      ({ name: nameRef, email: emailRef, message: messageRef })[
        problem.field
      ].current?.focus();
      return;
    }
    if (await form.submit({ name, email, subject, message })) {
      trackEvent("contact_sent", { subject });
    }
  }

  if (form.status === "success") {
    return (
      <Card tone="success" role="status" className="mx-auto">
        <p className="font-title text-2xl font-extrabold tracking-[-0.04em]">
          {t.sentTitle}
        </p>
        <p className="mt-3 break-words text-muted">{fmt(t.sentText, { email })}</p>
        <ButtonLink href="/" className="mt-8 px-10">
          {t.backHome}
        </ButtonLink>
      </Card>
    );
  }

  // noValidate: native browser bubbles use the browser language (often English);
  // the API returns our French messages instead.
  return (
    <Card className="p-7 sm:p-14">
      <form
        noValidate
        onSubmit={handleSubmit}
        {...form.formProps}
        aria-describedby={generalError ? "contact-error" : undefined}
        className="grid gap-5"
      >
        <Honeypot {...form.honeypot} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.name} error={fieldError("name")} errorId="contact-error-name">
            <Input
              ref={nameRef}
              aria-invalid={invalid === "name" || undefined}
              aria-describedby={invalid === "name" ? "contact-error-name" : undefined}
              type="text"
              required
              maxLength={CONTACT_LIMITS.nameMax}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              autoComplete="name"
            />
          </Field>
          <Field
            label={t.email}
            error={fieldError("email")}
            errorId="contact-error-email"
          >
            <Input
              ref={emailRef}
              aria-invalid={invalid === "email" || undefined}
              aria-describedby={invalid === "email" ? "contact-error-email" : undefined}
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder={t.emailPlaceholder}
              autoComplete="email"
            />
          </Field>
        </div>

        <Field label={t.subject}>
          <Select value={subject} onChange={(e) => setSubject(e.target.value)}>
            {CONTACT_SUBJECTS.map((s) => (
              <option key={s.value} value={s.value}>
                {t.subjects[s.value]}
              </option>
            ))}
          </Select>
        </Field>

        <Field
          label={t.message}
          error={fieldError("message")}
          errorId="contact-error-message"
        >
          <Textarea
            ref={messageRef}
            aria-invalid={invalid === "message" || undefined}
            aria-describedby={invalid === "message" ? "contact-error-message" : undefined}
            required
            minLength={CONTACT_LIMITS.messageMin}
            maxLength={CONTACT_LIMITS.messageMax}
            rows={6}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            placeholder={t.messagePlaceholder}
          />
        </Field>

        <Turnstile {...form.turnstile} />

        <div className="mt-2 grid justify-items-center gap-4 text-center">
          <Button
            type="submit"
            loading={form.status === "loading"}
            loadingLabel={t.sending}
            className="px-10"
          >
            {t.send}
          </Button>
          <FormError id="contact-error">{generalError}</FormError>
          <p className="max-w-[46ch] text-sm leading-normal">
            {t.note} <TextLink href="/confidentialite">{t.privacy}</TextLink>
          </p>
        </div>
      </form>
    </Card>
  );
}
