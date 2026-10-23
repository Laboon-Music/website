# Error pages

French, branded pages instead of Next.js' default English ones.

| File                       | Shown when                                                                               |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `app/[lang]/not-found.tsx` | Unknown URL (404) or `notFound()` — with footer and a "Back to home" (translated) button |
| `app/[lang]/error.tsx`     | An error while rendering a page — "Réessayer" (re-renders) or back home                  |
| `app/global-error.tsx`     | The root layout itself fails — minimal standalone page                                   |

Server-side errors are reported to Sentry ([monitoring.md](monitoring.md)).

## Tests

`app/[lang]/error-pages.test.tsx`.
