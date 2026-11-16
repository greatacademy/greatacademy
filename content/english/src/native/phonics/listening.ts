// Phonics: hearing words (S1). In each unit from short vowels to vowel teams, a word is played and the child chooses
// its picture among pictures of words that sound alike; then the child tells apart the unit's sounds: the vowel or
// digraph or blend heard in a picture word, or a word with a silent e or a vowel team from the short word it changes.

import { type Figure, type Generator, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { heard } from "../../audio.ts";
import { pairTopic } from "../../levels/listening.ts";
import { letters } from "./kit.ts";
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

/** choice is a choice problem from its options, the right one and the rest of the problem. */
function choice(
  fields: Omit<Problem, "answer" | "canonical" | "wrong">,
  options: readonly Text[],
  right: number,
  figures?: Figure[],
): Problem {
  return {
    ...fields,
    answer: { checker: "choice", expected: right, input: { kind: "choice", options, ...(figures && { figures }) } },
    canonical: String(right),
    wrong: options.map((_, i) => String(i)).filter((i) => i !== String(right)),
  };
}

/** pictures is the knowledge point that plays a word and asks for its picture among two that sound alike. */
function pictures(words: readonly string[]) {
  const items = words.map((word) => ({ word, others: soundsLike(word, words) }));
  for (const { word } of items) heard(word);
  const generate: Generator = (rng: Rng) => {
    const item = rng.cycle(items)!;
    const options = rng.shuffle([item.word, ...item.others]);
    const figures = options.map(picture);
    return choice(
      {
        prompt: t("Listen. Which picture is the word you hear?", "听录音。你听到的词是哪张图片？"),
        listen: [heard(item.word)],
        solution: t(
          `You hear **${item.word}**, spelled *${letters(item.word)}*. ${picture(item.word).alt.en}`,
          `你听到的是 **${item.word}**，拼作 *${letters(item.word)}*。${picture(item.word).alt["zh-CN"]}`,
        ),
      },
      figures.map((f) => f.alt),
      options.indexOf(item.word),
      figures,
    );
  };
  return point(
    "pictures",
    t("Hear the word, find the picture", "听词找图"),
    t(
      "A word is played. Listen to every sound in it, from the first to the last: the pictures to choose among have names that sound alike.",
      "播放一个词。从第一个音到最后一个音都要仔细听：可选的图片名称听起来很像。",
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
    return choice(
      {
        prompt: question,
        listen: [heard(item.word)],
        figure: picture(item.word),
        solution: t(
          `The word is **${item.word}**, spelled *${letters(item.word)}*: you hear the sound of **${item.part}** in it.`,
          `这个词是 **${item.word}**，拼作 *${letters(item.word)}*：你听到的是 **${item.part}** 的音。`,
        ),
      },
      options.map(same),
      options.indexOf(item.part),
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
  prerequisites: ["first-and-last-letters"],
  encompasses: [],
  xp: 8,
  strand: "listening",
  knowledgePoints: [
    pictures(allPictureWords),
    parts(
      "vowel",
      t("The vowel in the middle", "中间的元音"),
      t(
        "Each word has a short vowel in the middle: *a* as in *cat*, *e* as in *bed*, *i* as in *pig*, *o* as in *dog*, *u* as in *sun*. Say the word slowly after you hear it, and listen to the middle sound.",
        "每个词中间都有一个短元音：*cat* 里的 *a*、*bed* 里的 *e*、*pig* 里的 *i*、*dog* 里的 *o*、*sun* 里的 *u*。听到以后慢慢说一遍，注意听中间的音。",
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
  prerequisites: ["reading-words-with-digraphs"],
  encompasses: [],
  xp: 8,
  strand: "listening",
  knowledgePoints: [
    pictures(allDigraphPictureWords),
    parts(
      "digraph",
      t("Two letters, one sound", "两个字母，一个音"),
      t(
        "*sh* as in *ship*, *ch* as in *chin* and *th* as in *bath* each spell one sound with two letters; *ck* spells the *k* sound at the end of *duck*. Listen for which of these sounds is in the word.",
        "*ship* 里的 *sh*、*chin* 里的 *ch*、*bath* 里的 *th* 都是两个字母拼一个音；*ck* 拼的是 *duck* 末尾的 *k* 音。注意听词里有哪一个音。",
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
  prerequisites: ["reading-words-with-blends"],
  encompasses: [],
  xp: 8,
  strand: "listening",
  knowledgePoints: [
    pictures(allBlendPictureWords),
    parts(
      "blend",
      t("Two consonants together", "两个辅音连在一起"),
      t(
        "In a blend, you hear both consonants, one quickly after the other: *f* and *r* in *frog*, *s* and *t* in *nest*. The pictures tell you whether to listen at the start or at the end.",
        "在辅音连缀中，两个辅音都能听到，一个紧接着另一个：*frog* 里的 *f* 和 *r*，*nest* 里的 *s* 和 *t*。看图片的提示，判断是听开头还是听结尾。",
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

/** withPictures puts the knowledge point of pictures first in a topic built from pairs. */
const withPictures = (topic: TopicDef, words: readonly string[]): TopicDef => ({
  ...topic,
  knowledgePoints: [pictures(words), ...topic.knowledgePoints],
});

const hearingSilentE = withPictures(
  pairTopic({
    id: "hearing-words-with-silent-e",
    title: t("Hearing Silent E", "听不发音的 e"),
    summary: t(
      "Hear a long vowel with a silent e, as in *kite*, from the short one, as in *kit*.",
      "分辨带不发音 e 的长元音（如 *kite*）和短元音（如 *kit*）。",
    ),
    prerequisites: ["reading-words-with-silent-e"],
    sounds: t(
      "A silent e at the end makes the vowel say its name: *kit* becomes *kite*, *cap* becomes *cape*. You do not hear the e, but the vowel before it sounds long. Listen to the vowel.",
      "词尾不发音的 e 让前面的元音读成字母本身的名称：*kit* 变成 *kite*，*cap* 变成 *cape*。e 听不到，但它前面的元音变长了。注意听元音。",
    ),
    pairs:
      "kit kite, cap cape, can cane, pin pine, cub cube, tub tube, rob robe, not note, hop hope, fin fine, rid ride, hid hide, dim dime, bit bite, cut cute, plan plane, mad made, rat rate, hat hate, rip ripe",
  }),
  allSilentEPictureWords,
);

const hearingVowelTeams = withPictures(
  pairTopic({
    id: "hearing-words-with-vowel-teams",
    title: t("Hearing Vowel Teams", "听元音组合"),
    summary: t(
      "Hear the long vowel of a vowel team, as in *feet*, from a short one, as in *fed*.",
      "分辨元音组合的长元音（如 *feet*）和短元音（如 *fed*）。",
    ),
    prerequisites: ["reading-words-with-vowel-teams"],
    sounds: t(
      "Two vowels together often say the name of the first: *ee* and *ea* say *e* as in *feet* and *seat*, *ai* says *a* as in *rain*, *oa* says *o* as in *boat*. The word with one vowel has a short sound instead. Listen to the vowel.",
      "两个元音在一起时常常读第一个元音字母的名称：*ee* 和 *ea* 读 *e*，如 *feet*、*seat*；*ai* 读 *a*，如 *rain*；*oa* 读 *o*，如 *boat*。只有一个元音的词则是短音。注意听元音。",
    ),
    pairs:
      "bet beat, fed feed, met meet, set seat, men mean, net neat, bed bead, fell feel, step steep, ran rain, pan pain, man main, pad paid, bat bait, got goat, cot coat, rod road, cost coast",
  }),
  allVowelTeamPictureWords,
);

/** listeningTopics are the topics of hearing words, one in each unit from short vowels to vowel teams, in that order. */
export const listeningTopics: readonly TopicDef[] = [hearingShortVowels, hearingDigraphs, hearingBlends, hearingSilentE, hearingVowelTeams];
