import type { Sound } from "@ga/proto/learning/v1/learning_pb";
import { SpeakerHigh } from "@phosphor-icons/react";
import { useEffect, useRef, useState } from "react";

import { useI18n } from "../lib/i18n.tsx";

/**
 * Sounds shows the recordings of a solution as buttons, each with what it says: a word, a sentence or the sounds of a
 * word. A recording loads only when it is first played, and playing one stops any other of the row.
 */
export function Sounds({ sounds, className = "" }: { sounds: readonly Sound[]; className?: string }) {
  const { m } = useI18n();
  const player = useRef<HTMLAudioElement | null>(null);
  const [playing, setPlaying] = useState<number | undefined>();
  const [failed, setFailed] = useState(false);
  useEffect(() => () => player.current?.pause(), []);
  if (sounds.length === 0) return null;
  const play = (i: number, sound: Sound) => {
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
        {sounds.map((sound, i) => (
          <button
            key={sound.audio}
            type="button"
            onClick={() => play(i, sound)}
            aria-label={`${m.listen}: ${sound.text}`}
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
