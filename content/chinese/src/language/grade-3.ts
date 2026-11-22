// The language topics of grade 3 (docs/chinese-curriculum.md §18.9): choosing a sense in the dictionary, for a
// character in a word and for a word in a sentence, and telling apart characters that look or sound alike. The senses
// are worded for this subject after what the general dictionaries give; the sentences are written for it.

import { type Text, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { bilingual, type Choice, choice, choiceTopicGenerator, rows } from "./choice-kit.ts";

/** CIRCLED numbers the senses of a dictionary entry. */
const CIRCLED = ["①", "②", "③", "④"];

/** Entry is a character or word of the dictionary with its senses, and the words or sentences that use each. */
interface Entry {
  readonly head: string;
  readonly senses: readonly Text[];
  readonly uses: readonly (readonly [use: string, sense: number, gloss: Text])[];
}

/**
 * parseEntries reads entries: a line `head | sense ~ English | …`, then lines `use | n | gloss ~ English`, the use a
 * word or a sentence in which the head has sense n, counted from 1.
 */
function parseEntries(data: string): readonly Entry[] {
  return data
    .trim()
    .split(/\n\s*\n/u)
    .map((block) => {
      const [head = "", ...uses] = block.split("\n").map((l) => l.trim());
      const [h = "", ...senses] = head.split(" | ").map((s) => s.trim());
      const entry: Entry = {
        head: h,
        senses: senses.map(bilingual),
        uses: rows(uses.join("\n"), 3).map(([use, n, gloss]) => [use!, Number(n), bilingual(gloss!)] as const),
      };
      for (const [use, n] of entry.uses) {
        if (!(n >= 1 && n <= entry.senses.length) || !use.includes(entry.head)) throw new Error(`dictionary: ${h} in ${use}`);
      }
      return entry;
    });
}

/** CHARACTER_SENSES are characters with four senses each, and a word for each sense. */
const CHARACTER_SENSES = parseEntries(`
深 | 从上到下或从外到里的距离大 ~ far from top to bottom, or from outside in | 感情厚，关系密切 ~ deep in feeling, close | 颜色浓 ~ dark in colour | 离开始的时间很久 ~ long after it began
深井 | 1 | 从井口到井底很远的井 ~ a well that goes far down
深情 | 2 | 很厚的感情 ~ deep feeling
深红 | 3 | 很浓的红色 ~ a dark red
深夜 | 4 | 夜里很晚的时候 ~ late in the night

开 | 打开，使关着的东西不再关着 ~ to open what is shut | 花朵展开 ~ of flowers, to open out | 开动，让车、机器动起来 ~ to drive, to set going | 开始 ~ to begin
开门 | 1 | 把关着的门打开 ~ to open a door
开花 | 2 | 花朵展开 ~ flowers opening
开车 | 3 | 让车动起来 ~ to drive a car
开学 | 4 | 学期开始 ~ the start of term

生 | 生长 ~ to grow | 没有煮熟 ~ not cooked | 不熟悉 ~ unfamiliar | 出生 ~ to be born
生根 | 1 | 长出根来 ~ to grow roots
生肉 | 2 | 没有煮熟的肉 ~ raw meat
生字 | 3 | 还不认识的字 ~ a character not yet known
生日 | 4 | 出生的那一天 ~ the day one was born

花 | 花朵 ~ a flower | 颜色或图案错杂的 ~ many-coloured, patterned | 用，用掉 ~ to spend | 眼睛看不清楚 ~ of eyes, blurred
花园 | 1 | 种着很多花的园子 ~ a garden of flowers
花衣服 | 2 | 有各种颜色和图案的衣服 ~ patterned clothes
花钱 | 3 | 用钱 ~ to spend money
眼花 | 4 | 眼睛看东西不清楚 ~ blurred sight

头 | 人或动物的脑袋 ~ the head | 排在最前面的 ~ first, foremost | 物体的顶端或末端 ~ the end or tip of a thing | 用来数牛、猪等动物 ~ a measure word for cattle and pigs
点头 | 1 | 把脑袋往下动一动 ~ to nod
头一个 | 2 | 排在最前面的一个 ~ the very first one
笔头 | 3 | 笔的尖端 ~ the tip of a pen
一头牛 | 4 | 数牛时说的一个 ~ one ox

老 | 年纪大 ~ old in years | 很早就有的，原来的 ~ long known, of old | 经常，总是 ~ always, again and again | 东西做得太过了火 ~ overcooked
老人 | 1 | 年纪大的人 ~ an old person
老朋友 | 2 | 认识了很久的朋友 ~ an old friend
老是迟到 | 3 | 总是迟到 ~ always late
青菜炒老了 | 4 | 青菜炒得太久，不嫩了 ~ greens fried too long

白 | 像雪的颜色 ~ the colour of snow | 没有效果，徒然 ~ in vain | 不付代价 ~ for nothing, free | 清楚，明白 ~ clear
白云 | 1 | 白色的云 ~ white clouds
白跑一趟 | 2 | 去了一趟却没有用 ~ a wasted trip
白吃 | 3 | 吃了不付钱 ~ to eat without paying
明白 | 4 | 清楚，懂得 ~ to understand clearly

光 | 光线 ~ light | 光滑 ~ smooth, shiny | 一点也不剩 ~ all used up | 荣誉 ~ honour
阳光 | 1 | 太阳的光线 ~ sunlight
光溜溜 | 2 | 很光滑 ~ very smooth
吃光 | 3 | 吃得一点也不剩 ~ eaten up
为国争光 | 4 | 为国家争得荣誉 ~ to win honour for one's country

角 | 牛、羊等头上长出的硬东西 ~ a horn | 两个边相接的地方，角落 ~ a corner | 从一点引出的两条线组成的图形 ~ an angle | 钱的单位，十分是一角 ~ a jiao, ten fen
牛角 | 1 | 牛头上的角 ~ an ox's horn
墙角 | 2 | 两面墙相接的地方 ~ the corner of a room
直角 | 3 | 九十度的角 ~ a right angle
五角钱 | 4 | 五个一角的钱 ~ fifty fen

包 | 装东西的袋子 ~ a bag | 用纸、布等把东西裹起来 ~ to wrap | 担保，全部承担 ~ to take on, to guarantee | 身体上鼓起来的疙瘩 ~ a bump on the body
书包 | 1 | 装书的袋子 ~ a school bag
包饺子 | 2 | 用面皮把馅儿裹起来 ~ to wrap dumplings
包在我身上 | 3 | 这件事由我全部承担 ~ leave it to me
头上起了个包 | 4 | 头上鼓起一块 ~ a bump on the head
`);

/** WORD_SENSES are words with three senses each, and a sentence for each sense. */
const WORD_SENSES = parseEntries(`
骄傲 | 自以为了不起，看不起别人 ~ conceited | 自豪 ~ proud, in a good sense | 值得自豪的人或事 ~ someone or something to be proud of
他考了第一名，就骄傲起来，不听别人的意见了。 | 1 | 自以为了不起 ~ thinking too much of himself
看到妹妹得了奖，我心里很骄傲。 | 2 | 为妹妹感到自豪 ~ proud of my sister
长城是我们的骄傲。 | 3 | 值得自豪的东西 ~ something we are proud of

包袱 | 包东西用的布 ~ a cloth to wrap things in | 用布包起来的包 ~ a bundle | 让人放不下的负担 ~ a burden on the mind
奶奶用一块蓝布做包袱，把衣服包好。 | 1 | 包东西的布 ~ the wrapping cloth
他背着一个大包袱上了火车。 | 2 | 包好的包 ~ the bundle he carried
说出了心里话，他就放下了包袱。 | 3 | 心里的负担 ~ the weight on his mind

光明 | 亮光 ~ light | 明亮 ~ bright | 有希望的 ~ hopeful
山洞的尽头有一点光明。 | 1 | 一点亮光 ~ a little light
屋子里很光明，一点也不暗。 | 2 | 很明亮 ~ a bright room
只要努力，我们的明天一定是光明的。 | 3 | 有希望的明天 ~ a hopeful tomorrow

尾巴 | 动物身体末端长出的部分 ~ an animal's tail | 东西的末尾部分 ~ the tail end of a thing | 跟在别人后面的人 ~ someone who tags along
小狗高兴地摇着尾巴。 | 1 | 小狗身上的尾巴 ~ the dog's tail
飞机的尾巴上画着一面小旗。 | 2 | 飞机的末尾部分 ~ the tail of the plane
弟弟总跟在我后面，像个小尾巴。 | 3 | 跟在别人后面的人 ~ someone who follows me about

窗口 | 窗户跟前 ~ by the window | 墙上开的小口，用来卖票、取东西 ~ a counter window | 能看到外面情况的地方 ~ a window on something
她坐在窗口看书。 | 1 | 窗户跟前 ~ by the window
大家在三号窗口排队买票。 | 2 | 卖票的小口 ~ the ticket window
书是我们看世界的窗口。 | 3 | 能看到世界的地方 ~ a way of seeing the world

冷淡 | 不热闹，不兴旺 ~ quiet, slack | 对人不热情 ~ cold towards someone | 冷冷地对待 ~ to treat coldly
下雨天，店里的生意很冷淡。 | 1 | 生意不兴旺 ~ business was slack
他对新同学的态度很冷淡。 | 2 | 对人不热情 ~ not warm towards the newcomer
我们不能冷淡了来访的客人。 | 3 | 冷冷地对待客人 ~ to treat the guests coldly

开花 | 花朵开放 ~ to blossom | 像花一样裂开 ~ to burst open like a flower | 心里非常高兴 ~ to be overjoyed
春天到了，桃树开花了。 | 1 | 花开了 ~ the trees blossomed
那双旧鞋穿得开花了。 | 2 | 鞋子裂开了 ~ the old shoes split open
听说要去旅行，他心里乐得开花了。 | 3 | 心里非常高兴 ~ he was overjoyed

热闹 | 人多，声音大，很兴旺 ~ lively, bustling | 使场面活跃起来 ~ to liven up | 热闹的情景 ~ a lively scene
过年的时候，街上热闹极了。 | 1 | 人多，很兴旺 ~ the streets were bustling
大家一起唱支歌，热闹热闹吧！ | 2 | 让场面活跃起来 ~ let us liven things up
小弟弟最爱看热闹。 | 3 | 热闹的情景 ~ a lively scene

眼光 | 视线，看的方向 ~ one's gaze | 看人看事的本领 ~ an eye for things | 看问题的想法 ~ an outlook
大家的眼光都落在了黑板上。 | 1 | 看的方向 ~ where everyone looked
妈妈买的衣服都很好看，她真有眼光。 | 2 | 会看会挑的本领 ~ a good eye
看问题要有长远的眼光。 | 3 | 看问题的想法 ~ a long view

头脑 | 想事情的能力 ~ the power to think | 事情的线索 ~ a thread, a clue | 带头的人 ~ a leader
他很有头脑，遇事总能想出办法。 | 1 | 想事情的能力 ~ he thinks well
这道题太乱了，我摸不着头脑。 | 2 | 事情的线索 ~ I cannot make head or tail of it
他是这群孩子的头脑。 | 3 | 带头的人 ~ the leader of the children
`);

/** SENSE_HEADS are the headings of the steps that choose a sense. */
const SENSE_HEADS = {
  find: t("**Step 1: read the senses the dictionary gives.**", "**第一步：读一读字典里的几个义项。**"),
  choose: t("**Step 2: try each sense in its place.**", "**第二步：把义项一个个放进去试。**"),
};

/** senseList lists the senses of an entry, numbered. */
const senseList = (e: Entry, locale: "en" | "zh-CN"): string =>
  e.senses.map((s, i) => `${CIRCLED[i]}${s[locale]}`).join(locale === "en" ? "; " : "；");

/** senseChoices are the questions of one kind: which sense the head has in each use. */
function senseChoices(entries: readonly Entry[], inSentence: boolean): readonly Choice[] {
  return entries.flatMap((e) =>
    e.uses.map(([use, n, gloss]) => {
      const sense = e.senses[n - 1]!;
      return choice({
        ask: inSentence
          ? t(`Which sense of ${e.head} does this sentence use?`, `“${e.head}”在这句话里是哪个意思？`)
          : t(`Which sense does ${e.head} have in ${use}?`, `“${e.head}”在“${use}”里是哪个意思？`),
        shown: inSentence ? use : "",
        right: sense["zh-CN"],
        wrong: e.senses.flatMap((s, i) => {
          if (i === n - 1) return [];
          const other = e.uses.find((u) => u[1] === i + 1);
          if (!other) throw new Error(`dictionary: ${e.head} has no use of sense ${i + 1}`);
          const [o, , og] = other;
          return [
            [
              s["zh-CN"],
              inSentence
                ? t(
                    `that is its sense in “${o}”, which is about ${og.en}; this sentence is about ${gloss.en}.`,
                    `这是“${o}”里的意思，那句说的是${og["zh-CN"]}；这句话说的却是${gloss["zh-CN"]}。`,
                  )
                : t(
                    `that is its sense in ${o}, ${og.en}; ${use} is ${gloss.en}.`,
                    `这是“${o}”里的意思，“${o}”是${og["zh-CN"]}；“${use}”说的却是${gloss["zh-CN"]}。`,
                  ),
            ] as const,
          ];
        }),
        find: t(
          `The dictionary gives ${e.head} these senses: ${senseList(e, "en")}. Read ${inSentence ? "the whole sentence" : `the word ${use}`} and ask what it says.`,
          `字典里“${e.head}”有这几个义项：${senseList(e, "zh-CN")}。读一读${inSentence ? "整句话" : `“${use}”这个词`}，想想它说的是什么。`,
        ),
        choose: t(
          `${inSentence ? "Here" : `In ${use}`} it is about ${gloss.en}: so ${e.head} has sense ${CIRCLED[n - 1]}, “${sense["zh-CN"]}”.`,
          `这里说的是${gloss["zh-CN"]}，所以“${e.head}”是义项${CIRCLED[n - 1]}：“${sense["zh-CN"]}”。`,
        ),
        check: t(
          `Put sense ${CIRCLED[n - 1]} in place of ${e.head}: it says ${gloss.en}, and makes sense; no other sense does.`,
          `把义项${CIRCLED[n - 1]}放回去读：说的正是${gloss["zh-CN"]}，讲得通；换成别的义项都讲不通。`,
        ),
      });
    }),
  );
}

/** Gloss is what a character means and its component, in Chinese and in English. */
const GLOSSES: Readonly<Record<string, Text>> = Object.fromEntries(
  rows(
    `
晴 | 日字旁，天上没有云，有太阳 ~ with 日 for sun: fine, sunny
清 | 三点水，水很干净 ~ with 氵 for water: clear
请 | 言字旁，客气地叫别人做事 ~ with 讠 for speech: please, to ask
睛 | 目字旁，眼珠 ~ with 目 for eye: the eyeball
情 | 竖心旁，心里的感受 ~ with 忄 for heart: feeling
抱 | 提手旁，用手臂围住 ~ with 扌 for hand: to hold in the arms
跑 | 足字旁，用脚很快地走 ~ with 足 for foot: to run
泡 | 三点水，放在水里 ~ with 氵 for water: to soak, a bubble
饱 | 食字旁，吃够了 ~ with 饣 for food: full
炮 | 火字旁，一种武器 ~ with 火 for fire: a cannon
辩 | 中间是言，用话争论 ~ with 言 in the middle: to argue
辨 | 中间是点撇，分清楚 ~ with a dot and a stroke in the middle: to tell apart
辫 | 中间是绞丝，编起来的头发 ~ with 纟 in the middle: a plait
瓣 | 中间是瓜，花或果实的一片 ~ with 瓜 in the middle: a petal, a segment
渴 | 三点水，想喝水 ~ with 氵 for water: thirsty
喝 | 口字旁，把水吞下去 ~ with 口 for mouth: to drink
揭 | 提手旁，把盖着的东西拿开 ~ with 扌 for hand: to lift off
歇 | 欠字边，停下来休息 ~ with 欠 at the side: to rest
栽 | 下面是木，种植 ~ with 木 beneath: to plant
裁 | 下面是衣，用剪刀剪开 ~ with 衣 beneath: to cut cloth
载 | 下面是车，用车装运 ~ with 车 beneath: to carry by vehicle
戴 | 把东西放在头上、身上 ~ to wear on the head or body
候 | 中间有一竖，等待 ~ with an upright stroke inside: to wait
猴 | 反犬旁，一种动物 ~ with 犭 for animals: a monkey
喉 | 口字旁，脖子里的喉咙 ~ with 口 for mouth: the throat
侯 | 没有中间一竖，古时的官名 ~ without the upright stroke: a lord of old
己 | 开口，自己 ~ open at the top: oneself
已 | 半封口，已经 ~ half closed: already
记 | 言字旁，记住 ~ with 讠 for speech: to remember
纪 | 绞丝旁，纪律、年纪 ~ with 纟: discipline, age
拔 | 右边是犮，用力拉出来 ~ with 犮 at the right: to pull out
拨 | 右边是发，用手指推动 ~ with 发 at the right: to push with a finger, to dial
发 | 送出，产生 ~ to send, to give off
被 | 衣字旁，盖着睡觉的被子 ~ with 衤 for clothes: a quilt
今 | 现在 ~ now, this
金 | 金子 ~ gold
斤 | 重量单位 ~ a unit of weight
巾 | 毛巾 ~ a towel, a cloth
做 | 单人旁加故，干活、制作 ~ with 亻: to do, to make
作 | 单人旁加乍，写作、作业 ~ with 亻 and 乍: to write, work
坐 | 屁股放在椅子上 ~ to sit
座 | 广字头，座位 ~ under 广: a seat
园 | 方框里是元，园子 ~ with 元 in a frame: a garden
元 | 钱的单位，开始 ~ a yuan, the first
圆 | 方框里是员，圆形 ~ with 员 in a frame: round
原 | 原来 ~ original, at first
阳 | 耳刀旁，太阳 ~ with 阝: the sun
洋 | 三点水，大海 ~ with 氵: the ocean
羊 | 一种动物 ~ a sheep
杨 | 木字旁，一种树 ~ with 木: a poplar
事 | 事情 ~ a matter, a thing to do
是 | 表示判断 ~ is, to be
市 | 城市，市场 ~ a city, a market
试 | 言字旁，试一试 ~ with 讠: to try
在 | 存在，在哪里 ~ to be at
再 | 又一次 ~ again
载 | 记载 ~ to record
意 | 意思 ~ meaning
艺 | 草字头，手艺 ~ with 艹: a craft
忆 | 竖心旁，回忆 ~ with 忄: to recall
亿 | 单人旁，一万万 ~ with 亻: a hundred million
青 | 绿色或蓝色 ~ green or blue
轻 | 车字旁，分量小 ~ with 车: light
倾 | 单人旁，歪，斜 ~ with 亻: to lean
期 | 月字边，日期 ~ with 月: a date, a period
旗 | 方字旁，旗子 ~ with 方: a flag
棋 | 木字旁，下棋 ~ with 木: chess
骑 | 马字旁，骑马、骑车 ~ with 马: to ride
`,
    2,
  ).map(([c, g]) => [c!, bilingual(g!)]),
);

/** glossOf is the gloss of a character, failing when it has none. */
const glossOf = (c: string): Text => {
  const g = GLOSSES[c];
  if (!g) throw new Error(`similar characters: no gloss for ${c}`);
  return g;
};

/**
 * LOOK_ALIKE and SOUND_ALIKE are sentences with a gap: `sentence | word | right | three wrong`, the word as it stands
 * filled in, the wrong characters alike in form or in sound.
 */
const LOOK_ALIKE = rows(
  `
雨停了，天＿了，太阳出来了。 | 天晴 | 晴 | 清 请 睛
他的眼＿又大又亮。 | 眼睛 | 睛 | 晴 清 情
＿你帮我把门关上。 | 请你 | 请 | 清 情 晴
小河的水很＿，能看见河底的石子。 | 水很清 | 清 | 请 晴 情
妈妈＿着小弟弟在院子里晒太阳。 | 抱着 | 抱 | 跑 泡 炮
我吃得很＿，一点也吃不下了。 | 吃得很饱 | 饱 | 抱 跑 泡
我们分成两组，＿论这个问题。 | 辩论 | 辩 | 辨 辫 瓣
小红扎着两条小＿子。 | 辫子 | 辫 | 辩 辨 瓣
你能分＿出这两个字的不同吗？ | 分辨 | 辨 | 辩 辫 瓣
跑了一大圈，我口＿极了。 | 口渴 | 渴 | 喝 揭 歇
春天到了，我们去山上＿树。 | 栽树 | 栽 | 裁 载 戴
大家在门口等＿老师。 | 等候 | 候 | 猴 喉 侯
这是我自＿画的画。 | 自己 | 己 | 已 记 纪
小兔子用力＿萝卜。 | 拔萝卜 | 拔 | 拨 发 被
`,
  4,
);

const SOUND_ALIKE = rows(
  `
＿天是星期一。 | 今天 | 今 | 金 斤 巾
这条项链是＿子做的。 | 金子 | 金 | 今 斤 巾
妈妈买了两＿苹果。 | 两斤 | 斤 | 今 金 巾
我用毛＿擦了擦脸。 | 毛巾 | 巾 | 今 金 斤
我每天都按时＿作业。 | 做作业 | 做 | 作 坐 座
请大家回到＿位上。 | 座位 | 座 | 做 作 坐
星期天，我们去公＿玩。 | 公园 | 园 | 元 圆 原
十五的月亮又大又＿。 | 月亮又大又圆 | 圆 | 园 元 原
太＿出来了，天亮了。 | 太阳 | 阳 | 洋 羊 杨
我们一起去看大海，海＿真大。 | 海洋 | 洋 | 阳 羊 杨
我有一件＿要告诉你。 | 一件事 | 事 | 是 市 试
这道题不难，你来＿一＿。 | 试一试 | 试 | 事 是 市
这个词是什么＿思？ | 意思 | 意 | 艺 忆 亿
这只小鸟的羽毛很＿，一吹就飞起来了。 | 羽毛很轻 | 轻 | 青 清 倾
操场上升起了五星红＿。 | 红旗 | 旗 | 期 棋 骑
`,
  4,
);

/** gapChoices are the questions of filling a gap with the right one of characters alike in form or sound. */
function gapChoices(data: readonly (readonly string[])[], alike: Text): readonly Choice[] {
  return data.map(([sentence, word, right, wrong]) => {
    const r = right!;
    const g = glossOf(r);
    return choice({
      ask: t(`Which character fills the gap? The options are alike in ${alike.en}.`, `选字填空，下面几个字${alike["zh-CN"]}。`),
      shown: sentence!,
      right: r,
      wrong: wrong!.split(" ").map((w) => {
        const gw = glossOf(w);
        return [
          w,
          t(`${gw.en}; that does not fit the sentence, which needs ${word}.`, `${gw["zh-CN"]}，放进句子里讲不通，这里要的是“${word}”。`),
        ];
      }),
      find: t(
        `Read the sentence and ask what the gap must mean: ${word!.replace(r, "＿")} here is ${word}.`,
        `读一读句子，想想空里应该是什么意思：这里说的是“${word}”。`,
      ),
      choose: t(
        `Choose by what the character means and by its component: ${r} is ${g.en}. That is what the word needs.`,
        `按字的意思和偏旁来选：“${r}”${g["zh-CN"]}，正是这个词要的意思。`,
      ),
      check: t(
        `Read the sentence with ${r} in the gap: ${sentence!.replace("＿", r)} It makes sense.`,
        `把“${r}”填进去读一遍：${sentence!.replace("＿", r)}句子讲得通。`,
      ),
    });
  });
}

/** gradeThreeLanguage are the language topics of grade 3. */
export const gradeThreeLanguage: readonly GradeTopic[] = [
  {
    grade: 3,
    topic: {
      id: "dictionary-words",
      title: t("Choosing a Sense in the Dictionary", "查字典词典：选择义项"),
      summary: t(
        "Choosing, among the senses a dictionary gives, the one a character has in a word and the one a word has in a sentence.",
        "在字典、词典列出的几个义项里，选出一个字在词语中的意思和一个词在句子中的意思。",
      ),
      intro: t(
        "A dictionary gives most characters several senses, numbered ①, ②, ③. 深 has ① far from top to bottom, ② deep in feeling, ③ dark in colour, ④ long after it began. Which one is meant depends on where it stands: in 深夜, late in the night, it is ④.\n\nSo after looking a character or word up, try each sense in its place and keep the one that makes sense. The first knowledge point chooses the sense of a character in a word, the second the sense of a word in a sentence.",
        "字典里很多字都有几个义项，用①②③标出来。比如“深”：①从上到下或从外到里的距离大；②感情厚，关系密切；③颜色浓；④离开始的时间很久。用的是哪一个，要看它在哪里：“深夜”是夜里很晚的时候，“深”是义项④。\n\n所以查到字或词以后，要把几个义项一个个放进去试，留下讲得通的那一个。第一个知识点选字在词语中的义项，第二个选词在句子中的义项。",
      ),
      prerequisites: ["dictionary-radicals"],
      encompasses: [],
      xp: 12,
      strand: "characters",
      knowledgePoints: [
        point(
          "dictionary-words-character",
          t("The Sense of a Character in a Word", "字在词语中的义项"),
          t(
            "To choose a character's sense, think what the whole word means, then find the sense that gives that meaning.\n\n花 has ① a flower, ② many-coloured, ③ to spend, ④ blurred. 花钱 means to spend money: so 花 is ③.\n\n> **Watch out.** The first sense is not always the right one. 花 in 花衣服 is not a flower: the clothes are patterned, sense ②.",
            "选字的义项，先想想整个词是什么意思，再找出合这个意思的义项。\n\n“花”有：①花朵；②颜色或图案错杂的；③用，用掉；④眼睛看不清楚。“花钱”是用钱，所以“花”是义项③。\n\n> **注意。** 第一个义项不一定就对。“花衣服”的“花”不是花朵，而是有各种颜色和图案，是义项②。",
          ),
          choiceTopicGenerator(senseChoices(CHARACTER_SENSES, false), SENSE_HEADS),
        ),
        point(
          "dictionary-words-word",
          t("The Sense of a Word in a Sentence", "词在句子中的义项"),
          t(
            "A word, too, may have several senses. Read the whole sentence and ask which sense it needs.\n\n骄傲 is ① conceited, ② proud, ③ something to be proud of. In “长城是我们的骄傲。” the Great Wall is something we are proud of: sense ③.\n\n> **Watch out.** A word can be praise or blame. 骄傲 in “看到妹妹得了奖，我心里很骄傲” is a good pride, not conceit: read what the sentence says about it.",
            "一个词也可能有几个义项。读完整句话，想想这里需要哪一个。\n\n“骄傲”有：①自以为了不起，看不起别人；②自豪；③值得自豪的人或事。“长城是我们的骄傲。”长城是值得我们自豪的东西，是义项③。\n\n> **注意。** 一个词有时是夸，有时是批评。“看到妹妹得了奖，我心里很骄傲”里的“骄傲”是自豪，不是看不起别人，要看句子说的是什么。",
          ),
          choiceTopicGenerator(senseChoices(WORD_SENSES, true), SENSE_HEADS),
        ),
      ],
    },
  },
  {
    grade: 3,
    topic: {
      id: "language-3-similar-characters",
      title: t("Characters That Look or Sound Alike", "形近字和同音字"),
      summary: t(
        "Telling apart characters that look alike, by their components, and characters that sound alike, by their meaning in a word.",
        "分辨形近字，看偏旁；分辨同音字，看在词语中的意思。",
      ),
      intro: t(
        "Some characters look alike: 晴, 清, 请, 睛 and 情 share 青, and differ in their component. The component tells the meaning: 日 the sun in 晴, 氵 water in 清, 讠 speech in 请, 目 the eye in 睛, 忄 the heart in 情.\n\nOthers sound alike: 今, 金, 斤 and 巾 are all jīn. Only the word tells them apart: 今天, 金子, 两斤, 毛巾. The first knowledge point chooses among characters that look alike, the second among characters that sound alike.",
        "有些字长得很像：“晴、清、请、睛、情”都有“青”，只是偏旁不同。偏旁能告诉我们意思：“晴”有日，和太阳有关；“清”有三点水，和水有关；“请”有言字旁，和说话有关；“睛”有目字旁，和眼睛有关；“情”有竖心旁，和心有关。\n\n还有些字读音一样：“今、金、斤、巾”都读 jīn，只能看它们组成的词来分：今天、金子、两斤、毛巾。第一个知识点分辨形近字，第二个分辨同音字。",
      ),
      prerequisites: ["dictionary-words"],
      encompasses: [],
      xp: 12,
      strand: "characters",
      knowledgePoints: [
        point(
          "language-3-similar-characters-form",
          t("Characters Alike in Form", "形近字"),
          t(
            "Characters alike in form differ in a component, and the component points to the meaning. Ask what the word needs, then find the component that fits.\n\nIn “小红扎着两条小＿子”, the word is a plait, which is twisted like thread: 辫, with 纟 in the middle.\n\n> **Watch out.** Look at every part. 辩, 辨, 辫 and 瓣 differ only in the middle: 言 to argue, a dot and a stroke to tell apart, 纟 a plait, 瓜 a petal.",
            "形近字的不同在偏旁上，偏旁和意思有关。先想想词语要什么意思，再找偏旁合适的字。\n\n比如“小红扎着两条小＿子”，这里说的是编起来的头发，像丝线一样编，所以是中间有绞丝的“辫”。\n\n> **注意。** 每个部分都要看清。“辩、辨、辫、瓣”只是中间不同：言是用话争论，点撇是分清楚，绞丝是辫子，瓜是花瓣。",
          ),
          choiceTopicGenerator(gapChoices(LOOK_ALIKE, t("form", "字形相近")), {
            find: t("**Step 1: ask what the gap means.**", "**第一步：想想空里是什么意思。**"),
            choose: t("**Step 2: choose by the component.**", "**第二步：按偏旁来选。**"),
          }),
        ),
        point(
          "language-3-similar-characters-sound",
          t("Characters Alike in Sound", "同音字"),
          t(
            "Characters alike in sound cannot be told apart by ear. Ask which word the sentence needs, and choose the character that word is written with.\n\nIn “请大家回到＿位上”, the word is a seat, 座位, with 座 under 广, not 坐, to sit, nor 做, to do.\n\n> **Watch out.** A character that sounds right may still be the wrong one. 做 and 作 are both zuò, but it is 做作业, not 作作业.",
            "同音字听起来一样，分不出来。要想想句子里是哪个词，再选这个词用的字。\n\n比如“请大家回到＿位上”，这里说的是座位，是广字头的“座”，不是“坐下”的“坐”，也不是“做事”的“做”。\n\n> **注意。** 读音对了，字不一定对。“做”和“作”都读 zuò，可要写“做作业”，不是“作作业”。",
          ),
          choiceTopicGenerator(gapChoices(SOUND_ALIKE, t("sound", "读音相同")), {
            find: t("**Step 1: ask which word the sentence needs.**", "**第一步：想想句子里是哪个词。**"),
            choose: t("**Step 2: choose the character of that word.**", "**第二步：选出这个词用的字。**"),
          }),
        ),
      ],
    },
  },
];
