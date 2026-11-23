// The clues of the gap sentences of the level 8 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelEightClues are the clues of the gap sentences of the level 8 words, by clueKey, each word's sentence counted as 1. */
export const levelEightClues = parseClues(`
街坊/1 | 在胡同住二十年都很熟的人 | Old neighbours, so the word must mean neighbours.
左邻右舍/1 | 有困难都找热心的王大妈 | The people next door, so the word must mean neighbours on all sides.
挨家挨户/1 | 一家一家通知明天停水 | Door to door, so the word must mean from house to house.
业主/1 | 楼里的房主开会讨论装电梯 | Flat owners, so the word must mean property owner.
坊间/1 | 民间流传老桥的故事 | Among the people, so the word must mean in the streets.
牌坊/1 | 村口刻着大字的石门 | A memorial arch, so the word must mean memorial archway.
远亲不如近邻/1 | 半夜邻居送孩子去医院 | A near neighbour helps most, so the word must mean a near neighbour is better than a distant relative.
守望相助/1 | 谁家有事大家都来帮忙 | Watching out for each other, so the word must mean to keep watch and help one another.
热心肠/1 | 常帮邻居修自行车 | A warm heart, so the word must mean warm-hearted person.
社区服务/1 | 中心为老人理发送饭 | Community help, so the word must mean community service.
携手/1 | 两个社区一起办活动 | Hand in hand, so the word must mean to join hands.
给予/1 | 学校给学生帮助和鼓励 | Giving help, so the word must mean to give.
赋予/1 | 法律给每个公民受教育的权利 | Conferring a right, so the word must mean to endow.
支撑/1 | 几根木头撑着旧房子 | Holding it up, so the word must mean to support.
撑腰/1 | 有大家支持他才敢说出来 | Backing him up, so the word must mean to back up.
帮扶/1 | 大学生长期帮山区孩子 | Helping the needy, so the word must mean to assist.
提携/1 | 他的成绩离不开老师的 | Mentoring, so the word must mean to guide and support.
携带/1 | 坐飞机不能带太多液体 | Carrying, so the word must mean to carry.
伸出援手/1 | 老人摔倒，路人纷纷 | Lending a hand, so the word must mean to lend a hand.
互帮互助/1 | 同学们全班成绩提高 | Helping each other, so the word must mean to help one another.
倡议/1 | 学生会请大家节约用水 | A proposal, so the word must mean proposal.
倡导/1 | 学校一直鼓励光盘行动 | Promoting, so the word must mean to advocate.
提倡/1 | 医生建议每天走路半小时 | Recommending, so the word must mean to encourage.
呼吁/1 | 环保组织请人少用塑料袋 | An appeal, so the word must mean to appeal.
响应/1 | 居民积极回应号召 | Answering the call, so the word must mean to respond.
发起/1 | 捐书活动由中学生开始 | Launched by students, so the word must mean to initiate.
动员/1 | 社区组织居民一起打扫 | Mobilising, so the word must mean to mobilise.
联名/1 | 几十位家长一起签名写信 | Jointly signed, so the word must mean jointly.
征集/1 | 图书馆收集老照片 | Collecting, so the word must mean to collect.
公益广告/1 | 地铁里提醒给老人让座 | A public service ad, so the word must mean public service advertisement.
蓬勃/1 | 兴趣小组发展得很好 | Flourishing, so the word must mean vigorous.
朝气蓬勃/1 | 打篮球的年轻人 | Full of youthful energy, so the word must mean full of vigour.
生机勃勃/1 | 春天公园里的树木花草 | Full of life, so the word must mean full of life.
兴致勃勃/1 | 孩子们听老爷爷讲历史 | Eagerly, so the word must mean full of enthusiasm.
欣欣向荣/1 | 老街商店越开越多 | Thriving, so the word must mean flourishing.
尤其/1 | 冬天很冷，特别是晚上 | Especially at night, so the word must mean especially.
尤为/1 | 问题在老城区特别突出 | Particularly, so the word must mean particularly.
热火朝天/1 | 一个上午就把公园打扫干净 | In full swing, so the word must mean bustling with activity.
红红火火/1 | 一家把小饭馆开得 | Prospering, so the word must mean thriving.
蒸蒸日上/1 | 公司员工已有一百多人 | Rising daily, so the word must mean flourishing.
悲惨/1 | 孤儿的童年观众看哭了 | A tragic childhood, so the word must mean tragic.
惨重/1 | 大火造成的损失 | Heavy losses, so the word must mean heavy.
艰难/1 | 那几年家里穷日子过得 | Hard times, so the word must mean difficult.
艰苦/1 | 山区学校冬天没暖气 | Harsh conditions, so the word must mean harsh.
艰辛/1 | 父母养活全家吃尽了 | Hardships, so the word must mean hardship.
艰巨/1 | 修山区公路这项任务 | A huge task, so the word must mean arduous.
艰险/1 | 登山队员不怕 | Dangers, so the word must mean danger and difficulty.
悲哀/1 | 失去梦想最大的 | Sorrow, so the word must mean sorrow.
发愁/1 | 为找不到便宜房子 | Worrying, so the word must mean to worry.
愁眉苦脸/1 | 考试没考好一整天都 | A gloomy face, so the word must mean worried-looking.
怜悯/1 | 他需要工作机会而不是 | Pity, so the word must mean pity.
体恤/1 | 老板下雨天让大家早回家 | Considerate, so the word must mean to show sympathy for.
慷慨/1 | 常常把书借给同学 | Generous, so the word must mean generous.
感慨/1 | 回到家乡万千 | Moved, so the word must mean to sigh with emotion.
乞讨/1 | 在街头要钱的人 | Begging, so the word must mean to beg.
乞求/1 | 用眼神求妈妈再玩一会儿 | Pleading, so the word must mean to beg for.
哀求/1 | 小狗叫着让主人开门 | Begging piteously, so the word must mean to implore.
孤寡老人/1 | 社区为他们安装呼叫器 | Lonely elderly, so the word must mean old people living alone.
多寡/1 | 捐款不论多少 | How much, so the word must mean amount.
善举/1 | 把奖金捐给学校感动很多人 | A kind act, so the word must mean good deed.
愤怒/1 | 有人往河里倒垃圾村民 | Angry villagers, so the word must mean angry.
气愤/1 | 他说话不算数让大家 | Indignant, so the word must mean indignant.
公愤/1 | 工厂偷排污水引起 | Public anger, so the word must mean public outrage.
愤愤不平/1 | 觉得比赛结果不公平 | Resentful, so the word must mean indignant.
悲愤/1 | 看到被烧光的森林 | Grief and anger, so the word must mean grief and indignation.
发愤图强/1 | 家里穷于是努力考上大学 | Striving hard, so the word must mean to work hard to improve.
仇恨/1 | 只会带来更多痛苦 | Hatred, so the word must mean hatred.
记仇/1 | 吵完架第二天就和好 | Not holding grudges, so the word must mean to bear a grudge.
敌意/1 | 新来的猫对家里的狗 | Hostility, so the word must mean hostility.
敌视/1 | 两个村子过去互相 | Hostile to each other, so the word must mean to be hostile to.
辱骂/1 | 在网上骂别人不文明 | Abuse online, so the word must mean to insult.
骂人/1 | 有话好好说不要 | Swearing at people, so the word must mean to call names.
挨骂/1 | 打破杯子怕被说 | Getting scolded, so the word must mean to be scolded.
嚷嚷/1 | 别在楼道里大声 | Shouting, so the word must mean to shout.
吵嚷/1 | 门外为停车位争吵的声音 | Clamour, so the word must mean clamour.
起哄/1 | 他上台唱歌台下有人 | Jeering, so the word must mean to heckle.
哄骗/1 | 打电话骗老人汇钱 | Tricking, so the word must mean to cheat.
哄/1 | 妈妈把哭闹的孩子弄睡了 | Soothing, so the word must mean to coax.
哄堂大笑/1 | 一句话让全班同学 | The whole room laughed, so the word must mean to burst into laughter.
口角/1 | 两位邻居因小事 | A quarrel, so the word must mean quarrel.
阻拦/1 | 她要去山区支教，家里人谁也 | Stopping her, so the word must mean to stop.
阻止/1 | 老师及时停住两个学生的争吵 | Preventing a fight, so the word must mean to prevent.
阻碍/1 | 交通不便影响山村发展 | Hindering, so the word must mean to hinder.
妨碍/1 | 车不要挡住别人通行 | Obstructing, so the word must mean to obstruct.
不妨/1 | 周末有空可以来看看 | Might as well, so the word must mean might as well.
阻力/1 | 改革总会遇到 | Resistance, so the word must mean resistance.
阻挡/1 | 大雨也挡不住志愿者的热情 | Holding back, so the word must mean to block.
劝阻/1 | 保安上前劝人不要下水 | Dissuading, so the word must mean to dissuade.
拦截/1 | 门卫拦住了外来汽车 | Intercepting, so the word must mean to intercept.
拦路虎/1 | 生词是阅读中最大的 | An obstacle, so the word must mean stumbling block.
闯红灯/1 | 不管有没有车都不能 | Running a red light, so the word must mean to run a red light.
闯祸/1 | 小猫把花瓶推到地上 | Making trouble, so the word must mean to cause trouble.
闯入/1 | 野猪跑进了菜地 | Breaking in, so the word must mean to burst in.
插队/1 | 大家排队请不要 | Jumping the queue, so the word must mean to cut in line.
随地吐痰/1 | 公共场所会传播疾病 | Spitting, so the word must mean to spit anywhere.
违章停车/1 | 车停在消防通道被罚款 | Illegal parking, so the word must mean illegal parking.
公德心/1 | 爱护公共设施的表现 | Public spirit, so the word must mean civic virtue.
不文明/1 | 在景区墙上乱刻乱画 | Uncivilised behaviour, so the word must mean uncivilised.
高空抛物/1 | 小小的苹果也可能砸伤人 | Throwing from height, so the word must mean throwing objects from buildings.
破坏公物/1 | 在公园椅子上乱刻名字 | Vandalism, so the word must mean damaging public property.
掩盖/1 | 谎言盖不住事实 | Covering up, so the word must mean to cover up.
掩饰/1 | 笑了笑想藏住紧张 | Hiding nerves, so the word must mean to disguise.
遮掩/1 | 有问题说出来不必 | Concealing, so the word must mean to conceal.
遮挡/1 | 大树挡住了阳光 | Blocking light, so the word must mean to block.
遮盖/1 | 白雪盖住了整个院子 | Covered with snow, so the word must mean to cover.
遮阳/1 | 夏天出门戴一顶帽子 | A sun hat, so the word must mean to shade from the sun.
掩耳盗铃/1 | 把问题藏起来不去解决 | Fooling oneself, so the word must mean to bury one's head in the sand.
掩人耳目/1 | 换个名字继续卖假货 | To mislead others, so the word must mean to deceive the public.
遮风挡雨/1 | 小屋为过路人 | Shelter, so the word must mean to shelter from wind and rain.
掩面/1 | 她用手捂脸哭了起来 | Covering her face, so the word must mean to cover one's face.
诱惑/1 | 网络游戏的 | Temptation, so the word must mean temptation.
引诱/1 | 用高额回报吸引人投资 | Luring, so the word must mean to lure.
诱骗/1 | 以免费送礼物骗老人 | Tricking, so the word must mean to trick.
诱导/1 | 老师耐心引导学生找答案 | Guiding, so the word must mean to guide.
诱人/1 | 面包店传出的香味 | Tempting, so the word must mean tempting.
盗贼/1 | 偷走名画的人被抓到 | A thief, so the word must mean thief.
窃贼/1 | 装了摄像头以后不敢来 | Burglars, so the word must mean thief.
做贼心虚/1 | 一看见警察就跑 | A guilty conscience, so the word must mean to have a guilty conscience.
上当受骗/1 | 陌生电话先核实以免 | Being taken in, so the word must mean to be deceived.
防不胜防/1 | 骗子手段越来越多 | Impossible to guard against, so the word must mean hard to guard against.
狭隘/1 | 只看到自己的利益 | Narrow-minded, so the word must mean narrow.
狭小/1 | 一家五口住的房间 | Cramped, so the word must mean cramped.
狭义/1 | 文化指文学、艺术等 | The narrow sense, so the word must mean narrow sense.
广义/1 | 文化包括人类创造的一切 | The broad sense, so the word must mean broad sense.
以貌取人/1 | 穿着简单的人也可能有学问 | Judging by looks, so the word must mean to judge by appearance.
另眼相看/1 | 表现出色大家都 | Seeing him anew, so the word must mean to view in a new light.
排外/1 | 小镇欢迎新来的居民 | Not xenophobic, so the word must mean exclusive, xenophobic.
排斥/1 | 新同学不应该受到 | Exclusion, so the word must mean to exclude.
坐井观天/1 | 不出去看看世界 | A narrow view, so the word must mean to look at the sky from a well.
少见多怪/1 | 大城市很常见你却惊讶 | Easily surprised, so the word must mean to be surprised by the ordinary.
陷入/1 | 工厂关门一家人困境 | Falling into trouble, so the word must mean to fall into.
深陷/1 | 债务之中每天发愁 | Deep in debt, so the word must mean to be deeply mired.
缺陷/1 | 汽车有设计问题全部召回 | A defect, so the word must mean defect.
诬陷/1 | 被人说偷了钱，监控证明清白 | Framed, so the word must mean to frame.
陷害/1 | 坏人想害主人公 | Setting a trap, so the word must mean to frame.
避免/1 | 为了不迟到提前出门 | Avoiding, so the word must mean to avoid.
回避/1 | 面对记者的问题没有躲开 | Dodging a question, so the word must mean to evade.
逃避/1 | 遇到困难不能 | Running away, so the word must mean to escape.
避难/1 | 地震后到公园空地上 | Taking refuge, so the word must mean to take refuge.
避风港/1 | 家是孩子心中的 | A safe haven, so the word must mean haven.
挽救/1 | 医生抢救救回他的生命 | Saving a life, so the word must mean to save.
挽回/1 | 道歉希望朋友再信任 | Winning back, so the word must mean to retrieve.
挽留/1 | 老师要走，同学们一再 | Asking to stay, so the word must mean to urge to stay.
毁坏/1 | 有人故意破坏花草 | Damaging, so the word must mean to damage.
毁灭/1 | 不保护环境人类会 | Destruction, so the word must mean to destroy.
烧毁/1 | 大火烧掉百年老屋 | Burned down, so the word must mean to burn down.
损毁/1 | 台风过后房屋不同程度 | Damage, so the word must mean damage.
销毁/1 | 过期药品统一处理掉 | Disposed of, so the word must mean to destroy.
毁约/1 | 对方突然不守合同 | Breaking a deal, so the word must mean to break a contract.
前功尽弃/1 | 练了半年现在放弃 | All effort wasted, so the word must mean to waste all previous efforts.
弱势群体/1 | 老人、残疾人等需要关心 | The vulnerable, so the word must mean vulnerable groups.
无家可归/1 | 地震过后住在帐篷里 | Homeless, so the word must mean homeless.
流浪/1 | 好心人带回家的猫 | A stray, so the word must mean to wander.
救助站/1 | 天冷上街寻找需要帮助的人 | A shelter, so the word must mean relief station.
网络暴力/1 | 网上骂人、公开隐私 | Cyberbullying, so the word must mean online abuse.
贫困户/1 | 村里靠养蜂过上好日子 | Poor households, so the word must mean poor household.
城中村/1 | 打工的人住在租金便宜的 | Urban villages, so the word must mean urban village.
外来人口/1 | 已经超过本地人口 | Migrants, so the word must mean migrant population.
民生/1 | 住房、教育、医疗 | People's livelihood, so the word must mean livelihood.
二手烟/1 | 也会伤害身边的人 | Passive smoke, so the word must mean second-hand smoke.
基础/1 | 学好数学先要打好 | Foundations, so the word must mean foundation.
基础知识/1 | 天文学的入门内容 | Basics, so the word must mean basic knowledge.
基础研究/1 | 改变生活的发明来自几十年前的 | Basic science, so the word must mean basic research.
基础设施/1 | 农村的道路、供水 | Infrastructure, so the word must mean infrastructure.
地基/1 | 盖高楼先要打牢 | Building foundations, so the word must mean foundation.
根基/1 | 老店能开一百年靠诚信 | A firm basis, so the word must mean foundation.
基石/1 | 教育是国家发展的 | A cornerstone, so the word must mean cornerstone.
步骤/1 | 做实验要严格按照 | Steps, so the word must mean step.
骤然/1 | 一进山洞气温下降 | Suddenly, so the word must mean suddenly.
由浅入深/1 | 教材适合初学者 | From easy to hard, so the word must mean from the simple to the deep.
详细/1 | 把事情经过说一遍 | In detail, so the word must mean detailed.
详尽/1 | 报告提供的数据 | Exhaustive data, so the word must mean exhaustive.
详实/1 | 传记资料很可信 | Full and accurate, so the word must mean detailed and accurate.
详情/1 | 活动的具体内容看网站 | Details, so the word must mean details.
详略得当/1 | 作文重点很突出 | Well balanced, so the word must mean well balanced in detail.
仔细/1 | 交卷之前再检查一遍 | Carefully, so the word must mean careful.
细致/1 | 她做事从来不出错 | Meticulous, so the word must mean meticulous.
彻底/1 | 大扫除把教室打扫一遍 | Thoroughly, so the word must mean thorough.
透彻/1 | 难题分析得非常 | Penetrating, so the word must mean thorough.
彻夜/1 | 为了完成实验他们工作 | All night, so the word must mean all night.
特殊/1 | 这种花需要的照顾 | Special care, so the word must mean special.
殊途同归/1 | 不同方法得出相同结论 | Same end, so the word must mean different roads to the same end.
悬殊/1 | 两队实力差得太远 | A huge gap, so the word must mean wide disparity.
罕见/1 | 全世界只有几百个病例 | Rare, so the word must mean rare.
罕有/1 | 几十年没有过的大雪 | Seldom seen, so the word must mean rare.
稀罕/1 | 谁要你的东西 | Caring about it, so the word must mean to value, care for.
人迹罕至/1 | 深山里发现新植物 | Untrodden, so the word must mean rarely visited.
广泛/1 | 从小学生到老人都爱看 | Wide readership, so the word must mean wide.
宽泛/1 | 题目太大要缩小范围 | Too broad, so the word must mean broad.
空泛/1 | 文章不能只讲道理没例子 | Vague, so the word must mean empty.
追踪/1 | 给候鸟戴定位器 | Tracking birds, so the word must mean to track.
跟踪/1 | 医生长期观察病人恢复 | Following up, so the word must mean to follow.
踪迹/1 | 雪地上小动物留下的 | Tracks, so the word must mean trace.
踪影/1 | 找了半天不见小狗 | No sign, so the word must mean trace.
失踪/1 | 多年找不到的飞机 | Missing, so the word must mean to go missing.
无影无踪/1 | 太阳出来雾就消失 | Without a trace, so the word must mean without a trace.
溯源/1 | 扫码查大米的产地 | Tracing the origin, so the word must mean to trace the source.
摘录/1 | 在笔记本上记下好句子 | Extracting, so the word must mean to excerpt.
摘抄/1 | 每天抄一段优美文字 | Copying passages, so the word must mean to copy out.
摘要/1 | 论文前面两百字概括全文 | An abstract, so the word must mean abstract.
提纲/1 | 写作文前先列 | An outline, so the word must mean outline.
大纲/1 | 课程的教学安排 | A syllabus, so the word must mean syllabus.
纲要/1 | 学校未来五年的发展 | An outline plan, so the word must mean programme.
综述/1 | 总结近十年研究成果的文章 | A review, so the word must mean review.
选题/1 | 论文成功的一半 | Choosing a topic, so the word must mean choice of topic.
开题报告/1 | 研究生先通过才能开始研究 | A research proposal, so the word must mean proposal report.
结题/1 | 课题研究三年终于完成 | Concluding a project, so the word must mean to conclude a project.
立项/1 | 研究项目获得经费批准 | Approved, so the word must mean to approve a project.
经费/1 | 缺少钱研究停了下来 | Funding, so the word must mean funds.
资助/1 | 基金会帮助贫困大学生 | Sponsoring, so the word must mean to fund.
函数/1 | 图像可以是直线也可以是曲线 | A function, so the word must mean function.
一次函数/1 | 图像是一条直线 | A straight-line graph, so the word must mean linear function.
自变量/1 | 研究温度的影响，温度是 | The thing you change, so the word must mean independent variable.
因变量/1 | 研究温度的影响，植物高度是 | The thing you measure, so the word must mean dependent variable.
坐标/1 | 用经度和纬度确定一个地方 | Position, so the word must mean coordinate.
矩阵/1 | 电脑把图片看成数字组成的 | A grid of numbers, so the word must mean matrix.
矩形/1 | 足球场是一个大大的 | A rectangle, so the word must mean rectangle.
斜率/1 | 直线往右上升得越快越大 | Steepness, so the word must mean slope.
平均数/1 | 二、三、七加起来除以三 | The mean, so the word must mean average.
中位数/1 | 二、三、七中间那个 | The middle value, so the word must mean median.
贯穿/1 | 环保理念从头到尾 | Running throughout, so the word must mean to run through.
连贯/1 | 文章前后不接得上 | Coherent, so the word must mean coherent.
一贯/1 | 认真负责是他的作风 | Consistent, so the word must mean consistent.
一以贯之/1 | 对真理的追求几十年没变 | Consistently, so the word must mean consistently.
贯彻/1 | 学校认真执行安全第一 | Implementing, so the word must mean to implement.
贯通/1 | 高铁全线打通 | Linked up, so the word must mean to link up.
融会贯通/1 | 学知识不能死记硬背 | Understanding thoroughly, so the word must mean to master thoroughly.
全神贯注/1 | 看显微镜没发现有人进来 | Absorbed, so the word must mean wholly absorbed.
聚精会神/1 | 同学们专心听讲 | Attentive, so the word must mean attentively.
一心一意/1 | 退休后专心研究家乡历史 | Wholeheartedly, so the word must mean wholeheartedly.
搞清楚/1 | 下结论前先弄明白事实 | Getting it clear, so the word must mean to figure out.
搞错/1 | 对不起我弄错了你的名字 | A mistake, so the word must mean to get wrong.
搞定/1 | 这个问题我一个人就能 | Sorted, so the word must mean to sort out.
搞好/1 | 大家团结能把活动办好 | Doing well, so the word must mean to do well.
搞笑/1 | 动画片孩子们笑个不停 | Funny, so the word must mean funny.
搞砸/1 | 太紧张把面试 | Messed up, so the word must mean to mess up.
深究/1 | 原因值得深入研究 | Probing deeper, so the word must mean to probe.
推敲/1 | 每个句子反复斟酌 | Weighing words, so the word must mean to deliberate.
敲定/1 | 会议时间终于定在周一 | Finalised, so the word must mean to finalise.
敲门砖/1 | 证书只是找工作的 | A stepping stone, so the word must mean stepping stone.
颇为/1 | 他对古代天文学相当了解 | Quite, so the word must mean rather.
颇有/1 | 老教授在植物学方面很有 | Considerable, so the word must mean to have considerable.
人人皆知/1 | 地球围着太阳转 | Common knowledge, so the word must mean known to all.
比比皆是/1 | 城市里咖啡馆到处都有 | Everywhere, so the word must mean to be found everywhere.
皆大欢喜/1 | 双方都满意 | Everyone happy, so the word must mean to the satisfaction of all.
凡是/1 | 参加比赛的同学都有证书 | Every, so the word must mean every.
非凡/1 | 科学家有超常的想象力 | Extraordinary, so the word must mean extraordinary.
平凡/1 | 普通的乡村教师 | Ordinary, so the word must mean ordinary.
凡人/1 | 我们难免会犯错误 | Mortals, so the word must mean ordinary person.
不同凡响/1 | 第一部电影就获大奖 | Outstanding, so the word must mean remarkable.
萌芽/1 | 想法还处在刚开始的阶段 | Budding, so the word must mean sprout, bud.
萌发/1 | 温度合适种子很快 | Sprouting, so the word must mean to sprout.
萌生/1 | 读了书有了当科学家的念头 | A thought arising, so the word must mean to begin to have.
弥补/1 | 暑假补上落下的功课 | Making up, so the word must mean to make up for.
补救/1 | 发现错误要及时 | Remedying, so the word must mean to remedy.
弥漫/1 | 山谷里满是白雾 | Filling the air, so the word must mean to fill the air.
弥足珍贵/1 | 一百年前的照片 | Very precious, so the word must mean extremely precious.
填补空白/1 | 研究成果受到同行重视 | Filling a gap, so the word must mean to fill a gap.
起步/1 | 技术开始得晚但发展快 | Starting out, so the word must mean to start.
初具规模/1 | 三年建设科学城已经 | Taking shape, so the word must mean to begin to take shape.
瞬间/1 | 相机记录闪电出现的那一 | An instant, so the word must mean instant.
转瞬即逝/1 | 机会要及时抓住 | Fleeting, so the word must mean fleeting.
瞬息万变/1 | 山里天气刚出太阳就下雨 | Ever-changing, so the word must mean to change in an instant.
片刻/1 | 他沉思了一会儿 | A moment, so the word must mean moment.
暂时/1 | 住在朋友家，下月再找房 | For now, so the word must mean temporarily.
暂且/1 | 问题先放一放 | For the time being, so the word must mean for the moment.
暂停/1 | 下大雨比赛停了半小时 | A pause, so the word must mean to pause.
暂缓/1 | 资金不够建设计划推迟 | Postponed, so the word must mean to postpone.
短暂/1 | 休息不久又开始工作 | Brief, so the word must mean brief.
暂定/1 | 会议下周三举行，时间另通知 | Tentative, so the word must mean tentatively set.
竭力/1 | 医生们尽力抢救 | Doing their utmost, so the word must mean to do one's utmost.
竭尽全力/1 | 只要我们就不后悔 | Going all out, so the word must mean to do everything one can.
精疲力竭/1 | 爬了一天山大家都 | Utterly worn out, so the word must mean exhausted.
筋疲力尽/1 | 搬完家倒头就睡 | Dead tired, so the word must mean worn out.
枯竭/1 | 过度开采地下水会用光 | Running dry, so the word must mean to dry up.
一番/1 | 经过认真的准备 | A round of effort, so the word must mean a spell of.
三番五次/1 | 一次又一次向导师请教 | Again and again, so the word must mean repeatedly.
毛遂自荐/1 | 实验室招助手他推荐自己 | Volunteering oneself, so the word must mean to recommend oneself.
未遂/1 | 出国留学的心愿没实现 | Unfulfilled, so the word must mean unfulfilled.
心血/1 | 词典凝聚了他二十年的 | Painstaking effort, so the word must mean painstaking effort.
纯粹/1 | 学画画完全出于兴趣 | Purely, so the word must mean purely.
精粹/1 | 古代诗歌最好的部分 | The essence, so the word must mean essence.
国粹/1 | 京剧被称为中国的 | National treasure, so the word must mean quintessence of a nation.
博大精深/1 | 书法艺术值得一生去学 | Broad and profound, so the word must mean broad and profound.
浩如烟海/1 | 图书馆的书一辈子读不完 | Vast as the sea, so the word must mean vast.
浩大/1 | 修建三峡大坝的工程 | Enormous, so the word must mean vast.
玄妙/1 | 宇宙起源的道理至今没答案 | Mysterious, so the word must mean abstruse.
玄机/1 | 题目看似简单其实暗藏 | A hidden trick, so the word must mean hidden meaning.
惟妙惟肖/1 | 模仿鸟叫学得一模一样 | Lifelike, so the word must mean true to life.
惟有/1 | 坚持下去才能看到成果 | Only by persisting, so the word must mean only.
胚胎/1 | 观察鸡蛋里研究动物发育 | An embryo, so the word must mean embryo.
霉菌/1 | 面包放久了长出来的 | Mould, so the word must mean mould.
发霉/1 | 南方春天潮湿衣服容易 | Going mouldy, so the word must mean to go mouldy.
青蛙/1 | 夏夜稻田里叫个不停 | Frogs croaking, so the word must mean frog.
猩猩/1 | 东南亚雨林里手臂很长 | Orangutans, so the word must mean orangutan.
黑猩猩/1 | 用小树枝取白蚁吃 | Chimpanzees, so the word must mean chimpanzee.
蚂蚁/1 | 能搬动比自己重得多的东西 | Ants, so the word must mean ant.
苍蝇/1 | 会传播疾病食物要盖好 | Flies, so the word must mean fly.
果蝇/1 | 遗传学用它做实验繁殖快 | Fruit flies, so the word must mean fruit fly.
苍白/1 | 他生病了脸色很 | Pale, so the word must mean pale.
数据库/1 | 收录一百多年的天气记录 | A database, so the word must mean database.
题库/1 | 考试题目随机抽出来的地方 | A question bank, so the word must mean question bank.
文库/1 | 儿童丛书收录一百本名著 | A library series, so the word must mean library collection.
智库/1 | 研究人员为城市规划提建议 | A think tank, so the word must mean think tank.
检索/1 | 输入书名就能找到 | Searching, so the word must mean to search.
关键词/1 | 摘要下列出三到五个 | Keywords, so the word must mean keyword.
查重/1 | 论文提交前查重复内容 | Plagiarism check, so the word must mean to check for duplication.
匹配/1 | 密码和账号不对应 | Matching, so the word must mean to match.
匹敌/1 | 人类棋手很难和电脑 | Rivalling, so the word must mean to rival.
引文/1 | 论文中要注明出处 | Quotations, so the word must mean citation.
授予/1 | 大学给他名誉博士学位 | Conferring a degree, so the word must mean to confer.
学术界/1 | 论文引起很大反响 | Academia, so the word must mean academic circles.
学术会议/1 | 去国外报告研究成果 | A conference, so the word must mean academic conference.
跨学科/1 | 需要地理、化学专家合作 | Interdisciplinary, so the word must mean interdisciplinary.
同行评议/1 | 论文发表前一般要经过 | Peer review, so the word must mean peer review.
期刊/1 | 有周刊也有月刊 | Journals, so the word must mean periodical.
专著/1 | 研究宋代瓷器的书 | A monograph, so the word must mean monograph.
参考文献/1 | 论文最后要列出 | References, so the word must mean references.
抄袭/1 | 文章照抄别人的研究 | Plagiarism, so the word must mean to plagiarise.
学术不端/1 | 抄袭、伪造数据 | Academic misconduct, so the word must mean academic misconduct.
麦穗/1 | 初夏田里变黄准备收麦子 | Ears of wheat, so the word must mean ear of wheat.
稻穗/1 | 金黄的把稻子压弯了腰 | Rice ears, so the word must mean ear of rice.
秧苗/1 | 农民一行一行插进水田 | Rice seedlings, so the word must mean seedling.
插秧/1 | 四五月南方农民开始忙 | Transplanting rice, so the word must mean to transplant rice.
禾苗/1 | 春雨后田里长得更绿 | Young crops, so the word must mean young crop.
籽粒/1 | 玉米饱满收成好 | Kernels, so the word must mean grain, kernel.
茎/1 | 把根吸收的水分送到叶子 | The stem, so the word must mean stem.
茎秆/1 | 新品种小麦又短又粗不怕风 | Stalks, so the word must mean stalk.
块茎/1 | 土豆吃的部分不是根 | A tuber, so the word must mean tuber.
颗粒无收/1 | 大旱那年庄稼 | No harvest at all, so the word must mean total crop failure.
红薯/1 | 冬天街头烤的又香又甜 | Sweet potato, so the word must mean sweet potato.
马铃薯/1 | 原产南美洲传到世界 | Potato, so the word must mean potato.
薯条/1 | 一杯可乐和一份 | Chips, so the word must mean French fries.
薯片/1 | 一袋边看电影边吃 | Crisps, so the word must mean potato crisps.
蘑菇/1 | 雨后树林里，野生的别乱吃 | Mushrooms, so the word must mean mushroom.
香菇/1 | 晒干后香味更浓常做汤 | Shiitake, so the word must mean shiitake.
菌菇/1 | 工厂种十几个品种 | Fungi, so the word must mean mushrooms.
木耳/1 | 黑的长在潮湿树干上 | Wood ear, so the word must mean wood ear fungus.
菇农/1 | 山里在大棚种香菇的人 | Mushroom farmers, so the word must mean mushroom grower.
杂粮/1 | 少吃精米白面多吃 | Coarse grains, so the word must mean coarse grains.
犁/1 | 农民用牛拉着耕地 | A plough, so the word must mean plough.
犁地/1 | 开着拖拉机翻土 | Ploughing, so the word must mean to plough.
锄头/1 | 爷爷拿着下地去了 | A hoe, so the word must mean hoe.
锄草/1 | 菜地草长得快要经常 | Weeding, so the word must mean to weed.
耕耘/1 | 在乡村学校默默工作三十年 | Toiling, so the word must mean to cultivate, toil.
竹筐/1 | 背着上山采茶 | A bamboo basket, so the word must mean bamboo basket.
水桶/1 | 提着两只去井边打水 | Buckets, so the word must mean bucket.
收割机/1 | 收麦子一台一天一百多亩 | A harvester, so the word must mean harvester.
播种机/1 | 往前开把种子种进土 | A seeder, so the word must mean seeder.
农机/1 | 购买它的农民有补贴 | Farm machinery, so the word must mean farm machinery.
亩/1 | 承包了五十这样的地 | A unit of land, so the word must mean mu.
亩产/1 | 新品种水稻每亩产量 | Yield per mu, so the word must mean yield per mu.
梯田/1 | 云南哈尼的列入世界遗产 | Terraces, so the word must mean terraced field.
良田/1 | 荒地变成了好地 | Fertile fields, so the word must mean good farmland.
收成/1 | 雨水充足粮食的 | The harvest, so the word must mean harvest.
歉收/1 | 干旱小麦产量不好 | A poor harvest, so the word must mean poor harvest.
秋收/1 | 田野里到处是收玉米的人 | Autumn harvest, so the word must mean autumn harvest.
农忙/1 | 学校放假让孩子帮家里干活 | The busy season, so the word must mean busy farming season.
五谷丰登/1 | 过年贴在门上的四个大字 | Bumper harvests, so the word must mean abundant harvest.
风调雨顺/1 | 今年庄稼长得特别好 | Good weather, so the word must mean favourable weather.
畜牧业/1 | 内蒙古草原上很发达 | Herding, so the word must mean animal husbandry.
家畜/1 | 牛、羊、猪 | Livestock, so the word must mean livestock.
饲养/1 | 农场养了两千头奶牛 | Raising cattle, so the word must mean to raise.
饲料/1 | 玉米秆加工给牛羊吃 | Animal feed, so the word must mean fodder.
喂养/1 | 小猫每隔几小时一次 | Feeding a kitten, so the word must mean to feed.
喂食/1 | 不要随便给动物 | Feeding animals, so the word must mean to feed.
粪便/1 | 牛羊的可以生产沼气 | Dung, so the word must mean excrement.
粪肥/1 | 菜农用处理过的给菜地施肥 | Manure, so the word must mean manure.
奶牛/1 | 每天要挤两三次奶 | Dairy cows, so the word must mean dairy cow.
猪圈/1 | 每天早上打扫干净 | A pigsty, so the word must mean pigsty.
大棚/1 | 冬天黄瓜照样长得好 | A greenhouse, so the word must mean greenhouse.
反季节/1 | 冬天也能吃到的蔬菜 | Out of season, so the word must mean off-season.
无土栽培/1 | 根泡在营养液中 | Hydroponics, so the word must mean soilless cultivation.
牛棚/1 | 下雨把牛赶进去 | A cowshed, so the word must mean cowshed.
菜园/1 | 屋后种了些青菜 | A vegetable plot, so the word must mean vegetable garden.
菜农/1 | 天不亮把蔬菜运到城里 | Vegetable growers, so the word must mean vegetable farmer.
果农/1 | 苹果成熟忙着摘果子 | Fruit growers, so the word must mean fruit grower.
有机农业/1 | 种菜不用化肥和农药 | Organic farming, so the word must mean organic farming.
生态农业/1 | 稻田里养鱼鱼粪肥田 | Eco-farming, so the word must mean ecological agriculture.
智慧农业/1 | 用手机控制大棚温度 | Smart farming, so the word must mean smart agriculture.
葡萄/1 | 吐鲁番的又大又甜 | Grapes, so the word must mean grape.
葡萄干/1 | 吐鲁番干燥适合晒成 | Raisins, so the word must mean raisin.
葡萄园/1 | 山坡上架子挂满了葡萄 | A vineyard, so the word must mean vineyard.
梨/1 | 秋天又甜又水灵的水果 | Pears, so the word must mean pear.
鸭梨/1 | 河北出产很有名 | Ya pears, so the word must mean Ya pear.
橘子/1 | 皮很容易剥开 | Tangerines, so the word must mean tangerine.
红枣/1 | 煮汤时放了几颗 | Red dates, so the word must mean jujube.
枣树/1 | 秋天结满红红的果子 | A jujube tree, so the word must mean jujube tree.
嫁接/1 | 把好品种的枝条接到老树上 | Grafting, so the word must mean to graft.
授粉/1 | 蜜蜂帮助果树 | Pollination, so the word must mean to pollinate.
葱/1 | 炒菜前先放一点爆香 | Spring onion, so the word must mean scallion.
大葱/1 | 山东出产的又高又粗 | Leeks, so the word must mean Chinese leek.
洋葱/1 | 切的时候眼睛发红 | Onions, so the word must mean onion.
葱花/1 | 面条上放一点更香 | Chopped scallion, so the word must mean chopped green onion.
大蒜/1 | 味道很重吃完刷牙 | Garlic, so the word must mean garlic.
蒜苗/1 | 青青的炒肉很下饭 | Garlic shoots, so the word must mean garlic sprouts.
茄子/1 | 照相时大家一起说 | Say cheese, so the word must mean eggplant.
番茄/1 | 炒鸡蛋是家常菜 | Tomatoes, so the word must mean tomato.
葱绿/1 | 雨后山坡一片 | Verdant, so the word must mean bright green.
时令/1 | 饭馆只用当季蔬菜 | Seasonal, so the word must mean season.
桑树/1 | 江南房前屋后都种着 | Mulberry trees, so the word must mean mulberry tree.
桑叶/1 | 蚕宝宝最爱吃 | Mulberry leaves, so the word must mean mulberry leaf.
蚕/1 | 吐出的丝织成丝绸 | Silkworm, so the word must mean silkworm.
养蚕/1 | 中国几千年的历史 | Sericulture, so the word must mean to raise silkworms.
蚕丝/1 | 做的被子又轻又暖 | Silk, so the word must mean silk.
春蚕/1 | 到死丝方尽 | Spring silkworms, so the word must mean spring silkworm.
蚕豆/1 | 地里开出紫白色小花 | Broad beans, so the word must mean broad bean.
蚕食/1 | 超市不断吃掉小商店生意 | Nibbling away, so the word must mean to encroach.
桑田/1 | 家家户户都养蚕的地 | Mulberry fields, so the word must mean mulberry field.
织布/1 | 奶奶用木头机器 | Weaving, so the word must mean to weave cloth.
冶炼/1 | 从矿石中提取铜 | Smelting, so the word must mean to smelt.
冶金/1 | 大学专业毕业去钢厂 | Metallurgy, so the word must mean metallurgy.
炼铁/1 | 高炉的主要用途 | Ironmaking, so the word must mean to smelt iron.
炼钢/1 | 去掉铁里多余的碳 | Steelmaking, so the word must mean to make steel.
高炉/1 | 钢厂日夜不停工作的 | A blast furnace, so the word must mean blast furnace.
熔炉/1 | 艰苦环境是锻炼年轻人的大 | A melting pot, so the word must mean furnace.
锻造/1 | 刀是一锤一锤打出来的 | Forging, so the word must mean to forge.
打铁/1 | 十几岁跟师傅学 | Blacksmithing, so the word must mean to forge iron.
铁匠/1 | 铺里传出叮叮当当的声音 | A blacksmith, so the word must mean blacksmith.
炉火纯青/1 | 做了四十年手艺已经 | Perfected, so the word must mean consummate skill.
锤子/1 | 把钉子钉进木板 | A hammer, so the word must mean hammer.
锤打/1 | 铁匠把烧红的铁反复 | Hammering, so the word must mean to hammer.
锤炼/1 | 语言经过反复修改 | Honing, so the word must mean to temper, hone.
千锤百炼/1 | 好运动员都是这样成长的 | Tempered by trials, so the word must mean thoroughly tempered.
钩子/1 | 门后挂衣服的 | A hook, so the word must mean hook.
挂钩/1 | 工资和成绩联系在一起 | Linking, so the word must mean to link.
鱼钩/1 | 抛进河里等鱼上钩 | A fish hook, so the word must mean fish hook.
钩针/1 | 奶奶织了一顶帽子 | A crochet hook, so the word must mean crochet hook.
机床/1 | 数控的加工精密零件 | A machine tool, so the word must mean machine tool.
切削/1 | 金属零件要经过打磨 | Cutting metal, so the word must mean to cut.
木炭/1 | 过去冬天用来取暖 | Charcoal, so the word must mean charcoal.
煤炭/1 | 山西是重要产地 | Coal, so the word must mean coal.
炭火/1 | 大家围着烤红薯 | A charcoal fire, so the word must mean charcoal fire.
雪中送炭/1 | 最困难的时候借给他钱 | Timely help, so the word must mean help in time of need.
锅炉/1 | 学校每天早上烧好开水的 | A boiler, so the word must mean boiler.
炉子/1 | 屋里生着一点也不冷 | A stove, so the word must mean stove.
采煤/1 | 煤矿用机器挖 | Coal mining, so the word must mean to mine coal.
燃煤/1 | 城市不再用这种锅炉 | Coal-burning, so the word must mean coal-fired.
供暖/1 | 北方冬天集中屋里暖和 | Heating, so the word must mean to supply heating.
油桶/1 | 码头上堆着几十个空的 | Oil drums, so the word must mean oil drum.
砖窑/1 | 村里盖房的砖在那里烧 | A brick kiln, so the word must mean brick kiln.
窑洞/1 | 黄土高原上冬暖夏凉 | Cave houses, so the word must mean cave dwelling.
官窑/1 | 宋代的瓷器非常珍贵 | Imperial kilns, so the word must mean imperial kiln.
罐子/1 | 奶奶把咸菜装进陶的 | A jar, so the word must mean jar.
陶罐/1 | 遗址里几千年前的 | A clay pot, so the word must mean earthen jar.
罐头/1 | 登山队带着容易保存 | Tinned food, so the word must mean tinned food.
易拉罐/1 | 喝完饮料放进回收桶 | A drinks can, so the word must mean ring-pull can.
冷库/1 | 苹果保存到第二年春天 | Cold storage, so the word must mean cold store.
库存/1 | 手机卖得太好不多了 | Stock, so the word must mean inventory.
入库/1 | 粮食晒干以后才能 | Storing, so the word must mean to put in storage.
施肥/1 | 种庄稼要按时浇水 | Fertilising, so the word must mean to fertilise.
追肥/1 | 小麦长到一定高度再一次 | Top dressing, so the word must mean to top-dress.
磷肥/1 | 帮助根、花和果实发育 | Phosphate fertiliser, so the word must mean phosphate fertiliser.
钾肥/1 | 让茎秆更结实不易倒 | Potash fertiliser, so the word must mean potash fertiliser.
氮肥/1 | 让叶子又大又绿 | Nitrogen fertiliser, so the word must mean nitrogen fertiliser.
复合肥/1 | 同时含氮、磷、钾 | Compound fertiliser, so the word must mean compound fertiliser.
有机肥/1 | 种出的蔬菜价格高 | Organic fertiliser, so the word must mean organic fertiliser.
农药/1 | 蔬菜洗干净以免残留 | Pesticide residue, so the word must mean pesticide.
除草剂/1 | 用了以后杂草都枯死 | Weedkiller, so the word must mean herbicide.
杀虫剂/1 | 家里有蚊子买一瓶 | Insect spray, so the word must mean insecticide.
流水线/1 | 汽车一步一步装配 | An assembly line, so the word must mean assembly line.
车间/1 | 工厂有三个每个几百工人 | Workshops, so the word must mean workshop.
厂房/1 | 新的盖好面积大了很多 | Factory buildings, so the word must mean factory building.
产能/1 | 新设备使用后提高一半 | Capacity, so the word must mean production capacity.
开工/1 | 春节过后工厂陆续 | Starting work, so the word must mean to start work.
停产/1 | 原材料运不进来 | Production halted, so the word must mean to stop production.
作坊/1 | 专门做手工布鞋一百多年 | A workshop, so the word must mean workshop.
加工厂/1 | 把卖不完的水果做成果干 | A processing plant, so the word must mean processing plant.
质检/1 | 产品出厂前都要经过 | Quality checks, so the word must mean quality inspection.
次品/1 | 检查员挑出来不让出厂 | Defective goods, so the word must mean defective product.
轻工业/1 | 纺织、食品、造纸 | Light industry, so the word must mean light industry.
重工业/1 | 钢铁、机械、造船 | Heavy industry, so the word must mean heavy industry.
制造业/1 | 中国规模最大 | Manufacturing, so the word must mean manufacturing.
原材料/1 | 棉花是棉纺厂最重要的 | Raw materials, so the word must mean raw material.
半成品/1 | 家具还要上漆才能出厂 | Half-finished, so the word must mean semi-finished product.
削减/1 | 公司减掉一半广告费 | Cutting costs, so the word must mean to cut.
削弱/1 | 干旱降低了农业生产能力 | Weakening, so the word must mean to weaken.
合作社/1 | 村民成立统一卖蜂蜜 | A co-op, so the word must mean cooperative.
家庭农场/1 | 一家承包三百亩地办起 | A family farm, so the word must mean family farm.
种粮大户/1 | 承包一千多亩地 | A large grain farmer, so the word must mean major grain grower.
瘟疫/1 | 古时一场夺去成千上万生命 | A plague, so the word must mean plague.
流行病/1 | 流感是冬天常见的 | An epidemic, so the word must mean epidemic.
暴发/1 | 镇上突然发生一场痢疾 | An outbreak, so the word must mean to break out.
防控/1 | 传染病需要每个人配合 | Prevention and control, so the word must mean prevention and control.
传播途径/1 | 饮用污染的水是霍乱的 | The route of spread, so the word must mean route of transmission.
传染源/1 | 鼠疫中老鼠是主要的 | The source, so the word must mean source of infection.
易感人群/1 | 老人小孩是流感的 | Those at risk, so the word must mean susceptible population.
病原体/1 | 显微镜让人看到细菌 | Germs, so the word must mean pathogen.
潜伏期/1 | 两个星期病人没感觉 | Incubation, so the word must mean incubation period.
疫区/1 | 从那里回来先在家观察 | An affected area, so the word must mean epidemic area.
疟疾/1 | 中国女科学家找到新药获诺贝尔奖 | Malaria, so the word must mean malaria.
痢疾/1 | 吃了不干净的东西拉肚子 | Dysentery, so the word must mean dysentery.
霍乱/1 | 通过污染的水井传播 | Cholera, so the word must mean cholera.
天花/1 | 靠疫苗彻底消灭 | Smallpox, so the word must mean smallpox.
艾滋病/1 | 血液传播但握手不传染 | AIDS, so the word must mean AIDS.
结核病/1 | 长时间咳嗽吃几个月药 | Tuberculosis, so the word must mean tuberculosis.
肝炎/1 | 甲型通过不干净的食物传播 | Hepatitis, so the word must mean hepatitis.
流感/1 | 秋天老人打这种疫苗 | Flu, so the word must mean influenza.
手足口病/1 | 幼儿园孩子手上嘴里长疹子 | Hand, foot and mouth, so the word must mean hand, foot and mouth disease.
登革热/1 | 和疟疾一样由蚊子传播 | Dengue, so the word must mean dengue fever.
接种/1 | 孩子出生后按时打疫苗 | Vaccinating, so the word must mean to vaccinate.
预防针/1 | 小明怕疼每次打都哭 | A jab, so the word must mean vaccination shot.
加强针/1 | 前两针半年后再打 | A booster, so the word must mean booster shot.
抗体/1 | 接种疫苗身体里会产生 | Antibodies, so the word must mean antibody.
免疫系统/1 | 艾滋病病毒会破坏它 | Immunity, so the word must mean immune system.
群体免疫/1 | 大多数人接种保护别人 | Herd immunity, so the word must mean herd immunity.
接种率/1 | 儿童超过百分之九十五 | Vaccination rate, so the word must mean vaccination rate.
不良反应/1 | 打疫苗后发热 | Side effects, so the word must mean adverse reaction.
灭活疫苗/1 | 病毒已被杀死不会让人生病 | Inactivated vaccine, so the word must mean inactivated vaccine.
接种证/1 | 上幼儿园要交一份复印件 | A vaccination record, so the word must mean vaccination certificate.
筛查/1 | 学校每年查视力看谁近视 | Screening, so the word must mean screening.
普查/1 | 国家每十年一次人口 | A census, so the word must mean general survey.
检疫/1 | 进口水果要先经过 | Quarantine checks, so the word must mean quarantine.
排查/1 | 一个一个查和病人见过面的人 | Checking contacts, so the word must mean to check one by one.
密切接触者/1 | 病人的家人也要检查 | Close contacts, so the word must mean close contact.
阳性/1 | 检测结果说明被感染 | Infected, so the word must mean positive.
阴性/1 | 检测结果可以放心回家 | Not infected, so the word must mean negative.
确诊/1 | 几次检查终于确定是肝炎 | Diagnosed, so the word must mean to confirm a diagnosis.
疑似/1 | 发热咳嗽被当作可能的病例 | Suspected, so the word must mean suspected.
病例/1 | 全市发现三个流感 | Cases, so the word must mean case.
隔离/1 | 传染病人住单独病房 | Isolated, so the word must mean isolation.
防护服/1 | 医生从头到脚包严实 | A protective suit, so the word must mean protective suit.
护目镜/1 | 防止药品进入眼睛 | Goggles, so the word must mean goggles.
消毒水/1 | 医院走廊里的味道 | Disinfectant, so the word must mean disinfectant.
通风/1 | 屋里人多要开窗 | Airing, so the word must mean to ventilate.
勤洗手/1 | 饭前便后预防肠道传染病 | Hand washing, so the word must mean to wash hands often.
社交距离/1 | 排队保持一米以上 | Distancing, so the word must mean social distance.
喷雾/1 | 往脸上喷一点儿保湿 | A spray, so the word must mean spray.
防护/1 | 矿井下要做好安全 | Protection, so the word must mean protection.
居家/1 | 退休后大部分时间在家 | Staying home, so the word must mean to stay at home.
喷嚏/1 | 花粉过敏一到春天就打 | Sneezes, so the word must mean sneeze.
鼻涕/1 | 小弟弟感冒一直流 | A runny nose, so the word must mean nasal mucus.
唾液/1 | 慢慢嚼让食物和它接触 | Saliva, so the word must mean saliva.
发热/1 | 到三十九度赶紧去医院 | A fever, so the word must mean to have a fever.
乏力/1 | 总是疲倦没有精神 | Weak and tired, so the word must mean lacking strength.
酸痛/1 | 爬了一天山腿下不了楼 | Aching legs, so the word must mean aching.
僵硬/1 | 坐了一上午肩膀后背 | Stiff, so the word must mean stiff.
脸颊/1 | 小女孩冻得通红 | Cheeks, so the word must mean cheek.
口疮/1 | 熬夜嘴里长了好几个 | Mouth ulcers, so the word must mean mouth ulcer.
冻疮/1 | 冬天没暖气手上长 | Chilblains, so the word must mean chilblain.
痊愈/1 | 病完全好了没有症状 | Fully recovered, so the word must mean to recover fully.
安然无恙/1 | 车翻了人都没事 | Unharmed, so the word must mean safe and sound.
后遗症/1 | 大病留下走路不稳 | Lasting effects, so the word must mean after-effect.
瘫痪/1 | 车祸下半身只能坐轮椅 | Paralysed, so the word must mean paralysis.
偏瘫/1 | 中风后左手左腿不能动 | One side paralysed, so the word must mean hemiplegia.
复发/1 | 病刚好要防止再犯 | Relapse, so the word must mean to relapse.
并发症/1 | 糖尿病控制不好会引起 | Complications, so the word must mean complication.
好转/1 | 吃了几天药咳嗽 | Getting better, so the word must mean to improve.
恢复期/1 | 手术后三个月不能剧烈运动 | Recovery period, so the word must mean recovery period.
疗养/1 | 病好后去海边住一个月 | Convalescing, so the word must mean to convalesce.
腺体/1 | 有的分泌汗水有的分泌消化液 | Glands, so the word must mean gland.
汗腺/1 | 狗身上很少靠舌头散热 | Sweat glands, so the word must mean sweat gland.
甲状腺/1 | 缺碘会引起肿大 | The thyroid, so the word must mean thyroid.
胰腺/1 | 在胃的后面分泌消化液 | The pancreas, so the word must mean pancreas.
胰岛素/1 | 糖尿病人注射控制血糖 | Insulin, so the word must mean insulin.
肩膀/1 | 儿子坐在爸爸的上面 | Shoulders, so the word must mean shoulder.
骨骼/1 | 多晒太阳有利于发育 | Bones, so the word must mean skeleton.
内分泌/1 | 脸上长痘因为失调 | Hormones, so the word must mean endocrine.
脊柱/1 | 坐时腰背要直保护好 | The spine, so the word must mean spine.
消化道/1 | 食物从嘴里经过它被吸收 | The gut, so the word must mean digestive tract.
厕所/1 | 附近有吗，我想洗个手 | A toilet, so the word must mean toilet.
公厕/1 | 公园新建了几座 | Public toilets, so the word must mean public toilet.
旱厕/1 | 老式的改成水冲厕所 | Pit latrines, so the word must mean dry toilet.
肥皂/1 | 奶奶用它洗衣服 | Soap for laundry, so the word must mean soap.
香皂/1 | 洗脸后有淡淡花香 | Scented soap, so the word must mean toilet soap.
漱口/1 | 吃完饭用清水 | Rinsing the mouth, so the word must mean to rinse the mouth.
排泄物/1 | 病人的要消毒处理 | Body waste, so the word must mean excreta.
下水道/1 | 不要把油倒进去会堵 | Drains, so the word must mean sewer.
污水处理/1 | 工厂废水排进河前要经过 | Sewage treatment, so the word must mean sewage treatment.
化粪池/1 | 农村修了以后脏东西不进河 | A septic tank, so the word must mean septic tank.
霉斑/1 | 墙角一片黑色的 | Mould spots, so the word must mean mildew spot.
霉味/1 | 很久没开窗的屋子里 | A musty smell, so the word must mean musty smell.
霉变/1 | 花生产生有毒物质 | Gone mouldy, so the word must mean mouldy.
滋生/1 | 垃圾不清理容易生出蚊虫 | Breeding, so the word must mean to breed.
灭蝇/1 | 饭店不让苍蝇落在食物上 | Killing flies, so the word must mean to exterminate flies.
蚊虫/1 | 夏夜很多穿长袖 | Mosquitoes and insects, so the word must mean insects.
灭鼠/1 | 预防鼠疫开展活动 | Killing rats, so the word must mean rodent control.
白蚁/1 | 木头柱子被吃空了 | Termites, so the word must mean termite.
驱虫/1 | 去野外带上药水 | Insect repellent, so the word must mean to repel insects.
蝇拍/1 | 一下就打死了苍蝇 | A fly swatter, so the word must mean fly swatter.
污垢/1 | 洗澡洗去身上的 | Grime, so the word must mean dirt.
水垢/1 | 烧水锅底白色的一层 | Limescale, so the word must mean scale.
牙垢/1 | 每半年洗牙清理 | Tartar, so the word must mean tartar.
污渍/1 | 白衬衫上咖啡留下的 | A stain, so the word must mean stain.
油渍/1 | 厨房墙上要用热水洗 | Grease stains, so the word must mean grease stain.
污秽/1 | 小河曾经满是脏东西 | Filth, so the word must mean filth.
洗涤/1 | 毛衣只能冷水手工 | Washing, so the word must mean to wash.
洗涤剂/1 | 洗碗用的要冲干净 | Detergent, so the word must mean detergent.
擦拭/1 | 每天用湿布擦桌子 | Wiping, so the word must mean to wipe.
去污/1 | 肥皂衣领黑印一洗就掉 | Stain removal, so the word must mean to remove stains.
孕妇/1 | 公交车上留给老人和她们的座位 | Pregnant women, so the word must mean pregnant woman.
孕期/1 | 医生提醒注意营养 | Pregnancy, so the word must mean pregnancy.
哺乳/1 | 母婴室方便妈妈给孩子 | Breastfeeding, so the word must mean to breastfeed.
母乳/1 | 新生儿最好的食物 | Breast milk, so the word must mean breast milk.
哺育/1 | 黄河像母亲一样养育人民 | Nurturing, so the word must mean to nurture.
婴幼儿/1 | 药不适合他们只能大人吃 | Babies and toddlers, so the word must mean infants.
新生儿/1 | 护士给每个戴小手环 | Newborns, so the word must mean newborn.
产检/1 | 每月去医院看孩子长得好不好 | Prenatal check, so the word must mean antenatal check-up.
早产/1 | 比预产期早一个多月 | Born early, so the word must mean premature birth.
乳牙/1 | 六七岁开始一颗颗掉 | Baby teeth, so the word must mean milk tooth.
膳食/1 | 营养师安排学生的 | Meals, so the word must mean diet.
补钙/1 | 老人多喝牛奶 | Calcium, so the word must mean to supplement calcium.
钙片/1 | 奶奶晚饭后吃一片 | Calcium tablets, so the word must mean calcium tablet.
碘盐/1 | 山区吃它预防甲状腺肿大 | Iodised salt, so the word must mean iodised salt.
缺碘/1 | 长期会使甲状腺变大 | Iodine deficiency, so the word must mean iodine deficiency.
咀嚼/1 | 牙不好嚼硬东西很吃力 | Chewing, so the word must mean to chew.
细嚼慢咽/1 | 吃饭太快对胃不好 | Eating slowly, so the word must mean to chew well and swallow slowly.
营养均衡/1 | 每顿有菜有肉 | A balanced diet, so the word must mean balanced nutrition.
滋补/1 | 冬天吃补身体的食物 | Nourishing, so the word must mean to nourish.
乳制品/1 | 牛奶、酸奶 | Dairy, so the word must mean dairy product.
上瘾/1 | 游戏玩了几天就 | Hooked, so the word must mean to get addicted.
成瘾/1 | 吸烟容易 | Addictive, so the word must mean addiction.
网瘾/1 | 每天上网十几个小时 | Internet addiction, so the word must mean internet addiction.
烟瘾/1 | 爷爷以前很大后来戒了 | A smoking habit, so the word must mean craving for tobacco.
吸烟区/1 | 机场里专门的 | A smoking area, so the word must mean smoking area.
控烟/1 | 公共场所禁止吸烟的条例 | Tobacco control, so the word must mean tobacco control.
戒除/1 | 下决心去掉熬夜的习惯 | Giving up, so the word must mean to give up.
自控/1 | 小孩子能力比较弱 | Self-control, so the word must mean self-control.
烟民/1 | 数量逐年下降 | Smokers, so the word must mean smoker.
沉迷/1 | 玩手机游戏成绩下降 | Hooked on games, so the word must mean to be addicted to.
公共卫生/1 | 干净饮用水是它的基础 | Public health, so the word must mean public health.
疾控中心/1 | 发现传染病要马上报告 | The CDC, so the word must mean disease control centre.
卫生院/1 | 村民小病去镇上的 | A clinic, so the word must mean township hospital.
防疫站/1 | 以前打预防针要去 | An epidemic station, so the word must mean epidemic prevention station.
家庭医生/1 | 社区给老人安排随时打电话 | A family doctor, so the word must mean family doctor.
卫生部门/1 | 每年检查饭店厨房 | Health authorities, so the word must mean health department.
基层医疗/1 | 村民在家门口就能看病 | Primary care, so the word must mean primary health care.
医疗卫生/1 | 国家每年投入大量资金 | Healthcare, so the word must mean medical and health services.
卫生监督/1 | 人员检查厨房和餐具 | Health inspection, so the word must mean health supervision.
赤脚医生/1 | 一边种地一边看病 | Barefoot doctors, so the word must mean barefoot doctor.
发病率/1 | 冬天流感比夏天高 | Incidence, so the word must mean incidence rate.
患病率/1 | 中学生近视一半以上 | Prevalence, so the word must mean prevalence.
感染率/1 | 常洗手的人更低 | Infection rate, so the word must mean infection rate.
死亡率/1 | 新生儿的大大降低 | Mortality, so the word must mean death rate.
治愈率/1 | 发现得早可达百分之九十以上 | Cure rate, so the word must mean cure rate.
流行病学/1 | 研究传染病在人群中怎样传播 | Epidemiology, so the word must mean epidemiology.
抽样/1 | 只调查了一千个家庭 | Sampling, so the word must mean sampling.
统计数据/1 | 根据卫生部门的流感少了 | Statistics, so the word must mean statistical data.
健康状况/1 | 坚持锻炼越来越好 | Health, so the word must mean state of health.
高发/1 | 春季是流感的季节 | Peak season, so the word must mean high incidence.
化石燃料/1 | 煤、石油、天然气用完就没了 | Fossil fuels, so the word must mean fossil fuel.
无烟煤/1 | 燃烧时几乎不冒烟 | Smokeless coal, so the word must mean anthracite.
原油/1 | 从油井里开采出来要加工 | Crude oil, so the word must mean crude oil.
柴油/1 | 大卡车和拖拉机烧的 | Diesel, so the word must mean diesel.
煤油/1 | 农村没电晚上点的灯 | Kerosene, so the word must mean kerosene.
页岩气/1 | 美国大量开采天然气增加 | Shale gas, so the word must mean shale gas.
液化气/1 | 没通天然气用罐装的 | Bottled gas, so the word must mean liquefied gas.
火力发电/1 | 中国的电主要靠烧煤 | Thermal power, so the word must mean thermal power generation.
油田/1 | 大庆是有名的石油产地 | An oilfield, so the word must mean oilfield.
煤层/1 | 埋得不深开采容易 | A coal seam, so the word must mean coal seam.
勘探/1 | 地质队在山区找到铜矿 | Prospecting, so the word must mean to prospect.
勘测/1 | 修铁路前测量地形 | Surveying, so the word must mean to survey.
开采/1 | 煤矿挖了一百多年 | Mining, so the word must mean to extract.
挖掘/1 | 用机器挖地基 | Digging, so the word must mean to excavate.
矿产/1 | 地下有煤、铁、铜 | Minerals, so the word must mean mineral resources.
露天矿/1 | 不用打井就能开采 | An open-pit mine, so the word must mean open-pit mine.
矿井/1 | 坐升降机下到几百米深 | A mine shaft, so the word must mean mine shaft.
矿工/1 | 爷爷在井下挖了二十年煤 | A miner, so the word must mean miner.
储量/1 | 油田的石油可以开采几十年 | Reserves, so the word must mean reserves.
选矿/1 | 去掉没用的石头 | Ore dressing, so the word must mean ore dressing.
锡/1 | 青铜是铜和它的合金 | Tin, so the word must mean tin.
镍/1 | 美国五分钱硬币里含有 | Nickel, so the word must mean nickel.
钴/1 | 烧出青花瓷的蓝色颜料 | Cobalt, so the word must mean cobalt.
锰/1 | 炼钢加入使钢更硬 | Manganese, so the word must mean manganese.
汞/1 | 老式体温计里的银色液体 | Mercury, so the word must mean mercury.
铀/1 | 核电站用作燃料 | Uranium, so the word must mean uranium.
硫/1 | 火山口附近黄色的 | Sulphur, so the word must mean sulphur.
稀土/1 | 中国产量世界最多 | Rare earths, so the word must mean rare earth.
有色金属/1 | 铜、铝、锡 | Non-ferrous metals, so the word must mean non-ferrous metal.
贵金属/1 | 金、银做首饰 | Precious metals, so the word must mean precious metal.
铁矿/1 | 炼钢需要大量从国外进口 | Iron ore, so the word must mean iron ore.
铜矿/1 | 智利有世界上最大的 | A copper mine, so the word must mean copper mine.
金矿/1 | 加州发现后人们去淘金 | A gold mine, so the word must mean gold mine.
铁水/1 | 高炉里流出通红的 | Molten iron, so the word must mean molten iron.
钢水/1 | 炼钢炉里一千六百多度 | Molten steel, so the word must mean molten steel.
锡器/1 | 茶叶罐保存茶叶好 | Pewter, so the word must mean tinware.
水银/1 | 温度计里遇热膨胀 | Quicksilver, so the word must mean mercury.
锡纸/1 | 烤红薯时包起来 | Foil, so the word must mean tinfoil.
锰钢/1 | 又硬又耐磨做铁轨 | Manganese steel, so the word must mean manganese steel.
钢材/1 | 盖大楼用了几万吨 | Steel products, so the word must mean steel.
柴火/1 | 以前农村做饭烧的 | Firewood, so the word must mean firewood.
木柴/1 | 放进壁炉屋里暖和 | Logs, so the word must mean firewood.
火苗/1 | 风吹炉子里又旺 | Flames, so the word must mean flame.
薪火相传/1 | 手艺在家里传了五代 | Passing the torch, so the word must mean to pass down from generation to generation.
焰火/1 | 新年晚上广场放起 | Fireworks, so the word must mean fireworks.
火焰/1 | 蓝色说明燃烧充分 | A flame, so the word must mean flame.
杯水车薪/1 | 几十万医药费，这点捐款 | A drop in the ocean, so the word must mean far too little to help.
秸秆/1 | 收完庄稼在地里烧，现在禁止 | Crop stalks, so the word must mean straw.
生物质/1 | 秸秆、树枝属于这种能源 | Biomass, so the word must mean biomass.
烧柴/1 | 用上天然气很少有人再 | Burning wood, so the word must mean to burn firewood.
炉灶/1 | 新厨房装上新的 | A stove, so the word must mean kitchen range.
灶台/1 | 做完饭擦得干干净净 | The stovetop, so the word must mean stove top.
煤炉/1 | 生在屋里要防煤气中毒 | A coal stove, so the word must mean coal stove.
火炉/1 | 一家人围坐聊天 | A fire, so the word must mean stove, fireside.
烟囱/1 | 工厂冒着黑烟 | A chimney, so the word must mean chimney.
炊烟/1 | 天快黑村里升起 | Kitchen smoke, so the word must mean smoke from cooking.
炊具/1 | 露营带上帐篷和 | Cooking gear, so the word must mean cookware.
烘干/1 | 下雨天衣服用机器弄干 | Drying, so the word must mean to dry.
烘烤/1 | 面包放进烤箱二十分钟 | Baking, so the word must mean to bake.
燃气灶/1 | 用完一定关好开关 | A gas hob, so the word must mean gas stove.
发电站/1 | 发出的电够一百万户用 | A power station, so the word must mean power station.
电网/1 | 风电要接入才能送到千家万户 | The grid, so the word must mean power grid.
输电/1 | 西部的电通过线路送到东部 | Transmission, so the word must mean power transmission.
停电/1 | 晚上突然没电 | A power cut, so the word must mean power cut.
用电量/1 | 夏天开空调城市增加 | Electricity use, so the word must mean power consumption.
千瓦/1 | 空调的功率是两 | Kilowatts, so the word must mean kilowatt.
瓦特/1 | 改良蒸汽机的英国人 | Watt, so the word must mean watt.
变电站/1 | 高压电降低电压 | A substation, so the word must mean substation.
高压线/1 | 不要在下面放风筝 | Power lines, so the word must mean high-voltage line.
电闸/1 | 修电灯前先拉下来 | The switch, so the word must mean main switch.
水力发电/1 | 三峡大坝是世界最大的 | Hydropower, so the word must mean hydroelectric power.
水能/1 | 河落差大水量多资源丰富 | Water power, so the word must mean hydropower.
落差/1 | 瀑布上下一百多米 | The drop, so the word must mean drop in height.
闸门/1 | 大雨后水库打开放水 | A sluice gate, so the word must mean sluice gate.
水闸/1 | 河上控制下游水量 | A sluice, so the word must mean sluice.
船闸/1 | 轮船通过它从下游到上游 | A ship lock, so the word must mean ship lock.
涡轮机/1 | 水流冲击它带动发电机 | A turbine, so the word must mean turbine.
水轮机/1 | 水电站里被水流冲着转 | A water turbine, so the word must mean water turbine.
都江堰/1 | 两千年前的水利工程灌溉成都 | Dujiangyan, so the word must mean Dujiangyan.
抽水/1 | 天旱用水泵从河里 | Pumping water, so the word must mean to pump water.
潮汐/1 | 由月亮和太阳引力引起 | Tides, so the word must mean tide.
潮汐能/1 | 海水涨落产生的可以发电 | Tidal energy, so the word must mean tidal energy.
涨潮/1 | 海水会盖住沙滩 | High tide coming, so the word must mean rising tide.
退潮/1 | 海边露出大片沙滩 | The tide going out, so the word must mean ebb tide.
风力发电/1 | 草原风大适合发展 | Wind power, so the word must mean wind power.
风电场/1 | 几十台大风车不停转 | A wind farm, so the word must mean wind farm.
螺旋桨/1 | 小飞机的转得飞快 | A propeller, so the word must mean propeller.
叶片/1 | 风力发电机的长几十米 | Blades, so the word must mean blade.
船桨/1 | 用力划着小船到对岸 | Oars, so the word must mean oar.
海上风电/1 | 不占陆地风更大更稳 | Offshore wind, so the word must mean offshore wind power.
光伏/1 | 农民屋顶装的板 | Solar panels, so the word must mean photovoltaic.
可再生能源/1 | 风能、太阳能、水能用不完 | Renewables, so the word must mean renewable energy.
清洁能源/1 | 代替煤减少污染 | Clean energy, so the word must mean clean energy.
新能源汽车/1 | 车牌是绿色的 | Green-plated cars, so the word must mean new energy vehicle.
氢能/1 | 燃烧以后只产生水 | Hydrogen power, so the word must mean hydrogen energy.
地热/1 | 冰岛用来发电取暖 | Geothermal, so the word must mean geothermal heat.
储能/1 | 把白天的电存起来 | Energy storage, so the word must mean energy storage.
太阳能热水器/1 | 屋顶上晴天洗澡不花电费 | A solar water heater, so the word must mean solar water heater.
动力电池/1 | 电动汽车最贵的部分 | A traction battery, so the word must mean power battery.
充电站/1 | 服务区开电动车方便 | Charging stations, so the word must mean charging station.
核燃料/1 | 铀是最常用的 | Nuclear fuel, so the word must mean nuclear fuel.
核反应堆/1 | 核电站的心脏 | A reactor, so the word must mean nuclear reactor.
浓缩铀/1 | 天然铀加工以后 | Enriched uranium, so the word must mean enriched uranium.
放射性/1 | 铀长时间接触损害健康 | Radioactive, so the word must mean radioactivity.
核废料/1 | 要密封起来埋在地下 | Nuclear waste, so the word must mean nuclear waste.
核泄漏/1 | 大地震后日本核电站发生 | A nuclear leak, so the word must mean nuclear leak.
核安全/1 | 核电站必须放在第一位 | Nuclear safety, so the word must mean nuclear safety.
核聚变/1 | 太阳发光发热靠的是 | Fusion, so the word must mean nuclear fusion.
铀矿/1 | 开采出来的铀要加工 | Uranium ore, so the word must mean uranium mine.
核辐射/1 | 核电站工作的人穿防护服防止 | Radiation, so the word must mean nuclear radiation.
干涸/1 | 三年没下雨小河已经 | Dried up, so the word must mean to dry up.
汲取/1 | 树根从土里吸收水分 | Drawing in, so the word must mean to absorb.
汲水/1 | 古人用木桶从井里 | Drawing water, so the word must mean to draw water.
地下水/1 | 过度抽取地面会下沉 | Groundwater, so the word must mean groundwater.
淡水/1 | 地球上只占很小一部分 | Fresh water, so the word must mean fresh water.
缺水/1 | 居民每天只能用很少的水 | Water shortage, so the word must mean to lack water.
节水/1 | 洗菜的水浇花 | Saving water, so the word must mean to save water.
水库/1 | 城市自来水来自郊区的 | A reservoir, so the word must mean reservoir.
打井/1 | 没有自来水自己取水 | Digging a well, so the word must mean to sink a well.
浊/1 | 大雨后河水又黄又 | Muddy water, so the word must mean turbid.
二氧化硫/1 | 燃煤产生形成酸雨 | Sulphur dioxide, so the word must mean sulphur dioxide.
硫黄/1 | 制造火药的原料之一 | Sulphur, so the word must mean sulphur.
烟尘/1 | 装了除尘设备排出的少了 | Smoke and dust, so the word must mean soot.
废渣/1 | 工厂的不能随便堆放 | Industrial waste, so the word must mean waste residue.
炉渣/1 | 炼铁产生的可以做水泥 | Slag, so the word must mean slag.
煤渣/1 | 下雪后铺在路上防滑 | Cinders, so the word must mean cinder.
废气/1 | 工厂排放的含有害气体 | Exhaust, so the word must mean waste gas.
汞污染/1 | 湖受污染鱼不能吃 | Mercury pollution, so the word must mean mercury pollution.
污浊/1 | 屋里人多空气 | Stale air, so the word must mean foul.
排污/1 | 工厂偷偷向河里 | Discharging sewage, so the word must mean to discharge pollutants.
耗能/1 | 老式冰箱一个月用很多电 | Energy-hungry, so the word must mean to consume energy.
能耗/1 | 新生产线降低三成 | Energy use, so the word must mean energy consumption.
节约用电/1 | 离开教室随手关灯 | Saving power, so the word must mean to save electricity.
节能灯/1 | 换掉普通灯泡省电费 | Energy-saving bulbs, so the word must mean energy-saving lamp.
碳中和/1 | 很多国家提出本世纪中叶实现 | Net zero, so the word must mean carbon neutrality.
隔热/1 | 窗户夏天屋里不热 | Insulation, so the word must mean heat insulation.
暖气片/1 | 湿衣服放在上面很快干 | A radiator, so the word must mean radiator.
热水器/1 | 洗澡前先打开 | A water heater, so the word must mean water heater.
待机/1 | 电视不看也耗电 | Standby, so the word must mean standby.
电表/1 | 每月来查用了多少度电 | The meter, so the word must mean electricity meter.
耗尽/1 | 石油总有一天会用完 | Used up, so the word must mean to exhaust.
储备/1 | 国家存了大量石油以防万一 | Reserves, so the word must mean to stockpile.
不可再生/1 | 煤和石油用一点少一点 | Non-renewable, so the word must mean non-renewable.
稀缺/1 | 沙漠里水最 | Scarce, so the word must mean scarce.
过度开采/1 | 矿山资源很快用完 | Over-extraction, so the word must mean over-exploitation.
能源危机/1 | 七十年代石油价格大涨 | Energy crisis, so the word must mean energy crisis.
能源结构/1 | 减少煤增加清洁能源 | Energy mix, so the word must mean energy structure.
竭泽而渔/1 | 为眼前利益过度开采 | Draining the pond, so the word must mean to kill the goose that lays the golden eggs.
开源节流/1 | 一方面引水一方面节水 | Earning more and spending less, so the word must mean to increase income and reduce spending.
循环利用/1 | 废纸、塑料瓶都可以 | Recycling, so the word must mean to recycle.
炼油/1 | 厂每年加工一千万吨原油 | Refining oil, so the word must mean oil refining.
输油管/1 | 几千公里把石油送到沿海 | An oil pipeline, so the word must mean oil pipeline.
油井/1 | 每天产几十吨原油 | An oil well, so the word must mean oil well.
钻井/1 | 用机器寻找地下石油 | Drilling, so the word must mean to drill a well.
阀门/1 | 修水管前先关上总 | A valve, so the word must mean valve.
油罐/1 | 加油站地下储存汽油 | Fuel tanks, so the word must mean oil tank.
瓦斯/1 | 煤矿里爆炸后果严重 | Firedamp, so the word must mean gas.
安全阀/1 | 高压锅压力太大自动放气 | A safety valve, so the word must mean safety valve.
石油化工/1 | 塑料、化肥是它的产品 | Petrochemicals, so the word must mean petrochemical industry.
油轮/1 | 港口卸下中东运来的原油 | A tanker, so the word must mean oil tanker.
桥墩/1 | 立在江底承受桥的重量 | Bridge piers, so the word must mean pier.
拱桥/1 | 和水中倒影合起来像一个圆 | An arched bridge, so the word must mean arch bridge.
石拱桥/1 | 河北一千四百多年前建成 | A stone arch bridge, so the word must mean stone arch bridge.
吊桥/1 | 走在上面脚下木板一直动 | A rope bridge, so the word must mean suspension footbridge.
斜拉桥/1 | 桥塔上很多斜着的钢索 | Cable-stayed bridge, so the word must mean cable-stayed bridge.
悬索桥/1 | 金门大桥是有名的 | Suspension bridge, so the word must mean suspension bridge.
跨度/1 | 桥一千多米中间没有桥墩 | Span, so the word must mean span.
桥面/1 | 下雪以后很滑 | The deck, so the word must mean bridge deck.
立交桥/1 | 车不用等红绿灯 | A flyover, so the word must mean interchange.
高架/1 | 避开地面堵车开上 | Elevated road, so the word must mean elevated.
隧道/1 | 火车开进去窗外变黑 | A tunnel, so the word must mean tunnel.
涵洞/1 | 公路下面水从那流过 | A culvert, so the word must mean culvert.
盾构机/1 | 在地下挖土安装隧道墙 | A tunnel borer, so the word must mean tunnel boring machine.
路基/1 | 大雨冲坏铁路停运 | The roadbed, so the word must mean roadbed.
收费站/1 | 开上高速前要经过 | A toll gate, so the word must mean toll station.
车道/1 | 高速公路来回各三条 | Lanes, so the word must mean lane.
弯道/1 | 山路上很多开车要慢 | Bends, so the word must mean bend.
坡度/1 | 路太陡骑车上不去 | Gradient, so the word must mean gradient.
绕行/1 | 前面修路车辆请 | A detour, so the word must mean to detour.
路面/1 | 下过雨很滑走路小心 | The road surface, so the word must mean road surface.
枢纽/1 | 好几条铁路在这里交会 | A hub, so the word must mean hub.
纽带/1 | 语言是人与人沟通的 | A bond, so the word must mean link, bond.
纽扣/1 | 大衣掉了一颗 | A button, so the word must mean button.
中枢/1 | 大脑是神经系统的 | The centre, so the word must mean centre.
渡口/1 | 没有桥要去坐船过江 | A ferry crossing, so the word must mean ferry crossing.
渡轮/1 | 每天坐它到对岸上班 | A ferry, so the word must mean ferry.
渡船/1 | 老人撑着小船送村民过河 | A ferry boat, so the word must mean ferry boat.
摆渡/1 | 在河上送人过河三十年 | Ferrying, so the word must mean to ferry.
过渡/1 | 从小学到中学的阶段 | Transition, so the word must mean transition.
远渡重洋/1 | 十八岁就到国外留学 | Crossing oceans, so the word must mean to travel across the seas.
打桩/1 | 工地机器声音很远都能听到 | Pile driving, so the word must mean to drive piles.
木桩/1 | 绳子系在河边的 | A wooden stake, so the word must mean wooden stake.
桩基/1 | 高楼要打很深才稳 | Pile foundations, so the word must mean pile foundation.
塔吊/1 | 工地上往楼顶吊钢材 | A tower crane, so the word must mean tower crane.
吊车/1 | 把出事汽车从沟里吊上来 | A crane truck, so the word must mean crane.
起重机/1 | 港口吊集装箱上船 | Cranes, so the word must mean crane.
起吊/1 | 十几吨重的零件要吊起来 | Hoisting, so the word must mean to hoist.
吊装/1 | 最后一段桥面装上 | Lifted into place, so the word must mean to hoist into position.
撑杆跳/1 | 拿着长杆跳过五米多 | Pole vault, so the word must mean pole vault.
充电桩/1 | 停车场电动车充电方便 | Charging posts, so the word must mean charging pile.
缝隙/1 | 阳光从门的照进来 | A crack, so the word must mean gap.
间隙/1 | 利用工作的空学外语 | Spare moments, so the word must mean interval.
空隙/1 | 书架摆得满满的 | Space, so the word must mean gap.
拧紧/1 | 用完水把水龙头关好 | Tightening, so the word must mean to tighten.
拧开/1 | 用力打开瓶盖 | Unscrewing, so the word must mean to unscrew.
拧干/1 | 洗完衣服先挤出水再挂 | Wringing, so the word must mean to wring out.
撬开/1 | 用刀把罐头盖打开 | Prying open, so the word must mean to prise open.
环绕/1 | 小村四面被青山 | Surrounded, so the word must mean to surround.
围绕/1 | 地球绕着太阳转 | Revolving, so the word must mean to revolve around.
绕道/1 | 前面修路只好 | A detour, so the word must mean to make a detour.
扳手/1 | 爸爸拿它拧紧螺母 | A spanner, so the word must mean wrench.
钳子/1 | 电工用它剪断电线 | Pliers, so the word must mean pliers.
锯子/1 | 把木板锯成两半 | A saw, so the word must mean saw.
刨子/1 | 木匠把桌面刨平 | A plane, so the word must mean plane.
斧头/1 | 把大木头砍成柴 | An axe, so the word must mean axe.
铲子/1 | 在沙滩上挖沙子 | A spade, so the word must mean shovel.
电钻/1 | 在墙上打孔挂画 | A drill, so the word must mean electric drill.
电锯/1 | 几分钟锯断大木头 | A power saw, so the word must mean electric saw.
锅铲/1 | 妈妈炒菜时手里拿的 | A spatula, so the word must mean spatula.
凿子/1 | 石匠敲着在石头上刻字 | A chisel, so the word must mean chisel.
刀刃/1 | 刀用久了变钝 | The blade, so the word must mean blade.
刀柄/1 | 切菜时握紧 | The handle, so the word must mean knife handle.
手柄/1 | 拿着游戏的玩 | A controller, so the word must mean handle.
把柄/1 | 不让别人抓住任何 | Leverage, so the word must mean handle, something to use against one.
弹簧/1 | 圆珠笔里按一下笔芯出来 | A spring, so the word must mean spring.
锯齿/1 | 叶子边上一个个小尖 | Saw teeth, so the word must mean sawtooth.
刨花/1 | 木匠工作台下卷卷的 | Wood shavings, so the word must mean wood shavings.
迎刃而解/1 | 找到关键其他困难就 | Easily solved, so the word must mean to be readily solved.
游刃有余/1 | 管理班级很轻松 | With ease, so the word must mean to handle with ease.
刨根问底/1 | 不懂的事一定要问明白 | Getting to the bottom, so the word must mean to get to the root of.
舵手/1 | 风浪大紧握舵 | The helmsman, so the word must mean helmsman.
掌舵/1 | 老船长驾驶这条船 | At the helm, so the word must mean to steer.
船舵/1 | 船长转动它改变方向 | A rudder, so the word must mean rudder.
方向舵/1 | 飞机尾部控制方向 | A rudder, so the word must mean rudder.
游艇/1 | 周末租一条出海玩 | A yacht, so the word must mean yacht.
快艇/1 | 海面飞快开过留下白浪 | A speedboat, so the word must mean speedboat.
潜艇/1 | 在海底航行好几个月 | A submarine, so the word must mean submarine.
救生艇/1 | 大船遇险乘客登上 | Lifeboats, so the word must mean lifeboat.
皮划艇/1 | 在湖上比赛谁划得快 | Kayaks, so the word must mean kayak.
舰艇/1 | 海军在海上救援演习 | Naval vessels, so the word must mean naval vessel.
砌墙/1 | 工人用砖一天砌一米多 | Laying bricks, so the word must mean to build a wall.
堆砌/1 | 作文漂亮词语多内容空 | Piling up words, so the word must mean to pile up.
脚手架/1 | 工人站在上面刷墙 | Scaffolding, so the word must mean scaffolding.
施工/1 | 前方车辆请慢行 | Construction, so the word must mean construction.
工地/1 | 进去一定戴安全帽 | A building site, so the word must mean construction site.
承重/1 | 柱子千万不能拆 | Load-bearing, so the word must mean load-bearing.
封顶/1 | 大楼建到最高明年住人 | Topped out, so the word must mean to top out.
抗震/1 | 房子地震时不容易倒 | Earthquake-proof, so the word must mean quake-resistant.
拱形/1 | 古老的城门车从下面过 | An arch, so the word must mean arched.
吊顶/1 | 装修客厅还装了灯 | A false ceiling, so the word must mean suspended ceiling.
梭子/1 | 织布机前来回飞快穿着 | A shuttle, so the word must mean shuttle.
织布机/1 | 工业革命时用蒸汽带动 | A loom, so the word must mean loom.
穿梭/1 | 车辆来来往往不停 | Shuttling, so the word must mean to shuttle.
纺车/1 | 妇女把棉花纺成线 | A spinning wheel, so the word must mean spinning wheel.
活字印刷/1 | 宋朝发明印书更快 | Movable type, so the word must mean movable-type printing.
水车/1 | 河边转着把水送进田 | A waterwheel, so the word must mean waterwheel.
筒车/1 | 竹筒把河水提上来 | A bamboo waterwheel, so the word must mean noria.
风箱/1 | 铁匠拉它让炉火更旺 | Bellows, so the word must mean bellows.
算盘/1 | 以前会计用它算账 | An abacus, so the word must mean abacus.
地动仪/1 | 张衡发明测地震方向 | A seismoscope, so the word must mean seismoscope.
引擎/1 | 网上找资料用搜索 | A search engine, so the word must mean engine.
蒸汽机/1 | 十八世纪改良推动工业革命 | The steam engine, so the word must mean steam engine.
内燃机/1 | 汽油机和柴油机都是 | Combustion engines, so the word must mean internal combustion engine.
发动机/1 | 飞机的出了故障 | An engine, so the word must mean engine.
马力/1 | 跑车发动机有五百 | Horsepower, so the word must mean horsepower.
曲轴/1 | 把上下运动变成转动 | A crankshaft, so the word must mean crankshaft.
涡轮/1 | 发动机装了它增压 | A turbo, so the word must mean turbine.
燃烧室/1 | 汽油在里面燃烧 | A combustion chamber, so the word must mean combustion chamber.
曲柄/1 | 早期汽车用它摇动启动 | A crank, so the word must mean crank.
油门/1 | 司机加大车开出去 | The accelerator, so the word must mean accelerator.
镀金/1 | 手表不是纯金只是表面 | Gold-plated, so the word must mean gold-plated.
镀银/1 | 餐具亮闪闪里面是铜 | Silver-plated, so the word must mean silver-plated.
电镀/1 | 厂排出的废水含重金属 | Electroplating, so the word must mean electroplating.
涂层/1 | 锅有一层不粘的 | A coating, so the word must mean coating.
防锈/1 | 铁栏杆刷了一层漆 | Rustproofing, so the word must mean rustproof.
打磨/1 | 木匠把桌面磨得光光的 | Sanding, so the word must mean to polish.
抛光/1 | 玉亮得能照出人影 | Polished, so the word must mean to polish.
喷漆/1 | 旧自行车像新的一样 | Spray-painted, so the word must mean to spray-paint.
砂纸/1 | 把木板上的毛刺磨平 | Sandpaper, so the word must mean sandpaper.
砂轮/1 | 师傅在转动的上面磨刀 | A grinding wheel, so the word must mean grinding wheel.
粘贴/1 | 电脑上复制和 | Pasting, so the word must mean to paste.
粘合/1 | 胶水把木头和玻璃粘牢 | Bonding, so the word must mean to bond.
胶带/1 | 透明的贴好破书页 | Tape, so the word must mean adhesive tape.
双面胶/1 | 贴照片看不出痕迹 | Double-sided tape, so the word must mean double-sided tape.
粘性/1 | 米煮出来的饭粘在一起 | Stickiness, so the word must mean stickiness.
笔筒/1 | 桌上插满铅笔 | A pen pot, so the word must mean pen holder.
话筒/1 | 主持人拿着走上舞台 | A microphone, so the word must mean microphone.
竹筒/1 | 米装进去烤出竹子香味 | A bamboo tube, so the word must mean bamboo tube.
万花筒/1 | 转动里面图案一直在变 | A kaleidoscope, so the word must mean kaleidoscope.
筒子楼/1 | 一层楼共用一个厨房 | Tube-style flats, so the word must mean tube-shaped apartment building.
齿轮/1 | 钟表里一个带动一个转 | Gears, so the word must mean gear.
轴承/1 | 轮子转得不顺可能坏了 | Bearings, so the word must mean bearing.
传送带/1 | 机场行李一件件送出来 | A conveyor belt, so the word must mean conveyor belt.
滑轮/1 | 往楼上拉东西省力 | A pulley, so the word must mean pulley.
链条/1 | 自行车的掉了 | The chain, so the word must mean chain.
液压/1 | 挖土机铲子靠这个系统 | Hydraulics, so the word must mean hydraulic.
气压/1 | 高山上较低水不到一百度就开 | Air pressure, so the word must mean air pressure.
鼓风机/1 | 往高炉里送空气 | A blower, so the word must mean blower.
发条/1 | 上紧玩具汽车自己跑 | A clockwork spring, so the word must mean clockwork spring.
螺纹/1 | 螺丝的磨平拧不紧 | Threads, so the word must mean screw thread.
原型/1 | 机器还要多次改进才生产 | A prototype, so the word must mean prototype.
试制/1 | 工厂正在做新型电动车 | Trial production, so the word must mean to trial-produce.
灯泡/1 | 台灯的坏了换一个 | A bulb, so the word must mean light bulb.
蓝图/1 | 市长描绘城市未来十年 | A blueprint, so the word must mean blueprint.
图纸/1 | 工人按照施工不能出错 | Drawings, so the word must mean drawing.
测绘/1 | 修路前测量画出地图 | Surveying, so the word must mean surveying and mapping.
风洞/1 | 新飞机设计时做实验 | A wind tunnel, so the word must mean wind tunnel.
永动机/1 | 根据能量守恒不可能造出 | Perpetual motion, so the word must mean perpetual motion machine.
机械臂/1 | 工厂里自动焊接车身 | A robot arm, so the word must mean robotic arm.
拉链/1 | 书包的坏了拉不上 | A zip, so the word must mean zip.
砂石/1 | 修路需要大量的和水泥 | Sand and gravel, so the word must mean sand and stone.
沥青/1 | 新铺的路面又黑又平 | Asphalt, so the word must mean asphalt.
瓦片/1 | 大风刮掉屋顶上几块 | Roof tiles, so the word must mean tile.
砖瓦/1 | 村里有座烧它们的窑 | Bricks and tiles, so the word must mean bricks and tiles.
石灰/1 | 以前把墙刷成白色 | Lime, so the word must mean lime.
水泥/1 | 加上沙子和水砌墙 | Cement, so the word must mean cement.
木材/1 | 森林出产优质 | Timber, so the word must mean timber.
渣土/1 | 卡车要盖好不能掉在路上 | Muck, so the word must mean construction waste.
瓦房/1 | 草房后来盖起三间 | A tile-roofed house, so the word must mean tile-roofed house.
粘土/1 | 孩子们捏出小动物 | Clay, so the word must mean clay.
古埃及/1 | 保存死者身体几千年不腐 | Ancient Egypt, so the word must mean ancient Egypt.
尼罗河/1 | 非洲最长的河流入地中海 | The Nile, so the word must mean Nile.
法老/1 | 胡夫金字塔是他的陵墓 | A pharaoh, so the word must mean pharaoh.
木乃伊/1 | 三千年前外面包着布 | A mummy, so the word must mean mummy.
楔形文字/1 | 用尖笔在湿泥上写 | Cuneiform, so the word must mean cuneiform.
象形文字/1 | 古埃及像一幅幅小画 | Hieroglyphs, so the word must mean hieroglyphs.
狮身人面像/1 | 金字塔附近守了四千多年 | The Sphinx, so the word must mean Sphinx.
泥板/1 | 两河流域刻着文字的 | Clay tablets, so the word must mean clay tablet.
古巴比伦/1 | 空中花园在那里 | Babylon, so the word must mean ancient Babylon.
莎草纸/1 | 古埃及人用河边的草做成 | Papyrus, so the word must mean papyrus.
篆书/1 | 印章上弯弯曲曲不容易认 | Seal script, so the word must mean seal script.
小篆/1 | 秦始皇定为标准字体 | Small seal script, so the word must mean small seal script.
篆刻/1 | 拿小刀在石头上刻名字 | Seal carving, so the word must mean seal engraving.
帛书/1 | 马王堆写在丝绸上的 | Silk manuscripts, so the word must mean silk manuscript.
简帛/1 | 纸普及以前把字写在上面 | Bamboo and silk, so the word must mean bamboo slips and silk.
书同文/1 | 秦朝让各地用同一种文字 | One script, so the word must mean standardising the script.
金文/1 | 铸在青铜器上的文字 | Bronze inscriptions, so the word must mean bronze script.
刻字/1 | 在钢笔上刻名字 | Engraving, so the word must mean to engrave.
隶变/1 | 笔画由弯曲变平直 | The clerical change, so the word must mean clerical transformation.
字形/1 | 从甲骨文到楷书变化很大 | Character shape, so the word must mean form of a character.
殷墟/1 | 河南安阳出土大批甲骨 | Yinxu, so the word must mean Yin Ruins.
殷商/1 | 那时人们已会铸造青铜器 | The Shang period, so the word must mean Yin-Shang.
废墟/1 | 大火后老宅子变成 | Ruins, so the word must mean ruins.
甲骨/1 | 商朝人在上面刻字记占卜 | Oracle bones, so the word must mean tortoise shells and bones.
兽骨/1 | 洞里烧过的动物骨头 | Animal bones, so the word must mean animal bone.
卜辞/1 | 记下商王问天气、问收成 | Divination texts, so the word must mean oracle inscription.
礼器/1 | 贵族祭祀时用的青铜鼎 | Ritual vessels, so the word must mean ritual vessel.
野兽/1 | 古人点火堆赶走 | Wild beasts, so the word must mean wild animal.
遗存/1 | 新石器时代的文化 | Remains, so the word must mean remains.
都城/1 | 唐朝的长安 | The capital, so the word must mean capital city.
墓葬/1 | 古代出土大量陶器玉器 | Burials, so the word must mean tomb.
陪葬品/1 | 墓里的铜镜、玉器 | Grave goods, so the word must mean burial objects.
安葬/1 | 家人把他埋在家乡小山上 | Burying, so the word must mean to bury.
葬礼/1 | 很多人来向老科学家告别 | A funeral, so the word must mean funeral.
陵墓/1 | 明朝十三位皇帝的 | Imperial tombs, so the word must mean mausoleum.
墓室/1 | 考古队员走进看到壁画 | The burial chamber, so the word must mean tomb chamber.
火葬/1 | 城市提倡节约土地 | Cremation, so the word must mean cremation.
秦始皇陵/1 | 兵马俑在它附近发现 | The First Emperor's tomb, so the word must mean Mausoleum of Qin Shi Huang.
墓碑/1 | 只刻名字和一句话 | A gravestone, so the word must mean tombstone.
盗墓/1 | 违法破坏文物 | Tomb robbing, so the word must mean grave robbing.
巫师/1 | 部落遇大事请他占卜 | A shaman, so the word must mean wizard, shaman.
巫术/1 | 古人用它治病没有根据 | Magic, so the word must mean witchcraft.
原始宗教/1 | 人们崇拜太阳、高山、大河 | Early religion, so the word must mean primitive religion.
图腾崇拜/1 | 把熊当作自己的祖先 | Totemism, so the word must mean totem worship.
万物有灵/1 | 山、河、大树都有灵魂 | Animism, so the word must mean animism.
神兽/1 | 青龙白虎守护四方 | Mythical beasts, so the word must mean divine beast.
求雨/1 | 大旱时举行仪式 | Praying for rain, so the word must mean to pray for rain.
祭品/1 | 祭祖时桌上摆满 | Offerings, so the word must mean sacrificial offering.
祭司/1 | 古埃及神庙负责祭祀的人 | A priest, so the word must mean priest.
驱邪/1 | 端午节挂艾草 | Warding off evil, so the word must mean to ward off evil.
骆驼/1 | 被叫作沙漠之舟 | Camels, so the word must mean camel.
驼队/1 | 驮着丝绸走过沙漠 | A caravan, so the word must mean camel train.
驼峰/1 | 骆驼存脂肪的地方 | The hump, so the word must mean camel hump.
驼铃/1 | 远处叮当叮当的声音 | Camel bells, so the word must mean camel bell.
戈壁/1 | 一望无际路边几乎没有草 | The Gobi, so the word must mean gobi desert.
驿站/1 | 送信的人到这里换马 | A post station, so the word must mean relay station.
驿道/1 | 连着京城和各地的大路 | Post roads, so the word must mean post road.
西域/1 | 汉朝派使者打通丝绸之路 | The Western Regions, so the word must mean Western Regions.
商队/1 | 中国商人和波斯商人 | A caravan, so the word must mean caravan.
互市/1 | 边境用茶叶换马 | Border trade, so the word must mean border market.
商贾/1 | 扬州来来往往很多 | Merchants, so the word must mean merchants.
驮运/1 | 山高路险用马运货 | Pack transport, so the word must mean to carry by pack animal.
驮马/1 | 背上放着两袋茶叶 | A packhorse, so the word must mean packhorse.
马鞍/1 | 骑马前放好系紧 | A saddle, so the word must mean saddle.
茶马古道/1 | 穿过云南四川通到西藏 | The Tea Horse Road, so the word must mean Ancient Tea Horse Road.
马帮/1 | 高山深谷运输货物 | A mule caravan, so the word must mean horse caravan.
皮毛/1 | 游牧民族用它换布和茶 | Furs, so the word must mean fur.
贩运/1 | 祖辈靠南北运茶叶为生 | Trading goods, so the word must mean to transport for sale.
货郎/1 | 来村里卖针线和糖果 | A pedlar, so the word must mean pedlar.
商帮/1 | 晋商是有名的 | Merchant guilds, so the word must mean merchant group.
桅杆/1 | 船上挂着三面大帆 | A mast, so the word must mean mast.
抛锚/1 | 汽车半路上坏了 | Broke down, so the word must mean to break down.
起锚/1 | 天亮船长下令出发 | Weighing anchor, so the word must mean to weigh anchor.
铁锚/1 | 水手抛进海里的 | An anchor, so the word must mean anchor.
宝船/1 | 明朝船队里最大的船 | Treasure ships, so the word must mean treasure ship.
船队/1 | 十几条渔船一起出海 | A fleet, so the word must mean fleet.
下西洋/1 | 明朝船队七次到非洲 | Voyages to the West, so the word must mean voyages to the Western Seas.
罗盘/1 | 航海家辨别方向 | A compass, so the word must mean compass.
海上丝绸之路/1 | 泉州是重要港口 | The sea silk road, so the word must mean Maritime Silk Road.
水手/1 | 船上一边拉帆一边唱歌 | Sailors, so the word must mean sailor.
遣唐使/1 | 日本派来学习的人 | Japanese envoys to Tang, so the word must mean envoy to Tang China.
派遣/1 | 学校派老师到山区支教 | Dispatching, so the word must mean to dispatch.
使节/1 | 各国出席国际会议 | Envoys, so the word must mean envoy.
使团/1 | 上百人出访邻国 | A delegation, so the word must mean mission.
出使/1 | 奉命去西域十几年 | Going as envoy, so the word must mean to go as an envoy.
通商/1 | 两国以后商船越来越多 | Trading, so the word must mean to have trade relations.
朝贡/1 | 小国定期向中原王朝进献 | Paying tribute, so the word must mean to pay tribute.
东渡/1 | 鉴真六次终于到了日本 | Crossing east, so the word must mean to cross the sea eastward.
互派/1 | 两所大学每年交换学生 | Exchanging, so the word must mean to send to each other.
国书/1 | 使者带着皇帝的 | Credentials, so the word must mean letter of credence.
玉玺/1 | 皇帝命令盖上才算数 | The imperial seal, so the word must mean imperial jade seal.
诏书/1 | 听人宣读皇帝的命令 | An edict, so the word must mean imperial edict.
下诏/1 | 皇帝发命令减免赋税 | Issuing an edict, so the word must mean to issue an edict.
即位/1 | 十六岁做了皇帝 | Taking the throne, so the word must mean to ascend the throne.
退位/1 | 清朝最后一位皇帝宣布 | Giving up the throne, so the word must mean to abdicate.
禅让/1 | 传给有才德的人不传儿子 | Passing to the worthy, so the word must mean to abdicate in favour of another.
传位/1 | 老皇帝传给第三个儿子 | Passing the throne, so the word must mean to pass on the throne.
皇权/1 | 秦始皇统一后空前强大 | Imperial power, so the word must mean imperial power.
龙椅/1 | 太和殿正中摆着 | The throne, so the word must mean dragon throne.
国号/1 | 唐朝的是唐 | The dynastic name, so the word must mean name of a dynasty.
郡县制/1 | 秦朝废除分封推行 | Commanderies and counties, so the word must mean prefecture-county system.
郡守/1 | 一个郡的最高长官 | Governor, so the word must mean prefect.
衙门/1 | 老百姓有冤屈去告状 | The yamen, so the word must mean government office.
县令/1 | 清廉把一个县管得很好 | County magistrate, so the word must mean county magistrate.
知府/1 | 明清一个府的长官 | Prefect, so the word must mean prefect.
官府/1 | 古代修大桥由它出钱 | The authorities, so the word must mean local government.
地方官/1 | 管税收、审案子、修水利 | Local officials, so the word must mean local official.
巡抚/1 | 清朝一个省的军政大事 | Provincial governor, so the word must mean governor.
分封制/1 | 周朝把土地分给王族功臣 | Enfeoffment, so the word must mean feudal system.
告示/1 | 城门口贴出通知百姓 | A notice, so the word must mean public notice.
匈奴/1 | 秦朝修长城防备北方的 | The Xiongnu, so the word must mean Xiongnu.
游牧民族/1 | 跟着水草走 | Nomads, so the word must mean nomadic people.
酋长/1 | 部落大事由他和老人商量 | Chief, so the word must mean chieftain.
蛮族/1 | 罗马人称边境以外的部落 | Barbarians, so the word must mean barbarian tribes.
野蛮/1 | 抢别人东西的行为 | Barbaric, so the word must mean savage.
部族/1 | 草原上结成强大联盟 | Tribes, so the word must mean tribe.
和亲/1 | 汉朝把公主嫁给匈奴首领 | A marriage alliance, so the word must mean marriage for peace.
可汗/1 | 成吉思汗被推举为大 | Khan, so the word must mean khan.
蒙古包/1 | 草原上可以拆开搬走 | A yurt, so the word must mean yurt.
马背/1 | 蒙古族被称为上的民族 | Horseback, so the word must mean horseback.
城堡/1 | 欧洲贵族住在高大的 | A castle, so the word must mean castle.
古堡/1 | 山顶上八百年历史 | An old castle, so the word must mean ancient castle.
堡垒/1 | 海边防守海岸的 | A fort, so the word must mean fortress.
护城河/1 | 故宫城墙外水面很宽 | A moat, so the word must mean moat.
关隘/1 | 山海关是长城东边的 | A pass, so the word must mean strategic pass.
城楼/1 | 站在上面看到整座城 | A gate tower, so the word must mean city gate tower.
城池/1 | 古代打仗争夺它和土地 | Walled cities, so the word must mean city.
箭楼/1 | 前门上有射箭的小窗口 | An archery tower, so the word must mean arrow tower.
炮台/1 | 海边旧的成了博物馆 | A battery, so the word must mean fort.
城门/1 | 晚上关上不让出入 | City gates, so the word must mean city gate.
宝剑/1 | 祖传的捐给博物馆 | A fine sword, so the word must mean sword.
青铜剑/1 | 两千多年前出土还发光 | A bronze sword, so the word must mean bronze sword.
刀剑/1 | 陈列着各个朝代的 | Swords and blades, so the word must mean swords.
剑术/1 | 从小学习表演漂亮 | Swordsmanship, so the word must mean swordsmanship.
干戈/1 | 一点小事没必要大动 | Weapons, so the word must mean war, arms.
化干戈为玉帛/1 | 两国谈判从此友好 | Making peace, so the word must mean to turn war into peace.
击剑/1 | 运动员穿白衣戴面罩 | Fencing, so the word must mean fencing.
剑客/1 | 小说里背着长剑独来独往 | A swordsman, so the word must mean swordsman.
兵器/1 | 古代的刀、剑、戈 | Weapons, so the word must mean weapon.
盾牌/1 | 士兵一手拿刀一手拿 | A shield, so the word must mean shield.
雅典/1 | 古希腊出了很多哲学家 | Athens, so the word must mean Athens.
斯巴达/1 | 以军事强大闻名 | Sparta, so the word must mean Sparta.
奥林匹亚/1 | 古代奥运会在那里举行 | Olympia, so the word must mean Olympia.
罗马帝国/1 | 领土包括整个地中海沿岸 | The Roman Empire, so the word must mean Roman Empire.
斗兽场/1 | 罗马圆形建筑容纳几万人 | The Colosseum, so the word must mean Colosseum.
元老院/1 | 古罗马讨论国家大事的机构 | The Senate, so the word must mean senate.
神殿/1 | 雅典山顶白色大理石建的 | A temple, so the word must mean temple.
柱廊/1 | 一根根石柱排成一排 | A colonnade, so the word must mean colonnade.
共和/1 | 古罗马后来才变成帝国 | A republic, so the word must mean republic.
罗马法/1 | 很多欧洲法律受它影响 | Roman law, so the word must mean Roman law.
隋朝/1 | 只有三十多年开凿大运河 | The Sui, so the word must mean Sui dynasty.
大运河/1 | 把北方和南方连在一起 | The Grand Canal, so the word must mean Grand Canal.
长安/1 | 唐朝外国商人住在那里 | Chang'an, so the word must mean Chang'an.
互鉴/1 | 不同文明交流取长补短 | Learning from each other, so the word must mean mutual learning.
兼容并蓄/1 | 唐朝文化吸收外来东西 | Embracing all, so the word must mean to embrace all.
古今中外/1 | 收集各个时代各国名人故事 | All times and places, so the word must mean ancient and modern, Chinese and foreign.
外来文化/1 | 佛教后来和中国文化融合 | Foreign culture, so the word must mean foreign culture.
本土化/1 | 外国快餐店推出包子米饭 | Localisation, so the word must mean localisation.
胡服/1 | 国王让士兵穿上方便骑射 | Nomad dress, so the word must mean nomadic clothing.
和而不同/1 | 不同文化互相尊重共同发展 | Harmony in difference, so the word must mean harmony without uniformity.
惭愧/1 | 老师表扬我心里觉得不够 | Ashamed, so the word must mean ashamed.
羞愧/1 | 说谎被发现满脸通红 | Shamefaced, so the word must mean ashamed.
内疚/1 | 没去看生病的朋友 | Guilty, so the word must mean guilty conscience.
愧疚/1 | 陪父母的时间太少 | Remorse, so the word must mean guilt.
问心无愧/1 | 尽了最大努力 | A clear conscience, so the word must mean to have a clear conscience.
当之无愧/1 | 救了三个孩子英雄称号 | Well deserved, so the word must mean fully deserving.
心安理得/1 | 拿了别人的东西不脸红 | Unashamed, so the word must mean to feel no qualms.
无地自容/1 | 想起说过的可笑的话 | Mortified, so the word must mean to want the ground to swallow one.
良心不安/1 | 留下别人丢的钱 | A troubled conscience, so the word must mean conscience-stricken.
过意不去/1 | 这么晚还来送我 | Feeling bad, so the word must mean to feel sorry.
恭敬/1 | 把茶递给爷爷 | Respectfully, so the word must mean respectful.
谦恭/1 | 有名却从不摆架子 | Modest and polite, so the word must mean courteous.
毕恭毕敬/1 | 长辈面前站得笔直 | Very respectful, so the word must mean reverent.
洗耳恭听/1 | 请说吧我们 | All ears, so the word must mean to listen respectfully.
恭维/1 | 这些话别太当真 | Flattery, so the word must mean flattery.
敬畏/1 | 对大自然怀有 | Awe, so the word must mean awe.
畏惧/1 | 面对困难从不 | Fear, so the word must mean to fear.
无畏/1 | 消防员冲进着火大楼 | Fearless, so the word must mean fearless.
后生可畏/1 | 十五岁少年赢了老棋手 | Impressive youth, so the word must mean the young deserve respect.
望而生畏/1 | 书又厚又难让人 | Daunting, so the word must mean to be daunted.
厚道/1 | 从来不占别人便宜 | Kind and honest, so the word must mean kind-hearted.
宽厚/1 | 邻居有矛盾都找他评理 | Generous, so the word must mean magnanimous.
忠厚/1 | 老实人答应的事一定办到 | Honest, so the word must mean honest and kind.
敦厚/1 | 老教授性格温和 | Gentle and sincere, so the word must mean honest and simple.
淳朴/1 | 村民热情请我们吃饭 | Unspoilt, so the word must mean simple and honest.
厚此薄彼/1 | 对两个孩子不能不一样 | Favouritism, so the word must mean to favour one over another.
厚爱/1 | 感谢大家对我的 | Kindness, so the word must mean great kindness.
待人接物/1 | 她很有礼貌 | Dealing with people, so the word must mean the way one treats people.
民风/1 | 晚上睡觉不用锁门 | Local customs, so the word must mean folk customs.
与人为善/1 | 邻居有困难第一个帮忙 | Kindness to others, so the word must mean to be kind to others.
衷心/1 | 感谢大家的帮助 | Heartfelt, so the word must mean heartfelt.
由衷/1 | 老师为学生成绩高兴 | Sincere, so the word must mean from the heart.
初衷/1 | 当老师是为了让孩子读书 | The original aim, so the word must mean original intention.
苦衷/1 | 这么做一定有原因 | Hidden reasons, so the word must mean difficulty one cannot voice.
言不由衷/1 | 嘴上说没关系心里难过 | Insincere, so the word must mean not to mean what one says.
无动于衷/1 | 大家感动哭了只有他 | Unmoved, so the word must mean unmoved.
真挚/1 | 信写得让人感动 | Sincere, so the word must mean sincere.
诚挚/1 | 向来宾表示欢迎 | Cordial, so the word must mean cordial.
挚友/1 | 从小一起长大无话不谈 | A close friend, so the word must mean bosom friend.
推心置腹/1 | 谈了一晚误会解开 | Heart to heart, so the word must mean to confide fully.
告诫/1 | 父亲说做人要诚实 | Admonishing, so the word must mean to warn.
训诫/1 | 上课玩手机被老师批评 | A telling-off, so the word must mean to reprimand.
劝诫/1 | 朋友劝他少熬夜 | Exhorting, so the word must mean to admonish.
规劝/1 | 家人劝他放弃危险想法 | Persuasion, so the word must mean to advise.
前车之鉴/1 | 别人的失败要记住 | A warning example, so the word must mean lesson from others' mistakes.
引以为戒/1 | 事故的教训以后别再犯 | Taking warning, so the word must mean to take as a warning.
警钟/1 | 事故给司机敲响了 | An alarm bell, so the word must mean warning bell.
良药苦口/1 | 朋友的批评不好听但有好处 | Bitter medicine, so the word must mean good advice is hard to hear.
苦口婆心/1 | 妈妈劝了他半天 | Earnest persuasion, so the word must mean to urge patiently.
循循善诱/1 | 老师上课学生都喜欢听 | Patient guidance, so the word must mean to guide patiently.
顽固/1 | 爷爷怎么劝都不去医院 | Stubborn, so the word must mean stubborn.
顽皮/1 | 孩子常常爬到树上 | Naughty, so the word must mean naughty.
顽强/1 | 小草从石缝里长出 | Tenacious, so the word must mean tenacious.
狡猾/1 | 骗子换几种方法骗钱 | Crafty, so the word must mean cunning.
狡诈/1 | 商人很多顾客上过当 | Deceitful, so the word must mean crafty.
狡辩/1 | 证据摆在面前别再 | Quibbling, so the word must mean to quibble.
奸诈/1 | 戏里阴险的人物 | Treacherous, so the word must mean treacherous.
老奸巨猾/1 | 骗子换好几个名字 | A wily old fox, so the word must mean old and crafty.
执迷不悟/1 | 大家说是骗局他还投钱 | Refusing to see sense, so the word must mean to persist in error.
一意孤行/1 | 队长不听意见比赛输了 | Going it alone, so the word must mean to insist on one's own way.
偏袒/1 | 裁判不能偏向任何一方 | Taking sides, so the word must mean to be partial to.
袒护/1 | 孩子做错父母不应该 | Shielding, so the word must mean to shield.
包庇/1 | 帮着隐瞒朋友偷东西 | Harbouring, so the word must mean to cover up for.
护短/1 | 自己班学生犯错照样批评 | Covering faults, so the word must mean to shield one's own faults.
贵贱/1 | 职业不分 | High or low, so the word must mean noble and humble.
公道/1 | 店里价钱从不骗顾客 | Fair, so the word must mean fair.
公允/1 | 评论讲优点也指出缺点 | Even-handed, so the word must mean impartial.
大公无私/1 | 从不为亲戚开后门 | Selfless, so the word must mean selfless.
公私分明/1 | 不用单位的车办私事 | Keeping things separate, so the word must mean to keep public and private apart.
假公济私/1 | 用公款请朋友吃饭 | Abuse of office, so the word must mean to use public office for private gain.
馈赠/1 | 老朋友送给他的画 | A gift, so the word must mean to present as a gift.
报答/1 | 好好学习回报父母 | Repaying kindness, so the word must mean to repay.
知恩图报/1 | 记着要还邻居的情 | Grateful, so the word must mean to repay kindness.
饮水思源/1 | 每年回母校看望老师 | Remembering one's roots, so the word must mean to remember where one came from.
恩将仇报/1 | 我救了他他却害我 | Ingratitude, so the word must mean to repay kindness with evil.
忘恩负义/1 | 发达后不理帮过他的人 | Ungrateful, so the word must mean ungrateful.
以德报怨/1 | 吵过架邻居生病还帮忙 | Returning good for evil, so the word must mean to repay ill will with kindness.
礼尚往来/1 | 人家送礼物我们也回送 | Give and take, so the word must mean courtesy demands reciprocity.
拯救/1 | 医生一整夜救了病人 | Saving, so the word must mean to save.
恩人/1 | 资助他上大学的老人 | A benefactor, so the word must mean benefactor.
豁达/1 | 不顺心也笑着面对 | Open-minded, so the word must mean broad-minded.
豁然开朗/1 | 听了讲解难题解开 | Suddenly clear, so the word must mean to suddenly see the light.
宽宏大量/1 | 原谅打破玻璃的孩子 | Magnanimous, so the word must mean magnanimous.
小肚鸡肠/1 | 别这么人家不是故意的 | Petty, so the word must mean petty.
海纳百川/1 | 城市欢迎世界各地的人 | All-embracing, so the word must mean to embrace all.
大度/1 | 被误会也不生气 | Generous-minded, so the word must mean magnanimous.
气量/1 | 不要为小事生气 | Tolerance, so the word must mean tolerance.
不计前嫌/1 | 两人又成好朋友 | Forgetting past grudges, so the word must mean to let bygones be bygones.
心平气和/1 | 有矛盾坐下来谈 | Calmly, so the word must mean calm.
想得开/1 | 丢了钱包也不难过 | Taking it lightly, so the word must mean to take things philosophically.
贪婪/1 | 国王想把东西都变成金子 | Greedy, so the word must mean greedy.
贪得无厌/1 | 三套房还想要更多 | Insatiable, so the word must mean insatiably greedy.
吝啬/1 | 一块钱都舍不得给 | Stingy, so the word must mean stingy.
一毛不拔/1 | 让他捐钱比登天还难 | Miserly, so the word must mean miserly.
不吝/1 | 写得不好请指教 | Not grudging, so the word must mean not to stint.
见利忘义/1 | 为钱卖了朋友的秘密 | Betraying for profit, so the word must mean to forget loyalty for gain.
损人利己/1 | 往别人门口倒垃圾 | Harming others, so the word must mean to harm others to benefit oneself.
自私自利/1 | 只顾自己 | Selfish, so the word must mean selfish.
利他/1 | 动物把食物分给同伴 | Helping others, so the word must mean altruistic.
守财奴/1 | 有钱却从来不花 | A miser, so the word must mean miser.
卑鄙/1 | 背后造谣害人 | Despicable, so the word must mean despicable.
鄙视/1 | 大家看不起欺负弱小的人 | Contempt, so the word must mean to despise.
蔑视/1 | 用这种眼光看说大话的人 | Scorn, so the word must mean to scorn.
轻蔑/1 | 他看不起地笑了一下 | Disdainfully, so the word must mean disdainful.
污蔑/1 | 没证据说别人偷东西 | Slander, so the word must mean to slander.
粗鄙/1 | 满嘴都是难听的话 | Vulgar, so the word must mean vulgar.
奸商/1 | 把过期食品换包装再卖 | A crooked trader, so the word must mean profiteer.
奸臣/1 | 京剧里常画白脸 | A treacherous minister, so the word must mean treacherous official.
厚颜无耻/1 | 抄了文章还说是自己写的 | Shameless, so the word must mean shameless.
缺德/1 | 在长椅上乱写乱画 | Wicked, so the word must mean mean, wicked.
背叛/1 | 把朋友的秘密告诉别人 | Betrayal, so the word must mean to betray.
叛逆/1 | 十几岁不爱听父母的话 | Rebellious, so the word must mean rebellious.
叛徒/1 | 电影里最后被认出来 | A traitor, so the word must mean traitor.
叛变/1 | 投敌被人看不起 | Defecting, so the word must mean to defect.
众叛亲离/1 | 做太多坏事最后的下场 | Deserted by all, so the word must mean deserted by everyone.
出卖/1 | 为了奖金出卖同事 | Selling out, so the word must mean to sell out.
出尔反尔/1 | 昨天答应今天不认账 | Going back on one's word, so the word must mean to go back on one's word.
两面三刀/1 | 当面说好背后说坏话 | Two-faced, so the word must mean double-dealing.
阳奉阴违/1 | 表面答应实际不做 | Feigned compliance, so the word must mean to comply in public but defy in private.
口是心非/1 | 嘴上说不喜欢心里高兴 | Saying one thing, so the word must mean to say one thing and mean another.
憎恨/1 | 人们恨战争盼和平 | Hatred, so the word must mean to hate.
憎恶/1 | 从小讨厌说谎的人 | Loathing, so the word must mean to loathe.
爱憎分明/1 | 支持好人反对坏人 | Clear about love and hate, so the word must mean to know clearly what to love and hate.
面目可憎/1 | 故事里的坏人被写得 | Repulsive, so the word must mean hateful-looking.
褒贬/1 | 观众对新电影不一 | Praise and blame, so the word must mean praise and criticism.
褒奖/1 | 勇敢救人受到政府 | Commendation, so the word must mean to commend.
褒义/1 | 勇敢是这样的词 | A positive sense, so the word must mean commendatory.
贬义/1 | 狡猾是这样的词 | A negative sense, so the word must mean derogatory.
钦佩/1 | 困难面前不退缩 | Admiration, so the word must mean to admire.
敬仰/1 | 孔子受到后人 | Revered, so the word must mean to revere.
操守/1 | 法官要有良好的职业 | Integrity, so the word must mean integrity.
节操/1 | 竹子有节比喻人的 | Moral integrity, so the word must mean moral integrity.
气节/1 | 宁死不投降的民族 | Moral courage, so the word must mean integrity.
骨气/1 | 再穷也不接受施舍 | Backbone, so the word must mean backbone.
人格/1 | 尊重每个人不随便嘲笑 | Dignity, so the word must mean personality, dignity.
品行/1 | 成绩好也很端正 | Conduct, so the word must mean conduct.
德行/1 | 古人认为比才能更重要 | Virtue, so the word must mean moral conduct.
修身/1 | 治理国家先管好自己 | Self-cultivation, so the word must mean to cultivate oneself.
慎独/1 | 没人看着也不做坏事 | Watching oneself alone, so the word must mean to be watchful when alone.
克己/1 | 奉公从不占公家便宜 | Self-restraint, so the word must mean self-restraint.
堕落/1 | 交了坏朋友一天天下去 | Going downhill, so the word must mean to degenerate.
腐化/1 | 官员贪图享受生活 | Corrupt living, so the word must mean to become corrupt.
同流合污/1 | 宁可辞职也不跟着干坏事 | Joining wrongdoers, so the word must mean to go along with evil.
洁身自好/1 | 复杂环境里从不收礼 | Keeping clean, so the word must mean to keep oneself pure.
迷途知返/1 | 回头大家会原谅你 | Turning back, so the word must mean to realise one's errors and return.
改过自新/1 | 出狱后开了小饭馆 | Turning over a new leaf, so the word must mean to mend one's ways.
浪子回头/1 | 金不换，现在是勤劳青年 | The prodigal returns, so the word must mean the prodigal son returns.
知错就改/1 | 犯错只要改就是好孩子 | Correcting mistakes, so the word must mean to correct mistakes once known.
痛改前非/1 | 后悔过去决心改 | Thorough reform, so the word must mean to sincerely mend one's ways.
悔改/1 | 犯了错还不肯 | Repenting, so the word must mean to repent.
伦理审查/1 | 用人做实验必须先通过 | Ethics review, so the word must mean ethics review.
科技伦理/1 | 人工智能发展引起重视 | Tech ethics, so the word must mean ethics of science and technology.
基因编辑/1 | 治病也引起争论 | Gene editing, so the word must mean gene editing.
安乐死/1 | 是否允许争议很大 | Euthanasia, so the word must mean euthanasia.
器官捐献/1 | 去世后救了好几个病人 | Organ donation, so the word must mean organ donation.
知情同意/1 | 手术前让病人明白并签字 | Informed consent, so the word must mean informed consent.
动物福利/1 | 养殖场动物应有活动空间 | Animal welfare, so the word must mean animal welfare.
医德/1 | 大夫医术高明品德高尚 | Medical ethics, so the word must mean medical ethics.
两难/1 | 留在大城市还是回家 | A dilemma, so the word must mean dilemma.
功利主义/1 | 看能不能给最多人带来幸福 | Utilitarianism, so the word must mean utilitarianism.
平仄/1 | 写律诗让声调高低交替 | Tonal patterns, so the word must mean level and oblique tones.
仄声/1 | 上声、去声、入声 | Oblique tones, so the word must mean oblique tone.
平声/1 | 普通话第一二声多来自它 | Level tones, so the word must mean level tone.
近体诗/1 | 律诗和绝句要求严格 | Regulated verse, so the word must mean modern-style poetry.
古体诗/1 | 句数不固定平仄自由 | Old-style verse, so the word must mean ancient-style poetry.
五言/1 | 每句五个字的诗 | Five characters, so the word must mean five-character.
七言/1 | 杜甫每句七个字的律诗 | Seven characters, so the word must mean seven-character.
曲牌/1 | 规定元曲的曲调句式 | A tune title, so the word must mean qu tune name.
咏物诗/1 | 借梅花赞美坚强品格 | A poem on an object, so the word must mean poem about an object.
送别诗/1 | 诗人在江边和朋友告别 | Farewell poems, so the word must mean farewell poem.
眼泪/1 | 好消息妈妈激动得流下 | Tears, so the word must mean tears.
泪水/1 | 她的眼睛里充满了 | Tears, so the word must mean tears.
泪花/1 | 老人眼里闪着 | Glistening tears, so the word must mean tears in the eyes.
泪珠/1 | 一颗大大的从脸上落下 | A teardrop, so the word must mean teardrop.
泪流满面/1 | 看完电影观众哭得 | Tear-stained, so the word must mean face covered in tears.
泣不成声/1 | 说到伤心处 | Choking with sobs, so the word must mean too choked with tears to speak.
喜极而泣/1 | 女儿考上大学妈妈 | Tears of joy, so the word must mean to weep for joy.
哭泣/1 | 一个人在房间里 | Weeping, so the word must mean to weep.
抽泣/1 | 哭了很久轻轻地 | Sobbing, so the word must mean to sob.
声泪俱下/1 | 讲述经历大家感动 | In tears, so the word must mean speaking through tears.
凄凉/1 | 秋天院子里空空的只有落叶 | Desolate, so the word must mean desolate.
凄惨/1 | 孤儿的童年 | Miserable, so the word must mean wretched.
凄美/1 | 爱情故事结局让人流泪 | Sad but beautiful, so the word must mean poignantly beautiful.
凄清/1 | 深夜月光照在小河上 | Cold and lonely, so the word must mean cold and cheerless.
惆怅/1 | 毕业那天看着校园 | Wistful, so the word must mean melancholy.
怅然/1 | 朋友不在只好离去 | Disappointed, so the word must mean disconsolate.
悼念/1 | 纪念碑前怀念遇难的人 | Mourning, so the word must mean to mourn.
哀悼/1 | 伟人去世全国深切 | Condolence, so the word must mean to mourn.
追悼会/1 | 学校为老教授举行 | A memorial service, so the word must mean memorial service.
悼词/1 | 告别仪式上校长念了 | A eulogy, so the word must mean eulogy.
皎洁/1 | 中秋一轮月亮 | Bright and clear, so the word must mean bright and clear.
明月/1 | 李白诗里表达思乡 | The bright moon, so the word must mean bright moon.
月色/1 | 窗外很好去散步 | Moonlight, so the word must mean moonlight.
月明星稀/1 | 只能看到几颗星星 | Bright moon, few stars, so the word must mean bright moon and sparse stars.
眺望/1 | 站在山顶看远方大海 | Gazing afar, so the word must mean to gaze into the distance.
远眺/1 | 登上塔顶整座城在眼前 | Looking far, so the word must mean to look into the distance.
登高/1 | 重阳节去爬山 | Climbing heights, so the word must mean to ascend a height.
登高望远/1 | 古人在高楼写诗 | Climbing to see far, so the word must mean to climb high and look far.
极目/1 | 四望草原连到天边 | As far as the eye sees, so the word must mean to look as far as one can.
凭栏/1 | 靠着栏杆看江上小船 | Leaning on a rail, so the word must mean to lean on a railing.
鸣叫/1 | 小鸟在树上欢快地 | Singing birds, so the word must mean to cry, call.
共鸣/1 | 书引起读者的 | Resonance, so the word must mean resonance.
一鸣惊人/1 | 第一部小说就获大奖 | A stunning debut, so the word must mean to amaze the world at a stroke.
鸡鸣/1 | 天刚亮传来的声音 | Cockcrow, so the word must mean cockcrow.
蝉鸣/1 | 夏天午后树上 | Cicadas, so the word must mean cicada song.
鸟鸣/1 | 清晨公园里好听的 | Birdsong, so the word must mean birdsong.
鸣笛/1 | 医院附近禁止汽车 | Honking, so the word must mean to sound a horn.
雷鸣/1 | 台下响起这样的掌声 | Thunderous, so the word must mean thunder.
自鸣得意/1 | 考一次第一就不再认真 | Smug, so the word must mean to be pleased with oneself.
百家争鸣/1 | 春秋战国思想界的局面 | A hundred schools, so the word must mean contention of a hundred schools.
喜鹊/1 | 门前叫个不停要有好事 | Magpies, so the word must mean magpie.
鹊桥/1 | 牛郎织女七夕相会的地方 | The magpie bridge, so the word must mean magpie bridge.
大雁/1 | 秋天排队往南飞 | Wild geese, so the word must mean wild goose.
鸿雁/1 | 古人用它比喻书信 | Swan geese, so the word must mean swan goose.
孤雁/1 | 天上一只叫声凄凉 | A lone goose, so the word must mean solitary goose.
雁阵/1 | 排成人字或一字 | A formation of geese, so the word must mean flight of geese.
黄莺/1 | 柳树上唱好听的歌 | Orioles, so the word must mean oriole.
燕子/1 | 春天飞回来在房檐下安家 | Swallows, so the word must mean swallow.
莺歌燕舞/1 | 春天江南景色美 | Birds singing, so the word must mean orioles sing and swallows dance.
仙鹤/1 | 中国画里和松树象征长寿 | A crane, so the word must mean red-crowned crane.
菊花/1 | 重阳节前后公园开满 | Chrysanthemums, so the word must mean chrysanthemum.
梅花/1 | 寒冬开放不怕风雪 | Plum blossom, so the word must mean plum blossom.
荷花/1 | 夏天湖面粉红色的 | Lotus flowers, so the word must mean lotus.
荷叶/1 | 青蛙坐在大的上面 | A lotus leaf, so the word must mean lotus leaf.
枫叶/1 | 秋天山上都红了 | Maple leaves, so the word must mean maple leaf.
杨柳/1 | 河边长出新芽 | Willows, so the word must mean willow.
杨树/1 | 路两边高高的遮阳 | Poplars, so the word must mean poplar.
梅雨/1 | 六月江南天天下雨 | The plum rains, so the word must mean plum rain season.
岁寒三友/1 | 松、竹、梅不怕寒冷 | Three friends of winter, so the word must mean three friends of winter.
梅兰竹菊/1 | 被称为四君子 | The four gentlemen, so the word must mean plum, orchid, bamboo and chrysanthemum.
蝴蝶/1 | 花间飞来飞去 | Butterflies, so the word must mean butterfly.
化蝶/1 | 梁祝死后在花间飞舞 | Becoming butterflies, so the word must mean to turn into butterflies.
蝶泳/1 | 他最擅长的游泳项目 | Butterfly stroke, so the word must mean butterfly stroke.
蝉联/1 | 连续三届冠军 | Retaining a title, so the word must mean to win consecutively.
知了/1 | 夏天树上不停地叫 | Cicadas, so the word must mean cicada.
晚霞/1 | 太阳下山西边天空红色 | Sunset glow, so the word must mean sunset clouds.
朝霞/1 | 早上东方天空美丽的 | Morning glow, so the word must mean rosy dawn clouds.
彩霞/1 | 雨过天晴天边一片片 | Coloured clouds, so the word must mean rosy clouds.
霞光/1 | 山顶照在云海上 | Glowing light, so the word must mean rosy light.
梁祝/1 | 四大民间传说之一 | The Butterfly Lovers, so the word must mean Liang Zhu legend.
托物言志/1 | 写竹子表达坚强品格 | Using an object, so the word must mean to express ideals through objects.
借景抒情/1 | 写落叶表达思乡 | Feeling through scenery, so the word must mean to express emotion through scenery.
情景交融/1 | 写景写情都好 | Scene and feeling blend, so the word must mean blending of feeling and scene.
诗情画意/1 | 雨后西湖充满 | Poetic charm, so the word must mean poetic and picturesque.
田园诗/1 | 陶渊明写农村生活 | Pastoral poetry, so the word must mean pastoral poetry.
山水诗/1 | 王维写得像画 | Landscape poetry, so the word must mean landscape poetry.
怀古/1 | 古城旧址写下的诗 | Recalling the past, so the word must mean to reflect on the past.
咏史/1 | 借历史人物表达看法 | Poems on history, so the word must mean to write about history.
寄托/1 | 把思乡之情放在明月上 | Placing hopes, so the word must mean to entrust.
感怀/1 | 重游母校心中很多 | Reflections, so the word must mean recollections.
诗仙/1 | 李白被称为 | The Immortal Poet, so the word must mean Immortal of Poetry.
诗圣/1 | 杜甫被称为 | The Sage Poet, so the word must mean Sage of Poetry.
婉约派/1 | 李清照词写得柔美 | The graceful school, so the word must mean graceful school.
豪放派/1 | 辛弃疾充满爱国热情 | The bold school, so the word must mean bold school.
千古绝唱/1 | 今天还有很多人会背 | A timeless masterpiece, so the word must mean masterpiece for the ages.
佳句/1 | 诗里很多值得背 | Fine lines, so the word must mean fine line.
吟诗/1 | 文人月下喝茶 | Reciting poems, so the word must mean to recite poetry.
赋诗/1 | 登上高楼当场写一首 | Composing poems, so the word must mean to compose a poem.
诗社/1 | 学校每周有人读诗 | A poetry club, so the word must mean poetry society.
唱和/1 | 两位诗人互相作诗应答 | Answering poems, so the word must mean to respond in verse.
离愁/1 | 送别朋友心里充满 | Parting sorrow, so the word must mean sorrow of parting.
愁绪/1 | 窗外小雨她心中充满 | Gloom, so the word must mean melancholy.
乡愁/1 | 一碗家乡的面 | Homesickness, so the word must mean homesickness.
感伤/1 | 看几十年前的老照片 | Sentimental, so the word must mean sad, sentimental.
悲秋/1 | 诗人看到落叶想到人生短暂 | Autumn sadness, so the word must mean to lament autumn.
伤春/1 | 落花满地的心情 | Spring sorrow, so the word must mean to grieve over spring.
秋思/1 | 秋天引起的愁思 | Autumn thoughts, so the word must mean autumn longing.
折柳/1 | 送别时表示留恋 | Breaking willow twigs, so the word must mean to break a willow twig in farewell.
长亭/1 | 城外送别朋友的地方 | A roadside pavilion, so the word must mean roadside pavilion.
断肠/1 | 形容伤心到了极点 | Heartbroken, so the word must mean heartbroken.
旦角/1 | 男演员在台上扮演女子 | Female roles, so the word must mean dan role.
花旦/1 | 天真可爱的小姑娘角色 | A lively girl role, so the word must mean huadan.
青衣/1 | 端庄女子常穿黑衣 | A dignified woman role, so the word must mean qingyi.
老旦/1 | 戏里扮演老奶奶 | An old woman role, so the word must mean laodan.
刀马旦/1 | 骑马打仗的女将军 | A warrior woman role, so the word must mean daomadan.
小生/1 | 年轻书生的角色 | A young man role, so the word must mean xiaosheng.
老生/1 | 长胡子的老大臣 | An old man role, so the word must mean laosheng.
武生/1 | 台上连翻十几个跟头 | A martial role, so the word must mean wusheng.
丑角/1 | 鼻子上画白观众就笑 | The clown, so the word must mean clown role.
生旦净丑/1 | 京剧角色的四大类 | The four role types, so the word must mean sheng, dan, jing and chou.
粤剧/1 | 流行于广东香港 | Cantonese opera, so the word must mean Cantonese opera.
粤语/1 | 香港大多数人说 | Cantonese, so the word must mean Cantonese.
黄梅戏/1 | 代表作天仙配 | Huangmei opera, so the word must mean Huangmei opera.
豫剧/1 | 河南最有名的地方戏 | Henan opera, so the word must mean Yu opera.
川剧/1 | 变脸表演非常有名 | Sichuan opera, so the word must mean Sichuan opera.
秦腔/1 | 西北地区声音很大 | Shaanxi opera, so the word must mean Qinqiang.
评剧/1 | 流行于华北和东北 | Pingju, so the word must mean Ping opera.
杂剧/1 | 元代一般是四折 | Yuan drama, so the word must mean zaju.
南戏/1 | 宋代温州一带最早出现 | Southern drama, so the word must mean nanxi.
梨园/1 | 他出生在唱戏世家 | The theatre world, so the word must mean Pear Garden.
念白/1 | 演员不但唱还要说得好 | Spoken parts, so the word must mean spoken lines.
唱词/1 | 这段写得像一首诗 | Lyrics, so the word must mean libretto.
身段/1 | 演员一举一动像舞蹈 | Stage movement, so the word must mean posture.
水袖/1 | 挥动长长的表现心情 | Water sleeves, so the word must mean water sleeves.
压轴/1 | 今晚最后的名段 | The finale, so the word must mean the second-to-last item.
返场/1 | 掌声不断又唱一段 | An encore, so the word must mean to return for an encore.
票友/1 | 爷爷周末去公园唱京剧 | An amateur, so the word must mean amateur performer.
戏台/1 | 村口过年请人唱戏 | A stage, so the word must mean opera stage.
叫好/1 | 观众连声 | Applause, so the word must mean to shout bravo.
戏班/1 | 从一个村子到另一个村子演 | A troupe, so the word must mean theatre troupe.
滑稽/1 | 小丑的样子逗孩子笑 | Comic, so the word must mean funny.
逗乐/1 | 有他在总有笑声 | Amusing, so the word must mean to amuse.
笑料/1 | 喜剧里太多观众笑个不停 | Gags, so the word must mean joke.
捧腹大笑/1 | 表演太有意思观众都 | Doubled up laughing, so the word must mean to split one's sides.
捧场/1 | 谢谢大家来支持 | Supporting a show, so the word must mean to show support.
包厢/1 | 剧院二楼每个坐五六人 | Boxes, so the word must mean box.
捧红/1 | 电视剧让几位演员出名 | Made famous, so the word must mean to make popular.
名角/1 | 好几位登台票卖完 | Star performers, so the word must mean famous actor.
车厢/1 | 火车有十六节 | Carriages, so the word must mean carriage.
西厢记/1 | 王实甫写张生和莺莺 | The Western Chamber, so the word must mean Romance of the Western Chamber.
唢呐/1 | 农村办喜事吹 | Suona, so the word must mean suona horn.
琵琶/1 | 怀里抱着手指飞快弹 | Pipa, so the word must mean pipa.
箫/1 | 直着拿着吹的 | A vertical flute, so the word must mean xiao.
锣鼓/1 | 庙会上喧天舞狮队来了 | Gongs and drums, so the word must mean gongs and drums.
扬琴/1 | 用两根竹片敲打琴弦 | Dulcimer, so the word must mean yangqin.
编钟/1 | 两千多年前还能敲出音乐 | Chime bells, so the word must mean bianzhong.
琴弦/1 | 弹太用力断了一根 | A string, so the word must mean string.
吹拉弹唱/1 | 剧团工作样样都会 | All instruments, so the word must mean to play and sing.
敲锣打鼓/1 | 全村人欢迎冠军回家 | Gongs and drums, so the word must mean to beat gongs and drums.
民族乐器/1 | 二胡、古筝、笛子 | Chinese instruments, so the word must mean traditional instruments.
长笛/1 | 声音清亮模仿鸟叫 | The flute, so the word must mean flute.
单簧管/1 | 吹口上有一片簧片 | Clarinet, so the word must mean clarinet.
圆号/1 | 管子绕成圆圈手放进大口 | Horn, so the word must mean French horn.
定音鼓/1 | 交响乐团里可调音高 | Timpani, so the word must mean timpani.
架子鼓/1 | 乐队后面掌握节奏 | A drum kit, so the word must mean drum kit.
弦乐器/1 | 小提琴、大提琴、吉他 | Strings, so the word must mean stringed instrument.
管乐器/1 | 长笛和单簧管用嘴吹 | Wind instruments, so the word must mean wind instrument.
打击乐器/1 | 锣、鼓、木鱼 | Percussion, so the word must mean percussion instrument.
铜管乐器/1 | 小号和圆号金属做的 | Brass, so the word must mean brass instrument.
琴弓/1 | 拉小提琴右手拿着 | A bow, so the word must mean bow.
吹奏/1 | 用笛子演奏民歌 | Playing a wind instrument, so the word must mean to play by blowing.
弹奏/1 | 在钢琴上演奏小曲 | Playing piano, so the word must mean to play.
拨弦/1 | 用手指弹小提琴 | Plucking, so the word must mean pizzicato.
合奏/1 | 十几种乐器一起 | An ensemble, so the word must mean ensemble playing.
调音/1 | 演出前乐手给乐器 | Tuning up, so the word must mean to tune.
演奏会/1 | 钢琴家在音乐厅举办个人 | A recital, so the word must mean concert.
指法/1 | 每个手指按哪个键有规定 | Fingering, so the word must mean fingering.
乐感/1 | 听一遍就能哼出来 | A good ear, so the word must mean musical sense.
乐手/1 | 乐队五名每人一种乐器 | Musicians, so the word must mean musician.
编曲/1 | 民歌加入电吉他和架子鼓 | Arranging, so the word must mean arrangement.
交响乐团/1 | 一百多名乐手世界各地演出 | A symphony orchestra, so the word must mean symphony orchestra.
管弦乐/1 | 既有弦乐器又有管乐器 | Orchestral, so the word must mean orchestral music.
首席/1 | 坐在指挥左手第一个的小提琴手 | The leader, so the word must mean principal.
声部/1 | 合唱团分高音低音几个 | Voice parts, so the word must mean part.
协奏曲/1 | 钢琴独奏乐队伴奏 | A concerto, so the word must mean concerto.
序曲/1 | 歌剧开始前演奏的一段 | An overture, so the word must mean overture.
乐章/1 | 交响曲四个第二个最慢 | Movements, so the word must mean movement.
指挥家/1 | 把手一举乐团开始演奏 | A conductor, so the word must mean conductor.
交响曲/1 | 管弦乐队演奏的大型乐曲 | A symphony, so the word must mean symphony.
音乐厅/1 | 声音效果好最后一排也清楚 | A concert hall, so the word must mean concert hall.
和弦/1 | 左手按几根弦弹出 | A chord, so the word must mean chord.
和声/1 | 几个声部合起来好听 | Harmony, so the word must mean harmony.
节拍/1 | 跳舞要跟上音乐的 | The beat, so the word must mean beat.
音阶/1 | 从低到高再从高到低弹 | Scales, so the word must mean scale.
五线谱/1 | 用五条平行线记音高 | The staff, so the word must mean stave notation.
简谱/1 | 用数字一到七表示音 | Number notation, so the word must mean numbered musical notation.
大调/1 | 听起来明亮欢快 | Major key, so the word must mean major key.
小调/1 | 听起来有点忧伤 | Minor key, so the word must mean minor key.
音准/1 | 唱歌常常偏高 | Pitch, so the word must mean intonation.
音域/1 | 能唱很高也能唱很低 | Range, so the word must mean vocal range.
音色/1 | 钢琴和小提琴完全不同 | Timbre, so the word must mean tone colour.
嘹亮/1 | 军号声整个营地听得见 | Loud and clear, so the word must mean resonant.
男高音/1 | 他能唱很高的音 | A tenor, so the word must mean tenor.
女高音/1 | 歌剧女主角常由她唱 | A soprano, so the word must mean soprano.
美声/1 | 音乐学院唱意大利歌剧 | Bel canto, so the word must mean bel canto.
哼唱/1 | 妈妈做饭轻轻地唱 | Humming, so the word must mean to hum.
跑调/1 | 一唱歌就大家笑 | Off key, so the word must mean to sing out of tune.
假声/1 | 男歌手唱出很高像女声 | Falsetto, so the word must mean falsetto.
气息/1 | 唱歌要学会控制 | Breath, so the word must mean breath.
清唱/1 | 没有伴奏站着唱 | A cappella, so the word must mean to sing unaccompanied.
古典音乐/1 | 欧洲流传几百年交响乐团演奏 | Classical music, so the word must mean classical music.
流行音乐/1 | 排行榜上的新歌 | Pop music, so the word must mean pop music.
摇滚乐/1 | 五十年代美国电吉他架子鼓 | Rock, so the word must mean rock music.
爵士乐/1 | 新奥尔良即兴演奏 | Jazz, so the word must mean jazz.
嘻哈/1 | 纽约街头的说唱街舞 | Hip hop, so the word must mean hip hop.
说唱/1 | 不唱歌而跟着节奏说 | Rapping, so the word must mean rap.
轻音乐/1 | 咖啡馆里让人放松 | Easy listening, so the word must mean light music.
乡村音乐/1 | 美国南部农村吉他小提琴 | Country music, so the word must mean country music.
电子音乐/1 | 用电脑做出各种声音 | Electronic music, so the word must mean electronic music.
民族音乐/1 | 作曲家收集山区的 | Folk music, so the word must mean ethnic music.
喧嚣/1 | 离开城市的到山里住 | Hustle and bustle, so the word must mean din.
喧闹/1 | 铃响以后操场安静了 | Noisy, so the word must mean noisy.
嗡嗡/1 | 蜜蜂在耳边飞 | Buzzing, so the word must mean buzz.
吼叫/1 | 老虎一声小鸟飞走 | A roar, so the word must mean to roar.
喇叭/1 | 村口通知明天开会 | A loudspeaker, so the word must mean loudspeaker.
口哨/1 | 心情好一边走一边吹 | Whistling, so the word must mean whistle.
哨子/1 | 体育老师一吹排好队 | A whistle, so the word must mean whistle.
震耳欲聋/1 | 音响开得太大 | Deafening, so the word must mean deafening.
刺耳/1 | 指甲划过黑板 | Grating, so the word must mean ear-piercing.
回响/1 | 歌声在山谷里久久 | Echoing, so the word must mean to echo.
巡演/1 | 乐队在二十个城市演出 | A tour, so the word must mean to tour.
签售/1 | 新专辑会歌迷排长队 | A signing, so the word must mean signing session.
加演/1 | 票卖完再多演两场 | Extra shows, so the word must mean to add performances.
追星/1 | 墙上贴满歌手照片 | Fandom, so the word must mean to idolise stars.
帅气/1 | 白西装男歌手 | Handsome, so the word must mean handsome.
蹦蹦跳跳/1 | 小朋友跑到台前 | Skipping, so the word must mean bouncing about.
酷/1 | 戴墨镜弹电吉他 | Cool, so the word must mean cool.
乐迷/1 | 音乐节吸引成千上万 | Music fans, so the word must mean music fan.
音乐节/1 | 连续三天几十支乐队 | A music festival, so the word must mean music festival.
开场/1 | 离开始还有一小时 | The start, so the word must mean opening.
录音棚/1 | 歌手在里面录了一整天 | A studio, so the word must mean recording studio.
唱片/1 | 爷爷收藏的用唱机播放 | Records, so the word must mean record.
光碟/1 | 很少有人去商店买了 | CDs, so the word must mean disc.
专辑/1 | 新的一共十首歌 | An album, so the word must mean album.
单曲/1 | 一发行就被播放一百万次 | A single, so the word must mean single.
母带/1 | 老唱片根据原来的重新制作 | The master tape, so the word must mean master tape.
播放器/1 | 用手机上的听歌 | A player, so the word must mean player.
翻唱/1 | 老歌被很多年轻歌手唱过 | Cover versions, so the word must mean to cover.
原唱/1 | 老歌唱家最早唱的 | The original singer, so the word must mean original singer.
作曲家/1 | 由他谱曲诗人写词 | A composer, so the word must mean composer.
恐怖片/1 | 胆子小从来不敢看 | Horror films, so the word must mean horror film.
惊悚片/1 | 情节紧张心一直提着 | A thriller, so the word must mean thriller.
武侠片/1 | 外国人通过它认识中国功夫 | Martial arts films, so the word must mean martial arts film.
喜剧片/1 | 让观众从头笑到尾 | A comedy, so the word must mean comedy.
动画片/1 | 会说话的小熊 | Cartoons, so the word must mean cartoon.
科幻片/1 | 人类移民到火星 | Science fiction, so the word must mean sci-fi film.
爱情片/1 | 一对年轻人相爱 | A romance, so the word must mean romance film.
悬疑片/1 | 最后才知道画是谁拿的 | A mystery, so the word must mean mystery film.
剧情片/1 | 不靠特效靠故事人物 | A drama, so the word must mean drama film.
武侠/1 | 爱看这类小说梦想行侠仗义 | Wuxia, so the word must mean martial heroes.
制片人/1 | 四处找钱筹拍摄费用 | A producer, so the word must mean producer.
剧组/1 | 在沙漠里待了三个月 | The film crew, so the word must mean cast and crew.
片场/1 | 到处是灯和摄影机 | A film set, so the word must mean set.
摄影师/1 | 把草原拍得特别美 | A cinematographer, so the word must mean cameraman.
场记/1 | 记下每个镜头拍几遍 | A continuity clerk, so the word must mean script supervisor.
外景/1 | 在海边小村子拍的 | Location shooting, so the word must mean exterior scene.
杀青/1 | 拍了半年今天完成 | Wrapping, so the word must mean to finish shooting.
开机/1 | 下个月开始拍 | Starting to shoot, so the word must mean to start filming.
试镜/1 | 几百名演员最后选三个 | An audition, so the word must mean audition.
群众演员/1 | 只在街上走了两步 | An extra, so the word must mean extra.
特写/1 | 镜头推近给她眼睛一个 | A close-up, so the word must mean close-up.
长镜头/1 | 五分钟没剪开 | A long take, so the word must mean long take.
慢镜头/1 | 冲过终点重放一遍 | Slow motion, so the word must mean slow motion.
蒙太奇/1 | 不同镜头剪接讲故事 | Montage, so the word must mean montage.
剪辑/1 | 一百小时素材留两小时 | Editing, so the word must mean to edit.
配乐/1 | 电影的音乐很感人 | The score, so the word must mean soundtrack.
配音/1 | 外国动画由中国演员说话 | Dubbing, so the word must mean to dub.
特效/1 | 恐龙是电脑做出来的 | Effects, so the word must mean special effects.
画外音/1 | 开头老人讲起故事 | A voice-over, so the word must mean voice-over.
空镜头/1 | 街道小河远山没有人 | Empty shots, so the word must mean empty shot.
档期/1 | 春节电影票卖得最多 | A release slot, so the word must mean schedule slot.
院线/1 | 全国各大同时上映 | Cinema chains, so the word must mean cinema chain.
影院/1 | 周末坐满观众 | A cinema, so the word must mean cinema.
预告片/1 | 还没上映网上被看几千万次 | A trailer, so the word must mean trailer.
翻拍/1 | 根据三十年前的电影 | A remake, so the word must mean to remake.
影评/1 | 看完电影在网上写 | A review, so the word must mean film review.
上座率/1 | 每场几乎都坐满 | Attendance, so the word must mean occupancy rate.
首映式/1 | 导演和主演都出席 | A premiere, so the word must mean premiere.
观影/1 | 不影响别人手机调静音 | Watching films, so the word must mean to watch a film.
影展/1 | 国际上获最佳导演奖 | A film festival, so the word must mean film festival.
影帝/1 | 获最佳男主角奖 | Best actor, so the word must mean best actor.
影后/1 | 三次获最佳女主角 | Best actress, so the word must mean best actress.
煽情/1 | 太刻意反而不感动 | Sentimental, so the word must mean sentimental.
温馨/1 | 一家人互相关爱的电影 | Heartwarming, so the word must mean warm.
走红/1 | 因电视剧一下子出名 | Becoming famous, so the word must mean to become popular.
戏份/1 | 只出场了三次 | Screen time, so the word must mean part.
入戏/1 | 拍完哭戏停不下来 | Absorbed in the role, so the word must mean to get into character.
出道/1 | 十六岁开始演戏 | Debut, so the word must mean to debut.
童星/1 | 五岁开始演戏 | A child star, so the word must mean child star.
叫座/1 | 票房和口碑都好 | A box-office draw, so the word must mean to draw crowds.
宦官/1 | 皇宫里照顾皇帝一家 | Eunuchs, so the word must mean eunuch.
仕途/1 | 三十岁当上知府 | An official career, so the word must mean official career.
丞相/1 | 秦朝帮皇帝处理大事 | Chancellor, so the word must mean prime minister.
擢升/1 | 治水有功被提为知府 | Promoted, so the word must mean to promote.
罢黜/1 | 犯大错被皇帝免官 | Dismissed, so the word must mean to dismiss.
辅佐/1 | 周公帮助年幼的成王 | Assisting a ruler, so the word must mean to assist.
官宦/1 | 祖父父亲都做过官 | An official family, so the word must mean officialdom.
入仕/1 | 通过科举做官 | Entering office, so the word must mean to enter officialdom.
官职/1 | 分很多等级 | Official posts, so the word must mean official post.
薪俸/1 | 古代官员常发粮食 | Salary, so the word must mean official salary.
内阁/1 | 总理和部长组成 | The cabinet, so the word must mean cabinet.
组阁/1 | 新总理选出各部部长 | Forming a cabinet, so the word must mean to form a cabinet.
机关/1 | 大学毕业在政府工作 | A government office, so the word must mean government agency.
部委/1 | 政策由几个一起制定 | Ministries, so the word must mean ministries and commissions.
上级/1 | 我们决定不了要报告 | Superiors, so the word must mean higher authority.
直属/1 | 医院是市政府 | Directly under, so the word must mean directly subordinate.
编制/1 | 部门定员二十人 | Staff quota, so the word must mean staffing.
科室/1 | 医院各个都在二楼 | Departments, so the word must mean department.
行政区/1 | 国家分成二十个 | Administrative regions, so the word must mean administrative region.
辖区/1 | 派出所管五万多人 | A jurisdiction, so the word must mean jurisdiction.
公文/1 | 秘书每天处理几十份 | Official documents, so the word must mean official document.
呈报/1 | 报告交给上级 | Reporting up, so the word must mean to submit a report.
呈送/1 | 计划书交给市长 | Submitting, so the word must mean to present.
邮戳/1 | 以寄出日期为准 | A postmark, so the word must mean postmark.
公函/1 | 两个部门之间联系 | Official letters, so the word must mean official letter.
批文/1 | 拿到政府的才能开工 | Official approval, so the word must mean approval document.
红头文件/1 | 写进去各部门都要执行 | An official directive, so the word must mean official document.
复印件/1 | 带身份证原件和它 | A photocopy, so the word must mean photocopy.
原件/1 | 这份是复印件请拿来 | The original, so the word must mean original.
一沓/1 | 从包里拿出文件 | A stack, so the word must mean a pile of.
繁琐/1 | 办证要跑五个部门 | Cumbersome, so the word must mean cumbersome.
简化/1 | 手续一天就能办好 | Simplifying, so the word must mean to simplify.
冗长/1 | 一百页有用的十页 | Long-winded, so the word must mean lengthy.
冗员/1 | 改革后机关里少了 | Surplus staff, so the word must mean redundant staff.
一站式/1 | 办事不用跑好几个地方 | One-stop, so the word must mean one-stop.
琐事/1 | 每天忙于各种 | Trifles, so the word must mean trivial matters.
层层/1 | 申请经过一级一级审批 | Layer upon layer, so the word must mean level upon level.
重叠/1 | 两部门工作很多一样 | Overlap, so the word must mean to overlap.
叠加/1 | 几个问题加在一起更难 | Piling up, so the word must mean to superimpose.
叠床架屋/1 | 机构设置重复 | Redundant layers, so the word must mean needless duplication.
推诿/1 | 你的责任不要推给别人 | Passing the buck, so the word must mean to shirk.
搪塞/1 | 找借口应付记者 | Fobbing off, so the word must mean to stall.
扯皮/1 | 两部门争了半年 | Wrangling, so the word must mean to wrangle.
拖沓/1 | 一周的工作拖一个月 | Dilatory, so the word must mean sluggish.
踢皮球/1 | 部门互相推让他白跑 | Passing the buck, so the word must mean to pass the buck.
形式主义/1 | 开会只是走过场 | Box-ticking, so the word must mean formalism.
文山会海/1 | 整天陷在文件和会议里 | Paperwork and meetings, so the word must mean mountains of papers and seas of meetings.
敷衍塞责/1 | 工作要认真不能 | Perfunctory, so the word must mean to perform one's duty perfunctorily.
东拉西扯/1 | 说半天没到重点 | Rambling, so the word must mean to ramble.
扯后腿/1 | 大家努力你别拖累 | Holding back, so the word must mean to hold back.
搁置/1 | 资金不够计划被放下 | Shelved, so the word must mean to shelve.
搁浅/1 | 大船要等涨潮离开 | Run aground, so the word must mean to run aground.
悬而未决/1 | 问题好几年没解决 | Unresolved, so the word must mean outstanding.
一拖再拖/1 | 工程去年完工到现在还没 | Delayed again and again, so the word must mean to delay repeatedly.
议而不决/1 | 开了三次会没决定 | Talk without decision, so the word must mean to discuss without deciding.
当机立断/1 | 情况紧急马上让人离开 | Quick decision, so the word must mean to decide promptly.
拍板/1 | 最后由校长来决定 | Making the call, so the word must mean to make the final decision.
定夺/1 | 两方案请领导决定 | Deciding, so the word must mean to decide.
否决/1 | 提案被大多数人 | Voted down, so the word must mean to veto.
从长计议/1 | 事情复杂不能马上决定 | Taking time, so the word must mean to consider at length.
弹劾/1 | 议会可以对违法总统 | Impeachment, so the word must mean to impeach.
问责/1 | 事故后负责人被 | Held accountable, so the word must mean to hold accountable.
巡视/1 | 校长每天在校园里走一圈 | Inspecting, so the word must mean to inspect.
秉公办事/1 | 法官三十年不偏向任何一方 | Impartial, so the word must mean to act impartially.
恪守/1 | 医生必须遵守职业道德 | Upholding, so the word must mean to abide by.
恪尽职守/1 | 三十年没出过错 | Dutiful, so the word must mean to perform one's duties conscientiously.
秉持/1 | 医院始终坚持病人第一 | Holding to, so the word must mean to uphold.
遴选/1 | 从一百多名老师中选出十人 | Selecting, so the word must mean to select.
舞弊/1 | 考试中发现成绩作废 | Cheating, so the word must mean malpractice.
罢免/1 | 选民可以撤掉不称职代表 | Recall, so the word must mean to recall.
任命/1 | 他被指派为校长 | Appointed, so the word must mean to appoint.
任免/1 | 干部的要按程序 | Appointment and removal, so the word must mean to appoint and dismiss.
上任/1 | 新市长先去走访 | Taking office, so the word must mean to take office.
就职/1 | 新总统在典礼上讲话 | Inauguration, so the word must mean to assume office.
离任/1 | 老校长走时学生来送 | Leaving office, so the word must mean to leave a post.
代理/1 | 副校长暂代校长工作 | Acting, so the word must mean to act for.
任职/1 | 曾在外交部二十年 | Holding a post, so the word must mean to hold a post.
免职/1 | 严重失职被 | Dismissed, so the word must mean to remove from office.
调任/1 | 从北京到上海担任经理 | Transferred, so the word must mean to be transferred.
履新/1 | 新任大使下周到任 | Taking up a new post, so the word must mean to take up a new post.
法令/1 | 政府禁止公共场所吸烟 | A decree, so the word must mean decree.
施行/1 | 法律从明年一月起 | Coming into force, so the word must mean to put into effect.
废止/1 | 过时的规定被取消 | Repealed, so the word must mean to repeal.
颁行/1 | 新交通法规正式 | Issued and enforced, so the word must mean to promulgate.
赦免/1 | 国王让犯人回家 | Pardoned, so the word must mean to pardon.
特赦/1 | 国庆时放了表现好的犯人 | A special pardon, so the word must mean special pardon.
大赦/1 | 新皇帝登基宣布天下 | A general amnesty, so the word must mean general amnesty.
有法可依/1 | 保护野生动物有了法律 | Having laws, so the word must mean to have laws to go by.
条文/1 | 法律一百多条 | Articles, so the word must mean clause.
细则/1 | 新规定还要制定实施 | Detailed rules, so the word must mean detailed rules.
国徽/1 | 法院大门上方挂着 | The national emblem, so the word must mean national emblem.
徽章/1 | 运动员胸前戴着 | A badge, so the word must mean badge.
国歌/1 | 升国旗时全校一起唱 | The national anthem, so the word must mean national anthem.
校徽/1 | 校服上印着学校标志 | The school badge, so the word must mean school emblem.
会徽/1 | 奥运会的标志由设计师设计 | The games emblem, so the word must mean event emblem.
钢印/1 | 照片上压出凸起的印 | An embossed seal, so the word must mean steel seal.
印泥/1 | 盖章前先按一下红色的 | An ink pad, so the word must mean red ink paste.
印鉴/1 | 银行留着的印章样子 | A specimen seal, so the word must mean seal impression on file.
签章/1 | 双方签字盖章合同才有效 | Signatures and seals, so the word must mean signature and seal.
戳/1 | 用手指碰了一下肩膀 | A poke, so the word must mean to poke.
斡旋/1 | 第三国帮两国重新谈判 | Mediation, so the word must mean to mediate.
调停/1 | 邻居吵架主任出面 | Stepping in, so the word must mean to make peace between.
协定/1 | 两国签了降低关税的 | An agreement, so the word must mean accord.
照会/1 | 外交部向对方发出表明立场 | A diplomatic note, so the word must mean diplomatic note.
多边/1 | 二十多个国家参加会谈 | Multilateral, so the word must mean multilateral.
中间人/1 | 双方不见面请人传话 | A go-between, so the word must mean middleman.
冰释前嫌/1 | 长谈后老朋友又和好 | Reconciled, so the word must mean to bury old grudges.
停火/1 | 明天起不再打仗开始谈判 | A ceasefire, so the word must mean to cease fire.
求同存异/1 | 找共同点保留不同意见 | Common ground, so the word must mean to seek common ground while keeping differences.
各让一步/1 | 双方都退让一点 | Meeting halfway, so the word must mean each side gives a little.
表格/1 | 填好交到二号窗口 | A form, so the word must mean form.
勾选/1 | 在同意的选项前做记号 | Ticking, so the word must mean to tick.
打勾/1 | 做对了画一个对号 | A tick, so the word must mean to mark with a tick.
一栏/1 | 表格最后是签名 | A column, so the word must mean a column.
空格/1 | 表上还有几处没填 | Blanks, so the word must mean blank space.
必填/1 | 带星号的不能空着 | Required, so the word must mean required field.
选填/1 | 不想写可以不写 | Optional, so the word must mean optional field.
漏填/1 | 出生日期忘了写 | Left out, so the word must mean to leave unfilled.
附件/1 | 材料随邮件一起发送 | An attachment, so the word must mean attachment.
如实/1 | 个人信息不能填假的 | Truthfully, so the word must mean truthfully.
勾结/1 | 商人联合起来提高物价 | Colluding, so the word must mean to collude.
蒙蔽/1 | 被假象骗了没看出问题 | Deceived, so the word must mean to hoodwink.
遮蔽/1 | 大树挡住阳光林子凉快 | Blocking, so the word must mean to shade.
隐蔽/1 | 村子在山谷深处不好找 | Hidden, so the word must mean concealed.
戳穿/1 | 谎话很快被揭开 | Exposed, so the word must mean to expose.
透明/1 | 财政收支公开让人民监督 | Transparent, so the word must mean transparent.
公开/1 | 招聘结果在网上让大家看 | Made public, so the word must mean to make public.
暗箱操作/1 | 招标公开进行防止 | Backroom deals, so the word must mean under-the-table dealing.
真相大白/1 | 调查后事情清楚了 | The truth out, so the word must mean the truth comes out.
蒙在鼓里/1 | 大家都知道只有他不知道 | Kept in the dark, so the word must mean to be kept in the dark.
松弛/1 | 运动后肌肉放松下来 | Relaxed, so the word must mean slack.
废弛/1 | 制度长期没人执行 | Neglected, so the word must mean lax.
一张一弛/1 | 学习和休息要交替 | Work and rest, so the word must mean alternate tension and relaxation.
张弛有度/1 | 导演讲故事节奏好 | Well paced, so the word must mean with proper rhythm.
阻挠/1 | 想办法让工程做不成 | Obstructing, so the word must mean to obstruct.
挠头/1 | 题难得想了一小时 | Head-scratching, so the word must mean to scratch one's head.
收紧/1 | 物价上涨贷款政策变严 | Tightening, so the word must mean to tighten.
放宽/1 | 年龄限制变松十岁也能参加 | Relaxed, so the word must mean to relax.
闭塞/1 | 山村交通不便很少有外人 | Isolated, so the word must mean cut off.
堵塞/1 | 下水道被树叶堵住 | Blocked, so the word must mean to clog.
直辖市/1 | 北京天津上海重庆 | Municipalities, so the word must mean municipality directly under the central government.
自治区/1 | 西藏和新疆 | Autonomous regions, so the word must mean autonomous region.
特区/1 | 南方沿海最早设立的经济 | Special zones, so the word must mean special zone.
乡镇/1 | 公路通到县里每一处 | Townships, so the word must mean townships and towns.
村委会/1 | 召开村民大会讨论修路 | The village committee, so the word must mean village committee.
县长/1 | 走遍全县每个乡镇 | The county head, so the word must mean county magistrate.
首府/1 | 呼和浩特是内蒙古的 | The capital, so the word must mean regional capital.
市政/1 | 修路供水和路灯 | Municipal works, so the word must mean municipal administration.
区划/1 | 两个县合并成一个区 | Divisions, so the word must mean administrative division.
地级市/1 | 下面管三个县和两个区 | A prefecture-level city, so the word must mean prefecture-level city.
赊账/1 | 熟人到月底再付钱 | On credit, so the word must mean to buy on credit.
赊购/1 | 原料三个月后付款 | Bought on credit, so the word must mean to purchase on credit.
赎回/1 | 攒够钱把当掉的手表拿回 | Redeemed, so the word must mean to redeem.
借据/1 | 借钱时让对方写一张 | An IOU, so the word must mean IOU.
借贷/1 | 银行的主要业务之一 | Lending, so the word must mean borrowing and lending.
还清/1 | 工作十年房贷全还完 | Paid off, so the word must mean to pay off.
本息/1 | 本金加利息一起还 | Principal and interest, so the word must mean principal and interest.
分期付款/1 | 每月三百元一年付完 | Instalments, so the word must mean to pay in instalments.
典当/1 | 急需用钱把手表押出去 | Pawning, so the word must mean to pawn.
当铺/1 | 缺钱时把东西送去换钱 | A pawnshop, so the word must mean pawnshop.
拮据/1 | 家里经济困难边上学边打工 | Hard up, so the word must mean short of money.
窘迫/1 | 被大家看着说不出话 | Embarrassed, so the word must mean awkward.
阔绰/1 | 一顿饭花好几千元 | Lavish, so the word must mean free-spending.
手头紧/1 | 等发了工资再买手机 | Short of cash, so the word must mean short of money.
入不敷出/1 | 花的比挣的多 | Living beyond one's means, so the word must mean expenses exceed income.
节衣缩食/1 | 父母省吃省穿供孩子上学 | Scrimping, so the word must mean to scrimp and save.
挥金如土/1 | 中大奖两年把钱花光 | Squandering, so the word must mean to spend money like water.
腰包/1 | 聚会的钱他自己出 | His own pocket, so the word must mean purse.
慷慨解囊/1 | 孩子病了邻居纷纷捐钱 | Giving generously, so the word must mean to give generously.
一贫如洗/1 | 大火烧掉房子什么都没了 | Penniless, so the word must mean utterly destitute.
甩卖/1 | 商店要关门半价卖 | A clearance sale, so the word must mean to sell off.
吆喝/1 | 推车卖菜边走边喊 | Calling out, so the word must mean to cry one's wares.
兜售/1 | 车站门口向游客卖假手表 | Peddling, so the word must mean to peddle.
叫卖/1 | 菜市场里到处是这种声音 | Hawking, so the word must mean to hawk.
清仓/1 | 冬天快过处理冬衣 | Clearing stock, so the word must mean to clear inventory.
薄利多销/1 | 小店少赚一点多卖 | Small profits quick sales, so the word must mean small profit but high turnover.
跳楼价/1 | 全场一件十元 | Rock-bottom prices, so the word must mean rock-bottom price.
大减价/1 | 年底商场很多东西打五折 | A big sale, so the word must mean big sale.
摆摊/1 | 晚上在夜市卖小吃 | A stall, so the word must mean to set up a stall.
货真价实/1 | 老店东西几十年受欢迎 | Genuine goods, so the word must mean genuine goods at fair prices.
凑钱/1 | 同学们一起出钱买花 | Pooling money, so the word must mean to pool money.
集资/1 | 村民一起出钱修桥 | Raising funds, so the word must mean to raise funds.
众筹/1 | 在网上为新电影筹到一百万 | Crowdfunding, so the word must mean crowdfunding.
赈灾/1 | 地震后政府马上拨款 | Disaster relief, so the word must mean to provide disaster relief.
赈济/1 | 古代灾荒朝廷开仓给百姓 | Relief, so the word must mean to relieve.
义卖/1 | 卖书得到的钱捐给山区 | A charity sale, so the word must mean charity sale.
善款/1 | 全部用来帮助受灾群众 | Donations, so the word must mean charitable donations.
救济金/1 | 失业后每月领一些 | Benefits, so the word must mean relief payment.
认捐/1 | 企业当场答应捐一百万 | Pledged, so the word must mean to pledge a donation.
凑份子/1 | 同事结婚几个人合买礼物 | Chipping in, so the word must mean to club together.
英镑/1 | 在英国买东西用 | Pounds, so the word must mean pound sterling.
卢布/1 | 去莫斯科先换成 | Roubles, so the word must mean rouble.
泰铢/1 | 泰国街头一碗面五十 | Baht, so the word must mean baht.
美金/1 | 人们也这样叫美元 | US dollars, so the word must mean US dollar.
港币/1 | 在香港坐地铁用 | Hong Kong dollars, so the word must mean Hong Kong dollar.
汇价/1 | 欧元最近一直在上涨 | The exchange rate, so the word must mean exchange rate.
换汇/1 | 出国留学前先去银行 | Changing money, so the word must mean to exchange currency.
本币/1 | 贬值后进口商品变贵 | The local currency, so the word must mean domestic currency.
硬通货/1 | 美元在国际贸易中 | A hard currency, so the word must mean hard currency.
保值/1 | 买黄金是为了不贬值 | Holding value, so the word must mean to preserve value.
贰/1 | 支票上二的大写 | Two in capitals, so the word must mean two.
叁/1 | 收据上三十元这样写 | Three in capitals, so the word must mean three.
肆/1 | 发票上就是数字四 | Four in capitals, so the word must mean four.
大写/1 | 金额这样写防止涂改 | Capital numerals, so the word must mean formal numerals.
小写/1 | 支票上和大写同时写 | Figures, so the word must mean ordinary numerals.
票据/1 | 出差回来交给财务 | Receipts, so the word must mean bills and receipts.
开票/1 | 需要发票请商店 | Issuing an invoice, so the word must mean to issue an invoice.
报销/1 | 出差车费住宿费可以 | Reimbursed, so the word must mean to claim expenses.
入账/1 | 钱已经在账户里查到 | Credited, so the word must mean to be entered into the account.
零头/1 | 一百零三元只收一百 | The odd amount, so the word must mean odd change.
货栈/1 | 河边一排存放货物的老房子 | Warehouses, so the word must mean warehouse.
商埠/1 | 一百多年前外国商船来往 | A trading port, so the word must mean commercial port.
开埠/1 | 上海对外开放成为大城市 | Opening as a port, so the word must mean to open a port to trade.
口岸/1 | 边境每天几千辆货车通过 | A port of entry, so the word must mean port of entry.
栈桥/1 | 青岛伸进海里四百多米 | A pier, so the word must mean pier.
客栈/1 | 古镇上接待游客的老店 | An inn, so the word must mean inn.
转口/1 | 新加坡这种贸易发达 | Entrepot trade, so the word must mean re-export.
通关/1 | 货物一小时过海关 | Clearing customs, so the word must mean to clear customs.
驳船/1 | 把货物从大船运到岸上 | Barges, so the word must mean barge.
中转站/1 | 港口是亚洲货物的 | A transit hub, so the word must mean transfer station.
斤/1 | 五百克苹果 | A jin, so the word must mean half a kilogram.
斤斤计较/1 | 朋友之间为小钱争 | Haggling over trifles, so the word must mean to be calculating.
掂量/1 | 西瓜拿在手里估重量 | Weighing in the hand, so the word must mean to weigh in the hand.
公斤/1 | 一袋米重十 | Kilograms, so the word must mean kilogram.
半斤八两/1 | 两人成绩差不多 | Six of one, so the word must mean much the same.
缺斤短两/1 | 卖东西分量不够 | Short weight, so the word must mean to give short weight.
称重/1 | 水果先放秤上 | Weighing, so the word must mean to weigh.
毛重/1 | 包括箱子二十公斤 | Gross weight, so the word must mean gross weight.
净重/1 | 不包括袋子五百克 | Net weight, so the word must mean net weight.
一分钱一分货/1 | 衣服贵但质量好 | You get what you pay for, so the word must mean quality matches price.
飙升/1 | 夏天空调销量猛涨 | Soaring, so the word must mean to soar.
暴涨/1 | 干旱粮价一下涨很多 | Shot up, so the word must mean to rise sharply.
暴跌/1 | 股价一下跌了一半 | Plunged, so the word must mean to fall sharply.
行情/1 | 蔬菜卖不出好价钱 | Market conditions, so the word must mean market situation.
涨幅/1 | 房价今年涨得比去年少 | The rise, so the word must mean rate of increase.
跌幅/1 | 下跌百分之五最大一天 | The fall, so the word must mean rate of decline.
回落/1 | 涨了一个月开始下降 | Falling back, so the word must mean to drop back.
走势/1 | 专家认为明年房价平稳 | The trend, so the word must mean trend.
萎靡不振/1 | 市场不好商店生意差 | Sluggish, so the word must mean listless.
增值/1 | 房子买了十年值钱多了 | Appreciated, so the word must mean to rise in value.
散户/1 | 资金少消息不灵通 | Retail investors, so the word must mean individual investor.
熊市/1 | 大部分股票价格下跌 | A bear market, so the word must mean bear market.
大盘/1 | 今天整个股市涨两个百分点 | The market index, so the word must mean overall market.
开盘/1 | 早上九点半股市 | Opening, so the word must mean market opening.
收盘/1 | 下午三点股市结束 | Closing, so the word must mean market close.
涨停/1 | 好消息一开盘就涨到顶 | Limit up, so the word must mean to hit the daily upper limit.
跌停/1 | 公司出问题连续三天 | Limit down, so the word must mean to hit the daily lower limit.
抄底/1 | 想在最低价时买进 | Bottom fishing, so the word must mean to buy at the bottom.
套牢/1 | 高价买的股票舍不得卖 | Stuck, so the word must mean to be locked in at a loss.
市值/1 | 公司一年里翻了一番 | Market value, so the word must mean market capitalisation.
揣测/1 | 人们猜明年经济怎么样 | Speculating, so the word must mean to conjecture.
揣摩/1 | 演员仔细体会角色心理 | Studying, so the word must mean to try to fathom.
大鳄/1 | 金融界资金多能影响市场 | Big players, so the word must mean financial shark.
投机/1 | 买房不为住为赚钱 | Speculation, so the word must mean to speculate.
割肉/1 | 股价一跌再跌只好卖 | Cutting losses, so the word must mean to sell at a loss.
炒股/1 | 不懂买卖股票却全投进去 | Trading stocks, so the word must mean to speculate in stocks.
观望/1 | 房价不稳还在等 | Waiting and seeing, so the word must mean to wait and see.
跟风/1 | 别人买什么他就买什么 | Following the crowd, so the word must mean to follow the trend.
庄家/1 | 先推高股价再高价卖出 | Market manipulators, so the word must mean manipulator.
追涨/1 | 看到上涨就买进 | Chasing rises, so the word must mean to buy into a rally.
敛财/1 | 骗子借慈善名义 | Amassing wealth, so the word must mean to amass wealth.
聚敛/1 | 古代官员向百姓收钱财 | Extorting, so the word must mean to amass by exaction.
捞钱/1 | 当官不为做事为赚钱 | Grabbing money, so the word must mean to rake in money.
榨取/1 | 工厂主用低工资 | Squeezing, so the word must mean to extort.
压榨/1 | 机器把花生做成油 | Pressing, so the word must mean to press.
暴利/1 | 假药成本低获得 | Huge profits, so the word must mean exorbitant profit.
不义之财/1 | 一辈子清白不拿 | Ill-gotten gains, so the word must mean ill-gotten wealth.
坐收渔利/1 | 两家争第三家得好处 | Profiting from others' fight, so the word must mean to reap the spoils.
中饱私囊/1 | 把公款放进自己口袋 | Lining one's pockets, so the word must mean to embezzle.
大肆/1 | 公司宣传得很厉害 | Wantonly, so the word must mean without restraint.
缉私/1 | 海关船在海上巡逻 | Anti-smuggling, so the word must mean to suppress smuggling.
通缉/1 | 警察在全国发布抓逃犯的令 | Wanted, so the word must mean to put on the wanted list.
洗钱/1 | 银行报告可疑大额交易 | Money laundering, so the word must mean to launder money.
偷税/1 | 公司做假账被罚款 | Tax evasion, so the word must mean to evade tax.
漏税/1 | 小商贩不了解规定 | Unpaid tax, so the word must mean to fail to pay tax.
逃税/1 | 把钱转到国外 | Dodging tax, so the word must mean to dodge tax.
查封/1 | 卖假药的商店被贴封条 | Sealed off, so the word must mean to seal up.
追缴/1 | 税务部门向公司要回税款 | Recovering, so the word must mean to recover.
走私/1 | 海关查获一批手机 | Smuggling, so the word must mean to smuggle.
囤积居奇/1 | 灾情后商人把粮价提高 | Hoarding, so the word must mean to hoard for profit.
储户/1 | 银行要保护存款安全 | Depositors, so the word must mean depositor.
销户/1 | 银行卡不用了去办理 | Closing an account, so the word must mean to close an account.
网银/1 | 转账不用去银行排队 | Online banking, so the word must mean online banking.
零存整取/1 | 每月存五百一年后一起取 | A savings plan, so the word must mean regular deposits withdrawn in a lump.
自动取款机/1 | 银行关门了去取钱 | A cash machine, so the word must mean ATM.
存单/1 | 带着它和身份证取钱 | A certificate of deposit, so the word must mean deposit receipt.
挂失/1 | 银行卡丢了马上打电话 | Reporting a loss, so the word must mean to report a loss.
利滚利/1 | 要还的比借的多很多 | Compound interest, so the word must mean compound interest.
网点/1 | 银行在全市有一百多个 | Branches, so the word must mean outlet.
存取/1 | 在任何分行存钱取钱 | Deposits and withdrawals, so the word must mean to deposit and withdraw.
经济危机/1 | 一九二九年工厂倒闭工人失业 | An economic crisis, so the word must mean economic crisis.
通货紧缩/1 | 物价不断下降人们不愿花钱 | Deflation, so the word must mean deflation.
经济周期/1 | 繁荣衰退萧条复苏 | The business cycle, so the word must mean economic cycle.
内需/1 | 让国内的人多消费 | Domestic demand, so the word must mean domestic demand.
外需/1 | 出口工厂订单少了 | External demand, so the word must mean foreign demand.
拉动/1 | 旅游业发展带动当地经济 | Boosting, so the word must mean to drive.
供过于求/1 | 苹果大丰收价格下降 | Oversupply, so the word must mean supply exceeds demand.
过热/1 | 防止经济增长太快 | Overheating, so the word must mean overheating.
软着陆/1 | 增长速度慢慢降下来 | A soft landing, so the word must mean soft landing.
降息/1 | 央行鼓励企业借钱 | A rate cut, so the word must mean to cut interest rates.
`);
