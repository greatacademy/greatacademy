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

/** FaultySpec describes a faulty-sentence topic: its kind of fault, how to find and correct it, and its items. */
export interface FaultySpec {
  readonly id: string;
  readonly title: Text;
  readonly prerequisites: readonly string[];
  /** fault names the kind of fault, as “a part is missing”. */
  readonly fault: Text;
  readonly explanation: Text;
  readonly items: readonly FaultyItem[];
}

/** ROUNDS is how many sets of options each item is asked with when finding faults. */
const ROUNDS = 4;

/** faultyTopic builds a faulty-sentence topic; its banks go item by item within each round, so consecutive seeds never show the same item. */
export function faultyTopic(spec: FaultySpec): TopicDef {
  const { items } = spec;
  if (items.length < 10) throw new Error(`${spec.id}: a faulty-sentence topic needs 10 items`);
  const n = items.length;
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
  const byFaulty = new Map(items.map((i) => [i.faulty, i]));
  const examples = items
    .slice(0, 3)
    .map((i) => `- ${i.faulty}\n  → ${i.corrected}`)
    .join("\n");
  return {
    id: spec.id,
    title: spec.title,
    summary: t(`Finding and correcting sentences where ${spec.fault.en}.`, `找出并修改${spec.fault["zh-CN"]}的病句。`),
    prerequisites: [...spec.prerequisites],
    encompasses: [],
    xp: n,
    strand: "grammar",
    knowledgePoints: [
      point(
        `${spec.id}-finding`,
        t("Finding the Fault", "找出病句"),
        t(`${spec.explanation.en}\n\n${examples}`, `${spec.explanation["zh-CN"]}\n\n${examples}`),
        choiceGenerator(
          t("Which sentence has a fault?", "哪个句子有语病？"),
          findBank,
          (right) => {
            const fix = byFaulty.get(right)?.corrected ?? "";
            return t(
              `This sentence is faulty: ${spec.fault.en}. Corrected: ${fix}`,
              `这个句子有语病：${spec.fault["zh-CN"]}。可以改为：${fix}`,
            );
          },
          (wrong) => t(`${wrong} has no fault.`, `“${wrong}”没有语病。`),
        ),
      ),
      point(
        `${spec.id}-fixing`,
        t("Correcting It", "修改病句"),
        t(
          `${spec.explanation.en} A correction mends the fault and keeps what the sentence means; it adds no new fault.\n\n${examples}`,
          `${spec.explanation["zh-CN"]}修改病句要改掉毛病，保持原意，也不能出现新的毛病。\n\n${examples}`,
        ),
        choiceGenerator(
          t("Which revision corrects the sentence?", "哪种改法是正确的？"),
          fixBank,
          (right) => t(`The correction is: ${right}`, `正确的改法是：${right}`),
          (wrong) => t(`${wrong} still has a fault.`, `“${wrong}”仍然有语病。`),
        ),
      ),
    ],
  };
}
