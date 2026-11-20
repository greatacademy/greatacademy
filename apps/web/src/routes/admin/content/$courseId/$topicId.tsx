import { ArrowLeft } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { ContentLinks } from "../../../../components/ContentLinks.tsx";
import { LessonStep } from "../../../../components/LessonStep.tsx";
import { LoadError } from "../../../../components/LoadError.tsx";
import { Markdown } from "../../../../components/Markdown.tsx";
import { TryProblem } from "../../../../components/TryProblem.tsx";
import { Button, buttonClass, Spinner } from "../../../../components/ui.tsx";
import { useAdminText } from "../../../../lib/admin-text.ts";
import { useI18n } from "../../../../lib/i18n.tsx";
import { admin } from "../../../../lib/rpc.ts";

export const Route = createFileRoute("/admin/content/$courseId/$topicId")({ component: TopicContent });

/** TopicContent shows a topic as its lesson, every knowledge point with a worked example and problems to try. */
function TopicContent() {
  const { courseId, topicId } = Route.useParams();
  const { m, tx } = useI18n();
  const t = useAdminText();
  const [exampleSeed, setExampleSeed] = useState(0);
  const topic = useQuery({
    queryKey: ["admin", "topic", courseId, topicId, exampleSeed],
    queryFn: () => admin.previewTopic({ courseId, topicId, exampleSeed }),
  });
  if (topic.isPending) return <Spinner label={m.loading} />;
  if (topic.isError) return <LoadError error={topic.error} onRetry={() => topic.refetch()} />;
  const d = topic.data;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/admin/content/$courseId" params={{ courseId }} className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {courseId}
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight">
          <Markdown source={tx(d.title)} inline />
        </h2>
        <p className="text-sm text-muted">
          {d.topicId} · {d.xp} XP · {t.kpCount(d.knowledgePoints.length)}
          {d.practiceOnly && ` · ${t.practiceOnly}`}
        </p>
        <Markdown source={tx(d.summary)} className="text-muted" />
      </div>
      <ContentLinks title={t.buildsOn} courseId={courseId} topics={d.prerequisites} />
      {d.knowledgePoints.map((step) => (
        <div key={`${exampleSeed}-${step.index}`} className="space-y-4">
          <LessonStep step={step} />
          <TryProblem courseId={courseId} topicId={d.topicId} kp={step.index} title={`${t.tryIt} · ${tx(step.title)}`} />
        </div>
      ))}
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setExampleSeed((n) => n + 1)}>
          {t.otherExamples}
        </Button>
      </div>
      <ContentLinks title={t.leadsTo} courseId={courseId} topics={d.dependents} />
    </div>
  );
}
