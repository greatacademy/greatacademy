import { strengthShades } from "@ga/design";
import type { GetCourseResponse } from "@ga/proto/catalog/v1/catalog_pb";
import {
  type CourseStats,
  type CourseUnits,
  type GetCourseProgressResponse,
  type TopicProgress,
  TopicStatus,
} from "@ga/proto/learning/v1/learning_pb";
import { computed, List, platform, Scroll, safeAreaInsets, signal, Text, View, windowSize } from "nsh";
import { NavPage, Popover, Sheet } from "nsh/base";
import { m, tx } from "../lib/i18n.ts";
import { nav } from "../lib/nav.ts";
import { query } from "../lib/query.ts";
import { catalog, learning } from "../lib/rpc.ts";
import { Card, colors, headerStyle, Loaded, Muted, PullScroll, Quiet, Skeleton } from "../lib/ui.tsx";
import { Header } from "./Header.tsx";

/** StatusKey names a topic's status in the messages and the map's colors. */
export type StatusKey = "locked" | "available" | "failed" | "learned" | "due" | "assumed";

/** statusKeys names each status a topic can have. */
export const statusKeys: Partial<Record<TopicStatus, StatusKey>> = {
  [TopicStatus.LOCKED]: "locked",
  [TopicStatus.AVAILABLE]: "available",
  [TopicStatus.FAILED]: "failed",
  [TopicStatus.LEARNED]: "learned",
  [TopicStatus.DUE]: "due",
  [TopicStatus.ASSUMED]: "assumed",
};

/** shades are the map's colors for learned topics, by strength: the accent mixed over the surface, as on the web. */
const shades = computed(() => strengthShades(colors().accent, colors().surface));

/** shadeOf is the color of a learned topic of the given strength. */
export const shadeOf = (strength: number) => shades()[Math.min(shades().length - 1, Math.max(0, strength))] ?? colors().accent;

const isLearned = (key: StatusKey) => key === "learned" || key === "due";

/** edgeColor is the edge of a hollow dot, for a topic not learned, so the map reads at a glance. */
export function edgeColor(key: StatusKey): string {
  const c = colors();
  return key === "available" ? c.accent : key === "failed" ? c.bad : c.muted;
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

type LegendKey = "shades" | StatusKey;

const learnedStatus = (s: TopicStatus | undefined) => s === TopicStatus.LEARNED || s === TopicStatus.DUE;

/** rank orders a unit's bar: the firmest learned topics first, then those assumed, then the rest. */
const rank = (p: TopicProgress | undefined) =>
  learnedStatus(p?.status) ? 10 + (p?.strength ?? 0) : p?.status === TopicStatus.ASSUMED ? 1 : 0;

/** unitIds are a unit's topics in the course's order. */
const unitIds = (unit: { modules: readonly { topics: readonly { id: string }[] }[] }) =>
  unit.modules.flatMap((mod) => mod.topics.map((t) => t.id));

/**
 * TopicBox is one topic of the map, as on the web: its dot, shaded by strength once learned, its title, and a chip for
 * what asks for action: a review due, a topic to learn next, one waiting on its prerequisites.
 */
function TopicBox(props: { title: string; progress: TopicProgress | undefined; width: "49%" | "100%" }) {
  const key = (): StatusKey => statusKeys[props.progress?.status ?? TopicStatus.LOCKED] ?? "locked";
  const chip = () => key() === "due" || key() === "available" || key() === "failed";
  const memory = () => Math.round((props.progress?.memory ?? 0) * 100);
  const hint = () => [m().statuses[key()], m().statusNotes[key()], ...(isLearned(key()) ? [m().memoryOf(memory())] : [])].join(" · ");
  return (
    <View
      accessibilityLabel={`${props.title}, ${m().statuses[key()]}`}
      accessibilityHint={hint()}
      tooltip={hint()}
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
      <Dot status={key()} strength={props.progress?.strength ?? 0} />
      <Text style={{ color: colors().ink, flex: 1, fontSize: 14, fontWeight: "500", minWidth: 0, numberOfLines: 1 }}>{props.title}</Text>
      <If when={chip()}>
        <View style={{ backgroundColor: chipColors(key()).bg, borderRadius: 999, paddingHorizontal: 8, paddingVertical: 2 }}>
          <Text style={{ color: chipColors(key()).fg, fontSize: 11, fontWeight: "500" }}>{m().statuses[key()]}</Text>
        </View>
      </If>
    </View>
  );
}

/** Dot marks a topic: filled in its shade once learned, ringed when its review is due; hollow and edged otherwise. */
function Dot(props: { status: StatusKey; strength: number }) {
  const inner = () =>
    isLearned(props.status)
      ? { backgroundColor: shadeOf(props.strength) }
      : props.status === "assumed"
        ? { backgroundColor: colors().line }
        : { borderColor: edgeColor(props.status), borderWidth: 1.5 };
  return (
    <View
      style={{
        alignItems: "center",
        borderColor: props.status === "due" ? colors().warn : "transparent",
        borderRadius: 8,
        borderWidth: 1.5,
        flexShrink: 0,
        height: 16,
        justifyContent: "center",
        width: 16,
      }}
    >
      <View style={{ ...inner(), borderRadius: 5, height: 10, width: 10 }} />
    </View>
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
  // Units are numbered 1, 2, 3 and their modules 1.1, 1.2, as on the web.
  const unitNumber = (unit: object) => (props.map.course.course?.units ?? []).indexOf(unit as never) + 1;
  const counts = computed(() => {
    const found: Partial<Record<StatusKey, number>> = {};
    for (const topic of props.map.progress.topics) {
      if (topic.foundation) continue;
      const key = statusKeys[topic.status];
      if (key) found[key] = (found[key] ?? 0) + 1;
    }
    return found;
  });
  const widest = computed(() => Math.max(1, ...(props.map.course.course?.units ?? []).map((u) => unitIds(u).length)));
  // Topics sit two to a row where the map is wide enough, as on the web: a tablet's window, or a desktop's once the
  // cards beside the map leave it room.
  const columns = () => {
    const width = windowSize().width;
    return width >= 1200 || (width >= 700 && width < 1024) ? 2 : 1;
  };
  return (
    <View style={{ gap: 12 }}>
      <Card>
        <TopicLegend counts={{ ...counts(), shades: (counts().learned ?? 0) + (counts().due ?? 0) }} />
      </Card>
      <List viewport="parent" each={props.map.course.course?.units ?? []} estimatedItemSize={600} contentStyle={{ gap: 12 }}>
        {(unit) => (
          <Card>
            <View style={{ alignItems: "baseline", flexDirection: "row", gap: 12, justifyContent: "space-between" }}>
              <Text style={{ color: colors().ink, flex: 1, fontSize: 17, fontWeight: "600" }}>
                {`${unitNumber(unit())}  ${tx(unit().title)}`}
              </Text>
              <Muted>
                {m().unitLearned(
                  unitIds(unit()).filter((id) => {
                    const s = byTopic().get(id)?.status;
                    return s === TopicStatus.LEARNED || s === TopicStatus.DUE || s === TopicStatus.ASSUMED;
                  }).length,
                  unitIds(unit()).length,
                )}
              </Muted>
            </View>
            {/* The firmest topics first, then those assumed, the rest left empty; as long as the unit is next to the
                course's largest, as on the web. */}
            <View
              style={{
                borderColor: colors().line,
                borderRadius: 4,
                borderWidth: 1,
                flexDirection: "row",
                height: 8,
                marginTop: 6,
                overflow: "hidden",
                width: `${Math.max(8, (unitIds(unit()).length / widest()) * 100)}%`,
              }}
            >
              <Each
                of={unitIds(unit())
                  .map((id) => byTopic().get(id))
                  .sort((a, b) => rank(b) - rank(a))}
              >
                {(p) => (
                  <View
                    style={{
                      backgroundColor: learnedStatus(p()?.status)
                        ? shadeOf(p()?.strength ?? 0)
                        : p()?.status === TopicStatus.ASSUMED
                          ? colors().line
                          : "transparent",
                      flex: 1,
                    }}
                  />
                )}
              </Each>
            </View>
            <Each of={unit().modules}>
              {(module) => (
                <View style={{ gap: 8, marginTop: 8 }}>
                  <Muted>{`${unitNumber(unit())}.${unit().modules.indexOf(module()) + 1}  ${tx(module().title)}`}</Muted>
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

/** LegendCounts is how many of a course's own topics each entry of TopicLegend has. */
export type LegendCounts = Partial<Record<LegendKey, number>>;

/**
 * TopicLegend explains the marks of the progress map with how many of the course's own topics have each: every learned
 * topic with the scale of shades, then the other statuses. A status's name explains itself: on hover on a desktop, and
 * when pressed, which works on a phone too.
 */
export function TopicLegend(props: { counts: LegendCounts }) {
  const legend: LegendKey[] = ["shades", "due", "available", "failed", "assumed", "locked"];
  const countOf = (key: LegendKey) => props.counts[key] ?? 0;
  const labelOf = (key: LegendKey) => (key === "shades" ? m().shades.label : m().statuses[key]);
  const noteOf = (key: LegendKey) => (key === "shades" ? m().shades.note : m().statusNotes[key]);
  const explained = signal<LegendKey | undefined>(undefined);
  const note = () => {
    const key = explained();
    return key && countOf(key) > 0 ? key : undefined;
  };
  return (
    <View style={{ gap: 8 }}>
      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
        <Each of={legend.filter((key) => countOf(key) > 0)}>
          {(key) => (
            <View
              role="button"
              accessibilityLabel={`${labelOf(key())} ${countOf(key())}`}
              accessibilityHint={noteOf(key())}
              tooltip={noteOf(key())}
              onPress={() => explained.set(note() === key() ? undefined : key())}
              hoverStyle={{ backgroundColor: colors().page }}
              style={{
                alignItems: "center",
                backgroundColor: note() === key() ? colors().page : undefined,
                borderRadius: 8,
                flexDirection: "row",
                gap: 6,
                marginHorizontal: -6,
                paddingHorizontal: 6,
                paddingVertical: 2,
              }}
            >
              <If when={key() !== "shades"}>
                <Dot status={key() as StatusKey} strength={2} />
              </If>
              <Text style={{ color: colors().ink, fontSize: 14 }}>{`${labelOf(key())} ${countOf(key())}`}</Text>
              <If when={key() === "shades"}>
                <View style={{ alignItems: "center", flexDirection: "row", gap: 6, marginLeft: 4 }}>
                  <Text style={{ color: colors().muted, fontSize: 12 }}>{m().shades.weak}</Text>
                  <View style={{ borderRadius: 2, flexDirection: "row", overflow: "hidden" }}>
                    <Each of={shades()}>{(color) => <View style={{ backgroundColor: color(), height: 10, width: 12 }} />}</Each>
                  </View>
                  <Text style={{ color: colors().muted, fontSize: 12 }}>{m().shades.strong}</Text>
                </View>
              </If>
            </View>
          )}
        </Each>
      </View>
      <If when={note()}>{(key) => <Muted>{noteOf(key())}</Muted>}</If>
    </View>
  );
}

/** Shaded is what a shaded bar shows: topics learned, in all, and the learned ones by strength, of a course or a unit. */
type Shaded = Pick<CourseStats, "learned" | "total" | "strengths">;

/** percentLearned is how much of a course or unit is learned, rounded down, so that 100% means every topic, as on the web. */
export const percentLearned = (s: Shaded | undefined) => (s && s.total > 0 ? Math.floor((s.learned / s.total) * 100) : 0);

/** ShadedBar is a course's or a unit's learned topics in one bar, the firmest first, in the map's shades. */
function ShadedBar(props: { stats: Shaded | undefined }) {
  const total = () => Math.max(1, props.stats?.total ?? 0);
  const strengths = () => props.stats?.strengths ?? [];
  return (
    <View style={{ backgroundColor: colors().line, borderRadius: 4, flex: 1, flexDirection: "row", height: 8, overflow: "hidden" }}>
      <Each of={[...strengths().keys()].reverse()}>
        {(level) => (
          <View style={{ backgroundColor: shadeOf(level()), height: 8, width: `${((strengths()[level()] ?? 0) / total()) * 100}%` }} />
        )}
      </Each>
    </View>
  );
}

/**
 * CourseSequence picks a course of the sequence as tabs, as on the web: the courses taken before, the current one, then
 * those that follow, each with its place in the sequence and how much of it is learned.
 */
export function CourseSequence(props: {
  courses: readonly CourseUnits[];
  currentId: string;
  selected: string;
  onSelect: (id: string) => void;
}) {
  const at = () => props.courses.findIndex((c) => c.courseId === props.currentId);
  const place = (i: number) => (i < at() ? m().sequence.before : i === at() ? m().sequence.current : m().sequence.after);
  return (
    <Scroll horizontal scrollbar={false}>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <Each of={props.courses} key={(c) => c.courseId}>
          {(c) => (
            <View
              role="tab"
              accessibilityLabel={`${place(props.courses.indexOf(c()))}: ${tx(c().title)} ${percentLearned(c().stats)}%`}
              accessibilityHint={m().sequence.note}
              tooltip={m().sequence.note}
              onPress={() => props.onSelect(c().courseId)}
              style={{
                backgroundColor: c().courseId === props.selected ? colors()["accent-soft"] : colors().surface,
                borderColor: c().courseId === props.selected ? colors().accent : colors().line,
                borderRadius: 12,
                borderWidth: 1,
                gap: 2,
                paddingHorizontal: 12,
                paddingVertical: 8,
                width: 140,
              }}
            >
              <Text
                style={{
                  color: props.courses.indexOf(c()) === at() ? colors().accent : colors().muted,
                  fontSize: 11,
                  fontWeight: props.courses.indexOf(c()) === at() ? "600" : "400",
                }}
              >
                {place(props.courses.indexOf(c()))}
              </Text>
              <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "500", numberOfLines: 1 }}>{tx(c().title)}</Text>
              <Text style={{ color: colors().muted, fontSize: 12 }}>{`${percentLearned(c().stats)}%`}</Text>
            </View>
          )}
        </Each>
      </View>
    </Scroll>
  );
}

/** UnitList is a course's units numbered in order, each with its shaded bar and how much of it is learned, as on the web. */
function UnitList(props: { course: CourseUnits }) {
  return (
    <View style={{ gap: 10 }}>
      <Each of={props.course.units}>
        {(u) => (
          <View style={{ gap: 4 }}>
            <View style={{ flexDirection: "row", gap: 8 }}>
              <Text style={{ color: colors().muted, fontSize: 13, width: 20 }}>{`${props.course.units.indexOf(u()) + 1}`}</Text>
              <Text style={{ color: colors().ink, flex: 1, fontSize: 13, numberOfLines: 1 }}>{tx(u().title)}</Text>
              <Text style={{ color: colors().muted, fontSize: 12 }}>{`${percentLearned(u())}%`}</Text>
            </View>
            <View style={{ flexDirection: "row", paddingLeft: 28 }}>
              <ShadedBar stats={u()} />
            </View>
          </View>
        )}
      </Each>
    </View>
  );
}

/** useCourseSequence reads the course sequence of the current course, unit by unit, while on() holds. */
export function useCourseSequence(courseId: () => string | undefined) {
  return query(
    courseId,
    (id) => ["sequence", id],
    (id, { signal }) => learning.listCourseProgress({ courseId: id }, { signal }),
  );
}

/**
 * CourseBar is a course's progress on the Learn and Course tabs, as on the web: its learned topics in one bar, the
 * firmest first, in the map's shades, with the share of the course learned. It explains itself on hover on a desktop
 * and opens when pressed, over the page so that the layout stays as it is, a popover on a desktop and a sheet on a phone:
 * the course sequence as tabs, and for the course picked, how many topics have each shade and its units numbered with
 * their own bars.
 */
export function CourseBar(props: { stats: CourseStats | undefined; courseId: string; maxWidth?: number }) {
  const open = signal(false);
  const picked = signal<string | undefined>(undefined);
  const insets = safeAreaInsets();
  const sequence = useCourseSequence(() => (open() ? props.courseId : undefined));
  const summary = () => m().shades.summary(props.stats?.learned ?? 0, props.stats?.total ?? 0);
  const shown = (courses: readonly CourseUnits[]) =>
    courses.find((c) => c.courseId === (picked() ?? props.courseId)) ?? courses.find((c) => c.courseId === props.courseId);
  const trigger = () => (
    <View
      role="button"
      accessibilityLabel={`${percentLearned(props.stats)}%`}
      accessibilityHint={summary()}
      tooltip={summary()}
      onPress={platform.desktop ? undefined : () => open.set(true)}
      hoverStyle={{ backgroundColor: colors().page }}
      style={{
        alignItems: "center",
        borderRadius: 8,
        flexDirection: "row",
        gap: 12,
        marginHorizontal: -6,
        paddingHorizontal: 6,
        paddingVertical: 4,
      }}
    >
      <ShadedBar stats={props.stats} />
      <Text style={{ color: colors().ink, fontSize: 14, fontWeight: "600" }}>{`${percentLearned(props.stats)}%`}</Text>
    </View>
  );
  const panel = () => (
    <Loaded rpc={sequence} skeleton={<Skeleton rows={2} />}>
      {(data) => (
        <View style={{ gap: 12 }}>
          <If when={data().courses.length > 1}>
            <CourseSequence
              courses={data().courses}
              currentId={props.courseId}
              selected={shown(data().courses)?.courseId ?? props.courseId}
              onSelect={(id) => picked.set(id)}
            />
          </If>
          <If when={shown(data().courses)}>
            {(c) => (
              <View style={{ gap: 12 }}>
                <ShadeCounts stats={c().stats} />
                <UnitList course={c()} />
                <View style={{ alignSelf: "flex-start" }}>
                  <Quiet
                    label={m().graph.open}
                    onPress={() => {
                      open.set(false);
                      nav.push({ name: "graph", courseId: c().courseId });
                    }}
                  />
                </View>
              </View>
            )}
          </If>
        </View>
      )}
    </Loaded>
  );
  return (
    <View style={{ maxWidth: props.maxWidth }}>
      <If
        when={platform.desktop}
        else={
          <>
            {trigger()}
            <Sheet
              open={open()}
              onOpenChange={({ open: next }) => open.set(next)}
              closeOnSwipe
              popupStyle={{
                backgroundColor: colors().page,
                borderTopLeftRadius: 16,
                borderTopRightRadius: 16,
                maxHeight: "80%",
                padding: 16,
                paddingBottom: 16 + insets().bottom,
              }}
              backdropStyle={{ backgroundColor: "#00000066" }}
            >
              <Scroll style={{ flexShrink: 1 }}>{panel()}</Scroll>
            </Sheet>
          </>
        }
      >
        <Popover
          open={open()}
          onOpenChange={({ open: next }) => open.set(next)}
          placement="bottom"
          align="start"
          offset={6}
          margin={16}
          popupStyle={{
            backgroundColor: colors().surface,
            borderColor: colors().line,
            borderRadius: 12,
            borderWidth: 1,
            maxHeight: Math.round(windowSize().height * 0.7),
            padding: 12,
            width: Math.min(576, windowSize().width - 32),
          }}
          trigger={trigger()}
        >
          <Scroll style={{ flexShrink: 1 }}>{panel()}</Scroll>
        </Popover>
      </If>
    </View>
  );
}

/** ShadeCounts is how many of a course's topics have each shade, and how many are not learned, under its summary. */
function ShadeCounts(props: { stats: CourseStats | undefined }) {
  const learned = () => props.stats?.learned ?? 0;
  const strengths = () => props.stats?.strengths ?? [];
  return (
    <View style={{ gap: 6 }}>
      <Muted>{m().shades.summary(learned(), props.stats?.total ?? 0)}</Muted>
      <View style={{ alignItems: "center", flexDirection: "row", flexWrap: "wrap", gap: 10 }}>
        <Text style={{ color: colors().muted, fontSize: 12 }}>{m().shades.weak}</Text>
        <Each of={[...strengths().keys()]}>
          {(level) => (
            <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
              <View style={{ backgroundColor: shadeOf(level()), borderRadius: 2, height: 10, width: 10 }} />
              <Text style={{ color: colors().muted, fontSize: 12 }}>{`${strengths()[level()] ?? 0}`}</Text>
            </View>
          )}
        </Each>
        <Text style={{ color: colors().muted, fontSize: 12 }}>{m().shades.strong}</Text>
        <View style={{ alignItems: "center", flexDirection: "row", gap: 4 }}>
          <View style={{ backgroundColor: colors().line, borderRadius: 2, height: 10, width: 10 }} />
          <Text style={{ color: colors().muted, fontSize: 12 }}>
            {`${m().shades.notLearned} ${Math.max(0, (props.stats?.total ?? 0) - learned())}`}
          </Text>
        </View>
      </View>
    </View>
  );
}
