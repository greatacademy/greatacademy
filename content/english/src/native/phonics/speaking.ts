// Phonics: reading aloud (S3). In each unit from short vowels to vowel teams, the child sees a picture word and reads it
// aloud, sounding it out; at the end, the child reads a short decodable sentence aloud. A speech service hears it, and
// the word passes when it is heard as itself: an accent is fine, a different vowel or blend is not. An adult nearby
// presses record.

import { type Generator, type Rng, spokenWords, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { spoken, withSounds } from "../../audio.ts";
import { cutShort, readSeconds, soundsLike, spokenProblem } from "../../levels/speaking.ts";
import { blendContrast } from "./blends.ts";
import { digraphContrast } from "./digraphs.ts";
import { soundLabel, spellings } from "./kit.ts";
import {
  allBlendPictureWords,
  allDigraphPictureWords,
  allPictureWords,
  allSilentEPictureWords,
  allVowelTeamPictureWords,
  picture,
} from "./pictures.ts";
import { decodableSentences } from "./sentences.ts";
import { silentEContrast } from "./silent-e.ts";
import { wordSounds } from "./sounds.ts";
import { vowelTeamContrast } from "./vowel-teams.ts";

/** minItems is the fewest words a knowledge point of reading aloud may have. */
const minItems = 10;

const shortVowelContrast: ReadonlyMap<string, string> = new Map(spellings.map((s) => [s.word, s.vowel[0]]));

/** wordsAloud is a knowledge point that shows a picture word and asks the child to read it aloud. */
function wordsAloud(words: readonly string[], contrasts: ReadonlyMap<string, string>, explanation: Text) {
  if (words.length < minItems) throw new Error(`reading aloud needs ${minItems} words, has ${words.length}`);
  const generate: Generator = (rng: Rng) => {
    const word = rng.cycle(words)!;
    const near = contrasts.get(word);
    if (!near) throw new Error(`no contrast word for ${word}`);
    const sound = soundLabel(word);
    return spokenProblem(
      {
        prompt: t("Read the word aloud. Sound it out first if you need to.", "大声读出这个词。需要的话，先一个音一个音地拼读。"),
        figure: picture(word),
        solution: t(
          `Sound out **${word}**, ${sound.en}, and blend it smoothly: **${word}**.\n\n**Check.** Play the recording below and say **${word}** once more; make sure it sounds like **${word}**, not *${near}*.`,
          `按音拼读 **${word}**——${sound["zh-CN"]}——再连贯读出来：**${word}**。\n\n**检验。** 播放下面的录音并跟着再读一遍 **${word}**，听清楚自己读的是 **${word}**，而不是 *${near}*。`,
        ),
        ...withSounds(spoken(word), ...wordSounds(word)),
      },
      "read",
      word,
      [],
      [[near, soundsLike(word, near)]],
      5,
    );
  };
  return point("aloud", t("Read the word aloud", "大声读词"), explanation, generate);
}

/** aloudTopic is a unit's topic of reading its words aloud, after hearing them. */
function aloudTopic(
  id: string,
  title: Text,
  summary: Text,
  intro: Text,
  hearing: string,
  words: readonly string[],
  contrasts: ReadonlyMap<string, string>,
  explanation: Text,
): TopicDef {
  return {
    id,
    title,
    summary,
    intro,
    prerequisites: [hearing],
    encompasses: [],
    xp: 8,
    strand: "speaking",
    spoken: "en-US",
    knowledgePoints: [wordsAloud(words, contrasts, explanation)],
  };
}

const sayingShortVowels = aloudTopic(
  "saying-short-vowel-words",
  t("Reading Short Vowels Aloud", "朗读短元音词"),
  t("Read three-letter words with short vowels aloud.", "大声读出带短元音的三字母词。"),
  t(
    "Sam sees a card with a **dog** on it. He whispers *d-o-g*, then reads it out loud: *dog*!\n\nAn adult can press record for you. Let's sound out short-vowel words and read each one aloud.",
    "萨姆看到一张小狗 **dog** 的卡片。他先轻声拼 *d-o-g*，然后大声读出来：*dog*！\n\n可以请大人帮你按录音。我们来把短元音词一个一个大声读出来。",
  ),
  "hearing-short-vowel-words",
  allPictureWords,
  shortVowelContrast,
  t(
    "Look at the picture and the three letters. For **cat**, say each short sound—*c-a-t*—then blend them into one clear word: *cat*. An adult can press record.\n\n> **Watch out.** Say the middle vowel and the last sound clearly so *cat* does not sound like *cot* or *cap*.",
    "看图片和三个字母。读 **cat** 时，先念出每个音——*c-a-t*——再连成一个清晰的词：*cat*。可以请大人帮你按录音。\n\n> **注意。** 中间的短元音和尾音都要读清，别把 *cat* 读成 *cot* 或 *cap*。",
  ),
);

const sayingDigraphs = aloudTopic(
  "saying-words-with-digraphs",
  t("Reading Digraphs Aloud", "朗读含二合字母的词"),
  t("Read words with *sh*, *ch*, *th* and *ck* aloud.", "大声读出含 *sh*、*ch*、*th*、*ck* 的词。"),
  t(
    "Mia points to a picture of a **fish**. She reads **sh** as one smooth sound—*f-i-sh*—and says *fish* aloud!\n\nAn adult can press record for you. Let's read words with **sh**, **ch**, **th**, and **ck** aloud.",
    "米娅指着小鱼 **fish** 的图片。她把 **sh** 读成一个柔和的音——*f-i-sh*——大声读出 *fish*！\n\n可以请大人帮你按录音。我们来大声朗读含 **sh**、**ch**、**th** 和 **ck** 的词。",
  ),
  "hearing-words-with-digraphs",
  allDigraphPictureWords,
  digraphContrast,
  t(
    "Spot the two letters that make one sound: **sh** in *ship*, **ch** in *chin*, **th** in *bath*, and **ck** in *duck*. For **ship**, say *sh-i-p* as three sounds, then read *ship* aloud.\n\n> **Watch out.** Do not split **sh**, **ch**, or **th** into two separate letter sounds when you read.",
    "先找出合起来发一个音的两个字母：*ship* 里的 **sh**、*chin* 里的 **ch**、*bath* 里的 **th**、*duck* 里的 **ck**。读 **ship** 时念 *sh-i-p* 三个音，再大声读出 *ship*。\n\n> **注意。** 读的时候不要把 **sh**、**ch**、**th** 拆成两个单独的音。",
  ),
);

const sayingBlends = aloudTopic(
  "saying-words-with-blends",
  t("Reading Blends Aloud", "朗读含辅音连缀的词"),
  t("Read words with consonant blends, such as *frog* and *nest*, aloud.", "大声读出 *frog*、*nest* 这类含辅音连缀的词。"),
  t(
    "Leo sees a picture of a **crab**. He says both *c* and *r* right at the start—*c-r-a-b*—and reads *crab* aloud!\n\nAn adult can press record for you. Let's read words with consonant blends aloud.",
    "利奥看到螃蟹 **crab** 的图片。他把开头的 *c* 和 *r* 两个音都读得清清楚楚——*c-r-a-b*——大声读出 *crab*！\n\n可以请大人帮你按录音。我们来大声朗读含辅音连缀的词。",
  ),
  "hearing-words-with-blends",
  allBlendPictureWords,
  blendContrast,
  t(
    "In a blend, say both consonants quickly, one right after the other: **fr** in *frog*, **st** in *nest*. For **frog**, say *f-r-o-g* so both *f* and *r* are heard, then read *frog* aloud.\n\n> **Watch out.** Do not drop the second consonant of a blend—make sure *frog* does not come out as *fog*.",
    "读辅音连缀时，两个辅音一个接一个很快都要读出来：*frog* 里的 **fr**，*nest* 里的 **st**。读 **frog** 时念 *f-r-o-g*，让 *f* 和 *r* 都听得到，再大声读出 *frog*。\n\n> **注意。** 不要漏读连缀里的第二个辅音，别把 *frog* 读成了 *fog*。",
  ),
);

const sayingSilentE = aloudTopic(
  "saying-words-with-silent-e",
  t("Reading Silent E Aloud", "朗读含不发音 e 的词"),
  t("Read words with a silent e, such as *cake* and *kite*, aloud.", "大声读出 *cake*、*kite* 这类含不发音 e 的词。"),
  t(
    "Sam sees **cape** on a card. He keeps the **e** at the end quiet and lets **a** say its letter name: *cape*!\n\nAn adult can press record for you. Let's read silent-**e** words aloud.",
    "萨姆看到卡片上的 **cape**。他让结尾的 **e** 不出声，把 **a** 读成字母名：*cape*！\n\n可以请大人帮你按录音。我们来大声朗读带不发音 **e** 的词。",
  ),
  "hearing-words-with-silent-e",
  allSilentEPictureWords,
  silentEContrast,
  t(
    "When a word ends in a consonant and a silent **e**, keep the **e** silent and say the vowel's letter name. For **kite**, say long *i*—*k-i-t*—and read *kite* aloud.\n\n> **Watch out.** Do not say the final **e** out loud, and do not read the vowel short (*kit* instead of *kite*).",
    "一个词以辅音加不发音的 **e** 结尾时，**e** 不出声，元音读字母名。读 **kite** 时把 **i** 读成字母名，大声读出 *kite*。\n\n> **注意。** 不要把结尾的 **e** 读出声，也不要把元音读短（把 *kite* 读成 *kit*）。",
  ),
);

const sayingVowelTeams = aloudTopic(
  "saying-words-with-vowel-teams",
  t("Reading Vowel Teams Aloud", "朗读含元音组合的词"),
  t("Read words with vowel teams, such as *feet*, *rain* and *boat*, aloud.", "大声读出 *feet*、*rain*、*boat* 这类含元音组合的词。"),
  t(
    "Mia sees a picture of a **boat**. She reads **oa** together as the letter name **o** and says *boat* aloud!\n\nAn adult can press record for you. Let's read vowel-team words aloud.",
    "米娅看到小船 **boat** 的图片。她把 **oa** 合起来读成字母 **o** 的名字，大声读出 *boat*！\n\n可以请大人帮你按录音。我们来大声朗读含元音组合的词。",
  ),
  "hearing-words-with-vowel-teams",
  allVowelTeamPictureWords,
  vowelTeamContrast,
  t(
    "A vowel team makes one long vowel sound: **ee** and **ea** say *e* (*feet*, *leaf*), **ai** and **ay** say *a* (*rain*, *hay*), and **oa** says *o* (*boat*). For **feet**, read **ee** as one long *e* and say *feet* aloud.\n\n> **Watch out.** Do not split the two vowel letters into two separate sounds or shorten them into *fet*.",
    "元音组合合起来发一个长音：**ee** 和 **ea** 读 *e*（*feet*、*leaf*），**ai** 和 **ay** 读 *a*（*rain*、*hay*），**oa** 读 *o*（*boat*）。读 **feet** 时把 **ee** 读成一个长 *e*，大声读出 *feet*。\n\n> **注意。** 不要把组合里的两个元音分开读，也不要读短成 *fet*。",
  ),
);

/** sentencesAloud is the knowledge point that shows a decodable sentence and its picture and asks to read it aloud. */
const sentencesAloud: Generator = (rng: Rng) => {
  const s = rng.cycle(decodableSentences)!;
  const words = spokenWords(s.text);
  const half = words.slice(0, Math.ceil(words.length / 2)).join(" ");
  const sound = soundLabel(s.word);
  return spokenProblem(
    {
      prompt: t("Read the sentence aloud.", "大声朗读这个句子。"),
      figure: picture(s.word),
      solution: t(
        `Read "${s.text}" smoothly from start to end, sounding out **${s.word}**, ${sound.en}, clearly.\n\n**Check.** Play the recording below and read "${s.text}" once more alongside it—all ${words.length} words should be heard clearly with none skipped.`,
        `从头到尾连贯地读出 "${s.text}"，把关键词 **${s.word}**（读作 ${sound["zh-CN"].replace(/（/g, "，").replace(/）/g, "")}）读清楚。\n\n**检验。** 播放下面的录音并跟着再读一遍 "${s.text}"——全部 ${words.length} 个词都要读完整，不要漏词。`,
      ),
      ...withSounds(spoken(s.text)),
    },
    "read",
    s.text,
    [],
    [[half, cutShort(s.text, half)]],
    readSeconds(s.text),
  );
};

const sayingSentences: TopicDef = {
  id: "saying-decodable-sentences",
  title: t("Reading Sentences Aloud", "朗读短句"),
  summary: t("Read short sentences made of the words taught aloud.", "大声朗读由学过的词组成的短句。"),
  intro: t(
    "Leo opens his book and reads a whole line to Mom: *The pig is in the mud.* He reads every word smoothly from the big **T** to the full stop!\n\nAn adult can press record for you. Let's read short sentences aloud.",
    "利奥翻开小书，给妈妈读了一整句话：*The pig is in the mud.* 他从大写 **T** 一直顺畅地读到句号！\n\n可以请大人帮你按录音。我们来大声朗读短句。",
  ),
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
        "Read the sentence in your head one word at a time first. For *A cat can sit on a mat.*, sound out each word, then read the whole line aloud from the capital letter to the full stop.\n\n> **Watch out.** Do not skip little words like *a* or *the*, and keep your voice clear all the way to the last word.",
        "先在心里一个词一个词地默读。比如 *A cat can sit on a mat.*，先拼读每个词，再从大写字母一直连贯大声读到句号。\n\n> **注意。** 不要漏读 *a*、*the* 这样的小词，读到最后一个词也要保持声音清晰。",
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
