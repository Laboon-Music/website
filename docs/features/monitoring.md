# Monitoring & alerting

Collecting emails is the whole point of the site: a broken signup must be
noticed within minutes, not weeks. Server failures are reported to
**Sentry**, which emails the team.

## What is reported

Everything goes through `reportError(feature, message, context, error?)`
(`lib/monitoring.ts`), which logs to the Vercel logs **and** sends to Sentry:

| Feature tag | When                                                                   |
| ----------- | ---------------------------------------------------------------------- |
| `subscribe` | listmonk not configured online, listmonk refused, listmonk unreachable |
| `contact`   | same, for the contact form                                             |
| `turnstile` | Cloudflare verification endpoint unreachable                           |

Plus every unhandled server error (`onRequestError` in `instrumentation.ts`).
Validation errors (bad email, too fast…) are visitor mistakes, not reported.

## Privacy (GDPR)

Sentry is configured to collect **no personal data**: no request bodies
(they contain emails, names, messages), headers, cookies, query strings, user
info or stack variables. Only what `reportError` passes explicitly is sent,
and callers must never pass personal data (listmonk paths and statuses, never its messages, and
names of missing variables only). Server-side only: no Sentry script is
loaded in visitors' browsers.

## Missing configuration at start-up

In production, `initMonitoring()` logs one warning per feature with missing
environment variables (`[env] contact form: missing CONTACT_TO_EMAIL`) — see
the Vercel logs after a deploy. The list lives in `FEATURE_ENV` (`lib/env.ts`).

## Setup (one-time, manual) — see [deployment.md](../deployment.md#error-monitoring--sentry)

Without `SENTRY_DSN`, errors are only logged (nothing breaks).

## Tests

`lib/monitoring.test.ts`, `lib/env.test.ts`, `lib/listmonk.test.ts`.
