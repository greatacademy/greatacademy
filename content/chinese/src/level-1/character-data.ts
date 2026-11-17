// The characters of level 1 (docs/chinese-curriculum.md §8.3): 300 basic characters in 30 batches of ten, close to level
// 1 of GF 0025-2021, ordered so that each unit's words and sentences can be written with what has been taught.
//
// A line a character: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks like[ | characters
// of the batch whose meanings are too close to offer against it]`. Other readings are never offered as wrong answers; one
// marked `~` is a change of tone in speech, left out of the explanations.

/** characterBatches are the 30 batches of level 1 characters, in teaching order. */
export const characterBatches: readonly string[] = [
  `
你 nǐ | you | 称说话的对方 | 尔他
我 wǒ | I, me | 说话的人称自己 | 找戈
他 tā | he, him | 称自己和对方以外的男子 | 也她
她 tā | she, her | 称自己和对方以外的女子 | 他妈
好 hǎo/hào | good, well | 优点多的，使人满意的 | 女妈
是 shì | to be | 表示肯定、判断的动词 | 早定
不 bù/~bú | not, no | 表示否定 | 下木
人 rén | person | 能说话、会劳动的高级动物 | 入八
们 men | plural suffix for people | 用在指人的词后面，表示多数 | 门你
吗 ma | yes-no question particle | 用在句子末尾，表示疑问 | 妈马
`,
  `
的 de/dí/dì | possessive particle | 用在名词前面，表示领属 | 白约
有 yǒu | to have; there is | 表示具备或存在 | 友右
在 zài | at, in; to be at | 表示人或事物所处的位置 | 再存
这 zhè/zhèi | this | 指比较近的人或事物 | 还过
那 nà/nèi | that | 指比较远的人或事物 | 哪都
很 hěn | very | 表示程度高 | 跟恨
也 yě | also, too | 表示同样 | 他地
都 dōu/dū | all, both | 表示全部，没有例外 | 者部
没 méi/mò | not (have) | 否定词，表示“不曾”或“无” | 设投
里 lǐ/li | inside | 内部，在一定范围以内 | 果理
`,
  `
什 shén/shí | (in 什么) what | 和“么”组成问事物的词 | 计付
么 me | suffix (in 什么, 这么) | 用在“什”“这”“那”后面的词尾 | 公去
叫 jiào | to call; to be called | 称呼，名字是 | 叶收
名 míng | name | 人或事物的称呼 | 各多
字 zì | character, word | 记录语言的符号 | 子学
谢 xiè/xie | to thank | 表示感激 | 射树
再 zài | again | 又一次 | 在册
见 jiàn | to see, to meet | 看到，遇到 | 贝觉
请 qǐng | please; to invite | 敬辞，希望对方做某事 | 情清
问 wèn | to ask | 有不知道的请人回答 | 间门
`,
  `
您 nín | you (polite) | 对“你”的敬称 | 你悠
谁 shéi/shuí | who | 问人的代词，哪个人 | 准难
哪 nǎ/na/něi | which | 用于提问，要求在几个中确定一个 | 那娜
对 duì | right, correct | 正确，合乎事实 | 双欢
起 qǐ | to rise, to get up | 由躺而坐或由坐而站 | 走赶
关 guān | to close | 使开着的东西合上 | 美共
系 xì/xi/jì | relation; system | 关联，事物之间相互连接 | 条素
客 kè | guest | 来访的人，被邀请的人 | 各容
气 qì/qi | air; gas | 包围地球的看不见的东西，人要呼吸它 | 汽乞
姓 xìng | surname | 表明家族的字，如“王”“李” | 性星
`,
  `
一 yī/~yí/~yì | one | 最小的正整数 | 二十
二 èr | two | 一加一 | 三工
三 sān | three | 二加一 | 二王
四 sì | four | 三加一 | 西匹
五 wǔ | five | 四加一 | 王互
六 liù | six | 五加一 | 方文
七 qī | seven | 六加一 | 九匕
八 bā | eight | 七加一 | 人入
九 jiǔ | nine | 八加一 | 力丸
十 shí | ten | 九加一 | 千干
`,
  `
百 bǎi | hundred | 十个十 | 白自
千 qiān | thousand | 十个一百 | 干于
万 wàn | ten thousand | 十个一千 | 方力
零 líng | zero | 表示没有数量 | 冷雪
两 liǎng | two (before a measure word) | 数目二，常用在量词前面 | 雨丙
几 jǐ/jī | how many; a few | 问十以内的数目 | 九儿 | 少
多 duō | many, much | 数量大 | 名岁
少 shǎo/shào | few, little | 数量小 | 小沙
个 gè/ge | general measure word | 用得最广的量词 | 介今
岁 suì | years of age | 表示年龄的单位 | 多罗
`,
  `
爸 bà/ba | dad | 父亲 | 巴爷
妈 mā/ma | mom | 母亲 | 吗码
哥 gē/ge | elder brother | 同父母所生、年纪比自己大的男子 | 可歌
姐 jiě/jie | elder sister | 同父母所生、年纪比自己大的女子 | 组姓
弟 dì/di | younger brother | 同父母所生、年纪比自己小的男子 | 第递
妹 mèi/mei | younger sister | 同父母所生、年纪比自己小的女子 | 味姐
家 jiā | home, family | 亲人一起生活的地方 | 字宝
儿 ér | son; child | 男孩子，父母的男孩 | 几九 | 子
子 zǐ/zi | child; son | 父母的后代，儿女 | 了字
女 nǚ | female, woman | 与“男”相对的性别 | 如好
`,
  `
爷 yé/ye | grandpa | 父亲的父亲 | 爸节
奶 nǎi/nai | grandma; milk | 父亲的母亲；乳汁 | 仍扔
男 nán | male | 与“女”相对的性别 | 另界
孩 hái | child | 儿童 | 该核
朋 péng | friend (in 朋友) | 和“友”组成指交情好的人的词 | 明册 | 友
友 yǒu/you | friend | 彼此有交情的人 | 有反
和 hé/hè/huó/huo/hú | and; with | 连接两个词，表示并列 | 知利
爱 ài | to love | 对人或事物有很深的感情 | 受爬
去 qù | to go | 从这里到别的地方 | 丢云
来 lái | to come | 从别的地方到说话的地方 | 米未
`,
  `
年 nián | year | 地球绕太阳一周的时间 | 午牛
月 yuè | month; moon | 一年的十二分之一 | 用日
日 rì | day; sun | 太阳；一天 | 目白 | 天
天 tiān | day; sky | 一昼夜；头上的空间 | 大夫
今 jīn | now, this | 现在，当前的 | 令会
明 míng | bright; next | 亮；今天的下一天 | 朋盟
昨 zuó | yesterday | 今天的前一天 | 作怎
号 hào/háo | number; date | 次序，一个月中的日子 | 另亏
星 xīng | star | 夜里天上发光的小点 | 生早
期 qī | period | 规定的时间或一段时间 | 其欺
`,
  `
点 diǎn | o'clock; dot | 时间单位，一天分二十四个；很小的痕迹 | 占店
分 fēn/fèn | minute; to divide | 钟点下面的时间单位，六十个合成一小时 | 今公
时 shí | time; hour | 钟点；光阴 | 对村
候 hòu/hou | time (in 时候) | 和“时”组成表示某个时间的词 | 侯喉 | 时
现 xiàn | now | 此刻，这个时候 | 观规
半 bàn | half | 二分之一 | 羊平
早 zǎo | early; morning | 时间在前的；太阳出来后的一段时间 | 旱草
晚 wǎn | late; evening | 时间在后的；太阳落山以后 | 免挽
上 shàng/shang | up; last | 位置在高处的 | 止土
下 xià/xia | down; next | 位置在低处的 | 不卡
`,
  `
午 wǔ | noon | 白天十二点前后 | 牛年
前 qián | front; before | 面对着的一边；时间早的 | 剪首
后 hòu | back; after | 背对着的一边；时间晚的 | 右石
每 měi | every | 全部中的任何一个 | 海母
了 le/liǎo | (marks a completed action) | 用在动词后面，表示完成 | 子丁
过 guò/guo | to pass; (marks experience) | 从一处到另一处；表示经历 | 这对
会 huì/kuài | can; will | 懂得怎样做；可能 | 合云 | 要
要 yào/yāo | to want; to be going to | 希望得到；表示快发生 | 耍票
住 zhù | to live, to stay | 长期在一个地方生活 | 往注
周 zhōu | week | 星期 | 同调
`,
  `
吃 chī | to eat | 把东西放进嘴里咽下去 | 乞喝
喝 hē/hè | to drink | 把水等流动的东西咽下去 | 渴吃
饭 fàn | cooked rice; meal | 煮熟的米；每天按时吃的东西 | 板饮 | 米
菜 cài | vegetable; dish | 可以吃的植物；做好的一盘食物 | 采莱
水 shuǐ | water | 无色无味的液体 | 木冰
茶 chá | tea | 用一种树的嫩叶泡成的饮料 | 荼答
米 mǐ | rice; metre | 去了壳的稻的子实 | 来木
面 miàn | noodles; face | 用小麦粉做成的细长食品；脸 | 而西
肉 ròu | meat | 动物身上可以吃的软的部分 | 内网
鸡 jī | chicken | 一种家禽，会打鸣 | 鸭鸟
`,
  `
鱼 yú | fish | 生活在水中的动物，用鳃呼吸 | 角色
蛋 dàn | egg | 鸟、鸡等生的卵 | 虽蚤
果 guǒ | fruit | 树上结的可以吃的东西 | 里呆
牛 niú | cow, ox | 一种家畜，力气大，可以耕地 | 午生
酒 jiǔ | alcohol, wine | 用粮食或水果做的、喝多了会醉的饮料 | 洒西
包 bāo | bag; bun; to wrap | 装东西的袋子；有馅的面食 | 句饱
饿 è | hungry | 肚子空了，想吃东西 | 俄饭
想 xiǎng | to think; to want | 动脑筋；希望 | 相箱
喜 xǐ | happy, pleased | 高兴，快乐 | 善吉 | 欢
欢 huān/huan | joyful; (in 喜欢) to like | 快活；和“喜”组成表示爱好的词 | 观次
`,
  `
杯 bēi | cup | 盛水、茶、酒的小容器 | 坏怀
用 yòng | to use | 拿来做事情 | 月甩
热 rè | hot | 温度高 | 执熟
冷 lěng | cold | 温度低 | 令冰
太 tài | too, extremely | 过于，非常 | 大犬
真 zhēn | real; really | 实在，确实，不假 | 直具
可 kě | can, may | 表示允许或能够 | 司哥
以 yǐ | (in 可以, 所以) with, by | 和“可”组成表示允许的词 | 似仅
做 zuò | to do, to make | 从事某种工作或活动；制作 | 作故
给 gěi/jǐ | to give; for | 使对方得到 | 拾结
`,
  `
钱 qián | money | 买卖时用的货币 | 线浅
块 kuài | piece; yuan (spoken) | 成团的东西；钱的单位，同“元” | 快决 | 元
元 yuán | yuan | 中国的货币单位 | 无完
买 mǎi | to buy | 拿钱换东西 | 卖头
卖 mài | to sell | 拿东西换钱 | 买实
东 dōng | east | 太阳出来的方向 | 车冻
西 xī/xi | west | 太阳落下的方向 | 四要
贵 guì | expensive | 价钱高 | 费责
便 biàn/pián | convenient; (pián) cheap | 做事容易，不费力；读 pián 时表示价钱低 | 使更 | 宜
宜 yí/yi | suitable; (in 便宜) cheap | 合适 | 宣且
`,
  `
衣 yī | clothes | 穿在身上的东西 | 农表 | 服
服 fú/fu | clothes; to serve | 衣裳；为别人做事 | 报朋
件 jiàn | measure word for clothes and matters | 量词，用于衣服、事情 | 伴体
穿 chuān | to wear | 把衣服、鞋等套在身上 | 空窗
新 xīn | new | 刚出现的，没用过的 | 亲听
大 dà | big | 面积、体积超过一般 | 太天
小 xiǎo | small | 面积、体积不及一般 | 少水
红 hóng | red | 像鲜血那样的颜色 | 江工
白 bái | white | 像雪那样的颜色 | 百自
黑 hēi | black | 像墨那样的颜色 | 墨里
`,
  `
商 shāng | trade | 买卖，做生意 | 高离
店 diàn | shop | 卖东西的地方 | 点床
开 kāi | to open | 使关着的东西不再关着 | 井升
能 néng | can, to be able to | 有力量或条件做某事 | 熊态
怎 zěn | how | 问方式、原因 | 作乍
样 yàng | appearance; kind | 形状，种类 | 洋祥
还 hái/huán | still; also | 仍然；读 huán 时表示把借的东西送回去 | 这环
就 jiù | then; right away | 立刻，马上 | 京尤
吧 ba/bā | suggestion particle | 句末语气词，表示商量或建议 | 把爸
些 xiē | some | 表示不定的数量 | 此紫
`,
  `
学 xué | to study | 获得知识或技能 | 字觉
校 xiào | school | 教学生读书的地方 | 较效
生 shēng/sheng | to be born; student | 出世；正在学习的人 | 牛星
老 lǎo | old | 年纪大 | 考孝
师 shī | teacher | 教人知识的人 | 帅归
同 tóng | same; together | 一样；一起 | 问洞
书 shū | book | 装订成册的著作 | 节韦
课 kè | class, lesson | 学校里按时间教学的单位 | 果棵 | 班
本 běn | measure word for books; root | 量词，用于书；草木的根 | 木术
班 bān | class (group of students) | 学校里按学生分成的组 | 斑玩
`,
  `
中 zhōng/zhòng | middle; (in 中国) China | 两头之间的位置 | 申甲
国 guó | country | 有土地、人民和政府的地方 | 图园
汉 hàn | Han (Chinese) | 中国人数最多的民族 | 叹仅
语 yǔ | language | 人们交流用的话 | 话吾
文 wén | writing | 写下来的字和句子 | 交父
读 dú | to read aloud | 看着文字念出声音 | 卖续
写 xiě | to write | 用笔在纸上做字 | 与马
听 tīng | to listen | 用耳朵接受声音 | 斤所
说 shuō | to speak | 用话表达意思 | 话悦
话 huà | words, speech | 说出来的、能表达意思的声音 | 活舌
`,
  `
知 zhī | to know | 了解，明白 | 和如 | 识
道 dào/dao | road; way | 路；方法 | 首通
认 rèn | to recognize | 能分辨出是谁或是什么 | 计队 | 识
识 shí/shi | knowledge; (in 认识) to know | 知道；所知道的东西 | 只职
考 kǎo | to test | 出题目问别人，看他会不会 | 老孝
试 shì | to try; test | 尝一尝，看行不行 | 式诚
题 tí | question (in an exercise) | 练习或考试中要回答的地方 | 是提
难 nán/nàn | difficult | 不容易 | 准谁
习 xí | to practise | 反复地学，练 | 刁羽
第 dì | (before a number) -th | 用在数字前，表示次序 | 弟笔
`,
  `
呢 ne/ní | question particle (and you?) | 句末语气词，用来追问 | 泥尼
外 wài | outside | 不在某个范围里面 | 处夕
边 biān/bian | side, edge | 东西周围靠外的部分 | 达过
左 zuǒ | left | 面向南时，东的一边 | 右在
右 yòu | right | 面向南时，西的一边 | 左石
北 běi | north | 面向东时，左手的那一边 | 比背
南 nán | south | 面向东时，右手的那一边 | 幸商
方 fāng/fang | direction; square | 朝向；有四个直角的形状 | 万放
近 jìn | near | 距离短 | 进斤
远 yuǎn | far | 距离长 | 元运
`,
  `
京 jīng | capital (in 北京) | 国家的首都 | 就凉
门 mén | door, gate | 房屋或院子的出入口 | 们问
房 fáng | house; room | 住人的建筑 | 方旁 | 间
间 jiān | room; between | 两者之中；屋子 | 问闻
楼 lóu | building; floor | 两层或两层以上的房子 | 搂数
公 gōng | public | 属于大家的 | 分么
园 yuán | garden, park | 种植花草树木的地方 | 圆国
医 yī | doctor; medicine | 治病的人或学问 | 区匹
院 yuàn | courtyard; institution | 房屋周围用墙围起来的空地 | 完防
路 lù | road | 人或车走的地方 | 跑落
`,
  `
走 zǒu | to walk | 一步一步向前移动 | 起足
到 dào | to arrive | 抵达某个地方 | 倒至
从 cóng | from | 表示起点 | 众丛
回 huí | to return | 由别处到原来的地方 | 四田
出 chū | to go out | 从里面到外面 | 山击
进 jìn | to enter | 从外面到里面 | 近讲
找 zhǎo | to look for | 为了见到或得到而寻求 | 我技
往 wǎng | towards | 向，朝 | 住注
坐 zuò | to sit; to take (a bus) | 把身体放在椅子等上面 | 座生
等 děng | to wait | 期待人或事物出现 | 第待
`,
  `
车 chē | vehicle | 陆地上有轮子的交通工具 | 东军
飞 fēi | to fly | 在空中移动 | 气乞
机 jī | machine; plane | 能做工作的器械 | 几林
火 huǒ | fire | 东西燃烧时发出的光和热 | 灭伙
站 zhàn | to stand; station | 直着身体立着；车停下让人上下的地方 | 占店
船 chuán | boat | 水上的交通工具 | 般沿
票 piào | ticket | 进场或坐车用的凭证 | 要漂
事 shì | matter, thing | 人做的或碰到的情况 | 争书
地 dì/de | earth, ground | 人走路的土面 | 也池
铁 tiě | iron | 一种金属，硬而结实 | 钱失
`,
  `
快 kuài | fast | 速度高 | 块决
慢 màn | slow | 速度低 | 漫曼
次 cì | time (occurrence) | 一回又一回中的一回 | 欢冷
送 sòng | to send; to give | 把东西给人 | 关选
带 dài | to bring, to take | 随身拿着 | 常帝
跟 gēn | with; to follow | 和，同 | 很根
场 chǎng/cháng | place, field | 开阔的平地 | 汤扬
别 bié | don't; other | 不要；另外的 | 另利
让 ràng | to let | 允许，使 | 认计
先 xiān | first; before | 次序在前，比别人早 | 生光
`,
  `
雨 yǔ | rain | 从云层落下的水滴 | 两雪
雪 xuě | snow | 冬天从天上落下的白色小冰花 | 雷雨
风 fēng | wind | 流动的空气 | 凤冈
晴 qíng | sunny | 天空没有云或云很少 | 睛情
阴 yīn | cloudy | 天空被云遮住，见不到太阳 | 阳阵
比 bǐ | to compare; than | 两样东西放在一起看，分出高下 | 北此
春 chūn | spring | 一年四季的第一季 | 秦奏
夏 xià | summer | 一年四季的第二季 | 复页
秋 qiū | autumn | 一年四季的第三季 | 科秒
冬 dōng | winter | 一年四季的第四季 | 各东
`,
  `
玩 wán | to play | 做游戏，娱乐 | 完现 | 打
看 kàn/kān | to look, to watch | 使视线接触人或物 | 着有 | 视
电 diàn | electricity | 一种能量，能让灯亮 | 由申
视 shì | to look at; (in 电视) TV | 瞧，观察 | 现礼
影 yǐng | shadow; film | 物体挡住光时出现的暗处 | 景彩
歌 gē | song | 可以唱的词和曲子 | 哥歇
唱 chàng | to sing | 按照曲调发出声音 | 昌喝
球 qiú | ball | 圆形的、能滚动的东西 | 求救
打 dǎ | to hit; to play | 用手或器具撞击 | 订灯
跑 pǎo | to run | 两只脚很快地交替向前 | 抱泡
`,
  `
休 xiū | to rest | 停止工作 | 体林 | 息
息 xī/xi | breath; rest | 呼吸时进出的气 | 自思
睡 shuì | to sleep | 闭上眼睛，进入休息的状态 | 垂睛 | 觉
觉 jiào/jué | sleep (in 睡觉); to feel | 睡眠；读 jué 时表示感到 | 见学
工 gōng | work | 劳动 | 土干 | 作
作 zuò | to do; to work | 做，进行某种活动 | 昨做
忙 máng | busy | 事情多，没有空 | 忘芒
得 de/dé/děi | (after a verb) how it is done | 用在动词后，表示程度或结果 | 待很
意 yì | meaning; idea | 心里的想法 | 音竟
思 sī/si | to think | 想，考虑 | 恩田
`,
  `
头 tóu/tou | head | 人身体最上面的部分 | 实买
手 shǒu | hand | 人拿东西的身体部分 | 毛才
眼 yǎn | eye | 人和动物看东西的器官 | 跟银
耳 ěr | ear | 人和动物听声音的器官 | 目取
身 shēn | body (trunk); oneself | 人或动物的躯干 | 射自 | 体
体 tǐ | body; physical form | 人或动物的整个形状 | 休本
脚 jiǎo | foot | 人和动物身体最下面接触地面的部分 | 却脑
心 xīn | heart | 人体内推动血液流动的器官 | 必沁
高 gāo | tall, high | 从下到上距离大 | 商亮
长 cháng/zhǎng | long | 两端之间距离大 | 张帐
`,
  `
病 bìng | illness | 身体不舒服、不健康 | 痛炳
药 yào | medicine | 用来治病的东西 | 约若
疼 téng | to ache | 有病或受伤时的难受感觉 | 痛冬
累 lèi | tired | 身体或心里感到疲乏 | 果系
洗 xǐ | to wash | 用水去掉脏东西 | 先选
帮 bāng | to help | 替别人做事或出力 | 邦带
因 yīn | (in 因为) because | 理由，事情发生的缘故 | 困囚 | 为
为 wèi/wéi | for; because of | 替；表示原因或目的 | 办力
所 suǒ | place; (in 所以) so | 地方；和“以”组成表示结果的词 | 斤新
最 zuì | most | 表示程度到了顶点 | 量取
`,
];
