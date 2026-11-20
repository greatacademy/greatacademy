import { describe, expect, it } from "vitest";

import { t, topicSource } from "./index.ts";

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
