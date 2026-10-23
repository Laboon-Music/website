import { render } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { CONTACT_EMAIL } from "@/lib/site";
import { getLegalDoc, LEGAL_SLUGS, type Locale } from "./registry";

describe("legal documents content", () => {
  const cases = (["fr", "en"] as Locale[]).flatMap((locale) =>
    LEGAL_SLUGS.map((slug) => [locale, slug] as const),
  );

  it.each(cases)("%s/%s only uses the official contact address", (locale, slug) => {
    const { Component } = getLegalDoc(locale, slug).entry;
    const { container } = render(<Component />);
    // Scan each text node separately (textContent glues adjacent blocks).
    const emails: string[] = [];
    const walker = document.createTreeWalker(container, NodeFilter.SHOW_TEXT);
    while (walker.nextNode()) {
      emails.push(
        ...(walker.currentNode.textContent?.match(/[\w.+-]+@[\w-]+(\.\w+)+/g) ?? []),
      );
    }
    for (const email of emails) expect(email).toBe(CONTACT_EMAIL);
    container.querySelectorAll("a[href^='mailto:']").forEach((a) => {
      expect(a.getAttribute("href")).toBe(`mailto:${CONTACT_EMAIL}`);
    });
  });
  it.each(["fr", "en"] as Locale[])(
    "%s privacy policy has a deletion section with a stable anchor",
    (locale) => {
      const { Component } = getLegalDoc(locale, "confidentialite").entry;
      const { container } = render(<Component />);
      const section = container.querySelector("section#suppression-compte");
      expect(section).not.toBeNull();
      expect(section?.textContent).toContain(CONTACT_EMAIL);
    },
  );

  it.each(["fr", "en"] as Locale[])("%s documents all start at version 1", (locale) => {
    for (const slug of LEGAL_SLUGS) {
      const { Component } = getLegalDoc(locale, slug).entry;
      const { container } = render(<Component />);
      expect(container.querySelector("header")?.textContent).toMatch(/1/);
      expect(container.querySelector("header")?.textContent).not.toMatch(
        /(?:Version|version) [2-9]/,
      );
    }
  });
});
