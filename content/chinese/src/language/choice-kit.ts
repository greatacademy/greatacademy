// The kit of the language and revising topics of grades 3 and 4 (docs/chinese-curriculum.md §18.9): a choice whose
// solution is worked in two steps and a check, and whose every wrong option says why it is wrong in its own words.

import { type Generator, joinText, type Problem, type Rng, same, type Text, t } from "@ga/content";
import { quote } from "@ga/subject-chinese";

/** Choice is one question: what it asks and shows, its right option, the wrong ones with their reasons, and its steps. */
export interface Choice {
  readonly ask: Text;
  /** shown is the sentence or word the question is asked of, or empty. */
  readonly shown: string;
  readonly right: string;
  readonly wrong: readonly (readonly [option: string, reason: Text])[];
  readonly find: Text;
  readonly choose: Text;
  readonly check: Text;
}

/** Heads are the bold headings of the two steps of a solution. */
export interface Heads {
  readonly find: Text;
  readonly choose: Text;
}

/** choice builds a Choice, checking that its options differ and that it has two wrong ones at least. */
export function choice(c: Choice): Choice {
  if (c.wrong.length < 2) throw new Error(`choice ${c.shown || c.right}: needs two wrong options`);
  if (new Set([c.right, ...c.wrong.map((w) => w[0])]).size !== c.wrong.length + 1) {
    throw new Error(`choice ${c.shown || c.right}: repeats an option`);
  }
  return c;
}

/** choiceTopicGenerator asks its choices in turn, the options shuffled, the solution in two steps, a check and the reasons. */
export function choiceTopicGenerator(items: readonly Choice[], heads: Heads): Generator {
  if (items.length < 10) throw new Error(`a knowledge point needs 10 items, it has ${items.length}`);
  return (rng: Rng): Problem => {
    const c = rng.cycle(items);
    const options = rng.shuffle([c.right, ...c.wrong.map((w) => w[0])]);
    const answer = options.indexOf(c.right);
    const reasonOf = (o: string): Text => {
      const r = c.wrong.find((w) => w[0] === o)![1];
      return t(`${o}: ${r.en}`, `“${o.replaceAll("“", "‘").replaceAll("”", "’")}”：${r["zh-CN"]}`);
    };
    const list = (locale: "en" | "zh-CN") =>
      options
        .filter((o) => o !== c.right)
        .map((o) => `- ${reasonOf(o)[locale]}`)
        .join("\n");
    return {
      prompt: c.shown === "" ? c.ask : joinText([c.ask, same(quote(c.shown))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution: t(
        `${heads.find.en} ${c.find.en}\n\n${heads.choose.en} ${c.choose.en}\n\n**Check.** ${c.check.en}\n\nThe other options:\n\n${list("en")}`,
        `${heads.find["zh-CN"]}${c.find["zh-CN"]}\n\n${heads.choose["zh-CN"]}${c.choose["zh-CN"]}\n\n**检验。** ${c.check["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`,
      ),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: c.wrong.map(([o]) => ({ response: String(options.indexOf(o)), feedback: reasonOf(o) })),
    };
  };
}

/** rows splits data into its trimmed, non-empty lines, each split at ` | `, checking each has `fields` fields. */
export function rows(data: string, fields: number): readonly (readonly string[])[] {
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const parts = line.split(" | ").map((f) => f.trim());
      if (parts.length !== fields) throw new Error(`language data: ${line}`);
      return parts;
    });
}

/** bilingual reads `Chinese ~ English` as a Text. */
export function bilingual(field: string): Text {
  const [zh = "", en = ""] = field.split(" ~ ").map((s) => s.trim());
  if (zh === "" || en === "") throw new Error(`language data: ${field} needs Chinese ~ English`);
  return t(en, zh);
}
