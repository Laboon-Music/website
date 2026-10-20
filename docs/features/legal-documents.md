# Legal documents

Five documents, in French: CGU, CGV, Charte de bonne conduite, Politique de
confidentialité, Mentions légales.

## Two ways to display the same content

| Route                                                              | For                | Chrome                           | Indexed        |
| ------------------------------------------------------------------ | ------------------ | -------------------------------- | -------------- |
| `/cgu`, `/cgv`, `/charte`, `/confidentialite`, `/mentions-legales` | Website visitors   | `PageShell` + back link + footer | yes            |
| `/legal/<slug>?lang=<locale>`                                      | Mobile app WebView | none (bare article)              | no (`noindex`) |

## Code

- `components/legal/registry.ts` — single source of truth: slug → title +
  component, per locale. Slugs must match `legal_document.slug` in the app's
  Supabase database.
- `components/legal/content/fr/*.tsx` — document bodies, built from
  `components/legal/_shared.tsx` blocks (`DocHeader`, `Section`, `List`, `TodoNote`…).
- `components/legal/LegalPage.tsx` — `LegalPage` + `legalMetadata(slug)` used
  by each public route (2-line page files).
- `app/legal/[slug]/page.tsx` — embed route, statically generated for every slug.

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

`components/legal/registry.test.ts`, `app/sitemap.test.ts`.
