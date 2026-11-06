import { describe, expect, it } from "vitest";

import { compileMath } from "./index.ts";

/** names are the runs of letters a drawing may hold: names of functions, units, criteria and variables written together. */
const names = new Set(
  "sin cos tan cot sec csc log exp lim max min det div curl mod gcd lcm arg sup inf proj rank span dim ker tanh sinh cosh sech csch coth sgn deg ord Aut Arg Log Res arctan arccos arcsin cis comp Var SSS SAS ASA AAS III MAD IQR rad abc UVW".split(
    " ",
  ),
);

/** words are the short English words that a run of two letters could otherwise hide. */
const words = new Set("at or by to on of is no and".split(" "));

/** wordsIn returns the runs of letters in the text of a drawing that are words of a language. */
function wordsIn(svg: string): string[] {
  const found: string[] = [];
  for (const [, inner = ""] of svg.matchAll(/<text\b[^>]*>([\s\S]*?)<\/text>/g)) {
    const text = inner.replace(/<[^>]+>/g, "");
    for (const [run] of text.matchAll(/\p{Script=Han}+/gu)) found.push(run);
    for (const [run] of text.matchAll(/[A-Za-z]{2,}/g)) {
      if (words.has(run) || (run.length >= 3 && !names.has(run))) found.push(run);
    }
  }
  return found;
}

describe("the drawings of explanations", () => {
  it("hold no words, since a drawing is the same in every locale", () => {
    const found: string[] = [];
    for (const topic of compileMath().topics.values()) {
      for (const point of topic.knowledgePoints) {
        for (const figure of [point.figure, ...(point.figures ?? [])]) {
          if (!figure) continue;
          const held = wordsIn(figure.svg);
          if (held.length > 0) found.push(`${topic.id}#${point.id}: ${held.join(", ")}`);
        }
      }
    }
    expect(found).toEqual([]);
  });
});
