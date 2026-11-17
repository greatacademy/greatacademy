import { CompileError, createRng, formatIssue, sampleGenerators } from "@ga/content";
import { describe, expect, it } from "vitest";

import { type GradeCharacters, recognitionByGrade } from "./characters/index.ts";
import { chinese, compileChinese } from "./index.ts";
import { heritageReading } from "./reading/heritage.ts";
import { chineseReading } from "./reading/index.ts";
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

  it("reads passages mostly in the characters taught by their grade", () => {
    const han = /\p{Script=Han}/u;
    for (const { grade, unit } of chineseReading) {
      const known = new Set(
        recognitionByGrade.filter((r) => r.grade <= grade).flatMap((r) => r.batches.flatMap((b) => b.entries.map((e) => e.char))),
      );
      for (const passage of unit.passages) {
        const chars = [...passage.body].filter((c) => han.test(c));
        const unknown = chars.filter((c) => !known.has(c));
        expect(unknown.length / chars.length, `${passage.id}: ${[...new Set(unknown)].join("")}`).toBeLessThanOrEqual(0.02);
      }
    }
  });

  it("reads heritage passages in the characters their bridge has taught", () => {
    const han = /\p{Script=Han}/u;
    const chars = (grades: readonly GradeCharacters[]) => grades.flatMap((g) => g.batches.flatMap((b) => b.entries.map((e) => e.char)));
    const first = recognitionByGrade[0]!;
    const taught = [
      new Set(chars([{ ...first, batches: first.batches.slice(0, 50) }])),
      new Set(chars(recognitionByGrade.filter((r) => r.grade <= 2))),
      new Set(chars(recognitionByGrade.filter((r) => r.grade <= 4))),
    ];
    for (const { bridge, unit } of heritageReading) {
      const known = taught[bridge - 1]!;
      for (const passage of unit.passages) {
        const all = [...passage.body].filter((c) => han.test(c));
        const unknown = all.filter((c) => !known.has(c));
        expect(unknown.length / all.length, `${passage.id}: ${[...new Set(unknown)].join("")}`).toBeLessThanOrEqual(0.02);
      }
    }
  });
});
