// The drills of classical language (文言) in grades 5 to 9 (docs/chinese-curriculum.md §7): content words and whole
// sentences put into modern Chinese in grades 5, 7 and 9, the function words 之, 而, 以 and 于 in grade 6, 其 and 为 in
// grade 8, and borrowed characters in grade 9. Every sentence is from
// a classical text in the public domain, most of them from the passages recited in these grades; the meanings, the
// translations and the wrong answers are written for this subject.

import { t } from "@ga/content";

import { type DrillItem, type DrillSpec, drillItem, lines } from "../grammar/drill.ts";

/** ClassicalDrill is a drill topic of classical language without its prerequisites, and its grade. */
export type ClassicalDrill = Omit<DrillSpec, "prerequisites" | "strand"> & { readonly grade: number };

/** items reads lines of a shown sentence, its right answer and three wrong ones. */
const items = (data: string): readonly DrillItem[] =>
  lines(data, 5).map(([shown, right, a, b, c]) => drillItem(shown!, right!, [a!, b!, c!]));

/** others are the usages of a word other than one, which are the wrong answers when that one is right. */
function others(all: readonly string[], one: string): [string, string, string] {
  const rest = all.filter((u) => u !== one);
  if (rest.length !== 3) throw new Error(`classical drill: ${one} among ${all.join("、")}`);
  return rest as [string, string, string];
}

/** usages reads lines of a shown sentence and the number of its usage among a word's four. */
const usages = (data: string, all: readonly string[]): readonly DrillItem[] =>
  lines(data, 2).map(([shown, n]) => {
    const right = all[Number(n)];
    if (right === undefined) throw new Error(`classical drill: usage ${n} of ${shown}`);
    return drillItem(shown!, right, others(all, right));
  });

/** marked takes a shown sentence apart into the sentence and the character in brackets after it. */
function marked(shown: string): readonly [string, string] {
  const m = /^(.*)（(.)）$/u.exec(shown);
  if (!m) throw new Error(`classical drill: no character in brackets in ${shown}`);
  return [m[1]!, m[2]!];
}

/** usageWhy explains the meaning or usage of the character in brackets of a sentence. */
const usageWhy = (right: string, shown: string) => {
  const [sentence, char] = marked(shown);
  return t(`In ${sentence}, ${char} is: ${right}.`, `在“${sentence}”中，“${char}”是：${right}。`);
};

const contentWords = items(`
兔走触株（走） | 跑 | 行走 | 离开 | 前往
因释其耒而守株（释） | 放下 | 解释 | 释放 | 拿起
冀复得兔（冀） | 希望 | 害怕 | 打算 | 等待
冀复得兔（复） | 再，又 | 回复 | 恢复 | 重复
而身为宋国笑（笑） | 嘲笑 | 微笑 | 欢笑 | 笑话
甚聪惠（惠） | 同“慧”，聪明 | 恩惠 | 实惠 | 优惠
孔君平诣其父（诣） | 拜访 | 告诉 | 询问 | 寻找
为设果（设） | 摆放，摆出 | 设计 | 假设 | 建设
未闻孔雀是夫子家禽（闻） | 听说 | 闻到 | 新闻 | 看见
夏月则练囊盛数十萤火以照书（盛） | 装 | 茂盛 | 盛大 | 旺盛
胤恭勤不倦（倦） | 懈怠 | 卷起 | 休息 | 害怕
学而时习之（习） | 温习 | 习惯 | 风俗 | 学会
温故而知新（故） | 旧的知识 | 故事 | 缘故 | 故意
兔不可复得（得） | 得到 | 必须 | 得意 | 获胜
`);

const sentences = items(`
兔走触株，折颈而死 | 一只兔子奔跑着撞到树桩上，折断脖子死了 | 一只兔子走到树桩旁，被人折断脖子打死了 | 一只兔子跑来碰到树桩，吓得摔倒在地 | 一只兔子在树桩旁行走，扭伤了脖子
因释其耒而守株 | 于是放下他的农具，守在树桩旁边 | 因为解释他的农具而守着树桩 | 于是拿起农具去砍那个树桩 | 因此把农具放在树桩上守着田地
兔不可复得，而身为宋国笑 | 兔子不可能再得到，他自己却被宋国人嘲笑 | 兔子不能回来了，他身边的宋国人都在笑 | 兔子没有再得到，他为宋国人讲了笑话 | 兔子不会再来了，他觉得宋国人很好笑
孔君平诣其父，父不在 | 孔君平去拜访孩子的父亲，父亲不在家 | 孔君平告诉孩子的父亲，父亲不在家 | 孔君平是孩子的父亲，可他不在家 | 孔君平去找他的父亲，父亲不在乎
此是君家果 | 这是你家的水果 | 这是君王家的水果 | 这是你家种的果树 | 这是孔君平家的水果
未闻孔雀是夫子家禽 | 没有听说孔雀是您家的鸟 | 没有闻到孔雀是您家的鸟 | 还没听说孔雀是孔子家的鸟 | 孔雀不是夫子家养的家禽
家贫不常得油 | 家里贫穷，不能经常得到灯油 | 家里贫穷，常常不吃油 | 家里贫穷，不常用油做饭 | 家里贫穷，从来没有得到过油
以夜继日焉 | 用夜晚接着白天读书 | 晚上睡觉，白天继续读书 | 从夜晚一直等到白天 | 用夜晚的时间代替白天休息
学而时习之 | 学了又按时温习它 | 学习的时候要练习 | 学习了很长时间才学会 | 学过以后时常忘记它
温故而知新 | 温习旧的知识，从而得到新的理解 | 温暖故乡，才能知道新的事情 | 复习故事，就能写出新的故事 | 温习旧知识，然后丢掉它去学新知识
宋人有耕者 | 宋国有个种田的人 | 宋国人都会种田 | 宋朝有一个种田的人 | 姓宋的人有一块耕地
乃呼儿出 | 就把孩子叫了出来 | 于是孩子呼喊着出来 | 才叫来孩子的父亲 | 就叫孩子出去
`);

const ZHI = ["代词，代指人或事物", "助词，相当于“的”", "动词，到、往", "助词，不译"];

const zhi = usages(
  `
学而时习之（之） | 0
一人虽听之（之） | 0
思援弓缴而射之（之） | 0
问之，曰：“欲作针。”（之） | 0
择其善者而从之（之） | 0
通国之善弈者也（之） | 1
梁国杨氏之子（之） | 1
吾盾之坚，物莫能陷也（之） | 3
吾矛之利，于物无不陷也（之） | 3
黄鹤楼送孟浩然之广陵（之） | 2
吾欲之南海（之） | 2
`,
  ZHI,
);

const ER = ["表示顺承，可译为“就”“然后”", "表示转折，可译为“却”“但是”", "表示修饰，可译为“地”“着”", "表示并列，可译为“而且”"];
const YI = ["用，拿", "认为", "用来，来", "因为"];
const YU = ["比", "在", "对，对于", "从"];

const erYiYu = [
  ...usages(
    `
因释其耒而守株（而） | 0
而身为宋国笑（而） | 1
温故而知新（而） | 0
人不知而不愠（而） | 1
`,
    ER,
  ),
  ...usages(
    `
一心以为有鸿鹄将至（以） | 1
夏月则练囊盛数十萤火以照书（以） | 2
以夜继日焉（以） | 0
以子之矛，陷子之盾（以） | 0
不以物喜，不以己悲（以） | 3
`,
    YI,
  ),
  ...usages(
    `
霜叶红于二月花（于） | 0
苛政猛于虎也（于） | 0
吾矛之利，于物无不陷也（于） | 2
战于长勺（于） | 1
青，取之于蓝（于） | 3
`,
    YU,
  ),
];

const juniorWords = items(`
陈太丘与友期行（期） | 约定 | 期望 | 日期 | 时期
太丘舍去（舍） | 舍弃，丢下 | 房舍 | 宿舍 | 施舍
尊君在不（不） | 同“否”，表示询问 | 不是 | 没有 | 不要
相委而去（委） | 丢下，舍弃 | 委托 | 委屈 | 委员
下车引之（引） | 拉 | 引导 | 引用 | 吸引
元方入门不顾（顾） | 回头看 | 照顾 | 顾客 | 顾虑
撒盐空中差可拟（拟） | 相比 | 拟定 | 模拟 | 打算
未若柳絮因风起（因） | 凭借，趁着 | 因为 | 原因 | 因此
非淡泊无以明志（明） | 明确 | 明亮 | 明天 | 聪明
卿今当涂掌事（涂） | 同“途”，道路，这里指仕途 | 涂抹 | 糊涂 | 涂改
孰若孤（孰） | 谁，哪个 | 熟悉 | 成熟 | 仔细
即更刮目相待（更） | 另，重新 | 更加 | 更换 | 打更
但微颔之（颔） | 点头 | 下巴 | 摇头 | 弯腰
公亦以此自矜（矜） | 夸耀 | 怜悯 | 拘谨 | 谨慎
无案牍之劳形（形） | 形体，身体 | 形状 | 形式 | 形容
陶后鲜有闻（鲜） | 少 | 新鲜 | 鲜艳 | 鲜美
`);

const juniorSentences = items(`
待君久不至，已去 | 等您很久您都没来，他已经走了 | 等了很久您不来，就让您走了 | 您等了很久他都没来，已经离开了 | 等待您的时间很长，现在要出去
友人惭，下车引之 | 朋友感到惭愧，下车想去拉元方 | 朋友很生气，下车把元方引开 | 朋友很惭愧，下车引导元方进门 | 朋友惭愧地下了车，引来了元方
撒盐空中差可拟 | 和把盐撒在空中差不多可以相比 | 把盐撒在空中，差别可以比较 | 在空中撒盐，差一点可以模仿 | 撒在空中的盐，差不多都落下了
非淡泊无以明志 | 不恬淡寡欲就无法明确志向 | 不淡泊名利就没有明天的志向 | 不喝淡水就没有办法明白志向 | 淡泊的人没有远大的志向
卿今当涂掌事，不可不学 | 你现在身居要职，掌管大事，不可以不学习 | 你现在正在涂抹，掌管事务，不能不学 | 你今天在路上掌管事情，可以不学 | 你应当在路上掌管事情，不可以学习
士别三日，即更刮目相待 | 读书人分别几天，就要重新另眼相看 | 读书人分别三天，就更要刮擦眼睛对待 | 士兵分别三天，立刻更换眼光对待他 | 读书人离别三天，马上就更加看不起他
无他，但手熟尔 | 没有别的奥妙，只不过是手法熟练罢了 | 没有他，只是手很熟悉你 | 他没有什么，但是手熟了 | 没有别人，只有你的手熟练
斯是陋室，惟吾德馨 | 这是简陋的屋子，只是我的品德高尚 | 这间屋子简陋，只有我的德行是香的 | 这是陋室，我的德行也很简陋 | 斯先生的屋子简陋，只有我品德好
何陋之有 | 有什么简陋的呢 | 什么简陋的东西都有 | 为什么会有简陋的东西 | 简陋的地方在哪里
可远观而不可亵玩焉 | 只能远远地观赏，却不能靠近玩弄 | 可以远远地看，也可以拿来玩耍 | 可以远看，也可以近玩 | 远看可以，近看就不好看了
吾射不亦精乎 | 我的箭法不是很高明吗 | 我射箭不也精通了吗，你也一样 | 我射得不精确吗 | 我也射得不精
宜乎众矣 | 当然很多了 | 应该大众都喜欢 | 适宜众人 | 众人都很合适
`);

const QI = ["代词，他（们）的、它（们）的", "代词，他（们）、它（们）", "副词，表示反问或推测，难道、恐怕", "代词，其中的"];
const WEI = ["动词，做、作为、成为", "介词，替、给、对", "介词，被", "动词，是"];

const qiWei = [
  ...usages(
    `
复前行，欲穷其林（其） | 0
问其姓氏（其） | 0
吾视其辙乱（其） | 0
食之不能尽其材（其） | 0
其真无马邪（其） | 2
其真不知马也（其） | 2
其如土石何（其） | 2
安求其能千里也（其） | 1
不知其能千里而食也（其） | 1
其一犬坐于前（其） | 3
择其善者而从之（其） | 3
`,
    QI,
  ),
  ...usages(
    `
武陵人捕鱼为业（为） | 0
为坻，为屿，为嵁，为岩（为） | 0
不为苟得也（为） | 0
此人一一为具言所闻（为） | 1
不足为外人道也（为） | 1
为人谋而不忠乎（为） | 1
而身为宋国笑（为） | 2
身死人手，为天下笑者（为） | 2
知之为知之，不知为不知（为） | 3
中峨冠而多髯者为东坡（为） | 3
`,
    WEI,
  ),
];

const eighthWords = items(`
略无阙处（阙） | 同“缺”，空缺 | 宫阙 | 城楼 | 缺点
不见曦月（曦） | 阳光，这里指太阳 | 月光 | 星光 | 早晨
沿溯阻绝（溯） | 逆流而上 | 顺流而下 | 追溯 | 回忆
虽乘奔御风（奔） | 飞奔的快马 | 奔跑 | 投奔 | 逃跑
属引凄异（属） | 连接 | 属于 | 同“嘱”，嘱托 | 家属
晓雾将歇（歇） | 消散 | 休息 | 歇脚 | 睡觉
夕日欲颓（颓） | 坠落 | 颓废 | 倒塌 | 衰败
盖竹柏影也（盖） | 原来是 | 盖子 | 遮盖 | 建造
互相轩邈（邈） | 远 | 渺小 | 模糊 | 美貌
窥谷忘反（反） | 同“返”，返回 | 反对 | 相反 | 反复
策之不以其道（策） | 用鞭子打，驱使 | 计策 | 策划 | 政策
一食或尽粟一石（或） | 有时 | 或者 | 也许 | 有人
域民不以封疆之界（域） | 限制 | 区域 | 领域 | 疆域
讲信修睦（修） | 培养 | 修理 | 修建 | 修改
`);

const borrowed = items(`
便要还家（要） | 同“邀”，邀请 | 要求 | 重要 | 同“腰”，腰部
才美不外见（见） | 同“现”，表现 | 看见 | 见解 | 拜见
食马者不知其能千里而食也（食） | 同“饲”，喂 | 吃 | 粮食 | 食物
其真无马邪（邪） | 同“耶”，表示疑问，吗 | 邪恶 | 不正 | 奇怪
万钟则不辩礼义而受之（辩） | 同“辨”，辨别 | 辩论 | 辩护 | 争辩
所识穷乏者得我与（得） | 同“德”，感激 | 得到 | 必须 | 得意
乡为身死而不受（乡） | 同“向”，从前 | 家乡 | 乡村 | 乡亲
故患有所不辟也（辟） | 同“避”，躲避 | 开辟 | 精辟 | 复辟
亲戚畔之（畔） | 同“叛”，背叛 | 旁边 | 田界 | 河岸
百废具兴（具） | 同“俱”，全，都 | 工具 | 具备 | 具体
属予作文以记之（属） | 同“嘱”，嘱托 | 属于 | 家属 | 类别
曾益其所不能（曾） | 同“增”，增加 | 曾经 | 竟然 | 姓曾
衡于虑（衡） | 同“横”，梗塞，不顺 | 平衡 | 衡量 | 秤杆
选贤与能（与） | 同“举”，选举 | 和 | 给予 | 参与
`);

const ninthSentences = items(`
不足为外人道也 | 不值得对外面的人说 | 不足以作为外人的道路 | 不满足于对外人说 | 外面的人不知道这里的道理
黄发垂髫，并怡然自乐 | 老人和孩子都安闲快乐，自得其乐 | 黄头发的人垂着头，一起快乐 | 头发黄的孩子垂下头，并且自己玩 | 老人垂着头发，自己高兴
肉食者鄙，未能远谋 | 当权的人目光短浅，不能深谋远虑 | 吃肉的人很粗鄙，不能谋划远方的事 | 吃肉的人看不起别人，没有远大的谋略 | 当权的人鄙视远方的计谋
一鼓作气，再而衰，三而竭 | 第一次击鼓能振作士气，第二次士气就衰退，第三次士气就耗尽了 | 一面鼓发出声音，两面鼓就衰弱，三面鼓就竭尽 | 一打鼓就生气，再打就衰老，第三次就枯竭 | 第一次打鼓有勇气，第二次还有，第三次更多
不以物喜，不以己悲 | 不因为外物的好坏和自己的得失而或喜或悲 | 不拿东西来使人高兴，不拿自己来使人悲伤 | 不喜欢物品，也不为自己悲伤 | 不因为有东西而高兴，却因为自己而悲伤
先天下之忧而忧，后天下之乐而乐 | 在天下人忧愁之前先忧愁，在天下人快乐之后才快乐 | 先为天下忧愁，然后让天下快乐 | 天下人先忧愁，然后我才快乐 | 在天下人快乐之前先快乐，在天下人忧愁之后再忧愁
醉翁之意不在酒，在乎山水之间也 | 醉翁的心意不在喝酒，而在于欣赏山水的美景 | 醉翁的意思是不喝酒，只在山水之间喝 | 喝醉的老人不想喝酒，想去山水之间 | 醉翁的意思不在酒里，而在乎山水好不好
二者不可得兼，舍生而取义者也 | 两样不能同时得到，就舍弃生命而选取道义 | 两个人不能都得到，就舍弃生活而取得义气 | 两者不能兼顾，就离开学生去拿正义 | 两样都得不到，就舍去生的选熟的
此之谓失其本心 | 这就叫作丧失了人本来的天性 | 这就是说他失去了本来的心思 | 这叫作他的心丢失了 | 这是说他失去了本钱
由此观之，王之蔽甚矣 | 由此看来，大王受蒙蔽很深了 | 从这里观察，大王的遮蔽物很多 | 由此看到，大王庇护了很多人 | 从这里看出，大王非常厉害
令初下，群臣进谏，门庭若市 | 命令刚下达，许多大臣都来进言规劝，宫门和院子里像集市一样热闹 | 命令刚下，大臣们进门劝谏，门前庭院像一座城市 | 命令下了，大臣们都去集市上进言 | 命令开始下达，大臣们进宫劝谏，门庭冷落像散了的集市
噫！微斯人，吾谁与归 | 唉！如果没有这种人，我同谁一道呢 | 唉！这个人很微小，我和谁一起回家 | 唉！微笑的人，我跟谁回去 | 唉！没有这个人，谁会归还给我
`);

/** classicalDrills are the drill topics of classical language, in the order they are taught. */
export const classicalDrills: readonly ClassicalDrill[] = [
  {
    grade: 5,
    id: "classical-words-5-01",
    title: t("Classical Chinese: Words and Sentences", "文言文：字词和句子"),
    summary: t(
      "The meaning of a content word in a classical sentence, and a classical sentence in modern Chinese.",
      "文言句子中实词的意思，以及把文言句子翻译成现代汉语。",
    ),
    points: [
      {
        suffix: "meaning",
        title: t("Content Words", "文言实词"),
        explanation: t(
          "A character of classical Chinese often means something other than the word it makes today: 去 is to leave, 汤 is hot water, 兵 is a weapon. Read the whole sentence, then ask what the character must mean in it.",
          "文言文中的字常常和今天的意思不一样：“去”是离开，“汤”是热水，“兵”是兵器。先读懂整句话，再想一想这个字在句中应该是什么意思。",
        ),
        question: t("What does the character in brackets mean in this sentence?", "括号里的字在这句话中是什么意思？"),
        items: contentWords,
        why: usageWhy,
      },
      {
        suffix: "sentences",
        title: t("Putting Sentences into Modern Chinese", "翻译句子"),
        explanation: t(
          "To put a classical sentence into modern Chinese, give every character its meaning in the sentence, keep the order of the sentence, and add only the words modern Chinese needs: 未成，弃去 is 学业没有完成，就放弃离开了.",
          "把文言句子翻译成现代汉语，要落实每个字在句中的意思，保持句子的顺序，只补上现代汉语需要的词：“未成，弃去”就是“学业没有完成，就放弃离开了”。",
        ),
        question: t("Which is the right modern Chinese for this sentence?", "这句话翻译成现代汉语，哪一项正确？"),
        items: sentences,
        why: (right, shown) => t(`${shown} means: ${right}.`, `“${shown}”的意思是：${right}。`),
      },
    ],
  },
  {
    grade: 6,
    id: "classical-function-words-6-01",
    title: t("Classical Chinese: Function Words", "文言文：虚词"),
    summary: t("The usages of 之, 而, 以 and 于 in classical sentences.", "文言句子中“之”“而”“以”“于”的用法。"),
    points: [
      {
        suffix: "zhi",
        title: t("The Usages of 之", "“之”的用法"),
        explanation: t(
          `之 has four common usages:\n\n- ${ZHI[0]}: 知之为知之, where 之 is what one knows\n- ${ZHI[1]}: 小大之狱, cases great and small\n- ${ZHI[2]}: 辍耕之垄上, going to the ridge of the field\n- ${ZHI[3]}: 予独爱莲之出淤泥而不染, between a subject and what is said of it`,
          `“之”常见的用法有四种：\n\n- ${ZHI[0]}：知之为知之，“之”指知道的事\n- ${ZHI[1]}：小大之狱，大大小小的案件\n- ${ZHI[2]}：辍耕之垄上，到田埂上去\n- ${ZHI[3]}：予独爱莲之出淤泥而不染，用在主语和谓语之间`,
        ),
        question: t("What is the usage of 之 in this sentence?", "“之”在这句话中是什么用法？"),
        items: zhi,
        why: usageWhy,
      },
      {
        suffix: "er-yi-yu",
        title: t("The Usages of 而, 以 and 于", "“而”“以”“于”的用法"),
        explanation: t(
          `而 joins two parts: ${ER.join("; ")}.\n\n以: ${YI.join("; ")}.\n\n于: ${YU.join("; ")}.\n\nFirst see what the two parts of the sentence are, then which usage joins them.`,
          `“而”连接前后两部分：${ER.join("；")}。\n\n“以”：${YI.join("；")}。\n\n“于”：${YU.join("；")}。\n\n先看清句子前后两部分的关系，再判断是哪一种用法。`,
        ),
        question: t("What is the usage of the character in brackets in this sentence?", "括号里的字在这句话中是什么用法？"),
        items: erYiYu,
        why: usageWhy,
      },
    ],
  },
  {
    grade: 7,
    id: "classical-words-7-01",
    title: t("Classical Chinese: Words and Sentences of Grade 7", "文言文：七年级字词和句子"),
    summary: t(
      "Content words of the classical passages of grade 7, and their sentences in modern Chinese.",
      "七年级文言文中实词的意思，以及把句子翻译成现代汉语。",
    ),
    points: [
      {
        suffix: "meaning",
        title: t("Content Words", "文言实词"),
        explanation: t(
          "Many characters of classical Chinese keep a meaning modern Chinese has lost: 期 is to agree on a time, 顾 is to look back, 鲜 is few. Read the whole sentence, then choose the meaning that makes sense in it, not the commonest one today.",
          "许多文言字词保留着现代汉语已经不用的意思：“期”是约定，“顾”是回头看，“鲜”是少。先读懂整句话，再选出在句中讲得通的意思，而不是今天最常用的意思。",
        ),
        question: t("What does the character in brackets mean in this sentence?", "括号里的字在这句话中是什么意思？"),
        items: juniorWords,
        why: usageWhy,
      },
      {
        suffix: "sentences",
        title: t("Putting Sentences into Modern Chinese", "翻译句子"),
        explanation: t(
          "Translate every character, keep the order, and add only what modern Chinese needs. Watch the words whose meaning has changed: in 相委而去, 委 is to leave behind, not to entrust.",
          "翻译时要字字落实，保持语序，只补上现代汉语需要的成分。特别留意古今意思不同的词：“相委而去”的“委”是丢下，不是委托。",
        ),
        question: t("Which is the right modern Chinese for this sentence?", "这句话翻译成现代汉语，哪一项正确？"),
        items: juniorSentences,
        why: (right, shown) => t(`${shown} means: ${right}.`, `“${shown}”的意思是：${right}。`),
      },
    ],
  },
  {
    grade: 8,
    id: "classical-function-words-8-01",
    title: t("Classical Chinese: 其 and 为", "文言文：“其”和“为”"),
    summary: t("The usages of 其 and 为 in classical sentences.", "文言句子中“其”和“为”的用法。"),
    points: [
      {
        suffix: "qi-wei",
        title: t("The Usages of 其 and 为", "“其”和“为”的用法"),
        explanation: t(
          `其: ${QI.join("; ")}. Before a noun it is usually his or its; before a verb it is he or it; at the head of a question it asks or guesses.

为: ${WEI.join("; ")}. Before a noun of a person and a verb, it is for; before a person who acts on someone, it is by.`,
          `“其”：${QI.join("；")}。用在名词前多是“他的”“它的”，用在动词前多是“他”“它”，用在问句开头表示反问或推测。

“为”：${WEI.join("；")}。后面是人再接动词时多是“替”“给”；表示被动时是“被”。`,
        ),
        question: t("What is the usage of the character in brackets in this sentence?", "括号里的字在这句话中是什么用法？"),
        items: qiWei,
        why: usageWhy,
      },
      {
        suffix: "words",
        title: t("Content Words of Grade 8", "八年级文言实词"),
        explanation: t(
          "The passages of grade 8 use characters in meanings worth learning by heart: 阙 is a gap, 曦 the sun, 属 to join, 策 a whip and to whip. Read the sentence, then choose the meaning it needs.",
          "八年级的文言文里有一些值得记住的字义：“阙”是空缺，“曦”是阳光，“属”是连接，“策”是马鞭或用鞭子打。读懂句子，再选出它需要的意思。",
        ),
        question: t("What does the character in brackets mean in this sentence?", "括号里的字在这句话中是什么意思？"),
        items: eighthWords,
        why: usageWhy,
      },
    ],
  },
  {
    grade: 9,
    id: "classical-words-9-01",
    title: t("Classical Chinese: Borrowed Characters and Sentences", "文言文：通假字和句子"),
    summary: t(
      "Characters written for others that sound alike, and sentences of grade 9 in modern Chinese.",
      "通假字的本字和意思，以及把九年级文言句子翻译成现代汉语。",
    ),
    points: [
      {
        suffix: "borrowed",
        title: t("Borrowed Characters", "通假字"),
        explanation: t(
          "Classical texts sometimes write a character for another that sounded alike, its proper character: in 便要还家, 要 stands for 邀, to invite. If a character's usual meaning makes no sense, try a character that sounds like it.",
          "古书中有时用一个读音相同或相近的字代替本字，这就是通假字：“便要还家”的“要”通“邀”，是邀请的意思。如果一个字的常用意思讲不通，就想一想与它读音相近的字。",
        ),
        question: t("What does the character in brackets stand for, and mean, here?", "括号里的字在这句话中通什么字，是什么意思？"),
        items: borrowed,
        why: usageWhy,
      },
      {
        suffix: "sentences",
        title: t("Putting Sentences into Modern Chinese", "翻译句子"),
        explanation: t(
          "Longer sentences of grade 9 hold words used in old senses and set forms such as 何……之有 and 之谓. Translate every part, keep its order, and check that the whole makes sense.",
          "九年级的长句里有古义词和固定格式，如“何……之有”“此之谓”。翻译时要逐一落实，保持语序，最后检查整句是否通顺。",
        ),
        question: t("Which is the right modern Chinese for this sentence?", "这句话翻译成现代汉语，哪一项正确？"),
        items: ninthSentences,
        why: (right, shown) => t(`${shown} means: ${right}.`, `“${shown}”的意思是：${right}。`),
      },
    ],
  },
];
