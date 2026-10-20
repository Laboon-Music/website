import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { LanguageSwitch } from "./LanguageSwitch";
import { LocaleProvider } from "./LocaleProvider";
import { LocalizedLink } from "./LocalizedLink";

const pathname = vi.hoisted(() => ({ value: "/" }));
vi.mock("next/navigation", () => ({ usePathname: () => pathname.value }));

describe("LocalizedLink", () => {
  it("keeps the language of the page for the site's own paths", () => {
    render(
      <LocaleProvider locale="en">
        <LocalizedLink href="/contact">c</LocalizedLink>
        <LocalizedLink href="/#faq">f</LocalizedLink>
        <LocalizedLink href="#top">t</LocalizedLink>
        <LocalizedLink href="https://example.com">x</LocalizedLink>
      </LocaleProvider>,
    );
    expect(screen.getByText("c")).toHaveAttribute("href", "/en/contact");
    expect(screen.getByText("f")).toHaveAttribute("href", "/en#faq");
    expect(screen.getByText("t")).toHaveAttribute("href", "#top");
    expect(screen.getByText("x")).toHaveAttribute("href", "https://example.com");
  });

  it("leaves French paths without a prefix", () => {
    render(
      <LocaleProvider locale="fr">
        <LocalizedLink href="/contact">c</LocalizedLink>
      </LocaleProvider>,
    );
    expect(screen.getByText("c")).toHaveAttribute("href", "/contact");
  });
});

describe("LanguageSwitch", () => {
  it("links to the same page in the other language, named in that language", () => {
    pathname.value = "/contact";
    render(
      <LocaleProvider locale="fr">
        <LanguageSwitch />
      </LocaleProvider>,
    );
    const link = screen.getByRole("link", { name: "English (changer de langue)" });
    expect(link).toHaveAttribute("href", "/en/contact");
    expect(link).toHaveAttribute("hreflang", "en");
    expect(link).toHaveAttribute("lang", "en");
  });

  it("goes back to the unprefixed French page from English", () => {
    pathname.value = "/en/mentions-legales";
    render(
      <LocaleProvider locale="en">
        <LanguageSwitch />
      </LocaleProvider>,
    );
    const link = screen.getByRole("link", { name: "Français (change language)" });
    expect(link).toHaveAttribute("href", "/mentions-legales");
    expect(link).toHaveAttribute("lang", "fr");
  });

  it("goes from the English home to the French home", () => {
    pathname.value = "/en";
    render(
      <LocaleProvider locale="en">
        <LanguageSwitch />
      </LocaleProvider>,
    );
    expect(screen.getByRole("link", { name: /Français/ })).toHaveAttribute("href", "/");
  });
});
