"use client";

import { useUi } from "@/components/i18n/LocaleProvider";
import { ButtonLink, Card } from "@/components/ui";

/**
 * Content of the 404 page. A client component because `not-found` receives no
 * route params: the language comes from the page context. React hoists the
 * `<title>` to the document head.
 */
export function NotFoundCard() {
  const { notFound } = useUi();
  return (
    <Card tone="success" className="mx-auto w-full max-w-lg">
      <title>{notFound.metaTitle}</title>
      <p aria-hidden="true" className="font-title text-6xl font-extrabold">
        404
      </p>
      <h1 className="mt-4 font-title text-3xl font-extrabold tracking-[-0.04em]">
        {notFound.title}
      </h1>
      <p className="mt-4 text-muted">{notFound.text}</p>
      <ButtonLink href="/" className="mt-8 px-10">
        {notFound.backHome}
      </ButtonLink>
    </Card>
  );
}
