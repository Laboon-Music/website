# listmonk public pages theme

listmonk's own web pages get the look of the site's inner pages: night-blue page, Laboon-blue panel, white pill
fields and buttons, white wordmark, Sora / Bricolage Grotesque. Subscribers see them right after a click in an e-mail:

| Page                                   | Address on `lists.laboon-app.com`        |
| -------------------------------------- | ---------------------------------------- |
| Opt-in confirmation (double opt-in)    | `/subscription/optin/…` (link in e-mail) |
| Unsubscribe / manage preferences       | `/subscription/…` (link in e-mail)       |
| Subscription form, newsletter archive  | `/subscription/form`, `/archive`         |
| Admin login (same layout, same styles) | `/admin/login`                           |

The admin itself (after login) keeps listmonk's look: only the team sees it.

## Code

- `listmonk/public.css` — the theme, written by hand against listmonk v6.2.0's public markup (`.wrap`, `.header`,
  `.lists`, `.button`, `.button-outline`, `.unsub-all`, `.archive`, ALTCHA captcha). It loads after listmonk's
  `style.css` and overrides it.
- Colours are copies of the site's tokens (`app/globals.css`); `listmonk/public.test.ts` fails when one drifts.
  The button and checkbox mirror `.btn--text` / `.btn--reverted` and `.check-input` (`app/ui.css`).
- **Fonts** come from the production site: `public/fonts/*.woff2` (the latin subsets that `next/font` builds, SIL
  Open Font License), allowed to other origins by `next.config.ts` (`Access-Control-Allow-Origin: *` on `/fonts/*`).
  Nothing is requested from Google. Until the site is released to production, the pages use system fonts.
- **Logo**: `https://www.laboon-app.com/brand/email/wordmark-white.png`, the e-mails' white wordmark (the SVG
  wordmark renders blank in listmonk's `<img>`).

## Put it in listmonk

Log in to `https://lists.laboon-app.com/admin` (labels in English, then French).

1. **Settings → Appearance** (_Paramètres → Apparence_) → tab **Public** → paste the whole content of
   `listmonk/public.css` in **Custom CSS** → _Save_. listmonk reloads for a second or two.
2. **Settings → General** (_Paramètres → Général_):
   - **Logo URL** (_URL du logo_): `https://www.laboon-app.com/brand/email/wordmark-white.png`
   - **Favicon URL** (_URL du favicon_): `https://www.laboon-app.com/icon.png`
   - _Save_.
3. Check `https://lists.laboon-app.com/subscription/form` on a phone and a computer, then click an unsubscribe link
   of a test e-mail.

Paste the file again after every change to `listmonk/public.css`.

## Limits

- CSS only: listmonk's texts and page structure stay as they are. Changing them means overriding the HTML templates
  through `--static-dir` (`static/public/templates/`), like the opt-in e-mail ([listmonk](../integrations/listmonk.md)).
- The pages speak the instance language (French) for every subscriber, English ones included: listmonk has one
  language per instance.
- The subscription form lists every public list by its internal name (`website-staging-launch`…): the lists are
  public for the site's existing-subscriber path ([decisions](../decisions.md)). Give them a public description or a
  friendlier name in listmonk if this page is ever shared.
