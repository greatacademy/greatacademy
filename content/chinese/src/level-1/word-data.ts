// The words of level 1 (docs/chinese-curriculum.md §8.3): 500 words of daily life in 50 batches of ten, each written
// only with characters taught by its unit, each with a short sentence of those characters to fill.
//
// A line a word: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with ＿＿ for the
// word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`. 一 and 不 keep
// their own tones in the pinyin, as dictionaries write them.

/** WordBatchData is a batch of level 1 words: its theme and its lines. */
export interface WordBatchData {
  readonly theme: readonly [en: string, zh: string];
  readonly data: string;
}

/** wordBatches are the 50 batches of level 1 words, in teaching order. */
export const wordBatches: readonly WordBatchData[] = [
  {
    theme: ["Greetings", "问候"],
    data: `
你好 | nǐ hǎo | hello | 见面时打招呼的话 | ＿＿！你叫什么名字？ | 您好 对不起
您好 | nín hǎo | hello (polite) | 对长辈或客人打招呼的话 | ＿＿！请问您姓什么？ | 你好 对不起
谢谢 | xiè xie | thank you | 表示感激的话 | “＿＿你！”“不客气。”
不客气 | bù kè qi | you're welcome | 回答别人道谢的话 | “谢谢您！”“＿＿。” | 没关系
对不起 | duì bu qǐ | sorry | 向别人道歉的话 | “＿＿！”“没关系。”
没关系 | méi guān xi | it doesn't matter | 回答别人道歉的话 | “对不起！”“＿＿。”
再见 | zài jiàn | goodbye | 分别时说的话 | “谢谢你们，＿＿！”
请问 | qǐng wèn | excuse me, may I ask | 有礼貌地向人提问前说的话 | ＿＿，这是什么？ | 你好 您好 对不起
名字 | míng zi | name | 人的称呼 | 你叫什么＿＿？
叫 | jiào | to be called | 名称是 | 请问你＿＿什么名字？
`,
  },
  {
    theme: ["People and Questions", "人和问题"],
    data: `
我们 | wǒ men | we, us | 说话人和他的同伴 | 我是好人，你也是好人，＿＿都是好人。 | 你们 他们
你们 | nǐ men | you (plural) | 称对面的几个人 | ＿＿都叫什么名字？ | 我们 他们
他们 | tā men | they, them | 称说话双方以外的几个人 | 他是好人，她也是好人，＿＿都是好人。 | 我们 你们
谁 | shéi | who | 问是什么人 | 请问，您是＿＿？ | 什么
什么 | shén me | what | 问是哪样东西 | 这是＿＿？ | 谁 哪里
姓 | xìng | to be surnamed | 说出自己家族的字 | 请问您＿＿什么？
这 | zhè | this | 指近处的人或东西 | ＿＿是我的名字。 | 那
那 | nà | that | 指远处的人或东西 | 这是我的，＿＿是你的。 | 这
人 | rén | person | 会说话、会思考的高级动物 | 他是好＿＿。
哪里 | nǎ li | where | 问什么地方 | 你在＿＿？ | 这 那
`,
  },
  {
    theme: ["Little Words", "常用小词"],
    data: `
是 | shì | to be (am, is, are) | 表示判断 | 她＿＿谁？ | 不 有
不 | bù | not, no | 表示否定 | “这是你的吗？”“＿＿，是他的。” | 没有 是
有 | yǒu | to have; there is | 表示具备或存在 | 你＿＿名字吗？ | 没有
没有 | méi yǒu | not to have; there is not | 表示不具备或不存在 | “这里有人吗？”“＿＿。” | 有 不
在 | zài | to be at, to be in | 表示人或事物的位置 | 他＿＿这里吗？
很 | hěn | very | 表示程度高 | 他＿＿好。 | 也 都 不
也 | yě | also, too | 表示同样 | 你好，我＿＿很好。 | 不 都
都 | dōu | all, both | 表示全部 | 我们＿＿是好人。 | 也 不
吗 | ma | (yes-no question particle) | 用在句末表示疑问 | 这是你的名字＿＿？
的 | de | (possessive particle) | 用在词语和名词之间，表示领属 | 这是我＿＿名字。
`,
  },
  {
    theme: ["How Many", "多少"],
    data: `
多少 | duō shao | how many, how much | 问数量 | 这里有＿＿人？ | 几 两
几 | jǐ | how many (small numbers) | 问十以内的数目 | 你＿＿岁？ | 多少
个 | gè | (general measure word) | 最常用的量词 | 他是一＿＿好人。
岁 | suì | years old | 表示年龄的单位 | 我十＿＿。 | 几 多
两 | liǎng | two (before a measure word) | 数目二，用在量词前面 | 我有＿＿个名字。 | 几
零 | líng | zero | 表示没有数量 | 这是一百＿＿五。
百 | bǎi | hundred | 十个十 | 十个十是一＿＿。
千 | qiān | thousand | 十个一百 | 十个一百是一＿＿。
万 | wàn | ten thousand | 十个一千 | 十个一千是一＿＿。
多 | duō | many, much | 数量大 | 这里人很＿＿，那里人很少。
`,
  },
  {
    theme: ["Counting People", "数一数人"],
    data: `
一起 | yī qǐ | together | 在同一个地方，一同 | 我们三个人＿＿在这里。
不少 | bù shǎo | quite a lot | 数量比较多 | 这里有＿＿人。 | 很多
很多 | hěn duō | many, a lot | 数量很大 | 这里有＿＿人，那里人很少。 | 不少
有名 | yǒu míng | famous | 被很多人知道 | 他是很＿＿的人。
客人 | kè rén | guest | 被请来的人 | 他们是我请的＿＿。 | 人们
人们 | rén men | people | 许多人 | 这里的＿＿都很好。 | 客人 关系
关系 | guān xì | relationship | 人和人之间的联系 | 他们两个人＿＿很好。
哪个 | nǎ ge | which (one) | 问几个中的一个 | ＿＿是你的名字？ | 这个 那个
这个 | zhè ge | this (one) | 指近处的一个 | ＿＿是我的，那个是你的。 | 那个 哪个
那个 | nà ge | that (one) | 指远处的一个 | 这个是我的，＿＿是他的。 | 这个 哪个
`,
  },
  {
    theme: ["Family Members", "家人的称呼"],
    data: `
爸爸 | bà ba | dad | 父亲 | 我＿＿是我爷爷的儿子。
妈妈 | mā ma | mom | 母亲 | 奶奶是我爸爸的＿＿。
哥哥 | gē ge | elder brother | 同父母所生、年纪比自己大的男子 | 我是他弟弟，他是我＿＿。
姐姐 | jiě jie | elder sister | 同父母所生、年纪比自己大的女子 | 我是她妹妹，她是我＿＿。
弟弟 | dì di | younger brother | 同父母所生、年纪比自己小的男子 | 我是他哥哥，他是我＿＿。
妹妹 | mèi mei | younger sister | 同父母所生、年纪比自己小的女子 | 我是她姐姐，她是我＿＿。
爷爷 | yé ye | grandpa (father's father) | 父亲的父亲 | 爸爸的爸爸是我＿＿。
奶奶 | nǎi nai | grandma (father's mother) | 父亲的母亲 | 爸爸的妈妈是我＿＿。
女儿 | nǚ ér | daughter | 父母的女孩子 | 她是我妈妈的＿＿，也是我姐姐。
儿子 | ér zi | son | 父母的男孩子 | 他是我爸爸的＿＿，也是我哥哥。
`,
  },
  {
    theme: ["Family and Home", "家和家人"],
    data: `
家 | jiā | home, family | 亲人一起生活的地方 | 我＿＿有四个人。 | 家人
家人 | jiā rén | family members | 一家里的人 | 爸爸、妈妈、哥哥都是我的＿＿。 | 朋友
孩子 | hái zi | child | 儿童；儿女 | 他们有两个＿＿：一个男孩，一个女孩。 | 家人
男孩 | nán hái | boy | 男性的小孩 | 他是＿＿，她是女孩。
女孩 | nǚ hái | girl | 女性的小孩 | 她是＿＿，他是男孩。
朋友 | péng you | friend | 有交情的人 | 他不是我哥哥，他是我的好＿＿。
爱 | ài | to love | 对人有很深的感情 | 我很＿＿我的家人。
和 | hé | and | 连接两个并列的词 | 我＿＿哥哥都是男孩。
去 | qù | to go | 离开这里到别的地方 | 我们一起＿＿朋友家。 | 来
来 | lái | to come | 从别的地方到这里 | 请你＿＿我家。 | 去 爱
`,
  },
  {
    theme: ["Who's in the Family", "家里有谁"],
    data: `
男人 | nán rén | man | 成年的男子 | 那个＿＿是我爸爸。
女人 | nǚ rén | woman | 成年的女子 | 那个＿＿是我妈妈。
男朋友 | nán péng you | boyfriend | 恋爱中的男方 | 他是我姐姐的＿＿。 | 爱人
女朋友 | nǚ péng you | girlfriend | 恋爱中的女方 | 她是我哥哥的＿＿。 | 爱人
爱人 | ài ren | husband or wife | 丈夫或妻子 | 我爸爸是我妈妈的＿＿。
子女 | zǐ nǚ | sons and daughters | 儿子和女儿 | 他们有三个＿＿：两个儿子，一个女儿。
姐妹 | jiě mèi | sisters | 姐姐和妹妹 | 我和我姐姐是＿＿。
爸妈 | bà mā | mom and dad | 爸爸和妈妈 | 我爱我的＿＿，也爱我的爷爷奶奶。 | 子女
一家人 | yī jiā rén | the whole family | 全家的人 | 爸爸、妈妈和我，我们＿＿都很好。 | 家里
家里 | jiā li | at home, in the family | 家中 | 我＿＿有五个人。
`,
  },
  {
    theme: ["Days", "日子"],
    data: `
今天 | jīn tiān | today | 说话时的这一天 | ＿＿是星期一，明天是星期二。
明天 | míng tiān | tomorrow | 今天的下一天 | 今天是星期一，＿＿是星期二。
昨天 | zuó tiān | yesterday | 今天的前一天 | ＿＿是星期日，今天是星期一。
星期 | xīng qī | week | 七天的时间 | 一个＿＿有七天。
星期一 | xīng qī yī | Monday | 每周的头一天 | 星期日的下一天是＿＿。
星期日 | xīng qī rì | Sunday | 每周的最后一天 | 星期六的下一天是＿＿。
天 | tiān | day | 一昼夜 | 一个星期有七＿＿。 | 日 年
年 | nián | year | 十二个月的时间 | 我今＿＿十岁。
月 | yuè | month | 一年的十二分之一 | 一年有十二个＿＿。
日 | rì | day of the month | 一个月里的某一天 | 今天是五月一＿＿。
`,
  },
  {
    theme: ["Clock Time", "钟点"],
    data: `
点 | diǎn | o'clock | 表示整个钟头的时间单位 | 现在是下午三＿＿。
分 | fēn | minute | 钟点下面的单位，六十个是一小时 | 现在是八点十＿＿。
号 | hào | date (day of the month) | 一个月中的日子 | 今天是几月几＿＿？
现在 | xiàn zài | now | 这个时候 | ＿＿几点了？
时候 | shí hou | time, moment | 时间里的某一点 | 你什么＿＿来？
半 | bàn | half | 二分之一 | 现在是三点＿＿。
早上 | zǎo shang | (early) morning | 天亮以后的一段时间 | ＿＿好！你今天几点起来的？
前天 | qián tiān | the day before yesterday | 昨天的前一天 | 今天是星期三，＿＿是星期一。
后天 | hòu tiān | the day after tomorrow | 明天的后一天 | 今天是星期一，＿＿是星期三。
每天 | měi tiān | every day | 天天 | 我＿＿早上六点起来。 | 前天 后天
`,
  },
  {
    theme: ["Before and After", "前后"],
    data: `
上 | shàng | last; up | 位置在高处的；次序在前的 | ＿＿个月是三月，这个月是四月。
下 | xià | next; down | 位置在低处的；次序在后的 | 这个月是四月，＿＿个月是五月。
上午 | shàng wǔ | morning (before noon) | 中午以前的时间 | 早上九点是＿＿九点。 | 晚上
晚上 | wǎn shang | evening | 太阳落山以后的时间 | ＿＿好！你要去哪里？
过 | guò | (marks past experience) | 表示曾经有这样的事 | 我见＿＿他的妈妈。 | 了
了 | le | (marks completion) | 用在动词后，表示完成 | 我昨天见＿＿他。 | 过
会 | huì | can (know how); will | 懂得怎样做；有可能 | 他明天＿＿来吗？ | 要
要 | yào | to want; to be going to | 希望得到；表示快发生 | 我＿＿去朋友家。 | 会
住 | zhù | to live, to stay | 长时间在某处生活 | 你＿＿在哪里？
周 | zhōu | week | 星期 | 一＿＿有七天。
`,
  },
  {
    theme: ["Months and Years", "年和月"],
    data: `
今年 | jīn nián | this year | 说话时的这一年 | 我＿＿十岁，明年十一岁。
明年 | míng nián | next year | 今年的下一年 | 我今年十岁，＿＿十一岁。
去年 | qù nián | last year | 今年的前一年 | 我今年十岁，＿＿九岁。
每年 | měi nián | every year | 年年 | ＿＿五月，我们都去爷爷家。 | 今年 明年 去年 前年 后年
下午 | xià wǔ | afternoon | 中午以后到晚上的时间 | ＿＿三点，我们在朋友家见。
一月 | yī yuè | January | 一年的头一个月 | 十二月的下一个月是＿＿。
十二月 | shí èr yuè | December | 一年的最后一个月 | 十一月的下一个月是＿＿。
前年 | qián nián | the year before last | 去年的前一年 | 我今年十岁，＿＿八岁。
后年 | hòu nián | the year after next | 明年的后一年 | 我今年十岁，＿＿十二岁。
星期六 | xīng qī liù | Saturday | 每周的第六天 | 星期五的下一天是＿＿。
`,
  },
  {
    theme: ["Eating and Drinking", "吃和喝"],
    data: `
吃 | chī | to eat | 把食物放进嘴里咽下 | 我饿了，我想＿＿米饭。
喝 | hē | to drink | 把水等咽下去 | 我想＿＿一杯热茶。
米饭 | mǐ fàn | cooked rice | 用米做成的饭 | 我不想吃面，我想吃＿＿。 | 鸡蛋
茶 | chá | tea | 用一种树叶泡成的饮料 | 我想喝一杯热＿＿。
鸡蛋 | jī dàn | egg | 母鸡生下的蛋 | 我早上吃了两个＿＿。
饿 | è | hungry | 肚子空了，想吃东西 | 我很＿＿，我想吃饭。
热 | rè | hot | 温度高 | 这杯茶太＿＿了，我现在不喝。
杯子 | bēi zi | cup, glass | 喝水用的器具 | 请给我一个＿＿，我想喝水。
做饭 | zuò fàn | to cook | 把米和菜做成饭菜 | 妈妈在家＿＿，我们晚上一起吃。 | 吃
喜欢 | xǐ huan | to like | 对人或事物有好感 | 我很＿＿喝茶。
`,
  },
  {
    theme: ["Breakfast", "早饭"],
    data: `
早饭 | zǎo fàn | breakfast | 早上吃的饭 | 我每天早上七点吃＿＿。 | 面包 鸡肉
牛奶 | niú nǎi | milk | 母牛的奶 | 早上我喝了一杯＿＿。 | 水
水 | shuǐ | water | 无色无味、可以喝的液体 | 天太热了，我想喝冷＿＿。
面包 | miàn bāo | bread | 用面粉做的、烤熟的食物 | 我早饭吃了一个＿＿。
鸡肉 | jī ròu | chicken (meat) | 鸡身上的肉 | 这个菜是用＿＿做的，不是牛肉。
好吃 | hǎo chī | tasty | 吃起来味道好 | 妈妈做的菜很＿＿。 | 好喝
好喝 | hǎo hē | tasty (of drinks) | 喝起来味道好 | 这杯茶真＿＿！
冷 | lěng | cold | 温度低 | 今天很＿＿，我想喝热茶。
想 | xiǎng | to want to | 希望，打算 | 我＿＿吃面包。
给 | gěi | to give | 使对方得到 | 请＿＿我一杯水。
`,
  },
  {
    theme: ["Meals", "一日三餐"],
    data: `
午饭 | wǔ fàn | lunch | 中午吃的饭 | 吃了早饭，十二点吃＿＿，晚上吃晚饭。 | 菜 鱼 水果
晚饭 | wǎn fàn | dinner | 晚上吃的饭 | 我们晚上七点吃＿＿。 | 菜 鱼 水果
菜 | cài | dish | 做好的一盘食物 | 妈妈做了三个＿＿。
鱼 | yú | fish | 生活在水里的动物 | 这个菜是用＿＿做的，不是用肉做的。 | 水果
水果 | shuǐ guǒ | fruit | 树上结的、可以吃的果实 | 我每天都吃很多＿＿。 | 菜 鱼
酒 | jiǔ | alcohol | 能让人醉的饮料 | 爸爸晚饭的时候喝了一杯＿＿。
太 | tài | too (much) | 过于 | 这个菜＿＿热了，我现在不吃。 | 真
真 | zhēn | really | 确实，的确 | 妈妈做的鱼＿＿好吃！
可以 | kě yǐ | can, may | 表示允许 | 我＿＿喝一杯水吗？
用 | yòng | to use | 拿来做事 | 我们＿＿杯子喝水。
`,
  },
  {
    theme: ["Food Words", "食物"],
    data: `
牛肉 | niú ròu | beef | 牛身上的肉 | 这个菜是用＿＿做的，不是用鸡肉做的。
包子 | bāo zi | steamed stuffed bun | 有馅儿的蒸面食 | 早上我吃了两个＿＿。
饭菜 | fàn cài | food, meal | 饭和菜 | 妈妈做的＿＿真好吃。 | 牛肉 包子 面
热水 | rè shuǐ | hot water | 温度高的水 | 天很冷，请给我一杯＿＿。
吃饭 | chī fàn | to eat (a meal) | 吃一顿饭 | 我饿了，我们去＿＿。
面 | miàn | noodles | 用小麦粉做的细长食物 | 我不想吃米饭，我想吃＿＿。 | 牛肉 包子
做 | zuò | to do, to make | 从事某种活动；制作 | 妈妈在＿＿饭，我们一会儿吃。
杯 | bēi | cup (measure word) | 量词，用于茶、水等 | 我喝了两＿＿水。 | 一点
一点 | yī diǎn | a little | 少量 | 我想喝＿＿热水。
以后 | yǐ hòu | after | 在某个时间之后 | 吃了饭＿＿，我们一起喝茶。
`,
  },
  {
    theme: ["Money", "钱"],
    data: `
钱 | qián | money | 买卖时用的货币 | 我没有＿＿，不能买。
块 | kuài | yuan (spoken) | 口语里说的钱的单位 | 这个包子两＿＿钱。 | 元
元 | yuán | yuan | 人民币的单位 | 这件衣服一百＿＿。
买 | mǎi | to buy | 拿钱换东西 | 我没有新衣服，我想＿＿一件。
卖 | mài | to sell | 拿东西换钱 | 这个商店＿＿水果吗？ | 买
东西 | dōng xi | thing, stuff | 物品 | 我去商店买＿＿。
贵 | guì | expensive | 价钱高 | 这件衣服太＿＿了，我不买。
便宜 | pián yi | cheap | 价钱低 | 这个很＿＿，我们买吧。
多少钱 | duō shao qián | how much (money) | 问价钱 | 这件衣服＿＿？ | 贵 便宜
商店 | shāng diàn | shop | 卖东西的地方 | 我家前面有一个＿＿。
`,
  },
  {
    theme: ["Clothes", "衣服"],
    data: `
衣服 | yī fu | clothes | 穿在身上的东西 | 我想买一件新＿＿。
穿 | chuān | to wear | 把衣服套在身上 | 今天很冷，你要多＿＿一件衣服。
件 | jiàn | (measure word for clothes) | 量词，用于衣服、事情 | 我买了两＿＿衣服。
新 | xīn | new | 刚有的，没用过的 | 这是我的＿＿衣服，昨天买的。 | 白 黑 大 小
大 | dà | big | 面积、体积超过一般 | 这件衣服太＿＿了，我要小一点的。
小 | xiǎo | small | 面积、体积不及一般 | 这件衣服太＿＿了，我要大一点的。
白 | bái | white | 像雪那样的颜色 | 米饭是＿＿的。
黑 | hēi | black | 像墨那样的颜色 | 晚上天＿＿了。
大小 | dà xiǎo | size | 大的程度 | 这件衣服的＿＿很好。
一些 | yī xiē | some | 若干，一点儿 | 我买了＿＿水果。
`,
  },
  {
    theme: ["In the Shop", "在商店"],
    data: `
开 | kāi | to open | 使关着的东西不再关着 | 商店早上九点＿＿，晚上十点关。
能 | néng | can | 有力量或条件做某事 | 我＿＿穿这件衣服吗？ | 还
怎么 | zěn me | how | 问方式或原因 | 这个＿＿卖？
怎么样 | zěn me yàng | how is it | 问情况 | 这件衣服＿＿？
还 | hái | also; still | 另外；仍然 | 我买了一件衣服，＿＿买了两个包。
就 | jiù | then; right away | 马上 | 我们现在＿＿去商店吧。 | 还
吧 | ba | (marks a suggestion) | 句末表示商量或建议 | 我们去商店＿＿！
这些 | zhè xiē | these | 指近处的几个人或东西 | ＿＿衣服都是我的。 | 那些
那些 | nà xiē | those | 指远处的几个人或东西 | 这些是我的，＿＿是你的。
新年 | xīn nián | New Year | 一年开始的时候 | 一月一日是＿＿。
`,
  },
  {
    theme: ["People and Things", "人和事物"],
    data: `
大家 | dà jiā | everybody | 所有的人 | ＿＿好，我是新来的。 | 小朋友 大人
小孩 | xiǎo hái | child | 年纪小的孩子 | 他不是大人，他是＿＿。 | 小朋友
大人 | dà rén | adult | 成年人 | 他是小孩，他爸爸是＿＿。
白天 | bái tiān | daytime | 从天亮到天黑的时间 | ＿＿很热，晚上很冷。
一样 | yī yàng | the same | 没有不同 | 我的衣服和你的衣服＿＿。
多大 | duō dà | how old | 问年龄 | 你今年＿＿？
还是 | hái shi | or (in questions) | 用在问句里表示选择 | 你想喝茶＿＿喝水？
小朋友 | xiǎo péng you | little friend (to a child) | 对儿童的称呼 | ＿＿，你几岁了？
可能 | kě néng | maybe | 也许 | 明天＿＿很冷。 | 白天
开会 | kāi huì | to have a meeting | 很多人一起讨论事情 | 爸爸今天下午要＿＿。
`,
  },
  {
    theme: ["At School", "在学校"],
    data: `
学校 | xué xiào | school | 教学生读书的地方 | 我每天早上七点去＿＿。 | 上课
学生 | xué sheng | student | 在学校读书的人 | 我是＿＿，她是老师。 | 同学
老师 | lǎo shī | teacher | 教学生知识的人 | 她是我们的＿＿，我们是她的学生。
同学 | tóng xué | classmate | 在一个学校学习的人 | 他和我在一个班，是我的＿＿。
书 | shū | book | 装订成册的著作 | 我买了一本＿＿。
本 | běn | (measure word for books) | 量词，用于书 | 我有三＿＿汉语书。
上课 | shàng kè | to have class | 开始讲课或听课 | 我们八点＿＿。 | 下课
下课 | xià kè | class is over | 一节课结束 | ＿＿了，我们去吃午饭吧。
班 | bān | class (group) | 学校里按学生分成的组 | 我们＿＿有三十个学生。 | 学校
学习 | xué xí | to study | 获得知识或技能 | 我在中国＿＿汉语。
`,
  },
  {
    theme: ["Language", "语言"],
    data: `
中国 | zhōng guó | China | 亚洲东部的一个国家 | 我想去＿＿学习汉语。
汉语 | hàn yǔ | Chinese (language) | 汉族的语言 | 他会说一点＿＿。 | 中文
中文 | zhōng wén | Chinese (language and writing) | 中国的语言文字 | 这本书是用＿＿写的。 | 汉语 汉字
汉字 | hàn zì | Chinese character | 记录汉语的文字 | 这个＿＿怎么读？
读 | dú | to read aloud | 看着文字念出声音 | 这个字怎么＿＿？ | 写 说
写 | xiě | to write | 用笔在纸上做出字 | 我在本子上＿＿了我的名字。 | 读
听 | tīng | to listen | 用耳朵接受声音 | 请你＿＿，老师在说话。
说 | shuō | to say | 用话表达意思 | 他＿＿：“我不知道。” | 写 读
说话 | shuō huà | to talk | 用语言表达意思 | 上课的时候不要＿＿。 | 说
中国人 | zhōng guó rén | Chinese person | 中国的人 | 他是＿＿，他家在中国。
`,
  },
  {
    theme: ["Learning", "学习"],
    data: `
知道 | zhī dao | to know | 了解，明白 | 我不＿＿他叫什么名字。
认识 | rèn shi | to know (a person) | 见过面，知道是谁 | 我＿＿他，他是我的同学。 | 知道
考试 | kǎo shì | exam | 用问题测试知识 | 明天我们有汉语＿＿。 | 课 课本
题 | tí | question (in an exercise) | 练习或考试中要回答的地方 | 这道＿＿太难了。 | 问题
难 | nán | difficult | 不容易 | 汉字很＿＿写。
第一 | dì yī | first | 次序在最前的 | 他考试考了＿＿。
课 | kè | lesson | 教学的段落 | 今天我们学第五＿＿。
课本 | kè běn | textbook | 上课用的书 | 这是我的汉语＿＿。
问题 | wèn tí | question | 要求回答的事 | 老师，我有一个＿＿。
老 | lǎo | old | 年纪大 | 我爷爷很＿＿了。
`,
  },
  {
    theme: ["Schools and Books", "学校和书本"],
    data: `
大学 | dà xué | university | 高等学校 | 我哥哥十九岁，在＿＿学习。
中学 | zhōng xué | middle school | 小学以后的学校 | 我十四岁，在＿＿读书。
小学 | xiǎo xué | primary school | 儿童最先上的学校 | 我妹妹七岁，在＿＿读书。
学会 | xué huì | to learn (and master) | 学了以后会了 | 我＿＿了写我的名字。
生日 | shēng rì | birthday | 出生的日子 | 今天是我的＿＿，我十岁了。
本子 | běn zi | notebook | 用来写字的本儿 | 我在＿＿上写字。
书包 | shū bāo | schoolbag | 学生上学用的包 | 我的书和本子都在＿＿里。
写字 | xiě zì | to write characters | 用笔写出文字 | 我用这个本子＿＿。 | 读书
读书 | dú shū | to read; to study | 看书学习；上学 | 他在大学＿＿。
中午 | zhōng wǔ | noon | 白天十二点前后 | 我们＿＿十二点吃午饭。
`,
  },
  {
    theme: ["School Life", "学校生活"],
    data: `
老人 | lǎo rén | old person | 年纪大的人 | 爷爷奶奶都是＿＿了。
国家 | guó jiā | country | 有土地、人民和政府的地方 | 中国是一个很大的＿＿。
认真 | rèn zhēn | conscientious | 做事仔细，不马虎 | 她学习很＿＿，考试考了第一。
开学 | kāi xué | school starts | 学校开始上课 | 九月一日＿＿。 | 上学
上学 | shàng xué | to go to school | 到学校学习 | 我每天早上七点去＿＿。
学期 | xué qī | semester | 学校把一年分成的两段时间 | 这个＿＿有二十个星期。
小时 | xiǎo shí | hour | 六十分钟 | 一天有二十四个＿＿。
文字 | wén zì | writing, script | 记录语言的符号 | 汉字是中国的＿＿。
不同 | bù tóng | different | 不一样 | 这两个汉字很＿＿。
话 | huà | words | 说出来的声音 | 你要听老师的＿＿。
`,
  },
  {
    theme: ["Directions", "方向"],
    data: `
左边 | zuǒ bian | left | 左手那一边 | 我坐在他的＿＿，他坐在我的右边。
右边 | yòu bian | right | 右手那一边 | 他坐在我的＿＿，我坐在他的左边。
前边 | qián bian | front | 面对着的一边 | 我在他后边，他在我＿＿。
后边 | hòu bian | back | 背对着的一边 | 他在我前边，我在他＿＿。
里边 | lǐ bian | inside | 一定范围以内 | 外边很冷，我们去＿＿吧。 | 前边 后边 左边 右边
外边 | wài bian | outside | 一定范围以外 | 里边人太多了，我们去＿＿吧。 | 前边 后边 左边 右边
北京 | běi jīng | Beijing | 中国的首都 | 他从＿＿来。
近 | jìn | near | 距离短 | 我家到学校很＿＿，走一会儿就到了。
远 | yuǎn | far | 距离长 | 我家到学校很＿＿，要走一个小时。
呢 | ne | (asks back: and …?) | 用在问句末尾，表示追问 | 我很好，你＿＿？
`,
  },
  {
    theme: ["Places in Town", "城里的地方"],
    data: `
门 | mén | door | 房子的出入口 | 请开＿＿。 | 大门
房间 | fáng jiān | room | 房子里隔开的部分 | 家里有三个＿＿。 | 门 大门
公园 | gōng yuán | park | 大家游玩的地方 | 星期天我们去＿＿走走。 | 饭店
医院 | yī yuàn | hospital | 治病的地方 | 我妈妈是医生，每天去＿＿上班。
医生 | yī shēng | doctor | 给人治病的人 | 他去医院找＿＿。
路 | lù | road | 人或车走的地方 | 从我家到学校的＿＿很近。
楼 | lóu | floor; building | 两层以上的房子 | 我家住在三＿＿。
大门 | dà mén | main gate | 外边的大的门 | 我在学校＿＿等你。 | 东边
饭店 | fàn diàn | restaurant | 吃饭的地方 | 我们晚上去＿＿吃饭吧。
东边 | dōng bian | east | 东的那一边 | 学校在公园的＿＿。
`,
  },
  {
    theme: ["Going Places", "去哪里"],
    data: `
走 | zǒu | to walk | 一步一步向前移动 | 我们＿＿路去学校。
到 | dào | to arrive | 抵达某个地方 | 我们八点＿＿学校。 | 回
从 | cóng | from | 表示起点 | 我＿＿北京来。 | 到 回
回 | huí | to go back | 由别处到原来的地方 | 下课了，我要＿＿家。
出 | chū | out | 从里面到外面 | 他从房间里走＿＿来。 | 进
进 | jìn | to enter | 从外面到里面 | 请＿＿，请坐。
找 | zhǎo | to look for | 为了得到而寻求 | 我在＿＿我的书包。 | 等
往 | wǎng | towards | 向，朝 | 你＿＿前走，就到了。
坐 | zuò | to sit | 把身体放在椅子等上面 | 请进，请＿＿。
等 | děng | to wait | 期待人或事物出现 | 我在大门那里＿＿你。
`,
  },
  {
    theme: ["Coming and Going", "来来去去"],
    data: `
回家 | huí jiā | to go home | 回到自己家里 | 下课了，我们＿＿吧。 | 出去 回来
出去 | chū qù | to go out | 从里面到外面去 | 外边天很好，我们＿＿走走吧。
进来 | jìn lái | to come in | 从外面到里面来 | 外边冷，请＿＿坐。
回来 | huí lái | to come back | 回到原来的地方 | 爸爸去北京了，明天＿＿。
这里 | zhè li | here | 这个地方 | “你家在哪里？”“我家就在＿＿。” | 那里
那里 | nà li | there | 那个地方 | 我在这里，他在＿＿。
方便 | fāng biàn | convenient | 做事容易 | 从我家去学校很＿＿，走一会儿就到了。
楼上 | lóu shàng | upstairs | 上边的楼层 | 我家在楼下，他家在＿＿。
楼下 | lóu xià | downstairs | 下边的楼层 | 他家在楼上，我家在＿＿。
西边 | xī bian | west | 西的那一边 | 学校在公园的东边，我家在公园的＿＿。
`,
  },
  {
    theme: ["Around Town", "在城里走走"],
    data: `
走路 | zǒu lù | to walk | 用脚走 | 我家很近，我每天＿＿去学校。
进去 | jìn qù | to go in | 从外面到里面去 | 门开了，我们＿＿吧。 | 坐下
过来 | guò lái | to come over | 从别处到这里来 | 你＿＿，坐在我这里。
南方 | nán fāng | the south | 南边的地方 | 北京在中国的北方，不在＿＿。
北方 | běi fāng | the north | 北边的地方 | 北京在中国的＿＿。 | 南方
路上 | lù shang | on the way | 去某地的途中 | 我在回家的＿＿找到了一个书包。
等等 | děng deng | wait a moment | 等一下 | ＿＿我，我也去！
找到 | zhǎo dào | to find | 找了以后得到 | 我在房间里＿＿了我的书。
坐下 | zuò xià | to sit down | 坐到座位上 | 请＿＿，我们要上课了。
房子 | fáng zi | house | 住人的建筑 | 我家的＿＿很大，有三个房间。
`,
  },
  {
    theme: ["Abroad", "国外"],
    data: `
外语 | wài yǔ | foreign language | 外国的语言 | 我在学校学习＿＿。
外国 | wài guó | foreign country | 本国以外的国家 | 我想去＿＿学习。 | 国外 外面
外国人 | wài guó rén | foreigner | 外国的人 | 他是＿＿，他不是中国人。
国外 | guó wài | abroad | 本国以外 | 他在＿＿住了两年。 | 外面
校园 | xiào yuán | campus | 学校里的地方 | 我们的＿＿很大，有很多楼。 | 院子
院子 | yuàn zi | courtyard | 房子前后用墙围起来的地方 | 奶奶家的＿＿里有一个小门。
回国 | huí guó | to return to one's country | 回到自己的国家 | 他在中国学习了两年，明年要＿＿了。 | 出国
出国 | chū guó | to go abroad | 到外国去 | 我想＿＿学习外语。
从前 | cóng qián | in the past | 过去的时候 | ＿＿这里没有路，现在有了。
外面 | wài mian | outside | 外边 | ＿＿很冷，我们在房间里吧。
`,
  },
  {
    theme: ["Vehicles", "交通工具"],
    data: `
飞机 | fēi jī | plane | 在天上飞的交通工具 | ＿＿在天上飞。
船 | chuán | boat | 水上的交通工具 | ＿＿在水上走。
火车 | huǒ chē | train | 在铁路上走的车 | ＿＿在铁路上走。 | 地铁
坐车 | zuò chē | to take a bus or car | 坐在车里去别的地方 | 我们＿＿去公园吧。 | 开车
地铁 | dì tiě | subway | 在地下走的火车 | ＿＿在地下走。
机场 | jī chǎng | airport | 飞机起飞和下来的地方 | 我们去＿＿坐飞机。
火车站 | huǒ chē zhàn | railway station | 火车停下的地方 | 我们去＿＿坐火车。 | 车站
票 | piào | ticket | 坐车或进场的凭证 | 坐火车要先买＿＿。
开车 | kāi chē | to drive | 驾驶汽车 | 我爸爸会＿＿。
车站 | chē zhàn | stop, station | 车停下让人上下的地方 | 我在＿＿等车。 | 机场
`,
  },
  {
    theme: ["Travel", "出行"],
    data: `
快 | kuài | fast | 速度高 | 飞机很＿＿，火车很慢。
慢 | màn | slow | 速度低 | 火车很＿＿，飞机很快。
次 | cì | time(s) | 动作的回数 | 我去过北京两＿＿。
送 | sòng | to see off | 陪着离开的人走一段路 | 我去机场＿＿朋友。 | 带
带 | dài | to take, to bring | 随身拿着 | 我们去公园，你＿＿水了吗？
跟 | gēn | with | 和，同 | 我＿＿妈妈一起去北京。 | 让
别 | bié | don't | 不要 | ＿＿走，等等我！ | 慢
让 | ràng | to let | 允许，使 | 妈妈不＿＿我一个人去。
先 | xiān | first | 时间在前 | 我们＿＿吃饭，再去公园。
铁路 | tiě lù | railway | 火车走的路 | 北京到这里有＿＿，我们可以坐火车去。
`,
  },
  {
    theme: ["On the Way", "在路上"],
    data: `
地方 | dì fang | place | 某一个区域 | 北京是一个很好的＿＿。
上车 | shàng chē | to get on | 到车上去 | 车来了，我们快＿＿吧。 | 下车 出门
下车 | xià chē | to get off | 从车上下来 | 到站了，我们＿＿吧。 | 出门
慢走 | màn zǒu | take care (to a parting guest) | 送客人时说的话 | 谢谢你来我家，＿＿！
飞 | fēi | to fly | 在空中移动 | 天上有一个东西在＿＿。
先生 | xiān sheng | sir; Mr. | 对男子的称呼 | ＿＿，请问您要去哪里？ | 别人
别人 | bié ren | other people | 自己以外的人 | 这本书是＿＿的，不是我的。
机票 | jī piào | plane ticket | 坐飞机用的票 | 我买了去北京的＿＿，明天坐飞机去。 | 车票
车票 | chē piào | bus or train ticket | 坐车用的票 | 坐火车要买＿＿。
出门 | chū mén | to go out | 到外边去 | 我早上七点＿＿去学校。
`,
  },
  {
    theme: ["Times and Trips", "次数和行程"],
    data: `
第一次 | dì yī cì | the first time | 头一回 | 这是我＿＿来北京。 | 上次 下次
下次 | xià cì | next time | 下一回 | 这次没有时间，＿＿再去吧。 | 上次
上次 | shàng cì | last time | 上一回 | ＿＿我们去了公园，这次去哪里？
慢慢 | màn màn | slowly | 很慢地 | 路上车多，请＿＿开。
地上 | dì shang | on the ground | 地面上 | 你的书在＿＿。 | 地下
送给 | sòng gěi | to give (as a present) | 把东西给别人 | 这本书是我＿＿你的。
快要 | kuài yào | about to | 很快就要 | 火车＿＿开了，我们快上车吧。
带来 | dài lái | to bring | 拿来 | 你＿＿了什么好吃的？
地下 | dì xià | underground | 地面以下 | 地铁在＿＿走。
有事 | yǒu shì | to have something to do | 有要做的事情 | 我今天＿＿，不能去机场送你了。
`,
  },
  {
    theme: ["Weather", "天气"],
    data: `
天气 | tiān qì | weather | 阴晴冷热等情况 | 今天＿＿很好，我们去公园吧。
下雨 | xià yǔ | to rain | 雨从天上落下来 | ＿＿了，别出去了。 | 下雪
下雪 | xià xuě | to snow | 雪从天上落下来 | 冬天＿＿了，地上都是白的。
雨 | yǔ | rain | 从云里落下的水 | 今天的＿＿很大，你别出去。 | 风
雪 | xuě | snow | 冬天从天上落下的白色冰花 | ＿＿是白的。
风 | fēng | wind | 流动的空气 | 外边＿＿很大，你多穿一件衣服。
晴 | qíng | sunny | 天空没有云或云很少 | 今天天气很好，是＿＿天。
阴天 | yīn tiān | cloudy day | 天空有云的天气 | 今天不是晴天，是＿＿。 | 春天
比 | bǐ | than | 用来对照两样东西 | 今天＿＿昨天冷。
春天 | chūn tiān | spring | 一年的第一个季节 | 冬天过去了，＿＿来了。
`,
  },
  {
    theme: ["Seasons", "四季"],
    data: `
夏天 | xià tiān | summer | 一年里很热的季节 | ＿＿天气很热，我想喝冷水。
秋天 | qiū tiān | autumn | 夏天以后的季节 | 夏天过去了，＿＿来了。
冬天 | dōng tiān | winter | 一年里很冷的季节 | ＿＿很冷，北京会下雪。 | 晴天 雨天
晴天 | qíng tiān | sunny day | 没有云的天气 | 今天是＿＿，没有雨。
大风 | dà fēng | strong wind | 很大的风 | 今天有＿＿，你别出去了。 | 小雨
雨天 | yǔ tiān | rainy day | 下雨的日子 | ＿＿出门，你要带雨衣。
雪人 | xuě rén | snowman | 用雪做的人 | 下雪了，我们去外边做＿＿吧。
小雨 | xiǎo yǔ | light rain | 不大的雨 | 外边下＿＿了，雨不大。
天上 | tiān shang | in the sky | 天空中 | 飞机在＿＿飞。
下来 | xià lái | to come down | 从高处到低处来 | 你从楼上＿＿吧。
`,
  },
  {
    theme: ["Rain and Snow", "雨和雪"],
    data: `
大雪 | dà xuě | heavy snow | 很大的雪 | 昨天下了一场＿＿，地上都是白的。
大雨 | dà yǔ | heavy rain | 很大的雨 | 昨天下了一场＿＿，路上都是水。
雨衣 | yǔ yī | raincoat | 下雨时穿的衣服 | 下雨了，你要穿＿＿。
冷水 | lěng shuǐ | cold water | 温度低的水 | 天太热了，我想喝一杯＿＿。
天天 | tiān tiān | every day | 每天 | 他＿＿早上都喝一杯牛奶。
很少 | hěn shǎo | seldom | 不常 | 北京的春天＿＿下雨。 | 不太
不太 | bù tài | not very | 程度不高 | 今天＿＿冷，你不用多穿衣服。
好多 | hǎo duō | a lot of | 很多 | 公园里有＿＿人。
雪白 | xuě bái | snow-white | 像雪那样白 | 他的衣服是＿＿的。 | 红
红 | hóng | red | 像血那样的颜色 | 中国新年的时候，很多东西都是＿＿的。
`,
  },
  {
    theme: ["Free Time", "空闲时间"],
    data: `
玩 | wán | to play, to have fun | 做游戏 | 我们明年去北京＿＿。 | 休息 唱歌 打球 睡觉
看 | kàn | to look at, to watch | 使视线接触人或物 | 我喜欢＿＿书。
电视 | diàn shì | television | 用来看节目的电器 | 晚上我在家看＿＿。 | 电影
电影 | diàn yǐng | film | 在大屏幕上看的故事片 | 我想去看一个新＿＿。
唱歌 | chàng gē | to sing | 按照曲调唱 | 她很喜欢＿＿，她唱得很好。 | 打球
打球 | dǎ qiú | to play ball | 用手或器具玩球 | 我和同学去球场＿＿。
跑 | pǎo | to run | 两只脚很快地向前 | 他＿＿得很快。
休息 | xiū xi | to rest | 停下工作 | 工作了一天，我想＿＿一下。 | 睡觉
睡觉 | shuì jiào | to sleep | 进入睡眠 | 晚上十点，我要＿＿了。
有意思 | yǒu yì si | interesting | 能引起兴趣 | 这个电影很＿＿。
`,
  },
  {
    theme: ["Work and Busy", "工作和忙"],
    data: `
工作 | gōng zuò | job; to work | 为了生活做的事 | 我爸爸在医院＿＿。
忙 | máng | busy | 事情多，没有空 | 我今天很＿＿，没有时间玩。
意思 | yì si | meaning | 语言文字的含义 | 这个字是什么＿＿？
事 | shì | matter, thing | 人做的或遇到的情况 | 我今天有＿＿，不能来了。
觉得 | jué de | to think, to feel | 认为，感到 | 我＿＿这个电影很有意思。
看见 | kàn jiàn | to see | 看到 | 我在路上＿＿了我的老师。 | 听见
听见 | tīng jiàn | to hear | 听到 | 你＿＿了吗？外边有人叫你。
打电话 | dǎ diàn huà | to make a phone call | 用电话跟别人说话 | 我给妈妈＿＿。 | 电话
电话 | diàn huà | telephone | 能把声音传到远处的机器 | 你的＿＿号是多少？
工人 | gōng rén | worker | 做工的人 | 他是＿＿，每天工作八个小时。
`,
  },
  {
    theme: ["Watching and Listening", "看和听"],
    data: `
看书 | kàn shū | to read books | 阅读书本 | 我喜欢在家＿＿，不喜欢看电视。 | 唱
电影院 | diàn yǐng yuàn | cinema | 看电影的地方 | 我们去＿＿看电影。
歌 | gē | song | 可以唱的曲子 | 这个＿＿很好听。
好听 | hǎo tīng | pleasant to hear | 听起来舒服 | 她唱歌很＿＿。 | 好看
好看 | hǎo kàn | good-looking | 看起来美 | 这件衣服很＿＿。 | 好玩
好玩 | hǎo wán | fun | 有意思，能让人高兴 | 这个公园很＿＿。
打开 | dǎ kāi | to open | 使关着的东西开 | 请＿＿门。
球 | qiú | ball | 圆形的、能滚动的东西 | 你带＿＿了吗？我们去打一会儿。
唱 | chàng | to sing | 按照曲调发出声音 | 她＿＿得很好。
有时候 | yǒu shí hou | sometimes | 有的时候 | 星期天我＿＿去公园，有的时候在家。
`,
  },
  {
    theme: ["More Free Time", "更多空闲时间"],
    data: `
看看 | kàn kan | to have a look | 看一下 | 我可以＿＿你的书吗？ | 打
午睡 | wǔ shuì | afternoon nap | 吃午饭后睡一会儿 | 吃了午饭，我要＿＿一个小时。 | 下班
打 | dǎ | to hit; to play | 用手或东西撞击 | 我们去＿＿球吧。
晚会 | wǎn huì | evening party | 晚上的聚会 | 今天晚上学校有新年＿＿。
意见 | yì jiàn | opinion | 对事情的看法 | 我想听听你的＿＿。 | 作文
得 | de | (links a verb to how it is done) | 用在动词后，表示程度或结果 | 他跑＿＿很快。
球场 | qiú chǎng | court, field | 打球的地方 | 我们在＿＿打球。
作文 | zuò wén | composition | 写出来的文章 | 今天的＿＿是写我的家。
下班 | xià bān | to get off work | 工作时间结束 | 爸爸每天五点＿＿。
小说 | xiǎo shuō | novel | 用故事写人和事的书 | 这本＿＿很有意思。
`,
  },
  {
    theme: ["Talking and Doing", "说和做"],
    data: `
听说 | tīng shuō | to hear (that) | 听别人说 | 我＿＿你要去北京了。
别的 | bié de | other | 另外的 | 这个不好，你有＿＿吗？ | 时间
有用 | yǒu yòng | useful | 能起作用 | 这本书很＿＿。
没事 | méi shì | it's nothing | 没有关系 | “对不起！”“＿＿。”
不用 | bù yòng | no need | 用不着 | 明天＿＿上课，我们去玩吧。
回去 | huí qù | to go back | 回到原来的地方去 | 太晚了，我要＿＿了。 | 起来 上去
起来 | qǐ lái | to get up | 由躺、坐而站 | 早上七点了，你快＿＿！ | 上去
上去 | shàng qù | to go up | 从低处到高处去 | 他在楼上，我们＿＿吧。
一下 | yī xià | (briefly, once) | 表示做一次或时间短 | 请等＿＿。
时间 | shí jiān | time | 时光 | 我今天很忙，没有＿＿。
`,
  },
  {
    theme: ["Linking Words", "连接的词"],
    data: `
那么 | nà me | then, in that case | 那样 | 你不想去，＿＿我一个人去吧。 | 这样 这么
这么 | zhè me | so, such | 这样地 | 今天怎么＿＿冷？ | 这样
还有 | hái yǒu | also, and | 另外 | 我买了水果，＿＿面包。
就是 | jiù shì | exactly, just | 正是 | 他＿＿我的老师。 | 不是
可是 | kě shì | but | 但是 | 这件衣服很好看，＿＿太贵了。
要是 | yào shi | if | 如果 | ＿＿明天下雨，我们就不去公园了。
有的 | yǒu de | some | 一部分 | 这些书，＿＿是我的，还有一些是他的。
打车 | dǎ chē | to take a taxi | 坐出租车 | 太晚了，我们＿＿回家吧。
这样 | zhè yàng | like this | 这个样子 | 这个字要＿＿写。
不是 | bù shì | no, it isn't | 否定的回答 | “你是老师吗？”“＿＿，我是学生。”
`,
  },
  {
    theme: ["Hobbies", "爱好"],
    data: `
爱好 | ài hào | hobby | 喜欢做的事 | 我的＿＿是唱歌。
电视机 | diàn shì jī | TV set | 看电视用的机器 | 我家的＿＿是新买的。 | 电影票
作家 | zuò jiā | writer | 写书的人 | 他写了很多小说，是一个有名的＿＿。
打工 | dǎ gōng | to work part-time | 做临时的工作 | 他是学生，晚上去饭店＿＿。
打字 | dǎ zì | to type | 用机器写字 | 我＿＿很快。
大事 | dà shì | important matter | 重要的事 | 考大学是一件＿＿。 | 好事
电影票 | diàn yǐng piào | film ticket | 看电影用的票 | 我们看电影要先买＿＿。
好事 | hǎo shì | good thing | 好的事情 | 他考上了大学，这真是一件＿＿。
书店 | shū diàn | bookshop | 卖书的商店 | 我去＿＿买了一本小说。
不好意思 | bù hǎo yì si | sorry (embarrassed) | 让人觉得难为情 | ＿＿，我来晚了。
`,
  },
  {
    theme: ["The Body", "身体"],
    data: `
手 | shǒu | hand | 人拿东西用的身体部分 | 我们用＿＿写字。 | 左手
脚 | jiǎo | foot | 人走路用的身体部分 | 我们用＿＿走路。
眼 | yǎn | eye | 人看东西用的器官 | 我们用＿＿看东西。
头 | tóu | head | 身体最上面的部分 | 他点了点＿＿，说：“好的。”
身体 | shēn tǐ | body; health | 人或动物的全身 | 爷爷的＿＿很好，每天都走路。
心里 | xīn li | in one's heart | 思想、感情的里面 | 我＿＿很想我的家人。
高 | gāo | tall | 从下到上距离大 | 我哥哥很＿＿，有一米八。
长 | cháng | long | 两端距离大 | 从这里到学校的路很＿＿，要走一个小时。
个子 | gè zi | height (of a person) | 人身体的高矮 | 我哥哥的＿＿很高。
左手 | zuǒ shǒu | left hand | 左边的手 | 他用＿＿写字，不用右手。
`,
  },
  {
    theme: ["Health", "健康"],
    data: `
病 | bìng | illness; ill | 身体不健康的情况 | 他＿＿了，今天没来上课。 | 生病 累
生病 | shēng bìng | to fall ill | 得了病 | 天冷了，多穿衣服，别＿＿了。 | 累
看病 | kàn bìng | to see a doctor | 请医生治病 | 我要去医院＿＿。 | 吃药
药 | yào | medicine | 用来治病的东西 | 医生给了我一些＿＿。
吃药 | chī yào | to take medicine | 把药吃下去 | 你病了，要多喝水，还要＿＿。
病人 | bìng rén | patient | 生病的人 | 医院里有很多＿＿。
疼 | téng | to hurt | 有病或受伤时难受的感觉 | 我的头很＿＿。
头疼 | tóu téng | headache | 头里面疼 | 我＿＿，想休息一下。 | 累
累 | lèi | tired | 身体或心里感到很疲劳 | 工作了一天，我很＿＿。
药店 | yào diàn | pharmacy | 卖药的商店 | 我去＿＿买药。
`,
  },
  {
    theme: ["Taking Care", "照顾自己"],
    data: `
洗 | xǐ | to wash | 用水去掉脏东西 | 吃饭前要＿＿手。
洗手 | xǐ shǒu | to wash one's hands | 用水把手弄干净 | 吃饭前，我们要先＿＿。
洗手间 | xǐ shǒu jiān | toilet | 厕所 | 我想洗手，请问＿＿在哪里？
帮 | bāng | to help | 替别人做事 | 你能＿＿我一下吗？ | 帮忙
帮忙 | bāng máng | to help out | 帮助别人做事 | 我很忙，你能来＿＿吗？
小心 | xiǎo xīn | careful | 注意，留神 | 路上车多，你要＿＿。
关心 | guān xīn | to care about | 把人或事放在心上 | 妈妈很＿＿我的身体。
开心 | kāi xīn | happy | 心里高兴 | 今天是我的生日，我很＿＿。
身上 | shēn shang | on one's body | 身体上 | 我＿＿没有钱了。
手机 | shǒu jī | mobile phone | 能带在身上的电话 | 我的＿＿在书包里。
`,
  },
  {
    theme: ["Reasons", "原因"],
    data: `
因为 | yīn wèi | because | 说明原因 | ＿＿下雨，我们没去公园。
所以 | suǒ yǐ | so | 说明结果 | 今天下雨，＿＿我们没去公园。
为什么 | wèi shén me | why | 问原因 | 你＿＿不来上课？
为了 | wèi le | in order to | 表示目的 | ＿＿学好汉语，他每天都看中文书。
认为 | rèn wéi | to believe | 对人或事有看法 | 我＿＿他说得对。 | 以为
以为 | yǐ wéi | to think (wrongly) | 原来这样想，后来发现不对 | 我＿＿今天是星期一，没想到是星期二。
最 | zuì | most | 表示程度到了顶点 | 他是我们班个子＿＿高的人。
最后 | zuì hòu | last, finally | 在所有的后面 | 他第一个来，我＿＿一个来。
最近 | zuì jìn | recently | 不久以前 | 你＿＿忙吗？
最好 | zuì hǎo | had better | 表示建议 | 你病了，＿＿在家休息。
`,
  },
  {
    theme: ["Growing Up", "长大"],
    data: `
长大 | zhǎng dà | to grow up | 从小变大 | 我＿＿以后想做医生。
身高 | shēn gāo | height | 身体的高度 | 我的＿＿是一米六。
右手 | yòu shǒu | right hand | 右边的手 | 我用＿＿写字。
中心 | zhōng xīn | centre | 正中间的地方 | 这个商店在北京的＿＿。
好心 | hǎo xīn | kind-hearted | 心地好 | 他是＿＿人，大家都喜欢他。 | 热心
用心 | yòng xīn | attentive | 认真，下功夫 | 他学习很＿＿，考试考了第一。
头上 | tóu shang | on the head | 头的上面 | 他＿＿有一点雪。 | 手上
热心 | rè xīn | warm-hearted | 对人很热情 | 她很＿＿，大家有事她都帮忙。
高大 | gāo dà | tall and big | 又高又大 | 爸爸的个子很＿＿。
手上 | shǒu shang | in one's hand(s) | 手的上面 | 他＿＿都是水，要先洗一下。
`,
  },
];
