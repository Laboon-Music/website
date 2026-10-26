// Template variables of each sending tool. The texts and the layout are shared; only these placeholders differ, so the
// same e-mail is generated for Brevo (its own tags) and for listmonk (Go templates). See docs/features/emails.md.

export type Syntax = {
  /** Double opt-in confirmation link. */
  optinUrl: string;
  /** "View in browser" link of a campaign. */
  mirrorUrl: string;
  /** Unsubscribe link of a campaign. */
  unsubscribeUrl: string;
  /** First name of the contact, or `fallback` when it is unknown. */
  firstName: (fallback: string) => string;
  /** A variable sent by the Laboon API with a transactional e-mail. */
  param: (name: string) => string;
};

export const BREVO: Syntax = {
  optinUrl: "{{ doubleoptin }}",
  mirrorUrl: "{{ mirror }}",
  unsubscribeUrl: "{{ unsubscribe }}",
  firstName: (fallback) => `{{ contact.FIRSTNAME | default : '${fallback}' }}`,
  param: (name) => `{{ params.${name} }}`,
};

// The site collects no name: like Brevo's FIRSTNAME, the `first_name` attribute stays empty until we ask for it.
// `.Subscriber.FirstName` is not used: listmonk derives the name from the e-mail address when none is given.
export const LISTMONK: Syntax = {
  optinUrl: "{{ .OptinURL }}",
  mirrorUrl: "{{ MessageURL }}",
  unsubscribeUrl: "{{ UnsubscribeURL }}",
  firstName: (fallback) => `{{ .Subscriber.Attribs.first_name | default "${fallback}" }}`,
  param: (name) => `{{ .Tx.Data.${name} }}`,
};

/** Where listmonk inserts the body of a campaign: required exactly once in a campaign template. */
export const LISTMONK_CONTENT = `{{ template "content" . }}`;
