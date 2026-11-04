import type { Generator } from "@ga/content";
import { createRng, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { oneOfFour } from "./one-of-four.ts";
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
