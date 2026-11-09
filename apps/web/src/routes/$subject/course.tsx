import { ArrowSquareOut } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";

import { ChooseCourse } from "../../components/ChooseCourse.tsx";
import { Markdown } from "../../components/Markdown.tsx";
import { DecidedBy, StartOverCard } from "../../components/SubjectDecisions.tsx";
import { Bar, Button, Card } from "../../components/ui.tsx";
import { useI18n } from "../../lib/i18n.tsx";
import { learning, timeZone } from "../../lib/rpc.ts";
import { useCatalog, useProfile, useSubjectPlace } from "../../lib/subject.tsx";

export const Route = createFileRoute("/$subject/course")({ component: CoursePage });

/**
 * CoursePage is what is being learned in the subject: the current course, and the decisions to change it or to start
 * the subject over.
 */
function CoursePage() {
  const { subject } = Route.useParams();
  const place = useSubjectPlace();
  const { m, tx } = useI18n();
  const navigate = useNavigate();
  const list = useCatalog();
  const profile = useProfile();
  const [changing, setChanging] = useState(false);
  const enrollment = place?.enrollment;
  const dash = useQuery({
    queryKey: ["dashboard", enrollment?.courseId],
    queryFn: () => learning.getDashboard({ courseId: enrollment?.courseId ?? "", timeZone: timeZone() }),
    enabled: !!enrollment,
    staleTime: 0,
  });
  const course = list.data?.courses.find((c) => c.id === enrollment?.courseId);
  const canDecide = profile.data?.canDecide ?? false;
  const stats = enrollment?.stats;
  const share = stats?.total ? stats.learned / stats.total : 0;
  if (!enrollment || !course) return null;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold tracking-tight">{m.navCourse}</h1>
      <Card className="space-y-4">
        <div className="space-y-1">
          <div className="text-sm text-muted">{m.currentCourse}</div>
          <h2 className="text-xl font-semibold">{tx(course.title)}</h2>
        </div>
        <Markdown source={tx(course.description)} className="text-sm text-muted" />
        <div className="flex max-w-md items-center gap-3 text-sm text-muted">
          <Bar value={share} className="bg-subject" />
          <span className="shrink-0">
            {stats?.learned ?? 0} / {stats?.total ?? 0} {m.topics}
          </span>
        </div>
        <Link to="/courses/$courseId" params={{ courseId: course.id }} className="inline-flex items-center gap-1.5 text-sm text-accent">
          {m.courseOutline} <ArrowSquareOut size={14} />
        </Link>
      </Card>

      <section className="space-y-3">
        <h2 className="text-lg font-semibold">{m.changeCourse}</h2>
        <p className="max-w-2xl text-sm text-muted">{m.changeCourseWhen}</p>
        {!canDecide ? (
          <DecidedBy />
        ) : changing ? (
          <div className="space-y-3">
            <Button variant="ghost" className="-ml-4" onClick={() => setChanging(false)}>
              {m.cancel}
            </Button>
            <ChooseCourse
              subject={subject}
              current={course.id}
              onChosen={() => {
                setChanging(false);
                void navigate({ to: "/$subject", params: { subject } });
              }}
            />
          </div>
        ) : (
          <Button variant="secondary" onClick={() => setChanging(true)}>
            {m.changeCourse}
          </Button>
        )}
      </section>

      {!changing && dash.data && (
        <div className="max-w-2xl">
          <StartOverCard d={dash.data} />
        </div>
      )}
    </div>
  );
}
