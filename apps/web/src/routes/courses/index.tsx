import { createFileRoute } from "@tanstack/react-router";

import { CourseCatalog } from "../../components/CourseCatalog.tsx";
import { useI18n } from "../../lib/i18n.tsx";

export const Route = createFileRoute("/courses/")({ component: Courses });

function Courses() {
  const { m } = useI18n();
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h1 className="text-2xl font-semibold tracking-tight">{m.courses}</h1>
        <p className="max-w-2xl text-muted">{m.coursesIntro}</p>
      </div>
      <CourseCatalog />
    </div>
  );
}
