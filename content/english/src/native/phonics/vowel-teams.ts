// Phonics: words with a vowel team, two letters that together spell a long vowel: *ee* and *ea* in *feet* and *leaf*,
// *ai* and *ay* in *rain* and *hay*, *oa* in *boat*. Reading them, from a picture to its word and from a word to its
// picture, then spelling them: the two letters of the team in the gap first, then the whole word.

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
import { allVowelTeamPictureWords, picture, vowelTeamPictureWords } from "./pictures.ts";

type Team = keyof typeof vowelTeamPictureWords;

const teams: readonly Team[] = ["ee", "ea", "ai", "ay", "oa"];

/** TeamSpellings are a picture word, its vowel team, and three near spellings: one letter of the team alone, another
 * spelling of the same sound, and a team of another sound. */
interface TeamSpellings {
  readonly word: string;
  readonly team: Team;
  readonly half: string;
  readonly alike: string;
  readonly other: string;
}

const rows = `
bee|be|bea|boo
feet|fet|feat|foot
seed|sed|sead|sood
tree|tre|trea|troo
sheep|shep|sheap|shoop
queen|quen|quene|quoon
wheel|whel|wheal|whool
teeth|teth|teath|toath
leaf|lef|leef|loof
seal|sel|seel|soal
peach|pech|peech|pooch
bead|bed|beed|boad
rain|ran|rane|rean
snail|snal|snale|sneal
mail|mal|male|meal
nail|nal|nale|noal
train|tran|trane|troin
paint|pant|paynt|point
chain|chan|chane|choon
sail|sal|sale|soil
hay|ha|hai|hoy
tray|tra|trai|truy
jay|ja|jai|joy
boat|bot|bote|beat
goat|got|gote|geat
coat|cot|cote|ceat
road|rod|rode|read
toad|tod|tode|tead
soap|sop|sope|seap
loaf|lof|lofe|loof
`;

const teamOf = (word: string): Team => {
  const found = teams.find((team) => vowelTeamPictureWords[team].includes(word));
  if (!found) throw new Error(`${word} has no vowel-team picture`);
  return found;
};

const spellings: readonly TeamSpellings[] = rows
  .trim()
  .split("\n")
  .map((line) => {
    const [word = "", half = "", alike = "", other = ""] = line.split("|");
    return { word, team: teamOf(word), half, alike, other };
  });

for (const s of spellings) {
  const i = s.word.indexOf(s.team);
  if (i < 0) throw new Error(`${s.word} must have its team ${s.team}`);
  const without = (k: number) => s.word.slice(0, k) + s.word.slice(k + 1);
  if (s.half !== without(i) && s.half !== without(i + 1)) throw new Error(`${s.half} must keep one letter of the ${s.team} of ${s.word}`);
  if (new Set([s.word, s.half, s.alike, s.other]).size !== 4) throw new Error(`the near spellings of ${s.word} repeat`);
  for (const w of [s.alike, s.other]) {
    if (w.slice(0, i) !== s.word.slice(0, i)) throw new Error(`${w} must keep the start of ${s.word}`);
  }
}
if (spellings.map((s) => s.word).join() !== allVowelTeamPictureWords.join()) throw new Error("spellings must follow the pictures");

const sounds: Record<Team, readonly [en: string, zh: string]> = {
  ee: ["**ee** says the name of **e**", "**ee** 读 **e** 的字母名"],
  ea: ["**ea** says the name of **e**", "**ea** 读 **e** 的字母名"],
  ai: ["**ai** says the name of **a**", "**ai** 读 **a** 的字母名"],
  ay: ["**ay** says the name of **a**", "**ay** 读 **a** 的字母名"],
  oa: ["**oa** says the name of **o**", "**oa** 读 **o** 的字母名"],
};

const why = (s: TeamSpellings): Text => {
  const [en, zh] = sounds[s.team];
  return t(
    `${picture(s.word).alt.en} The word is **${s.word}**, *${letters(s.word)}*: ${en}.`,
    `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**，*${letters(s.word)}*：${zh}。`,
  );
};

const whyNot =
  (s: TeamSpellings) =>
  (wrong: string): Text => {
    if (wrong === s.half) {
      return t(
        `*${wrong}* has only one letter where the picture's word has **${s.team}**. With one letter the vowel is short; the two letters together make the long sound.`,
        `*${wrong}* 在图片的词写 **${s.team}** 的地方只有一个字母。只有一个字母时元音读短音，两个字母合在一起才读长音。`,
      );
    }
    if (wrong === s.alike) {
      return t(
        `*${wrong}* could sound the same, but it is not how the picture's word is spelled. That word is written with **${s.team}**: *${letters(s.word)}*.`,
        `*${wrong}* 读起来可能一样，但图片的词不是这样拼的。那个词用 **${s.team}** 来写：*${letters(s.word)}*。`,
      );
    }
    const [en, zh] = sounds[s.team];
    return t(
      `*${wrong}* has other vowel letters, which make another sound. In the picture's word ${en}.`,
      `*${wrong}* 的元音字母不同，读的是另一个音。图片的词里 ${zh}。`,
    );
  };

const pictureToWord: readonly PictureItem[] = spellings.map((s) => ({
  word: s.word,
  right: s.word,
  wrong: [s.half, s.alike, s.other],
  solution: why(s),
  whyNot: whyNot(s),
}));

/** likeness counts the letters two words share in the same places. */
const likeness = (a: string, b: string) => [...a].filter((c, i) => b[i] === c).length;

const wordToPicture: readonly PicturesItem[] = spellings.map((s) => {
  const others = allVowelTeamPictureWords
    .filter((w) => w !== s.word)
    .map((w, i) => ({ w, score: (teamOf(w) === s.team ? 500 : 0) + likeness(w, s.word) * 100 - i }))
    .sort((a, b) => b.score - a.score)
    .slice(0, 2)
    .map(({ w }) => w);
  return { word: s.word, pictures: [s.word, ...others], solution: why(s) };
});

const readingWords = phonicsTopic({
  id: "reading-words-with-vowel-teams",
  title: t("Reading Words with Vowel Teams", "读含元音组合的词"),
  summary: t(
    "Words such as *feet*, *leaf*, *rain*, *hay* and *boat*, where two letters together spell a vowel that says its name.",
    "*feet*、*leaf*、*rain*、*hay*、*boat* 这样的词：两个字母合起来拼出一个读字母名的元音。",
  ),
  prerequisites: ["reading-words-with-silent-e"],
  encompasses: [{ topic: "reading-words-with-silent-e", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-with-a-vowel-team",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "A silent **e** is one way to make a vowel say its name. Another is a **vowel team**, two letters side by side that make one long sound. **ee** and **ea** say the name of **e**, as in *feet* and *leaf*. **ai** and **ay** say the name of **a**, as in *rain* and *hay*; **ay** comes at the end of a word. **oa** says the name of **o**, as in *boat*.\n\nRead the team as one sound, then blend the word. The wrong words keep only one letter of the team, spell the sound another way, or use a team that makes another sound, so check them all.",
        "不发音的 **e** 能让元音读字母名，**元音组合**也能：两个挨在一起的字母合起来发一个长音。**ee** 和 **ea** 读 **e** 的字母名，比如 *feet* 和 *leaf*。**ai** 和 **ay** 读 **a** 的字母名，比如 *rain* 和 *hay*；**ay** 写在词尾。**oa** 读 **o** 的字母名，比如 *boat*。\n\n把元音组合读成一个音，再连读整个词。错误的词会只留组合里的一个字母、用别的写法拼同一个音，或者换成读另一个音的组合，所以每处都要核对。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-vowel-team-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now the word comes first. Find its vowel team and read it as one long sound, blend the word, and think of what it means. Then find its picture. The other pictures often have words with the same team, such as *boat* and *goat*, so read every letter before you choose.",
        "现在先给出词。找出其中的元音组合，把它读成一个长音，连读出这个词，想想它的意思，然后找出它的图片。其他图片的词常常有相同的元音组合，比如 *boat* 和 *goat*，所以要读完每个字母再选。",
      ),
      pictureOptions(t("Which picture shows this word?", "哪张图片表示这个词？"), wordToPicture),
    ),
  ],
});

/** gapped writes a word letter by letter, with a gap for each letter of its team: "f _ _ t". */
const gapped = (s: TeamSpellings) => {
  const i = s.word.indexOf(s.team);
  return [...s.word].map((c, k) => (k === i || k === i + 1 ? "_" : c)).join(" ");
};

const missingTeam: readonly TypedPictureItem[] = spellings.map((s) => {
  const [en, zh] = sounds[s.team];
  return {
    word: s.word,
    extra: `**${gapped(s)}**`,
    accepted: [s.team],
    wrong: teams.filter((team) => team !== s.team),
    solution: t(
      `${picture(s.word).alt.en} The word is **${s.word}**: ${en}.`,
      `${picture(s.word).alt["zh-CN"]}这个词是 **${s.word}**：${zh}。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [s.half, s.alike, s.other],
  solution: t(
    `${picture(s.word).alt.en} Say the word slowly, one sound at a time, and write its long vowel with the team **${s.team}**: *${letters(s.word)}*, **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}慢慢地一个音一个音地说出这个词，它的长元音用组合 **${s.team}** 来写：*${letters(s.word)}*，**${s.word}**。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-words-with-vowel-teams",
  title: t("Spelling Words with Vowel Teams", "拼写含元音组合的词"),
  summary: t(
    "Writing words with **ee**, **ea**, **ai**, **ay** and **oa**: the two letters of the team, then the whole word.",
    "写出含 **ee**、**ea**、**ai**、**ay**、**oa** 的词：先写元音组合的两个字母，再写整个词。",
  ),
  prerequisites: ["reading-words-with-vowel-teams", "spelling-words-with-silent-e"],
  encompasses: [
    { topic: "reading-words-with-vowel-teams", weight: 0.3 },
    { topic: "spelling-words-with-silent-e", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    point(
      "the-missing-vowel-team",
      t("The Missing Vowel Team", "缺少的元音组合"),
      t(
        "Say the picture's word slowly and listen for its long vowel: the name of **e**, **a** or **o**. One sound can have more than one spelling, so remember how each word is written: *feet* with **ee** and *leaf* with **ea**; *rain* with **ai** and *hay* with **ay**, which ends a word; *boat* with **oa**. Type the two letters.",
        "慢慢说出图片的词，听一听它的长元音：是 **e**、**a** 还是 **o** 的字母名。同一个音可能有不止一种写法，所以要记住每个词怎么写：*feet* 用 **ee**，*leaf* 用 **ea**；*rain* 用 **ai**，*hay* 用写在词尾的 **ay**；*boat* 用 **oa**。键入这两个字母。",
      ),
      pictureTyped(t("Type the two letters missing from the word for this picture.", "键入这张图片的词中缺少的两个字母。"), missingTeam),
    ),
    point(
      "spelling-the-whole-vowel-team-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word. Say it slowly, one sound at a time, and write each sound in order. When you reach the long vowel, write its team, both letters. Then read back what you wrote and check that it looks like the word you have read.",
        "现在写出整个词。慢慢地一个音一个音地说，按顺序写出每个音。写到长元音时，把它的元音组合两个字母都写上。写完后读一遍，看它是不是和你读过的那个词一样。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

/** vowelTeamTopics are the phonics topics of words with a vowel team. */
export const vowelTeamTopics: readonly TopicDef[] = [readingWords, spellingWords];
