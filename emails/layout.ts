// Shared frame of every Laboon e-mail: blue header with the wordmark, a card,
// social links and a footer. Table layout + inline styles, the only thing every
// mail client (Outlook included) renders reliably. Light by default, dark via
// `prefers-color-scheme` (Apple Mail, iOS, Outlook apps); Gmail inverts colours
// by itself, so the palette is chosen to stay readable when it does.
// See docs/features/emails.md.

import { DEFAULT_LOCALE, type Locale } from "../lib/i18n.ts";
import { CONTACT_EMAIL, SITE_URL, SOCIALS } from "../lib/site.ts";

export const COLORS = {
  blue: "#4753FF",
  deep: "#161A8F",
  night: "#0F127A",
  navy: "#000873",
  inkSoft: "#3D449E",
  paper: "#F5F5FF",
  mist: "#D2D5FF",
};

/** Logo (white on the blue header): hosted on the site, PNG for mail clients. */
export const LOGO_URL = `${SITE_URL}/brand/email/wordmark-white.png`;

const FONT_TEXT =
  "'Bricolage Grotesque',-apple-system,'Segoe UI',Roboto,Helvetica,Arial,sans-serif";
const FONT_TITLE =
  "'Sora','Arial Black',-apple-system,'Segoe UI',Helvetica,Arial,sans-serif";

export const STYLE = {
  title: `margin:0;font-family:${FONT_TITLE};font-weight:800;font-size:30px;line-height:1.15;letter-spacing:-0.03em;color:${COLORS.navy};`,
  text: `margin:0 0 16px;font-family:${FONT_TEXT};font-size:17px;line-height:1.55;color:${COLORS.navy};`,
  small: `margin:0 0 12px;font-family:${FONT_TEXT};font-size:14px;line-height:1.5;color:${COLORS.inkSoft};`,
};

/** Paragraph helpers used by the templates (class names drive the dark mode). */
export const p = (html: string) => `<p class="tx" style="${STYLE.text}">${html}</p>`;
export const small = (html: string) =>
  `<p class="soft" style="${STYLE.small}">${html}</p>`;
export const title = (text: string) =>
  `<h1 class="tx" style="${STYLE.title}">${text}</h1>`;

/** Bulletproof button: a coloured table cell holding a link; full width on phones. */
export function button(label: string, href: string) {
  return `<table role="presentation" class="btn-wrap" cellpadding="0" cellspacing="0" border="0" style="margin:28px 0 8px;"><tr>
<td class="btn-td" align="center" bgcolor="${COLORS.blue}" style="border-radius:999px;background:${COLORS.blue};">
<a class="btn-a" href="${href}" target="_blank" style="display:inline-block;padding:16px 36px;border:2px solid ${COLORS.blue};border-radius:999px;font-family:${FONT_TEXT};font-weight:800;font-size:15px;line-height:1.2;letter-spacing:-0.01em;text-transform:uppercase;text-decoration:none;color:#FFFFFF;">${label}</a>
</td></tr></table>`;
}

const css = `
:root{color-scheme:light dark;supported-color-schemes:light dark}
body{margin:0;padding:0;width:100%!important;-webkit-text-size-adjust:100%;-ms-text-size-adjust:100%}
table{border-collapse:collapse;mso-table-lspace:0;mso-table-rspace:0}
img{border:0;outline:none;text-decoration:none;-ms-interpolation-mode:bicubic}
a{text-decoration:underline}
@media (max-width:600px){
  .container{width:100%!important}
  .px{padding-left:20px!important;padding-right:20px!important}
  .title-cell h1{font-size:26px!important}
  .btn-wrap{width:100%!important}
  .btn-a{display:block!important;padding:16px 12px!important}
  .logo{width:140px!important;height:auto!important}
}
@media (prefers-color-scheme:dark){
  .bg{background:${COLORS.night}!important}
  .card{background:${COLORS.deep}!important}
  .tx{color:#FFFFFF!important}
  .soft{color:${COLORS.mist}!important}
  .lnk{color:#FFFFFF!important}
  .btn-a{border-color:#FFFFFF!important}
  .rule{border-color:rgba(255,255,255,0.22)!important}
}`;

/** Texts of the frame (the content is in templates.ts). */
export const FRAME_TEXT: Record<Locale, { follow: string }> = {
  fr: { follow: "Suis-nous" },
  en: { follow: "Follow us" },
};

export type Email = {
  /** Hidden preview line shown next to the subject in the inbox. */
  preheader: string;
  /** Inner HTML of the card. */
  body: string;
  /** Extra footer lines (e.g. unsubscribe link for campaigns). */
  footer?: string;
  /** Text shown above the header (e.g. "view in browser"). */
  topLine?: string;
};

export function renderEmail(
  { preheader, body, footer = "", topLine = "" }: Email,
  locale: Locale = DEFAULT_LOCALE,
): string {
  // Round blue buttons with a white icon (PNG: mail clients ignore SVG): same look in light and dark.
  const socials = SOCIALS.map(
    (s) =>
      `<td style="padding-right:10px;"><a href="${s.href}" target="_blank"><img src="${SITE_URL}/brand/email/${s.name.toLowerCase()}.png" width="44" height="44" alt="${s.name}" style="display:block;width:44px;height:44px;border-radius:22px;background:${COLORS.blue};color:#FFFFFF;font-family:${FONT_TEXT};font-size:11px;"></a></td>`,
  ).join("");
  return `<!doctype html>
<html lang="${locale}" xmlns="http://www.w3.org/1999/xhtml" xmlns:v="urn:schemas-microsoft-com:vml" xmlns:o="urn:schemas-microsoft-com:office:office">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta http-equiv="X-UA-Compatible" content="IE=edge">
<meta name="color-scheme" content="light dark">
<meta name="supported-color-schemes" content="light dark">
<title>Laboon</title>
<style>${css}</style>
</head>
<body class="bg" style="margin:0;padding:0;background:${COLORS.paper};">
<div style="display:none;max-height:0;overflow:hidden;opacity:0;color:transparent;">${preheader}&#8199;&#847; &#8199;&#847; &#8199;&#847; &#8199;&#847;</div>
<table role="presentation" class="bg" width="100%" cellpadding="0" cellspacing="0" border="0" bgcolor="${COLORS.paper}" style="background:${COLORS.paper};">
<tr><td align="center" style="padding:24px 12px;">
${topLine ? `<p class="soft" style="margin:0 0 12px;font-family:${FONT_TEXT};font-size:13px;color:${COLORS.inkSoft};">${topLine}</p>` : ""}
<table role="presentation" class="container" width="600" cellpadding="0" cellspacing="0" border="0" style="width:600px;max-width:600px;">
<tr><td align="center" bgcolor="${COLORS.blue}" style="background:${COLORS.blue};padding:32px 24px;">
<a href="${SITE_URL}" target="_blank"><img class="logo" src="${LOGO_URL}" width="190" height="49" alt="Laboon" style="display:block;width:190px;height:auto;color:#FFFFFF;font-family:${FONT_TITLE};font-weight:800;font-size:24px;"></a>
</td></tr>
<tr><td class="card px" bgcolor="#FFFFFF" style="background:#FFFFFF;padding:40px 40px 32px;">
${body}
</td></tr>
<tr><td class="card px" bgcolor="#FFFFFF" style="background:#FFFFFF;padding:0 40px 32px;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" border="0"><tr><td class="rule" style="border-top:1px solid ${COLORS.mist};padding-top:20px;font-family:${FONT_TEXT};font-size:14px;line-height:1.6;color:${COLORS.inkSoft};">
<p class="soft" style="margin:0 0 10px;font-family:${FONT_TEXT};font-size:14px;color:${COLORS.inkSoft};">${FRAME_TEXT[locale].follow}</p>
<table role="presentation" cellpadding="0" cellspacing="0" border="0" style="margin:0 0 16px;"><tr>${socials}</tr></table>
<p class="soft" style="margin:0;font-family:${FONT_TEXT};font-size:13px;color:${COLORS.inkSoft};">Laboon · <a class="lnk" href="mailto:${CONTACT_EMAIL}" style="color:${COLORS.inkSoft};">${CONTACT_EMAIL}</a></p>
${footer}
</td></tr></table>
</td></tr>
</table>
</td></tr></table>
</body>
</html>
`;
}
