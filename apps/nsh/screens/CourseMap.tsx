import { TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { computed, Text, View } from "nsh";
import { NavPage } from "nsh/base";
import { m, tx } from "../lib/i18n.ts";
import { query } from "../lib/query.ts";
import { catalog, learning } from "../lib/rpc.ts";
import { Card, colors, headerStyle, Loaded, Muted, PullScroll, Skeleton } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

type StatusKey = "locked" | "available" | "failed" | "learned" | "due" | "assumed";

const statusKeys: Partial<Record<TopicStatus, StatusKey>> = {
  [TopicStatus.LOCKED]: "locked",
  [TopicStatus.AVAILABLE]: "available",
  [TopicStatus.FAILED]: "failed",
  [TopicStatus.LEARNED]: "learned",
  [TopicStatus.DUE]: "due",
  [TopicStatus.ASSUMED]: "assumed",
};

/** statusColor is the color a status shows in, so the map reads at a glance. */
function statusColor(key: StatusKey): string {
  const c = colors();
  const by: Record<StatusKey, string> = {
    locked: c.line,
    available: c.accent,
    failed: c.bad,
    learned: c.good,
    due: c.warn,
    assumed: c["good-soft"],
  };
  return by[key];
}

function Dot(props: { status: StatusKey }) {
  return (
    <View
      style={{
        backgroundColor: statusColor(props.status),
        borderColor: colors().line,
        borderRadius: 6,
        borderWidth: props.status === "assumed" ? 1 : 0,
        height: 12,
        width: 12,
      }}
    />
  );
}

/** CourseMap shows every topic of a course with the learner's status on it and the memory the engine estimates. */
export function CourseMap(props: { courseId: string }) {
  const data = query(["map", props.courseId], async ({ signal }) => {
    const [course, progress] = await Promise.all([
      catalog.getCourse({ courseId: props.courseId }, { signal }),
      learning.getCourseProgress({ courseId: props.courseId }, { signal }),
    ]);
    return { course, progress };
  });
  const title = computed(() => m().progressMap);
  const byTopic = computed(() => new Map((data()?.progress.topics ?? []).map((topic) => [topic.topicId, topic])));
  const counts = computed(() => {
    const found: Partial<Record<StatusKey, number>> = {};
    for (const topic of data()?.progress.topics ?? []) {
      if (topic.foundation) continue;
      const key = statusKeys[topic.status];
      if (key) found[key] = (found[key] ?? 0) + 1;
    }
    return found;
  });
  const legend: StatusKey[] = ["learned", "due", "available", "failed", "assumed", "locked"];

  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={data} skeleton={<Skeleton rows={4} />}>
          {(loaded) => (
            <PullScroll onRefresh={data.refetch} refreshing={data.state() === "refreshing"}>
              <View style={{ gap: 12 }}>
                <Text style={{ color: colors().ink, fontSize: 20, fontWeight: "600" }}>{tx(loaded().course.course?.title)}</Text>
                <Card>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
                    <Each of={legend.filter((key) => (counts()[key] ?? 0) > 0)}>
                      {(key) => (
                        <View style={{ alignItems: "center", flexDirection: "row", gap: 6 }}>
                          <Dot status={key()} />
                          <Text style={{ color: colors().ink, fontSize: 14 }}>{`${m().statuses[key()]} ${counts()[key()] ?? 0}`}</Text>
                        </View>
                      )}
                    </Each>
                  </View>
                </Card>
                <Each of={loaded().course.course?.units ?? []}>
                  {(unit) => (
                    <Card>
                      <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{tx(unit().title)}</Text>
                      <Each of={unit().modules}>
                        {(module) => (
                          <View style={{ gap: 8, marginTop: 8 }}>
                            <Muted>{tx(module().title)}</Muted>
                            <Each of={module().topics} key={(topic) => topic.id}>
                              {(topic) => {
                                const progress = () => byTopic().get(topic().id);
                                const key = (): StatusKey => statusKeys[progress()?.status ?? TopicStatus.LOCKED] ?? "locked";
                                const memory = () => Math.round((progress()?.memory ?? 0) * 100);
                                return (
                                  <View
                                    accessibilityLabel={`${tx(topic().title)}, ${m().statuses[key()]}`}
                                    style={{ alignItems: "center", flexDirection: "row", gap: 10 }}
                                  >
                                    <Dot status={key()} />
                                    <View style={{ flex: 1, gap: 2 }}>
                                      <Text style={{ color: key() === "locked" ? colors().muted : colors().ink, fontSize: 15 }}>
                                        {tx(topic().title)}
                                      </Text>
                                      <Muted>
                                        {[m().statuses[key()], progress()?.placed ? m().placed : ""].filter(Boolean).join(" · ")}
                                      </Muted>
                                    </View>
                                    <If when={memory() > 0}>
                                      <View style={{ alignItems: "flex-end", gap: 2, width: 72 }}>
                                        <View
                                          style={{
                                            backgroundColor: colors().line,
                                            borderRadius: 3,
                                            height: 6,
                                            overflow: "hidden",
                                            width: 72,
                                          }}
                                        >
                                          <View style={{ backgroundColor: statusColor(key()), height: 6, width: `${memory()}%` }} />
                                        </View>
                                        <Text style={{ color: colors().muted, fontSize: 12 }}>{m().memoryOf(memory())}</Text>
                                      </View>
                                    </If>
                                  </View>
                                );
                              }}
                            </Each>
                          </View>
                        )}
                      </Each>
                    </Card>
                  )}
                </Each>
              </View>
            </PullScroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
