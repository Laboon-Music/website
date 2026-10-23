import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CGU_META = {
  title: "Terms of Use",
  version: "1",
  effectiveDate: "22 October 2026",
};
export default function Cgu() {
  return (
    <article className="space-y-8">
      <DocHeader {...CGU_META} locale="en" />
      <DocBody>
        <Section title="1. Purpose">
          <p>
            These Terms of Use (ToU) set out the terms and conditions under which Laboon
            makes its mobile application and related services available to users.
          </p>
          <p>
            Laboon is an application that connects musicians, allowing artists to find
            musical partners, form bands and collaborate.
          </p>
          <p>
            By creating an account on the Laboon application, you accept these ToU without
            reservation.
          </p>
        </Section>
        <Section title="2. Definitions">
          <List>
            <li>
              “Laboon”: the platform, the mobile application and its services, published
              by Laboon.
            </li>
            <li>“User”: any adult individual who has created an account on Laboon.</li>
            <li>
              “Profile”: the User&apos;s personal page containing their musical and
              contact information.
            </li>
            <li>
              “Content”: any item published by the User (text, photos, audio/video links,
              messages).
            </li>
            <li>“Services”: all the features offered by Laboon.</li>
          </List>
        </Section>
        <Section title="3. Access to the services">
          <p>
            Access to the Services is reserved for adults (18 and over). By creating an
            account, you declare that you are at least 18 years old.
          </p>
          <p>
            The Laboon application is available free of charge on the App Store / Google
            Play. If a paid plan is offered later, its terms will be set out in specific
            Terms of Sale, which you will be asked to accept.
          </p>
        </Section>
        <Section title="4. Account creation">
          <p>
            To access the Services, the User must create an account by providing accurate,
            complete and up-to-date information. Each person may hold only one active
            account.
          </p>
          <p>
            The User is solely responsible for the confidentiality of their login
            credentials and for any activity carried out from their account.
          </p>
          <p>
            Laboon reserves the right to suspend or delete any account created with false
            information or used fraudulently.
          </p>
        </Section>
        <Section title="5. Rules of use">
          <Subheading>The User agrees to:</Subheading>
          <List>
            <li>
              Use Laboon only to connect with other musicians and collaborate artistically
            </li>
            <li>Provide truthful information about their profile and musical skills</li>
            <li>Respect other users in their communications</li>
            <li>
              Not use the platform for commercial purposes without Laboon&apos;s prior
              consent
            </li>
          </List>
          <Subheading>The following is strictly prohibited:</Subheading>
          <List>
            <li>
              Publishing unlawful, defamatory, obscene or threatening content, or content
              that infringes third-party rights
            </li>
            <li>Impersonating another musician or an existing band</li>
            <li>Spamming other users through the internal messaging</li>
            <li>Using robots, scrapers or any automated tool to access data</li>
            <li>Attempting to circumvent the platform&apos;s security measures</li>
            <li>
              Reproducing, copying or exploiting all or part of the platform without
              written authorisation
            </li>
          </List>
        </Section>
        <Section title="6. Content published by users">
          <p>
            The User retains the intellectual property in the content they publish. By
            publishing on Laboon, they grant Laboon a non-exclusive, worldwide,
            royalty-free licence to display and distribute that content as part of the
            operation of the service.
          </p>
          <p>
            The User warrants that the content they publish (in particular audio/video
            excerpts) does not infringe third-party rights.
          </p>
          <p>
            Laboon reserves the right to remove, without notice, any content that breaches
            these ToU.
          </p>
        </Section>
        <Section title="7. Messaging and connections">
          <p>
            Laboon&apos;s internal messaging is a tool for connecting musicians. Laboon is
            not a party to exchanges between users and cannot be held liable for the
            content of private conversations.
          </p>
          <p>
            Laboon does not guarantee that a connection will lead to an actual musical
            collaboration.
          </p>
        </Section>
        <Section title="8. Reporting and moderation">
          <p>
            Any User may report an inappropriate user, ad or message using the reporting
            feature in the application, and may block another User: the ads of a blocked
            User are no longer shown, and that User can no longer write to the person who
            blocked them.
          </p>
          <p>
            Laboon may refuse to publish an ad, or remove it, when its content breaches
            these Terms or the Code of Conduct (abusive or misleading content, commercial
            solicitation, requests for money).
          </p>
          <p>
            Laboon undertakes to review reports as quickly as possible and to take
            appropriate measures (warning, suspension, account deletion). Reports are kept
            for 12 months at most, without naming the people once their account is deleted
            (see the Privacy Policy).
          </p>
        </Section>
        <Section title="9. Service availability">
          <p>
            Laboon endeavours to keep the application available 24/7. Interruptions may
            occur for maintenance or technical reasons. Laboon cannot be held liable for
            temporary unavailability of the Services.
          </p>
        </Section>
        <Section title="10. Liability">
          <p>
            Laboon acts as a host of the content published by Users, within the meaning of
            the French LCEN law. Its liability can only be engaged if it fails to remove
            manifestly unlawful content that has been duly reported.
          </p>
          <p>
            Laboon does not guarantee the accuracy of the information on profiles.
            Collaborations arranged following connections made through Laboon are the sole
            responsibility of the Users concerned.
          </p>
        </Section>
        <Section title="11. Suspension and termination">
          <p>
            The User may delete their account at any time from the application settings.
            The data deleted and the data kept are described in the Privacy Policy,
            section “Deleting your account”.
          </p>
          <p>
            Laboon may suspend or terminate an account without notice in the event of a
            breach of these ToU or fraudulent behaviour.
          </p>
        </Section>
        <Section title="12. Changes to the ToU">
          <p>
            Laboon reserves the right to amend these ToU at any time. Users will be
            informed of any substantial change by notification in the application or by
            email.
          </p>
          <p>
            Continued use of the application after notification constitutes acceptance of
            the new ToU.
          </p>
        </Section>
        <Section title="13. Governing law and jurisdiction">
          <p>These ToU are governed by French law.</p>
          <p>
            In the event of a dispute, and failing an amicable resolution, the competent
            courts of Lyon will have jurisdiction.
          </p>
        </Section>
        <Section title="14. Contact">
          <p>
            For any question about these ToU:{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
