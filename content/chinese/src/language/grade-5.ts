// The language and inquiry topics of grade 5 (docs/chinese-curriculum.md §18.9): how characters are made, by the four
// methods the general dictionaries and school grammars describe, and finding and using information. The analyses are
// the common ones of the dictionaries, worded for this subject; the questions of inquiry are written for it.

import { type Text, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { bilingual, type Choice, choice, choiceTopicGenerator, listedChoices, rows } from "./choice-kit.ts";

/** Method is one of the four methods of making characters. */
type Method = "象形" | "指事" | "会意" | "形声";

/** METHODS are the four methods, each with what it is and why a character made otherwise is not of it. */
const METHODS: Readonly<Record<Method, { readonly is: Text; readonly not: Text }>> = {
  象形: {
    is: t("a pictograph draws the shape of the thing itself", "象形字是照着事物的样子画出来的"),
    not: t("it does not draw the shape of a thing", "它不是照着一样东西的样子画出来的"),
  },
  指事: {
    is: t(
      "an indicative adds a mark to a picture, or uses marks alone, to point at a meaning",
      "指事字是在象形字上加符号，或者用符号来指出意思",
    ),
    not: t("it has no mark pointing at a part of a picture", "它没有用符号指出意思"),
  },
  会意: {
    is: t(
      "a compound ideograph joins two or more characters, whose meanings together make its own",
      "会意字是把两个或几个字合起来，用它们的意思合成新的意思",
    ),
    not: t("it is not made by joining the meanings of two characters", "它不是把两个字的意思合起来造的"),
  },
  形声: {
    is: t("a phono-semantic character joins a part for the meaning and a part for the sound", "形声字一部分表示意思，一部分表示读音"),
    not: t("none of its parts gives its sound", "它没有表示读音的部分"),
  },
};

/** FORMED are the characters of the first three methods, each on a line `character | method | how it is made, Chinese ~ English`. */
const FORMED = rows(
  `
日 | 象形 | 像圆圆的太阳，中间有一点 ~ like the round sun, with a dot in it
月 | 象形 | 像一弯月牙 ~ like a crescent moon
山 | 象形 | 像连在一起的几座山峰 ~ like a row of peaks
水 | 象形 | 像弯弯曲曲流着的水 ~ like water flowing in curves
人 | 象形 | 像一个侧身站着的人 ~ like a person standing, seen from the side
目 | 象形 | 像一只竖起来的眼睛 ~ like an eye turned upright
木 | 象形 | 像一棵树，上有树枝，下有树根 ~ like a tree, with branches above and roots below
鱼 | 象形 | 像一条鱼，有头、身子和尾巴 ~ like a fish, with head, body and tail
雨 | 象形 | 像雨点从天上落下来 ~ like drops falling from the sky
门 | 象形 | 像两扇对开的门 ~ like a door of two leaves
上 | 指事 | 在一横上面加一个符号，指出上面 ~ a mark above a line points to what is above
下 | 指事 | 在一横下面加一个符号，指出下面 ~ a mark below a line points to what is below
本 | 指事 | 在“木”的下部加一横，指出树根 ~ a stroke on the lower part of 木 points to the root
末 | 指事 | 在“木”的上部加一横，指出树梢 ~ a stroke on the top of 木 points to the treetop
刃 | 指事 | 在“刀”上加一点，指出刀口 ~ a dot on 刀 points to the blade's edge
休 | 会意 | “人”靠在“木”旁边，表示休息 ~ 人 leaning on 木, a tree: to rest
明 | 会意 | “日”和“月”合在一起，表示明亮 ~ 日 and 月 together: bright
林 | 会意 | 两个“木”，表示树木多 ~ two 木: many trees
从 | 会意 | 一个“人”跟着另一个“人”，表示跟随 ~ one 人 behind another: to follow
众 | 会意 | 三个“人”，表示人多 ~ three 人: many people
尖 | 会意 | 上面“小”，下面“大”，表示物体末端细小 ~ 小 above 大: tapering to a point
采 | 会意 | 上面是手（爪），下面是“木”，表示用手在树上摘 ~ a hand above 木: to pick from a tree
看 | 会意 | “手”搭在“目”上，表示远望 ~ a hand over 目, the eye: to look out
男 | 会意 | “田”和“力”，表示在田里出力的人 ~ 田 and 力: the one who labours in the fields
鸣 | 会意 | “口”和“鸟”，表示鸟叫 ~ 口 and 鸟: a bird calling
`,
  3,
).map(([char, method, how]) => ({ char: char!, method: method as Method, how: bilingual(how!) }));

/** byMethod are the questions of naming the method by which a character was made. */
const byMethod: readonly Choice[] = FORMED.map(({ char, method, how }) =>
  choice({
    ask: t(`By which method was ${char} made?`, `“${char}”是用哪种方法造的字？`),
    shown: "",
    right: method,
    wrong: (Object.keys(METHODS) as Method[])
      .filter((m) => m !== method)
      .map((m) => [
        m,
        t(
          `${METHODS[m].is.en}, but ${char} is ${how.en}: ${METHODS[m].not.en}.`,
          `${METHODS[m].is["zh-CN"]}；“${char}”是${how["zh-CN"]}，${METHODS[m].not["zh-CN"]}。`,
        ),
      ]),
    find: t(`Look at how ${char} is made: ${how.en}.`, `看看“${char}”是怎样造的：${how["zh-CN"]}。`),
    choose: t(`So it is ${method}: ${METHODS[method].is.en}.`, `所以是${method}字：${METHODS[method].is["zh-CN"]}。`),
    check: t(
      `Go through the others: ${char} has no part for its sound, so it is not 形声${method === "象形" ? "" : `, and it is not a single picture, so not 象形`}; ${method} fits.`,
      `再把别的方法排除一下：“${char}”没有表示读音的部分，不是形声字${method === "象形" ? "" : "；也不只是画一样东西，不是象形字"}。是${method}字。`,
    ),
  }),
);

/** PHONETIC are the phono-semantic characters, each `character | pinyin | meaning part ~ what it means, Chinese ~ English | sound part | its pinyin | a part it does not have that might give its meaning | one that might give its sound`. */
const PHONETIC = rows(
  `
河 | hé | 氵 ~ 水 ~ water | 可 | kě | 扌 | 工
妈 | mā | 女 ~ 女子 ~ a woman | 马 | mǎ | 亻 | 口
铜 | tóng | 钅 ~ 金属 ~ metal | 同 | tóng | 木 | 月
草 | cǎo | 艹 ~ 草木 ~ plants | 早 | zǎo | 竹 | 十
晴 | qíng | 日 ~ 太阳 ~ the sun | 青 | qīng | 目 | 主
睛 | jīng | 目 ~ 眼睛 ~ the eye | 青 | qīng | 日 | 争
请 | qǐng | 讠 ~ 说话 ~ speaking | 青 | qīng | 氵 | 令
园 | yuán | 囗 ~ 围起来的地方 ~ an enclosure | 元 | yuán | 土 | 云
闻 | wén | 耳 ~ 耳朵 ~ the ear | 门 | mén | 目 | 文
期 | qī | 月 ~ 时间 ~ time | 其 | qí | 贝 | 甘
功 | gōng | 力 ~ 力气 ~ strength | 工 | gōng | 刀 | 公
想 | xiǎng | 心 ~ 心思 ~ the mind | 相 | xiāng | 口 | 香
爸 | bà | 父 ~ 父亲 ~ a father | 巴 | bā | 女 | 八
蚊 | wén | 虫 ~ 虫子 ~ an insect | 文 | wén | 鸟 | 门
`,
  7,
).map(([char, pinyin, meaning, sound, soundPinyin, otherMeaning, otherSound]) => {
  const [part = "", zh = "", en = ""] = meaning!.split(" ~ ").map((s) => s.trim());
  if (part === "" || zh === "" || en === "") throw new Error(`phonetic: ${char}`);
  return {
    char: char!,
    pinyin: pinyin!,
    part,
    sense: t(en, zh),
    sound: sound!,
    soundPinyin: soundPinyin!,
    otherMeaning: otherMeaning!,
    otherSound: otherSound!,
  };
});

/** byPart are the questions of finding the part of a phono-semantic character that gives its meaning, and the part that gives its sound. */
const byPart: readonly Choice[] = PHONETIC.flatMap((c) => [
  choice({
    ask: t(`${c.char} is phono-semantic. Which part gives its meaning?`, `“${c.char}”是形声字。哪一部分表示意思（形旁）？`),
    shown: "",
    right: c.part,
    wrong: [
      [
        c.sound,
        t(
          `${c.sound}, ${c.soundPinyin}, gives the sound: ${c.char} is read ${c.pinyin}.`,
          `“${c.sound}”读 ${c.soundPinyin}，表示的是读音：“${c.char}”读 ${c.pinyin}。`,
        ),
      ],
      [c.otherMeaning, t(`${c.char} has no ${c.otherMeaning} in it.`, `“${c.char}”里没有“${c.otherMeaning}”这个部分。`)],
    ],
    find: t(`Split ${c.char} into its two parts: ${c.part} and ${c.sound}.`, `把“${c.char}”分成两部分：“${c.part}”和“${c.sound}”。`),
    choose: t(
      `${c.part} stands for ${c.sense.en}, which has to do with what ${c.char} means; so it is the meaning part.`,
      `“${c.part}”和${c.sense["zh-CN"]}有关，“${c.char}”的意思也和它有关，所以它是形旁。`,
    ),
    check: t(
      `The other part, ${c.sound}, is read ${c.soundPinyin}, close to ${c.pinyin}: it is the sound part, and ${c.part} is left for the meaning.`,
      `另一部分“${c.sound}”读 ${c.soundPinyin}，和 ${c.pinyin} 相近，是声旁；表示意思的正是“${c.part}”。`,
    ),
  }),
  choice({
    ask: t(`${c.char} is phono-semantic. Which part gives its sound?`, `“${c.char}”是形声字。哪一部分表示读音（声旁）？`),
    shown: "",
    right: c.sound,
    wrong: [
      [
        c.part,
        t(
          `${c.part} stands for ${c.sense.en}: it gives the meaning, not the sound.`,
          `“${c.part}”和${c.sense["zh-CN"]}有关，表示的是意思，不是读音。`,
        ),
      ],
      [
        c.otherSound,
        t(
          `${c.char} has no ${c.otherSound} in it, though it may sound alike.`,
          `“${c.char}”里没有“${c.otherSound}”这个部分，读音再像也不是它的声旁。`,
        ),
      ],
    ],
    find: t(`Split ${c.char} into its two parts: ${c.part} and ${c.sound}.`, `把“${c.char}”分成两部分：“${c.part}”和“${c.sound}”。`),
    choose: t(
      `${c.sound} is read ${c.soundPinyin}, close to ${c.char}, ${c.pinyin}: it is the sound part.`,
      `“${c.sound}”读 ${c.soundPinyin}，和“${c.char}”的读音 ${c.pinyin} 相近，是声旁。`,
    ),
    check: t(
      `The other part, ${c.part}, stands for ${c.sense.en}, as the meaning of ${c.char} does: it is the meaning part, so ${c.sound} gives the sound.`,
      `另一部分“${c.part}”和${c.sense["zh-CN"]}有关，是形旁；所以表示读音的是“${c.sound}”。`,
    ),
  }),
]);

/** WHERE are the questions of where to look for information. */
const WHERE = `
想知道“鸿”字怎么读、是什么意思，最方便查什么？ ~ To learn how 鸿 is read and what it means, what is quickest to look in? | 字典 | 字典能按音序或部首查到字的读音和意思 ~ a dictionary finds a character's reading and meaning by sound or radical | 地图册 | 地图册上只有地方的位置，查不到字的读音 ~ an atlas shows places, not readings | 课程表 | 课程表上只有每节课上什么，没有字的解释 ~ a timetable shows lessons, not characters
想知道成都在四川省的什么位置，应该查什么？ ~ To find where Chengdu lies in Sichuan, what should one look in? | 地图 | 地图能看出一个地方在哪里 ~ a map shows where a place is | 字典 | 字典解释字的读音和意思，看不出地方的位置 ~ a dictionary explains characters, not where places lie | 日历 | 日历上是日期，和地方的位置无关 ~ a calendar shows dates, not places
想知道明天会不会下雨，应该看什么？ ~ To know whether it will rain tomorrow, what should one look at? | 天气预报 | 天气预报专门告诉人们以后几天的天气 ~ a forecast tells the coming weather | 去年的日记 | 日记记的是过去的事，说不了明天的天气 ~ a diary records the past, not tomorrow's weather | 作文选 | 作文选是同学的作文，不预报天气 ~ a book of compositions forecasts nothing
想知道今年的中秋节是哪一天，查什么最快？ ~ To find the date of this year's Mid-Autumn Festival, what is quickest? | 今年的日历 | 日历上标着每一天的日期和节日 ~ a calendar marks each day and festival | 字典 | 字典里查不到今年节日的日期 ~ a dictionary does not give this year's dates | 地图 | 地图上没有日期 ~ a map has no dates
想在学校图书馆里找一本关于恐龙的书，应该先怎么做？ ~ To find a book on dinosaurs in the school library, what first? | 用图书目录查“恐龙” | 图书目录按书名和类别排好，能很快找到书在哪个架子上 ~ the catalogue, by title and kind, shows the shelf at once | 从第一个书架开始一本一本翻 | 一本一本翻太慢了，图书馆有目录可以查 ~ going through every book is too slow when there is a catalogue | 随便借一本有图的书 | 随便借不一定是讲恐龙的，没有按需要找 ~ any book with pictures may not be about dinosaurs
想在网上查“大熊猫吃什么”，搜索时最好输入什么？ ~ Searching online for what pandas eat, what is best to type? | 大熊猫 食物 | 关键词要抓住要查的两样：大熊猫和它的食物 ~ the key words name the two things sought: the panda and its food | 动物 | “动物”太宽了，查出来的东西太多 ~ “animal” is too wide and finds too much | 我想知道一个问题 | 这句话没有关键词，搜不出要找的内容 ~ this has no key word and finds nothing in particular
想知道一个成语的出处和意思，最好查什么？ ~ To learn where an idiom comes from and what it means, what is best? | 成语词典 | 成语词典专门解释成语的意思和出处 ~ an idiom dictionary gives the meaning and source of idioms | 菜谱 | 菜谱讲怎样做菜，和成语无关 ~ a cookbook is about cooking | 列车时刻表 | 时刻表只有车次和时间 ~ a timetable has only trains and times
想知道家乡过去一百年发生过哪些大事，可以查什么？ ~ To learn what happened in one's home town over a century, what can one look in? | 地方志 | 地方志记录一个地方的历史、地理和风俗 ~ a local gazetteer records a place's history, land and customs | 天气预报 | 天气预报只说最近的天气，没有历史 ~ a forecast is about the coming days, not history | 今天的课程表 | 课程表和家乡的历史无关 ~ a timetable has nothing on local history
想了解养蚕的方法，除了查书，还可以问谁？ ~ To learn how to raise silkworms, whom else can one ask besides books? | 养过蚕的老师或家长 | 有经验的人能讲出书上没有的做法 ~ one who has done it can tell what books leave out | 刚上一年级的弟弟 | 弟弟年纪小，没有养蚕的经验 ~ a small brother has no experience of it | 卖文具的店员 | 卖文具的人不一定懂养蚕 ~ a stationery clerk may know nothing of silkworms
想知道一种植物叫什么名字，手边没有书，最好怎么做？ ~ To name a plant with no book at hand, what is best? | 拍下照片，回家查植物图鉴 | 植物图鉴有图片，可以对照着认 ~ a plant guide has pictures to compare with | 随便给它起一个名字 | 自己起的名字不是它真正的名字 ~ a made-up name is not its real one | 查成语词典 | 成语词典里查不到植物的名字和样子 ~ an idiom dictionary does not name plants
想知道全班同学最喜欢什么运动，最好的方法是什么？ ~ To know which sport the class likes best, what is the best way? | 做一次问卷调查 | 问卷调查能问到每个同学，结果最可靠 ~ a survey asks everyone and is most reliable | 查字典 | 字典里查不到同学们的想法 ~ a dictionary does not hold classmates' views | 只问自己的同桌 | 只问一个人，不能代表全班 ~ one person cannot speak for the class
想知道一个英文单词是什么意思，应该查什么？ ~ To learn what an English word means, what should one look in? | 英汉词典 | 英汉词典能查到英文单词的中文意思 ~ an English–Chinese dictionary gives the word's meaning | 新华字典 | 《新华字典》查的是汉字，没有英文单词 ~ a Chinese character dictionary has no English words | 地方志 | 地方志记的是地方的历史，没有单词 ~ a gazetteer records local history
`;

/** ANSWERS are the questions of choosing, among what was found, the information that answers the question. */
const ANSWERS = `
问题：蜂鸟为什么要不停地吃东西？找到了三条资料，哪一条能回答？ ~ Why must the hummingbird keep eating? Which of three notes answers? | 蜂鸟飞行很费力气，消耗的能量很大 | 这一条说出了原因：飞得费力，要不停地补充能量 ~ this gives the reason: flying costs so much that it must keep refuelling | 蜂鸟是世界上最小的鸟 | 这一条讲蜂鸟的大小，没有说为什么要不停地吃 ~ this is about its size, not why it eats | 蜂鸟的羽毛颜色很漂亮 | 这一条讲羽毛，和吃东西无关 ~ this is about its feathers, not its eating
问题：长江有多长？哪一条资料能回答？ ~ How long is the Yangtze? Which note answers? | 长江全长约六千三百公里 | 这一条直接给出了长江的长度 ~ this gives its length | 长江流经十一个省、自治区和直辖市 | 这一条讲长江流过哪些地方，不是长度 ~ this tells where it flows, not how long it is | 长江是我国第一大河 | 这一条说它最大，没有说出具体长度 ~ this says it is the largest, not how long
问题：怎样让绿豆发芽？哪一条资料能回答？ ~ How does one sprout mung beans? Which note answers? | 把绿豆泡在水里，每天换水，放在没有阳光直射的地方 | 这一条说出了发芽的方法 ~ this gives the method | 绿豆汤可以解暑 | 这一条讲绿豆汤的用处，不是怎样发芽 ~ this is about mung bean soup, not sprouting | 绿豆是一种豆子 | 这一条只说绿豆是什么，没有说怎样发芽 ~ this only says what it is
问题：端午节为什么要赛龙舟？哪一条资料能回答？ ~ Why are dragon boats raced at Duanwu? Which note answers? | 相传人们划船去江上寻找投江的屈原，后来就有了赛龙舟 | 这一条说出了赛龙舟的来历 ~ this tells how the race began | 端午节在农历五月初五 | 这一条讲日期，没有说为什么赛龙舟 ~ this gives the date, not the reason | 粽子有甜的，也有咸的 | 这一条讲粽子，和赛龙舟的原因无关 ~ this is about zongzi, not the race
问题：骆驼为什么能在沙漠里很多天不喝水？哪一条资料能回答？ ~ Why can camels go days without water? Which note answers? | 骆驼的驼峰里储存着脂肪，能转化成身体需要的能量和水分 | 这一条说出了骆驼耐渴的原因 ~ this gives the reason it endures thirst | 骆驼被称为“沙漠之舟” | 这一条是骆驼的别名，没有说原因 ~ this is its nickname, not the reason | 骆驼可以驮很重的东西 | 这一条讲骆驼能驮东西，不是能不喝水的原因 ~ this is about loads, not thirst
问题：我们学校的图书馆星期几不开门？哪一条资料能回答？ ~ On which day is the library shut? Which note answers? | 图书馆星期一闭馆 | 这一条直接说了哪天不开门 ~ this says which day it is shut | 图书馆每次最多借三本书 | 这一条讲借书的数量，不是哪天关门 ~ this is about how many books, not which day | 图书馆有两万多本书 | 这一条讲书的多少，没有说开门的时间 ~ this is about how many books it holds
问题：雷声为什么总比闪电晚一点到？哪一条资料能回答？ ~ Why does thunder come after lightning? Which note answers? | 光传播得比声音快得多 | 这一条说出了先看到闪电、后听到雷声的原因 ~ this gives the reason: light is far faster than sound | 雷雨天不要在大树下躲雨 | 这一条讲安全，没有说原因 ~ this is about safety, not the reason | 夏天常常打雷 | 这一条讲什么时候打雷，没有说为什么晚到 ~ this says when it thunders, not why it is late
问题：赵州桥是什么时候建造的？哪一条资料能回答？ ~ When was the Zhaozhou Bridge built? Which note answers? | 赵州桥建于隋朝，距今一千四百多年 | 这一条说出了建造的时间 ~ this gives when it was built | 赵州桥是石拱桥 | 这一条讲桥的样式，不是时间 ~ this is its kind, not its date | 赵州桥在河北省 | 这一条讲桥在哪里，不是什么时候建的 ~ this says where it is, not when it was built
问题：企鹅生活在什么地方？哪一条资料能回答？ ~ Where do penguins live? Which note answers? | 企鹅主要生活在南极和南半球的海岸 | 这一条直接说出了企鹅生活的地方 ~ this says where they live | 企鹅不会飞，但很会游泳 | 这一条讲企鹅的本领，不是生活的地方 ~ this is about what they can do, not where they live | 企鹅走路一摇一摆 | 这一条讲企鹅走路的样子 ~ this is about how they walk
问题：怎样保护眼睛？哪一条资料最能回答？ ~ How does one take care of one's eyes? Which note answers best? | 看书时眼睛离书一尺左右，看一会儿要向远处望一望 | 这一条说出了保护眼睛的具体做法 ~ this gives what to do | 眼睛是心灵的窗户 | 这是一句比喻，没有说怎样保护 ~ this is a figure of speech, not a way | 人有两只眼睛 | 这一条是常识，和保护眼睛的方法无关 ~ this is a plain fact with no method in it
问题：古代的人用什么计时？哪一条资料能回答？ ~ How did people of old tell the time? Which note answers? | 古人用日晷看影子，用漏壶看滴水来计时 | 这一条说出了古代计时的工具 ~ this names the tools they used | 现在人们用手表看时间 | 这一条讲的是现在，不是古代 ~ this is about now, not old times | 一天有二十四小时 | 这一条讲一天的时间，没有说古人用什么计时 ~ this is about the day, not how it was told
问题：种子靠什么去旅行？哪一条资料能回答？ ~ How do seeds travel? Which note answers? | 有的种子靠风，有的靠水，有的粘在动物身上被带走 | 这一条说出了种子旅行的办法 ~ this gives the ways they travel | 种子埋进土里会发芽 | 这一条讲种子发芽，不是怎样旅行 ~ this is about sprouting, not travel | 种子有大有小 | 这一条讲种子的大小 ~ this is about their size
`;

/** gradeFiveLanguage are the language and inquiry topics of grade 5. */
export const gradeFiveLanguage: readonly GradeTopic[] = [
  {
    grade: 5,
    topic: {
      id: "language-5-character-formation",
      title: t("How Characters Are Made", "汉字的造字方法"),
      summary: t(
        "The four methods of making characters: pictographs, indicatives and compound ideographs, and phono-semantic characters with a part for the meaning and a part for the sound.",
        "汉字的四种造字方法：象形、指事、会意，以及一部分表示意思、一部分表示读音的形声字。",
      ),
      intro: t(
        "Characters were made in a few ways. 山 draws a row of peaks: a pictograph (象形). 本 puts a stroke on the lower part of 木 to point at the root: an indicative (指事). 休 sets 人 beside 木, a person resting by a tree: a compound ideograph (会意).\n\nMost characters are phono-semantic (形声): in 河, 氵 says it has to do with water, and 可, kě, gives a sound close to hé. The first knowledge point names the first three methods, the second finds the parts of a phono-semantic character.",
        "汉字是用几种方法造出来的。“山”像几座连着的山峰，是象形字。“本”在“木”的下部加一横，指出树根，是指事字。“休”是“人”靠在“木”旁边休息，是会意字。\n\n大多数汉字是形声字：“河”的“氵”表示和水有关，“可”读 kě，和 hé 读音相近，表示读音。第一个知识点辨认象形、指事和会意，第二个找出形声字的形旁和声旁。",
      ),
      prerequisites: ["language-3-similar-characters"],
      encompasses: [],
      xp: 12,
      strand: "characters",
      knowledgePoints: [
        point(
          "language-5-character-formation-pictograph",
          t("Pictographs, Indicatives and Compound Ideographs", "象形、指事和会意"),
          t(
            "Ask how the character shows its meaning: by drawing the thing (象形), by a mark that points at a part of a drawing (指事), or by joining characters whose meanings add up (会意).\n\n末 is 木 with a stroke at the top, pointing at the treetop: 指事. 明 joins 日 and 月, the sun and the moon: bright, 会意.\n\n> **Watch out.** An indicative and a compound ideograph both build on other characters. If the added part is only a mark, as in 本 and 刃, it is 指事; if it is a character with its own meaning, as in 休 and 林, it is 会意.",
            "想一想这个字是怎样表示意思的：照着东西画出来的，是象形；在象形字上加符号指出意思的，是指事；把几个字合起来、用它们的意思合成新意思的，是会意。\n\n“末”是在“木”的上部加一横，指出树梢：指事。“明”把“日”和“月”合在一起，表示明亮：会意。\n\n> **注意。** 指事字和会意字都用到了别的字。加上的只是一个符号，像“本”“刃”，是指事；加上的是有意思的字，像“休”“林”，是会意。",
          ),
          choiceTopicGenerator(byMethod, {
            find: t("**Step 1: see how the character is made.**", "**第一步：看看这个字是怎样造的。**"),
            choose: t("**Step 2: name the method.**", "**第二步：说出造字方法。**"),
          }),
        ),
        point(
          "language-5-character-formation-phonetic",
          t("Phono-Semantic Characters", "形声字的形旁和声旁"),
          t(
            "A phono-semantic character has two parts: the meaning part (形旁) says what it has to do with, and the sound part (声旁) is read like it. Split the character, and ask which part fits its meaning and which its sound.\n\n晴, qíng, a clear sky: 日, the sun, is the meaning part; 青, qīng, is the sound part.\n\n> **Watch out.** The sound part is often read only close to the character, not the same: 河 is hé and 可 is kě. And one sound part serves many characters: 青 in 晴, 睛, 请 and 清, each with its own meaning part.",
            "形声字分两部分：形旁表示字和什么有关，声旁表示字的读音。把字分开，想一想哪部分和意思有关，哪部分和读音有关。\n\n“晴”读 qíng，是天空没有云：“日”和太阳有关，是形旁；“青”读 qīng，是声旁。\n\n> **注意。** 声旁的读音常常只是和字相近，不一定完全一样：“河”读 hé，“可”读 kě。一个声旁可以用在很多字里：“晴”“睛”“请”“清”都用“青”做声旁，形旁各不相同。",
          ),
          choiceTopicGenerator(byPart, {
            find: t("**Step 1: split the character in two.**", "**第一步：把字分成两部分。**"),
            choose: t("**Step 2: match each part to meaning or sound.**", "**第二步：看哪部分表示意思，哪部分表示读音。**"),
          }),
        ),
      ],
    },
  },
  {
    grade: 5,
    topic: {
      id: "inquiry-5-sources",
      title: t("Finding and Using Information", "查找和运用资料"),
      summary: t(
        "Choosing where to look for what one needs, dictionaries, maps, calendars, catalogues, searches and people, and choosing among what was found the information that answers the question.",
        "根据需要选择查找资料的地方：字典词典、地图、日历、图书目录、网上搜索和请教别人；从找到的资料里选出能回答问题的信息。",
      ),
      intro: t(
        "Each need has its place to look. How to read 鸿 is in a dictionary; where Chengdu lies is on a map; the date of a festival is on a calendar; what classmates think needs a survey.\n\nWhat one finds must then answer the question. Asked why the hummingbird keeps eating, “it is the smallest bird” is true but no answer; “flying costs it so much energy” is. The first knowledge point asks where to look, the second which information answers.",
        "要找什么，就到合适的地方去找。“鸿”字怎么读，查字典；成都在哪里，看地图；节日是哪一天，查日历；同学们怎么想，要做调查。\n\n找到的资料还要能回答问题。问蜂鸟为什么要不停地吃东西，“蜂鸟是最小的鸟”是真的，却回答不了；“蜂鸟飞行很费力气”才是答案。第一个知识点问到哪里查找，第二个问哪条资料能回答问题。",
      ),
      prerequisites: ["dictionary-words"],
      encompasses: [],
      xp: 12,
      strand: "reading",
      knowledgePoints: [
        point(
          "inquiry-5-sources-where",
          t("Where to Look", "到哪里查找"),
          t(
            "Ask what kind of thing you need, a reading, a place, a date, a fact of the past, a way of doing, a view, and go to the source made for it.\n\nTo learn how 鸿 is read and what it means, a dictionary: it is arranged by sound and radical for just that.\n\nTo search online, type the key words of what you want, such as “大熊猫 食物”, not a whole sentence.\n\n> **Watch out.** A source may be about something near your need and still not hold it: a dictionary explains the word 成都 but does not show where the city lies.",
            "先想一想要找的是什么：读音、地点、日期、过去的事、做法，还是别人的想法；再到专门讲这些的地方去找。\n\n想知道“鸿”字怎么读、什么意思，查字典：字典就是按音序和部首排好、专门查字的。\n\n在网上搜索，要输入关键词，比如“大熊猫 食物”，而不是一整句话。\n\n> **注意。** 有的资料和要找的东西沾边，却查不到需要的内容：字典能解释“成都”这个词，却看不出它在什么位置。",
          ),
          choiceTopicGenerator(
            listedChoices(WHERE, {
              find: t("Ask what kind of information is needed.", "想一想要找的是哪一类信息。"),
              check: (right) =>
                t(
                  `Imagine opening ${right}: what you need is there, set out to be found.`,
                  `想象一下打开“${right}”：要找的内容就在里面，而且很好找。`,
                ),
            }),
            {
              find: t("**Step 1: say what you need.**", "**第一步：说出要找的是什么。**"),
              choose: t("**Step 2: choose the source made for it.**", "**第二步：选出专门能查到它的地方。**"),
            },
          ),
        ),
        point(
          "inquiry-5-sources-answers",
          t("The Information That Answers", "选出能回答问题的资料"),
          t(
            "Read the question for what it asks, a reason, an amount, a time, a place or a way, and keep only the note that gives that.\n\nWhen was the Zhaozhou Bridge built? “建于隋朝，距今一千四百多年” gives a time; “是石拱桥” is true but gives a kind.\n\n> **Watch out.** A note on the same subject is not an answer by that alone: every note may be about the bridge, and only one says when.",
            "先看清问题问的是什么：原因、数量、时间、地点，还是方法；再只留下正好说到这一点的资料。\n\n赵州桥是什么时候建造的？“建于隋朝，距今一千四百多年”说的是时间；“是石拱桥”是真的，说的却是样式。\n\n> **注意。** 讲的是同一样东西，不等于能回答问题：几条资料都讲赵州桥，只有一条说到了时间。",
          ),
          choiceTopicGenerator(
            listedChoices(ANSWERS, {
              find: t(
                "Ask what the question wants: a reason, an amount, a time, a place or a way.",
                "看清问题要的是什么：原因、数量、时间、地点，还是方法。",
              ),
              check: (right) =>
                t(
                  `Put the question and “${right}” together: it answers just what was asked.`,
                  `把问题和“${right}”连起来读：正好回答了问的内容。`,
                ),
            }),
            {
              find: t("**Step 1: see what the question asks.**", "**第一步：看清问题问什么。**"),
              choose: t("**Step 2: keep the note that gives it.**", "**第二步：选出正好回答它的资料。**"),
            },
          ),
        ),
      ],
    },
  },
];
