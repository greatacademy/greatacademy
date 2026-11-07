import type { GetDashboardResponse, Task, XpSummary } from "@ga/proto/learning/v1/learning_pb";
import { computed, signal, Text, View } from "nsh";
import { errorText, m, tx } from "../lib/i18n.ts";
import { nav, openTab } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { Action, Card, Cell, colors, ErrorNote, Grid, Loaded, Muted, PullScroll, Quiet, Ring, Skeleton } from "../lib/ui.tsx";
import { describeTask, TaskCard } from "./TaskCard.tsx";

/** TodayData is what the Today tab shows: the learner's XP and each enrolled course's dashboard, with its title. */
interface TodayData {
  xp: XpSummary | undefined;
  courses: { courseId: string; title: string; dash: GetDashboardResponse }[];
}

async function loadToday(abort: AbortSignal): Promise<TodayData> {
  const [profile, list] = await Promise.all([
    learning.getProfile({ timeZone: timeZone() }, { signal: abort }),
    catalog.listCourses({}, { signal: abort }),
  ]);
  const courses = await Promise.all(
    profile.enrollments.map(async (enrollment) => ({
      courseId: enrollment.courseId,
      title: tx(list.courses.find((course) => course.id === enrollment.courseId)?.title) || enrollment.courseId,
      dash: await learning.getDashboard({ courseId: enrollment.courseId, timeZone: timeZone() }, { signal: abort }),
    })),
  );
  return { xp: profile.xp, courses };
}

/** Goal shows today's XP against the daily goal as a ring, with the week beside it. */
function Goal(props: { xp: XpSummary | undefined }) {
  const today = () => props.xp?.today ?? 0;
  const goal = () => props.xp?.goalToday ?? 0;
  return (
    <Card>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 16 }}>
        <Ring share={goal() > 0 ? today() / goal() : 0} size={72} color={today() >= goal() && goal() > 0 ? colors().good : colors().accent}>
          <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "700" }}>{today()}</Text>
        </Ring>
        <View style={{ flex: 1, gap: 4 }}>
          <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{m().goalToday}</Text>
          <If when={goal() > 0} else={<Muted>{m().noGoal}</Muted>}>
            <Text style={{ color: colors().ink, fontSize: 15 }}>{m().goalOf(today(), goal())}</Text>
            <Muted>{today() >= goal() ? m().goalMet : m().goalLeft(goal() - today())}</Muted>
          </If>
          <Muted>{m().xpWeek(props.xp?.week ?? 0)}</Muted>
        </View>
      </View>
    </Card>
  );
}

/** CourseDay is one course on the Today tab: how far the learner is, what is due, and the next task. */
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

/** Today is the first tab: what is in progress, today's goal, and the next task of each enrolled course. */
export function Today(props: { visible: () => boolean }) {
  // Read again whenever the learner comes back to the tab, as from a task.
  const shown = computed(() => props.visible() || undefined);
  const today = query(
    shown,
    () => ["today"],
    (_, { signal: abort }) => loadToday(abort),
  );
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
  const active = (data: TodayData) => data.courses.filter((course) => course.dash.active);

  return (
    <View style={{ backgroundColor: colors().page, flex: 1 }}>
      <Loaded rpc={today} skeleton={<Skeleton rows={3} />}>
        {(data) => (
          <PullScroll onRefresh={today.refetch} refreshing={today.state() === "refreshing"}>
            <View style={{ gap: 12 }}>
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
              <Goal xp={data().xp} />
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
          </PullScroll>
        )}
      </Loaded>
    </View>
  );
}
