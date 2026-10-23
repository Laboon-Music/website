import { notFound } from "next/navigation";

// Catches every unknown URL under a language so the 404 page (app/[lang]/not-found.tsx)
// is shown in that language, inside the site chrome.
export default function UnknownPage(): never {
  notFound();
}
