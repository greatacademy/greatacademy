// The listening and reading of dialogues, talks and passages with questions (docs/chinese-curriculum.md §8.5), as every
// paper of the new HSK asks them: a short dialogue or a longer dialogue or talk heard, then a question on it among three
// or four answers; a short text or a longer passage read, then a question on it. Every dialogue, talk and passage is
// written for this course in the characters of the levels the course tests; none is taken from a test. The dialogues
// are read by two voices, a woman's and a man's, so that a question can ask what 女的 or 男的 said, as the test does.

import { type Generator, joinText, type Problem, type Rng, same, type TopicDef, t } from "@ga/content";
import { point, quote } from "@ga/subject-chinese";

import { heardDialogue, heardTalk, type Line } from "../audio.ts";

/** ComprehensionData is a course's dialogues and passages as written: short and long ones of each, in blocks. */
export interface ComprehensionData {
  readonly dialogues: { readonly short: string; readonly long: string };
  readonly passages: { readonly short: string; readonly long: string };
}

/** Question is a question on a text: what is asked, the right answer and the wrong ones. */
export interface Question {
  readonly ask: string;
  readonly right: string;
  readonly wrong: readonly string[];
}

/** Block is one dialogue, talk or passage with its questions. */
export interface Block {
  /** lines are the lines of a dialogue, or one line for a talk or a passage. */
  readonly lines: readonly Line[];
  /** talk is true for a talk by one speaker or a passage, read as one text. */
  readonly talk: boolean;
  readonly questions: readonly Question[];
}

/** MIN_ITEMS is how many questions a knowledge point needs, so that it has 30 distinct problems. */
const MIN_ITEMS = 30;

const SPEAKERS: Readonly<Record<string, Line["speaker"]>> = { 女: "a", 男: "b" };

/** han lists the Chinese characters of a text. */
const han = (text: string): readonly string[] => [...text].filter((ch) => /\p{Script=Han}/u.test(ch));

/**
 * parseBlocks reads blocks separated by blank lines. A dialogue's lines start with 女： or 男：, a talk's one line with
 * 讲：, a passage's with 文：; each question follows as 问：, its right answer 答： and its wrong answers 错：, one a line.
 */
export function parseBlocks(where: string, data: string): readonly Block[] {
  return data
    .split(/\n\s*\n/u)
    .map((b) => b.trim())
    .filter((b) => b !== "")
    .map((block): Block => {
      const head = block.slice(0, 16);
      const lines: Line[] = [];
      const questions: { ask: string; right: string; wrong: string[] }[] = [];
      let talk = false;
      for (const raw of block.split("\n")) {
        const line = raw.trim();
        const tag = line.slice(0, 1);
        const body = line.slice(2).trim();
        if (line.slice(1, 2) !== "：" || body === "") throw new Error(`${where}: ${head}: the line ${line} has no tag`);
        const q = questions.at(-1);
        if (tag in SPEAKERS || tag === "讲" || tag === "文") {
          if (questions.length > 0) throw new Error(`${where}: ${head}: a line after the questions`);
          if (tag === "讲" || tag === "文") talk = true;
          lines.push({ speaker: SPEAKERS[tag] ?? "a", text: body });
        } else if (tag === "问") questions.push({ ask: body, right: "", wrong: [] });
        else if (tag === "答" && q && q.right === "") q.right = body;
        else if (tag === "错" && q) q.wrong.push(body);
        else throw new Error(`${where}: ${head}: the line ${line} is out of place`);
      }
      if (lines.length === 0 || questions.length === 0) throw new Error(`${where}: ${head}: needs a text and a question`);
      if (talk && lines.length !== 1) throw new Error(`${where}: ${head}: a talk or passage is one line`);
      for (const q of questions) {
        if (q.right === "") throw new Error(`${where}: ${head}: ${q.ask} has no answer`);
        if (new Set([q.right, ...q.wrong]).size !== q.wrong.length + 1) throw new Error(`${where}: ${head}: ${q.ask} repeats an answer`);
      }
      return { lines, talk, questions };
    });
}

/** CheckSpec says what a knowledge point's blocks must be. */
export interface CheckSpec {
  readonly where: string;
  readonly options: number;
  readonly taught: ReadonlySet<string>;
  /** lines bounds the lines of a dialogue; a talk or passage counts as one. */
  readonly lines: readonly [min: number, max: number];
  /** talks says whether talks or passages may appear, and dialogues. */
  readonly talks: "never" | "may" | "only";
}

/** checkBlocks checks a knowledge point's blocks: their size, their answers, their characters and how many questions there are. */
export function checkBlocks(blocks: readonly Block[], spec: CheckSpec): void {
  const asked = new Set<string>();
  for (const b of blocks) {
    const head = `${spec.where}: ${b.lines[0]!.text.slice(0, 12)}`;
    if (b.talk ? spec.talks === "never" : spec.talks === "only")
      throw new Error(`${head}: ${b.talk ? "a talk" : "a dialogue"} is out of place`);
    if (!b.talk && (b.lines.length < spec.lines[0] || b.lines.length > spec.lines[1]))
      throw new Error(`${head}: ${b.lines.length} lines, not ${spec.lines[0]} to ${spec.lines[1]}`);
    if (!b.talk && new Set(b.lines.map((l) => l.speaker)).size !== 2) throw new Error(`${head}: a dialogue needs both voices`);
    for (const q of b.questions) {
      if (q.wrong.length + 1 !== spec.options) throw new Error(`${head}: ${q.ask} has ${q.wrong.length + 1} answers, not ${spec.options}`);
      const key = `${b.lines.map((l) => l.text).join("")}|${q.ask}`;
      if (asked.has(key)) throw new Error(`${head}: ${q.ask} is asked twice`);
      asked.add(key);
    }
    const text = [...b.lines.map((l) => l.text), ...b.questions.flatMap((q) => [q.ask, q.right, ...q.wrong])].join("");
    const untaught = [...new Set(han(text).filter((ch) => !spec.taught.has(ch)))];
    if (untaught.length > 0) throw new Error(`${head}: uses ${untaught.join("")}, not taught in the levels tested`);
  }
  if (asked.size < MIN_ITEMS) throw new Error(`${spec.where}: ${asked.size} questions, needs ${MIN_ITEMS}`);
}

/** transcript shows what a dialogue or talk says, a line each, with who says it. */
const transcript = (b: Block): string =>
  b.talk ? b.lines[0]!.text : b.lines.map((l) => `${l.speaker === "a" ? "女" : "男"}：${l.text}`).join("\n");

/** Item is one question on a block. */
interface Item {
  readonly block: Block;
  readonly question: Question;
}

/** items lists the questions of blocks, the first question of every block first, then the second, so that consecutive seeds ask about different texts. */
function items(blocks: readonly Block[]): readonly Item[] {
  const most = Math.max(...blocks.map((b) => b.questions.length));
  const out: Item[] = [];
  for (let i = 0; i < most; i++) for (const block of blocks) if (block.questions[i]) out.push({ block, question: block.questions[i]! });
  return out;
}

/** comprehensionGenerator asks each question in turn with its answers shuffled: heard, when listening, or read. */
export function comprehensionGenerator(blocks: readonly Block[], listening: boolean): Generator {
  const all = items(blocks);
  // The recordings are named here, not when a problem is asked, so the recording tool finds every one.
  const paths = new Map(listening ? blocks.map((b) => [b, b.talk ? heardTalk(b.lines[0]!.text) : heardDialogue(b.lines)] as const) : []);
  return (rng: Rng): Problem => {
    const { block, question } = rng.cycle(all);
    const options = rng.shuffle([question.right, ...question.wrong]).map(same);
    const answer = options.findIndex((o) => o.en === question.right);
    const shown = transcript(block);
    return {
      prompt: listening
        ? joinText([t("Listen, then answer the question.", "听录音，回答问题。"), same(`**${question.ask}**`)])
        : joinText([t("Read, then answer the question.", "阅读，回答问题。"), same(quote(shown)), same(`**${question.ask}**`)]),
      ...(listening && { listen: [paths.get(block)!] }),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options } },
      solution: t(
        `${listening ? "You hear:" : "The text says:"}\n\n${quote(shown)}\n\n**${question.ask}** ${question.right}`,
        `${listening ? "你听到的是：" : "短文里说："}\n\n${quote(shown)}\n\n**${question.ask}** ${question.right}`,
      ),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
    };
  };
}

/** ComprehensionSpec is what an HSK course gives its listening and reading of texts. */
export interface ComprehensionSpec {
  readonly key: string;
  readonly name: string;
  /** top is the highest level it tests. */
  readonly top: number;
  /** taught are the characters of the levels up to top, which its texts are written with. */
  readonly taught: ReadonlySet<string>;
  /** listeningAfter and readingAfter are the topics each follows. */
  readonly listeningAfter: string;
  readonly readingAfter: string;
}

/** comprehensionTopics builds the listening of dialogues and talks and the reading of passages of an HSK course from its data. */
export function comprehensionTopics(spec: ComprehensionSpec, data: ComprehensionData): readonly TopicDef[] {
  const id = (s: string): string => `hsk-${spec.key}-${s}`;
  const { top, taught } = spec;
  const options = top <= 3 ? 3 : 4;
  const parse = (s: string, d: string) => parseBlocks(id(s), d);
  const shortDialogues = parse("dialogues-short", data.dialogues.short);
  const longDialogues = parse("dialogues-long", data.dialogues.long);
  const shortPassages = parse("passages-short", data.passages.short);
  const longPassages = parse("passages-long", data.passages.long);
  const base = { options, taught };
  checkBlocks(shortDialogues, { ...base, where: id("dialogues-short"), lines: [2, 2], talks: "never" });
  checkBlocks(longDialogues, { ...base, where: id("dialogues-long"), lines: [3, 12], talks: "may" });
  checkBlocks(shortPassages, { ...base, where: id("passages-short"), lines: [1, 1], talks: "only" });
  checkBlocks(longPassages, { ...base, where: id("passages-long"), lines: [1, 1], talks: "only" });
  return [
    {
      id: id("dialogues"),
      title: t(`HSK ${spec.name}: Dialogues and Talks`, `HSK ${spec.name}：听对话和讲话`),
      summary: t(
        `Dialogues and talks in the words of the levels HSK ${spec.name} tests, heard without being seen, each with a question on it, as the listening paper asks.`,
        `不看文字，听用 HSK ${spec.name} 所考等级的词语说的对话和讲话，回答关于它的问题，像听力试卷那样。`,
      ),
      prerequisites: [spec.listeningAfter],
      encompasses: [],
      xp: 12,
      practiceOnly: true,
      strand: "listening",
      knowledgePoints: [
        point(
          id("dialogues-short"),
          t("Short Dialogues", "短对话"),
          t(
            "Read the question before you listen, so that you know what to listen for: who, where, when, what or why. A woman speaks first or second; the question may ask what 女的 or 男的 says, wants or will do. Listen to the whole dialogue: the second line often changes or answers the first.",
            "听之前先看问题，知道要听什么：谁、在哪儿、什么时候、做什么、为什么。问题可能问“女的”或“男的”说了什么、想要什么、要做什么。要听完整个对话：第二句常常回答或者改变第一句的意思。",
          ),
          comprehensionGenerator(shortDialogues, true),
        ),
        point(
          id("dialogues-long"),
          t("Longer Dialogues and Talks", "长对话和讲话"),
          t(
            "Look at the answers before you listen: they tell you what the question is about. Follow the turns of the dialogue or the steps of the talk, and note numbers, times, places and reasons as they come. An answer that repeats words you heard is not always right: check that it says what was meant.",
            "听之前先看选项：它们告诉你问题是关于什么的。跟着对话的来回或者讲话的步骤听，记下听到的数字、时间、地点和原因。和录音里的词一样的选项不一定对：要看它说的是不是录音的意思。",
          ),
          comprehensionGenerator(longDialogues, true),
        ),
      ],
    },
    {
      id: id("passages"),
      title: t(`HSK ${spec.name}: Reading Texts`, `HSK ${spec.name}：阅读短文`),
      summary: t(
        `Short texts and passages in the words of the levels HSK ${spec.name} tests, each with a question on it, as the reading paper asks.`,
        `阅读用 HSK ${spec.name} 所考等级的词语写的短文，回答关于它的问题，像阅读试卷那样。`,
      ),
      prerequisites: [spec.readingAfter],
      encompasses: [],
      xp: 12,
      practiceOnly: true,
      strand: "reading",
      knowledgePoints: [
        point(
          id("passages-short"),
          t("Short Texts", "短文"),
          t(
            "Read the question first, then find the sentence of the text it is about. The answer usually says the same thing in other words, so read it against that sentence, not against the words it shares.",
            "先读问题，再在短文中找到和它有关的句子。答案常常换一种说法说同一个意思，所以要拿它和那个句子比意思，不要只看有没有相同的词。",
          ),
          comprehensionGenerator(shortPassages, false),
        ),
        point(
          id("passages-long"),
          t("Longer Passages", "长文章"),
          t(
            "Skim the passage once for what it is about, then read the question and go back to the part it asks about. A question on the main idea or the writer's view needs the whole passage; one on a detail needs a sentence or two.",
            "先快速读一遍，知道文章讲什么；再看问题，回到它问的那一部分仔细读。问主要内容或作者看法的题要看整篇文章，问细节的题只要看一两句。",
          ),
          comprehensionGenerator(longPassages, false),
        ),
      ],
    },
  ];
}
