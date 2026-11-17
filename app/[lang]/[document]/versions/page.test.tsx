import { render, screen, within } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { axeViolations } from "@/tests/axe";
import type { Locale } from "@/lib/i18n";
import type { LegalVersionSummary, LegalVersionsResult } from "@/lib/legal-api";

// The history page reads the versions from the API (mocked here: no network).
// See docs/features/legal-documents.md.

const fetchLegalVersions =
  vi.fn<(slug: string, locale: string) => Promise<LegalVersionsResult>>();
let failWith: Error | null = null;
vi.mock("@/lib/legal-api", () => ({
  fetchLegalVersions: async (slug: string, locale: string) => {
    if (failWith) throw failWith;
    return fetchLegalVersions(slug, locale);
  },
}));
vi.mock("next/navigation", async (importOriginal) => ({
  ...(await importOriginal<typeof import("next/navigation")>()),
  usePathname: () => "/",
}));

import Page, { generateMetadata, generateStaticParams, revalidate } from "./page";

const NOT_FOUND = "NEXT_HTTP_ERROR_FALLBACK;404";
const props = (lang: string, document: string) => ({
  params: Promise.resolve({ lang, document }),
});

// Links are localized from the page's language, as in the site layout.
const inLocale = (locale: Locale, node: React.ReactNode) => (
  <LocaleProvider locale={locale}>{node}</LocaleProvider>
);

const row = (
  locale: "fr" | "en",
  over: Partial<LegalVersionSummary>,
): LegalVersionSummary => ({
  version: 1,
  effectiveDate: "2026-10-22",
  title: locale === "fr" ? "Conditions générales d’utilisation" : "Terms of Use",
  locale,
  changeSummary: null,
  inForce: false,
  ...over,
});

const versionsFor = (locale: "fr" | "en") => [
  row(locale, {
    version: 2,
    effectiveDate: "2026-12-01",
    inForce: true,
    changeSummary: "Nouvelle clause",
  }),
  row(locale, { version: 1 }),
];

beforeEach(() => {
  fetchLegalVersions.mockReset();
  fetchLegalVersions.mockImplementation(async (_slug, locale) => ({
    kind: "found",
    versions: versionsFor(locale as "fr" | "en"),
  }));
  failWith = null;
});

describe("legal version history page", () => {
  it("lists the versions newest first with date, in-force mark and links (French)", async () => {
    render(inLocale("fr", await Page(props("fr", "cgu"))));

    expect(fetchLegalVersions).toHaveBeenCalledWith("cgu", "fr");
    expect(
      screen.getByRole("heading", {
        level: 1,
        name: "Conditions générales d’utilisation — historique des versions",
      }),
    ).toBeTruthy();
    const items = within(screen.getByRole("main")).getAllByRole("listitem");
    expect(items).toHaveLength(2);
    expect(within(items[0]).getByText("Version 2")).toBeTruthy();
    expect(
      within(items[0]).getByText("En vigueur à compter du 1 décembre 2026"),
    ).toBeTruthy();
    expect(within(items[0]).getByText("En vigueur")).toBeTruthy();
    expect(within(items[0]).getByText("Nouvelle clause")).toBeTruthy();
    expect(
      within(items[0])
        .getByRole("link", { name: "Lire la version 2" })
        .getAttribute("href"),
    ).toBe("/legal/cgu/2?lang=fr");
    expect(within(items[1]).getByText("Version 1")).toBeTruthy();
    expect(within(items[1]).queryByText("En vigueur")).toBeNull();
    expect(
      within(items[1])
        .getByRole("link", { name: "Lire la version 1" })
        .getAttribute("href"),
    ).toBe("/legal/cgu/1?lang=fr");
  });

  it("lists the versions in English, linking to the English frozen pages", async () => {
    render(inLocale("en", await Page(props("en", "cgu"))));

    expect(
      screen.getByRole("heading", { level: 1, name: "Terms of Use — version history" }),
    ).toBeTruthy();
    expect(screen.getAllByText("Effective from December 1, 2026")).toHaveLength(1);
    expect(screen.getByText("In force")).toBeTruthy();
    expect(
      screen.getByRole("link", { name: "Read version 2" }).getAttribute("href"),
    ).toBe("/en/legal/cgu/2?lang=en");
  });

  it("marks the language when the API answered another one", async () => {
    fetchLegalVersions.mockResolvedValue({ kind: "found", versions: versionsFor("fr") });
    const { container } = render(inLocale("en", await Page(props("en", "cgu"))));
    expect(container.querySelector("[lang='fr']")).not.toBeNull();
  });

  it("has no accessibility violation", async () => {
    render(inLocale("fr", await Page(props("fr", "cgu"))));
    expect(await axeViolations()).toEqual([]);
  });

  it("has a title and hreflang alternates, is cached 300 s and not built", async () => {
    const meta = await generateMetadata(props("en", "cgu"));
    expect(meta.title).toBe("Terms of Use — version history — Laboon");
    expect(meta.alternates?.languages).toMatchObject({
      fr: "/cgu/versions",
      en: "/en/cgu/versions",
    });
    expect(revalidate).toBe(300);
    expect(generateStaticParams()).toEqual([]);
  });

  it.each(["cgv", "inconnu"])(
    "/%s/versions is a 404 without calling the API",
    async (document) => {
      await expect(Page(props("fr", document))).rejects.toThrow(NOT_FOUND);
      await expect(generateMetadata(props("fr", document))).rejects.toThrow(NOT_FOUND);
      expect(fetchLegalVersions).not.toHaveBeenCalled();
    },
  );

  it("is a 404 when the API has nothing to list", async () => {
    fetchLegalVersions.mockResolvedValue({ kind: "not_found" });
    await expect(Page(props("fr", "cgu"))).rejects.toThrow(NOT_FOUND);

    fetchLegalVersions.mockResolvedValue({ kind: "found", versions: [] });
    await expect(Page(props("fr", "cgu"))).rejects.toThrow(NOT_FOUND);
  });

  it("lets an API failure throw, never an empty 200", async () => {
    failWith = new Error("Legal document unavailable");
    await expect(Page(props("fr", "cgu"))).rejects.toThrow("Legal document unavailable");
  });
});
