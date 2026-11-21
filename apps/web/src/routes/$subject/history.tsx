import { ArrowLeft, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { LoadError } from "../../components/LoadError.tsx";
import { Markdown } from "../../components/Markdown.tsx";
import { buttonClass, Card, Spinner } from "../../components/ui.tsx";
import { useI18n } from "../../lib/i18n.tsx";
import { learning } from "../../lib/rpc.ts";
import { useSubjectPlace } from "../../lib/subject.tsx";

export const Route = createFileRoute("/$subject/history")({ component: History });

function History() {
  const { subject } = Route.useParams();
  const courseId = useSubjectPlace()?.enrollment?.courseId ?? "";
  const { m, tx, locale } = useI18n();
  const history = useQuery({
    queryKey: ["history", courseId],
    queryFn: () => learning.listSessions({ courseId }),
    enabled: !!courseId,
    staleTime: 0,
  });

  if (history.isPending) return <Spinner label={m.loading} />;
  if (history.isError) return <LoadError error={history.error} onRetry={() => history.refetch()} />;
  const day = new Intl.DateTimeFormat(locale, { weekday: "long", year: "numeric", month: "long", day: "numeric" });
  const time = new Intl.DateTimeFormat(locale, { timeStyle: "short" });
  // The tasks are grouped by the day they were finished, newest first, each day with the XP it earned.
  const days: { key: string; sessions: typeof history.data.sessions; xp: number }[] = [];
  for (const s of history.data.sessions) {
    const key = day.format(new Date(Number(s.completedAt)));
    const last = days[days.length - 1];
    if (last?.key === key) {
      last.sessions.push(s);
      last.xp += s.xp;
    } else days.push({ key, sessions: [s], xp: s.xp });
  }
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/$subject/progress" params={{ subject }} className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {m.navProgress}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{m.history}</h1>
      </div>
      {history.data.sessions.length === 0 && <p className="text-muted">{m.noHistory}</p>}
      {days.map((d) => (
        <section key={d.key} className="space-y-2">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <h2 className="font-medium">{d.key}</h2>
            <span className={`tabular-nums ${d.xp < 0 ? "text-bad" : "text-muted"}`}>{d.xp} XP</span>
          </div>
          <div className="grid gap-2">
            {d.sessions.map((s) => {
              const task = s.task?.kind;
              const label =
                task?.case === "lesson"
                  ? m.lesson
                  : task?.case === "review"
                    ? m.review
                    : task?.case === "quiz"
                      ? m.quiz
                      : task?.case === "reading"
                        ? m.reading
                        : m.diagnostic;
              return (
                <Link key={s.id} to="/session/$sessionId" params={{ sessionId: s.id }} className="block min-w-0">
                  <Card className="flex items-center gap-3 p-4 transition hover:border-accent/50">
                    {s.passed ? (
                      <CheckCircle size={22} weight="fill" className="shrink-0 text-good" />
                    ) : (
                      <XCircle size={22} weight="fill" className="shrink-0 text-bad" />
                    )}
                    <div className="min-w-0 flex-1">
                      <div className="truncate font-medium">
                        {task?.case === "lesson" || task?.case === "review" || task?.case === "reading" ? (
                          <Markdown source={tx(task.value.title)} inline />
                        ) : (
                          label
                        )}
                      </div>
                      <div className="text-xs text-muted">
                        {label} · {time.format(new Date(Number(s.completedAt)))}
                        {s.blownOff && <span className="text-warn"> · {m.blownOffShort}</span>}
                      </div>
                    </div>
                    {task?.case !== "diagnostic" && (
                      <div className="shrink-0 text-right text-sm text-muted">
                        <div>{m.score(s.correct, s.asked)}</div>
                        <div className={s.xp < 0 ? "text-bad" : ""}>{m.earnedOf(s.xp, s.fullXp)}</div>
                      </div>
                    )}
                  </Card>
                </Link>
              );
            })}
          </div>
        </section>
      ))}
    </div>
  );
}
