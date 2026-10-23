import type { ReactNode } from "react";

// Design system — expandable question/answer row (native <details>: keyboard
// and screen reader friendly, works without JavaScript). Styles: `.disclosure*`
// in app/ui.css. White when closed, Laboon blue when open.

export function Disclosure({
  summary,
  children,
}: {
  summary: string;
  children: ReactNode;
}) {
  return (
    <details className="disclosure">
      <summary className="disclosure__summary">
        <span className="disclosure__icon" aria-hidden="true" />
        {summary}
      </summary>
      <div className="disclosure__answer">{children}</div>
    </details>
  );
}
