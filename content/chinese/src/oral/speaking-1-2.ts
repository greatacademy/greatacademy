// The speaking topics of grades 1 and 2 (docs/chinese-curriculum.md §18.9): listening, talking politely and telling
// things clearly in grade 1, asking, passing on a message and talking things over in grade 2. The scenes and the words
// said are written for this subject. Until their recordings are made, what is said is shown as text to be read as if
// heard; the choice of the fitting reply is the same either way.

import { type Generator, type Text, type TopicDef, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { stageReadingTopics } from "../reading/stage-1-2.ts";
import {
  type Piece,
  parsePieces,
  parseRules,
  pieceGenerator,
  prerequisitesOf,
  type Rule,
  type RuleItem,
  readableAfter,
  ruleGenerator,
  TALK,
} from "../reading/topic-kit.ts";

/** TALKS are the short talks of speaking-1-listening: who speaks, what they say, and what they ask for. */
const TALKS = parsePieces(
  `
# 老师说
同学们，明天我们去公园春游。早上八点在学校门口集合，请带上水和帽子。
?1 这段话讲的是什么事？ | What is the talk about?
= 明天去公园春游 | 明天我们去公园春游
- 今天要早放学 ~unsaid
- 明天去公园种树 ~changed
?2 老师请大家做什么？ | What does the teacher ask everyone to do?
= 带上水和帽子 | 请带上水和帽子
- 带上书包和作业 ~unsaid
- 八点到公园门口 ~changed

# 妈妈说
小明，我去楼下买菜，一会儿就回来。有人叫门，先问问是谁，不认识的人不要开门。
?1 这段话讲的是什么事？ | What is the talk about?
= 妈妈去楼下买菜 | 我去楼下买菜
- 妈妈去上班 ~unsaid
- 家里有客人要来 ~unsaid
?2 妈妈请小明做什么？ | What does Mother ask Xiaoming to do?
= 不认识的人叫门，不要开门 | 不认识的人不要开门
- 有人叫门就马上开门 ~opposite
- 跟妈妈一起去买菜 ~unsaid

# 老师说
下午的音乐课改在教室里上，因为外面下雨了。请大家下课后不要去操场。
?1 这段话讲的是什么事？ | What is the talk about?
= 音乐课改在教室里上 | 下午的音乐课改在教室里上
- 下午不上音乐课了 ~changed
- 下午去操场上音乐课 ~opposite
?2 老师请大家做什么？ | What does the teacher ask everyone to do?
= 下课后不要去操场 | 请大家下课后不要去操场
- 下课后去操场 ~opposite
- 带上雨伞 ~unsaid

# 爸爸说
今天是奶奶的生日，晚上我们去奶奶家吃饭。你放学回家，先把作业写完。
?1 这段话讲的是什么事？ | What is the talk about?
= 晚上去奶奶家，给奶奶过生日 | 今天是奶奶的生日，晚上我们去奶奶家吃饭
- 奶奶晚上来我们家 ~changed
- 明天去奶奶家 ~changed
?2 爸爸请你做什么？ | What does Father ask you to do?
= 放学回家先把作业写完 | 你放学回家，先把作业写完
- 放学后马上去奶奶家 ~changed
- 给奶奶买礼物 ~unsaid

# 同学说
小红，我的笔找不到了，你看见了吗？是一支蓝色的，上面有一只小熊。
?1 这段话讲的是什么事？ | What is the talk about?
= 同学的笔找不到了 | 我的笔找不到了
- 同学想用小红的笔 ~unsaid
- 同学买了一支新笔 ~unsaid
?2 同学请小红做什么？ | What does the classmate ask Xiaohong?
= 说说有没有看见他的笔 | 你看见了吗
- 给他一支笔 ~unsaid
- 帮他买一支红笔 ~unsaid

# 老师说
明天是星期六，学校不上课。下星期一早上，请把画好的画带来。
?1 这段话讲的是什么事？ | What is the talk about?
= 明天不上课 | 明天是星期六，学校不上课
- 明天要考试 ~unsaid
- 星期六上画画课 ~changed
?2 老师请大家做什么？ | What does the teacher ask everyone to do?
= 下星期一早上把画好的画带来 | 下星期一早上，请把画好的画带来
- 明天把画带来 ~changed
- 星期一早上带上彩笔 ~unsaid

# 图书馆的阿姨说
小朋友，这本书你可以带回家看，但是两个星期以后要还回来，不要在书上写字。
?1 这段话讲的是什么事？ | What is the talk about?
= 借书回家看 | 这本书你可以带回家看
- 买一本书 ~unsaid
- 只能在这里看书 ~opposite
?2 阿姨请小朋友做什么？ | What does the librarian ask the child to do?
= 两个星期以后把书还回来 | 两个星期以后要还回来
- 一个星期以后还书 ~changed
- 在书上写上名字 ~opposite

# 妈妈说
外面很冷，要下雪了。出门前穿上大衣，带上帽子。
?1 这段话讲的是什么事？ | What is the talk about?
= 外面很冷，要下雪了 | 外面很冷，要下雪了
- 外面在下雨 ~changed
- 今天很热 ~opposite
?2 妈妈请你做什么？ | What does Mother ask you to do?
= 穿上大衣，带上帽子 | 出门前穿上大衣，带上帽子
- 带上雨伞 ~unsaid
- 只穿上大衣 ~part

# 老师说
同学们，今天我们学了“春”字。回家以后把它写五遍，再找一找春天的花。
?1 这段话讲的是什么事？ | What is the talk about?
= 今天学了“春”字 | 今天我们学了“春”字
- 今天去看了花 ~unsaid
- 明天要学“春”字 ~changed
?2 老师请大家做什么？ | What does the teacher ask everyone to do?
= 写五遍“春”字，再找春天的花 | 回家以后把它写五遍，再找一找春天的花
- 写十遍“春”字 ~changed
- 只写五遍“春”字 ~part

# 哥哥说
我要去打球了。妈妈回来的时候，你跟她说，我六点前回家吃饭。
?1 这段话讲的是什么事？ | What is the talk about?
= 哥哥要去打球 | 我要去打球了
- 哥哥要去上学 ~unsaid
- 哥哥要回家吃饭 ~other
?2 哥哥请你做什么？ | What does your brother ask you to do?
= 跟妈妈说，哥哥六点前回家 | 你跟她说，我六点前回家吃饭
- 跟妈妈说，哥哥七点回家 ~changed
- 和哥哥一起去打球 ~unsaid
`,
  2,
);

/** MESSAGES are the messages of speaking-2-messages: who says it, for whom, and what is to be passed on. */
const MESSAGES = parsePieces(
  `
# 李阿姨打电话来说
小明，请跟你妈妈说，明天上午十点，我到你家来拿书。
?1 小明转告时，怎样说才完整？ | How does Xiaoming pass on the whole message?
= 妈妈，李阿姨说明天上午十点来我们家拿书。 | 明天上午十点，我到你家来拿书
- 妈妈，李阿姨说要来拿书。 ~missing
- 妈妈，李阿姨说明天下午来拿书。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 妈妈 | 请跟你妈妈说
- 爸爸 ~who
- 李阿姨 ~who
?2 李阿姨什么时候来？ | When will Aunt Li come?
= 明天上午十点 | 明天上午十点
- 今天上午十点 ~changed
- 明天下午 ~changed

# 老师对小红说
小红，请跟小方说，明天的美术课要带彩笔和白纸。
?1 小红转告时，怎样说才完整？ | How does Xiaohong pass on the whole message?
= 小方，老师说明天的美术课要带彩笔和白纸。 | 明天的美术课要带彩笔和白纸
- 小方，老师说要带彩笔。 ~missing
- 小方，老师说明天的音乐课要带彩笔和白纸。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 小方 | 请跟小方说
- 小红 ~who
- 老师 ~who
?2 什么时候要带彩笔和白纸？ | When are the pens and paper needed?
= 明天的美术课 | 明天的美术课
- 今天的美术课 ~changed
- 明天的音乐课 ~changed

# 爷爷对你说
你爸爸回来，跟他说，今天晚上七点，我在楼下等他一起去散步。
?1 你转告时，怎样说才完整？ | How do you pass on the whole message?
= 爸爸，爷爷说今天晚上七点在楼下等你，一起去散步。 | 今天晚上七点，我在楼下等他一起去散步
- 爸爸，爷爷要去散步。 ~missing
- 爸爸，爷爷说明天晚上七点在楼下等你。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 爸爸 | 你爸爸回来，跟他说
- 妈妈 ~who
- 爷爷 ~who
?2 爷爷什么时候在楼下等？ | When will Grandpa wait downstairs?
= 今天晚上七点 | 今天晚上七点
- 明天晚上七点 ~changed
- 今天早上七点 ~changed

# 邻居叔叔说
请跟你奶奶说，她的报纸送到我家了，下午我给她送过去。
?1 你转告时，怎样说才完整？ | How do you pass on the whole message?
= 奶奶，邻居叔叔说您的报纸送到他家了，下午他给您送过来。 | 她的报纸送到我家了，下午我给她送过去
- 奶奶，有您的报纸。 ~missing
- 奶奶，邻居叔叔说您去他家拿报纸。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 奶奶 | 请跟你奶奶说
- 爷爷 ~who
- 邻居叔叔 ~who
?2 叔叔什么时候把报纸送过来？ | When will the neighbour bring the paper?
= 下午 | 下午我给她送过去
- 上午 ~changed
- 明天 ~changed

# 音乐老师说
请跟你们班的同学说，星期四的音乐课改到星期五了。
?1 你转告时，怎样说才完整？ | How do you pass on the whole message?
= 同学们，音乐老师说星期四的音乐课改到星期五了。 | 星期四的音乐课改到星期五了
- 同学们，音乐课改了。 ~missing
- 同学们，音乐老师说星期五的音乐课改到星期四了。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 班上的同学 | 请跟你们班的同学说
- 别的班的同学 ~who
- 爸爸妈妈 ~who
?2 音乐课改到了什么时候？ | To when is the music lesson moved?
= 星期五 | 改到星期五了
- 星期四 ~changed
- 星期六 ~changed

# 姐姐说
妈妈回来的时候，跟她说，我去图书馆了，五点回来。
?1 你转告时，怎样说才完整？ | How do you pass on the whole message?
= 妈妈，姐姐去图书馆了，五点回来。 | 我去图书馆了，五点回来
- 妈妈，姐姐出去了。 ~missing
- 妈妈，姐姐去公园了，五点回来。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 妈妈 | 跟她说
- 爸爸 ~who
- 姐姐 ~who
?2 姐姐几点回来？ | At what time will your sister be back?
= 五点 | 五点回来
- 四点 ~changed
- 六点 ~changed

# 王老师打电话来说
请跟你爸爸说，明天下午三点开家长会，在二年级一班的教室。
?1 你转告时，怎样说才完整？ | How do you pass on the whole message?
= 爸爸，王老师说明天下午三点开家长会，在二年级一班的教室。 | 明天下午三点开家长会，在二年级一班的教室
- 爸爸，王老师说要开家长会。 ~missing
- 爸爸，王老师说明天上午三点开家长会。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 爸爸 | 请跟你爸爸说
- 王老师 ~who
- 妈妈 ~who
?2 家长会什么时候开？ | When is the parents' meeting?
= 明天下午三点 | 明天下午三点
- 今天下午三点 ~changed
- 明天上午十点 ~changed

# 妈妈说
你跟小明说，他的水杯忘在我们家了，明天你带去学校给他。
?1 你转告时，怎样说才完整？ | How do you pass on the whole message?
= 小明，你的水杯忘在我家了，明天我带来给你。 | 他的水杯忘在我们家了，明天你带去学校给他
- 小明，你的水杯。 ~missing
- 小明，你的书包忘在我家了。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 小明 | 你跟小明说
- 妈妈 ~who
- 老师 ~who
?2 什么时候把水杯带给小明？ | When will the cup be brought to Xiaoming?
= 明天 | 明天你带去学校给他
- 今天 ~changed
- 下个星期 ~changed

# 张爷爷说
请跟你爷爷说，星期天早上，我们一起去公园下棋。
?1 你转告时，怎样说才完整？ | How do you pass on the whole message?
= 爷爷，张爷爷说星期天早上和您一起去公园下棋。 | 星期天早上，我们一起去公园下棋
- 爷爷，张爷爷要下棋。 ~missing
- 爷爷，张爷爷说星期六早上去公园下棋。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 爷爷 | 请跟你爷爷说
- 张爷爷 ~who
- 爸爸 ~who
?2 什么时候去公园下棋？ | When will they play chess in the park?
= 星期天早上 | 星期天早上
- 星期六早上 ~changed
- 星期天晚上 ~changed

# 班长说
请跟小江说，明天早上七点半到学校打扫教室。
?1 你转告时，怎样说才完整？ | How do you pass on the whole message?
= 小江，班长说明天早上七点半到学校打扫教室。 | 明天早上七点半到学校打扫教室
- 小江，班长说要打扫教室。 ~missing
- 小江，班长说明天早上八点半到学校。 ~changed
?2 这个口信要跟谁说？ | For whom is the message?
= 小江 | 请跟小江说
- 班长 ~who
- 小方 ~who
?2 什么时候到学校？ | When must one be at school?
= 明天早上七点半 | 明天早上七点半
- 明天早上八点半 ~changed
- 今天早上七点半 ~changed
`,
  2,
);

/** GREETING are the scenes of greeting, thanking and saying sorry. */
const GREETING = parseRules(`
早上到学校，看见了李老师。
= 李老师，早上好！
- 喂，你来了。 ~rude
- 李老师，再见！ ~off

同学帮你找到了你的书。
= 谢谢你！
- 这是我的书。 ~off
- 你怎么才找到？ ~harsh

你走路时不小心撞到了同学。
= 对不起，我不是故意的。
- 谁让你站在这里？ ~blame
- 没关系。 ~off

奶奶给你拿来一杯水。
= 谢谢奶奶！
- 我不要喝。 ~rude
- 奶奶好！ ~off

放学了，你要走出教室，老师还在。
= 老师，再见！
- 老师，早上好！ ~off
- 走了走了！ ~rude

同学对你说：“对不起，我把你的书弄破了。”
= 没关系，下次小心一点。
- 你要给我买新的！ ~harsh
- 谢谢你！ ~off

你把同学的水杯打翻了。
= 对不起，我帮你擦干净。
- 是水杯自己倒的。 ~blame
- 谁让你的杯子放在这里？ ~blame

客人来家里，送了你一本书。
= 谢谢阿姨！
- 我已经有这本书了。 ~rude
- 阿姨，再见！ ~off

早上出门上学，跟妈妈说话。
= 妈妈，我上学去了，再见！
- 妈妈，晚上好！ ~off
- 我走了，别管我。 ~harsh

上课了，你来晚了，站在教室门口。
= 报告！老师，对不起，我来晚了。
- 不说话，走进去坐下。 ~rude
- 老师，你为什么不等我？ ~blame
`);

/** TURNS are the scenes of asking to borrow and waiting one's turn. */
const TURNS = parseRules(`
你想用一下同桌的小刀。
= 我能用一下你的小刀吗？
- 小刀给我！ ~rude
- 你的小刀真好看。 ~unclear

大家排队洗手，你来晚了。
= 站到队伍的最后面等。
- 走到最前面去洗。 ~queue
- 跟前面的同学说：“让我先洗。” ~queue

同学正在说话，你也想说。
= 等他说完，再说自己的。
- 马上大声说自己的。 ~cutin
- 说：“你别说了，听我说。” ~cutin

你用了同学的笔，用完了。
= 还给他，说：“谢谢你的笔！”
- 放进自己的书包里。 ~rude
- 放在自己的桌子上，不还了。 ~rude

你想看同学的故事书。
= 你的书看完了，能给我看看吗？
- 把书拿过来就看。 ~rude
- 这本书一点也不好看。 ~harsh

买东西的人很多，大家在排队。
= 排在最后，等着轮到自己。
- 跑到前面去先买。 ~queue
- 在后面大声叫：“快点！” ~rude

你想玩同学的球，可是他正在玩。
= 等你玩好了，我能玩一会儿吗？
- 一把拿过球来。 ~rude
- 你别玩了，给我！ ~harsh

上课时，你想回答老师的问题。
= 先举手，等老师叫到自己再说。
- 不举手，站起来就说。 ~cutin
- 大声喊：“我知道！” ~cutin

下雨了，你想用一下邻居奶奶的伞。
= 奶奶，我能用一下您的伞吗？明天还给您。
- 伞给我用用。 ~rude
- 你的伞在哪里？ ~unclear

坐公共汽车，大家在排队上车。
= 跟着大家，一个一个上车。
- 从旁边先上车。 ~queue
- 用手拉开前面的人。 ~rude
`);

/** TELLINGS are tellings of things done, each in three parts in the order they happened. */
const TELLINGS: readonly (readonly [topic: string, first: string, then: string, last: string])[] = [
  ["去公园", "星期天，我和妈妈去了公园。", "我们先看花，后来又去划船。", "天黑了，我们才高高兴兴地回家。"],
  ["洗车", "昨天，我和爸爸一起洗车。", "我们先打来水，再一起洗。", "最后，车子变得干干净净的。"],
  ["画画", "下午，我在家里画画。", "我先画了一个大太阳，又画了小草和小花。", "画好了，妈妈说我画得真好。"],
  ["玩雪", "早上起来，外面下雪了。", "我和弟弟跑到外面去玩雪。", "玩到中午，我们才回家吃饭。"],
  ["生病", "上星期，我生病了，没去上学。", "妈妈带我去医院，医生给我开了药。", "吃了药，我很快就好了。"],
  ["找小猫", "下午，我的小猫不见了。", "我找了楼上楼下，又找了门外。", "最后，我在床底下找到了它。"],
  ["运动会", "今天学校开运动会，我参加了跑步。", "开头我跑得很快，后来有点累了。", "我没有停下来，最后跑到了终点。"],
  ["做饭", "星期六，我第一次帮妈妈做饭。", "我先洗菜，妈妈再做菜。", "饭做好了，爸爸说菜很香。"],
  ["坐车回家", "放学了，我和同学一起坐车回家。", "车上人很多，我们站好了。", "到站了，我们说了再见，下了车。"],
  ["过生日", "今天是我的生日。", "爸爸妈妈给我买了新书，朋友们来给我唱歌。", "最后，大家一起吃了面，真开心。"],
];

/** ORDERED are the scenes of telling things in order: the telling in order, and two out of it. */
const ORDERED: readonly RuleItem[] = TELLINGS.map(([topic, a, b, c]) => ({
  scene: `要讲的事：${topic}`,
  right: `${a}${b}${c}`,
  wrong: [
    [`${c}${a}${b}`, "order"],
    [`${b}${c}${a}`, "order"],
  ],
}));

/** GAPS are tellings that leave a part out: when, where, who, what happened or how it ended. */
const GAPS = parseRules(`
我和妈妈去了公园，我们看了花，还划了船，玩得很开心。
= 没有说是什么时候去的
- 没有说和谁去的 ~told
- 没有说玩得怎么样 ~told

星期天，我去买东西，买了一个大西瓜，回家大家一起吃了。
= 没有说是在哪里买的
- 没有说是什么时候 ~told
- 没有说买了什么 ~told

昨天下午，我在公园里。后来，我很高兴地回家了。
= 没有说在公园里做了什么
- 没有说是什么时候 ~told
- 没有说在哪里 ~told

星期六，我和爸爸在河边玩，我们一直玩到天黑。
= 没有说在河边玩了什么
- 没有说是什么时候 ~told
- 没有说和谁一起 ~told

早上，在学校门口，带一位老奶奶过了马路。
= 没有说是谁带的
- 没有说是什么时候 ~told
- 没有说在哪里 ~told

我和弟弟在家里玩球，后来花瓶被打破了，我们向妈妈说了对不起。
= 没有说是什么时候
- 没有说在哪里 ~told
- 没有说后来怎么样 ~told

放学以后，我和小明一起做作业，做完了，我们去踢球。
= 没有说是在哪里做作业
- 没有说是什么时候 ~told
- 没有说和谁一起 ~told

今天上午，在公园里，我找到了一个钱包。
= 没有说钱包后来怎么样了
- 没有说是什么时候 ~told
- 没有说在哪里 ~told

中午，我和同学们在学校里。最后，大家都笑了。
= 没有说发生了什么事
- 没有说是什么时候 ~told
- 没有说在哪里 ~told

昨天晚上，我在家里给奶奶打电话。
= 没有说和奶奶说了什么
- 没有说是什么时候 ~told
- 没有说在哪里 ~told
`);

/** CLEAR are the scenes of asking a clear question, for help or the way. */
const CLEAR = parseRules(`
你在公园里找不到洗手间。
= 阿姨，请问洗手间在哪里？
- 阿姨，那个在哪里？ ~unclear
- 阿姨，我要去。 ~unclear

一道题你不会做，想问老师。
= 老师，第三题我不会做，您能给我讲一讲吗？
- 老师，这个怎么弄？ ~unclear
- 老师，我不会。 ~missing

你要去图书馆，可是不知道怎么走。
= 叔叔，请问去图书馆怎么走？
- 叔叔，怎么走？ ~missing
- 叔叔，图书馆好吗？ ~off

书上有一个字你不认识。
= 妈妈，这个“春”字怎么读？
- 妈妈，这个是什么？ ~unclear
- 妈妈，我不会读书。 ~unclear

在商店里，你找不到牛奶。
= 阿姨，请问牛奶放在哪里？
- 阿姨，东西在哪里？ ~unclear
- 阿姨，我要买。 ~missing

你想知道公共汽车几点来。
= 叔叔，请问8路车几点来？
- 叔叔，车呢？ ~unclear
- 叔叔，现在几点了？ ~off

在学校里，你找不到二年级一班。
= 大哥哥，请问二年级一班在几楼？
- 大哥哥，教室在哪里？ ~missing
- 大哥哥，你是几班的？ ~off

你想问同学明天要带什么。
= 小红，明天上美术课要带什么？
- 小红，明天带吗？ ~unclear
- 小红，你带了吗？ ~unclear

在医院，你不知道去哪里看牙。
= 护士阿姨，请问看牙去几楼？
- 护士阿姨，去哪里？ ~missing
- 护士阿姨，我疼。 ~unclear

你想请爷爷教你下棋。
= 爷爷，您能教我下棋吗？
- 爷爷，下棋。 ~unclear
- 爷爷，棋在哪里？ ~off
`);

/** ADDRESS are the scenes of calling a person in the way that suits them. */
const ADDRESS = parseRules(`
在路上，你想问一位老爷爷去公园怎么走。
= 老爷爷，请问去公园怎么走？
- 喂，去公园怎么走？ ~rude
- 小朋友，去公园怎么走？ ~address

在商店里，你想问一位年轻的阿姨东西放在哪里。
= 阿姨，请问笔放在哪里？
- 奶奶，请问笔放在哪里？ ~address
- 喂，笔放在哪里？ ~rude

下课了，你想请王老师讲一道题。
= 王老师，您能给我讲讲这道题吗？
- 小王，你给我讲讲这道题。 ~address
- 喂，老师，讲讲这道题。 ~rude

你想问一位比你大的学生，图书室在哪里。
= 大哥哥，请问图书室在哪里？
- 叔叔，请问图书室在哪里？ ~address
- 小弟弟，图书室在哪里？ ~address

在路口，你想问警察叔叔去医院的路。
= 警察叔叔，请问去医院怎么走？
- 喂，警察，医院在哪？ ~rude
- 小哥哥，医院在哪？ ~address

你想问邻居家的奶奶，她家的小猫叫什么。
= 奶奶，请问您家的小猫叫什么名字？
- 阿姨，你家的猫叫什么？ ~address
- 老太太，你家猫叫啥？ ~rude

你想问同学借一块橡皮。
= 小明，你能借我一块橡皮吗？
- 明明叔叔，借我一块橡皮。 ~address
- 喂喂，橡皮！ ~rude

在医院，你想问医生什么时候能好。
= 医生，请问我什么时候能好？
- 老板，我什么时候能好？ ~address
- 喂，我什么时候好？ ~rude

上车前，你想问司机这辆车去不去学校。
= 司机叔叔，请问这辆车去学校吗？
- 喂，开车的，去学校吗？ ~rude
- 老师，这辆车去学校吗？ ~address

在商店里，你想问一位阿姨这个本子多少钱。
= 阿姨，请问这个本子多少钱？
- 本子，多少钱？ ~rude
- 姐姐奶奶，这个多少钱？ ~address
`);

/** SUGGESTING are the scenes of making a suggestion. */
const SUGGESTING = parseRules(`
你和同桌都想用这支彩笔。
= 我们轮流用吧，你先用，好吗？
- 这支笔是我的，你别用。 ~pushy
- 那我们都别用了！ ~harsh

星期天，你想去公园，弟弟想在家看书。
= 我们上午去公园，下午在家看书，好不好？
- 必须去公园！ ~pushy
- 你去不去，我不管。 ~harsh

小组要给小树浇水，大家都抢着干。
= 我们排好顺序，一个人浇一天，怎么样？
- 都别动，我来浇！ ~pushy
- 你们浇吧，我不干了。 ~off

你想让妈妈周末带你去动物园。
= 妈妈，这个周末您有空吗？我们去动物园好吗？
- 妈妈，我周末一定要去动物园！ ~pushy
- 妈妈，你从来不带我玩。 ~harsh

班里要给新同学准备一份礼物。
= 我们一起画一张画送给他，好吗？
- 礼物我说了算。 ~pushy
- 随便吧。 ~off

你和朋友想玩不同的游戏。
= 我们先玩你的，再玩我的，行吗？
- 只玩我的，不然我走了。 ~pushy
- 你的游戏真没意思。 ~harsh

下课了，大家想去操场，可是外面下雨了。
= 下雨了，我们在教室里讲故事吧？
- 我就要去操场！ ~pushy
- 下雨真讨厌！ ~off

你想让爸爸陪你读书。
= 爸爸，我们每天睡觉前一起读一本书，好吗？
- 爸爸，不许看手机了！ ~harsh
- 爸爸，你什么都不管我。 ~off

布置教室时，你想把花放在窗台上。
= 把花放在窗台上，能晒到太阳，大家觉得怎么样？
- 花必须放在窗台上。 ~pushy
- 放哪里都行，别问我。 ~off

做手工，你和同学都想做小船。
= 我们一起做一只大船吧，你做船头，我做船尾，好吗？
- 我先说的，你不许做。 ~pushy
- 你做的船肯定不好看。 ~harsh
`);

/** ANSWERING are the scenes of answering another's idea kindly. */
const ANSWERING = parseRules(`
同学说：“我们一起去踢球吧！”你今天想看书。
= 谢谢你叫我，今天我想看书，明天我们一起踢，好吗？
- 踢球有什么好玩的！ ~harsh
- 不去。 ~rude

弟弟说：“我们画一只大老虎吧！”
= 好主意！我来画老虎的头，你画身体。
- 你画得太难看了，别画。 ~harsh
- 我只画我自己的。 ~pushy

同学说：“我们把小鱼放回河里去吧。”
= 好主意，我们先问问老师可不可以。
- 你的主意真笨！ ~harsh
- 不行，听我的。 ~pushy

妈妈说：“今天我们吃面条，好吗？”你想吃米饭。
= 妈妈，我今天想吃米饭，明天吃面条可以吗？
- 我不吃面条！ ~harsh
- 你做什么我都不吃。 ~rude

小组长说：“故事表演，你来演小兔。”你想演小熊。
= 我想演小熊，可以吗？如果不行，我就演小兔。
- 我才不演小兔！ ~harsh
- 那我不演了。 ~off

同桌说：“我们一起做作业吧。”
= 好呀，做完我们一起检查。
- 你自己做吧，别烦我。 ~harsh
- 我的作业不给你看。 ~off

朋友说：“星期天我们去公园放风筝吧！”那天你要去奶奶家。
= 谢谢你！星期天我要去奶奶家，星期六去可以吗？
- 星期天不行，你找别人吧。 ~harsh
- 放风筝没意思。 ~harsh

同学说：“我们把桌子排成一个圈。”你觉得这样有的同学看不见黑板。
= 这个想法很新，可是有的同学会看不见黑板，我们再想想好吗？
- 这样排太难看了！ ~harsh
- 不行就是不行。 ~pushy

姐姐说：“我们一起给妈妈做一张生日卡吧。”
= 太好了！我来写字，你来画画。
- 你自己做吧。 ~off
- 生日卡一点用也没有。 ~harsh

同学说：“下课我们玩跳绳吧。”你也想玩。
= 好呀，我去拿绳子！
- 跳绳？你又跳不好。 ~harsh
- 我想玩什么就玩什么。 ~pushy
`);

/** rule builds the rule of a knowledge point of speaking, with the headings of its steps where the default ones do not fit. */
const rule = (step: Text, check: Text, heads?: Rule["heads"]): Rule => (heads ? { heads, step, check } : { step, check });

/** ORDER_HEADS are the headings of the steps that put a telling in order. */
const ORDER_HEADS = {
  find: t("Step 1: recall the order of a telling.", "第一步：想一想讲事情的顺序。"),
  choose: t("Step 2: choose the telling that keeps it.", "第二步：选出按这个顺序讲的一种。"),
};

/** GAP_HEADS are the headings of the steps that find what a telling leaves out. */
const GAP_HEADS = {
  find: t("Step 1: recall what a clear telling says.", "第一步：想一想说清楚一件事要说什么。"),
  choose: t("Step 2: find the part it does not say.", "第二步：找出没有说的那一部分。"),
};

/** ruleTexts are the texts of situations, to find the batch by which they can be read. */
const ruleTexts = (items: readonly RuleItem[]): readonly string[] => items.flatMap((i) => [i.scene, i.right, ...i.wrong.map((w) => w[0])]);

/** Spec is a speaking topic of the stage. */
interface Spec {
  readonly grade: number;
  readonly id: string;
  readonly title: Text;
  readonly summary: Text;
  readonly intro: Text;
  readonly texts: readonly string[];
  readonly after: readonly string[];
  readonly points: readonly (readonly [suffix: string, title: Text, explanation: Text, generate: Generator])[];
}

/** topicOf builds a speaking topic from its spec, after the topics known before it. */
function topicOf(spec: Spec, known: readonly TopicDef[]): GradeTopic {
  return {
    grade: spec.grade,
    topic: {
      id: spec.id,
      title: spec.title,
      summary: spec.summary,
      intro: spec.intro,
      prerequisites: prerequisitesOf(readableAfter(spec.texts, spec.grade), spec.after, known),
      encompasses: [],
      xp: 12,
      strand: "speaking",
      knowledgePoints: spec.points.map(([suffix, title, explanation, generate]) =>
        point(`${spec.id}-${suffix}`, title, explanation, generate),
      ),
    },
  };
}

/** pieceTexts are the texts of talks, to find the batch by which they can be read. */
const pieceTexts = (pieces: readonly Piece[]): readonly string[] =>
  pieces.flatMap((p) => [p.title, p.body, ...p.questions.flat().flatMap((q) => [q.right, ...q.wrong.map((w) => w[0])])]);

/** SPECS are the speaking topics of grades 1 and 2, in order. */
const SPECS: readonly Spec[] = [
  {
    grade: 1,
    id: "speaking-1-listening",
    title: t("Listening Carefully", "认真听"),
    summary: t(
      "Listening to a short talk by a teacher, a parent or a friend: what it is about, and what the speaker asks for.",
      "认真听老师、家长或同学说的一段话：讲了什么事，说话的人请你做什么。",
    ),
    intro: t(
      "Listening carefully means catching two things: what the talk is about, and what the speaker wants you to do. A teacher says: “明天我们去公园春游。早上八点在学校门口集合，请带上水和帽子。” It is about tomorrow's outing to the park; and the teacher asks you to bring water and a hat.\n\nWhat is said is written out here for you to read, just as you would hear it. The first knowledge point asks what a talk is about, the second what the speaker asked for.",
      "认真听，要听清两件事：这段话讲的是什么事，说话的人请你做什么。比如老师说：“明天我们去公园春游。早上八点在学校门口集合，请带上水和帽子。”讲的是明天去公园春游；老师请大家带上水和帽子。\n\n这里把说的话写了出来，读的时候就像在听一样。第一个知识点问一段话讲了什么事，第二个问说话的人请你做什么。",
    ),
    texts: pieceTexts(TALKS),
    after: ["reading-1-stories"],
    points: [
      [
        "about",
        t("What a Talk Is About", "一段话讲了什么"),
        t(
          "What a talk is about is usually said at its start. Listen for the thing it tells: an outing, a change, a visit.\n\nIn “下午的音乐课改在教室里上，因为外面下雨了。”, the talk is about the music lesson moving into the classroom.\n\n> **Watch out.** Keep every word as it was said. 改在教室里上 is not 不上了: a changed word changes the message.",
          "一段话讲什么事，常常在开头就说了。要听清它说的是哪件事：出去玩、有变动、谁要来。\n\n比如“下午的音乐课改在教室里上，因为外面下雨了。”讲的是音乐课改在教室里上。\n\n> **注意。** 要按原话记住。“改在教室里上”不是“不上了”，换了一个词，意思就变了。",
        ),
        pieceGenerator(TALKS, 0, TALK),
      ],
      [
        "asked",
        t("What the Speaker Asked For", "说话的人请你做什么"),
        t(
          "What the speaker wants you to do usually follows 请, 要 or 不要. Listen for it, and for all of it.\n\nIn “出门前穿上大衣，带上帽子。”, Mother asks for two things: put on a coat and a hat.\n\n> **Watch out.** A request may have two parts. Remembering only one of them, such as only the coat, is not doing what was asked.",
          "说话的人请你做的事，常常跟在“请”“要”“不要”后面。要听清，还要听全。\n\n比如“出门前穿上大衣，带上帽子。”妈妈请你做两件事：穿上大衣，带上帽子。\n\n> **注意。** 请你做的事可能有两件。只记住一件，比如只穿大衣，就没有做到别人请你做的事。",
        ),
        pieceGenerator(TALKS, 1, TALK),
      ],
    ],
  },
  {
    grade: 1,
    id: "speaking-1-manners",
    title: t("Talking Politely", "有礼貌地交谈"),
    summary: t(
      "Talking politely: greeting, thanking and saying sorry; asking to borrow something and waiting one's turn.",
      "有礼貌地交谈：问好、道谢和道歉；借东西和排队等候。",
    ),
    intro: t(
      "Polite words fit the moment. When you meet your teacher in the morning, you say “王老师，早上好！”; when someone helps you, “谢谢你！”; when you have done wrong, “对不起”. When you want something of someone, you ask, “我能用一下你的尺子吗？”, and when others are before you, you wait.\n\nEach question here gives a moment and three replies. Choose the one that fits it and is polite. The first knowledge point is greeting, thanking and saying sorry, the second asking and waiting one's turn.",
      "有礼貌的话，要合乎当时的情况。早上见到老师，说“王老师，早上好！”；别人帮了你，说“谢谢你！”；做错了事，说“对不起”。想用别人的东西，要问“我能用一下你的尺子吗？”；别人在你前面，就要等一等。\n\n每道题给出一个情境和三句话，选出合乎情境又有礼貌的一句。第一个知识点是问好、道谢和道歉，第二个是借东西和排队等候。",
    ),
    texts: ruleTexts([...GREETING, ...TURNS]),
    after: ["speaking-1-listening"],
    points: [
      [
        "greeting",
        t("Greeting, Thanking and Saying Sorry", "问好、道谢和道歉"),
        t(
          "First think what has just happened: you meet someone, someone helps you, or you have done something wrong. Then say the words for it.\n\nYou knock over a classmate's cup: say “对不起，我帮你擦干净。”, sorry and an offer to put it right.\n\n> **Watch out.** Saying sorry means owning what you did. “是水杯自己倒的” puts the blame on the cup: it is not saying sorry.",
          "先想一想刚才发生了什么：遇见了人，别人帮了你，还是自己做错了事。再说合适的话。\n\n比如你把同学的水杯碰倒了，要说“对不起，我帮你擦干净。”，既道歉，又想办法弥补。\n\n> **注意。** 道歉就要承认是自己做的。“是水杯自己倒的”，是把错推给了水杯，不是道歉。",
        ),
        ruleGenerator(
          t("Which reply is polite and fits the moment?", "这时说哪一句好？"),
          GREETING,
          rule(
            t(
              "Think who you are speaking to and what has just happened: greet when you meet, thank when you are helped, say sorry when you have done wrong, and answer a “sorry” kindly.",
              "想一想是对谁说，刚才发生了什么：见面要问好，别人帮了你要道谢，做错了事要道歉，别人向你道歉要说“没关系”。",
            ),
            t(
              "Say the reply aloud to that person: it is polite, and it fits what has just happened.",
              "把这句话对着那个人说一遍：说得有礼貌，也合乎刚才发生的事。",
            ),
          ),
        ),
      ],
      [
        "turns",
        t("Asking to Borrow and Waiting One's Turn", "借东西和排队等候"),
        t(
          "To use what is someone else's, ask first and wait for a yes; give it back with thanks. Where people are waiting, take your place at the end.\n\nYou want your deskmate's ruler: “我能用一下你的尺子吗？”\n\n> **Watch out.** Taking first and asking later is not asking. Wait for the other person to say yes.",
          "想用别人的东西，先问一问，等别人同意；用完了要还，还要道谢。大家在排队，就站到队伍后面。\n\n比如想用同桌的尺子，要说：“我能用一下你的尺子吗？”\n\n> **注意。** 先拿再问，不算是问。要等别人同意了再用。",
        ),
        ruleGenerator(
          t("Which is the right thing to say or do?", "这时该怎么说、怎么做？"),
          TURNS,
          rule(
            t(
              "When you want something of someone, ask politely and wait for a yes; when others are before you, wait your turn.",
              "想要别人的东西，要有礼貌地问，等别人同意；别人在你前面，就按顺序等。",
            ),
            t(
              "Imagine the other people seeing it: they are asked, not pushed, and no one is passed.",
              "想一想别人看到会怎么样：他们是被有礼貌地问了，没有被抢，也没有人被插队。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 1,
    id: "speaking-1-telling",
    title: t("Telling It Clearly", "把事情说清楚"),
    summary: t(
      "Telling something clearly: its parts in the order they happened, and what a telling leaves out.",
      "把一件事说清楚：按先后顺序讲，看出讲的时候漏了什么。",
    ),
    intro: t(
      "To tell something clearly, say it in the order it happened, and leave nothing out. Start with when, who and where: “星期天，我和妈妈去了公园。” Then what happened: “我们先看花，后来又去划船。” Then how it ended: “天黑了，我们才高高兴兴地回家。”\n\nThe first knowledge point puts the parts of a telling in order; the second finds what a telling leaves out.",
      "要把一件事说清楚，就按事情发生的先后讲，什么都不要漏。先说什么时候、谁、在哪里：“星期天，我和妈妈去了公园。”再说发生了什么：“我们先看花，后来又去划船。”最后说结果：“天黑了，我们才高高兴兴地回家。”\n\n第一个知识点按顺序排好讲述的各部分，第二个看出讲述漏了什么。",
    ),
    texts: ruleTexts([...ORDERED, ...GAPS]),
    after: ["speaking-1-listening"],
    points: [
      [
        "order",
        t("The Parts in Order", "按顺序讲"),
        t(
          "A telling goes in the order things happened: first when, who and where, then what happened, last how it ended.\n\nOf “最后，车子变得干干净净的。”, “昨天，我和爸爸一起洗车。” and “我们先打来水，再一起洗。”, the one with 昨天 comes first and the one with 最后 last.\n\n> **Watch out.** Words such as 先, 后来, 最后 and 天黑了 show the order. A telling that starts with the ending is hard to follow.",
          "讲一件事，要按事情发生的先后：先说什么时候、谁、在哪里，再说发生了什么，最后说结果。\n\n比如“最后，车子变得干干净净的。”“昨天，我和爸爸一起洗车。”“我们先打来水，再一起洗。”有“昨天”的一句在前，有“最后”的一句在后。\n\n> **注意。** “先”“后来”“最后”“天黑了”这些词能看出先后。一开头就讲结果，别人就听不明白了。",
        ),
        ruleGenerator(
          t("Which telling puts things in the right order?", "哪一种讲法，先做的事先讲，后做的事后讲？"),
          ORDERED,
          rule(
            t(
              "A telling goes in the order things happened: first when, who and where; then what happened; last how it ended.",
              "讲一件事，要按事情发生的先后：先说什么时候、谁、在哪里，再说发生了什么，最后说结果。",
            ),
            t(
              "Tell it again in that order: each part follows from the one before, and the ending comes last.",
              "按这个顺序再讲一遍：每一部分都接着前一部分，结果在最后。",
            ),
            ORDER_HEADS,
          ),
        ),
      ],
      [
        "missing",
        t("What a Telling Leaves Out", "讲述漏了什么"),
        t(
          "A clear telling says when, where, who, what happened and how it ended. Ask a telling each of these in turn, and see which it does not answer.\n\n“我和妈妈去了公园，我们看了花，还划了船，玩得很开心。” says who, where, what and how it ended, but not when.\n\n> **Watch out.** A part may be said in few words, such as 早上. Check that a part is really missing before choosing it.",
          "把事情说清楚，要说什么时候、在哪里、谁、发生了什么、结果怎么样。拿这几个问题一个一个问讲述，看哪一个没有回答。\n\n比如“我和妈妈去了公园，我们看了花，还划了船，玩得很开心。”说了谁、在哪里、做了什么、结果怎么样，没有说什么时候。\n\n> **注意。** 有的部分只用一两个字说了，比如“早上”。要看准这一部分确实没有说，再选它。",
        ),
        ruleGenerator(
          t("What does this telling leave out?", "这段话少说了什么？"),
          GAPS,
          rule(
            t(
              "A clear telling says when, where, who, what happened and how it ended; look for the part it does not say.",
              "说清楚一件事，要说什么时候、在哪里、谁、发生了什么、结果怎么样；找一找哪一部分没有说。",
            ),
            t(
              "Ask the telling each question in turn: when? where? who? what happened? how did it end? Only the one in the answer goes unanswered.",
              "把问题一个一个问一遍：什么时候？在哪里？谁？发生了什么？结果怎么样？只有答案说的那一个没有回答。",
            ),
            GAP_HEADS,
          ),
        ),
      ],
    ],
  },
  {
    grade: 2,
    id: "speaking-2-asking",
    title: t("Asking for Help and the Way", "请教和问路"),
    summary: t(
      "Asking for help and the way: a clear question, and the right way to call the person asked.",
      "请教和问路：问得清楚，称呼得当。",
    ),
    intro: t(
      "To ask someone for help or the way, call them in the way that suits them and say clearly what you want to know. “叔叔，请问去图书馆怎么走？” does both: 叔叔 suits a grown man, 请问 is polite, and the question says just where you want to go.\n\nThe first knowledge point asks for a clear question, the second for the right form of address.",
      "向别人请教或问路，要称呼得当，把想知道的事问清楚。“叔叔，请问去图书馆怎么走？”两样都做到了：“叔叔”合适称呼成年男子，“请问”有礼貌，问题也说清了要去哪里。\n\n第一个知识点要问得清楚，第二个要称呼得当。",
    ),
    texts: ruleTexts([...CLEAR, ...ADDRESS]),
    after: ["speaking-1-manners"],
    points: [
      [
        "clear",
        t("A Clear Question", "问得清楚"),
        t(
          "A clear question names exactly what you want to know: the place, the thing, the number of the exercise.\n\n“叔叔，怎么走？” does not say where to; “叔叔，请问去图书馆怎么走？” does.\n\n> **Watch out.** Words like 这个 and 那个 are clear only to you. Name the thing, so that the other person can answer at once.",
          "问得清楚，就要说出你到底想知道什么：哪个地方，什么东西，第几道题。\n\n“叔叔，怎么走？”没有说去哪里；“叔叔，请问去图书馆怎么走？”就说清楚了。\n\n> **注意。** “这个”“那个”只有你自己明白。要说出是什么，别人才能马上回答你。",
        ),
        ruleGenerator(
          t("Which question is asked clearly?", "哪一句问得清楚？"),
          CLEAR,
          rule(
            t(
              "A clear question says exactly what you want to know, what you are looking for or what you cannot do, and asks politely, with 请问 or 能……吗.",
              "问得清楚，要说出到底想知道什么：找什么，哪里不会；还要有礼貌，用“请问”或“能……吗”。",
            ),
            t(
              "Imagine the other person hearing it: could they answer at once, without asking you what you mean?",
              "想一想对方听了能不能马上回答，不用再问你是什么意思。",
            ),
          ),
        ),
      ],
      [
        "address",
        t("The Right Form of Address", "称呼得当"),
        t(
          "Call a person by what suits them: 爷爷 or 奶奶 for an old person, 叔叔 or 阿姨 for a grown-up, 老师 or 医生 by their work, 大哥哥 or 大姐姐 for an older child; and say 您 to elders.\n\nTo ask an old man the way: “老爷爷，请问去公园怎么走？”\n\n> **Watch out.** 喂 is not a way to call anyone you are asking for help; and calling a grown-up 小朋友, or a teacher by a nickname, does not suit them.",
          "称呼要合乎对方的年纪和身份：老人叫“爷爷”“奶奶”，大人叫“叔叔”“阿姨”，按工作叫“老师”“医生”，比你大的学生叫“大哥哥”“大姐姐”；对长辈说“您”。\n\n比如向一位老爷爷问路：“老爷爷，请问去公园怎么走？”\n\n> **注意。** 请别人帮忙，不能用“喂”来叫人；把大人叫“小朋友”，把老师叫“小王”，都不合适。",
        ),
        ruleGenerator(
          t("Which way of calling the person is right?", "哪一句称呼得当？"),
          ADDRESS,
          rule(
            t("Call the person by what suits their age and who they are, and ask politely.", "按对方的年纪和身份来称呼，再有礼貌地问。"),
            t(
              "Say the opening aloud as if to that person: it is polite, and fits their age and who they are.",
              "把开头的称呼对着那个人说一遍：有礼貌，也合乎对方的年纪和身份。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 2,
    id: "speaking-2-messages",
    title: t("Passing On a Message", "转告"),
    summary: t(
      "Passing on a message: all of it, without changing it, to the person it is for, with its time.",
      "转告：把口信完整地、不改样地说给要听的人，说清时间。",
    ),
    intro: t(
      "To pass on a message is to tell someone what another person said for them. Aunt Li phones: “请跟你妈妈说，明天上午十点，我到你家来拿书。” You tell Mother: “妈妈，李阿姨说明天上午十点来我们家拿书。” Who said it, the time and the thing are all kept.\n\nThe first knowledge point asks for the whole message, the second for whom it is meant and when.",
      "转告，就是把别人让你带给某个人的话说给他听。李阿姨打电话来：“请跟你妈妈说，明天上午十点，我到你家来拿书。”你跟妈妈说：“妈妈，李阿姨说明天上午十点来我们家拿书。”谁说的、什么时间、什么事，一样也没少。\n\n第一个知识点要转告完整，第二个要说清给谁、什么时候。",
    ),
    texts: pieceTexts(MESSAGES),
    after: ["speaking-1-listening"],
    points: [
      [
        "whole",
        t("The Whole Message", "完整的口信"),
        t(
          "A whole message keeps who said it, the time, the place and the thing, with nothing changed. Turn “I” and “you” round, as the new listener needs.\n\n“请跟你妈妈说，明天上午十点，我到你家来拿书。” becomes “妈妈，李阿姨说明天上午十点来我们家拿书。”\n\n> **Watch out.** “妈妈，李阿姨说要来拿书” leaves out the time; “明天下午” changes it. Either way, Mother cannot be ready.",
          "完整的口信，要说清谁说的、什么时间、什么地方、什么事，一点也不改。“我”“你”要按听的人换过来。\n\n“请跟你妈妈说，明天上午十点，我到你家来拿书。”转告成：“妈妈，李阿姨说明天上午十点来我们家拿书。”\n\n> **注意。** “妈妈，李阿姨说要来拿书”漏了时间；说成“明天下午”又改了时间。这样妈妈都没法准备。",
        ),
        pieceGenerator(MESSAGES, 0, TALK),
      ],
      [
        "who-when",
        t("Who It Is For and When", "给谁、什么时候"),
        t(
          "A message is for one person, named after 跟……说, and often has a time. Find both before passing it on.\n\nIn “请跟你爷爷说，星期天早上，我们一起去公园下棋。”, it is for Grandpa, and the time is Sunday morning.\n\n> **Watch out.** The one who says the message is not the one it is for: Grandpa Zhang speaks, but the message is for your grandpa.",
          "口信是给一个人的，常常在“跟”的后面说出来；口信里还常有时间。转告前，两样都要找准。\n\n比如“请跟你爷爷说，星期天早上，我们一起去公园下棋。”口信是给爷爷的，时间是星期天早上。\n\n> **注意。** 说口信的人不是要听口信的人：说话的是张爷爷，口信却是给你爷爷的。",
        ),
        pieceGenerator(MESSAGES, 1, TALK),
      ],
    ],
  },
  {
    grade: 2,
    id: "speaking-2-discussing",
    title: t("Talking It Over", "商量"),
    summary: t("Talking things over: making a suggestion, and answering another's idea kindly.", "商量：提出建议，友好地回应别人的想法。"),
    intro: t(
      "To talk something over is to find, together, a way both can agree to. You and your deskmate both want one coloured pen: “我们轮流用吧，你先用，好吗？” says your idea and asks for theirs. When someone else has an idea you do not want, answer kindly and say why: “谢谢你叫我，今天我想看书，明天我们一起踢，好吗？”\n\nThe first knowledge point makes a suggestion, the second answers another's idea.",
      "商量，就是一起想一个大家都同意的办法。你和同桌都想用一支彩笔，说“我们轮流用吧，你先用，好吗？”，说出了自己的想法，也问了对方的意见。别人提出的想法你不想照做，也要友好地回答，说清原因：“谢谢你叫我，今天我想看书，明天我们一起踢，好吗？”\n\n第一个知识点提出建议，第二个回应别人的想法。",
    ),
    texts: ruleTexts([...SUGGESTING, ...ANSWERING]),
    after: ["speaking-1-manners"],
    points: [
      [
        "suggesting",
        t("Making a Suggestion", "提出建议"),
        t(
          "A suggestion says your idea and asks what the other thinks, with 好吗, 行吗 or 怎么样. A good one gives both sides a turn or a way.\n\nWhen you and your brother want different things: “我们上午去公园，下午在家看书，好不好？”\n\n> **Watch out.** 必须 and 一定要 order, they do not suggest. Talking it over leaves the other free to say no.",
          "提建议，要说出自己的想法，再用“好吗”“行吗”“怎么样”问问别人。好的建议，让双方都能轮到，都有办法。\n\n比如你和弟弟想做的不一样：“我们上午去公园，下午在家看书，好不好？”\n\n> **注意。** “必须”“一定要”是命令，不是建议。商量要让别人也能说“不”。",
        ),
        ruleGenerator(
          t("Which is the best way to suggest it?", "哪一句是在好好商量？"),
          SUGGESTING,
          rule(
            t(
              "Say what you think and ask what the other thinks: 好吗？ 怎么样？ A good suggestion lets both sides have a turn or a way.",
              "说出自己的想法，再问问别人：“好吗？”“怎么样？”好的建议让双方都能轮到，都有办法。",
            ),
            t(
              "Imagine the other hearing it: they are asked, and can say yes or give their own idea.",
              "想一想对方听了会怎么样：他是被询问的，可以同意，也可以说出自己的想法。",
            ),
          ),
        ),
      ],
      [
        "answering",
        t("Answering Another Idea Kindly", "友好地回应别人的想法"),
        t(
          "Answer someone's idea kindly: thank them or say it is a good idea. If you want something else, say why and offer another way.\n\nMother suggests noodles and you want rice: “妈妈，我今天想吃米饭，明天吃面条可以吗？”\n\n> **Watch out.** You may say no, but not by calling the idea stupid or dull. Say what you want and why, kindly.",
          "回应别人的想法要友好：先道谢，或者说这个主意好。自己想做别的，就说出原因，再提一个办法。\n\n比如妈妈想吃面条，你想吃米饭：“妈妈，我今天想吃米饭，明天吃面条可以吗？”\n\n> **注意。** 可以不同意，但不能说别人的主意笨、没意思。要友好地说出自己想怎样，为什么。",
        ),
        ruleGenerator(
          t("Which answer is kind?", "哪一句回应得友好？"),
          ANSWERING,
          rule(
            t(
              "Answer the idea kindly: thank them or welcome it; if you want something else, say why and offer another way.",
              "友好地回应：先道谢或者说主意好；自己想做别的，就说出原因，再提一个办法。",
            ),
            t(
              "Say it aloud to the other: they hear that their idea is welcome, and know what you want and why.",
              "把这句话对着对方说一遍：他听得出你欢迎他的想法，也知道你想怎样、为什么。",
            ),
          ),
        ),
      ],
    ],
  },
];

/** stageSpeakingTopics are the speaking topics of grades 1 and 2, in order, each after the reading and speaking before it. */
export const stageSpeakingTopics: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of SPECS)
    built.push(
      topicOf(
        spec,
        [...stageReadingTopics, ...built].map((x) => x.topic),
      ),
    );
  return built;
})();
