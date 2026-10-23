import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PageShell, SiteHeader } from ".";

describe("PageShell", () => {
  it("renders the header, the content and the footer", () => {
    render(<PageShell>content</PageShell>);
    expect(
      screen.getByRole("link", { name: "Laboon, retour à l'accueil" }),
    ).toHaveAttribute("href", "/");
    expect(screen.getByRole("link", { name: "M’inscrire" })).toHaveAttribute(
      "href",
      "/#rejoindre",
    );
    expect(screen.getByText("content")).toBeInTheDocument();
    expect(screen.getByRole("contentinfo")).toBeInTheDocument();
  });

  it("groups the footer links in a labelled navigation", () => {
    render(<PageShell>x</PageShell>);
    const nav = screen.getByRole("navigation", { name: "Pied de page" });
    expect(nav).toContainElement(screen.getByRole("link", { name: "FAQ" }));
    expect(screen.getByRole("link", { name: "FAQ" })).toHaveAttribute("href", "/#faq");
    expect(screen.getByRole("link", { name: "Mentions légales" })).toHaveAttribute(
      "href",
      "/mentions-legales",
    );
    expect(screen.getByRole("link", { name: "Confidentialité" })).toHaveAttribute(
      "href",
      "/confidentialite",
    );
  });

  it("links to every social network in a new tab, announced as such", () => {
    render(<PageShell>x</PageShell>);
    const instagram = screen.getByRole("link", { name: "Instagram (nouvel onglet)" });
    expect(instagram).toHaveAttribute("target", "_blank");
    expect(instagram).toHaveAttribute("rel", "noopener noreferrer");
    expect(
      screen.getByRole("link", { name: "Facebook (nouvel onglet)" }),
    ).toBeInTheDocument();
  });
});

describe("PageShell accessibility", () => {
  it("offers a skip link to the main content", () => {
    render(<PageShell>content</PageShell>);
    const skip = screen.getByRole("link", { name: "Aller au contenu" });
    expect(skip).toHaveAttribute("href", "#contenu");
    expect(screen.getByRole("main")).toHaveAttribute("id", "contenu");
    expect(screen.getByRole("main")).toHaveTextContent("content");
  });

  it("hides the decorative disc from assistive technology", () => {
    const { container } = render(<PageShell>x</PageShell>);
    expect(container.querySelector(".bg-disc")).toHaveAttribute("aria-hidden", "true");
  });
});

describe("SiteHeader", () => {
  it("accepts custom targets for the logo and the call to action", () => {
    render(<SiteHeader logoHref="#top" ctaHref="#rejoindre" />);
    expect(screen.getByRole("link", { name: /Laboon/ })).toHaveAttribute("href", "#top");
    expect(screen.getByRole("link", { name: "M’inscrire" })).toHaveAttribute(
      "href",
      "#rejoindre",
    );
  });
});
