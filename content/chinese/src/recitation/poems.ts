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

/** ENDS are the marks that close a sentence of a poem, where its rows break. */
const ENDS = "。？！；";

/** body is the text of a poem, a sentence a row, or a passage as one paragraph. */
function body(poem: Poem): string {
  if (poem.kind === "prose") return poem.lines.map((l) => l.shown).join("");
  const rows: string[] = [];
  let row = "";
  for (const l of poem.lines) {
    row += l.shown;
    if (ENDS.includes(l.mark)) {
      rows.push(row);
      row = "";
    }
  }
  if (row !== "") rows.push(row);
  return rows.join("\n");
}

/** partner is the line read together with line i in a check: the one it runs on into, or else the one before it. */
const partner = (lines: readonly Line[], i: number): number =>
  (i + 1 < lines.length && !ENDS.includes(lines[i]!.mark)) || i === 0 ? i + 1 : i - 1;

/** careful says which characters of a line are not to be written as which, in Chinese. */
const careful = (l: Line): string => l.miswritten.map(([r, w]) => `“${r}”不要写成“${w}”`).join("，");

/** carefulEn says the same in English. */
const carefulEn = (l: Line): string => l.miswritten.map(([r, w]) => `${r}, not ${w}`).join("; ");

/** era names a dynasty as a period: one character takes 代 (唐代), a longer name stands as it is (先秦, 东晋). */
const era = (dynasty: string): string => ([...dynasty].length === 1 ? `${dynasty}代` : dynasty);

/** pair is two lines read together in their order, as written. */
const pair = (lines: readonly Line[], i: number, j: number): string => {
  const [a, b] = i < j ? [lines[i]!, lines[j]!] : [lines[j]!, lines[i]!];
  return `${a.shown}${b.shown}`;
};

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
  const indexOf = new Map(lines.map((l, i) => [l.text, i]));

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

  /** recall is the first step of a typed cue: how the line is found from what the question gives. */
  const recall = (i: number, shown: string): { en: string; zh: string } => {
    const l = lines[i]!;
    if (shown.includes("的下一句")) {
      const g = lines[i - 1]!;
      return {
        en: `The given ${w.line}, ${g.text}, means: ${g.meaning}. The ${w.line} after it goes on: ${l.meaning}.`,
        zh: `给出的“${g.text}”，意思是：${g.meaning}。接下去的一句写的是：${l.meaning}。`,
      };
    }
    if (shown.includes("的上一句")) {
      const g = lines[i + 1]!;
      return {
        en: `The given ${w.line}, ${g.text}, means: ${g.meaning}. The ${w.line} before it says: ${l.meaning}.`,
        zh: `给出的“${g.text}”，意思是：${g.meaning}。它前面的一句写的是：${l.meaning}。`,
      };
    }
    if (shown.includes("第一句")) return { en: `The ${w.text} opens with: ${l.meaning}.`, zh: `${w.this}从这里写起：${l.meaning}。` };
    if (shown.includes("最后一句")) return { en: `The ${w.text} closes with: ${l.meaning}.`, zh: `${w.this}在这里收尾：${l.meaning}。` };
    return {
      en: `The ${w.line} that begins so is ${w.line} ${i + 1} of the ${w.text}; it means: ${l.meaning}.`,
      zh: `这样开头的是全${w.whole}第 ${i + 1} 句，意思是：${l.meaning}。`,
    };
  };

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

  /** slip names the character a miswritten version has in place of the right one. */
  const slip = (version: string, right: string): readonly [string, string] => {
    const a = [...version];
    const b = [...right];
    const k = a.findIndex((c, j) => c !== b[j]);
    return [b[k] ?? "", a[k] ?? ""];
  };

  const first = lines[0]!;
  const last = lines[n - 1]!;
  const intro = t(
    `"${poem.title.en}" (${title}) is a work by ${poem.author.en} of the ${poem.dynasty.en} dynasty, ${n} ${w.line}s long, which opens with ${first.text} (${first.meaning}) and ends with ${last.text} (${last.meaning}).\n\nReciting is not repeating characters until they stick. Understand first what each ${w.line} says: when one picture leads to the next, the order of the ${w.line}s follows. Then mind the few characters that are easy to miswrite. The three knowledge points practise these in turn: saying the ${w.line}s in order, knowing what they mean, and writing them correctly.`,
    `《${title}》是${era(poem.dynasty["zh-CN"])}${poem.author["zh-CN"]}的作品，共 ${n} 句：开头一句“${first.text}”，意思是${first.meaning}；结尾一句“${last.text}”，意思是${last.meaning}。\n\n背诵不是把字硬记下来。先弄懂每一句写了什么：意思一句接着一句，句子的先后也就记住了；再留心几个容易写错的字。下面三个知识点依次练这三件事：按顺序背出${w.lines}、理解${w.sense}、正确书写。`,
  );

  const a = lines[1]!;
  const b = lines[2]!;
  const linesExplanation = t(
    `Read the ${w.text} aloud a few times until you understand it, then say it without looking, ${w.line} by ${w.line}. Hold on to the order of what it says: each ${w.line} goes on from the one before, so recalling what one says brings the next.\n\nFor example, ${a.text} means: ${a.meaning}. The next ${w.line}, ${b.text}, goes on: ${b.meaning}. Keep that order in mind, and when asked for the ${w.line} after ${a.text}, ${b.text} comes to mind.\n\n${headEn}\n\n> **Watch out.** Write the ${w.line} the question asks for, not the one it gives; and mind the characters that are easy to miswrite: ${carefulEn(b)}.`,
    `先把${w.whole}多读几遍，读懂了，再不看书，一句一句地背下来。背的时候抓住意思的先后：每一句都接着上一句往下写，想起这一句写了什么，下一句也就跟着出来了。\n\n比如“${a.text}”，意思是：${a.meaning}。接下去的“${b.text}”写的是：${b.meaning}。记住这个先后，问到“${a.text}”的下一句，就能想起“${b.text}”。\n\n${head}\n\n> **注意。** 要写的是问到的那一句，不是题目里给出的那一句；还要留心容易写错的字，比如${careful(b)}。`,
  );

  const c = lines[n - 2]!;
  const meaningList = lines.map((l) => `- ${l.text}：${l.meaning}`).join("\n");
  const meaningExplanation = t(
    `${w.meaningEn} To match a meaning with its ${w.line}, look for the ${w.line} that tells the same thing as a whole.\n\nFor example, the meaning "${c.meaning}" belongs to ${c.text}: that ${w.line} says exactly this. Another ${w.line} may share a word or a picture with it, but as a whole it says something else.\n\n${headEn}\n\n${meaningList}\n\n> **Watch out.** The options include other ${w.line}s of this ${w.text} and ${w.line}s of other ${w.text}s, close in meaning. Match the whole ${w.line}, not one word of it.`,
    `${w.meaningZh}给意思找${w.lines}，要找整句说的正是这件事的那一句。\n\n比如意思“${c.meaning}”，写的就是“${c.text}”这一句。别的句子也许有一两个词、一个景物和它相同，整句说的却是别的事。\n\n${head}\n\n${meaningList}\n\n> **注意。** 选项里有本${w.one === "诗" ? "诗" : "文"}的其他句子，也有别的${w.one === "诗" ? "诗" : "文章"}里的句子，意思只差一点。要整句对上，不能只对上一个词。`,
  );

  const writingList = lines.map((l) => `- ${l.text}：${careful(l)}`).join("\n");
  const [r0, w0] = first.miswritten[0]!;
  const writingExplanation = t(
    `Some characters of the ${w.text} are often miswritten as ones that sound or look like them. A wrong character reads the same aloud, so it shows only when written; think of what each character means in the ${w.line}.\n\nFor example, in ${first.text}, which means "${first.meaning}", the character is ${r0}; ${w0} sounds or looks like it but does not fit the meaning.\n\n${writingList}\n\n> **Watch out.** Each wrong option differs from the ${w.text} in a single character. Compare the ${w.line}s character by character with the ${w.text}.`,
    `${w.this}里有些字容易写成音同或形近的字。写错的字读起来没有错，写出来才错，所以要想一想每个字在${w.lines}中的意思。\n\n比如“${first.text}”，意思是${first.meaning}，句中写“${r0}”；“${w0}”和它音近或形近，意思却对不上。\n\n${writingList}\n\n> **注意。** 错的选项和原文只差一个字，要拿选项和原文逐字对照，不能只看大概。`,
  );

  return {
    id: poem.id,
    title: poem.title,
    summary: t(`Reciting "${poem.title.en}" by ${poem.author.en}.`, `背诵${poem.author["zh-CN"]}的《${title}》。`),
    intro,
    prerequisites: [...prerequisites],
    encompasses: [],
    xp: n,
    strand: "recitation",
    knowledgePoints: [
      point(
        `${poem.id}-lines`,
        t(`Reciting the ${w.Lines}`, `背诵${w.recite}`),
        linesExplanation,
        typedGenerator("hanzi", t(`Write the ${w.line} of the ${w.text}.`, `写出${w.lines}。`), cues, (right, shown) => {
          const i = indexOf.get(right) ?? 0;
          const l = lines[i]!;
          const j = partner(lines, i);
          const step = recall(i, shown);
          return t(
            `**Step 1: recall it by its meaning.** ${step.en}\n\n**Step 2: write the ${w.line}.** ${right}. Mind the characters: ${carefulEn(l)}.\n\n${text}\n\n**Check.** Read it with the ${w.line} it goes with: ${pair(lines, i, j)} The two run on in meaning, and every character is the one in the ${w.text}.`,
            `**第一步：从意思想起。**${step.zh}\n\n**第二步：写出这一句。**“${right}”。书写时，${careful(l)}。\n\n${text}\n\n**检验。** 和相连的一句合起来读：“${pair(lines, i, j)}”前后意思接得上，每个字也都和原文一样。`,
          );
        }),
      ),
      point(
        `${poem.id}-meaning`,
        t(`What the ${w.Lines} Mean`, `理解${w.sense}`),
        meaningExplanation,
        choiceGenerator(
          t(`Which ${w.line} has this meaning?`, `哪一句${w.one}写的是这个意思？`),
          meaningBank,
          (right) => {
            const i = indexOf.get(right) ?? 0;
            const l = lines[i]!;
            const o = lines[partner(lines, i)]!;
            return t(
              `**Step 1: read the meaning.** It says: ${l.meaning}.\n\n**Step 2: find the ${w.line} that says this.** ${w.Lines.slice(0, -1)} ${i + 1} of the ${w.text}, ${right}, tells exactly this.\n\n**Check.** Put it back in the ${w.text}: the ${w.line} next to it, ${o.text}, says something else (${o.meaning}), so the meaning belongs to ${right} alone.`,
              `**第一步：读懂意思。**它说的是：${l.meaning}。\n\n**第二步：找写这件事的一句。**全${w.whole}第 ${i + 1} 句“${right}”写的正是这件事。\n\n**检验。** 放回原文看：和它相连的“${o.text}”写的是另一件事（${o.meaning}），所以这个意思只属于“${right}”。`,
            );
          },
          (wrong) => {
            const source = sources.get(wrong);
            if (!source) return t(`${wrong} says something else.`, `“${wrong}”说的是别的意思。`);
            const where = source.poem === poem ? "" : `（出自《${source.poem.title["zh-CN"]}》）`;
            const whereEn = source.poem === poem ? "" : ` (from "${source.poem.title.en}")`;
            return t(`${wrong}${whereEn} means: ${source.line.meaning}.`, `“${wrong}”${where}的意思是：${source.line.meaning}。`);
          },
        ),
      ),
      point(
        `${poem.id}-writing`,
        t("Writing the Lines", "正确书写"),
        writingExplanation,
        choiceGenerator(
          t(`Which ${w.line} is written correctly?`, `哪一句${w.one}书写正确？`),
          writingBank,
          (right) => {
            const l = lines[indexOf.get(right) ?? 0]!;
            return t(
              `**Step 1: compare each option with the ${w.text}, character by character.** Only ${right} matches it in every character; each of the others has one wrong character, shown below.\n\n**Check.** ${right} means: ${l.meaning}. Every character fits that meaning, ${carefulEn(l)}.`,
              `**第一步：拿每个选项和原文逐字对照。**只有“${right}”和原文一字不差，其余几句各有一个错字，见下面。\n\n**检验。** “${right}”的意思是：${l.meaning}。每个字都合这个意思，其中${careful(l)}。`,
            );
          },
          (wrong) => {
            const right = correctOf.get(wrong) ?? "";
            const [r, by] = slip(wrong, right);
            return t(`${wrong} writes ${by} for ${r}; it should be ${right}.`, `“${wrong}”把“${r}”写成了“${by}”，应写作“${right}”。`);
          },
        ),
      ),
    ],
  };
}
