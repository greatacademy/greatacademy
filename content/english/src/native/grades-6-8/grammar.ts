// Grades 6 to 8: grammar and punctuation the skill courses lacked: pronoun case, commas between adjectives, verb
// moods, gerund and infinitive phrases, the kinds of sentences, and dashes, parentheses and ellipses.

import { type Text, type TopicDef, t } from "@ga/content";
import { choiceGenerator, point } from "@ga/subject-english";
import {
  adjectiveCommaBank,
  adjectiveTestBank,
  compoundCaseBank,
  ellipsisBank,
  interruptionBank,
  moodBank,
  relationBank,
  sentenceKindBank,
  subjunctiveBank,
  verbalJobBank,
  verbalKindBank,
  whoBank,
} from "./grammar-banks.ts";

const filled = (right: string, shown: string): Text =>
  t(shown.replace("___", `**${right}**`), `正确的句子是：${shown.replace("___", `**${right}**`)}`);

const subjunctiveWhy = (right: string, shown: string): Text => {
  const sentence = shown.replace("___", `**${right}**`);
  return right === "were"
    ? t(
        `${sentence} A wish or a situation contrary to fact takes the subjunctive *were*, with every subject, even *I*, *he* and *she*.`,
        `${sentence} 愿望或与事实相反的情况用虚拟语气 *were*，所有主语都一样，包括 *I、he、she*。`,
      )
    : t(
        `${sentence} After a demand or recommendation such as *insist*, *suggest* or *require*, the subjunctive takes the plain verb *${right}*, with no *-s*.`,
        `${sentence} 在 *insist、suggest、require* 这类表示要求或建议的词之后，虚拟语气用动词原形 *${right}*，不加 *-s*。`,
      );
};

const bolded = (shown: string) => shown.match(/\*\*([^*]+)\*\*/u)?.[1] ?? "";

const verbalRule: Readonly<Record<string, readonly [string, string]>> = {
  "a gerund phrase": [
    "it is an *-ing* phrase doing a noun's job, so *it* or *something* could replace it",
    "它是承担名词作用的 *-ing* 短语，可以用 *it* 或 *something* 替换",
  ],
  "a participial phrase": [
    "it is an *-ing* or *-ed* phrase that describes a noun, usually set beside that noun with a comma",
    "它是修饰名词的 *-ing* 或 *-ed* 短语，通常用逗号隔开，紧挨着那个名词",
  ],
  "an infinitive phrase": ["it begins with *to* followed by the plain form of a verb", "它以 *to* 加动词原形开头"],
  "the subject of the sentence": [
    "it comes before the main verb and names what the sentence is about",
    "它在主要动词之前，说明句子讲的是什么",
  ],
  "the object of the verb": ["it follows the main verb and names what the verb acts on", "它跟在主要动词之后，说明动词作用的对象"],
  "a description of a noun": [
    "it is set off by a comma and describes the noun beside it, not the action",
    "它用逗号隔开，描述旁边的名词，而不是动作",
  ],
};

const verbalWhy = (right: string, shown: string): Text => {
  const [en, zh] = verbalRule[right] ?? ["", ""];
  return t(`*${bolded(shown)}* is **${right}**: ${en}.`, `*${bolded(shown)}* 是**${verbalZh[right] ?? right}**：${zh}。`);
};

const kindRule: Readonly<Record<string, readonly [string, string]>> = {
  simple: [
    "it has only one independent clause, one subject with its verb, and no other clause joined to it",
    "它只有一个独立分句，即一个主语和它的谓语，没有连接其他分句",
  ],
  compound: [
    "it joins two independent clauses as equals, with a comma and *and*, *but*, *or*, *so* or *yet*",
    "它用逗号加 *and、but、or、so、yet* 把两个独立分句平等地连接起来",
  ],
  complex: [
    "one of its clauses depends on the other, joined by a word such as *because*, *although*, *when* or *if*",
    "它的一个分句从属于另一个，由 *because、although、when、if* 这类词连接",
  ],
};

/** because builds the solution of a choice: the right option, and why it is right. */
const because =
  (en: string, zh: string) =>
  (right: string): Text =>
    t(`**${right}** ${en}`, `**${right}** ${zh}`);

const moodZh: Readonly<Record<string, string>> = {
  indicative: "陈述语气",
  imperative: "祈使语气",
  conditional: "条件语气",
  subjunctive: "虚拟语气",
};

const moodWhy: Readonly<Record<string, readonly [string, string]>> = {
  indicative: ["It states a fact or asks a question.", "它陈述事实或提出问题。"],
  imperative: ["It gives a command or a request, with *you* understood as the subject.", "它发出命令或请求，主语 *you* 省略。"],
  conditional: [
    "It says what would, could or might happen, using *would*, *could* or *might*.",
    "它用 *would、could、might* 表示会、能或可能发生的事。",
  ],
  subjunctive: [
    "It expresses a wish, a situation contrary to fact (*were*), or a demand with the plain verb (*be*, *rest*).",
    "它表达愿望、与事实相反的情况（*were*），或用动词原形（*be、rest*）表达要求。",
  ],
};

const kindZh: Readonly<Record<string, string>> = { simple: "简单句", compound: "并列句", complex: "复合句" };

const verbalZh: Readonly<Record<string, string>> = {
  "a gerund phrase": "动名词短语",
  "a participial phrase": "分词短语",
  "an infinitive phrase": "不定式短语",
  "the subject of the sentence": "句子的主语",
  "the object of the verb": "动词的宾语",
  "a description of a noun": "对名词的描述",
};

/** grammarTopics68 are the topics of grammar and punctuation added for grades 6 to 8. */
export const grammarTopics68: readonly TopicDef[] = [
  {
    id: "pronoun-case",
    title: t("Pronoun Case", "代词的格"),
    summary: t(
      "I or me, he or him, who or whom: the subject form for a subject and the object form for an object, even in pairs.",
      "I 还是 me，he 还是 him，who 还是 whom：主语用主格，宾语用宾格，成对出现时也一样。",
    ),
    prerequisites: ["pronoun-antecedent-agreement"],
    encompasses: [{ topic: "pronoun-antecedent-agreement", weight: 0.2 }],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "pronouns-in-pairs",
        t("Pronouns in Pairs", "成对出现的代词"),
        t(
          "A pronoun that does the action is a **subject** and takes the subject form: *I, he, she, we, they*. A pronoun that receives the action, or follows a preposition such as *for, to, with* or *between*, is an **object**: *me, him, her, us, them*.\n\nPairs cause most mistakes. Cover the other name and read the sentence with the pronoun alone: *Maya and (I / me) walked home* becomes *I walked home*, so *I* is right. *The coach drove Leo and (I / me)* becomes *The coach drove me*. A word ending in *-self*, such as *myself*, is only for a person who does something to themself or for emphasis, never in place of *I* or *me*.",
          "做动作的代词是**主语**，用主格：*I, he, she, we, they*。接受动作的代词，或者跟在 *for, to, with, between* 这类介词后面的代词，是**宾语**，用宾格：*me, him, her, us, them*。\n\n成对出现时最容易出错。把另一个名字遮住，只用代词读句子：*Maya and (I / me) walked home* 变成 *I walked home*，所以 *I* 正确。*The coach drove Leo and (I / me)* 变成 *The coach drove me*。以 *-self* 结尾的词，比如 *myself*，只用于对自己做某事或表示强调，不能代替 *I* 或 *me*。",
        ),
        choiceGenerator(t("Which pronoun completes the sentence?", "哪个代词能补全句子？"), compoundCaseBank, filled, (wrong) =>
          t(
            /self$|selves$/.test(wrong)
              ? `“${wrong}” is for someone who does something to themself, or for emphasis. Here it stands in for a plain subject or object.`
              : `Cover the other name and read the sentence with “${wrong}” alone: it is the wrong form for the pronoun's job here.`,
            /self$|selves$/.test(wrong)
              ? `“${wrong}” 用于对自己做某事或表示强调。这里它代替的是普通的主语或宾语。`
              : `把另一个名字遮住，只用 “${wrong}” 读这个句子：它不适合代词在这里的作用。`,
          ),
        ),
      ),
      point(
        "who-or-whom",
        t("Who or Whom", "who 还是 whom"),
        t(
          "*Who* is a subject, like *he*; *whom* is an object, like *him*. To choose, find the verb of the clause and ask whether the word does that action or receives it.\n\n*The girl **who** won the prize*: *who* does the winning, so it is a subject. *The girl **whom** the judges chose*: the judges do the choosing, and *whom* is the one chosen. In a question, answer it with *he* or *him*: *(Who / Whom) did you invite?* *I invited him*, so *whom*. After a preposition, always use *whom*: *to whom, with whom*.",
          "*who* 是主格，相当于 *he*；*whom* 是宾格，相当于 *him*。选择时，找出从句的动词，看这个词是做动作还是接受动作。\n\n*The girl **who** won the prize*：*who* 做了 won 这个动作，是主语。*The girl **whom** the judges chose*：做 chose 的是 the judges，*whom* 是被选的人。在疑问句中，用 *he* 或 *him* 来回答：*(Who / Whom) did you invite?* *I invited him*，所以用 *whom*。介词后面一律用 *whom*：*to whom, with whom*。",
        ),
        choiceGenerator(t("Which word completes the sentence?", "哪个词能补全句子？"), whoBank, filled, (wrong) =>
          t(
            /which/i.test(wrong)
              ? `“${wrong}” is for things and animals. The gap stands for a person.`
              : `“${wrong}” is the wrong case here. Find the verb of the clause and ask whether the word does the action or receives it.`,
            /which/i.test(wrong)
              ? `“${wrong}” 用于指物或动物，而空格指的是人。`
              : `这里用 “${wrong}” 格不对。找出从句的动词，看这个词是做动作还是接受动作。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "coordinate-adjectives",
    title: t("Commas Between Adjectives", "形容词之间的逗号"),
    summary: t(
      "A comma between coordinate adjectives (a long, cold night) but none between cumulative ones (an old stone bridge).",
      "并列形容词之间加逗号（a long, cold night），累积形容词之间不加（an old stone bridge）。",
    ),
    prerequisites: ["order-of-adjectives", "commas-in-a-series"],
    encompasses: [
      { topic: "commas-in-a-series", weight: 0.3 },
      { topic: "order-of-adjectives", weight: 0.2 },
    ],
    xp: 10,
    strand: "writing",
    knowledgePoints: [
      point(
        "comma-or-no-comma",
        t("Comma or No Comma", "加不加逗号"),
        t(
          "Two adjectives are **coordinate** when each describes the noun on its own and they could be joined by *and*: *a long and cold night*. Put a comma between them: *a long, cold night*.\n\nThey are **cumulative** when the first describes the second and the noun together, as a unit: in *an old stone bridge*, *old* describes *stone bridge*. *An old and stone bridge* sounds wrong, and so does *a stone old bridge*: use no comma.\n\nTwo tests: put *and* between them, or swap them. If both still sound right, use a comma. Never put a comma between the last adjective and the noun.",
          "如果两个形容词各自独立地修饰名词，并且可以用 *and* 连接（*a long and cold night*），它们就是**并列形容词**，中间加逗号：*a long, cold night*。\n\n如果第一个形容词修饰的是第二个形容词和名词组成的整体，它们就是**累积形容词**：在 *an old stone bridge* 中，*old* 修饰 *stone bridge*。*an old and stone bridge* 听起来不对，*a stone old bridge* 也不对：不加逗号。\n\n两个检验方法：在它们之间加 *and*，或者调换顺序。如果仍然通顺，就加逗号。最后一个形容词和名词之间永远不加逗号。",
        ),
        choiceGenerator(
          t("Which sentence is punctuated correctly?", "哪个句子的标点正确？"),
          adjectiveCommaBank,
          because(
            "Test the adjectives: if *and* fits between them and they can swap places, they take a comma; if not, they take none.",
            "检验这两个形容词：如果中间能加 *and* 并且能调换顺序，就加逗号；否则不加。",
          ),
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” treats the adjectives the wrong way. Put *and* between them and try swapping them, then decide.`,
                  `“${wrong}” 对这两个形容词的处理不对。在它们之间加 *and*，再试着调换顺序，然后判断。`,
                )
              : t(
                  `“${wrong}” puts a comma between the last adjective and its noun. A comma never separates an adjective from the noun it describes.`,
                  `“${wrong}” 在最后一个形容词和名词之间加了逗号。形容词和它修饰的名词之间永远不加逗号。`,
                ),
        ),
      ),
      point(
        "the-and-test",
        t("The And Test", "and 检验"),
        t(
          "Read the phrase with *and* between the adjectives. *A soft and warm blanket* sounds natural, so *soft* and *warm* are coordinate and need a comma. *A heavy and winter coat* sounds wrong, because *winter coat* is one thing that *heavy* describes, so no comma.\n\nAdjectives of number, color, origin and material often belong to the noun this way: *three young kittens, a famous Italian painter, a small wooden box*.",
          "在两个形容词之间加 *and* 读一读。*A soft and warm blanket* 读起来自然，所以 *soft* 和 *warm* 是并列的，需要逗号。*A heavy and winter coat* 听起来不对，因为 *winter coat* 是一个整体，*heavy* 修饰它，所以不加逗号。\n\n表示数量、颜色、来源和材料的形容词常常这样与名词结合：*three young kittens, a famous Italian painter, a small wooden box*。",
        ),
        choiceGenerator(
          t("Read the question and choose the phrase.", "阅读问题并选择短语。"),
          adjectiveTestBank,
          because("Put *and* between its adjectives and compare it with the others.", "在它的两个形容词之间加 *and*，再和其他选项比较。"),
          (wrong) =>
            t(
              `Put *and* between the adjectives of “${wrong}”: the result shows it belongs to the other group.`,
              `在 “${wrong}” 的两个形容词之间加 *and*：结果说明它属于另一类。`,
            ),
        ),
      ),
    ],
  },
  {
    id: "verb-moods",
    title: t("Verb Moods", "动词的语气"),
    summary: t(
      "Indicative, imperative, conditional and subjunctive: stating, commanding, imagining and wishing.",
      "陈述、祈使、条件和虚拟语气：陈述、命令、设想和愿望。",
    ),
    prerequisites: ["modal-verbs"],
    encompasses: [{ topic: "modal-verbs", weight: 0.2 }],
    xp: 12,
    strand: "grammar",
    knowledgePoints: [
      point(
        "naming-the-mood",
        t("Naming the Mood", "辨认语气"),
        t(
          "A verb's **mood** shows how the speaker means the sentence.\n\n- **Indicative** states a fact or asks a question: *The bus leaves at seven.*\n- **Imperative** gives a command or request: *Close the door.*\n- **Conditional** says what would, could or might happen: *With more time, I would rewrite it.*\n- **Subjunctive** expresses a wish, something contrary to fact, or a demand: *I wish it **were** summer. The coach insists that every player **be** on time.*",
          "动词的**语气**表示说话人怎样看待这句话。\n\n- **陈述语气**陈述事实或提出问题：*The bus leaves at seven.*\n- **祈使语气**发出命令或请求：*Close the door.*\n- **条件语气**表示会、能或可能发生的事：*With more time, I would rewrite it.*\n- **虚拟语气**表达愿望、与事实相反的情况或要求：*I wish it **were** summer. The coach insists that every player **be** on time.*",
        ),
        choiceGenerator(
          t("What is the mood of the sentence?", "这个句子是什么语气？"),
          moodBank,
          (right) =>
            t(
              `This is the **${right}** mood. ${moodWhy[right]?.[0] ?? ""}`,
              `这是**${moodZh[right]}**（${right}）。${moodWhy[right]?.[1] ?? ""}`,
            ),
          (wrong) =>
            t(
              `The **${wrong}** mood would be used for something else. ${moodWhy[wrong]?.[0] ?? ""} Look at the main verb and what the speaker is doing with it.`,
              `**${moodZh[wrong]}**用于别的情况。${moodWhy[wrong]?.[1] ?? ""}看看主要动词以及说话人用它做什么。`,
            ),
        ),
      ),
      point(
        "the-subjunctive",
        t("Forming the Subjunctive", "虚拟语气的形式"),
        t(
          "The subjunctive has two forms.\n\nFor a wish or something contrary to fact, use **were** with every subject, even *I*, *he* and *she*: *If I **were** taller…*, *I wish she **were** here.* Everyday speech often says *was*, but careful writing uses *were*.\n\nAfter words of demand or recommendation, such as *insist, require, suggest, recommend, ask that* and *it is important that*, use the **plain verb**, with no *-s* and no past tense: *The doctor recommends that she **rest**. It is vital that he **be** careful.*",
          "虚拟语气有两种形式。\n\n表示愿望或与事实相反的情况时，所有主语都用 **were**，包括 *I、he、she*：*If I **were** taller…*，*I wish she **were** here.* 日常口语常说 *was*，但严谨的书面语用 *were*。\n\n在表示要求或建议的词之后，例如 *insist, require, suggest, recommend, ask that, it is important that*，用**动词原形**，不加 *-s*，也不用过去式：*The doctor recommends that she **rest**. It is vital that he **be** careful.*",
        ),
        choiceGenerator(t("Which verb completes the sentence?", "哪个动词能补全句子？"), subjunctiveBank, subjunctiveWhy, (wrong) =>
          t(
            `“${wrong}” is the indicative form. A wish or an unreal condition takes *were*, and a demand or recommendation takes the plain verb.`,
            `“${wrong}” 是陈述语气的形式。愿望或非真实条件用 *were*，要求或建议用动词原形。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "gerund-and-infinitive-phrases",
    title: t("Gerund and Infinitive Phrases", "动名词短语和不定式短语"),
    summary: t(
      "Verbals that act as nouns and modifiers, and telling a gerund from a participle.",
      "充当名词和修饰语的非谓语动词，以及区分动名词和分词。",
    ),
    prerequisites: ["participial-phrases"],
    encompasses: [{ topic: "participial-phrases", weight: 0.2 }],
    xp: 12,
    strand: "grammar",
    knowledgePoints: [
      point(
        "naming-the-verbal",
        t("Gerund, Participle or Infinitive", "动名词、分词还是不定式"),
        t(
          "A **verbal** is a verb form that does another job in the sentence.\n\n- A **gerund phrase** is an *-ing* phrase used as a noun: ***Climbing the tree** was fun. Mia loved **climbing the tree**.*\n- A **participial phrase** is an *-ing* (or *-ed*) phrase used as an adjective, describing a noun: ***Climbing the tree**, Mia saw her kite.* It describes Mia.\n- An **infinitive phrase** begins with *to* and a plain verb: *Mia wanted **to climb the tree**.*\n\nTo tell a gerund from a participle, replace the phrase with *it*. *It was fun* works, so the phrase is a gerund. *It, Mia saw her kite* does not, so it is a participle.",
          "**非谓语动词**是在句中承担其他作用的动词形式。\n\n- **动名词短语**是用作名词的 *-ing* 短语：***Climbing the tree** was fun. Mia loved **climbing the tree**.*\n- **分词短语**是用作形容词、修饰名词的 *-ing*（或 *-ed*）短语：***Climbing the tree**, Mia saw her kite.* 它修饰 Mia。\n- **不定式短语**以 *to* 加动词原形开头：*Mia wanted **to climb the tree**.*\n\n区分动名词和分词时，用 *it* 替换这个短语。*It was fun* 说得通，所以是动名词。*It, Mia saw her kite* 说不通，所以是分词。",
        ),
        choiceGenerator(t("What kind of phrase is in bold?", "加粗的是哪种短语？"), verbalKindBank, verbalWhy, (wrong) =>
          t(
            `It is not ${wrong}. Check whether it begins with *to*, and if it is an *-ing* phrase, try replacing it with *it*.`,
            `它不是${verbalZh[wrong]}。看看它是否以 *to* 开头；如果是 *-ing* 短语，试着用 *it* 替换它。`,
          ),
        ),
      ),
      point(
        "what-the-phrase-does",
        t("What the Phrase Does", "短语的作用"),
        t(
          "A gerund phrase does the jobs of a noun. Before the verb, it is the **subject**: ***Baking bread** fills the house with a smell.* After a verb such as *enjoy, love, start, suggest* or *mind*, it is the **object**: *Grandpa loves **baking bread**.*\n\nA participial phrase does the job of an adjective: it **describes a noun**, usually the subject right after the comma: ***Baking bread**, Grandpa hummed.* The phrase tells us about Grandpa.",
          "动名词短语承担名词的作用。在动词之前，它是**主语**：***Baking bread** fills the house with a smell.* 在 *enjoy, love, start, suggest, mind* 这类动词之后，它是**宾语**：*Grandpa loves **baking bread**.*\n\n分词短语承担形容词的作用：它**描述一个名词**，通常是逗号后面的主语：***Baking bread**, Grandpa hummed.* 这个短语告诉我们关于 Grandpa 的情况。",
        ),
        choiceGenerator(t("What job does the phrase in bold do?", "加粗的短语在句中起什么作用？"), verbalJobBank, verbalWhy, (wrong) =>
          t(
            `It is not ${wrong}. Find the main verb: what comes before it is the subject, what it acts on is the object, and a phrase set off by a comma usually describes the noun next to it.`,
            `它不是${verbalZh[wrong]}。找出主要动词：它前面的是主语，它作用的对象是宾语，用逗号隔开的短语通常描述旁边的名词。`,
          ),
        ),
      ),
    ],
  },
  {
    id: "simple-compound-and-complex-sentences",
    title: t("Simple, Compound and Complex Sentences", "简单句、并列句和复合句"),
    summary: t(
      "Naming the kind of a sentence, and choosing one that shows how its ideas relate.",
      "辨认句子的类型，并选择能表明观点之间关系的句型。",
    ),
    prerequisites: ["subordinating-conjunctions"],
    encompasses: [
      { topic: "subordinating-conjunctions", weight: 0.3 },
      { topic: "coordinating-conjunctions", weight: 0.2 },
    ],
    xp: 10,
    strand: "grammar",
    knowledgePoints: [
      point(
        "naming-the-kind",
        t("Naming the Kind", "辨认句子类型"),
        t(
          "A **clause** has its own subject and verb. A **simple** sentence has one independent clause: *The bell rang.* A **compound** sentence joins two independent clauses as equals, with a comma and *and, but, or, so* or *yet*: *The bell rang, and the students left.* A **complex** sentence has an independent clause and a dependent one that begins with a word such as *because, although, when, after* or *while*: *When the bell rang, the students left.*",
          "**分句**有自己的主语和谓语。**简单句**只有一个独立分句：*The bell rang.* **并列句**用逗号加 *and, but, or, so, yet* 把两个独立分句平等地连起来：*The bell rang, and the students left.* **复合句**有一个独立分句和一个以 *because, although, when, after, while* 等词开头的从属分句：*When the bell rang, the students left.*",
        ),
        choiceGenerator(
          t("What kind of sentence is this?", "这是哪种句子？"),
          sentenceKindBank,
          (right) =>
            t(
              `It is **${right}**: ${kindRule[right]?.[0] ?? ""}.`,
              `它是**${kindZh[right]}**（${right}）：${kindRule[right]?.[1] ?? ""}。`,
            ),
          (wrong) =>
            t(
              `It is not ${wrong}. Count the clauses, then look at the word that joins them: *and, but, so* join equals; *because, although, when* make one clause depend on the other.`,
              `它不是${kindZh[wrong]}。数一数分句，再看连接它们的词：*and, but, so* 连接平等的分句；*because, although, when* 使一个分句从属于另一个。`,
            ),
        ),
      ),
      point(
        "showing-how-ideas-relate",
        t("Showing How Ideas Relate", "表明观点之间的关系"),
        t(
          "*And* only adds one idea to another. A complex sentence can say exactly how they relate: *because* or *since* for a cause, *although* for a surprising contrast, *when, after, as soon as, while* or *once* for time.\n\nWhen the dependent clause comes first, put a comma after it: *Because the road flooded, the bus was late.* When it comes second, no comma is needed: *The bus was late because the road flooded.*",
          "*and* 只是把一个观点加到另一个上。复合句能准确表达它们的关系：*because* 或 *since* 表示原因，*although* 表示出人意料的转折，*when, after, as soon as, while, once* 表示时间。\n\n从属分句在前时，后面加逗号：*Because the road flooded, the bus was late.* 从属分句在后时，不需要逗号：*The bus was late because the road flooded.*",
        ),
        choiceGenerator(
          t("Which sentence joins the ideas as asked?", "哪个句子按要求连接了这两个观点？"),
          relationBank,
          because("Its subordinating conjunction states the relation that was asked for.", "它的从属连词表达了题目要求的关系。"),
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” joins the ideas with *and*, which only adds one to the other. It does not say how they relate.`,
                  `“${wrong}” 用 *and* 连接，只是把两个观点并列，没有说明它们的关系。`,
                )
              : t(
                  `“${wrong}” uses a conjunction that states a different relation. Read it aloud: it does not say what the two ideas have to do with each other.`,
                  `“${wrong}” 用的连词表达了另一种关系。读一读：它没有说对两个观点之间的关系。`,
                ),
        ),
      ),
    ],
  },
  {
    id: "dashes-parentheses-and-ellipses",
    title: t("Dashes, Parentheses and Ellipses", "破折号、括号和省略号"),
    summary: t(
      "Setting off an interruption with a pair of dashes or parentheses, and marking words left out of a quotation.",
      "用一对破折号或括号隔开插入语，以及标出引文中省略的词。",
    ),
    prerequisites: ["appositives", "commas-after-introductions"],
    encompasses: [{ topic: "appositives", weight: 0.2 }],
    xp: 10,
    strand: "writing",
    knowledgePoints: [
      point(
        "dashes-and-parentheses",
        t("Dashes and Parentheses", "破折号和括号"),
        t(
          "Like commas around an appositive, **dashes** and **parentheses** set off words that interrupt a sentence. Dashes make the interruption stand out: *My grandmother—who is eighty-two—still swims.* Parentheses make it quieter, an aside: *My grandmother (who is eighty-two) still swims.*\n\nBoth come in **pairs** around the interruption. Do not open with a dash and close with a comma, and do not leave a parenthesis unclosed. Take the interruption out, and the sentence must still read correctly.",
          "和同位语两边的逗号一样，**破折号**和**括号**用来隔开打断句子的词。破折号让插入的内容更醒目：*My grandmother—who is eighty-two—still swims.* 括号让它更低调，像一句旁白：*My grandmother (who is eighty-two) still swims.*\n\n两者都要**成对**地放在插入语两边。不要用破折号开头、用逗号结尾，也不要让括号缺一半。去掉插入语后，句子必须仍然通顺。",
        ),
        choiceGenerator(
          t("Which sentence is punctuated as asked?", "哪个句子的标点符合要求？"),
          interruptionBank,
          because(
            "The marks come in a pair, one on each side of the interruption, and the sentence still reads correctly without it.",
            "标点成对出现，插入语两边各一个；去掉插入语，句子仍然通顺。",
          ),
          (wrong) =>
            t(
              `In “${wrong}”, the marks do not form a matching pair around the interruption. Find where the interruption starts and ends, and put the same mark at each end.`,
              `在 “${wrong}” 中，插入语两边的标点没有配成一对。找出插入语的开头和结尾，在两端放相同的标点。`,
            ),
        ),
      ),
      point(
        "ellipses",
        t("Ellipses in Quotations", "引文中的省略号"),
        t(
          'An **ellipsis** (*...*) marks words left out of a quotation. When you quote a source, you may shorten it, but you must show where you cut, and what remains must keep the writer\'s meaning: *The old bridge ... will close next month.*\n\nLeaving words out without an ellipsis puts words in a different order from the source, as if the writer had said them that way. An ellipsis can also show a pause or a voice trailing off in dialogue: *"I thought ... never mind."*',
          '**省略号**（*...*）标出引文中省略的词。引用资料时可以缩短原文，但必须标出删去的地方，而且保留的部分要保持作者的原意：*The old bridge ... will close next month.*\n\n删去词语却不加省略号，会让引文看起来像作者原本就是这样说的。省略号也可以在对话中表示停顿或话没说完：*"I thought ... never mind."*',
        ),
        choiceGenerator(
          t("Quote this sentence, leaving out the words in brackets.", "引用这个句子，省略方括号中的词。"),
          ellipsisBank,
          because(
            "It leaves out only the words in brackets and marks the gap with an ellipsis.",
            "它只省略了方括号中的词，并用省略号标出了空缺。",
          ),
          (wrong, _right, _shown, position) =>
            position === 0
              ? t(
                  `“${wrong}” leaves words out without an ellipsis, so it looks as if the writer said it exactly that way.`,
                  `“${wrong}” 删去了词却没有加省略号，看起来就像作者原话就是这样。`,
                )
              : t(
                  `“${wrong}” cuts the end of the sentence, which carries its point, and keeps the words that were to be left out.`,
                  `“${wrong}” 删掉了句子表达要点的结尾，却保留了本该省略的词。`,
                ),
        ),
      ),
    ],
  },
];
