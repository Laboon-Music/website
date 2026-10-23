import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getContent } from "@/content";
import { LOCALES, localePath } from "@/lib/i18n";
import { CONTACT_EMAIL, SOCIALS } from "@/lib/site";
import { Faq } from "./Faq";
import { embedHref, RichText } from "./RichText";

describe("RichText", () => {
  it("turns [label](address) into links and keeps the rest", () => {
    render(
      <p>
        <RichText text="Va sur [le site](/faq) ou écris à [nous](mailto:a@b.co)." />
      </p>,
    );
    expect(screen.getByRole("link", { name: "le site" })).toHaveAttribute("href", "/faq");
    expect(screen.getByRole("link", { name: "nous" })).toHaveAttribute(
      "href",
      "mailto:a@b.co",
    );
    expect(screen.getByText(/Va sur/)).toHaveTextContent(
      "Va sur le site ou écris à nous.",
    );
  });

  it("renders plain text untouched", () => {
    render(<RichText text="Rien à signaler" />);
    expect(screen.getByText("Rien à signaler")).toBeInTheDocument();
  });
});

describe("embedHref", () => {
  it("keeps links on the bare app pages", () => {
    expect(embedHref("/contact")).toBe("/contact/embed");
    expect(embedHref("/charte")).toBe("/legal/charte");
    expect(embedHref("/confidentialite")).toBe("/legal/confidentialite");
    expect(embedHref("mailto:a@b.co")).toBe("mailto:a@b.co");
    expect(embedHref("https://example.com")).toBe("https://example.com");
  });

  it("drops home anchors, useless inside the app", () => {
    expect(embedHref("/#rejoindre")).toBeNull();
    render(
      <p>
        <RichText embed text="Va [ici](/#rejoindre) ou [là](/contact)." />
      </p>,
    );
    expect(screen.queryByRole("link", { name: "ici" })).not.toBeInTheDocument();
    expect(screen.getByRole("link", { name: "là" })).toHaveAttribute(
      "href",
      "/contact/embed",
    );
  });
});

describe.each(LOCALES)("Faq (%s)", (locale) => {
  const { faq } = getContent(locale);

  it("shows every question once, grouped under headings", () => {
    render(<Faq content={faq} />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(faq.title);
    expect(screen.getAllByRole("heading", { level: 2 })).toHaveLength(faq.groups.length);
    for (const question of faq.groups.flatMap((g) => g.items.map((i) => i.question))) {
      expect(screen.getAllByText(question)).toHaveLength(1);
    }
  });

  it("links to the waiting list, legal pages, contact and every social network, in its language", () => {
    render(
      <LocaleProvider locale={locale}>
        <Faq content={faq} />
      </LocaleProvider>,
    );
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toEqual(
      expect.arrayContaining([
        localePath(locale, "/#rejoindre"),
        localePath(locale, "/confidentialite"),
        localePath(locale, "/charte"),
        localePath(locale, "/contact"),
        `mailto:${CONTACT_EMAIL}`,
        ...SOCIALS.map((s) => s.href),
      ]),
    );
  });

  it("only uses the official contact address", () => {
    render(<Faq content={faq} />);
    const text = document.body.textContent ?? "";
    for (const email of text.match(/[\w.+-]+@[\w-]+(\.\w+)+/g) ?? []) {
      expect(email).toBe(CONTACT_EMAIL);
    }
  });
});
