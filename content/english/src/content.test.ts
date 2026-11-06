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

  it("writes every question for Chinese readers in Chinese", () => {
    for (const topic of english.topics) {
      for (const kp of topic.knowledgePoints) {
        const problem = kp.generate(createRng(1));
        for (const text of [...texts(problem), kp.explanation]) expect(text["zh-CN"], `${topic.id}/${kp.id}`).toMatch(/[一-鿿]/u);
      }
    }
  });
});
