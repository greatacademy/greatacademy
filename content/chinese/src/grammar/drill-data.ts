// The drill topics of grades 3 to 10: connectives (关联词), changes of sentence form (把/被, rhetorical questions, reported
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

/** about puts the option a reason is about before it, so that a list of reasons says which option each is about. */
const about = (option: string, reason: Text): Text => {
  const bare = option.replace(/。$/u, "");
  return t(`${bare}: ${reason.en}`, `“${bare.replaceAll("“", "‘").replaceAll("”", "’")}”：${reason["zh-CN"]}`);
};

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

/** RELATION_SAYS says what each pair of connectives shows of its clauses. */
const RELATION_SAYS: Readonly<Record<string, Text>> = {
  "因为……所以……": t(
    "cause and result: the first clause gives a cause, the second its result",
    "因果关系：前一个分句说原因，后一个分句说结果",
  ),
  "虽然……但是……": t(
    "contrast: the second clause goes against what the first leads us to expect",
    "转折关系：后一个分句说的和前一个分句让人想到的相反",
  ),
  "如果……就……": t(
    "condition: the first clause is only supposed, and the second says what then follows",
    "假设关系：前一个分句是假设的情况，后一个分句说假如这样会怎样",
  ),
  "不但……而且……": t("addition: the second clause goes a step further than the first", "递进关系：后一个分句比前一个分句更进一层"),
};

/** RELATION_TEST is how each relation is checked without its connectives. */
const RELATION_TEST: Readonly<Record<string, Text>> = {
  "因为……所以……": t("Ask why of the second clause: the first clause answers it.", "对后一个分句问一问“为什么”，前一个分句正好回答。"),
  "虽然……但是……": t(
    "Put only 可是 between the clauses: the sentence still reads well, since the second goes against the first.",
    "只在两个分句之间加上“可是”，句子仍然通顺，因为后一句和前一句相反。",
  ),
  "如果……就……": t(
    "Ask whether the first clause has happened: it has not, it is supposed.",
    "问一问前一个分句说的事发生了没有：还没有发生，只是假设。",
  ),
  "不但……而且……": t(
    "Both clauses are true together, and the second says more than the first: swap them and the step up is lost.",
    "两个分句说的都是实情，后一句比前一句说得更进一层：调换位置，就没有这一层递进了。",
  ),
};

/** pairOf is the pair of connectives that shows a relation. */
const pairOf = (relation: string): string => PAIRS.find((p) => RELATIONS[p] === relation) ?? "";

const firstConnectives = lines(
  `
＿＿今天下大雨，＿＿运动会推迟了。 | 因为……所以…… | 下大雨是运动会推迟的原因 | the heavy rain is why the sports day is put off
＿＿小明每天坚持锻炼，＿＿他的身体越来越好。 | 因为……所以…… | 每天坚持锻炼是身体越来越好的原因 | exercising every day is why he grows healthier
＿＿路上堵车，＿＿我们迟到了。 | 因为……所以…… | 路上堵车是我们迟到的原因 | the traffic jam is why we are late
＿＿外面很冷，＿＿同学们还是坚持跑步。 | 虽然……但是…… | 天冷会让人不想跑步，同学们却坚持跑步 | the cold would keep one from running, yet the pupils run
＿＿这道题很难，＿＿小红还是做出来了。 | 虽然……但是…… | 题很难，让人以为做不出来，小红却做出来了 | a hard question seems too hard to solve, yet 小红 solves it
＿＿弟弟年纪小，＿＿他懂得很多道理。 | 虽然……但是…… | 年纪小，让人以为懂得少，他却懂得很多道理 | one so young seems to know little, yet he knows a great deal
＿＿明天天气晴朗，我们＿＿去公园放风筝。 | 如果……就…… | 明天的天气还不知道，晴朗只是假设，去放风筝要看这个条件 | tomorrow's fine weather is only supposed, and the kite flying waits on it
＿＿你有不懂的地方，你＿＿举手问老师。 | 如果……就…… | 有不懂的地方是假设的情况，举手问老师是那时该做的事 | not understanding something is only supposed, and asking is what to do then
＿＿大家都节约用水，水资源＿＿能得到保护。 | 如果……就…… | 大家都节约用水是假设的条件，水资源得到保护是由此而来的结果 | everyone saving water is only supposed, and the water being protected would follow
这种水果＿＿好看，＿＿好吃。 | 不但……而且…… | “好吃”在“好看”之外又进了一层 | being tasty goes a step beyond being good to look at
妹妹＿＿会唱歌，＿＿会跳舞。 | 不但……而且…… | “会跳舞”在“会唱歌”之外又进了一层 | dancing goes a step beyond singing
他＿＿自己认真学习，＿＿经常帮助同学。 | 不但……而且…… | 帮助同学比自己认真学习更进一层 | helping others goes a step beyond studying hard himself
`,
  4,
).map(([sentence, pair, zh, en]) => ({ sentence: sentence!, pair: pair!, clue: t(en!, zh!) }));

/** clueOf is how the clauses of a connectives sentence are related, by the sentence with its gaps or filled. */
const clueOf = new Map(firstConnectives.flatMap((c) => [[c.sentence, c.clue] as const, [fill(c.sentence, c.pair), c.clue] as const]));
const clue = (sentence: string): Text => clueOf.get(sentence) ?? t("", "");

const connectiveList = PAIRS.map((p) => `- ${p}：${RELATIONS[p]}`).join("\n");
const connectiveListEn = PAIRS.map((p) => `- ${p}: ${RELATION_SAYS[p]!.en}`).join("\n");

const connectivesOne: DrillData = {
  grade: 3,
  id: "connectives-1",
  title: t("Connectives: Because, Although, If, Not Only", "关联词：因为、虽然、如果、不但"),
  summary: t(
    "Joining two clauses with the connective their relation needs: cause, contrast, condition or addition.",
    "根据两个分句之间的关系选用关联词：因果、转折、假设、递进。",
  ),
  intro: t(
    "Read 今天下大雨，运动会推迟了。 Why is the sports day put off? Because of the rain: the first clause gives a cause and the second its result. A pair of connectives shows that: 因为今天下大雨，所以运动会推迟了。 Other clauses are related otherwise, and each relation has its own pair.\n\nThe first knowledge point chooses the pair for two clauses; the second names the relation that a pair shows.",
    "读一读：今天下大雨，运动会推迟了。运动会为什么推迟？因为下大雨。前一个分句说原因，后一个分句说结果。用一对关联词就能把这层关系说明白：因为今天下大雨，所以运动会推迟了。分句之间还有别的关系，每种关系都有自己的关联词。\n\n第一个知识点为两个分句选用关联词，第二个根据关联词判断分句之间的关系。",
  ),
  points: [
    {
      suffix: "choosing",
      title: t("Choosing the Connectives", "选用关联词"),
      explanation: t(
        `Connectives come in pairs and show how two clauses are related. Read both clauses, decide how they are related, then choose the pair.\n\n${connectiveListEn}\n\nFor example, ＿＿外面很冷，＿＿同学们还是坚持跑步。 The cold would keep one from running, yet the pupils run: the second clause goes against the first, so the pair is 虽然……但是……: 虽然外面很冷，但是同学们还是坚持跑步。\n\n> **Watch out.** 因为, 虽然 and 如果 all open the first clause, so do not choose from the first clause alone. Read on: only the second clause shows whether it follows from the first, goes against it, or waits on it.`,
        `关联词常常成对使用，表示两个分句之间的关系。先读懂两个分句，想一想它们是什么关系，再选关联词。\n\n${connectiveList}\n\n“因为……所以……”前面是原因，后面是结果；“虽然……但是……”后面说的和前面让人想到的相反；“如果……就……”前面是假设的条件，后面是结果；“不但……而且……”后面比前面更进一层。\n\n例如：＿＿外面很冷，＿＿同学们还是坚持跑步。天冷会让人不想跑步，同学们却坚持跑步，后一句和前一句相反，是转折关系，所以用“虽然……但是……”：虽然外面很冷，但是同学们还是坚持跑步。\n\n> **注意。** “因为”“虽然”“如果”都放在前一个分句里，所以不能只看前一句就选。要读完后一句：只有后一句才能说明它是前一句的结果，还是和前一句相反，还是要看前一句的条件。`,
      ),
      question: t("Which connectives fit the gaps?", "横线处应该填哪组关联词？"),
      items: firstConnectives.map(({ sentence, pair }) => drillItem(sentence, pair, others(PAIRS, pair))),
      why: (right, shown) => {
        const c = clue(shown);
        return t(
          `**Step 1: read both clauses.** Here ${c.en}.\n\n**Step 2: name the relation and its pair.** That is ${RELATION_SAYS[right]!.en}, so the pair is ${right}: ${fill(shown, right)}\n\n**Check.** ${RELATION_TEST[right]!.en}`,
          `**第一步：读懂两个分句。**${c["zh-CN"]}。\n\n**第二步：判断关系，选出关联词。**这是${RELATION_SAYS[right]!["zh-CN"]}，所以用“${right}”：${fill(shown, right)}\n\n**检验。** ${RELATION_TEST[right]!["zh-CN"]}`,
        );
      },
      whyNot: (wrong, _right, shown) => {
        const c = clue(shown);
        return t(
          `${wrong} shows ${RELATION_SAYS[wrong]!.en}; but here ${c.en}.`,
          `“${wrong}”表示${RELATION_SAYS[wrong]!["zh-CN"]}；可这里${c["zh-CN"]}。`,
        );
      },
    },
    {
      suffix: "relations",
      title: t("Naming the Relation", "判断关系"),
      explanation: t(
        `The connectives of a sentence tell how its clauses are related:\n\n${connectiveListEn}\n\nFor example, 如果明天天气晴朗，我们就去公园放风筝。 uses 如果……就……: tomorrow's weather is only supposed, and the outing waits on it, so the relation is 假设关系, condition.\n\n> **Watch out.** A pair with 就 is not always cause and result. In 如果……就…… the first clause has not happened: it is only supposed, so the relation is condition, not cause.`,
        `句子里的关联词告诉我们分句之间是什么关系。\n\n${connectiveList}\n\n例如：如果明天天气晴朗，我们就去公园放风筝。句子用了“如果……就……”，明天的天气还不知道，晴朗只是假设，去不去放风筝要看这个条件，所以是假设关系。\n\n> **注意。** 用了“就”不一定是因果关系。“如果……就……”的前一句说的事还没有发生，只是假设，所以是假设关系，不是因果关系。`,
      ),
      question: t("How are the clauses of this sentence related?", "这个句子的分句之间是什么关系？"),
      items: firstConnectives.map(({ sentence, pair }) =>
        drillItem(fill(sentence, pair), RELATIONS[pair]!, others(RELATION_NAMES, RELATIONS[pair]!)),
      ),
      why: (right, shown) => {
        const pair = pairOf(right);
        const c = clue(shown);
        return t(
          `**Step 1: find the connectives.** The sentence uses ${pair}.\n\n**Step 2: name the relation.** ${pair} shows ${RELATION_SAYS[pair]!.en}: ${right}.\n\n**Check.** Think about the clauses without the connectives: ${c.en}. ${RELATION_TEST[pair]!.en}`,
          `**第一步：找出关联词。**句子用了“${pair}”。\n\n**第二步：判断关系。**“${pair}”表示${RELATION_SAYS[pair]!["zh-CN"]}，是${right}。\n\n**检验。** 去掉关联词想一想：${c["zh-CN"]}。${RELATION_TEST[pair]!["zh-CN"]}`,
        );
      },
      whyNot: (wrong, right) =>
        t(
          `${wrong} would need ${pairOf(wrong)}, but the sentence uses ${pairOf(right)}.`,
          `${wrong}要用“${pairOf(wrong)}”，这个句子用的却是“${pairOf(right)}”。`,
        ),
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

/** MEANS says what each first connective of grade 4 means with its second. */
const MEANS: Readonly<Record<string, Text>> = {
  即使: t("即使……也…… says the result holds even then", "“即使……也……”表示就算这样，结果也不变"),
  只要: t("只要……就…… gives a condition that is enough", "“只要……就……”表示有了这个条件就够了"),
  只有: t("只有……才…… gives the only condition that works", "“只有……才……”表示必须有这个条件，缺了不行"),
  无论: t("无论……都…… says the result holds whatever happens", "“无论……都……”表示不管什么情况，结果都一样"),
  既然: t("既然……就…… starts from what is already true", "“既然……就……”先说已经成为事实的情况，再说由此得出的结论"),
};

/** MEANS_TEST is how the meaning of each first connective is checked in its sentence. */
const MEANS_TEST: Readonly<Record<string, Text>> = {
  即使: t("Put 就算 in its place: the sentence means the same.", "用“就算”替换它，句子意思不变。"),
  只要: t(
    "Put 只要……就…… against 只有……才……: here the condition is enough, not the only way.",
    "和“只有……才……”比一比：这里是有了条件就够，不是非这样不可。",
  ),
  只有: t(
    "Take the condition away: then the result does not come, so the condition is needed.",
    "去掉这个条件，结果就不会出现，可见这个条件必不可少。",
  ),
  无论: t("Put 不管 in its place: the sentence means the same.", "用“不管”替换它，句子意思不变。"),
  既然: t(
    "Ask whether the first clause has already happened: it has, so 既然 fits.",
    "问一问前一个分句说的是不是已经成为事实：是的，所以能用“既然”。",
  ),
};

const secondExplanation = (worked: Text): Text =>
  t(
    `The first connective of a pair must match the second. 只要……就…… gives a condition that is enough; 只有……才…… gives the only condition that works; 即使……也…… says the result holds even then; 无论……都…… says it holds whatever happens; 既然……就…… starts from what is already true.\n\n${worked.en}\n\n> **Watch out.** 只要 and 只有 sound alike but take different second words: 只要……就……, 只有……才……. Find the second word in the sentence before you choose the first.`,
    `一对关联词前后要搭配。\n\n${secondList}\n\n“只要……就……”表示有了这个条件就够了；“只有……才……”表示必须有这个条件，缺了不行；“即使……也……”表示就算这样，结果也不变；“无论……都……”表示不管什么情况，结果都一样；“既然……就……”先说已经成为事实的情况，再说由此得出的结论。\n\n${worked["zh-CN"]}\n\n> **注意。** “只要”和“只有”读音相近，搭配的词却不同：“只要……就……”“只有……才……”。先找到句子里后面的关联词，再选前面的。`,
  );

/** inSecond finds which first connective a sentence of grade 4 uses, and the item it comes from. */
const inSecond = new Map(
  secondConnectives.flatMap(([s, r, a, b, c]) => [r!, a!, b!, c!].map((x) => [s!.replace(GAP, x), { used: x, right: r! }] as const)),
);

const connectivesTwo: DrillData = {
  grade: 4,
  id: "connectives-2",
  title: t("Connectives: Only If, As Long As, Even If, Whatever, Since", "关联词：只要、只有、即使、无论、既然"),
  summary: t(
    "Choosing the first connective that matches the second, and telling sentences that pair them rightly.",
    "根据后面的关联词选用前面的关联词，判断关联词搭配是否正确。",
  ),
  intro: t(
    "Look at ＿＿多读书，才能写出好文章。 The second clause has 才, and 才 pairs with 只有: 只有多读书，才能写出好文章。 Reading much is the condition without which no good essay comes. With 就 the first word would be 只要 or 既然, with 也 it would be 即使, with 都 it would be 无论.\n\nThe first knowledge point chooses the first connective for the second; the second finds the sentence whose pair matches.",
    "看这个句子：＿＿多读书，才能写出好文章。后一个分句里有“才”，和“才”搭配的是“只有”：只有多读书，才能写出好文章。多读书是写出好文章必不可少的条件。后面是“就”，前面要用“只要”或“既然”；后面是“也”，前面用“即使”；后面是“都”，前面用“无论”。\n\n第一个知识点根据后面的关联词选前面的，第二个找出关联词搭配正确的句子。",
  ),
  points: [
    {
      suffix: "choosing",
      title: t("Matching the Pair", "关联词搭配"),
      explanation: secondExplanation(
        t(
          "For example, ＿＿天气再冷，爷爷也坚持早起锻炼。 The second clause has 也, which pairs with 即使: 即使天气再冷，爷爷也坚持早起锻炼。 However cold it is, he still gets up early.",
          "例如：＿＿天气再冷，爷爷也坚持早起锻炼。后一个分句里有“也”，和它搭配的是“即使”：即使天气再冷，爷爷也坚持早起锻炼。就算天气再冷，他也照样早起。",
        ),
      ),
      question: t("Which connective goes in the gap?", "横线处应该填哪个关联词？"),
      items: secondConnectives.map(([s, r, a, b, c]) => drillItem(s!, r!, [a!, b!, c!])),
      why: (right, shown) => {
        const filled = shown.replace(GAP, right);
        return t(
          `**Step 1: find the second connective.** The second clause has ${SECOND[right]}.\n\n**Step 2: choose the first that pairs with it.** ${MEANS[right]!.en}: ${filled}\n\n**Check.** ${MEANS_TEST[right]!.en}`,
          `**第一步：找出后面的关联词。**后一个分句里有“${SECOND[right]}”。\n\n**第二步：选出和它搭配的关联词。**${MEANS[right]!["zh-CN"]}：${filled}\n\n**检验。** ${MEANS_TEST[right]!["zh-CN"]}`,
        );
      },
      whyNot: (wrong, right) =>
        t(
          `${wrong} pairs with ${SECOND[wrong]}, but the second clause has ${SECOND[right]}.`,
          `“${wrong}”和“${SECOND[wrong]}”搭配，后一个分句里却是“${SECOND[right]}”。`,
        ),
    },
    {
      suffix: "checking",
      title: t("Checking the Pair", "检查关联词"),
      explanation: secondExplanation(
        t(
          "For example, 只要按时浇水，花儿就会开得很好。 is right: 只要 pairs with 就. 只有按时浇水，花儿就会开得很好。 is not: 只有 pairs with 才.",
          "例如：“只要按时浇水，花儿就会开得很好。”是对的，“只要”和“就”搭配；“只有按时浇水，花儿就会开得很好。”就错了，“只有”要和“才”搭配。",
        ),
      ),
      question: t("Which sentence uses its connectives correctly?", "哪个句子的关联词用得正确？"),
      items: secondConnectives.map(([s, r, a, b, c]) =>
        drillItem("", s!.replace(GAP, r!), [s!.replace(GAP, a!), s!.replace(GAP, b!), s!.replace(GAP, c!)]),
      ),
      why: (right) => {
        const r = inSecond.get(right)?.right ?? "";
        return t(
          `**Step 1: find the second connective of each.** All the sentences share their second clause, with ${SECOND[r]}.\n\n**Step 2: find the first that pairs with it.** ${r} pairs with ${SECOND[r]}: ${right} ${MEANS[r]!.en}.\n\n**Check.** ${MEANS_TEST[r]!.en}`,
          `**第一步：找出后面的关联词。**几个句子的后一个分句相同，用的都是“${SECOND[r]}”。\n\n**第二步：找出和它搭配的关联词。**“${r}”和“${SECOND[r]}”搭配：${right}${MEANS[r]!["zh-CN"]}。\n\n**检验。** ${MEANS_TEST[r]!["zh-CN"]}`,
        );
      },
      whyNot: (wrong) => {
        const w = inSecond.get(wrong);
        const used = w?.used ?? "";
        const r = w?.right ?? "";
        return t(
          `${wrong} has ${used}, which pairs with ${SECOND[used]}, not with ${SECOND[r]}.`,
          `“${wrong}”用了“${used}”，它和“${SECOND[used]}”搭配，不和“${SECOND[r]}”搭配。`,
        );
      },
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

/** BaBei is a sentence that can be told with 把 or with 被: who does it, what it is done to, and what is done. */
interface BaBei {
  readonly a: string;
  readonly b: string;
  readonly vp: string;
}

const ba = ({ a, b, vp }: BaBei): string => `${a}把${b}${vp}。`;
const bei = ({ a, b, vp }: BaBei): string => `${b}被${a}${vp}。`;

/** baBeiOf is the item a 把 or 被 sentence comes from. */
const baBeiOf = new Map(baBei.flatMap((s) => [[ba(s), s] as const, [bei(s), s] as const]));
const babei = (sentence: string): BaBei => baBeiOf.get(sentence) ?? { a: "", b: "", vp: "" };

const baBeiExplanation = (worked: Text): Text =>
  t(
    `A 把 sentence starts from who does something: 弟弟把花瓶打碎了. A 被 sentence starts from what it is done to: 花瓶被弟弟打碎了. To change one into the other, swap the doer and what it is done to, and change 把 into 被 or 被 into 把; what happens stays the same.\n\n${worked.en}\n\n> **Watch out.** Swapping the two is not enough: the 把 must become 被, or the 被 把. 花瓶把弟弟打碎了 swaps them but keeps 把, and says the vase broke the boy.`,
    `“把”字句从做事的人说起：弟弟把花瓶打碎了。“被”字句从被处置的事物说起：花瓶被弟弟打碎了。\n\n两种句子互相改写时，把做事的人和被处置的事物换个位置，“把”换成“被”或者“被”换成“把”，意思不能变。\n\n${worked["zh-CN"]}\n\n> **注意。** 只换位置还不够，“把”要换成“被”，“被”要换成“把”。“花瓶把弟弟打碎了”换了位置却还用“把”，就成了花瓶打碎了弟弟。`,
  );

const sentencesBaBei: DrillData = {
  grade: 4,
  id: "sentences-ba-and-bei",
  title: t("把 and 被 Sentences", "“把”字句和“被”字句"),
  summary: t(
    "Changing a 把 sentence into a 被 sentence and back without changing what it says.",
    "把“把”字句和“被”字句互相改写，意思不变。",
  ),
  intro: t(
    "大风把小树吹倒了。 and 小树被大风吹倒了。 tell one event. The first starts from the wind, which does it, and puts 把 before the tree; the second starts from the tree, which it happens to, and puts 被 before the wind. Only the order and the little word change; the wind still blows the tree down.\n\nThe first knowledge point turns a 把 sentence into a 被 sentence, the second turns a 被 sentence back.",
    "“大风把小树吹倒了。”和“小树被大风吹倒了。”说的是同一件事。前一句从做事的“大风”说起，“把”放在“小树”前面；后一句从被处置的“小树”说起，“被”放在“大风”前面。变的只是语序和“把”“被”，大风吹倒小树这件事没有变。\n\n第一个知识点把“把”字句改成“被”字句，第二个把“被”字句改回“把”字句。",
  ),
  points: [
    {
      suffix: "to-bei",
      title: t("From 把 to 被", "“把”字句改为“被”字句"),
      explanation: baBeiExplanation(
        t(
          "For example, 小猫把毛线球弄乱了。 The doer is 小猫, what it is done to is 毛线球. Put 毛线球 first, then 被 and 小猫: 毛线球被小猫弄乱了。",
          "例如：小猫把毛线球弄乱了。做事的是“小猫”，被处置的是“毛线球”。把“毛线球”放在前面，后面接“被”和“小猫”：毛线球被小猫弄乱了。",
        ),
      ),
      question: t("Which is the sentence as a 被 sentence?", "把这个句子改成“被”字句，哪个是对的？"),
      items: baBei.map((s) => drillItem(ba(s), bei(s), [`${s.a}被${s.b}${s.vp}。`, `被${s.a}${s.b}${s.vp}。`, `${s.b}把${s.a}${s.vp}。`])),
      why: (right, shown) => {
        const { a, b, vp } = babei(shown);
        return t(
          `**Step 1: find the doer and what it is done to.** In ${shown} the doer is ${a}, and ${b} is what it is done to.\n\n**Step 2: start from what it is done to.** Put ${b} first, then 被 and ${a}, then ${vp}: ${right}\n\n**Check.** Ask who ${vp} in each sentence: in both it is ${a}, and ${b} is what it happens to, so the meaning has not changed.`,
          `**第一步：找出做事的人和被处置的事物。**“${shown}”里，做事的是“${a}”，被处置的是“${b}”。\n\n**第二步：从被处置的事物说起。**“${b}”放在前面，接着是“被”和“${a}”，最后是“${vp}”：${right}\n\n**检验。** 问一问两句里是谁“${vp}”：都是“${a}”，“${b}”都是被处置的，意思没有变。`,
        );
      },
      whyNot: (wrong, _right, shown) =>
        about(
          wrong,
          ((): Text => {
            const { a, b } = babei(shown);
            if (wrong.startsWith("被"))
              return t(
                `Nothing stands before 被: what it is done to, ${b}, must come first.`,
                `“被”前面没有东西，被处置的“${b}”应该放在句首。`,
              );
            if (wrong.startsWith(`${a}被`))
              return t(
                `It puts 被 after the doer ${a}, which makes ${a} the one it is done to: the meaning turns round.`,
                `“被”放在了做事的“${a}”后面，“${a}”反倒成了被处置的一方，意思反了。`,
              );
            return t(
              `It swaps the two but keeps 把, so now ${b} does it to ${a}: the meaning turns round.`,
              `换了位置却还用“把”，成了“${b}”去处置“${a}”，意思反了。`,
            );
          })(),
        ),
    },
    {
      suffix: "to-ba",
      title: t("From 被 to 把", "“被”字句改为“把”字句"),
      explanation: baBeiExplanation(
        t(
          "For example, 小船被爷爷修好了。 What it is done to is 小船, the doer is 爷爷. Put 爷爷 first, then 把 and 小船: 爷爷把小船修好了。",
          "例如：小船被爷爷修好了。被处置的是“小船”，做事的是“爷爷”。把“爷爷”放在前面，后面接“把”和“小船”：爷爷把小船修好了。",
        ),
      ),
      question: t("Which is the sentence as a 把 sentence?", "把这个句子改成“把”字句，哪个是对的？"),
      items: baBei.map((s) => drillItem(bei(s), ba(s), [`${s.b}把${s.a}${s.vp}。`, `把${s.a}${s.b}${s.vp}。`, `${s.a}被${s.b}${s.vp}。`])),
      why: (right, shown) => {
        const { a, b, vp } = babei(shown);
        return t(
          `**Step 1: find the doer and what it is done to.** In ${shown}, ${b} is what it is done to and the doer, after 被, is ${a}.\n\n**Step 2: start from the doer.** Put ${a} first, then 把 and ${b}, then ${vp}: ${right}\n\n**Check.** Ask who ${vp} in each sentence: in both it is ${a}, and ${b} is what it happens to, so the meaning has not changed.`,
          `**第一步：找出做事的人和被处置的事物。**“${shown}”里，被处置的是“${b}”，“被”后面做事的是“${a}”。\n\n**第二步：从做事的人说起。**“${a}”放在前面，接着是“把”和“${b}”，最后是“${vp}”：${right}\n\n**检验。** 问一问两句里是谁“${vp}”：都是“${a}”，“${b}”都是被处置的，意思没有变。`,
        );
      },
      whyNot: (wrong, _right, shown) =>
        about(
          wrong,
          ((): Text => {
            const { a, b } = babei(shown);
            if (wrong.startsWith("把"))
              return t(`Nothing stands before 把: the doer, ${a}, must come first.`, `“把”前面没有做事的人，“${a}”应该放在句首。`);
            if (wrong.startsWith(`${b}把`))
              return t(
                `It puts ${b}, what it is done to, before 把, as if ${b} did it to ${a}: the meaning turns round.`,
                `把被处置的“${b}”放在了“把”前面，成了“${b}”处置“${a}”，意思反了。`,
              );
            return t(
              `It swaps the two but keeps 被, so now ${a} has it done to it by ${b}: the meaning turns round.`,
              `换了位置却还用“被”，成了“${a}”被“${b}”处置，意思反了。`,
            );
          })(),
        ),
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

/** Rhetorical is a rhetorical question, the statement it means, and three wrong rewritings of either. */
type Rhetorical = (typeof rhetorical)[number];

/** rhetoricalOf is the item a rhetorical question or its statement comes from. */
const rhetoricalOf = new Map(rhetorical.flatMap((r) => [[r.q, r] as const, [r.statement, r] as const]));

/** negative tells whether a rhetorical question is in the negative form: it has a 不 that its reversed form lacks. */
const negative = (r: Rhetorical): boolean => [...r.q].filter((c) => c === "不").length > [...r.reversed].filter((c) => c === "不").length;

/** FORM names the two forms of a sentence. */
const FORM = { yes: t("affirmative", "肯定"), no: t("negative", "否定") } as const;

const rhetoricalExplanation = (worked: Text): Text =>
  t(
    `A rhetorical question asks nothing: it states its answer more forcefully, and the answer is the opposite of its form. 我们怎么能浪费粮食呢？ means 我们不能浪费粮食; 难道你不知道吗？ means 你知道. To change it into a statement, take away the question words (怎么, 难道, 呢, 吗), turn 能 into 不能 or 不 into nothing, and end with a full stop. To make a rhetorical question, do the reverse; the meaning must not change.\n\n${worked.en}\n\n> **Watch out.** Do not copy the form of the question into the statement. 难道你不知道明天要考试吗？ has 不 but means 你知道明天要考试: keep the 不 and the meaning turns round.`,
    `反问句不需要回答，它用问的形式表达确定的意思，语气更强烈。肯定形式的反问句表达否定的意思，否定形式的反问句表达肯定的意思：“我们怎么能浪费粮食呢？”意思是“我们不能浪费粮食”；“难道你不知道吗？”意思是“你知道”。\n\n反问句改陈述句：去掉“怎么”“难道”“呢”“吗”等词，肯定改否定、否定改肯定，问号改成句号。陈述句改反问句正好相反。改写后意思不能变。\n\n${worked["zh-CN"]}\n\n> **注意。** 不能照着反问句的字面写陈述句。“难道你不知道明天要考试吗？”里有“不”，意思却是“你知道明天要考试”：留下“不”，意思就反了。`,
  );

const sentencesRhetorical: DrillData = {
  grade: 5,
  id: "sentences-rhetorical-questions",
  title: t("Rhetorical Questions and Statements", "反问句和陈述句"),
  summary: t(
    "Changing a rhetorical question into a statement and a statement into a rhetorical question.",
    "反问句和陈述句互相改写，意思不变。",
  ),
  intro: t(
    "这么美的景色，谁不喜欢呢？ asks no one. It means everyone likes it, and says so more strongly than 这么美的景色，人人都喜欢。 would. Its form is negative, with 不, and its meaning is affirmative: a rhetorical question always means the opposite of its form.\n\nThe first knowledge point turns a rhetorical question into the statement it means, the second turns a statement into a rhetorical question.",
    "“这么美的景色，谁不喜欢呢？”并不是要谁回答，意思是人人都喜欢，比“这么美的景色，人人都喜欢。”说得更有力。它的字面是否定的，有“不”，意思却是肯定的：反问句的意思总是和字面相反。\n\n第一个知识点把反问句改成陈述句，第二个把陈述句改成反问句。",
  ),
  points: [
    {
      suffix: "to-statement",
      title: t("From a Rhetorical Question", "反问句改为陈述句"),
      explanation: rhetoricalExplanation(
        t(
          "For example, 难道这不是一个好办法吗？ is negative in form, so it means the affirmative. Take away 难道 and 吗, drop 不, end with a full stop: 这是一个好办法。",
          "例如：难道这不是一个好办法吗？字面是否定的，意思就是肯定的。去掉“难道”“吗”，去掉“不”，问号改成句号：这是一个好办法。",
        ),
      ),
      question: t("Which statement says what the rhetorical question means?", "把这个反问句改成陈述句，哪个是对的？"),
      items: rhetorical.map((r) => drillItem(r.q, r.statement, [r.opposite, r.plain, r.reversed])),
      why: (right, shown) => {
        const r = rhetoricalOf.get(shown)!;
        const [form, meaning] = negative(r) ? [FORM.no, FORM.yes] : [FORM.yes, FORM.no];
        return t(
          `**Step 1: read its form.** ${shown} is ${form.en} in form, so it means the ${meaning.en}.\n\n**Step 2: say it as a statement.** Take away the question words, turn the form round and end with a full stop: ${right}\n\n**Check.** Answer the question as its asker expects: the answer is just ${right} The statement and the question mean the same.`,
          `**第一步：看字面。**“${shown}”字面是${form["zh-CN"]}的，意思就是${meaning["zh-CN"]}的。\n\n**第二步：改成陈述句。**去掉表示反问的词，${form["zh-CN"]}改${meaning["zh-CN"]}，问号改成句号：${right}\n\n**检验。** 照问话人想要的答案回答这个问题，答案正是“${right}”陈述句和反问句意思相同。`,
        );
      },
      whyNot: (wrong, _right, shown) =>
        about(
          wrong,
          ((): Text => {
            const r = rhetoricalOf.get(shown)!;
            if (wrong === r.opposite)
              return t(
                "It copies the form of the question instead of turning it round, and so says the opposite of what the question means.",
                "它照着反问句的字面写，没有把肯定否定反过来，说出的意思和反问句正好相反。",
              );
            if (wrong === r.plain)
              return t("It is still a question that waits for an answer, not a statement.", "它仍是问句，还在等人回答，不是陈述句。");
            return t(
              "It is still a question, and it turns the form round inside the question, so its meaning turns round too.",
              "它仍是问句，而且在问句里把肯定否定弄反了，意思也跟着反了。",
            );
          })(),
        ),
    },
    {
      suffix: "to-question",
      title: t("Into a Rhetorical Question", "陈述句改为反问句"),
      explanation: rhetoricalExplanation(
        t(
          "For example, 我们应该爱护环境。 is affirmative, so its rhetorical question is negative in form: 难道我们不应该爱护环境吗？",
          "例如：我们应该爱护环境。这是肯定的说法，改成反问句，字面就要是否定的：难道我们不应该爱护环境吗？",
        ),
      ),
      question: t("Which rhetorical question says the same as the statement?", "把这个陈述句改成反问句，哪个是对的？"),
      items: rhetorical.map((r) => drillItem(r.statement, r.q, [r.plain, r.reversed, r.opposite])),
      why: (right, shown) => {
        const r = rhetoricalOf.get(shown)!;
        const [meaning, form] = negative(r) ? [FORM.yes, FORM.no] : [FORM.no, FORM.yes];
        return t(
          `**Step 1: read the statement.** ${shown} is ${meaning.en}, so its rhetorical question must be ${form.en} in form.\n\n**Step 2: ask it.** Add a question word such as 难道 or 怎么, turn the form round and end with a question mark: ${right}\n\n**Check.** Change it back: take away the question words and turn the form round again, and you have ${shown}`,
          `**第一步：看陈述句。**“${shown}”是${meaning["zh-CN"]}的说法，改成反问句，字面就要是${form["zh-CN"]}的。\n\n**第二步：改成反问句。**加上“难道”“怎么”等词，${meaning["zh-CN"]}改${form["zh-CN"]}，句号改成问号：${right}\n\n**检验。** 再改回去：去掉表示反问的词，肯定否定再反过来，就是原来的“${shown}”`,
        );
      },
      whyNot: (wrong, _right, shown) =>
        about(
          wrong,
          ((): Text => {
            const r = rhetoricalOf.get(shown)!;
            if (wrong === r.plain)
              return t(
                "It asks a real question that wants an answer; a rhetorical question holds its answer already.",
                "这是真正的提问，需要别人回答；反问句的答案就在问句里。",
              );
            if (wrong === r.reversed)
              return t(
                "Its form is not turned round: a rhetorical question means the opposite of its form, so this one means the opposite of the statement.",
                "它的字面没有反过来：反问句的意思和字面相反，这一句的意思就和陈述句相反了。",
              );
            return t(
              "It is a statement, not a question, and it says the opposite of the one given.",
              "这是陈述句，不是反问句，意思还和原句相反。",
            );
          })(),
        ),
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

/** Reported is a sentence of direct speech: who says it to whom, the words spoken, their report, and wrong reports. */
type Reported = (typeof reported)[number];

/** reportedOf is the item a direct or reported sentence comes from. */
const reportedOf: ReadonlyMap<string, Reported> = new Map(
  reported.flatMap((r) => [[`${r.s}：“${r.q}”`, r] as const, [`${r.s}，${r.i}。`, r] as const]),
);

/** parties are who speaks and to whom, from the words before the speech, as 小明对老师说. */
const parties = (r: Reported): { speaker: string; listener: string } => {
  const [speaker = "", rest = ""] = r.s.split("对");
  return { speaker, listener: rest.replace(/说$/u, "") };
};

const reportedExplanation = (worked: Text): Text =>
  t(
    `Direct speech gives someone's words as they said them, after a colon and in quotation marks: 小明对老师说：“我明天要去看奶奶。” Reported speech tells what they said in the narrator's words, after a comma and without quotation marks: 小明对老师说，他明天要去看奶奶。 The persons change with it: the speaker's 我 becomes 他 or 她, and 你, the one spoken to, becomes whoever that is for the narrator, often 我.\n\n${worked.en}\n\n> **Watch out.** The persons change for the narrator, not by swapping 我 for 他 every time. In 妈妈对我说：“你要按时完成作业。” the 你 is the narrator, so the report says 我: 妈妈对我说，我要按时完成作业。`,
    `直接引用别人的原话叫直述句，说话的人后面用冒号和引号：小明对老师说：“我明天要去看奶奶。”用转述的人的口气说出别人的话叫转述句，用逗号，不用引号：小明对老师说，他明天要去看奶奶。\n\n改写时人称要跟着变：说话人自称的“我”要改成“他”或“她”；说话人称对方的“你”，要改成对转述人来说是谁，常常是“我”。意思不能变。\n\n${worked["zh-CN"]}\n\n> **注意。** 人称要从转述人的角度来改，不是见“我”就改成“他”。“妈妈对我说：‘你要按时完成作业。’”里的“你”就是转述的人，所以转述句里是“我”：妈妈对我说，我要按时完成作业。`,
  );

const sentencesReported: DrillData = {
  grade: 5,
  id: "sentences-reported-speech",
  title: t("Direct and Reported Speech", "直述句和转述句"),
  summary: t(
    "Changing direct speech into reported speech and back, with the persons that change.",
    "直述句和转述句互相改写，注意人称的变化。",
  ),
  intro: t(
    "姐姐对我说：“我在门口等你。” gives her own words. To tell them myself, I drop the colon and quotation marks and say whom she means from where I stand: her 我 is she, 她, and her 你 is me, 我. 姐姐对我说，她在门口等我。 says the same thing in my words.\n\nThe first knowledge point turns direct speech into reported speech, the second turns reported speech back into the words spoken.",
    "“姐姐对我说：‘我在门口等你。’”是姐姐的原话。由我来转述时，去掉冒号和引号，从我的角度说清楚是谁：姐姐说的“我”是她，“你”是我。“姐姐对我说，她在门口等我。”用我的口气说了同样的意思。\n\n第一个知识点把直述句改成转述句，第二个把转述句改回直述句。",
  ),
  points: [
    {
      suffix: "to-reported",
      title: t("Reporting What Was Said", "直述句改为转述句"),
      explanation: reportedExplanation(
        t(
          "For example, 爸爸对我说：“我周末带你去动物园。” His 我 is he, 他, and his 你 is the narrator, 我: 爸爸对我说，他周末带我去动物园。",
          "例如：爸爸对我说：“我周末带你去动物园。”爸爸说的“我”是他，“你”是转述的我：爸爸对我说，他周末带我去动物园。",
        ),
      ),
      question: t("Which sentence reports what was said?", "把这句话改成转述句，哪个是对的？"),
      items: reported.map((r) =>
        drillItem(`${r.s}：“${r.q}”`, `${r.s}，${r.i}。`, [`${r.s}，${r.q}`, `${r.s}，${r.w}。`, `${r.s}，${r.o}。`]),
      ),
      why: (right, shown) => {
        const r = reportedOf.get(shown)!;
        const { speaker, listener } = parties(r);
        return t(
          `**Step 1: who speaks to whom.** ${speaker} speaks to ${listener}.\n\n**Step 2: say it in the narrator's words.** Drop the colon and quotation marks, and name each person as the narrator would: ${right}\n\n**Check.** Change it back: put in the colon and quotation marks, and give ${speaker} the persons of their own words: ${shown}`,
          `**第一步：谁对谁说。**${speaker}对${listener}说，由转述的人来说。\n\n**第二步：换成转述人的口气。**去掉冒号和引号，人称按转述人的角度来改：${right}\n\n**检验。** 再改回去：加上冒号和引号，按${speaker}自己的口气说人称，就是原句：${shown}`,
        );
      },
      whyNot: (wrong, _right, shown) => {
        const r = reportedOf.get(shown)!;
        if (wrong === `${r.s}，${r.q}`)
          return about(
            wrong,
            t(
              "it drops the quotation marks but keeps the speaker's own persons, so the speaker's 我 now reads as the narrator.",
              "去掉了引号，人称却没有改，说话人自称的“我”读起来成了转述的人。",
            ),
          );
        if (wrong === `${r.s}，${r.w}。`)
          return about(
            wrong,
            t(`the persons are wrong: the narrator says ${r.i}, not ${r.w}.`, `人称改错了：转述人应该说“${r.i}”，不是“${r.w}”。`),
          );
        return about(
          wrong,
          t(
            `it changes what was said: ${r.o} says the opposite of ${r.q}`,
            `意思变了：“${r.o}”和原话“${r.q.replace(/。$/u, "")}”意思相反。`,
          ),
        );
      },
    },
    {
      suffix: "to-direct",
      title: t("Giving the Words Spoken", "转述句改为直述句"),
      explanation: reportedExplanation(
        t(
          "For example, 小红对妈妈说，她想学弹钢琴。 In her own words 小红 says 我 of herself: 小红对妈妈说：“我想学弹钢琴。”",
          "例如：小红对妈妈说，她想学弹钢琴。小红自己说话时称自己为“我”：小红对妈妈说：“我想学弹钢琴。”",
        ),
      ),
      question: t("Which sentence gives the words as they were spoken?", "把这句话改成直述句，哪个是对的？"),
      items: reported.map((r) =>
        drillItem(`${r.s}，${r.i}。`, `${r.s}：“${r.q}”`, [`${r.s}：“${r.i}。”`, `${r.s}：“${r.w}。”`, `${r.s}：“${r.o}。”`]),
      ),
      why: (right, shown) => {
        const r = reportedOf.get(shown)!;
        const { speaker, listener } = parties(r);
        return t(
          `**Step 1: who speaks to whom.** ${speaker} speaks to ${listener}.\n\n**Step 2: give the speaker's own words.** Put in a colon and quotation marks; ${speaker} says 我 of themself and 你 to ${listener}: ${right}\n\n**Check.** Report it again in the narrator's words, and you have ${shown}`,
          `**第一步：谁对谁说。**${speaker}对${listener}说。\n\n**第二步：用说话人自己的口气。**加上冒号和引号，${speaker}称自己为“我”，称${listener}为“你”：${right}\n\n**检验。** 再用转述人的口气说一遍，就是原句：${shown}`,
        );
      },
      whyNot: (wrong, _right, shown) => {
        const r = reportedOf.get(shown)!;
        const { speaker } = parties(r);
        if (wrong === `${r.s}：“${r.i}。”`)
          return about(
            wrong,
            t(
              `the quotation marks are back, but the persons are still the narrator's; in ${speaker}'s own words it is ${r.q}`,
              `加了引号，人称却还是转述人的说法；${speaker}自己会说“${r.q.replace(/。$/u, "")}”。`,
            ),
          );
        if (wrong === `${r.s}：“${r.w}。”`)
          return about(
            wrong,
            t(
              `the persons are wrong: ${speaker} would say ${r.q} not ${r.w}.`,
              `人称改错了：${speaker}会说“${r.q.replace(/。$/u, "")}”，不是“${r.w}”。`,
            ),
          );
        return about(
          wrong,
          t(`it changes what was said: ${r.o} says the opposite of the report, ${r.i}.`, `意思变了：“${r.o}”和转述的“${r.i}”意思相反。`),
        );
      },
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

/** DEVICE_TEST is how each device is checked in a sentence. */
const DEVICE_TEST: Readonly<Record<string, Text>> = {
  比喻: t(
    "Name the two things: they are of different kinds, and one is likened to the other.",
    "说出被比的和用来比的两样东西：它们是不同的事物，一个被比作另一个。",
  ),
  拟人: t("Find the thing and what it does: only a person does that.", "找出写的事物和它做的事：那是人才会做的。"),
  夸张: t(
    "Ask whether it could really be so: it could not; it is said far beyond the truth on purpose.",
    "问一问实际上能不能这样：不能，是故意说得远远超过实际。",
  ),
  排比: t(
    "Count the phrases of the same form: there are three or more, in a row.",
    "数一数结构相同的句子或词组：有三个或三个以上，排在一起。",
  ),
  对偶: t(
    "Set the two lines one over the other: they have as many characters, and each word faces a word of its kind.",
    "把两句上下对齐：字数相等，词语一一相对。",
  ),
  设问: t("Look after the question: the answer follows at once, from the same speaker.", "看问句后面：紧接着就有回答，是说话人自己答的。"),
  反问: t(
    "Look for the answer: there is none after it, because the question itself says it.",
    "找一找回答：后面没有，因为答案就在问句里。",
  ),
  反复: t("Find the words said twice or more: they are the same and stand close together.", "找出说了两遍以上的词句：词句相同，挨得很近。"),
  借代: t(
    "Ask what is really meant: something else, named by what goes with it.",
    "问一问真正要说的是谁或什么：是另一样东西，用和它相关的事物来称呼。",
  ),
  对比: t(
    "Find the two sides set together: they are opposite or different, and the point is in the difference.",
    "找出放在一起的两方面：它们相反或不同，意思就在这不同里。",
  ),
  引用: t(
    "Find the words that are not the writer's own: a line, a saying or a proverb, often in quotation marks.",
    "找出不是作者自己的话：诗句、名言或俗语，常常加了引号。",
  ),
  顶真: t("Look at where each clause ends and the next begins: the same words link them.", "看前一句的结尾和后一句的开头：是同样的词语。"),
  通感: t("Name the sense each part belongs to: two different senses are joined.", "说出每部分属于哪种感觉：两种不同的感觉连在了一起。"),
  互文: t(
    "Read the halves apart and then together: only together do they say what is meant.",
    "把两部分分开读，再合起来读：合起来意思才完整。",
  ),
  双关: t("Find the word with two readings: one on the surface, one meant beneath.", "找出有两层意思的词：一层在表面，一层在里面。"),
  反语: t(
    "Set the word against the facts: the facts say the opposite, so the word is meant the other way.",
    "拿词语和事实比一比：事实正相反，所以是反话。",
  ),
};

/** CLUES say what in each rhetoric sentence shows its device. */
const CLUES: ReadonlyMap<string, Text> = new Map(
  lines(
    `
弯弯的月亮像一只小船，挂在天空中。 | 把弯弯的月亮比作小船，用了“像” | it likens the curved moon to a little boat, with 像
秋天的田野是一片金色的海洋。 | 把金黄的田野比作海洋，用了“是” | it likens the golden fields to a sea, with 是
荷叶圆圆的，像一把把绿色的小伞。 | 把圆圆的荷叶比作小伞，用了“像” | it likens the round lotus leaves to little umbrellas, with 像
老师就像辛勤的园丁，培育着我们这些小苗。 | 把老师比作园丁，把学生比作小苗 | it likens the teacher to a gardener and the pupils to seedlings
小草从泥土里探出头来，好奇地打量着这个世界。 | 小草像人一样“探出头来”“好奇地打量” | the grass 探出头来 and looks about 好奇地, as a person would
春风轻轻地抚摸着我的脸。 | 春风像人一样“抚摸”我的脸 | the spring wind 抚摸, strokes, my face as a person would
小溪一路唱着歌，向远方流去。 | 小溪像人一样“唱着歌” | the stream 唱着歌, sings, as a person does
太阳公公露出了笑脸，向大家问好。 | 太阳像人一样有“笑脸”，还“问好” | the sun has a 笑脸 and 问好, greets everyone, as a person would
他的嗓门大得能把房顶掀翻。 | 嗓门再大也掀不翻房顶，故意说大了 | no voice can lift a roof off: it is made far louder than it is
教室里静得连一根针掉在地上都能听见。 | 故意把安静说到了极点，连针落地都听得见 | quiet is pushed to the extreme of hearing a pin drop
弟弟饿得能吃下一头牛。 | 一个人吃不下一头牛，故意把饿说大了 | no one can eat an ox: his hunger is made far greater than it is
天气热得能在路面上煎鸡蛋。 | 故意把热说到能在路面煎鸡蛋 | the heat is pushed to frying an egg on the road
我爱家乡的山，我爱家乡的水，我爱家乡的一草一木。 | 三个“我爱家乡的……”结构相同，排在一起 | three phrases of one form, 我爱家乡的……, stand in a row
读书能使人增长知识，读书能使人开阔眼界，读书能使人明白道理。 | 三个“读书能使人……”结构相同，排在一起 | three phrases of one form, 读书能使人……, stand in a row
我们要爱护花草，爱护树木，爱护身边的一切生命。 | 三个“爱护……”结构相同，排在一起 | three phrases of one form, 爱护……, stand in a row
他是那样勇敢，那样坚强，那样乐观。 | 三个“那样……”结构相同，排在一起 | three phrases of one form, 那样……, stand in a row
白日依山尽，黄河入海流。 | 两句都是五个字，“白日”对“黄河”，“依山”对“入海”，“尽”对“流” | two lines of five characters, 白日 against 黄河, 依山 against 入海, 尽 against 流
两个黄鹂鸣翠柳，一行白鹭上青天。 | 两句字数相等，“两个”对“一行”，“黄鹂”对“白鹭”，“鸣翠柳”对“上青天” | two lines of seven, 两个 against 一行, 黄鹂 against 白鹭, 鸣翠柳 against 上青天
少壮不努力，老大徒伤悲。 | 两句都是五个字，“少壮”对“老大”，“不努力”对“徒伤悲” | two lines of five, 少壮 against 老大, 不努力 against 徒伤悲
明月松间照，清泉石上流。 | 两句都是五个字，“明月”对“清泉”，“松间照”对“石上流” | two lines of five, 明月 against 清泉, 松间照 against 石上流
什么是幸福？幸福就是和家人在一起的每一天。 | 先问“什么是幸福”，接着自己回答 | it asks 什么是幸福 and answers at once itself
春天在哪里？春天在田野里，在小河边。 | 先问“春天在哪里”，接着自己回答 | it asks 春天在哪里 and answers at once itself
为什么树叶到了秋天会变黄？因为天气变冷，叶子里的叶绿素减少了。 | 先问树叶为什么变黄，接着用“因为”自己回答 | it asks why leaves turn yellow and answers at once with 因为
我们为什么要读书？读书能让我们懂得更多道理。 | 先问“为什么要读书”，接着自己回答 | it asks 为什么要读书 and answers at once itself
这么好的机会，我们怎么能错过呢？ | 用“怎么能……呢”问，意思是不能错过，不需要回答 | it asks with 怎么能……呢 and means 不能错过: no answer is wanted
难道你忘记了自己说过的话吗？ | 用“难道……吗”问，意思是你不该忘记，不需要回答 | it asks with 难道……吗 and means you should not have forgotten: no answer is wanted
一个人不努力，怎么能取得好成绩呢？ | 用“怎么能……呢”问，意思是不努力就取得不了好成绩 | it asks with 怎么能……呢 and means no effort, no good marks
大家都这么帮我，我难道不应该好好学习吗？ | 用“难道不……吗”问，意思是我应该好好学习 | it asks with 难道不……吗 and means I should study well
等啊等，等啊等，妈妈终于回来了。 | “等啊等”说了两遍，强调等了很久 | 等啊等 is said twice to stress the long wait
我们要坚持，坚持，再坚持！ | “坚持”一连说了三遍，强调要坚持 | 坚持 is said three times to stress keeping on
回来吧，小燕子！回来吧，小燕子！ | 整句“回来吧，小燕子”重复了一遍，强调盼望 | the whole line 回来吧，小燕子 is said again to stress the longing
雨下着，下着，一整天都没有停。 | “下着”重复，强调雨下得久 | 下着 is said again to stress how long it rains
红领巾们排着整齐的队伍走进了博物馆。 | 用“红领巾”代替戴红领巾的少先队员 | 红领巾 stands for the Young Pioneers who wear the red scarf
满屋子的白大褂都在忙着抢救病人。 | 用“白大褂”代替穿白大褂的医生 | 白大褂 stands for the doctors who wear white coats
他一口气读完了三本鲁迅。 | 用作者“鲁迅”代替鲁迅写的书 | the writer 鲁迅 stands for the books he wrote
黄发垂髫，并怡然自乐。 | 用“黄发”代替老人，“垂髫”代替小孩 | 黄发, yellowed hair, stands for the old, and 垂髫, hanging locks, for children
朱门酒肉臭，路有冻死骨。 | 富人家酒肉多得发臭，路上却有冻死的穷人，两种情形放在一起比 | the rich with meat to rot are set against the poor frozen in the road
过去这里是一片荒滩，如今已经变成了绿树成荫的公园。 | 把这里的过去和如今放在一起比 | the place's past is set against its present
懒惰的人抱怨时间太少，勤奋的人却总能挤出时间读书。 | 把懒惰的人和勤奋的人放在一起比 | the lazy are set against the hard-working
城里灯火通明，热闹非凡；村子里却一片漆黑，静悄悄的。 | 把灯火通明的城里和漆黑的村子放在一起比 | the bright, busy town is set against the dark, still village
古人说：“三人行，必有我师焉。”我们要虚心向别人学习。 | 引用古人的话说明要虚心学习 | it quotes the ancients' 三人行，必有我师焉 to make its point
“少壮不努力，老大徒伤悲。”我们要珍惜青春时光。 | 引用古诗句说明要珍惜青春 | it quotes the line 少壮不努力，老大徒伤悲 to make its point
俗话说：“一分耕耘，一分收获。”他的好成绩是用汗水换来的。 | 引用俗语说明付出才有收获 | it quotes the saying 一分耕耘，一分收获 to make its point
“海内存知己，天涯若比邻。”朋友虽然远在他乡，我们的心却连在一起。 | 引用古诗句说明友情不受距离阻隔 | it quotes the line 海内存知己，天涯若比邻 to make its point
山上有座庙，庙里有个老和尚，老和尚在给小和尚讲故事。 | 前一句末尾的“庙”“老和尚”做了后一句的开头 | 庙 and 老和尚, which end one clause, begin the next
知识来自学习，学习需要坚持，坚持才能成功。 | 前一句末尾的“学习”“坚持”做了后一句的开头 | 学习 and 坚持, which end one clause, begin the next
我们要多读好书，好书能开阔眼界，眼界开阔了，心胸也就宽广了。 | 前一句末尾的“好书”“眼界”做了后一句的开头 | 好书 and 眼界, which end one clause, begin the next
小河流向大河，大河流向大海，大海连着远方。 | 前一句末尾的“大河”“大海”做了后一句的开头 | 大河 and 大海, which end one clause, begin the next
红杏枝头春意闹。 | “闹”本是听到的热闹，用来写看到的春色 | 闹, a sound of bustle, is used for the spring colours seen
微风吹来缕缕荷香，像远处飘来的若有若无的琴声。 | 把闻到的荷香写成听到的琴声 | the scent smelt is written as music heard
她的笑声甜甜的，像刚从罐子里舀出来的蜂蜜。 | 把听到的笑声写成尝到的甜味 | laughter heard is written as sweetness tasted
那一声汽笛又冷又硬，划破了清晨的寂静。 | 把听到的汽笛声写成摸得到的冷和硬 | a whistle heard is written as something cold and hard to the touch
秦时明月汉时关。 | “秦”“汉”互相补充，意思是秦汉时的明月、秦汉时的关 | 秦 and 汉 complete each other: the moon and the pass of Qin and Han both
主人下马客在船。 | “主人”“客”互相补充，意思是主人和客人一起下马、上船 | 主人 and 客 complete each other: host and guest both dismount and board
烟笼寒水月笼沙。 | “烟”“月”互相补充，意思是烟和月光笼罩着寒水和沙 | 烟 and 月 complete each other: mist and moonlight both veil the water and the sand
将军百战死，壮士十年归。 | 两句互相补充，意思是将军和壮士身经百战，有的战死，有的多年后归来 | the lines complete each other: generals and soldiers alike fought long, some died, some came home
东边日出西边雨，道是无晴却有晴。 | “晴”同“情”音，表面说天晴，内里说感情 | 晴, fine weather, sounds like 情, love: it says one and means the other
春蚕到死丝方尽，蜡炬成灰泪始干。 | “丝”同“思”音，表面说蚕丝，内里说思念 | 丝, silk, sounds like 思, longing: it says one and means the other
早知潮有信，嫁与弄潮儿。 | “信”既指潮水准时，又指守信用，一词两义 | 信 means both the tide coming on time and keeping faith: two meanings at once
理发店门口的招牌上写着四个大字：从头做起。 | “从头”既指头发，又指从开始做起，一语两义 | 从头 means both the head of hair and the very beginning: two meanings at once
这位“大忙人”一个上午都躺在沙发上看电视。 | 说他是“大忙人”，其实他整个上午都闲着 | he is called 大忙人, very busy, but he idles all morning
你可真“勤快”，作业拖了一个星期还没动笔。 | 说他“勤快”，其实他拖了一个星期 | he is called 勤快, diligent, but he has put it off a week
好一个“聪明”的办法，结果把事情弄得更糟了。 | 说办法“聪明”，其实它把事情弄得更糟 | the plan is called 聪明, clever, but it makes things worse
他这个“守时”的人，又迟到了半个小时。 | 说他“守时”，其实他又迟到了 | he is called 守时, punctual, but he is late again
`,
    3,
  ).map(([sentence, zh, en]) => [sentence!, t(en!, zh!)]),
);

/** clueOfDevice is what shows the device of a rhetoric sentence. */
const clueOfDevice = (sentence: string): Text => {
  const c = CLUES.get(sentence);
  if (!c) throw new Error(`rhetoric: no clue for ${sentence}`);
  return c;
};

/** deviceTopic builds a rhetoric topic from four devices and four sentences of each, with the mistake to watch for. */
function deviceTopic(
  grade: number,
  id: string,
  title: Text,
  devices: readonly Device[],
  sentences: Readonly<Record<string, readonly string[]>>,
  watch: Text,
): DrillData {
  const names = devices.map((d) => d.name);
  const of = new Map(devices.flatMap((d) => (sentences[d.name] ?? []).map((s) => [s, d] as const)));
  const all = [...of.keys()];
  const byName = new Map(devices.map((d) => [d.name, d]));
  const device = (name: string): Device => byName.get(name)!;
  const test = (name: string): Text => DEVICE_TEST[name]!;
  const list = devices.map((d) => `- **${d.name}**：${d.mark["zh-CN"]}`).join("\n");
  const listEn = devices.map((d) => `- **${d.name}** (${d.en}): ${d.mark.en}`).join("\n");
  const firsts = devices.map((d) => [d, sentences[d.name]![0]!] as const);
  const [d0, s0] = firsts[0]!;
  const c0 = clueOfDevice(s0);
  const callout = t(`> **Watch out.** ${watch.en}`, `> **注意。** ${watch["zh-CN"]}`);
  const explanation = t(
    `Each device works in its own way:\n\n${listEn}\n\nFor example, in ${s0} ${c0.en}: that is ${d0.name}, ${d0.en}.\n\n${callout.en}`,
    `每种修辞手法都有自己的特点：\n\n${list}\n\n例如：${s0}这个句子${c0["zh-CN"]}，用的是${d0.name}。\n\n${callout["zh-CN"]}`,
  );
  const intro = t(
    `A rhetorical device is a way of saying something that makes it strike the reader. This topic teaches four, each with its own mark. One sentence of each:\n\n${firsts.map(([d, x]) => `- ${x} ${d.name}, ${d.en}: ${clueOfDevice(x).en}.`).join("\n")}\n\nThe first knowledge point names the device a sentence uses; the second finds the sentence that uses a device.`,
    `修辞手法是让话说得更生动、更有力的方法。这个专题学习四种，各有特点。每种看一个句子：\n\n${firsts.map(([d, x]) => `- ${x}${d.name}：${clueOfDevice(x)["zh-CN"]}。`).join("\n")}\n\n第一个知识点判断句子用了什么修辞手法，第二个找出用了某种修辞手法的句子。`,
  );
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
    intro,
    points: [
      {
        suffix: "naming",
        title: t("Naming the Device", "判断修辞手法"),
        explanation,
        question: t("Which rhetorical device does this sentence use?", "这个句子用了什么修辞手法？"),
        items: named,
        why: (right, shown) => {
          const d = device(right);
          const c = clueOfDevice(shown);
          return t(
            `**Step 1: see what the sentence does.** Here ${c.en}.\n\n**Step 2: name the device.** That is ${right}, ${d.en}: it ${d.mark.en}.\n\n**Check.** ${test(right).en}`,
            `**第一步：看句子是怎么写的。**这个句子${c["zh-CN"]}。\n\n**第二步：说出修辞手法。**这是${right}：${d.mark["zh-CN"]}。\n\n**检验。** ${test(right)["zh-CN"]}`,
          );
        },
        whyNot: (wrong, _right, shown) => {
          const d = device(wrong);
          const c = clueOfDevice(shown);
          return t(
            `${wrong}, ${d.en}, ${d.mark.en}; this sentence does not: ${c.en}.`,
            `${wrong}的特点是${d.mark["zh-CN"]}；这个句子不是这样，它${c["zh-CN"]}。`,
          );
        },
      },
      {
        suffix: "finding",
        title: t("Finding the Device", "找出修辞手法"),
        explanation,
        question: t("Which sentence uses this rhetorical device?", "哪个句子用了这种修辞手法？"),
        items: found,
        show: (name) => t(`${name} (${device(name).en})`, name),
        why: (right, shown) => {
          const d = device(shown);
          const c = clueOfDevice(right);
          return t(
            `**Step 1: recall the device.** ${shown}, ${d.en}, ${d.mark.en}.\n\n**Step 2: find the sentence that does so.** In ${right} ${c.en}.\n\n**Check.** ${test(shown).en}`,
            `**第一步：想想这种修辞手法的特点。**${shown}：${d.mark["zh-CN"]}。\n\n**第二步：找出这样写的句子。**${right}这个句子${c["zh-CN"]}。\n\n**检验。** ${test(shown)["zh-CN"]}`,
          );
        },
        whyNot: (wrong) => {
          const c = clueOfDevice(wrong);
          return about(wrong, t(`it uses ${nameOf(wrong)} instead: ${c.en}.`, `它用的是${nameOf(wrong)}：${c["zh-CN"]}。`));
        },
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
  t(
    "像 does not always make a simile. 他长得像他爸爸 compares two of the same kind, people, and is no 比喻: a simile likens things of different kinds.",
    "有“像”不一定是比喻。“他长得像他爸爸”比较的是同类的人，不是比喻；比喻要用不同的事物来比。",
  ),
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
  t(
    "设问 and 反问 both ask. 设问 answers its own question at once; 反问 gives no answer, because the answer is already in the question.",
    "设问和反问都用问句。设问紧接着自己回答；反问不回答，因为答案就在问句里。",
  ),
);

const rhetoricThree = deviceTopic(
  7,
  "rhetoric-3",
  t("Rhetoric: Metonymy, Contrast, Quotation, Anadiplosis", "修辞：借代、对比、引用、顶真"),
  [
    {
      name: "借代",
      en: "metonymy",
      mark: t(
        "names a thing by something closely tied to it instead of by its own name",
        "不直接说出要说的人或事物，而用和它密切相关的事物来代替",
      ),
    },
    {
      name: "对比",
      en: "contrast",
      mark: t(
        "sets two opposite things, or two sides of one thing, against each other",
        "把两种相反或不同的事物，或者一种事物的两个方面放在一起比较",
      ),
    },
    {
      name: "引用",
      en: "quotation",
      mark: t("quotes a line of poetry, a saying or a proverb to make a point", "引用诗句、名言、俗语或典故来说明道理"),
    },
    {
      name: "顶真",
      en: "anadiplosis",
      mark: t(
        "begins a clause with the word that ended the one before, linking them end to head",
        "用前一句结尾的词语作为后一句的开头，使句子首尾相连",
      ),
    },
  ],
  {
    借代: [
      "红领巾们排着整齐的队伍走进了博物馆。",
      "满屋子的白大褂都在忙着抢救病人。",
      "他一口气读完了三本鲁迅。",
      "黄发垂髫，并怡然自乐。",
    ],
    对比: [
      "朱门酒肉臭，路有冻死骨。",
      "过去这里是一片荒滩，如今已经变成了绿树成荫的公园。",
      "懒惰的人抱怨时间太少，勤奋的人却总能挤出时间读书。",
      "城里灯火通明，热闹非凡；村子里却一片漆黑，静悄悄的。",
    ],
    引用: [
      "古人说：“三人行，必有我师焉。”我们要虚心向别人学习。",
      "“少壮不努力，老大徒伤悲。”我们要珍惜青春时光。",
      "俗话说：“一分耕耘，一分收获。”他的好成绩是用汗水换来的。",
      "“海内存知己，天涯若比邻。”朋友虽然远在他乡，我们的心却连在一起。",
    ],
    顶真: [
      "山上有座庙，庙里有个老和尚，老和尚在给小和尚讲故事。",
      "知识来自学习，学习需要坚持，坚持才能成功。",
      "我们要多读好书，好书能开阔眼界，眼界开阔了，心胸也就宽广了。",
      "小河流向大河，大河流向大海，大海连着远方。",
    ],
  },
  t(
    "引用 quotes words someone else made; 借代 names a thing by what goes with it. 三本鲁迅 quotes nothing: 鲁迅 stands for his books.",
    "引用是引别人说过的话；借代是用相关的事物代替本来的事物。“三本鲁迅”并没有引用什么，“鲁迅”代替的是他的书。",
  ),
);

// Rhetoric of senior secondary school, grade 10: the required course.
const rhetoricFour = deviceTopic(
  10,
  "rhetoric-4",
  t("Rhetoric: Synaesthesia, Paired Phrasing, Double Meaning, Irony", "修辞：通感、互文、双关、反语"),
  [
    {
      name: "通感",
      en: "synaesthesia",
      mark: t(
        "describes what one sense takes in with the words of another, a sound that is sweet or a scent like music",
        "用一种感官的感受去写另一种感官的感受，比如把声音写得有味道，把香气写得像音乐",
      ),
    },
    {
      name: "互文",
      en: "paired phrasing",
      mark: t(
        "splits one meaning over two phrases that complete each other, to be read together",
        "上下两句或一句中的两部分意思互相补充，合起来理解才完整",
      ),
    },
    {
      name: "双关",
      en: "double meaning",
      mark: t(
        "uses a word that sounds like or means two things at once, saying one and meaning the other",
        "利用词语同音或多义，让一句话同时有表面和内里两层意思",
      ),
    },
    {
      name: "反语",
      en: "irony",
      mark: t("says the opposite of what is meant, often to mock or criticize", "故意说和本意相反的话，常常带有讽刺或批评"),
    },
  ],
  {
    通感: [
      "红杏枝头春意闹。",
      "微风吹来缕缕荷香，像远处飘来的若有若无的琴声。",
      "她的笑声甜甜的，像刚从罐子里舀出来的蜂蜜。",
      "那一声汽笛又冷又硬，划破了清晨的寂静。",
    ],
    互文: ["秦时明月汉时关。", "主人下马客在船。", "烟笼寒水月笼沙。", "将军百战死，壮士十年归。"],
    双关: [
      "东边日出西边雨，道是无晴却有晴。",
      "春蚕到死丝方尽，蜡炬成灰泪始干。",
      "早知潮有信，嫁与弄潮儿。",
      "理发店门口的招牌上写着四个大字：从头做起。",
    ],
    反语: [
      "这位“大忙人”一个上午都躺在沙发上看电视。",
      "你可真“勤快”，作业拖了一个星期还没动笔。",
      "好一个“聪明”的办法，结果把事情弄得更糟了。",
      "他这个“守时”的人，又迟到了半个小时。",
    ],
  },
  t(
    "互文 is not read phrase by phrase. 秦时明月汉时关 does not give the moon to Qin and the pass to Han: both belong to both.",
    "互文不能一句一句分开理解。“秦时明月汉时关”不是秦朝的月、汉朝的关，而是秦汉时的明月和关。",
  ),
);

/** drillData are the drill topics, by kind, each kind in order. */
export const drillData: Readonly<Record<"connectives" | "sentences" | "rhetoric", readonly DrillData[]>> = {
  connectives: [connectivesOne, connectivesTwo],
  sentences: [sentencesBaBei, sentencesRhetorical, sentencesReported],
  rhetoric: [rhetoricOne, rhetoricTwo, rhetoricThree, rhetoricFour],
};
