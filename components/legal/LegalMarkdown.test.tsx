import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen, within } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { LegalMarkdown } from "./LegalMarkdown";

const fixture = (name: string) =>
  readFileSync(join(process.cwd(), "components/legal/fixtures", name), "utf8");

describe("LegalMarkdown — allowed syntax", () => {
  it("renders ## as a section heading with the {#id} as anchor, without the marker", () => {
    const { container } = render(
      <LegalMarkdown markdown={fixture("confidentialite.fr.md")} />,
    );
    const section = container.querySelector("section#suppression-compte");
    expect(section).not.toBeNull();
    expect(
      within(section as HTMLElement).getByRole("heading", { level: 2 }),
    ).toHaveTextContent("7. Suppression du compte");
    expect(container.textContent).not.toContain("{#");
  });

  it("renders the English privacy anchor too", () => {
    const { container } = render(
      <LegalMarkdown
        markdown={"## 7. Deleting your account {#suppression-compte}\n\nText"}
      />,
    );
    expect(container.querySelector("section#suppression-compte h2")).toHaveTextContent(
      "7. Deleting your account",
    );
  });

  it("gives no id to a section without {#id}", () => {
    const { container } = render(<LegalMarkdown markdown={"## Title\n\nText"} />);
    expect(container.querySelector("section")).not.toHaveAttribute("id");
  });

  it("sanitises the id to [a-z0-9-]", () => {
    const { container } = render(
      <LegalMarkdown markdown={'## T {#a b"onclick=x}\n\nx\n\n## U {#Ab_C!}\n\nx'} />,
    );
    const ids = [...container.querySelectorAll("section")].map((s) =>
      s.getAttribute("id"),
    );
    expect(ids).toEqual([null, "abc"]);
  });

  it("renders ### as a subheading inside its section", () => {
    render(<LegalMarkdown markdown={"## A\n\n### Sub\n\nText"} />);
    expect(screen.getByRole("heading", { level: 3, name: "Sub" })).toBeInTheDocument();
  });

  it("renders the intro paragraphs before the sections, outside the panel", () => {
    const { container } = render(
      <LegalMarkdown markdown={"Intro text.\n\n## A\n\nBody"} />,
    );
    const intro = screen.getByText("Intro text.");
    expect(intro.closest("section")).toBeNull();
    expect(container.querySelectorAll("section")).toHaveLength(1);
    expect(intro.compareDocumentPosition(screen.getByText("Body"))).toBe(
      Node.DOCUMENT_POSITION_FOLLOWING,
    );
  });

  it("renders unordered and ordered lists", () => {
    render(<LegalMarkdown markdown={"## A\n\n- one\n- two\n\n1. first\n2. second"} />);
    const [bullets, numbers] = screen.getAllByRole("list");
    expect(bullets.tagName).toBe("UL");
    expect(numbers.tagName).toBe("OL");
    expect(within(bullets).getAllByRole("listitem")).toHaveLength(2);
    expect(within(numbers).getAllByRole("listitem")).toHaveLength(2);
  });

  it("renders bold and italic", () => {
    const { container } = render(
      <LegalMarkdown markdown={"## A\n\nA **bold** and *italic* text"} />,
    );
    expect(container.querySelector("strong")).toHaveTextContent("bold");
    expect(container.querySelector("em")).toHaveTextContent("italic");
  });

  it("renders https, mailto and anchor links", () => {
    render(
      <LegalMarkdown
        markdown={
          "## A\n\n[site](https://www.cnil.fr) [mail](mailto:a@b.fr) [here](#suppression-compte)"
        }
      />,
    );
    const site = screen.getByRole("link", { name: "site" });
    expect(site).toHaveAttribute("href", "https://www.cnil.fr");
    expect(site).toHaveAttribute("target", "_blank");
    expect(site).toHaveAttribute("rel", "noopener noreferrer");
    expect(screen.getByRole("link", { name: "mail" })).toHaveAttribute(
      "href",
      "mailto:a@b.fr",
    );
    const anchor = screen.getByRole("link", { name: "here" });
    expect(anchor).toHaveAttribute("href", "#suppression-compte");
    expect(anchor).not.toHaveAttribute("target");
  });

  it("renders a whole real text: one section per ## and the contact link", () => {
    const md = fixture("mentions-legales.en.md");
    const { container } = render(<LegalMarkdown markdown={md} />);
    expect(container.querySelectorAll("section")).toHaveLength(
      md.match(/^## /gm)?.length ?? -1,
    );
    expect(screen.getByRole("link", { name: "laboon.app@gmail.com" })).toHaveAttribute(
      "href",
      "mailto:laboon.app@gmail.com",
    );
  });

  it("does not overflow on mobile: no fixed width in the markup", () => {
    // jsdom has no layout: the 375 px behaviour comes from the shared blocks (DocBody padding
    // `p-7 sm:p-14`, text wrapping) and is checked in the browser preview (docs/features/legal-documents.md).
    const { container } = render(
      <LegalMarkdown markdown={fixture("confidentialite.fr.md")} />,
    );
    expect(container.innerHTML).not.toMatch(/(?:min-)?w-\[\d+px\]|style=/);
  });
});

describe("LegalMarkdown — forbidden HTML", () => {
  const forbidden = [
    "<script>alert(1)</script>",
    "<img src=x onerror=alert(1)>",
    "<b>x</b>",
    '<iframe src="https://evil.example"></iframe>',
    "<!-- comment -->",
  ];

  it.each(forbidden)("drops inline %s: no element, no tag shown as text", (html) => {
    const { container } = render(
      <LegalMarkdown markdown={`## A\n\nBefore ${html} after`} />,
    );
    expect(container.querySelector("script, img, b, iframe")).toBeNull();
    expect(container.innerHTML).not.toMatch(/onerror|<!--/);
    expect(container.textContent).not.toMatch(/[<>]/);
  });

  it.each(forbidden)("drops block-level %s", (html) => {
    const { container } = render(<LegalMarkdown markdown={`## A\n\n${html}\n\nAfter`} />);
    expect(container.querySelector("script, img, b, iframe")).toBeNull();
    expect(container.textContent).not.toMatch(/[<>]/);
    expect(screen.getByText("After")).toBeInTheDocument();
  });

  it("drops an image", () => {
    const { container } = render(
      <LegalMarkdown markdown={"## A\n\n![x](https://evil/x.png)"} />,
    );
    expect(container.querySelector("img")).toBeNull();
  });
});

describe("LegalMarkdown — forbidden links", () => {
  const targets = [
    "javascript:alert(1)",
    "JavaScript:alert(1)",
    "data:text/html;base64,PHNjcmlwdD5hbGVydCgxKTwvc2NyaXB0Pg==",
    "http://insecure.example",
    "//evil.example",
    "/relative",
  ];

  it.each(targets)("does not make [x](%s) clickable", (url) => {
    const { container } = render(
      <LegalMarkdown markdown={`## A\n\n[x](<${url}>) done`} />,
    );
    expect(container.querySelector("a")).toBeNull();
    expect(container.querySelector("[href]")).toBeNull();
    expect(container.textContent).toContain("x done");
  });

  it("does not make a reference link clickable", () => {
    const { container } = render(
      <LegalMarkdown markdown={"## A\n\n[x][1]\n\n[1]: javascript:alert(1)"} />,
    );
    expect(container.querySelector("a, [href]")).toBeNull();
    expect(container.textContent).not.toContain("javascript");
  });
});
