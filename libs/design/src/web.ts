import { APPEARANCE_CHOICES, APPEARANCE_STORAGE_KEY, type Appearance, DEFAULT_APPEARANCE, TEXT_SCALE, TEXT_SIZES } from "./appearance.ts";
import { COLOR_TOKENS, type ColorScheme, colorTokens, PALETTES, type Palette } from "./tokens.ts";

const declarations = (palette: Palette, scheme: ColorScheme, indent: string) => {
  const tokens = colorTokens(palette, scheme);
  const base = colorTokens(DEFAULT_APPEARANCE.palette, scheme);
  // Other palettes only state what differs: the rules of the default palette always apply underneath.
  return COLOR_TOKENS.filter((token) => palette === DEFAULT_APPEARANCE.palette || tokens[token].join() !== base[token].join())
    .map((token) => `${indent}--color-${token}: oklch(${tokens[token].join(" ")});`)
    .join("\n");
};

const block = (selectors: string[], palette: Palette, scheme: ColorScheme, indent = "") =>
  `${selectors.map((s) => indent + s).join(",\n")} {\n${indent}  color-scheme: ${scheme};\n${declarations(palette, scheme, `${indent}  `)}\n${indent}}`;

const paletteRules = (palette: Palette) => {
  const attr = palette === DEFAULT_APPEARANCE.palette ? "" : `[data-palette="${palette}"]`;
  return [
    block([`:root${attr}`, `[data-theme="light"]${attr}`], palette, "light"),
    `@media (prefers-color-scheme: dark) {\n${block([`:root${attr}:not([data-theme="light"])`], palette, "dark", "  ")}\n}`,
    block([`[data-theme="dark"]${attr}`], palette, "dark"),
  ].join("\n\n");
};

const STILL = `  animation-duration: 0.01ms !important;
  animation-iteration-count: 1 !important;
  scroll-behavior: auto !important;
  transition-duration: 0.01ms !important;`;

/**
 * themeCss is the stylesheet of the web client. data-theme and data-palette work
 * on any element, so a part of a page can show another scheme or palette, with
 * both set on that element; with no data-theme on the root the device decides,
 * without any script.
 */
export function themeCss(): string {
  const sizes = TEXT_SIZES.filter((size) => size !== DEFAULT_APPEARANCE.text).map(
    (size) => `:root[data-text="${size}"] {\n  font-size: ${TEXT_SCALE[size] * 100}%;\n}`,
  );
  return `/* Generated from libs/design/src by \`pnpm nx run design:generate\`. Do not edit. */
@theme {
${declarations(DEFAULT_APPEARANCE.palette, "light", "  ")}
}

${PALETTES.map(paletteRules).join("\n\n")}

${sizes.join("\n\n")}

@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="full"]) *,
  :root:not([data-motion="full"]) *::before,
  :root:not([data-motion="full"]) *::after {
${STILL.replaceAll("  ", "    ")}
  }
}

:root[data-motion="reduced"] *,
:root[data-motion="reduced"] *::before,
:root[data-motion="reduced"] *::after {
${STILL}
}
`;
}

/** appearanceAttributes gives the attributes of the root element for an appearance; a default has none. */
export function appearanceAttributes(appearance: Appearance): Record<string, string | null> {
  const attributes: Record<string, string | null> = {};
  for (const key of Object.keys(APPEARANCE_CHOICES) as (keyof Appearance)[]) {
    attributes[`data-${key}`] = appearance[key] === DEFAULT_APPEARANCE[key] ? null : appearance[key];
  }
  return attributes;
}

/**
 * appearanceScript is the script that goes first in the head of a web page. It
 * applies the stored appearance before the first paint, so a page never flashes
 * in the wrong theme; bundled code would run too late.
 */
export function appearanceScript(): string {
  return `(function(){try{var c=${JSON.stringify(APPEARANCE_CHOICES)},s=localStorage.getItem(${JSON.stringify(APPEARANCE_STORAGE_KEY)});if(!s)return;s.split("&").forEach(function(p){var e=p.split("="),v=c[e[0]];if(v&&v.indexOf(e[1])>0)document.documentElement.setAttribute("data-"+e[0],e[1])})}catch(e){}})()`;
}
