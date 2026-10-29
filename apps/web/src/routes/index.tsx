import { ArrowRight, CheckCircle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Markdown } from "../components/Markdown.tsx";
import { Bar, buttonClass, Card, ErrorNote, Spinner } from "../components/ui.tsx";
import { useSession } from "../lib/auth.ts";
import { useI18n } from "../lib/i18n.tsx";
import { catalog, learning, timeZone } from "../lib/rpc.ts";

export const Route = createFileRoute("/")({ component: Home });

function Home() {
  const { m, tx } = useI18n();
  const { data: session } = useSession();
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  const profile = useQuery({
    queryKey: ["profile"],
    queryFn: () => learning.getProfile({ timeZone: timeZone() }),
    enabled: !!session,
  });
  const enrolled = new Map(profile.data?.enrollments.map((e) => [e.courseId, e.stats]));

  return (
    <div className="space-y-14">
      <section className="grid gap-8 pt-6 md:grid-cols-[1.2fr_1fr] md:items-center">
        <div className="space-y-5">
          <h1 className="text-4xl font-semibold tracking-tight text-balance sm:text-5xl">{m.tagline}</h1>
          <p className="max-w-xl text-lg text-muted">{m.heroBody}</p>
          {!session && (
            <div className="flex gap-3">
              <Link to="/sign-up" className={buttonClass("primary", "px-5 py-2.5 text-base")}>
                {m.signUp} <ArrowRight size={18} />
              </Link>
              <Link to="/sign-in" className={buttonClass("secondary", "px-5 py-2.5 text-base")}>
                {m.signIn}
              </Link>
            </div>
          )}
        </div>
        <ul className="space-y-3">
          {m.heroPoints.map((p) => (
            <li key={p} className="flex items-start gap-3 rounded-xl border border-line bg-surface px-4 py-3">
              <CheckCircle size={22} weight="fill" className="mt-0.5 shrink-0 text-good" />
              <span>{p}</span>
            </li>
          ))}
        </ul>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">{m.courses}</h2>
        {courses.isPending && <Spinner label={m.loading} />}
        {courses.isError && <ErrorNote message={m.error} retry={m.retry} onRetry={() => courses.refetch()} />}
        <div className="grid gap-4 md:grid-cols-2">
          {courses.data?.courses.map((c) => {
            const stats = enrolled.get(c.id);
            return (
              <Card key={c.id} className="flex flex-col gap-4">
                <div className="space-y-1">
                  <div className="text-xs font-medium tracking-wide text-accent uppercase">{tx(c.subjectTitle)}</div>
                  <h3 className="text-lg font-semibold">{tx(c.title)}</h3>
                  <Markdown source={tx(c.description)} className="text-sm text-muted" />
                </div>
                <div className="text-sm text-muted">
                  {c.topicCount} {m.topics} · {c.xp} XP
                </div>
                {stats && (
                  <div className="space-y-1.5">
                    <Bar value={stats.total ? stats.learned / stats.total : 0} />
                    <div className="text-xs text-muted">
                      {m.learned} {stats.learned} / {stats.total}
                      {stats.due > 0 && ` · ${m.due} ${stats.due}`}
                    </div>
                  </div>
                )}
                <div className="mt-auto flex gap-2">
                  {stats ? (
                    <Link to="/learn/$courseId" params={{ courseId: c.id }} className={buttonClass("primary")}>
                      {m.continueLearning} <ArrowRight size={16} />
                    </Link>
                  ) : (
                    <Link to="/courses/$courseId" params={{ courseId: c.id }} className={buttonClass("secondary")}>
                      {m.viewCourse}
                    </Link>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      </section>
    </div>
  );
}
