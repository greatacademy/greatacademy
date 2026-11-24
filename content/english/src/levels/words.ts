// Vocabulary topics of the levels, built from data: each word has a meaning in English and in Chinese, at least three
// model sentences and the words a learner confuses it with. From them a topic gets three knowledge points: choose the
// word that completes a sentence, choose the word for a meaning, and type the word for a meaning in a sentence.

import {
  type EncompassingDef,
  type Generator,
  joinText,
  type Problem,
  type Rng,
  type Sound,
  same,
  type Text,
  type TopicDef,
  t,
} from "@ga/content";
import { point } from "@ga/subject-english";
import { spoken, withSounds } from "../audio.ts";
import type { WordBatch } from "../pack.ts";

/** WordSentence is one model sentence of a word: the sentence with a gap, the spelling that fills it, and wrong fillers. */
export interface WordSentence {
  readonly gapped: string;
  readonly full: string;
  readonly answer: string;
  readonly wrong: readonly string[];
}

/** WordDef is one headword of a vocabulary topic: its spellings, its meaning, its sentences and its confusions. */
export interface WordDef {
  readonly head: string;
  /** spellings are the headword and every form a passage may use, as written in a sentence. */
  readonly spellings: readonly string[];
  readonly meaning: Text;
  readonly sentences: readonly WordSentence[];
  /** confusions are words a learner mixes this one up with; none of them fits its sentences or its meaning. */
  readonly confusions: readonly string[];
  /** alike are words of the batch that mean nearly the same, never offered as wrong options for it. */
  readonly alike: readonly string[];
}

const capitalize = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
const gap = "___";

/**
 * word builds a WordDef. spellings lists the headword first and then its forms, separated by spaces. sentences are
 * separated by ` | `; in each, `{form}` marks the word, and `|w1 w2` right after the sentence replaces the confusions
 * as its wrong fillers, for a sentence that needs another form or other words. A sentence that starts with the word
 * capitalizes its fillers.
 */
export function word(spellings: string, en: string, zh: string, sentences: string, confusions: string, alike = ""): WordDef {
  const all = spellings.split(" ").filter((s) => s !== "");
  const head = all[0] ?? "";
  const known = new Set(all.map((s) => s.toLowerCase()));
  const defaultWrong = confusions.split(" ").filter((s) => s !== "");
  const parsed = sentences.split(" | ").map((raw): WordSentence => {
    const bar = raw.indexOf("|");
    const sentence = (bar < 0 ? raw : raw.slice(0, bar)).trim();
    const fillers = bar < 0 ? undefined : raw.slice(bar + 1).trim();
    const mark = /\{([^}]+)\}/u.exec(sentence);
    if (!mark) throw new Error(`${head}: no {word} in "${sentence}"`);
    const answer = mark[1] ?? "";
    if (!known.has(answer.toLowerCase())) throw new Error(`${head}: ${answer} is not one of its spellings`);
    const atStart = mark.index === 0;
    const wrong = (fillers === undefined ? defaultWrong : fillers.split(" ").filter((s) => s !== "")).map((w) =>
      atStart ? capitalize(w) : w,
    );
    if (wrong.length < 2) throw new Error(`${head}: fewer than two wrong fillers in "${sentence}"`);
    if (wrong.some((w) => w.toLowerCase() === answer.toLowerCase())) throw new Error(`${head}: a filler is the answer in "${sentence}"`);
    const before = sentence.slice(0, mark.index);
    const after = sentence.slice(mark.index + mark[0].length);
    return { gapped: `${before}${gap}${after}`, full: `${before}${answer}${after}`, answer, wrong };
  });
  if (parsed.length < 3) throw new Error(`${head}: fewer than three sentences`);
  return {
    head,
    spellings: all,
    meaning: t(en, zh),
    sentences: parsed,
    confusions: defaultWrong,
    alike: alike.split(" ").filter((s) => s !== ""),
  };
}

/** VocabularySpec is what a vocabulary topic is made of. */
export interface VocabularySpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly intro?: Text;
  readonly prerequisites: readonly string[];
  readonly encompasses?: readonly EncompassingDef[];
  readonly words: readonly WordDef[];
  /** teaching is the hand-written teaching of the topic; without it the topic falls back to the generic texts. */
  readonly teaching?: WordsTeaching;
}

/**
 * WordsTeaching is the hand-written teaching of a vocabulary topic of a level: a Watch out for each knowledge point and,
 * in `notes`, one line per headword with eight fields separated by `|`:
 *
 * `head|clues|contrastEn|contrastZh|conflicts|chunks|trapEn|trapZh`
 *
 * - clues: one noun phrase per sentence of the word, in order, separated by `;`, read after "The sentence is about".
 * - contrast: the word against the one it is most often confused with.
 * - conflicts: for every wrong filler of the word's sentences, `filler=en=zh`, separated by `;`: what the filler means
 *   and why that cannot fill these sentences, starting with the filler. A filler not taught in any topic lists its
 *   forms with `/`, as `eat/ate`; a taught one is found by its headword.
 * - chunks: the word in spoken pieces separated by ` · `, and the real spelling trap.
 */
export interface WordsTeaching {
  readonly watchOut: { readonly complete: Text; readonly meaning: Text; readonly spell: Text };
  readonly notes: string;
}

interface WordNote {
  readonly clues: readonly string[];
  readonly contrast: Text;
  readonly conflicts: ReadonlyMap<string, Text>;
  readonly chunks: string;
  readonly trap: Text;
}

function parseNotes(id: string, words: readonly WordDef[], notes: string): ReadonlyMap<string, WordNote> {
  const out = new Map<string, WordNote>();
  for (const raw of notes.split("\n")) {
    const line = raw.trim();
    if (line === "") continue;
    const f = line.split("|").map((x) => x.trim());
    if (f.length !== 8 || f.some((x) => x === "")) throw new Error(`${id}: a note needs eight fields: ${line}`);
    const [head, clues, cEn, cZh, conflicts, chunks, tEn, tZh] = f as [string, string, string, string, string, string, string, string];
    const map = new Map<string, Text>();
    for (const c of conflicts.split(";")) {
      const [k, en, zh] = c.split("=").map((x) => x.trim());
      if (!k || !en || !zh) throw new Error(`${id}: ${head}: a conflict needs filler=en=zh: ${c}`);
      for (const form of k.split("/")) map.set(form.trim().toLowerCase(), t(en, zh));
    }
    out.set(head, { clues: clues.split(";").map((x) => x.trim()), contrast: t(cEn, cZh), conflicts: map, chunks, trap: t(tEn, tZh) });
  }
  for (const w of words) {
    const n = out.get(w.head);
    if (!n) throw new Error(`${id}: no note for ${w.head}`);
    if (n.clues.length !== w.sentences.length)
      throw new Error(`${id}: ${w.head} has ${w.sentences.length} sentences but ${n.clues.length} clues`);
  }
  if (out.size !== words.length) throw new Error(`${id}: notes name words that are not in the topic`);
  return out;
}

/** conflictOf finds the reason a wrong filler does not fit, by its spelling or by the headword it belongs to. */
function conflictOf(note: WordNote, wrong: string): Text | undefined {
  const lower = wrong.toLowerCase();
  return note.conflicts.get(lower) ?? note.conflicts.get(gloss(wrong)?.head.toLowerCase() ?? "");
}

/** VocabularyTopic is a vocabulary topic and the batch of words it teaches. */
export interface VocabularyTopic {
  readonly topic: TopicDef;
  readonly batch: WordBatch;
}

/** minItems is the fewest distinct items a vocabulary knowledge point may have. */
const minItems = 25;

const quote = (s: string) => same(`> ${s}`);

const cleanMeaning = (s: string) => s.replace(/[.。]+$/u, "");

const explainedComplete = (w: WordDef, s: WordSentence): Text =>
  t(
    `*${w.head}* means “${cleanMeaning(w.meaning.en)}”, and that meaning fits this sentence:\n\n${s.full}\n\n**Check.** Read the completed sentence aloud—the words around *${s.answer}* match both its meaning and its form.`,
    `*${w.head}* 的意思是“${cleanMeaning(w.meaning["zh-CN"])}”，放进这句刚好通顺：\n\n${s.full}\n\n**检验。** 把填好的句子完整读一遍——*${s.answer}* 既符合前后语境的意思，形式也与句子搭配。`,
  );

const explainedMeaning = (w: WordDef, sentence: string): Text =>
  t(
    `**${w.head}** means “${cleanMeaning(w.meaning.en)}”, as in:\n\n${sentence}\n\n**Check.** Picture **${w.head}** in that example sentence and match it back to the given meaning—only **${w.head}** carries that exact sense.`,
    `**${w.head}** 的意思是“${cleanMeaning(w.meaning["zh-CN"])}”，例如：\n\n${sentence}\n\n**检验。** 结合例句回看题干给出的释义——只有 **${w.head}** 准确对应这个意思。`,
  );

const explainedSpell = (w: WordDef, s: WordSentence): Text =>
  t(
    `*${w.head}* means “${cleanMeaning(w.meaning.en)}”, so the completed sentence is:\n\n${s.full}\n\n**Check.** Check every letter of **${s.answer}** and confirm that its form—such as plural, tense, or capitalization—fits the gap.`,
    `*${w.head}* 的意思是“${cleanMeaning(w.meaning["zh-CN"])}”，完整句子是：\n\n${s.full}\n\n**检验。** 逐字母核对 **${s.answer}** 的拼写，并确认它的形式（如单复数、时态或大小写）符合空格要求。`,
  );

const taughtComplete = (w: WordDef, s: WordSentence, n: WordNote, k: number): Text => {
  const clue = n.clues[k] ?? n.clues[0] ?? "";
  const others = s.wrong.map((x) => conflictOf(n, x)).filter((c): c is Text => c !== undefined);
  const test =
    others.length > 0
      ? t(
          `**Check.** Test the other choices in the gap: ${others.map((c) => c.en).join("; and ")}.`,
          `**检验。** 把其他选项放进空格排除：${others.map((c) => c["zh-CN"]).join("；")}。`,
        )
      : t(
          `**Check.** Read the completed sentence aloud—*${s.answer}* is the form the words around the gap need.`,
          `**检验。** 把填好的句子读一遍——*${s.answer}* 正是空格前后的词需要的形式。`,
        );
  return joinText([
    t(
      `The sentence is about ${clue}, which calls for **${s.answer}**—“${cleanMeaning(w.meaning.en)}”:\n\n${s.full}`,
      `句子说的是“${clue}”，所以要用 **${s.answer}**——“${cleanMeaning(w.meaning["zh-CN"])}”：\n\n${s.full}`,
    ),
    test,
  ]);
};

const taughtMeaning = (w: WordDef, n: WordNote): Text =>
  joinText([
    t(
      `**${w.head}** means “${cleanMeaning(w.meaning.en)}”, as in:\n\n${w.sentences[0]?.full ?? ""}`,
      `**${w.head}** 的意思是“${cleanMeaning(w.meaning["zh-CN"])}”，例如：\n\n${w.sentences[0]?.full ?? ""}`,
    ),
    t(
      `${capitalize(n.contrast.en)}.\n\n**Check.** Put the meaning back in place of **${w.head}** in that sentence—it still says the same thing.`,
      `${n.contrast["zh-CN"]}。\n\n**检验。** 把这个释义代回例句替换 **${w.head}**——句子意思不变。`,
    ),
  ]);

const taughtSpell = (w: WordDef, s: WordSentence, n: WordNote): Text =>
  joinText([
    t(
      `*${w.head}* means “${cleanMeaning(w.meaning.en)}”, so the completed sentence is:\n\n${s.full}`,
      `*${w.head}* 的意思是“${cleanMeaning(w.meaning["zh-CN"])}”，完整句子是：\n\n${s.full}`,
    ),
    t(
      `**Check.** ${n.chunks.includes("·") ? `Say **${w.head}** in pieces—**${n.chunks}**—and watch` : `Say **${w.head}** slowly and watch`} ${n.trap.en}${s.answer.toLowerCase() === w.head.toLowerCase() ? "" : `; the gap needs the form **${s.answer}**`}.`,
      `**检验。** ${n.chunks.includes("·") ? `把 **${w.head}** 分块读出来——**${n.chunks}**——注意` : `慢慢读 **${w.head}**，注意`}${n.trap["zh-CN"]}${s.answer.toLowerCase() === w.head.toLowerCase() ? "" : `；空格需要的形式是 **${s.answer}**`}。`,
    ),
  ]);

/**
 * glossary maps each spelling of every headword of a vocabulary topic, in lower case, to its word, so that choosing a
 * wrong option can be answered with what that word means. It fills as the content modules build their topics and is
 * read only when a problem is generated, by which time every topic is built; the first word to claim a spelling keeps it.
 */
const glossary = new Map<string, WordDef>();

/** taught maps the id of each vocabulary topic to its words and prerequisites, filled as the content modules build their topics. */
const taught = new Map<string, { readonly words: readonly WordDef[]; readonly prerequisites: readonly string[] }>();

/** wordsOf are the words of a vocabulary topic already built; a module that asks must import the module that builds it. */
export function wordsOf(topic: string): readonly WordDef[] {
  const built = taught.get(topic);
  if (!built) throw new Error(`no vocabulary topic ${topic} is built yet`);
  return built.words;
}

/**
 * latestOf are the vocabulary topics of a list that no other one of it needs, through the prerequisites of the
 * vocabulary topics built: needing them needs all of the list that the vocabulary topics reach.
 */
export function latestOf(topics: readonly string[]): readonly string[] {
  const reach = (id: string, seen = new Set<string>()): Set<string> => {
    for (const p of taught.get(id)?.prerequisites ?? [])
      if (!seen.has(p)) {
        seen.add(p);
        reach(p, seen);
      }
    return seen;
  };
  const needed = new Set(topics.flatMap((id) => [...reach(id)]));
  return topics.filter((id) => !needed.has(id));
}

/** gloss is the word a spelling belongs to, if a vocabulary topic teaches it. */
export function gloss(spelling: string): WordDef | undefined {
  return glossary.get(spelling.toLowerCase());
}

interface ChoiceItem {
  readonly prompt: Text;
  readonly right: string;
  readonly wrong: readonly string[];
  readonly solution: Text;
  /** whyNot says what choosing a wrong option shows, when there is something to say about it. */
  readonly whyNot: (wrong: string) => Text | undefined;
  /** sounds are the recordings shown with the solution. */
  readonly sounds: { solutionSounds?: readonly Sound[] };
}

function choiceFrom(items: readonly ChoiceItem[]): Generator {
  return (rng: Rng): Problem => {
    const item = rng.cycle(items);
    const options = rng.shuffle([item.right, ...item.wrong]);
    const answer = options.indexOf(item.right);
    const mistakes = item.wrong.flatMap((w) => {
      const feedback = item.whyNot(w);
      return feedback ? [{ response: String(options.indexOf(w)), feedback }] : [];
    });
    return {
      prompt: item.prompt,
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(same) } },
      solution: item.solution,
      ...item.sounds,
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      ...(mistakes.length > 0 && { mistakes }),
    };
  };
}

/** meansOther says what a wrong option means, if a vocabulary topic teaches it. */
function meansOther(wrong: string): Text {
  const other = gloss(wrong);
  if (!other)
    return t(
      `*${wrong}* has a different meaning and does not match the definition given here.`,
      `*${wrong}* 是另一个意思，与这里给出的释义不符。`,
    );
  return t(`*${wrong}* means “${cleanMeaning(other.meaning.en)}”.`, `*${wrong}* 的意思是“${cleanMeaning(other.meaning["zh-CN"])}”。`);
}

/**
 * fitsNot says why a wrong filler does not complete the sentence: another form of the word, which a filler that is not a
 * taught word but starts like the answer is taken to be, or a word of another meaning.
 */
function fitsNot(w: WordDef, wrong: string, answer: string): Text {
  const lower = wrong.toLowerCase();
  const bare = (s: string) => s.toLowerCase().replace(/'/gu, "");
  if (
    w.spellings.some((s) => s.toLowerCase() === lower) ||
    (!gloss(wrong) && (lower.slice(0, 4) === answer.toLowerCase().slice(0, 4) || bare(wrong) === bare(answer)))
  )
    return t(
      `*${wrong}* is not the form or spelling of *${w.head}* this sentence needs: look at the words just before and after the gap.`,
      `这个句子需要的不是 *${wrong}* 这种形式或拼写的 *${w.head}*：看看空白前后紧挨着的词。`,
    );
  const other = gloss(wrong);
  if (!other || other === w)
    return t(`*${wrong}* does not fit the meaning or form this sentence needs.`, `*${wrong}* 与这个句子需要的意思或形式不符。`);
  return t(
    `*${wrong}* means “${cleanMeaning(other.meaning.en)}”, which does not make sense in this sentence.`,
    `*${wrong}* 的意思是“${cleanMeaning(other.meaning["zh-CN"])}”，放进这个句子意思说不通。`,
  );
}

/**
 * heteronyms are words spelled alike but said differently by meaning, such as *read* now and in the past or
 * *record* as a noun and a verb: alone they would be read one way whatever the meaning, so only their sentences are
 * recorded.
 */
export const heteronyms: ReadonlySet<string> = new Set(
  `abstract address advocate alternate appropriate associate attribute august bass bow close combat compact complex
  compound conduct conflict console content contest contract contrast convert decrease defect desert digest discount
  does dove duplicate elaborate entrance escort estimate excuse export extract frequent graduate house import incline
  increase insert insult intimate invalid lead live minute moderate number object perfect permit polish present produce
  progress project protest read rebel recall record refuse reject row separate sow subject survey suspect tear
  transport upset use wind wound`.split(/\s+/u),
);

/** sentenceSounds are the recordings of a word and of one of its sentences, shown with a solution. */
const sentenceSounds = (w: WordDef, sentence: string) =>
  withSounds(heteronyms.has(w.head.toLowerCase()) ? undefined : spoken(w.head), spoken(sentence));

/** interleave orders items by sentence and then by word, so consecutive seeds show different words. */
/** interleave takes the first item of each list, then the second of each, and so on, so that kinds alternate. */
export function interleave<T>(perWord: readonly (readonly T[])[]): readonly T[] {
  const most = Math.max(...perWord.map((items) => items.length));
  const out: T[] = [];
  for (let i = 0; i < most; i++)
    for (const items of perWord) {
      const item = items[i];
      if (item !== undefined) out.push(item);
    }
  return out;
}

function distinct<T>(items: readonly T[], key: (item: T) => string): readonly T[] {
  const seen = new Set<string>();
  return items.filter((item) => {
    const k = key(item);
    if (seen.has(k)) return false;
    seen.add(k);
    return true;
  });
}

/** vocabularyTopic builds a vocabulary topic of a level and its batch from the words' data. */
export function vocabularyTopic(spec: VocabularySpec): VocabularyTopic {
  const { id, words } = spec;
  const heads = words.map((w) => w.head);
  if (new Set(heads.map((h) => h.toLowerCase())).size !== heads.length) throw new Error(`${id}: a headword twice`);
  taught.set(id, { words, prerequisites: spec.prerequisites });
  for (const w of words)
    for (const spelling of w.spellings) if (!glossary.has(spelling.toLowerCase())) glossary.set(spelling.toLowerCase(), w);
  const isAlike = (a: WordDef, b: string) => a.alike.includes(b) || (words.find((w) => w.head === b)?.alike.includes(a.head) ?? false);

  const notes = spec.teaching ? parseNotes(id, words, spec.teaching.notes) : undefined;
  if (notes)
    for (const w of words)
      for (const s of w.sentences)
        for (const wrong of s.wrong)
          if (!w.spellings.some((x) => x.toLowerCase() === wrong.toLowerCase()) && !conflictOf(notes.get(w.head)!, wrong))
            throw new Error(`${id}: ${w.head} has no conflict for the filler ${wrong}`);

  const complete = distinct(
    interleave(
      words.map((w) =>
        w.sentences.map(
          (s, k): ChoiceItem => ({
            prompt: joinText([t("Choose the word that completes the sentence.", "选出能填入句子空白处的词。"), quote(s.gapped)]),
            right: s.answer,
            wrong: s.wrong,
            solution: notes ? taughtComplete(w, s, notes.get(w.head)!, k) : explainedComplete(w, s),
            whyNot: (wrong) => {
              const c = notes ? conflictOf(notes.get(w.head)!, wrong) : undefined;
              return c ? t(`${capitalize(c.en)}.`, `${c["zh-CN"]}。`) : fitsNot(w, wrong, s.answer);
            },
            sounds: sentenceSounds(w, s.full),
          }),
        ),
      ),
    ),
    (item) => item.prompt.en,
  );

  const forMeaning = distinct(
    interleave(
      words.map((w, i) => {
        const others = [...words.slice(i + 1), ...words.slice(0, i)].map((o) => o.head).filter((h) => !isAlike(w, h));
        const sets = [
          w.confusions.slice(0, 2),
          [others[0], others[1]],
          [others[2], others[4] ?? others[3]],
          // A fourth set when the batch has enough other words, so that a batch of ten words still has 30 items.
          ...(others[5] !== undefined && others[4] !== undefined ? [[others[3], others[5]]] : []),
        ];
        return sets.map(
          (wrong): ChoiceItem => ({
            prompt: joinText([
              t("Which word has this meaning?", "哪个词是这个意思？"),
              t(`> ${capitalize(w.meaning.en)}`, `> ${w.meaning["zh-CN"]}`),
            ]),
            right: w.head,
            wrong: wrong.filter((x): x is string => x !== undefined),
            solution: notes ? taughtMeaning(w, notes.get(w.head)!) : explainedMeaning(w, w.sentences[0]?.full ?? ""),
            whyNot: (wrong) => {
              const c = notes ? conflictOf(notes.get(w.head)!, wrong) : undefined;
              return c ? t(`${capitalize(c.en)}.`, `${c["zh-CN"]}。`) : meansOther(wrong);
            },
            sounds: sentenceSounds(w, w.sentences[0]?.full ?? ""),
          }),
        );
      }),
    ),
    (item) => [item.prompt.en, item.right, ...[...item.wrong].sort()].join("/"),
  );

  const spell = interleave(
    words.map((w) =>
      w.sentences.map((s) => ({
        prompt: joinText([
          t("Type the missing word.", "输入句中缺少的词。"),
          t(`It means: ${w.meaning.en}.`, `意思是：${w.meaning["zh-CN"]}。`),
          quote(s.gapped),
        ]),
        answer: s.answer,
        wrong: s.wrong,
        solution: notes ? taughtSpell(w, s, notes.get(w.head)!) : explainedSpell(w, s),
        sounds: sentenceSounds(w, s.full),
      })),
    ),
  );

  for (const [name, n] of [
    ["complete", complete.length],
    ["meaning", forMeaning.length],
    ["spell", spell.length],
  ] as const) {
    if (n < minItems) throw new Error(`${id}: ${name} has ${n} items, fewer than ${minItems}`);
  }
  for (const item of forMeaning) if (item.wrong.length < 2) throw new Error(`${id}: ${item.right} has too few wrong words`);

  const typed: Generator = (rng: Rng): Problem => {
    const item = rng.cycle(spell);
    return {
      prompt: item.prompt,
      answer: { checker: "word-form", expected: [item.answer], input: { kind: "text" } },
      solution: item.solution,
      ...item.sounds,
      canonical: item.answer,
      wrong: item.wrong.filter((w) => w.toLowerCase() !== item.answer.toLowerCase()),
    };
  };

  const list = heads.map((h) => `*${h}*`).join(", ");
  const watch = (key: "complete" | "meaning" | "spell", fallback: Text): Text =>
    spec.teaching
      ? t(`> **Watch out.** ${spec.teaching.watchOut[key].en}`, `> **注意。** ${spec.teaching.watchOut[key]["zh-CN"]}`)
      : fallback;
  const w0 = words[0]!;
  const w1 = words[1] ?? w0;
  const w2 = words[2] ?? w0;
  const w3 = words[3] ?? w0;
  const defaultIntro = t(
    `Take *${w0.head}* (“${cleanMeaning(w0.meaning.en)}”): *${w0.sentences[0]?.full ?? ""}* In this topic, you learn ${words.length} core words in context, match each to its meaning, and spell the right form in a sentence.`,
    `看 *${w0.head}*（“${cleanMeaning(w0.meaning["zh-CN"])}”）：*${w0.sentences[0]?.full ?? ""}* 本主题带你结合语境掌握 ${words.length} 个核心词，将词与释义对应，并在句子中准确拼写出所需词形。`,
  );
  const topic: TopicDef = {
    id,
    title: spec.title,
    summary: spec.summary,
    intro: spec.intro ?? defaultIntro,
    prerequisites: spec.prerequisites,
    encompasses: spec.encompasses ?? [],
    xp: Math.max(10, Math.round(words.length * 1.5)),
    strand: "vocabulary",
    knowledgePoints: [
      point(
        "complete",
        t("Words in sentences", "句子中的词"),
        joinText([
          t(
            `The words of this topic: ${list}. Read the whole sentence before you choose: the words around the gap tell you which word fits, as in *${w1.sentences[0]?.full ?? ""}* (*${w1.head}*, “${cleanMeaning(w1.meaning.en)}”).`,
            `本主题的词：${list}。先读完整个句子再选择：空白前后的词会告诉你哪个词合适，例如 *${w1.sentences[0]?.full ?? ""}*（*${w1.head}*，“${cleanMeaning(w1.meaning["zh-CN"])}”）。`,
          ),
          watch(
            "complete",
            t(
              `> **Watch out.** Do not pick a word just because it looks familiar—check both the meaning of the whole sentence and the exact form the gap needs.`,
              `> **注意。** 不要只凭眼熟选词——既要看整句话的意思是否通顺，也要核对空格需要的具体词形。`,
            ),
          ),
        ]),
        choiceFrom(complete),
      ),
      point(
        "meaning",
        t("Words and meanings", "词和词义"),
        joinText([
          t(
            `Each word has its own meaning: for example, *${w2.head}* means “${cleanMeaning(w2.meaning.en)}”. Read the meaning carefully, then choose the word that matches it.`,
            `每个词都有自己的意思：例如 *${w2.head}* 的意思是“${cleanMeaning(w2.meaning["zh-CN"])}”。仔细读一读词义，再选出意思相符的词。`,
          ),
          watch(
            "meaning",
            t(
              `> **Watch out.** Watch out for close pairs from the same topic—read the whole meaning before choosing so you do not swap opposites or near-neighbors.`,
              `> **注意。** 同主题里常有反义词或容易混的成对词——把释义读完整再选，别把相近的词张冠李戴。`,
            ),
          ),
        ]),
        choiceFrom(forMeaning),
      ),
      point(
        "spell",
        t("Spelling the words", "拼写单词"),
        joinText([
          t(
            `Type the word that fills the gap—for example, *${w3.sentences[0]?.answer ?? w3.head}* in: *${w3.sentences[0]?.full ?? ""}* Spell it exactly, and use the form the sentence needs, such as *cats* after *two*.`,
            `输入填空的词，例如 *${w3.sentences[0]?.full ?? ""}* 中的 *${w3.sentences[0]?.answer ?? w3.head}*。拼写要准确，并用句子需要的形式，比如 *two* 后面用 *cats*。`,
          ),
          watch(
            "spell",
            t(
              `> **Watch out.** Check every letter and check whether the sentence calls for a changed form—such as a plural, a verb ending, or a capital letter at the start of a sentence.`,
              `> **注意。** 逐字母核对拼写，并检查句子是否需要变化形式——比如复数、动词变形或句首大写。`,
            ),
          ),
        ]),
        typed,
      ),
    ],
  };
  const batch: WordBatch = { topic: id, words: [...new Set(words.flatMap((w) => w.spellings.map((s) => s.toLowerCase())))] };
  return { topic, batch };
}

/**
 * pairUp lists n combinations of the lists' items, item k taking item k of each list modulo its length. With list
 * lengths that share no factor, the first n combinations are all different as long as n is at most their product.
 */
export function pairUp<A, B>(n: number, a: readonly A[], b: readonly B[]): readonly (readonly [A, B])[] {
  return Array.from({ length: n }, (_, k) => [a[k % a.length]!, b[k % b.length]!] as const);
}

/**
 * everyPair pairs every item of `a` with every item of `b`, in diagonals so that neighbors differ in both: the frames of
 * a bank crossed with the words for their slot (E8.3). Every frame must read naturally with every word it is crossed with.
 */
export function everyPair<A, B>(a: readonly A[], b: readonly B[]): readonly (readonly [A, B])[] {
  return Array.from({ length: b.length }, (_, d) => a.map((item, r) => [item, b[(r + d) % b.length]!] as const)).flat();
}

/** everyTriple pairs every item of `a` with every item of `b`, as everyPair does, and gives each pair an item of `c` in turn. */
export function everyTriple<A, B, C>(a: readonly A[], b: readonly B[], c: readonly C[]): readonly (readonly [A, B, C])[] {
  return everyPair(a, b).map(([x, y], k) => [x, y, c[k % c.length]!] as const);
}

/** sentenceCase capitalizes the first letter of a sentence. */
export function sentenceCase(s: string): string {
  return capitalize(s);
}
