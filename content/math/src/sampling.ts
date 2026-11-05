import type { Locale } from "@ga/content";
import { formatIssue, sampleGenerators } from "@ga/content";
import { expect, it } from "vitest";

import { compileMath } from "./index.ts";

/** shards is the number of test files that sample the generators in parallel. */
export const shards = 4;

const mathSpans = /\$\$[\s\S]*?\$\$|\$[^$]*\$/g;
const latexCommand = /\\(frac|sqrt|langle|mathbb|le|ge|cdot|pi|infty|left|right|begin|times|sum|int)\b/;

/**
 * mathTextIssue reports how a generated text breaks the math writing rules, if
 * it does: unbalanced $ delimiters, prose between delimiters that were swapped
 * by a missing $, LaTeX outside math, a spacing command that lost its backslash,
 * a doubled sign such as "x - -3", Chinese punctuation inside math, or a run of English in a Chinese text.
 */
export function mathTextIssue(text: string, locale: Locale): string | undefined {
  const plain = text.replace(/\\\$/g, "");
  if ((plain.match(/\$/g) ?? []).length % 2) return "unbalanced $ delimiters";
  for (const [span] of text.replace(/\\\$/g, "§").matchAll(mathSpans)) {
    if (/^\$\s/.test(span)) return "math that starts with a space: is a $ missing?";
  }
  const outside = plain.replace(mathSpans, " ");
  if (latexCommand.test(outside)) return "LaTeX outside math";
  if (outside.includes("{,}")) return "a TeX thousands separator outside math";
  for (const [span] of plain.matchAll(mathSpans)) {
    if (/[，。；：、]/.test(span.replace(/\\text\{[^}]*\}/g, ""))) return "Chinese punctuation inside math";
    if (/(^|[^\\a-z])[-+]\s*-\s*\d/.test(span) && !span.includes("\\pm")) return "doubled sign";
    if (/(^|[^\\]);\s*\\(Rightarrow|implies)\b/.test(span)) return "spacing command without a backslash";
  }
  if (locale === "zh-CN" && /[A-Za-z]{2,}(\s+[A-Za-z]{2,}){3}/.test(outside)) return "English in a Chinese text";
  return undefined;
}

/** testShard checks the generators of one shard of the topics; generators-<n>.test.ts call it for n = 0 … shards - 1. */
export function testShard(index: number) {
  it(`has sound generators (shard ${index + 1} of ${shards})`, () => {
    const issues = sampleGenerators(compileMath(), {
      samples: 300,
      minDistinct: 25,
      shard: { index, count: shards },
      textIssue: mathTextIssue,
      maxPositionShare: 0.8,
    });
    expect(issues.map(formatIssue)).toEqual([]);
  }, 300_000);
}
