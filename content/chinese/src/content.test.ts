import { CompileError, createRng, formatIssue, sampleGenerators } from "@ga/content";
import { describe, expect, it } from "vitest";

import { type GradeCharacters, recognitionByGrade } from "./characters/index.ts";
import { chinese, compileChinese } from "./index.ts";
import { heritageReading } from "./reading/heritage.ts";
import { chineseReading } from "./reading/index.ts";
import { coreShardTopics } from "./shards/core.ts";
import { hskShardTopics } from "./shards/hsk.ts";
import { levelsShardTopics } from "./shards/levels.ts";

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
  }, 60_000);

  it("passes the generator samples", () => {
    const issues = sampleGenerators(compileChinese(), { samples: 60, minDistinct: 8, maxPositionShare: 0.8 });
    expect(issues.map(formatIssue)).toEqual([]);
  }, 240_000);

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

  it("ends every third unit of each level with a topic of sentence building", () => {
    const subject = compileChinese();
    for (let level = 1; level <= 9; level++) {
      const course = subject.courses.get(`chinese-level-${level}`);
      const ends = course?.def.units.flatMap((unit, u) =>
        unit.modules.some((m) => m.topics.some((id) => id.includes("-sentences-"))) ? [u + 1] : [],
      );
      expect(ends, `level ${level}`).toEqual([3, 6, 9, 12]);
    }
  });

  it("gives grades 1 and 2 four topics of sentence building each, which the first two heritage bridges take", () => {
    const subject = compileChinese();
    const sentencesOf = (id: string) =>
      subject.courses
        .get(id)
        ?.def.units.flatMap((unit) => unit.modules.flatMap((m) => m.topics))
        .filter((x) => /^sentences-\d-\d\d$/u.test(x));
    expect(sentencesOf("chinese-grade-1")).toEqual(["sentences-1-01", "sentences-1-02", "sentences-1-03", "sentences-1-04"]);
    expect(sentencesOf("chinese-grade-2")).toEqual(["sentences-2-01", "sentences-2-02", "sentences-2-03", "sentences-2-04"]);
    expect([...(sentencesOf("chinese-heritage-1") ?? []), ...(sentencesOf("chinese-heritage-2") ?? [])].sort()).toEqual(
      [...(sentencesOf("chinese-grade-1") ?? []), ...(sentencesOf("chinese-grade-2") ?? [])].sort(),
    );
  });

  it("holds every topic in a shard, and none in two", () => {
    const held = [...coreShardTopics, ...levelsShardTopics, ...hskShardTopics].map((topic) => topic.id);
    expect(new Set(held).size).toBe(held.length);
    expect(held.toSorted()).toEqual(chinese.topics.map((topic) => topic.id).toSorted());
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
