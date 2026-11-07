import type { Task } from "@ga/proto/learning/v1/learning_pb";
import { computed, resource, Scroll, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import { errorText, m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { catalog, learning, timeZone } from "../lib/rpc.ts";
import { Action, Card, colors, ErrorNote, Loaded, Muted, Quiet } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";
import { Rich } from "./Rich.tsx";

function describe(task: Task): { label: string; title: string; detail: string; xp: number } | undefined {
  const k = task.kind;
  switch (k.case) {
    case "diagnostic":
      return { label: m().diagnostic, title: m().diagnostic, detail: m().diagnosticBody(k.value.maxQuestions), xp: 0 };
    case "lesson":
      return { label: m().lesson, title: tx(k.value.title), detail: m().kps(k.value.knowledgePoints), xp: k.value.xp };
    case "review": {
      const others = k.value.covers.filter((c) => c !== k.value.topicId).length;
      return { label: m().review, title: tx(k.value.title), detail: others > 0 ? m().reviewCovers(others) : "", xp: k.value.xp };
    }
    case "reading":
      return { label: m().reading, title: tx(k.value.title), detail: m().readingBody(k.value.words, k.value.questions), xp: k.value.xp };
    case "quiz":
      return { label: m().quiz, title: m().quiz, detail: m().quizBody(k.value.questions), xp: k.value.xp };
    default:
      return undefined;
  }
}

function TaskCard(props: { task: Task; action: string; busy?: boolean; onStart: () => void; extra?: () => void }) {
  const about = describe(props.task);
  if (!about) return null;
  return (
    <Card>
      <Muted>{about.xp > 0 ? `${about.label} · ${about.xp} XP` : about.label}</Muted>
      <Rich source={about.title} inline bold fontSize={17} />
      <If when={about.detail}>
        <Muted>{about.detail}</Muted>
      </If>
      <Action label={props.action} disabled={props.busy} onPress={props.onStart} />
      <If when={props.extra}>
        <Quiet label={m().skipDiagnostic} disabled={props.busy} onPress={() => props.extra?.()} />
      </If>
    </Card>
  );
}

/** Learn is the learner's home in a course: the next task comes first, since it is what the learner came for. */
export function Learn(props: { courseId: string }) {
  const course = resource(({ signal: abort }) => catalog.getCourse({ courseId: props.courseId }, { signal: abort }));
  // Read again whenever the learner comes back to this page from a task.
  const visible = computed(() => nav.routes().at(-1)?.name === "learn" && props.courseId);
  const dash = resource(visible, (courseId, { signal: abort }) =>
    learning.getDashboard({ courseId, timeZone: timeZone() }, { signal: abort }),
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
  const skip = () =>
    act(async () => {
      await learning.skipDiagnostic({ courseId: props.courseId });
      dash.refetch();
    });

  return (
    <NavPage title={title()} header={<Header title={title()} />}>
      <View style={{ flex: 1, backgroundColor: colors().page }}>
        <Loaded rpc={dash}>
          {(data) => (
            <Scroll style={{ flex: 1 }}>
              <View style={{ gap: 12, padding: 16 }}>
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
              </View>
            </Scroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
