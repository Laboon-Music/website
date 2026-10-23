import { DocBody, DocHeader, List, Section } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const MENTIONS_LEGALES_META = {
  title: "Legal Notice",
  version: "1",
  effectiveDate: "22 October 2026",
};
export default function MentionsLegales() {
  return (
    <article className="space-y-8">
      <DocHeader {...MENTIONS_LEGALES_META} locale="en" />
      <p className="max-w-[62ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-muted">
        In accordance with Articles 6-III and 19 of French Law No. 2004-575 of 21 June
        2004 on Confidence in the Digital Economy (LCEN).
      </p>
      <DocBody>
        <Section title="1. Publisher of the application">
          <List>
            <li>Name: Lopez Mathieu</li>
            <li>Address: 3 Rue du Colonel Sebanne 69600 Oullins, France</li>
            <li>
              Contact email:{" "}
              <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
            </li>
            <li>Host: OVH SAS, 2 rue Kellermann, 59100 Roubaix, France</li>
          </List>
        </Section>
        <Section title="2. Intellectual property">
          <p>
            All the elements making up the Laboon application (name, logo, graphic
            identity, content, software) are protected by French and international
            intellectual property laws.
          </p>
          <p>
            The “Laboon” trademark is registered with the INPI under Nice classes 9, 35
            and 41. Any reproduction or use without prior authorisation is prohibited.
          </p>
        </Section>
        <Section title="3. Hyperlinks">
          <p>
            Laboon cannot be held liable for the content of third-party websites to which
            links may point from the application or the website.
          </p>
        </Section>
        <Section title="4. Governing law">
          <p>
            This legal notice is governed by French law. In the event of a dispute, the
            competent courts are those of Lyon.
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
