import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { APPEARANCE_STORAGE_KEY, type Appearance, addCustomPalette, DEFAULT_APPEARANCE } from "./appearance.ts";
import { subjectColors } from "./tokens.ts";
import {
  appearanceAttributes,
  appearanceScript,
  CUSTOM_PALETTE_CSS_KEY,
  CUSTOM_PALETTE_STYLE_ID,
  customPaletteCss,
  subjectCss,
  themeCss,
} from "./web.ts";

/** Runs the head script against stored values and returns what it did to the page. */
function runScript(stored: string | null, css: string | null = null) {
  const attributes: Record<string, string> = {};
  const styles: { id?: string; textContent?: string }[] = [];
  const localStorage = {
    getItem: (key: string) => (key === APPEARANCE_STORAGE_KEY ? stored : key === CUSTOM_PALETTE_CSS_KEY ? css : null),
  };
  const document = {
    documentElement: { setAttribute: (name: string, value: string) => (attributes[name] = value) },
    createElement: () => ({}),
    head: { appendChild: (style: { id?: string; textContent?: string }) => styles.push(style) },
  };
  new Function("localStorage", "document", appearanceScript())(localStorage, document);
  return { attributes, styles };
}

const seeds = { accent: "#aa3311", page: "#fff8ee", ink: "#221100" };

describe("theme.css", () => {
  it("is up to date with the tokens", () => {
    expect(readFileSync(new URL("../theme.css", import.meta.url), "utf8")).toBe(themeCss());
  });

  it("orders the layers so that a dark rule beats any light rule on the root", () => {
    const css = themeCss();
    expect(css.indexOf("@layer ga-light, ga-dark;")).toBeLessThan(css.indexOf("@layer ga-light {"));
    expect(css).toContain(':root[data-light="paper"]');
    expect(css).toContain(':root[data-dark="paper"]:not([data-theme="light"])');
    expect(css).toContain('[data-theme="dark"][data-contrast="high"][data-dark="paper"]');
  });
});

describe("customPaletteCss", () => {
  it("is empty without a custom palette", () => {
    expect(customPaletteCss(DEFAULT_APPEARANCE)).toBe("");
  });

  it("covers only the schemes that have one, at both contrasts", () => {
    const css = customPaletteCss(addCustomPalette(addCustomPalette(DEFAULT_APPEARANCE, "light", "One", seeds), "light", "Two", seeds));
    expect(css).toContain('[data-theme="light"][data-light="custom-1"]');
    expect(css).toContain('[data-theme="light"][data-contrast="high"][data-light="custom-2"]');
    expect(css).not.toContain("@layer ga-dark {");
  });

  it("never puts a name in the stylesheet", () => {
    const css = customPaletteCss(addCustomPalette(DEFAULT_APPEARANCE, "dark", "}body{display:none", seeds));
    expect(css).not.toContain("display:none");
  });
});

describe("appearanceScript", () => {
  it("sets the same attributes as the app", () => {
    const appearance: Appearance = {
      ...DEFAULT_APPEARANCE,
      theme: "dark",
      light: "plum",
      dark: "honey",
      contrast: "high",
      text: "large",
      motion: "reduced",
    };
    const expected = Object.fromEntries(Object.entries(appearanceAttributes(appearance)).filter(([, value]) => value !== null));
    expect(runScript("theme=dark&light=plum&dark=honey&contrast=high&text=large&motion=reduced").attributes).toEqual(expected);
  });

  it("sets nothing for defaults, an empty store or invalid values", () => {
    expect(runScript(null).attributes).toEqual({});
    expect(runScript("theme=system").attributes).toEqual({});
    expect(runScript("theme=neon&color=red&custom-light=1.aa3311.fff8ee.221100.x").attributes).toEqual({});
  });

  it("shows a custom palette, and nothing else that looks like one", () => {
    expect(runScript("dark=custom-12&custom-dark=12.aa3311.fff8ee.221100.x").attributes).toEqual({ "data-dark": "custom-12" });
    expect(runScript('dark=custom-1"x&light=custom&theme=custom-1').attributes).toEqual({});
  });

  it("adds the stylesheet of custom palettes", () => {
    const { styles } = runScript("light=custom-1", "a{}");
    expect(styles).toEqual([{ id: CUSTOM_PALETTE_STYLE_ID, textContent: "a{}" }]);
    expect(runScript("light=custom-1").styles).toEqual([]);
  });

  it("survives storage that throws", () => {
    const throwing = {
      getItem: () => {
        throw new Error("blocked");
      },
    };
    expect(() => new Function("localStorage", "document", appearanceScript())(throwing, {})).not.toThrow();
  });
});

describe("appearanceAttributes", () => {
  it("clears the attribute of a default", () => {
    expect(appearanceAttributes({ ...DEFAULT_APPEARANCE, text: "small" })).toEqual({
      "data-theme": null,
      "data-light": null,
      "data-dark": null,
      "data-contrast": null,
      "data-text": "small",
      "data-motion": null,
    });
  });
});

describe("subjectCss", () => {
  it("colors each subject in both schemes and contrasts, and leaves out ids that could break the stylesheet", () => {
    const css = subjectCss([
      { id: "math", hue: 235 },
      { id: 'x"]{}', hue: 10 },
    ]);
    expect(css).toContain(`:root [data-subject="math"] {\n  --subject-strong: ${subjectColors(235, "light").strong};`);
    expect(css).toContain(`:root[data-contrast="high"][data-theme="dark"] [data-subject="math"]`);
    expect(css).toContain(`--subject-on-soft: ${subjectColors(235, "dark", "high").onSoft};`);
    expect(css).not.toContain('x"');
  });
});
