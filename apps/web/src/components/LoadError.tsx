import { Link } from "@tanstack/react-router";

import { useI18n } from "../lib/i18n.tsx";
import { isNotFound } from "../lib/rpc.ts";
import { buttonClass, ErrorNote } from "./ui.tsx";

/** NotFoundNote tells the learner that the page or the thing it names does not exist, and leads back to the courses. */
export function NotFoundNote() {
  const { m } = useI18n();
  return (
    <div className="space-y-4 py-16 text-center">
      <h1 className="text-2xl font-semibold tracking-tight">{m.notFoundTitle}</h1>
      <p className="text-muted">{m.notFoundBody}</p>
      <Link to="/" className={buttonClass("primary")}>
        {m.backToCourses}
      </Link>
    </div>
  );
}

/** LoadError shows why a page could not load: that what it asked for does not exist, or that something failed and may be tried again. */
export function LoadError({ error, onRetry }: { error: unknown; onRetry?: () => void }) {
  const { m } = useI18n();
  if (isNotFound(error)) return <NotFoundNote />;
  return <ErrorNote message={m.error} retry={m.retry} onRetry={onRetry} />;
}
