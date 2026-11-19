// The listening of dialogues in the levels (docs/chinese-curriculum.md §8.4): a unit's listening ends with dialogues
// on its themes, heard without being seen, each with a question or two among three answers, or four from level 4.
// Every level ends its sixth and twelfth units with a topic each, on the themes of the six units before it. The
// dialogues are written for this package in the characters taught by the end of their unit and read by two voices, a
// woman's and a man's, with the parser, the checks and the problems of the HSK courses' dialogues.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import { checkBlocks, comprehensionGenerator, parseBlocks } from "../hsk/comprehension.ts";
import { levelListeningId } from "./listening.ts";

/** LevelDialogues are the dialogues that end a unit, as written: blocks of 女：/男： lines and 问：/答：/错： questions. */
export interface LevelDialogues {
  /** unit is the unit the topic ends, counting from 1: the sixth or the twelfth. */
  readonly unit: number;
  readonly data: string;
}

const two = (n: number): string => String(n).padStart(2, "0");

/** levelDialoguesId is the id of the nth dialogue topic of a level, counting from 1. */
export const levelDialoguesId = (level: number, n: number): string => `level-${level}-dialogues-${two(n)}`;

/** UNITS_PER_TOPIC is how many units each dialogue topic draws its themes from. */
const UNITS_PER_TOPIC = 6;

/** DialogueSpec says how to build the dialogue topic that may end a unit. */
export interface DialogueSpec {
  readonly level: number;
  /** numeral names the level in Chinese, as in 二级. */
  readonly numeral: string;
  /** unit is the unit's index, counting from 0. */
  readonly unit: number;
  readonly dialogues: readonly LevelDialogues[];
  /** taught are the characters taught by the end of the unit, this level's and the earlier levels'. */
  readonly taught: ReadonlySet<string>;
}

/** unitDialogueTopics builds the dialogue topic that ends a unit, if the level has one there, checking every block. */
export function unitDialogueTopics(spec: DialogueSpec): readonly TopicDef[] {
  const unit = spec.unit + 1;
  if (spec.dialogues.some((d) => d.unit % UNITS_PER_TOPIC !== 0)) throw new Error(`level ${spec.level}: dialogues end only units 6 and 12`);
  const found = spec.dialogues.find((d) => d.unit === unit);
  if (!found) return [];
  const n = unit / UNITS_PER_TOPIC;
  const id = levelDialoguesId(spec.level, n);
  const blocks = parseBlocks(id, found.data);
  checkBlocks(blocks, {
    where: id,
    options: spec.level <= 3 ? 3 : 4,
    taught: spec.taught,
    lines: [2, 8],
    talks: "never",
  });
  const from = unit - UNITS_PER_TOPIC + 1;
  return [
    {
      id,
      title: t(`Level ${spec.level} Dialogues ${two(n)}`, `${spec.numeral}级听对话 ${two(n)}`),
      summary: t(
        `Dialogues on the themes of units ${from} to ${unit}, heard without being seen, each with a question on what was said.`,
        `不看文字，听第 ${from} 至 ${unit} 单元话题上的对话，回答关于它的问题。`,
      ),
      prerequisites: [levelListeningId(spec.level, unit)],
      encompasses: [],
      xp: 12,
      strand: "listening",
      knowledgePoints: [
        point(
          `${id}-dialogues`,
          t("Dialogues", "听对话"),
          t(
            "Read the question and the answers before you listen, so that you know what to listen for: who, where, when, what or why. A woman and a man speak; the question may ask what 女的 or 男的 says, wants or will do. Listen to the whole dialogue: a later line often answers or changes an earlier one. You can play it again as often as you like.",
            "听之前先看问题和选项，知道要听什么：谁、在哪儿、什么时候、做什么、为什么。对话里一个女的、一个男的在说话，问题可能问“女的”或“男的”说了什么、想要什么、要做什么。要听完整个对话：后面的话常常回答或者改变前面的意思。录音可以反复播放。",
          ),
          comprehensionGenerator(blocks, true),
        ),
      ],
    },
  ];
}
