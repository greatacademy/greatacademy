import type { GetDashboardResponse, Task } from "@ga/proto/learning/v1/learning_pb";
import { computed, effect, type Resource, signal, Text, View, windowSize } from "nsh";
import { errorText, m } from "../lib/i18n.ts";
import { nav, openTab } from "../lib/nav.ts";
import { markChanged, query } from "../lib/query.ts";
import { learning, timeZone } from "../lib/rpc.ts";
import { courseTitle, type Place, tint, usePlace } from "../lib/subject.tsx";
import { Card, colors, ErrorNote, Loaded, Muted, PullScroll, Skeleton } from "../lib/ui.tsx";
import { SubjectStart } from "./CourseTab.tsx";
import { HistoryLine } from "./History.tsx";
import { firstPageReady } from "./Launch.tsx";
import { CourseDone, PlacementReport } from "./PlacementReport.tsx";
import { Bar, EarnedCard, ForecastCard, useDashboard, WeeklyGoals } from "./SubjectCards.tsx";
import { TaskCard } from "./TaskCard.tsx";

/** ASIDE_FROM is the window width, in points, from which the cards sit in a column of ASIDE_WIDTH beside the tasks. */
const ASIDE_FROM = 1024;
const ASIDE_WIDTH = 320;

/** CourseHead heads the Learn tab, as on the web: the course, which opens the Course tab, how far it is and what is due. */
function CourseHead(props: { place: Place; dash: GetDashboardResponse }) {
  const stats = () => props.dash.stats;
  return (
    <View style={{ gap: 8, maxWidth: 560 }}>
      <Text role="button" onPress={() => openTab("course")} style={{ color: colors().ink, fontSize: 24, fontWeight: "700" }}>
        {courseTitle(props.place.data.list, props.dash.courseId)}
      </Text>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
        <View style={{ flex: 1 }}>
          <Bar share={(stats()?.learned ?? 0) / Math.max(1, stats()?.total ?? 0)} color={tint(props.place.subject).strong} />
        </View>
        <Muted>{m().topicsLearned(stats()?.learned ?? 0, stats()?.total ?? 0)}</Muted>
      </View>
      <If when={(stats()?.due ?? 0) > 0}>
        <Text style={{ color: colors().warn, fontSize: 14 }}>{m().dueReviews(stats()?.due ?? 0)}</Text>
      </If>
    </View>
  );
}

/** RecentWork lists the learner's last three tasks in the course and opens the whole history, as on the web. */
function RecentWork(props: { courseId: string; visible: () => boolean }) {
  const shown = computed(() => (props.visible() && props.courseId) || undefined);
  const rpc = query(
    shown,
    (courseId) => ["sessions", courseId],
    (courseId, { signal: abort }) => learning.listSessions({ courseId }, { signal: abort }),
  );
  const recent = () => rpc()?.sessions.slice(0, 3) ?? [];
  return (
    <If when={recent().length > 0}>
      <View style={{ gap: 8 }}>
        <View style={{ alignItems: "baseline", flexDirection: "row", gap: 8 }}>
          <Text style={{ color: colors().muted, flex: 1, fontSize: 14, fontWeight: "500" }}>{m().recentTasks}</Text>
          <Text
            role="button"
            onPress={() => nav.push({ name: "history", courseId: props.courseId })}
            style={{ color: colors().accent, fontSize: 14 }}
          >
            {m().seeAll}
          </Text>
        </View>
        <Card>
          <Each of={recent()} key={(session) => session.id}>
            {(session) => <HistoryLine session={session()} />}
          </Each>
        </Card>
      </View>
    </If>
  );
}

/** Aside is the column of cards beside the tasks, as on the web: the subject's XP, its goals and the forecast. */
function Aside(props: { place: Place; dash: GetDashboardResponse; onChanged: () => void }) {
  return (
    <>
      <EarnedCard xp={props.dash.xp} />
      <WeeklyGoals dash={props.dash} place={props.place} />
      <ForecastCard place={props.place} dash={props.dash} onChanged={props.onChanged} />
    </>
  );
}

/**
 * Today is the Learn tab of a subject with a course, laid out as the web's: the course, the diagnostic's report, the
 * task in progress or what is next, the recent tasks, and beside them the XP, goals and forecast.
 */
function Today(props: {
  place: Place;
  dash: Resource<GetDashboardResponse>;
  visible: () => boolean;
  onAnswered: () => void;
  onChanged: () => void;
}) {
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
              <CourseHead place={props.place} dash={d()} />
              <PlacementReport dash={d()} onAnswered={props.onAnswered} />
              <CourseDone dash={d()} onChosen={props.onAnswered} />
              <View style={{ alignItems: "baseline", flexDirection: "row", flexWrap: "wrap", gap: 8, marginTop: 4 }}>
                <Text style={{ color: colors().ink, flex: 1, fontSize: 18, fontWeight: "600" }}>{m().nextUp}</Text>
                <If when={(d().xp?.goalToday ?? 0) > 0}>
                  <Muted>
                    {(d().xp?.today ?? 0) >= (d().xp?.goalToday ?? 0)
                      ? m().goalMetToday
                      : m().goalLeftToday((d().xp?.goalToday ?? 0) - (d().xp?.today ?? 0))}
                  </Muted>
                </If>
              </View>
              <If when={error()}>
                <ErrorNote message={error()} />
              </If>
              <If when={d().active?.task}>
                {(task) => (
                  <TaskCard
                    task={task()}
                    action={m().resume}
                    onStart={() => nav.push({ name: "session", sessionId: d().active?.id ?? "" })}
                  />
                )}
              </If>
              <If when={!d().active}>
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
              <RecentWork courseId={d().courseId} visible={props.visible} />
              <If when={!wide()}>
                <Aside place={props.place} dash={d()} onChanged={props.onChanged} />
              </If>
            </View>
            <If when={wide()}>
              <View style={{ gap: 12, width: ASIDE_WIDTH }}>
                <Aside place={props.place} dash={d()} onChanged={props.onChanged} />
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
  const changed = () => {
    markChanged();
    dash.refetch();
  };
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
                <Today place={here()} dash={dash} visible={props.visible} onAnswered={answered} onChanged={changed} />
              </If>
            )}
          </If>
        )}
      </Loaded>
    </View>
  );
}
