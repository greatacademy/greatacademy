import { compileSubject, type SubjectDef, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { problemKey, renderStats, subjectStats } from "./stats.ts";

const choice = (n: number) => ({
  prompt: t(`Pick ${n}.`, `选 ${n}。`),
  answer: { checker: "choice", expected: 0, input: { kind: "choice" as const, options: [t(`${n}`, `${n}`), t("x", "x")] } },
  solution: t("It is the first.", "是第一个。"),
  canonical: "0",
  wrong: ["1"],
});

const subject: SubjectDef = {
  id: "s",
  title: t("S", "甲"),
  mark: "S",
  hue: 200,
  checkers: [],
  courses: [
    {
      id: "c",
      title: t("C", "乙"),
      description: t("D", "丙"),
      units: [{ title: t("U", "丁"), modules: [{ title: t("M", "戊"), topics: ["a", "b"] }] }],
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
      knowledgePoints: [{ id: "few", title: t("K", "辛"), explanation: t("E", "壬"), generate: (rng) => choice(rng.int(1, 3)) }],
    },
    {
      id: "b",
      title: t("B", "癸"),
      summary: t("B", "子"),
      prerequisites: ["a"],
      encompasses: [],
      xp: 7,
      knowledgePoints: [
        { id: "many", title: t("K", "丑"), explanation: t("E", "寅"), generate: (rng) => choice(rng.int(1, 1000)) },
        { id: "one", title: t("K", "卯"), explanation: t("E", "辰"), generate: () => choice(1) },
      ],
    },
  ],
};

describe("subject statistics", () => {
  it("count the content and list the knowledge points below the depth they need", () => {
    const stats = subjectStats(compileSubject(subject), { samples: 40, minRuled: 30 });
    expect(stats.topics).toBe(2);
    expect(stats.knowledgePoints).toBe(3);
    expect(stats.courses).toEqual([{ id: "c", group: "", topics: 2, knowledgePoints: 3, xp: 12 }]);
    expect(stats.singleStep).toEqual(["a"]);
    expect(stats.thin.map((p) => `${p.topic}#${p.kp}`)).toEqual(["a#few", "b#one"]);
    expect(stats.depth.get("under 10")).toBe(2);
    expect(renderStats(stats)).toContain("- b#one: 1 of 30");
  });
});

describe("problem keys", () => {
  it("ignore the order options are shuffled in but not which one is right", () => {
    const a = choice(1);
    const shuffled = {
      ...a,
      answer: { ...a.answer, expected: 1, input: { kind: "choice" as const, options: [t("x", "x"), t("1", "1")] } },
      canonical: "1",
    };
    expect(problemKey(shuffled)).toBe(problemKey(a));
    expect(problemKey({ ...a, canonical: "1" })).not.toBe(problemKey(a));
  });
});
