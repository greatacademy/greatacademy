// The words that check the reading of a one-character word (docs/chinese-curriculum.md §8.3): another word that has
// the character with the same syllable, so that the check reads the character in a second place instead of repeating
// the answer. They come from the words of the nine levels, the lowest level first; a character no other level word has
// in that syllable takes a common word or phrase written here.

import { joinPinyin, spokenSyllables } from "@ga/subject-chinese";

import { wordBatches as levelTwo } from "../level-2/word-data.ts";
import { wordBatches as levelThree } from "../level-3/word-data.ts";
import { wordBatchesA as levelFourA } from "../level-4/word-data-a.ts";
import { wordBatchesB as levelFourB } from "../level-4/word-data-b.ts";
import { wordBatchesA as levelFiveA } from "../level-5/word-data-a.ts";
import { wordBatchesB as levelFiveB } from "../level-5/word-data-b.ts";
import { wordBatchesA as levelSixA } from "../level-6/word-data-a.ts";
import { wordBatchesB as levelSixB } from "../level-6/word-data-b.ts";
import { wordBatches1 as levelSeven1 } from "../level-7/data-1.ts";
import { wordBatches2 as levelSeven2 } from "../level-7/data-2.ts";
import { wordBatches3 as levelSeven3 } from "../level-7/data-3.ts";
import { wordBatches4 as levelSeven4 } from "../level-7/data-4.ts";
import { wordBatches1 as levelEight1 } from "../level-8/data-1.ts";
import { wordBatches2 as levelEight2 } from "../level-8/data-2.ts";
import { wordBatches3 as levelEight3 } from "../level-8/data-3.ts";
import { wordBatches4 as levelEight4 } from "../level-8/data-4.ts";
import { wordBatches1 as levelNine1 } from "../level-9/data-1.ts";
import { wordBatches2 as levelNine2 } from "../level-9/data-2.ts";
import { wordBatches3 as levelNine3 } from "../level-9/data-3.ts";
import { wordBatches4 as levelNine4 } from "../level-9/data-4.ts";
import { dataLines } from "./kit.ts";
import { wordBatches as levelOne } from "./word-data.ts";

/** Companion is a word that has a character in a syllable: the word and its pinyin as said. */
export interface Companion {
  readonly word: string;
  readonly pinyin: string;
}

/** WRITTEN holds a word or phrase for each one-character level word whose syllable no other level word has. */
const WRITTEN: Readonly<Record<string, string>> = {
  "谁 shéi": "是谁 | shì shéi",
  "都 dōu": "全都 | quándōu",
  "吗 ma": "好吗 | hǎo ma",
  "几 jǐ": "几个 | jǐ gè",
  "吧 ba": "好吧 | hǎo ba",
  "呢 ne": "你呢 | nǐ ne",
  "又 yòu": "又来 | yòu lái",
  "辆 liàng": "车辆 | chēliàng",
  "啊 a": "好啊 | hǎo a",
  "呀 ya": "快呀 | kuài ya",
  "却 què": "冷却 | lěngquè",
  "埋 mái": "埋葬 | máizàng",
  "娶 qǔ": "娶亲 | qǔqīn",
  "咸 xián": "咸菜 | xiáncài",
  "喊 hǎn": "喊叫 | hǎnjiào",
  "俩 liǎ": "我俩 | wǒ liǎ",
  "躺 tǎng": "躺椅 | tǎngyǐ",
  "脏 zāng": "脏话 | zānghuà",
  "吨 dūn": "吨位 | dūnwèi",
  "盯 dīng": "紧盯 | jǐn dīng",
  "钉 dìng": "钉扣子 | dìng kòuzi",
  "镍 niè": "镍币 | nièbì",
  "钴 gǔ": "钴蓝 | gǔlán",
  "箫 xiāo": "洞箫 | dòngxiāo",
  "酷 kù": "残酷 | cánkù",
  "贰 èr": "贰拾 | èrshí",
  "叁 sān": "叁拾 | sānshí",
  "哦 ò": "哦，是这样 | ò, shì zhèyàng",
  "哇 wā": "哇哇 | wāwā",
  "嘛 ma": "就是嘛 | jiùshì ma",
  "啦 la": "好啦 | hǎo la",
  "啥 shá": "干啥 | gàn shá",
  "咱 zán": "咱们 | zánmen",
  "俺 ǎn": "俺们 | ǎnmen",
  "扒 bā": "扒开 | bā kāi",
};

/** LEVELS lists the word batches of each level, level 1 first. */
const LEVELS: readonly (readonly { readonly data: string }[])[] = [
  levelOne,
  levelTwo,
  levelThree,
  [...levelFourA, ...levelFourB],
  [...levelFiveA, ...levelFiveB],
  [...levelSixA, ...levelSixB],
  [...levelSeven1, ...levelSeven2, ...levelSeven3, ...levelSeven4],
  [...levelEight1, ...levelEight2, ...levelEight3, ...levelEight4],
  [...levelNine1, ...levelNine2, ...levelNine3, ...levelNine4],
];

/** INDEX maps a character and its syllable as said to the words of two or more characters that have it, by level. */
const INDEX: ReadonlyMap<string, readonly (Companion & { readonly level: number })[]> = (() => {
  const index = new Map<string, (Companion & { level: number })[]>();
  for (const [i, batches] of LEVELS.entries()) {
    for (const batch of batches) {
      for (const line of dataLines(batch.data)) {
        const [word = "", pinyin = ""] = line.split(" | ");
        const chars = [...word];
        if (chars.length < 2) continue;
        const syllables = spokenSyllables(
          word,
          pinyin.split(" ").map((s) => s.normalize("NFC")),
        );
        for (const [k, ch] of chars.entries()) {
          const key = `${ch} ${syllables[k]}`;
          const list = index.get(key) ?? [];
          if (!list.some((c) => c.word === word)) list.push({ word, pinyin: joinPinyin(syllables), level: i + 1 });
          index.set(key, list);
        }
      }
    }
  }
  return index;
})();

/**
 * companionOf finds another word with the one character of `word` read `syllable`: a word of `level` or below first,
 * then a word of a higher level, then the word or phrase written for it here; it throws when there is none.
 */
export function companionOf(word: string, syllable: string, level: number): Companion {
  const key = `${word} ${syllable}`;
  const found = INDEX.get(key) ?? [];
  const pick = found.find((c) => c.level <= level) ?? found[0];
  if (pick) return { word: pick.word, pinyin: pick.pinyin };
  const written = WRITTEN[key];
  if (!written) throw new Error(`level ${level} words: no other word reads ${word} ${syllable}`);
  const [phrase = "", pinyin = ""] = written.split(" | ");
  return { word: phrase, pinyin };
}
