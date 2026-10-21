import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

// Social share image (Facebook, Instagram, WhatsApp, Discord, X…): the blue Laboon logo on a
// white background, generated at build time from `public/brand/wordmark.svg`. Same image in
// every language. See docs/features/seo.md.

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// The wordmark is 510 × 132.
const LOGO_WIDTH = 760;
const LOGO_HEIGHT = Math.round((LOGO_WIDTH * 132) / 510);

export default async function OpenGraphImage() {
  const svg = await readFile(join(process.cwd(), "public/brand/wordmark.svg"));
  const logo = `data:image/svg+xml;base64,${svg.toString("base64")}`;
  return new ImageResponse(
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#ffffff",
      }}
    >
      <img src={logo} width={LOGO_WIDTH} height={LOGO_HEIGHT} alt="Laboon" />
    </div>,
    size,
  );
}
