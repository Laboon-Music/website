import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CONFIDENTIALITE_META = {
  title: "Privacy Policy",
  version: "3",
  effectiveDate: "20 October 2026",
};
export default function Confidentialite() {
  return (
    <article className="space-y-8">
      <DocHeader {...CONFIDENTIALITE_META} locale="en" />
      <p className="max-w-[62ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-muted">
        In accordance with Regulation (EU) 2016/679 of the European Parliament and of the
        Council (GDPR) and the amended French Data Protection Act.
      </p>
      <DocBody>
        <Section title="1. Data controller">
          <p>
            Laboon is the controller of the personal data collected through the
            application.
          </p>
          <p>
            DPO / contact person:{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
        <Section title="2. Data collected">
          <Subheading>At sign-up:</Subheading>
          <List>
            <li>First and last name</li>
            <li>Email address</li>
            <li>Password (stored in encrypted form, never in clear text)</li>
            <li>City / location (for searches of nearby musicians)</li>
          </List>
          <Subheading>Musical profile data (provided voluntarily):</Subheading>
          <List>
            <li>Instrument(s) played</li>
            <li>Musical style(s)</li>
            <li>Level and availability</li>
            <li>Biography / free-text description</li>
            <li>Profile photo (optional)</li>
            <li>Links to audio/video content (SoundCloud, YouTube, etc.)</li>
          </List>
          <Subheading>Technical data:</Subheading>
          <List>
            <li>IP address</li>
            <li>Browsing and usage data of the application</li>
            <li>Device type and operating system</li>
          </List>
        </Section>
        <Section title="3. Purposes and legal bases of processing">
          <List>
            <li>
              Creating and managing your account — Legal basis: performance of a contract
            </li>
            <li>Connecting musicians — Legal basis: performance of a contract</li>
            <li>
              Improving the application (analytics) — Legal basis: legitimate interest
            </li>
            <li>
              Transactional emails related to the service — Legal basis: performance of a
              contract
            </li>
            <li>Marketing emails / newsletter — Legal basis: consent</li>
          </List>
        </Section>
        <Section title="4. Retention period">
          <List>
            <li>
              Account data: for as long as the account is active, then 3 years after the
              last login
            </li>
            <li>Contact data (waitlist): until the app launches, then 1 year</li>
            <li>Technical data (logs): 12 months</li>
          </List>
        </Section>
        <Section title="5. Recipients of the data">
          <p>Your personal data is not sold to third parties. It may be shared with:</p>
          <List>
            <li>
              Our technical service providers (host, emailing service) under
              GDPR-compliant contracts
            </li>
            <li>The competent authorities where legally required</li>
          </List>
          <p>
            Any transfer outside the European Union is subject to appropriate safeguards
            (standard contractual clauses of the European Commission).
          </p>
        </Section>
        <Section title="6. Your rights">
          <p>Under the GDPR, you have the following rights:</p>
          <List>
            <li>Right of access: obtain a copy of your data</li>
            <li>Right to rectification: correct inaccurate data</li>
            <li>Right to erasure (“right to be forgotten”)</li>
            <li>Right to restriction of processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw your consent at any time</li>
          </List>
          <p>
            To exercise these rights:{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
          <p>
            You may also lodge a complaint with the CNIL (
            <TextLink href="https://www.cnil.fr">www.cnil.fr</TextLink>).
          </p>
        </Section>
        <Section title="7. Cookies and trackers">
          <p>
            The Laboon mobile application does not use cookies. Our website does not use
            tracking cookies: it measures its audience with a tool that uses no cookie and
            no identifier and cannot recognise you from one visit to the next. No consent
            banner is therefore required.
          </p>
        </Section>
        <Section title="8. Security">
          <p>
            Laboon implements appropriate technical and organisational measures to protect
            your data (encryption, restricted access, HTTPS protocols).
          </p>
        </Section>
        <Section title="9. Changes to the policy">
          <p>
            Laboon reserves the right to amend this policy at any time. Any substantial
            change will be notified to you by email or through a notification in the
            application.
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
