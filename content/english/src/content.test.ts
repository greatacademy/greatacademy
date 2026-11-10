import { CompileError, createRng, formatIssue, type Problem, sampleGenerators, type Text } from "@ga/content";
import { describe, expect, it } from "vitest";

import { compileEnglish, english } from "./index.ts";
import { coreShardTopics } from "./shards/core.ts";

/** unescapedDollar matches a dollar sign that the Markdown renderer would take as the start of TeX. */
const unescapedDollar = /(?<!\\)\$/;

const texts = (p: Problem): readonly Text[] => [p.prompt, p.solution];

describe("english content", () => {
  it("compiles without warnings", () => {
    try {
      expect(compileEnglish().warnings.map(formatIssue)).toEqual([]);
    } catch (e) {
      if (e instanceof CompileError) throw new Error(e.issues.map(formatIssue).join("\n"));
      throw e;
    }
  });

  it("never repeats an item between consecutive seeds", () => {
    const subject = compileEnglish();
    for (const topic of subject.topics.values()) {
      topic.knowledgePoints.forEach((kp, index) => {
        const prompts = [1, 2, 3, 4].map((seed) => kp.generate(createRng(seed + index)));
        const distinct = new Set(prompts.map((p) => JSON.stringify([p.prompt, p.canonical, p.answer.input])));
        expect(distinct.size, `${topic.id} ${index}`).toBe(4);
      });
    }
  });

  it("passes the generator samples", () => {
    const issues = sampleGenerators(compileEnglish(), {
      samples: 60,
      minDistinct: 8,
      maxPositionShare: 0.8,
      textIssue: (text) => (unescapedDollar.test(text) ? "an unescaped dollar sign" : undefined),
    });
    expect(issues.map(formatIssue)).toEqual([]);
  });

  it("holds every topic in a shard", () => {
    expect(new Set(coreShardTopics.map((topic) => topic.id)).size).toBe(english.topics.length);
  });

  it("offers its passages in the course, each needing the topics whose words it uses", () => {
    const subject = compileEnglish();
    const offered = new Set(english.courses.flatMap((course) => course.reading ?? []));
    expect(subject.graph.passages.size).toBe(100);
    for (const passage of subject.graph.passages.values()) {
      expect(offered, passage.id).toContain(passage.unit);
      const needs = new Set(passage.topics.map((edge) => edge.topic));
      for (const topic of Object.keys(passage.wordsByTopic)) expect(needs, `${passage.id} uses ${topic}`).toContain(topic);
      expect(passage.words, passage.id).toBeGreaterThanOrEqual(140);
      expect(passage.words, passage.id).toBeLessThanOrEqual(260);
    }
  });

  it("writes every passage question for Chinese readers in Chinese", () => {
    for (const unit of english.reading ?? []) {
      for (const passage of unit.passages) {
        for (const q of passage.questions) {
          for (const text of [passage.title, q.prompt, q.right, ...q.wrong, q.solution]) {
            expect(text["zh-CN"], `${passage.id}: ${text.en}`).toMatch(/[一-鿿]/u);
          }
        }
      }
    }
  });

  it("writes every question for Chinese readers in Chinese", () => {
    for (const topic of english.topics) {
      for (const kp of topic.knowledgePoints) {
        const problem = kp.generate(createRng(1));
        for (const text of [...texts(problem), kp.explanation]) expect(text["zh-CN"], `${topic.id}/${kp.id}`).toMatch(/[一-鿿]/u);
      }
    }
  });
});
