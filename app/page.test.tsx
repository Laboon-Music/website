import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { FAQ_CONTENT } from "@/content/faq";
import { HOME_CONTENT } from "@/content/home";
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

describe("home page", () => {
  it("renders the texts from content/home.ts", () => {
    render(<Home />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(
      HOME_CONTENT.hero.title,
    );
    expect(
      screen.getByRole("heading", { level: 2, name: HOME_CONTENT.values.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: HOME_CONTENT.steps.title }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("heading", { level: 2, name: HOME_CONTENT.finalCta.title }),
    ).toBeInTheDocument();
    for (const item of HOME_CONTENT.values.items) {
      expect(
        screen.getByRole("heading", { level: 3, name: item.title }),
      ).toBeInTheDocument();
    }
    for (const step of HOME_CONTENT.steps.items) {
      expect(screen.getByText(step.text)).toBeInTheDocument();
    }
  });

  it("reads the manifesto as one sentence, not word by word", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 2, name: HOME_CONTENT.manifesto.text }),
    ).toBeInTheDocument();
  });

  it("has two signup forms and a header button that leads to the closing one", () => {
    render(<Home />);
    expect(
      screen.getAllByRole("button", { name: HOME_CONTENT.signup.submit }),
    ).toHaveLength(2);
    expect(screen.getByRole("link", { name: HOME_CONTENT.nav.join })).toHaveAttribute(
      "href",
      "#rejoindre",
    );
    expect(document.getElementById("rejoindre")).toBeInTheDocument();
    expect(document.getElementById("inscription")).toBeInTheDocument();
  });

  it("includes the FAQ with every question", () => {
    render(<Home />);
    expect(
      screen.getByRole("heading", { level: 2, name: FAQ_CONTENT.title }),
    ).toBeInTheDocument();
    for (const group of FAQ_CONTENT.groups) {
      expect(
        screen.getByRole("heading", { level: 3, name: group.title }),
      ).toBeInTheDocument();
    }
  });

  it("has a single h1, a skip link and a main landmark", () => {
    render(<Home />);
    expect(screen.getAllByRole("heading", { level: 1 })).toHaveLength(1);
    expect(screen.getByRole("link", { name: "Aller au contenu" })).toHaveAttribute(
      "href",
      "#contenu",
    );
    expect(screen.getByRole("main")).toHaveAttribute("id", "contenu");
  });

  it("keeps decoration out of the accessibility tree", () => {
    const { container } = render(<Home />);
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
    const { default: userEvent } = await import("@testing-library/user-event");
    const { container } = render(<Home />);
    const button = screen.getByRole("button", { name: HOME_CONTENT.motion.pause });
    expect(button).toHaveAttribute("aria-pressed", "false");
    await userEvent.click(button);
    expect(
      screen.getByRole("button", { name: HOME_CONTENT.motion.resume }),
    ).toHaveAttribute("aria-pressed", "true");
    expect(container.querySelector(".home")).toHaveClass("is-paused");
  });
});
