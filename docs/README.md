# Laboon website — documentation

Landing page of **Laboon**, a mobile app that connects musicians. The site's
job before launch is to **collect emails** (launch list + beta testers list),
and to host the app's companion pages (legal documents, password reset, deep
link association files).

> Docs are written in **English**; the website itself is in **French**.
> Keep these pages up to date in the same PR as the code they describe
> (see [conventions.md](conventions.md)).

## Start here

| Page                                 | What it covers                                        |
| ------------------------------------ | ----------------------------------------------------- |
| [product.md](product.md)             | Product vision, goals, audience, tone                 |
| [architecture.md](architecture.md)   | Stack, folder layout, request flows, environments     |
| [design-system.md](design-system.md) | Theme tokens, UI primitives, layout, responsive rules |
| [conventions.md](conventions.md)     | Language, code style, responsive, tests, git workflow |
| [content.md](content.md)             | How to edit the website texts (no code needed)        |
| [testing.md](testing.md)             | How to run and write unit tests                       |
| [deployment.md](deployment.md)       | Vercel, Brevo, DNS, Turnstile, Search Console setup   |
| [decisions.md](decisions.md)         | Architecture decision log                             |
| [roadmap.md](roadmap.md)             | Known gaps, TODOs and follow-ups                      |

## Features

| Feature                                             | Route(s)                                                                            | Doc                                                   |
| --------------------------------------------------- | ----------------------------------------------------------------------------------- | ----------------------------------------------------- |
| Languages (French / English)                        | all pages                                                                           | [i18n.md](features/i18n.md)                           |
| Home scene (animated landing)                       | `/`                                                                                 | [home-scene.md](features/home-scene.md)               |
| Newsletter signup (launch / beta, double opt-in)    | `/`, `/api/subscribe`, `/inscription-confirmee`                                     | [newsletter-signup.md](features/newsletter-signup.md) |
| FAQ (+ app WebView embed)                           | `/faq`, `/faq/embed`                                                                | [faq.md](features/faq.md)                             |
| Contact form (+ app WebView embed)                  | `/contact`, `/contact/embed`, `/api/contact`                                        | [contact-form.md](features/contact-form.md)           |
| Anti-bot protection                                 | both forms                                                                          | [antibot.md](features/antibot.md)                     |
| Social links (Instagram, Facebook)                  | footer, contact, confirmation                                                       | [social-links.md](features/social-links.md)           |
| Legal documents (+ app WebView embed)               | `/cgu`, `/cgv`, `/charte`, `/confidentialite`, `/mentions-legales`, `/legal/[slug]` | [legal-documents.md](features/legal-documents.md)     |
| Account links (password reset, e-mail confirmation) | `/reset-password`, `/confirm-email`                                                 | [account-links.md](features/account-links.md)         |
| Deep links (iOS / Android)                          | `/.well-known/*`                                                                    | [deep-links.md](features/deep-links.md)               |
| SEO (robots, sitemap, metadata)                     | `/robots.txt`, `/sitemap.xml`                                                       | [seo.md](features/seo.md)                             |
| Analytics & conversion events                       | all pages                                                                           | [analytics.md](features/analytics.md)                 |
| Monitoring & alerting (Sentry)                      | server                                                                              | [monitoring.md](features/monitoring.md)               |
| Error pages (404 / 500)                             | any                                                                                 | [error-pages.md](features/error-pages.md)             |

## Integrations

- [Brevo](integrations/brevo.md) — contact storage, double opt-in, transactional email
- Cloudflare Turnstile — see [antibot.md](features/antibot.md)
- Laboon API — see [account-links.md](features/account-links.md)
- Vercel — see [deployment.md](deployment.md)
- Sentry — see [monitoring.md](features/monitoring.md)
