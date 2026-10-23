import { describe, expect, it } from "vitest";
import { stripUrlDetails } from "./SiteAnalytics";

describe("stripUrlDetails", () => {
  it("never sends the one-time code of an account link to analytics", () => {
    const event = stripUrlDetails({
      type: "pageview",
      url: "https://www.laboon-app.com/reset-password?code=lbc_secret&lang=en#x",
    });
    expect(event.url).toBe("https://www.laboon-app.com/reset-password");
    expect(JSON.stringify(event)).not.toContain("lbc_secret");
  });

  it("keeps the path (page views stay countable) and other event fields", () => {
    const event = stripUrlDetails({
      type: "event",
      url: "https://www.laboon-app.com/en/contact",
      name: "contact_sent",
    } as never);
    expect(event.url).toBe("https://www.laboon-app.com/en/contact");
    expect((event as { name?: string }).name).toBe("contact_sent");
  });

  it("leaves an unparsable URL untouched", () => {
    expect(stripUrlDetails({ type: "pageview", url: "not a url" }).url).toBe("not a url");
  });
});
