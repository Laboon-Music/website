import type { Metadata } from "next";
import ContactForm from "@/components/contact/ContactForm";
import { getContent } from "@/content";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { NOINDEX } from "@/lib/page-metadata";

/**
 * Bare variant of the contact form, loaded by the mobile app in a WebView at
 * `/contact/embed` (`?lang=en` for English). No site chrome, tighter padding,
 * `noindex` (duplicate of /contact).
 */
export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getContent(locale).ui.contact.metaTitle, robots: NOINDEX };
}

export default async function ContactEmbedPage({ params }: LangParams) {
  const locale = await resolveLocale(params);
  return (
    <main className="mx-auto max-w-2xl px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <p className="mb-6 text-muted">{getContent(locale).ui.contact.embedLede}</p>
      <ContactForm />
    </main>
  );
}
