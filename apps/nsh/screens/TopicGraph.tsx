import { layoutRoadmap, prerequisitesOf, type RoadmapSize } from "@ga/design";
import { TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { Canvas, computed, type ImageAsset, Path2D, platform, Scroll, type ScrollRef, signal, Text, View } from "nsh";
import { NavPage } from "nsh/base";

import arrowsIn from "../assets/icons/arrows-in.svg";
import minus from "../assets/icons/minus.svg";
import plus from "../assets/icons/plus.svg";
import { m, tx } from "../lib/i18n.ts";
import { query } from "../lib/query.ts";
import { colors, headerStyle, Icon, Loaded, Muted, Skeleton } from "../lib/ui.tsx";
import { edgeColor, loadMap, type MapData, type StatusKey, shadeOf, statusKeys } from "./CourseMap.tsx";
import { Header } from "./Header.tsx";

/** GRAPH_SIZE is the size of a topic's box on the knowledge graph and the space between boxes and rows, as on the web. */
const GRAPH_SIZE: RoadmapSize = { boxWidth: 152, boxHeight: 44, gap: 14, rowGap: 56 };
/** PAD is the room left around the whole graph when it fits the screen. */
const PAD = 16;
const MIN_SCALE = 0.02;
const MAX_SCALE = 2;
/** DARK_FROM is the strength from which a learned topic's shade is dark enough for light text, as on the web. */
const DARK_FROM = 3;

/** View is what the scroll view shows: its offset, its zoom and the size of its viewport. */
interface Shown {
  readonly x: number;
  readonly y: number;
  readonly k: number;
  readonly width: number;
  readonly height: number;
}

/**
 * TopicGraph is a course's knowledge graph (docs/experience.md §3), as on the web: its topics, each above the topics
 * it builds on, shaded as on the progress map, to drag and pinch. Tapping a topic, or pointing at it on a desktop,
 * lights up the topics it builds on.
 */
export function TopicGraph(props: { courseId: string }) {
  const data = query(["map", props.courseId], ({ signal }) => loadMap(props.courseId, signal));
  const title = computed(() => {
    const course = data()?.course.course;
    return course ? m().graph.title(tx(course.title)) : m().graph.open;
  });
  return (
    <NavPage headerStyle={headerStyle()} title={title()} header={<Header title={title()} />}>
      <View style={{ backgroundColor: colors().page, flex: 1 }}>
        <View style={{ borderBottomWidth: 1, borderColor: colors().line, paddingHorizontal: 16, paddingVertical: 8 }}>
          <Muted>{m().graph.note}</Muted>
        </View>
        <Loaded rpc={data} skeleton={<Skeleton rows={4} />}>
          {(loaded) => <Graph map={loaded()} />}
        </Loaded>
      </View>
    </NavPage>
  );
}

/**
 * Graph lays the topics out and lets the platform's scroll view move and zoom them. The lines are drawn on a canvas
 * the size of the screen behind it, following its offset and zoom, since a canvas as large as the graph would need a
 * bitmap of hundreds of megabytes at a phone's resolution.
 */
function Graph(props: { map: MapData }) {
  const list = computed(() =>
    (props.map.course.course?.units ?? [])
      .flatMap((u) => u.modules.flatMap((mod) => mod.topics))
      .map((t) => ({ id: t.id, buildsOn: t.prerequisites, title: t.title })),
  );
  const layout = computed(() => layoutRoadmap(list(), GRAPH_SIZE, "balance"));
  const paths = computed(() => layout().edges.map((e) => ({ from: e.from, to: e.to, path: new Path2D(e.path) })));
  const byTopic = computed(() => new Map(props.map.progress.topics.map((t) => [t.topicId, t])));
  const titles = computed(() => new Map(list().map((t) => [t.id, tx(t.title)])));
  const lit = signal<string | undefined>(undefined);
  const path = computed(() => {
    const id = lit();
    return id ? prerequisitesOf(list(), id) : undefined;
  });

  const frame = signal({ width: 0, height: 0 });
  const fit = computed(() => {
    const { width, height } = frame();
    const { width: w, height: h } = layout();
    if (width === 0 || w === 0) return 1;
    return clamp(Math.min((width - 2 * PAD) / w, (height - 2 * PAD) / h, 1));
  });
  const shown = signal<Shown | undefined>(undefined);
  // Before the scroll view reports, it shows the graph fitted to the screen.
  const now = (): Shown => shown() ?? { x: 0, y: 0, k: fit(), ...frame() };
  let scroll!: ScrollRef;
  const zoomBy = (factor: number) => scroll.zoomTo({ scale: clamp(now().k * factor) });

  // The part of the graph the lines are drawn for: what the screen shows and a margin around it, in the graph's
  // points, with the zoom it was drawn at. It changes only when the view leaves it or the zoom moves on.
  const sheet = signal<Sheet | undefined>(undefined);
  const covered = (): Sheet => sheet() ?? sheetFor(visibleOf(now(), layout()));
  const follow = (v: Shown) => {
    shown.set(v);
    const seen = visibleOf(v, layout());
    const s = sheet();
    if (!s || !serves(s, seen)) sheet.set(sheetFor(seen));
  };

  const draw = (cx: CanvasRenderingContext, _size: { width: number; height: number }) => {
    const s = covered();
    const lighted = path();
    cx.setTransform(s.k, 0, 0, s.k, -s.x * s.k, -s.y * s.k);
    for (const e of paths()) {
      const on = !!lighted && lighted.has(e.from) && lighted.has(e.to);
      cx.strokeStyle = on ? colors().accent : colors().muted;
      cx.globalAlpha = on ? 1 : lighted ? 0.1 : 0.4;
      cx.lineWidth = (on ? 2.5 : 1.25) / s.k;
      cx.stroke(e.path);
    }
  };

  return (
    <View style={{ flex: 1 }} onLayout={(e) => frame.set({ width: e.bounds.size.width, height: e.bounds.size.height })}>
      <If when={frame().width > 0}>
        <Scroll
          ref={scroll}
          minimumZoomScale={fit()}
          maximumZoomScale={MAX_SCALE}
          zoomScale={fit()}
          centerContent
          scrollEventThrottle={16}
          onScroll={(e) => follow({ x: e.offset.x, y: e.offset.y, k: e.zoomScale, width: e.size.width, height: e.size.height })}
          style={{ bottom: 0, left: 0, position: "absolute", right: 0, top: 0 }}
        >
          <View onPress={() => lit.set(undefined)} style={{ height: layout().height, width: layout().width }}>
            {/* The lines move with the topics, inside the scroll view; scaled back by the zoom, the canvas keeps
                about the screen's size and resolution however far the graph is zoomed out. */}
            <View
              style={{
                height: covered().height,
                left: covered().x,
                pointerEvents: "none",
                position: "absolute",
                top: covered().y,
                transform: `scale(${1 / covered().k})`,
                transformOrigin: "top left",
                width: covered().width,
              }}
            >
              <Canvas draw={draw} style={{ flex: 1 }} />
            </View>
            <Each of={layout().boxes} key={(b) => b.id}>
              {(b) => (
                <TopicNode
                  title={titles().get(b().id) ?? b().id}
                  status={statusKeys[byTopic().get(b().id)?.status ?? TopicStatus.LOCKED] ?? "locked"}
                  strength={byTopic().get(b().id)?.strength ?? 0}
                  x={b().x}
                  y={b().y}
                  dim={!!path() && !path()?.has(b().id)}
                  onLight={(on) => lit.set(on ? b().id : undefined)}
                  lit={lit() === b().id}
                />
              )}
            </Each>
          </View>
        </Scroll>
      </If>
      <View
        style={{
          backgroundColor: colors().surface,
          borderColor: colors().line,
          borderRadius: 12,
          borderWidth: 1,
          bottom: 16,
          overflow: "hidden",
          position: "absolute",
          right: 16,
        }}
      >
        <ZoomButton label={m().graph.zoomIn} icon={plus} onPress={() => zoomBy(1.25)} />
        <ZoomButton label={m().graph.zoomOut} icon={minus} onPress={() => zoomBy(0.8)} />
        <ZoomButton label={m().graph.fit} icon={arrowsIn} onPress={() => scroll.zoomTo({ scale: fit() })} last />
      </View>
    </View>
  );
}

/**
 * Sheet is the part of the graph the lines are drawn for: its top left corner in the graph's points, its size in the
 * screen's points and the zoom it is drawn at.
 */
interface Sheet {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
  readonly k: number;
}

/** MARGIN is the share of the screen drawn beyond each of its edges, so that a pan shows lines already drawn. */
const MARGIN = 0.35;
/** REZOOM is how far the zoom may move before the lines are drawn again at the new zoom. */
const REZOOM = 1.2;

/** Seen is the part of the graph the screen shows, in the graph's points, and the zoom. */
interface Seen {
  readonly left: number;
  readonly top: number;
  readonly width: number;
  readonly height: number;
  readonly k: number;
}

/** visibleOf is what the scroll view shows of the graph; content smaller than the screen is centered, as it centers it. */
function visibleOf(v: Shown, graph: { width: number; height: number }): Seen {
  return {
    left: (v.x - Math.max(0, v.width - graph.width * v.k) / 2) / v.k,
    top: (v.y - Math.max(0, v.height - graph.height * v.k) / 2) / v.k,
    width: v.width / v.k,
    height: v.height / v.k,
    k: v.k,
  };
}

/** sheetFor is the sheet for what the screen shows: it and a margin around it, at its zoom. */
function sheetFor(seen: Seen): Sheet {
  return {
    x: seen.left - MARGIN * seen.width,
    y: seen.top - MARGIN * seen.height,
    width: (1 + 2 * MARGIN) * seen.width * seen.k,
    height: (1 + 2 * MARGIN) * seen.height * seen.k,
    k: seen.k,
  };
}

/** serves tells whether a sheet still serves what the screen shows: the screen inside it, at a zoom near its own. */
function serves(s: Sheet, seen: Seen): boolean {
  if (seen.k > s.k * REZOOM || seen.k < s.k / REZOOM) return false;
  return (
    seen.left >= s.x && seen.top >= s.y && seen.left + seen.width <= s.x + s.width / s.k && seen.top + seen.height <= s.y + s.height / s.k
  );
}

/** CanvasRenderingContext is the context a canvas draws with. */
type CanvasRenderingContext = Parameters<Parameters<typeof Canvas>[0]["draw"]>[0];

/**
 * TopicNode is one topic of the graph, as on the web: a pill filled with its shade once learned, edged by its status
 * otherwise, with a dot for a topic not learned.
 */
function TopicNode(props: {
  title: string;
  status: StatusKey;
  strength: number;
  x: number;
  y: number;
  dim: boolean;
  lit: boolean;
  onLight: (on: boolean) => void;
}) {
  const learned = () => props.status === "learned" || props.status === "due";
  const dark = () => learned() && props.strength >= DARK_FROM;
  const border = () =>
    props.status === "due"
      ? colors().warn
      : props.status === "available"
        ? colors().accent
        : props.status === "failed"
          ? colors().bad
          : learned()
            ? "transparent"
            : colors().line;
  const fill = () => (learned() ? shadeOf(props.strength) : props.status === "assumed" ? colors().line : colors().surface);
  return (
    <View
      role="button"
      accessibilityLabel={`${props.title}, ${m().statuses[props.status]}`}
      tooltip={`${props.title} · ${m().statuses[props.status]}`}
      onPress={platform.desktop ? undefined : () => props.onLight(!props.lit)}
      onMouseEnter={() => props.onLight(true)}
      onMouseLeave={() => props.onLight(false)}
      style={{
        alignItems: "center",
        backgroundColor: fill(),
        borderColor: border(),
        borderRadius: 999,
        borderWidth: props.status === "due" ? 2 : 1,
        flexDirection: "row",
        gap: 6,
        height: GRAPH_SIZE.boxHeight,
        justifyContent: "center",
        left: props.x,
        opacity: props.dim ? 0.3 : 1,
        paddingHorizontal: 12,
        position: "absolute",
        top: props.y,
        width: GRAPH_SIZE.boxWidth,
      }}
    >
      <If when={!learned()}>
        <View
          style={{
            borderColor: edgeColor(props.status),
            borderRadius: 4,
            borderWidth: props.status === "assumed" ? 0 : 1.5,
            backgroundColor: props.status === "assumed" ? colors().muted : undefined,
            flexShrink: 0,
            height: 8,
            width: 8,
          }}
        />
      </If>
      <Text
        style={{
          color: dark() ? "#ffffff" : colors().ink,
          flexShrink: 1,
          fontSize: 11,
          fontWeight: "500",
          numberOfLines: 2,
          textAlign: "center",
        }}
      >
        {props.title}
      </Text>
    </View>
  );
}

/** ZoomButton is one of the buttons in the corner of the graph. */
function ZoomButton(props: { label: string; icon: ImageAsset; onPress: () => void; last?: boolean }) {
  return (
    <View
      role="button"
      accessibilityLabel={props.label}
      tooltip={props.label}
      onPress={props.onPress}
      hoverStyle={{ backgroundColor: colors().page }}
      style={{
        alignItems: "center",
        borderBottomWidth: props.last ? 0 : 1,
        borderColor: colors().line,
        height: 44,
        justifyContent: "center",
        width: 44,
      }}
    >
      <Icon src={props.icon} size={18} />
    </View>
  );
}

const clamp = (k: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, k));
