// The texts of the reading topics of grade 2 (docs/chinese-curriculum.md §18.9), written for this subject, the fables
// retold from old tales in the public domain. The format is that of parsePieces in topic-kit.ts: a
// question's wrong options carry the reason they are wrong.

/** FABLES are the fables of reading-2-fables, retold for the subject. */
export const FABLES = `
# 守株待兔
古时候，有个种田的人。一天，他正在田里干活，一只兔子飞快地跑过来，一头撞在树桩上，死了。他拿起兔子，高兴极了。从此，他不再种田，天天坐在树桩旁边，等着兔子再撞上来。可是，兔子再也没有来，他的田里长满了野草。
?1 兔子是怎么死的？ | How did the hare die?
= 撞在树桩上 | 一头撞在树桩上
- 被种田的人打死了 ~unsaid
- 跑累了 ~unsaid
?1 得到兔子以后，种田的人做了什么？ | What did the farmer do after he got the hare?
= 不再种田，天天等兔子 | 他不再种田，天天坐在树桩旁边
- 更加用心地种田 ~opposite
- 去山上找兔子 ~unsaid
?1 最后怎么样了？ | What happened in the end?
= 兔子没有再来，田里长满了野草 | 兔子再也没有来，他的田里长满了野草
- 他又拿到了很多兔子 ~opposite
- 田里的苗长得很好 ~opposite
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 不能把碰巧遇到的事，当成天天都会有的事 | 兔子再也没有来 | 一头撞在树桩上，死了 | 天天坐在树桩旁边，等着兔子再撞上来
- 兔子跑得很快 ~detail
- 种田很累，要多休息 ~reversed
?2 种田的人错在哪里？ | Where did the farmer go wrong?
≈ 以为兔子还会撞上来，就不干活了 | 等着兔子再撞上来 | 他不再种田 | 他的田里长满了野草
- 他把兔子拿了回去 ~detail
- 他在田里干活 ~reversed
?2 种田的人应该怎么做？ | What should the farmer have done?
≈ 接着好好种田 | 从此，他不再种田 | 他的田里长满了野草
- 天天坐着等兔子 ~opposite
- 把树桩搬回家 ~never

# 拔苗助长
古时候有个人，他觉得田里的小苗长得太慢了。一天，他跑到田里，把小苗一棵一棵往上拔高了一点。回到家，他说：“今天累坏了，我帮小苗长高了！”他的儿子跑到田里一看，小苗都死了。
?1 这个人觉得小苗怎么样？ | What did the man think of his seedlings?
= 长得太慢了 | 田里的小苗长得太慢了
- 长得太快了 ~opposite
- 长得太多了 ~unsaid
?1 他是怎么“帮”小苗长高的？ | How did he "help" the seedlings grow?
= 把小苗一棵一棵往上拔 | 把小苗一棵一棵往上拔高了一点
- 给小苗浇水 ~unsaid
- 给小苗唱歌 ~unsaid
?1 最后小苗怎么样了？ | What became of the seedlings?
= 都死了 | 小苗都死了
- 长高了 ~opposite
- 被儿子拔走了 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 做事不能太急，急了反而做坏 | 小苗都死了 | 他觉得田里的小苗长得太慢了 | 把小苗一棵一棵往上拔高了一点
- 小苗长得很慢 ~detail
- 种田要早早回家 ~never
?2 这个人错在哪里？ | Where did the man go wrong?
≈ 他想让小苗快快长高，就去拔它们 | 把小苗一棵一棵往上拔高了一点 | 他觉得田里的小苗长得太慢了 | 我帮小苗长高了
- 他回家太晚了 ~never
- 他告诉了儿子 ~detail
?2 小苗应该怎么长？ | How should the seedlings grow?
≈ 让它们自己慢慢长 | 他觉得田里的小苗长得太慢了 | 小苗都死了
- 每天拔高一点 ~opposite
- 一天就长大 ~reversed

# 亡羊补牢
从前，有个人养了很多羊。一天早上，他发现少了一只羊，原来羊圈破了一个洞，狼从洞里进来，把羊拉走了。邻居叫他快把洞补上，他说：“羊已经没了，还补洞干什么？”第二天，羊又少了一只。他这才明白过来，赶快把洞补好了。从此，他的羊再也没有少过。
?1 羊为什么少了一只？ | Why was a sheep missing?
= 狼从羊圈的洞里进来，把羊拉走了 | 狼从洞里进来，把羊拉走了
- 羊自己跑到山上去了 ~unsaid
- 邻居把羊牵走了 ~unsaid
?1 邻居叫他做什么？ | What did his neighbour tell him to do?
= 快把洞补上 | 邻居叫他快把洞补上
- 再去买一只羊 ~unsaid
- 去山上找狼 ~unsaid
?1 他把洞补好以后，怎么样了？ | What happened once he mended the hole?
= 羊再也没有少过 | 他的羊再也没有少过
- 羊又少了一只 ~other
- 狼天天都来 ~opposite
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 出了错，赶快改正，还来得及 | 他的羊再也没有少过 | 第二天，羊又少了一只 | 赶快把洞补好了
- 狼是很坏的动物 ~onepart
- 养羊一定会少羊 ~reversed
?2 他一开始错在哪里？ | Where did he go wrong at first?
≈ 羊没了，他觉得补洞也没用 | 羊已经没了，还补洞干什么 | 第二天，羊又少了一只
- 他养了很多羊 ~detail
- 他听了邻居的话 ~opposite
?2 他后来做对了什么？ | What did he do right later?
= 明白过来，赶快把洞补好 | 他这才明白过来 | 赶快把洞补好了
- 又养了更多的羊 ~unsaid
- 天天守着羊圈不睡觉 ~unsaid

# 刻舟求剑
古时候，有个楚国人坐船过江。船到江中间，他的剑掉进了水里。他马上在船边刻了一个记号，说：“我的剑是从这里掉下去的。”船停了，他从刻记号的地方跳下水去找剑，可是怎么也找不到。
?1 这个人的剑掉到了哪里？ | Where did his sword fall?
= 江水里 | 他的剑掉进了水里
- 船上 ~unsaid
- 江边 ~unsaid
?1 剑掉下去以后，他做了什么？ | What did he do when the sword fell?
= 在船边刻了一个记号 | 他马上在船边刻了一个记号
- 马上跳下水去找 ~unsaid
- 让船停下来 ~unsaid
?1 他找到剑了吗？ | Did he find his sword?
= 没有找到 | 可是怎么也找不到
- 找到了 ~opposite
- 别人帮他找到了 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 事情变了，办法也要跟着变 | 可是怎么也找不到 | 船到江中间 | 他马上在船边刻了一个记号
- 坐船要小心 ~never
- 剑不要带在身边 ~never
?2 这个人为什么找不到剑？ | Why could he not find his sword?
≈ 船一直在走，剑没有跟着船走 | 船到江中间 | 船停了，他从刻记号的地方跳下水去找剑
- 他刻的记号不清楚 ~never
- 江水太冷了 ~unsaid
?2 他错在哪里？ | Where did he go wrong?
≈ 以为剑还在记号下面 | 我的剑是从这里掉下去的 | 船停了，他从刻记号的地方跳下水去找剑 | 可是怎么也找不到
- 他坐船过江 ~detail
- 他跳下了水 ~detail

# 狐假虎威
老虎在山里找吃的，捉住了一只狐狸。狐狸说：“我是天上派来管山里动物的，你敢吃我？不信，你跟在我后面走一走。”老虎跟着狐狸往前走。野兔、小羊看见了，都吓得跑开了。老虎以为大家怕的是狐狸，就放了它。其实，大家怕的是老虎。
?1 老虎捉住了谁？ | Whom did the tiger catch?
= 狐狸 | 捉住了一只狐狸
- 野兔 ~who
- 小羊 ~who
?1 野兔和小羊看见了，怎么样？ | What did the hares and lambs do when they saw them?
= 吓得跑开了 | 都吓得跑开了
- 跑过来看 ~opposite
- 跟着它们走 ~unsaid
?1 最后老虎怎么做了？ | What did the tiger do in the end?
= 放了狐狸 | 就放了它
- 吃了狐狸 ~opposite
- 去追野兔 ~unsaid
?2 大家真正怕的是谁？ | Whom did the animals really fear?
= 老虎 | 其实，大家怕的是老虎
- 狐狸 ~opposite
- 野兔 ~who
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 不要被借着别人的力量吓人的人骗了 | 其实，大家怕的是老虎 | 你跟在我后面走一走 | 老虎以为大家怕的是狐狸，就放了它
- 老虎跑得很快 ~never
- 狐狸很可爱 ~never
?2 狐狸是靠什么让大家害怕的？ | What made the animals afraid of the fox?
≈ 走在它后面的老虎 | 你跟在我后面走一走 | 其实，大家怕的是老虎
- 它自己很厉害 ~opposite
- 它是天上派来的 ~unsaid

# 井底之蛙
一只青蛙住在井底。它抬头看天，天只有井口那么大。一天，一只小鸟落在井口，说：“天很大，大得没有边。”青蛙笑着说：“别说大话了，天不过井口那么大。”小鸟说：“你跳出井口来看一看吧！”
?1 青蛙住在哪里？ | Where did the frog live?
= 井底 | 一只青蛙住在井底
- 河边 ~unsaid
- 草地上 ~unsaid
?1 小鸟说天怎么样？ | What did the bird say the sky was like?
= 很大，没有边 | 天很大，大得没有边
- 只有井口那么大 ~other
- 天是蓝色的 ~life
?1 小鸟让青蛙做什么？ | What did the bird ask the frog to do?
= 跳出井口来看一看 | 你跳出井口来看一看吧
- 待在井底 ~opposite
- 一起飞上天 ~unsaid
?2 青蛙为什么觉得天只有井口那么大？ | Why did the frog think the sky was as big as the well's mouth?
≈ 它在井底，只能看到井口那么大的天 | 它抬头看天，天只有井口那么大 | 一只青蛙住在井底
- 天真的很小 ~opposite
- 小鸟告诉它的 ~opposite
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 看得少，就不要以为自己什么都知道 | 别说大话了，天不过井口那么大 | 一只青蛙住在井底 | 天很大，大得没有边
- 青蛙会跳得很高 ~never
- 井里的水很好喝 ~never
?2 青蛙怎样才能知道天有多大？ | How could the frog learn how big the sky is?
= 跳出井口去看一看 | 你跳出井口来看一看吧
- 听小鸟说大话 ~reversed
- 在井底多看几天 ~reversed

# 画蛇添足
古时候，几个人分一壶酒。大家说：“谁先在地上画好一条蛇，酒就给谁喝。”一个人很快画好了，他拿起酒壶，看别人还没画完，就说：“我还能给蛇画上脚呢！”他正画着脚，另一个人画好了蛇，拿过酒壶说：“蛇没有脚，你画的不是蛇。”说完，就把酒喝了。
?1 大家说谁可以喝酒？ | Who was to drink the wine?
= 先画好一条蛇的人 | 谁先在地上画好一条蛇，酒就给谁喝
- 画得最大的人 ~unsaid
- 年纪最大的人 ~unsaid
?1 第一个画好蛇的人又做了什么？ | What did the first to finish do next?
= 给蛇画上脚 | 我还能给蛇画上脚呢
- 马上把酒喝了 ~opposite
- 帮别人画蛇 ~unsaid
?1 最后是谁喝了酒？ | Who drank the wine in the end?
= 另一个画好蛇的人 | 另一个人画好了蛇
- 先画好蛇的人 ~opposite
- 大家一起喝了 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 做多余的事，反而会把事情做坏 | 蛇没有脚，你画的不是蛇 | 我还能给蛇画上脚呢 | 就把酒喝了
- 画画要画得快 ~onepart
- 酒不要给别人喝 ~never
?2 先画好的人为什么没有喝到酒？ | Why did the first to finish not get the wine?
≈ 他给蛇画了脚，画的不是蛇了 | 蛇没有脚，你画的不是蛇 | 我还能给蛇画上脚呢
- 他画得太慢了 ~opposite
- 他不喜欢喝酒 ~unsaid
?2 “画蛇添足”的“添足”是什么意思？ | What does 添足 mean in 画蛇添足?
= 加上脚 | 我还能给蛇画上脚呢
- 走得很快 ~sense
- 画得很好 ~sense

# 龟兔赛跑
兔子和乌龟比赛跑步。兔子跑得快，一下子就跑出很远。它回头一看，乌龟还在后面慢慢爬，就说：“我先睡一会儿吧。”乌龟一步一步往前爬，一刻也没有停。等兔子醒来，乌龟已经到了终点。
?1 谁和谁比赛跑步？ | Who ran the race?
= 兔子和乌龟 | 兔子和乌龟比赛跑步
- 兔子和小狗 ~who
- 乌龟和小鸟 ~who
?1 兔子跑出很远以后做了什么？ | What did the hare do once it was far ahead?
= 睡了一会儿 | 我先睡一会儿吧
- 一直往前跑 ~opposite
- 回去找乌龟 ~unsaid
?1 谁先到了终点？ | Who reached the finish first?
= 乌龟 | 乌龟已经到了终点
- 兔子 ~opposite
- 一起到的 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 不能骄傲，一步一步不停地做，就能成功 | 乌龟一步一步往前爬，一刻也没有停 | 我先睡一会儿吧 | 乌龟已经到了终点
- 乌龟比兔子跑得快 ~reversed
- 跑步以前要睡觉 ~reversed
?2 兔子为什么输了？ | Why did the hare lose?
≈ 它觉得自己跑得快，就停下来睡觉 | 我先睡一会儿吧 | 兔子跑得快，一下子就跑出很远 | 等兔子醒来，乌龟已经到了终点
- 它跑得太慢了 ~opposite
- 它生病了 ~unsaid
?2 乌龟为什么赢了？ | Why did the tortoise win?
≈ 它一刻也没有停 | 一刻也没有停 | 我先睡一会儿吧
- 它跑得比兔子快 ~opposite
- 兔子让着它 ~unsaid

# 狼来了
山下有个放羊的孩子。一天，他觉得没意思，就大喊：“狼来了！狼来了！”农民们拿着工具跑上山，可是没看见狼。孩子哈哈大笑。第二天，他又这样喊，农民们又跑来了，还是没有狼。第三天，狼真的来了，孩子大喊救命，可是谁也不信他了，羊被狼吃了很多。
?1 孩子第一次喊“狼来了”时，狼来了吗？ | Was there a wolf the first time the boy cried wolf?
= 没有 | 可是没看见狼
- 来了 ~opposite
- 来了两只 ~unsaid
?1 农民们听到喊声，做了什么？ | What did the farmers do when they heard the cry?
= 拿着工具跑上山 | 农民们拿着工具跑上山
- 在家里不出来 ~opposite
- 去找孩子的爸爸 ~unsaid
?1 狼真的来了时，怎么样了？ | What happened when the wolf really came?
= 谁也不信他，羊被吃了很多 | 可是谁也不信他了
- 农民们马上跑来帮他 ~opposite
- 孩子把狼打跑了 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 要说真话，说假话的人，别人就不再相信他 | 可是谁也不信他了 | 可是没看见狼 | 还是没有狼
- 放羊很没意思 ~onepart
- 狼很可怕，不要上山 ~never
?2 为什么第三天谁也不信孩子了？ | Why did no one believe the boy on the third day?
≈ 他前两次说的都是假话 | 第二天，他又这样喊，农民们又跑来了，还是没有狼 | 可是没看见狼
- 他喊得太小声了 ~unsaid
- 农民们都不在家 ~unsaid
?2 孩子错在哪里？ | Where did the boy go wrong?
≈ 拿说假话来开玩笑 | 孩子哈哈大笑 | 他觉得没意思，就大喊 | 可是谁也不信他了
- 他上山放羊 ~detail
- 他大喊救命 ~detail

# 狐狸和葡萄
秋天，一只狐狸走过葡萄架下，看见架上挂着一串串紫色的葡萄。它很想吃，就跳起来去摘，可是葡萄太高了，跳了几次也够不着。狐狸只好走开了，一边走一边说：“这些葡萄一定是酸的，不好吃。”
?1 狐狸看见了什么？ | What did the fox see?
= 架上一串串紫色的葡萄 | 看见架上挂着一串串紫色的葡萄
- 树上红红的苹果 ~unsaid
- 地上的葡萄 ~unsaid
?1 狐狸为什么没有吃到葡萄？ | Why did the fox not get the grapes?
= 葡萄太高了，够不着 | 可是葡萄太高了，跳了几次也够不着
- 葡萄是酸的 ~opposite
- 狐狸不想吃 ~opposite
?1 狐狸走开时说了什么？ | What did the fox say as it left?
= 这些葡萄一定是酸的 | 这些葡萄一定是酸的，不好吃
- 这些葡萄真甜 ~opposite
- 明天再来摘 ~unsaid
?2 葡萄真的是酸的吗？ | Were the grapes really sour?
≈ 不知道，是狐狸吃不到才这样说 | 跳了几次也够不着 | 这些葡萄一定是酸的，不好吃
% 狐狸一颗葡萄也没有吃到，它怎么会知道葡萄是什么味道？它是够不着，只好走开，才说葡萄“一定是酸的”。所以葡萄酸不酸，故事里看不出来，这只是狐狸吃不到时给自己找的说法。 | The fox never tasted a single grape, so how could it know the taste? It could not reach them and had to walk away, and only then said they “must be sour”. So the story does not show whether they are sour; it is only what the fox tells itself when it cannot have them.
- 是酸的，狐狸尝过了 ~unsaid
- 是甜的，狐狸吃过了 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 自己做不到，不要说那件事不好 | 这些葡萄一定是酸的，不好吃 | 跳了几次也够不着
- 葡萄很好吃 ~never
- 狐狸跳得不高 ~detail
?2 狐狸为什么说葡萄是酸的？ | Why did the fox say the grapes were sour?
≈ 它吃不到，就说葡萄不好 | 狐狸只好走开了 | 跳了几次也够不着 | 这些葡萄一定是酸的，不好吃
- 它尝了一个 ~unsaid
- 别人告诉它的 ~unsaid
`;

/** FAIRY_TALES are the fairy tales of reading-2-fairy-tales. */
export const FAIRY_TALES = `
# 想飞的小鱼
小河里有一条小鱼，它很想飞上天。一天，它请小鸟教它飞。小鸟说：“你没有翅膀，可是你会游泳呀！”小鱼想了想，笑着说：“对，在水里游来游去，也像在飞一样。”
?1 小鱼想做什么？ | What does the little fish want?
= 飞上天 | 它很想飞上天
- 游到大海里 ~unsaid
- 找妈妈 ~unsaid
?1 小鱼请谁教它飞？ | Whom does the fish ask to teach it to fly?
= 小鸟 | 它请小鸟教它飞
- 小青蛙 ~who
- 妈妈 ~who
?1 小鸟说小鱼会什么？ | What does the bird say the fish can do?
= 游泳 | 可是你会游泳呀
- 飞 ~opposite
- 唱歌 ~unsaid
?2 哪件事是想象出来的？ | Which of these is imagined?
= 小鸟和小鱼说话 | 小鸟说：“你没有翅膀
- 小鱼在河里游 ~real
- 小鸟有翅膀 ~real
?2 故事里的小鱼像人一样会做什么？ | What does the fish do like a person in the story?
= 笑着说话 | 小鱼想了想，笑着说
- 在水里游 ~real
- 吃小虫子 ~real
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 鱼在水里游来游去 | 在水里游来游去
- 小鱼请小鸟教它飞 ~imagined
- 小鱼笑着说话 ~imagined

# 月亮船
晚上，小兔睡不着，坐在窗前看月亮。弯弯的月亮慢慢飘下来，变成了一只小船。小兔坐上月亮船，飞过高山，飞过大河，一直飞到星星的家里。星星们拉着小兔的手，一起唱歌跳舞。
?1 小兔为什么坐在窗前？ | Why does the little rabbit sit by the window?
= 睡不着 | 小兔睡不着
- 在等妈妈 ~unsaid
- 要写作业 ~unsaid
?1 月亮变成了什么？ | What does the moon become?
= 一只小船 | 变成了一只小船
- 一个大饼 ~unsaid
- 一盏灯 ~unsaid
?1 小兔坐上月亮船，去了哪里？ | Where does the rabbit go in the moon boat?
= 星星的家里 | 一直飞到星星的家里
- 太阳的家里 ~unsaid
- 小河边 ~unsaid
?2 哪件事是想象出来的？ | Which of these is imagined?
= 月亮变成了小船 | 变成了一只小船
- 晚上能看见月亮 ~real
- 月亮有时候是弯弯的 ~real
?2 哪件事是想象出来的？ | Which of these is imagined?
= 星星拉着小兔的手唱歌跳舞 | 星星们拉着小兔的手
- 晚上天上有星星 ~real
- 小兔晚上睡不着 ~real
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 晚上坐在窗前看月亮 | 坐在窗前看月亮
- 坐着月亮船飞过高山 ~imagined
- 和星星一起唱歌 ~imagined

# 会说话的雨伞
小明有一把红雨伞。下雨了，雨伞对小明说：“带上我吧，我帮你挡雨。”小明打着雨伞去上学，身上一点也没湿。放学了，太阳出来了，雨伞说：“我累了，让我回家睡一觉吧。”
?1 雨伞想帮小明做什么？ | What does the umbrella want to do for Xiaoming?
= 挡雨 | 我帮你挡雨
- 挡太阳 ~unsaid
- 背书包 ~unsaid
?1 小明打着雨伞去做什么？ | Where does Xiaoming go with the umbrella?
= 上学 | 小明打着雨伞去上学
- 去公园 ~unsaid
- 去买东西 ~unsaid
?1 放学时，雨伞想做什么？ | What does the umbrella want after school?
= 回家睡一觉 | 让我回家睡一觉吧
- 再去挡雨 ~unsaid
- 去公园玩 ~unsaid
?2 哪件事是想象出来的？ | Which of these is imagined?
= 雨伞会说话 | 雨伞对小明说
- 下雨了要打伞 ~real
- 雨停了，太阳出来了 ~real
?2 哪件事是想象出来的？ | Which of these is imagined?
= 雨伞说自己累了，要睡觉 | 我累了，让我回家睡一觉吧
- 打着伞，身上不会湿 ~real
- 小明去上学 ~real
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 打着雨伞，身上没有湿 | 身上一点也没湿
- 雨伞会说话 ~imagined
- 雨伞要回家睡觉 ~imagined

# 小树的新衣服
春天，小树想要一件新衣服。春风吹来，给它穿上了绿衣服。秋天，小树又想换一件，秋风一吹，绿衣服变成了黄衣服。冬天，雪花飘下来，给小树盖上了白被子。小树说：“谢谢你们！”
?1 小树想要什么？ | What does the little tree want?
= 一件新衣服 | 小树想要一件新衣服
- 一个新朋友 ~unsaid
- 很多很多水 ~life
?1 谁给小树穿上了绿衣服？ | Who dresses the tree in green?
= 春风 | 春风吹来
- 秋风 ~other
- 雪花 ~other
?1 冬天，雪花给小树盖上了什么？ | What does the snow cover the tree with in winter?
= 白被子 | 给小树盖上了白被子
- 黄衣服 ~other
- 绿衣服 ~other
?2 哪件事是想象出来的？ | Which of these is imagined?
= 小树说“谢谢你们” | 小树说：“谢谢你们！”
- 秋天树叶变黄 ~real
- 冬天下雪 ~real
?2 故事里小树的“绿衣服”其实是什么？ | What is the tree's "green coat" really?
= 绿色的叶子 | 给它穿上了绿衣服
- 真的衣服 ~sense
- 绿色的花 ~sense
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 秋天，树叶变黄了 | 绿衣服变成了黄衣服
- 春风给小树穿衣服 ~imagined
- 小树想要新衣服 ~imagined

# 小星星找朋友
天上有一颗小星星，它想找一个朋友。它问月亮：“你能做我的朋友吗？”月亮说：“我白天要睡觉。”它又问太阳，太阳说：“我晚上要回家。”最后，小星星看见了小朋友窗前的一盏小灯。小灯一闪一闪的，就像另一颗星星。它们成了好朋友。
?1 小星星想要什么？ | What does the little star want?
= 一个朋友 | 它想找一个朋友
- 一个月亮 ~unsaid
- 一盏灯 ~other
?1 月亮为什么不能做它的朋友？ | Why can the moon not be its friend?
= 白天要睡觉 | 我白天要睡觉
- 晚上要回家 ~other
- 不喜欢小星星 ~unsaid
?1 最后谁和小星星成了好朋友？ | Who becomes the star's friend in the end?
= 窗前的小灯 | 窗前的一盏小灯
- 月亮 ~opposite
- 太阳 ~opposite
?2 哪件事是想象出来的？ | Which of these is imagined?
= 小星星和月亮说话 | 它问月亮
- 晚上能看到星星 ~real
- 窗前有一盏灯 ~real
?2 哪件事是想象出来的？ | Which of these is imagined?
= 小灯和小星星成了好朋友 | 它们成了好朋友
- 灯一闪一闪的 ~real
- 太阳白天出来 ~real
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 晚上窗前的灯亮着 | 窗前的一盏小灯
- 月亮白天要睡觉 ~imagined
- 太阳晚上要回家 ~imagined

# 爱哭的小云
有一朵小云，它一不高兴就哭。它一哭，地上就下起雨来。小草说：“谢谢你，我正渴呢！”小云听了，笑了。从此，它知道自己的眼泪也能帮助别人。
?1 小云不高兴的时候会怎么样？ | What does the little cloud do when it is unhappy?
= 哭 | 它一不高兴就哭
- 笑 ~opposite
- 跑开 ~unsaid
?1 小云一哭，地上怎么样？ | What happens on the ground when the cloud cries?
= 下起雨来 | 地上就下起雨来
- 刮起风来 ~unsaid
- 下起雪来 ~unsaid
?1 小草为什么谢谢小云？ | Why does the grass thank the cloud?
= 小草正渴 | 我正渴呢
- 小云笑了 ~other
- 小云陪它玩 ~unsaid
?2 哪件事是想象出来的？ | Which of these is imagined?
= 小云会哭会笑 | 小云听了，笑了
- 天上有云 ~real
- 下雨了，小草能喝到水 ~real
?2 故事里小云的“眼泪”其实是什么？ | What are the cloud's "tears" really?
= 雨 | 它一哭，地上就下起雨来
- 水果 ~sense
- 雪 ~sense
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 下雨了，地上的小草能喝到水 | 地上就下起雨来
- 小草会说话 ~imagined
- 小云会笑 ~imagined

# 小熊的生日
今天是小熊的生日，它想要一个大蛋糕。小兔送来了青菜，小猴送来了桃子，小鸟送来了一首歌。小熊没有蛋糕，可是它笑着说：“有你们这些好朋友，这就是最好的生日！”
?1 小熊想要什么？ | What does the little bear want?
= 一个大蛋糕 | 它想要一个大蛋糕
- 一首歌 ~other
- 很多桃子 ~other
?1 小猴送来了什么？ | What does the monkey bring?
= 桃子 | 小猴送来了桃子
- 青菜 ~other
- 一首歌 ~other
?1 小熊觉得什么是最好的生日？ | What does the bear think makes the best birthday?
≈ 有好朋友在一起 | 有你们这些好朋友 | 小熊没有蛋糕 | 这就是最好的生日
- 有一个大蛋糕 ~opposite
- 有很多礼物 ~unsaid
?2 哪件事是想象出来的？ | Which of these is imagined?
= 小鸟送来了一首歌 | 小鸟送来了一首歌
- 小鸟会叫 ~real
- 猴子爱吃桃子 ~real
?2 哪件事是想象出来的？ | Which of these is imagined?
= 小熊过生日，和朋友说话 | 它笑着说
- 熊住在山里 ~real
- 兔子吃青菜 ~real
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 兔子吃青菜 | 小兔送来了青菜
- 小熊过生日 ~imagined
- 小鸟送礼物 ~imagined

# 鞋子去旅行
小红有一双旧鞋子，它们很想去看看外面的世界。一天晚上，它们一左一右，走出了家门。它们走过小河，走过高山，看到了很多好玩的东西。天亮了，它们又走回来，回到了小红的床边。
?1 鞋子想做什么？ | What do the shoes want?
= 去看看外面的世界 | 很想去看看外面的世界
- 被洗干净 ~unsaid
- 换成新鞋子 ~unsaid
?1 鞋子什么时候走出了家门？ | When do the shoes go out?
= 晚上 | 一天晚上
- 早上 ~unsaid
- 中午 ~unsaid
?1 天亮了，鞋子回到了哪里？ | Where are the shoes when it gets light?
= 小红的床边 | 回到了小红的床边
- 小河边 ~other
- 高山上 ~other
?2 哪件事是想象出来的？ | Which of these is imagined?
= 鞋子自己走出了家门 | 它们一左一右，走出了家门
- 小红穿着鞋子走路 ~real
- 鞋子穿久了会旧 ~real
?2 哪件事是想象出来的？ | Which of these is imagined?
= 鞋子看到了很多好玩的东西 | 看到了很多好玩的东西
- 鞋子放在床边 ~real
- 天亮了 ~real
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 鞋子放在床边 | 回到了小红的床边
- 鞋子想去看外面的世界 ~imagined
- 鞋子自己走过高山 ~imagined

# 太阳公公
太阳公公起得早，它推开云朵，对大地说：“起床啦！”公鸡听见了，喔喔地叫；花儿听见了，张开了笑脸；小朋友听见了，背上书包去上学。
?1 太阳公公对大地说什么？ | What does Grandpa Sun say to the land?
= 起床啦 | 起床啦
- 睡觉啦 ~opposite
- 下雨啦 ~unsaid
?1 花儿听见了，怎么样？ | What do the flowers do when they hear it?
= 张开了笑脸 | 花儿听见了，张开了笑脸
- 喔喔地叫 ~other
- 去上学 ~other
?1 小朋友听见了，做什么？ | What do the children do when they hear it?
= 背上书包去上学 | 背上书包去上学
- 张开了笑脸 ~other
- 接着睡觉 ~opposite
?2 哪件事是想象出来的？ | Which of these is imagined?
= 太阳公公会说话 | 对大地说
- 太阳早上出来 ~real
- 公鸡早上会叫 ~real
?2 花儿“张开了笑脸”，其实是说什么？ | What does it really mean that the flowers "open their smiling faces"?
= 花开了 | 花儿听见了，张开了笑脸
- 花儿笑出了声 ~sense
- 花儿被摘了 ~sense
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 早上公鸡会叫 | 公鸡听见了，喔喔地叫
- 太阳会推开云朵 ~imagined
- 花儿听见太阳说话 ~imagined

# 小书包
我的小书包会说话。早上，它说：“别忘了带水杯！”下午，它说：“作业本放进来了吗？”有一天，我把它放在地上，它不高兴地说：“我也要干干净净的！”从此，我天天把书包放在桌子上。
?1 早上书包说什么？ | What does the schoolbag say in the morning?
= 别忘了带水杯 | 别忘了带水杯
- 作业本放进来了吗 ~other
- 我也要干干净净的 ~other
?1 书包为什么不高兴？ | Why is the schoolbag unhappy?
≈ 被放在了地上 | 我把它放在地上 | 我也要干干净净的
- 没有带水杯 ~unsaid
- 作业太多了 ~unsaid
?1 从此，我把书包放在哪里？ | Where do I put the schoolbag from then on?
= 桌子上 | 天天把书包放在桌子上
- 地上 ~opposite
- 床上 ~unsaid
?2 哪件事是想象出来的？ | Which of these is imagined?
= 书包会说话 | 我的小书包会说话
- 书包里放着作业本 ~real
- 书包放在桌子上 ~real
?2 哪件事是想象出来的？ | Which of these is imagined?
= 书包不高兴地说话 | 它不高兴地说
- 书包放在地上会脏 ~real
- 上学要带水杯 ~real
?2 下面哪件事在生活中真的会有？ | Which of these happens in real life?
= 书包里能放作业本 | 作业本放进来了吗
- 书包会不高兴 ~imagined
- 书包会说话 ~imagined
`;

/** NATURE are the short texts on nature and things of reading-2-science. */
export const NATURE = `
# 影子
有太阳的时候，我们身边常常跟着一个黑黑的影子。这是因为光照不过我们的身体，在地上留下了一块黑影。早上和下午，太阳在天边，影子长长的；中午，太阳高高地在头上，影子就短短的。
?1 中午的影子是什么样的？ | What is a shadow like at noon?
= 短短的 | 影子就短短的
- 长长的 ~opposite
- 一点也没有 ~unsaid
?1 早上的影子是什么样的？ | What is a shadow like in the morning?
= 长长的 | 太阳在天边，影子长长的
- 短短的 ~opposite
- 看不见 ~unsaid
?1 影子是什么颜色的？ | What colour is a shadow?
= 黑黑的 | 黑黑的影子
- 白白的 ~unsaid
- 红红的 ~unsaid
?2 为什么会有影子？ | Why is there a shadow?
= 光照不过我们的身体 | 这是因为光照不过我们的身体
- 影子要跟着我们玩 ~unsaid
- 太阳在天边 ~other
?2 为什么中午的影子短？ | Why is a shadow short at noon?
= 太阳高高地在头上 | 中午，太阳高高地在头上
- 中午人长高了 ~unsaid
- 中午没有光 ~opposite
?2 为什么早上的影子长？ | Why is a shadow long in the morning?
= 太阳在天边 | 早上和下午，太阳在天边
- 早上人长高了 ~unsaid
- 早上太阳在头上 ~opposite

# 树叶变黄
秋天到了，很多树的叶子变黄了，一片片落下来。这是因为天气变冷了，树要把水留在树干和树根里，好过冬。叶子没有了水，就变黄、变干，从树上落下来。到了春天，树又会长出新叶子。
?1 秋天，很多树的叶子怎么样？ | What happens to the leaves of many trees in autumn?
= 变黄了，落下来 | 很多树的叶子变黄了，一片片落下来
- 变得更绿了 ~opposite
- 开出了花 ~unsaid
?1 到了春天，树会怎么样？ | What do trees do in spring?
= 长出新叶子 | 树又会长出新叶子
- 叶子都落光 ~opposite
- 叶子变黄 ~opposite
?1 树把水留在哪里？ | Where does a tree keep its water?
= 树干和树根里 | 留在树干和树根里
- 叶子里 ~opposite
- 地上 ~unsaid
?2 秋天，叶子为什么会变黄？ | Why do leaves turn yellow in autumn?
= 叶子没有了水 | 叶子没有了水，就变黄
- 叶子被太阳晒黄了 ~unsaid
- 有人把叶子涂黄了 ~unsaid
?2 树为什么要把水留在树干和树根里？ | Why does a tree keep its water in its trunk and roots?
= 好过冬 | 好过冬
- 好开出花来 ~unsaid
- 好让叶子更绿 ~opposite
?2 叶子为什么会从树上落下来？ | Why do leaves fall from the tree?
= 叶子变黄、变干了 | 就变黄、变干，从树上落下来
- 风把它们吹下来了 ~life
- 小鸟把它们摘下来了 ~unsaid

# 熊过冬
冬天，山里很冷，吃的东西也很少。熊在秋天吃得饱饱的，长得胖胖的。冬天一到，它就找一个山洞，在里面睡上一个冬天，这叫做冬眠。熊冬眠的时候不吃东西，靠身上的肥肉过冬。
?1 熊在秋天怎么样？ | What does a bear do in autumn?
= 吃得饱饱的，长得胖胖的 | 熊在秋天吃得饱饱的，长得胖胖的
- 天天睡觉 ~unsaid
- 瘦了很多 ~opposite
?1 熊在哪里过冬？ | Where does a bear spend the winter?
= 山洞里 | 它就找一个山洞
- 树上 ~unsaid
- 河边 ~unsaid
?1 熊冬眠的时候吃东西吗？ | Does a bear eat while it hibernates?
= 不吃 | 熊冬眠的时候不吃东西
- 吃很多 ~opposite
- 只吃鱼 ~unsaid
?2 熊冬天为什么要睡觉？ | Why does a bear sleep through the winter?
= 山里很冷，吃的东西也很少 | 冬天，山里很冷，吃的东西也很少
- 它太累了 ~unsaid
- 它不喜欢雪 ~unsaid
?2 熊冬眠的时候不吃东西，靠什么过冬？ | Eating nothing, what does a bear live on in winter?
= 身上的肥肉 | 靠身上的肥肉过冬
- 山洞里的水 ~unsaid
- 别的熊送来的东西 ~unsaid
?2 熊为什么秋天要吃得饱饱的？ | Why does a bear eat its fill in autumn?
≈ 冬天要靠身上的肥肉过冬 | 靠身上的肥肉过冬 | 熊在秋天吃得饱饱的，长得胖胖的 | 熊冬眠的时候不吃东西
- 秋天的东西好吃 ~life
- 秋天要长高 ~unsaid

# 彩虹
雨停了，太阳出来了，天上有时会出现一道彩虹。彩虹有红、橙、黄、绿、青、蓝、紫七种颜色。这是因为空中还有很多小水珠，太阳光照在小水珠上，就分成了好几种颜色。所以，彩虹常在雨后出现，而且总在太阳对面的天上。
?1 彩虹什么时候会出现？ | When does a rainbow appear?
= 雨停了，太阳出来了 | 雨停了，太阳出来了
- 下大雨的时候 ~unsaid
- 晚上 ~unsaid
?1 彩虹有几种颜色？ | How many colours has a rainbow?
= 七种 | 七种颜色
- 一种 ~unsaid
- 三种 ~unsaid
?1 彩虹在哪边的天上？ | In which part of the sky is a rainbow?
= 太阳对面 | 总在太阳对面的天上
- 太阳旁边 ~opposite
- 地上 ~unsaid
?2 为什么会有彩虹？ | Why is there a rainbow?
= 太阳光照在小水珠上，分成了好几种颜色 | 太阳光照在小水珠上，就分成了好几种颜色
- 有人在天上画画 ~unsaid
- 云是彩色的 ~unsaid
?2 为什么彩虹常在雨后出现？ | Why does a rainbow often come after rain?
= 雨后空中还有很多小水珠 | 空中还有很多小水珠
- 雨后天很蓝 ~unsaid
- 雨后太阳很热 ~unsaid
?2 没有太阳的时候，为什么看不到彩虹？ | Why is there no rainbow without the sun?
≈ 彩虹是太阳光照在小水珠上分成的颜色 | 太阳光照在小水珠上 | 雨停了，太阳出来了
% 短文说，彩虹是太阳光照在小水珠上分出来的颜色，它在“雨停了，太阳出来了”的时候出现。没有太阳，就没有太阳光照在小水珠上，颜色也就分不出来，所以看不到彩虹。 | The passage says a rainbow is the colours sunlight splits into on the drops, and that it comes when “the rain stops and the sun comes out”. Without the sun no sunlight falls on the drops and no colours split off, so there is no rainbow to see.
- 因为没有下雨 ~unsaid
- 因为小水珠都飞走了 ~unsaid

# 向日葵
向日葵开着大大的黄花。因为它的花盘向着太阳，所以叫向日葵。它小的时候，花盘总是跟着太阳转：早上太阳在东边，它就朝东；下午太阳在西边，它就朝西。它这样做，是为了多晒太阳，长得快一些。等它长大了，花盘就一直朝着东方，不再转了。向日葵的种子，就是我们吃的瓜子。
?1 向日葵开什么颜色的花？ | What colour are sunflowers?
= 黄色 | 向日葵开着大大的黄花
- 红色 ~unsaid
- 白色 ~unsaid
?1 长大的向日葵，花盘朝着哪边？ | Which way does a grown sunflower face?
= 东方 | 花盘就一直朝着东方
- 西方 ~other
- 跟着太阳转 ~other
?1 向日葵的种子是什么？ | What are sunflower seeds?
= 我们吃的瓜子 | 就是我们吃的瓜子
- 西瓜 ~unsaid
- 大大的黄花 ~unsaid
?2 为什么叫它向日葵？ | Why is it called 向日葵?
= 它的花盘向着太阳 | 因为它的花盘向着太阳
- 它的花是黄色的 ~unsaid
- 它长得很高 ~unsaid
?2 小向日葵为什么跟着太阳转？ | Why does a young sunflower turn with the sun?
= 为了多晒太阳，长得快一些 | 是为了多晒太阳，长得快一些
- 它喜欢跳舞 ~unsaid
- 风把它吹转了 ~unsaid
?2 早上，小向日葵为什么朝着东边？ | Why does a young sunflower face east in the morning?
= 早上太阳在东边 | 早上太阳在东边，它就朝东
- 东边有风 ~unsaid
- 它已经长大了 ~other

# 蒲公英
蒲公英的种子像一把把小伞。风一吹，小伞就飞起来，飞到很远的地方。小伞落在哪里，就在哪里安家，第二年长出新的蒲公英。因为有了小伞，蒲公英的种子才能去很远的地方。
?1 蒲公英的种子像什么？ | What are dandelion seeds like?
= 一把把小伞 | 蒲公英的种子像一把把小伞
- 一只只小船 ~unsaid
- 一只只小鸟 ~unsaid
?1 种子落下来以后怎么样？ | What happens once a seed lands?
= 在那里安家，长出新的蒲公英 | 就在哪里安家
- 马上飞回来 ~unsaid
- 又变成小伞 ~unsaid
?1 什么时候长出新的蒲公英？ | When does a new dandelion grow?
= 第二年 | 第二年长出新的蒲公英
- 第二天 ~unsaid
- 马上 ~unsaid
?2 种子是怎么飞起来的？ | How do the seeds fly?
= 风一吹，就飞起来 | 风一吹，小伞就飞起来
- 小鸟带着它们飞 ~unsaid
- 它们自己会飞 ~unsaid
?2 为什么蒲公英的种子能去很远的地方？ | Why can dandelion seeds travel far?
= 它们有小伞 | 因为有了小伞
- 它们很重 ~opposite
- 有人把它们带走 ~unsaid
?2 为什么很多地方都长着蒲公英？ | Why do dandelions grow in so many places?
≈ 种子被风吹到了很多地方 | 飞到很远的地方 | 风一吹，小伞就飞起来 | 小伞落在哪里，就在哪里安家
- 都是人种的 ~unsaid
- 蒲公英会走路 ~unsaid

# 雪
冬天，天气很冷，空中的小水珠变成了小冰花，一片片落下来，这就是雪。雪花大多有六个角。雪落在地上，像给大地盖上了一床白被子。雪下面的地不会冻得太冷，所以麦苗在雪下面也能过冬。等太阳出来，天气暖和了，雪就化成了水。
?1 雪花大多有几个角？ | How many points have most snowflakes?
= 六个 | 雪花大多有六个角
- 五个 ~unsaid
- 八个 ~unsaid
?1 雪下面的麦苗怎么样？ | What becomes of the wheat under the snow?
= 也能过冬 | 麦苗在雪下面也能过冬
- 被冻死了 ~opposite
- 开出了花 ~unsaid
?1 天气暖和了，雪会怎么样？ | What happens to snow when it gets warm?
= 化成水 | 雪就化成了水
- 变得更多 ~opposite
- 飞上天 ~unsaid
?2 雪是怎么来的？ | Where does snow come from?
= 天气冷，空中的小水珠变成了小冰花 | 空中的小水珠变成了小冰花
- 有人在天上撒白纸 ~unsaid
- 白云掉下来了 ~unsaid
?2 为什么麦苗在雪下面也能过冬？ | Why can wheat survive the winter under snow?
= 雪下面的地不会冻得太冷 | 雪下面的地不会冻得太冷
- 麦苗不怕冷 ~unsaid
- 雪是热的 ~opposite
?2 雪为什么会化成水？ | Why does snow turn to water?
= 太阳出来，天气暖和了 | 等太阳出来，天气暖和了
- 雪被人吃了 ~unsaid
- 风把雪吹走了 ~unsaid

# 月亮的样子
月亮的样子会变。有时候它圆圆的，像一个大盘子；有时候它弯弯的，像一只小船。其实月亮自己不会发光，我们看到的是太阳照亮的那一部分。那一部分有时多，有时少，所以月亮看起来一会儿圆，一会儿弯。差不多一个月，月亮就会从弯变圆，再从圆变弯。
?1 月亮圆的时候像什么？ | What is the full moon like?
= 一个大盘子 | 像一个大盘子
- 一只小船 ~other
- 一个皮球 ~unsaid
?1 月亮从弯变圆再变弯，差不多要多长时间？ | About how long does the moon take to go from thin to round and back?
= 一个月 | 差不多一个月
- 一天 ~unsaid
- 一年 ~unsaid
?1 月亮弯弯的时候像什么？ | What is a thin moon like?
= 一只小船 | 像一只小船
- 一个大盘子 ~other
- 一颗星星 ~unsaid
?2 月亮为什么一会儿圆，一会儿弯？ | Why is the moon now round, now thin?
= 我们看到的照亮的部分有时多，有时少 | 那一部分有时多，有时少
- 月亮被吃掉了一块 ~unsaid
- 月亮自己长大又变小 ~unsaid
?2 我们为什么能看见月亮？ | Why can we see the moon?
≈ 太阳照亮了它 | 我们看到的是太阳照亮的那一部分 | 其实月亮自己不会发光
- 月亮自己会发光 ~opposite
- 月亮离我们很近 ~unsaid
?2 月亮自己不会发光，它的光是从哪里来的？ | The moon makes no light; where does its light come from?
= 太阳 | 太阳照亮的那一部分
- 星星 ~unsaid
- 路灯 ~unsaid

# 种子长大
种子要长成小苗，需要水、空气和合适的温度。春天，天气变暖，雨水也多了，所以农民常在春天种地。种子喝饱了水，就会长出白白的小根，再长出绿绿的小芽。如果太干或太冷，种子就长不出来。
?1 种子先长出什么？ | What does a seed grow first?
= 白白的小根 | 就会长出白白的小根
- 绿绿的小芽 ~order
- 小花 ~unsaid
?1 种子要长成小苗，需要什么？ | What does a seed need to become a seedling?
= 水、空气和合适的温度 | 需要水、空气和合适的温度
- 只要有水 ~part
- 很多很多肥料 ~unsaid
?1 农民常在什么时候种地？ | When do farmers usually sow?
= 春天 | 所以农民常在春天种地
- 冬天 ~unsaid
- 秋天 ~unsaid
?2 农民为什么常在春天种地？ | Why do farmers usually sow in spring?
= 春天天气变暖，雨水也多 | 春天，天气变暖，雨水也多了
- 春天有很多花 ~unsaid
- 春天学校放假 ~unsaid
?2 种子为什么会长不出来？ | Why might a seed not grow?
= 太干或太冷 | 如果太干或太冷
- 天气太暖和 ~opposite
- 雨水太多 ~unsaid
?2 种子什么时候会长出小根？ | When does a seed put out its little root?
= 喝饱了水以后 | 种子喝饱了水
- 晒了太阳以后 ~unsaid
- 过了冬天以后 ~unsaid

# 风
空气动起来，就有了风。风小的时候，树叶轻轻地动；风大的时候，大树也会弯下腰。人们用风来做很多事：风能吹干洗好的衣服，还能推着风车转，发出电来。
?1 风小的时候，树叶怎么样？ | What do leaves do in a light wind?
= 轻轻地动 | 树叶轻轻地动
- 一动也不动 ~opposite
- 都落光了 ~unsaid
?1 风大的时候，大树怎么样？ | What do big trees do in a strong wind?
= 弯下腰 | 大树也会弯下腰
- 轻轻地动 ~other
- 长高了 ~unsaid
?1 风能推着什么转？ | What can the wind turn?
= 风车 | 还能推着风车转
- 汽车 ~unsaid
- 太阳 ~unsaid
?2 风是怎么来的？ | Where does wind come from?
= 空气动起来 | 空气动起来，就有了风
- 树叶动起来 ~opposite
- 太阳出来 ~unsaid
?2 洗好的衣服为什么能干？ | Why do washed clothes dry?
= 风把它们吹干了 | 风能吹干洗好的衣服
- 衣服被人拿走了 ~unsaid
- 衣服自己会走到太阳下面 ~unsaid
?2 风车为什么会转？ | Why does a windmill turn?
= 风推着它转 | 还能推着风车转
- 电让它转 ~opposite
- 有人在推它 ~unsaid
`;
