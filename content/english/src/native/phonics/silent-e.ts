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
    `${picture(s.word).alt.en} The word is **${s.word}**, *${letters(s.word)}*: the **e** at the end is silent, and ${en}.`,
    `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**，*${letters(s.word)}*：结尾的 **e** 不发音，${zh}。`,
  );
};

const whyNot =
  (s: SilentESpellings) =>
  (wrong: string): Text => {
    if (wrong === s.short) {
      return t(
        `*${wrong}* has no **e** at the end, so its **${s.vowel}** is short. In the picture's word a silent **e** at the end makes **${s.vowel}** say its name.`,
        `*${wrong}* 结尾没有 **e**，所以 **${s.vowel}** 读短音。图片的词结尾有一个不发音的 **e**，它让 **${s.vowel}** 读字母名。`,
      );
    }
    if (wrong === s.moved) {
      return t(
        `*${wrong}* puts the **e** in the middle. The silent **e** comes last, after the consonant: *${letters(s.word)}*.`,
        `*${wrong}* 把 **e** 放到了中间。不发音的 **e** 写在最后，在辅音后面：*${letters(s.word)}*。`,
      );
    }
    return t(
      `*${wrong}* has the vowel **${wrong[1]}**, but the picture's word has **${s.vowel}**. Read the vowel again: the **e** at the end makes it say its name.`,
      `*${wrong}* 的元音是 **${wrong[1]}**，而图片的词是 **${s.vowel}**。再读一读元音：结尾的 **e** 让它读字母名。`,
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
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [{ topic: "reading-short-vowel-words", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-with-a-silent-e",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "Add an **e** to the end of *cap* and it becomes *cape*. The **e** makes no sound of its own, but it changes the vowel before it: the vowel now says its name, the way you say the letter in the alphabet. *kit* becomes *kite*, *not* becomes *note*, *cub* becomes *cube*.\n\nSo when a word ends with a consonant and an **e**, read the vowel as its name and keep the **e** quiet. The wrong words leave out the **e**, change the vowel, or put the **e** in the middle, so check them all.",
        "在 *cap* 的结尾加一个 **e**，就变成了 *cape*。这个 **e** 自己不发音，却会改变前面的元音：元音改读它的字母名，就像在字母表里念这个字母一样。*kit* 变成 *kite*，*not* 变成 *note*，*cub* 变成 *cube*。\n\n所以一个词以辅音加 **e** 结尾时，元音读字母名，**e** 不出声。错误的词会漏掉 **e**、换掉元音，或者把 **e** 放到中间，所以每处都要核对。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-silent-e-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now the word comes first. Look at its end: if it ends with a consonant and an **e**, the vowel says its name and the **e** is silent. Blend the word, think of what it means, and find its picture. The other pictures often have words that share letters with it, such as *cake* and *rake*, so read every letter before you choose.",
        "现在先给出词。先看词尾：如果以辅音加 **e** 结尾，元音读字母名，**e** 不发音。连读出这个词，想想它的意思，然后找出它的图片。其他图片的词常常和它有相同的字母，比如 *cake* 和 *rake*，所以要读完每个字母再选。",
      ),
      pictureOptions(t("Which picture shows this word?", "哪张图片表示这个词？"), wordToPicture),
    ),
  ],
});

const missingVowel: readonly TypedPictureItem[] = spellings.map((s) => {
  const [en, zh] = names[s.vowel];
  return {
    word: s.word,
    extra: `**${s.word[0]} _ ${s.word[2]} e**`,
    accepted: [s.vowel],
    wrong: ["a", "e", "i", "o", "u"].filter((v) => v !== s.vowel),
    solution: t(
      `${picture(s.word).alt.en} The word is **${s.word}**: the **e** at the end is silent, and ${en}.`,
      `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**：结尾的 **e** 不发音，${zh}。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [s.short, s.other, s.moved],
  solution: t(
    `${picture(s.word).alt.en} Say the word slowly. You hear three sounds, and the vowel says its name, so write the vowel and add a silent **e** at the end: *${letters(s.word)}*, **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}慢慢说出这个词。你听到三个音，元音读的是字母名，所以写上这个元音，再在结尾加一个不发音的 **e**：*${letters(s.word)}*，**${s.word}**。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-words-with-silent-e",
  title: t("Spelling Words with a Silent E", "拼写含不发音 e 的词"),
  summary: t(
    "Writing words such as *cake* and *kite*: the vowel that says its name, then the whole word with its silent **e**.",
    "写出 *cake*、*kite* 这样的词：先写读字母名的元音，再写带不发音 **e** 的整个词。",
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
        "Each word here ends with a silent **e**, so the vowel in the gap says its name. Say the picture's word slowly and listen for the vowel's name: *cake* has the name of **a**, *kite* the name of **i**, *rope* the name of **o**, *cube* the name of **u**. Type that vowel.",
        "这里每个词都以不发音的 **e** 结尾，所以空格里的元音读字母名。慢慢说出图片的词，听一听是哪个字母的名字：*cake* 里是 **a** 的名字，*kite* 里是 **i**，*rope* 里是 **o**，*cube* 里是 **u**。键入这个元音。",
      ),
      pictureTyped(t("Type the vowel missing from the word for this picture.", "键入这张图片的词中缺少的元音。"), missingVowel),
    ),
    point(
      "spelling-the-whole-silent-e-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word. Say it slowly and write a letter for each of its three sounds. If the vowel says its name, add a silent **e** at the very end. Then read back what you wrote: without the **e**, *cape* would say *cap*.",
        "现在写出整个词。慢慢地说，为它的三个音各写一个字母。如果元音读的是字母名，就在最后加一个不发音的 **e**。写完后读一遍：没有 **e**，*cape* 就读成了 *cap*。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

/** silentETopics are the phonics topics of words with a silent e. */
export const silentETopics: readonly TopicDef[] = [readingWords, spellingWords];
