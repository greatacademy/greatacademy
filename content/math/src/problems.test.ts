import { createRng, t } from "@ga/content";
import { Q } from "@ga/subject-math";
import { describe, expect, it } from "vitest";

import { explainedChoice, figureChoice, numberProblem } from "./problems.ts";

const canonical = (answer: string, solution: string, form?: "fraction") =>
  numberProblem({ prompt: t("Find it.", "求它。"), answer: Q.parse(answer), solution: t(solution, solution), ...(form && { form }) })
    .canonical;

describe("explainedChoice", () => {
  const problem = explainedChoice(createRng(1), {
    prompt: t("Which?", "哪个？"),
    correct: t("Right", "对"),
    wrong: [
      { option: t("Off", "偏"), why: t("It is off.", "它偏了。") },
      { option: t("Far", "远"), why: t("It is far.", "它远了。") },
      { option: t("Far", "远"), why: t("Again.", "又一次。") },
    ],
    solution: t("Because.", "因为。"),
  });

  it("drops a repeated option and tells a learner what is wrong with each", () => {
    const input = problem.answer.input;
    if (input.kind !== "choice") throw new Error("not a choice");
    expect(input.options).toHaveLength(3);
    const far = input.options.findIndex((o) => o.en === "Far");
    expect(problem.mistakes?.find((m) => m.response === String(far))?.feedback.en).toBe("It is far.");
    expect(problem.mistakes).toHaveLength(2);
  });

  it("goes through the wrong options in the solution, in both languages", () => {
    expect(problem.solution.en).toContain("- Far It is far.");
    expect(problem.solution["zh-CN"]).toContain("- 偏 它偏了。");
    expect(problem.solution.en).not.toContain("Again.");
  });
});

describe("figureChoice", () => {
  const drawing = (name: string) => ({ svg: `<svg>${name}</svg>`, alt: t(name, name) });

  it("tells a learner which mistake leads to the drawing, wherever it lands", () => {
    const problem = figureChoice(createRng(4), {
      prompt: t("Which?", "哪个？"),
      correct: drawing("a"),
      wrong: [drawing("b"), drawing("a"), drawing("c")],
      whys: [t("b is flipped.", "b 翻了。"), t("never", "不会"), t("c is moved.", "c 移了。")],
      solution: t("Because.", "因为。"),
    });
    const input = problem.answer.input;
    if (input.kind !== "choice" || !input.figures) throw new Error("not drawings");
    const at = input.figures.findIndex((f) => f.svg === "<svg>c</svg>");
    expect(problem.mistakes?.find((m) => m.response === String(at))?.feedback.en).toBe("c is moved.");
    expect(problem.mistakes).toHaveLength(2);
  });
});

describe("numberProblem", () => {
  it("shows the answer as a decimal when the solution works in decimals", () => {
    expect(canonical("0.54", "$1 - 0.46 = 0.54$")).toBe("0.54");
    expect(canonical("-2.5", "$\\frac{-5}{2} = -2.5$")).toBe("-2.5");
  });

  it("shows the answer as a fraction when the solution does, or says nothing of the decimal", () => {
    expect(canonical("0.5", "$\\frac{1}{2} = 0.5$")).toBe("\\frac{1}{2}");
    expect(canonical("0.5", "Half of it.")).toBe("\\frac{1}{2}");
  });

  it("does not take a longer number for the decimal", () => {
    expect(canonical("0.5", "$0.54 - 0.04$")).toBe("\\frac{1}{2}");
    expect(canonical("1.5", "$11.5 - 10$")).toBe("\\frac{3}{2}");
  });

  it("keeps a form the problem asks for", () => {
    expect(canonical("0.54", "$1 - 0.46 = 0.54$", "fraction")).toBe("\\frac{27}{50}");
  });
});
