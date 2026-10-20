import type { Metadata } from "next";
import { ResetPasswordView } from "@/components/account/ResetPasswordView";
import { PageShell } from "@/components/layout";

export const metadata: Metadata = {
  title: "Mot de passe — Laboon",
  robots: { index: false, follow: false },
};

// Target of the "password reset" e-mail of the Laboon API (and where a reset is
// requested). With Universal Links / App Links the OS opens the app instead when
// it is installed. See docs/features/account-links.md.
export default function ResetPasswordPage() {
  return (
    <PageShell>
      <section className="rise mx-auto w-full max-w-[560px]">
        <ResetPasswordView />
      </section>
    </PageShell>
  );
}
