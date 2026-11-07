import { effect, platform, windowSize } from "nsh";
import { Window } from "nsh/desktop";

/** MIN_WINDOW is the smallest window on a desktop, in points: the width of a large phone, tall enough for a question and its answer. */
export const MIN_WINDOW = { width: 420, height: 600 };

/**
 * keepWindowLarge returns a desktop window to MIN_WINDOW when it is made smaller.
 * Native Shell has no minimum size for the window of a TSX app, so the window
 * moves back once the drag has passed the limit. Phones and tablets have no such window.
 */
export function keepWindowLarge(): void {
  if (platform.os !== "macos" && platform.os !== "windows" && platform.os !== "linux") return;
  effect(() => {
    const { width, height } = windowSize();
    if (width >= MIN_WINDOW.width && height >= MIN_WINDOW.height) return;
    Window.setFrame({ size: { width: Math.max(width, MIN_WINDOW.width), height: Math.max(height, MIN_WINDOW.height) } });
  });
}
