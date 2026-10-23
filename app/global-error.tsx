"use client";

import "./globals.css";

// Last-resort error page, used when the root layout itself fails. It replaces
// the whole document, so it renders its own <html> and stays dependency-free
// (system fonts, no dictionary: the language is unknown here, so both are shown).
// See docs/features/error-pages.md.
export default function GlobalError({ reset }: { error: Error; reset: () => void }) {
  return (
    <html lang="fr">
      <body className="flex min-h-svh items-center justify-center px-4">
        <main className="max-w-md bg-surface p-8 text-center sm:p-10">
          <h1 className="text-3xl font-extrabold tracking-tight">
            Oups, une fausse note
          </h1>
          <p className="mt-4 text-muted">
            Le site a rencontré un problème. Réessaie dans un instant.
          </p>
          <p lang="en" className="mt-4 text-muted">
            The site ran into a problem. Please try again in a moment.
          </p>
          <button type="button" onClick={reset} className="btn btn--reverted mt-8 px-10">
            Réessayer / Try again
          </button>
        </main>
      </body>
    </html>
  );
}
