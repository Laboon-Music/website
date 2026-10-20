import { jsonLd } from "@/lib/json-ld";
import type { FaqContent } from "./Faq";

/** Turns `[label](address)` into `label`: structured data is plain text. */
export function plainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
}

/** schema.org FAQPage built from content/<lang>/faq.ts, so it can never drift from the page. */
export function faqStructuredData(content: FaqContent) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: content.groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
      })),
    ),
  };
}

export function FaqJsonLd({ content }: { content: FaqContent }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: jsonLd(faqStructuredData(content)) }}
    />
  );
}
