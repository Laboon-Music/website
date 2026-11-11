import { describe, expect, it } from "vitest";
import {
  REPORT_ALERT_HTML,
  REPORT_ALERT_NAME,
  REPORT_ALERT_PARAMS,
  REPORT_ALERT_SUBJECT,
} from "./report-alert";

const variablesOf = (template: string) =>
  [...template.matchAll(/\{\{\s*([^}]*?)\s*\}\}/g)].map(([, v]) => v);

describe("report alert template (listmonk, api#334)", () => {
  it("is French only, named like the API's other e-mails", () => {
    expect(REPORT_ALERT_NAME).toBe("report_alert.fr");
    expect(REPORT_ALERT_HTML).toContain('<html lang="fr">');
  });

  it("starts the subject with the environment prefix", () => {
    expect(REPORT_ALERT_SUBJECT).toBe(
      "{{ .Tx.Data.subjectPrefix }}[Signalement Laboon] Nouveau signalement : {{ .Tx.Data.category }}",
    );
    expect(REPORT_ALERT_SUBJECT.length).toBeGreaterThanOrEqual(10);
  });

  it("uses exactly the variables the API sends, nothing else from listmonk", () => {
    const used = new Set([
      ...variablesOf(REPORT_ALERT_SUBJECT),
      ...variablesOf(REPORT_ALERT_HTML),
    ]);
    expect([...used].sort()).toEqual(
      REPORT_ALERT_PARAMS.map((x) => `.Tx.Data.${x}`).sort(),
    );
    expect(variablesOf(REPORT_ALERT_HTML).sort()).toEqual([
      ".Tx.Data.category",
      ".Tx.Data.reportId",
    ]);
  });

  it("never uses subscriber attributes, the safe filter or a tracking pixel", () => {
    for (const template of [REPORT_ALERT_SUBJECT, REPORT_ALERT_HTML]) {
      expect(template).not.toMatch(/\.Subscriber/);
      expect(template).not.toMatch(/Safe|\|\s*safe/i);
    }
    expect(REPORT_ALERT_HTML).not.toMatch(/<img/);
  });
});
