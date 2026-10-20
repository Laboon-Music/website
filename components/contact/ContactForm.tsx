"use client";

import { useState } from "react";
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

// Contact form (/contact). See docs/features/contact-form.md.
export default function ContactForm() {
  const { contact: t } = useUi();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [subject, setSubject] = useState<string>(DEFAULT_CONTACT_SUBJECT);
  const [message, setMessage] = useState("");
  const form = useProtectedForm("/api/contact");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
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
        aria-describedby={form.status === "error" ? "contact-error" : undefined}
        className="grid gap-5"
      >
        <Honeypot {...form.honeypot} />

        <div className="grid gap-5 sm:grid-cols-2">
          <Field label={t.name}>
            <Input
              type="text"
              required
              maxLength={CONTACT_LIMITS.nameMax}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.namePlaceholder}
              autoComplete="name"
            />
          </Field>
          <Field label={t.email}>
            <Input
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

        <Field label={t.message}>
          <Textarea
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
          <Button type="submit" disabled={form.status === "loading"} className="px-10">
            {form.status === "loading" ? t.sending : t.send}
          </Button>
          <FormError id="contact-error">
            {form.status === "error" && form.error}
          </FormError>
          <p className="max-w-[46ch] text-sm leading-normal">
            {t.note} <TextLink href="/confidentialite">{t.privacy}</TextLink>
          </p>
        </div>
      </form>
    </Card>
  );
}
