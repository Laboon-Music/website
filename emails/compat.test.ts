// @vitest-environment node
// Checks every generated e-mail against the caniemail database (doiuse-email): a feature that some mail client does
// not support fails the test unless it is in ACCEPTED, with the reason it degrades gracefully. Also guards the size
// Gmail clips at. See docs/features/emails.md.

import { doIUseEmail } from "doiuse-email";
import { describe, expect, it } from "vitest";
import { AUTH_EMAILS } from "./auth";
import { ALL_EMAILS, LISTMONK_EMAILS } from "./templates";
import { LISTMONK_TRANSACTIONAL_EMAILS, TRANSACTIONAL_EMAILS } from "./transactional";

const CLIENTS = ["gmail.*", "apple-mail.*", "outlook.*", "yahoo.*", "samsung-email.*"];

/** Unsupported somewhere, but the e-mail stays readable there. */
const ACCEPTED: Record<string, string> = {
  "@media":
    "phone layout and dark mode are enhancements: without them the 600 px light layout shows",
  "border-radius": "Outlook on Windows shows square buttons and icons",
  "<body> element": "the background is repeated on the outer table",
  "Type selector": "only the reset rules (body, table, img, a) use it",
  outline: "only the image reset uses it",
  "target attribute": "ignored: the link opens anyway",
  "role attribute": "accessibility hint only",
  "word-break": "the fallback link may overflow instead of wrapping",
  "display:none":
    "hidden preheader: also hidden by max-height:0, mso-hide:all and a transparent colour",
  overflow: "hidden preheader, see display:none",
  opacity: "hidden preheader, see display:none",
};

/** Gmail cuts an e-mail above 102 KB ("[Message clipped]"), hiding the links at the bottom. */
const GMAIL_CLIP_BYTES = 102 * 1024;

const EMAILS = [
  ...ALL_EMAILS.map((e) => ({ name: e.file, html: e.html })),
  ...TRANSACTIONAL_EMAILS.map((e) => ({ name: `transactional/${e.file}`, html: e.html })),
  ...LISTMONK_EMAILS.map((e) => ({ name: `listmonk/${e.file}`, html: e.html })),
  ...LISTMONK_TRANSACTIONAL_EMAILS.map((e) => ({
    name: `listmonk/transactional/${e.file}`,
    html: e.html,
  })),
  ...AUTH_EMAILS.map((e) => ({ name: `auth/${e.file}`, html: e.html })),
];

describe.each(EMAILS)("$name", ({ html }) => {
  it("uses only features every client supports, or accepted degradations", () => {
    const result = doIUseEmail(html, { emailClients: CLIENTS });
    const errors = result.success ? [] : result.errors;
    const features = errors.map((e) => /^`([^`]+)`/.exec(e)?.[1] ?? e);
    expect([...new Set(features)].filter((f) => !(f in ACCEPTED))).toEqual([]);
  });

  it("stays under the size Gmail clips at", () => {
    expect(Buffer.byteLength(html)).toBeLessThan(GMAIL_CLIP_BYTES);
  });
});
