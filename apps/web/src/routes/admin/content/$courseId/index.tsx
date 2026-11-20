import type { Topic } from "@ga/proto/catalog/v1/catalog_pb";
import { ArrowLeft } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { LoadError } from "../../../../components/LoadError.tsx";
import { Markdown } from "../../../../components/Markdown.tsx";
import { buttonClass, Card, Spinner } from "../../../../components/ui.tsx";
import { useAdminText } from "../../../../lib/admin-text.ts";
import { useI18n } from "../../../../lib/i18n.tsx";
import { admin } from "../../../../lib/rpc.ts";

export const Route = createFileRoute("/admin/content/$courseId/")({ component: CourseContent });

function TopicRow({ courseId, topic }: { courseId: string; topic: Topic }) {
  const { tx } = useI18n();
  const t = useAdminText();
  return (
    <Link
      to="/admin/content/$courseId/$topicId"
      params={{ courseId, topicId: topic.id }}
      className="flex min-w-0 items-baseline justify-between gap-3 rounded-lg px-3 py-2 transition hover:bg-accent-soft"
    >
      <span className="min-w-0 truncate text-sm font-medium">
        <Markdown source={tx(topic.title)} inline />
      </span>
      <span className="shrink-0 text-xs text-muted">{t.kpCount(topic.knowledgePoints)}</span>
    </Link>
  );
}

/** CourseContent is a course's whole outline, its foundations and its reading passages, each to open. */
function CourseContent() {
  const { courseId } = Route.useParams();
  const { m, tx } = useI18n();
  const t = useAdminText();
  const content = useQuery({ queryKey: ["admin", "content", courseId], queryFn: () => admin.getCourseContent({ courseId }) });
  if (content.isPending) return <Spinner label={m.loading} />;
  if (content.isError) return <LoadError error={content.error} onRetry={() => content.refetch()} />;
  const { course, foundations, passages } = content.data;
  return (
    <div className="space-y-4">
      <Link to="/admin/content" className={buttonClass("ghost", "-ml-4")}>
        <ArrowLeft size={16} /> {t.allCourses}
      </Link>
      <div className="space-y-1">
        <h2 className="flex flex-wrap items-center gap-2 text-xl font-semibold">
          <Markdown source={tx(course?.title)} inline />
          {course?.retired && <span className="rounded-full bg-warn/10 px-2 py-0.5 text-[11px] font-medium text-warn">{t.retired}</span>}
        </h2>
        <p className="text-sm text-muted">
          {courseId} · {tx(course?.subjectTitle)} · {t.topicsCount(course?.topicCount ?? 0)}
        </p>
        <Markdown source={tx(course?.description)} className="text-sm" />
      </div>
      {course?.units.map((u, ui) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: units are positional
        <Card key={ui} className="space-y-3 p-4">
          <h3 className="font-semibold">
            <Markdown source={tx(u.title)} inline />
          </h3>
          {u.modules.map((mod, mi) => (
            // biome-ignore lint/suspicious/noArrayIndexKey: modules are positional
            <div key={mi} className="space-y-1">
              {u.modules.length > 1 && (
                <h4 className="px-3 text-xs font-semibold tracking-wide text-muted uppercase">
                  <Markdown source={tx(mod.title)} inline />
                </h4>
              )}
              {mod.topics.map((topic) => (
                <TopicRow key={topic.id} courseId={courseId} topic={topic} />
              ))}
            </div>
          ))}
        </Card>
      ))}
      {passages.length > 0 && (
        <Card className="space-y-1 p-4">
          <h3 className="mb-2 font-semibold">{t.passages}</h3>
          {passages.map((p) => (
            <Link
              key={p.id}
              to="/admin/content/$courseId/passages/$passageId"
              params={{ courseId, passageId: p.id }}
              className="flex min-w-0 items-baseline justify-between gap-3 rounded-lg px-3 py-2 transition hover:bg-accent-soft"
            >
              <span className="min-w-0 truncate text-sm font-medium">{tx(p.title)}</span>
              <span className="shrink-0 text-xs text-muted">
                {t.wordsCount(p.words)} · {t.questionsCount(p.questions)}
              </span>
            </Link>
          ))}
        </Card>
      )}
      {foundations.length > 0 && (
        <details className="rounded-xl border border-line bg-surface p-4">
          <summary className="cursor-pointer font-semibold select-none">
            {t.foundations} ({foundations.length})
          </summary>
          <div className="mt-2 space-y-1">
            {foundations.map((topic) => (
              <TopicRow key={topic.id} courseId={courseId} topic={topic} />
            ))}
          </div>
        </details>
      )}
    </div>
  );
}
