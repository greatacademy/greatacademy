import { createRng, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { informationalSpec, type ModernPassage, modernTopics } from "./modern.ts";

/** passage makes a passage of 900 characters with questions whose options name it. */
const passage = (k: number, length = 900): ModernPassage => {
  const choice = (q: string) => ({
    ask: `${q}${k}`,
    right: `对${q}${k}`,
    wrong: [`错甲${q}${k}`, `错乙${q}${k}`, `错丙${q}${k}`] as const,
    ground: "文文",
    reasons: [t("first", "甲的理由"), t("second", "乙的理由"), t("third", "丙的理由")] as const,
    check: t("Check by another place.", "用别处再对。"),
  });
  return {
    title: `文章${k}`,
    body: "文".repeat(length),
    understanding: [choice("理解一"), choice("理解二")],
    analysis: [choice("分析一"), choice("分析二")],
    answers: [
      { ask: `问一${k}`, model: "答".repeat(40) },
      { ask: `问二${k}`, model: "答".repeat(50) },
    ],
  };
};

const six = Array.from({ length: 6 }, (_, k) => passage(k));

describe("the reading of modern texts", () => {
  it("builds a topic checked by rules and a judged one that needs it", () => {
    const [reading, answers] = modernTopics(informationalSpec(["before"], six));
    expect(reading.id).toBe("gaokao-informational-reading");
    expect(reading.criteria).toBeUndefined();
    expect(reading.knowledgePoints.map((p) => p.id)).toEqual([
      "gaokao-informational-reading-understanding",
      "gaokao-informational-reading-analysis",
    ]);
    expect(answers.prerequisites).toEqual([reading.id]);
    expect(answers.criteria?.map((c) => c.id)).toEqual(["zhgk-info-points", "zhgk-info-grounded", "zhgk-info-concise"]);
  });

  it("asks each question with every pair of its wrong options, and judges answers against the passage", () => {
    const [reading, answers] = modernTopics(informationalSpec([], six));
    const generate = reading.knowledgePoints[0]!.generate;
    const offered = new Set<string>();
    for (let seed = 0; seed < 36; seed++) {
      const p = generate(createRng(seed));
      if (p.answer.input.kind !== "choice") throw new Error("not a choice");
      offered.add(
        p.answer.input.options
          .map((o) => o.en)
          .sort()
          .join(),
      );
    }
    expect(offered.size).toBe(36);
    const a = answers.knowledgePoints[0]!.generate(createRng(1));
    expect(a.answer.judged?.source).toMatch(/^《文章\d》\n\n文+$/u);
    expect(a.answer.judged?.criteria).toHaveLength(3);
  });

  it("rejects too few passages, passages of the wrong length and repeated options", () => {
    expect(() => modernTopics(informationalSpec([], six.slice(1)))).toThrow(/6 passages/);
    expect(() => modernTopics(informationalSpec([], [...six.slice(1), passage(9, 500)]))).toThrow(/not 800 to 2000/);
    const twice = {
      ...passage(7),
      analysis: [{ ...passage(7).analysis[0], wrong: [passage(7).analysis[0].right, "乙", "丙"] }, passage(7).analysis[1]],
    } as const;
    expect(() => modernTopics(informationalSpec([], [...six.slice(1), twice]))).toThrow(/options/);
  });

  it("rejects a ground not in the passage, a reason given twice and a check that only repeats the ground", () => {
    const astray = { ...passage(7), analysis: [{ ...passage(7).analysis[0], ground: "不在文中" }, passage(7).analysis[1]] } as const;
    expect(() => modernTopics(informationalSpec([], [...six.slice(1), astray]))).toThrow(/not in the passage/);
    const same = t("same", "同一个理由");
    const repeated = {
      ...passage(7),
      analysis: [{ ...passage(7).analysis[0], reasons: [same, same, same] }, passage(7).analysis[1]],
    } as const;
    expect(() => modernTopics(informationalSpec([], [...six.slice(1), repeated]))).toThrow(/one reason twice/);
    const echo = {
      ...passage(7),
      analysis: [{ ...passage(7).analysis[0], check: t("again", "文 文") }, passage(7).analysis[1]],
    } as const;
    expect(() => modernTopics(informationalSpec([], [...six.slice(1), echo]))).toThrow(/a check of its own/);
  });

  it("gives each wrong option shown its own reason and works the question from its ground", () => {
    const [reading] = modernTopics(informationalSpec([], six));
    const p = reading.knowledgePoints[0]!.generate(createRng(0));
    expect(p.mistakes).toHaveLength(2);
    for (const m of p.mistakes ?? []) expect(m.feedback["zh-CN"]).toMatch(/的理由$/u);
    expect(p.solution["zh-CN"]).toContain("依据的是原文“文文”");
    expect(p.solution["zh-CN"]).toContain("**检验。** 用别处再对。");
  });
});
