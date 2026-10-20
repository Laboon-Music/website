# E-mail templates

Branded HTML e-mails (blue header with the wordmark, card, social links),
readable in **light and dark mode** and on **phones**. French, informal "tu".

| Template       | File                            | Used for                                                                  |
| -------------- | ------------------------------- | ------------------------------------------------------------------------- |
| Double opt-in  | `emails/dist/double-optin.html` | Brevo template **ID 1** (signup confirmation), button `{{ doubleoptin }}` |
| Campaign frame | `emails/dist/campaign.html`     | Newsletters (launch, beta invitation): edit title and text in Brevo       |

## Code

- `emails/layout.ts` — shared frame, palette, button; `emails/templates.ts` — the texts.
- `npm run emails` regenerates `emails/dist/*.html` (commit them). Never edit `dist` by hand.
- The logo is `public/brand/email/wordmark-white.png`, loaded from
  `https://www.laboon-app.com/brand/email/…`: it only shows once deployed to production.
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
   editor → replace everything with the content of `emails/dist/double-optin.html` → save.
2. For a campaign: create a template from `campaign.html` and edit the text in the HTML.
3. Send a **test e-mail** to yourself and check Gmail (web + app) and Apple Mail, light and dark.

## Tests

`emails/emails.test.ts`. The visual check (375 px / 600 px, light / dark) is manual.
