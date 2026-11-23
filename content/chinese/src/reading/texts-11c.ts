// The texts of the selective required reading topics of works on science and culture and of classical poems
// (docs/chinese-curriculum.md §18.9). The works on science and culture are short pieces written for this subject on
// how science reasons and on the things of Chinese culture; the poems are Tang and Song poems in the public domain,
// none of them a passage of the national textbooks or of the recited texts. The notes and the questions are written
// for this subject. The format is that of parsePieces in topic-kit.ts.

/** TREATISES_11 are the pieces of reading-11-treatises: the concepts and facts of works on science and culture, and how they reason. */
export const TREATISES_11 = `
# 假说是怎样被检验的
科学家遇到一个解释不了的现象，常常先提出一个假说：一种可能的解释。假说不是随便的猜测，它必须能推出一些可以观察的结果。比如，有人提出“某种疾病是由饮用水传播的”，那么就可以推出：喝同一处水的人，得病的应该更多；换了水源，得病的人应该减少。
接下来就是检验。如果观察到的结果和推出的不一样，假说就要修改或者放弃。如果一样，假说就得到了支持，但这并不等于被证明了：也许还有别的解释，也许下一次观察就会出现例外。所以，科学家说一个假说“得到了大量证据的支持”，而很少说它“绝对正确”。
一个怎样都不会出错的说法，反而不是科学的假说。比如“明天可能下雨，也可能不下雨”，无论天气怎样，它都对，可它什么也没有告诉我们。科学假说的价值，恰恰在于它冒着被推翻的风险。
?1 文中所说的“假说”是什么？ | What is a hypothesis, as the text says?
= 对一个现象的可能的解释，而且必须能推出可以观察的结果 | 常常先提出一个假说：一种可能的解释
- 一种随便的猜测 ~opposite @假说不是随便的猜测
- 已经被证明正确的结论 ~opposite @但这并不等于被证明了
?1 如果观察到的结果和假说推出的一样，说明了什么？ | If what is seen matches what was inferred, what follows?
≈ 假说得到了支持，但还不能说被证明了 | 假说就得到了支持 | 但这并不等于被证明了
- 假说已经绝对正确 ~opposite @而很少说它“绝对正确”
- 假说应该放弃 ~opposite
?1 为什么“明天可能下雨，也可能不下雨”不是科学的假说？ | Why is “it may rain tomorrow, or not” no hypothesis?
≈ 它怎样都不会出错，因此不冒被推翻的风险，什么也没有告诉我们 | 无论天气怎样，它都对，可它什么也没有告诉我们 | 一个怎样都不会出错的说法，反而不是科学的假说
- 因为天气是无法预测的 ~unsaid
- 因为它说错了 ~opposite @无论天气怎样，它都对
?2 文中举“饮用水传播疾病”的例子，作用是什么？ | What does the example of the water do?
≈ 具体说明假说怎样推出可以观察的结果，使抽象的道理容易理解 | 某种疾病是由饮用水传播的 | 它必须能推出一些可以观察的结果
- 说明这种疾病确实是由水传播的 ~misread @那么就可以推出
- 提醒人们不要喝生水 ~offpoint
?2 文章的思路是怎样的？ | How does the text proceed?
≈ 先说什么是假说，再说怎样检验它，最后从反面说明什么不是科学的假说 | 常常先提出一个假说 | 接下来就是检验 | 一个怎样都不会出错的说法，反而不是科学的假说
- 先举例子，再下定义，最后提出问题 ~wrongorder
- 按时间顺序讲了一位科学家的一生 ~unsaid
?2 最后一句“科学假说的价值，恰恰在于它冒着被推翻的风险”，在全文中起什么作用？ | What does the last sentence do?
≈ 用看似矛盾的说法总结全文，点明科学假说的根本特点 | 科学假说的价值，恰恰在于它冒着被推翻的风险 | 一个怎样都不会出错的说法
- 说明科学假说都会被推翻 ~broad
- 提出一个新的话题 ~role

# 一起变化，不一定有因果
统计发现，某地夏天冰淇淋卖得越多，溺水的人也越多。能不能说，吃冰淇淋会让人溺水？显然不能。天热了，买冰淇淋的人多，去游泳的人也多，溺水的事自然多起来。冰淇淋和溺水一起变化，是因为它们背后有一个共同的原因：天气炎热。
两件事一起变化，叫做“相关”；一件事引起另一件事，叫做“因果”。相关是因果的必要条件，却不是充分条件：有因果的，一定相关；相关的，却不一定有因果。把相关当成因果，是日常推理中最常见的错误之一。
怎样才能判断因果？最可靠的办法是做对照实验：把条件相同的对象分成两组，只让一组接受某种影响，比较两组的结果。如果只有这一点不同，结果却不同了，才能比较有把握地说，是这种影响造成的。做不了实验的时候，就要尽量找出可能的共同原因，一个一个排除。
?1 文中“相关”和“因果”的区别是什么？ | How do correlation and cause differ, as the text says?
≈ 相关是两件事一起变化，因果是一件事引起另一件事；有因果一定相关，相关不一定有因果 | 两件事一起变化，叫做“相关” | 一件事引起另一件事，叫做“因果” | 相关的，却不一定有因果
- 相关和因果是一回事 ~opposite @相关的，却不一定有因果
- 有因果的不一定相关 ~opposite @有因果的，一定相关
?1 冰淇淋和溺水为什么会一起变多？ | Why do ice cream and drownings rise together?
= 因为它们有一个共同的原因：天气炎热 | 它们背后有一个共同的原因：天气炎热
- 因为吃了冰淇淋的人容易溺水 ~opposite @显然不能
- 因为卖冰淇淋的人都在水边 ~unsaid
?1 文中认为判断因果最可靠的办法是什么？ | What is the surest way to find a cause?
= 做对照实验 | 最可靠的办法是做对照实验
- 收集更多的统计数字 ~unsaid
- 问问有经验的人 ~unsaid
?2 文章开头用冰淇淋和溺水的例子，好处是什么？ | Why open with ice cream and drownings?
≈ 用一个一看就荒谬的结论引起思考，再引出相关和因果的区别 | 能不能说，吃冰淇淋会让人溺水？显然不能 | 两件事一起变化，叫做“相关”
- 说明夏天不应该吃冰淇淋 ~offpoint
- 说明游泳很危险 ~offpoint
?2 “相关是因果的必要条件，却不是充分条件”这句话怎样理解？ | How is this sentence to be read?
≈ 没有相关就谈不上因果，但光有相关还不够，不能据此断定因果 | 有因果的，一定相关；相关的，却不一定有因果
% 作者紧接着用两句话解释了这句话：“有因果的，一定相关”，所以没有相关就没有因果，这是“必要”；“相关的，却不一定有因果”，所以光有相关不够，这是“不充分”。冰淇淋和溺水正是相关而没有因果的例子。 | The writer glosses it at once: where there is cause there is correlation, so without correlation no cause, “necessary”; but correlation need not mean cause, so it is not enough, “not sufficient”. Ice cream and drowning are the case.
- 只要相关，就一定有因果 ~opposite @相关的，却不一定有因果
- 相关和因果没有任何关系 ~opposite @有因果的，一定相关
?2 文中介绍对照实验时，为什么强调“只有这一点不同”？ | Why insist that only one thing differs?
≈ 排除其他原因，才能把结果的不同归到这一种影响上 | 如果只有这一点不同，结果却不同了 | 就要尽量找出可能的共同原因，一个一个排除
- 因为实验越简单越好 ~unsaid
- 因为两组对象本来就不同 ~opposite @把条件相同的对象分成两组

# 汉字为什么能流传三千年
从商代的甲骨文算起，汉字已经用了三千多年。世界上许多古老的文字，像古埃及的圣书字、两河流域的楔形文字，早已没有人使用，汉字却一直沿用到今天。这是为什么？
一个重要的原因是，汉字主要记录的是意义，而不只是声音。各地的方言读音差别很大，一个广东人和一个山东人说话可能互相听不懂，写出来的字却能看懂。字音变了，字形和字义大体还在，所以今天的人还能读懂两千年前的文章。汉字因此成了维系一个广大国家的纽带。
当然，汉字也有难学的一面：字数多，笔画繁，一个字往往要分别记住形、音、义。历史上曾经有人主张废除汉字，改用拼音文字。后来，人们一方面简化了一部分汉字，一方面推行拼音作为识字的工具，让汉字在保持优点的同时，变得更容易学。
注：甲骨文，商代刻在龟甲和兽骨上的文字。楔形文字，古代两河流域用尖笔在泥板上刻写的文字。
?1 文中认为汉字能长期流传的一个重要原因是什么？ | What, says the text, is one main reason for its long life?
= 汉字主要记录的是意义，而不只是声音 | 汉字主要记录的是意义，而不只是声音
- 汉字的笔画很简单 ~opposite @字数多，笔画繁
- 古代的中国人都说同一种方言 ~opposite @各地的方言读音差别很大
?1 文中说汉字是“维系一个广大国家的纽带”，原因是什么？ | Why is it called a bond holding a great country together?
≈ 各地方言不同，说话听不懂，写出来的字却都能看懂 | 写出来的字却能看懂 | 汉字因此成了维系一个广大国家的纽带
- 汉字是用绳子编出来的 ~face
- 汉字只在一个地方使用 ~opposite
?1 为了让汉字更容易学，人们做了什么？ | What was done to make it easier to learn?
≈ 简化了一部分汉字，并推行拼音作为识字的工具 | 一方面简化了一部分汉字 | 一方面推行拼音作为识字的工具
- 废除了汉字，改用拼音文字 ~opposite @让汉字在保持优点的同时
- 减少了汉字的数量，只留下一千个 ~unsaid
?2 文章开头拿古埃及圣书字和楔形文字来比较，有什么作用？ | Why open with Egyptian and cuneiform writing?
≈ 用别的古文字早已消亡作对比，突出汉字沿用至今的不寻常，引出要回答的问题 | 早已没有人使用，汉字却一直沿用到今天 | 这是为什么
- 说明圣书字比汉字更古老 ~unsaid
- 介绍外国文字的写法 ~offpoint
?2 文章第三段写汉字难学，和前文是什么关系？ | How does the third paragraph stand to what came before?
≈ 在说明优点之后也说出不足，看问题比较全面 | 当然，汉字也有难学的一面 | 汉字主要记录的是意义
- 推翻了前面说的汉字的优点 ~misread @让汉字在保持优点的同时
- 和前文没有关系 ~role
?2 文章总体上用了怎样的思路？ | What is the line of the text?
≈ 提出问题，分析原因，再说明不足和改进 | 这是为什么 | 一个重要的原因是 | 当然，汉字也有难学的一面
- 先讲故事，再总结道理 ~misread @早已没有人使用，汉字却一直沿用到今天
- 只是列举了很多汉字的例子 ~noexample

# 墙倒屋不塌
中国古代的房屋，大多用木头搭起骨架：地上立柱子，柱子上架梁，梁上再架檩，檩上铺椽子，最后盖瓦。屋顶的重量，一层一层传到柱子上，再由柱子传到地面。墙只是用来挡风遮雨、隔开空间的，并不承重。所以民间有一句话：“墙倒屋不塌。”
柱子和梁的连接处，常常有一组层层伸出的木块，叫做斗拱。它把屋檐挑出去很远，又把屋顶的重量分散开。斗拱的各个部件不用钉子，靠榫卯互相咬合，遇到地震，可以稍稍错动，吸收一部分震动的力量，地震过后又大致回到原位。山西应县的木塔建于辽代，高六十多米，经历了多次地震，至今还立着。
这种建筑也有缺点：木头怕火，也怕虫蛀和潮湿，所以古代的木建筑留下来的不多。
注：檩，架在梁上、承托椽子的横木。椽子，架在檩上、承托屋瓦的木条。榫卯，木构件上凸出的部分叫榫，凹进的部分叫卯，二者咬合在一起。
?1 为什么说中国古代的木建筑“墙倒屋不塌”？ | Why does the house stand when the wall falls?
≈ 屋顶的重量由木骨架传到柱子和地面，墙并不承重 | 再由柱子传到地面 | 墙只是用来挡风遮雨、隔开空间的，并不承重
- 因为墙是用木头做的 ~misread
- 因为古代的墙特别结实 ~opposite @并不承重
?1 斗拱有哪些作用？ | What does a bracket set do?
≈ 把屋檐挑出去，分散屋顶的重量，地震时还能吸收一部分震动的力量 | 它把屋檐挑出去很远，又把屋顶的重量分散开 | 吸收一部分震动的力量
- 只是为了好看 ~opposite
- 把柱子钉在一起 ~opposite @斗拱的各个部件不用钉子
?1 文中提到的木建筑的缺点是什么？ | What are the weak points of timber building?
= 怕火，也怕虫蛀和潮湿 | 木头怕火，也怕虫蛀和潮湿
- 不能盖得很高 ~opposite @高六十多米
- 遇到地震容易倒塌 ~opposite @经历了多次地震，至今还立着
?2 文中举应县木塔的例子，是为了说明什么？ | What does the wooden pagoda show?
≈ 证明榫卯斗拱的结构能够抵御地震 | 经历了多次地震，至今还立着 | 遇到地震，可以稍稍错动
- 说明辽代的人很会盖塔 ~offpoint
- 说明木塔比砖塔高 ~nocompare
?2 第一段说明屋顶怎样传力，用的是什么顺序？ | In what order does the first paragraph tell how the load travels?
≈ 先由下往上讲搭建的顺序，再由上往下讲重量的传递 | 地上立柱子，柱子上架梁 | 屋顶的重量，一层一层传到柱子上
- 按时间顺序，从古代讲到今天 ~wrongorder
- 由外到内，从墙讲到屋顶 ~wrongorder
?2 文章引用民间俗语“墙倒屋不塌”，有什么作用？ | Why quote the folk saying?
≈ 用通俗形象的话概括木结构的特点，使说明生动易懂 | 所以民间有一句话：“墙倒屋不塌。” | 并不承重
- 说明房子的墙经常倒 ~face
- 证明这句话是古代建筑师说的 ~unsaid

# 二十四节气
二十四节气是古人根据太阳在一年中的位置变化定下来的。地球绕太阳转一圈，古人把这一圈平分成二十四份，每到一份，就是一个节气。所以，节气在公历里的日子差不多是固定的：清明总在四月五日前后，冬至总在十二月二十二日前后。
节气的名字，大多直接说出了那时候的天气或物候。“惊蛰”，是春雷响了，冬眠的虫子被惊醒；“小满”，是麦粒开始饱满，但还没有完全成熟；“霜降”，是天气渐冷，开始有霜。农民根据节气安排种地、收割，有“清明前后，种瓜点豆”的说法。
不过，节气是以黄河流域的气候为依据定下的。中国南北相差很大，到了岭南，“霜降”时节可能还很温暖，到了东北，“清明”时地里可能还没有化冻。所以，各地的农谚往往会根据当地的情况作出调整。2016年，二十四节气被列入联合国教科文组织的人类非物质文化遗产代表作名录。
注：物候，动植物随着季节变化出现的现象，比如花开、鸟来。岭南，指五岭以南的广东、广西一带。
?1 二十四节气是根据什么定下来的？ | On what are the twenty-four solar terms fixed?
= 太阳在一年中的位置变化 | 二十四节气是古人根据太阳在一年中的位置变化定下来的
- 月亮的圆缺 ~unsaid
- 每年第一场雪的日子 ~unsaid
?1 为什么节气在公历里的日子差不多是固定的？ | Why do the terms fall on nearly the same dates each year?
≈ 节气按地球绕太阳的位置平分一年，而公历也是按地球绕太阳一圈来定的 | 地球绕太阳转一圈，古人把这一圈平分成二十四份 | 所以，节气在公历里的日子差不多是固定的
% 文中说，节气是把地球绕太阳的一圈平分成二十四份，接着用“所以”引出日子固定的结论。公历的一年正是地球绕太阳一圈的时间，地球每年经过同一个位置的日子大致相同，节气也就总落在差不多的日子里。 | The terms divide the earth's circuit of the sun into twenty-four, and “so” the dates are fixed. The solar calendar's year is that circuit; the earth reaches each point on about the same date, and so do the terms.
- 因为古人规定了每个节气的日期 ~misread
- 因为每年的天气都一样 ~opposite @到了岭南，“霜降”时节可能还很温暖
?1 文中怎样解释“小满”这个节气？ | How does the text explain the term 小满?
= 麦粒开始饱满，但还没有完全成熟 | 是麦粒开始饱满，但还没有完全成熟
- 人吃得有一点饱 ~face
- 河里的水快要满了 ~unsaid
?2 第三段说节气在岭南、东北不完全适用，有什么作用？ | Why say the terms do not quite fit the far south and north?
≈ 说明节气有地域的局限，使说明更全面、更准确 | 节气是以黄河流域的气候为依据定下的 | 各地的农谚往往会根据当地的情况作出调整
- 说明二十四节气是错误的 ~misread
- 说明岭南没有冬天 ~broad
?2 文中引用农谚“清明前后，种瓜点豆”，有什么作用？ | Why quote the farmers' saying?
≈ 具体说明节气对农业生产的指导作用 | 清明前后，种瓜点豆 | 农民根据节气安排种地、收割
- 说明清明节要吃瓜和豆 ~face
- 证明节气是农民发明的 ~unsaid
?2 文章举“惊蛰”“小满”“霜降”三个例子，是为了说明什么？ | What do the three examples show?
≈ 节气的名字大多直接说出了那时候的天气或物候 | 节气的名字，大多直接说出了那时候的天气或物候 | 是春雷响了，冬眠的虫子被惊醒
- 二十四节气只有这三个最重要 ~narrow
- 节气的名字都很难懂 ~opposite

# 《天工开物》
明朝末年，江西人宋应星写了一部书，叫《天工开物》。“天工”是自然的力量，“开物”是人用技术开发万物。书里记下了种稻、养蚕、织布、制盐、造纸、烧瓷、炼铁、造船等三十多种生产技术，还配了一百多幅插图，画出工具的样子和操作的步骤。
宋应星写这部书，不是坐在书房里抄古书。他多次考进士都没有考中，在往来各地的路上，留心观察农夫和工匠怎样干活，向他们请教，把看到的、问到的一一记下来。书里常常写出具体的数字，比如多少斤原料能出多少斤产品，这在当时的书里是很少见的。
在一个读书人只重视经书、看不起手艺的时代，宋应星却认为，这些关系到每个人吃饭穿衣的技术，才是真正有用的学问。这部书在中国一度失传，后来从日本传回，又被译成多种文字，被外国学者称为“中国十七世纪的工艺百科全书”。
注：宋应星，明末学者。进士，科举考试的最高一级。
?1 书名“天工开物”是什么意思？ | What does the title mean?
≈ 借助自然的力量，用人的技术开发万物 | “天工”是自然的力量 | “开物”是人用技术开发万物
- 天上的工匠创造了万物 ~face
- 天空的工作和开放的物品 ~face
?1 宋应星是怎样获得书中的材料的？ | How did he gather his material?
≈ 在各地留心观察农夫和工匠干活，向他们请教，并记录下来 | 留心观察农夫和工匠怎样干活，向他们请教 | 不是坐在书房里抄古书
- 在书房里整理古书 ~opposite @不是坐在书房里抄古书
- 由皇帝派人收集 ~unsaid
?1 这部书后来的经历是怎样的？ | What became of the book?
= 在中国一度失传，后来从日本传回，又被译成多种文字 | 这部书在中国一度失传，后来从日本传回
- 一直在中国广泛流传 ~opposite @这部书在中国一度失传
- 是在日本写成的 ~misread
?2 第二段写书里“常常写出具体的数字”，是为了说明什么？ | What do the figures in the book show?
≈ 说明这部书来自实地的观察，记录精确，有科学精神 | 书里常常写出具体的数字 | 这在当时的书里是很少见的
- 说明宋应星数学很好 ~offpoint
- 说明古代的东西都很便宜 ~unsaid
?2 第三段把宋应星和当时一般的读书人对比，有什么作用？ | Why set him against the scholars of his day?
≈ 突出他重视实用技术的见识，在当时难能可贵 | 在一个读书人只重视经书、看不起手艺的时代 | 才是真正有用的学问
- 说明宋应星看不起经书 ~broad
- 说明当时的读书人都很懒 ~unsaid
?2 文章最后引用外国学者的评价，作用是什么？ | Why end with the foreign scholars' praise?
≈ 从另一个角度说明这部书的价值和影响 | 被外国学者称为“中国十七世纪的工艺百科全书”
% 前面作者自己介绍了书的内容、写法和见识；结尾换成外国学者的话，说它是“工艺百科全书”。别人、而且是外国人的评价，说明这部书的价值不只是中国人自己承认，影响也到了国外。 | The writer has told of the book's matter, method and insight; the end turns to foreign scholars calling it an encyclopaedia of crafts. Praise from others, and from abroad, shows its worth is not only claimed at home and its reach goes beyond China.
- 说明这部书是外国人写的 ~unsaid
- 说明外国学者比中国学者高明 ~unsaid

# 进化不是“进步”
很多人以为，生物进化就是从低级到高级、从简单到复杂的“进步”，好像所有生物都在朝着人的方向努力。这是一种误解。
进化的意思，是生物在一代一代的繁殖中，适应环境的特征保留下来，不适应的被淘汰。环境变了，适应的方向也跟着变。生活在黑暗洞穴里的鱼，眼睛渐渐退化，甚至完全消失，因为在那里，眼睛没有用处，反而容易受伤、消耗养分。从“有眼”到“无眼”，结构变得更简单了，却正是一种进化。
细菌出现在几十亿年前，结构简单，至今仍然遍布地球，数量远远超过其他生物。它们并没有“落后”：在各自的环境里，它们适应得很好。所以，问哪种生物“更高级”，其实没有意义；能问的，只是它适应了怎样的环境。
?1 文中认为“进化”的意思是什么？ | What is evolution, as the text says?
≈ 生物在繁殖中，适应环境的特征保留下来，不适应的被淘汰 | 进化的意思，是生物在一代一代的繁殖中，适应环境的特征保留下来，不适应的被淘汰
% 第二段第一句就用“进化的意思，是……”下了定义：一代一代繁殖，适应的留下，不适应的淘汰。文章开头说的“从低级到高级”的进步，是作者指出的误解，不是定义。 | The second paragraph opens with the definition: over generations, what fits the environment is kept and what does not is lost. The “low to high” of the opening is the error the writer corrects, not the definition.
- 生物从低级到高级、从简单到复杂的进步 ~oneside @这是一种误解
- 所有生物都朝着人的方向变化 ~oneside @这是一种误解
?1 洞穴里的鱼为什么眼睛会退化？ | Why do cave fish lose their eyes?
= 在黑暗里眼睛没有用处，反而容易受伤、消耗养分 | 因为在那里，眼睛没有用处，反而容易受伤、消耗养分
- 因为鱼不爱看东西 ~unsaid
- 因为洞里的水有毒 ~unsaid
?1 文中认为细菌为什么并不“落后”？ | Why are bacteria not “backward”?
≈ 它们在各自的环境里适应得很好，至今遍布地球 | 在各自的环境里，它们适应得很好 | 至今仍然遍布地球
- 因为细菌的结构很复杂 ~opposite @结构简单
- 因为细菌出现得最晚 ~opposite @细菌出现在几十亿年前
?2 文章开头先摆出一种常见的看法，有什么作用？ | Why open with a common view?
≈ 先树立要批驳的误解，引出作者对进化的正确解释 | 这是一种误解 | 进化的意思
- 说明作者赞同这种看法 ~opposite @这是一种误解
- 介绍进化论的历史 ~unsaid
?2 文中举洞穴鱼的例子，主要是为了证明什么？ | What does the cave fish prove?
≈ 结构变简单也可以是进化，进化并不等于变复杂 | 从“有眼”到“无眼”，结构变得更简单了，却正是一种进化
% 开头的误解是“进化就是从简单到复杂”。洞穴鱼的眼睛退化了，结构反而简单了，作者却说“正是一种进化”：适应了黑暗的环境。一个变简单的进化，正好驳倒了那种误解。 | The error was “evolution is simple to complex”. The cave fish loses its eyes and grows simpler, yet the writer calls it evolution: fitting the dark. One evolution toward simplicity refutes the error.
- 证明鱼是最低级的生物 ~unsaid
- 证明洞穴里没有光 ~offpoint
?2 最后一句“能问的，只是它适应了怎样的环境”，表达了作者怎样的观点？ | What view does the last sentence give?
≈ 评价生物不应分高低，只应看它与环境的适应关系 | 问哪种生物“更高级”，其实没有意义 | 能问的，只是它适应了怎样的环境
- 人是最高级的生物 ~opposite @问哪种生物“更高级”，其实没有意义
- 环境比生物更重要 ~unsaid

# 测量总有误差
用尺子量一本书的长度，三次可能得到三个略有不同的数：25.4厘米，25.3厘米，25.5厘米。是尺子坏了，还是量的人不认真？都不一定。任何测量都有误差，误差不是错误：错误可以避免，误差只能减小，不能消除。
误差有两种。一种是系统误差，比如尺子本身刻度不准，或者每次都斜着看刻度，结果总是偏大或者总是偏小。找到原因，换一把准确的尺子，或者纠正读数的方法，就能减小它。另一种是偶然误差，来自许多说不清的小因素，有时偏大，有时偏小。对付它的办法是多量几次，取平均值。
所以，一个认真的测量结果，不只写出一个数，还要说明它可能有多大的误差。“这本书长25.4厘米，误差不超过0.1厘米”，比“这本书长25.4厘米”提供了更多、也更可靠的信息。
?1 文中说误差和错误有什么不同？ | How does error of measurement differ from a mistake?
= 错误可以避免，误差只能减小，不能消除 | 错误可以避免，误差只能减小，不能消除
- 误差是可以完全消除的 ~opposite @误差只能减小，不能消除
- 误差和错误是一回事 ~opposite @误差不是错误
?1 怎样减小偶然误差？ | How is chance error reduced?
= 多量几次，取平均值 | 对付它的办法是多量几次，取平均值
- 换一把准确的尺子 ~other @找到原因，换一把准确的尺子
- 量的时候更认真一些 ~unsaid
?1 每次都斜着看刻度，会造成哪一种误差？ | Reading the scale at a slant every time causes which error?
= 系统误差 | 一种是系统误差
- 偶然误差 ~misread @有时偏大，有时偏小
- 不会造成误差 ~opposite
?2 文章开头写量书得到三个不同的数，有什么作用？ | Why open with the three readings?
≈ 用生活中常见的现象引出“任何测量都有误差”的观点 | 25.4厘米，25.3厘米，25.5厘米 | 任何测量都有误差
- 说明那本书的长度在变化 ~misread
- 说明尺子坏了 ~misread @任何测量都有误差
?2 第二段是怎样说明误差的？ | How does the second paragraph explain error?
≈ 分类说明，把误差分为系统误差和偶然误差，分别说明原因和减小的办法 | 误差有两种 | 一种是系统误差 | 另一种是偶然误差
- 打比方，把误差比作错误 ~nolikening
- 列数字，说明误差有多大 ~misread
?2 最后一段比较两种写法的测量结果，是为了说明什么？ | What does comparing the two reports show?
≈ 写明误差的结果更可靠、信息更多，测量要说明误差的大小 | 比“这本书长25.4厘米”提供了更多、也更可靠的信息 | 还要说明它可能有多大的误差
- 说明书的长度一定是25.4厘米 ~misread
- 说明误差越大越好 ~unsaid

# 借景
园林的面积总是有限的，可中国的造园家常常让人觉得园子比实际的大。一个重要的办法，叫做“借景”。
所谓借景，是把园子外面的景物，有意识地收进园里人的视线。园外有一座山，就在园里正对着它的地方开一扇窗、留一片空地，或者把墙砌得矮一些，让远山好像成了园子的一部分。北京颐和园的昆明湖西边，远远地可以望见西山和玉泉山上的塔，看上去就像园中的景物。明代的造园家计成在《园冶》里说，借景是造园最要紧的一件事。
借景之所以能成立，靠的是看的人。景物并没有被搬进园子，只是被“框”进了人的眼睛。窗框、门洞、树木的枝叶，都可以成为这样的框。所以，借景不只是一种造园的技术，也体现了一种观看的智慧：有限的空间，可以通向无限的景色。
注：颐和园，清代的皇家园林。《园冶》，明末计成写的一部造园的专著。
?1 文中所说的“借景”是什么？ | What is borrowed scenery?
= 把园子外面的景物，有意识地收进园里人的视线 | 所谓借景，是把园子外面的景物，有意识地收进园里人的视线
- 向别人借来景物放进园子里 ~face
- 把园子里的景物搬到外面 ~misread @景物并没有被搬进园子
?1 造园家用哪些办法来借景？ | How is scenery borrowed?
≈ 在正对园外景物的地方开窗、留空地，或者把墙砌矮 | 就在园里正对着它的地方开一扇窗、留一片空地，或者把墙砌得矮一些
% 文中举了园外有一座山的情况，说了三种做法：开一扇窗，留一片空地，把墙砌矮。这几种做法的共同点，都是不让东西挡住视线，好让远处的山“好像成了园子的一部分”。 | For a hill outside, the text gives three ways: a window, an open space, a lower wall. All clear the line of sight, so the far hill seems part of the garden.
- 把园外的山搬进园里 ~opposite @景物并没有被搬进园子
- 把园子的围墙全部拆掉 ~broad
?1 文中说借景“靠的是看的人”，为什么？ | Why does borrowing rest on the beholder?
≈ 景物并没有搬进园子，只是被框进了人的眼睛 | 景物并没有被搬进园子，只是被“框”进了人的眼睛
% 借来的山还在园子外面，并没有挪动；变的只是园里的人从窗框、门洞里看过去，觉得它属于这个园子。所以文中说借景能成立，靠的是看的人：景在外面，“借”发生在人的眼睛里。 | The borrowed hill stays outside; what changes is how one in the garden sees it through a window or a gate. Hence it rests on the beholder: the scene is outside, the borrowing is in the eye.
- 因为园子是给人看的，不是给动物看的 ~offpoint
- 因为看的人越多，景色越美 ~unsaid
?2 文中举颐和园的例子，作用是什么？ | What does the Summer Palace show?
≈ 用著名的实例具体说明借景的效果 | 远远地可以望见西山和玉泉山上的塔，看上去就像园中的景物
% 前面讲了借景的意思和做法，都是一般地说；这里换成一个具体的、很多人去过的园子：颐和园。西山和玉泉山的塔明明在园外，看上去却像园里的景物，读者一下子就明白借景是什么效果了。 | The meaning and the ways were told in general; here is a garden many have seen. The hills and the pagoda lie outside, yet look part of the park: the reader sees at once what borrowing does.
- 说明颐和园是最大的园林 ~unsaid
- 介绍颐和园的历史 ~offpoint
?2 文中引用计成《园冶》的话，有什么作用？ | Why cite the Craft of Gardens?
≈ 引用古代造园专著，说明借景在造园中的重要地位，增强说服力 | 借景是造园最要紧的一件事
% 注里说《园冶》是明末计成写的一部造园专著。作者引用这位造园家的话，说借景是“最要紧的一件事”：这是行家的判断，比作者自己说更有分量，说明借景在中国造园传统里地位很高。 | The note gives the Yuanye as a Ming treatise on gardens. Quoting its author that borrowing is “the most important thing” brings a master's judgment, weightier than the writer's own, and shows its high place in the tradition.
- 说明计成是颐和园的设计者 ~unsaid
- 说明借景是明代才有的 ~unsaid
?2 最后一句“有限的空间，可以通向无限的景色”，在全文中有什么作用？ | What does the last sentence do?
≈ 由造园技术推进到观看的智慧，点明借景更深一层的意义，并照应开头 | 借景不只是一种造园的技术，也体现了一种观看的智慧 | 园林的面积总是有限的
- 说明园林的面积是无限的 ~face
- 提出一个新的问题 ~role

# 为什么要证明
有人发现：1加3等于4，1加3加5等于9，1加3加5加7等于16……从1开始，连续的奇数加起来，总是一个数的平方。他试了一百个，都对。这能不能算是一条定理？
在数学里，不能。试了一百个，只说明这一百个是对的；第一百零一个对不对，试了才知道。而数学要说的是“所有”。历史上就有这样的例子：有的规律在前面很多个数上都成立，到了非常大的数才出现例外。所以，数学家不满足于举例，而要求证明：从已经承认的道理出发，一步一步推出结论，每一步都有根据。
连续奇数的规律可以这样看：用小方块拼正方形，1个方块是一个小正方形，在它的两边补上3个，成了2乘2的正方形，再补上5个，成了3乘3的正方形……每补一圈，都是下一个奇数。这样一看，不管加到多少个，结果都是平方数，用不着一个一个地试。
证明给人的，是一种可以放心的确定：它不怕例外，因为它已经说明了为什么不会有例外。
?1 文中认为“试了一百个都对”为什么还不能算定理？ | Why are a hundred cases not a theorem?
≈ 举例只能说明试过的是对的，而数学要说的是所有的数 | 试了一百个，只说明这一百个是对的 | 而数学要说的是“所有”
- 因为一百个还不够多，要试一千个 ~misread @数学家不满足于举例
- 因为那个人算错了 ~unsaid
?1 文中说的“证明”是什么？ | What is a proof, as the text says?
= 从已经承认的道理出发，一步一步推出结论，每一步都有根据 | 从已经承认的道理出发，一步一步推出结论，每一步都有根据
- 举出很多例子 ~opposite @数学家不满足于举例
- 请有名的数学家来判断 ~unsaid
?1 用小方块拼正方形，每补一圈用了多少个方块？ | How many squares does each new ring take?
≈ 下一个奇数个 | 每补一圈，都是下一个奇数 | 在它的两边补上3个
- 每次都是3个 ~part @再补上5个
- 每次都比上一次多一个 ~misread @再补上5个
?2 文章开头用一个“试了一百个都对”的例子，有什么作用？ | Why open with the hundred trials?
≈ 设下一个看似可靠的结论，引出举例和证明的区别 | 他试了一百个，都对 | 这能不能算是一条定理
- 说明举例的方法是正确的 ~opposite @在数学里，不能
- 说明奇数比偶数重要 ~unsaid
?2 第三段用小方块拼正方形，起什么作用？ | What does the square of blocks do?
≈ 用直观的图形说明规律为什么对所有的数都成立，示范什么是证明 | 不管加到多少个，结果都是平方数，用不着一个一个地试 | 用小方块拼正方形
- 又举了一个例子，和前面的例子一样 ~misread @用不着一个一个地试
- 说明怎样做手工 ~offpoint
?2 最后一句“它不怕例外，因为它已经说明了为什么不会有例外”怎样理解？ | How is the last sentence to be read?
≈ 证明说明了道理本身，所以结论对所有情况都成立，比举例更可靠 | 它不怕例外，因为它已经说明了为什么不会有例外 | 证明给人的，是一种可以放心的确定
- 证明过的结论也会有例外 ~opposite
- 举例和证明一样可靠 ~opposite @数学家不满足于举例
`;

/** POEMS_11 are the pieces of reading-11-poems: the images and feeling of Tang and Song poems, and their art. */
export const POEMS_11 = `
# 旅夜书怀（杜甫）
细草微风岸，危樯独夜舟。
星垂平野阔，月涌大江流。
名岂文章著，官应老病休。
飘飘何所似，天地一沙鸥。
注：这首诗是杜甫晚年离开成都、乘船东下时写的。危樯，高高的桅杆。著，显著。休，罢休。飘飘，飘泊不定的样子。
?1 “名岂文章著，官应老病休”表达了诗人怎样的感情？ | What feeling is in this couplet?
≈ 名声难道是因文章而显著？官职却该因老病而罢休：这是自嘲，也是愤慨和无奈 | 名岂文章著 | 官应老病休
% “岂”是难道，诗人并不认为自己的名声只该靠文章；他想要的是在政治上有所作为。“官应老病休”说官职该因老病而罢，可他其实是受排挤丢了官。两句话说得平静，里面有自嘲，也有不平。 | 岂, “surely not”: he would not have his name rest on his writing alone; he wanted to serve. And office “should” end for age and illness, though in fact he was pushed out. Calmly said, with mockery of himself and a grievance under it.
- 诗人为自己的文章出名而得意 ~nomood
- 诗人因为老了想辞官，心情愉快 ~nomood
?1 诗的最后两句，诗人把自己比作什么？ | What does he liken himself to at the end?
≈ 天地间一只飘泊的沙鸥 | 飘飘何所似 | 天地一沙鸥
- 一只高飞的雄鹰 ~unsaid
- 一条孤独的小船 ~other
?1 “星垂平野阔，月涌大江流”写了怎样的景色？ | What scene do these lines draw?
≈ 星空低垂，原野辽阔；月影随波涌动，大江奔流 | 星垂平野阔 | 月涌大江流
- 星星掉到了地上 ~face
- 江边的小草在风中摇动 ~other
?2 “星垂平野阔，月涌大江流”中的“垂”和“涌”好在哪里？ | What is fine in 垂 and 涌?
≈ “垂”写出原野的辽阔，星空像低低地垂下；“涌”写出月影随着江水奔涌，景色雄浑有动感 | 星垂平野阔，月涌大江流
% 原野越平越阔，天边的星星看起来就越低，“垂”字把这种辽阔写了出来；江水奔流，月亮的倒影在波上翻动，像从江里涌出，“涌”字写出了江的气势。一静一动，境界开阔雄浑。 | The flatter and wider the plain, the lower the stars seem at its edge: 垂 makes the breadth seen. The river runs, and the moon's reflection churns on it as if welling up: 涌 gives the river's force. Still and moving, the scene is vast.
- “垂”写出星星很少 ~misread
- 两个字都写出了诗人的愉快 ~nomood
?2 诗的前四句写景，后四句抒情，景和情之间是什么关系？ | How do the scene and the feeling stand?
≈ 用辽阔的天地反衬孤舟和个人的渺小，景中已含飘泊孤独之情 | 危樯独夜舟 | 星垂平野阔 | 天地一沙鸥
- 景和情没有关系 ~role
- 用美丽的景色写出诗人的快乐 ~nomood
?2 “飘飘何所似，天地一沙鸥”用了什么手法？ | What device is in the last couplet?
≈ 自问自答，用比喻写出诗人飘泊无依的处境 | 飘飘何所似 | 天地一沙鸥
- 拟人，把沙鸥当作人来写 ~nopersonify
- 夸张，把沙鸥写得很大 ~noexaggerate

# 终南别业（王维）
中岁颇好道，晚家南山陲。
兴来每独往，胜事空自知。
行到水穷处，坐看云起时。
偶然值林叟，谈笑无还期。
注：终南，终南山，在长安南面。别业，别墅。道，这里指佛理。陲，边。胜事，美好的事。空，只。值，遇到。林叟，山林中的老人。还期，回去的时间。
?1 “兴来每独往，胜事空自知”写出了诗人怎样的生活？ | What life do these lines show?
≈ 兴致来了就独自出游，其中的乐趣只有自己知道，自由自在 | 兴来每独往 | 胜事空自知
- 诗人很孤单，没有人陪他，很痛苦 ~nomood
- 诗人每天都要出门办事 ~misread
?1 “行到水穷处，坐看云起时”写了诗人的什么经历？ | What do these lines tell of him?
≈ 走到溪水的尽头，就坐下来看云升起 | 行到水穷处 | 坐看云起时
- 诗人迷了路，走不出去 ~unsaid
- 诗人在河边钓鱼 ~unsaid
?1 “谈笑无还期”表现了诗人怎样的心情？ | What mood does 谈笑无还期 show?
≈ 和山中老人谈得投机，忘了回去，悠闲自在 | 偶然值林叟 | 谈笑无还期
- 诗人不想回家，因为家里有烦心事 ~unsaid
- 诗人和老人吵了起来 ~opposite
?2 “行到水穷处，坐看云起时”除了写景，还有什么言外之意？ | What lies beyond the scene in this couplet?
≈ 路走到了尽头，却看到云起，暗含随遇而安、山穷水尽处另有天地的人生态度 | 行到水穷处，坐看云起时
% 溪水到头了，没路可走，诗人不着急，也不扫兴，干脆坐下来看云。云正是从山间水汽里升起来的：“水穷”之处，正是“云起”之时。这里有一种随遇而安的心境，也有一层道理：看起来走到了绝处，换个眼光就有新的景象。 | The stream ends; he does not fret, but sits and watches clouds. Clouds rise from the mountain's damp: where water ends, cloud begins. A mind at ease with what comes, and a truth: at what looks a dead end, another view opens.
- 说明诗人走累了 ~face
- 说明诗人对生活绝望 ~nomood
?2 全诗的语言有什么特点？ | What is the language like?
≈ 平淡自然，不加雕饰，却写出悠然自得的情趣 | 兴来每独往 | 偶然值林叟 | 谈笑无还期
- 辞藻华丽，用了很多典故 ~misread
- 慷慨激昂，气势雄壮 ~nomood
?2 “偶然值林叟”中的“偶然”在全诗中有什么作用？ | What does 偶然 do?
≈ 写出一切都是随兴而来、不加安排，和“兴来每独往”一样，表现自由随意的心境 | 偶然值林叟 | 兴来每独往
- 说明诗人很少遇到人，感到寂寞 ~nomood
- 说明诗人早就约好了老人 ~opposite

# 题乌江亭（杜牧）　叠题乌江亭（王安石）
胜败兵家事不期，包羞忍耻是男儿。
江东子弟多才俊，卷土重来未可知。
（杜牧）
百战疲劳壮士哀，中原一败势难回。
江东子弟今虽在，肯与君王卷土来？
（王安石）
注：乌江，在今安徽和县，项羽兵败后在这里自杀。不期，不能预料。包羞忍耻，忍受羞耻。江东，项羽起兵的地方。卷土重来，比喻失败后重新恢复势力。君王，指项羽。
?1 杜牧认为项羽应该怎样做？ | What does Du Mu think Xiang Yu should have done?
≈ 忍受一时的羞耻，回到江东，重新召集人马，再图胜利 | 包羞忍耻是男儿 | 卷土重来未可知
- 应该在乌江自杀 ~opposite @包羞忍耻是男儿
- 应该向刘邦投降 ~unsaid
?1 王安石为什么认为项羽不能“卷土重来”？ | Why does Wang Anshi think he could not return?
≈ 经过百战已经疲惫，中原一败大势已去，江东子弟也不会再跟他 | 百战疲劳壮士哀 | 中原一败势难回 | 肯与君王卷土来
- 因为江东子弟都已经死了 ~opposite @江东子弟今虽在
- 因为项羽不会打仗 ~unsaid
?1 “肯与君王卷土来”是什么语气？意思是什么？ | What tone is this, and what does it mean?
≈ 反问，江东子弟哪里还肯跟着他卷土重来 | 肯与君王卷土来
% 句末是问号，王安石并不是在问，而是用反问表示否定：江东子弟虽然还在，但项羽大势已去，他们不会再愿意跟着他了。“今虽在”和“肯……来”一转，正好驳倒了杜牧的“多才俊”。 | It ends in a question mark, but asks nothing: a rhetorical no. The men of Jiangdong are still there, but he has lost all, and they will not follow him again. “Though still there” turns against “will they come”, answering Du Mu's “many able men”.
- 疑问，王安石不知道答案 ~misread
- 陈述，江东子弟愿意跟着项羽 ~opposite
?2 两首诗都写项羽，观点有什么不同？ | How do the two views differ?
≈ 杜牧惋惜项羽不肯忍辱重来，王安石认为大势已去、重来也无望 | 卷土重来未可知 | 中原一败势难回
- 两首诗的观点完全相同 ~opposite
- 杜牧批评项羽，王安石称赞项羽 ~misread
?2 这两首诗属于什么类型的诗？有什么特点？ | What kind of poems are these, and what marks them?
≈ 咏史诗，借历史人物和事件发表议论，翻出新意 | 胜败兵家事不期 | 中原一败势难回
- 山水诗，描写乌江的风景 ~notdescribe
- 送别诗，写朋友离别 ~unsaid
?2 王安石的诗题为“叠题”，和杜牧的诗有什么关系？ | What is Wang's poem to Du's?
≈ 针对杜牧的诗而作，用同样的题目、同样的“江东子弟”“卷土”反驳他的看法 | 江东子弟今虽在 | 江东子弟多才俊 | 肯与君王卷土来
- 是对杜牧的诗的抄写 ~misread
- 和杜牧的诗没有关系 ~opposite

# 月夜（杜甫）
今夜鄜州月，闺中只独看。
遥怜小儿女，未解忆长安。
香雾云鬟湿，清辉玉臂寒。
何时倚虚幌，双照泪痕干。
注：安史之乱中，杜甫的家人住在鄜州，他自己被叛军困在长安。这首诗是他在长安望月时写的。闺中，指妻子。怜，爱怜。云鬟，妇女浓密的头发。虚幌，薄薄的帷帐。
?1 诗人在长安看月，为什么却写“鄜州月”“闺中只独看”？ | He sees the moon in Chang'an. Why write of Fuzhou and his wife?
≈ 从对面写起，想象妻子在鄜州独自望月思念自己，更见自己的思念之深 | 今夜鄜州月，闺中只独看
% 注里说，诗人在长安，家人在鄜州。他不写自己怎样望月想家，却写妻子此刻在鄜州独自看月：这是从对方写起。妻子在想他，正说明他在想妻子，而且想得比自己说出来更深。 | The note puts him in Chang'an and his family in Fuzhou. He does not write of his own longing but of his wife looking at the moon alone: writing from her side. That she longs for him shows how he longs for her, more deeply than if he said it.
- 诗人自己就在鄜州 ~misread
- 诗人和妻子一起在看月亮 ~opposite @闺中只独看
?1 “未解忆长安”中，小儿女“未解”的是什么？ | What do the children not yet understand?
≈ 年纪太小，还不懂得思念远在长安的父亲 | 遥怜小儿女 | 未解忆长安
- 不认识长安的路 ~face
- 不明白月亮为什么圆 ~unsaid
?1 诗的最后两句表达了诗人怎样的愿望？ | What does he hope for at the end?
≈ 盼望早日团聚，和妻子一起倚着帷帐看月，让月光照干两人的泪痕 | 何时倚虚幌 | 双照泪痕干
- 希望妻子不要再哭 ~part
- 希望自己能升官 ~unsaid
?2 “香雾云鬟湿，清辉玉臂寒”是怎样写妻子的？ | How is his wife drawn in this couplet?
≈ 想象妻子望月很久，夜雾打湿了头发，月光下手臂发凉，写出她思念之久 | 香雾云鬟湿 | 清辉玉臂寒
- 写妻子刚洗了头发 ~unsaid
- 写妻子很冷，要加衣服 ~face
?2 “独看”和“双照”前后照应，有什么作用？ | What do 独看 and 双照 do together?
≈ 由现在的分离写到将来的团聚，“独”和“双”对照，更显出眼下的孤独和对团聚的盼望 | 闺中只独看 | 双照泪痕干
- 说明有两个月亮 ~face
- 说明诗人已经回家了 ~misread
?2 全诗没有一个字直接写自己想家，为什么却让人感到深深的思念？ | Not a word of his own longing. Why does it move so?
≈ 处处写妻子和儿女，借想象对方来写自己，情感含蓄而深沉 | 闺中只独看 | 遥怜小儿女 | 双照泪痕干
- 因为诗人直接说了自己很想家 ~opposite
- 因为写了很多长安的风景 ~notdescribe

# 卜算子·黄州定慧院寓居作（苏轼）
缺月挂疏桐，漏断人初静。谁见幽人独往来，缥缈孤鸿影。
惊起却回头，有恨无人省。拣尽寒枝不肯栖，寂寞沙洲冷。
注：这首词是苏轼因“乌台诗案”被贬到黄州后，住在定慧院时写的。漏断，指夜深。漏，古代计时的器具。幽人，幽居的人，指作者自己。省，理解。
?1 上片写了怎样的环境？ | What scene does the first stanza set?
≈ 残月挂在稀疏的梧桐上，夜深人静，冷清孤寂 | 缺月挂疏桐 | 漏断人初静
- 月圆之夜，热闹非凡 ~opposite
- 春天的早晨 ~unsaid
?1 “有恨无人省”中的“恨”是什么样的心情？ | What is the 恨 here?
≈ 内心的怨恨和忧愁，却没有人能理解 | 有恨无人省 | 惊起却回头
- 痛恨某一个人 ~sense
- 后悔自己没有离开 ~unsaid
?1 “拣尽寒枝不肯栖”写孤鸿怎样的举动？ | What does the goose do?
≈ 挑遍了寒冷的树枝，也不肯停下来栖息 | 拣尽寒枝不肯栖 | 寂寞沙洲冷
- 找到了一根温暖的树枝 ~opposite
- 把树枝都折断了 ~face
?2 词中的“孤鸿”有什么象征意义？ | What does the lone goose stand for?
≈ 象征作者自己：被贬后孤独、惊恐，却仍然坚持高洁，不肯随俗 | 谁见幽人独往来，缥缈孤鸿影 | 拣尽寒枝不肯栖
- 只是写一只鸟，没有别的意思 ~face
- 象征作者的朋友 ~who
?2 “谁见幽人独往来，缥缈孤鸿影”把“幽人”和“孤鸿”放在一起，有什么作用？ | Why set the recluse beside the goose?
≈ 人和鸿互相映衬，人如孤鸿，鸿似幽人，由人写到鸿，为下片写鸿作铺垫 | 谁见幽人独往来 | 缥缈孤鸿影
- 说明作者养了一只鸿雁 ~face
- 说明有很多人在看孤鸿 ~opposite @谁见幽人独往来
?2 整首词的风格是怎样的？ | What is the manner of the ci?
≈ 境界清冷孤寂，借物写人，含蓄深沉 | 寂寞沙洲冷 | 缺月挂疏桐 | 有恨无人省
- 豪放奔放，气势雄壮 ~nomood
- 活泼明快，充满喜悦 ~nomood

# 闺怨（王昌龄）
闺中少妇不知愁，春日凝妆上翠楼。
忽见陌头杨柳色，悔教夫婿觅封侯。
注：凝妆，盛装打扮。翠楼，华丽的楼。陌头，路边。觅封侯，指从军建功，求取官爵。
?1 少妇一开始是怎样的心情？ | What is her mood at first?
= 不知愁，高高兴兴地打扮好上楼 | 闺中少妇不知愁
- 一直很忧愁 ~opposite @闺中少妇不知愁
- 很生气 ~unsaid
?1 少妇的心情为什么忽然变了？ | Why does her mood suddenly change?
≈ 看见路边杨柳青青，想起分别和远方的丈夫，后悔让他去从军 | 忽见陌头杨柳色 | 悔教夫婿觅封侯
- 她看见丈夫回来了 ~unsaid
- 她的妆被弄花了 ~unsaid
?1 “悔教夫婿觅封侯”中，少妇后悔的是什么？ | What does she regret?
≈ 后悔当初让丈夫去从军求取功名 | 悔教夫婿觅封侯
% 注里说“觅封侯”是从军建功、求取官爵。“悔教”是后悔让他去。当初她大概也盼着丈夫建功封侯，所以“不知愁”；如今看见杨柳，才觉得功名比不上两人在一起的春光。 | The note gives 觅封侯 as seeking rank in the army; 悔教, regret letting him go. She too may once have hoped for his honours, and so knew no sorrow; seeing the willows, she feels rank is worth less than a spring together.
- 后悔嫁给了丈夫 ~unsaid
- 后悔今天上楼来 ~misread
?2 诗题是“闺怨”，诗却从“不知愁”写起，有什么作用？ | Why does a poem of a wife's grief begin “knowing no sorrow”?
≈ 先扬后抑，由“不知愁”突然转到“悔”，更显出怨情的深 | 闺中少妇不知愁 | 悔教夫婿觅封侯
- 说明少妇其实一点也不怨 ~onepart
- 和题目没有关系 ~role
?2 “杨柳色”在诗中起了什么作用？ | What does the willow do?
≈ 杨柳是春色，又是古人折柳送别的象征，触动了少妇的离愁，是情感转折的关键 | 忽见陌头杨柳色
% 春天的杨柳一片青青，让少妇想到春光正好，丈夫却不在身边；古人又有折柳送别的风俗，杨柳会让她想起当初分别的情景。正是这一眼，让“不知愁”变成了“悔”，杨柳是全诗转折的关键。 | Spring willow green makes her think of the fine season with her husband gone; and willow was broken at partings, so it recalls theirs. That one glance turns “no sorrow” to regret: the turn of the poem.
- 说明路边种了很多树 ~face
- 说明春天到了，她很开心 ~onepart
?2 这首诗在写法上的特点是什么？ | How is this poem made?
≈ 抓住一瞬间的心理变化，以小见大，含蓄地写出深沉的怨情 | 忽见陌头杨柳色 | 悔教夫婿觅封侯
- 按时间顺序写了少妇的一生 ~broad
- 直接描写了战场的情景 ~unsaid

# 菩萨蛮（韦庄）
人人尽说江南好，游人只合江南老。春水碧于天，画船听雨眠。
垆边人似月，皓腕凝霜雪。未老莫还乡，还乡须断肠。
注：韦庄，晚唐五代的词人，北方人，因战乱流落江南。只合，只应该。垆，酒店里放酒坛的土台，这里指卖酒的地方。须，必定。
?1 “春水碧于天，画船听雨眠”写出了江南怎样的生活？ | What life do these lines show?
≈ 春水比天还碧绿，躺在画船里听雨入睡，悠闲美好 | 春水碧于天 | 画船听雨眠
- 江南常常下大雨，令人烦恼 ~nomood
- 江南的人都住在船上 ~broad
?1 “垆边人似月，皓腕凝霜雪”写的是什么？ | What is drawn here?
≈ 卖酒的女子美丽如月，手腕洁白像霜雪 | 垆边人似月 | 皓腕凝霜雪
- 月亮照在酒店旁边 ~face
- 天气很冷，下了霜雪 ~face
?1 “未老莫还乡，还乡须断肠”中，词人为什么说还乡“须断肠”？ | Why would going home break his heart?
≈ 家乡正遭战乱，回去看到残破的景象必定悲痛欲绝 | 还乡须断肠 | 未老莫还乡
% 注里说韦庄是北方人，因为战乱才流落江南。所以他的家乡正在战火中，回去看到的只能是残破的景象，必定伤心欲绝。他劝自己“未老莫还乡”，不是不想家，而是有家难回。 | The note says he is a northerner, driven south by war. His home is in flames, and going back he would see it in ruins, and grieve beyond bearing. “Do not go home before you are old” is not that he does not miss it, but that he cannot return.
- 因为路途太远，走得腿疼 ~face
- 因为他在江南做了坏事 ~unsaid
?2 词的上片和下片都写江南的美，用意是什么？ | Why praise the south in both stanzas?
≈ 越写江南之美，越反衬出有家难回的痛苦 | 人人尽说江南好 | 还乡须断肠
- 说明词人已经忘记了家乡 ~opposite @还乡须断肠
- 只是在介绍江南的风景 ~onepart
?2 “人人尽说江南好”一句，为什么说是“人人”说，而不是“我”说？ | Why “everyone says”, not “I say”?
≈ 借别人的口来说，暗示词人自己另有难言的心事，为结尾作铺垫 | 人人尽说江南好 | 游人只合江南老 | 还乡须断肠
- 说明词人不喜欢江南 ~misread
- 说明江南的人很多 ~face
?2 这首词的语言有什么特点？ | What is the language like?
≈ 清新明白，像说话一样自然，在平淡中寄托着深沉的乡愁 | 人人尽说江南好 | 未老莫还乡，还乡须断肠
- 艰深难懂，多用生僻字 ~misread
- 慷慨激昂，充满斗志 ~nomood

# 临江仙（晏几道）
梦后楼台高锁，酒醒帘幕低垂。去年春恨却来时。落花人独立，微雨燕双飞。
记得小蘋初见，两重心字罗衣。琵琶弦上说相思。当时明月在，曾照彩云归。
注：晏几道，北宋词人。小蘋，一位歌女的名字。心字罗衣，绣着心字图案的丝绸衣服。彩云，比喻美丽的女子，这里指小蘋。
?1 “去年春恨却来时”是什么意思？ | What does this line mean?
≈ 去年春天离别的愁恨，又在这时涌上心头 | 去年春恨却来时 | 落花人独立
- 去年春天他很高兴 ~opposite
- 他恨去年的春天来得太晚 ~sense
?1 词人回忆和小蘋初次见面时的哪些情景？ | What does he remember of their first meeting?
≈ 她穿着绣有心字的罗衣，在琵琶弦上弹出相思 | 两重心字罗衣 | 琵琶弦上说相思
- 她给词人写了一封信 ~unsaid
- 她在月下唱歌跳舞 ~unsaid
?1 “当时明月在，曾照彩云归”表达了什么？ | What is in the last two lines?
≈ 明月还是当时的明月，曾经照着小蘋归去，如今人却不在了 | 当时明月在 | 曾照彩云归
- 天上的彩云被月亮照亮了 ~face
- 小蘋今晚又回来了 ~opposite
?2 “落花人独立，微雨燕双飞”用了什么手法？表达了怎样的感情？ | What device is in this couplet, and what feeling?
≈ 对比，以燕子成双反衬人的孤独，写出怀人的寂寞惆怅 | 落花人独立，微雨燕双飞
% “人独立”对“燕双飞”：燕子在细雨里成双成对地飞，人却一个人站在落花里。成双的燕子越是自在，越衬出人的孤单。落花和微雨也是暮春的景象，带着淡淡的伤感。 | 人独立 against 燕双飞: swallows fly in pairs through the drizzle, and he stands alone among falling petals. The freer the pair, the lonelier the man. Falling flowers and fine rain are late spring, and sad.
- 夸张，写燕子很多 ~noexaggerate
- 表达了春天到来的喜悦 ~nomood
?2 上片写眼前，下片写回忆，这样安排有什么好处？ | Why the present first, then memory?
≈ 由眼前的孤寂引出往日的欢会，今昔对照，更显出相思之深 | 梦后楼台高锁 | 记得小蘋初见 | 当时明月在
- 按时间先后，从过去写到现在 ~wrongorder
- 上下两片写的是两个人 ~misread
?2 “琵琶弦上说相思”中的“说”字用得好在哪里？ | What is fine in 说?
≈ 把琵琶的声音写成说话，写出小蘋借乐声倾诉情意，含蓄而传神 | 琵琶弦上说相思
% 琵琶不会说话，“说”本是人的动作。词人说小蘋在琵琶弦上“说相思”，是说她没有开口，却借着弹出的乐声把心里的情意倾诉了出来。一个“说”字，把乐声和心意连在了一起。 | A lute cannot speak; 说 is what people do. She “speaks longing on the strings”: without a word, she tells her heart in the music. One word joins the sound to the feeling.
- 写出了小蘋说话很多 ~face
- 说明小蘋不会弹琵琶 ~opposite

# 江汉（杜甫）
江汉思归客，乾坤一腐儒。
片云天共远，永夜月同孤。
落日心犹壮，秋风病欲苏。
古来存老马，不必取长途。
注：这首诗是杜甫晚年飘泊在江汉一带时写的。江汉，长江和汉水之间。乾坤，天地。腐儒，迂腐的读书人，这里是自嘲。苏，复苏、好转。老马，《韩非子》里有管仲用老马认路的故事，这里诗人以老马自比。
?1 诗人称自己为“腐儒”，是什么意思？ | What does he mean, calling himself a pedant?
≈ 自嘲是迂腐无用的读书人，其中有不被重用的辛酸 | 乾坤一腐儒 | 江汉思归客
- 诗人真的认为自己没有学问 ~face
- 诗人在批评别的读书人 ~who
?1 “落日心犹壮，秋风病欲苏”表达了诗人怎样的心志？ | What spirit is in this couplet?
≈ 年纪虽老，壮心不减；身体虽病，却似要在秋风中好转 | 落日心犹壮 | 秋风病欲苏
- 诗人看到落日，心情很悲伤 ~nomood
- 诗人的病已经完全好了 ~misread
?1 诗的最后两句，诗人想说什么？ | What does he mean by the old horse?
≈ 老马虽不能跑远路，却有识途的智慧；自己虽老，仍有可用之处 | 古来存老马 | 不必取长途
- 他想骑一匹老马回家 ~face
- 老马已经没有任何用处 ~opposite @古来存老马
?2 “片云天共远，永夜月同孤”用了什么手法？ | What device is in this couplet?
≈ 借景抒情，以片云、孤月自比，写出自己飘泊远方、孤独无依 | 片云天共远 | 永夜月同孤
% 天上的一片云和天一样遥远，长夜里的月亮和人一样孤单：诗人是在写云写月，也是在写自己。他像那片云，飘泊在远方；像那轮月，长夜里孤孤单单。景和情融在一起。 | A wisp of cloud far as the sky, the moon as lonely as he through the long night: cloud and moon, and himself. He drifts like the cloud, alone like the moon. The scene and the feeling are one.
- 夸张，把月亮写得很大 ~noexaggerate
- 写出了晴朗夜空的美好 ~nomood
?2 末句用“老马”的典故，有什么作用？ | What does the old-horse story do?
≈ 借管仲用老马认路的故事，含蓄地表达老当益壮、仍想为国出力的愿望 | 古来存老马，不必取长途
% 注里说，这里用的是《韩非子》里管仲靠老马认路的故事。老马的用处不在跑远路，而在识途。诗人用它自比：自己虽老病，不能再奔走远方，可还有经验和智慧，仍然可以为国出力。不直说，用典故含蓄地说出来。 | The note gives Han Feizi's tale of Guan Zhong's old horse that knew the way. An old horse is kept not for long roads but for knowing the way. He means himself: old and ill, he cannot travel far, but has wisdom still to serve. Said by allusion, not outright.
- 说明诗人家里养过老马 ~unsaid
- 说明诗人想去远方旅行 ~opposite @不必取长途
?2 全诗的感情有什么变化？ | How does the feeling move?
≈ 由飘泊思归的孤独，转为老而弥坚的壮志，悲中有壮 | 江汉思归客 | 落日心犹壮 | 古来存老马
- 从头到尾都很悲观 ~onepart
- 从头到尾都很欢快 ~nomood

# 鹊桥仙（秦观）
纤云弄巧，飞星传恨，银汉迢迢暗度。金风玉露一相逢，便胜却人间无数。
柔情似水，佳期如梦，忍顾鹊桥归路。两情若是久长时，又岂在朝朝暮暮。
注：这首词写牛郎织女的故事。传说他们被银河隔开，每年七月初七才能在喜鹊搭成的桥上相会一次。纤云，轻柔的云彩。飞星，流星。银汉，银河。金风玉露，指秋风白露，七夕正是初秋。忍顾，怎忍回头看。
?1 “金风玉露一相逢，便胜却人间无数”的意思是什么？ | What does this mean?
≈ 在秋风白露中的一次相会，就胜过人间无数的日日相聚 | 金风玉露一相逢 | 便胜却人间无数
- 秋天的风和露水比人间的东西好 ~face
- 人间的夫妻天天吵架 ~unsaid
?1 “忍顾鹊桥归路”表现了牛郎织女怎样的心情？ | What feeling is in this line?
≈ 不忍心回头看那条要走的鹊桥归路，依依难舍 | 忍顾鹊桥归路 | 佳期如梦
- 他们很高兴地回家了 ~nomood
- 他们害怕鹊桥会断 ~unsaid
?1 “两情若是久长时，又岂在朝朝暮暮”表达了什么看法？ | What view is in the last two lines?
≈ 只要两人的感情长久，又何必在乎每天都在一起 | 两情若是久长时 | 又岂在朝朝暮暮
- 相爱的人一定要天天在一起 ~opposite
- 爱情不可能长久 ~opposite
?2 “柔情似水，佳期如梦”用了什么手法？ | What device is in this phrase?
≈ 比喻，把柔情比作水，把相会比作梦，写出感情的绵长和相会的短暂 | 柔情似水 | 佳期如梦
- 拟人，把水当作人来写 ~nopersonify
- 夸张，把梦写得很长 ~noexaggerate
?2 和一般写牛郎织女的诗词相比，这首词的立意有什么新颖之处？ | What is new in its view of the old story?
≈ 不写离别的悲苦，而赞美久长的真情，翻出新意 | 两情若是久长时，又岂在朝朝暮暮 | 便胜却人间无数
- 也写了离别的痛苦，和别的诗词一样 ~onepart
- 批评牛郎织女不该相爱 ~unsaid
?2 词中的议论句和写景、叙事句是怎样结合的？ | How are the comment lines joined to the scene and the story?
≈ 上下片都先写景叙事，再用议论收束，情景和道理融为一体 | 银汉迢迢暗度 | 便胜却人间无数 | 又岂在朝朝暮暮
- 全词只有议论，没有写景 ~opposite @纤云弄巧
- 全词只有写景，没有议论 ~opposite @又岂在朝朝暮暮
`;
