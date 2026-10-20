import type { NextConfig } from "next";

// Baseline security headers on every response. A strict Content-Security-Policy
// is not set yet (Turnstile + Vercel Analytics need an allowlist): see
// docs/roadmap.md.
const SECURITY_HEADERS = [
  { key: "X-Content-Type-Options", value: "nosniff" },
  { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
  { key: "X-Frame-Options", value: "SAMEORIGIN" },
  { key: "Permissions-Policy", value: "camera=(), microphone=(), geolocation=()" },
];

const nextConfig: NextConfig = {
  reactStrictMode: true,
  poweredByHeader: false,
  // The FAQ lives on the home page; /faq/embed stays for the mobile app.
  async redirects() {
    return [{ source: "/faq", destination: "/#faq", permanent: true }];
  },
  async headers() {
    return [{ source: "/:path*", headers: SECURITY_HEADERS }];
  },
};

export default nextConfig;
