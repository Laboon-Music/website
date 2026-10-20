import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { getContent } from "@/content";
import { LOCALES, type Locale } from "@/lib/i18n";
import { langParams } from "@/tests/params";
import Home from "./page";

// The scroll-driven scene needs a real browser (canvas, layout): it is replaced
// by a no-op here. Its maths are covered in lib/scene-math.test.ts.
vi.mock("@/components/home/scene", () => ({
  startHomeScene: vi.fn(() => ({ reveal: vi.fn(), destroy: vi.fn() })),
}));

beforeEach(() => {
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
});

async function renderHome(locale: Locale) {
  return render(
    <LocaleProvider locale={locale}>{await Home(langParams(locale))}</LocaleProvider>,
  );
}

describe.each(LOCALES)("home page (%s)", (locale) => {
  const { home, faq, ui } = getContent(locale);

  it("renders the texts of its language", async () => {
    await renderHome(locale);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(home.hero.title);
    for (const title of [home.values.title, home.steps.title, home.finalCta.title]) {
      expect(screen.getByRole("heading", { level: 2, name: title })).toBeInTheDocument();
    }
    for (const item of home.values.items) {
      expect(
        screen.getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
    }
    for (const step of home.steps.items) {
      expect(screen.getByText(step.text)).toBeInTheDocument();
    }
  });

  it("reads the manifesto as one sentence, not word by word", async () => {
    await renderHome(locale);
    expect(
      screen.getByRole("heading", { level: 2, name: home.manifesto.text }),
    ).toBeInTheDocument();
  });

  it("has two signup forms and a header button that leads to the closing one", async () => {
    await renderHome(locale);
    expect(screen.getAllByRole("button", { name: home.signup.submit })).toHaveLength(2);
    expect(screen.getByRole("link", { name: home.nav.join })).toHaveAttribute(
      "href",
      "#rejoindre",
    );
    expect(document.getElementById("rejoindre")).toBeInTheDocument();
    expect(document.getElementById("inscription")).toBeInTheDocument();
  });

  it("includes the FAQ with every group", async () => {
    await renderHome(locale);
    expect(
      screen.getByRole("heading", { level: 2, name: faq.title }),
    ).toBeInTheDocument();
    for (const group of faq.groups) {
      expect(
        screen.getByRole("heading", { level: 3, name: group.title }),
      ).toBeInTheDocument();
    }
  });

  it("has a single h1, a skip link and a main landmark", async () => {
    await renderHome(locale);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: ui.skipLink })).toHaveAttribute(
      "href",
      "#contenu",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "contenu");
  });

  it("keeps decoration out of the accessibility tree", async () => {
    const { container } = await renderHome(locale);
    for (const selector of [
      ".disc",
      ".field",
      ".intro-mark",
      ".bgflow",
      ".stepper__visual",
    ]) {
      expect(container.querySelector(selector)).toHaveAttribute("aria-hidden", "true");
    }
  });

  it("lets the visitor pause the animations", async () => {
    const { container } = await renderHome(locale);
    const button = screen.getByRole("button", { name: home.motion.pause });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(screen.getByRole("button", { name: home.motion.resume })).toHaveAttribute(
      "aria-pressed",
      "true",
    );
    expect(container.querySelector(".home")).toHaveClass("is-paused");
  });
});

describe("home page links follow the language", () => {
  it("keeps English visitors on English pages", async () => {
    await renderHome("en");
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/en/contact");
    expect(hrefs).toContain("/en#faq");
    expect(hrefs).not.toContain("/contact");
  });

  it("leaves French URLs without a prefix", async () => {
    await renderHome("fr");
    const hrefs = screen.getAllByRole("link").map((a) => a.getAttribute("href"));
    expect(hrefs).toContain("/contact");
    expect(hrefs).toContain("/#faq");
  });
});
