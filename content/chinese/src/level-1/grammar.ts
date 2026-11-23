// The grammar topics of the levels (docs/chinese-curriculum.md §6, §8.4): one grammar point of GF 0025-2021, or a few
// small ones, a topic, placed in the unit whose theme uses it. Each topic has two knowledge points: choosing the form
// that completes a sentence, and choosing the one sentence of four that is right. Every sentence and every wrong option
// uses only the characters taught by the end of its unit. The topic opens with its first gap worked; each explanation
// works an item and ends with the commonest mistake of its items; each wrong option gets the reason grammar-reasons.ts
// finds by comparing it with the right one.

import { type Text, type TopicDef, t } from "@ga/content";

import { type DrillItem, type DrillPoint, drillItem, drillTopic, lines } from "../grammar/drill.ts";
import { differenceOf, type Glossary, kindOf, noteOf, pointOf, reasonOf } from "./grammar-reasons.ts";

/** GAP marks where the form goes in a sentence of a grammar point. */
const GAP = "＿＿";

/** PUNCTUATION may appear in a grammar sentence besides taught characters. */
const PUNCTUATION = new Set([..."，。？！：“”、…"]);

/** GrammarPart is one knowledge point of a grammar topic before it is built: its explanation and its items. */
export interface GrammarPart {
  /** explanation teaches the point in the learner's language, with examples. */
  readonly explanation: Text;
  /** data holds the items, a line each, five fields split by ` | `: what is shown, the right answer, three wrong ones. */
  readonly data: string;
}

/** LevelGrammar is a grammar topic of a level as written in its data. */
export interface LevelGrammar {
  /** unit is the unit the topic belongs to, counting from 1. */
  readonly unit: number;
  readonly title: Text;
  readonly summary: Text;
  /** use is the knowledge point of sentences with a gap: each shown sentence has one ＿＿, filled by the right answer. */
  readonly use: GrammarPart;
  /** form is the knowledge point of whole sentences: nothing is shown; the right answer is the one right sentence. */
  readonly form: GrammarPart;
}

const two = (n: number): string => String(n).padStart(2, "0");

/** levelGrammarId is the id of the nth grammar topic of a level, counting from 1. */
export const levelGrammarId = (level: number, n: number): string => `level-${level}-grammar-${two(n)}`;

/** USE_QUESTION asks for the form that completes a sentence. */
const USE_QUESTION = t("Which fills the gap?", "哪一项填入空白处正确？");

/** FORM_QUESTION asks for the right sentence. */
const FORM_QUESTION = t("Which sentence is right?", "哪个句子是正确的？");

/** items reads the items of a part, checking that each gap sentence has one gap and each answer differs. */
function items(id: string, data: string, gapped: boolean): readonly DrillItem[] {
  return lines(data, 5).map(([shown = "", right = "", a = "", b = "", c = ""]) => {
    if (gapped && shown.split(GAP).length !== 2) throw new Error(`${id}: ${shown} needs one gap`);
    if (!gapped && shown !== "-") throw new Error(`${id}: a sentence item shows nothing, written -`);
    return drillItem(gapped ? shown : "", right, [a, b, c]);
  });
}

/** filled is a gap sentence with its gap filled. */
const filled = (shown: string, answer: string): string => shown.replace(GAP, answer);

/** sentenceOf is the sentence an answer makes: the gap filled, or the answer itself where nothing is shown. */
const sentenceOf = (shown: string, answer: string): string => (shown === "" ? answer : filled(shown, answer));

/** BREAK ends the words beside a gap that a solution quotes. */
const BREAK = /[，。？！：“”、…]/u;

/** NEAR is how many characters beside a gap a solution quotes. */
const NEAR = 3;

/** besideGap says where a gap is: after which characters and before which. */
function besideGap(shown: string): Text {
  const [left = "", right = ""] = shown.split(GAP);
  const l = [...(left.split(BREAK).at(-1) ?? "")].slice(-NEAR).join("");
  const r = [...(right.split(BREAK)[0] ?? "")].slice(0, NEAR).join("");
  if (l === "" && r === "") return t("The gap stands alone between the marks.", "空白处单独在标点之间。");
  if (l === "") return t(`The gap comes first, before ${r}.`, `空白处在前面，后面是“${r}”。`);
  if (r === "") return t(`The gap comes last, after ${l}.`, `空白处在最后，前面是“${l}”。`);
  return t(`The gap comes after ${l} and before ${r}.`, `空白处在“${l}”后面、“${r}”前面。`);
}

/** zhQuoted quotes a sentence in Chinese, its own quotation marks turned to single ones. */
const zhQuoted = (s: string): string => `“${s.replaceAll("“", "‘").replaceAll("”", "’")}”`;

/** about puts the option a reason is about before it. */
const about = (option: string, reason: Text): Text => t(`${option}: ${reason.en}`, `${zhQuoted(option)}：${reason["zh-CN"]}`);

/** reasonFor says why a wrong answer is wrong, comparing the sentence it makes with the right one. */
const reasonFor = (item: Pick<DrillItem, "shown" | "right">, wrong: string, glossary: Glossary): Text =>
  reasonOf(sentenceOf(item.shown, item.right), sentenceOf(item.shown, wrong), glossary);

/** whyNotOf says why a wrong answer is wrong. */
const whyNotOf = (glossary: Glossary) => (wrong: string, right: string, shown: string) =>
  about(wrong, reasonFor({ shown, right }, wrong, glossary));

/** Mistake is one wrong answer of an item, with the item. */
interface Mistake {
  readonly item: DrillItem;
  readonly wrong: string;
}

/** typical is the commonest kind of mistake of a part, taken where it can from an item other than the one avoided. */
function typical(part: readonly DrillItem[], avoid: DrillItem, glossary: Glossary): Mistake {
  const kinds = new Map<string, Mistake[]>();
  for (const item of part) {
    for (const wrong of item.wrong) {
      const kind = kindOf(differenceOf(sentenceOf(item.shown, item.right), sentenceOf(item.shown, wrong), glossary));
      kinds.set(kind, [...(kinds.get(kind) ?? []), { item, wrong }]);
    }
  }
  const most = [...kinds.values()].reduce((a, b) => (b.length > a.length ? b : a));
  return most.find((m) => m.item !== avoid) ?? most[0]!;
}

/** watchOut is the callout of a part: its commonest mistake, worked. */
function watchOut(m: Mistake, glossary: Glossary): Text {
  const wrong = sentenceOf(m.item.shown, m.wrong);
  const reason = reasonFor(m.item, m.wrong, glossary);
  return t(
    `> **Watch out.** ${wrong} is wrong. ${reason.en} The right sentence is ${sentenceOf(m.item.shown, m.item.right)}`,
    `> **注意。** ${zhQuoted(wrong)}是错的。${reason["zh-CN"]}正确的句子是：${sentenceOf(m.item.shown, m.item.right)}`,
  );
}

/** gapExample works the gap of an item: where the right answer goes, the sentence it makes, and why one wrong answer fails. */
function gapExample(item: DrillItem, glossary: Glossary): Text {
  const wrong = item.wrong[0];
  const reason = reasonFor(item, wrong, glossary);
  const whole = filled(item.shown, item.right);
  return t(
    `**Example.** ${item.shown}\n\nThe gap takes ${item.right}: ${whole} Why not ${wrong}? ${reason.en}`,
    `**例子。** ${item.shown}\n\n空白处填“${item.right}”：${whole}为什么不填“${wrong}”？${reason["zh-CN"]}`,
  );
}

/** sentenceExample works an item of whole sentences: the right one, and why one wrong one fails. */
function sentenceExample(item: DrillItem, glossary: Glossary): Text {
  const wrong = item.wrong[0];
  const reason = reasonFor(item, wrong, glossary);
  return t(
    `**Example.** ${item.right} is right. ${wrong} is not: ${lower(reason.en)}`,
    `**例子。** ${zhQuoted(item.right)}是正确的。${zhQuoted(wrong)}不对：${reason["zh-CN"]}`,
  );
}

/** differences is step 1 of choosing a sentence: what the sentences shown differ in. */
function differences(right: string, wrong: readonly string[], glossary: Glossary): Text {
  const points = wrong.map((w) => pointOf(right, w, glossary));
  const en = [...new Set(points.map((p) => p.en))];
  const zh = [...new Set(points.map((p) => p["zh-CN"]))];
  return t(`**Step 1.** Find where the sentences differ: ${en.join(", and ")}.`, `**第一步。** 找出几个句子不同的地方：${zh.join("；")}。`);
}

/** firstSentence is the first sentence of a text: in an explanation of order, the rule of order. */
const firstSentence = (text: Text): Text =>
  t(text.en.split(/(?<=[.!?])\s/u)[0] ?? text.en, `${text["zh-CN"].split("。")[0] ?? text["zh-CN"]}。`);

/** lower starts a reason with a small letter, to follow a colon. */
const lower = (s: string): string => (/^[A-Z][a-z]/u.test(s) ? s[0]!.toLowerCase() + s.slice(1) : s);

/** joined joins texts into paragraphs. */
const joined = (...texts: readonly Text[]): Text => t(texts.map((x) => x.en).join("\n\n"), texts.map((x) => x["zh-CN"]).join("\n\n"));

/** untaughtIn are the characters of a text not taught, apart from punctuation and the gap. */
const untaughtIn = (text: string, taught: ReadonlySet<string>): readonly string[] =>
  [...text.replace(/＿/gu, "")].filter((ch) => !taught.has(ch) && !PUNCTUATION.has(ch) && ch.trim() !== "");

/** GrammarSpec says how to build the grammar topics of one unit. */
export interface GrammarSpec {
  readonly level: number;
  /** n is the number of the first grammar topic of the unit, counting from 1 within the level. */
  readonly n: number;
  readonly grammar: readonly LevelGrammar[];
  /** taught are the characters taught by the end of the unit. */
  readonly taught: ReadonlySet<string>;
  /** after is the topic the first grammar topic needs besides the one before it: the unit's last word topic. */
  readonly after: string;
  /** meanings are the meanings of the words taught by the end of the unit's level, by word. */
  readonly meanings: Glossary["meanings"];
  /** characters are the characters taught by the end of the unit's level, by character. */
  readonly characters: Glossary["characters"];
}

/** unitGrammarTopics builds the grammar topics of a unit, each needing the unit's last word topic and the grammar topic before it. */
export function unitGrammarTopics(spec: GrammarSpec): readonly TopicDef[] {
  return spec.grammar.map((g, k) => {
    const n = spec.n + k;
    const id = levelGrammarId(spec.level, n);
    const use = items(id, g.use.data, true);
    const form = items(id, g.form.data, false);
    for (const item of [...use, ...form]) {
      const untaught = [item.shown, item.right, ...item.wrong].flatMap((s) => untaughtIn(s, spec.taught));
      if (untaught.length > 0)
        throw new Error(`${id}: ${item.shown || item.right} uses ${[...new Set(untaught)].join("")}, not yet taught`);
    }
    const glossary: Glossary = { meanings: spec.meanings, characters: spec.characters, order: firstSentence(g.form.explanation) };
    const whyNot = whyNotOf(glossary);
    const [first, second] = use;
    const [example] = form;
    if (!first || !second || !example) throw new Error(`${id}: too few items`);
    const check = t(`**Check.** Read the sentence against the rule: ${g.summary.en}`, `**检验。** 对照规则读一遍：${g.summary["zh-CN"]}`);
    const points: readonly [DrillPoint, DrillPoint] = [
      {
        suffix: "use",
        title: t(`${g.title.en}: Completing Sentences`, `${g.title["zh-CN"]}：补全句子`),
        explanation: joined(g.use.explanation, gapExample(second, glossary), watchOut(typical(use, second, glossary), glossary)),
        question: USE_QUESTION,
        items: use,
        why: (right, shown) => {
          const note = noteOf(right, glossary);
          const whole = filled(shown, right);
          const step2 = note
            ? t(`**Step 2.** ${note.en}. So the gap takes ${right}: ${whole}`, `**第二步。** ${note["zh-CN"]}。所以填“${right}”：${whole}`)
            : t(`**Step 2.** The gap takes ${right}: ${whole}`, `**第二步。** 空白处填“${right}”：${whole}`);
          const step1 = besideGap(shown);
          return joined(t(`**Step 1.** ${step1.en}`, `**第一步。** ${step1["zh-CN"]}`), step2, check);
        },
        whyNot,
      },
      {
        suffix: "form",
        title: t(`${g.title.en}: The Right Sentence`, `${g.title["zh-CN"]}：正确的句子`),
        explanation: joined(g.form.explanation, sentenceExample(example, glossary), watchOut(typical(form, example, glossary), glossary)),
        question: FORM_QUESTION,
        items: form,
        why: (right, _shown, wrong = []) =>
          joined(
            differences(right, wrong, glossary),
            t(`**Step 2.** Only one sentence is right there: ${right}`, `**第二步。** 只有这个句子在那里是对的：${right}`),
            check,
          ),
        whyNot,
      },
    ];
    const prerequisites = n === 1 || k === 0 ? [spec.after] : [];
    if (n > 1) prerequisites.push(levelGrammarId(spec.level, n - 1));
    const intro = joined(g.summary, gapExample(first, glossary));
    return drillTopic({ id, title: g.title, summary: g.summary, intro, prerequisites, points });
  });
}
