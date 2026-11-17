// Recited poems (docs/chinese-curriculum.md §7): one topic a poem. One knowledge point asks for a line from the one
// before or after it, from the title, or from its first characters; one chooses the line a description of its meaning
// gives; one tells a correctly written line from lines with a usual wrong character. The poems are classical and in the
// public domain; the descriptions of their meaning are written for this subject.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point, type TypedItem, typed, typedGenerator } from "@ga/subject-chinese";

/** Line is a line of a poem: its characters, the mark after it, what it means and the characters it is miswritten with. */
export interface Line {
  readonly text: string;
  readonly mark: string;
  readonly meaning: string;
  /** miswritten are pairs of a character of the line and the wrong character a learner is likely to write for it. */
  readonly miswritten: readonly (readonly [string, string])[];
}

/** Poem is a poem to recite. */
export interface Poem {
  readonly id: string;
  readonly title: Text;
  readonly author: Text;
  readonly dynasty: Text;
  readonly lines: readonly Line[];
}

const MARKS = "，。？！；、";

/**
 * parsePoems reads poems separated by blank lines. A poem's first line is its id, title in Chinese and in English, author
 * in Chinese and in English and dynasty in Chinese and in English, separated by ` | `; each line after it is a line of the
 * poem with its mark, what it means, and its miswritings as `right>wrong` separated by spaces.
 */
export function parsePoems(data: string): readonly Poem[] {
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
        const mark = withMark.slice(-1);
        if (!MARKS.includes(mark)) throw new Error(`poem data: no mark after ${withMark}`);
        const text = withMark.slice(0, -1);
        const miswritten = wrong.split(" ").map((pair): [string, string] => {
          const [right, by] = pair.split(">");
          if (!right || !by || [...right].length !== 1 || [...by].length !== 1 || right === by || !text.includes(right))
            throw new Error(`poem data: a miswriting ${pair} of ${text}`);
          return [right, by];
        });
        if (miswritten.length < 2) throw new Error(`poem data: ${text} needs two miswritings`);
        return { text, mark, meaning, miswritten };
      });
      if (lines.length < 4 || new Set(lines.map((l) => l.text)).size !== lines.length) throw new Error(`poem data: the lines of ${zh}`);
      return { id, title: t(en, zh), author: t(authorEn, author), dynasty: t(dynastyEn, dynasty), lines };
    });
}

/** miswrite is a line with one of its usual wrong characters, the first of a pair if a round runs past them. */
const miswrite = (line: Line, k: number): string => {
  const [right, by] = line.miswritten[k % line.miswritten.length]!;
  return line.text.replace(right, by);
};

/** ROUNDS is how many sets of options each line is asked with when choosing by meaning or by writing. */
const ROUNDS = 3;

/** body is the text of a poem, two lines a row. */
function body(poem: Poem): string {
  const rows: string[] = [];
  for (let i = 0; i < poem.lines.length; i += 2)
    rows.push(
      poem.lines
        .slice(i, i + 2)
        .map((l) => l.text + l.mark)
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
  const accepted = (l: Line): readonly string[] => [l.text, l.text + l.mark];
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
    cues.push(typed(`补全《${title}》中的这句诗：${start}${"＿".repeat([...l.text].length - kept)}`, accepted(l), [start, ...errors(l)]));
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
        t("Reciting the Lines", "背诵诗句"),
        t(
          `Read the poem aloud a few times, then say it without looking, line by line.\n\n${headEn}`,
          `先把诗多读几遍，再不看书，一句一句地背下来。\n\n${head}`,
        ),
        typedGenerator("hanzi", t("Write the line of the poem.", "写出诗句。"), cues, (right) =>
          t(`The line is: ${right}\n\n${text}`, `这一句是：${right}\n\n${text}`),
        ),
      ),
      point(
        `${poem.id}-meaning`,
        t("What the Lines Mean", "理解诗意"),
        t(
          `Each line paints a picture; know what it says.\n\n${headEn}\n\n${meaningList}`,
          `每一句诗都描绘了一幅画面，要理解它的意思。\n\n${head}\n\n${meaningList}`,
        ),
        choiceGenerator(
          t("Which line has this meaning?", "哪一句诗写的是这个意思？"),
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
          `Some characters of the poem are often miswritten as ones that sound or look like them. Think of what each means in the line.\n\n${writingList}`,
          `这首诗里有些字容易写成音同或形近的字，想一想每个字在诗句中的意思。\n\n${writingList}`,
        ),
        choiceGenerator(
          t("Which line is written correctly?", "哪一句诗书写正确？"),
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
