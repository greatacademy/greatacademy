// The second quarter of level 7 (docs/chinese-curriculum.md §8.3): units 4 to 6, medicine, nature and ecology, and
// science and technology, 100 characters in 10 batches and 480 words in 48 batches. The characters are new to levels 1
// to 6 and to the first quarter, chosen from the commonest third of GF 0025-2021's advanced band for what each unit's
// words need; the words and sentences use only the characters of levels 1 to 6 and those taught so far.
//
// A character line as in level 6 (../level-6/character-data-a.ts); a word line as in level 6 (../level-6/word-data-a.ts).

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches2 are the 10 character batches of units 4 to 6 of level 7, in teaching order. */
export const characterBatches2: readonly string[] = [
  // Unit 4: Medicine.
  `
肾 shèn | kidney | 人体里清除血液里的废物、产生尿的器官 | 贤坚
肠 cháng | intestine | 肚子里消化食物的长管子 | 汤场
喉 hóu | throat, larynx | 脖子前面通向气管的部分 | 候猴 | 咽
咽 yān/yàn/yè | pharynx; to swallow | 嘴后面通向食道的部分；把东西吞下去 | 烟因 | 喉
颈 jǐng | neck | 头和身体连接的部分 | 劲经
脊 jǐ | spine; ridge | 背中间的一条骨头；东西中间高起的部分 | 背春 | 椎
椎 zhuī | vertebra | 背中间那条骨头里一节一节的小骨头 | 推谁 | 脊
腕 wàn | wrist | 手和胳膊连接的地方 | 碗婉
肢 zhī | limb | 人的胳膊和腿 | 枝肤
筋 jīn | tendon, sinew | 连接肌肉和骨头的东西 | 筷笛
`,
  `
嗽 sòu | to cough | 咳，喉咙里发出声音把气猛地送出去 | 漱嗷
痒 yǎng | itchy | 皮肤上让人想抓的感觉 | 洋样
疹 zhěn | rash | 皮肤上起的小红点 | 诊珍
喘 chuǎn | to pant | 呼吸又急又快 | 端揣
呕 ǒu | to vomit | 胃里的东西从嘴里出来 | 区欧
泻 xiè | diarrhoea; to flow fast | 拉肚子；水很快地往下流 | 写泄
眩 xuàn | dizzy | 眼睛发花，觉得周围的东西在转 | 弦炫
抖 dǒu | to shake | 很快地上下或左右动 | 科料 | 颤
颤 chàn/zhàn | to tremble | 身体不停地轻轻地动 | 擅颜 | 抖
痰 tán | phlegm | 从喉咙里咳出来的黏东西 | 淡谈
`,
  `
麻 má | numb; hemp | 身体失去感觉；一种可以做绳子的植物 | 磨摩
醉 zuì | drunk; under anaesthesia | 喝酒太多，头脑不清楚；用药让人失去知觉 | 碎醋
缝 féng/fèng | to sew; seam | 用针线连起来；中间空出来的细长地方 | 逢蜂
剖 pōu | to cut open | 用刀破开 | 部倍
纱 shā | gauze | 很薄、有小孔的布 | 沙纺
膏 gāo | paste, ointment | 像油一样的软东西，常常是药 | 高糕
丸 wán | pill, small ball | 小而圆的东西，常常是药 | 九执
愈 yù | to heal; the more | 病好了；越 | 俞偷
脂 zhī | fat, grease | 动物或植物里的油 | 指旨 | 肪
肪 fáng | fat (of the body) | 人和动物身体里的油 | 防坊 | 脂
`,
  `
瘤 liú | tumour | 身体里长出来的多余的肉块 | 留溜
痘 dòu | pox; pimple | 皮肤上起的小疙瘩 | 豆逗
疤 bā | scar | 伤好了以后皮肤上留下的印子 | 巴爸 | 痕
痕 hén | mark, trace | 事物留下的印儿 | 很根 | 疤
聋 lóng | deaf | 耳朵听不见 | 龙垄
障 zhàng | obstacle | 挡在中间的东西 | 樟章 | 碍
碍 ài | to hinder | 挡住，让事情不顺利 | 得砖 | 障
抑 yì | to hold down | 压下去，不让发展 | 仰迎
郁 yù | gloomy; dense | 心里不痛快；草木长得多 | 都有
咙 lóng | throat (as in 喉咙) | 用在“喉”字后面，指脖子前面的通道 | 龙拢
`,
  // Unit 5: Nature and Ecology.
  `
栖 qī | to perch, to dwell | 鸟停在树上；住 | 牺晒
殖 zhí | to breed | 生出后代 | 植值
鹿 lù | deer | 头上常长着角、腿细、跑得快的动物 | 鹰庶
濒 bīn | on the verge of | 接近，快要 | 频颗
穴 xué | cave, den; acupoint | 洞；中医说的身体上可以针刺的地方 | 究空
翼 yì | wing | 翅膀 | 异冀
鳞 lín | scale (of a fish) | 鱼身上一片一片的硬皮 | 磷邻
蛇 shé | snake | 身体长而圆、没有脚的动物 | 蛀驼
鼠 shǔ | mouse, rat | 尾巴长、爱咬东西的小动物 | 窜鼎
狼 láng | wolf | 像狗的野兽，常常成群生活 | 浪粮
`,
  `
沼 zhǎo | marsh | 水草多、地面低、常有积水的地方 | 招昭 | 泽
泽 zé | pool, marsh; lustre | 水聚集的地方；光亮 | 译择 | 沼
滩 tān | beach; shoal | 水边的沙地；水浅而急的地方 | 摊难
礁 jiāo | reef | 海里的大石头，常在水面下 | 蕉焦
珊 shān | (first character of coral) | 和“瑚”一起说海里一种像树枝的东西 | 删栅 | 瑚
瑚 hú | (second character of coral) | 用在“珊”字后面，说海里一种像树枝的东西 | 湖糊 | 珊
涝 lào | waterlogged | 雨水太多，地里积了水 | 劳捞
霜 shuāng | frost | 天冷时地面上结的白色小冰 | 箱霸
堤 dī | dike | 沿着河边或海边用土石修的挡水的墙 | 提题 | 坝
坝 bà | dam | 拦住河水的建筑 | 贝坎 | 堤
`,
  `
腐 fǔ | rotten | 坏了，烂了 | 府付
沃 wò | fertile | 土地肥 | 沪汰
耕 gēng | to plough | 用工具把土翻松 | 讲耗
垦 kěn | to reclaim (land) | 把荒地开发成农田 | 恳艮
蚀 shí | to erode | 慢慢地损坏 | 浊烛
焚 fén | to burn | 烧 | 禁林
灌 guàn | to pour; to water (fields) | 把水引到地里；倒进去 | 罐欢 | 溉
溉 gài | to irrigate | 把水输送到田里 | 概既 | 灌
渠 qú | canal, channel | 人工挖的水道 | 柜巨
蚊 wén | mosquito | 会咬人吸血的小飞虫 | 纹蚁
`,
  // Unit 6: Science and Technology.
  `
颗 kē | (measure word for small round things) | 用于小而圆的东西 | 棵课
沸 fèi | to boil | 液体烧开了 | 佛费
滤 lǜ | to filter | 让液体或气体通过，把杂质留下 | 虑虎
裂 liè | to crack, to split | 分开，破开 | 烈列
氮 dàn | nitrogen | 空气里含量最多的气体 | 氧炎
氯 lǜ | chlorine | 一种黄绿色、有毒、能用来消毒的气体 | 绿录
铝 lǚ | aluminium | 一种轻的银白色金属 | 侣铜
硅 guī | silicon | 用来做芯片的一种元素 | 桂鞋
锂 lǐ | lithium | 一种很轻的金属，常用来做电池 | 理里
碱 jiǎn | alkali | 和酸相对的一类物质 | 减喊
`,
  `
轴 zhóu | axle, axis | 让轮子转动的杆子；画图时作为标准的直线 | 抽油
杠 gàng | bar, lever | 比较粗的棍子 | 扛江 | 杆
杆 gān/gǎn | pole; shaft | 细长的木头或金属棍子 | 汗肝 | 杠
螺 luó | spiral; screw | 有旋转纹路的东西 | 骡累
钉 dīng/dìng | nail; to nail | 一头尖的细金属棍，用来固定东西；把它打进去 | 订顶
泵 bèng | pump | 抽水或抽气的机器 | 泉录
缆 lǎn | cable | 很粗的绳子或电线 | 览揽
铸 zhù | to cast (metal) | 把化成液体的金属倒进模子里 | 涛筹
韧 rèn | tough, pliable | 受力时不容易断 | 忍纫
焊 hàn | to weld | 用加热的方法把金属连在一起 | 悍旱
`,
  `
径 jìng | path; diameter | 小路；圆上两点间通过中心的直线 | 经轻
弧 hú | arc | 圆周的一段 | 孤狐
凹 āo | concave | 中间低下去 | 凸凶
凸 tū | convex | 中间高起来 | 凹出
柱 zhù | pillar, column | 立着支撑房子的东西 | 注住
锥 zhuī | cone; awl | 底面圆、上面尖的形状；尖的工具 | 椎谁
纤 xiān | fine; fibre | 很细的东西 | 红轩
缘 yuán | edge; cause | 边；原因 | 绿缓
渗 shèn | to seep | 液体慢慢地透过去 | 参惨
鉴 jiàn | to examine; mirror | 仔细看，辨别真假；镜子 | 监坚
`,
];

/** wordBatches2 are the 48 word batches of units 4 to 6 of level 7, in teaching order. */
export const wordBatches2: readonly LevelWordBatch[] = [
  // Unit 4: Medicine.
  {
    theme: ["Organs of the Body", "人体器官"],
    data: `
器官 | qì guān | organ | 身体里有一定作用的部分 | 眼睛和鼻子是人感觉外界的＿＿。
肾脏 | shèn zàng | kidney | 清除血液里的废物、产生尿的器官 | 人有两个＿＿，在腰的后面。
肝脏 | gān zàng | liver | 人体里最重的内部器官，能分解有害物质 | ＿＿能分解进入身体的很多有害物质。
肺部 | fèi bù | lungs | 胸里负责呼吸的部分 | 吸烟会伤害＿＿，容易引起咳嗽。
内脏 | nèi zàng | internal organs | 胸和肚子里的各种器官 | 心、肝、肺、胃、肠都是长在身体里面的＿＿。 | 器官
肠道 | cháng dào | intestinal tract | 消化食物、吸收营养的长管子 | 人的＿＿有好几米长，分成小肠和大肠两部分。
大肠 | dà cháng | large intestine | 肠的后一段，比较粗 | 食物先经过小肠，再进入＿＿。
小肠 | xiǎo cháng | small intestine | 肠的前一段，细而长，吸收营养最多 | 食物里的营养主要在＿＿里被吸收。 | 肠道
声带 | shēng dài | vocal cords | 喉部发出声音的部分 | 他大声喊了一天，＿＿受了伤，几天说不出话。
颈部 | jǐng bù | neck | 头下面连接身体的部分 | 长时间低头看手机，＿＿会很累。
`,
  },
  {
    theme: ["Spine and Limbs", "脊椎和四肢"],
    data: `
脊椎 | jǐ zhuī | spine | 背中间一节一节连起来的骨头 | 人的＿＿从头下面一直到腰下面，一共有三十多节。
颈椎 | jǐng zhuī | cervical vertebrae | 脖子里的那几节骨头 | 整天低头看手机，容易得＿＿病。 | 腰椎
腰椎 | yāo zhuī | lumbar vertebrae | 腰部的那几节骨头 | 搬重东西时弯着腰用力，容易伤到＿＿。 | 脊椎
手腕 | shǒu wàn | wrist | 手和胳膊连接的地方 | 她打字打得太多，＿＿有点儿疼。
四肢 | sì zhī | the four limbs | 两只胳膊和两条腿 | 人有＿＿：两只手臂和两条腿。
肢体 | zhī tǐ | limbs and body | 胳膊、腿和身体 | 演员不说话，只用＿＿动作来表达感情。
筋骨 | jīn gǔ | sinews and bones | 筋和骨头，也指身体 | 爷爷每天早上打太极拳，活动＿＿。 | 四肢
抽筋 | chōu jīn | to get a cramp | 肌肉突然变紧、很疼 | 他游泳时腿突然＿＿了，赶紧上了岸。
假肢 | jiǎ zhī | artificial limb | 人工做的胳膊或腿 | 他失去了一条腿，装上＿＿以后又能走路了。
伤筋动骨 | shāng jīn dòng gǔ | to injure bones and sinews | 骨头和筋受了伤 | 俗话说“＿＿一百天”，骨头伤了要休息很久才能好。
`,
  },
  {
    theme: ["Coughs and Colds", "咳嗽和感冒"],
    data: `
咳嗽 | ké sou | to cough | 嗓子里发出声音，把气猛地送出去 | 他感冒了，晚上一直＿＿，睡不好觉。 | 干咳
干咳 | gān ké | dry cough | 没有痰的咳嗽 | 他一直＿＿，可是咳不出痰来。 | 咳嗽
喉咙 | hóu lóng | throat | 嘴后面通向食道和气管的地方 | 医生用小灯照了照他的＿＿，说有点儿发炎。
咽 | yàn | to swallow | 让东西从嘴里进到胃里 | 这片药太大了，他＿＿不下去。
痰 | tán | phlegm | 从嗓子里咳出来的黏东西 | 不要随地吐＿＿，这样不卫生。
化痰 | huà tán | to clear phlegm | 让痰变少、变稀 | 这种药能＿＿，喝了以后嗓子里舒服多了。 | 止咳
止咳 | zhǐ ké | to stop a cough | 让咳嗽停下来 | 这种药是＿＿的，咳得厉害的时候喝一点。 | 化痰
喘气 | chuǎn qì | to breathe hard | 大口地呼吸 | 他一口气跑上了十楼，累得直＿＿。
呼吸道 | hū xī dào | respiratory tract | 空气进入肺要经过的通道 | 冬天＿＿疾病比较多，出门要戴好口罩。
气喘 | qì chuǎn | breathlessness, asthma | 呼吸急促、困难的毛病 | 他有＿＿的毛病，不能做太激烈的运动。
`,
  },
  {
    theme: ["Skin Troubles", "皮肤问题"],
    data: `
痒 | yǎng | itchy | 皮肤上让人想去抓的感觉 | 被虫子叮了一口，皮肤又红又＿＿。 | 发痒
发痒 | fā yǎng | to itch | 皮肤开始痒起来 | 他对羊毛过敏，穿上这件毛衣全身＿＿。 | 痒
湿疹 | shī zhěn | eczema | 皮肤发红、很痒、常常反复出现的病 | 天气潮湿的时候，她的＿＿又犯了。
水痘 | shuǐ dòu | chickenpox | 儿童常得的一种传染病，身上起小水泡 | 他小时候得过＿＿，身上起了很多小红点。
麻疹 | má zhěn | measles | 一种传染病，发烧，全身起红点 | 打疫苗可以预防＿＿。 | 水痘
青春痘 | qīng chūn dòu | acne, pimples | 年轻人脸上长的小红点 | 他十几岁的时候，脸上长了很多＿＿。
疤痕 | bā hén | scar | 伤好了以后留下的痕迹 | 手术以后，他的肚子上留下了一道＿＿。 | 伤疤
伤疤 | shāng bā | scar of a wound | 伤口长好后留下的印子 | 俗话说“好了＿＿忘了疼”。 | 疤痕
脱皮 | tuō pí | to peel | 皮肤一层一层地掉下来 | 他在海边晒了一整天，第二天背上开始＿＿。
皮肤科 | pí fū kē | dermatology | 医院里看皮肤病的科室 | 他脸上起了很多红点，妈妈带他去医院的＿＿看病。
`,
  },
  {
    theme: ["Stomach Troubles", "肠胃不适"],
    data: `
呕吐 | ǒu tù | to vomit | 胃里的东西从嘴里吐出来 | 他坐船时晕得厉害，还＿＿了好几次。
干呕 | gān ǒu | to retch | 想吐又吐不出东西 | 他一闻到这股味道就＿＿，可是什么也没吐出来。
腹泻 | fù xiè | diarrhoea | 大便次数多，而且很稀 | ＿＿就是人们常说的拉肚子。
肠胃 | cháng wèi | stomach and intestines | 肠和胃，也指消化能力 | 他的＿＿不好，不能吃太辣的东西。
肠炎 | cháng yán | enteritis | 肠子发炎的病 | 他得了＿＿，又拉肚子又肚子疼。
泻药 | xiè yào | laxative | 让人大便的药 | ＿＿不能随便吃，吃多了会拉肚子。
便秘 | biàn mì | constipation | 大便很干，好几天解不出来 | 多吃蔬菜、多喝水可以预防＿＿。
胀气 | zhàng qì | bloating | 肚子里气太多，觉得胀 | 他吃了太多豆子，肚子＿＿，很不舒服。 | 消化不良
消化不良 | xiāo huà bù liáng | indigestion | 吃下去的东西不容易消化 | 晚饭吃得太多太晚，容易＿＿。 | 胀气
食物中毒 | shí wù zhòng dú | food poisoning | 吃了坏的或有毒的东西而生病 | 夏天饭菜容易坏，要小心＿＿。
`,
  },
  {
    theme: ["Dizziness and Shaking", "头晕和发抖"],
    data: `
眩晕 | xuàn yùn | vertigo | 觉得自己或周围的东西在转 | 他突然觉得一阵＿＿，赶紧扶住了墙。 | 头晕目眩
头晕目眩 | tóu yūn mù xuàn | to feel faint and dizzy | 头发晕，眼发花 | 他饿了一整天，站起来时＿＿。 | 眩晕
晕倒 | yūn dǎo | to faint | 失去知觉倒下 | 天太热了，有个老人在路上＿＿了。
发抖 | fā dǒu | to shake with cold or fear | 因为冷或怕，身体不停地动 | 他穿得太少，冻得直＿＿。 | 颤抖 打颤
颤抖 | chàn dǒu | to tremble | 身体轻轻地、不停地抖 | 她太紧张了，说话的声音都在＿＿。 | 发抖
打颤 | dǎ zhàn | to shiver | 身体冷得一下一下地抖 | 风很大，他冷得牙齿直＿＿。 | 发抖
抖 | dǒu | to shake off | 很快地动，让东西掉下来 | 他进门前，先＿＿掉了身上的雪。
抖动 | dǒu dòng | to vibrate | 很快地上下或左右动 | 洗衣机转起来的时候，整台机器都在＿＿。
发麻 | fā má | to go numb | 有点儿失去感觉 | 他盘着腿坐了太久，腿都＿＿了。 | 麻木
麻木 | má mù | numb; indifferent | 没有感觉；对事情不关心 | 看多了这样的新闻，有些人变得＿＿了，一点儿也不关心。
`,
  },
  {
    theme: ["Surgery", "手术"],
    data: `
麻醉 | má zuì | anaesthesia | 用药让人暂时失去知觉 | 做手术前，医生先给他打了＿＿。
麻醉师 | má zuì shī | anaesthetist | 负责手术中让病人失去知觉的医生 | 手术中，＿＿一直在观察病人的情况。
局部 | jú bù | local; part | 一部分，不是全部 | 这只是一个小手术，只需要＿＿麻醉。
剖腹产 | pōu fù chǎn | caesarean section | 切开肚子把孩子取出来的手术 | 孩子太大了，医生建议她做＿＿。
缝合 | féng hé | to suture | 用针线把伤口连起来 | 手术结束后，医生把伤口＿＿好了。
缝针 | féng zhēn | to have stitches | 用针线缝伤口 | 伤口很深，需要去医院＿＿。 | 缝合
解剖 | jiě pōu | to dissect | 把人或动物的身体切开来研究 | 医学生要上＿＿课，了解人体的结构。
切除 | qiē chú | to remove surgically | 用手术切掉 | 医生给他＿＿了发炎的盲肠。
手术刀 | shǒu shù dāo | scalpel | 做手术用的小刀 | 外科医生拿起＿＿，开始做手术。
术后 | shù hòu | after an operation | 手术以后 | ＿＿要好好休息，按时吃药。
`,
  },
  {
    theme: ["Wound Care", "伤口护理"],
    data: `
纱布 | shā bù | gauze | 很薄、有小孔、用来包伤口的布 | 护士用＿＿把他的伤口包了起来。
敷 | fū | to apply | 把药等放在皮肤上 | 他摔伤了腿，医生在伤处＿＿了一些药。 | 外敷
外敷 | wài fū | to apply externally | 药放在皮肤外面用 | 这种药只能＿＿，不能吃。 | 敷
冷敷 | lěng fū | cold compress | 把冷的东西放在受伤的地方 | 脚扭伤后，最好马上＿＿，减少肿胀。
热敷 | rè fū | hot compress | 把热毛巾等放在身上 | 腰酸背疼的时候，可以用热水袋＿＿一下。
药膏 | yào gāo | ointment | 涂在皮肤上的软的药 | 他的手被虫子叮了，妈妈给他擦了一点儿＿＿。
愈合 | yù hé | to heal (of a wound) | 伤口长好 | 伤口还没有完全＿＿，洗澡时要小心。
伤痕 | shāng hén | scar, bruise | 受伤后留下的痕迹 | 他的手臂上有一道很长的＿＿。
止血 | zhǐ xuè | to stop bleeding | 让血不再流出来 | 伤口流了很多血，要先＿＿。
红肿 | hóng zhǒng | red and swollen | 又红又肿 | 他的伤口有点儿＿＿，可能发炎了。
`,
  },
  {
    theme: ["Medicines", "药物"],
    data: `
副作用 | fù zuò yòng | side effect | 药物除了治病以外对身体的不好的影响 | 这种药的＿＿是让人想睡觉，吃完不要开车。
服药 | fú yào | to take medicine | 吃药 | 请按医生说的时间＿＿。 | 用药
用药 | yòng yào | to use medicine | 给病人吃药、打针等 | 孩子＿＿要特别小心，不能随便吃大人的药。 | 服药
疗效 | liáo xiào | curative effect | 治疗的效果 | 这种新药的＿＿很好，病人吃了一个星期就好多了。
口服 | kǒu fú | to take orally | 从嘴里吃下去 | 这种药是＿＿的，一天三次，每次两片。
外用 | wài yòng | for external use | 只用在皮肤外面 | 这瓶药水只能＿＿，千万不能喝。
疗程 | liáo chéng | course of treatment | 治疗需要的一段时间 | 这种药要吃满一个＿＿，不能好了一点儿就停。
药丸 | yào wán | pill | 圆粒的药 | 这种＿＿很小，很容易咽下去。
退烧药 | tuì shāo yào | fever medicine | 让体温降下来的药 | 他发烧到三十九度，医生给他开了＿＿。
止痛药 | zhǐ tòng yào | painkiller | 让疼痛减轻的药 | 他牙疼得厉害，吃了一片＿＿。
`,
  },
  {
    theme: ["Fat and Diet", "脂肪和饮食"],
    data: `
脂肪 | zhī fáng | fat | 人和动物身体里储存能量的油 | 这种肉＿＿很多，不要吃太多。 | 油脂
减脂 | jiǎn zhī | to cut body fat | 减少身体里的脂肪 | 他每天跑步，想要＿＿。
油脂 | yóu zhī | oils and fats | 油的总称 | 炸的食物含有很多＿＿。 | 脂肪
高血脂 | gāo xuè zhī | high blood lipids | 血液里的脂肪太多 | 爸爸检查出了＿＿，医生让他少吃肥肉。 | 脂肪肝
体脂 | tǐ zhī | body fat | 身体里脂肪的多少 | 这台机器不但能称体重，还能测＿＿。
低脂 | dī zhī | low-fat | 脂肪含量很少的 | 她减肥的时候只喝＿＿牛奶。
脂肪肝 | zhī fáng gān | fatty liver | 肝里脂肪太多的病 | 经常吃得太油又不运动，容易得＿＿。 | 高血脂
暴饮暴食 | bào yǐn bào shí | to overeat | 一下子吃得、喝得太多 | 过节的时候要注意，不要＿＿。
皮下 | pí xià | under the skin | 皮肤下面 | 打针有好几种，有的打在肌肉里，有的打在＿＿。
营养不良 | yíng yǎng bù liáng | malnutrition | 吃的东西不够或不全面，身体缺营养 | 这个孩子太挑食，有点儿＿＿。
`,
  },
  {
    theme: ["Serious Illness", "重病"],
    data: `
肿瘤 | zhǒng liú | tumour | 身体某部分不正常地长出来的块 | 检查发现他肺部有一个小＿＿，好在不严重。 | 病变
良性 | liáng xìng | benign | 对生命没有大危险的 | ＿＿肿瘤一般长得慢，不会扩散到别的地方。
恶性 | è xìng | malignant | 会扩散、对生命有很大危险的 | ＿＿肿瘤就是人们常说的癌症。
脑瘤 | nǎo liú | brain tumour | 长在脑子里的肿瘤 | 他总是头疼，检查后发现长了一个＿＿。 | 肿瘤
化疗 | huà liáo | chemotherapy | 用药物治疗癌症 | ＿＿是用药物杀死癌细胞，病人可能会掉头发。
放疗 | fàng liáo | radiotherapy | 用射线照射治疗癌症 | ＿＿是用射线照射来杀死癌细胞。
早期 | zǎo qī | early stage | 一种病开始的阶段 | 很多癌症如果在＿＿发现，是可以治好的。
晚期 | wǎn qī | late stage | 一种病最后的、最严重的阶段 | 他发现得太晚，已经是癌症＿＿了。
病变 | bìng biàn | pathological change | 身体组织因为生病发生的变化 | 糖尿病时间长了，会引起眼睛的＿＿。
扩散 | kuò sàn | to spread | 向四周散开 | 幸亏发现得早，癌细胞还没有＿＿。
`,
  },
  {
    theme: ["Mental Health", "心理健康"],
    data: `
抑郁 | yì yù | depressed | 心情很低落，高兴不起来 | 他失业以后一直很＿＿，不愿意出门。 | 忧郁
抑郁症 | yì yù zhèng | depression | 一种情绪长期低落的心理疾病 | ＿＿是一种病，需要看医生，不是“想开点”就能好的。
忧郁 | yōu yù | melancholy | 发愁，不开心 | 她的眼睛里总带着一点儿＿＿。 | 抑郁
压抑 | yā yì | to hold back; stifling | 把感情压在心里不表现出来 | 他总是把不满＿＿在心里，从来不说出来。
抑制 | yì zhì | to inhibit | 压下去，不让发展 | 这种药可以＿＿细菌生长。
心理咨询 | xīn lǐ zī xún | counselling | 专业的人帮人解决心里的问题 | 学校有＿＿室，学生有烦恼可以去聊聊。
情绪低落 | qíng xù dī luò | in low spirits | 心情不好，没精神 | 考试没考好，他这几天＿＿，话也不多。 | 抑郁
心结 | xīn jié | knot in one's heart | 心里解不开的问题 | 两个人好好谈了一次，终于解开了＿＿。
疏导 | shū dǎo | to guide (feelings) | 帮人把不好的情绪排解出去 | 老师耐心地＿＿他的情绪，他慢慢地平静了下来。
心理问题 | xīn lǐ wèn tí | psychological problem | 心里不健康的状态 | 长期压力太大，可能会产生＿＿。
`,
  },
  {
    theme: ["Disability", "残障"],
    data: `
聋人 | lóng rén | deaf person | 听不见声音的人 | 很多＿＿用手语和别人交流。
耳聋 | ěr lóng | deaf | 耳朵听不见 | 爷爷年纪大了，有点儿＿＿，你说话要大声点。
聋哑 | lóng yǎ | deaf and mute | 听不见也不能说话 | 这所学校专门教＿＿儿童。
障碍 | zhàng ài | obstacle | 挡在前面的东西 | 语言不通是他在国外生活的最大＿＿。
残障 | cán zhàng | disability | 身体或智力有残缺 | 这家公司愿意招聘＿＿人士。 | 视障
视障 | shì zhàng | visually impaired | 眼睛看不清或看不见 | 盲道是为＿＿人士修的。 | 残障
无障碍 | wú zhàng ài | barrier-free | 没有阻挡，方便残疾人使用 | 这座大楼有＿＿通道，坐轮椅的人也能方便地进出。
盲道 | máng dào | tactile paving | 人行道上专门给盲人走的路 | 不要把自行车停在＿＿上，会挡住盲人的路。
轮椅 | lún yǐ | wheelchair | 装着轮子的椅子 | 他腿受伤了，只能坐＿＿。
助残 | zhù cán | to help the disabled | 帮残疾人做事、解决困难 | 每年五月的第三个星期日是中国的“全国＿＿日”。
`,
  },
  {
    theme: ["Ageing", "衰老"],
    data: `
老化 | lǎo huà | to age | 时间长了，功能慢慢变差 | 随着年龄增长，人的皮肤会慢慢＿＿。
衰弱 | shuāi ruò | weak, feeble | 身体不强壮，没有力气 | 他大病一场以后，身体很＿＿。
耳背 | ěr bèi | hard of hearing | 耳朵不太灵，听不清 | 外公有点儿＿＿，常常听不清电视里在说什么。
老花眼 | lǎo huā yǎn | presbyopia | 年纪大了，看近处的东西看不清 | 奶奶有＿＿，看报纸时要戴眼镜。
白内障 | bái nèi zhàng | cataract | 眼睛里变白、看不清东西的病 | 老人得了＿＿，可以做手术治疗。
骨质疏松 | gǔ zhì shū sōng | osteoporosis | 骨头变得不结实，容易骨折 | 老人容易＿＿，摔一下就可能骨折。
抗衰老 | kàng shuāi lǎo | anti-ageing | 让人老得慢一点 | 这种护肤品说能＿＿，其实效果并不明显。
老年病 | lǎo nián bìng | diseases of old age | 老人常得的病 | 高血压、糖尿病都是常见的＿＿。
早衰 | zǎo shuāi | premature ageing | 不到年纪就衰老 | 长期熬夜、压力太大，可能导致＿＿。 | 老化
年迈 | nián mài | aged | 年纪很大 | 他每个周末都回家照顾＿＿的父母。
`,
  },
  {
    theme: ["Hospital Departments", "医院科室"],
    data: `
儿科 | ér kē | paediatrics | 给孩子看病的科室 | 孩子发烧了，要挂＿＿。
眼科 | yǎn kē | ophthalmology | 看眼睛病的科室 | 他看东西不清楚，去＿＿查了视力。
骨科 | gǔ kē | orthopaedics | 看骨头病和骨折的科室 | 他摔断了腿，被送到了医院的＿＿。
产科 | chǎn kē | obstetrics | 照顾快生孩子的妇女的科室 | 她快生孩子了，住进了医院的＿＿。
住院部 | zhù yuàn bù | inpatient department | 医院里病人住院的地方 | 门诊在前面的楼里，＿＿在后面的大楼里。
化验 | huà yàn | to test in a lab | 用化学或物理方法检查 | 医生让他先去＿＿一下血。
主治医生 | zhǔ zhì yī shēng | attending doctor | 负责治疗某个病人的医生 | 你的＿＿是李医生，有问题可以找他。
副院长 | fù yuàn zhǎng | deputy hospital director | 医院里职位第二的领导 | 他是这家医院的＿＿，协助院长管理医院。
医嘱 | yī zhǔ | doctor's orders | 医生对病人的嘱咐 | 出院以后，请按照＿＿按时吃药。
挂号 | guà hào | to register (at a hospital) | 看病前在医院登记 | 看病要先＿＿，再去诊室排队。
`,
  },
  {
    theme: ["Traditional Chinese Medicine", "中医"],
    data: `
把脉 | bǎ mài | to take the pulse | 用手指按手腕，感觉脉的跳动 | 中医看病时，常常先给病人＿＿。
药材 | yào cái | medicinal herbs | 做药用的原料 | 这个地区出产很多名贵的＿＿。
经络 | jīng luò | meridians | 中医说的身体里气血运行的路线 | 按照中医的说法，人体有很多＿＿，把全身连在一起。
气血 | qì xuè | qi and blood | 中医说的人体的气和血 | 中医说她＿＿不足，所以脸色不好。
食疗 | shí liáo | food therapy | 用饮食来治病和保养身体 | 中医讲究＿＿，认为合适的饮食也能治病。
补品 | bǔ pǐn | tonic | 补身体的东西 | 他给生病的奶奶买了很多＿＿。
调理 | tiáo lǐ | to nurse back to health | 慢慢地调养身体 | 病好了以后，她又吃了一个月中药＿＿身体。
上火 | shàng huǒ | to suffer from internal heat | 中医说的嘴里长泡、嗓子疼等症状 | 他最近吃了太多辣的东西，有点儿＿＿。
阴阳 | yīn yáng | yin and yang | 中国古代思想中相对的两个方面 | 中医用＿＿来解释身体的变化。
中成药 | zhōng chéng yào | ready-made Chinese medicine | 做成药丸、药片等、可以直接吃的中药 | 比起自己熬汤药，吃＿＿方便得多。
`,
  },
  // Unit 5: Nature and Ecology.
  {
    theme: ["Habitats", "栖息地"],
    data: `
栖息 | qī xī | to dwell, to perch | 动物停留、居住 | 这片树林里＿＿着很多种鸟。
栖息地 | qī xī dì | habitat | 动物生活的地方 | 修路破坏了很多野生动物的＿＿。
洞穴 | dòng xué | cave | 地下或山里的洞 | 很久以前，人类的祖先曾经住在＿＿里。 | 巢穴
巢穴 | cháo xué | den, lair | 鸟兽住的地方 | 天黑了，狼带着食物回到了＿＿。 | 洞穴
鸟巢 | niǎo cháo | bird's nest | 鸟用草和树枝做的窝 | 树上有一个＿＿，里面有三个鸟蛋。
筑巢 | zhù cháo | to build a nest | 鸟做窝 | 春天到了，小鸟们忙着衔来小树枝＿＿。
生态系统 | shēng tài xì tǒng | ecosystem | 一个地方的生物和环境组成的整体 | 一片森林就是一个＿＿，里面的生物互相依存。
食物链 | shí wù liàn | food chain | 生物之间吃和被吃的关系 | 草被羊吃，羊被狼吃，这就是一条＿＿。
候鸟 | hòu niǎo | migratory bird | 随着季节变化飞到别处去的鸟 | 每年秋天，这些＿＿都要飞到南方过冬。
冬眠 | dōng mián | to hibernate | 动物冬天长时间睡觉、不吃东西 | 冬天，熊在洞里＿＿，到春天才出来。
`,
  },
  {
    theme: ["Protecting Wildlife", "保护野生动物"],
    data: `
濒危 | bīn wēi | endangered | 快要灭绝的 | 这种鸟已经很少了，被列为＿＿动物。 | 稀有
稀有 | xī yǒu | rare | 很少有的 | 这种花非常＿＿，全世界只有几个地方能看到。
偷猎 | tōu liè | to poach | 违法地偷偷打猎 | 为了保护野生动物，法律严禁＿＿。
大熊猫 | dà xióng māo | giant panda | 中国特有的黑白色的熊，爱吃竹子 | ＿＿是中国特有的动物，主要吃竹子。
种群 | zhǒng qún | population (of a species) | 一个地方同一种生物的全体 | 经过多年保护，这里的鹿＿＿越来越大了。
自然保护区 | zì rán bǎo hù qū | nature reserve | 国家划出来保护自然环境和野生生物的地区 | 这片森林被划为＿＿，不许随便砍树。
救助 | jiù zhù | to rescue and help | 帮助有困难的人或动物 | 他们＿＿了一只受伤的小鹿，等它好了再放回山里。
人工繁殖 | rén gōng fán zhí | captive breeding | 用人的帮助让动物生出后代 | 通过＿＿，这种动物的数量慢慢增加了。
外来物种 | wài lái wù zhǒng | alien species | 从别的地方带进来的生物 | 有些＿＿到了新的地方，没有别的动物吃它们，会大量繁殖。
入侵 | rù qīn | to invade | 从外面进来侵害 | 这种草被带到别的国家以后，＿＿了当地的河流。
`,
  },
  {
    theme: ["Breeding and Feeding", "繁殖和捕食"],
    data: `
繁殖 | fán zhí | to breed | 生出后代 | 春天是很多动物＿＿的季节。 | 生殖
生殖 | shēng zhí | reproduction | 生物产生后代的过程 | 生物通过＿＿产生新的个体，一代一代延续下去。 | 繁殖
养殖 | yǎng zhí | to farm (fish, animals) | 人工养鱼、养鸡等 | 他在海边办了一个＿＿场，养了很多鱼。
捕食 | bǔ shí | to prey on | 动物捉别的动物来吃 | 猫头鹰在夜里出来＿＿老鼠。
猎物 | liè wù | prey | 被捉来吃的动物 | 狮子慢慢地靠近它的＿＿。
食草动物 | shí cǎo dòng wù | herbivore | 只吃植物的动物 | 牛、羊和鹿都是＿＿。
食肉动物 | shí ròu dòng wù | carnivore | 吃别的动物的动物 | 狮子和狼都是＿＿。
群居 | qún jū | to live in groups | 很多同类在一起生活 | 狼是＿＿的动物，常常一起打猎。
夜行 | yè xíng | nocturnal | 夜里出来活动 | 猫头鹰是＿＿动物，白天睡觉，晚上出来活动。
栖身 | qī shēn | to stay (for a time) | 暂时住 | 他刚到城市的时候，只能在朋友家＿＿。
`,
  },
  {
    theme: ["Deer, Wolves and Mice", "鹿、狼和鼠"],
    data: `
鹿 | lù | deer | 腿细、跑得快的动物，雄的常有角 | 草地上有一只＿＿在吃草，听到声音马上跑了。
长颈鹿 | cháng jǐng lù | giraffe | 脖子很长的动物 | ＿＿是世界上最高的动物。
鹿角 | lù jiǎo | antler | 鹿头上长的角 | 这只鹿的＿＿又大又漂亮。
狼 | láng | wolf | 像狗的野兽，常常成群生活 | 夜里，山上传来＿＿的叫声。 | 狼群
狼群 | láng qún | wolf pack | 一群狼 | 一个＿＿里有好几只狼，它们一起打猎。 | 狼
老鼠 | lǎo shǔ | mouse, rat | 尾巴长、爱偷吃粮食的小动物 | 猫会抓＿＿。
松鼠 | sōng shǔ | squirrel | 尾巴大、在树上生活、爱吃果子的小动物 | 公园的树上有一只＿＿，正抱着果子吃。 | 老鼠
袋鼠 | dài shǔ | kangaroo | 腿很有力、肚子上有口袋的动物 | ＿＿主要生活在澳大利亚，用后腿跳着走。
鼠疫 | shǔ yì | plague | 由老鼠等传播的一种严重的传染病 | 历史上，＿＿曾经让欧洲很多人死去。
胆小如鼠 | dǎn xiǎo rú shǔ | timid as a mouse | 胆子非常小 | 他＿＿，晚上一个人不敢出门。
`,
  },
  {
    theme: ["Snakes, Wings and Scales", "蛇、翅膀和鳞片"],
    data: `
蛇 | shé | snake | 身体长而圆、没有脚的动物 | 草里有一条＿＿，大家小心点儿。 | 毒蛇
毒蛇 | dú shé | venomous snake | 有毒的蛇 | 这种＿＿很危险，人被它伤了要马上去医院。 | 蛇
爬行动物 | pá xíng dòng wù | reptile | 用身体或短腿在地上爬的动物 | 蛇是一种＿＿，没有脚，靠身体在地上爬。
两栖动物 | liǎng qī dòng wù | amphibian | 小时候在水里、长大后能到陆地上生活的动物 | ＿＿小时候在水里生活，长大以后也能上岸生活。
鳞片 | lín piàn | scale | 鱼、蛇等身上一片一片的硬皮 | 这条鱼身上的＿＿在阳光下闪着光。 | 鱼鳞
鱼鳞 | yú lín | fish scales | 鱼身上的鳞 | 做鱼以前，要先把＿＿刮干净。 | 鳞片
羽翼 | yǔ yì | wings; feathers | 鸟的翅膀，也比喻帮助和保护 | 小鸟的＿＿还没有长好，还不能飞。
机翼 | jī yì | wing of a plane | 飞机两边像鸟翅膀的部分 | 从飞机窗口往外看，能看到长长的＿＿。
遍体鳞伤 | biàn tǐ lín shāng | covered with wounds | 全身都是伤 | 这只小狗被救回来的时候，已经＿＿了。
打草惊蛇 | dǎ cǎo jīng shé | to alert the enemy | 做事不小心，让对方有了准备 | 我们先别说出去，免得＿＿。
`,
  },
  {
    theme: ["Mosquitoes and Other Insects", "蚊子和其他昆虫"],
    data: `
蚊子 | wén zi | mosquito | 会叮人吸血的小飞虫 | 夏天晚上＿＿很多，叮得人身上起包。
蚊帐 | wén zhàng | mosquito net | 挂在床上挡蚊子的网 | 以前夏天睡觉时，人们常常挂＿＿。
蚊香 | wén xiāng | mosquito coil | 点着以后能赶走蚊子的东西 | 他在屋里点了一盘＿＿。
驱蚊 | qū wén | to repel mosquitoes | 把蚊子赶走 | 出去露营别忘了带＿＿水。 | 灭蚊
灭蚊 | miè wén | to kill mosquitoes | 把蚊子消灭 | 夏天到了，社区组织大家＿＿，清理积水。
益虫 | yì chóng | beneficial insect | 对人有好处的昆虫 | 蜜蜂能帮植物传花粉，是＿＿。
虫卵 | chóng luǎn | insect egg | 昆虫产下的卵 | 叶子背面有很多＿＿，过几天就会变成小虫子。
寄生 | jì shēng | to be a parasite | 生活在别的生物身上，靠它活着 | 有些虫子＿＿在动物身体里，让动物生病。
共生 | gòng shēng | to live in symbiosis | 两种生物生活在一起，互相得到好处 | 蜜蜂采花蜜，也帮花传粉，这种两方都得到好处的生活关系叫＿＿。
珊瑚虫 | shān hú chóng | coral polyp | 生活在海里、能造出珊瑚的小动物 | 珊瑚是由很多小小的＿＿造成的。
`,
  },
  {
    theme: ["Wetlands", "湿地"],
    data: `
湿地 | shī dì | wetland | 地面常有水、长着水草的地方 | ＿＿被叫做“地球之肾”，能净化水。
沼泽 | zhǎo zé | marsh, swamp | 水草多、地面软、容易陷进去的地方 | 这片＿＿很危险，人走进去可能会沉下去。 | 沼泽地 泥沼
沼泽地 | zhǎo zé dì | marshland | 有沼泽的地方 | 这块＿＿里生活着很多水鸟。 | 沼泽 泥沼
泥沼 | ní zhǎo | mire; predicament | 很软的泥地；比喻很难摆脱的环境 | 他的公司落入了经济困难的＿＿，很难走出来。 | 沼泽 沼泽地
沼气 | zhǎo qì | marsh gas, biogas | 草和粪便等在水里腐烂后产生的可以燃烧的气体 | 农村用＿＿做饭，又干净又省钱。
河滩 | hé tān | river beach | 河边的沙地 | 孩子们在＿＿上找漂亮的石头。 | 沙滩 海滩
沙滩 | shā tān | sandy beach | 水边由沙子形成的地方 | 夏天，很多人在海边的＿＿上晒太阳。 | 海滩
海滩 | hǎi tān | beach | 海边的沙地 | 退潮以后，＿＿上留下了很多小鱼和小石头。 | 沙滩
险滩 | xiǎn tān | dangerous shoal | 水急、石头多、很危险的河段 | 这条河有很多＿＿，开船要特别小心。
泥滩 | ní tān | mudflat | 海边或河边又软又湿的泥地 | 这片＿＿上全是软软的泥，一脚下去就到了膝盖。 | 河滩
`,
  },
  {
    theme: ["Coral Reefs", "珊瑚礁"],
    data: `
珊瑚 | shān hú | coral | 海里一种像树枝的东西，由小动物造成 | 海底的＿＿五颜六色，非常好看。 | 珊瑚礁
珊瑚礁 | shān hú jiāo | coral reef | 由珊瑚形成的礁石 | 澳大利亚东北海岸有世界上最大的＿＿。
礁石 | jiāo shí | rock (in the sea) | 海里或江河里的大石头 | 海浪一次又一次地打在＿＿上。 | 暗礁
暗礁 | àn jiāo | hidden reef | 在水面下、看不见的礁石 | 这一带海里有很多＿＿，船很容易出事故。 | 礁石
礁岛 | jiāo dǎo | reef island | 由礁石形成的小岛 | 这个＿＿很小，上面只长着几种小树。
海底 | hǎi dǐ | sea floor | 海的最下面 | 这条船沉到了＿＿。
潜水 | qián shuǐ | to dive | 在水面下活动 | 他们戴上工具去＿＿，看海底的鱼。
海洋生物 | hǎi yáng shēng wù | marine life | 生活在海里的生物 | 珊瑚礁里生活着很多种＿＿。
白化 | bái huà | bleaching | 变成白色 | 海水温度太高，会让珊瑚＿＿死亡。
礁盘 | jiāo pán | reef flat | 礁石形成的平的大片地方 | 退潮的时候，＿＿露出了水面。 | 礁石
`,
  },
  {
    theme: ["Floods and Droughts", "旱涝"],
    data: `
涝灾 | lào zāi | waterlogging disaster | 雨水太多、地里积水造成的灾害 | 连着下了半个月的雨，这里发生了＿＿。 | 洪涝
洪涝 | hóng lào | flooding | 大水和积水 | 这个地区夏天雨多，常常发生＿＿灾害。 | 涝灾
旱涝 | hàn lào | drought and waterlogging | 干旱和雨水太多 | 修了水渠以后，这里的庄稼＿＿都不怕了。
内涝 | nèi lào | urban waterlogging | 城市里下大雨后积水排不出去 | 一场大雨以后，城里很多路段出现了＿＿。 | 积水
排涝 | pái lào | to drain waterlogged land | 把地里或路上的积水排出去 | 大雨以后，工人们连夜＿＿。
积水 | jī shuǐ | standing water | 地上存着的水 | 下完雨，路上有很多＿＿，开车要慢一点。
决堤 | jué dī | to breach a dike | 河水冲破了堤 | 河水太大，＿＿了，附近的村子都进了水。
枯水期 | kū shuǐ qī | low-water season | 一年里江河水最少的时期 | 冬天是这条河的＿＿，河里的水很少。
水位 | shuǐ wèi | water level | 江河湖海水面的高度 | 连着下了几天雨，河里的＿＿涨了很多。
旱灾 | hàn zāi | drought | 长时间不下雨造成的灾害 | 今年这里发生了＿＿，很多庄稼都干死了。
`,
  },
  {
    theme: ["Frost and Cold", "霜和寒冷"],
    data: `
霜 | shuāng | frost | 天冷时地面上结的白色小冰 | 早上，地上铺了一层白白的＿＿。 | 冰霜
霜冻 | shuāng dòng | frost damage | 气温降到零度以下，让植物受冻 | 一场＿＿让果园里的花都冻坏了。 | 寒潮
霜降 | shuāng jiàng | Frost's Descent (solar term) | 二十四节气之一，在十月下旬 | ＿＿以后，天气越来越冷了。
结霜 | jié shuāng | to frost over | 东西表面上结了霜 | 天太冷了，窗户上都＿＿了。
寒潮 | hán cháo | cold wave | 从北方来的强冷空气 | ＿＿来了，气温一天就下降了十几度。
冰霜 | bīng shuāng | ice and frost | 冰和霜；比喻态度冷 | 她脸上冷若＿＿，一句话也不说。 | 霜
风霜 | fēng shuāng | hardships | 风和霜，比喻经历的困难 | 老人的脸上写满了＿＿。
雪上加霜 | xuě shàng jiā shuāng | one disaster on top of another | 比喻接连遭受灾难 | 他刚丢了工作，又生了病，真是＿＿。
霜叶 | shuāng yè | autumn leaves | 秋天经过霜变红的叶子 | 秋天，满山的＿＿红得像火一样。
无霜期 | wú shuāng qī | frost-free period | 一年里没有霜的日子 | 这里的＿＿很长，一年可以种两次庄稼。
`,
  },
  {
    theme: ["Dams and Levees", "堤坝"],
    data: `
堤坝 | dī bà | dikes and dams | 挡水的建筑的总称 | 为了防洪，人们在河边修了很多＿＿。 | 堤防 河堤
大坝 | dà bà | big dam | 很大的拦水建筑 | 长江上的三峡＿＿是世界上最大的水力发电工程之一。 | 水坝
水坝 | shuǐ bà | dam | 拦住河水的建筑 | 这条河上修了一座＿＿，用来发电。 | 大坝
河堤 | hé dī | river levee | 沿着河修的挡水的墙 | 晚饭后，很多人在＿＿上散步。 | 堤岸
堤岸 | dī àn | embankment | 河、湖边上的堤 | 洪水冲坏了一段＿＿。 | 河堤
堤防 | dī fáng | levees | 防水的堤 | 雨季以前，政府加固了＿＿。 | 河堤
筑坝 | zhù bà | to build a dam | 修水坝 | 在河上＿＿会影响鱼的游动。
海堤 | hǎi dī | sea wall | 沿着海边修的堤 | 这道＿＿挡住了海水，保护了后面的村子。
水电站 | shuǐ diàn zhàn | hydroelectric station | 用水力发电的地方 | 这个＿＿发的电可以供好几个城市用。 | 水坝
蓄水 | xù shuǐ | to store water | 把水存起来 | 雨季的时候，大坝开始＿＿，留着旱季用。
`,
  },
  {
    theme: ["Soil", "土壤"],
    data: `
肥沃 | féi wò | fertile | 土地里养分多 | 这里的土地很＿＿，种什么都长得好。
沃土 | wò tǔ | fertile soil | 肥沃的土地 | 黑土地是一片＿＿，出产大量粮食。 | 沃野
沃野 | wò yě | fertile plain | 肥沃的大片田野 | 站在山上往下看，＿＿千里，一眼望不到边。 | 沃土
腐烂 | fǔ làn | to rot | 东西坏了、烂了 | 落叶＿＿以后会变成土里的养分。
腐殖质 | fǔ zhí zhì | humus | 动植物腐烂以后在土里形成的物质 | 森林的土里有很多＿＿，所以很肥。 | 腐叶
腐叶 | fǔ yè | rotting leaves | 腐烂的落叶 | 用＿＿做的土特别适合养花。
侵蚀 | qīn shí | to erode | 慢慢地损坏 | 风和水长年＿＿着山上的石头。
水土流失 | shuǐ tǔ liú shī | soil erosion | 土被水冲走，土地变坏 | 山上的树被砍光了，造成了严重的＿＿。
风化 | fēng huà | to weather | 石头长时间受风吹日晒而变得松散 | 这块石头＿＿得很厉害，用手一摸就掉下来很多沙子。
堆肥 | duī féi | compost | 把落叶等堆起来变成的肥料 | 她用厨房里的菜叶做＿＿。
`,
  },
  {
    theme: ["Farming the Land", "耕种"],
    data: `
耕地 | gēng dì | farmland | 用来种庄稼的土地 | 中国人口多，＿＿比较少。
耕种 | gēng zhòng | to cultivate | 翻土、种庄稼 | 他们一家人世世代代在这里＿＿。
开垦 | kāi kěn | to reclaim (land) | 把荒地变成可以种庄稼的地 | 农民在山下＿＿了一大片荒地。 | 垦荒
垦荒 | kěn huāng | to open up wasteland | 开发荒地 | 几十年前，很多年轻人来到北方＿＿。 | 开垦
退耕还林 | tuì gēng huán lín | to return farmland to forest | 不在山坡上种庄稼，改种树 | 为了保护环境，这里实行＿＿。
农耕 | nóng gēng | farming | 种地 | 中国有几千年的＿＿历史。
春耕 | chūn gēng | spring ploughing | 春天的耕地播种 | 天气暖和了，农民开始忙着＿＿。 | 深耕
深耕 | shēn gēng | to plough deep | 把地耕得很深 | ＿＿能让土变松，庄稼长得更好。
精耕细作 | jīng gēng xì zuò | intensive farming | 认真细心地种地 | 他们靠＿＿，在这块小地上收了很多粮食。
耕牛 | gēng niú | plough ox | 用来耕地的牛 | 以前农民家里都有＿＿，现在大多用机器了。
`,
  },
  {
    theme: ["Irrigation", "灌溉"],
    data: `
灌溉 | guàn gài | to irrigate | 把水输送到田里 | 这条河的水用来＿＿两岸的农田。 | 浇灌
浇灌 | jiāo guàn | to water | 浇水，让植物得到水 | 老师用心＿＿着一个个“小树苗”。 | 灌溉
灌木 | guàn mù | shrub | 比较矮、没有主干的树 | 路边种了一排＿＿，修得很好看。
水渠 | shuǐ qú | irrigation ditch | 人工挖的引水的道 | 农民修了一条＿＿，把河水引到田里。 | 沟渠
沟渠 | gōu qú | ditches | 水沟和水渠 | 田间的＿＿把水送到每一块地里。 | 水渠
渠道 | qú dào | channel | 水道；比喻办法、途径 | 你可以通过正规＿＿买到这本书。
滴灌 | dī guàn | drip irrigation | 让水一滴一滴地流到植物根部 | 在缺水的地方，用＿＿可以省很多水。
灌水 | guàn shuǐ | to pour in water | 往里面放水 | 他往瓶子里＿＿，再把花插进去。
灌输 | guàn shū | to instil | 把思想、知识传给人 | 好的教育不只是＿＿知识，还要教学生自己思考。
水到渠成 | shuǐ dào qú chéng | to come naturally | 条件成熟了，事情自然成功 | 只要你努力学习，考上大学是＿＿的事。
`,
  },
  {
    theme: ["Burning and Pollution", "焚烧和污染"],
    data: `
焚烧 | fén shāo | to burn | 用火烧 | 在田里＿＿垃圾会污染空气。
野火 | yě huǒ | wildfire | 野外烧起来的火 | 天气干燥，山上很容易发生＿＿。
腐蚀 | fǔ shí | to corrode | 慢慢地损坏 | 海水会＿＿铁做的船。
酸雨 | suān yǔ | acid rain | 含酸太多的雨 | ＿＿会伤害植物，还会损坏建筑。
重金属 | zhòng jīn shǔ | heavy metal | 很重的金属，有些对人有害 | 河水受到了＿＿污染，鱼都死了。
铅 | qiān | lead | 一种软而重的灰色金属 | ＿＿是一种很重的金属，进入人体会损害健康。
含铅 | hán qiān | containing lead | 里面有铅 | 这种玩具＿＿，对孩子的健康有害。
防腐 | fáng fǔ | to prevent decay | 防止东西坏掉 | 这种木头经过了＿＿处理，可以用很多年。
防腐剂 | fáng fǔ jì | preservative | 让食物不容易坏的东西 | 这种面包不含＿＿，要早点吃完。
腐败 | fǔ bài | to decay; corrupt | 东西坏了；官员利用权力谋私利 | 夏天食物容易＿＿，要放进冰箱。
`,
  },
  {
    theme: ["Ecological Balance", "生态平衡"],
    data: `
生态平衡 | shēng tài píng héng | ecological balance | 生物和环境之间保持稳定 | 乱捕野生动物会破坏＿＿。
植树造林 | zhí shù zào lín | to plant trees and make forests | 种树，让荒地变成森林 | 他们＿＿几十年，把沙地变成了森林。
可持续 | kě chí xù | sustainable | 能长期保持下去的 | 发展经济要走＿＿发展的道路。
荒漠化 | huāng mò huà | desertification | 土地变成荒漠 | 植被被破坏以后，土地会慢慢＿＿。 | 沙漠化
沙漠化 | shā mò huà | turning into desert | 土地变成沙漠 | 风沙越来越大，这里的草原正在＿＿。 | 荒漠化
治沙 | zhì shā | to control desertification | 防止和治理风沙 | 经过多年＿＿，这片沙地长出了草和树。
防风林 | fáng fēng lín | windbreak | 用来挡风的树林 | 村子北边种了一排＿＿，挡住了风沙。
碳排放 | tàn pái fàng | carbon emissions | 排到空气里的二氧化碳 | 少开车、多坐公交车可以减少＿＿。
垃圾分类 | lā jī fēn lèi | waste sorting | 把垃圾按种类分开放 | 现在很多城市都实行＿＿，纸、塑料要分开放。
节能减排 | jié néng jiǎn pái | to save energy and cut emissions | 节约能源，减少污染物的排放 | 为了＿＿，工厂换了新的机器。
`,
  },
  // Unit 6: Science and Technology.
  {
    theme: ["Particles and Boiling", "颗粒和沸点"],
    data: `
颗粒 | kē lì | particle, grain | 小而圆的粒儿 | 这种药是＿＿状的，要用温水冲开喝。
颗粒物 | kē lì wù | particulate matter | 空气里飘着的很小的固体或液体 | 空气里的＿＿太多，就会出现雾霾。
粒子 | lì zǐ | particle | 构成物质的极小的单位 | 原子由更小的＿＿组成。 | 颗粒
沸点 | fèi diǎn | boiling point | 液体开始烧开的温度 | 在一个标准大气压下，水的＿＿是一百度。 | 熔点
熔点 | róng diǎn | melting point | 固体开始变成液体的温度 | 冰的＿＿是零度。 | 沸点
沸水 | fèi shuǐ | boiling water | 烧开了的水 | 把鸡蛋放进＿＿里煮十分钟。
沸腾 | fèi téng | to boil; to seethe | 液体烧开，冒出很多气泡；比喻情绪高涨 | 水加热到一百度就会＿＿。
气化 | qì huà | to vaporize | 液体或固体变成气体 | 水受热以后会＿＿，变成水蒸气。 | 液化
液化 | yè huà | to liquefy | 气体变成液体 | 天然气经过＿＿以后，可以用船运到很远的地方。 | 气化
化学式 | huà xué shì | chemical formula | 用符号表示物质组成的式子 | ＿＿用符号表示一种物质是由哪些元素组成的。
`,
  },
  {
    theme: ["Filters and Solutions", "过滤和溶液"],
    data: `
过滤 | guò lǜ | to filter | 让液体或气体通过，把杂质留下 | 河水要经过＿＿才能喝。
滤网 | lǜ wǎng | filter screen | 用来过滤的网 | 空调的＿＿要经常清洗。 | 滤纸
滤纸 | lǜ zhǐ | filter paper | 用来过滤的纸 | 做实验时，老师用＿＿把水里的沙子分离出来。 | 滤网
净水器 | jìng shuǐ qì | water purifier | 把水变干净的机器 | 家里装了一台＿＿，水可以直接喝。
溶液 | róng yè | solution | 一种物质溶解在另一种物质里形成的液体 | 把盐放进水里，盐溶解以后就成了盐水＿＿。
杂质 | zá zhì | impurity | 混在里面的不纯的东西 | 这块金子里含有一些＿＿。
渗透 | shèn tòu | to permeate | 液体慢慢透过去；比喻慢慢进入 | 雨水慢慢地＿＿到地下。 | 渗水
渗水 | shèn shuǐ | to leak (water) | 水慢慢地透过来 | 下了几天雨，墙角开始＿＿了。 | 渗透
渗出 | shèn chū | to ooze | 从里面慢慢地出来 | 伤口里＿＿了一点儿血。
试纸 | shì zhǐ | test paper | 用来测试物质性质的纸 | 用＿＿可以测出这种水是酸的还是碱的。
`,
  },
  {
    theme: ["Cracks and Splitting", "裂缝和分裂"],
    data: `
裂缝 | liè fèng | crack | 裂开的细长的缝儿 | 地震以后，墙上出现了一道＿＿。 | 裂痕 裂口
裂开 | liè kāi | to split open | 破开，分开 | 天太干了，地都＿＿了。
分裂 | fēn liè | to divide | 一个分成几个 | 一个细胞＿＿成两个细胞。
裂变 | liè biàn | fission | 原子核分成两个或几个，放出能量 | 核电站利用原子核＿＿产生的能量发电。
破裂 | pò liè | to rupture | 完整的东西破开 | 气球充气太多，一下子＿＿了。 | 断裂
断裂 | duàn liè | to fracture | 断开 | 这根钢管受力太大，已经＿＿了。
裂痕 | liè hén | crack; rift | 东西裂开的痕迹；比喻感情上的分歧 | 那次吵架以后，两个人的友谊有了＿＿。 | 裂缝
四分五裂 | sì fēn wǔ liè | to fall apart | 分成很多部分，不完整、不团结 | 杯子掉在地上，摔得＿＿。
核裂变 | hé liè biàn | nuclear fission | 原子核分裂放出能量的过程 | 原子弹的能量来自＿＿。 | 裂变
裂口 | liè kǒu | split, gash | 裂开的口子 | 他的嘴唇干得起了＿＿。 | 裂缝
`,
  },
  {
    theme: ["Chemical Elements", "化学元素"],
    data: `
氮 | dàn | nitrogen | 空气里含量最多的元素 | 空气中大约有百分之七十八是＿＿。 | 氮气
氮气 | dàn qì | nitrogen gas | 由氮组成的气体 | 食品包装袋里常常充＿＿，让食品不容易坏。 | 氮
氯 | lǜ | chlorine | 一种黄绿色、有毒的元素 | 游泳池的水里常常加一点含＿＿的东西来消毒。 | 氯气
氯气 | lǜ qì | chlorine gas | 由氯组成的有毒气体 | ＿＿是黄绿色的，有很强的味道。 | 氯
铝 | lǚ | aluminium | 一种轻的银白色金属 | 这种锅是用＿＿做的，又轻又不容易生锈。
硅 | guī | silicon | 用来做芯片的一种元素 | 电脑的芯片主要是用＿＿做的。
锂 | lǐ | lithium | 一种很轻的金属，常用来做电池 | 手机电池里一般含有＿＿。
碱 | jiǎn | alkali | 和酸相对的一类物质 | 做面食时，在面里放一点＿＿，可以去掉酸味。
周期表 | zhōu qī biǎo | periodic table | 把化学元素按规律排成的表 | 化学课上，我们学习了元素＿＿。
化学反应 | huà xué fǎn yìng | chemical reaction | 物质变成新物质的变化 | 铁生锈是一种＿＿。
`,
  },
  {
    theme: ["Acids and Bases", "酸和碱"],
    data: `
酸性 | suān xìng | acidic | 有酸的性质 | 醋是＿＿的，味道很酸。 | 碱性
碱性 | jiǎn xìng | alkaline | 有碱的性质 | 这块地的土是＿＿的，不适合种喜欢酸性土的花。 | 酸性
中和 | zhōng hé | to neutralize | 酸和碱合在一起，变成没有酸性和碱性 | 胃酸太多时，可以吃一点药来＿＿。
酸碱度 | suān jiǎn dù | pH | 表示酸性或碱性强弱的程度 | 种花之前，最好先测一下土的＿＿。
烧杯 | shāo bēi | beaker | 实验室里用来装液体、可以加热的杯子 | 他把溶液倒进＿＿里，放在火上加热。 | 试管
试管 | shì guǎn | test tube | 实验室里用的细长的玻璃管 | 他往＿＿里滴了几滴药水，液体马上变红了。 | 烧杯
实验报告 | shí yàn bào gào | lab report | 记录实验过程和结果的文字 | 做完实验以后，每个学生都要写一份＿＿。
对照组 | duì zhào zǔ | control group | 实验中不做处理、用来比较的一组 | 实验分两组，一组吃新药，另一组是＿＿，不吃药。
样品 | yàng pǐn | sample | 用来检验或展示的一部分东西 | 工人把一小块＿＿送到实验室检查。
精度 | jīng dù | precision | 准确的程度 | 这台仪器的＿＿很高，误差不到千分之一。
`,
  },
  {
    theme: ["Materials", "材料"],
    data: `
合金 | hé jīn | alloy | 两种以上金属等熔合成的金属 | 钢是铁和碳的＿＿。 | 铝合金
铝合金 | lǚ hé jīn | aluminium alloy | 以铝为主的合金 | 这辆自行车是用＿＿做的，又轻又结实。 | 合金
不锈钢 | bù xiù gāng | stainless steel | 不容易生锈的钢 | 厨房里的锅和水池常常是用＿＿做的。 | 铝合金
单晶硅 | dān jīng guī | monocrystalline silicon | 结构整齐的纯硅 | 太阳能电池板常常用＿＿做。
锂电池 | lǐ diàn chí | lithium battery | 用锂做的电池 | 电动汽车大多用＿＿。
韧性 | rèn xìng | toughness | 受力时不容易断的性质 | 这种材料＿＿很好，弯过来也不会断。 | 柔韧 坚韧
坚韧 | jiān rèn | tenacious | 结实，不容易被破坏；意志坚强 | 他凭着＿＿的意志，终于完成了这项研究。 | 韧性
柔韧 | róu rèn | supple | 又软又有韧性 | 经常做体操，身体会变得很＿＿。 | 韧性
纤维 | xiān wéi | fibre | 细长像丝的东西 | 多吃蔬菜能补充＿＿，帮助消化。
碳纤维 | tàn xiān wéi | carbon fibre | 用碳做的又轻又结实的纤维 | 这种自行车的车架是用＿＿做的，非常轻。
`,
  },
  {
    theme: ["Levers and Axles", "杠杆和轴"],
    data: `
杠杆 | gàng gǎn | lever | 绕着一个点转动、可以省力的硬棍 | 用＿＿可以很省力地把重的东西举起来。
支点 | zhī diǎn | fulcrum | 杠杆转动时不动的那个点 | 古希腊科学家说：“给我一个＿＿，我就能移动地球。”
轴 | zhóu | axle, axis | 让轮子转动的杆子；作为标准的直线 | 地球围着自己的＿＿转，一天转一圈。 | 车轴
车轴 | chē zhóu | axle | 连接两个车轮的杆子 | 这辆车的＿＿断了，轮子掉了下来。 | 轴
中轴线 | zhōng zhóu xiàn | central axis | 把一个东西分成对称两半的线 | 北京的老城有一条＿＿，很多重要的建筑都在这条线上。
单杠 | dān gàng | horizontal bar | 一根横杆的运动器械 | 他在＿＿上做了二十个引体向上。 | 双杠
双杠 | shuāng gàng | parallel bars | 两根平行横杆的运动器械 | 体操运动员在＿＿上做出了漂亮的动作。 | 单杠
旗杆 | qí gān | flagpole | 挂旗子的杆子 | 学校操场中间立着一根高高的＿＿。 | 电线杆
栏杆 | lán gān | railing | 桥边、楼梯边的拦挡 | 过桥的时候，小孩子要扶着＿＿。
电线杆 | diàn xiàn gān | telegraph pole | 架电线的杆子 | 路边每隔几十米就有一根＿＿。 | 旗杆
`,
  },
  {
    theme: ["Screws and Nails", "螺丝和钉子"],
    data: `
螺丝 | luó sī | screw | 有螺纹、用来固定东西的小零件 | 椅子腿松了，要把＿＿上紧。 | 螺母
螺母 | luó mǔ | nut | 套在螺丝上的有孔的零件 | 先把螺丝穿过去，再在另一头上好＿＿。 | 螺丝
螺丝刀 | luó sī dāo | screwdriver | 拧螺丝的工具 | 他用＿＿把电脑的后盖打开了。
螺旋 | luó xuán | spiral | 像螺丝纹一样旋转的形状 | 这座楼的楼梯是＿＿形的，一圈一圈往上。
钉子 | dīng zi | nail | 一头尖的细金属棍 | 他在墙上打了一颗＿＿，用来挂画。 | 图钉
图钉 | tú dīng | drawing pin | 用手按进去的小钉子 | 他用四个＿＿把地图按在墙上。 | 钉子
钉 | dìng | to nail | 用尖的细金属棍把东西连在一起 | 他把几块木板＿＿在一起，做了一个小箱子。
拆开 | chāi kāi | to take apart | 把连在一起的东西分开 | 他把旧收音机＿＿，想看看里面的结构。 | 拆卸
拆卸 | chāi xiè | to dismantle | 把机器拆开、卸下零件 | 工人们正在＿＿旧的机器。 | 拆开
零件 | líng jiàn | part, component | 机器的一个小部分 | 这台机器少了一个＿＿，不能用了。 | 螺丝 螺母
`,
  },
  {
    theme: ["Pumps, Cables and Welding", "水泵、电缆和焊接"],
    data: `
水泵 | shuǐ bèng | water pump | 抽水的机器 | 地下室进水了，工人用＿＿把水抽出去。
电缆 | diàn lǎn | electric cable | 外面包着绝缘材料的粗电线 | 工人们在地下铺设＿＿。 | 光缆
光缆 | guāng lǎn | optical cable | 由很多光纤组成的缆 | 网络信号通过海底＿＿传到别的大洲。 | 电缆
缆车 | lǎn chē | cable car | 挂在钢缆上运人的车 | 我们坐＿＿上了山顶。
铸造 | zhù zào | to cast | 把熔化的金属倒进模子里做成东西 | 这口大钟是用铜＿＿的。
焊接 | hàn jiē | to weld | 用加热的方法把金属连在一起 | 工人在＿＿钢管，火花四射。 | 电焊
电焊 | diàn hàn | electric welding | 用电加热的焊接 | 做＿＿的时候，一定要戴上保护眼睛的面罩。 | 焊接
钻头 | zuàn tóu | drill bit | 钻孔用的尖头 | 这个＿＿很硬，连石头都能钻开。
钻孔 | zuān kǒng | to drill a hole | 用钻打洞 | 他在墙上＿＿，准备装一个架子。
光纤 | guāng xiān | optical fibre | 传送光信号的极细的玻璃丝 | 家里装了＿＿以后，网速快多了。 | 光缆
`,
  },
  {
    theme: ["Shapes", "形状"],
    data: `
弧线 | hú xiàn | curve, arc | 弯曲的线 | 球在空中划出了一道漂亮的＿＿。 | 弧形
弧形 | hú xíng | arc shape | 像圆的一段的形状 | 这座桥是＿＿的，像半个圆。 | 弧线
圆柱 | yuán zhù | cylinder | 上下两个面是圆、中间直的形状 | 杯子的形状一般是＿＿。 | 柱子
圆锥 | yuán zhuī | cone | 底面是圆、上面尖的形状 | 这种帽子是＿＿形的，上面尖尖的。
凹 | āo | concave, sunken | 中间低下去 | 他的车门被打了一下，＿＿进去一块。 | 凹凸不平
凸 | tū | convex, bulging | 中间高起来 | 他吃得太多，肚子都＿＿出来了。 | 凹凸不平
凹凸不平 | āo tū bù píng | bumpy | 表面高高低低，不平 | 这条山路＿＿，骑车很危险。 | 凹 凸
柱子 | zhù zi | pillar, post | 立着支撑房子的东西 | 这座古老的大殿里有几十根红色的＿＿。 | 圆柱
凸透镜 | tū tòu jìng | convex lens | 中间厚、边上薄的镜片 | 用＿＿可以把太阳光集中到一个点上。 | 凹透镜
凹透镜 | āo tòu jìng | concave lens | 中间薄、边上厚的镜片 | 近视眼镜用的是＿＿。 | 凸透镜
`,
  },
  {
    theme: ["Measuring Circles", "圆的测量"],
    data: `
半径 | bàn jìng | radius | 圆心到圆上任何一点的距离 | 一个圆的＿＿是直径的一半。 | 直径
直径 | zhí jìng | diameter | 通过圆心、两头都在圆上的线 | 这个圆的＿＿是十厘米，半径是五厘米。 | 半径
周长 | zhōu cháng | perimeter | 一个图形一圈的长度 | 这个正方形每条边长五米，＿＿是二十米。
圆周率 | yuán zhōu lǜ | pi | 圆的周长和直径的比 | ＿＿大约是三点一四。
口径 | kǒu jìng | calibre, bore | 圆口的直径；说法的标准 | 这根水管的＿＿是五厘米。
途径 | tú jìng | way, channel | 路；办法 | 读书是获得知识的重要＿＿。
径直 | jìng zhí | straight, directly | 直接，不绕弯 | 他下了车，＿＿走进了办公室。
锥子 | zhuī zi | awl | 用来扎孔的尖工具 | 鞋底很硬，奶奶用＿＿先打一个孔再缝。
柱形 | zhù xíng | column-shaped | 像柱子一样的形状 | 这张＿＿图清楚地显示了每个月的销售数据。
圆锥形 | yuán zhuī xíng | conical | 像圆锥一样的形状 | 这座山是＿＿的，山顶尖尖的。
`,
  },
  {
    theme: ["Edges and Circuits", "边缘和电路"],
    data: `
边缘 | biān yuán | edge, margin | 靠近边的部分 | 小心！不要站在悬崖的＿＿。
绝缘 | jué yuán | to insulate | 不让电通过 | 电线外面包着一层＿＿材料。
半导体 | bàn dǎo tǐ | semiconductor | 导电能力在导体和绝缘体之间的材料 | 硅是做芯片的重要＿＿材料。
电路 | diàn lù | circuit | 电流通过的路线 | 灯不亮了，可能是＿＿出了问题。 | 电压
电压 | diàn yā | voltage | 电的压力，单位是伏特 | 电池的＿＿太低了，灯不亮了。
短路 | duǎn lù | short circuit | 电流不经过用电器直接流回去 | 电线老化容易引起＿＿，甚至着火。
超导 | chāo dǎo | superconductivity | 在很低的温度下电阻变成零 | ＿＿材料在很低的温度下导电时几乎没有损失。
传感器 | chuán gǎn qì | sensor | 能感知外界信息并转成信号的装置 | 这辆汽车装了很多＿＿，能发现周围的障碍。
存储 | cún chǔ | to store (data) | 把东西存放起来 | 这台电脑能＿＿大量的照片和视频。
处理器 | chǔ lǐ qì | processor | 电脑里负责计算的部分 | 这台电脑的＿＿很快，运行大型软件也不卡。
`,
  },
  {
    theme: ["Examining and Learning", "鉴定和研究"],
    data: `
鉴定 | jiàn dìng | to appraise, to identify | 辨别并确定真假、好坏 | 专家＿＿以后说，这张画是真的。 | 鉴别
鉴别 | jiàn bié | to distinguish | 辨别真假 | 你能＿＿这两块玉哪块是真的吗？ | 鉴定
借鉴 | jiè jiàn | to learn from | 把别人的经验拿来参考 | 我们可以＿＿别的国家的成功经验。
鉴赏 | jiàn shǎng | to appreciate | 欣赏并评价 | 他很有艺术＿＿能力，一眼就能看出画的好坏。
年鉴 | nián jiàn | yearbook | 每年出版一次、记录一年大事和数据的书 | 这本统计＿＿记录了全国一年的经济数据。
鉴于 | jiàn yú | in view of | 考虑到 | ＿＿天气原因，比赛推迟到明天举行。
试错 | shì cuò | trial and error | 试了失败，改了再试 | 科学研究常常需要不断＿＿，才能找到正确的方法。
定律 | dìng lǜ | law (of science) | 科学上已经证明了的规律 | 牛顿提出了三大运动＿＿。
量子 | liàng zǐ | quantum | 物理学中能量等的最小单位 | ＿＿计算机的计算速度可能比现在的电脑快得多。
硅谷 | guī gǔ | Silicon Valley | 美国一个高科技公司集中的地区 | 很多有名的科技公司都在美国的＿＿。
`,
  },
  {
    theme: ["Computers and Networks", "电脑和网络"],
    data: `
云计算 | yún jì suàn | cloud computing | 通过网络使用远方电脑的计算能力 | 有了＿＿，小公司不用买很多服务器也能处理大量数据。
服务器 | fú wù qì | server | 网络上提供服务的电脑 | 网站访问的人太多，＿＿出了问题。
操作系统 | cāo zuò xì tǒng | operating system | 管理电脑的基础软件 | 手机的＿＿需要定期更新。
宽带 | kuān dài | broadband | 速度快的上网方式 | 我们家装了＿＿，上网很快。
触屏 | chù píng | touch screen | 用手指点就能操作的屏幕 | 现在的手机大多是＿＿的，没有键盘了。
鼠标 | shǔ biāo | mouse (of a computer) | 控制电脑屏幕上光标的工具 | 用＿＿点一下这个图标，就能打开文件。
摄像头 | shè xiàng tóu | camera (lens) | 拍摄视频的装置 | 开视频会议之前，先检查一下电脑的＿＿。
输入法 | shū rù fǎ | input method | 往电脑里打字的方法 | 我用拼音＿＿打汉字。
基站 | jī zhàn | base station | 收发手机信号的设备 | 山区新建了很多＿＿，手机信号好多了。
自动驾驶 | zì dòng jià shǐ | self-driving | 车不用人开，自己行驶 | ＿＿汽车靠传感器和电脑来判断路况。
`,
  },
  {
    theme: ["Exploring Space", "太空探索"],
    data: `
运载火箭 | yùn zài huǒ jiàn | carrier rocket | 把卫星等送上太空的火箭 | ＿＿把卫星送上了轨道。
月球车 | yuè qiú chē | lunar rover | 在月亮上行驶的车 | ＿＿在月亮上行驶，拍下了很多照片。
新材料 | xīn cái liào | new materials | 新发明的、性能更好的材料 | 航天器上用了很多又轻又结实的＿＿。
气凝胶 | qì níng jiāo | aerogel | 一种很轻的固体材料 | ＿＿是世界上最轻的固体材料之一。
失重 | shī zhòng | weightlessness | 感觉不到重力 | 在太空里，航天员处于＿＿状态，会浮在空中。
真空 | zhēn kōng | vacuum | 没有空气的空间 | 太空接近＿＿，声音没法传播。
返回舱 | fǎn huí cāng | re-entry capsule | 把航天员带回地面的舱 | 航天员坐着＿＿安全回到了地面。
天体 | tiān tǐ | celestial body | 太空中的星星等物体 | 太阳、月亮和星星都是＿＿。
小行星 | xiǎo xíng xīng | asteroid | 绕着太阳转的很小的天体 | 火星和木星之间有一个＿＿带。
宇航服 | yǔ háng fú | spacesuit | 航天员在太空里穿的衣服 | 航天员出舱的时候要穿上＿＿。
`,
  },
  {
    theme: ["Research and Innovation", "科研和创新"],
    data: `
科研 | kē yán | scientific research | 科学研究 | 这所大学的＿＿水平很高，发表了很多论文。
攻关 | gōng guān | to tackle a key problem | 集中力量解决难题 | 研究小组正在＿＿，想尽快解决这个技术难题。
科技成果 | kē jì chéng guǒ | scientific achievements | 科学技术研究得到的结果 | 这项＿＿已经用到了农业生产中。
试验 | shì yàn | trial, test | 为了看效果先试着做 | 这种新药正在做临床＿＿。
知识产权 | zhī shi chǎn quán | intellectual property | 人对自己的发明、作品等享有的权利 | 随便复制别人的软件，侵犯了＿＿。
技术革新 | jì shù gé xīn | technical innovation | 对技术进行改进 | 经过＿＿，工厂的生产效率提高了很多。
高科技 | gāo kē jì | high technology | 最新、最先进的科学技术 | 这家公司生产＿＿产品，比如机器人和无人机。
前沿 | qián yán | frontier | 最前面的部分；最新的领域 | 量子计算是现在科学研究的＿＿。
仿生 | fǎng shēng | bionic | 学习生物的结构和功能来设计东西 | 人们模仿鱼的身体设计船，这就是＿＿学的一个例子。
科普 | kē pǔ | popular science | 向大家介绍科学知识 | 这位科学家常常给孩子们写＿＿书。
`,
  },
];
