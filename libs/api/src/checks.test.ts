import { describe, expect, it } from "vitest";

import { cohenKappa, sampled } from "./checks.ts";

describe("sampled", () => {
  it("picks about the share asked, the same way every time", () => {
    const ids = Array.from({ length: 4000 }, (_, i) => `00000000-0000-4000-8000-${String(i).padStart(12, "0")}`);
    const picked = ids.filter((id) => sampled(id, 0.05)).length;
    expect(picked / ids.length).toBeGreaterThan(0.03);
    expect(picked / ids.length).toBeLessThan(0.07);
    expect(ids.filter((id) => sampled(id, 0.05)).length).toBe(picked);
    expect(sampled(ids[0]!, 0)).toBe(false);
    expect(sampled(ids[0]!, 1)).toBe(true);
  });
});

describe("cohenKappa", () => {
  it("is 1 for full agreement, 0 at chance and below 0 for disagreement", () => {
    expect(cohenKappa([true, false, true, false], [true, false, true, false])).toBe(1);
    expect(cohenKappa([true, true], [true, true])).toBe(1);
    expect(cohenKappa([true, true, false, false], [true, false, true, false])).toBe(0);
    expect(cohenKappa([true, false], [false, true])).toBe(-1);
  });
});
