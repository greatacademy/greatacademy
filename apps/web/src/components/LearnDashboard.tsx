import { Menu } from "@base-ui/react/menu";
import type { Task } from "@ga/proto/learning/v1/learning_pb";
import {
  CalendarCheck,
  CaretDown,
  CheckCircle,
  ClockCounterClockwise,
  Flag,
  MapTrifold,
  Plus,
  Trophy,
  XCircle,
} from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link, useNavigate } from "@tanstack/react-router";

import { useEnrollFirst, useRequireSession } from "../lib/hooks.ts";
import { useI18n } from "../lib/i18n.tsx";
import { account, catalog, learning, timeZone } from "../lib/rpc.ts";
import { Forecast } from "./Forecast.tsx";
import { LoadError } from "./LoadError.tsx";
import { Markdown } from "./Markdown.tsx";
import { TaskCard } from "./TaskCard.tsx";
import { Bar, Button, buttonClass, Card, ErrorNote, menuItem, menuPopup, Spinner } from "./ui.tsx";
import { XpOverview } from "./XpOverview.tsx";

const DAY = 86_400_000;

/** CourseSwitcher names the current course and moves to another, or to the catalog to add one. */
function CourseSwitcher({ courseId, title }: { courseId: string; title: string }) {
  const { m, tx } = useI18n();
  const navigate = useNavigate();
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => learning.getProfile({ timeZone: timeZone() }) });
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  const titleOf = (id: string) => tx(courses.data?.courses.find((c) => c.id === id)?.title);
  return (
    <Menu.Root>
      <Menu.Trigger className="-ml-2 flex max-w-full items-center gap-2 rounded-lg px-2 py-1 text-left text-2xl font-semibold tracking-tight hover:bg-accent-soft">
        <span className="min-w-0">{title}</span>
        <CaretDown size={18} className="shrink-0 text-muted" />
      </Menu.Trigger>
      <Menu.Portal>
        <Menu.Positioner sideOffset={6} align="start" className="z-30">
          <Menu.Popup className={menuPopup}>
            {profile.data?.enrollments.map((e) => (
              <Menu.Item
                key={e.courseId}
                className={menuItem}
                onClick={() => navigate({ to: "/learn/$courseId", params: { courseId: e.courseId } })}
              >
                <span>{titleOf(e.courseId) || e.courseId}</span>
                {e.courseId === courseId && <span className="text-accent">●</span>}
              </Menu.Item>
            ))}
            <Menu.Item className={menuItem} onClick={() => navigate({ to: "/courses" })}>
              <span className="flex items-center gap-2 text-accent">
                <Plus size={14} /> {m.addCourse}
              </span>
            </Menu.Item>
          </Menu.Popup>
        </Menu.Positioner>
      </Menu.Portal>
    </Menu.Root>
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
function RecentWork({ courseId }: { courseId: string }) {
  const { m, tx } = useI18n();
  const history = useQuery({ queryKey: ["history", courseId], queryFn: () => learning.listSessions({ courseId }), staleTime: 0 });
  const recent = history.data?.sessions.slice(0, 3) ?? [];
  if (recent.length === 0) return null;
  return (
    <section className="space-y-3">
      <div className="flex items-baseline justify-between gap-3">
        <h2 className="text-sm font-medium text-muted">{m.recentTasks}</h2>
        <Link to="/learn/$courseId/history" params={{ courseId }} className="text-sm text-accent">
          {m.seeAll}
        </Link>
      </div>
      <ul className="divide-y divide-line rounded-2xl border border-line bg-surface">
        {recent.map((s) => {
          const task = s.task?.kind;
          const label =
            task?.case === "lesson" ? m.lesson : task?.case === "review" ? m.review : task?.case === "quiz" ? m.quiz : m.diagnostic;
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
                  {task?.case === "lesson" || task?.case === "review" ? <Markdown source={tx(task.value.title)} inline /> : label}
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
 * LearnDashboard is the learner's home in a course. The next task comes first, since
 * it is what the learner came for; goals, the forecast and the league sit beside it.
 */
export function LearnDashboard({ courseId }: { courseId: string }) {
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
  const share = stats.total ? stats.learned / stats.total : 0;
  const goalNote = xp.goalToday <= 0 ? "" : xp.today >= xp.goalToday ? m.goalMetToday : m.goalLeftToday(xp.goalToday - xp.today);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-x-6 gap-y-3">
        <div className="min-w-0 flex-1 basis-72 space-y-2">
          <CourseSwitcher courseId={courseId} title={tx(course.data?.course?.title)} />
          <div className="flex max-w-md items-center gap-3 text-sm text-muted">
            <Bar value={share} />
            <span className="shrink-0">
              {stats.learned} / {stats.total} {m.topics}
            </span>
          </div>
        </div>
        <div className="flex flex-wrap gap-1">
          <Link to="/learn/$courseId/progress" params={{ courseId }} className={buttonClass("ghost")}>
            <MapTrifold size={18} /> {m.progress}
          </Link>
          <Link to="/learn/$courseId/history" params={{ courseId }} className={buttonClass("ghost")}>
            <ClockCounterClockwise size={18} /> {m.history}
          </Link>
        </div>
      </div>

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-6">
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
          <RecentWork courseId={courseId} />
        </div>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          <Card className="space-y-4 p-5">
            <div className="flex items-center justify-between gap-2 text-sm text-muted">
              <span className="flex items-center gap-2">
                <Flag size={18} /> {m.goals}
              </span>
              <Link to="/settings" className="text-accent">
                {m.setGoals}
              </Link>
            </div>
            <XpOverview xp={xp} />
            {stats.due > 0 && (
              <div className="text-xs text-warn">
                {m.due}: {stats.due}
              </div>
            )}
          </Card>
          <Card className="space-y-2 p-5">
            <div className="flex items-center gap-2 text-sm text-muted">
              <CalendarCheck size={18} /> {m.forecast}
            </div>
            <Forecast remaining={d.remainingXp} pace={d.pace} goalPace={xp.goalWeek / 7} />
          </Card>
          <LeagueSummary />
        </aside>
      </div>
    </div>
  );
}
