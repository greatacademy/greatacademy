import { useMutation, useQueryClient } from "@tanstack/react-query";

import { useI18n } from "../lib/i18n.tsx";
import { learning, timeZone } from "../lib/rpc.ts";
import { useProfile } from "../lib/subject.tsx";
import { Button, Card, ErrorNote } from "./ui.tsx";

/**
 * SpeakingSetting turns spoken questions on or off. Off, lessons go on
 * without them; it shows only when a speech service may hear the learner,
 * and otherwise says why speaking is not offered.
 */
export function SpeakingSetting() {
  const { m } = useI18n();
  const qc = useQueryClient();
  const profile = useProfile();
  const set = useMutation({
    mutationFn: (on: boolean) => learning.setSpeaking({ on, timeZone: timeZone() }),
    onSuccess: () => void qc.invalidateQueries(),
  });
  const p = profile.data;
  if (!p) return null;
  return (
    <Card id="speaking" className="space-y-4">
      <h2 className="text-lg font-semibold">{m.speakingSetting}</h2>
      {!p.speakingAvailable ? (
        <p className="text-sm text-muted">{m.speakingUnavailable}</p>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3">
          <p className="text-sm">{p.speaking ? m.speakingOn : p.speakingBackTomorrow ? m.speakingOffToday : m.speakingOffNote}</p>
          <Button variant="secondary" onClick={() => set.mutate(!p.speaking)} disabled={set.isPending}>
            {p.speaking ? m.turnSpeakingOff : m.turnSpeakingOn}
          </Button>
        </div>
      )}
      {set.isError && <ErrorNote message={m.error} />}
    </Card>
  );
}
