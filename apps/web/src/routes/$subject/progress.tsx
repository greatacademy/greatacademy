import { ClockCounterClockwise } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { CourseSequence, useCourseSequence } from "../../components/CourseSequence.tsx";
import { LoadError, NotFoundNote } from "../../components/LoadError.tsx";
import { usePromotion } from "../../components/PlacementReport.tsx";
import { ForecastCard, GoalsCard } from "../../components/SubjectDecisions.tsx";
import { TopicGraphButton } from "../../components/TopicGraph.tsx";
import { legendCounts, TopicLegend, TopicMap } from "../../components/TopicMap.tsx";
import { buttonClass, Spinner } from "../../components/ui.tsx";
import { useI18n } from "../../lib/i18n.tsx";
import { catalog, learning, timeZone } from "../../lib/rpc.ts";
import { useSubjectPlace } from "../../lib/subject.tsx";

export const Route = createFileRoute("/$subject/progress")({ component: Progress });

/**
 * Progress is how far the learner is in the subject's current course: its map, goals, forecast and end date, with the
 * course sequence to look at the courses taken before and those that follow on the same map.
 */
function Progress() {
  const place = useSubjectPlace();
  const courseId = place?.enrollment?.courseId ?? "";
  const subject = place?.subject.id ?? "";
  const { m, tx } = useI18n();
  // The map shows the current course, or another of the course sequence the learner picks.
  const [picked, setPicked] = useState<string>();
  const sequence = useCourseSequence(courseId);
  const viewed = picked && sequence.data?.courses.some((c) => c.courseId === picked) ? picked : courseId;
  const course = useQuery({ queryKey: ["course", viewed], queryFn: () => catalog.getCourse({ courseId: viewed }), enabled: !!viewed });
  const progress = useQuery({
    queryKey: ["progress", viewed],
    queryFn: () => learning.getCourseProgress({ courseId: viewed }),
    enabled: !!viewed,
    staleTime: 0,
  });
  const dash = useQuery({
    queryKey: ["dashboard", courseId],
    queryFn: () => learning.getDashboard({ courseId, timeZone: timeZone() }),
    enabled: !!courseId,
    staleTime: 0,
  });
  const moved = usePromotion(dash.data, courseId);

  if (course.isPending || progress.isPending || dash.isPending || moved) return <Spinner label={m.loading} />;
  if (course.isError) return <LoadError error={course.error} onRetry={() => course.refetch()} />;
  if (progress.isError) return <LoadError error={progress.error} onRetry={() => progress.refetch()} />;
  if (dash.isError) return <LoadError error={dash.error} onRetry={() => dash.refetch()} />;
  if (!course.data.course) return <NotFoundNote />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <h1 className="text-2xl font-semibold tracking-tight">{tx(course.data.course.title)}</h1>
        <Link to="/$subject/history" params={{ subject }} className={buttonClass("ghost")}>
          <ClockCounterClockwise size={18} /> {m.history}
        </Link>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0 space-y-3">
          {(sequence.data?.courses.length ?? 0) > 1 && (
            <section className="space-y-2 pb-3">
              <h2 className="text-sm text-muted" title={m.sequence.note}>
                {m.sequence.label}
              </h2>
              <CourseSequence courses={sequence.data?.courses ?? []} currentId={courseId} selected={viewed} onSelect={setPicked} />
            </section>
          )}
          <TopicLegend counts={legendCounts(progress.data.topics)} />
          <TopicGraphButton courseId={viewed} />
          {/* A topic's page speaks of the current course, so only its map links to them. */}
          <TopicMap course={course.data.course} topics={progress.data.topics} subject={viewed === courseId ? subject : undefined} />
        </section>
        <aside className="grid gap-4 max-lg:order-first sm:grid-cols-2 lg:grid-cols-1">
          <GoalsCard d={dash.data} />
          <ForecastCard d={dash.data} />
        </aside>
      </div>
    </div>
  );
}
