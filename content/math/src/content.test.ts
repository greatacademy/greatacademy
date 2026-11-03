import { CompileError, formatIssue } from "@ga/content";
import { describe, expect, it } from "vitest";

import { compileMath } from "./index.ts";
import { mathTextIssue } from "./sampling.ts";

const rawMath = /\^|_[A-Za-z0-9{]|sqrt\(/;

// Courses whose explanations have been written out in words; the others join as they are.
const explainedCourses = [
  "4th-grade-math",
  "5th-grade-math",
  "6th-grade-math",
  "7th-grade-math",
  "8th-grade-math",
  "algebra-foundations",
  "prealgebra",
  "algebra-i",
  "geometry",
  "algebra-ii",
  "precalculus",
  "calculus-i",
  "calculus-ii",
  "ap-calculus-ab",
  "ap-calculus-bc",
  "linear-algebra",
  "multivariable-calculus",
  "integrated-math-i",
  "integrated-math-ii",
  "integrated-math-iii",
  "integrated-math-i-honors",
  "integrated-math-ii-honors",
  "mathematical-foundations-i",
  "sat-math-fundamentals",
  "sat-math-prep",
  "act-math-fundamentals",
  "act-math-prep",
];
const minProseWords = 15;
const proseWords = (text: string) => text.replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, " ").match(/[A-Za-z]{2,}/g)?.length ?? 0;

describe("math content", () => {
  it("compiles without warnings", () => {
    try {
      expect(compileMath().warnings.map(formatIssue)).toEqual([]);
    } catch (e) {
      if (e instanceof CompileError) throw new Error(e.issues.map(formatIssue).join("\n"));
      throw e;
    }
  });

  it("writes the math of topic summaries and explanations in $…$", () => {
    const issues: string[] = [];
    const check = (where: string, text: Record<string, string>) => {
      for (const [locale, value] of Object.entries(text)) {
        const issue =
          mathTextIssue(value, locale as "en" | "zh-CN") ??
          (rawMath.test(value.replace(/\\\$|`[^`]*`/g, "").replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, " ")) ? "math outside $…$" : undefined);
        if (issue) issues.push(`${where} (${locale}): ${issue}`);
      }
    };
    for (const topic of compileMath().topics.values()) {
      check(`${topic.id} summary`, topic.summary);
      for (const kp of topic.knowledgePoints) check(`${topic.id}#${kp.id} explanation`, kp.explanation);
    }
    expect(issues).toEqual([]);
  });

  it("explains the knowledge points of explained courses in words, not only in symbols", () => {
    const subject = compileMath();
    const thin: string[] = [];
    for (const id of explainedCourses) {
      for (const topicId of subject.courses.get(id)?.topics ?? []) {
        for (const kp of subject.topics.get(topicId)?.knowledgePoints ?? []) {
          if (proseWords(kp.explanation.en) < minProseWords) thin.push(`${topicId}#${kp.id}`);
        }
      }
    }
    expect(thin).toEqual([]);
  });
});
