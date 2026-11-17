// The second quarter of level 9 (docs/chinese-curriculum.md §8.3): units 4 to 6, behaviour and character, the universe,
// and the life sciences, 100 characters in 10 batches and 480 words in 48 batches. The characters are new to levels 1
// to 8 and to the first quarter, chosen first from the common characters still untaught, then from the rarest third of
// GF 0025-2021's advanced band, for what each unit's words need; the words and sentences use only the characters of
// levels 1 to 8 and those taught so far.
//
// A character line as in level 6 (../level-6/character-data-a.ts); a word line as in level 6 (../level-6/word-data-a.ts).

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches2 are the 10 character batches of units 4 to 6 of level 9, in teaching order. */
export const characterBatches2: readonly string[] = [
  // Unit 4: Behaviour and Character.
  `
挺 tǐng | upright; to straighten; quite | 直；伸直，凸出；很 | 廷艇
耸 sǒng | to tower; to shrug | 高起，直立；向上抬（肩膀） | 从聋
狠 hěn | ruthless; resolute | 凶恶，不讲情面；下定决心 | 很恨
惹 rě | to provoke; to bring on (trouble) | 引起不好的事；招人不高兴 | 若惑
耍 shuǎ | to play; to show off (a trick) | 玩；施展不好的手段 | 要耐
疯 fēng | mad, crazy | 精神不正常；言行没有约束 | 风病
愣 lèng | dazed; rash | 发呆；做事不考虑后果 | 惯愕
闷 mēn/mèn | stuffy; bored, depressed | 空气不流通；心里不舒畅 | 问闭
屑 xiè | bits, crumbs; to deign | 细小的碎末；认为值得做（多用于否定） | 肖削
倔 jué/juè | stubborn, gruff | 性子硬，不听劝 | 屈掘
`,
  `
瞪 dèng | to glare; to open (the eyes) wide | 睁大眼睛看，表示生气或吃惊 | 登澄
瞅 chǒu | to glance at | 看一下（多用于北方口语） | 秋揪 | 瞧
瞧 qiáo | to look, to see (in speech) | 看（多用于口语） | 焦憔 | 瞅
眨 zhǎ | to blink | 眼睛很快地一闭一开 | 乏泛
睁 zhēng | to open (the eyes) | 张开眼睛 | 争挣
皱 zhòu | wrinkle; to crease, to frown | 皮肤上的纹路；使出现纹路 | 皮波
捷 jié | quick, nimble; victory | 快，灵活；胜利 | 健睫
吓 xià/hè | to frighten | 使害怕 | 下虾
瞎 xiā | blind; aimlessly | 看不见；没有根据地 | 害辖
躲 duǒ | to hide; to avoid | 藏起来；避开 | 朵躯
`,
  `
蹲 dūn | to squat | 两腿弯曲，像坐但屁股不着地 | 尊遵
撞 zhuàng | to bump into, to collide | 运动中猛然碰上 | 童幢
扔 rēng | to throw; to throw away | 抛；丢掉 | 仍奶
抬 tái | to lift, to raise | 往上举；共同用手或肩膀搬 | 台治
掏 tāo | to take out (from inside) | 用手从里面拿出来 | 淘陶
撕 sī | to tear | 用手使东西分开或裂开 | 斯撒
踩 cǎi | to step on | 脚底接触地面或东西 | 采睬
扑 pū | to pounce; to throw oneself at | 用力向前冲，全身伏在上面 | 朴补
碰 pèng | to touch; to meet by chance | 物体互相接触；遇到 | 并砰
捉 zhuō | to catch | 抓住 | 促足
`,
  `
乖 guāi | well-behaved | （小孩）听话，懂事 | 乘北
懊 ào | regretful, annoyed | 后悔，烦恼 | 奥澳
爽 shuǎng | bright and clear; frank; pleasant | 明朗；直率；舒服 | 夹丧
怯 qiè | timid | 胆小，害怕 | 法却
趁 chèn | to take advantage of (a chance) | 利用时间、机会 | 珍诊
劲 jìn/jìng | strength; spirit, interest | 力气；精神，兴趣 | 经径
蠢 chǔn | stupid; clumsy | 笨，不聪明 | 春蚕
逞 chěng | to show off; to indulge | 显示自己的能力；放任 | 程呈
馋 chán | greedy (for food) | 贪吃；看到好吃的就想吃 | 谗搀
惦 diàn | to keep thinking about | 心里总想着，放不下 | 店掂
`,
  // Unit 5: The Universe.
  `
亿 yì | hundred million | 一万个万 | 忆乙
陨 yǔn | to fall from the sky | 从高空掉下来 | 员损
椭 tuǒ | oval, ellipse | 长圆形 | 随堕
霄 xiāo | sky; clouds | 天空；云 | 宵消
坠 zhuì | to fall | 从高处落下 | 队堕
渺 miǎo | tiny; vast and indistinct | 微小；远得看不清 | 秒眇
辰 chén | celestial bodies; time | 日、月、星的统称；时间 | 晨唇
黯 àn | dim, gloomy | 光线暗；心情不好 | 暗黔
曙 shǔ | daybreak | 天刚亮 | 署薯
黎 lí | multitude; dawn | 众多；天将要亮的时候 | 黍梨
`,
  `
芒 máng | awn; ray of light | 某些植物果实上的细刺；光线 | 忙盲
虹 hóng | rainbow | 雨后天空出现的彩色圆弧 | 江红
飘 piāo | to float, to flutter | 随风或在空中摆动、移动 | 票漂
坑 kēng | pit, hole | 地面凹下去的地方 | 坊抗
洒 sǎ | to sprinkle, to spill | 使水或东西分散地落下 | 酒晒
旭 xù | the rising sun | 刚出来的太阳 | 旬旦
皓 hào | bright, white | 明亮；洁白 | 浩告
昏 hūn | dusk; dizzy | 天刚黑的时候；头脑不清 | 婚氏
晃 huàng/huǎng | to sway; to dazzle; to flash past | 摇动；光很亮，使眼睛看不清；很快地闪过 | 光恍
忽 hū | suddenly; to neglect | 突然；不注意 | 勿忍
`,
  `
凌 líng | to rise high; ice; just before dawn | 升高；冰；天快亮的时候 | 陵菱
蔚 wèi | luxuriant; colourful | 草木茂盛；色彩多 | 尉慰
矮 ǎi | short (in height); low | 身材短；高度小 | 委知
旬 xún | ten days | 十天 | 句旭
昼 zhòu | daytime | 白天 | 尽画
烁 shuò | to twinkle | 光亮闪动 | 乐砾
瞄 miáo | to aim | 把眼睛集中在一点上看 | 苗描
掠 lüè | to sweep past; to plunder | 轻轻擦过；抢 | 凉谅
翔 xiáng | to circle in the air | 盘旋地飞 | 详祥
迄 qì | up to, until | 到，直到 | 讫乞
`,
  // Unit 6: Life Sciences.
  `
孵 fū | to hatch | 鸟类用体温使卵变成小鸟 | 卵浮
雌 cí | female (animal or plant) | 能产生卵子的（生物） | 雄此
髓 suǐ | marrow | 骨头中间的软组织 | 随隧
膜 mó | membrane | 生物体内像薄皮一样的组织 | 模摸
钠 nà | sodium | 一种金属元素，食盐里有它 | 纳呐
氨 ān | ammonia | 一种有刺激性气味的气体 | 安氧
醇 chún | (in chemistry) alcohol; mellow | 一类有机化合物；味道浓厚 | 淳享
藻 zǎo | algae | 生长在水里的低等植物 | 澡燥
禽 qín | bird; fowl | 鸟类的总称 | 离擒
鹅 é | goose | 一种脖子长、会游泳的家禽 | 我鹤
`,
  `
鲤 lǐ | carp | 一种常见的淡水鱼 | 里鲸
翅 chì | wing | 鸟和昆虫用来飞的部分 | 支翘
爪 zhǎo/zhuǎ | claw | 动物的脚和尖甲 | 瓜爬
趾 zhǐ | toe | 脚指头 | 址止
蚯 qiū | earthworm, the first syllable of qiūyǐn | 一种在泥土里生活的软体动物，常和“蚓”连用 | 丘蚁 | 蚓
蚓 yǐn | earthworm, the second syllable of qiūyǐn | 一种在泥土里生活的软体动物，常和“蚯”连用 | 引蚁 | 蚯
蜘 zhī | spider, the first syllable of zhīzhū | 一种会结网的小动物，常和“蛛”连用 | 知蜂
笋 sǔn | bamboo shoot | 竹子刚长出来的嫩芽 | 笔竿
蝙 biān | bat, the first syllable of biānfú | 一种会飞的哺乳动物，常和“蝠”连用 | 编偏 | 蝠
蝠 fú | bat, the second syllable of biānfú | 一种会飞的哺乳动物，常和“蝙”连用 | 福幅 | 蝙
`,
  `
莲 lián | lotus | 生长在水里、开大花的植物 | 连链
蕊 ruǐ | stamen or pistil | 花中间产生花粉或结果实的部分 | 芯心
瓣 bàn | petal; segment | 花的一片一片的部分；果实、球茎等分开的小块 | 辨辩
虾 xiā | shrimp | 生活在水里、有长须和硬壳的小动物 | 吓蝦
蟹 xiè | crab | 有硬壳、八条腿和两只大钳的水生动物 | 解懈
葵 kuí | sunflower, mallow | 一类开大花的植物，有的花盘总朝着太阳 | 癸发
鸽 gē | pigeon, dove | 一种常见的鸟，可以训练来送信 | 合鸭
蜻 qīng | dragonfly, the first syllable of qīngtíng | 一种翅膀透明、飞得很快的昆虫，常和“蜓”连用 | 清晴 | 蜓
蜓 tíng | dragonfly, the second syllable of qīngtíng | 一种翅膀透明、飞得很快的昆虫，常和“蜻”连用 | 庭挺 | 蜻
隆 lóng | grand; to bulge; prosperous | 盛大；凸起；兴旺 | 降陆
`,
];

/** wordBatches2 are the 48 word batches of units 4 to 6 of level 9, sixteen a unit, in teaching order. */
export const wordBatches2: readonly LevelWordBatch[] = [
  // Unit 4: Behaviour and Character.
  {
    theme: ["Foolish and Clever", "傻和聪明"],
    data: `
傻瓜 | shǎ guā | fool, silly thing | 不聪明的人（常用来开玩笑） | 你这个＿＿，下这么大的雨还在外面等我！
傻笑 | shǎ xiào | to grin foolishly | 没有原因地一直笑 | 他收到录取通知书以后，一个人坐在那里＿＿。
装傻 | zhuāng shǎ | to play dumb | 故意装作什么都不知道 | 妈妈问是谁打破了花瓶，弟弟在一边＿＿，说自己什么也没看见。
傻乎乎 | shǎ hū hū | silly-looking, naive | 样子天真，不太懂事 | 那只小狗＿＿的，一直追着自己的尾巴转圈。
傻眼 | shǎ yǎn | to be stunned | 遇到意外的事，一下子不知道怎么办 | 他到了机场才发现护照没带，一下子＿＿了。
犯傻 | fàn shǎ | to act foolishly | 一时糊涂，做不聪明的事 | 别＿＿了，这么重要的考试，怎么能一点也不复习？
愚蠢 | yú chǔn | stupid | 很笨，不明白事理 | 相信这种骗人的广告，是一种＿＿的行为。
蠢事 | chǔn shì | foolish act | 不聪明的行为 | 他常常后悔自己年轻时做过的那些＿＿。
自作聪明 | zì zuò cōng míng | to think oneself clever | 以为自己聪明而随便行事 | 他＿＿，没看说明书就动手安装，结果装错了。 | 耍小聪明
耍小聪明 | shuǎ xiǎo cōng míng | to play petty tricks | 用不正当的小手段占便宜 | 考试的时候＿＿，把答案写在手上，是不诚实的。 | 自作聪明
`,
  },
  {
    theme: ["Temper", "脾气"],
    data: `
急躁 | jí zào | impatient | 遇事不冷静，想马上做成 | 做实验不能＿＿，要一步一步地来。 | 浮躁 毛躁
暴躁 | bào zào | hot-tempered | 很容易发火 | 他脾气＿＿，一点小事就大喊大叫。
浮躁 | fú zào | restless, unsettled | 不踏实，静不下心来 | 做学问要沉得住气，不能＿＿。 | 急躁
毛躁 | máo zao | careless and hasty | 性子急，做事粗心 | 他做事很＿＿，作业里常常有写错的字。 | 急躁
戒骄戒躁 | jiè jiāo jiè zào | to guard against pride and impatience | 不骄傲，也不急躁 | 比赛赢了以后，教练提醒队员们要＿＿，继续努力。
好脾气 | hǎo pí qi | good temper | 性情温和，不容易生气 | 王老师是个＿＿，从来不对学生发火。
耍脾气 | shuǎ pí qi | to throw a tantrum | 故意发脾气 | 小妹妹没买到玩具，就在商店门口＿＿，不肯走。
倔脾气 | juè pí qi | stubborn temper | 性子硬，不容易改变主意 | 爷爷是个＿＿，他决定的事谁也劝不动。
急性子 | jí xìng zi | impatient person | 性情急的人 | 他是个＿＿，等公交车等了五分钟就不耐烦了。
慢性子 | màn xìng zi | unhurried person | 做事不慌不忙、动作慢的人 | 她是个＿＿，吃一顿饭要一个小时。
`,
  },
  {
    theme: ["Moods", "心情"],
    data: `
沉闷 | chén mèn | dull, oppressive | 气氛不活跃，让人不舒畅 | 会议开了三个小时，大家都不说话，十分＿＿。
纳闷 | nà mèn | puzzled | 感到奇怪，不明白 | 我很＿＿，他昨天还好好的，今天怎么没来上课？
解闷 | jiě mèn | to relieve boredom | 消除烦闷 | 奶奶一个人在家，养了一只小猫＿＿。
闷闷不乐 | mèn mèn bú lè | unhappy, in low spirits | 心里不痛快 | 自从好朋友搬走以后，他整天＿＿。
生闷气 | shēng mèn qì | to sulk | 心里生气，却不说出来 | 有什么不满就说出来，别一个人＿＿。
闷声不响 | mēn shēng bù xiǎng | to keep silent | 一句话也不说 | 他＿＿地吃完饭，就回自己房间了。
烦躁 | fán zào | irritable, fretful | 心里烦，不安静 | 天气又热又吵，让人感到很＿＿。
惦记 | diàn ji | to keep thinking about | 心里总想着，放不下 | 他在外地上大学，妈妈天天＿＿着他。
懊悔 | ào huǐ | to regret | 做错了事，心里后悔 | 他很＿＿当初没有听老师的话，错过了报名的时间。 | 懊恼
懊恼 | ào nǎo | upset, vexed | 心里别扭，烦恼 | 他刚出门就下起了大雨，偏偏又没带雨衣，心里很＿＿。 | 懊悔
`,
  },
  {
    theme: ["Firm and Stubborn", "坚定和固执"],
    data: `
倔强 | jué jiàng | unbending | 性格刚强，不肯低头 | 她虽然摔倒了好几次，却＿＿地站起来继续跑。
认死理 | rèn sǐ lǐ | to stick rigidly to one idea | 认定一个道理，不知道变通 | 他太＿＿了，规定上没写的事，一件也不肯做。 | 死心眼 一根筋
死心眼 | sǐ xīn yǎn | one-track mind | 想法固执，不会灵活思考 | 这条路走不通就换一条，别那么＿＿。 | 认死理 一根筋
一根筋 | yì gēn jīn | single-minded | 只朝一个方向想，不会转弯 | 他做事＿＿，一旦开始就非做完不可，连饭都忘了吃。 | 认死理 死心眼
咬定 | yǎo dìng | to insist on (a statement) | 说定了，不改口 | 他一口＿＿那天自己在家，没有出门。
咬紧牙关 | yǎo jǐn yá guān | to grit one's teeth | 用最大的努力忍住痛苦 | 最后一公里，她＿＿，终于跑到了终点。
发狠 | fā hěn | to make a grim resolve | 下定决心，用尽力气 | 他＿＿要在一年内学会游泳，每天都去游泳馆练习。
狠心 | hěn xīn | heartless; to steel oneself | 心肠硬，不心软 | 为了让孩子学会独立，父母只好＿＿让他一个人去外地上学。
逞强 | chěng qiáng | to try to do more than one can | 明明做不到却硬要去做 | 你发烧了就好好休息，别＿＿去上课。
较劲 | jiào jìn | to compete, to vie with | 比高低，互不服气 | 两个人一直在暗中＿＿，看谁的成绩更好。
`,
  },
  {
    theme: ["Looking", "看的样子"],
    data: `
瞪眼 | dèng yǎn | to glare | 睁大眼睛看人，表示不满 | 他刚想插话，妈妈就对他＿＿，他只好不说了。
干瞪眼 | gān dèng yǎn | to look on helplessly | 只能着急，没有办法 | 火车开走了，晚到的他只能站在站台上＿＿。
目瞪口呆 | mù dèng kǒu dāi | dumbfounded | 吃惊得说不出话来 | 魔术师从空帽子里拿出一只小鸟，观众们看得＿＿。
瞅见 | chǒu jiàn | to catch sight of | 看到（多用于北方口语） | 我刚才在超市门口＿＿你哥哥了。 | 瞧见
瞅准 | chǒu zhǔn | to watch for (the right moment) | 看准时机 | 守门员＿＿机会，一把抓住了球。
瞧见 | qiáo jiàn | to see | 看见（多用于口语） | 你＿＿我的眼镜了吗？我找了半天也没找到。 | 瞅见
瞧不起 | qiáo bu qǐ | to look down on | 看不起，轻视 | 不要＿＿做小生意的人，他们也很辛苦。
走着瞧 | zǒu zhe qiáo | wait and see | 等着看结果（常带不服气的语气） | 你说我学不会？那我们＿＿！
眨眼 | zhǎ yǎn | to blink; to wink | 眼睛很快地一闭一开 | 灯光太亮，他不停地＿＿。
一眨眼 | yì zhǎ yǎn | in the blink of an eye | 时间极短 | 时间过得真快，＿＿就到年底了。
`,
  },
  {
    theme: ["Faces", "表情"],
    data: `
睁眼 | zhēng yǎn | to open one's eyes | 张开眼睛 | 早上一＿＿，他就发现外面下雪了。
眼睁睁 | yǎn zhēng zhēng | helplessly (watching) | 看着不好的事发生，却没有办法 | 他＿＿地看着风把气球吹走了。
睁一只眼闭一只眼 | zhēng yì zhī yǎn bì yì zhī yǎn | to turn a blind eye | 假装没看见，不去管 | 对这种违反规定的事，管理员不能＿＿。
皱眉 | zhòu méi | to frown | 眉头收紧，表示不满或发愁 | 看到儿子的成绩单，爸爸＿＿说：“怎么又退步了？”
皱纹 | zhòu wén | wrinkle | 皮肤上的纹路 | 爷爷的额头上有很多＿＿。
不屑 | bú xiè | disdainful | 认为不值得，看不起 | 听了他的话，她露出了＿＿的表情。
发愣 | fā lèng | to be in a daze | 呆呆地出神 | 上课的时候，他看着窗外＿＿，连老师叫他都没听见。 | 愣神
愣住 | lèng zhù | to be stunned into stillness | 突然吃惊，一下子不动了 | 听到这个意外的消息，大家都＿＿了。
愣神 | lèng shén | to be lost in thought for a moment | 一下子走了神 | 他一＿＿，手里的杯子就掉在了地上。 | 发愣
耸肩 | sǒng jiān | to shrug | 把两个肩膀向上抬一下，表示不知道或无所谓 | 我问他明天的安排，他只是＿＿，什么也没说。
`,
  },
  {
    theme: ["Fear and Hiding", "害怕和躲藏"],
    data: `
惊吓 | jīng xià | fright | 意外的刺激使人害怕 | 小猫受了＿＿，躲在床底下一直不肯出来。
吓人 | xià rén | frightening | 使人害怕 | 那部电影太＿＿了，我看了一半就不敢看了。
恐吓 | kǒng hè | to threaten | 用威胁的话或手段使人害怕 | 用＿＿的方法逼人交出钱财，是违法的。
吓一跳 | xià yí tiào | to be startled | 突然受到惊吓 | 他从门后面跳出来，把我＿＿。
躲藏 | duǒ cáng | to hide | 把自己藏起来，不让人发现 | 小猫＿＿在草地里，一动也不动。
躲避 | duǒ bì | to avoid, to shelter from | 有意离开或避开 | 地震时，要快速找安全的地方＿＿。 | 躲闪
躲闪 | duǒ shǎn | to dodge | 迅速让开身体 | 球飞过来的时候，他来不及＿＿，被打中了肩膀。 | 躲避
东躲西藏 | dōng duǒ xī cáng | to hide here and there | 到处躲藏 | 做了坏事的人，只能每天＿＿，过不了安心的日子。
悄悄 | qiāo qiāo | quietly | 声音很低或没有声音地 | 妹妹睡着了，我们＿＿地走出了房间。
悄无声息 | qiǎo wú shēng xī | without a sound | 一点儿声音也没有 | 夜里下了一场大雪，＿＿地把整个城市盖住了。
`,
  },
  {
    theme: ["Muddled", "糊里糊涂"],
    data: `
瞎说 | xiā shuō | to talk nonsense | 没有根据地乱说 | 没有调查清楚，就别＿＿。 | 瞎编
瞎猜 | xiā cāi | to guess wildly | 没有根据地猜 | 这道题要认真计算，不能＿＿。
瞎忙 | xiā máng | to be busy to no purpose | 忙来忙去，没有成果 | 做事要先有计划，不然整天＿＿，什么也做不好。
瞎编 | xiā biān | to make up (a story) | 凭空编造 | 这个故事是他＿＿的，根本没有发生过。 | 瞎说
瞎操心 | xiā cāo xīn | to worry needlessly | 为不需要担心的事操心 | 孩子已经长大了，你就别＿＿了。
糊涂 | hú tu | muddled, confused | 不明白事理，头脑不清楚 | 他年纪大了，有时候有点＿＿，连眼镜放在哪儿都忘了。 | 迷糊
稀里糊涂 | xī li hú tú | in a muddle | 什么都不清楚，马马虎虎地 | 他＿＿地签了合同，后来才发现上了当。
丢三落四 | diū sān là sì | scatterbrained | 做事马虎，不是忘了这个就是忘了那个 | 他做事总是＿＿，今天又把作业本忘在家里了。 | 马大哈
迷糊 | mí hu | dazed, half-asleep | 神志或眼睛模糊不清 | 他刚睡醒，还有点＿＿，把牙膏当成了洗面奶。 | 糊涂
马大哈 | mǎ dà hā | careless person | 粗心大意的人 | 他是个＿＿，出门常常忘了带东西。 | 丢三落四
`,
  },
  {
    theme: ["Body Movements", "身体动作"],
    data: `
蹲下 | dūn xià | to squat down | 两腿弯曲，身体低下去 | 他＿＿来，帮小女孩系好了鞋带。
抬头 | tái tóu | to raise one's head | 把头仰起来 | 他＿＿一看，天上有一道美丽的光。
敏捷 | mǐn jié | nimble, agile | 动作迅速而灵活 | 小猴子动作＿＿，一下子就爬到了树顶上。
扔掉 | rēng diào | to throw away | 丢弃不要 | 过期的食物要及时＿＿，不能再吃了。
扑通 | pū tōng | splash, thud | 东西落地或落水的声音 | 他＿＿一声跳进了河里。
踩踏 | cǎi tà | to trample | 用脚踩 | 请不要＿＿草地。
挺胸 | tǐng xiōng | to throw out one's chest | 把胸部挺起来 | 站队的时候要抬头＿＿，不要弯腰。
撞击 | zhuàng jī | to strike, to collide with | 物体猛烈地互相碰在一起 | 海浪不停地＿＿着岸边的石头。
掏出 | tāo chū | to pull out (from a pocket) | 从口袋等里面拿出来 | 他从口袋里＿＿一张纸条，递给了我。
撒腿 | sā tuǐ | to take to one's heels | 迈开腿跑 | 放学铃声一响，孩子们就＿＿往外跑。
`,
  },
  {
    theme: ["Chances and Meetings", "碰见和机会"],
    data: `
碰见 | pèng jiàn | to run into (someone) | 意外地遇到 | 我在书店＿＿了小学时的老师。 | 撞见
碰巧 | pèng qiǎo | by chance | 正好，凑巧 | 我想找他，＿＿他也来了。
碰面 | pèng miàn | to meet up | 见面 | 我们约好下午三点在公园门口＿＿。
碰运气 | pèng yùn qi | to try one's luck | 试着看运气好不好 | 他没有准备就去考试，完全是去＿＿。
碰壁 | pèng bì | to be rebuffed | 遇到阻碍，事情办不成 | 他找工作处处＿＿，后来决定先去学一门技术。 | 碰钉子
碰钉子 | pèng dīng zi | to meet with a rebuff | 遭到拒绝或批评 | 他去请经理帮忙，结果＿＿了，经理一句话就拒绝了他。 | 碰壁
撞见 | zhuàng jiàn | to catch (someone) unexpectedly | 不想见到时正好碰上 | 他偷偷在教室吃零食，被老师＿＿了。 | 碰见
趁机 | chèn jī | to seize the chance | 利用机会 | 下课了，他＿＿向老师请教了一个问题。
趁早 | chèn zǎo | as early as possible | 抓紧时间，提前 | 这个计划不行，我们还是＿＿改一改吧。
趁热打铁 | chèn rè dǎ tiě | to strike while the iron is hot | 抓住有利时机，马上去做 | 学过的知识要＿＿，当天就复习。
`,
  },
  {
    theme: ["Play and Tricks", "玩和花招"],
    data: `
玩耍 | wán shuǎ | to play | 游戏，玩 | 孩子们在草地上快乐地＿＿。
捉迷藏 | zhuō mí cáng | hide-and-seek | 一个人找、其他人躲的游戏 | 小时候我们常常在院子里玩＿＿。
扑克 | pū kè | playing cards | 一种纸牌 | 下雨天，一家人坐在一起打＿＿。
疯玩 | fēng wán | to play wildly | 毫无约束地尽情玩 | 放假了，孩子们在外面＿＿了一整天，回到家累得倒头就睡。
耍花招 | shuǎ huā zhāo | to play tricks | 用狡猾的手段骗人 | 他想＿＿骗大家，可是很快就被识破了。
耍赖 | shuǎ lài | to go back on one's word | 不讲道理，不认账 | 说好了输的人请客，你可不能＿＿。
捉弄 | zhuō nòng | to tease, to make fun of | 故意使人难堪 | 他喜欢＿＿同学，把同学的书包藏起来。
卖弄 | mài nong | to show off | 故意在别人面前显示自己 | 他总喜欢在别人面前＿＿自己的知识。
摆弄 | bǎi nong | to fiddle with | 反复地用手拨动、移动 | 他一有空就＿＿那台旧收音机，想把它修好。
撒欢 | sā huān | to frolic | 高兴得又跑又跳 | 小狗一到草地上就＿＿地跑起来。
`,
  },
  {
    theme: ["Getting into Trouble", "惹麻烦"],
    data: `
惹事 | rě shì | to make trouble | 引起麻烦或争端 | 他在外面从来不＿＿，大家都说他是个好孩子。 | 惹祸
招惹 | zhāo rě | to provoke, to tease | 用言行引起对方反应 | 这条狗很凶，你别去＿＿它。
惹祸 | rě huò | to bring disaster on oneself | 引起灾祸 | 玩火很容易＿＿，一不小心就会引起火灾。 | 惹事
惹是生非 | rě shì shēng fēi | to stir up trouble | 到处制造麻烦 | 他小时候常常＿＿，长大后变得懂事多了。
惹不起 | rě bu qǐ | cannot afford to offend | 不敢得罪 | 他脾气那么大，谁也＿＿。
冲撞 | chōng zhuàng | to offend | 说话、做事使对方不高兴 | 他说话太直，不小心＿＿了客人。
抬杠 | tái gàng | to argue for the sake of it | 无意义地争辩 | 他总喜欢跟人＿＿，你说东他偏说西。
撕破脸 | sī pò liǎn | to have an open falling-out | 公开闹翻 | 两家公司为了合同的事＿＿，最后打起了官司。
耍嘴皮子 | shuǎ zuǐ pí zi | to be all talk | 只会说，不会做 | 光＿＿没有用，要拿出实际行动来。
撒气 | sā qì | to vent one's anger | 把怒气发泄到别人身上 | 你考得不好，别拿弟弟＿＿。
`,
  },
  {
    theme: ["Frank and Open", "爽快和直率"],
    data: `
爽快 | shuǎng kuai | straightforward; readily | 说话做事干脆，不拖延 | 我请他帮忙，他很＿＿地答应了。
豪爽 | háo shuǎng | bold and generous | 性格开朗，大方 | 他为人＿＿，常常请朋友们吃饭。
直爽 | zhí shuǎng | forthright | 性格直率，有话就说 | 她性格＿＿，有什么意见都会当面说出来。 | 心直口快
爽朗 | shuǎng lǎng | hearty, cheerful | 开朗，令人愉快 | 院子里传来了爷爷＿＿的笑声。
乖巧 | guāi qiǎo | sweet and clever (of a child) | 听话，招人喜爱 | 这个小女孩很＿＿，见到客人总是先问好。
心直口快 | xīn zhí kǒu kuài | outspoken | 性情直爽，有话就说 | 她＿＿，说话有时会伤人，其实没有坏心。 | 直爽
直肠子 | zhí cháng zi | straight-talking person | 说话直，不会拐弯的人 | 他是个＿＿，心里想什么就说什么。
刀子嘴豆腐心 | dāo zi zuǐ dòu fu xīn | sharp tongue but soft heart | 说话厉害，心却很软 | 奶奶是＿＿，嘴上骂我，心里却最疼我。
老好人 | lǎo hǎo rén | someone who never offends | 不讲原则、谁也不得罪的人 | 他是个＿＿，谁也不得罪，从不说别人的不是。
自来熟 | zì lái shú | someone who is instantly friendly | 第一次见面就像老朋友一样亲热的人 | 他是个＿＿，刚到新班级第一天就和大家打成了一片。
`,
  },
  {
    theme: ["Faults of Character", "性格的弱点"],
    data: `
小心眼 | xiǎo xīn yǎn | petty, narrow-minded | 心胸狭窄 | 别那么＿＿，人家只是开个玩笑。
好面子 | hào miàn zi | concerned about face | 很怕丢面子 | 他＿＿，明明不懂，却不愿意问别人。
胆怯 | dǎn qiè | timid | 胆子小，害怕 | 第一次上台演讲，他有些＿＿，声音很小。
墙头草 | qiáng tóu cǎo | fence-sitter | 没有立场、哪边强就倒向哪边的人 | 他是个＿＿，谁的力量大就听谁的。
逞能 | chěng néng | to show off one's ability | 故意显示自己有本事 | 他为了在同学面前＿＿，一个人搬了两张桌子，结果扭伤了腰。
傲慢 | ào màn | arrogant | 看不起别人，对人没有礼貌 | 他的态度很＿＿，同事们都不喜欢他。
任性 | rèn xìng | wilful | 只按自己的想法做，不顾别人 | 孩子想要什么就给什么，会养成＿＿的性格。
撒娇 | sā jiāo | to act like a spoiled child | 依仗宠爱，故意做出可爱的样子 | 小女儿抱着爸爸的手臂＿＿，想要一个新玩具。
嘴馋 | zuǐ chán | fond of snacks | 喜欢吃好吃的东西 | 他特别＿＿，口袋里总装着零食。
眼馋 | yǎn chán | envious (of what one sees) | 看见好东西很想要 | 看着同学的新球鞋，他很＿＿。
`,
  },
  {
    theme: ["Effort and Spirit", "干劲"],
    data: `
起劲 | qǐ jìn | energetically | 情绪高，做得很卖力 | 孩子们正玩得＿＿，谁也不想回家。 | 带劲
带劲 | dài jìn | exciting, great | 有意思，让人兴奋 | 这场球赛打得真＿＿，观众们一直在欢呼。 | 起劲
干劲 | gàn jìn | drive, enthusiasm | 做事的劲头 | 新来的员工＿＿很足，每天都很早到公司。 | 劲头
使劲 | shǐ jìn | to exert oneself | 用力 | 瓶盖太紧了，他＿＿拧了好几下才打开。
劲头 | jìn tóu | energy, vigour | 力气；积极的情绪 | 看他学习的那股＿＿，一定能考好。 | 干劲
费劲 | fèi jìn | strenuous | 花很多力气 | 这个箱子太重，搬起来很＿＿。
差劲 | chà jìn | poor, disappointing | 质量或品质不好 | 这家饭店的服务太＿＿了，等了一个小时才上菜。
没劲 | méi jìn | boring | 没有意思 | 这部电影太＿＿了，我看到一半就睡着了。
挺身而出 | tǐng shēn ér chū | to step forward bravely | 在困难或危险的时候勇敢地站出来 | 看到有人落水，他＿＿，跳进河里把人救了上来。
加把劲 | jiā bǎ jìn | to make an extra effort | 再用一些力气 | 只有最后一题了，大家再＿＿！
`,
  },
  {
    theme: ["Mixing and Muddling", "混和弄"],
    data: `
混日子 | hùn rì zi | to muddle along | 没有目标，马马虎虎地生活 | 年轻人要有理想，不能整天＿＿。
蒙混过关 | méng hùn guò guān | to get by under false pretences | 用欺骗的手段通过检查 | 作业抄别人的，想＿＿，结果被老师发现了。
混为一谈 | hùn wéi yì tán | to lump together | 把不同的事物当成同样的 | 学习好和品德好是两回事，不能＿＿。
鱼目混珠 | yú mù hùn zhū | to pass off fakes as genuine | 用假的冒充真的 | 市场上有些商家＿＿，用假货冒充名牌。
弄错 | nòng cuò | to get wrong | 搞错 | 对不起，我＿＿了你的名字。
弄清 | nòng qīng | to clarify | 搞明白 | 遇到问题，要先＿＿原因，再想办法解决。
弄虚作假 | nòng xū zuò jiǎ | to practise fraud | 用虚假的东西骗人 | 做科学研究不能＿＿，数据必须真实。
糊弄 | hù nong | to fool; to do carelessly | 欺骗；马马虎虎地做 | 这份报告是你随便写来＿＿我的吧？
混乱 | hùn luàn | chaotic | 没有秩序 | 停电以后，地铁站里一片＿＿。
弄坏 | nòng huài | to break (something) | 使东西坏掉 | 小心点，别把借来的相机＿＿了。
`,
  },
  // Unit 5: The Universe.
  {
    theme: ["The Scale of the Universe", "宇宙的尺度"],
    data: `
亿万 | yì wàn | hundreds of millions, countless | 数量极多 | 这场比赛通过电视传给了全世界＿＿观众。 | 数以亿计
数以亿计 | shù yǐ yì jì | in the hundreds of millions | 用亿来计算，形容极多 | 银河系里的恒星＿＿，太阳只是其中普通的一颗。 | 亿万
亿万年 | yì wàn nián | hundreds of millions of years | 非常非常长的时间 | 地球经过了＿＿的变化，才形成了今天的样子。
十亿 | shí yì | a billion | 一千个一百万 | 中国的人口超过了＿＿。
渺小 | miǎo xiǎo | tiny, insignificant | 非常小，微不足道 | 和广阔的宇宙相比，人类显得十分＿＿。
浩渺 | hào miǎo | vast, boundless | 广阔无边 | 站在海边，望着＿＿的大海，他的心情一下子开阔了。 | 茫茫
茫茫 | máng máng | boundless and indistinct | 广阔，看不到边 | 在＿＿宇宙中，地球只是一个小小的蓝点。 | 浩渺
天文单位 | tiān wén dān wèi | astronomical unit | 计量天体距离的单位，约等于地球到太阳的平均距离 | 一个＿＿大约是一亿五千万公里。
光速 | guāng sù | speed of light | 光传播的速度 | ＿＿大约是每秒三十万公里，从太阳到地球的光要走八分多钟。
宇宙膨胀 | yǔ zhòu péng zhàng | expansion of the universe | 宇宙不断变大的现象 | 远处的星系都在离我们而去，这是＿＿的证据。
`,
  },
  {
    theme: ["Falling from the Sky", "从天而降"],
    data: `
陨石 | yǔn shí | meteorite | 从太空落到地面的石头 | 博物馆里展出了一块从天上掉下来的＿＿，已经有四十多亿年的历史。
陨落 | yǔn luò | to fall from the sky; to pass away (of a great person) | 天体从高空落下；比喻重要人物去世 | 这位伟大的科学家去世了，人们说一颗巨星＿＿了。
陨石坑 | yǔn shí kēng | impact crater | 太空中的石头撞击地面形成的坑 | 美国亚利桑那州有一个巨大的＿＿，是五万年前一块太空中的石头撞出来的。
坠落 | zhuì luò | to fall | 从高处落下 | 一块大石头从山上＿＿下来，砸坏了路边的护栏。 | 下坠
滑翔 | huá xiáng | to glide | 不用动力，借着气流在空中斜着飞行 | 老鹰在高空中慢慢地＿＿，寻找地上的猎物。
下坠 | xià zhuì | to drop, to sink | 往下落 | 气球漏气以后，慢慢地向地面＿＿。 | 坠落
流星雨 | liú xīng yǔ | meteor shower | 很多流星在短时间内划过天空的现象 | 每年八月，北半球都能看到英仙座＿＿。
飘落 | piāo luò | to drift down | 轻轻地在空中飘着落下来 | 雪花轻轻地＿＿在她的头发上。
掠过 | lüè guò | to sweep past | 很快地从旁边或上面擦过 | 一只鸟从水面上轻轻＿＿。
太空垃圾 | tài kōng lā jī | space debris | 留在太空中没有用的人造物体 | 报废的卫星和火箭的残片变成了＿＿，威胁着正在工作的卫星。
`,
  },
  {
    theme: ["The Planets", "行星"],
    data: `
木星 | mù xīng | Jupiter | 太阳系中最大的行星 | ＿＿是太阳系里个头最大的行星，比其他七颗行星加起来还要大。
土星 | tǔ xīng | Saturn | 太阳系中第六颗行星，有明显的光环 | ＿＿周围有一圈美丽的光环，用小望远镜就能看到。
金星 | jīn xīng | Venus | 太阳系中第二颗行星 | 除了月亮以外，夜空中最亮的天体是＿＿。
水星 | shuǐ xīng | Mercury | 离太阳最近的行星 | ＿＿离太阳最近，绕太阳一圈只要八十八天。
天王星 | tiān wáng xīng | Uranus | 太阳系中第七颗行星 | ＿＿的自转轴倾斜得很厉害，几乎是“躺着”绕太阳转的。
海王星 | hǎi wáng xīng | Neptune | 太阳系中离太阳最远的行星 | ＿＿是先用数学计算预言出来、后来才被找到的行星。
冥王星 | míng wáng xīng | Pluto | 一颗矮行星，从前被看作第九大行星 | 二零零六年以后，＿＿不再被算作大行星，而被叫作矮行星。
土星环 | tǔ xīng huán | rings of Saturn | 围绕土星的光环 | ＿＿主要是由大大小小的冰块和石块组成的。
行星环 | xíng xīng huán | planetary ring | 围绕行星的环 | 不只土星有＿＿，木星、天王星和海王星也有，只是很暗。
小行星带 | xiǎo xíng xīng dài | asteroid belt | 火星和木星轨道之间小行星集中的地方 | 火星和木星之间的＿＿里，有数不清的大小不一的天体。
`,
  },
  {
    theme: ["Orbits", "轨道和引力"],
    data: `
椭圆 | tuǒ yuán | ellipse | 长圆形 | 行星绕太阳运动的轨道不是正圆，而是＿＿。
自转 | zì zhuàn | rotation (of a planet) | 天体绕着自己的轴转动 | 地球＿＿一周大约是二十四小时，于是有了白天和黑夜。
公转 | gōng zhuàn | revolution (in orbit) | 一个天体绕着另一个天体转动 | 地球绕太阳＿＿一周是一年。
公转轨道 | gōng zhuàn guǐ dào | orbit | 天体公转时走的路线 | 八大行星的＿＿差不多都在同一个平面上。
近地点 | jìn dì diǎn | perigee | 月亮或卫星离地球最近的点 | 月亮运行到＿＿附近时如果正好是满月，看起来会特别大。
远地点 | yuǎn dì diǎn | apogee | 月亮或卫星离地球最远的点 | 月亮在＿＿的时候，离地球大约四十万公里。
地轴 | dì zhóu | Earth's axis | 地球自转的轴 | 因为＿＿是倾斜的，地球上才有了四季的变化。
万有引力 | wàn yǒu yǐn lì | universal gravitation | 任何两个物体之间互相吸引的力 | 牛顿提出了＿＿定律，解释了行星为什么绕太阳运动。
引力波 | yǐn lì bō | gravitational wave | 时空的波动 | 二零一五年，科学家第一次直接探测到了＿＿。
引潮力 | yǐn cháo lì | tide-generating force | 月亮和太阳引起潮水涨落的力 | 海水每天涨落两次，主要是由月亮的＿＿造成的。
`,
  },
  {
    theme: ["The Life of Stars", "恒星的一生"],
    data: `
白矮星 | bái ǎi xīng | white dwarf | 体积小、密度很大的暗淡恒星 | ＿＿的体积和地球差不多，质量却可以和太阳差不多。
红巨星 | hóng jù xīng | red giant | 体积巨大、颜色发红的老年恒星 | 大约五十亿年后，太阳会膨胀成一颗＿＿。
中子星 | zhōng zǐ xīng | neutron star | 密度极大的恒星残骸 | ＿＿的密度极大，一块方糖大小的物质就有上亿吨重。
超新星 | chāo xīn xīng | supernova | 恒星发生大爆炸，突然变得极亮 | 宋代的天文学家记录过一次＿＿爆发，那颗星连白天都能看见。
双星 | shuāng xīng | binary star | 互相绕着转的两颗恒星 | 有些星星看起来是一颗，其实是一对＿＿。
星团 | xīng tuán | star cluster | 聚在一起的一群恒星 | 用望远镜一看，这团模糊的光原来是由很多恒星组成的＿＿。
星云 | xīng yún | nebula | 由气体和尘埃组成的云雾状天体 | 新的恒星就是在＿＿里由气体和尘埃聚集而形成的。
恒星系 | héng xīng xì | star system | 恒星和围绕它运行的天体组成的系统 | 太阳系就是一个以太阳为中心的＿＿。
星等 | xīng děng | magnitude (of a star) | 表示星星亮度的等级 | ＿＿的数字越小，星星就越亮。
亮度 | liàng dù | brightness | 明亮的程度 | 这台灯可以调节＿＿，看书的时候可以调亮一点。
`,
  },
  {
    theme: ["The Night Sky", "星空"],
    data: `
夜空 | yè kōng | night sky | 夜晚的天空 | 晴朗的＿＿中，星星一闪一闪的。
星光 | xīng guāng | starlight | 星星的光 | 我们借着微弱的＿＿，在山路上慢慢地走。
闪烁 | shǎn shuò | to twinkle | 光亮一闪一闪地 | 远处的灯光在雨中＿＿着。
北极星 | běi jí xīng | Polaris, the Pole Star | 正北方天空中的一颗亮星 | 在野外迷路的时候，可以靠＿＿找到北方。
北斗七星 | běi dǒu qī xīng | the Big Dipper | 北方天空中排成长柄形状的七颗亮星 | ＿＿是北方天空中很亮的七颗星，沿着它可以找到北极星。
星座 | xīng zuò | constellation | 天文学家把星空分成的区域 | 天文学家把整个星空分成了八十八个＿＿。
银河系 | yín hé xì | the Milky Way galaxy | 太阳系所在的星系 | 太阳只是＿＿里一千多亿颗恒星中的一颗。
天河 | tiān hé | the Milky Way (as seen in the sky) | 夜空中看到的银河 | 夏天的夜晚，在乡下能看到一条白色的＿＿横在天上。
星图 | xīng tú | star chart | 画着星星位置的图 | 他拿着一张＿＿，在夜空中寻找各个星座。
星辰 | xīng chén | the stars | 星星的总称 | 古人仰望满天的＿＿，想象出了许多美丽的传说。
`,
  },
  {
    theme: ["The Sun and the Moon", "太阳和月亮"],
    data: `
太阳黑子 | tài yáng hēi zǐ | sunspot | 太阳表面温度较低、看起来较暗的区域 | ＿＿多的年份，太阳的活动也比较强烈。
太阳风 | tài yáng fēng | solar wind | 太阳向外喷出的带电粒子流 | 极光是＿＿带来的粒子进入地球大气层时发出的光。
日全食 | rì quán shí | total solar eclipse | 月亮完全挡住太阳的现象 | 发生＿＿的时候，白天会突然变得像夜晚一样黑。 | 日环食
日环食 | rì huán shí | annular solar eclipse | 月亮挡住太阳中间，四周留下一圈光环的现象 | 发生＿＿时，太阳像一个金色的圆环挂在天上。 | 日全食
月食 | yuè shí | lunar eclipse | 地球挡住太阳照向月亮的光的现象 | 发生＿＿的时候，地球的影子落在了月亮上。
满月 | mǎn yuè | full moon | 圆圆的月亮 | 中秋节的晚上，天上挂着一轮＿＿。
新月 | xīn yuè | new moon | 农历月初的月亮 | 农历每月初一前后是＿＿，在地球上几乎看不到月亮。
月相 | yuè xiàng | phase of the moon | 月亮圆缺的样子 | 月亮从圆到缺、又从缺到圆，这种变化叫作＿＿变化。
天狗吃月亮 | tiān gǒu chī yuè liang | the heavenly dog eating the moon | 古人对月食的说法 | 古人不明白月食的原因，以为是＿＿。
环形山 | huán xíng shān | lunar crater | 月球表面的圆形凹地 | 用望远镜看月亮，可以看到表面有很多圆形的＿＿。
`,
  },
  {
    theme: ["Day and Night", "昼夜"],
    data: `
昼夜 | zhòu yè | day and night | 白天和黑夜 | 工人们＿＿不停地工作，终于按时修好了大桥。
极昼 | jí zhòu | polar day | 极地太阳整天不落的现象 | 夏天的北极会出现＿＿，太阳整天都不落下去。
旭日东升 | xù rì dōng shēng | the morning sun rising in the east | 早晨的太阳从东方升起 | ＿＿，海面上一片金光。
昼夜温差 | zhòu yè wēn chā | day-night temperature difference | 白天和夜里温度的差别 | 沙漠里的＿＿很大，白天很热，晚上却很冷。
凌晨 | líng chén | the small hours | 天快亮的时候 | 他每天＿＿四点就起床去送牛奶。 | 黎明
黎明 | lí míng | dawn | 天快要亮的时候 | ＿＿时分，东方的天空渐渐发白。 | 凌晨
曙光 | shǔ guāng | first light of dawn; hope | 早晨的阳光；比喻希望 | 经过多年的研究，治疗这种病终于有了＿＿。
黄昏 | huáng hūn | dusk | 太阳落山前后的时候 | ＿＿时，鸟儿们纷纷飞回了树林。
昏暗 | hūn àn | dim | 光线不足 | 屋子里光线＿＿，看不清书上的字。 | 黯淡
黯淡 | àn dàn | faint; gloomy | 光线不明亮；前景不好 | 天亮以后，星星的光渐渐变得＿＿了。 | 昏暗
`,
  },
  {
    theme: ["Light and Colour", "光和色彩"],
    data: `
光芒 | guāng máng | rays of light | 向四面放射的强烈光线 | 太阳的＿＿照亮了整个山谷。
光芒万丈 | guāng máng wàn zhàng | radiant, shining far and wide | 光芒照得极远 | 太阳从海面上升起来，＿＿。
彩虹 | cǎi hóng | rainbow | 阳光被空中的水滴分散后形成的彩色圆弧 | 雨停了，天边出现了一道美丽的＿＿。
蔚蓝 | wèi lán | azure | 像晴朗天空那样的蓝色 | 从太空看，地球是一个＿＿色的星球。
忽明忽暗 | hū míng hū àn | flickering | 一会儿亮，一会儿暗 | 那颗星星＿＿，好像在对我们眨眼睛。
洒落 | sǎ luò | to fall in scattered drops or beams | 分散地落下 | 阳光透过树叶，＿＿在林间的小路上。
光谱 | guāng pǔ | spectrum | 光分解后按波长排列成的彩色光带 | 分析星光的＿＿，科学家就能知道恒星是由什么组成的。
红移 | hóng yí | redshift | 光谱线向红色一端移动的现象 | 远处星系的光谱出现＿＿，说明它们正在离我们而去。
宇宙射线 | yǔ zhòu shè xiàn | cosmic rays | 来自宇宙的高能粒子流 | 宇航员在太空中会受到更多＿＿的照射。
皓月当空 | hào yuè dāng kōng | a bright moon in the sky | 明亮的月亮挂在天空 | 中秋之夜，＿＿，一家人坐在院子里赏月。
`,
  },
  {
    theme: ["Shells and Layers", "外壳和层"],
    data: `
地壳 | dì qiào | Earth's crust | 地球表面一层坚硬的外壳 | ＿＿的运动会引起地震和火山爆发。
外壳 | wài ké | outer shell, casing | 外面的硬壳 | 这部手机的＿＿是金属做的。
贝壳 | bèi ké | seashell | 贝类的硬壳 | 孩子们在海滩上找到了很多漂亮的＿＿。
蛋壳 | dàn ké | eggshell | 蛋外面的硬壳 | ＿＿很薄，一碰就破。
大气层 | dà qì céng | atmosphere | 包围地球的气体层 | 流星是小天体进入＿＿时，摩擦燃烧发出的光。
臭氧层 | chòu yǎng céng | ozone layer | 大气中能吸收紫外线的一层 | ＿＿能挡住太阳的大部分紫外线，保护地球上的生命。
地平线 | dì píng xiàn | horizon | 天和地相接的线 | 太阳慢慢地从＿＿上升了起来。 | 天际
天际 | tiān jì | the edge of the sky | 天的边际 | 一群大雁飞向遥远的＿＿。 | 地平线
天顶 | tiān dǐng | zenith | 头顶正上方的天空 | 在赤道附近，中午的太阳接近＿＿，人的影子几乎看不见。
白茫茫 | bái máng máng | a vast expanse of white | 一眼望不到边的白色 | 下了一夜大雪，田野里＿＿的一片。
`,
  },
  {
    theme: ["Shapes and Directions", "形状和方向"],
    data: `
扁平 | biǎn píng | flat | 又平又薄 | 银河系的形状像一个＿＿的圆盘。
扁圆 | biǎn yuán | oblate, flattened round | 扁而圆 | 地球不是一个正球体，而是两极稍微扁一点的＿＿球体。
垂直 | chuí zhí | perpendicular, vertical | 两条线相交成直角 | 旗杆和地面是＿＿的。
垂线 | chuí xiàn | perpendicular line | 与另一条直线成直角的直线 | 从直线外的一点向这条直线画一条＿＿。
下垂 | xià chuí | to droop | 向下挂着 | 柳树的枝条长长地＿＿到水面上。
侧面 | cè miàn | side; aspect | 旁边的一面；一个方面 | 这张照片是从＿＿拍的，只能看到他的半边脸。
横向 | héng xiàng | horizontal; lateral | 从左到右的方向 | 这张表格＿＿是日期，纵向是科目。
纵横 | zòng héng | lengthwise and crosswise | 竖和横 | 城市里的街道＿＿交错，像一张大网。
横跨 | héng kuà | to span | 从一边跨到另一边 | 这座大桥＿＿长江两岸。
横穿 | héng chuān | to cross (a road) | 从一边穿过到另一边 | 行人不要随意＿＿马路。
`,
  },
  {
    theme: ["Watching the Sky", "观测天空"],
    data: `
观星 | guān xīng | stargazing | 观看星星 | 周末我们去郊外＿＿，看到了很多在城里看不到的星星。 | 天文观测
天象 | tiān xiàng | celestial phenomena | 天空中出现的各种现象 | 古代的天文学家仔细记录了日食、流星等各种＿＿。
天文馆 | tiān wén guǎn | planetarium | 普及天文知识的场馆 | 学校组织我们参观＿＿，了解宇宙的知识。
射电望远镜 | shè diàn wàng yuǎn jìng | radio telescope | 接收天体发出的电波的望远镜 | 贵州有一台口径五百米的＿＿，被人们叫作“中国天眼”。
天文望远镜 | tiān wén wàng yuǎn jìng | astronomical telescope | 观测天体用的望远镜 | 他用自己的＿＿拍到了土星的光环。
瞄准 | miáo zhǔn | to aim at | 对准目标 | 他把望远镜＿＿了月亮，调好了焦距。
深空探测 | shēn kōng tàn cè | deep-space exploration | 对月球和更远天体的探测 | 月球和火星都是＿＿的重要目标。
探月 | tàn yuè | lunar exploration | 探测月球 | 中国的＿＿工程分为“绕、落、回”三步。
天文观测 | tiān wén guān cè | astronomical observation | 用仪器观察天体 | 高山上空气稀薄、干燥，适合进行＿＿。 | 观星
星空摄影 | xīng kōng shè yǐng | astrophotography | 拍摄星空 | 他爱好＿＿，常常半夜带着相机上山拍银河。 | 观星
`,
  },
  {
    theme: ["Crewed Spaceflight", "载人航天"],
    data: `
载人航天 | zài rén háng tiān | crewed spaceflight | 人乘坐航天器进入太空的活动 | 二零零三年，神舟五号飞船把中国第一位航天员送上了太空，这是中国＿＿的开始。
飘浮 | piāo fú | to float | 在空中或水面上轻轻地浮动 | 在空间站里，没有固定好的东西都会＿＿在空中。
太空舱 | tài kōng cāng | space capsule | 航天器中供人生活和工作的舱 | 宇航员在＿＿里吃饭、睡觉和做实验。
云霄 | yún xiāo | the sky, the clouds | 极高的天空 | 火箭喷着火焰，直冲＿＿。
太空行走 | tài kōng xíng zǒu | spacewalk | 宇航员离开飞船在太空中活动 | 二零零八年，中国航天员第一次进行了＿＿。
微重力 | wēi zhòng lì | microgravity | 非常小的重力 | 在空间站的＿＿环境里，水会变成一个个漂浮的水球。
中国空间站 | zhōng guó kōng jiān zhàn | the China Space Station | 中国建造的空间站 | ＿＿又叫“天宫”，在二零二二年完成了建造。
对接 | duì jiē | to dock | 两个航天器在太空中连接在一起 | 飞船和空间站在太空中成功地＿＿在了一起。
升空 | shēng kōng | to lift off | 升到空中 | 火箭点火以后，带着飞船慢慢＿＿。
倒计时 | dào jì shí | countdown | 从预定时间倒着数 | 火箭发射前要进行＿＿，数到零就点火。
`,
  },
  {
    theme: ["Satellites and Probes", "卫星和探测器"],
    data: `
发射场 | fā shè chǎng | launch site | 发射火箭的地方 | 中国海南有一个靠近赤道的航天＿＿。
着陆器 | zhuó lù qì | lander | 降落在天体表面的探测器 | 二零一九年，中国的＿＿第一次在月球背面安全降落。
火星车 | huǒ xīng chē | Mars rover | 在火星表面行驶的探测车 | 中国的“祝融号”＿＿在火星表面工作了一年多。
卫星导航 | wèi xīng dǎo háng | satellite navigation | 利用卫星确定位置和指引路线 | 有了＿＿，开车到陌生的地方也不会迷路。 | 北斗
北斗 | běi dǒu | BeiDou (navigation system); the Big Dipper | 中国的卫星导航系统；北方天空中的七颗亮星 | 中国自己建立的卫星导航系统叫＿＿。 | 卫星导航
同步卫星 | tóng bù wèi xīng | geostationary satellite | 绕地球转动的速度和地球自转相同的卫星 | 从地面看，＿＿好像一直停在天空中的同一个地方。
气象卫星 | qì xiàng wèi xīng | weather satellite | 用来观测天气的卫星 | 天气预报的很多资料来自＿＿。 | 卫星云图
通信卫星 | tōng xìn wèi xīng | communications satellite | 用来传送电话、电视等信号的卫星 | 远在海上的轮船，也能通过＿＿打电话、上网。
卫星云图 | wèi xīng yún tú | satellite cloud image | 卫星拍摄的云层图片 | 电视上的天气预报常常会播放＿＿，让观众看到云的分布。 | 气象卫星
航天器 | háng tiān qì | spacecraft | 在太空中飞行的各种飞行器 | 卫星、飞船和空间站都属于＿＿。
`,
  },
  {
    theme: ["Origins and the Unknown", "起源和未知"],
    data: `
大爆炸 | dà bào zhà | the Big Bang | 关于宇宙起源的一种理论 | 很多科学家认为，宇宙起源于大约一百三十八亿年前的一次＿＿。
奇点 | qí diǎn | singularity | 密度无限大、体积无限小的点 | 根据大爆炸理论，宇宙最初是一个极小的＿＿。
暗物质 | àn wù zhì | dark matter | 看不见、却有引力作用的物质 | 科学家认为宇宙中存在大量＿＿，它不发光，却有引力。
星际 | xīng jì | interstellar | 星体与星体之间 | 未来，人类也许能进行＿＿旅行。
外星人 | wài xīng rén | alien | 地球以外的智慧生命 | 人类一直在寻找＿＿，可是还没有找到他们存在的证据。
系外行星 | xì wài xíng xīng | exoplanet | 太阳系以外的行星 | 天文学家已经发现了几千颗＿＿。
宜居带 | yí jū dài | habitable zone | 恒星周围适合液态水存在的区域 | 地球正好位于太阳的＿＿里，所以表面有液态水。
天圆地方 | tiān yuán dì fāng | round heaven, square earth | 中国古人认为天是圆的、地是方的 | ＿＿是中国古代人对天地形状的一种看法。
渺茫 | miǎo máng | remote, slim (of hope) | 遥远而模糊；希望很小 | 在大海里找一个小小的戒指，希望十分＿＿。
迄今为止 | qì jīn wéi zhǐ | up to now | 到现在为止 | ＿＿，地球是人类知道的唯一有生命的星球。
`,
  },
  {
    theme: ["Time and Motion", "时间和动静"],
    data: `
上旬 | shàng xún | first ten days of a month | 每个月一日到十日 | 国庆节是十月一日，在十月＿＿。
中旬 | zhōng xún | middle ten days of a month | 每个月十一日到二十日 | 今天是五月十五日，正好是五月＿＿。
下旬 | xià xún | last ten days of a month | 每个月二十一日到月底 | 一月三十一日是一月＿＿的最后一天。
芒种 | máng zhòng | Grain in Ear (a solar term) | 二十四节气之一，在六月初 | ＿＿前后，北方的农民忙着收麦子。
一晃 | yì huǎng | in a flash (of time) | 时间很快地过去 | ＿＿十年过去了，当年的孩子都长大了。
忽然 | hū rán | suddenly | 突然 | 我们正在上课，教室里的灯＿＿灭了。
摇晃 | yáo huàng | to shake, to sway | 摇来摇去 | 船在大风中不停地＿＿。 | 晃动
晃动 | huàng dòng | to rock, to sway | 来回摇动 | 地震的时候，桌子上的杯子开始＿＿。 | 摇晃
忽略 | hū lüè | to overlook | 没有注意到 | 他只顾学习，＿＿了身体健康。
疏忽 | shū hu | negligence | 粗心，没有注意到 | 由于一时＿＿，他把会议的时间写错了。
`,
  },
  // Unit 6: Life Sciences.
  {
    theme: ["Cells", "细胞"],
    data: `
细胞核 | xì bāo hé | nucleus | 细胞中央储存遗传物质的部分 | 遗传物质主要储存在＿＿里。
细胞膜 | xì bāo mó | cell membrane | 包在细胞外面的一层薄膜 | ＿＿控制着物质进出细胞。
细胞质 | xì bāo zhì | cytoplasm | 细胞膜以内、细胞核以外的部分 | 线粒体等结构都分布在＿＿中。
细胞壁 | xì bāo bì | cell wall | 植物细胞最外面坚硬的一层 | 植物细胞有＿＿，动物细胞却没有。
细胞分裂 | xì bāo fēn liè | cell division | 一个细胞分成两个细胞 | 生物体通过＿＿使细胞的数量不断增加。
单细胞 | dān xì bāo | single-celled | 只由一个细胞构成的 | 细菌是＿＿生物，要用显微镜才能看见。
多细胞 | duō xì bāo | multicellular | 由很多个细胞构成的 | 人和大多数动植物都是＿＿生物。
线粒体 | xiàn lì tǐ | mitochondrion | 细胞里产生能量的结构 | ＿＿被叫作细胞的“动力工厂”，为生命活动提供能量。
叶绿体 | yè lǜ tǐ | chloroplast | 植物细胞中进行光合作用的结构 | 植物的叶子是绿色的，因为叶肉细胞里有很多＿＿。
核糖体 | hé táng tǐ | ribosome | 细胞里合成蛋白质的结构 | ＿＿虽然很小，却是细胞里合成蛋白质的地方。
`,
  },
  {
    theme: ["Genes and Heredity", "基因和遗传"],
    data: `
染色体 | rǎn sè tǐ | chromosome | 细胞核里携带遗传信息的结构 | 人的体细胞里有二十三对＿＿。
遗传物质 | yí chuán wù zhì | genetic material | 决定生物遗传特征的物质 | 脱氧核糖核酸是大多数生物的＿＿。
双螺旋 | shuāng luó xuán | double helix | 两条链互相缠绕的结构 | 一九五三年，科学家发现了脱氧核糖核酸的＿＿结构。
基因组 | jī yīn zǔ | genome | 一种生物全部的遗传信息 | 人类＿＿计划在二零零三年基本完成。
遗传病 | yí chuán bìng | hereditary disease | 由遗传物质改变引起的病 | 色盲是一种常见的＿＿。
显性 | xiǎn xìng | dominant (of a trait) | 容易表现出来的 | 如果一个性状是＿＿的，只要有一个这种基因就会表现出来。
隐性 | yǐn xìng | recessive | 不容易表现出来的 | ＿＿基因只有成对出现的时候，才会表现出来。
变异 | biàn yì | variation, mutation | 生物后代与上一代之间的差异 | 同一对父母生的孩子长得也不完全一样，这是＿＿的结果。
遗传学 | yí chuán xué | genetics | 研究遗传和变异的学科 | 他大学学的是＿＿，研究基因怎样代代相传。
克隆 | kè lóng | to clone | 用一个细胞复制出遗传物质完全相同的生物 | 一九九六年，世界上第一只用成年动物的体细胞＿＿出来的羊出生了。
`,
  },
  {
    theme: ["The Chemistry of the Body", "身体里的化学"],
    data: `
氨基酸 | ān jī suān | amino acid | 组成蛋白质的基本单位 | 蛋白质是由多种＿＿组成的。
胆固醇 | dǎn gù chún | cholesterol | 人体内的一种脂类物质 | 经常吃太多油炸食品，血液里的＿＿可能会升高。
葡萄糖 | pú táo táng | glucose | 细胞的主要能量来源 | 人饿得发晕的时候，补充一点＿＿就能很快恢复力气。
脂肪酸 | zhī fáng suān | fatty acid | 组成脂肪的物质 | 脂肪在身体里会被分解成甘油和＿＿。
碳水化合物 | tàn shuǐ huà hé wù | carbohydrate | 糖和淀粉等物质的总称 | 米饭和面条的主要成分是＿＿。
氯化钠 | lǜ huà nà | sodium chloride | 一种由氯和钠组成的化合物 | 海水之所以是咸的，是因为里面溶解了大量的＿＿等盐类。
微量元素 | wēi liàng yuán sù | trace element | 人体需要量很少的元素 | 铁和碘都是人体需要的＿＿。
矿物质 | kuàng wù zhì | minerals | 人体需要的无机盐 | 牛奶中含有钙等多种＿＿。
激素 | jī sù | hormone | 身体分泌的调节生命活动的物质 | 到了青春期，身体会分泌更多的＿＿，个子长得特别快。
新陈代谢 | xīn chén dài xiè | metabolism | 生物体不断吸收养分、排出废物的过程 | 经常运动可以促进身体的＿＿。
`,
  },
  {
    theme: ["Systems of the Body", "人体的系统"],
    data: `
消化系统 | xiāo huà xì tǒng | digestive system | 负责消化食物、吸收营养的器官 | 胃和肠都属于＿＿。
循环系统 | xún huán xì tǒng | circulatory system | 负责运送血液的器官 | 心脏和血管组成了人体的＿＿。
神经系统 | shén jīng xì tǒng | nervous system | 负责感觉和控制身体活动的器官 | 大脑和脊髓是＿＿的中心部分。
呼吸系统 | hū xī xì tǒng | respiratory system | 负责吸入氧气、呼出二氧化碳的器官 | 肺是＿＿最重要的器官。
血液循环 | xuè yè xún huán | blood circulation | 血液在身体里不停地流动 | 冬天手脚总是冰冷，可能是＿＿不好。
红细胞 | hóng xì bāo | red blood cell | 运输氧气的血细胞 | ＿＿负责把氧气运送到身体各处。
白细胞 | bái xì bāo | white blood cell | 消灭病菌的血细胞 | 身体发炎的时候，血液里的＿＿会增多。
血小板 | xuè xiǎo bǎn | platelet | 帮助血液凝固的血细胞 | 手指划破以后，＿＿会帮助止血。
干细胞 | gàn xì bāo | stem cell | 能变成多种细胞的细胞 | ＿＿可以变成多种不同的细胞，在医学上很有用。
骨髓 | gǔ suǐ | bone marrow | 骨头中间的软组织 | 血细胞主要是在＿＿里产生的。
`,
  },
  {
    theme: ["Nerves and Senses", "神经和感官"],
    data: `
神经元 | shén jīng yuán | neuron | 神经细胞 | 人的大脑里大约有八百六十亿个＿＿。
小脑 | xiǎo nǎo | cerebellum | 大脑后下方控制身体平衡的部分 | ＿＿受伤的人，走路很难保持平衡。
脑干 | nǎo gàn | brainstem | 连接大脑和脊髓的部分 | ＿＿控制着呼吸和心跳等最基本的生命活动。
脊髓 | jǐ suǐ | spinal cord | 脊柱里面的神经组织 | ＿＿在脊柱里面，连接着大脑和身体的各个部分。
条件反射 | tiáo jiàn fǎn shè | conditioned reflex | 后天学会的反射 | 狗每次吃东西前都听到铃声，后来一听到铃声就流口水，这就是＿＿。
鼓膜 | gǔ mó | eardrum | 耳朵里接收声音振动的薄膜 | 声音传进耳道，使＿＿振动，我们就听到了声音。
角膜 | jiǎo mó | cornea | 眼球前面透明的一层膜 | 光线先通过透明的＿＿，再进入眼球里面。
视网膜 | shì wǎng mó | retina | 眼球里接收光线的一层膜 | 外界的物体在＿＿上形成图像，我们就看见了东西。
本能 | běn néng | instinct | 生来就有的能力 | 小鸭子出生后不用学就会游泳，这是一种＿＿。
生理 | shēng lǐ | physiology | 生物体的生命活动和功能 | 到了青春期，青少年的身体会发生很大的＿＿变化。
`,
  },
  {
    theme: ["The Beginning of Life", "生命的开始"],
    data: `
孵化 | fū huà | to hatch | 卵变成幼小动物的过程 | 这些小鸡是在机器里＿＿出来的。
孵蛋 | fū dàn | to brood eggs | 鸟类伏在蛋上使蛋变成小鸟 | 母鸡正在＿＿，二十一天以后小鸡就会出来了。
卵生 | luǎn shēng | oviparous | 动物用产卵的方式繁殖 | 鸟类和大多数爬行动物都是＿＿的。
胎生 | tāi shēng | viviparous | 动物在母体内发育后生出来 | 鲸虽然生活在海里，却是＿＿的哺乳动物。
受精 | shòu jīng | to be fertilised | 精子和卵子结合 | 卵子＿＿以后，开始发育成新的个体。
雌性 | cí xìng | female | 能产生卵子的性别 | 在蜜蜂中，负责产卵的蜂王是＿＿的。
雄性 | xióng xìng | male | 能产生精子的性别 | 头上有一圈长毛的是＿＿狮子。
雌雄 | cí xióng | male and female | 雌性和雄性 | 很多鸟类的＿＿羽毛颜色不同，雄鸟往往更漂亮。
试管婴儿 | shì guǎn yīng ér | test-tube baby | 用体外受精技术出生的孩子 | 一九七八年，世界上第一个＿＿在英国出生。
生命周期 | shēng mìng zhōu qī | life cycle | 生物从出生到死亡的全过程 | 蝴蝶的＿＿包括卵、幼虫等四个阶段。
`,
  },
  {
    theme: ["Evolution", "进化"],
    data: `
进化论 | jìn huà lùn | theory of evolution | 关于生物由简单到复杂发展的理论 | 达尔文提出了＿＿，认为生物是逐渐演变而来的。
自然选择 | zì rán xuǎn zé | natural selection | 适应环境的生物生存下来，不适应的被淘汰 | 环境不断变化，经过长期的＿＿，生物变得越来越适应环境。
适者生存 | shì zhě shēng cún | survival of the fittest | 适应环境的才能生存下来 | 在大自然中，＿＿，不适应环境的生物会被淘汰。 | 物竞天择
物竞天择 | wù jìng tiān zé | competition and natural selection | 生物互相竞争，由自然来选择 | ＿＿，适者生存，这是严复翻译进化论时用的话。 | 适者生存
拟态 | nǐ tài | mimicry | 动物模仿别的生物或物体的样子 | 有的昆虫长得像树枝，这种＿＿能让它躲开天敌。 | 伪装
保护色 | bǎo hù sè | protective colouring | 和环境相似的颜色 | 青蛙的绿色是一种＿＿，让它在草地里很难被发现。
伪装 | wěi zhuāng | camouflage, disguise | 改变外表来掩盖真相 | 变色龙能改变皮肤的颜色来＿＿自己。 | 拟态
天敌 | tiān dí | natural enemy | 自然界中捕食某种生物的动物 | 猫头鹰是老鼠的＿＿。
共同祖先 | gòng tóng zǔ xiān | common ancestor | 不同生物最早共有的祖先 | 科学研究表明，人和黑猩猩有＿＿。
变态发育 | biàn tài fā yù | metamorphosis | 幼体和成体形态差别很大的发育方式 | 从毛毛虫变成蝴蝶，这种发育方式叫＿＿。
`,
  },
  {
    theme: ["Groups of Animals", "动物的类别"],
    data: `
哺乳动物 | bǔ rǔ dòng wù | mammal | 用乳汁喂养后代的动物 | 鲸是生活在海里的＿＿。
脊椎动物 | jǐ zhuī dòng wù | vertebrate | 有脊椎骨的动物 | 鱼、鸟和人都是＿＿。
无脊椎动物 | wú jǐ zhuī dòng wù | invertebrate | 没有脊椎骨的动物 | 昆虫和蚯蚓都是＿＿。 | 节肢动物 软体动物
节肢动物 | jié zhī dòng wù | arthropod | 身体和脚分节的动物 | 虾和蜘蛛都属于＿＿。 | 无脊椎动物
软体动物 | ruǎn tǐ dòng wù | mollusc | 身体柔软、多数有壳的动物 | 章鱼和贝类都是＿＿。 | 无脊椎动物
鸟类 | niǎo lèi | birds | 有羽毛、会生蛋的脊椎动物 | 很多＿＿的骨头是空心的，所以身体比较轻。
杂食动物 | zá shí dòng wù | omnivore | 既吃植物又吃动物的动物 | 熊既吃果子又吃鱼，是＿＿。
恒温动物 | héng wēn dòng wù | warm-blooded animal | 体温保持不变的动物 | 鸟和哺乳动物都是＿＿，体温基本不变。
变温动物 | biàn wēn dòng wù | cold-blooded animal | 体温随环境变化的动物 | 蛇是＿＿，天冷的时候要冬眠。
水生动物 | shuǐ shēng dòng wù | aquatic animal | 生活在水里的动物 | 鱼、虾和水母都是＿＿。
`,
  },
  {
    theme: ["Birds and Poultry", "鸟和家禽"],
    data: `
家禽 | jiā qín | poultry | 人养的鸡、鸭、鹅等 | 鸡、鸭、鹅都是农村常见的＿＿。
猛禽 | měng qín | bird of prey | 凶猛的鸟 | 老鹰是一种＿＿，能从高空冲下来抓住猎物。
飞禽走兽 | fēi qín zǒu shòu | birds and beasts | 各种鸟和兽 | 这片森林里生活着各种各样的＿＿。
鸽子 | gē zi | pigeon, dove | 一种常见的鸟 | 广场上有很多＿＿，游客们常常给它们喂食。
信鸽 | xìn gē | carrier pigeon | 经过训练能送信的鸽子 | 古时候，人们用＿＿传递消息，它们能找到很远的家。
和平鸽 | hé píng gē | dove of peace | 象征和平的白鸽 | 白色的＿＿是和平的象征。
天鹅 | tiān é | swan | 一种羽毛洁白、脖子很长的大鸟 | 冬天，成群的＿＿从北方飞到湖上过冬。
鹅毛 | é máo | goose feather | 鹅的羽毛 | 千里送＿＿，礼轻情意重。
翅膀 | chì bǎng | wing | 鸟和昆虫用来飞的部分 | 小鸟张开＿＿，飞向了天空。
鸡翅 | jī chì | chicken wing | 鸡的翅膀 | 今天的晚饭有红烧＿＿。
`,
  },
  {
    theme: ["Life in the Water", "水中的生物"],
    data: `
鲤鱼 | lǐ yú | carp | 一种常见的淡水鱼 | 公园的池塘里有很多红色的＿＿。
对虾 | duì xiā | prawn | 一种个头较大的海虾 | ＿＿是中国北方沿海常见的一种大虾。
龙虾 | lóng xiā | lobster | 一种体形大、有一对大钳的虾 | ＿＿有一对很大的钳子，煮熟以后会变成红色。
虾米 | xiā mi | dried shrimp | 晒干去壳的小虾 | 奶奶做汤的时候，喜欢放一些＿＿来提味。
河蟹 | hé xiè | river crab | 生长在河湖里的螃蟹 | 秋天是吃＿＿的季节。
海龟 | hǎi guī | sea turtle | 生活在海里的龟 | 雌＿＿会爬到沙滩上产卵。
藻类 | zǎo lèi | algae | 生长在水里的低等植物 | 湖水里的＿＿太多，水就会变绿、发臭。
海藻 | hǎi zǎo | seaweed | 生长在海里的藻类 | 海带和紫菜都是可以吃的＿＿。
甲壳 | jiǎ qiào | carapace, shell | 虾、蟹等动物身上坚硬的外壳 | 虾和蟹身上都有一层坚硬的＿＿。
浮游生物 | fú yóu shēng wù | plankton | 在水中漂浮的微小生物 | 很多鱼以水中的＿＿为食。
`,
  },
  {
    theme: ["Small Creatures", "小动物"],
    data: `
蚯蚓 | qiū yǐn | earthworm | 生活在泥土里、身体长而软的动物 | 下过雨以后，＿＿常常爬到地面上来。
蜘蛛 | zhī zhū | spider | 会结网捉虫子的小动物 | ＿＿在墙角结了一张网。
蛛网 | zhū wǎng | spider's web | 蜘蛛结的网 | 清晨，＿＿上挂满了露珠。
蝙蝠 | biān fú | bat | 一种会飞的哺乳动物 | ＿＿白天倒挂着睡觉，晚上出来捉虫子。
蜻蜓 | qīng tíng | dragonfly | 翅膀透明、飞得很快的昆虫 | 下雨之前，＿＿常常飞得很低。
触角 | chù jiǎo | antenna (of an insect) | 昆虫头上的感觉器官 | 蚂蚁用头上的＿＿互相传递信息。
复眼 | fù yǎn | compound eye | 由许多小眼组成的眼睛 | 蜻蜓的＿＿由几万只小眼组成。
口器 | kǒu qì | mouthparts | 昆虫吃东西的器官 | 蚊子的＿＿像一根细针，可以刺进皮肤。
外骨骼 | wài gǔ gé | exoskeleton | 动物体外坚硬的保护结构 | 昆虫身体里没有骨头，身体外面有一层坚硬的＿＿。
成虫 | chéng chóng | adult insect | 发育成熟的昆虫 | 蝉的幼虫在地下生活好几年，＿＿却只活几个星期。
`,
  },
  {
    theme: ["Animal Bodies", "动物的身体"],
    data: `
爪子 | zhuǎ zi | claw, paw | 动物有尖甲的脚 | 小猫用＿＿把沙发抓坏了。
鸡爪 | jī zhuǎ | chicken feet | 鸡的脚 | 这道菜是用＿＿做的，又香又辣。
脚趾 | jiǎo zhǐ | toe | 脚指头 | 鞋太小了，挤得＿＿很疼。
马蹄 | mǎ tí | horse's hoof | 马的脚 | 远处传来了一阵＿＿声。
蹄子 | tí zi | hoof | 牛、马、羊等的脚 | 牛和羊的＿＿都分成两半。
犬齿 | quǎn chǐ | canine tooth | 门牙两边尖尖的牙 | 老虎的＿＿又长又尖，可以紧紧地咬住猎物。
象牙 | xiàng yá | ivory, elephant tusk | 大象嘴外长长的牙 | 为了保护大象，很多国家都禁止买卖＿＿。
吸盘 | xī pán | sucker | 能吸住东西的器官 | 章鱼的腿上有很多＿＿，能紧紧地吸住石头。
毒腺 | dú xiàn | venom gland | 产生毒液的腺体 | 毒蛇的＿＿在头部，毒液通过牙齿进入猎物体内。
龟壳 | guī ké | tortoise shell | 乌龟背上的硬壳 | 乌龟遇到危险时，会把头缩进＿＿里。
`,
  },
  {
    theme: ["How Plants Live", "植物怎样生活"],
    data: `
光合作用 | guāng hé zuò yòng | photosynthesis | 植物利用阳光把二氧化碳和水变成养分 | 绿色植物通过＿＿制造养分，同时放出氧气。
呼吸作用 | hū xī zuò yòng | respiration | 生物吸入氧气、分解养分、放出能量的过程 | 植物在夜里不进行光合作用，但一直在进行＿＿。
叶绿素 | yè lǜ sù | chlorophyll | 使植物呈绿色的色素 | 秋天，树叶里的＿＿减少，叶子就变黄了。
蒸腾作用 | zhēng téng zuò yòng | transpiration | 水分从叶子表面散发出去的过程 | 通过＿＿，植物把根吸收的水分从叶子里散发出去。
气孔 | qì kǒng | stoma | 叶子表面进出气体的小孔 | 叶子表面有很多＿＿，气体和水分从这里进出。
根系 | gēn xì | root system | 植物全部的根 | 这种草的＿＿很发达，能牢牢地抓住沙土。
根毛 | gēn máo | root hair | 根尖上细小的毛 | 植物主要靠根尖上的＿＿吸收水分。
年轮 | nián lún | growth ring | 树干横切面上的圆环 | 数一数树干上的＿＿，就能知道树的年龄。
叶脉 | yè mài | leaf vein | 叶子上的纹路 | ＿＿就像叶子的血管，运送水分和养分。
树皮 | shù pí | bark | 树干外面的一层皮 | 如果＿＿被剥掉一圈，树就会慢慢死去。
`,
  },
  {
    theme: ["Flowers and Fruits", "花和果实"],
    data: `
花蕊 | huā ruǐ | stamens and pistils | 花中心的部分 | 蜜蜂停在花上，把头伸进了＿＿里。
雄蕊 | xióng ruǐ | stamen | 产生花粉的部分 | ＿＿顶端的花药里有花粉。
雌蕊 | cí ruǐ | pistil | 接受花粉、能结出果实的部分 | 花粉落到＿＿上以后，花才能结出果实。
花瓣 | huā bàn | petal | 花的一片一片的部分 | 一阵风吹过，粉红色的＿＿落了一地。
子房 | zǐ fáng | ovary (of a flower) | 雌蕊下部膨大的部分 | 受精以后，＿＿慢慢发育成果实。
胚珠 | pēi zhū | ovule | 子房里以后发育成种子的部分 | ＿＿将来会发育成种子。
传粉 | chuán fěn | pollination | 花粉从雄蕊传到雌蕊 | 蜜蜂在花与花之间飞来飞去，帮助植物＿＿。
花粉 | huā fěn | pollen | 雄蕊产生的粉状物 | 有些人对＿＿过敏，春天一到就打喷嚏。
果皮 | guǒ pí | peel, rind | 果实外面的皮 | 吃苹果前，最好把＿＿洗干净。
种皮 | zhǒng pí | seed coat | 种子外面的皮 | 种子外面有一层＿＿，保护着里面的胚。
`,
  },
  {
    theme: ["Plants We Know", "常见的植物"],
    data: `
竹笋 | zhú sǔn | bamboo shoot | 竹子的嫩芽 | 春天，竹林里长出了很多＿＿。
雨后春笋 | yǔ hòu chūn sǔn | (springing up) like bamboo shoots after rain | 比喻新事物大量出现 | 近几年，新的咖啡店像＿＿一样出现在城市里。
莲花 | lián huā | lotus flower | 莲开的花 | 夏天，池塘里的＿＿开了。
莲子 | lián zǐ | lotus seed | 莲的种子 | 妈妈用＿＿和红豆煮了一锅甜汤。
莲蓬 | lián peng | lotus seedpod | 莲的果实，里面有很多种子 | 夏末，池塘里的＿＿成熟了，孩子们划着小船去采。
向日葵 | xiàng rì kuí | sunflower | 花盘大、会朝着太阳转的植物 | 小＿＿的花盘会跟着太阳转动。
植株 | zhí zhū | plant (as an individual) | 一棵一棵的植物 | 这些玉米＿＿长得又高又壮。
被子植物 | bèi zǐ zhí wù | angiosperm, flowering plant | 种子包在果实里的植物 | 苹果、桃和水稻都是＿＿。 | 种子植物
种子植物 | zhǒng zǐ zhí wù | seed plant | 用种子繁殖的植物 | 松树和苹果树都是用种子繁殖的＿＿。
雌雄同株 | cí xióng tóng zhū | monoecious | 同一株植物上既有雌花又有雄花 | 玉米是＿＿的植物，雄花长在顶上，雌花长在中间。
`,
  },
  {
    theme: ["Microbes and Biotechnology", "微生物和生物技术"],
    data: `
微生物 | wēi shēng wù | microorganism | 很小的生物 | 很多＿＿非常小，要用显微镜才能看见。
真菌 | zhēn jūn | fungus | 蘑菇、霉菌等生物 | 蘑菇不是植物，而是一种＿＿。
乳酸菌 | rǔ suān jūn | lactic acid bacteria | 能把糖变成乳酸的细菌 | 酸奶就是牛奶加入＿＿以后做成的。 | 益生菌
益生菌 | yì shēng jūn | probiotic | 对身体有好处的活菌 | 有些食品里加了＿＿，对肠道有好处。 | 乳酸菌
耐药性 | nài yào xìng | drug resistance | 病菌对药物产生的抵抗力 | 滥用抗生素会使细菌产生＿＿。
禽流感 | qín liú gǎn | bird flu | 鸟类感染的流行性感冒 | ＿＿主要在鸡、鸭等鸟类中传播。
转基因 | zhuǎn jī yīn | genetically modified | 用技术改变生物的基因 | 科学家用＿＿技术培育出了不怕虫子的棉花。
生物技术 | shēng wù jì shù | biotechnology | 利用生物来生产或改造的技术 | 利用现代＿＿，可以大量生产药品和疫苗。
基因工程 | jī yīn gōng chéng | genetic engineering | 按人的需要改变生物基因的技术 | 现在，糖尿病人用的一些药是用＿＿的方法生产的。
杂交 | zá jiāo | to hybridise | 让不同品种的生物交配或结合 | 科学家用＿＿的方法培育出了高产的水稻。
`,
  },
];
