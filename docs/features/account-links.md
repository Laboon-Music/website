# Account links (password reset, e-mail confirmation)

The Laboon API ([Laboon-Music/api](https://github.com/Laboon-Music/api)) e-mails links
that open a page of this website. The website calls the API **directly from the
browser** (CORS) — it has no account logic of its own and no secret.

| Page              | Link in the e-mail                     | What it does                                                         |
| ----------------- | -------------------------------------- | -------------------------------------------------------------------- |
| `/reset-password` | `…/reset-password?code=lbc_…` (30 min) | Choose a new password → `POST /auth/password/reset/confirm`          |
| `/reset-password` | none (no code, or expired code)        | Ask for a link → `POST /auth/password/reset`                         |
| `/confirm-email`  | `…/confirm-email?code=lbc_…` (24 h)    | Choose a password, which confirms the address → `POST /auth/confirm` |
| `/confirm-email`  | none (no code, or expired code)        | Ask for a new link → `POST /auth/confirm/resend`                     |

The API contract is `docs/openapi.yaml` and `docs/contract/README.md` in the API repo.

## Behaviour

- The one-time `code` is read from the URL, then **removed from the address bar** right away.
- Rules (mirror of the API policy, the API is the judge): 12+ characters, an uppercase
  letter, a digit and a character that is neither a letter nor a digit. They are shown
  as a live checklist (`lib/password.ts`, `PASSWORD_RULES`).
- The API answers with a session: the website **ignores it** (the visitor logs in in the app).
- `invalid_code` (unknown, expired or used code) → "Lien invalide ou expiré" + a form to get a new link.
  Other errors are translated to French by code (`apiErrorMessage`); the API's English messages are never shown.
- Requesting a link always shows the same confirmation: neither the API nor the page reveals
  whether an address has an account.
- Missing configuration shows an error (never a fake success): `not_configured`.
- Both pages are `noindex`.

## Code

`lib/api.ts` (client, never logs bodies), `lib/password.ts`, `components/account/`
(`ResetPasswordView`, `ConfirmEmailView`, `NewPasswordForm`, `EmailRequestForm`,
`useCodeFromUrl`), `app/reset-password/page.tsx`, `app/confirm-email/page.tsx`.

## Configuration

- `NEXT_PUBLIC_API_URL` — base URL **with `/v1`**: prod `https://api.laboon-app.com/v1`,
  staging `https://api.staging.laboon-app.com/v1` (hostnames to confirm with the API team).
- The site's origins (prod, staging, Vercel previews if needed) must be in the API's
  **`CORS_ORIGINS`**, and the API's `EMAIL_LINKS_BASE_URL` must be the site of that environment.

## Anti-bot

These forms do not go through our `/api` routes, so they have no Turnstile / honeypot of
ours: the API protects them itself (3 requests per address and per hour, per IP, the same
answer for every address, one-time 256-bit codes). See [antibot.md](antibot.md).

## Deep links

`/reset-password` is registered for Universal Links / App Links ([deep-links.md](deep-links.md)).
`/confirm-email` is **not** yet: to open the app from that link, the app team must add it.

## Tests

`lib/api.test.ts`, `lib/password.test.ts`, `components/account/account.test.tsx` (API mocked).
