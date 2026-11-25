// Listening topics of the levels (S1): problems that play a recording the learner hears but does not see, and ask
// about it with a choice. Two kinds are built here. A pair topic tells apart two sounds that speakers of Chinese and
// many other languages merge, as in *ship* and *sheep*, with words that differ only in them. A unit's listening topic
// asks which of the unit's words a sentence says, then what short dialogues and announcements on the theme say.

import { type Generator, type Mistake, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { heard, type Line, spoken, withSounds } from "../audio.ts";
import { watched } from "../watch.ts";
import { levelAuralIntro } from "./intros.ts";
import { heteronyms, interleave, latestOf, type WordDef, wordsOf } from "./words.ts";

/** minItems is the fewest distinct items a listening knowledge point may have. */
const minItems = 30;

/** choice is a choice problem from its options, the index of the right one, and feedback on wrong ones. */
function choice(
  fields: Omit<Problem, "answer" | "canonical" | "wrong" | "mistakes">,
  options: readonly Text[],
  right: number,
  mistakes: readonly Mistake[] = [],
): Problem {
  return {
    ...fields,
    answer: { checker: "choice", expected: right, input: { kind: "choice", options } },
    canonical: String(right),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(right)),
    ...(mistakes.length > 0 && { mistakes }),
  };
}

/** shuffled places a right option among wrong ones at random, giving the options and the right one's index. */
function shuffled(rng: Rng, right: string, wrong: readonly string[]): { options: readonly string[]; right: number } {
  const options = rng.shuffle([right, ...wrong]);
  return { options, right: options.indexOf(right) };
}

const ensureItems = (id: string, name: string, n: number) => {
  if (n < minItems) throw new Error(`${id}: ${name} has ${n} items, fewer than ${minItems}`);
};

// Pairs of sounds.

/** PairSpec is a topic that tells apart two sounds: the words that differ only in them, as "ship sheep, sit seat". */
export interface PairSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly prerequisites: readonly string[];
  /** sounds explains how the two sounds differ and how to hear it. */
  readonly sounds: Text;
  readonly pairs: string;
  /** watchOut is the topic's own Watch out for telling which word is heard, and whether two words are the same. */
  readonly watchOut?: { readonly which: Text; readonly same: Text };
}

/** pairTopic builds a topic that tells apart two sounds, from pairs of words that differ only in them. */
export function pairTopic(spec: PairSpec): TopicDef {
  const pairs = spec.pairs.split(",").map((pair) => {
    const words = pair.trim().split(/\s+/u);
    const [a, b] = words;
    if (words.length !== 2 || !a || !b) throw new Error(`${spec.id}: "${pair}" is not a pair of words`);
    for (const w of words) if (heteronyms.has(w)) throw new Error(`${spec.id}: ${w} is said two ways`);
    return [a, b] as const;
  });
  if (new Set(pairs.flat()).size !== pairs.length * 2) throw new Error(`${spec.id}: a word in two pairs`);
  for (const w of pairs.flat()) heard(w);
  const sounds = (...words: readonly string[]) => withSounds(...[...new Set(words)].map(spoken));

  const which = pairs.flatMap(([a, b]): (readonly [string, string])[] => [
    [a, b],
    [b, a],
  ]);
  ensureItems(spec.id, "which", which.length);
  const whichWord: Generator = (rng) => {
    const [said, other] = rng.cycle(which)!;
    const { options, right } = shuffled(rng, said, [other]);
    return choice(
      {
        prompt: t("Listen. Which word do you hear?", "听录音。你听到的是哪个词？"),
        listen: [heard(said)],
        solution: t(
          `You hear *${said}*, not *${other}*. Listen to both and hear the difference.\n\n**Check.** Replay *${said}* and *${other}* back to back and focus on the single contrasting sound that separates them.`,
          `你听到的是 *${said}*，不是 *${other}*。把两个词都听一听，听出它们的区别。\n\n**检验。** 把 *${said}* 和 *${other}* 连续重放一遍，专注分辨把它们区分开的那一个音。`,
        ),
        ...sounds(said, other),
      },
      options.map(same),
      right,
      [
        {
          response: String(options.indexOf(other)),
          feedback: t(
            `*${other}* is the other word of the pair: it has the other sound. Replay the clip and listen for the sound that changes.`,
            `*${other}* 是这一对里的另一个词，用的是另一个音。重放录音，注意听那个变化的音。`,
          ),
        },
      ],
    );
  };

  const twice = interleave(
    pairs.map(([a, b]): (readonly [string, string])[] => [
      [a, b],
      [a, a],
      [b, a],
      [b, b],
    ]),
  );
  ensureItems(spec.id, "same", twice.length);
  const sameOrNot: Generator = (rng) => {
    const [first, second] = rng.cycle(twice)!;
    const alike = first === second;
    return choice(
      {
        prompt: t(
          "Listen to the two words. Are they the same word, or two different words?",
          "听这两个词。它们是同一个词，还是两个不同的词？",
        ),
        listen: [heard(first), heard(second)],
        solution: alike
          ? t(
              `You hear *${first}* twice: the same word.\n\n**Check.** Replay both clips back to back—the target sound stays identical from first to second (*${first}*).`,
              `你两次听到的都是 *${first}*：是同一个词。\n\n**检验。** 连续重放两段录音——两次的目标发音完全一致，都是 *${first}*。`,
            )
          : t(
              `You hear *${first}* and then *${second}*: two different words.\n\n**Check.** Replay both clips back to back—listen for the shift on the target sound between *${first}* and *${second}*.`,
              `你先听到 *${first}*，再听到 *${second}*：是两个不同的词。\n\n**检验。** 连续重放两段录音——注意听 *${first}* 与 *${second}* 在目标音上的明显差别。`,
            ),
        ...sounds(first, second),
      },
      [t("The same word", "同一个词"), t("Two different words", "两个不同的词")],
      alike ? 0 : 1,
      [
        {
          response: alike ? "1" : "0",
          feedback: alike
            ? t(
                "Nothing changes between the two clips: the sound you listen for is the same both times.",
                "两段录音之间没有变化：你要听的那个音两次都一样。",
              )
            : t(
                "The two clips differ in the very sound this topic contrasts, while the rest of the word stays alike.",
                "两段录音恰好在本主题对比的那个音上不同，词的其余部分一样。",
              ),
        },
      ],
    );
  };

  const [a1, b1] = pairs[1] ?? pairs[0]!;
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    intro: levelAuralIntro(spec.id),
    prerequisites: spec.prerequisites,
    encompasses: [],
    xp: 10,
    strand: "listening",
    knowledgePoints: [
      point(
        "which",
        t("Which word?", "哪个词？"),
        watched(
          t(
            `${spec.sounds.en}\n\n> **Watch out.** Focus on the contrasting sound itself rather than guessing from spelling—replay the clip whenever the two words feel close.`,
            `${spec.sounds["zh-CN"]}\n\n> **注意。** 专注辨认相区别的那个音，不要凭拼写猜测——拿不准时可以随时重放录音。`,
          ),
          spec.watchOut?.which,
        ),
        whichWord,
      ),
      point(
        "same",
        t("The same or different?", "相同还是不同？"),
        watched(
          t(
            `Two words are played one after the other, such as *${a1}* and *${b1}*. Some pairs are the same word twice; others differ only in these two sounds. Listen for the sound, not for the rest of the word.\n\n> **Watch out.** Do not let matching letters at the start or end fool you—compare the exact contrasting sound in both clips.`,
            `依次播放两个词，例如 *${a1}* 和 *${b1}*。有的是同一个词说两遍，有的只在这两个音上不同。注意听这个音，而不是词的其他部分。\n\n> **注意。** 不要被开头或结尾相同的辅音迷惑——专门对比两段录音里相区别的那个音。`,
          ),
          spec.watchOut?.same,
        ),
        sameOrNot,
      ),
    ],
  };
}

// The listening of a unit.

/** Frame is a dialogue or announcement with two slots: {x} holds the answer to its question, {y} a value it also says. */
export interface Frame {
  readonly lines: readonly Line[];
  readonly question: Text;
  readonly values: readonly string[];
}

/**
 * frame builds a Frame. Its lines are separated by ` | `, each starting with `A:` or `B:` for the speaker, the usual
 * voice and a man's; lines without one are an announcement or message in the usual voice. {x} is the answer to the
 * question and {y} another of the values that the dialogue says too, so that only a learner who follows it answers right.
 */
export function frame(lines: string, en: string, zh: string, values: string): Frame {
  const parsed = lines.split(" | ").map((raw): Line => {
    const m = /^([AB]):\s*(.*)$/u.exec(raw.trim());
    return m ? { speaker: m[1] === "A" ? "a" : "b", text: m[2] ?? "" } : { speaker: "a", text: raw.trim() };
  });
  const all = parsed.map((l) => l.text).join(" ");
  if (!all.includes("{x}") || !all.includes("{y}")) throw new Error(`a frame needs {x} and {y}: ${lines}`);
  const list = values.split(",").map((v) => v.trim());
  if (list.length < 4 || new Set(list).size !== list.length) throw new Error(`a frame needs four distinct values: ${values}`);
  return { lines: parsed, question: t(en, zh), values: list };
}

/** UnitListeningSpec is a unit's listening topic: the unit's vocabulary topics, whose sentences it plays, and its frames. */
export interface UnitListeningSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  /** words are the unit's vocabulary topics; those that no other one needs are the topic's prerequisites. */
  readonly words: readonly string[];
  readonly frames: readonly Frame[];
  /** watchOut is the topic's own Watch out for hearing the unit's words, and for its dialogues. */
  readonly watchOut?: { readonly words: Text; readonly dialogues: Text };
}

/** fill puts the values of a frame's slots into a line. */
const fill = (text: string, x: string, y: string) => text.replaceAll("{x}", x).replaceAll("{y}", y);

/** transcript quotes what a dialogue says, a line to a paragraph, naming the speakers when there are two. */
function transcript(lines: readonly Line[]): string {
  const two = new Set(lines.map((l) => l.speaker)).size > 1;
  return lines.map((l) => `> ${two ? `**${l.speaker.toUpperCase()}:** ` : ""}${l.text}`).join("\n>\n");
}

const wordsIn = (sentence: string) => new Set((sentence.match(/\p{L}+(?:'\p{L}+)?/gu) ?? []).map((w) => w.toLowerCase()));

interface HearItem {
  readonly sentence: string;
  readonly right: string;
  readonly wrong: readonly string[];
}

/** hearItems are the sentences of a unit's words, each asking which word it says, against two others of the unit. */
function hearItems(words: readonly WordDef[]): readonly HearItem[] {
  return interleave(
    words.map((w, i) => {
      const others = [...words.slice(i + 1), ...words.slice(0, i)];
      return w.sentences.map((s, k): HearItem => {
        const said = wordsIn(s.full);
        const fits = others.filter(
          (o) => !o.spellings.some((sp) => said.has(sp.toLowerCase())) && !w.spellings.includes(o.head) && /^\p{L}+$/u.test(o.head),
        );
        // Each sentence of a word takes other words of the unit, so that its items differ in their options too.
        const wrong = [fits[(2 * k) % fits.length], fits[(2 * k + 1) % fits.length]].filter((o) => o !== undefined).map((o) => o.head);
        return { sentence: s.full, right: s.answer, wrong: [...new Set(wrong)] };
      });
    }),
  ).filter((item) => item.wrong.length === 2);
}

/** unitListening builds a unit's listening topic: hearing its words in sentences, then its dialogues and announcements. */
export function unitListening(spec: UnitListeningSpec): TopicDef {
  const words = spec.words.flatMap(wordsOf);
  const hear = hearItems(words);
  const byHead = new Map(words.map((w) => [w.head, w]));
  ensureItems(spec.id, "words", new Set(hear.map((h) => h.sentence)).size);
  for (const item of hear) heard(item.sentence);
  const hearWord: Generator = (rng) => {
    const item = rng.cycle(hear)!;
    const { options, right } = shuffled(rng, item.right, item.wrong);
    return choice(
      {
        prompt: t("Listen to the sentence. Which of these words do you hear in it?", "听句子。你在句子里听到了下面哪个词？"),
        listen: [heard(item.sentence)],
        solution: t(
          `You hear:\n\n> ${item.sentence}\n\nThe word is *${item.right}*.\n\n**Check.** Replay the clip while reading the sentence above and hear *${item.right}* right in place.`,
          `你听到的是：\n\n> ${item.sentence}\n\n这个词是 *${item.right}*。\n\n**检验。** 对照上面的原句重放一遍录音，在句中听清 *${item.right}* 出现的位置。`,
        ),
      },
      options.map(same),
      right,
      item.wrong.map((w) => {
        const meaning = byHead.get(w)?.meaning;
        return {
          response: String(options.indexOf(w)),
          feedback: t(
            `*${w}*${meaning ? ` (${meaning.en.replace(/[.。]+$/u, "")})` : ""} is another word of the unit, and the sentence does not say it.`,
            `*${w}*${meaning ? `（${meaning["zh-CN"].replace(/[.。]+$/u, "")}）` : ""}是本单元的另一个词，这句话里没有说到它。`,
          ),
        };
      }),
    );
  };

  const asked = interleave(
    spec.frames.map((f) => {
      const n = f.values.length;
      return [1, 2].flatMap((d) =>
        f.values.map((x, i) => {
          const y = f.values[(i + d) % n]!;
          const z = f.values[(i + 3) % n]!;
          const lines = f.lines.map((l) => ({ speaker: l.speaker, text: fill(l.text, x, y) }));
          return { frame: f, lines, x, y, z, path: heard(lines) };
        }),
      );
    }),
  );
  ensureItems(spec.id, "dialogues", new Set(asked.map((a) => a.path)).size);
  const dialogue: Generator = (rng) => {
    const item = rng.cycle(asked)!;
    const { options, right } = shuffled(rng, item.x, [item.y, item.z]);
    const q = item.frame.question;
    const said = transcript(item.lines);
    return choice(
      {
        prompt: t(`Listen, then answer.\n\n**${q.en}**`, `听录音，然后回答。\n\n**${q.en}**\n\n（${q["zh-CN"]}）`),
        listen: [item.path],
        solution: t(
          `You hear:\n\n${said}\n\nThe answer is *${item.x}*.\n\n**Check.** Match the question (*${q.en}*) against the transcript above—*${item.x}* answers what is asked, while *${item.y}* belongs to another part of the recording.`,
          `你听到的是：\n\n${said}\n\n答案是 *${item.x}*。\n\n**检验。** 对照上面的原话核对问题（*${q["zh-CN"]}*）——*${item.x}* 直接回答所问内容，而 *${item.y}* 属于录音中的另一处信息。`,
        ),
      },
      options.map(same),
      right,
      [
        {
          response: String(options.indexOf(item.y)),
          feedback: t(
            `You hear *${item.y}* too, but it does not answer the question. Listen again for what the question asks about.`,
            `录音里也说到了 *${item.y}*，但它不是这个问题的答案。再听一遍，注意问题问的是什么。`,
          ),
        },
        {
          response: String(options.indexOf(item.z)),
          feedback: t(
            `The recording never says *${item.z}*; choose only what you hear.`,
            `录音里根本没有说到 *${item.z}*；只选你听到的内容。`,
          ),
        },
      ],
    );
  };

  const w0 = words[0]!;
  const w1 = words[1] ?? w0;
  const f0 = spec.frames[0]!;
  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    intro: levelAuralIntro(spec.id),
    prerequisites: latestOf(spec.words),
    encompasses: [],
    xp: 12,
    strand: "listening",
    knowledgePoints: [
      point(
        "words",
        t("Words you hear", "听到的词"),
        watched(
          t(
            `A sentence with the words of this unit is played, such as one using *${w1.head}*; you do not see it. Listen to the whole sentence, then choose the one word of the three that it says.\n\n> **Watch out.** Listen all the way to the end of the sentence before choosing—the word you need may appear at the start, middle, or end.`,
            `播放一个含有本单元词汇的句子（例如包含 *${w1.head}*），你看不到句子。听完整个句子，再从三个词中选出句子里说到的那一个。\n\n> **注意。** 听完整句话再选——目标词可能出现在句首、句中或句尾。`,
          ),
          spec.watchOut?.words,
        ),
        hearWord,
      ),
      point(
        "dialogues",
        t("Dialogues and announcements", "对话和通知"),
        watched(
          t(
            `Read the question first—such as *${f0.question.en}*—so that you know what to listen for. The recording often names more than one time, place or thing: only one answers the question. You can play it again as often as you like.\n\n> **Watch out.** Do not pick the first familiar option you hear—dialogues often mention a second, decoy detail alongside the real answer.`,
            `先读问题（例如“${f0.question["zh-CN"]}”），知道要听什么。录音里常常说到不止一个时间、地点或事物，只有一个能回答问题。录音可以反复播放。\n\n> **注意。** 不要一听到熟悉的词就选——对话里常常同时提到一个干扰项，要确认它回答的是问题问的那一项。`,
          ),
          spec.watchOut?.dialogues,
        ),
        dialogue,
      ),
    ],
  };
}
