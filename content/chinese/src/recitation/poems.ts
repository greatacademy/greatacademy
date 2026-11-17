// Recited poems and classical passages (docs/chinese-curriculum.md §7): one topic a text. One knowledge point asks for
// a line from the one before or after it, from the title, or from its first characters; one chooses the line a
// description of its meaning gives; one tells a correctly written line from lines with a usual wrong character. The
// texts are classical and in the public domain; the descriptions of their meaning are written for this subject.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typed, typedGenerator } from "@ga/subject-chinese";

/** Line is a line of a poem: its characters, the mark after it, what it means and the characters it is miswritten with. */
export interface Line {
  /** text is the line without its closing marks and without quotation marks, as it is typed. */
  readonly text: string;
  /** mark is the punctuation after the line. */
  readonly mark: string;
  /** shown is the line as it is written, with all of its punctuation. */
  readonly shown: string;
  readonly meaning: string;
  /** miswritten are pairs of a character of the line and the wrong character a learner is likely to write for it. */
  readonly miswritten: readonly (readonly [string, string])[];
}

/** Kind is whether a recited text is a poem or a passage of classical prose. */
export type Kind = "poem" | "prose";

/** Poem is a poem or a passage of classical prose to recite. */
export interface Poem {
  readonly id: string;
  readonly kind: Kind;
  readonly title: Text;
  readonly author: Text;
  readonly dynasty: Text;
  readonly lines: readonly Line[];
}

const MARKS = "，。？！；、";

/** CLOSING are the marks a line of prose may end with: a mark of MARKS or a colon, and closing quotation marks. */
const CLOSING = /[，。？！；、：”’]+$/u;

/**
 * parsePoems reads poems separated by blank lines. A poem's first line is its id, title in Chinese and in English, author
 * in Chinese and in English and dynasty in Chinese and in English, separated by ` | `; each line after it is a line of the
 * poem with its mark, what it means, and its miswritings as `right>wrong` separated by spaces. A line of prose may hold
 * marks within it and end with a colon or quotation marks.
 */
export function parsePoems(data: string, kind: Kind = "poem"): readonly Poem[] {
  return data
    .trim()
    .split(/\n\s*\n/u)
    .map((block) => {
      const [head, ...rest] = block
        .split("\n")
        .map((l) => l.trim())
        .filter((l) => l !== "");
      const fields = (head ?? "").split(" | ");
      if (fields.length !== 7) throw new Error(`poem data: ${head}`);
      const [id, zh, en, author, authorEn, dynasty, dynastyEn] = fields as [string, string, string, string, string, string, string];
      const lines = rest.map((row): Line => {
        const parts = row.split(" | ");
        if (parts.length !== 3) throw new Error(`poem data: ${row}`);
        const [withMark, meaning, wrong] = parts as [string, string, string];
        const mark = kind === "poem" ? withMark.slice(-1) : (CLOSING.exec(withMark)?.[0] ?? "");
        if (![...mark].some((m) => MARKS.includes(m) || m === "：")) throw new Error(`poem data: no mark after ${withMark}`);
        const text = withMark.slice(0, -mark.length).replace(/[“”‘’]/gu, "");
        const miswritten = wrong.split(" ").map((pair): [string, string] => {
          const [right, by] = pair.split(">");
          if (!right || !by || [...right].length !== 1 || [...by].length !== 1 || right === by || !text.includes(right))
            throw new Error(`poem data: a miswriting ${pair} of ${text}`);
          return [right, by];
        });
        if (miswritten.length < 2) throw new Error(`poem data: ${text} needs two miswritings`);
        return { text, mark, shown: withMark, meaning, miswritten };
      });
      if (lines.length < 4 || new Set(lines.map((l) => l.text)).size !== lines.length) throw new Error(`poem data: the lines of ${zh}`);
      return { id, kind, title: t(en, zh), author: t(authorEn, author), dynasty: t(dynastyEn, dynasty), lines };
    });
}

/** miswrite is a line with one of its usual wrong characters, the first of a pair if a round runs past them. */
const miswrite = (line: Line, k: number): string => {
  const [right, by] = line.miswritten[k % line.miswritten.length]!;
  return line.text.replace(right, by);
};

/** INNER are the marks a line may hold within it, left out when a learner types the line without them. */
const INNER = /[，。？！；、：“”‘’]/gu;

/** WORDS are the words the questions and explanations of a poem and of a passage of prose use. */
const WORDS = {
  poem: {
    text: "poem",
    line: "line",
    Lines: "Lines",
    one: "诗",
    lines: "诗句",
    recite: "诗句",
    whole: "诗",
    this: "这首诗",
    sense: "诗意",
    meaningEn: "Each line paints a picture; know what it says.",
    meaningZh: "每一句诗都描绘了一幅画面，要理解它的意思。",
  },
  prose: {
    text: "passage",
    line: "sentence",
    Lines: "Sentences",
    one: "话",
    lines: "句子",
    recite: "课文",
    whole: "课文",
    this: "这篇课文",
    sense: "文意",
    meaningEn: "Say what each sentence means in modern Chinese.",
    meaningZh: "文言文的每一句都要能用现代汉语说出意思。",
  },
} as const;

/** ROUNDS is how many sets of options each line is asked with when choosing by meaning or by writing. */
const ROUNDS = 3;

/** body is the text of a poem, two lines a row, or a passage as one paragraph. */
function body(poem: Poem): string {
  if (poem.kind === "prose") return poem.lines.map((l) => l.shown).join("");
  const rows: string[] = [];
  for (let i = 0; i < poem.lines.length; i += 2)
    rows.push(
      poem.lines
        .slice(i, i + 2)
        .map((l) => l.shown)
        .join(""),
    );
  return rows.join("\n");
}

/** poemTopic builds the topic of a poem; neighbours are other poems of its grade, whose lines are offered against its own. */
export function poemTopic(poem: Poem, prerequisites: readonly string[], neighbours: readonly Poem[]): TopicDef {
  const { lines } = poem;
  const n = lines.length;
  const title = poem.title["zh-CN"];
  const text = body(poem);
  const head = `《${title}》\n${poem.author["zh-CN"]}〔${poem.dynasty["zh-CN"]}〕\n\n${text}`;
  const headEn = `"${poem.title.en}" (${title}), by ${poem.author.en}, ${poem.dynasty.en} dynasty\n\n${text}`;
  const w = WORDS[poem.kind];
  const accepted = (l: Line): readonly string[] => [...new Set([l.text, l.text + l.mark, l.text.replace(INNER, "")])];
  const errors = (l: Line): readonly string[] => l.miswritten.map((_, k) => miswrite(l, k));

  const cues: TypedItem[] = [];
  for (let i = 1; i < n; i++)
    cues.push(
      typed(`《${title}》中，“${lines[i - 1]!.text}”的下一句是什么？`, accepted(lines[i]!), [lines[i - 1]!.text, ...errors(lines[i]!)]),
    );
  for (let i = 0; i < n - 1; i++)
    cues.push(
      typed(`《${title}》中，“${lines[i + 1]!.text}”的上一句是什么？`, accepted(lines[i]!), [lines[i + 1]!.text, ...errors(lines[i]!)]),
    );
  cues.push(typed(`${poem.author["zh-CN"]}的《${title}》第一句是什么？`, accepted(lines[0]!), [lines[1]!.text, ...errors(lines[0]!)]));
  cues.push(typed(`《${title}》的最后一句是什么？`, accepted(lines[n - 1]!), [lines[n - 2]!.text, ...errors(lines[n - 1]!)]));
  for (const l of lines) {
    const kept = Math.ceil([...l.text].length / 2);
    const start = [...l.text].slice(0, kept).join("");
    cues.push(
      typed(`补全《${title}》中的这句${w.one}：${start}${"＿".repeat([...l.text].length - kept)}`, accepted(l), [start, ...errors(l)]),
    );
  }

  const foreign = neighbours.length > 0 ? neighbours : [poem];
  const sources = new Map<string, { poem: Poem; line: Line }>();
  for (const p of [poem, ...foreign]) for (const l of p.lines) sources.set(l.text, { poem: p, line: l });
  const meaningBank: ChoiceItem[] = [];
  const writingBank: ChoiceItem[] = [];
  const correctOf = new Map<string, string>();
  for (let k = 0; k < ROUNDS; k++) {
    lines.forEach((line, i) => {
      const others = lines.filter((_, j) => j !== i);
      const m = others.length;
      const elsewhere = foreign[(i + k) % foreign.length]!;
      const stranger = elsewhere.lines[(i + 2 * k) % elsewhere.lines.length]!;
      meaningBank.push([line.meaning, line.text, [others[k % m]!.text, others[(k + 1) % m]!.text, stranger.text]]);
      const wrong = [0, 1, 2].map((d) => {
        const other = others[(k + d) % m]!;
        const version = miswrite(other, k + d);
        correctOf.set(version, other.text);
        return version;
      });
      writingBank.push(["", line.text, wrong]);
    });
  }

  const meaningList = lines.map((l) => `- ${l.text}：${l.meaning}`).join("\n");
  const writingList = lines.map((l) => `- ${l.text}：${l.miswritten.map(([r, w]) => `“${r}”不要写成“${w}”`).join("，")}`).join("\n");
  return {
    id: poem.id,
    title: poem.title,
    summary: t(`Reciting "${poem.title.en}" by ${poem.author.en}.`, `背诵${poem.author["zh-CN"]}的《${title}》。`),
    prerequisites: [...prerequisites],
    encompasses: [],
    xp: n,
    strand: "recitation",
    knowledgePoints: [
      point(
        `${poem.id}-lines`,
        t(`Reciting the ${w.Lines}`, `背诵${w.recite}`),
        t(
          `Read the ${w.text} aloud a few times, then say it without looking, ${w.line} by ${w.line}.\n\n${headEn}`,
          `先把${w.whole}多读几遍，再不看书，一句一句地背下来。\n\n${head}`,
        ),
        typedGenerator("hanzi", t(`Write the ${w.line} of the ${w.text}.`, `写出${w.lines}。`), cues, (right) =>
          t(`The line is: ${right}\n\n${text}`, `这一句是：${right}\n\n${text}`),
        ),
      ),
      point(
        `${poem.id}-meaning`,
        t(`What the ${w.Lines} Mean`, `理解${w.sense}`),
        t(`${w.meaningEn}\n\n${headEn}\n\n${meaningList}`, `${w.meaningZh}\n\n${head}\n\n${meaningList}`),
        choiceGenerator(
          t(`Which ${w.line} has this meaning?`, `哪一句${w.one}写的是这个意思？`),
          meaningBank,
          (right) =>
            t(
              `The line is ${right}: ${sources.get(right)?.line.meaning ?? ""}.`,
              `是“${right}”：${sources.get(right)?.line.meaning ?? ""}。`,
            ),
          (wrong) => {
            const source = sources.get(wrong);
            if (!source) return t(`${wrong} says something else.`, `“${wrong}”说的是别的意思。`);
            const where = source.poem === poem ? "" : `（出自《${source.poem.title["zh-CN"]}》）`;
            return t(`${wrong} means: ${source.line.meaning}.`, `“${wrong}”${where}的意思是：${source.line.meaning}。`);
          },
        ),
      ),
      point(
        `${poem.id}-writing`,
        t("Writing the Lines", "正确书写"),
        t(
          `Some characters of the ${w.text} are often miswritten as ones that sound or look like them. Think of what each means in the ${w.line}.\n\n${writingList}`,
          `${w.this}里有些字容易写成音同或形近的字，想一想每个字在${w.lines}中的意思。\n\n${writingList}`,
        ),
        choiceGenerator(
          t(`Which ${w.line} is written correctly?`, `哪一句${w.one}书写正确？`),
          writingBank,
          (right) =>
            t(`${right} is written correctly; the others each have a wrong character.`, `“${right}”书写正确，其他几句各有一个错字。`),
          (wrong) =>
            t(`${wrong} should be written ${correctOf.get(wrong) ?? ""}.`, `“${wrong}”有错字，应写作“${correctOf.get(wrong) ?? ""}”。`),
        ),
      ),
    ],
  };
}
