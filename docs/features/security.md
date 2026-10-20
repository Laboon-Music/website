# Security

## Headers (`next.config.ts`, every response)

| Header                                | Value / role                                                                                            |
| ------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| `X-Content-Type-Options`              | `nosniff`                                                                                               |
| `Referrer-Policy`                     | `strict-origin-when-cross-origin` (account links carry one-time codes: only the origin leaves the site) |
| `X-Frame-Options`                     | `SAMEORIGIN` (also `frame-ancestors 'self'` in the CSP)                                                 |
| `Permissions-Policy`                  | camera, microphone, geolocation off                                                                     |
| `Strict-Transport-Security`           | 1 year, subdomains (no `preload`: that is a commitment to decide separately)                            |
| `Cross-Origin-Opener-Policy`          | `same-origin`                                                                                           |
| `Content-Security-Policy-Report-Only` | production only, see below                                                                              |

## Content-Security-Policy: report-only first

The policy (`contentSecurityPolicy()`) allows only the site itself, Cloudflare Turnstile
(script + frame + connect), Vercel analytics and the Laboon API origin (`NEXT_PUBLIC_API_URL`).
It is sent as **report-only**: nothing is blocked, violations appear in the browser console.

To enforce it:

1. Open staging with the console open: home, contact (type in a field to start Turnstile),
   password pages, in both languages. No "Content Security Policy" message = ready.
2. In `next.config.ts` rename `Content-Security-Policy-Report-Only` to `Content-Security-Policy`.
3. Redeploy staging, check again, then production.

`'unsafe-inline'` stays for scripts and styles: Next.js bootstrap scripts and the JSON-LD blocks
need it, and a nonce would make every page dynamic (slower, not cached). It still blocks every
external script, object and frame that is not listed.

## Data and abuse

- **Forms**: honeypot, minimum fill time and Turnstile (checked server-side) on signup and contact;
  JSON bodies larger than 64 KB are refused; e-mail addresses over 254 characters are refused;
  the contact name is kept on one line (it ends up in an e-mail subject); user text is HTML-escaped
  in the team e-mail.
- **Account pages** call the Laboon API directly; its rate limits protect them
  ([account-links.md](account-links.md#anti-bot)). The one-time code is removed from the address
  bar at once and **never sent to analytics** (`components/analytics/SiteAnalytics.tsx` strips
  query strings and hashes).
- **Structured data** is serialised with `<` escaped (`lib/json-ld.ts`).
- No cookies, no browser storage, no third-party fonts (see the privacy policy, section 7).
- Dependencies: `npm audit --omit=dev` is clean; Dependabot updates weekly.

## Known gaps

- No rate limiting on `/api/subscribe` and `/api/contact` (Vercel Firewall rule or Upstash,
  see [roadmap.md](../roadmap.md)).
- CSP not enforced yet (see above).
