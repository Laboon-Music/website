"use client";

import { PageShell } from "@/components/layout";
import { Button, ButtonLink, Card } from "@/components/ui";

// Error boundary for every page under the root layout (server errors are
// already reported to Sentry via instrumentation.ts onRequestError).
// See docs/features/error-pages.md.
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  return (
    <PageShell>
      <Card tone="success" className="mx-auto w-full max-w-lg">
        <h1 className="font-title text-3xl font-extrabold tracking-[-0.04em]">
          Oups, une fausse note
        </h1>
        <p className="mt-4 text-muted">
          Quelque chose s&apos;est mal passé de notre côté. Réessaie dans un instant.
        </p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="px-10">
            Réessayer
          </Button>
          <ButtonLink href="/" variant="outline">
            Retour à l&apos;accueil
          </ButtonLink>
        </div>
      </Card>
    </PageShell>
  );
}
