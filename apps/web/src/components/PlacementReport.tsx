import type { GetDashboardResponse } from "@ga/proto/learning/v1/learning_pb";
import { Compass, GraduationCap } from "@phosphor-icons/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { useI18n } from "../lib/i18n.tsx";
import { catalog, learning } from "../lib/rpc.ts";
import { comparePaces, finishDate } from "./Forecast.tsx";
import { Button, Card, ErrorNote } from "./ui.tsx";

/** useCourseTitle names a course by id from the catalog. */
function useCourseTitle() {
  const { tx } = useI18n();
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  return (id: string) => tx(courses.data?.courses.find((c) => c.id === id)?.title) || id;
}

/** useCourseChoice chooses or keeps a course for the learner, or for a learner the caller is a guardian of. */
function useCourseChoice(learnerId?: string) {
  const qc = useQueryClient();
  const done = () => qc.invalidateQueries();
  const choose = useMutation({
    mutationFn: (courseId: string) => learning.chooseCourse({ courseId, learnerId: learnerId ?? "" }),
    onSuccess: done,
  });
  const keep = useMutation({
    mutationFn: (courseId: string) => learning.keepCourse({ courseId, learnerId: learnerId ?? "" }),
    onSuccess: done,
  });
  return { choose, keep, busy: choose.isPending || keep.isPending, failed: choose.isError || keep.isError };
}

/**
 * PlacementReport sums up a course's diagnostic: how much is known, the foundations
 * to fill in, when the course may be finished, and the course recommended. Whoever
 * chooses the course keeps it or takes the recommended one.
 */
export function PlacementReport({ d, learnerId }: { d: GetDashboardResponse; learnerId?: string }) {
  const { m, locale } = useI18n();
  const title = useCourseTitle();
  const { choose, keep, busy, failed } = useCourseChoice(learnerId);
  const r = d.report;
  if (!r) return null;
  const advice = r.recommended ? (r.earlier ? m.reportEarlier : m.reportLater)(title(r.recommended)) : m.reportStay;
  return (
    <Card className="space-y-4 border-accent/40">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Compass size={22} weight="duotone" className="text-accent" /> {m.reportTitle}
      </h2>
      <div className="space-y-1 text-sm">
        <p>{m.reportPlaced(r.placed, r.total)}</p>
        {r.foundations > 0 && <p className="text-muted">{m.reportFoundations(r.foundations)}</p>}
      </div>
      {d.remainingXp > 0 && (
        <div className="space-y-1 text-sm">
          <p className="text-muted">{m.reportFinish}</p>
          <table className="w-full max-w-sm">
            <tbody>
              {comparePaces.map((p) => (
                <tr key={p}>
                  <td className="py-0.5">{m.forecastRow(p)}</td>
                  <td className="text-right text-muted">{finishDate(d.remainingXp, p, locale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      <p className="font-medium">{advice}</p>
      {failed && <ErrorNote message={m.error} />}
      {d.canDecide ? (
        <div className="flex flex-wrap gap-3">
          {r.recommended && (
            <Button onClick={() => choose.mutate(r.recommended)} disabled={busy}>
              {m.reportSwitch(title(r.recommended))}
            </Button>
          )}
          <Button variant={r.recommended ? "secondary" : "primary"} onClick={() => keep.mutate(d.courseId)} disabled={busy}>
            {r.recommended ? m.reportKeep : m.reportOk}
          </Button>
        </div>
      ) : (
        <p className="text-sm text-muted">{m.reportAskGuardian}</p>
      )}
    </Card>
  );
}

/**
 * StartEarlier offers, while a course's diagnostic is due and the course needs more topics of earlier courses than its
 * own, to start with the course it builds on instead (docs/learning-engine.md §9).
 */
export function StartEarlier({ d, learnerId }: { d: GetDashboardResponse; learnerId?: string }) {
  const { m } = useI18n();
  const title = useCourseTitle();
  const { choose, busy, failed } = useCourseChoice(learnerId);
  if (!d.startEarlier || d.active) return null;
  return (
    <Card className="space-y-3 border-accent/40">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <Compass size={22} weight="duotone" className="text-accent" /> {m.earlierTitle}
      </h2>
      <p className="text-sm">{m.earlierBody(d.foundations, title(d.startEarlier))}</p>
      {failed && <ErrorNote message={m.error} />}
      {d.canDecide ? (
        <Button variant="secondary" onClick={() => choose.mutate(d.startEarlier)} disabled={busy}>
          {m.earlierSwitch(title(d.startEarlier))}
        </Button>
      ) : (
        <p className="text-sm text-muted">{m.earlierAskGuardian}</p>
      )}
    </Card>
  );
}

/** CourseDone congratulates on a finished course and offers the courses that follow it. */
export function CourseDone({ d, learnerId }: { d: GetDashboardResponse; learnerId?: string }) {
  const { m } = useI18n();
  const title = useCourseTitle();
  const { choose, busy, failed } = useCourseChoice(learnerId);
  if (!d.finished) return null;
  return (
    <Card className="space-y-3 border-good/40 bg-good-soft">
      <h2 className="flex items-center gap-2 text-lg font-semibold">
        <GraduationCap size={22} weight="duotone" className="text-good" /> {m.courseDone}
      </h2>
      {d.nextCourses.length > 0 && <p className="text-sm">{m.courseDoneBody}</p>}
      {failed && <ErrorNote message={m.error} />}
      {d.nextCourses.length > 0 &&
        (d.canDecide ? (
          <div className="flex flex-wrap gap-3">
            {d.nextCourses.map((id, i) => (
              <Button key={id} variant={i === 0 ? "primary" : "secondary"} onClick={() => choose.mutate(id)} disabled={busy}>
                {title(id)}
              </Button>
            ))}
          </div>
        ) : (
          <p className="text-sm text-muted">{m.courseDoneAsk}</p>
        ))}
    </Card>
  );
}
