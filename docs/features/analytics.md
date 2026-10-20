# Analytics & conversion events

**Vercel Web Analytics** (`<Analytics />` from `@vercel/analytics/next` in
`app/[lang]/layout.tsx`).

- Cookieless, anonymous, aggregated → no consent banner required.
- Dashboard: Vercel → project → _Analytics_ (enable it per project).
- Page views work on every plan.

## Conversion funnel (custom events)

Sent with `trackEvent()` (`lib/analytics.ts`, the only place event names are
defined):

| Event              | Sent when                                                               | Properties                  |
| ------------------ | ----------------------------------------------------------------------- | --------------------------- |
| `signup_submitted` | Signup form accepted (confirmation email sent)                          | `launch`, `beta` (booleans) |
| `signup_confirmed` | Visitor lands on `/inscription-confirmee` after clicking the email link | —                           |
| `contact_sent`     | Contact message sent                                                    | `subject`                   |

Funnel: page views of `/` → `signup_submitted` → `signup_confirmed`.
No personal data is ever sent in events.

⚠️ **Custom events require the Vercel Pro plan.** On the free Hobby plan they
are silently ignored (page views still work). Until then, conversion can be
read from Brevo: list sizes = confirmed signups.

## Tests

Form tests assert the events (`SignupForm.test.tsx`, `ContactForm.test.tsx`);
`@vercel/analytics` is mocked globally in `tests/setup.ts`.
