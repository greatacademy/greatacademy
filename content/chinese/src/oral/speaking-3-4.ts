// The speaking topics of grades 3 and 4 (docs/chinese-curriculum.md §18.9): listening and asking, relaying, telling
// what one saw and talking over different views in grade 3; telling a story, introducing, the phone and the visit, and
// persuading in grade 4. The scenes and the words said are written for this subject. Until their recordings are made,
// what is said is shown as text to be read as if heard.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageThreeFourReading } from "../reading/stage-3-4.ts";
import { parsePieces, parseRules, pieceGenerator, type RuleItem, ruleGenerator, TALK } from "../reading/topic-kit.ts";
import { pieceTexts, rule, ruleTexts, type Spec, stageSpeakingTopics, topicOf } from "./speaking-1-2.ts";

/** TALKS_3 are the talks of speaking-3-listening: what each is mainly about. */
const TALKS_3 = parsePieces(
  `
# 李老师说
同学们，下个星期三学校要开运动会。想参加跑步的同学，星期五以前把名字告诉班长。这几天放学后，大家可以在操场上练一练。
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 下星期三开运动会，想跑步的同学要报名 | 下个星期三学校要开运动会 | 想参加跑步的同学，星期五以前把名字告诉班长
- 这个星期五开运动会 ~changed
- 放学后要打扫操场 ~unsaid

# 图书馆的阿姨说
同学们，图书馆新来了一批科学书。每人每次可以借两本，两个星期以内要还。借书时，请带上你的借书卡。
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 图书馆来了新书，说了怎样借 | 图书馆新来了一批科学书 | 每人每次可以借两本，两个星期以内要还 | 借书时，请带上你的借书卡
- 图书馆要关门了 ~unsaid
- 每人每次可以借五本书 ~changed

# 妈妈说
明天我们去看外婆。外婆家离得远，要坐两个小时的车，所以早上七点就要出门。你今天晚上早点睡，把要带的东西准备好。
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 明天早上七点出门去看外婆 | 明天我们去看外婆 | 所以早上七点就要出门
- 明天外婆来我们家 ~changed
- 今天晚上去看外婆 ~changed

# 体育老师说
今天我们学跳远。跳以前要先跑几步，到了线前面用力一跳，落地的时候两只脚一起着地。大家先看我跳一次。
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 老师教大家怎样跳远 | 今天我们学跳远 | 跳以前要先跑几步 | 大家先看我跳一次
- 老师教大家怎样跑步 ~part
- 老师要比一比谁跳得高 ~unsaid

# 班长说
同学们，我们班的植物角还没有花草。大家能不能从家里带一盆小花来？带来的花请写上自己的名字，我们轮流浇水。
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 请大家带花来布置植物角 | 我们班的植物角还没有花草 | 大家能不能从家里带一盆小花来
- 请大家去花店买花 ~unsaid
- 花由班长一个人来浇 ~opposite

# 爸爸说
这个周末天气好，我们去爬山吧。山上风大，要多穿一件衣服。爬山很累，你要穿一双舒服的鞋。
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 周末去爬山，要穿好衣服和鞋 | 这个周末天气好，我们去爬山吧 | 要多穿一件衣服 | 你要穿一双舒服的鞋
- 周末下雨，不能出门 ~opposite
- 周末去河边钓鱼 ~unsaid

# 校长说
同学们，冬天到了，天黑得早。放学后请马上回家，不要在路上玩。过马路的时候，要看清红绿灯。
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 冬天放学后要马上回家，路上注意安全 | 冬天到了，天黑得早 | 放学后请马上回家，不要在路上玩 | 过马路的时候，要看清红绿灯
- 冬天要多穿衣服 ~unsaid
- 放学后可以在路上玩一会儿 ~opposite

# 同学说
我家的大猫生了四只小猫，两只黑的，两只白的。妈妈说家里养不了这么多，想送给喜欢小猫的人。你想要一只吗？
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 同学家的小猫想送人，问你要不要 | 想送给喜欢小猫的人 | 你想要一只吗
- 同学想买一只小猫 ~unsaid
- 同学家的大狗生了小狗 ~who

# 音乐老师说
下个月学校要举行唱歌比赛，每个班唱一首歌。我们班唱一首春天的歌。从明天开始，每天中午练十分钟。
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 为了唱歌比赛，全班每天中午练歌 | 下个月学校要举行唱歌比赛 | 从明天开始，每天中午练十分钟
- 下个星期就要比赛了 ~changed
- 每个同学都要一个人唱一首歌 ~changed

# 奶奶说
我把钥匙忘在家里了，现在进不了门。你爸爸下午五点下班，我们先去楼下的小店等他，好不好？
?1 这段话主要说了什么？ | What is the talk mainly about?
≈ 奶奶忘了带钥匙，要先去小店等爸爸 | 我把钥匙忘在家里了，现在进不了门 | 我们先去楼下的小店等他
- 奶奶要去买一把新钥匙 ~unsaid
- 爸爸下午三点就下班 ~changed
`,
  1,
);

/** UNCLEAR_3 are the scenes of speaking-3-listening that leave something unclear, and the question that asks about it. */
const UNCLEAR_3 = parseRules(`
老师说：“明天下午开家长会，请家长准时到。”
= 老师，请问家长会几点开始？
- 老师，家长会是明天下午开吗？ ~said
- 喂，你说什么？ ~rude

同学说：“星期六我们一起去看电影吧，我在门口等你。”
= 你说的门口，是电影院门口，还是我家门口？
- 你是说星期六去吗？ ~said
- 看什么都行。 ~off

妈妈说：“你去楼下帮我买一包盐，钱在桌子上。”
= 妈妈，要买大包的还是小包的？
- 妈妈，钱在桌子上吗？ ~said
- 我不想去。 ~off

老师说：“这篇课文，明天要背下来。”
= 老师，是背全文，还是背第一段？
- 老师，是明天背吗？ ~said
- 这么长，怎么背得下来！ ~harsh

体育老师说：“下次体育课带上跳绳。”
= 老师，下次体育课是星期几？
- 老师，是带跳绳吗？ ~said
- 我没有跳绳，不上了。 ~off

爸爸在电话里说：“放学后，我在超市门口等你。”
= 爸爸，是哪个超市？是学校旁边的那个吗？
- 爸爸，你是在门口等我吗？ ~said
- 你说得不清楚。 ~rude

同学说：“把那本书借给我看看吧。”
= 你说的是哪一本？是那本童话书吗？
- 你是要借书吗？ ~said
- 不借！ ~rude

老师说：“做完的同学，交给组长。”
= 老师，是交作业本，还是交练习纸？
- 老师，是交给组长吗？ ~said
- 我不交。 ~off

奶奶说：“医生说，这药一天吃三次。”
= 奶奶，一次吃几片？
- 奶奶，是一天吃三次吗？ ~said
- 这药苦不苦？ ~off

叔叔说：“到了路口往左拐，就到了。”
= 叔叔，请问是第几个路口？
- 叔叔，是往左拐吗？ ~said
- 你说的什么呀？ ~rude
`);

/** RELAYS_3 are the messages of speaking-3-relaying: the main point, and who said what. */
const RELAYS_3 = parsePieces(
  `
# 王老师对你说
请你告诉班里的同学，明天上午的美术课改到下午上，大家记得带上彩笔和白纸。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 明天的美术课改到下午 | 明天上午的美术课改到下午上
- 明天不上美术课了 ~changed
- 明天的美术课要带书 ~unsaid
?2 你怎样转述给同学？ | How do you relay it to your classmates?
= 王老师说，明天上午的美术课改到下午，请大家带上彩笔和白纸。 | 明天上午的美术课改到下午上，大家记得带上彩笔和白纸
- 我说，明天上午的美术课改到下午，请大家带上彩笔和白纸。 ~who
- 王老师说，明天的美术课改到下午，请大家带上书。 ~changed

# 李阿姨在电话里说
你妈妈不在家吗？那请你告诉她，明天的会不开了，改到下星期一上午九点。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 明天的会改到下星期一上午 | 明天的会不开了，改到下星期一上午九点
- 明天的会改到下午开 ~changed
- 李阿姨明天要来家里 ~unsaid
?2 你怎样转述给妈妈？ | How do you relay it to Mother?
= 妈妈，李阿姨来电话说，明天的会不开了，改到下星期一上午九点。 | 明天的会不开了，改到下星期一上午九点
- 妈妈，我说明天的会不开了，改到下星期一上午九点。 ~who
- 妈妈，李阿姨来电话说，会改到下星期一下午。 ~changed

# 张爷爷对你说
你爷爷在家吗？请你跟他说，今天下午三点，我在公园的亭子里等他下棋。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 张爷爷约爷爷下午在公园下棋 | 今天下午三点，我在公园的亭子里等他下棋
- 张爷爷要到家里来下棋 ~changed
- 张爷爷请爷爷去散步 ~unsaid
?2 你怎样转述给爷爷？ | How do you relay it to Grandpa?
= 爷爷，张爷爷说，今天下午三点，他在公园的亭子里等您下棋。 | 今天下午三点，我在公园的亭子里等他下棋
- 爷爷，张爷爷说，今天下午三点，我在公园的亭子里等他下棋。 ~person
- 爷爷，张爷爷说，明天下午他在公园等您。 ~changed

# 班长对你说
请你转告小明，他的作业本落在教室里了，我放在讲台上了，让他明天早上来拿。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 小明的作业本在讲台上，明天早上去拿 | 他的作业本落在教室里了，我放在讲台上了
- 小明的作业本丢了 ~changed
- 小明要把作业本交给班长 ~unsaid
?2 你怎样转述给小明？ | How do you relay it to Xiaoming?
= 小明，班长说你的作业本落在教室里了，他放在讲台上了，让你明天早上去拿。 | 他的作业本落在教室里了，我放在讲台上了，让他明天早上来拿
- 小明，班长说他的作业本落在教室里了，我放在讲台上了。 ~person
- 小明，老师说你的作业本在讲台上。 ~who

# 医生对你说
回家告诉你妈妈，你的感冒快好了，药再吃两天就行，这几天多喝水，先不要去游泳。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 感冒快好了，药再吃两天 | 你的感冒快好了，药再吃两天就行
- 感冒还很重，要打针 ~opposite
- 药要再吃一个星期 ~changed
?2 你怎样转述给妈妈？ | How do you relay it to Mother?
= 妈妈，医生说我的感冒快好了，药再吃两天就行，要多喝水，先不要去游泳。 | 你的感冒快好了，药再吃两天就行，这几天多喝水，先不要去游泳
- 妈妈，医生说你的感冒快好了，药再吃两天就行。 ~person
- 妈妈，医生说我的感冒快好了，可以去游泳了。 ~opposite

# 小红对你说
请你跟小丽说，星期天的生日会，她可以带妹妹一起来，下午两点在我家。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 小丽可以带妹妹来参加生日会 | 她可以带妹妹一起来
- 小丽不能来生日会了 ~opposite
- 生日会在小丽家开 ~changed
?2 你怎样转述给小丽？ | How do you relay it to Xiaoli?
= 小丽，小红说星期天的生日会，你可以带妹妹一起去，下午两点在她家。 | 星期天的生日会，她可以带妹妹一起来，下午两点在我家
- 小丽，小红说星期天的生日会，她可以带妹妹一起来，下午两点在我家。 ~person
- 小丽，小明说你可以带妹妹去生日会。 ~who

# 门口的保安叔叔对你说
你是三年级二班的吧？请你告诉你们老师，送来的新桌子放在一楼了，下午有人帮忙搬上去。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 新桌子送来了，下午有人帮忙搬 | 送来的新桌子放在一楼了，下午有人帮忙搬上去
- 新桌子明天才送来 ~changed
- 要同学们自己去搬桌子 ~opposite
?2 你怎样转述给老师？ | How do you relay it to the teacher?
= 老师，保安叔叔说送来的新桌子放在一楼了，下午有人帮忙搬上来。 | 送来的新桌子放在一楼了，下午有人帮忙搬上去
- 老师，我说新桌子放在一楼了。 ~who
- 老师，保安叔叔说新桌子放在二楼了。 ~changed

# 姐姐对你说
我今天要在学校排练节目，晚饭不回来吃了。你告诉爸爸，九点钟到学校门口来接我。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 姐姐不回来吃饭，请爸爸九点去接她 | 晚饭不回来吃了 | 你告诉爸爸，九点钟到学校门口来接我
- 姐姐要回家吃晚饭 ~opposite
- 请爸爸八点去接姐姐 ~changed
?2 你怎样转述给爸爸？ | How do you relay it to Father?
= 爸爸，姐姐说她今天在学校排练，不回来吃晚饭了，请您九点钟到学校门口接她。 | 我今天要在学校排练节目，晚饭不回来吃了。你告诉爸爸，九点钟到学校门口来接我
- 爸爸，姐姐说我今天在学校排练，九点钟来接我。 ~person
- 爸爸，妈妈说九点钟去学校接姐姐。 ~who

# 刘老师对你说
请你通知你们组的同学，这个星期的值日改了，星期四由你们组打扫教室。
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
= 这个星期四由我们组打扫教室 | 星期四由你们组打扫教室
- 我们组这个星期不用值日 ~opposite
- 星期五由我们组打扫教室 ~changed
?2 你怎样转述给组里的同学？ | How do you relay it to your group?
= 刘老师说，这个星期的值日改了，星期四由我们组打扫教室。 | 这个星期的值日改了，星期四由你们组打扫教室
- 刘老师说，这个星期的值日改了，星期四由你们组打扫教室。 ~person
- 王老师说，星期四由我们组打扫操场。 ~who

# 邻居陈奶奶对你说
你妈妈回来了吗？跟她说一声，她借给我的那把伞，我已经放在你家门口的鞋柜上了。谢谢她！
?1 转述的时候，最要紧的意思是什么？ | In relaying it, what is the main point?
≈ 陈奶奶把借的伞还回来了 | 她借给我的那把伞，我已经放在你家门口的鞋柜上了 | 谢谢她
% 陈奶奶说，妈妈借给她的伞，她已经放在门口的鞋柜上了，还说“谢谢她”。借来的东西放回主人家门口，又道谢，意思就是把伞还回来了。 | Granny Chen says the umbrella Mother lent her is now on the shoe cabinet by the door, and adds her thanks. Leaving a borrowed thing at its owner's door with thanks means she has given it back.
- 陈奶奶想借一把伞 ~changed
- 陈奶奶把伞弄丢了 ~unsaid
?2 你怎样转述给妈妈？ | How do you relay it to Mother?
= 妈妈，陈奶奶说您借给她的伞，她已经放在我们家门口的鞋柜上了，还说谢谢您。 | 她借给我的那把伞，我已经放在你家门口的鞋柜上了
- 妈妈，陈奶奶说她借给我的那把伞，我已经放在你家门口的鞋柜上了。 ~person
- 妈妈，陈奶奶说伞放在桌子上了。 ~changed
`,
  2,
);

/** SEEN_3 are the things seen of speaking-3-telling, in four parts: the start, two steps, the end. */
const SEEN_3: readonly (readonly [topic: string, parts: readonly [string, string, string, string]])[] = [
  [
    "看蚂蚁搬家",
    [
      "下午，我在院子里看见一群蚂蚁。",
      "它们排成一条长长的队，抬着小米粒往前走。",
      "有一只蚂蚁掉了队，很快又跟了上去。",
      "天快黑的时候，它们都进了洞。",
    ],
  ],
  [
    "路上看见有人扶老人",
    ["早上上学，我走到路口。", "一位老奶奶提着菜，走得很慢。", "一个大哥哥跑过去，扶着她过了马路。", "老奶奶笑着对大哥哥说了声谢谢。"],
  ],
  [
    "公园里放风筝",
    ["星期天，我和爸爸去公园。", "草地上有很多人在放风筝。", "有一只大鸟风筝飞得最高，大家都抬头看。", "后来起风了，它飞得更高了。"],
  ],
  [
    "雨后的彩虹",
    ["下午下了一场大雨。", "雨停了，我跑到窗前往外看。", "天上出现了一道彩虹，有好几种颜色。", "过了一会儿，彩虹慢慢不见了。"],
  ],
  [
    "小鸡出壳",
    ["上个星期，我去外婆家。", "外婆家的一个蛋上有了一条小缝。", "一只小鸡用嘴一点一点地啄开了蛋壳。", "最后，它站了起来，叫了两声。"],
  ],
  [
    "超市里的长队",
    ["放学后，我和妈妈去超市。", "付钱的地方排了一条长长的队。", "一位阿姨让抱着孩子的叔叔排到了她前面。", "叔叔连声说谢谢，大家都笑了。"],
  ],
  [
    "学校的升旗",
    ["星期一早上，全校同学站在操场上。", "国歌响起来了，大家都站得直直的。", "红旗慢慢地升了上去。", "最后，红旗在旗杆顶上飘了起来。"],
  ],
  [
    "小河边钓鱼",
    [
      "暑假的一天，我跟爷爷去河边钓鱼。",
      "爷爷把鱼钩放进水里，静静地等着。",
      "过了很久，鱼线动了一下，爷爷一拉，钓上来一条小鱼。",
      "爷爷说鱼太小，又把它放回了河里。",
    ],
  ],
  [
    "下雪天堆雪人",
    [
      "早上起来，外面一片白。",
      "我和弟弟跑到楼下，先滚了一个大雪球做身子。",
      "又滚了一个小雪球放在上面做头。",
      "最后，我们给雪人戴上了帽子。",
    ],
  ],
  [
    "种下的豆子发芽",
    ["上个月，我在小盆里种了三颗豆子。", "我每天给它浇一点水。", "一个星期以后，土里冒出了一点绿。", "又过了几天，长出了两片小叶子。"],
  ],
];

/** ORDERED_3 are the scenes of telling what one saw in a clear order, and two tellings out of order. */
const ORDERED_3: readonly RuleItem[] = SEEN_3.map(([topic, [a, b, c, d]]) => ({
  scene: `要讲的见闻：${topic}`,
  right: `${a}${b}${c}${d}`,
  wrong: [
    [`${a}${d}${b}${c}`, "order"],
    [`${c}${a}${d}${b}`, "order"],
  ],
}));

/** FEELINGS_3 are the scenes of speaking-3-telling that end in a feeling, and the tellings that say it or do not. */
const FEELINGS_3 = parseRules(`
你看见一个大哥哥扶老奶奶过马路，想讲给同学听。
= 我看见一个大哥哥扶老奶奶过了马路。我觉得他真好，我也要像他一样帮助别人。
- 我看见一个大哥哥扶老奶奶过了马路。 ~nofeeling
- 我看见一个大哥哥扶老奶奶过了马路，我觉得真没意思。 ~mismatch

你第一次看见小鸡从蛋壳里出来，想讲给妈妈听。
= 我看见一只小鸡自己啄开了蛋壳，站了起来。它那么小，却那么有力气，我觉得真奇妙。
- 我看见一只小鸡啄开了蛋壳，站了起来。 ~nofeeling
- 我看见一只小鸡啄开了蛋壳，我很生气。 ~mismatch

你看了一场雨后的彩虹，想讲给爸爸听。
= 雨停了，天上出现了一道彩虹，有好几种颜色。我看着它，心里高兴极了。
- 雨停了，天上出现了一道彩虹。 ~nofeeling
- 雨停了，天上出现了一道彩虹，我害怕得哭了。 ~mismatch

你看见同学在比赛中摔倒了，又爬起来跑到了终点，想讲给大家听。
= 小明在比赛中摔倒了，可他马上爬起来，一直跑到了终点。我很佩服他，不怕困难。
- 小明在比赛中摔倒了，又爬起来跑到了终点。 ~nofeeling
- 小明在比赛中摔倒了，又爬起来跑到了终点，我觉得他真笨。 ~mismatch

你看见爷爷把钓到的小鱼又放回了河里，想讲给同学听。
= 爷爷钓上来一条小鱼，说它太小了，又把它放回了河里。我觉得爷爷真爱护小动物。
- 爷爷钓上来一条小鱼，又把它放回了河里。 ~nofeeling
- 爷爷钓上来一条小鱼，又把它放回了河里，我觉得爷爷真小气。 ~mismatch

你看见种下的豆子长出了小叶子，想讲给奶奶听。
= 我种的豆子长出了两片小叶子，绿绿的，嫩嫩的。我每天浇水，终于等到了，我高兴得跳了起来。
- 我种的豆子长出了两片小叶子。 ~nofeeling
- 我种的豆子长出了两片小叶子，我觉得很伤心。 ~mismatch

你看见一位阿姨把位子让给抱孩子的叔叔，想讲给妈妈听。
= 在车上，一位阿姨把座位让给了抱孩子的叔叔。叔叔一直说谢谢，我心里暖暖的。
- 在车上，一位阿姨把座位让给了抱孩子的叔叔。 ~nofeeling
- 在车上，一位阿姨把座位让给了抱孩子的叔叔，我觉得很害怕。 ~mismatch

你看了学校的升旗，想讲给弟弟听。
= 星期一早上，国歌响起来，红旗慢慢升上了旗杆顶。我站得直直的，心里很自豪。
- 星期一早上，国歌响起来，红旗慢慢升上了旗杆顶。 ~nofeeling
- 星期一早上，红旗慢慢升上了旗杆顶，我觉得真好笑。 ~mismatch

你看见一只小猫爬上了树，下不来，后来被消防员叔叔救了下来，想讲给同学听。
= 一只小猫爬上了大树，下不来了，一直叫。消防员叔叔爬上去把它抱了下来。我的心这才放了下来。
- 一只小猫爬上了大树，消防员叔叔把它抱了下来。 ~nofeeling
- 一只小猫爬上了大树，下不来了，我觉得真开心。 ~mismatch

你看见蚂蚁一起把一块大饼干搬回了家，想讲给爸爸听。
= 一块饼干比蚂蚁大好多，可是很多蚂蚁一起抬，就把它搬回了家。我想，大家一起做，就有力量。
- 很多蚂蚁一起把一块饼干搬回了家。 ~nofeeling
- 很多蚂蚁一起把一块饼干搬回了家，我觉得蚂蚁真懒。 ~mismatch
`);

/** REASONS_3 are the matters of speaking-3-discussing, and the view that comes with its reason. */
const REASONS_3 = parseRules(`
班里要选一种小动物来养，大家在商量。
= 我想养小金鱼，因为金鱼不吵，喂一点鱼食就行，大家都照顾得了。
- 我想养小金鱼。 ~noreason
- 我想养小金鱼，因为我昨天吃了鱼。 ~weak

春游去哪里，大家在商量。
= 我想去植物园，那里有很多花草树木，还能学到很多知识。
- 我想去植物园。 ~noreason
- 我想去植物园，因为我穿了新鞋。 ~weak

班里的图书角放在哪里，大家在商量。
= 我觉得放在窗户旁边好，那里亮，看书不费眼睛。
- 我觉得放在窗户旁边好。 ~noreason
- 我觉得放在窗户旁边好，因为我喜欢窗户。 ~weak

运动会上班里报什么项目，大家在商量。
= 我们报接力跑吧，我们班跑得快的同学多，大家一起跑也更团结。
- 我们报接力跑吧。 ~noreason
- 我们报接力跑吧，因为接力这两个字好听。 ~weak

给生病的同学送什么，大家在商量。
= 我们给他写一张卡片吧，他看了会知道大家都想着他，心里会好受一些。
- 我们给他写一张卡片吧。 ~noreason
- 我们给他写一张卡片吧，因为卡片是红色的。 ~weak

周末一家人做什么，大家在商量。
= 我们去看奶奶吧，奶奶一个人在家，好久没见我们了，她一定很想我们。
- 我们去看奶奶吧。 ~noreason
- 我们去看奶奶吧，因为今天是周末。 ~weak

班里的植物谁来浇水，大家在商量。
= 我们排个表，每人一天，这样谁也不会忘，也不会浇得太多。
- 我们排个表吧。 ~noreason
- 我们排个表吧，因为我会画表格。 ~weak

教室后面的墙上贴什么，大家在商量。
= 我们贴同学们的画吧，大家都能看到自己的作品，会更喜欢画画。
- 我们贴同学们的画吧。 ~noreason
- 我们贴同学们的画吧，因为墙是白的。 ~weak

下课玩什么游戏，大家在商量。
= 我们玩跳绳吧，人多人少都能玩，一个课间也玩得完。
- 我们玩跳绳吧。 ~noreason
- 我们玩跳绳吧，因为我早上吃了面包。 ~weak

班里的联欢会演什么节目，大家在商量。
= 我们演一个童话剧吧，人人都能演一个角色，大家都能参加。
- 我们演一个童话剧吧。 ~noreason
- 我们演一个童话剧吧，因为今天天气好。 ~weak
`);

/** OTHER_VIEWS_3 are the different views of speaking-3-discussing, and the answers that meet them. */
const OTHER_VIEWS_3 = parseRules(`
你说想养小金鱼。同学说：“我想养小兔子，小兔子可爱。”
= 小兔子是很可爱，可是它要吃很多草，还要有地方跑，教室里不好养。你觉得呢？
- 小兔子有什么好的，听我的！ ~harsh
- 反正我要养金鱼。 ~dismiss

你说想去植物园。同学说：“我想去动物园，动物园更好玩。”
= 动物园也很好玩。我们可以先去植物园，下次再去动物园，好吗？
- 动物园一点也不好玩！ ~harsh
- 我不管，就去植物园。 ~dismiss

你说图书角放在窗户旁边。同学说：“放在门口吧，大家拿书方便。”
= 门口拿书是方便，可是进进出出的人多，会把书碰掉。放在窗户旁边又亮又安静，好不好？
- 你的想法太差了。 ~harsh
- 我说放窗户旁边就放窗户旁边。 ~dismiss

你说报接力跑。同学说：“报跳绳吧，我们班跳绳好。”
= 你说得有道理，我们班跳绳也好。我们问问大家想报哪一个，再一起定，好吗？
- 跳绳谁不会呀！ ~harsh
- 别说了，就报接力跑。 ~dismiss

你说给生病的同学写卡片。同学说：“写卡片太简单了，我们去看他吧。”
= 去看他当然好，可是他在生病，人太多会累着他。我们先写卡片，等他好一点再去看他，行吗？
- 你就知道去看。 ~harsh
- 写卡片就写卡片，不去。 ~dismiss

你说周末去看奶奶。妹妹说：“我想去公园。”
= 去公园也很好。我们上午去看奶奶，下午带奶奶一起去公园，好不好？
- 公园天天都能去，你真烦！ ~harsh
- 不去公园。 ~dismiss

你说排表浇花。同学说：“谁想浇谁浇，不用排表。”
= 你的办法很自由，可是有时候大家都忘了，有时候又浇了好几次。排个表，大家就都记得了。
- 你这个办法太笨了。 ~harsh
- 不排表不行，就这样定了。 ~dismiss

你说墙上贴同学们的画。同学说：“贴大家写的字吧。”
= 贴字也很好。我们可以一半贴画，一半贴字，这样会画的和会写的都能贴上，你看怎么样？
- 你的字那么难看，贴什么！ ~harsh
- 墙上只能贴画。 ~dismiss

你说下课玩跳绳。同学说：“我们玩捉人吧。”
= 捉人也好玩，可是教室外面的地方小，跑起来容易撞到人。跳绳不用跑来跑去，好吗？
- 捉人太傻了。 ~harsh
- 我说玩跳绳就玩跳绳。 ~dismiss

你说联欢会演童话剧。同学说：“演童话剧要准备很久，我们唱歌吧。”
= 你说得对，童话剧要准备很久。我们选一个短一点的，再一起唱一首歌，好不好？
- 唱歌谁都会，没意思。 ~harsh
- 不演童话剧我就不参加了。 ~dismiss
`);

/** ORDER_HEADS_3 and FEELING_HEADS_3 are the headings of the steps of telling in order and of saying a feeling. */
const ORDER_HEADS_3 = {
  find: t("Step 1: recall the order of what happened.", "第一步：想一想事情是怎样一步步发生的。"),
  choose: t("Step 2: choose the telling that keeps that order.", "第二步：选出按这个顺序讲的一种。"),
};
const FEELING_HEADS_3 = {
  find: t("Step 1: think what you saw and how it made you feel.", "第一步：想一想看到了什么，心里有什么感受。"),
  choose: t("Step 2: choose the telling that says both.", "第二步：选出两样都讲到的一种。"),
};

/** SPECS_3 are the speaking topics of grade 3, in order. */
const SPECS_3: readonly Spec[] = [
  {
    grade: 3,
    id: "speaking-3-listening",
    title: t("Listening and Asking", "倾听和请教"),
    summary: t(
      "Listening for what a talk mainly says, and asking about what it left unclear.",
      "听别人说话，听出主要意思；没听明白的地方，有礼貌地问清楚。",
    ),
    intro: t(
      "Listen for the main thing a talk says, and notice what it leaves out. The teacher says: “明天下午开家长会，请家长准时到。” The main thing is tomorrow afternoon's parents' meeting; but the time is not said, so you ask: “老师，请问家长会几点开始？”\n\nThe first knowledge point asks what a talk mainly says, the second for the question about what was unclear.",
      "听别人说话，要听出主要意思，也要听出哪里没说清楚。老师说：“明天下午开家长会，请家长准时到。”主要意思是明天下午开家长会；可是没说几点，就要问一问：“老师，请问家长会几点开始？”\n\n第一个知识点听出一段话的主要意思，第二个问清楚没听明白的地方。",
    ),
    texts: [...pieceTexts(TALKS_3), ...ruleTexts(UNCLEAR_3)],
    after: ["speaking-2-messages"],
    points: [
      [
        "main",
        t("What Was Said", "听出主要意思"),
        t(
          "The main thing a talk says is often in its first sentence or in what it asks of you; the rest gives the details.\n\nThe librarian says new science books have come, two may be borrowed at a time, and the card is needed: mainly, new books have come and how to borrow them.\n\n> **Watch out.** One detail is not the main thing. “Run a few steps first” is part of a lesson on the long jump, not what the lesson is about.",
          "一段话的主要意思，常常在第一句里，或者在请你做的事里；其他的话是在讲细节。\n\n比如图书馆的阿姨说来了新的科学书，每次可以借两本，借书要带借书卡：主要意思是来了新书，说了怎样借。\n\n> **注意。** 一个细节不是主要意思。“先跑几步”只是跳远课的一部分，不是这节课主要讲的。",
        ),
        pieceGenerator(TALKS_3, 0, TALK),
      ],
      [
        "asking",
        t("Asking About What Was Unclear", "问清楚没听明白的地方"),
        t(
          "After listening, ask yourself: do I know when, where, which one and how much? Ask politely about what is missing, and not about what was already said.\n\nAn uncle says: “到了路口往左拐，就到了。” Which crossing? Ask: “叔叔，请问是第几个路口？”\n\n> **Watch out.** Asking again what was said clearly shows you did not listen. Ask only about the part that is truly unclear.",
          "听完以后问问自己：什么时候、在哪里、是哪一个、要多少，我都知道了吗？缺了什么，就有礼貌地问什么；已经说清楚的，不要再问。\n\n比如叔叔说：“到了路口往左拐，就到了。”是哪个路口呢？就问：“叔叔，请问是第几个路口？”\n\n> **注意。** 把说清楚了的再问一遍，说明你没认真听。只问真正没说清楚的地方。",
        ),
        ruleGenerator(
          t("Which question asks about what was left unclear?", "哪一句问到了没说清楚的地方？"),
          UNCLEAR_3,
          rule(
            t(
              "Find what the speaker did not say: the time, the place, which one or how much; ask about that, politely.",
              "找出说话的人没说清楚的地方：时间、地点、哪一个、多少；有礼貌地问这一点。",
            ),
            t(
              "Imagine the answer to the question: it tells you what you did not yet know.",
              "想一想对方回答了这个问题，你是不是就知道了原来不知道的事。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 3,
    id: "speaking-3-relaying",
    title: t("Relaying Briefly", "简要转述"),
    summary: t(
      "Relaying a message in brief: keeping its main point, and saying who said it, with “I” and “you” turned round.",
      "简要转述：说清主要意思，说清是谁说的，把“我”“你”换过来。",
    ),
    intro: t(
      "To relay is to pass on, briefly, what someone said for another. Teacher Wang says: “请你告诉班里的同学，明天上午的美术课改到下午上。” You tell the class: “王老师说，明天上午的美术课改到下午。” The main point is kept, and so is who said it.\n\nThe first knowledge point finds the main point of a message, the second relays it with who said it and the right “I” and “you”.",
      "转述，就是把别人让你带的话简要地说给另一个人听。王老师说：“请你告诉班里的同学，明天上午的美术课改到下午上。”你跟同学说：“王老师说，明天上午的美术课改到下午。”主要意思没变，也说了是谁说的。\n\n第一个知识点找出口信最要紧的意思，第二个转述时说清是谁说的，把“我”“你”换对。",
    ),
    texts: pieceTexts(RELAYS_3),
    after: ["speaking-2-messages"],
    points: [
      [
        "main",
        t("The Main Point", "最要紧的意思"),
        t(
          "Of a message, keep first what the listener must know to act: what has changed, when and where.\n\nThe doctor's “你的感冒快好了，药再吃两天就行” is what Mother most needs: the cold is nearly gone, two more days of medicine.\n\n> **Watch out.** A brief relay may leave out the extra words, but never change a time or a place, and never turn “do not” into “do”.",
          "转述口信，先要抓住听的人一定要知道、要照着做的事：什么变了，什么时间，什么地方。\n\n比如医生说“你的感冒快好了，药再吃两天就行”，这就是妈妈最需要知道的：感冒快好了，药再吃两天。\n\n> **注意。** 简要转述可以省掉多余的话，可时间、地点不能改，“不要”也不能说成“要”。",
        ),
        pieceGenerator(RELAYS_3, 0, TALK),
      ],
      [
        "who",
        t("Who Said What", "说清是谁说的"),
        t(
          "A relay says who the message is from, and turns “I” and “you” round for the new listener: the speaker's “I” becomes he or she, and “your mother” becomes “you”.\n\n张爷爷 says: “请你跟他说，今天下午三点，我在公园的亭子里等他下棋。” To Grandpa: “爷爷，张爷爷说，今天下午三点，他在公园的亭子里等您下棋。”\n\n> **Watch out.** “张爷爷说，我在公园等他” keeps the old “I” and “he”: Grandpa would think you are the one waiting.",
          "转述要说清话是谁说的，还要按新的听话人把“我”“你”换过来：说话人的“我”换成“他”或“她”，“你妈妈”换成“您”。\n\n张爷爷说：“请你跟他说，今天下午三点，我在公园的亭子里等他下棋。”转述给爷爷：“爷爷，张爷爷说，今天下午三点，他在公园的亭子里等您下棋。”\n\n> **注意。** 说成“张爷爷说，我在公园等他”，还是原来的“我”和“他”，爷爷会以为是你在等他。",
        ),
        pieceGenerator(RELAYS_3, 1, TALK),
      ],
    ],
  },
  {
    grade: 3,
    id: "speaking-3-telling",
    title: t("Telling What I Saw and Felt", "讲述见闻"),
    summary: t(
      "Telling something one saw: in the order it happened, and with what one felt about it.",
      "讲述自己的见闻：按事情发生的顺序讲，说出自己的感受。",
    ),
    intro: t(
      "To tell what you saw, go in the order it happened and end with how it made you feel. “下午，我在院子里看见一群蚂蚁。它们排成一条长长的队，抬着小米粒往前走……天快黑的时候，它们都进了洞。我觉得蚂蚁真团结。” goes from the start to the end, and says the feeling.\n\nThe first knowledge point keeps the order, the second says the feeling.",
      "讲述见闻，要按事情发生的顺序讲，最后说说自己的感受。“下午，我在院子里看见一群蚂蚁。它们排成一条长长的队，抬着小米粒往前走……天快黑的时候，它们都进了洞。我觉得蚂蚁真团结。”从开始讲到结束，还说出了感受。\n\n第一个知识点按顺序讲，第二个说出感受。",
    ),
    texts: [...ruleTexts(ORDERED_3), ...ruleTexts(FEELINGS_3)],
    after: ["speaking-1-telling"],
    points: [
      [
        "order",
        t("A Clear Order", "按顺序讲"),
        t(
          "Tell first how it began, then what happened step by step, last how it ended. Words like 先, 又, 过了一会儿 and 最后 help the listener follow.\n\nMaking a snowman: first the big ball for the body, then the small one for the head, last the hat.\n\n> **Watch out.** Starting with the end, or putting a later step first, leaves the listener lost; the hat cannot go on before the head is made.",
          "先讲事情怎样开始，再一步一步讲经过，最后讲结果。“先”“又”“过了一会儿”“最后”这些词能帮听的人跟上。\n\n比如堆雪人：先滚大雪球做身子，再滚小雪球做头，最后戴上帽子。\n\n> **注意。** 先讲结果，或者把后面的事放到前面，听的人就糊涂了：头还没做好，帽子是戴不上的。",
        ),
        ruleGenerator(
          t("Which telling goes in a clear order?", "哪一种讲得有顺序？"),
          ORDERED_3,
          rule(
            t("Tell how it began, then each step as it happened, and last how it ended.", "先讲开始，再按发生的先后讲经过，最后讲结果。"),
            t(
              "Follow the telling in your mind: each part could only happen after the one before it.",
              "在心里跟着讲述走一遍：每一部分都是在前一部分之后才会发生的。",
            ),
            ORDER_HEADS_3,
          ),
        ),
      ],
      [
        "feeling",
        t("Saying One's Feeling", "说出自己的感受"),
        t(
          "After telling what you saw, say what you felt or thought, and let it follow from what happened.\n\nSeeing a big boy help an old woman across the road: “我觉得他真好，我也要像他一样帮助别人。”\n\n> **Watch out.** A feeling must fit the thing told. Being glad at a rainbow fits; being frightened by it does not, unless the telling says why.",
          "讲完见到的事，再说说自己的感受或者想法，这感受要从事情里来。\n\n比如看见大哥哥扶老奶奶过马路：“我觉得他真好，我也要像他一样帮助别人。”\n\n> **注意。** 感受要和讲的事对得上。看见彩虹心里高兴，对得上；看见彩虹害怕得哭了，就对不上了。",
        ),
        ruleGenerator(
          t("Which telling says what was seen and the feeling that fits it?", "哪一种既讲了见闻，又说出了合适的感受？"),
          FEELINGS_3,
          rule(
            t(
              "Tell what you saw, then the feeling it gave you, one that follows from it.",
              "先讲看到的事，再说这件事带给你的感受，感受要和事情对得上。",
            ),
            t(
              "Ask whether a listener would feel the same on hearing what happened: the feeling fits the thing told.",
              "想一想别人听了这件事，会不会也有这样的感受：感受和讲的事对得上。",
            ),
            FEELING_HEADS_3,
          ),
        ),
      ],
    ],
  },
  {
    grade: 3,
    id: "speaking-3-discussing",
    title: t("Talking Over Different Views", "与人商讨"),
    summary: t(
      "Talking a matter over: giving a view with its reason, and meeting a different view kindly, with a reason too.",
      "与人商讨：说出看法和理由，友好地回应不同的看法，也说出理由。",
    ),
    intro: t(
      "To talk a matter over, say what you think and why, and when someone thinks otherwise, answer their view, not just repeat yours. “我想养小金鱼，因为金鱼不吵，喂一点鱼食就行。” gives a view and its reason. To “小兔子可爱”: “小兔子是很可爱，可是它要吃很多草，教室里不好养。你觉得呢？”\n\nThe first knowledge point gives a reason, the second meets a different view.",
      "与人商讨，要说出自己的看法和理由；别人看法不同时，要回应他的看法，不是只把自己的话再说一遍。“我想养小金鱼，因为金鱼不吵，喂一点鱼食就行。”说了看法，也说了理由。别人说“小兔子可爱”，就回应：“小兔子是很可爱，可是它要吃很多草，教室里不好养。你觉得呢？”\n\n第一个知识点说出理由，第二个回应不同的看法。",
    ),
    texts: [...ruleTexts(REASONS_3), ...ruleTexts(OTHER_VIEWS_3)],
    after: ["speaking-2-discussing"],
    points: [
      [
        "reason",
        t("Giving a Reason", "说出理由"),
        t(
          "A view is worth more with its reason, and the reason must bear on the matter: why this choice is good for what is being decided.\n\nWhere to put the book corner: “放在窗户旁边好，那里亮，看书不费眼睛。” The light is a reason about reading.\n\n> **Watch out.** “因为我喜欢窗户” has 因为, but it is no reason about books. A reason tells why the choice serves the matter.",
          "看法加上理由，别人才好商量；理由要和商讨的事有关：为什么这样选对这件事好。\n\n比如图书角放哪里：“放在窗户旁边好，那里亮，看书不费眼睛。”亮，是和看书有关的理由。\n\n> **注意。** “因为我喜欢窗户”虽然有“因为”，却不是和看书有关的理由。理由要说明这样选为什么对这件事好。",
        ),
        ruleGenerator(
          t("Which says a view with a fitting reason?", "哪一句说出了看法和合适的理由？"),
          REASONS_3,
          rule(
            t("Say what you think, then why it is good for the matter being decided.", "说出自己的看法，再说为什么这样对商讨的事好。"),
            t(
              "Ask of the reason: does it tell why this choice serves the matter? It does.",
              "问一问这个理由：它说明了这样选为什么对这件事好吗？说明了。",
            ),
          ),
        ),
      ],
      [
        "other-view",
        t("Meeting a Different View", "回应不同的看法"),
        t(
          "When someone thinks otherwise, first grant what is good in their view, then give your reason, and ask what they think or offer a way both can take.\n\nTo “我想去动物园”: “动物园也很好玩。我们可以先去植物园，下次再去动物园，好吗？”\n\n> **Watch out.** Calling their idea bad, or just saying yours again, is not talking it over; the other person must hear that their view was heard.",
          "别人看法不同时，先说说他的看法好在哪里，再说自己的理由，然后问问他怎么想，或者提一个大家都能接受的办法。\n\n比如别人说“我想去动物园”：“动物园也很好玩。我们可以先去植物园，下次再去动物园，好吗？”\n\n> **注意。** 说别人的想法不好，或者只把自己的话再说一遍，都不是商讨；要让对方听出你听进了他的意见。",
        ),
        ruleGenerator(
          t("Which answer meets the different view well?", "哪一句回应得好？"),
          OTHER_VIEWS_3,
          rule(
            t(
              "Grant what is good in the other view, give your reason, and ask or offer a way both can take.",
              "先肯定别人看法好的地方，再说自己的理由，然后问一问，或者提一个双方都能接受的办法。",
            ),
            t(
              "Imagine the other hearing it: they know their view was heard, and why you think otherwise.",
              "想一想对方听了：他知道你听进了他的意见，也明白你为什么这样想。",
            ),
          ),
        ),
      ],
    ],
  },
];

/** LIVELY_4 are the moments of speaking-4-storytelling, and the livelier telling of each. */
const LIVELY_4 = parseRules(`
你给同学讲《守株待兔》里农夫看见兔子撞死的那一刻。
= 农夫正在地里干活，忽然，一只兔子从草丛里跑出来，“咚”的一声撞在树桩上，不动了。农夫跑过去捡起兔子，乐得合不拢嘴。
- 农夫看见一只兔子撞死在树桩上，就捡走了。 ~flat
- 农夫正在地里干活，一只兔子跑过来，农夫一把抓住了它。 ~retold

你给弟弟讲《小马过河》里小马走到河边的时候。
= 小马背着一袋麦子，走到河边，一看，河水哗哗地流着，挡住了去路。它停下来，心想：“是走过去呢，还是回去问妈妈呢？”
- 小马走到河边，不知道能不能过去。 ~flat
- 小马走到河边，一下子就跳过去了。 ~retold

你给同学讲《狐假虎威》里狐狸被老虎抓住的那一刻。
= 老虎一把按住了狐狸。狐狸眼珠子骨碌一转，扯着嗓子说：“你敢吃我？我是老天爷派来管百兽的！”老虎被它吓住了，爪子一松。
- 老虎抓住了狐狸，狐狸说自己是管百兽的。 ~flat
- 老虎抓住了狐狸，一口就把它吃掉了。 ~retold

你给妹妹讲《小蝌蚪找妈妈》里小蝌蚪见到青蛙妈妈的时候。
= 小蝌蚪游到荷叶边，看见一只大青蛙蹲在荷叶上，鼓着大眼睛，露着白肚皮。它们高兴地喊：“妈妈！妈妈！”青蛙妈妈“呱呱”地笑着跳进了水里。
- 小蝌蚪找到了青蛙妈妈。 ~flat
- 小蝌蚪游到荷叶边，看见了一条大鲤鱼，就叫它妈妈。 ~retold

你给同学讲《龟兔赛跑》里兔子睡觉的那一段。
= 兔子一口气跑出老远，回头一看，乌龟还在后面慢慢地爬。它得意地想：“我睡一觉也能赢。”就靠着大树，眯上眼睛，打起了呼噜。
- 兔子跑在前面，在树下睡着了。 ~flat
- 兔子跑在前面，一直跑到了终点。 ~retold

你给同学讲《曹冲称象》里曹冲想出办法的时候。
= 大家都想不出办法，七嘴八舌的。这时，曹冲站出来说：“我有办法！先把大象赶到船上，看船沉下去多少，在船边画一道线……”官员们听了，都瞪大了眼睛。
- 曹冲想出了称大象的办法。 ~flat
- 大家都想不出办法，曹冲说：“大象太大了，我们不称了吧。” ~retold

你给弟弟讲《司马光》里小朋友掉进水缸的那一刻。
= 一个小朋友爬上假山，脚下一滑，“扑通”一声掉进了大水缸。大家吓坏了，有的哭，有的喊，有的跑去找大人。只有司马光没有慌。
- 一个小朋友掉进了水缸，大家很害怕。 ~flat
- 一个小朋友掉进了水缸，司马光马上跳了进去。 ~retold

你给同学讲《坐井观天》里青蛙和小鸟争论的时候。
= 青蛙瞪着眼睛，不服气地说：“朋友，别说大话了！天不过井口那么大，还用飞那么远吗？”小鸟摇摇头，笑着说：“你弄错了，天无边无际，大得很哪！”
- 青蛙和小鸟说天有多大，它们说得不一样。 ~flat
- 青蛙说：“天真大呀！”小鸟说：“天只有井口那么大。” ~retold

你给妹妹讲《拔苗助长》里那个人把禾苗往上拔的时候。
= 他跑到田里，把禾苗一棵一棵地往上拔，从中午一直忙到太阳落山，累得腰都直不起来。回到家，他喘着气说：“今天可累坏了，我帮禾苗长高了一大截！”
- 他把禾苗往上拔，拔了很久。 ~flat
- 他跑到田里，给禾苗浇了很多水，又施了肥。 ~retold

你给同学讲《亡羊补牢》里羊第二次丢了以后。
= 第二天一早，他去羊圈一看，又少了一只羊，狼还是从那个洞钻进来的。他后悔极了，拍着脑袋说：“都怪我不听劝！现在修还不晚。”他赶紧找来石头，把洞堵得严严实实。
- 羊又丢了，他把羊圈修好了。 ~flat
- 羊又丢了，他说：“丢就丢吧，反正还有别的羊。” ~retold
`);

/** DETAIL_4 are the moments of speaking-4-storytelling, and the detail that brings each alive. */
const DETAIL_4 = parseRules(`
你讲《乌鸦喝水》，讲到乌鸦想办法的时候。
= 乌鸦歪着脑袋，看看瓶子，又看看地上的小石子，眼睛一亮。
- 乌鸦的羽毛是黑色的，有好几根长长的尾巴毛。 ~aside
- 乌鸦一下子就把瓶子打翻了，喝到了水。 ~retold

你讲《小猫钓鱼》，讲到小猫追蝴蝶的时候。
= 小猫扔下鱼竿，追着蝴蝶跑到草地上，扑了一下，没扑着，又扑了一下。
- 那天的天气很好，河边有很多石头。 ~aside
- 小猫坐在河边，一动也不动，一心一意地钓鱼。 ~retold

你讲《小猴子下山》，讲到小猴子看见西瓜的时候。
= 小猴子把手里的玉米一扔，抱起一个又大又圆的西瓜，笑得眼睛都眯成了一条缝。
- 那片西瓜地在山脚下，种了很多年了。 ~aside
- 小猴子看见了西瓜，没有理它，抱着玉米一直往前走。 ~retold

你讲《掩耳盗铃》，讲到他去偷铃的时候。
= 他用两只手紧紧捂住自己的耳朵，轻轻地，一步一步地走到门前。
- 那户人家的门是红色的，门前有两棵树。 ~aside
- 他请了几个朋友，大大方方地把铃取了下来。 ~retold

你讲《守株待兔》，讲到他天天等兔子的时候。
= 他天天坐在树桩旁边，眼睛看着草丛，地里的草长得比庄稼还高了。
- 那个树桩是一棵老槐树留下的。 ~aside
- 他每天还是认真地在地里干活。 ~retold

你讲《狐狸和乌鸦》，讲到乌鸦张嘴唱歌的时候。
= 乌鸦得意极了，张开嘴“哇——”地叫了一声，肉一下子掉了下去，正落进狐狸的嘴里。
- 乌鸦住在一棵大树上，树下有一个洞。 ~aside
- 乌鸦紧紧地叼着肉，一句话也不说。 ~retold

你讲《刻舟求剑》，讲到船靠岸以后的时候。
= 船一靠岸，他就挽起袖子，从刻着记号的地方“扑通”跳进水里，摸了半天，什么也没摸着。
- 那条船是木头做的，船上还坐着别的人。 ~aside
- 船一靠岸，他就回到剑掉下去的地方去找。 ~retold

你讲《井底之蛙》，讲到青蛙听说大海的时候。
= 青蛙听得张大了嘴巴，半天才说：“世上还有这么大的地方？”
- 那口井很深，井边长着小草。 ~aside
- 青蛙听了，马上跳出了井，跟着海龟去了大海。 ~retold

你讲《小壁虎借尾巴》，讲到小壁虎回到家的时候。
= 小壁虎转过身一看，自己身后长出了一条新尾巴，高兴得在墙上转了一个圈。
- 小壁虎的家在一面白白的墙上。 ~aside
- 小壁虎回到家，妈妈给它找来了一条新尾巴装上。 ~retold

你讲《画蛇添足》，讲到那个人给蛇画脚的时候。
= 他左手端着酒壶，右手拿着树枝，得意地说：“我还能给它画上脚呢！”一边说，一边一只一只地画。
- 他们喝的酒是从城里买来的。 ~aside
- 他画完了蛇，马上把酒喝了。 ~retold
`);

/** NEEDS_4 are the listeners of speaking-4-introducing, and what each needs to hear. */
const NEEDS_4 = parseRules(`
新同学刚到班上，向你问学校的情况。
= 教室在三楼东边，厕所在楼梯旁边，八点前到校，中午在一楼食堂吃饭。
- 我们学校是三十年前建的，第一任校长姓王。 ~needless
- 学校挺大的，你慢慢就知道了。 ~unclear

外地来的表哥想去你们城里的动物园，你向他介绍。
= 坐五路车到动物园站下车，门票二十元，早上八点开门，熊猫馆在进门左边。
- 动物园里有一只猴子特别调皮，上次抢了我的帽子。 ~needless
- 动物园挺好玩的，你去了就知道了。 ~unclear

爷爷想学用手机打视频电话，你给他介绍。
= 先点开这个绿色的图标，找到我的名字，点一下，再点下面的小摄像机，就能看见我了。
- 这个手机是去年买的，有很多好玩的游戏。 ~needless
- 很简单的，随便点一点就会了。 ~unclear

你向来做客的小朋友介绍你家的小狗，他有点怕狗。
= 它叫豆豆，很温顺，从来不咬人。你先别跑，让它闻闻你的手，它就会跟你玩了。
- 豆豆是爸爸从朋友家抱来的，它小时候只有手掌那么大。 ~needless
- 它是一只狗，你别管它就行。 ~unclear

班里要选图书管理员，你向大家介绍自己。
= 我叫李明，我很爱看书，每天都会整理自己的书架，借书还书我都能记得清清楚楚。
- 我叫李明，我最喜欢吃饺子，周末常常去游泳。 ~needless
- 我叫李明，你们选我吧。 ~unclear

外婆第一次来你家，想去附近的菜市场，你给她介绍。
= 出了小区大门往右走，过一个红绿灯，第二个路口左边就是菜市场，早上七点就开门了。
- 菜市场里有一家卖鱼的叔叔，嗓门特别大。 ~needless
- 很近的，就在那边。 ~unclear

你向低年级的同学介绍怎样借图书馆的书。
= 先带上借书卡，选好书交给阿姨登记，一次能借两本，两个星期以内要还。
- 图书馆的书架是木头做的，有好几排。 ~needless
- 借书很容易，你去问问就知道了。 ~unclear

新来的邻居问你小区里的垃圾怎么扔，你给他介绍。
= 垃圾桶在每栋楼的门口，绿色的放厨余垃圾，蓝色的放可回收的，早上七点到九点扔。
- 我们小区有一个大花园，春天花开得可好看了。 ~needless
- 跟大家一样扔就行了。 ~unclear

你向一位外国朋友介绍怎样用筷子。
= 一根筷子靠在大拇指和食指中间不动，另一根像拿笔一样夹着，动上面那根就能夹起菜。
- 中国人用筷子已经有几千年了。 ~needless
- 用筷子很容易，你多试几次就会了。 ~unclear

妈妈问你学校的运动会怎么报名，你给她介绍。
= 每人最多报两项，星期五以前把报名表交给体育委员，家长要在表上签名。
- 去年运动会我们班得了第二名，小华跑得最快。 ~needless
- 老师说过的，反正要报名。 ~unclear
`);

/** ORDER_4 are the things introduced in speaking-4-introducing, and the telling in a clear order. */
const ORDER_4 = parseRules(`
你向同学介绍你们学校。
= 走进校门，先是一个大操场；操场后面是教学楼；教学楼的左边是图书馆，右边是食堂。
- 食堂在教学楼右边，校门进去是操场，图书馆在教学楼左边，操场后面是教学楼。 ~order
- 图书馆在左边，食堂在右边，后来走进了校门，看到了操场。 ~order

你向客人介绍你的家。
= 一进门是客厅；客厅的左边是厨房，右边是爸爸妈妈的房间；走廊尽头是我的小房间。
- 我的房间在走廊尽头，厨房在左边，一进门是客厅，右边是爸爸妈妈的房间。 ~order
- 右边是爸爸妈妈的房间，然后进门，走廊尽头是客厅。 ~order

你向同学介绍怎样做一杯柠檬水。
= 先把柠檬洗干净，切成薄片；再放进杯子里，倒上温水；最后加一勺蜂蜜，搅一搅就好了。
- 加一勺蜂蜜，搅一搅，再把柠檬洗干净切片，倒上温水。 ~order
- 先倒温水，搅一搅，最后把柠檬洗干净，切成片。 ~order

你向弟弟介绍怎样系鞋带。
= 先把两根鞋带交叉，打一个结；再把一根绕成一个圈；然后用另一根绕过去，从下面穿出来；最后两边拉紧。
- 两边拉紧，再交叉打结，然后绕一个圈，从下面穿出来。 ~order
- 先绕一个圈，拉紧，最后才交叉打第一个结。 ~order

你向同学介绍一天的秋游安排。
= 早上八点在学校集合坐车；九点到公园先爬山；中午在山下吃午饭；下午去湖边划船，三点回学校。
- 下午去湖边划船，早上八点集合，中午吃午饭，九点到公园爬山。 ~order
- 三点回学校，然后吃午饭，最后早上集合出发。 ~order

你向奶奶介绍怎样用洗衣机洗衣服。
= 先把衣服放进洗衣机，倒进洗衣液；再关上盖子，按“开始”键；洗好了它会响，再把衣服拿出来晾。
- 把衣服拿出来晾，再倒洗衣液，按“开始”键，最后把衣服放进去。 ~order
- 先按“开始”键，等它响了，再放衣服、倒洗衣液。 ~order

你向同学介绍一种植物。
= 向日葵的根扎在土里，茎又粗又直，叶子大大的，长在茎的两边，最顶上是一个金黄的大花盘。
- 花盘是金黄的，根扎在土里，叶子大大的，茎又粗又直。 ~order
- 叶子长在花盘上面，花盘下面是根，根下面是茎。 ~order

你向客人介绍你们小区的公园。
= 从南门进去，先看到一个喷水池；往前走是一片草地；草地的北边有一个小湖，湖边有座亭子。
- 湖边有座亭子，南门进去，草地的北边是小湖，往前走是喷水池。 ~order
- 先到亭子，再从南门进去，最后看到喷水池。 ~order

你向同学介绍怎样种一粒豆子。
= 先把豆子在水里泡一夜；再在花盆里挖一个小坑，把豆子放进去；然后盖上土，浇一点水；每天放在有阳光的地方。
- 每天放在有阳光的地方，再泡一夜，挖坑，盖土浇水。 ~order
- 先盖上土浇水，再挖坑把豆子放进去，最后泡一夜。 ~order

你向妈妈介绍今天的语文课学了什么。
= 上课先听写了生字；接着老师带我们读课文；然后大家分组讨论问题；最后老师布置了作业。
- 老师布置了作业，先听写了生字，然后读课文，接着分组讨论。 ~order
- 先布置作业，最后听写生字，中间读课文、讨论问题。 ~order
`);

/** PHONE_4 are the calls of speaking-4-occasions: how to open and how to close. */
const PHONE_4 = parseRules(`
你打电话给同学小华，是他妈妈接的。
= 阿姨好，我是小华的同学李明，请问小华在家吗？
- 小华在吗？ ~noname
- 喂，快叫小华来接电话！ ~rude

你给王老师打电话请病假。
= 王老师您好，我是三年级二班的张小雨，我今天发烧了，想请一天假。
- 我今天发烧了，不去上学了。 ~noname
- 喂，我请假，就这样。 ~rude

你打电话问图书馆星期天开不开门，问清楚了。
= 好的，我知道了，谢谢您，再见！
- 哦。 ~abrupt
- 好的，我知道了。（没等对方说完就挂了电话） ~abrupt

你打电话给奶奶，祝她生日快乐，聊完了。
= 奶奶，祝您身体健康，我周末去看您，再见！
- 好了，挂了。 ~abrupt
- 没事了。 ~abrupt

你打电话找爸爸的同事刘叔叔，接电话的是别人。
= 您好，我是王强的孩子王小明，请问刘叔叔在吗？
- 刘叔叔呢？ ~noname
- 快去把刘叔叔找来。 ~rude

你打电话给小区物业，说楼道的灯坏了。
= 您好，我是三号楼二单元的住户，我们单元二楼的楼道灯坏了，麻烦你们来修一下。
- 灯坏了，你们来修。 ~noname
- 你们怎么搞的，灯又坏了！ ~harsh

同学打电话找你借书，你答应了。
= 好的，明天上学我把书带给你。再见！
- 嗯。（马上挂了电话） ~abrupt
- 行了行了。 ~abrupt

你打电话订一个生日蛋糕，说好了。
= 好的，那就星期六下午四点来取，谢谢您，再见！
- 就这样吧。 ~abrupt
- 好，挂了啊。 ~abrupt

你打错了电话，对方说不认识你要找的人。
= 对不起，我打错了，打扰您了。
- 哦，那算了。 ~abrupt
- 你怎么不认识他？ ~rude

你打电话给外公，外公耳朵不太好。
= 外公您好，我是您的外孙小明！我想问问您身体好不好。
- 是我，听得见吗？ ~noname
- 你怎么老是听不见啊！ ~harsh
`);

/** VISIT_4 are the visits of speaking-4-occasions, and what suits a guest. */
const VISIT_4 = parseRules(`
你到同学家做客，同学的妈妈给你端来了水果。
= 双手接过来，说：“谢谢阿姨。”
- 一声不吭，拿起来就吃。 ~rude
- 说：“我不喜欢吃这个，有没有别的？” ~unsuited

你到同学家做客，看见书架上有一本很好看的书。
= 先问同学：“我能看看这本书吗？”
- 自己拿下来就翻，看完扔在桌上。 ~unsuited
- 跟同学说：“这本书送给我吧。” ~unsuited

你到老师家做客，进门以后看见地上铺着地毯，大家都换了拖鞋。
= 也换上拖鞋，把自己的鞋放整齐。
- 穿着鞋直接走进去。 ~unsuited
- 说：“换鞋太麻烦了。” ~rude

你到朋友家做客，朋友的爷爷在睡午觉。
= 说话、走路都放轻一点，不吵醒爷爷。
- 照样大声说笑，跑来跑去。 ~unsuited
- 去把爷爷叫醒，跟他打招呼。 ~unsuited

你到亲戚家做客，吃饭的时候，你最爱吃的菜放在桌子的另一边。
= 等大家都动筷子了，再慢慢夹，不把一盘菜都夹到自己碗里。
- 站起来把那盘菜端到自己面前。 ~unsuited
- 大人还没动筷子，就先夹了一大碗。 ~unsuited

你到同学家做客，天晚了要回家。
= 叔叔阿姨，天晚了，我该回家了。谢谢你们的招待，再见！
- 我走了。（说完就出门了） ~abrupt
- 我不想回家，还要再玩一会儿。 ~unsuited

你到同学家做客，不小心打碎了一个杯子。
= 阿姨，对不起，我不小心把杯子打碎了，我来帮您收拾吧。
- 不是我打的，是它自己掉下去的。 ~blame
- 什么也不说，悄悄地把碎片踢到桌子底下。 ~unsuited

你第一次到同学家做客，开门的是同学的奶奶。
= 奶奶好，我是小丽的同学王芳，来找小丽一起写作业。
- 小丽在哪里？ ~noname
- 一句话也不说，直接往里走。 ~rude

你到朋友家做客，朋友拿出他的新玩具给你玩。
= 小心地玩，玩完了还给他，说：“谢谢，真好玩。”
- 玩得很用力，弄坏了也不说。 ~unsuited
- 说：“你这个玩具没有我家的好。” ~harsh

你到同学家做客，同学的妈妈问你：“饭菜合不合口味？”你觉得有点咸。
= 阿姨做的菜很好吃，谢谢阿姨。
- 太咸了，真难吃。 ~harsh
- 不说话，把菜都剩在碗里。 ~unsuited
`);

/** MOVE_4 are the matters of speaking-4-persuading, and the reason that moves the listener. */
const MOVE_4 = parseRules(`
爷爷总在饭后马上躺下睡觉，你想劝他。
= 爷爷，医生说饭后马上躺下对胃不好，您散散步再睡，身体会更好。
- 爷爷，饭后马上睡觉一点也不好看。 ~unmoved
- 爷爷，您不要饭后马上睡觉。 ~noreason

弟弟总是边吃饭边看动画片，你想劝他。
= 你边看边吃，饭都凉了，吃得慢，等你吃完，动画片早就演完了，还不如先吃完再看。
- 边吃饭边看动画片，是不对的。 ~noreason
- 我小时候就不这样。 ~unmoved

同桌上课总是偷偷玩橡皮，你想劝他。
= 你上次就是因为玩橡皮，没听到老师讲的题，考试的时候不会做。下课再玩吧。
- 你别玩了。 ~noreason
- 你的橡皮不好看，玩它干什么。 ~unmoved

妈妈总是加班到很晚，你想劝她早点休息。
= 妈妈，您太累了会生病的，您身体好了，我们全家才开心。
- 妈妈，您早点睡吧。 ~noreason
- 妈妈，加班的人都很笨。 ~unmoved

小区里有人在草地上乱扔垃圾，你想劝他。
= 叔叔，这片草地是大家散步的地方，垃圾扔在这里，小朋友玩的时候会被扎到。垃圾桶就在那边。
- 叔叔，不能乱扔垃圾。 ~noreason
- 叔叔，我妈妈说扔垃圾的人不好。 ~unmoved

好朋友因为一次没考好，不想再学数学了，你想劝他。
= 你上学期数学还得过优，这次只是没仔细看题。我们一起把错题弄懂，下次一定能考好。
- 你要好好学数学。 ~noreason
- 数学课的老师长得很高。 ~unmoved

爸爸开车的时候常常看手机，你想劝他。
= 爸爸，开车看手机很容易出事，我和妈妈都坐在车上，我们都希望您平平安安的。
- 爸爸，开车不要看手机。 ~noreason
- 爸爸，您的手机太旧了。 ~unmoved

表妹不肯刷牙就要睡觉，你想劝她。
= 你不刷牙，牙齿上的小虫子晚上就会把牙咬出洞，到时候吃糖都会疼。
- 不刷牙不行。 ~noreason
- 我已经刷过牙了。 ~unmoved

同学想下课去河边玩水，你想劝他。
= 河边的石头很滑，水也比看上去深，上个月就有人掉进去了。我们去操场踢球吧，一样好玩。
- 你别去河边。 ~noreason
- 河边的风景不好看。 ~unmoved

奶奶舍不得扔掉已经坏了的饭菜，你想劝她。
= 奶奶，饭菜坏了吃下去会肚子疼，还要去医院，花的钱比这碗菜多多了。
- 奶奶，坏了的饭菜要扔掉。 ~noreason
- 奶奶，别人家早就扔了。 ~unmoved
`);

/** GENTLE_4 are the matters of speaking-4-persuading, and the gentle wording. */
const GENTLE_4 = parseRules(`
同学在图书馆里大声说话，你想劝他。
= 小声点好吗？大家都在看书呢。
- 你吵死了，闭嘴！ ~harsh
- 你再说话我就告诉老师！ ~harsh

弟弟把玩具扔得满地都是，你想劝他收拾。
= 弟弟，我们一起把玩具放回箱子里吧，下次你想玩就好找了。
- 你怎么这么乱，快收拾！ ~harsh
- 不收拾我就把你的玩具全扔了。 ~harsh

奶奶过马路时想闯红灯，你想劝她。
= 奶奶，红灯还没变呢，我们等一等，绿灯亮了再一起走。
- 奶奶，你怎么连红灯都不知道！ ~rude
- 要走你自己走，我不走。 ~harsh

同学排队时插到了你前面，你想劝他。
= 同学，我们都在排队，请你到后面排好吗？
- 你插什么队，滚到后面去！ ~rude
- 一把把他推出队伍。 ~harsh

邻居叔叔在楼道里抽烟，你想劝他。
= 叔叔，楼道里有小宝宝，烟味对他不好，您能到外面去抽吗？
- 叔叔，抽烟太臭了！ ~rude
- 捂着鼻子，大声说：“真讨厌！” ~rude

好朋友总是拿你的东西不还，你想劝他。
= 上次借你的铅笔，你用完能还给我吗？我也要用。
- 你这个小偷，快把东西还我！ ~harsh
- 以后我再也不借给你了。 ~harsh

妈妈要把你最喜欢的旧毛衣扔掉，你想劝她留下。
= 妈妈，这件毛衣是外婆织的，我很喜欢，能留下来吗？我可以把它放在柜子里。
- 你不许扔！ ~harsh
- 你要是扔了，我就不理你了。 ~pushy

同学在走廊上追跑，你想劝他。
= 走廊上人多，跑起来容易撞到人，我们慢慢走吧。
- 你跑什么跑，找死啊！ ~rude
- 你再跑，我就让你摔一跤。 ~harsh

爷爷总是忘记吃药，你想劝他记着。
= 爷爷，我给您做了一张小卡片贴在饭桌上，吃完饭看一眼，就不会忘了。
- 爷爷，您怎么又忘了，真是老糊涂了。 ~rude
- 您不吃药，我以后就不管您了。 ~harsh

同学不肯和新来的小朋友一起玩，你想劝他。
= 他刚来，一个朋友也没有，心里一定很孤单。我们叫上他一起玩吧，人多更好玩。
- 你怎么这么小气！ ~harsh
- 你不跟他玩，我也不跟你玩了。 ~pushy
`);

/** TELLING_HEADS_4 and ORDER_HEADS_4 are the headings of the steps of telling a story and of introducing in order. */
const TELLING_HEADS_4 = {
  find: t("Step 1: picture the moment of the story.", "第一步：想象故事里这个时候的样子。"),
  choose: t("Step 2: choose what lets the listener see it.", "第二步：选出让听的人像看见了一样的讲法。"),
};
const ORDER_HEADS_4 = {
  find: t("Step 1: find the order of the thing introduced.", "第一步：找出要介绍的东西的顺序。"),
  choose: t("Step 2: choose the telling that keeps it.", "第二步：选出按这个顺序介绍的一种。"),
};

/** SPECS_4 are the speaking topics of grade 4, in order. */
const SPECS_4: readonly Spec[] = [
  {
    grade: 4,
    id: "speaking-4-storytelling",
    title: t("Telling a Story Vividly", "生动地讲故事"),
    summary: t(
      "Telling a known story so that listeners see it: what the characters do and say, and the detail that brings a moment alive.",
      "讲一个熟悉的故事，让听的人像看见了一样：讲出人物的动作和话，加上让故事活起来的细节。",
    ),
    intro: t(
      "A story told vividly lets the listener see it happen. Not “兔子撞死在树桩上”, but: “一只兔子从草丛里蹿出来，‘砰’的一声撞在树桩上，腿一蹬，不动了。”\n\nThe actions, the sounds and the words said bring it alive, and the story stays as it is. The first knowledge point chooses the livelier telling, the second the detail that brings a moment alive.",
      "生动地讲故事，要让听的人像看见了一样。不说“兔子撞死在树桩上”，而说：“一只兔子从草丛里蹿出来，‘砰’的一声撞在树桩上，腿一蹬，不动了。”\n\n动作、声音和人物说的话，能让故事活起来；故事的内容不能讲错。第一个知识点选出讲得更生动的一种，第二个选出让故事活起来的细节。",
    ),
    texts: [...ruleTexts(LIVELY_4), ...ruleTexts(DETAIL_4)],
    after: ["speaking-3-telling"],
    points: [
      [
        "livelier",
        t("The Livelier Telling", "讲得更生动"),
        t(
          "Tell the moment with what the characters do, one action after another, the sounds, and what they say, in their own words.\n\nThe fox caught by the tiger: “狐狸眼珠子骨碌一转，扯着嗓子说：‘你敢吃我？’” shows its trick.\n\n> **Watch out.** Lively is not made up. A telling that changes what happens, such as the tiger eating the fox, is not the story any more.",
          "讲到这个地方，要一个动作接一个动作地讲人物做了什么，讲出声音，用人物自己的话讲出他说了什么。\n\n比如狐狸被老虎抓住：“狐狸眼珠子骨碌一转，扯着嗓子说：‘你敢吃我？’”讲出了它的心眼。\n\n> **注意。** 生动不是乱编。把故事讲变了，比如老虎把狐狸吃了，就不是原来的故事了。",
        ),
        ruleGenerator(
          t("Which telling brings this moment alive?", "哪一种讲得更生动？"),
          LIVELY_4,
          rule(
            t(
              "Tell the moment with the characters' actions, the sounds and their words, keeping what happens.",
              "讲出人物的动作、声音和说的话，故事的内容不变。",
            ),
            t(
              "Picture it as you hear it: you can see the characters and hear them, and the story is the one you know.",
              "一边听一边想象：看得见人物，听得见他们说话，故事还是原来的故事。",
            ),
            TELLING_HEADS_4,
          ),
        ),
      ],
      [
        "detail",
        t("The Detail That Brings It Alive", "让故事活起来的细节"),
        t(
          "A detail brings a moment alive when it shows what the character does, feels or sees just then.\n\nThe crow thinking how to drink: “乌鸦歪着脑袋，看看瓶子，又看看地上的小石子，眼睛一亮。” shows the idea coming.\n\n> **Watch out.** A true detail of something else, such as the colour of the crow's feathers, does not help this moment; and a detail that changes the story is wrong.",
          "细节能让故事活起来，是因为它写出了人物这时在做什么、想什么、看到了什么。\n\n比如乌鸦想办法喝水：“乌鸦歪着脑袋，看看瓶子，又看看地上的小石子，眼睛一亮。”讲出了它想到办法的样子。\n\n> **注意。** 和这个时候没关系的细节，比如乌鸦羽毛的颜色，帮不了这一段；把故事讲变了的细节更不对。",
        ),
        ruleGenerator(
          t("Which detail brings this moment of the story alive?", "哪个细节最能让故事里这个时候活起来？"),
          DETAIL_4,
          rule(
            t(
              "Choose the detail that shows what the character does, feels or sees at just this moment.",
              "选出写人物这时在做什么、想什么、看到什么的细节。",
            ),
            t(
              "Put the detail into the story and tell it again: the moment comes alive, and the story is unchanged.",
              "把细节放进故事里再讲一遍：这一段活起来了，故事也没有变。",
            ),
            TELLING_HEADS_4,
          ),
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "speaking-4-introducing",
    title: t("Introducing, With the Listener in Mind", "介绍：想着听的人"),
    summary: t(
      "Introducing a place, a thing or how to do something: saying what this listener needs, in a clear order.",
      "介绍一个地方、一样东西或者怎样做一件事：说出听的人需要知道的，按清楚的顺序说。",
    ),
    intro: t(
      "To introduce something, ask who is listening and what they need. A new classmate needs where the classroom is, when to arrive and where to eat, not when the school was built.\n\nThen say it in an order the listener can follow: from the gate inward, or step by step. The first knowledge point says what the listener needs, the second keeps the order.",
      "介绍的时候，先想想听的人是谁，他需要知道什么。新同学需要知道教室在哪里、几点到校、在哪里吃饭，不需要知道学校是哪一年建的。\n\n再按听的人跟得上的顺序说：从大门往里说，或者一步一步地说。第一个知识点说出听的人需要的，第二个按顺序说。",
    ),
    texts: [...ruleTexts(NEEDS_4), ...ruleTexts(ORDER_4)],
    after: ["speaking-3-relaying"],
    points: [
      [
        "needs",
        t("What This Listener Needs", "听的人需要什么"),
        t(
          "Think of the listener and what they will do with what you say, and tell them just that, clearly: the way, the time, the steps.\n\nGrandpa learning a video call needs which button to press, in turn: “先点开这个绿色的图标，找到我的名字……”\n\n> **Watch out.** A true but needless fact, such as when the phone was bought, wastes the listener's time; and “你去了就知道了” tells them nothing.",
          "想想听的人是谁，听了要去做什么，就告诉他这些，说清楚：怎么走，什么时间，怎么做。\n\n比如爷爷学打视频电话，需要知道按哪里、先按什么：“先点开这个绿色的图标，找到我的名字……”\n\n> **注意。** 说的是真的却用不上，比如手机是哪年买的，白白浪费听的人的时间；说“你去了就知道了”，等于什么也没说。",
        ),
        ruleGenerator(
          t("Which introduction gives this listener what they need?", "哪一种介绍说出了听的人需要的？"),
          NEEDS_4,
          rule(
            t("Ask what this listener will do with what you say, and tell them that clearly.", "想一想听的人听了要做什么，把这些说清楚。"),
            t(
              "Imagine the listener acting on it: they can do what they meant to, and nothing they needed was left out.",
              "想一想听的人照着做：他能做成想做的事，需要的也都知道了。",
            ),
          ),
        ),
      ],
      [
        "order",
        t("A Clear Order", "按顺序介绍"),
        t(
          "A place is introduced as one walks through it, or from near to far; a task is introduced step by step, in the order it is done.\n\nYour home: “一进门是客厅；客厅的左边是厨房……走廊尽头是我的小房间。”\n\n> **Watch out.** The same parts said in a jumbled order lose the listener, and steps in the wrong order cannot be followed: honey cannot go in before the cup is filled.",
          "介绍地方，可以按走进去的路线说，或者从近到远说；介绍做事，要按做的先后一步一步地说。\n\n比如介绍家：“一进门是客厅；客厅的左边是厨房……走廊尽头是我的小房间。”\n\n> **注意。** 同样几部分，顺序乱了，听的人就糊涂了；步骤颠倒了，照着也做不成。",
        ),
        ruleGenerator(
          t("Which introduction goes in a clear order?", "哪一种介绍得有顺序？"),
          ORDER_4,
          rule(
            t(
              "Find the order of the thing, the way through a place or the steps of a task, and say each part in turn.",
              "找出顺序：地方按路线，做事按步骤，一部分一部分地说。",
            ),
            t(
              "Follow the introduction in your mind: each part comes where you would meet it, or when you would do it.",
              "在心里跟着走一遍：每一部分都在走到它或做到它的时候出现。",
            ),
            ORDER_HEADS_4,
          ),
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "speaking-4-occasions",
    title: t("On the Phone and as a Guest", "打电话和做客"),
    summary: t(
      "Speaking on the phone, opening with a greeting and who one is and closing with thanks and goodbye, and speaking and acting as a guest.",
      "打电话时，开头问好、说清自己是谁，结尾道谢、道别；做客时说话做事有礼貌。",
    ),
    intro: t(
      "On the phone the other person cannot see you, so say who you are and whom you want: “阿姨好，我是小华的同学李明，请问小华在家吗？” And end with thanks and a goodbye before hanging up.\n\nIn someone's home, ask before you touch, thank your hosts, and keep their ways. The first knowledge point opens and closes a call, the second speaks and acts as a guest.",
      "打电话时对方看不见你，要说清自己是谁、找谁：“阿姨好，我是小华的同学李明，请问小华在家吗？”说完了，要道谢、道别，再挂电话。\n\n到别人家做客，动东西以前要先问，主人招待要道谢，还要照主人家的规矩做。第一个知识点学打电话的开头和结尾，第二个学做客时怎样说、怎样做。",
    ),
    texts: [...ruleTexts(PHONE_4), ...ruleTexts(VISIT_4)],
    after: ["speaking-3-listening"],
    points: [
      [
        "phone",
        t("Opening and Closing a Call", "电话的开头和结尾"),
        t(
          "Open with a greeting, who you are, and whom you want or why you call; close with thanks if you were helped, and a goodbye.\n\nTo the teacher: “王老师您好，我是三年级二班的张小雨……” and at the end “谢谢您，再见！”\n\n> **Watch out.** “小华在吗？” does not say who is calling; and hanging up with “哦” leaves the other person unsure the call is over.",
          "开头先问好，说清自己是谁，要找谁或者为什么打电话；结尾别人帮了忙要道谢，再说“再见”。\n\n比如给老师打电话：“王老师您好，我是三年级二班的张小雨……”最后说“谢谢您，再见！”\n\n> **注意。** “小华在吗？”没说自己是谁；说一声“哦”就挂电话，对方不知道你是不是说完了。",
        ),
        ruleGenerator(
          t("What should you say on the phone here?", "打电话时这里该怎么说？"),
          PHONE_4,
          rule(
            t(
              "Open with a greeting and who you are and whom you want; close with thanks and a goodbye.",
              "开头问好，说清自己是谁、找谁；结尾道谢、道别。",
            ),
            t(
              "Imagine the other person hearing it: they know who is calling and why, or that the call has ended kindly.",
              "想一想对方听了：知道是谁打来的、为什么打来，或者知道电话好好地说完了。",
            ),
          ),
        ),
      ],
      [
        "visit",
        t("As a Guest", "做客的礼貌"),
        t(
          "A guest thanks the hosts, asks before using what is theirs, keeps their ways, and says goodbye when leaving.\n\nOffered fruit: take it with both hands and say “谢谢阿姨。” Liking a book on the shelf: ask “我能看看这本书吗？”\n\n> **Watch out.** Telling the hosts their food is bad, or asking for their things, hurts them, even if it is what you think. Say what is kind and true: “阿姨做的菜很好吃，谢谢阿姨。”",
          "做客时，主人招待要道谢，用主人的东西要先问，要照主人家的规矩做，走的时候要道别。\n\n比如阿姨端来水果，双手接过来说“谢谢阿姨。”看到书架上好看的书，先问“我能看看这本书吗？”\n\n> **注意。** 说主人的菜难吃，或者向主人要东西，就算是心里话，也会让人难过。要说真心又友好的话：“阿姨做的菜很好吃，谢谢阿姨。”",
        ),
        ruleGenerator(
          t("What should a guest say or do here?", "做客时这里该怎么说、怎么做？"),
          VISIT_4,
          rule(
            t("Thank the hosts, ask before using what is theirs, and keep their ways.", "向主人道谢，用主人的东西先问，照主人家的规矩做。"),
            t(
              "Imagine the hosts seeing it: they are glad to have you, and would ask you again.",
              "想一想主人看到了：很高兴你来，下次还想请你。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 4,
    id: "speaking-4-persuading",
    title: t("Persuading Kindly", "劝说"),
    summary: t(
      "Persuading someone to change what they do: giving the reason that matters to them, in gentle words.",
      "劝别人改变做法：说出对他有用的理由，用温和的话说。",
    ),
    intro: t(
      "To persuade, give a reason that matters to the one you persuade, and say it kindly. To a father who looks at his phone while driving: “开车看手机很容易出事，我和妈妈都坐在车上，我们都希望您平平安安的。”\n\nA reason that has nothing to do with them does not move them, and sharp words make them stop listening. The first knowledge point chooses the reason, the second the gentle wording.",
      "劝说别人，要说出对他有用的理由，还要好好地说。劝开车看手机的爸爸：“开车看手机很容易出事，我和妈妈都坐在车上，我们都希望您平平安安的。”\n\n和他没关系的理由打动不了他；话说得太冲，他就不想听了。第一个知识点选出打动人的理由，第二个选出温和的说法。",
    ),
    texts: [...ruleTexts(MOVE_4), ...ruleTexts(GENTLE_4)],
    after: ["speaking-3-discussing"],
    points: [
      [
        "reason",
        t("The Reason That Moves Them", "打动人的理由"),
        t(
          "Think what the person cares about, their health, their time, what they want, and give the reason that touches it; then offer a better way.\n\nTo a brother watching cartoons at dinner: the food gets cold, and by the time he finishes the cartoon is over.\n\n> **Watch out.** “不能这样” without a reason does not move anyone, and a reason about something they do not care for, such as how it looks, moves them no more.",
          "想一想被劝的人关心什么：身体、时间、想要的东西，说出和这些有关的理由，再给出更好的办法。\n\n比如劝边吃饭边看动画片的弟弟：饭会凉，等吃完了，动画片也演完了。\n\n> **注意。** 只说“不能这样”，没有理由，打动不了人；理由说的是他不在乎的事，比如好不好看，也打动不了他。",
        ),
        ruleGenerator(
          t("Which reason will move this person most?", "哪个理由最能打动被劝的人？"),
          MOVE_4,
          rule(
            t("Think what the person cares about, and give the reason that touches it.", "想一想被劝的人关心什么，说出和它有关的理由。"),
            t(
              "Imagine being the one persuaded: the reason matters to you, and you would want to change.",
              "把自己当成被劝的人想一想：这个理由和自己有关，愿意改一改。",
            ),
          ),
        ),
      ],
      [
        "gentle",
        t("Gentle Words", "温和的说法"),
        t(
          "Say it as a request, not an order: 好吗, 能……吗, 我们一起……; and say why, so the other sees you mean well.\n\nIn the library: “小声点好吗？大家都在看书呢。”\n\n> **Watch out.** Names, threats and “你怎么……” make the other angry instead of willing. Even when they are wrong, speak to them kindly.",
          "用商量的口气说，不用命令的口气：“好吗”“能……吗”“我们一起……”；还要说出为什么，让对方知道你是好意。\n\n比如在图书馆：“小声点好吗？大家都在看书呢。”\n\n> **注意。** 骂人、吓唬人、说“你怎么……”，只会让对方生气，不会让他愿意改。就算是他做得不对，也要好好地说。",
        ),
        ruleGenerator(
          t("Which way of saying it is best?", "哪种说法最好？"),
          GENTLE_4,
          rule(
            t("Ask, do not order, and say why, so that the other sees you mean well.", "用商量的口气说，说出为什么，让对方知道你是好意。"),
            t(
              "Imagine hearing it yourself: you are not hurt, and you would be willing to do as asked.",
              "想一想自己听到这句话：心里不难受，也愿意照着做。",
            ),
          ),
        ),
      ],
    ],
  },
];

/** stageThreeFourSpeaking are the speaking topics of grades 3 and 4, in order, each after the reading and speaking before it. */
export const stageThreeFourSpeaking: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of [...SPECS_3, ...SPECS_4])
    built.push(
      topicOf(
        spec,
        [...stageSpeakingTopics, ...stageThreeFourReading, ...built].map((x) => x.topic),
      ),
    );
  return built;
})();
