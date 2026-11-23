// The words of level 2 (docs/chinese-curriculum.md §8.3): 770 words of daily life in 77 batches of ten, none of them
// taught in level 1, each written only with characters taught by its unit, each with a short sentence of those
// characters to fill.
//
// A line a word, as in level 1: `word | pinyin, a syllable each | meaning in English | meaning in Chinese | sentence with
// ＿＿ for the word[ | words of the batch that could also fill the gap or mean nearly the same, kept apart from it]`.

import type { LevelWordBatch } from "./level.ts";

/** wordBatches are the 77 batches of level 2 words, in teaching order. */
export const wordBatches: readonly LevelWordBatch[] = [
  {
    theme: ["Time Words", "时间副词"],
    data: `
已经 | yǐ jīng | already | 表示事情做完了或时间过去了 | 我＿＿吃过早饭了，不饿。 | 刚才 自己
正在 | zhèng zài | in the middle of (doing) | 表示动作在进行 | 现在妈妈＿＿做饭呢，你等一下。 | 自己
才 | cái | not until, only then | 表示事情发生得晚 | 我等了他一个小时，他＿＿来。
又 | yòu | again (it already happened) | 表示动作重复发生 | 昨天他没来上课，今天他＿＿没来。 | 一直
只 | zhǐ | only | 仅仅，表示限于某个范围 | 我们家＿＿有我一个孩子。 | 才
更 | gèng | even more | 表示程度又高了一层 | 今天很冷，明天比今天＿＿冷。
一直 | yī zhí | all along, continuously | 表示动作不停或状态不变 | 昨天晚上的雨＿＿下到今天早上。
刚才 | gāng cái | just now | 不久以前的那个时候 | 你＿＿去哪里了？我找了你半天。 | 已经 又 自己
常常 | cháng cháng | often | 表示次数多 | 我＿＿去那个饭店吃饭，一个星期去三次。 | 自己
自己 | zì jǐ | oneself | 本人 | 这件事我想＿＿做，不要别人帮忙。 | 常常
`,
  },
  {
    theme: ["In the Morning", "早上"],
    data: `
刷牙 | shuā yá | to brush one's teeth | 用牙刷把牙清理干净 | 早上起床以后，我先＿＿再吃早饭。 | 洗脸 洗澡
洗脸 | xǐ liǎn | to wash one's face | 用水把脸弄干净 | 你的脸上有东西，快去＿＿吧。 | 刷牙 洗澡
洗澡 | xǐ zǎo | to take a bath or shower | 洗全身 | 天太热了，我每天晚上都要＿＿。 | 刷牙 洗脸
起床 | qǐ chuáng | to get up | 睡醒以后从床上起来 | 星期天我不用早＿＿，可以在床上多睡一会儿。 | 醒
醒 | xǐng | to wake up | 睡眠结束 | 他睡得很好，一直没＿＿，早上九点才起床。 | 起床
上床 | shàng chuáng | to go to bed | 到床上去 | 晚上十点了，孩子们该＿＿睡觉了。
拿 | ná | to take, to hold | 用手抓住 | 请你把那本书＿＿给我。
放 | fàng | to put | 使处在某个位置 | 我把书包＿＿在床上了。 | 忘
忘 | wàng | to forget | 不记得 | 我＿＿了带手机，所以没给你打电话。 | 放
记 | jì | to note down; to remember | 写下来；留在脑子里 | 老师说的话，我都＿＿在本子上了。
`,
  },
  {
    theme: ["Getting Ready", "准备"],
    data: `
准备 | zhǔn bèi | to prepare | 预先安排或筹划 | 明天要考试，我在＿＿。
完成 | wán chéng | to complete | 按要求做好 | 这个工作很难，我们三天才＿＿。 | 完
完 | wán | to finish | 结束，没有剩下的 | 我吃＿＿饭就去找你。
告诉 | gào su | to tell | 把事情说给别人听 | 请你＿＿我，这个字怎么读。
成 | chéng | to become | 变为 | 她长大以后＿＿了一个老师。
非常 | fēi cháng | extremely | 表示程度很高 | 这个电影＿＿有意思，你可以去看看。 | 一定 当然
一定 | yī dìng | surely, must | 必定，没有问题 | 明天的考试你＿＿要来，别忘了。 | 当然 准时 非常
当然 | dāng rán | of course | 应该这样，没有疑问 | “你会来吗？”“＿＿会来！” | 一定
准时 | zhǔn shí | on time | 按时间，不早也不晚 | 明天八点上课，请大家＿＿来。 | 一定
正常 | zhèng cháng | normal | 合乎一般情况的 | 他的身体很＿＿，没有病。
`,
  },
  {
    theme: ["Linking Words", "连接的词"],
    data: `
但是 | dàn shì | but | 表示转折 | 这件衣服很好看，＿＿太贵了。
虽然 | suī rán | although | 表示先承认一个事实 | ＿＿外面很冷，他还是出去跑了一个小时。
如果 | rú guǒ | if | 假使 | ＿＿明天下雨，我们就不去公园了。 | 只要
应该 | yīng gāi | should | 理所当然 | 你病了，＿＿去看医生。
然后 | rán hòu | afterwards, then | 一件事以后接着另一件事 | 我们先吃饭，＿＿去看电影。
刚刚 | gāng gāng | only a moment ago | 发生在不久以前 | 他＿＿出去，一会儿就回来。
直到 | zhí dào | until | 到某个时候为止 | 我们＿＿晚上十点才回家。
不但 | bù dàn | not only | 不仅 | 他＿＿会说汉语，还会写汉字。
当时 | dāng shí | at that time | 那个时候 | 我十岁来中国，＿＿还不会说汉语。 | 但是
只要 | zhǐ yào | as long as | 表示有了这个条件就够了 | ＿＿你认真学习，就能学好汉语。 | 如果
`,
  },
  {
    theme: ["Remembering and Holding", "记和拿"],
    data: `
被 | bèi | (marks the passive) by | 表示主语是受动者 | 我的手机＿＿弟弟拿走了。
把 | bǎ | (puts the object before the verb) | 使动作的对象放在动词前 | 请你＿＿门关上。
着 | zhe | (after a verb) in a lasting state | 表示状态在持续 | 他坐＿＿看书，没有说话。
记得 | jì de | to remember | 没有忘 | 你还＿＿我吗？我们是小学同学。 | 记住
忘记 | wàng jì | to forget | 不记得了 | 对不起，我＿＿你的名字了。
日记 | rì jì | diary | 每天写下来的事 | 她每天晚上睡觉前都写＿＿。
记住 | jì zhù | to remember firmly | 牢牢地留在脑子里 | 这些汉字你都＿＿了吗？明天要考试。 | 记得 忘记
放心 | fàng xīn | to feel at ease | 心里安定，不担忧 | 你＿＿，我会认真工作的。
放学 | fàng xué | (of school) to let out | 学校里一天的课上完了 | 下午四点＿＿以后，我去打球。
拿走 | ná zǒu | to take away | 拿着离开 | 这本书是我的，你别＿＿。 | 忘记
`,
  },
  {
    theme: ["Every Day", "每天"],
    data: `
正好 | zhèng hǎo | just right; as it happens | 恰巧，刚刚合适 | 你来得＿＿，我们要吃饭了。
真正 | zhēn zhèng | real, true | 实实在在的 | 他是我＿＿的朋友，我有事他都会帮我。
常见 | cháng jiàn | common | 时常看到的 | 这是一个很＿＿的问题，很多人都问过。
经常 | jīng cháng | frequently | 常常，时常 | 他＿＿去北京工作，一年要去十几次。
经过 | jīng guò | to pass by | 从某处过去 | 去学校的路上，我会＿＿一个公园。
成为 | chéng wéi | to turn into, to become | 变成 | 他想＿＿一个好医生。
不如 | bù rú | not as good as | 比不上 | 坐车去＿＿走路去，走路很快就到了。
早就 | zǎo jiù | long ago | 很早以前就 | 这件事我＿＿知道了，不用告诉我。
自从 | zì cóng | since | 从过去某个时候起 | ＿＿他去了北京，我们就没见过面。
完了 | wán le | finished, over | 结束了 | 电影＿＿，我们回家吧。
`,
  },
  {
    theme: ["Only and Just", "只和刚"],
    data: `
只好 | zhǐ hǎo | to have no choice but | 不得已，只能 | 没有车了，我们＿＿走路回家。 | 只有
只有 | zhǐ yǒu | only if | 表示唯一的条件 | ＿＿多说，才能说好汉语。
只是 | zhǐ shì | it's just that | 仅仅是 | 我不是不想去，＿＿太忙了。
刚好 | gāng hǎo | exactly | 正巧，恰恰 | 这个房间住四个人，我们＿＿四个人。 | 只有
看起来 | kàn qǐ lai | to look, to seem | 从外表看 | 他今天＿＿很累，昨天晚上一定没睡好。
当地 | dāng dì | local | 本地，那个地方 | 我们去中国南方玩，吃了很多＿＿的菜。
叫醒 | jiào xǐng | to wake (someone) up | 使睡着的人醒过来 | 明天早上六点请你＿＿我。
睡着 | shuì zháo | to fall asleep | 进入睡眠 | 昨天晚上太热了，我很晚才＿＿。
牙医 | yá yī | dentist | 看牙病的医生 | 我牙疼，要去看＿＿。
自然 | zì rán | natural; naturally | 不勉强，不做作 | 你说汉语的时候要＿＿一点，别想太多。
`,
  },
  {
    theme: ["More Little Words", "更多常用词"],
    data: `
正是 | zhèng shì | precisely, exactly | 恰恰是 | 这＿＿我想买的书！
才能 | cái néng | talent, ability | 知识和能力 | 他很有＿＿，十岁就会写小说。
自来水 | zì lái shuǐ | tap water | 用管子送到家里的水 | 家里的＿＿没有了，我们不能洗澡了。
常用 | cháng yòng | in common use | 经常使用的 | 这些都是＿＿的汉字，一定要认识。
告别 | gào bié | to say goodbye | 离开时向人说再见 | 他要回国了，来跟老师＿＿。
拿手 | ná shǒu | good at | 擅长 | 做鱼是我妈妈的＿＿菜。
放大 | fàng dà | to enlarge | 使变大 | 这些字太小了，可以＿＿一点吗？
当中 | dāng zhōng | among, in the middle of | 在里面，在中间 | 我们班的同学＿＿，他的汉语最好。
如今 | rú jīn | nowadays | 现在 | 以前他不会说汉语，＿＿已经说得很好了。
不然 | bù rán | otherwise | 要不，如果不这样 | 快点走吧，＿＿我们就要晚了。
`,
  },
  {
    theme: ["When and How Often", "时候和次数"],
    data: `
过去 | guò qù | the past | 以前的时候 | ＿＿这里没有地铁，现在有了。 | 以前 从来
后来 | hòu lái | later, afterwards | 在那以后 | 他先在北京工作，＿＿去了南方。
以前 | yǐ qián | before, ago | 比现在早的时候 | 三年＿＿，我还不会说汉语。 | 过去 每次
从来 | cóng lái | always (from the past until now) | 从过去到现在 | 他＿＿没去过中国，这是第一次去。 | 过去
往往 | wǎng wǎng | usually, more often than not | 常常，在一般情况下 | 冬天的早上＿＿很冷，要多穿衣服。
每次 | měi cì | every time | 一次又一次，没有例外 | 他＿＿来我家都带一些水果。 | 以前
这次 | zhè cì | this time | 现在的一次 | 上次考试我考得不好，＿＿考得很好。
早晚 | zǎo wǎn | sooner or later | 或早或晚，总有一天 | 这件事他＿＿会知道的，你还是告诉他吧。
半天 | bàn tiān | a long while | 很长时间 | 我等了你＿＿，你怎么才来？
同时 | tóng shí | at the same time | 在同一个时候 | 他们两个人是＿＿到学校的，一个也不早，一个也不晚。
`,
  },
  {
    theme: ["Amounts and Links", "多少和连接"],
    data: `
多么 | duō me | how (in exclamations) | 用在感叹句里，表示程度很高 | 你看，这里的春天＿＿好！ | 十分
不过 | bù guò | but, however | 表示转折，语气比较轻 | 这个菜很好吃，＿＿有一点贵。
不得不 | bù dé bù | to have to | 没有别的办法，只能这样 | 下大雨了，我们＿＿在家里休息。
十分 | shí fēn | fully, very | 很，非常 | 听说你要来，我们都＿＿想见你。 | 多么
所有 | suǒ yǒu | all | 全部的 | 班里＿＿的学生都来了，一个也不少。
左右 | zuǒ yòu | about, approximately | 表示比某个数稍多或稍少 | 这个班有三十个学生＿＿。
一半 | yī bàn | half | 二分之一 | 这些钱太多了，我只要＿＿。
有些 | yǒu xiē | some | 有一部分 | ＿＿学生会说汉语，有的不会。
有点 | yǒu diǎn | a little, somewhat | 表示程度不高 | 今天＿＿冷，你多穿一件衣服吧。 | 十分
本来 | běn lái | originally | 原先，先前 | 我＿＿想去看电影，后来没时间了。
`,
  },
  {
    theme: ["Rooms", "房间"],
    data: `
客厅 | kè tīng | living room | 招待客人、一家人坐着说话的房间 | 我们一家人在＿＿里看电视。 | 厨房
厨房 | chú fáng | kitchen | 做饭菜的房间 | 妈妈在＿＿里做饭。 | 客厅
室友 | shì yǒu | roommate | 住在同一个房间的人 | 我的＿＿是日本人，我们住在一个房间里。
窗子 | chuāng zi | window | 墙上通风透光的口 | 天太热了，请打开＿＿。
电灯 | diàn dēng | electric light | 用电发光的照明器具 | 天黑了，快开＿＿。
桌子 | zhuō zi | table | 有腿、上面放东西的家具 | 我的书放在＿＿上。 | 椅子
椅子 | yǐ zi | chair | 有靠背的坐具 | 我累了，想找一把＿＿坐下。 | 桌子
楼层 | lóu céng | floor (of a building) | 楼的每一级 | 这个楼有二十个＿＿。
层 | céng | (measure word for floors) | 用于楼的一级一级 | 我家住在三＿＿。
很久 | hěn jiǔ | for a long time | 时间很长 | 我等了你＿＿了。
`,
  },
  {
    theme: ["Light and Time at Home", "家里的灯和时间"],
    data: `
开灯 | kāi dēng | to turn on the light | 打开电灯 | 房间里太黑了，我们＿＿吧。
关灯 | guān dēng | to turn off the light | 把灯关上 | 睡觉前别忘了＿＿。
书桌 | shū zhuō | desk | 读书写字用的桌子 | 我的＿＿上有很多书。 | 饭桌
饭桌 | fàn zhuō | dining table | 吃饭用的桌子 | 一家人坐在＿＿前吃晚饭。 | 书桌
不久 | bù jiǔ | soon, before long | 时间不长 | 我们＿＿就要开学了。
多久 | duō jiǔ | how long | 多长时间 | 你学汉语学了＿＿了？
好久 | hǎo jiǔ | for ages | 很长时间 | ＿＿不见！你最近怎么样？
上楼 | shàng lóu | to go upstairs | 到楼上去 | 我家在五层，我每天走路＿＿回家。
一层 | yī céng | ground floor | 楼房最下面的那一级 | 商店在＿＿，饭店在二层。
厨师 | chú shī | cook, chef | 在饭店做饭菜的人 | 这个饭店的＿＿做菜很好吃。
`,
  },
  {
    theme: ["Moving House", "搬家"],
    data: `
搬家 | bān jiā | to move house | 搬到别的地方去住 | 我们下个月要＿＿了，新家在学校附近。
租 | zū | to rent | 付钱使用别人的东西 | 我在学校附近＿＿了一间房子。
房租 | fáng zū | rent | 每个月给房东的钱 | 这里的＿＿太贵了，一个月要五千块。
出租车 | chū zū chē | taxi | 给钱就送你到要去的地方的车 | 下雨了，我们坐＿＿去吧。
邻居 | lín jū | neighbour | 住在旁边的人家 | 我的＿＿是一个老人，他常常帮我。
附近 | fù jìn | nearby | 离某个地方不远的地方 | 学校＿＿有很多饭店。
安静 | ān jìng | quiet | 没有声音，不吵 | 晚上十二点了，大家都睡了，楼里很＿＿。
城市 | chéng shì | city | 人多、房子多的大地方 | 北京是一个很大的＿＿。
市中心 | shì zhōng xīn | city centre | 城市最中间的地方 | 我家在＿＿，去哪里都很方便。 | 附近
小区 | xiǎo qū | residential compound | 一片住房和它们四周的地方 | 我们＿＿里有一个小公园。 | 城市
`,
  },
  {
    theme: ["Where You Live", "住的地方"],
    data: `
街 | jiē | street | 城里两边有房子的路 | 这里的＿＿上有很多商店。
安心 | ān xīn | to be at peace | 心里安定 | 家里没事了，你＿＿工作吧。
城里 | chéng li | in town | 城市里面 | 他每天从家坐车到＿＿上学。 | 城外
市场 | shì chǎng | market | 买卖东西的地方 | 我常去＿＿买菜。 | 城里
地区 | dì qū | area, region | 较大的一片地方 | 这个＿＿冬天很冷。
居住 | jū zhù | to reside | 长时间住在一个地方 | 很多外国人在这里＿＿。
搬走 | bān zǒu | to move away | 搬到别处去 | 我的邻居上个月＿＿了。
租车 | zū chē | to rent a car | 付钱用别人的车 | 我们没有车，可以去＿＿。
市长 | shì zhǎng | mayor | 一个城市的领导 | 我们城市的＿＿是一个女人。
城外 | chéng wài | outside the city | 城市外面 | 我爷爷不住在城里，住在＿＿。 | 城里
`,
  },
  {
    theme: ["Cleaning", "打扫"],
    data: `
干净 | gān jìng | clean | 没有脏东西 | 你的房间真＿＿！
打扫 | dǎ sǎo | to clean, to sweep | 除去尘土 | 星期六我们一起＿＿房间吧。 | 收拾
收拾 | shōu shi | to tidy up | 把东西放好 | 出门前，你要＿＿好你的书包。 | 打扫
换 | huàn | to change | 拿这个，不要原来那个 | 这件衣服太小了，我想＿＿一件大的。
冰箱 | bīng xiāng | refrigerator | 使食物保持冷的电器 | 牛奶在＿＿里。 | 箱子
空调 | kōng tiáo | air conditioner | 使屋里变冷或变暖的电器 | 天太热了，开＿＿吧。
有空 | yǒu kòng | to be free | 有时间 | 你今天＿＿吗？我们去看电影吧。
冰 | bīng | ice | 水冷到零度以下变成的东西 | 天太冷了，外边的水都成了＿＿。
空气 | kōng qì | air | 包围地球的气体 | 下了雨，外面的＿＿很好。
箱子 | xiāng zi | box, suitcase | 放东西的方形器具 | 我要去国外，要用一个大＿＿放衣服。
`,
  },
  {
    theme: ["Housework", "家务"],
    data: `
洗衣机 | xǐ yī jī | washing machine | 洗衣服的电器 | 衣服太多了，放在＿＿里洗吧。
扫地 | sǎo dì | to sweep the floor | 用扫帚把地面弄干净 | 吃完饭，我＿＿，你收拾桌子。
干杯 | gān bēi | cheers! | 喝酒时说的祝酒的话 | 来，大家一起＿＿！
冰水 | bīng shuǐ | iced water | 很冷的水 | 天太热了，我想喝一杯＿＿。
收到 | shōu dào | to receive | 得到别人给的东西 | 你送的书我已经＿＿了，谢谢！
换车 | huàn chē | to change buses or trains | 下了一辆车再上另一辆 | 去机场要先坐地铁，然后＿＿。
空手 | kōng shǒu | empty-handed | 手里没有东西 | 去朋友家不能＿＿去，要带一点东西。
冷静 | lěng jìng | calm | 不慌不忙 | 考试的时候要＿＿，慢慢想。
一干二净 | yī gān èr jìng | completely, thoroughly | 一点也不剩 | 他把饭菜吃得＿＿。
天空 | tiān kōng | sky | 地面上面很高的地方 | 晚上的＿＿上有很多星星。
`,
  },
  {
    theme: ["Settling In", "住下来"],
    data: `
搬进 | bān jìn | to move in | 搬到里面去住 | 我们上个月＿＿了新家。
新居 | xīn jū | new home | 新的住处 | 他们的＿＿很大，有三个房间。
租房 | zū fáng | to rent a place | 付钱住别人的房子 | 在北京＿＿很贵。
灯 | dēng | lamp, light | 照明用的东西 | 房间里太黑了，＿＿在哪里？
静 | jìng | still, quiet | 没有声音 | 大家都走了，学校里很＿＿。
收下 | shōu xià | to accept | 接受别人给的东西 | 这是我送你的东西，请你＿＿。
空中 | kōng zhōng | in the air | 天上 | 飞机在＿＿飞。
窗外 | chuāng wài | outside the window | 窗子外面 | ＿＿下雪了，真好看！ | 街上 空中
长城 | cháng chéng | the Great Wall | 中国北方很长的古代城墙 | 到了北京，一定要去看看＿＿。
街上 | jiē shang | on the street | 街道上 | 下雨了，＿＿没有几个人。
`,
  },
  {
    theme: ["Guests and Hosts", "客人和主人"],
    data: `
房东 | fáng dōng | landlord | 把房子租给别人的人 | 我的＿＿人很好，房租不贵。
晚安 | wǎn ān | good night | 晚上睡觉前说的话 | 我要睡觉了，＿＿！ | 早安
早安 | zǎo ān | good morning | 早上见面时说的话 | ＿＿！你昨天晚上睡得好吗？ | 晚安
请客 | qǐng kè | to treat (and pay for others) | 请别人吃饭等，自己付钱 | 今天我＿＿，你们想吃什么？
做客 | zuò kè | to be a guest | 去别人家拜访 | 星期天我去朋友家＿＿。
见面 | jiàn miàn | to meet | 和别人在一起看到对方 | 我们明天下午三点在学校门前＿＿吧。
钱包 | qián bāo | wallet | 放钱的小包 | 我的＿＿里没有钱了。
点头 | diǎn tóu | to nod | 头向下动一下，表示同意 | 我问他去不去，他＿＿说去。
回头 | huí tóu | to turn one's head | 把头转向后面 | 我在后边叫他，他＿＿看了看我。
比如 | bǐ rú | for example | 举例子时说的话 | 我会做很多菜，＿＿鱼、鸡肉。
`,
  },
  {
    theme: ["Colours", "颜色"],
    data: `
颜色 | yán sè | colour | 红、黄、蓝等 | 你最喜欢什么＿＿？
红色 | hóng sè | red | 像火的颜色 | 过年的时候，中国人喜欢穿＿＿的衣服。
白色 | bái sè | white | 像雪的颜色 | 外面下大雪了，地上都是＿＿。
黑色 | hēi sè | black | 像墨的颜色 | 他穿了一件＿＿的衣服，晚上很难看见他。
蓝色 | lán sè | blue | 像晴天天空的颜色 | 晴天的时候，天是＿＿的。 | 天蓝
绿色 | lǜ sè | green | 像草和树叶的颜色 | ＿＿的灯亮了，我们可以走了。
黄色 | huáng sè | yellow | 像香蕉皮的颜色 | ＿＿的灯亮了，车要慢下来。
黑白 | hēi bái | black and white | 只有黑和白两种颜色 | 以前的电视是＿＿的，现在的电视有很多颜色。
美 | měi | beautiful | 好看 | 这里的春天很＿＿。
天蓝 | tiān lán | sky blue | 像天空那样的蓝 | 她穿了一件＿＿的衣服，跟晴天的天空一样。 | 蓝色
`,
  },
  {
    theme: ["Clothes", "衣服"],
    data: `
裤子 | kù zi | trousers | 穿在腰下、包住两条腿的衣服 | 他穿了一条黑色的＿＿。 | 裙子 短裤
裙子 | qún zi | skirt, dress | 围在腰下、不分两腿的衣服 | 夏天到了，她买了一条红色的＿＿。 | 裤子 短裤
鞋 | xié | shoe | 穿在脚上走路的东西 | 这双＿＿太小了，我的脚很疼。
帽子 | mào zi | hat, cap | 戴在头上的东西 | 外面很冷，戴上＿＿吧。
戴 | dài | to wear (a hat, glasses) | 把东西放在头、脸、手上 | 冬天出门要＿＿帽子。
短裤 | duǎn kù | shorts | 短的裤子 | 天太热了，我穿＿＿去打球。 | 裤子 裙子
双 | shuāng | pair | 两个，成对的 | 我买了一＿＿新鞋。
条 | tiáo | (measure word for long, thin things) | 用于细长的东西 | 我买了一＿＿新裙子。
张 | zhāng | (measure word for flat things) | 用于纸、桌子等 | 这＿＿桌子是新的。
旧 | jiù | old (not new) | 用了很久的 | 我的鞋穿了五年，已经很＿＿了。
`,
  },
  {
    theme: ["Looking Good", "好看"],
    data: `
漂亮 | piào liang | pretty | 样子好看 | 你的新衣服真＿＿！ | 合适 亮
合适 | hé shì | fitting, suitable | 正好符合要求 | 这双鞋不大也不小，很＿＿。 | 漂亮 适合
亮 | liàng | bright | 光线强 | 这个房间的灯很＿＿。
适合 | shì hé | to suit | 符合实际情况或要求 | 这件衣服很＿＿你，你穿上真好看。 | 合适
长短 | cháng duǎn | length | 东西有多长 | 这条裤子的＿＿正好。
美好 | měi hǎo | happy, fine (of life, times) | 好的，使人满意的 | 大学的时候是我最＿＿的时间。
美国 | měi guó | the United States | 北美洲的一个国家 | 他是＿＿人，在中国学习汉语。
美元 | měi yuán | US dollar | 美国的钱 | 这件衣服一百＿＿，太贵了。
双手 | shuāng shǒu | both hands | 两只手 | 他用＿＿拿着一个大箱子。
张开 | zhāng kāi | to open (the hand, arms) | 使合着的东西分开 | 请＿＿手，让我看看你手里有什么。
`,
  },
  {
    theme: ["Buying Clothes", "买衣服"],
    data: `
试穿 | shì chuān | to try on | 买以前穿上看看 | 这件衣服我可以＿＿一下吗？
大号 | dà hào | large size | 大的尺码 | 这件衣服太小了，有没有＿＿的？
小号 | xiǎo hào | small size | 小的尺码 | 这件衣服太大了，有没有＿＿的？
戴上 | dài shang | to put on (a hat, glasses) | 戴到头、脸或手上 | 外面很冷，你＿＿帽子吧。 | 换上
鞋店 | xié diàn | shoe shop | 卖鞋的商店 | 我想买一双新鞋，我们去＿＿看看吧。
合身 | hé shēn | to fit well (of clothes) | 衣服的大小正好 | 这件衣服不大也不小，很＿＿。
双方 | shuāng fāng | both sides | 两个方面的人 | 这件事要问问＿＿的意见。
旧书 | jiù shū | second-hand book | 别人读过的书 | 这本＿＿很便宜，只要五块钱。
条件 | tiáo jiàn | condition | 要做到某件事需要的情况 | 这里的学习＿＿很好，有很多书。
换上 | huàn shang | to change into | 换好穿上 | 下班回家，他＿＿了旧衣服。
`,
  },
  {
    theme: ["Light and Shape", "光和样子"],
    data: `
蓝天 | lán tiān | blue sky | 蓝色的天空 | 今天天气真好，＿＿下有很多人在公园里玩。
红绿灯 | hóng lǜ dēng | traffic light | 路上告诉车和人走还是停的灯 | 到了前面的＿＿，往右走。
明亮 | míng liàng | bright, well-lit | 光线足 | 这个房间有大窗子，很＿＿。
天亮 | tiān liàng | daybreak | 天开始发光的时候 | 他睡到＿＿才醒。
双人床 | shuāng rén chuáng | double bed | 两个人睡的床 | 这个房间有一张＿＿，可以住两个人。
合作 | hé zuò | to cooperate | 一起工作 | 我们两个人＿＿得很好。
短期 | duǎn qī | short-term | 时间短的 | 我来中国是＿＿学习，只学三个月。
合上 | hé shang | to close (a book, the eyes) | 闭上 | 请＿＿书，我们来考试。
适用 | shì yòng | applicable, suitable for use | 可以用 | 这本书很＿＿，大学生和中学生都能用。
长裙 | cháng qún | long skirt | 长的裙子 | 她穿着一条白色的＿＿，真漂亮。
`,
  },
  {
    theme: ["At the Restaurant", "在饭馆"],
    data: `
饭馆 | fàn guǎn | restaurant | 卖饭菜的店 | 这家＿＿的菜很好吃。
服务员 | fú wù yuán | waiter, attendant | 在饭店等地方为客人做事的人 | ＿＿，请给我们一杯水。
菜单 | cài dān | menu | 写着菜名和价钱的单子 | 请给我看看＿＿，我想点菜。
点菜 | diǎn cài | to order food | 告诉服务员要吃什么 | 你们想吃什么？可以＿＿了。
买单 | mǎi dān | to pay the bill | 吃完饭以后付钱 | 服务员，我们吃好了，＿＿！
碗 | wǎn | bowl | 盛饭的器具 | 我吃了两＿＿米饭。 | 瓶
筷子 | kuài zi | chopsticks | 吃饭用的两根细棍 | 中国人吃饭用＿＿。
盘子 | pán zi | plate | 放菜的器具 | 桌上有一个＿＿，里面是鱼。 | 碗
瓶 | píng | bottle (as a measure) | 用于口小肚大的容器装的东西 | 我想买一＿＿水。 | 碗
汤 | tāng | soup | 做菜时煮出来的汁水 | 我想喝一碗热＿＿。
`,
  },
  {
    theme: ["Tastes", "味道"],
    data: `
甜 | tián | sweet | 像糖的味道 | 我喜欢吃糖，因为糖很＿＿。
辣 | là | spicy | 嘴里像火烧一样的味道 | 我不能吃太＿＿的菜，吃了要喝很多水。
酸奶 | suān nǎi | yogurt | 一种有酸味的牛奶食品 | 早上我喜欢喝一杯＿＿。 | 咖啡
苦 | kǔ | bitter | 像药的味道 | 这个药很＿＿，我不想吃。
香 | xiāng | fragrant | 气味好闻 | 妈妈做的饭真＿＿，我还没进门就知道是什么菜了。
渴 | kě | thirsty | 口干想喝水 | 我＿＿了，想喝一杯水。
饱 | bǎo | full (after eating) | 吃够了 | 我吃＿＿了，不想再吃了。
饺子 | jiǎo zi | dumplings | 用面皮包着肉或菜的食品 | 过年的时候，北方人喜欢吃＿＿。
啤酒 | pí jiǔ | beer | 一种用麦子做的酒 | 爸爸不喝白酒，只喝＿＿。 | 咖啡
咖啡 | kā fēi | coffee | 一种黑色的、喝了不想睡觉的热饮 | 早上我要喝一杯＿＿，不然上班的时候想睡觉。 | 啤酒 酸奶
`,
  },
  {
    theme: ["Fruit and Meat", "水果和肉"],
    data: `
苹果 | píng guǒ | apple | 一种圆的、红色或绿色的水果 | 我每天吃一个＿＿。 | 西瓜 羊肉 黄瓜
西瓜 | xī guā | watermelon | 夏天吃的大水果，里面是红的 | 夏天很热，我们吃一个大＿＿吧。 | 苹果
新鲜 | xīn xiān | fresh | 刚出产的，没有变坏的 | 这些鱼很＿＿，是今天早上买的。
羊肉 | yáng ròu | mutton, lamb | 羊身上的肉 | 冬天很冷，北方人喜欢吃＿＿。 | 猪肉 苹果
猪肉 | zhū ròu | pork | 猪身上的肉 | 中国人做饺子常用＿＿。 | 羊肉 黄瓜
刀 | dāo | knife | 切东西的工具 | 这把＿＿很快，你要小心。
够 | gòu | enough | 满足需要 | 三个菜＿＿了，我们只有两个人。
饮料 | yǐn liào | drink, beverage | 可以喝的东西 | 你想喝什么＿＿？
黄瓜 | huáng guā | cucumber | 一种长条的绿色蔬菜 | 这个＿＿是绿色的，很新鲜。 | 猪肉 西瓜
能够 | néng gòu | to be able to | 有能力做 | 他已经＿＿说很多汉语了。
`,
  },
  {
    theme: ["Cooking", "做饭"],
    data: `
糖 | táng | sugar | 甜的东西 | 你的咖啡里要放＿＿吗？
甜点 | tián diǎn | dessert | 饭后吃的甜的东西 | 吃完饭，我们再来一个＿＿吧。 | 小吃
洗碗 | xǐ wǎn | to do the dishes | 把吃饭用的器具弄干净 | 妈妈做饭，我＿＿。
鸡汤 | jī tāng | chicken soup | 用鸡做的汤 | 妈妈做了一碗＿＿，里面有很多鸡肉。
酸甜 | suān tián | sweet and sour | 又酸又甜 | 这个菜＿＿，很好吃。
香菜 | xiāng cài | coriander | 一种有特别香味的菜 | 我不喜欢＿＿，请不要放在汤里。 | 糖
吃饱 | chī bǎo | to eat one's fill | 吃得够了 | 你＿＿了吗？还要不要米饭？
菜刀 | cài dāo | kitchen knife | 切菜用的刀 | 做饭要用＿＿，小心手。
小吃 | xiǎo chī | snacks | 量少的、不是正餐的食物 | 北京有很多好吃的＿＿。
香水 | xiāng shuǐ | perfume | 气味好闻的水，用在身上 | 她每天出门前都在身上用一点＿＿。
`,
  },
  {
    theme: ["Eating Out", "出去吃"],
    data: `
咖啡馆 | kā fēi guǎn | café | 卖咖啡、可以坐下来喝的店 | 我们去＿＿喝一杯咖啡吧。 | 茶馆
茶馆 | chá guǎn | teahouse | 卖茶、可以坐下来喝茶的店 | 爷爷每天下午都去＿＿喝茶。 | 咖啡馆
服务 | fú wù | service | 为别人做事 | 这家饭店的菜很好吃，＿＿也很好。
员工 | yuán gōng | staff, employee | 在公司、商店等地方工作的人 | 这家商店有二十个＿＿。
单人 | dān rén | single (for one person) | 一个人用的 | 我一个人住，要一个＿＿房间。
苦瓜 | kǔ guā | bitter melon | 一种吃起来很苦的绿色蔬菜 | 很多孩子不喜欢吃＿＿，因为太苦了。
糖果 | táng guǒ | sweets, candy | 用糖做的小食品 | 孩子们都喜欢吃＿＿。
瓶子 | píng zi | bottle | 口小肚大的容器 | 这个＿＿里没有水了。
汤面 | tāng miàn | noodle soup | 有汤的面条 | 天冷了，我想吃一碗热的＿＿。
鲜鱼 | xiān yú | fresh fish | 刚打上来的鱼 | 这家饭店的＿＿是今天早上才买的。
`,
  },
  {
    theme: ["Snacks and Markets", "小吃和市场"],
    data: `
名单 | míng dān | list of names | 写着人名的单子 | 老师，我的名字不在这个＿＿上。
吃苦 | chī kǔ | to bear hardship | 受苦，经得起困难 | 他很能＿＿，工作再累也不说。
香甜 | xiāng tián | sweet and fragrant | 又香又甜 | 这个西瓜真＿＿！ | 酸
茶杯 | chá bēi | teacup | 喝茶用的杯子 | 他把茶放在＿＿里。
早点 | zǎo diǎn | breakfast (snack) | 早上吃的东西 | 他每天早上在路上买＿＿吃。 | 点心
点心 | diǎn xin | pastry, snack | 量少的、吃着玩的食物 | 下午喝茶的时候，我们吃一点＿＿。
菜市场 | cài shì chǎng | food market | 卖菜、肉、鱼的市场 | 妈妈每天早上去＿＿买菜。
南瓜 | nán guā | pumpkin | 一种大的、黄色的瓜 | 这个＿＿是黄色的，很大。
店员 | diàn yuán | shop assistant | 商店里的工作人员 | 我问＿＿，这件衣服多少钱。
酸 | suān | sour | 像醋的味道 | 这个苹果还没长好，吃起来很＿＿。
`,
  },
  {
    theme: ["At the Company", "在公司"],
    data: `
公司 | gōng sī | company | 做生意的单位 | 我爸爸在一家大＿＿工作。
经理 | jīng lǐ | manager | 公司里管事的人 | 我们公司的＿＿人很好，常常请我们吃饭。 | 同事
办公室 | bàn gōng shì | office | 工作的房间 | 我们的＿＿在三层，很大。
会议 | huì yì | meeting | 很多人一起讨论问题的会 | 明天上午公司有一个＿＿，大家都要来。
职业 | zhí yè | occupation | 人做的工作 | “你的＿＿是什么？”“我是老师。”
加班 | jiā bān | to work overtime | 下班以后接着工作 | 这几天工作太多，我每天都要＿＿。
介绍 | jiè shào | to introduce | 使双方认识 | 我来＿＿一下，这是我的朋友小张。
欢迎 | huān yíng | welcome | 高兴地接待 | ＿＿你来我们家！
办 | bàn | to do, to handle | 做，处理 | 这件事很难＿＿，我们要想一想。
同事 | tóng shì | colleague | 在一起工作的人 | 他是我的＿＿，我们在一个公司工作。
`,
  },
  {
    theme: ["Office Work", "办公"],
    data: `
电脑 | diàn nǎo | computer | 能算数、上网的电子机器 | 我每天用＿＿工作。
上网 | shàng wǎng | to go online | 进入互联网 | 我每天晚上都＿＿看电影。 | 网上
网上 | wǎng shang | online, on the internet | 在互联网里 | 这本书我是在＿＿买的。 | 上网
接 | jiē | to pick up, to meet | 到某地去迎人 | 我去机场＿＿朋友。
发 | fā | to send | 送出 | 我到了北京就给你＿＿短信。
短信 | duǎn xìn | text message | 用手机送出的短的文字 | 我给你发了一个＿＿，你看了吗？
信 | xìn | letter | 写给别人的书面的话 | 我每个月都给爷爷写＿＿。 | 短信
纸 | zhǐ | paper | 写字用的薄片 | 请给我一张＿＿，我想写几个字。 | 笔
笔 | bǐ | pen | 写字的工具 | 我没带＿＿，可以用一下你的吗？我想写几个字。 | 纸
页 | yè | page | 书本中的一面 | 请打开书，看第十＿＿。
`,
  },
  {
    theme: ["Words and Mistakes", "词和错"],
    data: `
生词 | shēng cí | new word | 不认识的词 | 这一课有二十个＿＿，我都要记住。
错 | cuò | wrong | 不对 | 对不起，我说＿＿了，他不是我哥哥，是我弟弟。
不错 | bù cuò | not bad, pretty good | 好 | 你的汉语说得＿＿！
没错 | méi cuò | that's right | 对 | “你是张老师吗？”“＿＿，我就是。”
错过 | cuò guò | to miss (a chance, a train) | 没有赶上 | 快走吧，不然就＿＿火车了。
接着 | jiē zhe | next, then | 紧跟着前面的 | 他吃完饭，＿＿就去上班了。
发现 | fā xiàn | to discover | 看到或找到以前不知道的 | 我回到家才＿＿手机不在包里。
发生 | fā shēng | to happen | 出现原来没有的事 | 这里＿＿了什么事？为什么有这么多人？
信心 | xìn xīn | confidence | 相信自己能做好的心 | 我对明天的考试很有＿＿。
回信 | huí xìn | to write back | 收到信以后写信回答 | 他给我写了信，我还没给他＿＿。
`,
  },
  {
    theme: ["Time and Effort", "时间和努力"],
    data: `
点钟 | diǎn zhōng | o'clock | 表示整点的时间 | 现在是下午三＿＿。
分钟 | fēn zhōng | minute | 一小时的六十分之一 | 从我家到学校走路要十＿＿。
一刻 | yī kè | a quarter of an hour | 十五分 | 现在是八点＿＿，还有一个小时才上课。
迟到 | chí dào | to be late | 比规定的时间晚来 | 他今天早上起晚了，上课＿＿了。
差 | chà | to be short of | 不够，还没到 | 现在＿＿五分八点，我们快走吧。
讲 | jiǎng | to explain | 说明，解释 | 老师给我们＿＿了这个字的意思。
懂 | dǒng | to understand | 知道，明白 | 这个问题太难了，我不＿＿。
帮助 | bāng zhù | help; to help | 替别人出力 | 谢谢你的＿＿，没有你我做不完。
努力 | nǔ lì | to work hard | 用心尽力 | 他学习很＿＿，每天学到很晚。
留 | liú | to stay | 停在某处不离开 | 星期天我不回家，＿＿在学校。
`,
  },
  {
    theme: ["Learning at Work", "在工作中学习"],
    data: `
力气 | lì qi | physical strength | 身体的劲儿 | 他很有＿＿，一个人就能搬这个大箱子。 | 能力
能力 | néng lì | ability | 能做好事情的本领 | 他的工作＿＿很好，经理很喜欢他。
听懂 | tīng dǒng | to understand (by listening) | 听了以后明白 | 老师说得太快了，我没＿＿。 | 看懂
看懂 | kàn dǒng | to understand (by reading) | 看了以后明白 | 这本书太难了，我看了很多次也没＿＿。 | 听懂
留学 | liú xué | to study abroad | 到外国去学习 | 他想去中国＿＿，学习汉语。
讲话 | jiǎng huà | to give a speech | 在很多人面前说话 | 明天开学，校长要给大家＿＿。
差不多 | chà bu duō | almost, about the same | 相差很少 | 我们两个人＿＿高。
助手 | zhù shǒu | assistant | 帮助别人工作的人 | 他是经理的＿＿，帮经理做很多事。
理想 | lǐ xiǎng | ideal, dream | 对将来的希望 | 他的＿＿是成为一个医生。
道理 | dào lǐ | reason, sense | 事情的规律和理由 | 你说的话很有＿＿，我同意。
`,
  },
  {
    theme: ["Office Words", "办公室里的词"],
    data: `
网友 | wǎng yǒu | online friend | 在网上认识的朋友 | 我和他是＿＿，我们还没见过面。
网球 | wǎng qiú | tennis | 一种用拍子隔着网打的球 | 星期六我们去打＿＿吧。
头发 | tóu fa | hair | 人头上长的毛 | 她的＿＿很长，是黑色的。
出发 | chū fā | to set out | 离开原地到别的地方去 | 明天早上七点我们从学校＿＿，九点到机场。
直接 | zhí jiē | directly | 不经过别的 | 下了班，我不去别的地方，＿＿回家。
笔记 | bǐ jì | notes | 听课或读书时写下来的东西 | 上课的时候，他写了很多＿＿。 | 作业
词语 | cí yǔ | words and phrases | 词和短语 | 这一课的＿＿你都会读了吗？
理发 | lǐ fà | to have a haircut | 把头发剪短 | 你的头发太长了，该去＿＿了。
作业 | zuò yè | homework | 老师给学生的练习 | 今天的＿＿太多了，我写到十点才写完。
职员 | zhí yuán | office worker | 在公司或单位工作的人 | 他是这家公司的＿＿，在这里工作三年了。
`,
  },
  {
    theme: ["More Office Words", "更多办公室的词"],
    data: `
更加 | gèng jiā | even more | 表示程度又高了 | 下了雨，天气＿＿冷了。
加上 | jiā shang | plus, in addition | 再加 | 我们班有二十个学生，＿＿老师，有二十一个人。
办事 | bàn shì | to get things done | 做事，处理事情 | 他＿＿很认真，大家都放心。
商业 | shāng yè | commerce, business | 买卖东西的事业 | 这里是城市的＿＿中心，有很多商店。
迎接 | yíng jiē | to meet, to greet | 到某个地方去接 | 我们去机场＿＿新同学。 | 接到
接到 | jiē dào | to receive (a call, a letter) | 收到 | 我刚才＿＿了妈妈的电话。
钟头 | zhōng tóu | hour | 六十分 | 我每天学习两个＿＿汉语。
留下 | liú xià | to leave behind | 走的时候让东西或人留在原地 | 他走的时候＿＿了一本书。
讲课 | jiǎng kè | to lecture | 老师给学生上课 | 这个老师＿＿讲得很好，学生都喜欢听。
错字 | cuò zì | wrongly written character | 写得不对的字 | 你的作文里有三个＿＿。
`,
  },
  {
    theme: ["Jobs and Chances", "工作和机会"],
    data: `
笔记本 | bǐ jì běn | notebook | 写笔记用的本子 | 我买了一个新＿＿，上课的时候用。
司机 | sī jī | driver | 开车的人 | 他是出租车＿＿，每天开车送客人。
校长 | xiào zhǎng | head of a school | 一个学校的领导 | 我们学校的＿＿是一个老人，大家都认识他。
生意 | shēng yi | business, trade | 买卖 | 他爸爸是做＿＿的，有一家商店。
机会 | jī huì | opportunity | 好的时候 | 这是一个好＿＿，你一定不要错过。
出现 | chū xiàn | to appear | 显露出来 | 外面＿＿了一个人，我不认识他。
电子 | diàn zǐ | electronic | 用电的 | 现在很多人看＿＿书，不看纸的书了。
来自 | lái zì | to come from | 从某个地方来 | 我们班的学生＿＿十几个国家。
中间 | zhōng jiān | middle | 在两者之间 | 我坐在爸爸和妈妈＿＿。
知识 | zhī shi | knowledge | 人们在生活和工作中知道的东西 | 读书能让我们学到很多＿＿。
`,
  },
  {
    theme: ["Body Parts", "身体部位"],
    data: `
鼻子 | bí zi | nose | 闻气味、呼吸的器官 | 人的脸上有两只眼睛、一个＿＿和一张嘴。
嘴 | zuǐ | mouth | 吃东西、说话的器官 | 吃饭的时候，不要张着＿＿说话。 | 眼睛
腿 | tuǐ | leg | 人用来走路的身体部分 | 我走了一天的路，＿＿很累。
肚子 | dù zi | belly | 身体前面中部的部分 | 我吃得太多了，＿＿很不舒服。
眼睛 | yǎn jing | eye | 看东西的器官 | 她的＿＿很大，很漂亮。 | 嘴 脸
门口 | mén kǒu | doorway, entrance | 门的前面 | 我在学校＿＿等你。
牙 | yá | tooth | 嘴里咬东西的器官 | 我的＿＿很疼，吃东西的时候更疼。
脸 | liǎn | face | 头的前部 | 她的＿＿红了，她有点不好意思。
人口 | rén kǒu | population | 一个地方的人的多少 | 中国的＿＿很多。
口语 | kǒu yǔ | spoken language | 说话时用的语言 | 他的＿＿很好，但是写汉字不太好。
`,
  },
  {
    theme: ["Feeling Ill", "生病"],
    data: `
发烧 | fā shāo | to have a fever | 体温比平常高 | 他身体很热，可能＿＿了。 | 感冒
感冒 | gǎn mào | to catch a cold | 一种常见病，会头疼、发烧 | 天冷了，多穿点衣服，别＿＿了。 | 发烧
舒服 | shū fu | comfortable | 身体或心里感到好 | 这张床很＿＿，我睡得很好。
健康 | jiàn kāng | healthy | 身体好，没有病 | 爷爷八十岁了，身体还很＿＿。
肚子疼 | dù zi téng | stomachache | 身体前面中部疼 | 我吃了不新鲜的鱼，现在＿＿。 | 发烧
感觉 | gǎn jué | feeling; to feel | 觉得 | 你今天＿＿怎么样？好一点了吗？ | 感到
检查 | jiǎn chá | to examine | 仔细地看 | 医生给我＿＿了身体，说我没有病。 | 爱护
感到 | gǎn dào | to feel (a state) | 心里有某种感觉 | 他工作了一天，＿＿很累。 | 感觉
高烧 | gāo shāo | high fever | 很高的体温 | 他发了＿＿，要快点去医院。
爱护 | ài hù | to take good care of | 爱惜保护 | 我们要＿＿自己的眼睛，不要看太久的电视。 | 检查
`,
  },
  {
    theme: ["Size and Weight", "胖瘦和轻重"],
    data: `
胖 | pàng | fat | 身上的肉多 | 他每天吃很多肉，现在比以前＿＿了。 | 重
瘦 | shòu | thin | 身上的肉少 | 她生病以后吃得很少，现在很＿＿。 | 轻
重 | zhòng | heavy | 分量大 | 这个箱子太＿＿了，我一个人拿不了。 | 胖
轻 | qīng | light (in weight) | 分量小 | 这个包很＿＿，小孩子也能拿。 | 瘦
低 | dī | low | 从下到上距离小 | 这张桌子太＿＿了，他个子高，坐着很不舒服。
重要 | zhòng yào | important | 有很大的作用 | 健康是最＿＿的。
年轻 | nián qīng | young | 年纪不大 | 他很＿＿，才二十岁。
体重 | tǐ zhòng | body weight | 身体有多重 | 他太胖了，医生说他的＿＿太高了。
高低 | gāo dī | height (how high) | 高和低的情况 | 这两张桌子的＿＿不一样。
重新 | chóng xīn | anew, once more | 再一次，从头开始 | 这个字写错了，请你＿＿写一次。
`,
  },
  {
    theme: ["At the Doctor's", "看医生"],
    data: `
查 | chá | to look up | 翻看，找出来 | 这个字我不认识，要＿＿一下。
体检 | tǐ jiǎn | physical check-up | 检查身体 | 学校每年给学生做一次＿＿。
健身 | jiàn shēn | to work out | 使身体强健 | 他每天下班以后都去＿＿。
感谢 | gǎn xiè | to thank | 感激 | 非常＿＿你的帮助！
重病 | zhòng bìng | serious illness | 很重的病 | 爷爷得了＿＿，在医院里住了很久。
低头 | dī tóu | to lower one's head | 把头向下 | 他不好意思，＿＿不说话。
张嘴 | zhāng zuǐ | to open one's mouth | 把嘴打开 | 医生说：“请＿＿，我看看你的牙。” | 开口
大腿 | dà tuǐ | thigh | 腿的上部 | 他打了一天球，＿＿很疼。
胖子 | pàng zi | fat person | 很胖的人 | 他以前是个＿＿，现在瘦了很多。
开口 | kāi kǒu | to start to speak | 开始说话 | 他想说什么，但是不好意思＿＿。 | 张嘴
`,
  },
  {
    theme: ["Healthy Habits", "健康习惯"],
    data: `
一口 | yī kǒu | a mouthful | 嘴里放一次的量 | 这个菜太辣了，我只吃了＿＿。
出口 | chū kǒu | exit | 出去的门 | 地铁站的＿＿在哪里？
路口 | lù kǒu | intersection | 路和路相交的地方 | 到了前面的＿＿，往左走。 | 出口
查看 | chá kàn | to look over | 检查着看 | 出门前，他又＿＿了一下门关好了没有。
轻轻 | qīng qīng | gently, softly | 很轻地 | 孩子睡着了，你＿＿地走进去。
发冷 | fā lěng | to feel chilly | 身体感到冷 | 我有点＿＿，可能感冒了。
舒心 | shū xīn | contented | 心情舒服 | 他的新工作很＿＿，同事们都很好。
口头 | kǒu tóu | oral, spoken | 用说话的方式 | 老师说，这次是＿＿考试，不用写。
重点 | zhòng diǎn | key point | 重要的地方 | 这一课的＿＿是这十个生词。
感冒药 | gǎn mào yào | cold medicine | 治感冒的药 | 我感冒了，要吃＿＿。
`,
  },
  {
    theme: ["Travelling", "旅行"],
    data: `
旅游 | lǚ yóu | to go sightseeing | 到外地游玩 | 放假的时候，我们去北京＿＿吧。 | 旅行
旅行 | lǚ xíng | to travel; journey | 到远的地方去 | 他一个人开车去＿＿，走了很多地方。 | 旅游
宾馆 | bīn guǎn | hotel | 给客人住的地方 | 我们到了北京，先去＿＿放行李。
照片 | zhào piàn | photo | 照相做成的图片 | 这是我小时候的＿＿。
照相 | zhào xiàng | to take photos | 用相机拍下 | 这里的风景很美，我们在这里＿＿吧。
相机 | xiàng jī | camera | 照相用的机器 | 我的＿＿是新买的，照片很清楚。
行李 | xíng li | luggage | 出门带的箱子和包 | 你的＿＿太多了，我帮你拿吧。
地图 | dì tú | map | 画着地方和路的图 | 我不认识路，要看一下＿＿。
订 | dìng | to book | 预先约定 | 我已经＿＿好了飞机票。
护照 | hù zhào | passport | 出国用的证件 | 出国坐飞机一定要带＿＿，不然不能上飞机。
`,
  },
  {
    theme: ["Sights and Rides", "风景和车"],
    data: `
风景 | fēng jǐng | scenery | 自然的景色 | 这里的＿＿很美，很多人来这里照相。
离 | lí | (distance) from | 相距 | 我家＿＿学校很近。
骑 | qí | to ride (a bike, a horse) | 两腿跨坐在上面 | 我每天＿＿自行车上学。
自行车 | zì xíng chē | bicycle | 两个轮子、用脚踩的车 | 我的＿＿是红色的，骑起来很快。
辆 | liàng | (measure word for vehicles) | 用于车 | 门口停着一＿＿出租车。
停 | tíng | to stop | 不再动 | 雨＿＿了，我们出去吧。
停车 | tíng chē | to park | 把车停下来 | 这里不能＿＿，请开走。
线 | xiàn | line, route | 车走的路 | 我坐地铁一号＿＿去公司。
拍照 | pāi zhào | to take a picture | 照相 | 这里不能＿＿，请把相机放下。
遍 | biàn | (measure word for times, from start to end) | 从头到尾一次 | 这本书我看了三＿＿。
`,
  },
  {
    theme: ["Plans and Holidays", "计划和假期"],
    data: `
全部 | quán bù | all, whole | 所有的 | 我的钱＿＿用完了。 | 完全
到处 | dào chù | everywhere | 各个地方 | 过年的时候，＿＿都是人。
遇到 | yù dào | to come across | 碰到 | 我在路上＿＿了我的老师。
放假 | fàng jià | to have a holiday | 学校或单位停止上课或工作 | 学校下个星期＿＿，我要回家。
假期 | jià qī | holiday period | 放假的时候 | 这个＿＿你想去哪里玩？
世界 | shì jiè | world | 地球上所有的地方 | 他想去看看＿＿上所有的国家。
计划 | jì huà | plan | 做事以前想好的打算 | 你明年有什么＿＿？
清楚 | qīng chu | clear | 明白，容易看懂或听懂 | 老师讲得很＿＿，我都听懂了。
完全 | wán quán | completely | 一点不差 | 你说得＿＿对。
安全 | ān quán | safe | 没有危险 | 晚上一个人走路不＿＿，我送你回家吧。
`,
  },
  {
    theme: ["Getting Around", "出行"],
    data: `
离开 | lí kāi | to leave | 从某个地方走开 | 他十八岁就＿＿了家，去北京上大学。
乘客 | chéng kè | passenger | 坐车、船、飞机的人 | 这辆车上有二十个＿＿。 | 游客
全国 | quán guó | the whole country | 一个国家的所有地方 | 新年的时候，＿＿的人都放假。
部分 | bù fen | part | 整体里的一些 | 这个问题的第一＿＿很难。
好处 | hǎo chù | benefit | 对人有利的地方 | 多走路对身体有很多＿＿。
请假 | qǐng jià | to ask for leave | 请求不上班或不上课 | 我病了，要跟老师＿＿。
游客 | yóu kè | tourist | 来旅游的人 | 夏天来长城的＿＿很多。 | 乘客
行 | xíng | OK, all right | 可以 | “明天三点见，好吗？”“＿＿，没问题。”
图片 | tú piàn | picture | 图画和照片 | 这本书里有很多＿＿，孩子们很喜欢。
订票 | dìng piào | to book tickets | 预先买票 | 过年回家的人很多，要早一点＿＿。
`,
  },
  {
    theme: ["Seeing the World", "看世界"],
    data: `
划船 | huá chuán | to row a boat | 用桨使船前进 | 夏天，我们在公园里＿＿。
遇见 | yù jiàn | to run into | 碰见 | 昨天我在商店里＿＿了一个老同学。
全家 | quán jiā | the whole family | 一家所有的人 | 过年的时候，我们＿＿一起吃饭。
全身 | quán shēn | the whole body | 身体的每个部分 | 下了大雨，我＿＿都是水。
景点 | jǐng diǎn | scenic spot | 好看的、游客常去的地方 | 长城是北京最有名的＿＿。
旅客 | lǚ kè | traveller | 旅行的人 | 飞机场里有很多＿＿在等飞机。
行人 | xíng rén | pedestrian | 在路上走的人 | 路上的＿＿很多，开车要小心。 | 旅客
相同 | xiāng tóng | identical | 一样 | 我们两个人的名字＿＿，都叫小明。
东部 | dōng bù | eastern part | 东边的部分 | 这个国家的＿＿人很多，西部人很少。
住处 | zhù chù | place to live | 住的地方 | 我在北京还没有找到＿＿，现在住在宾馆。
`,
  },
  {
    theme: ["On the Road", "在路上"],
    data: `
部门 | bù mén | department | 单位里的一个部分 | 他在公司的哪个＿＿工作？
清水 | qīng shuǐ | clear water | 干净的水 | 洗菜要用＿＿。
看清 | kàn qīng | to see clearly | 看得清楚 | 我没＿＿他的脸，他走得太快了。
订单 | dìng dān | order (of goods) | 买东西时订的单子 | 我在网上买了一本书，这是我的＿＿。
线上 | xiàn shàng | online | 在网上 | 这个课是＿＿的，在家里用电脑就能上。
拍手 | pāi shǒu | to clap | 两只手打在一起 | 他唱得很好，大家都＿＿。
骑车 | qí chē | to ride a bike | 骑自行车 | 我每天＿＿上班，不坐地铁。
图书馆 | tú shū guǎn | library | 放很多书、可以借书的地方 | 我常去学校的＿＿看书。
假日 | jià rì | day off | 放假的日子 | ＿＿的时候，公园里人很多。
全年 | quán nián | the whole year | 一年里的所有时间 | 这里＿＿都很热，没有冬天。
`,
  },
  {
    theme: ["Trips", "行程"],
    data: `
起飞 | qǐ fēi | to take off | 飞机离开地面飞起来 | 飞机十点＿＿，我们要早点去机场。
乘坐 | chéng zuò | to ride (a vehicle) | 坐 | 请＿＿地铁二号线去机场。
门票 | mén piào | admission ticket | 进门用的票 | 这个公园的＿＿是十块钱。
地点 | dì diǎn | place, location | 事情发生的地方 | 明天开会的时间和＿＿，我都写在这里了。
起点 | qǐ diǎn | starting point | 开始的地方 | 这辆车的＿＿是火车站，我们从那里上车。
晚点 | wǎn diǎn | to be delayed | 比规定的时间晚 | 下大雪了，飞机＿＿了两个小时。 | 正点
正点 | zhèng diǎn | on schedule | 按规定的时间 | 今天天气很好，火车＿＿到了北京。 | 晚点
公里 | gōng lǐ | kilometre | 长度单位，一千米 | 我家离公司有十＿＿。
对面 | duì miàn | opposite | 对着的那一边 | 学校的＿＿有一个公园。
行李箱 | xíng li xiāng | suitcase | 放行李的箱子 | 我的＿＿太重了，你能帮我拿一下吗？
`,
  },
  {
    theme: ["How You Feel", "心情"],
    data: `
高兴 | gāo xìng | glad | 心里很开心 | 见到你，我很＿＿！ | 快乐
快乐 | kuài lè | happy | 开心，满足 | 新年＿＿！ | 高兴
笑 | xiào | to laugh, to smile | 脸上露出开心的样子 | 他说的话很好玩，大家都＿＿了。 | 哭
哭 | kū | to cry | 难过得流眼泪 | 孩子找不到妈妈，＿＿了。 | 笑 怕
怕 | pà | to be afraid of | 觉得危险，心里不安 | 这个孩子很＿＿黑，晚上要开着灯睡觉。 | 担心
希望 | xī wàng | to hope | 心里想着将来能这样 | 我＿＿明年能去中国学习。 | 愿意
愿意 | yuàn yì | to be willing | 同意去做某事 | 你＿＿和我一起去吗？ | 希望
心情 | xīn qíng | mood | 心里的感觉 | 今天天气很好，我的＿＿也很好。
担心 | dān xīn | to worry | 放心不下 | 孩子这么晚还没回家，妈妈很＿＿。 | 生气 怕
生气 | shēng qì | angry | 因为不满意而不开心 | 他又迟到了，老师很＿＿。 | 担心
`,
  },
  {
    theme: ["Strong Feelings", "强烈的感情"],
    data: `
害怕 | hài pà | afraid | 心里不安，觉得会出事 | 晚上一个人在家，她有点＿＿，把灯都打开了。 | 紧张 着急 急
着急 | zháo jí | anxious | 心里不安，想快一点 | 飞机快起飞了，他还没到机场，很＿＿。 | 急 紧张 害怕
紧张 | jǐn zhāng | nervous | 心里放松不下来 | 明天要考试了，我很＿＿。 | 害怕 着急 急
满意 | mǎn yì | satisfied | 觉得够好，合自己的心意 | 老师对我的作业很＿＿。
讨厌 | tǎo yàn | to dislike | 很不喜欢 | 我＿＿下雨天，不能出去玩。 | 害怕
难怪 | nán guài | no wonder | 明白了原因，不再觉得奇怪 | 他昨天晚上没睡觉，＿＿今天这么累。
哈哈 | hā hā | (sound of laughter) | 大笑的声音 | “＿＿，你说得太好玩了！”
啊 | a | (particle of exclamation) | 表示感叹的语气词 | 今天的天气多好＿＿！ | 呀
呀 | ya | (particle of surprise) | 表示惊奇的语气词 | 你怎么现在才来＿＿？ | 啊
急 | jí | in a hurry, anxious | 想马上做完 | 别＿＿，慢慢说。 | 着急 紧张
`,
  },
  {
    theme: ["Emotions", "感情"],
    data: `
爱情 | ài qíng | romantic love | 男女之间相爱的感情 | 这个电影讲的是＿＿，他们两个人非常相爱。 | 感情
热情 | rè qíng | warm, enthusiastic | 对人很好，很热心 | 这里的人很＿＿，常常请我去他们家吃饭。
感情 | gǎn qíng | affection | 对人的爱和关心 | 他们是十年的老朋友，＿＿很好。 | 事情
事情 | shì qing | matter, thing | 要做的事 | 我今天有很多＿＿要做。 | 感情
同情 | tóng qíng | to sympathize with | 对别人的难处有同样的感觉 | 他没有家，也没有钱，大家都很＿＿他。
笑话 | xiào hua | joke | 让人发笑的小故事 | 他讲了一个＿＿，大家都笑了。
可笑 | kě xiào | ridiculous | 让人觉得好笑的 | 他说的话太＿＿了，谁都不会相信。 | 可怕
可怕 | kě pà | scary | 让人害怕 | 这个电影太＿＿了，我晚上睡不着。 | 可笑
愿望 | yuàn wàng | wish | 心里希望的事 | 我的＿＿是以后当一名医生。
不满 | bù mǎn | dissatisfied | 觉得不够好，不开心 | 大家对这家饭馆的菜很＿＿，都说不好吃。
`,
  },
  {
    theme: ["Worry and Hope", "担心和希望"],
    data: `
怪 | guài | strange | 跟平常不一样，让人不明白 | 这个东西的样子很＿＿，我从来没见过。
满 | mǎn | full | 一点空的地方也没有 | 这个房间里坐＿＿了人。
紧 | jǐn | tight | 很小，不松 | 这条裤子太＿＿了，我穿不上。
要紧 | yào jǐn | serious, important | 重要，严重 | 没关系，这点小病不＿＿。
急事 | jí shì | urgent matter | 要马上办的事 | 我有＿＿，要先走了。
看望 | kàn wàng | to visit (a person) | 到别人那里去看他 | 星期六我去医院＿＿生病的朋友。
自愿 | zì yuàn | voluntary | 自己愿意 | 没有人叫他去，他是＿＿去的。
大笑 | dà xiào | to laugh out loud | 很大声地笑 | 听了他的话，大家都＿＿起来。
心中 | xīn zhōng | in one's heart | 心里 | 他一直把妈妈的话记在＿＿。
情人 | qíng rén | sweetheart | 相爱的人 | 他们是一对＿＿，每天都在一起。
`,
  },
  {
    theme: ["Feelings in Words", "说感情"],
    data: `
紧急 | jǐn jí | urgent | 非常急，要马上去办 | 有人病了，事情很＿＿，快叫医生！
急忙 | jí máng | hurriedly | 很快地，急着 | 下雨了，他＿＿跑回家。
满分 | mǎn fēn | full marks | 最高的分数 | 这次考试他得了＿＿，一个题也没错。
怪不得 | guài bu de | no wonder | 难怪 | 他是中国人，＿＿他的中文这么好。
好笑 | hǎo xiào | funny | 让人想笑 | 他说的话很＿＿，大家都笑了。
欢乐 | huān lè | joyful | 快乐 | 过年的时候，家里很＿＿。
乐意 | lè yì | glad to | 愿意 | 我很＿＿帮助你。
天真 | tiān zhēn | innocent, naive | 像孩子一样单纯 | 这个孩子很＿＿，别人说什么他都相信。
害处 | hài chù | harm | 不好的地方 | 吃太多糖对身体有＿＿。
心急 | xīn jí | impatient | 想马上做好，等不了 | 别＿＿，饭一会儿就好。 | 急忙
`,
  },
  {
    theme: ["Getting Along", "和人相处"],
    data: `
难过 | nán guò | sad | 心里不好受 | 他没考好，心里很＿＿。
得意 | dé yì | pleased with oneself | 因为做得好而很满意 | 他考了第一名，＿＿地笑了。 | 自信
自信 | zì xìn | self-confident | 相信自己 | 他很＿＿，觉得自己一定能做好。 | 得意
开玩笑 | kāi wán xiào | to joke | 说好玩的话，不是真的 | 别生气，我是跟你＿＿的。
可爱 | kě ài | cute | 让人喜爱 | 这个小孩子很＿＿，大家都喜欢她。 | 友好
友好 | yǒu hǎo | friendly | 对人好，像朋友一样 | 这里的人对我们很＿＿。 | 可爱
明白 | míng bai | to understand | 知道是什么意思 | 你说的话我＿＿了。 | 同意
同意 | tóng yì | to agree | 觉得对，可以这样做 | 爸爸＿＿我一个人去旅行了。
好友 | hǎo yǒu | good friend | 很好的朋友 | 他是我的＿＿，我们认识十年了。
千万 | qiān wàn | by all means | 一定要 | 外面很冷，你＿＿要多穿点衣服。
`,
  },
  {
    theme: ["Landscape", "山水"],
    data: `
山 | shān | mountain | 地面上高起来的大块地方 | 这里的＿＿很高，我们走了三个小时才到上面。
海 | hǎi | sea | 地球上很大很大的一片咸水 | 我家住在＿＿边，每天都能看到大船。 | 河 湖 江
河 | hé | river | 地上流着的长长的水 | 这条＿＿里的水很清，能看到鱼。 | 江 湖 海
湖 | hú | lake | 四面是地的一大片水 | 公园里有一个小＿＿，我们可以去划船。 | 河 海 江
树 | shù | tree | 长得很高、有木头的植物 | 夏天很热，我们坐在大＿＿下面。 | 山
花 | huā | flower | 植物上开的好看的部分 | 妈妈过生日，我买了一些＿＿送给她。
草 | cǎo | grass | 地上长的绿色小植物 | 羊很喜欢吃＿＿。 | 花
鸟 | niǎo | bird | 有羽毛、会飞的动物 | 树上有一只小＿＿在唱歌。
云 | yún | cloud | 天上白色的一团一团的东西 | 天上的＿＿很白。 | 鸟
江 | jiāng | big river | 很大的河 | 长＿＿是中国最长的河。 | 河
`,
  },
  {
    theme: ["Animals", "动物"],
    data: `
狗 | gǒu | dog | 常养在家里、会看门的动物 | 我家的＿＿每天晚上都在门口看门。 | 猫
猫 | māo | cat | 会抓老鼠的小动物 | 这只小＿＿很喜欢吃鱼。 | 狗
马 | mǎ | horse | 能让人骑、跑得很快的大动物 | 他会骑＿＿，跑得很快。
动物 | dòng wù | animal | 能自己走来走去的生物 | 熊猫是很可爱的＿＿。
熊猫 | xióng māo | panda | 中国特有的黑白色的熊 | ＿＿是黑白色的，很可爱。 | 狗 猫
叶子 | yè zi | leaf | 树上长的绿色的片 | 秋天到了，树上的＿＿都黄了。
石头 | shí tou | stone | 很硬的东西，山上常有 | 这块＿＿很重，我拿不动。
太阳 | tài yáng | sun | 天上发光发热的星球 | ＿＿出来了，天亮了。 | 阳光
阳光 | yáng guāng | sunlight | 从太阳来的光 | 今天＿＿很好，我们出去走走吧。 | 太阳
动物园 | dòng wù yuán | zoo | 养着很多动物给人看的地方 | 星期天我们去＿＿看熊猫。
`,
  },
  {
    theme: ["Seasons", "季节"],
    data: `
季节 | jì jié | season | 一年分成的四个时期 | 一年有四个＿＿。
温度 | wēn dù | temperature | 冷热的程度 | 今天的＿＿是二十度。
暖和 | nuǎn huo | warm | 不冷也不热，很舒服 | 春天到了，天气＿＿了。 | 凉快
凉快 | liáng kuai | cool | 有一点冷，很舒服 | 秋天到了，天气＿＿了。 | 暖和
刮风 | guā fēng | to be windy | 风吹起来 | 外面在＿＿，多穿点衣服。
变化 | biàn huà | change | 跟以前不一样的地方 | 十年没回来，这里的＿＿很大。 | 变
树林 | shù lín | woods | 很多树长在一起的地方 | 我们在＿＿里走了一个小时。
度 | dù | degree | 量冷热的单位 | 今天很冷，只有三＿＿。
节日 | jié rì | festival | 过节的日子 | 春节是中国最重要的＿＿。
变 | biàn | to change | 成为不一样的 | 十年没见，他一点也没＿＿。 | 变化
`,
  },
  {
    theme: ["Outdoors", "户外"],
    data: `
上山 | shàng shān | to go up a mountain | 往山上走 | 我们早上六点就＿＿了，下午才下来。
海边 | hǎi biān | seaside | 靠近海的地方 | 夏天我们去＿＿玩水，看大船。 | 河边
河边 | hé biān | riverside | 靠近河的地方 | 晚饭以后，我们常去＿＿走走。 | 海边 花园 草地
花园 | huā yuán | garden | 种着花草的地方 | 我家后面有一个小＿＿，里面有很多花。
草地 | cǎo dì | lawn | 长满了草的地 | 孩子们在＿＿上玩。 | 马路
白云 | bái yún | white cloud | 白色的云 | 天上有很多＿＿。
大海 | dà hǎi | the sea | 很大的海 | 他住在山区，从来没有见过＿＿，也没有坐过船。 | 海边
花钱 | huā qián | to spend money | 用钱买东西 | 他很会＿＿，一个月的钱几天就用完了。
马路 | mǎ lù | road | 车走的大路 | 过＿＿的时候要小心车。
马上 | mǎ shàng | at once | 很快，立刻 | 你等一下，我＿＿就来。
`,
  },
  {
    theme: ["Natural World", "自然世界"],
    data: `
生物 | shēng wù | biology; living thing | 有生命的东西 | 我最喜欢上＿＿课，老师常给我们讲动物和花草。
动 | dòng | to move | 改变位置 | 别＿＿，我给你照相。
光线 | guāng xiàn | light | 照到一个地方的光 | 这个房间＿＿不好，在这里看书对眼睛不好。
四季 | sì jì | the four seasons | 春夏秋冬 | 这个地方＿＿都有花。
温暖 | wēn nuǎn | warm (also in feeling) | 暖和，让人舒服 | 妈妈的话让我觉得很＿＿。 | 动人
气温 | qì wēn | air temperature | 空气的冷热 | 今天的＿＿很高，有三十五度。
变成 | biàn chéng | to turn into | 成为 | 水到了零度就会＿＿冰。
文化 | wén huà | culture | 一个国家的历史、生活、艺术等 | 我很喜欢中国＿＿。
凉 | liáng | cool, cold | 有点冷 | 菜＿＿了，我去热一下。
动人 | dòng rén | moving, touching | 让人感动 | 她唱的歌很＿＿，很多人听哭了。
`,
  },
  {
    theme: ["Light and Height", "光和高度"],
    data: `
节 | jié | (measure word for classes) | 用于课 | 今天上午我有四＿＿课。
高度 | gāo dù | height | 高的程度 | 这张桌子的＿＿是一米。 | 长度
长度 | cháng dù | length | 长的程度 | 这条路的＿＿是五公里。 | 高度
光 | guāng | light | 让人能看见东西的亮 | 房间里没有＿＿，什么也看不见。 | 月光
月光 | yuè guāng | moonlight | 月亮的光 | 晚上，＿＿照在湖上，很美。 | 光
熊 | xióng | bear | 很大、很有力气的动物 | 山里有＿＿，晚上不要一个人上山。
山水 | shān shuǐ | landscape | 山和水的风景 | 这里的＿＿很美，有很多游客来照相。 | 风光
开花 | kāi huā | to bloom | 花开放 | 春天到了，树都＿＿了。
多云 | duō yún | cloudy | 天上云很多 | 今天＿＿，看不见太阳。
风光 | fēng guāng | scenery | 风景 | 春天的＿＿最美。 | 山水
`,
  },
  {
    theme: ["Sky and Earth", "天和地"],
    data: `
星星 | xīng xing | star | 晚上天上发光的小点 | 晚上天上有很多＿＿。
月亮 | yuè liang | the moon | 晚上天上最亮的那个 | 今天晚上的＿＿又大又亮。 | 星星
地球 | dì qiú | the earth | 我们住的星球 | 我们都住在＿＿上。
气候 | qì hòu | climate | 一个地方一年里的天气情况 | 这里的＿＿很好，不冷也不热。
小河 | xiǎo hé | stream | 不大的河 | 我家门口有一条＿＿，水很清。
花草 | huā cǎo | flowers and plants | 花和草 | 公园里的＿＿都很好看。
高山 | gāo shān | high mountain | 很高的山 | 那里有很多＿＿，开车很难上去。 | 火山
火山 | huǒ shān | volcano | 会喷出火的山 | 这个＿＿已经很多年没有动了。
山区 | shān qū | mountain area | 山多的地方 | 他在＿＿的学校当老师，那里路很不好走。
冰雪 | bīng xuě | ice and snow | 冰和雪 | 冬天，河上和山上到处都是＿＿。
`,
  },
  {
    theme: ["Rivers and Animals", "河流和动物"],
    data: `
黄河 | huáng hé | the Yellow River | 中国北部的一条大河 | ＿＿是中国第二长的河。
雪花 | xuě huā | snowflake | 下雪时天上落下的白色的片 | 天上下起了大片的＿＿。
小狗 | xiǎo gǒu | puppy | 小的狗 | 我家有一只＿＿，每天都在门口等我回家。 | 小猫
小猫 | xiǎo māo | kitten | 小的猫 | 这只＿＿很喜欢吃鱼。 | 小狗
马车 | mǎ chē | horse-drawn cart | 马拉的车 | 以前人们出门都坐＿＿。
山羊 | shān yáng | goat | 一种住在山上的羊 | 山上有很多＿＿在吃草。 | 小狗
海水 | hǎi shuǐ | seawater | 海里的水 | ＿＿不能喝。
湖边 | hú biān | lakeside | 靠近湖的地方 | 公园的＿＿有很多人在划船。
东北 | dōng běi | the northeast | 东和北中间的方向 | 中国的＿＿冬天很冷。
海关 | hǎi guān | customs | 检查出入国家的人和东西的地方 | 出国的时候要过＿＿。
`,
  },
  {
    theme: ["Sports", "运动"],
    data: `
运动 | yùn dòng | exercise, sport | 让身体动起来的活动 | 多做＿＿对身体好。
游泳 | yóu yǒng | to swim | 在水里游 | 天太热了，我们去河里＿＿吧。
跳舞 | tiào wǔ | to dance | 跟着音乐做动作 | 她很会＿＿，大家都说她跳得很美。
爬山 | pá shān | to climb a mountain | 往山上走 | 星期天我们去＿＿，走了三个小时才到上面。
篮球 | lán qiú | basketball | 用手把球投进篮里的运动 | 他个子很高，＿＿打得很好。
足球 | zú qiú | football | 用脚踢的球 | 他每天下午都去踢＿＿。
比赛 | bǐ sài | match, competition | 比谁做得好 | 明天学校有足球＿＿，我们一起去看吧。
踢 | tī | to kick | 用脚碰 | 他＿＿了一下球，球进了门。
练习 | liàn xí | to practise | 反复地做，学会它 | 学中文要多＿＿说话。
跳 | tiào | to jump | 两只脚离开地面向上 | 这个孩子能＿＿得很高。
`,
  },
  {
    theme: ["Training", "训练"],
    data: `
队 | duì | team | 一起比赛的一群人 | 他是我们足球＿＿的。 | 球队
输 | shū | to lose | 比赛没有赢 | 我们队＿＿了，大家都很难过。 | 赢
赢 | yíng | to win | 比赛比对方好 | 我们队＿＿了，大家都很高兴。 | 输
锻炼 | duàn liàn | to work out | 运动，让身体好 | 爷爷每天早上都去公园＿＿身体。
拉 | lā | to pull | 用力让东西向自己这边来 | 门上写着“推”，你别＿＿了。 | 推
推 | tuī | to push | 用力让东西向前去 | 车开不动了，我们下来＿＿吧。 | 拉
参加 | cān jiā | to take part in | 加入一个活动 | 我想＿＿学校的足球比赛。
坚持 | jiān chí | to keep on | 不停地做下去 | 学中文要＿＿，每天学一点。
球队 | qiú duì | (ball) team | 一起打球的队 | 这个＿＿有十一个人。 | 队
运动员 | yùn dòng yuán | athlete | 参加体育比赛的人 | 他是一名足球＿＿。
`,
  },
  {
    theme: ["Games and Moves", "比赛和动作"],
    data: `
跳高 | tiào gāo | high jump | 往上跳过一根杆的运动 | 他个子高，＿＿跳得很好。 | 跳远
跳远 | tiào yuǎn | long jump | 往前跳得越远越好的运动 | 他跑得快，＿＿能跳五米。 | 跳高
舞会 | wǔ huì | dance party | 大家一起跳舞的晚会 | 晚上学校有一个＿＿，大家都要去跳舞。
爬 | pá | to crawl, to climb | 手和脚一起向前动 | 孩子还不会走，只会在地上＿＿。
不足 | bù zú | not enough | 不够 | 我的钱＿＿，买不了这个。
球赛 | qiú sài | ball game | 打球或踢球的比赛 | 昨天晚上的＿＿太好看了。 | 舞会
踢球 | tī qiú | to play football | 用脚玩球 | 下课以后，男孩子们都去＿＿。
运气 | yùn qi | luck | 碰到好事或坏事的机会 | 他的＿＿真好，一出门就打到了出租车。
队长 | duì zhǎng | team captain | 一个队的头 | 他是我们球队的＿＿。
拉开 | lā kāi | to pull open | 拉着打开 | 请把门＿＿。
`,
  },
  {
    theme: ["Keeping Fit", "健身"],
    data: `
推开 | tuī kāi | to push open | 推着打开 | 他＿＿门走了进来。
运动场 | yùn dòng chǎng | sports ground | 做运动的地方 | 学校的＿＿很大，下课后很多学生在那里踢球。
足够 | zú gòu | enough | 多得够用 | 我们有＿＿的时间，不用急。
跳水 | tiào shuǐ | to dive | 从高的地方跳进水里 | 他是＿＿运动员，能从十米高的地方跳下来。
赛跑 | sài pǎo | to race | 比谁跑得快 | 我们来＿＿，看谁先到。
练 | liàn | to practise | 多次地做 | 他每天＿＿两个小时的字。
拉肚子 | lā dù zi | to have diarrhoea | 肚子不舒服，常常上厕所 | 他吃了不干净的东西，＿＿了。
推迟 | tuī chí | to postpone | 把时间往后改 | 下雨了，比赛要＿＿到明天。
坚定 | jiān dìng | firm | 不会改变的 | 他很＿＿地说：“我一定要去。”
运 | yùn | to transport | 把东西从一个地方送到另一个地方 | 这些东西要用车＿＿到北京去。
`,
  },
  {
    theme: ["Players", "运动员"],
    data: `
球员 | qiú yuán | player | 球队里的人 | 这个球队有很多好＿＿。 | 队员
队员 | duì yuán | team member | 队里的人 | 我们队有十个＿＿。 | 球员
比分 | bǐ fēn | score | 比赛中两边得的分 | 现在的＿＿是二比一。
输赢 | shū yíng | winning or losing | 输和赢 | 比赛的＿＿不重要，开心就好。 | 比分
第一名 | dì yī míng | first place | 最好的那一个 | 他跑得最快，得了＿＿。
骑马 | qí mǎ | to ride a horse | 坐在马上走 | 我第一次＿＿，有点害怕。
用力 | yòng lì | to put effort into | 用很大的力气 | 门太重了，要＿＿推。 | 全力
全力 | quán lì | all one's strength | 所有的力气 | 比赛的时候，大家都用了＿＿。 | 用力
动作 | dòng zuò | movement | 身体的动 | 他跳舞的＿＿很美。
进行 | jìn xíng | to be in progress | 正在做 | 比赛正在＿＿，请不要说话。
`,
  },
  {
    theme: ["News and Shows", "新闻和节目"],
    data: `
节目 | jié mù | programme, show | 电视上或台上演的东西 | 这个电视＿＿很好看，我每个星期都看。 | 新闻 演出
新闻 | xīn wén | news | 新近发生的事情的报道 | 爸爸每天晚上都看电视＿＿。 | 节目 演出 直播
报纸 | bào zhǐ | newspaper | 每天印出来的新闻纸 | 这张＿＿上有很多新闻。 | 杂志
故事 | gù shi | story | 讲出来的事情 | 妈妈每天晚上给孩子讲＿＿。
杂志 | zá zhì | magazine | 定期出的一本一本的读物 | 这本＿＿每个月出一次。 | 报纸
声音 | shēng yīn | sound, voice | 耳朵听到的东西 | 你说话的＿＿太小了，我听不见。
音乐 | yīn yuè | music | 唱的歌和弹的曲子 | 我一边听＿＿一边做作业，歌很好听。 | 声音
演员 | yǎn yuán | actor | 演电影或戏的人 | 她是一个有名的电影＿＿。
演出 | yǎn chū | performance | 在台上给人看的表演 | 今天晚上有一场＿＿，很多有名的演员都来了。 | 节目 直播
直播 | zhí bō | live broadcast | 一边发生一边在电视上放 | 这场足球比赛电视上正在＿＿。
`,
  },
  {
    theme: ["Chatting Online", "网上聊天"],
    data: `
号码 | hào mǎ | number | 用来找到人或东西的数字 | 你的电话＿＿是多少？
聊天 | liáo tiān | to chat | 随便说说话 | 我们一边喝茶一边＿＿。 | 谈
微信 | wēi xìn | WeChat | 中国人常用的手机通信软件 | 我加你的＿＿吧。 | 号码
句子 | jù zi | sentence | 一句一句的话 | 请用这个词说一个＿＿。
讨论 | tǎo lùn | to discuss | 大家一起说自己的想法 | 大家一起＿＿一下，每个人都说说自己的意见。 | 谈 聊天
简单 | jiǎn dān | simple | 不难，容易 | 这个问题很＿＿，我一下就做完了。
复习 | fù xí | to review | 再学一次学过的东西 | 明天要考试，我今天晚上要＿＿。
谈 | tán | to talk | 说话，讨论 | 我们＿＿了一个下午，说了很多事。 | 聊天 讨论
内容 | nèi róng | content | 里面有的东西 | 这本书的＿＿很有意思。
回复 | huí fù | to reply | 回答别人的信或信息 | 我给他发了信息，他还没＿＿我。
`,
  },
  {
    theme: ["Words and Talk", "说话"],
    data: `
谈话 | tán huà | to have a talk | 两个人或几个人说话 | 老师找我＿＿，问我为什么迟到。
微笑 | wēi xiào | to smile | 不出声地笑 | 她见到人都会＿＿。
句 | jù | (measure word for sentences) | 用于话 | 他只说了一＿＿话就走了。
复杂 | fù zá | complicated | 不简单 | 这个问题太＿＿了，我想不明白。
重复 | chóng fù | to repeat | 再说一次或再做一次 | 我没听清楚，请你再＿＿一遍。
以内 | yǐ nèi | within | 在一定的范围里 | 请在十分钟＿＿做完。
国内 | guó nèi | domestic | 一个国家的里面 | 他还没出过国，只在＿＿旅游过。
简直 | jiǎn zhí | simply | 完全，真是 | 这里的风景＿＿太美了！
目的 | mù dì | purpose | 想要做到的事 | 你来中国的＿＿是什么？
题目 | tí mù | question (in a test) | 考试或练习里的问题 | 这次考试的＿＿很难。
`,
  },
  {
    theme: ["Voices", "声音"],
    data: `
报名 | bào míng | to sign up | 把名字写上，参加 | 我想参加比赛，已经＿＿了。
大声 | dà shēng | loudly | 声音很大 | 请＿＿一点，我听不见。 | 小声
小声 | xiǎo shēng | quietly | 声音很小 | 孩子在睡觉，请＿＿说话。 | 大声
笑声 | xiào shēng | laughter | 笑的声音 | 房间里都是孩子们的＿＿。 | 歌声
歌声 | gē shēng | singing | 唱歌的声音 | 她的＿＿很美，大家都喜欢听她唱歌。 | 笑声 发音
发音 | fā yīn | pronunciation | 说话时发出的音 | 学中文，＿＿很重要。 | 口音
口音 | kǒu yīn | accent | 一个地方的人说话的特点 | 他说话有南方＿＿。 | 发音
演唱会 | yǎn chàng huì | concert (of songs) | 歌手给很多人唱歌的活动 | 我买了两张＿＿的票。
故意 | gù yì | on purpose | 有心这样做 | 对不起，我不是＿＿的。
播放 | bō fàng | to broadcast, to play | 在电视或电脑上放 | 电视上正在＿＿新闻。
`,
  },
  {
    theme: ["Media Words", "媒体"],
    data: `
歌手 | gē shǒu | singer | 唱歌的人 | 她是一个有名的＿＿，唱歌很好听。
音乐会 | yīn yuè huì | concert | 给人听音乐的活动 | 今天晚上我们去听＿＿。
日报 | rì bào | daily paper | 每天出的报纸 | ＿＿就是每天都出的报纸。
网站 | wǎng zhàn | website | 网上的一个地方 | 你可以在这个＿＿上买东西。
信息 | xìn xī | message, information | 告诉人的消息 | 我给你发了一条＿＿，你看到了吗？
对话 | duì huà | dialogue | 两个人的说话 | 请你们两个人练习这个＿＿。
说明 | shuō míng | explanation | 讲清楚怎么用的话 | 这个东西怎么用？你看一下＿＿书吧。
方面 | fāng miàn | aspect, side | 事情的一个部分 | 他在学习＿＿做得很好。
区别 | qū bié | difference | 不一样的地方 | 这两个字有什么＿＿？ | 作用
作用 | zuò yòng | effect | 对别的东西的影响 | 这个药没有＿＿，我吃了还是很疼。
`,
  },
  {
    theme: ["Festivals", "节日"],
    data: `
礼物 | lǐ wù | gift | 送给别人的东西 | 这是我送给你的生日＿＿。 | 蛋糕
祝 | zhù | to wish | 希望别人好 | ＿＿你生日快乐！ | 祝贺 祝福
祝贺 | zhù hè | to congratulate | 为别人的好事高兴 | 听说你考上了大学，＿＿你！ | 祝 祝福
蛋糕 | dàn gāo | cake | 用面和蛋做的甜点 | 生日的时候要吃＿＿。 | 月饼
结婚 | jié hūn | to marry | 男女成为夫妻 | 他们明年要＿＿了。
份 | fèn | (measure word for portions) | 用于饭菜和报纸 | 我要一＿＿米饭和一个菜。
祝福 | zhù fú | blessing | 希望别人好的话 | 新年到了，我给家人发了＿＿。 | 祝贺 礼物
结束 | jié shù | to end | 完了 | 比赛＿＿了，我们队赢了。
月饼 | yuè bing | mooncake | 中秋节吃的圆形点心 | 中秋节要吃＿＿。 | 蛋糕
春节 | chūn jié | Spring Festival | 中国的农历新年 | ＿＿是中国的新年。
`,
  },
  {
    theme: ["Celebrations", "庆祝"],
    data: `
婚礼 | hūn lǐ | wedding | 结婚的仪式 | 我要去参加朋友的＿＿。
送礼 | sòng lǐ | to give gifts | 把礼物给人 | 中国人过年的时候喜欢＿＿。
过节 | guò jié | to celebrate a festival | 在节日里玩、吃、休息 | ＿＿的时候，大家都回家。 | 中秋节
结果 | jié guǒ | result | 最后的情况 | 考试的＿＿出来了，我考得很好。
饼干 | bǐng gān | biscuit | 烤的干的小点心 | 我饿了，吃了几块＿＿。 | 年糕
年糕 | nián gāo | rice cake | 过年吃的米做的糕 | 过年的时候，南方人喜欢吃＿＿。 | 饼干
福 | fú | good fortune | 幸运，好运 | 春节的时候，很多人家门上有一个大大的“＿＿”字。
中秋节 | zhōng qiū jié | Mid-Autumn Festival | 八月十五的节日 | 八月十五是＿＿。
新婚 | xīn hūn | newly married | 刚结婚 | 祝你们＿＿快乐！
离婚 | lí hūn | to divorce | 夫妻分开 | 他们已经＿＿了，现在不住在一起。
`,
  },
  {
    theme: ["New Year", "新年"],
    data: `
过年 | guò nián | to celebrate the New Year | 过春节 | ＿＿的时候，孩子们最高兴。 | 长假
红包 | hóng bāo | red envelope | 装着钱的红色小包 | 过年的时候，爷爷给了我一个＿＿。
好运 | hǎo yùn | good luck | 好的运气 | 明天就要考试了，祝你＿＿！ | 万事如意
万事如意 | wàn shì rú yì | may all go well | 什么事都顺心 | 新年快乐，＿＿！ | 好运
新人 | xīn rén | bride and groom | 刚结婚的两个人 | 婚礼上，大家都祝福这对＿＿。
喜糖 | xǐ táng | wedding sweets | 结婚时送人的糖 | 他们结婚了，给同事们送了＿＿。 | 红包
喜酒 | xǐ jiǔ | wedding banquet | 结婚时请人喝的酒 | 下个星期我要去喝他们的＿＿。
长假 | cháng jià | long holiday | 很多天的假期 | 这次放＿＿，我们要去旅行。
礼服 | lǐ fú | formal dress | 在重要的场合穿的衣服 | 参加婚礼要穿＿＿。
福气 | fú qi | good fortune | 好的命运 | 有这么好的孩子，你真有＿＿。
`,
  },
  {
    theme: ["Life and People", "人生"],
    data: `
出生 | chū shēng | to be born | 来到世界上 | 我是在北京＿＿的。
老家 | lǎo jiā | hometown | 家人以前住的地方 | 我的＿＿在南方，现在住在北京。
中年 | zhōng nián | middle age | 四五十岁的年纪 | 他四十多岁了，是个＿＿人。 | 老年 少年
老年 | lǎo nián | old age | 六七十岁以后 | 爷爷到了＿＿，身体还很好。 | 中年 少年
少年 | shào nián | youth | 十岁到十几岁的年纪 | 他十五岁，还是个＿＿。 | 中年 老年
名人 | míng rén | celebrity | 有名的人 | 他是个＿＿，很多人都认识他。 | 出名
出名 | chū míng | famous | 有名 | 这家饭馆很＿＿，很多人来这里吃饭。 | 名人
难道 | nán dào | could it be that | 表示反问 | 你＿＿不知道明天要考试吗？
零钱 | líng qián | small change | 很少的钱，小面额的钱 | 我没有＿＿，只有一百块的。
样子 | yàng zi | look, appearance | 看上去的模样 | 他生气的＿＿很可怕。
`,
  },
];
