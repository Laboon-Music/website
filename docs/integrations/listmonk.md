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

Labels in English, then French (the admin follows the instance language).

1. **Settings → General** (_Paramètres → Général_), then _Save_:
   - tick **Enable public subscription page** (_Activer la page d'abonnement publique_): needed by
     `/api/public/subscription`;
   - keep **Send opt-in confirmation** (_Envoyez une confirmation d'adhésion_) ticked: listmonk sends the opt-in e-mail
     as soon as the site creates the subscriber;
   - keep **Ask for double opt-in confirmation** (_Demander une confirmation double opt-in_) ticked: the link opens a
     page with a button instead of confirming at once, so mail scanners that open links do not confirm for people.
2. **Lists → New**, four times. Type **Public** (_Publique_), opt-in **Double** (_Opt-in double_), tag `website`:

   | Variable on Vercel        | Production project: ID of   | Staging project: ID of   |
   | ------------------------- | --------------------------- | ------------------------ |
   | `LISTMONK_LIST_ID_LAUNCH` | `website-production-launch` | `website-staging-launch` |
   | `LISTMONK_LIST_ID_BETA`   | `website-production-beta`   | `website-staging-beta`   |

   Two variables, each with a different value per Vercel project. The staging lists keep test addresses out of the
   real audience (one listmonk instance serves both environments). The ID is the number, not the UUID: open the
   list, it ends the address (`/admin/lists/<id>`). The site creates subscribers by list ID and reads the UUID itself
   when it needs it.

3. **Opt-in e-mail** (done on 2026-11-07): listmonk's opt-in is a system template, not editable in the admin, and its
   own text and subject come in the instance's single language. `emails/dist/listmonk/subscriber-optin.html` replaces
   it: English, subject included (`<title data-i18n>`), when the subscriber's `language` attribute is `en` (set by the
   site), French otherwise. In Coolify:
   - the compose mounts a volume of its own, `listmonk-templates:/listmonk/static` (survives redeploys, not served
     publicly), and the last `./listmonk` command ends with `--static-dir=/listmonk/static`;
   - the file is written from the service's terminal (Coolify → listmonk → _Terminal_):

     ```sh
     mkdir -p /listmonk/static/email-templates && cat > /listmonk/static/email-templates/subscriber-optin.html <<'LABOON_EOF'
     <paste the whole content of emails/dist/listmonk/subscriber-optin.html here>
     LABOON_EOF
     wc -c /listmonk/static/email-templates/subscriber-optin.html
     ```

     The size shown must match the file's (`13325` today); otherwise the paste was cut, run it again;

   - restart listmonk (it reads the templates at start-up): the log shows
     `loading static files from: /listmonk/static`.

   This one file is enough: listmonk overlays the folder file by file on its built-in templates (`initFS` in
   `cmd/init.go`, v6.2.0). Write it again and restart after every `npm run emails` that changes it, and after a
   server rebuild (the volume is not backed up). Test: subscribe from `/en` and from the French page, check language
   and subject.

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
   Brevo), lists `website-production-launch` / `-beta` (one import per list).
3. Once signups and contact messages work in production, cancel Brevo (the infra repo removes its DKIM).
