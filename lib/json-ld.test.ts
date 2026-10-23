import { describe, expect, it } from "vitest";
import { jsonLd } from "./json-ld";

describe("jsonLd", () => {
  it("cannot close the script tag, and stays valid JSON", () => {
    const text = jsonLd({ name: "</script><script>alert(1)</script>" });
    expect(text).not.toContain("<");
    expect(JSON.parse(text).name).toBe("</script><script>alert(1)</script>");
  });
});
