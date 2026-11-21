import { describe, expect, it } from "vitest";

import {
  coreCheckers,
  generateAt,
  type KnowledgePointDef,
  multistep,
  type ProblemPart,
  type TopicDef,
  t,
  tierRange,
  topicSource,
} from "./index.ts";

describe("topicSource", () => {
  const passage = {
    id: "p",
    title: t("Bees", "蜜蜂"),
    body: "Bees make honey.",
    topics: [],
    xp: 3,
    questions: [
      { prompt: t("Who?", "谁？"), right: t("Bees", "蜜蜂"), wrong: [t("Ants", "蚂蚁")], solution: t("It says bees.", "文中说蜜蜂。") },
    ],
  };
  const source = topicSource([], [], [{ id: "u", title: t("U", "单元"), passages: [passage] }]);

  it("serves a passage and judges its questions by seed", async () => {
    await expect(source.passage("p")).resolves.toEqual({ title: passage.title, body: passage.body });
    const [problem] = await source.problems([{ topic: "p", kp: 0, seed: 7 }]);
    const judged = await source.judge({ topic: "p", kp: 0, seed: 7 }, problem!.canonical);
    expect(judged.verdict.correct).toBe(true);
    const wrong = await source.judge({ topic: "p", kp: 0, seed: 7 }, problem!.wrong![0]!);
    expect(wrong.verdict.correct).toBe(false);
  });

  it("serves a passage with its unit's cover", async () => {
    const covered = topicSource([], [], [{ id: "u", title: t("U", "单元"), passages: [passage], illustration: "reading-u" }]);
    await expect(covered.passage("p")).resolves.toEqual({ title: passage.title, body: passage.body, illustration: "reading-u" });
  });
});

describe("tiers", () => {
  it("scales a range to a tier and marks the problems of a tiered knowledge point", async () => {
    expect(tierRange(undefined, 2, 60)).toEqual([2, 60]);
    expect(tierRange("easy", 2, 60)).toEqual([2, 12]);
    expect(tierRange("hard", 2, 60)).toEqual([30, 300]);
    const kp = (tiered: boolean): KnowledgePointDef => ({
      id: "k",
      title: t("K", "K"),
      explanation: t("K", "K"),
      ...(tiered && { tiered }),
      generate: (rng, difficulty) => {
        const [lo, hi] = tierRange(difficulty, 1, 10);
        const n = rng.int(lo, hi);
        return {
          prompt: t(`${n}`, `${n}`),
          answer: { input: { kind: "text" }, checker: "exact", expected: `${n}` },
          solution: t("", ""),
          canonical: `${n}`,
        };
      },
    });
    expect(generateAt(kp(true), 1, "hard").difficulty).toBe("hard");
    expect(Number(generateAt(kp(true), 1, "hard").canonical)).toBeGreaterThanOrEqual(5);
    expect(generateAt(kp(false), 1, "hard")).toEqual(generateAt(kp(false), 1, undefined));
    expect(generateAt(kp(true), 1, undefined).difficulty).toBeUndefined();
  });
});

describe("multistep", () => {
  const step = (q: string, a: string, topic?: string): ProblemPart => ({
    prompt: t(q, q),
    answer: { input: { kind: "text" }, checker: "text", expected: a },
    solution: t(`It is ${a}.`, `是 ${a}。`),
    canonical: a,
    ...(topic && { topic }),
  });
  const topic: TopicDef = {
    id: "shop",
    title: t("Shop", "商店"),
    summary: t("Shop", "商店"),
    prerequisites: [],
    encompasses: [],
    xp: 5,
    knowledgePoints: [
      {
        id: "k",
        title: t("K", "K"),
        explanation: t("K", "K"),
        generate: () =>
          multistep({ prompt: t("Pens cost 2 each.", "笔每支 2 元。") }, [step("Two pens?", "4"), step("Three pens?", "6", "other")]),
      },
    ],
  };
  const source = topicSource([topic], []);

  it("asks each part after the scenario and the parts before it, answered", async () => {
    const [first, second] = await source.problems([
      { topic: "shop", kp: 0, seed: 1 },
      { topic: "shop", kp: 0, seed: 1, part: 1 },
    ]);
    expect(first?.prompt.en).toBe("Pens cost 2 each.\n\n**1.** Two pens?");
    expect(first?.part).toMatchObject({ index: 0, count: 2, scenario: { en: "Pens cost 2 each." }, ask: { en: "Two pens?" } });
    expect(first?.parts).toBeUndefined();
    expect(second?.prompt.en).toBe("Pens cost 2 each.\n\n**1.** Two pens? Answer: 4\n\n**2.** Three pens?");
    expect(second?.prompt["zh-CN"]).toContain("答案：4");
    expect(second?.part).toMatchObject({ index: 1, count: 2, topic: "other", ask: { en: "Three pens?" } });
    expect((await source.judge({ topic: "shop", kp: 0, seed: 1, part: 1 }, "6")).verdict.correct).toBe(true);
    expect((await source.judge({ topic: "shop", kp: 0, seed: 1, part: 1 }, "4")).verdict.correct).toBe(false);
  });

  it("stands as its last part where parts are not asked, and needs two parts", () => {
    const whole = generateAt(topic.knowledgePoints[0]!, 1, undefined);
    expect(whole.canonical).toBe("6");
    expect(whole.parts).toHaveLength(2);
    expect(() => multistep({ prompt: t("x", "x") }, [step("Only?", "1")])).toThrow();
  });
});
