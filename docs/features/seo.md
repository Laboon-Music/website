# SEO

## Metadata

`app/[lang]/layout.tsx` defines the default title, description, keywords, Open Graph
(`fr_FR`) and Twitter card, with `metadataBase = SITE_URL`. Pages override
`title` (and `description` when useful).

## Share image (Open Graph)

`app/[lang]/opengraph-image.tsx` generates a 1200×630 PNG at build time: the blue Laboon logo
(`public/brand/wordmark.svg`) centred on white, same image in both languages — used by Facebook,
Instagram, WhatsApp, Discord, X… The tags point to `SITE_URL` (production): on staging a link
preview stays empty until the site is released to production.

## robots.txt (`app/robots.ts` → `robotsFor()` in `lib/site.ts`)

- Production hosts (`www.laboon-app.com`, `laboon-app.com`): indexable,
  except `/api/`, `/legal/`, `/faq/embed`, `/reset-password`, `/confirm-email`, `/inscription-confirmee`, `/inscription-envoyee`;
  points to the sitemap.
- Any other host (staging, `*.vercel.app`, localhost): `Disallow: /` to avoid
  duplicate content.

## sitemap.xml (`app/sitemap.ts`)

`/`, `/contact` and every legal document (derived from the legal registry).
**Add every new public page here.**

## Search Console

Domain property `laboon-app.com` verified by DNS TXT — steps in
[deployment.md](../deployment.md#google-search-console).

## Tests

`lib/site.test.ts`, `app/sitemap.test.ts`.
