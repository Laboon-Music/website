"use client";

import { useState } from "react";
import { DoneCard } from "./AccountBits";
import { EmailRequestForm } from "./EmailRequestForm";
import { NewPasswordForm } from "./NewPasswordForm";
import { useCodeFromUrl } from "./useCodeFromUrl";
import { BackLink, Card, FormError, Lede, PageTitle } from "@/components/ui";

const TITLE_CLASS = "mt-5 text-[clamp(2rem,3.6vw,3rem)]";

/**
 * /confirm-email. The link of the sign-up e-mail carries a one-time `?code=`
 * (24 h): the visitor chooses their password, which confirms the address. With
 * no code or an expired one, they can ask for a new link.
 * See docs/features/account-links.md.
 */
export function ConfirmEmailView() {
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
      <DoneCard title="Compte confirmé !">
        Ton adresse est validée et ton mot de passe est enregistré. Ouvre l&apos;app
        Laboon pour te connecter.
      </DoneCard>
    );
  }

  if (code && !invalid) {
    return (
      <>
        <BackLink />
        <PageTitle className={TITLE_CLASS}>Choisis ton mot de passe</PageTitle>
        <Lede className="max-w-[44ch]">
          Dernière étape : ton mot de passe confirme ton adresse e-mail.
        </Lede>
        <Card className="mt-8 p-6 sm:p-11">
          <NewPasswordForm
            endpoint="/auth/confirm"
            field="password"
            code={code}
            submitLabel="Confirmer mon compte"
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
        {invalid ? "Lien invalide ou expiré" : "Confirme ton adresse e-mail"}
      </PageTitle>
      <Lede className="max-w-[44ch]">
        Ouvre le lien reçu par e-mail à l&apos;inscription. Il a disparu ou il a expiré ?
        On t&apos;en envoie un nouveau.
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
          endpoint="/auth/confirm/resend"
          submitLabel="Renvoyer le lien"
          sentTitle="Vérifie ta boîte mail"
          sentText="Si un compte en attente de confirmation existe avec cette adresse, on vient d'y envoyer un nouveau lien. Les anciens ne fonctionnent plus."
        />
      </Card>
    </>
  );
}
