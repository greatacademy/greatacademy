import { MagnifyingGlass } from "@phosphor-icons/react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { field } from "../../../components/AuthForm.tsx";
import { LoadError } from "../../../components/LoadError.tsx";
import { Markdown } from "../../../components/Markdown.tsx";
import { Card, Spinner } from "../../../components/ui.tsx";
import { useAdminText } from "../../../lib/admin-text.ts";
import { useI18n } from "../../../lib/i18n.tsx";
import { SubjectChip, useCatalog } from "../../../lib/subject.tsx";

export const Route = createFileRoute("/admin/content/")({ component: Courses });

/** Courses lists every course of every subject, retired ones included, to open and check. */
function Courses() {
  const { m, tx } = useI18n();
  const t = useAdminText();
  const catalog = useCatalog();
  const [query, setQuery] = useState("");
  if (catalog.isPending) return <Spinner label={m.loading} />;
  if (catalog.isError) return <LoadError error={catalog.error} onRetry={() => catalog.refetch()} />;
  const needle = query.trim().toLowerCase();
  const matches = (c: (typeof catalog.data.courses)[number]) =>
    !needle || [c.id, ...Object.values(c.title?.values ?? {})].some((s) => s.toLowerCase().includes(needle));
  return (
    <div className="space-y-4">
      <p className="text-sm text-muted">{t.contentNote}</p>
      <label className="relative block">
        <MagnifyingGlass size={16} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder={m.searchCourses} className={`${field} pl-9`} />
      </label>
      {catalog.data.subjects.map((s) => {
        const courses = catalog.data.courses.filter((c) => c.subjectId === s.id && matches(c));
        if (courses.length === 0) return null;
        return (
          <section key={s.id} className="space-y-2">
            <h2 className="flex items-center gap-2 text-lg font-semibold">
              <SubjectChip subject={s} size={24} />
            </h2>
            <div className="grid gap-2 sm:grid-cols-2">
              {courses.map((c) => (
                <Link key={c.id} to="/admin/content/$courseId" params={{ courseId: c.id }} className="block">
                  <Card className="h-full space-y-1 p-4 transition hover:border-accent/50">
                    <div className="flex items-baseline justify-between gap-2">
                      <span className="font-medium">
                        <Markdown source={tx(c.title)} inline />
                      </span>
                      {c.retired && <span className="shrink-0 rounded-full bg-warn/10 px-2 py-0.5 text-[11px] text-warn">{t.retired}</span>}
                    </div>
                    <p className="text-xs text-muted">
                      {c.id} · {t.topicsCount(c.topicCount)}
                    </p>
                  </Card>
                </Link>
              ))}
            </div>
          </section>
        );
      })}
    </div>
  );
}
