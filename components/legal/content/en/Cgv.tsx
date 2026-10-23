import { DocBody, DocHeader, Section } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CGV_META = {
  title: "Terms of Sale",
  version: "1",
  effectiveDate: "22 October 2026",
};
export default function Cgv() {
  return (
    <article className="space-y-8">
      <DocHeader {...CGV_META} locale="en" />
      <DocBody>
        <Section title="1. Purpose">
          <p>
            These Terms of Sale set out the conditions under which Laboon offers its
            services for a fee, where applicable.
          </p>
        </Section>
        <Section title="2. A free service">
          <p>
            In its current version, the Laboon application and all of its features are
            free. No subscription, in-app purchase or advertising is offered: the User
            owes nothing and no payment data is collected.
          </p>
          <p>
            The conditions of use of the free service are set out in the Terms of Use and
            the Code of Conduct.
          </p>
        </Section>
        <Section title="3. Future paid plans">
          <p>
            If Laboon ever offers a paid plan, its price, duration, and its payment,
            cancellation and withdrawal terms will be set out in new Terms of Sale. The
            User will be informed in the application and asked to accept them before any
            purchase: no paid plan applies without that acceptance.
          </p>
        </Section>
        <Section title="4. Governing law and jurisdiction">
          <p>
            These Terms of Sale are governed by French law. In the event of a dispute, and
            failing an amicable settlement, the courts within the jurisdiction of Lyon
            shall have jurisdiction.
          </p>
        </Section>
        <Section title="5. Contact">
          <p>
            For any question about these Terms of Sale:{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
