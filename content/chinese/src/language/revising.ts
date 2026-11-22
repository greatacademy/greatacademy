// The revising topics of grades 3 and 4 (docs/chinese-curriculum.md §18.9): correcting the obvious mistakes of a
// draft, a wrong character or a wrong word, in grade 3, and faulty sentences and the better word in grade 4. Each
// sentence is written for this subject with one mistake in it; the options are ways to correct it, and the wrong ones
// either change what was right or correct it the wrong way.

import { type Text, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { bilingual, type Choice, choice, choiceTopicGenerator, type Heads, rows } from "./choice-kit.ts";

/** differing is the one character in which two words of the same length differ, failing when there is not just one. */
function differing(a: string, b: string): readonly [string, string] {
  const x = [...a];
  const y = [...b];
  const at = x.flatMap((c, i) => (c !== y[i] ? [i] : []));
  if (x.length !== y.length || at.length !== 1) throw new Error(`revising: ${a} and ${b} must differ in one character`);
  return [x[at[0]!]!, y[at[0]!]!];
}

/** pair reads `a>b` as its two sides. */
function pair(field: string): readonly [string, string] {
  const [a = "", b = ""] = field.split(">");
  if (a === "" || b === "") throw new Error(`revising: ${field} needs a>b`);
  return [a, b];
}

/** change words an option of correcting: change from into to. */
const change = (from: string, to: string): string => `把“${from}”改成“${to}”`;

/**
 * characterChoices are the questions of a wrong character: `sentence | wrong>right word | a right word of the sentence:
 * its character>a change | a wrong correction | why the right character, Chinese ~ English`.
 */
function characterChoices(data: string): readonly Choice[] {
  return rows(data, 5).map(([sentence, words, kept, miss, note]) => {
    const [bad, good] = pair(words!);
    const [x, y] = differing(bad, good);
    const [keptWord = "", keptChange = ""] = kept!.split(":");
    const [k, kc] = pair(keptChange);
    const n = bilingual(note!);
    if (!sentence!.includes(bad) || !sentence!.includes(keptWord) || !keptWord.includes(k)) throw new Error(`revising: ${sentence}`);
    const fixed = sentence!.replace(bad, good);
    return choice({
      ask: t("This sentence has one wrong character. How should it be corrected?", "这句话里有一个错别字。应该怎样改？"),
      shown: sentence!,
      right: change(x, y),
      wrong: [
        [
          change(k, kc),
          t(
            `${keptWord} is written correctly, so ${k} needs no change; the wrong word is ${bad}.`,
            `“${keptWord}”没有写错，“${k}”不用改；句子里写错的是“${bad}”。`,
          ),
        ],
        [
          change(x, miss!),
          t(
            `${x} is indeed wrong, but ${miss} is no better: the word is written ${good}.`,
            `“${x}”确实写错了，可改成“${miss}”还是不对，这个词要写成“${good}”。`,
          ),
        ],
      ],
      find: t(
        `Read the sentence word by word and ask of each whether it is written as it should be. ${bad} is not: the word is ${good}.`,
        `一个词一个词地读，看每个词是不是写对了。“${bad}”写错了，这个词是“${good}”。`,
      ),
      choose: t(`${y}: ${n.en}. So ${x} is changed into ${y}.`, `“${y}”：${n["zh-CN"]}。所以要把“${x}”改成“${y}”。`),
      check: t(`Read it corrected: ${fixed} Every word is now written right.`, `改好后读一遍：${fixed}每个词都写对了。`),
    });
  });
}

/**
 * wordChoices are the questions of a wrong word: `sentence | wrong>right word | why, Chinese ~ English | a right word of
 * the sentence>a change | wrong>another wrong word | why that is wrong too, Chinese ~ English`.
 */
function wordChoices(data: string, ask: Text): readonly Choice[] {
  return rows(data, 6).map(([sentence, words, why, kept, miss, missWhy]) => {
    const [bad, good] = pair(words!);
    const [k, kc] = pair(kept!);
    const [mb, mw] = pair(miss!);
    const w = bilingual(why!);
    const mwhy = bilingual(missWhy!);
    if (!sentence!.includes(bad) || !sentence!.includes(k) || mb !== bad) throw new Error(`revising: ${sentence}`);
    const fixed = sentence!.replace(bad, good);
    return choice({
      ask,
      shown: sentence!,
      right: change(bad, good),
      wrong: [
        [
          change(k, kc),
          t(
            `${k} is used rightly, and changing it does not mend the sentence; the word that does not fit is ${bad}.`,
            `“${k}”用得没有错，换了也改不好这句话；用得不对的是“${bad}”。`,
          ),
        ],
        [change(mb, mw), t(`${mwhy.en}.`, `${mwhy["zh-CN"]}。`)],
      ],
      find: t(
        `Read the sentence and ask whether each word fits what the rest says. ${bad} does not: ${w.en}.`,
        `读一读句子，看每个词和前后的意思合不合。“${bad}”不合：${w["zh-CN"]}。`,
      ),
      choose: t(
        `The word that fits is ${good}. So ${bad} is changed into ${good}.`,
        `合适的词是“${good}”，所以要把“${bad}”改成“${good}”。`,
      ),
      check: t(`Read it corrected: ${fixed} Every word now fits.`, `改好后读一遍：${fixed}每个词都用得合适了。`),
    });
  });
}

/**
 * sentenceChoices are the questions of a faulty sentence: `sentence | the corrected sentence | what is wrong, Chinese ~
 * English | a correction that misses | why, Chinese ~ English | another that misses | why, Chinese ~ English`.
 */
function sentenceChoices(data: string): readonly Choice[] {
  return rows(data, 7).map(([sentence, fixed, what, miss1, why1, miss2, why2]) => {
    const w = bilingual(what!);
    const a = bilingual(why1!);
    const b = bilingual(why2!);
    return choice({
      ask: t("This sentence is faulty. Which is the right correction?", "这是一个病句。哪一种改法是对的？"),
      shown: sentence!,
      right: fixed!,
      wrong: [
        [miss1!, t(`${a.en}.`, `${a["zh-CN"]}。`)],
        [miss2!, t(`${b.en}.`, `${b["zh-CN"]}。`)],
      ],
      find: t(`Read the sentence and ask what is wrong with it: ${w.en}.`, `读一读句子，想想它病在哪里：${w["zh-CN"]}。`),
      choose: t(
        `The right correction mends just that, and keeps what the sentence meant: “${fixed}”`,
        `对的改法正好改掉这个毛病，句子原来的意思也没有变：“${fixed}”`,
      ),
      check: t(
        `Read the corrected sentence aloud: “${fixed}” It is whole, its words go together, and it does not say a thing twice or contradict itself.`,
        `把改好的句子读一遍：“${fixed}”句子完整，词语搭配得当，没有重复，也没有前后矛盾。`,
      ),
    });
  });
}

/**
 * betterWordChoices are the questions of the better word: `sentence with ＿ | the word | why, Chinese ~ English | another
 * word | why it is worse, Chinese ~ English | another word | why, Chinese ~ English`.
 */
function betterWordChoices(data: string): readonly Choice[] {
  return rows(data, 7).map(([sentence, right, why, w1, why1, w2, why2]) => {
    if (!sentence!.includes("＿")) throw new Error(`revising: ${sentence} has no gap`);
    const w = bilingual(why!);
    const a = bilingual(why1!);
    const b = bilingual(why2!);
    const filled = sentence!.replace("＿", right!);
    return choice({
      ask: t("Which word fits the gap best?", "哪个词填在横线上最恰当？"),
      shown: sentence!,
      right: right!,
      wrong: [
        [w1!, t(`${a.en}.`, `${a["zh-CN"]}。`)],
        [w2!, t(`${b.en}.`, `${b["zh-CN"]}。`)],
      ],
      find: t(
        "The words are close in sound or meaning; ask which goes with the words around the gap and says what is meant.",
        "这几个词读音或者意思相近，要看哪一个和横线前后的词搭配，意思也正好。",
      ),
      choose: t(`${right}: ${w.en}.`, `“${right}”：${w["zh-CN"]}。`),
      check: t(`Read it filled in: ${filled} The word goes with the words around it.`, `填好后读一遍：${filled}词语和前后搭配得当。`),
    });
  });
}

/** WRONG_CHARACTERS are the sentences of grade 3 with a wrong character in them. */
const WRONG_CHARACTERS = `
星期天，我们一起去公圆玩。 | 公圆>公园 | 一起:起>齐 | 元 | 方框里是“元”，是种着花草树木的地方 ~ 元 in a frame, a place of trees and flowers
今天天气很好，天空睛朗。 | 睛朗>晴朗 | 天气:气>汽 | 清 | 日字旁，天上有太阳、没有云 ~ with 日, the sun out and no clouds
我写错了一个字，就用橡皮把它檫掉了。 | 檫掉>擦掉 | 橡皮:皮>皱 | 察 | 提手旁，是用手来回抹 ~ with 扌, rubbing by hand
我们排着正齐的队伍走进教室。 | 正齐>整齐 | 队伍:队>对 | 争 | “整齐”是有条理、不乱，用的是“整”字 ~ 整齐 is orderly, and is written with 整
老师在黑板上画了一个园形。 | 园形>圆形 | 黑板:板>版 | 元 | 方框里是“员”，是圆的形状 ~ 员 in a frame, round
我们要爱护小树，不要乱拆树枝。 | 乱拆>乱折 | 爱护:护>户 | 析 | 提手旁加斤，是把东西弄断 ~ with 扌 and 斤, to break off
秋天到了，树叶一片片漂落下来。 | 漂落>飘落 | 树叶:叶>页 | 票 | 有“风”字，是在风里飞舞 ~ with 风, drifting in the wind
爷爷每天早上都去公园锻练身体。 | 锻练>锻炼 | 身体:体>休 | 连 | 火字旁，是用火冶炼，引申为锻炼 ~ with 火, to temper as metal in fire
这道题很难，我想了很久才想出办发。 | 办发>办法 | 很久:久>九 | 伐 | 三点水，是做事的方法 ~ with 氵, a way of doing
弟弟不小心把杯子打破了，他很报歉。 | 报歉>抱歉 | 杯子:杯>怀 | 包 | 提手旁，“抱歉”是心里过意不去 ~ with 扌, 抱歉 is to feel sorry
老师的话像春风一样温暧。 | 温暧>温暖 | 老师:师>帅 | 缓 | 日字旁，是太阳带来的热 ~ with 日, warmth from the sun
天上的星星一闪一闪的，好像在贬眼睛。 | 贬眼睛>眨眼睛 | 星星:星>醒 | 乏 | 目字旁，是眼睛很快地一开一合 ~ with 目, the eyes opening and shutting quickly
`;

/** WRONG_WORDS are the sentences of grade 3 with a word that does not fit. */
const WRONG_WORDS = `
他头上穿着一顶新帽子。 | 穿>戴 | 帽子是戴在头上的，“穿”说的是衣服、鞋子 ~ a hat is worn with 戴; 穿 is for clothes and shoes | 新>大 | 穿>拿 | “拿”是用手拿着，帽子却在头上 ~ 拿 is holding in the hand, but the hat is on his head
弟弟一口气吃完了一杯牛奶。 | 吃>喝 | 牛奶是喝的，不是吃的 ~ milk is drunk, not eaten | 一口气>一下子 | 吃>咬 | 牛奶像水一样，不能咬 ~ milk is like water and cannot be bitten
秋天到了，田野里一片金黄，农民伯伯忙着播种。 | 播种>收割 | 一片金黄说明庄稼熟了，这时要收割，不是播种 ~ golden fields mean the crops are ripe: it is time to harvest, not to sow | 金黄>碧绿 | 播种>浇水 | 庄稼熟了不用再浇水，要收回来 ~ ripe crops need no more water; they are brought in
小明考试得了满分，他伤心地笑了。 | 伤心>开心 | 得了满分是高兴的事，笑也是高兴，“伤心”和它们合不上 ~ full marks and a smile are glad, and 伤心, sad, does not fit them | 考试>比赛 | 伤心>生气 | 得了满分不会生气，生气的人也不会笑 ~ no one is angry at full marks, nor smiles in anger
夏天到了，天气越来越冷了。 | 冷>热 | 夏天到了，天气是越来越热 ~ when summer comes, the weather grows hotter | 夏天>春天 | 冷>凉 | 夏天的天气也不会越来越凉，要越来越热 ~ summer does not grow cooler either; it grows hotter
一只小鸟在天空中游来游去。 | 游>飞 | 鸟在天上是飞，鱼在水里才是游 ~ birds fly in the sky; only fish swim, in water | 天空>树林 | 游>跑 | 鸟在天空中不是跑，是飞 ~ a bird in the sky does not run; it flies
妈妈做的饭菜臭喷喷的，真好吃。 | 臭>香 | 好吃的饭菜是香的，“臭”和“真好吃”合不上 ~ good food smells sweet, and 臭, foul, does not fit 真好吃 | 饭菜>面条 | 臭>辣 | 没有“辣喷喷”这个说法，饭菜好吃要说“香喷喷” ~ there is no 辣喷喷; good food is 香喷喷
下课铃响了，同学们安静地冲出教室。 | 安静>欢快 | 冲出教室又快又热闹，不会是安静的 ~ rushing out is quick and noisy, not quiet | 教室>校门 | 安静>慢慢 | “慢慢地”和“冲出”合不上，冲是很快的 ~ 慢慢 does not fit 冲, which is fast
爸爸的身体很瘦弱，一口气能爬到山顶。 | 瘦弱>强壮 | 能一口气爬到山顶，身体是强壮的，“瘦弱”说反了 ~ one who climbs to the top at a stretch is strong; 瘦弱, frail, says the opposite | 山顶>楼顶 | 瘦弱>漂亮 | “漂亮”说的是样子好看，跟能不能爬山没有关系 ~ 漂亮 is about looks, not about being able to climb
雨越下越大，我连忙打开了窗户。 | 打开>关上 | 雨下大了，要关上窗户，雨才进不来 ~ as the rain grows heavier, the window is shut to keep it out | 连忙>慢慢 | 打开>擦干净 | 雨正下着，擦窗户没有用，要先把窗户关上 ~ cleaning the window in the rain is no use; it should be shut
我用力地推开门，生怕吵醒熟睡的弟弟。 | 用力>轻轻 | 怕吵醒弟弟，就要轻轻地推门；用力推会吵醒他 ~ not to wake him the door is pushed gently; pushing hard would wake him | 弟弟>妹妹 | 用力>很快 | 很快地推门也会有声音，怕吵醒人要轻轻地 ~ a quick push makes a noise too; not to wake someone it is pushed gently
`;

/** FAULTY_SENTENCES are the faulty sentences of grade 4, each with one fault. */
const FAULTY_SENTENCES = `
他穿着一件红衣服和一顶红帽子。 | 他穿着一件红衣服，戴着一顶红帽子。 | 帽子不能“穿”，“穿”只能和衣服搭配 ~ a hat is not 穿, worn as clothes are; 穿 goes only with the clothes | 他穿着一件衣服和一顶红帽子。 | 删掉“红”字没有改到错处，帽子还是“穿着”的 ~ dropping 红 does not touch the fault: the hat is still 穿 | 他戴着一件红衣服和一顶红帽子。 | 衣服不能“戴”，这样改又让前一半错了 ~ clothes are not 戴, so this spoils the first half instead
为了参加比赛，每天都在操场上练习跑步。 | 为了参加比赛，小明每天都在操场上练习跑步。 | 句子缺了做事的人，不知道是谁在练习 ~ the sentence lacks the one who acts: we cannot tell who practises | 为了参加比赛，每天都在操场上认真练习跑步。 | 加了“认真”，还是不知道是谁在练习 ~ adding 认真 still does not say who practises | 参加比赛，每天都在操场上练习跑步。 | 删掉“为了”，句子还是缺了做事的人 ~ dropping 为了 still leaves out who acts
他把作业仔细地认真检查了一遍。 | 他把作业仔细地检查了一遍。 | “仔细”和“认真”意思重复，留一个就够了 ~ 仔细 and 认真 say the same, and one is enough | 他把作业仔细地认真地检查了一遍。 | 加了一个“地”，两个意思相同的词还在一起 ~ adding a 地 leaves the two words of one meaning together | 他认真地把作业仔细检查了一遍。 | 换了位置，“认真”和“仔细”还是重复 ~ moving them leaves 认真 and 仔细 still repeating each other
我估计他今天一定会来。 | 我估计他今天会来。 | “估计”是不能肯定，“一定”是肯定，前后矛盾 ~ 估计 is a guess and 一定 a certainty: the sentence contradicts itself | 我估计他今天一定会来的。 | 加了“的”，“估计”和“一定”还是矛盾 ~ adding 的 leaves 估计 and 一定 contradicting | 我估计他今天一定不会来。 | 意思变了，“估计”和“一定”还是矛盾 ~ the meaning changes, and 估计 still contradicts 一定
秋天的果园里，挂满了红红的苹果和金黄的稻子。 | 秋天的果园里，挂满了红红的苹果和金黄的梨。 | 稻子长在田里，不会挂在果园的树上 ~ rice grows in fields and does not hang in an orchard | 秋天的果园里，挂满了红红的苹果和金黄的稻穗。 | 稻穗也是稻子，还是不会挂在果园里 ~ rice ears are rice too and still do not hang in an orchard | 秋天的果园里，长满了红红的苹果和金黄的稻子。 | 改了“挂”字，果园里还是有稻子 ~ changing 挂 still leaves rice in the orchard
通过这次活动，使我们懂得了团结的重要。 | 通过这次活动，我们懂得了团结的重要。 | 有了“通过……使……”，句子就没有了做事的人，删掉“使”，“我们”才是懂得的人 ~ with 通过 and 使 together the sentence has no one who acts; without 使, 我们 is the one who understands | 通过这次活动，使我们更懂得了团结的重要。 | 加了“更”，“通过”和“使”还在一起，句子还是缺了做事的人 ~ adding 更 leaves 通过 and 使 together, still without anyone acting | 通过这次活动，使大家懂得了团结的重要。 | 换成“大家”，“通过”和“使”还在一起 ~ putting 大家 for 我们 leaves 通过 and 使 together
操场上的同学大约有一百人左右。 | 操场上的同学大约有一百人。 | “大约”和“左右”都是说不准确的数，意思重复 ~ 大约 and 左右 both mark a rough number and repeat each other | 操场上的同学大约有一百多人左右。 | 加了“多”，“大约”和“左右”还在一起 ~ adding 多 leaves 大约 and 左右 together | 操场上的同学一共大约有一百人左右。 | 加了“一共”，又多了一层矛盾，“大约”和“左右”也还在 ~ adding 一共, all told, makes it worse, and 大约 and 左右 remain
我们怀着激动的心情，听着老师讲的故事和一幅幅图画。 | 我们怀着激动的心情，听着老师讲的故事，看着一幅幅图画。 | 图画是看的，不能“听” ~ pictures are seen, not 听, heard | 我们怀着激动的心情，听着老师讲的故事和一幅幅美丽的图画。 | 加了“美丽的”，图画还是“听着”的 ~ adding 美丽的 leaves the pictures still heard | 我们怀着激动的心情，看着老师讲的故事和一幅幅图画。 | 换成“看”，故事又不能“看着”老师讲 ~ with 看, a story told by the teacher is now seen instead of heard
小红的作文写得很好，经常受到。 | 小红的作文写得很好，经常受到老师的表扬。 | 句子没说完，不知道受到了什么 ~ the sentence is unfinished: we cannot tell what she received | 小红的作文写得很好，经常受到很多。 | 加了“很多”，还是不知道受到了什么 ~ adding 很多 still does not say what she received | 小红的作文写得很好，常常受到。 | 换成“常常”，句子还是没说完 ~ putting 常常 for 经常 leaves it unfinished
我们把教室打扫得干干净净，可是地上还有很多纸屑。 | 我们把教室打扫得干干净净，地上一点纸屑也没有。 | 干干净净的教室不会有很多纸屑，前后矛盾 ~ a spotless room has no litter, so the two halves contradict | 我们把教室打扫得很干净，可是地上还有很多纸屑。 | 换成“很干净”，还是和“很多纸屑”矛盾 ~ 很干净 still contradicts the litter | 我们把教室打扫得干干净净，可是地上还有一些纸屑。 | 换成“一些”，干干净净的地上还是有纸屑 ~ 一些 still leaves litter on a spotless floor
这件事，我非常极其后悔。 | 这件事，我非常后悔。 | “非常”和“极其”意思一样，用一个就够了 ~ 非常 and 极其 mean the same, and one is enough | 这件事，我非常极其地后悔。 | 加了“地”，两个意思一样的词还在一起 ~ adding 地 leaves the two words of one meaning together | 这件事，我极其非常后悔。 | 换了顺序，还是重复 ~ swapping them still repeats
`;

/** BETTER_WORDS are the sentences of grade 4 with a gap, and the words that might fill it. */
const BETTER_WORDS = `
我们要＿时间，不要浪费一分一秒。 | 珍惜 | 珍惜是看重、不浪费，正合“不要浪费” ~ to treasure and not waste, just as 不要浪费 says | 珍贵 | “珍贵”是说东西价值大，后面不能接“时间” ~ 珍贵 says a thing is precious and cannot take 时间 after it | 保护 | “保护”是不让受到伤害，说时间要用“珍惜” ~ 保护 is to keep from harm; time is 珍惜, treasured
经过大家的努力，这个问题终于＿了。 | 解决 | 问题是“解决”的 ~ a problem is 解决, solved | 完成 | “完成”说任务、作业，不说问题 ~ 完成 is said of a task or homework, not of a problem | 结束 | “结束”是事情停止了，问题要说“解决” ~ 结束 is for something stopping; a problem is 解决
他的作文写得很好，受到了老师的＿。 | 表扬 | 写得好，得到的是老师的称赞 ~ good writing earns the teacher's praise | 批评 | 写得好不会受到批评，意思反了 ~ good writing is not criticised: it says the opposite | 表演 | “表演”是演节目，和作文写得好没有关系 ~ 表演 is a performance and has nothing to do with good writing
这座大桥非常＿，上面能同时开过很多辆汽车。 | 坚固 | “坚固”说东西结实，不容易坏 ~ 坚固 says a thing is solid and hard to break | 坚强 | “坚强”说人的意志，不说桥 ~ 坚强 is said of a person's will, not of a bridge | 坚决 | “坚决”说态度，不说桥 ~ 坚决 is said of a stance, not of a bridge
山上的风景非常＿，我们都看得入迷了。 | 优美 | “优美”说风景、歌声好看好听 ~ 优美 is said of lovely scenery or song | 优秀 | “优秀”说人或者成绩，不说风景 ~ 优秀 is said of a person or their marks, not of scenery | 优良 | “优良”说品种、作风，不说风景 ~ 优良 is said of a breed or a manner, not of scenery
小明做事非常＿，作业从来没有写错过一个字。 | 细心 | “细心”是想得周到、不粗心，所以不写错 ~ 细心 is careful and thorough, and so makes no slips | 粗心 | 粗心的人常常写错，意思反了 ~ a careless one makes slips: it says the opposite | 开心 | “开心”说心情，和不写错字没有关系 ~ 开心 is about mood and has nothing to do with making no slips
听到这个好消息，大家都＿得跳了起来。 | 高兴 | 好消息让人高兴，高兴得跳起来 ~ good news makes one glad, glad enough to jump | 难过 | 好消息不会让人难过，意思反了 ~ good news does not make one sad: it says the opposite | 着急 | “着急”是心里急，好消息不会让人着急得跳起来 ~ 着急 is worry, and good news does not make one jump with worry
看书的时候，眼睛和书要保持一定的＿。 | 距离 | “距离”是两样东西隔着多远 ~ 距离 is how far apart two things are | 长度 | “长度”说一样东西有多长，不说两样东西隔多远 ~ 长度 is how long one thing is, not how far apart two are | 时间 | “时间”说多久，这里说的是远近 ~ 时间 is how long, but this is about how far
他是一个＿的孩子，从来不说谎。 | 诚实 | “诚实”是说真话，不骗人，正合“不说谎” ~ 诚实 is telling the truth, just as 不说谎 says | 真实 | “真实”说事情是真的，不说人的品质 ~ 真实 says a thing is true, not what a person is like | 成熟 | “成熟”是长大、懂事，和不说谎没有直接关系 ~ 成熟 is grown up, and has nothing directly to do with not lying
我们＿了一个周末去爬山的计划。 | 制定 | 计划是“制定”的，就是想好、定下来 ~ a plan is 制定, drawn up | 制作 | “制作”是做东西，比如做风筝，不说计划 ~ 制作 is making a thing, such as a kite, not a plan | 决定 | “决定”是拿定主意，后面不接“计划” ~ 决定 is making up one's mind, and does not take 计划 after it
这只小猫的眼睛又圆又亮，＿两颗宝石。 | 像 | 眼睛不是真的宝石，打比方要用“像” ~ the eyes are not real jewels, so the comparison takes 像 | 是 | 小猫的眼睛不是真的宝石，用“是”就说错了 ~ the cat's eyes are not really jewels, so 是 says something false | 和 | “和两颗宝石”句子不完整，也不是打比方 ~ 和 两颗宝石 leaves the sentence unfinished, and makes no comparison
大雪过后，整个世界都变成了＿的。 | 白茫茫 | 雪是白的，“白茫茫”写出了到处一片白 ~ snow is white, and 白茫茫 shows white everywhere | 黑乎乎 | 下雪后到处是白的，不是黑的 ~ after snow all is white, not dark | 绿油油 | “绿油油”说庄稼草木，雪是白的 ~ 绿油油 is said of green crops and grass; snow is white
`;

/** CHARACTER_HEADS and WORD_HEADS are the headings of the steps of correcting a character and a word. */
const CHARACTER_HEADS: Heads = {
  find: t("**Step 1: find the word written wrong.**", "**第一步：找出写错的词。**"),
  choose: t("**Step 2: put the right character in.**", "**第二步：换上对的字。**"),
};
const WORD_HEADS: Heads = {
  find: t("**Step 1: find the word that does not fit.**", "**第一步：找出用得不对的词。**"),
  choose: t("**Step 2: put the fitting word in.**", "**第二步：换上合适的词。**"),
};

/** SENTENCE_HEADS and BETTER_HEADS are the headings of the steps of correcting a sentence and choosing a word. */
const SENTENCE_HEADS: Heads = {
  find: t("**Step 1: find what is wrong with the sentence.**", "**第一步：找出句子的毛病。**"),
  choose: t("**Step 2: choose the correction that mends just that.**", "**第二步：选出正好改掉毛病的改法。**"),
};
const BETTER_HEADS: Heads = {
  find: t("**Step 1: read the whole sentence.**", "**第一步：把整句读完。**"),
  choose: t("**Step 2: choose the word that goes with the rest.**", "**第二步：选出和前后搭配的词。**"),
};

/** revisingTopics are the revising topics of grades 3 and 4. */
export const revisingTopics: readonly GradeTopic[] = [
  {
    grade: 3,
    topic: {
      id: "revising-3",
      title: t("Correcting Obvious Mistakes", "修改明显错误的词句"),
      summary: t(
        "Finding and correcting the obvious mistakes of a draft: a character written wrong, and a word that does not fit.",
        "找出并改正习作里明显的错误：写错的字，用得不对的词。",
      ),
      intro: t(
        "Read a draft again before handing it in, and correct what is plainly wrong. In “星期天，我们一起去公圆玩。” 公圆 is written wrong: a park is 公园, so 圆 is changed into 园. In “他头上穿着一顶新帽子。” the word 穿 does not fit: a hat is worn with 戴.\n\nCorrect only the mistake, and leave what is right as it is. The first knowledge point corrects wrong characters, the second wrong words.",
        "写完习作，交上去以前要再读一遍，把明显的错误改过来。比如“星期天，我们一起去公圆玩。”“公圆”写错了，应该是“公园”，要把“圆”改成“园”。又如“他头上穿着一顶新帽子。”“穿”用得不对，帽子要说“戴”。\n\n只改错的地方，对的地方不要动。第一个知识点改错别字，第二个改用错的词。",
      ),
      prerequisites: ["language-3-similar-characters"],
      encompasses: [],
      xp: 12,
      strand: "writing",
      knowledgePoints: [
        point(
          "revising-3-characters",
          t("Wrong Characters", "改错别字"),
          t(
            "A wrong character is most often one that looks or sounds like the right one. Read each word and ask whether it is written as it should be; then choose the right character by its meaning and its component.\n\nIn “爷爷每天早上都去公园锻练身体。” 锻练 is wrong: 锻炼 is written with 炼, which has 火, fire, as metal is tempered.\n\n> **Watch out.** Change only the wrong character. Changing a word that was right, or putting in another wrong character, does not correct the sentence.",
            "错别字常常是和对的字形近或者同音的字。一个词一个词地读，看是不是写对了；再按字的意思和偏旁选出对的字。\n\n比如“爷爷每天早上都去公园锻练身体。”“锻练”写错了：“锻炼”的“炼”是火字旁，像用火炼铁一样。\n\n> **注意。** 只改写错的那个字。把对的词改了，或者换上另一个错字，句子都还是错的。",
          ),
          choiceTopicGenerator(characterChoices(WRONG_CHARACTERS), CHARACTER_HEADS),
        ),
        point(
          "revising-3-words",
          t("Wrong Words", "改用错的词"),
          t(
            "A wrong word is one that does not fit the rest of the sentence: it says the opposite, or it does not go with the words around it. Ask of each word whether it fits what the sentence tells.\n\nIn “雨越下越大，我连忙打开了窗户。” 打开 does not fit: when the rain grows heavier, the window is shut, 关上.\n\n> **Watch out.** A word may be fine on its own and still wrong in its sentence. Read it with the words before and after it.",
            "用错的词，是和句子里别的意思合不上的词：意思说反了，或者和前后的词搭配不起来。要看每个词和句子说的事合不合。\n\n比如“雨越下越大，我连忙打开了窗户。”“打开”不合适：雨下大了，应该“关上”窗户。\n\n> **注意。** 一个词单看没有错，放在句子里也可能用错了。要连着前后的词一起读。",
          ),
          choiceTopicGenerator(
            wordChoices(
              WRONG_WORDS,
              t("One word of this sentence does not fit. How should it be corrected?", "这句话里有一个词用得不对。应该怎样改？"),
            ),
            WORD_HEADS,
          ),
        ),
      ],
    },
  },
  {
    grade: 4,
    topic: {
      id: "revising-4",
      title: t("Revising Sentences", "修改病句和用词不当"),
      summary: t(
        "Correcting the common faults of a sentence, a missing part, words that do not go together, repetition and contradiction, and choosing the better of words alike.",
        "修改常见的病句：缺成分、搭配不当、重复、前后矛盾；在相近的词语中选出最恰当的。",
      ),
      intro: t(
        "A sentence can be faulty in a few common ways: it lacks a part, its words do not go together, it says a thing twice, or it contradicts itself. In “我估计他今天一定会来。” 估计 is a guess and 一定 a certainty; taking out 一定 mends it.\n\nWords alike in sound or meaning also need care: time is 珍惜, treasured, not 珍贵. The first knowledge point corrects faulty sentences, the second chooses the better word.",
        "病句常见的毛病有几种：缺了成分，词语搭配不当，意思重复，前后矛盾。比如“我估计他今天一定会来。”“估计”是不能肯定，“一定”是肯定，删掉“一定”就改好了。\n\n读音或意思相近的词也要用准：时间要“珍惜”，不说“珍贵”。第一个知识点修改病句，第二个选用恰当的词语。",
      ),
      prerequisites: ["revising-3"],
      encompasses: [],
      xp: 12,
      strand: "writing",
      knowledgePoints: [
        point(
          "revising-4-sentences",
          t("Faulty Sentences", "修改病句"),
          t(
            "Read the sentence and ask four questions: is a part missing, do the words go together, is something said twice, does it contradict itself? Then choose the correction that mends that fault and keeps the meaning.\n\n“他穿着一件红衣服和一顶红帽子。” A hat is not 穿: “他穿着一件红衣服，戴着一顶红帽子。”\n\n> **Watch out.** A change somewhere else in the sentence is not a correction. Adding or dropping a word that is not the fault leaves the sentence as faulty as before.",
            "读句子时问四个问题：缺没缺成分？词语搭配得当吗？有没有重复？前后矛盾吗？再选出改掉这个毛病、又不改变原意的改法。\n\n比如“他穿着一件红衣服和一顶红帽子。”帽子不能“穿”，要改成“他穿着一件红衣服，戴着一顶红帽子。”\n\n> **注意。** 改了句子里别的地方不算改对。加上或删掉一个不是毛病的词，句子还是病句。",
          ),
          choiceTopicGenerator(sentenceChoices(FAULTY_SENTENCES), SENTENCE_HEADS),
        ),
        point(
          "revising-4-words",
          t("The Better Word", "选用恰当的词语"),
          t(
            "Words close in sound or meaning are told apart by what they go with. Read the whole sentence, and ask which word goes with the words around it and says what is meant.\n\n“这座大桥非常＿”: a bridge is 坚固, solid; 坚强 is said of a person's will.\n\n> **Watch out.** A word that looks like the right one, such as 表演 for 表扬, may mean something else entirely. Read it in its place before choosing.",
            "读音或意思相近的词，要看它和什么词搭配。把整句读完，想想哪个词和前后的词搭配得当，意思也正好。\n\n比如“这座大桥非常＿”：桥要说“坚固”；“坚强”说的是人的意志。\n\n> **注意。** 和对的词样子很像的词，比如“表演”和“表扬”，意思可能完全不同。要放进句子里读一读再选。",
          ),
          choiceTopicGenerator(betterWordChoices(BETTER_WORDS), BETTER_HEADS),
        ),
      ],
    },
  },
];
