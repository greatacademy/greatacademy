// Phonics: sight words, common words with a part that does not follow the rules a child has learned, such as *said*,
// *was* and *one*. Each is met in a short sentence: reading it, by choosing its spelling and by choosing the word the
// sentence needs, then spelling it, the tricky part first and then the whole word.

import { joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { letters, phonicsTopic } from "./kit.ts";

/** SightWord is a common word with its tricky part, near spellings, a sentence that needs it, two words the sentence
 * does not take, and a note on the tricky part. */
interface SightWord {
  readonly word: string;
  /** gap is the word with each letter of its tricky part as "_": "s__d". */
  readonly gap: string;
  readonly near: readonly [string, string, string];
  /** sentence has "___" where the word goes. */
  readonly sentence: string;
  readonly misfits: readonly [string, string];
  readonly note: readonly [en: string, zh: string];
}

const sightWords: readonly SightWord[] = [
  {
    word: "the",
    gap: "th_",
    near: ["teh", "tha", "thi"],
    sentence: "Look at ___ big dog.",
    misfits: ["of", "are"],
    note: ["**th** comes first, then **e**, said softly, like *uh*", "先写 **th**，再写 **e**，这个 **e** 读得很轻，像 *uh*"],
  },
  {
    word: "said",
    gap: "s__d",
    near: ["sed", "siad", "sayd"],
    sentence: 'Mom ___, "Sit down."',
    misfits: ["was", "of"],
    note: ["**ai** here says *e* as in *bed*, not the name of **a**", "这里的 **ai** 读 *bed* 里的 *e*，不读 **a** 的字母名"],
  },
  {
    word: "was",
    gap: "w_s",
    near: ["wuz", "woz", "waz"],
    sentence: "The cat ___ on the bed.",
    misfits: ["of", "you"],
    note: ["**a** here does not sound as in *cat*, and **s** sounds like *z*", "这里的 **a** 不读 *cat* 里的音，**s** 读起来像 *z*"],
  },
  {
    word: "of",
    gap: "o_",
    near: ["uv", "ov", "ofe"],
    sentence: "I have a cup ___ milk.",
    misfits: ["are", "was"],
    note: ["**f** here sounds like *v*", "这里的 **f** 读起来像 *v*"],
  },
  {
    word: "to",
    gap: "t_",
    near: ["tu", "tou", "ta"],
    sentence: "I go ___ the shop.",
    misfits: ["was", "of"],
    note: ["**o** here says *oo* as in *zoo*", "这里的 **o** 读 *zoo* 里的 *oo*"],
  },
  {
    word: "you",
    gap: "y__",
    near: ["yu", "yoo", "uoy"],
    sentence: "Can ___ see the sun?",
    misfits: ["of", "said"],
    note: ["**ou** after **y** says *oo*", "**y** 后面的 **ou** 读 *oo*"],
  },
  {
    word: "they",
    gap: "th__",
    near: ["thay", "thei", "tey"],
    sentence: "Look, ___ are on the bus.",
    misfits: ["of", "to"],
    note: ["**ey** here says the name of **a**", "这里的 **ey** 读 **a** 的字母名"],
  },
  {
    word: "are",
    gap: "ar_",
    near: ["ar", "arr", "aer"],
    sentence: "The pigs ___ in the mud.",
    misfits: ["was", "of"],
    note: [
      "**are** says *ar*; the **e** at the end is silent and does not change the **a**",
      "**are** 读 *ar*；结尾的 **e** 不发音，也不改变 **a** 的读音",
    ],
  },
  {
    word: "were",
    gap: "w_re",
    near: ["wer", "whir", "wure"],
    sentence: "The hens ___ in the hut.",
    misfits: ["of", "to"],
    note: ["**were** sounds like *wur*; the **e** at the end is silent", "**were** 读起来像 *wur*；结尾的 **e** 不发音"],
  },
  {
    word: "what",
    gap: "wh_t",
    near: ["wot", "whut", "wat"],
    sentence: "Mom, ___ is in the box?",
    misfits: ["of", "are"],
    note: ["**wh** sounds like *w*, and **a** sounds like *u* in *cup*", "**wh** 读 *w*，**a** 读起来像 *cup* 里的 *u*"],
  },
  {
    word: "where",
    gap: "wh___",
    near: ["wair", "whare", "wher"],
    sentence: "Dad, ___ is my hat?",
    misfits: ["of", "said"],
    note: ["**ere** here says *air*, as in *chair*", "这里的 **ere** 读 *air*，像 *chair* 里的"],
  },
  {
    word: "here",
    gap: "h___",
    near: ["hear", "heer", "hir"],
    sentence: "Come and sit ___ with me.",
    misfits: ["of", "was"],
    note: [
      "**ere** says *ear*, and the **e** at the end is silent; *hear* is another word, for what ears do",
      "**ere** 读 *ear*，结尾的 **e** 不发音；*hear* 是另一个词，意思是用耳朵听",
    ],
  },
  {
    word: "there",
    gap: "th___",
    near: ["thare", "thair", "ther"],
    sentence: "The ball is over ___.",
    misfits: ["of", "said"],
    note: ["**ere** here says *air*, as in *where*", "这里的 **ere** 读 *air*，和 *where* 里的一样"],
  },
  {
    word: "one",
    gap: "_ne",
    near: ["won", "wun", "wone"],
    sentence: "I have ___ red hat.",
    misfits: ["of", "are"],
    note: [
      "**one** says *wun*: its first sound, *w*, has no letter; *won* is another word",
      "**one** 读 *wun*：开头的 *w* 音没有字母；*won* 是另一个词",
    ],
  },
  {
    word: "two",
    gap: "t_o",
    near: ["tu", "tuw", "tow"],
    sentence: "I have ___ hands.",
    misfits: ["of", "was"],
    note: ["**two** says *too*, and its **w** is silent", "**two** 读 *too*，其中的 **w** 不发音"],
  },
  {
    word: "come",
    gap: "c_me",
    near: ["cum", "kum", "comm"],
    sentence: "Please ___ to my house.",
    misfits: ["of", "was"],
    note: [
      "**o** here sounds like *u* in *cup*, and the **e** at the end is silent",
      "这里的 **o** 读起来像 *cup* 里的 *u*，结尾的 **e** 不发音",
    ],
  },
  {
    word: "some",
    gap: "s_me",
    near: ["sum", "som", "sume"],
    sentence: "Can I have ___ jam?",
    misfits: ["of", "was"],
    note: [
      "**o** here sounds like *u* in *cup*, and the **e** at the end is silent; *sum* is another word",
      "这里的 **o** 读起来像 *cup* 里的 *u*，结尾的 **e** 不发音；*sum* 是另一个词",
    ],
  },
  {
    word: "do",
    gap: "d_",
    near: ["du", "doo", "dou"],
    sentence: "What ___ you see?",
    misfits: ["of", "was"],
    note: ["**o** here says *oo* as in *zoo*", "这里的 **o** 读 *zoo* 里的 *oo*"],
  },
  {
    word: "who",
    gap: "__o",
    near: ["hoo", "hu", "woh"],
    sentence: "Mom, ___ is at the door?",
    misfits: ["of", "said"],
    note: ["**wh** here says *h*, and **o** says *oo*", "这里的 **wh** 读 *h*，**o** 读 *oo*"],
  },
  {
    word: "have",
    gap: "hav_",
    near: ["hav", "haf", "haev"],
    sentence: "I ___ a pet cat.",
    misfits: ["of", "the"],
    note: [
      "the **a** stays short, as in *cat*, but an **e** comes last, because English words do not end in **v**",
      "**a** 仍读 *cat* 里的短音，但结尾要加 **e**，因为英语单词不以 **v** 结尾",
    ],
  },
  {
    word: "give",
    gap: "giv_",
    near: ["giv", "gieve", "gyve"],
    sentence: "Can you ___ me a hug?",
    misfits: ["of", "was"],
    note: [
      "the **i** stays short, as in *pig*, but an **e** comes last, because English words do not end in **v**",
      "**i** 仍读 *pig* 里的短音，但结尾要加 **e**，因为英语单词不以 **v** 结尾",
    ],
  },
  {
    word: "love",
    gap: "l_ve",
    near: ["luv", "lov", "loove"],
    sentence: "With ___ from Mia.",
    misfits: ["of", "was"],
    note: [
      "**o** sounds like *u* in *cup*, and an **e** comes last, because English words do not end in **v**",
      "**o** 读起来像 *cup* 里的 *u*，结尾要加 **e**，因为英语单词不以 **v** 结尾",
    ],
  },
  {
    word: "put",
    gap: "p_t",
    near: ["poot", "pud", "pute"],
    sentence: "Can you ___ the cup on the mat?",
    misfits: ["of", "was"],
    note: ["**u** here sounds like *oo* in *book*, not as in *cup*", "这里的 **u** 读起来像 *book* 里的 *oo*，不读 *cup* 里的音"],
  },
  {
    word: "friend",
    gap: "fr__nd",
    near: ["frend", "freind", "frand"],
    sentence: "Sam is my best ___.",
    misfits: ["of", "was"],
    note: ["**ie** here says *e* as in *bed*: **i** before **e**", "这里的 **ie** 读 *bed* 里的 *e*：**i** 在 **e** 前面"],
  },
  {
    word: "could",
    gap: "c___d",
    near: ["cood", "cud", "culd"],
    sentence: "I ___ not see the sun.",
    misfits: ["of", "are"],
    note: ["**oul** says *oo* as in *book*, and the **l** is silent", "**oul** 读 *book* 里的 *oo*，其中的 **l** 不发音"],
  },
  {
    word: "would",
    gap: "w___d",
    near: ["wood", "wud", "wuld"],
    sentence: "Mom, ___ you like a cup of tea?",
    misfits: ["of", "was"],
    note: [
      "**oul** says *oo* as in *book*, and the **l** is silent; *wood* is another word, what trees are made of",
      "**oul** 读 *book* 里的 *oo*，其中的 **l** 不发音；*wood* 是另一个词，指木头",
    ],
  },
  {
    word: "many",
    gap: "m_ny",
    near: ["meny", "mani", "manny"],
    sentence: "There are so ___ ants!",
    misfits: ["of", "was"],
    note: [
      "**a** here says *e* as in *bed*, and **y** at the end says the name of **e**",
      "这里的 **a** 读 *bed* 里的 *e*，结尾的 **y** 读 **e** 的字母名",
    ],
  },
  {
    word: "any",
    gap: "_ny",
    near: ["eny", "ani", "enny"],
    sentence: "Do you have ___ jam?",
    misfits: ["of", "was"],
    note: [
      "**a** here says *e* as in *bed*, and **y** at the end says the name of **e**",
      "这里的 **a** 读 *bed* 里的 *e*，结尾的 **y** 读 **e** 的字母名",
    ],
  },
  {
    word: "your",
    gap: "y___",
    near: ["yor", "yur", "yoor"],
    sentence: "Is this ___ hat?",
    misfits: ["of", "they"],
    note: ["**our** after **y** says *or*", "**y** 后面的 **our** 读 *or*"],
  },
  {
    word: "does",
    gap: "d__s",
    near: ["dus", "duz", "doz"],
    sentence: "The dog ___ not like the bath.",
    misfits: ["of", "are"],
    note: ["**oe** here sounds like *u* in *cup*, and **s** sounds like *z*", "这里的 **oe** 读起来像 *cup* 里的 *u*，**s** 读起来像 *z*"],
  },
];

/** tricky is the part of a sight word that its gap hides. */
const tricky = (s: SightWord) => [...s.word].filter((_, i) => s.gap[i] === "_").join("");

for (const s of sightWords) {
  if (s.gap.length !== s.word.length || [...s.gap].some((c, i) => c !== "_" && c !== s.word[i]) || !s.gap.includes("_")) {
    throw new Error(`${s.gap} must be ${s.word} with its tricky part hidden`);
  }
  if (new Set([s.word, ...s.near]).size !== 4) throw new Error(`the near spellings of ${s.word} repeat`);
  if (s.sentence.split("___").length !== 2) throw new Error(`the sentence of ${s.word} needs one gap`);
  if (s.misfits.includes(s.word)) throw new Error(`${s.word} cannot be a misfit of its own sentence`);
  for (const m of s.misfits) if (!sightWords.some((o) => o.word === m)) throw new Error(`${m} is not a sight word`);
}
if (new Set(sightWords.map((s) => s.word)).size !== sightWords.length) throw new Error("sight words repeat");

/** filled writes the sentence of a sight word with the word in bold in its gap. */
const filled = (s: SightWord) => s.sentence.replace("___", `**${s.word}**`);

const why = (s: SightWord): Text => {
  const [en, zh] = s.note;
  return t(
    `${filled(s)} The word is **${s.word}**, *${letters(s.word)}*: ${en}. Remember that part.`,
    `${filled(s)} 这个词是 **${s.word}**，*${letters(s.word)}*：${zh}。记住这一部分。`,
  );
};

/** choice asks a question about a sentence with options to choose among, with feedback on each wrong option. */
const choice =
  (question: Text, build: (s: SightWord) => { right: string; wrong: readonly string[]; whyNot: (w: string) => Text }) =>
  (rng: Rng): Problem => {
    const s = rng.cycle(sightWords);
    const { right, wrong, whyNot } = build(s);
    const options = rng.shuffle([right, ...wrong]);
    const answer = options.indexOf(right);
    return {
      prompt: joinText([question, same(s.sentence)]),
      answer: { checker: "choice", expected: answer, input: { kind: "choice", options: options.map(same) } },
      solution: why(s),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: wrong.map((w) => ({ response: String(options.indexOf(w)), feedback: whyNot(w) })),
    };
  };

/** typed asks to type a word or a part of one for a sentence. */
const typed =
  (question: Text, build: (s: SightWord) => { extra: string; accepted: string; wrong: readonly string[] }) =>
  (rng: Rng): Problem => {
    const s = rng.cycle(sightWords);
    const { extra, accepted, wrong } = build(s);
    return {
      prompt: joinText([question, same(s.sentence), same(extra)]),
      answer: { checker: "word-form", expected: [accepted], input: { kind: "text" } },
      solution: why(s),
      canonical: accepted,
      wrong: [...wrong],
    };
  };

/** spaced writes a gap with spaces between its letters: "s _ _ d". */
const spaced = (gap: string) => [...gap].join(" ");

const readingSightWords = phonicsTopic({
  id: "reading-sight-words",
  title: t("Reading Sight Words", "读常见词"),
  summary: t(
    "Common words with a tricky part, such as *said*, *was*, *one* and *friend*, read in short sentences.",
    "*said*、*was*、*one*、*friend* 这类有难点的常见词，放在短句里读。",
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-spelling-of-a-sight-word",
      t("The Right Spelling", "正确的拼写"),
      t(
        "Some words that we read all the time have a part that does not follow the rules: *said* sounds like *sed*, *was* like *wuz*, and *one* like *wun*. These are **sight words**. Sound out the parts that follow the rules, and learn the tricky part by heart, so that you know the word the moment you see it.\n\nRead the sentence, then find the word that fills the gap, spelled the way it is really written. The wrong spellings are often how the word sounds, so look at every letter.",
        "有些天天都会读到的词，其中一部分不按规则发音：*said* 读起来像 *sed*，*was* 像 *wuz*，*one* 像 *wun*。这些叫作**常见词**（sight words）。按规则的部分照常拼读，难点部分要记熟，这样一看到就认得出。\n\n读句子，然后找出填空的那个词，要选它真正的写法。错误的拼写常常是照读音写的，所以要看清每个字母。",
      ),
      choice(t("Which spelling fills the gap?", "哪个拼写可以填进空格？"), (s) => ({
        right: s.word,
        wrong: s.near,
        whyNot: (w) =>
          t(
            `*${w}* is not how the word is written. ${s.note[0][0]?.toUpperCase()}${s.note[0].slice(1)}: **${s.word}**.`,
            `*${w}* 不是这个词的写法。${s.note[1]}：**${s.word}**。`,
          ),
      })),
    ),
    point(
      "choosing-the-sight-word-for-a-sentence",
      t("The Word That Fits", "合适的词"),
      t(
        "Now every option is a sight word, spelled right, but only one makes sense in the sentence. Read the sentence with each word in the gap and listen: does it sound like something people say? Choose the one that does.",
        "现在每个选项都是拼写正确的常见词，但只有一个放进句子里说得通。把每个词放进空格读一读，听一听：像不像人们会说的话？选出说得通的那个。",
      ),
      choice(t("Which word fills the gap?", "哪个词可以填进空格？"), (s) => ({
        right: s.word,
        wrong: s.misfits,
        whyNot: (w) =>
          t(
            `With *${w}* the sentence reads "${s.sentence.replace("___", w)}", which does not make sense. It needs **${s.word}**.`,
            `填 *${w}*，句子就成了 "${s.sentence.replace("___", w)}"，说不通。这里要填 **${s.word}**。`,
          ),
      })),
    ),
  ],
});

const spellingSightWords = phonicsTopic({
  id: "spelling-sight-words",
  title: t("Spelling Sight Words", "拼写常见词"),
  summary: t(
    "Writing common words with a tricky part, in short sentences: the tricky part first, then the whole word.",
    "在短句里写出有难点的常见词：先写难点部分，再写整个词。",
  ),
  prerequisites: ["reading-sight-words", "spelling-short-vowel-words"],
  encompasses: [
    { topic: "reading-sight-words", weight: 0.3 },
    { topic: "spelling-short-vowel-words", weight: 0.3 },
  ],
  xp: 10,
  knowledgePoints: [
    point(
      "the-tricky-part-of-a-sight-word",
      t("The Tricky Part", "难点部分"),
      t(
        "Read the sentence and find the word it needs. Some of its letters are shown; the gaps are its tricky part, the letters you cannot work out from the sound alone. Type the missing letters in order, as you remember them: *said* is written **s ai d**.",
        "读句子，想出它需要的词。词的一部分字母已经给出；空格是它的难点部分，也就是光听读音写不出来的字母。按顺序键入你记住的那几个字母：*said* 写作 **s ai d**。",
      ),
      typed(t("Type the letters missing from the word that fills the gap.", "键入填空的那个词中缺少的字母。"), (s) => ({
        extra: `**${spaced(s.gap)}**`,
        accepted: tricky(s),
        wrong: s.near
          .filter((w) => w.length === s.word.length)
          .map((w) => [...w].filter((_, i) => s.gap[i] === "_").join(""))
          .filter((w, i, all) => w !== tricky(s) && all.indexOf(w) === i),
      })),
    ),
    point(
      "spelling-the-whole-sight-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word that fills the gap. You are told its first letter and how many letters it has. Write the parts that follow the rules from their sounds, and the tricky part from memory. Then read the sentence again with your word in it.",
        "现在写出填空的整个词。题目会告诉你它的首字母和字母个数。按规则的部分照读音写，难点部分凭记忆写。写完后把你的词放进句子再读一遍。",
      ),
      typed(t("Type the word that fills the gap.", "键入填空的那个词。"), (s) => ({
        extra: `**${spaced(s.word[0] + "_".repeat(s.word.length - 1))}**`,
        accepted: s.word,
        wrong: s.near,
      })),
    ),
  ],
});

/** sightWordTopics are the phonics topics of sight words. */
export const sightWordTopics: readonly TopicDef[] = [readingSightWords, spellingSightWords];
