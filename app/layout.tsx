import type { Metadata, Viewport } from "next";
import { Bricolage_Grotesque, Sora } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SITE_CONTENT } from "@/content/site";
import { SITE_URL } from "@/lib/site";
import "./globals.css";

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

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: SITE_CONTENT.title,
  description: SITE_CONTENT.description,
  keywords: SITE_CONTENT.keywords,
  openGraph: {
    title: SITE_CONTENT.shareTitle,
    description: SITE_CONTENT.description,
    type: "website",
    locale: "fr_FR",
    siteName: SITE_CONTENT.name,
  },
  twitter: {
    card: "summary_large_image",
    title: SITE_CONTENT.shareTitle,
    description: SITE_CONTENT.description,
  },
};

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

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html
      lang="fr"
      className={`${bricolage.variable} ${sora.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: JS_FLAG }} />
      </head>
      <body className="font-sans">
        {children}
        {/* Vercel Web Analytics: cookieless, anonymous, aggregated. See docs/features/analytics.md */}
        <Analytics />
      </body>
    </html>
  );
}
