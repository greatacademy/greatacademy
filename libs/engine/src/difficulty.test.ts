import { describe, expect, it } from "vitest";

import { lessonDifficulty, quizDifficulty, reviewDifficulty } from "./difficulty.ts";
import { answerLesson, startLesson } from "./lesson.ts";
import { defaultParams as p } from "./params.ts";

describe("difficulty", () => {
  it("ramps a knowledge point from easy to hard, asking a missed tier again", () => {
    let l = startLesson("t", 2);
    expect(lessonDifficulty(p, l)).toBe("easy");
    l = answerLesson(p, l, true);
    expect(lessonDifficulty(p, l)).toBe("hard");
    l = answerLesson(p, l, true);
    // The next knowledge point starts easy again; two misses there need a third correct answer, at medium.
    expect(l.kp).toBe(1);
    expect(lessonDifficulty(p, l)).toBe("easy");
    l = answerLesson(p, answerLesson(p, l, false), false);
    expect(lessonDifficulty(p, l)).toBe("easy");
    l = answerLesson(p, l, true);
    expect(lessonDifficulty(p, l)).toBe("medium");
    l = answerLesson(p, l, true);
    expect(lessonDifficulty(p, l)).toBe("hard");
  });

  it("asks a review medium, then hard, and its extra questions medium", () => {
    expect([0, 1, 2, 3, 4].map((i) => reviewDifficulty(p, i))).toEqual(["medium", "hard", "hard", "medium", "medium"]);
  });

  it("steers a quiz toward its target accuracy", () => {
    expect(quizDifficulty(p, 0, 0)).toBe("medium");
    expect(quizDifficulty(p, 3, 3)).toBe("hard");
    expect(quizDifficulty(p, 3, 4)).toBe("medium");
    expect(quizDifficulty(p, 1, 3)).toBe("easy");
  });
});
