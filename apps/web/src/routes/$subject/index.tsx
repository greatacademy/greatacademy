import { createFileRoute } from "@tanstack/react-router";

import { LearnDashboard } from "../../components/LearnDashboard.tsx";
import { useSubjectPlace } from "../../lib/subject.tsx";

export const Route = createFileRoute("/$subject/")({ component: Learn });

/** Learn is what to do now in the subject's current course. */
function Learn() {
  const place = useSubjectPlace();
  if (!place?.enrollment) return null;
  return <LearnDashboard courseId={place.enrollment.courseId} subjectId={place.subject.id} />;
}
