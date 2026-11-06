import { ArrowLeft, CheckCircle, XCircle } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { LoadError } from "../../../components/LoadError.tsx";
import { Markdown } from "../../../components/Markdown.tsx";
import { buttonClass, Card, Spinner } from "../../../components/ui.tsx";
import { useEnrollFirst, useRequireSession } from "../../../lib/hooks.ts";
import { useI18n } from "../../../lib/i18n.tsx";
import { learning } from "../../../lib/rpc.ts";

export const Route = createFileRoute("/learn/$courseId/history")({ component: History });

function History() {
  const { courseId } = Route.useParams();
  const { m, tx, locale } = useI18n();
  const session = useRequireSession();
  const history = useQuery({
    queryKey: ["history", courseId],
    queryFn: () => learning.listSessions({ courseId }),
    enabled: !!session,
    staleTime: 0,
  });

  const notEnrolled = useEnrollFirst(courseId, history.error);

  if (!session || history.isPending || notEnrolled) return <Spinner label={m.loading} />;
  if (history.isError) return <LoadError error={history.error} onRetry={() => history.refetch()} />;
  const when = new Intl.DateTimeFormat(locale, { dateStyle: "medium", timeStyle: "short" });
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/learn/$courseId" params={{ courseId }} className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {m.dashboard}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{m.history}</h1>
      </div>
      {history.data.sessions.length === 0 && <p className="text-muted">{m.noHistory}</p>}
      <div className="grid gap-2">
        {history.data.sessions.map((s) => {
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
                    {label} · {when.format(new Date(Number(s.completedAt)))}
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
    </div>
  );
}
