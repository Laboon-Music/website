import { NextResponse, type NextRequest } from "next/server";
import { DEFAULT_LOCALE, normalizeLocale, splitLocale } from "@/lib/i18n";

// Language routing. French has no prefix (`/contact`) and is served by the
// `app/[lang]` tree as `fr`; English is under `/en`. The visitor is never
// redirected by country or browser language: the footer switch is the way.
// Pages opened from outside the site pick their language with `?lang=`: the
// mobile app WebViews, and the account links e-mailed by the Laboon API
// (`/reset-password?code=…&lang=en`).
// See docs/features/i18n.md.

const LANG_QUERY_PATHS = [
  /^\/faq\/embed$/,
  /^\/contact\/embed$/,
  /^\/legal\//,
  /^\/reset-password$/,
  /^\/confirm-email$/,
];

export function proxy(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl;
  const { locale, path } = splitLocale(pathname);

  // `/fr/...` is the same page as `/...`: one address per page.
  if (locale === DEFAULT_LOCALE) {
    const url = request.nextUrl.clone();
    url.pathname = path;
    return NextResponse.redirect(url, 308);
  }
  if (locale) return NextResponse.next();

  const target = LANG_QUERY_PATHS.some((re) => re.test(pathname))
    ? normalizeLocale(searchParams.get("lang"))
    : DEFAULT_LOCALE;
  const url = request.nextUrl.clone();
  url.pathname = `/${target}${pathname === "/" ? "" : pathname}`;
  return NextResponse.rewrite(url);
}

export const config = {
  // Everything except the API, Next internals, deep-link files, icons, brand
  // images, robots and sitemap.
  matcher: [
    "/((?!api|_next|\\.well-known|brand|icon\\.png|apple-icon\\.png|robots\\.txt|sitemap\\.xml|favicon\\.ico).*)",
  ],
};
