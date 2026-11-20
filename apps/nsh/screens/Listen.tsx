import { AudioPlayer, signal, Text, View } from "nsh";

import { m } from "../lib/i18n.ts";
import { SITE_URL } from "../lib/rpc.ts";
import { colors, Quiet } from "../lib/ui.tsx";

/** clock shows seconds as m:ss. */
const clock = (seconds: number) => {
  const s = Number.isFinite(seconds) ? Math.max(0, Math.floor(seconds)) : 0;
  return `${Math.floor(s / 60)}:${String(s % 60).padStart(2, "0")}`;
};

/**
 * Listen plays a passage read aloud from the web app: a button that plays and pauses, and the time played. path is
 * the recording's path from the site's root without an extension, as the API gives it, never "". The
 * recording loads only when it is first played, and stops when the view goes. accent names the recording's accent
 * when it is not the usual one, shown beside the time; "" for none.
 */
export function Listen(props: { path: string; accent?: string }) {
  const player = new AudioPlayer(`${SITE_URL}/${props.path}.mp3`);
  const state = signal(player.state);
  const at = signal(0);
  const length = signal(Number.NaN);
  const failed = signal(false);
  player.on("load", ({ duration }) => length.set(duration));
  player.on("progress", ({ currentTime, duration }) => {
    at.set(currentTime);
    length.set(duration);
  });
  player.on("end", () => {
    state.set("ended");
    at.set(0);
  });
  player.on("error", () => {
    state.set("idle");
    failed.set(true);
  });
  const toggle = () => {
    if (state() === "playing" || state() === "loading") {
      player.pause();
      state.set("paused");
      return;
    }
    failed.set(false);
    state.set("loading");
    player.play().then(
      () => state.set("playing"),
      () => {
        state.set("idle");
        failed.set(true);
      },
    );
  };
  return (
    <View style={{ gap: 4 }}>
      <View style={{ alignItems: "center", flexDirection: "row", gap: 12 }}>
        <Quiet label={state() === "playing" || state() === "loading" ? m().pause : m().listen} onPress={toggle} />
        <Text style={{ color: colors().muted, fontSize: 14 }}>
          {Number.isFinite(length()) ? `${clock(at())} / ${clock(length())}` : ""}
        </Text>
        <If when={props.accent}>{(accent) => <Text style={{ color: colors().muted, fontSize: 14 }}>{accent()}</Text>}</If>
      </View>
      <If when={failed()}>
        <Text style={{ color: colors().bad, fontSize: 14 }}>{m().listenFailed}</Text>
      </If>
    </View>
  );
}
