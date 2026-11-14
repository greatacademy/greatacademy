// Phonics: the course of kindergarten to grade 2. It starts with the side of phonics a child can practice from print
// and pictures: letters, then reading and spelling short-vowel words and words with digraphs, consonant blends, a silent
// e and vowel teams, sight words, and short sentences made of them. Sounds heard and spoken join it with audio.

import { type CourseDef, t } from "@ga/content";

/** coursePhonics is the phonics course of kindergarten to grade 2. */
export const coursePhonics: CourseDef = {
  id: "english-phonics",
  title: t("Phonics, Kindergarten to Grade 2", "自然拼读：幼儿园到二年级"),
  description: t(
    "The first steps of reading for young children, with an adult nearby: capital and small letters, ABC order and the first and last letters of words; then reading and spelling, matched to pictures, three-letter words with short vowels, words with the digraphs *sh*, *ch*, *th* and *ck*, words with consonant blends such as *frog* and *nest*, words with a silent e such as *cake* and *kite*, and words with vowel teams such as *feet*, *rain* and *boat*; common sight words such as *said* and *was*, in short sentences; and last, short sentences made only of what was taught. Every picture is drawn for this course. Sounds heard and spoken join with audio.",
    "面向幼儿的阅读第一步，需要大人在旁陪伴：大写和小写字母、字母表顺序、词的首字母和尾字母；然后借助图片读和拼写带短元音的三字母词、含二合字母 *sh*、*ch*、*th*、*ck* 的词、*frog*、*nest* 这样含辅音连缀的词、*cake*、*kite* 这样含不发音 e 的词，以及 *feet*、*rain*、*boat* 这样含元音组合的词；在短句里读写 *said*、*was* 这类常见词；最后是只用学过的内容组成的短句。所有图片都是为本课程绘制的。有了音频后再加入听音和发音练习。",
  ),
  group: t("English", "英语"),
  units: [
    {
      title: t("Letters", "字母"),
      modules: [
        { title: t("Letters and Their Order", "字母及其顺序"), topics: ["capital-and-small-letters", "alphabetical-order"] },
        { title: t("Letters in Words", "词中的字母"), topics: ["first-and-last-letters"] },
      ],
    },
    {
      title: t("Short Vowels", "短元音"),
      modules: [
        { title: t("Reading", "阅读"), topics: ["reading-short-vowel-words"] },
        { title: t("Spelling", "拼写"), topics: ["spelling-short-vowel-words"] },
      ],
    },
    {
      title: t("Digraphs", "二合字母"),
      modules: [
        { title: t("Reading", "阅读"), topics: ["reading-words-with-digraphs"] },
        { title: t("Spelling", "拼写"), topics: ["spelling-words-with-digraphs"] },
      ],
    },
    {
      title: t("Blends", "辅音连缀"),
      modules: [
        { title: t("Reading", "阅读"), topics: ["reading-words-with-blends"] },
        { title: t("Spelling", "拼写"), topics: ["spelling-words-with-blends"] },
      ],
    },
    {
      title: t("Silent E", "不发音的 e"),
      modules: [
        { title: t("Reading", "阅读"), topics: ["reading-words-with-silent-e"] },
        { title: t("Spelling", "拼写"), topics: ["spelling-words-with-silent-e"] },
      ],
    },
    {
      title: t("Vowel Teams", "元音组合"),
      modules: [
        { title: t("Reading", "阅读"), topics: ["reading-words-with-vowel-teams"] },
        { title: t("Spelling", "拼写"), topics: ["spelling-words-with-vowel-teams"] },
      ],
    },
    {
      title: t("Sight Words", "常见词"),
      modules: [
        { title: t("Reading", "阅读"), topics: ["reading-sight-words"] },
        { title: t("Spelling", "拼写"), topics: ["spelling-sight-words"] },
      ],
    },
    {
      title: t("Short Sentences", "短句"),
      modules: [
        { title: t("Reading", "阅读"), topics: ["reading-decodable-sentences"] },
        { title: t("Writing", "写作"), topics: ["writing-decodable-sentences"] },
      ],
    },
  ],
};
