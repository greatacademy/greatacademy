// The texts of the grade 9 reading topic across media (docs/chinese-curriculum.md §18.9), made up for this subject: each
// piece sets materials of several media on one matter, a report, a post, a notice, a script, a table. The places and
// people in them are invented. The format is that of parsePieces in topic-kit.ts.

/** CROSSMEDIA_9 are the sets of reading-9-cross-media: what each medium gives of one matter, and how far each is to be trusted. */
export const CROSSMEDIA_9 = `
# 共享单车停放新规
材料一（报纸新闻）：本报讯 从下月1日起，本市中心城区实行共享单车定点停放。市交通局介绍，全市已划出停车点2000多个，单车不停在停车点内，将无法结束计费。
材料二（网友帖子）：太麻烦了！我家楼下根本没有停车点，以后骑车还得走五百米去停，谁还骑？
材料三（短视频解说词）：画面一：地铁口的单车东倒西歪，挡住了盲道。画面二：划线后的停车点，单车排得整整齐齐。解说：一条白线，换来一条畅通的路。
?1 三则材料中，哪一则交代了新规开始的时间和停车点的数量？ | Which gives the start date and the number of points?
≈ 材料一，报纸新闻 | 从下月1日起 | 全市已划出停车点2000多个
- 材料二 ~elsewhere
- 材料三 ~elsewhere
?1 材料三的短视频和材料一的新闻相比，在表现方式上有什么特点？ | How does the video present things, against the news?
≈ 用前后两个画面对比，直观地让人看到新规带来的变化 | 画面一：地铁口的单车东倒西歪 | 画面二：划线后的停车点，单车排得整整齐齐
- 用大量数字说明新规的内容 ~elsewhere
- 用个人的经历表达不满 ~elsewhere
?1 三则材料对新规的态度分别是怎样的？ | What stance does each take?
≈ 材料一客观报道，材料二不满，材料三支持 | 市交通局介绍 | 太麻烦了 | 一条白线，换来一条畅通的路
- 三则材料都支持新规 ~part
- 三则材料都反对新规 ~part
?2 材料二说“我家楼下根本没有停车点”，从材料一看，这个说法应该怎样看待？ | How should one take the post's claim, given the news?
≈ 这是一个人的情况，不能代表全市；全市已划出2000多个停车点，但个别地方可能确实不够方便 | 我家楼下根本没有停车点 | 全市已划出停车点2000多个
% 网友说的是自己家楼下的情况，可能是真的，但只是一个地方。新闻说全市划了2000多个停车点，说明停车点并不少。两者合起来看：新规总体上有安排，个别地方的不便也值得有关部门注意。不能只凭一个帖子就认为新规不好。 | The post speaks of one spot, perhaps truly, but only one. The news gives over 2000 points citywide. Together: the rule is broadly provided for, and a local gap deserves attention; one post does not prove the rule bad.
- 网友说的一定是假话 ~overread
- 说明全市都没有停车点 ~broad
?2 材料三的解说“一条白线，换来一条畅通的路”，带有什么目的？ | What is the voice-over's purpose?
≈ 宣传新规的好处，希望观众支持 | 一条白线，换来一条畅通的路 | 挡住了盲道
- 客观地报道新规的内容 ~view
- 批评新规太麻烦 ~opposite
?2 想了解新规的具体内容，三则材料中哪一则最可靠？为什么？ | Which is most reliable for the rule's details, and why?
≈ 材料一，它是报纸新闻，消息来自市交通局，有具体时间和数字 | 本报讯 | 市交通局介绍
- 材料二，因为是普通市民说的真心话 ~view
- 材料三，因为有画面，看得见 ~misread

# 老街改造
材料一（区政府公告）：为改善居民居住条件，区政府决定对东门老街进行改造。改造将保留老街原有的石板路和12处老建筑，拓宽两处消防通道，更换全部水电管线。工期为一年。
材料二（居民采访）：在老街住了五十年的陈奶奶说：“房子漏雨好多年了，能修好当然好。就怕改完了，街坊邻居都搬走了，就不是老街了。”
材料三（旅游网站广告）：东门老街，千年古韵！改造后将打造成网红打卡街区，美食、文创、民宿一应俱全，敬请期待！
?1 根据材料一，老街改造要保留哪些东西？ | What will the works keep?
= 原有的石板路和12处老建筑 | 改造将保留老街原有的石板路和12处老建筑
- 全部水电管线 ~misread
- 两处消防通道 ~misread
?1 材料二和材料一相比，提供了什么新的内容？ | What does the interview add to the notice?
≈ 居民自己的感受：既盼着修房子，又担心老街的邻里关系没有了 | 能修好当然好 | 就怕改完了，街坊邻居都搬走了
- 改造工期的长短 ~elsewhere
- 改造后的美食和民宿 ~elsewhere
?1 材料一和材料三对改造目的的说法有什么不同？ | How do the notice and the advert differ on the purpose?
≈ 材料一说是为了改善居民居住条件，材料三说是要打造网红打卡街区 | 为改善居民居住条件 | 改造后将打造成网红打卡街区
% 公告一开头就说改造是“为改善居民居住条件”，内容也是修路、拓宽通道、换管线，都和居民生活有关。广告说的却是“网红打卡”“美食、文创、民宿”，着眼的是游客和生意。两则材料的出发点不一样。 | The notice opens with residents' living conditions, and its works, roads, passages, pipes, serve their lives. The advert speaks of a viral spot, food, crafts, guesthouses: visitors and trade. They start from different places.
- 两则材料说法完全一样 ~misread
- 材料三说是为了保护石板路 ~unsaid
?2 材料三说“千年古韵”，这个说法可靠吗？ | Is the advert's “a thousand years of charm” reliable?
≈ 不一定可靠，这是广告的夸张说法，公告里没有提到老街的年代 | 东门老街，千年古韵 | 改造将保留老街原有的石板路和12处老建筑
- 可靠，因为广告上写得很清楚 ~view
- 可靠，因为陈奶奶说住了五十年 ~misread
?2 材料三是什么目的写的？ | What is the advert for?
≈ 吸引游客，为改造后的旅游生意做宣传 | 敬请期待 | 美食、文创、民宿一应俱全
- 告诉居民改造的工期 ~elsewhere
- 反映居民的担心 ~elsewhere
?2 要全面了解老街改造，应该怎样使用这三则材料？ | How should one use the three to see the whole?
≈ 以公告了解改造的事实，用采访了解居民的想法，对广告的夸张说法要有分辨 | 区政府决定对东门老街进行改造 | 陈奶奶说 | 敬请期待
- 只看广告就够了 ~part
- 三则材料都不可信 ~overread

# 一种“护眼贴”
材料一（商品广告）：明亮护眼贴，贴一贴，视力恢复！三个月摘掉眼镜，无效退款！已有十万家长选择。
材料二（医生访谈）：眼科王医生说：“近视一旦形成，就不能靠贴什么东西恢复。青少年预防近视，最有效的办法是每天户外活动两小时，看书写字每40分钟休息一下。”
材料三（新闻）：市场监管部门近日查处了一批虚假宣传的护眼产品，提醒家长不要轻信“视力恢复”“摘掉眼镜”等说法。
?1 材料一用了哪些说法来吸引人购买？ | How does the advert draw buyers?
≈ 夸大效果、承诺退款、用购买人数说明受欢迎 | 三个月摘掉眼镜，无效退款 | 已有十万家长选择
- 引用医生的话证明效果 ~unsaid
- 介绍产品的成分和原理 ~unsaid
?1 根据材料二，青少年预防近视最有效的办法是什么？ | What does the doctor give as the best prevention?
≈ 每天户外活动两小时，看书写字每40分钟休息一下 | 每天户外活动两小时 | 看书写字每40分钟休息一下
- 用护眼贴 ~opposite
- 戴眼镜 ~unsaid
?1 三则材料中，哪两则的观点是一致的？ | Which two agree?
≈ 材料二和材料三，都认为护眼贴不能恢复视力 | 就不能靠贴什么东西恢复 | 不要轻信“视力恢复”“摘掉眼镜”等说法
- 材料一和材料二 ~opposite
- 三则材料观点都一致 ~part
?2 材料一说“已有十万家长选择”，这能证明产品有效吗？ | Does “100,000 parents chose it” prove it works?
≈ 不能，买的人多只说明卖得多，不能说明有效，何况这个数字也没有来源 | 已有十万家长选择 | 近视一旦形成，就不能靠贴什么东西恢复
% 买的人多，只能说明广告做得好、卖出去的多；有没有效，要看医学上能不能做到。眼科医生说近视形成后不能靠贴东西恢复，新闻也说这类说法是虚假宣传。而且“十万”是商家自己说的，没有说明从哪里来。 | Many buyers show good selling, not efficacy, which is a medical question. The doctor says myopia cannot be reversed so; the news calls such claims false. And the 100,000 is the seller's own figure, with no source.
- 能，因为买的人很多 ~view
- 能，因为可以退款 ~misread
?2 三则材料中，哪两则来源比较可靠？ | Which two have the more reliable sources?
≈ 材料二和材料三，一个是眼科医生的专业意见，一个是市场监管部门的查处结果 | 眼科王医生说 | 市场监管部门近日查处了一批虚假宣传的护眼产品
- 材料一，因为是商家自己说的 ~view
- 都不可靠 ~overread
?2 如果你的同学想买这种护眼贴，你会怎样劝他？ | How would you advise a friend set on buying it?
≈ 告诉他医生说过这类东西不能恢复视力，还是多到户外活动、注意用眼休息 | 每天户外活动两小时 | 就不能靠贴什么东西恢复
- 劝他多买几盒，效果更好 ~opposite
- 劝他马上去配一副新眼镜 ~unsaid

# 暴雨那一夜
材料一（气象台预警）：市气象台7月20日16时发布暴雨红色预警：预计今晚到明天，全市大部分地区降雨量将超过200毫米，请市民减少外出，远离低洼地带。
材料二（网友短视频配文）：太吓人了！我们小区门口的水已经到腰了，车都漂起来了！大家千万别出门！#暴雨#
材料三（第二天的新闻）：20日夜间，全市平均降雨量215毫米。由于提前发布预警，全市转移群众3万多人，未发生人员伤亡。部分小区积水较深，正在排水。
?1 材料一和材料三中的降雨量有什么关系？ | How do the rainfall figures in one and three relate?
≈ 材料一是预计超过200毫米，材料三是实际平均215毫米，预报基本准确 | 降雨量将超过200毫米 | 全市平均降雨量215毫米
- 两个数字说的是同一件事，都是实际降雨量 ~misread
- 材料三的数字比预报少很多 ~nonumber
?1 材料二短视频的配文有什么特点？ | What marks the video's caption?
≈ 是亲历者的现场感受，语气急切，很有感染力 | 太吓人了 | 大家千万别出门
- 用准确的数字说明雨有多大 ~elsewhere
- 交代了转移群众的人数 ~elsewhere
?1 三则材料是按什么先后来排的？ | In what order do they fall?
≈ 按时间先后：雨前的预警，雨中的现场，雨后的报道 | 16时发布暴雨红色预警 | 水已经到腰了 | 第二天的新闻
- 按重要程度从轻到重 ~wrongorder
- 按作者的年龄 ~unsaid
?2 材料二说“车都漂起来了”，应该怎样看待这句话？ | How should one take “cars are floating”?
≈ 这是一个小区的现场情况，可能是真的，但不能代表全市；全市的情况要看新闻 | 我们小区门口的水已经到腰了 | 部分小区积水较深
% 网友拍的是自己小区门口，看到车漂起来，可能是真的，新闻也说“部分小区积水较深”。但这只是一个地方，不能由此认为全市都被淹了。新闻说全市没有人员伤亡，才是对全市情况的说明。 | The video shows one gate; floating cars may be real, and the news admits deep water in some estates. But one place is not the city; the news, with no casualties, describes the whole.
- 一定是假的 ~overread
- 说明全市都被淹了 ~broad
?2 材料三说“未发生人员伤亡”，并说明是“由于提前发布预警”，这说明了什么？ | What does the news credit for no casualties?
≈ 说明及时的预警和转移起了重要作用 | 由于提前发布预警 | 全市转移群众3万多人
- 说明这场雨不大 ~opposite
- 说明网友的视频是假的 ~overread
?2 如果暴雨来临前要决定今晚是否出门，最应该看哪一则材料？ | Before the storm, which should decide whether to go out?
= 材料一，气象台的预警 | 请市民减少外出，远离低洼地带
- 材料二，网友的视频 ~misread
- 材料三，第二天的新闻 ~misread

# 一本新书
材料一（出版社介绍）：《星空下的少年》讲述了一个山村男孩靠着一台旧望远镜，自学天文知识，最终考上大学的故事。全书18万字，作者是一位中学语文老师。
材料二（读者短评）：读了三天三夜，哭了好几次！主人公太让人心疼了，强烈推荐！五星！
材料三（报纸书评）：这本书最打动人的，是对山村夜空的描写，作者写出了一个少年对知识的渴望。不过，后半部分情节发展太快，几个重要人物写得不够丰满，有些可惜。
?1 三则材料中，哪一则介绍了书的主要内容？ | Which gives what the book is about?
= 材料一，出版社介绍 | 讲述了一个山村男孩靠着一台旧望远镜，自学天文知识，最终考上大学的故事
- 材料二 ~elsewhere
- 材料三 ~elsewhere
?1 材料二和材料三都是评价，它们有什么不同？ | How do the two judgments differ?
≈ 材料二只说自己的感受，全是赞美；材料三有具体的分析，既说优点也说不足 | 强烈推荐！五星 | 最打动人的，是对山村夜空的描写 | 后半部分情节发展太快
- 两者一模一样，都只有赞美 ~misread
- 材料二比材料三分析得更具体 ~opposite
?1 材料三指出这本书有哪些不足？ | What faults does the review find?
≈ 后半部分情节发展太快，几个重要人物写得不够丰满 | 后半部分情节发展太快 | 几个重要人物写得不够丰满
- 对夜空的描写不好 ~opposite
- 全书字数太多 ~unsaid
?2 要决定买不买这本书，哪一则材料最有参考价值？为什么？ | Which helps most in deciding to buy, and why?
≈ 材料三，它有优点有缺点，分析具体，比较客观 | 最打动人的 | 不过，后半部分情节发展太快
% 出版社的介绍是为了卖书，只说内容不说缺点；读者短评全是个人感受，读得哭不等于书写得好。报纸书评说了它好在哪里，也说了哪里写得不够，理由具体，最能帮人判断这本书适不适合自己。 | The publisher sells and lists no faults; the reader's note is pure feeling, and tears do not prove quality. The review names strengths and weaknesses with reasons, and best helps one judge.
- 材料二，因为读者哭了好几次 ~view
- 材料一，因为是出版社写的 ~view
?2 材料一的写作目的是什么？ | What is the publisher's note for?
≈ 介绍新书，吸引读者购买 | 全书18万字 | 作者是一位中学语文老师
- 批评这本书的缺点 ~unsaid
- 表达读后的感动 ~elsewhere
?2 材料二说“读了三天三夜”，这句话应该怎样理解？ | How to read “three days and nights”?
≈ 是夸张的说法，表示读得入迷，不必当真 | 读了三天三夜 | 哭了好几次
- 是准确的时间记录 ~literal
- 说明这本书很难读懂 ~misread

# 校园午餐
材料一（学校通知）：从本学期起，学校食堂午餐每天提供三种套餐供学生选择，每餐4元。食堂每周公布下周菜单，欢迎家长和同学提意见。
材料二（学生调查统计）：初三全年级450人参加调查。对午餐“满意”的有270人，“一般”的135人，“不满意”的45人。不满意的主要原因：菜太咸（20人），分量少（15人），没有喜欢的菜（10人）。
材料三（家长群聊天）：张妈妈：“听孩子说食堂的菜特别难吃，好多人都不吃！”李爸爸：“我家孩子说还行啊，就是有时候有点咸。”
?1 根据材料二，对午餐满意的学生占多少？ | What share of pupils is satisfied?
≈ 60%，450人中有270人满意 | 初三全年级450人参加调查 | 对午餐“满意”的有270人
- 30% ~figure
- 10% ~figure
?1 材料二和材料三在反映问题的方式上有什么不同？ | How do the survey and the chat differ in how they report?
≈ 材料二用调查数字，全面准确；材料三是家长听孩子说的，只是个别情况 | 初三全年级450人参加调查 | 听孩子说
- 材料三比材料二更全面 ~opposite
- 两者都用了数字 ~misread
?1 材料二和材料三有哪一点是一致的？ | On what do survey and chat agree?
≈ 都提到菜有点咸 | 菜太咸（20人） | 就是有时候有点咸
- 都说菜特别难吃 ~onepart
- 都说分量太少 ~unsaid
?2 张妈妈说“好多人都不吃”，这个说法可靠吗？ | Is “lots don't eat it” reliable?
≈ 不可靠，调查显示只有45人不满意，大多数人满意；她是听孩子说的，没有根据 | 听孩子说食堂的菜特别难吃 | “不满意”的45人
% 张妈妈没有去过食堂，只是“听孩子说”；“好多人”也没有具体数字。全年级的调查却显示，450人里有270人满意，不满意的只有45人，只占一成。用调查的数字一比，就知道她的话夸大了。 | She has not seen the canteen; she heard from her child, and “lots” has no number. The survey shows 270 of 450 satisfied and only 45, one in ten, not. Set against it, her words exaggerate.
- 可靠，因为是家长说的 ~view
- 可靠，因为李爸爸也同意 ~misread
?2 如果给食堂提一条最有针对性的改进建议，应该是什么？ | What is the most pointed suggestion?
≈ 做菜少放一点盐 | 菜太咸（20人） | 就是有时候有点咸
- 把午餐价格提高到10元 ~irrelevant
- 取消三种套餐，只做一种 ~opposite
?2 材料一说“欢迎家长和同学提意见”，结合其他材料，学校可以怎样做？ | Given the rest, what might the school do with its invitation?
≈ 根据调查中反映的原因改进，比如少放盐、加大分量，并把结果公布出来 | 欢迎家长和同学提意见 | 不满意的主要原因：菜太咸（20人），分量少（15人）
- 只听张妈妈的意见 ~part
- 不理会任何意见 ~opposite

# 博物馆的“云展览”
材料一（博物馆官网）：本馆“丝路古物”云展览正式上线。观众可在网上360度观看120件文物，点开每件文物，都有专家录制的讲解。
材料二（新闻）：“丝路古物”云展览上线一周，访问量超过50万人次，其中三成来自外地和海外观众。
材料三（观众留言）：网上看是方便，可是隔着屏幕，总觉得少了点什么。等有空了，我还是想去现场看看那些真东西。
?1 根据材料一，云展览有什么特点？ | What marks the online show?
≈ 可以网上360度观看，每件文物都有专家讲解 | 观众可在网上360度观看120件文物 | 都有专家录制的讲解
- 只能在现场观看 ~opposite
- 每周只开放一天 ~unsaid
?1 材料二用什么说明云展览受欢迎？ | How does the news show it is popular?
≈ 用数字：一周访问量超过50万人次，三成来自外地和海外 | 访问量超过50万人次 | 其中三成来自外地和海外观众
- 用观众的留言 ~elsewhere
- 用专家的评价 ~unsaid
?1 材料三的观众对云展览是什么态度？ | What is the commenter's stance?
≈ 承认方便，但觉得不如现场看真东西 | 网上看是方便 | 我还是想去现场看看那些真东西
- 完全反对，认为云展览没有用 ~overread
- 认为云展览比现场好 ~opposite
?2 把三则材料合起来，可以得出什么结论？ | What do the three together support?
≈ 云展览让更多人方便地看到文物，但不能完全代替到现场参观 | 其中三成来自外地和海外观众 | 隔着屏幕，总觉得少了点什么
% 新闻说三成观众来自外地和海外，说明云展览让去不了现场的人也能看到文物，这是它的长处。观众留言却说隔着屏幕“少了点什么”，还想去现场。两方面合起来：云展览很有用，但代替不了现场。 | A third of visitors are from afar: the show reaches those who cannot come, its strength. The comment feels something missing and still wants to go. Together: useful, but no substitute.
- 以后博物馆不用再开门了 ~overread
- 云展览没有人看 ~opposite
?2 材料三说的是事实还是看法？ | Is the comment fact or opinion?
≈ 是观众个人的看法和感受 | 总觉得少了点什么 | 我还是想去现场看看
- 是经过调查的事实 ~fact
- 是博物馆的规定 ~who
?2 材料一出自博物馆官网，它的目的是什么？ | What is the museum's own page for?
≈ 告诉观众云展览上线了，介绍它的内容，吸引大家观看 | 本馆“丝路古物”云展览正式上线 | 点开每件文物
- 统计访问人数 ~elsewhere
- 表达观众的遗憾 ~elsewhere

# 小河变清了
材料一（区环保局数据）：清水河水质监测结果：五年前为劣五类（最差），三年前为四类，今年达到三类。
材料二（电视新闻解说）：五年前，这条小河又黑又臭，岸边堆满了垃圾。经过截污、清淤、种植水草，如今河水清了，鱼儿回来了，岸边成了居民散步的好地方。
材料三（居民口述）：老刘说：“小时候我在这条河里游泳，后来臭得窗都不敢开。现在早上沿着河走一圈，心里舒坦。就是希望别再往河里倒东西了。”
?1 材料一用什么方式说明小河的变化？ | How does the data show the change?
≈ 用不同年份的水质等级来比较 | 五年前为劣五类（最差） | 今年达到三类
- 用居民的回忆 ~elsewhere
- 用画面和解说 ~elsewhere
?1 根据材料二，小河变清采取了哪些办法？ | What did the clean-up do?
= 截污、清淤、种植水草 | 经过截污、清淤、种植水草
- 把小河填平 ~unsaid
- 禁止居民散步 ~opposite
?1 三则材料从不同角度写了小河的变化，材料三的角度是什么？ | From what angle does the resident speak?
≈ 从居民亲身经历和感受的角度，写出小河变化给生活带来的影响 | 小时候我在这条河里游泳 | 现在早上沿着河走一圈，心里舒坦
- 从专业检测的角度 ~elsewhere
- 从治理办法的角度 ~elsewhere
?2 三则材料能不能互相印证？ | Do the three bear each other out?
≈ 能，数据、新闻和居民的话都说明小河变好了 | 今年达到三类 | 如今河水清了，鱼儿回来了 | 现在早上沿着河走一圈，心里舒坦
- 不能，三则材料说法互相矛盾 ~opposite
- 只有材料一可信，其他都是编的 ~overread
?2 老刘说“希望别再往河里倒东西了”，这句话说明了什么？ | What does his wish reveal?
≈ 小河虽然变清了，但仍有人往河里倒东西，保护小河还需要大家坚持 | 就是希望别再往河里倒东西了 | 岸边堆满了垃圾
% 老刘先说现在心里舒坦，接着用“就是”一转，提出一个希望。他希望“别再”倒东西，说明眼下还有人在倒。数据和新闻只说了变好的一面，居民的话补上了还没解决的问题。 | He is content, then turns with 就是 to a wish: that people stop dumping, which means some still do. Data and news show the gain; his words add what remains.
- 说明小河又变黑了 ~overread
- 说明老刘不满意治理结果 ~misread
?2 如果要写一篇关于小河治理的报道，哪一则材料可以作为最有力的事实依据？ | Which is the strongest fact to cite in a report?
≈ 材料一，环保局的监测数据客观准确 | 区环保局数据 | 清水河水质监测结果
- 材料三，因为老刘住了很多年 ~view
- 都不能用 ~overread

# 一则“停课”消息
材料一（网传截图）：紧急通知！明天全市中小学停课一周！请转发给更多家长！（截图没有发布单位，没有日期。）
材料二（市教育局声明）：近日网上流传“全市中小学停课一周”的消息，经核实，系不实信息。全市中小学正常上课，请以本局官方网站发布的消息为准。
材料三（班主任消息）：各位家长，网传停课消息是假的，明天照常上课。请大家不要转发不明来源的消息。
?1 材料一有哪些地方让人怀疑它的真实性？ | What casts doubt on the screenshot?
≈ 没有发布单位，没有日期，还催着人转发 | 截图没有发布单位，没有日期 | 请转发给更多家长
- 字写得太小 ~unsaid
- 时间写得太早 ~unsaid
?1 材料二和材料三对停课消息的说法是否一致？ | Do two and three agree?
≈ 一致，都说停课消息是假的，正常上课 | 系不实信息。全市中小学正常上课 | 网传停课消息是假的，明天照常上课
- 不一致，材料三说要停课 ~opposite
- 材料二没有表态 ~opposite
?1 材料二告诉大家今后应该以什么为准？ | What does the bureau tell people to trust?
= 市教育局官方网站发布的消息 | 请以本局官方网站发布的消息为准
- 网上的截图 ~opposite
- 家长群的消息 ~unsaid
?2 三则材料中，哪一则最权威？为什么？ | Which is most authoritative, and why?
≈ 材料二，它是市教育局发布的正式声明，是管学校的部门 | 市教育局声明 | 经核实
- 材料一，因为写着“紧急通知” ~view
- 材料三，因为是班主任发的 ~part
?2 从这件事中，可以得出什么教训？ | What lesson can be drawn?
≈ 看到消息先看来源，向官方核实，不随便转发 | 请以本局官方网站发布的消息为准 | 请大家不要转发不明来源的消息
% 材料一没有来源、没有日期，却说得很紧急，很多人一着急就转发了。教育局说要“以本局官方网站发布的消息为准”，班主任说“不要转发不明来源的消息”。这两句合起来，就是对付谣言的办法：先查来源，再核实，不乱传。 | The screenshot has no source or date yet sounds urgent, and many forward it in haste. The bureau says to trust its own site; the teacher, not to forward unsourced messages. Together they give the way to meet a rumour: check, verify, do not spread.
- 以后不要再看任何通知 ~overread
- 只要是“紧急通知”就要转发 ~opposite
?2 材料一说“请转发给更多家长”，这样写的目的可能是什么？ | Why might the screenshot ask to be forwarded?
≈ 让消息传得更快更广，这是不实信息常用的手法 | 请转发给更多家长 | 系不实信息
- 帮助家长了解真实情况 ~opposite
- 方便学校通知家长 ~misread

# 一场马拉松
材料一（赛事海报）：城市马拉松，跑出你的精彩！4月6日开跑，全程42公里，限报3万人，报名截止3月20日。
材料二（新闻报道）：4月6日，城市马拉松鸣枪开跑，3万名选手参赛。赛道沿途设置了20个补给站和15个医疗点。比赛中有12名选手身体不适，均得到及时救治。
材料三（选手日记）：跑到30公里，腿像灌了铅。路边一位大爷递给我一瓶水，说：“孩子，加油！”我一下子又有了力气。最后，我用了5小时跑完全程。
?1 材料一的海报主要提供了哪些信息？ | What does the poster give?
≈ 比赛日期、距离、人数限制和报名截止时间 | 4月6日开跑，全程42公里 | 限报3万人，报名截止3月20日
- 补给站和医疗点的数量 ~elsewhere
- 选手跑完全程的时间 ~elsewhere
?1 材料二和材料三相比，在写法上有什么不同？ | How do the report and the diary differ in manner?
≈ 材料二概括报道全场情况，有很多数字；材料三写一个人的亲身经历和感受，很具体 | 3万名选手参赛 | 跑到30公里，腿像灌了铅
- 两者都是写个人的感受 ~part
- 材料三比材料二数字更多 ~opposite
?1 材料三中“腿像灌了铅”用了什么修辞？表现了什么？ | What figure is this, and what does it show?
≈ 比喻，写出腿非常沉重、跑得很累 | 跑到30公里，腿像灌了铅 | 我一下子又有了力气
- 拟人，写出腿很灵活 ~nolikening
- 夸张，写出铅很重 ~misread
?2 根据材料二，可以看出赛事组织得怎样？ | How well run was the race, by the report?
≈ 组织得比较周到，设置了补给站和医疗点，选手不适时得到了及时救治 | 赛道沿途设置了20个补给站和15个医疗点 | 均得到及时救治
% 新闻写了沿途有20个补给站、15个医疗点，说明准备充分；又写12名选手身体不适，“均得到及时救治”，说明医疗安排起了作用。有人不适不能说明组织得不好，关键看有没有及时处理。 | Twenty supply stations and fifteen medical points show preparation; twelve unwell runners all treated in time show it worked. Illness does not prove poor running; the prompt care is what counts.
- 组织得很差，有12人身体不适 ~onepart
- 新闻没有提到组织工作 ~unsaid
?2 材料三中大爷的一句“加油”说明了什么？ | What does the old man's cheer show?
≈ 马拉松不只是选手的比赛，也让城市里的人互相鼓励，充满温暖 | 路边一位大爷递给我一瓶水 | 我一下子又有了力气
- 说明大爷也参加了比赛 ~unsaid
- 说明补给站的水不够 ~overread
?2 材料一说“跑出你的精彩”，属于什么性质的语言？ | What kind of language is this slogan?
≈ 宣传鼓动的语言，目的是吸引人报名 | 城市马拉松，跑出你的精彩 | 报名截止3月20日
- 客观报道比赛结果的语言 ~fact
- 选手的感想 ~who
`;
