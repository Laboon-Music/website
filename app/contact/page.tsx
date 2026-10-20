import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { PageShell } from "@/components/layout";
import SocialLinks from "@/components/social/SocialLinks";
import { Lede, PageTitle } from "@/components/ui";

export const metadata: Metadata = {
  title: "Contact — Laboon",
  description: "Une question, une idée, un partenariat ? Écris à l'équipe Laboon.",
};

export default function ContactPage() {
  return (
    <PageShell>
      <div className="mx-auto w-full max-w-[720px]">
        <div className="rise mx-auto max-w-xl text-center">
          <PageTitle>Contacte-nous</PageTitle>
          <Lede className="font-bold tracking-[-0.03em]">
            Une question sur l’appli, une idée, un partenariat ? Écris-nous, on lit tout.
          </Lede>
        </div>
        <div className="mt-10 sm:mt-14">
          <ContactForm />
        </div>
        <div className="mt-12 grid justify-items-center gap-3.5 text-center">
          <p className="font-bold tracking-[-0.02em]">Ou retrouve-nous sur les réseaux</p>
          <SocialLinks />
        </div>
      </div>
    </PageShell>
  );
}
