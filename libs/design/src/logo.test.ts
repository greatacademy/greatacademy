import { describe, expect, it } from "vitest";

import { LOGO } from "./logo.ts";
import { contrastRatio } from "./tokens.ts";

describe("LOGO", () => {
  it("keeps the letter readable on the shield", () => {
    expect(contrastRatio(LOGO.letterColor, LOGO.shieldColor)).toBeGreaterThanOrEqual(4.5);
  });
});
