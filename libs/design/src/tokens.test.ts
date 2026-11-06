import { describe, expect, it } from "vitest";

import { type ColorToken, hexColors, oklchToHex, PALETTES } from "./tokens.ts";

const luminance = (hex: string) => {
  const [r = 0, g = 0, b = 0] = [1, 3, 5].map((i) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

const contrast = (a: string, b: string) => {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
};

const TEXT_PAIRS: [ColorToken, ColorToken][] = [
  ["ink", "page"],
  ["ink", "surface"],
  ["muted", "page"],
  ["muted", "surface"],
  ["accent", "page"],
  ["accent", "surface"],
  ["accent", "accent-soft"],
  ["on-accent", "accent"],
  ["good", "surface"],
  ["good", "good-soft"],
  ["bad", "surface"],
  ["bad", "bad-soft"],
  ["warn", "surface"],
  ["warn", "warn-soft"],
];

describe("oklchToHex", () => {
  it("converts the ends of the lightness scale", () => {
    expect(oklchToHex([1, 0, 0])).toBe("#ffffff");
    expect(oklchToHex([0, 0, 0])).toBe("#000000");
  });
});

describe("palettes", () => {
  const cases = PALETTES.flatMap((palette) => (["light", "dark"] as const).map((scheme) => [palette, scheme] as const));

  it.each(cases)("%s keeps text readable in %s", (palette, scheme) => {
    const colors = hexColors(palette, scheme);
    for (const [text, background] of TEXT_PAIRS) {
      expect(contrast(colors[text], colors[background]), `${text} on ${background}`).toBeGreaterThanOrEqual(4.5);
    }
  });
});
