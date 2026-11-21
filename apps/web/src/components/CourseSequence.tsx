import type { CourseUnits } from "@ga/proto/learning/v1/learning_pb";
import { useQuery } from "@tanstack/react-query";

import { useI18n } from "../lib/i18n.tsx";
import { learning } from "../lib/rpc.ts";
import { percentLearned, ShadedBar } from "./CourseBar.tsx";

/** useCourseSequence reads the course sequence of a learner's current course, unit by unit, when enabled. */
export function useCourseSequence(courseId: string, enabled = true, learnerId = "") {
  return useQuery({
    queryKey: ["sequence", courseId, learnerId],
    queryFn: () => learning.listCourseProgress({ courseId, learnerId }),
    enabled: enabled && !!courseId,
    staleTime: 0,
  });
}

/**
 * CourseSequence picks a course of the sequence as tabs: the courses taken before, the current one, then those that
 * follow, each with its place in the sequence and how much of it is learned.
 */
export function CourseSequence({
  courses,
  currentId,
  selected,
  onSelect,
}: {
  courses: readonly CourseUnits[];
  currentId: string;
  selected: string;
  onSelect: (courseId: string) => void;
}) {
  const { m, tx } = useI18n();
  const at = courses.findIndex((c) => c.courseId === currentId);
  const place = (i: number) => (i < at ? m.sequence.before : i === at ? m.sequence.current : m.sequence.after);
  return (
    <div role="tablist" aria-label={m.sequence.label} title={m.sequence.note} className="-mx-1 flex gap-2 overflow-x-auto px-1 pb-1">
      {courses.map((c, i) => (
        <button
          key={c.courseId}
          type="button"
          role="tab"
          aria-selected={c.courseId === selected}
          onClick={() => onSelect(c.courseId)}
          className={`min-w-28 max-w-44 shrink-0 space-y-0.5 rounded-xl border px-3 py-2 text-left transition ${
            c.courseId === selected ? "border-accent bg-accent-soft" : "border-line bg-surface hover:border-accent/50"
          }`}
        >
          <span className={`block text-[11px] ${i === at ? "font-semibold text-accent" : "text-muted"}`}>{place(i)}</span>
          <span className="block truncate text-sm font-medium">{tx(c.title)}</span>
          <span className="block text-xs tabular-nums text-muted">{c.stats ? percentLearned(c.stats) : 0}%</span>
        </button>
      ))}
    </div>
  );
}

/** UnitList is a course's units numbered in order, each with its shaded bar and how much of it is learned. */
export function UnitList({ course }: { course: CourseUnits }) {
  const { tx } = useI18n();
  return (
    <ol className="space-y-2.5">
      {course.units.map((u, i) => (
        <li key={tx(u.title)} className="space-y-1">
          <div className="flex items-baseline gap-2 text-sm">
            <span className="w-5 shrink-0 tabular-nums text-muted">{i + 1}</span>
            <span className="min-w-0 flex-1 truncate">{tx(u.title)}</span>
            <span className="shrink-0 text-xs tabular-nums text-muted">{percentLearned(u)}%</span>
          </div>
          <ShadedBar stats={u} className="ml-7 w-[calc(100%-1.75rem)]" />
        </li>
      ))}
    </ol>
  );
}
