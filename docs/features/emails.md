# E-mail templates

Branded HTML e-mails (blue header with the wordmark, card, social links),
readable in **light and dark mode** and on **phones**. French (informal "tu") and English, one file per language.

| Template             | File                                                              | Used for                                                                                    |
| -------------------- | ----------------------------------------------------------------- | ------------------------------------------------------------------------------------------- |
| Double opt-in        | `emails/dist/listmonk/subscriber-optin.html`                      | Confirmation of the newsletter signup, both languages in one file                           |
| Campaign frame       | `emails/dist/listmonk/campaign.fr.html` / `.en.html`              | Newsletters (launch, beta invitation), with a starter body in `campaign-content.*.html`     |
| API transactional    | `emails/dist/listmonk/transactional/<email>.fr.html` / `.en.html` | Laboon API mails (api#99), `{{ .Tx.Data.* }}` only; subjects in `transactional/subjects.md` |
| Contact form message | `emails/dist/listmonk/contact-message.html`                       | Message from the contact form to the team                                                   |
| Report alert         | `emails/dist/listmonk/report-alert.html`                          | Laboon API alert to the team for each new report (api#334), French only                     |
| App auth mails       | `public/emails/auth/{confirmation,recovery,email_change}.html`    | Sign-up confirmation, password reset, e-mail change, sent by the app's auth server (GoTrue) |

See [Put it in listmonk](#put-it-in-listmonk).

## Code

- `emails/layout.ts` — shared frame, palette, button; `emails/templates.ts` — the texts.
- `emails/syntax.ts` — the listmonk variables.
- `npm run emails` regenerates `emails/dist/` (commit it). Never edit `dist` by hand.
- The logo is `public/brand/email/wordmark-white.png`, loaded from
  `https://www.laboon-app.com/brand/email/…`: it only shows once deployed to production.
  Same address for every e-mail, staging tests included.
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

## Put it in listmonk

The website's newsletter signup and contact form send through listmonk ([listmonk.md](../integrations/listmonk.md)). Files in `emails/dist/listmonk/`:

| File                                         | Where in listmonk                                                                                                                                                          |
| -------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `campaign.fr.html` / `.en.html`              | _Campaigns → Templates_ → new template, type **Campaign**                                                                                                                  |
| `campaign-content.fr.html` / `.en.html`      | Starter body: paste it in a new campaign, format **Raw HTML**, then write the message                                                                                      |
| `subscriber-optin.html`                      | Not in the interface: system template, volume + `--static-dir`, see [listmonk.md](../integrations/listmonk.md) step 3                                                      |
| `contact-message.html`                       | _Campaigns → Templates_ → type **Transactional** `contact-message`, subject in [listmonk.md](../integrations/listmonk.md#setup-in-listmonk-one-time) (`emails/contact.ts`) |
| `transactional/<email>.fr.html` / `.en.html` | _Campaigns → Templates_ → type **Transactional**, subject from `transactional/subjects.md`                                                                                 |
| `report-alert.html`                          | _Campaigns → Templates_ → type **Transactional** `report_alert.fr`, subject in `emails/report-alert.ts`; its ID goes in the API (`LISTMONK_TEMPLATES`, `docs/emails.md`)   |

- Variables: `{{ .OptinURL }}`, `{{ MessageURL }}`, `{{ UnsubscribeURL }}`, `{{ .Tx.Data.* }}` (the API's params, same
  names). listmonk escapes them (Go `html/template`), so a first name holding HTML shows as text.
- **One opt-in template for both languages**: listmonk has a single system opt-in e-mail. It sends English when the
  subscriber's `language` attribute is `en`, French otherwise: the site must set `attribs.language` when it subscribes.
  The **subject** follows too: listmonk takes it from `<title data-i18n>` in the rendered template
  ([knadh/listmonk#1727](https://github.com/knadh/listmonk/issues/1727)), instead of its own subject, which exists in
  one language only (the instance's).
- **Greeting**: `first_name` attribute, `musicien·ne` / `musician` when empty (the site collects no name).
- **No tracking pixel** (`{{ TrackView }}` left out): no open tracking.
- A campaign template must hold `{{ template "content" . }}` exactly once: it is where the body of the campaign goes.

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

`emails/emails.test.ts`, `emails/transactional.test.ts`, `emails/auth.test.ts`, and `emails/compat.test.ts` for every
generated e-mail:

- **Client support**: each e-mail is checked against the [caniemail](https://www.caniemail.com) database
  (`doiuse-email`, Gmail, Apple Mail, Outlook, Yahoo, Samsung). A feature some client does not support fails the test,
  unless it is in `ACCEPTED` with the reason the e-mail stays readable there (e.g. square buttons in Outlook on
  Windows). Add a feature there only after checking it degrades gracefully. The package's data dates from 2023.
- **Size**: under 102 KB, the size above which Gmail clips the message.
- **Spam filters**: no text SpamAssassin counts as invisible (`color:transparent` or a tiny font before text): the hidden
  preheader relies on `display:none`, `max-height:0`, `opacity:0` and `mso-hide:all` instead. It cost 2.5 points on
  mail-tester.

The visual check (375 px / 600 px, light / dark) stays manual: send a test from listmonk to Gmail (web + app) and
Apple Mail, and run one send through [mail-tester.com](https://www.mail-tester.com) for SPF, DKIM, DMARC and spam score.
