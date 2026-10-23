import { describe, expect, it } from "vitest";
import nextConfig, { contentSecurityPolicy } from "./next.config";

describe("security headers", () => {
  it("sets the baseline headers on every page", async () => {
    const [{ source, headers }] = await nextConfig.headers!();
    expect(source).toBe("/:path*");
    const names = headers.map((h) => h.key);
    expect(names).toEqual(
      expect.arrayContaining([
        "X-Content-Type-Options",
        "Referrer-Policy",
        "X-Frame-Options",
        "Permissions-Policy",
        "Strict-Transport-Security",
        "Cross-Origin-Opener-Policy",
      ]),
    );
  });

  it("lets only Turnstile, analytics and the API through the CSP", () => {
    const csp = contentSecurityPolicy("https://api.laboon-app.com");
    expect(csp).toContain("default-src 'self'");
    expect(csp).toContain("frame-src https://challenges.cloudflare.com");
    expect(csp).toContain(
      "connect-src 'self' https://api.laboon-app.com https://challenges.cloudflare.com",
    );
    expect(csp).toContain("object-src 'none'");
    expect(csp).toContain("frame-ancestors 'self'");
    expect(csp).not.toMatch(/\*/);
  });

  it("works without an API address", () => {
    expect(contentSecurityPolicy("")).toContain(
      "connect-src 'self' https://challenges.cloudflare.com",
    );
  });

  it("redirects the old /faq pages to the home FAQ", async () => {
    const redirects = await nextConfig.redirects!();
    expect(redirects).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          source: "/faq",
          destination: "/#faq",
          permanent: true,
        }),
      ]),
    );
  });
});
