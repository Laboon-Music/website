# Newsletter signup (launch & beta lists)

The core feature: collect emails of people who want to be notified of the
launch and/or test the beta.

## After the form

Once the API accepts the signup, the visitor is sent to **`/inscription-envoyee`** (`/en/inscription-envoyee`): a page of its own "check your inbox" with a back-to-home button (no home animation). The page after the click in the e-mail is `/inscription-confirmee`. Both are `noindex`.

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
3. The API validates, then creates the subscriber in listmonk
   (`POST /api/subscribers`) on the matching **double opt-in** lists, with
   `preconfirm_subscriptions: false`.
4. listmonk emails a confirmation link (system template, from
   `emails/dist/listmonk/subscriber-optin.html`). The subscription stays
   _unconfirmed_ **until the link is clicked** (GDPR, prevents signing someone
   up without consent); campaigns only reach confirmed subscriptions.
5. The click lands on listmonk's confirmation page (`lists.laboon-app.com`):
   listmonk does not redirect to the site, so `/inscription-confirmee` (and the
   `signup_confirmed` event) is not reached any more.

Already in listmonk (other list, app account, second try): listmonk answers 409,
the API reads the UUIDs of the lists (`GET /api/lists/{id}`) and calls the
public `POST /api/public/subscription`, which adds the lists, keeps the
attributes and sends the confirmation again.

The subscriber gets attributes `language` (`fr` / `en`, picks the language of
the confirmation e-mail) and `source: "landing"`.

## API contract

| Case                                                         | Status | Body                           |
| ------------------------------------------------------------ | ------ | ------------------------------ |
| Success                                                      | 200    | `{ ok: true }`                 |
| Local dry run (no `LISTMONK_API_TOKEN`)                      | 200    | `{ ok: true, dryRun: true }`   |
| Honeypot filled                                              | 200    | `{ ok: true }` (nothing saved) |
| Invalid JSON / email / no list / too fast / Turnstile failed | 400    | `{ error }` (French)           |
| Missing config online                                        | 500    | `{ error }`                    |
| listmonk refused                                             | 502    | `{ error }`                    |
| listmonk unreachable                                         | 500    | `{ error }`                    |

`wantsLaunch` / `wantsBeta` must be real booleans (`true`).

## Configuration

`LISTMONK_URL`, `LISTMONK_API_USER`, `LISTMONK_API_TOKEN`,
`LISTMONK_LIST_ID_LAUNCH`, `LISTMONK_LIST_ID_BETA` — see [listmonk.md](../integrations/listmonk.md).

## Tests

`app/api/subscribe/route.test.ts`, `components/newsletter/SignupForm.test.tsx`, `lib/listmonk.test.ts`.
