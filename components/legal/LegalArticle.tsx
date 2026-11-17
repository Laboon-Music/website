import type { LegalVersion } from "@/lib/legal-api";
import { DocHeader } from "./_shared";
import { LegalMarkdown } from "./LegalMarkdown";

/** A legal document from the API: title, version and effective date, then the Markdown text. */
export function LegalArticle({ doc }: { doc: LegalVersion }) {
  return (
    <article className="space-y-8">
      <DocHeader
        title={doc.title}
        version={String(doc.version)}
        effectiveDate={doc.effectiveDate}
        locale={doc.locale}
      />
      <LegalMarkdown markdown={doc.bodyMd} />
    </article>
  );
}
