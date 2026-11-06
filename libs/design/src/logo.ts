/**
 * LOGO is the mark of Great Academy: a white G on a burgundy shield. Its colors
 * are fixed and never follow a palette, so the mark reads the same everywhere.
 * On a dark background the shield takes a thin outline, which keeps its edge
 * from sinking into the page. Paths are in a square of LOGO.viewBox.
 */
export const LOGO = {
  viewBox: "0 0 64 64",
  shield: "M9 6H55V33C55 47 45 55 32 60C19 55 9 47 9 33Z",
  letter: "M41.29 22.64A12.5 12.5 0 1 0 44.5 31H33",
  letterWidth: 6.5,
  shieldColor: "#8a1f3f",
  letterColor: "#ffffff",
  outlineColor: "#d98aa0",
} as const;
