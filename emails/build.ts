// Writes the e-mails: emails/dist/<name>.<lang>.html and emails/dist/transactional/ (paste them in Brevo) and public/emails/auth/<name>.html (loaded by
// the auth server, served by the site).
// Run: npm run emails

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { AUTH_EMAILS } from "./auth.ts";
import { ALL_EMAILS } from "./templates.ts";
import { TRANSACTIONAL_EMAILS } from "./transactional.ts";

const OUT = new URL("./dist/", import.meta.url);
const TX_OUT = new URL("./dist/transactional/", import.meta.url);
const AUTH_OUT = new URL("../public/emails/auth/", import.meta.url);
for (const dir of [OUT, AUTH_OUT]) {
  rmSync(dir, { recursive: true, force: true });
  mkdirSync(dir, { recursive: true });
}
for (const { file, html } of ALL_EMAILS) writeFileSync(new URL(file, OUT), html);
mkdirSync(TX_OUT, { recursive: true });
for (const { file, html } of TRANSACTIONAL_EMAILS)
  writeFileSync(new URL(file, TX_OUT), html);
writeFileSync(
  new URL("subjects.md", TX_OUT),
  [
    "| Template | Subject |",
    "|---|---|",
    ...TRANSACTIONAL_EMAILS.map((e) => `| ${e.name}.${e.locale} | ${e.subject} |`),
  ].join("\n") + "\n",
);
for (const { file, html } of AUTH_EMAILS) writeFileSync(new URL(file, AUTH_OUT), html);
console.log(
  [
    ...ALL_EMAILS.map((e) => `emails/dist/${e.file}`),
    ...TRANSACTIONAL_EMAILS.map((e) => `emails/dist/transactional/${e.file}`),
    ...AUTH_EMAILS.map((e) => `public/emails/auth/${e.file}`),
  ].join("\n"),
);
