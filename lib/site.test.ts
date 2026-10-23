import { describe, expect, it } from "vitest";
import { isProductionHost, robotsFor, SITE_URL } from "./site";

describe("robotsFor", () => {
  it.each(["www.laboon-app.com", "laboon-app.com"])("allows indexing on %s", (host) => {
    const robots = robotsFor(host);
    expect(robots.rules).toMatchObject({ allow: "/" });
    expect(robots.sitemap).toBe(`${SITE_URL}/sitemap.xml`);
  });

  it.each([
    "staging.laboon-app.com",
    "laboon-website.vercel.app",
    "localhost:3000",
    null,
  ])("blocks everything on %s", (host) => {
    expect(robotsFor(host)).toEqual({ rules: { userAgent: "*", disallow: "/" } });
    expect(isProductionHost(host)).toBe(false);
  });

  it("keeps technical pages out of the index in production", () => {
    const rules = robotsFor("www.laboon-app.com").rules as { disallow: string[] };
    expect(rules.disallow).toEqual(
      expect.arrayContaining([
        "/api/",
        "/emails/",
        "/legal/",
        "/faq/embed",
        "/reset-password",
      ]),
    );
  });
});
