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
  seedsOf,
} from "./tokens.ts";

/** THEMES lists the theme choices; system follows the device. */
export const THEMES = ["system", "light", "dark"] as const;
/** Theme is one of THEMES. */
export type Theme = (typeof THEMES)[number];

/** CustomPaletteId names one of a person's own palettes. */
export type CustomPaletteId = `custom-${number}`;
/** PaletteChoice is what a scheme can show: a built-in palette, or one of the person's own. */
export type PaletteChoice = Palette | CustomPaletteId;
/** CustomPalette is a palette a person made for one scheme, whose colors only work there. */
export interface CustomPalette extends ColorSeeds {
  id: CustomPaletteId;
  name: string;
}

/** MAX_CUSTOM_PALETTES is how many custom palettes each scheme can hold. */
export const MAX_CUSTOM_PALETTES = 24;
/** MAX_PALETTE_NAME is the longest name of a custom palette, in characters. */
export const MAX_PALETTE_NAME = 40;

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
  /** The custom palettes of each scheme, kept while another palette is chosen. */
  custom: Readonly<Record<ColorScheme, readonly CustomPalette[]>>;
}

/** DEFAULT_APPEARANCE is what a client shows until its user chooses otherwise. */
export const DEFAULT_APPEARANCE: Appearance = {
  theme: "system",
  light: "academy",
  dark: "academy",
  contrast: "standard",
  text: "default",
  motion: "system",
  custom: { light: [], dark: [] },
};

/** APPEARANCE_CHOICES lists the valid fixed values of each setting; the first is the default. light and dark can also name a custom palette. */
export const APPEARANCE_CHOICES = {
  theme: THEMES,
  light: PALETTES,
  dark: PALETTES,
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

const CUSTOM_ID = /^custom-[0-9]{1,4}$/;

/** isCustomChoice tells whether a choice names a custom palette. */
export const isCustomChoice = (choice: string): choice is CustomPaletteId => CUSTOM_ID.test(choice);

/** cleanPaletteName gives the form of a name that is stored: trimmed, not too long, and always encodable. */
export const cleanPaletteName = (name: string) =>
  Array.from(name.replace(/\p{Cs}/gu, "").trim())
    .slice(0, MAX_PALETTE_NAME)
    .join("")
    .trim();

const writeCustom = ({ id, name, accent, page, ink }: CustomPalette) =>
  [id.slice("custom-".length), ...[accent, page, ink].map((c) => c.slice(1)), encodeURIComponent(name)].join(".");

const readCustom = (value: string | undefined): CustomPalette | null => {
  const [number, accentHex, pageHex, inkHex, ...rest] = (value ?? "").split(".");
  const id = `custom-${number}`;
  const [accent, page, ink] = [accentHex, pageHex, inkHex].map((c) => `#${c}`);
  if (!isCustomChoice(id) || !isHexColor(accent) || !isHexColor(page) || !isHexColor(ink)) return null;
  try {
    const name = cleanPaletteName(decodeURIComponent(rest.join(".")));
    return name ? { id, name, accent, page, ink } : null;
  } catch {
    return null;
  }
};

/** serializeAppearance writes an appearance for storage, leaving out defaults so that they can change later. */
export function serializeAppearance(appearance: Appearance): string {
  const parts = CHOICE_KEYS.filter((key) => appearance[key] !== DEFAULT_APPEARANCE[key]).map((key) => `${key}=${appearance[key]}`);
  for (const scheme of ["light", "dark"] as const) {
    for (const palette of appearance.custom[scheme]) parts.push(`custom-${scheme}=${writeCustom(palette)}`);
  }
  return parts.join("&");
}

/** parseAppearance reads a stored appearance, taking the default for whatever is missing or invalid. */
export function parseAppearance(stored: string | null | undefined): Appearance {
  const light: CustomPalette[] = [];
  const dark: CustomPalette[] = [];
  const appearance: Appearance = { ...DEFAULT_APPEARANCE, custom: { light, dark } };
  const assign = appearance as unknown as Record<string, string>;
  const add = (list: CustomPalette[], value: string | undefined) => {
    const palette = readCustom(value);
    if (palette && list.length < MAX_CUSTOM_PALETTES && !list.some((p) => p.id === palette.id)) list.push(palette);
  };
  for (const pair of (stored ?? "").split("&")) {
    const [key = "", value] = pair.split("=");
    const choices = APPEARANCE_CHOICES[key as ChoiceKey] as readonly string[] | undefined;
    const names = key === "light" || key === "dark";
    if (choices && value && (choices.includes(value) || (names && isCustomChoice(value)))) assign[key] = value;
    if (key === "custom-light") add(light, value);
    if (key === "custom-dark") add(dark, value);
  }
  if (!light.some((p) => p.id === appearance.light) && isCustomChoice(appearance.light)) appearance.light = DEFAULT_APPEARANCE.light;
  if (!dark.some((p) => p.id === appearance.dark) && isCustomChoice(appearance.dark)) appearance.dark = DEFAULT_APPEARANCE.dark;
  return appearance;
}

/** choiceSeeds gives the three colors of a choice in a scheme, by default the one chosen. */
export function choiceSeeds(appearance: Appearance, scheme: ColorScheme, choice: PaletteChoice = appearance[scheme]): ColorSeeds {
  const custom = appearance.custom[scheme].find((p) => p.id === choice);
  if (custom) return { accent: custom.accent, page: custom.page, ink: custom.ink };
  return seedsOf(isCustomChoice(choice) ? (DEFAULT_APPEARANCE[scheme] as Palette) : choice, scheme);
}

const withCustom = (appearance: Appearance, scheme: ColorScheme, list: readonly CustomPalette[]) => ({
  ...appearance,
  custom: { ...appearance.custom, [scheme]: list },
});

/** addCustomPalette adds a palette to a scheme and chooses it. A scheme that is full, or a blank name, changes nothing. */
export function addCustomPalette(appearance: Appearance, scheme: ColorScheme, name: string, seeds: ColorSeeds): Appearance {
  const list = appearance.custom[scheme];
  const clean = cleanPaletteName(name);
  if (list.length >= MAX_CUSTOM_PALETTES || !clean) return appearance;
  const number = Math.max(0, ...list.map((p) => Number(p.id.slice("custom-".length)))) + 1;
  const id: CustomPaletteId = `custom-${number}`;
  const { accent, page, ink } = seeds;
  return { ...withCustom(appearance, scheme, [...list, { id, name: clean, accent, page, ink }]), [scheme]: id };
}

/** updateCustomPalette changes the name or colors of a palette. A blank name keeps the old one. */
export function updateCustomPalette(
  appearance: Appearance,
  scheme: ColorScheme,
  id: CustomPaletteId,
  change: Partial<Omit<CustomPalette, "id">>,
): Appearance {
  const list = appearance.custom[scheme].map((p) => {
    if (p.id !== id) return p;
    const name = change.name === undefined ? p.name : cleanPaletteName(change.name) || p.name;
    return { ...p, ...change, name };
  });
  return withCustom(appearance, scheme, list);
}

/** removeCustomPalette deletes a palette; a scheme showing it goes back to the default. */
export function removeCustomPalette(appearance: Appearance, scheme: ColorScheme, id: CustomPaletteId): Appearance {
  const without = withCustom(
    appearance,
    scheme,
    appearance.custom[scheme].filter((p) => p.id !== id),
  );
  return appearance[scheme] === id ? { ...without, [scheme]: DEFAULT_APPEARANCE[scheme] } : without;
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
  const choice = appearance[scheme];
  if (isCustomChoice(choice)) return customHexColors(choiceSeeds(appearance, scheme), scheme, appearance.contrast);
  return hexColors(choice, scheme, appearance.contrast);
}

const SHARE_PREFIX = "great-academy-palette-v1:";

/** sharePalette writes a palette as text that a person can copy and import elsewhere. */
export function sharePalette(scheme: ColorScheme, name: string, { accent, page, ink }: ColorSeeds): string {
  return `${SHARE_PREFIX}${JSON.stringify({ scheme, name, accent, page, ink })}`;
}

/** parseSharedPalette reads text from sharePalette. It accepts nothing else: the text comes from outside and ends up in a stylesheet. */
export function parseSharedPalette(text: string): { scheme: ColorScheme; name: string; seeds: ColorSeeds } | null {
  const trimmed = text.trim();
  if (!trimmed.startsWith(SHARE_PREFIX) || trimmed.length > 1000) return null;
  let parsed: unknown;
  try {
    parsed = JSON.parse(trimmed.slice(SHARE_PREFIX.length));
  } catch {
    return null;
  }
  const { scheme, name, accent, page, ink } = (parsed ?? {}) as Record<string, unknown>;
  if ((scheme !== "light" && scheme !== "dark") || typeof name !== "string" || !isHexColor(accent) || !isHexColor(page) || !isHexColor(ink))
    return null;
  const clean = cleanPaletteName(name);
  return clean ? { scheme, name: clean, seeds: { accent, page, ink } } : null;
}
