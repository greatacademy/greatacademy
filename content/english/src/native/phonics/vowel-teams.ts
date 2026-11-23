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

/** teamParts splits a word into sounds with its vowel team kept together: "b-oa-t". */
const teamParts = (word: string, team: Team): string => {
  const i = word.indexOf(team);
  return [...word.slice(0, i), team, ...word.slice(i + 2)].join("-");
};

const why = (s: TeamSpellings): Text => {
  const [en, zh] = sounds[s.team];
  const parts = teamParts(s.word, s.team);
  return t(
    `${picture(s.word).alt.en} Keep **${s.team}** together as one long sound—*${parts}* → **${s.word}**: ${en}.\n\n**Check.** Dropping one letter from **${s.team}** leaves *${s.half}*, which has a short vowel; both letters of **${s.team}** are needed for the long sound in **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}把 **${s.team}** 合起来读成一个长音——*${parts}* → **${s.word}**：${zh}。\n\n**检验。** 去掉 **${s.team}** 里的一个字母会变成短元音 *${s.half}*；**${s.team}** 两个字母都在，才能读出 **${s.word}** 里的长音。`,
  );
};

const whyNot =
  (s: TeamSpellings) =>
  (wrong: string): Text => {
    if (wrong === s.half) {
      return t(
        `*${wrong}* keeps only one vowel letter, which makes a short sound instead of a long vowel team.`,
        `*${wrong}* 只留了一个元音字母，读短音而不是长元音组合。`,
      );
    }
    if (wrong === s.alike) {
      return t(
        `*${wrong}* uses a different way to spell that long sound, which is not the standard spelling of this picture's word.`,
        `*${wrong}* 换了另一种拼法来写这个长音，不是这张图片词的标准拼写。`,
      );
    }
    return t(
      `*${wrong}* uses different vowel letters that make another sound, so it does not name this picture.`,
      `*${wrong}* 换成了读另一个音的元音字母，和这张图片对不上。`,
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
  intro: t(
    "Leo sees a toy **boat** in the tub. The **o** and **a** stand side by side and team up to say the name of **o**: *b-oa-t*.\n\nTwo letters side by side that make one long vowel sound are a **vowel team**: **ee**, **ea**, **ai**, **ay**, and **oa**. Let's read vowel-team words and match them to pictures.",
    "利奥看到浴缸里有一只玩具小船 **boat**。**o** 和 **a** 挨在一起，合起来读 **o** 的字母名：*b-oa-t*。\n\n两个字母挨在一起发一个长元音，叫**元音组合**：**ee**、**ea**、**ai**、**ay** 和 **oa**。我们来读含元音组合的词，再给它们配图。",
  ),
  prerequisites: ["reading-words-with-silent-e"],
  encompasses: [{ topic: "reading-words-with-silent-e", weight: 0.3 }],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-word-with-a-vowel-team",
      t("The Word for a Picture", "图片对应的词"),
      t(
        "In a **vowel team**, two letters work together to make one long vowel sound: **ee** and **ea** say *e* (*feet*, *leaf*), **ai** and **ay** say *a* (*rain*, *hay*), and **oa** says *o* (*boat*).\n\nTry a picture of **feet**: read **ee** as one long *e* sound—*f-ee-t*—and blend it into **feet**.\n\n> **Watch out.** Do not pick a short-vowel spelling with only one letter (*fet* instead of *feet*) or a team that makes a different sound (*foot*).",
        "在**元音组合**里，两个字母合起来发一个长音：**ee** 和 **ea** 读 *e*（*feet*、*leaf*），**ai** 和 **ay** 读 *a*（*rain*、*hay*），**oa** 读 *o*（*boat*）。\n\n看到双脚 **feet** 时，把 **ee** 读成一个长 *e* 音——*f-ee-t*——连成 **feet**。\n\n> **注意。** 不要错选只留一个字母的短元音拼法（如 *fet*），也不要选成读另一个音的组合（如 *foot*）。",
      ),
      pictureChoice(t("Which word names the picture?", "哪个词是这张图片的名称？"), pictureToWord),
    ),
    point(
      "choosing-the-picture-for-a-vowel-team-word",
      t("The Picture for a Word", "词对应的图片"),
      t(
        "Now you see the word first. Take **rain**: spot **ai** in the middle, read it as the name of **a**—*r-ai-n*—blend it into *rain*, and pick the rain picture.\n\nRead the consonants around the team too before you choose.\n\n> **Watch out.** Other pictures often share the same vowel team, like *boat* and *goat*, so check every consonant as well.",
        "现在先看到词。拿 **rain** 来说，看到中间的 **ai** 读 **a** 的字母名——*r-ai-n*——连成 *rain*，再点下雨的图片。\n\n选图前元音组合前后的辅音也要读清。\n\n> **注意。** 其他图片的词常常有相同的元音组合（比如 *boat* 和 *goat*），前后的辅音也要核对。",
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
  const gap = gapped(s);
  return {
    word: s.word,
    extra: `**${gap}**`,
    accepted: [s.team],
    wrong: teams.filter((team) => team !== s.team),
    solution: t(
      `${picture(s.word).alt.en} Listen to the long vowel in **${s.word}**: ${en}.\n\n**Check.** Put **${s.team}** into **${gap}** and read it back—*${teamParts(s.word, s.team)}* → **${s.word}**, which matches the picture.`,
      `${picture(s.word).alt["zh-CN"]}听一听 **${s.word}** 里的长元音：${zh}。\n\n**检验。** 把 **${s.team}** 填进 **${gap}** 再读一遍——*${teamParts(s.word, s.team)}* → **${s.word}**，正好对上图片。`,
    ),
  };
});

const wholeWord: readonly TypedPictureItem[] = spellings.map((s) => ({
  word: s.word,
  accepted: [s.word],
  wrong: [s.half, s.alike, s.other],
  solution: t(
    `${picture(s.word).alt.en} Say **${s.word}** sound by sound—*${teamParts(s.word, s.team)}*—and write its long vowel with **${s.team}**: **${s.word}**.\n\n**Check.** Read back *${letters(s.word)}*: with only one vowel letter it would read short *${s.half}*, while **${s.team}** gives the long sound in **${s.word}**.`,
    `${picture(s.word).alt["zh-CN"]}一个音一个音地说 **${s.word}**——*${teamParts(s.word, s.team)}*——长元音用 **${s.team}** 来写，写成 **${s.word}**。\n\n**检验。** 核对 *${letters(s.word)}*：只写一个元音字母会读成短音 *${s.half}*，写上 **${s.team}** 才读出 **${s.word}** 的长音。`,
  ),
}));

const spellingWords = phonicsTopic({
  id: "spelling-words-with-vowel-teams",
  title: t("Spelling Words with Vowel Teams", "拼写含元音组合的词"),
  summary: t(
    "Writing words with **ee**, **ea**, **ai**, **ay** and **oa**: the two letters of the team, then the whole word.",
    "写出含 **ee**、**ea**、**ai**、**ay**、**oa** 的词：先写元音组合的两个字母，再写整个词。",
  ),
  intro: t(
    "Sam draws yellow **hay** in a barn. He hears the name of **a** right at the end of the word, so he writes **ay**: **hay**.\n\nOne long vowel sound can be spelled by different teams, like **ai** in the middle (*rain*) and **ay** at the end (*hay*). First we will fill in the missing team, then we will spell the whole word.",
    "萨姆在谷仓画了一堆干草 **hay**。他听到词尾是 **a** 的字母名，于是写上 **ay**：**hay**。\n\n同一个长音可以有不同的元音组合，比如词中用 **ai**（*rain*）、词尾用 **ay**（*hay*）。我们先补上缺少的元音组合，再来拼写整个词。",
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
        "Say the picture's word slowly and listen for the long vowel in the two blanks. For a **leaf** with **l _ _ f**, you hear the name of **e** and *leaf* uses **ea**, so type **ea**.\n\nRemember **ay** comes at the end (*hay*), while **ai** sits inside (*rain*).\n\n> **Watch out.** Do not mix up teams that share a sound (**ee** vs. **ea**, or **ai** vs. **ay**) when filling the blanks.",
        "慢慢说出图片的词，听一听两个横线里的长元音。看到树叶 **leaf** 和 **l _ _ f** 时，听到的是 **e** 的字母名，*leaf* 用 **ea**，所以键入 **ea**。\n\n记住 **ay** 用在词尾（*hay*），**ai** 用在词中（*rain*）。\n\n> **注意。** 填空时不要把同音的组合写混（比如 **ee** 和 **ea**，或者 **ai** 和 **ay**）。",
      ),
      pictureTyped(t("Type the two letters missing from the word for this picture.", "键入这张图片的词中缺少的两个字母。"), missingTeam),
    ),
    point(
      "spelling-the-whole-vowel-team-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word yourself. For a picture of a **coat**, say *c-oa-t* and write **oa** for the long *o* sound: **coat**.\n\nRead back what you typed to make sure both letters of the team are there.\n\n> **Watch out.** Do not leave out the second letter of the vowel team (*cot* instead of *coat*) or replace it with a silent **e** (*cote*).",
        "现在自己写出整个词。看到外套 **coat** 时，念 *c-oa-t*，长 *o* 音写 **oa**：**coat**。\n\n写完后再读一遍，确认元音组合的两个字母都在。\n\n> **注意。** 不要漏掉元音组合的第二个字母（写成 *cot*），也不要改写成不发音的 **e**（如 *cote*）。",
      ),
      pictureTyped(t("Type the word for this picture.", "键入这张图片的词。"), wholeWord),
    ),
  ],
});

/** vowelTeamTopics are the phonics topics of words with a vowel team. */
export const vowelTeamTopics: readonly TopicDef[] = [readingWords, spellingWords];
