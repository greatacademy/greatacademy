// The grammar topics of the levels (docs/chinese-curriculum.md §6, §8.4): one grammar point of GF 0025-2021, or a few
// small ones, a topic, placed in the unit whose theme uses it. Each topic has two knowledge points: choosing the form
// that completes a sentence, and choosing the one sentence of four that is right. Every sentence and every wrong option
// uses only the characters taught by the end of its unit.

import { type Text, type TopicDef, t } from "@ga/content";

import { type DrillItem, type DrillPoint, drillItem, drillTopic, lines } from "../grammar/drill.ts";

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
    const points: readonly [DrillPoint, DrillPoint] = [
      {
        suffix: "use",
        title: t(`${g.title.en}: Completing Sentences`, `${g.title["zh-CN"]}：补全句子`),
        explanation: g.use.explanation,
        question: USE_QUESTION,
        items: use,
        why: (right, shown) => {
          const whole = shown.replace(GAP, right);
          return t(`The sentence reads: ${whole}`, `完整的句子是：${whole}`);
        },
      },
      {
        suffix: "form",
        title: t(`${g.title.en}: The Right Sentence`, `${g.title["zh-CN"]}：正确的句子`),
        explanation: g.form.explanation,
        question: FORM_QUESTION,
        items: form,
        why: (right) => t(`The right sentence is: ${right}`, `正确的句子是：${right}`),
      },
    ];
    const prerequisites = n === 1 || k === 0 ? [spec.after] : [];
    if (n > 1) prerequisites.push(levelGrammarId(spec.level, n - 1));
    return drillTopic({ id, title: g.title, summary: g.summary, prerequisites, points });
  });
}
