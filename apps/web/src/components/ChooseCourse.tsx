import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";
import { learning } from "../lib/rpc.ts";
import { useCatalog } from "../lib/subject.tsx";
import { CourseCatalog } from "./CourseCatalog.tsx";
import { Button, Card, ErrorNote } from "./ui.tsx";

/**
 * ChooseCourse makes a course the current one of its subject, for the caller or
 * for a learner they are a guardian of. Progress stays with the subject, so
 * changing course loses nothing; replacing a current course asks first.
 */
export function ChooseCourse({
  learnerId,
  subject,
  current,
  onChosen,
}: {
  learnerId?: string;
  subject?: string;
  current?: string;
  onChosen?: (courseId: string) => void;
}) {
  const { m, tx } = useI18n();
  const qc = useQueryClient();
  const list = useCatalog();
  const [asked, setAsked] = useState<string>();
  const confirm = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (asked) confirm.current?.scrollIntoView({ block: "center", behavior: "smooth" });
  }, [asked]);
  const choose = useMutation({
    mutationFn: (courseId: string) => learning.chooseCourse({ courseId, learnerId: learnerId ?? "" }),
    onSuccess: async (_, courseId) => {
      setAsked(undefined);
      await qc.invalidateQueries();
      onChosen?.(courseId);
    },
  });
  const title = (id: string | undefined) => tx(list.data?.courses.find((c) => c.id === id)?.title);
  return (
    <div className="space-y-4">
      {choose.isError && <ErrorNote message={m.error} />}
      {asked && (
        <div ref={confirm}>
          <Card className="space-y-3 border-subject">
            <h3 className="font-semibold">{m.switchConfirmTitle(title(asked))}</h3>
            <p className="text-sm text-muted">{m.switchConfirmBody(title(current))}</p>
            <div className="flex flex-wrap gap-2">
              <Button onClick={() => choose.mutate(asked)} disabled={choose.isPending}>
                {m.switchConfirm}
              </Button>
              <Button variant="ghost" onClick={() => setAsked(undefined)}>
                {m.cancel}
              </Button>
            </div>
          </Card>
        </div>
      )}
      <CourseCatalog
        subject={subject}
        onChoose={(id) => (current ? setAsked(id) : choose.mutate(id))}
        current={current}
        busy={choose.isPending}
      />
    </div>
  );
}
