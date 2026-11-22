// The texts of the reading topics of grade 1 (docs/chinese-curriculum.md §18.9), written for this subject. The format is that of parsePieces in topic-kit.ts: a
// question's wrong options carry the reason they are wrong.

/** RHYMES are the nursery rhymes and children's verse of reading-1-rhymes. */
export const RHYMES = `
# 小花猫
小花猫，喵喵叫，
天天早上睡懒觉。
妈妈叫它快起床，
它说：“再睡一会儿好。”
?1 小花猫天天早上做什么？ | What does the little cat do every morning?
= 睡懒觉 | 天天早上睡懒觉
- 吃小鱼 ~life
- 洗脸 ~unsaid
?1 谁叫小花猫起床？ | Who tells the little cat to get up?
= 妈妈 | 妈妈叫它快起床
- 爸爸 ~who
- 小花猫自己 ~who
?1 小花猫想怎么样？ | What does the little cat want?
= 再睡一会儿 | 再睡一会儿好
- 快快起床 ~opposite
- 去吃早饭 ~unsaid
?2 哪几个字押韵？ | Which characters rhyme?
= 叫、觉、好 | 天天早上睡懒觉
- 叫、床、好 ~mixed
- 猫、天、上 ~notend
?2 和“叫”押韵的是哪个字？ | Which character rhymes with 叫?
= 觉 | 天天早上睡懒觉
- 床 ~rhyme
- 妈 ~rhyme
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= ao | 小花猫，喵喵叫
- ang ~final
- a ~final

# 下雨了
下雨了，下雨了，
小狗小鸡回到家。
小狗说：“我不怕。”
小鸡说：“我要找妈妈。”
?1 下雨了，谁回到了家？ | It rains; who goes home?
= 小狗和小鸡 | 小狗小鸡回到家
- 小猫和小鸟 ~who
- 只有小狗 ~part
?1 谁说“我不怕”？ | Who says it is not afraid?
= 小狗 | 小狗说：“我不怕。”
- 小鸡 ~who
- 妈妈 ~who
?1 小鸡想做什么？ | What does the chick want to do?
= 找妈妈 | 我要找妈妈
- 去玩水 ~unsaid
- 回到家 ~other
?2 和“家”押韵的是哪个字？ | Which character rhymes with 家?
= 怕 | 小狗说：“我不怕。”
- 雨 ~rhyme
- 鸡 ~rhyme
?2 哪几个字押韵？ | Which characters rhyme?
= 家、怕、妈 | 小狗小鸡回到家
- 了、家、怕 ~mixed
- 狗、说、鸡 ~notend
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= a | 小狗小鸡回到家
- e ~final
- i ~final

# 月亮
月亮高高在天上，
照着小河照着窗。
小河里面有月亮，
我的窗前也有光。
?1 月亮在哪里？ | Where is the moon?
= 天上 | 月亮高高在天上
- 树上 ~unsaid
- 小河里 ~other
?1 月亮照着什么？ | What does the moon shine on?
= 小河和窗 | 照着小河照着窗
- 只有小河 ~part
- 小船 ~unsaid
?1 窗前有什么？ | What is in front of the window?
= 光 | 我的窗前也有光
- 小河 ~unsaid
- 小船 ~unsaid
?2 和“光”押韵的是哪个字？ | Which character rhymes with 光?
= 窗 | 照着小河照着窗
- 河 ~rhyme
- 前 ~rhyme
?2 哪几个字押韵？ | Which characters rhyme?
= 上、窗、亮、光 | 月亮高高在天上
- 高、河、面、前 ~notend
- 上、河、亮、光 ~mixed
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= ang | 月亮高高在天上
- an ~final
- a ~final

# 小鸟
小鸟小鸟起得早，
飞到树上叫叫叫。
叫醒小草和小花，
大家一起来做操。
?1 小鸟飞到了哪里？ | Where does the little bird fly?
= 树上 | 飞到树上叫叫叫
- 河边 ~unsaid
- 草地上 ~unsaid
?1 小鸟叫醒了谁？ | Whom does the little bird wake up?
= 小草和小花 | 叫醒小草和小花
- 只有小花 ~part
- 小猫 ~who
?1 大家一起来做什么？ | What do they all do together?
= 做操 | 大家一起来做操
- 唱歌 ~unsaid
- 叫叫叫 ~other
?2 哪几个字押韵？ | Which characters rhyme?
= 早、叫、操 | 小鸟小鸟起得早
- 早、花、操 ~mixed
- 鸟、草、到 ~notend
?2 哪一句末尾的字不押韵？ | Which line does not end in the rhyme?
= 叫醒小草和小花 | 叫醒小草和小花
- 小鸟小鸟起得早 ~rhymes
- 大家一起来做操 ~rhymes
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= ao | 小鸟小鸟起得早
- ou ~final
- a ~final

# 春天来
春天来，天气暖，
小草绿，花儿鲜。
小朋友，去公园，
跑跑跳跳真好玩。
?1 春天来了，天气怎么样？ | What is the weather like when spring comes?
= 天气暖 | 春天来，天气暖
- 天气冷 ~opposite
- 天天下雨 ~unsaid
?1 小朋友去了哪里？ | Where do the children go?
= 公园 | 小朋友，去公园
- 学校 ~unsaid
- 河边 ~unsaid
?1 小朋友在公园里做什么？ | What do the children do in the park?
= 跑跑跳跳 | 跑跑跳跳真好玩
- 看书 ~unsaid
- 种花 ~unsaid
?2 和“园”押韵的是哪个字？ | Which character rhymes with 园?
= 玩 | 跑跑跳跳真好玩
- 来 ~rhyme
- 绿 ~rhyme
?2 哪几个字押韵？ | Which characters rhyme?
= 暖、鲜、园、玩 | 春天来，天气暖
- 来、绿、友、跳 ~notend
- 暖、鲜、绿、玩 ~mixed
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= an | 跑跑跳跳真好玩
- ang ~final
- ai ~final

# 我的家
我的家，真不大，
有爸爸，有妈妈。
还有一只小花猫，
天天陪我说说话。
?1 我的家大不大？ | Is my home big?
= 不大 | 我的家，真不大
- 很大 ~opposite
- 有很多房间 ~unsaid
?1 家里还有一只什么？ | What animal is also at home?
= 小花猫 | 还有一只小花猫
- 小白兔 ~unsaid
- 小黄狗 ~unsaid
?1 小花猫天天做什么？ | What does the cat do every day?
= 陪我说话 | 天天陪我说说话
- 吃小鱼 ~life
- 睡大觉 ~unsaid
?2 哪几个字押韵？ | Which characters rhyme?
= 大、妈、话 | 我的家，真不大
- 大、猫、话 ~mixed
- 家、爸、花 ~notend
?2 哪一句末尾的字不押韵？ | Which line does not end in the rhyme?
= 还有一只小花猫 | 还有一只小花猫
- 有爸爸，有妈妈 ~rhymes
- 天天陪我说说话 ~rhymes
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= a | 天天陪我说说话
- ao ~final
- e ~final

# 叶子
秋天到，叶子红，
叶子飞在半空中。
飞呀飞，飞不动，
躺在地上睡一冬。
?1 秋天到了，叶子是什么颜色？ | In autumn, what colour are the leaves?
= 红色 | 秋天到，叶子红
- 黄色 ~life
- 绿色 ~unsaid
?1 叶子飞在哪里？ | Where do the leaves fly?
= 半空中 | 叶子飞在半空中
- 小河里 ~unsaid
- 树上 ~unsaid
?1 叶子最后躺在哪里？ | Where do the leaves lie at last?
= 地上 | 躺在地上睡一冬
- 半空中 ~other
- 河里 ~unsaid
?2 和“红”押韵的是哪个字？ | Which character rhymes with 红?
= 冬 | 躺在地上睡一冬
- 天 ~rhyme
- 子 ~rhyme
?2 哪几个字押韵？ | Which characters rhyme?
= 红、中、动、冬 | 秋天到，叶子红
- 到、红、中、冬 ~mixed
- 天、子、飞、上 ~notend
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= ong | 叶子飞在半空中
- en ~final
- o ~final

# 小红笔
我有一支小红笔，
写字画画都可以。
写个一，写个七，
画只小鸟画只鸡。
?1 我有一支什么笔？ | What pen do I have?
= 小红笔 | 我有一支小红笔
- 小黄笔 ~unsaid
- 大黑笔 ~unsaid
?1 这支笔可以做什么？ | What can the pen do?
= 写字画画 | 写字画画都可以
- 只能写字 ~part
- 唱歌 ~unsaid
?1 我画了什么？ | What do I draw?
= 小鸟和鸡 | 画只小鸟画只鸡
- 只画了小鸟 ~part
- 一和七 ~other
?2 和“笔”押韵的是哪个字？ | Which character rhymes with 笔?
= 鸡 | 画只小鸟画只鸡
- 鸟 ~rhyme
- 字 ~rhyme
?2 哪几个字押韵？ | Which characters rhyme?
= 笔、以、七、鸡 | 我有一支小红笔
- 笔、画、七、鸡 ~mixed
- 有、字、个、鸟 ~notend
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= i | 画只小鸟画只鸡
- u ~final
- ü ~final

# 小黄牛
小黄牛，慢慢走，
走到河边点点头。
河边小草多又多，
吃饱喝足不想走。
?1 小黄牛走得怎么样？ | How does the little ox walk?
= 慢慢地走 | 小黄牛，慢慢走
- 走得很快 ~opposite
- 跑跑跳跳 ~unsaid
?1 小黄牛走到了哪里？ | Where does the little ox walk to?
= 河边 | 走到河边点点头
- 山上 ~unsaid
- 家里 ~unsaid
?1 河边有什么？ | What is by the river?
= 很多小草 | 河边小草多又多
- 很多小鱼 ~life
- 很多小花 ~unsaid
?2 和“头”押韵的是哪个字？ | Which character rhymes with 头?
= 走 | 小黄牛，慢慢走
- 多 ~rhyme
- 草 ~rhyme
?2 哪一句末尾的字不押韵？ | Which line does not end in the rhyme?
= 河边小草多又多 | 河边小草多又多
- 走到河边点点头 ~rhymes
- 吃饱喝足不想走 ~rhymes
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= ou | 走到河边点点头
- uo ~final
- ao ~final

# 快快来
小朋友，快快来，
一起拍手站一排。
你唱歌，我跳舞，
大家都说真可爱。
?1 小朋友站成了什么样子？ | How do the children stand?
= 一排 | 一起拍手站一排
- 一圈 ~unsaid
- 两排 ~unsaid
?1 谁跳舞？ | Who dances?
= 我 | 你唱歌，我跳舞
- 你 ~who
- 大家 ~who
?1 大家都说什么？ | What does everyone say?
= 真可爱 | 大家都说真可爱
- 真好玩 ~unsaid
- 快快来 ~other
?2 和“来”押韵的是哪个字？ | Which character rhymes with 来?
= 排 | 一起拍手站一排
- 舞 ~rhyme
- 歌 ~rhyme
?2 哪几个字押韵？ | Which characters rhyme?
= 来、排、爱 | 小朋友，快快来
- 来、舞、爱 ~mixed
- 拍、手、歌 ~notend
?2 押韵的字，读起来末尾都是哪个音？ | The characters that rhyme all end in which sound?
= ai | 大家都说真可爱
- a ~final
- ei ~final
`;

/** STORIES are the short stories of reading-1-stories. */
export const STORIES = `
# 一把伞
下雨了，小兔没有带伞。小熊看见了，说：“我们一起打我的伞吧！”小兔笑着说：“谢谢你！”两个好朋友打着一把伞，一起走回家。
?1 下雨了，谁没有带伞？ | It rains; who has no umbrella?
= 小兔 | 小兔没有带伞
- 小熊 ~who
- 小猫 ~who
?1 小熊说了什么？ | What does the little bear say?
= 我们一起打我的伞吧 | 我们一起打我的伞吧
- 谢谢你 ~other
- 你快回家吧 ~unsaid
?1 最后它们怎么回家？ | How do they go home in the end?
= 打着一把伞，一起走回家 | 打着一把伞，一起走回家
- 一个一个跑回家 ~unsaid
- 坐车回家 ~unsaid
?2 “小兔没有带伞”，“带”是什么意思？ | In this sentence, what does 带 mean?
= 随身拿着 | 小兔没有带伞
- 走在前面领着 ~sense
- 一条带子 ~sense
?2 “笑着说”是怎么说？ | How does one speak when one 笑着说?
= 高高兴兴地说 | 小兔笑着说
- 哭着说 ~opposite
- 大声地喊 ~sense
?2 “两个好朋友”说的是谁？ | Who are the two good friends?
≈ 小兔和小熊 | 两个好朋友 | 小兔没有带伞 | 小熊看见了
- 小兔和小猫 ~who
- 小熊和妈妈 ~who

# 找虫子
早上，小鸡跟着妈妈去草地上找虫子。小鸡找了很久，一条也没找到。妈妈说：“别急，看看草下面。”小鸡低头一看，真的有一条小虫子！
?1 小鸡跟着谁去找虫子？ | Whom does the chick go with to look for worms?
= 妈妈 | 小鸡跟着妈妈
- 爸爸 ~who
- 小狗 ~who
?1 小鸡去哪里找虫子？ | Where does the chick look for worms?
= 草地上 | 去草地上找虫子
- 河边 ~unsaid
- 树上 ~unsaid
?1 最后小鸡在哪里找到了虫子？ | Where does the chick find a worm in the end?
= 草下面 | 看看草下面
- 树下面 ~unsaid
- 河里 ~unsaid
?2 “找了很久”是什么意思？ | What does 找了很久 mean?
= 找了很长时间 | 小鸡找了很久
- 找了一会儿 ~opposite
- 找到了很多 ~sense
?2 “别急”是什么意思？ | What does 别急 mean?
= 不要着急 | 别急
- 别走 ~sense
- 快一点 ~opposite
?2 “低头一看”，是往哪里看？ | Where does one look when one 低头一看?
= 往下看 | 小鸡低头一看
- 往上看 ~opposite
- 往后看 ~sense

# 大苹果
秋天，小熊在山上找到一个大苹果。苹果太大了，小熊搬不动。小猴、小兔都跑来帮忙，大家一起把苹果搬回了家。小熊说：“我们一起吃吧！”
?1 小熊在哪里找到了苹果？ | Where does the little bear find the apple?
= 山上 | 小熊在山上找到一个大苹果
- 河边 ~unsaid
- 家里 ~unsaid
?1 小熊为什么搬不动苹果？ | Why can the little bear not move the apple?
= 苹果太大了 | 苹果太大了
- 小熊生病了 ~unsaid
- 苹果太小了 ~opposite
?1 谁来帮小熊？ | Who comes to help the little bear?
= 小猴和小兔 | 小猴、小兔都跑来帮忙
- 只有小猴 ~part
- 小鸡和小狗 ~who
?2 “搬不动”是什么意思？ | What does 搬不动 mean?
= 没有力气把它搬走 | 小熊搬不动
- 不想搬 ~sense
- 搬得很快 ~opposite
?2 “帮忙”是什么意思？ | What does 帮忙 mean?
= 帮着一起做 | 都跑来帮忙
- 一起去玩 ~sense
- 来看一看 ~sense
?2 “大家一起把苹果搬回了家”，“大家”是谁？ | Who are 大家 in this sentence?
≈ 小熊、小猴和小兔 | 大家一起把苹果搬回了家 | 小熊搬不动 | 小猴、小兔都跑来帮忙
- 小猴和小兔 ~part
- 小熊和妈妈 ~who

# 小鱼和小鸟
小鱼住在河里，小鸟住在树上。小鱼说：“河里真好，我可以游来游去。”小鸟说：“天上真好，我可以飞来飞去。”它们都很喜欢自己的家。
?1 小鱼住在哪里？ | Where does the little fish live?
= 河里 | 小鱼住在河里
- 树上 ~other
- 天上 ~unsaid
?1 小鸟说天上哪里好？ | Why does the little bird say the sky is good?
= 可以飞来飞去 | 我可以飞来飞去
- 可以游来游去 ~other
- 有很多虫子 ~unsaid
?1 它们喜欢什么？ | What do they like?
= 自己的家 | 它们都很喜欢自己的家
- 别人的家 ~opposite
- 一起玩 ~unsaid
?2 “游来游去”是什么意思？ | What does 游来游去 mean?
= 一会儿游到这边，一会儿游到那边 | 我可以游来游去
- 游过来就不动了 ~sense
- 只往前面游 ~sense
?2 “它们都很喜欢自己的家”，“它们”是谁？ | Who are 它们 in this sentence?
≈ 小鱼和小鸟 | 它们都很喜欢自己的家 | 小鱼住在河里，小鸟住在树上
- 只有小鱼 ~part
- 小鸟和小猫 ~who
?2 “河里真好”，“真好”是什么意思？ | What does 真好 mean here?
= 非常好 | 河里真好
- 不太好 ~opposite
- 是真的吗 ~sense

# 小黄狗
明明在公园里踢球。球一下子飞到了花的后面，明明找不到了。一只小黄狗跑过去，把球带了回来。明明高兴地说：“谢谢你，小黄狗！”
?1 明明在哪里踢球？ | Where does Mingming play football?
= 公园里 | 明明在公园里踢球
- 学校里 ~unsaid
- 家门口 ~unsaid
?1 球飞到了哪里？ | Where does the ball fly to?
= 花的后面 | 球一下子飞到了花的后面
- 树上 ~unsaid
- 河里 ~unsaid
?1 谁把球带了回来？ | Who brings the ball back?
= 小黄狗 | 一只小黄狗跑过去
- 明明 ~who
- 小花猫 ~who
?2 “一下子”是什么意思？ | What does 一下子 mean?
= 很快，时间很短 | 球一下子飞到了花的后面
- 慢慢地 ~opposite
- 一个下午 ~sense
?2 “把球带了回来”是什么意思？ | What does 把球带了回来 mean?
= 拿着球送回来 | 把球带了回来
- 把球拿走了 ~opposite
- 走在前面领路 ~sense
?2 “高兴地说”是怎么说？ | How does one speak when one 高兴地说?
= 开开心心地说 | 明明高兴地说
- 难过地说 ~opposite
- 小声地说 ~sense

# 下雪了
早上，小红打开窗，看见外面一片白。下雪了！她和弟弟穿上大衣，跑到外面去堆雪人。雪人有大大的头，还有红红的鼻子。
?1 小红打开窗，看见了什么？ | What does Xiaohong see when she opens the window?
= 外面一片白 | 看见外面一片白
- 太阳出来了 ~unsaid
- 一只小鸟 ~unsaid
?1 小红和谁一起去堆雪人？ | With whom does Xiaohong make a snowman?
= 弟弟 | 她和弟弟穿上大衣
- 妹妹 ~who
- 妈妈 ~who
?1 雪人的鼻子是什么颜色的？ | What colour is the snowman's nose?
= 红色 | 还有红红的鼻子
- 白色 ~unsaid
- 黑色 ~unsaid
?2 “外面一片白”是什么意思？ | What does 外面一片白 mean?
= 外面到处都是白色 | 看见外面一片白
- 外面有一张白纸 ~sense
- 外面只有一点白 ~opposite
?2 “大大的头”是说头怎么样？ | What does 大大的头 say about the head?
= 很大 | 雪人有大大的头
- 很小 ~opposite
- 很高 ~sense
?2 “跑到外面去”，“外面”是哪里？ | Where is 外面 here?
= 家的外面 | 跑到外面去堆雪人
- 窗子里面 ~opposite
- 学校里面 ~sense

# 门前的小树
春天，爸爸和我在门前种了小树。我天天给它浇水。小树一天天长高了，长出了绿绿的叶子。我和小树都长大了。
?1 小树种在哪里？ | Where is the little tree planted?
= 门前 | 在门前种了小树
- 河边 ~unsaid
- 山上 ~unsaid
?1 谁和我一起种树？ | Who plants the tree with me?
= 爸爸 | 爸爸和我
- 妈妈 ~who
- 爷爷 ~who
?1 我天天为小树做什么？ | What do I do for the tree every day?
= 给它浇水 | 我天天给它浇水
- 给它唱歌 ~unsaid
- 摘它的叶子 ~unsaid
?2 “一天天长高了”是什么意思？ | What does 一天天长高了 mean?
= 每天都长高一点 | 小树一天天长高了
- 一天就长得很高 ~sense
- 一天比一天矮 ~opposite
?2 “绿绿的叶子”是什么样的叶子？ | What are 绿绿的叶子 like?
= 颜色很绿的叶子 | 长出了绿绿的叶子
- 黄黄的叶子 ~sense
- 很大的叶子 ~sense
?2 “我和小树都长大了”，“都”是什么意思？ | What does 都 mean in this sentence?
= 两个全是这样 | 我和小树都长大了
- 只有一个 ~opposite
- 首都的“都” ~sense

# 排队
课间，同学们排队喝水。小明来晚了，他没有走到前面去，站到了最后面。老师看见了，笑着说：“小明真懂事！”
?1 同学们排队做什么？ | What do the pupils queue for?
= 喝水 | 同学们排队喝水
- 上课 ~unsaid
- 吃饭 ~unsaid
?1 小明站到了哪里？ | Where does Xiaoming stand?
= 最后面 | 站到了最后面
- 最前面 ~opposite
- 中间 ~unsaid
?1 谁说小明真懂事？ | Who says Xiaoming is sensible?
= 老师 | 老师看见了
- 同学们 ~who
- 妈妈 ~who
?2 “来晚了”是什么意思？ | What does 来晚了 mean?
= 来得比别人迟 | 小明来晚了
- 晚上才来 ~sense
- 来得很早 ~opposite
?2 “懂事”是什么意思？ | What does 懂事 mean?
= 明白道理，做得对 | 小明真懂事
- 会做很多事 ~sense
- 事情很多 ~sense
?2 “课间”是什么时候？ | When is 课间?
= 两节课中间休息的时候 | 课间，同学们排队喝水
- 上课的时候 ~sense
- 放学以后 ~sense

# 一张画
今天是奶奶的生日。我画了一张画送给奶奶，画上有奶奶，还有我。奶奶看了，笑得合不上嘴，说：“这是我最喜欢的礼物！”
?1 今天是谁的生日？ | Whose birthday is it today?
= 奶奶 | 今天是奶奶的生日
- 爷爷 ~who
- 我 ~who
?1 我送给奶奶什么？ | What do I give Grandma?
= 一张画 | 我画了一张画送给奶奶
- 一个蛋糕 ~life
- 一本书 ~unsaid
?1 画上有谁？ | Who is in the picture?
= 奶奶和我 | 画上有奶奶，还有我
- 只有奶奶 ~part
- 爷爷和我 ~who
?2 “笑得合不上嘴”是什么意思？ | What does 笑得合不上嘴 mean?
= 非常高兴 | 笑得合不上嘴
- 嘴巴疼 ~sense
- 有点难过 ~opposite
?2 “礼物”是什么？ | What is a 礼物?
= 送给别人的东西 | 这是我最喜欢的礼物
- 买来吃的东西 ~sense
- 画画用的笔 ~sense
?2 “最喜欢”是什么意思？ | What does 最喜欢 mean?
= 比别的都喜欢 | 这是我最喜欢的礼物
- 有一点喜欢 ~sense
- 不喜欢 ~opposite

# 过河
小羊要过河，可是河上没有桥。老黄牛走过来说：“坐到我的背上来吧！”小羊坐在老黄牛背上，一会儿就过了河。
?1 小羊要做什么？ | What does the little sheep want to do?
= 过河 | 小羊要过河
- 找妈妈 ~unsaid
- 吃草 ~life
?1 小羊为什么过不了河？ | Why can the little sheep not cross?
= 河上没有桥 | 可是河上没有桥
- 河水太冷了 ~unsaid
- 小羊太小了 ~unsaid
?1 谁帮小羊过了河？ | Who helps the little sheep cross?
= 老黄牛 | 老黄牛走过来说
- 小熊 ~who
- 小狗 ~who
?2 “可是河上没有桥”，“可是”是什么意思？ | What does 可是 mean here?
= 但是 | 可是河上没有桥
- 可以 ~sense
- 是的 ~sense
?2 “一会儿”是什么意思？ | What does 一会儿 mean?
= 很短的时间 | 一会儿就过了河
- 一整天 ~opposite
- 一次 ~sense
?2 “坐到我的背上来吧”，“背上”是哪里？ | Where is 背上 here?
= 后背的上面 | 坐到我的背上来吧
- 背书的时候 ~sense
- 头的上面 ~sense
`;

/** SIGNS are the signs, labels, timetables and calendars of reading-1-signs. */
export const SIGNS = `
# 公园门口
开门时间：早上六点到晚上十点
请不要摘花
请不要在草地上走
?1 公园早上几点开门？ | At what time does the park open in the morning?
= 六点 | 早上六点
- 十点 ~other
- 八点 ~unsaid
?1 在公园里不能做什么？ | What must one not do in the park?
= 摘花 | 请不要摘花
- 看花 ~opposite
- 在路上走 ~unsaid
?1 公园晚上几点关门？ | At what time does the park close in the evening?
= 十点 | 晚上十点
- 六点 ~other
- 九点 ~unsaid

# 图书馆
请安静
看完的书请放回原来的地方
不能在这里吃东西
?1 在图书馆里要怎么样？ | How must one be in the library?
= 安安静静的 | 请安静
- 大声说话 ~opposite
- 跑来跑去 ~unsaid
?1 看完的书要怎么办？ | What does one do with a book one has read?
= 放回原来的地方 | 看完的书请放回原来的地方
- 带回家 ~unsaid
- 放在桌子上 ~unsaid
?1 在图书馆里不能做什么？ | What must one not do in the library?
= 吃东西 | 不能在这里吃东西
- 看书 ~opposite
- 写字 ~unsaid

# 牛奶
打开以后请放进冰箱
要在当天喝完
不要喝冷的，可以热一热再喝
?1 牛奶打开以后要放在哪里？ | Where does the milk go once opened?
= 冰箱里 | 请放进冰箱
- 桌子上 ~unsaid
- 书包里 ~unsaid
?1 打开的牛奶要什么时候喝完？ | By when must opened milk be drunk?
= 当天 | 要在当天喝完
- 第二天 ~unsaid
- 一个星期以后 ~unsaid
?1 冷的牛奶可以怎么样？ | What can one do with cold milk?
= 热一热再喝 | 可以热一热再喝
- 放进冰箱 ~other
- 马上喝 ~opposite

# 教室门口
一年级二班
上课时请不要进来
下课十分钟，请到外面走一走
?1 这是哪个班的教室？ | Which class's classroom is this?
= 一年级二班 | 一年级二班
- 二年级一班 ~unsaid
- 一年级一班 ~unsaid
?1 什么时候请不要进来？ | When should one not come in?
= 上课的时候 | 上课时请不要进来
- 下课的时候 ~opposite
- 放学以后 ~unsaid
?1 下课十分钟，要做什么？ | What should one do in the ten minutes between lessons?
= 到外面走一走 | 请到外面走一走
- 在教室里写作业 ~unsaid
- 回家 ~unsaid

# 马路边
小心车辆
红灯停，绿灯行
过马路请走人行横道
?1 红灯亮了，要怎么样？ | What does one do at a red light?
= 停下来 | 红灯停
- 快点走过去 ~opposite
- 往回走 ~unsaid
?1 绿灯亮了，要怎么样？ | What does one do at a green light?
= 可以走 | 绿灯行
- 停下来 ~opposite
- 跑到马路中间 ~unsaid
?1 过马路要走哪里？ | Where does one cross the road?
= 人行横道 | 过马路请走人行横道
- 马路中间 ~unsaid
- 车的旁边 ~unsaid

# 动物园
请不要给动物吃东西
熊猫馆在左边，小猴山在右边
小朋友要跟着大人
?1 熊猫馆在哪边？ | On which side is the panda house?
= 左边 | 熊猫馆在左边
- 右边 ~other
- 前边 ~unsaid
?1 在动物园里不能做什么？ | What must one not do at the zoo?
= 给动物吃东西 | 请不要给动物吃东西
- 看动物 ~opposite
- 和大人一起走 ~opposite
?1 小朋友要跟着谁？ | Whom must children stay with?
= 大人 | 小朋友要跟着大人
- 小动物 ~unsaid
- 别的小朋友 ~unsaid

# 水果店
苹果　一个两元
桃子　一个三元
西瓜　今天卖完了
?1 苹果多少钱一个？ | How much is one apple?
= 两元 | 苹果　一个两元
- 三元 ~other
- 十元 ~unsaid
?1 什么水果今天卖完了？ | Which fruit is sold out today?
= 西瓜 | 西瓜　今天卖完了
- 苹果 ~who
- 桃子 ~who
?1 桃子多少钱一个？ | How much is one peach?
= 三元 | 桃子　一个三元
- 两元 ~other
- 一元 ~unsaid

# 洗手间
洗手间在二楼
男洗手间在左边，女洗手间在右边
洗完手请关好水
?1 洗手间在几楼？ | On which floor are the toilets?
= 二楼 | 洗手间在二楼
- 一楼 ~unsaid
- 三楼 ~unsaid
?1 女洗手间在哪边？ | On which side is the women's toilet?
= 右边 | 女洗手间在右边
- 左边 ~other
- 楼下 ~unsaid
?1 洗完手要做什么？ | What should one do after washing one's hands?
= 关好水 | 洗完手请关好水
- 让水开着 ~opposite
- 再洗一次 ~unsaid

# 学校门口
星光小学
上学时间：早上七点半
放学时间：下午四点
请家长在门外等候
?1 早上几点上学？ | At what time does school start?
= 七点半 | 上学时间：早上七点半
- 四点 ~other
- 八点 ~unsaid
?1 下午几点放学？ | At what time does school end?
= 四点 | 放学时间：下午四点
- 七点半 ~other
- 五点 ~unsaid
?1 家长要在哪里等？ | Where do parents wait?
= 门外 | 请家长在门外等候
- 教室里 ~unsaid
- 门里面 ~opposite

# 小卖部
饮料在左边
面包在右边
今天休息，明天早上八点开门
?1 面包在哪边？ | On which side is the bread?
= 右边 | 面包在右边
- 左边 ~other
- 后边 ~unsaid
?1 小卖部今天开门吗？ | Is the shop open today?
= 不开门，今天休息 | 今天休息
- 开门 ~opposite
- 晚上开门 ~unsaid
?1 明天几点开门？ | At what time does it open tomorrow?
= 早上八点 | 明天早上八点开门
- 晚上八点 ~unsaid
- 早上七点 ~unsaid

# 星期一的课程表
第一节　语文
第二节　数学
第三节　音乐
第四节　体育
下午第一节　美术
下午第二节　语文
?2 第一节是什么课？ | What is the first lesson?
= 语文 | 第一节　语文
- 数学 ~other
- 音乐 ~other
?2 第三节是什么课？ | What is the third lesson?
= 音乐 | 第三节　音乐
- 体育 ~other
- 美术 ~other
?2 星期一有几节语文课？ | How many Chinese lessons are there on Monday?
≈ 两节 | 下午第二节　语文 | 第一节　语文
% 课程表上没有直接写语文课有几节，要自己数。第一节写着“语文”，下午第二节也写着“语文”，别的几节是数学、音乐、体育和美术。写着语文的有两处，所以星期一有两节语文课。 | The timetable does not say how many Chinese lessons there are; you count them. The first lesson is Chinese, and so is the second lesson of the afternoon; the others are maths, music, PE and art. Chinese stands in two places, so there are two Chinese lessons on Monday.
- 一节 ~part
- 三节 ~unsaid
?2 体育课是第几节？ | Which lesson is PE?
= 第四节 | 第四节　体育
- 第三节 ~other
- 下午第一节 ~other
?2 下午第一节是什么课？ | What is the first lesson of the afternoon?
= 美术 | 下午第一节　美术
- 语文 ~other
- 体育 ~other

# 星期三的课程表
第一节　数学
第二节　语文
第三节　科学
第四节　道德与法治
下午第一节　体育
下午第二节　书法
?2 第二节是什么课？ | What is the second lesson?
= 语文 | 第二节　语文
- 数学 ~other
- 科学 ~other
?2 科学课是第几节？ | Which lesson is science?
= 第三节 | 第三节　科学
- 第二节 ~other
- 第四节 ~other
?2 下午第二节是什么课？ | What is the second lesson of the afternoon?
= 书法 | 下午第二节　书法
- 体育 ~other
- 语文 ~other
?2 体育课在上午还是下午？ | Is PE in the morning or the afternoon?
= 下午 | 下午第一节　体育
- 上午 ~opposite
- 晚上 ~unsaid
?2 星期三第一节是什么课？ | What is the first lesson on Wednesday?
= 数学 | 第一节　数学
- 语文 ~other
- 书法 ~other

# 十月的日历
十月一日　星期三　国庆节，放假
十月五日　星期日　去奶奶家
十月八日　星期三　上学
?2 国庆节是几月几日？ | What is the date of National Day?
= 十月一日 | 十月一日　星期三　国庆节
- 十月五日 ~other
- 十月八日 ~other
?2 十月一日是星期几？ | What day of the week is the first of October?
= 星期三 | 十月一日　星期三
- 星期日 ~other
- 星期一 ~unsaid
?2 哪一天去奶奶家？ | On which day do we visit Grandma?
= 十月五日 | 十月五日　星期日　去奶奶家
- 十月一日 ~other
- 十月八日 ~other
?2 十月八日要做什么？ | What happens on the eighth of October?
= 上学 | 十月八日　星期三　上学
- 去奶奶家 ~other
- 放假 ~other
?2 十月五日是星期几？ | What day of the week is the fifth of October?
= 星期日 | 十月五日　星期日
- 星期三 ~other
- 星期六 ~unsaid

# 小明一天的时间
七点　起床
七点半　上学
十二点　吃午饭
下午四点　放学
晚上八点半　睡觉
?2 小明几点起床？ | At what time does Xiaoming get up?
= 七点 | 七点　起床
- 七点半 ~other
- 八点半 ~other
?2 小明几点吃午饭？ | At what time does Xiaoming have lunch?
= 十二点 | 十二点　吃午饭
- 七点 ~other
- 下午四点 ~other
?2 下午四点，小明做什么？ | What does Xiaoming do at four in the afternoon?
= 放学 | 下午四点　放学
- 上学 ~other
- 睡觉 ~other
?2 小明晚上几点睡觉？ | At what time does Xiaoming go to bed?
= 八点半 | 晚上八点半　睡觉
- 七点半 ~other
- 十点 ~unsaid
?2 小明几点上学？ | At what time does Xiaoming go to school?
= 七点半 | 七点半　上学
- 七点 ~other
- 十二点 ~other

# 8路公共汽车
第一班车　早上六点
最后一班车　晚上九点
每十分钟一班
?2 这是几路车？ | Which bus route is this?
= 8路 | 8路公共汽车
- 6路 ~unsaid
- 9路 ~unsaid
?2 第一班车是几点？ | At what time is the first bus?
= 早上六点 | 第一班车　早上六点
- 晚上九点 ~other
- 早上七点 ~unsaid
?2 最后一班车是几点？ | At what time is the last bus?
= 晚上九点 | 最后一班车　晚上九点
- 早上六点 ~other
- 晚上十点 ~unsaid
?2 多长时间来一班车？ | How often does a bus come?
= 十分钟 | 每十分钟一班
- 一个小时 ~unsaid
- 六分钟 ~unsaid
?2 晚上十点还能坐上这路车吗？ | Can one still catch this bus at ten in the evening?
≈ 不能，最后一班车是晚上九点 | 最后一班车　晚上九点
% 时刻表上没有写晚上十点，要自己推。最后一班车是晚上九点，九点以后就没有车了；晚上十点比九点晚，所以坐不上这路车。 | The timetable says nothing about ten in the evening; you work it out. The last bus is at nine, and after it there is none; ten is later than nine, so there is no bus to catch.
- 能 ~opposite
- 能，每十分钟一班 ~part

# 值日表
星期一　小红　小明
星期二　小方　小江
星期三　小东　小花
星期四　小山　小月
星期五　小文　小林
?2 星期一谁值日？ | Who is on duty on Monday?
= 小红和小明 | 星期一　小红　小明
- 小方和小江 ~other
- 只有小红 ~part
?2 小江星期几值日？ | On which day is Xiaojiang on duty?
= 星期二 | 星期二　小方　小江
- 星期一 ~other
- 星期三 ~other
?2 星期五谁值日？ | Who is on duty on Friday?
= 小文和小林 | 星期五　小文　小林
- 小山和小月 ~other
- 只有小林 ~part
?2 小月和谁一起值日？ | With whom is Xiaoyue on duty?
= 小山 | 星期四　小山　小月
- 小花 ~other
- 小林 ~other
?2 小花星期几值日？ | On which day is Xiaohua on duty?
= 星期三 | 星期三　小东　小花
- 星期四 ~other
- 星期五 ~other
`;
