import { PageTitle, TextLink } from "@/components/ui";
import { getContent } from "@/content";
import { fmt, type Locale } from "@/lib/i18n";
import type { LegalVersionSummary } from "@/lib/legal-api";
import { formatEffectiveDate } from "./_shared";

/**
 * History of a legal document: the versions in force or replaced (the API never
 * lists a draft, a cancelled or a scheduled one), newest first, each linking to
 * its frozen page `/legal/<slug>/<version>?lang=<locale>`. The links are built
 * here, from the slug and the number: the API's `url` field is not used, so a
 * link never leaves the site. See docs/features/legal-documents.md.
 */

/** Title of the document: the version in force, else the newest listed. */
export function historyTitle(versions: LegalVersionSummary[]): string {
  return (versions.find((v) => v.inForce) ?? versions[0]).title;
}

export function LegalVersionHistory({
  locale,
  slug,
  versions,
}: {
  locale: Locale;
  slug: string;
  versions: LegalVersionSummary[];
}) {
  const t = getContent(locale).ui.legal;
  const resolved = versions[0].locale;
  return (
    // The API may answer in another language than the one asked (fallback).
    <div lang={resolved === locale ? undefined : resolved}>
      <PageTitle>{fmt(t.versionsTitle, { title: historyTitle(versions) })}</PageTitle>
      <ol className="mt-8 space-y-4">
        {versions.map((v) => (
          <li
            key={v.version}
            className="bg-surface p-5 text-text shadow-[0_2px_4px_rgb(8_10_66/0.2)] sm:p-7"
          >
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <h2 className="font-title text-xl font-extrabold tracking-[-0.03em]">
                {fmt(t.versionLabel, { version: v.version })}
              </h2>
              {v.inForce && (
                <span className="rounded-full bg-white px-2.5 py-0.5 text-xs font-bold text-ink">
                  {t.inForce}
                </span>
              )}
            </div>
            <p className="mt-1.5 text-sm font-semibold text-[#b6bbfe]">
              {fmt(t.effectiveFrom, {
                date: formatEffectiveDate(v.effectiveDate, v.locale),
              })}
            </p>
            {v.changeSummary && <p className="mt-3 leading-relaxed">{v.changeSummary}</p>}
            <p className="mt-4">
              <TextLink href={`/legal/${slug}/${v.version}?lang=${locale}`}>
                {fmt(t.viewVersion, { version: v.version })}
              </TextLink>
            </p>
          </li>
        ))}
      </ol>
    </div>
  );
}
