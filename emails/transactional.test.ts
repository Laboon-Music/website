import { describe, expect, it } from "vitest";
import { LOCALES } from "../lib/i18n";
import {
  LISTMONK_TRANSACTIONAL_EMAILS,
  TRANSACTIONAL_NAMES,
  TRANSACTIONAL_PARAMS,
} from "./transactional";

describe("transactional templates", () => {
  it("has one template per e-mail and language", () => {
    expect(LISTMONK_TRANSACTIONAL_EMAILS).toHaveLength(
      TRANSACTIONAL_NAMES.length * LOCALES.length,
    );
    expect(TRANSACTIONAL_NAMES).toHaveLength(11);
  });

  describe.each(LISTMONK_TRANSACTIONAL_EMAILS)(
    "$name ($locale)",
    ({ name, locale, subject, html }) => {
      const params = TRANSACTIONAL_PARAMS[name];

      it("declares its language", () => {
        expect(html).toContain(`<html lang="${locale}"`);
      });

      it("uses exactly its params, nothing else from listmonk", () => {
        // The subject is rendered by listmonk as a template too (`subjectPrefix`).
        const used = new Set(
          [...`${subject}${html}`.matchAll(/\{\{\s*([^}]*?)\s*\}\}/g)]
            .map((m) => m[1])
            // The only control actions allowed: `if` on one of its params, and its `end`.
            .filter((action) => action !== "end")
            .map((action) => action.replace(/^if /, "")),
        );
        expect([...used].sort()).toEqual(params.map((x) => `.Tx.Data.${x}`).sort());
      });

      it("never uses subscriber attributes, the safe filter or a tracking pixel", () => {
        expect(html).not.toMatch(/\.Subscriber/);
        expect(html).not.toMatch(/\|\s*safe/);
        expect(html).not.toMatch(/<img[^>]*width="1"/);
      });

      it("has a subject Scaleway TEM accepts", () => {
        expect(subject.length).toBeGreaterThanOrEqual(10);
      });

      if (params.includes("link")) {
        it("links only through .Tx.Data.link, on the button and as text", () => {
          const hrefs = [...html.matchAll(/href="([^"]*)"/g)].map((m) => m[1]);
          const actionHrefs = hrefs.filter(
            (h) =>
              !/laboon-app\.com|mailto:|instagram|tiktok|facebook|youtube|linkedin|x\.com/i.test(
                h,
              ),
          );
          expect(actionHrefs.length).toBeGreaterThanOrEqual(2);
          expect(new Set(actionHrefs)).toEqual(new Set(["{{ .Tx.Data.link }}"]));
          expect(html).toContain(`>{{ .Tx.Data.link }}</a>`);
        });
      }
    },
  );

  describe("moderation", () => {
    const moderation = LISTMONK_TRANSACTIONAL_EMAILS.filter((e) =>
      e.name.startsWith("moderation_"),
    );

    it("covers the four sanction e-mails in both languages", () => {
      expect(moderation).toHaveLength(8);
    });

    it.each(moderation)(
      "$name ($locale) starts its subject with the prefix and shows the appeal address as text only",
      ({ subject, html }) => {
        expect(subject.startsWith("{{ .Tx.Data.subjectPrefix }}")).toBe(true);
        expect(html).toContain("{{ .Tx.Data.appealEmail }}");
        expect(html).not.toMatch(/="[^"]*\{\{[^"]*"/);
      },
    );

    it.each(moderation.filter((e) => e.locale === "fr"))(
      "$name (fr) speaks to the user with tu, never vous",
      ({ html }) => {
        expect(html).not.toMatch(/\b(vous|votre|vos)\b/i);
        expect(html).toContain("ton compte");
      },
    );

    it("shows the end date of a suspension and no content for a lifted one", () => {
      for (const e of moderation) {
        const has = (x: string) => e.html.includes(`{{ .Tx.Data.${x} }}`);
        expect(has("untilDate")).toBe(e.name === "moderation_suspension");
        expect(has("content")).toBe(e.name !== "moderation_suspension_lifted");
      }
    });
  });

  describe("legal_change", () => {
    const [fr, en] = ["fr", "en"].map((l) =>
      LISTMONK_TRANSACTIONAL_EMAILS.find(
        (e) => e.name === "legal_change" && e.locale === l,
      )!,
    );

    it("starts its subject with the prefix the API sends", () => {
      expect(fr.subject.startsWith("{{ .Tx.Data.subjectPrefix }}")).toBe(true);
      expect(en.subject.startsWith("{{ .Tx.Data.subjectPrefix }}")).toBe(true);
    });

    it("shows the summary as escaped text that keeps its line breaks", () => {
      for (const { html } of [fr, en]) {
        expect(html).toMatch(/white-space:pre-line;">\{\{ \.Tx\.Data\.summary \}\}<\/p>/);
      }
    });
  });
});
