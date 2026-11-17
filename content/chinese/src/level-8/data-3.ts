// The third quarter of level 8 (docs/chinese-curriculum.md §8.3): units 7 to 9, civilizations, ethics, and poetry and
// drama, 90 characters in 9 batches and 470 words in 47 batches. The characters are new to levels 1 to 7 and to the
// first two quarters, chosen from the middle third of GF 0025-2021's advanced band by frequency for what each unit's
// words need; the words and sentences use only the characters of levels 1 to 7 and those taught so far.
//
// A character line as in level 1: `字 reading[/other] | meaning in English | meaning in Chinese | characters it looks
// like[ | characters of the batch whose meanings are too close to offer against it]`.
//
// A word line as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches3 are the 9 character batches of units 7 to 9 of level 8, three a unit, in teaching order. */
export const characterBatches3: readonly string[] = [
  // Unit 7: Civilizations.
  `
埃 āi | dust; used in 埃及, Egypt | 很细的灰尘；用于非洲一个国家名称的音译 | 挨唉
楔 xiē | wedge | 一头宽一头尖、可以打进缝里的木块 | 契模
篆 zhuàn | seal script | 古代的一种字体，笔画圆而长 | 缘篡
殷 yīn | the Shang dynasty's late name; earnest | 商朝后期的称呼；深厚，热情周到 | 般股
墟 xū | ruins | 从前有人住过、现在已经荒了的地方 | 虚嘘
隋 suí | the Sui dynasty | 唐朝以前的一个朝代 | 随堕
帛 bó | silk fabric | 丝织品的总称 | 帕锦
巫 wū | shaman | 古时自称能和鬼神沟通的人 | 坐巧
兽 shòu | beast | 有四条腿、全身长毛的动物 | 单曾
葬 zàng | to bury | 把死去的人埋起来 | 莽藏
`,
  `
骆 luò | camel, with 驼 | 和“驼”合在一起，是一种沙漠里的大动物 | 络洛 | 驼
驼 tuó | camel; hunched | 一种背上有峰的动物；背弯起来 | 佗沱 | 骆
驿 yì | post station | 古代传递公文的人换马、休息的地方 | 译择
桅 wéi | mast | 船上挂帆的长杆子 | 危脆
锚 máo | anchor | 沉到水底、使船停稳的铁器 | 猫描
贾 gǔ/jiǎ | merchant; a surname | 商人；姓 | 贯贡
敦 dūn | honest and sincere; to urge | 诚恳朴实；催促 | 敬郭
鞍 ān | saddle | 放在马背上供人骑坐的器具 | 按安
驮 tuó/duò | to carry on the back | 用背部承载人或东西 | 驶驭
戈 gē | dagger-axe | 古代一种长柄的兵器 | 弋戊
`,
  `
玺 xǐ | imperial seal | 帝王的印 | 迩弥
诏 zhào | imperial edict | 皇帝发布的命令 | 招沼
郡 jùn | prefecture (in ancient China) | 古代的一级地方行政区 | 群君
衙 yá | government office (in old times) | 旧时官员办公的地方 | 街衔
酋 qiú | chief of a tribe | 部落的首领 | 尊酉
蛮 mán | rough, unreasonable; barbarian | 粗野，不讲道理；古代对南方民族的称呼 | 峦弯
堡 bǎo/bǔ/pù | fort, castle | 用来防守的坚固建筑 | 保煲
剑 jiàn | sword | 两边有刃、中间有脊的兵器 | 俭检
匈 xiōng | used in 匈奴, the Xiongnu | 古代北方一个游牧民族名称中的字 | 胸凶
遣 qiǎn | to send, to dispatch | 派人去 | 遗谴
`,
  // Unit 8: Ethics.
  `
惭 cán | ashamed | 因为做错了事而觉得不好意思 | 渐斩 | 愧
愧 kuì | ashamed, conscience-stricken | 觉得对不起别人，心里不安 | 魁块 | 惭
恭 gōng | respectful | 对人有礼貌，尊敬 | 共慕
畏 wèi | to fear; to hold in awe | 害怕；敬服 | 胃畔
厚 hòu | thick; generous, kind | 上下两面距离大；待人宽和 | 原厘
衷 zhōng | inner feelings | 内心 | 哀衰
贱 jiàn | cheap; lowly | 价钱低；地位低下 | 践浅
淳 chún | pure, honest | 质朴，纯正 | 惇谆
诫 jiè | to warn, to admonish | 劝告人不要犯错 | 戒械
顽 wán | stubborn; naughty | 不容易改变；爱玩爱闹 | 颈烦
`,
  `
狡 jiǎo | cunning | 心眼多，善于骗人 | 校绞 | 猾
猾 huá | crafty, slippery | 奸诈，不老实 | 滑骨 | 狡
拯 zhěng | to save, to rescue | 援救 | 承蒸
袒 tǎn | to take sides; to bare | 偏护一方；露出 | 祖坦
庇 bì | to shelter, to protect | 遮蔽，保护 | 屁毕
馈 kuì | to present; to feed back | 送给；把信息送回 | 溃愦
挚 zhì | sincere, earnest | 真诚，诚恳 | 势垫
豁 huò/huō | open-minded; to give up everything | 心胸开阔；不顾一切 | 割害
婪 lán | greedy | 贪心，想要得到更多 | 禁梦
疚 jiù | remorseful | 因为对不起别人而长久地不安 | 久灸
`,
  `
吝 lìn | stingy | 舍不得拿出来用或给人 | 齐各 | 啬
啬 sè | miserly | 小气，过分爱惜钱财 | 墙蔷 | 吝
奸 jiān | treacherous; traitor | 狡猾虚伪；出卖国家或主人的人 | 好歼
鄙 bǐ | mean, low; to look down on | 低下，粗俗；看不起 | 图都 | 蔑
叛 pàn | to betray, to rebel | 背离自己的一方，投向对方 | 判伴
蔑 miè | to belittle, to despise | 轻视，不放在眼里 | 篾薇 | 鄙
憎 zēng | to hate | 厌恶，恨 | 增僧
褒 bāo | to praise | 夸奖，赞扬 | 保衰
钦 qīn | to admire, to respect | 敬重，佩服 | 欣软
堕 duò | to fall; to degenerate | 掉下来；变坏 | 随墙
`,
  // Unit 9: Poetry and Drama.
  `
仄 zè | oblique tones | 古汉语中上、去、入三声的统称 | 厌庆
泪 lèi | tear | 眼睛里流出来的液体 | 沮泊
眺 tiào | to look into the distance | 往远处看 | 跳挑
泣 qì | to weep | 小声地哭 | 拉粒
凄 qī | cold and dreary; sad | 寒冷，冷清；悲伤 | 妻萋
惆 chóu | disappointed | 失意，伤感 | 绸调 | 怅
怅 chàng | melancholy | 不如意，不痛快 | 张帐 | 惆
悼 dào | to mourn | 怀念死去的人，并感到悲伤 | 掉卓
皎 jiǎo | bright and clear (of the moon) | 洁白明亮 | 狡校
鸣 míng | to cry (of birds); to sound | 鸟兽或昆虫叫；发出声音 | 呜鸡
`,
  `
雁 yàn | wild goose | 一种候鸟，秋天往南飞 | 鹰应 | 鸿
鸿 hóng | swan goose; great | 大雁；大 | 江鸡 | 雁
鹊 què | magpie | 一种叫声响亮、尾巴长的鸟 | 鹄措
蝉 chán | cicada | 夏天在树上叫的昆虫 | 弹禅
菊 jú | chrysanthemum | 秋天开的一种花 | 掬鞠
莺 yīng | oriole, warbler | 一种叫声好听的小鸟 | 萤鸯
燕 yàn/yān | swallow; the state of Yan | 一种春天飞来、在屋檐下做窝的鸟；战国时的一个国名 | 熊蒸
鹤 hè | crane | 一种腿长、脖子长的鸟 | 鸽隺
枫 fēng | maple | 一种秋天叶子变红的树 | 讽疯
霞 xiá | rosy clouds | 早晚天空出现的彩色的云 | 震暇
`,
  `
梅 méi | plum blossom | 一种冬末春初开花的树 | 海悔
荷 hé/hè | lotus; to carry | 一种长在水里、叶子又圆又大的植物；扛，背 | 何苛
蝶 dié | butterfly | 翅膀很美、喜欢在花间飞的昆虫 | 碟谍
旦 dàn | dawn; female role (in opera) | 天亮的时候；戏曲中扮演女子的角色 | 且但
捧 pěng | to hold in both hands; to flatter | 用双手托着；奉承，抬高 | 奉棒
厢 xiāng | wing room; box (in a theatre) | 正房两边的房屋；包间 | 箱湘
蝴 hú | butterfly, with 蝶 | 和“蝶”合在一起，指一种翅膀美丽的昆虫 | 湖糊 | 蝶
杨 yáng | poplar; a surname | 一种长得高而直的树；姓 | 扬汤
粤 yuè | Guangdong | 广东的别称 | 奥粟
稽 jī/qǐ | to examine; funny, as in 滑稽 | 查考；用在形容言行引人发笑的词里 | 稿嵇
`,
];

/** wordBatches3 are the 47 word batches of units 7 to 9 of level 8, in teaching order. */
export const wordBatches3: readonly LevelWordBatch[] = [
  // Unit 7: Civilizations.
  {
    theme: ["Egypt and Mesopotamia", "古埃及和两河流域"],
    data: `
古埃及 | gǔ āi jí | ancient Egypt | 几千年前尼罗河边的古老国家 | ＿＿人用一种特别的方法保存死者的身体，让它几千年不腐烂。 | 法老
尼罗河 | ní luó hé | the Nile | 流经埃及的著名长河 | ＿＿是非洲最长的河流，从南往北流进地中海。
法老 | fǎ lǎo | pharaoh | 古埃及的国王 | 胡夫金字塔是一位＿＿的陵墓。
木乃伊 | mù nǎi yī | mummy | 用特殊方法保存下来、没有腐烂的尸体 | 博物馆里展出了一具三千多年前的＿＿，外面还包着布。
楔形文字 | xiē xíng wén zì | cuneiform | 两河流域的古人刻在泥板上、笔画像木楔的文字 | 古代两河流域的人用尖尖的笔在湿泥上写＿＿。
象形文字 | xiàng xíng wén zì | pictographic script | 照着事物的样子画出来的文字 | 古埃及的＿＿很像一幅幅小画，有鸟，有眼睛，也有人。
狮身人面像 | shī shēn rén miàn xiàng | the Sphinx | 埃及金字塔旁边狮子身子、人的头的巨大石像 | 胡夫金字塔附近有一座巨大的＿＿，已经守在那里四千多年了。
泥板 | ní bǎn | clay tablet | 用泥做成、可以在上面刻字的板子 | 考古学家在两河流域挖出了大量刻着文字的＿＿。
古巴比伦 | gǔ bā bǐ lún | ancient Babylon | 两河流域的古代王国 | 传说中的空中花园在＿＿，被列为古代世界七大奇迹之一。
莎草纸 | shā cǎo zhǐ | papyrus | 古埃及人用一种水草的茎做成的书写材料 | 古埃及人用尼罗河边的一种草做成＿＿，在上面写字。
`,
  },
  {
    theme: ["Scripts and Seals", "字体和刻字"],
    data: `
篆书 | zhuàn shū | seal script | 秦朝和秦朝以前通行的古代字体 | 很多印章上刻的字是＿＿，弯弯曲曲的，不容易认。 | 小篆
小篆 | xiǎo zhuàn | small seal script | 秦朝统一以后规定使用的字体 | 秦始皇统一六国后，把＿＿定为全国的标准字体。 | 篆书
篆刻 | zhuàn kè | seal carving | 在石头等材料上刻印章的艺术 | 他喜欢＿＿，常常拿着小刀在石头上刻自己的名字。
帛书 | bó shū | writing on silk | 写在丝织品上的书 | 马王堆汉墓出土了一批写在丝绸上的＿＿。
简帛 | jiǎn bó | bamboo slips and silk | 竹简和丝织品，古人写字的材料 | 在纸普及以前，古人主要把字写在＿＿上。 | 帛书
书同文 | shū tóng wén | one script for all | 统一全国的文字 | 秦朝实行＿＿的政策，让各地都用同一种文字。
金文 | jīn wén | bronze script | 铸在青铜器上的古代文字 | ＿＿是铸在青铜器上的文字，在商周时期最多。
刻字 | kè zì | to engrave characters | 在硬的东西上刻出文字 | 店里的师傅可以在钢笔上＿＿，刻上你的名字。
隶变 | lì biàn | the shift to clerical script | 汉字从篆书变成隶书的过程 | 经过＿＿，汉字的笔画由弯曲变得平直。
字形 | zì xíng | form of a character | 汉字的形体 | 从甲骨文到楷书，汉字的＿＿发生了很大的变化。
`,
  },
  {
    theme: ["The Ruins of Yin", "殷墟和商代"],
    data: `
殷墟 | yīn xū | the Ruins of Yin | 商朝后期都城的遗址，在河南安阳 | 大批刻着文字的甲骨，是在河南安阳的＿＿出土的。
殷商 | yīn shāng | the Shang dynasty | 商朝，因为后期都城在殷而得名 | ＿＿时期，人们已经会铸造精美的青铜器。
废墟 | fèi xū | ruins | 房屋等被毁坏以后留下的地方 | 一场大火过后，这座老宅子变成了一片＿＿。
甲骨 | jiǎ gǔ | oracle bones | 古人刻字用的龟甲和兽骨 | 商朝的人在＿＿上刻字，记录占卜的结果。
兽骨 | shòu gǔ | animal bone | 野兽的骨头 | 考古学家在洞里发现了很多烧过的＿＿，说明古人在这里吃过肉。
卜辞 | bǔ cí | divination records | 刻在甲骨上的占卜记录 | 甲骨上的＿＿记下了商王问天气、问收成的事。
礼器 | lǐ qì | ritual vessel | 古代祭祀等礼仪中用的器物 | 这件青铜鼎是商朝贵族祭祀时用的＿＿。
野兽 | yě shòu | wild beast | 生活在山林里、不是人养的动物 | 古时候，人们晚上点起火堆，用来赶走＿＿。
遗存 | yí cún | remains | 古代留下来的东西 | 这里发现了大量新石器时代的文化＿＿。
都城 | dū chéng | capital city | 国家最高政权所在的城市 | 唐朝的＿＿长安，是当时世界上最大的城市之一。
`,
  },
  {
    theme: ["Tombs and Burials", "墓葬"],
    data: `
墓葬 | mù zàng | tomb, burial site | 埋死者的地方和方式 | 这片古代＿＿里出土了大量陶器和玉器。 | 陵墓
陪葬品 | péi zàng pǐn | grave goods | 和死者一起埋进墓里的东西 | 墓里的＿＿有铜镜、玉器和陶罐。
安葬 | ān zàng | to lay to rest | 隆重地把死者埋好 | 按照他的遗愿，家人把他＿＿在家乡的小山上。
葬礼 | zàng lǐ | funeral | 为死者举行的告别仪式 | 很多人来参加了这位老科学家的＿＿，向他告别。
陵墓 | líng mù | mausoleum | 帝王或重要人物的坟墓 | 北京的明十三陵是明朝十三位皇帝的＿＿。
墓室 | mù shì | burial chamber | 墓里放死者和陪葬品的屋子 | 考古队员走进＿＿，看到墙上画满了壁画。
火葬 | huǒ zàng | cremation | 用火把死者烧成骨灰 | 现在很多城市提倡＿＿，节约土地。
秦始皇陵 | qín shǐ huáng líng | the Mausoleum of the First Qin Emperor | 中国第一个皇帝的陵墓，在陕西西安附近 | 兵马俑是在＿＿附近发现的。
墓碑 | mù bēi | gravestone | 立在坟前、刻着死者名字的石头 | 这位作家的＿＿上，只刻着他的名字和一句话。
盗墓 | dào mù | grave robbing | 偷挖古墓里的东西 | ＿＿是违法行为，会严重破坏文物。
`,
  },
  {
    theme: ["Early Beliefs", "早期的信仰"],
    data: `
巫师 | wū shī | shaman | 古时自称能和神灵沟通的人 | 古代部落遇到大事，常请＿＿来占卜。 | 祭司
巫术 | wū shù | magic rites | 古人想借神秘力量影响事物的做法 | 古人生病时会用＿＿来治病，这当然没有科学根据。
原始宗教 | yuán shǐ zōng jiào | primitive religion | 远古人类对自然和祖先的崇拜 | 在＿＿里，人们常常崇拜太阳、高山和大河。
图腾崇拜 | tú téng chóng bài | totem worship | 把某种动物或植物当作本族的标志来崇拜 | 有的部落把熊当作自己的祖先，这是一种＿＿。
万物有灵 | wàn wù yǒu líng | animism | 认为天地间的一切都有灵魂的观念 | 古人相信＿＿，觉得山、河和大树都有灵魂。
神兽 | shén shòu | mythical beast | 神话中有神力的动物 | 在古代传说里，青龙和白虎都是守护四方的＿＿。
求雨 | qiú yǔ | to pray for rain | 天旱时祈求下雨 | 古代遇到大旱，人们常常举行仪式＿＿。
祭品 | jì pǐn | offerings | 祭祀时献给神或祖先的东西 | 春节祭祖时，桌上摆满了＿＿。
祭司 | jì sī | priest | 主持祭祀的人 | 在古埃及，神庙里的祭祀由＿＿负责。 | 巫师
驱邪 | qū xié | to drive away evil spirits | 赶走邪恶的东西 | 过去民间有在端午节挂艾草＿＿的习俗。
`,
  },
  {
    theme: ["The Silk Road", "丝绸之路上"],
    data: `
骆驼 | luò tuo | camel | 背上有峰、能在沙漠里走很远的动物 | 在沙漠里，＿＿被叫作“沙漠之舟”。
驼队 | tuó duì | camel train | 一队运货的骆驼 | 一支＿＿驮着丝绸，慢慢走过沙漠。 | 商队
驼峰 | tuó fēng | camel's hump | 骆驼背上鼓起来的部分 | 骆驼的＿＿里存着脂肪，可以帮它几天不吃东西。
驼铃 | tuó líng | camel bell | 挂在骆驼脖子上的铃 | 远处传来叮当叮当的＿＿声，商人们快到了。
戈壁 | gē bì | gobi, stony desert | 地面是粗沙和石子的荒漠 | 汽车在一望无际的＿＿上开了一整天，路边几乎没有草。
驿站 | yì zhàn | post station | 古代送公文的人换马休息的地方 | 古代送信的人跑到＿＿，就换一匹马继续赶路。
驿道 | yì dào | post road | 古代为传送公文修的大路 | 古代的＿＿连着京城和各地，路边每隔一段就有一个换马的地方。
西域 | xī yù | the Western Regions | 汉代以后对玉门关以西地区的称呼 | 汉朝派使者出使＿＿，打通了丝绸之路。
商队 | shāng duì | caravan | 结伴运货做买卖的商人队伍 | 这支＿＿里有中国商人，也有波斯商人。 | 驼队
互市 | hù shì | border trade | 不同民族、国家之间的贸易往来 | 古代中原和北方民族常在边境＿＿，用茶叶换马。
`,
  },
  {
    theme: ["Merchants and Goods", "商贾和货物"],
    data: `
商贾 | shāng gǔ | merchants | 做买卖的人的总称 | 古代的扬州十分繁华，来来往往的＿＿很多。
驮运 | tuó yùn | to carry by pack animal | 用马、骆驼等背着运东西 | 这里山高路险，汽车上不去，货物只能用马＿＿。 | 贩运
驮马 | tuó mǎ | pack horse | 专门用来背东西的马 | 那匹＿＿背上放着两大袋茶叶。
马鞍 | mǎ ān | saddle | 放在马背上供人骑坐的器具 | 骑马以前，要先把＿＿放好、系紧。
茶马古道 | chá mǎ gǔ dào | the Ancient Tea Horse Road | 古代西南地区用茶叶换马的商路 | ＿＿穿过云南和四川的大山，一直通到西藏。
马帮 | mǎ bāng | horse caravan | 用马运货、结伴走山路的队伍 | 在高山深谷里，＿＿是古代运输货物的主要力量。 | 驮马
皮毛 | pí máo | furs | 动物的皮和毛 | 北方的游牧民族常用＿＿换中原的布和茶。
贩运 | fàn yùn | to transport goods for sale | 从一地买货运到另一地去卖 | 他的祖辈靠＿＿茶叶为生，常年在南方和北方之间来回。 | 驮运
货郎 | huò láng | peddler | 挑着担子走村串巷卖小东西的人 | 小时候，村里常来一位＿＿，卖针线和糖果。
商帮 | shāng bāng | merchant group | 同一地方的商人结成的团体 | 明清时期的晋商是有名的＿＿，生意遍布全国。
`,
  },
  {
    theme: ["Masts and Anchors", "桅杆和船锚"],
    data: `
桅杆 | wéi gān | mast | 船上挂帆的长杆 | 船上的＿＿很高，上面挂着三面大帆。
抛锚 | pāo máo | to drop anchor; to break down | 把锚扔进水里使船停住；车在半路坏了 | 汽车在半路上＿＿了，我们只好等人来修。
起锚 | qǐ máo | to weigh anchor | 把锚拉上来，开船 | 天一亮，船长就下令＿＿出发。
铁锚 | tiě máo | iron anchor | 铁做的锚 | 水手们把沉重的＿＿抛进了海里。
宝船 | bǎo chuán | treasure ship | 明朝出使海外的船队里最大的船 | 明朝出使海外的船队里，最大的船叫＿＿。
船队 | chuán duì | fleet | 一起航行的许多船 | 十几条渔船组成一支＿＿，一起出海捕鱼。
下西洋 | xià xī yáng | to sail to the Western Oceans | 明朝时派船队到东南亚和印度洋一带 | 明朝的船队曾七次＿＿，最远到了非洲东岸。
罗盘 | luó pán | compass | 测定方向的仪器 | 古代航海家靠＿＿在大海上辨别方向。
海上丝绸之路 | hǎi shàng sī chóu zhī lù | the Maritime Silk Road | 古代中国和外国通过海路做贸易的路线 | 福建的泉州是＿＿的重要港口。
水手 | shuǐ shǒu | sailor | 船上的普通船员 | 船上的＿＿们一边拉帆，一边唱着歌。
`,
  },
  {
    theme: ["Envoys", "使者和往来"],
    data: `
遣唐使 | qiǎn táng shǐ | Japanese envoys to Tang China | 日本派到唐朝学习的使节 | 唐朝时，日本多次派出＿＿来中国学习。
派遣 | pài qiǎn | to dispatch | 派人到某地去做事 | 学校＿＿了两位老师到山区支教。 | 互派
使节 | shǐ jié | envoy | 代表国家到外国办事的人 | 各国的＿＿出席了这次国际会议。 | 使团
使团 | shǐ tuán | diplomatic mission | 由使节等人组成的团体 | 皇帝派出一个上百人的＿＿出访邻国。
出使 | chū shǐ | to go abroad as an envoy | 奉命到外国去办事 | 他奉皇帝的命令＿＿西域，一去就是十几年。
通商 | tōng shāng | to trade | 国家之间做买卖 | 两国＿＿以后，来往的商船越来越多。
朝贡 | cháo gòng | to pay tribute | 古代附属国向中原王朝进献礼物 | 古代一些周边小国定期向中原王朝＿＿。
东渡 | dōng dù | to cross the sea to the east | 往东过海，多指去日本 | 唐朝的鉴真和尚六次＿＿，最后终于到了日本。
互派 | hù pài | to send to each other | 双方互相派人 | 两所大学每年＿＿学生，到对方学校交流学习。 | 派遣
国书 | guó shū | state letter | 一国元首写给另一国元首的正式书信 | 使者带着皇帝的＿＿，来到邻国的都城。
`,
  },
  {
    theme: ["The Emperor's Word", "皇帝的命令"],
    data: `
玉玺 | yù xǐ | imperial jade seal | 皇帝用的玉印 | 皇帝的命令上要盖上＿＿才算数。
诏书 | zhào shū | imperial edict | 皇帝发布命令的文书 | 大臣们站在殿上，听人宣读皇帝的＿＿。
下诏 | xià zhào | to issue an edict | 皇帝发布命令 | 那年发生了大水灾，皇帝＿＿减免灾区的赋税。
即位 | jí wèi | to ascend the throne | 开始做皇帝或国王 | 他十六岁＿＿，做了五十多年的皇帝。
退位 | tuì wèi | to abdicate | 不再做皇帝或国王 | 一九一二年，清朝最后一位皇帝宣布＿＿。
禅让 | shàn ràng | to cede the throne to the worthy | 把帝位让给有才德的人 | 传说上古的帝王不把位子传给儿子，而是＿＿给有才德的人。
传位 | chuán wèi | to pass on the throne | 把帝位传给别人 | 老皇帝临终前，＿＿给了他的第三个儿子。
皇权 | huáng quán | imperial power | 皇帝的权力 | 秦始皇统一六国以后，＿＿变得空前强大。
龙椅 | lóng yǐ | dragon throne | 皇帝坐的椅子 | 故宫太和殿的正中，摆着皇帝的＿＿。
国号 | guó hào | name of a dynasty | 一个朝代的名称 | 唐朝的＿＿是“唐”，一共用了将近三百年。
`,
  },
  {
    theme: ["Local Government of Old", "古代的地方官府"],
    data: `
郡县制 | jùn xiàn zhì | the system of prefectures and counties | 秦朝在全国推行的地方管理制度 | 秦朝废除分封，在全国推行＿＿。
郡守 | jùn shǒu | prefect | 一个郡的最高长官 | 秦朝时，一个郡的最高长官叫＿＿。 | 知府
衙门 | yá men | yamen | 旧时官员办公的地方 | 古时候，老百姓有冤屈，就到＿＿去告状。
县令 | xiàn lìng | county magistrate | 古代一个县的长官 | 这位＿＿很清廉，把一个县管理得很好。
知府 | zhī fǔ | prefect (Ming and Qing) | 明清时一个府的长官 | 明清时期，一个府的长官叫＿＿。 | 郡守
官府 | guān fǔ | the authorities (in old times) | 旧时的政府 | 古代修大桥，常常要由＿＿出钱。 | 衙门
地方官 | dì fāng guān | local official | 管理一个地方的官员 | 古代的＿＿要管理税收、审案子、修水利。 | 县令
巡抚 | xún fǔ | provincial governor | 明清时管理一个省的长官 | 清朝时，一个省的军政大事常由＿＿负责。
分封制 | fēn fēng zhì | enfeoffment | 天子把土地分给亲属和功臣、让他们去统治的制度 | 周朝实行＿＿，把土地分给王族和功臣。
告示 | gào shì | public notice | 贴出来让大家知道的通知 | 官府在城门口贴出＿＿，通知百姓修桥的事。
`,
  },
  {
    theme: ["Peoples of the Steppe", "草原上的民族"],
    data: `
匈奴 | xiōng nú | the Xiongnu | 古代北方的一个游牧民族 | 秦朝修长城，有一个目的是防备北方的＿＿。
游牧民族 | yóu mù mín zú | nomadic people | 靠放牧生活、常常迁移的民族 | ＿＿跟着水草走，一年要换好几个地方住。
酋长 | qiú zhǎng | chief | 部落的首领 | 部落里的大事，由＿＿和老人们一起商量决定。
蛮族 | mán zú | barbarian peoples | 古罗马人对周边民族的称呼 | 古罗马人把边境以外的部落称为＿＿。
野蛮 | yě mán | savage, rude | 不文明，粗暴 | 抢别人的东西是一种＿＿的行为。
部族 | bù zú | tribe, clan | 由几个氏族结合成的群体 | 草原上的许多＿＿，后来结成了一个强大的联盟。
和亲 | hé qīn | marriage alliance | 古代为和好，两国或两族之间结亲 | 汉朝曾把公主嫁给匈奴的首领，这就是历史上的＿＿。
可汗 | kè hán | khan | 古代一些北方民族对最高首领的称呼 | 成吉思汗被蒙古各部推举为大＿＿。
蒙古包 | méng gǔ bāo | yurt | 蒙古族住的圆顶帐篷 | 草原上的＿＿可以拆开，方便搬到别的地方。
马背 | mǎ bèi | horseback | 马的背上 | 蒙古族被称为“＿＿上的民族”。
`,
  },
  {
    theme: ["Castles and Forts", "城堡和关隘"],
    data: `
城堡 | chéng bǎo | castle | 用来防守的坚固大建筑 | 中世纪的欧洲贵族住在高大的＿＿里。 | 古堡
古堡 | gǔ bǎo | old castle | 古老的城堡 | 这座建在山顶上的＿＿已经有八百年历史了。 | 城堡
堡垒 | bǎo lěi | fortress | 军事上防守用的坚固建筑 | 海边的那座＿＿是古代用来防守海岸的。
护城河 | hù chéng hé | moat | 绕着城墙挖的河 | 故宫的城墙外面有一条＿＿，水面很宽。
关隘 | guān ài | mountain pass | 险要的关口 | 山海关是长城东边的重要＿＿。
城楼 | chéng lóu | gate tower | 城门上面的楼 | 站在古城的＿＿上，可以看到整座城。 | 箭楼
城池 | chéng chí | city walls and moat; city | 城墙和护城河，也指城市 | 古代打仗，常常是为了争夺＿＿和土地。
箭楼 | jiàn lóu | arrow tower | 城墙上开着小窗、可以向外射箭的楼 | 北京前门的＿＿上，有很多射箭用的小窗口。
炮台 | pào tái | gun battery | 安放大炮的防守建筑 | 海边的旧＿＿现在成了一个历史博物馆。
城门 | chéng mén | city gate | 城墙上供人出入的门 | 古代城市到了晚上就关上＿＿，不让人出入。
`,
  },
  {
    theme: ["Swords and Shields", "刀剑和兵器"],
    data: `
宝剑 | bǎo jiàn | fine sword | 好的剑 | 他把那把祖传的＿＿捐给了博物馆。 | 青铜剑
青铜剑 | qīng tóng jiàn | bronze sword | 用青铜铸成的剑 | 这把两千多年前的＿＿出土时还闪闪发光，一点儿也没有生锈。
刀剑 | dāo jiàn | swords and blades | 刀和剑 | 博物馆里陈列着各个朝代的＿＿。 | 兵器
剑术 | jiàn shù | swordsmanship | 用剑的技术 | 他从小学习＿＿，表演起来动作非常漂亮。
干戈 | gān gē | weapons; war | 古代的两种兵器，比喻战争 | 为了一点小事，没必要大动＿＿。
化干戈为玉帛 | huà gān gē wéi yù bó | to turn hostility into friendship | 把战争变成和平，把仇人变成朋友 | 两个国家通过谈判＿＿，从此友好相处。
击剑 | jī jiàn | fencing | 一种穿着护具、用剑比赛的体育运动 | ＿＿运动员穿着白色的衣服，还戴着面罩。
剑客 | jiàn kè | swordsman | 剑术高的人 | 古代小说里常常有一位独来独往的＿＿，背着一把长剑。
兵器 | bīng qì | weapon | 打仗用的器械 | 古代的＿＿有刀、剑、戈等。 | 刀剑
盾牌 | dùn pái | shield | 古代打仗时用来挡住刀箭的东西 | 古代士兵一手拿着刀，一手拿着＿＿。
`,
  },
  {
    theme: ["Greece and Rome", "希腊和罗马"],
    data: `
雅典 | yǎ diǎn | Athens | 希腊的首都，古希腊的著名城邦 | 古希腊的＿＿出了很多哲学家。
斯巴达 | sī bā dá | Sparta | 古希腊一个以军事闻名的城邦 | 古希腊的＿＿以军事强大闻名，孩子从小就要接受训练。
奥林匹亚 | ào lín pǐ yà | Olympia | 古希腊举行运动会的地方 | 古代奥运会是在希腊的＿＿举行的。
罗马帝国 | luó mǎ dì guó | the Roman Empire | 古罗马建立的大帝国 | 最强大的时候，＿＿的领土包括整个地中海沿岸。
斗兽场 | dòu shòu chǎng | the Colosseum, amphitheatre | 古罗马人观看人和野兽搏斗的圆形大建筑 | 罗马的＿＿是一座巨大的圆形建筑，可以容纳几万人。
元老院 | yuán lǎo yuàn | the Senate | 古罗马的议事机构 | 古罗马的＿＿是一个重要的议事机构，很多国家大事都要在这里讨论。
神殿 | shén diàn | temple | 供奉神的殿堂 | 雅典山顶上那座古老的＿＿是用白色大理石建的。
柱廊 | zhù láng | colonnade | 用一排排柱子支撑的走廊 | 古希腊建筑常有长长的＿＿，一根根石柱排成一排。
共和 | gòng hé | republic | 国家权力由选出的人掌握的政体 | 古罗马曾经实行＿＿，后来才变成帝国。
罗马法 | luó mǎ fǎ | Roman law | 古罗马的法律 | 很多欧洲国家的法律都受到了＿＿的影响。
`,
  },
  {
    theme: ["Cultures Meeting", "文明的交融"],
    data: `
隋朝 | suí cháo | the Sui dynasty | 唐朝以前的一个统一王朝 | ＿＿只有三十多年，却开凿了著名的大运河。
大运河 | dà yùn hé | the Grand Canal | 从北京通到杭州的古代人工河 | ＿＿把北方和南方连在一起，方便了运粮和做生意。
长安 | cháng ān | Chang'an | 汉唐时期的都城，在今天的西安 | 唐朝时，很多外国商人和留学生住在＿＿。
互鉴 | hù jiàn | to learn from each other | 互相借鉴 | 不同的文明应该交流＿＿，取长补短。
兼容并蓄 | jiān róng bìng xù | to embrace all | 把各种不同的东西都接受下来 | 唐朝的文化＿＿，吸收了很多外来的东西。
古今中外 | gǔ jīn zhōng wài | of all times and places | 古代和现代，中国和外国 | 这本书收集了＿＿的名人故事。
外来文化 | wài lái wén huà | foreign culture | 从别的国家或地区传来的文化 | 佛教是一种＿＿，后来和中国文化融合在了一起。
本土化 | běn tǔ huà | localization | 变得适合本地的情况 | 这家外国快餐店推出了包子和米饭，努力实现＿＿。
胡服 | hú fú | Hu clothing | 古代北方和西方民族的服装 | 战国时，有一位国王让士兵穿上＿＿，方便骑马射箭。
和而不同 | hé ér bù tóng | harmony without sameness | 和睦相处，但不必完全一样 | 不同的文化可以＿＿，互相尊重，共同发展。
`,
  },
  // Unit 8: Ethics.
  {
    theme: ["Shame and Guilt", "惭愧和内疚"],
    data: `
惭愧 | cán kuì | ashamed | 因为有缺点或做错了事而不好意思 | 老师表扬了我，可我知道自己做得还不够，心里很＿＿。 | 羞愧
羞愧 | xiū kuì | ashamed and embarrassed | 又害羞又不好意思 | 被人当场发现说谎，他＿＿得满脸通红。 | 无地自容
内疚 | nèi jiù | guilty | 心里觉得对不起别人而不安 | 因为没去医院看望生病的朋友，她一直很＿＿。 | 愧疚 良心不安
愧疚 | kuì jiù | remorseful | 惭愧而不安 | 他对父母充满了＿＿，觉得这些年陪他们的时间太少了。 | 良心不安
问心无愧 | wèn xīn wú kuì | to have a clear conscience | 自己想一想，没有对不起别人的地方 | 只要尽了最大的努力，不管结果怎样，我都＿＿。 | 心安理得
当之无愧 | dāng zhī wú kuì | fully deserving | 完全配得上，一点也不惭愧 | 她救了三个落水的孩子，“英雄”这个称号她＿＿。
心安理得 | xīn ān lǐ dé | to feel at ease about one's conduct | 自以为做得合理，心里很平静 | 他拿了别人的东西，竟然还＿＿，一点也不脸红。
无地自容 | wú dì zì róng | to wish the ground would swallow one | 羞愧得没有地方可以藏身 | 想起自己当时说的那些可笑的话，他就觉得＿＿。
良心不安 | liáng xīn bù ān | to have a guilty conscience | 觉得做了错事，心里平静不下来 | 他把别人丢的钱留下了，几天来一直＿＿。
过意不去 | guò yì bú qù | to feel sorry for the trouble | 觉得麻烦了别人，心里不安 | 让你这么晚还来送我，我真是＿＿。
`,
  },
  {
    theme: ["Respect and Awe", "恭敬和敬畏"],
    data: `
恭敬 | gōng jìng | respectful | 对人尊敬有礼貌 | 他＿＿地把茶递给了爷爷。 | 毕恭毕敬 谦恭
谦恭 | qiān gōng | modest and courteous | 谦虚而有礼貌 | 他虽然很有名，待人却十分＿＿，从不摆架子。
毕恭毕敬 | bì gōng bì jìng | extremely deferential | 非常尊敬，十分小心 | 在长辈面前，他总是站得笔直，＿＿的。
洗耳恭听 | xǐ ěr gōng tīng | to be all ears | 很恭敬、很认真地听 | 您有什么好主意，请说吧，我们＿＿。
恭维 | gōng wei | to flatter | 为了讨好别人而说好听的话 | 他的这些话都是＿＿，你别太当真。
敬畏 | jìng wèi | to revere | 又尊敬又害怕 | 我们应该对大自然怀有＿＿之心。
畏惧 | wèi jù | to fear | 害怕 | 面对困难，他从不＿＿，总是迎难而上。
无畏 | wú wèi | fearless | 什么都不怕 | 消防员们＿＿地冲进了着火的大楼。
后生可畏 | hòu shēng kě wèi | the young will surpass their elders | 年轻人很有前途，值得敬重 | 这个十五岁的少年下棋赢了老棋手，真是＿＿。
望而生畏 | wàng ér shēng wèi | daunting at first sight | 一看就害怕 | 这本书又厚又难，让很多读者＿＿。
`,
  },
  {
    theme: ["Kind and Honest", "厚道和淳朴"],
    data: `
厚道 | hòu dao | kind and honest | 待人诚恳，不刻薄 | 老王为人＿＿，从来不占别人的便宜。 | 忠厚 敦厚 宽厚
宽厚 | kuān hòu | generous and tolerant | 对人宽容，不计较 | 爷爷待人＿＿，邻居们有了矛盾都爱找他评理。 | 敦厚
忠厚 | zhōng hòu | honest and good-natured | 忠诚老实，待人好 | 他是个＿＿老实的人，答应的事一定办到。 | 敦厚
敦厚 | dūn hòu | simple and sincere | 诚恳朴实 | 这位老教授性格温和＿＿，学生们都很尊敬他。 | 厚道
淳朴 | chún pǔ | simple and unspoiled | 诚实朴素 | 山里的村民十分＿＿，热情地请我们到家里吃饭。 | 厚道
厚此薄彼 | hòu cǐ bó bǐ | to favour one over another | 对一方好，对另一方差 | 父母对两个孩子要一样好，不能＿＿。
厚爱 | hòu ài | kind regard | 深厚的爱护 | 感谢大家对我的＿＿，我一定会继续努力。
待人接物 | dài rén jiē wù | the way one treats people | 和别人相处、来往 | 她＿＿很有礼貌，大家都喜欢她。
民风 | mín fēng | local ways | 一个地方百姓的风气 | 这里＿＿淳朴，晚上睡觉都不用锁门。
与人为善 | yǔ rén wéi shàn | to be well-meaning towards others | 用善意待人，帮助别人 | 他一向＿＿，邻居有困难他总是第一个帮忙。
`,
  },
  {
    theme: ["From the Heart", "发自内心"],
    data: `
衷心 | zhōng xīn | heartfelt | 发自内心的 | ＿＿感谢大家这几年对我的帮助。 | 由衷 诚挚
由衷 | yóu zhōng | sincere, from the heart | 出自内心 | 看到学生取得这么好的成绩，老师＿＿地感到高兴。
初衷 | chū zhōng | original intention | 最初的心愿 | 他当老师的＿＿，是让山里的孩子都能读上书。
苦衷 | kǔ zhōng | private difficulty | 说不出口的困难 | 他这么做一定有自己的＿＿，我们不要怪他。
言不由衷 | yán bù yóu zhōng | to say what one does not mean | 说的话不是心里真正想的 | 他嘴上说没关系，其实是＿＿，心里很难过。
无动于衷 | wú dòng yú zhōng | unmoved | 一点也不感动，没有反应 | 大家都被这个故事感动哭了，只有他＿＿。
真挚 | zhēn zhì | sincere | 真诚而深切 | 这封信写得很＿＿，读了让人感动。 | 诚挚
诚挚 | chéng zhì | earnest | 诚恳而真诚 | 我们向各位来宾表示＿＿的欢迎。
挚友 | zhì yǒu | close friend | 关系亲密、真诚相待的朋友 | 他们俩从小一起长大，是无话不谈的＿＿。
推心置腹 | tuī xīn zhì fù | to confide sincerely | 真心诚意地对待别人 | 两个人＿＿地谈了一个晚上，误会终于解开了。
`,
  },
  {
    theme: ["Warnings and Advice", "告诫和规劝"],
    data: `
告诫 | gào jiè | to warn | 严肃地提醒别人不要犯错 | 父亲常常＿＿我：做人一定要诚实。 | 劝诫 训诫
训诫 | xùn jiè | to reprimand | 教训和警告 | 他上课玩手机，被老师叫到办公室＿＿了一番。
劝诫 | quàn jiè | to exhort | 劝告人改正错误 | 朋友多次＿＿他少熬夜，他终于听进去了。 | 规劝
规劝 | guī quàn | to admonish | 认真地劝人改正 | 在家人的＿＿下，他终于放弃了那个危险的想法。
前车之鉴 | qián chē zhī jiàn | a lesson from others' mistakes | 前人的失败可以作为后人的教训 | 别人的失败是我们的＿＿，要牢牢记住。 | 引以为戒
引以为戒 | yǐn yǐ wéi jiè | to take as a warning | 把别人的错误当作教训 | 这次事故的教训，大家要＿＿，以后千万别再犯。
警钟 | jǐng zhōng | alarm bell | 提醒人注意危险的信号 | 这次交通事故给所有司机敲响了＿＿。
良药苦口 | liáng yào kǔ kǒu | good advice is hard to hear | 好的意见常常不好听 | ＿＿，朋友的批评虽然不好听，但对你有好处。
苦口婆心 | kǔ kǒu pó xīn | to exhort patiently | 好心好意地反复劝说 | 妈妈＿＿地劝了他半天，他才答应去医院。
循循善诱 | xún xún shàn yòu | to guide patiently | 一步一步地耐心引导 | 这位老师上课＿＿，学生们都很喜欢听。
`,
  },
  {
    theme: ["Stubborn and Cunning", "顽固和狡猾"],
    data: `
顽固 | wán gù | stubborn | 坚持旧的看法，不肯改变 | 爷爷很＿＿，怎么劝他都不肯去医院检查。 | 执迷不悟 一意孤行
顽皮 | wán pí | naughty | 爱玩爱闹，不听话 | 这个孩子很＿＿，常常爬到树上去。
顽强 | wán qiáng | tenacious | 坚强，不怕困难 | 小草从石缝里长出来，生命力非常＿＿。
狡猾 | jiǎo huá | cunning | 心眼多，不老实 | 这个骗子很＿＿，换了好几种方法骗老人的钱。 | 狡诈 奸诈
狡诈 | jiǎo zhà | crafty and deceitful | 狡猾，爱骗人 | 这个商人非常＿＿，很多顾客都上过他的当。 | 奸诈
狡辩 | jiǎo biàn | to quibble | 明明错了还找理由为自己辩护 | 证据都摆在面前了，你就别再＿＿了。
奸诈 | jiān zhà | treacherous | 虚伪狡猾 | 戏里的这个人物阴险＿＿，观众都很讨厌他。
老奸巨猾 | lǎo jiān jù huá | wily old fox | 非常狡猾、经验很多的坏人 | 那个＿＿的骗子换了好几个名字，警察找了很久才抓住他。
执迷不悟 | zhí mí bú wù | to persist in error | 坚持错误，不肯醒悟 | 大家都说那是骗局，他却＿＿，还要往里投钱。 | 一意孤行
一意孤行 | yí yì gū xíng | to go one's own way | 不听别人劝告，坚持按自己的想法去做 | 队长不听大家的意见，＿＿，结果比赛输了。
`,
  },
  {
    theme: ["Fair and Unfair", "公与私"],
    data: `
偏袒 | piān tǎn | to be partial to | 不公平地支持一方 | 裁判不能＿＿比赛中的任何一方。 | 袒护
袒护 | tǎn hù | to shield (wrongly) | 对错误的言行不公正地保护 | 孩子做错了事，父母不应该＿＿他。 | 包庇 护短
包庇 | bāo bì | to cover up for | 掩护坏人坏事 | 他明知道朋友偷了东西，却帮着隐瞒，这是＿＿。
护短 | hù duǎn | to defend one's own faults | 为自己或自己人的缺点辩护 | 王老师从不＿＿，自己班的学生犯了错，照样批评。
贵贱 | guì jiàn | high and low status | 地位高的和地位低的 | 职业不分＿＿，每一种劳动都应该得到尊重。
公道 | gōng dao | fair | 公平合理 | 这家店的价钱很＿＿，从来不骗顾客。 | 公允
公允 | gōng yǔn | fair and balanced | 公平恰当 | 这篇评论写得很＿＿，既讲了优点，也指出了缺点。
大公无私 | dà gōng wú sī | selfless | 一心为公，没有私心 | 他办事＿＿，从不为自己的亲戚开后门。 | 公私分明
公私分明 | gōng sī fēn míng | to keep public and private apart | 公家的事和自己的事分得很清楚 | 他＿＿，从来不用单位的车办自己的事。
假公济私 | jiǎ gōng jì sī | to use public office for private gain | 借公家的名义谋取私人的好处 | 用公款请朋友吃饭，这是＿＿的行为。
`,
  },
  {
    theme: ["Repaying Kindness", "感恩和回报"],
    data: `
馈赠 | kuì zèng | to present as a gift | 赠送 | 这幅画是一位老朋友＿＿给他的。
报答 | bào dá | to repay | 用行动感谢别人给的好处 | 他决心好好学习，＿＿父母的养育之恩。
知恩图报 | zhī ēn tú bào | grateful and eager to repay | 知道别人的恩情，想办法回报 | 他是一个＿＿的人，当年邻居帮过他，他一直记着要还这份情。 | 饮水思源
饮水思源 | yǐn shuǐ sī yuán | to remember one's roots | 不忘本，记得幸福的来源 | 他＿＿，每年都回母校看望老师。
恩将仇报 | ēn jiāng chóu bào | to repay kindness with harm | 用仇恨回报恩情 | 我救了他，他却反过来害我，真是＿＿。 | 忘恩负义
忘恩负义 | wàng ēn fù yì | ungrateful | 忘记别人的恩情，做对不起人家的事 | 发达以后就不理当年帮过他的人，这种人太＿＿了。
以德报怨 | yǐ dé bào yuàn | to return good for evil | 用恩德回报仇怨 | 邻居以前和他吵过架，可邻居生病时他还是主动帮忙，真是＿＿。
礼尚往来 | lǐ shàng wǎng lái | courtesy calls for courtesy | 礼节上讲究有来有往 | ＿＿，人家送了我们礼物，我们也应该回送一份。
拯救 | zhěng jiù | to save | 援救，使脱离危险 | 医生们用了一整夜，终于＿＿了这个病人的生命。
恩人 | ēn rén | benefactor | 对自己有大恩的人 | 当年资助他上大学的那位老人，是他一生的＿＿。
`,
  },
  {
    theme: ["Open-Minded", "豁达和大度"],
    data: `
豁达 | huò dá | open-minded | 心胸开阔，想得开 | 奶奶性格＿＿，遇到不顺心的事也总是笑着面对。 | 大度
豁然开朗 | huò rán kāi lǎng | to see the light suddenly | 一下子明白过来 | 听了老师的讲解，我心里＿＿，难题一下子就解开了。
宽宏大量 | kuān hóng dà liàng | magnanimous | 度量大，能容人 | 他＿＿，原谅了那个打破他家玻璃的孩子。 | 大度
小肚鸡肠 | xiǎo dù jī cháng | petty | 气量小，只考虑小事 | 别这么＿＿了，人家又不是故意的。
海纳百川 | hǎi nà bǎi chuān | the sea admits a hundred rivers | 心胸宽广，能接受各种不同的东西 | 这座城市＿＿，欢迎来自世界各地的人。
大度 | dà dù | generous in spirit | 能容忍别人 | 他很＿＿，被人误会了也不生气。
气量 | qì liàng | tolerance | 能接受不同意见的度量 | 一个人的＿＿要大，不要为一点小事生气。
不计前嫌 | bú jì qián xián | to let bygones be bygones | 不再计较以前的矛盾 | 两个人＿＿，又成了好朋友。
心平气和 | xīn píng qì hé | calm and even-tempered | 心情平静，态度温和 | 有了矛盾，大家坐下来＿＿地谈一谈。
想得开 | xiǎng de kāi | to take things philosophically | 不把不如意的事放在心上 | 丢了钱包他也不难过，他这个人很＿＿。 | 豁达
`,
  },
  {
    theme: ["Greed and Meanness", "贪婪和吝啬"],
    data: `
贪婪 | tān lán | greedy | 贪心，总想得到更多 | 那个国王非常＿＿，想把所有的东西都变成金子。 | 贪得无厌
贪得无厌 | tān dé wú yàn | insatiable | 贪心永远不能满足 | 他已经有了三套房子还想要更多，真是＿＿。
吝啬 | lìn sè | stingy | 舍不得花钱或给人东西 | 这个人非常＿＿，连一块钱都舍不得给别人。 | 一毛不拔
一毛不拔 | yì máo bù bá | miserly | 一根毛也不肯拔，形容非常小气 | 让他捐点儿钱，比登天还难，他向来＿＿。
不吝 | bú lìn | not to grudge | 愿意给，不舍不得 | 文章里写得不好的地方，请大家＿＿指教。
见利忘义 | jiàn lì wàng yì | to forget what is right for gain | 看到好处就忘了道义 | 他为了一点钱就把朋友的秘密卖给了别人，真是＿＿。
损人利己 | sǔn rén lì jǐ | to harm others for one's own gain | 让别人吃亏，自己得好处 | 往别人家门口倒垃圾，这是＿＿的做法。 | 自私自利
自私自利 | zì sī zì lì | selfish | 只考虑自己的好处 | 他从来不管别人，只顾自己，太＿＿了。
利他 | lì tā | altruistic | 为别人的好处着想 | 很多动物也有＿＿行为，比如把找到的食物分给同伴。
守财奴 | shǒu cái nú | miser | 有钱却舍不得花的人 | 他有那么多钱却从来不花，像个＿＿。 | 吝啬
`,
  },
  {
    theme: ["Mean and Shameless", "卑鄙和无耻"],
    data: `
卑鄙 | bēi bǐ | despicable | 品质恶劣，不道德 | 在背后造谣害人，是非常＿＿的行为。 | 缺德
鄙视 | bǐ shì | to despise | 看不起 | 大家都＿＿那种欺负弱小的人。 | 蔑视
蔑视 | miè shì | to scorn | 轻视，小看 | 他用＿＿的眼光看着那个说大话的人。 | 轻蔑
轻蔑 | qīng miè | contemptuous | 不放在眼里 | 他＿＿地笑了一下，什么也没说。
污蔑 | wū miè | to slander | 编造事实，败坏别人的名声 | 没有证据就说别人偷东西，这是＿＿。
粗鄙 | cū bǐ | vulgar | 粗俗，不文雅 | 他说话很＿＿，满嘴都是难听的话。
奸商 | jiān shāng | profiteer | 用不正当手段赚钱的商人 | 这个＿＿把过期的食品换了包装又拿出来卖。
奸臣 | jiān chén | treacherous minister | 不忠于君主、陷害好人的大臣 | 在京剧里，＿＿常常画着白脸。
厚颜无耻 | hòu yán wú chǐ | shameless | 脸皮厚，不知羞耻 | 他抄了别人的文章，还＿＿地说是自己写的。
缺德 | quē dé | wicked | 缺少道德 | 在公园的长椅上乱写乱画，真是太＿＿了。
`,
  },
  {
    theme: ["Betrayal and Two Faces", "背叛和两面"],
    data: `
背叛 | bèi pàn | to betray | 背离自己的一方，投向对方 | 他＿＿了最好的朋友，把朋友的秘密告诉了别人。 | 出卖 叛变
叛逆 | pàn nì | rebellious | 反抗，不服从 | 很多孩子在十几岁时会有＿＿心理，不爱听父母的话。
叛徒 | pàn tú | traitor | 背叛自己一方的人 | 在这部电影里，那个＿＿最后被大家认了出来。
叛变 | pàn biàn | to defect | 背叛自己的一方，投到敌人那边去 | 历史上，这个人因为＿＿投敌，一直被人看不起。
众叛亲离 | zhòng pàn qīn lí | utterly forsaken | 大家都反对，亲人也离开 | 他做了太多坏事，最后落得个＿＿的下场。
出卖 | chū mài | to sell out | 为了自己的利益损害别人 | 他为了奖金，＿＿了自己的同事。
出尔反尔 | chū ěr fǎn ěr | to go back on one's word | 说了又不算数 | 昨天答应得好好的，今天就不认账了，他怎么能＿＿呢？
两面三刀 | liǎng miàn sān dāo | double-dealing | 当面一套，背后一套 | 他当面说你好，背后说你坏话，这种＿＿的人要小心。 | 阳奉阴违 口是心非
阳奉阴违 | yáng fèng yīn wéi | to comply in public, defy in private | 表面上服从，背地里不照办 | 他对上级的安排＿＿，表面答应，实际一点也不去做。
口是心非 | kǒu shì xīn fēi | to say one thing and mean another | 嘴上说的和心里想的不一样 | 她嘴上说不喜欢这件礼物，其实心里很高兴，真是＿＿。
`,
  },
  {
    theme: ["Love, Hate, Praise and Blame", "爱憎和褒贬"],
    data: `
憎恨 | zēng hèn | to hate | 厌恶，痛恨 | 人们＿＿战争，盼望和平。 | 憎恶
憎恶 | zēng wù | to loathe | 非常讨厌 | 他从小就＿＿说谎的人。
爱憎分明 | ài zēng fēn míng | clear about what one loves and hates | 爱什么恨什么非常清楚 | 他是一个＿＿的人，对好人好事热情支持，对坏人坏事坚决反对。
面目可憎 | miàn mù kě zēng | repulsive | 样子让人讨厌 | 故事里的那个坏人被描写得＿＿。
褒贬 | bāo biǎn | praise and blame | 好的和坏的评价 | 对这部新电影，观众的＿＿不一。
褒奖 | bāo jiǎng | to commend | 表扬和奖励 | 他因为勇敢地救人，受到了政府的＿＿。
褒义 | bāo yì | commendatory sense | 词语中含有赞许的意思 | “勇敢”是一个＿＿词。 | 贬义
贬义 | biǎn yì | derogatory sense | 词语中含有不好的意思 | “狡猾”是一个＿＿词。
钦佩 | qīn pèi | to admire | 敬重佩服 | 他在困难面前从不退缩，让大家非常＿＿。 | 敬仰
敬仰 | jìng yǎng | to revere | 尊敬并且仰慕 | 孔子是受到后人＿＿的伟大思想家。
`,
  },
  {
    theme: ["Integrity", "操守和气节"],
    data: `
操守 | cāo shǒu | integrity | 平时做事的品德 | 一名法官必须有良好的职业＿＿。 | 节操
节操 | jié cāo | moral principles | 坚持正义的品德 | 竹子有节，古人常用它来比喻人的＿＿。 | 气节
气节 | qì jié | moral courage | 坚持正义、不向坏人低头的品质 | 他宁死也不投降，表现出了崇高的民族＿＿。 | 骨气
骨气 | gǔ qì | backbone | 坚强不屈的气概 | 他很有＿＿，再穷也不接受别人的施舍。
人格 | rén gé | dignity, character | 人的品格和尊严 | 我们要尊重每个人的＿＿，不能随便嘲笑别人。
品行 | pǐn xíng | conduct | 品质和行为 | 这个学生不但成绩好，＿＿也很端正。 | 德行
德行 | dé xíng | moral conduct | 道德和品行 | 古人认为，一个人的＿＿比他的才能更重要。
修身 | xiū shēn | self-cultivation | 提高自己的品德修养 | 古人认为，治理国家要从＿＿开始，先管好自己。
慎独 | shèn dú | to be watchful over oneself when alone | 一个人独处时也严格要求自己 | 古人讲究＿＿，没人看着的时候也不做坏事。
克己 | kè jǐ | self-restraint | 约束自己，严格要求自己 | 他一向＿＿奉公，从不占公家一点便宜。
`,
  },
  {
    theme: ["Falling and Mending", "堕落和改过"],
    data: `
堕落 | duò luò | to degenerate | 思想行为变坏 | 他交了坏朋友，一天天＿＿下去，后来终于醒悟了。 | 腐化
腐化 | fǔ huà | to become corrupt | 思想行为变得腐败 | 一些官员贪图享受，生活＿＿，最后受到了法律的惩罚。
同流合污 | tóng liú hé wū | to go along with wrongdoers | 跟着坏人一起做坏事 | 他宁可辞职，也不愿和那些人＿＿。
洁身自好 | jié shēn zì hào | to keep oneself clean | 保持自己的纯洁，不跟着别人做坏事 | 在复杂的环境里，他始终＿＿，从不收别人的礼。
迷途知返 | mí tú zhī fǎn | to return from the wrong path | 认识到错误并回到正路上来 | 只要你能＿＿，大家还是会原谅你的。 | 浪子回头 知错就改
改过自新 | gǎi guò zì xīn | to turn over a new leaf | 改正错误，重新做人 | 出狱以后，他＿＿，开了一家小饭馆。 | 痛改前非
浪子回头 | làng zǐ huí tóu | the prodigal returns | 走了错路的年轻人改正错误 | ＿＿金不换，他现在是一个勤劳的好青年。
知错就改 | zhī cuò jiù gǎi | to correct a mistake once aware of it | 知道错了马上改正 | 犯错并不可怕，只要＿＿就是好孩子。
痛改前非 | tòng gǎi qián fēi | to repent thoroughly | 彻底改正以前的错误 | 他对自己的过去非常后悔，决心＿＿。
悔改 | huǐ gǎi | to repent | 后悔并改正 | 他犯了错还不肯＿＿，大家都很失望。 | 痛改前非
`,
  },
  {
    theme: ["Ethics in Science and Medicine", "科技和医学伦理"],
    data: `
伦理审查 | lún lǐ shěn chá | ethics review | 对研究是否合乎道德的审查 | 用人做实验的研究，必须先通过＿＿。
科技伦理 | kē jì lún lǐ | ethics of technology | 科学技术研究中应该遵守的道德 | 人工智能发展很快，＿＿问题越来越受到重视。
基因编辑 | jī yīn biān jí | gene editing | 改变生物基因的技术 | ＿＿技术可以用来治疗一些疾病，但也引起了很多争论。
安乐死 | ān lè sǐ | euthanasia | 让病人没有痛苦地死去 | 是否允许＿＿，在许多国家都有很大的争议。
器官捐献 | qì guān juān xiàn | organ donation | 把自己的器官捐给需要的病人 | 他生前签了＿＿同意书，去世后救了好几个病人。
知情同意 | zhī qíng tóng yì | informed consent | 了解全部情况以后表示同意 | 做手术以前，医生要做到让病人＿＿，并请病人签字。
动物福利 | dòng wù fú lì | animal welfare | 动物应该得到的良好对待 | 关注＿＿的人认为，养殖场里的动物也应该有足够的活动空间。
医德 | yī dé | medical ethics | 医生的职业道德 | 这位大夫医术高明，＿＿高尚，病人都很信任他。
两难 | liǎng nán | dilemma | 怎么做都有困难 | 是留在大城市工作，还是回家乡照顾父母，他陷入了＿＿。
功利主义 | gōng lì zhǔ yì | utilitarianism | 认为能给最多的人带来最大幸福的就是对的 | 按照＿＿的观点，一件事对不对，要看它能不能给最多的人带来幸福。
`,
  },
  // Unit 9: Poetry and Drama.
  {
    theme: ["Tones and Forms of Verse", "平仄和诗体"],
    data: `
平仄 | píng zè | level and oblique tones | 诗词里声调的平声和仄声 | 写律诗要讲究＿＿，让声调高低交替。
仄声 | zè shēng | oblique tone | 古汉语中上声、去声和入声的总称 | 在古汉语里，上声、去声和入声都属于＿＿。
平声 | píng shēng | level tone | 古汉语四声中的第一类 | 普通话的第一声和第二声，大多来自古代的＿＿。
近体诗 | jìn tǐ shī | regulated verse | 唐代形成的、讲究格律的诗 | 律诗和绝句都属于＿＿，对字数和平仄都有严格的要求。
古体诗 | gǔ tǐ shī | ancient-style verse | 不太讲究格律的古代诗歌 | ＿＿的句数不固定，平仄也比较自由。
五言 | wǔ yán | five characters a line | 每句五个字的诗 | 这首诗每句五个字，是一首＿＿诗。
七言 | qī yán | seven characters a line | 每句七个字的诗 | 杜甫的这首律诗每句有七个字，是＿＿律诗。
曲牌 | qǔ pái | tune name | 曲子的调名 | 元曲的每一支曲子都有一个＿＿，规定了它的曲调和句式。
咏物诗 | yǒng wù shī | poem on an object | 描写某种东西、借它抒发感情的诗 | 这首写梅花的诗是一首＿＿，借梅花赞美坚强的品格。
送别诗 | sòng bié shī | farewell poem | 写和朋友分别的诗 | 唐代有很多＿＿，写的是诗人在路边或江边和朋友告别。
`,
  },
  {
    theme: ["Tears", "眼泪和哭泣"],
    data: `
眼泪 | yǎn lèi | tears | 眼睛里流出来的水 | 听到这个好消息，妈妈激动得流下了＿＿。 | 泪水
泪水 | lèi shuǐ | flowing tears | 流出来或含在眼里的眼泪 | 她的眼睛里充满了＿＿。 | 泪花
泪花 | lèi huā | tears in one's eyes | 含在眼里还没流下来的泪 | 老人的眼里闪着＿＿，紧紧握住了我的手。
泪珠 | lèi zhū | teardrop | 一颗一颗的泪 | 一颗大大的＿＿从她的脸上落了下来。
泪流满面 | lèi liú mǎn miàn | face streaming with tears | 脸上都是泪 | 看完这部电影，很多观众都哭得＿＿。
泣不成声 | qì bù chéng shēng | to choke with sobs | 哭得说不出话 | 她说到伤心的地方，已经＿＿了。
喜极而泣 | xǐ jí ér qì | to weep for joy | 高兴到了极点而哭 | 得知女儿考上了大学，妈妈＿＿。
哭泣 | kū qì | to weep quietly | 小声地哭 | 她关上门，一个人在房间里＿＿。 | 抽泣
抽泣 | chōu qì | to sob | 一吸一顿地哭 | 孩子哭了很久，现在只是轻轻地＿＿着。
声泪俱下 | shēng lèi jù xià | in a voice choked with tears | 一边说一边哭 | 他＿＿地讲述了自己的经历，大家都很感动。
`,
  },
  {
    theme: ["Sorrow and Mourning", "凄凉和悼念"],
    data: `
凄凉 | qī liáng | desolate | 寂寞冷落，让人难过 | 秋天的院子里空空的，只有几片落叶，显得十分＿＿。 | 凄清
凄惨 | qī cǎn | miserable | 悲惨 | 这部小说写了一个孤儿＿＿的童年。 | 凄凉
凄美 | qī měi | sad but beautiful | 悲伤而又美丽 | 这是一个＿＿的爱情故事，结局让人流泪。
凄清 | qī qīng | cold and lonely | 冷清 | 夜深了，＿＿的月光照在小河上。
惆怅 | chóu chàng | melancholy | 伤感，失意 | 毕业那天，看着熟悉的校园，他心里有些＿＿。 | 怅然
怅然 | chàng rán | disappointed | 不如意的样子 | 他到了朋友家，朋友却不在，只好＿＿离去。
悼念 | dào niàn | to mourn | 怀念死去的人 | 人们来到纪念碑前，＿＿在地震中遇难的人。 | 哀悼
哀悼 | āi dào | to grieve over | 对死去的人表示悲痛 | 这位伟人去世了，全国人民都表示深切的＿＿。
追悼会 | zhuī dào huì | memorial service | 为怀念死者而开的会 | 学校为这位老教授举行了＿＿。
悼词 | dào cí | eulogy | 怀念死者的讲话或文章 | 在告别仪式上，校长念了一篇＿＿。
`,
  },
  {
    theme: ["Moonlight and Distant Views", "月色和远眺"],
    data: `
皎洁 | jiǎo jié | bright and clear | 明亮而洁白 | 中秋的夜晚，一轮＿＿的月亮挂在天上。
明月 | míng yuè | bright moon | 明亮的月亮 | 李白的诗里常常写到＿＿，表达思乡之情。 | 月色
月色 | yuè sè | moonlight | 月亮的光 | 窗外＿＿很好，我们到院子里散散步吧。
月明星稀 | yuè míng xīng xī | bright moon and few stars | 月亮明亮，星星稀少 | ＿＿的夜晚，天上只能看到几颗星星。
眺望 | tiào wàng | to look into the distance | 从高处往远处看 | 他站在山顶上，＿＿着远方的大海。 | 远眺 极目
远眺 | yuǎn tiào | to gaze far | 向远处看 | 登上塔顶＿＿，整座城市都在眼前。 | 极目
登高 | dēng gāo | to climb to a height | 登上高处 | 重阳节有＿＿的习俗，人们会去爬山。
登高望远 | dēng gāo wàng yuǎn | to climb high and look far | 登上高处看远方 | 古人喜欢＿＿，在高楼和山顶上写下了很多有名的诗句。 | 登高
极目 | jí mù | as far as the eye can see | 尽力向远处看 | ＿＿四望，草原一直连到天边。
凭栏 | píng lán | to lean on a railing | 靠着栏杆 | 他＿＿而立，看着江上的小船。
`,
  },
  {
    theme: ["Calls and Echoes", "鸣叫和共鸣"],
    data: `
鸣叫 | míng jiào | to call, to chirp | 鸟兽或昆虫叫 | 春天来了，小鸟在树上欢快地＿＿。 | 鸟鸣
共鸣 | gòng míng | resonance, sympathy | 别人的思想感情引起相同的感受 | 这本书写出了年轻人的烦恼，引起了很多读者的＿＿。
一鸣惊人 | yì míng jīng rén | to amaze the world at one go | 平时没有表现，一下子做出惊人的成绩 | 这位年轻作家的第一部小说就＿＿，获得了大奖。
鸡鸣 | jī míng | cockcrow | 公鸡叫 | 天刚亮，村子里就传来了＿＿声。
蝉鸣 | chán míng | the song of cicadas | 蝉的叫声 | 夏天的午后，树上的＿＿一声比一声响。
鸟鸣 | niǎo míng | birdsong | 鸟的叫声 | 清晨的公园里，到处是好听的＿＿。
鸣笛 | míng dí | to sound a horn | 车、船等发出响声提醒别人 | 医院附近禁止汽车＿＿。
雷鸣 | léi míng | thunderous | 打雷的声音 | 演出结束了，台下响起了＿＿般的掌声。
自鸣得意 | zì míng dé yì | to be pleased with oneself | 自以为了不起而得意 | 他考了一次第一就＿＿，不再认真学习了。
百家争鸣 | bǎi jiā zhēng míng | a hundred schools contending | 不同学派自由争论 | 春秋战国时期，思想界出现了＿＿的局面。
`,
  },
  {
    theme: ["Birds in Poems", "诗里的鸟"],
    data: `
喜鹊 | xǐ què | magpie | 一种黑白两色、被认为能带来好消息的鸟 | 门前的树上，一只＿＿叫个不停，奶奶说要有好事了。
鹊桥 | què qiáo | bridge of magpies | 传说七夕时喜鹊搭成的桥 | 传说每年七月初七，牛郎和织女在＿＿上相会。
大雁 | dà yàn | wild goose | 一种秋天往南飞的大鸟 | 秋天，一群群＿＿排着队往南飞。 | 鸿雁
鸿雁 | hóng yàn | swan goose; a letter | 大雁；古代比喻书信 | 古人用＿＿比喻书信，传说它能替人送信。
孤雁 | gū yàn | lone goose | 离开雁群的一只雁 | 天上飞过一只＿＿，叫声听起来很凄凉。
雁阵 | yàn zhèn | formation of geese | 大雁飞行时排成的队形 | 天上的＿＿一会儿排成“人”字，一会儿排成“一”字。
黄莺 | huáng yīng | oriole | 一种羽毛黄色、叫声好听的鸟 | 柳树上的＿＿唱着好听的歌。
燕子 | yàn zi | swallow | 一种春天从南方飞来、常在人家房子下安家的鸟 | 春天到了，＿＿又飞回来，在老房子下面安了家。
莺歌燕舞 | yīng gē yàn wǔ | birds singing and swallows dancing | 形容春天景色美好 | 春天的江南＿＿，到处都是美丽的景色。
仙鹤 | xiān hè | red-crowned crane | 头顶红色、羽毛白色的一种鹤 | 在中国画里，＿＿常常和松树画在一起，象征长寿。
`,
  },
  {
    theme: ["Flowers and Trees", "花木"],
    data: `
菊花 | jú huā | chrysanthemum flower | 秋天开的一种花，有黄、白等颜色 | 重阳节前后，公园里开满了＿＿。
梅花 | méi huā | plum blossom | 冬末春初开的花 | ＿＿在寒冷的冬天开放，不怕风雪。
荷花 | hé huā | lotus flower | 夏天在水里开的大花 | 夏天，湖面上开满了粉红色的＿＿。
荷叶 | hé yè | lotus leaf | 荷的叶子 | 下雨了，小青蛙坐在大＿＿上面。
枫叶 | fēng yè | maple leaf | 枫树的叶子 | 秋天，山上的＿＿都红了。
杨柳 | yáng liǔ | willows | 柳树 | 春天来了，河边的＿＿长出了新芽。 | 杨树
杨树 | yáng shù | poplar | 一种长得高而直的树 | 路两边种着高高的＿＿，夏天可以遮阳。
梅雨 | méi yǔ | plum rains | 初夏江南连续下的雨 | 六月，江南进入了＿＿季节，几乎天天下雨。
岁寒三友 | suì hán sān yǒu | the three friends of winter | 松、竹、梅三种植物 | 松、竹、梅被称为“＿＿”，因为它们都不怕寒冷。
梅兰竹菊 | méi lán zhú jú | the four gentlemen of plants | 画家常画的四种植物 | 中国画里常画的＿＿，被称为“四君子”。
`,
  },
  {
    theme: ["Butterflies, Cicadas and Glowing Clouds", "蝴蝶、蝉和彩霞"],
    data: `
蝴蝶 | hú dié | butterfly | 翅膀美丽、常在花间飞的昆虫 | 花园里，几只＿＿在花间飞来飞去。
化蝶 | huà dié | to turn into butterflies | 变成蝴蝶，多指梁祝故事的结尾 | 在梁祝的故事里，两个年轻人死后＿＿，在花间一起飞舞。
蝶泳 | dié yǒng | butterfly stroke | 一种游泳的姿势 | 他最擅长的游泳项目是＿＿。
蝉联 | chán lián | to retain a title | 连续保持 | 她在这项比赛中＿＿了三届冠军。
知了 | zhī liǎo | cicada (in everyday speech) | 蝉的俗称 | 夏天的树上，＿＿不停地叫。
晚霞 | wǎn xiá | sunset glow | 傍晚天空的彩云 | 太阳下山了，西边的天空布满了红色的＿＿。 | 彩霞
朝霞 | zhāo xiá | morning glow | 早上天空的彩云 | 早上，东方的天空出现了美丽的＿＿。 | 彩霞
彩霞 | cǎi xiá | rosy clouds | 彩色的云 | 雨过天晴，天边出现了一片片＿＿。
霞光 | xiá guāng | glow of clouds | 彩云发出的光 | 山顶上，＿＿照在云海上，美得像一幅画。
梁祝 | liáng zhù | the Butterfly Lovers | 一个古代爱情故事，主人公姓梁和祝 | ＿＿是中国古代四大民间传说之一。
`,
  },
  {
    theme: ["Scenes and Feelings", "情景和寄托"],
    data: `
托物言志 | tuō wù yán zhì | to express ideals through objects | 借描写事物表达自己的志向 | 这首诗写的是竹子，其实是＿＿，表达诗人坚强的品格。
借景抒情 | jiè jǐng shū qíng | to express feelings through scenery | 通过描写景物来表达感情 | 这首诗写秋天的落叶，是＿＿，表达了诗人的思乡之情。
情景交融 | qíng jǐng jiāo róng | feelings and scenery blended | 感情和景物结合得很好 | 这首诗写景写得好，写情也写得好，做到了＿＿。
诗情画意 | shī qíng huà yì | poetic charm | 像诗和画一样美的意境 | 雨后的西湖充满了＿＿。
田园诗 | tián yuán shī | pastoral poetry | 描写农村生活的诗 | 陶渊明写了很多描写农村生活的诗，是有名的＿＿人。
山水诗 | shān shuǐ shī | landscape poetry | 描写山水风景的诗 | 王维的＿＿写得像画一样美。 | 田园诗
怀古 | huái gǔ | to reflect on the past | 怀念古代的人和事 | 诗人来到古城的旧址，写下了这首＿＿诗。 | 咏史
咏史 | yǒng shǐ | on historical themes | 吟咏历史人物和事件 | 这首＿＿诗借历史人物表达了作者对当时社会的看法。
寄托 | jì tuō | to place (one's feelings) in | 把感情、理想放在某物上 | 诗人把思乡之情＿＿在明月上。
感怀 | gǎn huái | stirred memories | 有所感触而怀念 | 重游母校，他心中有很多＿＿，写下了一首小诗。
`,
  },
  {
    theme: ["Poets and Their Lines", "诗人和诗句"],
    data: `
诗仙 | shī xiān | the Immortal Poet | 后人对李白的称呼 | 李白被后人称为“＿＿”。
诗圣 | shī shèng | the Sage of Poetry | 后人对杜甫的称呼 | 杜甫被后人称为“＿＿”。
婉约派 | wǎn yuē pài | the graceful school | 宋词中风格柔美的一派 | 李清照是＿＿的代表，她的词写得很柔美。
豪放派 | háo fàng pài | the bold school | 宋词中风格豪迈的一派 | 辛弃疾是＿＿的代表词人，他的词充满了爱国热情。
千古绝唱 | qiān gǔ jué chàng | an unsurpassed masterpiece | 流传千年、没有人能超过的好作品 | 这首词被称为＿＿，到今天还有很多人会背。
佳句 | jiā jù | fine line | 好的句子 | 这首诗里有很多＿＿，值得背下来。
吟诗 | yín shī | to recite poetry | 读诗或作诗 | 古代文人常常在月下喝茶＿＿。 | 赋诗
赋诗 | fù shī | to compose a poem | 作诗 | 登上高楼，诗人当场＿＿一首。
诗社 | shī shè | poetry club | 爱好写诗的人组成的团体 | 我们学校有一个＿＿，每周都有人读自己写的诗。
唱和 | chàng hè | to reply in verse | 一个人作诗，别人照着韵作诗相答 | 两位诗人常常互相＿＿，留下了很多作品。
`,
  },
  {
    theme: ["Parting and Longing", "离愁和思念"],
    data: `
离愁 | lí chóu | sorrow of parting | 离别的愁苦 | 送别朋友以后，他心里充满了＿＿。 | 愁绪
愁绪 | chóu xù | gloomy mood | 忧愁的心情 | 窗外下着小雨，她的心中充满了＿＿。
乡愁 | xiāng chóu | homesickness | 思念家乡的忧愁 | 一碗家乡的面，让他心里涌起了浓浓的＿＿。
感伤 | gǎn shāng | sentimental | 有所感触而悲伤 | 看着几十年前的老照片，奶奶有些＿＿。
悲秋 | bēi qiū | to grieve at autumn | 看到秋天的景色而伤感 | 古代诗人常常＿＿，看到落叶就想到人生短暂。 | 伤春
伤春 | shāng chūn | to grieve at the passing of spring | 因为春天过去而伤感 | 落花满地，这首词写的是＿＿的心情。
秋思 | qiū sī | autumn thoughts | 秋天引起的愁思 | 这首诗写的是秋天引起的愁思，题目就叫“＿＿”。
折柳 | zhé liǔ | to break off a willow twig | 古人送别时折下柳枝送给对方 | 古人送别朋友时常常＿＿相送，表示留恋。
长亭 | cháng tíng | roadside pavilion | 古代路边供行人休息的亭子 | 古人常在城外的＿＿送别朋友。
断肠 | duàn cháng | heartbroken | 形容非常悲伤 | 古诗里常用“＿＿”形容伤心到了极点。
`,
  },
  {
    theme: ["Roles of Chinese Opera", "戏曲的行当"],
    data: `
旦角 | dàn jué | female role | 戏曲中扮演女性的角色 | 这位男演员是有名的京剧＿＿演员，在台上扮演女子。 | 青衣 花旦
花旦 | huā dàn | lively young woman role | 扮演活泼年轻女子的旦角 | 她在戏里演一个天真可爱的小姑娘，唱的是＿＿。
青衣 | qīng yī | virtuous woman role | 扮演端庄女子的旦角 | ＿＿多扮演端庄的青年或中年女子，常穿黑色的衣服。
老旦 | lǎo dàn | old woman role | 扮演老年妇女的角色 | 戏里的老奶奶由一位＿＿演员扮演。
刀马旦 | dāo mǎ dàn | martial woman role | 扮演会武艺的女子的角色 | 戏里那位骑马打仗的女将军，是由＿＿演员扮演的。
小生 | xiǎo shēng | young man role | 扮演青年男子的角色 | 戏里那位年轻的书生，由一位＿＿演员扮演。
老生 | lǎo shēng | older man role | 扮演中老年男子、多戴胡子的角色 | 戏里那位戴着长胡子的老大臣，是＿＿演的。
武生 | wǔ shēng | martial man role | 扮演会武艺的男子的角色 | 这位＿＿演员在台上连翻了十几个跟头。
丑角 | chǒu jué | clown role | 戏曲中扮演滑稽人物的角色 | 戏里的＿＿鼻子上画着一块白，一出场观众就笑了。
生旦净丑 | shēng dàn jìng chǒu | the four role types | 京剧角色的四个大类 | 京剧的角色分为＿＿四大类。
`,
  },
  {
    theme: ["Regional Operas", "地方戏"],
    data: `
粤剧 | yuè jù | Cantonese opera | 用广东方言演唱的地方戏 | ＿＿流行于广东、广西和香港一带。
粤语 | yuè yǔ | Cantonese | 广东一带的方言 | 香港的大多数人说＿＿。
黄梅戏 | huáng méi xì | Huangmei opera | 安徽的地方戏 | ＿＿唱腔优美，代表作有“天仙配”。
豫剧 | yù jù | Henan opera | 河南的地方戏 | ＿＿是河南最有名的地方戏，唱起来响亮有力。
川剧 | chuān jù | Sichuan opera | 四川的地方戏 | ＿＿的变脸表演非常有名，演员一转头就换了一张脸。
秦腔 | qín qiāng | Qinqiang opera | 陕西等西北地区的地方戏 | ＿＿流行于西北地区，演员唱起来声音很大。
评剧 | píng jù | Pingju opera | 北方的一种地方戏 | ＿＿流行于华北和东北地区。
杂剧 | zá jù | zaju drama | 元代流行的一种戏曲 | 元代的＿＿一般是四折，有的还加一个楔子。
南戏 | nán xì | southern drama | 宋元时期南方的戏曲 | ＿＿最早出现在宋代的温州一带。
梨园 | lí yuán | the opera world | 戏班，戏曲界 | 他出生在＿＿世家，从小就跟着父亲学唱戏。
`,
  },
  {
    theme: ["On the Stage", "台上的功夫"],
    data: `
念白 | niàn bái | spoken parts | 戏曲中说的部分 | 京剧演员不但要唱得好，＿＿也要说得好。
唱词 | chàng cí | sung words | 戏曲中唱的词 | 这段＿＿写得很美，像一首诗。 | 念白
身段 | shēn duàn | stage movements | 演员在台上像舞蹈一样的动作 | 这位演员的＿＿非常优美，一举一动都像舞蹈。
水袖 | shuǐ xiù | water sleeves | 戏服袖口上长长的白绸 | 演员挥动长长的＿＿，表现人物的心情。
压轴 | yā zhòu | the highlight before the finale | 一场演出中倒数第二个、往往最精彩的节目 | 今晚的＿＿戏是一段京剧名段，大家都在等着。
返场 | fǎn chǎng | to give an encore | 演员演完后，应观众要求再演 | 观众的掌声不断，演员只好＿＿又唱了一段。
票友 | piào yǒu | amateur opera singer | 业余爱好唱戏的人 | 爷爷是个京剧＿＿，每个周末都去公园唱戏。
戏台 | xì tái | opera stage | 唱戏用的台子 | 村口有一座古老的＿＿，过年时会请人来唱戏。
叫好 | jiào hǎo | to cheer | 大声说好 | 演员唱完一段，台下的观众连声＿＿。
戏班 | xì bān | troupe | 唱戏的团体 | 过去，＿＿常常从一个村子到另一个村子演出。
`,
  },
  {
    theme: ["Laughter and Fans", "欢笑和捧场"],
    data: `
滑稽 | huá jī | funny, comic | 言语、动作引人发笑 | 小丑的样子很＿＿，逗得孩子们哈哈大笑。
逗乐 | dòu lè | to amuse | 引人发笑 | 他很会＿＿，有他在的地方总是充满笑声。
笑料 | xiào liào | comic material | 引人发笑的内容 | 这部喜剧里的＿＿太多了，观众笑个不停。
捧腹大笑 | pěng fù dà xiào | to split one's sides | 笑得用手按着肚子 | 他的表演太有意思了，观众都＿＿。
捧场 | pěng chǎng | to show support | 特意去支持别人的演出或活动 | 谢谢大家来＿＿，我们下次演出再见！
包厢 | bāo xiāng | box (in a theatre) | 剧院里单独隔开的座位 | 剧院二楼有几个＿＿，每个里面可以坐五六个人。
捧红 | pěng hóng | to make famous | 通过宣传让人出名 | 这部电视剧＿＿了好几位年轻演员。
名角 | míng jué | star performer | 有名的戏曲演员 | 今晚有好几位＿＿登台，票早就卖完了。
车厢 | chē xiāng | carriage | 火车等装人或货的部分 | 这列火车有十六节＿＿。
西厢记 | xī xiāng jì | The Romance of the Western Chamber | 元代王实甫写的一部杂剧 | ＿＿是元代王实甫写的爱情戏，讲的是张生和莺莺的故事。
`,
  },
];
