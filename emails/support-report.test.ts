import { describe, expect, it } from "vitest";
import {
  SUPPORT_REPORT_HTML,
  SUPPORT_REPORT_NAME,
  SUPPORT_REPORT_PARAMS,
  SUPPORT_REPORT_SUBJECT,
} from "./support-report";

const variablesOf = (template: string) =>
  [...template.matchAll(/\{\{\s*([^}]*?)\s*\}\}/g)].map(([, v]) => v);

describe("support report template (listmonk, api#362)", () => {
  it("is French only, named like the API's other e-mails", () => {
    expect(SUPPORT_REPORT_NAME).toBe("support_report.fr");
    expect(SUPPORT_REPORT_HTML).toContain('<html lang="fr">');
  });

  it("starts the subject with the environment prefix", () => {
    expect(SUPPORT_REPORT_SUBJECT).toBe(
      "{{ .Tx.Data.subjectPrefix }}[Support Laboon] Nouveau message : {{ .Tx.Data.category }}",
    );
  });

  it("uses exactly the variables the API sends, nothing else from listmonk", () => {
    const used = new Set([
      ...variablesOf(SUPPORT_REPORT_SUBJECT),
      ...variablesOf(SUPPORT_REPORT_HTML),
    ]);
    expect([...used].sort()).toEqual(
      SUPPORT_REPORT_PARAMS.map((x) => `.Tx.Data.${x}`).sort(),
    );
    expect(variablesOf(SUPPORT_REPORT_HTML)).not.toContain(".Tx.Data.subjectPrefix");
  });

  it("keeps the line breaks of the message", () => {
    expect(SUPPORT_REPORT_HTML).toMatch(
      /<div style="white-space:pre-wrap;[^"]*">\{\{ \.Tx\.Data\.message \}\}<\/div>/,
    );
  });

  it("never uses subscriber attributes, the safe filter, a variable in an attribute or a tracking pixel", () => {
    for (const template of [SUPPORT_REPORT_SUBJECT, SUPPORT_REPORT_HTML]) {
      expect(template).not.toMatch(/\.Subscriber/);
      expect(template).not.toMatch(/Safe|\|\s*safe/i);
    }
    expect(SUPPORT_REPORT_HTML).not.toMatch(/="[^"]*\{\{/);
    expect(SUPPORT_REPORT_HTML).not.toMatch(/<img/);
  });
});
