import { describe, expect, it } from "vitest";
import { LOCALES } from "../lib/i18n";
import { SOCIALS } from "../lib/site";
import { ALL_EMAILS, campaign, doubleOptin } from "./templates";

describe.each(LOCALES)("e-mail templates (%s)", (locale) => {
  const optin = doubleOptin(locale);
  const news = campaign(locale);

  it("declares its language", () => {
    expect(optin).toContain(`<html lang="${locale}"`);
  });

  it("double opt-in carries the Brevo confirmation link on the button and as a fallback", () => {
    expect(optin.match(/\{\{ doubleoptin \}\}/g)?.length).toBeGreaterThanOrEqual(2);
    expect(optin).toContain('href="{{ doubleoptin }}"');
  });

  it("double opt-in loads its images from the site that sent the sign-up", () => {
    expect(optin).toContain(
      "{{ contact.SITE_URL | default : 'https://www.laboon-app.com' }}/brand/email/wordmark-white.png",
    );
    expect(news).toContain(
      'src="https://www.laboon-app.com/brand/email/wordmark-white.png"',
    );
  });

  it("campaign has the unsubscribe and view-in-browser links Brevo requires", () => {
    expect(news).toContain("{{ unsubscribe }}");
    expect(news).toContain("{{ mirror }}");
  });

  it("campaign opens the home page of its language", () => {
    expect(news).toContain(
      locale === "en"
        ? 'href="https://www.laboon-app.com/en"'
        : 'href="https://www.laboon-app.com"',
    );
  });

  for (const [name, html] of [
    ["double opt-in", optin],
    ["campaign", news],
  ] as const) {
    describe(name, () => {
      it("supports light and dark mode", () => {
        expect(html).toContain('name="color-scheme" content="light dark"');
        expect(html).toContain("prefers-color-scheme:dark");
      });

      it("adapts to phones: fluid container, full-width button, 16 px+ text", () => {
        expect(html).toContain('name="viewport"');
        expect(html).toContain("@media (max-width:600px)");
        expect(html).toContain(".btn-a{display:block!important");
        expect(html).not.toMatch(/font-size:1[0-5]px;line-height:1\.55/);
      });

      it("stays readable without images: alt text on the logo and the social icons", () => {
        expect(html).toContain('alt="Laboon"');
        for (const social of SOCIALS) expect(html).toContain(`alt="${social.name}"`);
      });

      it("links every social network and the contact address", () => {
        for (const social of SOCIALS) expect(html).toContain(social.href);
        expect(html).toContain("mailto:laboon.app@gmail.com");
      });

      it("uses absolute URLs for images (a base site address, never a relative path)", () => {
        const srcs = [...html.matchAll(/<img[^>]*? src="([^"]+)"/g)].map((m) => m[1]);
        expect(srcs.length).toBeGreaterThan(1);
        for (const src of srcs) {
          expect(src).toMatch(
            /^(https:\/\/www\.laboon-app\.com|\{\{ contact\.SITE_URL .*\}\})\/brand\/email\//,
          );
        }
      });
    });
  }
});

describe("e-mail files", () => {
  it("writes one file per template and language", () => {
    expect(ALL_EMAILS.map((e) => e.file).sort()).toEqual([
      "campaign.en.html",
      "campaign.fr.html",
      "double-optin.en.html",
      "double-optin.fr.html",
    ]);
  });

  it("French and English say different things", () => {
    expect(doubleOptin("fr")).not.toBe(doubleOptin("en"));
    expect(doubleOptin("en")).toContain("Almost done!");
  });
});
