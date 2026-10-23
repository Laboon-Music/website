import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockFetch, sentJson } from "@/tests/helpers";
import { UI as FR } from "@/content/fr/ui";
import { HOME_CONTENT } from "@/content/fr/home";
import { trackEvent } from "@/lib/analytics";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { HOME_CONTENT as EN_HOME } from "@/content/en/home";
import SignupForm from "./SignupForm";

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

const push = vi.hoisted(() => vi.fn());
vi.mock("next/navigation", () => ({ useRouter: () => ({ push }) }));

describe("SignupForm", () => {
  it("submits the email, the chosen lists and the anti-bot fields", async () => {
    const fetchMock = mockFetch(200, { ok: true });
    const user = userEvent.setup();
    render(<SignupForm texts={HOME_CONTENT.signup} />);

    await user.type(screen.getByLabelText("Ton e-mail"), "jane@example.com");
    await user.click(screen.getByLabelText("Tester la bêta en avant-première"));
    await user.click(screen.getByRole("button", { name: "M’inscrire" }));

    expect(fetchMock.mock.calls[0][0]).toBe("/api/subscribe");
    expect(sentJson(fetchMock)).toMatchObject({
      email: "jane@example.com",
      wantsLaunch: true,
      wantsBeta: true,
      website: "",
      turnstileToken: "",
      elapsedMs: expect.any(Number),
    });
    // The confirmation is its own page: the visitor is sent there, the button keeps spinning meanwhile.
    await waitFor(() => expect(push).toHaveBeenCalledWith("/inscription-envoyee"));
    expect(screen.getAllByRole("button", { name: "Envoi…" })[0]).toHaveAttribute(
      "aria-busy",
      "true",
    );
    expect(trackEvent).toHaveBeenCalledWith("signup_submitted", {
      launch: true,
      beta: true,
    });
  });

  it("requires at least one list without calling the API", async () => {
    const fetchMock = mockFetch();
    const user = userEvent.setup();
    render(<SignupForm texts={HOME_CONTENT.signup} />);

    await user.type(screen.getByLabelText("Ton e-mail"), "jane@example.com");
    await user.click(screen.getByLabelText("Me prévenir du lancement"));
    await user.click(screen.getByRole("button", { name: "M’inscrire" }));

    expect(screen.getByRole("alert")).toHaveTextContent(FR.errors.noList);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("shows the API error message and ties it to the e-mail field", async () => {
    mockFetch(400, { error: "Adresse email invalide." });
    const user = userEvent.setup();
    render(<SignupForm texts={HOME_CONTENT.signup} />);

    await user.click(screen.getByRole("button", { name: "M’inscrire" }));

    const alert = await screen.findByRole("alert");
    expect(alert).toHaveTextContent("Adresse email invalide.");
    const input = screen.getByLabelText("Ton e-mail");
    expect(input).toHaveAttribute("aria-invalid", "true");
    expect(input).toHaveAttribute("aria-describedby", alert.id);
    expect(trackEvent).not.toHaveBeenCalled();
  });

  it("sends English visitors to the English confirmation page", async () => {
    mockFetch(200, { ok: true });
    const user = userEvent.setup();
    render(
      <LocaleProvider locale="en">
        <SignupForm texts={EN_HOME.signup} />
      </LocaleProvider>,
    );
    await user.type(screen.getByLabelText("Your e-mail"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Sign up" }));
    await waitFor(() => expect(push).toHaveBeenCalledWith("/en/inscription-envoyee"));
  });

  it("tells an empty or wrong e-mail at once, without calling the API or showing a spinner", async () => {
    const fetchMock = mockFetch();
    const user = userEvent.setup();
    render(<SignupForm texts={HOME_CONTENT.signup} />);

    await user.click(screen.getByRole("button", { name: "M’inscrire" }));
    expect(screen.getByRole("alert")).toHaveTextContent(FR.errors.invalidEmail);
    expect(screen.getByLabelText("Ton e-mail")).toHaveFocus();
    expect(screen.getByLabelText("Ton e-mail")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "M’inscrire" })).not.toHaveAttribute(
      "aria-busy",
    );

    await user.type(screen.getByLabelText("Ton e-mail"), "not-an-email");
    await user.click(screen.getByRole("button", { name: "M’inscrire" }));
    expect(screen.getByRole("alert")).toHaveTextContent(FR.errors.invalidEmail);
    expect(fetchMock).not.toHaveBeenCalled();
  });

  it("starts with the launch list checked and the beta unchecked", () => {
    render(<SignupForm texts={HOME_CONTENT.signup} />);
    expect(screen.getByLabelText("Me prévenir du lancement")).toBeChecked();
    expect(screen.getByLabelText("Tester la bêta en avant-première")).not.toBeChecked();
  });

  it("shrinks the e-mail group to the field from sm so the form centres it", () => {
    render(<SignupForm texts={HOME_CONTENT.signup} />);
    // Label + field row: full width on mobile, as wide as the fixed-width field from sm.
    const group = screen
      .getByLabelText("Ton e-mail")
      .closest(".field-row")!.parentElement!;
    expect(group.className).toContain("w-full");
    expect(group.className).toContain("sm:w-auto");
  });

  it("centres the checkbox block without an offset", () => {
    render(<SignupForm texts={HOME_CONTENT.signup} />);
    // The block is centred by the form: a side padding would push it off-centre.
    const block = screen
      .getByLabelText("Me prévenir du lancement")
      .closest("label")!.parentElement!;
    expect(block.className).not.toMatch(/\bp[lrx]-/);
  });
});
