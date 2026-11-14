// Phonics: the letters. Capital and small letters as one letter, the order of the alphabet, and the first and last
// letters of the words for pictures.

import { type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, type OrderItem, orderGenerator, point } from "@ga/subject-english";
import { caps, type PictureItem, phonicsTopic, pictureChoice, spellings } from "./kit.ts";
import { allPictureWords, picture } from "./pictures.ts";

const alphabet = [..."abcdefghijklmnopqrstuvwxyz"];

/** lookAlikes are, for each small letter, two pairs of letters a beginner mixes it up with. */
const lookAlikes: Record<string, readonly [readonly [string, string], readonly [string, string]]> = {
  a: [
    ["o", "e"],
    ["d", "q"],
  ],
  b: [
    ["d", "p"],
    ["q", "h"],
  ],
  c: [
    ["e", "o"],
    ["s", "a"],
  ],
  d: [
    ["b", "q"],
    ["p", "a"],
  ],
  e: [
    ["c", "a"],
    ["o", "s"],
  ],
  f: [
    ["t", "l"],
    ["j", "r"],
  ],
  g: [
    ["q", "y"],
    ["p", "j"],
  ],
  h: [
    ["n", "b"],
    ["k", "u"],
  ],
  i: [
    ["j", "l"],
    ["t", "r"],
  ],
  j: [
    ["i", "g"],
    ["y", "l"],
  ],
  k: [
    ["h", "x"],
    ["l", "t"],
  ],
  l: [
    ["i", "t"],
    ["j", "f"],
  ],
  m: [
    ["n", "w"],
    ["u", "h"],
  ],
  n: [
    ["m", "h"],
    ["u", "r"],
  ],
  o: [
    ["a", "c"],
    ["e", "q"],
  ],
  p: [
    ["q", "b"],
    ["d", "g"],
  ],
  q: [
    ["p", "g"],
    ["d", "b"],
  ],
  r: [
    ["n", "f"],
    ["t", "v"],
  ],
  s: [
    ["z", "e"],
    ["x", "a"],
  ],
  t: [
    ["f", "l"],
    ["i", "j"],
  ],
  u: [
    ["n", "v"],
    ["w", "y"],
  ],
  v: [
    ["u", "y"],
    ["w", "x"],
  ],
  w: [
    ["m", "v"],
    ["u", "n"],
  ],
  x: [
    ["y", "z"],
    ["v", "w"],
  ],
  y: [
    ["v", "g"],
    ["j", "x"],
  ],
  z: [
    ["s", "x"],
    ["n", "y"],
  ],
};

const pairsOf = (letter: string) => {
  const pairs = lookAlikes[letter];
  if (!pairs) throw new Error(`no look-alikes for ${letter}`);
  return pairs;
};

/** pairAt gives the first or the second pair of look-alikes of a letter. */
const pairAt = (letter: string, n: number) => {
  const [a, b] = pairsOf(letter);
  return n % 2 === 0 ? a : b;
};

for (const letter of alphabet)
  for (const pair of pairsOf(letter)) if (pair.includes(letter)) throw new Error(`${letter} looks like itself`);

// Capital and small letters.

const capitalToSmall: readonly ChoiceItem[] = [0, 1].flatMap((set) =>
  alphabet.map((letter): ChoiceItem => [`**${caps(letter)}**`, letter, pairAt(letter, set)]),
);

const sameLetterWhy = (right: string) =>
  t(
    `**${caps(right)}** and **${right}** are the capital and the small form of the same letter. Capitals start names and sentences; most letters in a word are small.`,
    `**${caps(right)}** 和 **${right}** 是同一个字母的大写和小写。大写字母用在名字和句子的开头；一个词里的大多数字母是小写。`,
  );

const smallWhyNot = (wrong: string) =>
  t(
    `**${wrong}** is a different letter: its capital is **${caps(wrong)}**. Look at which way it faces and whether it has a stick or a tail.`,
    `**${wrong}** 是另一个字母，它的大写是 **${caps(wrong)}**。看看它朝哪边，有没有竖线或尾巴。`,
  );

const wordsInCapitals: readonly ChoiceItem[] = [0, 1].flatMap((set) =>
  spellings.map(
    (s): ChoiceItem => [
      `**${s.word}**`,
      caps(s.word),
      [caps(set === 0 ? s.vowel[0] : s.vowel[1]), caps(set === 0 ? s.first[0] : s.last[0])],
    ],
  ),
);

const capitals = phonicsTopic({
  id: "capital-and-small-letters",
  title: t("Capital and Small Letters", "大写字母和小写字母"),
  summary: t(
    "Every letter has a capital and a small form: matching the two, alone and in words.",
    "每个字母都有大写和小写两种形式：单个字母和词中的大小写配对。",
  ),
  prerequisites: [],
  xp: 8,
  knowledgePoints: [
    point(
      "matching-capital-and-small-letters",
      t("Matching a Capital to Its Small Letter", "大写字母配小写字母"),
      t(
        "Every letter can be written two ways: as a capital, such as **B**, and as a small letter, such as **b**. Some pairs look alike, such as **O** and **o**; others look quite different, such as **G** and **g**.\n\nTake care with **b**, **d**, **p** and **q**: they are the same shape turned around. **b** has its stick on the left and its round part on the right, like the capital **B**.",
        "每个字母都有两种写法：大写，比如 **B**；小写，比如 **b**。有的大小写长得很像，比如 **O** 和 **o**；有的差别很大，比如 **G** 和 **g**。\n\n要特别注意 **b**、**d**、**p** 和 **q**：它们是同一个形状转了方向。**b** 的竖线在左边，圆圈在右边，和大写 **B** 一样。",
      ),
      choiceGenerator(
        t("Which small letter is the same letter as this capital?", "哪个小写字母和这个大写字母是同一个字母？"),
        capitalToSmall,
        sameLetterWhy,
        smallWhyNot,
      ),
    ),
    point(
      "words-in-capitals",
      t("Words in Capital Letters", "大写字母写的词"),
      t(
        "A word can be written all in capitals, as on a sign: **cat** and **CAT** are the same word. To match them, check the letters one at a time, from left to right.",
        "一个词可以全部用大写字母写，就像路牌上那样：**cat** 和 **CAT** 是同一个词。配对时，从左到右一个字母一个字母地核对。",
      ),
      choiceGenerator(t("Which word in capitals is the same word?", "哪个大写的词和它是同一个词？"), wordsInCapitals, (right, shown) =>
        t(
          `${shown} in capitals is **${right}**: each letter changes to its capital, one by one.`,
          `${shown} 写成大写就是 **${right}**：每个字母逐一换成大写。`,
        ),
      ),
    ),
  ],
});

// The order of the alphabet.

const nextLetter: readonly ChoiceItem[] = [false, true].flatMap((capital) =>
  alphabet.slice(0, 22).map((_, i): ChoiceItem => {
    const shown = alphabet.slice(i, i + 3);
    const right = alphabet[i + 3] ?? "";
    const skip = alphabet[i + 4] ?? "";
    const alike = pairsOf(right)
      .flat()
      .find((l) => l !== skip && !shown.includes(l));
    if (!alike) throw new Error(`no look-alike of ${right} to offer`);
    const show = (l: string) => (capital ? caps(l) : l);
    return [`${shown.map(show).join(", ")}, …`, show(right), [show(skip), show(alike)]];
  }),
);

const abcWhy = (right: string, shown: string) =>
  t(
    `Say the alphabet from the start of the list: ${shown.replace(", …", "")}, **${right}**. The next letter is **${right}**.`,
    `从列表开头念字母表：${shown.replace(", …", "")}，**${right}**。下一个字母是 **${right}**。`,
  );

const firstLetters = (words: readonly string[]) => new Set(words.map((w) => w[0])).size === words.length;

const triples: readonly (readonly string[])[] = (() => {
  const n = allPictureWords.length;
  const seen = new Set<string>();
  const out: (readonly string[])[] = [];
  for (const step of [5, 11, 17]) {
    for (let i = 0; i < n && out.length < 60; i++) {
      const words = [allPictureWords[i], allPictureWords[(i + step) % n], allPictureWords[(i + 2 * step + 3) % n]].filter(
        (w): w is string => w !== undefined,
      );
      if (words.length !== 3 || !firstLetters(words)) continue;
      const sorted = [...words].sort();
      const key = sorted.join();
      if (seen.has(key)) continue;
      seen.add(key);
      out.push(sorted);
    }
  }
  return out;
})();

if (triples.length < 40) throw new Error(`only ${triples.length} sets of words to put in order`);

const abcWords: readonly OrderItem[] = triples.map((words) => ({ sentences: words }));

const alphabeticalOrder = phonicsTopic({
  id: "alphabetical-order",
  title: t("ABC Order", "字母表顺序"),
  summary: t(
    "The order of the alphabet: the letter that comes next, and words put in order by their first letter.",
    "字母表的顺序：下一个字母是什么，以及按首字母给词排序。",
  ),
  prerequisites: ["capital-and-small-letters"],
  encompasses: [{ topic: "capital-and-small-letters", weight: 0.2 }],
  xp: 8,
  knowledgePoints: [
    point(
      "the-next-letter",
      t("The Next Letter", "下一个字母"),
      t(
        "The 26 letters always come in the same order, from **a** to **z**: a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z. Capitals come in the same order. To find the next letter, say the alphabet up to the last letter shown, then say one more.",
        "26 个字母总是按同样的顺序排列，从 **a** 到 **z**：a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z。大写字母的顺序也一样。要找下一个字母，就把字母表念到列出的最后一个字母，再多念一个。",
      ),
      choiceGenerator(t("Which letter comes next?", "下一个字母是哪个？"), nextLetter, abcWhy),
    ),
    point(
      "words-in-abc-order",
      t("Words in ABC Order", "按字母表顺序排词"),
      t(
        "Words in a dictionary or a list are in **ABC order**: they go in the order of their first letters. *bed* comes before *cat* because **b** comes before **c** in the alphabet. Look at the first letter of each word, then put the words in the order of the alphabet.",
        "词典或名单里的词按**字母表顺序**排列：按它们的首字母排序。*bed* 排在 *cat* 前面，因为在字母表里 **b** 在 **c** 前面。先看每个词的首字母，再按字母表的顺序排列。",
      ),
      orderGenerator(t("Put the words in ABC order.", "把这些词按字母表顺序排列。"), abcWords, (right) =>
        t(
          `In ABC order: ${right.split(" ").join(", ")}. Their first letters, ${right
            .split(" ")
            .map((w) => `**${w[0]}**`)
            .join(", ")}, come in that order in the alphabet.`,
          `按字母表顺序：${right.split(" ").join("、")}。它们的首字母 ${right
            .split(" ")
            .map((w) => `**${w[0]}**`)
            .join("、")} 在字母表里就是这个顺序。`,
        ),
      ),
    ),
  ],
});

// First and last letters of picture words.

const firstLetterItems: readonly PictureItem[] = spellings.map((s, i) => {
  const letter = s.word[0] ?? "";
  return {
    word: s.word,
    right: letter,
    wrong: pairAt(letter, i),
    solution: t(
      `${picture(s.word).alt.en} The word is **${s.word}**, and it begins with **${letter}**.`,
      `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**，它以 **${letter}** 开头。`,
    ),
  };
});

const lastLetterItems: readonly PictureItem[] = spellings.map((s, i) => {
  const letter = s.word[2] ?? "";
  return {
    word: s.word,
    extra: `**${s.word.slice(0, 2)} _**`,
    right: letter,
    wrong: pairAt(letter, i + 1),
    solution: t(
      `${picture(s.word).alt.en} The word is **${s.word}**, and it ends with **${letter}**.`,
      `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**，它以 **${letter}** 结尾。`,
    ),
  };
});

const firstAndLast = phonicsTopic({
  id: "first-and-last-letters",
  title: t("First and Last Letters", "首字母和尾字母"),
  summary: t("The letter a picture's word begins with, and the letter it ends with.", "图片所表示的词以哪个字母开头、以哪个字母结尾。"),
  prerequisites: ["capital-and-small-letters"],
  encompasses: [{ topic: "capital-and-small-letters", weight: 0.2 }],
  xp: 8,
  knowledgePoints: [
    point(
      "the-first-letter",
      t("The First Letter", "首字母"),
      t(
        "Say the name of the picture slowly and listen to its first sound: *sss-un*. The first sound of *sun* is written with the letter **s**. An adult can say the word with you.",
        "慢慢说出图片的名称，听它的第一个音：*sss-un*。*sun* 的第一个音用字母 **s** 来写。可以请大人和你一起说这个词。",
      ),
      pictureChoice(t("Which letter does the word for this picture begin with?", "这张图片表示的词以哪个字母开头？"), firstLetterItems),
    ),
    point(
      "the-last-letter",
      t("The Last Letter", "尾字母"),
      t(
        "Now listen to the end of the word: *ca-t*. The last sound of *cat* is written with the letter **t**. Say the whole word, then say it again and stop on the last sound.",
        "现在听词的结尾：*ca-t*。*cat* 的最后一个音用字母 **t** 来写。先说整个词，再说一遍，停在最后一个音上。",
      ),
      pictureChoice(
        t("Which letter is missing at the end of the word for this picture?", "这张图片表示的词结尾缺了哪个字母？"),
        lastLetterItems,
      ),
    ),
  ],
});

/** letterTopics are the phonics topics of the letters. */
export const letterTopics: readonly TopicDef[] = [capitals, alphabeticalOrder, firstAndLast];
