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
import { watched } from "../watch.ts";
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
  /** watchOut is the topics' own Watch out for saying the words, reading sentences aloud, and answering aloud. */
  readonly watchOut?: { readonly repeat: Text; readonly read: Text; readonly say: Text };
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
        solution: t(
          `The word is *${w.head}*: ${w.meaning.en.replace(/[.。]+$/u, "")}.\n\n**Check.** Replay the recording of *${w.head}* and say it once more right after, matching the stressed syllable and final sound.`,
          `这个词是 *${w.head}*：${w.meaning["zh-CN"].replace(/[.。]+$/u, "")}。\n\n**检验。** 再听一遍 *${w.head}* 的示范发音并跟读一次，注意重读音节和词尾发音。`,
        ),
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
        solution: t(
          `Listen to the sentence read aloud, and read it once more with it.\n\n**Check.** Compare your reading with the recording—make sure every small word (*a*, *the*, *is*, *in*) and word ending is spoken clearly.`,
          `听一听这个句子的朗读，再跟着读一遍。\n\n**检验。** 把你的朗读对照示范录音听一遍——确认每个小词（*a*、*the*、*is*、*in*）和词尾都读清楚了。`,
        ),
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
        solution: t(
          `You can say:\n\n> ${model}\n\n**Check.** Replay the model answer and compare your sentence—confirm you spoke a complete sentence with a subject, a verb, and *${item.x}*, not just the single word.`,
          `可以这样说：\n\n> ${model}\n\n**检验。** 听一遍示范回答并对照自己说的话——确认你说出的是包含主语、动词和 *${item.x}* 的完整句子，而不只是单个词。`,
        ),
        ...withSounds(spoken(model)),
      },
      "say",
      model,
      item.accept,
      [item.other, item.x],
      12,
    );
  };

  const w0 = said[0]!;
  const w1 = said[1] ?? w0;
  const s0 = sentences[0]!;
  const s1 = sentences[1] ?? s0;
  const f0 = spec.frames[0]!;
  const f0Val = f0.values[0]!;
  const f0Model = f0.answers[0]!.replaceAll("{x}", f0Val);

  const speaking: TopicDef = {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    intro: t(
      `Start by hearing *${w0.head}* clearly and saying it aloud, then move up to reading a full sentence such as: *${s0}* In this topic, you repeat this unit's key words after a model recording and read complete sentences aloud at a steady pace.`,
      `先听清 *${w0.head}* 并大声跟读，再进阶到完整朗读句子，例如：*${s0}* 本主题带你先跟读本单元核心词汇，再以平稳语速朗读完整句子。`,
    ),
    prerequisites: [spec.listening],
    encompasses: [],
    xp: 12,
    strand: "speaking",
    spoken: LANGUAGE,
    knowledgePoints: [
      point(
        "repeat",
        t("Say the words", "说单词"),
        watched(
          t(
            `Play the word—such as *${w1.head}*—then press record and say it as you heard it. You do not need to lose your accent: what counts is that the word is clear. Listen to the recording as often as you like before you speak.\n\n> **Watch out.** Speak at a clear, steady volume and finish the final consonant so the word is not mistaken for a similar-sounding word.`,
            `先播放这个词（例如 *${w1.head}*），再按下录音，照着听到的说出来。不需要改掉口音，关键是让人听清。开口之前，录音可以反复听。\n\n> **注意。** 用清晰平稳的音量说出每个词，尤其要把词尾辅音发完整，避免听起来像另一个相近的词。`,
          ),
          spec.watchOut?.repeat,
        ),
        repeat,
      ),
      point(
        "read",
        t("Read aloud", "朗读"),
        watched(
          t(
            `Read the sentence aloud at a calm speed—for example: *${s1}* Read every word as it is written, small words too, and say each one clearly. If a word is new, listen to it in the solution and read again.\n\n> **Watch out.** Do not skip small words (*a*, *the*, *is*, *to*) or swallow plural *-s* endings; read every word on the screen cleanly.`,
            `用平稳的语速大声朗读，例如：*${s1}* 每个词都要照原文读出来，小词也不能漏，每个词都要读清楚。遇到生词，可以在解答里听它的读音再读一遍。\n\n> **注意。** 不要漏读 *a*、*the*、*is*、*to* 等小词，也不要吞掉复数 *-s* 词尾；把屏幕上的每个词都读清楚。`,
          ),
          spec.watchOut?.read,
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
    intro: t(
      `When someone asks *${f0.question}* and gives you *${f0Val}*, a full spoken answer sounds like: *${f0Model}* In this topic, you listen to questions on this unit's theme and answer aloud in complete sentences.`,
      `当别人问 *${f0.question}* 并给出提示词 *${f0Val}* 时，完整的口语回答是：*${f0Model}* 本主题带你听懂本单元主题的问题，并用完整句子大声作答。`,
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
        watched(
          t(
            "Listen to the question and answer it in a full sentence, with the word you are given. Say the whole sentence, not only the word, and use the question's own words: *Where do you live?* — *I live in Paris.*\n\n> **Watch out.** Never answer with just the single given word—speak a full sentence with a subject and the right verb form.",
            "听问题，用给出的词完整地回答。要说出整句话，而不只是那个词，并借用问题里的说法：*Where do you live?* — *I live in Paris.*\n\n> **注意。** 不要只说出给出的单个词——要说出包含主语和正确动词形式的完整句子。",
          ),
          spec.watchOut?.say,
        ),
        answer,
      ),
    ],
  };
  return [speaking, answering];
}
