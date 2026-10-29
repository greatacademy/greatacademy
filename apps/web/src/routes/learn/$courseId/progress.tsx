import { TopicStatus } from "@ga/proto/learning/v1/learning_pb";
import { ArrowLeft } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { Markdown } from "../../../components/Markdown.tsx";
import { buttonClass, Card, ErrorNote, Spinner } from "../../../components/ui.tsx";
import { useRequireSession } from "../../../lib/hooks.ts";
import { type Messages, useI18n } from "../../../lib/i18n.tsx";
import { catalog, learning } from "../../../lib/rpc.ts";

export const Route = createFileRoute("/learn/$courseId/progress")({ component: Progress });

const statusStyle: Record<TopicStatus, { key: keyof Messages["status"]; dot: string; chip: string }> = {
  [TopicStatus.UNSPECIFIED]: { key: "locked", dot: "bg-line", chip: "bg-page text-muted" },
  [TopicStatus.LOCKED]: { key: "locked", dot: "bg-line", chip: "bg-page text-muted" },
  [TopicStatus.AVAILABLE]: { key: "available", dot: "bg-accent", chip: "bg-accent-soft text-accent" },
  [TopicStatus.FAILED]: { key: "failed", dot: "bg-bad", chip: "bg-bad-soft text-bad" },
  [TopicStatus.LEARNED]: { key: "learned", dot: "bg-good", chip: "bg-good-soft text-good" },
  [TopicStatus.DUE]: { key: "due", dot: "bg-warn", chip: "bg-warn-soft text-warn" },
  [TopicStatus.ASSUMED]: { key: "assumed", dot: "bg-muted", chip: "bg-page text-muted" },
};

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

  if (!session || course.isPending || progress.isPending) return <Spinner label={m.loading} />;
  if (course.isError || progress.isError || !course.data.course) return <ErrorNote message={m.error} />;
  const byTopic = new Map(progress.data.topics.map((t) => [t.topicId, t]));
  const legend = [TopicStatus.LEARNED, TopicStatus.DUE, TopicStatus.AVAILABLE, TopicStatus.FAILED, TopicStatus.LOCKED];

  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/learn/$courseId" params={{ courseId }} className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {m.dashboard}
        </Link>
        <h1 className="text-2xl font-semibold tracking-tight">
          {m.progress} · {tx(course.data.course.title)}
        </h1>
        <div className="flex flex-wrap gap-3 text-xs">
          {legend.map((s) => (
            <span key={s} className="flex items-center gap-1.5 text-muted">
              <span className={`size-2.5 rounded-full ${statusStyle[s].dot}`} />
              {m.status[statusStyle[s].key]}
            </span>
          ))}
        </div>
      </div>
      {course.data.course.units.map((u) => (
        <Card key={tx(u.title)} className="space-y-4">
          <h2 className="font-semibold">{tx(u.title)}</h2>
          {u.modules.map((mod) => (
            <div key={tx(mod.title)} className="space-y-2">
              <h3 className="text-sm text-muted">{tx(mod.title)}</h3>
              <div className="grid gap-2 sm:grid-cols-2">
                {mod.topics.map((t) => {
                  const p = byTopic.get(t.id);
                  const s = statusStyle[p?.status ?? TopicStatus.LOCKED];
                  const learned = p?.status === TopicStatus.LEARNED || p?.status === TopicStatus.DUE;
                  return (
                    <div key={t.id} className="flex items-center gap-3 rounded-xl border border-line px-3 py-2.5">
                      <span className={`size-2.5 shrink-0 rounded-full ${s.dot}`} />
                      <div className="min-w-0 flex-1">
                        <div className="truncate text-sm font-medium">
                          <Markdown source={tx(t.title)} inline />
                        </div>
                        {learned && (
                          <div className="mt-1 flex items-center gap-2" title={`${m.memory} ${Math.round(p.memory * 100)}%`}>
                            <div className="h-1 flex-1 overflow-hidden rounded-full bg-line">
                              <div
                                className={`h-full rounded-full ${p.status === TopicStatus.DUE ? "bg-warn" : "bg-good"}`}
                                style={{ width: `${Math.round(p.memory * 100)}%` }}
                              />
                            </div>
                            <span className="w-8 text-right text-[10px] text-muted">{Math.round(p.memory * 100)}%</span>
                          </div>
                        )}
                      </div>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium ${s.chip}`}>{m.status[s.key]}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </Card>
      ))}
    </div>
  );
}
