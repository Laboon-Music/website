# E-mail templates

Branded HTML e-mails (blue header with the wordmark, card, social links),
readable in **light and dark mode** and on **phones**. French (informal "tu") and English, one file per language.

| Template       | File                                                           | Used for                                                                                    |
| -------------- | -------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Double opt-in  | `emails/dist/double-optin.fr.html` / `.en.html`                | Brevo confirmation template (`BREVO_DOI_TEMPLATE_ID` / `_EN`), button `{{ doubleoptin }}`   |
| Campaign frame | `emails/dist/campaign.fr.html` / `.en.html`                    | Newsletters (launch, beta invitation): edit title and text in Brevo                         |
| App auth mails | `public/emails/auth/{confirmation,recovery,email_change}.html` | Sign-up confirmation, password reset, e-mail change, sent by the app's auth server (GoTrue) |

## Code

- `emails/layout.ts` — shared frame, palette, button; `emails/templates.ts` — the texts.
- `npm run emails` regenerates `emails/dist/*.html` (commit them). Never edit `dist` by hand.
- The logo is `public/brand/email/wordmark-white.png`, loaded from
  `https://www.laboon-app.com/brand/email/…`: it only shows once deployed to production.
  Same address for every e-mail, staging tests included. Loading the images from the sender's own
  site (through a Brevo contact attribute) was tried and does not work: with double opt-in the
  contact does not exist yet when Brevo builds the confirmation e-mail, so the attribute is empty.
- Social links come from `SOCIALS` in `lib/site.ts`: round blue buttons with a white icon
  (`public/brand/email/instagram.png`, `facebook.png`; a new network needs its own PNG).

## How it works

- Table layout and inline styles: the only thing every client (Outlook included) renders.
- **Dark mode**: `prefers-color-scheme: dark` (Apple Mail, iOS, Outlook apps) switches to
  the night blue. Gmail inverts colours by itself and ignores that rule: the palette
  (white card / navy text, solid blue header and button) stays readable when inverted.
- **Phones**: container fluid under 600 px, 20 px side padding, 26 px title, 16 px+ text,
  full-width button (≥ 48 px tall).
- Fonts: web fonts are not reliable in mail clients; titles fall back to Arial Black / system fonts.

## Put it in Brevo

1. Brevo → _Campaigns → Templates_ → open template **ID 1** → _Edit_ → choose the **HTML code**
   editor → replace everything with the content of `emails/dist/double-optin.fr.html` → save.
2. For a campaign: create a template from `campaign.fr.html` (or `.en.html`) and edit the text in the HTML.
3. Send a **test e-mail** to yourself and check Gmail (web + app) and Apple Mail, light and dark.

## Auth e-mails of the app (GoTrue)

The Laboon auth server (Supabase GoTrue, on Coolify) sends the sign-up confirmation, the password reset and the e-mail
change. It can only load a template **from a URL**, so the site serves them: `emails/auth.ts` → `npm run emails` →
`public/emails/auth/*.html` (commit them, like `dist`). They are not indexed (`robots.txt`) and skip the language routing
(`proxy.ts`).

- One file holds both languages: English when the account's `legal_locale` (user metadata, set at sign-up) is `en`,
  French otherwise. Variables are GoTrue's: `{{ .ConfirmationURL }}`, `{{ .Email }}`, `{{ .NewEmail }}`.
- Subjects are plain strings in GoTrue (not translated), so they carry both languages. They are set in the auth service (`GOTRUE_MAILER_SUBJECTS_*`), not in this repository.
- **Security:** GoTrue puts the recovery and confirmation links into whatever these files contain, so whoever can change `public/emails/auth/` can leak them. Treat these files, and the deployment of this site, as part of the account security: review every change to them, and keep the restricted deploy author.
- Images always come from `https://www.laboon-app.com/brand/email/`.
- Wiring (Coolify variables, per environment): see `documentation/COOLIFY_SUPABASE.md` in the app repository.
- If GoTrue cannot load a template it silently sends its default English one: after a change, send a real test.

## Tests

`emails/emails.test.ts`, `emails/auth.test.ts`. The visual check (375 px / 600 px, light / dark) is manual.
