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
    `${picture(s.word).alt.en} Sound out every letter of **${s.word}**, *${letters(s.word)}*: ${en}.\n\n**Check.** Drop one letter of **${s.blend}** and you get *${s.drop}*, which is missing a sound; keeping both letters gives **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}逐个字母读出 **${s.word}**，*${letters(s.word)}*：${zh}。\n\n**检验。** 去掉 **${s.blend}** 里的一个字母会变成 *${s.drop}*，少了一个音；两个字母都留着才是 **${s.word}**。`,
  );
};

const whyNot =
  (s: BlendSpellings) =>
  (wrong: string): Text => {
    if (wrong === s.drop) {
      return t(
        `*${wrong}* drops one consonant sound, so it sounds shorter than this picture's word. Stretch the word out and listen for both consonants.`,
        `*${wrong}* 少了一个辅音，读起来比这张图片的词少一个音。把词拉长读，两个辅音都要听出来。`,
      );
    }
    if (wrong === s.change) {
      const [k = 0] = differences(s.word, wrong);
      return t(
        `*${wrong}* has **${wrong[k]}** in the blend, which makes a different consonant sound from this picture's word.`,
        `*${wrong}* 在连缀处写了 **${wrong[k]}**，发出的辅音和这张图片的词不一样。`,
      );
    }
    const [k = 0] = differences(s.word, wrong);
    return t(
      `*${wrong}* has the vowel **${wrong[k]}**, which changes the middle sound so it does not match the picture.`,
      `*${wrong}* 的元音是 **${wrong[k]}**，中间的音变了，和图片对不上。`,
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
  intro: t(
    "Mia spots a green **crab** on the sand. She says *c-r-a-b*: **c** and **r** stand side by side, and she hears both sounds.\n\nTwo consonants together where you hear both sounds are a **blend**, like **cr** in *crab* or **nd** in *hand*. Let's read words with blends and match them to pictures.",
    "米娅在沙滩上看到一只小螃蟹 **crab**。她慢慢读 *c-r-a-b*：**c** 和 **r** 挨在一起，两个音都听得清清楚楚。\n\n两个辅音挨在一起、两个音都读出来，叫**辅音连缀**，比如 *crab* 里的 **cr**、*hand* 里的 **nd**。我们来读含辅音连缀的词，并给它们配图。",
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [{ topic: "reading-short-vowel-words", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-with-a-blend",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "In a **blend**, two consonants sit side by side and you say both sounds quickly, one after the other. In *ship*, **sh** is one sound, but in *frog*, **fr** is two sounds: *f* then *r*.\n\nTry a picture of a **frog**: say all four sounds—*f-r-o-g*—and blend them into **frog**.\n\n> **Watch out.** Do not skip the second consonant of a blend (*fog* instead of *frog*) or miss a changed vowel.",
        "在**辅音连缀**里，两个辅音挨在一起，两个音一个接一个很快读出来。*ship* 里的 **sh** 只发一个音，而 *frog* 里的 **fr** 发两个音：先 *f* 再 *r*。\n\n看到青蛙 **frog** 时，把四个音都读出来——*f-r-o-g*——连成 **frog**。\n\n> **注意。** 不要漏读连缀里的第二个辅音（把 *frog* 看成 *fog*），也别漏看变了的元音。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-blend-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now you see the word first. Take **nest**: say every sound, including both sounds at the end—*n-e-s-t*—and blend them into *nest*, then pick the nest picture.\n\nRead both letters of the blend before you choose.\n\n> **Watch out.** Other pictures often have a blend in the same spot, such as *frog* and *flag*, so read every letter.",
        "现在先看到词。拿 **nest** 来说，把每个音都读出来，包括结尾的两个音——*n-e-s-t*——连成 *nest*，再点鸟窝的图片。\n\n选图前连缀的两个字母都要读清。\n\n> **注意。** 其他图片的词常常在同样位置也有辅音连缀（比如 *frog* 和 *flag*），每个字母都要读完。",
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
  const gap = gapped(s);
  return {
    word: s.word,
    extra: `**${gap}**`,
    accepted: [s.blend],
    wrong: [a, b, b + a],
    solution: t(
      `${picture(s.word).alt.en} Stretch out **${s.word}** and listen to the two missing sounds: ${en}.\n\n**Check.** Put **${s.blend}** into **${gap}** and read it aloud—*${letters(s.word)}* → **${s.word}**; swapping them to *${b}${a}* would change the order of the sounds.`,
      `${picture(s.word).alt["zh-CN"]}把 **${s.word}** 拉长读，听缺少的两个音：${zh}。\n\n**检验。** 把 **${s.blend}** 填进 **${gap}** 再读一遍——*${letters(s.word)}* → **${s.word}**；如果写反成 *${b}${a}*，两个音的顺序就不对了。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [s.drop, s.change, s.vowel],
  solution: t(
    `${picture(s.word).alt.en} Say **${s.word}** slowly, one sound at a time, and write both letters of **${s.blend}**: *${letters(s.word)}* gives **${s.word}**.\n\n**Check.** Read your letters back one by one—leaving out a letter of **${s.blend}** would spell *${s.drop}*, while all ${s.word.length} letters spell **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}慢慢地一个音一个音说出 **${s.word}**，**${s.blend}** 两个字母都要写上：*${letters(s.word)}*，写成 **${s.word}**。\n\n**检验。** 逐个字母反过来读一遍：少了 **${s.blend}** 里的一个字母会写成 *${s.drop}*，${s.word.length} 个字母全在才是 **${s.word}**。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-words-with-blends",
  title: t("Spelling Words with Blends", "拼写含辅音连缀的词"),
  summary: t(
    "Writing words with a blend at the start or the end, such as *frog* and *nest*: the two letters of the blend, then the whole word.",
    "写出开头或结尾有辅音连缀的词，比如 *frog* 和 *nest*：先写连缀的两个字母，再写整个词。",
  ),
  intro: t(
    "Leo draws a **lamp** and says the sounds slowly: *l-a-m-p*. At the end, the *m* hides right before the *p*, so he writes both **m** and **p**.\n\nWhen two consonants sit together, write both letters in the order you hear them. First we will fill in the missing blend, then we will spell the whole word.",
    "利奥画了一盏台灯 **lamp**，慢慢念出每个音：*l-a-m-p*。结尾的 *m* 紧挨在 *p* 前面，所以他把 **m** 和 **p** 两个都写上。\n\n两个辅音挨在一起时，按听到的顺序两个字母都要写。我们先补上缺少的辅音连缀，再来拼写整个词。",
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
        "Say the picture's word slowly and listen to the two sounds in the blanks. For a **frog** with **_ _ o g**, you hear *f* first and *r* next, so type **fr**.\n\nEach blank holds one consonant.\n\n> **Watch out.** Do not drop the quiet second consonant or type the two letters in reverse order.",
        "慢慢说出图片的词，听清两个横线代表的音。看到青蛙 **frog** 和 **_ _ o g** 时，先听到 *f* 再听到 *r*，所以键入 **fr**。\n\n每个横线填一个辅音。\n\n> **注意。** 不要漏掉不太明显的第二个辅音，也不要把两个字母的顺序打反。",
      ),
      pictureTyped(t("Type the two letters missing from the word for this picture.", "键入这张图片的词中缺少的两个字母。"), missingBlend),
    ),
    point(
      "spelling-the-whole-blend-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now spell the whole word yourself. For a picture of a **nest**, stretch out the end—*n-e-s-t*—and write all four letters in order: **nest**.\n\nRead back what you typed to hear every sound.\n\n> **Watch out.** Ending blends like **st** in *nest* are easy to shorten to *net*, so stretch the word and check both consonants.",
        "现在自己拼写整个词。看到鸟窝 **nest** 时，把结尾拉长——*n-e-s-t*——按顺序写出四个字母：**nest**。\n\n写完后再读一遍，听听每个音是否都在。\n\n> **注意。** *nest* 结尾的 **st** 很容易少写成 *net*，要把词拉长读，核对两个辅音都在。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

/** blendContrast maps each blend picture word to the spelling with one consonant of its blend dropped. */
export const blendContrast: ReadonlyMap<string, string> = new Map(spellings.map((s) => [s.word, s.drop]));

/** blendTopics are the phonics topics of words with a consonant blend. */
export const blendTopics: readonly TopicDef[] = [readingWords, spellingWords];
