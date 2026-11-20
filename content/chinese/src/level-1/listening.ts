// The listening and speaking of a level's unit (docs/chinese-curriculum.md §8.4): after a unit's words, a topic where
// its words and their sentences are played and the learner, who does not see them, chooses what was said; then a topic
// where the words are said after a recording and the sentences read aloud, heard by a speech service. The recordings
// are made by tools/audio from the words and sentences of the unit, so the topics need no data of their own.

import { type Generator, heardResponse, type Problem, type Rng, same, slimmed, type Text, type TopicDef, t } from "@ga/content";
import { point, toneless } from "@ga/subject-chinese";

import { heard } from "../audio.ts";
import type { LevelOneCharacter } from "./characters.ts";
import { GAP, type LevelOneWord, pinyinOf } from "./words.ts";

/** LANGUAGE is the language the levels' speaking is heard in: standard Mandarin. */
const LANGUAGE = "zh-CN";

/** MIN_ITEMS is the fewest distinct items a knowledge point of these topics may have. */
const MIN_ITEMS = 30;

const two = (n: number): string => String(n).padStart(2, "0");

/** levelListeningId is the id of the listening topic of a level's unit, counting units from 1. */
export const levelListeningId = (level: number, unit: number): string => `level-${level}-listening-${two(unit)}`;

/** levelSpeakingId is the id of the speaking topic of a level's unit, counting units from 1. */
export const levelSpeakingId = (level: number, unit: number): string => `level-${level}-speaking-${two(unit)}`;

/** UnitSpeechSpec describes the listening and speaking of a unit. */
export interface UnitSpeechSpec {
  readonly level: number;
  /** numeral names the level in Chinese, as in 二级. */
  readonly numeral: string;
  /** unit is the unit's number, from 1. */
  readonly unit: number;
  readonly theme: Text;
  readonly words: readonly LevelOneWord[];
  /** chars are the characters taught by then, whose readings tell which words a sentence sounds like. */
  readonly chars: ReadonlyMap<string, LevelOneCharacter>;
  /** after is the unit's last word topic, which the listening needs. */
  readonly after: string;
}

/** filled is a word's sentence with the word in its gap. */
const filled = (w: LevelOneWord): string => w.sentence.replace(GAP, w.word);

/** sound is how a word or a run of characters sounds without its tones, a syllable each, or undefined for one not known. */
function sound(text: string, chars: ReadonlyMap<string, LevelOneCharacter>): readonly string[] {
  return [...text].map((c) => {
    const r = chars.get(c)?.reading;
    return r === undefined ? c : toneless(r.normalize("NFC"));
  });
}

/** soundsIn tells whether the syllables of a word occur one after another among those of a sentence. */
function soundsIn(word: readonly string[], sentence: readonly string[]): boolean {
  for (let i = 0; i + word.length <= sentence.length; i++) if (word.every((s, k) => sentence[i + k] === s)) return true;
  return false;
}

/** choiceProblem is a choice problem from its options, the right one among them, and the rest. */
function choiceProblem(fields: Pick<Problem, "prompt" | "listen" | "solution">, rng: Rng, right: Text, wrong: readonly Text[]): Problem {
  const options = rng.shuffle([right, ...wrong]);
  const answer = options.indexOf(right);
  return {
    ...fields,
    answer: { checker: "choice", expected: answer, input: { kind: "choice", options } },
    canonical: String(answer),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
  };
}

/** Item is a word or sentence to play, the word that is right and two that are wrong. */
interface Item {
  readonly word: LevelOneWord;
  readonly wrong: readonly [LevelOneWord, LevelOneWord];
}

/**
 * items gives each word of a unit two turns, each with two other words of the unit that `allowed` lets stand against it,
 * taken in turn so that a word's turns differ in their options too; a word with fewer than four such words has fewer turns.
 */
function items(words: readonly LevelOneWord[], allowed: (w: LevelOneWord, o: LevelOneWord) => boolean): readonly Item[] {
  // The first four words after each one, going round, that may stand against it: no more are looked at.
  const others = words.map((w, i) => {
    const found: LevelOneWord[] = [];
    for (let j = 1; j < words.length && found.length < 4; j++) {
      const o = words[(i + j) % words.length]!;
      if (allowed(w, o)) found.push(o);
    }
    return found;
  });
  return [0, 1].flatMap((k) =>
    words.flatMap((w, i): Item[] => {
      const a = others[i]![2 * k];
      const b = others[i]![2 * k + 1];
      return a && b ? [{ word: w, wrong: [a, b] }] : [];
    }),
  );
}

const ensure = (id: string, name: string, n: number) => {
  if (n < MIN_ITEMS) throw new Error(`${id}: ${name} has ${n} items, fewer than ${MIN_ITEMS}`);
};

/** meaningOf is the meaning of a word as an option, in the learner's language. */
const meaningOf = (w: LevelOneWord): Text => w.meaning;

/** Asked is one problem of a bank, made with the random choices of a seed. */
export type Asked = (rng: Rng) => Problem;

/** fromBank is a generator that walks through a bank, one problem a seed. */
export const fromBank =
  (bank: readonly Asked[]): Generator =>
  (rng) =>
    rng.cycle(bank)(rng);

/** listeningBanks are the problems of a unit's listening: a word heard by its meaning, and a word heard in a sentence. */
export function listeningBanks(spec: UnitSpeechSpec): { readonly hearWord: readonly Asked[]; readonly hearSentence: readonly Asked[] } {
  const id = levelListeningId(spec.level, spec.unit);
  const { words, chars } = spec;
  const pinyin = (w: LevelOneWord) => pinyinOf(w.syllables);
  // Every pair of words is compared, so each text's sound is worked out once: at a Worker's startup this is most of the cost.
  const sounds = new Map<string, readonly string[]>();
  const soundOf = (text: string): readonly string[] => {
    let s = sounds.get(text);
    if (!s) {
      s = sound(text, chars);
      sounds.set(text, s);
    }
    return s;
  };
  const sameSound = (a: LevelOneWord, b: LevelOneWord) => soundOf(a.word).join(" ") === soundOf(b.word).join(" ");

  const byWord = items(words, (w, o) => !sameSound(w, o) && o.meaning.en !== w.meaning.en && o.meaning["zh-CN"] !== w.meaning["zh-CN"]);
  ensure(id, "words", byWord.length);
  for (const w of words) heard(w.word);
  const hearWord: readonly Asked[] = byWord.map(
    ({ word, wrong }) =>
      (rng) =>
        choiceProblem(
          {
            prompt: t("Listen. What does the word you hear mean?", "听录音。你听到的词是什么意思？"),
            listen: [heard(word.word)],
            solution: t(
              `You hear **${word.word}** ${pinyin(word)}, which means “${word.meaning.en}”.`,
              `你听到的是 **${word.word}** ${pinyin(word)}，意思是“${word.meaning["zh-CN"]}”。`,
            ),
          },
          rng,
          meaningOf(word),
          wrong.map(meaningOf),
        ),
  );

  const inSentence = items(words, (w, o) => {
    const s = filled(w);
    const heardSounds = soundOf(s);
    return (
      ![...o.word].some((c) => s.includes(c)) &&
      !soundsIn(soundOf(o.word), heardSounds) &&
      !w.word.includes(o.word) &&
      !o.word.includes(w.word) &&
      !w.near.includes(o.word) &&
      !o.near.includes(w.word)
    );
  });
  ensure(id, "sentences", inSentence.length);
  for (const w of words) heard(filled(w));
  const hearSentence: readonly Asked[] = inSentence.map(({ word, wrong }) => (rng) => {
    const s = filled(word);
    return choiceProblem(
      {
        prompt: t("Listen to the sentence. Which of these words do you hear in it?", "听句子。你在句子里听到了下面哪个词？"),
        listen: [heard(s)],
        solution: t(`You hear:\n\n> ${s}\n\nThe word is **${word.word}**.`, `你听到的是：\n\n> ${s}\n\n这个词是 **${word.word}**。`),
      },
      rng,
      same(word.word),
      wrong.map((o) => same(o.word)),
    );
  });
  return { hearWord, hearSentence };
}

/** specs are the units built so far, by level, filled as the levels build their listening: the HSK courses mix them. */
const specs = new Map<number, UnitSpeechSpec[]>();

/** unitSpeechSpecs are the units of a level whose listening is built, in order; a level must be built before it is asked for. */
export function unitSpeechSpecs(level: number): readonly UnitSpeechSpec[] {
  const units = specs.get(level);
  if (!units) throw new Error(`level ${level}: its listening is not built yet`);
  return units;
}

/** buildUnitListeningTopic builds the listening topic of a unit: a word heard by its meaning, then a word heard in a sentence. */
function buildUnitListeningTopic(spec: UnitSpeechSpec): TopicDef {
  const id = levelListeningId(spec.level, spec.unit);
  const { hearWord, hearSentence } = listeningBanks(spec);
  specs.set(spec.level, [...(specs.get(spec.level) ?? []).filter((x) => x.unit !== spec.unit), spec]);

  return {
    id,
    title: t(
      `Level ${spec.level} Listening ${two(spec.unit)}: ${spec.theme.en}`,
      `${spec.numeral}级听力 ${two(spec.unit)}：${spec.theme["zh-CN"]}`,
    ),
    summary: t(
      `Hearing the words of the unit ${spec.theme.en}, alone and in sentences, without seeing them.`,
      `不看文字，听懂“${spec.theme["zh-CN"]}”单元的词语，单说的和在句子里的。`,
    ),
    prerequisites: [spec.after],
    encompasses: [],
    xp: 10,
    strand: "listening",
    knowledgePoints: [
      point(
        `${id}-words`,
        t("Words You Hear", "听词语"),
        t(
          "A word of this unit is played; you do not see it. Listen to every syllable and its tone: words of the unit may sound alike but for one tone. Then choose what it means. You can play it again as often as you like.",
          "播放本单元的一个词，你看不到它。注意听每个音节和它的声调：本单元有些词只差一个声调。然后选出它的意思。录音可以反复播放。",
        ),
        fromBank(hearWord),
      ),
      point(
        `${id}-sentences`,
        t("Words in Sentences", "句子里的词"),
        t(
          "A sentence with a word of this unit is played; you do not see it. Listen to the whole sentence first, then think which of the three words was in it. In speech, words run together: listen for the syllables of each word one after another.",
          "播放一个含有本单元词语的句子，你看不到句子。先听完整个句子，再想三个词里哪一个出现过。说话时词和词连在一起，注意听每个词的几个音节是不是连着出现。",
        ),
        fromBank(hearSentence),
      ),
    ],
  };
}

/** unitListeningTopic builds a unit's listening topic, keeping its problem banks only while they are used (see slimmed). */
export const unitListeningTopic = slimmed(buildUnitListeningTopic);

/** heardAs is the response of a text heard clearly. */
const heardAs = (text: string) => heardResponse({ text, confidence: 0.95, seconds: [...text].length * 0.4 + 0.5 });

/** readSeconds is how long a reading of a sentence may take: about half a second a character, and some to start and stop. */
const readSeconds = (text: string) => Math.min(30, 5 + Math.ceil([...text].length * 0.5));

/** spokenProblem is a problem answered by saying a text, after its recording or read from the screen. */
function spokenProblem(
  fields: Pick<Problem, "prompt" | "listen" | "solution">,
  mode: "repeat" | "read",
  text: string,
  other: string,
  maxSeconds: number,
): Problem {
  return {
    ...fields,
    answer: {
      checker: "speech",
      expected: { mode, reference: text },
      input: { kind: "speech", language: LANGUAGE, mode, text, maxSeconds },
    },
    canonical: heardAs(text),
    wrong: [heardAs(other)],
  };
}

/** speakingBanks are the problems of a unit's speaking: a word said after its recording, and a sentence read aloud. */
export function speakingBanks(spec: UnitSpeechSpec): { readonly sayWord: readonly Asked[]; readonly readSentence: readonly Asked[] } {
  const id = levelSpeakingId(spec.level, spec.unit);
  const { words } = spec;
  if (words.length < 20) throw new Error(`${id}: ${words.length} words, fewer than 20`);
  // Another text of the unit, said instead, is the wrong answer: the first from seven along that shares too few
  // characters with the right one to pass for it.
  const otherOf = (texts: readonly string[], i: number, share: number): string => {
    const own = new Set(texts[i]);
    for (let d = 7; d < texts.length + 7; d++) {
      const other = texts[(i + d) % texts.length]!;
      const common = [...other].filter((c) => own.has(c) && /\p{Script=Han}/u.test(c)).length;
      if (common <= share * [...own].length) return other;
    }
    throw new Error(`${id}: nothing to say instead of ${texts[i]}`);
  };
  // A unit with fewer than MIN_ITEMS words is topped up with the words of the level's units before it, latest first.
  const earlier = (specs.get(spec.level) ?? []).filter((x) => x.unit < spec.unit).reverse();
  const sayable = [...words];
  for (const w of earlier.flatMap((x) => [...x.words].reverse())) {
    if (sayable.length >= MIN_ITEMS) break;
    if (!sayable.some((x) => x.word === w.word)) sayable.push(w);
  }
  const said = sayable.map((w) => w.word);
  // The recordings are named here, not when a problem is asked, so the recording tool finds every one.
  const sayAudio = said.map(heard);
  const sayWord: readonly Asked[] = sayable.map((w, i) => () => {
    const p = pinyinOf(w.syllables);
    return spokenProblem(
      {
        prompt: t(
          `Listen, then say the word after the recording:\n\n**${w.word}** ${p}`,
          `听录音，然后跟着说这个词：\n\n**${w.word}** ${p}`,
        ),
        listen: [sayAudio[i]!],
        solution: t(`Say each syllable in its tone: ${p}.`, `每个音节读准声调：${p}。`),
      },
      "repeat",
      w.word,
      otherOf(said, i, 0),
      5,
    );
  });
  // A unit with fewer than MIN_ITEMS sentences also reads two of its sentences in a row, each with the one after it.
  const single = [...new Set(words.map(filled))];
  const pairs = single.map((x, i) => `${x}${single[(i + 1) % single.length]}`);
  const read = [...single, ...pairs.slice(0, Math.max(0, MIN_ITEMS - single.length))];
  const readAudio = read.map(heard);
  const readSentence: readonly Asked[] = read.map((s, i) => () => {
    return spokenProblem(
      {
        prompt: t(`Read the sentence aloud:\n\n> ${s}`, `大声朗读这个句子：\n\n> ${s}`),
        listen: [readAudio[i]!],
        solution: t("Listen to the sentence read aloud, and read it once more with it.", "听一听这个句子的朗读，再跟着读一遍。"),
      },
      "read",
      s,
      otherOf(read, i, 0.3),
      readSeconds(s),
    );
  });
  return { sayWord, readSentence };
}

/** buildUnitSpeakingTopic builds the speaking topic of a unit: its words said after a recording, then its sentences read aloud. */
function buildUnitSpeakingTopic(spec: UnitSpeechSpec): TopicDef {
  const id = levelSpeakingId(spec.level, spec.unit);
  const { sayWord, readSentence } = speakingBanks(spec);
  return {
    id,
    title: t(
      `Level ${spec.level} Speaking ${two(spec.unit)}: ${spec.theme.en}`,
      `${spec.numeral}级口语 ${two(spec.unit)}：${spec.theme["zh-CN"]}`,
    ),
    summary: t(
      `Saying the words of the unit ${spec.theme.en} after a recording, and reading its sentences aloud.`,
      `跟着录音说“${spec.theme["zh-CN"]}”单元的词语，并朗读它们的句子。`,
    ),
    prerequisites: [levelListeningId(spec.level, spec.unit)],
    encompasses: [],
    xp: 10,
    strand: "speaking",
    spoken: LANGUAGE,
    knowledgePoints: [
      point(
        `${id}-words`,
        t("Saying Words", "说词语"),
        t(
          "Listen to the recording, then say the word at the same pace, each syllable in its tone. Where two third tones meet, or before 一 and 不 change, copy the recording rather than the written tones.",
          "先听录音，再用同样的速度说出这个词，每个音节读准声调。两个第三声相连，或者“一”“不”变调的地方，照录音说，不要照着拼音的原调说。",
        ),
        fromBank(sayWord),
      ),
      point(
        `${id}-sentences`,
        t("Reading Sentences Aloud", "朗读句子"),
        t(
          "Read the sentence aloud at a calm speed, as if you were telling someone, keeping the words of a phrase together. If a word is hard, listen to the recording, then read again.",
          "用平稳的速度大声朗读句子，像在讲给别人听，一个词组里的字要连起来读。遇到难读的词，先听录音，再读一遍。",
        ),
        fromBank(readSentence),
      ),
    ],
  };
}

/** unitSpeakingTopic builds a unit's speaking topic, keeping its problem banks only while they are used (see slimmed). */
export const unitSpeakingTopic = slimmed(buildUnitSpeakingTopic);
