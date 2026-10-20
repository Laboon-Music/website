"use client";

import { useState } from "react";
import { DoneCard } from "./AccountBits";
import { EmailRequestForm } from "./EmailRequestForm";
import { NewPasswordForm } from "./NewPasswordForm";
import { useCodeFromUrl } from "./useCodeFromUrl";
import { useUi } from "@/components/i18n/LocaleProvider";
import { BackLink, Card, FormError, Lede, PageTitle } from "@/components/ui";

const TITLE_CLASS = "mt-5 text-[clamp(2rem,3.6vw,3rem)]";
/**
 * /reset-password. The link of the "password reset" e-mail carries a one-time
 * `?code=`: with it the visitor chooses a new password; without it (or with an
 * expired one) they ask for a new link. See docs/features/account-links.md.
 */
export function ResetPasswordView() {
  const ui = useUi();
  const t = ui.account.reset;
  const code = useCodeFromUrl();
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);

  if (code === undefined) {
    return (
      <p role="status" className="text-center text-muted">
        {ui.loading}
      </p>
    );
  }

  if (done) {
    return (
      <DoneCard title={t.doneTitle} ctaLabel={t.doneCta}>
        {t.doneText}
      </DoneCard>
    );
  }

  if (code && !invalid) {
    return (
      <>
        <BackLink />
        <PageTitle className={TITLE_CLASS}>{t.newTitle}</PageTitle>
        <Lede className="max-w-[44ch]">
          Il remplacera l&apos;ancien sur l&apos;app Laboon.
        </Lede>
        <Card className="mt-8 p-6 sm:p-11">
          <NewPasswordForm
            endpoint="/auth/password/reset/confirm"
            field="new_password"
            code={code}
            submitLabel={t.newSubmit}
            onDone={() => setDone(true)}
            onInvalidCode={() => setInvalid(true)}
          />
        </Card>
      </>
    );
  }

  return (
    <>
      <BackLink />
      <PageTitle className={TITLE_CLASS}>
        {invalid ? ui.account.invalidLink : t.askTitle}
      </PageTitle>
      <Lede className="max-w-[44ch]">{t.askLede}</Lede>
      <Card className="mt-8 p-6 sm:p-11">
        {invalid && (
          <div className="mb-5">
            <FormError>{ui.account.invalidLinkText}</FormError>
          </div>
        )}
        <EmailRequestForm
          endpoint="/auth/password/reset"
          submitLabel={t.askSubmit}
          sentTitle={t.sentTitle}
          sentText={t.sentText}
        />
      </Card>
    </>
  );
}
