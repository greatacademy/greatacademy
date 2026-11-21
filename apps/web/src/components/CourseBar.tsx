import { Popover } from "@base-ui/react/popover";
import type { CourseStats } from "@ga/proto/learning/v1/learning_pb";
import { useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { shade } from "../lib/topic-status.ts";
import { CourseSequence, UnitList, useCourseSequence } from "./CourseSequence.tsx";

/** Shaded is what a shaded bar shows: topics learned, in all, and the learned ones by strength, of a course or a unit. */
export type Shaded = Pick<CourseStats, "learned" | "total" | "strengths">;

/** ShadedBar is a course's progress as one bar: its learned topics, the firmest first, in the progress map's shades. */
export function ShadedBar({ stats, className = "" }: { stats: Shaded; className?: string }) {
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
export const percentLearned = (s: Shaded) => (s.total > 0 ? Math.floor((s.learned / s.total) * 100) : 0);

/**
 * CourseBar is a course's progress on the Learn and Course pages: the shaded bar with the share of the course learned.
 * It explains itself on hover, and opens on a tap or click, which works on a phone too, a popover over the page that
 * leaves the layout as it is: the course sequence as tabs, and for the course picked, how many topics have each shade
 * and its units numbered with their own bars.
 */
export function CourseBar({ stats, courseId, className = "" }: { stats: CourseStats; courseId: string; className?: string }) {
  const { m } = useI18n();
  const [open, setOpen] = useState(false);
  const [picked, setPicked] = useState<string>();
  const sequence = useCourseSequence(courseId, open);
  const courses = sequence.data?.courses ?? [];
  const shown = courses.find((c) => c.courseId === (picked ?? courseId)) ?? courses.find((c) => c.courseId === courseId);
  return (
    <div className={className}>
      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger
          title={m.shades.summary(stats.learned, stats.total)}
          className="-mx-1.5 flex w-[calc(100%+0.75rem)] items-center gap-3 rounded-lg px-1.5 py-1 text-left outline-none hover:bg-page focus-visible:ring-2 focus-visible:ring-accent/25"
        >
          <ShadedBar stats={stats} />
          <span className="shrink-0 text-sm font-semibold tabular-nums underline decoration-line decoration-dotted underline-offset-4">
            {percentLearned(stats)}%
          </span>
        </Popover.Trigger>
        <Popover.Portal>
          <Popover.Positioner sideOffset={6} align="start" collisionPadding={16} className="z-30">
            <Popover.Popup className="max-h-[min(70vh,var(--available-height))] w-[max(var(--anchor-width),min(36rem,calc(100vw-2rem)))] max-w-[calc(100vw-2rem)] space-y-3 overflow-y-auto rounded-xl border border-line bg-surface px-3 py-3 text-xs text-muted shadow-lg outline-none">
              <Popover.Title className="sr-only">{m.sequence.label}</Popover.Title>
              {sequence.isPending && <p>{m.loading}</p>}
              {sequence.isError && <p className="text-bad">{m.error}</p>}
              {courses.length > 1 && (
                <CourseSequence courses={courses} currentId={courseId} selected={shown?.courseId ?? courseId} onSelect={setPicked} />
              )}
              {shown?.stats && <ShadeCounts stats={shown.stats} />}
              {shown && <UnitList course={shown} />}
            </Popover.Popup>
          </Popover.Positioner>
        </Popover.Portal>
      </Popover.Root>
    </div>
  );
}

/** ShadeCounts is how many of a course's topics have each shade, and how many are not learned, under its summary. */
function ShadeCounts({ stats }: { stats: CourseStats }) {
  const { m } = useI18n();
  return (
    <div className="space-y-1.5">
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
  );
}
