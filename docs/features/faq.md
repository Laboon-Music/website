# FAQ

Frequently asked questions, in French, shown on the website **and** in the
mobile app.

## Routes (English: `/en#faq`, `/faq/embed?lang=en`)

| Route        | For                | Chrome                  | Indexed        |
| ------------ | ------------------ | ----------------------- | -------------- |
| `/` (#faq)   | Website visitors   | Home page section       | yes            |
| `/faq`       | Old links          | 308 redirect to `/#faq` | —              |
| `/faq/embed` | Mobile app WebView | none (bare article)     | no (`noindex`) |

The footer links to `/#faq`. The app loads `https://www.laboon-app.com/faq/embed`.
In the embed, links stay on bare pages (`/contact` → `/contact/embed`, legal
pages → `/legal/<slug>`) and home anchors (`/#rejoindre`) are shown as plain
text: see `embedHref()`. Safe-area insets are respected (notch, home bar).

## Code

- `content/<lang>/faq.ts` — the texts: groups of question/answer. A link in an
  answer is `[label](address)`. The contact address comes from `CONTACT_EMAIL`.
- `components/faq/Faq.tsx` — the standalone article (embed); `FaqSection.tsx` — the home section (two columns); `FaqJsonLd.tsx` — schema.org data.
- `components/faq/RichText.tsx` — turns `[label](address)` into `TextLink`.
- `components/ui/Disclosure.tsx` — the expandable row (native `<details>`).
- `app/[lang]/faq/embed/page.tsx` — thin route; the `/faq` redirect is in `next.config.ts`.

## Tests

`components/faq/Faq.test.tsx`, `components/ui/ui.test.tsx`,
`app/sitemap.test.ts`, `lib/site.test.ts`.
