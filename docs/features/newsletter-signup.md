# Newsletter signup (launch & beta lists)

The core feature: collect emails of people who want to be notified of the
launch and/or test the beta.

## Where

- Form: `components/newsletter/SignupForm.tsx`, shown twice on `/` (hero and
  final CTA, anchors `#rejoindre` (closing form, target of every "sign up" link) and `#inscription-hero`).
- API: `app/api/subscribe/route.ts` — `POST /api/subscribe`.
- Confirmation page: `app/inscription-confirmee/page.tsx`.
- Shared messages: `lib/newsletter.ts`.

## Flow

1. Visitor enters an email and ticks at least one box: _Me prévenir du
   lancement_ (ticked by default) and/or _Devenir beta testeur·euse_.
2. `POST /api/subscribe` with `{ email, wantsLaunch, wantsBeta }` + anti-bot
   fields ([antibot.md](antibot.md)).
3. The API validates, then calls Brevo **double opt-in**
   (`/v3/contacts/doubleOptinConfirmation`) with the matching list ids and
   template `BREVO_DOI_TEMPLATE_ID`.
4. Brevo emails a confirmation link. The contact joins the lists **only after
   clicking it** (GDPR, prevents signing someone up without consent).
5. Brevo redirects to `/inscription-confirmee` **on the same origin** as the
   form (prod → prod, staging → staging).

The contact gets attribute `SOURCE=landing`.

## API contract

| Case                                                         | Status | Body                           |
| ------------------------------------------------------------ | ------ | ------------------------------ |
| Success                                                      | 200    | `{ ok: true }`                 |
| Local dry run (no `BREVO_API_KEY`)                           | 200    | `{ ok: true, dryRun: true }`   |
| Honeypot filled                                              | 200    | `{ ok: true }` (nothing saved) |
| Invalid JSON / email / no list / too fast / Turnstile failed | 400    | `{ error }` (French)           |
| Missing config online                                        | 500    | `{ error }`                    |
| Brevo refused                                                | 502    | `{ error }`                    |
| Brevo unreachable                                            | 500    | `{ error }`                    |

`wantsLaunch` / `wantsBeta` must be real booleans (`true`).

## Configuration

`BREVO_API_KEY`, `BREVO_LIST_ID_LAUNCH`, `BREVO_LIST_ID_BETA`,
`BREVO_DOI_TEMPLATE_ID` — see [brevo.md](../integrations/brevo.md).

## Tests

`app/api/subscribe/route.test.ts`, `components/newsletter/SignupForm.test.tsx`.
