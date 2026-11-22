// The texts of the last reading topics of grade 5 (docs/chinese-curriculum.md §18.9): texts with tables and lists,
// passages whose words are read by their context and colour, and passages read for their order and ways of writing,
// all written for this subject. The format is that of parsePieces in topic-kit.ts.

/** NON_CONTINUOUS_5 are the texts of reading-5-non-continuous: tables, lists and notices, read for facts and conclusions. */
export const NON_CONTINUOUS_5 = `
# 五年级一班课外读书调查
全班共40人。下面是上个月读过各本书的人数：
《西游记》：32人
《安徒生童话》：25人
《鲁滨逊漂流记》：18人
《昆虫记》：12人
《水浒传》：8人
说明：一个人可以读过好几本。
?1 读过《鲁滨逊漂流记》的有多少人？ | How many read Robinson Crusoe?
= 18人 | 《鲁滨逊漂流记》：18人
- 12人 ~figure
- 25人 ~figure
?1 全班一共有多少人？ | How many are in the class?
= 40人 | 全班共40人
- 32人 ~figure
- 95人 ~figure
?1 这张表调查的是什么时候读的书？ | When were the books read?
= 上个月 | 下面是上个月读过各本书的人数
- 这个学期 ~changed
- 去年暑假 ~changed
?2 哪本书读过的人最多？ | Which book did most read?
= 《西游记》 | 《西游记》：32人
- 《安徒生童话》 ~figure
- 《水浒传》 ~figure
?2 把各本书的人数加起来，比全班人数多，这是为什么？ | Why do the numbers add up to more than the class?
= 一个人可以读过好几本 | 说明：一个人可以读过好几本
- 有的同学数错了 ~unsaid
- 别的班的同学也参加了 ~unsaid
?2 根据这张表，下面哪种说法是对的？ | Which statement does the table bear out?
= 读过《昆虫记》的人比读过《水浒传》的多 | 《昆虫记》：12人
- 全班每个人都读过《西游记》 ~figure
- 读《水浒传》的人最多 ~figure

# 下周天气预报
星期一：晴，18℃到26℃
星期二：多云，17℃到24℃
星期三：小雨，15℃到20℃
星期四：中雨，13℃到17℃
星期五：阴，14℃到19℃
星期六：晴，16℃到25℃
星期日：晴，18℃到27℃
?1 星期三的天气怎样？ | What is the weather on Wednesday?
= 小雨，15℃到20℃ | 星期三：小雨，15℃到20℃
- 中雨，13℃到17℃ ~figure
- 多云，17℃到24℃ ~figure
?1 星期五最高气温是多少？ | What is Friday's highest temperature?
= 19℃ | 星期五：阴，14℃到19℃
- 14℃ ~figure
- 25℃ ~figure
?1 这一周有几天是晴天？ | How many sunny days are there?
= 三天 | 星期日：晴，18℃到27℃
- 两天 ~figure
- 四天 ~figure
?2 下周哪一天最冷？ | Which day is coldest?
= 星期四 | 星期四：中雨，13℃到17℃
- 星期三 ~figure
- 星期一 ~figure
?2 学校想选一个晴天去郊游，又不想太晚，最早可以选哪一天？ | The earliest sunny day for an outing?
= 星期一 | 星期一：晴，18℃到26℃
- 星期六 ~figure
- 星期二 ~figure
?2 从这张预报看，这一周的天气怎样变化？ | How does the week's weather change?
= 先晴后雨，再转晴，周末又暖和起来 | 星期日：晴，18℃到27℃
- 一直下雨，越来越冷 ~figure
- 每天都一样 ~figure

# 城际列车时刻表（从东城到西城）
车次　开车时间　到达时间　票价
G101　7:00　8:10　60元
G103　8:30　9:20　60元
D205　9:15　11:05　35元
G107　12:40　13:50　60元
D209　15:00　16:55　35元
?1 G103次列车几点到达西城？ | When does G103 reach Xicheng?
= 9:20 | G103　8:30　9:20　60元
- 8:30 ~figure
- 11:05 ~figure
?1 D字头的列车票价是多少？ | What does a D train cost?
= 35元 | D205　9:15　11:05　35元
- 60元 ~figure
- 95元 ~figure
?1 这张表一共列了几趟列车？ | How many trains are listed?
= 五趟 | D209　15:00　16:55　35元
- 三趟 ~figure
- 四趟 ~figure
?2 哪趟车路上用的时间最短？ | Which train is fastest?
= G103，只用50分钟 | G103　8:30　9:20　60元
- G101，用了70分钟 ~figure
- D205，用了110分钟 ~figure
?2 小明要在10点以前到西城，又想少花钱，他该坐哪一趟？ | Before ten, and cheapest?
= G101或G103，只有它们能在10点前到 | G101　7:00　8:10　60元
- D205，因为它最便宜 ~figure
- G107，因为它最快 ~figure
?2 从表上看，G字头的车和D字头的车比，有什么不同？ | How do G trains differ from D trains?
= G字头的车快，但票价贵 | D209　15:00　16:55　35元
- G字头的车慢，票价便宜 ~figure
- 两种车一样快 ~figure

# 学校食堂本周午餐
星期一：米饭、红烧鸡块、炒青菜、紫菜汤
星期二：米饭、番茄炒蛋、土豆丝、冬瓜汤
星期三：面条、牛肉、黄瓜、绿豆汤
星期四：米饭、清蒸鱼、炒豆角、萝卜汤
星期五：饺子、凉拌木耳、小米粥
提示：对鸡蛋过敏的同学，请提前告诉老师，可以换菜。
?1 星期三的主食是什么？ | What is Wednesday's staple?
= 面条 | 星期三：面条、牛肉、黄瓜、绿豆汤
- 米饭 ~figure
- 饺子 ~figure
?1 哪一天有清蒸鱼？ | Which day has steamed fish?
= 星期四 | 星期四：米饭、清蒸鱼、炒豆角、萝卜汤
- 星期二 ~figure
- 星期五 ~figure
?1 对鸡蛋过敏的同学应该怎么做？ | What should pupils allergic to egg do?
= 提前告诉老师，可以换菜 | 请提前告诉老师，可以换菜
- 那天不来上学 ~unsaid
- 自己带饭 ~unsaid
?2 对鸡蛋过敏的同学，要特别留心哪一天的菜？ | Which day should the egg-allergic watch?
= 星期二 | 星期二：米饭、番茄炒蛋、土豆丝、冬瓜汤
- 星期一 ~figure
- 星期四 ~figure
?2 这一周的主食，哪一种出现得最多？ | Which staple comes most often?
= 米饭 | 星期四：米饭、清蒸鱼、炒豆角、萝卜汤
- 面条 ~figure
- 饺子 ~figure
?2 哪一天的午餐里没有汤？ | Which day has no soup?
= 星期五 | 星期五：饺子、凉拌木耳、小米粥
- 星期三 ~figure
- 星期一 ~figure

# 一年中各月的降雨量（南方某城市）
1月：50毫米　2月：80毫米　3月：120毫米
4月：180毫米　5月：260毫米　6月：310毫米
7月：220毫米　8月：200毫米　9月：150毫米
10月：80毫米　11月：60毫米　12月：40毫米
?1 5月的降雨量是多少？ | What is May's rainfall?
= 260毫米 | 5月：260毫米
- 310毫米 ~figure
- 180毫米 ~figure
?1 哪两个月的降雨量一样多？ | Which two months have the same rainfall?
= 2月和10月 | 10月：80毫米
- 1月和12月 ~figure
- 7月和8月 ~figure
?1 这张表记的是什么？ | What does the table record?
= 一个南方城市每个月的降雨量 | 一年中各月的降雨量
- 每个月的气温 ~unsaid
- 每个月下雨的天数 ~unsaid
?2 这个城市一年中雨最多的是哪个月？ | Which month is wettest?
= 6月 | 6月：310毫米
- 5月 ~figure
- 7月 ~figure
?2 从表上看，这个城市的雨主要集中在什么时候？ | When does most rain fall?
= 春末到夏天 | 5月：260毫米　6月：310毫米
- 冬天 ~figure
- 秋天 ~figure
?2 如果想在雨少的时候去这个城市旅游，最好选哪个月？ | The best month for a dry trip?
= 12月 | 12月：40毫米
- 6月 ~figure
- 4月 ~figure

# 校运动会五年级跳绳比赛成绩（一分钟）
王小雨：168下
李明：152下
张佳佳：175下
陈浩：149下
赵乐：168下
规则：成绩相同的，名次并列。
?1 李明跳了多少下？ | How many did Li Ming jump?
= 152下 | 李明：152下
- 149下 ~figure
- 168下 ~figure
?1 这是什么比赛的成绩？ | What contest is this?
= 五年级一分钟跳绳 | 校运动会五年级跳绳比赛成绩（一分钟）
- 五年级跑步 ~unsaid
- 六年级跳绳 ~changed
?1 成绩相同的怎么排名次？ | How are equal results ranked?
= 名次并列 | 成绩相同的，名次并列
- 再比一次 ~unsaid
- 按名字排 ~unsaid
?2 谁得了第一名？ | Who came first?
= 张佳佳 | 张佳佳：175下
- 王小雨 ~figure
- 赵乐 ~figure
?2 王小雨和赵乐的名次是怎样的？ | How are Wang Xiaoyu and Zhao Le ranked?
= 并列第二名 | 赵乐：168下
- 王小雨第二，赵乐第三 ~unsaid
- 并列第一名 ~figure
?2 第一名比最后一名多跳了多少下？ | How many more did the first jump than the last?
= 26下 | 陈浩：149下
- 23下 ~figure
- 7下 ~figure

# 自然博物馆参观须知
开放时间：星期二到星期日，9:00—17:00（16:00停止入馆）；星期一闭馆。
门票：成人20元；学生凭学生证10元；1.2米以下儿童和70岁以上老人免费。
注意：馆内不能吃东西；拍照时请不要用闪光灯。
?1 博物馆星期几不开门？ | On which day is the museum shut?
= 星期一 | 星期一闭馆
- 星期日 ~changed
- 星期二 ~changed
?1 学生的门票多少钱？ | What does a pupil pay?
= 凭学生证10元 | 学生凭学生证10元
- 20元 ~figure
- 免费 ~figure
?1 在馆里拍照要注意什么？ | What must one mind taking photos?
= 不要用闪光灯 | 拍照时请不要用闪光灯
- 不能拍照 ~changed
- 要先买票 ~unsaid
?2 星期六下午四点半去，能进馆吗？ | Can one go in at half past four on Saturday?
= 不能，16:00就停止入馆了 | 9:00—17:00（16:00停止入馆）
- 能，17:00才关门 ~part
- 能，星期六全天开放 ~figure
?2 一家人去参观：爸爸、妈妈、上五年级带着学生证的小明、72岁的奶奶，一共要买多少钱的票？ | What do Father, Mother, Xiaoming with his card and Granny of 72 pay?
= 50元 | 1.2米以下儿童和70岁以上老人免费
- 70元 ~figure
- 60元 ~figure
?2 根据须知，下面哪种做法是对的？ | Which is allowed?
= 星期三上午十点去参观 | 星期二到星期日，9:00—17:00
- 在展厅里吃面包 ~opposite
- 星期一带着学生证去 ~figure

# 我们班同学上学方式调查
全班40人，调查结果如下：
步行：14人
骑自行车：6人
坐公交车：10人
家长开车送：8人
坐地铁：2人
?1 坐公交车上学的有多少人？ | How many come by bus?
= 10人 | 坐公交车：10人
- 8人 ~figure
- 14人 ~figure
?1 这次调查了多少人？ | How many were surveyed?
= 40人 | 全班40人
- 14人 ~figure
- 30人 ~figure
?1 调查里有几种上学方式？ | How many ways are listed?
= 五种 | 坐地铁：2人
- 四种 ~figure
- 三种 ~figure
?2 哪种上学方式的人最多？ | Which way is most common?
= 步行 | 步行：14人
- 坐公交车 ~figure
- 家长开车送 ~figure
?2 不靠车、自己走路或骑车上学的一共有多少人？ | How many come on their own feet or bikes?
= 20人 | 骑自行车：6人
- 14人 ~part
- 24人 ~figure
?2 根据调查，下面哪个说法是对的？ | Which statement is true?
= 一半的同学是步行或骑车上学的 | 步行：14人
- 坐地铁的人最多 ~figure
- 家长开车送的比坐公交车的多 ~figure

# 豆苗生长记录
3月1日：种下豆子，浇透水。
3月4日：土里钻出白色的小芽，高约1厘米。
3月7日：长出两片绿叶，高约4厘米。
3月10日：高约9厘米，叶子变大了。
3月13日：高约15厘米，开始长出卷须。
3月16日：高约20厘米，用竹棍搭了架子。
?1 豆芽是哪一天钻出土的？ | When did the shoot come up?
= 3月4日 | 3月4日：土里钻出白色的小芽，高约1厘米
- 3月1日 ~figure
- 3月7日 ~figure
?1 3月10日豆苗有多高？ | How tall was it on 10 March?
= 约9厘米 | 3月10日：高约9厘米，叶子变大了
- 约4厘米 ~figure
- 约15厘米 ~figure
?1 为什么3月16日要搭架子？ | Why a frame on 16 March?
= 豆苗长高了，又长出了卷须 | 3月16日：高约20厘米，用竹棍搭了架子
- 怕被小鸟吃掉 ~unsaid
- 豆苗停止生长了 ~opposite
?2 从3月10日到3月13日，豆苗长高了多少？ | How much did it grow from the 10th to the 13th?
= 约6厘米 | 3月13日：高约15厘米，开始长出卷须
- 约9厘米 ~figure
- 约15厘米 ~figure
?2 这份记录每隔几天记一次？ | How often was it recorded?
= 每隔三天 | 3月7日：长出两片绿叶，高约4厘米
- 每天 ~figure
- 每隔一周 ~figure
?2 从记录看，豆苗长得怎样？ | What does the record show of its growth?
= 越长越快，后来每三天长五六厘米 | 3月13日：高约15厘米
- 越长越慢 ~figure
- 每次都长得一样多 ~figure

# 社区周末活动安排
星期六上午9:00—11:00：旧书交换，地点：社区图书室。每人最多换5本。
星期六下午2:00—4:00：少儿剪纸课，地点：二楼活动室。限20人，请提前到服务台报名。
星期日上午8:00—10:00：河边捡垃圾，地点：东门集合。请自带手套。
?1 剪纸课在哪里上？ | Where is the paper-cutting class?
= 二楼活动室 | 地点：二楼活动室
- 社区图书室 ~figure
- 东门 ~figure
?1 去捡垃圾要带什么？ | What should one bring to the clean-up?
= 手套 | 请自带手套
- 垃圾袋 ~unsaid
- 旧书 ~other
?1 旧书交换每人最多能换几本？ | How many books may one swap?
= 5本 | 每人最多换5本
- 20本 ~figure
- 不限 ~opposite
?2 小红想参加剪纸课，她首先要做什么？ | What must Xiaohong do first for the class?
= 提前到服务台报名 | 请提前到服务台报名
- 星期六下午直接去活动室 ~part
- 带上手套 ~other
?2 小亮星期六上午要上钢琴课，他还能参加哪两个活动？ | Piano on Saturday morning: which two can Xiaoliang join?
= 剪纸课和捡垃圾 | 星期日上午8:00—10:00：河边捡垃圾
- 旧书交换和剪纸课 ~figure
- 旧书交换和捡垃圾 ~figure
?2 哪个活动人数有限制？ | Which activity has a limit?
= 剪纸课 | 限20人
- 旧书交换 ~figure
- 捡垃圾 ~figure
`;

/** WORDS_5 are the passages of reading-5-word-colour: words read by their context, and the colour they carry. */
export const WORDS_5 = `
# 小河
小河从村子中间流过。夏天，孩子们在河里摸鱼、打水仗，河面上飘着一片笑声。后来，上游建了一家小工厂，河水变得又黑又臭，再也没有孩子来玩了。村里的老人们常常坐在河边叹气。去年，工厂搬走了，大家一起清理河道。今年夏天，河水又清了，孩子们的笑声又回来了。
?1 “河面上飘着一片笑声”中的“飘”是什么意思？ | What does 飘 mean here?
= 笑声在河面上传开，到处都听得到 | 河面上飘着一片笑声
- 河面上有东西在漂浮 ~literal
- 风很大 ~unsaid
?1 “老人们常常坐在河边叹气”，说明了什么？ | What does the old people's sighing show?
= 他们为小河被污染感到难过 | 村里的老人们常常坐在河边叹气
- 他们走累了 ~unsaid
- 他们在河边钓鱼 ~unsaid
?1 “孩子们的笑声又回来了”是什么意思？ | What does “the laughter came back” mean?
= 孩子们又来河里玩了 | 孩子们的笑声又回来了
- 笑声被录了下来 ~literal
- 孩子们搬回了村子 ~unsaid
?2 文中“又黑又臭”带有什么感情色彩？ | What colour has 又黑又臭?
= 贬义，表达厌恶 | 河水变得又黑又臭
- 褒义，表达喜爱 ~praise
- 中性，看不出态度 ~neutral
?2 “清理河道”中的“清理”是什么感情色彩？ | What colour has 清理?
= 中性 | 大家一起清理河道
- 褒义 ~praise
- 贬义 ~pejorative
?2 文中哪个词语表达了作者对小河变化的欣喜？ | Which words show the writer's joy at the change?
= 又清了 | 今年夏天，河水又清了
- 搬走了 ~neutral
- 叹气 ~pejorative

# 两只猫
邻居家有两只猫。大黄胖乎乎的，整天懒洋洋地躺在太阳底下，连老鼠从身边跑过都懒得抬头。小花却机灵得很，耳朵一动，就知道哪里有动静，一个箭步扑过去，从来不落空。主人常常夸小花“能干”，说大黄“好吃懒做”。可是到了晚上，大黄总会悄悄地钻进小主人的被窝，陪她睡觉。
?1 “一个箭步扑过去”是什么意思？ | What does 一个箭步 mean?
= 像射出的箭一样，一步就跨过去 | 一个箭步扑过去
- 拿着箭跑过去 ~literal
- 慢慢地走过去 ~opposite
?1 “从来不落空”是什么意思？ | What does 从来不落空 mean?
= 每次都能抓到 | 从来不落空
- 从来不跳到空中 ~literal
- 从来不出门 ~unsaid
?1 文章最后写大黄陪小主人睡觉，想说明什么？ | What does the last sentence suggest of Dahuang?
= 大黄虽然懒，也有让人喜欢的地方 | 大黄总会悄悄地钻进小主人的被窝，陪她睡觉
- 大黄也很会抓老鼠 ~unsaid
- 小主人不喜欢大黄 ~opposite
?2 “好吃懒做”带有什么感情色彩？ | What colour has 好吃懒做?
= 贬义 | 说大黄“好吃懒做”
- 褒义 ~praise
- 中性 ~neutral
?2 “机灵”带有什么感情色彩？ | What colour has 机灵?
= 褒义 | 小花却机灵得很
- 贬义 ~pejorative
- 中性 ~neutral
?2 主人夸小花“能干”，这个词表达了主人怎样的态度？ | What view does 能干 show?
= 称赞 | 主人常常夸小花“能干”
- 批评 ~pejorative
- 不在乎 ~neutral

# 球场上
比赛还剩最后一分钟，我们落后一分。小刚抢到球，没有传给空着的队友，而是自己往篮下冲，结果被对方断了球。下场后，有人说小刚“逞能”，也有人说他“勇敢”。教练没有批评他，只是问：“你当时看到左边的小李了吗？”小刚低下了头。第二天训练，他传球比谁都积极。
?1 “被对方断了球”中的“断”是什么意思？ | What does 断 mean in “the ball was 断”?
= 球被对方抢走了 | 结果被对方断了球
- 球被弄破了 ~literal
- 比赛停止了 ~unsaid
?1 “小刚低下了头”，说明了什么？ | What does Xiaogang lowering his head show?
= 他明白自己错了，感到惭愧 | 小刚低下了头
- 他在找地上的东西 ~literal
- 他很生气 ~mismatch
?1 “他传球比谁都积极”，说明小刚有了什么变化？ | What change in Xiaogang?
= 懂得了要和队友配合 | 他传球比谁都积极
- 不想再打球了 ~opposite
- 变得更爱自己投篮了 ~opposite
?2 “逞能”带有什么感情色彩？ | What colour has 逞能?
= 贬义，说他爱出风头 | 有人说小刚“逞能”
- 褒义，夸他有本领 ~praise
- 中性，只说他投了篮 ~neutral
?2 同一件事，有人说“逞能”，有人说“勇敢”，说明了什么？ | What do the two words for one deed show?
= 不同的人对这件事看法不同 | 也有人说他“勇敢”
- 两个词的意思一样 ~sense
- 小刚做了两件事 ~unsaid
?2 “勇敢”带有什么感情色彩？ | What colour has 勇敢?
= 褒义 | 也有人说他“勇敢”
- 贬义 ~pejorative
- 中性 ~neutral

# 老街
城东有一条老街，青石板路被人们的脚磨得发亮。街两边是低矮的木房子，屋檐下挂着红灯笼。有人说老街“破旧”，应该拆了盖高楼；也有人说老街“古朴”，是城市的记忆。后来，老街没有拆，而是修整了一番，成了人们周末最爱去的地方。
?1 “青石板路被人们的脚磨得发亮”说明了什么？ | What do the worn stones tell?
= 老街很古老，走过的人很多 | 青石板路被人们的脚磨得发亮
- 青石板是新铺的 ~opposite
- 有人每天擦石板 ~unsaid
?1 “是城市的记忆”是什么意思？ | What does “the city's memory” mean?
= 老街留着城市过去的样子和故事 | 是城市的记忆
- 老街会记住每一个人 ~literal
- 城市里有一座图书馆 ~unsaid
?1 老街最后怎样了？ | What became of the old street?
= 修整后成了人们周末爱去的地方 | 成了人们周末最爱去的地方
- 被拆掉盖了高楼 ~opposite
- 没有人再去了 ~opposite
?2 “破旧”带有什么感情色彩？ | What colour has 破旧?
= 贬义 | 有人说老街“破旧”
- 褒义 ~praise
- 中性 ~neutral
?2 “古朴”带有什么感情色彩？ | What colour has 古朴?
= 褒义 | 也有人说老街“古朴”
- 贬义 ~pejorative
- 中性 ~neutral
?2 “修整”带有什么感情色彩？ | What colour has 修整?
= 中性 | 而是修整了一番
- 贬义 ~pejorative
- 褒义 ~praise

# 蚂蚁搬家
天要下雨了，一群蚂蚁正忙着搬家。它们排成一条长队，有的扛着米粒，有的拖着虫子，匆匆地往高处赶。一只小蚂蚁扛着比自己大几倍的面包屑，摔倒了，爬起来，又摔倒了，又爬起来。旁边两只蚂蚁赶过来，一起把面包屑抬走了。我蹲在地上看了很久，觉得这些小东西真了不起。
?1 “匆匆地往高处赶”中的“匆匆”是什么意思？ | What does 匆匆 mean?
= 急急忙忙 | 匆匆地往高处赶
- 慢慢悠悠 ~opposite
- 高高兴兴 ~unsaid
?1 蚂蚁为什么往高处搬？ | Why do the ants move uphill?
= 天要下雨了 | 天要下雨了，一群蚂蚁正忙着搬家
- 高处的食物多 ~unsaid
- 低处太热了 ~unsaid
?1 “摔倒了，爬起来，又摔倒了，又爬起来”，写出了小蚂蚁怎样？ | What does falling and rising again show?
= 不怕困难，坚持不放弃 | 摔倒了，爬起来，又摔倒了，又爬起来
- 走路不小心 ~sense
- 不想搬家 ~opposite
?2 “这些小东西真了不起”中的“小东西”，带有什么感情？ | What feeling is in 小东西 here?
= 喜爱 | 觉得这些小东西真了不起
- 看不起 ~pejorative
- 没有感情 ~neutral
?2 “了不起”带有什么感情色彩？ | What colour has 了不起?
= 褒义 | 觉得这些小东西真了不起
- 贬义 ~pejorative
- 中性 ~neutral
?2 “搬家”这个词带有什么感情色彩？ | What colour has 搬家?
= 中性 | 一群蚂蚁正忙着搬家
- 褒义 ~praise
- 贬义 ~pejorative

# 新同学
班上来了一个新同学，叫阿杰。他说话带着很重的口音，有几个同学在背后学他，偷偷地笑。阿杰脸红了，下课就一个人待在座位上。班长看见了，走过去说：“你的家乡话真好听，能教我说几句吗？”阿杰愣了一下，笑了。从那以后，下课时阿杰身边常常围着一圈人，大家都跟他学家乡话。
?1 “在背后学他”是什么意思？ | What does 在背后学他 mean?
= 不当着他的面，模仿他说话取笑他 | 有几个同学在背后学他，偷偷地笑
- 站在他身后学习 ~literal
- 向他学习功课 ~literal
?1 “阿杰愣了一下”，说明了什么？ | What does his start show?
= 他没想到班长会这样说 | 阿杰愣了一下，笑了
- 他没听清班长的话 ~unsaid
- 他生气了 ~mismatch
?1 “身边常常围着一圈人”，说明了什么？ | What do the people round him show?
= 阿杰有了很多朋友 | 下课时阿杰身边常常围着一圈人
- 阿杰做错了事 ~unsaid
- 大家在看热闹 ~sense
?2 “偷偷地笑”在这里带有什么感情色彩？ | What colour has 偷偷地笑 here?
= 贬义，是在取笑别人 | 偷偷地笑
- 褒义，是在鼓励别人 ~praise
- 中性，只是笑一笑 ~neutral
?2 班长说“你的家乡话真好听”，表达了什么态度？ | What attitude is in the monitor's words?
= 友好、尊重 | 你的家乡话真好听
- 取笑 ~pejorative
- 冷淡 ~neutral
?2 文中哪个词最能表现阿杰被取笑时的难堪？ | Which words show his embarrassment best?
= 脸红了 | 阿杰脸红了
- 笑了 ~sense
- 新同学 ~neutral

# 一棵老柳树
村口有一棵老柳树，树干要三个人才能抱过来。它的树皮又粗又硬，裂开了一道道深沟，像老人脸上的皱纹。夏天，它撑开一把巨大的绿伞，村里人吃过饭，都爱到树下乘凉、聊天。有一年，有人想把它砍了卖钱，全村人都不答应。老柳树就这样一年一年地站在村口，守望着这个村子。
?1 “树干要三个人才能抱过来”说明了什么？ | What does “three people to embrace it” show?
= 树干非常粗 | 树干要三个人才能抱过来
- 村里人很喜欢抱树 ~literal
- 树很矮 ~unsaid
?1 “撑开一把巨大的绿伞”是什么意思？ | What does “opens a huge green umbrella” mean?
= 老柳树的枝叶又多又密，遮出一大片阴凉 | 它撑开一把巨大的绿伞
- 有人在树下打伞 ~literal
- 树上挂着一把伞 ~literal
?1 “全村人都不答应”说明了什么？ | What does the whole village refusing show?
= 村里人都很爱护老柳树 | 全村人都不答应
- 村里人想自己卖树 ~opposite
- 树长得不好 ~unsaid
?2 “守望着这个村子”中的“守望”带有什么感情？ | What feeling is in 守望?
= 把老柳树当作守护村子的亲人，充满感情 | 守望着这个村子
- 讨厌老柳树挡路 ~pejorative
- 只是说树长在那里，没有感情 ~neutral
?2 把树皮比作“老人脸上的皱纹”，带有什么感情色彩？ | What colour has likening the bark to an old man's wrinkles?
= 亲切，把老柳树当作老人来写 | 像老人脸上的皱纹
- 嫌它难看 ~pejorative
- 只是说树皮的颜色 ~neutral
?2 “砍了卖钱”这几个字，写出了作者对这件事的什么态度？ | What attitude do the words “cut it down to sell” show?
= 不赞成，只看到钱 | 有人想把它砍了卖钱
- 赞成，觉得很聪明 ~praise
- 看不出态度 ~neutral

# 雨中的交通警察
傍晚，大雨倾盆。十字路口的红绿灯坏了，车辆一下子乱成一团，喇叭声此起彼伏。这时，一位交通警察冒着大雨走到路中间，举起手臂，有条不紊地指挥着。不一会儿，车辆又一辆接一辆地开走了。雨水顺着他的帽檐往下流，他却一动不动地站着，像一棵挺拔的白杨。
?1 “大雨倾盆”是什么意思？ | What does 大雨倾盆 mean?
= 雨大得像用盆往下倒 | 傍晚，大雨倾盆
- 有人把盆里的水倒出来 ~literal
- 下着小雨 ~opposite
?1 “此起彼伏”在这里是什么意思？ | What does 此起彼伏 mean here?
= 这里响了那里又响，一直不停 | 喇叭声此起彼伏
- 喇叭声一下子停了 ~opposite
- 车子一会儿上一会儿下 ~literal
?1 “有条不紊”是什么意思？ | What does 有条不紊 mean?
= 有条理，一点也不乱 | 有条不紊地指挥着
- 手里拿着一条绳子 ~literal
- 很着急，乱指一气 ~opposite
?2 “乱成一团”带有什么感情色彩？ | What colour has 乱成一团?
= 贬义，写出交通的混乱 | 车辆一下子乱成一团
- 褒义，写出热闹 ~praise
- 中性，看不出好坏 ~neutral
?2 “挺拔”带有什么感情色彩？ | What colour has 挺拔?
= 褒义 | 像一棵挺拔的白杨
- 贬义 ~pejorative
- 中性 ~neutral
?2 作者把交通警察比作白杨，表达了怎样的感情？ | What feeling does likening him to a poplar show?
= 敬佩 | 他却一动不动地站着，像一棵挺拔的白杨
- 同情他太傻 ~pejorative
- 只是说他很高 ~neutral

# 爸爸的“唠叨”
爸爸是个出了名的“唠叨”人。出门前，他要问三遍：“钥匙带了吗？水杯带了吗？作业带了吗？”吃饭时，他总说：“慢点吃，别烫着。”我嫌他烦，常常捂着耳朵跑开。这学期，我去外地参加夏令营，一个星期没听见爸爸的声音。晚上躺在床上，我竟然想起他的唠叨来，心里酸酸的。
?1 “出了名的”是什么意思？ | What does 出了名的 mean?
= 大家都知道的 | 爸爸是个出了名的“唠叨”人
- 在电视上出名的 ~literal
- 名字很好听的 ~literal
?1 “心里酸酸的”是什么意思？ | What does 心里酸酸的 mean?
= 想念爸爸，心里有点难过 | 心里酸酸的
- 吃了酸的东西 ~literal
- 心里很高兴 ~opposite
?1 我“捂着耳朵跑开”，说明当时我对爸爸的唠叨怎样？ | What does covering my ears show?
= 觉得很烦 | 我嫌他烦，常常捂着耳朵跑开
- 很喜欢听 ~opposite
- 听不清楚 ~unsaid
?2 题目中的“唠叨”加上了引号，表达了什么？ | What do the quotation marks round 唠叨 show?
= 嘴上说唠叨，心里明白那是爸爸的关心 | 我竟然想起他的唠叨来
- 爸爸真的非常讨厌 ~pejorative
- 只是一个普通的词 ~neutral
?2 “唠叨”这个词本身带有什么感情色彩？ | What colour has 唠叨 by itself?
= 贬义，说人话多、让人烦 | 我嫌他烦
- 褒义 ~praise
- 中性 ~neutral
?2 “竟然”这个词，表现了我怎样的心情？ | What does 竟然 show of my feeling?
= 没想到自己会想念爸爸的唠叨 | 我竟然想起他的唠叨来
- 早就知道自己会想他 ~opposite
- 很生气 ~mismatch

# 一盆桂花
奶奶养了一盆桂花。它不像牡丹那样富丽堂皇，也不像月季那样鲜艳夺目，只开着一朵朵米粒大的小黄花。可是一到秋天的晚上，满屋都是它淡淡的清香。奶奶说，做人也要像桂花，不张扬，默默地把香气留给别人。
?1 “富丽堂皇”是用来形容什么的？ | What does 富丽堂皇 describe?
= 牡丹花朵又大又艳，十分华丽 | 它不像牡丹那样富丽堂皇
- 桂花又小又黄 ~other
- 奶奶的衣服很贵 ~unsaid
?1 “不张扬”是什么意思？ | What does 不张扬 mean?
= 不炫耀自己 | 不张扬，默默地把香气留给别人
- 不说话 ~literal
- 不开花 ~unsaid
?1 奶奶从桂花身上想到了什么？ | What lesson does Granny take from it?
= 做人要不张扬，默默地为别人付出 | 做人也要像桂花
- 要多种桂花花 ~unsaid
- 做人要像牡丹一样引人注目 ~opposite
?2 “鲜艳夺目”带有什么感情色彩？ | What colour has 鲜艳夺目?
= 褒义 | 也不像月季那样鲜艳夺目
- 贬义 ~pejorative
- 中性 ~neutral
?2 作者写牡丹和月季，是为了表达对桂花怎样的感情？ | Why bring in the peony and the Chinese rose?
= 用对比衬托出对桂花朴素清香的喜爱 | 只开着一朵朵米粒大的小黄花
- 说明桂花不好看，作者不喜欢 ~pejorative
- 只是介绍三种花 ~neutral
?2 “淡淡的清香”带有什么感情色彩？ | What colour has 淡淡的清香?
= 褒义，带着喜爱 | 满屋都是它淡淡的清香
- 贬义，嫌香味太淡 ~pejorative
- 中性 ~neutral
`;

/** STRUCTURE_5 are the passages of reading-5-structure: the order in which they are told, and their ways of writing. */
export const STRUCTURE_5 = `
# 游植物园
早上八点，我们来到了植物园的大门口。一进门，是一片开阔的草坪，草坪中间有一个圆形的喷泉。往左走，是热带植物馆，里面又闷又热，高大的椰子树一直顶到屋顶。从热带植物馆出来，往北走，就到了荷花池，粉红的荷花开得正好。荷花池的东边，是一片竹林，风一吹，沙沙作响。太阳快落山了，我们才依依不舍地离开。植物园真是一个绿色的宝库！
?1 文章主要是按什么顺序写游植物园的？ | In what order is the visit told?
= 按游览的地点变换 | 从热带植物馆出来，往北走，就到了荷花池
- 按春夏秋冬的季节 ~wrongorder
- 先写结果再写经过 ~wrongorder
?1 下面哪组词最能看出文章的顺序？ | Which words mark the order best?
= 一进门、往左走、往北走、东边 | 荷花池的东边，是一片竹林
- 粉红、高大、沙沙 ~sense
- 早上、快落山 ~part
?1 作者游览的第三个地方是哪里？ | What is the third place visited?
= 荷花池 | 往北走，就到了荷花池
- 竹林 ~figure
- 热带植物馆 ~figure
?2 “植物园真是一个绿色的宝库！”用的是什么表达方法？ | What way of writing is the last sentence?
= 抒情 | 植物园真是一个绿色的宝库！
- 说明 ~notnarrate
- 叙述经过 ~notnarrate
?2 “里面又闷又热，高大的椰子树一直顶到屋顶”，用的是什么表达方法？ | What way of writing is this sentence?
= 描写 | 高大的椰子树一直顶到屋顶
- 议论 ~notargue
- 抒情 ~notlyric
?2 文章结尾一句和全文是什么关系？ | What does the last sentence do for the whole?
= 总结全文，抒发感受 | 植物园真是一个绿色的宝库！
- 开始写一个新的地方 ~sense
- 和全文没有关系 ~sense

# 学做蛋炒饭
星期天，我决定学做蛋炒饭。先把两个鸡蛋打进碗里，用筷子搅匀。接着，在锅里倒油，等油热了，把蛋液倒进去，“滋啦”一声，金黄的鸡蛋一下子鼓了起来。然后，把米饭倒进锅里，用铲子压散，和鸡蛋一起翻炒。最后，撒上一点盐和葱花，一盘香喷喷的蛋炒饭就做好了。妈妈尝了一口，说：“不错！”我心里比吃了蜜还甜。
?1 文章是按什么顺序写做蛋炒饭的？ | In what order is the cooking told?
= 按做事的先后 | 先把两个鸡蛋打进碗里
- 按地点的变换 ~wrongorder
- 按从整体到部分 ~wrongorder
?1 哪组词表示了做事的先后？ | Which words mark the steps?
= 先、接着、然后、最后 | 最后，撒上一点盐和葱花
- 金黄、香喷喷 ~sense
- 星期天、不错 ~sense
?1 倒进米饭之前，要做的一步是什么？ | What step comes before the rice?
= 把蛋液倒进热油里炒 | 把蛋液倒进去
- 撒上盐和葱花 ~wrongorder
- 请妈妈尝一尝 ~wrongorder
?2 “‘滋啦’一声，金黄的鸡蛋一下子鼓了起来”用的是什么表达方法？ | What way of writing is this sentence?
= 描写 | 金黄的鸡蛋一下子鼓了起来
- 议论 ~notargue
- 抒情 ~notlyric
?2 “我心里比吃了蜜还甜”表达了什么？ | What does the last sentence express?
= 得到妈妈称赞后的高兴 | 我心里比吃了蜜还甜
- 蛋炒饭里放了蜂蜜 ~literal
- 我不喜欢蛋炒饭 ~opposite
?2 写妈妈尝了一口说“不错”，在文中有什么作用？ | What does Mother's “not bad” do?
= 写出做饭的结果，引出我的心情 | 妈妈尝了一口，说：“不错！”
- 说明妈妈不会做饭 ~unsaid
- 开始写做饭的第一步 ~wrongorder

# 那次迷路
现在想起来，我还会出一身冷汗。那是我七岁的时候，跟着妈妈去逛庙会。
庙会上人山人海，我被一个吹糖人的摊子吸引住了，等我回过神来，妈妈不见了。我急得大哭，到处乱跑。一位卖气球的阿姨把我拉到一边，问清了妈妈的电话，帮我打了过去。半个小时后，妈妈满头大汗地跑来，一把抱住了我。
从那以后，出门在外，我都会记住家人的电话，也会紧紧跟着大人。
?1 文章第一句写的是什么时候的感受？ | When is the feeling of the first sentence felt?
= 现在回想起来的感受 | 现在想起来，我还会出一身冷汗
- 七岁那年在庙会上的感受 ~wrongorder
- 妈妈找到我时的感受 ~wrongorder
?1 文章先写现在的感受，再回忆过去的事，这是什么顺序？ | What order is a present feeling, then the past?
= 倒叙 | 那是我七岁的时候
- 按地点的变换 ~wrongorder
- 按事物的几个方面 ~wrongorder
?1 我是怎样和妈妈走散的？ | How did I lose Mother?
= 被吹糖人的摊子吸引住了 | 我被一个吹糖人的摊子吸引住了
- 妈妈去买气球了 ~unsaid
- 我去找朋友了 ~unsaid
?2 “妈妈满头大汗地跑来，一把抱住了我”用的是什么表达方法？ | What way of writing is this sentence?
= 描写人物的动作和样子 | 妈妈满头大汗地跑来，一把抱住了我
- 议论 ~notargue
- 说明 ~notnarrate
?2 最后一段在文中有什么作用？ | What does the last paragraph do?
= 写出这件事给我的教训 | 我都会记住家人的电话
- 接着写庙会上的事 ~sense
- 介绍庙会的样子 ~sense
?2 开头写“还会出一身冷汗”，有什么作用？ | What does the opening sweat do?
= 写出那次迷路有多可怕，引起读者的兴趣 | 我还会出一身冷汗
- 说明那天天气很热 ~literal
- 说明我生病了 ~unsaid

# 秋天的果园
秋天的果园是一幅美丽的画。苹果树上挂满了红彤彤的苹果，像一个个小灯笼。梨树上的梨黄澄澄的，压弯了枝头。葡萄架下，一串串紫葡萄像一串串珍珠。果农们一边摘果子，一边说说笑笑。秋天的果园，到处都是丰收的喜悦。
?1 这段话是怎样组织的？ | How is the passage built?
= 先总写，再分写，最后总结 | 秋天的果园，到处都是丰收的喜悦
- 按时间先后写 ~wrongorder
- 按事情的发展写 ~wrongorder
?1 第一句话在文中有什么作用？ | What does the first sentence do?
= 总起全段 | 秋天的果园是一幅美丽的画
- 写苹果的样子 ~narrow
- 写果农在劳动 ~narrow
?1 作者写了哪几种果子？ | Which fruits are told?
= 苹果、梨、葡萄 | 葡萄架下，一串串紫葡萄像一串串珍珠
- 苹果、桃子、橘子 ~changed
- 只有苹果 ~part
?2 “苹果树上挂满了红彤彤的苹果，像一个个小灯笼”用的是什么表达方法？ | What way of writing is this?
= 描写 | 像一个个小灯笼
- 叙述 ~notnarrate
- 议论 ~notargue
?2 写果农“说说笑笑”，有什么作用？ | What do the laughing growers add?
= 由景写到人，写出丰收的喜悦 | 果农们一边摘果子，一边说说笑笑
- 说明果农不认真劳动 ~opposite
- 介绍果农的名字 ~unsaid
?2 “压弯了枝头”写出了什么？ | What does “bending the branches” show?
= 梨结得又多又大 | 压弯了枝头
- 梨树生病了 ~unsaid
- 风很大 ~unsaid

# 等车
公交车站的长椅上坐着一位老奶奶，她怀里抱着一个布包，眼睛一直望着路的那头。车来了一辆，又走了一辆，她都没有上。太阳慢慢偏西，她还在那里坐着。我忍不住走过去问她。原来，她是在等放学的孙子，孙子每天都坐这路车回来。正说着，一辆车停下了，一个背书包的男孩跳下来，喊了一声“奶奶”。老奶奶站起来，脸上的皱纹一下子都舒展开了。我想，世上最长的等待，大概就是亲人的等待吧。
?1 这段话主要是按什么顺序写的？ | In what order is it told?
= 按事情的发展 | 正说着，一辆车停下了
- 按地点的变换 ~wrongorder
- 按从整体到部分 ~wrongorder
?1 老奶奶为什么一直不上车？ | Why does Granny take no bus?
= 她在等放学的孙子 | 她是在等放学的孙子
- 她没有带钱 ~unsaid
- 车上人太多了 ~unsaid
?1 “太阳慢慢偏西”说明了什么？ | What does the sun sinking show?
= 老奶奶等了很久 | 太阳慢慢偏西，她还在那里坐着
- 天气变冷了 ~unsaid
- 老奶奶要回家了 ~opposite
?2 “脸上的皱纹一下子都舒展开了”用的是什么表达方法？ | What way of writing is this?
= 描写人物的神态 | 脸上的皱纹一下子都舒展开了
- 议论 ~notargue
- 抒情 ~notlyric
?2 最后一句用的是什么表达方法？ | What way of writing is the last sentence?
= 议论和抒情 | 世上最长的等待，大概就是亲人的等待吧
- 描写 ~notdescribe
- 叙述 ~notnarrate
?2 “车来了一辆，又走了一辆，她都没有上”，有什么作用？ | What does the coming and going of buses do?
= 写出老奶奶等得久，引起“我”的好奇 | 我忍不住走过去问她
- 说明车站的车很少 ~opposite
- 说明老奶奶不会坐车 ~unsaid

# 我的书桌
我的书桌靠着窗户，是爸爸亲手做的。桌面上，左边放着一个笔筒，里面插满了各种颜色的笔；右边是一盏小台灯，晚上我就在它的光下写作业。桌子中间铺着一块玻璃，玻璃下面压着我的课程表和几张照片。抽屉里放着我的宝贝：一个旧口琴和一叠明信片。这张书桌陪了我五年，我爱它。
?1 作者介绍书桌上的东西，是按什么顺序写的？ | In what order are the things on the desk told?
= 按左、右、中间的位置 | 左边放着一个笔筒
- 按时间的先后 ~wrongorder
- 按事情的发展 ~wrongorder
?1 玻璃下面压着什么？ | What lies under the glass?
= 课程表和几张照片 | 玻璃下面压着我的课程表和几张照片
- 旧口琴和明信片 ~other
- 笔筒和台灯 ~other
?1 这张书桌是谁做的？ | Who made the desk?
= 爸爸 | 是爸爸亲手做的
- 爷爷 ~changed
- 我自己 ~changed
?2 最后一句“这张书桌陪了我五年，我爱它”用的是什么表达方法？ | What way of writing is the last sentence?
= 抒情 | 这张书桌陪了我五年，我爱它
- 描写 ~notdescribe
- 议论 ~notargue
?2 “里面插满了各种颜色的笔”用的是什么表达方法？ | What way of writing is this?
= 描写 | 里面插满了各种颜色的笔
- 抒情 ~notlyric
- 议论 ~notargue
?2 开头写书桌“是爸爸亲手做的”，和结尾的“我爱它”有什么联系？ | How does “made by Father” tie to “I love it”?
= 书桌是爸爸亲手做的，所以我格外珍爱 | 是爸爸亲手做的
- 没有联系 ~sense
- 说明爸爸是木匠 ~unsaid

# 一天的大海
清晨，大海是安静的，淡淡的雾笼罩着海面，几只海鸥在雾里飞来飞去。中午，太阳高高地挂在天上，海水蓝得发亮，浪花一层一层地涌上沙滩。傍晚，夕阳把海面染成了金红色，渔船一只只地回来了。夜里，海风轻轻地吹，海浪哗哗地唱着歌，好像在哄人们入睡。
?1 这段话是按什么顺序写大海的？ | In what order is the sea told?
= 按一天中时间的先后 | 清晨，大海是安静的
- 按地点的变换 ~wrongorder
- 先总写，后分写 ~wrongorder
?1 哪组词表示了时间的变化？ | Which words mark the times?
= 清晨、中午、傍晚、夜里 | 傍晚，夕阳把海面染成了金红色
- 淡淡、蓝蓝、金红 ~sense
- 海鸥、渔船、海风 ~sense
?1 傍晚的大海是什么样子的？ | What is the sea like at dusk?
= 海面被夕阳染成金红色，渔船回来了 | 渔船一只只地回来了
- 雾笼罩着海面 ~other
- 海水蓝得发亮 ~other
?2 “海浪哗哗地唱着歌，好像在哄人们入睡”用了什么表达方法？ | What way of writing is this?
= 描写，把海浪当作人来写 | 海浪哗哗地唱着歌，好像在哄人们入睡
- 议论 ~notargue
- 叙述事情经过 ~notnarrate
?2 这段话主要用了哪种表达方法？ | What way of writing is used most?
= 描写 | 海水蓝得发亮
- 议论 ~notargue
- 抒情 ~notlyric
?2 写清晨时提到海鸥在雾里飞，有什么作用？ | What do the gulls in the mist add?
= 静中有动，写出清晨大海的宁静 | 几只海鸥在雾里飞来飞去
- 说明海上很热闹 ~opposite
- 介绍海鸥吃什么 ~unsaid

# 失败也是一种收获
上学期的作文比赛，我没有得奖。拿到退回来的作文，我看到老师在后面写着：“写得太空了，没有一件具体的事。”我很难过，一个人坐了很久。
后来，我把这句评语抄在本子上，每次写作文都想一想：我写的事具体吗？这学期，我的作文第一次被老师当作范文读给全班听。
我明白了：失败并不可怕，只要找到原因，失败也是一种收获。
?1 文章是按什么顺序写的？ | In what order is it told?
= 按事情的发展，先写失败，再写改进，最后写体会 | 我明白了
- 按地点的变换 ~wrongorder
- 先写体会，再写失败 ~wrongorder
?1 老师说我的作文有什么问题？ | What did the teacher fault?
= 写得太空，没有具体的事 | 写得太空了，没有一件具体的事
- 字写得不好 ~unsaid
- 写得太长了 ~unsaid
?1 我是怎样改进的？ | How did I improve?
= 把评语抄下来，每次写作文都想一想 | 我把这句评语抄在本子上
- 请别人帮我写 ~unsaid
- 不再参加比赛 ~unsaid
?2 最后一段用的是什么表达方法？ | What way of writing is the last paragraph?
= 议论 | 失败并不可怕，只要找到原因，失败也是一种收获
- 描写 ~notdescribe
- 叙述 ~notnarrate
?2 题目“失败也是一种收获”和最后一句有什么关系？ | How is the title tied to the last sentence?
= 首尾呼应，点明中心 | 失败也是一种收获
- 毫无关系 ~sense
- 最后一句写了一件新的事 ~sense
?2 “我很难过，一个人坐了很久”用的是什么表达方法？ | What way of writing is this?
= 叙述，写出当时的心情 | 我很难过，一个人坐了很久
- 议论 ~notargue
- 说明 ~sense

# 爷爷的老照片
爷爷有一张老照片，照片上是一个穿军装的年轻人，站在一座大桥前，笑得很灿烂。我问爷爷：“这是谁？”爷爷笑着说：“这是我呀。”
接着，爷爷给我讲起了那座大桥的故事。那时候，他和战友们在江边修桥，冬天江风刺骨，他们的手冻裂了，缠上布条接着干。整整三年，大桥终于修好了。那天，他们在桥前拍了这张照片。
现在，那座大桥还在，每天有成千上万的车从桥上开过。爷爷说，每次看到它，就像看到了自己的青春。
?1 文章是怎样一步步写下来的？ | How does the text unfold?
= 从一张照片写起，引出修桥的往事，再回到现在 | 现在，那座大桥还在
- 按一年四季写 ~wrongorder
- 按桥的各个部分写 ~wrongorder
?1 爷爷他们修桥用了多长时间？ | How long did the bridge take?
= 整整三年 | 整整三年，大桥终于修好了
- 一个冬天 ~changed
- 三个月 ~changed
?1 第二段主要写了什么？ | What does the second paragraph tell?
= 爷爷和战友们艰苦修桥的往事 | 爷爷给我讲起了那座大桥的故事
- 照片上的人是谁 ~elsewhere
- 现在的大桥是什么样子 ~elsewhere
?2 “他们的手冻裂了，缠上布条接着干”用的是什么表达方法？ | What way of writing is this?
= 描写人物的动作 | 缠上布条接着干
- 议论 ~notargue
- 抒情 ~notlyric
?2 “每次看到它，就像看到了自己的青春”表达了爷爷怎样的感情？ | What feeling is in “like seeing my youth”?
= 对那段岁月的怀念和自豪 | 就像看到了自己的青春
- 后悔去修桥 ~mismatch
- 讨厌那座桥 ~mismatch
?2 开头写照片上的人“笑得很灿烂”，有什么作用？ | What does the bright smile do?
= 引出下文，也写出修好大桥的喜悦 | 笑得很灿烂
- 说明爷爷爱拍照 ~unsaid
- 说明照片很新 ~unsaid

# 小区的早晨
天刚亮，小区就醒了。花坛边，几位老人在打太极拳，动作慢慢的，像在水里游。篮球场上，几个年轻人在跑步，脚步声“咚咚”地响。门口的早点铺冒着热气，油条在锅里翻滚着，香味飘得老远。背着书包的孩子们三三两两地走出来，跟门卫爷爷说一声“早上好”。小区的早晨，热闹又温暖。
?1 这段话写小区的早晨，是按什么顺序写的？ | In what order is the morning told?
= 按地点的变换，一处一处地写 | 篮球场上，几个年轻人在跑步
- 按时间从早到晚 ~wrongorder
- 按事情的起因、经过和结果 ~wrongorder
?1 这段话写了小区里哪几处地方？ | Which places are told?
= 花坛边、篮球场、门口的早点铺 | 门口的早点铺冒着热气
- 学校、公园、商店 ~never
- 只有篮球场 ~part
?1 最后一句在这段话中起什么作用？ | What does the last sentence do?
= 总结全段 | 小区的早晨，热闹又温暖
- 开始写一个新地方 ~sense
- 写孩子们上学 ~narrow
?2 “动作慢慢的，像在水里游”用的是什么表达方法？ | What way of writing is this?
= 描写 | 动作慢慢的，像在水里游
- 议论 ~notargue
- 抒情 ~notlyric
?2 这段话把老人、年轻人、孩子都写进来，这种写法叫什么？ | What is it to set several groups in one scene?
= 点面结合，写出整个小区的热闹 | 背着书包的孩子们三三两两地走出来
- 只写一个人 ~sense
- 先写结果再写原因 ~wrongorder
?2 “油条在锅里翻滚着，香味飘得老远”调动了哪些感觉？ | Which senses does this call on?
= 看到的和闻到的 | 香味飘得老远
- 听到的和摸到的 ~unsaid
- 只有看到的 ~part
`;
