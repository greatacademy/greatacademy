import { createRng, locales } from "@ga/content";
import { describe, expect, it } from "vitest";

import { english } from "./index.ts";
import { taughtStrands, taughtTopics } from "./teaching-standard.ts";

const callout = { en: /^> \*\*Watch out\.\*\*(.*)$/m, "zh-CN": /^> \*\*注意。\*\*(.*)$/m } as const;
const check = { en: /\*\*Check[.:]?\*\*/, "zh-CN": /\*\*检验[。：]?\*\*/ } as const;
const seeds = 12;

const escapeRegex = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/gu, "\\$&");

/** stripOption removes the option's own text from a mistake reason so template-only duplicates are caught. */
const stripOption = (feedback: string, option: string): string => {
  const clean = option.replace(/[.。]+$/u, "").trim();
  if (!clean) return feedback.trim();
  return feedback
    .replace(new RegExp(escapeRegex(clean), "giu"), "")
    .replace(/\s+/gu, " ")
    .trim();
};

/** isVocabBatch identifies batch-built vocabulary topics whose distractors must each carry a distinct conflict reason. */
const isVocabBatch = (id: string, kpIds: readonly string[]): boolean =>
  kpIds.includes(`${id}-meanings`) || kpIds.includes(`${id}-use`) || kpIds.includes("complete");

describe("topics written to the teaching standard", () => {
  const defs = new Map(english.topics.map((topic) => [topic.id, topic]));
  const strands = new Set(english.strands?.map((s) => s.id));
  const fromStrands = english.topics.filter((topic) => taughtStrands.includes(topic.strand ?? "")).map((topic) => topic.id);
  const listed = [...new Set([...fromStrands, ...taughtTopics])];

  it("lists strands that exist and topics outside them", () => {
    for (const id of taughtStrands) expect(strands.has(id), `strand ${id} exists`).toBe(true);
    for (const id of taughtTopics) expect(fromStrands, `${id} is not already in a listed strand`).not.toContain(id);
  });

  it("never reuses the same Watch out callout in more than two topics", () => {
    for (const locale of locales) {
      const owners = new Map<string, Set<string>>();
      for (const id of listed) {
        const topic = defs.get(id);
        if (!topic) continue;
        for (const kp of topic.knowledgePoints) {
          const match = callout[locale].exec(kp.explanation[locale]);
          if (!match) continue;
          const line = match[0].trim();
          const set = owners.get(line) ?? new Set<string>();
          set.add(id);
          owners.set(line, set);
        }
      }
      for (const [line, topics] of owners) {
        expect(
          topics.size,
          `${locale} callout reused in ${topics.size} topics (${[...topics].slice(0, 5).join(", ")}): ${line}`,
        ).toBeLessThanOrEqual(2);
      }
    }
  });

  for (const id of listed) {
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
          if (problem.answer.checker === "choice") {
            const byResp = new Map((problem.mistakes ?? []).map((m) => [m.response, m.feedback]));
            for (const wrong of problem.wrong ?? []) {
              const fb = byResp.get(wrong);
              expect(fb, `${kp.id} seed ${seed} choice wrong option ${wrong} has mistakes feedback`).toBeDefined();
              if (fb) {
                for (const locale of locales) {
                  expect(fb[locale].trim(), `${kp.id} seed ${seed} mistake ${wrong} non-empty in ${locale}`).not.toBe("");
                }
              }
            }
            if (
              topic.strand === "vocabulary" &&
              isVocabBatch(
                id,
                topic.knowledgePoints.map((k) => k.id),
              ) &&
              problem.answer.input.kind === "choice" &&
              (problem.mistakes?.length ?? 0) >= 2
            ) {
              const opts = problem.answer.input.options;
              for (const locale of locales) {
                const seen = new Set<string>();
                for (const m of problem.mistakes ?? []) {
                  const optText = opts[Number(m.response)]?.[locale] ?? "";
                  const stripped = stripOption(m.feedback[locale], optText);
                  expect(
                    seen.has(stripped),
                    `${kp.id} seed ${seed} duplicate mistake reason after stripping option in ${locale}: ${stripped}`,
                  ).toBe(false);
                  seen.add(stripped);
                }
              }
            }
          }
        }
        expect(checked, `${kp.id} checks the answer in its solutions`).toBeGreaterThan(0);
      }
    });
  }
});
