import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import ErrorPage from "./error";
import NotFound from "./not-found";

describe("error pages", () => {
  it("404 is in French and links home", () => {
    render(<NotFound />);
    expect(screen.getByRole("heading", { level: 1 })).toHaveTextContent(/sourdine/);
    expect(screen.getByRole("link", { name: "Retour à l'accueil" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("error boundary lets the visitor retry", async () => {
    const reset = vi.fn();
    render(<ErrorPage error={new Error("boom")} reset={reset} />);
    await userEvent.click(screen.getByRole("button", { name: "Réessayer" }));
    expect(reset).toHaveBeenCalled();
  });
});
