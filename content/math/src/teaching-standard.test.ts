import { createRng, locales } from "@ga/content";
import { describe, expect, it } from "vitest";

import { math } from "./index.ts";
import { taughtCourses, taughtTopics } from "./teaching-standard.ts";

const callout = { en: /^> \*\*Watch out\.\*\*/m, "zh-CN": /^> \*\*注意。\*\*/m } as const;
const check = { en: /\*\*Check[.:]?\*\*/, "zh-CN": /\*\*检验[。：]?\*\*/ } as const;
const seeds = 12;

describe("topics written to the teaching standard", () => {
  const defs = new Map(math.topics.map((topic) => [topic.id, topic]));
  const courses = new Map(math.courses.map((course) => [course.id, course]));
  const fromCourses = taughtCourses.flatMap((id) =>
    (courses.get(id)?.units ?? []).flatMap((unit) => unit.modules.flatMap((module) => module.topics)),
  );

  it("lists courses that exist and topics outside them", () => {
    for (const id of taughtCourses) expect(courses.has(id), `course ${id} exists`).toBe(true);
    for (const id of taughtTopics) expect(fromCourses, `${id} is not already in a listed course`).not.toContain(id);
  });

  for (const id of new Set([...fromCourses, ...taughtTopics])) {
    it(id, () => {
      const topic = defs.get(id);
      expect(topic, "a listed topic exists").toBeDefined();
      if (!topic) return;
      expect(topic.intro, "has an introduction").toBeDefined();
      let checked = 0;
      for (const kp of topic.knowledgePoints) {
        for (const locale of locales) {
          expect(kp.explanation[locale], `${kp.id} explains with a callout in ${locale}`).toMatch(callout[locale]);
        }
        for (let seed = 1; seed <= seeds; seed++) {
          const problem = kp.generate(createRng(seed));
          for (const locale of locales) {
            const paragraphs = problem.solution[locale].split(/\n\s*\n/).filter((p) => p.trim()).length;
            expect(paragraphs, `${kp.id} seed ${seed} works its solution in steps in ${locale}`).toBeGreaterThanOrEqual(2);
          }
          if (locales.every((locale) => check[locale].test(problem.solution[locale]))) checked++;
        }
      }
      expect(checked, "checks the answer in its solutions").toBeGreaterThan(0);
    });
  }
});
