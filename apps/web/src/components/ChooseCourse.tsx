import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useI18n } from "../lib/i18n.tsx";
import { learning } from "../lib/rpc.ts";
import { CourseCatalog } from "./CourseCatalog.tsx";
import { ErrorNote } from "./ui.tsx";

/**
 * ChooseCourse makes a course the current one of its subject, for the caller or
 * for a learner they are a guardian of. Progress stays with the subject, so
 * changing course loses nothing.
 */
export function ChooseCourse({
  learnerId,
  current,
  onChosen,
}: {
  learnerId?: string;
  current?: string;
  onChosen?: (courseId: string) => void;
}) {
  const { m } = useI18n();
  const qc = useQueryClient();
  const choose = useMutation({
    mutationFn: (courseId: string) => learning.chooseCourse({ courseId, learnerId: learnerId ?? "" }),
    onSuccess: async (_, courseId) => {
      await qc.invalidateQueries();
      onChosen?.(courseId);
    },
  });
  return (
    <div className="space-y-4">
      {choose.isError && <ErrorNote message={m.error} />}
      <CourseCatalog onChoose={(id) => choose.mutate(id)} current={current} busy={choose.isPending} />
    </div>
  );
}
