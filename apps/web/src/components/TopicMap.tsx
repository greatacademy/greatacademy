import { STRENGTH_MIX } from "@ga/design";
import type { Course } from "@ga/proto/catalog/v1/catalog_pb";
import { type TopicProgress, TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { statusStyle } from "../lib/topic-status.ts";
import { Markdown } from "./Markdown.tsx";
import { Card } from "./ui.tsx";

/** shade is the color of a learned topic of the given strength: the accent mixed over the surface, as in the apps. */
const shade = (strength: number) =>
  `color-mix(in oklab, var(--color-accent) ${Math.round((STRENGTH_MIX[Math.min(STRENGTH_MIX.length - 1, Math.max(0, strength))] ?? 1) * 100)}%, var(--color-surface))`;

const isLearned = (s: TopicStatus | undefined) => s === TopicStatus.LEARNED || s === TopicStatus.DUE;

/**
 * TopicDot marks a topic on the map: a learned one filled in its shade, ringed when its review is due; one not learned
 * hollow, edged in its status's color.
 */
export function TopicDot({ progress, className = "size-2.5" }: { progress: TopicProgress | undefined; className?: string }) {
  const status = progress?.status ?? TopicStatus.LOCKED;
  if (isLearned(status))
    return (
      <span
        className={`shrink-0 rounded-full ${status === TopicStatus.DUE ? "ring-[1.5px] ring-warn ring-offset-2 ring-offset-surface" : ""} ${className}`}
        style={{ background: shade(progress?.strength ?? 0) }}
      />
    );
  if (status === TopicStatus.ASSUMED) return <span className={`shrink-0 rounded-full bg-muted/50 ${className}`} />;
  const edge = status === TopicStatus.AVAILABLE ? "border-accent" : status === TopicStatus.FAILED ? "border-bad" : "border-muted/60";
  return <span className={`shrink-0 rounded-full border-[1.5px] ${edge} ${className}`} />;
}

type LegendKey = "shades" | TopicStatus;
const legend: LegendKey[] = ["shades", TopicStatus.DUE, TopicStatus.AVAILABLE, TopicStatus.FAILED, TopicStatus.ASSUMED, TopicStatus.LOCKED];

/**
 * TopicLegend explains the marks of TopicMap with how many of the course's own topics have each: the shades of
 * learned topics, from just learned to solid, then the other statuses. Each entry explains itself: on hover where
 * there is a pointer, and on a tap or click, which works on a phone too.
 */
export function TopicLegend({ topics }: { topics: TopicProgress[] }) {
  const { m } = useI18n();
  const [explained, setExplained] = useState<LegendKey>();
  const own = topics.filter((t) => !t.foundation);
  const count = (k: LegendKey) => own.filter((t) => (k === "shades" ? isLearned(t.status) : t.status === k)).length;
  const shown = legend.filter((k) => count(k) > 0);
  const note = explained !== undefined && shown.includes(explained) ? explained : undefined;
  const noteOf = (k: LegendKey) => (k === "shades" ? m.shades.note : m.statusNote[statusStyle[k].key]);
  return (
    <div className="space-y-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
      <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
        {shown.map((k) => (
          <button
            key={k}
            type="button"
            title={noteOf(k)}
            aria-expanded={note === k}
            onClick={() => setExplained(note === k ? undefined : k)}
            className={`-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 hover:bg-page ${note === k ? "bg-page" : ""}`}
          >
            {k !== "shades" && <TopicDot progress={{ status: k, strength: 2 } as TopicProgress} />}
            <span className="underline decoration-line decoration-dotted underline-offset-4">
              {k === "shades" ? m.shades.label : m.status[statusStyle[k].key]}
            </span>
            <span className="tabular-nums text-muted">{count(k)}</span>
            {k === "shades" && (
              <span className="ml-1 flex items-center gap-1.5 text-xs text-muted">
                {m.shades.weak}
                <span className="flex overflow-hidden rounded-sm" aria-hidden>
                  {STRENGTH_MIX.map((_, i) => (
                    // biome-ignore lint/suspicious/noArrayIndexKey: the shades are a fixed scale.
                    <span key={i} className="h-2.5 w-3" style={{ background: shade(i) }} />
                  ))}
                </span>
                {m.shades.strong}
              </span>
            )}
          </button>
        ))}
      </div>
      {note !== undefined && (
        <p role="status" className="text-xs text-muted">
          {noteOf(note)}
        </p>
      )}
    </div>
  );
}

const known = (s: TopicStatus | undefined) => s === TopicStatus.LEARNED || s === TopicStatus.DUE || s === TopicStatus.ASSUMED;

/** UnitCount says how many of a unit's topics are known. */
function UnitCount({ ids, byTopic }: { ids: readonly string[]; byTopic: ReadonlyMap<string, TopicProgress> }) {
  const { m } = useI18n();
  return (
    <span className="shrink-0 text-xs tabular-nums text-muted">
      {m.unitLearned(ids.filter((id) => known(byTopic.get(id)?.status)).length, ids.length)}
    </span>
  );
}

/** rank orders a unit's bar: the firmest learned topics first, then those assumed, then the rest, left empty. */
const rank = (p: TopicProgress | undefined) => (isLearned(p?.status) ? 10 + (p?.strength ?? 0) : p?.status === TopicStatus.ASSUMED ? 1 : 0);

/**
 * UnitBar is a unit's progress at a glance: one segment per topic, the firmest first and the ones not learned left
 * empty, as long as the unit is next to the course's largest.
 */
function UnitBar({ ids, byTopic, widest }: { ids: readonly string[]; byTopic: ReadonlyMap<string, TopicProgress>; widest: number }) {
  const sorted = ids.map((id) => byTopic.get(id)).sort((a, b) => rank(b) - rank(a));
  return (
    <div
      className="flex h-2 overflow-hidden rounded-full border border-line"
      style={{ width: `${Math.max(8, (ids.length / widest) * 100)}%` }}
      aria-hidden
    >
      {sorted.map((p, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: segments are positions in a sorted bar, not topics.
          key={i}
          className={`h-full flex-1 ${p?.status === TopicStatus.ASSUMED ? "bg-muted/50" : ""}`}
          style={isLearned(p?.status) ? { background: shade(p?.strength ?? 0) } : undefined}
        />
      ))}
    </div>
  );
}

/** TopicMap shows every topic of a course with its status and estimated memory; with subject, topics link to their pages in it. */
export function TopicMap({ course, topics, subject }: { course: Course; topics: TopicProgress[]; subject?: string }) {
  const { m, tx } = useI18n();
  const byTopic = new Map(topics.map((t) => [t.topicId, t]));
  const unitIds = (u: Course["units"][number]) => u.modules.flatMap((mod) => mod.topics.map((t) => t.id));
  const widest = Math.max(1, ...course.units.map((u) => unitIds(u).length));
  return course.units.map((u) => (
    <Card key={tx(u.title)} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-semibold">{tx(u.title)}</h2>
          <UnitCount ids={unitIds(u)} byTopic={byTopic} />
        </div>
        <UnitBar ids={unitIds(u)} byTopic={byTopic} widest={widest} />
      </div>
      {u.modules.map((mod) => (
        <div key={tx(mod.title)} className="space-y-2">
          <h3 className="text-sm text-muted">{tx(mod.title)}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {mod.topics.map((t) => {
              const p = byTopic.get(t.id);
              const s = statusStyle[p?.status ?? TopicStatus.LOCKED];
              // Shading says how firm a learned topic is; a chip names only what asks for action: a review due, a
              // topic to learn next, one waiting on its prerequisites.
              const chip = p?.status === TopicStatus.DUE || p?.status === TopicStatus.AVAILABLE || p?.status === TopicStatus.FAILED;
              const hint = [
                m.status[s.key],
                m.statusNote[s.key],
                ...(isLearned(p?.status) && p ? [`${m.memory} ${Math.round(p.memory * 100)}%`] : []),
              ].join(" · ");
              const row: ReactNode = (
                <>
                  <TopicDot progress={p} />
                  <div className="min-w-0 flex-1 truncate text-sm font-medium">
                    <Markdown source={tx(t.title)} inline />
                  </div>
                  {chip && <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.chip}`}>{m.status[s.key]}</span>}
                </>
              );
              const box = "flex min-w-0 items-center gap-3 rounded-xl border border-line px-3 py-2.5";
              return subject ? (
                <Link
                  key={t.id}
                  title={hint}
                  to="/$subject/topics/$topicId"
                  params={{ subject, topicId: t.id }}
                  className={`${box} transition hover:border-accent/50`}
                >
                  {row}
                </Link>
              ) : (
                <div key={t.id} title={hint} className={box}>
                  {row}
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </Card>
  ));
}
