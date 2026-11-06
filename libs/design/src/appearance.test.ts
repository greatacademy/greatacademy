import { describe, expect, it } from "vitest";

import {
  type Appearance,
  addCustomPalette,
  type CustomPalette,
  choiceSeeds,
  cleanPaletteName,
  DEFAULT_APPEARANCE,
  MAX_CUSTOM_PALETTES,
  MAX_PALETTE_NAME,
  parseAppearance,
  parseSharedPalette,
  removeCustomPalette,
  resolveColorScheme,
  resolveColors,
  resolveReducedMotion,
  serializeAppearance,
  sharePalette,
  updateCustomPalette,
} from "./appearance.ts";
import { customHexColors, hexColors, seedsOf } from "./tokens.ts";

const seeds = { accent: "#aa3311", page: "#fff8ee", ink: "#221100" };
const mine: CustomPalette = { id: "custom-1", name: "Mine", ...seeds };

describe("appearance storage", () => {
  it("round-trips a choice and stores nothing for the defaults", () => {
    const chosen: Appearance = {
      theme: "dark",
      light: "custom-1",
      dark: "honey",
      contrast: "high",
      text: "large",
      motion: "reduced",
      custom: { light: [mine, { ...mine, id: "custom-3", name: "a&b=c.d 中文 🎨" }], dark: [] },
    };
    expect(parseAppearance(serializeAppearance(chosen))).toEqual(chosen);
    expect(serializeAppearance(DEFAULT_APPEARANCE)).toBe("");
  });

  it("takes the default for whatever is missing or invalid", () => {
    expect(parseAppearance(null)).toEqual(DEFAULT_APPEARANCE);
    expect(parseAppearance("theme=neon&size=9&text=small&motion")).toEqual({ ...DEFAULT_APPEARANCE, text: "small" });
    expect(parseAppearance("custom-light=1.red.blue.green.x").custom.light).toEqual([]);
    expect(parseAppearance("custom-light=x.aa3311.fff8ee.221100.x").custom.light).toEqual([]);
    expect(parseAppearance("custom-light=1.aa3311.fff8ee.221100.%").custom.light).toEqual([]);
  });

  it("does not choose a custom palette that is not there", () => {
    expect(parseAppearance("light=custom-1").light).toBe("academy");
    expect(parseAppearance("dark=custom-1&custom-light=1.aa3311.fff8ee.221100.Mine").dark).toBe("academy");
    expect(parseAppearance("light=custom").light).toBe("academy");
  });

  it("drops repeated ids and whatever is over the limit", () => {
    const line = (n: number) => `custom-dark=${n}.aa3311.fff8ee.221100.x`;
    expect(parseAppearance(`${line(1)}&${line(1)}`).custom.dark).toHaveLength(1);
    const many = Array.from({ length: MAX_CUSTOM_PALETTES + 5 }, (_, n) => line(n)).join("&");
    expect(parseAppearance(many).custom.dark).toHaveLength(MAX_CUSTOM_PALETTES);
  });
});

describe("custom palettes", () => {
  it("adds a palette, chooses it and never reuses the id of one still there", () => {
    const one = addCustomPalette(DEFAULT_APPEARANCE, "light", "  One ", seeds);
    expect(one.light).toBe("custom-1");
    expect(one.dark).toBe("academy");
    expect(one.custom.light[0]).toEqual({ id: "custom-1", name: "One", ...seeds });
    const two = addCustomPalette(one, "light", "Two", seeds);
    const left = removeCustomPalette(two, "light", "custom-1");
    expect(addCustomPalette(left, "light", "Three", seeds).light).toBe("custom-3");
  });

  it("refuses a blank name and a full scheme", () => {
    expect(addCustomPalette(DEFAULT_APPEARANCE, "dark", "  ", seeds)).toBe(DEFAULT_APPEARANCE);
    let full = DEFAULT_APPEARANCE;
    for (let n = 0; n < MAX_CUSTOM_PALETTES; n++) full = addCustomPalette(full, "dark", "x", seeds);
    expect(addCustomPalette(full, "dark", "x", seeds)).toBe(full);
  });

  it("changes only the palette named, and keeps a name when given a blank one", () => {
    const start = addCustomPalette(addCustomPalette(DEFAULT_APPEARANCE, "dark", "A", seeds), "dark", "B", seeds);
    const changed = updateCustomPalette(start, "dark", "custom-1", { accent: "#000000", name: "  " });
    expect(changed.custom.dark[0]).toEqual({ id: "custom-1", name: "A", ...seeds, accent: "#000000" });
    expect(changed.custom.dark[1]).toEqual(start.custom.dark[1]);
    expect(updateCustomPalette(start, "dark", "custom-2", { name: "New" }).custom.dark[1]?.name).toBe("New");
  });

  it("goes back to the default only if the deleted palette was showing", () => {
    const start = addCustomPalette(addCustomPalette(DEFAULT_APPEARANCE, "dark", "A", seeds), "dark", "B", seeds);
    expect(removeCustomPalette(start, "dark", "custom-1").dark).toBe("custom-2");
    expect(removeCustomPalette(start, "dark", "custom-2").dark).toBe("academy");
  });

  it("gives the colors of any choice", () => {
    const appearance = addCustomPalette(DEFAULT_APPEARANCE, "light", "A", seeds);
    expect(choiceSeeds(appearance, "light")).toEqual(seeds);
    expect(choiceSeeds(appearance, "light", "paper")).toEqual(seedsOf("paper", "light"));
    expect(choiceSeeds(appearance, "dark")).toEqual(seedsOf("academy", "dark"));
    expect(resolveColors({ ...appearance, theme: "light" }, "dark")).toEqual(customHexColors(seeds, "light"));
  });

  it("stores any name it is given in a form that can be read back", () => {
    expect(cleanPaletteName("  x\uD83D  ")).toBe("x");
    expect(Array.from(cleanPaletteName("🎨".repeat(MAX_PALETTE_NAME + 9)))).toHaveLength(MAX_PALETTE_NAME);
    const appearance = addCustomPalette(DEFAULT_APPEARANCE, "light", "🎨".repeat(MAX_PALETTE_NAME + 9), seeds);
    expect(parseAppearance(serializeAppearance(appearance))).toEqual(appearance);
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
    expect(parseSharedPalette(`  ${sharePalette("dark", '我的 & "配色"', seeds)}\n`)).toEqual({
      scheme: "dark",
      name: '我的 & "配色"',
      seeds,
    });
  });

  it.each([
    "",
    "hello",
    '{"scheme":"dark"}',
    "great-academy-palette-v1:not json",
    "great-academy-palette-v1:null",
    'great-academy-palette-v1:{"scheme":"dim","name":"x","accent":"#000000","page":"#000000","ink":"#000000"}',
    'great-academy-palette-v1:{"scheme":"dark","name":"x","accent":"red;}body{display:none","page":"#000000","ink":"#000000"}',
    'great-academy-palette-v1:{"scheme":"dark","accent":"#000000","page":"#000000","ink":"#000000"}',
    'great-academy-palette-v1:{"scheme":"dark","name":"  ","accent":"#000000","page":"#000000","ink":"#000000"}',
  ])("rejects %j", (text) => {
    expect(parseSharedPalette(text)).toBeNull();
  });
});
