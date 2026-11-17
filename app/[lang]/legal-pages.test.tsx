import { readFileSync } from "node:fs";
import { join } from "node:path";
import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { LEGAL_SLUGS } from "@/lib/legal-slugs";
import type { LegalVersion, LegalVersionResult } from "@/lib/legal-api";
import { NOINDEX } from "@/lib/page-metadata";

// The public legal pages and the embed read the version in force from the API
// (mocked here: no network). See docs/features/legal-documents.md.

const fetchLegalInForce =
  vi.fn<(slug: string, locale: string) => Promise<LegalVersionResult>>();
let failWith: Error | null = null;
vi.mock("@/lib/legal-api", () => ({
  fetchLegalInForce: async (slug: string, locale: string) => {
    if (failWith) throw failWith;
    return fetchLegalInForce(slug, locale);
  },
}));
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/",
}));

import Page, * as pageModule from "./[document]/page";
import EmbedPage, * as embed from "./legal/[slug]/page";
import CatchAll from "./[...slug]/page";

const NOT_FOUND = "NEXT_HTTP_ERROR_FALLBACK;404";
const PRIVACY_MD = readFileSync(
  join(process.cwd(), "components/legal/fixtures/confidentialite.fr.md"),
  "utf8",
);

const docFor = (slug: string, locale: "fr" | "en"): LegalVersion => ({
  slug,
  title: `Titre ${slug} ${locale}`,
  version: 4,
  effectiveDate: "2026-11-02",
  locale,
  bodyMd:
    slug === "confidentialite" ? PRIVACY_MD : `Texte de ${slug}\n\n## Un {#un}\n\nCorps`,
});

beforeEach(() => {
  fetchLegalInForce.mockReset();
  fetchLegalInForce.mockImplementation(async (slug, locale) => ({
    kind: "found",
    doc: docFor(slug, locale as "fr" | "en"),
  }));
  failWith = null;
});

const embedProps = (l: string, slug: string) => ({
  params: Promise.resolve({ lang: l, slug }),
});

const docProps = (l: string, document: string) => ({
  params: Promise.resolve({ lang: l, document }),
});

describe.each(LEGAL_SLUGS)("public page /%s", (slug) => {
  const lang = (l: string) => docProps(l, slug);
  const mod = pageModule;
  it.each(["fr", "en"] as const)(
    "renders the API text and header in %s",
    async (locale) => {
      render(<LocaleProvider locale={locale}>{await Page(lang(locale))}</LocaleProvider>);

      expect(fetchLegalInForce).toHaveBeenCalledWith(slug, locale);
      expect(
        screen.getByRole("heading", { level: 1, name: `Titre ${slug} ${locale}` }),
      ).toBeTruthy();
      expect(
        screen.getByText(
          locale === "en"
            ? "Version 4 — effective from November 2, 2026"
            : "Version 4 — en vigueur à compter du 2 novembre 2026",
        ),
      ).toBeTruthy();
      // Site chrome is present.
      expect(screen.getByRole("contentinfo")).toBeTruthy();
      // Link to the history of versions.
      expect(
        screen
          .getByRole("link", {
            name:
              locale === "en" ? "See previous versions" : "Voir les versions précédentes",
          })
          .getAttribute("href"),
      ).toBe(`${locale === "en" ? "/en" : ""}/${slug}/versions`);
    },
  );

  it("takes its title from the API and is cached 300 s without a build-time render", async () => {
    const meta = await mod.generateMetadata(lang("fr"));
    expect(meta.title).toBe(`Titre ${slug} fr — Laboon`);
    expect(mod.revalidate).toBe(300);
    expect(mod.generateStaticParams()).toEqual([]);
  });

  it("is a 404 when nothing is in force", async () => {
    fetchLegalInForce.mockResolvedValue({ kind: "not_found" });
    await expect(Page(lang("fr"))).rejects.toThrow(NOT_FOUND);
    await expect(mod.generateMetadata(lang("fr"))).rejects.toThrow(NOT_FOUND);
  });

  it("lets an API failure throw (HTTP 5xx, the last cached page stays), never an empty 200", async () => {
    failWith = new Error("Legal document unavailable");
    await expect(Page(lang("fr"))).rejects.toThrow("Legal document unavailable");
  });
});

describe("/confidentialite#suppression-compte", () => {
  it.each(["fr", "en"] as const)("has the deletion anchor in %s", async (locale) => {
    const { container } = render(await Page(docProps(locale, "confidentialite")));
    expect(container.querySelector("section#suppression-compte h2")).not.toBeNull();
  });
});

describe("embed /legal/<slug>", () => {
  it("renders any slug the API knows, bare and noindex", async () => {
    render(await EmbedPage(embedProps("fr", "nouveau-document")));

    expect(fetchLegalInForce).toHaveBeenCalledWith("nouveau-document", "fr");
    expect(
      screen.getByRole("heading", { level: 1, name: "Titre nouveau-document fr" }),
    ).toBeTruthy();
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();
    expect(screen.queryByRole("link", { name: /versions/ })).toBeNull();
    const meta = await embed.generateMetadata(embedProps("fr", "cgu"));
    expect(meta.robots).toEqual(NOINDEX);
    expect(embed.revalidate).toBe(300);
    expect(embed.generateStaticParams()).toEqual([]);
  });

  it("is a 404 for an unknown slug", async () => {
    fetchLegalInForce.mockResolvedValue({ kind: "not_found" });
    await expect(EmbedPage(embedProps("fr", "inconnu"))).rejects.toThrow(NOT_FOUND);
  });

  it.each(["../x", "A B", "x".repeat(65)])(
    "is a 404 without calling the API for the slug %s",
    async (slug) => {
      await expect(EmbedPage(embedProps("fr", slug))).rejects.toThrow(NOT_FOUND);
      expect(fetchLegalInForce).not.toHaveBeenCalled();
    },
  );

  it("lets an API failure throw", async () => {
    failWith = new Error("Legal document unavailable");
    await expect(EmbedPage(embedProps("fr", "cgu"))).rejects.toThrow(
      "Legal document unavailable",
    );
  });
});

describe("/cgv and other unknown pages", () => {
  it.each(["cgv", "inconnu"])(
    "/%s is a 404 without calling the API",
    async (document) => {
      await expect(Page(docProps("fr", document))).rejects.toThrow(NOT_FOUND);
      await expect(pageModule.generateMetadata(docProps("fr", document))).rejects.toThrow(
        NOT_FOUND,
      );
      expect(fetchLegalInForce).not.toHaveBeenCalled();
      expect([...LEGAL_SLUGS]).not.toContain("cgv");
    },
  );

  it("an unknown language is a 404", async () => {
    await expect(Page(docProps("de", "cgu"))).rejects.toThrow(NOT_FOUND);
  });
});
