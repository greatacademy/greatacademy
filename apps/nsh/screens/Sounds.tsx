import type { Sound } from "@ga/proto/learning/v1/learning_pb";
import { AudioPlayer, cleanup, signal, Text, View } from "nsh";

import { m } from "../lib/i18n.ts";
import { API_URL } from "../lib/rpc.ts";
import { colors, Quiet } from "../lib/ui.tsx";

/**
 * Sounds shows the recordings of a solution as buttons, each with what it says: a word, a sentence or the sounds of a
 * word. A recording loads only when it is first played; playing one stops the one before, and all stop when the view goes.
 */
export function Sounds(props: { sounds: readonly Sound[] }) {
  let player: AudioPlayer | undefined;
  const playing = signal<number | undefined>(undefined);
  const failed = signal(false);
  const stop = () => {
    player?.pause();
    player = undefined;
  };
  cleanup(stop);
  const play = (i: number, sound: Sound) => {
    stop();
    const p = new AudioPlayer(`${API_URL}/${sound.audio}.mp3`);
    player = p;
    failed.set(false);
    playing.set(i);
    p.on("end", () => {
      if (player === p) playing.set(undefined);
    });
    p.on("error", () => {
      if (player !== p) return;
      playing.set(undefined);
      failed.set(true);
    });
    p.play().catch(() => {
      if (player !== p) return;
      playing.set(undefined);
      failed.set(true);
    });
  };
  const toggle = (i: number) => {
    const sound = props.sounds[i];
    if (playing() === i || !sound) {
      stop();
      playing.set(undefined);
    } else play(i, sound);
  };
  return (
    <If when={props.sounds.length > 0}>
      <View style={{ gap: 4 }}>
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 8 }}>
          <Each of={props.sounds.map((_, i) => i)}>
            {(i) => <Quiet label={`${playing() === i() ? "■" : "▶"} ${props.sounds[i()]?.text ?? ""}`} onPress={() => toggle(i())} />}
          </Each>
        </View>
        <If when={failed()}>
          <Text style={{ color: colors().bad, fontSize: 14 }}>{m().listenFailed}</Text>
        </If>
      </View>
    </If>
  );
}
