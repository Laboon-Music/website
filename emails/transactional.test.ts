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
    expect(TRANSACTIONAL_NAMES).toHaveLength(6);
  });

  describe.each(LISTMONK_TRANSACTIONAL_EMAILS)(
    "$name ($locale)",
    ({ name, locale, subject, html }) => {
      const params = TRANSACTIONAL_PARAMS[name];

      it("declares its language", () => {
        expect(html).toContain(`<html lang="${locale}"`);
      });

      it("uses exactly its params, nothing else from listmonk", () => {
        const used = new Set(
          [...html.matchAll(/\{\{\s*([^}]*?)\s*\}\}/g)].map((m) => m[1]),
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
});
