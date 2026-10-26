// Writes the e-mails: emails/dist/<name>.<lang>.html and emails/dist/transactional/ (paste them in Brevo),
// emails/dist/listmonk/ (the same e-mails for listmonk) and public/emails/auth/<name>.html (loaded by the auth server,
// served by the site).
// Run: npm run emails

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { AUTH_EMAILS } from "./auth.ts";
import { ALL_EMAILS, LISTMONK_EMAILS } from "./templates.ts";
import { LISTMONK_TRANSACTIONAL_EMAILS, TRANSACTIONAL_EMAILS } from "./transactional.ts";

const OUT = new URL("./dist/", import.meta.url);
const TX_OUT = new URL("./dist/transactional/", import.meta.url);
const LM_OUT = new URL("./dist/listmonk/", import.meta.url);
const LM_TX_OUT = new URL("./dist/listmonk/transactional/", import.meta.url);
const AUTH_OUT = new URL("../public/emails/auth/", import.meta.url);
for (const dir of [OUT, AUTH_OUT]) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
for (const { file, html } of ALL_EMAILS) writeFileSync(new URL(file, OUT), html);
for (const [dir, emails] of [
  [TX_OUT, TRANSACTIONAL_EMAILS],
  [LM_TX_OUT, LISTMONK_TRANSACTIONAL_EMAILS],
] as const) {
  mkdirSync(dir, { recursive: true });
  for (const { file, html } of emails) writeFileSync(new URL(file, dir), html);
  writeFileSync(
    new URL("subjects.md", dir),
    [
      "| Template | Subject |",
      "|---|---|",
      ...emails.map((e) => `| ${e.name}.${e.locale} | ${e.subject} |`),
    ].join("\n") + "\n",
  );
}
for (const { file, html } of LISTMONK_EMAILS) writeFileSync(new URL(file, LM_OUT), html);
for (const { file, html } of AUTH_EMAILS) writeFileSync(new URL(file, AUTH_OUT), html);
console.log(
  [
    ...ALL_EMAILS.map((e) => `emails/dist/${e.file}`),
    ...TRANSACTIONAL_EMAILS.map((e) => `emails/dist/transactional/${e.file}`),
    ...LISTMONK_EMAILS.map((e) => `emails/dist/listmonk/${e.file}`),
    ...LISTMONK_TRANSACTIONAL_EMAILS.map(
      (e) => `emails/dist/listmonk/transactional/${e.file}`,
    ),
    ...AUTH_EMAILS.map((e) => `public/emails/auth/${e.file}`),
  ].join("\n"),
);
