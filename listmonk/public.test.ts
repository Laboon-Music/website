import { existsSync, readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import nextConfig from "../next.config";

const file = (path: string) => fileURLToPath(new URL(path, import.meta.url));
const read = (path: string) => readFileSync(file(path), "utf8");
const css = read("./public.css");

/** `--name: value;` declarations of the first block matching `selector {`. */
function tokens(source: string, selector: string): Map<string, string> {
  const block = source.slice(source.indexOf(`${selector} {`)).split("}")[0];
  return new Map(
    [...block.matchAll(/(--[\w-]+):\s*([^;]+);/g)].map(([, name, value]) => [
      name,
      value.replace(/\s+/g, " ").trim(),
    ]),
  );
}

describe("listmonk public theme", () => {
  it("uses the site's colour tokens", () => {
    const site = tokens(read("../app/globals.css"), "@theme");
    const colours = [...tokens(css, ":root")].filter(([name]) =>
      name.startsWith("--color-"),
    );
    expect(colours.length).toBeGreaterThan(5);
    for (const [name, value] of colours) {
      expect({ name, value }).toEqual({ name, value: site.get(name) });
    }
  });

  it("loads fonts that the site serves, to other origins", async () => {
    const fonts = [
      ...css.matchAll(/url\("https:\/\/www\.laboon-app\.com(\/fonts\/[^"]+)"\)/g),
    ];
    expect(fonts).toHaveLength(2);
    for (const [, path] of fonts) {
      expect(existsSync(file(`../public${path}`))).toBe(true);
    }
    const rules = await nextConfig.headers!();
    expect(rules.find((r) => r.source === "/fonts/:path*")?.headers).toContainEqual({
      key: "Access-Control-Allow-Origin",
      value: "*",
    });
  });

  it("keeps the captcha text readable inside its white box", () => {
    expect(css).toMatch(/\.altcha label[^{]*\{[^}]*color: var\(--color-ink\)/);
  });
});
