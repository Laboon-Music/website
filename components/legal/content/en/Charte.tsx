import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CHARTE_META = {
  title: "Code of Conduct",
  version: "2",
  effectiveDate: "12 October 2026",
};
export default function Charte() {
  return (
    <article className="space-y-8">
      <DocHeader {...CHARTE_META} locale="en" />
      <DocBody>
        <Section title="Our vision">
          <p>
            Laboon was born from a simple belief: finding musicians to play with
            shouldn&apos;t be complicated. We built this platform so that artists can
            meet, collaborate and create together.
          </p>
          <p>
            This community is only worth something if everyone contributes with respect
            and kindness. This code sets out the rules of community life that every Laboon
            member agrees to follow.
          </p>
        </Section>
        <Section title="1. Respect and kindness">
          <p>
            The music scene is a space for creation and sharing. On Laboon, every
            musician, whatever their level, style or background, deserves to be treated
            with respect.
          </p>
          <Subheading>What we expect from you:</Subheading>
          <List>
            <li>Communicate in a courteous and constructive way with other members</li>
            <li>
              Welcome musicians of all levels — beginner or experienced, everyone has a
              place
            </li>
            <li>Give honest but kind feedback if a musician asks you for it</li>
            <li>Respect the diversity of musical styles, genres and cultures</li>
          </List>
          <Subheading>What is not tolerated:</Subheading>
          <List>
            <li>Insults, or degrading or humiliating remarks towards another member</li>
            <li>Harassment, intimidation or threats in any form</li>
            <li>
              Discrimination based on origin, gender, religion, sexual orientation or
              disability
            </li>
            <li>
              Mocking comments about a member&apos;s musical level or artistic choices
            </li>
          </List>
        </Section>
        <Section title="2. Authenticity and honesty">
          <p>
            Trust is the basis of any musical collaboration. An authentic profile means a
            connection that has a chance of succeeding.
          </p>
          <Subheading>What we expect from you:</Subheading>
          <List>
            <li>
              Fill in a profile that represents you faithfully: instrument(s), level,
              style, availability
            </li>
            <li>Share audio/video excerpts that reflect your real level</li>
            <li>
              Honour your commitments: if you confirm a rehearsal or a project, stick to
              it
            </li>
            <li>Let people know quickly if your availability or your project changes</li>
          </List>
          <Subheading>What is not tolerated:</Subheading>
          <List>
            <li>Creating a fake profile or impersonating another artist or band</li>
            <li>Exaggerating or falsifying your musical level or experience</li>
            <li>
              Publishing audio/video content that is not yours without clearly saying so
            </li>
          </List>
        </Section>
        <Section title="3. Use of messaging">
          <p>
            Laboon messaging is a tool for connecting musicians — not an advertising or
            cold-calling channel.
          </p>
          <Subheading>What we expect from you:</Subheading>
          <List>
            <li>
              Send targeted, personalised messages related to a concrete musical project
            </li>
            <li>
              Present your project clearly: style, goal, expected rehearsal frequency
            </li>
            <li>Respect another member&apos;s silence or refusal without insisting</li>
          </List>
          <Subheading>What is not tolerated:</Subheading>
          <List>
            <li>Sending unsolicited bulk messages (spam)</li>
            <li>
              Using messaging for commercial purposes, cold-calling or non-musical
              promotion
            </li>
            <li>Harassing a member who has not replied or who has declined contact</li>
            <li>
              Sharing a member&apos;s personal details without their explicit consent
            </li>
          </List>
        </Section>
        <Section title="4. Published content">
          <p>
            Everything you publish on Laboon — profile, photos, links, messages — is your
            responsibility.
          </p>
          <Subheading>What we expect from you:</Subheading>
          <List>
            <li>
              Only publish content you own the rights to or have the necessary permissions
              for
            </li>
            <li>
              Choose a profile photo that shows you (not a brand logo, not a picture of a
              celebrity)
            </li>
            <li>Clearly state the source if you share content that is not yours</li>
          </List>
          <Subheading>What is not tolerated:</Subheading>
          <List>
            <li>Publishing sexual, violent or shocking content</li>
            <li>
              Using other people&apos;s images or recordings without permission
              (copyright)
            </li>
            <li>Spreading false, misleading or defamatory information</li>
            <li>Promoting competing services, products or platforms</li>
          </List>
        </Section>
        <Section title="5. Privacy and personal data">
          <p>
            On Laboon, you share information about yourself. We ask you to do the same
            with other members&apos; data.
          </p>
          <Subheading>What we expect from you:</Subheading>
          <List>
            <li>Treat other members&apos; personal information with discretion</li>
            <li>
              Not disclose to third parties the private exchanges you have on the platform
            </li>
          </List>
          <Subheading>What is not tolerated:</Subheading>
          <List>
            <li>
              Collecting, storing or redistributing other members&apos; personal data
              without their consent
            </li>
            <li>
              Photographing or recording a member during a meeting without their agreement
            </li>
            <li>
              Using contact information obtained through Laboon for purposes other than
              musical collaboration
            </li>
          </List>
        </Section>
        <Section title="6. Reporting and moderation">
          <Subheading>How to report?</Subheading>
          <p>
            If you notice behaviour that breaches this code, use the “Report” button
            available on every profile and in every conversation. Your report is
            confidential.
          </p>
          <Subheading>What Laboon commits to doing:</Subheading>
          <List>
            <li>Review every report carefully and impartially</li>
            <li>
              Act quickly in the event of content or behaviour that is manifestly contrary
              to the code
            </li>
            <li>
              Inform the person who reported of the outcome (within the limits of
              confidentiality rules)
            </li>
          </List>
          <Subheading>Possible sanctions:</Subheading>
          <List>
            <li>Written warning for a first minor breach</li>
            <li>Temporary account suspension (7 to 30 days depending on severity)</li>
            <li>Permanent account deletion for serious or repeated violations</li>
          </List>
          <p>
            Laboon reserves the right to report to the competent authorities any unlawful
            content (threats, characterised harassment, illegal content).
          </p>
        </Section>
        <Section title="7. Community commitment">
          <p>
            This code is not just a set of rules — it reflects the community we want to
            build together.
          </p>
          <p>
            By using Laboon, you agree to follow this code and to help make it a platform
            where every musician feels welcome, respected and free to create.
          </p>
          <p>
            Questions about this code? Contact us at:{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
