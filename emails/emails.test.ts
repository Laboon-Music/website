import { describe, expect, it } from "vitest";
import { LOCALES } from "../lib/i18n";
import { SOCIALS } from "../lib/site";
import {
  LISTMONK_EMAILS,
  campaign,
  campaignContent,
  doubleOptin,
  listmonkOptin,
} from "./templates";

describe.each(LOCALES)("e-mail templates (%s)", (locale) => {
  const optin = doubleOptin(locale);
  const news = campaign(locale);

  it("declares its language", () => {
    expect(optin).toContain(`<html lang="${locale}"`);
  });

  it("double opt-in carries the confirmation link on the button and as a fallback", () => {
    expect(optin.match(/href="\{\{ \.OptinURL \}\}"/g)).toHaveLength(2);
  });

  it("campaign has the unsubscribe and view-in-browser links", () => {
    expect(news).toContain('href="{{ UnsubscribeURL }}"');
    expect(news).toContain('href="{{ MessageURL }}"');
  });

  it("campaign body opens the home page of its language", () => {
    expect(campaignContent(locale)).toContain(
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

      it("uses absolute https URLs for images", () => {
        expect(html).toContain(
          'src="https://www.laboon-app.com/brand/email/wordmark-white.png"',
        );
      });
    });
  }
});

describe("listmonk e-mails", () => {
  it("French and English say different things", () => {
    expect(doubleOptin("fr")).not.toBe(doubleOptin("en"));
    expect(doubleOptin("en")).toContain("Almost done!");
  });

  it("writes the campaign frame and starter body per language, and one opt-in template", () => {
    expect(LISTMONK_EMAILS.map((e) => e.file).sort()).toEqual([
      "campaign-content.en.html",
      "campaign-content.fr.html",
      "campaign.en.html",
      "campaign.fr.html",
      "subscriber-optin.html",
    ]);
  });

  describe.each(LOCALES)("campaign (%s)", (locale) => {
    const frame = campaign(locale);

    it("holds the content placeholder exactly once, instead of the body", () => {
      expect(frame.match(/\{\{ template "content" \. \}\}/g)).toHaveLength(1);
      expect(frame).not.toContain(campaignContent(locale));
    });

    it("greets with the first name attribute, with a fallback", () => {
      expect(campaignContent(locale)).toContain(
        `{{ .Subscriber.Attribs.first_name | default "${locale === "en" ? "musician" : "musicien·ne"}" }}`,
      );
    });
  });

  describe("opt-in system template", () => {
    const optin = listmonkOptin();

    it("defines the template listmonk looks up", () => {
      expect(optin.startsWith('{{ define "subscriber-optin" }}')).toBe(true);
      expect(optin.trimEnd().endsWith("{{ end }}{{ end }}")).toBe(true);
    });

    it("sends English when the language attribute is en, French otherwise", () => {
      const [en, fr] = optin.split("{{ else }}");
      expect(en).toContain(
        '{{ if eq (.Subscriber.Attribs.language | default "fr" | toString) "en" }}',
      );
      expect(en).toContain('<html lang="en"');
      expect(fr).toContain('<html lang="fr"');
    });

    it("sets the subject of each language through <title data-i18n>", () => {
      const [en, fr] = optin.split("{{ else }}");
      expect(en).toContain("<title data-i18n>Confirm your Laboon sign-up</title>");
      expect(fr).toContain("<title data-i18n>Confirme ton inscription à Laboon</title>");
      expect(optin).not.toContain("<title>Laboon</title>");
    });

    it("carries the confirmation link on the button and as a fallback in both languages", () => {
      expect(optin.match(/href="\{\{ \.OptinURL \}\}"/g)).toHaveLength(4);
    });
  });
});
