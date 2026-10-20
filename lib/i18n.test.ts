import { describe, expect, it } from "vitest";
import {
  isLocale,
  languageAlternates,
  localeFromAcceptLanguage,
  localePath,
  normalizeLocale,
  splitLocale,
} from "./i18n";

describe("i18n helpers", () => {
  it("recognises the served locales", () => {
    expect(isLocale("fr")).toBe(true);
    expect(isLocale("en")).toBe(true);
    expect(isLocale("de")).toBe(false);
    expect(isLocale(undefined)).toBe(false);
  });

  it("normalises any value to a served locale, French by default", () => {
    expect(normalizeLocale("en-US")).toBe("en");
    expect(normalizeLocale("EN")).toBe("en");
    expect(normalizeLocale("de")).toBe("fr");
    expect(normalizeLocale(null)).toBe("fr");
  });

  it("prefixes English paths only", () => {
    expect(localePath("fr", "/contact")).toBe("/contact");
    expect(localePath("en", "/contact")).toBe("/en/contact");
    expect(localePath("en", "/")).toBe("/en");
    expect(localePath("en", "/#faq")).toBe("/en#faq");
    expect(localePath("fr", "/#faq")).toBe("/#faq");
  });

  it("splits the locale prefix from a pathname", () => {
    expect(splitLocale("/en/contact")).toEqual({ locale: "en", path: "/contact" });
    expect(splitLocale("/en")).toEqual({ locale: "en", path: "/" });
    expect(splitLocale("/contact")).toEqual({ locale: null, path: "/contact" });
    expect(splitLocale("/english")).toEqual({ locale: null, path: "/english" });
  });

  it("picks the first served language of Accept-Language", () => {
    expect(localeFromAcceptLanguage("de-DE,en;q=0.8,fr;q=0.5")).toBe("en");
    expect(localeFromAcceptLanguage("fr-FR,fr;q=0.9")).toBe("fr");
    expect(localeFromAcceptLanguage("de")).toBe("fr");
    expect(localeFromAcceptLanguage(null)).toBe("fr");
  });

  it("builds hreflang alternates with an x-default", () => {
    expect(languageAlternates("/contact")).toEqual({
      fr: "/contact",
      en: "/en/contact",
      "x-default": "/contact",
    });
  });
});
