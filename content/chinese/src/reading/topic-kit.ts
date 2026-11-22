// The kit of the reading and speaking topics of the stages (docs/chinese-curriculum.md §18.9): passages or scenes written
// for the subject, each with questions whose wrong options carry the reason they are wrong. A solution finds the words
// of the text that answer the question, chooses by them and checks the answer against them; each other option is then
// said to be wrong, and why. The data is written compactly and parsed here, and the parser rejects what it cannot trust:
// a clue that is not in the text, an option given twice, a reason it does not know.

import { type Generator, joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { quote } from "@ga/subject-chinese";

import { recognitionByGrade } from "../characters/index.ts";

/** REASONS are why a wrong option is wrong, by tag: each says it of the option, in English and in Chinese. */
export const REASONS = {
  // Reading.
  unsaid: ["the text does not say this.", "原文没有说到这一点。"],
  other: ["this is in the text, but it answers another question.", "原文里有这个内容，可它回答的是别的问题。"],
  opposite: ["this says the opposite of the text.", "这和原文说的正好相反。"],
  part: ["this is only part of the answer.", "这只说到了一部分，不完整。"],
  life: ["this may be so in life, but the text does not say it.", "生活中也许是这样，可原文并没有这样说。"],
  who: ["this names the wrong one.", "说错了是谁（或是什么）。"],
  sense: ["this does not fit the meaning of the sentence.", "放进句子里，意思讲不通。"],
  rhyme: ["it ends in a different sound, so it does not rhyme.", "它末尾的音不同，读起来不押韵。"],
  mixed: ["some of these characters end in a different sound, so they do not all rhyme.", "这几个字里有的韵母不同，读起来不都押韵。"],
  notend: [
    "some of these characters do not end a line; a rhyme is heard at the ends of lines.",
    "这几个字有的不在句子末尾；押韵要看句末的字。",
  ],
  rhymes: ["this line does end in the rhyme.", "这一句末尾的字是押韵的。"],
  final: ["the characters that end the lines do not end in this sound.", "句末的字读起来末尾不是这个音。"],
  real: ["this really happens; it is not imagined.", "这在生活中真的有，不是想象出来的。"],
  imagined: ["this is imagined; it does not happen in real life.", "这是想象出来的，生活中不会真的有。"],
  lesson: ["the story does not teach this.", "故事讲的不是这个道理。"],
  // Speaking.
  rude: ["this is not polite.", "这样说不礼貌。"],
  harsh: ["this is too sharp and would hurt the other person.", "语气太冲，别人听了会不高兴。"],
  off: ["this does not say what the moment needs.", "答非所问，没有说到这时该说的话。"],
  unclear: ["this is not clear: the listener cannot tell what is meant.", "说得不清楚，听的人不明白是什么意思。"],
  missing: ["this leaves out something the listener needs.", "漏了要紧的内容。"],
  told: ["the telling does say this.", "这一点已经讲了。"],
  order: ["this tells things out of order.", "先后顺序乱了。"],
  address: ["this calls the person in a way that does not suit them.", "称呼不合适。"],
  cutin: ["this cuts in before the other person has finished.", "抢着说，没有等别人把话说完。"],
  queue: ["this pushes in instead of waiting one's turn.", "插队，没有按顺序等。"],
  blame: ["this puts the blame elsewhere instead of saying sorry.", "把错推给别的，没有向别人道歉。"],
  changed: ["this is not what was said.", "和原来说的话不一样。"],
  pushy: ["this only insists on one's own idea and does not talk it over.", "只坚持自己的想法，没有和别人商量。"],
} as const;

/** KNOWN is the share of a topic's characters that must have been taught before it. */
const KNOWN = 0.97;

/** isHan tells a Chinese character. */
export const isHan = (c: string): boolean => /\p{Script=Han}/u.test(c);

/** readableAfter is the first recognition batch of the grade or earlier after which KNOWN of the characters of the texts are taught. */
export function readableAfter(texts: readonly string[], grade: number): string {
  const han = [...texts.join("")].filter(isHan);
  const batches = recognitionByGrade.filter((g) => g.grade <= grade).flatMap((g) => g.batches);
  const known = new Set<string>();
  for (const batch of batches) {
    for (const e of batch.entries) known.add(e.char);
    if (han.filter((c) => known.has(c)).length >= KNOWN * han.length) return batch.topic.id;
  }
  const last = batches.at(-1);
  if (!last) throw new Error(`reading: no recognition batches up to grade ${grade}`);
  return last.topic.id;
}

/** BATCH_ORDER is the place of each recognition batch in the order they are taught. */
const BATCH_ORDER = new Map(recognitionByGrade.flatMap((g) => g.batches).map((b, i) => [b.topic.id, i]));

/** latestBatch is the place of the latest recognition batch a topic needs, directly or through the given topics it follows. */
function latestBatch(id: string, known: ReadonlyMap<string, TopicDef>): number {
  const own = BATCH_ORDER.get(id);
  if (own !== undefined) return own;
  const topic = known.get(id);
  return topic ? Math.max(-1, ...topic.prerequisites.map((p) => latestBatch(p, known))) : -1;
}

/**
 * prerequisitesOf joins the batch by which a topic's texts can be read to the topics it follows, leaving the batch out
 * when one of those, as given in known, already needs it or a later one.
 */
export function prerequisitesOf(batch: string, after: readonly string[], known: readonly TopicDef[]): readonly string[] {
  const byId = new Map(known.map((k) => [k.id, k]));
  const implied = Math.max(-1, ...after.map((a) => latestBatch(a, byId)));
  return (BATCH_ORDER.get(batch) ?? -1) > implied ? [batch, ...after] : after;
}

/** Reason is the tag of why a wrong option is wrong. */
export type Reason = keyof typeof REASONS;

/** Question is one question on a text: what it asks, the right option, the wrong ones with their reasons, and its clue. */
export interface Question {
  readonly ask: Text;
  readonly right: string;
  readonly wrong: readonly (readonly [option: string, reason: Reason])[];
  /** clue is the words of the text that answer the question, as they stand in it. */
  readonly clue: string;
}

/** Piece is a text with its questions for each knowledge point of its topic: a passage, a sign, a verse or a scene. */
export interface Piece {
  readonly title: string;
  readonly body: string;
  /** questions are the questions of each knowledge point, by its index. */
  readonly questions: readonly (readonly Question[])[];
}

/**
 * parsePieces reads texts separated by lines `#` with a title. The lines after a title are the text until the first
 * question. A question is `?k ask in Chinese | ask in English`, k its knowledge point counted from 1, then
 * `= right | clue` and `- wrong ~reason` once for each wrong option.
 */
export function parsePieces(data: string, points: number): readonly Piece[] {
  return data
    .trim()
    .split(/^# /mu)
    .filter((block) => block.trim() !== "")
    .map((block) => {
      const [title = "", ...rows] = block.split("\n").map((l) => l.trim());
      const firstQuestion = rows.findIndex((r) => r.startsWith("?"));
      if (firstQuestion < 1) throw new Error(`piece ${title}: no text or no question`);
      const body = rows
        .slice(0, firstQuestion)
        .filter((r) => r !== "")
        .join("\n");
      const questions: Question[][] = Array.from({ length: points }, () => []);
      let current: { k: number; ask: Text; right?: string; clue?: string; wrong: [string, Reason][] } | undefined;
      const close = () => {
        if (!current) return;
        const { k, ask, right, clue, wrong } = current;
        if (right === undefined || clue === undefined) throw new Error(`piece ${title}: ${ask["zh-CN"]} has no answer`);
        if (wrong.length < 2) throw new Error(`piece ${title}: ${ask["zh-CN"]} needs two wrong options`);
        if (new Set([right, ...wrong.map((w) => w[0])]).size !== wrong.length + 1)
          throw new Error(`piece ${title}: ${ask["zh-CN"]} repeats an option`);
        if (!`${title}\n${body}`.includes(clue)) throw new Error(`piece ${title}: the clue ${clue} is not in the text`);
        questions[k]!.push({ ask, right, wrong, clue });
        current = undefined;
      };
      for (const row of rows.slice(firstQuestion).filter((r) => r !== "")) {
        if (row.startsWith("?")) {
          close();
          const k = Number(row[1]) - 1;
          const [zh = "", en = ""] = row
            .slice(2)
            .split(" | ")
            .map((s) => s.trim());
          if (!(k >= 0 && k < points) || zh === "" || en === "") throw new Error(`piece ${title}: question ${row}`);
          current = { k, ask: t(en, zh), wrong: [] };
        } else if (row.startsWith("=") && current) {
          const [right = "", clue = ""] = row
            .slice(1)
            .split(" | ")
            .map((s) => s.trim());
          current.right = right;
          current.clue = clue;
        } else if (row.startsWith("-") && current) {
          const m = /^-\s*(.+?)\s*~(\w+)$/u.exec(row);
          if (!m || !(m[2]! in REASONS)) throw new Error(`piece ${title}: wrong option ${row}`);
          current.wrong.push([m[1]!, m[2] as Reason]);
        } else throw new Error(`piece ${title}: cannot read ${row}`);
      }
      close();
      return { title, body, questions };
    });
}

/** Kind words the steps of a solution by what the text is: a passage read, a sign, a verse or something heard. */
export interface Kind {
  /** text names the text in a sentence, in English and in Chinese: "the passage", "短文". */
  readonly text: readonly [en: string, zh: string];
}

/** PASSAGE is a passage read: a story, a fable, a fairy tale, a text on nature. */
export const PASSAGE: Kind = { text: ["the passage", "短文"] };
/** SIGN is the words around us: signs, labels, timetables and calendars. */
export const SIGN: Kind = { text: ["the text", "上面的文字"] };
/** VERSE is a nursery rhyme or a children's verse. */
export const VERSE: Kind = { text: ["the verse", "儿歌"] };
/** TALK is what someone says, which the learner reads until it is recorded. */
export const TALK: Kind = { text: ["what is said", "说的话"] };

/** shownOf is a text as a problem shows it: its title on a line of its own, then the text. */
const shownOf = (p: Piece): string => (p.title === "" ? p.body : `${p.title}\n\n${p.body}`);

/** asked are the questions of one knowledge point across pieces, each with its piece, in turn. */
function asked(pieces: readonly Piece[], k: number): readonly (readonly [Piece, Question])[] {
  const out = pieces.flatMap((p) => (p.questions[k] ?? []).map((q) => [p, q] as const));
  if (out.length === 0) throw new Error(`no questions for knowledge point ${k + 1}`);
  return out;
}

/** reasonOf says why a wrong option is wrong. */
const reasonOf = (option: string, reason: Reason): Text => {
  const [en, zh] = REASONS[reason];
  return t(`${option}: ${en}`, `“${option}”：${zh}`);
};

/** Steps are the three steps of a solution on a text, each in English and in Chinese, with the headings of the first two. */
export interface Steps {
  readonly heads?: { readonly find: Text; readonly choose: Text };
  readonly find: Text;
  readonly choose: Text;
  readonly check: Text;
}

/** Wording words the steps of a question on a text; it overrides the default steps of pieceGenerator. */
export type Wording = (q: Question, piece: Piece) => Steps;

/** HEADINGS are the bold headings of the three steps, as a solution writes them. */
const HEADINGS = {
  find: t("**Step 1: find the words that answer it.**", "**第一步：找到回答问题的话。**"),
  choose: t("**Step 2: choose by those words.**", "**第二步：照着这句话选。**"),
} as const;

/** byClue is the default wording: find the clue, choose the option that says what it says, and read both again. */
const byClue =
  (kind: Kind): Wording =>
  (q) => {
    const [textEn, textZh] = kind.text;
    return {
      find: t(
        `The question asks: ${q.ask.en} In ${textEn}, look for the words about this: “${q.clue}”`,
        `题目问的是：${q.ask["zh-CN"]}在${textZh}里找写这件事的话：“${q.clue}”`,
      ),
      choose: t(`Of the options, only “${q.right}” says what these words say.`, `几个选项里，只有“${q.right}”和这句话说的一致。`),
      check: t(
        `Read the question again with the answer, “${q.right}”, and then the words of ${textEn}: “${q.clue}” They agree.`,
        `带着答案“${q.right}”再读一遍问题，然后对照${textZh}里的“${q.clue}”，两者说的是一回事。`,
      ),
    };
  };

/**
 * pieceGenerator asks the questions of a knowledge point in turn, with the text and the options shuffled. The solution
 * finds the clue, chooses by it and checks the choice against the question, or follows the wording given; then each
 * other option is answered.
 */
export function pieceGenerator(pieces: readonly Piece[], k: number, kind: Kind, wording: Wording = byClue(kind)): Generator {
  const bank = asked(pieces, k);
  return (rng: Rng): Problem => {
    const [piece, q] = rng.cycle(bank);
    const options = rng.shuffle([q.right, ...q.wrong.map((w) => w[0])]);
    const answer = options.indexOf(q.right);
    const reasons = options.filter((o) => o !== q.right).map((o) => reasonOf(o, q.wrong.find((w) => w[0] === o)![1]));
    const list = (locale: "en" | "zh-CN") => reasons.map((r) => `- ${r[locale]}`).join("\n");
    const steps = wording(q, piece);
    const heads = steps.heads ?? HEADINGS;
    const solution = t(
      `${heads.find.en} ${steps.find.en}\n\n${heads.choose.en} ${steps.choose.en}\n\n**Check.** ${steps.check.en}\n\nThe other options:\n\n${list("en")}`,
      `${heads.find["zh-CN"]}${steps.find["zh-CN"]}\n\n${heads.choose["zh-CN"]}${steps.choose["zh-CN"]}\n\n**检验。** ${steps.check["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`,
    );
    return {
      prompt: joinText([q.ask, same(quote(shownOf(piece)))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: q.wrong.map(([o, r]) => ({ response: String(options.indexOf(o)), feedback: reasonOf(o, r) })),
    };
  };
}

/** RuleItem is a situation of speaking: the scene, the reply that suits it and the replies that do not, with why. */
export interface RuleItem {
  readonly scene: string;
  readonly right: string;
  readonly wrong: readonly (readonly [option: string, reason: Reason])[];
}

/**
 * parseRules reads situations separated by blank lines: the scene on its first line or lines, then `= right` and
 * `- wrong ~reason` once for each wrong option.
 */
export function parseRules(data: string): readonly RuleItem[] {
  return data
    .trim()
    .split(/\n\s*\n/u)
    .map((block) => {
      const rows = block
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "");
      const at = rows.findIndex((r) => r.startsWith("="));
      if (at < 1) throw new Error(`situation: ${rows[0]}`);
      const scene = rows.slice(0, at).join("\n");
      const right = rows[at]!.slice(1).trim();
      const wrong = rows.slice(at + 1).map((row): [string, Reason] => {
        const m = /^-\s*(.+?)\s*~(\w+)$/u.exec(row);
        if (!m || !(m[2]! in REASONS)) throw new Error(`situation ${scene}: wrong option ${row}`);
        return [m[1]!, m[2] as Reason];
      });
      if (wrong.length < 2) throw new Error(`situation ${scene}: needs two wrong options`);
      if (new Set([right, ...wrong.map((w) => w[0])]).size !== wrong.length + 1) throw new Error(`situation ${scene}: repeats an option`);
      return { scene, right, wrong };
    });
}

/** RULE_HEADINGS are the default headings of the steps of a speaking solution: what the moment needs, and the reply. */
const RULE_HEADINGS = {
  find: t("Step 1: think what the moment needs.", "第一步：想一想这时该怎么说。"),
  choose: t("Step 2: choose the reply that does it.", "第二步：选出这样说的一句。"),
};

/** Rule is what a knowledge point of speaking judges a reply by, said as a step of the solution, and its check. */
export interface Rule {
  /** heads are the headings of the two steps, where the default ones, for choosing a reply, do not fit. */
  readonly heads?: { readonly find: Text; readonly choose: Text };
  readonly step: Text;
  readonly check: Text;
}

/**
 * ruleGenerator asks the situations of a knowledge point in turn: which reply suits the scene. The solution states the
 * rule, finds the reply that keeps it and checks it as if said aloud; then each other reply is answered.
 */
export function ruleGenerator(question: Text, items: readonly RuleItem[], rule: Rule): Generator {
  const heads = rule.heads ?? RULE_HEADINGS;
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const options = rng.shuffle([item.right, ...item.wrong.map((w) => w[0])]);
    const answer = options.indexOf(item.right);
    const reasons = options.filter((o) => o !== item.right).map((o) => reasonOf(o, item.wrong.find((w) => w[0] === o)![1]));
    const list = (locale: "en" | "zh-CN") => reasons.map((r) => `- ${r[locale]}`).join("\n");
    const solution = t(
      `**${heads.find.en}** ${rule.step.en}\n\n**${heads.choose.en}** “${item.right}”\n\n**Check.** ${rule.check.en}\n\nThe other options:\n\n${list("en")}`,
      `**${heads.find["zh-CN"]}**${rule.step["zh-CN"]}\n\n**${heads.choose["zh-CN"]}**“${item.right}”\n\n**检验。** ${rule.check["zh-CN"]}\n\n其他选项：\n\n${list("zh-CN")}`,
    );
    return {
      prompt: joinText([question, same(quote(item.scene))]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map((o) => same(o)) } },
      solution,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: item.wrong.map(([o, r]) => ({ response: String(options.indexOf(o)), feedback: reasonOf(o, r) })),
    };
  };
}
