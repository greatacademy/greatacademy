// Grade 11: word study: Latin and Greek roots of the year, and the suffixes that turn words into nouns.

import type { TopicDef } from "@ga/content";
import { partLines, parts } from "../grade-6/kit.ts";

const latin9 = parts({
  id: "latin-roots-9",
  title: ["Latin Roots 9", "拉丁词根 9"],
  summary: [
    "Ten more Latin roots: anim, fug, solv, tempor, tang, cad, pung, vor, flict and cumb.",
    "另外十个拉丁词根：anim、fug、solv、tempor、tang、cad、pung、vor、flict 和 cumb。",
  ],
  after: ["latin-roots-8"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    anim|mind, spirit or life|心灵，精神，生命|animosity|strong dislike or hostility felt in the mind|unanimous|agreed by everyone, as if of one mind|magnanimous|generous and forgiving, great in spirit
    fug|flee|逃|fugitive|a person who is running away, especially from the law|refuge|a place to flee to for safety|centrifugal|moving or fleeing away from the center
    solv|loosen or release|松开，解开|dissolve|to loosen into a liquid, or to bring to an end|absolve|to release someone from blame or guilt|insolvent|unable to pay one's debts, without money to release
    tempor|time|时间|temporary|lasting only for a time|contemporary|living or happening at the same time|extemporaneous|spoken or done without preparation, out of the moment
    tang|touch|接触|tangible|able to be touched; real|intangible|unable to be touched or measured|tangent|a line that touches a curve at one point
    cad|fall|落下|cadence|the falling rhythm of a voice or of music|decadent|having fallen into a low moral state through love of pleasure|cascade|a waterfall, or a series of things that fall one after another
    pung|prick or point|刺|pungent|sharp and strong in smell or taste, as if pricking|punctilious|very careful about every small point of behavior|compunction|a prick of guilt that stops someone from doing wrong
    vor|eat|吃|voracious|eating great amounts, or very eager|herbivore|an animal that eats plants|omnivorous|eating all kinds of food
    flict|strike|打击|inflict|to strike someone with something harmful|afflict|to cause pain or trouble to|conflict|a struggle, as when two forces strike against each other
    cumb|lie down|躺下|succumb|to give in and fall, as if lying down beneath something|incumbent|the person who holds an office, or necessary as a duty|recumbent|lying down
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Anim* means mind or spirit, *fug* flee, *solv* loosen, *tempor* time, *tang* touch, *cad* fall, *pung* prick, *vor* eat, *flict* strike and *cumb* lie down. A *fugitive* flees; a *tangible* object can be touched; a *voracious* reader eats up books. Knowing the root lets you guess the meaning of a word you have never seen.",
      '另外十个拉丁**词根**。*anim* 意为心灵或精神，*fug* 逃，*solv* 松开，*tempor* 时间，*tang* 接触，*cad* 落下，*pung* 刺，*vor* 吃，*flict* 打击，*cumb* 躺下。*fugitive* 是逃跑的人；*tangible* 的东西摸得到；*voracious* 的读者大口"吞食"书本。知道词根，就能猜出没见过的词的意思。',
    ],
    [
      "Prefixes steer the root. With *anim*, *un-* (one) gives **unanimous**, of one mind, and *magn-* (great) gives **magnanimous**, great in spirit. With *solv*, *ab-* (away) gives **absolve**, to release from blame. With *tempor*, *con-* (with) gives **contemporary**, of the same time. With *cumb*, *suc-* (under) gives **succumb**, to fall beneath. Read the prefix, then the root, and put them together.",
      "前缀决定词根的方向。与 *anim* 搭配，*un-*（一）构成 **unanimous**，一致同意的；*magn-*（大）构成 **magnanimous**，宽宏大量的。与 *solv* 搭配，*ab-*（离开）构成 **absolve**，免除罪责。与 *tempor* 搭配，*con-*（共同）构成 **contemporary**，同时代的。与 *cumb* 搭配，*suc-*（在下）构成 **succumb**，屈服。先读前缀，再读词根，然后把意思合起来。",
    ],
  ],
});

const greek8 = parts({
  id: "greek-roots-8",
  title: ["Greek Roots 8", "希腊词根 8"],
  summary: [
    "Ten more Greek roots: crit, phob, thes, bibl, erg, icon, hedon, plast, glyph and esthe.",
    "另外十个希腊词根：crit、phob、thes、bibl、erg、icon、hedon、plast、glyph 和 esthe。",
  ],
  after: ["greek-roots-7"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    crit|judge|判断|criterion|a standard by which something is judged|critique|a careful judgment of a work's strengths and weaknesses|hypocrite|a person who judges others by standards they do not keep
    phob|fear|恐惧|phobia|a strong, unreasonable fear|xenophobia|fear or hatred of foreigners|technophobe|a person who fears or dislikes new technology
    thes|put or place|放置|thesis|a claim put forward to be argued|synthesis|ideas put together into a whole|hypothesis|an idea put under testing as a possible explanation
    bibl|book|书|bibliography|a list of the books and sources used in a piece of writing|bibliophile|a person who loves books|bibliotherapy|the use of reading to help heal the mind
    erg|work|工作|energy|the power to do work|ergonomic|designed to make work comfortable and efficient|synergy|the extra effect when parts work together
    icon|image|图像|iconic|famous as an image or symbol of something|iconoclast|a person who attacks cherished beliefs, once a breaker of images|iconography|the images and symbols used in a work of art
    hedon|pleasure|快乐|hedonism|the belief that pleasure is the most important thing in life|hedonist|a person who lives for pleasure|hedonic|having to do with pleasure
    plast|mold or shape|塑造|plastic|easily molded into shapes|plasticity|the ability to be shaped or to change, as in the brain|protoplasm|the living matter of a cell, the first molded substance
    glyph|carving|雕刻|hieroglyph|a picture symbol carved or written in the old Egyptian script|petroglyph|a carving made in rock|glyph|a carved or written symbol
    esthe|feeling or sense|感觉|anesthesia|the loss of feeling, given before surgery|aesthetic|having to do with beauty and the senses|kinesthetic|having to do with the sense of the body's movement
  `),
  explanations: [
    [
      "Ten more Greek **roots**. *Crit* means judge, *phob* fear, *thes* put, *bibl* book, *erg* work, *icon* image, *hedon* pleasure, *plast* mold, *glyph* carving and *esthe* feeling. A *criterion* is a standard of judgment; a *phobia* is a fear; a *thesis* is a claim put forward; *ergonomic* chairs make work easier.",
      "另外十个希腊**词根**。*crit* 意为判断，*phob* 恐惧，*thes* 放置，*bibl* 书，*erg* 工作，*icon* 图像，*hedon* 快乐，*plast* 塑造，*glyph* 雕刻，*esthe* 感觉。*criterion* 是判断的标准；*phobia* 是恐惧；*thesis* 是提出的论点；*ergonomic* 的椅子让工作更轻松。",
    ],
    [
      "Greek words are often built from two roots or a prefix and a root. *Xeno* (stranger) and *phob* give **xenophobia**, fear of strangers. *Syn-* (together) and *thes* give **synthesis**, putting together. *An-* (without) and *esthe* give **anesthesia**, without feeling. *Icon* and *clast* (break) give **iconoclast**, a breaker of images. Split the word and read each part.",
      "希腊语词常由两个词根或一个前缀加一个词根构成。*xeno*（陌生人）加 *phob* 构成 **xenophobia**，惧外。*syn-*（一起）加 *thes* 构成 **synthesis**，综合。*an-*（没有）加 *esthe* 构成 **anesthesia**，失去感觉。*icon* 加 *clast*（打破）构成 **iconoclast**，打破偶像的人。把词拆开，逐个读出各部分。",
    ],
  ],
});

const nounSuffixes = parts({
  id: "word-parts-that-form-nouns",
  title: ["Word Parts That Form Nouns", "构成名词的词缀"],
  summary: [
    "Ten suffixes that turn words into nouns: -tude, -ism, -ence, -ity, -ure, -cy, -ery, -age, -hood and -mony.",
    "十个把词变成名词的后缀：-tude、-ism、-ence、-ity、-ure、-cy、-ery、-age、-hood 和 -mony。",
  ],
  after: ["word-parts-that-form-adjectives"],
  kind: ["suffix", "后缀"],
  list: partLines(`
    -tude|the state or quality of|……的状态或性质|fortitude|the quality of being brave and strong in pain or trouble|gratitude|the state of being thankful|magnitude|the quality of being great in size or importance
    -ism|a belief, system or practice|主义，学说，做法|stoicism|the practice of bearing pain or trouble without complaint|realism|the practice of showing things as they really are|skepticism|the habit of doubting claims until they are proved
    -ence|the act or state of|……的行为或状态|dependence|the state of relying on someone or something|reticence|the state of saying little about one's thoughts|benevolence|the quality of wishing others well
    -ity|the quality or condition of|……的性质或状况|integrity|the quality of being honest and keeping to one's principles|anonymity|the condition of being unknown by name|brevity|the quality of being short
    -ure|the act, process or result of|……的行为、过程或结果|closure|the act of closing, or a feeling that something has ended|exposure|the state of being uncovered or shown|legislature|the body that makes laws
    -cy|the state, quality or office of|……的状态、性质或职位|literacy|the ability to read and write|diplomacy|the skill of managing relations between nations|bankruptcy|the state of being unable to pay one's debts
    -ery|a place, practice or collection|场所，行为，集合|bakery|a place where bread is baked|bravery|the practice of being brave|machinery|a collection of machines
    -age|an action, a result or a collection|行为，结果，集合|pilgrimage|the act of a journey to a holy place|wreckage|the broken remains after a crash|baggage|the bags and cases carried on a journey
    -hood|the state or time of|……的状态或时期|childhood|the time of being a child|falsehood|the state of being false, or a lie|likelihood|the state of being likely
    -mony|the state or result of|……的状态或结果|harmony|the state of agreement and peace|testimony|the result of bearing witness, a statement in court|acrimony|bitterness and anger in words or manner
  `),
  explanations: [
    [
      "A **suffix** can turn a word into a noun and add a meaning of its own. *-tude*, *-ity* and *-hood* name a state or quality: *fortitude* is the quality of being strong, *integrity* of being honest, *childhood* the state of being a child. *-ism* names a belief or practice: *skepticism* is the habit of doubting. *-ery* can name a place: a *bakery*. *-age* can name a result or a collection: *wreckage*, *baggage*. Nouns made with these suffixes help you write about ideas, not only about things.",
      "**后缀**可以把词变成名词，并加上自己的意思。*-tude*、*-ity* 和 *-hood* 表示状态或性质：*fortitude* 是坚强的品质，*integrity* 是正直，*childhood* 是童年。*-ism* 表示信念或做法：*skepticism* 是怀疑的习惯。*-ery* 可以表示场所：*bakery*。*-age* 可以表示结果或集合：*wreckage*、*baggage*。用这些后缀构成的名词能帮助你书写思想，而不只是事物。",
    ],
    [
      "To find the word for a definition, look for the base inside it, then the suffix. *The state of being thankful* is *grat* (thanks) with *-tude*: **gratitude**. *The condition of being unknown by name* is *anonymous* with *-ity*: **anonymity**. *The ability to read and write* is *literate* with *-cy*: **literacy**. Watch for spelling changes: *brief* becomes **brevity**, *close* becomes **closure**.",
      "要找出符合释义的词，先找出其中的词干，再找后缀。*the state of being thankful* 是 *grat*（感谢）加 *-tude*：**gratitude**。*the condition of being unknown by name* 是 *anonymous* 加 *-ity*：**anonymity**。*the ability to read and write* 是 *literate* 加 *-cy*：**literacy**。注意拼写变化：*brief* 变成 **brevity**，*close* 变成 **closure**。",
    ],
  ],
});

/** wordStudyTopics11 are the word study topics of grade 11. */
export const wordStudyTopics11: readonly TopicDef[] = [latin9, greek8, nounSuffixes];
