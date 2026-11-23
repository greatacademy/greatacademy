// The listening and speaking of a level's unit (docs/chinese-curriculum.md §8.4): after a unit's words, a topic where
// its words and their sentences are played and the learner, who does not see them, chooses what was said; then a topic
// where the words are said after a recording and the sentences read aloud, heard by a speech service. The recordings
// are made by tools/audio from the words and sentences of the unit, so the topics need no data of their own.

import { type Generator, heardResponse, type Problem, type Rng, same, slimmed, type Text, type TopicDef, t } from "@ga/content";
import { point, toneless, zhQuote } from "@ga/subject-chinese";

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
export interface Item {
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

const ORDINALS = ["first", "second", "third", "fourth", "fifth", "sixth"];

/** ordinal names a syllable's place in a word, counting from 0. */
const ordinal = (k: number): Text => t(ORDINALS[k] ?? `${k + 1}th`, `第${"一二三四五六"[k] ?? k + 1}个`);

/** contrast tells how a word offered against a word heard sounds different from it: its count of syllables, or the first syllable that differs. */
function contrast(heardWord: LevelOneWord, other: LevelOneWord): Text {
  const h = heardWord.syllables;
  const o = other.syllables;
  const p = pinyinOf(o);
  if (h.length !== o.length)
    return t(
      `**${other.word}** ${p} has ${o.length} syllable${o.length === 1 ? "" : "s"}, not ${h.length}`,
      `“${other.word}”${p}有${o.length}个音节，不是${h.length}个`,
    );
  const k = Math.max(
    0,
    h.findIndex((x, i) => x !== o[i]),
  );
  const sameBase = toneless(h[k] ?? "") === toneless(o[k] ?? "");
  const place = ordinal(k);
  return sameBase
    ? t(
        `**${other.word}** ${p} has the same ${place.en} syllable in another tone: ${o[k]}, not ${h[k]}`,
        `“${other.word}”${p}的${place["zh-CN"]}音节声调不同：是 ${o[k]}，不是 ${h[k]}`,
      )
    : t(
        `**${other.word}** ${p} has ${o[k]} as its ${place.en} syllable, not ${h[k]}`,
        `“${other.word}”${p}的${place["zh-CN"]}音节是 ${o[k]}，不是 ${h[k]}`,
      );
}

/** syllableList spells a word's syllables one by one. */
const syllableList = (w: LevelOneWord): Text => t(w.syllables.join(", "), w.syllables.join("、"));

/** marked is a sentence with its word in bold. */
const marked = (w: LevelOneWord): string => filled(w).replace(w.word, `**${w.word}**`);

/** around is a word in its sentence with the characters said next to it: up to two before and one after. */
function around(w: LevelOneWord): string {
  const s = [...filled(w)];
  const n = [...w.word].length;
  const at = [...w.sentence.split(GAP)[0]!].length;
  const han = (c: string | undefined) => c !== undefined && /\p{Script=Han}/u.test(c);
  let from = at;
  while (from > at - 2 && han(s[from - 1])) from--;
  const to = han(s[at + n]) ? at + n + 1 : at + n;
  return s.slice(from, to).join("");
}

/** foundIn says where a word's syllables are heard in its sentence: one syllable, or several one after another. */
function foundIn(w: LevelOneWord): Text {
  const where = around(w);
  return w.syllables.length === 1
    ? t(`you hear ${w.syllables[0]} in ${where}`, `在“${where}”里听到了 ${w.syllables[0]}`)
    : t(`you hear ${w.syllables.join(" ")} one after another in ${where}`, `在“${where}”里连着听到了 ${w.syllables.join(" ")}`);
}

/** absent says how a word offered against a sentence would sound, and that the sentence has no such sound, so it can be checked against the recording. */
function absent(o: LevelOneWord): Text {
  const p = pinyinOf(o.syllables);
  return o.syllables.length === 1
    ? t(
        `**${o.word}** would be ${p}, and the sentence has no ${p}, nor ${toneless(p)} in another tone`,
        `“${o.word}”读 ${p}，句子里没有 ${p}，别的声调的 ${toneless(p)} 也没有`,
      )
    : t(
        `**${o.word}** would be ${p}, and the sentence never has ${o.syllables.join(" ")} together`,
        `“${o.word}”读 ${p}，句子里没有连着出现 ${o.syllables.join(" ")}`,
      );
}

/**
 * wordCheck checks a word heard alone. A word of several syllables is said back against the recording a syllable at a
 * time; a word of one syllable, which that would only repeat, is put back into its sentence and read for its meaning.
 */
function wordCheck(w: LevelOneWord): Text {
  const p = pinyinOf(w.syllables);
  return w.syllables.length === 1
    ? t(
        `**Check.** Put **${w.word}** ${p} back into a sentence of this unit and read it for sense: ${marked(w)} There it means "${w.meaning.en}", and the sentence makes sense.`,
        `**检验。** 把“${w.word}”${p}放回本单元的句子里读一读：${marked(w)}在这里它的意思是${zhQuote(w.meaning["zh-CN"])}，句子说得通。`,
      )
    : t(
        `**Check.** Say ${p} back against the recording, a syllable at a time: ${syllableList(w).en}. Every syllable and tone matches, and **${w.word}** means "${w.meaning.en}".`,
        `**检验。** 对着录音，一个音节一个音节地说一遍 ${p}：${syllableList(w)["zh-CN"]}。每个音节和声调都对得上，“${w.word}”的意思正是${zhQuote(w.meaning["zh-CN"])}。`,
      );
}

/** ListeningExample is a turn of each knowledge point, to explain them with. */
export interface ListeningExample {
  /** word is a word heard alone with the two offered against it. */
  readonly word: Item;
  /** sentence is a word heard in its sentence with the two offered against it. */
  readonly sentence: Item;
  /** alike are two words of the unit that start with the same syllable, if there are any. */
  readonly alike?: readonly [LevelOneWord, LevelOneWord];
}

/** wordsExplanation explains hearing a word alone with an example turn. */
export function wordsExplanation(ex: ListeningExample): Text {
  const { word: w, wrong } = ex.word;
  const [a, b] = wrong;
  const p = pinyinOf(w.syllables);
  const alike = ex.alike;
  const watch = alike
    ? t(
        `> **Watch out.** Do not choose after the first syllable: **${alike[0].word}** ${pinyinOf(alike[0].syllables)} and **${alike[1].word}** ${pinyinOf(alike[1].syllables)} start alike. Hear the word to its last syllable.`,
        `> **注意。** 不要只听第一个音节就选：“${alike[0].word}”${pinyinOf(alike[0].syllables)}和“${alike[1].word}”${pinyinOf(alike[1].syllables)}开头一样。要把词听到最后一个音节。`,
      )
    : t(
        `> **Watch out.** Do not choose after the first syllable: hear the word to its last syllable, tone and all, before you look at the meanings.`,
        `> **注意。** 不要只听第一个音节就选：把词连同声调听到最后一个音节，再看意思。`,
      );
  return t(
    `A word is played and you do not see it. Count its syllables and hear the tone of each, then match the sound to a meaning. Take a recording of **${w.word}**: you hear ${w.syllables.length} syllable${w.syllables.length === 1 ? "" : "s"}, ${syllableList(w).en}, so it is ${p}, which means "${w.meaning.en}". Against it you might see "${a.meaning.en}", but ${contrast(w, a).en}; and "${b.meaning.en}", but ${contrast(w, b).en}. You can play the recording again as often as you like.\n\n${watch.en}`,
    `播放一个词，你看不到它。先数有几个音节，听清每个音节的声调，再把听到的音和意思对上。比如录音里是 **${w.word}**：听到${w.syllables.length}个音节，${syllableList(w)["zh-CN"]}，就是 ${p}，意思是${zhQuote(w.meaning["zh-CN"])}。选项里可能有${zhQuote(a.meaning["zh-CN"])}，可是${contrast(w, a)["zh-CN"]}；还有${zhQuote(b.meaning["zh-CN"])}，可是${contrast(w, b)["zh-CN"]}。录音可以反复播放。\n\n${watch["zh-CN"]}`,
  );
}

/** sentencesExplanation explains hearing a word in a sentence with an example turn. */
export function sentencesExplanation(ex: ListeningExample): Text {
  const { word: w, wrong } = ex.sentence;
  const [a] = wrong;
  return t(
    `A sentence is played and you do not see it. Hear it to the end, then look for each word offered: is it there, every syllable in turn? Take the sentence ${filled(w)} Here ${foundIn(w).en}, so **${w.word}** was said. ${absent(a).en}, so it was not.\n\n> **Watch out.** In speech words run together, and one syllable of a word may turn up inside another word. Count a word as heard only when all its syllables come one after another.`,
    `播放一个句子，你看不到它。先听完整句，再看每个选项：它的每个音节是不是依次出现了？比如句子“${filled(w)}”，${foundIn(w)["zh-CN"]}，所以说到了 **${w.word}**。${absent(a)["zh-CN"]}，所以没有说到它。\n\n> **注意。** 说话时词和词连在一起，一个词的某个音节可能出现在别的词里。只有一个词的几个音节都连着出现，才算听到了这个词。`,
  );
}

/** listeningBanks are the problems of a unit's listening: a word heard by its meaning, and a word heard in a sentence. */
export function listeningBanks(spec: UnitSpeechSpec): {
  readonly hearWord: readonly Asked[];
  readonly hearSentence: readonly Asked[];
  readonly example: ListeningExample;
} {
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
  const sameSound = (a: LevelOneWord, b: LevelOneWord) =>
    soundOf(a.word).join(" ") === soundOf(b.word).join(" ") || a.syllables.map(toneless).join(" ") === b.syllables.map(toneless).join(" ");

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
              `You hear ${word.syllables.length} syllable${word.syllables.length === 1 ? "" : "s"}, ${syllableList(word).en}: the word **${word.word}** ${pinyin(word)}, which means "${word.meaning.en}".\n\n${wrong.map((o) => `"${o.meaning.en}" is not it: ${contrast(word, o).en}.`).join("\n\n")}\n\n${wordCheck(word).en}`,
              `你听到${word.syllables.length}个音节，${syllableList(word)["zh-CN"]}：是 **${word.word}** ${pinyin(word)}，意思是${zhQuote(word.meaning["zh-CN"])}。\n\n${wrong.map((o) => `${zhQuote(o.meaning["zh-CN"])}不对：${contrast(word, o)["zh-CN"]}。`).join("\n\n")}\n\n${wordCheck(word)["zh-CN"]}`,
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
        solution: t(
          `You hear:\n\n> ${s}\n\nIn it ${foundIn(word).en}: the word is **${word.word}** ${pinyin(word)}.\n\n${wrong.map((o) => `${absent(o).en}.`).join("\n\n")}\n\n**Check.** Read the sentence again and stop at the word: ${marked(word)} There **${word.word}** is said whole, ${pinyin(word)}.`,
          `你听到的是：\n\n> ${s}\n\n句子里，${foundIn(word)["zh-CN"]}：这个词是 **${word.word}** ${pinyin(word)}。\n\n${wrong.map((o) => `${absent(o)["zh-CN"]}。`).join("\n\n")}\n\n**检验。** 再读一遍句子，停在这个词上：${marked(word)}这里完整地说出了“${word.word}”，${pinyin(word)}。`,
        ),
      },
      rng,
      same(word.word),
      wrong.map((o) => same(o.word)),
    );
  });
  const toneless1 = (w: LevelOneWord) => toneless(w.syllables[0] ?? "");
  const alike = words.flatMap((w, i) =>
    words.slice(i + 1).flatMap((o): [LevelOneWord, LevelOneWord][] => (toneless1(w) === toneless1(o) && w.word !== o.word ? [[w, o]] : [])),
  )[0];
  const example: ListeningExample = { word: byWord[0]!, sentence: inSentence[0]!, ...(alike ? { alike } : {}) };
  return { hearWord, hearSentence, example };
}

/** specs are the units of each level, by level, filled as the levels are planned: the HSK courses mix them. */
const specs = new Map<number, readonly UnitSpeechSpec[]>();

/** registerUnitSpeech records the units of a level, in order, for its speaking and the HSK courses. */
export function registerUnitSpeech(level: number, units: readonly UnitSpeechSpec[]): void {
  specs.set(level, units);
}

/** unitSpeechSpecs are the units of a level, in order; a level must be planned before it is asked for. */
export function unitSpeechSpecs(level: number): readonly UnitSpeechSpec[] {
  const units = specs.get(level);
  if (!units) throw new Error(`level ${level}: it is not planned yet`);
  return units;
}

/** buildUnitListeningTopic builds the listening topic of a unit: a word heard by its meaning, then a word heard in a sentence. */
function buildUnitListeningTopic(spec: UnitSpeechSpec): TopicDef {
  const id = levelListeningId(spec.level, spec.unit);
  const { hearWord, hearSentence, example } = listeningBanks(spec);
  const w = example.word.word;
  const sw = example.sentence.word;

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
    intro: t(
      `Take **${w.word}** ${pinyinOf(w.syllables)}: here you hear it played without seeing it, and choose what it means, "${w.meaning.en}". Then you hear the unit's words in their sentences, as in ${filled(sw)}, and pick out the word that was said, **${sw.word}**. Listen for every syllable and its tone; you can play each recording as often as you like.`,
      `比如 **${w.word}** ${pinyinOf(w.syllables)}：这里只听录音、不看文字，选出它的意思${zhQuote(w.meaning["zh-CN"])}。然后听本单元的词语在句子里怎么说，比如“${filled(sw)}”，找出句子里说到的词“${sw.word}”。要听清每个音节和它的声调；录音可以反复播放。`,
    ),
    prerequisites: [spec.after],
    encompasses: [],
    xp: 10,
    strand: "listening",
    knowledgePoints: [
      point(`${id}-words`, t("Words You Hear", "听词语"), wordsExplanation(example), fromBank(hearWord)),
      point(`${id}-sentences`, t("Words in Sentences", "句子里的词"), sentencesExplanation(example), fromBank(hearSentence)),
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
          "Listen to the recording, then say the word at the same pace, each syllable in its tone. 一 and 不 are written in the tone they are said in; where two third tones meet, the first is written as a third tone but said in the second, so copy the recording rather than the written tones.",
          "先听录音，再用同样的速度说出这个词，每个音节读准声调。“一”“不”的拼音按实际读的变调标写；两个第三声相连时，前一个仍标第三声，却要读第二声，这里照录音说，不要照着拼音的原调说。",
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
