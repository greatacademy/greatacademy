// What the faulty-sentence topics teach with (docs/chinese-curriculum.md §6): for each topic its introduction, the test
// that finds its fault and the mistake to watch for; for each item what is wrong with the faulty sentence, why its
// correction is sound, and why each wrong revision does not correct it.

import { t } from "@ga/content";

import type { FaultyNotes } from "./faulty.ts";

/** faultyNotes are the notes of each faulty-sentence topic, by id; each line of `notes` goes with the item of its place. */
export const faultyNotes: Readonly<Record<string, FaultyNotes>> = {
  "faulty-missing-parts": {
    intro: t(
      "A sentence must say who or what it is about and what is said of them. 在老师的帮助下，取得了很大的进步 never says who made the progress: its subject is missing. Add 我 and it is whole: 在老师的帮助下，我取得了很大的进步。\n\nThe first knowledge point finds a sentence with a missing part, the second chooses its correction.",
      "一个句子要说清“谁（什么）”和“怎么样”。“在老师的帮助下，取得了很大的进步”没说是谁取得了进步，缺少主语；补上“我”，句子就完整了：在老师的帮助下，我取得了很大的进步。\n\n第一个知识点找出成分残缺的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Ask of each sentence who does it, what is done, and to what: a sentence that cannot answer one of these has lost a part.",
      "对每个句子问一问：是谁做的？做了什么？对什么做的？回答不出其中一问，就是缺了成分。",
    ),
    watch: t(
      "A long opening such as 通过这次活动 or 在老师的帮助下 can look like a subject, but it only tells how or when. After it, the sentence still needs its own subject.",
      "“通过这次活动”“在老师的帮助下”这样长长的开头看起来像主语，其实只说明方式或条件。它后面仍然要有自己的主语。",
    ),
    notes: `
“通过……使……”连用，“我们”成了“使”的宾语，句子没有主语 | 通过 … 使 … together make 我们 the object of 使, so the sentence has no subject | 主语“我们”、谓语“懂得了”、宾语“团结的重要”都齐全 | its subject 我们, verb 懂得了 and object 团结的重要 are all there | 只把“我们”换成“我”，“通过……使……”还在，仍然没有主语 | only 我们 becomes 我; 通过 … 使 … stays, so there is still no subject | 仍然没有主语，连“懂得”的宾语也丢了 | still no subject, and 懂得 has lost its object too | “让”和“使”一样，句子仍然没有主语 | 让 works as 使 does: still no subject
没有说是谁取得了进步，缺少主语 | it never says who made progress: the subject is missing | 主语“我”说清了是谁取得了进步 | the subject 我 says who made progress | 删掉了“很大的”，主语还是没有 | drops 很大的, but there is still no subject | 加了“很快”，主语还是没有 | adds 很快, but there is still no subject | 去掉“在”，开头也不成话了，仍然没有主语 | without 在 the opening falls apart, and there is still no subject
“养成”后面缺少宾语，没说养成什么 | 养成 has no object: it never says what is formed | “养成”带上了宾语“好习惯” | 养成 has its object, 好习惯 | “认真的”不是能养成的东西，仍没说养成什么 | 认真的 is not something formed; it still does not say what | “养成”仍然没有宾语 | 养成 still has no object | “很认真”不能做“养成”的宾语，仍缺“习惯” | 很认真 cannot be the object of 养成; 习惯 is still missing
“参加”后面缺少宾语，没说参加什么 | 参加 has no object: it never says what they joined | “参加”带上了宾语“植树活动” | 参加 has its object, 植树活动 | 加了“地”，仍没说参加什么 | adds 地, still not what they joined | 删了“都”，仍没说参加什么 | drops 都, still not what they joined | 加了“了”，仍没说参加什么 | adds 了, still not what they joined
“受到了”后面缺少宾语，没说受到了什么 | 受到了 has no object: it never says what he received | “受到了”后面有了“老师的表扬” | 受到了 is followed by 老师的表扬 | “很多”说不出受到了什么，宾语仍然残缺 | 很多 does not say what he received; the object is still missing | 删了“写得”，成了“作文又快”，“受到了”也仍然没有宾语 | without 写得 the essay itself is 快, and 受到了 still has no object | 删了“了”，仍然没有宾语 | drops 了, still no object
“经过……使……”连用，句子没有主语 | 经过 … 使 … together leave the sentence without a subject | 去掉“使”，“教室”做了主语 | without 使, 教室 is the subject | 只加了“我们的”，“经过……使……”还在 | only adds 我们的; 经过 … 使 … stays | 仍然没有主语，“变得”后面也没了下文 | still no subject, and 变得 has lost what it becomes | 语序也乱了，仍然没有主语 | the order is broken too, and there is still no subject
没说是谁在跑步，缺少主语 | it never says who runs: the subject is missing | 主语“爷爷”说清了是谁在跑步 | the subject 爷爷 says who runs | 加了“都”，仍不知道是谁 | adds 都, still not who | 加了“了”，仍不知道是谁 | adds 了, still not who | 加了“很快”，仍不知道是谁 | adds 很快, still not who
“作业中的”后面缺少中心语，没说改正什么 | 作业中的 has nothing after it: it never says what is corrected | “改正”的宾语“作业中的错误”完整了 | the object of 改正, 作业中的错误, is whole | 删了“的”，仍没说改正什么 | drops 的, still not what is corrected | 删了“认真”，宾语仍然残缺 | drops 认真; the object is still missing | 删了“中”，宾语仍然残缺 | drops 中; the object is still missing
“很多”后面缺少中心语，没说有很多什么 | 很多 has nothing after it: it never says many of what | “有”的宾语“很多书”完整了 | the object of 有, 很多书, is whole | 加了“的”，仍没说有什么 | adds 的, still not many of what | 删了“里”，宾语仍然残缺 | drops 里; the object is still missing | 连“有”也删了，更不成句 | drops even 有, and is no sentence at all
“使”把“我”变成了宾语，句子没有主语 | 使 makes 我 its object, and the sentence has no subject | 去掉“使”，“我”就是“感动”的主语 | without 使, 我 is the one moved, the subject | 只把“我”换成“我们”，“使”还在，仍然没有主语 | only 我们 for 我; 使 stays, still no subject | 连“我”也没了，更说不清谁感动 | even 我 is gone: nobody is moved | 调换了语序，“使”还在，仍然没有主语 | the order changes but 使 stays: still no subject
`,
  },
  "faulty-mismatches": {
    intro: t(
      "Words that work together must suit each other. 她的歌声很美丽 joins 歌声 with 美丽, a word for what is seen: a voice is heard, so it is 动听, not 美丽. Take each pair out and say it alone, and a mismatch shows itself.\n\nThe first knowledge point finds a sentence whose words do not go together, the second chooses its correction.",
      "句子里相关的词语要互相搭配。“她的歌声很美丽”把“歌声”和“美丽”放在一起，“美丽”说的是看到的样子；歌声是听的，应该说“动听”。把每一对词语单独拿出来说一说，搭配不当就显出来了。\n\n第一个知识点找出搭配不当的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Take each pair that works together out of the sentence, subject with predicate and verb with object, and say it alone.",
      "把句子里相关的词语一对一对拿出来，主语配谓语、动词配宾语，单独说一说。",
    ),
    watch: t(
      "When one verb has two objects, test it with each: 穿……衣服 is right, but 穿……帽子 is not. A pair can hide behind the first object that fits.",
      "一个动词带两个宾语时，要分别检查：“穿……衣服”没错，“穿……帽子”就不对了。不要因为第一个宾语搭配得上，就放过了第二个。",
    ),
    notes: `
主干是“公园是季节”，公园不是季节 | its core is 公园是季节, and a park is not a season | “春天是季节”，主语和宾语对得上 | 春天是季节: subject and object fit | 删了“一个”，仍是“公园是季节” | drops 一个; still 公园是季节 | 成了“春天是公园”，还是搭配不当 | now 春天是公园, still a mismatch | 删了“美丽的”，仍是“公园是季节” | drops 美丽的; still 公园是季节
“穿”可以配“衣服”，不能配“帽子” | 穿 goes with 衣服 but not with 帽子 | “穿衣服”“戴帽子”，两个宾语各配各的动词 | 穿衣服 and 戴帽子: each object has its own verb | 只换了顺序，仍是“穿帽子” | only the order changes; still 穿帽子 | 成了“戴衣服”，又不搭配了 | now 戴衣服, another mismatch | 分成了两句，可还是“穿帽子” | split in two, but still 穿帽子
“美丽”说的是看到的样子，不能形容歌声 | 美丽 is for what is seen and does not suit a voice | “动听”说声音好听，和“歌声”搭配 | 动听 says a sound is pleasing, and suits 歌声 | “漂亮”也说看到的样子 | 漂亮 is also for what is seen | “好看”是看的，不是听的 | 好看 is for the eyes, not the ears | “鲜艳”说颜色，不能形容歌声 | 鲜艳 is for colours, not a voice
“增强”不能配“身体”，要说“增强体质” | 增强 does not go with 身体; one says 增强体质 | “增强体质”搭配得当 | 增强体质 goes together | “增加身体”也不搭配 | 增加身体 does not go together either | “增大身体”意思变了，也不搭配 | 增大身体 changes the meaning and still does not fit | “增强身体”没改，还多了“增强学习” | 增强身体 stays, and 增强学习 is added
“胃口”不能说“高”，要说“好” | an appetite is not 高; one says 胃口很好 | “胃口很好”搭配得当 | 胃口很好 goes together | “香”说的是饭菜，不是胃口 | 香 describes the food, not the appetite | “高兴”说人的心情，不说胃口 | 高兴 is a person's mood, not an appetite | “胃口很深”也不搭配 | 胃口很深 does not go together either
“欣赏”的是眼前的风景，鸟鸣是听的，缺少表示“听”的动词 | 欣赏 here takes in the view; birdsong is heard and lacks a verb of hearing | “欣赏风景”“聆听鸟鸣”，两个宾语各配各的动词 | 欣赏风景 and 聆听鸟鸣: each object has its own verb | 成了“看鸟鸣”，还是不搭配 | now 看鸟鸣, still a mismatch | 形容词换错了位置，“清脆的风景”也不搭配 | the adjectives swap places, and 清脆的风景 does not fit | 只把“鸟鸣”换成“鸟叫”，仍然缺少表示“听”的动词 | only 鸟叫 for 鸟鸣; there is still no verb of hearing
“广阔”说地方大，不能形容经验 | 广阔 is for a wide space, not experience | “经验丰富”搭配得当 | 经验丰富 goes together | “宽广”也说地方，不能形容经验 | 宽广 is also for space | “高大”说形体，不能形容经验 | 高大 is for size and build | 删了“经验”，成了“教学广阔”，仍不搭配 | drops 经验; 教学广阔 still does not fit
“个子”说高矮，不能说“胖” | 个子 is height: 高 or 矮, never 胖 | “个子长得很高”搭配得当 | 个子很高 goes together | “个子粗”也不搭配 | 个子粗 does not go together | “个子宽”也不搭配 | 个子宽 does not go together | “个子胖”没改，还多了“结实” | 个子胖 stays, with 结实 added
“兴趣”说“浓”，不说“强” | interest grows 浓, not 强 | “兴趣越来越浓”搭配得当 | 兴趣越来越浓 goes together | “兴趣重”不搭配 | 兴趣重 does not go together | “兴趣硬”不搭配 | 兴趣硬 does not go together | “兴趣强大”也不搭配 | 兴趣强大 does not go together either
舞蹈是跳的，不能“唱” | a dance is danced, not sung | “弹钢琴”“跳舞蹈”，动词和宾语都对得上 | 弹钢琴 and 跳舞蹈: each verb fits its object | 舞蹈也不能“听” | a dance is not heard either | 舞蹈改对了，又成了“唱钢琴” | the dance is mended, but now 唱钢琴 | 仍是“唱舞” | still 唱 a dance
`,
  },
  "faulty-word-order": {
    intro: t(
      "Chinese tells much by order. 这本书我已经看完了昨天 puts the time 昨天 after the verb; time comes before it: 这本书我昨天已经看完了. Things done one after another are said in that order too.\n\nThe first knowledge point finds a sentence with words in the wrong order, the second chooses its correction.",
      "汉语的意思很多靠语序表达。“这本书我已经看完了昨天”把表示时间的“昨天”放在了动词后面；时间要放在动词前面：这本书我昨天已经看完了。先后发生的动作也要按顺序说。\n\n第一个知识点找出语序不当的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Read each sentence as things happen: what comes first is said first, and words of time, place and manner stand before the verb.",
      "按事情发生的顺序读一读每个句子：先发生的先说，表示时间、地点、方式的词语放在动词前面。",
    ),
    watch: t(
      "A revision can move a word and still leave it wrong. 已经 belongs before 把, not between 把 and its object, and not after the verb: check where the word lands, not only that it moved.",
      "改了位置不一定就改对了。“已经”要放在“把”前面，不能放在“把”和宾语中间，也不能放在动词后面：要看词语移到了哪里，而不只是看它动没动。",
    ),
    notes: `
先发现困难，才能克服，“克服”和“发现”顺序颠倒 | a difficulty is found before it is overcome: 克服 and 发现 are reversed | 先“发现”后“克服”，和事情的顺序一致 | 发现 then 克服, as things happen | 只删了“且”，顺序仍颠倒 | drops 且; the order is still reversed | 顺序仍颠倒，句子还被拆乱了 | still reversed, and the phrase is broken up | 只把“困难”换成“问题”，顺序仍颠倒 | only 问题 for 困难; still reversed
先听取意见才能讨论，顺序颠倒 | opinions are heard before they are discussed: reversed | 先“听取”后“讨论” | 听取 then 讨论 | “认真地”换了位置，顺序仍颠倒 | 认真地 moves, but the order is still reversed | 句子被拆乱了，顺序仍颠倒 | the phrase is broken, still reversed | 顺序仍颠倒，还丢了“意见” | still reversed, and 意见 is lost
先指出错误才能纠正，顺序颠倒 | a mistake is pointed out before it is corrected: reversed | 先“指出”后“纠正” | 指出 then 纠正 | “耐心地”换了位置，顺序仍颠倒 | 耐心地 moves, still reversed | 仍是先纠正后指出 | it still corrects before pointing out | 只换了宾语，顺序仍颠倒 | only the object changes; still reversed
表示时间的“昨天”放在了句末，应该放在动词前 | the time word 昨天 is at the end; it belongs before the verb | “昨天”放在“已经看完”前面 | 昨天 stands before 已经看完 | “已经”跑到主语前面去了 | 已经 has moved before the subject | “已经”放在了动词后面 | 已经 is after the verb | “昨天的”挂在句末，意思也变了 | 昨天的 hangs at the end and changes the meaning
“星期天”放在了句末，时间应该放在前面 | 星期天 is at the end; the time comes first | 时间“星期天”放在句首 | the time, 星期天, opens the sentence | “星期天”插进了“去公园”中间 | 星期天 breaks into 去公园 | “玩了去公园”顺序乱了 | 玩了去公园 is in the wrong order | 成了“玩了公园”，动作和地点颠倒 | now 玩了公园: the act and the place are reversed
“已经”要放在“把”字前面 | 已经 must come before 把 | “已经”在“把”前面 | 已经 stands before 把 | “已经”放进了“把”和宾语中间 | 已经 sits between 把 and its object | “已经”拆开了“批改完” | 已经 splits 批改完 | “已经”跑到主语前面去了 | 已经 has moved before the subject
“仔细地”说的是怎样预习，却放在了句末 | 仔细地 says how the lesson is prepared, but stands at the end | “仔细地”在“预习”前面 | 仔细地 stands before 预习 | “仔细地”仍在动词后面 | 仔细地 is still after the verb | “仔细地”修饰成了“要学” | 仔细地 now describes 要学 | “仔细地”放进了“写完作业以后”里 | 仔细地 is inside 写完作业以后
先继承才能发扬，顺序颠倒 | a tradition is inherited before it is carried on: reversed | 先“继承”后“发扬” | 继承 then 发扬 | 删了“并”，顺序仍颠倒 | drops 并; still reversed | 顺序仍颠倒，还把“传统美德”说反了 | still reversed, and 传统美德 is turned round | 句子被拆乱了 | the phrase is broken apart
“一本本”说怎样放，应该放在动词前 | 一本本 tells how the books are put and belongs before the verb | “一本本”“整齐地”都在“放好”前面 | 一本本 and 整齐地 both stand before 放好 | 两个修饰语都在动词后面 | both describing words come after the verb | 两个修饰语仍然都在“放好了”后面 | both are still after 放好了 | “一本本”放到了句首 | 一本本 is put at the very start
表示时间长短的“半个小时”要放在“打”和“太极拳”之间 | the length, 半个小时, goes between 打 and 太极拳 | “打半个小时太极拳”语序正确 | 打半个小时太极拳 is the right order | “半个小时”插进了地点里 | 半个小时 breaks into the place | 地点跑到了动词后面 | the place has moved after the verb | “半个小时”放到了“每天早上”前面 | 半个小时 stands before 每天早上
`,
  },
  "faulty-repetition": {
    intro: t(
      "Two words that mean the same thing are one too many. 我们班大约有四十个左右的同学 says 'about' twice, with 大约 and 左右. Keep one: 我们班大约有四十个同学。\n\nThe first knowledge point finds a sentence that says the same thing twice, the second chooses its correction.",
      "意思相同的两个词用在一起，就多了一个。“我们班大约有四十个左右的同学”用“大约”和“左右”把“估计”说了两遍。删去一个：我们班大约有四十个同学。\n\n第一个知识点找出重复啰嗦的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Look in each sentence for two words that say the same thing, such as 大约 and 左右, or 又 and 重新.",
      "在每个句子里找一找，有没有两个词说的是同一个意思，比如“大约”和“左右”，“又”和“重新”。",
    ),
    watch: t(
      "Moving the two words, or adding a third, does not help: 左右 before 四十 still repeats 大约. One of the pair has to go.",
      "调换两个词的位置，或者再加一个词，都改不好：“左右”放到“四十”前面，仍然和“大约”重复。必须删去其中一个。",
    ),
    notes: `
“大约”和“左右”都表示估计，重复了 | 大约 and 左右 both mean about | 只留“大约”，没有重复 | only 大约 is left | “大约”“左右”都还在 | both 大约 and 左右 remain | 两个词都在，“左右”还放错了位置 | both remain, and 左右 is misplaced too | 又多了一个“大概”，更重复了 | adds 大概, which repeats even more
“有名”和“著名”意思相同 | 有名 and 著名 mean the same | 只留“著名” | only 著名 is left | 两个词都还在 | both words remain | 只换了顺序，仍然重复 | only the order changes; still repeated | 删了“的”，仍然重复 | drops 的; still repeated
“又”和“重新”都表示再一次 | 又 and 重新 both mean again | 只留“重新” | only 重新 is left | 又加了“再”，更重复了 | adds 再, which repeats even more | “又”说了两遍 | 又 is said twice | 三个词都表示再一次 | all three words mean again
“独自”就是一个人 | 独自 already means alone | 只留“独自” | only 独自 is left | “一个人”“独自”都还在 | both 一个人 and 独自 remain | 仍然重复，“地”也加错了 | still repeated, and 地 is wrongly added | 又多了“一人”，更重复了 | adds 一人, which repeats even more
“许多”和“很多”意思相同 | 许多 and 很多 mean the same | 只留“许多” | only 许多 is left | “许多”说了两遍，还有“很多”，更重复了 | 许多 twice and 很多 too: even more repeated | 换了顺序，仍然重复 | the order changes; still repeated | 删了“的”，仍然重复 | drops 的; still repeated
“深深地”和“内心深处”都在说“深” | 深深地 and 内心深处 both say deep | 只留“深深地” | only 深深地 is left | “深深地”和“深处”仍重复，“我的深处”也说不通 | 深深地 and 深处 still repeat, and 我的深处 makes no sense | “深深地”说了两遍 | 深深地 is said twice | 仍然重复，语序也乱了 | still repeated, and the order is broken
“露出笑容”就是笑了，后半句重复 | 露出笑容 already is smiling; the second half repeats it | 只说“露出了满意的笑容” | only 露出了满意的笑容 is said | 后面的“笑了”仍然重复 | the 笑了 after it still repeats | “笑容的笑”仍然重复，也说不通 | 笑容的笑 still repeats and makes no sense | 后半句仍然重复 | the second half still repeats
“非常”和“极了”都表示程度很高 | 非常 and 极了 both mean very | 只留“极了” | only 极了 is left | 两个词都在，还多了“得” | both remain, with 得 added | 又加了“很”，更重复了 | adds 很, which repeats even more | 两个词都在，语序也乱了 | both remain, and the order is broken
“按时”和“准时”意思相同 | 按时 and 准时 mean the same | 只留“按时” | only 按时 is left | 换了顺序，仍然重复 | the order changes; still repeated | 加了“地”，仍然重复 | adds 地; still repeated | 又加了“准点”，更重复了 | adds 准点, which repeats even more
“第一个”和“首先”意思相同 | 第一个 and 首先 mean the same | 只留“第一个” | only 第一个 is left | 加了“地”，仍然重复 | adds 地; still repeated | 换了顺序，仍然重复 | the order changes; still repeated | “第一个”说了两遍，更重复了 | 第一个 is said twice: even more repeated
`,
  },
  "faulty-contradictions": {
    intro: t(
      "A sentence must not say two things that cannot both be true. 他大概一定会来参加比赛 says he will perhaps come (大概) and that he will surely come (一定). Keep the one the sentence means: 他一定会来参加比赛。\n\nThe first knowledge point finds a sentence that contradicts itself, the second chooses its correction.",
      "一个句子不能同时说两件不可能都对的事。“他大概一定会来参加比赛”既说“大概”会来，又说“一定”会来。保留句子要说的那一个：他一定会来参加比赛。\n\n第一个知识点找出前后矛盾的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Look in each sentence for two parts that cannot both be true: a guess beside a certainty, nearly all beside all, dark beside bright.",
      "在每个句子里找一找，有没有不能同时成立的两个部分：猜测和肯定、差不多和全部、黑暗和明亮。",
    ),
    watch: t(
      "Swapping one word for another of the same meaning keeps the clash: 也许一定 is as wrong as 大概一定. The correction takes one side away.",
      "把一个词换成意思相同的另一个词，矛盾还在：“也许一定”和“大概一定”一样错。修改时要去掉矛盾的一方。",
    ),
    notes: `
“大概”表示不确定，“一定”表示确定，互相矛盾 | 大概 is unsure and 一定 is sure: they clash | 只留“一定”，意思是确定的 | only 一定 is left, and it is sure | 两个词都在，仍然矛盾 | both words remain; still a clash | “也许”也表示不确定，仍然矛盾 | 也许 is unsure too; still a clash | “肯定”和“一定”一样，仍然矛盾 | 肯定 is like 一定; still a clash
“差不多”就不是全部，和“全部”矛盾 | 差不多 is not all, so it clashes with 全部 | 只说“全部同学”，意思一致 | only 全部同学, and it agrees with itself | “全体”和“全部”一样，仍然矛盾 | 全体 is like 全部; still a clash | “几乎”和“差不多”一样，仍然矛盾 | 几乎 is like 差不多; still a clash | “大约”也是估计，仍然矛盾 | 大约 is a guess too; still a clash
“一点也”后面要接否定，和“记得很清楚”矛盾 | 一点也 needs a negative after it and clashes with 记得很清楚 | 去掉“一点也”，只说记得很清楚 | without 一点也, it only says he remembers clearly | “一点也”还在 | 一点也 is still there | 只加了“儿”，仍然矛盾 | only adds 儿; still a clash | “丝毫也”同样要接否定，仍然矛盾 | 丝毫也 needs a negative too; still a clash
夜晚漆黑，天上就不会挂着明月 | a pitch-dark night has no bright moon | 夜晚明亮，和明月一致 | a bright night agrees with a bright moon | 仍是漆黑的夜晚配明亮的月亮 | still a pitch-dark night with a bright moon | “漆黑无光”更黑了，仍然矛盾 | 漆黑无光 is darker still; still a clash | 换了个说法，仍然矛盾 | another word for dark; still a clash
“估计”是推测，“肯定”是确定，互相矛盾 | 估计 is a guess and 肯定 is certain: they clash | 只用“估计”，意思一致 | only 估计, and it agrees with itself | “一定”也表示确定，仍然矛盾 | 一定 is certain too; still a clash | “猜”也是推测，仍然矛盾 | 猜 is a guess too; still a clash | “绝对”也表示确定，仍然矛盾 | 绝对 is certain too; still a clash
独生子没有兄弟姐妹，不会有哥哥 | an only child has no brother or sister, so no elder brother | “没有兄弟姐妹”正是独生子的意思 | 没有兄弟姐妹 is what an only child means | 独生子仍然有了弟弟 | the only child still has a younger brother | 独生子仍然有了姐姐 | the only child still has an elder sister | 独生子竟有了两个哥哥 | the only child now has two elder brothers
“完全懂了”和“还有一点不明白”矛盾 | 完全懂了 clashes with 还有一点不明白 | “基本懂了”留有余地，和“还有一点不明白”相容 | 基本懂了 leaves room for 还有一点不明白 | “彻底”和“完全”一样，仍然矛盾 | 彻底 is like 完全; still a clash | “全部”和“完全”一样，仍然矛盾 | 全部 is like 完全; still a clash | 只把“一点”换成“一些”，仍然矛盾 | only 一些 for 一点; still a clash
鸦雀无声就是一点声音也没有，不能热烈地讨论 | 鸦雀无声 is no sound at all, so no lively discussion | 安静地“认真听讲”和鸦雀无声一致 | listening quietly agrees with 鸦雀无声 | 小声讨论也有声音，仍然矛盾 | a quiet discussion still makes sound; still a clash | 换了说法，仍是安静配热烈讨论 | in other words, still silence with lively talk | 静悄悄配大声讨论，仍然矛盾 | silence with loud talk; still a clash
第一次去，就不会熟悉那里的一切 | on a first visit nothing can be familiar | 第一次去，觉得一切都新鲜，前后一致 | on a first visit everything is new, which agrees | “很了解”和“熟悉”一样，仍然矛盾 | 很了解 is like 熟悉; still a clash | “十分熟悉”更熟悉了，仍然矛盾 | 十分熟悉 is more familiar still; still a clash | “初次”就是第一次，仍然矛盾 | 初次 is a first time; still a clash
讨论过多次，今天就不是第一次 | after many discussions, today cannot be the first | 讨论过多次，今天是最后一次，前后一致 | after many, today is the last: they agree | “初次”就是第一次，仍然矛盾 | 初次 is a first time; still a clash | 换了说法，“从来没有讨论过”和“第三次”仍然矛盾 | in other words, never discussed and the third time still clash | “头一次”就是第一次，仍然矛盾 | 头一次 is a first time; still a clash
`,
  },
  "faulty-misused-connectives": {
    intro: t(
      "Connectives come in fixed pairs that must fit how the clauses are related. 因为他生病了，但是他还是坚持上学 joins 因为 to 但是; but being ill is not why he went to school: the clauses turn against each other, so the pair is 虽然……但是…….\n\nThe first knowledge point finds a sentence whose connectives do not match, the second chooses its correction.",
      "关联词有固定的搭配，还要符合分句之间的关系。“因为他生病了，但是他还是坚持上学”把“因为”和“但是”配在一起；可生病并不是他上学的原因，两个分句是转折关系，应该用“虽然……但是……”。\n\n第一个知识点找出关联词使用不当的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Check each sentence's connectives twice: do the two belong to one pair, and does that pair fit how the clauses are related?",
      "每个句子的关联词要查两遍：前后两个是不是一对？这一对符不符合分句之间的关系？",
    ),
    watch: t(
      "A pair that matches can still be wrong for the meaning. 因为……所以…… is a real pair, but 因为他生病了，所以他还是坚持上学 makes illness the reason for going to school.",
      "搭配上了也可能不合意思。“因为……所以……”确实是一对，可“因为他生病了，所以他还是坚持上学”把生病说成了上学的原因。",
    ),
    notes: `
“因为”和“但是”不是一对，两个分句又是转折关系 | 因为 and 但是 are no pair, and the clauses turn against each other | “虽然……但是……”表示转折，符合句意 | 虽然 … 但是 … shows the turn the clauses make | 搭配成了因果，可生病不是坚持上学的原因 | the pair is now cause and effect, but illness is not why he goes to school | “如果”和“但是”不是一对 | 如果 and 但是 are no pair | “可是”和“但是”一样，仍不和“因为”配对 | 可是 is like 但是 and still does not pair with 因为
“只要”和“就”配对，“才”和“只有”配对 | 只要 pairs with 就, and 才 with 只有 | “只有……才……”配对，说明努力学习是必需的条件 | 只有 … 才 … pair, making study the condition needed | 仍是“只要……才……” | still 只要 … 才 … | “只要”不和“也”配对 | 只要 does not pair with 也 | “即使”和“也”配对，不和“才”配对 | 即使 pairs with 也, not with 才
两个分句是因果关系，“虽然”却表示转折 | the clauses are cause and effect, but 虽然 makes a turn | “因为……所以……”表示因果 | 因为 … 所以 … shows cause and effect | “因此”也说结果，仍不和“虽然”配对 | 因此 also gives a result and still does not pair with 虽然 | “于是”也说结果，仍不和“虽然”配对 | 于是 also gives a result and still does not pair with 虽然 | “即使”和“也”配对，不和“所以”配对 | 即使 pairs with 也, not with 所以
“即使”和“也”配对，不和“就”配对 | 即使 pairs with 也, not with 就 | “即使……也……”配对，说明困难再大也不改变 | 即使 … 也 … pair: however hard, nothing changes | “即使”不和“才”配对 | 即使 does not pair with 才 | “只有”和“才”配对，意思也不对 | 只有 pairs with 才, and the meaning is wrong too | 搭配对了，可“困难再大”是假设，不是已成的事实，不能用“既然” | the pair matches, but 困难再大 is a supposition, not a fact, so 既然 does not fit
“无论”和“都”配对，不和“就”配对 | 无论 pairs with 都, not with 就 | “无论……都……”配对，说明不管多冷都坚持 | 无论 … 都 … pair: however cold, he keeps on | “无论”不和“才”配对 | 无论 does not pair with 才 | “只有”不和“就”配对，“天气多么冷”也不是条件 | 只有 does not pair with 就, and the cold is no condition | “便”和“就”一样，仍不和“无论”配对 | 便 is like 就 and still does not pair with 无论
“不但”和“而且”配对，“因而”表示结果 | 不但 pairs with 而且; 因而 gives a result | “不但……而且……”表示递进 | 不但 … 而且 … adds one thing to another | “所以”也表示结果，仍不和“不但”配对 | 所以 also gives a result and does not pair with 不但 | “虽然”和“而且”不是一对 | 虽然 and 而且 are no pair | “但是”表示转折，不和“不但”配对 | 但是 makes a turn and does not pair with 不但
“如果”和“就”配对，不和“才”配对 | 如果 pairs with 就, not with 才 | “如果……就……”表示假设 | 如果 … 就 … gives a supposition and what follows | “却”表示转折，不和“如果”配对 | 却 makes a turn and does not pair with 如果 | “只要”不和“才”配对 | 只要 does not pair with 才 | “即使”和“也”配对，不和“就”配对 | 即使 pairs with 也, not with 就
“既然”和“就”配对，不和“才”配对 | 既然 pairs with 就, not with 才 | “既然……就……”从已成的事实推出结论 | 既然 … 就 … draws a conclusion from a fact | “却”表示转折，不和“既然”配对 | 却 makes a turn and does not pair with 既然 | “虽然”和“但是”配对，不和“就”配对 | 虽然 pairs with 但是, not with 就 | “只有”和“才”配对，不和“就”配对 | 只有 pairs with 才, not with 就
“只有”和“才”配对，不和“就”配对 | 只有 pairs with 才, not with 就 | “只有……才……”配对 | 只有 … 才 … pair | “只有”不和“也”配对 | 只有 does not pair with 也 | “即使”不和“才”配对 | 即使 does not pair with 才 | “便”和“就”一样，仍不和“只有”配对 | 便 is like 就 and still does not pair with 只有
“尽管”表示让步转折，后面不能用表示结果的“所以” | 尽管 makes a concession and cannot take the result word 所以 | “尽管……但是……”表示转折 | 尽管 … 但是 … makes the turn | “因此”也表示结果，仍不和“尽管”配对 | 因此 also gives a result and does not pair with 尽管 | “因为”和“但是”不是一对 | 因为 and 但是 are no pair | “于是”也表示结果，仍不和“尽管”配对 | 于是 also gives a result and does not pair with 尽管
`,
  },
  "faulty-mixed-structures": {
    intro: t(
      "A sentence goes wrong when it starts one way of saying something and ends another. 这次比赛失败的原因是由于我们准备不充分造成的 begins with 原因是…… and ends with 是……造成的. Keep one: 这次比赛失败的原因是我们准备不充分。\n\nThe first knowledge point finds a sentence that mixes two structures, the second chooses its correction.",
      "一个句子用一种说法开头、换另一种说法结尾，就成了句式杂糅。“这次比赛失败的原因是由于我们准备不充分造成的”开头是“原因是……”，结尾却是“是……造成的”。只保留一种：这次比赛失败的原因是我们准备不充分。\n\n第一个知识点找出句式杂糅的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Read each sentence's beginning and end together: if they belong to two different ways of saying it, such as 原因是 and 造成的, the structures are mixed.",
      "把每个句子的开头和结尾连起来读：如果它们属于两种不同的说法，比如“原因是”和“造成的”，就是句式杂糅。",
    ),
    watch: t(
      "Cutting a word in the middle often leaves both structures standing. 原因是……造成的 is still mixed after 由于 is taken out: the end has to match the beginning.",
      "只删掉中间的一个词，两种说法往往还都在。删去“由于”以后，“原因是……造成的”仍然杂糅：结尾要和开头对得上。",
    ),
    notes: `
“原因是……”和“是由于……造成的”两种说法混在一起 | 原因是 … and 是由于 … 造成的 are mixed into one | 只用“原因是……”一种说法 | only one structure, 原因是 … | “原因”和“由于”仍然叠在一起 | 原因 and 由于 still lie on top of each other | 末尾又加了“原因”，仍然杂糅 | 原因 is added at the end; still mixed | “原因是”和“造成的”仍然混在一起 | 原因是 and 造成的 are still mixed
“之所以……是因为……”和“是……的结果”混在一起 | 之所以 … 是因为 … and 是 … 的结果 are mixed | 只用“之所以……是因为……”一种说法 | only one structure, 之所以 … 是因为 … | “结果”和“原因”搅在一起，更乱了 | 结果 and 原因 tangle together, worse than before | 删了“之所以”，“是因为”和“的结果”仍然混在一起 | without 之所以, 是因为 and 的结果 are still mixed | “因为”和“结果”仍然混在一起 | 因为 and 结果 are still mixed
“以……为标准”和“以……作为原则”混在一起 | 以 … 为标准 and 以 … 作为原则 are mixed | 只用“以……作为……原则” | only one structure, 以 … 作为 … 原则 | 两种说法仍然都在 | both structures are still there | 又混进了“把……作为”，更乱了 | 把 … 作为 is mixed in too, worse than before | 两种说法仍然都在，只是换了位置 | both structures remain, only moved
“作者是一位青年作家”和“这本书是青年作家写的”混在一起 | 作者是一位青年作家 and 这本书是青年作家写的 are mixed | 主语换成“这本书”，说清是谁写的 | with 这本书 as subject, it says who wrote it | 仍是“作者……写的” | still 作者 … 写的 | 仍是“作者……写的” | still 作者 … 写的 | 末尾又加了“作者”，仍然杂糅 | 作者 is added at the end; still mixed
“原因是……”和“是……引起的”混在一起 | 原因是 … and 是 … 引起的 are mixed | 只用“原因是……” | only one structure, 原因是 … | 又加了“由于”，更杂糅了 | adds 由于, mixing even more | “原因是”和“引起的”仍然混在一起 | 原因是 and 引起的 are still mixed | 末尾又加了“原因”，仍然杂糅 | 原因 is added at the end; still mixed
“家乡在湖南长沙”和“他是湖南长沙人”混在一起 | 家乡在湖南长沙 and 他是湖南长沙人 are mixed | 只说“家乡在湖南长沙” | only 家乡在湖南长沙 | 家乡不是人，仍然杂糅 | a home town is not a person; still mixed | 删了“的”，仍然杂糅 | drops 的; still mixed | 删了“在”，仍然杂糅 | drops 在; still mixed
“要求我们……”和“……的要求”混在一起 | 要求我们 … and … 的要求 are mixed | 只用“要求我们……” | only one structure, 要求我们 … | 末尾的“的要求”仍在 | the closing 的要求 is still there | “要求”说了两遍，更杂糅了 | 要求 is said twice, mixing even more | 仍是“要求……的要求” | still 要求 … 的要求
“是靠勤奋取得的”和“是勤奋的结果”混在一起 | 是靠勤奋取得的 and 是勤奋的结果 are mixed | 只用“是……取得的” | only one structure, 是 … 取得的 | 删了“是”，仍然杂糅 | drops 是; still mixed | 末尾又加了“的”，更乱了 | adds 的 at the end, worse than before | “结果”“原因”搅在一起，更乱了 | 结果 and 原因 tangle together, worse than before
“是……的结果”和“是……造成的”混在一起 | 是 … 的结果 and 是 … 造成的 are mixed | 只用“是……的结果” | only one structure, 是 … 的结果 | 又加了“由于”，更杂糅了 | adds 由于, mixing even more | 删了“是”，“的结果造成的”仍然杂糅 | drops 是; 的结果造成的 is still mixed | “结果”“原因”搅在一起，更乱了 | 结果 and 原因 tangle together, worse than before
“总是先列提纲”和“有先列提纲的习惯”混在一起 | 总是先列提纲 and 有先列提纲的习惯 are mixed | 只用“总是先列提纲” | only one structure, 总是先列提纲 | “总有先列提纲”缺了“习惯”，也说不通 | 总有先列提纲 lacks 习惯 and makes no sense | 换成“做法”，仍然杂糅 | 做法 for 习惯; still mixed | 删了“时”，仍然杂糅 | drops 时; still mixed
`,
  },
  "faulty-illogical": {
    intro: t(
      "Some faulty sentences are well formed but say what they do not mean. 为了防止今后不再发生类似的事故 'prevents it not happening again': 防止 and 不再 are two negatives, and together they wish the accident back. Take one out: 为了防止今后再发生类似的事故。\n\nThe first knowledge point finds a sentence against logic, the second chooses its correction.",
      "有些病句结构完整，说出来的意思却和本意不符。“为了防止今后不再发生类似的事故”，“防止”和“不再”是两重否定，合起来反倒成了希望事故再发生。去掉一个：为了防止今后再发生类似的事故。\n\n第一个知识点找出不合逻辑的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Read each sentence for what it literally says, negatives counted, and ask whether that is what it means.",
      "按字面读一读每个句子，把否定词数清楚，问一问字面意思是不是它想说的意思。",
    ),
    watch: t(
      "Count the negatives. 防止, 否认 and 难道 each turn the meaning once, like 不: 不能否认他不是 turns it three times, and the sentence says the opposite of what it means.",
      "要数清否定。“防止”“否认”“难道”都和“不”一样，会把意思翻转一次：“不能否认他不是”翻了三次，句子就说成了相反的意思。",
    ),
    notes: `
“防止”和“不再”两重否定，意思成了希望事故再发生 | 防止 and 不再 are two negatives: it wishes the accident back | “防止再发生”意思正确 | 防止再发生 says what is meant | “防止……不再”仍在 | 防止 … 不再 is still there | 成了“不再防止”，意思更错了 | now 不再防止, which is worse | “防止……不再”仍在 | 防止 … 不再 is still there
“否认”和“不是”加上“不能”，否定太多，意思成了他不是好学生 | 不能, 否认 and 不是 turn the meaning too often: it says he is not a good student | “不能否认他是好学生”，意思是他确实是好学生 | 不能否认他是好学生: he truly is a good student | 多重否定仍在 | the stacked negatives are still there | “谁都”和“谁也”一样，多重否定仍在 | 谁都 is like 谁也; the negatives remain | 换成“不否认”，多重否定仍在 | 不否认 instead; the negatives remain
水果包括苹果和香蕉，不能和它们并列 | 水果 includes 苹果 and 香蕉 and cannot stand beside them | “苹果、香蕉等水果”说清了它们都是水果 | 苹果、香蕉等水果 says they are fruit | 仍把水果和苹果、香蕉并列 | 水果 still stands beside 苹果 and 香蕉 | 仍然并列，只换了位置 | still side by side, only moved | 仍把水果和苹果并列 | 水果 still stands beside 苹果
主客颠倒，感兴趣的是我，不是电影 | doer and done-to are swapped: I am interested, not the film | “我对这部电影很感兴趣”主客正确 | 我对这部电影很感兴趣 puts them right | “很有兴趣”仍是电影对我有兴趣 | 很有兴趣 still has the film interested in me | 换成“我们”，仍然颠倒 | 我们 for 我; still swapped | 仍然颠倒，“感到很兴趣”也说不通 | still swapped, and 感到很兴趣 makes no sense
“难道”“否认”“不是”三重否定，意思弄反了 | 难道, 否认 and 不是 turn it three times: the meaning is reversed | “难道你能否认这是事实吗？”意思是这确实是事实 | 难道你能否认这是事实吗？ means it truly is a fact | 删了“难道”，“否认……不是”仍把意思弄反 | without 难道, 否认 … 不是 still reverses it | 又加了“不”，否定更多了 | adds 不: more negatives still | 只把“事实”换成“真的”，仍然弄反 | only 真的 for 事实; still reversed
长江就是我国最长的河流，只有一条，不能说“之一” | 长江 is the longest river in China, the only one, so 之一 does not fit | “最长的河流”只指长江一条 | 最长的河流 names 长江 alone | 更乱了，仍有“之一” | worse, and 之一 is still there | 只加了“啊”，仍有“之一” | only adds 啊; 之一 is still there | 仍把唯一最长的长江说成几条中的一条 | the one longest river is still made one of several
喜欢体育锻炼和语文成绩好没有因果关系 | liking sport is no cause of good marks in Chinese | 喜欢读书和语文成绩好有因果关系 | liking to read is a cause of good marks in Chinese | “身体成绩”说不通 | 身体成绩 makes no sense | 删了“体育”，锻炼仍不是语文好的原因 | drops 体育; exercise is still no cause | 删了“因为”，仍把锻炼当成语文好的原因 | drops 因为; exercise is still made the cause
“能否”说了两面，“是关键”只对一面 | 能否 gives two sides, but 是关键 fits only one | 去掉“能否”，前后都只说一面 | without 能否, both halves give one side | 加了“之一”，“能否”仍在 | adds 之一; 能否 is still there | 删了“良好的”，仍是两面对一面 | drops 良好的; still two sides against one | “是否”和“能否”一样，仍是两面对一面 | 是否 is like 能否; still two sides against one
不必要的开支应该减少，不是节约 | needless spending is cut, not saved | “减少不必要的开支”合乎逻辑 | 减少不必要的开支 makes sense | 删了“的”，仍是节约不必要的开支 | drops 的; still saving needless spending | 成了“增加”，意思更反了 | 增加 now, which is even more wrong | “节约浪费”也不合逻辑 | 节约浪费 makes no sense either
“没有”“不说”“不美”三重否定，意思成了说西湖不美 | 没有, 不说 and 不美 turn it three times: it says 西湖 is not beautiful | “没有一个不说西湖美”，意思是人人都说西湖美 | 没有一个不说西湖美: everyone says it is beautiful | 意思成了没有人说西湖美 | now nobody says it is beautiful | 意思更乱了 | the meaning is more muddled | 删了“凡是”，三重否定仍在 | drops 凡是; the three negatives remain
杂志属于刊物，不能和刊物并列 | 杂志 are 刊物, so they cannot stand beside them | 去掉“刊物”，报纸、书籍、杂志各不相同 | without 刊物, 报纸, 书籍 and 杂志 are all different | 刊物和杂志仍然并列 | 刊物 and 杂志 still stand side by side | 刊物和杂志仍然并列 | 刊物 and 杂志 still stand side by side | 删了“整齐地”，刊物和杂志仍然并列 | drops 整齐地; 刊物 and 杂志 still stand side by side
`,
  },
  "faulty-ambiguous": {
    intro: t(
      "A sentence is faulty when it can be read two ways. 三个学校的老师参加了这次培训 may be three teachers from a school, or the teachers of three schools. 三所学校的老师 leaves one reading: 所 counts schools, never people.\n\nThe first knowledge point finds a sentence with two meanings, the second chooses its correction.",
      "一句话能有两种理解，就是表意不明。“三个学校的老师参加了这次培训”可以是三位老师，也可以是三所学校的老师。改成“三所学校的老师”，就只剩一种意思：“所”只数学校，不数人。\n\n第一个知识点找出表意不明的句子，第二个选出正确的改法。",
    ),
    test: t(
      "Ask of each sentence what else it could mean: cut its phrases another way, read a word in its other sense, or let 他 stand for the other person.",
      "对每个句子问一问：还能怎样理解？换一种方式切分短语，把词换成另一个意思，或者让“他”指另一个人。",
    ),
    watch: t(
      "A revision that adds 都, 了 or 很 leaves both readings standing. The correction must change the very word or phrase that can be read two ways.",
      "加上“都”“了”“很”这样的词，两种理解仍然都在。修改必须改动那个能有两种理解的词或短语本身。",
    ),
    notes: `
可以是三位老师，也可以是三所学校的老师 | it may be three teachers, or the teachers of three schools | “所”只数学校，说的是三所学校的老师 | 所 counts only schools: the teachers of three schools | 加了“都”，仍有两种理解 | adds 都; still two readings | 删了“的”，仍有两种理解 | drops 的; still two readings | 删了“这次”，仍有两种理解 | drops 这次; still two readings
可以是几位大夫，也可以是几家医院的大夫 | it may be a few doctors, or the doctors of a few hospitals | “位”只数人，说的是几位大夫 | 位 counts only people: a few doctors | 加了“都”，仍有两种理解 | adds 都; still two readings | 删了“的”，仍有两种理解 | drops 的; still two readings | 加了“了”，仍有两种理解 | adds 了; still two readings
两个“他”不知道各指谁，看不出是谁帮谁 | the two 他 could be either: who helps whom is unclear | 说出名字，谁帮谁清清楚楚 | with the names, who helps whom is clear | 后一个“他”仍不知道指谁 | the last 他 is still unclear | 只把“经常”换成“常常”，仍不清楚 | only 常常 for 经常; still unclear | 加了“热心地”，仍不清楚 | adds 热心地; still unclear
“背着”可以是驮着，也可以是瞒着 | 背着 may be carrying on the back, or hiding from | “瞒着”只有一种意思 | 瞒着 has one meaning only | “背着”仍有两种理解 | 背着 still has two readings | “背着”仍有两种理解 | 背着 still has two readings | “背着”仍有两种理解 | 背着 still has two readings
可以是狗咬死了猎人，也可以是有人咬死了猎人的狗 | the dog may have killed the hunter, or something killed the hunter's dog | “把猎人咬死了的狗”只能是狗咬死了猎人 | 把猎人咬死了的狗 can only be the dog that killed the hunter | 仍可以理解为咬死了猎人的那只狗 | it can still mean killing the hunter's dog | 仍有两种理解 | still two readings | 删了“了”，仍有两种理解 | drops 了; still two readings
可以是领导批评他，也可以是他对领导提出的批评 | it may be the leaders' criticism of him, or his criticism of the leaders | 说成“领导批评他”，只有一种意思 | 领导批评他 has one meaning only | 只把“正确”换成“对”，仍有两种理解 | only 对 for 正确; still two readings | 只改了“是”，仍有两种理解 | only 是 is changed; still two readings | 加了“的”，仍有两种理解 | adds 的; still two readings
“想起来”可以是记起来，也可以是想要起床 | 想起来 may be remembering, or wanting to get up | “记起来”只有一种意思 | 记起来 has one meaning only | 只换了语气词，仍有两种理解 | only the final particle changes; still two readings | 加了“已经”，仍有两种理解 | adds 已经; still two readings | 加了“又”，仍有两种理解 | adds 又; still two readings
可以是鸡不吃东西了，也可以是人不吃鸡了 | the chicken may have stopped eating, or people stopped eating chicken | “鸡已经吃饱了”说明是鸡不吃 | 鸡已经吃饱了 shows the chicken is the one not eating | 加了“再”，仍有两种理解 | adds 再; still two readings | 加了“这只”，仍有两种理解 | adds 这只; still two readings | 加了“都”，仍有两种理解 | adds 都; still two readings
可以是老师高兴，也可以是他高兴 | it may be the teacher who is glad, or he | “心里很高兴”说的是老师 | 心里很高兴, after a comma, belongs to the teacher | 只把“高兴”换成“开心”，仍有两种理解 | only 开心 for 高兴; still two readings | 只把“看到”换成“看见”，仍有两种理解 | only 看见 for 看到; still two readings | 只把“很”换成“十分”，仍有两种理解 | only 十分 for 很; still two readings
可以是张老师本人和李老师的学生，也可以是两位老师的学生 | it may be 张老师 himself and 李老师's students, or both teachers' students | 两个“的学生”说清了是两位老师的学生 | with 的学生 twice, it is both teachers' students | 只把“都”换成“全”，仍有两种理解 | only 全 for 都; still two readings | 只把“和”换成“跟”，仍有两种理解 | only 跟 for 和; still two readings | 加了“几个”，仍有两种理解 | adds 几个; still two readings
`,
  },
};
