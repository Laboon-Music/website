import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockFetch, sentJson } from "@/tests/helpers";
import { GENERIC_ERROR } from "@/hooks/useProtectedForm";
import { trackEvent } from "@/lib/analytics";
import ContactForm from "./ContactForm";

vi.mock("@/lib/analytics", () => ({ trackEvent: vi.fn() }));

async function fillAndSend() {
  const user = userEvent.setup();
  await user.type(screen.getByLabelText("Nom"), "Jane");
  await user.type(screen.getByLabelText("E-mail"), "jane@example.com");
  await user.selectOptions(screen.getByLabelText("Sujet"), "partenariat");
  await user.type(screen.getByLabelText("Message"), "Hello Laboon team!");
  await user.click(screen.getByRole("button", { name: "Envoyer" }));
}

describe("ContactForm", () => {
  it("sends the message and confirms", async () => {
    const fetchMock = mockFetch(200, { ok: true });
    render(<ContactForm />);

    await fillAndSend();

    expect(fetchMock.mock.calls[0][0]).toBe("/api/contact");
    expect(sentJson(fetchMock)).toMatchObject({
      name: "Jane",
      email: "jane@example.com",
      subject: "partenariat",
      message: "Hello Laboon team!",
      website: "",
    });
    expect(await screen.findByText(/Message envoyé/)).toBeInTheDocument();
    expect(trackEvent).toHaveBeenCalledWith("contact_sent", { subject: "partenariat" });
    expect(screen.getByRole("link", { name: "Retour à l'accueil" })).toHaveAttribute(
      "href",
      "/",
    );
  });

  it("shows a generic error when the network fails", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("offline")));
    render(<ContactForm />);

    await fillAndSend();

    expect(await screen.findByRole("alert")).toHaveTextContent(GENERIC_ERROR);
  });
});
