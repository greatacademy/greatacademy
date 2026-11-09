import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { CourseCatalog } from "../../components/CourseCatalog.tsx";
import { useI18n } from "../../lib/i18n.tsx";
import { rememberedSubject, SubjectMark, useSubjects } from "../../lib/subject.tsx";

export const Route = createFileRoute("/courses/")({
  validateSearch: (search: Record<string, unknown>): { subject?: string } =>
    typeof search.subject === "string" && search.subject ? { subject: search.subject } : {},
  component: Courses,
});

/** Courses is the public catalog, one subject at a time, chosen by tabs at its top (docs/experience.md §4). */
function Courses() {
  const { m, tx } = useI18n();
  const subjects = useSubjects();
  const asked = Route.useSearch().subject;
  // Without a choice in the address, the catalog opens on the subject last opened in this browser.
  const [remembered, setRemembered] = useState("");
  useEffect(() => setRemembered(rememberedSubject()), []);
  const shown = subjects.find((s) => s.id === asked) ?? subjects.find((s) => s.id === remembered) ?? subjects[0];
  const tab = "-mb-px flex items-center gap-2 border-b-2 px-1 pb-2.5 text-sm font-medium transition";
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{m.courses}</h1>
        <p className="max-w-2xl text-muted">{m.coursesIntro}</p>
      </div>
      {subjects.length > 1 && (
        <nav className="flex gap-6 overflow-x-auto border-b border-line [scrollbar-width:none]" aria-label={m.subjects}>
          {subjects.map((s) => (
            <Link
              key={s.id}
              to="/courses"
              search={{ subject: s.id }}
              replace
              aria-current={s.id === shown?.id ? "page" : undefined}
              className={`${tab} ${s.id === shown?.id ? "border-subject text-ink" : "border-transparent text-muted hover:text-ink"}`}
              data-subject={s.id}
            >
              <SubjectMark subject={s} size={22} />
              {tx(s.title)}
            </Link>
          ))}
        </nav>
      )}
      {shown && (
        <div data-subject={shown.id}>
          <CourseCatalog key={shown.id} subject={shown.id} />
        </div>
      )}
    </div>
  );
}
