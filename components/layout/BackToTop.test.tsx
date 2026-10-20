import { act, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { BackToTop } from "./BackToTop";

beforeEach(() => {
  vi.stubGlobal("requestAnimationFrame", (cb: FrameRequestCallback) => {
    cb(0);
    return 1;
  });
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({ matches: false })),
  );
  window.scrollTo = vi.fn();
  Object.defineProperty(window, "innerHeight", { value: 800, configurable: true });
});

afterEach(() => {
  Object.defineProperty(window, "scrollY", { value: 0, configurable: true });
});

function scrollTo(y: number) {
  Object.defineProperty(window, "scrollY", { value: y, configurable: true });
  act(() => {
    window.dispatchEvent(new Event("scroll"));
  });
}

describe("BackToTop", () => {
  it("is hidden from everyone at the top of the page", () => {
    render(<BackToTop />);
    const button = screen.getByRole("button", { hidden: true });
    expect(button).toHaveAttribute("aria-hidden", "true");
    expect(button).toHaveAttribute("tabindex", "-1");
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("appears after one screen of scroll, named in the page language", () => {
    render(
      <LocaleProvider locale="en">
        <BackToTop />
      </LocaleProvider>,
    );
    scrollTo(1200);
    expect(
      screen.getByRole("button", { name: "Back to the top of the page" }),
    ).toBeVisible();
  });

  it("scrolls smoothly to the top", async () => {
    render(<BackToTop />);
    scrollTo(1200);
    await userEvent.click(
      screen.getByRole("button", { name: "Retour en haut de la page" }),
    );
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "smooth" });
  });

  it("does not animate when the visitor asked for reduced motion", async () => {
    vi.stubGlobal(
      "matchMedia",
      vi.fn(() => ({ matches: true })),
    );
    render(<BackToTop />);
    scrollTo(1200);
    await userEvent.click(
      screen.getByRole("button", { name: "Retour en haut de la page" }),
    );
    expect(window.scrollTo).toHaveBeenCalledWith({ top: 0, behavior: "auto" });
  });
});
