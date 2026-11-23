// The texts of the grade 7 reading topics of news, classical prose and classical poems (docs/chinese-curriculum.md
// §18.9). The news reports are written for this subject and name no real people or bodies; the classical passages and
// poems are in the public domain, with notes written for this subject. The format is that of parsePieces in
// topic-kit.ts: a question's wrong options carry the reason they are wrong.

/** NEWS_7 are the reports of reading-7-news: their title, lead and elements, and the facts they give against the views in them. */
export const NEWS_7 = `
# 青溪镇小学生在河边救起落水儿童
本报讯（记者 林晓）六月八日下午四点左右，青溪镇一名五岁男孩在河边玩耍时不慎落水，正在附近放学回家的六年级学生周明和赵小川发现后，及时把他救上了岸。
当天，男孩跟着奶奶在河边散步，追一只皮球时滑进了河里。周明听到喊声，马上跑到河边，趴在岸上，把书包带甩给男孩；赵小川一边抱住周明的双腿，一边大声呼救。附近的村民赶来，三人合力把男孩拉了上来。经检查，男孩没有受伤。
男孩的奶奶拉着两个孩子的手，连声道谢。周明说：“学校讲过，不能自己跳下去救人，所以我们用了书包带。”
记者了解到，青溪镇的学校每学期都要上一堂防溺水安全课。两名学生遇事冷静、救人得法，值得大家学习。
?1 这则消息的导语是哪一部分？ | Which part is the lead?
≈ 第一段 | 本报讯（记者 林晓）六月八日下午四点左右 | 及时把他救上了岸
% 消息的导语一般是第一段，用一两句话说出最主要的事情。这则消息的第一段交代了时间、地点、人物和结果：六月八日下午，青溪镇，两名学生，救起落水男孩。后面几段才是事情的经过和背景。 | The lead of a report is usually its first paragraph, giving the main event in a sentence or two. Here the first paragraph gives the time, place, people and outcome; the paragraphs after it are the course of events and the background.
- 第二段 ~elsewhere
- 最后一段 ~elsewhere
?1 这件事发生在什么时间？ | When did it happen?
= 六月八日下午四点左右 | 六月八日下午四点左右
- 六月八日早上 ~unsaid
- 放学以前 ~opposite
?1 周明用什么救起了男孩？ | What did Zhou Ming use?
= 书包带 | 把书包带甩给男孩
- 一根竹竿 ~unsaid
- 自己跳下河去救 ~opposite
?2 下面哪一句是记者的看法，而不是报道的事实？ | Which is the reporter's view, not a fact reported?
≈ 两名学生遇事冷静、救人得法，值得大家学习 | 值得大家学习 | 经检查，男孩没有受伤
% 事实是发生了的、能够查证的事，比如男孩落水、经检查没有受伤。“值得大家学习”是记者对这件事的评价，表达的是记者的看法。 | Facts are things that happened and can be checked, such as the fall and the boy unhurt. “值得大家学习” is the reporter's judgment of the event: a view.
- 经检查，男孩没有受伤 ~fact
- 青溪镇的学校每学期都要上一堂防溺水安全课 ~fact
?2 记者对两名学生的做法持什么态度？ | What is the reporter's attitude to the two pupils?
≈ 赞扬 | 遇事冷静、救人得法 | 值得大家学习
- 批评他们太冒险 ~opposite
- 不表明态度 ~opposite
?2 写周明的话“不能自己跳下去救人，所以我们用了书包带”，有什么作用？ | What does Zhou Ming's remark do?
≈ 说明他们救人得法，也印证了安全课的作用 | 学校讲过，不能自己跳下去救人 | 每学期都要上一堂防溺水安全课
- 说明周明不会游泳 ~unsaid
- 说明学校不让学生救人 ~misread

# 东湖公园新添二十个“共享书亭”
本报讯（记者 陈雨）本月起，市民在东湖公园散步时，可以顺手借一本书了。三月一日，二十个“共享书亭”在公园里正式启用。
每个书亭像一个小小的木房子，里面放着一百多本书，有童话、小说、科普读物，也有报刊。市民不用办卡，不用登记，拿走一本书，看完放回任何一个书亭就行。如果家里有闲置的书，也可以放进书亭，和大家分享。
据公园管理处介绍，书亭的书一部分由图书馆提供，一部分来自市民捐赠。开放第一周，二十个书亭共借出书八百多本，收到市民捐书三百多本。
家住附近的李阿姨每天早上都来：“以前遛弯就是走走，现在还能坐下来看会儿书，挺好。”
小小书亭，让公园里多了一份书香。
?1 这则消息的标题告诉了我们什么？ | What does the title tell?
≈ 东湖公园新添了二十个共享书亭 | 东湖公园新添二十个“共享书亭” | 二十个“共享书亭”在公园里正式启用
- 东湖公园新建了一座图书馆 ~unsaid
- 书亭里的书都要花钱买 ~opposite
?1 书亭的书从哪里来？ | Where do the books come from?
= 一部分由图书馆提供，一部分来自市民捐赠 | 书亭的书一部分由图书馆提供，一部分来自市民捐赠
- 全部是公园买的 ~unsaid
- 全部是市民捐的 ~part
?1 开放第一周，书亭借出了多少本书？ | How many books went out in the first week?
= 八百多本 | 二十个书亭共借出书八百多本
- 三百多本 ~other
- 一百多本 ~other
?2 “开放第一周，二十个书亭共借出书八百多本”是事实还是看法？ | Is this a fact or a view?
≈ 事实 | 开放第一周，二十个书亭共借出书八百多本
% 这句话说的是第一周实际借出的书的数量，是发生了的、可以查证的事，所以是事实，不是谁的看法。 | The sentence gives how many books were in fact lent in the first week, something that happened and can be checked: a fact, not anyone's view.
- 看法 ~fact
- 记者的想象 ~fact
?2 下面哪一句表达的是看法？ | Which states a view?
≈ 小小书亭，让公园里多了一份书香 | 小小书亭，让公园里多了一份书香 | 三月一日，二十个“共享书亭”在公园里正式启用
% 书亭启用的日期、书的数量是事实；“让公园里多了一份书香”是记者对书亭的评价和感受，是看法。 | The opening date and the counts of books are facts; “让公园里多了一份书香” is the reporter's judgment and feeling: a view.
- 三月一日，二十个“共享书亭”在公园里正式启用 ~fact
- 每个书亭里面放着一百多本书 ~fact
?2 引用李阿姨的话，有什么作用？ | What does Auntie Li's remark do?
≈ 用市民的感受说明书亭受欢迎，使报道真实可信 | 现在还能坐下来看会儿书，挺好 | 家住附近的李阿姨每天早上都来
- 说明李阿姨不喜欢遛弯 ~opposite
- 介绍李阿姨的家在哪里 ~role

# 我市中学生机器人队获全国比赛一等奖
本报讯（记者 王帆）七月二十日，在全国青少年机器人比赛中，我市第三中学代表队设计的“垃圾分拣机器人”获得初中组一等奖。
这台机器人能“看”出垃圾的种类，用机械手把塑料瓶、纸盒、易拉罐分别放进不同的箱子里，一分钟能分拣二十多件。参赛的四名队员都是初二学生，从设计到制作，用了整整八个月。
队长刘思远告诉记者，机器人最初总是把纸盒认成塑料袋，他们拍了三千多张照片，一张一张地教它认。“失败了六十多次，有一阵大家都想放弃了。”指导老师说，孩子们最可贵的，是不怕失败的劲头。
据了解，本次比赛共有来自全国的四百多支队伍参加。
?1 这则消息报道的主要事件是什么？ | What is the main event?
≈ 第三中学代表队的机器人获全国比赛初中组一等奖 | 获得初中组一等奖 | 我市中学生机器人队获全国比赛一等奖
- 第三中学开了一门机器人课 ~unsaid
- 全国有四百多支队伍参加比赛 ~narrow
?1 这台机器人能做什么？ | What can the robot do?
= 分拣塑料瓶、纸盒、易拉罐 | 用机械手把塑料瓶、纸盒、易拉罐分别放进不同的箱子里
- 打扫街道 ~unsaid
- 和人聊天 ~unsaid
?1 队员们用了多长时间做这台机器人？ | How long did they take?
= 整整八个月 | 从设计到制作，用了整整八个月
- 六十多天 ~other
- 二十多天 ~unsaid
?2 “孩子们最可贵的，是不怕失败的劲头”是谁的看法？ | Whose view is this?
≈ 指导老师的看法 | 指导老师说，孩子们最可贵的，是不怕失败的劲头
% 这句话前面有“指导老师说”，是记者引用的指导老师的评价，是指导老师的看法，不是报道的事实。 | It follows “指导老师说”: the reporter quotes the teacher's judgment, the teacher's view, not a fact reported.
- 队长刘思远的看法 ~who
- 这是报道的事实 ~view
?2 “失败了六十多次”这一材料有什么作用？ | What does “failed sixty times” do?
≈ 用事实说明成功来之不易，印证了队员不怕失败 | 失败了六十多次 | 不怕失败的劲头
- 说明机器人质量很差 ~misread
- 说明队员们最后放弃了 ~opposite
?2 最后一句交代参赛队伍有四百多支，有什么作用？ | What does the last line do?
≈ 交代比赛的规模，衬托获奖的不容易 | 本次比赛共有来自全国的四百多支队伍参加 | 获得初中组一等奖
- 说明比赛的人太少 ~opposite
- 和这则消息没有关系 ~role

# 老街改造后重新开街
本报讯（记者 张宁）经过一年的修缮，城南老街于十月一日重新开街。当天，近两万名市民和游客来到老街，青石板路上人来人往。
这条老街已有三百多年历史。改造前，街上电线乱拉，房屋漏雨，不少老店搬走了。这次改造，按照“修旧如旧”的办法，保留了原来的青石板路和木门窗，换掉了破损的瓦片，把电线埋到了地下。
开街当天，搬走多年的老字号糕点铺又回来了。店主吴大伯说：“铺子还在老地方，老顾客找得到。”
不过，也有市民提出，老街的店铺越来越像，卖的东西差不多，少了一点老味道。管理处表示，下一步会请更多老手艺人回来开店。
?1 老街是哪一天重新开街的？ | When did the street reopen?
= 十月一日 | 城南老街于十月一日重新开街
- 一年以前 ~other
- 改造开始的那天 ~unsaid
?1 这次改造保留了什么？ | What was kept?
= 原来的青石板路和木门窗 | 保留了原来的青石板路和木门窗
- 原来的电线 ~opposite
- 破损的瓦片 ~opposite
?1 第二段交代老街改造前的样子，属于消息的哪一部分？ | Which part of a report is the second paragraph's picture of the street before?
≈ 背景：交代事情发生的原因和条件 | 改造前，街上电线乱拉，房屋漏雨 | 这条老街已有三百多年历史
- 导语 ~elsewhere
- 标题 ~elsewhere
?2 “不过，也有市民提出，老街的店铺越来越像”，这是谁的看法？ | Whose view is this?
≈ 一些市民的看法 | 也有市民提出 | 少了一点老味道
- 记者的看法 ~who
- 管理处的看法 ~who
?2 这则消息报道了不同的声音，有什么好处？ | What is good in reporting both sides?
≈ 报道更客观、全面，让读者了解真实情况 | 不过，也有市民提出 | 下一步会请更多老手艺人回来开店
- 说明老街改造完全失败了 ~opposite
- 让读者不再去老街 ~misread
?2 “近两万名市民和游客来到老街”是事实还是看法？ | Fact or view?
≈ 事实 | 近两万名市民和游客来到老街
% 这句话报道的是开街当天来的人数，是发生了的、可以查证的事，所以是事实。 | It reports how many came that day, something that happened and can be checked: a fact.
- 看法 ~fact
- 吴大伯的看法 ~fact

# 山区学校的孩子第一次看到海
本报讯（记者 何静）八月十五日，来自西山县两所山区小学的六十名孩子，在老师的带领下来到海边，第一次看到了大海。
这次活动由市少年宫组织，孩子们在海边住了三天，参观了海洋馆，在沙滩上捡贝壳，还学会了看潮水。
“海比我想的大多了，一眼看不到边！”十一岁的田小花光着脚站在浪花里，不停地跳。不少孩子把装着海水的小瓶子装进书包，说要带回去给爸爸妈妈看。
带队的杨老师说，很多孩子以前只在课本上见过海，“这次他们亲眼看见了，作文里的海就有了颜色”。
据介绍，市少年宫已经连续五年组织这样的活动，先后有三百多名山区孩子来过海边。
?1 这则消息中的人物主要是谁？ | Who are the main people of the report?
≈ 西山县两所山区小学的六十名孩子 | 来自西山县两所山区小学的六十名孩子 | 第一次看到了大海
- 市少年宫的工作人员 ~who
- 海洋馆的讲解员 ~unsaid
?1 孩子们在海边做了哪些事？ | What did they do by the sea?
= 参观海洋馆，捡贝壳，学看潮水 | 参观了海洋馆，在沙滩上捡贝壳，还学会了看潮水
- 坐船出海捕鱼 ~unsaid
- 在海里学游泳 ~unsaid
?1 市少年宫组织这样的活动多少年了？ | For how many years has it been held?
= 连续五年 | 市少年宫已经连续五年组织这样的活动
- 三年 ~other
- 第一次 ~opposite
?2 “作文里的海就有了颜色”是什么意思？ | What does “the sea in their essays has colour” mean?
≈ 孩子们亲眼看过了海，写起来就能写得真实生动 | 这次他们亲眼看见了，作文里的海就有了颜色 | 很多孩子以前只在课本上见过海
- 孩子们用彩笔写作文 ~face
- 孩子们的作文都写了蓝色 ~face
?2 写田小花“光着脚站在浪花里，不停地跳”，有什么作用？ | What does the picture of Tian Xiaohua do?
≈ 用具体的细节写出孩子们第一次看到海的兴奋 | 光着脚站在浪花里，不停地跳 | 海比我想的大多了
- 说明海水很冷 ~unsaid
- 说明她不喜欢海 ~opposite
?2 下面哪一句是事实，不是看法？ | Which is a fact, not a view?
≈ 先后有三百多名山区孩子来过海边 | 先后有三百多名山区孩子来过海边 | 作文里的海就有了颜色
% 来过海边的人数是发生过的、可以查证的事，是事实；“作文里的海就有了颜色”是杨老师对这次活动的评价，是看法。 | The number of children who came is something that happened and can be checked: a fact. “作文里的海就有了颜色” is the teacher's judgment of the trip: a view.
- 作文里的海就有了颜色 ~view
- 海比我想的大多了 ~view

# 社区开办“爷爷奶奶智能手机课堂”
本报讯（记者 宋阳）“点这里，就能和孙子视频了！”十一月三日上午，在幸福里社区活动室，十几位老人围坐在一起，跟着中学生志愿者学用智能手机。
这是社区开办的“爷爷奶奶智能手机课堂”，每周六上午上课，由附近中学的志愿者当老师，教老人用手机挂号、付钱、打视频电话。课堂开办两个月，已有一百二十多位老人来学。
七十三岁的孙奶奶以前去医院，要排一个小时的队挂号。“现在我自己在手机上就挂好了。”她举着手机，有点得意。
志愿者小郑说，教老人要有耐心，同一个按钮，有时候要讲十几遍。“可看到他们学会了，我们也特别高兴。”
社区负责人表示，下一步还要教老人识别手机上的诈骗信息。
?1 这则消息开头引用一句话，有什么作用？ | What does the quotation at the start do?
≈ 用现场的话把读者带进课堂，引起阅读兴趣 | 点这里，就能和孙子视频了 | 跟着中学生志愿者学用智能手机
- 说明这是一则广告 ~misread
- 说明记者也在学用手机 ~unsaid
?1 课堂由谁当老师？ | Who teaches?
= 附近中学的志愿者 | 由附近中学的志愿者当老师
- 社区负责人 ~who
- 医院的医生 ~unsaid
?1 课堂教老人用手机做哪些事？ | What do the elderly learn to do?
= 挂号、付钱、打视频电话 | 教老人用手机挂号、付钱、打视频电话
- 打游戏、看电影 ~unsaid
- 只教打电话 ~part
?2 “课堂开办两个月，已有一百二十多位老人来学”是事实还是看法？ | Fact or view?
≈ 事实 | 课堂开办两个月，已有一百二十多位老人来学
% 这句话报道了课堂开办的时间和来学的人数，是发生了的、能够查证的事，所以是事实。 | It reports how long the class has run and how many have come, something that happened and can be checked: a fact.
- 看法 ~fact
- 记者的猜测 ~fact
?2 “教老人要有耐心”是谁的看法？ | Whose view is “one must be patient”?
≈ 志愿者小郑的看法 | 志愿者小郑说，教老人要有耐心 | 同一个按钮，有时候要讲十几遍
- 孙奶奶的看法 ~who
- 社区负责人的看法 ~who
?2 写孙奶奶“举着手机，有点得意”，有什么作用？ | What does Grandma Sun's pride show?
≈ 用老人的变化说明课堂很有用 | 现在我自己在手机上就挂好了 | 她举着手机，有点得意
- 说明孙奶奶的手机很贵 ~unsaid
- 说明孙奶奶不想学 ~opposite

# 暴雨中，公交司机停车护送盲人过马路
本报讯（记者 唐悦）五月二十二日傍晚，暴雨中的人民路上，一名公交司机停下车，撑着伞把一位盲人送过了马路。路人拍下的视频在网上被很多人转发。
当时，八路公交车司机黄师傅开车经过人民路路口，看见一位拄着盲杖的老人站在路边，雨水顺着他的帽檐往下流，几次想过马路，又退了回来。黄师傅打开双闪，停好车，对车上的乘客说：“对不起，请大家等我一分钟。”他撑着伞下了车，扶着老人走过了斑马线。
回到车上，黄师傅的半边身子都湿透了。车上的乘客没有一个人抱怨，有人还鼓起了掌。
公交公司表示，将对黄师傅进行表扬。记者注意到，这个路口没有盲人过街提示音，不少市民建议尽快装上。
?1 这则消息的标题概括了什么？ | What does the title sum up?
≈ 暴雨中，公交司机停车护送盲人过马路 | 暴雨中，公交司机停车护送盲人过马路 | 撑着伞把一位盲人送过了马路
- 公交车在暴雨中出了事故 ~unsaid
- 盲人老人迷了路 ~unsaid
?1 黄师傅下车前对乘客说了什么？ | What did he say to the passengers?
= 对不起，请大家等我一分钟 | 对不起，请大家等我一分钟
- 请大家下车换乘别的车 ~unsaid
- 请大家帮忙扶老人 ~unsaid
?1 乘客对黄师傅停车是什么反应？ | How did the passengers take it?
= 没有一个人抱怨，有人还鼓起了掌 | 车上的乘客没有一个人抱怨，有人还鼓起了掌
- 很多人抱怨耽误时间 ~opposite
- 大家都下车走了 ~unsaid
?2 下面哪一句是看法，不是事实？ | Which is a view, not a fact?
≈ 不少市民建议尽快装上提示音 | 不少市民建议尽快装上 | 这个路口没有盲人过街提示音
% 路口没有盲人过街提示音，是记者看到的事实；“尽快装上”是市民的建议，表达的是他们的看法和要求。 | That the crossing has no audible signal is a fact the reporter saw; “尽快装上” is a suggestion of residents, their view and request.
- 这个路口没有盲人过街提示音 ~fact
- 黄师傅的半边身子都湿透了 ~fact
?2 消息最后写路口没有盲人提示音，有什么用意？ | What is the end about the crossing for?
≈ 由一件好事引出城市设施的问题，引起人们关注 | 记者注意到，这个路口没有盲人过街提示音 | 不少市民建议尽快装上
- 批评黄师傅停车不对 ~opposite
- 说明盲人不该一个人出门 ~misread
?2 写老人“几次想过马路，又退了回来”，有什么作用？ | What does the old man's turning back do?
≈ 写出老人在暴雨中过马路的困难，说明黄师傅帮忙很及时 | 几次想过马路，又退了回来 | 他撑着伞下了车，扶着老人走过了斑马线
- 说明老人不想过马路 ~opposite
- 说明路上车很少 ~unsaid

# 校园里来了一群“小鸟医生”
本报讯（记者 郑可）最近，北山中学的校园里多了一群“小鸟医生”：学校生物社团的二十多名学生，在校园的树上挂起了三十个人工鸟窝。
社团老师介绍，学校的老树多，可树洞少，鸟儿没地方做窝。去年春天，社团的同学数了数，校园里常见的鸟只有五种。他们查资料、做木箱，把鸟窝挂在离地三米多高的树杈上，又在旁边放了喂食器和小水盆。
一年过去，三十个鸟窝住进了十九个“房客”，校园里能见到的鸟增加到了十二种。每天早上，社团的同学都会拿着望远镜，悄悄地记下鸟儿的变化。
初一学生林可说：“以前我叫不出几种鸟的名字，现在一听叫声就知道是谁来了。”
?1 “小鸟医生”指的是谁？ | Who are the “bird doctors”?
= 学校生物社团的二十多名学生 | 学校生物社团的二十多名学生
- 一群会治病的鸟 ~face
- 学校请来的兽医 ~unsaid
?1 学生们为什么要挂人工鸟窝？ | Why did they hang the boxes?
= 学校的老树多，可树洞少，鸟儿没地方做窝 | 学校的老树多，可树洞少，鸟儿没地方做窝
- 为了把鸟抓起来养 ~unsaid
- 学校的鸟太多了 ~opposite
?1 一年以后，校园里能见到的鸟有多少种？ | How many kinds after a year?
= 十二种 | 校园里能见到的鸟增加到了十二种
- 五种 ~other
- 十九种 ~other
?2 消息用了“五种”和“十二种”两个数字，有什么作用？ | What do the two figures do?
≈ 用前后对比，有力地说明挂鸟窝的效果 | 校园里常见的鸟只有五种 | 校园里能见到的鸟增加到了十二种
- 说明鸟越来越少了 ~opposite
- 说明社团的人数 ~unsaid
?2 林可说“现在一听叫声就知道是谁来了”，说明了什么？ | What does Lin Ke's remark show?
≈ 这项活动让学生增长了知识，更了解鸟了 | 以前我叫不出几种鸟的名字 | 现在一听叫声就知道是谁来了
- 林可的耳朵特别好 ~narrow
- 鸟会说出自己的名字 ~face
?2 “三十个鸟窝住进了十九个‘房客’”是事实还是看法？ | Fact or view?
≈ 事实 | 三十个鸟窝住进了十九个“房客”
% 这句话说的是鸟窝里实际住进了多少鸟，是发生了的、可以查证的事，所以是事实。“房客”加引号，只是把鸟说得形象。 | It says how many boxes are really taken, something that happened and can be checked: a fact. 房客 in quotation marks only makes the birds vivid.
- 看法 ~fact
- 林可的看法 ~fact

# 小区试行垃圾分类“积分换物”
本报讯（记者 冯涛）从九月起，绿园小区试行垃圾分类“积分换物”：居民每次按要求分好垃圾，就能得到一分，积满五十分，可以换一袋大米或一瓶洗洁精。
小区在每栋楼下设了一个分类点，每天早晚各开放两小时，有志愿者在旁边指导。居民刷一下卡，把垃圾投进对应的桶里，积分就自动记上了。
物业统计，试行一个月，小区分类正确的比例从三成提高到了七成多，有一千多户居民领到了积分。
也有居民说，每天只开放四个小时，上班的人赶不上。物业表示，正在考虑延长开放时间。
小小积分，带动了大家的分类热情。
?1 居民积满多少分可以换东西？ | How many points for a prize?
= 五十分 | 积满五十分，可以换一袋大米或一瓶洗洁精
- 一分 ~other
- 一百分 ~unsaid
?1 分类点每天开放多长时间？ | How long is each point open a day?
= 早晚各开放两小时 | 每天早晚各开放两小时
- 全天开放 ~opposite
- 只在早上开放 ~part
?1 试行一个月，分类正确的比例有什么变化？ | How did the share sorted right change?
= 从三成提高到了七成多 | 小区分类正确的比例从三成提高到了七成多
- 从七成降到了三成 ~opposite
- 没有变化 ~opposite
?2 “小小积分，带动了大家的分类热情”是事实还是看法？ | Fact or view?
≈ 看法 | 小小积分，带动了大家的分类热情
% 这句话是记者对“积分换物”效果的总结和评价，带着记者的判断，是看法；前面的比例、户数才是事实。 | The sentence is the reporter's summing-up and judgment of the scheme's effect: a view. The shares and household counts before it are the facts.
- 事实 ~view
- 居民的话 ~who
?2 消息写居民说“上班的人赶不上”，有什么作用？ | What does the residents' complaint do?
≈ 报道试行中的问题，使报道客观全面 | 也有居民说，每天只开放四个小时，上班的人赶不上 | 物业表示，正在考虑延长开放时间
- 说明积分换物完全没有用 ~opposite
- 说明居民不愿意分类 ~misread
?2 “从三成提高到了七成多”这个材料证明了什么？ | What does the rise prove?
≈ 积分换物有效地提高了垃圾分类的正确率 | 从三成提高到了七成多 | 带动了大家的分类热情
- 小区的垃圾越来越多 ~unsaid
- 志愿者太少了 ~unsaid

# 九十岁老人手绘家乡地图
本报讯（记者 叶青）在石桥村，九十岁的陈老伯花了三年时间，用毛笔画出了一张长四米的家乡老地图，近日在村文化室展出。
地图上画着六十年前石桥村的样子：哪里有一口井，哪里有一座庙，哪家开着豆腐坊，连村口那棵大樟树都画了出来。每一处，陈老伯都用小字写上了名字和故事。
陈老伯说，很多老房子已经拆了，年轻人都不知道村子从前的样子。“我记得，就要画下来，不然以后就没人知道了。”为了画准，他拄着拐杖，一处一处地去看，还找了村里十几位老人一起回忆。
展出以来，每天都有村民来看。不少年轻人在地图上找到了自家老屋的位置。村里打算把这张地图做成画册，送给每家每户。
?1 陈老伯画的是什么？ | What did Old Chen draw?
= 六十年前石桥村的样子 | 地图上画着六十年前石桥村的样子
- 今天的石桥村 ~opposite
- 一张世界地图 ~unsaid
?1 陈老伯为了画准，做了哪些事？ | What did he do to get it right?
= 一处一处地去看，还找了十几位老人一起回忆 | 他拄着拐杖，一处一处地去看，还找了村里十几位老人一起回忆
- 上网查资料 ~unsaid
- 请画家来帮他画 ~unsaid
?1 这件事中的“时间、地点、人物、事件”，下面哪一项说得对？ | Which gives the elements right?
≈ 近日，石桥村，九十岁的陈老伯，手绘的家乡老地图展出 | 在石桥村，九十岁的陈老伯花了三年时间 | 近日在村文化室展出
- 六十年前，石桥村，陈老伯，画地图 ~other
- 近日，城里，年轻人，找老屋 ~who
?2 陈老伯说“不然以后就没人知道了”，表达了他怎样的想法？ | What thought is in “no one will know”?
≈ 想把村子的过去留下来，让后人记住家乡 | 不然以后就没人知道了 | 年轻人都不知道村子从前的样子
- 怕自己的画被别人拿走 ~unsaid
- 不想让年轻人知道过去 ~opposite
?2 “不少年轻人在地图上找到了自家老屋的位置”说明了什么？ | What does finding the old houses show?
≈ 这张地图很准确，也唤起了年轻人对家乡的感情 | 不少年轻人在地图上找到了自家老屋的位置 | 为了画准
- 年轻人都住在老屋里 ~opposite
- 地图画错了 ~opposite
?2 下面哪一句是事实？ | Which is a fact?
≈ 陈老伯花了三年时间画地图 | 在石桥村，九十岁的陈老伯花了三年时间 | 我记得，就要画下来
% 花了三年时间画地图，是已经发生的、可以查证的事，是事实。“就要画下来”是陈老伯说出的想法和决心，是他的看法。 | That he spent three years on it is something that happened and can be checked: a fact. “就要画下来” is his own thought and resolve.
- 年轻人都不知道村子从前的样子 ~view
- 不然以后就没人知道了 ~view
`;

/** CLASSICAL_7 are the classical passages of reading-7-classical: their words read with the notes, and what each says. */
export const CLASSICAL_7 = `
# 曾子杀彘（《韩非子》）
曾子之妻之市，其子随之而泣。其母曰：“女还，顾反为女杀彘。”妻适市来，曾子欲捕彘杀之。妻止之曰：“特与婴儿戏耳。”曾子曰：“婴儿非与戏也。婴儿非有知也，待父母而学者也，听父母之教。今子欺之，是教子欺也。母欺子，子而不信其母，非以成教也。”遂烹彘也。
注：之市，到集市去。女，同“汝”，你。顾反，等回来。彘，猪。适，往，到。特，只是。戏，开玩笑。非有知，没有知识。待，依靠。子，你。遂，于是，就。
?1 “曾子之妻之市”中，第二个“之”是什么意思？ | What does the second 之 mean?
≈ 到……去 | 曾子之妻之市 | 妻适市来
% 第二个“之”后面跟着“市”，是一个地方；孩子哭着“随之”，说明妻子正要动身。后文又说“妻适市来”，她从集市回来了。所以这个“之”是动词，到……去。六年级学过的“之”作“的”、作“他”，放在这里都讲不通。 | The second 之 is followed by 市, a place, and the child follows her crying, so she is setting out; later 妻适市来 has her back from the market. So this 之 is a verb, “go to”. The uses learned in grade 6, “of” and “him”, make no sense here.
- 的 ~modern
- 他 ~modern
?1 “女还”中的“女”是什么意思？ | What does 女 mean in 女还?
≈ 你 | 女还，顾反为女杀彘 | 其子随之而泣
% 这句话是母亲对跟着哭的儿子说的：叫他回去，等她回来给他杀猪。“女”是她说话的对象，就是这个孩子，所以只能是“你”；古文里“女”常借作“汝”，也是你。讲成“女儿”“女人”，就成了叫别人回去，和上文孩子跟着哭对不上。 | The mother says this to the son who follows her crying: go home, and when I'm back I'll kill a pig for you. 女 is the one she speaks to, the child, so it must be “you”; in classical texts 女 often stands for 汝, “you”. Read as “daughter” or “woman”, she would be sending someone else home, which the crying son before rules out.
- 女儿 ~modern
- 女人 ~modern
?1 “特与婴儿戏耳”中的“特”是什么意思？ | What does 特 mean here?
≈ 只是 | 特与婴儿戏耳 | 妻止之曰
% 妻子是来拦着曾子不让杀猪的，她要说明：答应杀猪的话不是真的，不过是哄孩子。句末的“耳”是“罢了”，和“特”前后呼应，“特……耳”就是“只是……罢了”。讲成“特别”“特意”，就成了她专门和孩子开玩笑，起不到劝阻的作用。 | The wife comes to stop him, and must say the promise was not meant, only to soothe the child. The closing 耳, “that is all”, answers 特: 特……耳 is “only …, that is all”. Read as “especially” or “on purpose”, she would be making much of the joke instead of stopping him.
- 特别 ~modern
- 特意 ~modern
?2 曾子为什么要杀猪？ | Why did Zengzi kill the pig?
≈ 不能欺骗孩子，大人说话要算数，才能教好孩子 | 今子欺之，是教子欺也 | 非以成教也 | 遂烹彘也
- 家里没有肉吃了 ~unsaid
- 曾子想吃猪肉 ~unsaid
?2 曾子的妻子为什么不让杀猪？ | Why did his wife stop him?
= 她只是和孩子开玩笑 | 特与婴儿戏耳
- 猪还太小 ~unsaid
- 她不喜欢吃猪肉 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 做人要诚实守信，父母要以身作则 | 婴儿非有知也，待父母而学者也 | 是教子欺也 | 遂烹彘也
- 不能带孩子去集市 ~detail
- 孩子哭了就要杀猪 ~face

# 杨布打狗（《列子》）
杨朱之弟曰布，衣素衣而出。天雨，解素衣，衣缁衣而反。其狗不知，迎而吠之。杨布怒，将扑之。杨朱曰：“子无扑矣！子亦犹是也。向者使汝狗白而往，黑而来，岂能无怪哉？”
注：衣素衣，穿着白衣服，前一个“衣”是穿的意思。缁，黑色。反，同“返”，回来。吠，狗叫。扑，打。子，你。犹是，像这样。向者，先前，刚才。使，假如。岂，难道。怪，觉得奇怪。
?1 “衣素衣而出”中，前一个“衣”是什么意思？ | What does the first 衣 mean?
≈ 穿 | 衣素衣而出 | 解素衣，衣缁衣而反
% 一句里有两个“衣”。后一个“衣”前面有“素”（白色），是白衣服；前一个“衣”放在“素衣”前面，是对衣服做的事。下文“解素衣”是脱下白衣，脱下以后又“衣缁衣”，正是换上黑衣。所以前一个“衣”是穿。 | There are two 衣. The second, after 素 “white”, is the white clothes; the first stands before them, so it is something done to clothes. Later 解素衣 is taking the white clothes off, and then 衣缁衣 is putting black ones on. So the first 衣 is “wear”.
- 衣服 ~modern
- 衣柜 ~modern
?1 “衣缁衣而反”中的“反”是什么意思？ | What does 反 mean?
≈ 回来 | 衣缁衣而反 | 衣素衣而出
% 杨布先是“衣素衣而出”，穿白衣出门；下雨后换了黑衣，接着“其狗不知，迎而吠之”，狗迎上来叫，说明他到家了。“出”和“反”前后对着，出去以后就是回来，“反”在这里通“返”。讲成“相反”“反对”，放进句子里讲不通。 | Yang Bu first goes out in white; after the rain he changes into black, and then his dog comes to meet him and barks, so he is home. 出 and 反 answer each other: after going out comes coming back, and 反 here stands for 返. “Opposite” or “oppose” make no sense in the sentence.
- 相反 ~modern
- 反对 ~modern
?1 “向者使汝狗白而往”中的“向者”是什么意思？ | What does 向者 mean?
≈ 先前，刚才 | 向者使汝狗白而往 | 衣素衣而出
% 杨朱打的比方是：假如你的狗出去时是白的，回来时是黑的。这正是杨布刚才出门、回家的样子，所以“向者”说的是刚刚过去的那段时间，是先前、刚才。讲成“朝着的人”“向导”，句子里就多出一个并不存在的人。 | Yang Zhu's comparison: if your dog went out white and came back black. That is just what Yang Bu did a moment ago, so 向者 points to the time just past: “a while ago”. Read as “one facing” or “guide”, the sentence gains a person who is not there.
- 朝着的人 ~modern
- 向导 ~modern
?2 狗为什么对着杨布叫？ | Why did the dog bark at him?
≈ 杨布出门穿白衣服，回来换成了黑衣服，狗认不出他了 | 衣素衣而出 | 衣缁衣而反 | 其狗不知
- 狗饿了 ~unsaid
- 杨布打了狗 ~opposite
?2 杨朱劝杨布的话是什么意思？ | What does Yang Zhu tell him?
≈ 你别打狗，换了你也会这样觉得奇怪 | 子无扑矣 | 子亦犹是也 | 岂能无怪哉
- 你应该把狗打一顿 ~opposite
- 你以后只能穿白衣服 ~unsaid
?2 这个故事告诉我们什么？ | What does the story teach?
≈ 遇事要设身处地地想一想，不要只怪别人 | 子亦犹是也 | 岂能无怪哉
- 狗是不可靠的 ~misread
- 下雨天不要出门 ~detail

# 截竿入城（《笑林》）
鲁有执长竿入城门者，初竖执之，不可入；横执之，亦不可入，计无所出。俄有老父至，曰：“吾非圣人，但见事多矣！何不以锯中截而入？”遂依而截之。
注：鲁，鲁国。执，拿着。初，起初，开始。计无所出，想不出办法。俄，不久，一会儿。老父，老人。但，只是。中截，从中间截断。依，按照。
?1 “俄有老父至”中的“俄”是什么意思？ | What does 俄 mean?
≈ 不久，一会儿 | 俄有老父至 | 计无所出
% 拿竿子的人竖着、横着都进不去，“计无所出”，正站在城门口想不出办法；接着老人就来了，给他出主意。“俄”说的是从他犯难到老人到来隔了多久，是不久、一会儿。讲成“俄国”“饿”，和“有老父至”连不起来。 | The man has tried the pole upright and across and stands at the gate with no idea left; then the old man arrives with advice. 俄 tells how long passed between his trouble and the old man's coming: “soon, after a moment”. “Russia” or “hungry” do not join with 有老父至.
- 俄国 ~modern
- 饿 ~sense
?1 “老父”在这里指什么？ | What does 老父 mean here?
≈ 老人 | 俄有老父至 | 吾非圣人，但见事多矣
% 这位“老父”是半路走来的，和拿竿子的人并不相识；他自己说“见事多矣”，见过的事多，是个上了年纪的人。古文里“父”也用来称呼老年男子，所以“老父”就是老人。讲成“年老的父亲”，文中并没有说他是谁的父亲。 | This 老父 comes along by chance and does not know the man; he says he has seen much, so he is old. In classical texts 父 also names an elderly man, so 老父 is “an old man”. Read as “aged father”, the text never says whose father he would be.
- 年老的父亲 ~modern
- 老师 ~modern
?1 “但见事多矣”中的“但”是什么意思？ | What does 但 mean?
≈ 只是 | 但见事多矣 | 吾非圣人
% 老人先说“吾非圣人”，我不是圣人，再说自己“见事多矣”。他先退一步，再说出自己唯一的长处：我只不过是见的事多罢了。他不是在和谁争辩，而是说自己的本事仅此而已，所以“但”是只是。讲成“但是”，前后就成了相反的两层意思，和他谦虚的口气不合。 | The old man first says he is no sage, then that he has seen much. He steps back, then names his one strength: “I have only seen a great deal.” He argues with no one; he says that is all he has, so 但 is “only”. Read as “but”, the two halves would oppose each other, which his modest tone does not bear.
- 但是 ~modern
- 但愿 ~modern
?2 拿竿子的人想过哪些办法？ | What did he try?
= 先竖着拿，又横着拿 | 初竖执之，不可入 | 横执之，亦不可入
- 先截断，再竖着拿 ~wrongorder
- 把城门拆了 ~unsaid
?2 老人出的主意好不好？为什么？ | Was the old man's advice good?
≈ 不好，把竿子顺着城门拿进去就行了，截断就把竿子毁了 | 何不以锯中截而入 | 初竖执之，不可入；横执之，亦不可入
% 竖着拿，城门太矮；横着拿，城门太窄。其实只要把竿子顺着城门的方向，一头朝前拿进去就行了。老人却叫他把竿子截断，长竿就没用了。老人自以为“见事多”，出的却是个笨主意。 | Upright, the gate is too low; across, too narrow. He had only to carry it in end first, along the gateway. The old man had him saw it in two, which spoils the pole: proud of having “seen much”, he gives a foolish answer.
- 很好，截断以后就能进城了 ~misread
- 很好，因为老人是圣人 ~opposite
?2 这个故事讽刺了什么样的人？ | Whom does the story mock?
≈ 不会灵活想办法的人，和自以为是、乱出主意的人 | 计无所出 | 吾非圣人，但见事多矣 | 遂依而截之
- 爱读书的人 ~unsaid
- 住在城里的人 ~unsaid

# 郑人买履（《韩非子》）
郑人有欲买履者，先自度其足，而置之其坐。至之市，而忘操之。已得履，乃曰：“吾忘持度。”反归取之。及反，市罢，遂不得履。人曰：“何不试之以足？”曰：“宁信度，无自信也。”
注：郑，郑国。履，鞋。度（duó），量。置，放。坐，同“座”，座位。之市，到集市去。度（dù），量好的尺码。反，同“返”，返回。遂，于是，就。无，不。
?1 “而忘操之”中的“操”是什么意思？ | What does 操 mean?
≈ 拿 | 而忘操之 | 吾忘持度
% 他在家量好了脚，把尺码放在座位上，到了集市才发现“忘操之”；接着他自己说“吾忘持度”，我忘了拿尺码。前后说的是同一件事，“操”和“持”意思相同，都是拿。讲成“做操”“操心”，都和忘了带尺码这件事连不起来。 | He measured his foot at home and left the measure on his seat; at the market he finds he 忘操之; then he says himself 吾忘持度, “I forgot to bring the measure”. Both tell the same thing, so 操 means what 持 does: “take, carry”. “Do exercises” or “worry” do not fit his forgetting the measure.
- 做操 ~modern
- 操心 ~modern
?1 “及反，市罢”中的“罢”是什么意思？ | What does 罢 mean?
≈ 结束，散了 | 及反，市罢 | 遂不得履
% 他跑回家拿尺码，等再回到集市，“市罢”，于是“不得履”，鞋子没买成。没买成的原因就在“市罢”：集市已经结束、散了，卖鞋的人都走了。讲成“罢工”的停止工作，说的是做工的人，和集市不合；讲成“罢了”的算了，也接不上后面的“遂不得履”。 | He runs home for the measure, and when he gets back 市罢, so he gets no shoes. The reason is 市罢: the market is over and broken up, the shoe-sellers gone. The strike sense of 罢工 is about workers, not a market, and “never mind” does not lead on to 遂不得履.
- 停止工作 ~modern
- 算了 ~sense
?1 “宁信度，无自信也”中的“宁”是什么意思？ | What does 宁 mean?
≈ 宁可 | 宁信度，无自信也 | 何不试之以足
% 别人问他为什么不用脚试鞋，他回答：“宁信度，无自信也。”“无”是不，后半句是不相信自己的脚；前半句和它相比，是把量好的尺码放在前面：宁可相信尺码，也不相信自己的脚。所以“宁”是宁可。讲成“安宁”，和后面“信度”连不起来；讲成“难道”，他就是在反问，和他认死理的回答不合。 | Asked why he did not try the shoes on his feet, he answers 宁信度，无自信也. 无 is “not”, and the second half is “not trust myself”; the first half is weighed against it, putting the measure first: “I would rather trust the measure than myself”. So 宁 is “rather”. “Peace” does not join with 信度, and “can it be that” would make it a question, at odds with his stubborn answer.
- 安宁 ~modern
- 难道 ~sense
?2 他为什么没有买到鞋？ | Why did he get no shoes?
= 他回家去拿尺码，等再回来时，集市已经散了 | 反归取之 | 及反，市罢，遂不得履
- 鞋子太贵，买不起 ~unsaid
- 集市上没有合他脚的鞋 ~unsaid
?2 别人问他“何不试之以足”，是什么意思？ | What does the bystander ask?
≈ 为什么不用自己的脚去试鞋 | 何不试之以足 | 先自度其足
- 为什么不光着脚回家 ~misread
- 为什么不先量一量脚 ~misread
?2 这个故事讽刺了什么样的人？ | Whom does the story mock?
≈ 只相信死规矩、不顾实际情况的人 | 宁信度，无自信也 | 何不试之以足
% 尺码是照着脚量出来的，脚就在他身上，用脚一试就知道鞋合不合适；他却宁可回家拿尺码，也不相信自己的脚，结果鞋没买成。故事讽刺的是只认死规矩、不看实际情况的人。说他只是记性不好，忘带东西，就只看到了故事的一部分。 | The measure was taken from his foot, and the foot is on him; one try would settle whether the shoes fit. Yet he would rather go home for the measure than trust his foot, and gets no shoes. The story mocks those who hold to the rule and ignore what is in front of them. To call him merely forgetful sees only part of it.
- 爱买东西的人 ~unsaid
- 记性不好、爱忘事的人 ~part

# 疑邻盗斧（《列子》）
人有亡斧者，意其邻之子。视其行步，窃斧也；颜色，窃斧也；言语，窃斧也；动作态度，无为而不窃斧也。俄而掘其谷而得其斧，他日复见其邻人之子，动作态度，无似窃斧者。
注：亡，丢失。意，怀疑，猜想。窃，偷。颜色，脸色。无为而不窃斧也，没有一样不像偷斧子的。俄而，不久。掘，挖。谷，山谷。他日，另一天。复，又。
?1 “人有亡斧者”中的“亡”是什么意思？ | What does 亡 mean?
≈ 丢失 | 人有亡斧者 | 俄而掘其谷而得其斧
% 这个人怀疑邻居的孩子偷了斧子；后来在山谷里挖地，“得其斧”，又找到了。先以为被偷，后来又找到，说明斧子是丢了，所以“亡”是丢失。讲成“死亡”“逃亡”，斧子既不会死，也不会自己逃走。 | The man suspects the neighbor's son of stealing the axe, and later digs in the valley and finds it. Thought stolen, then found: the axe was lost, so 亡 is “lose”. An axe can neither die nor run away.
- 死亡 ~modern
- 逃亡 ~modern
?1 “意其邻之子”中的“意”是什么意思？ | What does 意 mean?
≈ 怀疑，猜想 | 意其邻之子 | 视其行步，窃斧也
% 丢了斧子以后，他“意其邻之子”，接着看那孩子走路、脸色、说话，处处都像偷斧子的；后来斧子找到了，孩子再也不像小偷了。可见孩子并没有偷，是他心里先这样猜。所以“意”是怀疑、猜想。讲成“意思”“愿意”，放进句子讲不通。 | After losing the axe he 意 the neighbor's son, then sees a thief in the boy's walk, face and speech; once the axe is found, the boy no longer looks it. The boy stole nothing: the man had guessed it first. So 意 is “suspect”. “Meaning” or “willing” make no sense here.
- 意思 ~modern
- 愿意 ~modern
?1 “颜色，窃斧也”中的“颜色”是什么意思？ | What does 颜色 mean?
≈ 脸色 | 颜色，窃斧也 | 视其行步，窃斧也
% 这几句一样一样地写他怎样看那孩子：走路的样子、“颜色”、说的话、动作态度，都是从一个人身上看得出来的。夹在走路和说话中间的“颜色”，说的是孩子脸上的神色，是脸色。讲成红黄蓝绿的色彩，和偷没偷斧子毫无关系。 | These lines go one by one through what he watches in the boy: his walk, his 颜色, his speech, his bearing, all things seen in a person. Set between walk and speech, 颜色 is the look on his face. Colors like red or blue have nothing to do with stealing.
- 红黄蓝绿这样的色彩 ~modern
- 衣服的颜色 ~modern
?2 丢斧子的人后来在哪里找到了斧子？ | Where was the axe found?
= 在山谷里挖到的 | 俄而掘其谷而得其斧
- 在邻居家里 ~unsaid
- 邻居的孩子还给他的 ~unsaid
?2 找到斧子前后，他看邻居的孩子为什么不一样了？ | Why did the boy look different after?
≈ 孩子没有变，是他心里的怀疑没有了 | 意其邻之子 | 无为而不窃斧也 | 无似窃斧者
% 找到斧子以前，他先怀疑邻居的孩子，于是看孩子走路、脸色、说话，“无为而不窃斧也”；找到斧子以后，再看孩子，动作态度“无似窃斧者”。孩子还是那个孩子，变的是他心里的猜疑。 | Before the axe turned up he suspected the boy, so his walk, face and speech all looked like a thief's; after it turned up, nothing about him did. The boy was the same; what changed was the suspicion in the man's mind.
- 邻居的孩子改正了错误 ~unsaid
- 邻居的孩子搬走了 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 不能凭主观猜疑看人，要从事实出发 | 意其邻之子 | 无似窃斧者
- 斧子要放好，不要丢 ~detail
- 邻居都是不可信的 ~misread
# 狐假虎威（《战国策》）
虎求百兽而食之，得狐。狐曰：“子无敢食我也。天帝使我长百兽，今子食我，是逆天帝命也。子以我为不信，吾为子先行，子随我后，观百兽之见我而敢不走乎？”虎以为然，故遂与之行。兽见之皆走。虎不知兽畏己而走也，以为畏狐也。
注：求，寻找。子，你。长，做……的首领。逆，违背。以……为，认为。信，诚实。然，对。遂，就。走，跑。畏，害怕。
?1 “天帝使我长百兽”中的“长”是什么意思？ | What does 长 mean?
≈ 做……的首领 | 天帝使我长百兽 | 今子食我，是逆天帝命也
% 狐狸要吓住老虎，说天帝派它管百兽，所以吃它就是违背天帝的命令；后来它又让老虎看百兽见了它都逃。能让百兽都怕、吃了它就违抗天帝的，只能是百兽的首领。“长”在这里读 zhǎng，是做首领。讲成“长短”“生长”，句子讲不通。 | To scare the tiger, the fox says Heaven set it over the beasts, so eating it defies Heaven's order; then it has the tiger watch every beast flee from it. What all beasts fear, and Heaven protects, is their chief. 长, read zhǎng, is “be chief of”. “Long” or “grow” make no sense.
- 长短的长 ~modern
- 生长 ~modern
?1 “虎以为然”中的“然”是什么意思？ | What does 然 mean?
≈ 对 | 虎以为然 | 故遂与之行
% 狐狸提议让老虎跟在后面去看，老虎“以为然”，接着就“遂与之行”，真的跟着走了。老虎照着狐狸的话做，说明它认为狐狸说得对，所以“然”是对。讲成“然后”“然而”，“以为然后”“以为然而”都不成话。 | The fox proposes the tiger follow and see; the tiger 以为然, and then goes along with it. Doing as the fox says shows he thinks it right, so 然 is “right”. 以为然后 or 以为然而 are not sentences.
- 然后 ~modern
- 然而 ~modern
?1 “兽见之皆走”中的“走”是什么意思？ | What does 走 mean?
≈ 跑 | 兽见之皆走 | 虎不知兽畏己而走也
% 后文说百兽是“畏己而走”，因为害怕才“走”。害怕的野兽见到老虎，不会慢慢走开，而是赶紧逃。古文里“走”常常是跑的意思，今天说的走路，古文多用“行”，前文“与之行”就是一起走。所以这里的“走”是跑。 | Later the beasts 走 because they fear: frightened beasts do not stroll off, they flee. In classical texts 走 often means “run”, while walking is usually 行, as in 与之行 just before. So 走 here is “run”.
- 慢慢地走路 ~modern
- 离开家 ~modern
?2 狐狸是怎样骗老虎的？ | How did the fox trick the tiger?
= 说天帝让它做百兽的首领，再让老虎跟在后面看百兽怕不怕它 | 天帝使我长百兽 | 吾为子先行，子随我后
- 跑得比老虎快，逃走了 ~unsaid
- 给老虎找来了别的食物 ~unsaid
?2 百兽见了它们为什么都跑了？ | Why did the beasts run?
≈ 百兽怕的是跟在后面的老虎，不是狐狸 | 虎不知兽畏己而走也 | 以为畏狐也
- 百兽真的怕狐狸 ~opposite
- 百兽要去找天帝 ~unsaid
?2 这个故事讽刺了什么样的人？ | Whom does the story mock?
≈ 借着别人的势力欺压人的人，也讽刺了看不清真相的人 | 狐曰：“子无敢食我也 | 虎不知兽畏己而走也
- 跑得很快的人 ~unsaid
- 爱吃肉的人 ~face
# 宋有富人（《韩非子》）
宋有富人，天雨墙坏。其子曰：“不筑，必将有盗。”其邻人之父亦云。暮而果大亡其财，其家甚智其子，而疑邻人之父。
注：宋，宋国。雨（yù），下雨。筑，修补。盗，小偷。邻人之父，邻居家的老人。亦，也。暮，晚上。果，果然。甚，很。
?1 “其邻人之父亦云”中的“云”是什么意思？ | What does 云 mean?
≈ 说 | 其邻人之父亦云 | 其子曰
% 前面写富人的儿子“曰”，说了“不筑，必将有盗”这句话；接着说邻居家的老人“亦云”，“亦”是也，邻居老人也这样说。后文富人家怀疑的，正是说了这话的邻居老人。所以“云”和前面的“曰”一样，是说。讲成“云彩”，和“亦”连不起来；讲成“想”，邻居心里想的，富人家就无从知道，也谈不上怀疑他。 | First the rich man's son 曰, says, “Unmended, it will bring thieves”; then the neighbour's old father 亦云, 亦 being “also”: he too says so. Later the family suspects the very old man who said it. So 云 is like 曰: “say”. “Cloud” does not join with 亦, and if he had only thought it, the family could not know it or suspect him for it.
- 云彩 ~modern
- 心里想 ~sense
?1 “暮而果大亡其财”中的“亡”是什么意思？ | What does 亡 mean?
≈ 丢失 | 暮而果大亡其财 | 必将有盗
% 儿子和邻居老人都说墙不修会招来小偷，到了晚上“果”然出了事，“大亡其财”：被偷走了很多财物，财物丢失了。说的是钱财，不是人，所以“亡”是丢失。讲成“死亡”，财物不会死；讲成“逃跑”，财物自己也不会跑。 | Son and neighbour both said the broken wall would bring thieves, and that night, just as they said, 大亡其财: much was stolen, the goods were lost. It speaks of goods, not people, so 亡 is “lose”. Goods cannot die, so not “death”, nor can they run off by themselves.
- 死亡 ~modern
- 逃跑 ~sense
?1 “其家甚智其子”中的“智”是什么意思？ | What does 智 mean?
≈ 认为……聪明 | 其家甚智其子 | 而疑邻人之父
% 家里被偷以后，富人家对儿子和邻居老人的看法正好相反：对邻居老人是“疑”，怀疑他；对儿子是“甚智”。和“怀疑”相对，又用在“其子”前面，“智其子”就是认为自己的儿子很聪明。讲成名词“智慧”，后面紧接着“其子”，句子就说不通了。 | After the theft the family judges son and neighbour in opposite ways: the old man they 疑, suspect; the son they 甚智. Set against “suspect” and put before 其子, 智其子 is “think the son clever”. As the noun “wisdom”, it could not take 其子 straight after it.
- 智慧 ~modern
- 聪明的人 ~sense
?2 富人的儿子和邻居老人说了什么话？ | What did the son and the neighbour say?
= 墙不修好，一定会有小偷 | 不筑，必将有盗 | 其邻人之父亦云
- 天快要下雨了 ~unsaid
- 家里已经丢了钱 ~wrongorder
?2 两人说的是同样的话，富人家为什么一个夸、一个怀疑？ | They said the same; why praise one and suspect the other?
≈ 一个是自己的儿子，一个是外人，亲疏不同 | 甚智其子 | 而疑邻人之父 | 其邻人之父亦云
- 邻居老人说的话不对 ~opposite
- 邻居老人真的偷了东西 ~unsaid
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 判断一句话，要看事实，不能因为和说话人亲疏不同就有偏见 | 甚智其子，而疑邻人之父 | 其邻人之父亦云
% 两个人说的话一模一样，后来也都应验了。富人家却夸儿子聪明，怀疑邻居老人，不是因为话不同，而是因为人不同：一个是自家人，一个是外人。看人说话，应当看事实，不能因为亲疏就有偏见。说故事是教人下雨后要修墙，只看到了故事的表面。 | The two said exactly the same, and both came true. Yet the family praises the son and suspects the neighbour, not because the words differ but the speakers do: one family, one outsider. Words should be judged by the facts, not by how close the speaker is to us. To take it as “mend walls after rain” sees only the surface.
- 下雨以后要及时修墙 ~face
- 不要和邻居说话 ~unsaid

# 陶侃惜谷（《晋书》）
侃尝出游，见人持一把未熟稻，侃问：“用此何为？”人云：“行道所见，聊取之耳。”侃大怒曰：“汝既不田，而戏贼人稻！”执而鞭之。是以百姓勤于农植，家给人足。
注：侃，陶侃，晋朝人，当时管理一方。尝，曾经。何为，做什么。聊，姑且，随便。田，种田。戏贼，随便毁坏。执，抓住。鞭，用鞭子打。是以，因此。农植，种庄稼。家给人足，家家户户丰衣足食。
?1 “聊取之耳”中的“聊”是什么意思？ | What does 聊 mean?
≈ 姑且，随便 | 聊取之耳 | 行道所见
% 那人回答陶侃：这是“行道所见”，走在路上看见的，就“聊取之耳”。走路时顺手拿的，并没有什么用处，句末的“耳”又是“罢了”，口气很随意。所以“聊”是姑且、随便。讲成“聊天”，就成了拿着稻子聊天，讲不通。 | The man answers that he saw it on the road and 聊取之耳. Picked up in passing, for no purpose, and 耳, “that is all”, makes the tone offhand. So 聊 is “just, casually”. As “chat”, he would be chatting with the rice, which makes no sense.
- 聊天 ~modern
- 无聊 ~modern
?1 “汝既不田”中的“田”是什么意思？ | What does 田 mean?
≈ 种田 | 汝既不田 | 而戏贼人稻
% 陶侃骂那人：你既然“不田”，却随便毁坏别人的稻子。“田”放在“不”后面，是一件可以做也可以不做的事；和后面的“人稻”对着，说的是自己不种庄稼，却糟蹋别人种的。所以“田”在这里作动词，是种田。讲成“田地”，“不田地”不成话。 | Tao Kan scolds: since you 不田, you wantonly ruin others' rice. After 不, 田 is something one does or not; set against 人稻, others' rice, it says he grows nothing yet spoils what others grow. So 田 is a verb, “farm”. “Field” does not fit after 不.
- 田地 ~modern
- 姓田的人 ~unsaid
?1 “是以百姓勤于农植”中的“是以”是什么意思？ | What does 是以 mean?
≈ 因此 | 是以百姓勤于农植 | 执而鞭之
% 前面写陶侃把毁坏稻子的人抓起来鞭打，后面写百姓都勤于种庄稼、家家丰衣足食。前面是陶侃这样爱护庄稼，后面是百姓勤于耕种的结果，“是以”把原因和结果连起来，是因此。讲成“是用”“以为是”，前后就连不起来。 | Before, Tao Kan has the man seized and whipped; after, the people farm diligently and all have enough. The first is the cause, the second the result, and 是以 joins them: “therefore”. “Is using” or “take to be” do not join them.
- 是用 ~modern
- 以为是 ~modern
?2 陶侃为什么大怒？ | Why was Tao Kan so angry?
≈ 那人自己不种田，却随便毁坏别人还没熟的稻子 | 汝既不田，而戏贼人稻 | 见人持一把未熟稻
- 那人不跟陶侃打招呼 ~unsaid
- 那人偷了陶侃的钱 ~unsaid
?2 “是以百姓勤于农植，家给人足”说明了什么？ | What does the end show?
≈ 陶侃爱惜粮食、重视农业，百姓也因此勤于耕种，生活富足 | 是以百姓勤于农植 | 家给人足
- 百姓都害怕挨打，不敢出门 ~misread
- 陶侃自己去种田了 ~unsaid
?2 从这个故事可以看出陶侃是怎样的人？ | What kind of man is Tao Kan?
≈ 爱惜粮食、关心农事 | 侃大怒曰 | 汝既不田，而戏贼人稻
- 脾气暴躁，乱打百姓 ~misread
- 喜欢到处游玩 ~face

# 刻舟求剑（《吕氏春秋》）
楚人有涉江者，其剑自舟中坠于水，遽契其舟，曰：“是吾剑之所从坠。”舟止，从其所契者入水求之。舟已行矣，而剑不行，求剑若此，不亦惑乎？
注：楚，楚国。自，从。坠，落。遽（jù），急忙，立刻。是，这里。所从坠，掉下去的地方。求，寻找。若此，像这样。
?1 “楚人有涉江者”中的“涉”是什么意思？ | What does 涉 mean?
≈ 渡，过 | 楚人有涉江者 | 其剑自舟中坠于水
% 下一句说他的剑“自舟中坠于水”，从船上掉进水里，可见这个楚国人是坐着船在江上。坐船在江上，就是要过江，所以“涉江”是渡江，“涉”是渡、过。讲成“涉及”，和江连不起来；讲成在江边走，他就不会在船上了。 | The next line has his sword fall from the boat into the water, so he is on the river in a boat. On a boat on the river, he is crossing it: 涉江 is “cross the river”, and 涉 is “cross”. “Concern” does not join with a river, and walking on the bank would not put him on a boat.
- 涉及 ~modern
- 在江边走 ~sense
?1 “遽契其舟”中的“契”是什么意思？ | What does 契 mean?
≈ 刻 | 遽契其舟 | 从其所契者入水求之
% 剑掉下去以后，他马上在船上“契”了一下，说“这里是我的剑掉下去的地方”；船停了，他又从“所契者”，也就是他“契”过的地方下水找剑。他是在船上留了一个记号，好记住地方，所以“契”是刻。讲成“契约”，船上不会写合同；讲成“抓住”，抓过的地方也留不下可以认的记号。 | When the sword falls he at once does 契 to the boat and says “here is where my sword fell”; when the boat stops he goes into the water from 所契者, the place he did it. He has left a mark on the boat to know the spot, so 契 is “carve”. A contract is not written on a boat, and gripping it would leave no mark to find again.
- 契约 ~modern
- 抓住 ~sense
?1 “不亦惑乎”中的“惑”是什么意思？ | What does 惑 mean?
≈ 糊涂 | 不亦惑乎 | 舟已行矣，而剑不行
% 作者先说明白道理：船已经走了，剑却没有跟着走，还在原来的地方；照着船上的记号去找，怎么找得到？“求剑若此”，像这样找剑，“不亦惑乎”，不是很糊涂吗？这是作者对他的评价，所以“惑”是糊涂。讲成“迷惑别人”，楚人并没有骗谁；讲成“聪明”，正和作者讲的道理相反。 | The author first sets out the reason: the boat has moved, the sword has not, it lies where it fell; how could the mark on the boat find it? 求剑若此，不亦惑乎: seeking a sword like this, is it not muddled? It is the author's verdict, so 惑 is “muddled, foolish”. He deceives no one, so not “mislead others”, and “clever” is the opposite of the author's point.
- 迷惑别人 ~modern
- 聪明 ~opposite
?2 楚人为什么在船上刻记号？ | Why did he mark the boat?
= 想记住剑掉下去的地方，好去找剑 | 是吾剑之所从坠 | 从其所契者入水求之
- 想在船上留下自己的名字 ~unsaid
- 船是他刚买的，要做记号 ~unsaid
?2 他为什么找不到剑？ | Why could he not find it?
≈ 船已经走了，剑却还在原来掉下去的地方 | 舟已行矣，而剑不行 | 从其所契者入水求之
- 江水太深，看不见 ~unsaid
- 剑被别人捡走了 ~unsaid
?2 这个故事讽刺了什么样的人？ | Whom does the story mock?
≈ 不懂得事情在变化，死守老办法的人 | 舟已行矣，而剑不行 | 求剑若此，不亦惑乎
- 不会游泳的人 ~unsaid
- 丢三落四的人 ~part

# 叶公好龙（《新序》）
叶公子高好龙，钩以写龙，凿以写龙，屋室雕文以写龙。于是天龙闻而下之，窥头于牖，施尾于堂。叶公见之，弃而还走，失其魂魄，五色无主。是叶公非好龙也，好夫似龙而非龙者也。
注：叶公，春秋时楚国的贵族，字子高。好，喜欢。钩，衣带上的钩子。写，画。凿，一种酒器。雕文，雕刻的花纹。窥，探看。牖，窗户。施，伸。还走，转身就跑。失其魂魄，吓得魂都没了。五色无主，脸色一会儿一个样，自己做不了主。夫，那。
?1 “钩以写龙”中的“写”是什么意思？ | What does 写 mean?
≈ 画 | 钩以写龙 | 屋室雕文以写龙
% 叶公在衣带钩上、酒器上、屋子的雕刻花纹上都“写龙”。这些地方都是装饰，上面做出的是龙的样子；文末又说他喜欢的是“似龙而非龙者”，像龙的图样。所以“写”是画。讲成“写字”，就成了到处写一个“龙”字，那并不“似龙”。 | Ye Gong 写龙 on belt hooks, wine vessels and the carvings of his rooms: ornaments bearing the shape of a dragon, and the ending says he loved what looks like a dragon but is not one. So 写 is “draw, depict”. “Write” would put the word 龙 everywhere, which does not look like a dragon.
- 写字 ~modern
- 写作文 ~modern
?1 “施尾于堂”中的“施”是什么意思？ | What does 施 mean?
≈ 伸 | 施尾于堂 | 窥头于牖
% 真龙下来了，“窥头于牖”是把头探进窗户，“施尾于堂”说的是尾巴在厅堂里怎样。两句对着写：头从窗口探进来，龙身很长，尾巴就一直伸到了厅堂里。所以“施”是伸。讲成“施工”“送给别人”，和龙尾放不到一起。 | The real dragon comes: 窥头于牖, its head peering in at the window, and 施尾于堂, its tail doing something in the hall. The two lines pair: the head pokes in at the window, and the long body's tail stretches into the hall. So 施 is “stretch”. “Build” or “give” cannot go with a tail.
- 施工 ~modern
- 把东西送给别人 ~modern
?1 “弃而还走”中的“走”是什么意思？ | What does 走 mean?
≈ 跑 | 弃而还走 | 失其魂魄
% 叶公见了真龙，吓得“失其魂魄”，脸色一会儿一个样。吓成这样的人，不会慢慢走开，而是转身就逃。古文里“走”常常是跑，今天说的走路，古文多用“行”。所以这里的“走”是跑。 | Seeing the real dragon, Ye Gong is frightened out of his wits, his face changing color. Someone so frightened does not stroll off but turns and flees. In classical texts 走 often means “run”; walking is usually 行. So 走 is “run”.
- 走路 ~modern
- 走亲戚 ~modern
?2 叶公见到真龙时是什么样子？ | How did Ye Gong take the real dragon?
= 转身就跑，吓得魂都没了 | 叶公见之，弃而还走，失其魂魄
- 高兴地跑上去迎接 ~opposite
- 请龙到屋里坐 ~opposite
?2 叶公真的喜欢龙吗？ | Did he truly love dragons?
≈ 不是，他喜欢的只是像龙又不是龙的东西 | 是叶公非好龙也 | 好夫似龙而非龙者也 | 弃而还走
- 是，他到处都画着龙 ~onepart
- 是，龙来了他很高兴 ~opposite
?2 这个故事讽刺了什么样的人？ | Whom does the story mock?
≈ 嘴上说爱好某样东西，其实并不真爱的人 | 叶公子高好龙 | 是叶公非好龙也
- 爱画画的人 ~detail
- 胆子大的人 ~opposite
`;

/** POEMS_7 are the classical poems of reading-7-poems: the images and scene of their lines, and the feeling they carry. */
export const POEMS_7 = `
# 竹里馆（唐·王维）
独坐幽篁里，弹琴复长啸。
深林人不知，明月来相照。
注：幽篁，幽深的竹林。复，又。长啸，撮口发出长而清的声音。深林，指竹林深处。相照，照着他。
?1 诗中写了哪些景物？ | What does the poem show?
≈ 幽深的竹林和明月 | 独坐幽篁里 | 明月来相照
- 高山和流水 ~unsaid
- 花草和小鸟 ~unsaid
?1 “明月来相照”中，把明月写成了什么？ | What is the moon made into?
≈ 把明月当作知心的朋友，来陪伴诗人 | 明月来相照 | 深林人不知
- 天上的一盏灯 ~face
- 一个吵闹的客人 ~misread
?1 这首诗描绘了一个怎样的境界？ | What setting does the poem paint?
≈ 月夜竹林里幽静、清冷的境界 | 独坐幽篁里 | 深林人不知 | 明月来相照
- 热闹繁华的街市 ~opposite
- 狂风暴雨的夜晚 ~unsaid
?2 诗人“独坐”“人不知”，他感到孤独难过吗？ | Is the poet lonely and sad, sitting alone?
≈ 不是，他弹琴长啸，有明月相伴，悠闲自在 | 弹琴复长啸 | 明月来相照 | 独坐幽篁里
% 诗人虽然独自坐在竹林里，没有人知道，可他弹着琴、长啸，明月又来照着他。弹琴长啸是自得其乐，明月相照是有伴，他享受的是这份清静，并不难过。 | Though he sits alone and unknown, he plays and sings, and the moon comes to shine on him. That is pleasure in himself and company enough: he enjoys the stillness and is not sad.
- 是，他非常孤独伤心 ~nomood
- 是，他在想念家乡 ~nomood
?2 这首诗表达了诗人怎样的情怀？ | What feeling does the poem carry?
≈ 远离尘世、恬淡闲适的心境 | 弹琴复长啸 | 深林人不知
- 对战争的愤怒 ~nomood
- 送别友人的不舍 ~nomood
?2 “深林人不知”表现了什么？ | What does “no one knows, deep in the wood” show?
= 竹林幽深，远离人世 | 深林人不知
- 诗人迷路了 ~unsaid
- 诗人怕被人发现 ~misread

# 次北固山下（唐·王湾）
客路青山外，行舟绿水前。
潮平两岸阔，风正一帆悬。
海日生残夜，江春入旧年。
乡书何处达？归雁洛阳边。
注：次，停宿。北固山，在今江苏镇江。客路，旅途。乡书，家信。
?1 “潮平两岸阔，风正一帆悬”写出了怎样的景象？ | What scene do these lines paint?
≈ 潮水涨满，江面开阔，顺风里一片船帆高高挂着 | 潮平两岸阔 | 风正一帆悬
- 江水退去，船搁在岸边 ~opposite
- 风浪很大，船帆被吹得东倒西歪 ~opposite
?1 “海日生残夜”写的是什么时候的景色？ | At what hour is 海日生残夜?
≈ 夜快要过去、天将亮时，太阳从水面升起 | 海日生残夜 | 江春入旧年
% “残夜”是夜里剩下的最后一点，“海日生”是太阳从水面上升起来。夜还剩一点，太阳已经出来了，写的正是夜将尽、天快亮的时候。 | 残夜 is the last of the night, and 海日生 the sun rising from the water. A little night is left and the sun is already up: it is the hour when night ends and day breaks.
- 傍晚太阳落山的时候 ~opposite
- 正午阳光最强的时候 ~unsaid
?1 诗人是怎样赶路的？ | How does the poet travel?
= 坐船在绿水上前行 | 行舟绿水前 | 客路青山外
- 骑马走在青山里 ~unsaid
- 沿着江岸步行 ~unsaid
?2 “乡书何处达？归雁洛阳边”表达了诗人怎样的感情？ | What feeling is in the last two lines?
≈ 思念家乡，盼望北归的大雁把家信带回洛阳 | 乡书何处达 | 归雁洛阳边
% 诗人在旅途上问：家信该怎样送到？接着想到北归的大雁，盼它把信带到洛阳家乡。一问一盼，写出了漂泊在外的人对家乡的思念。 | On the road the poet asks how a letter home can reach it, then thinks of the wild geese flying north and hopes they will carry it to Luoyang. The question and the hope show a traveler's longing for home.
- 对旅途风景的厌倦 ~nomood
- 收到家信的欢喜 ~opposite
?2 “海日生残夜，江春入旧年”蕴含着什么道理？ | What truth lies in these lines?
≈ 新的事物在旧的还没过去时就已产生，时光不停地向前 | 海日生残夜 | 江春入旧年
% 夜还没完，太阳已经升起；旧年还没过完，江上已经有了春意。新的在旧的里面生出来，时光催着人向前，也让漂泊在外的诗人更想家。 | The night is not over and the sun is up; the old year is not out and spring is on the river. The new grows inside the old and time presses on, which makes the wanderer long for home the more.
- 太阳总是从海里升起来 ~face
- 坐船比走路快 ~unsaid
?2 全诗表达了诗人怎样的感情？ | What feeling does the whole poem carry?
≈ 漂泊在外的思乡之情 | 客路青山外 | 乡书何处达 | 归雁洛阳边
- 对战争的忧虑 ~nomood
- 和朋友分别的不舍 ~nomood

# 游山西村（宋·陆游）
莫笑农家腊酒浑，丰年留客足鸡豚。
山重水复疑无路，柳暗花明又一村。
箫鼓追随春社近，衣冠简朴古风存。
从今若许闲乘月，拄杖无时夜叩门。
注：腊酒，腊月里酿的酒。浑，浑浊。足鸡豚，准备了丰盛的鸡肉、猪肉。豚，小猪。山重水复，山一重重，水一道道。柳暗花明，柳色深绿，花色明艳。春社，古代春天祭祀土地神的节日。古风，古代淳朴的风气。若许，如果允许。闲乘月，趁着月色闲游。无时，没有定时，随时。叩门，敲门。
?1 “山重水复疑无路，柳暗花明又一村”写出了怎样的景色？ | What scene do the famous lines paint?
≈ 山水重重，好像没有路了，转过去却又看见柳绿花红的村庄 | 山重水复疑无路 | 柳暗花明又一村
- 一条笔直的大路 ~opposite
- 冬天光秃秃的山村 ~opposite
?1 农家用什么招待客人？ | What do the farmers offer?
= 腊酒和丰盛的鸡肉、猪肉 | 莫笑农家腊酒浑，丰年留客足鸡豚
- 清茶和点心 ~unsaid
- 鱼和米饭 ~unsaid
?1 “箫鼓追随春社近”写出了怎样的情景？ | What scene does “flutes and drums” give?
≈ 春社快到了，村里吹箫打鼓，热闹喜庆 | 箫鼓追随春社近 | 衣冠简朴古风存
- 村里正在办丧事 ~misread
- 村里安静得没有一点声音 ~opposite
?2 “莫笑农家腊酒浑”表现了农家怎样的心情？ | What does “don't laugh at the cloudy wine” show?
≈ 农家热情好客、真诚质朴 | 莫笑农家腊酒浑 | 丰年留客足鸡豚
- 农家很小气 ~opposite
- 农家怕客人笑话，不想留客 ~opposite
?2 “拄杖无时夜叩门”表达了诗人怎样的感情？ | What feeling is in “knocking at any hour”?
≈ 喜爱这里的农家生活，想以后常来 | 从今若许闲乘月 | 拄杖无时夜叩门
- 讨厌这个村庄 ~nomood
- 想马上离开 ~nomood
?2 全诗表达了诗人怎样的感情？ | What feeling does the whole poem carry?
≈ 对农村淳朴风俗和田园生活的喜爱 | 丰年留客足鸡豚 | 衣冠简朴古风存 | 拄杖无时夜叩门
- 对城市繁华的向往 ~nomood
- 对战乱的忧愁 ~nomood

# 闻王昌龄左迁龙标遥有此寄（唐·李白）
杨花落尽子规啼，闻道龙标过五溪。
我寄愁心与明月，随君直到夜郎西。
注：左迁，降职。龙标，地名，在今湖南。子规，杜鹃鸟。五溪，今湖南西部的五条溪水。夜郎，古地名，在今湖南西部。
?1 诗的第一句写了什么时节的景物？ | What season does the first line show?
≈ 暮春时节，杨花落尽，杜鹃在叫 | 杨花落尽子规啼
% 杨花是春天开的，“落尽”说它已经落完了，春天快要过去；这时又有子规在叫。所以写的是暮春，春天将尽的时候。 | Willow catkins belong to spring, and 落尽 says they have all fallen, so spring is nearly gone, and the cuckoo is calling. It is late spring, as spring draws to its end.
- 初春，柳树刚发芽 ~opposite
- 深秋，树叶都黄了 ~unsaid
?1 诗人听到了什么消息？ | What news does he hear?
= 王昌龄被贬到龙标，路上要经过五溪 | 闻道龙标过五溪
- 王昌龄要回京城做官 ~opposite
- 王昌龄要来看望诗人 ~unsaid
?1 诗人把自己的“愁心”托付给了谁？ | To whom does he entrust his sad heart?
= 明月 | 我寄愁心与明月 | 随君直到夜郎西
- 杨花 ~who
- 子规 ~who
?2 “我寄愁心与明月，随君直到夜郎西”表达了怎样的感情？ | What feeling is in the last two lines?
≈ 对朋友被贬的同情和深深的牵挂 | 我寄愁心与明月 | 随君直到夜郎西
- 为朋友去远方做官而高兴 ~opposite
- 对明月的赞美 ~face
?2 第一句写杨花落尽、子规啼叫，有什么作用？ | Why open with fallen catkins and a calling cuckoo?
≈ 用暮春的衰落和凄切的鸟叫，烘托离别的哀愁 | 杨花落尽子规啼 | 闻道龙标过五溪
% 杨花落尽，春天就要过去了；子规的叫声凄切，古诗里常和愁思连在一起。诗人把这样的景物写在听到朋友被贬的消息之前，正好烘托出他心里的哀伤。 | With the catkins gone, spring is passing, and the cuckoo's cry is mournful, often joined to sorrow in old poems. Set just before the news of his friend's banishment, the scene sets off the poet's grief.
- 说明诗人喜欢春天 ~nomood
- 交代王昌龄住在哪里 ~unsaid
?2 诗人为什么要把愁心寄给明月？ | Why send his sorrow by the moon?
≈ 明月两地都照得到，能一路陪着朋友，借它表达自己的牵挂 | 我寄愁心与明月 | 随君直到夜郎西
% 诗人不能陪朋友去远方，明月却同时照着两个地方，可以一路跟着朋友“直到夜郎西”。把愁心交给明月，就像自己陪着朋友走一样，写出了深深的牵挂。 | The poet cannot go with his friend, but the moon shines on both places and can follow him all the way west of Yelang. Giving his heart to the moon is like going with him himself: it shows how deeply he cares.
- 因为明月可以替他送信 ~face
- 因为夜里黑，诗人看不见路 ~unsaid

# 乌衣巷（唐·刘禹锡）
朱雀桥边野草花，乌衣巷口夕阳斜。
旧时王谢堂前燕，飞入寻常百姓家。
注：乌衣巷，在今江苏南京，东晋时王导、谢安等大族住在这里。朱雀桥，乌衣巷附近的一座桥。花，开花。王谢，指王导、谢安两大家族。寻常，平常。
?1 前两句写了哪些景物？ | What do the first two lines show?
= 桥边的野草野花和巷口的夕阳 | 朱雀桥边野草花，乌衣巷口夕阳斜
- 燕子和百姓家 ~other
- 高楼和行人 ~unsaid
?1 “野草花”和“夕阳斜”营造了怎样的气氛？ | What mood do the wild grass and setting sun make?
≈ 冷落、荒凉 | 朱雀桥边野草花 | 乌衣巷口夕阳斜
- 热闹、繁华 ~opposite
- 欢乐、喜庆 ~opposite
?1 诗中的燕子从哪里飞到了哪里？ | Where did the swallows fly from and to?
= 从王谢家族的堂前飞到了平常百姓家 | 旧时王谢堂前燕，飞入寻常百姓家
- 从百姓家飞到了王谢堂前 ~opposite
- 从南方飞到了北方 ~unsaid
?2 诗人借燕子想说明什么？ | What does the swallow say for the poet?
≈ 当年显赫的王谢大族早已衰落，世事变迁 | 旧时王谢堂前燕 | 飞入寻常百姓家
- 燕子喜欢住在百姓家 ~face
- 百姓家比王谢家更大 ~unsaid
?2 这首诗表达了诗人怎样的感情？ | What feeling does it carry?
≈ 对世事变化、繁华不再的感慨 | 野草花 | 夕阳斜 | 飞入寻常百姓家
- 对春天的喜爱 ~nomood
- 对朋友的思念 ~nomood
?2 “旧时”两个字有什么作用？ | What does 旧时 do?
≈ 点出今昔不同，燕子还是那样的燕子，主人却已经变了 | 旧时王谢堂前燕 | 飞入寻常百姓家
- 说明燕子很老了 ~literal
- 说明诗人很怀旧，喜欢旧东西 ~literal

# 登飞来峰（宋·王安石）
飞来山上千寻塔，闻说鸡鸣见日升。
不畏浮云遮望眼，自缘身在最高层。
注：飞来峰，在今浙江绍兴。千寻，古代八尺为一寻。闻说，听说。缘，因为。
?1 “千寻塔”写出了塔的什么特点？ | What does 千寻 give of the pagoda?
≈ 很高 | 飞来山上千寻塔 | 闻说鸡鸣见日升
% 一寻是八尺，“千寻”就有八千尺，这是夸张的说法；诗人又听说在塔上鸡一叫就能看见太阳升起，塔要非常高，才能比别处先看见日出。所以“千寻塔”写出了塔很高。 | A xun is eight chi, so a thousand xun is eight thousand chi, an overstatement; and the poet hears that from the pagoda one sees the sun rise at cockcrow, which only a very tall tower allows. So 千寻塔 says the pagoda is very tall.
- 很旧 ~unsaid
- 很多 ~literal
?1 “闻说鸡鸣见日升”写的是什么？ | What does the second line say?
= 听说在塔上鸡叫时就能看见太阳升起 | 闻说鸡鸣见日升
- 诗人听见了鸡叫 ~face
- 太阳落山了 ~opposite
?1 “浮云”在诗中指什么？ | What is the floating cloud?
≈ 表面指飘浮的云，也比喻遮挡视线的东西 | 不畏浮云遮望眼 | 自缘身在最高层
% 浮云会“遮望眼”，挡住人往远处看的眼睛；诗人说不怕它，是因为自己站在最高层。站得高就不怕被挡住，可见这里的浮云不只是天上的云，也比喻那些挡住人看清远处的东西。 | Floating clouds “block the gazing eye”, keeping one from seeing far; the poet does not fear them because he stands at the top. Standing high, one is not blocked, so the clouds are not only clouds in the sky but stand for whatever keeps one from seeing far and clear.
- 只是天上的云，没有别的意思 ~face
- 下雨的乌云 ~unsaid
?2 “不畏浮云遮望眼，自缘身在最高层”说明了什么道理？ | What truth do the last lines tell?
≈ 站得高才能看得远，不被眼前的东西迷惑 | 不畏浮云遮望眼 | 自缘身在最高层
- 登山很危险 ~nomood
- 云彩会遮住太阳 ~face
?2 这首诗表现了诗人怎样的情怀？ | What spirit does the poem show?
≈ 积极进取、不怕困难的豪情 | 不畏浮云遮望眼 | 自缘身在最高层
- 对登山的害怕 ~nomood
- 对世事的灰心 ~nomood
?2 诗中哪个词最能表现诗人的气魄？ | Which word shows his spirit best?
= 不畏 | 不畏浮云遮望眼
- 闻说 ~notlyric
- 千寻 ~notlyric

# 天净沙·秋思（元·马致远）
枯藤老树昏鸦，小桥流水人家，古道西风瘦马。
夕阳西下，断肠人在天涯。
注：天净沙，曲牌名。昏鸦，黄昏时的乌鸦。天涯，离家乡很远的地方。
?1 前三句写了哪些景物？ | What things do the first three lines set out?
= 枯藤、老树、昏鸦、小桥、流水、人家、古道、西风、瘦马 | 枯藤老树昏鸦 | 小桥流水人家 | 古道西风瘦马
- 高山、大海、白帆 ~unsaid
- 春花、绿柳、燕子 ~opposite
?1 这首曲写的是一天中的什么时候？ | What hour of the day is it?
≈ 黄昏 | 夕阳西下 | 枯藤老树昏鸦
% “夕阳西下”是太阳正往西边落下去，前面又写了黄昏时的乌鸦。太阳落山、乌鸦归巢，正是一天里的黄昏。 | 夕阳西下 is the sun sinking in the west, and before it come the crows of dusk. Sunset and crows going home: it is evening.
- 清晨 ~opposite
- 半夜 ~unsaid
?1 “断肠人”指的是什么人？ | Who is the 断肠人?
≈ 漂泊在远方、伤心到极点的旅人 | 断肠人在天涯 | 古道西风瘦马
% “断肠”是说伤心得肠子都要断了，形容悲伤到了极点；这个人在“天涯”，离家乡很远，前面又写他骑着瘦马走在古道上，迎着西风。所以“断肠人”是漂泊在外、思念家乡、伤心到极点的旅人。 | 断肠, a broken gut, is grief at its utmost; this person is at the edge of the world, far from home, and before that rides a thin horse on an old road into the west wind. So the 断肠人 is a traveler far from home, grieving beyond measure.
- 肚子疼得厉害的人 ~face
- 住在小桥边的人家 ~who
?2 “小桥流水人家”和其他景物有什么不同？起什么作用？ | How does 小桥流水人家 differ from the rest, and why is it there?
≈ 它温暖安宁，反衬出旅人无家可归的凄凉 | 小桥流水人家 | 断肠人在天涯
% 枯藤、老树、昏鸦、古道、西风、瘦马都是冷落凄凉的，只有“小桥流水人家”写的是别人安宁温暖的家。旅人看着别人的家，更想到自己远在天涯，这样一衬，更显出他的孤独凄凉。 | Withered vines, old trees, evening crows, the old road, the west wind and the thin horse are all bleak; only 小桥流水人家 shows a quiet, warm home, someone else's. Looking at it, the traveler thinks of himself far away, and the contrast deepens his loneliness.
- 说明旅人已经回到家了 ~opposite
- 写出了秋天的热闹 ~nomood
?2 这首曲表达了怎样的感情？ | What feeling does the song carry?
≈ 漂泊天涯的游子思念家乡的悲凉 | 断肠人在天涯 | 夕阳西下
- 秋天出游的快乐 ~nomood
- 对秋天丰收的喜悦 ~nomood
?2 前三句只摆出一个个景物，为什么读来很悲凉？ | The first lines only set things out; why do they read so sad?
≈ 这些景物都带着冷落、衰败的色彩，景中含着情 | 枯藤老树昏鸦 | 古道西风瘦马
% 藤是枯的，树是老的，鸦是黄昏的，风是西风，马是瘦马，每样景物都带着秋天的冷落和衰败。作者把心里的悲凉放进这些景物里，读的人一看就感受到了。 | The vine is withered, the tree old, the crows of dusk, the wind from the west, the horse thin: each thing bears autumn's bleakness and decay. The writer puts his sorrow into them, and the reader feels it at a glance.
- 因为曲中写了下雨 ~unsaid
- 因为这些景物都很热闹 ~opposite

# 夜上受降城闻笛（唐·李益）
回乐烽前沙似雪，受降城外月如霜。
不知何处吹芦管，一夜征人尽望乡。
注：受降城，唐代修筑的城，在今内蒙古一带。回乐烽，回乐县附近的烽火台。芦管，用芦苇做的乐器。
?1 前两句写了怎样的景色？ | What scene do the first two lines show?
≈ 月光下，沙地白得像雪，月色冷得像霜 | 回乐烽前沙似雪 | 受降城外月如霜
- 白天里黄沙漫天 ~opposite
- 下了一场大雪，城外白茫茫一片 ~face
?1 征人听到了什么声音？ | What sound do the soldiers hear?
= 不知从哪里传来的芦管声 | 不知何处吹芦管
- 战鼓声 ~unsaid
- 家人的呼唤 ~unsaid
?1 “一夜征人尽望乡”中，望乡的是哪些人？ | Who look toward home?
≈ 所有守边的将士 | 一夜征人尽望乡 | 受降城外月如霜
% “征人”是出征在外的人，他们在边塞的受降城外守着；“尽”是全、都。“征人尽望乡”，就是守边的将士全都在望着家乡。 | 征人 are men away at war, here guarding the frontier at Shouxiang; 尽 is “all”. So all the soldiers on the frontier are gazing toward home.
- 只有吹芦管的那个人 ~part
- 城里的百姓 ~who
?2 这首诗表达了怎样的感情？ | What feeling does the poem carry?
≈ 守边将士浓浓的思乡之情 | 一夜征人尽望乡 | 不知何处吹芦管
- 打了胜仗的欢喜 ~nomood
- 对边塞风光的喜爱 ~nomood
?2 “沙似雪”“月如霜”给全诗定下了怎样的气氛？ | What mood do sand like snow and moon like frost set?
≈ 清冷、凄凉，引出思乡的愁绪 | 回乐烽前沙似雪 | 受降城外月如霜
- 热闹、欢快 ~opposite
- 温暖、舒适 ~opposite
?2 诗中的芦管声起了什么作用？ | What does the reed pipe do in the poem?
≈ 勾起了将士们的思乡之情 | 不知何处吹芦管 | 一夜征人尽望乡
% 芦管声不知从哪里传来，将士们听了，一整夜都望着家乡。是这乐声把他们心里的乡愁勾了起来。 | The pipe sounds from who knows where, and hearing it, the soldiers gaze toward home all night. The music stirs the homesickness in their hearts.
- 召集将士们去打仗 ~unsaid
- 让将士们睡得更香 ~opposite

# 钱塘湖春行（唐·白居易）
孤山寺北贾亭西，水面初平云脚低。
几处早莺争暖树，谁家新燕啄春泥。
乱花渐欲迷人眼，浅草才能没马蹄。
最爱湖东行不足，绿杨阴里白沙堤。
注：钱塘湖，就是杭州西湖。孤山寺，在西湖孤山上。贾亭，亭名。白沙堤，就是白堤。
?1 诗中写了哪些鸟在做什么？ | What birds are busy, and at what?
≈ 早来的黄莺争着飞上向阳的树，新来的燕子在啄泥筑巢 | 几处早莺争暖树 | 谁家新燕啄春泥
- 大雁成群地往南飞 ~unsaid
- 白鹭站在湖边捉鱼 ~unsaid
?1 “浅草才能没马蹄”中的“没”是什么意思？ | What does 没 mean here?
≈ 遮住，盖住 | 浅草才能没马蹄 | 乱花渐欲迷人眼
% 这里的“没”读 mò。草刚长出来还浅，“才能”到马蹄那么高，刚好把马蹄盖住；和上句花多得快要迷住人的眼睛对着写，说的是早春草木刚刚茂盛起来。讲成“没有”，就成了草没有马蹄，讲不通。 | Here 没 is read mò. The grass is new and short, just high enough to reach the hoofs and cover them; paired with the flowers about to dazzle the eye, it shows plants just coming into growth in early spring. As “not have”, the grass would have no hoofs, which makes no sense.
- 没有 ~modern
- 淹死 ~sense
?1 诗人最喜欢哪里的景色？ | Which view does the poet love most?
= 湖东绿杨树荫下的白沙堤 | 最爱湖东行不足 | 绿杨阴里白沙堤
- 孤山寺 ~other
- 贾亭 ~other
?2 “早莺”“新燕”“浅草”写出了什么季节的特点？ | What season do early orioles, new swallows and short grass show?
≈ 早春：万物刚刚苏醒，春意初生 | 几处早莺争暖树 | 浅草才能没马蹄
% “早”“新”“浅”都说明春天刚来不久：莺是早来的，燕是新来的，草还浅浅的。所以写的是早春，春意刚刚生出来的时候。 | 早, 新 and 浅 all say spring has just come: the orioles are early, the swallows new, the grass still short. It is early spring, as spring first stirs.
- 盛夏，草木茂盛 ~opposite
- 深秋，草木凋零 ~opposite
?2 全诗表达了诗人怎样的感情？ | What feeling does the poem carry?
≈ 对西湖早春美景的喜爱 | 最爱湖东行不足 | 乱花渐欲迷人眼
- 离开家乡的伤心 ~nomood
- 对春天就要过去的惋惜 ~nomood
?2 “最爱湖东行不足”中的“行不足”表现了诗人怎样的心情？ | What does 行不足 show of his mood?
≈ 怎么游也游不够，十分喜爱，舍不得离开 | 最爱湖东行不足 | 绿杨阴里白沙堤
% “行”是走、游，“不足”是不够。诗人说自己“最爱”湖东，在绿杨树荫下的白沙堤上怎么走也走不够，写出了他对这里的喜爱，舍不得离开。 | 行 is walking, roaming, and 不足 “not enough”. He loves the east of the lake most and cannot walk the white sand dike under the willows enough: he loves it and cannot bear to leave.
- 走累了，不想再走 ~literal
- 路太短，走不过去 ~literal

# 使至塞上（唐·王维）
单车欲问边，属国过居延。
征蓬出汉塞，归雁入胡天。
大漠孤烟直，长河落日圆。
萧关逢候骑，都护在燕然。
注：使，出使。单车，一辆车，指随从不多。属国，这里指使者。居延，地名，在今甘肃一带。征蓬，随风飘飞的蓬草。胡天，西北边地的天空。萧关，关名。候骑，侦察的骑兵。都护，边疆的长官。燕然，山名，这里指前线。
?1 “大漠孤烟直，长河落日圆”写出了怎样的景色？ | What scene do these lines paint?
≈ 广阔的沙漠上一缕烟直直升起，长长的河上落日又大又圆 | 大漠孤烟直 | 长河落日圆
- 江南小桥流水的景色 ~never
- 城里热闹的街市 ~never
?1 诗人拿什么来比自己？ | What does the poet liken himself to?
≈ 随风飘飞的蓬草和飞进胡地的大雁 | 征蓬出汉塞 | 归雁入胡天
% 诗人是出使边塞的人，正从汉地走进胡地。这两句写蓬草飘出汉塞、大雁飞进胡天，走的正是诗人走的路，所以是拿它们比自己。 | The poet is an envoy to the frontier, passing from Han land into the land beyond. These lines have the tumbleweed drift out past the Han forts and the geese fly into the northern sky, the very road he travels, so they stand for himself.
- 天上的落日 ~who
- 边塞的长河 ~who
?1 诗人这次出使是去做什么？ | What is the poet's errand?
≈ 到边塞去慰问将士 | 单车欲问边 | 萧关逢候骑，都护在燕然
% “问边”的“边”是边塞，“问”是慰问、看望；他一路经过居延、萧关，都是边地，又打听到都护在前线。所以这次出使是到边塞去慰问守边的将士。 | In 问边, 边 is the frontier and 问 is to call on and comfort; he passes Juyan and Xiao Pass, frontier places, and learns the commander is at the front. So his errand is to comfort the troops on the frontier.
- 带兵到边塞去打仗 ~misread
- 到边塞去游玩 ~unsaid
?2 “大漠孤烟直，长河落日圆”好在哪里？ | What is fine in these lines?
≈ 用“直”“圆”写出边塞的空旷壮阔，景象雄奇 | 大漠孤烟直 | 长河落日圆
% 大漠一望无边，只有一缕烟直直地升起；长河远远流去，落日显得又大又圆。一个“直”、一个“圆”，把边塞空旷壮阔的景色写得十分雄奇。 | The desert stretches without end, with one plume of smoke rising straight; the long river runs far off, and the setting sun looks huge and round. 直 and 圆 make the vast, empty frontier grand and striking.
- 写出了沙漠里很冷 ~unsaid
- 写出了诗人迷了路 ~unsaid
?2 “征蓬出汉塞，归雁入胡天”透出诗人怎样的心情？ | What mood shows in these lines?
≈ 像飘飞的蓬草一样漂泊在外，有些孤独、失落 | 征蓬出汉塞 | 单车欲问边
% 蓬草随风飘飞，自己做不了主；诗人“单车”出使，随从很少，一路走向遥远的边地。拿蓬草比自己，透出了孤独和漂泊的失落。 | Tumbleweed drifts where the wind takes it; the poet travels with a single carriage and few men toward the far frontier. Likening himself to the tumbleweed shows his loneliness and the sense of being cast adrift.
- 回到家乡的欢喜 ~opposite
- 和朋友相聚的快乐 ~nomood
?2 全诗表达了诗人怎样的感情？ | What feeling does the whole poem carry?
≈ 有漂泊的孤独，更有对边塞壮美景色的赞叹 | 征蓬出汉塞 | 大漠孤烟直 | 长河落日圆
- 对打仗的害怕 ~nomood
- 对家乡亲人的抱怨 ~nomood
`;
