// The classical passages recited in grades 3 to 6, each in the grade whose national textbook teaches it
// (docs/chinese-curriculum.md §7 and §18.8). The texts are classical and in the public domain; what each sentence means
// is written for this subject. The format is that of parsePoems for prose: a line may hold marks within it and end with a
// colon or quotation marks.

import { parsePoems } from "../recitation/poems.ts";

/** gradeThreePassages are the classical passages recited in grade 3. */
export const gradeThreePassages = parsePoems(
  `
recite-shou-zhu-dai-tu | 守株待兔 | Waiting by the Stump | 韩非 | Han Fei | 战国 | Warring States
宋人有耕者。 | 宋国有一个种田的人 | 耕>井 宋>宗
田中有株， | 他的田里有一个树桩 | 株>珠 田>由
兔走触株， | 一只兔子奔跑时撞到了树桩上 | 兔>免 触>独
折颈而死。 | 折断脖子死了 | 颈>径 折>拆
因释其耒而守株， | 于是他放下手中的农具，守在树桩旁边 | 释>择 耒>来
冀复得兔。 | 希望再捡到撞死的兔子 | 冀>翼 复>覆
兔不可复得， | 兔子是不可能再得到的 | 可>何 得>的
而身为宋国笑。 | 他自己却成了宋国人的笑柄 | 身>申 笑>啸
`,
  "prose",
);

/** gradeFourPassages are the classical passages recited in grade 4. */
export const gradeFourPassages = parsePoems(
  `
recite-nang-ying-ye-du | 囊萤夜读 | Reading by Fireflies | 房玄龄等 | Fang Xuanling and others | 唐 | Tang
胤恭勤不倦， | 车胤做事恭敬勤恳，从不懈怠 | 倦>卷 恭>共
博学多通。 | 学识广博，通晓很多事理 | 博>搏 通>同
家贫不常得油， | 家里贫穷，不能经常得到点灯的油 | 贫>贪 常>尝
夏月则练囊盛数十萤火以照书， | 夏天就用白绢做成袋子，装上几十只萤火虫来照着读书 | 萤>莹 囊>襄
以夜继日焉。 | 用夜晚接着白天读书 | 继>记 焉>烟

recite-tie-chu-cheng-zhen | 铁杵成针 | The Iron Pestle and the Needle | 祝穆 | Zhu Mu | 宋 | Song
磨针溪，在眉州象耳山下。 | 磨针溪在眉州的象耳山脚下 | 磨>摩 眉>梅
世传李太白读书山中， | 世代相传，李白曾在山中读书 | 传>转 读>续
未成，弃去。 | 学业还没有完成，就放弃离开了 | 弃>齐 成>城
过是溪， | 他经过这条小溪 | 溪>汐 是>事
逢老媪方磨铁杵， | 遇见一位老妇人正在磨一根铁棒 | 逢>缝 杵>忤
问之，曰：“欲作针。” | 李白问她在做什么，她说想把铁棒磨成针 | 欲>浴 作>做
太白感其意， | 李白被她的意志感动 | 感>敢 意>义
还卒业。 | 回去完成了学业 | 卒>率 还>环
`,
  "prose",
);

/** gradeFivePassages are the classical passages recited in grade 5. */
export const gradeFivePassages = parsePoems(
  `
recite-yang-shi-zhi-zi | 杨氏之子 | The Son of the Yang Family | 刘义庆 | Liu Yiqing | 南朝宋 | Liu Song
梁国杨氏子九岁， | 梁国一户姓杨的人家有个九岁的儿子 | 梁>粱 杨>扬
甚聪惠。 | 他非常聪明 | 甚>其 聪>葱
孔君平诣其父， | 孔君平去拜访这孩子的父亲 | 诣>旨 君>群
父不在， | 孩子的父亲不在家 | 父>夫 在>再
乃呼儿出。 | 于是把孩子叫了出来 | 乃>及 呼>乎
为设果， | 孩子给客人摆出水果 | 设>没 为>位
果有杨梅。 | 水果里有杨梅 | 梅>每 果>课
孔指以示儿曰： | 孔君平指着杨梅给孩子看，说 | 示>是 指>旨
“此是君家果。” | 这是你家的水果 | 此>比 家>佳
儿应声答曰： | 孩子随即回答说 | 应>映 答>达
“未闻孔雀是夫子家禽。” | 没有听说孔雀是您家的鸟 | 闻>问 禽>擒
`,
  "prose",
);

/** gradeSixPassages are the classical passages recited in grade 6, in the order of the textbook. */
export const gradeSixPassages = parsePoems(
  `
recite-bo-ya-gu-qin | 伯牙鼓琴 | Boya Plays the Qin | 列御寇 | Lie Yukou | 战国 | Warring States
伯牙善鼓琴， | 伯牙擅长弹琴 | 鼓>古 善>擅
钟子期善听。 | 钟子期善于听琴 | 钟>种 听>厅
伯牙鼓琴， | 伯牙弹琴的时候 | 牙>芽 琴>芩
志在登高山。 | 心里想着登上高山 | 志>至 登>灯
钟子期曰：“善哉！峨峨兮若泰山！” | 钟子期赞叹琴声高峻，像巍峨的泰山 | 峨>娥 泰>秦
志在流水， | 心里想着流水 | 流>留 在>再
钟子期曰：“善哉！洋洋兮若江河！” | 钟子期赞叹琴声浩荡，像奔流的江河 | 洋>样 河>何
伯牙所念， | 伯牙心里所想的 | 念>今 所>听
钟子期必得之。 | 钟子期一定能从琴声中听出来 | 必>心 得>的

recite-xue-yi | 学弈 | Learning Weiqi | 孟子 | Mencius | 战国 | Warring States
弈秋，通国之善弈者也。 | 弈秋是全国最善于下棋的人 | 弈>奕 善>擅
使弈秋诲二人弈， | 让弈秋教两个人下棋 | 诲>悔 使>便
其一人专心致志， | 其中一个人一心一意 | 致>至 志>智
惟弈秋之为听； | 只听弈秋的教导 | 惟>维 听>厅
一人虽听之， | 另一个人虽然也在听 | 虽>谁 之>支
一心以为有鸿鹄将至， | 心里却总想着有天鹅要飞来 | 鸿>洪 将>奖
思援弓缴而射之。 | 想着拿起弓箭去射它 | 援>缓 缴>激
虽与之俱学， | 虽然他和那个人一起学习 | 俱>具 与>于
弗若之矣。 | 却学得不如那个人 | 弗>佛 若>苦
为是其智弗若与？ | 是因为他的智力不如那个人吗 | 智>知 为>伪
曰：非然也。 | 我说：不是这样的 | 然>燃 非>菲
`,
  "prose",
);
