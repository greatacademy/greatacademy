import type { Generator } from "@ga/content";
import { createRng, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { oneOfFour, oneOfFourTopic } from "./one-of-four.ts";
import { choiceProblem, yesNo } from "./problems.ts";

/** isEven asks whether a number is even: a two-option question. */
const isEven: Generator = (rng) => {
  const n = rng.int(1, 50);
  return choiceProblem({
    prompt: t(`Is $${n}$ even?`, `$${n}$ 是偶数吗？`),
    options: yesNo,
    correct: n % 2 === 0 ? 0 : 1,
    solution: t(`Halving $${n}$ settles it.`, `把 $${n}$ 除以二即可判断。`),
  });
};

describe("oneOfFour", () => {
  it("asks which of four questions has the answer, and the marked option has it", () => {
    for (let seed = 1; seed <= 200; seed++) {
      const problem = oneOfFour(isEven)(createRng(seed));
      const input = problem.answer.input as { options: readonly { en: string }[] };
      expect(input.options).toHaveLength(4);
      expect(new Set(input.options.map((o) => o.en)).size).toBe(4);
      const wantsYes = problem.prompt.en.includes('"Yes"');
      const evenAt = (i: number) => Number(input.options[i]?.en.match(/\d+/)?.[0]) % 2 === 0;
      const matching = input.options.map((_, i) => i).filter((i) => evenAt(i) === wantsYes);
      expect(matching).toEqual([problem.answer.expected]);
    }
  });

  it("is deterministic", () => {
    expect(oneOfFour(isEven)(createRng(7))).toEqual(oneOfFour(isEven)(createRng(7)));
  });

  it("returns a problem it cannot turn as it is", () => {
    const fixed: Generator = () =>
      choiceProblem({
        prompt: t("Pick one.", "选一个。"),
        options: [t("A", "甲"), t("B", "乙"), t("C", "丙")],
        correct: 0,
        solution: t("A is right.", "甲是对的。"),
      });
    expect(oneOfFour(fixed)(createRng(1))).toEqual(fixed(createRng(1)));
    const alwaysYes: Generator = () =>
      choiceProblem({ prompt: t("Is $2$ even?", "$2$ 是偶数吗？"), options: yesNo, correct: 0, solution: t("It is.", "是的。") });
    expect(oneOfFour(alwaysYes)(createRng(1))).toEqual(alwaysYes(createRng(1)));
  });
});

describe("oneOfFourTopic", () => {
  /** whichStore asks a two-option question whose options name its own things, so they differ from question to question. */
  const whichStore: Generator = (rng) => {
    const [first, second] = [rng.int(1, 40), rng.int(41, 80)];
    return choiceProblem({
      prompt: t(`Which is the better buy, store ${first} or store ${second}?`, `商店 ${first} 和商店 ${second} 哪家更划算？`),
      options: [t(`Store ${first}`, `商店 ${first}`), t(`Store ${second}`, `商店 ${second}`)],
      correct: rng.int(0, 1),
      solution: t("Comparing the two prices settles it.", "比较两个价格即可判断。"),
    });
  };
  const kp = (id: string, generate: Generator) => ({ id, title: t(id, id), explanation: t(id, id), generate });
  const topic = {
    id: "demo",
    title: t("Demo", "示例"),
    description: t("Demo", "示例"),
    prerequisites: [],
    knowledgePoints: [kp("verdict", isEven), kp("named", whichStore)],
  };

  const turned = oneOfFourTopic(topic as never).knowledgePoints;
  /** optionCount generates a problem from a turned knowledge point and counts its options. */
  const optionCount = (index: number, seed: number) => {
    const problem = (turned[index] as (typeof turned)[number]).generate(createRng(seed));
    return (problem.answer.input as { options: readonly unknown[] }).options.length;
  };

  it("turns a yes-or-no question into four cases, and leaves named options alone", () => {
    for (let seed = 1; seed <= 50; seed++) {
      expect(optionCount(0, seed)).toBe(4);
      expect(optionCount(1, seed)).toBe(2);
    }
  });

  it("is deterministic", () => {
    const verdict = turned[0] as (typeof turned)[number];
    expect(verdict.generate(createRng(7))).toEqual(verdict.generate(createRng(7)));
  });

  it("keeps the generator's own receiver", () => {
    const self = { ...kp("self", isEven), helper: isEven, generate: undefined as never };
    const withThis = {
      ...self,
      generate(this: { helper: Generator }, rng: Parameters<Generator>[0]) {
        return this.helper(rng);
      },
    };
    const [only] = oneOfFourTopic({ ...topic, knowledgePoints: [withThis] } as never).knowledgePoints;
    expect(() => only?.generate(createRng(1))).not.toThrow();
  });
});
