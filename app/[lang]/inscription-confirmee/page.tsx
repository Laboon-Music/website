import type { Metadata } from "next";
import { PageShell } from "@/components/layout";
import { TrackSignupConfirmed } from "@/components/newsletter/TrackSignupConfirmed";
import SocialLinks from "@/components/social/SocialLinks";
import { ButtonLink, Card } from "@/components/ui";
import { getContent } from "@/content";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { NOINDEX } from "@/lib/page-metadata";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getContent(locale).ui.confirmed.metaTitle, robots: NOINDEX };
}

// Landing page after clicking the link in the Brevo confirmation email (double
// opt-in). Brevo redirects here once the contact is added to the lists, to the
// page of the language of the signup. See docs/features/newsletter-signup.md.
export default async function InscriptionConfirmeePage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const { confirmed } = getContent(locale).ui;
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
          {confirmed.title}
        </h1>
        <p className="mt-4 text-muted">{confirmed.text}</p>
        <div className="mt-6 flex flex-col items-center gap-3">
          <p className="text-sm">{confirmed.follow}</p>
          <SocialLinks />
        </div>
        <ButtonLink href="/" className="mt-8 px-10">
          {confirmed.backHome}
        </ButtonLink>
      </Card>
    </PageShell>
  );
}
