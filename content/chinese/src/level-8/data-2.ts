// The second quarter of level 8 (docs/chinese-curriculum.md §8.3): units 4 to 6, public health, energy and resources,
// and engineering and inventions, 100 characters in 10 batches and 480 words in 48 batches. The characters are new to
// levels 1 to 7 and to the first quarter, chosen from the middle third of GF 0025-2021's advanced band by frequency for
// what each unit's words need; the words and sentences use only the characters of levels 1 to 7 and those taught so far.
//
// A character line as in level 6 (../level-6/character-data-a.ts); a word line as in level 6 (../level-6/word-data-a.ts).

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches2 are the 10 character batches of units 4 to 6 of level 8, in teaching order. */
export const characterBatches2: readonly string[] = [
  // Unit 4: Public Health.
  `
瘟 wēn | pestilence, plague | 流行很广、死人很多的急性传染病 | 温蕴
疟 nüè | malaria | 一种由蚊子传播、发冷发热的传染病 | 虐疙
痢 lì | dysentery | 一种拉肚子、大便带血的肠道传染病 | 利梨
霍 huò | suddenly, swiftly | 突然，很快地 | 雷霜
疮 chuāng | sore, skin ulcer | 皮肤上发炎、烂了的地方 | 创仓
瘫 tān | paralysed | 身体的一部分完全不能动 | 摊滩 | 痪
痪 huàn | paralysed, as in 瘫痪 | 肢体失去活动的能力 | 换唤 | 瘫
痊 quán | to recover from illness | 病好了 | 全诠
恙 yàng | illness (in formal writing) | 病，小毛病 | 羔羊
瘾 yǐn | addiction, craving | 非常强烈、很难改掉的爱好 | 隐稳
`,
  `
唾 tuò | saliva; to spit | 口水；吐口水 | 垂睡
涕 tì | nasal mucus; tears | 鼻子里流出的液体；眼睛里流出的水 | 弟梯
喷 pēn/pèn | to spurt, to spray | 液体、气体等受压力而冲出来 | 愤坟
嚏 tì | sneeze | 鼻子受刺激后猛烈地出气并发出声音 | 啼嘻
腺 xiàn | gland | 身体里能分泌某些物质的组织 | 线泉
胰 yí | pancreas | 胃后面的一个器官，能帮助消化、控制血糖 | 姨夷
膀 bǎng/páng | shoulder; as in 膀胱 bladder | 肩，手臂上部和身体相连的部分 | 榜傍
骼 gé | bone, as in 骨骼 | 骨头 | 格胳
颊 jiá | cheek | 脸的两边 | 夹峡
僵 jiāng | stiff | 不能活动，不灵活 | 疆缰
`,
  `
厕 cè | toilet | 大小便的地方 | 侧测
皂 zào | soap | 洗东西用的去污用品 | 皇早
漱 shù | to rinse (the mouth) | 用水冲洗口腔 | 嗽激
秽 huì | dirty, filthy | 脏，不干净 | 岁秒
渍 zì | stain; to soak | 留在物体上很难去掉的痕迹；泡在水里 | 债积
涤 dí | to wash | 洗，清除干净 | 条涂
拭 shì | to wipe | 擦 | 试式
泌 mì | to secrete | 液体从身体里渗出来 | 必秘
垢 gòu | dirt, grime | 积在物体上的脏东西 | 后诟
筛 shāi | sieve; to sift, to screen | 分开粗细东西的工具；挑选 | 师帅
`,
  `
孕 yùn | pregnant | 怀着孩子 | 孙乃
哺 bǔ | to feed (a baby) | 给孩子吃奶 | 捕浦
乳 rǔ | milk; breast | 奶 | 孔浮
咀 jǔ | to chew, as in 咀嚼 | 嚼，慢慢地品味 | 组阻
膳 shàn | meals | 饭食 | 善缮
钙 gài | calcium | 一种金属元素，牙齿和骨头里很多 | 钓丐
碘 diǎn | iodine | 一种元素，食盐里常常加一点儿 | 典砷
嚼 jiáo/jué | to chew | 用牙齿把食物磨烂 | 爵嚷
滋 zī | to grow; to nourish | 生长；使得到养分 | 兹磁
艾 ài | mugwort; as in 艾滋病 AIDS | 一种草，叶子可以入药 | 文义
`,
  // Unit 5: Energy and Resources.
  `
钴 gǔ | cobalt | 一种银灰色金属，可用来做电池 | 估姑
柴 chái | firewood | 烧火用的树枝、木头 | 紫些
铀 yóu | uranium | 一种放射性金属，可作核燃料 | 油轴
锡 xī | tin | 一种银白色、很软的金属 | 赐踢
镍 niè | nickel | 一种银白色、不容易生锈的硬金属 | 臬锦
汞 gǒng | mercury | 平常温度下是液体的银白色金属 | 贡巩
锰 měng | manganese | 一种灰白色、很硬的金属 | 猛孟
渣 zhā | dregs, residue | 提取有用的部分以后留下的东西 | 查喳
砂 shā | sand, grit | 很细的石头粒 | 沙秒
沥 lì | to drip; as in 沥青 asphalt | 一滴一滴地落下 | 历苈
`,
  `
浊 zhuó | muddy, turbid | 水不清，不干净 | 独烛
涸 hé | dried up | 水干了 | 固洄
闸 zhá | sluice gate; brake | 控制水流的门；使机器停下的装置 | 押闹
涡 wō | whirlpool, eddy | 水流旋转形成的中间低下去的地方 | 祸锅
桨 jiǎng | oar; blade (of a propeller) | 划船的用具；像它那样的叶片 | 浆奖
汐 xī | evening tide | 夜里的潮水涨落 | 夕汀
阀 fá | valve | 控制管道里液体或气体流动的装置 | 伐阅
汲 jí | to draw (water) | 从下往上打水；吸取 | 级圾
堰 yàn | weir | 挡水的低坝 | 偃匾
烘 hōng | to dry or warm by a fire | 用火或热气使东西变干、变热 | 哄洪
`,
  `
灶 zào | kitchen stove | 用来烧火做饭的台子 | 灿杜
囱 cōng | chimney, as in 烟囱 | 让烟排出去的通道 | 囟匆
瓦 wǎ | roof tile; watt | 盖房顶用的烧过的土片；电功率单位 | 互凡
勘 kān | to survey | 实地查看，探测 | 堪甚
挖 wā | to dig | 用工具从地里取出土石等 | 控挣
凿 záo | chisel; to chisel | 打孔用的工具；在石头、木头上打孔 | 凶齿
硫 liú | sulphur | 一种黄色的非金属元素 | 流琉
焰 yàn | flame | 火苗 | 陷馅
秸 jiē | stalks (of crops) | 农作物收获以后留下的茎 | 桔洁
炊 chuī | to cook | 烧火做饭 | 吹饮
`,
  // Unit 6: Engineering and Inventions.
  `
墩 dūn | pier; block | 桥下支撑的柱子；大而整块的石头等 | 敦蹲
拱 gǒng | arch; to arch | 中间高、两头低的弧形结构 | 洪供
隧 suì | tunnel | 在地下或山中挖出的通道 | 遂坠
涵 hán | culvert; to contain | 公路下排水的管道；包含 | 函菡
枢 shū | pivot, hub | 门的转轴；关键的部分 | 区抠
纽 niǔ | button; knob; link | 衣服上的扣子；起联系作用的东西 | 扭钮
桩 zhuāng | stake, pile | 打进土里的柱子 | 庄脏
吊 diào | to hang; to lift by crane | 挂；用绳子等向上提 | 吕币
隙 xì | crack, gap | 裂开的缝；空着的时间或地方 | 际陈
渡 dù | to cross (water) | 从这岸到那岸 | 度镀
`,
  `
扳 bān | to pull, to turn | 用力使东西转动或改变方向 | 板扮
钳 qián | pliers, pincers | 能紧紧拿住东西的工具 | 甜钻
锯 jù | saw | 把木头等割开的、有齿的工具 | 据剧
刨 bào/páo | plane (tool); to dig | 把木头表面推平的工具；挖 | 创刻
斧 fǔ | axe | 砍木头的工具 | 爷谷
铲 chǎn | shovel, spade; to shovel | 挖土等用的工具；用这种工具挖 | 产铁
簧 huáng | spring (coil) | 有弹性的零件 | 黄篑
柄 bǐng | handle | 器物上手拿的部分 | 丙炳
筒 tǒng | tube, cylinder | 粗的管子 | 简同
刃 rèn | blade, edge | 刀等能切东西的那一边 | 刀忍
`,
  `
舵 duò | rudder | 控制船或飞机方向的装置 | 陀驼
艇 tǐng | light boat | 小船 | 挺庭
绕 rào | to wind; to go around | 围着转；从旁边走过去 | 浇烧
砌 qì | to lay (bricks or stones) | 用砖、石头和泥等一层层地建造 | 彻切
梭 suō | shuttle (of a loom) | 织布时带着线来回穿过的工具 | 俊唆
擎 qíng | to hold up | 往上托，举 | 警敬
镀 dù | to plate (with metal) | 在物体表面加上一层薄薄的金属 | 渡度
拧 nǐng/níng | to twist, to screw | 把东西转紧或转开；用力扭 | 柠宁
撬 qiào | to pry | 用工具插进缝里，用力把东西打开 | 橇毳
粘 zhān/nián | to stick, to glue; sticky | 用胶等把东西连在一起；像胶那样的 | 沾站
`,
];

/** wordBatches2 are the 48 word batches of units 4 to 6 of level 8, sixteen a unit, in teaching order. */
export const wordBatches2: readonly LevelWordBatch[] = [
  // Unit 4: Public Health.
  {
    theme: ["Epidemics", "流行病"],
    data: `
瘟疫 | wēn yì | plague, pestilence | 大范围流行、死人很多的急性传染病 | 古时候医疗条件差，一场＿＿往往会夺去成千上万人的生命。 | 流行病
流行病 | liú xíng bìng | epidemic disease | 在一个地区很多人同时得的病 | 流感是冬天常见的＿＿，学校里常常有很多学生同时生病。 | 瘟疫
暴发 | bào fā | to break out (of an epidemic) | 突然发生 | 那年夏天，镇上突然＿＿了一场痢疾，原因是井水被污染了。
防控 | fáng kòng | prevention and control | 预防和控制 | 做好传染病的＿＿工作，需要每个人的配合。
传播途径 | chuán bō tú jìng | route of transmission | 疾病从一个人传给另一个人的方式 | 饮用被污染的水，是霍乱的主要＿＿。 | 传染源
传染源 | chuán rǎn yuán | source of infection | 带有病原体、能把病传给别人的人或动物 | 在这次鼠疫中，老鼠是主要的＿＿，所以人们开始大力灭鼠。 | 传播途径
易感人群 | yì gǎn rén qún | susceptible group | 容易被传染的人 | 老人和小孩抵抗力比较差，是流感的＿＿。
病原体 | bìng yuán tǐ | pathogen | 能引起疾病的细菌、病毒等 | 显微镜发明以后，人们才看到了细菌这样的＿＿。
潜伏期 | qián fú qī | incubation period | 从被传染到出现症状的这段时间 | 这种病的＿＿大约是两个星期，这段时间里病人往往没有感觉。
疫区 | yì qū | epidemic area | 发生传染病的地区 | 从＿＿回来的人，要先在家观察几天，没有症状才能上班。
`,
  },
  {
    theme: ["Infectious Diseases", "传染病"],
    data: `
疟疾 | nüè ji | malaria | 由蚊子传播、发冷发热的传染病 | 一位中国女科学家找到了治疗＿＿的新药，因此获得了诺贝尔奖。
痢疾 | lì ji | dysentery | 一种拉肚子、大便带血的肠道传染病 | 吃了不干净的东西，他得了＿＿，一天拉了好几次肚子。 | 霍乱
霍乱 | huò luàn | cholera | 通过被污染的水传播、上吐下泻的急性传染病 | 十九世纪，一位英国医生发现，＿＿是通过被污染的水井传播的。 | 痢疾
天花 | tiān huā | smallpox | 一种曾经非常可怕、现在已经被消灭的传染病 | 人类靠接种疫苗，彻底消灭了＿＿。
艾滋病 | ài zī bìng | AIDS | 一种破坏免疫系统的传染病 | ＿＿可以通过血液传播，但是和病人一起吃饭、握手不会被传染。
结核病 | jié hé bìng | tuberculosis | 一种主要伤害肺的慢性传染病 | 得了＿＿的人常常长时间咳嗽，需要按时吃好几个月的药。
肝炎 | gān yán | hepatitis | 肝发炎的病 | 甲型＿＿主要是通过不干净的食物和水传播的。
流感 | liú gǎn | flu | 流行性感冒 | 每年秋天，很多老人都会去打＿＿疫苗。
手足口病 | shǒu zú kǒu bìng | hand, foot and mouth disease | 一种多见于小孩、手脚和嘴里长小疹子的传染病 | 幼儿园里有几个孩子得了＿＿，手上和嘴里都长了小疹子。
登革热 | dēng gé rè | dengue fever | 一种由蚊子传播、在热带常见的传染病 | ＿＿和疟疾一样，也是由蚊子传播的。
`,
  },
  {
    theme: ["Vaccines", "疫苗"],
    data: `
接种 | jiē zhòng | to inoculate | 把疫苗注射或口服到人体里 | 孩子出生以后，要按时＿＿各种疫苗。
预防针 | yù fáng zhēn | preventive injection | 为了预防疾病打的针 | 小明怕疼，每次打＿＿都要哭。 | 加强针
加强针 | jiā qiáng zhēn | booster shot | 为了让免疫效果更持久而再打的一针 | 打完前两针过了半年，医生建议他再打一针＿＿。 | 预防针
抗体 | kàng tǐ | antibody | 身体里能对付病原体的蛋白质 | 接种疫苗以后，身体里会产生＿＿，以后就不容易得这种病了。
免疫系统 | miǎn yì xì tǒng | immune system | 身体里抵抗疾病的系统 | 艾滋病病毒会破坏人的＿＿，使人很容易生病。
群体免疫 | qún tǐ miǎn yì | herd immunity | 很多人都有了免疫力，疾病就难以传播 | 当大多数人都接种了疫苗，就能形成＿＿，保护那些不能打疫苗的人。
接种率 | jiē zhòng lǜ | vaccination rate | 接种疫苗的人所占的比例 | 这个地区儿童的疫苗＿＿超过了百分之九十五。
不良反应 | bù liáng fǎn yìng | adverse reaction | 用药或打疫苗以后对身体不好的反应 | 打疫苗后有的人会有发热等＿＿，一般一两天就好了。
灭活疫苗 | miè huó yì miáo | inactivated vaccine | 用杀死的病原体做成的疫苗 | ＿＿里的病毒已经被杀死了，不会让人得病。
接种证 | jiē zhòng zhèng | vaccination certificate | 记录打疫苗情况的本子 | 孩子上幼儿园时，要交一份＿＿的复印件。
`,
  },
  {
    theme: ["Screening and Tracing", "筛查和追踪"],
    data: `
筛查 | shāi chá | to screen (for a disease) | 在很多人中检查出有病的人 | 学校每年给学生做一次视力＿＿，看看谁近视了。 | 普查
普查 | pǔ chá | general survey; census | 对所有的对象进行检查或调查 | 国家每十年进行一次人口＿＿。 | 筛查
检疫 | jiǎn yì | quarantine inspection | 为防止传染病传入，对人、动物、货物进行的检查 | 从国外进口的水果要先经过＿＿，才能在市场上出售。
排查 | pái chá | to check one by one | 一个一个地检查 | 卫生部门正在＿＿每一位和病人见过面的人。
密切接触者 | mì qiè jiē chù zhě | close contact | 和病人近距离接触过的人 | 病人确诊以后，他的家人作为＿＿也要接受检查。
阳性 | yáng xìng | positive (of a test) | 检查结果显示有某种病原体 | 他的检测结果是＿＿，说明他被感染了。
阴性 | yīn xìng | negative (of a test) | 检查结果显示没有某种病原体 | 检测结果是＿＿，他终于可以放心地回家了。
确诊 | què zhěn | to confirm a diagnosis | 经过检查，确定得了某种病 | 经过几次检查，医生终于＿＿他得的是肝炎。
疑似 | yí sì | suspected | 好像是，但是还不能确定 | 他有发热和咳嗽的症状，被当作＿＿病例送到了医院。
病例 | bìng lì | case (of a disease) | 得某种病的具体的人 | 这个月全市一共发现了三个流感＿＿。
`,
  },
  {
    theme: ["Protection", "防护"],
    data: `
隔离 | gé lí | to isolate | 让病人和别人分开 | 他得的是传染病，需要住在＿＿病房里，家人暂时不能去看他。
防护服 | fáng hù fú | protective suit | 保护身体不被传染的衣服 | 医生穿着白色的＿＿，从头到脚包得严严实实。
护目镜 | hù mù jìng | goggles | 保护眼睛的特制眼镜 | 做实验时要戴上＿＿，防止化学药品进入眼睛。
消毒水 | xiāo dú shuǐ | disinfectant | 能杀死病菌的液体 | 医院的走廊里有一股＿＿的味道。
通风 | tōng fēng | to ventilate | 让空气流通 | 屋里人多，要经常开窗＿＿。
勤洗手 | qín xǐ shǒu | to wash hands often | 经常洗手 | 饭前便后要＿＿，这是预防肠道传染病的好办法。
社交距离 | shè jiāo jù lí | social distance | 人和人之间为了防止传染而保持的距离 | 排队的时候，大家都保持一米以上的＿＿。
喷雾 | pēn wù | spray | 喷成雾一样的液体 | 天气太干，她往脸上喷了一点儿保湿＿＿。
防护 | fáng hù | protection | 防备和保护 | 在矿井下工作，要做好安全＿＿。
居家 | jū jiā | at home | 在家里 | 退休以后，他大部分时间＿＿，很少出门。
`,
  },
  {
    theme: ["Symptoms", "症状"],
    data: `
喷嚏 | pēn tì | sneeze | 鼻子受刺激后猛地出气发出的声音 | 他对花粉过敏，一到春天就不停地打＿＿。
鼻涕 | bí tì | nasal mucus | 鼻子里流出的液体 | 小弟弟感冒了，一直流＿＿。
唾液 | tuò yè | saliva | 嘴里的口水 | 吃饭时慢慢嚼，可以让食物和＿＿充分接触，帮助消化。
发热 | fā rè | to run a fever | 体温升高 | 他＿＿到三十九度，妈妈赶紧带他去医院。
乏力 | fá lì | weak, lacking strength | 没有力气 | 他最近总是感到疲倦＿＿，做什么都没有精神。 | 酸痛
酸痛 | suān tòng | aching | 又酸又痛 | 爬了一天山，他第二天腿＿＿得下不了楼。 | 乏力
僵硬 | jiāng yìng | stiff | 不能灵活活动 | 在电脑前坐了一上午，他觉得肩膀和后背都很＿＿。
脸颊 | liǎn jiá | cheek | 脸的两边 | 小女孩冻得＿＿通红。
口疮 | kǒu chuāng | mouth ulcer | 嘴里长的小疮 | 他最近总熬夜，嘴里长了好几个＿＿，吃饭都疼。
冻疮 | dòng chuāng | chilblain | 因为冷而在手脚上长的疮 | 以前冬天屋里没有暖气，很多孩子的手上都长了＿＿。
`,
  },
  {
    theme: ["Recovery", "康复"],
    data: `
痊愈 | quán yù | to recover completely | 病完全好了 | 他的病已经完全＿＿，身上一点儿症状也没有了。
安然无恙 | ān rán wú yàng | safe and sound | 平平安安，没有受伤 | 汽车翻到了路边，幸好车里的人都＿＿。
后遗症 | hòu yí zhèng | after-effect | 病好了以后留下的问题 | 他小时候得过一场大病，留下了走路不稳的＿＿。 | 并发症
瘫痪 | tān huàn | paralysed | 身体的一部分不能动 | 一场车祸使他下半身＿＿，只能坐轮椅。
偏瘫 | piān tān | hemiplegia | 身体的一边不能动 | 爷爷中风以后＿＿了，左手和左腿都不能动。
复发 | fù fā | to relapse | 病好了以后又发作 | 他的病刚好，医生提醒他要注意休息，防止＿＿。
并发症 | bìng fā zhèng | complication | 由一种病引起的另一种病 | 糖尿病如果控制不好，会引起很多＿＿。 | 后遗症
好转 | hǎo zhuǎn | to take a turn for the better | 变好 | 吃了几天药，他的咳嗽明显＿＿了。
恢复期 | huī fù qī | recovery period | 病好转以后身体慢慢复原的时间 | 手术以后有三个月的＿＿，这段时间不能做剧烈运动。
疗养 | liáo yǎng | to convalesce | 在安静的地方治疗、休养 | 他病好以后，去海边的一家＿＿院住了一个月。
`,
  },
  {
    theme: ["The Body", "人体"],
    data: `
腺体 | xiàn tǐ | gland | 身体里能分泌某些物质的器官 | 人体里有很多＿＿，有的分泌汗水，有的分泌消化液。
汗腺 | hàn xiàn | sweat gland | 皮肤里分泌汗水的腺体 | 狗身上的＿＿很少，所以天热时它们靠伸出舌头来散热。
甲状腺 | jiǎ zhuàng xiàn | thyroid | 颈前面的一个腺体 | 长期缺碘会引起＿＿肿大。
胰腺 | yí xiàn | pancreas | 胃后面的一个分泌消化液的腺体 | ＿＿在胃的后面，能分泌消化液，帮助消化食物。
胰岛素 | yí dǎo sù | insulin | 能降低血糖的激素 | 有的糖尿病人每天都要注射＿＿来控制血糖。
肩膀 | jiān bǎng | shoulder | 手臂和身体相连的部分 | 爸爸让儿子坐在自己的＿＿上看表演。
骨骼 | gǔ gé | skeleton | 身体里的骨头 | 儿童正在长身体，多晒太阳有利于＿＿发育。
内分泌 | nèi fēn mì | endocrine (system) | 腺体把激素直接送进血液的过程 | 医生说他脸上长痘是因为＿＿失调，和吃辣的东西没有关系。
脊柱 | jǐ zhù | spine | 背中间一节一节的骨头 | 坐的时候腰背要直，不要弯着身子，这样才能保护好＿＿。
消化道 | xiāo huà dào | digestive tract | 食物在身体里经过的通道 | 食物从嘴里进去，经过＿＿，一步步被消化吸收。
`,
  },
  {
    theme: ["Toilets and Sewage", "厕所和污水"],
    data: `
厕所 | cè suǒ | toilet | 供人大小便的地方 | 请问，这附近有＿＿吗？我想洗个手。 | 公厕
公厕 | gōng cè | public toilet | 公共场所供大家使用的厕所 | 这个公园新建了几座＿＿，游客方便多了。 | 厕所
旱厕 | hàn cè | pit latrine | 不用水冲的简易厕所 | 村里把老式的＿＿改成了水冲厕所，环境干净多了。
肥皂 | féi zào | soap | 洗衣服、洗手用的去污用品 | 奶奶习惯用＿＿洗衣服，说比洗衣粉好用。 | 香皂
香皂 | xiāng zào | toilet soap | 有香味的、洗手洗脸用的肥皂 | 她用＿＿洗了脸，身上有一股淡淡的花香。 | 肥皂
漱口 | shù kǒu | to rinse the mouth | 用水冲洗口腔 | 吃完饭以后，最好用清水＿＿。
排泄物 | pái xiè wù | excreta | 人或动物排出体外的大小便等 | 病人的＿＿要经过消毒处理，防止病菌传播。
下水道 | xià shuǐ dào | sewer | 排放污水的地下管道 | 不要把油倒进＿＿，时间长了会堵住。
污水处理 | wū shuǐ chǔ lǐ | sewage treatment | 把脏水变干净的过程 | 工厂排出的废水必须经过＿＿，才能排进河里。
化粪池 | huà fèn chí | septic tank | 处理厕所粪便的池子 | 农村修了＿＿以后，厕所里的脏东西不再直接流进河里。
`,
  },
  {
    theme: ["Pests and Mould", "害虫和霉菌"],
    data: `
霉斑 | méi bān | mould spots | 东西受潮后长出的小斑点 | 墙角长了一片黑色的＿＿，要用消毒水擦掉。
霉味 | méi wèi | musty smell | 东西受潮后发出的难闻的气味 | 很久没开窗的屋子里有一股＿＿。
霉变 | méi biàn | mould damage | 粮食等因为受潮而变质 | ＿＿的花生会产生有毒的物质，千万不能吃。
滋生 | zī shēng | to breed (of germs, pests) | 大量地生长、繁殖 | 夏天垃圾要及时清理，不然容易＿＿蚊虫。
灭蝇 | miè yíng | to kill flies | 消灭苍蝇 | 夏天饭店要做好＿＿工作，不让苍蝇落在食物上。
蚊虫 | wén chóng | mosquitoes and other insects | 蚊子一类的小虫 | 夏天的晚上＿＿很多，最好穿长袖衣服。
灭鼠 | miè shǔ | to exterminate rats | 消灭老鼠 | 为了预防鼠疫，村里开展了＿＿活动。
白蚁 | bái yǐ | termite | 一种会吃坏木头的昆虫 | 这座老房子的木头柱子被＿＿吃空了。
驱虫 | qū chóng | to repel insects | 赶走虫子 | 夏天去野外，最好带上＿＿的药水。
蝇拍 | yíng pāi | fly swatter | 打苍蝇的用具 | 他拿起＿＿，一下就打死了那只苍蝇。
`,
  },
  {
    theme: ["Clean and Dirty", "干净和脏"],
    data: `
污垢 | wū gòu | grime | 积在物体上的脏东西 | 洗澡可以洗去身上的＿＿。 | 污秽
水垢 | shuǐ gòu | limescale | 烧水的锅里积下的白色硬块 | 烧水的锅用久了，锅底会结一层白色的＿＿。
牙垢 | yá gòu | tartar | 牙齿上积的脏东西 | 他每半年去洗一次牙，把＿＿清理干净。
污渍 | wū zì | stain | 留在衣服等上面的脏痕迹 | 白衬衫上有一块咖啡留下的＿＿，很难洗掉。
油渍 | yóu zì | grease stain | 油留下的痕迹 | 厨房的墙上满是＿＿，要用热水才能洗干净。
污秽 | wū huì | filth | 不干净的东西 | 这条小河曾经满是＿＿，经过治理，现在又变清了。
洗涤 | xǐ dí | to wash | 用水去掉脏东西 | 这件毛衣只能用冷水手工＿＿。
洗涤剂 | xǐ dí jì | detergent | 洗东西用的化学用品 | 洗碗用的＿＿要冲干净，不要留在碗上。
擦拭 | cā shì | to wipe | 用布等擦 | 她每天都用湿布＿＿桌子和门把手。
去污 | qù wū | to remove dirt | 去掉脏东西 | 这种肥皂的＿＿能力很强，衣领上的黑印子一洗就掉。
`,
  },
  {
    theme: ["Mothers and Babies", "母亲和婴儿"],
    data: `
孕妇 | yùn fù | pregnant woman | 怀着孩子的女人 | 公交车上有专门给老人和＿＿留的座位。
孕期 | yùn qī | pregnancy | 怀孩子的那段时间 | 医生提醒她，＿＿要注意营养，按时休息。
哺乳 | bǔ rǔ | to breastfeed | 用自己的奶喂孩子 | 商场里有专门的母婴室，方便妈妈给孩子＿＿。
母乳 | mǔ rǔ | breast milk | 妈妈的奶 | 医生说，＿＿是新生儿最好的食物。
哺育 | bǔ yù | to nurture | 喂养，培育 | 黄河像母亲一样＿＿了两岸的人民。
婴幼儿 | yīng yòu ér | infants and young children | 婴儿和两三岁的幼儿 | 这种药不适合＿＿服用，只能给大人吃。 | 新生儿
新生儿 | xīn shēng ér | newborn | 刚出生不久的孩子 | 护士给每个＿＿都戴上了写着妈妈名字的小手环。
产检 | chǎn jiǎn | prenatal check-up | 怀孩子期间的定期检查 | 她每个月都去医院做＿＿，看看孩子长得好不好。
早产 | zǎo chǎn | premature birth | 孩子没有足月就出生 | 这个孩子是＿＿的，比预产期早了一个多月出生。
乳牙 | rǔ yá | milk tooth | 小孩最早长的牙 | 小孩子六七岁开始换牙，＿＿一颗颗掉下来。
`,
  },
  {
    theme: ["Nutrition", "营养"],
    data: `
膳食 | shàn shí | meals, diet | 每天吃的饭菜 | 学校食堂请营养师来安排学生的＿＿。
补钙 | bǔ gài | to take calcium | 让身体得到更多的钙 | 老人骨头容易断，医生建议他多喝牛奶＿＿。
钙片 | gài piàn | calcium tablet | 含钙的药片 | 奶奶每天晚饭后吃一片＿＿。
碘盐 | diǎn yán | iodized salt | 加了碘的食盐 | 在内陆山区，吃＿＿可以预防甲状腺肿大。
缺碘 | quē diǎn | iodine deficiency | 身体里的碘不够 | 长期＿＿会使甲状腺变大。
咀嚼 | jǔ jué | to chew | 用牙齿把食物磨烂 | 老人的牙不好，＿＿比较硬的东西很吃力。
细嚼慢咽 | xì jiáo màn yàn | to chew well and swallow slowly | 吃饭时慢慢地吃 | 吃饭要＿＿，吃得太快对胃不好。
营养均衡 | yíng yǎng jūn héng | balanced nutrition | 各种营养都有，不多也不少 | 每顿饭都要有菜有肉，才能做到＿＿。
滋补 | zī bǔ | to nourish (with tonics) | 用有营养的食物或药物补养身体 | 中医认为，冬天适合吃一些＿＿身体的食物。
乳制品 | rǔ zhì pǐn | dairy products | 用牛奶等做成的食品 | 牛奶、酸奶都属于＿＿。
`,
  },
  {
    theme: ["Addiction", "成瘾"],
    data: `
上瘾 | shàng yǐn | to get hooked | 爱好某种东西，离不开它 | 这个游戏太好玩了，他玩了几天就＿＿了。 | 成瘾
成瘾 | chéng yǐn | addiction | 形成离不开的依赖 | 吸烟容易＿＿，所以最好一开始就不要吸。 | 上瘾
网瘾 | wǎng yǐn | internet addiction | 过分迷恋上网 | 他有严重的＿＿，每天上网十几个小时。
烟瘾 | yān yǐn | craving for cigarettes | 对吸烟的强烈需要 | 爷爷以前＿＿很大，后来为了健康终于戒了烟。
吸烟区 | xī yān qū | smoking area | 允许吸烟的地方 | 机场里设有专门的＿＿，其他地方都不能吸烟。
控烟 | kòng yān | tobacco control | 控制吸烟 | 很多城市出台了＿＿条例，在公共场所禁止吸烟。
戒除 | jiè chú | to give up (a habit) | 改掉不好的习惯 | 他下决心＿＿熬夜的坏习惯。
自控 | zì kòng | self-control | 控制自己 | 小孩子的＿＿能力比较弱，家长要帮助他们合理安排上网时间。
烟民 | yān mín | smoker | 吸烟的人 | 随着控烟宣传的深入，＿＿的数量在逐年下降。
沉迷 | chén mí | to be hooked on | 深深地迷恋，不能自拔 | 他＿＿于手机游戏，成绩下降得很厉害。
`,
  },
  {
    theme: ["The Public Health System", "公共卫生体系"],
    data: `
公共卫生 | gōng gòng wèi shēng | public health | 保护全体人民健康的事业 | 干净的饮用水是＿＿的基础。 | 医疗卫生
疾控中心 | jí kòng zhōng xīn | centre for disease control | 负责预防和控制疾病的机构 | 发现传染病病例后，医院要马上向＿＿报告。 | 卫生部门
卫生院 | wèi shēng yuàn | township health centre | 乡镇里的小医院 | 村民生了小病，一般去镇上的＿＿看。
防疫站 | fáng yì zhàn | epidemic prevention station | 以前负责预防传染病的机构 | 以前，孩子打预防针要去＿＿，现在大多在社区医院打。
家庭医生 | jiā tíng yī shēng | family doctor | 和家庭签约、长期照顾一家人健康的医生 | 社区给每户老人都安排了＿＿，有问题可以随时打电话。
卫生部门 | wèi shēng bù mén | health authority | 政府里管理卫生工作的部门 | ＿＿每年都会检查饭店的厨房是否干净。 | 疾控中心
基层医疗 | jī céng yī liáo | primary health care | 最接近居民的医疗服务 | 发展＿＿，让村民在家门口就能看病。
医疗卫生 | yī liáo wèi shēng | health care | 治病和预防疾病的事业 | 国家每年都在＿＿方面投入大量资金。 | 公共卫生
卫生监督 | wèi shēng jiān dū | health inspection | 检查饭店、学校等是否符合卫生要求 | ＿＿人员来到这家饭店，检查了厨房和餐具。
赤脚医生 | chì jiǎo yī shēng | barefoot doctor | 二十世纪六七十年代中国农村里半农半医的人员 | 爷爷年轻时当过＿＿，一边种地一边给村民看病。
`,
  },
  {
    theme: ["Health Statistics", "卫生统计"],
    data: `
发病率 | fā bìng lǜ | incidence rate | 一定时间里新得某种病的人所占的比例 | 冬天流感的＿＿比夏天高得多。 | 患病率
患病率 | huàn bìng lǜ | prevalence | 某个时间有某种病的人所占的比例 | 近视在中学生中的＿＿很高，一半以上的学生都戴眼镜。 | 发病率
感染率 | gǎn rǎn lǜ | infection rate | 被传染的人所占的比例 | 研究发现，经常洗手的人，肠道传染病的＿＿明显更低。 | 发病率 患病率
死亡率 | sǐ wáng lǜ | mortality rate | 死去的人所占的比例 | 随着医疗水平的提高，新生儿的＿＿大大降低了。
治愈率 | zhì yù lǜ | cure rate | 病被治好的人所占的比例 | 这种病如果发现得早，＿＿可以达到百分之九十以上。
流行病学 | liú xíng bìng xué | epidemiology | 研究疾病在人群中怎样分布和传播的学科 | 她是一位＿＿专家，研究传染病是怎样在人群中传播的。
抽样 | chōu yàng | sampling | 从全体中选出一部分来调查 | 这次调查采用＿＿的方法，只调查了一千个家庭。
统计数据 | tǒng jì shù jù | statistics | 经过收集和计算得到的数字 | 根据卫生部门的＿＿，今年的流感病人比去年少。
健康状况 | jiàn kāng zhuàng kuàng | state of health | 身体好坏的情况 | 退休以后坚持锻炼，他的＿＿越来越好。
高发 | gāo fā | high incidence | 发生得多 | 春季是流感的＿＿季节，要注意预防。
`,
  },
  // Unit 5: Energy and Resources.
  {
    theme: ["Fossil Fuels", "化石燃料"],
    data: `
化石燃料 | huà shí rán liào | fossil fuel | 煤、石油、天然气等由古代生物变成的燃料 | 煤、石油和天然气都是＿＿，用完就没有了。
无烟煤 | wú yān méi | anthracite | 燃烧时烟很少的一种煤 | ＿＿燃烧时几乎不冒烟，以前常用来烧炉子取暖。
原油 | yuán yóu | crude oil | 从地下开采出来、还没有加工的石油 | 从油井里开采出来的＿＿，要送到工厂去加工。
柴油 | chái yóu | diesel | 一种从石油中提炼出来、多用于大卡车的燃料 | 大卡车和拖拉机大多烧＿＿，不烧汽油。
煤油 | méi yóu | kerosene | 一种从石油中提炼出来、以前常用来点灯的燃料 | 以前农村没有电，晚上点的是＿＿灯。
页岩气 | yè yán qì | shale gas | 储存在页岩里的天然气 | 美国大量开采＿＿以后，天然气的产量大大增加了。
液化气 | yè huà qì | liquefied petroleum gas | 压成液体装在罐里的燃气 | 没有通天然气的地方，人们做饭常用罐装的＿＿。
火力发电 | huǒ lì fā diàn | thermal power generation | 用烧煤等产生的热来发电 | 中国的电大部分来自＿＿，主要靠烧煤。
油田 | yóu tián | oilfield | 地下有大量石油、可以开采的地区 | 大庆＿＿是中国有名的石油产地。
煤层 | méi céng | coal seam | 地下一层一层的煤 | 这里的＿＿埋得不深，开采起来比较容易。
`,
  },
  {
    theme: ["Prospecting and Mining", "勘探和开采"],
    data: `
勘探 | kān tàn | to prospect | 查明地下矿产的情况 | 地质队在这片山区＿＿了三年，终于找到了一个大铜矿。 | 勘测
勘测 | kān cè | to survey | 实地查看和测量 | 修铁路以前，工程师要先＿＿沿线的地形。 | 勘探
开采 | kāi cǎi | to extract (minerals) | 把地下的矿产挖出来 | 这座煤矿已经＿＿了一百多年，煤快挖完了。 | 挖掘
挖掘 | wā jué | to excavate | 挖 | 工人们用机器＿＿地基，准备盖大楼。 | 开采
矿产 | kuàng chǎn | mineral resources | 地下的各种矿物 | 这个国家地下的＿＿非常丰富，有煤、铁、铜等。
露天矿 | lù tiān kuàng | open-pit mine | 在地面上直接开采的矿 | 这座＿＿的煤就在地面下不深的地方，不用打井就能开采。
矿井 | kuàng jǐng | mine shaft | 为开采矿产挖的井 | 工人们每天坐着升降机下到几百米深的＿＿里工作。
矿工 | kuàng gōng | miner | 在矿里工作的工人 | 爷爷年轻时是一名＿＿，在井下挖了二十年煤。
储量 | chǔ liàng | reserves | 地下矿产的数量 | 这个油田的石油＿＿很大，可以开采几十年。
选矿 | xuǎn kuàng | ore dressing | 把矿石中有用的部分选出来 | 开采出来的矿石要先经过＿＿，去掉没用的石头。
`,
  },
  {
    theme: ["Metals and Elements", "金属和元素"],
    data: `
锡 | xī | tin | 一种银白色、很软的金属 | 古代的青铜是铜和＿＿的合金。
镍 | niè | nickel | 一种银白色、不容易生锈的硬金属 | 美国的五分钱硬币里含有＿＿，人们也用这种金属的名字叫这种硬币。
钴 | gǔ | cobalt | 一种银灰色的金属，可用来做电池 | 古代的工匠用含＿＿的颜料，烧出了蓝白相间的青花瓷。
锰 | měng | manganese | 一种灰白色、很硬的金属 | 炼钢时加入一些＿＿，可以使钢更硬、更耐磨。
汞 | gǒng | mercury | 平常温度下是液体的银白色金属 | 老式体温计里的银色液体是＿＿，打破了要小心处理。
铀 | yóu | uranium | 一种放射性金属，可作核燃料 | 核电站用＿＿作燃料来发电。
硫 | liú | sulphur | 一种黄色的非金属元素 | 火山口附近常常能看到黄色的＿＿。
稀土 | xī tǔ | rare earth | 十几种很少见的金属元素的总称 | 中国是世界上＿＿产量最多的国家。
有色金属 | yǒu sè jīn shǔ | non-ferrous metal | 除了铁等以外的金属 | 铜、铝、锡都属于＿＿。 | 贵金属
贵金属 | guì jīn shǔ | precious metal | 金、银等价格很高的金属 | 金、银这样的＿＿常常被用来做首饰。 | 有色金属
`,
  },
  {
    theme: ["Ores and Smelting", "矿石和冶炼"],
    data: `
铁矿 | tiě kuàng | iron ore | 含铁的矿石 | 炼钢需要大量的＿＿，中国每年要从国外进口很多。
铜矿 | tóng kuàng | copper mine | 含铜的矿 | 智利有世界上最大的＿＿，铜的产量世界第一。
金矿 | jīn kuàng | gold mine | 含金的矿 | 一百多年前，人们在美国加州发现了＿＿，很多人从各地赶去淘金。
铁水 | tiě shuǐ | molten iron | 熔化成液体的铁 | 高炉里流出了通红的＿＿。 | 钢水
钢水 | gāng shuǐ | molten steel | 熔化成液体的钢 | 炼钢炉里的＿＿温度高达一千六百多度。 | 铁水
锡器 | xī qì | tinware | 用锡做的器物 | 这个茶叶罐是＿＿，能让茶叶保存得很好。
水银 | shuǐ yín | mercury (common name) | 汞的通俗叫法 | 温度计里的＿＿遇热会膨胀。
锡纸 | xī zhǐ | tinfoil | 很薄的金属纸 | 烤红薯的时候，可以用＿＿把红薯包起来。
锰钢 | měng gāng | manganese steel | 加了锰的硬钢 | ＿＿又硬又耐磨，常用来做铁轨。
钢材 | gāng cái | steel products | 用钢做成的各种材料 | 盖这座大楼用了几万吨＿＿。
`,
  },
  {
    theme: ["Firewood and Charcoal", "柴和炭"],
    data: `
柴火 | chái huo | firewood | 烧火用的树枝、草等 | 以前农村做饭烧＿＿，孩子们放学后常去山上找。 | 木柴
木柴 | mù chái | firewood (logs) | 砍开的木头，用来烧火 | 他把＿＿放进壁炉里，屋里很快就暖和了。 | 柴火
火苗 | huǒ miáo | small flame | 小小的火焰 | 一阵风过来，炉子里的＿＿又旺了起来。 | 火焰
薪火相传 | xīn huǒ xiāng chuán | to pass the torch | 比喻学问、技艺等一代一代传下去 | 这门手艺在他们家＿＿，已经传了五代。
焰火 | yàn huǒ | fireworks | 节日里放的、在空中开出彩色火花的东西 | 新年晚上，广场上放起了美丽的＿＿。
火焰 | huǒ yàn | flame | 燃烧时发光发热的部分 | 炉子里的＿＿是蓝色的，说明燃烧得很充分。 | 火苗
杯水车薪 | bēi shuǐ chē xīn | a drop in the bucket | 一杯水救不了一车着火的柴，比喻力量太小，解决不了问题 | 他们家的医药费要几十万，这一点儿捐款只是＿＿。
秸秆 | jiē gǎn | crop stalks | 农作物收获以后留下的茎和叶 | 以前农民收完庄稼就在地里烧＿＿，现在这样做已经被禁止了。
生物质 | shēng wù zhì | biomass | 可以用作能源的植物、动物粪便等 | 秸秆、树枝都属于＿＿能源。
烧柴 | shāo chái | to burn firewood | 用柴做燃料 | 现在村里家家都用上了天然气，很少有人再＿＿做饭了。
`,
  },
  {
    theme: ["Stoves and Chimneys", "炉灶和烟囱"],
    data: `
炉灶 | lú zào | kitchen range | 做饭用的炉子和灶 | 新房子的厨房里装上了新的＿＿。 | 灶台
灶台 | zào tái | stove top | 灶上放锅的平台 | 做完饭，妈妈把＿＿擦得干干净净。 | 炉灶
煤炉 | méi lú | coal stove | 烧煤的炉子 | 以前冬天在屋里生＿＿取暖，要注意开窗通风，防止煤气中毒。 | 火炉
火炉 | huǒ lú | stove (for heating) | 生火取暖的炉子 | 冬天，一家人围坐在＿＿旁边聊天。 | 煤炉
烟囱 | yān cōng | chimney | 让炉灶等的烟排到外面的高管子 | 工厂的＿＿冒着黑烟。
炊烟 | chuī yān | smoke from kitchen chimneys | 做饭时冒出的烟 | 天快黑了，村子里家家户户升起了＿＿。
炊具 | chuī jù | cooking utensils | 做饭用的锅、碗等工具 | 去野外露营，要带上帐篷和简单的＿＿。
烘干 | hōng gān | to dry (by heat) | 用热使东西变干 | 下雨天衣服晒不干，只好用机器＿＿。
烘烤 | hōng kǎo | to bake | 用火或热气烤 | 面包要放进烤箱里＿＿二十分钟。
燃气灶 | rán qì zào | gas stove | 烧天然气或煤气的灶 | 用完＿＿，一定要关好开关。
`,
  },
  {
    theme: ["Electricity", "电力"],
    data: `
发电站 | fā diàn zhàn | power station | 生产电力的工厂 | 这座＿＿发出的电，够一百万户家庭使用。
电网 | diàn wǎng | power grid | 把发电站和用户连起来的输电线路 | 风力发电站发出的电要接入＿＿，才能送到千家万户。
输电 | shū diàn | to transmit electricity | 把电从一个地方送到另一个地方 | 西部的电要通过长长的＿＿线路送到东部城市。
停电 | tíng diàn | power cut | 电停止供应 | 昨天晚上突然＿＿了，我们只好用手机照明。
用电量 | yòng diàn liàng | electricity consumption | 用电的多少 | 夏天开空调的人多，城市的＿＿大大增加。
千瓦 | qiān wǎ | kilowatt | 功率单位，等于一千个瓦特 | 这台空调的功率是两＿＿。
瓦特 | wǎ tè | watt; James Watt | 功率单位；改良蒸汽机的英国人 | 改良蒸汽机的英国人叫＿＿，功率的单位就是用他的名字命名的。
变电站 | biàn diàn zhàn | substation | 改变电压的地方 | 高压电要先经过＿＿把电压降低，才能送进居民家里。
高压线 | gāo yā xiàn | high-voltage line | 输送高压电的电线 | 不要在＿＿下面放风筝，非常危险。
电闸 | diàn zhá | power switch | 控制电路通断的开关 | 修电灯以前，要先把＿＿拉下来。
`,
  },
  {
    theme: ["Water Power", "水力"],
    data: `
水力发电 | shuǐ lì fā diàn | hydroelectric power | 利用水流的力量发电 | 三峡大坝是世界上最大的＿＿工程。
水能 | shuǐ néng | water energy | 水流所具有的能量 | 这条河落差大、水量多，＿＿资源非常丰富。
落差 | luò chā | drop in height | 两个地方高度的差 | 这个瀑布上下的＿＿有一百多米。
闸门 | zhá mén | sluice gate | 控制水流的门 | 大雨过后，水库打开＿＿放水。 | 水闸
水闸 | shuǐ zhá | sluice | 建在河上控制水流的建筑 | 河上修了一座＿＿，可以控制下游的水量。 | 闸门
船闸 | chuán zhá | ship lock | 帮助船通过大坝的设施 | 轮船要通过＿＿，才能从大坝的下游开到上游。
涡轮机 | wō lún jī | turbine | 靠水流、气流推动叶轮转动的机器 | 水流冲击＿＿，使它转动起来，带动发电机发电。 | 水轮机
水轮机 | shuǐ lún jī | water turbine | 靠水流推动的涡轮机 | 水电站里的＿＿被水流冲得飞快地转动。 | 涡轮机
都江堰 | dū jiāng yàn | Dujiangyan irrigation system | 两千多年前在四川修建的水利工程 | ＿＿是两千多年前修建的水利工程，到今天还在灌溉成都平原。
抽水 | chōu shuǐ | to pump water | 用机器把水吸上来 | 天旱的时候，农民用水泵从河里＿＿浇地。
`,
  },
  {
    theme: ["Wind and Tides", "风和潮汐"],
    data: `
潮汐 | cháo xī | tide | 海水定时涨落的现象 | ＿＿是由月亮和太阳的引力引起的。
潮汐能 | cháo xī néng | tidal energy | 海水涨落产生的能量 | 利用海水涨落产生的＿＿，可以发电。
涨潮 | zhǎng cháo | rising tide | 海水上涨 | ＿＿的时候，海水会盖住这片沙滩，要早点儿离开。
退潮 | tuì cháo | ebb tide | 海水下降 | ＿＿以后，海边露出了一大片沙滩。
风力发电 | fēng lì fā diàn | wind power | 用风的力量发电 | 这片草原上风很大，适合发展＿＿。 | 风电场 海上风电
风电场 | fēng diàn chǎng | wind farm | 很多风力发电机组成的发电场 | 海边的＿＿里，几十台大风车在不停地转动。 | 风力发电 海上风电
螺旋桨 | luó xuán jiǎng | propeller | 靠转动推动船或飞机前进的装置 | 小飞机的＿＿转得飞快，飞机开始在跑道上滑行。
叶片 | yè piàn | blade | 风车、涡轮机等上面像叶子一样的部分 | 一台大型风力发电机的＿＿长达几十米。
船桨 | chuán jiǎng | oar | 划船用的工具 | 他用力划着＿＿，小船很快到了对岸。
海上风电 | hǎi shàng fēng diàn | offshore wind power | 在海上建的风力发电 | ＿＿不占用陆地，海上的风也比陆地上更大、更稳定。 | 风力发电 风电场
`,
  },
  {
    theme: ["New Energy", "新能源"],
    data: `
光伏 | guāng fú | photovoltaic | 把太阳光直接变成电的技术 | 很多农民在屋顶上装了＿＿板，发的电还能卖给电网。
可再生能源 | kě zài shēng néng yuán | renewable energy | 用了以后还能自然恢复的能源 | 风能、太阳能和水能都是＿＿，用不完。 | 清洁能源
清洁能源 | qīng jié néng yuán | clean energy | 使用时不产生污染的能源 | 用＿＿代替煤，可以减少空气污染。 | 可再生能源
新能源汽车 | xīn néng yuán qì chē | new energy vehicle | 用电等新型能源的汽车 | 在中国，＿＿的车牌是绿色的，很容易认出来。
氢能 | qīng néng | hydrogen energy | 用氢作燃料产生的能量 | ＿＿燃烧以后只产生水，非常干净。
地热 | dì rè | geothermal heat | 地球内部的热 | 冰岛利用丰富的＿＿资源发电和取暖。
储能 | chǔ néng | energy storage | 把能量储存起来 | 太阳能晚上不能发电，所以需要＿＿设备把白天的电存起来。
太阳能热水器 | tài yáng néng rè shuǐ qì | solar water heater | 利用太阳光加热水的装置 | 屋顶上装了＿＿，晴天的时候洗澡不用花电费。
动力电池 | dòng lì diàn chí | traction battery | 给电动车提供动力的电池 | 一辆电动汽车最贵的部分往往是它的＿＿。
充电站 | chōng diàn zhàn | charging station | 给电动车充电的地方 | 高速公路的服务区都建了＿＿，开电动车出远门也方便了。
`,
  },
  {
    theme: ["Nuclear Energy", "核能"],
    data: `
核燃料 | hé rán liào | nuclear fuel | 核电站里用来产生能量的放射性物质 | 铀是核电站最常用的＿＿。
核反应堆 | hé fǎn yìng duī | nuclear reactor | 核电站里产生核能的装置 | 核电站的心脏是＿＿，那里每时每刻都在进行核裂变。
浓缩铀 | nóng suō yóu | enriched uranium | 提高了有用成分比例的铀 | 天然的铀要经过加工变成＿＿，才能用作核燃料。
放射性 | fàng shè xìng | radioactivity | 某些元素放出射线的性质 | 铀具有＿＿，人长时间接触会损害健康。
核废料 | hé fèi liào | nuclear waste | 核电站用过的、有放射性的废物 | ＿＿要密封起来，埋在很深的地下。
核泄漏 | hé xiè lòu | nuclear leak | 放射性物质从核设施里漏出来 | 大地震以后，日本一座核电站发生了＿＿。
核安全 | hé ān quán | nuclear safety | 核设施不发生事故 | 核电站必须把＿＿放在第一位。
核聚变 | hé jù biàn | nuclear fusion | 轻的原子核结合成重的原子核 | 太阳发光发热靠的是＿＿。
铀矿 | yóu kuàng | uranium ore | 含铀的矿 | 从＿＿里开采出来的铀，要经过加工才能用作燃料。
核辐射 | hé fú shè | nuclear radiation | 放射性物质发出的射线 | 在核电站工作的人要穿防护服，防止受到＿＿。
`,
  },
  {
    theme: ["Water Resources", "水资源"],
    data: `
干涸 | gān hé | dried up | 河、湖等的水干了 | 连续三年没下雨，这条小河已经＿＿了。
汲取 | jí qǔ | to draw, to absorb | 吸取 | 树根从土里＿＿水分和养分。
汲水 | jí shuǐ | to draw water | 从井里打水 | 古时候，人们用木桶从井里＿＿。
地下水 | dì xià shuǐ | groundwater | 地面以下的水 | 过度抽取＿＿，会使地面慢慢下沉。
淡水 | dàn shuǐ | fresh water | 不含盐或含盐很少的水 | 地球上的水大部分是海水，＿＿只占很小一部分。
缺水 | quē shuǐ | water shortage | 水不够用 | 这个地区严重＿＿，居民每天只能用很少的水。
节水 | jié shuǐ | water saving | 节约用水 | 洗菜的水可以用来浇花，这是一个＿＿的好办法。
水库 | shuǐ kù | reservoir | 拦住河水、储存水的人工湖 | 城市的自来水主要来自郊区的一座＿＿。
打井 | dǎ jǐng | to dig a well | 挖井 | 这个村子没有自来水，村民们只好自己＿＿取水。
浊 | zhuó | muddy | 不清 | 下了一场大雨，河水变得又黄又＿＿。
`,
  },
  {
    theme: ["Pollution from Energy", "能源和污染"],
    data: `
二氧化硫 | èr yǎng huà liú | sulphur dioxide | 烧煤时产生的一种有毒气体 | 燃煤产生的＿＿是形成酸雨的主要原因。
硫黄 | liú huáng | sulphur (substance) | 黄色的硫 | ＿＿是制造火药的原料之一。
烟尘 | yān chén | smoke and dust | 烟和灰尘 | 工厂装了除尘设备以后，排出的＿＿少多了。
废渣 | fèi zhā | waste residue | 工厂排出的固体废物 | 工厂的＿＿不能随便堆放，要运到专门的地方处理。 | 炉渣 煤渣
炉渣 | lú zhā | slag | 炼铁等时炉子里留下的渣 | 炼铁产生的＿＿可以用来做水泥。 | 废渣 煤渣
煤渣 | méi zhā | coal cinder | 煤烧过后留下的东西 | 以前冬天下雪以后，人们常常把＿＿铺在路上防滑。 | 废渣 炉渣
废气 | fèi qì | waste gas | 工厂等排出的有害气体 | 工厂排放的＿＿里含有二氧化硫等有害气体，必须经过处理。
汞污染 | gǒng wū rǎn | mercury pollution | 汞造成的污染 | 这个湖受到了＿＿，湖里的鱼不能吃。
污浊 | wū zhuó | foul, dirty | 不干净 | 屋里人多，空气很＿＿，快开窗吧。
排污 | pái wū | to discharge pollutants | 排放污水、废气等 | 这家工厂偷偷向河里＿＿，被罚了很多钱。
`,
  },
  {
    theme: ["Saving Energy", "节约能源"],
    data: `
耗能 | hào néng | to consume energy | 用掉很多电或燃料 | 这种老式冰箱很＿＿，一个月要用很多电。
能耗 | néng hào | energy consumption | 消耗能源的多少 | 新的生产线使工厂的＿＿降低了三成。
节约用电 | jié yuē yòng diàn | to save electricity | 少用电 | 离开教室时随手关灯，是＿＿的好习惯。
节能灯 | jié néng dēng | energy-saving lamp | 用电少的灯 | 把普通灯泡换成＿＿，可以省下不少电费。
碳中和 | tàn zhōng hé | carbon neutrality | 排放的二氧化碳和吸收的一样多 | 很多国家都提出要在本世纪中叶实现＿＿。
隔热 | gé rè | heat insulation | 挡住热量传递 | 这种窗户有很好的＿＿效果，夏天屋里不会太热。
暖气片 | nuǎn qì piàn | radiator | 屋里散发暖气的金属片 | 冬天把湿衣服放在＿＿上，很快就干了。
热水器 | rè shuǐ qì | water heater | 把水加热的设备 | 洗澡前要先打开＿＿，等水热了再洗。
待机 | dài jī | standby | 电器开着但不工作的状态 | 电视不看的时候最好拔掉插头，因为＿＿也会耗电。
电表 | diàn biǎo | electricity meter | 记录用了多少电的仪表 | 工作人员每个月来查一次＿＿，看看我们家用了多少度电。
`,
  },
  {
    theme: ["Limited Resources", "有限的资源"],
    data: `
耗尽 | hào jìn | to use up | 全部用完 | 石油总有一天会被＿＿，所以要早点儿发展新能源。
储备 | chǔ bèi | reserves; to stockpile | 存起来备用 | 国家＿＿了大量石油，以防万一。
不可再生 | bù kě zài shēng | non-renewable | 用掉了就不能再产生 | 煤和石油都是＿＿的资源，用一点儿就少一点儿。
稀缺 | xī quē | scarce | 很少，不够 | 在沙漠地区，水是最＿＿的资源。
过度开采 | guò dù kāi cǎi | over-exploitation | 开采得太多 | 由于＿＿，这座矿山的资源很快就用完了。
能源危机 | néng yuán wēi jī | energy crisis | 能源严重不足造成的危机 | 二十世纪七十年代，石油价格突然大涨，引发了一场＿＿。
能源结构 | néng yuán jié gòu | energy mix | 各种能源所占的比例 | 中国正在调整＿＿，减少煤的比例，增加清洁能源。
竭泽而渔 | jié zé ér yú | to drain the pond to catch the fish | 只顾眼前利益，不顾长远 | 为了眼前的利益过度开采资源，是＿＿的做法。
开源节流 | kāi yuán jié liú | to open new sources and cut use | 增加来源，节省开支 | 面对水资源短缺，城市一方面引水，一方面节水，做到＿＿。
循环利用 | xún huán lì yòng | to recycle | 重复使用 | 废纸、塑料瓶都可以＿＿。
`,
  },
  {
    theme: ["Oil and Gas", "石油和天然气"],
    data: `
炼油 | liàn yóu | to refine oil | 把原油加工成汽油等 | 这座＿＿厂每年能加工一千万吨原油。
输油管 | shū yóu guǎn | oil pipeline | 输送石油的管道 | 一条几千公里长的＿＿，把石油从油田送到了沿海的工厂。
油井 | yóu jǐng | oil well | 开采石油的井 | 这口＿＿每天能产几十吨原油。
钻井 | zuān jǐng | to drill wells | 用机器向地下打深井 | 工人们正在用机器＿＿，寻找地下的石油。
阀门 | fá mén | valve | 控制液体或气体流动的装置 | 修水管以前，要先关上总＿＿。
油罐 | yóu guàn | oil tank | 储存油的大罐 | 加油站地下埋着几个大＿＿，里面储存着汽油。
瓦斯 | wǎ sī | firedamp | 煤矿里的可燃气体 | 煤矿里的＿＿如果爆炸，后果非常严重。
安全阀 | ān quán fá | safety valve | 压力太高时自动打开的阀门 | 高压锅上有一个＿＿，压力太大时会自动放气。
石油化工 | shí yóu huà gōng | petrochemicals | 用石油做原料生产化工产品的工业 | 塑料、化肥很多都是＿＿产品。
油轮 | yóu lún | oil tanker | 运输石油的大船 | 一艘巨大的＿＿正在港口卸下从中东运来的原油。
`,
  },
  // Unit 6: Engineering and Inventions.
  {
    theme: ["Bridges", "桥梁"],
    data: `
桥墩 | qiáo dūn | bridge pier | 支撑桥身的柱子 | 这座大桥的＿＿立在江底，承受着整座桥的重量。
拱桥 | gǒng qiáo | arch bridge | 桥身中间高、两头低、弯弯的桥 | 公园的小河上有一座＿＿，和水中的倒影合起来像一个圆。 | 石拱桥
石拱桥 | shí gǒng qiáo | stone arch bridge | 用石头砌成的拱桥 | 中国河北有一座一千四百多年前建成的＿＿，至今还能使用。 | 拱桥
吊桥 | diào qiáo | rope bridge; drawbridge | 用绳索或铁链吊起来的桥 | 走在山谷上的＿＿上，脚下的木板一直在动，他紧张得不敢往下看。 | 悬索桥
斜拉桥 | xié lā qiáo | cable-stayed bridge | 用很多斜着的钢索拉住桥面的桥 | ＿＿的桥塔上有很多斜着的钢索，把桥面拉住。
悬索桥 | xuán suǒ qiáo | suspension bridge | 用两根大钢索把桥面吊起来的桥 | 美国旧金山的金门大桥是一座有名的＿＿。 | 吊桥
跨度 | kuà dù | span | 桥等两个支点之间的距离 | 这座桥的＿＿有一千多米，中间没有一个桥墩。
桥面 | qiáo miàn | bridge deck | 桥上走人走车的部分 | 下雪以后，＿＿很滑，开车要特别小心。
立交桥 | lì jiāo qiáo | interchange | 不同方向的路上下交会的桥 | 有了＿＿，不同方向的车都不用停下来等红绿灯。
高架 | gāo jià | elevated (road) | 建在高处的 | 为了避开地面上的堵车，他开车上了＿＿路。
`,
  },
  {
    theme: ["Tunnels and Roads", "隧道和道路"],
    data: `
隧道 | suì dào | tunnel | 在山中或地下挖出的通道 | 火车开进了长长的＿＿，窗外一下子变黑了。
涵洞 | hán dòng | culvert | 公路、铁路下面让水流过的通道 | 公路下面修了几个＿＿，下大雨时水可以从下面流过去。
盾构机 | dùn gòu jī | tunnel boring machine | 在地下挖隧道的大型机器 | 修地铁时，巨大的＿＿在地下一边挖土，一边安装隧道的墙。
路基 | lù jī | roadbed | 道路下面的基础 | 大雨冲坏了＿＿，铁路暂时停运了。
收费站 | shōu fèi zhàn | toll station | 收过路费的地方 | 开上高速公路以前，要先经过＿＿。
车道 | chē dào | traffic lane | 路上供车走的一条一条的道 | 这条高速公路有六条＿＿，来回各三条。
弯道 | wān dào | bend in the road | 弯曲的路段 | 山路上＿＿很多，开车一定要慢。
坡度 | pō dù | gradient | 斜坡倾斜的程度 | 这段路＿＿很大，骑自行车上不去。
绕行 | rào xíng | to detour | 不从这里过，从别处走 | 前面的路正在维修，车辆请＿＿。
路面 | lù miàn | road surface | 道路的表面 | 下过雨的＿＿很滑，走路要小心。
`,
  },
  {
    theme: ["Hubs and Crossings", "枢纽和渡口"],
    data: `
枢纽 | shū niǔ | hub | 起关键作用的连接点 | 这座城市是全国铁路的重要＿＿，好几条铁路在这里交会。
纽带 | niǔ dài | bond, link | 起联系作用的东西 | 语言是人与人之间沟通的＿＿。
纽扣 | niǔ kòu | button | 衣服上扣起来的小东西 | 他的大衣掉了一颗＿＿，妈妈帮他缝上了。
中枢 | zhōng shū | control centre | 起主要作用的中心部分 | 大脑是人体神经系统的＿＿。
渡口 | dù kǒu | ferry crossing | 有船来往送人过河的地方 | 以前没有桥，人们要到＿＿坐船过江。
渡轮 | dù lún | ferry | 来往于两岸运送人和车的轮船 | 每天早上，很多人坐＿＿到对岸上班。 | 渡船
渡船 | dù chuán | ferryboat | 送人过河的船 | 老人撑着一条小＿＿，把村民送到河对岸。 | 渡轮
摆渡 | bǎi dù | to ferry | 用船把人或东西运过河 | 他在这条河上＿＿了三十年，送过成千上万的人过河。
过渡 | guò dù | transition | 从一个阶段变到另一个阶段 | 从小学到中学有一个＿＿阶段，孩子需要慢慢适应。
远渡重洋 | yuǎn dù chóng yáng | to travel across the oceans | 渡过大海到很远的地方去 | 他十八岁就＿＿，到国外去留学。
`,
  },
  {
    theme: ["Piles and Cranes", "打桩和起吊"],
    data: `
打桩 | dǎ zhuāng | to drive piles | 把桩打进土里 | 工地上的机器正在＿＿，声音很远都能听到。
木桩 | mù zhuāng | wooden stake | 木头做的桩 | 他把绳子系在河边的＿＿上。
桩基 | zhuāng jī | pile foundation | 用很多桩做成的地基 | 高楼要打很深的＿＿，才能站得稳。
塔吊 | tǎ diào | tower crane | 塔形的起重机 | 工地上立着几台高高的＿＿，正在往楼顶吊钢材。 | 吊车 起重机
吊车 | diào chē | crane truck | 能把重东西吊起来的车 | 一辆＿＿把出事的汽车从沟里吊了上来。 | 塔吊 起重机
起重机 | qǐ zhòng jī | crane | 把重物吊起来移动的机器 | 港口的大型＿＿正把集装箱一个个吊上船。 | 塔吊 吊车
起吊 | qǐ diào | to hoist | 把重物吊起来 | 这个零件有十几吨重，要用大型机器才能＿＿。 | 吊装
吊装 | diào zhuāng | to hoist into place | 用起重机把构件吊起来安装 | 大桥的最后一段桥面＿＿完成，整座桥连接起来了。 | 起吊
撑杆跳 | chēng gān tiào | pole vault | 用一根长杆撑着跳过高处的运动 | ＿＿运动员拿着长长的杆子，跑几步就能跳过五米多的高度。
充电桩 | chōng diàn zhuāng | charging point | 给电动汽车充电的设备 | 小区停车场装了十几个＿＿，电动车充电很方便。
`,
  },
  {
    theme: ["Gaps and Twists", "缝隙和拧紧"],
    data: `
缝隙 | fèng xì | crack, crevice | 裂开或没合严的小缝 | 阳光从门的＿＿里照了进来。 | 空隙 间隙
间隙 | jiàn xì | interval | 两件事之间空着的时间 | 他利用工作的＿＿，学会了一门外语。 | 缝隙 空隙
空隙 | kòng xì | empty space | 空着的地方 | 书架上的书摆得满满的，一点儿＿＿也没有。 | 缝隙 间隙
拧紧 | nǐng jǐn | to screw tight | 转动使紧 | 用完水以后，要把水龙头＿＿，不然会一直滴水。
拧开 | nǐng kāi | to twist open | 转动使打开 | 他用力＿＿瓶盖，喝了一大口水。
拧干 | níng gān | to wring out | 用力扭，把水挤出去 | 洗完衣服，要先＿＿再挂起来。
撬开 | qiào kāi | to pry open | 用工具插进缝里，用力把东西打开 | 罐头的盖子太紧，他用刀把它＿＿了。
环绕 | huán rào | to encircle | 围在周围 | 这个小村子四面被青山＿＿，风景很美。 | 围绕
围绕 | wéi rào | to revolve around | 围着转 | 地球＿＿着太阳转。 | 环绕
绕道 | rào dào | to go a long way round | 不走直路，从旁边走 | 前面修路，我们只好＿＿走。
`,
  },
  {
    theme: ["Hand Tools", "手工具"],
    data: `
扳手 | bān shou | spanner, wrench | 用来拧螺丝、螺母的工具 | 自行车的螺母松了，爸爸拿＿＿把它拧紧了。
钳子 | qián zi | pliers | 能拿住、剪断小东西的工具 | 电工用＿＿把电线剪断了。
锯子 | jù zi | saw | 把木头等锯开的工具 | 他用＿＿把木板锯成了两半。 | 电锯
刨子 | bào zi | plane (tool) | 把木头表面刨平的工具 | 木匠用＿＿把桌面刨得又平又光。
斧头 | fǔ tou | axe | 砍木头的工具 | 他用＿＿把大木头砍成了一块块的柴。
铲子 | chǎn zi | shovel | 挖土、沙等的工具 | 孩子们用小＿＿在沙滩上挖沙子。
电钻 | diàn zuàn | electric drill | 用电带动的钻孔工具 | 他用＿＿在墙上打了两个孔，挂上了一幅画。
电锯 | diàn jù | electric saw | 用电带动的锯 | 工人用＿＿锯木头，几分钟就锯断了一根大木头。 | 锯子
锅铲 | guō chǎn | spatula | 炒菜用的铲子 | 妈妈一手拿锅，一手拿＿＿，很快炒好了一盘菜。
凿子 | záo zi | chisel | 打孔或雕刻用的工具 | 石匠用锤子敲着＿＿，在石头上刻出了字。
`,
  },
  {
    theme: ["Blades and Handles", "刃和柄"],
    data: `
刀刃 | dāo rèn | blade (edge) | 刀上能切东西的那一边 | 这把刀用久了，＿＿变钝了。
刀柄 | dāo bǐng | knife handle | 刀上手拿的部分 | 切菜时要握紧＿＿，别切到手。 | 手柄
手柄 | shǒu bǐng | handle; game controller | 器物上用手握的部分；游戏机的控制器 | 他拿着游戏＿＿，玩得忘了时间。 | 刀柄
把柄 | bǎ bǐng | handle; something that can be held against one | 器物上拿的部分；可以被人利用的错处 | 他做事很小心，不让别人抓住任何＿＿。
弹簧 | tán huáng | spring | 有弹性的零件 | 圆珠笔里有一根小＿＿，按一下笔芯就出来了。
锯齿 | jù chǐ | saw teeth | 锯上的尖齿 | 这种植物的叶子边上像＿＿一样，有一个个小尖。
刨花 | bào huā | wood shavings | 刨木头时刨下来的薄片 | 木匠的工作台下堆满了卷卷的＿＿。
迎刃而解 | yíng rèn ér jiě | to be readily solved | 主要问题解决了，其他问题也就容易解决了 | 找到了问题的关键，其他困难就＿＿了。
游刃有余 | yóu rèn yǒu yú | to do with ease | 做事熟练，很轻松 | 他做了二十年老师，管理一个班级＿＿。
刨根问底 | páo gēn wèn dǐ | to get to the bottom of things | 追问到底 | 这孩子遇到不懂的事总要＿＿，直到明白为止。
`,
  },
  {
    theme: ["Boats", "船和艇"],
    data: `
舵手 | duò shǒu | helmsman | 掌握船的方向的人 | 风浪很大，＿＿紧紧地握着舵，让船保持方向。
掌舵 | zhǎng duò | to steer | 控制舵，掌握方向 | 这条船由经验最丰富的老船长＿＿。
船舵 | chuán duò | ship's rudder | 船上控制方向的装置 | 船长转动＿＿，大船慢慢地改变了方向。 | 方向舵
方向舵 | fāng xiàng duò | rudder (of a plane) | 飞机尾部控制左右方向的装置 | 飞机尾部的＿＿可以左右转动，控制飞机的方向。 | 船舵
游艇 | yóu tǐng | yacht | 供游玩用的小船 | 周末，他们租了一条＿＿出海玩。
快艇 | kuài tǐng | speedboat | 速度很快的小艇 | 一艘＿＿从海面上飞快地开过，后面留下一道白色的浪花。
潜艇 | qián tǐng | submarine | 能在水下航行的船 | ＿＿可以在深深的海底航行好几个月。
救生艇 | jiù shēng tǐng | lifeboat | 大船上用来救人的小艇 | 大船遇险时，乘客们按顺序登上了＿＿。
皮划艇 | pí huá tǐng | canoe, kayak | 用桨划的轻便小艇 | 他们在湖上划＿＿，比赛谁划得快。
舰艇 | jiàn tǐng | naval vessels | 海军的各种船 | 海军的＿＿在海上进行了一次救援演习。
`,
  },
  {
    theme: ["Building Work", "施工"],
    data: `
砌墙 | qì qiáng | to build a wall | 用砖、石头一层层地垒墙 | 工人们正在用砖＿＿，一天就砌了一米多高。
堆砌 | duī qì | to pile up; to pad with fancy words | 把砖石堆起来；写文章用很多华丽而无用的词 | 这篇作文＿＿了很多漂亮的词语，内容却很空。
脚手架 | jiǎo shǒu jià | scaffolding | 建房时工人站在上面工作的架子 | 大楼外面搭着＿＿，工人们站在上面刷墙。
施工 | shī gōng | construction work | 按照设计进行建造 | 前方＿＿，车辆请慢行。
工地 | gōng dì | construction site | 正在建造的地方 | 进入＿＿，一定要戴安全帽。
承重 | chéng zhòng | load-bearing | 承受重量 | 这根柱子是＿＿的，千万不能拆。
封顶 | fēng dǐng | to top out | 建筑物盖到最高一层 | 这座大楼昨天正式＿＿了，明年就能住人。
抗震 | kàng zhèn | earthquake-resistant | 抵抗地震 | 日本的很多房子都是＿＿设计的，地震时不容易倒。
拱形 | gǒng xíng | arched | 像拱一样中间高两头低的形状 | 这座古老的城门是＿＿的，车可以从下面通过。
吊顶 | diào dǐng | suspended ceiling | 房间顶部另外装的一层装饰 | 装修的时候，他们给客厅做了＿＿，还装了好看的灯。
`,
  },
  {
    theme: ["Old Machines", "古老的机械"],
    data: `
梭子 | suō zi | shuttle | 织布时带着线来回穿的工具 | 奶奶坐在织布机前，手里的＿＿来回飞快地穿着。
织布机 | zhī bù jī | loom | 织布用的机器 | 工业革命时，人们发明了用蒸汽带动的＿＿。
穿梭 | chuān suō | to shuttle back and forth | 像梭子一样来回不停 | 街上的车辆来来往往，＿＿不停。
纺车 | fǎng chē | spinning wheel | 把棉花等纺成线的工具 | 以前农村的妇女用＿＿把棉花纺成线。
活字印刷 | huó zì yìn shuā | movable-type printing | 用一个个可以拼排的字印刷 | 宋朝的时候，中国人发明了＿＿，印书更快了。
水车 | shuǐ chē | waterwheel | 利用水力转动、把水提上来的工具 | 河边的＿＿慢慢转着，把河水送进了田里。 | 筒车
筒车 | tǒng chē | bamboo-tube waterwheel | 装着很多竹筒、靠水流转动来提水的水车 | ＿＿上装着一个个竹筒，转动时竹筒把河水提上来，倒进水槽里。 | 水车
风箱 | fēng xiāng | bellows | 推拉时产生风、让火烧得更旺的工具 | 以前铁匠打铁时，要不停地拉＿＿，让炉火更旺。
算盘 | suàn pán | abacus | 用珠子计算的工具 | 以前商店里的会计都用＿＿算账。
地动仪 | dì dòng yí | seismoscope | 古代测地震的仪器 | 东汉的张衡发明了＿＿，用来测地震的方向。
`,
  },
  {
    theme: ["Engines", "发动机"],
    data: `
引擎 | yǐn qíng | engine | 发动机 | 在网上找资料，可以用搜索＿＿。 | 发动机
蒸汽机 | zhēng qì jī | steam engine | 用蒸汽推动的机器 | 十八世纪＿＿的改良，推动了工业革命。
内燃机 | nèi rán jī | internal combustion engine | 燃料在机器内部燃烧产生动力的机器 | 汽车上的汽油机和柴油机都属于＿＿。 | 发动机
发动机 | fā dòng jī | engine, motor | 产生动力的机器 | 飞机的＿＿出了故障，只好紧急降落。 | 引擎 内燃机
马力 | mǎ lì | horsepower | 功率单位 | 这辆跑车的发动机有五百＿＿。
曲轴 | qū zhóu | crankshaft | 发动机里把上下运动变成转动的轴 | ＿＿把发动机里的上下运动变成了转动。
涡轮 | wō lún | turbine wheel | 靠流体推动转动的叶轮 | 这辆车的发动机装了＿＿增压，动力更强。
燃烧室 | rán shāo shì | combustion chamber | 发动机里燃料燃烧的地方 | 汽油在＿＿里燃烧，推动发动机工作。
曲柄 | qū bǐng | crank | 用来转动轴的弯曲的柄 | 很早以前的汽车要用＿＿摇动发动机才能启动。
油门 | yóu mén | accelerator | 控制汽车速度的踏板 | 司机加大＿＿，汽车飞快地开了出去。
`,
  },
  {
    theme: ["Surfaces", "表面处理"],
    data: `
镀金 | dù jīn | gold-plated | 在东西表面镀一层金 | 这块手表不是纯金的，只是表面＿＿。 | 镀银 电镀
镀银 | dù yín | silver-plated | 在表面镀一层银 | 这套餐具是＿＿的，看起来亮闪闪的，其实里面是铜。 | 镀金 电镀
电镀 | diàn dù | electroplating | 用电的方法在金属表面加一层别的金属 | ＿＿厂排出的废水含有重金属，必须处理。 | 镀金 镀银
涂层 | tú céng | coating | 涂在物体表面的一层东西 | 这口锅有一层不粘＿＿，做饭时不容易粘锅。
防锈 | fáng xiù | rust-proof | 防止生锈 | 铁栏杆刷上了一层＿＿漆。
打磨 | dǎ mó | to polish, to grind | 用工具在表面磨，使光滑 | 木匠把桌面＿＿得光光的，摸起来很舒服。 | 抛光
抛光 | pāo guāng | to polish to a shine | 把表面磨得非常光亮 | 这块玉经过＿＿以后，亮得能照出人影。 | 打磨
喷漆 | pēn qī | to spray-paint | 把油漆喷在表面上 | 他给旧自行车＿＿以后，看起来像新的一样。
砂纸 | shā zhǐ | sandpaper | 表面有砂、用来磨光东西的纸 | 他用＿＿把木板上的毛刺磨平了。
砂轮 | shā lún | grinding wheel | 用来磨刀具等的轮子 | 师傅把刀放在转动的＿＿上磨，刀很快就磨好了。
`,
  },
  {
    theme: ["Glue and Tubes", "胶和筒"],
    data: `
粘贴 | zhān tiē | to paste | 把东西贴上；在电脑上把复制的内容放到别处 | 在电脑上写文章，可以复制和＿＿。
粘合 | zhān hé | to bond | 用胶把两个东西连在一起 | 这种胶水能把木头和玻璃牢牢地＿＿在一起。
胶带 | jiāo dài | adhesive tape | 一面有胶的带子 | 他用透明＿＿把破了的书页贴好了。 | 双面胶
双面胶 | shuāng miàn jiāo | double-sided tape | 两面都有胶的胶带 | 用＿＿把照片贴在墙上，看不出胶的痕迹。 | 胶带
粘性 | nián xìng | stickiness | 能粘住东西的性质 | 这种米的＿＿很强，煮出来的饭都粘在一起。
笔筒 | bǐ tǒng | pen holder | 插笔用的筒 | 他桌上的＿＿里插满了铅笔。
话筒 | huà tǒng | microphone | 说话时把声音放大的工具 | 主持人拿着＿＿走上了舞台。
竹筒 | zhú tǒng | bamboo tube | 竹子做的筒 | 有一种饭是把米装进＿＿里烤出来的，有竹子的香味。
万花筒 | wàn huā tǒng | kaleidoscope | 转动时能看到各种花样的玩具 | 转动＿＿，里面的图案一直在变。
筒子楼 | tǒng zi lóu | corridor-style building | 一条长走廊两边都是房间的旧楼房 | 以前很多职工住在＿＿里，一层楼的人共用一个厨房。
`,
  },
  {
    theme: ["Machine Parts", "机械零件"],
    data: `
齿轮 | chǐ lún | gear | 边上有齿、互相带动转动的轮子 | 钟表里有很多大大小小的＿＿，一个带动一个地转。
轴承 | zhóu chéng | bearing | 支撑转动的轴、减少摩擦的零件 | 自行车轮子转得不顺，可能是＿＿坏了。
传送带 | chuán sòng dài | conveyor belt | 不停转动、运送东西的带子 | 机场的行李在＿＿上一件件地送出来。
滑轮 | huá lún | pulley | 能绕着轴转动、用来拉绳子的轮子 | 用＿＿往楼上拉东西，可以省不少力气。
链条 | liàn tiáo | chain | 一节一节连起来的金属链 | 自行车的＿＿掉了，他把它重新装上。
液压 | yè yā | hydraulic | 利用液体压力传递动力 | 挖土机的大铲子是靠＿＿系统带动的。
气压 | qì yā | air pressure | 空气的压力 | 高山上的＿＿比较低，水不到一百度就开了。
鼓风机 | gǔ fēng jī | blower | 能送出强风的机器 | 炼铁时要用＿＿往高炉里送空气。
发条 | fā tiáo | clockwork spring | 钟表、玩具里上紧后能带动它们走的弹性钢片 | 给玩具汽车上紧＿＿，它就能自己跑起来。
螺纹 | luó wén | screw thread | 螺丝上一圈一圈的纹路 | 这颗螺丝的＿＿磨平了，拧不紧了。
`,
  },
  {
    theme: ["Inventions and Design", "发明和设计"],
    data: `
原型 | yuán xíng | prototype | 最早做出来的样品 | 这台机器只是一个＿＿，还要经过多次改进才能生产。
试制 | shì zhì | to trial-produce | 试着制造 | 工厂正在＿＿一种新型的电动车，明年才能上市。
灯泡 | dēng pào | light bulb | 电灯里发光的部分 | 台灯的＿＿坏了，要换一个新的。
蓝图 | lán tú | blueprint | 设计图；比喻对未来的计划 | 市长在会上描绘了城市未来十年发展的＿＿。 | 图纸
图纸 | tú zhǐ | drawings, plans | 画着设计的纸 | 工人们按照＿＿施工，一点儿也不能出错。 | 蓝图
测绘 | cè huì | surveying and mapping | 测量并画出地图 | 修路以前，＿＿人员先对这片山区进行了测量，画出了地图。
风洞 | fēng dòng | wind tunnel | 用来试验飞机等在气流中情况的管道 | 新飞机在设计时，要先在＿＿里做实验。
永动机 | yǒng dòng jī | perpetual motion machine | 不需要能量就能一直工作的机器 | 根据能量守恒定律，＿＿是不可能造出来的。
机械臂 | jī xiè bì | robotic arm | 像人的手臂一样能动的机器 | 汽车工厂里，＿＿可以自动焊接车身。
拉链 | lā liàn | zip | 衣服、包上能拉开合上的链 | 他的书包＿＿坏了，拉不上了。
`,
  },
  {
    theme: ["Building Materials", "建筑材料"],
    data: `
砂石 | shā shí | sand and gravel | 沙子和石子 | 修路需要大量的＿＿和水泥。
沥青 | lì qīng | asphalt | 黑色的、铺路用的材料 | 新铺的＿＿路面又黑又平。
瓦片 | wǎ piàn | roof tile | 一片一片的瓦 | 大风刮掉了屋顶上的几块＿＿，下雨时屋里漏水了。
砖瓦 | zhuān wǎ | bricks and tiles | 砖和瓦 | 这个村子以前有一座烧＿＿的窑。
石灰 | shí huī | lime | 一种白色的建筑材料 | 以前人们用＿＿把墙刷成白色。
水泥 | shuǐ ní | cement | 一种加水后会变硬的灰色粉末 | 工人们在＿＿里加上沙子和水，用来砌墙。
木材 | mù cái | timber | 用来建房、做家具的木头 | 这片森林出产优质＿＿。
渣土 | zhā tǔ | construction spoil | 施工时挖出的土和破砖等 | 运＿＿的卡车要盖好，不能让土掉在路上。
瓦房 | wǎ fáng | tile-roofed house | 屋顶盖瓦的房子 | 他家以前住的是草房，后来盖起了三间＿＿。
粘土 | nián tǔ | clay | 有粘性的土 | 孩子们用＿＿捏出了各种小动物。
`,
  },
];
