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
  "walnut",
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

// An accent with real chroma stays at least 30 degrees from the verdict hues, so that it never reads as one; the tests enforce it.
const SHAPES: Record<Palette, PaletteShape> = {
  academy: { neutral: [265, 1], accent: [268, 0.19, 0.12] },
  iris: { neutral: [290, 1], accent: [292, 0.2, 0.12] },
  plum: { neutral: [320, 1], accent: [320, 0.17, 0.12] },
  rose: { neutral: [350, 1], accent: [355, 0.17, 0.12] },
  walnut: { neutral: [60, 1.6], accent: [50, 0.09, 0.08] },
  paper: { neutral: [75, 2.2], accent: [245, 0.12, 0.09] },
  sepia: { neutral: [80, 3], accent: [200, 0.08, 0.09], light: [0.955, 0.98], dark: [0.2, 0.25] },
  pine: { neutral: [185, 1.2], accent: [185, 0.08, 0.11] },
  lake: { neutral: [225, 1.4], accent: [222, 0.09, 0.1] },
  sky: { neutral: [245, 1.2], accent: [250, 0.135, 0.115] },
  midnight: { neutral: [255, 3], accent: [280, 0.16, 0.11], dark: [0.19, 0.24] },
  slate: { neutral: [255, 1.5], accent: [255, 0.05, 0.04] },
};

const round = (x: number) => Math.round(x * 1000) / 1000;

/** colorTokens gives every color of a palette in a scheme. Text pairs keep a contrast of at least 4.5:1, which the tests enforce. */
export function colorTokens(palette: Palette, scheme: ColorScheme): Tokens {
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

/** accentOf gives the hue and light chroma of a palette's accent. */
export function accentOf(palette: Palette): { hue: number; chroma: number } {
  const [hue, chroma] = SHAPES[palette].accent;
  return { hue, chroma };
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

/** hexColors gives a palette in a scheme as hex, the form native clients use. */
export function hexColors(palette: Palette, scheme: ColorScheme): Record<ColorToken, string> {
  const tokens = colorTokens(palette, scheme);
  return Object.fromEntries(COLOR_TOKENS.map((token) => [token, oklchToHex(tokens[token])])) as Record<ColorToken, string>;
}
