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
4. listmonk transactional e-mail (`POST /api/tx`, mode `external`) to
   `CONTACT_TO_EMAIL`, from listmonk's default sender, with header
   **`Reply-To` = the visitor**: hitting _Reply_ answers them directly.
   The site sends the fields as data (`CONTACT_EMAIL_FIELDS`, `lib/contact.ts`);
   the template `contact-message` (`emails/contact.ts` →
   `emails/dist/listmonk/contact-message.html`) lays them out and builds the
   subject `[Contact Laboon] <subject> — <name>`. listmonk escapes them, and
   nothing the visitor typed is parsed as a template.

## Subjects

Defined once in `CONTACT_SUBJECTS` (`lib/contact.ts`): `question`, `beta`,
`partenariat`, `bug`, `autre`. Each has a form label and an email label.
To add one, add an entry there — form and API pick it up.

## Confirmation

Once the message is sent the form is replaced by a short confirmation card. The page scrolls back to
the top at that moment, otherwise it stays where the send button was and shows the footer.

## API contract

Same shape as [newsletter-signup](newsletter-signup.md#api-contract):
200 `{ ok }`, 200 `{ ok, dryRun }` locally without config, 400 `{ error }`
for validation / anti-bot, 500 missing config online or network error, 502
listmonk refused.

## Configuration

`LISTMONK_URL`, `LISTMONK_API_USER`, `LISTMONK_API_TOKEN`,
`LISTMONK_CONTACT_TEMPLATE_ID`, `CONTACT_TO_EMAIL` — see [listmonk.md](../integrations/listmonk.md).

## Tests

`app/api/contact/route.test.ts`, `components/contact/ContactForm.test.tsx`,
`lib/contact.test.ts`, `emails/contact.test.ts`.
