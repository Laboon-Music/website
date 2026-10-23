import type { Metadata } from "next";
import { ConfirmEmailView } from "@/components/account/ConfirmEmailView";
import { PageShell } from "@/components/layout";
import { getContent } from "@/content";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { NOINDEX } from "@/lib/page-metadata";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  return { title: getContent(locale).ui.account.confirmMetaTitle, robots: NOINDEX };
}

// Target of the e-mails of the Laboon API (and where a link is requested), in the
// language of the URL. See docs/features/account-links.md.
export default function Page() {
  return (
    <PageShell>
      {/* min-h: the view replaces a short "loading" line, without this the footer jumps (layout shift). */}
      <section className="rise mx-auto min-h-[40rem] w-full max-w-[560px]">
        <ConfirmEmailView />
      </section>
    </PageShell>
  );
}
