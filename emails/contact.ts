// The contact form message sent to the team (POST /api/contact): a listmonk "transactional" template, read by the team
// only, so plain and in French. listmonk escapes `{{ .Tx.Data.* }}` (Go html/template): the visitor's text shows as
// text. The subject is part of the template, so nothing the visitor typed is ever parsed as a template.
// See docs/features/contact-form.md.

import { CONTACT_EMAIL_FIELDS } from "../lib/contact.ts";

type Field = (typeof CONTACT_EMAIL_FIELDS)[number];
const d = (field: Field) => `{{ .Tx.Data.${field} }}`;

/** Subject of the listmonk template. */
export const CONTACT_MESSAGE_SUBJECT = `[Contact Laboon] ${d("subject")} — ${d("name")}`;

/** emails/dist/listmonk/contact-message.html */
export const CONTACT_MESSAGE_HTML = `<!doctype html>
<html lang="fr">
<body style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#000873;">
<p><strong>Nom :</strong> ${d("name")}</p>
<p><strong>Email :</strong> ${d("email")}</p>
<p><strong>Sujet :</strong> ${d("subject")}</p>
<p><strong>Langue :</strong> ${d("locale")}</p>
<hr>
<p style="white-space:pre-wrap;">${d("message")}</p>
</body>
</html>
`;
