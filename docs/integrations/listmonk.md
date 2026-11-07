# listmonk

[listmonk](https://listmonk.app/) is self-hosted (Coolify, `lists.laboon-app.com`, infra repo
[`docs/email.md`](https://github.com/Laboon-Music/infra/blob/main/docs/email.md)). It stores the newsletter contacts,
sends the double opt-in e-mail and the contact form message. One instance serves staging and production; each
environment has its own lists. It replaced Brevo on 2026-11-07 ([decisions](../decisions.md)).

## Usage in the code

`lib/listmonk.ts` — `listmonkCall(feature, path, { method, body, auth, expected })` (REST, no SDK, Basic auth
`LISTMONK_API_USER:LISTMONK_API_TOKEN`).

| Endpoint                        | Used by                                                                                      |
| ------------------------------- | -------------------------------------------------------------------------------------------- |
| `POST /api/subscribers`         | [newsletter signup](../features/newsletter-signup.md): new subscriber, opt-in e-mail sent    |
| `GET /api/lists/{id}`           | newsletter signup, existing subscriber: reads the UUID of a list                             |
| `POST /api/public/subscription` | newsletter signup, existing subscriber: adds the lists (no credentials)                      |
| `POST /api/tx`                  | [contact form](../features/contact-form.md): message to the team, template `contact-message` |

The website calls the **public** address (`https://lists.laboon-app.com`): Vercel is not on the Coolify network.

## Setup in listmonk (one-time)

Log in to `https://lists.laboon-app.com/admin` with your own account.

1. **Settings → General**: tick **Enable public subscription page** (needed by `/api/public/subscription`) and keep
   **Send opt-in confirmation** ticked. _Save_.
2. **Lists → New**, four times. Type **Public**, opt-in **Double**, tag `website`:

   | Name                       | Variable on Vercel        | Project    |
   | -------------------------- | ------------------------- | ---------- |
   | `Website — launch`         | `LISTMONK_LIST_ID_LAUNCH` | production |
   | `Website — beta`           | `LISTMONK_LIST_ID_BETA`   | production |
   | `Website staging — launch` | `LISTMONK_LIST_ID_LAUNCH` | staging    |
   | `Website staging — beta`   | `LISTMONK_LIST_ID_BETA`   | staging    |

   The ID is the number in the list's address (`/admin/lists/<id>`).

3. **Opt-in e-mail**: install `emails/dist/listmonk/subscriber-optin.html` as the system template
   `static/email-templates/subscriber-optin.html` on the server ([emails.md](../features/emails.md#put-it-in-listmonk)).
   It writes English, subject included, when the subscriber's `language` attribute is `en` (set by the site), French
   otherwise. The opt-in e-mail cannot be edited in the admin, and the language chosen in _Settings_ applies to the
   whole instance, not per subscriber: this file is what makes the e-mail follow the visitor's language. In Coolify, it
   lives in a volume of its own, `listmonk-templates` mounted on `/listmonk/static` (it survives redeploys and is not
   served publicly), written from the container's terminal at `/listmonk/static/email-templates/subscriber-optin.html`.
   The last `./listmonk` command of the compose ends with `--static-dir=/listmonk/static`. This one file is enough:
   listmonk overlays the folder file by file on its built-in templates (`initFS` in `cmd/init.go`, v6.2.0). The log
   then shows `loading static files from: /listmonk/static`. The volume is not backed up: after a server rebuild, write
   the file again (it is generated from this repository). After every `npm run emails` that changes it, write it again
   and restart listmonk (templates are read at start-up).
4. **Campaigns → Templates → New**, type **Transactional**, name `contact-message`:
   - Subject: `[Contact Laboon] {{ .Tx.Data.subject }} — {{ .Tx.Data.name }}`
   - Body: the content of `emails/dist/listmonk/contact-message.html`.
   - Save; its ID (in the list of templates) goes in `LISTMONK_CONTACT_TEMPLATE_ID`.
5. **Users → User roles → New** `website`: permissions `subscribers:manage` and `tx:send`. **List roles → New**
   `website-lists`: the four lists above, with **Get** and **Manage**.
6. **Users → New**, type **API**, name `laboon-website`, roles `website` + `website-lists`. Copy the token now (it
   is shown once) into the team password manager.

Never give this user `subscribers:get_all`, `subscribers:sql_query`, `lists:manage_all` or the settings: the token
lives on Vercel.

## Environment variables

| Variable                       | Prod                           | Staging                        |
| ------------------------------ | ------------------------------ | ------------------------------ |
| `LISTMONK_URL`                 | `https://lists.laboon-app.com` | `https://lists.laboon-app.com` |
| `LISTMONK_API_USER`            | `laboon-website`               | `laboon-website`               |
| `LISTMONK_API_TOKEN`           | token                          | token                          |
| `LISTMONK_LIST_ID_LAUNCH`      | prod launch list               | staging launch list            |
| `LISTMONK_LIST_ID_BETA`        | prod beta list                 | staging beta list              |
| `LISTMONK_CONTACT_TEMPLATE_ID` | `contact-message` template     | same                           |
| `CONTACT_TO_EMAIL`             | team inbox                     | team inbox                     |

## Things to know

- **Existing subscriber**: `POST /api/subscribers` answers 409. The site then goes through the public endpoint, which
  adds the lists, keeps the attributes and sends the opt-in again (people already on another list, app accounts,
  second try). That is why the lists are **public**: they also show on listmonk's own page
  `lists.laboon-app.com/subscription/form`.
- **After the click** in the opt-in e-mail, people land on listmonk's confirmation page, not on the site's
  `/inscription-confirmee` (listmonk does not redirect).
- **Sender**: listmonk's default one (`Laboon <noreply@send.laboon-app.com>`, through Scaleway TEM until SES).
- **Cloudflare Access**: the infra plan wants to put `/api/*` behind Cloudflare Access. On that day the site needs a
  service token (or a bypass for its calls), otherwise signups and contact messages fail (visible error + Sentry).

## Leaving Brevo

1. Brevo → _Contacts_ → filter on lists 5 and 6 (production) → _Export_ (CSV).
2. listmonk → _Subscribers → Import_: mode **Subscribe**, subscription status **Confirmed** (they already confirmed in
   Brevo), lists `Website — launch` / `Website — beta` (one import per list).
3. Once signups and contact messages work in production, cancel Brevo (the infra repo removes its DKIM).
