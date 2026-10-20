import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { LocaleProvider } from "@/components/i18n/LocaleProvider";
import { BackToTop } from "@/components/layout/BackToTop";
import { getContent } from "@/content";
import { LOCALES } from "@/lib/i18n";
import { resolveLocale, type LangParams } from "@/lib/locale-params";
import { SITE_URL } from "@/lib/site";
import "../globals.css";

// Brand fonts, self-hosted by next/font at build time (no request to Google
// from the visitor's browser). Bricolage Grotesque for text, Sora for titles.
const bricolage = Bricolage_Grotesque({
  subsets: ["latin"],
  variable: "--font-bricolage",
  display: "swap",
  axes: ["opsz", "wdth"],
});
const sora = Sora({
  subsets: ["latin"],
  weight: ["600", "800"],
  variable: "--font-sora",
  display: "swap",
});

export function generateStaticParams() {
  return LOCALES.map((lang) => ({ lang }));
}

export async function generateMetadata({ params }: LangParams): Promise<Metadata> {
  const locale = await resolveLocale(params);
  const { site } = getContent(locale);
  return {
    metadataBase: new URL(SITE_URL),
    title: site.title,
    description: site.description,
    keywords: site.keywords,
    openGraph: {
      title: site.shareTitle,
      description: site.description,
      type: "website",
      locale: locale === "fr" ? "fr_FR" : "en_GB",
      alternateLocale: locale === "fr" ? ["en_GB"] : ["fr_FR"],
      siteName: site.name,
    },
    twitter: {
      card: "summary_large_image",
      title: site.shareTitle,
      description: site.description,
    },
  };
}

// Mobile-first: device width, and the browser UI tinted with the brand blue.
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#4753FF",
};

// Tells the CSS that scripts run, so the home intro may hide content until it
// is revealed. Without JavaScript nothing is ever hidden.
const JS_FLAG = "document.documentElement.classList.add('js')";

export default async function RootLayout({
  children,
  params,
}: Readonly<{ children: React.ReactNode } & LangParams>) {
  const locale = await resolveLocale(params);
  return (
    <html
      lang={locale}
      className={`${bricolage.variable} ${sora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="font-sans">
        <LocaleProvider locale={locale}>
          {children}
          <BackToTop />
        </LocaleProvider>
        {/* Vercel Web Analytics: cookieless, anonymous, aggregated. See docs/features/analytics.md */}
        <Analytics />
      </body>
    </html>
  );
}
