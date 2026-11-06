import { describe, expect, it } from "vitest";

import { CheckerRegistry } from "./checkers.ts";
import { compileSubject } from "./compile.ts";
import { sampleGenerators } from "./problems.ts";
import { inLocale, t } from "./text.ts";
import type { SubjectDef } from "./types.ts";

const registry = new CheckerRegistry([]);

describe("order checker", () => {
  it("accepts any listed order and nothing else", () => {
    const expected = [
      [1, 0, 2],
      [1, 2, 0],
    ];
    expect(registry.check("order", expected, "1,0,2").correct).toBe(true);
    expect(registry.check("order", expected, " 1, 2 ,0").correct).toBe(true);
    expect(registry.check("order", expected, "0,1,2").correct).toBe(false);
    expect(registry.check("order", expected, "1,0").correct).toBe(false);
    expect(registry.check("order", expected, "").correct).toBe(false);
    expect(registry.check("order", expected, "a,b,c").correct).toBe(false);
  });
});

describe("order problems", () => {
  const subject = (items: readonly string[]): SubjectDef => ({
    id: "s",
    title: t("S", "甲"),
    checkers: [],
    courses: [
      {
        id: "c",
        title: t("C", "乙"),
        description: t("D", "丙"),
        units: [{ title: t("U", "丁"), modules: [{ title: t("M", "戊"), topics: ["a"] }] }],
      },
    ],
    topics: [
      {
        id: "a",
        title: t("A", "己"),
        summary: t("A", "庚"),
        prerequisites: [],
        encompasses: [],
        xp: 5,
        knowledgePoints: [
          {
            id: "k",
            title: t("K", "辛"),
            explanation: t("E", "壬"),
            generate: () => ({
              prompt: t("Order them.", "排序。"),
              answer: { checker: "order", expected: [items.map((_, i) => i)], input: { kind: "order", items: items.map((s) => t(s, s)) } },
              solution: t("So.", "如此。"),
              canonical: items.map((_, i) => i).join(","),
              wrong: [],
            }),
          },
        ],
      },
    ],
  });

  it("samples valid items and rejects empty ones", () => {
    expect(
      sampleGenerators(compileSubject(subject(["x", "y"])), { samples: 2, minDistinct: 1 }).filter((i) => i.severity === "error"),
    ).toEqual([]);
    expect(
      sampleGenerators(compileSubject(subject(["x", " "])), { samples: 2, minDistinct: 1 }).filter((i) => i.severity === "error"),
    ).not.toEqual([]);
  });
});

describe("inLocale", () => {
  it("reads every text in a value in one locale and leaves the rest alone", () => {
    const value = { a: t("yes", "是"), b: [t("no", "否")], c: 3, d: { en: "x" }, e: null };
    expect(inLocale(value, "en")).toEqual({ a: t("yes", "yes"), b: [t("no", "no")], c: 3, d: { en: "x" }, e: null });
  });
});
