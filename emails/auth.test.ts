import { describe, expect, it } from "vitest";
import { AUTH_EMAILS } from "./auth";

const byFile = Object.fromEntries(AUTH_EMAILS.map((e) => [e.file, e.html]));

describe("auth e-mail templates (served to GoTrue)", () => {
  it("has one file per GoTrue template type", () => {
    expect(Object.keys(byFile).sort()).toEqual([
      "confirmation.html",
      "email_change.html",
      "recovery.html",
    ]);
  });

  it.each(AUTH_EMAILS)(
    "$file carries both languages and picks English only for legal_locale en",
    ({ html }) => {
      expect(
        html.startsWith(
          '{{ if and .Data .Data.legal_locale (eq .Data.legal_locale "en") }}',
        ),
      ).toBe(true);
      expect(html).toContain("{{ else }}");
      expect(html.endsWith("{{ end }}")).toBe(true);
      expect(html).toContain('<html lang="en"');
      expect(html).toContain('<html lang="fr"');
    },
  );

  it.each(AUTH_EMAILS)(
    "$file has the link on the button and as a fallback",
    ({ html }) => {
      expect(html.match(/\{\{ \.ConfirmationURL \}\}/g)?.length).toBeGreaterThanOrEqual(
        4,
      );
      expect(html).toContain('href="{{ .ConfirmationURL }}"');
    },
  );

  it("only uses variables GoTrue provides", () => {
    for (const { html } of AUTH_EMAILS) {
      const used = html.match(/\{\{[^}]*\}\}/g) ?? [];
      const allowed =
        /^\{\{ (\.ConfirmationURL|\.Email|\.NewEmail|else|end|if and \.Data \.Data\.legal_locale \(eq \.Data\.legal_locale "en"\)) \}\}$/;
      expect(used.filter((v) => !allowed.test(v))).toEqual([]);
    }
  });

  it("shows both addresses in the e-mail change", () => {
    expect(byFile["email_change.html"]).toContain("{{ .Email }}");
    expect(byFile["email_change.html"]).toContain("{{ .NewEmail }}");
  });

  it("loads its images from the production site", () => {
    expect(byFile["recovery.html"]).toContain(
      'src="https://www.laboon-app.com/brand/email/wordmark-white.png"',
    );
  });
});
