// Phonics: words with a silent e, where an e at the end makes the vowel before it say its name: *cap* and *cape*,
// *kit* and *kite*. Reading them, from a picture to its word and from a word to its picture, then spelling them: the
// vowel in the gap first, then the whole word.

import { type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import {
  letters,
  type PictureItem,
  type PicturesItem,
  phonicsTopic,
  pictureChoice,
  pictureOptions,
  pictureTyped,
  type TypedPictureItem,
} from "./kit.ts";
import { allSilentEPictureWords, picture, silentEPictureWords } from "./pictures.ts";

type Vowel = keyof typeof silentEPictureWords;

/** SilentESpellings are a picture word, its long vowel, and three near spellings: without the e, with another vowel,
 * and with the e before the last consonant. */
interface SilentESpellings {
  readonly word: string;
  readonly vowel: Vowel;
  readonly short: string;
  readonly other: string;
  readonly moved: string;
}

const rows = `
cake|cak|cike|caek
cape|cap|cupe|caep
cane|can|cune|caen
gate|gat|gute|gaet
vase|vas|vose|vaes
wave|wav|wuve|waev
rake|rak|ruke|raek
tape|tap|tipe|taep
cave|cav|cuve|caev
kite|kit|kute|kiet
bike|bik|boke|biek
hive|hiv|huve|hiev
pine|pin|pune|pien
pipe|pip|pape|piep
vine|vin|vone|vien
mice|mic|muce|miec
dice|dic|doce|diec
rice|ric|roce|riec
rope|rop|rupe|roep
rose|ros|rase|roes
nose|nos|nase|noes
bone|bon|bine|boen
cone|con|cune|coen
robe|rob|rabe|roeb
hole|hol|hile|hoel
mole|mol|mile|moel
note|not|nute|noet
cube|cub|cabe|cueb
tube|tub|tobe|tueb
mule|mul|mile|muel
`;

const vowels: readonly Vowel[] = ["a", "i", "o", "u"];

const vowelOf = (word: string): Vowel => {
  const found = vowels.find((v) => silentEPictureWords[v].includes(word));
  if (!found) throw new Error(`${word} has no silent-e picture`);
  return found;
};

const spellings: readonly SilentESpellings[] = rows
  .trim()
  .split("\n")
  .map((line) => {
    const [word = "", short = "", other = "", moved = ""] = line.split("|");
    return { word, vowel: vowelOf(word), short, other, moved };
  });

const isVowel = (c: string | undefined) => c !== undefined && "aeiou".includes(c);

for (const s of spellings) {
  const [c1, v, c2, e, ...rest] = s.word;
  if (rest.length > 0 || isVowel(c1) || v !== s.vowel || isVowel(c2) || e !== "e") {
    throw new Error(`${s.word} must be a consonant, ${s.vowel}, a consonant and e`);
  }
  if (s.short !== s.word.slice(0, 3)) throw new Error(`${s.short} must be ${s.word} without its e`);
  if (s.other.length !== 4 || s.other[1] === v || !isVowel(s.other[1]) || s.other !== `${c1}${s.other[1]}${c2}e`) {
    throw new Error(`${s.other} must change the vowel of ${s.word}`);
  }
  if (s.moved !== `${c1}${v}e${c2}`) throw new Error(`${s.moved} must put the e of ${s.word} before its last consonant`);
}
if (spellings.map((s) => s.word).join() !== allSilentEPictureWords.join()) throw new Error("spellings must follow the pictures");

const names: Record<Vowel, readonly [en: string, zh: string]> = {
  a: ["**a** says its name, as in *cake*", "**a** 读它的字母名，像 *cake* 里的"],
  i: ["**i** says its name, as in *kite*", "**i** 读它的字母名，像 *kite* 里的"],
  o: ["**o** says its name, as in *rope*", "**o** 读它的字母名，像 *rope* 里的"],
  u: ["**u** says its name, as in *cube*", "**u** 读它的字母名，像 *cube* 里的"],
};

const why = (s: SilentESpellings): Text => {
  const [en, zh] = names[s.vowel];
  return t(
    `${picture(s.word).alt.en} In **${s.word}** (*${letters(s.word)}*), the **e** at the end is silent, and ${en}.\n\n**Check.** Cover the final **e** and it becomes short-vowel *${s.short}*; uncovering the **e** makes **${s.vowel}** say its name again, giving **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}在 **${s.word}**（*${letters(s.word)}*）里，结尾的 **e** 不发音，${zh}。\n\n**检验。** 盖住结尾的 **e** 会变成短元音 *${s.short}*；露出来后 **${s.vowel}** 才读字母名，正是 **${s.word}**。`,
  );
};

const whyNot =
  (s: SilentESpellings) =>
  (wrong: string): Text => {
    if (wrong === s.short) {
      return t(
        `*${wrong}* has no **e** at the end, so its vowel stays short instead of saying its letter name.`,
        `*${wrong}* 结尾没有 **e**，所以元音只能读短音，不会读字母名。`,
      );
    }
    if (wrong === s.moved) {
      return t(
        `*${wrong}* puts **e** in the middle; a silent **e** belongs at the very end, after the last consonant.`,
        `*${wrong}* 把 **e** 放到了中间；不发音的 **e** 应该写在最末尾、最后一个辅音后面。`,
      );
    }
    return t(
      `*${wrong}* has **${wrong[1]}** as its vowel, so with the silent **e** it says the name of **${wrong[1]}**, which does not match this picture.`,
      `*${wrong}* 的元音是 **${wrong[1]}**，加上不发音的 **e** 后读的是 **${wrong[1]}** 的字母名，和图片对不上。`,
    );
  };

const pictureToWord: readonly PictureItem[] = spellings.map((s) => ({
  word: s.word,
  right: s.word,
  wrong: [s.short, s.other, s.moved],
  solution: why(s),
  whyNot: whyNot(s),
}));

/** likeness counts the letters two words share in the same places. */
const likeness = (a: string, b: string) => [...a].filter((c, i) => b[i] === c).length;

const wordToPicture: readonly PicturesItem[] = spellings.map((s) => {
  const others = allSilentEPictureWords
    .filter((w) => w !== s.word)
    .map((w, i) => ({ w, score: likeness(w, s.word) * 100 + (vowelOf(w) === s.vowel ? 50 : 0) - i }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ w }) => w);
  return { word: s.word, pictures: [s.word, ...others], solution: why(s) };
});

const readingWords = phonicsTopic({
  id: "reading-words-with-silent-e",
  title: t("Reading Words with a Silent E", "读含不发音 e 的词"),
  summary: t(
    "Words such as *cake*, *kite*, *rope* and *cube*, where an **e** at the end is silent and makes the vowel say its name.",
    "*cake*、*kite*、*rope*、*cube* 这样的词：结尾的 **e** 不发音，它让前面的元音读字母名。",
  ),
  intro: t(
    "Sam has a card that says **cap**. He slips an **e** onto the end and it turns into **cape**! The **e** stays quiet, and **a** now says its own letter name.\n\nA silent **e** at the end works the same way on **a**, **i**, **o**, and **u**. Let's read silent-**e** words and match them to pictures.",
    "萨姆手里有张卡片写着 **cap**。他在末尾添上一个 **e**，就变成了 **cape**！这个 **e** 不出声，前面的 **a** 改读它自己的字母名。\n\n结尾不发音的 **e** 对 **a**、**i**、**o**、**u** 都起同样的作用。我们来读带不发音 **e** 的词，并给它们配图。",
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [{ topic: "reading-short-vowel-words", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-with-a-silent-e",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "When a word ends with a consonant and an **e**, the **e** is silent and the vowel before it says its letter name: *a* in *cake*, *i* in *kite*, *o* in *rope*, *u* in *cube*.\n\nTry a picture of a **kite**: *kit* has a short *i*, while **kite** adds a silent **e** so **i** says its name.\n\n> **Watch out.** Do not drop the final **e** (*kit* instead of *kite*) or move **e** into the middle (*kiet*).",
        "一个词以辅音加 **e** 结尾时，**e** 不发音，前面的元音读自己的字母名：*cake* 里的 *a*、*kite* 里的 *i*、*rope* 里的 *o*、*cube* 里的 *u*。\n\n看到风筝 **kite** 时：*kit* 里的 *i* 读短音，而 **kite** 末尾加上不发音的 **e**，**i** 就读字母名。\n\n> **注意。** 不要漏掉结尾的 **e**（把 *kite* 看成 *kit*），也不要把 **e** 挪到中间（如 *kiet*）。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-silent-e-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now you see the word first. Take **cake**: spot the silent **e** at the end, read **a** as its letter name, blend *c-a-k* into *cake*, and pick the cake picture.\n\nAlways look at the end of the word before you read the vowel.\n\n> **Watch out.** Other pictures often share almost all the same letters, like *cake* and *rake*, so check the first and middle letters too.",
        "现在先看到词。拿 **cake** 来说，看到结尾不发音的 **e**，把 **a** 读成字母名，连读成 *cake*，再点蛋糕的图片。\n\n读元音之前先看一眼词尾有没有 **e**。\n\n> **注意。** 其他图片的词常常只差一两个字母（比如 *cake* 和 *rake*），开头和中间的字母也要看清。",
      ),
      pictureOptions(t("Which picture shows this word?", "哪张图片表示这个词？"), wordToPicture),
    ),
  ],
});

const missingVowel: readonly TypedPictureItem[] = spellings.map((s) => {
  const [en, zh] = names[s.vowel];
  const gap = `${s.word[0]} _ ${s.word[2]} e`;
  return {
    word: s.word,
    extra: `**${gap}**`,
    accepted: [s.vowel],
    wrong: ["a", "e", "i", "o", "u"].filter((v) => v !== s.vowel),
    solution: t(
      `${picture(s.word).alt.en} In **${s.word}**, the silent **e** at the end makes ${en.replace(" says ", " say ")}.\n\n**Check.** Put **${s.vowel}** into **${gap}** and read it aloud: the final **e** stays quiet and **${s.vowel}** says its name, giving **${s.word}**.`,
      `${picture(s.word).alt["zh-CN"]}在 **${s.word}** 里，结尾不发音的 **e** 让${zh}。\n\n**检验。** 把 **${s.vowel}** 填进 **${gap}** 再读一遍：结尾的 **e** 不出声，**${s.vowel}** 读字母名，正好是 **${s.word}**。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [s.short, s.other, s.moved],
  solution: t(
    `${picture(s.word).alt.en} Say **${s.word}** slowly: you hear three sounds, and **${s.vowel}** says its letter name, so write *${s.short}* and add a silent **e** at the end: **${s.word}**.\n\n**Check.** Cover the final **e** and it reads short *${s.short}*; with the **e** at the end, it reads **${s.word}**, matching the picture.`,
    `${picture(s.word).alt["zh-CN"]}慢慢说出 **${s.word}**：你听到三个音，**${s.vowel}** 读字母名，所以写出 *${s.short}* 后再在末尾加一个不发音的 **e**：**${s.word}**。\n\n**检验。** 盖住结尾的 **e** 会读成短音 *${s.short}*；加上结尾的 **e** 才读成 **${s.word}**，和图片一致。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-words-with-silent-e",
  title: t("Spelling Words with a Silent E", "拼写含不发音 e 的词"),
  summary: t(
    "Writing words such as *cake* and *kite*: the vowel that says its name, then the whole word with its silent **e**.",
    "写出 *cake*、*kite* 这样的词：先写读字母名的元音，再写带不发音 **e** 的整个词。",
  ),
  intro: t(
    "Mia draws a **bike** and writes **bik** under it. When she reads it back, it says *bik* with a short *i*, so she adds a silent **e** at the end: **bike**!\n\nWhen a vowel says its letter name in these words, add a silent **e** at the very end. First we will fill in the missing vowel, then we will spell the whole word.",
    "米娅画了一辆自行车 **bike**，在下面先写了 **bik**。她读了一遍发现 *i* 成了短音，于是赶紧在最后加上不发音的 **e**：**bike**！\n\n当这些词里的元音读字母名时，末尾要加上不发音的 **e**。我们先补上缺少的元音，再来拼写整个词。",
  ),
  prerequisites: ["reading-words-with-silent-e", "spelling-short-vowel-words"],
  encompasses: [
    { topic: "reading-words-with-silent-e", weight: 0.3 },
    { topic: "spelling-short-vowel-words", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    point(
      "the-missing-long-vowel",
      t("The Missing Vowel", "缺少的元音"),
      t(
        "Each word here ends with a silent **e**, so the vowel in the blank says its own letter name. Look at a **rope** with **r _ p e**: you hear the name of **o**, so type **o**.\n\nListen for the letter name: *a* in *cake*, *i* in *kite*, *o* in *rope*, *u* in *cube*.\n\n> **Watch out.** Listen for the vowel's letter name—do not type **e** in the middle just because the word ends in **e**.",
        "这里每个词末尾都有不发音的 **e**，所以横线里的元音读自己的字母名。看到绳子 **rope** 和 **r _ p e** 时，听到的是 **o** 的字母名，所以键入 **o**。\n\n听清是哪个字母的名字：*cake* 里是 *a*，*kite* 里是 *i*，*rope* 里是 *o*，*cube* 里是 *u*。\n\n> **注意。** 要听出元音读的是哪个字母名，别因为结尾有 **e** 就在中间误打 **e**。",
      ),
      pictureTyped(t("Type the vowel missing from the word for this picture.", "键入这张图片的词中缺少的元音。"), missingVowel),
    ),
    point(
      "spelling-the-whole-silent-e-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word yourself. For a picture of a **cube**, write the three sounds—*c*, *u*, *b*—and add a silent **e** at the very end because **u** says its name: **cube**.\n\nRead back what you typed to make sure the **e** is at the end.\n\n> **Watch out.** Do not forget the final silent **e** (*cub* instead of *cube*) or put **e** before the last consonant (*cueb*).",
        "现在自己写出整个词。看到正方体 **cube** 时，先写出三个音——*c*、*u*、*b*——因为 **u** 读字母名，再在最末尾加不发音的 **e**：**cube**。\n\n写完后再读一遍，确认 **e** 在最后。\n\n> **注意。** 不要漏掉结尾不发音的 **e**（写成 *cub*），也不要把 **e** 写到最后一个辅音前面（如 *cueb*）。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

const softCContrast: Record<string, string> = { mice: "miss", dice: "diss", rice: "riss" };

/** silentEContrast maps each silent-e picture word to a short-vowel contrast word. */
export const silentEContrast: ReadonlyMap<string, string> = new Map(spellings.map((s) => [s.word, softCContrast[s.word] ?? s.short]));

/** silentETopics are the phonics topics of words with a silent e. */
export const silentETopics: readonly TopicDef[] = [readingWords, spellingWords];
