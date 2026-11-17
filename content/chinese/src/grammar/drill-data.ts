// The drill topics of grades 3 to 6: connectives (关联词), changes of sentence form (把/被, rhetorical questions, reported
// speech) and rhetorical devices (修辞). Every sentence is written for the subject, apart from the classical couplets.

import { type Text, t } from "@ga/content";

import { type DrillItem, type DrillSpec, drillItem, lines } from "./drill.ts";

/** DrillData is a drill topic without its prerequisites, and its grade. */
export type DrillData = Omit<DrillSpec, "prerequisites"> & { readonly grade: number };

const GAP = "＿＿";

/** fill puts the parts of a pair of connectives, as 因为……所以……, into the gaps of a sentence. */
function fill(sentence: string, pair: string): string {
  const parts = pair.split("……").filter((p) => p !== "");
  let n = 0;
  const filled = sentence.replace(/＿＿/gu, () => parts[n++] ?? "");
  if (n !== parts.length) throw new Error(`connectives: ${pair} does not fit ${sentence}`);
  return filled;
}

/** others are the three answers of a list other than one. */
const others = (all: readonly string[], one: string): [string, string, string] => {
  const rest = all.filter((a) => a !== one);
  if (rest.length !== 3) throw new Error(`grammar drill: ${one} among ${all.join("、")}`);
  return rest as [string, string, string];
};

// Connectives, grade 3: four relations between two clauses.

const RELATIONS: Readonly<Record<string, string>> = {
  "因为……所以……": "因果关系",
  "虽然……但是……": "转折关系",
  "如果……就……": "假设关系",
  "不但……而且……": "递进关系",
};
const PAIRS = Object.keys(RELATIONS);
const RELATION_NAMES = Object.values(RELATIONS);

const firstConnectives = lines(
  `
＿＿今天下大雨，＿＿运动会推迟了。 | 因为……所以……
＿＿小明每天坚持锻炼，＿＿他的身体越来越好。 | 因为……所以……
＿＿路上堵车，＿＿我们迟到了。 | 因为……所以……
＿＿外面很冷，＿＿同学们还是坚持跑步。 | 虽然……但是……
＿＿这道题很难，＿＿小红还是做出来了。 | 虽然……但是……
＿＿弟弟年纪小，＿＿他懂得很多道理。 | 虽然……但是……
＿＿明天天气晴朗，我们＿＿去公园放风筝。 | 如果……就……
＿＿你有不懂的地方，你＿＿举手问老师。 | 如果……就……
＿＿大家都节约用水，水资源＿＿能得到保护。 | 如果……就……
这种水果＿＿好看，＿＿好吃。 | 不但……而且……
妹妹＿＿会唱歌，＿＿会跳舞。 | 不但……而且……
他＿＿自己认真学习，＿＿经常帮助同学。 | 不但……而且……
`,
  2,
).map(([sentence, pair]) => ({ sentence: sentence!, pair: pair! }));

const connectiveList = PAIRS.map((p) => `- ${p}：${RELATIONS[p]}`).join("\n");

const connectivesOne: DrillData = {
  grade: 3,
  id: "connectives-1",
  title: t("Connectives: Because, Although, If, Not Only", "关联词：因为、虽然、如果、不但"),
  summary: t(
    "Joining two clauses with the connective their relation needs: cause, contrast, condition or addition.",
    "根据两个分句之间的关系选用关联词：因果、转折、假设、递进。",
  ),
  points: [
    {
      suffix: "choosing",
      title: t("Choosing the Connectives", "选用关联词"),
      explanation: t(
        "Connectives come in pairs and show how two clauses are related. 因为……所以…… gives a cause and its result; 虽然……但是…… says the second clause goes against what the first leads us to expect; 如果……就…… gives a condition and what follows from it; 不但……而且…… adds something more to the first clause. Read both clauses, decide how they are related, then choose the pair.",
        `关联词常常成对使用，表示两个分句之间的关系。先读懂两个分句，想一想它们是什么关系，再选关联词。\n\n${connectiveList}\n\n“因为……所以……”前面是原因，后面是结果；“虽然……但是……”后面说的和前面让人想到的相反；“如果……就……”前面是假设的条件，后面是结果；“不但……而且……”后面比前面更进一层。`,
      ),
      question: t("Which connectives fit the gaps?", "横线处应该填哪组关联词？"),
      items: firstConnectives.map(({ sentence, pair }) => drillItem(sentence, pair, others(PAIRS, pair))),
      why: (right, shown) =>
        t(
          `The clauses are related as ${right} says: ${fill(shown, right)}`,
          `两个分句是${RELATIONS[right]}，用“${right}”：${fill(shown, right)}`,
        ),
    },
    {
      suffix: "relations",
      title: t("Naming the Relation", "判断关系"),
      explanation: t(
        "The connectives of a sentence tell how its clauses are related: 因为……所以…… cause and result, 虽然……但是…… contrast, 如果……就…… condition, 不但……而且…… addition.",
        `句子里的关联词告诉我们分句之间是什么关系。\n\n${connectiveList}`,
      ),
      question: t("How are the clauses of this sentence related?", "这个句子的分句之间是什么关系？"),
      items: firstConnectives.map(({ sentence, pair }) =>
        drillItem(fill(sentence, pair), RELATIONS[pair]!, others(RELATION_NAMES, RELATIONS[pair]!)),
      ),
      why: (right, shown) => {
        const pair = PAIRS.find((p) => RELATIONS[p] === right) ?? "";
        return t(`${shown} uses ${pair}, which shows ${right}.`, `“${shown}”用了“${pair}”，表示${right}。`);
      },
    },
  ],
};

// Connectives, grade 4: the conditions of 只要 and 只有, and 即使, 无论 and 既然.

const SECOND: Readonly<Record<string, string>> = { 即使: "也", 只要: "就", 只有: "才", 无论: "都", 既然: "就" };

const secondConnectives = lines(
  `
＿＿明天下大雨，比赛也会照常进行。 | 即使 | 只要 | 只有 | 既然
＿＿你认真练习，就一定能学会游泳。 | 只要 | 即使 | 无论 | 只有
＿＿多读书，才能写出好文章。 | 只有 | 只要 | 即使 | 既然
＿＿遇到什么困难，他都不放弃。 | 无论 | 只要 | 只有 | 既然
＿＿你已经答应了别人，就要说到做到。 | 既然 | 即使 | 无论 | 只有
＿＿天气再冷，爷爷也坚持早起锻炼。 | 即使 | 只要 | 只有 | 既然
＿＿按时浇水，花儿就会开得很好。 | 只要 | 只有 | 即使 | 无论
＿＿把种子种下去，春天才会长出小苗。 | 只有 | 只要 | 即使 | 既然
＿＿是晴天还是雨天，他都步行上学。 | 无论 | 即使 | 只要 | 只有
＿＿大家都同意了，我们就这样办吧。 | 既然 | 即使 | 只有 | 无论
＿＿失败了很多次，他也没有灰心。 | 即使 | 只要 | 既然 | 无论
＿＿认真听讲，才能真正弄懂这道题。 | 只有 | 只要 | 即使 | 无论
`,
  5,
);

const secondList = Object.entries(SECOND)
  .map(([a, b]) => `- ${a}……${b}……`)
  .join("\n");
const secondExplanation = t(
  "The first connective of a pair must match the second. 只要……就…… gives a condition that is enough; 只有……才…… gives the only condition that works; 即使……也…… says the result holds even then; 无论……都…… says it holds whatever happens; 既然……就…… starts from what is already true.",
  `一对关联词前后要搭配。\n\n${secondList}\n\n“只要……就……”表示有了这个条件就够了；“只有……才……”表示必须有这个条件，缺了不行；“即使……也……”表示就算这样，结果也不变；“无论……都……”表示不管什么情况，结果都一样；“既然……就……”先说已经成为事实的情况，再说由此得出的结论。`,
);

const connectivesTwo: DrillData = {
  grade: 4,
  id: "connectives-2",
  title: t("Connectives: Only If, As Long As, Even If, Whatever, Since", "关联词：只要、只有、即使、无论、既然"),
  summary: t(
    "Choosing the first connective that matches the second, and telling sentences that pair them rightly.",
    "根据后面的关联词选用前面的关联词，判断关联词搭配是否正确。",
  ),
  points: [
    {
      suffix: "choosing",
      title: t("Matching the Pair", "关联词搭配"),
      explanation: secondExplanation,
      question: t("Which connective goes in the gap?", "横线处应该填哪个关联词？"),
      items: secondConnectives.map(([s, r, a, b, c]) => drillItem(s!, r!, [a!, b!, c!])),
      why: (right, shown) =>
        t(
          `${right} pairs with ${SECOND[right]}: ${shown.replace(GAP, right)}`,
          `“${right}”和“${SECOND[right]}”搭配：${shown.replace(GAP, right)}`,
        ),
    },
    {
      suffix: "checking",
      title: t("Checking the Pair", "检查关联词"),
      explanation: secondExplanation,
      question: t("Which sentence uses its connectives correctly?", "哪个句子的关联词用得正确？"),
      items: secondConnectives.map(([s, r, a, b, c]) =>
        drillItem("", s!.replace(GAP, r!), [s!.replace(GAP, a!), s!.replace(GAP, b!), s!.replace(GAP, c!)]),
      ),
      why: () => t("Its two connectives belong together and fit what it says.", "这个句子前后的关联词搭配得当，也符合句子的意思。"),
    },
  ],
};

// 把 and 被, grade 4: the same event told from the doer or from what it happens to.

const baBei = lines(
  `
弟弟 | 花瓶 | 打碎了
大风 | 小树 | 吹倒了
妈妈 | 衣服 | 晾在阳台上了
小猫 | 毛线球 | 弄乱了
雨水 | 我的鞋子 | 打湿了
哥哥 | 那本书 | 借走了
太阳 | 雪人 | 晒化了
小狗 | 拖鞋 | 叼走了
老师 | 我的作文 | 贴在了墙上
警察 | 小偷 | 抓住了
爷爷 | 小船 | 修好了
同学们 | 教室 | 打扫得干干净净
`,
  3,
).map(([a, b, vp]) => ({ a: a!, b: b!, vp: vp! }));

const ba = ({ a, b, vp }: { a: string; b: string; vp: string }): string => `${a}把${b}${vp}。`;
const bei = ({ a, b, vp }: { a: string; b: string; vp: string }): string => `${b}被${a}${vp}。`;

const baBeiExplanation = t(
  "A 把 sentence starts from who does something: 弟弟把花瓶打碎了. A 被 sentence starts from what it is done to: 花瓶被弟弟打碎了. To change one into the other, swap the doer and what it is done to, and change 把 into 被 or 被 into 把; what happens stays the same.",
  "“把”字句从做事的人说起：弟弟把花瓶打碎了。“被”字句从被处置的事物说起：花瓶被弟弟打碎了。\n\n两种句子互相改写时，把做事的人和被处置的事物换个位置，“把”换成“被”或者“被”换成“把”，意思不能变。",
);

const sentencesBaBei: DrillData = {
  grade: 4,
  id: "sentences-ba-and-bei",
  title: t("把 and 被 Sentences", "“把”字句和“被”字句"),
  summary: t(
    "Changing a 把 sentence into a 被 sentence and back without changing what it says.",
    "把“把”字句和“被”字句互相改写，意思不变。",
  ),
  points: [
    {
      suffix: "to-bei",
      title: t("From 把 to 被", "“把”字句改为“被”字句"),
      explanation: baBeiExplanation,
      question: t("Which is the sentence as a 被 sentence?", "把这个句子改成“被”字句，哪个是对的？"),
      items: baBei.map((s) => drillItem(ba(s), bei(s), [`${s.a}被${s.b}${s.vp}。`, `被${s.a}${s.b}${s.vp}。`, `${s.b}把${s.a}${s.vp}。`])),
      why: (right) =>
        t(`What it is done to comes first, then 被 and the doer: ${right}`, `被处置的事物放在前面，后面是“被”和做事的人：${right}`),
    },
    {
      suffix: "to-ba",
      title: t("From 被 to 把", "“被”字句改为“把”字句"),
      explanation: baBeiExplanation,
      question: t("Which is the sentence as a 把 sentence?", "把这个句子改成“把”字句，哪个是对的？"),
      items: baBei.map((s) => drillItem(bei(s), ba(s), [`${s.b}把${s.a}${s.vp}。`, `把${s.a}${s.b}${s.vp}。`, `${s.a}被${s.b}${s.vp}。`])),
      why: (right) =>
        t(`The doer comes first, then 把 and what it is done to: ${right}`, `做事的人放在前面，后面是“把”和被处置的事物：${right}`),
    },
  ],
};

// Rhetorical questions, grade 5.

const rhetorical = lines(
  `
我们怎么能浪费粮食呢？ | 我们不能浪费粮食。 | 我们能浪费粮食。 | 我们能不能浪费粮食？ | 我们怎么不能浪费粮食呢？
难道你不知道明天要考试吗？ | 你知道明天要考试。 | 你不知道明天要考试。 | 你知道明天要考试吗？ | 难道你知道明天要考试吗？
这么美的景色，谁不喜欢呢？ | 这么美的景色，人人都喜欢。 | 这么美的景色，没有人喜欢。 | 这么美的景色，你喜欢吗？ | 这么美的景色，谁喜欢呢？
难道我们不应该爱护环境吗？ | 我们应该爱护环境。 | 我们不应该爱护环境。 | 我们应该爱护环境吗？ | 难道我们应该爱护环境吗？
他是我们的好朋友，我们怎么能不帮助他呢？ | 他是我们的好朋友，我们应该帮助他。 | 他是我们的好朋友，我们不用帮助他。 | 他是我们的好朋友，我们要不要帮助他？ | 他是我们的好朋友，我们怎么能帮助他呢？
这点小事，难道还难得倒我吗？ | 这点小事，难不倒我。 | 这点小事，难得倒我。 | 这点小事，难得倒你吗？ | 这点小事，难道还难不倒我吗？
时间一去不复返，我们怎么能不珍惜呢？ | 时间一去不复返，我们一定要珍惜。 | 时间一去不复返，我们不用珍惜。 | 时间一去不复返，你珍惜时间吗？ | 时间一去不复返，我们怎么能珍惜呢？
难道这不是一个好办法吗？ | 这是一个好办法。 | 这不是一个好办法。 | 这是一个好办法吗？ | 难道这是一个好办法吗？
大家都在认真读书，你怎么好意思大声说话呢？ | 大家都在认真读书，你不应该大声说话。 | 大家都在认真读书，你可以大声说话。 | 大家都在认真读书，你在大声说话吗？ | 大家都在认真读书，你怎么好意思不大声说话呢？
小草都知道向上生长，我们难道不应该努力吗？ | 小草都知道向上生长，我们应该努力。 | 小草都知道向上生长，我们不应该努力。 | 小草都知道向上生长，我们应该努力吗？ | 小草都知道向上生长，我们难道应该努力吗？
这么重的箱子，一个小孩怎么搬得动呢？ | 这么重的箱子，一个小孩搬不动。 | 这么重的箱子，一个小孩搬得动。 | 这个箱子有多重？ | 这么重的箱子，一个小孩怎么搬不动呢？
我们是集体的一员，难道不应该为集体出力吗？ | 我们是集体的一员，应该为集体出力。 | 我们是集体的一员，不应该为集体出力。 | 我们是集体的一员吗？ | 我们是集体的一员，难道应该为集体出力吗？
`,
  5,
).map(([q, statement, opposite, plain, reversed]) => ({
  q: q!,
  statement: statement!,
  opposite: opposite!,
  plain: plain!,
  reversed: reversed!,
}));

const rhetoricalExplanation = t(
  "A rhetorical question asks nothing: it states its answer more forcefully, and the answer is the opposite of its form. 我们怎么能浪费粮食呢？ means 我们不能浪费粮食; 难道你不知道吗？ means 你知道. To change it into a statement, take away the question words (怎么, 难道, 呢, 吗), turn 能 into 不能 or 不 into nothing, and end with a full stop. To make a rhetorical question, do the reverse; the meaning must not change.",
  "反问句不需要回答，它用问的形式表达确定的意思，语气更强烈。肯定形式的反问句表达否定的意思，否定形式的反问句表达肯定的意思：“我们怎么能浪费粮食呢？”意思是“我们不能浪费粮食”；“难道你不知道吗？”意思是“你知道”。\n\n反问句改陈述句：去掉“怎么”“难道”“呢”“吗”等词，肯定改否定、否定改肯定，问号改成句号。陈述句改反问句正好相反。改写后意思不能变。",
);

const sentencesRhetorical: DrillData = {
  grade: 5,
  id: "sentences-rhetorical-questions",
  title: t("Rhetorical Questions and Statements", "反问句和陈述句"),
  summary: t(
    "Changing a rhetorical question into a statement and a statement into a rhetorical question.",
    "反问句和陈述句互相改写，意思不变。",
  ),
  points: [
    {
      suffix: "to-statement",
      title: t("From a Rhetorical Question", "反问句改为陈述句"),
      explanation: rhetoricalExplanation,
      question: t("Which statement says what the rhetorical question means?", "把这个反问句改成陈述句，哪个是对的？"),
      items: rhetorical.map((r) => drillItem(r.q, r.statement, [r.opposite, r.plain, r.reversed])),
      why: (right) => t(`The question means: ${right}`, `这个反问句的意思是：${right}`),
    },
    {
      suffix: "to-question",
      title: t("Into a Rhetorical Question", "陈述句改为反问句"),
      explanation: rhetoricalExplanation,
      question: t("Which rhetorical question says the same as the statement?", "把这个陈述句改成反问句，哪个是对的？"),
      items: rhetorical.map((r) => drillItem(r.statement, r.q, [r.plain, r.reversed, r.opposite])),
      why: (right) => t(`The rhetorical question keeps the meaning: ${right}`, `改成反问句，意思不变：${right}`),
    },
  ],
};

// Reported speech, grade 5.

const reported = lines(
  `
小明对老师说 | 我明天要去看奶奶。 | 他明天要去看奶奶 | 你明天要去看奶奶 | 他明天不去看奶奶
妈妈对我说 | 你要按时完成作业。 | 我要按时完成作业 | 她要按时完成作业 | 我不用按时完成作业
小红对妈妈说 | 我想学弹钢琴。 | 她想学弹钢琴 | 你想学弹钢琴 | 她不想学弹钢琴
爸爸对我说 | 我周末带你去动物园。 | 他周末带我去动物园 | 他周末带你去动物园 | 他周末不带我去动物园
姐姐对我说 | 我在门口等你。 | 她在门口等我 | 我在门口等她 | 她不在门口等我
哥哥对我说 | 我把你的书放在桌子上了。 | 他把我的书放在桌子上了 | 我把他的书放在桌子上了 | 他没有把我的书放在桌子上
奶奶对我说 | 你小时候最爱吃饺子。 | 我小时候最爱吃饺子 | 她小时候最爱吃饺子 | 我小时候最不爱吃饺子
小刚对我说 | 我今天不能和你一起回家了。 | 他今天不能和我一起回家了 | 我今天不能和他一起回家了 | 他今天能和我一起回家
小丽对王老师说 | 我的作业忘在家里了。 | 她的作业忘在家里了 | 您的作业忘在家里了 | 她的作业没有忘在家里
叔叔对我说 | 你长高了不少。 | 我长高了不少 | 他长高了不少 | 我一点也没长高
李奶奶对我们说 | 我很喜欢你们送的花。 | 她很喜欢我们送的花 | 我很喜欢她送的花 | 她不喜欢我们送的花
同桌对我说 | 我可以借你一支铅笔。 | 他可以借我一支铅笔 | 我可以借他一支铅笔 | 他不能借我铅笔
`,
  5,
).map(([s, q, i, w, o]) => ({ s: s!, q: q!, i: i!, w: w!, o: o! }));

const reportedExplanation = t(
  "Direct speech gives someone's words as they said them, after a colon and in quotation marks: 小明对老师说：“我明天要去看奶奶。” Reported speech tells what they said in the narrator's words, after a comma and without quotation marks: 小明对老师说，他明天要去看奶奶。 The persons change with it: the speaker's 我 becomes 他 or 她, and 你, the one spoken to, becomes whoever that is for the narrator, often 我.",
  "直接引用别人的原话叫直述句，说话的人后面用冒号和引号：小明对老师说：“我明天要去看奶奶。”用转述的人的口气说出别人的话叫转述句，用逗号，不用引号：小明对老师说，他明天要去看奶奶。\n\n改写时人称要跟着变：说话人自称的“我”要改成“他”或“她”；说话人称对方的“你”，要改成对转述人来说是谁，常常是“我”。意思不能变。",
);

const sentencesReported: DrillData = {
  grade: 5,
  id: "sentences-reported-speech",
  title: t("Direct and Reported Speech", "直述句和转述句"),
  summary: t(
    "Changing direct speech into reported speech and back, with the persons that change.",
    "直述句和转述句互相改写，注意人称的变化。",
  ),
  points: [
    {
      suffix: "to-reported",
      title: t("Reporting What Was Said", "直述句改为转述句"),
      explanation: reportedExplanation,
      question: t("Which sentence reports what was said?", "把这句话改成转述句，哪个是对的？"),
      items: reported.map((r) =>
        drillItem(`${r.s}：“${r.q}”`, `${r.s}，${r.i}。`, [`${r.s}，${r.q}`, `${r.s}，${r.w}。`, `${r.s}，${r.o}。`]),
      ),
      why: (right) => t(`The persons change to the narrator's: ${right}`, `人称换成转述人的说法：${right}`),
    },
    {
      suffix: "to-direct",
      title: t("Giving the Words Spoken", "转述句改为直述句"),
      explanation: reportedExplanation,
      question: t("Which sentence gives the words as they were spoken?", "把这句话改成直述句，哪个是对的？"),
      items: reported.map((r) =>
        drillItem(`${r.s}，${r.i}。`, `${r.s}：“${r.q}”`, [`${r.s}：“${r.i}。”`, `${r.s}：“${r.w}。”`, `${r.s}：“${r.o}。”`]),
      ),
      why: (right) => t(`The speaker's own words, with the speaker's persons: ${right}`, `用说话人自己的口气说：${right}`),
    },
  ],
};

// Rhetorical devices.

/** Device is a rhetorical device: its name and how it is recognized. */
interface Device {
  readonly name: string;
  readonly en: string;
  readonly mark: Text;
}

/** deviceTopic builds a rhetoric topic from four devices and four sentences of each. */
function deviceTopic(
  grade: number,
  id: string,
  title: Text,
  devices: readonly Device[],
  sentences: Readonly<Record<string, readonly string[]>>,
): DrillData {
  const names = devices.map((d) => d.name);
  const of = new Map(devices.flatMap((d) => (sentences[d.name] ?? []).map((s) => [s, d] as const)));
  const all = [...of.keys()];
  const list = devices.map((d) => `- **${d.name}**：${d.mark["zh-CN"]}`).join("\n");
  const listEn = devices.map((d) => `- **${d.name}** (${d.en}): ${d.mark.en}`).join("\n");
  const explanation = t(`Each device works in its own way:\n\n${listEn}`, `每种修辞手法都有自己的特点：\n\n${list}`);
  const named: DrillItem[] = all.map((s) => drillItem(s, of.get(s)!.name, others(names, of.get(s)!.name)));
  const found: DrillItem[] = all.map((s, i) => {
    const d = of.get(s)!;
    const rest = all.filter((o) => of.get(o) !== d);
    return drillItem(d.name, s, [rest[i % rest.length]!, rest[(i + 5) % rest.length]!, rest[(i + 9) % rest.length]!]);
  });
  const nameOf = (s: string): string => of.get(s)?.name ?? "";
  return {
    grade,
    id,
    title,
    summary: t(`Recognizing ${devices.map((d) => d.en).join(", ")}.`, `辨认${names.join("、")}等修辞手法。`),
    points: [
      {
        suffix: "naming",
        title: t("Naming the Device", "判断修辞手法"),
        explanation,
        question: t("Which rhetorical device does this sentence use?", "这个句子用了什么修辞手法？"),
        items: named,
        why: (right) => {
          const d = devices.find((x) => x.name === right);
          return t(`It uses ${right}: ${d?.mark.en ?? ""}.`, `这个句子用了${right}：${d?.mark["zh-CN"] ?? ""}。`);
        },
      },
      {
        suffix: "finding",
        title: t("Finding the Device", "找出修辞手法"),
        explanation,
        question: t("Which sentence uses this rhetorical device?", "哪个句子用了这种修辞手法？"),
        items: found,
        why: (right) => t(`${right} uses ${nameOf(right)}.`, `“${right}”用了${nameOf(right)}。`),
      },
    ],
  };
}

const rhetoricOne = deviceTopic(
  5,
  "rhetoric-1",
  t("Rhetoric: Simile, Personification, Hyperbole, Parallelism", "修辞：比喻、拟人、夸张、排比"),
  [
    {
      name: "比喻",
      en: "simile and metaphor",
      mark: t(
        "likens one thing to another of a different kind, often with 像, 好像 or 是",
        "用另一种不同的事物来比方这种事物，常用“像”“好像”“是”等词",
      ),
    },
    {
      name: "拟人",
      en: "personification",
      mark: t("lets a thing act, think or feel as a person does", "把事物当作人来写，让它像人一样做事、说话、有感情"),
    },
    {
      name: "夸张",
      en: "hyperbole",
      mark: t("makes something far bigger, smaller, more or less than it is", "故意把事物说得比实际大得多、小得多，或者多得多、少得多"),
    },
    {
      name: "排比",
      en: "parallelism",
      mark: t("puts three or more phrases of the same form and tone in a row", "把三个或三个以上结构相同、语气一致的句子或词组排在一起"),
    },
  ],
  {
    比喻: [
      "弯弯的月亮像一只小船，挂在天空中。",
      "秋天的田野是一片金色的海洋。",
      "荷叶圆圆的，像一把把绿色的小伞。",
      "老师就像辛勤的园丁，培育着我们这些小苗。",
    ],
    拟人: [
      "小草从泥土里探出头来，好奇地打量着这个世界。",
      "春风轻轻地抚摸着我的脸。",
      "小溪一路唱着歌，向远方流去。",
      "太阳公公露出了笑脸，向大家问好。",
    ],
    夸张: ["他的嗓门大得能把房顶掀翻。", "教室里静得连一根针掉在地上都能听见。", "弟弟饿得能吃下一头牛。", "天气热得能在路面上煎鸡蛋。"],
    排比: [
      "我爱家乡的山，我爱家乡的水，我爱家乡的一草一木。",
      "读书能使人增长知识，读书能使人开阔眼界，读书能使人明白道理。",
      "我们要爱护花草，爱护树木，爱护身边的一切生命。",
      "他是那样勇敢，那样坚强，那样乐观。",
    ],
  },
);

const rhetoricTwo = deviceTopic(
  6,
  "rhetoric-2",
  t("Rhetoric: Antithesis, Hypophora, Rhetorical Question, Repetition", "修辞：对偶、设问、反问、反复"),
  [
    {
      name: "对偶",
      en: "antithesis",
      mark: t(
        "sets two lines of the same length and form side by side, word against word",
        "两个字数相等、结构相同的句子或词组成对排列，意思相关",
      ),
    },
    { name: "设问", en: "hypophora", mark: t("asks a question and answers it straight away", "自问自答，先提出问题，接着自己回答") },
    {
      name: "反问",
      en: "rhetorical question",
      mark: t("asks a question that needs no answer, because its answer is plain", "用问的形式表达确定的意思，答案就在问句里，不需要回答"),
    },
    { name: "反复", en: "repetition", mark: t("says the same word or sentence again to stress it", "为了强调，有意重复某个词语或句子") },
  ],
  {
    对偶: ["白日依山尽，黄河入海流。", "两个黄鹂鸣翠柳，一行白鹭上青天。", "少壮不努力，老大徒伤悲。", "明月松间照，清泉石上流。"],
    设问: [
      "什么是幸福？幸福就是和家人在一起的每一天。",
      "春天在哪里？春天在田野里，在小河边。",
      "为什么树叶到了秋天会变黄？因为天气变冷，叶子里的叶绿素减少了。",
      "我们为什么要读书？读书能让我们懂得更多道理。",
    ],
    反问: [
      "这么好的机会，我们怎么能错过呢？",
      "难道你忘记了自己说过的话吗？",
      "一个人不努力，怎么能取得好成绩呢？",
      "大家都这么帮我，我难道不应该好好学习吗？",
    ],
    反复: [
      "等啊等，等啊等，妈妈终于回来了。",
      "我们要坚持，坚持，再坚持！",
      "回来吧，小燕子！回来吧，小燕子！",
      "雨下着，下着，一整天都没有停。",
    ],
  },
);

/** drillData are the drill topics, by kind, each kind in order. */
export const drillData: Readonly<Record<"connectives" | "sentences" | "rhetoric", readonly DrillData[]>> = {
  connectives: [connectivesOne, connectivesTwo],
  sentences: [sentencesBaBei, sentencesRhetorical, sentencesReported],
  rhetoric: [rhetoricOne, rhetoricTwo],
};
