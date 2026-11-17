import { CompileError, createRng, formatIssue, sampleGenerators } from "@ga/content";
import { describe, expect, it } from "vitest";

import { chinese, compileChinese } from "./index.ts";
import { coreShardTopics } from "./shards/core.ts";

describe("chinese content", () => {
  it("compiles without warnings", () => {
    try {
      expect(compileChinese().warnings.map(formatIssue)).toEqual([]);
    } catch (e) {
      if (e instanceof CompileError) throw new Error(e.issues.map(formatIssue).join("\n"));
      throw e;
    }
  });

  it("never repeats an item between consecutive seeds", () => {
    const subject = compileChinese();
    for (const topic of subject.topics.values()) {
      topic.knowledgePoints.forEach((kp, index) => {
        const prompts = [1, 2, 3, 4].map((seed) => kp.generate(createRng(seed + index)));
        const distinct = new Set(prompts.map((p) => JSON.stringify([p.prompt, p.canonical, p.answer.input])));
        expect(distinct.size, `${topic.id} ${index}`).toBe(4);
      });
    }
  });

  it("passes the generator samples", () => {
    const issues = sampleGenerators(compileChinese(), { samples: 60, minDistinct: 8, maxPositionShare: 0.8 });
    expect(issues.map(formatIssue)).toEqual([]);
  }, 60_000);

  it("builds a grade only on its own grade and those before it", () => {
    const subject = compileChinese();
    for (const course of subject.courses.values()) {
      const match = /^chinese-grade-(\d)$/.exec(course.def.id);
      if (!match) continue;
      const grade = Number(match[1]);
      const later = course.foundations.filter((id) => Number(/-(\d+)-\d\d$/.exec(id)?.[1] ?? 0) > grade);
      expect(later, course.def.id).toEqual([]);
    }
  });

  it("holds every topic in a shard", () => {
    expect(new Set(coreShardTopics.map((topic) => topic.id)).size).toBe(chinese.topics.length);
  });

  it("writes every question for Chinese readers in Chinese", () => {
    for (const topic of chinese.topics) {
      for (const kp of topic.knowledgePoints) {
        const p = kp.generate(createRng(1));
        expect(p.prompt["zh-CN"], `${topic.id}#${kp.id}`).toMatch(/[一-鿿]/u);
        expect(p.solution["zh-CN"], `${topic.id}#${kp.id}`).toMatch(/[一-鿿]/u);
      }
    }
  });
});
