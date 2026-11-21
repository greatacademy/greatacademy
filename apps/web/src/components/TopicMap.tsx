import type { Course } from "@ga/proto/catalog/v1/catalog_pb";
import { type TopicProgress, TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { Link } from "@tanstack/react-router";
import { type ReactNode, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { statusStyle } from "../lib/topic-status.ts";
import { Markdown } from "./Markdown.tsx";
import { Card } from "./ui.tsx";

const legend = [TopicStatus.LEARNED, TopicStatus.DUE, TopicStatus.AVAILABLE, TopicStatus.FAILED, TopicStatus.ASSUMED, TopicStatus.LOCKED];

/**
 * TopicLegend names the colors of TopicMap with how many of the course's own topics have each. Each name explains
 * itself: on hover where there is a pointer, and on a tap or click, which works on a phone too.
 */
export function TopicLegend({ topics }: { topics: TopicProgress[] }) {
  const { m } = useI18n();
  const [explained, setExplained] = useState<TopicStatus>();
  const counts = new Map<TopicStatus, number>();
  for (const t of topics) if (!t.foundation) counts.set(t.status, (counts.get(t.status) ?? 0) + 1);
  const shown = legend.filter((s) => (counts.get(s) ?? 0) > 0);
  const note = explained !== undefined && shown.includes(explained) ? explained : undefined;
  return (
    <div className="space-y-2 rounded-2xl border border-line bg-surface px-4 py-3 text-sm">
      <div className="flex flex-wrap gap-x-4 gap-y-2">
        {shown.map((s) => (
          <button
            key={s}
            type="button"
            title={m.statusNote[statusStyle[s].key]}
            aria-expanded={note === s}
            onClick={() => setExplained(note === s ? undefined : s)}
            className={`-mx-1.5 flex items-center gap-1.5 rounded-lg px-1.5 py-0.5 hover:bg-page ${note === s ? "bg-page" : ""}`}
          >
            <span className={`size-2.5 rounded-full ${statusStyle[s].dot}`} />
            <span className="underline decoration-line decoration-dotted underline-offset-4">{m.status[statusStyle[s].key]}</span>
            <span className="tabular-nums text-muted">{counts.get(s)}</span>
          </button>
        ))}
      </div>
      {note !== undefined && (
        <p role="status" className="text-xs text-muted">
          {m.statusNote[statusStyle[note].key]}
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

/** UnitBar is a unit's progress at a glance: one segment per topic, in the course's order, in its status's color. */
function UnitBar({ ids, byTopic }: { ids: readonly string[]; byTopic: ReadonlyMap<string, TopicProgress> }) {
  return (
    <div className="flex h-2 gap-px overflow-hidden rounded-full" aria-hidden>
      {ids.map((id) => (
        <span key={id} className={`h-full flex-1 ${statusStyle[byTopic.get(id)?.status ?? TopicStatus.LOCKED].dot}`} />
      ))}
    </div>
  );
}

/** TopicMap shows every topic of a course with its status and estimated memory; with subject, topics link to their pages in it. */
export function TopicMap({ course, topics, subject }: { course: Course; topics: TopicProgress[]; subject?: string }) {
  const { m, tx } = useI18n();
  const byTopic = new Map(topics.map((t) => [t.topicId, t]));
  return course.units.map((u) => (
    <Card key={tx(u.title)} className="space-y-4">
      <div className="space-y-2">
        <div className="flex items-baseline justify-between gap-3">
          <h2 className="font-semibold">{tx(u.title)}</h2>
          <UnitCount ids={u.modules.flatMap((mod) => mod.topics.map((t) => t.id))} byTopic={byTopic} />
        </div>
        <UnitBar ids={u.modules.flatMap((mod) => mod.topics.map((t) => t.id))} byTopic={byTopic} />
      </div>
      {u.modules.map((mod) => (
        <div key={tx(mod.title)} className="space-y-2">
          <h3 className="text-sm text-muted">{tx(mod.title)}</h3>
          <div className="grid gap-2 sm:grid-cols-2">
            {mod.topics.map((t) => {
              const p = byTopic.get(t.id);
              const s = statusStyle[p?.status ?? TopicStatus.LOCKED];
              const learned = p?.status === TopicStatus.LEARNED || p?.status === TopicStatus.DUE;
              const row: ReactNode = (
                <>
                  <span className={`size-2.5 shrink-0 rounded-full ${s.dot}`} />
                  <div className="min-w-0 flex-1">
                    <div className="truncate text-sm font-medium">
                      <Markdown source={tx(t.title)} inline />
                    </div>
                    {learned && (
                      <div className="mt-1 flex items-center gap-2" title={`${m.memory} ${Math.round(p.memory * 100)}%`}>
                        <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                          <div
                            className={`h-full rounded-full ${p.status === TopicStatus.DUE ? "bg-warn" : "bg-good"}`}
                            style={{ width: `${Math.round(p.memory * 100)}%` }}
                          />
                        </div>
                        <span className="w-8 text-right text-[10px] text-muted">{Math.round(p.memory * 100)}%</span>
                      </div>
                    )}
                  </div>
                  <span title={m.statusNote[s.key]} className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.chip}`}>
                    {m.status[s.key]}
                  </span>
                </>
              );
              const box = "flex min-w-0 items-center gap-3 rounded-xl border border-line px-3 py-2.5";
              return subject ? (
                <Link
                  key={t.id}
                  to="/$subject/topics/$topicId"
                  params={{ subject, topicId: t.id }}
                  className={`${box} transition hover:border-accent/50`}
                >
                  {row}
                </Link>
              ) : (
                <div key={t.id} className={box}>
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
