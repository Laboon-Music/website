import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CONFIDENTIALITE_META = {
  title: "Privacy Policy",
  version: "1",
  effectiveDate: "22 October 2026",
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
            Laboon is published in a personal capacity by Mathieu Lopez (see the Legal
            Notice). He is the controller of the personal data collected through the
            application.
          </p>
          <p>
            Contact: <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
        </Section>
        <Section title="2. Data collected">
          <Subheading>Your account:</Subheading>
          <List>
            <li>First and last name, e-mail address</li>
            <li>Password (stored in encrypted form, never in clear text)</li>
            <li>
              If you sign in with Google or Apple: the identifier provided by that
              service, your e-mail address (Apple may hide it), your first and last name.
              The photo of your Google account is not imported.
            </li>
          </List>
          <Subheading>Your profile (provided voluntarily):</Subheading>
          <List>
            <li>Instruments, level, styles, influences, availability, biography</li>
            <li>Profile photo, visuals and pages of your bands</li>
            <li>
              Links to your online pages (Instagram, YouTube, SoundCloud, Spotify, etc.),
              displayed publicly
            </li>
            <li>
              A geographic area of your choice: the centre of a city or neighbourhood and
              its radius, never a precise address. It is used to find musicians and ads
              nearby.
            </li>
          </List>
          <Subheading>Your content and activity:</Subheading>
          <List>
            <li>Ads, messages, favourites, saved searches</li>
            <li>Users you block, reports you make</li>
            <li>
              Your last activity, according to your privacy settings, and your
              notification preferences
            </li>
            <li>
              The version of the legal documents you accepted, the date and the language
            </li>
          </List>
          <Subheading>Technical data:</Subheading>
          <List>
            <li>
              Your device&apos;s notification token, device type and system, application
              version
            </li>
            <li>IP address, in the server logs</li>
            <li>
              With your consent only: usage statistics (screens visited, features used)
              linked to an identifier of your account, never to your name or e-mail, and
              crash reports
            </li>
          </List>
        </Section>
        <Section title="3. Purposes and legal bases">
          <List>
            <li>
              Creating and managing your account, connecting musicians, messaging — Legal
              basis: performance of the contract
            </li>
            <li>
              Application notifications (messages, favourites, invitations) — Legal basis:
              performance of the contract, with your permission on the device
            </li>
            <li>
              Service e-mails (password changed, account deleted) — Legal basis:
              performance of the contract
            </li>
            <li>
              Moderation and security (reports, blocks, abuse prevention) — Legal basis:
              legitimate interest
            </li>
            <li>
              Usage statistics and crash reports — Legal basis: consent, which you can
              withdraw at any time in “Privacy &amp; data”
            </li>
            <li>Website newsletter (outside the application) — Legal basis: consent</li>
          </List>
        </Section>
        <Section title="4. Retention periods">
          <List>
            <li>
              Account data: for as long as the account is active, then 3 years after the
              last sign-in, or until the account is deleted
            </li>
            <li>
              Reports: 12 months at most after they are created, without naming the people
              once their account is deleted
            </li>
            <li>Technical logs: 12 months</li>
            <li>
              Website waiting-list contacts: until the application launches, then 1 year
            </li>
            <li>
              Backup copies: they may remain temporarily after a deletion, until they are
              automatically overwritten
            </li>
          </List>
        </Section>
        <Section title="5. Recipients of the data">
          <p>
            Your personal data is not sold to third parties. Laboon shows no advertising.
            It may be processed by our service providers, under GDPR-compliant contracts:
          </p>
          <List>
            <li>OVH: hosting of the server and the database</li>
            <li>
              Cloudflare: protection and routing of the traffic to our servers (your IP
              address goes through it)
            </li>
            <li>Vercel: hosting of the website</li>
            <li>
              Apple and Google: sign-in with your account, notifications (APNs, FCM), and,
              with your consent, usage statistics and crash reports (Firebase)
            </li>
            <li>An e-mail sending provider, for the service e-mails</li>
          </List>
          <p>
            The competent authorities may also have access to it where required by law.
            Any transfer outside the European Union is subject to appropriate safeguards
            (the European Commission&apos;s standard contractual clauses).
          </p>
        </Section>
        <Section title="6. Your rights">
          <p>Under the GDPR, you have the following rights:</p>
          <List>
            <li>Right of access: obtain a copy of your data</li>
            <li>Right to rectification: correct inaccurate data</li>
            <li>
              Right to erasure (“right to be forgotten”): see the section “Deleting your
              account”
            </li>
            <li>Right to restriction of processing</li>
            <li>Right to data portability</li>
            <li>Right to object to processing</li>
            <li>Right to withdraw your consent at any time</li>
          </List>
          <p>
            You can correct your profile in the application. The application does not yet
            offer an automatic export: to get a copy of your data, write to us. We reply
            within one month.
          </p>
          <p>
            To exercise these rights:{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
          </p>
          <p>
            You may also lodge a complaint with the CNIL (
            <TextLink href="https://www.cnil.fr">www.cnil.fr</TextLink>).
          </p>
        </Section>
        <Section title="7. Deleting your account" id="suppression-compte">
          <p>
            You can ask for your account and the associated data to be deleted at any
            time, in one of two ways.
          </p>
          <Subheading>In the application:</Subheading>
          <p>
            Profile, then “Delete my account”, then confirm. The deletion is immediate and
            permanent. For a “Sign in with Apple” account, Apple also asks you to confirm,
            and the authorisation given to Laboon is revoked.
          </p>
          <Subheading>Without opening the application:</Subheading>
          <p>
            Write to <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>{" "}
            from the e-mail address of your account, stating “Laboon account deletion”. We
            delete the account within one month and confirm by e-mail.
          </p>
          <Subheading>What is deleted:</Subheading>
          <List>
            <li>
              Your profile, your links, instruments, genres and influences, your photo and
              the visuals of the bands where you were the only member
            </li>
            <li>
              Your ads, favourites, saved searches, blocks, notifications and notification
              tokens, consents and acceptances of the legal documents
            </li>
            <li>
              The bands where you were the only member. If other members remain, ownership
              passes to an administrator, otherwise to a member.
            </li>
          </List>
          <Subheading>What is kept:</Subheading>
          <List>
            <li>
              The messages you sent remain visible to the other person, without your name
              (“Deleted account”). A conversation with no participant left is deleted.
            </li>
            <li>
              The reports you made or received, without naming you, for 12 months at most,
              for moderation.
            </li>
            <li>
              Technical backup copies, temporarily, until they are automatically
              overwritten.
            </li>
          </List>
          <p>
            Laboon offers no paid subscription: there is none to cancel before deleting
            the account.
          </p>
        </Section>
        <Section title="8. Minimum age">
          <p>
            Laboon is reserved for adults (18 and over). We do not knowingly collect data
            from minors. If you believe an account belongs to a minor, write to us: we
            will delete it.
          </p>
        </Section>
        <Section title="9. Cookies and trackers">
          <p>
            The Laboon mobile application does not use cookies. Our website does not use
            tracking cookies: it measures its audience with a tool that uses neither
            cookies nor identifiers and cannot recognise you from one visit to the next.
            No consent banner is therefore needed.
          </p>
        </Section>
        <Section title="10. Security">
          <p>
            Laboon implements appropriate technical and organisational measures to protect
            your data: encrypted exchanges (HTTPS), encrypted passwords, and access to
            data restricted account by account.
          </p>
        </Section>
        <Section title="11. Changes to this policy">
          <p>
            Laboon reserves the right to change this policy at any time. Any substantial
            change will be notified to you by e-mail or by a notification in the
            application.
          </p>
        </Section>
      </DocBody>
    </article>
  );
}
