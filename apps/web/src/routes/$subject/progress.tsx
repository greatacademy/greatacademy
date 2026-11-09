import { ClockCounterClockwise } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { LoadError, NotFoundNote } from "../../components/LoadError.tsx";
import { ForecastCard, GoalsCard } from "../../components/SubjectDecisions.tsx";
import { TopicLegend, TopicMap } from "../../components/TopicMap.tsx";
import { buttonClass, Spinner } from "../../components/ui.tsx";
import { useI18n } from "../../lib/i18n.tsx";
import { catalog, learning, timeZone } from "../../lib/rpc.ts";
import { useSubjectPlace } from "../../lib/subject.tsx";

export const Route = createFileRoute("/$subject/progress")({ component: Progress });

/** Progress is how far the learner is in the subject's current course: its map, goals, forecast and end date. */
function Progress() {
  const place = useSubjectPlace();
  const courseId = place?.enrollment?.courseId ?? "";
  const subject = place?.subject.id ?? "";
  const { m, tx } = useI18n();
  const course = useQuery({ queryKey: ["course", courseId], queryFn: () => catalog.getCourse({ courseId }), enabled: !!courseId });
  const progress = useQuery({
    queryKey: ["progress", courseId],
    queryFn: () => learning.getCourseProgress({ courseId }),
    enabled: !!courseId,
    staleTime: 0,
  });
  const dash = useQuery({
    queryKey: ["dashboard", courseId],
    queryFn: () => learning.getDashboard({ courseId, timeZone: timeZone() }),
    enabled: !!courseId,
    staleTime: 0,
  });

  if (course.isPending || progress.isPending || dash.isPending) return <Spinner label={m.loading} />;
  if (course.isError) return <LoadError error={course.error} onRetry={() => course.refetch()} />;
  if (progress.isError) return <LoadError error={progress.error} onRetry={() => progress.refetch()} />;
  if (dash.isError) return <LoadError error={dash.error} onRetry={() => dash.refetch()} />;
  if (!course.data.course) return <NotFoundNote />;

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div className="space-y-1">
          <h1 className="text-2xl font-semibold tracking-tight">{m.navProgress}</h1>
          <p className="text-muted">{tx(course.data.course.title)}</p>
        </div>
        <Link to="/$subject/history" params={{ subject }} className={buttonClass("ghost")}>
          <ClockCounterClockwise size={18} /> {m.history}
        </Link>
      </div>
      <div className="grid items-start gap-6 lg:grid-cols-[minmax(0,1fr)_20rem]">
        <section className="min-w-0 space-y-3">
          <h2 className="text-lg font-semibold">{m.progress}</h2>
          <TopicLegend />
          <TopicMap course={course.data.course} topics={progress.data.topics} subject={subject} />
        </section>
        <aside className="grid gap-4 max-lg:order-first sm:grid-cols-2 lg:grid-cols-1">
          <GoalsCard d={dash.data} />
          <ForecastCard d={dash.data} />
        </aside>
      </div>
    </div>
  );
}
