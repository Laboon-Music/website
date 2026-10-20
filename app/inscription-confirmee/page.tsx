import type { Metadata } from "next";
import { PageShell } from "@/components/layout";
import { TrackSignupConfirmed } from "@/components/newsletter/TrackSignupConfirmed";
import SocialLinks from "@/components/social/SocialLinks";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Inscription confirmée — Laboon" };

// Landing page after clicking the link in the Brevo confirmation email (double
// opt-in). Brevo redirects here once the contact is added to the lists.
// See docs/features/newsletter-signup.md.
export default function InscriptionConfirmeePage() {
  return (
    <PageShell>
      <TrackSignupConfirmed />
      <Card tone="success" className="mx-auto w-full max-w-lg">
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
        <h1 className="mt-8 font-title text-3xl font-extrabold tracking-[-0.04em]">
          Inscription confirmée
        </h1>
        <p className="mt-4 text-muted">
          Merci ! Ton adresse est validée. On te tiendra au courant du lancement de
          Laboon.
        </p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-sm">En attendant, suis-nous pour ne rien rater :</p>
          <SocialLinks />
        </div>
        <ButtonLink href="/" className="mt-8 px-10">
          Retour à l&apos;accueil
        </ButtonLink>
      </Card>
    </PageShell>
  );
}
