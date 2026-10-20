import type { Metadata } from "next";
import { ConfirmEmailView } from "@/components/account/ConfirmEmailView";
import { PageShell } from "@/components/layout";

export const metadata: Metadata = {
  title: "Confirmation du compte — Laboon",
  robots: { index: false, follow: false },
};

// Target of the sign-up confirmation e-mail of the Laboon API: the visitor
// chooses their password, which confirms the address.
// See docs/features/account-links.md.
export default function ConfirmEmailPage() {
  return (
    <PageShell>
      <section className="rise mx-auto w-full max-w-[560px]">
        <ConfirmEmailView />
      </section>
    </PageShell>
  );
}
