import { Disclosure, Lede, PageTitle } from "@/components/ui";
import { FAQ_CONTENT } from "@/content/faq";
import { RichText } from "./RichText";

export const FAQ_TITLE = "Questions fréquentes — Laboon";

type Group = (typeof FAQ_CONTENT.groups)[number];

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
    <section className="space-y-3">
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
export function Faq({ embed }: { embed?: boolean }) {
  return (
    <article className="space-y-10">
      <header>
        <PageTitle>{FAQ_CONTENT.title}</PageTitle>
        <Lede>{FAQ_CONTENT.subtitle}</Lede>
      </header>
      {FAQ_CONTENT.groups.map((group) => (
        <FaqGroup key={group.title} group={group} as="h2" embed={embed} />
      ))}
    </article>
  );
}
