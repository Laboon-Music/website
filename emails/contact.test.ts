import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL_FIELDS } from "@/lib/contact";
import { CONTACT_MESSAGE_HTML, CONTACT_MESSAGE_SUBJECT } from "./contact";

const fieldsOf = (template: string) =>
  [...template.matchAll(/\{\{ \.Tx\.Data\.(\w+) \}\}/g)].map(([, field]) => field);

describe("contact message template (listmonk)", () => {
  it("shows every field POST /api/contact sends, and only those", () => {
    expect(new Set(fieldsOf(CONTACT_MESSAGE_HTML))).toEqual(
      new Set(CONTACT_EMAIL_FIELDS),
    );
  });

  it("builds the subject from the data", () => {
    expect(CONTACT_MESSAGE_SUBJECT).toBe(
      "[Contact Laboon] {{ .Tx.Data.subject }} — {{ .Tx.Data.name }}",
    );
  });

  it("never marks data as safe HTML (listmonk keeps escaping it)", () => {
    expect(CONTACT_MESSAGE_HTML).not.toMatch(/Safe|\| *safe/i);
    expect(fieldsOf(CONTACT_MESSAGE_HTML).length).toBe(
      CONTACT_MESSAGE_HTML.match(/\{\{/g)?.length,
    );
  });
});
