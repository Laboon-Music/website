// Writes the e-mails to emails/dist/<name>.<lang>.html (paste them in Brevo).
// Run: npm run emails

import { mkdirSync, rmSync, writeFileSync } from "node:fs";
import { ALL_EMAILS } from "./templates.ts";

const OUT = new URL("./dist/", import.meta.url);
rmSync(OUT, { recursive: true, force: true });
mkdirSync(OUT, { recursive: true });
for (const { file, html } of ALL_EMAILS) writeFileSync(new URL(file, OUT), html);
console.log(ALL_EMAILS.map((e) => `emails/dist/${e.file}`).join("\n"));
