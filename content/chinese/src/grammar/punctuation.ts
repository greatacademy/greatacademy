// Punctuation topics (docs/chinese-curriculum.md §6, after GB/T 15834-2011): sentences written for the subject, each
// mark the topic teaches taken out in turn. The learner chooses the mark for the gap among the marks the topic contrasts,
// so a sentence with three such marks gives three items.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-chinese";

/** Mark is a punctuation mark: its form (a pair of marks written as both, as 《》), its name and when it is used. */
export interface Mark {
  readonly form: string;
  readonly name: Text;
  readonly use: Text;
}

/** marks are the punctuation marks the topics teach, by form. */
export const marks: Readonly<Record<string, Mark>> = Object.fromEntries(
  (
    [
      ["。", t("full stop", "句号"), t("ends a statement", "用在陈述句的末尾")],
      ["？", t("question mark", "问号"), t("ends a question", "用在疑问句的末尾")],
      ["！", t("exclamation mark", "叹号"), t("ends an exclamation or a forceful command", "用在感叹句或语气强烈的祈使句的末尾")],
      ["，", t("comma", "逗号"), t("marks a pause within a sentence", "用在句子内部一般性的停顿处")],
      ["、", t("enumeration comma", "顿号"), t("separates the words of a list", "用在并列的词语之间")],
      [
        "：",
        t("colon", "冒号"),
        t(
          "introduces words spoken after 说 or 问, or what a summary announces",
          "用在“说”“问”等词后面，提示下面是说的话；也用在总说之后，提示下文",
        ),
      ],
      ["“”", t("quotation marks", "引号"), t("enclose quoted words, or words singled out", "标出直接引用的话，或需要特别指出的词语")],
      [
        "《》",
        t("title marks", "书名号"),
        t("enclose the title of a book, article, paper, film or song", "标出书名、篇名、报刊名、影视作品名、歌曲名等"),
      ],
      ["……", t("ellipsis", "省略号"), t("marks what is left out, or speech that breaks off", "标出省略的部分，或表示说话断断续续")],
      [
        "——",
        t("dash", "破折号"),
        t(
          "marks words that explain, a sound drawn out, or a sudden turn of what is said",
          "标示解释说明的话、声音的延长，或话题的突然转换",
        ),
      ],
      [
        "；",
        t("semicolon", "分号"),
        t(
          "separates parallel clauses, above all those with commas of their own",
          "用在复句中并列的分句之间，特别是分句内已经用了逗号的时候",
        ),
      ],
    ] as const
  ).map(([form, name, use]) => [form, { form, name, use }]),
);

/** GAP stands for the mark taken out. */
const GAP = "＿＿";

/** LONG are the marks written with two characters that are not a pair. */
const LONG: ReadonlySet<string> = new Set(["……", "——", GAP]);

/** PunctuationSpec describes a punctuation topic: the marks taken out, the marks offered with them, and its sentences. */
export interface PunctuationSpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  readonly taught: readonly string[];
  readonly offered: readonly string[];
  readonly explanation: Text;
  /** confusions narrow the marks put in place of a mark, where another of the offered marks could also be right. */
  readonly confusions?: Readonly<Record<string, readonly string[]>>;
  readonly sentences: readonly string[];
}

/** Gap is a mark of a sentence taken out: where it starts, and where the second of a pair starts. */
interface Gap {
  readonly form: string;
  readonly at: number;
  readonly close?: number;
}

/** gaps finds the marks of a sentence a topic takes out, in order; the second of a pair is the next after the first. */
function gaps(sentence: string, taught: readonly string[]): readonly Gap[] {
  const found: Gap[] = [];
  for (const form of taught) {
    const pair = form.length === 2 && !LONG.has(form);
    const open = pair ? form[0]! : form;
    let at = sentence.indexOf(open);
    while (at >= 0) {
      if (pair) {
        const close = sentence.indexOf(form[1]!, at + 1);
        if (close < 0) throw new Error(`punctuation: an unclosed ${form} in ${sentence}`);
        found.push({ form, at, close });
      } else found.push({ form, at });
      at = sentence.indexOf(open, at + open.length);
    }
  }
  return found.sort((a, b) => a.at - b.at);
}

const isPair = (form: string): boolean => form.length === 2 && !LONG.has(form);

/** put writes `by` where a sentence has the mark of a gap: the gap itself, or another mark. A pair put for a single mark is not written (undefined); a single mark put for a pair leaves the pair out. */
function put(sentence: string, gap: Gap, by: string): string | undefined {
  if (gap.close === undefined) {
    if (isPair(by)) return undefined;
    return sentence.slice(0, gap.at) + by + sentence.slice(gap.at + gap.form.length);
  }
  const [open, close] = by === GAP ? [GAP, GAP] : isPair(by) ? [by[0]!, by[1]!] : ["", ""];
  return sentence.slice(0, gap.at) + open + sentence.slice(gap.at + 1, gap.close) + close + sentence.slice(gap.close + 1);
}

/** withGap is a sentence with one of its marks, or both of a pair, taken out. */
const withGap = (sentence: string, gap: Gap): string => put(sentence, gap, GAP) ?? sentence;

/** CHECKS is how many rounds the sentences are checked in, each with other misplaced marks. */
const CHECKS = 3;

/**
 * misplaced are two versions of a sentence with a wrong mark, different pairs in different rounds: a mark replaced by
 * another the topic offers, or a mark that ends a quotation moved outside its quotation marks.
 */
function misplaced(sentence: string, found: readonly Gap[], others: (form: string) => readonly string[], round: number): readonly string[] {
  const candidates = new Set<string>();
  for (const gap of found) {
    for (const by of others(gap.form)) {
      const version = put(sentence, gap, by);
      if (version !== undefined && version !== sentence) candidates.add(version);
    }
  }
  const quoted = /([。？！])”$/u.exec(sentence);
  if (quoted) candidates.add(`${sentence.slice(0, -2)}”${quoted[1]}`);
  const all = [...candidates];
  if (all.length <= 2) return all;
  return [all[round % all.length]!, all[(round + 1) % all.length]!];
}

/** punctuationTopic builds a punctuation topic; its bank goes sentence by sentence, the first gap of each, then the second, so consecutive seeds never show the same sentence. */
export function punctuationTopic(spec: PunctuationSpec): TopicDef {
  const offered = [...spec.taught, ...spec.offered];
  for (const form of offered) if (!marks[form]) throw new Error(`${spec.id}: an unknown mark ${form}`);
  const others = (form: string): readonly string[] => spec.confusions?.[form] ?? offered.filter((f) => f !== form);
  const full = new Map<string, string>();
  const bySentence = spec.sentences.map((s) => {
    const found = gaps(s, spec.taught);
    if (found.length === 0) throw new Error(`${spec.id}: nothing to take out of ${s}`);
    return found.map((g): ChoiceItem => {
      const shown = withGap(s, g);
      full.set(shown, s);
      // A pair is offered only pairs: a single mark would leave the gap's other half unexplained.
      return [shown, g.form, others(g.form).filter((f) => g.close === undefined || isPair(f))];
    });
  });
  const rounds = Math.max(...bySentence.map((items) => items.length));
  const bank: readonly ChoiceItem[] = Array.from({ length: rounds }, (_, r) => r).flatMap((r) =>
    bySentence.flatMap((items) => (items[r] === undefined ? [] : [items[r]])),
  );
  const checkBank: readonly ChoiceItem[] = Array.from({ length: CHECKS }, (_, r) => r).flatMap((r) =>
    spec.sentences.map((sentence): ChoiceItem => ["", sentence, [...misplaced(sentence, gaps(sentence, spec.taught), others, r)]]),
  );
  const markList = offered.map((f) => `- **${f}** ${marks[f]!.name["zh-CN"]}：${marks[f]!.use["zh-CN"]}`).join("\n");
  const markListEn = offered.map((f) => `- **${f}** ${marks[f]!.name.en}: ${marks[f]!.use.en}`).join("\n");
  const name = (form: string): Text => marks[form]!.name;
  return {
    id: spec.id,
    title: spec.title,
    summary: t(
      `Choosing between ${offered.map((f) => name(f).en).join(", ")} where a sentence needs one.`,
      `在句子中正确使用${offered.map((f) => name(f)["zh-CN"]).join("、")}。`,
    ),
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: spec.sentences.length,
    strand: "grammar",
    knowledgePoints: [
      point(
        `${spec.id}-marks`,
        t("Choosing the Mark", "选用标点"),
        t(`${spec.explanation.en}\n\n${markListEn}`, `${spec.explanation["zh-CN"]}\n\n${markList}`),
        choiceGenerator(
          t("Which punctuation mark goes in the gap?", "横线处应该用什么标点符号？"),
          bank,
          (right, shown) =>
            t(
              `Use the ${name(right).en} here: it ${marks[right]!.use.en}.\n\n${full.get(shown) ?? ""}`,
              `这里用${name(right)["zh-CN"]}“${right}”：${marks[right]!.use["zh-CN"]}。\n\n${full.get(shown) ?? ""}`,
            ),
          (wrong) =>
            t(
              `The ${name(wrong).en} ${marks[wrong]!.use.en}; that is not what is needed here.`,
              `${name(wrong)["zh-CN"]}“${wrong}”${marks[wrong]!.use["zh-CN"]}，这里不是这种情况。`,
            ),
        ),
      ),
      point(
        `${spec.id}-checking`,
        t("Checking a Sentence", "检查标点"),
        t(
          `To check a sentence, read it mark by mark and ask what each one does there.\n\n${markListEn}`,
          `检查标点时，一个一个地看句子里的标点，想一想每个标点在这里起什么作用。\n\n${markList}`,
        ),
        choiceGenerator(
          t("Which sentence is punctuated correctly?", "哪个句子的标点符号用得正确？"),
          checkBank,
          () => t("This sentence uses each mark for what it does.", "这个句子的每个标点都用对了。"),
          (wrong, right) => t(`This one has a wrong mark. Correct: ${right}`, `这个句子有标点用错了。正确的是：${right}`),
        ),
      ),
    ],
  };
}
