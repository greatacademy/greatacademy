// Punctuation topics (docs/chinese-curriculum.md §6, after GB/T 15834-2011): sentences written for the subject, each
// mark the topic teaches taken out in turn. The learner chooses the mark for the gap among the marks the topic contrasts,
// so a sentence with three such marks gives three items.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-chinese";

/** Mark is a punctuation mark: its form (a pair of marks written as both, as 《》), its name, when it is used, and how to check that it is. */
export interface Mark {
  readonly form: string;
  readonly name: Text;
  readonly use: Text;
  readonly check: Text;
}

/** CHECKS_OF are the tests that a mark is right where it stands, by form. */
const CHECKS_OF: Readonly<Record<string, Text>> = {
  "。": t(
    "Read the words before it alone: they tell something complete and ask nothing.",
    "单独读一读它前面的话：说了一件完整的事，没有提问。",
  ),
  "？": t("The words before it can be answered: they ask.", "它前面的话可以回答：是在提问。"),
  "！": t("Read the words before it with strong feeling: they cry out or command.", "带着强烈的感情读一读它前面的话：是在感叹或命令。"),
  "，": t("The sentence is not over after it: what follows carries the same sentence on.", "它后面句子还没有完：后面的话接着说同一句。"),
  "、": t(
    "The words on each side are items of one list: swap them and the sentence means the same.",
    "它两边是并列的词语：调换它们的位置，句子意思不变。",
  ),
  "：": t(
    "What follows is announced by what comes before: the words spoken after 说 or 问, or what a summary promised.",
    "它后面的话是前面提示出来的：“说”“问”后面说的话，或总说之后的分说。",
  ),
  "“”": t(
    "Take the words inside out: they are just what was said, or a name singled out.",
    "把里面的话拿出来看：正是说的原话，或是特别指出的称号。",
  ),
  "《》": t(
    "The words inside name a work: a book, article, paper, film or song.",
    "里面的话是一部作品的名字：书、文章、报刊、影视作品或歌曲。",
  ),
  "……": t(
    "Something is left unsaid there: the list could go on, or the speaker breaks off.",
    "那里有话没有说出来：列举还可以往下列，或者说话断断续续。",
  ),
  "——": t(
    "The words after it explain what came before, draw a sound out, or turn the talk; take explaining words out and the rest still stands.",
    "它后面的话解释前面的话、延长声音，或转换话题；把解释的话拿掉，剩下的仍然成句。",
  ),
  "；": t(
    "Each side is a clause of its own, often with a comma inside, and the two stand side by side.",
    "它两边各是一个分句，分句里常常已有逗号，两个分句是并列的。",
  ),
};

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
  ).map(([form, name, use]) => [form, { form, name, use, check: CHECKS_OF[form]! }]),
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
  /** intro is the topic's introduction, which walks one sentence's marks. */
  readonly intro: Text;
  /** watch is the mistake to watch for, which ends both explanations. */
  readonly watch: Text;
  /** contrasts say why a mark is wrong where another belongs, by the right mark and the wrong one, separated by a space. */
  readonly contrasts: Readonly<Record<string, Text>>;
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

/** Misplaced is a version of a sentence with a wrong mark: the gap whose mark is wrong and what stands there, or the end mark of a quotation moved outside it. */
interface Misplaced {
  readonly version: string;
  readonly gap?: Gap;
  readonly by?: string;
}

/**
 * misplaced are two versions of a sentence with a wrong mark, different pairs in different rounds: a mark replaced by
 * another the topic offers, or a mark that ends a quotation moved outside its quotation marks.
 */
function misplaced(
  sentence: string,
  found: readonly Gap[],
  others: (form: string) => readonly string[],
  round: number,
): readonly Misplaced[] {
  const candidates = new Map<string, Misplaced>();
  for (const gap of found) {
    for (const by of others(gap.form)) {
      const version = put(sentence, gap, by);
      if (version !== undefined && version !== sentence && !candidates.has(version)) candidates.set(version, { version, gap, by });
    }
  }
  const quoted = /([。？！])”$/u.exec(sentence);
  if (quoted) {
    const version = `${sentence.slice(0, -2)}”${quoted[1]}`;
    candidates.set(version, { version });
  }
  const all = [...candidates.values()];
  if (all.length <= 2) return all;
  return [all[round % all.length]!, all[(round + 1) % all.length]!];
}

/** STOPS are the characters a stretch of words before a mark goes back to. */
const STOPS: ReadonlySet<string> = new Set([..."。？！，、：；“”《》…—＿"]);

/** before is the stretch of words just before a position, back to the mark before it. */
function before(sentence: string, at: number): string {
  let from = at;
  while (from > 0 && !STOPS.has(sentence[from - 1]!)) from--;
  return sentence.slice(from, at);
}

/** after is the stretch of words just after a position, up to the next mark. */
function after(sentence: string, at: number): string {
  let to = at;
  while (to < sentence.length && !STOPS.has(sentence[to]!)) to++;
  return sentence.slice(at, to);
}

/** around says where a gap is, by the words beside it: round those inside a pair, after those before a single mark, or before those after it. */
function around(sentence: string, gap: Gap): Text {
  if (gap.close !== undefined) {
    const inside = sentence.slice(gap.at + 1, gap.close);
    return t(`round ${inside}`, `“${inside}”两边`);
  }
  const words = before(sentence, gap.at);
  if (words !== "") return t(`after ${words}`, `“${words}”后面`);
  const next = after(sentence, gap.at + gap.form.length);
  return t(`before ${next}`, `“${next}”前面`);
}

/** qm writes a mark in Chinese text, in quotation marks unless it is them. */
const qm = (form: string): string => (form === "“”" ? form : `“${form}”`);

/** stop ends an English sentence with a full stop, unless it already ends with a Chinese mark. */
const stop = (s: string): string => (/[。？！”…—]$/u.test(s) ? s : `${s}.`);

/** punctuationTopic builds a punctuation topic; its bank goes sentence by sentence, the first gap of each, then the second, so consecutive seeds never show the same sentence. */
export function punctuationTopic(spec: PunctuationSpec): TopicDef {
  const offered = [...spec.taught, ...spec.offered];
  for (const form of offered) if (!marks[form]) throw new Error(`${spec.id}: an unknown mark ${form}`);
  const others = (form: string): readonly string[] => spec.confusions?.[form] ?? offered.filter((f) => f !== form);
  const contrast = (right: string, wrong: string): Text => {
    const c = spec.contrasts[`${right} ${wrong}`];
    if (!c) throw new Error(`${spec.id}: no contrast of ${right} with ${wrong}`);
    return c;
  };
  const name = (form: string): Text => marks[form]!.name;
  const use = (form: string): Text => marks[form]!.use;
  /** gapOf is the gap of a shown sentence, the sentence it was taken from. */
  const gapOf = new Map<string, { sentence: string; gap: Gap }>();
  const bySentence = spec.sentences.map((s) => {
    const found = gaps(s, spec.taught);
    if (found.length === 0) throw new Error(`${spec.id}: nothing to take out of ${s}`);
    return found.map((g): ChoiceItem => {
      const shown = withGap(s, g);
      gapOf.set(shown, { sentence: s, gap: g });
      // A pair is offered only pairs: a single mark would leave the gap's other half unexplained.
      return [shown, g.form, others(g.form).filter((f) => g.close === undefined || isPair(f))];
    });
  });
  const rounds = Math.max(...bySentence.map((items) => items.length));
  const bank: readonly ChoiceItem[] = Array.from({ length: rounds }, (_, r) => r).flatMap((r) =>
    bySentence.flatMap((items) => (items[r] === undefined ? [] : [items[r]])),
  );
  /** wrongOf is how each wrong version of a checked sentence is wrong. */
  const wrongOf = new Map<string, Misplaced>();
  const checkBank: readonly ChoiceItem[] = Array.from({ length: CHECKS }, (_, r) => r).flatMap((r) =>
    spec.sentences.map((sentence): ChoiceItem => {
      const versions = misplaced(sentence, gaps(sentence, spec.taught), others, r);
      for (const v of versions) wrongOf.set(`${sentence}\u0000${v.version}`, v);
      return ["", sentence, versions.map((v) => v.version)];
    }),
  );
  /** misplacedWhy says how a wrong version differs from the right sentence and why that is wrong. */
  const misplacedWhy = (sentence: string, version: string): Text => {
    const m = wrongOf.get(`${sentence}\u0000${version}`);
    if (!m) throw new Error(`${spec.id}: no misplaced version ${version}`);
    if (!m.gap || !m.by) {
      const end = sentence.at(-2) ?? "";
      return t(
        `${version} has its end mark ${end} outside the closing quotation mark; the quoted words are a whole sentence spoken, so ${end} goes inside: ${sentence}`,
        `${version}\n  这一句把句末的“${end}”放到了后引号外面；引号里是说的一句完整的话，“${end}”应该在引号里面：${sentence}`,
      );
    }
    const where = around(sentence, m.gap);
    const why = contrast(m.gap.form, m.by);
    if (m.gap.close !== undefined && !isPair(m.by))
      return t(
        `${version} leaves out the ${name(m.gap.form).en} ${where.en}: ${why.en}.`,
        `${version}\n  这一句去掉了${where["zh-CN"]}的${name(m.gap.form)["zh-CN"]}：${why["zh-CN"]}。`,
      );
    return t(
      `${version} has the ${name(m.by).en} ${m.by} ${where.en}, where it needs the ${name(m.gap.form).en} ${m.gap.form}: ${why.en}.`,
      `${version}\n  这一句在${where["zh-CN"]}用了${name(m.by)["zh-CN"]}${qm(m.by)}，应该用${name(m.gap.form)["zh-CN"]}${qm(m.gap.form)}：${why["zh-CN"]}。`,
    );
  };
  const markList = offered.map((f) => `- **${f}** ${name(f)["zh-CN"]}：${use(f)["zh-CN"]}`).join("\n");
  const markListEn = offered.map((f) => `- **${f}** ${name(f).en}: ${use(f).en}`).join("\n");
  const callout = t(`> **Watch out.** ${spec.watch.en}`, `> **注意。** ${spec.watch["zh-CN"]}`);
  // The worked instance of the first knowledge point: the second sentence's first gap.
  const [shown0, right0, wrongs0] = bank[1] ?? bank[0]!;
  const { sentence: full0, gap: gap0 } = gapOf.get(shown0)!;
  const where0 = around(full0, gap0);
  const wrong0 = wrongs0[0]!;
  const workedMark = t(
    `For example:\n\n> ${shown0}\n\nThe gap stands ${stop(where0.en)} It needs the ${name(right0).en}, which ${use(right0).en}: ${full0} The ${name(wrong0).en} ${wrong0} would be wrong: ${contrast(right0, wrong0).en}.`,
    `例如：\n\n> ${shown0}\n\n横线在${where0["zh-CN"]}，要用${name(right0)["zh-CN"]}，因为${name(right0)["zh-CN"]}${use(right0)["zh-CN"]}：${full0}用${name(wrong0)["zh-CN"]}${qm(wrong0)}就错了：${contrast(right0, wrong0)["zh-CN"]}。`,
  );
  // The worked instance of the second: the first sentence and its first wrong version.
  const [, right1, wrongs1] = checkBank[0]!;
  const workedCheck = t(
    `For example, this sentence is right, and each of its marks passes its test:\n\n> ${right1}\n\nBut this one is wrong:\n\n- ${misplacedWhy(right1, wrongs1[0]!).en}`,
    `例如下面这句是对的，每个标点都经得起检验：\n\n> ${right1}\n\n下面这句就错了：\n\n- ${misplacedWhy(right1, wrongs1[0]!)["zh-CN"]}`,
  );
  return {
    id: spec.id,
    title: spec.title,
    summary: t(
      `Choosing between ${offered.map((f) => name(f).en).join(", ")} where a sentence needs one.`,
      `在句子中正确使用${offered.map((f) => name(f)["zh-CN"]).join("、")}。`,
    ),
    intro: spec.intro,
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: spec.sentences.length,
    strand: "grammar",
    knowledgePoints: [
      point(
        `${spec.id}-marks`,
        t("Choosing the Mark", "选用标点"),
        t(
          `${spec.explanation.en}\n\n${markListEn}\n\n${workedMark.en}\n\n${callout.en}`,
          `${spec.explanation["zh-CN"]}\n\n${markList}\n\n${workedMark["zh-CN"]}\n\n${callout["zh-CN"]}`,
        ),
        choiceGenerator(
          t("Which punctuation mark goes in the gap?", "横线处应该用什么标点符号？"),
          bank,
          (right, shown) => {
            const { sentence, gap } = gapOf.get(shown)!;
            const where = around(sentence, gap);
            return t(
              `**Step 1: read beside the gap.** The gap stands ${stop(where.en)}\n\n**Step 2: choose the mark.** The gap needs the ${name(right).en} ${right}, which ${use(right).en}.\n\n**Check.** Put it back and read the whole sentence: ${sentence} ${marks[right]!.check.en}`,
              `**第一步：看横线两边。**横线在${where["zh-CN"]}。\n\n**第二步：选出标点。**横线处要用${name(right)["zh-CN"]}${qm(right)}，它${use(right)["zh-CN"]}。\n\n**检验。** 把标点放回去，读一读整个句子：${sentence}${marks[right]!.check["zh-CN"]}`,
            );
          },
          (wrong, right) =>
            t(
              `The ${name(wrong).en} ${wrong} ${use(wrong).en}, but not here: ${contrast(right, wrong).en}.`,
              `${name(wrong)["zh-CN"]}${qm(wrong)}${use(wrong)["zh-CN"]}，这里却不是：${contrast(right, wrong)["zh-CN"]}。`,
            ),
        ),
      ),
      point(
        `${spec.id}-checking`,
        t("Checking a Sentence", "检查标点"),
        t(
          `To check a sentence, read it mark by mark and ask what each one does there.\n\n${markListEn}\n\n${workedCheck.en}\n\n${callout.en}`,
          `检查标点时，一个一个地看句子里的标点，想一想每个标点在这里起什么作用。\n\n${markList}\n\n${workedCheck["zh-CN"]}\n\n${callout["zh-CN"]}`,
        ),
        choiceGenerator(
          t("Which sentence is punctuated correctly?", "哪个句子的标点符号用得正确？"),
          checkBank,
          (right) => {
            const found = gaps(right, spec.taught);
            const each = (locale: "en" | "zh-CN") =>
              found
                .map((g) => {
                  const where = around(right, g)[locale];
                  return locale === "en"
                    ? `- ${g.form} ${where}: the ${name(g.form).en}, which ${use(g.form).en}.`
                    : `- ${where}的${qm(g.form)}：${name(g.form)["zh-CN"]}，${use(g.form)["zh-CN"]}。`;
                })
                .join("\n");
            const kinds = [...new Set(found.map((g) => g.form))];
            const tests = (locale: "en" | "zh-CN") =>
              kinds
                .map((f) =>
                  locale === "en"
                    ? `- The ${name(f).en} ${f}. ${marks[f]!.check.en}`
                    : `- ${name(f)["zh-CN"]}${qm(f)}：${marks[f]!.check["zh-CN"]}`,
                )
                .join("\n");
            return t(
              `**Step 1: read mark by mark.** Find each mark the options use differently.\n\n**Step 2: ask what each does.** In this sentence:\n\n${each("en")}\n\n**Check.** Test each kind of mark as a reader would:\n\n${tests("en")}\n\nEach other option breaks such a test at one mark.`,
              `**第一步：逐个看标点。**找出各个选项用得不一样的标点。\n\n**第二步：想想每个标点的作用。**在这个句子中：\n\n${each("zh-CN")}\n\n**检验。** 像读者那样逐种检验：\n\n${tests("zh-CN")}\n\n其他选项都有一个标点经不起这样的检验。`,
            );
          },
          (wrong, right) => misplacedWhy(right, wrong),
        ),
      ),
    ],
  };
}
