// Phonics: the course of kindergarten to grade 2. It starts with the side of phonics a child can practice from print
// and pictures: letters, then reading and spelling short-vowel words and words with digraphs. Sounds heard and spoken
// join it with audio.

import { type CourseDef, t } from "@ga/content";

/** coursePhonics is the phonics course of kindergarten to grade 2. */
export const coursePhonics: CourseDef = {
  id: "english-phonics",
  title: t("Phonics, Kindergarten to Grade 2", "自然拼读：幼儿园到二年级"),
  description: t(
    "The first steps of reading for young children, with an adult nearby: capital and small letters, ABC order and the first and last letters of words, then reading and spelling three-letter words with short vowels and words with the digraphs *sh*, *ch*, *th* and *ck*, matched to pictures. Every picture is drawn for this course. Blends, long vowels and sight words follow, and sounds heard and spoken join with audio.",
    "面向幼儿的阅读第一步，需要大人在旁陪伴：大写和小写字母、字母表顺序、词的首字母和尾字母，然后借助图片读和拼写带短元音的三字母词，以及含二合字母 *sh*、*ch*、*th*、*ck* 的词。所有图片都是为本课程绘制的。之后是辅音连缀、长元音和常见词；有了音频后再加入听音和发音练习。",
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
  ],
};
