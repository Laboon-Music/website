import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { PageShell } from "@/components/layout";
import SocialLinks from "@/components/social/SocialLinks";
import { Lede, PageTitle } from "@/components/ui";
import { getContent } from "@/content";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { alternatesFor } from "@/lib/page-metadata";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { contact } = getContent(locale).ui;
  return {
    title: contact.metaTitle,
    description: contact.metaDescription,
    alternates: alternatesFor(locale, "/contact"),
  };
}

export default async function ContactPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const { contact } = getContent(locale).ui;
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-[720px]">
        <div className="rise mx-auto max-w-xl text-center">
          <PageTitle>{contact.title}</PageTitle>
          <Lede className="font-bold tracking-[-0.03em]">{contact.lede}</Lede>
        </div>
        <div className="mt-10 sm:mt-14">
          <ContactForm />
        </div>
        <div className="mt-12 grid justify-items-center gap-3.5 text-center">
          <p className="font-bold tracking-[-0.02em]">{contact.socials}</p>
          <SocialLinks />
        </div>
      </div>
    </PageShell>
  );
}
