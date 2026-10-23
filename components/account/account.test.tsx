import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { apiPost } from "@/lib/api";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { ConfirmEmailView } from "./ConfirmEmailView";
import { ResetPasswordView } from "./ResetPasswordView";

vi.mock("@/lib/api", () => ({ apiPost: vi.fn() }));

const STRONG = "Un-bon-mot-2-passe";

function visit(search: string) {
  window.history.replaceState(null, "", `/page${search}`);
}

async function fillPasswords(password = STRONG, confirm = STRONG) {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText("Nouveau mot de passe"), password);
  await user.type(screen.getByLabelText("Confirmer le mot de passe"), confirm);
  return user;
}

beforeEach(() => {
  vi.mocked(apiPost).mockResolvedValue({ ok: true });
});

describe("ResetPasswordView with a code", () => {
  it("removes the code from the address bar, then sends it with the new password", async () => {
    visit("?code=lbc_secret");
    render(<ResetPasswordView />);
    const user = await fillPasswords();
    expect(window.location.search).toBe("");

    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));

    expect(apiPost).toHaveBeenCalledWith(
      "/auth/password/reset/confirm",
      { code: "lbc_secret", new_password: STRONG },
      "fr",
    );
    expect(await screen.findByText("Mot de passe mis à jour")).toBeInTheDocument();
  });

  it("shows the French lede from the dictionary", async () => {
    visit("?code=lbc_secret");
    render(<ResetPasswordView />);
    expect(await screen.findByText(/Il remplacera l.ancien/)).toBeInTheDocument();
  });

  it("checks the rules live and refuses a weak password without calling the API", async () => {
    visit("?code=lbc_secret");
    render(<ResetPasswordView />);
    const user = await fillPasswords("faible", "faible");
    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/4 conditions/);
    expect(apiPost).not.toHaveBeenCalled();
    expect(screen.queryByText(/respecté/)).not.toBeInTheDocument();
  });

  it("marks each satisfied rule for screen readers", async () => {
    visit("?code=lbc_secret");
    render(<ResetPasswordView />);
    await fillPasswords();
    expect(screen.getAllByText(/respecté/)).toHaveLength(4);
  });

  it("shows the API error in French and keeps the form", async () => {
    visit("?code=lbc_secret");
    vi.mocked(apiPost).mockResolvedValue({
      ok: false,
      code: "rate_limited",
      status: 429,
    });
    render(<ResetPasswordView />);
    const user = await fillPasswords();
    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Trop de tentatives/);
    expect(screen.getByRole("button", { name: "Mettre à jour" })).toBeEnabled();
  });

  it("offers a new link when the code is invalid or expired", async () => {
    visit("?code=lbc_old");
    vi.mocked(apiPost).mockResolvedValue({
      ok: false,
      code: "invalid_code",
      status: 400,
    });
    render(<ResetPasswordView />);
    const user = await fillPasswords();
    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));
    expect(await screen.findByText("Lien invalide ou expiré")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Recevoir le lien" })).toBeInTheDocument();
  });
});

describe("ResetPasswordView without a code", () => {
  it("requests a link and gives the same answer whether or not the account exists", async () => {
    visit("");
    render(<ResetPasswordView />);
    const user = userEvent.setup();
    await user.type(
      await screen.findByLabelText("E-mail du compte"),
      " jane@example.com ",
    );
    await user.click(screen.getByRole("button", { name: "Recevoir le lien" }));

    expect(apiPost).toHaveBeenCalledWith(
      "/auth/password/reset",
      { email: "jane@example.com" },
      "fr",
    );
    expect(await screen.findByRole("status")).toHaveTextContent(/Si un compte existe/);
  });

  it("shows an API error instead of a fake success", async () => {
    visit("");
    vi.mocked(apiPost).mockResolvedValue({
      ok: false,
      code: "not_configured",
      status: 0,
    });
    render(<ResetPasswordView />);
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("E-mail du compte"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Recevoir le lien" }));
    expect(await screen.findByRole("alert")).toBeInTheDocument();
    expect(screen.queryByText(/Si un compte existe/)).not.toBeInTheDocument();
  });
});

describe("ConfirmEmailView", () => {
  it("sends the code and the chosen password to confirm the account", async () => {
    visit("?code=lbc_confirm");
    render(<ConfirmEmailView />);
    const user = await fillPasswords();
    await user.click(screen.getByRole("button", { name: "Confirmer mon compte" }));
    expect(apiPost).toHaveBeenCalledWith(
      "/auth/confirm",
      { code: "lbc_confirm", password: STRONG },
      "fr",
    );
    expect(await screen.findByText("Compte confirmé !")).toBeInTheDocument();
  });

  it("lets the visitor ask for a new link when there is no code", async () => {
    visit("");
    render(<ConfirmEmailView />);
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("E-mail du compte"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Renvoyer le lien" }));
    expect(apiPost).toHaveBeenCalledWith(
      "/auth/confirm/resend",
      { email: "jane@example.com" },
      "fr",
    );
  });
});

describe("account pages in English", () => {
  it("shows English texts and tells the API to answer in English", async () => {
    visit("?code=lbc_secret");
    render(
      <LocaleProvider locale="en">
        <ResetPasswordView />
      </LocaleProvider>,
    );
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("New password"), STRONG);
    await user.type(screen.getByLabelText("Confirm password"), STRONG);
    expect(screen.getAllByText(/\(met\)/)).toHaveLength(4);
    await user.click(screen.getByRole("button", { name: "Update" }));

    expect(apiPost).toHaveBeenCalledWith(
      "/auth/password/reset/confirm",
      { code: "lbc_secret", new_password: STRONG },
      "en",
    );
    expect(await screen.findByText("Password updated")).toBeInTheDocument();
  });

  it("has no French text left on the new password page", async () => {
    visit("?code=lbc_secret");
    render(
      <LocaleProvider locale="en">
        <ResetPasswordView />
      </LocaleProvider>,
    );
    expect(await screen.findByText(/replace the old one/)).toBeInTheDocument();
    expect(screen.queryByText(/remplacera/)).not.toBeInTheDocument();
  });

  it("translates API errors to English", async () => {
    visit("");
    vi.mocked(apiPost).mockResolvedValue({
      ok: false,
      code: "rate_limited",
      status: 429,
    });
    render(
      <LocaleProvider locale="en">
        <ConfirmEmailView />
      </LocaleProvider>,
    );
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("Account e-mail"), "jane@example.com");
    await user.click(screen.getByRole("button", { name: "Resend the link" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/Too many attempts/);
  });
});
