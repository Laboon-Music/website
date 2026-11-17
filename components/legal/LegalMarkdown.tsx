import type { ReactNode } from "react";
import type { Heading, List as MdList, PhrasingContent, Root, RootContent } from "mdast";
import remarkParse from "remark-parse";
import { unified } from "unified";
import { TextLink } from "@/components/ui";
import { DocBody, List, Section, Subheading } from "./_shared";

/**
 * Renders a legal text written in Markdown (published by the API, see
 * `docs/features/legal-documents.md`) with the design of the TSX documents.
 *
 * The Markdown is parsed to an mdast tree and every node is rendered here by a
 * whitelist, so the output is safe by construction: raw HTML nodes are dropped,
 * unknown syntax degrades to its text, links are limited to `https:`, `mailto:`
 * and `#anchor`, and nothing is ever injected as HTML. Server component: no
 * client JavaScript.
 *
 * The Markdown is flat while `Section` wraps its content, so the tree is
 * grouped by `##` heading. What comes before the first `##` is the intro.
 */

const parser = unified().use(remarkParse);

// Trailing `{#id}` of a heading, the anchor of its section.
const HEADING_ID = /\s*\{#([^{}\s]*)\}\s*$/;
const ALLOWED_URL = /^(https:\/\/|mailto:|#)/i;

/** Ids are reduced to `[a-z0-9-]`; an id that becomes empty is dropped. */
function sanitizeId(raw: string): string | undefined {
  const id = raw
    .toLowerCase()
    .replace(/[^a-z0-9-]/g, "")
    .replace(/^-+|-+$/g, "");
  return id || undefined;
}

function plainText(nodes: readonly (PhrasingContent | RootContent)[]): string {
  return nodes
    .map((node) => {
      if ("value" in node) return node.type === "html" ? "" : node.value;
      if (node.type === "image" || node.type === "imageReference") return node.alt ?? "";
      if ("children" in node) return plainText(node.children);
      return "";
    })
    .join("");
}

function splitHeading(heading: Heading): { title: string; id?: string } {
  const text = plainText(heading.children);
  const match = HEADING_ID.exec(text);
  if (!match) return { title: text.trim() };
  return { title: text.slice(0, match.index).trim(), id: sanitizeId(match[1]) };
}

function renderInline(nodes: readonly PhrasingContent[]): ReactNode[] {
  return nodes.map((node, index) => {
    const key = index;
    switch (node.type) {
      case "text":
      case "inlineCode":
        return node.value;
      case "strong":
        return <strong key={key}>{renderInline(node.children)}</strong>;
      case "emphasis":
        return <em key={key}>{renderInline(node.children)}</em>;
      case "break":
        return <br key={key} />;
      case "link":
        // A forbidden target (`javascript:`, `data:`…) keeps the text, not the link.
        return ALLOWED_URL.test(node.url) ? (
          <TextLink key={key} href={node.url}>
            {renderInline(node.children)}
          </TextLink>
        ) : (
          renderInline(node.children)
        );
      case "delete":
      case "linkReference":
        // Reference-style links are not part of the syntax: their target is never used.
        return renderInline(node.children);
      default:
        // Raw HTML, images and footnotes are dropped (an image keeps no markup).
        return null;
    }
  });
}

function renderList(list: MdList, key: number): ReactNode {
  return (
    <List key={key} ordered={list.ordered ?? false}>
      {list.children.map((item, index) => (
        <li key={index}>{renderBlocks(item.children, true)}</li>
      ))}
    </List>
  );
}

/** Renders block nodes. `tight` unwraps paragraphs (list items). */
function renderBlocks(nodes: readonly RootContent[], tight = false): ReactNode[] {
  return nodes.map((node, index) => {
    switch (node.type) {
      case "paragraph":
        return tight ? (
          <span key={index}>{renderInline(node.children)}</span>
        ) : (
          <p key={index}>{renderInline(node.children)}</p>
        );
      case "list":
        return renderList(node, index);
      case "heading":
        // `###` is the only sub-level allowed; any other level degrades to bold text.
        return node.depth === 3 ? (
          <Subheading key={index}>{splitHeading(node).title}</Subheading>
        ) : (
          <p key={index}>
            <strong>{splitHeading(node).title}</strong>
          </p>
        );
      case "html":
      case "definition":
        return null;
      default:
        // Quote, code, table…: not allowed syntax, kept as plain text.
        return <p key={index}>{plainText([node])}</p>;
    }
  });
}

type Group = { title: string; id?: string; nodes: RootContent[] };

function group(tree: Root): { intro: RootContent[]; sections: Group[] } {
  const intro: RootContent[] = [];
  const sections: Group[] = [];
  for (const node of tree.children) {
    if (node.type === "heading" && node.depth === 2) {
      sections.push({ ...splitHeading(node), nodes: [] });
    } else if (sections.length > 0) {
      sections[sections.length - 1].nodes.push(node);
    } else {
      intro.push(node);
    }
  }
  return { intro, sections };
}

export function LegalMarkdown({ markdown }: { markdown: string }) {
  const { intro, sections } = group(parser.parse(markdown));
  return (
    <>
      {intro.length > 0 && (
        <div className="max-w-[62ch] space-y-3.5 text-[clamp(1.05rem,1.4vw,1.2rem)] leading-relaxed text-muted">
          {renderBlocks(intro)}
        </div>
      )}
      <DocBody>
        {sections.map((section, index) => (
          <Section key={index} title={section.title} id={section.id}>
            {renderBlocks(section.nodes)}
          </Section>
        ))}
      </DocBody>
    </>
  );
}
