import { CheckerRegistry } from "@ga/content";
import { describe, expect, it } from "vitest";

import { englishCheckers, expandPattern } from "./checkers.ts";

const registry = new CheckerRegistry(englishCheckers);
const correct = (id: string, expected: string[], response: string) => registry.check(id, expected, response).correct;

describe("sentence", () => {
  const s = ["The dog barked, and the cat ran."];

  it("accepts a listed sentence, whatever the spacing or shape of the quotes", () => {
    expect(correct("sentence", s, "The dog barked, and the cat ran.")).toBe(true);
    expect(correct("sentence", s, "  The dog  barked , and the cat ran. ")).toBe(true);
    expect(correct("sentence", ["The dog's bone."], "The dog’s bone.")).toBe(true);
  });

  it("rejects wrong capitals and punctuation, and says so", () => {
    for (const slip of ["the dog barked, and the cat ran.", "The dog barked and the cat ran.", "The dog barked, and the cat ran"]) {
      const verdict = registry.check("sentence", s, slip);
      expect(verdict.correct).toBe(false);
      expect(verdict.feedback?.en).toMatch(/capital/);
    }
  });

  it("rejects different words with no hint", () => {
    const verdict = registry.check("sentence", s, "The dog barked, and the cat sat.");
    expect(verdict).toEqual({ correct: false });
  });

  it("matches a listed mistake despite spacing", () => {
    expect(registry.same("sentence", s, "the  dog barked.", "the dog barked.")).toBe(true);
    expect(registry.same("sentence", s, "The dog barked.", "the dog barked.")).toBe(false);
  });
});

describe("sentence-pattern", () => {
  it("expands optional parts and alternatives, nested too", () => {
    expect(expandPattern("A(,) b.")).toEqual(["A b.", "A, b."]);
    expect(expandPattern("[A|B] c.")).toEqual(["A c.", "B c."]);
    expect(expandPattern("A( [b|c]) d.")).toEqual(["A d.", "A b d.", "A c d."]);
  });

  it("accepts every sentence of a pattern and no other", () => {
    const p = ["[Because|Since] it rained(,) we stayed.", "We stayed [because|since] it rained."];
    for (const ok of ["Because it rained, we stayed.", "Since it rained we stayed.", "We stayed since it rained."])
      expect(correct("sentence-pattern", p, ok)).toBe(true);
    for (const no of ["We stayed, because it rained", "Although it rained, we stayed.", "because it rained, we stayed."])
      expect(correct("sentence-pattern", p, no)).toBe(false);
  });
});

describe("word-form", () => {
  it("is strict about spelling and not about case", () => {
    expect(correct("word-form", ["careless"], " Careless ")).toBe(true);
    expect(correct("word-form", ["careless"], "carless")).toBe(false);
    expect(correct("word-form", ["careless"], "care less")).toBe(false);
  });
});

describe("order", () => {
  it("accepts a listed order only", () => {
    const orders = [
      [1, 0, 2],
      [1, 2, 0],
    ];
    expect(registry.check("order", orders, "1,0,2").correct).toBe(true);
    expect(registry.check("order", orders, " 1, 2, 0").correct).toBe(true);
    expect(registry.check("order", orders, "0,1,2").correct).toBe(false);
    expect(registry.check("order", orders, "1,0").correct).toBe(false);
    expect(registry.check("order", orders, "x").correct).toBe(false);
  });
});
