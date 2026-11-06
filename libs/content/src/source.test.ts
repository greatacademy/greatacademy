import { describe, expect, it } from "vitest";

import { type Problem, type ProblemRef, routeSource, type SubjectSource, t, topicSource } from "./index.ts";

const problemOf = (shard: string, ref: ProblemRef): Problem =>
  ({ prompt: t(`${shard} ${ref.seed}`, `${shard} ${ref.seed}`) }) as unknown as Problem;

/** shardNamed answers with its own name, so that a test can see where a call went. */
const shardNamed = (name: string, calls: string[]): SubjectSource => ({
  problems: async (refs) => {
    calls.push(name);
    return refs.map((ref) => problemOf(name, ref));
  },
  lesson: async () => ({ title: t(name, name), explanation: t(name, name) }),
  judge: async (ref) => ({ problem: problemOf(name, ref), verdict: { correct: true } }),
  passage: async () => ({ title: t(name, name), body: name }),
});

describe("routeSource", () => {
  const route = (calls: string[]) => routeSource({ one: ["a", "b"], two: ["c"] }, (name) => shardNamed(name, calls));

  it("keeps the order of refs across shards and calls each shard once", async () => {
    const calls: string[] = [];
    const refs = [
      { topic: "c", kp: 0, seed: 1 },
      { topic: "a", kp: 0, seed: 2 },
      { topic: "c", kp: 0, seed: 3 },
      { topic: "b", kp: 0, seed: 4 },
    ];
    const problems = await route(calls).problems(refs);
    expect(problems.map((p) => p.prompt.en)).toEqual(["two 1", "one 2", "two 3", "one 4"]);
    expect(calls.toSorted()).toEqual(["one", "two"]);
  });

  it("sends lessons and answers to the shard holding the topic", async () => {
    const source = route([]);
    expect((await source.lesson("c", 0)).title.en).toBe("two");
    expect((await source.judge({ topic: "b", kp: 0, seed: 9 }, "x")).problem.prompt.en).toBe("one 9");
  });

  it("rejects a topic no shard holds", () => {
    expect(() => route([]).lesson("z", 0)).toThrow("unknown topic z");
  });
});

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
});
