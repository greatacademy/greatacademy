// The speaking test of the HSK courses beyond words said after a recording and sentences read aloud (docs/chinese-
// curriculum.md §8.5). HSK 1 to 3 answer a question heard, as the elementary speaking test asks: the learner hears it,
// sees what to answer, and says a sentence, heard against the answers accepted. HSK 4 and on read a passage aloud, as
// the advanced test asks, from the course's own short passages, a few sentences at a time. The questions and answers
// are written for this package in the characters of the levels each course tests. Retelling and answering at length
// need a free answer judged by a model, and a spoken topic is checked by rules, so they are not practised.

import { heardResponse, type Problem, type Rng, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { heard } from "../audio.ts";
import { fromBank } from "../level-1/listening.ts";
import { parseBlocks } from "./comprehension.ts";

/** MIN_ITEMS is how many items a knowledge point needs. */
const MIN_ITEMS = 30;

/** LANGUAGE is the language the answers are heard in. */
const LANGUAGE = "zh-CN";

/** PART_CHARS is the most characters a part of a passage read aloud may have, so it can be read within the time allowed. */
const PART_CHARS = 60;

/** Answering is a question heard, a hint of what to answer in English and in Chinese, and the sentences accepted. */
export interface Answering {
  readonly ask: string;
  readonly hint: { readonly en: string; readonly zh: string };
  readonly accept: readonly string[];
}

const han = (text: string): readonly string[] => [...text].filter((ch) => /\p{Script=Han}/u.test(ch));

/**
 * parseAnswering reads blocks separated by blank lines, a line each: 问： the question heard, 示： the hint as
 * English | Chinese, and 说： the answers accepted, separated by |.
 */
export function parseAnswering(where: string, data: string): readonly Answering[] {
  return data
    .split(/\n\s*\n/u)
    .map((b) => b.trim())
    .filter((b) => b !== "")
    .map((block): Answering => {
      const fields = new Map<string, string>();
      for (const raw of block.split("\n")) {
        const line = raw.trim();
        const tag = line.slice(0, 1);
        if (line.slice(1, 2) !== "：" || !"问示说".includes(tag) || fields.has(tag))
          throw new Error(`${where}: the line ${line} is out of place`);
        fields.set(tag, line.slice(2).trim());
      }
      const ask = fields.get("问") ?? "";
      const [en, zh, ...more] = (fields.get("示") ?? "").split("|").map((s) => s.trim());
      const accept = (fields.get("说") ?? "")
        .split("|")
        .map((s) => s.trim())
        .filter(Boolean);
      if (ask === "" || !en || !zh || more.length > 0 || accept.length === 0)
        throw new Error(`${where}: ${block.slice(0, 16)} is incomplete`);
      return { ask, hint: { en, zh }, accept };
    });
}

/** heardAs is the response of a text heard clearly. */
const heardAs = (text: string) => heardResponse({ text, confidence: 0.95, seconds: [...text].length * 0.4 + 0.5 });

/** OralSpec says what an HSK course's speaking test is built from. */
export interface OralSpec {
  readonly key: string;
  readonly name: string;
  /** taught are the characters of the levels the course tests. */
  readonly taught: ReadonlySet<string>;
  /** after is the course's speaking topic. */
  readonly after: string;
  /** answering are the questions to answer, for HSK 1 to 3. */
  readonly answering?: string;
  /** passages are the course's short passages, for HSK 4 and on. */
  readonly passages?: string;
}

/** untaughtIn names the characters of texts not among those taught. */
const untaughtIn = (texts: readonly string[], taught: ReadonlySet<string>): string =>
  [...new Set(texts.flatMap(han).filter((ch) => !taught.has(ch)))].join("");

/** answeringTopic builds the answering of questions heard. */
function answeringTopic(spec: OralSpec, data: string): TopicDef {
  const id = `hsk-${spec.key}-answering`;
  const items = parseAnswering(id, data);
  if (items.length < MIN_ITEMS) throw new Error(`${id}: ${items.length} questions, needs ${MIN_ITEMS}`);
  if (new Set(items.map((x) => x.ask)).size !== items.length) throw new Error(`${id}: a question is asked twice`);
  for (const x of items) {
    const untaught = untaughtIn([x.ask, x.hint.zh, ...x.accept], spec.taught);
    if (untaught) throw new Error(`${id}: ${x.ask} uses ${untaught}, not taught in the levels tested`);
  }
  const audio = items.map((x) => heard(x.ask));
  const bank = items.map((x, i) => (): Problem => {
    const other = items[(i + 7) % items.length]!.accept[0]!;
    return {
      prompt: t(
        `Listen to the question, then answer it aloud in a whole sentence: **${x.hint.en}**`,
        `听问题，然后用一个完整的句子大声回答：**${x.hint.zh}**`,
      ),
      listen: [audio[i]!],
      answer: {
        checker: "speech",
        expected: { mode: "say", accept: x.accept },
        input: { kind: "speech", language: LANGUAGE, mode: "say", maxSeconds: 10 },
      },
      solution: t(
        `The question is “${x.ask}” You can answer: ${x.accept.map((a) => `“${a}”`).join(" or ")}`,
        `问题是“${x.ask}”可以回答：${x.accept.map((a) => `“${a}”`).join("或者")}`,
      ),
      canonical: heardAs(x.accept[0]!),
      wrong: [heardAs(other)],
    };
  });
  return {
    id,
    title: t(`HSK ${spec.name}: Answering Questions`, `HSK ${spec.name}：听后回答`),
    summary: t(
      `Questions in the words of the levels HSK ${spec.name} tests, heard, then answered aloud in a sentence, as the speaking test asks.`,
      `听用 HSK ${spec.name} 所考等级的词语提出的问题，用一个句子大声回答，像口语考试那样。`,
    ),
    prerequisites: [spec.after],
    encompasses: [],
    xp: 12,
    practiceOnly: true,
    strand: "speaking",
    spoken: LANGUAGE,
    knowledgePoints: [
      point(
        `${id}-questions`,
        t("Answering a Question Heard", "听后回答"),
        t(
          "Listen to the whole question, then answer with what the hint says, in a whole sentence that takes up the question's words: to 你喜欢喝什么？ answer 我喜欢喝茶。, not just 茶. Change 你 in the question to 我 in the answer.",
          "听完整个问题，再按提示的意思回答，用一个完整的句子，并用上问题里的词：问“你喜欢喝什么？”，回答“我喜欢喝茶。”，不要只说“茶”。问题里的“你”在回答里要换成“我”。",
        ),
        fromBank(bank),
      ),
    ],
  };
}

/** parts splits a passage into parts of whole sentences, each at most PART_CHARS characters, or one long sentence alone. */
export function parts(text: string): readonly string[] {
  const sentences = text.match(/[^。！？]+[。！？]?/gu) ?? [];
  const out: string[] = [];
  let part = "";
  for (const s of sentences) {
    if (part !== "" && [...part, ...s].length > PART_CHARS) {
      out.push(part);
      part = "";
    }
    part += s;
  }
  if (part !== "") out.push(part);
  return out;
}

/** readSeconds is how long reading a part aloud may take: about two fifths of a second a character, and some to start. */
const readSeconds = (text: string) => Math.min(30, 5 + Math.ceil([...text].length * 0.4));

/** readingTopic builds the reading aloud of passages, part by part. */
function readingTopic(spec: OralSpec, data: string): TopicDef {
  const id = `hsk-${spec.key}-reading-aloud`;
  const texts = parseBlocks(id, data).map((b) => b.lines[0]!.text);
  const all = [...new Set(texts.flatMap(parts))].filter((p) => [...p].length >= 12 && [...p].length <= PART_CHARS);
  if (all.length < MIN_ITEMS) throw new Error(`${id}: ${all.length} parts, needs ${MIN_ITEMS}`);
  const audio = all.map(heard);
  const bank = all.map((p, i) => (_rng: Rng): Problem => {
    const other = all[(i + Math.floor(all.length / 2)) % all.length]!;
    return {
      prompt: t(`Read aloud:\n\n> ${p}`, `朗读：\n\n> ${p}`),
      listen: [audio[i]!],
      answer: {
        checker: "speech",
        expected: { mode: "read", reference: p },
        input: { kind: "speech", language: LANGUAGE, mode: "read", text: p, maxSeconds: readSeconds(p) },
      },
      solution: t("Listen to it read aloud, and read it once more with it.", "听一听它的朗读，再跟着读一遍。"),
      canonical: heardAs(p),
      wrong: [heardAs(other)],
    };
  });
  return {
    id,
    title: t(`HSK ${spec.name}: Reading Aloud`, `HSK ${spec.name}：朗读`),
    summary: t(
      `Short texts in the words of the levels HSK ${spec.name} tests, read aloud a few sentences at a time, as the speaking test asks.`,
      `朗读用 HSK ${spec.name} 所考等级的词语写的短文，每次几句，像口语考试那样。`,
    ),
    prerequisites: [spec.after],
    encompasses: [],
    xp: 12,
    practiceOnly: true,
    strand: "speaking",
    spoken: LANGUAGE,
    knowledgePoints: [
      point(
        `${id}-texts`,
        t("Reading a Text Aloud", "朗读短文"),
        t(
          "Look through the text once before you start, so that no word surprises you. Read at a calm, even speed, keeping the words of a phrase together, pausing a little at commas and more at full stops. Read what is written, without adding or leaving out words.",
          "开始之前先看一遍，免得读到哪个词时卡住。用平稳、均匀的速度读，一个词组里的字连起来读，逗号处稍停，句号处多停一会儿。照着原文读，不要加字，也不要漏字。",
        ),
        fromBank(bank),
      ),
    ],
  };
}

/** oralTopics builds an HSK course's answering of questions or reading aloud, whichever its data has. */
export function oralTopics(spec: OralSpec): readonly TopicDef[] {
  return [...(spec.answering ? [answeringTopic(spec, spec.answering)] : []), ...(spec.passages ? [readingTopic(spec, spec.passages)] : [])];
}
