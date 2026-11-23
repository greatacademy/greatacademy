// Phonics: three-letter words with a short vowel. Reading them, from a picture to its word and from a word to its
// picture, then spelling them: the vowel in the middle first, then the whole word.

import { type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import {
  letters,
  type NearKind,
  type PictureItem,
  type PicturesItem,
  phonicsTopic,
  pictureChoice,
  pictureOptions,
  pictureTyped,
  type Spellings,
  spellings,
  type TypedPictureItem,
} from "./kit.ts";
import { allPictureWords, picture } from "./pictures.ts";

const vowelNames: Record<string, readonly [en: string, zh: string]> = {
  a: ["*a* as in *cat*", "像 *cat* 里的 *a*"],
  e: ["*e* as in *bed*", "像 *bed* 里的 *e*"],
  i: ["*i* as in *pig*", "像 *pig* 里的 *i*"],
  o: ["*o* as in *dog*", "像 *dog* 里的 *o*"],
  u: ["*u* as in *sun*", "像 *sun* 里的 *u*"],
};

const vowelOf = (word: string) => {
  const name = vowelNames[word[1] ?? ""];
  if (!name) throw new Error(`${word} has no short vowel in the middle`);
  return name;
};

const nearWhy: Record<NearKind, (wrong: string) => ReturnType<typeof t>> = {
  vowel: (wrong) =>
    t(
      `*${wrong}* has **${wrong[1]}** in the middle, so it says *${letters(wrong)}* instead of the middle sound of this picture's word.`,
      `*${wrong}* 中间是 **${wrong[1]}**，读成 *${letters(wrong)}*，和这张图片词中间的音对不上。`,
    ),
  first: (wrong) =>
    t(
      `*${wrong}* starts with **${wrong[0]}**, so it begins with a different sound from this picture's word.`,
      `*${wrong}* 以 **${wrong[0]}** 开头，开头音和这张图片的词不一样。`,
    ),
  last: (wrong) =>
    t(
      `*${wrong}* ends with **${wrong[2]}**, so its closing sound does not match this picture's word.`,
      `*${wrong}* 以 **${wrong[2]}** 结尾，尾音和这张图片的词对不上。`,
    ),
};

const readWhy = (s: Spellings) => {
  const [en, zh] = vowelOf(s.word);
  return t(
    `${picture(s.word).alt.en} Sound out each letter from left to right—*${letters(s.word)}*—and blend them together: **${s.word}**. The middle vowel is ${en}.\n\n**Check.** Swap the middle letter and it becomes *${s.vowel[0]}*, a different word; keeping all three sounds (*${s.word[0]}*, *${s.word[1]}*, *${s.word[2]}*) gives **${s.word}**, which matches the picture.`,
    `${picture(s.word).alt["zh-CN"]}从左到右读出每个字母的音——*${letters(s.word)}*——再连起来：**${s.word}**。中间的元音${zh}。\n\n**检验。** 换掉中间的字母就会变成 *${s.vowel[0]}*，成了别的词；把首、中、尾三个音（*${s.word[0]}*、*${s.word[1]}*、*${s.word[2]}*）合起来才正好是 **${s.word}**，对上图片。`,
  );
};

const nearOf = (s: Spellings, kind: NearKind) => (kind === "vowel" ? s.vowel : kind === "first" ? s.first : s.last);

const pictureToWord: readonly PictureItem[] = (["vowel", "first", "last"] as const).flatMap((kind) =>
  spellings.map(
    (s): PictureItem => ({
      word: s.word,
      right: s.word,
      wrong: nearOf(s, kind),
      solution: readWhy(s),
      whyNot: (wrong) => nearWhy[kind](wrong),
    }),
  ),
);

/** likeness counts the letters two words share in the same places. */
const likeness = (a: string, b: string) => [0, 1, 2].filter((i) => a[i] === b[i]).length;

const wordToPicture: readonly PicturesItem[] = spellings.map((s) => {
  const others = allPictureWords
    .filter((w) => w !== s.word)
    .map((w, i) => ({ w, score: likeness(w, s.word) * 100 - i }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ w }) => w);
  return { word: s.word, pictures: [s.word, ...others], solution: readWhy(s) };
});

const readingWords = phonicsTopic({
  id: "reading-short-vowel-words",
  title: t("Reading Words with Short Vowels", "读短元音词"),
  summary: t(
    "Three-letter words such as *cat*, *bed*, *pig*, *dog* and *sun*, read by sounding out each letter and blending the sounds.",
    "*cat*、*bed*、*pig*、*dog*、*sun* 这样的三字母词：读出每个字母的音，再把音连起来。",
  ),
  intro: t(
    "Sam points to a toy **dog** and taps three letter blocks: **d**, **o**, **g**. He says *d-o-g*, then says it faster: *dog*!\n\nMany short words have one vowel in the middle: **a**, **e**, **i**, **o**, or **u**. Each vowel makes a short sound. Let's read these three-letter words and match each one to its picture.",
    "萨姆指着玩具小狗 **dog**，依次点三块字母积木：**d**、**o**、**g**。他先读 *d-o-g*，再越读越快：*dog*！\n\n很多三字母短词中间都有一个元音：**a**、**e**、**i**、**o** 或 **u**，发短音。我们来拼读这些词，把词和图片配成对。",
  ),
  prerequisites: ["first-and-last-letters"],
  encompasses: [{ topic: "first-and-last-letters", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-for-a-picture",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "The five vowels are **a**, **e**, **i**, **o**, and **u**. Between two consonants, each makes a short sound: *a* in *cat*, *e* in *bed*, *i* in *pig*, *o* in *dog*, *u* in *sun*.\n\nTry a picture of a **cat**. Say each letter sound from left to right—*c-a-t*—then blend them into one word: **cat**.\n\n> **Watch out.** Check every letter, especially the middle vowel, because *cat*, *cot*, and *cut* differ by only one letter.",
        "五个元音字母是 **a**、**e**、**i**、**o**、**u**。夹在两个辅音中间时，它们发短音：*cat* 里的 *a*、*bed* 里的 *e*、*pig* 里的 *i*、*dog* 里的 *o*、*sun* 里的 *u*。\n\n看到小猫 **cat** 的图片时，从左到右读出每个音——*c-a-t*——再连成一个词：**cat**。\n\n> **注意。** 三个字母都要核对，尤其是中间的元音，因为 *cat*、*cot* 和 *cut* 只差一个字母。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now you see the word first. Take **hat**: say each sound from left to right—*h-a-t*—and blend them into *hat*. Picture a hat in your head, then tap the matching picture.\n\nRead all three letters before you choose.\n\n> **Watch out.** Other pictures often share two letters with the word, like *cat* and *hat*, so check the first, middle, and last letters.",
        "现在先看到词。拿 **hat** 来说，从左到右读出每个音——*h-a-t*——连成 *hat*。脑海里想一想帽子的样子，再点对应的图片。\n\n选图之前要把三个字母都读完。\n\n> **注意。** 其他图片的词常常和它有两个相同的字母（比如 *cat* 和 *hat*），首、中、尾三个字母都要看清。",
      ),
      pictureOptions(t("Which picture shows this word?", "哪张图片表示这个词？"), wordToPicture),
    ),
  ],
});

const vowels = ["a", "e", "i", "o", "u"] as const;

const missingVowel: readonly TypedPictureItem[] = spellings.map((s) => {
  const vowel = s.word[1] ?? "";
  const [en, zh] = vowelOf(s.word);
  return {
    word: s.word,
    extra: `**${s.word[0]} _ ${s.word[2]}**`,
    accepted: [vowel],
    wrong: vowels.filter((v) => v !== vowel),
    solution: t(
      `${picture(s.word).alt.en} Say **${s.word}** slowly—*${letters(s.word)}*. The middle sound is ${en}, so the missing vowel is **${vowel}**.\n\n**Check.** Put **${vowel}** into **${s.word[0]} _ ${s.word[2]}** and read it aloud: **${s.word}**, which names the picture.`,
      `${picture(s.word).alt["zh-CN"]}慢慢读 **${s.word}**——*${letters(s.word)}*。中间的音${zh}，所以缺的元音是 **${vowel}**。\n\n**检验。** 把 **${vowel}** 填进 **${s.word[0]} _ ${s.word[2]}** 再读一遍，就是 **${s.word}**，正好是图片的词。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [...s.vowel, s.first[0], s.last[0]],
  solution: t(
    `${picture(s.word).alt.en} Say **${s.word}** slowly and write one letter for each sound in order: *${letters(s.word)}* gives **${s.word}**.\n\n**Check.** Read back the three letters you wrote from left to right—**${s.word[0]}**, **${s.word[1]}**, **${s.word[2]}**—and blend them: **${s.word}**, matching the picture.`,
    `${picture(s.word).alt["zh-CN"]}慢慢说出 **${s.word}**，按顺序每个音写一个字母：*${letters(s.word)}*，写成 **${s.word}**。\n\n**检验。** 从左到右反过来拼读自己写的三个字母——**${s.word[0]}**、**${s.word[1]}**、**${s.word[2]}**——连起来正是 **${s.word}**，和图片一致。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-short-vowel-words",
  title: t("Spelling Words with Short Vowels", "拼写短元音词"),
  summary: t(
    "Writing three-letter words with a short vowel: the vowel in the middle, then the whole word.",
    "写出带短元音的三字母词：先写中间的元音，再写整个词。",
  ),
  intro: t(
    "Mia draws a **pig** and wants to write its word underneath. She says the sounds slowly—*p-i-g*—and writes one letter for each sound: **p**, **i**, **g**.\n\nEvery short-vowel word here has three sounds and three letters. First we will fill in the missing middle vowel, then we will spell the whole word.",
    "米娅画了一只小猪 **pig**，想在下面写上单词。她慢慢念出三个音——*p-i-g*——每个音写一个字母：**p**、**i**、**g**。\n\n这里的短元音词都是三个音、三个字母。我们先补上缺少的中间元音，再来拼写整个词。",
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [{ topic: "reading-short-vowel-words", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "the-missing-vowel",
      t("The Missing Vowel", "缺少的元音"),
      t(
        "Say the picture's word slowly and listen to the middle sound. Look at a **sun** with **s _ n**: the middle sound is *u* as in *sun*, so type **u**.\n\nMatch that middle sound to one of the five vowels: **a**, **e**, **i**, **o**, or **u**.\n\n> **Watch out.** Do not mix up short **e** (as in *bed*) and short **i** (as in *pig*), or short **a** (as in *cat*) and short **u** (as in *sun*).",
        "慢慢说出图片的词，仔细听中间的音。看到太阳 **sun** 和 **s _ n** 时，中间是 *sun* 里的 *u*，所以键入 **u**。\n\n把听到的中间音对上五个元音之一：**a**、**e**、**i**、**o** 或 **u**。\n\n> **注意。** 不要把短 **e**（*bed*）和短 **i**（*pig*），或者短 **a**（*cat*）和短 **u**（*sun*）听混。",
      ),
      pictureTyped(t("Type the letter that is missing from the word for this picture.", "键入这张图片的词中缺少的字母。"), missingVowel),
    ),
    point(
      "spelling-the-whole-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write all three letters yourself. For a picture of a **bed**, tap out each sound in order—*b*, then *e*, then *d*—and type **bed**.\n\nRead back what you typed to make sure it says the picture's word.\n\n> **Watch out.** Do not drop the middle vowel or swap the first and last letters when typing fast.",
        "现在自己写出全部三个字母。看到床 **bed** 时，按顺序数出三个音——先 *b*、再 *e*、最后 *d*——键入 **bed**。\n\n写完后再读一遍，确认它读出来就是图片的词。\n\n> **注意。** 打字快时不要漏掉中间的元音，也不要把首尾字母写反。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

/** shortVowelTopics are the phonics topics of three-letter words with a short vowel. */
export const shortVowelTopics: readonly TopicDef[] = [readingWords, spellingWords];
