# Legal documents

Four documents, published in French and English from the back office and **read from the Laboon API**: CGU, Charte de
bonne conduite, Politique de confidentialité, Mentions légales. The site holds no copy of the texts (the terms of sale,
CGV, are out of V1).

## Routes

| Route                                                      | For                   | Chrome                           | Indexed        |
| ---------------------------------------------------------- | --------------------- | -------------------------------- | -------------- |
| `/cgu`, `/charte`, `/confidentialite`, `/mentions-legales` | Website visitors      | `PageShell` + back link + footer | yes            |
| `/legal/<slug>?lang=<locale>` (any slug the API knows)     | Mobile app WebView    | none (bare article)              | no (`noindex`) |
| `/legal/<slug>/<version>?lang=<locale>`                    | Mobile app legal gate | none (bare article)              | no (`noindex`) |

The first two show the **version in force** (`GET /v1/legal/documents/{slug}?locale=`); the last one a frozen version.
All render `DocHeader` (title, version, ISO effective date written for the language) then `LegalMarkdown`. The language
is the one asked (`/en/…`, or `?lang=` rewritten by `proxy.ts`), else the one the API resolved (asked, then French, then
the first available); the header and `lang` follow the resolved one. The title of the browser tab is the API's title.

## Code

- `lib/legal-api.ts` — `fetchLegalInForce(slug, locale)` and `fetchLegalVersion(slug, locale, version)` (same contract).
- `lib/legal-slugs.ts` — `LEGAL_SLUGS`, the four public pages (sitemap).
- `app/[lang]/[document]/page.tsx` — public pages (the slug is a dynamic segment, see below).
- `app/[lang]/legal/[slug]/page.tsx`, `…/[version]/page.tsx` — embeds.
- `components/legal/LegalPage.tsx` — loading, metadata, page and embed wrappers; `LegalArticle.tsx` — header + text;
  `LegalMarkdown.tsx`, `_shared.tsx` — rendering blocks.

## Cache, API down, build

- **Cached 5 minutes (ISR)**: every page exports `revalidate = 300` and the API read uses `next: { revalidate: 300 }`
  (300 s is the API's `Cache-Control: max-age`). The API computes the version in force **at read time** (Paris date), so a
  published version shows within 5 minutes and a scheduled one within 5 minutes after its effective date, **without any
  deployment**.
- **The build never calls the API.** `generateStaticParams` returns `[]` on every legal page, so nothing is rendered at
  build; the first request renders the page, then it is cached. That is why the public pages are one dynamic segment
  (`app/[lang]/[document]`) and not one folder per document: with static folders under `[lang]` Next prerenders them at build
  anyway. Static routes (`/contact`…) win over the segment; a slug outside `LEGAL_SLUGS` (`/cgv` included) is a 404 without
  calling the API. Proof: `NEXT_PUBLIC_API_URL=http://127.0.0.1:9 npm run build` succeeds.
- **API down, the last valid page stays.** A failing revalidation throws (never renders an error page), so Next keeps
  serving the previous page. Checked by hand: after a page was served, the API stopped, the page stayed served (200,
  same text). A **first** request with the API down is an HTTP 500 (not cached, the next request retries), never a blank 200:
  the app's viewer relies on a status >= 400 to show its error and "Réessayer".
- **Server-side**: `NEXT_PUBLIC_API_URL` and, on staging, `NEXT_PUBLIC_API_STAGING_KEY` (`X-Laboon-Staging`), through the
  helpers of `lib/api.ts`. The key is never rendered nor put in an error.

| Case                                                                                                                            | Result                                                  |
| ------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Unknown slug, nothing in force, unknown version, **draft** (same API 404), malformed `version`/`slug` (checked before any call) | 404 (`notFound()`)                                      |
| API down, not configured, 5xx, timeout (8 s), invalid body                                                                      | `reportError("legal", …)` then **HTTP 500**, not cached |

The error carries a fixed message (no URL, key or response body); `reportError` only gets the slug, the version and the
status. Tests: `lib/legal-api.test.ts`, `app/[lang]/legal-pages.test.tsx`, `app/[lang]/legal/[slug]/[version]/page.test.tsx`,
`proxy.test.ts`, `app/sitemap.test.ts`.

## Publish or change a legal text

No developer needed, no deployment:

1. Open the back office and go to **Legal documents**.
2. Open the document (or create a new version of it) and write the text in French and in English (Markdown; anchors as
   `## Title {#anchor}`).
3. Save as a **draft**: a draft is never visible on the site.
4. **Publish** it. To make it effective on a given day, set an **effective date**; otherwise it is effective today.
5. The site shows it within **5 minutes** (immediately after the effective date for a scheduled version: within 5 minutes
   after that day starts, Paris time). Nothing to do on the site.
6. Check: open the page (`/cgu`, `/charte`, `/confidentialite`, `/mentions-legales`), the header shows the new version
   number and date.

If a page shows an error right after a change, wait 5 minutes and reload. If it persists, the API is the cause (see
Sentry, `legal`).

### Add a document

Publish it from the back office: `/legal/<slug>` works at once. For a public page with site chrome, add the slug to
`LEGAL_SLUGS` (`lib/legal-slugs.ts`, which also adds it to the sitemap) and a link where needed.

## Markdown rendering

The legal texts are published as Markdown by the Laboon API. `components/legal/LegalMarkdown.tsx`
renders one with the same blocks as the TSX documents (it is a server component, no client JS):
`<LegalMarkdown markdown={bodyMd} />` returns the intro, then one `DocBody` with a `Section` per `##`.
Every page below uses it: the site keeps no copy of any text.

| Markdown                      | Rendered as                                                                               |
| ----------------------------- | ----------------------------------------------------------------------------------------- |
| text before the first `##`    | intro paragraphs (same style as the TSX documents)                                        |
| `## Title {#id}`              | `Section` (`<section id="id"><h2>`); the id is reduced to `[a-z0-9-]`, no id when absent  |
| `### Title`                   | `Subheading`                                                                              |
| `-` / `1.` lists              | `List` (bullets) / `List ordered` (numbers)                                               |
| `**bold**`, `*italic*`        | `strong`, `em`                                                                            |
| `[text](https://…)`           | `TextLink`, new tab with `rel="noopener noreferrer"`                                      |
| `[text](mailto:…)`, `[t](#a)` | `TextLink`, same tab                                                                      |
| anything else                 | degrades to plain text: raw HTML and images are dropped, other links keep only their text |

The allowed syntax is enforced at publication by the API
(`app/legal/markdown_rules.ts` in the `api` repo); the renderer does not trust it and is safe on its own:
the Markdown is parsed to an mdast tree and every node is rendered by a whitelist, so nothing is ever
injected as HTML (no `dangerouslySetInnerHTML`). Forbidden cases are tested: HTML and `<script>` are dropped,
`javascript:`, `data:`, `http:` and reference-style links are not clickable.

`DocHeader` takes the version and the effective date as props. The date can be an ISO date (`YYYY-MM-DD`, as the API
sends it), written for the language (`22 octobre 2026` / `October 22, 2026`), or an already formatted text
(the TSX documents), shown as is.

Test fixtures: `components/legal/fixtures/*.md` are copies of real texts from the API repo, kept verbatim
(excluded from Prettier).

## Contact address

The contact address in the texts is whatever the back office text says; the site-wide address is `CONTACT_EMAIL`
(`lib/site.ts`).

## Anchors

`/confidentialite#suppression-compte` (and `/en/confidentialite#suppression-compte`) comes from the `{#suppression-compte}`
of the Markdown: it is linked from the app, so keep that anchor when editing the privacy policy (tested).
