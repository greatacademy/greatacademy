import type { CourseStats } from "@ga/proto/learning/v1/learning_pb";
import { useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { shade } from "../lib/topic-status.ts";
import { statsCounts, TopicLegend } from "./TopicMap.tsx";

/** ShadedBar is a course's progress as one bar: its learned topics, the firmest first, in the progress map's shades. */
export function ShadedBar({ stats, className = "" }: { stats: CourseStats; className?: string }) {
  const { m } = useI18n();
  const total = Math.max(1, stats.total);
  return (
    <div
      className={`flex h-2 w-full overflow-hidden rounded-full bg-line ${className}`}
      role="progressbar"
      aria-label={m.shades.summary(stats.learned, stats.total)}
      aria-valuenow={Math.round((stats.learned / total) * 100)}
      aria-valuemin={0}
      aria-valuemax={100}
    >
      {[...stats.strengths].reverse().map((n, i) => (
        <span
          // biome-ignore lint/suspicious/noArrayIndexKey: the shades are a fixed scale.
          key={i}
          className="h-full"
          style={{ width: `${(n / total) * 100}%`, background: shade(stats.strengths.length - 1 - i) }}
        />
      ))}
    </div>
  );
}

/** percentLearned is how much of a course is learned, rounded down, so that 100% means every topic. */
export const percentLearned = (s: CourseStats) => (s.total > 0 ? Math.floor((s.learned / s.total) * 100) : 0);

/**
 * CourseBar is a course's progress on the Learn and Course pages: the shaded bar with the share of the course learned,
 * and below it the counts of the progress map's legend. The bar explains itself on hover, and on a tap or click, which
 * works on a phone too: how many topics have each shade; each count explains its status the same way.
 */
export function CourseBar({ stats, className = "" }: { stats: CourseStats; className?: string }) {
  const { m } = useI18n();
  const [open, setOpen] = useState(false);
  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        title={m.shades.summary(stats.learned, stats.total)}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="-mx-1.5 flex w-[calc(100%+0.75rem)] items-center gap-3 rounded-lg px-1.5 py-1 text-left hover:bg-page"
      >
        <ShadedBar stats={stats} />
        <span className="shrink-0 text-sm font-semibold tabular-nums underline decoration-line decoration-dotted underline-offset-4">
          {percentLearned(stats)}%
        </span>
      </button>
      {open && (
        <div role="status" className="space-y-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-xs text-muted">
          <p>{m.shades.summary(stats.learned, stats.total)}</p>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span className="flex flex-wrap items-center gap-x-2.5 gap-y-1.5">
              <span>{m.shades.weak}</span>
              {stats.strengths.map((n, i) => (
                // biome-ignore lint/suspicious/noArrayIndexKey: the shades are a fixed scale.
                <span key={i} className="flex items-center gap-1 tabular-nums">
                  <span className="h-2.5 w-2.5 rounded-sm" style={{ background: shade(i) }} />
                  {n}
                </span>
              ))}
              <span>{m.shades.strong}</span>
            </span>
            <span className="flex items-center gap-1 tabular-nums">
              <span className="h-2.5 w-3 rounded-sm bg-line" />
              {m.shades.notLearned} {Math.max(0, stats.total - stats.learned)}
            </span>
          </div>
        </div>
      )}
      <TopicLegend counts={statsCounts(stats)} bare />
    </div>
  );
}
