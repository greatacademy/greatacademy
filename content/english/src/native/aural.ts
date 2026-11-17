// Listening and reading aloud in the native grades (S1 and S3, §9.1 of the design): each unit of a grade from grade 1
// gets a listening topic, which plays the passages of the unit's reading unit read aloud, without their text, and asks
// their questions, and then a topic of reading aloud, where sentences and short stretches of those passages are read
// at a speaking pace. Native courses do not practice pronunciation: an accent passes as long as the words are clear.

import {
  type CourseDef,
  type Generator,
  type PassageDef,
  type Problem,
  type ReadingUnitDef,
  spokenWords,
  type Text,
  type TopicDef,
  t,
  type UnitDef,
} from "@ga/content";
import { point } from "@ga/subject-english";
import { withRecordings } from "../audio.ts";
import { heardAs, LANGUAGE } from "../levels/speaking.ts";
import type { Pack } from "../pack.ts";

/** MIN_QUESTIONS is the fewest questions a listening topic may ask. */
const MIN_QUESTIONS = 8;

/** MIN_SENTENCES is the fewest sentences a topic of reading aloud may give, and MIN_STRETCHES the fewest stretches. */
const MIN_SENTENCES = 10;
const MIN_STRETCHES = 5;

/**
 * A sentence read aloud has 6 to 24 words, or from SHORT_SENTENCE words when the passages give fewer than FEW_SENTENCES
 * of those, as the short sentences of the first grades do; a stretch of sentences has 25 to 45, about 20 seconds at a
 * speaking pace.
 */
const SENTENCE_WORDS = [6, 24] as const;
const SHORT_SENTENCE = 4;
const FEW_SENTENCES = 30;
const STRETCH_WORDS = [25, 45] as const;

/** readAloudSeconds is how long a recording of a text read aloud may be: about two words a second, and some to start. */
const readAloudSeconds = (text: string) => Math.min(30, 6 + Math.ceil(spokenWords(text).length * 0.5));

/** slug is the kebab-case form of a unit's title. */
const slug = (title: string) =>
  title
    .toLowerCase()
    .replace(/[’']/gu, "")
    .replace(/[^a-z0-9]+/gu, "-")
    .replace(/^-|-$/gu, "");

/** sentencesOf are the sentences of a passage, in order; a poem's lines run on into its sentences. */
export function sentencesOf(body: string): readonly string[] {
  return body
    .split(/\n\s*\n/u)
    .flatMap((paragraph) =>
      paragraph
        .replace(/\s*\n\s*/gu, " ")
        .split(/(?<=[.!?][”"’)]?)\s+(?=[“"(]?[A-Z])/u)
        .map((s) => s.trim()),
    )
    .filter((s) => s.length > 0);
}

/**
 * spokenOf is the text of a passage as it is spoken: a play's list of characters, its setting and its stage directions
 * in brackets are left out, and its lines keep the names of who says them.
 */
export function spokenOf(body: string): string {
  return body
    .split(/\n\s*\n/u)
    .filter((paragraph) => !/^\s*(CHARACTERS|SETTING):/u.test(paragraph))
    .map((paragraph) => paragraph.replace(/\s*\[[^\]]*\]/gu, "").trim())
    .filter((paragraph) => paragraph.length > 0 && !/^[A-Z][A-Z ]*:$/u.test(paragraph))
    .join("\n\n");
}

/** readable tells whether a sentence can be read aloud and heard back as written: words only, without numerals. */
const readable = (s: string) => !/\d|[—–-]{2}|[[\]{}/*_#]/u.test(s) && /[.!?][”"’)]?$/u.test(s);

/**
 * FEW_STRETCHES is the number of stretches below which the runs may overlap, so that short passages give as many
 * stretches as a knowledge point needs for its practice.
 */
const FEW_STRETCHES = 30;

/**
 * stretchesOf are runs of consecutive sentences of a passage within STRETCH_WORDS, each starting a new run; when they
 * overlap, a run starts at every sentence and ends at every sentence that keeps it within STRETCH_WORDS.
 */
function stretchesOf(sentences: readonly string[], overlap = false): readonly string[] {
  const out: string[] = [];
  for (let i = 0; i < sentences.length; ) {
    const run: string[] = [];
    let n = 0;
    let j = i;
    while (j < sentences.length && readable(sentences[j]!) && n + spokenWords(sentences[j]!).length <= STRETCH_WORDS[1]) {
      n += spokenWords(sentences[j]!).length;
      run.push(sentences[j]!);
      j++;
      if (overlap && j < sentences.length && n >= STRETCH_WORDS[0] && run.length > 1) out.push(run.join(" "));
    }
    if (n >= STRETCH_WORDS[0] && run.length > 1 && !(overlap && out.at(-1) === run.join(" "))) out.push(run.join(" "));
    i = overlap ? i + 1 : Math.max(j, i + 1);
  }
  return out;
}

/** choiceOf is a choice problem among Text options, the right one placed by the seed. */
function choiceOf(fields: Omit<Problem, "answer" | "canonical" | "wrong">, right: Text, wrong: readonly Text[], at: number): Problem {
  const options = [...wrong];
  options.splice(at % (wrong.length + 1), 0, right);
  const index = options.indexOf(right);
  return {
    ...fields,
    answer: { checker: "choice", expected: index, input: { kind: "choice", options } },
    canonical: String(index),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(index)),
  };
}

/** readProblem is a problem of reading a text aloud, with half of it read as a wrong response. */
function readProblem(prompt: Text, text: string): Problem {
  const words = spokenWords(text);
  const half = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  return {
    prompt,
    solution: t(
      "Read it once more, a little more smoothly: group the words into phrases, and pause at commas and full stops.",
      "再读一遍，读得更流畅些：把词连成意群，在逗号和句号处停顿。",
    ),
    answer: {
      checker: "speech",
      expected: { mode: "read", reference: text },
      input: { kind: "speech", language: LANGUAGE, mode: "read", text, maxSeconds: readAloudSeconds(text) },
    },
    canonical: heardAs(text),
    wrong: [heardAs(half)],
  };
}

interface Asked {
  readonly passage: PassageDef;
  readonly question: PassageDef["questions"][number];
}

/** listeningTopic plays the recorded passages of a reading unit and asks their questions, the text unseen. */
function listeningTopic(id: string, unit: Text, reading: ReadingUnitDef, prerequisites: readonly string[]): TopicDef {
  const passages = reading.passages.filter((p) => p.audio !== undefined);
  const asked: Asked[] = [];
  const most = Math.max(0, ...passages.map((p) => p.questions.length));
  for (let k = 0; k < most; k++) for (const p of passages) if (p.questions[k]) asked.push({ passage: p, question: p.questions[k]! });
  if (asked.length < MIN_QUESTIONS) throw new Error(`${id}: ${asked.length} questions on recorded passages, fewer than ${MIN_QUESTIONS}`);
  const listen: Generator = (rng) => {
    const { passage, question } = rng.cycle(asked)!;
    return choiceOf(
      {
        prompt: t(
          `Listen to *${passage.title.en}* read aloud, then answer.\n\n**${question.prompt.en}**`,
          `听《${passage.title["zh-CN"]}》的朗读，然后回答。\n\n**${question.prompt["zh-CN"]}**`,
        ),
        listen: [`audio/english/${passage.audio}`],
        solution: question.solution,
      },
      question.right,
      question.wrong,
      rng.int(0, question.wrong.length),
    );
  };
  return {
    id,
    title: t(`Listening: ${unit.en}`, `听力：${unit["zh-CN"]}`),
    summary: t(
      `Listen to the passages of *${reading.title.en}* read aloud, without the text, and answer questions on them.`,
      `不看原文，听《${reading.title["zh-CN"]}》中篇章的朗读，并回答问题。`,
    ),
    prerequisites,
    encompasses: [],
    xp: 15,
    strand: "listening",
    knowledgePoints: [
      point(
        "passages",
        t("Passages you hear", "听到的篇章"),
        t(
          "Read the question first, so that you know what to listen for, then play the passage. Listen for the main idea and for the details that support it, as you would in a lesson or a talk. You can play it again and stop it as often as you like.",
          "先读问题，知道要听什么，再播放篇章。像听课或听讲座一样，抓住中心意思和支撑它的细节。录音可以反复播放，也可以随时暂停。",
        ),
        listen,
      ),
    ],
  };
}

/** readingAloudTopic reads aloud sentences, then stretches of sentences, of a reading unit's passages. */
function readingAloudTopic(id: string, unit: Text, reading: ReadingUnitDef, listening: string): TopicDef {
  const all = reading.passages.map((p) => sentencesOf(spokenOf(p.body)));
  const within = (least: number) => [
    ...new Set(
      all.flat().filter((s) => {
        const n = spokenWords(s).length;
        return readable(s) && n >= least && n <= SENTENCE_WORDS[1];
      }),
    ),
  ];
  const usual = within(SENTENCE_WORDS[0]);
  const sentences = usual.length >= FEW_SENTENCES ? usual : within(SHORT_SENTENCE);
  const apart = [...new Set(all.flatMap((p) => stretchesOf(p)))];
  const stretches = apart.length >= FEW_STRETCHES ? apart : [...new Set(all.flatMap((p) => stretchesOf(p, true)))];
  if (sentences.length < MIN_SENTENCES) throw new Error(`${id}: ${sentences.length} sentences, fewer than ${MIN_SENTENCES}`);
  if (stretches.length < MIN_STRETCHES) throw new Error(`${id}: ${stretches.length} stretches, fewer than ${MIN_STRETCHES}`);
  const sentence: Generator = (rng) =>
    readProblem(
      t("Read the sentence aloud, as if you were telling someone.", "大声朗读这个句子，就像在讲给别人听。"),
      rng.cycle(sentences)!,
    );
  const stretch: Generator = (rng) =>
    readProblem(
      t(
        "Read the passage aloud at a speaking pace, without stopping between the sentences.",
        "用说话的语速大声朗读这段文字，句与句之间不要停下来。",
      ),
      rng.cycle(stretches)!,
    );
  return {
    id,
    title: t(`Reading Aloud: ${unit.en}`, `朗读：${unit["zh-CN"]}`),
    summary: t(
      `Read aloud sentences and short stretches of *${reading.title.en}*, fluently and at a speaking pace.`,
      `流畅地、用说话的语速朗读《${reading.title["zh-CN"]}》中的句子和短段落。`,
    ),
    prerequisites: [listening],
    encompasses: [],
    xp: 10,
    strand: "speaking",
    spoken: LANGUAGE,
    knowledgePoints: [
      point(
        "sentences",
        t("Sentences", "句子"),
        t(
          "Read the whole sentence through once in your head, then aloud. Keep the words of a phrase together, and let your voice fall at the full stop. A small word missed is all right; the important words must be clear.",
          "先在心里把整句读一遍，再大声读出来。一个意群里的词要连着读，句号处语调下降。漏掉一个小词没关系，重要的词要读清楚。",
        ),
        sentence,
      ),
      point(
        "stretches",
        t("Short passages", "短段落"),
        t(
          "Read two or three sentences as one stretch, at the pace you would speak: not hurried, and without stopping between the sentences. Pause briefly at full stops and carry the meaning across them.",
          "把两三个句子当作一段来读，用平时说话的语速：不要赶，句与句之间也不要停下来。句号处稍作停顿，让意思连贯下去。",
        ),
        stretch,
      ),
    ],
  };
}

/** prerequisiteOf is what a unit's listening follows: the last topic of its reading module, or of its first module. */
function prerequisiteOf(unit: UnitDef): readonly string[] {
  const reading = unit.modules.find((m) => m.title.en === "Reading") ?? unit.modules[0];
  const last = reading?.topics.at(-1);
  return last ? [last] : [];
}

/**
 * withAural gives each unit of a grade's courses that has a reading unit a listening module and a speaking module,
 * whose topics are named for the grade and the unit: grade-3-listening-how-plants-live and
 * grade-3-reading-aloud-how-plants-live.
 */
export function withAural(pack: Pack, grade: string, readingUnits: readonly ReadingUnitDef[]): Pack {
  const byId = new Map(withRecordings(readingUnits).map((u) => [u.id, u]));
  const topics: TopicDef[] = [];
  const seen = new Set<string>();
  const courses = pack.courses.map(
    (course): CourseDef => ({
      ...course,
      units: course.units.map((unit) => {
        const reading = byId.get(unit.reading?.[0] ?? "");
        if (!reading) return unit;
        const s = slug(unit.title.en);
        if (seen.has(s)) throw new Error(`${grade}: two units are named ${s}`);
        seen.add(s);
        const listening = `${grade}-listening-${s}`;
        const aloud = `${grade}-reading-aloud-${s}`;
        topics.push(listeningTopic(listening, unit.title, reading, prerequisiteOf(unit)));
        topics.push(readingAloudTopic(aloud, unit.title, reading, listening));
        return {
          ...unit,
          modules: [
            ...unit.modules,
            { title: t("Listening", "听力"), topics: [listening] },
            { title: t("Speaking", "口语"), topics: [aloud] },
          ],
        };
      }),
    }),
  );
  return { ...pack, topics: [...pack.topics, ...topics], courses };
}
