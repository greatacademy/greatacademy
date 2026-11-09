import type { GetCourseResponse } from "@ga/proto/catalog/v1/catalog_pb";
import { type GetCourseProgressResponse, type TopicProgress, TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { computed, List, Text, View, windowSize } from "nsh";
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
    assumed: c.muted,
  };
  return by[key];
}

/** chipColors are the background and text of a status's chip, as on the web. */
function chipColors(key: StatusKey): { bg: string; fg: string } {
  const c = colors();
  const by: Record<StatusKey, { bg: string; fg: string }> = {
    locked: { bg: c.page, fg: c.muted },
    available: { bg: c["accent-soft"], fg: c.accent },
    failed: { bg: c["bad-soft"], fg: c.bad },
    learned: { bg: c["good-soft"], fg: c.good },
    due: { bg: c["warn-soft"], fg: c.warn },
    assumed: { bg: c.page, fg: c.muted },
  };
  return by[key];
}

/** TopicBox is one topic of the map, as on the web: its status dot, its title, the memory of a learned topic and a chip. */
function TopicBox(props: { title: string; progress: TopicProgress | undefined; width: "49%" | "100%" }) {
  const key = (): StatusKey => statusKeys[props.progress?.status ?? TopicStatus.LOCKED] ?? "locked";
  const learned = () => key() === "learned" || key() === "due";
  const memory = () => Math.round((props.progress?.memory ?? 0) * 100);
  return (
    <View
      accessibilityLabel={`${props.title}, ${m().statuses[key()]}`}
      style={{
        alignItems: "center",
        borderColor: colors().line,
        borderRadius: 12,
        borderWidth: 1,
        flexDirection: "row",
        gap: 12,
        paddingHorizontal: 12,
        paddingVertical: 10,
        width: props.width,
      }}
    >
      <Dot status={key()} />
      <View style={{ flex: 1, gap: 4, minWidth: 0 }}>
        <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500", numberOfLines: 1 }}>{props.title}</Text>
        <If when={learned()}>
          <View accessibilityLabel={m().memoryOf(memory())} style={{ alignItems: "center", flexDirection: "row", gap: 8 }}>
            <View style={{ backgroundColor: colors().line, borderRadius: 2, flex: 1, height: 4, overflow: "hidden" }}>
              <View
                style={{
                  backgroundColor: key() === "due" ? colors().warn : colors().good,
                  borderRadius: 2,
                  height: 4,
                  width: `${memory()}%`,
                }}
              />
            </View>
            <Text style={{ color: colors().muted, fontSize: 10, textAlign: "right", width: 32 }}>{`${memory()}%`}</Text>
          </View>
        </If>
      </View>
      <View style={{ backgroundColor: chipColors(key()).bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
        <Text style={{ color: chipColors(key()).fg, fontSize: 11, fontWeight: "500" }}>{m().statuses[key()]}</Text>
      </View>
    </View>
  );
}

function Dot(props: { status: StatusKey }) {
  return (
    <View
      style={{
        backgroundColor: statusColor(props.status),
        borderRadius: 5,
        flexShrink: 0,
        height: 10,
        width: 10,
      }}
    />
  );
}

/** MapData is what the progress map reads: the course's outline and the learner's progress in it. */
export interface MapData {
  readonly course: GetCourseResponse;
  readonly progress: GetCourseProgressResponse;
}

/** loadMap reads a course's outline and the learner's progress in it together. */
export async function loadMap(courseId: string, signal: AbortSignal): Promise<MapData> {
  const [course, progress] = await Promise.all([
    catalog.getCourse({ courseId }, { signal }),
    learning.getCourseProgress({ courseId }, { signal }),
  ]);
  return { course, progress };
}

/**
 * MapBody is the progress map itself: how many topics have each status, then every unit's topics with the learner's
 * status and the memory the engine estimates. The Progress tab shows it as the web's Progress page does.
 */
export function MapBody(props: { map: MapData }) {
  const byTopic = computed(() => new Map(props.map.progress.topics.map((topic) => [topic.topicId, topic])));
  const counts = computed(() => {
    const found: Partial<Record<StatusKey, number>> = {};
    for (const topic of props.map.progress.topics) {
      if (topic.foundation) continue;
      const key = statusKeys[topic.status];
      if (key) found[key] = (found[key] ?? 0) + 1;
    }
    return found;
  });
  const legend: StatusKey[] = ["learned", "due", "available", "failed", "assumed", "locked"];
  // Topics sit two to a row where the map is wide enough, as on the web: a tablet's window, or a desktop's once the
  // cards beside the map leave it room.
  const columns = () => {
    const width = windowSize().width;
    return width >= 1200 || (width >= 700 && width < 1024) ? 2 : 1;
  };
  return (
    <View style={{ gap: 12 }}>
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
      <List viewport="parent" each={props.map.course.course?.units ?? []} estimatedItemSize={600} contentStyle={{ gap: 12 }}>
        {(unit) => (
          <Card>
            <Text style={{ color: colors().ink, fontSize: 17, fontWeight: "600" }}>{tx(unit().title)}</Text>
            <Each of={unit().modules}>
              {(module) => (
                <View style={{ gap: 8, marginTop: 8 }}>
                  <Muted>{tx(module().title)}</Muted>
                  <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
                    <Each of={module().topics} key={(topic) => topic.id}>
                      {(topic) => (
                        <TopicBox title={tx(topic().title)} progress={byTopic().get(topic().id)} width={columns() === 2 ? "49%" : "100%"} />
                      )}
                    </Each>
                  </View>
                </View>
              )}
            </Each>
          </Card>
        )}
      </List>
    </View>
  );
}

/** CourseMap shows every topic of a course with the learner's status on it and the memory the engine estimates. */
export function CourseMap(props: { courseId: string }) {
  const data = query(["map", props.courseId], ({ signal }) => loadMap(props.courseId, signal));
  const title = computed(() => m().progressMap);
  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <Loaded rpc={data} skeleton={<Skeleton rows={4} />}>
          {(loaded) => (
            <PullScroll onRefresh={data.refetch} refreshing={data.state() === "refreshing"}>
              <View style={{ gap: 12 }}>
                <Text style={{ color: colors().ink, fontSize: 20, fontWeight: "600" }}>{tx(loaded().course.course?.title)}</Text>
                <MapBody map={loaded()} />
              </View>
            </PullScroll>
          )}
        </Loaded>
      </View>
    </NavPage>
  );
}
