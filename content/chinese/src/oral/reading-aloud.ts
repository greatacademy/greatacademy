// The reading aloud of the native grades (docs/chinese-curriculum.md §11): a learner whose first language is Chinese
// reads the grade's own passages aloud, a few sentences at a time, heard by a speech service. It practises reading
// aloud fluently, whole and in order, not pronunciation: a regional accent costs nothing, so the pronunciation score is
// not asked for. Speeches, judged by what they say, would need a model, and a spoken topic is checked by rules.

import { heardResponse, type Problem, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { parts } from "../hsk/oral.ts";
import { fromBank } from "../level-1/listening.ts";
import { chineseReading } from "../reading/index.ts";

/** LANGUAGE is the language read aloud. */
const LANGUAGE = "zh-CN";

/** MIN_ITEMS is how many parts a grade's reading aloud needs. */
const MIN_ITEMS = 30;

/** Pace is how long a grade's parts may be, at least and at most, and how long a character may take to read. */
interface Pace {
  /** least is the fewest characters a part may have; shorter ones, such as a line of dialogue alone, are left out. */
  readonly least: number;
  readonly chars: number;
  readonly secondsPerChar: number;
}

/** paceOf is the pace of a grade: younger readers read shorter parts, more slowly. */
const paceOf = (grade: number): Pace =>
  grade <= 2 ? { least: 6, chars: 40, secondsPerChar: 0.6 } : { least: 10, chars: 60, secondsPerChar: 0.4 };

const NUMERALS = ["零", "一", "二", "三", "四", "五", "六", "七", "八", "九", "十", "十一"];

/** gradeName names a grade in Chinese: 三年级, or 高中必修 and 高中选择性必修 for 10 and 11. */
const gradeName = (grade: number): string => (grade === 10 ? "高中必修" : grade === 11 ? "高中选择性必修" : `${NUMERALS[grade]}年级`);

/** readingAloudId is the id of a grade's reading aloud. */
export const readingAloudId = (grade: number): string => `reading-aloud-${grade}`;

/** heardAs is the response of a text heard clearly. */
const heardAs = (text: string) => heardResponse({ text, confidence: 0.95, seconds: [...text].length * 0.3 + 0.5 });

/** gradeParts are the parts of a grade's passages, every paragraph in parts of whole sentences. */
function gradeParts(grade: number): { readonly parts: readonly string[]; readonly after: string } {
  const units = chineseReading.filter((r) => r.grade === grade).map((r) => r.unit);
  const after = units[0]?.passages[0]?.topics[0]?.topic;
  if (!after) throw new Error(`${readingAloudId(grade)}: the grade has no passages`);
  const { least, chars } = paceOf(grade);
  const all = units
    .flatMap((u) => u.passages)
    .flatMap((p) => p.body.split(/\n\s*\n/u))
    .map((para) => para.replace(/\s+/gu, ""))
    .flatMap((para) => {
      // A paragraph is cut into parts of whole sentences; a sentence longer than a part is cut at its commas.
      const pieces = parts(para).flatMap((s) => ([...s].length <= chars ? [s] : (s.match(/[^，；：]+[，；：]?/gu) ?? [])));
      const out: string[] = [];
      let part = "";
      for (const piece of pieces) {
        if (part !== "" && [...part, ...piece].length > chars) {
          out.push(part);
          part = "";
        }
        part += piece;
      }
      if (part !== "") out.push(part);
      return out;
    })
    .filter((s) => [...s].length >= least && [...s].length <= chars);
  return { parts: [...new Set(all)], after };
}

/** readingAloudTopic builds a grade's reading aloud from its passages. */
function readingAloudTopic(grade: number): TopicDef {
  const id = readingAloudId(grade);
  const { parts: all, after } = gradeParts(grade);
  if (all.length < MIN_ITEMS) throw new Error(`${id}: ${all.length} parts, needs ${MIN_ITEMS}`);
  const { secondsPerChar } = paceOf(grade);
  const bank = all.map(
    (p, i) => (): Problem => ({
      prompt: t(`Read aloud:\n\n> ${p}`, `朗读：\n\n> ${p}`),
      answer: {
        checker: "speech",
        expected: { mode: "read", reference: p, minAccuracy: 0 },
        input: {
          kind: "speech",
          language: LANGUAGE,
          mode: "read",
          text: p,
          maxSeconds: Math.min(30, 5 + Math.ceil([...p].length * secondsPerChar)),
        },
      },
      solution: t(
        "Read it again, word by word as written, keeping the words of a phrase together.",
        "照着原文再读一遍，不加字、不漏字，一个词语里的字连起来读。",
      ),
      canonical: heardAs(p),
      wrong: [heardAs(all[(i + Math.floor(all.length / 2)) % all.length]!)],
    }),
  );
  return {
    id,
    title: t(`Reading Aloud, Grade ${grade}`, `朗读：${gradeName(grade)}`),
    summary: t(
      `The grade's passages read aloud a few sentences at a time, correctly, fluently and in order.`,
      `朗读本年级的文章，每次几句，正确、流利，不加字、不漏字。`,
    ),
    prerequisites: [after],
    encompasses: [],
    xp: 10,
    strand: "speaking",
    spoken: LANGUAGE,
    knowledgePoints: [
      point(
        `${id}-texts`,
        t("Reading Aloud", "朗读课文"),
        t(
          "Read in standard Mandarin, clearly and at an even speed, as if reading to a listener. Read every character as written, without adding, leaving out or repeating any. Keep the characters of a word together, pause a little at a comma and longer at a full stop, and let a question rise and an exclamation sound like one. An accent of your region does not count against you.",
          "用普通话朗读，声音响亮，速度均匀，像读给别人听。照着原文读，不加字、不漏字、不重复。一个词语里的字连起来读，逗号处稍停，句号处停得长一些，问句和感叹句读出相应的语气。带一点地方口音不要紧。",
        ),
        fromBank(bank),
      ),
    ],
  };
}

/** READING_ALOUD_GRADES are the grades with reading aloud: every grade whose passages give enough parts. */
const READING_ALOUD_GRADES = [...new Set(chineseReading.map((r) => r.grade))].sort((a, b) => a - b);

/** readingAloudTopics are the reading aloud topics of the native grades, by grade. */
export const readingAloudTopics: readonly { readonly grade: number; readonly topic: TopicDef }[] = READING_ALOUD_GRADES.map((grade) => ({
  grade,
  topic: readingAloudTopic(grade),
}));
