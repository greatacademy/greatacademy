import type { FinishedSession, Task } from "@ga/proto/learning/v1/learning_pb";
import { ArrowLeft, CalendarCheck, CheckCircle, Flag, Warning, XCircle } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { Forecast } from "../../components/Forecast.tsx";
import { GoalsEditor } from "../../components/GoalsEditor.tsx";
import { LearnerPrivacy } from "../../components/LearnerPrivacy.tsx";
import { ActiveLine, signText } from "../../components/LearnerStatus.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Markdown } from "../../components/Markdown.tsx";
import { TopicLegend, TopicMap } from "../../components/TopicMap.tsx";
import { Bar, Button, buttonClass, Card, Spinner } from "../../components/ui.tsx";
import { XpOverview } from "../../components/XpOverview.tsx";
import { signsOf, stuckLessons } from "../../lib/guardian.ts";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { account, catalog, learning, privacy, timeZone } from "../../lib/rpc.ts";

export const Route = createFileRoute("/guardian/$learnerId")({ component: GuardedLearner });

function TaskName({ task }: { task: Task | undefined }) {
  const { m, tx } = useI18n();
  const kind = task?.kind;
  if (kind?.case === "lesson" || kind?.case === "review") return <Markdown source={tx(kind.value.title)} inline />;
  return kind?.case === "quiz" ? m.quiz : m.diagnostic;
}

function useTaskLabel() {
  const { m } = useI18n();
  return (task: Task | undefined) => {
    const c = task?.kind.case;
    return c === "lesson" ? m.lesson : c === "review" ? m.review : c === "quiz" ? m.quiz : m.diagnostic;
  };
}

/** daysOf groups sessions, listed newest first, by the local day they were finished. */
function daysOf(sessions: readonly FinishedSession[], locale: string) {
  const format = new Intl.DateTimeFormat(locale, { weekday: "short", month: "short", day: "numeric" });
  const days: { label: string; xp: number; sessions: FinishedSession[] }[] = [];
  for (const s of sessions) {
    const label = format.format(new Date(Number(s.completedAt)));
    let day = days.at(-1);
    if (day?.label !== label) {
      day = { label, xp: 0, sessions: [] };
      days.push(day);
    }
    day.xp += s.xp;
    day.sessions.push(s);
  }
  return days;
}

/** Activity shows what the learner will do next and what they did, day by day. Sessions are not opened: their answers stay the learner's. */
function Activity({ learnerId, courseId }: { learnerId: string; courseId: string }) {
  const { m, locale } = useI18n();
  const label = useTaskLabel();
  const dash = useQuery({
    queryKey: ["guarded", learnerId, "dashboard", courseId],
    queryFn: () => learning.getDashboard({ courseId, timeZone: timeZone(), learnerId }),
    staleTime: 0,
  });
  const history = useQuery({
    queryKey: ["guarded", learnerId, "history", courseId],
    queryFn: () => learning.listSessions({ courseId, learnerId }),
    staleTime: 0,
  });
  if (dash.isPending || history.isPending) return <Spinner label={m.loading} />;
  if (dash.isError) return <LoadError error={dash.error} onRetry={() => dash.refetch()} />;
  if (history.isError) return <LoadError error={history.error} onRetry={() => history.refetch()} />;
  const time = new Intl.DateTimeFormat(locale, { timeStyle: "short" });
  const coming = dash.data.active?.task ? [dash.data.active.task] : dash.data.tasks;
  const stuck = stuckLessons(history.data.sessions);
  const days = daysOf(history.data.sessions, locale);
  return (
    <div className="space-y-6">
      {stuck.map((s) => (
        <Card key={s.session.id} className="flex gap-3 border-warn/40 bg-warn-soft p-4 text-sm">
          <Warning size={20} className="shrink-0 text-warn" />
          <div className="min-w-0">
            <div className="font-medium">
              {m.stuckTitle}: <TaskName task={s.session.task} />
            </div>
            <p className="text-muted">{m.stuckBody(s.times)}</p>
          </div>
        </Card>
      ))}
      {coming.length > 0 && (
        <section className="space-y-2">
          <h2 className="text-sm font-medium text-muted">{dash.data.active ? m.workingOn : m.nextUp}</h2>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface text-sm">
            {coming.map((t, i) => (
              // biome-ignore lint/suspicious/noArrayIndexKey: tasks have no id; the list is replaced as a whole
              <li key={i} className="flex items-center gap-3 px-4 py-3">
                <span className="w-16 shrink-0 text-xs text-muted">{label(t)}</span>
                <span className="min-w-0 flex-1 truncate font-medium">
                  <TaskName task={t} />
                </span>
              </li>
            ))}
          </ul>
        </section>
      )}
      {days.length === 0 && <p className="text-sm text-muted">{m.noActivity}</p>}
      {days.map((day) => (
        <section key={day.label} className="space-y-2">
          <div className="flex items-baseline justify-between gap-3 text-sm">
            <h2 className="font-medium">{day.label}</h2>
            <span className="text-muted">{day.xp} XP</span>
          </div>
          <ul className="divide-y divide-line rounded-2xl border border-line bg-surface text-sm">
            {day.sessions.map((s) => (
              <li key={s.id} className="flex items-center gap-3 px-4 py-3">
                {s.passed ? (
                  <CheckCircle size={20} weight="fill" className="shrink-0 text-good" />
                ) : (
                  <XCircle size={20} weight="fill" className="shrink-0 text-bad" />
                )}
                <div className="min-w-0 flex-1">
                  <div className="truncate">
                    <TaskName task={s.task} />
                  </div>
                  <div className="text-xs text-muted">
                    {label(s.task)} · {time.format(new Date(Number(s.completedAt)))}
                    {s.blownOff && <span className="text-warn"> · {m.blownOffShort}</span>}
                  </div>
                </div>
                {s.task?.kind.case !== "diagnostic" && (
                  <span className={`shrink-0 ${s.xp < 0 ? "text-bad" : "text-muted"}`}>{m.earnedOf(s.xp, s.fullXp)}</span>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}

function CourseProgress({ learnerId, courseId }: { learnerId: string; courseId: string }) {
  const { m } = useI18n();
  const course = useQuery({ queryKey: ["course", courseId], queryFn: () => catalog.getCourse({ courseId }) });
  const progress = useQuery({
    queryKey: ["guarded", learnerId, "progress", courseId],
    queryFn: () => learning.getCourseProgress({ courseId, learnerId }),
    staleTime: 0,
  });
  if (course.isPending || progress.isPending) return <Spinner label={m.loading} />;
  if (course.isError) return <LoadError error={course.error} onRetry={() => course.refetch()} />;
  if (progress.isError) return <LoadError error={progress.error} onRetry={() => progress.refetch()} />;
  if (!course.data.course) return null;
  return (
    <div className="space-y-4">
      <TopicLegend />
      <TopicMap course={course.data.course} topics={progress.data.topics} />
    </div>
  );
}

function CourseForecast({ learnerId, courseId }: { learnerId: string; courseId: string }) {
  const { m } = useI18n();
  const dash = useQuery({
    queryKey: ["guarded", learnerId, "dashboard", courseId],
    queryFn: () => learning.getDashboard({ courseId, timeZone: timeZone(), learnerId }),
    staleTime: 0,
  });
  if (!dash.data) return null;
  return (
    <Card className="space-y-2 p-5">
      <div className="flex items-center gap-2 text-sm text-muted">
        <CalendarCheck size={18} /> {m.forecastTheirTitle}
      </div>
      <Forecast remaining={dash.data.remainingXp} pace={dash.data.pace} goalPace={(dash.data.xp?.goalWeek ?? 0) / 7} guardian />
    </Card>
  );
}

function GuardedLearner() {
  const { learnerId } = Route.useParams();
  const { m, tx } = useI18n();
  const session = useRequireSession();
  const navigate = useNavigate();
  const qc = useQueryClient();
  const consents = useQuery({ queryKey: ["consents", learnerId], queryFn: () => privacy.listConsents({ learnerId }), enabled: !!session });
  const [chosen, setChosen] = useState<string>();
  const [tab, setTab] = useState<"activity" | "progress">("activity");
  const [confirming, setConfirming] = useState(false);
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
  const learner = d.learner!;
  const current = d.enrollments.find((e) => e.courseId === chosen) ?? d.enrollments[0];
  const courseId = current?.courseId;
  const titleOf = (id: string) => {
    const title = courses.data?.courses.find((c) => c.id === id)?.title;
    return title ? tx(title) : "";
  };
  const share = current?.stats?.total ? current.stats.learned / current.stats.total : 0;
  const signs = signsOf(learner, Date.now());
  const segment = (active: boolean) =>
    `rounded-lg px-3 py-1.5 text-sm font-medium transition ${active ? "bg-accent-soft text-accent" : "text-muted hover:text-ink"}`;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/guardian" className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {m.guardedTitle}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">{learner.name}</h1>
        <ActiveLine learner={learner} />
      </div>

      {signs.length > 0 && (
        <Card className="space-y-1 border-warn/40 bg-warn-soft p-4 text-sm">
          <div className="font-medium">{m.attention}</div>
          {signs.map((s) => (
            <p key={s.kind} className="flex gap-2 text-muted">
              <Warning size={18} className="shrink-0 text-warn" /> {signText(s, m)}
            </p>
          ))}
        </Card>
      )}

      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <div className="min-w-0 space-y-4">
          {!courseId && <Card className="text-muted">{m.noCourseYet}</Card>}
          {courseId && (
            <>
              <div className="flex gap-1">
                <button
                  type="button"
                  aria-pressed={tab === "activity"}
                  className={segment(tab === "activity")}
                  onClick={() => setTab("activity")}
                >
                  {m.activity}
                </button>
                <button
                  type="button"
                  aria-pressed={tab === "progress"}
                  className={segment(tab === "progress")}
                  onClick={() => setTab("progress")}
                >
                  {m.progress}
                </button>
              </div>
              {tab === "activity" ? (
                <Activity learnerId={learnerId} courseId={courseId} />
              ) : (
                <CourseProgress learnerId={learnerId} courseId={courseId} />
              )}
            </>
          )}
        </div>

        <aside className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
          {current && (
            <Card className="space-y-3 p-5">
              {d.enrollments.map((e) => {
                const selected = e.courseId === courseId;
                const part = e.stats?.total ? e.stats.learned / e.stats.total : 0;
                return (
                  <button
                    key={e.courseId}
                    type="button"
                    aria-pressed={selected}
                    disabled={d.enrollments.length === 1}
                    onClick={() => setChosen(e.courseId)}
                    className={`block w-full space-y-1 text-left text-sm ${selected || d.enrollments.length === 1 ? "font-medium" : "text-muted hover:text-ink"}`}
                  >
                    <span className="flex justify-between gap-3">
                      <span className="min-w-0 truncate">{titleOf(e.courseId)}</span>
                      <span className="shrink-0">{Math.round(part * 100)}%</span>
                    </span>
                    <Bar value={part} />
                    <span className="block text-xs font-normal text-muted">
                      {e.stats?.learned ?? 0} / {e.stats?.total ?? 0} {m.topics}
                    </span>
                  </button>
                );
              })}
              {current.stats?.due ? (
                <div className="text-xs text-warn">
                  {m.due}: {current.stats.due}
                </div>
              ) : null}
              {share >= 1 && <p className="text-sm text-good">{m.forecastDone}</p>}
            </Card>
          )}
          {courseId && <CourseForecast learnerId={learnerId} courseId={courseId} />}
          <Card className="space-y-4 p-5">
            {learner.xp && <XpOverview xp={learner.xp} />}
            <details>
              <summary className="flex cursor-pointer items-center gap-2 text-sm text-accent">
                <Flag size={18} /> {m.setGoals}
              </summary>
              <div className="mt-3">
                <GoalsEditor
                  initial={{ weekdays: d.goals?.weekdays ?? [], paused: d.goals?.paused ?? false }}
                  onSave={async (goals) => {
                    await account.setGuardedGoals({ learnerId, goals: { weekdays: [...goals.weekdays], paused: goals.paused } });
                    await detail.refetch();
                  }}
                />
              </div>
            </details>
          </Card>
          <LearnerPrivacy learnerId={learnerId} name={learner.name} />
          {consents.data?.managed ? null : confirming ? (
            <Card className="space-y-3 p-5 text-sm">
              <p>{m.stopFollowingConfirm(learner.name)}</p>
              <div className="flex flex-wrap gap-2">
                <Button variant="secondary" onClick={() => remove.mutate()} disabled={remove.isPending}>
                  {m.stopFollowing}
                </Button>
                <Button variant="ghost" onClick={() => setConfirming(false)}>
                  {m.keepFollowing}
                </Button>
              </div>
            </Card>
          ) : (
            <Button variant="ghost" className="justify-self-start" onClick={() => setConfirming(true)}>
              {m.stopFollowing}
            </Button>
          )}
        </aside>
      </div>
    </div>
  );
}
