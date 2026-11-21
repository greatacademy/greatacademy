import { Dialog } from "@base-ui/react/dialog";
import type { Course } from "@ga/proto/catalog/v1/catalog_pb";
import { type TopicProgress, TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { ArrowsIn, Graph, Minus, Plus, X } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "@tanstack/react-router";
import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import { useI18n } from "../lib/i18n.tsx";
import { layoutRoadmap, prerequisitesOf, type RoadmapSize } from "../lib/roadmap.ts";
import { catalog, learning } from "../lib/rpc.ts";
import { useSubjectPlace } from "../lib/subject.tsx";
import { shade, statusStyle } from "../lib/topic-status.ts";
import { TopicDot } from "./TopicMap.tsx";
import { buttonClass, Spinner } from "./ui.tsx";

/** GRAPH_SIZE is the size of a topic's box on the knowledge graph and the space between boxes and rows. */
const GRAPH_SIZE: RoadmapSize = { boxWidth: 152, boxHeight: 44, gap: 14, rowGap: 56 };
const MIN_SCALE = 0.05;
const MAX_SCALE = 2;
/** DARK_FROM is the strength from which a learned topic's shade is dark enough for light text. */
const DARK_FROM = 3;

/** View is where the graph is: its offset and scale in the viewport. */
interface View {
  readonly x: number;
  readonly y: number;
  readonly k: number;
}

/**
 * TopicGraphButton opens the knowledge graph of a course (docs/experience.md §3): its topics, each above the topics
 * it builds on, shaded as on the progress map, over the whole screen. A topic's page speaks of the current course, so
 * only its graph links to them.
 */
export function TopicGraphButton({ courseId, className = "" }: { courseId: string; className?: string }) {
  const { m } = useI18n();
  const place = useSubjectPlace();
  const subject = place?.enrollment?.courseId === courseId ? place.subject.id : undefined;
  const [open, setOpen] = useState(false);
  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Trigger className={buttonClass("secondary", className)}>
        <Graph size={16} /> {m.graph.open}
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Popup className="fixed inset-0 z-50 flex flex-col bg-page outline-none">
          {open && <GraphScreen courseId={courseId} subject={subject} onClose={() => setOpen(false)} />}
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

/** GraphScreen loads a course and the learner's progress in it, and shows its graph with the way to move around it. */
function GraphScreen({ courseId, subject, onClose }: { courseId: string; subject?: string; onClose: () => void }) {
  const { m, tx } = useI18n();
  const course = useQuery({ queryKey: ["course", courseId], queryFn: () => catalog.getCourse({ courseId }) });
  const progress = useQuery({
    queryKey: ["progress", courseId],
    queryFn: () => learning.getCourseProgress({ courseId }),
    staleTime: 0,
  });
  const title = course.data?.course ? tx(course.data.course.title) : "";
  return (
    <>
      <div className="flex items-start gap-3 border-b border-line bg-surface px-4 py-3">
        <div className="min-w-0 flex-1 space-y-0.5">
          <Dialog.Title className="truncate text-base font-semibold">{title ? m.graph.title(title) : m.graph.open}</Dialog.Title>
          <Dialog.Description className="text-xs text-muted">{m.graph.note}</Dialog.Description>
        </div>
        <button type="button" onClick={onClose} aria-label={m.graph.close} className={buttonClass("ghost", "px-2")}>
          <X size={20} />
        </button>
      </div>
      {course.isError || progress.isError ? (
        <p className="p-4 text-sm text-bad">{m.error}</p>
      ) : course.data?.course && progress.data ? (
        <TopicGraph course={course.data.course} topics={progress.data.topics} subject={subject} onLeave={onClose} />
      ) : (
        <Spinner label={m.loading} />
      )}
    </>
  );
}

/** TopicGraph lays out a course's topics in rows over its prerequisites and lets the learner drag and zoom it. */
function TopicGraph({
  course,
  topics,
  subject,
  onLeave,
}: {
  course: Course;
  topics: readonly TopicProgress[];
  subject?: string;
  onLeave: () => void;
}) {
  const { m, tx } = useI18n();
  const list = useMemo(
    () =>
      course.units
        .flatMap((u) => u.modules.flatMap((mod) => mod.topics))
        .map((t) => ({ id: t.id, buildsOn: t.prerequisites, title: t.title })),
    [course],
  );
  const map = useMemo(() => layoutRoadmap(list, GRAPH_SIZE, "balance"), [list]);
  const byTopic = useMemo(() => new Map(topics.map((t) => [t.topicId, t])), [topics]);
  const titles = useMemo(() => new Map(list.map((t) => [t.id, tx(t.title)])), [list, tx]);
  const [lit, setLit] = useState<string>();
  const path = useMemo(() => (lit ? prerequisitesOf(list, lit) : undefined), [list, lit]);

  const frame = useRef<HTMLDivElement>(null);
  const [view, setView] = useState<View>({ x: 0, y: 0, k: 1 });
  const fit = useCallback(() => {
    const el = frame.current;
    if (!el || map.width === 0) return;
    const pad = 24;
    const k = clamp(Math.min((el.clientWidth - 2 * pad) / map.width, (el.clientHeight - 2 * pad) / map.height, 1));
    setView({ k, x: (el.clientWidth - map.width * k) / 2, y: (el.clientHeight - map.height * k) / 2 });
  }, [map]);
  useLayoutEffect(fit, [fit]);

  // zoomAt scales the graph by `factor` about a point of the viewport, so the point stays under the pointer.
  const zoomAt = useCallback((factor: number, px?: number, py?: number) => {
    const el = frame.current;
    setView((v) => {
      const k = clamp(v.k * factor);
      const cx = px ?? (el?.clientWidth ?? 0) / 2;
      const cy = py ?? (el?.clientHeight ?? 0) / 2;
      return { k, x: cx - ((cx - v.x) * k) / v.k, y: cy - ((cy - v.y) * k) / v.k };
    });
  }, []);

  // The wheel zooms; React's onWheel is passive, so it is listened to directly to keep the page from scrolling.
  useEffect(() => {
    const el = frame.current;
    if (!el) return;
    const wheel = (e: WheelEvent) => {
      e.preventDefault();
      const r = el.getBoundingClientRect();
      zoomAt(Math.exp(-e.deltaY * (e.ctrlKey ? 0.01 : 0.002)), e.clientX - r.left, e.clientY - r.top);
    };
    el.addEventListener("wheel", wheel, { passive: false });
    return () => el.removeEventListener("wheel", wheel);
  }, [zoomAt]);

  // Pointers down: one drags the graph, two pinch it. moved keeps a drag from also opening a topic.
  const pointers = useRef(new Map<number, { x: number; y: number }>());
  const moved = useRef(false);
  const down = (e: ReactPointerEvent) => {
    pointers.current.set(e.pointerId, { x: e.clientX, y: e.clientY });
    if (pointers.current.size === 1) moved.current = false;
  };
  const move = (e: ReactPointerEvent) => {
    const before = pointers.current.get(e.pointerId);
    if (!before) return;
    const now = { x: e.clientX, y: e.clientY };
    if (pointers.current.size === 1) {
      const dx = now.x - before.x;
      const dy = now.y - before.y;
      if (!moved.current && Math.hypot(dx, dy) < 4) return;
      if (!moved.current) frame.current?.setPointerCapture(e.pointerId);
      moved.current = true;
      pointers.current.set(e.pointerId, now);
      setView((v) => ({ ...v, x: v.x + dx, y: v.y + dy }));
      return;
    }
    const other = [...pointers.current].find(([id]) => id !== e.pointerId)?.[1];
    pointers.current.set(e.pointerId, now);
    if (!other) return;
    moved.current = true;
    const r = frame.current?.getBoundingClientRect();
    const span = Math.hypot(before.x - other.x, before.y - other.y);
    if (span > 0 && r)
      zoomAt(Math.hypot(now.x - other.x, now.y - other.y) / span, (now.x + other.x) / 2 - r.left, (now.y + other.y) / 2 - r.top);
  };
  const up = (e: ReactPointerEvent) => {
    pointers.current.delete(e.pointerId);
  };

  const { boxWidth, boxHeight } = GRAPH_SIZE;
  return (
    <div className="relative min-h-0 flex-1">
      <div
        ref={frame}
        className={`absolute inset-0 touch-none overflow-hidden select-none ${moved.current ? "cursor-grabbing" : "cursor-grab"}`}
        onPointerDown={down}
        onPointerMove={move}
        onPointerUp={up}
        onPointerCancel={up}
        onClickCapture={(e) => {
          if (moved.current) {
            e.preventDefault();
            e.stopPropagation();
          }
        }}
      >
        <div
          className="absolute top-0 left-0 origin-top-left"
          style={{ width: map.width, height: map.height, transform: `translate(${view.x}px, ${view.y}px) scale(${view.k})` }}
        >
          <svg width={map.width} height={map.height} className="absolute inset-0 overflow-visible" aria-hidden="true">
            {map.edges.map((e) => {
              const on = !!path && path.has(e.from) && path.has(e.to);
              return (
                <path
                  key={`${e.from}>${e.to}`}
                  d={e.path}
                  fill="none"
                  strokeWidth={on ? 2.5 : 1.25}
                  vectorEffect="non-scaling-stroke"
                  className={`${on ? "stroke-accent" : "stroke-muted"} ${path && !on ? "opacity-10" : "opacity-40"}`}
                />
              );
            })}
          </svg>
          {map.boxes.map((b) => {
            const p = byTopic.get(b.id);
            const status = p?.status ?? TopicStatus.LOCKED;
            const learned = status === TopicStatus.LEARNED || status === TopicStatus.DUE;
            const dark = learned && (p?.strength ?? 0) >= DARK_FROM;
            const edge =
              status === TopicStatus.DUE
                ? "border-warn border-2"
                : status === TopicStatus.AVAILABLE
                  ? "border-accent"
                  : status === TopicStatus.FAILED
                    ? "border-bad"
                    : learned
                      ? "border-transparent"
                      : "border-line";
            const fill = learned ? undefined : status === TopicStatus.ASSUMED ? "bg-muted/25" : "bg-surface";
            const title = titles.get(b.id) ?? b.id;
            const box = (
              <>
                {!learned && <TopicDot progress={p} className="size-2" />}
                <span className="line-clamp-2">{title}</span>
              </>
            );
            const className = `absolute flex items-center justify-center gap-1.5 rounded-full border px-3 text-center text-[11px] leading-tight font-medium transition-opacity ${edge} ${fill ?? ""} ${dark ? "text-white" : "text-ink"} ${path && !path.has(b.id) ? "opacity-30" : ""}`;
            const style = {
              left: b.x,
              top: b.y,
              width: boxWidth,
              height: boxHeight,
              ...(learned && { background: shade(p?.strength ?? 0) }),
            };
            const light = {
              onMouseEnter: () => setLit(b.id),
              onMouseLeave: () => setLit(undefined),
              onFocus: () => setLit(b.id),
              onBlur: () => setLit(undefined),
            };
            return subject ? (
              <Link
                key={b.id}
                to="/$subject/topics/$topicId"
                params={{ subject, topicId: b.id }}
                title={`${title} · ${m.status[statusStyle[status].key]}`}
                onClick={onLeave}
                draggable={false}
                className={`${className} hover:shadow-md focus-visible:outline-2 focus-visible:outline-accent`}
                style={style}
                {...light}
              >
                {box}
              </Link>
            ) : (
              <div key={b.id} title={`${title} · ${m.status[statusStyle[status].key]}`} className={className} style={style} {...light}>
                {box}
              </div>
            );
          })}
        </div>
      </div>
      <div className="absolute right-4 bottom-4 flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-sm">
        <ZoomButton label={m.graph.zoomIn} onClick={() => zoomAt(1.25)}>
          <Plus size={18} />
        </ZoomButton>
        <ZoomButton label={m.graph.zoomOut} onClick={() => zoomAt(0.8)}>
          <Minus size={18} />
        </ZoomButton>
        <ZoomButton label={m.graph.fit} onClick={fit}>
          <ArrowsIn size={18} />
        </ZoomButton>
      </div>
    </div>
  );
}

/** ZoomButton is one of the buttons in the corner of the graph. */
function ZoomButton({ label, onClick, children }: { label: string; onClick: () => void; children: ReactNode }) {
  return (
    <button
      type="button"
      aria-label={label}
      title={label}
      onClick={onClick}
      className="flex size-10 items-center justify-center border-line text-muted not-last:border-b hover:bg-page hover:text-ink focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-accent"
    >
      {children}
    </button>
  );
}

const clamp = (k: number) => Math.min(MAX_SCALE, Math.max(MIN_SCALE, k));
