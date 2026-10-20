import { describe, expect, it } from "vitest";
import { LEGAL_SLUGS } from "@/components/legal/registry";
import sitemap from "./sitemap";

describe("sitemap", () => {
  const urls = sitemap().map((entry) => entry.url);

  it("lists the home and contact pages on the canonical domain", () => {
    expect(urls).toContain("https://www.laboon-app.com/");
    expect(urls).toContain("https://www.laboon-app.com/contact");
  });

  it("lists every legal document", () => {
    for (const slug of LEGAL_SLUGS) {
      expect(urls).toContain(`https://www.laboon-app.com/${slug}`);
    }
  });

  it("never lists non-indexable pages", () => {
    expect(
      urls.some((u) =>
        /\/(api|legal|faq\/embed|reset-password|inscription-confirmee)/.test(u),
      ),
    ).toBe(false);
  });
});
