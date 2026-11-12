// Grade 9: word study: Latin and Greek roots of the year, and the suffixes and prefixes that turn words into verbs.

import type { TopicDef } from "@ga/content";
import { partLines, parts } from "../grade-6/kit.ts";

const latin7 = parts({
  id: "latin-roots-7",
  title: ["Latin Roots 7", "拉丁词根 7"],
  summary: [
    "Ten more Latin roots: bell, pug, ambul, ced, luc, mand, nat, sequ, terr and err.",
    "另外十个拉丁词根：bell、pug、ambul、ced、luc、mand、nat、sequ、terr 和 err。",
  ],
  after: ["latin-roots-6"],
  kind: ["Latin root", "拉丁词根"],
  list: partLines(`
    bell|war|战争|belligerent|eager to fight or quarrel|bellicose|eager for war or a fight|antebellum|belonging to the years before a war
    pug|fight|打斗|pugnacious|quick to argue or fight|repugnant|so unpleasant that you want to fight it off|pugilist|a boxer, a person who fights with the fists
    ambul|walk|行走|ambulatory|able to walk about|amble|to walk slowly and easily|perambulate|to walk through or around a place
    ced|go or yield|走，让步|precede|to go before something|recede|to go back or move away|secede|to go away from a nation or a group and leave it
    luc|light|光|lucid|clear and easy to understand, as if full of light|translucent|letting some light pass through|pellucid|so clear that light passes through it
    mand|order|命令|mandate|an official order or the authority to act|mandatory|ordered by a rule, so that you must do it|countermand|to cancel an order that was given before
    nat|born|出生|innate|present in someone from birth|prenatal|before birth|nativity|the birth of someone
    sequ|follow|跟随|obsequious|too eager to follow and please others|consequence|a result that follows from an action|subsequent|coming after something in time
    terr|earth or land|土地|terrain|an area of land and its features|subterranean|under the earth|territory|an area of land that belongs to a country or a ruler
    err|wander or stray|游荡，偏离|erratic|wandering without a regular pattern|errant|straying from the proper path|aberration|a straying from what is normal
  `),
  explanations: [
    [
      "Ten more Latin **roots**. *Bell* means war, *pug* fight, *ambul* walk, *ced* go or yield, *luc* light, *mand* order, *nat* born, *sequ* follow, *terr* earth or land and *err* wander. *Bell* and *pug* both carry the idea of fighting: a *belligerent* nation is eager for war, a *pugnacious* person is quick to start a fight.",
      "另外十个拉丁**词根**。*bell* 意为战争，*pug* 打斗，*ambul* 行走，*ced* 走或让步，*luc* 光，*mand* 命令，*nat* 出生，*sequ* 跟随，*terr* 土地，*err* 游荡。*bell* 和 *pug* 都带有打斗的意思：*belligerent* 的国家渴望战争，*pugnacious* 的人动不动就打架。",
    ],
    [
      "Prefixes steer the root. With *ced*, *pre-* (before) gives **precede**, *re-* (back) gives **recede** and *se-* (apart) gives **secede**. With *terr*, *sub-* (under) gives **subterranean**. Read the prefix, then the root, and put them together.",
      "前缀决定词根的方向。与 *ced* 搭配，*pre-*（之前）构成 **precede**，*re-*（向后）构成 **recede**，*se-*（分开）构成 **secede**。与 *terr* 搭配，*sub-*（在下）构成 **subterranean**。先读前缀，再读词根，然后把意思合起来。",
    ],
  ],
});

const greek6 = parts({
  id: "greek-roots-6",
  title: ["Greek Roots 6", "希腊词根 6"],
  summary: [
    "Ten more Greek roots: chron, hydr, astr, dyn, ethn, gloss, hypn, necr, phag and xen.",
    "另外十个希腊词根：chron、hydr、astr、dyn、ethn、gloss、hypn、necr、phag 和 xen。",
  ],
  after: ["greek-roots-5"],
  kind: ["Greek root", "希腊词根"],
  list: partLines(`
    chron|time|时间|chronic|lasting for a long time|synchronize|to make things happen at the same time|chronicle|a record of events in the order of time
    hydr|water|水|dehydrated|having lost too much water|hydrant|a pipe in the street from which water can be drawn|hydroelectric|making electricity from the power of moving water
    astr|star|星|asterisk|a small star-shaped mark (*)|astronomy|the study of the stars and planets|disaster|a great misfortune, once blamed on unlucky stars
    dyn|power|力量|dynamic|full of energy and power|dynasty|a line of rulers from one family who hold power|dynamite|a powerful explosive
    ethn|people or nation|民族|ethnic|having to do with a people who share a culture|ethnography|the study and description of a people's way of life|ethnocentric|judging other peoples by the standards of your own
    gloss|tongue or word|舌，词语|glossary|a list of difficult words with their meanings|polyglot|a person who speaks many languages|glossolalia|speech in sounds that seem to be an unknown language
    hypn|sleep|睡眠|hypnosis|a sleeplike state in which a person follows suggestions|hypnotic|making you feel sleepy or held in a spell|hypnotize|to put someone into a sleeplike state
    necr|dead|死|necropolis|a large ancient cemetery, a "city of the dead"|necrology|a list of people who have died|necromancer|a person said to speak with the dead
    phag|eat|吃|esophagus|the tube that carries food to the stomach|sarcophagus|a stone coffin, once said to "eat flesh"|phagocyte|a cell that eats germs in the blood
    xen|stranger or foreign|陌生，外来|xenophobia|fear or hatred of foreigners|xenon|a rare gas, named the "stranger" element|xenial|having to do with hospitality to guests and strangers
  `),
  explanations: [
    [
      "Ten more Greek **roots**. *Chron* means time, *hydr* water, *astr* star, *dyn* power, *ethn* people or nation, *gloss* tongue or word, *hypn* sleep, *necr* dead, *phag* eat and *xen* stranger. Some roots hide old beliefs: a *disaster* was once a misfortune blamed on an unlucky star.",
      "另外十个希腊**词根**。*chron* 意为时间，*hydr* 水，*astr* 星，*dyn* 力量，*ethn* 民族，*gloss* 舌或词语，*hypn* 睡眠，*necr* 死，*phag* 吃，*xen* 陌生或外来。有些词根藏着古老的观念：*disaster* 原本指归咎于凶星的不幸。",
    ],
    [
      "Many of these words join two Greek parts. *Fear of foreigners* joins *xen* (stranger) and *phobia* (fear): **xenophobia**. *A person who speaks many languages* joins *poly* (many) and *gloss* (tongue): **polyglot**. Read each part in turn and put the meanings together.",
      "这些词很多由两个希腊语成分组成。*fear of foreigners* 由 *xen*（陌生人）和 *phobia*（恐惧）组成：**xenophobia**。*a person who speaks many languages* 由 *poly*（多）和 *gloss*（舌）组成：**polyglot**。依次读出每个成分，把意思合起来。",
    ],
  ],
});

const verbSuffixes = parts({
  id: "word-parts-that-form-verbs",
  title: ["Word Parts That Form Verbs", "构成动词的词缀"],
  summary: [
    "Ten suffixes and prefixes that turn nouns and adjectives into verbs: -ize, -ify, -ate, -en, -esce, en-, be-, de-, out- and under-.",
    "十个把名词和形容词变成动词的后缀和前缀：-ize、-ify、-ate、-en、-esce、en-、be-、de-、out- 和 under-。",
  ],
  after: ["suffixes-that-form-nouns"],
  kind: ["word part", "词缀"],
  list: partLines(`
    -ize|to make or to treat as|使成为|modernize|to make something modern|dramatize|to turn a story into a play, or to make it seem more exciting|visualize|to form a picture of something in the mind
    -ify|to make or to cause|使，使变得|clarify|to make something clear|intensify|to make something stronger|personify|to give human qualities to a thing or an idea
    -ate|to cause or to act on|使，作用于|activate|to make something start working|captivate|to hold someone's attention as if a captive|alienate|to make someone feel like a stranger
    -en|to make or to become|使变得|broaden|to make something wider|enliven|to make something more lively|embolden|to make someone bolder
    -esce|to begin to become|开始变得|coalesce|to come together to form one whole|effervesce|to give off bubbles, or to be lively|acquiesce|to accept something quietly without arguing
    en-|to put into or to cause to be|使处于，使成为|endanger|to put someone or something in danger|enslave|to make someone a slave|encircle|to form a circle around something
    be-|to make, or to treat as|使，把……当作|befriend|to become a friend to someone|belittle|to treat something as little or unimportant|bewitch|to put a spell on someone
    de-|to remove or to take away|去除，除去|dethrone|to remove a ruler from the throne|defrost|to remove the frost or ice from something|deforest|to cut down the trees of an area
    out-|to do better or more than|胜过，超过|outrun|to run faster than someone|outlive|to live longer than someone|outwit|to beat someone by being cleverer
    under-|too little or below|不足，在下|underestimate|to think something is smaller or weaker than it is|underpay|to pay someone too little|undercut|to sell at a lower price than a rival
  `),
  explanations: [
    [
      "A **suffix** can turn a noun or an adjective into a verb. *-ize* and *-ify* mean *to make*: *modern* becomes *modernize*, *clear* becomes *clarify*. *-ate* means *to cause or act on*: *active* becomes *activate*. *-en* means *to make or become*: *broad* becomes *broaden*. *-esce* means *to begin to become*: things that *coalesce* begin to grow together. Some **prefixes** make verbs too: *en-* puts into (*endanger*), *be-* makes or treats as (*befriend*), *de-* takes away (*dethrone*), *out-* does better than (*outrun*) and *under-* does too little (*underpay*).",
      "**后缀**可以把名词或形容词变成动词。*-ize* 和 *-ify* 意为*使成为*：*modern* 变成 *modernize*，*clear* 变成 *clarify*。*-ate* 意为*引起或作用于*：*active* 变成 *activate*。*-en* 意为*使变得*：*broad* 变成 *broaden*。*-esce* 意为*开始变得*：*coalesce* 的东西开始合为一体。有些**前缀**也能构成动词：*en-* 表示使处于（*endanger*），*be-* 表示使或当作（*befriend*），*de-* 表示去除（*dethrone*），*out-* 表示胜过（*outrun*），*under-* 表示不足（*underpay*）。",
    ],
    [
      "To find the word for a definition, look for the base inside it, then the suffix that makes the verb. *To give human qualities to a thing* has *person* inside it, with *-ify*: **personify**. *To make someone bolder* has *bold* inside it, with *em-* and *-en*: **embolden**.",
      "要找出符合释义的词，先找出其中的词干，再找构成动词的后缀。*to give human qualities to a thing* 里有 *person*，加上 *-ify*：**personify**。*to make someone bolder* 里有 *bold*，加上 *em-* 和 *-en*：**embolden**。",
    ],
  ],
});

/** wordStudyTopics9 are the word study topics of grade 9. */
export const wordStudyTopics9: readonly TopicDef[] = [latin7, greek6, verbSuffixes];
