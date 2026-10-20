import type { Metadata } from "next";
import { FaqJsonLd } from "@/components/faq/FaqJsonLd";
import { FaqSection } from "@/components/faq/FaqSection";
import HomeScene from "@/components/home/HomeScene";
import { getContent } from "@/content";
import { jsonLd } from "@/lib/json-ld";
import { languageAlternates, localePath } from "@/lib/i18n";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { CONTACT_EMAIL, SITE_URL, SOCIALS } from "@/lib/site";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return {
    alternates: {
      canonical: localePath(locale, "/"),
      languages: languageAlternates("/"),
    },
  };
}

// Home page. Texts live in content/<lang>/home.ts and content/<lang>/faq.ts
// (editable without touching JSX); the animated scene is components/home.
export default async function Home({ params }: LangParams) {
  const locale = await resolveLocale(params);
  const { home, faq, site } = getContent(locale);
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: site.name,
    url: `${SITE_URL}${localePath(locale, "/")}`,
    email: CONTACT_EMAIL,
    sameAs: SOCIALS.map((social) => social.href),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: jsonLd(organization) }}
      />
      <FaqJsonLd content={faq} />
      <HomeScene content={home} faq={<FaqSection content={faq} />} />
    </>
  );
}
