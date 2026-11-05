import { describe, expect, it } from "vitest";

import { unpracticedBases } from "./exam.ts";
import { compileMath } from "./index.ts";
import { actExamLessons } from "./topics/exam-lessons-act.ts";
import { satExamLessons } from "./topics/exam-lessons-sat.ts";

describe("exam lessons", () => {
  it("has a lesson for exactly the exam topics", () => {
    const ids = [...compileMath().topics.keys()].filter((id) => /^(sat|act)-exam-/.test(id)).sort();
    expect(Object.keys({ ...satExamLessons, ...actExamLessons }).sort()).toEqual(ids);
  });

  it("teaches two different things in each topic", () => {
    for (const [id, lesson] of Object.entries({ ...satExamLessons, ...actExamLessons }))
      expect(lesson.hardTip.en, id).not.toBe(lesson.tip.en);
  });
});

describe("unpracticedBases", () => {
  it("removes real edges and keeps the prerequisites", () => {
    const { topics } = compileMath();
    for (const [id, bases] of Object.entries(unpracticedBases)) {
      const topic = topics.get(id);
      expect(topic, id).toBeDefined();
      for (const base of bases) {
        expect(topic?.prerequisites, `${id} ${base}`).toContain(base);
        expect(
          topic?.encompasses.map((edge) => edge.topic),
          `${id} ${base}`,
        ).not.toContain(base);
      }
    }
  });
});
