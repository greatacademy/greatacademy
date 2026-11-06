import { describe, expect, it } from "vitest";

import {
  type Appearance,
  DEFAULT_APPEARANCE,
  parseAppearance,
  resolveColorScheme,
  resolveReducedMotion,
  serializeAppearance,
} from "./appearance.ts";

describe("appearance storage", () => {
  it("round-trips a choice and stores nothing for the defaults", () => {
    const chosen: Appearance = { theme: "dark", palette: "paper", text: "large", motion: "reduced" };
    expect(parseAppearance(serializeAppearance(chosen))).toEqual(chosen);
    expect(serializeAppearance(DEFAULT_APPEARANCE)).toBe("");
  });

  it("takes the default for whatever is missing or invalid", () => {
    expect(parseAppearance(null)).toEqual(DEFAULT_APPEARANCE);
    expect(parseAppearance("theme=neon&size=9&text=small&motion")).toEqual({ ...DEFAULT_APPEARANCE, text: "small" });
  });
});

describe("resolving against the device", () => {
  it("follows the device only when asked to", () => {
    expect(resolveColorScheme("system", "dark")).toBe("dark");
    expect(resolveColorScheme("light", "dark")).toBe("light");
    expect(resolveReducedMotion("system", true)).toBe(true);
    expect(resolveReducedMotion("full", true)).toBe(false);
    expect(resolveReducedMotion("reduced", false)).toBe(true);
  });
});
