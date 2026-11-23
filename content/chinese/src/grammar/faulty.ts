// Faulty-sentence topics (病句, docs/chinese-curriculum.md §6): one kind of fault a topic, taught by finding and
// correcting it rather than by naming it. Each item is a faulty sentence, its correction and three revisions that do not
// correct it. One knowledge point finds the faulty sentence among the corrections of others; the other chooses the
// correction among two of the wrong revisions, in three different pairs.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-chinese";

/** FaultyItem is a faulty sentence, its correction, and three revisions that leave a fault or make a new one. */
export interface FaultyItem {
  readonly faulty: string;
  readonly corrected: string;
  readonly wrong: readonly [string, string, string];
}

/** parseFaulty reads faulty-sentence data, a line an item: the faulty sentence, its correction and three wrong revisions, separated by ` | `. */
export function parseFaulty(data: string): readonly FaultyItem[] {
  return data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line) => {
      const fields = line.split(" | ").map((f) => f.trim());
      if (fields.length !== 5 || new Set(fields).size !== 5) throw new Error(`faulty-sentence data: ${line}`);
      const [faulty, corrected, a, b, c] = fields as [string, string, string, string, string];
      return { faulty, corrected, wrong: [a, b, c] };
    });
}

/** FaultyNote says what is wrong with an item's faulty sentence, why its correction is sound, and why each wrong revision fails. */
export interface FaultyNote {
  readonly fault: Text;
  readonly sound: Text;
  readonly wrong: readonly [Text, Text, Text];
}

/**
 * FaultyNotes are what a faulty-sentence topic teaches with: its introduction, the test that finds its fault, the
 * mistake to watch for, and a note an item, a line each in the order of the items: in Chinese and in English, what is
 * wrong, why the correction is sound and why each wrong revision fails, ten fields separated by ` | `.
 */
export interface FaultyNotes {
  readonly intro: Text;
  readonly test: Text;
  readonly watch: Text;
  readonly notes: string;
}

/** parseFaultyNotes reads the notes of a topic's items, checking there is one for each item. */
export function parseFaultyNotes(id: string, data: string, count: number): readonly FaultyNote[] {
  const notes = data
    .split("\n")
    .map((line) => line.trim())
    .filter((line) => line !== "")
    .map((line): FaultyNote => {
      const f = line.split(" | ").map((x) => x.trim());
      if (f.length !== 10) throw new Error(`${id}: faulty-sentence notes: ${line}`);
      const text = (i: number) => t(f[i + 1]!, f[i]!);
      return { fault: text(0), sound: text(2), wrong: [text(4), text(6), text(8)] };
    });
  if (notes.length !== count) throw new Error(`${id}: ${notes.length} notes for ${count} items`);
  return notes;
}

/** FaultySpec describes a faulty-sentence topic: its kind of fault, how to find and correct it, its items and their notes. */
export interface FaultySpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  /** fault names the kind of fault, as “a part is missing”. */
  readonly fault: Text;
  readonly explanation: Text;
  readonly items: readonly FaultyItem[];
  readonly notes: FaultyNotes;
}

/** ROUNDS is how many sets of options each item is asked with when finding faults. */
const ROUNDS = 4;

/** callout ends an explanation with the mistake to watch for. */
const callout = (watch: Text): Text => t(`> **Watch out.** ${watch.en}`, `> **注意。** ${watch["zh-CN"]}`);

/** faultyTopic builds a faulty-sentence topic; its banks go item by item within each round, so consecutive seeds never show the same item. */
export function faultyTopic(spec: FaultySpec): TopicDef {
  const { items } = spec;
  if (items.length < 10) throw new Error(`${spec.id}: a faulty-sentence topic needs 10 items`);
  const n = items.length;
  const notes = parseFaultyNotes(spec.id, spec.notes.notes, n);
  const correctOf = (i: number, k: number): string[] =>
    [1, 3, 5]
      .map((d) => items[(i + d + k) % n]!)
      .filter((o) => o !== items[i])
      .map((o) => o.corrected);
  const findBank: readonly ChoiceItem[] = Array.from({ length: ROUNDS }, (_, k) => k).flatMap((k) =>
    items.map((item, i): ChoiceItem => ["", item.faulty, correctOf(i, k)]),
  );
  const pairs = [
    [0, 1],
    [1, 2],
    [0, 2],
  ] as const;
  const fixBank: readonly ChoiceItem[] = pairs.flatMap(([a, b]) =>
    items.map((item): ChoiceItem => [item.faulty, item.corrected, [item.wrong[a], item.wrong[b]]]),
  );
  const at = (key: (item: FaultyItem) => string) => new Map(items.map((item, i) => [key(item), i]));
  const byFaulty = at((i) => i.faulty);
  const byCorrected = at((i) => i.corrected);
  const noteOf = (index: Map<string, number>, s: string): { item: FaultyItem; note: FaultyNote } => {
    const i = index.get(s);
    if (i === undefined) throw new Error(`${spec.id}: no item for ${s}`);
    return { item: items[i]!, note: notes[i]! };
  };
  const { test, watch } = spec.notes;
  const first = items[0]!;
  const firstNote = notes[0]!;
  const worked = t(
    `For example, ${first.faulty} Here ${firstNote.fault.en}. Corrected: ${first.corrected} Now ${firstNote.sound.en}.`,
    `例如：${first.faulty}这个句子${firstNote.fault["zh-CN"]}。改为：${first.corrected}这样${firstNote.sound["zh-CN"]}。`,
  );
  const examples = items
    .slice(1, 3)
    .map((i) => `- ${i.faulty}\n  → ${i.corrected}`)
    .join("\n");
  const firstWrong = first.wrong[0];
  return {
    id: spec.id,
    title: spec.title,
    summary: t(`Finding and correcting sentences where ${spec.fault.en}.`, `找出并修改${spec.fault["zh-CN"]}的病句。`),
    intro: spec.notes.intro,
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: n,
    strand: "grammar",
    knowledgePoints: [
      point(
        `${spec.id}-finding`,
        t("Finding the Fault", "找出病句"),
        t(
          `${spec.explanation.en}\n\n${test.en}\n\n${worked.en}\n\nMore faulty sentences and their corrections:\n\n${examples}\n\n${callout(watch).en}`,
          `${spec.explanation["zh-CN"]}\n\n${test["zh-CN"]}\n\n${worked["zh-CN"]}\n\n再看几个病句和它们的改法：\n\n${examples}\n\n${callout(watch)["zh-CN"]}`,
        ),
        choiceGenerator(
          t("Which sentence has a fault?", "哪个句子有语病？"),
          findBank,
          (right) => {
            const { item, note } = noteOf(byFaulty, right);
            return t(
              `**Step 1: test each sentence.** ${test.en}\n\n**Step 2: find the one that fails.** ${right} fails: ${note.fault.en}. It is faulty, since ${spec.fault.en}.\n\n**Check.** Mend it and test it again: ${item.corrected} passes, since ${note.sound.en}. The other sentences pass as they are; only this one had to change.`,
              `**第一步：逐句检查。**${test["zh-CN"]}\n\n**第二步：找出通不过的句子。**“${right}”通不过：${note.fault["zh-CN"]}，是${spec.fault["zh-CN"]}的病句。\n\n**检验。** 改好后再查一遍：“${item.corrected}”能通过，因为${note.sound["zh-CN"]}。其他句子不用修改就能通过，只有这一句要改。`,
            );
          },
          (wrong) => {
            const { item, note } = noteOf(byCorrected, wrong);
            return t(
              `${wrong} has no fault. It is the correction of ${item.faulty}: ${note.sound.en}.`,
              `“${wrong}”没有语病。它是“${item.faulty}”的正确改法：${note.sound["zh-CN"]}。`,
            );
          },
        ),
      ),
      point(
        `${spec.id}-fixing`,
        t("Correcting It", "修改病句"),
        t(
          `${spec.explanation.en} A correction mends the fault and keeps what the sentence means; it adds no new fault.\n\n${worked.en} A revision such as ${firstWrong} does not correct it: ${firstNote.wrong[0].en}.\n\n${examples}\n\n${callout(watch).en}`,
          `${spec.explanation["zh-CN"]}修改病句要改掉毛病，保持原意，也不能出现新的毛病。\n\n${worked["zh-CN"]}如果改成“${firstWrong.replace(/。$/u, "")}”，就没有改对：${firstNote.wrong[0]["zh-CN"]}。\n\n${examples}\n\n${callout(watch)["zh-CN"]}`,
        ),
        choiceGenerator(
          t("Which revision corrects the sentence?", "哪种改法是正确的？"),
          fixBank,
          (right, shown) => {
            const { note } = noteOf(byFaulty, shown);
            return t(
              `**Step 1: find the fault.** In the sentence, ${note.fault.en}.\n\n**Step 2: choose the revision that mends it.** ${right} mends it: ${note.sound.en}.\n\n**Check.** Test the correction as the faulty sentence was tested: ${test.en} ${right} passes, and it still says what the sentence meant to say.`,
              `**第一步：找出毛病。**原句${note.fault["zh-CN"]}。\n\n**第二步：选出改掉毛病的改法。**“${right}”改掉了毛病：${note.sound["zh-CN"]}。\n\n**检验。** 用检查原句的办法再查一遍改句：${test["zh-CN"]}“${right}”能通过，意思也和原句想说的一样。`,
            );
          },
          (wrong, _right, shown) => {
            const { item, note } = noteOf(byFaulty, shown);
            const reason = note.wrong[item.wrong.indexOf(wrong)];
            if (!reason) throw new Error(`${spec.id}: no reason for ${wrong}`);
            return t(`${wrong} does not correct it: ${reason.en}.`, `“${wrong}”没有改对：${reason["zh-CN"]}。`);
          },
        ),
      ),
    ],
  };
}
