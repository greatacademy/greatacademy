import { describe, expect, test } from "vitest";

import { STOP_FOR, stopActive } from "./sign-up-stop.ts";

describe("stopActive", () => {
  const at = Date.UTC(2026, 10, 7, 12);

  test("holds for a day after the stop", () => {
    expect(stopActive(String(at), at)).toBe(true);
    expect(stopActive(String(at), at + STOP_FOR - 1)).toBe(true);
  });

  test("runs out after a day", () => {
    expect(stopActive(String(at), at + STOP_FOR)).toBe(false);
  });

  test("treats nothing stored, or the old mark without a time, as no stop", () => {
    expect(stopActive(null, at)).toBe(false);
    expect(stopActive("1", at)).toBe(false);
    expect(stopActive("x", at)).toBe(false);
  });
});
