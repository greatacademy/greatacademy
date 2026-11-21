import type { TopicLink } from "@ga/proto/learning/v1/learning_pb";
import { ArrowLeft } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { LessonStep } from "../../../components/LessonStep.tsx";
import { LoadError } from "../../../components/LoadError.tsx";
import { Markdown } from "../../../components/Markdown.tsx";
import { Button, buttonClass, Card, Spinner } from "../../../components/ui.tsx";
import { useI18n } from "../../../lib/i18n.tsx";
import { learning } from "../../../lib/rpc.ts";
import { useSubjectPlace } from "../../../lib/subject.tsx";
import { statusStyle } from "../../../lib/topic-status.ts";

export const Route = createFileRoute("/$subject/topics/$topicId")({ component: Topic });

function Links({ title, subject, topics }: { title: string; subject: string; topics: readonly TopicLink[] }) {
  const { m, tx } = useI18n();
  if (topics.length === 0) return null;
  return (
    <Card className="space-y-3">
      <h2 className="font-semibold">{title}</h2>
      <div className="grid gap-2 sm:grid-cols-2">
        {topics.map((t) => {
          const s = statusStyle[t.status];
          return (
            <Link
              key={t.topicId}
              to="/$subject/topics/$topicId"
              params={{ subject, topicId: t.topicId }}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition hover:border-accent/50"
            >
              <span className={`size-2.5 shrink-0 rounded-full ${s.dot}`} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                <Markdown source={tx(t.title)} inline />
              </span>
              <span title={m.statusNote[s.key]} className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.chip}`}>
                {m.status[s.key]}
              </span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function Topic() {
  const { subject, topicId } = Route.useParams();
  const courseId = useSubjectPlace()?.enrollment?.courseId ?? "";
  const { m, tx } = useI18n();
  const [exampleSeed, setExampleSeed] = useState(0);
  const topic = useQuery({
    queryKey: ["topic", courseId, topicId, exampleSeed],
    queryFn: () => learning.getTopic({ courseId, topicId, exampleSeed }),
    enabled: !!courseId,
  });

  if (topic.isPending) return <Spinner label={m.loading} />;
  if (topic.isError) return <LoadError error={topic.error} onRetry={() => topic.refetch()} />;
  const s = statusStyle[topic.data.status];
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/$subject/progress" params={{ subject }} className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {m.navProgress}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            <Markdown source={tx(topic.data.title)} inline />
          </h1>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${s.chip}`}>{m.status[s.key]}</span>
          {/* The topic's own page says what its status means, for a phone that cannot hover. */}
          <span className="text-xs text-muted">{m.statusNote[s.key]}</span>
        </div>
        <Markdown source={tx(topic.data.summary)} className="text-muted" />
      </div>
      <Links title={m.buildsOn} subject={subject} topics={topic.data.prerequisites} />
      {topic.data.knowledgePoints.map((step) => (
        <LessonStep key={`${exampleSeed}-${step.index}`} step={step} />
      ))}
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setExampleSeed((n) => n + 1)}>
          {m.otherExamples}
        </Button>
      </div>
      <Links title={m.leadsTo} subject={subject} topics={topic.data.dependents} />
    </div>
  );
}
