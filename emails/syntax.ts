// Template variables of listmonk (Go templates). See docs/features/emails.md.

// The site collects no name: the `first_name` attribute stays empty until we ask for it.
// `.Subscriber.FirstName` is not used: listmonk derives the name from the e-mail address when none is given.
export const LISTMONK = {
  /** Double opt-in confirmation link. */
  optinUrl: "{{ .OptinURL }}",
  /** "View in browser" link of a campaign. */
  mirrorUrl: "{{ MessageURL }}",
  /** Unsubscribe link of a campaign. */
  unsubscribeUrl: "{{ UnsubscribeURL }}",
  /** First name of the contact, or `fallback` when it is unknown. */
  firstName: (fallback: string) =>
    `{{ .Subscriber.Attribs.first_name | default "${fallback}" }}`,
  /** A variable sent by the Laboon API with a transactional e-mail. */
  param: (name: string) => `{{ .Tx.Data.${name} }}`,
};

/** Where listmonk inserts the body of a campaign: required exactly once in a campaign template. */
export const LISTMONK_CONTENT = `{{ template "content" . }}`;
