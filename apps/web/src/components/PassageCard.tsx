import type { Passage } from "@ga/proto/learning/v1/learning_pb";

import { useI18n } from "../lib/i18n.tsx";
import { Illustration } from "./Illustration.tsx";
import { Card } from "./ui.tsx";

/** PassageCard shows a passage to read: its cover, its recording and its paragraphs. */
export function PassageCard({ passage }: { passage: Passage }) {
  const { m, tx } = useI18n();
  return (
    <Card className="space-y-4">
      <Illustration path={passage.illustration} className="mx-auto w-full max-w-md" />
      {passage.audio && (
        <div className="space-y-1">
          {/* biome-ignore lint/a11y/useMediaCaption: the passage's text, shown below, is the recording's transcript */}
          <audio controls preload="none" src={`/${passage.audio}.mp3`} aria-label={m.listen} className="w-full" />
          {passage.accent && <p className="text-sm text-muted">{tx(passage.accent)}</p>}
        </div>
      )}
      {passage.body.split(/\n\s*\n/).map((paragraph) => (
        <p key={paragraph} className="text-lg leading-relaxed">
          {paragraph}
        </p>
      ))}
    </Card>
  );
}
