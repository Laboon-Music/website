# Anti-bot protection

Applies to **every public form** (newsletter signup, contact). Three layers,
all invisible to humans.

| #   | Layer                                                                    | Client                                 | Server                                      | On failure                                                          |
| --- | ------------------------------------------------------------------------ | -------------------------------------- | ------------------------------------------- | ------------------------------------------------------------------- |
| 1   | **Honeypot** field `website`, off-screen, `tabIndex=-1`, `aria-hidden`   | `<Honeypot>`                           | `body.website` non-empty                    | Fake `200 { ok: true }`, nothing done (gives bots no hint)          |
| 2   | **Minimum delay**: submit < 3 s after display                            | `elapsedMs` sent by `useProtectedForm` | `isTooFast()`                               | `400` "un peu rapide, réessaie" (visible so a fast human can retry) |
| 3   | **Cloudflare Turnstile**, `interaction-only` (invisible unless in doubt) | `components/antibot/Turnstile.tsx`     | `verifyTurnstile()` → Cloudflare siteverify | `400` "vérification anti-robot a échoué"                            |

Server entry point: `checkAntibot(body, request)` in `lib/antibot.ts` — call
it right after parsing the body in any new form route. Client: use
`useProtectedForm()` (spread `form.formProps` on the `<form>`) +
`<Honeypot {...form.honeypot}>` + `<Turnstile {...form.turnstile}>`.

## Turnstile behaviour

- **Loaded on first interaction only**: the Cloudflare script and challenge
  start when the visitor focuses / touches a form. Readers who never touch a
  form load nothing, and the home page (two forms) runs a single challenge.
- **No "try again" for early clicks**: if the visitor submits before the token
  is ready, the submit waits for it (button shows the loading state), up to
  15 s, then shows "La vérification anti-robot n'a pas abouti…".
- Tokens are single-use: a new one is requested after each submit.

## Turnstile configuration

- `NEXT_PUBLIC_TURNSTILE_SITE_KEY` (public, baked into the build) and
  `TURNSTILE_SECRET_KEY` (server). Set **both** or neither.
- Not set → layer 3 is disabled; layers 1–2 still apply.
- Local testing keys (always pass): site `1x00000000000000000000AA`,
  secret `1x0000000000000000000000000000000AA`.
- Production only on Vercel: preview URLs (`*.vercel.app`) are not allowed
  by the widget. Setup steps: [deployment.md](../deployment.md#anti-bot--cloudflare-turnstile).
- Cloudflare unreachable → reported to Sentry ([monitoring.md](monitoring.md)).

## Tests

`lib/antibot.test.ts`, `hooks/useProtectedForm.test.tsx` (lazy start, wait
for token, timeout, single-use tokens), plus anti-bot cases in both route tests.

## Exception: account links

`/reset-password` and `/confirm-email` call the Laboon API directly and rely on its own rate limits: see [account-links.md](account-links.md#anti-bot).
