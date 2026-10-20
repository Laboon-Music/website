// Pill links to Laboon's social networks. To add a network: add an entry to
// SOCIALS in lib/site.ts (it also feeds the footer, the FAQ and structured data). See docs/features/social-links.md.

import { SOCIALS } from "@/lib/site";

export { SOCIALS };

export default function SocialLinks() {
  return (
    <ul className="flex flex-wrap items-center justify-center gap-3">
      {SOCIALS.map((s) => (
        <li key={s.name}>
          <a
            href={s.href}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`Laboon sur ${s.name} (nouvel onglet)`}
            className="inline-flex h-11 items-center rounded-full border-2 border-white px-[18px] text-[15px] font-semibold transition-colors duration-300 hover:bg-white hover:text-ink focus-visible:bg-white focus-visible:text-ink"
          >
            {s.name}
          </a>
        </li>
      ))}
    </ul>
  );
}
