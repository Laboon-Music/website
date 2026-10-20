# Deep links (iOS Universal Links / Android App Links)

The site serves the association files that let the OS open the Laboon app
instead of the browser for selected URLs (today: `/reset-password`; `/confirm-email` is not registered yet).

| File                        | Route                                                 |
| --------------------------- | ----------------------------------------------------- |
| Apple App Site Association  | `app/.well-known/apple-app-site-association/route.ts` |
| Android Digital Asset Links | `app/.well-known/assetlinks.json/route.ts`            |

Both are static JSON (`force-static`, CDN-cached). Canonical copies live in
the app repo (`Laboon/docs/deeplinks/`) — **keep both in sync**.

App ids: `com.laboon.app` (prod), `com.laboon.app.staging` (staging).

Apple Team ID: `4UD73H55CM` (appIDs are `<TeamID>.<BundleID>`).

## Pending (ticket APP-19)

- Android release SHA-256 fingerprints for prod and staging (placeholders
  `REPLACE_WITH_…`). Only the staging debug key is set.

## Tests

`app/.well-known/deeplinks.test.ts`.
