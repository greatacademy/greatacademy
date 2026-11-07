import { createFileRoute } from "@tanstack/react-router";

import { NotFoundNote } from "../../components/LoadError.tsx";
import { useI18n } from "../../lib/i18n.tsx";
import { legalPage } from "../../lib/legal.ts";

export const Route = createFileRoute("/legal/$page")({ component: Legal });

function Legal() {
  const { page } = Route.useParams();
  const { locale } = useI18n();
  const content = legalPage(page, locale);
  if (!content) return <NotFoundNote />;
  return (
    <article className="mx-auto max-w-2xl space-y-6">
      <header className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{content.title}</h1>
        <p className="text-sm text-muted">{content.intro}</p>
      </header>
      {content.sections.map((s) => (
        <section key={s.heading} className="space-y-2">
          <h2 className="text-lg font-semibold">{s.heading}</h2>
          {s.paragraphs?.map((p) => (
            <p key={p}>{p}</p>
          ))}
          {s.items && (
            <ul className="list-disc space-y-1 pl-5">
              {s.items.map((i) => (
                <li key={i}>{i}</li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </article>
  );
}
