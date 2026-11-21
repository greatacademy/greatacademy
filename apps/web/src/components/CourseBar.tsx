import type { CourseStats } from "@ga/proto/learning/v1/learning_pb";
import { useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { shade } from "../lib/topic-status.ts";

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

/**
 * CourseBar is a course's progress on the Learn and Course pages: the shaded bar, the topics learned and the reviews
 * due. It explains itself on hover, and on a tap or click, which works on a phone too: how many topics have each
 * shade, and what a review due means.
 */
export function CourseBar({ stats, className = "" }: { stats: CourseStats; className?: string }) {
  const { m } = useI18n();
  const [open, setOpen] = useState(false);
  const hint = [m.shades.summary(stats.learned, stats.total), ...(stats.due > 0 ? [`${m.due}: ${m.statusNote.due}`] : [])].join(" · ");
  return (
    <div className={`space-y-2 ${className}`}>
      <button
        type="button"
        title={hint}
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        className="-mx-1.5 block w-[calc(100%+0.75rem)] space-y-2 rounded-lg px-1.5 py-1 text-left hover:bg-page"
      >
        <span className="flex items-center gap-3 text-sm text-muted">
          <ShadedBar stats={stats} />
          <span className="shrink-0 underline decoration-line decoration-dotted underline-offset-4">
            {stats.learned} / {stats.total} {m.topics}
          </span>
        </span>
        {stats.due > 0 && (
          <span className="flex items-center gap-2 text-sm text-warn">
            <span
              className="size-2.5 rounded-full ring-[1.5px] ring-warn ring-offset-2 ring-offset-surface"
              style={{ background: shade(2) }}
            />
            {m.due}: {stats.due}
          </span>
        )}
      </button>
      {open && (
        <div role="status" className="space-y-2 rounded-xl border border-line bg-surface px-3 py-2.5 text-xs text-muted">
          <p>{m.shades.note}</p>
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
          {stats.due > 0 && <p>{m.statusNote.due}</p>}
        </div>
      )}
    </div>
  );
}
