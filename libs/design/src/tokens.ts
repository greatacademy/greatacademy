/** ColorScheme is a set of colors a client can show. */
export type ColorScheme = "light" | "dark";

/** Oklch is a color as its lightness, chroma and hue. */
export type Oklch = readonly [lightness: number, chroma: number, hue: number];

/** PALETTES lists the built-in color palettes; the first is the default. Each has a light and a dark form. */
export const PALETTES = [
  "academy",
  "iris",
  "plum",
  "rose",
  "linen",
  "terracotta",
  "walnut",
  "honey",
  "olive",
  "paper",
  "sepia",
  "pine",
  "lake",
  "sky",
  "midnight",
  "slate",
] as const;

/** Palette is one of PALETTES. */
export type Palette = (typeof PALETTES)[number];

/** COLOR_TOKENS lists the roles a color can have. */
export const COLOR_TOKENS = [
  "ink",
  "muted",
  "line",
  "page",
  "surface",
  "accent",
  "on-accent",
  "accent-soft",
  "good",
  "good-soft",
  "bad",
  "bad-soft",
  "warn",
  "warn-soft",
] as const;

/** ColorToken is one of COLOR_TOKENS. */
export type ColorToken = (typeof COLOR_TOKENS)[number];

type Tokens = Record<ColorToken, Oklch>;

// A verdict means the same in every palette, so these colors do not change with it.
const VERDICTS: Record<ColorScheme, Pick<Tokens, "good" | "good-soft" | "bad" | "bad-soft" | "warn" | "warn-soft">> = {
  light: {
    good: [0.5, 0.13, 155],
    "good-soft": [0.96, 0.04, 155],
    bad: [0.53, 0.2, 25],
    "bad-soft": [0.96, 0.03, 25],
    warn: [0.54, 0.12, 70],
    "warn-soft": [0.97, 0.045, 85],
  },
  dark: {
    good: [0.78, 0.15, 155],
    "good-soft": [0.29, 0.05, 155],
    bad: [0.74, 0.15, 25],
    "bad-soft": [0.3, 0.06, 25],
    warn: [0.81, 0.13, 80],
    "warn-soft": [0.3, 0.05, 80],
  },
};

interface PaletteShape {
  /** The hue of the neutrals and how far they lean into it, 1 being barely. */
  neutral: readonly [hue: number, tint: number];
  /** The hue of the accent and its chroma in each scheme, within what sRGB can show at that lightness. */
  accent: readonly [hue: number, light: number, dark: number];
  /** The lightness of the page and the surfaces on it, where they differ from the usual. */
  light?: readonly [page: number, surface: number];
  dark?: readonly [page: number, surface: number];
}

// An accent with real chroma stays at least 20 degrees from the verdict hues, so that it never reads as one; the tests enforce it.
const SHAPES: Record<Palette, PaletteShape> = {
  academy: { neutral: [265, 1], accent: [268, 0.19, 0.12] },
  iris: { neutral: [290, 1], accent: [292, 0.2, 0.12] },
  plum: { neutral: [320, 1], accent: [320, 0.17, 0.12] },
  rose: { neutral: [20, 1.2], accent: [355, 0.17, 0.12] },
  linen: { neutral: [55, 1.6], accent: [335, 0.12, 0.1] },
  terracotta: { neutral: [55, 1.8], accent: [50, 0.125, 0.12] },
  walnut: { neutral: [60, 1.6], accent: [60, 0.09, 0.08] },
  honey: { neutral: [85, 2], accent: [95, 0.1, 0.12] },
  olive: { neutral: [100, 1.8], accent: [115, 0.09, 0.1] },
  paper: { neutral: [75, 2.2], accent: [245, 0.12, 0.09] },
  sepia: { neutral: [80, 3], accent: [200, 0.08, 0.09], light: [0.955, 0.98], dark: [0.2, 0.25] },
  pine: { neutral: [185, 1.2], accent: [185, 0.08, 0.11] },
  lake: { neutral: [225, 1.4], accent: [222, 0.09, 0.1] },
  sky: { neutral: [245, 1.2], accent: [250, 0.135, 0.115] },
  midnight: { neutral: [255, 3], accent: [280, 0.16, 0.11], dark: [0.19, 0.24] },
  slate: { neutral: [255, 1.5], accent: [255, 0.05, 0.04] },
};

/** CONTRASTS lists the contrast levels: standard keeps text at 4.5:1 or more, high at 7:1 or more. */
export const CONTRASTS = ["standard", "high"] as const;

/** Contrast is one of CONTRASTS. */
export type Contrast = (typeof CONTRASTS)[number];

/** CONTRAST_TARGET is the contrast ratio every text color keeps at each level. */
export const CONTRAST_TARGET: Record<Contrast, number> = { standard: 4.5, high: 7 };

/** ColorSeeds are the three colors a person chooses for a custom palette, as hex; the rest follows from them. */
export interface ColorSeeds {
  accent: string;
  page: string;
  ink: string;
}

const round = (x: number) => Math.round(x * 1000) / 1000;
const precise = (x: number) => Math.round(x * 1e6) / 1e6; // Enough to convert back to the same hex.

function standardTokens(palette: Palette, scheme: ColorScheme): Tokens {
  const shape = SHAPES[palette];
  const [neutralHue, tint] = shape.neutral;
  const [accentHue, lightChroma, darkChroma] = shape.accent;
  const n = (l: number, c: number): Oklch => [round(l), round(c * tint), neutralHue];
  if (scheme === "light") {
    const [page, surface] = shape.light ?? [0.985, 1];
    return {
      ink: n(0.24, 0.02),
      muted: n(page - 0.485, 0.02),
      line: n(page - 0.085, 0.01),
      page: n(page, 0.004),
      surface: surface === 1 ? [1, 0, 0] : n(surface, 0.003),
      accent: [0.5, lightChroma, accentHue],
      "on-accent": [1, 0, 0],
      "accent-soft": [0.95, round(Math.min(0.035, lightChroma * 0.4)), accentHue],
      ...VERDICTS.light,
    };
  }
  const [page, surface] = shape.dark ?? [0.17, 0.215];
  return {
    ink: n(0.93, 0.008),
    muted: n(0.72, 0.015),
    line: n(surface + 0.105, 0.015),
    page: n(page, 0.012),
    surface: n(surface, 0.014),
    accent: [0.76, darkChroma, accentHue],
    "on-accent": [0.2, 0.04, accentHue],
    "accent-soft": [0.3, round(Math.min(0.06, darkChroma * 0.5)), accentHue],
    ...VERDICTS.dark,
  };
}

const toGamma = (x: number) => {
  const clipped = Math.min(1, Math.max(0, x));
  return clipped <= 0.0031308 ? 12.92 * clipped : 1.055 * clipped ** (1 / 2.4) - 0.055;
};

/** oklchToHex converts a color to sRGB hex, for platforms that cannot parse oklch, clipping what sRGB cannot show. */
export function oklchToHex([lightness, chroma, hue]: Oklch): string {
  const a = chroma * Math.cos((hue * Math.PI) / 180);
  const b = chroma * Math.sin((hue * Math.PI) / 180);
  const l = (lightness + 0.3963377774 * a + 0.2158037573 * b) ** 3;
  const m = (lightness - 0.1055613458 * a - 0.0638541728 * b) ** 3;
  const s = (lightness - 0.0894841775 * a - 1.291485548 * b) ** 3;
  const rgb = [
    4.0767416621 * l - 3.3077115913 * m + 0.2309699292 * s,
    -1.2684380046 * l + 2.6097574011 * m - 0.3413193965 * s,
    -0.0041960863 * l - 0.7034186147 * m + 1.707614701 * s,
  ];
  return `#${rgb
    .map((channel) =>
      Math.round(toGamma(channel) * 255)
        .toString(16)
        .padStart(2, "0"),
    )
    .join("")}`;
}

/** hexToOklch converts a #rrggbb color. */
export function hexToOklch(hex: string): Oklch {
  const toLinear = (i: number) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  const [r, g, b] = [toLinear(1), toLinear(3), toLinear(5)];
  const l = Math.cbrt(0.4122214708 * r + 0.5363325363 * g + 0.0514459929 * b);
  const m = Math.cbrt(0.2119034982 * r + 0.6806995451 * g + 0.1073969566 * b);
  const s = Math.cbrt(0.0883024619 * r + 0.2817188376 * g + 0.6299787005 * b);
  const lightness = 0.2104542553 * l + 0.793617785 * m - 0.0040720468 * s;
  const a = 1.9779984951 * l - 2.428592205 * m + 0.4505937099 * s;
  const bb = 0.0259040371 * l + 0.7827717662 * m - 0.808675766 * s;
  return [precise(lightness), precise(Math.hypot(a, bb)), precise(((Math.atan2(bb, a) * 180) / Math.PI + 360) % 360)];
}

const luminance = (hex: string) => {
  const channel = (i: number) => {
    const c = Number.parseInt(hex.slice(i, i + 2), 16) / 255;
    return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
  };
  return 0.2126 * channel(1) + 0.7152 * channel(3) + 0.0722 * channel(5);
};

/** contrastRatio gives the WCAG contrast between two hex colors. */
export function contrastRatio(a: string, b: string): number {
  const [hi, lo] = [luminance(a), luminance(b)].sort((x, y) => y - x) as [number, number];
  return (hi + 0.05) / (lo + 0.05);
}

/** Moves a color's lightness away from its backgrounds until it reaches the target on all of them. */
function readable(color: Oklch, backgrounds: Oklch[], target: number, step: number): Oklch {
  let lightness = color[0];
  const met = () => backgrounds.every((b) => contrastRatio(oklchToHex([lightness, color[1], color[2]]), oklchToHex(b)) >= target);
  while ((step > 0 ? lightness < 1 : lightness > 0) && !met()) lightness = round(Math.min(1, Math.max(0, lightness + step)));
  // A saturated color runs out of gamut before it gets there; white or black always does.
  return [lightness, met() ? color[1] : 0, color[2]];
}

/** Brings every text color of a set of tokens to the target contrast, keeping hues. */
function enforceContrast(tokens: Tokens, scheme: ColorScheme, target: number): Tokens {
  const step = scheme === "light" ? -0.005 : 0.005;
  const grounds = [tokens.page, tokens.surface];
  return {
    ...tokens,
    ink: readable(tokens.ink, grounds, target, step),
    muted: readable(tokens.muted, grounds, target, step),
    accent: readable(tokens.accent, [...grounds, tokens["accent-soft"], tokens["on-accent"]], target, step),
    good: readable(tokens.good, [...grounds, tokens["good-soft"]], target, step),
    bad: readable(tokens.bad, [...grounds, tokens["bad-soft"]], target, step),
    warn: readable(tokens.warn, [...grounds, tokens["warn-soft"]], target, step),
  };
}

// High contrast also makes edges easier to see.
const strongerLines = (tokens: Tokens, scheme: ColorScheme): Tokens => ({
  ...tokens,
  line: [round(tokens.page[0] + (scheme === "light" ? -0.22 : 0.24)), tokens.line[1], tokens.line[2]],
});

const atContrast = (tokens: Tokens, scheme: ColorScheme, contrast: Contrast) =>
  contrast === "standard"
    ? enforceContrast(tokens, scheme, CONTRAST_TARGET.standard)
    : enforceContrast(strongerLines(tokens, scheme), scheme, CONTRAST_TARGET.high);

/** colorTokens gives every color of a palette in a scheme, at a contrast level whose target the tests enforce. */
export function colorTokens(palette: Palette, scheme: ColorScheme, contrast: Contrast = "standard"): Tokens {
  return atContrast(standardTokens(palette, scheme), scheme, contrast);
}

/**
 * customTokens derives every color from a person's three colors. The page stays
 * light or dark as its scheme requires, and text moves in lightness as far as
 * needed: no choice of colors can make the product unreadable.
 */
export function customTokens(seeds: ColorSeeds, scheme: ColorScheme, contrast: Contrast = "standard"): Tokens {
  const [pageL, pageC, pageH] = hexToOklch(seeds.page);
  const ink = hexToOklch(seeds.ink);
  const accent = hexToOklch(seeds.accent);
  const [, accentC, accentH] = accent;
  const n = (l: number, c = pageC): Oklch => [precise(l), precise(c), pageH];
  const tokens: Tokens =
    scheme === "light"
      ? (() => {
          const page = Math.max(pageL, 0.88);
          return {
            ink,
            muted: n(page - 0.485, Math.max(pageC, 0.01)),
            line: n(page - 0.085),
            page: n(page),
            surface: n(Math.min(1, page + 0.015), pageC / 2),
            accent,
            "on-accent": [1, 0, 0],
            "accent-soft": [round(page - 0.035), round(Math.min(0.035, accentC * 0.4)), accentH],
            ...VERDICTS.light,
          };
        })()
      : (() => {
          const page = Math.min(pageL, 0.3);
          return {
            ink,
            muted: n(0.72, Math.max(pageC, 0.01)),
            line: n(page + 0.15),
            page: n(page),
            surface: n(page + 0.045),
            accent,
            "on-accent": [0.2, 0.04, accentH],
            "accent-soft": [round(Math.min(page + 0.13, 0.36)), round(Math.min(0.06, accentC * 0.5)), accentH],
            ...VERDICTS.dark,
          };
        })();
  return atContrast(tokens, scheme, contrast);
}

const toHex = (tokens: Tokens) =>
  Object.fromEntries(COLOR_TOKENS.map((token) => [token, oklchToHex(tokens[token])])) as Record<ColorToken, string>;

/** hexColors gives a palette in a scheme as hex, the form native clients use. */
export function hexColors(palette: Palette, scheme: ColorScheme, contrast: Contrast = "standard"): Record<ColorToken, string> {
  return toHex(colorTokens(palette, scheme, contrast));
}

/** customHexColors gives a custom palette in a scheme as hex. */
export function customHexColors(seeds: ColorSeeds, scheme: ColorScheme, contrast: Contrast = "standard"): Record<ColorToken, string> {
  return toHex(customTokens(seeds, scheme, contrast));
}

/** seedsOf gives the three colors of a built-in palette, the starting point for customizing it. */
export function seedsOf(palette: Palette, scheme: ColorScheme): ColorSeeds {
  const { accent, page, ink } = hexColors(palette, scheme);
  return { accent, page, ink };
}

/** accentOf gives the hue and light chroma of a palette's accent. */
export function accentOf(palette: Palette): { hue: number; chroma: number } {
  const [hue, chroma] = SHAPES[palette].accent;
  return { hue, chroma };
}
