import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import {
  Button,
  ButtonLink,
  buttonClass,
  Card,
  Checkbox,
  Disclosure,
  Field,
  FormError,
  Honeypot,
  Input,
  Select,
  TextLink,
} from ".";

describe("design system", () => {
  it("Button defaults to type=button and merges classes", () => {
    render(<Button className="mt-2">Go</Button>);
    const button = screen.getByRole("button", { name: "Go" });
    expect(button).toHaveAttribute("type", "button");
    expect(button.className).toContain("btn--reverted");
    expect(button.className).toContain("mt-2");
  });

  it("buttonClass supports variants and full width", () => {
    expect(buttonClass({ variant: "outline" })).toContain("btn--stroke");
    expect(buttonClass({ variant: "text" })).toContain("btn--text");
    expect(buttonClass({ fullWidth: true })).toContain("w-full");
  });

  it("ButtonLink renders a link styled as a button", () => {
    render(<ButtonLink href="/contact">Contact</ButtonLink>);
    expect(screen.getByRole("link", { name: "Contact" })).toHaveAttribute(
      "href",
      "/contact",
    );
  });

  it("Field labels its control", () => {
    render(
      <Field label="Nom">
        <Input />
      </Field>,
    );
    expect(screen.getByLabelText("Nom")).toBeInTheDocument();
  });

  it("Input can be joined to a button on its right", () => {
    render(<Input joined aria-label="a" />);
    expect(screen.getByLabelText("a").className).toContain("border-r-0");
  });

  it("Select shows a chevron and keeps the native control", () => {
    render(
      <Select aria-label="s">
        <option>x</option>
      </Select>,
    );
    expect(screen.getByRole("combobox", { name: "s" })).toBeInTheDocument();
  });

  it("Checkbox is a labelled native checkbox", () => {
    render(<Checkbox label="Me prévenir" defaultChecked />);
    expect(screen.getByRole("checkbox", { name: "Me prévenir" })).toBeChecked();
  });

  it("FormError is announced and can be referenced by a field", () => {
    render(<FormError id="e">Oups</FormError>);
    const alert = screen.getByRole("alert");
    expect(alert).toHaveTextContent("Oups");
    expect(alert).toHaveAttribute("id", "e");
  });

  it("FormError renders nothing without a message", () => {
    const { container } = render(<FormError>{false}</FormError>);
    expect(container).toBeEmptyDOMElement();
  });

  it("Honeypot is hidden from humans and assistive tech", () => {
    const { container } = render(<Honeypot value="" onChange={() => {}} />);
    const input = container.querySelector("input[name=website]");
    expect(input).toHaveAttribute("tabindex", "-1");
    expect(input).toHaveAttribute("aria-hidden", "true");
  });

  it("Card success tone centres confirmations", () => {
    render(<Card tone="success">ok</Card>);
    expect(screen.getByText("ok").className).toContain("text-center");
  });
});

describe("TextLink", () => {
  it("is underlined and uses next/link for internal paths", () => {
    render(<TextLink href="/cgu">CGU</TextLink>);
    const link = screen.getByRole("link", { name: "CGU" });
    expect(link).toHaveAttribute("href", "/cgu");
    expect(link.className).toContain("underline");
    expect(link).not.toHaveAttribute("target");
  });

  it("opens external URLs in a new tab", () => {
    render(<TextLink href="https://example.com">ext</TextLink>);
    expect(screen.getByRole("link", { name: "ext" })).toHaveAttribute("target", "_blank");
  });

  it("keeps mailto links in the same tab", () => {
    render(<TextLink href="mailto:a@b.co">mail</TextLink>);
    expect(screen.getByRole("link", { name: "mail" })).not.toHaveAttribute("target");
  });
});

describe("Disclosure", () => {
  it("is a native expandable row, closed by default", () => {
    render(<Disclosure summary="Question ?">Réponse</Disclosure>);
    expect(screen.getByText("Question ?").closest("details")).not.toHaveAttribute("open");
    expect(screen.getByText("Réponse")).toBeInTheDocument();
  });

  it("hides its decorative icon from assistive tech", () => {
    const { container } = render(<Disclosure summary="Q ?">R</Disclosure>);
    expect(container.querySelector(".disclosure__icon")).toHaveAttribute(
      "aria-hidden",
      "true",
    );
  });
});
