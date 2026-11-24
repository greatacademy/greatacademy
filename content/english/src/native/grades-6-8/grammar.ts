// Grades 6 to 8: grammar and punctuation the first slice lacked: pronoun case, commas between adjectives, verb
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

const subjunctiveWhy = (right: string, shown: string): Text => {
  const sentence = shown.replace("___", `**${right}**`);
  return right === "were"
    ? t(
        `${sentence} A wish or a situation contrary to fact takes the subjunctive **were** with every subject, even *I*, *he*, and *she*.\n\n**Check.** Ask whether the clause states a real past fact or an unreal wish/condition (*if*, *wish*): because it is contrary to fact, **were** replaces *was*.`,
        `${sentence} 愿望或与事实相反的情况用虚拟语气 **were**，所有主语都一样，包括 *I*、*he*、*she*。\n\n**检验。** 问问从句说的是真实过去事实还是非真实愿望/条件（*if*、*wish*）：它与事实相反，因此用 **were** 代替 *was*。`,
      )
    : t(
        `${sentence} After a demand or recommendation such as *insist*, *suggest*, or *require*, the subjunctive takes the base verb **${right}** with no *-s*.\n\n**Check.** Spot the trigger verb (*insist*, *suggest*, *recommend*, *require*, *ask*) before *that*: it locks the clause verb into its bare dictionary form **${right}**.`,
        `${sentence} 在 *insist*、*suggest*、*require* 等要求或建议词之后，虚拟语气用动词原形 **${right}**，不加 *-s*。\n\n**检验。** 找到 *that* 前面的触发词（*insist*、*suggest*、*recommend*、*require*、*ask*）：它要求从句动词一律保持原形 **${right}**。`,
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

const verbalCheck: Readonly<Record<string, readonly [string, string]>> = {
  "a gerund phrase": [
    "Replace the bold phrase with *it*: the sentence still works, proving it acts as a noun.",
    "把加粗短语替换成 *it*：句子依然成立，说明它起名词作用。",
  ],
  "a participial phrase": [
    "Drop the bold phrase from the sentence: the main clause still stands, and the phrase modifies the noun right beside it.",
    "拿掉加粗短语后主句依然完整，而且它紧挨着并修饰旁边的名词。",
  ],
  "an infinitive phrase": [
    "Look at the opening two words: *to* followed immediately by a base verb marks an infinitive phrase.",
    "看短语最前面两个词：*to* 紧跟动词原形，就是不定式短语。",
  ],
  "the subject of the sentence": [
    "Find the main verb and ask *What does it?* — the bold phrase sits before the verb and answers that question.",
    "找到主谓动词并问“是什么做了这个动作？”——动词前面的加粗短语正是答案。",
  ],
  "the object of the verb": [
    "Find the main verb and ask *verb + what?* — the bold phrase comes right after the verb and completes it.",
    "找到主谓动词并问“动词 + 什么？”——紧跟动词后的加粗短语正是宾语。",
  ],
  "a description of a noun": [
    "Try replacing the bold phrase with *it*: it fails because the phrase modifies the noun beside it rather than acting as a noun.",
    "试着把加粗短语换成 *it*：句子会不通，因为它在修饰旁边的名词，而不是作名词。",
  ],
};

const verbalWhy = (right: string, shown: string): Text => {
  const [en, zh] = verbalRule[right] ?? ["", ""];
  const [checkEn, checkZh] = verbalCheck[right] ?? ["", ""];
  return t(
    `*${bolded(shown)}* is **${right}**: ${en}.\n\n**Check.** ${checkEn}`,
    `*${bolded(shown)}* 是**${verbalZh[right] ?? right}**：${zh}。\n\n**检验。** ${checkZh}`,
  );
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

const kindCheck: Readonly<Record<string, readonly [string, string]>> = {
  simple: [
    "Count the subject–verb clauses: there is just one complete clause standing alone.",
    "数一数主谓分句：全句只有一个能独立成句的主谓结构。",
  ],
  compound: [
    "Cover the conjunction (*and*, *but*, *or*, *so*, *yet*): both sides can stand on their own as full sentences.",
    "遮住并列连词（*and*、*but*、*or*、*so*、*yet*）：两侧各自都能独立成句。",
  ],
  complex: [
    "Find the subordinating word (*because*, *although*, *when*, *if*, *while*): the clause it starts cannot stand alone.",
    "找到从属连词（*because*、*although*、*when*、*if*、*while*）：它引导的那一半不能独立成句。",
  ],
};

/** because builds the solution of a choice: the right option, why it is right, and an independent check. */
const because =
  (en: string, zh: string, checkEn: string, checkZh: string) =>
  (right: string): Text =>
    t(`**${right}** ${en}\n\n**Check.** ${checkEn}`, `**${right}** ${zh}\n\n**检验。** ${checkZh}`);

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
    intro: t(
      "Nobody says *Me built the raft*, yet many people slip and say *Sam and me built the raft*. Testing a pronoun alone—without the paired name—and testing *who/whom* with *he/him* reveals the right case every time.",
      "没人会说 *Me built the raft*，却很容易错说 *Sam and me built the raft*。把并列的人名遮住单独检验代词，以及用 *he/him* 替换检验 *who/whom*，就能每次都选对格。",
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
          "A pronoun that does the action is a **subject** and takes the subject form: *I, he, she, we, they*. A pronoun that receives the action, or follows a preposition such as *for, to, with* or *between*, is an **object**: *me, him, her, us, them*.\n\nPairs cause most mistakes. Cover the other name and read the sentence with the pronoun alone: *Maya and (I / me) walked home* becomes *I walked home*, so *I* is right. *The coach drove Leo and (I / me)* becomes *The coach drove me*. A word ending in *-self*, such as *myself*, is only for a person who does something to themself or for emphasis, never in place of *I* or *me*.\n\n> **Watch out.** Do not use *myself* just to sound polite (*between you and myself* is wrong)—after a preposition like *between*, *for*, or *with*, always use the object form (*me*, *him*, *her*, *us*, *them*).",
          "做动作的代词是**主语**，用主格：*I, he, she, we, they*。接受动作的代词，或者跟在 *for, to, with, between* 这类介词后面的代词，是**宾语**，用宾格：*me, him, her, us, them*。\n\n成对出现时最容易出错。把另一个名字遮住，只用代词读句子：*Maya and (I / me) walked home* 变成 *I walked home*，所以 *I* 正确。*The coach drove Leo and (I / me)* 变成 *The coach drove me*。以 *-self* 结尾的词，比如 *myself*，只用于对自己做某事或表示强调，不能代替 *I* 或 *me*。\n\n> **注意。** 不要为了显得客气就乱用 *myself*（*between you and myself* 是错的）——在 *between*、*for*、*with* 等介词后一律用宾格（*me*、*him*、*her*、*us*、*them*）。",
        ),
        choiceGenerator(
          t("Which pronoun completes the sentence?", "哪个代词能补全句子？"),
          compoundCaseBank,
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)}\n\n**Check.** Cover the paired name and read the sentence with **${right}** alone—it matches the pronoun's exact job (subject or object) cleanly.`,
              `正确的句子是：${shown.replace("___", `**${right}**`)}\n\n**检验。** 遮住并列的人名，只留 **${right}** 通读全句——正好符合代词在这里的主语或宾语身份。`,
            ),
          (wrong) =>
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
          "*Who* is a subject, like *he*; *whom* is an object, like *him*. To choose, find the verb of the clause and ask whether the word does that action or receives it.\n\n*The girl **who** won the prize*: *who* does the winning, so it is a subject. *The girl **whom** the judges chose*: the judges do the choosing, and *whom* is the one chosen. In a question, answer it with *he* or *him*: *(Who / Whom) did you invite?* *I invited him*, so *whom*. After a preposition, always use *whom*: *to whom, with whom*.\n\n> **Watch out.** Test the *clause* containing the blank, not the main sentence—even if the person is the object of the main verb, use *who* if the word is the subject of its own clause.",
          "*who* 是主格，相当于 *he*；*whom* 是宾格，相当于 *him*。选择时，找出从句的动词，看这个词是做动作还是接受动作。\n\n*The girl **who** won the prize*：*who* 做了 won 这个动作，是主语。*The girl **whom** the judges chose*：做 chose 的是 the judges，*whom* 是被选的人。在疑问句中，用 *he* 或 *him* 来回答：*(Who / Whom) did you invite?* *I invited him*，所以用 *whom*。介词后面一律用 *whom*：*to whom, with whom*。\n\n> **注意。** 要检验空格所在的*从句*而不是主句——就算这个人在主句里作宾语，只要在从句里作主语，仍要用 *who*。",
        ),
        choiceGenerator(
          t("Which word completes the sentence?", "哪个词能补全句子？"),
          whoBank,
          (right, shown) =>
            t(
              `${shown.replace("___", `**${right}**`)}\n\n**Check.** Substitute *he* (for *who*) or *him* (for *whom*) into the clause—**${right}** matches the exact subject/object role.`,
              `正确的句子是：${shown.replace("___", `**${right}**`)}\n\n**检验。** 把 *he*（对应 *who*）或 *him*（对应 *whom*）代入从句验证——**${right}** 正好符合这里的格。`,
            ),
          (wrong) =>
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
    intro: t(
      "Why does *a bright, windy morning* take a comma while *a small wooden boat* takes none? Try putting *and* between the adjectives and swapping their order: coordinate adjectives pass both tests, while cumulative adjectives fail them.",
      "为什么 *a bright, windy morning* 要加逗号，而 *a small wooden boat* 不加？试着在两个形容词间加上 *and* 并调换顺序：并列形容词两项检验都通顺，累积形容词则不通顺。",
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
          "Two adjectives are **coordinate** when each describes the noun on its own and they could be joined by *and*: *a long and cold night*. Put a comma between them: *a long, cold night*.\n\nThey are **cumulative** when the first describes the second and the noun together, as a unit: in *an old stone bridge*, *old* describes *stone bridge*. *An old and stone bridge* sounds wrong, and so does *a stone old bridge*: use no comma.\n\nTwo tests: put *and* between them, or swap them. If both still sound right, use a comma. Never put a comma between the last adjective and the noun.\n\n> **Watch out.** Check the second adjective right before the noun—never let a comma slip between that last adjective and the noun itself.",
          "如果两个形容词各自独立地修饰名词，并且可以用 *and* 连接（*a long and cold night*），它们就是**并列形容词**，中间加逗号：*a long, cold night*。\n\n如果第一个形容词修饰的是第二个形容词和名词组成的整体，它们就是**累积形容词**：在 *an old stone bridge* 中，*old* 修饰 *stone bridge*。*an old and stone bridge* 听起来不对，*a stone old bridge* 也不对：不加逗号。\n\n两个检验方法：在它们之间加 *and*，或者调换顺序。如果仍然通顺，就加逗号。最后一个形容词和名词之间永远不加逗号。\n\n> **注意。** 盯紧紧挨着名词的那个形容词——绝不要在最后一个形容词和名词之间误加逗号。",
        ),
        choiceGenerator(
          t("Which sentence is punctuated correctly?", "哪个句子的标点正确？"),
          adjectiveCommaBank,
          (right) =>
            t(
              `**${right}**\n\n**Check.** Run both tests on the two adjectives in **${right}**: if *and* fits between them and they can swap places naturally, they take a comma; if not, they take none, and no comma touches the noun.`,
              `**${right}**\n\n**检验。** 对 **${right}** 里的两个形容词做两项检验：如果中间能加 *and* 且调换顺序仍自然，就加逗号；否则不加，且逗号绝不放在名词紧前面。`,
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
          "Read the phrase with *and* between the adjectives. *A soft and warm blanket* sounds natural, so *soft* and *warm* are coordinate and need a comma. *A heavy and winter coat* sounds wrong, because *winter coat* is one thing that *heavy* describes, so no comma.\n\nAdjectives of number, color, origin and material often belong to the noun this way: *three young kittens, a famous Italian painter, a small wooden box*.\n\n> **Watch out.** Read the prompt carefully to see whether it asks for the phrase that *needs* a comma or the one that does *not* need a comma.",
          "在两个形容词之间加 *and* 读一读。*A soft and warm blanket* 读起来自然，所以 *soft* 和 *warm* 是并列的，需要逗号。*A heavy and winter coat* 听起来不对，因为 *winter coat* 是一个整体，*heavy* 修饰它，所以不加逗号。\n\n表示数量、颜色、来源和材料的形容词常常这样与名词结合：*three young kittens, a famous Italian painter, a small wooden box*。\n\n> **注意。** 看清题干问的是*需要*加逗号还是*不需要*加逗号的短语，再套用 *and* 检验。",
        ),
        choiceGenerator(
          t("Read the question and choose the phrase.", "阅读问题并选择短语。"),
          adjectiveTestBank,
          (right) =>
            t(
              `**${right}** is the right choice.\n\n**Check.** Insert *and* between the two adjectives in **${right}** and compare the sound against the other options—it matches the exact group asked for.`,
              `**${right}** 是正确选项。\n\n**检验。** 在 **${right}** 的两个形容词间插入 *and* 并与另两项对比——它正好符合题干要求的那一类。`,
            ),
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
    intro: t(
      "*The ferry leaves at noon*, *Board the ferry*, *We would miss the ferry*, and *I wish I were on that ferry* all talk about the same boat—yet each verb **mood** signals a different purpose: stating, commanding, imagining, or wishing.",
      "*The ferry leaves at noon*、*Board the ferry*、*We would miss the ferry* 和 *I wish I were on that ferry* 说的都是同一艘渡轮，却用四种动词**语气**分别表达陈述、命令、假设和愿望。",
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
          "A verb's **mood** shows how the speaker intends the sentence.\n\n- **Indicative** states a fact or asks a question: *The bus leaves at seven.*\n- **Imperative** gives a command or request (with *you* understood): *Close the door.*\n- **Conditional** says what would, could, or might happen: *With more time, I would rewrite it.*\n- **Subjunctive** expresses a wish, something contrary to fact, or a demand: *I wish it **were** summer. The coach insists that every player **be** on time.*\n\n> **Watch out.** Do not confuse **conditional** (*would/could/might* for what would happen) with **subjunctive** (*were* in a wish/unreal *if*-clause, or a bare verb after *insist/suggest/require*).",
          "动词的**语气**表明说话人打算怎样使用这句话。\n\n- **陈述语气**陈述事实或提问：*The bus leaves at seven.*\n- **祈使语气**发出命令或请求（省略主语 *you*）：*Close the door.*\n- **条件语气**用 *would/could/might* 表示会、能或可能发生的事：*With more time, I would rewrite it.*\n- **虚拟语气**表达愿望、与事实相反的情况或要求：*I wish it **were** summer. The coach insists that every player **be** on time.*\n\n> **注意。** 别把**条件语气**（用 *would/could/might* 说结果）和**虚拟语气**（愿望/非真实 *if* 从句中的 *were*，或 *insist/suggest/require* 后的动词原形）混在一起。",
        ),
        choiceGenerator(
          t("What is the mood of the sentence?", "这个句子是什么语气？"),
          moodBank,
          (right) =>
            t(
              `This is the **${right}** mood. ${moodWhy[right]?.[0] ?? ""}\n\n**Check.** Test the verb's form and subject: ${
                right === "indicative"
                  ? "it simply reports a fact or asks an ordinary question"
                  : right === "imperative"
                    ? "it opens with a base verb giving an order to an unstated *you*"
                    : right === "conditional"
                      ? "it uses *would*, *could*, or *might* to show a conditional outcome"
                      : "it uses unreal *were* or a bare verb after a demand or recommendation"
              }.`,
              `这是**${moodZh[right]}**（${right}）。${moodWhy[right]?.[1] ?? ""}\n\n**检验。** 核对动词形式和主语：${
                right === "indicative"
                  ? "句子只是陈述事实或提出普通问题"
                  : right === "imperative"
                    ? "句子以动词原形开头，向省略的 *you* 发出命令或请求"
                    : right === "conditional"
                      ? "句子用 *would*、*could* 或 *might* 表示条件下的结果"
                      : "句子用了非真实的 *were*，或在要求、建议词后用了动词原形"
              }。`,
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
          "The subjunctive has two main patterns.\n\nFor a wish or something contrary to fact, use **were** with every subject—even *I*, *he*, and *she*: *If I **were** taller…*, *I wish she **were** here.* Everyday speech often slips into *was*, but formal writing uses **were**.\n\nAfter verbs or expressions of demand or recommendation (*insist*, *require*, *suggest*, *recommend*, *ask that*, *it is important that*), use the **base verb** with no *-s* and no past tense: *The doctor recommends that she **rest**. It is vital that he **be** careful.*\n\n> **Watch out.** Do not add *-s* for *he/she/it* after *suggest that* or *insist that*—write *that she **rest*** and *that he **be***, never *rests* or *is*.",
          "虚拟语气有两种主要形式。\n\n表示愿望或与事实相反的情况时，所有主语都用 **were**，包括 *I*、*he*、*she*：*If I **were** taller…*，*I wish she **were** here.* 日常口语常说 *was*，但正式书面语要用 **were**。\n\n在表示要求或建议的表达（*insist*、*require*、*suggest*、*recommend*、*ask that*、*it is important that*）之后，一律用**动词原形**，不加 *-s*，也不用过去式：*The doctor recommends that she **rest**. It is vital that he **be** careful.*\n\n> **注意。** 在 *suggest that* 或 *insist that* 后即使主语是 *he/she/it* 也不要加 *-s*——要写 *that she **rest***、*that he **be***，而不是 *rests* 或 *is*。",
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
    intro: t(
      "The exact same *-ing* words can do completely different jobs: in *Sailing across the bay takes skill*, the phrase acts as a noun (**gerund**); in *Sailing across the bay, we spotted seals*, it describes *we* (**participle**). And *to sail across the bay* is an **infinitive phrase**. In this topic you name each verbal phrase and trace its job in the sentence.",
      "完全相同的 *-ing* 短语在句中可以扮演截然不同的角色：在 *Sailing across the bay takes skill* 里它作名词（**动名词短语**）；在 *Sailing across the bay, we spotted seals* 里它修饰 *we*（**分词短语**）；而 *to sail across the bay* 则是**不定式短语**。本节练习辨认这三类非谓语短语，并判断它们在句中的作用。",
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
          "A **verbal** is a verb form that does another job in the sentence.\n\n- A **gerund phrase** is an *-ing* phrase used as a noun: ***Climbing the tree** was fun. Mia loved **climbing the tree**.*\n- A **participial phrase** is an *-ing* (or *-ed*) phrase used as an adjective, describing a noun: ***Climbing the tree**, Mia saw her kite.* It describes Mia.\n- An **infinitive phrase** begins with *to* and a plain verb: *Mia wanted **to climb the tree**.*\n\nTo tell a gerund from a participle, replace the phrase with *it*. *It was fun* works, so the phrase is a gerund. *It, Mia saw her kite* does not, so it is a participle.\n\n> **Watch out.** Do not mistake *to + noun* (*to the park*) for an infinitive phrase—an infinitive always pairs *to* with a **verb** (*to climb*, *to win*).",
          "**非谓语动词**是在句中承担其他作用的动词形式。\n\n- **动名词短语**是用作名词的 *-ing* 短语：***Climbing the tree** was fun. Mia loved **climbing the tree**.*\n- **分词短语**是用作形容词、修饰名词的 *-ing*（或 *-ed*）短语：***Climbing the tree**, Mia saw her kite.* 它修饰 Mia。\n- **不定式短语**以 *to* 加动词原形开头：*Mia wanted **to climb the tree**.*\n\n区分动名词和分词时，用 *it* 替换这个短语。*It was fun* 说得通，所以是动名词。*It, Mia saw her kite* 说不通，所以是分词。\n\n> **注意。** 不要把 *to + 名词*（如 *to the park*）当成不定式短语——不定式一定是 *to* 紧跟**动词原形**（*to climb*、*to win*）。",
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
          "A gerund phrase does the jobs of a noun. Before the verb, it is the **subject**: ***Baking bread** fills the house with a smell.* After a verb such as *enjoy, love, start, suggest* or *mind*, it is the **object**: *Grandpa loves **baking bread**.*\n\nA participial phrase does the job of an adjective: it **describes a noun**, usually the subject right after the comma: ***Baking bread**, Grandpa hummed.* The phrase tells us about Grandpa.\n\n> **Watch out.** An *-ing* phrase at the very front of a sentence can be *either* the subject (no comma before the verb: *Baking bread fills…*) or a noun modifier (comma before the subject: *Baking bread, Grandpa hummed*). Look for the comma and the real subject.",
          "动名词短语承担名词的作用。在动词之前，它是**主语**：***Baking bread** fills the house with a smell.* 在 *enjoy, love, start, suggest, mind* 这类动词之后，它是**宾语**：*Grandpa loves **baking bread**.*\n\n分词短语承担形容词的作用：它**描述一个名词**，通常是逗号后面的主语：***Baking bread**, Grandpa hummed.* 这个短语告诉我们关于 Grandpa 的情况。\n\n> **注意。** 句首的 *-ing* 短语既可能作主语（直接接谓语，没有逗号：*Baking bread fills…*），也可能修饰名词（后面有逗号和真正主语：*Baking bread, Grandpa hummed*）。先看有没有逗号和另一个主语。",
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
    intro: t(
      "*The storm hit*, *The storm hit, and the power failed*, and *Because the storm hit, the power failed* carry the same facts with three different structures: **simple**, **compound**, and **complex**. Choosing the right structure lets you show whether two ideas are equal or whether one causes or limits the other.",
      "*The storm hit*、*The storm hit, and the power failed* 与 *Because the storm hit, the power failed* 说的是同一场风暴，却分别用了**简单句**、**并列句**和**复合句**三种结构。选对句型，才能准确表达两个想法是平等并列，还是存在因果、转折或时间关系。",
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
          "A **clause** has its own subject and verb. A **simple** sentence has one independent clause: *The bell rang.* A **compound** sentence joins two independent clauses as equals, with a comma and *and, but, or, so* or *yet*: *The bell rang, and the students left.* A **complex** sentence has an independent clause and a dependent one that begins with a word such as *because, although, when, after* or *while*: *When the bell rang, the students left.*\n\n> **Watch out.** A long sentence with two verbs sharing one subject (*Maya opened the gate and fed the dog*) is still a **simple** sentence—to be compound, *each* side of *and/but/so* must have its own subject and verb.",
          "**分句**有自己的主语和谓语。**简单句**只有一个独立分句：*The bell rang.* **并列句**用逗号加 *and, but, or, so, yet* 把两个独立分句平等地连起来：*The bell rang, and the students left.* **复合句**有一个独立分句和一个以 *because, although, when, after, while* 等词开头的从属分句：*When the bell rang, the students left.*\n\n> **注意。** 哪怕句子很长，只要两个动词共用同一个主语（如 *Maya opened the gate and fed the dog*），它依然是**简单句**——并列句要求连词两侧各自都有独立的主语和谓语。",
        ),
        choiceGenerator(
          t("What kind of sentence is this?", "这是哪种句子？"),
          sentenceKindBank,
          (right) =>
            t(
              `It is **${right}**: ${kindRule[right]?.[0] ?? ""}.\n\n**Check.** ${kindCheck[right]?.[0] ?? ""}`,
              `它是**${kindZh[right]}**（${right}）：${kindRule[right]?.[1] ?? ""}。\n\n**检验。** ${kindCheck[right]?.[1] ?? ""}`,
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
          "*And* only adds one idea to another. A complex sentence can say exactly how they relate: *because* or *since* for a cause, *although* for a surprising contrast, *when, after, as soon as, while* or *once* for time.\n\nWhen the dependent clause comes first, put a comma after it: *Because the road flooded, the bus was late.* When it comes second, no comma is needed: *The bus was late because the road flooded.*\n\n> **Watch out.** Match the exact logic asked for in the prompt—*although* signals an unexpected contrast, while *because* signals cause; swapping them flips the meaning.",
          "*and* 只是把一个观点加到另一个上。复合句能准确表达它们的关系：*because* 或 *since* 表示原因，*although* 表示出人意料的转折，*when, after, as soon as, while, once* 表示时间。\n\n从属分句在前时，后面加逗号：*Because the road flooded, the bus was late.* 从属分句在后时，不需要逗号：*The bus was late because the road flooded.*\n\n> **注意。** 核对题目要求的具体逻辑关系——*although* 表示出人意料的转折，*because* 表示原因，用混了会把句意彻底弄反。",
        ),
        choiceGenerator(
          t("Which sentence joins the ideas as asked?", "哪个句子按要求连接了这两个观点？"),
          relationBank,
          because(
            "Its subordinating conjunction states the exact relation asked for.",
            "它的从属连词准确表达了题目要求的关系。",
            "Read the subordinating conjunction (*because*, *although*, *when*, *after*, *while*) and verify it matches the requested link rather than merely listing both ideas with *and*.",
            "核对句中的从属连词（*because*、*although*、*when*、*after*、*while*），确认它表达的正是题干要求的逻辑关系，而不是用 *and* 笼统并列。",
          ),
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
    intro: t(
      "Writers use **dashes** to spotlight an aside (*The bridge—built in 1912—still carries trains*), **parentheses** to whisper one (*The bridge (built in 1912) still carries trains*), and an **ellipsis** (*...*) to mark words trimmed from a quotation. In this topic you pair dashes and parentheses accurately and shorten quotes without twisting their meaning.",
      "作者用**破折号**突出插入语（*The bridge—built in 1912—still carries trains*），用**括号**轻声补充旁白（*The bridge (built in 1912) still carries trains*），用**省略号**（*...*）标出引文删节处。本节练习成对使用破折号和括号，以及在不歪曲原意的前提下缩减引文。",
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
          "Like commas around an appositive, **dashes** and **parentheses** set off words that interrupt a sentence. Dashes make the interruption stand out: *My grandmother—who is eighty-two—still swims.* Parentheses make it quieter, an aside: *My grandmother (who is eighty-two) still swims.*\n\nBoth come in **pairs** around the interruption. Do not open with a dash and close with a comma, and do not leave a parenthesis unclosed. Take the interruption out, and the sentence must still read correctly.\n\n> **Watch out.** Never mix marks around the same interruption—a dash must close with a dash, and an opening parenthesis must close with a closing parenthesis.",
          "和同位语两边的逗号一样，**破折号**和**括号**用来隔开打断句子的词。破折号让插入的内容更醒目：*My grandmother—who is eighty-two—still swims.* 括号让它更低调，像一句旁白：*My grandmother (who is eighty-two) still swims.*\n\n两者都要**成对**地放在插入语两边。不要用破折号开头、用逗号结尾，也不要让括号缺一半。去掉插入语后，句子必须仍然通顺。\n\n> **注意。** 同一个插入语前后不能混用不同标点——破折号开头必须用破折号收尾，左括号必须配右括号。",
        ),
        choiceGenerator(
          t("Which sentence is punctuated as asked?", "哪个句子的标点符合要求？"),
          interruptionBank,
          because(
            "The marks come in a matching pair on both sides of the interruption, and the sentence still reads smoothly without it.",
            "标点在插入语两侧成对匹配，去掉插入语后句子依然完整通顺。",
            "Lift out the words between the dashes or parentheses: the outer sentence stays complete, and both ends use the exact same mark.",
            "拿掉破折号或括号里的内容再读外层句子：句子依然完整，且插入语两端标点完全成对。",
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
          'An **ellipsis** (*...*) marks words left out of a quotation. When you quote a source, you may shorten it, but you must show where you cut, and what remains must keep the writer\'s meaning: *The old bridge ... will close next month.*\n\nLeaving words out without an ellipsis puts words in a different order from the source, as if the writer had said them that way. An ellipsis can also show a pause or a voice trailing off in dialogue: *"I thought ... never mind."*\n\n> **Watch out.** Cut *only* the bracketed words and replace them with *...*—never silently stitch words together without an ellipsis, and never cut the main point of the quote.',
          '**省略号**（*...*）标出引文中省略的词。引用资料时可以缩短原文，但必须标出删去的地方，而且保留的部分要保持作者的原意：*The old bridge ... will close next month.*\n\n删去词语却不加省略号，会让引文看起来像作者原本就是这样说的。省略号也可以在对话中表示停顿或话没说完：*"I thought ... never mind."*\n\n> **注意。** 只删去方括号里的词并用 *...* 标出空缺——既不要不加省略号就把前后硬拼在一起，也不要删掉句子表达要点的主干。',
        ),
        choiceGenerator(
          t("Quote this sentence, leaving out the words in brackets.", "引用这个句子，省略方括号中的词。"),
          ellipsisBank,
          because(
            "It cuts only the bracketed words and marks the exact gap with an ellipsis.",
            "它只省略了方括号中的词，并用省略号准确标出了空缺。",
            "Compare the quote against the original sentence: every word outside the brackets is preserved verbatim, and *...* sits exactly where the bracketed words were removed.",
            "对照原句核对：方括号之外的词一字未改，且 *...* 正好落在删去方括号内容的位置。",
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
