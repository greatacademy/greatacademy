// Phonics: sight words, common words with a part that does not follow the rules a child has learned, such as *said*,
// *was* and *one*. Each is met in a short sentence: reading it, by choosing its spelling and by choosing the word the
// sentence needs, then spelling it, the tricky part first and then the whole word.

import { joinText, type Problem, type Rng, same, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-english";
import { spoken, withSounds } from "../../audio.ts";
import { letters, phonicsTopic } from "./kit.ts";

/** NearKind classifies a sight-word misspelling so feedback explains the exact kind of error. */
type NearKind = "sound" | "order" | "missing" | "extra" | "double";

/** NearSpelling pairs a wrong spelling with its error kind and, when needed, the letter(s) involved. */
type NearSpelling = readonly [spelling: string, kind: NearKind, part?: string];

/** SightWord is a common word with its tricky part, near spellings, a sentence that needs it, two words the sentence
 * does not take, and a note on the tricky part. */
interface SightWord {
  readonly word: string;
  /** gap is the word with each letter of its tricky part as "_": "s__d". */
  readonly gap: string;
  readonly near: readonly [NearSpelling, NearSpelling, NearSpelling];
  /** sentence has "___" where the word goes. */
  readonly sentence: string;
  readonly misfits: readonly [string, string];
  readonly note: readonly [en: string, zh: string];
}

const sightWords: readonly SightWord[] = [
  {
    word: "the",
    gap: "th_",
    near: [
      ["teh", "order"],
      ["tha", "sound", "a"],
      ["thi", "sound", "i"],
    ],
    sentence: "Look at ___ big dog.",
    misfits: ["of", "are"],
    note: ["**th** comes first, then **e**, said softly, like *uh*", "先写 **th**，再写 **e**，这个 **e** 读得很轻，像 *uh*"],
  },
  {
    word: "said",
    gap: "s__d",
    near: [
      ["sed", "sound", "e"],
      ["siad", "order"],
      ["sayd", "sound", "ay"],
    ],
    sentence: 'Mom ___, "Sit down."',
    misfits: ["was", "of"],
    note: ["**ai** here says *e* as in *bed*, not the name of **a**", "这里的 **ai** 读 *bed* 里的 *e*，不读 **a** 的字母名"],
  },
  {
    word: "was",
    gap: "w_s",
    near: [
      ["wuz", "sound", "uz"],
      ["woz", "sound", "oz"],
      ["waz", "sound", "z"],
    ],
    sentence: "The cat ___ on the bed.",
    misfits: ["of", "you"],
    note: ["**a** here does not sound as in *cat*, and **s** sounds like *z*", "这里的 **a** 不读 *cat* 里的音，**s** 读起来像 *z*"],
  },
  {
    word: "of",
    gap: "o_",
    near: [
      ["uv", "sound", "uv"],
      ["ov", "sound", "v"],
      ["ofe", "extra", "e"],
    ],
    sentence: "I have a cup ___ milk.",
    misfits: ["are", "was"],
    note: ["**f** here sounds like *v*", "这里的 **f** 读起来像 *v*"],
  },
  {
    word: "to",
    gap: "t_",
    near: [
      ["tu", "sound", "u"],
      ["tou", "extra", "u"],
      ["ta", "sound", "a"],
    ],
    sentence: "I go ___ the shop.",
    misfits: ["was", "of"],
    note: ["**o** here says *oo* as in *zoo*", "这里的 **o** 读 *zoo* 里的 *oo*"],
  },
  {
    word: "you",
    gap: "y__",
    near: [
      ["yu", "sound", "u"],
      ["yoo", "sound", "oo"],
      ["uoy", "order"],
    ],
    sentence: "Can ___ see the sun?",
    misfits: ["of", "said"],
    note: ["**ou** after **y** says *oo*", "**y** 后面的 **ou** 读 *oo*"],
  },
  {
    word: "they",
    gap: "th__",
    near: [
      ["thay", "sound", "ay"],
      ["thei", "sound", "ei"],
      ["tey", "missing"],
    ],
    sentence: "Look, ___ are on the bus.",
    misfits: ["of", "to"],
    note: ["**ey** here says the name of **a**", "这里的 **ey** 读 **a** 的字母名"],
  },
  {
    word: "are",
    gap: "ar_",
    near: [
      ["ar", "missing"],
      ["arr", "double", "r"],
      ["aer", "order"],
    ],
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
    near: [
      ["wer", "missing"],
      ["whir", "sound", "whir"],
      ["wure", "sound", "u"],
    ],
    sentence: "The hens ___ in the hut.",
    misfits: ["of", "to"],
    note: ["**were** sounds like *wur*; the **e** at the end is silent", "**were** 读起来像 *wur*；结尾的 **e** 不发音"],
  },
  {
    word: "what",
    gap: "wh_t",
    near: [
      ["wot", "sound", "wo"],
      ["whut", "sound", "u"],
      ["wat", "missing"],
    ],
    sentence: "Mom, ___ is in the box?",
    misfits: ["of", "are"],
    note: ["**wh** sounds like *w*, and **a** sounds like *u* in *cup*", "**wh** 读 *w*，**a** 读起来像 *cup* 里的 *u*"],
  },
  {
    word: "where",
    gap: "wh___",
    near: [
      ["wair", "sound", "wair"],
      ["whare", "sound", "are"],
      ["wher", "missing"],
    ],
    sentence: "Dad, ___ is my hat?",
    misfits: ["of", "said"],
    note: ["**ere** here says *air*, as in *chair*", "这里的 **ere** 读 *air*，像 *chair* 里的"],
  },
  {
    word: "here",
    gap: "h___",
    near: [
      ["hear", "sound", "ear"],
      ["heer", "sound", "eer"],
      ["hir", "sound", "i"],
    ],
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
    near: [
      ["thare", "sound", "are"],
      ["thair", "sound", "air"],
      ["ther", "missing"],
    ],
    sentence: "The ball is over ___.",
    misfits: ["of", "said"],
    note: ["**ere** here says *air*, as in *where*", "这里的 **ere** 读 *air*，和 *where* 里的一样"],
  },
  {
    word: "one",
    gap: "_ne",
    near: [
      ["won", "sound", "won"],
      ["wun", "sound", "wun"],
      ["wone", "extra", "w"],
    ],
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
    near: [
      ["tu", "sound", "u"],
      ["too", "sound", "oo"],
      ["tow", "order"],
    ],
    sentence: "I have ___ hands.",
    misfits: ["of", "was"],
    note: ["**two** says *too*, and its **w** is silent", "**two** 读 *too*，其中的 **w** 不发音"],
  },
  {
    word: "come",
    gap: "c_me",
    near: [
      ["cum", "sound", "um"],
      ["kum", "sound", "kum"],
      ["comm", "double", "m"],
    ],
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
    near: [
      ["sum", "sound", "um"],
      ["som", "missing"],
      ["sume", "sound", "u"],
    ],
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
    near: [
      ["du", "sound", "u"],
      ["doo", "sound", "oo"],
      ["dou", "sound", "ou"],
    ],
    sentence: "What ___ you see?",
    misfits: ["of", "was"],
    note: ["**o** here says *oo* as in *zoo*", "这里的 **o** 读 *zoo* 里的 *oo*"],
  },
  {
    word: "who",
    gap: "__o",
    near: [
      ["hoo", "sound", "hoo"],
      ["hu", "sound", "hu"],
      ["woh", "order"],
    ],
    sentence: "Mom, ___ is at the door?",
    misfits: ["of", "said"],
    note: ["**wh** here says *h*, and **o** says *oo*", "这里的 **wh** 读 *h*，**o** 读 *oo*"],
  },
  {
    word: "have",
    gap: "hav_",
    near: [
      ["hav", "missing"],
      ["haf", "sound", "f"],
      ["haev", "order"],
    ],
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
    near: [
      ["giv", "missing"],
      ["gieve", "extra", "e"],
      ["giev", "order"],
    ],
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
    near: [
      ["luv", "sound", "uv"],
      ["lov", "missing"],
      ["loove", "double", "o"],
    ],
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
    near: [
      ["poot", "sound", "oo"],
      ["putt", "double", "t"],
      ["pute", "extra", "e"],
    ],
    sentence: "Can you ___ the cup on the mat?",
    misfits: ["of", "was"],
    note: ["**u** here sounds like *oo* in *book*, not as in *cup*", "这里的 **u** 读起来像 *book* 里的 *oo*，不读 *cup* 里的音"],
  },
  {
    word: "friend",
    gap: "fr__nd",
    near: [
      ["frend", "sound", "e"],
      ["freind", "order"],
      ["frand", "sound", "a"],
    ],
    sentence: "Sam is my best ___.",
    misfits: ["of", "was"],
    note: ["**ie** here says *e* as in *bed*: **i** before **e**", "这里的 **ie** 读 *bed* 里的 *e*：**i** 在 **e** 前面"],
  },
  {
    word: "could",
    gap: "c___d",
    near: [
      ["cood", "sound", "oo"],
      ["cud", "sound", "u"],
      ["culd", "missing"],
    ],
    sentence: "I ___ not see the sun.",
    misfits: ["of", "are"],
    note: ["**oul** says *oo* as in *book*, and the **l** is silent", "**oul** 读 *book* 里的 *oo*，其中的 **l** 不发音"],
  },
  {
    word: "would",
    gap: "w___d",
    near: [
      ["wood", "sound", "oo"],
      ["wud", "sound", "u"],
      ["wuld", "missing"],
    ],
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
    near: [
      ["meny", "sound", "e"],
      ["mani", "sound", "i"],
      ["manny", "double", "n"],
    ],
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
    near: [
      ["eny", "sound", "e"],
      ["ani", "sound", "i"],
      ["anny", "double", "n"],
    ],
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
    near: [
      ["yor", "sound", "or"],
      ["yur", "sound", "ur"],
      ["yoor", "sound", "oo"],
    ],
    sentence: "Is this ___ hat?",
    misfits: ["of", "they"],
    note: ["**our** after **y** says *or*", "**y** 后面的 **our** 读 *or*"],
  },
  {
    word: "does",
    gap: "d__s",
    near: [
      ["dus", "sound", "u"],
      ["duz", "sound", "uz"],
      ["doz", "sound", "oz"],
    ],
    sentence: "The dog ___ not like the bath.",
    misfits: ["of", "are"],
    note: ["**oe** here sounds like *u* in *cup*, and **s** sounds like *z*", "这里的 **oe** 读起来像 *cup* 里的 *u*，**s** 读起来像 *z*"],
  },
];

/** tricky is the part of a sight word that its gap hides. */
const tricky = (s: SightWord) => [...s.word].filter((_, i) => s.gap[i] === "_").join("");

/** nearWords extracts the wrong spelling strings of a sight word. */
const nearWords = (s: SightWord) => s.near.map(([w]) => w);

for (const s of sightWords) {
  if (s.gap.length !== s.word.length || [...s.gap].some((c, i) => c !== "_" && c !== s.word[i]) || !s.gap.includes("_")) {
    throw new Error(`${s.gap} must be ${s.word} with its tricky part hidden`);
  }
  if (new Set([s.word, ...nearWords(s)]).size !== 4) throw new Error(`the near spellings of ${s.word} repeat`);
  for (const [w, kind, part] of s.near) {
    if ((kind === "sound" || kind === "extra" || kind === "double") && !part) {
      throw new Error(`${w} (${kind}) for ${s.word} must name its part`);
    }
  }
  if (s.sentence.split("___").length !== 2) throw new Error(`the sentence of ${s.word} needs one gap`);
  if (s.misfits.includes(s.word)) throw new Error(`${s.word} cannot be a misfit of its own sentence`);
  for (const m of s.misfits) if (!sightWords.some((o) => o.word === m)) throw new Error(`${m} is not a sight word`);
}
if (new Set(sightWords.map((s) => s.word)).size !== sightWords.length) throw new Error("sight words repeat");

/** filled writes the sentence of a sight word with the word in bold in its gap, turning inner double quotes to single. */
const filled = (s: SightWord) => s.sentence.replaceAll('"', "'").replace("___", `**${s.word}**`);

/** nearSpellingWhyNot explains a sight-word misspelling from its hand-tagged error kind, without revealing the answer. */
const nearSpellingWhyNot = (entry: NearSpelling, s: SightWord): Text => {
  const [wrong, kind, part = ""] = entry;
  switch (kind) {
    case "order":
      return t(
        `*${wrong}* has the right letters, but two of them are in the wrong order.`,
        `*${wrong}* 的字母都对，但有两个字母的顺序写反了。`,
      );
    case "missing":
      if (s.word.endsWith("e") && !wrong.endsWith("e")) {
        return t(`*${wrong}* leaves out the silent letter at the end of this sight word.`, `*${wrong}* 漏掉了这个常见词末尾不发音的字母。`);
      }
      return t(`*${wrong}* leaves out a letter from this sight word.`, `*${wrong}* 漏掉了这个常见词里的一个字母。`);
    case "extra":
      return t(
        `*${wrong}* adds an extra **${part}** that does not belong in this sight word.`,
        `*${wrong}* 多写了一个这个常见词里没有的 **${part}**。`,
      );
    case "double":
      return t(`*${wrong}* doubles the letter **${part}** by mistake.`, `*${wrong}* 把字母 **${part}** 多重复了一遍。`);
    case "sound":
      if (part === wrong) {
        return t(
          `*${wrong}* spells the whole word by sound (**${part}**) instead of using this sight word's real spelling.`,
          `*${wrong}* 把整个词照读音拼成了 **${part}**，没有用这个常见词真正的拼写。`,
        );
      }
      return t(
        `*${wrong}* writes **${part}** by sound instead of using this sight word's real spelling.`,
        `*${wrong}* 把 **${part}** 这部分照读音拼了出来，没有用这个常见词真正的拼写。`,
      );
  }
};

const why = (s: SightWord): Text => {
  const [en, zh] = s.note;
  const part = tricky(s);
  const firstNear = s.near[0][0];
  return t(
    `The word is **${s.word}** (*${letters(s.word)}*): ${en}.\n\n**Check.** Read the sentence aloud: "${filled(s)}" Then look at the tricky part: **${s.word}** uses **${part}** (not *${firstNear}*).`,
    `这个词是 **${s.word}**（*${letters(s.word)}*）：${zh}。\n\n**检验。** 把句子大声读一遍："${filled(s)}" 再看难点部分：**${s.word}** 里写的是 **${part}**（不是 *${firstNear}*）。`,
  );
};

/** sightSounds are the recordings of each sight word and its sentence, shown with the solution. */
const sightSounds = new Map(sightWords.map((s) => [s.word, withSounds(spoken(s.word), spoken(s.sentence.replace("___", s.word)))]));

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
      ...sightSounds.get(s.word),
      canonical: String(answer),
      wrong: options.map((_, i) => String(i)).filter((i) => i !== String(answer)),
      mistakes: wrong.map((w) => ({ response: String(options.indexOf(w)), feedback: whyNot(w) })),
    };
  };

/** typed asks to type a word or a part of one for a sentence. */
const typed =
  (question: Text, build: (s: SightWord) => { extra: string; accepted: string; wrong: readonly string[]; whyNot: (w: string) => Text }) =>
  (rng: Rng): Problem => {
    const s = rng.cycle(sightWords);
    const { extra, accepted, wrong, whyNot } = build(s);
    return {
      prompt: joinText([question, same(s.sentence), same(extra)]),
      answer: { checker: "word-form", expected: [accepted], input: { kind: "text" } },
      solution: why(s),
      ...sightSounds.get(s.word),
      canonical: accepted,
      wrong: [...wrong],
      mistakes: wrong.map((w) => ({ response: w, feedback: whyNot(w) })),
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
  intro: t(
    'Mia reads a storybook page: *Mom **said**, "Sit down."* The **s** and **d** sound normal, but **ai** says *e* instead of the name of **a**.\n\nWords we see all the time that have a tricky part are called **sight words**. Let\'s spot their real spelling and choose the sight word that fits a sentence.',
    '米娅读故事书：*Mom **said**, "Sit down."* 里面的 **s** 和 **d** 都按规则发音，但 **ai** 却读 *e*，不读 **a** 的字母名。\n\n天天见到、里面有一小块不按规则发音的词叫**常见词**（sight words）。我们来认清它们的真拼写，再选出放进句子说得通的词。',
  ),
  prerequisites: ["reading-short-vowel-words"],
  encompasses: [],
  xp: 10,
  knowledgePoints: [
    point(
      "choosing-the-spelling-of-a-sight-word",
      t("The Right Spelling", "正确的拼写"),
      t(
        "A **sight word** has a tricky part you remember by heart, while the rest follows the rules. Look at **was**: *The cat **was** on the bed.* It sounds like *wuz*, but it is spelled **w-a-s**.\n\nRead the sentence first, then look closely at every letter to find the real spelling.\n\n> **Watch out.** Do not pick a fake spelling that just matches how the word sounds, like *wuz* or *sed*.",
        "**常见词**里有一小块难点需要记住，其余部分照常拼读。看 **was**：*The cat **was** on the bed.* 它读起来像 *wuz*，但真正拼作 **w-a-s**。\n\n先读句子，再仔细看每个字母，找出真正的拼写。\n\n> **注意。** 不要错选照读音瞎拼出来的词，比如 *wuz* 或 *sed*。",
      ),
      choice(t("Which spelling fills the gap?", "哪个拼写可以填进空格？"), (s) => ({
        right: s.word,
        wrong: nearWords(s),
        whyNot: (w) => {
          const entry = s.near.find(([spelling]) => spelling === w);
          if (!entry) throw new Error(`no near entry for ${w}`);
          return nearSpellingWhyNot(entry, s);
        },
      })),
    ),
    point(
      "choosing-the-sight-word-for-a-sentence",
      t("The Word That Fits", "合适的词"),
      t(
        "Now every choice is a real sight word, and only one makes sense in the sentence. Try *I have a cup ___ milk.* with **of**, **are**, and **was**: only *a cup **of** milk* sounds like real English.\n\nTry each word in the blank and listen to the whole sentence.\n\n> **Watch out.** Do not pick a word just because you know it—read the whole sentence with it in the blank to hear if it makes sense.",
        "现在每个选项都是拼写正确的常见词，但只有一个放进句子说得通。试一试 *I have a cup ___ milk.*：把 **of**、**are**、**was** 分别放进去读，只有 *a cup **of** milk* 像平时说的话。\n\n把每个词都放进空格读一遍整句再决定。\n\n> **注意。** 不要看到眼熟的词就选，一定要放回句子里通读一遍，听听是不是说得通。",
      ),
      choice(t("Which word fills the gap?", "哪个词可以填进空格？"), (s) => ({
        right: s.word,
        wrong: s.misfits,
        whyNot: (w) => {
          const shown = s.sentence.replaceAll('"', "'").replace("___", w);
          return t(
            `Putting *${w}* in the blank makes "${shown}", which does not make sense as a sentence.`,
            `把 *${w}* 填进空格会变成 "${shown}"，这句话说不通。`,
          );
        },
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
  intro: t(
    "Sam writes a note: *You are my best **friend**.* He sounds out **fr** and **nd**, and remembers the tricky middle letters **ie** from reading.\n\nWhen you spell a sight word, write the regular sounds as usual and remember the tricky letters. First we will type just the tricky part, then the whole word.",
    "萨姆写了一张小纸条：*You are my best **friend**.* 他照读音写出了 **fr** 和 **nd**，又想起了中间需要记住的难点 **ie**。\n\n拼写常见词时，按规则的部分照音写，难点部分凭记忆写。我们先只打难点字母，再来写整个词。",
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
        "Read the sentence to know which word fits, then look at the blanks that hide its tricky part. For *Mom ___, 'Sit down.'* with **s _ _ d**, the word is *said* and the tricky middle is **ai**, so type **ai**.\n\nType only the missing letters in order.\n\n> **Watch out.** Do not spell the tricky part by sound alone (like typing **e** instead of **ai** in *said*).",
        "先读句子想出要填的词，再看横线藏起来的难点部分。比如 *Mom ___, 'Sit down.'* 给出 **s _ _ d**，这个词是 *said*，中间难点是 **ai**，所以键入 **ai**。\n\n按顺序只键入缺少的字母。\n\n> **注意。** 不要光靠读音去拼难点部分（比如把 *said* 中间的 **ai** 打成 **e**）。",
      ),
      typed(t("Type the letters missing from the word that fills the gap.", "键入填空的那个词中缺少的字母。"), (s) => ({
        extra: `**${spaced(s.gap)}**`,
        accepted: tricky(s),
        wrong: nearWords(s)
          .filter((w) => w.length === s.word.length)
          .map((w) => [...w].filter((_, i) => s.gap[i] === "_").join(""))
          .filter((w, i, all) => w !== tricky(s) && all.indexOf(w) === i),
        whyNot: (part) => {
          const entry = s.near.find(([w]) => w.length === s.word.length && [...w].filter((_, i) => s.gap[i] === "_").join("") === part);
          if (!entry) throw new Error(`no near entry for ${part}`);
          const reason = nearSpellingWhyNot(entry, s);
          return t(
            `With **${part}** in the gaps, the word reads *${entry[0]}*. ${reason.en}`,
            `把 **${part}** 填进空格，这个词就成了 *${entry[0]}*。${reason["zh-CN"]}`,
          );
        },
      })),
    ),
    point(
      "spelling-the-whole-sight-word",
      t("Spelling the Whole Word", "拼写整个词"),
      t(
        "Now write the whole word for the sentence. The hint shows the first letter and how many letters it has: for *I have ___ red hat.* with **o _ _**, write **one**.\n\nRead the sentence back with your word in it.\n\n> **Watch out.** Count the blanks so you do not drop a silent letter, like the **e** in *have* or the **w** in *two*.",
        "现在写出填空的整个词。提示会给出首字母和字母个数：比如 *I have ___ red hat.* 给出 **o _ _**，就写 **one**。\n\n写完后把词放进句子里再读一遍。\n\n> **注意。** 数一数横线个数，别漏掉不发音的字母，比如 *have* 结尾的 **e** 或 *two* 里的 **w**。",
      ),
      typed(t("Type the word that fills the gap.", "键入填空的那个词。"), (s) => ({
        extra: `**${spaced(s.word[0] + "_".repeat(s.word.length - 1))}**`,
        accepted: s.word,
        wrong: nearWords(s),
        whyNot: (w) => {
          const entry = s.near.find(([spelling]) => spelling === w);
          if (!entry) throw new Error(`no near entry for ${w}`);
          return nearSpellingWhyNot(entry, s);
        },
      })),
    ),
  ],
});

/** sightWordTopics are the phonics topics of sight words. */
export const sightWordTopics: readonly TopicDef[] = [readingSightWords, spellingSightWords];
