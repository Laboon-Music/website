import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { beforeEach, describe, expect, it, vi } from "vitest";
import ResetPasswordPage from "./page";

const auth = { setSession: vi.fn(), updateUser: vi.fn() };
vi.mock("@/lib/supabase", () => ({ getSupabase: () => ({ auth }) }));

const RECOVERY_HASH = "#access_token=a&refresh_token=r&type=recovery";
const PASSWORD = "a-strong-password";

async function submitNewPassword() {
  const user = userEvent.setup();
  await user.type(await screen.findByLabelText("Nouveau mot de passe"), PASSWORD);
  await user.type(screen.getByLabelText("Confirmer le mot de passe"), PASSWORD);
  await user.click(screen.getByRole("button", { name: "Mettre à jour" }));
}

beforeEach(() => {
  window.location.hash = RECOVERY_HASH;
  auth.setSession.mockResolvedValue({ error: null });
  auth.updateUser.mockResolvedValue({ error: null });
});

describe("/reset-password", () => {
  it("lets the visitor reveal and hide the password", async () => {
    render(<ResetPasswordPage />);
    const field = await screen.findByLabelText("Nouveau mot de passe");
    expect(field).toHaveAttribute("type", "password");
    await userEvent.click(screen.getAllByRole("button", { name: "Afficher" })[0]);
    expect(field).toHaveAttribute("type", "text");
    expect(screen.getByRole("button", { name: "Masquer" })).toBeInTheDocument();
  });

  it("checks the password length rule as the visitor types", async () => {
    render(<ResetPasswordPage />);
    const user = userEvent.setup();
    const field = await screen.findByLabelText("Nouveau mot de passe");
    expect(screen.queryByText(/respecté/)).not.toBeInTheDocument();
    await user.type(field, PASSWORD);
    expect(screen.getByText(/respecté/)).toBeInTheDocument();
  });

  it("refuses a too short password without calling Supabase", async () => {
    render(<ResetPasswordPage />);
    const user = userEvent.setup();
    await user.type(await screen.findByLabelText("Nouveau mot de passe"), "short");
    await user.type(screen.getByLabelText("Confirmer le mot de passe"), "short");
    await user.click(screen.getByRole("button", { name: "Mettre à jour" }));
    expect(await screen.findByRole("alert")).toHaveTextContent(/au moins 12 caractères/);
    expect(auth.updateUser).not.toHaveBeenCalled();
  });

  it("shows 'invalid link' without recovery tokens", async () => {
    window.location.hash = "";
    render(<ResetPasswordPage />);
    expect(await screen.findByText("Lien invalide ou expiré")).toBeInTheDocument();
  });

  it("shows 'invalid link' instead of loading forever when Supabase throws", async () => {
    auth.setSession.mockRejectedValue(new Error("network down"));
    render(<ResetPasswordPage />);
    expect(await screen.findByText("Lien invalide ou expiré")).toBeInTheDocument();
  });

  it("updates the password", async () => {
    render(<ResetPasswordPage />);
    await submitNewPassword();
    expect(auth.updateUser).toHaveBeenCalledWith({ password: PASSWORD });
    expect(await screen.findByText(/Mot de passe mis à jour/)).toBeInTheDocument();
  });

  it("translates Supabase errors to French", async () => {
    auth.updateUser.mockResolvedValue({
      error: { code: "same_password", message: "New password should be different" },
    });
    render(<ResetPasswordPage />);
    await submitNewPassword();
    expect(await screen.findByRole("alert")).toHaveTextContent(
      "Ton nouveau mot de passe doit être différent de l'ancien.",
    );
  });

  it("shows a French error when the update request crashes", async () => {
    auth.updateUser.mockRejectedValue(new Error("Failed to fetch"));
    render(<ResetPasswordPage />);
    await submitNewPassword();
    expect(await screen.findByRole("alert")).toHaveTextContent(/Réessaie plus tard/);
    expect(screen.getByRole("button", { name: "Mettre à jour" })).toBeEnabled();
  });
});
