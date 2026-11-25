import { type Generator, joinText, type KnowledgePointDef, type Problem, type Rng, same as sameText, type Text, t } from "@ga/content";

/** quote sets text as a block quote, every line of it. */
const quote = (s: string) =>
  s
    .split("\n")
    .map((line) => (line === "" ? ">" : `> ${line}`))
    .join("\n");

/** Why builds the solution of an item from its right answer and its sentence, in every locale. */
export type Why = (right: string, shown: string) => Text;

/** ChoiceItem is one bank item of a choice: what to show, the right option and the wrong ones. */
export type ChoiceItem = readonly [shown: string, right: string, wrong: readonly string[]];

/**
 * WhyNot builds the feedback for choosing a wrong option: what that option shows about the learner's reading, without
 * repeating the solution. position is the option's place among the item's wrong options, for banks that list their
 * wrong options in a fixed order of kinds.
 */
export type WhyNot = (wrong: string, right: string, shown: string, position: number) => Text;

/**
 * choiceGenerator picks an item of a bank by seed and shuffles its options. Each wrong option is a plausible mistake, so
 * it also serves as a listed wrong response; with whyNot, choosing it gets feedback of its own.
 */
export function choiceGenerator(question: Text, bank: readonly ChoiceItem[], why: Why, whyNot?: WhyNot): Generator {
  return (rng: Rng): Problem => {
    const [shown, right, wrong] = rng.cycle(bank);
    const options = rng.shuffle([right, ...wrong]);
    const answer = options.indexOf(right);
    return {
      prompt: shown === "" ? question : joinText([question, sameText(quote(shown))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(sameText) } },
      solution: why(right, shown),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      ...(whyNot && {
        mistakes: wrong.map((w, position) => ({ response: String(options.indexOf(w)), feedback: whyNot(w, right, shown, position) })),
      }),
    };
  };
}

/** TypedItem is one bank item of a typed answer: what to show, the accepted forms with the first shown as the answer, and likely errors. */
export interface TypedItem {
  readonly shown: string;
  /** accepted are the checker's data; the first must also be a plain sentence, shown as the answer unless canonical says otherwise. */
  readonly accepted: readonly string[];
  readonly canonical?: string;
  /** wrong are plausible wrong responses, each of them rejected. */
  readonly wrong: readonly string[];
  /** instruction adds to the question for this item, such as the word to use. */
  readonly instruction?: Text;
}

/** typedGenerator picks an item of a bank by seed; the learner types the answer. Each listed wrong response gets feedback: from whyNot when given, otherwise from typedWhyNot. */
export function typedGenerator(
  checker: "sentence" | "sentence-pattern" | "word-form",
  question: Text,
  bank: readonly TypedItem[],
  why: Why,
  whyNot?: WhyNot,
): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const canonical = item.canonical ?? item.accepted[0] ?? "";
    return {
      prompt: joinText([question, ...(item.instruction ? [item.instruction] : []), sameText(quote(item.shown))]),
      answer: { checker, expected: [...item.accepted], input: { kind: "text" } },
      solution: why(canonical, item.shown),
      canonical,
      wrong: [...item.wrong],
      mistakes: item.wrong.map((w, position) => ({
        response: w,
        feedback: (whyNot ?? typedWhyNot(checker))(w, canonical, item.shown, position),
      })),
    };
  };
}

/** words splits a response into its words, punctuation kept on them. */
const words = (s: string) =>
  s
    .trim()
    .split(/\s+/u)
    .filter((w) => w !== "");

/** bare is a word or sentence without case or punctuation, to tell those mistakes from others. */
const bare = (s: string) =>
  s
    .toLowerCase()
    .replace(/[^\p{L}\p{N}\s']/gu, "")
    .replace(/\s+/gu, " ")
    .trim();

/** Span is where a wrong sentence parts from a right one: the wrong words, the right words they stand for, and the words around. */
export interface Span {
  readonly wrong: string;
  readonly right: string;
  readonly before: string;
  readonly after: string;
}

/** spanOf finds the one stretch of words where a wrong sentence differs from a right one, ignoring case and punctuation. */
export function spanOf(wrong: string, right: string): Span {
  const a = words(wrong);
  const b = words(right);
  let head = 0;
  while (head < a.length && head < b.length && bare(a[head]!) === bare(b[head]!)) head++;
  let tail = 0;
  while (tail < a.length - head && tail < b.length - head && bare(a[a.length - 1 - tail]!) === bare(b[b.length - 1 - tail]!)) tail++;
  return {
    wrong: a.slice(head, a.length - tail).join(" "),
    right: b.slice(head, b.length - tail).join(" "),
    before: a[head - 1] ?? "",
    after: a[a.length - tail] ?? "",
  };
}

/** Marks are the differences of capitals and punctuation between two sentences with the same words. */
export interface Marks {
  /** lowered are the words of the wrong sentence, without their marks, written small where the right one has a capital. */
  readonly lowered: readonly string[];
  /** raised are the words of the wrong sentence written with a capital where the right one has none. */
  readonly raised: readonly string[];
  /** missing are the words of the wrong sentence that lack a mark the right one has after them, with that mark. */
  readonly missing: readonly (readonly [word: string, mark: string])[];
  /** extra are the words of the wrong sentence followed by a mark the right one does not have, with that mark. */
  readonly extra: readonly (readonly [word: string, mark: string])[];
}

/** marksOf compares the capitals and punctuation of two sentences, or is undefined when their words differ. */
export function marksOf(wrong: string, right: string): Marks | undefined {
  const a = words(wrong);
  const b = words(right);
  if (a.length !== b.length || a.some((w, i) => bare(w) !== bare(b[i]!))) return undefined;
  const trail = (w: string) => /[^\p{L}\p{N}']*$/u.exec(w)?.[0] ?? "";
  const letter = (w: string) => /\p{L}/u.exec(w)?.[0] ?? "";
  const lowered: string[] = [];
  const raised: string[] = [];
  const missing: (readonly [string, string])[] = [];
  const extra: (readonly [string, string])[] = [];
  a.forEach((full, i) => {
    const r = b[i]!;
    const w = full.replace(/[^\p{L}\p{N}']+$/u, "");
    const [x, y] = [letter(w), letter(r)];
    if (x !== y && x.toLowerCase() === y.toLowerCase()) (x === x.toLowerCase() ? lowered : raised).push(w);
    const [m, n] = [trail(full), trail(r)];
    if (m !== n) {
      if (n !== "" && !m.includes(n)) missing.push([w, n]);
      if (m !== "" && !n.includes(m)) extra.push([w, m]);
    }
  });
  return { lowered, raised, missing, extra };
}

/** reordered is whether a wrong sentence has the same words as a right one in another order. */
export function reordered(wrong: string, right: string): boolean {
  const sorted = (s: string) => bare(s).split(" ").sort().join(" ");
  return bare(wrong) !== bare(right) && sorted(wrong) === sorted(right);
}

/** listed joins words as *a*, *b* and *c* in English and *a*、*b*、*c* in Chinese. */
export function listed(items: readonly string[]): Text {
  const marked = items.map((w) => `*${w}*`);
  const en = marked.length < 2 ? (marked[0] ?? "") : `${marked.slice(0, -1).join(", ")} and ${marked[marked.length - 1]}`;
  return t(en, marked.join("、"));
}

/** wordWhyNot names what is wrong with a typed word form: unchanged, a letter short or over, or a wrong letter, and where. */
function wordWhyNot(wrong: string, right: string, shown: string): Text {
  if (
    shown
      .toLowerCase()
      .split(/[^\p{L}']+/u)
      .includes(wrong.toLowerCase()) &&
    wrong.toLowerCase() !== right.toLowerCase()
  ) {
    return t(
      `*${wrong}* is the word as it was given, unchanged. The sentence needs a different form of it: look at what the rest of the sentence asks for.`,
      `*${wrong}* 是题目给出的原词，没有变形。这个句子需要它的另一种形式：看看句子其余部分要求的是哪种形式。`,
    );
  }
  if (wrong.toLowerCase() === right.toLowerCase()) {
    return t(`*${wrong}* has the right letters but the wrong capitals.`, `*${wrong}* 字母对了，但大小写不对。`);
  }
  const lower = wrong.toLowerCase();
  const target = right.toLowerCase();
  if (target.startsWith(lower)) {
    return t(
      `*${wrong}* stops short: the word the sentence needs has more letters after *${wrong}*. Look at what the rest of the sentence asks for.`,
      `*${wrong}* 没写完：句子需要的词在 *${wrong}* 后面还有字母。看看句子其余部分要求的是哪种形式。`,
    );
  }
  if (lower.startsWith(target)) {
    return t(
      `*${wrong}* adds an ending the sentence does not need. Look at what the rest of the sentence asks for.`,
      `*${wrong}* 多加了句子不需要的词尾。看看句子其余部分要求的是哪种形式。`,
    );
  }
  if (lower.endsWith("ed") && !target.endsWith("ed") && lower.slice(0, 2) === target.slice(0, 2)) {
    return t(
      `*${wrong}* adds the regular ending *-ed*, but this word does not take it: its form has to be learned on its own.`,
      `*${wrong}* 加了规则词尾 *-ed*，但这个词不这样变：它的形式要单独记住。`,
    );
  }
  let start = 0;
  while (start < wrong.length && wrong[start] === right[start]) start++;
  if (start < 2) {
    return t(
      `*${wrong}* is a different word from the one this sentence needs. Read the words around it again and think which word they go with.`,
      `*${wrong}* 不是这个句子需要的词。再读一读它前后的词，想想它们和哪个词搭配。`,
    );
  }
  const kept = wrong.slice(0, start);
  const shape =
    wrong.length < right.length
      ? t("is a letter or more short", "少了字母")
      : wrong.length > right.length
        ? t("has a letter or more too many", "多了字母")
        : t("has a wrong letter", "有字母写错了");
  return t(
    `*${wrong}* ${shape.en}, going wrong after *${kept}*. Recall the spelling rule for this form and build it again.`,
    `*${wrong}* ${shape["zh-CN"]}，在 *${kept}* 之后出错。回想这种形式的拼写规则，再写一遍。`,
  );
}

/** sentenceWhyNot names the part of a typed sentence that goes wrong, by the words around it, without giving the right words. */
function sentenceWhyNot(wrong: string, right: string, shown: string): Text {
  if (wrong.trim() === shown.trim()) {
    return t(
      "That is the sentence as it was given, unchanged. Make the change the question asks for.",
      "这是题目给出的原句，没有改动。按题目要求做出修改。",
    );
  }
  if (bare(wrong) === bare(right)) {
    return t(
      `The words of *${wrong}* are right, but check its capital letters and punctuation: where the sentence and any name start, and how it ends.`,
      `*${wrong}* 的用词没问题，但要检查大写和标点：句子和专有名词的开头，以及句末。`,
    );
  }
  const a = words(wrong);
  const b = words(right);
  let head = 0;
  while (head < a.length && head < b.length && bare(a[head]!) === bare(b[head]!)) head++;
  let tail = 0;
  while (tail < a.length - head && tail < b.length - head && bare(a[a.length - 1 - tail]!) === bare(b[b.length - 1 - tail]!)) tail++;
  const span = a.slice(head, a.length - tail).join(" ");
  const before = a[head - 1];
  const after = a[a.length - tail];
  if (span === "") {
    const place =
      before && after
        ? t(`between *${before}* and *${after}*`, `在 *${before}* 和 *${after}* 之间`)
        : before
          ? t(`after *${before}*`, `在 *${before}* 之后`)
          : t(`before *${after ?? ""}*`, `在 *${after ?? ""}* 之前`);
    return t(
      `Something is missing ${place.en}. Read the sentence aloud and listen for the gap.`,
      `${place["zh-CN"]}少了内容。把句子读出来，听听哪里断了。`,
    );
  }
  if (b.length - head - tail <= 0) {
    return t(
      `*${span}* does not belong in this sentence. Take it out and read the sentence again.`,
      `*${span}* 不应出现在这个句子里。去掉它，再把句子读一遍。`,
    );
  }
  return t(
    `The sentence goes wrong at *${span}*. Check that part against the rule of this lesson.`,
    `句子在 *${span}* 这里出错。对照本课的规则检查这一部分。`,
  );
}

/** typedWhyNot is the feedback for a listed wrong response of a typed problem whose bank gives none of its own. */
export function typedWhyNot(checker: "sentence" | "sentence-pattern" | "word-form"): WhyNot {
  return (wrong, right, shown) =>
    checker === "word-form" && words(wrong).length === 1 && words(right).length === 1
      ? wordWhyNot(wrong, right, shown)
      : sentenceWhyNot(wrong, right, shown);
}

/** OrderItem is one bank item of an order: the items in a right order, and any other orders that are also right. */
export interface OrderItem {
  readonly sentences: readonly string[];
  /** alsoRight lists further right orders, as indexes into sentences. */
  readonly alsoRight?: readonly (readonly number[])[];
}

/** orderGenerator picks an item of a bank by seed and shuffles its sentences, never showing them already in a right order. */
export function orderGenerator(question: Text, bank: readonly OrderItem[], why: Why): Generator {
  return (rng: Rng): Problem => {
    const { sentences, alsoRight = [] } = rng.cycle(bank);
    const rightOrders = [sentences.map((_, i) => i), ...alsoRight];
    const isRight = (order: readonly number[]) => rightOrders.some((o) => o.join() === order.join());
    let shuffled = rng.shuffle(sentences.map((_, i) => i));
    // A rotation of a right order keeps the sentences out of order, so this ends after one pass.
    for (let tries = 0; isRight(shuffled) && tries < sentences.length; tries++) shuffled = [...shuffled.slice(1), shuffled[0]!];
    const position = (from: readonly number[]) => from.map((original) => shuffled.indexOf(original));
    const expected = rightOrders.map(position);
    const canonical = expected[0]!.join(",");
    const asShown = shuffled.map((_, i) => i).join(",");
    const firsts = new Set(rightOrders.map((o) => o[0]!));
    return {
      prompt: question,
      answer: {
        checker: "order",
        expected: expected.map((o) => [...o]),
        input: { kind: "order", items: shuffled.map((i) => sameText(sentences[i]!)) },
      },
      solution: why(sentences.join(" "), ""),
      canonical,
      ...(isRight(shuffled)
        ? { wrong: [] }
        : {
            wrong: [asShown],
            mistakes: [{ response: asShown, feedback: keptAsShown(sentences[shuffled[0]!]!, firsts.has(shuffled[0]!)) }],
          }),
    };
  };
}

/** keptAsShown is the feedback for leaving the items in the order they were shown: whether the first of them can open the order. */
export function keptAsShown(first: string, opens: boolean): Text {
  return opens
    ? t(
        `That is the order the items were shown in, unchanged. *${first}* can open it, but at least one later item is out of place: check that each one follows from the one before.`,
        `这是题目给出时的原顺序，没有调整。*${first}* 可以放在开头，但后面至少有一项位置不对：逐一检查每一项是否紧接上一项。`,
      )
    : t(
        `That is the order the items were shown in, unchanged, and *${first}* does not come first. Find the item that has to open the order, then build on it.`,
        `这是题目给出时的原顺序，没有调整，而 *${first}* 并不该排在第一。先找出必须排在开头的那一项，再往后接。`,
      );
}

/** typed builds a TypedItem whose answer is canonical; patterns replace it as the accepted forms when several are right. */
export function typed(
  shown: string,
  canonical: string,
  wrong: readonly string[],
  patterns?: readonly string[],
  instruction?: Text,
): TypedItem {
  return { shown, canonical, accepted: patterns ?? [canonical], wrong, ...(instruction && { instruction }) };
}

/** WritingItem is one bank item of a writing task: what to write about, any text to work from, and a model answer by the author. */
export interface WritingItem {
  /** task is what to write, in English; it follows the question. */
  readonly task: string;
  /** source is text the task works from, such as notes to turn into a paragraph. */
  readonly source?: string;
  /** model is one good response: shown to the judge, and to the learner after a verdict that counts. */
  readonly model: string;
}

/** WritingLimits are the length a writing task asks for. */
export interface WritingLimits {
  readonly minWords: number;
  readonly maxChars: number;
}

/**
 * writingGenerator picks an item of a bank by seed; the learner writes a text that a model
 * judges against criteria of the topic. A response far too short is a listed wrong one.
 */
export function writingGenerator(
  question: Text,
  bank: readonly WritingItem[],
  criteria: readonly string[],
  limits: WritingLimits,
  why: (model: string) => Text,
): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(bank);
    const stub = item.model.split(/\s+/u).slice(0, 3).join(" ");
    return {
      prompt: joinText([question, sameText(item.task), ...(item.source ? [sameText(quote(item.source))] : [])]),
      answer: {
        checker: "writing",
        expected: { ...limits },
        input: { kind: "writing", ...limits },
        judged: { criteria: [...criteria], ...(item.source && { source: item.source }) },
      },
      solution: why(item.model),
      canonical: item.model,
      wrong: [stub],
      mistakes: [
        {
          response: stub,
          feedback: t(
            `*${stub}* is only three words and stops before a single thought is finished. This task needs at least ${limits.minWords} words that carry out all of it.`,
            `*${stub}* 只有三个词，连一个意思都没说完。这项任务至少需要 ${limits.minWords} 个词，并把要求的内容都写到。`,
          ),
        },
      ],
    };
  };
}

/** point builds a knowledge point. */
export function point(id: string, title: Text, explanation: Text, generate: Generator): KnowledgePointDef {
  return { id, title, explanation, generate };
}
