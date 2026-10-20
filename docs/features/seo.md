# SEO

## Metadata

`app/layout.tsx` defines the default title, description, keywords, Open Graph
(`fr_FR`) and Twitter card, with `metadataBase = SITE_URL`. Pages override
`title` (and `description` when useful).

## Share image (Open Graph)

`app/opengraph-image.tsx` generates a 1200×630 PNG at build time from the
brand colours and the hero texts (`content/home.ts`) — used by Facebook,
Instagram, WhatsApp, X… It is a text-only placeholder until brand assets
(logo) exist; replace it with a designed visual then.

## robots.txt (`app/robots.ts` → `robotsFor()` in `lib/site.ts`)

- Production hosts (`www.laboon-app.com`, `laboon-app.com`): indexable,
  except `/api/`, `/legal/`, `/faq/embed`, `/reset-password`, `/confirm-email`, `/inscription-confirmee`;
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
