// The message a user sends to the team from the app, "Signaler un problème" (api#362, email `support_report`): a
// listmonk "transactional" template, read by the team only, so plain and in French only. The API sends the category
// code, the user's message, the technical context (`—` when the app did not send it) and the account id, never the
// user's e-mail, location or conversations, plus `subjectPrefix` (`[STAGING] ` on staging, empty in production).
// listmonk escapes `{{ .Tx.Data.* }}` (Go html/template); the API also defangs links (`https[:]//evil[.]com`).
// See docs/features/emails.md.

import { LISTMONK } from "./syntax.ts";

/** The variables the API sends with `support_report`, exactly. */
export const SUPPORT_REPORT_PARAMS = [
  "subjectPrefix",
  "category",
  "message",
  "accountId",
  "appVersion",
  "platform",
  "osVersion",
  "deviceModel",
  "locale",
  "environment",
] as const;

type Param = (typeof SUPPORT_REPORT_PARAMS)[number];
const d = (param: Param) => LISTMONK.param(param);

/** Name of the template in listmonk (`<email>.<lang>`, like the API's other e-mails). */
export const SUPPORT_REPORT_NAME = "support_report.fr";

/** Subject of the listmonk template: starts with the environment prefix, like every API e-mail. */
export const SUPPORT_REPORT_SUBJECT = `${d("subjectPrefix")}[Support Laboon] Nouveau message : ${d("category")}`;

const row = (label: string, param: Param) =>
  `<tr><td style="padding:2px 12px 2px 0;"><strong>${label}</strong></td><td>${d(param)}</td></tr>`;

/** emails/dist/listmonk/support-report.html */
export const SUPPORT_REPORT_HTML = `<!doctype html>
<html lang="fr">
<body style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#000873;">
<p>Un utilisateur a envoyé un message depuis l’app (Profil &gt; Aide &gt; Signaler un problème).</p>
<p><strong>Catégorie :</strong> ${d("category")}</p>
<p><strong>Message :</strong></p>
<div style="white-space:pre-wrap;border-left:3px solid #000873;padding:4px 12px;">${d("message")}</div>
<p><strong>Informations techniques</strong></p>
<table style="font-size:14px;border-collapse:collapse;">
${row("Version de l’app", "appVersion")}
${row("Plateforme", "platform")}
${row("Version de l’OS", "osVersion")}
${row("Appareil", "deviceModel")}
${row("Langue", "locale")}
${row("Environnement", "environment")}
${row("Compte", "accountId")}
</table>
<hr>
<p>L’adresse e-mail de l’utilisateur n’est jamais envoyée : pour lui répondre, retrouve le compte à partir de son identifiant. Les liens du message sont désactivés (<code>[:]//</code>, <code>[.]</code>).</p>
</body>
</html>
`;
