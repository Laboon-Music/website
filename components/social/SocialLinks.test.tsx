import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import SocialLinks, { SOCIALS } from "./SocialLinks";

describe("SocialLinks", () => {
  it("renders one accessible external link per network", () => {
    render(<SocialLinks />);
    const links = screen.getAllByRole("link");

    expect(links).toHaveLength(SOCIALS.length);
    for (const social of SOCIALS) {
      const link = screen.getByRole("link", {
        name: `Laboon sur ${social.name} (nouvel onglet)`,
      });
      expect(link).toHaveAttribute("href", social.href);
      expect(link).toHaveAttribute("target", "_blank");
      expect(link).toHaveAttribute("rel", "noopener noreferrer");
    }
  });
});
