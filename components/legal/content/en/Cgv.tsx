import { DocBody, DocHeader, List, Section, Subheading } from "../../_shared";
import { TextLink } from "@/components/ui";
import { CONTACT_EMAIL } from "@/lib/site";

export const CGV_META = {
  title: "Terms of Sale",
  version: "2",
  effectiveDate: "12 October 2026",
};
export default function Cgv() {
  return (
    <article className="space-y-8">
      <DocHeader {...CGV_META} locale="en" />
      <p className="max-w-[62ch] text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-muted">
        Subscription offer for musician users
      </p>
      <DocBody>
        <Section title="Preamble">
          <p>
            These Terms of Sale (ToS) govern the contractual relationship between Laboon,
            hereinafter “the Provider”, and any user of the Laboon application,
            hereinafter “the User”, wishing to access the platform&apos;s paid premium
            features.
          </p>
          <p>
            Laboon is a mobile application connecting musicians, offering, in addition to
            its free plan, paid subscriptions giving access to advanced features.
          </p>
          <p>
            Any subscription to a paid Laboon plan constitutes unreserved acceptance of
            these ToS as well as of the platform&apos;s Terms of Use.
          </p>
        </Section>
        <Section title="1. Definitions">
          <List>
            <li>
              “Laboon” or “the Provider”: the co-founders of Laboon, who operate the
              platform.
            </li>
            <li>
              “User”: any adult individual who has created an account on the Laboon
              application.
            </li>
            <li>
              “Subscription”: the paid plan subscribed to by the User to access
              Laboon&apos;s premium features.
            </li>
            <li>
              “No Ads Plan”: monthly subscription at €0.99/month that removes advertising
              from the application.
            </li>
            <li>
              “Premium Plan”: monthly subscription at €4.99/month giving access to all of
              Laboon&apos;s advanced features.
            </li>
            <li>
              “Services”: all the features available to the user depending on their
              subscription plan.
            </li>
            <li>
              “Listing”: an offer published by the User on Laboon aimed at other musicians
              (looking for partners, forming a band, a musical project, etc.).
            </li>
            <li>
              “Boosted content”: a listing highlighted in search results and in other
              users&apos; news feed.
            </li>
          </List>
        </Section>
        <Section title="2. Offers and prices">
          <p>
            Laboon offers the following subscription plans to musicians registered on the
            platform:
          </p>
          <Subheading>Free Plan — €0/month</Subheading>
          <List>
            <li>Access to the application and all basic features</li>
            <li>Creation and management of a musician profile</li>
            <li>Searching for musicians and viewing profiles</li>
            <li>Internal messaging</li>
            <li>Publishing listings (limited number, automatic expiry after 30 days)</li>
            <li>Display of advertising in the application</li>
          </List>
          <Subheading>No Ads Plan — €0.99/month incl. VAT</Subheading>
          <List>
            <li>All the features of the Free Plan</li>
            <li>Removal of all advertising in the application</li>
          </List>
          <Subheading>Premium Plan — €4.99/month incl. VAT</Subheading>
          <List>
            <li>All the features of the No Ads Plan</li>
            <li>
              Unlimited listings — no restriction on the number of simultaneously active
              listings
            </li>
            <li>
              No automatic expiry of listings — your listings stay active until you delete
              them
            </li>
            <li>
              Boosted listings — priority highlighting of your listings in search results
              and in musicians&apos; feed
            </li>
            <li>
              Premium badge — displayed on your profile, visible to all users of the
              platform
            </li>
            <li>Zero advertising in the application</li>
          </List>
          <p>
            Prices are stated inclusive of all taxes (VAT included). The applicable VAT is
            the French rate in force at the time of invoicing.
          </p>
          <p>
            Laboon reserves the right to change its prices with at least 30 days&apos;
            notice before the renewal date of the current subscription.
          </p>
        </Section>
        <Section title="3. Subscription and term">
          <Subheading>3.1 Subscribing</Subheading>
          <p>
            A paid subscription is taken out directly from the Laboon application, via the
            “Go Premium” section accessible from the User&apos;s profile. Payment is
            handled through the billing systems built into the App Store (Apple) or the
            Google Play Store (Android), depending on the device used.
          </p>
          <p>The subscription takes effect immediately after payment is confirmed.</p>
          <Subheading>3.2 Term and renewal</Subheading>
          <p>
            Subscriptions are taken out for a term of one (1) month, automatically renewed
            by tacit renewal on the anniversary date, unless the User cancels under the
            conditions set out in article 7.
          </p>
          <p>
            Automatic renewal is managed directly from the settings of the App Store or
            Google Play Store, depending on the platform used.
          </p>
          <Subheading>3.3 Changing plan</Subheading>
          <p>
            The User may switch from the No Ads Plan to the Premium Plan (upgrade) or vice
            versa (downgrade) at any time from their subscription settings. The change
            takes effect at the next monthly renewal date.
          </p>
        </Section>
        <Section title="4. Payment terms">
          <Subheading>4.1 Methods</Subheading>
          <p>
            Subscriptions are paid through the payment system built into the App Store
            (Apple In-App Purchase) or Google Play Store (Google Play Billing), depending
            on the platform from which the application was downloaded. Laboon has no
            direct access to the User&apos;s payment data, which is handled exclusively by
            Apple or Google.
          </p>
          <p>
            Billing occurs on the date of subscription, then automatically at each monthly
            renewal.
          </p>
          <Subheading>4.2 Proof of payment</Subheading>
          <p>
            Payment receipts are issued directly by Apple or Google and are available from
            the purchase history of the App Store or Google Play Store. Laboon does not
            issue separate invoices for subscriptions taken out through the stores.
          </p>
          <Subheading>4.3 Payment failure</Subheading>
          <p>
            If the automatic payment fails (expired card, insufficient funds, etc.), Apple
            or Google notifies the User. Failing correction, the subscription is
            automatically suspended and access to premium features is cut off until the
            payment information is updated.
          </p>
        </Section>
        <Section title="5. Description of the services">
          <Subheading>5.1 Removal of advertising</Subheading>
          <p>
            The No Ads and Premium subscriptions remove all advertising spaces displayed
            in the Laboon application. This removal is active as long as the subscription
            is in progress. Upon cancellation, advertising is displayed again at the end
            of the current subscription period.
          </p>
          <Subheading>5.2 Unlimited listings (Premium)</Subheading>
          <p>
            The Premium Plan allows the User to publish an unlimited number of listings
            simultaneously, with no quota. Each listing must comply with Laboon&apos;s
            Terms of Use and the platform&apos;s Code of Conduct.
          </p>
          <Subheading>5.3 No automatic expiry (Premium)</Subheading>
          <p>
            Listings published by a Premium User remain active with no time limit, until
            manually deleted by the User or in the event of a breach of the ToU. Listings
            published before subscribing to the Premium Plan and whose expiry was already
            scheduled are automatically extended as soon as the subscription is activated.
          </p>
          <Subheading>5.4 Boosted listings (Premium)</Subheading>
          <p>
            The Premium Plan includes the automatic, priority highlighting of the
            User&apos;s listings in search results and in other musicians&apos; news feed.
            The boost applies to all of the Premium User&apos;s active listings. Laboon
            reserves the right to change the technical workings of the boost without this
            constituting a substantial change to the service.
          </p>
          <Subheading>5.5 Premium badge (Premium)</Subheading>
          <p>
            A visual “Premium” badge is displayed on the profile of a User subscribed to
            the Premium Plan. This badge is visible to all users of the platform. It
            disappears automatically when the subscription is cancelled.
          </p>
          <Subheading>5.6 Availability</Subheading>
          <p>
            Laboon undertakes to keep the platform and the premium features accessible
            24/7, except during scheduled maintenance announced in advance. In the event
            of an unplanned interruption of the premium features exceeding 48 consecutive
            hours, the User may request a pro rata temporis credit on their current
            subscription by contacting{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>.
          </p>
        </Section>
        <Section title="6. Right of withdrawal">
          <p>
            In accordance with Article L.221-18 of the French Consumer Code, a consumer
            User has 14 days from the date of subscription to exercise their right of
            withdrawal, without having to give any reason.
          </p>
          <p>
            However, under Article L.221-28 of the same code, the right of withdrawal
            cannot be exercised for digital content whose performance has begun with the
            User&apos;s express consent before the end of the withdrawal period. By
            subscribing and immediately accessing the premium features, the User expressly
            acknowledges that they waive their right of withdrawal.
          </p>
          <p>
            For any withdrawal request within the legal period and before any access to
            the features, the User must contact Laboon at:{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>.
          </p>
        </Section>
        <Section title="7. Cancellation">
          <Subheading>7.1 Cancellation by the User</Subheading>
          <p>
            The User may cancel their subscription at any time directly from the settings
            of the App Store (Apple) or Google Play Store (Android), depending on the
            platform used. Cancellation takes effect at the end of the current monthly
            period. No refund is made for the period already billed.
          </p>
          <p>
            After cancellation, the User keeps access to the premium features until the
            end of the paid monthly period, then automatically switches to the Free Plan.
          </p>
          <Subheading>7.2 Cancellation by Laboon</Subheading>
          <p>
            Laboon may cancel a User&apos;s subscription without notice in the event of:
          </p>
          <List>
            <li>Serious or repeated breach of the ToU or the Code of Conduct</li>
            <li>Fraudulent use of the platform or the premium features</li>
            <li>Uncorrected payment failure</li>
          </List>
          <p>
            In the event of cancellation by Laboon for a legitimate reason, a pro rata
            temporis refund of the unused period is made, except in the event of serious
            misconduct by the User.
          </p>
          <Subheading>7.3 Account deletion</Subheading>
          <p>
            Deletion of the account by the User automatically cancels the subscription. No
            refund is made for the current period. The subscription must first be
            cancelled from the settings of the App Store or Google Play Store before
            deleting the account, to avoid any automatic renewal.
          </p>
        </Section>
        <Section title="8. Liability">
          <Subheading>8.1 Liability of Laboon</Subheading>
          <p>
            Laboon is bound by an obligation of means in providing the premium Services.
            Its liability cannot be engaged in the event of:
          </p>
          <List>
            <li>
              Service interruption due to force majeure or a technical failure of the host
            </li>
            <li>Temporary unavailability of the premium features due to maintenance</li>
            <li>
              Data loss resulting from inappropriate use of the application by the User
            </li>
          </List>
          <p>
            In any event, Laboon&apos;s liability is limited to the amount actually paid
            by the User for their subscription during the 3 months preceding the loss.
          </p>
          <Subheading>8.2 Liability of the User</Subheading>
          <p>
            The Premium User is solely responsible for the content of their listings and
            for the way they use the advanced features, in compliance with the
            platform&apos;s ToU and Code of Conduct.
          </p>
        </Section>
        <Section title="9. Personal data">
          <p>
            The processing of the User&apos;s personal data in connection with subscribing
            is governed by Laboon&apos;s Privacy Policy, available in the application and
            on <TextLink href="https://laboon-app.com">laboon-app.com</TextLink>.
          </p>
          <p>
            Payment data is processed exclusively by Apple or Google depending on the
            platform used. Laboon neither collects nor stores the User&apos;s banking or
            credit card data.
          </p>
        </Section>
        <Section title="10. Changes to the ToS">
          <p>
            Laboon reserves the right to amend these ToS at any time. The User is informed
            of any change by notification in the application or by email at least 30 days
            before the new terms come into force.
          </p>
          <p>
            If the User does not accept the new terms, they may cancel their subscription
            before the effective date without penalty. Continued use of the Services after
            that date constitutes acceptance of the new ToS.
          </p>
        </Section>
        <Section title="11. Mediation and dispute resolution">
          <p>
            In the event of a dispute relating to a subscription, the User is invited to
            first contact Laboon&apos;s customer service at{" "}
            <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>. Laboon
            undertakes to reply within 48 working hours.
          </p>
          <p>
            Failing an amicable resolution, the User may use consumer mediation free of
            charge with:
          </p>
          <p>MED CONSO DEV (formerly CNPM Médiation Consommation)</p>
          <p>
            Website: <TextLink href="https://medconsodev.eu">medconsodev.eu</TextLink>
          </p>
          <p>
            The User may also use the European online dispute resolution platform:{" "}
            <TextLink href="https://ec.europa.eu/consumers/odr">
              ec.europa.eu/consumers/odr
            </TextLink>
          </p>
        </Section>
        <Section title="12. Governing law and jurisdiction">
          <p>These ToS are governed by French law.</p>
          <p>
            In the event of a dispute not resolved by mediation, the competent courts of
            Lyon will have jurisdiction.
          </p>
        </Section>
        <Section title="13. Contact">
          <List>
            <li>
              Email: <TextLink href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</TextLink>
            </li>
            <li>Response time: 48 working hours</li>
            <li>
              Website: <TextLink href="https://laboon-app.com">laboon-app.com</TextLink>
            </li>
          </List>
        </Section>
      </DocBody>
    </article>
  );
}
