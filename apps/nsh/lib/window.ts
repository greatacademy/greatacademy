import { platform } from "nsh";
import { Window } from "nsh/desktop";

import { HEADER_HEIGHT } from "./chrome.ts";

/** MIN_WINDOW is the smallest window on a desktop, in points: the width of a large phone, tall enough for a question and its answer. */
export const MIN_WINDOW = { width: 420, height: 600 };

/**
 * keepWindowLarge gives the main window its least size on desktops, and on macOS hides its title bar, whose row the
 * sidebar and the pages' headers draw, the traffic lights centered in it; phones and tablets have no such window.
 */
export function keepWindowLarge(): void {
  Window.get("main")?.set({
    minSize: MIN_WINDOW,
    ...(platform.os === "macos" ? { titleBar: { style: "hidden", height: HEADER_HEIGHT } } : {}),
  });
}
