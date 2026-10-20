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
 * /confirm-email. The link of the sign-up e-mail carries a one-time `?code=`
 * (24 h): the visitor chooses their password, which confirms the address. With
 * no code or an expired one, they can ask for a new link.
 * See docs/features/account-links.md.
 */
export function ConfirmEmailView() {
  const ui = useUi();
  const t = ui.account.confirm;
  const code = useCodeFromUrl();
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);

  if (code === undefined) {
    // Short loading state (the code is read after hydration). The page always has its <h1>.
    return (
      <>
        <h1 className="sr-only">{t.askTitle}</h1>
        <p role="status" className="text-center text-muted">
          {ui.loading}
        </p>
      </>
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
        <Lede className="max-w-[44ch]">{t.newLede}</Lede>
        <Card className="mt-8 p-6 sm:p-11">
          <NewPasswordForm
            endpoint="/auth/confirm"
            field="password"
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
          endpoint="/auth/confirm/resend"
          submitLabel={t.askSubmit}
          sentTitle={t.sentTitle}
          sentText={t.sentText}
        />
      </Card>
    </>
  );
}
