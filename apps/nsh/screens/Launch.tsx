import { effect, Image, signal, View } from "nsh";

import logo from "../assets/logo.svg";
import { nav } from "../lib/nav.ts";
import { colors } from "../lib/ui.tsx";

/** LAUNCH_LIMIT is the longest the mark waits for the first page, in milliseconds. */
const LAUNCH_LIMIT = 2000;

/** LEAVE_FOR is how long the mark takes to grow and fade into the page, in milliseconds. */
const LEAVE_FOR = 400;

/** firstPageReady says the Learn tab has its first answer, so the home page can be drawn without placeholders. */
export const firstPageReady = signal(false);

/** launchLeaving says the mark has started to leave: the pages under it may show their bars. */
export const launchLeaving = signal(false);

/**
 * Launch covers the app with its mark from the start until the first page can be drawn whole, or for at most
 * LAUNCH_LIMIT, then the mark grows as it fades into the page.
 */
export function Launch() {
  const gone = signal(false);
  let left = false;
  const leave = () => {
    if (left) return;
    left = true;
    launchLeaving.set(true);
    setTimeout(() => gone.set(true), LEAVE_FOR);
  };
  setTimeout(leave, LAUNCH_LIMIT);
  effect(() => {
    const top = nav.routes().at(-1)?.name ?? "launch";
    if (top === "launch") return;
    // Home waits for its first tab's answer; the other first pages need nothing from the server.
    if (top !== "home" || firstPageReady()) leave();
  });
  return (
    <If when={!gone()}>
      <View
        style={{
          alignItems: "center",
          backgroundColor: colors().page,
          bottom: 0,
          justifyContent: "center",
          left: 0,
          opacity: launchLeaving() ? 0 : 1,
          pointerEvents: launchLeaving() ? "none" : "auto",
          position: "absolute",
          right: 0,
          top: 0,
          transitionDuration: LEAVE_FOR,
          transitionProperty: "opacity",
          transitionTimingFunction: "ease-in",
        }}
      >
        <Image
          src={logo}
          accessibilityLabel="Great Academy"
          style={{
            height: 96,
            scale: launchLeaving() ? 1.6 : 1,
            transitionDuration: LEAVE_FOR,
            transitionProperty: "scale",
            transitionTimingFunction: "ease-in",
            width: 96,
          }}
        />
      </View>
    </If>
  );
}
