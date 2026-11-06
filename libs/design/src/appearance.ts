import {
  CONTRASTS,
  type ColorScheme,
  type ColorSeeds,
  type ColorToken,
  type Contrast,
  customHexColors,
  hexColors,
  PALETTES,
  type Palette,
} from "./tokens.ts";

/** THEMES lists the theme choices; system follows the device. */
export const THEMES = ["system", "light", "dark"] as const;
/** Theme is one of THEMES. */
export type Theme = (typeof THEMES)[number];

/** PALETTE_CHOICES lists what a scheme can show: a built-in palette, or the person's own. */
export const PALETTE_CHOICES = [...PALETTES, "custom"] as const;
/** PaletteChoice is one of PALETTE_CHOICES. */
export type PaletteChoice = (typeof PALETTE_CHOICES)[number];

/** TEXT_SIZES lists the text size choices. */
export const TEXT_SIZES = ["small", "default", "large"] as const;
/** TextSize is one of TEXT_SIZES. */
export type TextSize = (typeof TEXT_SIZES)[number];

/** MOTIONS lists the motion choices; system follows the device. */
export const MOTIONS = ["system", "reduced", "full"] as const;
/** Motion is one of MOTIONS. */
export type Motion = (typeof MOTIONS)[number];

/** Appearance is how one client shows the product. Each client keeps its own; it never reaches the server. */
export interface Appearance {
  theme: Theme;
  light: PaletteChoice;
  dark: PaletteChoice;
  contrast: Contrast;
  text: TextSize;
  motion: Motion;
  /** The custom palettes, kept while another palette is chosen. */
  customLight: ColorSeeds | null;
  customDark: ColorSeeds | null;
}

/** DEFAULT_APPEARANCE is what a client shows until its user chooses otherwise. */
export const DEFAULT_APPEARANCE: Appearance = {
  theme: "system",
  light: "academy",
  dark: "academy",
  contrast: "standard",
  text: "default",
  motion: "system",
  customLight: null,
  customDark: null,
};

/** APPEARANCE_CHOICES lists the valid values of each setting with fixed choices; the first is the default. */
export const APPEARANCE_CHOICES = {
  theme: THEMES,
  light: PALETTE_CHOICES,
  dark: PALETTE_CHOICES,
  contrast: CONTRASTS,
  text: TEXT_SIZES,
  motion: MOTIONS,
} as const;

/** ChoiceKey names a setting in APPEARANCE_CHOICES. */
export type ChoiceKey = keyof typeof APPEARANCE_CHOICES;

const CHOICE_KEYS = Object.keys(APPEARANCE_CHOICES) as ChoiceKey[];

/** APPEARANCE_STORAGE_KEY is the key under which a client stores its serialized appearance. */
export const APPEARANCE_STORAGE_KEY = "ga-appearance";

/** TEXT_SCALE is the factor each text size applies to all text and to the spacing measured from it. */
export const TEXT_SCALE: Record<TextSize, number> = { small: 0.875, default: 1, large: 1.125 };

const HEX = /^#[0-9a-f]{6}$/;

/** isHexColor tells whether a string is a #rrggbb color in lower case. */
export const isHexColor = (value: unknown): value is string => typeof value === "string" && HEX.test(value);

const writeSeeds = ({ accent, page, ink }: ColorSeeds) => [accent, page, ink].map((c) => c.slice(1)).join(".");

const readSeeds = (value: string | undefined): ColorSeeds | null => {
  const [accent, page, ink] = (value ?? "").split(".").map((c) => `#${c}`);
  return isHexColor(accent) && isHexColor(page) && isHexColor(ink) ? { accent, page, ink } : null;
};

/** serializeAppearance writes an appearance for storage, leaving out defaults so that they can change later. */
export function serializeAppearance(appearance: Appearance): string {
  const parts = CHOICE_KEYS.filter((key) => appearance[key] !== DEFAULT_APPEARANCE[key]).map((key) => `${key}=${appearance[key]}`);
  if (appearance.customLight) parts.push(`custom-light=${writeSeeds(appearance.customLight)}`);
  if (appearance.customDark) parts.push(`custom-dark=${writeSeeds(appearance.customDark)}`);
  return parts.join("&");
}

/** parseAppearance reads a stored appearance, taking the default for whatever is missing or invalid. */
export function parseAppearance(stored: string | null | undefined): Appearance {
  const appearance: Appearance = { ...DEFAULT_APPEARANCE };
  const assign = appearance as unknown as Record<string, string>;
  for (const pair of (stored ?? "").split("&")) {
    const [key = "", value] = pair.split("=");
    const choices = APPEARANCE_CHOICES[key as ChoiceKey] as readonly string[] | undefined;
    if (choices && value && choices.includes(value)) assign[key] = value;
    if (key === "custom-light") appearance.customLight = readSeeds(value);
    if (key === "custom-dark") appearance.customDark = readSeeds(value);
  }
  if (appearance.light === "custom" && !appearance.customLight) appearance.light = DEFAULT_APPEARANCE.light;
  if (appearance.dark === "custom" && !appearance.customDark) appearance.dark = DEFAULT_APPEARANCE.dark;
  return appearance;
}

/** resolveColorScheme gives the colors to show for a theme on a device that prefers the given scheme. */
export function resolveColorScheme(theme: Theme, device: ColorScheme): ColorScheme {
  return theme === "system" ? device : theme;
}

/** resolveReducedMotion tells whether to reduce motion on a device with the given preference. */
export function resolveReducedMotion(motion: Motion, deviceReduces: boolean): boolean {
  return motion === "system" ? deviceReduces : motion === "reduced";
}

/** resolveColors gives the colors a client shows on a device that prefers the given scheme, as hex. */
export function resolveColors(appearance: Appearance, device: ColorScheme): Record<ColorToken, string> {
  const scheme = resolveColorScheme(appearance.theme, device);
  const choice: PaletteChoice = appearance[scheme];
  const seeds = scheme === "light" ? appearance.customLight : appearance.customDark;
  if (choice === "custom" && seeds) return customHexColors(seeds, scheme, appearance.contrast);
  return hexColors(choice === "custom" ? (DEFAULT_APPEARANCE[scheme] as Palette) : choice, scheme, appearance.contrast);
}

const SHARE_PREFIX = "great-academy-palette-v1:";

/** sharePalette writes a palette as text that a person can copy and import elsewhere. */
export function sharePalette(scheme: ColorScheme, seeds: ColorSeeds): string {
  return `${SHARE_PREFIX}${JSON.stringify({ scheme, ...seeds })}`;
}

/** parseSharedPalette reads text from sharePalette. It accepts nothing else: the text comes from outside and ends up in a stylesheet. */
export function parseSharedPalette(text: string): { scheme: ColorScheme; seeds: ColorSeeds } | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith(SHARE_PREFIX) || trimmed.length > 500) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed.slice(SHARE_PREFIX.length));
  } catch {
    return null;
  }
  const { scheme, accent, page, ink } = (parsed ?? {}) as Record<string, unknown>;
  if ((scheme !== "light" && scheme !== "dark") || !isHexColor(accent) || !isHexColor(page) || !isHexColor(ink)) return null;
  return { scheme, seeds: { accent, page, ink } };
}
