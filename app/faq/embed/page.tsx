import type { Metadata } from "next";
import { Faq, FAQ_TITLE } from "@/components/faq/Faq";

/**
 * Bare variant of the FAQ, loaded by the mobile app in a WebView at
 * `/faq/embed`. No site chrome, tighter padding, `noindex` (duplicate of /faq).
 */
export const metadata: Metadata = {
  title: FAQ_TITLE,
  robots: { index: false, follow: false },
};

export default function FaqEmbedPage() {
  return (
    <main className="mx-auto max-w-3xl px-5 pt-[max(2rem,env(safe-area-inset-top))] pb-[max(2rem,env(safe-area-inset-bottom))]">
      <Faq embed />
    </main>
  );
}
