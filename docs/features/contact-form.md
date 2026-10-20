# Contact form

## Where

- Page: `app/[lang]/contact/page.tsx` (`/contact`, linked from header and footer).
- Form: `components/contact/ContactForm.tsx`.
- App embed: `app/[lang]/contact/embed/page.tsx` (`/contact/embed`) — bare page (no site chrome, `noindex`) loaded by the mobile app in a WebView from Profile > Help, same form and same API.
- API: `app/api/contact/route.ts` — `POST /api/contact`.
- Subjects & limits (shared client/server): `lib/contact.ts`.

## Flow

1. Visitor fills name, email, subject, message.
2. `POST /api/contact` + anti-bot fields ([antibot.md](antibot.md)).
3. Validation: name required (truncated to 100 chars), valid email, message
   10–5000 chars. Unknown subjects fall back to "Autre".
4. Brevo transactional email (`/v3/smtp/email`) from
   `Laboon - Contact <noreply@laboon-app.com>` to `CONTACT_TO_EMAIL`, with
   **`replyTo` = the visitor**: hitting _Reply_ answers them directly.
   User content is HTML-escaped. Tag `contact`.

## Subjects

Defined once in `CONTACT_SUBJECTS` (`lib/contact.ts`): `question`, `beta`,
`partenariat`, `bug`, `autre`. Each has a form label and an email label.
To add one, add an entry there — form and API pick it up.

## API contract

Same shape as [newsletter-signup](newsletter-signup.md#api-contract):
200 `{ ok }`, 200 `{ ok, dryRun }` locally without config, 400 `{ error }`
for validation / anti-bot, 500 missing config online or network error, 502
Brevo refused.

## Configuration

`BREVO_API_KEY`, `CONTACT_TO_EMAIL`.

## Tests

`app/api/contact/route.test.ts`, `components/contact/ContactForm.test.tsx`,
`lib/contact.test.ts`.
