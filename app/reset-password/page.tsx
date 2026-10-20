"use client";

import { useEffect, useState } from "react";
import { PageShell } from "@/components/layout";
import {
  BackLink,
  Button,
  ButtonLink,
  Card,
  FormError,
  Lede,
  PageTitle,
  PasswordInput,
} from "@/components/ui";
import {
  MIN_PASSWORD_LENGTH,
  parseRecoveryHash,
  supabaseErrorMessage,
  validateNewPassword,
} from "@/lib/password";
import { cx } from "@/lib/cx";
import { getSupabase } from "@/lib/supabase";

// Web fallback of the app's password recovery link. With Universal Links (iOS) /
// App Links (Android) the OS opens the app directly; this page is shown when the
// app is not installed or the link is opened elsewhere.
// See docs/features/reset-password.md.

type Status = "loading" | "ready" | "invalid" | "success";

const LABEL = "pl-1 text-[15px] font-semibold";

export default function ResetPasswordPage() {
  const [status, setStatus] = useState<Status>("loading");
  const [error, setError] = useState<string | null>(null);
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    const tokens = parseRecoveryHash(window.location.hash);
    if (!tokens) {
      queueMicrotask(() => setStatus("invalid"));
      return;
    }
    // Any failure (expired link, network down, Supabase not configured) must
    // end on "invalid link", never on an endless "Chargement…".
    Promise.resolve()
      .then(() =>
        getSupabase().auth.setSession({
          access_token: tokens.accessToken,
          refresh_token: tokens.refreshToken,
        }),
      )
      .then(({ error }) => setStatus(error ? "invalid" : "ready"))
      .catch(() => setStatus("invalid"));
  }, []);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    const validationError = validateNewPassword(password, confirm);
    setError(validationError);
    if (validationError) return;

    setSubmitting(true);
    try {
      const { error } = await getSupabase().auth.updateUser({ password });
      if (error) setError(supabaseErrorMessage(error));
      else setStatus("success");
    } catch (err) {
      setError(supabaseErrorMessage(err));
    } finally {
      setSubmitting(false);
    }
  }

  const longEnough = password.length >= MIN_PASSWORD_LENGTH;

  return (
    <PageShell>
      <section className="rise mx-auto w-full max-w-[560px]">
        {status === "loading" && (
          <p role="status" className="text-center text-muted">
            Chargement…
          </p>
        )}

        {status === "invalid" && (
          <>
            <BackLink />
            <PageTitle className="mt-5 text-[clamp(2rem,3.6vw,3rem)]">
              Lien invalide ou expiré
            </PageTitle>
            <Card className="mt-8 p-6 sm:p-11">
              <FormError>
                Le lien de réinitialisation n&apos;est plus valide (il a peut-être déjà
                servi ou expiré).
              </FormError>
              <p className="mt-5 text-muted">
                Demande un nouveau mail depuis l&apos;app Laboon.
              </p>
            </Card>
          </>
        )}

        {status === "success" && (
          <Card tone="success" className="p-6 sm:p-11">
            <div
              aria-hidden="true"
              className="mx-auto grid size-[84px] place-items-center rounded-full bg-white shadow-[0_0_0_10px_rgb(255_255_255/0.14),0_0_0_22px_rgb(255_255_255/0.07)]"
            >
              <svg viewBox="0 0 38 38" className="size-[38px]">
                <path
                  d="M9 20l7 7 13-15"
                  fill="none"
                  stroke="#0a4d2a"
                  strokeWidth="4"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <h1 className="mt-8 font-title text-[clamp(1.8rem,3vw,2.5rem)] leading-tight font-extrabold tracking-[-0.04em]">
              Mot de passe mis à jour
            </h1>
            <p className="mx-auto mt-4 max-w-[40ch] text-muted">
              C&apos;est tout bon ! Tu peux maintenant te reconnecter à l&apos;app Laboon
              avec ton nouveau mot de passe.
            </p>
            <ButtonLink href="/" fullWidth className="mt-8 px-9 sm:w-auto">
              Revenir sur Laboon
            </ButtonLink>
          </Card>
        )}

        {status === "ready" && (
          <>
            <BackLink />
            <PageTitle className="mt-5 text-[clamp(2rem,3.6vw,3rem)]">
              Choisis un nouveau mot de passe
            </PageTitle>
            <Lede className="max-w-[44ch]">
              Il remplacera l&apos;ancien sur l&apos;app Laboon.
            </Lede>

            <Card className="mt-8 p-6 sm:p-11">
              <form onSubmit={onSubmit} noValidate className="grid gap-5">
                <div className="grid gap-2">
                  <label htmlFor="new-password" className={LABEL}>
                    Nouveau mot de passe
                  </label>
                  <PasswordInput
                    id="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    required
                    aria-describedby="password-rules"
                  />
                  <ul id="password-rules" className="mt-1 pl-1 text-sm text-muted">
                    <li className="flex items-center gap-2">
                      <span
                        aria-hidden="true"
                        className={cx(
                          "size-4 flex-none rounded-full border-2",
                          longEnough ? "border-success bg-success" : "border-[#c9ccff]",
                        )}
                      />
                      {MIN_PASSWORD_LENGTH} caractères minimum
                      <span className="sr-only">{longEnough ? " (respecté)" : ""}</span>
                    </li>
                  </ul>
                </div>
                <div className="grid gap-2">
                  <label htmlFor="confirm-password" className={LABEL}>
                    Confirmer le mot de passe
                  </label>
                  <PasswordInput
                    id="confirm-password"
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
                    disabled={submitting}
                    fullWidth
                    className="px-9 sm:w-auto"
                  >
                    {submitting ? "Mise à jour…" : "Mettre à jour"}
                  </Button>
                </div>
              </form>
            </Card>
          </>
        )}
      </section>
    </PageShell>
  );
}
