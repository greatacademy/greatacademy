// The language topic of grade 4 (docs/chinese-curriculum.md §18.9): characters with more than one reading, read in a
// word by what the character means there. The readings and senses are those of the general dictionaries, worded for
// this subject; the words are common ones of the grades.

import { type Text, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { bilingual, type Choice, choice, choiceTopicGenerator, rows } from "./choice-kit.ts";

/** Reading is one reading of a character: its pinyin, what it means, and two words that use it. */
interface Reading {
  readonly pinyin: string;
  readonly sense: Text;
  readonly words: readonly [string, string];
}

/** Polyphone is a character with two common readings, and a reading it does not have that looks like them. */
interface Polyphone {
  readonly char: string;
  readonly readings: readonly [Reading, Reading];
  readonly decoy: string;
}

/**
 * POLYPHONES are the characters, each on a line `character | pinyin ~ sense ~ English ~ word word | pinyin ~ sense ~
 * English ~ word word | a reading it does not have`.
 */
const POLYPHONES: readonly Polyphone[] = rows(
  `
行 | xíng ~ 走；可以 ~ to walk; to be all right ~ 步行 不行 | háng ~ 排成的行列；行业 ~ a row; a trade ~ 银行 一行字 | hǎng
长 | cháng ~ 两头的距离大 ~ long ~ 长江 很长 | zhǎng ~ 生长；年纪大或职位高 ~ to grow; elder, head ~ 长大 班长 | chàng
发 | fā ~ 送出；产生 ~ to send; to give off ~ 发信 出发 | fà ~ 头发 ~ hair ~ 头发 理发 | fǎ
好 | hǎo ~ 优点多，使人满意 ~ good ~ 好人 好看 | hào ~ 喜爱 ~ to be fond of ~ 爱好 好奇 | háo
乐 | lè ~ 快乐 ~ glad ~ 快乐 乐园 | yuè ~ 音乐 ~ music ~ 音乐 乐器 | lě
重 | zhòng ~ 分量大；要紧 ~ heavy; important ~ 很重 重要 | chóng ~ 再一次 ~ again ~ 重新 重来 | zhǒng
数 | shù ~ 数目 ~ a number ~ 数字 数学 | shǔ ~ 一个一个地点数目 ~ to count ~ 数一数 数星星 | shū
还 | hái ~ 仍然；更加 ~ still; even more ~ 还是 还要 | huán ~ 归还 ~ to give back ~ 还书 归还 | hài
背 | bēi ~ 用背驮着 ~ to carry on the back ~ 背书包 背着弟弟 | bèi ~ 身体后面；背诵 ~ the back; to recite ~ 后背 背课文 | běi
种 | zhǒng ~ 种子；种类 ~ a seed; a kind ~ 种子 一种 | zhòng ~ 种植 ~ to plant ~ 种树 种花 | zhōng
空 | kōng ~ 里面没有东西；天空 ~ empty; the sky ~ 天空 空瓶子 | kòng ~ 没有事的时间 ~ free time ~ 有空 空闲 | kǒng
少 | shǎo ~ 数量小 ~ few ~ 很少 多少 | shào ~ 年纪轻 ~ young ~ 少年 少先队 | sháo
`,
  4,
).map(([char, a, b, decoy]) => {
  const reading = (field: string): Reading => {
    const [pinyin = "", zh = "", en = "", words = ""] = field.split(" ~ ").map((s) => s.trim());
    const [w1 = "", w2 = ""] = words.split(" ");
    if (pinyin === "" || w1 === "" || w2 === "" || !w1.includes(char!) || !w2.includes(char!))
      throw new Error(`polyphones: ${char} ${field}`);
    return { pinyin, sense: bilingual(`${zh} ~ ${en}`), words: [w1, w2] };
  };
  return { char: char!, readings: [reading(a!), reading(b!)], decoy: decoy! };
});

/** inWord are the questions of reading a character in a word: the right reading, the other one, and the decoy. */
const inWord: readonly Choice[] = POLYPHONES.flatMap(({ char, readings, decoy }) =>
  readings.flatMap((r, i) => {
    const other = readings[1 - i]!;
    return r.words.map((word) =>
      choice({
        ask: t(`How is ${char} read in ${word}?`, `“${char}”在“${word}”里读什么？`),
        shown: "",
        right: r.pinyin,
        wrong: [
          [
            other.pinyin,
            t(
              `read ${other.pinyin}, ${char} means ${other.sense.en}, as in ${other.words[0]}; in ${word} it means ${r.sense.en}.`,
              `读 ${other.pinyin} 时是“${other.sense["zh-CN"]}”的意思，比如“${other.words[0]}”；“${word}”里的“${char}”是“${r.sense["zh-CN"]}”。`,
            ),
          ],
          [
            decoy,
            t(
              `${char} is not read ${decoy}; its common readings are ${readings[0].pinyin} and ${readings[1].pinyin}.`,
              `“${char}”不读 ${decoy}，它常用的读音是 ${readings[0].pinyin} 和 ${readings[1].pinyin}。`,
            ),
          ],
        ],
        find: t(
          `${char} has two common readings: ${readings[0].pinyin}, ${readings[0].sense.en}, and ${readings[1].pinyin}, ${readings[1].sense.en}. Ask what it means in ${word}.`,
          `“${char}”常用的有两个读音：${readings[0].pinyin}，${readings[0].sense["zh-CN"]}；${readings[1].pinyin}，${readings[1].sense["zh-CN"]}。想一想它在“${word}”里是什么意思。`,
        ),
        choose: t(
          `In ${word}, ${char} means ${r.sense.en}, so it is read ${r.pinyin}.`,
          `“${word}”里的“${char}”是“${r.sense["zh-CN"]}”的意思，所以读 ${r.pinyin}。`,
        ),
        check: t(
          `Read ${word} aloud with ${r.pinyin}: it is the word you know, as in ${r.words[0] === word ? r.words[1] : r.words[0]}, where ${char} is read the same.`,
          `用 ${r.pinyin} 把“${word}”读一读，正是平常说的这个词；“${r.words[0] === word ? r.words[1] : r.words[0]}”里的“${char}”也这样读。`,
        ),
      }),
    );
  }),
);

/** byReading are the questions of finding, for a reading, the word in which the character is so read. */
const byReading: readonly Choice[] = POLYPHONES.flatMap(({ char, readings }) =>
  readings.flatMap((r, i) => {
    const other = readings[1 - i]!;
    return r.words.map((word) =>
      choice({
        ask: t(`In which word is ${char} read ${r.pinyin}?`, `下面哪个词里的“${char}”读 ${r.pinyin}？`),
        shown: "",
        right: word,
        wrong: other.words.map((w) => [
          w,
          t(
            `in ${w}, ${char} means ${other.sense.en}, and is read ${other.pinyin}.`,
            `“${w}”里的“${char}”是“${other.sense["zh-CN"]}”的意思，读 ${other.pinyin}。`,
          ),
        ]),
        find: t(
          `Read ${r.pinyin}, ${char} means ${r.sense.en}; read ${other.pinyin}, it means ${other.sense.en}.`,
          `“${char}”读 ${r.pinyin} 时是“${r.sense["zh-CN"]}”的意思，读 ${other.pinyin} 时是“${other.sense["zh-CN"]}”的意思。`,
        ),
        choose: t(
          `Ask what ${char} means in each word. Only in ${word} does it mean ${r.sense.en}.`,
          `看看每个词里的“${char}”是什么意思。只有“${word}”里的是“${r.sense["zh-CN"]}”。`,
        ),
        check: t(`Read ${word} aloud with ${r.pinyin}: it is the word you know.`, `用 ${r.pinyin} 把“${word}”读一读，正是平常说的这个词。`),
      }),
    );
  }),
);

/** gradeFourLanguage are the language topics of grade 4. */
export const gradeFourLanguage: readonly GradeTopic[] = [
  {
    grade: 4,
    topic: {
      id: "language-4-polyphones",
      title: t("Characters With Several Readings", "多音字"),
      summary: t(
        "Reading a character that has more than one reading by what it means in its word, and finding the word for a reading.",
        "多音字：按字在词语里的意思定读音，按读音找出词语。",
      ),
      intro: t(
        "Some characters have more than one reading, and each reading goes with its own meaning. 长 is cháng when it means long, as in 长江, and zhǎng when it means to grow or the head of something, as in 长大 and 班长.\n\nSo the meaning in the word tells the reading. The first knowledge point reads a character in a word, the second finds the word in which it has a given reading.",
        "有的字不止一个读音，每个读音有自己的意思。比如“长”，说东西长的时候读 cháng，像“长江”；说生长或者带头的人的时候读 zhǎng，像“长大”“班长”。\n\n所以，看字在词语里是什么意思，就知道读什么。第一个知识点读出字在词语里的读音，第二个按读音找出词语。",
      ),
      prerequisites: ["dictionary-words"],
      encompasses: [],
      xp: 12,
      strand: "characters",
      knowledgePoints: [
        point(
          "language-4-polyphones-word",
          t("The Reading in a Word", "词语里的读音"),
          t(
            "To read a character of several readings, ask what it means in its word, and take the reading that goes with that meaning.\n\n行 is xíng, to walk, and háng, a row or a trade. In 银行, a bank, it is the trade: háng.\n\n> **Watch out.** The reading you meet most is not always the right one. 好 is mostly hǎo, but in 爱好, what one is fond of, it is hào.",
            "读多音字，先想想它在词语里是什么意思，再选和这个意思对应的读音。\n\n比如“行”，读 xíng 是走，读 háng 是行列、行业。“银行”的“行”是行业，读 háng。\n\n> **注意。** 最常见的读音不一定就对。“好”多数时候读 hǎo，可在“爱好”里是喜爱的意思，读 hào。",
          ),
          choiceTopicGenerator(inWord, {
            find: t("**Step 1: recall the readings and their meanings.**", "**第一步：想一想几个读音和它们的意思。**"),
            choose: t("**Step 2: choose by the meaning in the word.**", "**第二步：按词语里的意思选读音。**"),
          }),
        ),
        point(
          "language-4-polyphones-meaning",
          t("The Meaning by the Reading", "按读音辨意思"),
          t(
            "A reading points to a meaning. Given a reading, recall what the character means when so read, then find the word in which it has that meaning.\n\n种 read zhòng means to plant: 种树, to plant trees, not 种子, a seed, where it is zhǒng.\n\n> **Watch out.** The words may look alike: 背书包 and 背课文 both have 背 before a thing, but one carries it, bēi, and one recites it, bèi.",
            "读音和意思是连在一起的。知道了读音，先想想这个读音是什么意思，再找出字在哪个词里是这个意思。\n\n比如“种”读 zhòng 是种植的意思：“种树”是；“种子”的“种”读 zhǒng，不是。\n\n> **注意。** 词语样子可能很像：“背书包”和“背课文”都是“背”加东西，可一个是驮着，读 bēi；一个是背诵，读 bèi。",
          ),
          choiceTopicGenerator(byReading, {
            find: t("**Step 1: recall what each reading means.**", "**第一步：想一想每个读音的意思。**"),
            choose: t("**Step 2: find the word with that meaning.**", "**第二步：找出是这个意思的词。**"),
          }),
        ),
      ],
    },
  },
];
