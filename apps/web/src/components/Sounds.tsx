import type { Sound } from "@ga/proto/learning/v1/learning_pb";
import { SpeakerHigh } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";

/**
 * Sounds shows the recordings of a solution as buttons, each with what it says: a word, a sentence or the sounds of a
 * word. A recording loads only when it is first played, and playing one stops any other of the row.
 */
export function Sounds({ sounds, className = "" }: { sounds: readonly Pick<Sound, "text" | "audio">[]; className?: string }) {
  const { m } = useI18n();
  const player = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<number | undefined>();
  const [failed, setFailed] = useState(false);
  useEffect(() => () => player.current?.pause(), []);
  if (sounds.length === 0) return null;
  // A problem may play one recording twice, so each key counts the times its recording came before.
  const rows = sounds.map((sound, i) => ({
    sound,
    key: `${sound.audio}-${sounds.slice(0, i).filter((s) => s.audio === sound.audio).length}`,
  }));
  const play = (i: number, sound: Pick<Sound, "text" | "audio">) => {
    player.current?.pause();
    const audio = new Audio(`/${sound.audio}.mp3`);
    player.current = audio;
    setFailed(false);
    setPlaying(i);
    audio.onended = () => setPlaying(undefined);
    audio.play().catch(() => {
      setPlaying(undefined);
      setFailed(true);
    });
  };
  return (
    <div className={className}>
      <div className="flex flex-wrap gap-2">
        {rows.map(({ sound, key }, i) => (
          <button
            key={key}
            type="button"
            onClick={() => play(i, sound)}
            aria-label={sound.text.startsWith(m.listen) ? sound.text : `${m.listen}: ${sound.text}`}
            className={`inline-flex items-center gap-1.5 rounded-full border px-3 py-1 text-sm transition-colors ${
              playing === i ? "border-accent bg-accent-soft text-accent" : "border-line hover:border-accent/50"
            }`}
          >
            <SpeakerHigh size={16} weight={playing === i ? "fill" : "regular"} aria-hidden />
            <span>{sound.text}</span>
          </button>
        ))}
      </div>
      {failed && <p className="mt-1 text-sm text-bad">{m.listenFailed}</p>}
    </div>
  );
}
