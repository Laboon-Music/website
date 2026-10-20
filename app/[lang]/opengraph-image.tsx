import { ImageResponse } from "next/og";
import { getContent } from "@/content";
import { resolveLocale, type LangParams } from "@/lib/locale-params";

// Social share image (Facebook, Instagram, WhatsApp, X…), generated at build
// time from the brand colours and texts — no image asset needed. Replace with
// a designed visual if the brand team provides one. See docs/features/seo.md.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default async function OpenGraphImage({ params }: LangParams) {
  const { home, site } = getContent(await resolveLocale(params));
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: "80px",
        background:
          "radial-gradient(circle at 100% 0%, rgba(210,213,255,0.35), transparent 55%), linear-gradient(160deg, #4753ff, #161a8f)",
        color: "#ffffff",
        fontFamily: "sans-serif",
      }}
    >
      <div style={{ fontSize: 44, fontWeight: 700, letterSpacing: -1 }}>{site.name}</div>
      <div
        style={{
          marginTop: 40,
          fontSize: 96,
          fontWeight: 800,
          lineHeight: 1.05,
          textTransform: "uppercase",
        }}
      >
        {home.hero.title}
      </div>
      <div style={{ marginTop: 40, maxWidth: 900, fontSize: 32, color: "#d2d5ff" }}>
        {home.hero.subtitle}
      </div>
    </div>,
    size,
  );
}
