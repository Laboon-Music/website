// Writes the e-mails to emails/dist/*.html (paste them in Brevo).
// Run: npm run emails

import { mkdirSync, writeFileSync } from "node:fs";
import { campaign, doubleOptin } from "./templates.ts";

const OUT = new URL("./dist/", import.meta.url);
mkdirSync(OUT, { recursive: true });
writeFileSync(new URL("double-optin.html", OUT), doubleOptin);
writeFileSync(new URL("campaign.html", OUT), campaign);
console.log("emails/dist/double-optin.html, emails/dist/campaign.html");
