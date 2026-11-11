// The alert the Laboon API sends to the team for each new report (api#334, email `report_alert`): a listmonk
// "transactional" template, read by the team only, so plain and in French only. The API sends the category code and the
// id of the report, nothing else (never the description, a name or the people's ids), plus `subjectPrefix`
// (`[STAGING] ` on staging, empty in production). listmonk escapes `{{ .Tx.Data.* }}` (Go html/template).
// See docs/features/emails.md.

import { LISTMONK } from "./syntax.ts";

/** The variables the API sends with `report_alert`, exactly. */
export const REPORT_ALERT_PARAMS = ["subjectPrefix", "category", "reportId"] as const;

type Param = (typeof REPORT_ALERT_PARAMS)[number];
const d = (param: Param) => LISTMONK.param(param);

/** Name of the template in listmonk (`<email>.<lang>`, like the API's other e-mails). */
export const REPORT_ALERT_NAME = "report_alert.fr";

/** Subject of the listmonk template: starts with the environment prefix, like every API e-mail. */
export const REPORT_ALERT_SUBJECT = `${d("subjectPrefix")}[Signalement Laboon] Nouveau signalement : ${d("category")}`;

/** emails/dist/listmonk/report-alert.html */
export const REPORT_ALERT_HTML = `<!doctype html>
<html lang="fr">
<body style="font-family:Arial,sans-serif;font-size:15px;line-height:1.5;color:#000873;">
<p>Un nouveau signalement a été enregistré dans Laboon. À traiter sous 48 h.</p>
<p><strong>Catégorie :</strong> ${d("category")}</p>
<p><strong>Identifiant :</strong> ${d("reportId")}</p>
<hr>
<p>Le détail (description, personne ou annonce signalée) est dans la base, table <code>reports</code>, à partir de cet identifiant. Il n’est jamais envoyé par email.</p>
</body>
</html>
`;
