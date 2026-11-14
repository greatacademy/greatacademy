// Phonics: words with a consonant blend, two consonants side by side whose sounds are both heard: *fr* in *frog*, *st*
// in *nest*. Reading them, from a picture to its word and from a word to its picture, then spelling them: the two
// letters in the gap first, then the whole word.

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
import { allBlendPictureWords, blendPictureWords, picture } from "./pictures.ts";

type Place = keyof typeof blendPictureWords;

/** BlendSpellings are a picture word, its blend, where the blend stands, and three near spellings: one letter of the
 * blend dropped, one letter of the blend changed, and another vowel. */
interface BlendSpellings {
  readonly word: string;
  readonly blend: string;
  readonly place: Place;
  readonly drop: string;
  readonly change: string;
  readonly vowel: string;
}

const rows = `
frog|fr|fog|brog|frug
crab|cr|cab|grab|crub
drum|dr|dum|trum|drim
flag|fl|lag|plag|flig
sled|sl|sed|sned|slad
plug|pl|pug|blug|plag
plum|pl|pum|blum|plam
clam|cl|cam|flam|clim
slug|sl|sug|snug|slig
twig|tw|tig|dwig|twug
crib|cr|cib|grib|creb
dress|dr|dess|bress|driss
glass|gl|gass|blass|gless
cliff|cl|ciff|sliff|cluff
stamp|st|samp|slamp|stump
nest|st|net|nesk|nost
tent|nt|tet|tenk|tint
hand|nd|had|hant|hund
lamp|mp|lap|lanp|lump
pond|nd|pod|pont|pand
desk|sk|dek|dest|dask
milk|lk|mik|milp|malk
belt|lt|bet|belk|bolt
gift|ft|gif|gilt|gaft
raft|ft|rat|rast|ruft
mask|sk|mak|mast|misk
vest|st|vet|vesk|vist
ant|nt|at|and|ent
pump|mp|pup|punp|pamp
plant|nt|plat|plank|plint
`;

const placeOf = (word: string): Place => (blendPictureWords.start.includes(word) ? "start" : "end");

const spellings: readonly BlendSpellings[] = rows
  .trim()
  .split("\n")
  .map((line) => {
    const [word = "", blend = "", drop = "", change = "", vowel = ""] = line.split("|");
    return { word, blend, place: placeOf(word), drop, change, vowel };
  });

const isVowel = (c: string | undefined) => c !== undefined && "aeiou".includes(c);

/** at is where the blend of a spelling begins in its word. */
const at = (s: BlendSpellings) => (s.place === "start" ? 0 : s.word.lastIndexOf(s.blend));

/** differences are the places where two words of one length have different letters. */
const differences = (a: string, b: string) => [...Array(a.length).keys()].filter((i) => a[i] !== b[i]);

for (const s of spellings) {
  const i = at(s);
  if (s.blend.length !== 2 || [...s.blend].some(isVowel) || s.word.slice(i, i + 2) !== s.blend) {
    throw new Error(`${s.blend} must be two consonants at the ${s.place} of ${s.word}`);
  }
  if (s.place === "end" ? i + 2 !== s.word.length || !isVowel(s.word[i - 1]) : isVowel(s.word[1]) || !isVowel(s.word[2])) {
    throw new Error(`${s.word} must have its blend ${s.blend} next to its vowel`);
  }
  const without = (k: number) => s.word.slice(0, k) + s.word.slice(k + 1);
  if (s.drop !== without(i) && s.drop !== without(i + 1)) throw new Error(`${s.drop} must drop a letter of the ${s.blend} of ${s.word}`);
  const changed = differences(s.word, s.change);
  const [c] = changed;
  if (s.change.length !== s.word.length || changed.length !== 1 || c === undefined || c < i || c > i + 1 || isVowel(s.change[c])) {
    throw new Error(`${s.change} must change a letter of the ${s.blend} of ${s.word}`);
  }
  const [v] = differences(s.word, s.vowel);
  if (
    s.vowel.length !== s.word.length ||
    differences(s.word, s.vowel).length !== 1 ||
    !isVowel(s.word[v ?? -1]) ||
    !isVowel(s.vowel[v ?? -1])
  ) {
    throw new Error(`${s.vowel} must change the vowel of ${s.word}`);
  }
  if (new Set([s.word, s.drop, s.change, s.vowel]).size !== 4) throw new Error(`the near spellings of ${s.word} repeat`);
}
if (spellings.map((s) => s.word).join() !== allBlendPictureWords.join()) throw new Error("spellings must follow the pictures");

/** both says that the two letters of a blend are each heard. */
const both = (s: BlendSpellings): readonly [en: string, zh: string] => {
  const [a, b] = s.blend;
  return [
    `**${s.blend}** is two sounds side by side, *${a}* then *${b}*, and you hear both`,
    `**${s.blend}** 是挨在一起的两个音，先 *${a}* 后 *${b}*，两个都听得到`,
  ];
};

const why = (s: BlendSpellings): Text => {
  const [en, zh] = both(s);
  return t(
    `${picture(s.word).alt.en} The word is **${s.word}**, *${letters(s.word)}*: ${en}.`,
    `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**，*${letters(s.word)}*：${zh}。`,
  );
};

const whyNot =
  (s: BlendSpellings) =>
  (wrong: string): Text => {
    if (wrong === s.drop) {
      return t(
        `*${wrong}* misses a sound. In the picture's word, **${s.blend}** stands together and both of its sounds are heard. Say the word slowly and listen for each one.`,
        `*${wrong}* 少了一个音。图片的词里 **${s.blend}** 挨在一起，两个音都能听到。慢慢说出这个词，把每个音都听出来。`,
      );
    }
    if (wrong === s.change) {
      const [k = 0] = differences(s.word, wrong);
      return t(
        `*${wrong}* has **${wrong[k]}** where the picture's word has **${s.word[k]}**. Listen closely to both sounds of **${s.blend}**.`,
        `*${wrong}* 在图片的词写 **${s.word[k]}** 的地方写了 **${wrong[k]}**。仔细听 **${s.blend}** 的两个音。`,
      );
    }
    const [k = 0] = differences(s.word, wrong);
    return t(
      `*${wrong}* has the vowel **${wrong[k]}**, but the picture's word has **${s.word[k]}**. Read the vowel again.`,
      `*${wrong}* 的元音是 **${wrong[k]}**，而图片的词是 **${s.word[k]}**。再读一读元音。`,
    );
  };

const pictureToWord: readonly PictureItem[] = spellings.map((s) => ({
  word: s.word,
  right: s.word,
  wrong: [s.drop, s.change, s.vowel],
  solution: why(s),
  whyNot: whyNot(s),
}));

/** likeness counts the letters two words share in the same places. */
const likeness = (a: string, b: string) => [...a].filter((c, i) => b[i] === c).length;

const blendOf = (word: string) => spellings.find((s) => s.word === word)?.blend;

const wordToPicture: readonly PicturesItem[] = spellings.map((s) => {
  const others = allBlendPictureWords
    .filter((w) => w !== s.word)
    .map((w, i) => ({
      w,
      score: (blendOf(w) === s.blend ? 1000 : 0) + (placeOf(w) === s.place ? 500 : 0) + likeness(w, s.word) * 100 - i,
    }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ w }) => w);
  return { word: s.word, pictures: [s.word, ...others], solution: why(s) };
});

const readingWords = phonicsTopic({
  id: "reading-words-with-blends",
  title: t("Reading Words with Blends", "读含辅音连缀的词"),
  summary: t(
    "Words such as *frog*, *flag*, *nest* and *lamp*, where two consonants stand together and both are heard.",
    "*frog*、*flag*、*nest*、*lamp* 这样的词：两个辅音挨在一起，两个音都听得到。",
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [{ topic: "reading-short-vowel-words", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-with-a-blend",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "Sometimes two consonants stand side by side and you say both of them, quickly, one after the other. They are called a **blend**: **fr** in *frog*, **st** in *nest*. A blend is not a digraph: in *ship*, **sh** is one sound, but in *frog* you hear *f* and then *r*.\n\nTo read a word with a blend, say every sound: *f-r-o-g*, four sounds. The wrong words drop a letter of the blend, change one of its letters, or change the vowel, so check them all.",
        "有时两个辅音挨在一起，两个都要读出来，一个紧接一个，读得很快。这叫作**辅音连缀**：*frog* 里的 **fr**，*nest* 里的 **st**。辅音连缀不是二合字母：*ship* 里的 **sh** 只发一个音，而 *frog* 里先听到 *f* 再听到 *r*。\n\n读含辅音连缀的词时，每个音都要读出来：*f-r-o-g* 是四个音。错误的词会少写连缀里的一个字母、换掉其中一个字母，或者换掉元音，所以每处都要核对。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-blend-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now the word comes first. Say each of its sounds, both sounds of the blend too, blend them into the word, and think of what it means. Then find its picture. The other pictures often have a blend in the same place, such as *frog* and *flag*, so read the whole word before you choose.",
        "现在先给出词。读出它的每个音，连缀的两个音也都要读，再连成这个词，想想它的意思，然后找出它的图片。其他图片的词常常在同样的位置也有辅音连缀，比如 *frog* 和 *flag*，所以要把整个词读完再选。",
      ),
      pictureOptions(t("Which picture shows this word?", "哪张图片表示这个词？"), wordToPicture),
    ),
  ],
});

/** gapped writes a word letter by letter, with a gap for each letter of its blend: "_ _ o g". */
const gapped = (s: BlendSpellings) => {
  const i = at(s);
  return [...s.word].map((c, k) => (k === i || k === i + 1 ? "_" : c)).join(" ");
};

const missingBlend: readonly TypedPictureItem[] = spellings.map((s) => {
  const [en, zh] = both(s);
  const [a = "", b = ""] = s.blend;
  return {
    word: s.word,
    extra: `**${gapped(s)}**`,
    accepted: [s.blend],
    wrong: [a, b, b + a],
    solution: t(
      `${picture(s.word).alt.en} The word is **${s.word}**: ${en}.`,
      `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**：${zh}。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [s.drop, s.change, s.vowel],
  solution: t(
    `${picture(s.word).alt.en} Say the word slowly, one sound at a time, and write a letter for each sound, both letters of **${s.blend}** too: *${letters(s.word)}*, **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}慢慢地一个音一个音地说出这个词，每个音写一个字母，**${s.blend}** 的两个字母也都要写：*${letters(s.word)}*，**${s.word}**。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-words-with-blends",
  title: t("Spelling Words with Blends", "拼写含辅音连缀的词"),
  summary: t(
    "Writing words with a blend at the start or the end, such as *frog* and *nest*: the two letters of the blend, then the whole word.",
    "写出开头或结尾有辅音连缀的词，比如 *frog* 和 *nest*：先写连缀的两个字母，再写整个词。",
  ),
  prerequisites: ["reading-words-with-blends", "spelling-short-vowel-words"],
  encompasses: [
    { topic: "reading-words-with-blends", weight: 0.3 },
    { topic: "spelling-short-vowel-words", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    point(
      "the-missing-blend",
      t("The Missing Blend", "缺少的辅音连缀"),
      t(
        "Say the picture's word slowly and listen to the two sounds that the gaps stand for. Each gap is one letter, and you hear both: in *frog*, *f* then *r*. Type the two letters in the order you hear them.",
        "慢慢说出图片的词，听一听两个空格代表的两个音。每个空格是一个字母，两个音都听得到：*frog* 里先 *f* 后 *r*。按听到的顺序键入这两个字母。",
      ),
      pictureTyped(t("Type the two letters missing from the word for this picture.", "键入这张图片的词中缺少的两个字母。"), missingBlend),
    ),
    point(
      "spelling-the-whole-blend-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word. Say it slowly, one sound at a time, and write a letter for each sound. A blend is easy to shorten: in *nest* the *s* hides before the *t*, so stretch the word out and listen for both. Then read back what you wrote and check that it says the picture's word.",
        "现在写出整个词。慢慢地一个音一个音地说，每个音写一个字母。辅音连缀很容易少写一个：*nest* 里的 *s* 藏在 *t* 前面，所以要把词拉长了说，两个音都听出来。写完后读一遍，看它是不是图片的词。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

/** blendTopics are the phonics topics of words with a consonant blend. */
export const blendTopics: readonly TopicDef[] = [readingWords, spellingWords];
