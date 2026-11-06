import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";

import { APPEARANCE_STORAGE_KEY, type Appearance } from "./appearance.ts";
import { appearanceAttributes, appearanceScript, themeCss } from "./web.ts";

/** Runs the head script against a stored value and returns the attributes it set. */
function runScript(stored: string | null) {
  const attributes: Record<string, string> = {};
  const localStorage = { getItem: (key: string) => (key === APPEARANCE_STORAGE_KEY ? stored : null) };
  const document = { documentElement: { setAttribute: (name: string, value: string) => (attributes[name] = value) } };
  new Function("localStorage", "document", appearanceScript())(localStorage, document);
  return attributes;
}

describe("theme.css", () => {
  it("is up to date with the tokens", () => {
    expect(readFileSync(new URL("../theme.css", import.meta.url), "utf8")).toBe(themeCss());
  });
});

describe("themeCss", () => {
  it("lets a palette win over the default in every state of the root", () => {
    const css = themeCss();
    expect(css).toContain(':root[data-palette="paper"]:not([data-theme="light"])');
    expect(css.indexOf(':root[data-palette="paper"],')).toBeLessThan(css.indexOf('[data-theme="dark"][data-palette="paper"]'));
  });
});

describe("appearanceScript", () => {
  it("sets the same attributes as the app", () => {
    const appearance: Appearance = { theme: "dark", palette: "plum", text: "large", motion: "reduced" };
    expect(runScript("theme=dark&palette=plum&text=large&motion=reduced")).toEqual(appearanceAttributes(appearance));
  });

  it("sets nothing for defaults, an empty store or invalid values", () => {
    expect(runScript(null)).toEqual({});
    expect(runScript("theme=system")).toEqual({});
    expect(runScript("theme=neon&color=red")).toEqual({});
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
    expect(appearanceAttributes({ theme: "system", palette: "academy", text: "small", motion: "system" })).toEqual({
      "data-theme": null,
      "data-palette": null,
      "data-text": "small",
      "data-motion": null,
    });
  });
});
