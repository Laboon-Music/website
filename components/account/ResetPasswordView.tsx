"use client";

import { useState } from "react";
import { DoneCard } from "./AccountBits";
import { EmailRequestForm } from "./EmailRequestForm";
import { NewPasswordForm } from "./NewPasswordForm";
import { useCodeFromUrl } from "./useCodeFromUrl";
import { BackLink, Card, FormError, Lede, PageTitle } from "@/components/ui";

const TITLE_CLASS = "mt-5 text-[clamp(2rem,3.6vw,3rem)]";

/**
 * /reset-password. The link of the "password reset" e-mail carries a one-time
 * `?code=`: with it the visitor chooses a new password; without it (or with an
 * expired one) they ask for a new link. See docs/features/account-links.md.
 */
export function ResetPasswordView() {
  const code = useCodeFromUrl();
  const [done, setDone] = useState(false);
  const [invalid, setInvalid] = useState(false);

  if (code === undefined) {
    return (
      <p role="status" className="text-center text-muted">
        Chargement…
      </p>
    );
  }

  if (done) {
    return (
      <DoneCard title="Mot de passe mis à jour">
        C&apos;est tout bon ! Tu peux maintenant te reconnecter à l&apos;app Laboon avec
        ton nouveau mot de passe.
      </DoneCard>
    );
  }

  if (code && !invalid) {
    return (
      <>
        <BackLink />
        <PageTitle className={TITLE_CLASS}>Choisis un nouveau mot de passe</PageTitle>
        <Lede className="max-w-[44ch]">
          Il remplacera l&apos;ancien sur l&apos;app Laboon.
        </Lede>
        <Card className="mt-8 p-6 sm:p-11">
          <NewPasswordForm
            endpoint="/auth/password/reset/confirm"
            field="new_password"
            code={code}
            submitLabel="Mettre à jour"
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
        {invalid ? "Lien invalide ou expiré" : "Mot de passe oublié ?"}
      </PageTitle>
      <Lede className="max-w-[44ch]">
        Pas de panique. Indique l&apos;adresse e-mail de ton compte Laboon : on
        t&apos;envoie un lien (valable 30 minutes) pour choisir un nouveau mot de passe.
      </Lede>
      <Card className="mt-8 p-6 sm:p-11">
        {invalid && (
          <div className="mb-5">
            <FormError>
              Ce lien n&apos;est plus valide (il a peut-être déjà servi ou expiré).
            </FormError>
          </div>
        )}
        <EmailRequestForm
          endpoint="/auth/password/reset"
          submitLabel="Recevoir le lien"
          sentTitle="Vérifie ta boîte mail"
          sentText="Si un compte existe avec cette adresse, on vient d'y envoyer un lien. Pense à regarder dans tes spams."
        />
      </Card>
    </>
  );
}
