import { CompileError, formatIssue } from "@ga/content";
import { describe, expect, it } from "vitest";

import { compileMath } from "./index.ts";
import { mathTextIssue } from "./sampling.ts";

const rawMath = /\^|_[A-Za-z0-9{]|sqrt\(/;

/** unicodeMath matches Unicode math symbols, which belong in TeX; unit superscripts such as m² are prose. */
const unicodeMath = /[λμσθΓχνρβαε√≤≥≠∈∑∫ℝℙℂℤ₀₁₂₃ₖₙᵢᵀⁿ]|(?<![米秒]|\b(?:mm|cm|km|m|ft|in|yd|s))[²³]|[A-Za-z][\u0302\u0304]/u;

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

  it("writes the math of knowledge point titles and explanations in TeX, not Unicode", () => {
    const issues: string[] = [];
    for (const topic of compileMath().topics.values()) {
      for (const kp of topic.knowledgePoints) {
        for (const [where, text] of [
          ["title", kp.title],
          ["explanation", kp.explanation],
        ] as const) {
          for (const [locale, value] of Object.entries(text)) {
            const prose = value.replace(/\\\$|`[^`]*`/g, "").replace(/\$\$[\s\S]*?\$\$|\$[^$]*\$/g, " ");
            if (unicodeMath.test(prose)) issues.push(`${topic.id}#${kp.id} ${where} (${locale})`);
          }
        }
      }
    }
    expect(issues).toEqual([]);
  });

  it("explains every knowledge point in words, not only in symbols", () => {
    const subject = compileMath();
    const thin: string[] = [];
    for (const course of subject.courses.values()) {
      for (const topicId of course.topics) {
        for (const kp of subject.topics.get(topicId)?.knowledgePoints ?? []) {
          if (proseWords(kp.explanation.en) < minProseWords) thin.push(`${topicId}#${kp.id}`);
        }
      }
    }
    expect(thin).toEqual([]);
  });
});
