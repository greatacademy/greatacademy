// Phonics: reading aloud (S3). In each unit from short vowels to vowel teams, the child sees a picture word and reads it
// aloud, sounding it out; at the end, the child reads a short decodable sentence aloud. A speech service hears it, and
// the word passes when it is heard as itself: an accent is fine, a different vowel or blend is not. An adult nearby
// presses record.

import { type Generator, type Rng, spokenWords, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { spoken, withSounds } from "../../audio.ts";
import { readSeconds, spokenProblem } from "../../levels/speaking.ts";
import { letters } from "./kit.ts";
import {
  allBlendPictureWords,
  allDigraphPictureWords,
  allPictureWords,
  allSilentEPictureWords,
  allVowelTeamPictureWords,
  picture,
} from "./pictures.ts";
import { decodableSentences } from "./sentences.ts";
import { wordSounds } from "./sounds.ts";

/** minItems is the fewest words a knowledge point of reading aloud may have. */
const minItems = 10;

/** nearest is another word of a list that looks most like a word: the word read with one sound wrong. */
const nearest = (word: string, list: readonly string[]) => {
  const score = (w: string) => [...w].filter((c, i) => word[i] === c).length * 2 - Math.abs(w.length - word.length);
  return list.filter((w) => w !== word).sort((a, b) => score(b) - score(a))[0] ?? "the";
};

/** wordsAloud is a knowledge point that shows a picture word and asks the child to read it aloud. */
function wordsAloud(words: readonly string[], explanation: Text) {
  if (words.length < minItems) throw new Error(`reading aloud needs ${minItems} words, has ${words.length}`);
  const generate: Generator = (rng: Rng) => {
    const word = rng.cycle(words)!;
    return spokenProblem(
      {
        prompt: t("Read the word aloud. Sound it out first if you need to.", "大声读出这个词。需要的话，先一个音一个音地拼读。"),
        figure: picture(word),
        solution: t(
          `The word is **${word}**, *${letters(word)}*. Listen, and say it once more.`,
          `这个词是 **${word}**，*${letters(word)}*。听一听，再说一遍。`,
        ),
        ...withSounds(spoken(word), ...wordSounds(word)),
      },
      "read",
      word,
      [],
      [nearest(word, words)],
      5,
    );
  };
  return point("aloud", t("Read the word aloud", "大声读词"), explanation, generate);
}

/** aloudTopic is a unit's topic of reading its words aloud, after hearing them. */
function aloudTopic(id: string, title: Text, summary: Text, hearing: string, words: readonly string[], explanation: Text): TopicDef {
  return {
    id,
    title,
    summary,
    prerequisites: [hearing],
    encompasses: [],
    xp: 8,
    strand: "speaking",
    spoken: "en-US",
    knowledgePoints: [wordsAloud(words, explanation)],
  };
}

const SOUND_OUT = t(
  "Look at the picture and the letters. Say each sound, then blend them into the word, and read the whole word aloud. An adult can press record for you. If the word comes out wrong, listen to it in the solution and try the next one.",
  "看图片和字母。先说出每个音，再把音连起来，然后大声读出整个词。可以请大人帮你按录音。如果读错了，在解答里听一听正确的读音，再试下一个。",
);

const sayingShortVowels = aloudTopic(
  "saying-short-vowel-words",
  t("Reading Short Vowels Aloud", "朗读短元音词"),
  t("Read three-letter words with short vowels aloud.", "大声读出带短元音的三字母词。"),
  "hearing-short-vowel-words",
  allPictureWords,
  SOUND_OUT,
);

const sayingDigraphs = aloudTopic(
  "saying-words-with-digraphs",
  t("Reading Digraphs Aloud", "朗读含二合字母的词"),
  t("Read words with *sh*, *ch*, *th* and *ck* aloud.", "大声读出含 *sh*、*ch*、*th*、*ck* 的词。"),
  "hearing-words-with-digraphs",
  allDigraphPictureWords,
  t(
    "Two letters can make one sound: *sh* as in *ship*, *ch* as in *chin*, *th* as in *bath*, *ck* as in *duck*. Find the two letters, say their one sound, then read the whole word aloud.",
    "两个字母可以发一个音：*ship* 里的 *sh*、*chin* 里的 *ch*、*bath* 里的 *th*、*duck* 里的 *ck*。先找到这两个字母，说出它们的一个音，再大声读出整个词。",
  ),
);

const sayingBlends = aloudTopic(
  "saying-words-with-blends",
  t("Reading Blends Aloud", "朗读含辅音连缀的词"),
  t("Read words with consonant blends, such as *frog* and *nest*, aloud.", "大声读出 *frog*、*nest* 这类含辅音连缀的词。"),
  "hearing-words-with-blends",
  allBlendPictureWords,
  t(
    "In a blend, you hear both consonants, one quickly after the other: *f-r* in *frog*, *s-t* in *nest*. Say both, then read the whole word aloud.",
    "辅音连缀里两个辅音都要读出来，一个紧接着一个：*frog* 里的 *f-r*，*nest* 里的 *s-t*。两个都说出来，再大声读出整个词。",
  ),
);

const sayingSilentE = aloudTopic(
  "saying-words-with-silent-e",
  t("Reading Silent E Aloud", "朗读含不发音 e 的词"),
  t("Read words with a silent e, such as *cake* and *kite*, aloud.", "大声读出 *cake*、*kite* 这类含不发音 e 的词。"),
  "hearing-words-with-silent-e",
  allSilentEPictureWords,
  t(
    "A silent e at the end makes the vowel say its name: *kite*, not *kit*. Do not say the e; make the vowel long, and read the whole word aloud.",
    "词尾不发音的 e 让元音读成字母的名称：读 *kite*，不是 *kit*。e 不发音，把元音读长，再大声读出整个词。",
  ),
);

const sayingVowelTeams = aloudTopic(
  "saying-words-with-vowel-teams",
  t("Reading Vowel Teams Aloud", "朗读含元音组合的词"),
  t("Read words with vowel teams, such as *feet*, *rain* and *boat*, aloud.", "大声读出 *feet*、*rain*、*boat* 这类含元音组合的词。"),
  "hearing-words-with-vowel-teams",
  allVowelTeamPictureWords,
  t(
    "Two vowels together often say the name of the first: *ee* in *feet*, *ai* in *rain*, *oa* in *boat*. Say the long vowel, then read the whole word aloud.",
    "两个元音在一起时常常读第一个元音字母的名称：*feet* 里的 *ee*、*rain* 里的 *ai*、*boat* 里的 *oa*。读出长元音，再大声读出整个词。",
  ),
);

/** sentencesAloud is the knowledge point that shows a decodable sentence and its picture and asks to read it aloud. */
const sentencesAloud: Generator = (rng: Rng) => {
  const s = rng.cycle(decodableSentences)!;
  const half = spokenWords(s.text)
    .slice(0, Math.ceil(spokenWords(s.text).length / 2))
    .join(" ");
  return spokenProblem(
    {
      prompt: t("Read the sentence aloud.", "大声朗读这个句子。"),
      figure: picture(s.word),
      solution: t(`Listen to the sentence, and read it once more with it.`, "听一听这个句子，再跟着读一遍。"),
      ...withSounds(spoken(s.text)),
    },
    "read",
    s.text,
    [],
    [half],
    readSeconds(s.text),
  );
};

const sayingSentences: TopicDef = {
  id: "saying-decodable-sentences",
  title: t("Reading Sentences Aloud", "朗读短句"),
  summary: t("Read short sentences made of the words taught aloud.", "大声朗读由学过的词组成的短句。"),
  prerequisites: ["reading-decodable-sentences"],
  encompasses: [],
  xp: 8,
  strand: "speaking",
  spoken: "en-US",
  knowledgePoints: [
    point(
      "aloud",
      t("Read the sentence aloud", "大声读句子"),
      t(
        "Read the sentence one word at a time in your head first, then read it aloud from the capital letter to the full stop, without stopping between the words.",
        "先在心里一个词一个词地读一遍，再从大写字母读到句号，大声地、不停顿地读出来。",
      ),
      sentencesAloud,
    ),
  ],
};

/** speakingTopics are the topics of reading aloud: one in each unit from short vowels to vowel teams, then sentences. */
export const speakingTopics: readonly TopicDef[] = [
  sayingShortVowels,
  sayingDigraphs,
  sayingBlends,
  sayingSilentE,
  sayingVowelTeams,
  sayingSentences,
];
