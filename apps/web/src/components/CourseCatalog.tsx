import type { Course } from "@ga/proto/catalog/v1/catalog_pb";
import { ArrowRight, MagnifyingGlass } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import { useMemo, useState } from "react";

import { useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { field } from "./AuthForm.tsx";
import { Markdown } from "./Markdown.tsx";
import { Bar, ErrorNote, Spinner } from "./ui.tsx";

/** CourseCatalog lists every course by shelf, with a search and the learner's progress in the courses they took. */
export function CourseCatalog() {
  const { m, tx } = useI18n();
  const { data: session } = useSession();
  const [query, setQuery] = useState("");
  const [shelf, setShelf] = useState<string>();
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => learning.getProfile({ timeZone: timeZone() }),
    enabled: !!session,
  });
  const enrolled = new Map(profile.data?.enrollments.map((e) => [e.courseId, e.stats]));

  const shelves = useMemo(() => {
    const byTitle = new Map<string, Course[]>();
    for (const c of courses.data?.courses ?? []) {
      const title = tx(c.group) || m.otherCourses;
      byTitle.set(title, [...(byTitle.get(title) ?? []), c]);
    }
    return [...byTitle];
  }, [courses.data, tx, m.otherCourses]);

  if (courses.isPending) return <Spinner label={m.loading} />;
  if (courses.isError) return <ErrorNote message={m.error} retry={m.retry} onRetry={() => courses.refetch()} />;

  const needle = query.trim().toLowerCase();
  const shown = shelves
    .filter(([title]) => !shelf || title === shelf)
    .map(([title, list]) => [title, list.filter((c) => !needle || tx(c.title).toLowerCase().includes(needle))] as const)
    .filter(([, list]) => list.length > 0);
  const chip = (active: boolean) =>
    `shrink-0 rounded-full border px-3 py-1.5 text-sm transition ${active ? "border-accent bg-accent-soft font-medium text-accent" : "border-line bg-surface text-muted hover:text-ink"}`;

  return (
    <div className="space-y-8">
      <div className="space-y-3">
        <label className="relative block max-w-md">
          <span className="sr-only">{m.searchCourses}</span>
          <MagnifyingGlass size={18} className="absolute top-1/2 left-3 -translate-y-1/2 text-muted" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={m.searchCourses}
            className={`${field} pl-9`}
          />
        </label>
        <div className="flex flex-wrap gap-2">
          <button type="button" aria-pressed={!shelf} className={chip(!shelf)} onClick={() => setShelf(undefined)}>
            {m.allCourses}
          </button>
          {shelves.map(([title]) => (
            <button
              key={title}
              type="button"
              aria-pressed={shelf === title}
              className={chip(shelf === title)}
              onClick={() => setShelf(title)}
            >
              {title}
            </button>
          ))}
        </div>
      </div>
      {shown.length === 0 && <p className="text-muted">{m.noCoursesFound}</p>}
      {shown.map(([title, list]) => (
        <section key={title} className="space-y-3">
          <h2 className="text-lg font-semibold">{title}</h2>
          <div className="grid gap-3 md:grid-cols-2">
            {list.map((c) => {
              const stats = enrolled.get(c.id);
              return (
                <Link
                  key={c.id}
                  to={stats ? "/learn/$courseId" : "/courses/$courseId"}
                  params={{ courseId: c.id }}
                  className="group flex min-w-0 flex-col gap-2 rounded-2xl border border-line bg-surface p-5 transition hover:border-accent/50"
                >
                  <div className="flex items-start justify-between gap-3">
                    <h3 className="font-semibold">{tx(c.title)}</h3>
                    <ArrowRight size={18} className="mt-0.5 shrink-0 text-muted transition group-hover:text-accent" />
                  </div>
                  <Markdown source={tx(c.description)} className="line-clamp-2 text-sm text-muted" />
                  {stats ? (
                    <div className="mt-auto space-y-1.5 pt-1">
                      <Bar value={stats.total ? stats.learned / stats.total : 0} />
                      <div className="text-xs text-muted">
                        {m.learned} {stats.learned} / {stats.total}
                      </div>
                    </div>
                  ) : (
                    <div className="mt-auto pt-1 text-xs text-muted">
                      {c.topicCount} {m.topics} · {c.xp} XP
                    </div>
                  )}
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
