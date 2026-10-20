import { NextRequest } from "next/server";
import { describe, expect, it } from "vitest";
import { proxy } from "./proxy";

const run = (path: string) => proxy(new NextRequest(`https://www.laboon-app.com${path}`));
const rewrittenTo = (res: Response) => res.headers.get("x-middleware-rewrite");

describe("language routing", () => {
  it("serves French pages without a prefix, as /fr internally", () => {
    expect(rewrittenTo(run("/contact"))).toBe("https://www.laboon-app.com/fr/contact");
    expect(rewrittenTo(run("/"))).toBe("https://www.laboon-app.com/fr");
  });

  it("lets English pages through", () => {
    const res = run("/en/contact");
    expect(res.headers.get("x-middleware-next")).toBe("1");
    expect(rewrittenTo(res)).toBeNull();
  });

  it("redirects /fr/... to the one address without a prefix", () => {
    const res = run("/fr/contact?x=1");
    expect(res.status).toBe(308);
    expect(res.headers.get("location")).toBe("https://www.laboon-app.com/contact?x=1");
    expect(run("/fr").headers.get("location")).toBe("https://www.laboon-app.com/");
  });

  it("never redirects by browser language or country", () => {
    const res = proxy(
      new NextRequest("https://www.laboon-app.com/", {
        headers: { "accept-language": "en-GB,en;q=0.9" },
      }),
    );
    expect(rewrittenTo(res)).toBe("https://www.laboon-app.com/fr");
  });

  it.each([
    "/faq/embed",
    "/contact/embed",
    "/legal/cgu",
    "/reset-password",
    "/confirm-email",
  ])("picks the language of %s from ?lang=", (path) => {
    expect(rewrittenTo(run(`${path}?lang=en&code=x`))).toContain(`/en${path}`);
    expect(rewrittenTo(run(`${path}?lang=de`))).toContain(`/fr${path}`);
    expect(rewrittenTo(run(path))).toContain(`/fr${path}`);
  });

  it("ignores ?lang= on ordinary pages", () => {
    expect(rewrittenTo(run("/contact?lang=en"))).toContain("/fr/contact");
  });
});
