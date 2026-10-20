import type { Metadata } from "next";
import HomeScene from "@/components/home/HomeScene";
import { FaqJsonLd } from "@/components/faq/FaqJsonLd";
import { SITE_CONTENT } from "@/content/site";
import { CONTACT_EMAIL, SITE_URL, SOCIALS } from "@/lib/site";

export const metadata: Metadata = {
  alternates: { canonical: "/" },
};

// Home page. Texts live in content/home.ts and content/faq.ts (editable
// without touching JSX); the animated scene is components/home.
export default function Home() {
  const organization = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: SITE_CONTENT.name,
    url: `${SITE_URL}/`,
    email: CONTACT_EMAIL,
    sameAs: SOCIALS.map((social) => social.href),
  };
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organization) }}
      />
      <FaqJsonLd />
      <HomeScene />
    </>
  );
}
