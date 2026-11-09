import {
  APPEARANCE_CHOICES,
  APPEARANCE_STORAGE_KEY,
  type Appearance,
  type ChoiceKey,
  DEFAULT_APPEARANCE,
  TEXT_SCALE,
  TEXT_SIZES,
} from "./appearance.ts";
import {
  COLOR_TOKENS,
  CONTRASTS,
  type ColorScheme,
  type ColorToken,
  type Contrast,
  colorTokens,
  customTokens,
  type Oklch,
  oklchToHex,
  PALETTES,
  type Palette,
  subjectColors,
} from "./tokens.ts";

/** CUSTOM_PALETTE_CSS_KEY is the key under which the web client stores the stylesheet of its custom palettes. */
export const CUSTOM_PALETTE_CSS_KEY = "ga-appearance-css";

/** CUSTOM_PALETTE_STYLE_ID is the id of the style element that holds that stylesheet. */
export const CUSTOM_PALETTE_STYLE_ID = "ga-custom-palette";

type Print = (color: Oklch) => string;
const printOklch: Print = (color) => `oklch(${color.join(" ")})`;

const declarations = (tokens: Record<ColorToken, Oklch>, only: readonly ColorToken[], print: Print, indent: string) =>
  only.map((token) => `${indent}--color-${token}: ${print(tokens[token])};`).join("\n");

const block = (selectors: string[], scheme: ColorScheme, body: string, indent = "") =>
  `${selectors.map((s) => indent + s).join(",\n")} {\n${indent}  color-scheme: ${scheme};\n${body}\n${indent}}`;

/**
 * The rules of one palette in one scheme and contrast. Light rules go in an
 * earlier layer than dark ones, so a dark rule that applies always wins whatever
 * attributes the root also has.
 */
function schemeRules(id: string, scheme: ColorScheme, contrast: Contrast, body: (indent: string) => string) {
  const attr = id === DEFAULT_APPEARANCE[scheme] ? "" : `[data-${scheme}="${id}"]`;
  const level = contrast === "standard" ? "" : `[data-contrast="${contrast}"]`;
  const on = `${level}${attr}`;
  if (scheme === "light") return block([`:root${on}`, `[data-theme="light"]${on}`], "light", body("    "), "  ");
  return [
    `  @media (prefers-color-scheme: dark) {\n${block([`:root${on}:not([data-theme="light"])`], "dark", body("      "), "    ")}\n  }`,
    block([`[data-theme="dark"]${on}`], "dark", body("    "), "  "),
  ].join("\n\n");
}

const inLayer = (scheme: ColorScheme, rules: string[]) => `@layer ga-${scheme} {\n${rules.join("\n\n")}\n}`;

function builtInRules(scheme: ColorScheme) {
  const rules: string[] = [];
  for (const contrast of CONTRASTS) {
    for (const palette of PALETTES) {
      const tokens = colorTokens(palette, scheme, contrast);
      const base = colorTokens(DEFAULT_APPEARANCE[scheme] as Palette, scheme, contrast);
      // At standard contrast a palette only states what differs, as the default's rules apply underneath. At high contrast
      // those rules compete with the palette's standard ones, so it states everything.
      const only =
        contrast === "standard" && palette !== DEFAULT_APPEARANCE[scheme]
          ? COLOR_TOKENS.filter((token) => tokens[token].join() !== base[token].join())
          : COLOR_TOKENS;
      rules.push(schemeRules(palette, scheme, contrast, (indent) => declarations(tokens, only, printOklch, indent)));
    }
  }
  return rules;
}

const STILL = (indent: string) =>
  ["animation-duration: 0.01ms", "animation-iteration-count: 1", "scroll-behavior: auto", "transition-duration: 0.01ms"]
    .map((rule) => `${indent}${rule} !important;`)
    .join("\n");

/**
 * themeCss is the stylesheet of the web client. data-theme, data-light, data-dark
 * and data-contrast work on any element, so a part of a page can show another
 * palette with them set on that element; with no data-theme on the root the
 * device decides, without any script.
 */
export function themeCss(): string {
  const sizes = TEXT_SIZES.filter((size) => size !== DEFAULT_APPEARANCE.text).map(
    (size) => `:root[data-text="${size}"] {\n  font-size: ${TEXT_SCALE[size] * 100}%;\n}`,
  );
  const defaults = colorTokens(DEFAULT_APPEARANCE.light as Palette, "light");
  return `/* Generated from libs/design/src by \`pnpm nx run design:generate\`. Do not edit. */
@theme {
${declarations(defaults, COLOR_TOKENS, printOklch, "  ")}
}

@layer ga-light, ga-dark;

${inLayer("light", builtInRules("light"))}

${inLayer("dark", builtInRules("dark"))}

${sizes.join("\n\n")}

@media (prefers-reduced-motion: reduce) {
  :root:not([data-motion="full"]) *,
  :root:not([data-motion="full"]) *::before,
  :root:not([data-motion="full"]) *::after {
${STILL("    ")}
  }
}

:root[data-motion="reduced"] *,
:root[data-motion="reduced"] *::before,
:root[data-motion="reduced"] *::after {
${STILL("  ")}
}
`;
}

/** customPaletteCss is the stylesheet of an appearance's custom palettes, empty if it has none. Ids and colors are validated before they get here, and names never do. */
export function customPaletteCss(appearance: Appearance): string {
  const printHex: Print = oklchToHex;
  const layers: string[] = [];
  for (const scheme of ["light", "dark"] as const) {
    const rules = appearance.custom[scheme].flatMap((palette) =>
      CONTRASTS.map((contrast) =>
        schemeRules(palette.id, scheme, contrast, (indent) =>
          declarations(customTokens(palette, scheme, contrast), COLOR_TOKENS, printHex, indent),
        ),
      ),
    );
    if (rules.length > 0) layers.push(inLayer(scheme, rules));
  }
  // The order of the layers holds even if this style loads before the theme.
  return layers.length > 0 ? ["@layer ga-light, ga-dark;", ...layers].join("\n") : "";
}

/** appearanceAttributes gives the attributes of the root element for an appearance; a default has none. */
export function appearanceAttributes(appearance: Appearance): Record<string, string | null> {
  const attributes: Record<string, string | null> = {};
  for (const key of Object.keys(APPEARANCE_CHOICES) as ChoiceKey[]) {
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
  return `(function(){try{var c=${JSON.stringify(APPEARANCE_CHOICES)},d=document,s=localStorage.getItem(${JSON.stringify(APPEARANCE_STORAGE_KEY)}),x=localStorage.getItem(${JSON.stringify(CUSTOM_PALETTE_CSS_KEY)});if(s)s.split("&").forEach(function(p){var e=p.split("="),v=c[e[0]];if(v&&(v.indexOf(e[1])>0||/^(light|dark)$/.test(e[0])&&/^custom-[0-9]{1,4}$/.test(e[1])))d.documentElement.setAttribute("data-"+e[0],e[1])});if(x){var t=d.createElement("style");t.id=${JSON.stringify(CUSTOM_PALETTE_STYLE_ID)};t.textContent=x;d.head.appendChild(t)}}catch(e){}})()`;
}

/** SubjectHue is a subject's id and hue, as the catalog lists them. */
export interface SubjectHue {
  id: string;
  hue: number;
}

const SUBJECT_ID = /^[a-z0-9-]+$/;

/**
 * subjectCss is the stylesheet that gives an element with `data-subject="<id>"` its subject's colors, as the custom
 * properties --subject-strong, --subject-on-strong, --subject-soft and --subject-on-soft, in the root's scheme and
 * contrast. A rule for dark or high contrast is more specific than the one it replaces, so the order of the
 * attributes never matters. Ids that are not kebab case are left out.
 */
export function subjectCss(subjects: readonly SubjectHue[]): string {
  const rules: string[] = [];
  for (const { id, hue } of subjects) {
    if (!SUBJECT_ID.test(id)) continue;
    const on = `[data-subject="${id}"]`;
    const body = (scheme: ColorScheme, contrast: Contrast, indent: string) => {
      const c = subjectColors(hue, scheme, contrast);
      return [
        `${indent}--subject-strong: ${c.strong};`,
        `${indent}--subject-on-strong: ${c.onStrong};`,
        `${indent}--subject-soft: ${c.soft};`,
        `${indent}--subject-on-soft: ${c.onSoft};`,
      ].join("\n");
    };
    for (const contrast of CONTRASTS) {
      const level = contrast === "standard" ? "" : `[data-contrast="${contrast}"]`;
      rules.push(`:root${level} ${on} {\n${body("light", contrast, "  ")}\n}`);
      rules.push(
        `@media (prefers-color-scheme: dark) {\n  :root${level}:not([data-theme="light"]) ${on} {\n${body("dark", contrast, "    ")}\n  }\n}`,
      );
      rules.push(`:root${level}[data-theme="dark"] ${on} {\n${body("dark", contrast, "  ")}\n}`);
    }
  }
  return rules.join("\n\n");
}
