import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ChooseCourse } from "../../components/ChooseCourse.tsx";
import { LoadError } from "../../components/LoadError.tsx";
import { Bar, Button, Card, Spinner } from "../../components/ui.tsx";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { catalog, learning, timeZone } from "../../lib/rpc.ts";

export const Route = createFileRoute("/settings/courses")({ component: CourseSettings });

/** CourseSettings shows the learner's current course in each subject and changes it, which a child leaves to their guardian. */
function CourseSettings() {
  const { m, tx } = useI18n();
  const session = useRequireSession();
  const navigate = useNavigate();
  const [changing, setChanging] = useState(false);
  const profile = useQuery({ queryKey: ["profile"], queryFn: () => learning.getProfile({ timeZone: timeZone() }), enabled: !!session });
  const courses = useQuery({ queryKey: ["courses"], queryFn: () => catalog.listCourses({}) });
  if (!session || profile.isPending) return <Spinner label={m.loading} />;
  if (profile.isError) return <LoadError error={profile.error} onRetry={() => profile.refetch()} />;
  const p = profile.data;
  const course = (id: string) => courses.data?.courses.find((c) => c.id === id);

  return (
    <div className="space-y-6">
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">{m.currentCourse}</h2>
        {p.enrollments.length === 0 && <p className="text-muted">{m.noCourseYet}</p>}
        {p.enrollments.map((e) => {
          const c = course(e.courseId);
          const share = e.stats?.total ? e.stats.learned / e.stats.total : 0;
          return (
            <Link key={e.courseId} to="/learn/$courseId" params={{ courseId: e.courseId }} className="block space-y-1.5">
              <div className="flex justify-between gap-3 text-sm">
                <span className="min-w-0 font-medium">
                  {c && <span className="mr-2 text-muted">{tx(c.subjectTitle)}</span>}
                  {tx(c?.title) || e.courseId}
                </span>
                <span className="shrink-0 text-muted">{Math.round(share * 100)}%</span>
              </div>
              <Bar value={share} />
            </Link>
          );
        })}
        <p className="text-sm text-muted">{p.canDecide ? m.changeCourseBody : m.guardianChooses}</p>
        {p.canDecide && !changing && <Button onClick={() => setChanging(true)}>{m.changeCourse}</Button>}
      </Card>
      {changing && (
        <div className="space-y-3">
          <div className="flex items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">{m.changeCourse}</h2>
            <Button variant="ghost" onClick={() => setChanging(false)}>
              {m.cancel}
            </Button>
          </div>
          <ChooseCourse
            current={p.enrollments[0]?.courseId}
            onChosen={(courseId) => navigate({ to: "/learn/$courseId", params: { courseId } })}
          />
        </div>
      )}
    </div>
  );
}
