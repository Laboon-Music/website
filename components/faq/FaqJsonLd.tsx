import { FAQ_CONTENT } from "@/content/faq";

/** Turns `[label](address)` into `label`: structured data is plain text. */
export function plainText(text: string): string {
  return text.replace(/\[([^\]]+)\]\([^)\s]+\)/g, "$1");
}

/** schema.org FAQPage built from content/faq.ts, so it can never drift from the page. */
export function faqStructuredData() {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: FAQ_CONTENT.groups.flatMap((group) =>
      group.items.map((item) => ({
        "@type": "Question",
        name: item.question,
        acceptedAnswer: { "@type": "Answer", text: plainText(item.answer) },
      })),
    ),
  };
}

export function FaqJsonLd() {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(faqStructuredData()) }}
    />
  );
}
