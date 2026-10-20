import type { Metadata } from "next";
import { PageShell } from "@/components/layout";
import { ButtonLink, Card } from "@/components/ui";

export const metadata: Metadata = { title: "Page introuvable — Laboon" };

// 404 page (unknown URL or notFound()). See docs/features/error-pages.md.
export default function NotFound() {
  return (
    <PageShell>
      <Card tone="success" className="mx-auto w-full max-w-lg">
        <p aria-hidden="true" className="font-title text-6xl font-extrabold">
          404
        </p>
        <h1 className="mt-4 font-title text-3xl font-extrabold tracking-[-0.04em]">
          Cette page joue en sourdine
        </h1>
        <p className="mt-4 text-muted">
          La page que tu cherches n&apos;existe pas ou a été déplacée.
        </p>
        <ButtonLink href="/" className="mt-8 px-10">
          Retour à l&apos;accueil
        </ButtonLink>
      </Card>
    </PageShell>
  );
}
