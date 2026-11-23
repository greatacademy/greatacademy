// The drills of classical language (文言) in grades 5 to 9 (docs/chinese-curriculum.md §7): content words and whole
// sentences put into modern Chinese in grades 5, 7 and 9, the function words 之, 而, 以 and 于 in grade 6, 其 and 为 in
// grade 8, and borrowed characters in grade 9. Every sentence is from a classical text in the public domain, most of
// them from the passages recited in these grades; the meanings, the translations, the clues and the wrong answers are
// written for this subject.

import { t } from "@ga/content";

import type { DrillSpec } from "../grammar/drill.ts";
import { explained, sentencePoint, type Usage, usage, usagePoint, usagesPoint, wordPoint } from "./teach.ts";

/** ClassicalDrill is a drill topic of classical language without its prerequisites, and its grade. */
export type ClassicalDrill = Omit<DrillSpec, "prerequisites" | "strand"> & { readonly grade: number };

/** WORD_QUESTION asks for the meaning of the character in brackets. */
const WORD_QUESTION = t("What does the character in brackets mean in this sentence?", "括号里的字在这句话中是什么意思？");

/** SENTENCE_QUESTION asks for a sentence in modern Chinese. */
const SENTENCE_QUESTION = t("Which is the right modern Chinese for this sentence?", "这句话翻译成现代汉语，哪一项正确？");

/** USAGE_QUESTION asks for the usage of the character in brackets. */
const USAGE_QUESTION = t("What is the usage of the character in brackets in this sentence?", "括号里的字在这句话中是什么用法？");

const contentWords = `
兔走触株（走） | 跑 | 行走 | 离开 | 前往 | 一只兔子奔跑着撞到树桩上 | 兔子一头撞上树桩，连脖子都撞断了（折颈而死），可见它不是慢慢走过去，而是跑得飞快。 | The hare hit the stump hard enough to break its neck (折颈而死), so it was not walking up to it but running fast.
因释其耒而守株（释） | 放下 | 解释 | 释放 | 拿起 | 于是放下他的农具，守在树桩旁边 | 种田人从此不再耕地，只守着树桩等兔子，手里的农具自然搁下不用了。 | The farmer gives up ploughing to wait by the stump, so the tool in his hands is laid aside.
冀复得兔（冀） | 希望 | 害怕 | 打算 | 等待 | 希望再得到兔子 | 他守在树桩旁，等的是天上再掉下一只兔子来；“冀”说的是他心里的盼头，守株才是他做的事。 | He waits by the stump for another hare to fall into his lap; 冀 is what he has in his mind, while 守株 is what he does.
冀复得兔（复） | 再，又 | 回复 | 恢复 | 重复 | 希望再得到兔子 | 他已经白捡过一只兔子，现在盼的是同样的事再来一次。 | He has already had one hare for nothing; now he hopes for the same once more.
而身为宋国笑（笑） | 嘲笑 | 微笑 | 欢笑 | 玩笑 | 他自己却被宋国人嘲笑 | 守株等兔是件傻事，“为宋国笑”是被宋国人笑，笑的是他的愚蠢。 | Waiting by a stump for hares is foolish; 为宋国笑 is being laughed at by the people of Song, for his folly.
甚聪惠（惠） | 同“慧”，聪明 | 恩惠 | 实惠 | 优惠 | 非常聪明 | “甚聪惠”说的是杨氏之子，后文他机智地答出“未闻孔雀是夫子家禽”，可见是夸他聪明。 | 甚聪惠 describes the Yang boy, who soon answers wittily (未闻孔雀是夫子家禽), so it praises his wits.
孔君平诣其父（诣） | 拜访 | 告诉 | 询问 | 寻找 | 孔君平去拜见孩子的父亲 | 孔君平是登门的客人：后文“父不在”，孩子“为设果”招待他，“诣”是登门去见。 | Kong Junping comes to the house as a guest: the father is out (父不在) and the boy serves him fruit, so 诣 is calling on someone.
为设果（设） | 摆放，摆出 | 设计 | 假设 | 建设 | 孩子为他摆出水果 | 父亲不在家，孩子招待客人；后文孔君平指着果子说话，可见水果已经端上来放在面前。 | With the father out, the boy serves the guest; Kong then points at the fruit, so it was set out before him.
未闻孔雀是夫子家禽（闻） | 听说 | 闻到 | 新闻 | 看见 | 没有听说孔雀是您家的鸟 | 孩子回敬孔君平的玩笑：他从没听人说过孔雀是孔家的鸟；“闻”说的是听来的话，不是鼻子闻到的气味。 | The boy turns Kong's joke back on him: he has never heard it said that the peacock is the Kongs' bird. 闻 is what one hears said, not what one smells.
夏月则练囊盛数十萤火以照书（盛） | 装 | 茂盛 | 盛大 | 旺盛 | 夏天就用白绢做成口袋，装上几十只萤火虫来照着读书 | “练囊”是白绢做的口袋，萤火虫放进袋里才能照着读书，“盛”是把东西放进容器里。 | 练囊 is a bag of white silk; the fireflies go into it to light the book, so 盛 is putting things into a container.
胤恭勤不倦（倦） | 懈怠 | 卷起 | 休息 | 害怕 | 车胤谦恭勤奋，从不懈怠 | “恭勤”说他勤奋，“不倦”接着说他一直这样，从不松劲。 | 恭勤 says he worked hard, and 不倦 goes on to say he kept at it and never slackened.
学而时习之（习） | 温习 | 习惯 | 风俗 | 学会 | 学了又按时温习它 | “习”跟在“学”后面，是学过以后按时去做的事，就是把学过的东西再温习。 | 习 follows 学: it is what one does, at the right times, with what was learned, going over it again.
温故而知新（故） | 旧的知识 | 故事 | 缘故 | 故意 | 温习旧的知识，从而得到新的理解 | “故”和后面的“新”相对，“温”的对象是已经学过的东西。 | 故 is set against 新, new, after it; what one goes over (温) is what was learned before.
兔不可复得（得） | 得到 | 必须 | 得意 | 获胜 | 兔子不可能再得到了 | 他想要的是再捡到一只兔子，“得”说的就是把兔子拿到手。 | What he wanted was to pick up another hare; 得 is getting it into his hands.
`;

const sentences = `
兔走触株，折颈而死
= 一只兔子奔跑着撞到树桩上，折断脖子死了
* 走：跑；触：撞；株：树桩；颈：脖子
- 一只兔子走到树桩旁，被人折断脖子打死了 | 把“走”当成了今天的“行走”，还添出了原文没有的“被人” | it takes 走 for today's "walk", and adds 被人, by someone, which the text does not say
- 一只兔子跑来碰到树桩，吓得摔倒在地 | 没有译出“折颈而死”，“吓得摔倒”是原文没有的 | it leaves out 折颈而死, broke its neck and died, and makes up a fall from fright
- 一只兔子在树桩旁行走，扭伤了脖子 | 把“走”译成“行走”，丢了“触”，又把“折颈而死”译成了扭伤 | it renders 走 as walking, drops 触, and turns 折颈而死 into a sprained neck

因释其耒而守株
= 于是放下他的农具，守在树桩旁边
* 因：于是；释：放下；耒：农具；守：守候；株：树桩
~ 因释其耒 / 而守株
- 因为解释他的农具而守着树桩 | 把“因”当成“因为”，把“释”当成今天的“解释” | it takes 因 for "because" and 释 for today's "explain"
- 于是拿起农具去砍那个树桩 | “释”是放下，不是拿起；“守株”是守着树桩，不是砍它 | 释 is to put down, not pick up, and 守株 is waiting by the stump, not cutting it
- 因此把农具放在树桩上守着田地 | 他守的是树桩，不是田地；原文也没说把农具放在树桩上 | what he watches is the stump, not the field, and the text never puts the tool on the stump

兔不可复得，而身为宋国笑
= 兔子不可能再得到，他自己却被宋国人嘲笑
* 复：再；而：却；身：自己；为……笑：被……嘲笑
- 兔子不能回来了，他身边的宋国人都在笑 | 把“身”当成“身边”，也没有译出“为”表示的被动 | it takes 身 for "beside him" and misses the passive that 为 marks
- 兔子没有再得到，他为宋国人讲了笑话 | 把“为”当成“替”“给”，“笑”也不是讲笑话 | it takes 为 for "for", and 笑 is not telling jokes
- 兔子不会再来了，他觉得宋国人很好笑 | 把他被别人笑说成了他笑别人，正好弄反了 | it turns his being laughed at into his laughing at others, the wrong way round

孔君平诣其父，父不在
= 孔君平去拜访孩子的父亲，父亲不在家
* 诣：拜访；其：他的，指孩子的；不在：不在家
- 孔君平告诉孩子的父亲，父亲不在家 | 把“诣”当成了“告诉” | it takes 诣 for "tell"
- 孔君平是孩子的父亲，可他不在家 | 把“诣其父”读成了判断，孔君平是来访的客人，不是父亲 | it reads 诣其父 as "is his father"; Kong is the visitor, not the father
- 孔君平去找他的父亲，父亲不在乎 | “父不在”是父亲不在家，不是“不在乎” | 父不在 is that the father is out, not that he does not care

此是君家果
= 这是你家的水果
* 此：这；君：您，对对方的尊称；果：水果
- 这是君王家的水果 | 把“君”当成了君王；这里是对对方的尊称 | it takes 君 for a king; here it is a polite "you"
- 这是你家种的果树 | “果”是摆出来的水果，不是果树，“种的”也是原文没有的 | 果 is the fruit set out, not a fruit tree, and "grown" is not in the text
- 这是孔君平家的水果 | 说这话的正是孔君平，“君家”是孩子家，也就是杨家 | it is Kong Junping himself who says this, so 君家 is the boy's family, the Yangs

未闻孔雀是夫子家禽
= 没有听说孔雀是您家的鸟
* 未：没有；闻：听说；夫子：您，对孔君平的尊称；家禽：家里养的鸟
- 没有闻到孔雀是您家的鸟 | 把“闻”当成了用鼻子闻 | it takes 闻 for smelling
- 还没听说孔雀是孔子家的鸟 | “夫子”是孩子对孔君平的尊称，不是孔子 | 夫子 is the boy's polite name for Kong Junping, not Confucius
- 孔雀不是夫子家养的家禽 | 丢了“未闻”，把“没听说”变成了直接否定 | it drops 未闻 and turns "never heard" into a flat denial

家贫不常得油
= 家里贫穷，不能经常得到灯油
* 贫：贫穷；常：经常；得：得到；油：点灯的油
~ 家贫 / 不常得油
- 家里贫穷，常常不吃油 | 把“不常得”译成了“常常不吃”，意思变了，这里的油也不是吃的油 | it turns 不常得 into "often does not eat", and this oil is not for eating
- 家里贫穷，不常用油做饭 | 车胤缺的是点灯读书的油，“做饭”是原文没有的 | Che Yin lacks oil for a lamp to read by; cooking is not in the text
- 家里贫穷，从来没有得到过油 | “不常”是不经常，不是“从来没有” | 不常 is "not often", not "never"

以夜继日焉
= 用夜晚接着白天读书
* 以：用；夜：夜晚；继：接续；日：白天
- 晚上睡觉，白天继续读书 | 把“以夜继日”拆开理解，意思反了，他夜里也在读书 | it splits 以夜继日 and turns it round: he read at night too
- 从夜晚一直等到白天 | 没有译出“以”和“继”，“等”也是原文没有的 | it renders neither 以 nor 继, and waiting is not in the text
- 用夜晚的时间代替白天休息 | “继”是接续，不是代替，“休息”更是原文没有的 | 继 is to carry on from, not to replace, and rest is not in the text

学而时习之
= 学了又按时温习它
* 而：表示顺承；时：按时；习：温习；之：代词，指学过的知识
- 学习的时候要练习 | 把“时”当成“……的时候”，“之”也没有译出 | it takes 时 for "when", and leaves 之 out
- 学习了很长时间才学会 | 把“时”当成时间长，“习”也不是学会 | it takes 时 for a long time, and 习 is not "learn it"
- 学过以后时常忘记它 | “习”是温习，不是忘记，意思正好反了 | 习 is going over it, the opposite of forgetting

温故而知新
= 温习旧的知识，从而得到新的理解
* 温：温习；故：旧的知识；而：表示顺承；知：知道，得到；新：新的理解
~ 温故 / 而知新
- 温暖故乡，才能知道新的事情 | 把“温”当成温暖，把“故”当成故乡 | it takes 温 for warming and 故 for one's old home
- 复习故事，就能写出新的故事 | “故”是学过的知识，不是故事；“写出”也是原文没有的 | 故 is what was learned, not a story, and writing is not in the text
- 温习旧知识，然后丢掉它去学新知识 | “丢掉它”是原文没有的，“知新”是从旧知识里得到新的体会 | dropping the old is not in the text; 知新 is new insight gained from the old

宋人有耕者
= 宋国有个种田的人
* 宋：宋国；耕者：种田的人
- 宋国人都会种田 | 原文说的是“有”一个种田的人，不是人人都会种田 | the text says there was a farmer, not that everyone could farm
- 宋朝有一个种田的人 | 这个故事出自战国时的《韩非子》，“宋”是宋国，不是后来的宋朝 | the story is from the Hanfeizi of the Warring States; 宋 is the state of Song, not the later Song dynasty
- 姓宋的人有一块耕地 | 把“宋人”当成姓宋的人，“耕者”也不是耕地 | it takes 宋人 for a man named Song, and 耕者 is a farmer, not farmland

乃呼儿出
= 就把孩子叫了出来
* 乃：于是，就；呼：叫；儿：孩子；出：出来
- 于是孩子呼喊着出来 | 呼喊的不是孩子，是家里人把孩子叫出来 | the child is not the one calling; he is called out
- 才叫来孩子的父亲 | 父亲不在家，叫出来的是孩子 | the father is out; it is the boy who is called
- 就叫孩子出去 | “出”是出来见客，不是叫他出去 | 出 is coming out to meet the guest, not being sent out
`;

const ZHI: readonly Usage[] = [
  usage(
    "代词，代指人或事物",
    "代词“之”紧跟在动词后面，作动作的对象，指前面说到的人或事物",
    "a pronoun 之 comes right after a verb as what it acts on, standing for a person or thing named before",
  ),
  usage(
    "助词，相当于“的”",
    "助词“之”夹在两个名词性的成分中间，前面的修饰、限定后面的，可以换成“的”",
    "a 之 between two noun parts, the first describing or limiting the second, can be replaced by 的",
  ),
  usage("动词，到、往", "动词“之”后面直接跟着要去的地方，说的是到那里去", "a verb 之 is followed directly by a place: going there"),
  usage(
    "助词，不译",
    "助词“之”用在主语和谓语之间，后面说的是前面那个事物怎么样，去掉它意思不变",
    "a 之 between a subject and what is said of it, so that the part after it tells how the part before is, can be dropped without changing the sense",
  ),
];

const zhi = `
学而时习之（之） | 0 | 学了又按时温习它
一人虽听之（之） | 0 | 另一个人虽然也在听弈秋讲
思援弓缴而射之（之） | 0 | 想着拉弓搭箭去射它
问之，曰：“欲作针。”（之） | 0 | 李白问老婆婆，老婆婆说：“想要把它磨成针。”
择其善者而从之（之） | 0 | 选取他们的长处来学习
通国之善弈者也（之） | 1 | 是全国最擅长下棋的人
梁国杨氏之子（之） | 1 | 梁国一户姓杨的人家的儿子
吾盾之坚，物莫能陷也（之） | 3 | 我的盾坚固得很，没有什么东西能刺穿它
吾矛之利，于物无不陷也（之） | 3 | 我的矛锋利得很，对于任何东西没有刺不穿的
黄鹤楼送孟浩然之广陵（之） | 2 | 在黄鹤楼送孟浩然到广陵去 | “广陵”是地名，诗题说的是孟浩然要乘船去那里，诗人送他。 | 广陵 is a place: the title tells of Meng Haoran setting out for it, and the poet seeing him off.
吾欲之南海（之） | 2 | 我想到南海去
`;

const ER: readonly Usage[] = [
  usage(
    "表示顺承，可译为“就”“然后”",
    "前后两个动作一件接着一件，意思顺着往下走",
    "the two actions come one after the other, and the sense runs on",
  ),
  usage(
    "表示转折，可译为“却”“但是”",
    "前后两部分意思相反，或者后面出乎前面的意料",
    "the two parts run against each other, or the second is not what the first leads one to expect",
  ),
  usage(
    "表示修饰，可译为“地”“着”",
    "“而”前面的部分说明后面的动作在什么时候、怎样进行",
    "the part before 而 tells when or how the action after it is done",
    "朝而往，暮而归",
  ),
  usage(
    "表示并列，可译为“而且”",
    "前后两部分地位相同，说的是同时具有的两样",
    "the two parts stand equal, two things that hold at once",
    "敏而好学",
  ),
];

const YI: readonly Usage[] = [
  usage("用，拿", "“以”后面跟着名词，引出做事所用的东西或凭借", "以 is followed by a noun, the thing or means one acts with"),
  usage("认为", "“以”和“为”连用成“以为”，说的是心里认为怎样", "以 joins 为 as 以为, saying what someone thinks"),
  usage(
    "用来，来",
    "“以”夹在两个动作中间，后一个动作是前一个动作的目的",
    "以 stands between two actions, and the second is what the first is for",
  ),
  usage("因为", "“以”引出产生某种心情或结果的原因", "以 brings in the cause of a feeling or a result"),
];

const YU: readonly Usage[] = [
  usage("比", "“于”跟在形容词后面，引出拿来比较的事物", "于 follows an adjective and brings in what something is compared with"),
  usage("在", "“于”引出动作发生的地方或时间", "于 brings in where or when something happens"),
  usage("对，对于", "“于”引出动作或判断所涉及的对象", "于 brings in what an action or a judgment bears on"),
  usage("从", "“于”引出事物的来处", "于 brings in where something comes from"),
];

const er = `
因释其耒而守株（而） | 0 | 于是放下他的农具，守在树桩旁边
而身为宋国笑（而） | 1 | 他自己却被宋国人嘲笑 | 前一句说兔子不可能再得到了：他守株是想再得兔，结果兔没得到，反被人笑。 | The clause before says no hare could be had again: he waited for a hare and got ridicule instead.
温故而知新（而） | 0 | 温习旧的知识，从而得到新的理解
人不知而不愠（而） | 1 | 别人不了解我，我却不生气 | 别人不了解自己，一般人会不高兴；这里偏偏“不愠”。 | Most people resent not being understood; here one does not.
`;

const yi = `
一心以为有鸿鹄将至（以） | 1 | 一心认为有天鹅将要飞来
夏月则练囊盛数十萤火以照书（以） | 2 | 夏天就用白绢做成口袋，装上几十只萤火虫来照着读书
以夜继日焉（以） | 0 | 用夜晚接着白天读书
以子之矛，陷子之盾（以） | 0 | 用您的矛，去刺您的盾
不以物喜，不以己悲（以） | 3 | 不因为外物的好坏和自己的得失而或喜或悲 | “物”“己”是“喜”“悲”的由来：说的是不因为它们而喜悲。 | 物 and 己 are what the joy and the grief would come from.
`;

const yu = `
霜叶红于二月花（于） | 0 | 经霜的枫叶比二月的花还要红
苛政猛于虎也（于） | 0 | 苛酷的政令比老虎还要凶猛啊
吾矛之利，于物无不陷也（于） | 2 | 我的矛锋利得很，对于任何东西没有刺不穿的
战于长勺（于） | 1 | 在长勺交战
青，取之于蓝（于） | 3 | 靛青是从蓼蓝中提取的
`;

const juniorWords = `
陈太丘与友期行（期） | 约定 | 期望 | 日期 | 时期 | 陈太丘和朋友约定一同出行 | 后文“期日中”“过中不至”，两人说好了中午见面，“期”是事先约好。 | Later 期日中 and 过中不至 show they had fixed noon to meet: 期 is agreeing on it beforehand.
太丘舍去（舍） | 舍弃，丢下 | 房舍 | 宿舍 | 施舍 | 陈太丘不再等候，丢下朋友走了 | 朋友过了中午还没来，陈太丘就不等了；“舍”后面跟着“去”，是丢下他离开。 | The friend had not come by noon, so Chen stopped waiting: 舍 before 去 is leaving him behind.
尊君在不（不） | 同“否”，表示询问 | 不是 | 没有 | 不要 | 你父亲在不在 | 朋友是在问元方，“不”放在问话末尾，前面没有要否定的动作，相当于“否”。 | The friend is asking Yuanfang; 不 ends the question and denies no verb, so it works as 否, "or not".
相委而去（委） | 丢下，舍弃 | 委托 | 委屈 | 委员 | 丢下我走了 | 朋友气的是陈太丘没等他，自己先走了，“委”是把他撇下。 | The friend is angry that Chen went without him: 委 is leaving him behind.
下车引之（引） | 拉 | 引导 | 引用 | 吸引 | 下车去拉元方 | 朋友感到惭愧，下了车想和元方亲近，“引之”是伸手去拉他。 | Ashamed, the friend gets down to make it up with Yuanfang: 引之 is reaching out to take him by the hand.
元方入门不顾（顾） | 回头看 | 照顾 | 顾客 | 顾虑 | 元方走进家门，连头也不回 | 朋友下车拉他，元方却径直进门，“不顾”是连回头看一眼都不肯。 | The friend reaches for him, but Yuanfang walks straight in: 不顾 is not even looking back.
撒盐空中差可拟（拟） | 相比 | 拟定 | 模拟 | 打算 | 和把盐撒在空中差不多可以相比 | 谢朗拿撒盐来比空中飘落的雪，“拟”说的是两样东西可以相比。 | Xie Lang likens the falling snow to salt thrown in the air; 拟 is that the two can be compared.
未若柳絮因风起（因） | 凭借，趁着 | 因为 | 原因 | 因此 | 不如比作柳絮凭借风飞舞起来 | 柳絮自己飞不起来，是借着风才飘起的，“因风”是凭借风。 | Willow catkins cannot rise by themselves; they rise on the wind, so 因风 is by means of the wind.
非淡泊无以明志（明） | 明确 | 明亮 | 明天 | 聪明 | 不恬淡寡欲就无法明确自己的志向 | “明”后面跟着“志”，是对志向做的事：让志向清楚明白，就是明确。 | 明 is followed by 志, one's aim: it is something done to the aim, making it clear.
卿今当涂掌事（涂） | 同“途”，道路，这里指仕途 | 涂抹 | 糊涂 | 涂改 | 你现在身居要职，掌管政事 | 孙权劝吕蒙读书，说他如今“掌事”，掌管大事；“当涂”是正走在做官的路上，“涂”通“途”。 | Sun Quan urges Lü Meng to read because he now runs affairs (掌事): 当涂 is being on the road of office, 涂 standing for 途.
孰若孤（孰） | 谁，哪个 | 熟悉 | 成熟 | 什么 | 谁比得上我 | 孙权说吕蒙事务多，接着反问“孰若孤”：比的是人，“孰”问的是哪一个人。 | Sun Quan answers that Lü Meng is busy by asking 孰若孤: the comparison is between people, so 孰 asks which person.
即更刮目相待（更） | 另，重新 | 更加 | 更换 | 打更 | 就要另眼相看 | 吕蒙已经不是从前的“吴下阿蒙”了，所以要重新拿新的眼光看他。 | Lü Meng is no longer the man he was, so one must look at him afresh.
但微颔之（颔） | 点头 | 下巴 | 摇头 | 弯腰 | 只是微微地向他点点头 | 卖油翁看陈尧咨射箭十中八九，只是“微颔之”，稍稍点头，表示还算可以。 | The oil seller sees Chen hit nine shots in ten and only 微颔之: gives a small nod, as if to say "not bad".
公亦以此自矜（矜） | 夸耀 | 怜悯 | 拘谨 | 谨慎 | 陈尧咨也凭这一点自我夸耀 | 陈尧咨箭术“当世无双”，他因此很得意，“自矜”是拿来自夸。 | Peerless in his day as an archer, Chen is proud of it: 自矜 is boasting of himself.
无案牍之劳形（形） | 形体，身体 | 形状 | 形式 | 形容 | 没有官府公文使身体劳累 | “劳形”是使什么劳累，公文劳累的只能是人的身体。 | 劳形 is wearing something out, and what paperwork wears out is the body.
陶后鲜有闻（鲜） | 少 | 新鲜 | 鲜艳 | 鲜美 | 陶渊明以后很少听说了 | 周敦颐感叹喜爱菊花的人在陶渊明以后就不多了，“鲜有闻”是很少听说。 | Zhou Dunyi laments that since Tao Yuanming few have loved the chrysanthemum: 鲜有闻 is seldom heard of.
`;

const juniorSentences = `
待君久不至，已去
= 等您很久您都没来，他已经走了
* 待：等候；君：您；至：到；去：离开
- 等了很久您不来，就让您走了 | 离开的是陈太丘，不是“您”；“去”是离开 | the one who left is Chen, not "you"
- 您等了很久他都没来，已经离开了 | 把等人的和没来的弄反了，是陈太丘等朋友 | it turns round who waited for whom: Chen waited for the friend
- 等待您的时间很长，现在要出去 | “已去”是已经离开了，不是现在要出去 | 已去 is "has already left", not "is about to go out"

友人惭，下车引之
= 朋友感到惭愧，下车想去拉元方
* 惭：惭愧；引：拉；之：代词，指元方
- 朋友很生气，下车把元方引开 | “惭”是惭愧，不是生气；“引”是拉，不是引开 | 惭 is shame, not anger, and 引 is taking him by the hand, not leading him away
- 朋友很惭愧，下车引导元方进门 | 把“引”当成今天的“引导”，元方是自己进门的 | it takes 引 for today's "guide"; Yuanfang goes in by himself
- 朋友惭愧地下了车，引来了元方 | “引之”是去拉元方，不是把元方引来 | 引之 is reaching for him, not drawing him over

撒盐空中差可拟
= 和把盐撒在空中差不多可以相比
* 差：大致，差不多；拟：相比
- 把盐撒在空中，差别可以比较 | 把“差”当成了差别 | it takes 差 for "difference"
- 在空中撒盐，差一点可以模仿 | “差可”是差不多可以，不是差一点；“拟”是相比，不是模仿 | 差可 is "about right", not "almost", and 拟 is to compare, not to imitate
- 撒在空中的盐，差不多都落下了 | 没有译出“拟”，“落下了”是原文没有的 | it leaves out 拟 and adds a fall the text does not mention

非淡泊无以明志
= 不恬淡寡欲就无法明确志向
* 非：不；淡泊：恬淡寡欲，不追求名利；无以：没有办法，无法；明：明确
- 不淡泊名利就没有明天的志向 | 把“明志”的“明”当成了明天 | it takes 明 in 明志 for "tomorrow"
- 不喝淡水就没有办法明白志向 | 把“淡泊”当成了淡水 | it takes 淡泊 for fresh water
- 淡泊的人没有远大的志向 | 把双重否定读成了单重否定，意思正好反了 | it reads the double negative as a single one, turning the sense round

卿今当涂掌事，不可不学
= 你现在身居要职，掌管大事，不可以不学习
* 卿：你，君对臣的称呼；当涂：当道，身居要职；掌事：掌管政事；不可不：不能不，必须
~ 卿今当涂 / 掌事 / 不可不学
- 你现在正在涂抹，掌管事务，不能不学 | 把“涂”当成了涂抹，它通“途” | it takes 涂 for smearing; it stands for 途
- 你今天在路上掌管事情，可以不学 | “不可不学”是必须学，译成“可以不学”意思反了 | 不可不学 means one must learn; "need not learn" is the opposite
- 你应当在路上掌管事情，不可以学习 | “当涂”不是应当在路上，“不可不”的双重否定也丢了 | 当涂 is not "ought to be on the road", and the double negative is lost

士别三日，即更刮目相待
= 读书人分别几天，就要重新另眼相看
* 士：读书人；三日：几天；即：就；更：另，重新；刮目相待：另眼相看
- 读书人分别三天，就更要刮擦眼睛对待 | 把“更”当成更加，把“刮目”照字面译成刮擦眼睛 | it takes 更 for "more" and renders 刮目 literally as scraping the eyes
- 士兵分别三天，立刻更换眼光对待他 | 这里的“士”是有学问长进的读书人，“士兵”是今天的意思 | 士 here is a man of learning who has made progress; "soldier" is today's sense
- 读书人离别三天，马上就更加看不起他 | “刮目相待”是另眼相看、看重他，不是看不起 | 刮目相待 is seeing him with new respect, not with scorn

无他，但手熟尔
= 没有别的奥妙，只不过是手法熟练罢了
* 他：别的；但：只；熟：熟练；尔：罢了
- 没有他，只是手很熟悉你 | 把“他”当成别人，把“尔”当成你 | it takes 他 for a person and 尔 for "you"
- 他没有什么，但是手熟了 | “但”是只，不是但是；“无他”也不是他没有 | 但 is "only", not "but", and 无他 is not "he has nothing"
- 没有别人，只有你的手熟练 | “他”是别的奥妙，不是别人；“尔”是罢了，不是你 | 他 is "anything else", not "anyone else", and 尔 is "that is all", not "you"

斯是陋室，惟吾德馨
= 这是简陋的屋子，只是我的品德高尚
* 斯：这；陋室：简陋的屋子；惟：只；馨：香气，这里指品德高尚
- 这间屋子简陋，只有我的德行是香的 | 照字面把“馨”当成香，没有译出它比喻的品德高尚 | it takes 馨 literally as fragrant, missing that it stands for fine character
- 这是陋室，我的德行也很简陋 | “惟吾德馨”说的是品德高尚，不是品德简陋 | 惟吾德馨 says his character is fine, not poor
- 斯先生的屋子简陋，只有我品德好 | 把“斯”当成了姓，它是“这” | it takes 斯 for a surname; it means "this"

何陋之有
= 有什么简陋的呢
* 何：什么；陋：简陋；之：宾语提前的标志，不译；何……之有：有什么……呢
- 什么简陋的东西都有 | 把反问读成了陈述，意思反了 | it reads the rhetorical question as a statement, the opposite sense
- 为什么会有简陋的东西 | “何”在这里是“什么”，和“陋”一起作“有”的宾语，不是为什么 | 何 here is "what", with 陋 the object of 有, not "why"
- 简陋的地方在哪里 | “何……之有”是反问“有什么……呢”，不是问地方 | 何……之有 asks "what … is there?", not where

可远观而不可亵玩焉
= 只能远远地观赏，却不能靠近玩弄
* 远：远远地；观：观赏；而：却，表示转折；亵玩：靠近玩弄
~ 可远观 / 而不可亵玩焉
- 可以远远地看，也可以拿来玩耍 | 丢了“不”，把“不可亵玩”译反了 | it drops 不 and turns 不可亵玩 round
- 可以远看，也可以近玩 | 把表示转折的“而”译成了“也”，“不可”也丢了 | it renders the turning 而 as "also", and loses 不可
- 远看可以，近看就不好看了 | “亵玩”是靠近玩弄，不是近看，“不好看”是原文没有的 | 亵玩 is handling it up close, not looking, and "not pretty" is not in the text

吾射不亦精乎
= 我的箭法不是很高明吗
* 射：射箭的本领；精：精湛，高明；不亦……乎：不是……吗
- 我射箭不也精通了吗，你也一样 | “你也一样”是原文没有的 | "and so are you" is not in the text
- 我射得不精确吗 | 把“不亦……乎”这一反问拆开了，成了真的发问 | it breaks up the rhetorical 不亦……乎 into a real question
- 我也射得不精 | 把反问读成了否定，意思反了 | it reads the rhetorical question as a denial, the opposite sense

宜乎众矣
= 当然很多了
* 宜：应当，当然；众：多
- 应该大众都喜欢 | 把“众”当成大众，“喜欢”是原文没有的 | it takes 众 for "the public" and adds "like it"
- 适宜众人 | 把“宜”当成适宜，把“众”当成众人 | it takes 宜 for "suitable" and 众 for "everyone"
- 众人都很合适 | 把“众”当成了主语，“宜”也不是合适；说的是爱牡丹的人多 | it makes 众 the subject and takes 宜 for "fitting"; the sense is that peony lovers are many
`;

const QI: readonly Usage[] = [
  usage(
    "代词，他（们）的、它（们）的",
    "“其”放在名词前面，作定语，可以换成“他的”“它的”",
    "其 stands before a noun, describing it, and reads as his, its or their",
  ),
  usage(
    "代词，他（们）、它（们）",
    "“其”放在动词或形容词前面作主语，是“他”“它”，常在“知”“求”这类动词的宾语里",
    "其 stands before a verb as its subject, he, it or they, often inside the object of a verb such as 知 or 求",
  ),
  usage(
    "副词，表示反问或推测，难道、恐怕",
    "“其”用在句首或谓语前，表示说话人的语气，反问是“难道”，推测是“恐怕”",
    "其 at the head of a sentence or before its predicate gives the speaker's tone: in a rhetorical question 难道, in a guess 恐怕",
  ),
  usage("代词，其中的", "“其”后面跟着“一”“二”这样的数，指一群里的某一个", "其 before a number such as 一 picks one out of a group"),
];

const qi = `
复前行，欲穷其林（其） | 0 | 又向前走，想要走到那片林子的尽头
问其姓氏（其） | 0 | 问他的姓名
吾视其辙乱（其） | 0 | 我看到他们的车辙混乱
食之不能尽其材（其） | 0 | 喂养它，却不能使它充分发挥它的才能
其真无马邪（其） | 2 | 难道真的没有千里马吗
其真不知马也（其） | 2 | 恐怕是真的不识得千里马吧
其如土石何（其） | 2 | 又能把这些土块石头怎么样呢 | 这是智叟讥笑愚公的话，句末的“何”构成反问，“其”加强反问的语气。 | These are the Wise Old Man's mocking words: the closing 何 makes a rhetorical question, and 其 strengthens it.
安求其能千里也（其） | 1 | 怎么能要求它日行千里呢
不知其能千里而食也（其） | 1 | 不知道它能日行千里而按千里马的食量来喂它
其一犬坐于前（其） | 3 | 其中一只狼像狗一样蹲坐在前面
其一人专心致志（其） | 3 | 其中一个人专心致志
`;

const WEI: readonly Usage[] = [
  usage(
    "动词，做、作为、成为",
    "动词“为”后面带着名词或短语作宾语，说的是做什么、当作什么、成为什么",
    "a verb 为 takes a noun or phrase as its object: doing it, serving as it or becoming it",
  ),
  usage(
    "介词，替、给、对",
    "介词“为”后面跟着人，再接动作，主语是做这件事的人，说的是替谁、给谁、对谁做",
    "为 is followed by a person and then an action, while the subject is the one acting: doing it for, to or with that person",
  ),
  usage(
    "介词，被",
    "“为”后面跟着动作的发出者，再接动作，主语是承受动作的一方",
    "为 is followed by the doer and then the action, while the subject is the one it is done to",
  ),
  usage("动词，是", "“为”连接两样东西，说前者就是后者，相当于“是”", "为 links two things, saying the first is the second, like 是"),
];

const wei = `
武陵人捕鱼为业（为） | 0 | 武陵有个人把捕鱼当作职业
为坻，为屿，为嵁，为岩（为） | 0 | 成为水中高地、小岛、不平的岩石和石崖等各种形状
不为苟得也（为） | 0 | 不做苟且取得的事
此人一一为具言所闻（为） | 1 | 这个人把自己听到的事一一详细地告诉了他们 | “为”后面省略了“之”（桃花源中的人），是“为之具言”，告诉的对象是他们。 | 为 is followed by an understood 之, the people of the valley: 为之具言, telling them.
不足为外人道也（为） | 1 | 不值得对外面的人说
为人谋而不忠乎（为） | 1 | 替别人谋划事情是不是不尽心呢
而身为宋国笑（为） | 2 | 他自己却被宋国人嘲笑
身死人手，为天下笑者（为） | 2 | 自己死在别人手里，被天下人耻笑
知之为知之，不知为不知（为） | 3 | 知道就是知道，不知道就是不知道
中峨冠而多髯者为东坡（为） | 3 | 中间戴着高帽子、胡须浓密的人是苏东坡
`;

const eighthWords = `
略无阙处（阙） | 同“缺”，空缺 | 宫阙 | 城楼 | 缺点 | 完全没有空缺的地方 | 三峡两岸山连着山，“略无阙处”说的是山与山之间没有一点缺口。 | The mountains of the Three Gorges run on unbroken: there is no gap anywhere between them.
不见曦月（曦） | 阳光，这里指太阳 | 月光 | 星光 | 早晨 | 看不见太阳和月亮 | “曦月”和前面的“亭午夜分”（中午和半夜）对应，中午该看见的是太阳。 | 曦月 answers 亭午夜分, noon and midnight: at noon one would see the sun.
沿溯阻绝（溯） | 逆流而上 | 顺流而下 | 追溯 | 回忆 | 顺流而下和逆流而上的航路都被阻断了 | “沿”是顺流而下，和它并列的“溯”说的正是相反的方向。 | 沿 is going downstream, and 溯, set beside it, is the opposite way.
虽乘奔御风（奔） | 飞奔的快马 | 奔跑 | 投奔 | 逃跑 | 即使骑着飞奔的快马，驾着风 | “乘”后面要跟能骑乘的东西，又和“御风”并列，“奔”是飞奔的马。 | 乘 needs something to ride, set beside 御风, riding the wind: 奔 is a galloping horse.
属引凄异（属） | 连接 | 属于 | 同“嘱”，嘱托 | 家属 | 猿的叫声连续不断，凄凉怪异 | 说的是高处的猿长声啼叫，一声接着一声，“属引”是连续不断。 | It tells of the gibbons' long cries, one after another: 属引 is running on unbroken.
晓雾将歇（歇） | 消散 | 休息 | 歇脚 | 睡觉 | 早晨的雾将要消散 | 雾不会休息，早晨的雾“将歇”，是快要散尽了。 | Mist does not rest: morning mist that is about to 歇 is about to clear.
夕日欲颓（颓） | 坠落 | 颓废 | 倒塌 | 衰败 | 夕阳将要落山 | 傍晚的太阳“欲颓”，是快要落下去了。 | The evening sun that 欲颓 is about to go down.
盖竹柏影也（盖） | 原来是 | 盖子 | 遮盖 | 建造 | 原来是竹子和柏树的影子 | 前文把月下的影子看作水中的藻荇，这一句才说出它们是什么，“盖”是恍然明白：原来是。 | Before, the shadows looked like weeds in water; this sentence says what they really are: 盖 is "it turned out to be".
互相轩邈（邈） | 远 | 渺小 | 模糊 | 美貌 | 山峰互相比着往高处、远处伸展 | “轩”是高，“邈”和它连用，说的是山峰向远处伸展。 | 轩 is high, and 邈 beside it says the peaks reach far.
窥谷忘反（反） | 同“返”，返回 | 反对 | 相反 | 反复 | 看到这些山谷就流连忘返 | 看山谷看得入了迷，忘了的是回去，“反”通“返”。 | So taken with the valleys that one forgets to go back: 反 stands for 返.
策之不以其道（策） | 用鞭子打，驱使 | 计策 | 策划 | 政策 | 鞭打它，却不按照驱使千里马的方法 | “策”后面跟着“之”（千里马），是对马做的动作，就是用鞭子赶。 | 策 is followed by 之, the horse: it is something done to it, whipping.
一食或尽粟一石（或） | 有时 | 或者 | 也许 | 有人 | 一顿有时能吃完一石粮食 | 千里马不是每顿都吃这么多，“或”说的是有些时候。 | The horse does not eat that much at every meal: 或 is "at times".
域民不以封疆之界（域） | 限制 | 区域 | 领域 | 疆域 | 使百姓定居下来，不能靠划定的边疆界线 | “域”后面跟着“民”，是对百姓做的事：把他们限制在一定的地方。 | 域 takes 民, the people, as object: it is keeping them within bounds.
讲信修睦（修） | 培养 | 修理 | 修建 | 修改 | 讲求诚信，培养和睦 | “修”后面是“睦”，和睦不是能修理、修建的东西，而是要慢慢培养的。 | 修 takes 睦, harmony, which is not repaired or built but cultivated.
`;

const borrowed = `
便要还家（要） | 同“邀”，邀请 | 要求 | 重要 | 同“腰”，腰部 | 就邀请渔人到自己家里去 | 桃花源里的人问清渔人的来历，就把他带回家“设酒杀鸡作食”，是热情地请他去。 | The people of the valley hear where the fisherman is from and take him home to wine and chicken: they are inviting him.
才美不外见（见） | 同“现”，表现 | 看见 | 见解 | 拜见 | 才能和美好的素质不能表现在外面 | 千里马吃不饱，力气不足，它的才能“不外见”，是没法显露出来。 | Underfed, the horse lacks strength, and its gifts cannot show outwardly.
食马者不知其能千里而食也（食） | 同“饲”，喂 | 吃 | 粮食 | 食物 | 喂马的人不知道它能日行千里而按千里马的食量来喂它 | “食马者”的“食”后面跟着“马”，人对马做的事是喂，不是吃。 | In 食马者, 食 takes 马 as object: what a man does to a horse is feed it, not eat it.
其真无马邪（邪） | 同“耶”，表示疑问，吗 | 邪恶 | 不正 | 奇怪 | 难道真的没有千里马吗 | “其”表示反问，“邪”在句末和它配合，构成问句。 | 其 opens a rhetorical question, and 邪 at its end completes it.
万钟则不辩礼义而受之（辩） | 同“辨”，辨别 | 辩论 | 辩护 | 争辩 | 优厚的俸禄却不辨别是否合乎礼义就接受了 | 说的是有人面对万钟俸禄，不分清该不该要就收下，并没有人在争论。 | It tells of a man who takes a huge salary without telling whether it is right; no one is arguing.
所识穷乏者得我与（得） | 同“德”，感激 | 得到 | 必须 | 得意 | 我所认识的穷困的人感激我吗 | 说的是有人为了让穷朋友感激自己才接受俸禄，“得我”是对我感恩。 | It speaks of taking the salary so that poor friends will be grateful: 得我 is being grateful to me.
乡为身死而不受（乡） | 同“向”，从前 | 家乡 | 乡村 | 乡亲 | 从前为了道义宁愿死也不接受 | 这一句和后面的“今为……”对着说，“乡”是过去，“今”是现在。 | It is set against 今为… after it: 乡 is the past, 今 the present.
故患有所不辟也（辟） | 同“避”，躲避 | 开辟 | 精辟 | 复辟 | 所以有的祸患我不躲避 | 祸患是要躲的东西，为了道义，有的祸患也不去躲。 | Calamity is something one dodges; for what is right, some are not dodged.
亲戚畔之（畔） | 同“叛”，背叛 | 旁边 | 田界 | 河岸 | 连亲戚都背叛他 | 说的是失道的人帮助他的人少到极点，连亲戚都离他而去。 | It says that one who has lost the Way has so few helpers that even his kin turn against him.
百废具兴（具） | 同“俱”，全，都 | 工具 | 具备 | 具体 | 各种荒废的事业都兴办起来了 | “百废”是各种荒废的事，“具兴”是全都兴办起来。 | 百废 is everything neglected, and 具兴 is all of it revived.
属予作文以记之（属） | 同“嘱”，嘱托 | 属于 | 家属 | 类别 | 嘱托我写一篇文章来记述这件事 | 滕子京请范仲淹写文章，“属予”是把这件事托付给我。 | Teng Zijing asks Fan Zhongyan to write: 属予 is entrusting it to me.
曾益其所不能（曾） | 同“增”，增加 | 曾经 | 竟然 | 姓曾 | 增加他所不具备的才能 | “益”是增加，“曾”和它连用，说的也是增加。 | 益 is to increase, and 曾 beside it says the same.
衡于虑（衡） | 同“横”，梗塞，不顺 | 平衡 | 衡量 | 秤杆 | 思虑阻塞 | 说的是人在困境中思路堵住了，想不通。 | It speaks of a man in hardship whose thoughts are blocked.
选贤与能（与） | 同“举”，选举 | 和 | 给予 | 参与 | 选拔推举有德行、有才能的人 | “与能”和“选贤”并列，“与”的意思和“选”相同，是推举。 | 与能 parallels 选贤, so 与 means what 选 does: putting forward.
`;

const ninthSentences = `
不足为外人道也
= 不值得对外面的人说
* 不足：不值得；为：对；外人：外面的人；道：说
- 不足以作为外人的道路 | 把“为”当成作为，把“道”当成道路 | it takes 为 for "serve as" and 道 for "road"
- 不满足于对外人说 | 把“不足”当成了不满足 | it takes 不足 for "not satisfied"
- 外面的人不知道这里的道理 | “道”是说，不是道理；原文是叮嘱不必告诉外人 | 道 is to tell, not a reason; the text asks him not to tell outsiders

黄发垂髫，并怡然自乐
= 老人和孩子，都安闲快乐，自得其乐
* 黄发：老人；垂髫：小孩；并：都；怡然：安闲快乐的样子
~ 黄发垂髫 / 并怡然 / 自乐
- 黄头发的人垂着头，一起快乐 | 照字面译了“黄发”“垂髫”，它们分别借指老人和孩子 | it renders 黄发 and 垂髫 literally; they stand for the old and the young
- 头发黄的孩子垂下头，并且自己玩 | 把“垂髫”当成垂下头，“并”也不是并且 | it takes 垂髫 for hanging the head, and 并 is "all", not "and"
- 老人垂着头发，自己高兴 | 丢了孩子，“并”的“都”也没有译出 | it leaves out the children and misses 并, "all"

肉食者鄙，未能远谋
= 当权的人目光短浅，不能深谋远虑
* 肉食者：吃肉的人，指当权的人；鄙：鄙陋，目光短浅；远谋：深谋远虑
- 吃肉的人很粗鄙，不能谋划远方的事 | 照字面译“肉食者”，没有译出它借指当权的人；“远谋”也不是谋划远方 | it renders 肉食者 literally, missing that it means those in power, and 远谋 is not planning for far places
- 吃肉的人看不起别人，没有远大的谋略 | 把“鄙”当成了鄙视 | it takes 鄙 for "look down on"
- 当权的人鄙视远方的计谋 | 把两个分句并成一句，“鄙”和“远谋”都译错了 | it merges the two clauses and mistranslates both 鄙 and 远谋

一鼓作气，再而衰，三而竭
= 第一次击鼓能振作士气，第二次士气就衰退，第三次士气就耗尽了
* 鼓：击鼓；作：振作；再：第二次；衰：衰退；竭：竭尽
- 一面鼓发出声音，两面鼓就衰弱，三面鼓就竭尽 | 把“一”“再”“三”当成鼓的数目，它们说的是击鼓的次数 | it takes 一, 再 and 三 for numbers of drums; they count the beats
- 一打鼓就生气，再打就衰老，第三次就枯竭 | “作气”是振作士气，不是生气；“衰”也不是衰老 | 作气 is rousing spirit, not getting angry, and 衰 is not ageing
- 第一次打鼓有勇气，第二次还有，第三次更多 | 意思正好反了：士气是一次比一次低落 | the opposite: spirit falls with each beat

不以物喜，不以己悲
= 不因为外物的好坏和自己的得失而或喜或悲
* 以：因为；物：外物；己：自己；喜、悲：高兴、悲伤；这两句互文，要合起来理解
% 这两句互文见义，“不以物喜”和“不以己悲”合起来，意思是不因外物的好坏和个人的得失而喜悲，所以译文把两句合成一句；“以”“物”“己”“喜”“悲”都译了出来，没有多出原文没有的意思。 | The two clauses explain each other (互文): together they mean neither rejoicing nor grieving over things or over oneself, so the translation joins them; 以, 物, 己, 喜 and 悲 each have their rendering, and nothing is added.
- 不拿东西来使人高兴，不拿自己来使人悲伤 | 把“以”当成拿，“喜”“悲”也不是使别人喜悲 | it takes 以 for "use", and 喜 and 悲 are not making others glad or sad
- 不喜欢物品，也不为自己悲伤 | 把“物喜”当成了喜欢物品，丢了“以” | it takes 物喜 for liking things, and loses 以
- 不因为有东西而高兴，却因为自己而悲伤 | 后一句也有“不”，译成“却因为自己而悲伤”意思反了 | the second clause has 不 too; "but grieves over himself" is the opposite

先天下之忧而忧，后天下之乐而乐
= 在天下人忧愁之前先忧愁，在天下人快乐之后才快乐
* 先：在……之前；后：在……之后；天下：天下人；之：的
- 先为天下忧愁，然后让天下快乐 | 把两个时间先后的比较拆成了两件事 | it splits the two comparisons of before and after into two deeds
- 天下人先忧愁，然后我才快乐 | 弄错了先后：是我在天下人忧愁之前先忧愁 | it gets the order wrong: he grieves before the world does
- 在天下人快乐之前先快乐，在天下人忧愁之后再忧愁 | 把“忧”和“乐”对调了，意思正好反了 | it swaps grief and joy, the exact opposite

醉翁之意不在酒，在乎山水之间也
= 醉翁的心意不在喝酒，而在于欣赏山水的美景
* 意：心意，情趣；在乎：在于；山水之间：山水的美景
- 醉翁的意思是不喝酒，只在山水之间喝 | 把“不在酒”当成不喝酒，又说在山水间喝，自相矛盾 | it takes 不在酒 for not drinking, then has him drink among the hills
- 喝醉的老人不想喝酒，想去山水之间 | “醉翁”是欧阳修的自号，“意”也不是想 | 醉翁 is Ouyang Xiu's name for himself, and 意 is not "want"
- 醉翁的意思不在酒里，而在乎山水好不好 | 把“在乎”当成了今天的“在乎”，关心 | it takes 在乎 for today's "care about"

二者不可得兼，舍生而取义者也
= 两样不能同时得到，就舍弃生命而选取道义
* 二者：两样东西，指生命和道义；兼：同时得到；舍：舍弃；生：生命；义：道义
- 两个人不能都得到，就舍弃生活而取得义气 | “二者”是生命和道义两样，不是两个人；“生”是生命，“义”是道义 | 二者 is the two things, life and righteousness, not two people
- 两者不能兼顾，就离开学生去拿正义 | 把“舍生”当成了离开学生 | it takes 舍生 for leaving students
- 两样都得不到，就舍去生的选熟的 | “不可得兼”是不能同时得到，不是都得不到；“生”也不是生熟的生 | 不可得兼 is "not both", not "neither", and 生 is not "raw"

此之谓失其本心
= 这就叫作丧失了人本来的天性
* 此之谓：这就叫作；失：丧失；本心：本来的天性，指羞恶之心
- 这就是说他失去了本来的心思 | “本心”是人天生的羞恶之心，不是心思 | 本心 is the inborn sense of shame, not one's thoughts
- 这叫作他的心丢失了 | 照字面译“失其本心”，丢了“本” | it renders 失其本心 literally and drops 本
- 这是说他失去了本钱 | 把“本心”当成了本钱 | it takes 本心 for capital

由此观之，王之蔽甚矣
= 由此看来，大王受蒙蔽很深了
* 观：看；蔽：受蒙蔽；甚：厉害，严重
- 从这里观察，大王的遮蔽物很多 | 把“蔽”当成了遮蔽的东西 | it takes 蔽 for things that hide
- 由此看到，大王庇护了很多人 | 把“蔽”当成庇护，受蒙蔽的是大王自己 | it takes 蔽 for sheltering others; it is the king who is deceived
- 从这里看出，大王非常厉害 | 把“甚”当成称赞大王厉害，丢了“蔽” | it takes 甚 as praise of the king and drops 蔽

令初下，群臣进谏，门庭若市
= 命令刚下达，许多大臣都来进言规劝，宫门和院子里像集市一样热闹
* 初：刚刚；进谏：进言规劝；门庭：宫门和院子；若：像；市：集市
- 命令刚下，大臣们进门劝谏，门前庭院像一座城市 | 把“市”当成了城市 | it takes 市 for a city
- 命令下了，大臣们都去集市上进言 | 把“门庭若市”当成了去集市，它说的是宫门前像集市一样热闹 | it takes 门庭若市 for going to market
- 命令开始下达，大臣们进宫劝谏，门庭冷落像散了的集市 | “若市”是像集市一样热闹，不是冷落 | 若市 is busy as a market, not deserted

噫！微斯人，吾谁与归
= 唉！如果没有这种人，我同谁一道呢
* 微：没有；斯人：这种人；谁与：与谁，宾语前置；归：归依，一道
- 唉！这个人很微小，我和谁一起回家 | 把“微”当成微小，把“归”当成回家 | it takes 微 for small and 归 for going home
- 唉！微笑的人，我跟谁回去 | 把“微”当成了微笑 | it takes 微 for smiling
- 唉！没有这个人，谁会归还给我 | 读错了宾语前置的“吾谁与归”，“归”也不是归还 | it misreads the fronted object of 吾谁与归, and 归 is not "give back"
`;

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
    intro: t(
      "In grades 3 to 5 you recited classical passages such as 守株待兔, 囊萤夜读 and 杨氏之子. Reciting asks you to remember them; this topic asks you to read them: to know what each character means in its sentence, and to say a whole sentence in modern Chinese.\n\nClassical Chinese mostly writes a word as one character, where modern Chinese uses two. Much of reading it is turning each character into the word of today that carries its meaning. Take 家贫不常得油 from 囊萤夜读: 贫 becomes 贫穷, 常 becomes 经常, 得 becomes 得到, and 油 is lamp oil, since the story is about reading at night. Joined in the order of the original: 家里贫穷，不能经常得到灯油. So there are two things to do, and the two knowledge points practise them in turn: give each character its meaning in this sentence, then join the meanings into modern Chinese.",
      "三到五年级背过《守株待兔》《囊萤夜读》《杨氏之子》等文言短文。背诵要求记住它们，这个主题要求读懂它们：知道每个字在句中的意思，能把整句话说成现代汉语。\n\n文言多用一个字表示一个词，现代汉语则多用两个字。读文言，很大一部分功夫就是把每个字换成今天表达同样意思的词。比如《囊萤夜读》里的“家贫不常得油”：“贫”是贫穷，“常”是经常，“得”是得到，“油”是点灯的油，因为故事讲的是夜里读书。按原文的顺序连起来，就是“家里贫穷，不能经常得到灯油”。所以要做两件事，两个知识点依次练习：先落实每个字在这句话里的意思，再把它们连成现代汉语。",
    ),
    points: [
      wordPoint({
        suffix: "meaning",
        title: t("Content Words", "文言实词"),
        explanation: t(
          "A character of classical Chinese is often a whole word, and its meaning may not be the one it has in the modern words built on it. The sentence decides which meaning it has.\n\nTake 孔指以示儿曰 from 杨氏之子. Today 示 is in 表示, to express, and 指示, to instruct. But here Kong Junping points at the fruit (指) and then 示 the boy, before he speaks to him: what one does with a thing one points at is to show it to someone. So 示 is 给……看, to show, and the sentence is 孔君平指着杨梅给孩子看，说.\n\nSo read the whole sentence and what comes before it, ask what the character must do there, and test the meaning by putting it back.\n\n> **Watch out.** Most wrong options are meanings the character has in today's words, such as 解释 for 释. They feel right because you know the modern word, and that is just why they tempt. A meaning is right only if the sentence reads smoothly with it.",
          "文言中的一个字常常就是一个词，它的意思不一定是今天由它组成的词的意思，要由句子来定。\n\n比如《杨氏之子》里的“孔指以示儿曰”。今天“示”常在“表示”“指示”这些词里。可这里孔君平先“指”着杨梅，再“示”孩子，然后才说话：指着一样东西对别人做的事，就是给他看。所以“示”是“给……看”，整句是“孔君平指着杨梅给孩子看，说”。\n\n所以要读懂整句话和它前面的内容，想一想这个字在句中必须是什么意思，再把这个意思代回去检验。\n\n> **注意。** 错误的选项多半是这个字在今天的词语里的意思，比如把“释”讲成“解释”。因为熟悉这个词，它们看上去很像对的，这正是容易上当的地方。只有放进句子讲得通的意思才是对的。",
        ),
        question: WORD_QUESTION,
        kind: "content",
        data: contentWords,
      }),
      sentencePoint({
        suffix: "sentences",
        title: t("Putting Sentences into Modern Chinese", "翻译句子"),
        explanation: t(
          'To put a classical sentence into modern Chinese, follow three rules: give every character its meaning in the sentence (字字落实); keep the order of the original; add only the words modern Chinese needs to read smoothly, such as a subject the story gives.\n\nTake 未成，弃去 from 铁杵成针, about the young Li Bai. 未 is 没有, 成 is 完成, here his studies, 弃 is 放弃, and 去 is 离开. In order, with what the story supplies: 学业没有完成，就放弃离开了. 学业 and 就 are added because modern Chinese needs them; nothing else is.\n\n> **Watch out.** A wrong translation often reads smoothly. It goes wrong in one place: a character given today\'s meaning, such as 去 as "go to", a word left out, or something added that the original does not say. Check each translation against the original character by character, not by how natural it sounds.',
          "把文言句子翻译成现代汉语，要守三条：每个字在句中的意思都要译出来（字字落实）；保持原文的顺序；只补上现代汉语读起来需要的词，比如故事里交代过的主语。\n\n比如《铁杵成针》讲少年李白的“未成，弃去”。“未”是没有，“成”是完成，这里指学业，“弃”是放弃，“去”是离开。按顺序译出来，补上故事交代的内容：“学业没有完成，就放弃离开了。”“学业”和“就”是现代汉语需要才补上的，此外没有多加一个意思。\n\n> **注意。** 错误的译文往往也读得很顺，它只错在一处：某个字用了今天的意思，比如把“去”当成“到……去”；或者漏译了一个词；或者添上了原文没有的意思。检查译文要拿它和原文逐字对照，不能凭读起来顺不顺。",
        ),
        question: SENTENCE_QUESTION,
        data: sentences,
      }),
    ],
  },
  {
    grade: 6,
    id: "classical-function-words-6-01",
    title: t("Classical Chinese: Function Words", "文言文：虚词"),
    summary: t("The usages of 之, 而, 以 and 于 in classical sentences.", "文言句子中“之”“而”“以”“于”的用法。"),
    intro: t(
      "Content words such as 释 and 诣 name the things and actions of a sentence. Function words (虚词) carry how they hang together: who is meant, what belongs to what, what follows what. There are few of them, but they are everywhere, and one character often does several jobs; so learning a function word means learning its usages and how to tell them apart.\n\nTake 虽与之俱学，弗若之矣 from 学弈: the pupil whose mind wanders studies beside the attentive one, yet does not match him. Both 之 stand right after a verb or a word like one (与, with; 若, to match) and both point back to the attentive pupil: 虽然和那个人一起学习，却比不上他了. Neither 之 has a meaning you could draw, yet without them the sentence loses who is meant. Telling a usage is the same work each time: look at what stands before and after the word, and ask what relation it makes. The two knowledge points practise 之, then 而, 以 and 于.",
      "“释”“诣”这样的实词表示句子里的事物和动作；虚词表示它们之间的关系：指的是谁，什么属于什么，什么接着什么。虚词数量不多，却处处都用，而且一个字常常有好几种用法。所以学一个虚词，就是学它的几种用法和怎样区分它们。\n\n比如《学弈》里的“虽与之俱学，弗若之矣”：那个心不在焉的人和专心的人一起学，却比不上人家。两个“之”都紧跟在“与”“若”后面，都指那个专心学习的人：“虽然和那个人一起学习，却比不上他了。”这两个“之”都画不出来，可去掉它们，句子就说不清指的是谁。区分用法，每次都是同样的功夫：看这个字前后是什么，想一想它表示什么关系。两个知识点依次练习“之”和“而”“以”“于”。",
    ),
    points: [
      usagePoint({
        suffix: "zhi",
        title: t("The Usages of 之", "“之”的用法"),
        explanation: explained(
          t(
            "之 does four jobs in the passages you read, and where it stands tells which:",
            "在学过的文言文中，“之”有四种用法，它在句中的位置能告诉你是哪一种：",
          ),
          [ZHI],
          t(
            "Walk through 辍耕之垄上, from 陈涉世家. 辍耕 is stopping work in the field; after 之 comes 垄上, the ridge of a field, a place. 之 does not stand after a verb as its object, for 辍耕 is complete, and 垄上 is not described by 辍耕, so 之 is neither the pronoun nor 的. What one does between stopping work and a place is going there: 之 is the verb 到、往, and the sentence is 停止耕作，走到田埂上.",
            "以《陈涉世家》里的“辍耕之垄上”为例。“辍耕”是停止耕作；“之”后面是“垄上”，田埂上，一个地方。“辍耕”已经说完整了，“之”不是它的对象；“垄上”也不受“辍耕”修饰，所以“之”既不是代词，也不是“的”。停下活儿和一个地方之间，要做的事是到那里去：“之”是动词“到、往”，整句是“停止耕作，走到田埂上”。",
          ),
          t(
            "之 between two nouns is not always 的. When the part after 之 says how the part before is, as in 师道之不传也久矣, 之 stands between a subject and its predicate and is not translated: read as 的, it leaves 从师的风尚的不流传, a phrase that states nothing.",
            "夹在两个词中间的“之”不一定是“的”。如果“之”后面说的是前面的事物怎么样，比如“师道之不传也久矣”，“之”就在主语和谓语之间，不译；讲成“的”，就成了“从师的风尚的不流传”，句子什么也没说出来。",
          ),
        ),
        question: t("What is the usage of 之 in this sentence?", "“之”在这句话中是什么用法？"),
        usages: ZHI,
        data: zhi,
      }),
      usagesPoint(
        {
          suffix: "er-yi-yu",
          title: t("The Usages of 而, 以 and 于", "“而”“以”“于”的用法"),
          explanation: explained(
            t(
              "而 joins two parts, and the relation between them decides its usage. 以 and 于 each bring in something: a means, a reason, a place, a thing compared. Their usages:",
              "“而”连接前后两部分，用法由两部分的关系决定；“以”“于”各自引出一样东西：工具、原因、地点、比较的对象。它们的用法如下：",
            ),
            [ER, YI, YU],
            t(
              "Walk through 朝而往，暮而归, from 醉翁亭记. Before each 而 is a time, 朝 morning and 暮 evening; after it is an action, 往 going and 归 coming back. A time does not happen first and then lead to the action, nor does it run against it: it tells when the action is done. So 而 here links a modifier to its verb, and the sentence is 早晨前往，傍晚回来.",
              "以《醉翁亭记》里的“朝而往，暮而归”为例。两个“而”前面都是时间，“朝”是早晨，“暮”是傍晚；后面都是动作，“往”和“归”。时间不是先发生再引出动作，也不和动作相反，它说的是动作在什么时候进行。所以这里的“而”表示修饰，整句是“早晨前往，傍晚回来”。",
            ),
            t(
              "而 between two actions is not always 顺承. In 可远观而不可亵玩焉 both sides are actions, but 可 and 不可 pull against each other, so 而 is 却. Decide 而 by the sense of the two sides, never by their form.",
              "两个动作之间的“而”不一定表示顺承。“可远观而不可亵玩焉”前后都是动作，可“可”和“不可”意思相反，“而”是“却”。判断“而”要看前后两部分的意思，不能只看它们的形式。",
            ),
          ),
          question: USAGE_QUESTION,
        },
        [
          { usages: ER, data: er },
          { usages: YI, data: yi },
          { usages: YU, data: yu },
        ],
      ),
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
    intro: t(
      "The classical passages of grade 7, such as 陈太丘与友期, 咏雪, 孙权劝学 and 卖油翁, are longer than those of the primary grades, and more of their characters keep a meaning modern Chinese has lost. The work is the same as before, done more carefully: fix each character's meaning in its sentence, then put the sentence into modern Chinese.\n\nTake 俄而雪骤 from 咏雪. 俄而 is not two words but one, a short while later; 骤 is not 突然 here but describes the snow, falling hard and fast. So the sentence is 不久，雪下得又大又急. A reader who knew only today's 骤然 might write 雪突然停了, and miss the picture the story depends on: Xie An asks what the heavy snow is like. Each sentence in this topic is tested the same way, by whether its meaning fits the story around it.",
      "七年级的文言文，如《陈太丘与友期行》《咏雪》《孙权劝学》《卖油翁》，篇幅比小学长，保留古义的字也更多。功夫和以前一样，只是要更细：先落实每个字在句中的意思，再把句子译成现代汉语。\n\n比如《咏雪》里的“俄而雪骤”。“俄而”不是两个词，而是一个词，意思是不久；“骤”在这里不是“突然”，而是形容雪下得又大又急。所以整句是“不久，雪下得又大又急”。只知道今天“骤然”的人，可能会译成“雪突然停了”，就丢了故事依靠的画面：谢太傅问的正是这场大雪像什么。这个主题里的每一句话都要这样检验：它的意思和前后的故事合不合。",
    ),
    points: [
      wordPoint({
        suffix: "meaning",
        title: t("Content Words", "文言实词"),
        explanation: t(
          "Many characters of the grade 7 passages keep an old meaning: 期 is to agree on a time, 顾 is to look back, 鲜 is few. The sentence and the story around it decide which meaning a character has.\n\nTake 尝射于家圃 from 卖油翁. Today 尝 is in 品尝, to taste. But 射 follows it, so 尝 is not what Chen Yaozi does with his mouth: it says when he shot, once, in his garden. 尝 here is 曾经, and the sentence is 陈尧咨曾经在自家的园子里射箭. Put back, the meaning fits the story: this is the day the oil seller watched him.\n\n> **Watch out.** A meaning can make sense on its own and still be wrong for the sentence. 委 in 相委而去 could be 委托, to entrust, in many sentences, but here the friend is angry at being left: test each meaning against what the story says just before and after.",
          "七年级文言文里有不少字保留着古义：“期”是约定，“顾”是回头看，“鲜”是少。一个字在这里是什么意思，要由句子和前后的故事来定。\n\n比如《卖油翁》里的“尝射于家圃”。今天“尝”常在“品尝”里。可它后面跟着“射”，说的不是陈尧咨用嘴做什么，而是他什么时候射箭：曾经有一次，在自家园子里。所以“尝”是“曾经”，整句是“陈尧咨曾经在自家的园子里射箭”。代回去看，和故事正好合上：卖油翁就是这一天看他射箭的。\n\n> **注意。** 一个意思单独看讲得通，放在这句话里却可能不对。“相委而去”的“委”在很多句子里可以是“委托”，可这里朋友生气的是被丢下了：每个意思都要拿前后的故事来检验。",
        ),
        question: WORD_QUESTION,
        kind: "content",
        data: juniorWords,
      }),
      sentencePoint({
        suffix: "sentences",
        title: t("Putting Sentences into Modern Chinese", "翻译句子"),
        explanation: t(
          "Translate every character, keep the order of the original, and add only what modern Chinese needs. In the grade 7 passages two things need care: words whose meaning has changed, and set forms such as 何……之有 and 不亦……乎, which are read as one whole.\n\nTake 以我酌油知之 from 卖油翁. 以 is 凭, by; 我 is the old man himself; 酌油 is pouring oil; 知 is knowing; 之 stands for what he has just said, that skill comes from practice. In order: 凭我倒油的经验知道这个道理. 的经验 and 这个道理 are added because modern Chinese needs them, and each comes from the sentence or the story.\n\n> **Watch out.** Some characters look like the modern word they are in, and are not. 但 in 但当涉猎 is 只, only, not 但是, but: a translation that turns it into 但是 reads smoothly and says the wrong thing. Check every small word, not only the hard ones.",
          "翻译要字字落实，保持原文的语序，只补上现代汉语需要的成分。七年级文言文里有两样要特别小心：古今意思不同的词，以及“何……之有”“不亦……乎”这样要整体理解的固定格式。\n\n比如《卖油翁》里的“以我酌油知之”。“以”是凭，“我”是卖油翁自己，“酌油”是倒油，“知”是知道，“之”指他刚说的道理：熟能生巧。按顺序译出来：“凭我倒油的经验知道这个道理。”“的经验”“这个道理”是现代汉语需要才补上的，都有原句和故事作依据。\n\n> **注意。** 有些字和今天的某个词长得一样，意思却不同。“但当涉猎”的“但”是只，不是“但是”：译成“但是”读起来也顺，意思却错了。每个小字都要核对，不能只看难字。",
        ),
        question: SENTENCE_QUESTION,
        data: juniorSentences,
      }),
    ],
  },
  {
    grade: 8,
    id: "classical-function-words-8-01",
    title: t("Classical Chinese: 其 and 为", "文言文：“其”和“为”"),
    summary: t("The usages of 其 and 为 in classical sentences.", "文言句子中“其”和“为”的用法。"),
    intro: t(
      "The passages of grade 8, such as 桃花源记, 三峡 and 马说, lean on two function words, 其 and 为, and on content words of old meanings. 其 is mostly a pronoun, but it also gives a sentence its tone; 为 is a verb in some sentences and a preposition in others.\n\nTake 以其境过清 from 小石潭记: Liu Zongyuan leaves the pool because its setting is too cold and still. 以 is 因为; 其 stands before 境, the setting, so it is 它的, the pool's; 过清 is 过于凄清. So the sentence is 因为这里的环境过于凄清. One sentence asks for three things at once: the usage of 以 and 其, and the meaning of 清, which here is not clear water but a chill of loneliness. The first knowledge point practises 其 and 为, the second the content words of these passages.",
      "八年级的文言文，如《桃花源记》《三峡》《马说》，多处用到“其”“为”两个虚词，也有不少保留古义的实词。“其”多作代词，也能表示句子的语气；“为”有时是动词，有时是介词。\n\n比如《小石潭记》里的“以其境过清”：柳宗元离开小石潭，是因为那里太凄清。“以”是因为；“其”在名词“境”前面，是“它的”，指小石潭的；“过清”是过于凄清。所以整句是“因为这里的环境过于凄清”。一句话里同时要弄清三件事：“以”和“其”的用法，以及“清”的意思，这里不是水清，而是冷清孤寂。第一个知识点练习“其”和“为”，第二个练习这些文章里的实词。",
    ),
    points: [
      usagesPoint(
        {
          suffix: "qi-wei",
          title: t("The Usages of 其 and 为", "“其”和“为”的用法"),
          explanation: explained(
            t(
              "其 and 为 each do four jobs, and what stands right after them shows which:",
              "“其”和“为”各有四种用法，紧跟在它们后面的成分能告诉你是哪一种：",
            ),
            [QI, WEI],
            t(
              "Walk through 鸣之而不能通其意, from 马说: the horse neighs at its master, who cannot understand it. 其 stands before 意, a noun, meaning, so it describes it: 它的意思, the horse's. It is not the subject of a verb, nor does it open the sentence to give a tone, nor is a number after it. So 其 is 他（们）的、它（们）的, and the sentence is 马嘶鸣，却不能通晓它的意思.",
              "以《马说》里的“鸣之而不能通其意”为例：千里马对着主人嘶鸣，主人却不懂它。“其”后面是“意”，一个名词，是意思，“其”修饰它，是“它的意思”，指千里马的。它不作哪个动作的主语，也不在句首表示语气，后面也不是数目。所以“其”是代词“他（们）的、它（们）的”，整句是“千里马嘶鸣，却不能通晓它的意思”。",
            ),
            t(
              "其 before a verb is not always 他的. In 未知其死也 (捕蛇者说), 死 is a verb and 其 its subject: 不知道他死了, not 不知道他的死. And 为 after a person is 被 only if the subject suffers the action; in 为人谋 the subject does the planning, so it is 替.",
              "动词前面的“其”不一定是“他的”。“未知其死也”（《捕蛇者说》）里，“死”是动词，“其”是它的主语：“不知道他死了”，不是“他的死”。“为”后面跟着人，也只有主语承受动作时才是“被”；“为人谋”是主语去谋划，所以是“替”。",
            ),
          ),
          question: USAGE_QUESTION,
        },
        [
          { usages: QI, data: qi },
          { usages: WEI, data: wei },
        ],
      ),
      wordPoint({
        suffix: "words",
        title: t("Content Words of Grade 8", "八年级文言实词"),
        explanation: t(
          "The passages of grade 8 use characters in meanings worth learning by heart: 阙 is a gap, 曦 the sun, 属 to join, 策 a whip and to whip. The sentence decides the meaning: what stands beside the character and what the passage describes.\n\nTake 念无与为乐者 from 记承天寺夜游. 念 is not 想念, missing someone, nor 读, reading aloud: it is followed by a whole thought, that there is no one to enjoy the night with. So 念 is 考虑, 想到, and the sentence is 想到没有和我一起游乐的人. Put back, it explains what Su Shi does next: he goes to find Zhang Huaimin.\n\n> **Watch out.** Two characters that sit side by side often share a meaning, and the known one gives away the other. In 沿溯阻绝, 沿 is downstream, so 溯 beside it is upstream, not 追溯, to trace back; in 曾益其所不能, 益 is to increase, so is 曾.",
          "八年级的文言文里有一些值得记住的字义：“阙”是空缺，“曦”是阳光，“属”是连接，“策”是马鞭或用鞭子打。字义要由句子来定：看这个字旁边是什么，文章在写什么。\n\n比如《记承天寺夜游》里的“念无与为乐者”。“念”不是想念某个人，也不是读：它后面跟着一整件事，没有人和自己一起赏月。所以“念”是考虑、想到，整句是“想到没有和我一起游乐的人”。代回去看，正好说明了苏轼接下来做的事：去找张怀民。\n\n> **注意。** 并列在一起的两个字，意思常常相同或相反，认识的那个字能帮你推出另一个。“沿溯阻绝”的“沿”是顺流而下，和它并列的“溯”就是逆流而上，不是“追溯”。",
        ),
        question: WORD_QUESTION,
        kind: "content",
        data: eighthWords,
      }),
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
    intro: t(
      "By grade 9 you have met all the work of reading a classical sentence: content words, function words, set forms. This topic adds borrowed characters (通假字), and puts the work together on the longer sentences of grade 9.\n\nTake 河曲智叟亡以应 from 愚公移山: after the Foolish Old Man answers him, the Wise Old Man of the river bend has nothing to say. 亡 here is not to die or to flee: it is written for 无, which sounded like it then, and 亡以 is 无以, 没有什么. 应 is to answer. So the sentence is 河曲智叟没有话来回答. A character read in its own meaning gives nonsense, 智叟死了来回答, and that nonsense is the sign to try the character it may stand for. The two knowledge points practise borrowed characters, then whole sentences.",
      "到了九年级，读文言句子要做的事都已学过：实词、虚词、固定格式。这个主题再加上通假字，并在九年级较长的句子上把这些功夫合起来。\n\n比如《愚公移山》里的“河曲智叟亡以应”：愚公回答以后，河曲智叟没有话说了。这里的“亡”不是死亡，也不是逃亡，它是借来代替当时读音相近的“无”的，“亡以”就是“无以”，没有什么。“应”是回答。所以整句是“河曲智叟没有话来回答”。按“亡”本来的意思读，就成了“智叟死了来回答”，讲不通；讲不通，正是提醒你去找它可能代替的那个字。两个知识点先练通假字，再练整句翻译。",
    ),
    points: [
      wordPoint({
        suffix: "borrowed",
        title: t("Borrowed Characters", "通假字"),
        explanation: t(
          "Classical texts sometimes write a character for another that sounded alike, its proper character (本字). Its own meaning then makes no sense, and the meaning of the proper character does.\n\nTake 同舍生皆被绮绣 from 送东阳马生序. 被 here is not the 被 of the passive, nor a quilt: the other students do something with silk and embroidery. What one does with fine clothes is wear them, and 披, to drape on, sounded like 被. So 被 stands for 披, and the sentence is 同屋的同学都穿着华丽的丝绸衣服. Put back, it fits the passage, which sets their finery against Song Lian's old clothes.\n\n> **Watch out.** Try a borrowed reading only when the character's own meanings all fail. 属 in 属引凄异 is used in its own meaning, to join, though 属 stands for 嘱 elsewhere; a sentence that makes sense as it is needs no borrowed character.",
          "古书中有时用一个读音相同或相近的字代替本字，这就是通假字。这时按这个字本来的意思讲不通，按本字的意思才讲得通。\n\n比如《送东阳马生序》里的“同舍生皆被绮绣”。这里的“被”不是表示被动的“被”，也不是被子：同学们对绮绣做了一件事。对华美的衣服做的事是穿，而“披”和“被”读音相近。所以“被”通“披”，整句是“同屋的同学都穿着华丽的丝绸衣服”。代回去看，和文章正好合上：作者拿他们的华服和自己的旧衣服作对比。\n\n> **注意。** 只有这个字本来的意思都讲不通时，才去找通假。“属引凄异”的“属”就用本义，是连接，虽然“属”在别处可以通“嘱”；句子按本义讲得通，就不需要通假字。",
        ),
        question: t("What does the character in brackets stand for, and mean, here?", "括号里的字在这句话中通什么字，是什么意思？"),
        kind: "borrowed",
        data: borrowed,
      }),
      sentencePoint({
        suffix: "sentences",
        title: t("Putting Sentences into Modern Chinese", "翻译句子"),
        explanation: t(
          "The longer sentences of grade 9 hold words used in old senses, set forms such as 何……之有 and 此之谓, and word orders unlike today's. Translate every part, put it in the order modern Chinese needs, and check that the whole says what the original says.\n\nTake 我孰与城北徐公美 from 邹忌讽齐王纳谏. 孰与 is a set form that compares, 与……相比，谁更……; 美 is handsome. So the sentence is 我和城北徐公相比，谁更俊美. Read word for word, 我谁和城北徐公美, it is not modern Chinese: the set form must be undone into the comparison it asks.\n\n> **Watch out.** A set form read word by word gives a sentence that looks almost right. 何陋之有 is not 什么简陋的都有, a statement, but a question that denies: 有什么简陋的呢. When a sentence has 何, 孰, 之有 or 之谓, look for the set form before translating its words.",
          "九年级的长句里有古义词、“何……之有”“此之谓”这样的固定格式，还有和今天不同的语序。翻译时要逐一落实，按现代汉语的语序排好，最后检查整句的意思和原文是否一致。\n\n比如《邹忌讽齐王纳谏》里的“我孰与城北徐公美”。“孰与”是表示比较的固定格式，意思是“与……相比，谁更……”；“美”是俊美。所以整句是“我和城北徐公相比，谁更俊美”。逐字硬译成“我谁和城北徐公美”，就不是现代汉语了：要先把固定格式还原成它表示的比较。\n\n> **注意。** 把固定格式逐字翻译，得到的句子看上去差不多对。“何陋之有”不是陈述“什么简陋的都有”，而是表示否定的反问：“有什么简陋的呢？”句子里有“何”“孰”“之有”“之谓”时，先找固定格式，再译字词。",
        ),
        question: SENTENCE_QUESTION,
        data: ninthSentences,
      }),
    ],
  },
];
