// Speaking topics of the levels (S2–S4): problems answered by speaking, heard by a speech service and checked by the
// speech checker. Each unit has two, after its listening: one where the unit's words are said after a recording (S2)
// and its sentences read aloud (S3), then one where questions on its theme are answered aloud in a full sentence with a
// given word (S4). Answering aloud is verbatim: a service that corrects "She go" to "She goes" would pass a wrong
// answer, so it is taught only through a route tested for keeping errors, and without one the course goes on. An accent
// passes as long as the words are understood: a pronunciation score, when a route gives one, only needs to reach a
// bar that a clear speaker with any accent reaches.

import { type Generator, heardResponse, type Json, type Problem, type Rng, spokenWords, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { heard, spoken, withSounds } from "../audio.ts";
import { heteronyms, interleave, type WordDef, wordsOf } from "./words.ts";

/** LANGUAGE is the language the levels' speaking is heard in: the accent of their recordings. */
export const LANGUAGE = "en-US";

/** minItems is the fewest distinct items a speaking knowledge point may have. */
const minItems = 10;

/** MAX_READ_WORDS is the longest sentence the levels ask to read aloud. */
const MAX_READ_WORDS = 14;

const ensureItems = (id: string, name: string, n: number) => {
  if (n < minItems) throw new Error(`${id}: ${name} has ${n} items, fewer than ${minItems}`);
};

/** readSeconds is how long a recording of a text may be: about a second a word, and some to start and stop. */
export const readSeconds = (text: string) => Math.min(30, 5 + Math.ceil(spokenWords(text).length * 0.9));

/** heardAs is the response of a text heard clearly. */
export const heardAs = (text: string) => heardResponse({ text, confidence: 0.95, seconds: Math.max(1, spokenWords(text).length * 0.5) });

/** SayFrame is a question on a unit's theme answered aloud in a full sentence: {x} in its answer is the word given. */
export interface SayFrame {
  readonly question: string;
  /** answers are the sentences that answer it, the first the model; each holds {x}. */
  readonly answers: readonly string[];
  readonly values: readonly string[];
}

/**
 * say builds a SayFrame. answers are separated by ` / `, the model first; contractions need no second form, since a
 * contraction and its full form are heard alike.
 */
export function say(question: string, answers: string, values: string): SayFrame {
  const list = answers.split(" / ").map((a) => a.trim());
  if (list.some((a) => !a.includes("{x}"))) throw new Error(`an answer needs {x}: ${answers}`);
  const vs = values.split(",").map((v) => v.trim());
  if (vs.length < 4 || new Set(vs).size !== vs.length) throw new Error(`a frame needs four distinct values: ${values}`);
  return { question, answers: list, values: vs };
}

/** UnitSpeakingSpec is a unit's speaking topic: its listening topic, which comes first, its vocabulary and its frames. */
export interface UnitSpeakingSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  /** listening is the unit's listening topic, the topic's prerequisite: the words are heard before they are said. */
  readonly listening: string;
  readonly words: readonly string[];
  readonly frames: readonly SayFrame[];
}

/** spokenProblem is a problem answered by speaking: the prompt, what is said, and the text shown to repeat or read. */
export function spokenProblem(
  fields: Omit<Problem, "answer" | "canonical" | "wrong">,
  mode: "repeat" | "read" | "say",
  model: string,
  accept: readonly string[],
  wrong: readonly string[],
  maxSeconds: number,
): Problem {
  const expected: Json = mode === "say" ? { mode, accept } : { mode, reference: model };
  return {
    ...fields,
    answer: {
      checker: "speech",
      expected,
      input: { kind: "speech", language: LANGUAGE, mode, ...(mode !== "say" && { text: model }), maxSeconds },
    },
    canonical: heardAs(model),
    wrong: wrong.map(heardAs),
  };
}

/** sayable are the words of a unit said alone: one word of letters, said only one way. */
const sayable = (words: readonly WordDef[]) =>
  words.filter((w) => /^\p{L}+$/u.test(w.head) && !heteronyms.has(w.head.toLowerCase()) && w.head.length > 1);

/** answeringId is the id of a unit's topic of answering aloud, from its speaking topic's: a1-speaking-x is a1-answering-x. */
export const answeringId = (speakingId: string) => speakingId.replace("-speaking-", "-answering-");

/** unitSpeaking builds a unit's two speaking topics: saying and reading aloud, then answering aloud. */
export function unitSpeaking(spec: UnitSpeakingSpec): readonly [TopicDef, TopicDef] {
  if (!spec.id.includes("-speaking-")) throw new Error(`${spec.id}: a speaking topic's id holds -speaking-`);
  const words = spec.words.flatMap(wordsOf);
  const said = sayable(words);
  ensureItems(spec.id, "repeat", said.length);
  for (const w of said) heard(w.head);
  const repeat: Generator = (rng) => {
    const w = rng.cycle(said)!;
    const other = w.confusions.find((c) => spokenWords(c).join(" ") !== spokenWords(w.head).join(" ")) ?? "hello";
    return spokenProblem(
      {
        prompt: t("Listen to the word, then say it.", "听这个词，然后说出来。"),
        listen: [heard(w.head)],
        solution: t(`The word is *${w.head}*: ${w.meaning.en}.`, `这个词是 *${w.head}*：${w.meaning["zh-CN"]}。`),
        ...withSounds(spoken(w.head)),
      },
      "repeat",
      w.head,
      [],
      [other],
      5,
    );
  };

  const sentences = interleave(words.map((w) => w.sentences.map((s) => s.full))).filter(
    (s, i, all) => all.indexOf(s) === i && spokenWords(s).length <= MAX_READ_WORDS,
  );
  ensureItems(spec.id, "read", sentences.length);
  const read: Generator = (rng) => {
    const s = rng.cycle(sentences)!;
    const half = spokenWords(s)
      .slice(0, Math.ceil(spokenWords(s).length / 2))
      .join(" ");
    return spokenProblem(
      {
        prompt: t("Read the sentence aloud.", "大声朗读这个句子。"),
        solution: t(`Listen to the sentence read aloud, and read it once more with it.`, "听一听这个句子的朗读，再跟着读一遍。"),
        ...withSounds(spoken(s)),
      },
      "read",
      s,
      [],
      [half],
      readSeconds(s),
    );
  };

  const asked = interleave(
    spec.frames.map((f) =>
      f.values.map((x, i) => ({
        frame: f,
        x,
        accept: f.answers.map((a) => a.replaceAll("{x}", x)),
        other: f.answers[0]!.replaceAll("{x}", f.values[(i + 1) % f.values.length]!),
      })),
    ),
  );
  ensureItems(spec.id, "say", asked.length);
  for (const f of spec.frames) heard(f.question);
  const answer: Generator = (rng: Rng) => {
    const item = rng.cycle(asked)!;
    const model = item.accept[0]!;
    const q = item.frame.question;
    return spokenProblem(
      {
        prompt: t(
          `Listen to the question, then answer it aloud in a full sentence with *${item.x}*.\n\n**${q}**`,
          `听问题，然后用 *${item.x}* 完整地大声回答。\n\n**${q}**`,
        ),
        listen: [heard(q)],
        solution: t(`You can say:\n\n> ${model}`, `可以这样说：\n\n> ${model}`),
        ...withSounds(spoken(model)),
      },
      "say",
      model,
      item.accept,
      [item.other, item.x],
      12,
    );
  };

  const speaking: TopicDef = {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    prerequisites: [spec.listening],
    encompasses: [],
    xp: 12,
    strand: "speaking",
    spoken: LANGUAGE,
    knowledgePoints: [
      point(
        "repeat",
        t("Say the words", "说单词"),
        t(
          "Play the word, then press record and say it as you heard it. You do not need to lose your accent: what counts is that the word is clear. Listen to the recording as often as you like before you speak.",
          "先播放这个词，再按下录音，照着听到的说出来。不需要改掉口音，关键是让人听清。开口之前，录音可以反复听。",
        ),
        repeat,
      ),
      point(
        "read",
        t("Read aloud", "朗读"),
        t(
          "Read the sentence aloud at a calm speed, as if you were telling someone. A small word missed is all right; the important words must be clear. If a word is new, listen to it in the solution and read again.",
          "用平稳的语速大声朗读，就像在对别人说话。漏掉一个小词没关系，但重要的词要读清楚。遇到生词，可以在解答里听它的读音再读一遍。",
        ),
        read,
      ),
    ],
  };
  const answering: TopicDef = {
    id: answeringId(spec.id),
    title: t(`Answering Aloud: ${spec.title.en.replace(/^Speaking: /, "")}`, `开口回答：${spec.title["zh-CN"].replace(/^口语：/, "")}`),
    summary: t(
      "Answer questions on the unit's theme aloud, in a full sentence with a given word.",
      "用给出的词，完整地大声回答本单元主题的问题。",
    ),
    prerequisites: [spec.id],
    encompasses: [],
    xp: 8,
    strand: "speaking",
    spoken: LANGUAGE,
    verbatim: true,
    knowledgePoints: [
      point(
        "say",
        t("Answer aloud", "开口回答"),
        t(
          "Listen to the question and answer it in a full sentence, with the word you are given. Say the whole sentence, not only the word, and use the question's own words: *Where do you live?* — *I live in Paris.*",
          "听问题，用给出的词完整地回答。要说出整句话，而不只是那个词，并借用问题里的说法：*Where do you live?* — *I live in Paris.*",
        ),
        answer,
      ),
    ],
  };
  return [speaking, answering];
}
