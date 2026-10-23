/**
 * Serialises structured data for a `<script type="application/ld+json">`. `<`
 * is escaped so no text can ever close the script tag early (defence in depth:
 * today the texts are ours).
 */
export function jsonLd(data: unknown): string {
  return JSON.stringify(data).replace(/</g, "\\u003c");
}
