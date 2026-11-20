import { ArrowLeft } from "@phosphor-icons/react";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link } from "@tanstack/react-router";

import { ContentLinks } from "../../../../../components/ContentLinks.tsx";
import { LoadError } from "../../../../../components/LoadError.tsx";
import { PassageCard } from "../../../../../components/PassageCard.tsx";
import { TryProblem } from "../../../../../components/TryProblem.tsx";
import { buttonClass, Spinner } from "../../../../../components/ui.tsx";
import { useAdminText } from "../../../../../lib/admin-text.ts";
import { useI18n } from "../../../../../lib/i18n.tsx";
import { admin } from "../../../../../lib/rpc.ts";

export const Route = createFileRoute("/admin/content/$courseId/passages/$passageId")({ component: PassageContent });

/** PassageContent shows a reading passage with every one of its questions to try. */
function PassageContent() {
  const { courseId, passageId } = Route.useParams();
  const { m, tx } = useI18n();
  const t = useAdminText();
  const passage = useQuery({
    queryKey: ["admin", "passage", courseId, passageId],
    queryFn: () => admin.previewPassage({ courseId, passageId }),
  });
  if (passage.isPending) return <Spinner label={m.loading} />;
  if (passage.isError) return <LoadError error={passage.error} onRetry={() => passage.refetch()} />;
  const d = passage.data;
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Link to="/admin/content/$courseId" params={{ courseId }} className={buttonClass("ghost", "-ml-4")}>
          <ArrowLeft size={16} /> {courseId}
        </Link>
        <h2 className="text-2xl font-semibold tracking-tight">{tx(d.passage?.title)}</h2>
        <p className="text-sm text-muted">
          {passageId} · {t.questionsCount(d.questions)}
        </p>
      </div>
      <ContentLinks title={t.readFirst} courseId={courseId} topics={d.topics} />
      {d.passage && <PassageCard passage={d.passage} />}
      {Array.from({ length: d.questions }, (_, i) => (
        // biome-ignore lint/suspicious/noArrayIndexKey: questions are numbered, and their number is what the key names
        <TryProblem key={i} courseId={courseId} topicId={passageId} kp={i} title={t.questionN(i + 1)} />
      ))}
    </div>
  );
}
