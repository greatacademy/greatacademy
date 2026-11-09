import { effect, platform, reduceMotion, signal, untracked, windowSize } from "nsh";
import { titleBar } from "nsh/desktop";

import { sidebarCollapsed } from "./prefs.ts";

/** SIDEBAR_WIDE and SIDEBAR_NARROW are a desktop sidebar's widths in full and with only its icons, in points. */
export const SIDEBAR_WIDE = 208;
export const SIDEBAR_NARROW = 64;

/** HEADER_HEIGHT is the height of a desktop page's header, which on macOS is the window's title bar too. */
export const HEADER_HEIGHT = 52;

/** sidebarShown tells whether the window shows the sidebar now (the app sets it). */
export const sidebarShown = signal(false);

/** sidebarRoomy tells whether the window is wide enough for the sidebar in full, and so for its collapse button. */
export const sidebarRoomy = (): boolean => windowSize().width >= 760;

/** sidebarWide tells whether the sidebar should show in full: the window is roomy and the learner has not collapsed it. */
export const sidebarWide = (): boolean => sidebarRoomy() && !sidebarCollapsed();

/**
 * sidebarWidth is the sidebar's width now. It moves to a new width over 200 ms a frame at a time (at once the first
 * time and while the system asks for less motion); each frame lays the window out again, so the pages beside the
 * sidebar move with it in step.
 */
export const sidebarWidth = signal(SIDEBAR_WIDE);
let first = true;
effect(() => {
  const to = sidebarWide() ? SIDEBAR_WIDE : SIDEBAR_NARROW;
  const from = untracked(sidebarWidth);
  if (first || from === to || untracked(reduceMotion)) {
    first = false;
    sidebarWidth.set(to);
    return;
  }
  let start: number | undefined;
  let frame = requestAnimationFrame(function step(time) {
    start ??= time;
    const t = Math.min(1, (time - start) / 200);
    const eased = t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2;
    sidebarWidth.set(Math.round(from + (to - from) * eased));
    if (t < 1) frame = requestAnimationFrame(step);
  });
  return () => cancelAnimationFrame(frame);
});

/** windowControls is the width the system's window controls take at the window's top left (macOS's traffic lights), or 0. */
export function windowControls(): number {
  return platform.desktop ? titleBar().left : 0;
}

/**
 * sidebarToggleLeft is where the collapse button stands, from the window's left edge: at the sidebar's right end in
 * full, and right of the window controls (or centered over the icons) when collapsed, moving with the sidebar.
 */
export function sidebarToggleLeft(): number {
  const controls = windowControls();
  return Math.max(controls > 0 ? controls + 4 : 16, sidebarWidth() - 48);
}

/** headerInset is how far a page's header keeps its content right of its left edge, clear of the window controls and the collapse button over it. */
export function headerInset(): number {
  const edge = sidebarShown() ? sidebarWidth() : 0;
  const covered = sidebarShown() && sidebarRoomy() ? sidebarToggleLeft() + 32 : windowControls();
  return Math.max(0, covered - edge);
}
