import { describe, expect, it } from "vitest";

import {
  type Appearance,
  DEFAULT_APPEARANCE,
  parseAppearance,
  parseSharedPalette,
  resolveColorScheme,
  resolveColors,
  resolveReducedMotion,
  serializeAppearance,
  sharePalette,
} from "./appearance.ts";
import { hexColors } from "./tokens.ts";

const seeds = { accent: "#aa3311", page: "#fff8ee", ink: "#221100" };

describe("appearance storage", () => {
  it("round-trips a choice and stores nothing for the defaults", () => {
    const chosen: Appearance = {
      theme: "dark",
      light: "custom",
      dark: "honey",
      contrast: "high",
      text: "large",
      motion: "reduced",
      customLight: seeds,
      customDark: null,
    };
    expect(parseAppearance(serializeAppearance(chosen))).toEqual(chosen);
    expect(serializeAppearance(DEFAULT_APPEARANCE)).toBe("");
  });

  it("takes the default for whatever is missing or invalid", () => {
    expect(parseAppearance(null)).toEqual(DEFAULT_APPEARANCE);
    expect(parseAppearance("theme=neon&size=9&text=small&motion")).toEqual({ ...DEFAULT_APPEARANCE, text: "small" });
    expect(parseAppearance("custom-light=red.blue.green").customLight).toBeNull();
  });

  it("does not choose a custom palette that has no colors", () => {
    expect(parseAppearance("light=custom").light).toBe("academy");
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

  it("gives each scheme its own palette", () => {
    const appearance: Appearance = { ...DEFAULT_APPEARANCE, light: "paper", dark: "midnight" };
    expect(resolveColors(appearance, "light")).toEqual(hexColors("paper", "light"));
    expect(resolveColors(appearance, "dark")).toEqual(hexColors("midnight", "dark"));
  });
});

describe("shared palettes", () => {
  it("round-trips", () => {
    expect(parseSharedPalette(`  ${sharePalette("dark", seeds)}\n`)).toEqual({ scheme: "dark", seeds });
  });

  it.each([
    "",
    "hello",
    '{"scheme":"dark"}',
    "great-academy-palette-v1:not json",
    "great-academy-palette-v1:null",
    'great-academy-palette-v1:{"scheme":"dim","accent":"#000000","page":"#000000","ink":"#000000"}',
    'great-academy-palette-v1:{"scheme":"dark","accent":"red;}body{display:none","page":"#000000","ink":"#000000"}',
  ])("rejects %j", (text) => {
    expect(parseSharedPalette(text)).toBeNull();
  });
});
