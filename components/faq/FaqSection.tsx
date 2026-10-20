import { FAQ_CONTENT } from "@/content/faq";
import { FaqGroup } from "./Faq";

type Group = (typeof FAQ_CONTENT.groups)[number];

/** Spreads the groups over two columns with a similar number of questions each. */
export function splitColumns(groups: readonly Group[]): [Group[], Group[]] {
  const total = groups.reduce((sum, g) => sum + g.items.length, 0);
  const first: Group[] = [];
  const second: Group[] = [];
  let count = 0;
  for (const group of groups) {
    // A group goes left while the left column is still under half the questions.
    (count < total / 2 ? first : second).push(group);
    count += group.items.length;
  }
  return [first, second];
}

/** FAQ block of the home page: centred title, questions in two columns. */
export function FaqSection() {
  const columns = splitColumns(FAQ_CONTENT.groups);
  return (
    <section
      id="faq"
      aria-labelledby="faq-title"
      className="faq relative px-(--gutter) pt-[clamp(120px,16vw,200px)] pb-[clamp(80px,12vw,140px)] [--faq-cat:#4753ff]"
    >
      <div
        data-faq-header
        className="mx-auto mb-[clamp(40px,6vw,64px)] grid max-w-[640px] justify-items-center gap-4 text-center"
      >
        <h2
          id="faq-title"
          className="font-title text-[30px] leading-[1.05] font-extrabold tracking-[-0.05em] text-balance text-ink sm:text-[clamp(2.2rem,4.2vw,3.75rem)]"
        >
          {FAQ_CONTENT.title}
        </h2>
        <p className="text-base leading-snug text-ink-soft sm:text-[clamp(1.05rem,1.4vw,1.25rem)]">
          {FAQ_CONTENT.subtitle}
        </p>
      </div>
      <div className="mx-auto grid max-w-[1000px] items-start gap-5 md:grid-cols-2">
        {columns.map((groups, i) => (
          <div key={i} className="space-y-7">
            {groups.map((group) => (
              <FaqGroup key={group.title} group={group} as="h3" />
            ))}
          </div>
        ))}
      </div>
    </section>
  );
}
