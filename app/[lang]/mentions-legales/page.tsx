import type { Metadata } from "next";
import { LegalPage, legalMetadata } from "@/components/legal/LegalPage";
import { resolveLocale, type LangParams } from "@/lib/locale-params";

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  return legalMetadata(await resolveLocale(params), "mentions-legales");
}

export default async function Page({ params }: LangParams) {
  return <LegalPage locale={await resolveLocale(params)} slug="mentions-legales" />;
}
