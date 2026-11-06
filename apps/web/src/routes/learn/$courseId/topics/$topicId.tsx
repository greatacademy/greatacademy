import type { KnowledgePointIntro, TopicLink } from "@ga/proto/learning/v1/learning_pb";
import { ArrowLeft, Lightbulb } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";

import { CaptionedFigure, Explanation, FigureView } from "../../../../components/Figure.tsx";
import { LoadError } from "../../../../components/LoadError.tsx";
import { Markdown } from "../../../../components/Markdown.tsx";
import { AnswerText, ProblemPrompt } from "../../../../components/Problem.tsx";
import { Button, buttonClass, Card, Spinner } from "../../../../components/ui.tsx";
import { useEnrollFirst, useRequireSession } from "../../../../lib/hooks.ts";
import { useI18n } from "../../../../lib/i18n.tsx";
import { learning } from "../../../../lib/rpc.ts";
import { statusStyle } from "../../../../lib/topic-status.ts";

export const Route = createFileRoute("/learn/$courseId/topics/$topicId")({ component: Topic });

function Step({ step }: { step: KnowledgePointIntro }) {
  const { m, tx } = useI18n();
  const [shown, setShown] = useState(false);
  const ex = step.example;
  return (
    <div className="space-y-4">
      <Card className="space-y-4">
        <h2 className="text-lg font-semibold">
          <Markdown source={tx(step.title)} inline />
        </h2>
        <Explanation text={tx(step.explanation)} figures={step.figures} />
        <CaptionedFigure figure={step.figure} />
      </Card>
      {ex && (
        <Card className="space-y-4 border-accent/25 bg-accent-soft/40">
          <div className="flex items-center gap-2 text-sm font-semibold text-accent">
            <Lightbulb size={18} weight="duotone" /> {m.workedExample}
          </div>
          <ProblemPrompt problem={ex.problem} />
          {shown ? (
            <div className="space-y-3 border-t border-accent/20 pt-4">
              <Markdown source={tx(ex.solution)} />
              <FigureView figure={ex.solutionFigure} />
              <div className="text-sm">
                <span className="mr-2 text-muted">{m.answer}:</span>
                <AnswerText problem={ex.problem} answer={ex.answer} />
              </div>
            </div>
          ) : (
            <Button variant="secondary" onClick={() => setShown(true)}>
              {m.showSolution}
            </Button>
          )}
        </Card>
      )}
    </div>
  );
}

function Links({ title, courseId, topics }: { title: string; courseId: string; topics: readonly TopicLink[] }) {
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
              to="/learn/$courseId/topics/$topicId"
              params={{ courseId, topicId: t.topicId }}
              className="flex min-w-0 items-center gap-3 rounded-xl border border-line px-3 py-2.5 transition hover:border-accent/50"
            >
              <span className={`size-2.5 shrink-0 rounded-full ${s.dot}`} />
              <span className="min-w-0 flex-1 truncate text-sm font-medium">
                <Markdown source={tx(t.title)} inline />
              </span>
              <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.chip}`}>{m.status[s.key]}</span>
            </Link>
          );
        })}
      </div>
    </Card>
  );
}

function Topic() {
  const { courseId, topicId } = Route.useParams();
  const { m, tx } = useI18n();
  const session = useRequireSession();
  const [exampleSeed, setExampleSeed] = useState(0);
  const topic = useQuery({
    queryKey: ["topic", courseId, topicId, exampleSeed],
    queryFn: () => learning.getTopic({ courseId, topicId, exampleSeed }),
    enabled: !!session,
  });

  const notEnrolled = useEnrollFirst(courseId, topic.error);

  if (!session || topic.isPending || notEnrolled) return <Spinner label={m.loading} />;
  if (topic.isError) return <LoadError error={topic.error} onRetry={() => topic.refetch()} />;
  const s = statusStyle[topic.data.status];
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/learn/$courseId/progress" params={{ courseId }} className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {m.progress}
        </Link>
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold tracking-tight">
            <Markdown source={tx(topic.data.title)} inline />
          </h1>
          <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${s.chip}`}>{m.status[s.key]}</span>
        </div>
        <Markdown source={tx(topic.data.summary)} className="text-muted" />
      </div>
      <Links title={m.buildsOn} courseId={courseId} topics={topic.data.prerequisites} />
      {topic.data.knowledgePoints.map((step) => (
        <Step key={`${exampleSeed}-${step.index}`} step={step} />
      ))}
      <div className="flex justify-end">
        <Button variant="secondary" onClick={() => setExampleSeed((n) => n + 1)}>
          {m.otherExamples}
        </Button>
      </div>
      <Links title={m.leadsTo} courseId={courseId} topics={topic.data.dependents} />
    </div>
  );
}
