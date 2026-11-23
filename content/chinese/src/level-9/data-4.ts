// The fourth quarter of level 9 (docs/chinese-curriculum.md §8.3): units 10 to 12, crafts and folk customs, sport and
// competition, and formal writing, 90 characters in 9 batches and 450 words in 45 batches. The characters are new to
// levels 1 to 8 and to the earlier quarters, chosen first from the common characters still untaught, then from the
// rarest third of GF 0025-2021's advanced band, for what each unit's words need; the words and sentences use only the
// characters of levels 1 to 8 and those taught so far.
//
// A character line as in level 6 (../level-6/character-data-a.ts); a word line as in level 6 (../level-6/word-data-a.ts).

import type { LevelWordBatch } from "../level-2/level.ts";

/** characterBatches4 are the 9 character batches of units 10 to 12 of level 9, in teaching order. */
export const characterBatches4: readonly string[] = [
  // Unit 10: Crafts and Folk Customs.
  `
蜡 là | wax | 蜂或植物产生的油质，遇热变软，可以做照明用品 | 腊错
烛 zhú | candle | 用蜡做成的照明用品 | 浊独
扎 zhā/zā/~zhá | to prick; to tie up | 刺；捆，缠 | 礼札
浸 jìn | to soak | 泡在水或别的液体里 | 侵寝
裹 guǒ | to wrap | 用纸、布、叶子等缠绕包住 | 果衰
葫 hú | gourd (in 葫芦) | 一种植物，果实中间细、两头大 | 胡湖 | 芦
芦 lú | reed | 水边长的一种草，茎是空的 | 庐炉 | 葫
藤 téng | vine, rattan | 植物细长的茎，能爬高或缠在别的东西上 | 腾滕
伞 sǎn | umbrella | 挡雨或遮太阳的用具，能张开和收起 | 全企
绵 mián | silk floss; soft; continuous | 丝做成的像棉花的东西；软；连续不断 | 棉锦
`,
  `
盒 hé | box | 有盖的装东西的小器物 | 盆盘
浆 jiāng | thick liquid; paste, starch | 比较浓的液体；使布变硬的米汤等 | 桨奖
枕 zhěn | pillow; to rest the head on | 睡觉时垫在头下的东西；把头放在上面 | 沈忱
巾 jīn | towel, piece of cloth | 擦东西或包头、围脖子用的小块布 | 币市
串 chuàn | to string together; a string of | 把东西一个一个连起来；连在一起的一组 | 中患
瓢 piáo | gourd ladle | 把葫芦切成两半做成的取水用具 | 飘票
棕 zōng | palm (tree); brown | 一种树，叶子像扇子；像这种树皮的颜色 | 粽综
抹 mǒ/mā/mò | to smear; to wipe; to plaster | 涂；擦；把泥灰涂平 | 末沫
夹 jiā/~jiá | to press from both sides; clip, folder | 从两边用力使东西不动；把东西固定住的用具 | 来央
轿 jiào | sedan chair | 旧时由人抬着走的交通工具 | 侨娇
`,
  `
掀 xiān | to lift (a cover) | 揭起，向上打开 | 欣锨
蒲 pú | cattail | 水边长的草，叶子可以编席子、扇子 | 浦捕
酿 niàng | to brew, to ferment | 利用发酵制造（酱油、醋、蜂蜜等） | 酸娘
凳 dèng | stool, bench | 没有靠背的坐具 | 登蹬
桐 tóng | tung tree, paulownia | 一种树，有的种子可以榨油 | 铜同
汁 zhī | juice | 含有某种东西的液体 | 什计
碎 suì | broken into pieces; to break | 完整的东西破成小块；零星的 | 醉粹
泼 pō | to splash; lively | 用力把水洒出去；生动，有活力 | 拨波
牡 mǔ | male (of animals); peony (in 牡丹) | 雄性的（鸟兽）；一种开大花的植物的名字的第一个字 | 牲壮
朵 duǒ | measure word for flowers and clouds | 量词，用于花和云等 | 朱杂
`,
  // Unit 11: Sport and Competition.
  `
搏 bó | to fight, to strive; to beat (of the pulse) | 对打；拼命争取；跳动 | 博傅
驰 chí | to gallop, to speed | 车马很快地跑 | 池弛
拇 mǔ | thumb, big toe | 手和脚的第一个指头 | 母姆
胳 gē | arm (in 胳膊) | 手臂，肩膀以下手腕以上的部分 | 格络 | 膊
膊 bó/~bo | upper arm | 上肢靠近肩膀的部分 | 博搏 | 胳
脖 bó | neck | 头和身子连在一起的部分 | 勃悖
躯 qū | body | 身体 | 驱枢
棍 gùn | stick, rod | 用木头或竹子做成的长条 | 混昆
陡 dǒu | steep; suddenly | 坡度很大，几乎是直的；突然 | 徒陆
枚 méi | measure word for small objects such as coins or medals | 量词，用于硬币、奖牌等小东西 | 玫牧
`,
  `
趟 tàng | measure word for trips | 量词，用于来去的次数 | 躺淌
淋 lín | to drench, to pour on | 水从上面浇下来 | 林琳
浴 yù | to bathe | 洗澡 | 俗谷
凯 kǎi | triumphant | 胜利，得胜回来 | 岂剀
掷 zhì | to throw | 扔，投 | 郑挪
竖 shù | vertical; to set upright | 直立的；使直立 | 坚紧
岭 lǐng | mountain ridge | 高大的山脉；山的高处 | 铃领
跤 jiāo | a fall | 跌倒，跟头 | 校绞
乒 pīng | ping (in 乒乓, table tennis); a bang | 东西撞击的声音；小球运动名称的第一个字 | 乓兵 | 乓
乓 pāng | pong (in 乒乓); a bang | 撞击的声音，常和另一个字连用 | 乒兵 | 乒
`,
  `
橄 gǎn | olive tree (in 橄榄) | 一种常绿树的名字的第一个字 | 敢憨 | 榄
榄 lǎn | olive (in 橄榄) | 一种常绿树和它的果实，果实长圆形 | 览揽 | 橄
竿 gān | bamboo pole | 竹子的主干；长的竹棍 | 杆竽
靶 bǎ | target | 练习射击、射箭用的目标 | 把耙
脆 cuì | crisp; brittle; clear (of a sound) | 容易断、容易碎；（声音）清亮 | 跪桅
憋 biē | to hold back (breath); to feel stifled | 忍住，不让出来；闷 | 鳖弊
蹬 dēng | to pedal; to push off with the feet | 腿和脚向下用力 | 登凳
跪 guì | to kneel | 两腿弯曲，膝盖着地 | 诡脆
俯 fǔ | to bend down; face down | 向下低头；面朝下 | 府腑
绊 bàn | to trip | 走路时被别的东西挡住或缠住 | 伴拌
`,
  // Unit 12: Formal Writing.
  `
兹 zī | this; now (in formal writing) | 这，这个；现在 | 慈磁
乙 yǐ | the second of a series; party B | 排在第二的；合同里的另一方 | 己乞
丙 bǐng | the third of a series | 排在第三的 | 两内
丁 dīng | the fourth of a series; small cube; person | 排在第四的；小块；人口 | 了于
倍 bèi | times, -fold | 跟原来的数相等的数量 | 陪培
瞻 zhān | to look up at | 往上或往前看 | 赡檐
顷 qǐng | a moment; hectare (in 公顷) | 很短的时间；土地面积单位 | 项倾
贮 zhù | to store | 储存 | 宁伫
肃 sù | solemn, serious | 庄重，严格 | 萧啸
徐 xú | slowly; (a surname) | 慢慢地；姓 | 涂途
`,
  `
浙 zhè | Zhejiang (province) | 中国东部一个省的名字的第一个字 | 折逝
杭 háng | Hangzhou | 浙江省省会的名字的第一个字 | 抗航
陕 shǎn | Shaanxi | 中国西北一个省的名字的第一个字 | 峡狭
辽 liáo | distant, vast; Liaoning | 远；中国东北一个省的名字的第一个字 | 了边
湘 xiāng | Hunan (short name); the Xiang River | 湖南省的别称；湖南的一条大江 | 相箱
剩 shèng | to remain, to be left over | 多出来，留下来 | 乘剁
壹 yī | one (in formal numerals) | “一”的大写 | 壶壳
捌 bā | eight (in formal numerals) | “八”的大写 | 别拐
玖 jiǔ | nine (in formal numerals) | “九”的大写 | 玫久
柒 qī | seven (in formal numerals) | “七”的大写 | 染梁
`,
  `
忱 chén | sincere feelings | 真诚的心意 | 枕沈
冀 jì | to hope; Hebei (short name) | 希望；河北省的别称 | 翼异
瞩 zhǔ | to gaze at | 注视 | 嘱属
禀 bǐng | to report (to a superior); natural endowment | 向上级或长辈报告；天生的 | 凛禁
唁 yàn | to condole | 慰问死者的家属 | 谚言
赐 cì | to bestow | 上级或长辈给予 | 锡踢
逢 féng | to meet; every time (it comes) | 遇到；每到（某个时候） | 蓬缝
钥 yào | key (in 钥匙) | 开锁用的东西的第一个字 | 钓钩 | 匙
匙 chí/shi | spoon; key (in 钥匙) | 舀汤等用的小勺；开锁的东西的第二个字 | 是题 | 钥
傍 bàng | near; close to (in time) | 靠近；临近 | 旁膀
`,
];

/** wordBatches4 are the 45 word batches of units 10 to 12 of level 9, fifteen a unit, in teaching order. */
export const wordBatches4: readonly LevelWordBatch[] = [
  // Unit 10: Crafts and Folk Customs.
  {
    theme: ["Wax and Candles", "蜡和蜡烛"],
    data: `
蜡烛 | là zhú | candle | 用蜡做成的、点着可以照明的东西 | 停电了，妈妈点起一支＿＿，屋子里一下子亮了。
蜡笔 | là bǐ | crayon | 用蜡和颜料做成的画画用的笔 | 弟弟用彩色的＿＿画了一个太阳和一座小房子。
蜡像 | là xiàng | wax figure | 用蜡做成的人像 | 博物馆里的＿＿做得和真人一模一样，很多人站在旁边拍照。
石蜡 | shí là | paraffin wax | 从石油里提取出来的蜡 | 现在很多蜡烛是用＿＿做的，而不是用蜂蜡做的。
蜂蜡 | fēng là | beeswax | 蜜蜂身体里分泌出来的蜡 | 蜜蜂用＿＿造出一个个六边形的小格子，用来存放蜂蜜。
打蜡 | dǎ là | to wax (a floor or car) | 在东西的表面涂上一层蜡 | 给木地板＿＿以后，地板又亮又滑。
蜡黄 | là huáng | waxen, sallow | 像蜡一样的黄色，多用来说脸色不好 | 他病了好几天，脸色＿＿，一点精神也没有。
烛光 | zhú guāng | candlelight | 蜡烛发出的光 | 生日蛋糕上的＿＿照着每个人的笑脸。
烛台 | zhú tái | candlestick | 放蜡烛的架子 | 桌子上放着一个铜做的＿＿，上面插着三支蜡烛。
蜡染 | là rǎn | batik | 先用蜡在布上画花纹再染色的手艺 | ＿＿是贵州一些少数民族的传统手艺，染好以后把蜡去掉，布上就出现了白色的花纹。
`,
  },
  {
    theme: ["Cloth and Dyeing", "布和染色"],
    data: `
扎染 | zā rǎn | tie-dye | 先把布用线缠紧再染色的手艺 | 用＿＿的方法，把布的一些地方用线缠紧，染出来就有一圈一圈的白色花纹。
印染 | yìn rǎn | printing and dyeing | 在布上印花和染色 | 这家工厂的＿＿技术很先进，能在布上印出十几种颜色的花纹。 | 染色
染坊 | rǎn fáng | dye house | 旧时给布染色的作坊 | 过去镇上有一家＿＿，河边常常晒满了刚染好的蓝布。
染料 | rǎn liào | dye | 用来给东西着色的材料 | 古人用植物的根和叶子做＿＿，给布染上蓝色和红色。
染色 | rǎn sè | to dye | 给东西着上颜色 | 这些羊毛先洗干净，再＿＿，然后才能织成彩色的毛衣。
蓝印花布 | lán yìn huā bù | blue calico | 一种蓝底白花的传统印花布 | 江南水乡的老人喜欢用蓝底白花的＿＿做头巾和衣服。
浸泡 | jìn pào | to soak | 放在水或别的液体里泡着 | 染布之前，要先把布放在清水里＿＿一夜。
浸透 | jìn tòu | to soak through | 液体完全进到里面 | 大雨把他的衣服＿＿了，连里面的衬衫都是湿的。
布料 | bù liào | cloth, fabric | 做衣服等用的布 | 这种＿＿又软又透气，很适合做夏天的衣服。
碎布 | suì bù | scraps of cloth | 零零星星的小块布 | 奶奶把做衣服留下的＿＿拼在一起，缝成了一条漂亮的被子。
`,
  },
  {
    theme: ["Tying, Wrapping and Soaking", "扎、裹和浸"],
    data: `
包扎 | bāo zā | to bandage | 用布等把伤口包起来 | 他的手划破了，校医马上给他消毒、＿＿。
扎针 | zhā zhēn | to give acupuncture; to prick with a needle | 用针刺进身体 | 中医在他的腿上＿＿，过了几个星期，他的腿就不疼了。
扎根 | zhā gēn | to take root | 植物的根长进土里；比喻在某地长期住下来工作 | 这些小树已经在山坡上＿＿，长得越来越高了。
扎实 | zhā shi | solid, thorough | （学问、工作）实在，不浮 | 他的基础很＿＿，所以学新知识特别快。
扎营 | zhā yíng | to pitch camp | 搭起帐篷住下 | 天快黑了，登山队决定在山脚下＿＿，第二天一早再出发。
挣扎 | zhēng zhá | to struggle | 用力想摆脱 | 一只小鸟被网缠住了，正在拼命＿＿。
包裹 | bāo guǒ | parcel | 包好要寄出去的东西 | 快递员送来一个＿＿，里面是奶奶寄来的家乡特产。
裹足不前 | guǒ zú bù qián | to hesitate to go forward | 停下来不敢往前走 | 遇到一点困难就＿＿，是不会成功的。
沉浸 | chén jìn | to be immersed in | 完全进入某种气氛或想法之中 | 节日的晚上，大家都＿＿在快乐之中。
浸湿 | jìn shī | to wet, to soak | 被液体泡湿 | 他跑完步，额头上的头发都被汗水＿＿了。
`,
  },
  {
    theme: ["Gourds and Weaving", "葫芦和编织"],
    data: `
葫芦 | hú lu | gourd | 一种植物，果实中间细、两头大 | 老人把晒干的＿＿切成两半，做成了两个水瓢。
糖葫芦 | táng hú lu | candied fruit on a stick | 把果子串在竹棍上、外面裹上糖的小吃 | 冬天的北京街头，常常能看到卖＿＿的小摊。
葫芦丝 | hú lu sī | hulusi, gourd flute | 一种用葫芦做的吹奏乐器 | 她用＿＿吹了一首云南民歌，声音柔和好听。
芦花 | lú huā | reed catkins | 芦苇的花，白色，像毛一样 | 秋天，河边的＿＿开了，远远看去白茫茫的一片。
藤编 | téng biān | rattan weaving | 用藤条编东西的手艺 | ＿＿的篮子和椅子用的是植物的藤条，又轻又结实。
藤椅 | téng yǐ | rattan chair | 用藤条编成的椅子 | 夏天，爷爷喜欢坐在院子里的＿＿上乘凉。
藤条 | téng tiáo | rattan cane | 藤的长茎 | 工人把＿＿泡软以后，才能把它弯成各种形状。
竹编 | zhú biān | bamboo weaving | 用细竹条编东西的手艺 | 这个小镇的＿＿很有名，竹篮、竹席、竹灯笼都编得十分精巧。
草编 | cǎo biān | straw weaving | 以草为材料的编织手艺 | 农民用晒干的麦子茎做＿＿，编出了草帽和草鞋。
顺藤摸瓜 | shùn téng mō guā | to follow a clue to its source | 比喻沿着线索找到要找的人或东西 | 警察＿＿，很快就找到了丢失的自行车。
`,
  },
  {
    theme: ["Umbrellas and Silk Floss", "伞和绵"],
    data: `
雨伞 | yǔ sǎn | umbrella | 下雨时挡雨用的伞 | 天气预报说下午有雨，出门别忘了带＿＿。
油纸伞 | yóu zhǐ sǎn | oil-paper umbrella | 用竹子和涂了桐油的纸做成的伞 | 这把＿＿的伞面是纸做的，刷了桐油以后就不怕雨了。
降落伞 | jiàng luò sǎn | parachute | 让人或东西从高空慢慢落下来的伞 | 飞行员打开＿＿，安全地落到了地面上。
遮阳伞 | zhē yáng sǎn | sunshade, parasol | 挡太阳的伞 | 海边的沙滩上，撑着一把把彩色的＿＿。
打伞 | dǎ sǎn | to hold up an umbrella | 把伞撑开举着 | 雨下得不大，他没有＿＿，就这样走回了家。
丝绵 | sī mián | silk floss | 用蚕丝做成的、像棉花一样的东西 | 这条被子里装的是＿＿，又轻又暖和。
绵羊 | mián yáng | sheep | 一种毛又密又软的羊 | 草原上，一群＿＿在低头吃草，像一片白云。
连绵 | lián mián | continuous, unbroken | 一个接一个，不断 | 春天的南方常常阴雨＿＿，好几天都见不到太阳。
海绵 | hǎi mián | sponge | 一种有很多小孔、能吸水的东西 | ＿＿能吸很多水，用它擦桌子，桌子很快就干了。
绵软 | mián ruǎn | soft | 柔软 | 刚做好的棉花糖又白又＿＿，像一朵小云。
`,
  },
  {
    theme: ["Boxes and Thick Liquids", "盒和浆"],
    data: `
盒子 | hé zi | box | 有盖的装东西的器物 | 这个木头＿＿是爷爷做的，我用它装我的小玩具。
饭盒 | fàn hé | lunch box | 装饭菜的盒子 | 中午，他打开＿＿，里面有米饭和两个菜。
礼盒 | lǐ hé | gift box | 装礼物的漂亮盒子 | 中秋节前，商店里摆满了装着月饼的＿＿。
铅笔盒 | qiān bǐ hé | pencil case | 装铅笔、橡皮等文具的盒子 | 开学前，妈妈给我买了一个新＿＿，里面能放铅笔、橡皮和尺子。
首饰盒 | shǒu shì hé | jewellery box | 放首饰的盒子 | 妈妈把项链和耳环放进了＿＿里。
纸浆 | zhǐ jiāng | paper pulp | 造纸用的浆 | 造纸厂把木头打碎、煮烂，做成＿＿，再用它做成纸。
豆浆 | dòu jiāng | soy milk | 黄豆加水磨成的浆 | 早饭他喝了一杯热＿＿，吃了两根油条。
泥浆 | ní jiāng | mud, slurry | 泥和水混在一起的浆 | 大雨过后，工地上到处都是＿＿，鞋子一踩就陷进去了。
糖浆 | táng jiāng | syrup | 糖和水熬成的浓液体 | 他咳嗽了，医生给他开了一瓶止咳＿＿。
岩浆 | yán jiāng | magma, lava | 地下高温熔化的岩石 | 火山爆发的时候，红色的＿＿从山口流出来。
`,
  },
  {
    theme: ["Pillows and Towels", "枕和巾"],
    data: `
枕头 | zhěn tou | pillow | 睡觉时放在头下面的软东西 | 这个＿＿太高了，我睡得很不舒服。
枕巾 | zhěn jīn | pillow towel | 铺在枕头上的毛巾 | 奶奶在枕头上铺了一块绣着花的＿＿。
枕套 | zhěn tào | pillowcase | 套在枕头外面的布套 | 把＿＿拉开，就能把里面的枕芯拿出来晒一晒。
瓷枕 | cí zhěn | porcelain pillow | 用瓷做的枕头 | 古代有人夏天用＿＿睡觉，因为它摸起来很凉。
毛巾 | máo jīn | towel | 擦脸、擦身体用的织物 | 游泳以后，他用一条大＿＿把身上的水擦干。
围巾 | wéi jīn | scarf | 围在颈部保暖的织物 | 天冷了，妈妈用毛线给我织了一条红色的＿＿。
头巾 | tóu jīn | headscarf | 包在头上的布 | 草原上风大，牧民的妻子用＿＿把头包起来。
纸巾 | zhǐ jīn | tissue | 擦东西用的软纸 | 他感冒了，一直流鼻涕，用完了一大包＿＿。
餐巾 | cān jīn | napkin | 吃饭时用的布或纸，可以擦嘴，也可以防止弄脏衣服 | 在西餐厅吃饭，可以先把＿＿铺在腿上。
丝巾 | sī jīn | silk scarf | 用丝织成的围巾 | 这条＿＿是用真丝织的，又薄又滑。 | 围巾
`,
  },
  {
    theme: ["Strings, Ladles and Palm", "串、瓢和棕"],
    data: `
串门 | chuàn mén | to drop in on neighbours | 到别人家去走走、聊天 | 过年的时候，邻居们互相＿＿，拜年问好。
串珠 | chuàn zhū | strung beads | 用线串起来的珠子 | 小女孩用彩色的珠子做了一条＿＿手链。
羊肉串 | yáng ròu chuàn | lamb skewer | 把羊肉穿在签子上烤的食物 | 新疆的烤＿＿很有名，又香又嫩。
串联 | chuàn lián | to connect in series | 一个接一个地连起来 | 物理课上，我们把两个小灯泡＿＿起来，接在电池上。
一连串 | yī lián chuàn | a series of | 一个接一个的 | 他遇到了＿＿的麻烦，先是丢了钱包，然后又错过了火车。
水瓢 | shuǐ piáo | water ladle | 取水用的瓢 | 奶奶拿着＿＿，从水缸里取了一点水浇花。
瓢虫 | piáo chóng | ladybird | 一种背上有斑点的小甲虫 | 一只红色的＿＿停在叶子上，背上有七个黑点。
棕色 | zōng sè | brown | 像棕树皮一样的颜色 | 这只小熊的毛是＿＿的，摸起来软软的。
棕绳 | zōng shéng | palm-fibre rope | 用棕树的毛做的绳子 | 渔民用结实的＿＿把小船系在岸边。
棕编 | zōng biān | palm-leaf weaving | 用棕树的嫩叶编东西的手艺 | 用棕树嫩叶编成的小鸟、小虫，是四川有名的＿＿。
`,
  },
  {
    theme: ["Wiping and Clipping", "抹和夹"],
    data: `
抹布 | mā bù | rag, cloth for wiping | 擦桌子等用的布 | 吃完饭，他用＿＿把桌子擦干净了。
涂抹 | tú mǒ | to smear, to apply | 涂上去或擦上去 | 出门以前，她在脸上＿＿了一些防晒霜。
抹去 | mǒ qù | to wipe away | 擦掉 | 他悄悄地＿＿脸上的泪水，又笑了起来。
抹杀 | mǒ shā | to deny, to write off | 完全不承认 | 一次失败不能＿＿他多年的努力。
夹子 | jiā zi | clip | 夹住东西的用具 | 风很大，妈妈用＿＿把晒的衣服夹在绳子上。
文件夹 | wén jiàn jiā | folder | 放文件的用具 | 他把所有的合同都放进了一个蓝色的＿＿里。
夹心 | jiā xīn | filled (of food) | 中间有馅的 | 这种饼干是＿＿的，中间有一层巧克力。
发夹 | fà jiā | hairpin | 夹头发用的小夹子 | 她头上戴着一个蝴蝶形状的＿＿。 | 夹子
夹杂 | jiā zá | to be mixed with | 不同的东西混在一起 | 他说的普通话里＿＿着一些家乡话。
夹缝 | jiā fèng | crack, narrow gap | 两个东西中间的窄缝 | 几根小草从石头的＿＿里长了出来。
`,
  },
  {
    theme: ["Weddings and Birthdays", "婚礼和寿辰"],
    data: `
轿子 | jiào zi | sedan chair | 旧时由几个人抬着走的坐具 | 古时候，当官的人出门常常坐＿＿。
花轿 | huā jiào | bridal sedan chair | 旧时新娘出嫁时坐的、装饰得很漂亮的轿子 | 按照旧时的习俗，新娘要坐着＿＿到新郎家。
抬轿 | tái jiào | to carry a sedan chair | 用肩膀抬着轿子走 | 旧时，＿＿的人走得又稳又快，坐在轿子里的人一点也不觉得晃。
掀开 | xiān kāi | to lift open | 揭开 | 他＿＿锅盖，一股香味扑面而来。 | 掀起
掀起 | xiān qǐ | to set off (a wave of) | 使大规模地兴起 | 这部电影在全国＿＿了一股学书法的热潮。
婚俗 | hūn sú | wedding customs | 结婚的风俗 | 各地的＿＿不一样，结婚的日子、穿的衣服、请客的方式都有不同的讲究。
寿面 | shòu miàn | birthday noodles | 过生日时吃的面条 | 爷爷八十岁生日那天，全家人陪他吃了一碗长长的＿＿。
抓周 | zhuā zhōu | first-birthday grabbing custom | 小孩满一岁时，让他从一些东西里随便抓一样，猜他将来的兴趣 | 弟弟一岁生日＿＿的时候，在一堆东西里抓了一支毛笔。
做寿 | zuò shòu | to celebrate an elder's birthday | 给老人过生日 | 下个月奶奶七十岁，全家人准备给她＿＿。
寿桃 | shòu táo | birthday peach | 祝寿用的桃子或做成桃子形状的面点 | 给老人祝寿时，桌上常常摆着用面做的＿＿。
`,
  },
  {
    theme: ["Fans, Stools and Brewing", "蒲扇、板凳和酿造"],
    data: `
蒲扇 | pú shàn | palm-leaf fan | 用蒲草或蒲葵的叶子做的扇子 | 夏天的晚上，爷爷摇着＿＿，给我们讲故事。
蒲公英 | pú gōng yīng | dandelion | 一种开黄花的草，种子带着白毛，能随风飞 | 我轻轻一吹，＿＿的种子就飞走了。
蒲团 | pú tuán | round straw cushion | 用蒲草等编成的圆形坐垫 | 寺庙里的地上放着几个圆圆的＿＿。
凳子 | dèng zi | stool | 没有靠背的坐具 | 他踩着＿＿，把书放到了书架的最上面。
坐冷板凳 | zuò lěng bǎn dèng | to be kept on the bench | 比喻受到冷落，长期没有机会做事 | 他在球队里＿＿了一个赛季，一场比赛也没上。
桐油 | tóng yóu | tung oil | 用油桐的种子榨出来的油 | 木船涂上一层＿＿，就不容易被水泡坏了。
泡桐 | pāo tóng | paulownia | 一种长得很快、木材很轻的树 | 农村常常在房前屋后种＿＿，因为它长得快，木头又轻。
油桐 | yóu tóng | tung tree | 种子可以榨油的一种树 | 四月，山上的＿＿开满了白花，秋天结的果实里有能榨油的种子。
酿造 | niàng zào | to brew | 利用发酵制造（酱油、醋等） | 这个工厂用传统的方法＿＿酱油，要晒一年才能装瓶。
酿蜜 | niàng mì | to make honey | 蜜蜂把花蜜变成蜂蜜 | 春天，油菜花开了，蜜蜂忙着采花＿＿。
`,
  },
  {
    theme: ["Painting and Printing", "书画和印刷"],
    data: `
牡丹 | mǔ dān | peony | 一种花大、颜色鲜艳的名花 | 洛阳的＿＿很有名，每年四月都有很多人去看花。
丹顶鹤 | dān dǐng hè | red-crowned crane | 头顶红色的一种鹤 | ＿＿的头顶是红色的，人们常把它看作长寿的象征。
丹青 | dān qīng | painting | 红色和青色的颜料，指绘画 | 这位老画家一生爱好＿＿，画了很多山水和花鸟。
泼墨 | pō mò | splashed-ink painting | 一种把墨大片地洒在纸上的画法 | 他用＿＿的画法，几笔就画出了一片烟雨中的远山。
活泼 | huó po | lively | 生动自然，不呆板 | 画上的几只小猫画得很＿＿，好像要从纸上跳下来。
文房四宝 | wén fáng sì bǎo | the four treasures of the study | 毛笔、墨、纸和砚台 | 毛笔、墨和宣纸都属于＿＿。
雕版 | diāo bǎn | woodblock | 刻上文字或图画、用来印刷的木板 | 唐代的人已经会用＿＿印书，先把字刻在木板上，再印到纸上。
活字 | huó zì | movable type | 一个一个可以拼起来印刷的字 | 北宋的时候，中国人发明了＿＿印刷，一个字可以用很多次。
刻刀 | kè dāo | carving knife | 雕刻用的小刀 | 师傅拿起＿＿，在木板上一点一点地刻出了花纹。
剪影 | jiǎn yǐng | silhouette | 照着人或物的外形剪出来的图像 | 艺人照着我的侧脸，用黑纸剪出了一张＿＿。
`,
  },
  {
    theme: ["Festivals", "传统节日"],
    data: `
端午 | duān wǔ | Dragon Boat Festival | 农历五月初五的节日 | ＿＿节在农历五月初五，这一天人们要吃粽子。
重阳 | chóng yáng | Double Ninth Festival | 农历九月初九的节日 | 农历九月初九是＿＿节，人们有登高、看望老人的习俗。
清明 | qīng míng | Qingming Festival | 二十四节气之一，也是扫墓的节日 | ＿＿节前后，很多人回老家扫墓，纪念去世的亲人。
踏青 | tà qīng | to go for a spring outing | 春天到郊外散步游玩 | 春天到了，我们一家人去郊外＿＿，看到了满山的桃花。
汤圆 | tāng yuán | sweet rice dumplings | 用米粉做成的、圆形带馅的食品 | 元宵节晚上，全家人一起吃＿＿。
花灯 | huā dēng | festive lantern | 有彩色装饰的灯 | 元宵节晚上，街上挂满了各种各样的＿＿。
猜灯谜 | cāi dēng mí | to guess lantern riddles | 猜写在灯上的谜语 | 元宵节的晚上，公园里有＿＿的活动，猜对了还有小奖品。
赛龙舟 | sài lóng zhōu | dragon-boat race | 划龙舟比赛 | 每年端午节，这条江上都要＿＿，两岸站满了观众。
赏月 | shǎng yuè | to admire the moon | 观看月亮 | 中秋节晚上，一家人坐在院子里吃月饼、＿＿。
泼水节 | pō shuǐ jié | Water-Splashing Festival | 云南一些民族的新年节日，人们互相泼水祝福 | 每年四月中旬，西双版纳的人们过＿＿，互相泼水表示祝福。
`,
  },
  {
    theme: ["The New Year", "过年"],
    data: `
小年 | xiǎo nián | Little New Year | 农历腊月二十三或二十四 | 农历腊月二十三是北方的＿＿，从这一天起，人们就忙着准备过年了。
祭灶 | jì zào | to honour the kitchen god | 旧时小年祭拜灶王的习俗 | 旧时，人们在小年这一天＿＿，请灶王“上天说好话”。
年货 | nián huò | New Year goods | 过年时买的东西 | 春节前，超市里挤满了买＿＿的人。
办年货 | bàn nián huò | to do New Year shopping | 买过年用的东西 | 离春节还有一个星期，妈妈就开始忙着＿＿了。
贴春联 | tiē chūn lián | to put up spring couplets | 把春联贴在门上 | 除夕的上午，爸爸和我一起在大门两边＿＿。
团圆饭 | tuán yuán fàn | reunion dinner | 全家人团聚时吃的饭 | 中秋节晚上，在外地工作的哥哥也回来了，全家人吃了一顿＿＿。
门神 | mén shén | door gods | 贴在大门上、守护家门的神像 | 过年时，有些人家在大门上贴两张＿＿，希望全家平安。
福字 | fú zì | the character for good fortune | 写着“福”的红纸 | 春节时，很多人家把＿＿倒着贴，意思是“福到了”。
瑞雪 | ruì xuě | timely snow | 冬天下的及时的大雪 | 农民说“＿＿兆丰年”，冬天下大雪，第二年的庄稼往往长得好。
碎碎平安 | suì suì píng ān | broken pieces bring peace | 打破东西时说的吉利话，“碎”和“岁”同音 | 过年时不小心打破了一个碗，奶奶马上笑着说：“＿＿！”
`,
  },
  {
    theme: ["Folk Arts", "民间手艺"],
    data: `
泥人 | ní rén | clay figurine | 用泥捏成的人像 | 天津过去有一位姓张的艺人，他用泥捏的＿＿，一个个都像活的一样。
糖人 | táng rén | sugar figurine | 用糖吹成或捏成的人物、动物 | 老艺人把熬好的糖吹成各种小动物，孩子们最喜欢这种＿＿。
糖画 | táng huà | sugar painting | 用熬化的糖在石板上画出的图案 | 老人把熬化的糖倒在石板上，画出一条龙，这就是＿＿。
面塑 | miàn sù | dough figurines | 用面团捏成人物、动物的手艺 | ＿＿艺人用彩色的面团，几分钟就捏出了一个孙悟空。
唐三彩 | táng sān cǎi | Tang tri-coloured pottery | 唐代一种以黄、绿、白为主色的陶器 | ＿＿是唐代的陶器，多用黄、绿、白三种颜色。
紫砂壶 | zǐ shā hú | purple clay teapot | 用紫砂泥做的茶壶 | 江苏宜兴出产的＿＿很有名，用它泡茶，茶香不容易散。
抖空竹 | dǒu kōng zhú | to spin a diabolo | 用绳子让空竹转动并发出响声的游戏 | 公园里，几位老人正在＿＿，空竹转得飞快，还发出好听的声音。
景泰蓝 | jǐng tài lán | cloisonné | 一种在铜器上做花纹、再填上彩色釉料烧成的工艺品 | ＿＿是北京有名的工艺品，多用蓝色，所以名字里有一个“蓝”字。
苏绣 | sū xiù | Suzhou embroidery | 苏州一带的刺绣 | ＿＿是苏州一带的刺绣，针法细密，有的作品两面都能看。
云锦 | yún jǐn | Yunjin brocade | 南京出产的一种华丽的丝织品 | 南京的＿＿色彩华丽，古代很多是专门为皇宫织造的。
`,
  },
  // Unit 11: Sport and Competition.
  {
    theme: ["Striving and Winning", "拼搏和胜利"],
    data: `
拼搏 | pīn bó | to strive hard | 用最大的力量去争取 | 运动员们在赛场上顽强＿＿，为国家争得了荣誉。
搏斗 | bó dòu | to fight, to struggle | 激烈地对打；跟困难或危险用力斗争 | 渔民们在海上和大风大浪＿＿了一整夜，终于回到了港口。 | 搏击
搏击 | bó jī | combat sport | 用拳和脚对打的运动 | 他每周去学两次＿＿，身体越来越结实了。
脉搏 | mài bó | pulse | 心脏跳动时血管的跳动 | 跑完步以后，他的＿＿每分钟跳一百多次。
奔驰 | bēn chí | to gallop, to speed | 车马等很快地跑 | 一群马在草原上＿＿，扬起了一片尘土。
驰名 | chí míng | famous far and wide | 名声传得很远 | 景德镇的瓷器＿＿中外。
背道而驰 | bèi dào ér chí | to run counter to | 比喻方向和目标完全相反 | 他说要减肥，每天却吃很多甜食，这和他的目标＿＿。
凯旋 | kǎi xuán | to return in triumph | 打了胜仗或比赛得胜回来 | 拿了冠军的队员们＿＿归来，很多人到机场欢迎他们。
凯歌 | kǎi gē | song of triumph | 庆祝胜利的歌 | 我们的球队一路高奏＿＿，打进了决赛。
夺冠 | duó guàn | to win the championship | 夺得冠军 | 经过一年的努力，这支年轻的球队终于＿＿了。
`,
  },
  {
    theme: ["The Body", "身体"],
    data: `
胳膊 | gē bo | arm | 肩膀到手腕的部分 | 他举了一个小时的哑铃，＿＿都酸了。
脖子 | bó zi | neck | 头和身子中间连接的部分 | 长颈鹿的＿＿很长，能吃到高处的树叶。
大拇指 | dà mǔ zhǐ | thumb | 手上最短最粗的指头 | 看到他精彩的表演，大家都向他竖起了＿＿。
身躯 | shēn qū | body, frame | 人的身体 | 他拖着疲倦的＿＿，慢慢地走回了家。
躯干 | qū gàn | torso, trunk | 身体除了头和四肢以外的部分 | 人的身体可以分成头、＿＿和四肢三个部分。
手掌 | shǒu zhǎng | palm | 手腕以下、手指以上的部分 | 他把一颗小石子放在＿＿上，让大家看。
腹肌 | fù jī | abdominal muscles | 肚子上的肌肉 | 他每天做仰卧起坐，练出了结实的＿＿。
韧带 | rèn dài | ligament | 连接骨头的结实的组织 | 他踢球时拉伤了膝盖的＿＿，要休息一个月。
脚尖 | jiǎo jiān | tip of the toes | 脚的最前面的部分 | 跳芭蕾舞的时候，演员常常用＿＿站立。
脚跟 | jiǎo gēn | heel; footing | 脚的后部；比喻立足的地方 | 他刚到新公司，还没站稳＿＿，所以做事很小心。
`,
  },
  {
    theme: ["Moving the Body", "身体的动作"],
    data: `
憋气 | biē qì | to hold one's breath | 忍住不呼吸 | 他能在水下＿＿两分钟。
蹬腿 | dēng tuǐ | to kick out the legs | 腿用力向下或向后伸 | 学蛙泳的时候，要先收腿，再用力向后＿＿。 | 踢腿
俯身 | fǔ shēn | to bend over | 弯下身子 | 他＿＿把地上的球拿了起来，又扔给了队友。
跪下 | guì xià | to kneel down | 两腿弯曲，使膝盖着地 | 为了和小朋友说话，老师单膝＿＿，让自己和孩子一样高。
踢腿 | tī tuǐ | to kick (as an exercise) | 把腿用力向前或向上踢 | 武术课上，大家排成一排，一起向前＿＿，腿踢得又高又直。
压腿 | yā tuǐ | to stretch the legs | 把腿放在高处，身体向下压，使腿变得柔软 | 跳舞以前，她先把腿放在栏杆上＿＿。
翻跟头 | fān gēn tou | to do a somersault | 身体向前或向后翻转 | 杂技演员在台上连着＿＿，赢得了一片掌声。
倒立 | dào lì | handstand | 用手撑地，头朝下，脚朝上 | 他用双手撑地，做了一个漂亮的＿＿，两条腿伸得笔直。
绊倒 | bàn dǎo | to trip over | 被东西挡住或缠住而跌倒 | 他跑得太快，被路上的一块石头＿＿了。
竖起 | shù qǐ | to raise, to set upright | 使直立起来 | 听到奇怪的声音，小狗马上＿＿了耳朵。
`,
  },
  {
    theme: ["Sticks, Poles and Targets", "棍、竿和靶"],
    data: `
木棍 | mù gùn | wooden stick | 木头做的棍子 | 爷爷走山路的时候，手里总是拿着一根＿＿，帮助自己走路。 | 竹竿
竹竿 | zhú gān | bamboo pole | 用竹子的主干做成的长棍 | 奶奶在院子里架起一根长＿＿，把洗好的衣服挂在上面晒。 | 木棍
钓竿 | diào gān | fishing rod | 钓鱼用的竿 | 他拿着＿＿坐在湖边，一个上午钓了三条鱼。
撑竿跳高 | chēng gān tiào gāo | pole vault | 用一根长竿撑地、跳过横杆的运动 | ＿＿运动员拿着长竿快速助跑，然后跳过高高的横杆。
立竿见影 | lì gān jiàn yǐng | to get instant results | 比喻马上就见到效果 | 锻炼身体的效果不会＿＿，要坚持几个月才能看出来。
棍术 | gùn shù | staff fighting | 用棍的武术 | 他练了三年＿＿，一根长棍在他手里转得飞快。
靶子 | bǎ zi | target | 练习射击或射箭的目标 | 射箭场上的＿＿画着一圈一圈的彩色圆环。
靶心 | bǎ xīn | bull's-eye | 靶子的中心 | 他一箭射中了＿＿，得了十分。
打靶 | dǎ bǎ | to do target practice | 对着靶子射击 | 军训的时候，同学们第一次去＿＿，都很紧张。 | 射箭
射箭 | shè jiàn | archery | 用弓把箭射出去的运动 | ＿＿运动员拉开弓，瞄准七十米外的靶子。
`,
  },
  {
    theme: ["Ball Games", "球类运动"],
    data: `
橄榄球 | gǎn lǎn qiú | rugby, American football | 球员可以抱着椭圆形的球跑和传的运动 | ＿＿是椭圆形的，球员可以抱着球往前跑。
棒球 | bàng qiú | baseball | 用木棒击球、然后跑垒的运动 | ＿＿在美国和日本很受欢迎，击球手用木棒打投手投过来的球。
垒球 | lěi qiú | softball | 跟棒球相似、但球比较大的运动 | ＿＿和棒球很像，但是球比较大，场地也比较小。
手球 | shǒu qiú | handball | 用手传球、把球扔进球门的运动 | ＿＿运动员用手传球，最后把球扔进对方的球门。
冰球 | bīng qiú | ice hockey | 在冰上用球杆打一个小圆饼的运动 | ＿＿运动员穿着冰鞋，在冰上用球杆打一个小圆饼。
门球 | mén qiú | gateball | 用木槌把球打过小门的运动 | 公园的草地上，几位退休的老人在打＿＿。
高尔夫 | gāo ěr fū | golf | 用球杆把小球打进远处的洞里的运动 | ＿＿球场很大，草地一眼望不到头。
曲棍球 | qū gùn qiú | field hockey | 在草地上用弯头的棍子打球的运动 | ＿＿运动员用一头弯曲的棍子，把球打进对方的球门。
球衣 | qiú yī | team shirt, jersey | 球员比赛时穿的衣服 | 每个队员的＿＿背后都印着自己的号码。
俱乐部 | jù lè bù | club | 进行社会、文化、体育等活动的团体和场所 | 他参加了学校的足球＿＿，每周练三次球。
`,
  },
  {
    theme: ["Table Tennis and Badminton", "乒乓球和羽毛球"],
    data: `
乒乓球 | pīng pāng qiú | table tennis | 在球台上用球拍把小球打来打去的运动 | ＿＿在中国被称为“国球”，很多人都会打。
球台 | qiú tái | (table tennis) table | 打乒乓球用的台子 | 乒乓球的＿＿中间有一张网，把它分成两半。
发球 | fā qiú | to serve | 比赛时把球发出去 | 打乒乓球时，＿＿的人要先把球向上抛起来，再用球拍打。 | 接球
接球 | jiē qiú | to receive the ball | 把对方打过来的球接住或打回去 | 对方的球又快又低，他＿＿的时候没有打过网。
横拍 | héng pāi | shakehand grip | 像握手一样握住拍子的方法 | 用＿＿的运动员握拍的样子就像跟人握手。 | 直拍
直拍 | zhí pāi | penhold grip | 像拿笔一样握住拍子的方法 | 很多中国老一代运动员用＿＿，握拍的样子像拿笔。 | 横拍
握拍 | wò pāi | to grip the racket | 用手拿住球拍 | 教练说，＿＿不能太紧，手腕要放松。
杀球 | shā qiú | to smash | 羽毛球里从高处用力向下打球 | 她跳起来一个＿＿，羽毛球又快又重地落在了对方的场地上。 | 吊球
吊球 | diào qiú | drop shot | 羽毛球里把球轻轻打到对方网前 | 对方站在后场，她一个轻轻的＿＿，球刚过网就落了下去。
清脆 | qīng cuì | clear and crisp (of sound) | （声音）清亮好听 | 乒乓球打在球台上，发出＿＿的响声。
`,
  },
  {
    theme: ["Track and Field", "田径"],
    data: `
田径 | tián jìng | track and field | 跑、跳、投等运动的总称 | 运动会上的＿＿比赛有跑步、跳远、跳高，还有扔铅球。
跨栏 | kuà lán | hurdles | 跑步时跳过一个个栏架的项目 | 在一百一十米＿＿比赛中，运动员要跨过十个栏架。
接力赛 | jiē lì sài | relay race | 几个人轮流跑完全程的比赛 | 在四乘一百米＿＿中，每个队有四个人，每个人跑一百米。
马拉松 | mǎ lā sōng | marathon | 全程约四十二公里的长跑比赛 | ＿＿全程四十二点一九五公里，要跑好几个小时。
铅球 | qiān qiú | shot put | 用力把一个金属球推出去的项目 | 推＿＿的时候，要把球放在肩膀上，然后用力推出去。 | 标枪 铁饼
标枪 | biāo qiāng | javelin | 把一根细长的枪用力扔出去的项目 | ＿＿又细又长，运动员助跑以后用力把它扔出去。
铁饼 | tiě bǐng | discus | 把一个像盘子的东西转身扔出去的项目 | ＿＿的形状像一个扁扁的盘子，运动员转几圈以后才把它扔出去。
投掷 | tóu zhì | to throw | 扔 | 铅球、标枪和铁饼都是＿＿项目。
起跑线 | qǐ pǎo xiàn | starting line | 比赛开始时运动员站的线 | 比赛开始前，运动员都在＿＿后面做好了准备。 | 终点线
终点线 | zhōng diǎn xiàn | finish line | 比赛结束的地方画的线 | 他第一个冲过了＿＿，赢得了冠军。
`,
  },
  {
    theme: ["Gymnastics and Fitness", "体操和健身"],
    data: `
自由体操 | zì yóu tǐ cāo | floor exercise | 在大地毯上做翻腾、跳跃等动作的体操项目 | ＿＿是在一块大地毯上完成的，运动员要做翻腾、跳跃等动作。
吊环 | diào huán | rings | 双手抓住两个挂在空中的圆环做动作的项目 | ＿＿运动员双手抓住两个挂在空中的圆环，做出各种动作。
鞍马 | ān mǎ | pommel horse | 用双手撑在有两个把手的器械上转动身体的项目 | ＿＿的上面有两个把手，运动员用双手撑着，让身体和腿不停地转动。
跳马 | tiào mǎ | vault | 助跑以后用手撑一下器械，在空中翻转的项目 | ＿＿运动员快速助跑以后，用手撑一下器械，在空中翻转，再落到地上。
平衡木 | píng héng mù | balance beam | 在一根窄木头上做动作的项目 | ＿＿只有十厘米宽，运动员在上面跳跃、翻转，一点也不能出错。
俯卧撑 | fǔ wò chēng | push-up | 面朝下，用双手把身体撑起来再放下的运动 | 他每天早上做五十个＿＿，用双手把身体撑起来再放下。
仰卧起坐 | yǎng wò qǐ zuò | sit-up | 躺下再坐起来的运动 | 他躺在垫子上，一口气做了三十个＿＿。
哑铃 | yǎ líng | dumbbell | 一种两头大、中间细的举重器械 | 他每天举二十分钟＿＿，手臂上的肌肉越来越结实。
跑步机 | pǎo bù jī | treadmill | 在室内跑步用的机器 | 下雨天不能出去跑步，他就在家里的＿＿上跑。
广播体操 | guǎng bō tǐ cāo | radio calisthenics | 跟着广播里的音乐和口令做的体操 | 每天上午第二节课以后，全校同学都到操场上做＿＿。
`,
  },
  {
    theme: ["Swimming and Bathing", "游泳和洗浴"],
    data: `
自由泳 | zì yóu yǒng | freestyle | 对泳姿没有限制的游泳项目 | ＿＿比赛对泳姿没有限制，大多数运动员用的是爬泳，因为它最快。 | 蛙泳 仰泳
蛙泳 | wā yǒng | breaststroke | 动作像青蛙的泳姿 | ＿＿的动作像青蛙，两只手一起向外划，两条腿一起向后蹬。
仰泳 | yǎng yǒng | backstroke | 脸朝上的泳姿 | 在四种泳姿里，只有＿＿是脸朝上游的。
花样游泳 | huā yàng yóu yǒng | artistic swimming | 在水中随着音乐做各种优美动作的项目 | ＿＿运动员在水里随着音乐做出各种优美的动作，好像在水中跳舞。
泳池 | yǒng chí | swimming pool | 游泳的池子 | 这个＿＿长五十米，可以举行正式的比赛。
泳镜 | yǒng jìng | swimming goggles | 游泳时戴的眼镜 | 他戴上＿＿，在水下也能看得很清楚。
淋浴 | lín yù | shower | 用从上面喷下来的水洗澡 | 游泳之前要先＿＿，把身体冲洗干净。
浴巾 | yù jīn | bath towel | 洗澡后擦身体用的大毛巾 | 他洗完澡，用一条大＿＿把身上擦干。
浴室 | yù shì | bathroom | 洗澡的房间 | 宾馆的＿＿里有热水，还准备了毛巾和牙刷。
海水浴 | hǎi shuǐ yù | sea bathing | 在海里游泳、洗浴 | 夏天，很多人到海边去洗＿＿，在海里游泳、晒太阳。
`,
  },
  {
    theme: ["Ice and Snow", "冰雪运动"],
    data: `
冰壶 | bīng hú | curling | 在冰上推石头做的壶的运动 | ＿＿比赛中，运动员把石头做的壶推出去，队友在前面用刷子刷冰。
速滑 | sù huá | speed skating | 比速度的滑冰项目 | ＿＿运动员弯着腰，在冰上滑得飞快，比的是谁用的时间少。
花样滑冰 | huā yàng huá bīng | figure skating | 在冰上随着音乐跳跃、旋转的项目 | ＿＿运动员在冰上随着音乐跳跃、旋转，像跳舞一样。
冬奥会 | dōng ào huì | Winter Olympics | 冬季奥林匹克运动会 | 二零二二年，北京举办了第二十四届＿＿。
冰场 | bīng chǎng | ice rink | 滑冰的场地 | 冬天，公园里的湖结了厚厚的冰，变成了一个大＿＿。
冰刀 | bīng dāo | skate blade | 冰鞋下面的金属刀片 | 冰鞋下面的＿＿又薄又锋利，要小心别划伤手。
冰鞋 | bīng xié | ice skates | 滑冰穿的鞋 | 第一次去滑冰，他先租了一双＿＿。 | 冰刀
滑雪场 | huá xuě chǎng | ski resort | 滑雪的场地 | 这个＿＿有很多条雪道，初学的人可以在平缓的坡上练习。
跳台 | tiào tái | diving platform; ski jump | 跳水或滑雪时向下跳用的高台 | 跳水运动员站在十米高的＿＿上，准备往下跳。
单板 | dān bǎn | snowboard | 两只脚站在一块板上的滑雪用具 | 滑雪的时候，两只脚都站在一块板上的叫＿＿滑雪。
`,
  },
  {
    theme: ["Combat Sports", "格斗和武术"],
    data: `
摔跤 | shuāi jiāo | wrestling; to fall | 两个人抱在一起想办法把对方摔倒的运动；跌倒 | 雪天路滑，走路慢一点，小心别＿＿。
柔道 | róu dào | judo | 一种起源于日本、用摔法和压制取胜的格斗运动 | ＿＿起源于日本，运动员穿着白色或蓝色的衣服比赛。 | 空手道
空手道 | kōng shǒu dào | karate | 一种起源于日本、用拳和脚的格斗运动 | 他学了五年＿＿，已经系上了黑带。 | 柔道
散打 | sàn dǎ | sanda, Chinese kickboxing | 中国的一种用拳、脚和摔法对打的比赛 | ＿＿是从中国武术发展来的比赛，运动员可以用拳、用脚，还可以摔。
格斗 | gé dòu | fighting, combat | 激烈地对打 | 拳击、柔道和摔跤都是＿＿运动。
护具 | hù jù | protective gear | 运动时保护身体的用具 | 练散打的时候要戴好＿＿，保护头和膝盖。
黑带 | hēi dài | black belt | 柔道、空手道等的高级别 | 在柔道和空手道里，＿＿表示很高的水平。
扎马步 | zhā mǎ bù | to hold the horse stance | 两腿分开、像骑马一样蹲着的基本功 | 学武术要先＿＿，两腿分开蹲下，一站就是半个小时。
舞剑 | wǔ jiàn | to perform a sword dance | 拿着剑表演武术 | 清晨的公园里，一位老人在＿＿，剑在他手里像一条银色的龙。
套路 | tào lù | routine (in martial arts) | 武术中一套编排好的动作 | 这套太极拳的＿＿一共有二十四个动作。
`,
  },
  {
    theme: ["Rounds and Results", "赛程和结果"],
    data: `
复赛 | fù sài | second round | 预赛以后、决赛以前的比赛 | 他在预赛中成绩很好，顺利进入了＿＿。
淘汰赛 | táo tài sài | knockout stage | 输了就不能继续比的比赛 | 到了＿＿阶段，每场比赛输的一方就要回家了。
小组赛 | xiǎo zǔ sài | group stage | 把参赛队分成几个组、在组里比的比赛 | 在＿＿中，每个组的四支球队要互相比一场。
加时赛 | jiā shí sài | extra time | 规定时间内打平后加的比赛 | 两队九十分钟踢成一比一，比赛进入了＿＿。
种子选手 | zhǒng zi xuǎn shǒu | seeded player | 水平高、事先安排开的选手 | 他是这次比赛的头号＿＿，第一轮不会遇到很强的对手。
黑马 | hēi mǎ | dark horse | 比喻意外取得好成绩的人 | 这支没有名气的球队打进了决赛，成了这次比赛最大的＿＿。
爆冷 | bào lěng | to cause an upset | 出现意想不到的比赛结果 | 世界排名第一的选手第一轮就输了，比赛＿＿了。
打平 | dǎ píng | to draw | 比赛双方得分相同 | 两队踢了九十分钟，最后一比一＿＿。
反超 | fǎn chāo | to come from behind to lead | 由落后变成领先 | 上半场我们落后两分，下半场连进三个球，＿＿了比分。
绝杀 | jué shā | last-second winner | 比赛快结束时决定胜负的一击 | 比赛只有最后一秒了，他投进了一个三分球，完成了＿＿。
`,
  },
  {
    theme: ["The Games", "运动会"],
    data: `
运动会 | yùn dòng huì | sports meeting | 很多运动项目在一起比赛的大会 | 学校每年秋天开一次＿＿，有跑步、跳远和拔河比赛。
亚运会 | yà yùn huì | Asian Games | 亚洲运动会 | 二零一零年，第十六届＿＿在广州举行。
全运会 | quán yùn huì | National Games of China | 中国全国运动会 | ＿＿是中国国内水平最高的综合性运动会，各省都派队参加。
残奥会 | cán ào huì | Paralympic Games | 残疾人奥林匹克运动会 | ＿＿是残疾人运动员参加的奥运会，一般在奥运会以后举行。
代表团 | dài biǎo tuán | delegation | 代表一个国家或单位去参加活动的一群人 | 中国＿＿一共有四百多名运动员参加了这届奥运会。
开幕式 | kāi mù shì | opening ceremony | 大会开始时举行的仪式 | 奥运会的＿＿上，各国运动员排着队走进体育场。 | 闭幕式
闭幕式 | bì mù shì | closing ceremony | 大会结束时举行的仪式 | 在运动会的＿＿上，大家依依不舍地告别。
圣火 | shèng huǒ | sacred flame | 奥运会等大会上点燃的火 | 奥运会的＿＿要在希腊点燃，再传到举办的城市。
奖牌榜 | jiǎng pái bǎng | medal table | 按得到的奖牌多少排的名次表 | 比赛的最后一天，这个国家在＿＿上排到了第一名。
不胜枚举 | bù shèng méi jǔ | too many to list | 多得没办法一个一个地说出来 | 这位运动员一生得过的奖牌和奖杯＿＿。
`,
  },
  {
    theme: ["On the Field and the Court", "球场上"],
    data: `
前锋 | qián fēng | forward | 球队里主要负责进攻的队员 | 他是球队的＿＿，这个赛季已经进了二十个球。 | 中锋 后卫
后卫 | hòu wèi | defender; guard | 球队里主要负责防守的队员 | 我们的＿＿防守很好，对方一个球也没进。
中锋 | zhōng fēng | centre | 篮球队里一般个子最高、在篮下的队员 | 他身高两米一，是篮球队的＿＿。 | 前锋
扣篮 | kòu lán | to dunk | 跳起来把球从上往下扣进篮筐 | 他高高跳起，双手把球扣进篮筐，一个漂亮的＿＿！
三分球 | sān fēn qiú | three-pointer | 篮球比赛中从远处投进得三分的球 | 他站在离篮筐很远的地方投出一球，得到了一个＿＿。
助攻 | zhù gōng | assist | 把球传给队友、帮助队友得分 | 这个球是他传的，所以算他一次＿＿。
越位 | yuè wèi | offside | 足球中进攻队员站的位置不合规则 | 他虽然把球踢进了，但是裁判说他＿＿了，这个球不算。
角球 | jiǎo qiú | corner kick | 足球中从球场一角发出的球 | 球被防守队员碰出了底线，裁判判给对方一个＿＿。
头球 | tóu qiú | header | 用头顶的球 | 他高高跳起，一个＿＿把球顶进了球门。
任意球 | rèn yì qiú | free kick | 足球中对方犯规后罚的球 | 对方犯规了，我们得到一个＿＿，他一脚就把球踢进了球门。
`,
  },
  {
    theme: ["The Outdoors", "户外运动"],
    data: `
攀岩 | pān yán | rock climbing | 用手和脚爬上陡的岩石 | 他戴好安全绳，开始在一面陡直的墙上＿＿。
蹦极 | bèng jí | bungee jumping | 绑着有弹性的绳子从高处跳下去 | 他从五十米高的桥上跳下去，第一次玩了＿＿。
越野 | yuè yě | cross-country | 在野外、不走平路的运动 | ＿＿跑的路线要经过树林、小河和山坡。
翻山越岭 | fān shān yuè lǐng | to cross mountains | 越过一座座山 | 登山队＿＿，走了三天，终于到达了山顶。
陡坡 | dǒu pō | steep slope | 很陡的山坡 | 这条路有一段＿＿，骑自行车上不去，只能推着走。
分水岭 | fēn shuǐ lǐng | watershed | 把两个水系分开的山；比喻重要的转折点 | 那次受伤是他运动生涯的＿＿，从那以后，他改当了教练。
跳伞 | tiào sǎn | to parachute | 背着降落伞从飞机上跳下 | 他从三千米高的飞机上＿＿，在空中飞了好一会儿才打开伞。
滑翔伞 | huá xiáng sǎn | paraglider | 人可以挂在下面、从山上飞下来的伞 | 他背着＿＿从山顶跑下去，借着风慢慢飞上了天空。
淋湿 | lín shī | to get soaked | 被雨水等浇湿 | 突然下起了大雨，我们没带伞，全身都被＿＿了。
白跑一趟 | bái pǎo yī tàng | to make a wasted trip | 去了一次，没有达到目的 | 我到了体育馆才知道比赛改了时间，＿＿。
`,
  },
  // Unit 12: Formal Writing.
  {
    theme: ["Notices", "通知和公告"],
    data: `
公告 | gōng gào | public announcement | 政府、机关或公司向大家公开发布的重要事情 | 公司在网站上发布＿＿，宣布新产品下个月上市。 | 通告
通告 | tōng gào | public notice | 普遍通知大家的文告 | 因为修路，交通部门发出＿＿：这条路下周起禁止车辆通行。 | 公告
启事 | qǐ shì | notice (to ask for or announce something) | 为了说明某件事而登在报上或贴在墙上的短文 | 他丢了钱包，就在学校门口贴了一张寻物＿＿。
失物招领 | shī wù zhāo lǐng | lost and found | 公开请丢东西的人来领回自己的东西 | 他在操场上拾到一块手表，交到了学校的＿＿处。
兹定于 | zī dìng yú | it is hereby decided that (on) | 现在决定在（某个时间） | 通知：＿＿本月十五日下午两点召开全体教师会议。
特此通知 | tè cǐ tōng zhī | this is hereby announced | 通知最后的结束语 | 一份通知写完了正文，最后一般写上“＿＿”四个字。
届时 | jiè shí | when the time comes | 到时候 | 明天上午九点举行开学典礼，＿＿请全体同学准时到操场集合。
务必 | wù bì | must | 一定要 | 这份材料很重要，请你＿＿在星期五以前交上来。
敬请 | jìng qǐng | to respectfully request | 恭敬地请 | 本周六晚上学校举行新年晚会，＿＿各位家长光临。
告知 | gào zhī | to inform | 告诉，使知道 | 如果您的地址有变化，请及时＿＿我们。
`,
  },
  {
    theme: ["The Parts of a Letter", "书信的格式"],
    data: `
称呼 | chēng hu | form of address | 写信时开头对收信人的叫法 | 写信的时候，第一行顶格写＿＿，比如“亲爱的王老师”。
正文 | zhèng wén | body (of a text) | 文章或书信的主要部分 | 信的＿＿写在称呼的下一行，开头要空两格。
此致 | cǐ zhì | (closing formula) | 书信结尾的客气话，后面常接“敬礼” | 信的最后，先写“＿＿”，再在下一行顶格写“敬礼”。
敬上 | jìng shàng | respectfully yours | 写在信末自己名字后面的客气话 | 给老师写信，他在最后自己的名字后面写上了“＿＿”两个字。
附言 | fù yán | postscript | 信写完以后另外加上的话 | 写完信以后，他又在下面加了一段＿＿，提醒朋友记得回信。
收件人 | shōu jiàn rén | recipient | 收信或收包裹的人 | 快递员把包裹送到了，请＿＿签字。 | 发件人
发件人 | fā jiàn rén | sender | 寄信或发包裹的人 | 这封信没写＿＿的名字，不知道是谁寄来的。
敬启者 | jìng qǐ zhě | (opening formula of an old-style letter) | 旧式书信开头的客气话 | 旧式的书信常常用“＿＿”开头，意思是写信的人恭敬地向对方陈述。
邮政编码 | yóu zhèng biān mǎ | postcode | 邮局为了分送信件给每个地区编的号码 | 在中国寄信，信封左上角的六个小格子里要填写＿＿。
顺颂 | shùn sòng | (closing formula) and I wish you | 信末祝福语开头的客气话 | 给长辈写信时，结尾可以写“＿＿安康”。
`,
  },
  {
    theme: ["Courteous Phrases", "客气话"],
    data: `
赐教 | cì jiào | to favour with instruction | 请别人指教的客气话 | 久闻先生大名，今天有机会见面，还请先生不吝＿＿。 | 指正
恭候 | gōng hòu | to await respectfully | 恭敬地等候 | 晚会七点开始，我们在门口＿＿各位的到来。
光临 | guāng lín | to honour with one's presence | 客气话，称客人来到 | 欢迎＿＿本店，请问您需要点什么？
惠存 | huì cún | please keep (written on a gift) | 送照片、书等给别人时写的客气话，请对方保存 | 他在送给老师的书上写着：“王老师＿＿”。
敬赠 | jìng zèng | respectfully presented | 恭敬地赠送 | 书的第一页上写着：“全体学生＿＿”。
为盼 | wéi pàn | (closing) I look forward to it | 书信中表示盼望的结束语 | 请在本周五以前回复＿＿。
热忱 | rè chén | zeal, warmth | 热情 | 志愿者们以极大的＿＿为大家服务。
谢忱 | xiè chén | gratitude | 感谢的心意 | 谨向所有帮助过我们的朋友致以＿＿。
久仰 | jiǔ yǎng | I have long looked forward to meeting you | 初次见面时说的客气话，意思是很早就敬重对方 | “＿＿大名，今天终于见到您了！”
指正 | zhǐ zhèng | to point out mistakes | 指出错误，使改正 | 这份报告如果有不对的地方，请大家批评＿＿。 | 赐教
`,
  },
  {
    theme: ["Kinds of Letters", "各种书信"],
    data: `
感谢信 | gǎn xiè xìn | letter of thanks | 表示感谢的信 | 他在医院住了半个月，出院时给医生和护士写了一封＿＿。 | 表扬信
表扬信 | biǎo yáng xìn | letter of commendation | 向某人的单位说明他的好事、称赞他的信 | 司机把乘客丢的钱包还了回去，乘客给公司寄了一封＿＿，希望公司称赞他。 | 感谢信
慰问信 | wèi wèn xìn | letter of sympathy | 表示安慰和问候的信 | 地震发生后，很多学生给灾区的小朋友写了＿＿，鼓励他们坚强。
邀请函 | yāo qǐng hán | letter of invitation | 请别人来参加活动的信 | 学校给每位家长发了一份＿＿，请他们来参加毕业典礼。
贺信 | hè xìn | letter of congratulations | 表示祝贺的信 | 学校获得了全国比赛的冠军，教育局发来＿＿，表示祝贺。
特此证明 | tè cǐ zhèng míng | this is to certify | 证明信最后的结束语 | 学校给他开的证明上写着：“该生是我校三年级学生，＿＿。”
介绍信 | jiè shào xìn | letter of introduction | 介绍某人去别的单位联系事情的信 | 以前出差住宾馆要带单位开的＿＿，说明这个人是谁、去做什么。
自荐信 | zì jiàn xìn | letter of self-recommendation | 自己推荐自己的信 | 他给这家公司写了一封＿＿，介绍了自己的特长，希望能得到这份工作。
辞职信 | cí zhí xìn | letter of resignation | 说明自己不再做某份工作的信 | 他决定换一份工作，就给经理写了一封＿＿。
喜报 | xǐ bào | good news (posted or sent) | 报告好消息的文字 | 他考上了大学，学校把＿＿寄到了他家。
`,
  },
  {
    theme: ["Mourning and Respect", "哀悼和敬意"],
    data: `
唁电 | yàn diàn | telegram of condolence | 慰问死者家属的电报 | 这位科学家去世后，很多国家的科学家通过电报发来＿＿，表示哀悼。 | 唁函
唁函 | yàn hán | letter of condolence | 慰问死者家属的信 | 他给老师的家人写了一封＿＿，表达自己的哀思。 | 唁电
吊唁 | diào yàn | to offer condolences | 去死者家里祭奠并慰问家属 | 很多学生来到老教授的家里＿＿，安慰他的家人。
节哀 | jié āi | to restrain one's grief | 劝人不要太伤心的话 | 他对朋友说：“请你＿＿，保重身体。”
致哀 | zhì āi | to pay respects to the dead | 向死者表示哀悼 | 很多国家降半旗＿＿，悼念这位伟大的人物。 | 默哀
默哀 | mò āi | to stand in silent tribute | 低头不说话，表示哀悼 | 全场的人起立，低头＿＿一分钟。 | 致哀
瞻仰 | zhān yǎng | to look at with reverence | 恭敬地看 | 清明节，同学们到烈士陵园＿＿烈士纪念碑。
肃静 | sù jìng | solemn and silent | 严肃安静 | 阅览室里请保持＿＿，不要大声说话。
肃然起敬 | sù rán qǐ jìng | to be filled with deep respect | 很严肃地产生敬意 | 听了这位老医生在山村看病几十年的故事，大家都＿＿。
严肃 | yán sù | serious, solemn | 使人感到敬畏的；认真 | 老师的表情很＿＿，大家知道这件事很重要。
`,
  },
  {
    theme: ["Reports", "报告"],
    data: `
简报 | jiǎn bào | brief report, bulletin | 简要的情况报告 | 公司每个星期出一份＿＿，简单介绍这一周的主要工作。
述职报告 | shù zhí bào gào | report on one's work | 向上级或大家说明自己做了什么工作的报告 | 年底，每位经理都要写一份＿＿，说明自己一年来的工作。
调查报告 | diào chá bào gào | survey report | 把调查的结果写成的报告 | 我们在社区里问了两百个人，写成了一份关于垃圾分类的＿＿。
可行性报告 | kě xíng xìng bào gào | feasibility report | 分析一个计划能不能做成的报告 | 在建新工厂以前，公司请专家写了一份＿＿，分析这个计划能不能做成。
年度 | nián dù | annual, year | 为了工作的需要而规定的一年 | 这是我们公司的＿＿总结，回顾了一年来的工作。
季度 | jì dù | quarter (of a year) | 一年的四分之一，三个月 | 一年有四个＿＿，第一个是一月到三月。
上半年 | shàng bàn nián | first half of the year | 一年的前六个月 | 从一月到六月，也就是今年＿＿，这家工厂生产了五万辆汽车。
附表 | fù biǎo | appended table | 附在文件后面的表 | 具体的数字请看报告后面的＿＿。
现将 | xiàn jiāng | (formal) we now hereby | 现在把 | ＿＿本月的工作情况报告如下。
总计 | zǒng jì | total | 合起来算 | 这个月的收入＿＿是三万元。
`,
  },
  {
    theme: ["Numbers in Reports", "报告里的数字"],
    data: `
倍数 | bèi shù | multiple | 一个数能被另一个数整除，就是另一个数的这种数 | 十二是三的＿＿，因为十二除以三等于四。
加倍 | jiā bèi | to redouble | 增加到原来的两倍；比原来更 | 考试快到了，他＿＿努力地复习。
成倍 | chéng bèi | manyfold | 一倍一倍地 | 这几年，在网上买东西的人＿＿增加。
倍增 | bèi zēng | to double, to multiply | 成倍地增加 | 用了新机器以后，工厂的产量＿＿，从每天一百件变成了两百件。
事半功倍 | shì bàn gōng bèi | to get twice the result with half the effort | 用的力气小，收到的效果大 | 方法对了，学习就能＿＿。
同比 | tóng bǐ | year on year | 跟去年同一时期相比 | 今年五月的销售额比去年五月增长了百分之十，也就是＿＿增长百分之十。 | 环比
环比 | huán bǐ | compared with the previous period | 跟上一个时期相比 | 这个月的销售额比上个月增长了百分之五，也就是＿＿增长百分之五。
百分点 | bǎi fēn diǎn | percentage point | 百分比中相当于百分之一的单位 | 失业率从百分之五降到百分之四，下降了一个＿＿。
剩余 | shèng yú | surplus, remainder | 用完以后留下来的 | 这次活动的经费用了八千元，＿＿的两千元交还给了学校。
过剩 | guò shèng | excess | 数量超过了需要 | 今年苹果大丰收，市场上的苹果＿＿，价格下降了很多。
`,
  },
  {
    theme: ["Applications and Requests", "申请和请示"],
    data: `
申请书 | shēn qǐng shū | written application | 向组织或单位提出请求的文书 | 他想加入学校的志愿者协会，就写了一份＿＿。
倡议书 | chàng yì shū | written proposal (to the public) | 公开提出建议、号召大家一起做某事的文书 | 学生会发出＿＿，号召全校同学节约用水。
建议书 | jiàn yì shū | letter of suggestion | 向有关人员或单位提出意见的文书 | 我们给校长写了一份＿＿，希望学校多开一些体育课。
计划书 | jì huà shū | plan (document) | 写明要做什么、怎么做的文书 | 他们写了一份创业＿＿，说明了要做什么、需要多少钱。
协议书 | xié yì shū | written agreement | 双方商量好以后写下来的文书 | 双方在＿＿上签了字，这件事就算定下来了。
说明书 | shuō míng shū | instructions, manual | 说明东西的用法的文字 | 使用这台机器以前，请先仔细阅读＿＿。
请假条 | qǐng jià tiáo | leave note | 请假时写的条子 | 他发烧了，妈妈帮他给老师写了一张＿＿。
批复 | pī fù | official reply | 上级对下级的请示作出的答复 | 上级对我们的请示作了＿＿，同意了这个计划。
批示 | pī shì | written instructions | 上级在文件上写的意见 | 校长在文件上写了＿＿：“同意，请马上办理。”
请批示 | qǐng pī shì | (closing of a request) please instruct | 请示最后请上级给意见的话 | 请示的最后常常写“妥否，＿＿”。
`,
  },
  {
    theme: ["Minutes of a Meeting", "会议记录"],
    data: `
会议纪要 | huì yì jì yào | summary of a meeting | 记下会议的主要事项和决定的文件 | 开完会以后，秘书把会上决定的事情整理成一份＿＿，发给各个部门。 | 会议记录
会议记录 | huì yì jì lù | minutes | 会议中当场记下的内容 | ＿＿要写清楚开会的时间、地点和每个人的发言。
记录人 | jì lù rén | minute-taker | 负责记录的人 | 会议记录的最后要写上＿＿的名字。
列席 | liè xí | to attend without a vote | 参加会议，但是没有表决权 | 这次会议，几位学生代表也＿＿了，但是他们不参加表决。
缺席 | quē xí | to be absent | 应该参加会议而没有参加 | 今天的会议有两个人因为生病＿＿了。
签到 | qiān dào | to sign in | 参加会议时在本子上写上自己的名字 | 参加会议的人到了以后，先在门口＿＿。
签到表 | qiān dào biǎo | sign-in sheet | 参加会议的人写名字的表 | 会议结束后，秘书数了数＿＿上的名字，一共来了三十个人。
举手表决 | jǔ shǒu biǎo jué | to vote by a show of hands | 用举手的方式表示同意或不同意 | 大家对这个计划没有不同意见，＿＿以后全部同意。
与会 | yù huì | to attend a meeting | 参加会议 | ＿＿的人都在会议记录上签了名。 | 列席
议定 | yì dìng | to agree on after discussion | 商量以后决定 | 经过讨论，大家＿＿下次会议在三月五日召开。
`,
  },
  {
    theme: ["Handling Documents", "公文的处理"],
    data: `
编号 | biān hào | serial number | 按顺序编的号码 | 每一份合同都有一个＿＿，方便以后查找。
文号 | wén hào | document number | 公文的代号，由单位代字、年份和顺序号组成 | 公文的＿＿由单位的代字、年份和顺序号组成，写在标题上面。
签发 | qiān fā | to sign and issue | 领导签字以后发出公文 | 这份文件要由局长＿＿以后才能发出。
印发 | yìn fā | to print and distribute | 印出来发给大家 | 学校把新的作息时间表＿＿给了每个班级。
上报 | shàng bào | to report to a higher level | 向上级报告 | 各班要在周五以前把参加比赛的名单＿＿学校。
备案 | bèi àn | to put on record | 向有关部门报告，存档备查 | 新开的公司要到有关部门＿＿。
存档 | cún dàng | to file | 把处理好的文件放进档案里保存 | 这些材料看完以后要＿＿，不能丢掉。
抄送 | chāo sòng | to copy (to someone) | 把文件同时送给有关的单位或人 | 这封邮件除了发给经理，还要＿＿给其他部门的同事。
主送 | zhǔ sòng | to address (to the main recipient) | 把公文送给主要负责办理的单位 | 公文的＿＿单位是主要负责办理的单位，抄送的单位只要知道就可以了。
函告 | hán gào | to inform by letter | 用信告诉 | 会议的时间改了，我们已经＿＿各个参会单位。
`,
  },
  {
    theme: ["Phrases of Official Letters", "公函用语"],
    data: `
来函 | lái hán | your letter | 对方寄来的信 | 贵校的＿＿已经收到，我们同意派两名老师参加交流。 | 复函
复函 | fù hán | letter of reply | 回复的信 | 收到对方的信以后，我们要尽快写一份＿＿。
致函 | zhì hán | to write to | 给某人或某单位写信 | 公司＿＿市政府，希望在这里建一座新工厂。
函件 | hán jiàn | letters, correspondence | 信件 | 秘书每天要处理几十封＿＿。
此复 | cǐ fù | (closing of a reply) | 回复来信时的结束语 | 回复别人的来函时，结尾常常写“特此函复”或者“＿＿”。
妥否 | tuǒ fǒu | whether it is proper | 是否合适 | 请示的最后常常写“＿＿，请批示”，请上级说说这样做合不合适。
如下 | rú xià | as follows | 像下面所说的 | 现将有关事项通知＿＿：
据此 | jù cǐ | on these grounds | 根据这个 | 调查发现这条路上的车太多，＿＿，市里决定再修一条新路。
兹有 | zī yǒu | here is (in letters of introduction) | 现在有 | ＿＿我校学生王明同学前往贵单位实习，请给予帮助。
兹因 | zī yīn | because now | 现在因为 | ＿＿学校停电，明天的课改到下周一上。
`,
  },
  {
    theme: ["Receipts and Capital Numerals", "收据和大写数字"],
    data: `
收条 | shōu tiáo | receipt (note) | 收到钱或东西时写给对方的条子 | 他把班费交给了老师，老师给他写了一张＿＿：今收到班费叁拾元整。 | 欠条 领条
欠条 | qiàn tiáo | IOU | 欠别人钱或东西时写的条子 | 他买东西时钱不够，给店主写了一张＿＿：今欠货款玖拾元整。
领条 | lǐng tiáo | note acknowledging items received | 领东西时写的条子 | 他从体育室领了八个篮球，在＿＿上写着：今领到篮球捌个。
大写金额 | dà xiě jīn é | amount in capital numerals | 用壹、贰、叁等大写数字写的钱数 | 填写支票的时候，＿＿要写成“壹万元整”，不容易被别人改动。
元整 | yuán zhěng | exactly (so many) yuan | 写钱数时写在最后，表示没有零头 | 这张收据上写着：人民币壹拾捌＿＿。
合计 | hé jì | to add up to | 合起来计算 | 三本书的价钱＿＿六十元。
累计 | lěi jì | cumulative | 一次一次加起来 | 这个月他＿＿跑了一百公里。 | 合计
结余 | jié yú | balance, surplus | 收入除去支出以后留下的钱 | 这个月他花了两千元，还＿＿三百元。
乙方 | yǐ fāng | Party B | 合同中称另一方 | 合同里，出租房子的一方是甲方，租房子的一方是＿＿。 | 丙方
丙方 | bǐng fāng | Party C | 合同中的第三方 | 如果一份合同有三方，排在第三的一方就叫＿＿。
`,
  },
  {
    theme: ["Places and Contacts", "地名和联系方式"],
    data: `
浙江 | zhè jiāng | Zhejiang | 中国东部的一个省 | ＿＿省在中国东部，省会是杭州。
杭州 | háng zhōu | Hangzhou | 浙江省的省会 | 西湖在＿＿，是中国有名的风景区。
陕西 | shǎn xī | Shaanxi | 中国西北部的一个省 | ＿＿的省会是西安，那里有有名的兵马俑。
辽宁 | liáo níng | Liaoning | 中国东北部的一个省 | ＿＿在中国东北，南边靠着大海。
河北 | hé běi | Hebei | 中国北部的一个省，简称“冀” | ＿＿省的简称是“冀”。
湘江 | xiāng jiāng | Xiang River | 湖南最大的河流 | ＿＿是湖南最大的河流，从南向北流进洞庭湖。
湘菜 | xiāng cài | Hunan cuisine | 湖南风味的菜 | ＿＿是湖南的菜，很多菜又香又辣。
辽阔 | liáo kuò | vast | 宽广，空旷 | 内蒙古的草原十分＿＿，一眼望不到边。
联系电话 | lián xì diàn huà | contact telephone number | 用来联系的电话号码 | 报名表上要填写姓名、地址和＿＿，方便我们打电话通知你。
电子邮箱 | diàn zǐ yóu xiāng | email address | 收发电子邮件的地址 | 请把你的作业发到老师的＿＿里。
`,
  },
  {
    theme: ["Hope and Honour", "希望和敬意"],
    data: `
希冀 | xī jì | hope | 希望 | 他心里怀着对未来的＿＿，离开家乡去了大城市。
瞩目 | zhǔ mù | to attract attention | 注视，注目 | 这位年轻科学家的研究成果引人＿＿。
举世瞩目 | jǔ shì zhǔ mù | to attract the attention of the whole world | 全世界的人都注视着 | 长城是＿＿的伟大工程。
高瞻远瞩 | gāo zhān yuǎn zhǔ | to look far ahead | 站得高，看得远 | 这位老校长＿＿，几十年前就开始重视学生的外语学习。
禀报 | bǐng bào | to report (to a superior) | 向上级或长辈报告 | 古时候，家里的下人把客人来访的消息＿＿给主人。
禀性 | bǐng xìng | natural disposition | 天生的性格 | 他从小＿＿善良，总是愿意帮助别人。
恩赐 | ēn cì | favour, bestowal | 出于怜悯而给予的好处 | 好的成绩不是别人的＿＿，而是自己努力得来的。 | 赏赐
赏赐 | shǎng cì | to grant a reward | 地位高的人把东西给地位低的人 | 古时候，立了大功的将军常常会得到皇帝的＿＿。
园丁 | yuán dīng | gardener | 做园艺工作的人；比喻老师 | 人们常常把老师比作辛勤的＿＿。
人丁 | rén dīng | members of a family | 家里的人口 | 过去，人们常常希望家里＿＿兴旺。
`,
  },
  {
    theme: ["Times, Keys and Land", "时间、钥匙和土地"],
    data: `
傍晚 | bàng wǎn | dusk | 太阳快落下去的时候 | ＿＿时分，太阳快落山了，天边一片红色。
顷刻 | qǐng kè | in an instant | 极短的时间 | 大雨来得很快，＿＿之间，路上就全是水了。
每逢 | měi féng | every time (it comes) | 每到 | ＿＿周一早上，学校都要举行升旗仪式。
逢年过节 | féng nián guò jié | at New Year and on festivals | 遇到过年或过节 | ＿＿的时候，他都会给远方的父母打电话问好。
千载难逢 | qiān zǎi nán féng | once in a lifetime | 一千年也难遇到一次，形容机会非常难得 | 能到国家队训练是一个＿＿的机会，他一定要好好珍惜。
久别重逢 | jiǔ bié chóng féng | to meet again after a long separation | 分别了很久以后再见面 | 两位老同学＿＿，紧紧地抱在了一起。
钥匙 | yào shi | key | 开锁用的东西 | 他出门时忘了带＿＿，只好在门口等妈妈回来。
徐徐 | xú xú | slowly, gently | 慢慢地 | 国歌响起，国旗＿＿升起。
公顷 | gōng qǐng | hectare | 土地面积单位，等于一万平方米 | 这个农场有五百＿＿土地，种的全是小麦。
贮存 | zhù cún | to store | 把东西存放起来 | 秋天收的粮食都＿＿在仓库里，准备过冬。
`,
  },
];
