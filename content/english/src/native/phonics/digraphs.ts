// Phonics: words with a digraph, two letters that make one sound: sh, ch, th and ck. Reading them, from a picture to
// its word and from a word to its picture, then spelling them: the two letters in the gap first, then the whole word.

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
import { allDigraphPictureWords, digraphPictureWords, picture } from "./pictures.ts";

type Digraph = keyof typeof digraphPictureWords;

const digraphs: readonly Digraph[] = ["sh", "ch", "th", "ck"];

/** DigraphSpellings are a picture word, its digraph, and three near spellings: another digraph, one of its two
 * letters alone, and another vowel. */
interface DigraphSpellings {
  readonly word: string;
  readonly digraph: Digraph;
  readonly swap: string;
  readonly half: string;
  readonly vowel: string;
}

const rows = `
ship|chip|sip|shap
shell|chell|sell|shall
fish|fich|fis|fesh
dish|dich|dis|desh
shed|ched|sed|shad
shelf|chelf|self|shalf
brush|bruch|brus|brash
shop|chop|sop|shap
chick|shick|cick|check
chin|shin|cin|chen
chips|ships|cips|chops
bench|bensh|benc|banch
chest|shest|cest|chast
chimp|shimp|cimp|champ
bunch|bunsh|bunc|binch
bath|bash|bat|beth
moth|mosh|mot|math
path|pash|pat|peth
cloth|closh|clot|clath
duck|dush|duk|dock
sock|sosh|sok|sack
rock|rosh|rok|rack
lock|losh|lok|lick
neck|nesh|nek|nick
sack|sash|sak|seck
tick|tich|tik|tack
clock|cloch|clok|clack
truck|trush|truk|track
brick|brich|brik|brack
kick|kich|kik|keck
`;

const digraphOf = (word: string): Digraph => {
  const found = digraphs.find((d) => digraphPictureWords[d].includes(word));
  if (!found) throw new Error(`${word} has no digraph picture`);
  return found;
};

const spellings: readonly DigraphSpellings[] = rows
  .trim()
  .split("\n")
  .map((line) => {
    const [word = "", swap = "", half = "", vowel = ""] = line.split("|");
    return { word, digraph: digraphOf(word), swap, half, vowel };
  });

const isVowel = (c: string | undefined) => c !== undefined && "aeiou".includes(c);

for (const s of spellings) {
  const d = s.digraph;
  if (!digraphs.some((o) => o !== d && s.word.replace(d, o) === s.swap)) throw new Error(`${s.swap} must swap the ${d} of ${s.word}`);
  if (s.word.replace(d, d[0] ?? "") !== s.half && s.word.replace(d, d[1] ?? "") !== s.half) {
    throw new Error(`${s.half} must keep one letter of the ${d} of ${s.word}`);
  }
  const changed = [...Array(s.word.length).keys()].filter((i) => s.word[i] !== s.vowel[i]);
  const [at] = changed;
  if (s.vowel.length !== s.word.length || changed.length !== 1 || !isVowel(s.word[at ?? -1]) || !isVowel(s.vowel[at ?? -1])) {
    throw new Error(`${s.vowel} must change the vowel of ${s.word}`);
  }
}
if (spellings.map((s) => s.word).join() !== allDigraphPictureWords.join()) throw new Error("spellings must follow the pictures");

const sounds: Record<Digraph, readonly [en: string, zh: string]> = {
  sh: ["**sh** makes one sound, as at the start of *ship*", "**sh** 发一个音，就像 *ship* 开头的音"],
  ch: ["**ch** makes one sound, as at the start of *chin*", "**ch** 发一个音，就像 *chin* 开头的音"],
  th: ["**th** makes one sound, as at the end of *bath*", "**th** 发一个音，就像 *bath* 结尾的音"],
  ck: [
    "**ck** makes one sound, *k*, written with two letters right after a short vowel, as in *duck*",
    "**ck** 发一个音 *k*，紧跟在短元音后面时用这两个字母来写，比如 *duck*",
  ],
};

const why = (s: DigraphSpellings): Text => {
  const [en, zh] = sounds[s.digraph];
  return t(
    `${picture(s.word).alt.en} The word is **${s.word}**, *${letters(s.word)}*: ${en}.`,
    `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**，*${letters(s.word)}*：${zh}。`,
  );
};

const whyNot =
  (s: DigraphSpellings) =>
  (wrong: string): Text => {
    const d = s.digraph;
    if (wrong === s.swap) {
      const other = digraphs.find((o) => s.word.replace(d, o) === wrong) ?? "";
      return t(
        `*${wrong}* has **${other}**, but the picture's word has **${d}**. Say the word and listen to that sound.`,
        `*${wrong}* 里是 **${other}**，而图片的词里是 **${d}**。说出这个词，听一听那个音。`,
      );
    }
    if (wrong === s.half) {
      return d === "ck"
        ? t(
            `*${wrong}* ends with one letter. Right after a short vowel, the sound *k* at the end of a short word is written with two letters, **ck**.`,
            `*${wrong}* 结尾只有一个字母。在短词里，紧跟短元音的词尾 *k* 音要用两个字母 **ck** 来写。`,
          )
        : t(
            `*${wrong}* has only one letter where the picture's word has **${d}**. That sound needs both letters together.`,
            `*${wrong}* 在图片的词写 **${d}** 的地方只有一个字母。这个音要两个字母一起写。`,
          );
    }
    const at = [...s.word].findIndex((c, i) => c !== wrong[i]);
    return t(
      `*${wrong}* has the vowel **${wrong[at]}**, but the picture's word has **${s.word[at]}**. Read the vowel again.`,
      `*${wrong}* 的元音是 **${wrong[at]}**，而图片的词是 **${s.word[at]}**。再读一读元音。`,
    );
  };

const pictureToWord: readonly PictureItem[] = spellings.map((s) => ({
  word: s.word,
  right: s.word,
  wrong: [s.swap, s.half, s.vowel],
  solution: why(s),
  whyNot: whyNot(s),
}));

/** likeness counts the letters two words share in the same places. */
const likeness = (a: string, b: string) => [...a].filter((c, i) => b[i] === c).length;

const wordToPicture: readonly PicturesItem[] = spellings.map((s) => {
  const others = allDigraphPictureWords
    .filter((w) => w !== s.word)
    .map((w, i) => ({ w, score: (digraphOf(w) === s.digraph ? 1000 : 0) + likeness(w, s.word) * 100 - i }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ w }) => w);
  return { word: s.word, pictures: [s.word, ...others], solution: why(s) };
});

const readingWords = phonicsTopic({
  id: "reading-words-with-digraphs",
  title: t("Reading Words with Digraphs", "读含二合字母的词"),
  summary: t(
    "Words such as *ship*, *chin*, *bath* and *duck*, where two letters, **sh**, **ch**, **th** or **ck**, make one sound.",
    "*ship*、*chin*、*bath*、*duck* 这样的词：两个字母 **sh**、**ch**、**th** 或 **ck** 合起来发一个音。",
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [{ topic: "reading-short-vowel-words", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-with-a-digraph",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "Some pairs of letters make one sound together. They are called **digraphs**. **sh** sounds as at the start of *ship*, **ch** as at the start of *chin*, **th** as at the end of *bath*, and **ck** sounds like *k*, as at the end of *duck*.\n\nTo read a word with a digraph, treat the two letters as one sound: *sh-i-p*, three sounds, not four. Then blend the sounds into the word. The wrong words change the digraph, keep only one of its letters, or change the vowel, so check them all.",
        "有些字母两个合在一起只发一个音，叫作**二合字母**。**sh** 的音像 *ship* 开头，**ch** 像 *chin* 开头，**th** 像 *bath* 结尾，**ck** 的音像 *k*，如 *duck* 结尾。\n\n读含二合字母的词时，把这两个字母当作一个音：*sh-i-p* 是三个音，不是四个。再把音连成词。错误的词会换掉二合字母、只留下其中一个字母，或者换掉元音，所以每处都要核对。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-digraph-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now the word comes first. Find its digraph and say it as one sound, blend the word, and think of what it means. Then find its picture. The other pictures often have words with the same digraph, such as *ship* and *fish*, so read the whole word before you choose.",
        "现在先给出词。找出其中的二合字母，把它读成一个音，连读出这个词，想想它的意思，然后找出它的图片。其他图片的词常常有相同的二合字母，比如 *ship* 和 *fish*，所以要把整个词读完再选。",
      ),
      pictureOptions(t("Which picture shows this word?", "哪张图片表示这个词？"), wordToPicture),
    ),
  ],
});

/** gapped writes a word letter by letter, with a gap for each letter of its digraph: "f i _ _". */
const gapped = (word: string, d: Digraph) => [...word.replace(d, "##")].map((c) => (c === "#" ? "_" : c)).join(" ");

const missingDigraph: readonly TypedPictureItem[] = spellings.map((s) => {
  const [en, zh] = sounds[s.digraph];
  return {
    word: s.word,
    extra: `**${gapped(s.word, s.digraph)}**`,
    accepted: [s.digraph],
    wrong: [...digraphs.filter((d) => d !== s.digraph), ...(s.digraph === "ck" ? ["k", "c"] : [])],
    solution: t(
      `${picture(s.word).alt.en} The word is **${s.word}**: ${en}.`,
      `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**：${zh}。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [s.swap, s.half, s.vowel],
  solution: t(
    `${picture(s.word).alt.en} Say the word slowly, one sound at a time, and write the sound **${s.digraph}** with its two letters: *${letters(s.word)}*, **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}慢慢地一个音一个音地说出这个词，**${s.digraph}** 这个音用两个字母来写：*${letters(s.word)}*，**${s.word}**。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-words-with-digraphs",
  title: t("Spelling Words with Digraphs", "拼写含二合字母的词"),
  summary: t(
    "Writing words with **sh**, **ch**, **th** and **ck**: the two letters of the digraph, then the whole word.",
    "写出含 **sh**、**ch**、**th**、**ck** 的词：先写二合字母的两个字母，再写整个词。",
  ),
  prerequisites: ["reading-words-with-digraphs", "spelling-short-vowel-words"],
  encompasses: [
    { topic: "reading-words-with-digraphs", weight: 0.3 },
    { topic: "spelling-short-vowel-words", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    point(
      "the-missing-digraph",
      t("The Missing Digraph", "缺少的二合字母"),
      t(
        "Say the picture's word slowly and listen for the sound that the gap stands for. Each of these sounds is written with two letters: **sh** as in *ship*, **ch** as in *chin*, **th** as in *bath*, and **ck** for the sound *k* right after a short vowel, as in *duck*. Type both letters.",
        "慢慢说出图片的词，听一听空格代表的那个音。这些音都用两个字母来写：**sh** 像 *ship* 里的，**ch** 像 *chin* 里的，**th** 像 *bath* 里的，**ck** 写紧跟短元音的 *k* 音，像 *duck* 里的。两个字母都要键入。",
      ),
      pictureTyped(t("Type the two letters missing from the word for this picture.", "键入这张图片的词中缺少的两个字母。"), missingDigraph),
    ),
    point(
      "spelling-the-whole-digraph-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word. Say it slowly, one sound at a time, and write each sound in order. When you reach the sound of a digraph, write its two letters together. Then read back what you wrote and check that it says the picture's word.",
        "现在写出整个词。慢慢地一个音一个音地说，按顺序写出每个音。写到二合字母的音时，把它的两个字母一起写上。写完后读一遍，看它是不是图片的词。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

/** digraphTopics are the phonics topics of words with a digraph. */
export const digraphTopics: readonly TopicDef[] = [readingWords, spellingWords];
