import type { Course } from "@ga/proto/catalog/v1/catalog_pb";
import { type TopicProgress, TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { Link } from "@tanstack/react-router";
import type { ReactNode } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { statusStyle } from "../lib/topic-status.ts";
import { Markdown } from "./Markdown.tsx";
import { Card } from "./ui.tsx";

const legend = [TopicStatus.LEARNED, TopicStatus.DUE, TopicStatus.AVAILABLE, TopicStatus.FAILED, TopicStatus.LOCKED];

/** TopicLegend names the colors of TopicMap. */
export function TopicLegend() {
  const { m } = useI18n();
  return (
    <div className="flex flex-wrap gap-3 text-xs">
      {legend.map((s) => (
        <span key={s} className="flex items-center gap-1.5 text-muted">
          <span className={`size-2.5 rounded-full ${statusStyle[s].dot}`} />
          {m.status[statusStyle[s].key]}
        </span>
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
      <h2 className="font-semibold">{tx(u.title)}</h2>
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
                  <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.chip}`}>{m.status[s.key]}</span>
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
