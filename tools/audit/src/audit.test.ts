import { describe, expect, it } from "vitest";

import { normalizeTitle, parseOutline, proseWords } from "./audit.ts";

describe("audit helpers", () => {
  it("compare titles regardless of case, apostrophes and punctuation", () => {
    expect(normalizeTitle("Green’s Theorem & Its Uses")).toBe(normalizeTitle("greens theorem and its uses"));
  });

  it("read the size and numbered topic titles of an outline", () => {
    const outline = parseOutline("- **Size:** 1 unit · 2 topics\n\n1.1.1. Adding Fractions\n1.1.2. Subtracting Fractions \n");
    expect(outline).toEqual({ size: "1 unit · 2 topics", titles: ["Adding Fractions", "Subtracting Fractions"] });
  });

  it("count the words of an explanation outside its math", () => {
    expect(proseWords("Add the numerators: $\\frac{1}{5} + \\frac{2}{5} = \\frac{3}{5}$.\n\n$$a + b$$")).toBe(3);
  });
});
