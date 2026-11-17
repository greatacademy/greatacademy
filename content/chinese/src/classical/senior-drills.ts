// The drills of classical language (文言) in senior secondary school (docs/chinese-curriculum.md §7): the function words
// 乃, 且, 若, 焉, 何 and 乎 in the required course, 因, 与, 则, 所, 也 and 者 in the selective required course, the
// kinds of classical sentence, words used as another part of speech, and words whose meaning has changed. Every sentence
// is from a classical text in the public domain; the meanings and the wrong answers are written for this subject. Grade
// 10 is the required course and grade 11 the selective required one.

import { t } from "@ga/content";

import type { DrillItem } from "../grammar/drill.ts";
import { type ClassicalDrill, items, usages, usageWhy } from "./drills.ts";

const NAI = ["副词，于是、就", "副词，竟然、却", "副词，是、就是", "代词，你、你的"];
const QIE = ["连词，尚且", "副词，将要、将近", "连词，而且、并且", "副词，姑且、暂且"];
const RUO = ["连词，如果", "动词，像、如同", "代词，你、你们", "连词，至于（若夫）"];
const YAN = ["兼词，于此、在那里", "疑问代词，哪里、怎么", "语气词，表示陈述或疑问", "词尾，……的样子"];
const HE = ["疑问代词，什么", "疑问代词，为什么、怎么", "疑问代词，哪里", "副词，多么"];
const HU = ["语气词，表示疑问，吗", "语气词，表示反问，呢", "语气词，表示感叹，啊", "介词，相当于“于”"];
const YIN = ["连词，于是、就", "介词，凭借、通过", "介词，依照、顺着", "介词，趁着、趁机"];
const YU = ["介词或连词，和、跟、同", "动词，给予", "动词，参与", "语气词，同“欤”"];
const ZE = ["连词，就、那么", "连词，却、反而", "副词，是、就是", "连词，如果"];
const SUO = [
  "助词，和动词组成“所”字结构，……的人、……的事物",
  "名词，处所、地方",
  "助词，和“为”组成被动句",
  "助词，和“以”组成“所以”，表示原因或凭借",
];
const YE = ["语气词，表示判断", "语气词，表示疑问", "语气词，用在句中表示停顿", "语气词，表示感叹"];
const ZHE = [
  "助词，……的人、……的事物",
  "助词，用在主语后表示停顿，引出判断",
  "助词，用在时间词后，不译",
  "助词，用在数词后，指几种人或事物",
];

const nai = usages(
  `
乃不知有汉，无论魏晋（乃） | 1
今其智乃反不能及（乃） | 1
今君乃亡赵走燕（乃） | 1
乃重修岳阳楼（乃） | 0
乃记之而去（乃） | 0
乃使其从者衣褐（乃） | 0
乃设九宾礼于廷（乃） | 0
当立者乃公子扶苏（乃） | 2
嬴乃夷门抱关者也（乃） | 2
吕公女乃吕后也（乃） | 2
家祭无忘告乃翁（乃） | 3
余嘉乃勋（乃） | 3
`,
  NAI,
);

const qie = usages(
  `
臣死且不避，卮酒安足辞（且） | 0
且欲与常马等不可得（且） | 0
死马且买之五百金，况生马乎（且） | 0
北山愚公者，年且九十（且） | 1
不者，若属皆且为所虏（且） | 1
河水清且涟猗（且） | 2
道阻且长（且） | 2
存者且偷生，死者长已矣（且） | 3
且放白鹿青崖间（且） | 3
且将新火试新茶（且） | 3
`,
  QIE,
);

const ruo = usages(
  `
若舍郑以为东道主（若） | 0
若亡郑而有益于君（若） | 0
若事之不济，此乃天也（若） | 0
皆若空游无所依（若） | 1
日月之行，若出其中（若） | 1
星汉灿烂，若出其里（若） | 1
若入前为寿（若） | 2
吾翁即若翁（若） | 2
不者，若属皆且为所虏（若） | 2
若夫淫雨霏霏，连月不开（若） | 3
若夫日出而林霏开（若） | 3
`,
  RUO,
);

const yan = usages(
  `
积土成山，风雨兴焉（焉） | 0
积水成渊，蛟龙生焉（焉） | 0
三人行，必有我师焉（焉） | 0
然力足以至焉，于人为可讥（焉） | 0
且焉置土石（焉） | 1
焉用亡郑以陪邻（焉） | 1
未知生，焉知死（焉） | 1
寒暑易节，始一反焉（焉） | 2
肉食者谋之，又何间焉（焉） | 2
寡人之于国也，尽心焉耳矣（焉） | 2
盘盘焉，囷囷焉，蜂房水涡（焉） | 3
潸焉出涕（焉） | 3
`,
  YAN,
);

const he = usages(
  `
大王来何操（何） | 0
客何为者（何） | 0
何陋之有（何） | 0
然则何时而乐耶（何） | 0
肉食者谋之，又何间焉（何） | 1
徐公何能及君也（何） | 1
何不按兵束甲，北面而事之（何） | 1
何故怀瑾握瑜而自令见放为（何） | 1
今宵酒醒何处（何） | 2
何处望神州（何） | 2
何处是归程（何） | 2
水何澹澹（何） | 3
何其衰也（何） | 3
莲叶何田田（何） | 3
吏呼一何怒（何） | 3
`,
  HE,
);

const hu = usages(
  `
传不习乎（乎） | 0
齐桓、晋文之事可得闻乎（乎） | 0
客亦知夫水与月乎（乎） | 0
学而时习之，不亦说乎（乎） | 1
人不知而不愠，不亦君子乎（乎） | 1
王侯将相宁有种乎（乎） | 1
死马且买之五百金，况生马乎（乎） | 1
危乎高哉（乎） | 2
惜乎，子不遇时（乎） | 2
生乎吾前（乎） | 3
其闻道也固先乎吾（乎） | 3
浴乎沂，风乎舞雩（乎） | 3
君子博学而日参省乎己（乎） | 3
`,
  HU,
);

const yin = usages(
  `
因释其耒而守株（因） | 0
相如因持璧却立（因） | 0
因以为号焉（因） | 0
权因拔刀斫前奏案（因） | 0
因宾客至蔺相如门谢罪（因） | 1
因人之力而敝之，不仁（因） | 1
因河为池（因） | 1
因其固然（因） | 2
善战者因其势而利导之（因） | 2
不如因而厚遇之，使归赵（因） | 3
不如因善遇之（因） | 3
`,
  YIN,
);

const yu = usages(
  `
吾与汝毕力平险（与） | 0
臣与将军戮力而攻秦（与） | 0
与朋友交而不信乎（与） | 0
令将军与臣有郤（与） | 0
则与一生彘肩（与） | 1
则与斗卮酒（与） | 1
蹇叔之子与师（与） | 2
昔者仲尼与于蜡宾（与） | 2
是谁之过与（与） | 3
子非三闾大夫与（与） | 3
`,
  YU,
);

const ze = usages(
  `
学而不思则罔（则） | 0
居庙堂之高则忧其民（则） | 0
然则何时而乐耶（则） | 0
则与一生彘肩（则） | 0
穷则独善其身（则） | 0
于其身也，则耻师焉（则） | 1
此则岳阳楼之大观也（则） | 2
此则寡人之罪也（则） | 2
入则无法家拂士（则） | 3
出则无敌国外患者（则） | 3
`,
  ZE,
);

const suo = usages(
  `
鱼，我所欲也（所） | 0
所恶有甚于死者（所） | 0
道之所存，师之所存也（所） | 0
死而不失其所者久（所） | 1
雅颂各得其所（所） | 1
不者，若属皆且为所虏（所） | 2
为秦人积威之所劫（所） | 2
师者，所以传道受业解惑也（所） | 3
此世所以不传也（所） | 3
吾所以为此者，以先国家之急而后私仇也（所） | 3
所以遣将守关者，备他盗之出入与非常也（所） | 3
`,
  SUO,
);

const ye = usages(
  `
陈胜者，阳城人也（也） | 0
城北徐公，齐国之美丽者也（也） | 0
廉颇者，赵之良将也（也） | 0
寡人之民不加多，何也（也） | 1
何由知吾可也（也） | 1
其闻道也固先乎吾（也） | 2
师道之不传也久矣（也） | 2
寡人之于国也（也） | 2
何其衰也（也） | 3
甚矣，吾衰也（也） | 3
`,
  YE,
);

const zhe = usages(
  `
择其善者而从之（者） | 0
有好事者船载以入（者） | 0
通国之善弈者也（者） | 0
陈胜者，阳城人也（者） | 1
师者，所以传道受业解惑也（者） | 1
廉颇者，赵之良将也（者） | 1
昔者仲尼与于蜡宾（者） | 2
今者有小人之言（者） | 2
此三者，吾遗恨也（者） | 3
二者不可得兼（者） | 3
`,
  ZHE,
);

const KINDS = ["判断句", "被动句", "省略句", "倒装句"];
const INVERSIONS = ["宾语前置", "定语后置", "状语后置", "主谓倒装"];

const kinds = usages(
  `
城北徐公，齐国之美丽者也 | 0
廉颇者，赵之良将也 | 0
当立者乃公子扶苏 | 0
吾属今为之虏矣 | 1
信而见疑，忠而被谤 | 1
而君幸于赵王 | 1
吾不能举全吴之地，十万之众，受制于人 | 1
将军战河北，臣战河南 | 2
一鼓作气，再而衰，三而竭 | 2
竖子不足与谋 | 2
何陋之有 | 3
甚矣，汝之不惠 | 3
青，取之于蓝 | 3
求人可使报秦者 | 3
`,
  KINDS,
);

const inversions = usages(
  `
何陋之有 | 0
沛公安在 | 0
宋何罪之有 | 0
古之人不余欺也 | 0
求人可使报秦者 | 1
蚓无爪牙之利，筋骨之强 | 1
石之铿然有声者 | 1
马之千里者 | 1
青，取之于蓝，而青于蓝 | 2
战于长勺 | 2
君子博学而日参省乎己 | 2
具告以事 | 2
甚矣，汝之不惠 | 3
渺渺兮予怀 | 3
安在公子能急人之困也 | 3
`,
  INVERSIONS,
);

const FLEXIBLE = ["名词用作动词", "名词用作状语", "使动用法", "意动用法"];

const flexible = usages(
  `
驴不胜怒，蹄之（蹄） | 0
范增数目项王（目） | 0
籍吏民，封府库（籍） | 0
假舟楫者，非能水也（水） | 0
其一犬坐于前（犬） | 1
天下云集响应（云） | 1
吾得兄事之（兄） | 1
斗折蛇行（蛇） | 1
常以身翼蔽沛公（翼） | 1
项伯杀人，臣活之（活） | 2
焚百家之言，以愚黔首（愚） | 2
舞幽壑之潜蛟（舞） | 2
泣孤舟之嫠妇（泣） | 2
吾妻之美我者，私我也（美） | 3
孔子登东山而小鲁（小） | 3
侣鱼虾而友麋鹿（友） | 3
而耻学于师（耻） | 3
`,
  FLEXIBLE,
);

const oldAndNew = items(`
率妻子邑人来此绝境（妻子） | 妻子和儿女 | 男子的配偶 | 妻子的娘家人 | 妻子和邻居
率妻子邑人来此绝境（绝境） | 与外界隔绝的地方 | 没有出路的境地 | 风景绝美的地方 | 偏远的边境
乃不知有汉，无论魏晋（无论） | 更不用说 | 不管，不论 | 没有讨论 | 无法评论
古之学者必有师（学者） | 求学的人 | 有专门学问的人 | 学校里的老师 | 读书做官的人
备他盗之出入与非常也（非常） | 意外的变故 | 十分，很 | 不平常的人 | 违法的事情
先帝不以臣卑鄙（卑鄙） | 身份低微，见识浅陋 | 品质恶劣 | 胆小怕事 | 为人吝啬
今齐地方千里（地方） | 土地方圆 | 某一个区域 | 地方政府 | 本地
山东豪俊遂并起而亡秦族矣（山东） | 崤山以东 | 今天的山东省 | 东边的山 | 泰山以东
出则无敌国外患者（敌国） | 实力相当的国家 | 敌对的国家 | 被打败的国家 | 遥远的国家
未尝不叹息痛恨于桓灵也（痛恨） | 痛心和遗憾 | 深深地憎恨 | 非常后悔 | 十分愤怒
吾从而师之（从而） | 跟从并且 | 因此，进而 | 然后 | 于是就
中间力拉崩倒之声（中间） | 其中夹杂着 | 两头之间的位置 | 事物的中心 | 一段时间之内
`);

/** changedWhy explains what the word in brackets meant in the sentence. */
const changedWhy = (right: string, shown: string) => {
  const m = /^(.*)（(.+)）$/u.exec(shown);
  const [sentence, word] = m ? [m[1]!, m[2]!] : [shown, ""];
  return t(`In ${sentence}, ${word} means: ${right}.`, `在“${sentence}”中，“${word}”的意思是：${right}。`);
};

/** Example is an example of a usage, in English and in Chinese. */
type Example = readonly [string, string];

/** list writes the usages of a word as a list. */
const list = (all: readonly string[]) => all.map((u) => `- ${u}`).join("\n");

/** pair builds a drill of two function words, a knowledge point each. */
function pair(
  grade: number,
  id: string,
  [a, b]: readonly [string, string],
  [ka, kb]: readonly [string, string],
  [ua, ub]: readonly [readonly string[], readonly string[]],
  [ia, ib]: readonly [readonly DrillItem[], readonly DrillItem[]],
  [ea, eb]: readonly [Example, Example],
): ClassicalDrill {
  const point = (w: string, suffix: string, all: readonly string[], its: readonly DrillItem[], [en, zh]: Example) => ({
    suffix,
    title: t(`The Usages of ${w}`, `“${w}”的用法`),
    explanation: t(
      `${w} has four common usages in classical Chinese:\n\n${list(all)}\n\n${en} Read the whole sentence first, then decide which usage fits.`,
      `“${w}”在文言文中常见的用法有四种：\n\n${list(all)}\n\n${zh}先读懂整句话，再判断是哪一种用法。`,
    ),
    question: t(`What is the usage of ${w} in this sentence?`, `“${w}”在这句话中是什么用法？`),
    items: its,
    why: usageWhy,
  });
  return {
    grade,
    id,
    title: t(`Classical Chinese: ${a} and ${b}`, `文言文：“${a}”和“${b}”`),
    summary: t(`The usages of ${a} and ${b} in classical sentences.`, `文言句子中“${a}”“${b}”的用法。`),
    points: [point(a, ka, ua, ia, ea), point(b, kb, ub, ib, eb)],
  };
}

/** seniorClassicalDrills are the drill topics of classical language in senior secondary school, in order. */
export const seniorClassicalDrills: readonly ClassicalDrill[] = [
  pair(
    10,
    "classical-function-words-10-01",
    ["乃", "且"],
    ["nai", "qie"],
    [NAI, QIE],
    [nai, qie],
    [
      ["In 当立者乃公子扶苏, 乃 is 是.", "“当立者乃公子扶苏”中，“乃”是“是”。"],
      ["In 臣死且不避, 且 is 尚且, even.", "“臣死且不避”中，“且”是“尚且”。"],
    ],
  ),
  pair(
    10,
    "classical-function-words-10-02",
    ["若", "焉"],
    ["ruo", "yan"],
    [RUO, YAN],
    [ruo, yan],
    [
      ["In 若舍郑以为东道主, 若 is 如果, if.", "“若舍郑以为东道主”中，“若”是“如果”。"],
      ["In 积土成山，风雨兴焉, 焉 is 于此, there.", "“积土成山，风雨兴焉”中，“焉”是“于此”，在那里。"],
    ],
  ),
  pair(
    10,
    "classical-function-words-10-03",
    ["何", "乎"],
    ["he", "hu"],
    [HE, HU],
    [he, hu],
    [
      ["In 水何澹澹, 何 is 多么, how.", "“水何澹澹”中，“何”是“多么”。"],
      ["In 生乎吾前, 乎 is 于.", "“生乎吾前”中，“乎”相当于“于”。"],
    ],
  ),
  {
    grade: 10,
    id: "classical-sentence-patterns-10-01",
    title: t("Classical Chinese: Kinds of Sentence", "文言文：特殊句式"),
    summary: t(
      "Judgments, passives, sentences with words left out, and the inversions of classical Chinese.",
      "文言文中的判断句、被动句、省略句和倒装句。",
    ),
    points: [
      {
        suffix: "kinds",
        title: t("Four Kinds of Sentence", "四种特殊句式"),
        explanation: t(
          "Classical Chinese has four kinds of sentence that modern Chinese says differently:\n\n- 判断句, a judgment without 是: ……者，……也, or 乃 and 则 meaning 是\n- 被动句, a passive: 为, 为……所, 见, 被, or 于 after the verb\n- 省略句, a sentence with its subject, object or a preposition such as 于 left out\n- 倒装句, an inversion: an object before its verb, a modifier after its noun, a prepositional phrase after its verb, or a predicate before its subject",
          "文言文有四种和现代汉语说法不同的特殊句式：\n\n- 判断句：不用“是”，用“……者，……也”，或用“乃”“则”表示“是”\n- 被动句：用“为”“为……所”“见”“被”，或在动词后用“于”\n- 省略句：省去主语、宾语或“于”之类的介词\n- 倒装句：宾语放在动词前，定语放在中心词后，介词结构放在动词后，或谓语放在主语前",
        ),
        question: t("What kind of sentence is this?", "这是哪种特殊句式？"),
        items: kinds,
        why: (right, shown) => t(`${shown} is a ${right}.`, `“${shown}”是${right}。`),
      },
      {
        suffix: "inversions",
        title: t("Four Kinds of Inversion", "四种倒装句"),
        explanation: t(
          "An inverted sentence puts a part where modern Chinese would not:\n\n- 宾语前置: in a question or a negation, a pronoun object goes before its verb, 沛公安在 for 沛公在安; 之 can mark it, 何陋之有\n- 定语后置: a modifier follows its noun, often with 者 or 之……者, 马之千里者 for 千里马\n- 状语后置: a phrase with 于 or 以 follows its verb, 战于长勺 for 于长勺战\n- 主谓倒装: the predicate comes first for force, 甚矣，汝之不惠",
          "倒装句把某个成分放在了现代汉语不放的位置：\n\n- 宾语前置：疑问句、否定句中代词作宾语，放在动词前，“沛公安在”就是“沛公在安”；也可以用“之”提宾，“何陋之有”\n- 定语后置：定语放在中心词后，常用“者”或“之……者”，“马之千里者”就是“千里马”\n- 状语后置：“于”“以”组成的介词结构放在动词后，“战于长勺”就是“于长勺战”\n- 主谓倒装：为了强调把谓语放在前面，“甚矣，汝之不惠”",
        ),
        question: t("What kind of inversion is this?", "这是哪种倒装句？"),
        items: inversions,
        why: (right, shown) => t(`${shown} is an inversion: ${right}.`, `“${shown}”是倒装句中的${right}。`),
      },
    ],
  },
  pair(
    11,
    "classical-function-words-11-01",
    ["因", "与"],
    ["yin", "yu"],
    [YIN, YU],
    [yin, yu],
    [
      ["In 因释其耒而守株, 因 is 于是, so.", "“因释其耒而守株”中，“因”是“于是”。"],
      ["In 则与一生彘肩, 与 is to give.", "“则与一生彘肩”中，“与”是“给予”。"],
    ],
  ),
  pair(
    11,
    "classical-function-words-11-02",
    ["则", "所"],
    ["ze", "suo"],
    [ZE, SUO],
    [ze, suo],
    [
      ["In 学而不思则罔, 则 is 就, then.", "“学而不思则罔”中，“则”是“就”。"],
      ["In 鱼，我所欲也, 所欲 is what I want.", "“鱼，我所欲也”中，“所欲”是我想要的东西。"],
    ],
  ),
  pair(
    11,
    "classical-function-words-11-03",
    ["也", "者"],
    ["ye", "zhe"],
    [YE, ZHE],
    [ye, zhe],
    [
      ["In 陈胜者，阳城人也, 也 ends a judgment.", "“陈胜者，阳城人也”中，“也”表示判断。"],
      ["In 昔者仲尼与于蜡宾, 者 after a word of time is not translated.", "“昔者仲尼与于蜡宾”中，“者”用在时间词后，不译。"],
    ],
  ),
  {
    grade: 11,
    id: "classical-words-11-01",
    title: t("Classical Chinese: Words Used Anew and Words Changed", "文言文：词类活用和古今异义"),
    summary: t(
      "Words used as another part of speech, and words whose meaning has changed since classical times.",
      "文言文中的词类活用，以及古今意义不同的词。",
    ),
    points: [
      {
        suffix: "flexible",
        title: t("Words Used as Another Part of Speech", "词类活用"),
        explanation: t(
          "A classical word can work as another part of speech in a sentence:\n\n- 名词用作动词: a noun acts, 驴不胜怒，蹄之, kicked it\n- 名词用作状语: a noun says how, 其一犬坐于前, sat like a dog\n- 使动用法: makes the object do or be, 臣活之, made him live\n- 意动用法: thinks the object is, 孔子登东山而小鲁, thought Lu small\n\nAsk what the word does in the sentence, then who does it to whom.",
          "文言文中的词在句子里可以临时活用作别的词性：\n\n- 名词用作动词：名词表示动作，“驴不胜怒，蹄之”，用蹄子踢它\n- 名词用作状语：名词表示动作的方式，“其一犬坐于前”，像狗一样坐着\n- 使动用法：使宾语怎么样，“臣活之”，使他活下来\n- 意动用法：认为宾语怎么样，“孔子登东山而小鲁”，认为鲁国小\n\n先看这个词在句中起什么作用，再看是谁对谁怎么样。",
        ),
        question: t("How is the word in brackets used in this sentence?", "括号里的字在这句话中是什么活用？"),
        items: flexible,
        why: usageWhy,
      },
      {
        suffix: "old-and-new",
        title: t("Words Whose Meaning Has Changed", "古今异义"),
        explanation: t(
          "Some words read the same as a modern word but meant something else: 妻子 in 率妻子邑人 is a wife and children, and 山东 in 山东豪俊 is east of the Xiao mountains. Do not take the modern meaning for granted; see what the sentence needs.",
          "有些词和现代汉语的词写法相同，意思却不一样：“率妻子邑人”中的“妻子”是妻子和儿女，“山东豪俊”中的“山东”是崤山以东。不要想当然地用今天的意思去理解，要看句子需要什么意思。",
        ),
        question: t("What does the word in brackets mean in this sentence?", "括号里的词在这句话中是什么意思？"),
        items: oldAndNew,
        why: changedWhy,
      },
    ],
  },
];
