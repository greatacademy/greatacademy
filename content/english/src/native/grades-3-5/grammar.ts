// Grades 3 to 5: grammar and mechanics the first slice lacked: plurals, the order of adjectives, progressive and
// perfect tenses, modal verbs, paired conjunctions, and capitals for names and titles.

import { type TopicDef, t } from "@ga/content";
import { choiceGenerator, point, typedGenerator } from "@ga/subject-english";
import { pastParticiplesNot, spellingPluralsNot } from "../mistakes.ts";
import {
  adjectiveOrderBank,
  irregularPluralBank,
  modalFormBank,
  modalMeaningBank,
  nearNounBank,
  pairAgreementBank,
  pairBank,
  participleBank,
  perfectMeaningBank,
  progressiveFormBank,
  progressiveMeaningBank,
  properNounBank,
  pluralSpellingBank as regularPluralBank,
  titleBank,
} from "./grammar-banks.ts";

/** pluralRule names the spelling rule that turns a singular noun into its plural. */
const pluralRule = (one: string, many: string): readonly [string, string] => {
  if (many.endsWith("ves"))
    return [
      `*${one}* ends in *f* or *fe*, which changes to *v* before *-es* is added`,
      `*${one}* 以 *f* 或 *fe* 结尾，要先变成 *v* 再加 *-es*`,
    ];
  if (many.endsWith("ies") && one.endsWith("y"))
    return [
      `*${one}* has a consonant before its final *y*, so the *y* turns into *i* before *-es*`,
      `*${one}* 词尾 *y* 前面是辅音，所以要把 *y* 变成 *i* 再加 *-es*`,
    ];
  if (one.endsWith("y"))
    return [
      `*${one}* has a vowel before its final *y*, so it keeps the *y* and just adds *-s*`,
      `*${one}* 词尾 *y* 前面是元音，所以保留 *y*，直接加 *-s*`,
    ];
  if (many === `${one}es`)
    return [
      `*${one}* ends in *s*, *x*, *ch*, *sh* or *z*, so it adds *-es*, the extra sound you hear`,
      `*${one}* 以 *s、x、ch、sh* 或 *z* 结尾，所以加 *-es*，读起来多了一个音`,
    ];
  return [`*${one}* follows the usual rule, so it simply adds *-s*`, `*${one}* 遵循一般规则，所以直接加 *-s*`];
};

const spellingWhy = (right: string, shown: string) => {
  const one = shown.match(/^one (.+), two ___$/u)?.[1] ?? "";
  const [en, zh] = pluralRule(one, right);
  return t(
    `One ${one}, two **${right}**: ${en}.\n\n**Check.** Look at the ending of *${one}* and read *two ${right}* aloud—both the spelling rule and the sound match.`,
    `one ${one}，two **${right}**：${zh}。\n\n**检验。**看 *${one}* 的词尾并读一遍 *two ${right}*——拼写规则和读音都吻合。`,
  );
};

/** irregularRule says how each irregular plural is formed from its singular. */
const irregularRule: Readonly<Record<string, readonly [string, string]>> = {
  mice: ["*mouse* changes its vowels to make *mice*, with no *-s* added", "*mouse* 改变元音变成 *mice*，不加 *-s*"],
  teeth: ["*tooth* changes *oo* to *ee* to make *teeth*, with no *-s* added", "*tooth* 把 *oo* 变成 *ee* 得到 *teeth*，不加 *-s*"],
  feet: ["*foot* changes *oo* to *ee* to make *feet*, with no *-s* added", "*foot* 把 *oo* 变成 *ee* 得到 *feet*，不加 *-s*"],
  geese: ["*goose* changes *oo* to *ee* to make *geese*, with no *-s* added", "*goose* 把 *oo* 变成 *ee* 得到 *geese*，不加 *-s*"],
  men: ["*man* changes its vowel to make *men*, with no *-s* added", "*man* 改变元音变成 *men*，不加 *-s*"],
  women: ["*woman* changes its vowel to make *women*, with no *-s* added", "*woman* 改变元音变成 *women*，不加 *-s*"],
  children: [
    "*child* adds the old ending *-ren* to make *children*, never *-s*",
    "*child* 加上古老的词尾 *-ren* 变成 *children*，从不加 *-s*",
  ],
  oxen: ["*ox* adds the old ending *-en* to make *oxen*, never *-es*", "*ox* 加上古老的词尾 *-en* 变成 *oxen*，从不加 *-es*"],
  sheep: ["*sheep* stays the same for one or many, so it takes no ending", "*sheep* 单复数相同，所以不加任何词尾"],
  deer: ["*deer* stays the same for one or many, so it takes no ending", "*deer* 单复数相同，所以不加任何词尾"],
  fish: ["*fish* usually stays the same for one or many, so it takes no ending", "*fish* 通常单复数相同，所以不加任何词尾"],
  moose: ["*moose* stays the same for one or many, so it takes no ending", "*moose* 单复数相同，所以不加任何词尾"],
};

const irregularWhy = (right: string, shown: string) => {
  const [en, zh] = irregularRule[right] ?? ["this noun has an irregular plural", "这个名词的复数不规则"];
  const sentence = shown.replace("___", `**${right}**`);
  return t(
    `${sentence} The noun is irregular: ${en}.\n\n**Check.** Read the completed sentence aloud—*${right}* is already plural and needs no *-s* or *-es* at the end.`,
    `${sentence} 这是不规则名词：${zh}。\n\n**检验。**把补全的句子读一遍——*${right}* 本身已经是复数，词尾不需要再加 *-s* 或 *-es*。`,
  );
};

const progressiveWhy = (right: string, shown: string) => {
  const subject = shown.match(/^[^,]+, (.+?) ___/u)?.[1] ?? "";
  const sentence = shown.replace("___", `**${right}**`);
  if (right.startsWith("will be"))
    return t(
      `${sentence} *This time tomorrow* points to the future, so the verb is *will be* plus the *-ing* form, for every subject.\n\n**Check.** Verify both parts of the future progressive—*will be* + *-ing*—and confirm the time clue points to the future.`,
      `${sentence} *This time tomorrow* 指向将来，所以动词用 *will be* 加 *-ing* 形式，任何主语都一样。\n\n**检验。** 核对将来进行时的两部分（*will be* + *-ing*），并确认句中时间线索指向将来。`,
    );
  const be = right.split(" ")[0] ?? "";
  const past = be === "was" || be === "were";
  return t(
    `${sentence} *${past ? "At noon yesterday" : "Right now"}* points to the ${past ? "past" : "present"}, so the verb is *${be}* plus the *-ing* form, because *${be}* is the form that agrees with *${subject}*.\n\n**Check.** Pair *${subject}* directly with *${be}* and check the *-ing* ending—both agreement and tense fit the time clue.`,
    `${sentence} *${past ? "At noon yesterday" : "Right now"}* 指向${past ? "过去" : "现在"}，所以动词用 *${be}* 加 *-ing* 形式，因为 *${be}* 是与 *${subject}* 一致的形式。\n\n**检验。** 把 *${subject}* 与 *${be}* 直接搭配，再核对 *-ing* 词尾——主谓一致和时态都吻合时间线索。`,
  );
};

/** modalMeaning says what each modal verb adds to the verb after it. */
const modalMeaning: Readonly<Record<string, readonly [string, string]>> = {
  must: ["*must* shows a rule or something necessary", "*must* 表示规定或必须做的事"],
  can: ["*can* shows that someone is able to do something", "*can* 表示某人能够做某事"],
  might: ["*might* shows that something is possible but not certain", "*might* 表示某事可能发生但不确定"],
  should: ["*should* gives advice about the right thing to do", "*should* 就该做的事提出建议"],
  may: ["*may* asks or gives permission politely", "*may* 礼貌地请求或给予允许"],
};

const modalWhy = (right: string, shown: string) => {
  const sentence = shown.split("*")[1]?.replace("___", right) ?? "";
  const [en, zh] = modalMeaning[right.toLowerCase()] ?? ["", ""];
  return t(
    `**${right}**: ${en}, which is the meaning the question asks for. *${sentence}*\n\n**Check.** Read *${sentence}* aloud and compare what **${right}** conveys with the prompt's goal—ability, permission, possibility, necessity, or advice.`,
    `**${right}**：${zh}，这正是题目要求的意思。*${sentence}*\n\n**检验。** 读一遍 *${sentence}*，核对 **${right}** 表达的意思与题目要求（能力、许可、可能、必须或建议）完全一致。`,
  );
};

/** pairRule names the partner each correlative conjunction needs. */
const pairRule: Readonly<Record<string, readonly [string, string]>> = {
  either: ["*either* pairs with *or* to offer one of two choices", "*either* 与 *or* 搭配，表示二者选一"],
  neither: ["*neither* pairs with *nor* to say not one and not the other", "*neither* 与 *nor* 搭配，表示两者都不"],
  and: ["*both* pairs with *and* to include the two things together", "*both* 与 *and* 搭配，表示两者都包括"],
  "but also": ["*not only* pairs with *but also* to add a second thing", "*not only* 与 *but also* 搭配，补充第二样东西"],
};

const pairWhy = (right: string, shown: string) => {
  const [en, zh] = pairRule[right] ?? ["", ""];
  const sentence = shown.replace("___", `**${right}**`);
  return t(`${sentence} The word fits because ${en}.`, `${sentence} 这个词正合适，因为${zh}。`);
};

const orderWhyNot = (wrong: string, _right: string, _shown: string, position: number) =>
  position === 0
    ? t(
        `In “${wrong}”, the adjectives are in an order that sounds wrong to an English ear. Check which kind each one is: opinion, size, age, shape, color, origin, material or purpose.`,
        `在“${wrong}”中，形容词的顺序在英语里听起来不对。看看每个形容词属于哪一类：观点、大小、新旧、形状、颜色、来源、材料或用途。`,
      )
    : t(
        `In “${wrong}”, the adjectives come after the noun. In English, adjectives like these come before the noun they describe.`,
        `在“${wrong}”中，形容词放在了名词后面。在英语里，这类形容词要放在所修饰的名词前面。`,
      );

const modalFormWhyNot = (wrong: string) =>
  t(
    `In “${wrong}”, the verb after the modal is not in its plain form. After *can, may, might, must* and *should*, use the plain verb with no *-s*, no *-ing* and no *to*.`,
    `在“${wrong}”中，情态动词后面的动词不是原形。在 *can、may、might、must、should* 后面，要用动词原形：不加 *-s*，不加 *-ing*，也不加 *to*。`,
  );

const agreementWhyNot = (wrong: string) =>
  t(
    `In “${wrong}”, the verb does not agree with the subject it should, or the two halves of the pair do not match. *Either* goes with *or*, *neither* with *nor*, *both* with *and*. With *both ... and*, the subject is plural; with *either ... or* and *neither ... nor*, the verb agrees with the subject nearer to it.`,
    `在“${wrong}”中，动词没有和应当一致的主语保持一致，或者成对连词的两半不配套。*either* 配 *or*，*neither* 配 *nor*，*both* 配 *and*。用 *both ... and* 时主语是复数；用 *either ... or* 和 *neither ... nor* 时，动词和离它较近的主语一致。`,
  );

const properWhyNot = (wrong: string, _right: string, _shown: string, position: number) =>
  t(
    position === 0
      ? `“${wrong}” leaves a proper noun in lower case or capitalizes a common one. Capitalize the names of particular people, places, days, months and holidays, and only those.`
      : `“${wrong}” capitalizes a word that names something in general, or leaves out a capital that a name needs.`,
    position === 0
      ? `“${wrong}” 要么把专有名词写成了小写，要么把普通名词大写了。只有特定的人名、地名、星期、月份和节日才大写。`
      : `“${wrong}” 要么把泛指的词大写了，要么漏掉了名称需要的大写。`,
  );

const titleWhyNot = (wrong: string, _right: string, _shown: string, position: number) =>
  position === 0
    ? t(
        `“${wrong}” capitalizes every word. Short words such as *the, a, an, and, of, in, to, for* stay lower case unless they come first.`,
        `“${wrong}” 把每个词都大写了。*the、a、an、and、of、in、to、for* 这样的短词，除非在开头，否则用小写。`,
      )
    : t(
        `“${wrong}” leaves important words in lower case. Capitalize the first word and every important word of a title.`,
        `“${wrong}” 把重要的词写成了小写。标题的第一个词和每个重要的词都要大写。`,
      );

/** grammarTopics35 are the topics of grammar and mechanics added for grades 3 to 5. */
export const grammarTopics35: readonly TopicDef[] = [
  {
    id: "plural-nouns",
    title: t("Plural Nouns", "名词复数"),
    summary: t(
      "Most nouns add -s to name more than one, but some add -es, change y to i, change f to v, or change completely.",
      "大多数名词加 -s 表示复数，但有些加 -es，有些把 y 变成 i、把 f 变成 v，还有些完全变形。",
    ),
    intro: t(
      "One *box* becomes two *boxes*, one *baby* becomes two *babies*, and one *mouse* becomes two *mice*. Knowing which rule—or irregular form—applies keeps your plural nouns accurate in both spelling and speech.",
      "一个 *box* 变成两个 *boxes*，一个 *baby* 变成两个 *babies*，而一只 *mouse* 变成两只 *mice*。分清该用哪条拼写规则、哪些词是不规则复数，写和说名词复数才不会出错。",
    ),
    prerequisites: ["nouns-and-pronouns"],
    encompasses: [{ topic: "nouns-and-pronouns", weight: 0.1 }],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "spelling-plurals",
        t("Spelling Plurals", "复数的拼写"),
        t(
          "Most nouns add *-s*: *cat, cats*. Nouns ending in *s, x, ch, sh* or *z* add *-es*, because you hear an extra sound: *box, boxes*; *bench, benches*.\n\nA consonant before a final *y* turns the *y* into *i* and adds *-es*: *city, cities*. A vowel before the *y* keeps it: *monkey, monkeys*.\n\nMany nouns ending in *f* or *fe* change it to *v* and add *-es*: *leaf, leaves*; *wolf, wolves*.\n\n> **Watch out.** Check the letter right before a final *y*—*city* changes to *cities*, while *monkey* keeps the *y* and becomes *monkeys*.",
          "大多数名词加 *-s*：*cat, cats*。以 *s、x、ch、sh* 或 *z* 结尾的名词加 *-es*，因为读起来多了一个音：*box, boxes*；*bench, benches*。\n\n词尾 *y* 前是辅音时，把 *y* 变成 *i* 再加 *-es*：*city, cities*。*y* 前是元音时保留 *y*：*monkey, monkeys*。\n\n许多以 *f* 或 *fe* 结尾的名词把它变成 *v* 再加 *-es*：*leaf, leaves*；*wolf, wolves*。\n\n> **注意。**一定要看词尾 *y* 前面的字母——*city* 变成 *cities*，而 *monkey* 保留 *y*，变成 *monkeys*。",
        ),
        typedGenerator(
          "word-form",
          t("Type the plural of the noun.", "输入这个名词的复数形式。"),
          regularPluralBank,
          spellingWhy,
          spellingPluralsNot,
        ),
      ),
      point(
        "irregular-plurals",
        t("Irregular Plurals", "不规则复数"),
        t(
          "Some nouns change their spelling instead of adding an ending: *mouse, mice*; *tooth, teeth*; *foot, feet*; *goose, geese*; *child, children*; *man, men*; *woman, women*; *ox, oxen*.\n\nA few stay the same: one *sheep*, two *sheep*; one *deer*, a herd of *deer*; one *fish*, a school of *fish*. An irregular plural never takes an extra *-s*: *childrens* and *mices* are not words.\n\n> **Watch out.** Never stack *-s* onto an irregular plural—*children*, *mice*, and *feet* are already plural on their own.",
          "有些名词不加词尾，而是改变拼写：*mouse, mice*；*tooth, teeth*；*foot, feet*；*goose, geese*；*child, children*；*man, men*；*woman, women*；*ox, oxen*。\n\n有几个单复数相同：one *sheep*，two *sheep*；one *deer*，a herd of *deer*；one *fish*，a school of *fish*。不规则复数后面不再加 *-s*：*childrens* 和 *mices* 都不是词。\n\n> **注意。**千万别在不规则复数后面再加 *-s*——*children*、*mice* 和 *feet* 本身就已经是复数了。",
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          irregularPluralBank,
          irregularWhy,
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” adds a regular *-s* or *-es* ending, but this noun has an irregular plural.`,
                  `“${wrong}” 按规则名词加了 *-s* 或 *-es*，但这个名词的复数是不规则的。`,
                )
              : t(
                  `“${wrong}” adds an extra *-s* or *-es* to a word that does not take one—an irregular plural stands on its own.`,
                  `“${wrong}” 给不该加词尾的词多加了 *-s* 或 *-es*——不规则复数自己就能表示复数。`,
                ),
        ),
      ),
    ],
  },
  {
    id: "order-of-adjectives",
    title: t("The Order of Adjectives", "形容词的顺序"),
    summary: t(
      "When several adjectives come before a noun, they follow an order: opinion, size, age, shape, color, origin, material, purpose.",
      "名词前有几个形容词时，它们遵循一定顺序：观点、大小、新旧、形状、颜色、来源、材料、用途。",
    ),
    intro: t(
      "Why does *a small round wooden box* sound completely natural while *a wooden round small box* sounds tangled? English places multiple adjectives before a noun in a steady order from opinion and size down to material and purpose.",
      "为什么 *a small round wooden box* 听起来十分自然，而 *a wooden round small box* 却很别扭？英语里名词前的多个形容词遵循固定顺序，从观点、大小一路排到材料和用途。",
    ),
    prerequisites: ["adjectives-and-adverbs"],
    encompasses: [{ topic: "adjectives-and-adverbs", weight: 0.2 }],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "opinion-size-age",
        t("Opinion, Size and Age", "观点、大小和新旧"),
        t(
          "English speakers say *a beautiful old box*, never *an old beautiful box*, though few could say why. The rule: an adjective of **opinion** (*beautiful, strange, lovely*) comes first, then **size** (*big, tiny*), then **age** (*old, new*), then **shape** (*round, long*) and **color** (*red, green*).\n\nAll of them come before the noun: *a big brown dog*, not *a dog big brown*.\n\n> **Watch out.** Put opinion words (*lovely*, *strange*) before factual traits like size, age, or color—never after them.",
          "说英语的人会说 *a beautiful old box*，而从不说 *an old beautiful box*，尽管很少有人说得出原因。规则是：表示**观点**的形容词（*beautiful, strange, lovely*）在前，然后是**大小**（*big, tiny*），然后是**新旧**（*old, new*），再是**形状**（*round, long*）和**颜色**（*red, green*）。\n\n它们都放在名词前面：*a big brown dog*，而不是 *a dog big brown*。\n\n> **注意。** 表示观点的词（*lovely*、*strange*）要放在大小、新旧、颜色等客观特征前面，不要颠倒。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          adjectiveOrderBank,
          (right) =>
            t(
              `**${right}** Opinion comes before size, size before age, and age before shape and color, all before the noun.\n\n**Check.** Label each adjective before the noun (opinion → size → age → shape → color) and confirm they step strictly in that order.`,
              `**${right}** 观点在大小之前，大小在新旧之前，新旧在形状和颜色之前，全部放在名词前面。\n\n**检验。** 给名词前的每个形容词标出类别（观点→大小→新旧→形状→颜色），确认它们严格按顺序排列。`,
            ),
          orderWhyNot,
        ),
      ),
      point(
        "color-origin-material-purpose",
        t("Color, Origin, Material and Purpose", "颜色、来源、材料和用途"),
        t(
          "The adjectives nearest the noun tell where something comes from and what it is made of or for. **Color** comes before **origin** (*French, Chinese*), origin before **material** (*wooden, leather, silver*), and material before **purpose** (*soccer, sleeping, hiking*), which sits right next to the noun: *a red leather jacket*, *green sleeping bags*.\n\n> **Watch out.** Keep the purpose word (*sleeping*, *hiking*, *soccer*) glued right beside the noun—never slip a color or material between them.",
          "离名词最近的形容词说明事物的来源、材料或用途。**颜色**在**来源**（*French, Chinese*）之前，来源在**材料**（*wooden, leather, silver*）之前，材料在**用途**（*soccer, sleeping, hiking*）之前，而用途紧挨着名词：*a red leather jacket*，*green sleeping bags*。\n\n> **注意。** 表示用途的词（*sleeping*、*hiking*、*soccer*）要紧贴名词——不要把颜色或材料插在它们中间。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          nearNounBank,
          (right) =>
            t(
              `**${right}** Color comes before origin, origin before material, and material before purpose, which sits next to the noun.\n\n**Check.** Trace the adjectives right up to the noun (color → origin → material → purpose)—each one sits closer to the noun in that exact order.`,
              `**${right}** 颜色在来源之前，来源在材料之前，材料在用途之前，用途紧挨着名词。\n\n**检验。** 顺着名词前的形容词核对（颜色→来源→材料→用途）——顺序完全符合规则。`,
            ),
          orderWhyNot,
        ),
      ),
    ],
  },
  {
    id: "progressive-verb-tenses",
    title: t("Progressive Verb Tenses", "进行时"),
    summary: t(
      "The progressive tenses tell about an action in progress: am, is, are, was, were or will be with an -ing verb.",
      "进行时表示正在进行的动作：am、is、are、was、were 或 will be 加 -ing 形式的动词。",
    ),
    intro: t(
      "Compare *She reads every night* with *She is reading right now*. Adding a form of *be* plus *-ing* turns a general fact into a live action happening at a specific moment in the present, past, or future.",
      "比较 *She reads every night* 和 *She is reading right now*。用 *be* 动词加上 *-ing*，就把一般事实变成了在现在、过去或将来某一刻正在进行的动作。",
    ),
    prerequisites: ["subject-verb-agreement"],
    encompasses: [
      { topic: "simple-verb-tenses", weight: 0.2 },
      { topic: "subject-verb-agreement", weight: 0.2 },
    ],
    xp: 12,
    strand: "grammar",
    knowledgePoints: [
      point(
        "forming-progressive",
        t("Forming the Progressive", "进行时的构成"),
        t(
          "A progressive verb has two parts: a form of *be* and a verb ending in *-ing*.\n\n- Present: *I am reading. She is reading. They are reading.*\n- Past: *He was reading. We were reading.*\n- Future: *I will be reading.*\n\nThe form of *be* must agree with the subject, and the *-ing* verb never stands alone as the verb of a sentence: *The baby sleeping* is not a sentence.\n\n> **Watch out.** Never drop the helping *be* verb (*The dogs barking* is a fragment), and always check that *be* agrees with the subject and matches the time clue.",
          "进行时的动词有两部分：*be* 的某种形式加上以 *-ing* 结尾的动词。\n\n- 现在进行时：*I am reading. She is reading. They are reading.*\n- 过去进行时：*He was reading. We were reading.*\n- 将来进行时：*I will be reading.*\n\n*be* 的形式要和主语一致，而 *-ing* 形式的动词不能单独作句子的谓语：*The baby sleeping* 不是句子。\n\n> **注意。** 不要漏掉助动词 *be*（*The dogs barking* 是残句），并且 *be* 的形式要同时符合主语单复数和时间线索。",
        ),
        choiceGenerator(
          t("Which words complete the sentence?", "哪些词能补全句子？"),
          progressiveFormBank,
          progressiveWhy,
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” does not agree with the subject or the time clue in the sentence.`,
                  `“${wrong}” 与句子的主语或时间线索不一致。`,
                )
              : t(
                  `“${wrong}” is missing the right *be* + *-ing* structure for this progressive tense.`,
                  `“${wrong}” 缺少这个进行时所需的正确 *be* + *-ing* 结构。`,
                ),
        ),
      ),
      point(
        "progressive-or-simple",
        t("Progressive or Simple?", "进行时还是一般时？"),
        t(
          "A **simple** tense tells that something happens, happened or will happen, often as a habit: *Dad walks the dog every morning.* A **progressive** tense shows the action going on at a particular moment: *Dad is walking the dog right now.*\n\nThe past progressive often sets the scene for something that interrupts it: *We were swimming when the storm began.*\n\n> **Watch out.** Look for time clues: habits (*every morning*, *always*) take a simple tense, while an action in progress (*right now*, *when the storm began*) takes a progressive tense.",
          "**一般时**表示某事发生、发生过或将要发生，常常是习惯：*Dad walks the dog every morning.* **进行时**表示动作在某一时刻正在进行：*Dad is walking the dog right now.*\n\n过去进行时常用来描述被另一件事打断的背景：*We were swimming when the storm began.*\n\n> **注意。** 抓准时间线索：习惯（*every morning*、*always*）用一般时，某一时刻正在进行的动作（*right now*、*when the storm began*）用进行时。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          progressiveMeaningBank,
          (right) =>
            t(
              `**${right}** Its tense shows the kind of time the question asks for.\n\n**Check.** Match the verb form (simple vs. *be* + *-ing*) directly against whether the prompt describes a habit/completed event or an ongoing action.`,
              `**${right}** 它的时态表示的正是题目所问的那种时间。\n\n**检验。** 把动词形式（一般时还是 *be* + *-ing*）与题干描述的情境（习惯/完成的动作还是正在进行的动作）核对一遍。`,
            ),
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” mixes up a habit with an action in progress (or the other way round).`,
                  `“${wrong}” 把习惯和正在进行的动作弄混了。`,
                )
              : t(
                  `“${wrong}” places the action in the wrong time frame for what the question asks.`,
                  `“${wrong}” 的时态与题目要求的时间不符。`,
                ),
        ),
      ),
    ],
  },
  {
    id: "modal-verbs",
    title: t("Modal Verbs", "情态动词"),
    summary: t(
      "Can, may, might, must and should add ability, permission, possibility, need or advice to a verb.",
      "can、may、might、must 和 should 给动词加上能力、许可、可能、必要或建议的意思。",
    ),
    intro: t(
      "“You *must* wear a helmet” states a rule, while “You *might* need a jacket” expresses a possibility. Modal verbs sit in front of a plain verb to show ability, permission, possibility, necessity, or advice.",
      "“You *must* wear a helmet”是硬性规定，“You *might* need a jacket”只是表示可能。情态动词放在动词原形前，用来表达能力、许可、可能、必要或建议。",
    ),
    prerequisites: ["simple-verb-tenses"],
    encompasses: [],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "what-modals-mean",
        t("What Each One Means", "各自的意思"),
        t(
          "A **modal verb** comes before another verb and changes its meaning:\n\n- *can*: able to: *Owls can see in the dark.*\n- *may*: allowed to, or asking politely: *May I come in?*\n- *might*: possible but not certain: *It might rain.*\n- *must*: a rule or a strong need: *You must stop at a red light.*\n- *should*: advice, the right thing to do: *You should wear a helmet.*\n\n> **Watch out.** Several modals can sound grammatical in the same blank—choose the one that matches the *exact meaning* asked for (rule vs. advice vs. possibility).",
          "**情态动词**放在另一个动词前面，改变它的意思：\n\n- *can*：能够：*Owls can see in the dark.*\n- *may*：允许，或礼貌地请求：*May I come in?*\n- *might*：可能但不确定：*It might rain.*\n- *must*：规定或强烈的需要：*You must stop at a red light.*\n- *should*：建议，应当做的事：*You should wear a helmet.*\n\n> **注意。** 同一个空填好几个情态动词语法上都通——必须选符合题目*准确意思*（规定、建议还是可能）的那个。",
        ),
        choiceGenerator(t("Choose the modal verb.", "选择情态动词。"), modalMeaningBank, modalWhy, (wrong) => {
          const desc = modalMeaning[wrong.toLowerCase()];
          return desc
            ? t(`“${wrong}” does not match the meaning asked for: ${desc[0]}.`, `“${wrong}” 不符合题目要求的意思：${desc[1]}。`)
            : t(
                `“${wrong}” fits the grammar of the sentence but not the meaning the question asks for.`,
                `“${wrong}” 在语法上能放进句子，但不符合题目要求的意思。`,
              );
        }),
      ),
      point(
        "modal-plus-plain-verb",
        t("A Modal and the Plain Verb", "情态动词加动词原形"),
        t(
          "After a modal verb, the next verb is always in its plain form: no *-s*, no *-ing*, no *to*. *She can ride*, not *She can rides*. *We must finish*, not *We must to finish*.\n\nIn a question, the modal moves to the front: *Can you help me?* In a negative, *not* follows the modal: *They should not run.*\n\n> **Watch out.** Never add *-s* after *he/she/it* following a modal (*She can rides* is wrong), and never insert *to* (*must to finish* is wrong).",
          "情态动词后面的动词总是原形：不加 *-s*，不加 *-ing*，也不加 *to*。*She can ride*，而不是 *She can rides*。*We must finish*，而不是 *We must to finish*。\n\n疑问句中，情态动词移到句首：*Can you help me?* 否定句中，*not* 放在情态动词后面：*They should not run.*\n\n> **注意。** 第三人称单数主语后接情态动词时，后面的动词也绝不加 *-s*（*She can rides* 是错的），也不要加 *to*（*must to finish* 是错的）。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          modalFormBank,
          (right) =>
            t(
              `**${right}** The verb after the modal is in its plain form.\n\n**Check.** Find the modal verb and look at the very next verb—it is the bare base form with no *-s*, *-ing*, or *to*.`,
              `**${right}** 情态动词后面的动词用的是原形。\n\n**检验。** 找到情态动词，看紧跟其后的动词——是干净的原形，没有 *-s*、*-ing* 或 *to*。`,
            ),
          (wrong, _right, _shown, position) =>
            position === 0
              ? modalFormWhyNot(wrong)
              : t(
                  `“${wrong}” adds an extra ending or *to* after the modal—every modal takes the bare base verb.`,
                  `“${wrong}” 在情态动词后多加了词尾或 *to*——情态动词后面一律只接动词原形。`,
                ),
        ),
      ),
    ],
  },
  {
    id: "perfect-verb-tenses",
    title: t("Perfect Verb Tenses", "完成时"),
    summary: t(
      "The perfect tenses use has, have, had or will have with a past participle to show that one time comes before another.",
      "完成时用 has、have、had 或 will have 加过去分词，表示一个时间在另一个时间之前。",
    ),
    intro: t(
      "Compare *The train left at six* with *By the time we arrived, the train had left*. Perfect tenses pair *has, have, had,* or *will have* with a past participle to show which event happened earlier.",
      "对比 *The train left at six* 和 *By the time we arrived, the train had left*。完成时把 *has、have、had* 或 *will have* 与过去分词搭配，清楚标出哪件事发生在前。",
    ),
    prerequisites: ["progressive-verb-tenses"],
    encompasses: [
      { topic: "simple-verb-tenses", weight: 0.2 },
      { topic: "progressive-verb-tenses", weight: 0.1 },
    ],
    xp: 12,
    strand: "grammar",
    knowledgePoints: [
      point(
        "past-participles",
        t("Past Participles", "过去分词"),
        t(
          "A perfect verb is *has, have* or *had* followed by a **past participle**. For most verbs the participle is the same as the past: *walk, walked, have walked*.\n\nMany common verbs have a participle of their own, often ending in *-en* or *-n*: *eat, ate, eaten*; *write, wrote, written*; *go, went, gone*; *see, saw, seen*; *fly, flew, flown*. After *has, have* or *had*, use the participle, not the past: *We have eaten*, not *We have ate*.\n\n> **Watch out.** Do not drop the simple past form after *has, have,* or *had*—say *have written* and *had gone*, never *have wrote* or *had went*.",
          "完成时的动词是 *has、have* 或 *had* 后接**过去分词**。大多数动词的过去分词和过去式相同：*walk, walked, have walked*。\n\n许多常用动词有自己的过去分词，常以 *-en* 或 *-n* 结尾：*eat, ate, eaten*；*write, wrote, written*；*go, went, gone*；*see, saw, seen*；*fly, flew, flown*。在 *has、have* 或 *had* 后面要用过去分词，而不是过去式：*We have eaten*，而不是 *We have ate*。\n\n> **注意。** 在 *has、have* 或 *had* 后面不能用一般过去式——要说 *have written*、*had gone*，不能说 *have wrote* 或 *had went*。",
        ),
        typedGenerator(
          "word-form",
          t("Type the past participle of the verb that completes the sentence.", "输入能补全句子的动词过去分词。"),
          participleBank,
          (right, shown) => {
            const plain = shown.slice(0, shown.indexOf(":"));
            const sentence = shown.slice(shown.indexOf(":") + 2).replace("___", `**${right}**`);
            const past = participleBank.find((item) => item.canonical === right)?.wrong[0] ?? "";
            return t(
              `${sentence} After *has*, *have* or *had* comes the past participle. *${plain}* is irregular: its past is *${past}*, but its participle is *${right}*.\n\n**Check.** Say the three principal parts of *${plain}* aloud (*${plain}, ${past}, ${right}*)—the third part always pairs with *has, have,* or *had*.`,
              `${sentence} *has、have* 或 *had* 后面接过去分词。*${plain}* 是不规则动词：它的过去式是 *${past}*，过去分词却是 *${right}*。\n\n**检验。** 默念 *${plain}* 的三种形式（*${plain}、${past}、${right}*）——排在第三位的过去分词才和 *has、have、had* 搭配。`,
            );
          },
          pastParticiplesNot,
        ),
      ),
      point(
        "which-perfect",
        t("Which Perfect Tense", "用哪种完成时"),
        t(
          "- The **present perfect** (*has* or *have*) links the past to now: something started earlier and goes on, or happened at some time before now: *We have lived here for five years.*\n- The **past perfect** (*had*) shows that one past action came before another: *When we reached the station, the train had left.* The train left first.\n- The **future perfect** (*will have*) shows an action finished before a future time: *By June, I will have read twenty books.*\n\n> **Watch out.** Match the helper to the reference point in the sentence: *for/since/already* up to now uses *has/have*, an earlier past event uses *had*, and *by + future time* uses *will have*.",
          "- **现在完成时**（*has* 或 *have*）把过去和现在联系起来：某事早先开始并延续到现在，或在现在之前的某个时候发生过：*We have lived here for five years.*\n- **过去完成时**（*had*）表示一个过去的动作发生在另一个过去的动作之前：*When we reached the station, the train had left.* 火车先开走了。\n- **将来完成时**（*will have*）表示动作在将来某个时间之前完成：*By June, I will have read twenty books.*\n\n> **注意。** 根据句中的时间参照点选助动词：延续至今用 *has/have*，过去的过去用 *had*，“到将来某时之前”用 *will have*。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          perfectMeaningBank,
          (right) =>
            t(
              `**${right}** Its tense shows exactly this order of times.\n\n**Check.** Find the helper (*has/have*, *had*, or *will have*) in **${right}** and place the two events on a timeline—the helper matches which time comes first.`,
              `**${right}** 它的时态正好表示这种时间先后。\n\n**检验。** 找出 **${right}** 里的助动词（*has/have*、*had* 或 *will have*），再把两件事放到时间线上对照——助动词正好对应先发生的那个时间点。`,
            ),
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” uses a tense whose helper points to the wrong reference time on the timeline.`,
                  `“${wrong}” 的助动词指向了错误的时间参照点，与题意的时间先后不符。`,
                )
              : t(
                  `“${wrong}” pairs a perfect helper with a time clue or clause that does not match it.`,
                  `“${wrong}” 把完成时助动词和不相配的时间线索或分句放在了一起。`,
                ),
        ),
      ),
    ],
  },
  {
    id: "correlative-conjunctions",
    title: t("Paired Conjunctions", "成对连词"),
    summary: t(
      "Either ... or, neither ... nor, both ... and and not only ... but also join two words or ideas as a pair.",
      "either ... or、neither ... nor、both ... and 和 not only ... but also 成对地连接两个词或两个意思。",
    ),
    intro: t(
      "Writers use pairs like *neither ... nor* and *not only ... but also* to balance two equal ideas in one sentence. Both halves must match as a pair, and when they join subjects, the verb must agree.",
      "作者用 *neither ... nor*、*not only ... but also* 等成对连词在句中平衡两个并列的意思。前后两半必须配套，连接主语时动词还要保持主谓一致。",
    ),
    prerequisites: ["coordinating-conjunctions", "subject-verb-agreement"],
    encompasses: [
      { topic: "coordinating-conjunctions", weight: 0.2 },
      { topic: "subject-verb-agreement", weight: 0.3 },
    ],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "choosing-the-pair",
        t("Choosing the Pair", "选择成对的词"),
        t(
          "Some conjunctions come in pairs, one word before each of the two things they join:\n\n- *either ... or*: one of two choices: *either juice or milk*\n- *neither ... nor*: not this one and not that one: *Neither my sister nor I like spinach.*\n- *both ... and*: the two together: *Both the cat and the dog sleep here.*\n- *not only ... but also*: this, and that too: *She is not only kind but also funny.*\n\nThe halves always match: *neither* goes with *nor*, never with *or*.\n\n> **Watch out.** Never cross-wire the pairs—*neither* always takes *nor*, *either* always takes *or*, and *both* always takes *and*.",
          "有些连词成对出现，所连接的两部分前面各有一个词：\n\n- *either ... or*：二选一：*either juice or milk*\n- *neither ... nor*：两者都不：*Neither my sister nor I like spinach.*\n- *both ... and*：两者都：*Both the cat and the dog sleep here.*\n- *not only ... but also*：不仅……而且：*She is not only kind but also funny.*\n\n两半总是配套的：*neither* 和 *nor* 搭配，从不和 *or* 搭配。\n\n> **注意。** 不要把成对连词混搭——*neither* 只能配 *nor*，*either* 只能配 *or*，*both* 只能配 *and*。",
        ),
        choiceGenerator(
          t("Which word or words complete the sentence?", "哪个词或哪些词能补全句子？"),
          pairBank,
          (right, shown) => {
            const base = pairWhy(right, shown);
            return t(
              `${base.en}\n\n**Check.** Spot the first half of the pair in the sentence and match it to **${right}**—the fixed pair and the meaning of the sentence both hold.`,
              `${base["zh-CN"]}\n\n**检验。** 找出句中成对连词的前半部分，再和 **${right}** 配对——固定搭配和句意两方面都成立。`,
            );
          },
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” does not belong to the fixed pair started earlier in the sentence.`,
                  `“${wrong}” 与句中前面出现的另一半连词不是固定搭配。`,
                )
              : t(
                  `“${wrong}” would change the sentence's meaning to a different relationship (choice, negation, or addition).`,
                  `“${wrong}” 会把句子的关系（选择、否定或并列）改成别的意思。`,
                ),
        ),
      ),
      point(
        "pairs-and-agreement",
        t("Pairs and Agreement", "成对连词与主谓一致"),
        t(
          "When a pair joins two subjects, the verb must agree:\n\n- With *both ... and*, the subject is two things, so the verb is plural: *Both Leo and Kim play.*\n- With *either ... or* and *neither ... nor*, the verb agrees with the subject **nearer to it**: *Either my brothers or my sister walks the dog.* *Neither the teacher nor the students were late.*\n\n> **Watch out.** For *either ... or* and *neither ... nor*, do not count both subjects together—look only at the subject standing closest to the verb.",
          "成对连词连接两个主语时，动词要与主语一致：\n\n- 用 *both ... and* 时，主语是两样东西，动词用复数：*Both Leo and Kim play.*\n- 用 *either ... or* 和 *neither ... nor* 时，动词和**离它较近**的主语一致：*Either my brothers or my sister walks the dog.* *Neither the teacher nor the students were late.*\n\n> **注意。** 用 *either ... or* 和 *neither ... nor* 时，不要把两个主语加在一起算复数——只看离动词最近的那个主语。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          pairAgreementBank,
          (right) =>
            t(
              `**${right}** The verb agrees with the right subject: plural after *both ... and*, and with the nearer subject after *either ... or* and *neither ... nor*.\n\n**Check.** Cover the first subject in **${right}** (unless it is *both ... and*) and read the nearer subject right next to the verb—they agree in number.`,
              `**${right}** 动词与该一致的主语一致：*both ... and* 之后用复数，*either ... or* 和 *neither ... nor* 之后与较近的主语一致。\n\n**检验。** 除 *both ... and* 外，遮住第一个主语，只把离动词较近的主语和动词连起来读——单复数完全一致。`,
            ),
          agreementWhyNot,
        ),
      ),
    ],
  },
  {
    id: "capitalizing-names-and-titles",
    title: t("Capitals for Names and Titles", "专有名词和标题的大写"),
    summary: t(
      "Capitalize the names of particular people, places and days, and the important words of a title.",
      "特定的人名、地名、日期名称要大写，标题中的重要词也要大写。",
    ),
    intro: t(
      "We write *a city* in lower case, yet *Chicago* starts with a capital; we write *The Wind in the Willows* with capitals on the main words and lower case on *in* and *the*. Knowing which nouns and title words take capitals makes your writing look sharp.",
      "写 *a city* 用小写，写 *Chicago* 却要大写首字母；写书名 *The Wind in the Willows* 时，主要词大写，中间的 *in* 和 *the* 用小写。掌握专有名词和标题的大写规则，写出来的句子会规范清楚。",
    ),
    prerequisites: ["capitals-and-end-punctuation"],
    encompasses: [{ topic: "capitals-and-end-punctuation", weight: 0.3 }],
    xp: 10,
    strand: "writing",
    knowledgePoints: [
      point(
        "proper-nouns",
        t("Proper Nouns", "专有名词"),
        t(
          "A **proper noun** names one particular person, place or thing, and it begins with a capital: *Chicago, the Nile River, Dr. Lopez, Maple Street, Friday, July, Thanksgiving, Spanish.*\n\nA **common noun** names any one of a kind and stays lower case: *a city, the museum, my dentist, summer.* A family word is capitalized only when it is used as a name: *Ask Uncle Ray*, but *my uncle*. Seasons are not capitalized.\n\n> **Watch out.** Seasons (*spring, summer, autumn, winter*) and general nouns (*my aunt, a river*) stay lower case—capitalize only specific names.",
          "**专有名词**指特定的人、地方或事物，首字母大写：*Chicago, the Nile River, Dr. Lopez, Maple Street, Friday, July, Thanksgiving, Spanish.*\n\n**普通名词**指同类中的任何一个，用小写：*a city, the museum, my dentist, summer.* 表示亲属的词只有当作名字用时才大写：*Ask Uncle Ray*，但 *my uncle*。季节名称不大写。\n\n> **注意。**季节（*spring、summer、autumn、winter*）和泛指名词（*my aunt、a river*）都用小写——只有特定名称才大写。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          properNounBank,
          (right) =>
            t(
              `**${right}** Every particular name is capitalized, and no common noun is.\n\n**Check.** Scan every capitalized word after the first word—each one names a specific person, place, day, month, holiday, or language.`,
              `**${right}** 每个特定的名称都大写了，普通名词都没有大写。\n\n**检验。**逐一检查句首之后的每个大写词——它们都指向特定的人、地点、星期、月份、节日或语言。`,
            ),
          properWhyNot,
        ),
      ),
      point(
        "titles-of-works",
        t("Titles of Books and Stories", "书名和篇名"),
        t(
          "In the title of a book, story, song or film, capitalize the **first word** and every **important word**: nouns, verbs, adjectives, adverbs and pronouns.\n\nShort words that only connect, such as *a, an, the, and, but, or, of, in, on, to, for*, stay lower case unless they are the first word: *The Wind in the Willows*, *A Song for the Rain*.\n\n> **Watch out.** Do not capitalize every single word in a title—short connecting words like *of*, *in*, *the*, and *and* stay lower case in the middle.",
          "书、故事、歌曲或电影的标题中，**第一个词**和每个**重要的词**都要大写：名词、动词、形容词、副词和代词。\n\n只起连接作用的短词，如 *a, an, the, and, but, or, of, in, on, to, for*，除非是第一个词，否则用小写：*The Wind in the Willows*，*A Song for the Rain*。\n\n> **注意。**不要把标题里的每个词都大写——夹在中间的连接短词（如 *of*、*in*、*the*、*and*）要保持小写。",
        ),
        choiceGenerator(
          t("Choose the title.", "选择标题。"),
          titleBank,
          (right) =>
            t(
              `**${right}** The first word and every important word are capitalized; the short connecting words stay lower case.\n\n**Check.** Check the first word (capitalized) and every short connecting word in the middle (*a, an, the, of, in, on, to, for, and*)—none of those middle connectors is capitalized.`,
              `**${right}** 第一个词和每个重要的词都大写了，中间起连接作用的短词保持小写。\n\n**检验。**先看第一个词（大写），再看中间的短连接词（*a、an、the、of、in、on、to、for、and*）——它们都保持小写。`,
            ),
          titleWhyNot,
        ),
      ),
    ],
  },
];
