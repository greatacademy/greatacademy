import { ArrowLeft } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { LoadError, NotFoundNote } from "../../../components/LoadError.tsx";
import { TopicLegend, TopicMap } from "../../../components/TopicMap.tsx";
import { buttonClass, Spinner } from "../../../components/ui.tsx";
import { useEnrollFirst, useRequireSession } from "../../../lib/hooks.ts";
import { useI18n } from "../../../lib/i18n.tsx";
import { catalog, learning } from "../../../lib/rpc.ts";

export const Route = createFileRoute("/learn/$courseId/progress")({ component: Progress });

function Progress() {
  const { courseId } = Route.useParams();
  const { m, tx } = useI18n();
  const session = useRequireSession();
  const course = useQuery({ queryKey: ["course", courseId], queryFn: () => catalog.getCourse({ courseId }) });
  const progress = useQuery({
    queryKey: ["progress", courseId],
    queryFn: () => learning.getCourseProgress({ courseId }),
    enabled: !!session,
    staleTime: 0,
  });

  const notEnrolled = useEnrollFirst(courseId, progress.error);

  if (!session || course.isPending || progress.isPending || notEnrolled) return <Spinner label={m.loading} />;
  if (course.isError) return <LoadError error={course.error} onRetry={() => course.refetch()} />;
  if (progress.isError) return <LoadError error={progress.error} onRetry={() => progress.refetch()} />;
  if (!course.data.course) return <NotFoundNote />;

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/learn/$courseId" params={{ courseId }} className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {m.dashboard}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {m.progress} · {tx(course.data.course.title)}
        </h1>
        <TopicLegend />
      </div>
      <TopicMap course={course.data.course} topics={progress.data.topics} courseId={courseId} />
    </div>
  );
}
