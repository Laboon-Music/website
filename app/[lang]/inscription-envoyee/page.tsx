import type { Metadata } from "next";
import { CheckBadge } from "@/components/account/AccountBits";
import { PageShell } from "@/components/layout";
import { ButtonLink, Card } from "@/components/ui";
import { getContent } from "@/content";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { NOINDEX } from "@/lib/page-metadata";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getContent(locale).ui.signupSent.metaTitle, robots: NOINDEX };
}

// Shown right after the signup form is accepted: "check your inbox" (the confirmation
// e-mail is on its way). The page after the click in that e-mail is /inscription-confirmee.
// See docs/features/newsletter-signup.md.
export default async function SignupSentPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const t = getContent(locale).ui.signupSent;
  return (
    <PageShell>
      <Card tone="success" className="mx-auto w-full max-w-lg p-8 sm:p-12">
        <CheckBadge />
        <h1 className="mt-8 font-title text-3xl leading-tight font-extrabold tracking-[-0.04em] text-balance">
          {t.title}
          <span className="mt-2 block text-[0.8em]">{t.subtitle}</span>
        </h1>
        <p className="mx-auto mt-5 max-w-[34ch] text-lg leading-relaxed text-muted">
          {t.text}
        </p>
        <p className="mx-auto mt-3 max-w-[34ch] text-base text-muted">{t.tip}</p>
        <ButtonLink href="/" fullWidth className="mt-10 px-10 sm:w-auto">
          {t.backHome}
        </ButtonLink>
      </Card>
    </PageShell>
  );
}
