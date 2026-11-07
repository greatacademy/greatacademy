import { Window } from "nsh/desktop";

/** MIN_WINDOW is the smallest window on a desktop, in points: the width of a large phone, tall enough for a question and its answer. */
export const MIN_WINDOW = { width: 420, height: 600 };

/** keepWindowLarge gives the main window its least size on desktops; phones and tablets have no such window. */
export function keepWindowLarge(): void {
  Window.get("main")?.set({ minSize: MIN_WINDOW });
}
