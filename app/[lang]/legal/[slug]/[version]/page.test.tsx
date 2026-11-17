import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { NOINDEX } from "@/lib/page-metadata";
import type { LegalVersionResult } from "@/lib/legal-api";

const fetchLegalVersion = vi.fn<(...args: unknown[]) => Promise<LegalVersionResult>>();
// When set, the API read fails (a plain async function: a rejecting vi.fn is reported as unhandled).
let failWith: Error | null = null;
vi.mock("@/lib/legal-api", () => ({
  fetchLegalVersion: async (...args: unknown[]) => {
    if (failWith) throw failWith;
    return fetchLegalVersion(...args);
  },
}));

import LegalVersionPage, { generateMetadata } from "./page";

const props = (lang: string, slug: string, version: string) => ({
  params: Promise.resolve({ lang, slug, version }),
});

const DOC = {
  slug: "cgu",
  title: "Conditions générales d’utilisation",
  version: 1,
  effectiveDate: "2026-10-22",
  locale: "fr" as const,
  bodyMd: "Intro du texte\n\n## Article un {#un}\n\nCorps de l’article",
};

beforeEach(() => {
  fetchLegalVersion.mockReset();
  failWith = null;
});

describe("frozen legal version page", () => {
  it("renders the title, the version header and the Markdown body", async () => {
    fetchLegalVersion.mockResolvedValue({ kind: "found", doc: DOC });
    render(await LegalVersionPage(props("fr", "cgu", "1")));

    expect(fetchLegalVersion).toHaveBeenCalledWith("cgu", "fr", 1);
    expect(screen.getByRole("heading", { level: 1, name: DOC.title })).toBeTruthy();
    expect(
      screen.getByText("Version 1 — en vigueur à compter du 22 octobre 2026"),
    ).toBeTruthy();
    expect(screen.getByText("Intro du texte")).toBeTruthy();
    expect(screen.getByRole("heading", { name: "Article un" })).toBeTruthy();
    expect(screen.getByText("Corps de l’article")).toBeTruthy();
  });

  it("renders in the language the API resolved when it differs from the one asked", async () => {
    fetchLegalVersion.mockResolvedValue({ kind: "found", doc: DOC });
    const { container } = render(await LegalVersionPage(props("en", "cgu", "1")));

    expect(fetchLegalVersion).toHaveBeenCalledWith("cgu", "en", 1);
    expect(
      screen.getByText("Version 1 — en vigueur à compter du 22 octobre 2026"),
    ).toBeTruthy();
    expect(container.querySelector("main")?.getAttribute("lang")).toBe("fr");
  });

  it("renders English dates for an English document, without a lang override", async () => {
    fetchLegalVersion.mockResolvedValue({ kind: "found", doc: { ...DOC, locale: "en" } });
    const { container } = render(await LegalVersionPage(props("en", "cgu", "1")));

    expect(screen.getByText("Version 1 — effective from October 22, 2026")).toBeTruthy();
    expect(container.querySelector("main")?.hasAttribute("lang")).toBe(false);
  });

  it("has no site chrome and is noindex", async () => {
    fetchLegalVersion.mockResolvedValue({ kind: "found", doc: DOC });
    render(await LegalVersionPage(props("fr", "cgu", "1")));
    expect(screen.queryByRole("navigation")).toBeNull();
    expect(screen.queryByRole("contentinfo")).toBeNull();

    const meta = await generateMetadata(props("fr", "cgu", "1"));
    expect(meta.robots).toEqual(NOINDEX);
    expect(meta.title).toContain(DOC.title);
  });

  it("is a 404 for an unknown version", async () => {
    fetchLegalVersion.mockResolvedValue({ kind: "not_found" });
    await expect(LegalVersionPage(props("fr", "cgu", "99"))).rejects.toThrow(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
    await expect(generateMetadata(props("fr", "cgu", "99"))).rejects.toThrow(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
  });

  it("never shows a draft: the API's 404 is a 404 page", async () => {
    fetchLegalVersion.mockResolvedValue({ kind: "not_found" });
    await expect(LegalVersionPage(props("fr", "cgu", "2"))).rejects.toThrow(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
  });

  it.each(["0", "abc", "-1", "1.5", "01", "1e3"])(
    "is a 404 without calling the API for version %s",
    async (version) => {
      await expect(LegalVersionPage(props("fr", "cgu", version))).rejects.toThrow(
        "NEXT_HTTP_ERROR_FALLBACK;404",
      );
      expect(fetchLegalVersion).not.toHaveBeenCalled();
    },
  );

  it("is a 404 without calling the API for a malformed slug or language", async () => {
    await expect(LegalVersionPage(props("fr", "../x", "1"))).rejects.toThrow(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
    await expect(LegalVersionPage(props("de", "cgu", "1"))).rejects.toThrow(
      "NEXT_HTTP_ERROR_FALLBACK;404",
    );
    expect(fetchLegalVersion).not.toHaveBeenCalled();
  });

  it("lets an API failure throw (HTTP 5xx), never an empty 200 page", async () => {
    failWith = new Error("Legal document unavailable");
    await expect(LegalVersionPage(props("fr", "cgu", "1"))).rejects.toThrow(
      "Legal document unavailable",
    );
  });
});
