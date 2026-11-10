// Grades 3 to 5: grammar and mechanics the skill courses lacked: plurals, the order of adjectives, progressive and
// perfect tenses, modal verbs, paired conjunctions, and capitals for names and titles.

import { type TopicDef, t } from "@ga/content";
import { choiceGenerator, point, typedGenerator } from "@ga/subject-english";
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

const pluralWhy = (right: string, shown: string) =>
  t(`${shown.replace("___", `**${right}**`)}`, `正确的句子是：${shown.replace("___", `**${right}**`)}`);

/** because builds the solution of a choice of sentences: the right one, and why it is right. */
const because =
  (en: string, zh: string) =>
  (right: string): ReturnType<typeof t> =>
    t(`**${right}** ${en}`, `**${right}** ${zh}`);

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
    prerequisites: ["nouns-and-pronouns"],
    encompasses: [{ topic: "nouns-and-pronouns", weight: 0.1 }],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "spelling-plurals",
        t("Spelling Plurals", "复数的拼写"),
        t(
          "Most nouns add *-s*: *cat, cats*. Nouns ending in *s, x, ch, sh* or *z* add *-es*, because you hear an extra sound: *box, boxes*; *bench, benches*.\n\nA consonant before a final *y* turns the *y* into *i* and adds *-es*: *city, cities*. A vowel before the *y* keeps it: *monkey, monkeys*.\n\nMany nouns ending in *f* or *fe* change it to *v* and add *-es*: *leaf, leaves*; *wolf, wolves*.",
          "大多数名词加 *-s*：*cat, cats*。以 *s、x、ch、sh* 或 *z* 结尾的名词加 *-es*，因为读起来多了一个音：*box, boxes*；*bench, benches*。\n\n词尾 *y* 前是辅音时，把 *y* 变成 *i* 再加 *-es*：*city, cities*。*y* 前是元音时保留 *y*：*monkey, monkeys*。\n\n许多以 *f* 或 *fe* 结尾的名词把它变成 *v* 再加 *-es*：*leaf, leaves*；*wolf, wolves*。",
        ),
        typedGenerator("word-form", t("Type the plural of the noun.", "输入这个名词的复数形式。"), regularPluralBank, pluralWhy),
      ),
      point(
        "irregular-plurals",
        t("Irregular Plurals", "不规则复数"),
        t(
          "Some nouns change their spelling instead of adding an ending: *mouse, mice*; *tooth, teeth*; *foot, feet*; *goose, geese*; *child, children*; *man, men*; *woman, women*; *ox, oxen*.\n\nA few stay the same: one *sheep*, two *sheep*; one *deer*, a herd of *deer*; one *fish*, a school of *fish*. An irregular plural never takes an extra *-s*: *childrens* and *mices* are not words.",
          "有些名词不加词尾，而是改变拼写：*mouse, mice*；*tooth, teeth*；*foot, feet*；*goose, geese*；*child, children*；*man, men*；*woman, women*；*ox, oxen*。\n\n有几个单复数相同：one *sheep*，two *sheep*；one *deer*，a herd of *deer*；one *fish*，a school of *fish*。不规则复数后面不再加 *-s*：*childrens* 和 *mices* 都不是词。",
        ),
        choiceGenerator(t("Which word completes the sentence?", "哪个词能补全句子？"), irregularPluralBank, pluralWhy, (wrong) =>
          t(
            `“${wrong}” treats an irregular noun as a regular one, or adds an ending to a plural that already has its own form.`,
            `“${wrong}” 把不规则名词当成了规则名词，或者给已经有自己复数形式的词又加了词尾。`,
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
    prerequisites: ["adjectives-and-adverbs"],
    encompasses: [{ topic: "adjectives-and-adverbs", weight: 0.2 }],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "opinion-size-age",
        t("Opinion, Size and Age", "观点、大小和新旧"),
        t(
          "English speakers say *a beautiful old box*, never *an old beautiful box*, though few could say why. The rule: an adjective of **opinion** (*beautiful, strange, lovely*) comes first, then **size** (*big, tiny*), then **age** (*old, new*), then **shape** (*round, long*) and **color** (*red, green*).\n\nAll of them come before the noun: *a big brown dog*, not *a dog big brown*.",
          "说英语的人会说 *a beautiful old box*，而从不说 *an old beautiful box*，尽管很少有人说得出原因。规则是：表示**观点**的形容词（*beautiful, strange, lovely*）在前，然后是**大小**（*big, tiny*），然后是**新旧**（*old, new*），再是**形状**（*round, long*）和**颜色**（*red, green*）。\n\n它们都放在名词前面：*a big brown dog*，而不是 *a dog big brown*。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          adjectiveOrderBank,
          because(
            "Opinion comes before size, size before age, and age before shape and color, all before the noun.",
            "观点在大小之前，大小在新旧之前，新旧在形状和颜色之前，全部放在名词前面。",
          ),
          orderWhyNot,
        ),
      ),
      point(
        "color-origin-material-purpose",
        t("Color, Origin, Material and Purpose", "颜色、来源、材料和用途"),
        t(
          "The adjectives nearest the noun tell where something comes from and what it is made of or for. **Color** comes before **origin** (*French, Chinese*), origin before **material** (*wooden, leather, silver*), and material before **purpose** (*soccer, sleeping, hiking*), which sits right next to the noun: *a red leather jacket*, *green sleeping bags*.",
          "离名词最近的形容词说明事物的来源、材料或用途。**颜色**在**来源**（*French, Chinese*）之前，来源在**材料**（*wooden, leather, silver*）之前，材料在**用途**（*soccer, sleeping, hiking*）之前，而用途紧挨着名词：*a red leather jacket*，*green sleeping bags*。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          nearNounBank,
          because(
            "Color comes before origin, origin before material, and material before purpose, which sits next to the noun.",
            "颜色在来源之前，来源在材料之前，材料在用途之前，用途紧挨着名词。",
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
          "A progressive verb has two parts: a form of *be* and a verb ending in *-ing*.\n\n- Present: *I am reading. She is reading. They are reading.*\n- Past: *He was reading. We were reading.*\n- Future: *I will be reading.*\n\nThe form of *be* must agree with the subject, and the *-ing* verb never stands alone as the verb of a sentence: *The baby sleeping* is not a sentence.",
          "进行时的动词有两部分：*be* 的某种形式加上以 *-ing* 结尾的动词。\n\n- 现在进行时：*I am reading. She is reading. They are reading.*\n- 过去进行时：*He was reading. We were reading.*\n- 将来进行时：*I will be reading.*\n\n*be* 的形式要和主语一致，而 *-ing* 形式的动词不能单独作句子的谓语：*The baby sleeping* 不是句子。",
        ),
        choiceGenerator(t("Which words complete the sentence?", "哪些词能补全句子？"), progressiveFormBank, pluralWhy, (wrong) =>
          t(
            `“${wrong}” is missing the right form of *be*, or uses one that does not agree with the subject or the time of the sentence.`,
            `“${wrong}” 缺少正确的 *be* 形式，或者所用的形式与主语或句子的时间不一致。`,
          ),
        ),
      ),
      point(
        "progressive-or-simple",
        t("Progressive or Simple?", "进行时还是一般时？"),
        t(
          "A **simple** tense tells that something happens, happened or will happen, often as a habit: *Dad walks the dog every morning.* A **progressive** tense shows the action going on at a particular moment: *Dad is walking the dog right now.*\n\nThe past progressive often sets the scene for something that interrupts it: *We were swimming when the storm began.*",
          "**一般时**表示某事发生、发生过或将要发生，常常是习惯：*Dad walks the dog every morning.* **进行时**表示动作在某一时刻正在进行：*Dad is walking the dog right now.*\n\n过去进行时常用来描述被另一件事打断的背景：*We were swimming when the storm began.*",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          progressiveMeaningBank,
          because("Its tense shows the kind of time the question asks for.", "它的时态表示的正是题目所问的那种时间。"),
          (wrong) =>
            t(
              `“${wrong}” uses a tense that tells about a different time, or about a habit instead of an action in progress, or the other way round.`,
              `“${wrong}” 所用的时态表示的是另一个时间，或者表示习惯而不是正在进行的动作，或者正好相反。`,
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
    prerequisites: ["simple-verb-tenses"],
    encompasses: [],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "what-modals-mean",
        t("What Each One Means", "各自的意思"),
        t(
          "A **modal verb** comes before another verb and changes its meaning:\n\n- *can*: able to: *Owls can see in the dark.*\n- *may*: allowed to, or asking politely: *May I come in?*\n- *might*: possible but not certain: *It might rain.*\n- *must*: a rule or a strong need: *You must stop at a red light.*\n- *should*: advice, the right thing to do: *You should wear a helmet.*",
          "**情态动词**放在另一个动词前面，改变它的意思：\n\n- *can*：能够：*Owls can see in the dark.*\n- *may*：允许，或礼貌地请求：*May I come in?*\n- *might*：可能但不确定：*It might rain.*\n- *must*：规定或强烈的需要：*You must stop at a red light.*\n- *should*：建议，应当做的事：*You should wear a helmet.*",
        ),
        choiceGenerator(
          t("Choose the modal verb.", "选择情态动词。"),
          modalMeaningBank,
          (right, shown) =>
            t(
              `**${right}**. ${shown.split("*")[1]?.replace("___", right) ?? ""}`,
              `正确的词是 **${right}**：${shown.split("*")[1]?.replace("___", right) ?? ""}`,
            ),
          (wrong) =>
            t(
              `“${wrong}” fits the grammar of the sentence but not the meaning the question asks for.`,
              `“${wrong}” 在语法上能放进句子，但不符合题目要求的意思。`,
            ),
        ),
      ),
      point(
        "modal-plus-plain-verb",
        t("A Modal and the Plain Verb", "情态动词加动词原形"),
        t(
          "After a modal verb, the next verb is always in its plain form: no *-s*, no *-ing*, no *to*. *She can ride*, not *She can rides*. *We must finish*, not *We must to finish*.\n\nIn a question, the modal moves to the front: *Can you help me?* In a negative, *not* follows the modal: *They should not run.*",
          "情态动词后面的动词总是原形：不加 *-s*，不加 *-ing*，也不加 *to*。*She can ride*，而不是 *She can rides*。*We must finish*，而不是 *We must to finish*。\n\n疑问句中，情态动词移到句首：*Can you help me?* 否定句中，*not* 放在情态动词后面：*They should not run.*",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          modalFormBank,
          because("The verb after the modal is in its plain form.", "情态动词后面的动词用的是原形。"),
          modalFormWhyNot,
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
          "A perfect verb is *has, have* or *had* followed by a **past participle**. For most verbs the participle is the same as the past: *walk, walked, have walked*.\n\nMany common verbs have a participle of their own, often ending in *-en* or *-n*: *eat, ate, eaten*; *write, wrote, written*; *go, went, gone*; *see, saw, seen*; *fly, flew, flown*. After *has, have* or *had*, use the participle, not the past: *We have eaten*, not *We have ate*.",
          "完成时的动词是 *has、have* 或 *had* 后接**过去分词**。大多数动词的过去分词和过去式相同：*walk, walked, have walked*。\n\n许多常用动词有自己的过去分词，常以 *-en* 或 *-n* 结尾：*eat, ate, eaten*；*write, wrote, written*；*go, went, gone*；*see, saw, seen*；*fly, flew, flown*。在 *has、have* 或 *had* 后面要用过去分词，而不是过去式：*We have eaten*，而不是 *We have ate*。",
        ),
        typedGenerator(
          "word-form",
          t("Type the past participle of the verb that completes the sentence.", "输入能补全句子的动词过去分词。"),
          participleBank,
          (right, shown) => {
            const sentence = shown.slice(shown.indexOf(":") + 2).replace("___", `**${right}**`);
            return t(sentence, `正确的句子是：${sentence}`);
          },
        ),
      ),
      point(
        "which-perfect",
        t("Which Perfect Tense", "用哪种完成时"),
        t(
          "- The **present perfect** (*has* or *have*) links the past to now: something started earlier and goes on, or happened at some time before now: *We have lived here for five years.*\n- The **past perfect** (*had*) shows that one past action came before another: *When we reached the station, the train had left.* The train left first.\n- The **future perfect** (*will have*) shows an action finished before a future time: *By June, I will have read twenty books.*",
          "- **现在完成时**（*has* 或 *have*）把过去和现在联系起来：某事早先开始并延续到现在，或在现在之前的某个时候发生过：*We have lived here for five years.*\n- **过去完成时**（*had*）表示一个过去的动作发生在另一个过去的动作之前：*When we reached the station, the train had left.* 火车先开走了。\n- **将来完成时**（*will have*）表示动作在将来某个时间之前完成：*By June, I will have read twenty books.*",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          perfectMeaningBank,
          because("Its tense shows exactly this order of times.", "它的时态正好表示这种时间先后。"),
          (wrong) =>
            t(
              `“${wrong}” uses a tense that does not show this order of times, or mixes a tense with a time it cannot go with.`,
              `“${wrong}” 所用的时态不能表示这种时间先后，或者把时态和不相配的时间放在了一起。`,
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
          "Some conjunctions come in pairs, one word before each of the two things they join:\n\n- *either ... or*: one of two choices: *either juice or milk*\n- *neither ... nor*: not this one and not that one: *Neither my sister nor I like spinach.*\n- *both ... and*: the two together: *Both the cat and the dog sleep here.*\n- *not only ... but also*: this, and that too: *She is not only kind but also funny.*\n\nThe halves always match: *neither* goes with *nor*, never with *or*.",
          "有些连词成对出现，所连接的两部分前面各有一个词：\n\n- *either ... or*：二选一：*either juice or milk*\n- *neither ... nor*：两者都不：*Neither my sister nor I like spinach.*\n- *both ... and*：两者都：*Both the cat and the dog sleep here.*\n- *not only ... but also*：不仅……而且：*She is not only kind but also funny.*\n\n两半总是配套的：*neither* 和 *nor* 搭配，从不和 *or* 搭配。",
        ),
        choiceGenerator(t("Which word or words complete the sentence?", "哪个词或哪些词能补全句子？"), pairBank, pluralWhy, (wrong) =>
          t(
            `“${wrong}” does not match the other half of the pair, or gives the opposite meaning.`,
            `“${wrong}” 和另一半不配套，或者意思正好相反。`,
          ),
        ),
      ),
      point(
        "pairs-and-agreement",
        t("Pairs and Agreement", "成对连词与主谓一致"),
        t(
          "When a pair joins two subjects, the verb must agree:\n\n- With *both ... and*, the subject is two things, so the verb is plural: *Both Leo and Kim play.*\n- With *either ... or* and *neither ... nor*, the verb agrees with the subject **nearer to it**: *Either my brothers or my sister walks the dog.* *Neither the teacher nor the students were late.*",
          "成对连词连接两个主语时，动词要与主语一致：\n\n- 用 *both ... and* 时，主语是两样东西，动词用复数：*Both Leo and Kim play.*\n- 用 *either ... or* 和 *neither ... nor* 时，动词和**离它较近**的主语一致：*Either my brothers or my sister walks the dog.* *Neither the teacher nor the students were late.*",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          pairAgreementBank,
          because(
            "The verb agrees with the right subject: plural after both ... and, and with the nearer subject after either ... or and neither ... nor.",
            "动词与该一致的主语一致：both ... and 之后用复数，either ... or 和 neither ... nor 之后与较近的主语一致。",
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
    prerequisites: ["capitals-and-end-punctuation"],
    encompasses: [{ topic: "capitals-and-end-punctuation", weight: 0.3 }],
    xp: 10,
    strand: "writing",
    knowledgePoints: [
      point(
        "proper-nouns",
        t("Proper Nouns", "专有名词"),
        t(
          "A **proper noun** names one particular person, place or thing, and it begins with a capital: *Chicago, the Nile River, Dr. Lopez, Maple Street, Friday, July, Thanksgiving, Spanish.*\n\nA **common noun** names any one of a kind and stays lower case: *a city, the museum, my dentist, summer.* A family word is capitalized only when it is used as a name: *Ask Uncle Ray*, but *my uncle*. Seasons are not capitalized.",
          "**专有名词**指特定的人、地方或事物，首字母大写：*Chicago, the Nile River, Dr. Lopez, Maple Street, Friday, July, Thanksgiving, Spanish.*\n\n**普通名词**指同类中的任何一个，用小写：*a city, the museum, my dentist, summer.* 表示亲属的词只有当作名字用时才大写：*Ask Uncle Ray*，但 *my uncle*。季节名称不大写。",
        ),
        choiceGenerator(
          t("Choose the sentence.", "选择句子。"),
          properNounBank,
          because("Every particular name is capitalized, and no common noun is.", "每个特定的名称都大写了，普通名词都没有大写。"),
          properWhyNot,
        ),
      ),
      point(
        "titles-of-works",
        t("Titles of Books and Stories", "书名和篇名"),
        t(
          "In the title of a book, story, song or film, capitalize the **first word** and every **important word**: nouns, verbs, adjectives, adverbs and pronouns.\n\nShort words that only connect, such as *a, an, the, and, but, or, of, in, on, to, for*, stay lower case unless they are the first word: *The Wind in the Willows*, *A Song for the Rain*.",
          "书、故事、歌曲或电影的标题中，**第一个词**和每个**重要的词**都要大写：名词、动词、形容词、副词和代词。\n\n只起连接作用的短词，如 *a, an, the, and, but, or, of, in, on, to, for*，除非是第一个词，否则用小写：*The Wind in the Willows*，*A Song for the Rain*。",
        ),
        choiceGenerator(
          t("Choose the title.", "选择标题。"),
          titleBank,
          because(
            "The first word and every important word are capitalized; the short connecting words are not.",
            "第一个词和每个重要的词都大写了，起连接作用的短词没有大写。",
          ),
          titleWhyNot,
        ),
      ),
    ],
  },
];
