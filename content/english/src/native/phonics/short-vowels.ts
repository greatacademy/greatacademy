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

const nearWhy: Record<NearKind, (wrong: string, word: string) => ReturnType<typeof t>> = {
  vowel: (wrong, word) =>
    t(
      `*${wrong}* has **${wrong[1]}** in the middle, but the picture's word has **${word[1]}**. Read the middle letter again.`,
      `*${wrong}* 中间是 **${wrong[1]}**，而图片的词中间是 **${word[1]}**。再读一读中间的字母。`,
    ),
  first: (wrong, word) =>
    t(
      `*${wrong}* begins with **${wrong[0]}**, but the picture's word begins with **${word[0]}**.`,
      `*${wrong}* 以 **${wrong[0]}** 开头，而图片的词以 **${word[0]}** 开头。`,
    ),
  last: (wrong, word) =>
    t(
      `*${wrong}* ends with **${wrong[2]}**, but the picture's word ends with **${word[2]}**.`,
      `*${wrong}* 以 **${wrong[2]}** 结尾，而图片的词以 **${word[2]}** 结尾。`,
    ),
};

const readWhy = (word: string) => {
  const [en, zh] = vowelOf(word);
  return t(
    `${picture(word).alt.en} Read the word letter by letter, *${letters(word)}*, and blend the sounds: **${word}**. Its vowel is ${en}.`,
    `${picture(word).alt["zh-CN"]}逐个字母读出这个词，*${letters(word)}*，再把音连起来：**${word}**。它的元音是${zh}。`,
  );
};

const nearOf = (s: Spellings, kind: NearKind) => (kind === "vowel" ? s.vowel : kind === "first" ? s.first : s.last);

const pictureToWord: readonly PictureItem[] = (["vowel", "first", "last"] as const).flatMap((kind) =>
  spellings.map(
    (s): PictureItem => ({
      word: s.word,
      right: s.word,
      wrong: nearOf(s, kind),
      solution: readWhy(s.word),
      whyNot: (wrong) => nearWhy[kind](wrong, s.word),
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
  return { word: s.word, pictures: [s.word, ...others], solution: readWhy(s.word) };
});

const readingWords = phonicsTopic({
  id: "reading-short-vowel-words",
  title: t("Reading Words with Short Vowels", "读短元音词"),
  summary: t(
    "Three-letter words such as *cat*, *bed*, *pig*, *dog* and *sun*, read by sounding out each letter and blending the sounds.",
    "*cat*、*bed*、*pig*、*dog*、*sun* 这样的三字母词：读出每个字母的音，再把音连起来。",
  ),
  prerequisites: ["first-and-last-letters"],
  encompasses: [{ topic: "first-and-last-letters", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-for-a-picture",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "The five vowels are **a**, **e**, **i**, **o** and **u**. In a word like *cat*, the vowel sits between two other letters and makes its short sound: *a* as in *cat*, *e* as in *bed*, *i* as in *pig*, *o* as in *dog*, *u* as in *sun*.\n\nTo read the word, say the sound of each letter from left to right, *c-a-t*, then say them faster until they join into one word: *cat*. The wrong words differ by one letter, so check every letter, the middle one too.",
        "五个元音字母是 **a**、**e**、**i**、**o** 和 **u**。在 *cat* 这样的词里，元音夹在两个字母中间，发短音：*a* 像 *cat* 里的，*e* 像 *bed* 里的，*i* 像 *pig* 里的，*o* 像 *dog* 里的，*u* 像 *sun* 里的。\n\n读这个词时，从左到右说出每个字母的音，*c-a-t*，再越说越快，直到连成一个词：*cat*。错误的词只差一个字母，所以每个字母都要核对，中间那个也不例外。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now the word comes first. Sound it out letter by letter, blend the sounds, and think of what the word means. Then find its picture. The other pictures have words that share letters with it, such as *cat* and *hat*, so read the whole word before you choose.",
        "现在先给出词。逐个字母读出它的音，连起来，再想想这个词的意思，然后找出它的图片。其他图片的词和它有相同的字母，比如 *cat* 和 *hat*，所以要把整个词读完再选。",
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
      `${picture(s.word).alt.en} The word is **${s.word}**, *${letters(s.word)}*: its middle sound is ${en}, written **${vowel}**.`,
      `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**，*${letters(s.word)}*：中间的音${zh}，写作 **${vowel}**。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [...s.vowel, s.first[0], s.last[0]],
  solution: t(
    `${picture(s.word).alt.en} Say the word slowly and write a letter for each sound: *${letters(s.word)}*, **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}慢慢说出这个词，每个音写一个字母：*${letters(s.word)}*，**${s.word}**。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-short-vowel-words",
  title: t("Spelling Words with Short Vowels", "拼写短元音词"),
  summary: t(
    "Writing three-letter words with a short vowel: the vowel in the middle, then the whole word.",
    "写出带短元音的三字母词：先写中间的元音，再写整个词。",
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [{ topic: "reading-short-vowel-words", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "the-missing-vowel",
      t("The Missing Vowel", "缺少的元音"),
      t(
        "Say the picture's word slowly and listen to the sound in the middle. Each short vowel sound has its letter: *a* as in *cat*, *e* as in *bed*, *i* as in *pig*, *o* as in *dog*, *u* as in *sun*. Type the one letter that goes in the gap.",
        "慢慢说出图片的词，听中间的音。每个短元音都有对应的字母：*a* 像 *cat* 里的，*e* 像 *bed* 里的，*i* 像 *pig* 里的，*o* 像 *dog* 里的，*u* 像 *sun* 里的。在空格处键入那一个字母。",
      ),
      pictureTyped(t("Type the letter that is missing from the word for this picture.", "键入这张图片的词中缺少的字母。"), missingVowel),
    ),
    point(
      "spelling-the-whole-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word. Say it slowly, sound by sound, and write one letter for each sound, in order: first, middle, last. Then read back what you wrote, letter by letter, and check that it says the picture's word.",
        "现在写出整个词。慢慢地一个音一个音地说，每个音按顺序写一个字母：开头、中间、结尾。写完后逐个字母读一遍，看它是不是图片的词。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

/** shortVowelTopics are the phonics topics of three-letter words with a short vowel. */
export const shortVowelTopics: readonly TopicDef[] = [readingWords, spellingWords];
