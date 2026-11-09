// Writes the e-mails: emails/dist/listmonk/ (to put in listmonk) and public/emails/auth/<name>.html (loaded by the auth
// server, served by the site).
// Run: npm run emails

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { AUTH_EMAILS } from "./auth.ts";
import { CONTACT_MESSAGE_HTML } from "./contact.ts";
import { LISTMONK_EMAILS } from "./templates.ts";
import { LISTMONK_TRANSACTIONAL_EMAILS } from "./transactional.ts";

const DIST = new URL("./dist/", import.meta.url);
const LM_OUT = new URL("./dist/listmonk/", import.meta.url);
const LM_TX_OUT = new URL("./dist/listmonk/transactional/", import.meta.url);
const AUTH_OUT = new URL("../public/emails/auth/", import.meta.url);
for (const dir of [DIST, AUTH_OUT]) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
mkdirSync(LM_TX_OUT, { recursive: true });
for (const { file, html } of LISTMONK_TRANSACTIONAL_EMAILS)
  writeFileSync(new URL(file, LM_TX_OUT), html);
writeFileSync(
  new URL("subjects.md", LM_TX_OUT),
  [
    "| Template | Subject |",
    "|---|---|",
    ...LISTMONK_TRANSACTIONAL_EMAILS.map(
      (e) => `| ${e.name}.${e.locale} | ${e.subject} |`,
    ),
  ].join("\n") + "\n",
);
for (const { file, html } of LISTMONK_EMAILS) writeFileSync(new URL(file, LM_OUT), html);
writeFileSync(new URL("contact-message.html", LM_OUT), CONTACT_MESSAGE_HTML);
for (const { file, html } of AUTH_EMAILS) writeFileSync(new URL(file, AUTH_OUT), html);
console.log(
  [
    ...LISTMONK_EMAILS.map((e) => `emails/dist/listmonk/${e.file}`),
    "emails/dist/listmonk/contact-message.html",
    ...LISTMONK_TRANSACTIONAL_EMAILS.map(
      (e) => `emails/dist/listmonk/transactional/${e.file}`,
    ),
    ...AUTH_EMAILS.map((e) => `public/emails/auth/${e.file}`),
  ].join("\n"),
);
