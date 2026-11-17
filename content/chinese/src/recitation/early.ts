// The poems recited in grades 1 and 2, ten a grade: short classical poems children learn first, chosen from those the
// compulsory standard recommends. The texts are classical; what each line means is written for this subject. The format
// is that of parsePoems.

import { parsePoems } from "./poems.ts";

/** gradeOnePoems are the poems recited in grade 1. */
export const gradeOnePoems = parsePoems(`
recite-yong-e | 咏鹅 | Ode to the Goose | 骆宾王 | Luo Binwang | 唐 | Tang
鹅，鹅，鹅， | 鹅呀，鹅呀，鹅呀 | 鹅>娥 鹅>俄
曲项向天歌。 | 它弯着脖子，朝着天空欢快地歌唱 | 项>顶 歌>哥
白毛浮绿水， | 雪白的羽毛漂浮在碧绿的水面上 | 浮>俘 绿>录
红掌拨清波。 | 红红的脚掌拨动着清清的水波 | 掌>常 拨>拔

recite-jiang-nan | 江南 | South of the River | 汉乐府 | Han Yuefu | 汉 | Han
江南可采莲， | 江南的水乡正是采莲的好地方 | 采>菜 莲>连
莲叶何田田。 | 莲叶长得多么茂盛，一片连着一片 | 何>河 叶>计
鱼戏莲叶间。 | 鱼儿在莲叶中间游来游去 | 戏>对 间>问
鱼戏莲叶东， | 鱼儿一会儿游到莲叶东边 | 东>车 鱼>渔
鱼戏莲叶西， | 一会儿游到莲叶西边 | 西>四 戏>欢
鱼戏莲叶南， | 一会儿游到莲叶南边 | 南>男 莲>连
鱼戏莲叶北。 | 一会儿又游到莲叶北边 | 北>比 叶>页

recite-min-nong-chu-he | 悯农（锄禾日当午） | Pity the Farmers: Hoeing at Noon | 李绅 | Li Shen | 唐 | Tang
锄禾日当午， | 农民在正午的烈日下给禾苗锄草 | 锄>助 禾>和
汗滴禾下土。 | 汗水一滴一滴落在禾苗下的泥土里 | 汗>汁 滴>摘
谁知盘中餐， | 有谁知道盘子里的饭菜 | 盘>般 餐>参
粒粒皆辛苦。 | 每一粒都是农民辛辛苦苦种出来的 | 粒>拉 皆>背

recite-gu-lang-yue-xing | 古朗月行（节选） | Song of the Bright Moon (Excerpt) | 李白 | Li Bai | 唐 | Tang
小时不识月， | 小时候不认识月亮 | 识>只 时>对
呼作白玉盘。 | 把它叫作白玉做的盘子 | 呼>乎 盘>般
又疑瑶台镜， | 又以为它是仙人瑶台上的镜子 | 疑>凝 镜>境
飞在青云端。 | 飞到了青云的上面 | 端>瑞 青>清

recite-feng-li-qiao | 风 | Wind | 李峤 | Li Qiao | 唐 | Tang
解落三秋叶， | 风能吹落秋天的树叶 | 解>介 落>洛
能开二月花。 | 能吹开早春二月的花朵 | 能>态 开>井
过江千尺浪， | 风刮过江面，掀起千尺高的大浪 | 浪>狼 尺>只
入竹万竿斜。 | 风吹进竹林，万根竹子都歪斜了 | 竿>杆 斜>邪

recite-chun-xiao | 春晓 | Spring Dawn | 孟浩然 | Meng Haoran | 唐 | Tang
春眠不觉晓， | 春天睡得香甜，不知不觉天就亮了 | 眠>眼 晓>烧
处处闻啼鸟。 | 到处都能听到小鸟的叫声 | 闻>问 啼>蹄
夜来风雨声， | 想起昨天夜里刮风下雨的声音 | 声>生 雨>两
花落知多少。 | 不知道有多少花被打落了 | 落>洛 知>和

recite-jing-ye-si | 静夜思 | Thoughts on a Quiet Night | 李白 | Li Bai | 唐 | Tang
床前明月光， | 明亮的月光洒在床前 | 床>庆 光>先
疑是地上霜。 | 好像地上铺了一层白霜 | 疑>凝 霜>箱
举头望明月， | 抬起头来，望着天上的明月 | 举>拳 望>忘
低头思故乡。 | 低下头来，思念远方的家乡 | 低>底 思>恩

recite-xun-yin-zhe | 寻隐者不遇 | Seeking the Hermit in Vain | 贾岛 | Jia Dao | 唐 | Tang
松下问童子， | 在松树下问隐者的小徒弟 | 松>公 童>重
言师采药去。 | 他说师父采药去了 | 言>信 药>约
只在此山中， | 就在这座山里 | 此>比 只>兄
云深不知处。 | 可是山中云雾太浓，不知道他在哪里 | 深>探 处>外

recite-chi-shang | 池上 | On the Pond | 白居易 | Bai Juyi | 唐 | Tang
小娃撑小艇， | 一个小孩撑着一只小船 | 撑>掌 艇>挺
偷采白莲回。 | 偷偷地采了白莲花回来 | 偷>输 莲>连
不解藏踪迹， | 他不懂得藏好自己的踪迹 | 藏>脏 踪>综
浮萍一道开。 | 水面的浮萍被小船分开，留下一道痕迹 | 萍>苹 浮>俘

recite-xiao-chi | 小池 | The Little Pond | 杨万里 | Yang Wanli | 宋 | Song
泉眼无声惜细流， | 泉眼静静地流出细细的泉水，好像舍不得它流走 | 惜>借 泉>全
树阴照水爱晴柔。 | 树荫倒映在水面，喜爱晴天里柔和的风光 | 晴>睛 阴>阳
小荷才露尖尖角， | 小荷叶刚刚露出尖尖的角 | 露>路 尖>尘
早有蜻蜓立上头。 | 早就有一只蜻蜓立在它的上头 | 蜻>请 立>位
`);

/** gradeTwoPoems are the poems recited in grade 2. */
export const gradeTwoPoems = parsePoems(`
recite-cun-ju-gao-ding | 村居 | Village Life | 高鼎 | Gao Ding | 清 | Qing
草长莺飞二月天， | 二月里，青草长高了，黄莺飞来飞去 | 莺>鹰 飞>非
拂堤杨柳醉春烟。 | 杨柳轻轻拂着河堤，好像在春天的雾气里醉了 | 拂>佛 堤>提
儿童散学归来早， | 孩子们放学早早地回到家 | 散>撒 归>旧
忙趁东风放纸鸢。 | 赶紧趁着东风放起风筝 | 趁>称 鸢>莺

recite-yong-liu | 咏柳 | Ode to the Willow | 贺知章 | He Zhizhang | 唐 | Tang
碧玉妆成一树高， | 高高的柳树像用碧玉装扮成的 | 碧>壁 妆>装
万条垂下绿丝绦。 | 垂下万条柳枝，像绿色的丝带 | 垂>睡 绦>涤
不知细叶谁裁出， | 不知道这细细的柳叶是谁裁出来的 | 裁>栽 细>组
二月春风似剪刀。 | 原来二月的春风像一把剪刀 | 似>以 剪>前

recite-cao-li-li | 赋得古原草送别（节选） | Grass on the Ancient Plain (Excerpt) | 白居易 | Bai Juyi | 唐 | Tang
离离原上草， | 原野上的青草长得多么茂盛 | 离>高 原>源
一岁一枯荣。 | 每年枯萎一次，又茂盛一次 | 枯>姑 荣>荧
野火烧不尽， | 野火也烧不完它 | 野>墅 烧>浇
春风吹又生。 | 春风一吹，它又长出来了 | 吹>次 生>升

recite-xiao-chu-jing-ci-si | 晓出净慈寺送林子方 | Seeing Off Lin Zifang at Dawn from Jingci Temple | 杨万里 | Yang Wanli | 宋 | Song
毕竟西湖六月中， | 到底是六月里的西湖 | 毕>华 竟>竞
风光不与四时同。 | 风光和别的季节不一样 | 与>写 同>问
接天莲叶无穷碧， | 莲叶一片碧绿，好像和天连在一起，望不到边 | 穷>穹 碧>壁
映日荷花别样红。 | 荷花在阳光照耀下，红得格外鲜艳 | 映>英 荷>何

recite-jue-ju-huang-li | 绝句（两个黄鹂鸣翠柳） | Quatrain: Two Golden Orioles | 杜甫 | Du Fu | 唐 | Tang
两个黄鹂鸣翠柳， | 两只黄鹂在翠绿的柳树上鸣叫 | 鸣>呜 翠>萃
一行白鹭上青天。 | 一行白鹭飞上蓝蓝的天空 | 鹭>露 行>形
窗含西岭千秋雪， | 窗外可以看到西岭上终年不化的积雪 | 含>贪 岭>领
门泊东吴万里船。 | 门前停着从万里之外的东吴来的船 | 泊>拍 船>般

recite-min-nong-chun-zhong | 悯农（春种一粒粟） | Pity the Farmers: Sowing in Spring | 李绅 | Li Shen | 唐 | Tang
春种一粒粟， | 春天种下一粒种子 | 种>钟 粟>栗
秋收万颗子。 | 秋天能收获很多粮食 | 颗>棵 收>牧
四海无闲田， | 天下没有一块荒着的田地 | 闲>间 海>每
农夫犹饿死。 | 可是种田的农民还是会饿死 | 犹>扰 饿>俄

recite-wang-lu-shan-pu-bu | 望庐山瀑布 | Gazing at the Lushan Waterfall | 李白 | Li Bai | 唐 | Tang
日照香炉生紫烟， | 太阳照着香炉峰，升起紫色的云烟 | 炉>护 紫>柴
遥看瀑布挂前川。 | 远远看去，瀑布像一条白练挂在山前 | 遥>摇 瀑>爆
飞流直下三千尺， | 瀑布从高处飞奔直下，好像有三千尺长 | 直>真 尺>只
疑是银河落九天。 | 让人以为是银河从天上落了下来 | 疑>凝 银>很

recite-jiang-xue | 江雪 | River Snow | 柳宗元 | Liu Zongyuan | 唐 | Tang
千山鸟飞绝， | 所有的山上都看不到飞鸟了 | 绝>色 鸟>乌
万径人踪灭。 | 所有的小路上都没有人的足迹 | 径>经 灭>火
孤舟蓑笠翁， | 一只小船上，坐着一位披蓑衣、戴斗笠的老渔翁 | 孤>狐 笠>立
独钓寒江雪。 | 独自在寒冷的江面上钓鱼 | 钓>钩 寒>赛

recite-ye-su-shan-si | 夜宿山寺 | A Night at a Mountain Temple | 李白 | Li Bai | 唐 | Tang
危楼高百尺， | 山上的寺楼高得好像有一百尺 | 危>为 楼>搂
手可摘星辰。 | 站在楼上，伸手就能摘下天上的星星 | 摘>滴 辰>晨
不敢高声语， | 不敢大声说话 | 敢>取 语>话
恐惊天上人。 | 怕惊动了天上的神仙 | 恐>巩 惊>京

recite-deng-guan-que-lou | 登鹳雀楼 | Climbing Stork Tower | 王之涣 | Wang Zhihuan | 唐 | Tang
白日依山尽， | 太阳靠着西山慢慢落下去 | 依>衣 尽>进
黄河入海流。 | 黄河向着大海奔流 | 入>人 流>留
欲穷千里目， | 要想看到千里之外的风景 | 欲>浴 穷>穹
更上一层楼。 | 就要再登上一层楼 | 层>屋 更>便
`);
