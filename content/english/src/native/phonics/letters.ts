// Phonics: the letters. Capital and small letters as one letter, the order of the alphabet, and the first and last
// letters of the words for pictures.

import { type Text, type TopicDef, t } from "@ga/content";
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

/** letterShape describes how each small letter looks so learners can tell look-alikes apart. */
const letterShape: Record<string, Text> = {
  a: t("a round body with a short back on the right", "左边是圆肚子，右边有一小段竖背"),
  b: t("a tall stick on the left and a round belly on the right", "高竖线在左边，圆肚子朝右边"),
  c: t("a round curve that stays open on the right", "一条向右边开口的圆弧"),
  d: t("a round belly on the left and a tall stick on the right", "圆肚子在左边，高竖线在右边"),
  e: t("a curve with a short bar across the middle", "圆弧中间有一道短横"),
  f: t("a tall hook curving at the top with a cross bar", "顶部向右弯成钩，中间有一横"),
  g: t("a round top with a tail that hooks left below the line", "上面是圆圈，下面有向左弯的尾巴"),
  h: t("a tall stick on the left with one low hump on the right", "左边一根高竖线，右边一个矮拱门"),
  i: t("a short straight stick with a dot on top", "一根短竖线，头顶一个小圆点"),
  j: t("a curved tail below the line with a dot on top", "向下弯出尾巴，头顶一个小圆点"),
  k: t("a tall stick on the left with two slanted arms on the right", "左边一根高竖线，右边两条斜线"),
  l: t("one tall straight stick with no dot and no cross bar", "一根高高的直竖线，没有点也没有横"),
  m: t("two low humps side by side", "并排两个矮拱门"),
  n: t("one low hump with a short stick on the left", "左边一短竖，右边一个矮拱门"),
  o: t("one closed round circle", "一个完全合拢的圆圈"),
  p: t("a tail going down on the left and a round belly on the right", "竖尾巴在左边向下伸，圆肚子在右边"),
  q: t("a round belly on the left and a tail going down on the right", "圆肚子在左边，竖尾巴在右边向下伸"),
  r: t("a short stick with a small branch at the top right", "一短竖，右上角伸出一小段弧"),
  s: t("two smooth curves like a winding snake", "像小蛇一样上下两道弯"),
  t: t("a tall straight stick with a cross bar near the top", "一根直竖线，上方有一道横"),
  u: t("a cup open at the top", "像小杯子一样朝上开口"),
  v: t("two straight slanted lines meeting in a sharp point at the bottom", "两条斜线在底部汇成一个尖角"),
  w: t("two sharp points side by side at the bottom", "底部并排两个尖角"),
  x: t("two straight slanted lines crossing in the middle", "两条斜线在正中间交叉"),
  y: t("two slanted lines at the top with a tail going down", "上面是斜叉，下面伸出一条尾巴"),
  z: t("a top bar, a slanted line down, and a bottom bar", "上面一横、中间一斜、下面一横"),
};

/** sampleWord pairs each small letter with a familiar word used to check capital-to-small matches in context. */
const sampleWord: Record<string, string> = {
  a: "ant",
  b: "bat",
  c: "cat",
  d: "dog",
  e: "egg",
  f: "fox",
  g: "goat",
  h: "hat",
  i: "ink",
  j: "jam",
  k: "kite",
  l: "log",
  m: "map",
  n: "net",
  o: "owl",
  p: "pig",
  q: "queen",
  r: "rat",
  s: "sun",
  t: "top",
  u: "up",
  v: "van",
  w: "web",
  x: "box",
  y: "yes",
  z: "zoo",
};

/** shapeOf returns the shape description of a small letter. */
const shapeOf = (letter: string): Text => {
  const shape = letterShape[letter];
  if (!shape) throw new Error(`no shape for ${letter}`);
  return shape;
};

/** ordinal formats a 1-based alphabet position in English: 1st, 2nd, 3rd, 4th, … */
const ordinal = (n: number): string => {
  const mod100 = n % 100;
  if (mod100 >= 11 && mod100 <= 13) return `${n}th`;
  const mod10 = n % 10;
  if (mod10 === 1) return `${n}st`;
  if (mod10 === 2) return `${n}nd`;
  if (mod10 === 3) return `${n}rd`;
  return `${n}th`;
};

/** neighborPlace says where a letter sits in the alphabet, used to rule out a letter without naming another. */
const neighborPlace = (letter: string, capital = false): Text => {
  const i = alphabet.indexOf(letter.toLowerCase());
  if (i === -1) throw new Error(`${letter} is not in the alphabet`);
  const fmt = (l: string) => (capital ? caps(l) : l);
  if (i === 0) return t(`at the very start of the alphabet, before **${fmt("b")}**`, `在字母表的最开头，排在 **${fmt("b")}** 前面`);
  if (i === alphabet.length - 1)
    return t(`at the very end of the alphabet, after **${fmt("y")}**`, `在字母表的最末尾，排在 **${fmt("y")}** 后面`);
  const prev = fmt(alphabet[i - 1] ?? "");
  const next = fmt(alphabet[i + 1] ?? "");
  return t(`between **${prev}** and **${next}** in the alphabet`, `在字母表里排在 **${prev}** 和 **${next}** 之间`);
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

for (const letter of alphabet) {
  for (const pair of pairsOf(letter)) if (pair.includes(letter)) throw new Error(`${letter} looks like itself`);
  const word = sampleWord[letter];
  if (!word?.includes(letter)) throw new Error(`sampleWord for ${letter} must contain ${letter}`);
}

// Capital and small letters.

const capitalToSmall: readonly ChoiceItem[] = [0, 1].flatMap((set) =>
  alphabet.map((letter): ChoiceItem => [`**${caps(letter)}**`, letter, pairAt(letter, set)]),
);

const sameLetterWhy = (right: string) => {
  const shape = shapeOf(right);
  const word = sampleWord[right] ?? "";
  const atStart = word[0] === right;
  const spotEn = atStart ? "the first letter" : "the last letter";
  const spotZh = atStart ? "第一个字母" : "最后一个字母";
  return t(
    `The capital **${caps(right)}** pairs with the small letter **${right}**. Small **${right}** has ${shape.en}.\n\n**Check.** Compare *${word}* and *${caps(word)}*: **${right}** and **${caps(right)}** sit in the very same spot (${spotEn}), so they are the same letter.`,
    `大写字母 **${caps(right)}** 对应的小写字母是 **${right}**。小写 **${right}** 的字形是${shape["zh-CN"]}。\n\n**检验。** 对照 *${word}* 和 *${caps(word)}*：**${right}** 和 **${caps(right)}** 站在同一个位置（${spotZh}），所以它们是同一个字母。`,
  );
};

const smallWhyNot = (wrong: string) => {
  const shape = shapeOf(wrong);
  return t(
    `**${wrong}** is the small form of **${caps(wrong)}**, not this capital. Notice its shape: ${shape.en}.`,
    `**${wrong}** 是 **${caps(wrong)}** 的小写，不是这个大写字母的小写。看它的字形：${shape["zh-CN"]}。`,
  );
};

const wordsInCapitals: readonly ChoiceItem[] = [0, 1].flatMap((set) =>
  spellings.map(
    (s): ChoiceItem => [
      `**${s.word}**`,
      caps(s.word),
      [caps(set === 0 ? s.vowel[0] : s.vowel[1]), caps(set === 0 ? s.first[0] : s.last[0])],
    ],
  ),
);

const wordsInCapitalsWhy = (right: string, shown: string) => {
  const word = shown.replace(/\*\*/g, "");
  const toCapsEn = [...word].map((ch) => `**${ch}** → **${caps(ch)}**`).join(", ");
  const toCapsZh = [...word].map((ch) => `**${ch}** → **${caps(ch)}**`).join("、");
  const backEn = [...right].map((ch) => `**${ch}** → **${ch.toLowerCase()}**`).join(", ");
  const backZh = [...right].map((ch) => `**${ch}** → **${ch.toLowerCase()}**`).join("、");
  return t(
    `Change each letter of **${word}** to its capital from left to right: ${toCapsEn}. Putting them together gives **${right}**.\n\n**Check.** Turn each capital of **${right}** back into a small letter (${backEn}): you get **${word}** again, with every letter matching.`,
    `从左到右把 **${word}** 的每个字母依次换成大写：${toCapsZh}。合起来就是 **${right}**。\n\n**检验。** 把 **${right}** 的每个大写字母换回小写（${backZh}），正好还原成 **${word}**，每个位置都一致。`,
  );
};

const wordsInCapitalsWhyNot = (wrong: string, right: string, shown: string) => {
  const word = shown.replace(/\*\*/g, "");
  const diff = [...wrong].findIndex((ch, i) => ch !== right[i]);
  const posEn = diff === 0 ? "first" : diff === 1 ? "middle" : "last";
  const posZh = diff === 0 ? "第一" : diff === 1 ? "中间" : "最后";
  const badCap = wrong[diff] ?? "";
  const badSmall = badCap.toLowerCase();
  const origSmall = word[diff] ?? "";
  return t(
    `**${wrong}** has **${badCap}** (small **${badSmall}**) as its ${posEn} letter, so it spells *${wrong.toLowerCase()}* instead of matching the **${origSmall}** in **${word}**.`,
    `**${wrong}** 的${posZh}个字母是 **${badCap}**（小写 **${badSmall}**），拼出来是 *${wrong.toLowerCase()}*，和 **${word}** 里的 **${origSmall}** 对不上。`,
  );
};

const capitals = phonicsTopic({
  id: "capital-and-small-letters",
  title: t("Capital and Small Letters", "大写字母和小写字母"),
  summary: t(
    "Every letter has a capital and a small form: matching the two, alone and in words.",
    "每个字母都有大写和小写两种形式：单个字母和词中的大小写配对。",
  ),
  intro: t(
    "A red street sign says **STOP**. Inside a storybook, the same word is written **stop**. The big **S** and the little **s** are the same letter.\n\nEvery letter has a big **capital** shape and a little **small** shape. Names like **Sam** start with a capital, and signs often use all capitals. Let's match each capital to its small letter, then match whole words.",
    "路口的红牌子上写着 **STOP**。故事书里，同一个词写成 **stop**。大大的 **S** 和小小的 **s** 是同一个字母。\n\n每个字母都有大号和小号两种样子。像 **Sam** 这样的名字开头用大写，路牌上常常全用大写。我们先给单个大写和小写配对，再来认全大写的词。",
  ),
  prerequisites: [],
  xp: 8,
  knowledgePoints: [
    point(
      "matching-capital-and-small-letters",
      t("Matching a Capital to Its Small Letter", "大写字母配小写字母"),
      t(
        "Every letter has a big form and a small form. Some pairs look almost the same, like **O** and **o**. Others look different, like **D** and **d**.\n\nLook closely at **D**. Capital **D** has a straight line on the left and a curve on the right. Small **d** puts the round belly on the left and the tall stick on the right. They are still the same letter.\n\n> **Watch out.** Do not mix up **b**, **d**, **p**, and **q**—check which side the tall stick is on and whether the tail goes up or down.",
        "每个字母都有大写和小写两种样子。有的长得很像，比如 **O** 和 **o**；有的不太一样，比如 **D** 和 **d**。\n\n仔细看 **D**：大写 **D** 左边是一竖、右边是圆弧；小写 **d** 圆肚子在左边、高竖线在右边。它们还是同一个字母。\n\n> **注意。** 不要把 **b**、**d**、**p**、**q** 弄混，要看清竖线在哪一边、尾巴朝上还是朝下。",
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
        "A sign can write a whole word in big letters, and it is still the same word. Take **bed**. Check it one letter at a time from left to right: **b** goes to **B**, **e** goes to **E**, and **d** goes to **D**.\n\nPut those three capitals together and you get **BED**.\n\n> **Watch out.** Do not stop after the first letter—**BAD** and **BED** both start with **B**, so check the middle and last letters too.",
        "牌子上常把整个词都写成大写，它还是同一个词。拿 **bed** 来说，从左到右一个一个看：**b** 变成 **B**，**e** 变成 **E**，**d** 变成 **D**。\n\n把这三个大写字母连在一起，就是 **BED**。\n\n> **注意。** 不要只看第一个字母就选，**BAD** 和 **BED** 都是 **B** 开头，中间和最后一个字母也要核对。",
      ),
      choiceGenerator(
        t("Which word in capitals is the same word?", "哪个大写的词和它是同一个词？"),
        wordsInCapitals,
        wordsInCapitalsWhy,
        wordsInCapitalsWhyNot,
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

const abcWhy = (right: string, shown: string) => {
  const list = shown.replace(", …", "");
  const isCap = right === caps(right);
  const fmt = (l: string) => (isCap ? caps(l) : l);
  const idx = alphabet.indexOf(right.toLowerCase());
  const prev = fmt(alphabet[idx - 1] ?? "");
  const next = fmt(alphabet[idx + 1] ?? "");
  return t(
    `Say the alphabet from the start of the list: ${list}, **${right}**. The letter that follows **${prev}** with no letter skipped is **${right}**.\n\n**Check.** Keep going one more step in the alphabet: **${prev}, ${right}, ${next}**. **${right}** sits right between **${prev}** and **${next}**, so nothing was skipped.`,
    `从列表开头顺着念字母表：${list}，**${right}**。紧跟在 **${prev}** 后面、中间没有跳过的字母就是 **${right}**。\n\n**检验。** 顺着再多念一个字母：**${prev}、${right}、${next}**。**${right}** 正好夹在 **${prev}** 和 **${next}** 中间，说明没有跳字。`,
  );
};

const abcWhyNot = (wrong: string, _right: string, shown: string, position: number) => {
  const parts = shown.replace(", …", "").split(", ");
  const last = parts[parts.length - 1] ?? "";
  if (position === 0) {
    return t(
      `**${wrong}** skips over one letter after **${last}**; it comes one step later in the alphabet, not right next.`,
      `**${wrong}** 跳过了 **${last}** 后面的一个字母，它是再往后一个，不是紧挨着 **${last}** 的下一个字母。`,
    );
  }
  const isCap = wrong === caps(wrong);
  const place = neighborPlace(wrong, isCap);
  return t(
    `**${wrong}** does not come right after **${last}**; **${wrong}** sits ${place.en}.`,
    `**${wrong}** 并不紧跟在 **${last}** 后面；**${wrong}** ${place["zh-CN"]}。`,
  );
};

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

const abcWordsWhy = (right: string) => {
  const words = right.split(" ");
  const firsts = words.map((w) => w[0] ?? "");
  const nums = firsts.map((l) => alphabet.indexOf(l) + 1);
  const pairsEn = words.map((w) => `*${w}* (**${w[0]}**)`).join(", ");
  const pairsZh = words.map((w) => `*${w}*（**${w[0]}**）`).join("、");
  const chain = firsts.map((l) => `**${l}**`).join(" → ");
  const [a = "", b = "", c = ""] = firsts;
  const [na = 0, nb = 0, nc = 0] = nums;
  return t(
    `Look at the first letter of each word: ${pairsEn}. In the alphabet from **a** to **z**, those first letters come in the order ${chain}, so the words go **${words.join(", ")}**.\n\n**Check.** Count each first letter's number in the alphabet: **${a}** is ${ordinal(na)}, **${b}** is ${ordinal(nb)}, and **${c}** is ${ordinal(nc)}. The numbers ${na}, ${nb}, ${nc} go from smallest to largest, so the order is right.`,
    `先看每个词的首字母：${pairsZh}。在从 **a** 到 **z** 的字母表里，这三个首字母的先后顺序是 ${chain}，所以词的顺序是 **${words.join("、")}**。\n\n**检验。** 数一下每个首字母在字母表里的序号：**${a}** 是第 ${na}，**${b}** 是第 ${nb}，**${c}** 是第 ${nc}。序号 ${na}、${nb}、${nc} 从小到大排列，所以顺序对了。`,
  );
};

const alphabeticalOrder = phonicsTopic({
  id: "alphabetical-order",
  title: t("ABC Order", "字母表顺序"),
  summary: t(
    "The order of the alphabet: the letter that comes next, and words put in order by their first letter.",
    "字母表的顺序：下一个字母是什么，以及按首字母给词排序。",
  ),
  intro: t(
    "Three picture cards sit on the table: *apple*, *ball*, and *cup*. Their first letters are **a**, **b**, and **c**, so Mia lines them up in that order.\n\nThe 26 letters always stand in the same line from **a** to **z**. First we will find the letter that comes next, and then we will line up words by their first letter.",
    "桌子上摆着三张图片卡：*apple*、*ball* 和 *cup*。它们的首字母是 **a**、**b**、**c**，米娅把它们按这个顺序排成一排。\n\n26 个字母总是从 **a** 到 **z** 按同一条队站好。我们先找排在后面的下一个字母，再按首字母给词排队。",
  ),
  prerequisites: ["capital-and-small-letters"],
  encompasses: [{ topic: "capital-and-small-letters", weight: 0.2 }],
  xp: 8,
  knowledgePoints: [
    point(
      "the-next-letter",
      t("The Next Letter", "下一个字母"),
      t(
        "The 26 letters always go in the same order: a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z. Big letters go in the same order too.\n\nSuppose you see **f, g, h, …**. Say the alphabet softly up to **h**, then say one more letter: **i**. The next letter is **i**.\n\n> **Watch out.** Do not go too fast and skip a letter (like jumping from **h** to **j**), and do not pick a look-alike such as **l** instead of **i**.",
        "26 个字母总是按同一个顺序排：a, b, c, d, e, f, g, h, i, j, k, l, m, n, o, p, q, r, s, t, u, v, w, x, y, z。大写字母的顺序也一样。\n\n看到 **f, g, h, …** 时，轻声念到 **h**，再往后多念一个，就是 **i**。\n\n> **注意。** 不要念太快跳过一个字母（比如从 **h** 跳到 **j**），也不要把 **i** 错选成长得像的 **l**。",
      ),
      choiceGenerator(t("Which letter comes next?", "下一个字母是哪个？"), nextLetter, abcWhy, abcWhyNot),
    ),
    point(
      "words-in-abc-order",
      t("Words in ABC Order", "按字母表顺序排词"),
      t(
        "To put words in **ABC order**, look only at the **first letter** of each word. Then line up the words the way those letters stand in the alphabet.\n\nTry **dog**, **ant**, and **cup**. Their first letters are **d**, **a**, and **c**. In the alphabet, **a** comes first, then **c**, then **d**, so the words go **ant, cup, dog**.\n\n> **Watch out.** Look only at the first letter—do not sort words by how long they are or by their last letter.",
        "按**字母表顺序**排词，只要看每个词的**第一个字母**，再按字母表里的先后排好队。\n\n试一试 **dog**、**ant** 和 **cup**：它们的首字母是 **d**、**a**、**c**。字母表里 **a** 最先，接着是 **c**，最后是 **d**，所以排成 **ant、cup、dog**。\n\n> **注意。** 只看第一个字母，不要按词的长短或最后一个字母来排。",
      ),
      orderGenerator(t("Put the words in ABC order.", "把这些词按字母表顺序排列。"), abcWords, abcWordsWhy),
    ),
  ],
});

// First and last letters of picture words.

const firstLetterItems: readonly PictureItem[] = spellings.map((s, i) => {
  const letter = s.word[0] ?? "";
  const rest = s.word.slice(1);
  const wrong = pairAt(letter, i);
  const shape = shapeOf(letter);
  return {
    word: s.word,
    right: letter,
    wrong,
    solution: t(
      `${picture(s.word).alt.en} Say the word slowly: *${letter}-${rest}* (**${s.word}**). The first sound you hear is written with **${letter}** (${shape.en}).\n\n**Check.** Put **${letter}** in front of **${rest}** and read it back: **${s.word}**, which names the picture. Putting **${wrong[0]}** or **${wrong[1]}** in front would spell *${wrong[0]}${rest}* or *${wrong[1]}${rest}*, not this picture.`,
      `${picture(s.word).alt["zh-CN"]}慢慢读出这个词：*${letter}-${rest}*（**${s.word}**）。你听到的第一个音用字母 **${letter}** 来写（${shape["zh-CN"]}）。\n\n**检验。** 把 **${letter}** 放到 **${rest}** 前面再拼读一遍，就是 **${s.word}**，正好是图片里的东西；如果放 **${wrong[0]}** 或 **${wrong[1]}**，就会拼成 *${wrong[0]}${rest}* 或 *${wrong[1]}${rest}*，和图片不符。`,
    ),
    whyNot: (w) => {
      const wShape = shapeOf(w);
      return t(
        `Starting with **${w}** (${wShape.en}) would make *${w}${rest}*, which does not begin with the opening sound of the picture's word.`,
        `如果用 **${w}**（${wShape["zh-CN"]}）开头，会拼成 *${w}${rest}*，和图片词的开头音不符。`,
      );
    },
  };
});

const lastLetterItems: readonly PictureItem[] = spellings.map((s, i) => {
  const letter = s.word[2] ?? "";
  const start = s.word.slice(0, 2);
  const wrong = pairAt(letter, i + 1);
  const shape = shapeOf(letter);
  return {
    word: s.word,
    extra: `**${start} _**`,
    right: letter,
    wrong,
    solution: t(
      `${picture(s.word).alt.en} Say the word **${s.word}** and stop on the last sound: *${start}-${letter}*. The closing sound is written with **${letter}** (${shape.en}).\n\n**Check.** Fill **${letter}** into **${start} _** and read the whole word aloud: **${s.word}**, which matches the picture. Filling in **${wrong[0]}** or **${wrong[1]}** would make *${start}${wrong[0]}* or *${start}${wrong[1]}* instead.`,
      `${picture(s.word).alt["zh-CN"]}说出单词 **${s.word}**，停在最后一个音上：*${start}-${letter}*。这个尾音用字母 **${letter}** 来写（${shape["zh-CN"]}）。\n\n**检验。** 把 **${letter}** 填回 **${start} _** 的横线上再整体读一遍，就是 **${s.word}**，和图片完全一致；填 **${wrong[0]}** 或 **${wrong[1]}** 则会变成 *${start}${wrong[0]}* 或 *${start}${wrong[1]}*。`,
    ),
    whyNot: (w) => {
      const wShape = shapeOf(w);
      return t(
        `Putting **${w}** (${wShape.en}) at the end would spell *${start}${w}*, whose ending sound does not match the picture's word.`,
        `把 **${w}**（${wShape["zh-CN"]}）填在末尾会拼成 *${start}${w}*，尾音和图片词不符。`,
      );
    },
  };
});

const firstAndLast = phonicsTopic({
  id: "first-and-last-letters",
  title: t("First and Last Letters", "首字母和尾字母"),
  summary: t("The letter a picture's word begins with, and the letter it ends with.", "图片所表示的词以哪个字母开头、以哪个字母结尾。"),
  intro: t(
    "Leo picks up his school **bag** and says it slowly: *b-a-g*. The first sound he hears is **b**. The last sound he hears is **g**.\n\nEvery word starts with a first sound and stops on a last sound. Let's look at a picture, say its word, and find its first letter and its last letter.",
    "利奥拎起书包 **bag**，慢慢读出声：*b-a-g*。最先听到的音是 **b**，最后听到的音是 **g**。\n\n每个词都有一个开头音和一个结尾音。我们看着图片说出词，先找它的首字母，再找它的尾字母。",
  ),
  prerequisites: ["capital-and-small-letters"],
  encompasses: [{ topic: "capital-and-small-letters", weight: 0.2 }],
  xp: 8,
  knowledgePoints: [
    point(
      "the-first-letter",
      t("The First Letter", "首字母"),
      t(
        "Say the picture's word slowly and stretch out its first sound. Look at a picture of the **sun**: say *sss-un*. That first sound is written with **s**.\n\nAn adult can say the word with you. Then find the letter that matches that opening sound.\n\n> **Watch out.** Listen for the first sound, not the last, and check look-alike shapes such as **b** and **d**.",
        "慢慢说出图片里的词，把第一个音拉长。看到太阳 **sun** 时，读 *sss-un*，这个开头音用字母 **s** 来写。\n\n可以请大人和你一起读，再找出这个开头音对应的字母。\n\n> **注意。** 要听第一个音而不是最后一个音，还要分清 **b** 和 **d** 这样长得像的字母。",
      ),
      pictureChoice(t("Which letter does the word for this picture begin with?", "这张图片表示的词以哪个字母开头？"), firstLetterItems),
    ),
    point(
      "the-last-letter",
      t("The Last Letter", "尾字母"),
      t(
        "Now listen to the end of the word. Look at a picture of a **cat** with **ca _**. Say *cat*, then say it again and stop on the last sound: *ca-t*.\n\nThat last sound is written with **t**. Put **t** on the line and read **cat** to hear that it matches the picture.\n\n> **Watch out.** Listen for the last sound, not the first, and look closely at similar shapes such as **t** and **f**.",
        "现在听词的结尾。看到小猫 **cat** 和 **ca _** 时，先读 *cat*，再读一遍并停在最后一个音上：*ca-t*。\n\n这个尾音用字母 **t** 来写。把 **t** 填到横线上读一遍 **cat**，正好对上图片。\n\n> **注意。** 要听最后一个音而不是第一个音，还要看清 **t** 和 **f** 这样长得像的字母。",
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
