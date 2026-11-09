import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";

import { ChooseCourse } from "../../components/ChooseCourse.tsx";
import { LoadError, NotFoundNote } from "../../components/LoadError.tsx";
import { Card, Spinner } from "../../components/ui.tsx";
import { useRequireSession } from "../../lib/hooks.ts";
import { useI18n } from "../../lib/i18n.tsx";
import { SubjectProvider, useCatalog, useProfile, useShowSubject } from "../../lib/subject.tsx";

export const Route = createFileRoute("/$subject")({ component: SubjectLayout });

/**
 * SubjectLayout holds the pages of one subject (docs/experience.md §3): it finds the subject and the learner's
 * current course in it, remembers the subject for the next visit, and marks the pages with its colors. A subject
 * with no course yet opens on choosing one.
 */
function SubjectLayout() {
  const { subject: id } = Route.useParams();
  const { m } = useI18n();
  const session = useRequireSession();
  const list = useCatalog();
  const profile = useProfile();
  const subject = list.data?.subjects.find((s) => s.id === id);
  useShowSubject(subject?.id);

  if (!session || list.isPending || profile.isPending) return <Spinner label={m.loading} />;
  if (list.isError) return <LoadError error={list.error} onRetry={() => list.refetch()} />;
  if (profile.isError) return <LoadError error={profile.error} onRetry={() => profile.refetch()} />;
  if (!subject) return <NotFoundNote />;
  const enrollment = profile.data.enrollments.find((e) => e.subjectId === id);
  return (
    <SubjectProvider place={{ subject, enrollment }}>
      <div data-subject={subject.id}>
        {enrollment ? <Outlet /> : <SubjectStart subjectId={subject.id} canDecide={profile.data.canDecide} />}
      </div>
    </SubjectProvider>
  );
}

/** SubjectStart is a subject with no course yet: its courses to start from, or who chooses one. */
function SubjectStart({ subjectId, canDecide }: { subjectId: string; canDecide: boolean }) {
  const { m } = useI18n();
  const navigate = useNavigate();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{m.welcomeChooseTitle}</h1>
        <p className="max-w-2xl text-muted">{canDecide ? m.welcomeChooseBody : m.guardianChooses}</p>
      </div>
      {canDecide ? (
        <ChooseCourse subject={subjectId} onChosen={() => navigate({ to: "/$subject", params: { subject: subjectId } })} />
      ) : (
        <Card className="text-muted">{m.guardianChoosesWait}</Card>
      )}
    </div>
  );
}
