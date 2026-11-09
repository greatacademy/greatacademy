import type { GetDashboardResponse, Task, XpSummary } from "@ga/proto/learning/v1/learning_pb";
import { computed, effect, type Resource, signal, Text, View, windowSize } from "nsh";
import { errorText, m } from "../lib/i18n.ts";
import { nav, openTab } from "../lib/nav.ts";
import { markChanged, query } from "../lib/query.ts";
import { learning, timeZone } from "../lib/rpc.ts";
import { courseTitle, type Place, tint, usePlace } from "../lib/subject.tsx";
import { Card, colors, ErrorNote, Loaded, Muted, PullScroll, Skeleton } from "../lib/ui.tsx";
import { SubjectStart } from "./CourseTab.tsx";
import { firstPageReady } from "./Launch.tsx";
import { CourseDone, PlacementReport } from "./PlacementReport.tsx";
import { TaskCard } from "./TaskCard.tsx";

/** ASIDE_FROM is the window width, in points, from which the goals sit in a column of ASIDE_WIDTH beside the tasks. */
const ASIDE_FROM = 1024;
const ASIDE_WIDTH = 320;

/** useDashboard reads the dashboard of the course shown in a subject's tab, while the tab shows. */
export function useDashboard(visible: () => boolean, place: () => Place | undefined): Resource<GetDashboardResponse> {
  const course = computed(() => (visible() && place()?.enrollment?.courseId) || undefined);
  return query(
    course,
    (courseId) => ["dashboard", courseId],
    (courseId, { signal: abort }) => learning.getDashboard({ courseId, timeZone: timeZone() }, { signal: abort }),
  );
}

/** Bar is a share (0 to 1) as a bar in a color. */
export function Bar(props: { share: number; color: string; height?: number }) {
  const height = () => props.height ?? 8;
  return (
    <View style={{ backgroundColor: colors().line, borderRadius: height() / 2, height: height(), overflow: "hidden" }}>
      <View
        style={{
          backgroundColor: props.color,
          borderRadius: height() / 2,
          height: height(),
          width: `${Math.min(100, Math.max(0, props.share * 100))}%`,
        }}
      />
    </View>
  );
}

/** GoalBar is one goal's progress: what was earned against the goal, as a bar that turns green once it is met. */
function GoalBar(props: { label: string; xp: number; goal: number; color: string }) {
  const met = () => props.xp >= props.goal;
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 15, fontWeight: "500" }}>{props.label}</Text>
        <Text style={{ color: met() ? colors().good : colors().muted, fontSize: 14, fontVariant: ["tabular-nums"] }}>
          {met() ? `${m().goalDone} · ${m().goalOf(props.xp, props.goal)}` : m().goalOf(props.xp, props.goal)}
        </Text>
      </View>
      <Bar share={props.xp / props.goal} color={met() ? colors().good : props.color} />
    </View>
  );
}

/**
 * WeeklyGoals shows today's XP and the week's in a subject against its goals; whoever decides for the learner sets
 * them, and the learner of a guardian is told who does.
 */
export function WeeklyGoals(props: { dash: GetDashboardResponse; color: string }) {
  const xp = (): XpSummary | undefined => props.dash.xp;
  const paused = () => props.dash.goals?.paused ?? false;
  const today = () => xp()?.today ?? 0;
  const goalToday = () => xp()?.goalToday ?? 0;
  const goalWeek = () => xp()?.goalWeek ?? 0;
  return (
    <Card>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>{m().goals}</Text>
        <If when={props.dash.canDecide}>
          <Text
            role="button"
            onPress={() => nav.push({ name: "goals", subjectId: props.dash.subjectId })}
            style={{ color: colors().accent, fontSize: 15 }}
          >
            {m().setGoals}
          </Text>
        </If>
      </View>
      <If when={!paused() && goalWeek() > 0} else={<Muted>{paused() ? m().goalsPausedNote : m().goalNone}</Muted>}>
        <If when={goalToday() > 0}>
          <GoalBar label={m().goalToday} xp={today()} goal={goalToday()} color={props.color} />
        </If>
        <GoalBar label={m().goalWeek} xp={xp()?.week ?? 0} goal={goalWeek()} color={props.color} />
        <Muted>
          {goalToday() === 0
            ? m().xpWeek(xp()?.week ?? 0)
            : today() >= goalToday()
              ? m().goalMetToday
              : m().goalLeftToday(goalToday() - today())}
        </Muted>
      </If>
      <If when={!props.dash.canDecide}>
        <Muted>{m().guardianDecides}</Muted>
      </If>
    </Card>
  );
}

/** Chip is a short note in a tone, as of the reviews due. */
function Chip(props: { label: string; color: string; background: string }) {
  return (
    <Text
      style={{
        backgroundColor: props.background,
        borderRadius: 8,
        color: props.color,
        fontSize: 13,
        paddingHorizontal: 8,
        paddingVertical: 4,
      }}
    >
      {props.label}
    </Text>
  );
}

/** CourseToday is the course of the subject at the head of the Learn tab: how far the learner is and what is due. */
function CourseToday(props: { place: Place; dash: GetDashboardResponse }) {
  const stats = () => props.dash.stats;
  const color = () => tint(props.place.subject);
  return (
    <Card>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
        <Text role="button" onPress={() => openTab("course")} style={{ color: colors().ink, flex: 1, fontSize: 20, fontWeight: "700" }}>
          {courseTitle(props.place.data.list, props.dash.courseId)}
        </Text>
      </View>
      <Bar share={(stats()?.learned ?? 0) / Math.max(1, stats()?.total ?? 0)} color={color().strong} />
      <Muted>{m().topicsLearned(stats()?.learned ?? 0, stats()?.total ?? 0)}</Muted>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <If when={(stats()?.due ?? 0) > 0}>
          <Chip label={m().dueReviews(stats()?.due ?? 0)} color={colors().warn} background={colors()["warn-soft"]} />
        </If>
        <If when={props.dash.diagnosed && props.dash.xpToQuiz > 0}>
          <Chip label={m().xpToQuiz(props.dash.xpToQuiz)} color={color().onSoft} background={color().soft} />
        </If>
      </View>
    </Card>
  );
}

/** Today is the Learn tab of a subject with a course: the task in progress, the diagnostic's report, and what is next. */
function Today(props: { place: Place; dash: Resource<GetDashboardResponse>; onAnswered: () => void }) {
  const busy = signal(false);
  const error = signal("");
  const act = async (run: () => Promise<void>) => {
    busy.set(true);
    error.set("");
    try {
      await run();
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  const start = (courseId: string, task: Task) =>
    act(async () => {
      const { session } = await learning.startTask({ courseId, task, timeZone: timeZone() });
      if (session) nav.push({ name: "session", sessionId: session.id });
    });
  const skip = (courseId: string) =>
    act(async () => {
      await learning.skipDiagnostic({ courseId });
      props.dash.refetch();
    });
  // A wide window keeps the goals in a column beside the tasks, as the web's learn page does.
  const wide = () => windowSize().width >= ASIDE_FROM;
  return (
    <Loaded rpc={props.dash} skeleton={<Skeleton rows={3} />}>
      {(d) => (
        <PullScroll onRefresh={props.dash.refetch} refreshing={props.dash.state() === "refreshing"} underBar>
          <View style={{ alignItems: wide() ? "flex-start" : "stretch", flexDirection: wide() ? "row" : "column", gap: wide() ? 24 : 12 }}>
            <View style={{ flexBasis: wide() ? 0 : "auto", flexGrow: 1, flexShrink: 1, gap: 12, minWidth: 0 }}>
              <If when={error()}>
                <ErrorNote message={error()} />
              </If>
              <If when={d().active?.task}>
                {(task) => (
                  <View style={{ gap: 8 }}>
                    <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600" }}>{m().pickUp}</Text>
                    <TaskCard
                      task={task()}
                      action={m().resume}
                      onStart={() => nav.push({ name: "session", sessionId: d().active?.id ?? "" })}
                    />
                  </View>
                )}
              </If>
              <CourseToday place={props.place} dash={d()} />
              <PlacementReport dash={d()} onAnswered={props.onAnswered} />
              <CourseDone dash={d()} onChosen={props.onAnswered} />
              <If when={!wide()}>
                <WeeklyGoals dash={d()} color={tint(props.place.subject).strong} />
              </If>
              <If when={!d().active}>
                <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600", marginTop: 4 }}>{m().nextUp}</Text>
                <Each of={d().tasks}>
                  {(task) => (
                    <TaskCard
                      task={task()}
                      action={m().start}
                      busy={busy()}
                      onStart={() => void start(d().courseId, task())}
                      extra={task().kind.case === "diagnostic" ? () => void skip(d().courseId) : undefined}
                    />
                  )}
                </Each>
                <If when={d().tasks.length > 1}>
                  <Muted>{m().tasksHint}</Muted>
                </If>
                <If when={d().tasks.length === 0}>
                  <Muted>{m().nothingToDo}</Muted>
                </If>
              </If>
            </View>
            <If when={wide()}>
              <View style={{ gap: 12, width: ASIDE_WIDTH }}>
                <WeeklyGoals dash={d()} color={tint(props.place.subject).strong} />
              </View>
            </If>
          </View>
        </PullScroll>
      )}
    </Loaded>
  );
}

/**
 * LearnTab is the first tab, the Learn page of the subject shown (docs/experience.md §3): the task in progress, the
 * course's next tasks and the subject's weekly goals; a subject with no course yet starts with choosing one.
 */
export function LearnTab(props: { visible: () => boolean }) {
  const { rpc, place } = usePlace(props.visible);
  const dash = useDashboard(props.visible, place);
  // The launch's mark leaves once this first page has its answer, or its error.
  effect(() => {
    if (rpc() !== undefined || rpc.error() !== undefined) firstPageReady.set(true);
  });
  // Keeping the course reads it again; taking another shows that one.
  const answered = () => {
    markChanged();
    rpc.refetch();
    dash.refetch();
  };
  return (
    <View style={{ backgroundColor: colors().page, flex: 1 }}>
      <Loaded rpc={rpc} skeleton={<Skeleton rows={3} />}>
        {() => (
          <If when={place()}>
            {(here) => (
              <If
                when={here().enrollment}
                else={<SubjectStart place={here()} onRefresh={rpc.refetch} refreshing={rpc.state() === "refreshing"} />}
              >
                <Today place={here()} dash={dash} onAnswered={answered} />
              </If>
            )}
          </If>
        )}
      </Loaded>
    </View>
  );
}
