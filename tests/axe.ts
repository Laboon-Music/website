import axe from "axe-core";

/**
 * Runs axe-core on the current document and returns readable violations.
 * jsdom has no layout, so colour contrast (and other visual rules) are checked
 * by Lighthouse in a real browser, not here. See docs/testing.md.
 */
export async function axeViolations(): Promise<string[]> {
  const results = await axe.run(document.body, {
    rules: { "color-contrast": { enabled: false }, region: { enabled: false } },
  });
  return results.violations.map(
    (v) => `${v.id}: ${v.help} (${v.nodes.map((n) => n.target.join(" ")).join(" | ")})`,
  );
}
