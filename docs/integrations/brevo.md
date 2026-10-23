# Brevo

Brevo (ex-Sendinblue) stores contacts and sends emails. EU-based (GDPR), free
plan, campaigns can be sent from the same tool later.

## Usage in the code

`lib/brevo.ts` — `brevoPost(path, apiKey, payload, logTag)` (REST, no SDK) and
`readIdEnv(name)`.

| Endpoint                                    | Used by                                               |
| ------------------------------------------- | ----------------------------------------------------- |
| `POST /v3/contacts/doubleOptinConfirmation` | [newsletter signup](../features/newsletter-signup.md) |
| `POST /v3/smtp/email`                       | [contact form](../features/contact-form.md)           |

## Account setup (done 2026-09-27)

- Account "Laboon" (laboon.app@gmail.com), sending domain `laboon-app.com`
  authenticated (DKIM + DMARC). Sender `Laboon <noreply@laboon-app.com>`.
- Lists — one pair per environment so staging tests never pollute prod:

  | Env        | Launch | Beta |
  | ---------- | ------ | ---- |
  | Production | 5      | 6    |
  | Staging    | 7      | 8    |

- Double opt-in template: "Laboon - Double opt-in (confirmation inscription)"
  = **ID 1**, tag `optin`, link `{{ doubleoptin }}`.
- API key "laboon-website".
- ⚠️ Do **not** enable "block unauthorised IPs" on API keys: Vercel has no
  fixed IPs, every call would fail.
- Optional: create text contact attributes `SOURCE` (the site sends `landing`) and `LANGUAGE` (`fr` / `en`).
- English confirmation template: duplicate template 1 with `emails/dist/double-optin.en.html` and set its ID in `BREVO_DOI_TEMPLATE_ID_EN`.

## Environment variables

| Variable                   | Prod       | Staging    |
| -------------------------- | ---------- | ---------- |
| `BREVO_API_KEY`            | key        | key        |
| `BREVO_LIST_ID_LAUNCH`     | `5`        | `7`        |
| `BREVO_LIST_ID_BETA`       | `6`        | `8`        |
| `BREVO_DOI_TEMPLATE_ID`    | `1`        | `1`        |
| `BREVO_DOI_TEMPLATE_ID_EN` | optional   | optional   |
| `CONTACT_TO_EMAIL`         | team inbox | team inbox |
