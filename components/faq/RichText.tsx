import type { ReactNode } from "react";
import { TextLink } from "@/components/ui";

const LINK = /\[([^\]]+)\]\(([^)\s]+)\)/g;

const LEGAL_PATHS = ["/cgu", "/cgv", "/charte", "/confidentialite", "/mentions-legales"];

/**
 * Address to use inside the mobile app WebView: stay on the bare "embed" pages
 * (no site chrome). Null for links that make no sense there (home anchors).
 */
export function embedHref(href: string): string | null {
  if (href === "/contact") return "/contact/embed";
  if (LEGAL_PATHS.includes(href)) return `/legal/${href.slice(1)}`;
  if (href.startsWith("/")) return null;
  return href;
}

/**
 * Renders a text where `[label](address)` becomes a `TextLink`. With `embed`,
 * links are adapted to the app WebView (see embedHref); unusable ones become plain text.
 */
export function RichText({ text, embed }: { text: string; embed?: boolean }) {
  const parts: ReactNode[] = [];
  let last = 0;
  for (const match of text.matchAll(LINK)) {
    parts.push(text.slice(last, match.index));
    const href = embed ? embedHref(match[2]) : match[2];
    parts.push(
      href ? (
        <TextLink key={match.index} href={href}>
          {match[1]}
        </TextLink>
      ) : (
        match[1]
      ),
    );
    last = match.index + match[0].length;
  }
  parts.push(text.slice(last));
  return <>{parts}</>;
}
