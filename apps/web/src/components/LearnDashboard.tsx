import type { Task } from "@ga/proto/learning/v1/learning_pb";
import { CheckCircle, Lightning, Trophy, XCircle } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import { useRequireSession } from "../lib/hooks.ts";
import { useI18n } from "../lib/i18n.tsx";
import { account, catalog, learning, timeZone } from "../lib/rpc.ts";
import { ConversationsCard } from "./Conversations.tsx";
import { LoadError } from "./LoadError.tsx";
import { Markdown } from "./Markdown.tsx";
import { CourseDone, PlacementReport } from "./PlacementReport.tsx";
import { ForecastCard, GoalsCard } from "./SubjectDecisions.tsx";
import { TaskCard } from "./TaskCard.tsx";
import { Bar, Button, Card, ErrorNote, Spinner } from "./ui.tsx";

const DAY = 86_400_000;

/** EarnedCard shows all the XP earned in the subject, and today's. */
function EarnedCard({ total, today }: { total: number; today: number }) {
  const { m } = useI18n();
  return (
    <Card className="space-y-1 p-5">
      <div className="flex items-center gap-2 text-sm text-muted">
        <Lightning size={18} /> {m.totalEarned}
      </div>
      <div className="text-3xl font-semibold tabular-nums tracking-tight">{total.toLocaleString()} XP</div>
      <div className="text-sm text-muted">{m.xpToday(today)}</div>
    </Card>
  );
}

/** LeagueSummary shows the learner's place in this week's league and the two learners next to them. */
function LeagueSummary() {
  const { m } = useI18n();
  const league = useQuery({ queryKey: ["league"], queryFn: () => account.getLeague({}), staleTime: 0 });
  const l = league.data;
  if (!l) return null;
  const mine = l.rows.findIndex((r) => r.me);
  const near = mine < 0 ? [] : l.rows.slice(Math.max(0, mine - 1), mine + 2);
  const days = Math.max(1, Math.ceil((Number(l.endsAt) - Date.now()) / DAY));
  return (
    <Card className="space-y-3 p-5">
      <div className="flex items-center justify-between gap-2 text-sm text-muted">
        <span className="flex items-center gap-2">
          <Trophy size={18} /> {l.enabled ? m.tiers[l.tier] : m.league}
        </span>
        {l.enabled && <span className="text-xs">{m.daysLeft(days)}</span>}
      </div>
      {!l.enabled ? (
        <p className="text-sm text-muted">{m.leagueInvite}</p>
      ) : near.length === 0 ? (
        <p className="text-sm text-muted">{m.leagueNoXp}</p>
      ) : (
        <ol className="space-y-1 text-sm">
          {near.map((r) => (
            <li key={r.username} className={`flex justify-between gap-3 rounded-lg px-2 py-1 ${r.me ? "bg-accent-soft font-medium" : ""}`}>
              <span className="min-w-0 truncate">
                <span className="mr-2 text-muted">{r.rank}</span>
                {r.username}
              </span>
              <span className="shrink-0">{r.xp} XP</span>
            </li>
          ))}
        </ol>
      )}
      <Link to="/league" className="block text-sm text-accent">
        {l.enabled ? m.leagueSeeAll : m.leagueLearnMore}
      </Link>
    </Card>
  );
}

/** RecentWork lists the learner's last tasks in the course and links to the whole history. */
function RecentWork({ courseId, subject }: { courseId: string; subject: string }) {
  const { m, tx } = useI18n();
  const history = useQuery({ queryKey: ["history", courseId], queryFn: () => learning.listSessions({ courseId }), staleTime: 0 });
  const recent = history.data?.sessions.slice(0, 3) ?? [];
  if (recent.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-muted">{m.recentTasks}</h2>
        <Link to="/$subject/history" params={{ subject }} className="text-sm text-accent">
          {m.seeAll}
        </Link>
      </div>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {recent.map((s) => {
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
            <li key={s.id}>
              <Link
                to="/session/$sessionId"
                params={{ sessionId: s.id }}
                className="flex items-center gap-3 px-4 py-3 text-sm hover:bg-page"
              >
                {s.passed ? (
                  <CheckCircle size={20} weight="fill" className="shrink-0 text-good" />
                ) : (
                  <XCircle size={20} weight="fill" className="shrink-0 text-bad" />
                )}
                <span className="min-w-0 flex-1 truncate">
                  {task?.case === "lesson" || task?.case === "review" || task?.case === "reading" ? (
                    <Markdown source={tx(task.value.title)} inline />
                  ) : (
                    label
                  )}
                </span>
                {task?.case !== "diagnostic" && <span className={`shrink-0 ${s.xp < 0 ? "text-bad" : "text-muted"}`}>{s.xp} XP</span>}
              </Link>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

/**
 * LearnDashboard is a subject's Learn page (docs/experience.md §3). The next task comes first, since it is what the
 * learner came for; the subject's XP, goals, forecast and the league sit beside it, the goals and the forecast as on the
 * Progress page.
 */
export function LearnDashboard({ courseId, subjectId }: { courseId: string; subjectId: string }) {
  const { m, tx } = useI18n();
  const session = useRequireSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const course = useQuery({ queryKey: ["course", courseId], queryFn: () => catalog.getCourse({ courseId }) });
  const dash = useQuery({
    queryKey: ["dashboard", courseId],
    queryFn: () => learning.getDashboard({ courseId, timeZone: timeZone() }),
    enabled: !!session,
    staleTime: 0,
  });
  const start = useMutation({
    mutationFn: (task: Task) => learning.startTask({ courseId, task, timeZone: timeZone() }),
    onSuccess: (res) => navigate({ to: "/session/$sessionId", params: { sessionId: res.session!.id } }),
  });
  const skip = useMutation({
    mutationFn: () => learning.skipDiagnostic({ courseId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboard", courseId] }),
  });

  if (!session || dash.isPending) return <Spinner label={m.loading} />;
  if (dash.isError) return <LoadError error={dash.error} onRetry={() => dash.refetch()} />;
  const d = dash.data;
  const stats = d.stats!;
  const xp = d.xp!;
  const share = stats.total ? stats.learned / stats.total : 0;
  const goalNote = xp.goalToday <= 0 ? "" : xp.today >= xp.goalToday ? m.goalMetToday : m.goalLeftToday(xp.goalToday - xp.today);

  return (
    <div className="space-y-6">
      <div className="max-w-xl space-y-2">
        <Link
          to="/$subject/course"
          params={{ subject: subjectId }}
          className="block text-2xl font-semibold tracking-tight hover:text-accent"
        >
          {tx(course.data?.course?.title)}
        </Link>
        <div className="flex items-center gap-3 text-sm text-muted">
          <Bar value={share} className="bg-subject" />
          <span className="shrink-0">
            {stats.learned} / {stats.total} {m.topics}
          </span>
        </div>
        {stats.due > 0 && (
          <div className="text-sm text-warn">
            {m.due}: {stats.due}
          </div>
        )}
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
          <PlacementReport d={d} />
          <CourseDone d={d} />
          <section className="space-y-3">
            <div className="flex flex-wrap items-baseline justify-between gap-x-4">
              <h2 className="text-lg font-semibold">{m.nextUp}</h2>
              {goalNote && <p className="text-sm text-muted">{goalNote}</p>}
            </div>
            {start.isError && <ErrorNote message={m.error} />}
            {d.active?.task && (
              <TaskCard
                task={d.active.task}
                primary
                action={m.resume}
                onStart={() => navigate({ to: "/session/$sessionId", params: { sessionId: d.active!.id } })}
              />
            )}
            {!d.active &&
              d.tasks.map((task, i) => (
                <TaskCard
                  // biome-ignore lint/suspicious/noArrayIndexKey: tasks have no id; the list is replaced as a whole
                  key={i}
                  task={task}
                  primary={i === 0}
                  action={m.start}
                  busy={start.isPending}
                  onStart={() => start.mutate(task)}
                  extra={
                    task.kind.case === "diagnostic" ? (
                      <Button variant="ghost" className="-ml-4 mt-1" onClick={() => skip.mutate()} disabled={skip.isPending}>
                        {m.skipDiagnostic}
                      </Button>
                    ) : undefined
                  }
                />
              ))}
            {!d.active && d.tasks.length > 1 && <p className="text-sm text-muted">{m.tasksHint}</p>}
            {!d.active && d.tasks.length === 0 && <Card className="text-muted">{m.nothingToDo}</Card>}
          </section>
          <ConversationsCard courseId={courseId} subjectId={subjectId} />
          <RecentWork courseId={courseId} subject={subjectId} />
        </div>

        <aside className="grid items-start gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <EarnedCard total={xp.total} today={xp.today} />
          <GoalsCard d={d} />
          <ForecastCard d={d} />
          <LeagueSummary />
        </aside>
      </div>
    </div>
  );
}
