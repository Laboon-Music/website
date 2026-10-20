// Pill buttons (icon + name) to Laboon's social networks. To add a network: add
// an entry to SOCIALS in lib/site.ts and its icon below (the list also feeds the
// footer, the FAQ, structured data and the e-mails). See docs/features/social-links.md.

"use client";

import { useUi } from "@/components/i18n/LocaleProvider";
import { fmt } from "@/lib/i18n";
import { SOCIALS } from "@/lib/site";

export { SOCIALS };

// 24×24 line icons (Feather), keyed by network name.
const ICONS: Record<string, React.ReactNode> = {
  Instagram: (
    <>
      <rect x="2" y="2" width="20" height="20" rx="5" />
      <circle cx="12" cy="12" r="4" />
      <line x1="17.5" y1="6.5" x2="17.51" y2="6.5" />
    </>
  ),
  Facebook: (
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
  ),
};

export default function SocialLinks() {
  const ui = useUi();
  return (
    <ul className="flex flex-wrap items-center justify-center gap-3">
      {SOCIALS.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`${fmt(ui.social.on, { name: s.name })} (${ui.newTab})`}
            className="inline-flex h-11 items-center gap-2.5 rounded-full border-2 border-white pr-[18px] pl-3.5 text-[15px] font-semibold transition-colors duration-300 hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-5 flex-none"
              aria-hidden="true"
            >
              {ICONS[s.name]}
            </svg>
            {s.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
