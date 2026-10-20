import type { NextConfig } from "next";

// Origin (scheme + host) of the Laboon API, allowed for the browser calls of the
// account pages. Empty when NEXT_PUBLIC_API_URL is not set or invalid.
function apiOrigin(): string {
  try {
    return new URL(process.env.NEXT_PUBLIC_API_URL ?? "").origin;
  } catch {
    return "";
  }
}

/**
 * Content-Security-Policy. Sent in *report-only* mode for now: violations show in
 * the browser console without blocking anything, so Turnstile (Cloudflare) and the
 * Vercel analytics can be checked on staging before enforcing it. Inline scripts
 * stay allowed (`'unsafe-inline'`): Next.js and the JSON-LD blocks need them and a
 * nonce would make every page dynamic. See docs/features/security.md.
 */
export function contentSecurityPolicy(api = apiOrigin()): string {
  return [
    "default-src 'self'",
    "script-src 'self' 'unsafe-inline' https://challenges.cloudflare.com https://va.vercel-scripts.com",
    "style-src 'self' 'unsafe-inline'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    `connect-src ${["'self'", api, "https://challenges.cloudflare.com", "https://vitals.vercel-insights.com"].filter(Boolean).join(" ")}`,
    "frame-src https://challenges.cloudflare.com",
    "worker-src 'self' blob:",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
  ].join("; ");
}

// Security headers on every response.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
  { key: "Strict-Transport-Security", value: "max-age=31536000; includeSubDomains" },
  { key: "Cross-Origin-Opener-Policy", value: "same-origin" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // Inlines the (small) CSS in the HTML: no render-blocking stylesheet request.
  experimental: { inlineCss: true },
  // The FAQ lives on the home page of each language; /faq/embed stays for the mobile app.
  async redirects() {
    return [
      { source: "/faq", destination: "/#faq", permanent: true },
      { source: "/en/faq", destination: "/en#faq", permanent: true },
    ];
  },
  async headers() {
    const csp =
      process.env.NODE_ENV === "production"
        ? [{ key: "Content-Security-Policy-Report-Only", value: contentSecurityPolicy() }]
        : [];
    return [{ source: "/:path*", headers: [...SECURITY_HEADERS, ...csp] }];
  },
};

export default nextConfig;
