// The speaking test of the HSK courses beyond words said after a recording and sentences read aloud (docs/chinese-
// curriculum.md §8.5). HSK 1 to 3 answer a question heard, as the elementary speaking test asks: the learner hears it,
// sees what to answer, and says a sentence, heard against the answers accepted. HSK 4 and on read a passage aloud, as
// the advanced test asks, from the course's own short passages, a few sentences at a time. The questions and answers
// are written for this package in the characters of the levels each course tests. Retelling and answering at length
// need a free answer judged by a model, and a spoken topic is checked by rules, so they are not practised.

import { heardResponse, type Problem, type Rng, type Text, type TopicDef, t } from "@ga/content";
import { point, zhQuote } from "@ga/subject-chinese";

import { heard } from "../audio.ts";
import { fromBank, hanCount, pauseStep, phrasesOf } from "../level-1/listening.ts";
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

/** sentenceCount is how many sentences a text has, counting its full stops, question and exclamation marks. */
const sentenceCount = (text: string): number => Math.max(1, (text.match(/[。！？]+/gu) ?? []).length);

/** lastPhrase is the last part of a text between its punctuation, where a reading ends. */
const lastPhrase = (text: string): string => phrasesOf(text).at(-1) ?? text;

/**
 * passageSolution works the reading aloud of a passage in steps: how long it is, then the parts it is read in, and a
 * check against the text, with the recording when there is one.
 */
export function passageSolution(text: string, withRecording: boolean): Text {
  const n = hanCount(text);
  const m = sentenceCount(text);
  const again = withRecording
    ? t("Read it once more with the recording", "跟着录音再读一遍")
    : t("Read it once more from the screen", "看着屏幕再读一遍");
  return t(
    `**Step 1: look it through.** It has ${n} characters in ${m} sentence${m === 1 ? "" : "s"}, starting from ${zhQuote(phrasesOf(text)[0] ?? text)}. Look for any word you are unsure of before you start.\n\n**Step 2: read it in its parts.** ${pauseStep(text).en}\n\n**Check.** ${again.en}: ${n} characters, none added, left out or repeated, ending at ${zhQuote(lastPhrase(text))}.`,
    `**第一步：先看一遍。** 一共${n}个字，${m}句话，从${zhQuote(phrasesOf(text)[0] ?? text)}开始。先找出没把握的词，再开口读。\n\n**第二步：按段落读。** ${pauseStep(text)["zh-CN"]}\n\n**检验。** ${again["zh-CN"]}：${n}个字，不加字、不漏字、不重复，读到${zhQuote(lastPhrase(text))}结束。`,
  );
}

/** otherPassage is why another passage, read instead of the one shown, is wrong. */
export const otherPassage = (other: string): Text =>
  t(
    `That was heard as another passage, ${zhQuote(other)}, not the one shown: read the text on the screen.`,
    `听到的是另一段文字${zhQuote(other)}，不是题目里的这一段：要读屏幕上的文字。`,
  );

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

/** bare is a hint without the stop at its end, to set in a sentence of its own. */
const bare = (hint: string): string => hint.replace(/[.。!！?？]+$/u, "");

/** QUESTION_WORDS are characters of a question that its answer does not take up. */
const QUESTION_WORDS = new Set([..."吗呢吧什么谁哪几多少怎你"]);

/** answeringSolution works the answer to a question heard in steps: what it asks, the sentence said, and a check against the question. */
function answeringSolution(x: Answering): Text {
  const answer = x.accept[0]!;
  const others = x.accept.slice(1);
  const shared = [...new Set(han(x.ask).filter((c) => !QUESTION_WORDS.has(c) && answer.includes(c)))].join("");
  const swap = x.ask.includes("你") && answer.includes("我");
  const or =
    others.length > 0
      ? t(` You can also say ${others.map((a) => `“${a}”`).join(" or ")}.`, `也可以说${others.map((a) => `“${a}”`).join("或者")}。`)
      : t("", "");
  const swapNote = swap ? t(" 你 in the question becomes 我 in the answer.", "问题里的“你”在回答里换成了“我”。") : t("", "");
  const check =
    shared === ""
      ? t(
          `It answers “${x.ask}” with what the hint says, in a whole sentence, not a single word.`,
          `它按提示回答了“${x.ask}”，是一个完整的句子，不是一个词。`,
        )
      : t(
          `It answers “${x.ask}” with what the hint says, and takes up the question's own words: ${[...shared].join(", ")}.`,
          `它按提示回答了“${x.ask}”，并用上了问题里的字：${[...shared].join("、")}。`,
        );
  return t(
    `**Step 1: hear what is asked.** The question is “${x.ask}” The hint: ${bare(x.hint.en)}.\n\n**Step 2: answer in a whole sentence.** Say “${answer}”${swapNote.en}${or.en}\n\n**Check.** ${check.en}`,
    `**第一步：听清问的是什么。** 问题是“${x.ask}”提示：${bare(x.hint.zh)}。\n\n**第二步：用完整的句子回答。** 说“${answer}”${swapNote["zh-CN"]}${or["zh-CN"]}\n\n**检验。** ${check["zh-CN"]}`,
  );
}

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
    const otherItem = items[(i + 7) % items.length]!;
    const other = otherItem.accept[0]!;
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
      solution: answeringSolution(x),
      canonical: heardAs(x.accept[0]!),
      mistakes: [
        {
          response: heardAs(other),
          feedback: t(
            `That answers another question, “${otherItem.ask}”, not the one heard: listen again for what this one asks.`,
            `这句回答的是另一个问题“${otherItem.ask}”，不是听到的这个问题：再听一遍，听清问的是什么。`,
          ),
        },
      ],
    };
  });
  const first = items[0]!;
  return {
    id,
    title: t(`HSK ${spec.name}: Answering Questions`, `HSK ${spec.name}：听后回答`),
    summary: t(
      `Questions in the words of the levels HSK ${spec.name} tests, heard, then answered aloud in a sentence, as the speaking test asks.`,
      `听用 HSK ${spec.name} 所考等级的词语提出的问题，用一个句子大声回答，像口语考试那样。`,
    ),
    intro: t(
      `Take the question “${first.ask}” You hear it, and the hint tells you what to answer: ${bare(first.hint.en)}. You say a whole sentence, such as “${first.accept[0]}”, as the elementary speaking test asks. The questions use the words of the levels HSK ${spec.name} tests, and a speech service hears your answer.`,
      `比如问题“${first.ask}”你听到这个问题，提示告诉你回答什么：${bare(first.hint.zh)}。你说一个完整的句子，比如“${first.accept[0]}”，像初级口语考试那样。问题用的是 HSK ${spec.name} 所考等级的词语，语音服务听你的回答。`,
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
          `Listen to the whole question, then answer with what the hint says, in a whole sentence that takes up the question's words, changing 你 in the question to 我 in the answer. Take “${first.ask}” with the hint “${bare(first.hint.en)}”: answer “${first.accept[0]}”\n\n> **Watch out.** Do not answer with only the word asked for: to 你喜欢喝什么？ say 我喜欢喝茶。, not just 茶.`,
          `听完整个问题，再按提示的意思回答，用一个完整的句子，并用上问题里的词；问题里的“你”在回答里要换成“我”。比如问题“${first.ask}”，提示是“${bare(first.hint.zh)}”：回答“${first.accept[0]}”\n\n> **注意。** 不要只说问的那个词：问“你喜欢喝什么？”，要回答“我喜欢喝茶。”，不要只说“茶”。`,
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
  const shown = all.find((p) => phrasesOf(p).length > 1) ?? all[0]!;
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
      solution: passageSolution(p, true),
      canonical: heardAs(p),
      mistakes: [{ response: heardAs(other), feedback: otherPassage(other) }],
    };
  });
  return {
    id,
    title: t(`HSK ${spec.name}: Reading Aloud`, `HSK ${spec.name}：朗读`),
    summary: t(
      `Short texts in the words of the levels HSK ${spec.name} tests, read aloud a few sentences at a time, as the speaking test asks.`,
      `朗读用 HSK ${spec.name} 所考等级的词语写的短文，每次几句，像口语考试那样。`,
    ),
    intro: t(
      `Take “${shown}”: you read it aloud as it is written. ${pauseStep(shown).en} The texts use the words of the levels HSK ${spec.name} tests, a few sentences at a time, as the advanced speaking test reads a passage aloud; a speech service hears every character.`,
      `比如“${shown}”：照着原文大声读。${pauseStep(shown)["zh-CN"]}短文用的是 HSK ${spec.name} 所考等级的词语，每次读几句，像高级口语考试的朗读那样；语音服务会听你读的每个字。`,
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
          `Look through the text once before you start, so that no word surprises you. Read at a calm, even speed, keeping the words of a phrase together, pausing a little at commas and more at full stops. Take “${shown}”. ${pauseStep(shown).en}\n\n> **Watch out.** Read what is written, without adding, leaving out or repeating a character, even a small one such as 的 or 了: the reading is checked character by character.`,
          `开始之前先看一遍，免得读到哪个词时卡住。用平稳、均匀的速度读，一个词组里的字连起来读，逗号处稍停，句号处多停一会儿。比如“${shown}”：${pauseStep(shown)["zh-CN"]}\n\n> **注意。** 照着原文读，不加字、不漏字、不重复，“的”“了”这样的小字也一样：朗读是一个字一个字核对的。`,
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
