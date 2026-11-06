import { describe, expect, it } from "vitest";

import { LOGO } from "./logo.ts";
import { contrastRatio, hexColors } from "./tokens.ts";

describe("LOGO", () => {
  it("keeps the letter readable on the shield", () => {
    expect(contrastRatio(LOGO.letterColor, LOGO.shieldColor)).toBeGreaterThanOrEqual(4.5);
  });

  it("outlines the shield visibly on the default dark page", () => {
    expect(contrastRatio(LOGO.outlineColor, hexColors("academy", "dark").page)).toBeGreaterThanOrEqual(3);
  });
});
