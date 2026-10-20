"use client";

import { useUi } from "@/components/i18n/LocaleProvider";
import { PageShell } from "@/components/layout";
import { Button, ButtonLink, Card } from "@/components/ui";

// Error boundary for every page under the root layout (server errors are
// already reported to Sentry via instrumentation.ts onRequestError).
// See docs/features/error-pages.md.
export default function ErrorPage({ reset }: { error: Error; reset: () => void }) {
  const { error } = useUi();
  return (
    <PageShell>
      <Card tone="success" className="mx-auto w-full max-w-lg">
        <h1 className="font-title text-3xl font-extrabold tracking-[-0.04em]">
          {error.title}
        </h1>
        <p className="mt-4 text-muted">{error.text}</p>
        <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Button onClick={reset} className="px-10">
            {error.retry}
          </Button>
          <ButtonLink href="/" variant="outline">
            {error.backHome}
          </ButtonLink>
        </div>
      </Card>
    </PageShell>
  );
}
