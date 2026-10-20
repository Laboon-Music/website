import { describe, expect, it } from "vitest";
import { getContent } from "./index";

// Both languages must say the same things: same keys, same placeholders, same
// links, nothing left empty. (The types already force the same shape.)

function leaves(value: unknown, path = ""): [string, string][] {
  if (typeof value === "string") return [[path, value]];
  if (Array.isArray(value)) return value.flatMap((v, i) => leaves(v, `${path}[${i}]`));
  if (value && typeof value === "object") {
    return Object.entries(value).flatMap(([k, v]) =>
      leaves(v, path ? `${path}.${k}` : k),
    );
  }
  return [];
}

const placeholders = (text: string) =>
  [...text.matchAll(/\{(\w+)\}/g)].map((m) => m[1]).sort();
const links = (text: string) =>
  [...text.matchAll(/\]\(([^)\s]+)\)/g)].map((m) =>
    m[1].replace(/^https?:\/\/[^/]+/, ""),
  );

describe.each(["home", "faq", "site", "ui"] as const)("%s texts", (section) => {
  const fr = leaves(getContent("fr")[section]);
  const en = leaves(getContent("en")[section]);

  it("has the same keys in French and English", () => {
    expect(en.map(([path]) => path)).toEqual(fr.map(([path]) => path));
  });

  it("has no empty text", () => {
    for (const [path, text] of [...fr, ...en]) expect(text.trim(), path).not.toBe("");
  });

  it("keeps the same {placeholders} and links in both languages", () => {
    fr.forEach(([path, text], i) => {
      expect(placeholders(en[i][1]), path).toEqual(placeholders(text));
      expect(links(en[i][1]), path).toEqual(links(text));
    });
  });
});

describe("English really is translated", () => {
  it("does not copy the French home texts", () => {
    const fr = getContent("fr").home;
    const en = getContent("en").home;
    expect(en.hero.title).not.toBe(fr.hero.title);
    expect(en.manifesto.text).not.toBe(fr.manifesto.text);
    expect(en.finalCta.title).not.toBe(fr.finalCta.title);
  });
});
