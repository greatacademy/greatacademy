// The revising topics of grades 3 to 6 (docs/chinese-curriculum.md §18.9): correcting the obvious mistakes of a
// draft, a wrong character or a wrong word, in grade 3; faulty sentences and the better word in grade 4; smooth
// sentences and their order in grade 5; the form of a page and punctuation in grade 6. Each sentence is written for
// this subject with one mistake in it; the options are ways to correct it, and the wrong ones either change what was
// right or correct it the wrong way.

import { type Text, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { bilingual, type Choice, choice, choiceTopicGenerator, type Heads, listedChoices, rows } from "./choice-kit.ts";

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

/**
 * punctuationChoices are the questions of a misused mark: `sentence | the corrected sentence | what is wrong, Chinese ~
 * English | a correction that misses | why, Chinese ~ English | another that misses | why, Chinese ~ English`.
 */
function punctuationChoices(data: string): readonly Choice[] {
  return rows(data, 7).map(([sentence, fixed, what, miss1, why1, miss2, why2]) => {
    const w = bilingual(what!);
    const a = bilingual(why1!);
    const b = bilingual(why2!);
    return choice({
      ask: t("One mark of this sentence is misused. Which is the right correction?", "这句话有一处标点用错了。哪一种改法是对的？"),
      shown: sentence!,
      right: fixed!,
      wrong: [
        [miss1!, t(`${a.en}.`, `${a["zh-CN"]}。`)],
        [miss2!, t(`${b.en}.`, `${b["zh-CN"]}。`)],
      ],
      find: t(
        `Read the sentence with its pauses and tone, and look at each mark: ${w.en}.`,
        `读一读句子的停顿和语气，看看每个标点：${w["zh-CN"]}。`,
      ),
      choose: t(
        `The right correction changes just that mark and keeps the words: “${fixed}”`,
        `对的改法只改这一处标点，字词都不变：“${fixed}”`,
      ),
      check: t(
        `Read “${fixed}” aloud: each pause and the tone at the end match its marks.`,
        `把“${fixed}”读一遍：每处停顿和句末的语气，都和标点对得上。`,
      ),
    });
  });
}

/**
 * orderChoices are the questions of putting sentences in order: `the sentences, each after its number ①②③④ | the right
 * order | why, Chinese ~ English | a wrong order | why, Chinese ~ English | another | why, Chinese ~ English`.
 */
function orderChoices(data: string): readonly Choice[] {
  const marks = ["①", "②", "③", "④"];
  return rows(data, 7).map(([sentences, right, why, w1, why1, w2, why2]) => {
    const parts = sentences!.split(/[①②③④]/u).slice(1);
    if (parts.length !== 4 || !marks.every((m) => sentences!.includes(m))) throw new Error(`revising: ${sentences}`);
    for (const o of [right!, w1!, w2!]) if ([...o].sort().join("") !== marks.join("")) throw new Error(`revising: order ${o}`);
    const paragraph = [...right!].map((m) => parts[marks.indexOf(m)]!.trim()).join("");
    const w = bilingual(why!);
    const a = bilingual(why1!);
    const b = bilingual(why2!);
    return choice({
      ask: t("In which order do these sentences make a smooth paragraph?", "这几句话按哪种顺序排列，才能成为一段通顺的话？"),
      shown: sentences!,
      right: right!,
      wrong: [
        [w1!, t(`${a.en}.`, `${a["zh-CN"]}。`)],
        [w2!, t(`${b.en}.`, `${b["zh-CN"]}。`)],
      ],
      find: t(
        "Look for the words that mark order, of time, of place, of steps, or of cause and result, and for the sentence that must come first.",
        "找一找表示顺序的词：时间、地点、做事的步骤、原因和结果，再看哪一句应该放在最前面。",
      ),
      choose: t(`${right}: ${w.en}.`, `${right}：${w["zh-CN"]}。`),
      check: t(
        `Read them in that order: ${paragraph} Each sentence follows from the one before.`,
        `按这个顺序读一遍：${paragraph}每一句都接得上前一句。`,
      ),
    });
  });
}

/** SMOOTH_SENTENCES are the sentences of grade 5 that do not read smoothly, each with one fault. */
const SMOOTH_SENTENCES = `
我们要发扬和继承中华民族的优良传统。 | 我们要继承和发扬中华民族的优良传统。 | 先继承，后发扬，词语的顺序颠倒了 ~ one inherits before carrying forward, and the order is reversed | 我们要发扬中华民族的优良传统和继承。 | 把“和继承”挪到最后，句子更不通了 ~ moving 和继承 to the end makes it worse | 我们要发扬和继承中华民族的传统。 | 删了“优良”，没有改到错处，顺序还是颠倒的 ~ dropping 优良 does not touch the fault: the order is still reversed
春天的公园是一个美丽的季节。 | 春天是一个美丽的季节。 | 公园不是季节，“公园”和“季节”搭配不当 ~ a park is not a season: 公园 and 季节 do not go together | 春天的公园是一个很美丽的季节。 | 加了“很”，公园还是被说成了季节 ~ adding 很 still makes the park a season | 夏天的公园是一个美丽的季节。 | 换成“夏天”，公园还是被说成了季节 ~ putting 夏天 for 春天 still makes the park a season
虽然天下着大雨，所以他还是按时到校了。 | 虽然天下着大雨，但是他还是按时到校了。 | “虽然”要和“但是”搭配，不能和“所以”搭配 ~ 虽然 pairs with 但是, not with 所以 | 因为天下着大雨，但是他还是按时到校了。 | “因为”和“但是”也不能搭配 ~ 因为 does not pair with 但是 either | 虽然天下着大雨，所以他按时到校了。 | 删了“还是”，“虽然……所以”还是用错了 ~ dropping 还是 leaves 虽然 … 所以 still wrong
小明和小刚是好朋友，他每天都去他家玩。 | 小明和小刚是好朋友，小明每天都去小刚家玩。 | 两个“他”分不清指的是谁 ~ the two 他 could be either boy | 小明和小刚是好朋友，他们每天都去他家玩。 | “他家”还是不知道是谁的家 ~ whose home 他家 is remains unclear | 小明和小刚是好朋友，他每天都去他的家玩。 | 加了“的”，两个“他”还是分不清 ~ adding 的 leaves the two 他 as unclear as before
听了这个故事，我们受到了很大的教育意义。 | 听了这个故事，我们受到了很大的教育。 | “受到”不能和“意义”搭配 ~ one 受到 an education, not a meaning | 听了这个故事，我们受到了很大的教育意义和启发。 | 加了“和启发”，“受到……意义”还在 ~ adding 和启发 leaves 受到 … 意义 | 读了这个故事，我们受到了很大的教育意义。 | 换成“读”，毛病还在 ~ putting 读 for 听 leaves the fault
我国的人口是世界上最多的国家。 | 我国是世界上人口最多的国家。 | “人口”不是“国家”，前后搭配不当 ~ a population is not a country | 我国的人口是世界上最多的国家之一。 | 加了“之一”，“人口”还是被说成国家 ~ adding 之一 still makes the population a country | 我国的人口是世界上很多的国家。 | 改了“最多”，毛病还在 ~ changing 最多 leaves the fault
同学们在操场上玩耍，有的跳绳，有的踢毽子，有的在教室里看书。 | 同学们在操场上玩耍，有的跳绳，有的踢毽子，有的在打篮球。 | 前面说在操场上，后面却在教室里，前后矛盾 ~ the first part says the playground and the last the classroom | 同学们在操场上玩耍，有的跳绳，有的踢毽子，有的在教室里认真看书。 | 加了“认真”，还是在教室里 ~ adding 认真 leaves it in the classroom | 同学们在操场上玩耍，有的跳绳，有的踢毽子，有的在教室里打篮球。 | 在教室里打篮球，还是和“在操场上”合不上 ~ basketball in the classroom still clashes with the playground
我昨天在书店买了一本新书和一支笔，我买了新书。 | 我昨天在书店买了一本新书和一支笔。 | 后半句又说了一遍买新书，重复啰嗦 ~ the last part says again that I bought a book | 我昨天在书店买了一本新书和一支笔，我买了笔。 | 换成“笔”，还是重复 ~ putting 笔 still repeats | 我昨天在书店买了一本书和一支笔，我买了新书。 | 删了“新”，重复还在 ~ dropping 新 leaves the repetition
我们要不断提高写作。 | 我们要不断提高写作水平。 | 没说清提高写作的什么，缺了“水平” ~ it does not say what of writing is raised: 水平 is missing | 我们要不断地提高写作。 | 加了“地”，还是缺 ~ adding 地 leaves it missing | 我们要不断提高写作和阅读。 | 加了“阅读”，还是没说提高什么 ~ adding 阅读 still does not say what is raised
妈妈买了一件很漂亮的给我毛衣。 | 妈妈给我买了一件很漂亮的毛衣。 | 词语的顺序乱了，“给我”放错了地方 ~ the words are out of order: 给我 is misplaced | 妈妈买了一件给我很漂亮的毛衣。 | “给我”还是放错了地方 ~ 给我 is still misplaced | 妈妈买了一件很漂亮的毛衣给。 | 删了“我”，句子不完整了 ~ dropping 我 leaves it unfinished
只要努力学习，才能取得好成绩。 | 只有努力学习，才能取得好成绩。 | “只有”才和“才”搭配，“只要”要和“就”搭配 ~ 只有 pairs with 才; 只要 pairs with 就 | 只要努力学习，也能取得好成绩。 | “只要……也”不能搭配 ~ 只要 does not pair with 也 | 只要努力学习，才能取得更好的成绩。 | 加了“更好”，“只要……才”还在 ~ adding 更好 leaves 只要 … 才
夜深了，天空中闪烁着明亮的月亮和星星。 | 夜深了，天空中挂着明亮的月亮，闪烁着星星。 | 月亮不会“闪烁”，只有星星闪烁 ~ the moon does not twinkle; only stars do | 夜深了，天空中闪烁着明亮的月亮和许多星星。 | 加了“许多”，月亮还在“闪烁” ~ adding 许多 leaves the moon twinkling | 夜深了，天空中闪烁着月亮和星星。 | 删了“明亮的”，月亮还在“闪烁” ~ dropping 明亮的 leaves the moon twinkling
`;

/** SENTENCE_ORDERS are the paragraphs of grade 5 whose sentences are out of order. */
const SENTENCE_ORDERS = `
①接着放上米饭一起翻炒。②先把鸡蛋打散。③最后撒上葱花。④然后把蛋液倒进锅里炒熟。 | ②④①③ | 按做事的先后，用“先、然后、接着、最后”排好 ~ in the order of the steps: 先, 然后, 接着, 最后 | ②①④③ | 鸡蛋还没下锅就放米饭，“接着”放到了“然后”前面 ~ the rice goes in before the egg: 接着 comes before 然后 | ③②④① | “最后”不能放在开头 ~ 最后 cannot come first
①中午，太阳火辣辣的。②清晨，草叶上挂着露珠。③傍晚，晚霞染红了西边的天空。④夜里，星星眨着眼睛。 | ②①③④ | 按一天的时间，从清晨到中午、傍晚、夜里 ~ by the hours of a day, from dawn to noon, evening and night | ①②③④ | 中午不在清晨前面 ~ noon does not come before dawn | ②③①④ | 傍晚不在中午前面 ~ evening does not come before noon
①一进大门，是一片草坪。②草坪后面是一座温室。③温室旁边有一个荷花池。④我们来到植物园门口。 | ④①②③ | 按游览的路线，从门口往里走 ~ along the way in, from the gate onward | ①④②③ | 还没到门口就写“一进大门” ~ 一进大门 comes before reaching the gate | ④②①③ | “草坪后面”要放在先写了草坪以后 ~ 草坪后面 needs the lawn named first
①他忘了带伞。②放学时下起了大雨。③第二天他感冒了。④他只好淋着雨回家。 | ①②④③ | 按事情的先后，原因在前，结果在后 ~ in the order things happened, cause before result | ①④②③ | 还没下雨就淋着雨回家 ~ he walks home in the rain before it rains | ③①②④ | 感冒是结果，不能放在最前面 ~ the cold is the result and cannot come first
①不久，小树苗长出了新叶。②我们在植树节种下了一棵小树苗。③每天放学，我们都给它浇水。④一个月后，它长高了一大截。 | ②③①④ | 先种下，再照顾，“不久”在前，“一个月后”在后 ~ planted, then tended, 不久 before 一个月后 | ②④③① | “一个月后”要在“不久”后面 ~ 一个月后 comes after 不久 | ①②③④ | 还没种下就长出新叶 ~ it leafs before it is planted
①比赛开始了，我紧张得手心出汗。②老师宣布我们班得了第一名。③同学们一个接一个地跳绳。④比赛结束了。 | ①③④② | 按比赛的经过：开始、比赛、结束、宣布名次 ~ through the contest: start, events, end, result | ①②③④ | 还没比完就宣布了名次 ~ the result comes before the contest | ③①④② | “比赛开始了”要在跳绳之前 ~ 比赛开始了 comes before the skipping
①种子喝饱了水，胀大了。②我把种子放进水里泡了一夜。③过了两天，种子长出了白白的小芽。④我把发芽的种子种进花盆里。 | ②①③④ | 按种子变化的先后：泡水、胀大、发芽、种下 ~ in the order of change: soaked, swollen, sprouted, planted | ①②③④ | 种子还没泡水就胀大了 ~ the seeds swell before they are soaked | ②①④③ | 种进花盆的是发了芽的种子，要先发芽 ~ it is sprouted seeds that are planted, so the sprouting comes first
①大家一起动手，把教室打扫得干干净净。②下午，班主任说明天有客人来参观。③第二天，客人们夸我们的教室真整洁。④放学后，我们留下来大扫除。 | ②④①③ | 先知道有客人来，再大扫除，最后得到夸奖 ~ the news, then the cleaning, then the praise | ④②①③ | 还不知道有客人来，就留下来大扫除 ~ we clean before we hear of the visit | ②①④③ | “放学后留下来”要在“动手打扫”前面 ~ staying after school comes before the cleaning
①天空中乌云密布。②一会儿，豆大的雨点落了下来。③雨过天晴，天边出现了一道彩虹。④接着，雨越下越大。 | ①②④③ | 按下雨的过程：乌云、雨点、大雨、雨后 ~ through the storm: clouds, drops, downpour, after | ①④②③ | “接着”要放在雨开始下以后 ~ 接着 comes after the rain begins | ③①②④ | 彩虹出现在雨后，不能放在开头 ~ the rainbow comes after the rain, not first
①他把书包放在桌上。②小明一进门就喊：“妈妈，我回来了！”③然后拿出作业本，认真写了起来。④妈妈从厨房里笑着走出来。 | ②④①③ | 按回家后的先后：进门、妈妈出来、放书包、写作业 ~ in the order of coming home: in, mother comes, bag down, homework | ①②④③ | 还没进门就放书包 ~ the bag is put down before he comes in | ②③④① | 还没放下书包就写作业，“然后”接不上 ~ homework before the bag is down: 然后 does not follow
①小蝌蚪先长出了两条后腿。②池塘里游来一群黑黑的小蝌蚪。③接着又长出了两条前腿。④后来尾巴不见了，变成了一只小青蛙。 | ②①③④ | 按小蝌蚪变青蛙的过程，“先、接着、后来” ~ through the tadpole's change: 先, 接着, 后来 | ①②③④ | 还没写小蝌蚪出现，就写它长腿 ~ legs grow before the tadpoles appear | ②③①④ | “先”长后腿，“接着”才长前腿 ~ the hind legs come 先, the front 接着
①我们一早来到山脚下。②半山腰有一座亭子，我们在那里歇了一会儿。③终于，我们爬上了山顶，看到了日出。④山路弯弯曲曲，越往上越陡。 | ①④②③ | 按爬山的路线：山脚、山路、半山腰、山顶 ~ along the climb: foot, path, halfway, top | ③①④② | “终于”爬上山顶要放在最后 ~ 终于 reaching the top comes last | ②①④③ | 还没来到山脚下，就在半山腰歇息 ~ resting halfway before reaching the foot
`;

/** PAGE_FORM are the questions of grade 6 on the form of a page: letters, notices, notes and the squares of composition paper. */
const PAGE_FORM = `
写书信时，称呼应该写在哪里？ ~ Where does the greeting of a letter go? | 第一行顶格写，后面加冒号 | 称呼单独占一行，顶格写 ~ the greeting has a line of its own, at the margin | 第一行空两格写 | 空两格写的是正文每段的开头 ~ indenting two squares is for each paragraph of the body | 写在信的最后 | 信的最后写的是署名和日期 ~ the end of a letter has the name and the date
书信正文的第一行怎样写？ ~ How is the first line of a letter's body written? | 另起一行，空两格写 | 正文每段开头都空两格 ~ every paragraph of the body is indented two squares | 顶格写 | 顶格写的是称呼 ~ the margin is for the greeting | 接在称呼的同一行写 | 称呼单独占一行，正文要另起一行 ~ the greeting has its own line, and the body starts a new one
书信的署名写在哪里？ ~ Where does the signature of a letter go? | 正文下面的右边，日期写在署名下面 | 署名和日期写在信的右下方 ~ name and date go at the bottom right | 第一行的左边 | 第一行左边顶格写的是称呼 ~ the top left is for the greeting | 正文的中间 | 正文中间不写署名 ~ no name goes in the middle of the body
书信结尾的“此致”“敬礼”怎样写？ ~ How are 此致 and 敬礼 written at a letter's end? | “此致”另起一行空两格，“敬礼”再另起一行顶格写 | 这是书信祝颂语常用的格式 ~ this is the usual form of the closing | 两个词都写在正文最后一行的末尾 | “敬礼”要另起一行顶格写 ~ 敬礼 needs a line of its own at the margin | 都写在信的第一行 | 祝颂语写在正文后面，不在开头 ~ the closing follows the body, not the top
通知的标题“通知”两个字写在哪里？ ~ Where does the heading 通知 go? | 第一行正中间 | 标题写在第一行的中间 ~ the heading is centred on the first line | 第一行顶格 | 顶格写的是称呼，不是标题 ~ the margin is for a greeting, not the heading | 最后一行的右边 | 右下方写的是发通知的单位和日期 ~ the bottom right is for who sends it and the date
通知的日期写在哪里？ ~ Where does the date of a notice go? | 发通知单位的下面，靠右 | 落款的单位在上，日期在下，都靠右写 ~ the sender above, the date below, both to the right | 标题的前面 | 标题前面不写日期 ~ nothing goes before the heading | 正文的第一句 | 日期属于落款，不放在正文开头 ~ the date belongs to the sign-off, not the body
作文的题目写在哪里？ ~ Where does the title of a composition go? | 第一行中间 | 题目写在第一行的中间 ~ the title is centred on the first line | 第一行顶格 | 题目不顶格写 ~ a title is not written at the margin | 第二行空两格 | 空两格是正文段落的开头 ~ indenting two squares begins a paragraph
写作文时，每一段的开头怎样写？ ~ How does each paragraph of a composition begin? | 空两格 | 每段开头空两格，一看就知道分段 ~ each paragraph is indented two squares, so the breaks show | 顶格写 | 顶格写看不出哪里分段 ~ at the margin the breaks do not show | 空一格 | 段落开头要空两格，不是一格 ~ a paragraph is indented two squares, not one
在方格纸上，句号、逗号怎样写？ ~ On squared paper, how are the full stop and the comma written? | 单独占一格，写在格子的左下方 | 点号一般占一格，写在左下方 ~ such marks take a square each, at its bottom left | 和前一个字挤在同一格里 | 标点要单独占一格 ~ a mark takes a square of its own | 写在格子的正中间 | 句号、逗号要写在格子的左下方，不在正中 ~ they go at the bottom left of the square, not the centre
逗号、句号能不能写在一行的开头？ ~ May a comma or full stop begin a line? | 不能，要写在上一行最后一个字的格子里 | 点号不能出现在一行的开头 ~ such marks may not begin a line | 能，写在哪里都可以 | 点号放在行首不合规范 ~ a mark at the start of a line is against the rules | 能，但是要先空一格 | 空一格再写点号也不对 ~ leaving a square first does not mend it
前引号、前书名号能不能写在一行的最后？ ~ May an opening quotation mark or title mark end a line? | 不能，要移到下一行的开头 | 前引号、前书名号不能单独留在一行的末尾 ~ an opening mark may not be left at the end of a line | 能，没有关系 | 前半个引号留在行末，和后面的字分开了，不合规范 ~ left at the end it is cut off from its words | 能，但要写得小一点 | 写小一点也不合规范 ~ writing it smaller does not mend it
省略号和破折号在方格纸上占几格？ ~ How many squares do the ellipsis and the dash take? | 两格 | 省略号和破折号都占两格 ~ both take two squares | 一格 | 它们比较长，要占两格 ~ they are long and take two | 三格 | 规范是占两格，不是三格 ~ the rule is two, not three
写请假条时，请假人的名字写在哪里？ ~ In a leave note, where does one's name go? | 正文下面的右边，日期写在名字下面 | 请假条的落款写在右下方 ~ the sign-off of a note is at the bottom right | 第一行顶格 | 第一行顶格写的是称呼，比如“王老师：” ~ the top left is for the greeting, such as 王老师： | 正文的最前面 | 正文开头写的是请假的原因 ~ the body opens with the reason for leave
`;

/** PUNCTUATION are the sentences of grade 6 with one misused mark. */
const PUNCTUATION = `
你喜欢春天，还是喜欢秋天。 | 你喜欢春天，还是喜欢秋天？ | 这是选择问句，句末要用问号 ~ it asks a choice and ends with a question mark | 你喜欢春天？还是喜欢秋天？ | 选择问句中间用逗号，问号只在句末 ~ a choice question has a comma in the middle and one question mark at the end | 你喜欢春天，还是喜欢秋天！ | 这是问句，不是感叹 ~ it asks; it does not exclaim
我家养了小猫，小狗，小兔。 | 我家养了小猫、小狗、小兔。 | 并列的词语之间用顿号 ~ words in a series are parted by the enumeration comma | 我家养了小猫；小狗；小兔。 | 分号用在并列的分句之间，不用在词语之间 ~ the semicolon parts clauses, not words | 我家养了：小猫，小狗，小兔。 | 加了冒号，词语之间还是逗号 ~ adding a colon leaves the commas between words
老师说：“明天去春游”。 | 老师说：“明天去春游。” | 引用的是完整的话，句号要放在引号里面 ~ a whole sentence is quoted, so its full stop goes inside the quotes | 老师说：“明天去春游”！ | 换成感叹号，标点还在引号外面 ~ an exclamation mark is still outside the quotes | 老师说，“明天去春游”。 | 提示语在前要用冒号，句号也还在引号外面 ~ a lead-in before a quotation takes a colon, and the stop is still outside
他问我今天去不去图书馆？ | 他问我今天去不去图书馆。 | 问话只是句子的一部分，全句是陈述的，句末用句号 ~ the question is only part of a statement, which ends with a full stop | 他问我：今天去不去图书馆？ | 直接引用别人的话要加引号，这样不规范 ~ a direct quotation needs quotation marks | 他问我今天去不去图书馆！ | 这句话不是感叹 ~ the sentence does not exclaim
春天来了，小草绿了，花儿开了，燕子飞回来了， | 春天来了，小草绿了，花儿开了，燕子飞回来了。 | 话说完了，句末要用句号，不能用逗号 ~ the sentence is finished and ends with a full stop, not a comma | 春天来了，小草绿了，花儿开了，燕子飞回来了； | 句子结束不用分号 ~ a semicolon does not end a sentence | 春天来了，小草绿了，花儿开了，燕子飞回来了、 | 顿号不能放在句末 ~ the enumeration comma cannot end a sentence
春天，桃花开了，夏天，荷花开了。 | 春天，桃花开了；夏天，荷花开了。 | 两个并列的分句里已经有逗号，分句之间要用分号 ~ the two parallel clauses already hold commas, so a semicolon parts them | 春天、桃花开了；夏天、荷花开了。 | 句子里的停顿不能改成顿号 ~ a pause within a clause is not an enumeration comma | 春天，桃花开了；夏天，荷花开了； | 句子说完了，句末不能用分号 ~ a finished sentence does not end with a semicolon
这里的风景多美啊。 | 这里的风景多美啊！ | 这是感叹句，句末要用感叹号 ~ it exclaims and ends with an exclamation mark | 这里的风景多美啊？ | 这不是问句 ~ it does not ask | 这里的风景，多美啊。 | 加了逗号，句末还是句号 ~ adding a comma leaves the full stop
我们班有三个兴趣小组，美术组、音乐组和科技组。 | 我们班有三个兴趣小组：美术组、音乐组和科技组。 | 后面是对“三个兴趣小组”的具体说明，要用冒号 ~ what follows spells out the three groups and takes a colon | 我们班有三个兴趣小组；美术组、音乐组和科技组。 | 分号不能引出说明 ~ a semicolon does not introduce a list | 我们班有三个兴趣小组，美术组，音乐组和科技组。 | 词语之间改成逗号，前面的逗号也没改 ~ commas between the names, and the first comma left as it was
一年有春、夏、秋、冬，四个季节。 | 一年有春、夏、秋、冬四个季节。 | “春、夏、秋、冬”和“四个季节”说的是一样东西，中间不能停顿 ~ the four names and 四个季节 are one thing and take no pause between | 一年有春，夏，秋，冬，四个季节。 | 把顿号改成逗号，更不对了 ~ turning the enumeration commas into commas makes it worse | 一年有春、夏、秋、冬：四个季节。 | 这里不需要冒号 ~ no colon is wanted here
小明高兴地说：“我考了一百分”！ | 小明高兴地说：“我考了一百分！” | 感叹号属于引用的话，要放在引号里面 ~ the exclamation belongs to the quoted words and goes inside | 小明高兴地说，“我考了一百分”！ | 提示语后要用冒号，感叹号也还在引号外面 ~ the lead-in takes a colon, and the mark is still outside | 小明高兴地说：“我考了一百分”。 | 换成句号，标点还在引号外，语气也不对 ~ a full stop is still outside the quotes and loses the tone
文具店里有铅笔、橡皮、尺子……等文具。 | 文具店里有铅笔、橡皮、尺子等文具。 | 省略号和“等”意思重复，不能一起用 ~ the ellipsis and 等 say the same and are not used together | 文具店里有铅笔、橡皮、尺子……等等文具。 | 换成“等等”，还是和省略号重复 ~ 等等 still repeats the ellipsis | 文具店里有铅笔，橡皮，尺子……等文具。 | 改了顿号，省略号和“等”还在一起 ~ changing the commas leaves the ellipsis with 等
妈妈问我：“作业写完了吗。” | 妈妈问我：“作业写完了吗？” | 妈妈问的是问句，引号里面要用问号 ~ Mother asks, so the quotation ends with a question mark | 妈妈问我：“作业写完了吗”？ | 问号是引用的话里的，要放在引号里面 ~ the question mark belongs inside the quotes | 妈妈问我：“作业写完了吗！” | 这是问话，不是感叹 ~ it asks; it does not exclaim
`;

/** ORDER_HEADS, FORM_HEADS and PUNCTUATION_HEADS are the headings of the steps of ordering, the form of a page and punctuation. */
const ORDER_HEADS: Heads = {
  find: t("**Step 1: find the words that mark the order.**", "**第一步：找出表示顺序的词。**"),
  choose: t("**Step 2: put the sentences in that order.**", "**第二步：按这个顺序排列句子。**"),
};
const FORM_HEADS: Heads = {
  find: t("**Step 1: recall the rule of the form.**", "**第一步：想一想格式的规矩。**"),
  choose: t("**Step 2: choose what follows it.**", "**第二步：选出符合规矩的一项。**"),
};
const PUNCTUATION_HEADS: Heads = {
  find: t("**Step 1: find the misused mark.**", "**第一步：找出用错的标点。**"),
  choose: t("**Step 2: choose the correction that mends just that.**", "**第二步：选出正好改对它的改法。**"),
};

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

/** revisingTopics are the revising topics of grades 3 to 6. */
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
  {
    grade: 5,
    topic: {
      id: "revising-5",
      title: t("Revising for Smooth Sentences", "修改习作：语句通顺"),
      summary: t(
        "Making the sentences of a draft read smoothly, words in order, paired rightly and nothing missing or said twice, and putting sentences in an order that holds together.",
        "让习作的语句通顺：词序正确，搭配得当，不缺不重；把句子排成前后连贯的一段话。",
      ),
      intro: t(
        "A draft reads smoothly when each sentence is whole and in order, and when the sentences follow one another. “我们要发扬和继承中华民族的优良传统。” has its words the wrong way round: one inherits before carrying forward, so it is 继承和发扬.\n\nSentences, too, need their order: in a recipe, “先” comes before “然后”, “接着” and “最后”. The first knowledge point mends sentences, the second puts sentences in order.",
        "习作要读起来通顺：每句话完整、顺序对，句子和句子之间也要接得上。“我们要发扬和继承中华民族的优良传统。”词序颠倒了：先继承，后发扬，应该是“继承和发扬”。\n\n句子之间也有顺序：写做菜，“先”要在“然后”“接着”“最后”前面。第一个知识点修改语句，第二个排列句子的顺序。",
      ),
      prerequisites: ["revising-4"],
      encompasses: [],
      xp: 12,
      strand: "writing",
      knowledgePoints: [
        point(
          "revising-5-sentences",
          t("Smooth Sentences", "修改不通顺的句子"),
          t(
            "Beyond the faults of grade 4, look for words in the wrong order, pairs of connectives that do not belong together, and a 他 or 它 whose person cannot be told. Mend that one thing, and keep the meaning.\n\n“只要努力学习，才能取得好成绩。” 只有 pairs with 才, so: “只有努力学习，才能取得好成绩。”\n\n> **Watch out.** Connectives come in pairs: 虽然……但是, 因为……所以, 只要……就, 只有……才. Changing one word of a pair into another that does not belong leaves the sentence faulty.",
            "除了四年级学过的毛病，还要留心：词序颠倒，关联词搭配不当，“他”“它”指的是谁分不清。只改这一处，意思不变。\n\n比如“只要努力学习，才能取得好成绩。”“只有”才和“才”搭配，要改成“只有努力学习，才能取得好成绩。”\n\n> **注意。** 关联词是成对用的：虽然……但是，因为……所以，只要……就，只有……才。把一个换成不配套的另一个，句子还是不通。",
          ),
          choiceTopicGenerator(sentenceChoices(SMOOTH_SENTENCES), SENTENCE_HEADS),
        ),
        point(
          "revising-5-order",
          t("The Order of Sentences", "排列句子的顺序"),
          t(
            "Find the words that mark order, of time (清晨, 中午), of place (一进大门, 后面), of steps (先, 然后, 最后), or of cause and result, and the sentence that must open; then line the rest up after it.\n\nThe storm: clouds gather, drops fall, “接着” it pours, and the rainbow comes after: ①②④③.\n\n> **Watch out.** A word like 接着, 然后 or 后面 always needs something before it: it cannot open the paragraph, and what it follows must already have been said.",
            "找出表示顺序的词：时间（清晨、中午），地点（一进大门、后面），步骤（先、然后、最后），或者原因和结果；再找出该放在最前面的一句，其余的依次排在后面。\n\n比如下雨：乌云密布，雨点落下，“接着”雨越下越大，雨后出现彩虹：①②④③。\n\n> **注意。** “接着”“然后”“后面”这样的词，前面一定要有别的内容：它们不能放在开头，它们接的事也要先说出来。",
          ),
          choiceTopicGenerator(orderChoices(SENTENCE_ORDERS), ORDER_HEADS),
        ),
      ],
    },
  },
  {
    grade: 6,
    topic: {
      id: "revising-6",
      title: t("Revising Form and Punctuation", "修改习作：行款和标点"),
      summary: t(
        "Setting out a page as the form asks, letters, notices, notes and the squares of composition paper, and correcting misused punctuation.",
        "按格式写好行款：书信、通知、请假条和方格纸上的书写；改正用错的标点符号。",
      ),
      intro: t(
        "A piece is revised for its look on the page as well as its words. A letter opens with the greeting at the margin, “亲爱的小华：”, starts its body on a new line indented two squares, and signs off at the bottom right with the date below.\n\nIts marks must be right too: “你喜欢春天，还是喜欢秋天。” asks a choice, so it ends with a question mark. The first knowledge point asks the form, the second corrects punctuation.",
        "修改习作，不但要改字词，还要看写在纸上的格式。书信第一行顶格写称呼，比如“亲爱的小华：”；正文另起一行，空两格写；署名写在右下方，日期写在署名下面。\n\n标点也要用对：“你喜欢春天，还是喜欢秋天。”是选择问句，句末要用问号。第一个知识点问行款，第二个改正标点。",
      ),
      prerequisites: ["revising-5"],
      encompasses: [],
      xp: 12,
      strand: "writing",
      knowledgePoints: [
        point(
          "revising-6-form",
          t("The Form of a Page", "行款格式"),
          t(
            "Each kind of piece has its form. A title is centred; a paragraph is indented two squares; a greeting stands at the margin of its own line; the sign-off, name then date, goes at the bottom right. On squared paper a mark takes a square, at its bottom left, and the ellipsis and the dash take two.\n\nA notice: 通知 centred on the first line, the body indented, the sender and the date at the bottom right.\n\n> **Watch out.** A comma or full stop never begins a line, and an opening quotation mark never ends one: move the mark to the last square of the line before, or the opening mark to the next line.",
            "每种文章都有自己的格式。题目写在中间；每段开头空两格；称呼单独一行顶格写；落款先写名字，再写日期，都在右下方。在方格纸上，标点一般占一格，写在左下方；省略号和破折号占两格。\n\n比如通知：第一行中间写“通知”，正文空两格写，右下方写发通知的单位和日期。\n\n> **注意。** 逗号、句号不能写在一行的开头，前引号不能留在一行的末尾：点号要写进上一行最后一格，前引号要移到下一行开头。",
          ),
          choiceTopicGenerator(
            listedChoices(PAGE_FORM, {
              find: t(
                "Recall where each part of this kind of piece goes, and how marks sit on squared paper.",
                "想一想这种文章各部分写在哪里，标点在方格纸上怎样写。",
              ),
              check: (right) =>
                t(
                  `Picture the page written so, “${right}”: it looks as the form asks, and nothing is out of place.`,
                  `想象一下按“${right}”写出来的样子：符合格式，没有哪里放错了地方。`,
                ),
            }),
            FORM_HEADS,
          ),
        ),
        point(
          "revising-6-punctuation",
          t("Correcting Punctuation", "改正标点"),
          t(
            "Read the sentence for its pauses and its tone. A question ends with ？ and an exclamation with ！; words in a series take 、; parallel clauses that hold commas are parted by ；; a colon introduces what spells out the words before it; the mark that ends quoted words goes inside the quotation marks.\n\n“小明高兴地说：‘我考了一百分’！” The exclamation is Xiaoming's, so it goes inside: “小明高兴地说：‘我考了一百分！’”\n\n> **Watch out.** A sentence that only reports a question is not a question: “他问我今天去不去图书馆。” ends with a full stop.",
            "读一读句子的停顿和语气。问句末尾用问号，感叹句末尾用感叹号；并列的词语之间用顿号；并列的分句里已经有逗号时，分句之间用分号；冒号引出后面的具体说明；引用的话说完了，标点放在引号里面。\n\n比如“小明高兴地说：‘我考了一百分’！”感叹是小明的话里的，要放进引号：“小明高兴地说：‘我考了一百分！’”\n\n> **注意。** 只是转述别人问了什么，句子不是问句：“他问我今天去不去图书馆。”句末用句号。",
          ),
          choiceTopicGenerator(punctuationChoices(PUNCTUATION), PUNCTUATION_HEADS),
        ),
      ],
    },
  },
];
