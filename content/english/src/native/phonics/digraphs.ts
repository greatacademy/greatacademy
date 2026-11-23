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

/** soundParts splits a word into its sounds, keeping digraphs and double letters like ll as one piece: "sh-e-ll". */
const soundParts = (word: string): string => (word.match(/sh|ch|th|ck|ll|./g) ?? []).join("-");

const why = (s: DigraphSpellings): Text => {
  const [en, zh] = sounds[s.digraph];
  const parts = soundParts(s.word);
  const count = parts.split("-").length;
  return t(
    `${picture(s.word).alt.en} Read **${s.word}** by keeping **${s.digraph}** as one sound—*${parts}*: ${en}.\n\n**Check.** Count the sounds: *${parts}* has ${count} sounds even though **${s.word}** has ${s.word.length} letters, because **${s.digraph}** makes one sound together, and dropping a letter would give *${s.half}*.`,
    `${picture(s.word).alt["zh-CN"]}读 **${s.word}** 时把 **${s.digraph}** 当成一个音——*${parts}*：${zh}。\n\n**检验。** 数一数声音个数：**${s.word}** 有 ${s.word.length} 个字母，但 *${parts}* 只有 ${count} 个音，因为 **${s.digraph}** 合起来发一个音；少写一个字母就会变成 *${s.half}*。`,
  );
};

const whyNot =
  (s: DigraphSpellings) =>
  (wrong: string): Text => {
    const d = s.digraph;
    if (wrong === s.swap) {
      const other = digraphs.find((o) => s.word.replace(d, o) === wrong) ?? "";
      return t(
        `*${wrong}* uses **${other}**, which makes a different sound from the digraph in this picture's word.`,
        `*${wrong}* 用的是 **${other}**，发出的音和这张图片词里的二合字母不同。`,
      );
    }
    if (wrong === s.half) {
      return d === "ck"
        ? t(
            `*${wrong}* ends with only one letter, but after a short vowel this ending *k* sound takes two letters together.`,
            `*${wrong}* 结尾只有一个字母，而紧跟短元音的词尾 *k* 音需要两个字母一起写。`,
          )
        : t(
            `*${wrong}* has only one letter where this picture's word needs a two-letter team for one sound.`,
            `*${wrong}* 这里只写了一个字母，而这张图片的词需要两个字母合起来发这个音。`,
          );
    }
    const at = [...s.word].findIndex((c, i) => c !== wrong[i]);
    return t(
      `*${wrong}* has the vowel **${wrong[at]}**, which gives a different middle sound from this picture's word.`,
      `*${wrong}* 的元音是 **${wrong[at]}**，读出来的元音和这张图片的词对不上。`,
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
  intro: t(
    "Leo sees a **fish** in a bowl. He taps the word: *f-i-sh*. The last two letters, **s** and **h**, team up to make one quiet sound: *sh*.\n\nTwo letters that make one sound are called a **digraph**: **sh**, **ch**, **th**, and **ck**. Let's read words with these teams and match each one to its picture.",
    "利奥看到鱼缸里有一条鱼 **fish**。他点着读：*f-i-sh*。最后两个字母 **s** 和 **h** 手拉手，只发一个音 *sh*。\n\n两个字母合起来发一个音，叫**二合字母**：**sh**、**ch**、**th** 和 **ck**。我们来读含这些组合的词，再给词和图片配对。",
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [{ topic: "reading-short-vowel-words", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-with-a-digraph",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "A **digraph** is two letters that make one sound: **sh** in *ship*, **ch** in *chin*, **th** in *bath*, and **ck** (for *k*) in *duck*.\n\nTry a picture of a **ship**. Read **sh** as one sound—*sh-i-p*—three sounds in all, not four. Blend them to get **ship**.\n\n> **Watch out.** Do not drop one letter of the digraph (*sip* instead of *ship*) or mix up **sh** and **ch** (*chip* instead of *ship*).",
        "**二合字母**是两个字母合起来发一个音：**sh** 如 *ship*，**ch** 如 *chin*，**th** 如 *bath*，**ck** 读 *k* 如 *duck*。\n\n看到大船 **ship** 时，把 **sh** 当成一个音读——*sh-i-p*——一共三个音，不是四个，连起来就是 **ship**。\n\n> **注意。** 不要漏掉二合字母里的一个字母（把 *ship* 看成 *sip*），也不要把 **sh** 和 **ch** 弄混（把 *ship* 看成 *chip*）。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-digraph-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now you see the word first. Take **duck**: spot **ck** at the end and read it as one *k* sound—*d-u-ck*—then blend it into *duck* and pick the duck picture.\n\nRead every sound before you tap.\n\n> **Watch out.** Two pictures often share the same digraph, such as *ship* and *fish*, so read the whole word instead of guessing from the digraph alone.",
        "现在先看到词。拿 **duck** 来说，看到结尾的 **ck** 只读一个 *k* 音——*d-u-ck*——连成 *duck*，再点小鸭子的图片。\n\n点图前要把每个音都读完。\n\n> **注意。** 两张图片常常有相同的二合字母（比如 *ship* 和 *fish*），要把整个词读完，不要只看二合字母就猜。",
      ),
      pictureOptions(t("Which picture shows this word?", "哪张图片表示这个词？"), wordToPicture),
    ),
  ],
});

/** gapped writes a word letter by letter, with a gap for each letter of its digraph: "f i _ _". */
const gapped = (word: string, d: Digraph) => [...word.replace(d, "##")].map((c) => (c === "#" ? "_" : c)).join(" ");

const missingDigraph: readonly TypedPictureItem[] = spellings.map((s) => {
  const [en, zh] = sounds[s.digraph];
  const gap = gapped(s.word, s.digraph);
  return {
    word: s.word,
    extra: `**${gap}**`,
    accepted: [s.digraph],
    wrong: [...digraphs.filter((d) => d !== s.digraph), ...(s.digraph === "ck" ? ["k", "c"] : [])],
    solution: t(
      `${picture(s.word).alt.en} Listen to the missing sound in **${s.word}**: ${en}.\n\n**Check.** Put **${s.digraph}** into **${gap}** and read it back: *${soundParts(s.word)}* → **${s.word}**, which matches the picture.`,
      `${picture(s.word).alt["zh-CN"]}听一听 **${s.word}** 里缺少的音：${zh}。\n\n**检验。** 把 **${s.digraph}** 填进 **${gap}** 再读一遍：*${soundParts(s.word)}* → **${s.word}**，正好对上图片。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => {
  const parts = soundParts(s.word);
  return {
    word: s.word,
    accepted: [s.word],
    wrong: [s.swap, s.half, s.vowel],
    solution: t(
      `${picture(s.word).alt.en} Say **${s.word}** sound by sound—*${parts}*—and write **${s.digraph}** with both letters: **${s.word}**.\n\n**Check.** Read back *${letters(s.word)}* from left to right: **${s.digraph}** is both letters together, and blending *${parts}* gives **${s.word}**.`,
      `${picture(s.word).alt["zh-CN"]}一个音一个音地说 **${s.word}**——*${parts}*——**${s.digraph}** 两个字母都要写上，写成 **${s.word}**。\n\n**检验。** 从左到右核对 *${letters(s.word)}*：**${s.digraph}** 两个字母都在，连读 *${parts}* 正是 **${s.word}**。`,
    ),
  };
});

const spellingWords = phonicsTopic({
  id: "spelling-words-with-digraphs",
  title: t("Spelling Words with Digraphs", "拼写含二合字母的词"),
  summary: t(
    "Writing words with **sh**, **ch**, **th** and **ck**: the two letters of the digraph, then the whole word.",
    "写出含 **sh**、**ch**、**th**、**ck** 的词：先写二合字母的两个字母，再写整个词。",
  ),
  intro: t(
    "Sam draws a **sock** on his card. He hears three sounds—*s-o-ck*—and writes two letters, **ck**, for the *k* sound right after the short *o*.\n\nWhen you hear *sh*, *ch*, *th*, or *k* right after a short vowel, write two letters for that one sound. First we will fill in the two missing letters, then we will spell the whole word.",
    "萨姆在卡片上画了一只袜子 **sock**。他听到三个音——*s-o-ck*——紧跟在短音 *o* 后面的 *k* 音要写两个字母 **ck**。\n\n听到 *sh*、*ch*、*th* 或短元音后面的 *k* 时，这个音要写两个字母。我们先补上缺少的两个字母，再来拼写整个词。",
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
        "Say the picture's word slowly and listen to the sound in the two blanks. For a **bath** with **b a _ _**, the last sound is *th*, so type **th**.\n\nRemember **ck** writes the *k* sound right after a short vowel, as in *duck*.\n\n> **Watch out.** Always type both letters of the digraph—writing only **k** or **c** for *duck* leaves a blank empty.",
        "慢慢说出图片的词，听一听两个横线代表的音。看到浴缸 **bath** 和 **b a _ _** 时，尾音是 *th*，所以键入 **th**。\n\n记住紧跟短元音的 *k* 音写作 **ck**，比如 *duck*。\n\n> **注意。** 二合字母的两个字母都要打出来，比如 *duck* 只写 **k** 或 **c** 会少一个字母。",
      ),
      pictureTyped(t("Type the two letters missing from the word for this picture.", "键入这张图片的词中缺少的两个字母。"), missingDigraph),
    ),
    point(
      "spelling-the-whole-digraph-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now spell the whole word yourself. For a picture of a **chin**, say *ch-i-n*: write **ch** for the first sound, then **i**, then **n**, to get **chin**.\n\nRead back what you typed to make sure it says the picture's word.\n\n> **Watch out.** Do not write only one letter for **sh**, **ch**, **th**, or **ck**, and check the vowel in the middle.",
        "现在自己拼写整个词。看到下巴 **chin** 时，念 *ch-i-n*：第一个音写 **ch**，再写 **i**，再写 **n**，得到 **chin**。\n\n写完后再读一遍，确认读出来的就是图片的词。\n\n> **注意。** **sh**、**ch**、**th**、**ck** 别只写一个字母，中间的元音也要听清。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

const ckContrast: Record<string, string> = {
  duck: "dug",
  sock: "sog",
  rock: "rod",
  lock: "log",
  neck: "net",
  sack: "sad",
  tick: "tin",
  clock: "clog",
  truck: "track",
  brick: "brim",
  kick: "kid",
};

/** digraphContrast maps each digraph picture word to a near spelling with a different sound. */
export const digraphContrast: ReadonlyMap<string, string> = new Map(
  spellings.map((s) => [s.word, ckContrast[s.word] ?? (s.word === "chick" ? s.swap : s.half)]),
);

/** digraphTopics are the phonics topics of words with a digraph. */
export const digraphTopics: readonly TopicDef[] = [readingWords, spellingWords];
