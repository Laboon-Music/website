import { NotFoundCard } from "@/components/layout/NotFoundCard";
import { PageShell } from "@/components/layout";

// 404 page (unknown URL or notFound()), in the language of the URL.
// See docs/features/error-pages.md.
export default function NotFound() {
  return (
    <PageShell>
      <NotFoundCard />
    </PageShell>
  );
}
