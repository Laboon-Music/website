import { render, screen } from "@testing-library/react";
import { StrictMode } from "react";
import { describe, expect, it } from "vitest";
import { useCodeFromUrl } from "./useCodeFromUrl";

function Probe() {
  const code = useCodeFromUrl();
  return <p>{code === undefined ? "loading" : (code ?? "none")}</p>;
}

describe("useCodeFromUrl", () => {
  it("keeps the code even when effects run twice (Strict Mode), and clears the URL", async () => {
    window.history.replaceState(null, "", "/reset-password?code=lbc_abc");
    render(
      <StrictMode>
        <Probe />
      </StrictMode>,
    );
    expect(await screen.findByText("lbc_abc")).toBeInTheDocument();
    expect(window.location.search).toBe("");
  });

  it("reports no code when the link has none", async () => {
    window.history.replaceState(null, "", "/reset-password");
    render(<Probe />);
    expect(await screen.findByText("none")).toBeInTheDocument();
  });
});
