import { type ColorScheme, PALETTES, type Palette } from "./tokens.ts";

/** THEMES lists the theme choices; system follows the device. */
export const THEMES = ["system", "light", "dark"] as const;
/** Theme is one of THEMES. */
export type Theme = (typeof THEMES)[number];

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
  palette: Palette;
  text: TextSize;
  motion: Motion;
}

/** DEFAULT_APPEARANCE is what a client shows until its user chooses otherwise. */
export const DEFAULT_APPEARANCE: Appearance = { theme: "system", palette: "academy", text: "default", motion: "system" };

/** APPEARANCE_CHOICES lists the valid values of each setting; the first is the default. */
export const APPEARANCE_CHOICES = { theme: THEMES, palette: PALETTES, text: TEXT_SIZES, motion: MOTIONS } as const;

/** APPEARANCE_STORAGE_KEY is the key under which a client stores its serialized appearance. */
export const APPEARANCE_STORAGE_KEY = "ga-appearance";

/** TEXT_SCALE is the factor each text size applies to all text and to the spacing measured from it. */
export const TEXT_SCALE: Record<TextSize, number> = { small: 0.875, default: 1, large: 1.125 };

/** serializeAppearance writes an appearance for storage, leaving out defaults so that they can change later. */
export function serializeAppearance(appearance: Appearance): string {
  return (Object.keys(APPEARANCE_CHOICES) as (keyof Appearance)[])
    .filter((key) => appearance[key] !== DEFAULT_APPEARANCE[key])
    .map((key) => `${key}=${appearance[key]}`)
    .join("&");
}

/** parseAppearance reads a stored appearance, taking the default for whatever is missing or invalid. */
export function parseAppearance(stored: string | null | undefined): Appearance {
  const appearance = { ...DEFAULT_APPEARANCE };
  for (const pair of (stored ?? "").split("&")) {
    const [key, value] = pair.split("=");
    if (key === "theme" && (THEMES as readonly (string | undefined)[]).includes(value)) appearance.theme = value as Theme;
    if (key === "palette" && (PALETTES as readonly (string | undefined)[]).includes(value)) appearance.palette = value as Palette;
    if (key === "text" && (TEXT_SIZES as readonly (string | undefined)[]).includes(value)) appearance.text = value as TextSize;
    if (key === "motion" && (MOTIONS as readonly (string | undefined)[]).includes(value)) appearance.motion = value as Motion;
  }
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
