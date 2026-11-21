import { describe, expect, it } from "vitest";

import { generateAt, type KnowledgePointDef, t, tierRange, topicSource } from "./index.ts";

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
