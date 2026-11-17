# Legal documents

Five documents, in French: CGU, CGV, Charte de bonne conduite, Politique de
confidentialité, Mentions légales.

## Two ways to display the same content

| Route                                                              | For                   | Chrome                           | Indexed        |
| ------------------------------------------------------------------ | --------------------- | -------------------------------- | -------------- |
| `/cgu`, `/cgv`, `/charte`, `/confidentialite`, `/mentions-legales` | Website visitors      | `PageShell` + back link + footer | yes            |
| `/legal/<slug>?lang=<locale>`                                      | Mobile app WebView    | none (bare article)              | no (`noindex`) |
| `/legal/<slug>/<version>?lang=<locale>`                            | Mobile app legal gate | none (bare article)              | no (`noindex`) |

## Code

- `components/legal/registry.ts` — single source of truth: slug → title +
  component, per locale. Slugs must match `legal_document.slug` in the app's
  Supabase database.
- `components/legal/content/fr/*.tsx` — document bodies, built from
  `components/legal/_shared.tsx` blocks (`DocHeader`, `Section`, `List`, `TodoNote`…).
- `components/legal/LegalPage.tsx` — `LegalPage` + `legalMetadata(slug)` used
  by each public route (2-line page files).
- `app/[lang]/legal/[slug]/page.tsx` — embed route, statically generated for every slug.

## Frozen versions (from the API)

`app/[lang]/legal/[slug]/[version]/page.tsx` serves one exact version of a document, read on the server from
`GET /v1/legal/documents/{slug}?locale=&version=` (`lib/legal-api.ts`, `fetchLegalVersion`). The app shows this URL at its
legal gate: the user accepts exactly the text they read, so the text of a version never changes under them.
Same page as the embed (bare `<main>`, no chrome, `noindex`): `DocHeader` (title, version, ISO effective date written for the
language) then `LegalMarkdown`. The language is the one asked (`?lang=`, rewritten to `/en/…` by `proxy.ts`, tested), else the
one the API resolved (asked, then French, then the first available); the header and `<main lang>` follow the resolved one.

- **Any slug the API knows works**, not only `LEGAL_SLUGS`. The parent `[slug]/page.tsx` keeps its own
  `generateStaticParams` + `dynamicParams = false`: those settings belong to that page file and do not constrain the child page.
- **ISR, no API call at build**: `generateStaticParams` returns `[]` (without it Next renders on every request), `revalidate = 300`,
  and the API read uses `next: { revalidate: 300 }`. 300 s is the shortest `max-age` the API sends (scheduled version, which may
  be cancelled); a version in force or replaced never changes. A 404 is cached the same time.
- **Server-side**: `NEXT_PUBLIC_API_URL` and, on staging, `NEXT_PUBLIC_API_STAGING_KEY` (`X-Laboon-Staging`), through the helpers of
  `lib/api.ts`. The key is never rendered nor put in an error.

| Case                                                                                                                                   | Result                                                  |
| -------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------- |
| Unknown slug, unknown version, **draft** (the API answers the same 404), malformed `version`/`slug` (checked before any call; API 422) | 404 (`notFound()`)                                      |
| API down, not configured, 5xx, timeout (8 s), invalid body                                                                             | `reportError("legal", …)` then **HTTP 500**, not cached |

The error carries a fixed message (no URL, key or response body); `reportError` only gets the slug, the version and the status.
The app's viewer relies on an HTTP status >= 400 to show its error and "Réessayer": the page never answers 200 with an empty body.
Tests: `lib/legal-api.test.ts`, `app/[lang]/legal/[slug]/[version]/page.test.tsx`, `proxy.test.ts`.

## Markdown rendering

The legal texts are published as Markdown by the Laboon API. `components/legal/LegalMarkdown.tsx`
renders one with the same blocks as the TSX documents (it is a server component, no client JS):
`<LegalMarkdown markdown={bodyMd} />` returns the intro, then one `DocBody` with a `Section` per `##`.
The frozen-version route above reads it from the API; the public pages and the unversioned embed still use the TSX documents.

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

All documents show the official contact address `CONTACT_EMAIL`
(`lib/site.ts`, currently `laboon.app@gmail.com`) — never a hard-coded
address. Changing it there updates every document; a test fails if another
address appears in a legal document.

## Languages

French (`content/fr`) and English (`content/en`). The public website pages are
French only; the app WebView picks the language with `?lang=en`. Add a
language: create `content/<locale>/*.tsx` and register it in `LEGAL_CONTENT`.
Unknown/missing locales fall back to French. `DocHeader` takes a `locale` prop
for its "Version … — effective from …" line.

## Versions

Every document shows a version and an effective date (`*_META` in each
component). **Bump both in the French and English file whenever the text
changes** — the app's "documents updated" popup is driven by the version
published in `legal_document` (Supabase). Versions are **integers**, matching the integer `version` column of
`legal_document`. Current: the privacy policy is version 3 (20/10/2026: cookies section corrected, no banner); the other documents are version 2, 12/10/2026.

## Content status

No placeholders remain. `TodoNote` (in `_shared.tsx`) is still available to flag
unfinished passages in a future draft.

## Add a document

1. Add `content/fr/<Name>.tsx`, register it in `registry.ts` (slug type + `FR`).
2. Create `app/<slug>/page.tsx` (copy an existing 2-line page).
3. Sitemap picks it up automatically (`LEGAL_SLUGS`).

## Tests

`components/legal/registry.test.ts`, `components/legal/LegalMarkdown.test.tsx`, `components/legal/_shared.test.tsx`, `app/sitemap.test.ts`.
