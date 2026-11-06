import { ArrowLeft, Warning } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";

import { GoalsEditor } from "../../components/GoalsEditor.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Bar, Button, buttonClass, Card, Spinner } from "../../components/ui.tsx";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { account, catalog, timeZone } from "../../lib/rpc.ts";

export const Route = createFileRoute("/guardian/$learnerId")({ component: GuardedLearner });

function GuardedLearner() {
  const { learnerId } = Route.useParams();
  const { m, tx } = useI18n();
  const session = useRequireSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const detail = useQuery({
    queryKey: ["guarded", learnerId],
    queryFn: () => account.getGuardedLearner({ learnerId, timeZone: timeZone() }),
    enabled: !!session,
    staleTime: 0,
  });
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  const remove = useMutation({
    mutationFn: () => account.removeGuardedLearner({ learnerId }),
    onSuccess: async () => {
      await qc.invalidateQueries({ queryKey: ["guarded"] });
      await navigate({ to: "/guardian" });
    },
  });

  if (!session || detail.isPending) return <Spinner label={m.loading} />;
  if (detail.isError) return <LoadError error={detail.error} onRetry={() => detail.refetch()} />;
  const d = detail.data;
  const xp = d.learner?.xp;
  const recent = d.recent;
  const failing = !!recent && recent.lessons >= 3 && recent.failedLessons * 10 > recent.lessons;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div className="space-y-2">
        <Link to="/guardian" className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {m.guardedTitle}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{d.learner?.name}</h1>
      </div>

      <Card className="space-y-3">
        <div className="flex flex-wrap gap-6">
          <div>
            <div className="text-2xl font-semibold">{xp?.today ?? 0}</div>
            <div className="text-xs text-muted">
              {m.today}
              {xp?.goalToday ? ` / ${xp.goalToday}` : ""} XP
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{xp?.week ?? 0}</div>
            <div className="text-xs text-muted">
              {m.goalWeek}
              {xp?.goalWeek ? ` / ${xp.goalWeek}` : ""} XP
            </div>
          </div>
          <div>
            <div className="text-2xl font-semibold">{xp?.total ?? 0}</div>
            <div className="text-xs text-muted">{m.total} XP</div>
          </div>
        </div>
        <div className="text-sm">
          <div className="font-medium">{m.recentWork}</div>
          <div className="text-muted">
            {m.recentLessons(recent?.lessons ?? 0, recent?.failedLessons ?? 0)} · {m.recentBlownOff(recent?.blownOff ?? 0)}
          </div>
        </div>
        {failing && (
          <p className="flex gap-2 text-sm text-warn">
            <Warning size={18} className="shrink-0" /> {m.warningFailing}
          </p>
        )}
        {!!recent?.blownOff && (
          <p className="flex gap-2 text-sm text-warn">
            <Warning size={18} className="shrink-0" /> {m.warningRushing}
          </p>
        )}
      </Card>

      <Card className="space-y-3">
        <h2 className="text-lg font-semibold">{m.courses}</h2>
        {d.enrollments.length === 0 && <p className="text-sm text-muted">{m.noCourses}</p>}
        {d.enrollments.map((e) => {
          const title = courses.data?.courses.find((c) => c.id === e.courseId)?.title;
          const stats = e.stats;
          return (
            <div key={e.courseId} className="space-y-1 text-sm">
              <div className="flex justify-between gap-3">
                <span>{title ? tx(title) : e.courseId}</span>
                <span className="shrink-0 text-muted">
                  {stats?.learned ?? 0} / {stats?.total ?? 0}
                </span>
              </div>
              <Bar value={stats?.total ? stats.learned / stats.total : 0} />
            </div>
          );
        })}
      </Card>

      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">{m.goals}</h2>
        <GoalsEditor
          initial={{ weekdays: d.goals?.weekdays ?? [], paused: d.goals?.paused ?? false }}
          onSave={async (goals) => {
            await account.setGuardedGoals({ learnerId, goals: { weekdays: [...goals.weekdays], paused: goals.paused } });
            await detail.refetch();
          }}
        />
      </Card>

      <Button variant="secondary" onClick={() => remove.mutate()} disabled={remove.isPending}>
        {m.stopFollowing}
      </Button>
    </div>
  );
}
