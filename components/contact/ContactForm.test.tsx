import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";
import { mockFetch, sentJson } from "@/tests/helpers";
import { UI as FR } from "@/content/fr/ui";
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

describe("ContactForm validation in the browser", () => {
  it("tells the first empty field at once, focuses it, and never calls the API", async () => {
    const fetchMock = mockFetch();
    const user = userEvent.setup();
    render(<ContactForm />);

    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    expect(screen.getByRole("alert")).toHaveTextContent(FR.errors.nameRequired);
    expect(screen.getByLabelText("Nom")).toHaveFocus();
    expect(screen.getByLabelText("Nom")).toHaveAttribute("aria-invalid", "true");
    expect(screen.getByRole("button", { name: "Envoyer" })).not.toHaveAttribute(
      "aria-busy",
    );

    await user.type(screen.getByLabelText("Nom"), "Jane");
    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    expect(screen.getByRole("alert")).toHaveTextContent(FR.errors.invalidEmail);
    expect(screen.getByLabelText("E-mail")).toHaveFocus();

    await user.type(screen.getByLabelText("E-mail"), "jane@example.com");
    await user.type(screen.getByLabelText("Message"), "short");
    await user.click(screen.getByRole("button", { name: "Envoyer" }));
    expect(screen.getByRole("alert")).toHaveTextContent(/trop court|un peu court/);
    expect(screen.getByLabelText("Message")).toHaveFocus();
    expect(fetchMock).not.toHaveBeenCalled();
  });
});

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

    expect(await screen.findByRole("alert")).toHaveTextContent(FR.errors.generic);
  });
});
