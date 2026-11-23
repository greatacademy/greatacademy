// Phonics: hearing words (S1). In each unit from short vowels to vowel teams, a word is played and the child chooses
// its picture among pictures of words that sound alike; then the child tells apart the unit's sounds: the vowel or
// digraph or blend heard in a picture word, or a word with a silent e or a vowel team from the short word it changes.

import { type Figure, type Generator, type Mistake, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { heard, spoken, withSounds } from "../../audio.ts";
import { interleave } from "../../levels/words.ts";
import { pictureNoun, soundLabel } from "./kit.ts";
import {
  allBlendPictureWords,
  allDigraphPictureWords,
  allPictureWords,
  allSilentEPictureWords,
  allVowelTeamPictureWords,
  blendPictureWords,
  digraphPictureWords,
  picture,
} from "./pictures.ts";

/** likeness counts the letters two words share in the same places, from the start and from the end. */
const likeness = (a: string, b: string) => {
  let n = 0;
  for (let i = 0; i < Math.min(a.length, b.length); i++) {
    if (a[i] === b[i]) n++;
    if (a.at(-1 - i) === b.at(-1 - i)) n++;
  }
  return n;
};

/** soundsLike are the two other words of a list that share the most letters with a word, so they sound most like it. */
const soundsLike = (word: string, list: readonly string[]): readonly string[] =>
  list
    .filter((w) => w !== word)
    .map((w, i) => ({ w, score: likeness(word, w) * 100 - i }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map((x) => x.w);

/** choice is a choice problem from its options, the right one, optional figures, and feedback on wrong ones. */
function choice(
  fields: Omit<Problem, "answer" | "canonical" | "wrong" | "mistakes">,
  options: readonly Text[],
  right: number,
  figures?: Figure[],
  mistakes: readonly Mistake[] = [],
): Problem {
  return {
    ...fields,
    answer: { checker: "choice", expected: right, input: { kind: "choice", options, ...(figures && { figures }) } },
    canonical: String(right),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(right)),
    ...(mistakes.length > 0 && { mistakes }),
  };
}

/** pictures is the knowledge point that plays a word and asks for its picture among two that sound alike. */
function pictures(words: readonly string[], example: readonly [en: string, zh: string]) {
  const items = words.map((word) => ({ word, others: soundsLike(word, words) }));
  for (const { word } of items) heard(word);
  const generate: Generator = (rng: Rng) => {
    const item = rng.cycle(items)!;
    const options = rng.shuffle([item.word, ...item.others]);
    const figures = options.map(picture);
    const [o1 = "", o2 = ""] = item.others;
    const sound = soundLabel(item.word);
    return choice(
      {
        prompt: t("Listen. Which picture is the word you hear?", "听录音。你听到的词是哪张图片？"),
        listen: [heard(item.word)],
        solution: t(
          `You hear **${item.word}**, ${sound.en}. ${picture(item.word).alt.en}\n\n**Check.** Say the other pictures aloud—*${o1}* and *${o2}*—and compare them with **${item.word}**: only **${item.word}** matches every sound you heard.`,
          `你听到的是 **${item.word}**，${sound["zh-CN"]}。${picture(item.word).alt["zh-CN"]}\n\n**检验。** 把另外两张图念出来——*${o1}* 和 *${o2}*——再和 **${item.word}** 对比：只有 **${item.word}** 每个音都对得上。`,
        ),
      },
      figures.map((f) => f.alt),
      options.indexOf(item.word),
      figures,
      item.others.map((other) => {
        const oSound = soundLabel(other);
        return {
          response: String(options.indexOf(other)),
          feedback: t(
            `That picture shows ${pictureNoun(other)}, ${oSound.en}, which sounds different from the word in the recording.`,
            `那张图是 ${other}，${oSound["zh-CN"]}，读音和录音里的词不一样。`,
          ),
        };
      }),
    );
  };
  return point(
    "pictures",
    t("Hear the word, find the picture", "听词找图"),
    t(
      `Listen to the recording from start to end, then match it to its picture. ${example[0]}\n\n> **Watch out.** Do not tap after hearing only the first sound, because the other pictures have names that sound alike.`,
      `把录音从头到尾听清楚，再找出对应的图片。${example[1]}\n\n> **注意。** 不要只听开头就急着点，其他图片的名称听起来很像。`,
    ),
    generate,
  );
}

/** PartItem is a picture word, the letters of a part of it that a sound is spelled with, and other spellings of sounds. */
interface PartItem {
  readonly word: string;
  readonly part: string;
  readonly others: readonly string[];
}

/** parts is the knowledge point that plays a picture word and asks which letters spell one of its sounds. */
function parts(id: string, title: Text, explanation: Text, question: Text, items: readonly PartItem[]) {
  for (const item of items) {
    heard(item.word);
    if (!item.word.includes(item.part)) throw new Error(`${item.word} has no ${item.part}`);
    for (const o of item.others) if (item.word.includes(o)) throw new Error(`${item.word} has ${o} too`);
  }
  const generate: Generator = (rng: Rng) => {
    const item = rng.cycle(items)!;
    const options = rng.shuffle([item.part, ...item.others]);
    const swap = item.word.replace(item.part, item.others[0] ?? "");
    const sound = soundLabel(item.word);
    return choice(
      {
        prompt: question,
        listen: [heard(item.word)],
        figure: picture(item.word),
        solution: t(
          `The word is **${item.word}**, ${sound.en}, and the sound you hear is spelled **${item.part}**.\n\n**Check.** Swapping **${item.part}** for **${item.others[0]}** would make *${swap}*, which sounds different from the recording; **${item.part}** gives **${item.word}**.`,
          `这个词是 **${item.word}**，${sound["zh-CN"]}，你听到的那个音写作 **${item.part}**。\n\n**检验。** 把 **${item.part}** 换成 **${item.others[0]}** 会变成 *${swap}*，和录音听到的音不同；只有 **${item.part}** 拼出 **${item.word}**。`,
        ),
      },
      options.map(same),
      options.indexOf(item.part),
      undefined,
      item.others.map((other) => ({
        response: String(options.indexOf(other)),
        feedback: t(
          `Using **${other}** instead would read *${item.word.replace(item.part, other)}*, which does not match the sound in the recording.`,
          `如果换成 **${other}**，会读成 *${item.word.replace(item.part, other)}*，和录音里的音对不上。`,
        ),
      })),
    );
  };
  return point(id, title, explanation, generate);
}

/** among takes two items of a list other than some, in turn from a place, so that items differ in their options. */
const among = (list: readonly string[], not: (s: string) => boolean, k: number) => {
  const left = list.filter((s) => !not(s));
  return [left[k % left.length]!, left[(k + 1) % left.length]!];
};

const vowels = ["a", "e", "i", "o", "u"];

const hearingShortVowels: TopicDef = {
  id: "hearing-short-vowel-words",
  title: t("Hearing Short Vowels", "听短元音"),
  summary: t("Hear three-letter words and the short vowel in the middle of each.", "听三字母词以及每个词中间的短元音。"),
  intro: t(
    "Sam closes his eyes while Mom says *pig*. He hears the short *i* in the middle, opens his eyes, and points to the pig!\n\nFirst we will listen to a word and find its picture, then we will listen for the short vowel in the middle.",
    "萨姆闭上眼睛，妈妈念出 *pig*。他听出中间是短音 *i*，睁开眼一下就指到了小猪！\n\n我们先听词找图片，再仔细听词中间的短元音。",
  ),
  prerequisites: ["first-and-last-letters"],
  encompasses: [],
  xp: 8,
  strand: "listening",
  knowledgePoints: [
    pictures(allPictureWords, [
      "For *cat*, listen for *c*, short *a*, and *t*, then pick the cat picture.",
      "比如听到 *cat*，听清 *c*、短 *a* 和 *t*，再选小猫的图片。",
    ]),
    parts(
      "vowel",
      t("The vowel in the middle", "中间的元音"),
      t(
        "Each word has a short vowel in the middle: *a* in *cat*, *e* in *bed*, *i* in *pig*, *o* in *dog*, *u* in *sun*. Say *bed* slowly after you hear it—*b-e-d*—and pick **e**.\n\n> **Watch out.** Do not mix up short **e** (*bed*) and short **i** (*pig*), or short **a** (*cat*) and short **u** (*sun*).",
        "每个词中间都有一个短元音：*cat* 里的 *a*、*bed* 里的 *e*、*pig* 里的 *i*、*dog* 里的 *o*、*sun* 里的 *u*。听到 *bed* 后慢慢复述 *b-e-d*，选 **e**。\n\n> **注意。** 不要把短 **e**（*bed*）和短 **i**（*pig*），或者短 **a**（*cat*）和短 **u**（*sun*）听混。",
      ),
      t("Listen. Which vowel do you hear in the middle of the word?", "听录音。你在词的中间听到了哪个元音？"),
      allPictureWords.map((word, k) => ({ word, part: word[1]!, others: among(vowels, (v) => word.includes(v), k) })),
    ),
  ],
};

const digraphs = ["sh", "ch", "th", "ck"];

const hearingDigraphs: TopicDef = {
  id: "hearing-words-with-digraphs",
  title: t("Hearing Digraphs", "听二合字母"),
  summary: t(
    "Hear words with *sh*, *ch*, *th* and *ck*, and which two letters spell the sound.",
    "听含 *sh*、*ch*、*th*、*ck* 的词，并分辨是哪两个字母拼出这个音。",
  ),
  intro: t(
    "Mia hears *fish* from the speaker. At the end, she hears one soft *sh* sound and taps the fish card!\n\nFirst we will listen to a word and find its picture, then we will pick the two letters that spell its digraph sound.",
    "米娅听到录音里念 *fish*。在结尾她听到一个轻轻的 *sh* 音，立刻点中了小鱼卡片！\n\n我们先听词找图片，再选出拼出这个二合字母音的两个字母。",
  ),
  prerequisites: ["reading-words-with-digraphs"],
  encompasses: [],
  xp: 8,
  strand: "listening",
  knowledgePoints: [
    pictures(allDigraphPictureWords, [
      "For *ship*, listen for *sh* at the start and *p* at the end, then pick the ship picture.",
      "比如听到 *ship*，听清开头的 *sh* 和结尾的 *p*，再选大船的图片。",
    ]),
    parts(
      "digraph",
      t("Two letters, one sound", "两个字母，一个音"),
      t(
        "Two letters can make one sound: **sh** in *ship*, **ch** in *chin*, **th** in *bath*, and **ck** (for *k*) in *duck*. When you hear *chin*, listen to the opening *ch* sound and pick **ch**.\n\n> **Watch out.** Listen closely so you do not mix up **sh** (a smooth, quiet sound) and **ch** (a quick, crisp sound).",
        "两个字母可以合起来发一个音：*ship* 里的 **sh**、*chin* 里的 **ch**、*bath* 里的 **th**，还有 *duck* 结尾读 *k* 的 **ck**。听到 *chin* 时，听清开头的 *ch*，选 **ch**。\n\n> **注意。** 仔细分辨，不要把柔和的 **sh** 和短促清脆的 **ch** 听混。",
      ),
      t("Listen. Which two letters spell a sound you hear in the word?", "听录音。词里你听到的一个音是由哪两个字母拼成的？"),
      Object.entries(digraphPictureWords).flatMap(([part, words]) =>
        words.map((word, k) => ({ word, part, others: among(digraphs, (d) => d === part || word.includes(d), k) })),
      ),
    ),
  ],
};

/** blendOf is the blend of a word with a blend at the start or at the end: its first or last two letters. */
const blendOf = (word: string, at: "start" | "end") => (at === "start" ? word.slice(0, 2) : word.slice(-2));

const hearingBlends: TopicDef = {
  id: "hearing-words-with-blends",
  title: t("Hearing Blends", "听辅音连缀"),
  summary: t(
    "Hear words that start or end with two consonants, and which two they are.",
    "听以两个辅音开头或结尾的词，并分辨是哪两个辅音。",
  ),
  intro: t(
    "Leo hears *drum* and says it slowly: *d-r-u-m*. Right at the start, he hears both *d* and *r* side by side!\n\nFirst we will listen to a word and find its picture, then we will pick the two consonants that stand together.",
    "利奥听到 *drum* 后慢慢跟着念：*d-r-u-m*。最开头挨在一起的 *d* 和 *r* 两个音都听得清清楚楚！\n\n我们先听词找图片，再找出挨在一起的两个辅音。",
  ),
  prerequisites: ["reading-words-with-blends"],
  encompasses: [],
  xp: 8,
  strand: "listening",
  knowledgePoints: [
    pictures(allBlendPictureWords, [
      "For *frog*, listen for both *f* and *r* at the start, then pick the frog picture.",
      "比如听到 *frog*，听清开头的 *f* 和 *r* 两个音，再选青蛙的图片。",
    ]),
    parts(
      "blend",
      t("Two consonants together", "两个辅音连在一起"),
      t(
        "In a blend, you hear both consonants one right after the other: **fr** at the start of *frog*, or **st** at the end of *nest*. When you hear *nest*, stretch the end—*n-e-s-t*—and pick **st**.\n\n> **Watch out.** Listen for both consonants in the blend, because the second one can hide right next to the first.",
        "在辅音连缀里，两个辅音一个接一个都听得到：*frog* 开头的 **fr**，或者 *nest* 结尾的 **st**。听到 *nest* 时，把结尾拉长听——*n-e-s-t*——选 **st**。\n\n> **注意。** 连缀里的两个辅音都要听出来，第二个音很容易藏在第一个音后面。",
      ),
      t("Listen. Which two consonants do you hear together in the word?", "听录音。你在词里听到哪两个辅音连在一起？"),
      (["start", "end"] as const).flatMap((at) => {
        const words = blendPictureWords[at];
        const blends = [...new Set(words.map((w) => blendOf(w, at)))];
        return words.map((word, k) => {
          const part = blendOf(word, at);
          return { word, part, others: among(blends, (b) => b === part || word.includes(b), k) };
        });
      }),
    ),
  ],
};

/** PhonicsPairSpec describes a phonics listening topic that contrasts short-vowel words with long-vowel words. */
interface PhonicsPairSpec {
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly intro: Text;
  readonly prerequisites: readonly string[];
  readonly pictureWords: readonly string[];
  readonly pictureExample: readonly [en: string, zh: string];
  readonly whichExplanation: Text;
  readonly sameExplanation: Text;
  readonly pairs: string;
}

/** phonicsPairTopic builds a phonics listening topic contrasting short vowels with long vowels, with pictures first. */
function phonicsPairTopic(spec: PhonicsPairSpec): TopicDef {
  const pairs = spec.pairs.split(",").map((pair) => {
    const [shortWord, longWord, ...rest] = pair.trim().split(/\s+/u);
    if (rest.length > 0 || !shortWord || !longWord) throw new Error(`${spec.id}: "${pair}" is not a pair of words`);
    return [shortWord, longWord] as const;
  });
  for (const w of pairs.flat()) heard(w);
  const longWords = new Set(pairs.map(([, longWord]) => longWord));
  const sounds = (...words: readonly string[]) => withSounds(...[...new Set(words)].map(spoken));

  const which = pairs.flatMap(([shortWord, longWord]): (readonly [string, string])[] => [
    [shortWord, longWord],
    [longWord, shortWord],
  ]);
  const whichWord: Generator = (rng) => {
    const [said, other] = rng.cycle(which)!;
    const options = rng.shuffle([said, other]);
    const right = options.indexOf(said);
    const isLong = longWords.has(said);
    return choice(
      {
        prompt: t("Listen. Which word do you hear?", "听录音。你听到的是哪个词？"),
        listen: [heard(said)],
        solution: isLong
          ? t(
              `You hear **${said}**, where the vowel says its letter name.\n\n**Check.** Play both **${said}** and *${other}* below: **${said}** has the long vowel (letter name), while *${other}* has a short vowel.`,
              `你听到的是 **${said}**，中间的元音读出了字母名。\n\n**检验。** 对比下面 **${said}** 和 *${other}* 的录音：**${said}** 是长元音（读字母名），而 *${other}* 是短元音。`,
            )
          : t(
              `You hear **${said}**, which has a quick short vowel.\n\n**Check.** Play both **${said}** and *${other}* below: **${said}** stays short, while *${other}* stretches the vowel into its letter name.`,
              `你听到的是 **${said}**，中间是短促的短元音。\n\n**检验。** 对比下面 **${said}** 和 *${other}* 的录音：**${said}** 保持短音，而 *${other}* 把元音读成了字母名。`,
            ),
        ...sounds(said, other),
      },
      options.map(same),
      right,
      undefined,
      [
        {
          response: String(options.indexOf(other)),
          feedback: isLong
            ? t(
                `*${other}* has a short vowel, but the word you heard has a long vowel that says its letter name.`,
                `*${other}* 是短元音，而录音里的词是读字母名的长元音。`,
              )
            : t(
                `*${other}* has a long vowel that says its letter name, but the word you heard has a short vowel.`,
                `*${other}* 是读字母名的长元音，而录音里的词是短元音。`,
              ),
        },
      ],
    );
  };

  const twice = interleave(
    pairs.map(([a, b]): (readonly [string, string])[] => [
      [a, b],
      [a, a],
      [b, a],
      [b, b],
    ]),
  );
  const sameOrNot: Generator = (rng) => {
    const [first, second] = rng.cycle(twice)!;
    const alike = first === second;
    return choice(
      {
        prompt: t(
          "Listen to the two words. Are they the same word, or two different words?",
          "听这两个词。它们是同一个词，还是两个不同的词？",
        ),
        listen: [heard(first), heard(second)],
        solution: alike
          ? t(
              `Both recordings say **${first}**, so they are the same word.\n\n**Check.** Play both recordings again: the vowel sound stays the same both times—no switch between short and long.`,
              `两遍录音念的都是 **${first}**，所以是同一个词。\n\n**检验。** 再听一遍两段录音：中间的元音两次完全一致，没有在短音和长音之间切换。`,
            )
          : t(
              `First you hear **${first}**, then you hear **${second}**, so they are two different words.\n\n**Check.** Compare their middle vowels in the recordings below: one is a short vowel and the other says its letter name.`,
              `先听到的是 **${first}**，再听到的是 **${second}**，所以是两个不同的词。\n\n**检验。** 对比下面两段录音中间的元音：一个是短元音，另一个读出了字母名。`,
            ),
        ...sounds(first, second),
      },
      [t("The same word", "同一个词"), t("Two different words", "两个不同的词")],
      alike ? 0 : 1,
      undefined,
      [
        {
          response: alike ? "1" : "0",
          feedback: alike
            ? t(
                "Listen to the middle vowel in both recordings—it stays the same both times, with no switch between short and long.",
                "听两遍录音中间的元音——两次完全一样，没有在短音和长音之间切换。",
              )
            : t(
                "Listen closely to the middle vowel—one recording has a short vowel and the other says the vowel's letter name.",
                "仔细听中间的元音——一个录音是短元音，另一个读出了元音的字母名。",
              ),
        },
      ],
    );
  };

  return {
    id: spec.id,
    title: spec.title,
    summary: spec.summary,
    intro: spec.intro,
    prerequisites: spec.prerequisites,
    encompasses: [],
    xp: 10,
    strand: "listening",
    knowledgePoints: [
      pictures(spec.pictureWords, spec.pictureExample),
      point("which", t("Which word?", "哪个词？"), spec.whichExplanation, whichWord),
      point("same", t("The same or different?", "相同还是不同？"), spec.sameExplanation, sameOrNot),
    ],
  };
}

const hearingSilentE = phonicsPairTopic({
  id: "hearing-words-with-silent-e",
  title: t("Hearing Silent E", "听不发音的 e"),
  summary: t(
    "Hear a long vowel with a silent e, as in *kite*, from the short one, as in *kit*.",
    "分辨带不发音 e 的长元音（如 *kite*）和短元音（如 *kit*）。",
  ),
  intro: t(
    "Mom says *cap*, then *cape*. Sam hears that *cape* says the name of **a** because of the silent **e** at the end.\n\nFirst we will hear a silent-**e** word and find its picture, then we will tell long vowels from short vowels by ear.",
    "妈妈先念 *cap*，再念 *cape*。萨姆听出 *cape* 里的 **a** 读出了字母名，因为末尾藏着不发音的 **e**。\n\n我们先听词找图片，再靠耳朵分辨长元音和短元音。",
  ),
  prerequisites: ["reading-words-with-silent-e"],
  pictureWords: allSilentEPictureWords,
  pictureExample: [
    "For *kite*, listen for **i** saying its letter name, then pick the kite picture.",
    "比如听到 *kite*，听清 **i** 读出了字母名，再选风筝的图片。",
  ],
  whichExplanation: t(
    "A silent **e** at the end makes the vowel say its letter name: *kit* has a short *i*, while *kite* says the name of **i**. Listen to the vowel in the middle and pick the word you hear.\n\n> **Watch out.** You cannot hear the silent **e** itself, so listen to whether the middle vowel is short or says its name.",
    "词尾不发音的 **e** 让元音读自己的字母名：*kit* 是短 *i*，而 *kite* 读 **i** 的字母名。注意听中间的元音，选出听到的词。\n\n> **注意。** 结尾的 **e** 听不到声音，要靠听中间元音是短音还是字母名来分辨。",
  ),
  sameExplanation: t(
    "Now you hear two words in a row, like *cap* and *cap* (same) or *cap* and *cape* (different). Listen to the middle vowel in both words to decide.\n\n> **Watch out.** Both words start and end with the same consonants, so focus on whether the vowel changes.",
    "现在连续听两个词，比如 *cap* 和 *cap*（相同），或者 *cap* 和 *cape*（不同）。仔细对比两个词中间的元音再作答。\n\n> **注意。** 两个词开头和结尾的辅音一模一样，要专心听中间的元音有没有变。",
  ),
  pairs:
    "kit kite, cap cape, can cane, pin pine, cub cube, tub tube, rob robe, not note, hop hope, fin fine, rid ride, hid hide, dim dime, bit bite, cut cute, plan plane, mad made, rat rate, hat hate, rip ripe",
});

const hearingVowelTeams = phonicsPairTopic({
  id: "hearing-words-with-vowel-teams",
  title: t("Hearing Vowel Teams", "听元音组合"),
  summary: t(
    "Hear the long vowel of a vowel team, as in *feet*, from a short one, as in *fed*.",
    "分辨元音组合的长元音（如 *feet*）和短元音（如 *fed*）。",
  ),
  intro: t(
    "Mia hears *boat* from the speaker. The middle sound says the name of **o**, longer than the short *o* in *got*.\n\nFirst we will hear a vowel-team word and find its picture, then we will tell vowel-team words from short-vowel words by ear.",
    "米娅听到录音念 *boat*。中间的音读出了 **o** 的字母名，比 *got* 里的短 *o* 更长。\n\n我们先听词找图片，再靠耳朵把元音组合的长音和短元音分辨出来。",
  ),
  prerequisites: ["reading-words-with-vowel-teams"],
  pictureWords: allVowelTeamPictureWords,
  pictureExample: [
    "For *rain*, listen for **a** saying its letter name between *r* and *n*, then pick the rain picture.",
    "比如听到 *rain*，听清 *r* 和 *n* 中间读出了 **a** 的字母名，再选下雨的图片。",
  ],
  whichExplanation: t(
    "A vowel team like **ee**, **ea**, **ai**, or **oa** makes a long vowel that says its letter name: *feed* has long **e**, while *fed* has short *e*. Listen to the vowel and pick the matching word.\n\n> **Watch out.** Both choices share the same consonants, so listen closely to whether the vowel is short or long.",
    "**ee**、**ea**、**ai**、**oa** 这样的元音组合发读字母名的长音：*feed* 里的 **e** 读字母名，而 *fed* 是短 *e*。注意听元音，选出对应的词。\n\n> **注意。** 两个选项的辅音完全一样，要仔细听中间元音是短音还是长音。",
  ),
  sameExplanation: t(
    "Now you hear two words in a row, like *bet* and *bet* (same) or *bet* and *beat* (different). Compare the vowel sound in the two recordings.\n\n> **Watch out.** Do not guess from the first or last consonant—only the middle vowel tells you if the words are different.",
    "现在连续听两个词，比如 *bet* 和 *bet*（相同），或者 *bet* 和 *beat*（不同）。对比两遍录音里的元音。\n\n> **注意。** 不要只听开头或结尾的辅音，只有中间的元音能告诉你两个词是不是不同。",
  ),
  pairs:
    "bet beat, fed feed, met meet, set seat, men mean, net neat, bed bead, fell feel, step steep, ran rain, pan pain, man main, pad paid, bat bait, got goat, cot coat, rod road, cost coast",
});

/** listeningTopics are the topics of hearing words, one in each unit from short vowels to vowel teams, in that order. */
export const listeningTopics: readonly TopicDef[] = [hearingShortVowels, hearingDigraphs, hearingBlends, hearingSilentE, hearingVowelTeams];
