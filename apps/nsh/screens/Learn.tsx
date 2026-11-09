import type { Task } from "@ga/proto/learning/v1/learning_pb";
import { computed, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";
import { errorText, m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { colors, ErrorNote, headerStyle, Loaded, Muted, PullScroll, Row, Section } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";
import { CourseDone, PlacementReport } from "./PlacementReport.tsx";
import { TaskCard } from "./TaskCard.tsx";

/** Learn is the learner's home in a course: the next task comes first, since it is what the learner came for. */
export function Learn(props: { courseId: string }) {
  const course = query(["course", props.courseId], ({ signal: abort }) =>
    catalog.getCourse({ courseId: props.courseId }, { signal: abort }),
  );
  // Read again whenever the learner comes back to this page from a task.
  const visible = computed(() => nav.routes().at(-1)?.name === "learn" && props.courseId);
  const dash = query(
    visible,
    (courseId) => ["dashboard", courseId],
    (courseId, { signal: abort }) => learning.getDashboard({ courseId, timeZone: timeZone() }, { signal: abort }),
  );
  const busy = signal(false);
  const error = signal("");
  const title = computed(() => tx(course()?.course?.title));

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
  const start = (task: Task) =>
    act(async () => {
      const { session } = await learning.startTask({ courseId: props.courseId, task, timeZone: timeZone() });
      if (session) nav.push({ name: "session", sessionId: session.id });
    });
  // Keeping the course reads it again; taking another opens that one.
  const answered = () => {
    const current = nav.routes().at(-1);
    void learning.getProfile({ timeZone: timeZone() }).then((profile) => {
      const now = profile.enrollments.find((e) => e.subjectId === course()?.course?.subjectId)?.courseId;
      if (now && now !== props.courseId && nav.routes().at(-1) === current) nav.replace({ name: "learn", courseId: now });
      else dash.refetch();
    });
  };
  const skip = () =>
    act(async () => {
      await learning.skipDiagnostic({ courseId: props.courseId });
      dash.refetch();
    });

  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />}>
      <View style={{ flex: 1, backgroundColor: colors().page }}>
        <Loaded rpc={dash}>
          {(data) => (
            <PullScroll onRefresh={dash.refetch} refreshing={dash.state() === "refreshing"}>
              <View style={{ gap: 12 }}>
                <Muted>{m().topicsLearned(data().stats?.learned ?? 0, data().stats?.total ?? 0)}</Muted>
                <Muted>{m().xpToday(data().xp?.today ?? 0)}</Muted>
                <If when={(data().stats?.due ?? 0) > 0}>
                  <Text style={{ color: colors().warn, fontSize: 14 }}>
                    {m().due}: {data().stats?.due}
                  </Text>
                </If>
                <If when={data().diagnosed && data().xpToQuiz > 0}>
                  <Muted>{m().xpToQuiz(data().xpToQuiz)}</Muted>
                </If>
                <PlacementReport dash={data()} onAnswered={answered} />
                <CourseDone dash={data()} onChosen={answered} />
                <Text style={{ color: colors().ink, fontSize: 18, fontWeight: "600", marginTop: 8 }}>{m().nextUp}</Text>
                <If when={error()}>
                  <ErrorNote message={error()} />
                </If>
                <If
                  when={data().active}
                  else={
                    <View style={{ gap: 12 }}>
                      <Each of={data().tasks}>
                        {(task) => (
                          <TaskCard
                            task={task()}
                            action={m().start}
                            busy={busy()}
                            onStart={() => void start(task())}
                            extra={task().kind.case === "diagnostic" ? () => void skip() : undefined}
                          />
                        )}
                      </Each>
                      <If when={data().tasks.length > 1}>
                        <Muted>{m().tasksHint}</Muted>
                      </If>
                      <If when={data().tasks.length === 0}>
                        <Muted>{m().nothingToDo}</Muted>
                      </If>
                    </View>
                  }
                >
                  {(active) => (
                    <If when={active().task}>
                      {(task) => (
                        <TaskCard task={task()} action={m().resume} onStart={() => nav.push({ name: "session", sessionId: active().id })} />
                      )}
                    </If>
                  )}
                </If>
                <Section title={m().tabProgress}>
                  <Row
                    title={m().progressMap}
                    detail={m().progressMapDetail}
                    onPress={() => nav.push({ name: "map", courseId: props.courseId })}
                  />
                  <Row
                    title={m().history}
                    detail={m().historyDetail}
                    onPress={() => nav.push({ name: "history", courseId: props.courseId })}
                  />
                </Section>
              </View>
            </PullScroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
