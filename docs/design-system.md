# Design system

All UI is built from a small set of shared pieces. **Never re-style a button,
input, card or page frame by hand** — use (or extend) the components below so
the whole site stays consistent.

## Tokens (`app/globals.css`)

One brand theme (no dark/light switch). Tailwind v4 `@theme` variables:

| Token               | Value                 | Use                                               |
| ------------------- | --------------------- | ------------------------------------------------- |
| `bg`                | `#161a8f` deep blue   | Page background (gradient to `bg-soft` `#0f127a`) |
| `surface`           | `#4753ff` Laboon blue | Panels (`Card`), open FAQ row                     |
| `text`              | `#ffffff`             | Text on the page and on panels                    |
| `muted`             | `#edeeff`             | Secondary text (≥ 4.6:1 on blue)                  |
| `ink`               | `#000873` navy        | Text on white (inputs, buttons, header pill)      |
| `ink-soft`          | `#3d449e`             | Secondary text on white / paper (8:1)             |
| `paper`, `mist`     | `#f5f5ff`, `#d2d5ff`  | Light home sections, lede under titles            |
| `error`, `error-bg` | `#b93815`, `#fff1ec`  | Error pill (5.2:1)                                |
| `success`           | `#5ce08e`             | Satisfied rule, tick                              |

Fonts: `font-sans` Bricolage Grotesque (text), `font-title` Sora (titles).
Layout vars: `--pill-h` (header height), `--gutter` (side padding, follows the
header pill on phones), `--focus` (focus ring colour).

## UI primitives — `@/components/ui`

| Component                               | Purpose                     | Notes                                                                                                                                                                                                                                                                                                      |
| --------------------------------------- | --------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Button`, `ButtonLink`, `buttonClass()` | Actions / navigation        | `variant="primary"` (blue + white outline, default), `"outline"`, `"text"` (white pill); styles in `app/ui.css`                                                                                                                                                                                            |
| `Button loading`                        | Spinner state               | `loading` + `loadingLabel`: a spinner replaces the label, the button keeps its size, stays fully readable and is announced ("Envoi…"); use it for every submit                                                                                                                                             |
| `Card`                                  | Solid blue panel            | `tone="success"` centres a confirmation                                                                                                                                                                                                                                                                    |
| `Disclosure`                            | FAQ row                     | Native `<details>`, works without JS                                                                                                                                                                                                                                                                       |
| `Field`, `Input`, `Textarea`, `Select`  | Form controls               | White pills; `Input joined` glues to a button; `aria-invalid` turns the border red-orange and shows a "!" inside (same shape as a normal field, no glow); `Field error=…` shows the message right under the field; in the joined e-mail + button the whole pill outline, button included, turns red-orange |
| `PasswordInput`                         | Password + show/hide        | Needs an `id` and a `<label htmlFor>`                                                                                                                                                                                                                                                                      |
| `Checkbox`                              | Labelled checkbox           | Custom white tick (`.check-input`)                                                                                                                                                                                                                                                                         |
| `FormError`                             | Error pill (`role="alert"`) | `id` to link it with `aria-describedby`                                                                                                                                                                                                                                                                    |
| `Honeypot`                              | Anti-bot trap               | Mandatory in every public form                                                                                                                                                                                                                                                                             |
| `TextLink`                              | Link in text                | Underlined, bold, inherits the text colour                                                                                                                                                                                                                                                                 |
| `PageTitle`, `Lede`, `BackLink`         | Inner page heading          | One `<h1>` per page                                                                                                                                                                                                                                                                                        |

## Layout — `@/components/layout`

| Component    | Purpose                                                                                                                                            |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PageShell`  | Frame of every inner page: skip link, wave disc, floating header, `<main id="contenu">` (gutter + rhythm), footer. Pages only set their own width. |
| `SiteHeader` | White pill: wordmark + "M'inscrire"                                                                                                                |
| `SiteFooter` | Wordmark, 3 link columns (socials from `SOCIALS`), © year; optional children                                                                       |
| `BackToTop`  | Round "back to top" button                                                                                                                         | Phones and tablets only (`md:hidden`), appears after one screen of scroll; mounted once in `app/[lang]/layout.tsx` |
| `Wordmark`   | Brand wordmark (`white` for dark backgrounds)                                                                                                      |

The home page does not use `PageShell`: see [features/home-scene.md](features/home-scene.md).

## Forms

Every public form uses `useProtectedForm(endpoint)` (`hooks/`), which handles
the submit lifecycle (`idle → loading → success | error`), French error
messages from the API, and the anti-bot fields. A form only declares its own
fields and calls `form.submit({...})`. Forms use `noValidate` so that errors
come from our French API messages, not the browser's language.

## Responsive rules

The site **must work on mobile and desktop** (see [conventions.md](conventions.md#responsive)):

- **Mobile-first**: base classes target phones (~360–430 px); add `sm:` /
  `md:` / `lg:` for larger screens.
- Horizontal page padding: `px-4 sm:px-6`. Content width: `max-w-6xl`
  (pages), `max-w-2xl`/`max-w-3xl` (text), `max-w-md` (single card).
- Stack on mobile, go side by side from `sm:`/`md:` (`flex-col sm:flex-row`,
  `grid sm:grid-cols-2 lg:grid-cols-4`).
- Font size of inputs ≥ 16 px (`text-base`) to avoid iOS zoom on focus.
- Tap targets ≥ 40 px; no hover-only interactions.
- **No horizontal scroll** at 375 px: long words/emails use `break-words`.
- Check every UI change at **375 px** and **≥ 1280 px** before merging.

## Accessibility rules

Target: **Lighthouse accessibility 100** on every page (mobile).

- One `<h1>` per page; headings in order. Decorative emojis/icons get
  `aria-hidden="true"`; icon-only links get an `aria-label`.
- Every control has an accessible name (`Field` label or `aria-label`).
- Text contrast ≥ 4.5:1 — use the tokens; white text only on `bg` / `surface`, navy on white.
- Links inside text use `TextLink` (underlined).
- Errors use `FormError` (`role="alert"`, announced by screen readers).
- Animations / smooth scroll are disabled when the OS asks for reduced
  motion (`prefers-reduced-motion` in `globals.css`); don't add motion that
  bypasses it.
- Audit: `npx lighthouse <url> --only-categories=accessibility` against
  `npm run build && npm start` (preview config `laboon-prod`, port 3001).

## Adding a component

1. Generic and reusable → `components/ui/` (export it from `index.ts`).
   Page chrome → `components/layout/`. Feature-specific → `components/<feature>/`.
2. Accept `className` and spread native props so it composes.
3. Add a test (`*.test.tsx` next to it) and a row in this page.
