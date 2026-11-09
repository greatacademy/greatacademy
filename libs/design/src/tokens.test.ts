import { describe, expect, it } from "vitest";

import {
  accentOf,
  awayFromVerdicts,
  CONTRAST_TARGET,
  CONTRASTS,
  type ColorScheme,
  type ColorToken,
  contrastRatio,
  customHexColors,
  hexColors,
  hexToOklch,
  oklchToHex,
  PALETTES,
  seedsOf,
  subjectColors,
} from "./tokens.ts";

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

const SCHEMES: ColorScheme[] = ["light", "dark"];

const expectReadable = (colors: Record<ColorToken, string>, target: number, label: string) => {
  for (const [text, background] of TEXT_PAIRS) {
    expect(contrastRatio(colors[text], colors[background]), `${label}: ${text} on ${background}`).toBeGreaterThanOrEqual(target);
  }
};

describe("color conversion", () => {
  it("converts the ends of the lightness scale", () => {
    expect(oklchToHex([1, 0, 0])).toBe("#ffffff");
    expect(oklchToHex([0, 0, 0])).toBe("#000000");
  });

  it.each(["#3b5bdb", "#aa3311", "#fff8ee", "#123456"])("round-trips %s", (hex) => {
    expect(oklchToHex(hexToOklch(hex))).toBe(hex);
  });
});

describe("built-in palettes", () => {
  const cases = PALETTES.flatMap((palette) =>
    SCHEMES.flatMap((scheme) => CONTRASTS.map((contrast) => [palette, scheme, contrast] as const)),
  );

  it.each(cases)("%s keeps text readable in %s at %s contrast", (palette, scheme, contrast) => {
    expectReadable(hexColors(palette, scheme, contrast), CONTRAST_TARGET[contrast], palette);
  });

  it.each(PALETTES)("%s has an accent that cannot be taken for a verdict", (palette) => {
    const { hue, chroma } = accentOf(palette);
    if (chroma < 0.1) return; // Too muted to read as a signal.
    for (const verdict of [155, 25, 75]) {
      const distance = Math.abs(((hue - verdict + 540) % 360) - 180);
      expect(distance).toBeGreaterThanOrEqual(20);
    }
  });

  it("offers as many warm palettes as cool ones", () => {
    const warm = PALETTES.filter((palette) => {
      const [, , hue] = hexToOklch(hexColors(palette, "light").page);
      return hue < 110 || hue > 340;
    });
    expect(warm.length).toBe(PALETTES.length / 2);
  });
});

describe("custom palettes", () => {
  const shades = ["#000000", "#ffffff", "#808080", "#ff0000", "#00ff00", "#0000ff", "#ffff00", "#3b5bdb", "#1c1c1c", "#f5f5dc"];
  const cases = shades.flatMap((accent) => shades.flatMap((page) => shades.map((ink) => ({ accent, page, ink }))));

  it("stays readable for any choice of colors", () => {
    for (const seeds of cases) {
      for (const scheme of SCHEMES) {
        for (const contrast of CONTRASTS) {
          expectReadable(customHexColors(seeds, scheme, contrast), CONTRAST_TARGET[contrast], JSON.stringify({ seeds, scheme, contrast }));
        }
      }
    }
  });

  it("keeps a sensible choice as chosen", () => {
    const seeds = seedsOf("paper", "light");
    const colors = customHexColors(seeds, "light");
    expect(colors.page).toBe(seeds.page);
    expect(colors.ink).toBe(seeds.ink);
    expect(colors.accent).toBe(seeds.accent);
  });
});

describe("subjectColors", () => {
  const hues = Array.from({ length: 36 }, (_, i) => i * 10);
  it.each(CONTRASTS)("keeps text on a subject's colors readable at %s contrast", (contrast) => {
    for (const scheme of ["light", "dark"] as const) {
      for (const hue of hues) {
        const c = subjectColors(hue, scheme, contrast);
        expect(contrastRatio(c.onStrong, c.strong)).toBeGreaterThanOrEqual(CONTRAST_TARGET[contrast]);
        expect(contrastRatio(c.onSoft, c.soft)).toBeGreaterThanOrEqual(CONTRAST_TARGET[contrast]);
      }
    }
  });
  it("keeps a subject's hue away from the verdicts", () => {
    expect(awayFromVerdicts(150)).toBe(135);
    expect(awayFromVerdicts(160)).toBe(175);
    expect(awayFromVerdicts(235)).toBe(235);
    expect(awayFromVerdicts(-10)).toBe(350);
    expect(awayFromVerdicts(30)).toBe(45);
  });
});
