import type { GetDashboardResponse, Task, XpSummary } from "@ga/proto/learning/v1/learning_pb";
import { computed, effect, signal, Text, View, windowSize } from "nsh";
import { errorText, m, tx } from "../lib/i18n.ts";
import { nav, openTab } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { account, catalog, learning, timeZone } from "../lib/rpc.ts";
import { Action, Card, Cell, colors, ErrorNote, Grid, Loaded, Muted, PullScroll, Quiet, Skeleton } from "../lib/ui.tsx";
import { firstPageReady } from "./Launch.tsx";
import { describeTask, TaskCard } from "./TaskCard.tsx";

/** ASIDE_FROM is the window width, in points, from which the goals sit in a column of ASIDE_WIDTH beside the tasks. */
const ASIDE_FROM = 1024;
const ASIDE_WIDTH = 320;

/** LearnData is what the Learn tab shows: the learner's XP and each enrolled course's dashboard, with its title. */
interface LearnData {
  xp: XpSummary | undefined;
  paused: boolean;
  courses: { courseId: string; title: string; dash: GetDashboardResponse }[];
}

async function loadLearn(abort: AbortSignal): Promise<LearnData> {
  const [profile, list, settings] = await Promise.all([
    learning.getProfile({ timeZone: timeZone() }, { signal: abort }),
    catalog.listCourses({}, { signal: abort }),
    account.getSettings({}, { signal: abort }),
  ]);
  const courses = await Promise.all(
    profile.enrollments.map(async (enrollment) => ({
      courseId: enrollment.courseId,
      title: tx(list.courses.find((course) => course.id === enrollment.courseId)?.title) || enrollment.courseId,
      dash: await learning.getDashboard({ courseId: enrollment.courseId, timeZone: timeZone() }, { signal: abort }),
    })),
  );
  return { xp: profile.xp, paused: settings.goals?.paused ?? false, courses };
}

/** GoalBar is one goal's progress: what was earned against the goal, as a bar that turns green once it is met. */
function GoalBar(props: { label: string; xp: number; goal: number }) {
  const met = () => props.xp >= props.goal;
  return (
    <View style={{ gap: 6 }}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 15, fontWeight: "500" }}>{props.label}</Text>
        <Text style={{ color: met() ? colors().good : colors().muted, fontSize: 14, fontVariant: ["tabular-nums"] }}>
          {met() ? `${m().goalDone} · ${m().goalOf(props.xp, props.goal)}` : m().goalOf(props.xp, props.goal)}
        </Text>
      </View>
      <View style={{ backgroundColor: colors().line, borderRadius: 4, height: 8, overflow: "hidden" }}>
        <View
          style={{
            backgroundColor: met() ? colors().good : colors().accent,
            borderRadius: 4,
            height: 8,
            width: `${Math.min(100, (props.xp / props.goal) * 100)}%`,
          }}
        />
      </View>
    </View>
  );
}

/** WeeklyGoals shows today's XP and the week's against the learner's goals, with a way to set them. */
function WeeklyGoals(props: { xp: XpSummary | undefined; paused: boolean }) {
  const today = () => props.xp?.today ?? 0;
  const goalToday = () => props.xp?.goalToday ?? 0;
  const goalWeek = () => props.xp?.goalWeek ?? 0;
  return (
    <Card>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>{m().goals}</Text>
        <Text role="button" onPress={() => nav.push({ name: "goals" })} style={{ color: colors().accent, fontSize: 15 }}>
          {m().setGoals}
        </Text>
      </View>
      <If when={!props.paused && goalWeek() > 0} else={<Muted>{props.paused ? m().goalsPausedNote : m().goalNone}</Muted>}>
        <If when={goalToday() > 0}>
          <GoalBar label={m().goalToday} xp={today()} goal={goalToday()} />
        </If>
        <GoalBar label={m().goalWeek} xp={props.xp?.week ?? 0} goal={goalWeek()} />
        <Muted>
          {goalToday() === 0
            ? m().xpWeek(props.xp?.week ?? 0)
            : today() >= goalToday()
              ? m().goalMetToday
              : m().goalLeftToday(goalToday() - today())}
        </Muted>
      </If>
    </Card>
  );
}

/** CourseDay is one course on the Learn tab: how far the learner is, what is due, and the next task. */
function CourseDay(props: { courseId: string; title: string; dash: GetDashboardResponse; busy: boolean; onStart: (task: Task) => void }) {
  const stats = () => props.dash.stats;
  const next = () => props.dash.tasks[0];
  return (
    <Card>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
        <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>{props.title}</Text>
        <Text
          role="button"
          onPress={() => nav.push({ name: "learn", courseId: props.courseId })}
          style={{ color: colors().accent, fontSize: 15 }}
        >
          {m().openCourse}
        </Text>
      </View>
      <Muted>{m().topicsLearned(stats()?.learned ?? 0, stats()?.total ?? 0)}</Muted>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
        <If when={(stats()?.due ?? 0) > 0}>
          <Text
            style={{
              backgroundColor: colors()["warn-soft"],
              borderRadius: 8,
              color: colors().warn,
              fontSize: 13,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            {m().dueReviews(stats()?.due ?? 0)}
          </Text>
        </If>
        <If when={props.dash.diagnosed && props.dash.xpToQuiz > 0}>
          <Text
            style={{
              backgroundColor: colors()["accent-soft"],
              borderRadius: 8,
              color: colors().accent,
              fontSize: 13,
              paddingHorizontal: 8,
              paddingVertical: 4,
            }}
          >
            {m().xpToQuiz(props.dash.xpToQuiz)}
          </Text>
        </If>
      </View>
      <If when={next()} else={<Muted>{m().nothingToDo}</Muted>}>
        {(task) => (
          <View style={{ gap: 4 }}>
            <Muted>{describeTask(task())?.label ?? ""}</Muted>
            <Text style={{ color: colors().ink, fontSize: 15 }}>{describeTask(task())?.title ?? ""}</Text>
            <Action label={m().start} disabled={props.busy} onPress={() => props.onStart(task())} />
          </View>
        )}
      </If>
    </Card>
  );
}

/** LearnTab is the first tab: what is in progress, the weekly goals, and the next task of each enrolled course. */
export function LearnTab(props: { visible: () => boolean }) {
  // Read again whenever the learner comes back to the tab, as from a task.
  const shown = computed(() => props.visible() || undefined);
  const learn = query(
    shown,
    () => ["learn"],
    (_, { signal: abort }) => loadLearn(abort),
  );
  // The launch's mark leaves once this first page has its answer, or its error.
  effect(() => {
    if (learn() !== undefined || learn.error() !== undefined) firstPageReady.set(true);
  });
  const busy = signal(false);
  const error = signal("");
  const start = async (courseId: string, task: Task) => {
    busy.set(true);
    error.set("");
    try {
      const { session } = await learning.startTask({ courseId, task, timeZone: timeZone() });
      if (session) nav.push({ name: "session", sessionId: session.id });
    } catch (e) {
      error.set(errorText(e));
    } finally {
      busy.set(false);
    }
  };
  // A wide window keeps the goals in a column beside the tasks, as the web's learn page does.
  const wide = () => windowSize().width >= ASIDE_FROM;
  const active = (data: LearnData) => data.courses.filter((course) => course.dash.active);

  return (
    <View style={{ backgroundColor: colors().page, flex: 1 }}>
      <Loaded rpc={learn} skeleton={<Skeleton rows={3} />}>
        {(data) => (
          <PullScroll onRefresh={learn.refetch} refreshing={learn.state() === "refreshing"} underBar>
            <View
              style={{ alignItems: wide() ? "flex-start" : "stretch", flexDirection: wide() ? "row" : "column", gap: wide() ? 24 : 12 }}
            >
              <View style={{ flexBasis: wide() ? 0 : "auto", flexGrow: 1, flexShrink: 1, gap: 12, minWidth: 0 }}>
                <If when={error()}>
                  <ErrorNote message={error()} />
                </If>
                <If when={active(data()).length > 0}>
                  <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600" }}>{m().pickUp}</Text>
                  <Each of={active(data())} key={(course) => course.courseId}>
                    {(course) => (
                      <If when={course().dash.active?.task}>
                        {(task) => (
                          <View style={{ gap: 4 }}>
                            <Muted>{course().title}</Muted>
                            <TaskCard
                              task={task()}
                              action={m().resume}
                              onStart={() => nav.push({ name: "session", sessionId: course().dash.active?.id ?? "" })}
                            />
                          </View>
                        )}
                      </If>
                    )}
                  </Each>
                </If>
                <If when={!wide()}>
                  <WeeklyGoals xp={data().xp} paused={data().paused} />
                </If>
                <If
                  when={data().courses.length > 0}
                  else={
                    <Card>
                      <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{m().startLearning}</Text>
                      <Muted>{m().startLearningBody}</Muted>
                      <Action label={m().browseCourses} onPress={() => openTab("courses")} />
                    </Card>
                  }
                >
                  <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600", marginTop: 4 }}>{m().nextUp}</Text>
                  <Grid>
                    <Each of={data().courses.filter((course) => !course.dash.active)} key={(course) => course.courseId}>
                      {(course) => (
                        <Cell>
                          <CourseDay
                            courseId={course().courseId}
                            title={course().title}
                            dash={course().dash}
                            busy={busy()}
                            onStart={(task) => void start(course().courseId, task)}
                          />
                        </Cell>
                      )}
                    </Each>
                  </Grid>
                  <If when={data().courses.length > 0}>
                    <Quiet label={m().browseCourses} onPress={() => openTab("courses")} />
                  </If>
                </If>
              </View>
              <If when={wide()}>
                <View style={{ gap: 12, width: ASIDE_WIDTH }}>
                  <WeeklyGoals xp={data().xp} paused={data().paused} />
                </View>
              </If>
            </View>
          </PullScroll>
        )}
      </Loaded>
    </View>
  );
}
