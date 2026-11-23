import { createRng, locales } from "@ga/content";
import { describe, expect, it } from "vitest";

import { english } from "./index.ts";
import { taughtStrands, taughtTopics } from "./teaching-standard.ts";

const callout = { en: /^> \*\*Watch out\.\*\*/m, "zh-CN": /^> \*\*注意。\*\*/m } as const;
const check = { en: /\*\*Check[.:]?\*\*/, "zh-CN": /\*\*检验[。：]?\*\*/ } as const;
const seeds = 12;

describe("topics written to the teaching standard", () => {
  const defs = new Map(english.topics.map((topic) => [topic.id, topic]));
  const strands = new Set(english.strands?.map((s) => s.id));
  const fromStrands = english.topics.filter((topic) => taughtStrands.includes(topic.strand ?? "")).map((topic) => topic.id);

  it("lists strands that exist and topics outside them", () => {
    for (const id of taughtStrands) expect(strands.has(id), `strand ${id} exists`).toBe(true);
    for (const id of taughtTopics) expect(fromStrands, `${id} is not already in a listed strand`).not.toContain(id);
  });

  for (const id of new Set([...fromStrands, ...taughtTopics])) {
    it(id, () => {
      const topic = defs.get(id);
      expect(topic, "a listed topic exists").toBeDefined();
      if (!topic) return;
      expect(topic.intro, "has an introduction").toBeDefined();
      for (const kp of topic.knowledgePoints) {
        for (const locale of locales) {
          expect(kp.explanation[locale], `${kp.id} explains with a callout in ${locale}`).toMatch(callout[locale]);
        }
        let checked = 0;
        for (let seed = 1; seed <= seeds; seed++) {
          const problem = kp.generate(createRng(seed));
          for (const locale of locales) {
            const paragraphs = problem.solution[locale].split(/\n\s*\n/).filter((p) => p.trim()).length;
            expect(paragraphs, `${kp.id} seed ${seed} works its solution in steps in ${locale}`).toBeGreaterThanOrEqual(2);
          }
          if (locales.every((locale) => check[locale].test(problem.solution[locale]))) checked++;
        }
        expect(checked, `${kp.id} checks the answer in its solutions`).toBeGreaterThan(0);
      }
    });
  }
});
