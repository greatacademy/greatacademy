import type { Task } from "@ga/proto/learning/v1/learning_pb";
import { CalendarCheck, ChartBar, ClockCounterClockwise, Flag, Lightning, MapTrifold, Target, Trophy } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { Forecast } from "../../../components/Forecast.tsx";
import { LoadError } from "../../../components/LoadError.tsx";
import { TaskCard } from "../../../components/TaskCard.tsx";
import { Bar, Button, buttonClass, Card, ErrorNote, Spinner } from "../../../components/ui.tsx";
import { useEnrollFirst, useRequireSession } from "../../../lib/hooks.ts";
import { useI18n } from "../../../lib/i18n.tsx";
import { catalog, learning, timeZone } from "../../../lib/rpc.ts";

export const Route = createFileRoute("/learn/$courseId/")({ component: Dashboard });

function GoalBar({ label, value, goal, done }: { label: string; value: number; goal: number; done: string }) {
  return (
    <div className="space-y-1">
      <div className="flex justify-between gap-2">
        <span>{label}</span>
        <span className={goal > 0 && value >= goal ? "font-medium text-good" : "text-muted"}>
          {value} / {goal} XP{goal > 0 && value >= goal ? ` · ${done}` : ""}
        </span>
      </div>
      <Bar value={goal > 0 ? value / goal : 0} className={goal > 0 && value >= goal ? "bg-good" : "bg-accent"} />
    </div>
  );
}

function Dashboard() {
  const { courseId } = Route.useParams();
  const { m, tx, locale } = useI18n();
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
    mutationFn: (task: Task) => learning.startTask({ courseId, task }),
    onSuccess: (res) => navigate({ to: "/session/$sessionId", params: { sessionId: res.session!.id } }),
  });
  const skip = useMutation({
    mutationFn: () => learning.skipDiagnostic({ courseId }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["dashboard", courseId] }),
  });

  // Not enrolled: the course page has the enroll button.
  const notEnrolled = useEnrollFirst(courseId, dash.error);

  if (!session || dash.isPending || notEnrolled) return <Spinner label={m.loading} />;
  if (dash.isError) return <LoadError error={dash.error} onRetry={() => dash.refetch()} />;
  const d = dash.data;
  const stats = d.stats!;
  const xp = d.xp!;
  const maxDay = Math.max(1, ...xp.days);
  const today = new Date();
  const dayLabel = (i: number) => {
    const date = new Date(today);
    date.setDate(today.getDate() - (xp.days.length - 1 - i));
    return date.toLocaleDateString(locale, { month: "numeric", day: "numeric" });
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <div className="text-sm text-muted">{m.dashboard}</div>
          <h1 className="text-2xl font-semibold tracking-tight">{tx(course.data?.course?.title)}</h1>
        </div>
        <div className="flex flex-wrap gap-2">
          <Link to="/league" className={buttonClass("secondary")}>
            <Trophy size={18} /> {m.league}
          </Link>
          <Link to="/learn/$courseId/history" params={{ courseId }} className={buttonClass("secondary")}>
            <ClockCounterClockwise size={18} /> {m.history}
          </Link>
          <Link to="/learn/$courseId/progress" params={{ courseId }} className={buttonClass("secondary")}>
            <MapTrifold size={18} /> {m.progress}
          </Link>
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <Card className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Target size={18} /> {m.learned}
          </div>
          <div className="text-2xl font-semibold">
            {stats.learned}
            <span className="text-base font-normal text-muted"> / {stats.total}</span>
          </div>
          <Bar value={stats.total ? stats.learned / stats.total : 0} />
        </Card>
        <Card className="space-y-3 p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <Lightning size={18} /> {m.xpTitle}
          </div>
          <div className="flex items-baseline gap-4">
            <div>
              <div className="text-2xl font-semibold">{xp.today}</div>
              <div className="text-xs text-muted">{m.today}</div>
            </div>
            <div>
              <div className="text-2xl font-semibold">{xp.total}</div>
              <div className="text-xs text-muted">{m.total}</div>
            </div>
          </div>
        </Card>
        <Card className="space-y-2 p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <ChartBar size={18} /> {m.last14}
          </div>
          <div className="flex h-14 items-end gap-1" role="img" aria-label={m.last14}>
            {xp.days.map((v, i) => (
              <div
                // biome-ignore lint/suspicious/noArrayIndexKey: fixed 14-day window
                key={i}
                title={`${dayLabel(i)}: ${v} XP`}
                className={`flex-1 rounded-sm ${v < 0 ? "bg-bad" : i === xp.days.length - 1 ? "bg-accent" : "bg-accent/35"}`}
                style={{ height: `${Math.max(4, (v / maxDay) * 100)}%` }}
              />
            ))}
          </div>
          {stats.due > 0 && (
            <div className="text-xs text-warn">
              {m.due}: {stats.due}
            </div>
          )}
        </Card>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <Card className="space-y-3 p-5">
          <div className="flex items-center justify-between gap-2 text-sm text-muted">
            <span className="flex items-center gap-2">
              <Flag size={18} /> {m.goals}
            </span>
            <Link to="/settings" className="text-accent">
              {m.setGoals}
            </Link>
          </div>
          {xp.goalWeek > 0 ? (
            <div className="space-y-3 text-sm">
              <GoalBar label={m.goalToday} value={xp.today} goal={xp.goalToday} done={m.goalDone} />
              <GoalBar label={m.goalWeek} value={xp.week} goal={xp.goalWeek} done={m.goalDone} />
            </div>
          ) : (
            <p className="text-sm text-muted">{m.goalNone}</p>
          )}
        </Card>
        <Card className="space-y-2 p-5">
          <div className="flex items-center gap-2 text-sm text-muted">
            <CalendarCheck size={18} /> {m.forecast}
          </div>
          <Forecast remaining={d.remainingXp} pace={d.pace} goalPace={xp.goalWeek / 7} />
        </Card>
      </div>

      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-semibold">{m.yourTasks}</h2>
          {d.tasks.length > 1 && <p className="text-sm text-muted">{m.tasksHint}</p>}
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
        {!d.active && d.tasks.length === 0 && <Card className="text-muted">{m.nothingToDo}</Card>}
      </section>
    </div>
  );
}
