// @vitest-environment node
import { readdirSync, readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";

// Touch browsers keep :hover on the last tapped element: a button pressed then released
// outside stayed lit until the next tap elsewhere. Hover effects therefore live inside
// `@media (hover: hover)`, the condition Tailwind's `hover:` uses. Outside it, a `:hover`
// selector is only allowed in a rule that also targets the same element without
// `:hover` (an override that cancels the effect, e.g. the loading button).

const ROOT = process.cwd();
const DIRS = ["app", "components"];

function cssFiles(dir: string): string[] {
  return readdirSync(join(ROOT, dir), { withFileTypes: true }).flatMap((entry) => {
    const path = join(dir, entry.name);
    if (entry.isDirectory()) return cssFiles(path);
    return entry.name.endsWith(".css") ? [path] : [];
  });
}

/** Every rule as its selector list and the at-rule preludes around it. */
function rules(css: string) {
  const found: { selectors: string[]; parents: string[] }[] = [];
  const stack: string[] = [];
  let prelude = "";
  for (const char of css.replace(/\/\*[\s\S]*?\*\//g, "")) {
    if (char === "{") {
      const text = prelude.trim();
      if (!text.startsWith("@")) {
        found.push({
          selectors: text.split(",").map((s) => s.trim()),
          parents: [...stack],
        });
      }
      stack.push(text);
      prelude = "";
    } else if (char === "}") {
      stack.pop();
      prelude = "";
    } else if (char === ";") {
      prelude = "";
    } else {
      prelude += char;
    }
  }
  return found;
}

/** `:hover` selectors that would stick on a touch screen. */
function stickyHovers(css: string): string[] {
  return rules(css).flatMap(({ selectors, parents }) => {
    if (parents.some((p) => p.startsWith("@media") && p.includes("(hover: hover)")))
      return [];
    return selectors.filter(
      (s) => s.includes(":hover") && !selectors.includes(s.replaceAll(":hover", "")),
    );
  });
}

describe("hover styles", () => {
  it("flags a hover rule outside the hover media query", () => {
    expect(stickyHovers(".a:hover { color: red; }")).toEqual([".a:hover"]);
    expect(
      stickyHovers(".a:hover::before, .a:focus-visible::before { opacity: 1; }"),
    ).toEqual([".a:hover::before"]);
  });

  it("accepts a hover rule inside the hover media query, even nested", () => {
    expect(stickyHovers("@media (hover: hover) { .a:hover { color: red; } }")).toEqual(
      [],
    );
    expect(
      stickyHovers(
        "@media (min-width: 1px) { @media (hover: hover) { .a:hover { x: 1; } } }",
      ),
    ).toEqual([]);
  });

  it("accepts an override that also targets the element without hover", () => {
    expect(stickyHovers(".a, .a:hover, .a:active { scale: 1; }")).toEqual([]);
  });

  it("ignores comments and other at-rules", () => {
    expect(stickyHovers("/* .a:hover { } */ @keyframes k { to { x: 1; } }")).toEqual([]);
  });

  it.each(DIRS.flatMap(cssFiles))(
    "keeps every hover effect of %s inside @media (hover: hover)",
    (file) => {
      expect(stickyHovers(readFileSync(join(ROOT, file), "utf8"))).toEqual([]);
    },
  );
});
