// The pinyin alphabet of grade 1 (docs/chinese-curriculum.md §18.9): the 26 letters of the Scheme for the Chinese
// Phonetic Alphabet in their order, and each letter's capital and small form. The order is what dictionaries sort by.

import { type Text, type TopicDef, t } from "@ga/content";
import { type ChoiceItem, choiceGenerator, point } from "@ga/subject-chinese";

/** LETTERS are the small letters of the pinyin alphabet, in order. */
const LETTERS = [..."abcdefghijklmnopqrstuvwxyz"];

/** upper is the capital of a small letter. */
const upper = (letter: string): string => letter.toUpperCase();

/** place is the place of a letter in the alphabet, counting from 1. */
const place = (letter: string): number => LETTERS.indexOf(letter.toLowerCase()) + 1;

/** gapItems are four letters in a row with one left out, after the first: the letter left out, and the two around the row. */
const gapItems: readonly ChoiceItem[] = LETTERS.slice(0, 23).map((_, i) => {
  const row = LETTERS.slice(i, i + 4);
  const gap = (i % 3) + 1;
  const shown = row.map((l, k) => (k === gap ? "＿" : l)).join(" ");
  const before = LETTERS[i - 1];
  const after = LETTERS[i + 4];
  const wrong = [before ?? LETTERS[i + 5]!, after ?? LETTERS[i - 2]!];
  return [shown, row[gap]!, wrong] as const;
});

/** LOOK_ALIKE are, for each small letter, two letters a child may take for it. */
const LOOK_ALIKE: Readonly<Record<string, readonly [string, string]>> = {
  a: ["o", "e"],
  b: ["d", "p"],
  c: ["e", "o"],
  d: ["b", "q"],
  e: ["c", "a"],
  f: ["t", "l"],
  g: ["q", "j"],
  h: ["n", "k"],
  i: ["j", "l"],
  j: ["i", "g"],
  k: ["h", "x"],
  l: ["i", "t"],
  m: ["n", "w"],
  n: ["m", "h"],
  o: ["a", "c"],
  p: ["q", "b"],
  q: ["p", "g"],
  r: ["n", "v"],
  s: ["z", "x"],
  t: ["f", "l"],
  u: ["n", "v"],
  v: ["u", "w"],
  w: ["v", "m"],
  x: ["k", "y"],
  y: ["v", "j"],
  z: ["s", "x"],
};

/** caseItems are each letter shown as a capital, to be matched with its small form, and shown small, to be matched with its capital. */
const caseItems: readonly ChoiceItem[] = LETTERS.flatMap((l): readonly ChoiceItem[] => {
  const [x, y] = LOOK_ALIKE[l]!;
  return [
    [upper(l), l, [x, y]],
    [l, upper(l), [upper(x), upper(y)]],
  ];
});

/** isCapital tells whether a letter is a capital. */
const isCapital = (letter: string): boolean => letter !== letter.toLowerCase();

/** orderWhy works a gap of the alphabet: say the letters up to it, then check the letters on both sides. */
const orderWhy = (right: string, shown: string): Text => {
  const k = place(right);
  const prev = LETTERS[k - 2]!;
  const next = LETTERS[k]!;
  return t(
    `**Step 1: say the alphabet up to the row.** The row is ${shown}. Say the letters in order from a, and stop where the row is.\n\n**Step 2: find the letter between.** The gap comes after ${prev} and before ${next}: the letter there is ${right}, letter ${k} of the alphabet.\n\n**Check.** Say the row with ${right} in the gap: ${shown.replace("＿", right)}. Each letter follows the one before it.`,
    `**第一步：按顺序背到这一行。**这一行是 ${shown}。从 a 开始按顺序背字母表，背到这几个字母。\n\n**第二步：找出中间的字母。**空着的地方在 ${prev} 后面、${next} 前面，那里的字母是 ${right}，字母表里第 ${k} 个。\n\n**检验。** 把 ${right} 填进去读一遍：${shown.replace("＿", right)}，每个字母都紧跟着前一个。`,
  );
};

/** orderWhyNot says where a wrong letter stands, before or after the row. */
const orderWhyNot = (wrong: string, right: string): Text => {
  const before = place(wrong) < place(right);
  return t(
    `${wrong} is letter ${place(wrong)}: it comes ${before ? "before" : "after"} this row, not in its gap.`,
    `${wrong} 是第 ${place(wrong)} 个字母，在这一行的${before ? "前面" : "后面"}，不在空着的地方。`,
  );
};

/** caseWhy works a letter's other form: name the letter, then write the form asked for. */
const caseWhy = (right: string, shown: string): Text => {
  const capital = isCapital(shown);
  const [en, zh] = capital ? ["small", "小写"] : ["capital", "大写"];
  const [enShown, zhShown] = capital ? ["capital", "大写"] : ["small", "小写"];
  return t(
    `**Step 1: name the letter.** ${shown} is the ${enShown} form of letter ${place(shown)}, ${shown.toLowerCase()}.\n\n**Step 2: write its ${en} form.** The ${en} form of the same letter is ${right}.\n\n**Check.** Say the alphabet to letter ${place(shown)}, once in capitals and once in small letters: both stop at the same letter, ${upper(right)} and ${right.toLowerCase()}.`,
    `**第一步：认出这个字母。**${shown} 是字母表里第 ${place(shown)} 个字母的${zhShown}。\n\n**第二步：写出它的${zh}。**同一个字母的${zh}是 ${right}。\n\n**检验。** 按大写和小写各背一遍字母表，背到第 ${place(shown)} 个：都停在同一个字母上，${upper(right)} 和 ${right.toLowerCase()}。`,
  );
};

/** caseWhyNot says which letter a look-alike is. */
const caseWhyNot = (wrong: string, right: string): Text =>
  t(
    `${wrong} looks a little like it, but it is letter ${place(wrong)}, not letter ${place(right)}.`,
    `${wrong} 看起来有点像，可它是第 ${place(wrong)} 个字母，不是第 ${place(right)} 个。`,
  );

/** pinyinAlphabet is the topic of the pinyin alphabet of grade 1. */
export const pinyinAlphabet: TopicDef = {
  id: "pinyin-alphabet",
  title: t("The Pinyin Alphabet", "汉语拼音字母表"),
  summary: t(
    "The 26 letters of the pinyin alphabet in their order, and each letter's capital and small form.",
    "汉语拼音字母表的 26 个字母：按顺序记住它们，认识每个字母的大写和小写。",
  ),
  intro: t(
    "The pinyin alphabet has 26 letters in a fixed order: a b c d e f g, h i j k l m n, o p q, r s t, u v w x y z. Each letter has two forms: a capital, such as A, and a small letter, such as a. Dictionaries put syllables in this order, so knowing it lets you find a syllable quickly.\n\nThe first knowledge point fills a gap in a row of letters, the second matches each letter's capital and small form.",
    "汉语拼音字母表有 26 个字母，顺序是固定的：a b c d e f g，h i j k l m n，o p q，r s t，u v w x y z。每个字母有两种写法：大写，比如 A；小写，比如 a。字典里的音节就是按这个顺序排的，记住了顺序，查字典就快。\n\n第一个知识点填出一行字母里空着的那个，第二个认识每个字母的大写和小写。",
  ),
  prerequisites: ["pinyin-spelling"],
  encompasses: [],
  xp: 10,
  strand: "pinyin",
  knowledgePoints: [
    point(
      "pinyin-alphabet-order",
      t("The Letters in Order", "字母的顺序"),
      t(
        "Learn the alphabet in its groups, the way it is sung: a b c d e f g, h i j k l m n, o p q, r s t, u v w x y z. To find a missing letter, say the letters in order up to it.\n\nIn k l ＿ n, say …j, k, l: the next is m, and n follows it.\n\n> **Watch out.** Look at the letters on both sides of the gap. The letter that comes just before the row, or just after it, is not the one in the gap.",
        "字母表可以分组记，像唱歌一样：a b c d e f g，h i j k l m n，o p q，r s t，u v w x y z。要找空着的字母，就按顺序背到那里。\n\n比如 k l ＿ n，背到“……j，k，l”，下一个是 m，m 后面才是 n。\n\n> **注意。** 要看空着的地方两边的字母。紧挨在这一行前面或者后面的字母，都不是空着的那个。",
      ),
      choiceGenerator(t("Which letter fills the gap?", "空着的地方是哪个字母？"), gapItems, orderWhy, orderWhyNot),
    ),
    point(
      "pinyin-alphabet-case",
      t("Capital and Small Letters", "大写字母和小写字母"),
      t(
        "Each letter has a capital and a small form. Many look alike, such as C and c, O and o; others differ, such as A and a, G and g, Q and q. Match them by their place in the alphabet.\n\nG is letter 7, so its small form is g, letter 7 too.\n\n> **Watch out.** b, d, p and q are the same shape turned round. b is letter 2, d letter 4, p letter 16 and q letter 17: their capitals are B, D, P and Q.",
        "每个字母都有大写和小写。有的样子差不多，比如 C 和 c、O 和 o；有的不一样，比如 A 和 a、G 和 g、Q 和 q。可以按它们在字母表里的位置来配。\n\n比如 G 是第 7 个字母，它的小写就是同样第 7 个的 g。\n\n> **注意。** b、d、p、q 的样子像是同一个形状转了方向。b 是第 2 个，d 是第 4 个，p 是第 16 个，q 是第 17 个，它们的大写是 B、D、P、Q。",
      ),
      choiceGenerator(
        t(
          "Which is the same letter in its other form, small for a capital and capital for a small letter?",
          "哪一个是同一个字母的另一种写法（大写配小写，小写配大写）？",
        ),
        caseItems,
        caseWhy,
        caseWhyNot,
      ),
    ),
  ],
};
