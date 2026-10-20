import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { ConfirmEmailView } from "@/components/account/ConfirmEmailView";
import { ResetPasswordView } from "@/components/account/ResetPasswordView";
import { Faq } from "@/components/faq/Faq";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { PageShell } from "@/components/layout";
import { NotFoundCard } from "@/components/layout/NotFoundCard";
import { LegalPage } from "@/components/legal/LegalPage";
import { getContent } from "@/content";
import { LOCALES, type Locale } from "@/lib/i18n";
import { axeViolations } from "@/tests/axe";
import { langParams } from "@/tests/params";
import ContactPage from "./[lang]/contact/page";
import Home from "./[lang]/page";

// Automated accessibility checks (axe-core) of every kind of page, in both
// languages. The scroll scene needs a real browser and is replaced by a no-op.
vi.mock("@/components/home/scene", () => ({
  startHomeScene: vi.fn(() => ({ reveal: vi.fn(), destroy: vi.fn() })),
}));
vi.mock("next/navigation", () => ({ usePathname: () => "/" }));

beforeEach(() => {
  // jsdom has no canvas: the scene is mocked, this only silences the warning.
  HTMLCanvasElement.prototype.getContext = (() => null) as never;
  vi.stubGlobal(
    "matchMedia",
    vi.fn(() => ({
      matches: false,
      addEventListener: vi.fn(),
      removeEventListener: vi.fn(),
    })),
  );
  window.history.replaceState(null, "", "/");
});

const inLocale = (locale: Locale, node: React.ReactNode) => (
  <LocaleProvider locale={locale}>{node}</LocaleProvider>
);

describe("the checker itself", () => {
  it("does flag a form control without a label", async () => {
    render(<input type="text" />);
    expect((await axeViolations()).join()).toContain("label");
  });
});

describe.each(LOCALES)("accessibility (%s)", (locale) => {
  it("home page", async () => {
    render(inLocale(locale, await Home(langParams(locale))));
    expect(await axeViolations()).toEqual([]);
  });

  it("contact page", async () => {
    render(inLocale(locale, await ContactPage(langParams(locale))));
    expect(await axeViolations()).toEqual([]);
  });

  it("FAQ in the app WebView", async () => {
    render(inLocale(locale, <Faq content={getContent(locale).faq} embed />));
    expect(await axeViolations()).toEqual([]);
  });

  it("legal document", async () => {
    render(inLocale(locale, <LegalPage locale={locale} slug="confidentialite" />));
    expect(await axeViolations()).toEqual([]);
  });

  it("404 page", async () => {
    render(
      inLocale(
        locale,
        <PageShell>
          <NotFoundCard />
        </PageShell>,
      ),
    );
    expect(await axeViolations()).toEqual([]);
  });

  it("password reset: new password form and request form", async () => {
    window.history.replaceState(null, "", "/reset-password?code=lbc_x");
    const { unmount } = render(inLocale(locale, <ResetPasswordView />));
    await screen.findByLabelText(getContent(locale).ui.password.newLabel);
    expect(await axeViolations()).toEqual([]);
    unmount();

    window.history.replaceState(null, "", "/reset-password");
    render(inLocale(locale, <ResetPasswordView />));
    await screen.findByLabelText(getContent(locale).ui.account.emailLabel);
    expect(await axeViolations()).toEqual([]);
  });

  it("e-mail confirmation", async () => {
    window.history.replaceState(null, "", "/confirm-email?code=lbc_x");
    render(inLocale(locale, <ConfirmEmailView />));
    await screen.findByLabelText(getContent(locale).ui.password.newLabel);
    expect(await axeViolations()).toEqual([]);
  });
});
