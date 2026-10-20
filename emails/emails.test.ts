import { describe, expect, it } from "vitest";
import { SOCIALS } from "../lib/site";
import { campaign, doubleOptin } from "./templates";

describe("e-mail templates", () => {
  it("double opt-in carries the Brevo confirmation link on the button and as a fallback", () => {
    expect(doubleOptin.match(/\{\{ doubleoptin \}\}/g)?.length).toBeGreaterThanOrEqual(2);
    expect(doubleOptin).toContain('href="{{ doubleoptin }}"');
  });

  it("campaign has the unsubscribe and view-in-browser links Brevo requires", () => {
    expect(campaign).toContain("{{ unsubscribe }}");
    expect(campaign).toContain("{{ mirror }}");
  });

  for (const [name, html] of [
    ["double opt-in", doubleOptin],
    ["campaign", campaign],
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

      it("stays readable without images: alt text on the logo", () => {
        expect(html).toContain('alt="Laboon"');
      });

      it("links every social network and the contact address", () => {
        for (const social of SOCIALS) expect(html).toContain(social.href);
        expect(html).toContain("mailto:laboon.app@gmail.com");
      });

      it("uses absolute https URLs for images and links", () => {
        expect(html).toContain(
          'src="https://www.laboon-app.com/brand/email/wordmark-white.png"',
        );
      });
    });
  }
});
