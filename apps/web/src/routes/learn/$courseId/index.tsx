import { createFileRoute } from "@tanstack/react-router";

import { LearnDashboard } from "../../../components/LearnDashboard.tsx";

export const Route = createFileRoute("/learn/$courseId/")({ component: Page });

function Page() {
  const { courseId } = Route.useParams();
  return <LearnDashboard courseId={courseId} />;
}
