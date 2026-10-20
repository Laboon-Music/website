import Link from "next/link";
import { SOCIALS } from "@/lib/site";
import { CurrentYear } from "./CurrentYear";
import { Wordmark } from "./Wordmark";

// Footer links, grouped in three columns. Social links come from SOCIALS.
const COLUMNS = [
  {
    label: "Laboon",
    links: [
      { href: "/#faq", label: "FAQ" },
      { href: "/contact", label: "Contact" },
    ],
  },
  {
    label: "Informations",
    links: [
      { href: "/mentions-legales", label: "Mentions légales" },
      { href: "/confidentialite", label: "Confidentialité" },
    ],
  },
  {
    label: "Nous suivre",
    links: SOCIALS.map((s) => ({ href: s.href, label: s.name })),
  },
];

const LINK_CLASS =
  "inline-block py-1 text-[15px] hover:underline hover:underline-offset-[0.2em]";

export function SiteFooter({ children }: { children?: React.ReactNode }) {
  return (
    <footer className="relative z-10 bg-bg px-(--gutter) pt-16 pb-[calc(40px+env(safe-area-inset-bottom))] text-white md:pt-20 md:pb-7">
      <div className="mx-auto flex max-w-[1200px] flex-col items-start justify-between gap-10 md:flex-row md:gap-8">
        <Wordmark white alt="Laboon" className="w-[132px] md:w-[150px]" />
        <nav
          aria-label="Pied de page"
          className="grid w-full grid-cols-2 gap-x-6 gap-y-9 md:flex md:w-auto md:gap-20"
        >
          {COLUMNS.map((column) => (
            <div key={column.label}>
              <p className="mb-4 font-title text-[13px] font-extrabold text-[#b6bbfe] md:mb-3">
                {column.label}
              </p>
              <ul className="grid gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    {link.href.startsWith("/") ? (
                      <Link href={link.href} className={LINK_CLASS}>
                        {link.label}
                      </Link>
                    ) : (
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${link.label} (nouvel onglet)`}
                        className={LINK_CLASS}
                      >
                        {link.label}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
      <div className="mx-auto mt-12 flex max-w-[1200px] flex-wrap items-center justify-between gap-x-6 gap-y-3 border-t border-white/18 pt-6 text-[13px] text-[#c9ccff] md:mt-16 md:pt-5">
        <p>
          © <CurrentYear /> Laboon
        </p>
        {children}
      </div>
    </footer>
  );
}
