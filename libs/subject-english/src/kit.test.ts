import { createRng, t } from "@ga/content";
import { describe, expect, it } from "vitest";

import { type ChoiceItem, choiceGenerator } from "./kit.ts";

const bank: ChoiceItem[] = [["", "noun", ["verb", "adjective"]]];
const generate = choiceGenerator(
  t("Which part of speech?", "哪种词性？"),
  bank,
  (right) => t(`It is a ${right}.`, `它是${right}。`),
  (wrong, _right, _shown, position) => t(`${position}: ${wrong}`, `${position}：${wrong}`),
);

describe("choiceGenerator", () => {
  it("gives each wrong option its own feedback, at that option's place", () => {
    for (let seed = 0; seed < 20; seed++) {
      const problem = generate(createRng(seed));
      const input = problem.answer.input;
      if (input?.kind !== "choice") throw new Error("not a choice");
      const options = input.options.map((o) => o.en);
      expect(problem.mistakes).toHaveLength(2);
      for (const mistake of problem.mistakes ?? []) {
        const wrong = options[Number(mistake.response)];
        expect(mistake.response).not.toBe(problem.canonical);
        expect(mistake.feedback.en).toBe(`${wrong === "verb" ? 0 : 1}: ${wrong}`);
      }
    }
  });

  it("lists no mistakes without whyNot", () => {
    const plain = choiceGenerator(t("Q", "问"), bank, (right) => t(right, right));
    expect(plain(createRng(1)).mistakes).toBeUndefined();
  });
});
