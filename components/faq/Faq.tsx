import { Disclosure, Lede, PageTitle } from "@/components/ui";
import type { FAQ_CONTENT } from "@/content/fr/faq";
import { RichText } from "./RichText";

/** FAQ texts of one language (same shape in every language). */
export type FaqContent = typeof FAQ_CONTENT;
type Group = FaqContent["groups"][number];

/** One category: a small label and its questions. `as` sets the heading level. */
export function FaqGroup({
  group,
  as: Heading,
  embed,
}: {
  group: Group;
  as: "h2" | "h3";
  embed?: boolean;
}) {
  return (
    <section className="grid gap-3">
      <Heading className="ml-1 font-title text-[13px] font-extrabold tracking-[-0.01em] text-(--faq-cat,#b6bbfe)">
        {group.title}
      </Heading>
      {group.items.map((item) => (
        <Disclosure key={item.question} summary={item.question}>
          <p>
            <RichText text={item.answer} embed={embed} />
          </p>
        </Disclosure>
      ))}
    </section>
  );
}

/**
 * The FAQ as a standalone article, loaded by the mobile app WebView at
 * `/faq/embed` (`embed`: links stay on bare pages). On the website the FAQ is
 * the home page section (`FaqSection`); `/faq` redirects there.
 */
export function Faq({ content, embed }: { content: FaqContent; embed?: boolean }) {
  return (
    <article className="space-y-10">
      <header>
        <PageTitle>{content.title}</PageTitle>
        <Lede>{content.subtitle}</Lede>
      </header>
      {content.groups.map((group) => (
        <FaqGroup key={group.title} group={group} as="h2" embed={embed} />
      ))}
    </article>
  );
}
