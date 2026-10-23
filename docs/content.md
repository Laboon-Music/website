# Editing the website texts

The texts of the home page and the site-wide texts are kept in two plain
files, separate from the code, so they can be changed safely without
touching the layout.

| File                     | Contains                                                                                                 |
| ------------------------ | -------------------------------------------------------------------------------------------------------- |
| `content/<lang>/home.ts` | Home page: menu, hero, manifesto, values (cards), steps, final call to action, signup form, pause button |
| `content/<lang>/faq.ts`  | FAQ (website and mobile app): questions and answers, grouped by theme                                    |
| `content/<lang>/site.ts` | Browser tab title, Google description, text shown when the link is shared                                |

Other texts: forms (`components/newsletter/SignupForm.tsx`,
`components/contact/ContactForm.tsx`), contact subjects (`lib/contact.ts`),
legal documents (`components/legal/content/fr/`).

Every text exists in **French** (`content/fr/`) and **English** (`content/en/`): change both, with the
same structure (see [i18n.md](features/i18n.md)). Interface texts (header, footer, forms, error messages,
account pages) are in `content/<lang>/ui.ts`.

In `content/<lang>/faq.ts`, a link inside an answer is written `[label](address)`
(internal path like `/contact`, `https://…` or `mailto:…`).

## How to change a text (without a developer)

1. On GitHub, open the file (e.g. `content/fr/home.ts` and `content/en/home.ts`) on the **`staging`** branch.
2. Click the ✏️ pencil (_Edit this file_).
3. Change **only the text between quotes** `"…"`. Keep the quotes, commas and
   brackets. An apostrophe inside the text is fine (`"c'est"`).
4. _Commit changes…_ → choose **"Create a new branch… and start a pull request"**
   → _Propose changes_ → _Create pull request_.
5. Wait for the CI check to turn green ✅ (it fails if something was broken),
   then merge. The staging site updates in ~1 minute; check it on your phone.
6. Release to production as usual ([deployment.md](deployment.md#release-workflow)).

## Rules

- French: informal "tu", inclusive writing as already used ("prévenu·e"). English: friendly, informal, "you".
- Keep titles short: they must fit on a phone screen.
- The share image (`app/[lang]/opengraph-image.tsx`) reuses the hero title and subtitle of each language.
