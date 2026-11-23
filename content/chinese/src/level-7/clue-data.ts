// The clues of the gap sentences of the level 7 words (docs/chinese-curriculum.md §6), written by hand a sentence at a
// time: what in the sentence decides its word, in Chinese and in English. A word of the batch that could also fill a
// sentence is kept apart from its word in the word data.

import { parseClues } from "../words/clues.ts";

/** levelSevenClues are the clues of the gap sentences of the level 7 words, by clueKey, each word's sentence counted as 1. */
export const levelSevenClues = parseClues(`
兴衰/1 | 古城见证了几个朝代的起落 | The old city has watched several dynasties come up and go down, so the word must mean rise and fall.
衰落/1 | 铁路通了以后码头渐渐不行了 | Once the railway came, the canal wharf was used less and less, so the word must mean to decline.
衰退/1 | 年纪大了记忆力慢慢变差 | The sentence speaks of memory slowly growing worse as people age, so the word must mean to weaken.
没落/1 | 有名的家族到他这一代 | A family that was once famous has lost its standing by his generation, so the word must mean to fall into decline.
兴旺/1 | 开了新工厂镇上的生意 | A new factory has opened and the town's trade does better and better, so the word must mean prosperous.
旺盛/1 | 孩子们玩一天也不累 | The children play all day and never feel tired, so the word must mean vigorous.
萧条/1 | 那几年很多工厂停工 | In those years many factories stopped work, so the word must mean depression.
崛起/1 | 国家离不开教育和科技 | A nation's growth into strength depends on education and science, so the word must mean rise.
腾飞/1 | 改革开放以后地区的经济 | After reform and opening up the region's economy began to soar, so the word must mean to take off.
衰老/1 | 运动可以延缓身体的 | Exercise slows what happens to the body as the years pass, so the word must mean ageing.
巨变/1 | 小渔村现在到处是高楼 | A small fishing village is now full of tall buildings, so the word must mean great change.
缓慢/1 | 老人走路很慢 | We must wait patiently because the old man walks at a slow pace, so the word must mean slow.
迅猛/1 | 网上购物发展很快 | Within a few years most people have come to buy online and few go to shops, so the word must mean rapid.
飞跃/1 | 从写信到电子邮件 | Going from letters to email was a sudden step forward in how people write to each other, so the word must mean leap.
突飞猛进/1 | 一年努力汉语水平进步很快 | After one year of hard work his Chinese improved very quickly, so the word must mean to advance by leaps and bounds.
日新月异/1 | 去年的手机今年就有新型号 | A phone bought last year already has a newer model this year, so the word must mean to change with each passing day.
激烈/1 | 找工作的竞争越来越 | More and more people compete for each job, and 越来越 asks for how hard the contest is, so the word must mean intense.
缓和/1 | 道了歉，紧张的关系 | Once the two apologised, the tension between them came down, so the word must mean to ease.
跃升/1 | 小说一个月销量到第一名 | A month after publication the novel's sales reached first place, so the word must mean to jump.
停滞/1 | 缺少新技术，发展很多年不动 | Without new technology the factory went nowhere for many years, so the word must mean to stagnate.
迁徙/1 | 每年秋天鸟向南飞 | Every autumn many birds fly south, so the word must mean to migrate.
拆迁/1 | 老房子拆了，居民搬进新楼 | The old houses are to be pulled down and the residents have moved into new flats, so the word must mean to demolish and relocate.
拆除/1 | 危险的旧桥已经被 | The dangerous old bridge has been taken away by 被, so the word must mean to dismantle.
涌入/1 | 春节过后大批打工的人到城市 | After the Spring Festival great numbers of migrant workers pour into the cities, so the word must mean to flood into.
流动人口/1 | 大多从外地来打工 | Most of these people have come from elsewhere to work, so the word must mean floating population.
返乡/1 | 大学生毕业后回家乡创业 | The graduates studied away from home and now start businesses back in their home towns, so the word must mean to return home.
落户/1 | 工作五年终于在这里有了户口 | After five years of work he finally has his household registration here, so the word must mean to settle.
户籍/1 | 入学时要提供的证明 | Enrolling a child at school needs proof of where the family is registered, so the word must mean household register.
迁居/1 | 爷爷退休后搬到海边小城 | After retiring, Grandpa moved to a small town by the sea, so the word must mean to move house.
春运/1 | 期间火车票很难买 | Train tickets are hard to buy during this time of year, so the word must mean Spring Festival travel rush.
陋习/1 | 随地丢垃圾应该改掉 | Throwing litter anywhere is something that should be given up, so the word must mean bad habit.
时髦/1 | 她的大衣很引人注意 | Her coat draws everyone's eye in the street, so the word must mean fashionable.
赶时髦/1 | 买新手机不是因为需要 | He bought a new phone not out of need but to keep up with others, so the word must mean to follow fashion.
落伍/1 | 爷爷连用手机付钱都不会 | Grandpa laughs that he cannot even pay with a phone, so the word must mean outdated.
昔日/1 | 过去的小渔村如今是旅游城市 | The village of the past has now become a busy tourist city, so the word must mean former days.
今非昔比/1 | 小镇的变化太大了 | The town has changed beyond recognition and is nothing like before, so the word must mean the present is not like the past.
与时俱进/1 | 教材加入新知识 | Textbooks should add new knowledge as times change, so the word must mean to keep up with the times.
抛弃/1 | “女孩子不用读书”这种旧观念 | The old idea that girls need no schooling is something we should throw away, so the word must mean to abandon.
沿袭/1 | 村子至今还保留古老的婚礼习俗 | The village still keeps its ancient wedding customs, so the word must mean to carry on.
守旧/1 | 奶奶七十岁还学会网上购物 | At seventy Grandma learned to shop online, and 并不 denies the opposite, so the word must mean conservative.
少子化/1 | 日本和韩国新生儿越来越少 | In Japan and Korea fewer and fewer babies are born, so the word must mean declining birth rate.
生育率/1 | 人口稳定需要大约二点一 | A stable population needs a figure of about 2.1 children per woman, so the word must mean fertility rate.
人均寿命/1 | 医疗改善以后不断提高 | As medicine improves, people live longer and longer, so the word must mean life expectancy.
独生子女/1 | 小时候羡慕有哥哥姐姐的同学 | As a child he envied classmates who had older brothers and sisters, so the word must mean only child.
空巢老人/1 | 志愿者每周去陪他们聊天 | Volunteers visit these old people every week to keep them company, so the word must mean empty-nest elderly.
赡养/1 | 子女有照顾父母的义务 | Children have a duty to care for their parents, so the word must mean to support one's elders.
留守儿童/1 | 父母在城里打工，奶奶带大 | His parents work in the city and his grandmother raised him, so the word must mean left-behind child.
二孩/1 | 政策放开后有了第二个孩子 | Once the policy opened, many families had a second child, so the word must mean second child.
银发族/1 | 越来越多的开始学用手机上网 | More and more of these people are learning to go online with phones, so the word must mean silver-haired generation.
四世同堂/1 | 王奶奶的重孙子刚出生 | Grandma Wang's great-grandson has just been born, so the word must mean four generations under one roof.
住宅/1 | 土地只能用来建，不能建工厂 | The land may be used for homes but not for factories, so the word must mean residence.
豪宅/1 | 富商住在海边的 | A rich merchant lives in this house by the sea, so the word must mean mansion.
楼梯/1 | 电梯坏了只好走 | The lift is broken and they have to walk up to the tenth floor, so the word must mean stairs.
电梯/1 | 老楼没有，老人上下楼不方便 | Old people find going up and down hard because the old building lacks this, so the word must mean lift.
简陋/1 | 只有一张床和一张桌子 | The house had only a bed and a table, so the word must mean crude, simple.
平房/1 | 小时候住的，院子里种着花 | They lived there as children, with flowers growing in the yard, so the word must mean bungalow.
楼房/1 | 村里盖起了三层的 | Many village families have built three-storey houses, so the word must mean multi-storey building.
四合院/1 | 北京的老胡同里很多 | The old hutongs of Beijing have many of these, so the word must mean courtyard house.
房贷/1 | 工资的一半用来还 | Half his monthly pay goes to paying back the loan on his home, so the word must mean mortgage.
租金/1 | 市中心房子的很高 | Flats in the centre cost too much to rent, which is why he lives in the suburbs, so the word must mean rent.
温饱/1 | 几十年前最大的愿望是吃饱穿暖 | Decades ago many families wanted above all to have enough to eat and wear, so the word must mean basic needs.
小康/1 | 一家过上了不错的生活 | After years of effort the family now lives comfortably, so the word must mean moderate prosperity.
脱贫/1 | 山村靠种茶叶不再穷 | Growing tea has let the mountain village stop being poor, so the word must mean to escape poverty.
扶贫/1 | 到山区帮村民卖水果 | He went to the mountains to help villagers sell their fruit, so the word must mean poverty relief.
贫富差距/1 | 怎样减小是很多国家的难题 | Many countries struggle to close the distance between rich and poor, so the word must mean wealth gap.
富豪/1 | 把一大半财产捐给慈善机构 | This person gave most of a great fortune to charity, so the word must mean tycoon.
饥饿/1 | 世界上仍有很多人在忍受 | Many people in the world still go without enough food, so the word must mean hunger.
饥荒/1 | 大旱常常造成 | In history great droughts often left whole regions without food, so the word must mean famine.
微薄/1 | 用不多的工资帮助孩子 | He helped children with the little money his job pays, so the word must mean meagre.
宽裕/1 | 家里经济条件好了，买了车 | The family has more money these years and has bought a car, so the word must mean well-off.
炫富/1 | 在网上晒名牌包和豪车 | Some people show off designer bags and luxury cars online, so the word must mean to flaunt wealth.
排场/1 | 婚礼简单一点就好 | A wedding can be simple, and 讲 asks what it need not make a show of, so the word must mean ostentation.
铺张/1 | 请客点很多菜吃不完 | Some people order far more dishes than can be eaten, just for face, so the word must mean extravagant.
超前消费/1 | 用信用卡买用不上的东西 | Buying things one does not need on a credit card spends money not yet earned, so the word must mean overspending.
勤俭节约/1 | 老一辈人保持的好习惯 | The older generation has always kept this good habit with money, so the word must mean thrift.
带货/1 | 网红直播卖东西 | The influencer sold a great many goods while livestreaming, so the word must mean to sell products via livestream.
消费主义/1 | 买得越多不一定越幸福 | Its critics say that buying more does not always bring more happiness, so the word must mean consumerism.
旺季/1 | 夏天海边酒店很难订 | Hotels by the sea are hard to book in summer, so the word must mean peak season.
淡季/1 | 冬天机票很便宜 | Air tickets here are cheap in winter, so the word must mean off season.
滞销/1 | 苹果大丰收怕卖不出去 | After a bumper apple harvest, growers fear their apples will not sell, so the word must mean to sell poorly.
移动支付/1 | 出门只带一部手机就够了 | People can go out carrying only a phone, so the word must mean mobile payment.
刷脸/1 | 不用门卡就能开门 | Residents need no key card because their faces open the gate, so the word must mean face recognition.
无人驾驶/1 | 城市在测试的出租车 | Some cities are testing taxis that run with no one at the wheel, so the word must mean driverless.
大数据/1 | 网站根据用户习惯展示商品 | Shopping sites use what they record of users' habits to show goods they may like, so the word must mean big data.
外卖员/1 | 下大雨还在路上送饭 | In heavy rain these workers are still out delivering meals, so the word must mean delivery rider.
共享单车/1 | 地铁站旁停着，骑一会儿到公司 | Commuters ride these bikes from the station to the office, so the word must mean shared bike.
网约车/1 | 下了飞机用手机叫的车 | After landing he ordered a car with his phone, so the word must mean ride-hailing car.
短视频/1 | 每天花两个小时刷 | He spends two hours a day scrolling through these clips, so the word must mean short video.
覆盖/1 | 无线网络到了所有公园 | Wireless internet now reaches every park in the city, so the word must mean to cover.
数字化/1 | 图书馆把古书放到网上 | The library is putting old books online for readers, so the word must mean to digitise.
婚恋/1 | 节目讨论年轻人的恋爱结婚观念 | The programme discusses young people's views on dating and marriage, so the word must mean love and marriage.
恋爱/1 | 他们三年才结婚 | They were together for three years before they married, so the word must mean to be in love.
包办婚姻/1 | 不能自己选择爱人 | Young people could not choose whom to marry and had to accept others' choice, so the word must mean arranged marriage.
媒人/1 | 过去结婚要靠介绍的人 | In the past a wedding usually depended on someone introducing the couple, so the word must mean matchmaker.
门当户对/1 | 不太讲究家庭条件一样 | Young people now care about feelings more than about matching family status, so the word must mean well-matched families.
单亲家庭/1 | 妈妈一个人把他养大 | His mother raised him by herself, so the word must mean single-parent family.
核心家庭/1 | 爷爷奶奶不和孙子住在一起 | In the city grandparents do not live with their grandchildren, so the word must mean nuclear family.
双职工/1 | 父母都上班，孩子由爷爷奶奶接 | Both parents work and the grandparents collect the child from school, so the word must mean dual-income.
家庭主妇/1 | 结婚后几年在家不工作 | After marrying she spent a few years at home before returning to work, so the word must mean housewife.
晚婚/1 | 很多人三十多岁才结婚 | Many people do not marry until their thirties, so the word must mean late marriage.
开明/1 | 父母支持他选喜欢的专业 | His parents support his choice of subject, so the word must mean enlightened.
保守/1 | 老一代不太容易接受新东西 | The older generation does not take easily to new things, so the word must mean conservative.
隔阂/1 | 两代人之间的 | Talking more can remove what stands between the two generations, so the word must mean estrangement.
淡薄/1 | 搬进高楼以后邻居感情 | After moving into tower blocks, neighbours feel less close to each other, so the word must mean faint.
依恋/1 | 小孩子对妈妈 | Small children feel a strong pull toward their mothers, so the word must mean attachment.
留恋/1 | 毕业时舍不得校园生活 | At graduation everyone hates to leave campus life behind, so the word must mean to be reluctant to leave.
逆境/1 | 在困难中也不放弃 | Only those who do not give up when things go wrong succeed, so the word must mean adversity.
顺境/1 | 容易骄傲的时候 | People grow proud when all goes well and must keep reminding themselves, so the word must mean favourable circumstances.
刻薄/1 | 说话常常让人下不了台 | His words often leave people humiliated in front of others, so the word must mean harsh.
自豪/1 | 看到家乡的变化 | Seeing how his home town has changed fills him with a good feeling about it, so the word must mean proud.
城镇化/1 | 越来越多农民住进城镇 | More and more farmers have moved into towns, so the word must mean urbanisation.
机械化/1 | 一台机器干几十个人的活 | One machine now does the work of dozens of people on the farm, so the word must mean mechanisation.
种地/1 | 爷爷一辈子在农村 | His grandfather spent his whole life working the land in the countryside, so the word must mean to farm.
化肥/1 | 用太多会让土地变差 | Using too much of this spoils the soil, so the word must mean fertiliser.
水利/1 | 修了工程再也不怕旱 | Since the works were built, this place no longer fears drought, so the word must mean water conservancy.
老乡/1 | 在外地遇到听到家乡话 | Hearing the dialect of home from someone met far away feels warm, so the word must mean fellow townsman.
思乡/1 | 中秋节在外地工作特别想家 | At the Mid-Autumn Festival he misses home while working far away, so the word must mean homesick.
故乡/1 | 离开二十年后回去看看 | He went back to see the place he had left twenty years before, so the word must mean hometown.
外地/1 | 饭馆老板是从别的地方来的 | The restaurant owner came from elsewhere and cooks distinctive dishes, so the word must mean another place.
迈向/1 | 小村子一步一步走向现代化 | The village moves step by step toward modern life, so the word must mean to stride toward.
赶超/1 | 技术正在追上并超过世界水平 | The company's technology is closing in on the world's best, so the word must mean to catch up and surpass.
追赶/1 | 拼命跑终于追上前面的人 | He ran hard after the person ahead and finally caught up, so the word must mean to chase.
涌现/1 | 近些年出了一批优秀作家 | In recent years a whole group of fine young writers has appeared, so the word must mean to emerge in large numbers.
奔波/1 | 为了生活每天在城市里跑 | He hurries around the city every day to make a living, so the word must mean to rush about.
奔小康/1 | 一起种果树走上的路 | Planting fruit trees together put the villagers on the road to a better life, so the word must mean to strive for moderate prosperity.
逆转/1 | 最后五分钟进两球 | The team scored twice in the last five minutes and turned the result around, so the word must mean to reverse.
扭转/1 | 新经理改变了亏钱的局面 | The new manager quickly stopped the company losing money, so the word must mean to turn around.
势不可挡/1 | 新能源汽车的发展 | New-energy cars keep growing and nothing can hold them back, so the word must mean unstoppable.
跨越/1 | 大桥横过长江 | The bridge goes over the Yangtze and joins its two banks, so the word must mean to span.
淘汰/1 | 不学新技术的工厂被市场 | Factories that will not learn new technology are pushed out by the market, so the word must mean to eliminate.
粮票/1 | 八十年代以前买米买面要用 | Before the 1980s buying rice and flour in China required these coupons, so the word must mean grain coupon.
布票/1 | 做新衣服还要用 | Making new clothes then took coupons as well as money, so the word must mean cloth coupon.
凭票/1 | 有钱也买不到，要票才供应 | Many goods could not be bought with money alone and needed coupons, so the word must mean with a coupon.
排长队/1 | 新店开业门口很多人 | Many people stand at the door of a newly opened shop, so the word must mean to queue.
物资/1 | 地震后各地送到灾区 | After the earthquake many places sent relief goods to the disaster area, so the word must mean supplies.
短缺/1 | 那时商品少，买电视很难 | Even a television was hard to buy then because goods were scarce, so the word must mean shortage.
计划经济/1 | 工厂生产什么都由国家安排 | In that period the state decided what every factory produced, so the word must mean planned economy.
个体户/1 | 在街上开了一家小饭馆 | He runs a small restaurant of his own on the street, so the word must mean self-employed trader.
下海/1 | 辞去工厂工作去经商 | In the 1990s he left his factory job to go into trade, so the word must mean to go into business.
万元户/1 | 改革开放初期让人羡慕 | Early in reform and opening up such a household was much envied, so the word must mean ten-thousand-yuan household.
社保/1 | 公司每个月给员工交 | The company pays this for its staff every month, so the word must mean social security.
医保/1 | 看病大部分费用可以报销 | Most medical costs can be claimed back with this, so the word must mean medical insurance.
救济/1 | 政府给受灾家庭发的钱 | The government gave money to families hit by the disaster, so the word must mean relief.
捐赠/1 | 把古书都送给博物馆 | He gave his collection of old books to the museum, so the word must mean to donate.
敬老院/1 | 没有子女照顾的老人住进 | Old people with no children to care for them can live here, so the word must mean home for the aged.
护工/1 | 妈妈住院时请来照顾她 | When Mother was in hospital they hired someone to look after her, so the word must mean care worker.
家政/1 | 每天去不同人家打扫 | She cleans different homes every day for her company, so the word must mean housekeeping services.
居家养老/1 | 不愿去养老院 | Many old people would rather be cared for at home than in a care home, so the word must mean home-based elderly care.
权益/1 | 买到假货要保护自己的 | When you buy fakes you must learn to protect what you are owed, so the word must mean rights and interests.
居委会/1 | 小区里有困难可以找 | Residents with problems can go to this local body for help, so the word must mean residents' committee.
往昔/1 | 奶奶回忆过去的日子 | Grandma laughs and laughs as she recalls days long gone, so the word must mean the past.
消逝/1 | 老手艺正在慢慢没有了 | Some old crafts are slowly disappearing as times change, so the word must mean to fade away.
流逝/1 | 时间一天天过去 | Day after day goes by, and suddenly he has worked ten years, so the word must mean to elapse.
逝世/1 | 科学家去年去世，九十岁 | The famous scientist died last year aged ninety, and 享年 marks a respectful death, so the word must mean to pass away.
遭遇/1 | 老店在经济危机中碰到困难 | The old shop met great difficulties in the economic crisis, so the word must mean to encounter.
遭受/1 | 地区去年受到严重水灾 | The region was hit by serious floods last year, so the word must mean to suffer.
抛开/1 | 别的不说，价格就太贵 | Leaving everything else aside, the price alone is too high, so the word must mean to set aside.
转折/1 | 考上大学是人生的 | Getting into university was the point where his life changed direction, so the word must mean turn.
历程/1 | 小村庄几十年的发展 | The book records decades of a village's growth from start to now, so the word must mean course.
进程/1 | 新技术加快了城市化的 | New technology has sped up how urbanisation moves forward, so the word must mean process.
学前教育/1 | 幼儿园进行的 | Kindergartens are the main place where it happens, so the word must mean preschool education.
托儿所/1 | 上班前把一岁的女儿送去 | She drops her one-year-old daughter there before work, so the word must mean nursery.
义务教育/1 | 中国一共九年，包括小学和初中 | In China it lasts nine years and covers primary and junior middle school, so the word must mean compulsory education.
高等教育/1 | 年轻人走进大学校园 | More and more young people get to walk onto a university campus, so the word must mean higher education.
职业教育/1 | 培养厨师、电工 | It trains cooks, electricians and mechanics, so the word must mean vocational education.
成人教育/1 | 成年人在工作之余接受的 | The sentence defines it as what grown-ups study alongside their jobs, so the word must mean adult education.
终身学习/1 | 毕业了也要继续学 | Society changes fast and people cannot stop learning when they graduate, so the word must mean lifelong learning.
夜校/1 | 白天上班，晚上去学会计 | He works by day and studies accounting in the evening, so the word must mean night school.
远程教育/1 | 山区的孩子听城里老师的课 | Children in the mountains can follow classes given by teachers in the city, so the word must mean distance education.
私立/1 | 学校不是政府办的，学费很高 | The school is not run by the government and its fees are high, so the word must mean private.
名校/1 | 百年的，培养了很多人才 | The hundred-year-old middle school has produced many talented people, so the word must mean famous school.
学府/1 | 北京大学是著名的高等 | Peking University is named with 高等 as a famous seat of learning, so the word must mean institution of learning.
公立/1 | 学校由政府出钱办 | The government pays to run the school and its fees are low, so the word must mean public.
母校/1 | 毕业二十年后回去做讲座 | Twenty years after graduating he goes back to the school he left to give a talk, so the word must mean alma mater.
寄宿学校/1 | 每个月只回家一次 | He goes home only once a month, so the word must mean boarding school.
学堂/1 | 一百多年前县里第一所新式的 | Over a century ago the county opened its first new-style place of learning here, so the word must mean school, old term.
补习班/1 | 周末去提高数学成绩 | He spends weekends in extra classes to raise his maths marks, so the word must mean cram class.
兴趣班/1 | 画画和跳舞两个 | She signed her daughter up for painting and dancing, so the word must mean hobby class.
家教/1 | 大学生每周来讲两次英语 | A university student comes twice a week to teach him English, so the word must mean private tutor.
学区房/1 | 为了上好学校花大价钱买 | They paid a great deal for a home in order that their child could go to a good school, so the word must mean school-district housing.
学士/1 | 大学毕业拿到的学位 | He has finished university and been awarded his first degree, so the word must mean bachelor.
博士后/1 | 拿到博士学位以后又做了两年 | After his doctorate he did two more years of research abroad, so the word must mean postdoc.
本科生/1 | 这门课只对研究生开放 | The course is open only to graduate students and others may not take it, so the word must mean undergraduate.
大专/1 | 没有读本科，读三年制的 | He did not do a four-year degree but a three-year course, so the word must mean junior college.
院士/1 | 当选为科学院的 | At eighty the scientist was elected to the Chinese Academy of Sciences, so the word must mean academician.
副教授/1 | 三十五岁当上，四十岁成了教授 | She got this rank at thirty-five and became a full professor at forty, so the word must mean associate professor.
副校长/1 | 校长出国，学校由他负责 | While the principal is abroad, someone else runs the school, so the word must mean vice principal.
讲师/1 | 助教以后、副教授以前 | In the list of ranks it comes after teaching assistant and before associate professor, so the word must mean lecturer.
助教/1 | 读研究生时给本科生上辅导课 | As a graduate student he ran tutorials for undergraduates, so the word must mean teaching assistant.
学术/1 | 教授在国际会议上演讲 | The professor spoke at an international meeting of scholars, so the word must mean academic.
寝室/1 | 住了四个人，相处很好 | Four of them share it and get on well, so the word must mean dormitory room.
熄灯/1 | 宿舍晚上十一点 | At eleven at night everyone in the dormitory must go to bed, so the word must mean lights out.
晨读/1 | 早上七点在教室大声朗读 | At seven every morning the pupils read their lessons aloud in class, so the word must mean morning reading.
早操/1 | 早上六点半住校的学生做 | At half past six the boarders exercise on the sports ground, so the word must mean morning exercises.
课间操/1 | 第二节课下课后全校做 | After the second lesson the whole school exercises on the sports ground, so the word must mean break-time exercises.
晚自习/1 | 高三学生九点半才放学 | Final-year pupils stay at school until half past nine every night, so the word must mean evening self-study.
上课铃/1 | 响了，同学们跑回教室 | When it rings, the pupils run back to their classroom, so the word must mean school bell.
走读/1 | 家离学校近，不在学校住 | He lives near the school and does not board there, so the word must mean to attend as a day pupil.
住校/1 | 家在山里，周末才回家 | His home in the mountains is too far away and he goes home only at weekends, so the word must mean to live at school.
校服/1 | 每周一升国旗时要穿 | Everyone must wear it at the Monday flag-raising, so the word must mean school uniform.
铅笔/1 | 画图时用，画错了可以擦掉 | Mistakes in a drawing can be rubbed out if it is drawn with this, so the word must mean pencil.
橡皮/1 | 写错了字借来用一下 | The speaker wrote a character wrong and wants to borrow something to fix it, so the word must mean eraser.
尺子/1 | 量一量桌子多长 | It is used to find out how long the desk is, so the word must mean ruler.
粉笔/1 | 老师在黑板上写 | The teacher writes today's problem on the blackboard with it, so the word must mean chalk.
讲台/1 | 老师站在上面讲课 | The teacher stands up there to give the lesson, so the word must mean platform.
课桌/1 | 每个同学的上放着新书 | A new book lies on each pupil's one, so the word must mean desk.
文具/1 | 开学前妈妈买了很多 | Before term began, Mum bought him a lot of school things, so the word must mean stationery.
圆规/1 | 数学课上用它画圆 | In maths class they drew a circle with it, so the word must mean compasses.
作业本/1 | 老师改好发给大家 | The teacher hands back what she has marked, so the word must mean exercise book.
练习册/1 | 数学的很多题，每天做一页 | The maths book is full of problems and he does a page a day, so the word must mean workbook.
班长/1 | 负责班里的大小事情 | His classmates elected him to look after everything in the class, so the word must mean class monitor.
学习委员/1 | 负责组织学习小组和读书会 | This pupil organises the class's study groups and reading club, so the word must mean study monitor.
课代表/1 | 每天帮老师收数学作业 | Every day he collects the maths homework for the teacher, so the word must mean subject representative.
同窗/1 | 大学时一起读书的人 | They studied together at university and have kept in touch, so the word must mean schoolmate.
学长/1 | 比我早两年进大学 | He started university two years before the speaker, so the word must mean senior schoolmate.
学妹/1 | 比我晚一年进学校的女生 | She started at the school a year after the speaker, so the word must mean junior schoolmate.
班风/1 | 同学们都努力、互相帮助 | The whole class works hard and its pupils help one another, so the word must mean class ethos.
三好学生/1 | 学习好、身体好、品德好 | He is good at study, in health and in conduct, so the word must mean merit student.
尖子生/1 | 每次考试都是第一名 | He comes first in every exam, so the word must mean top student.
后进生/1 | 老师耐心帮他们补课 | The teacher never gives up on pupils who fall behind and tutors them patiently, so the word must mean underachiever.
温习/1 | 考试前把课本看一遍 | Before the exam he went through the textbook from start to end, so the word must mean to revise.
巩固/1 | 做练习让课上学的更牢 | Exercises make what was learned in class stick, so the word must mean to consolidate.
钻研/1 | 一心研究技术成了工程师 | He gave himself wholly to technology and became the best engineer in the factory, so the word must mean to study intensively.
探究/1 | 做实验找植物生长需要的条件 | The pupils do experiments to find out what plants need to grow, so the word must mean to explore.
死记硬背/1 | 学数学不能只背公式 | In maths one should understand where a formula comes from, not just recite it, so the word must mean rote memorisation.
温故知新/1 | 复习旧课也有新收获 | Reviewing old lessons also brings something new, so the word must mean to learn new things by reviewing old.
循序渐进/1 | 学外语不能一下子太难 | A foreign language cannot be learned by jumping straight to hard material, so the word must mean to proceed step by step.
熟能生巧/1 | 打字练多了自然快 | Typing is slow at first but grows fast with plenty of practice, so the word must mean practice makes perfect.
钻牛角尖/1 | 想不出来就先放一放 | If you cannot solve a problem, put it aside for now instead of getting stuck on it, so the word must mean to split hairs.
谨慎/1 | 做化学实验按老师说的做 | Chemistry experiments must follow exactly what the teacher says, so the word must mean cautious.
领悟/1 | 读书后慢慢明白坚持的意义 | Reading the book slowly made him see what perseverance means, so the word must mean to comprehend.
醒悟/1 | 考试不及格才明白过来 | Only failing the exam made him realise and start studying hard, so the word must mean to come to one's senses.
感悟/1 | 读完书以后的体会 | You are asked to write what the book taught you, so the word must mean insight.
悟性/1 | 老师一讲就懂 | The child understands as soon as the teacher explains, so the word must mean understanding.
一知半解/1 | 对这个问题只知道一点 | The speaker knows only a little about the question and must study it more, so the word must mean superficial understanding.
不求甚解/1 | 看完也说不清书里讲什么 | When he finishes a book he still cannot say what it was about, so the word must mean to not seek full understanding.
似懂非懂/1 | 听完解释还是不太明白地点头 | After the explanation he nodded without really understanding, so the word must mean to half understand.
心领神会/1 | 老师看了他一眼他马上明白 | One glance from the teacher and he understood at once and fell silent, so the word must mean to understand tacitly.
迷惑/1 | 题的说法让同学们不明白 | The wording of the problem left many pupils unsure what it meant, so the word must mean puzzled.
专心致志/1 | 做作业连妈妈叫他也没听见 | He was absorbed in his homework and did not even hear his mother call, so the word must mean wholly absorbed.
愚笨/1 | 觉得自己笨，其实是方法不对 | He thinks he is not clever, but he just has not found a good way to study, so the word must mean stupid.
迟钝/1 | 没睡好，今天反应慢 | He slept badly and today he reacts slowly, so the word must mean slow-witted.
笨拙/1 | 第一次包饺子动作 | It is his first time making dumplings, so the word must mean clumsy.
发呆/1 | 上课看着窗外 | In class he often gazes out of the window, so the word must mean to stare blankly.
天分/1 | 三岁就会弹钢琴 | She could play the piano at three, so the word must mean talent.
资质/1 | 学习好坏不光看这个，更看努力 | Success depends not only on what you are born with but more on effort, so the word must mean aptitude.
呆板/1 | 文章读起来没有意思 | The essay is dull to read, so the word must mean rigid, dull.
大智若愚/1 | 话不多看上去笨，其实很聪明 | He says little and seems slow, but in fact he is wise, so the word must mean great wisdom appearing foolish.
心灵手巧/1 | 一张纸剪出漂亮的小鸟 | She can cut a lovely little bird from a single sheet of paper, so the word must mean clever and deft.
愚公移山/1 | 再难的事也坚持去做的精神 | We should keep at even the hardest task, like the old man who moved mountains, so the word must mean perseverance against odds.
懒惰/1 | 这样的人很难成功 | People like this find it hard to succeed, so the word must mean lazy.
偷懒/1 | 老师一离开就不做事 | As soon as the teacher leaves, some pupils stop working, so the word must mean to slack off.
刻苦/1 | 学习每天很晚才睡 | He goes to bed very late every night because of his studies, so the word must mean hardworking.
废寝忘食/1 | 为实验不睡觉不吃饭 | He worked for days without proper sleep or meals to finish the experiment, so the word must mean to forget to eat and sleep.
持之以恒/1 | 学习每天进步一点点 | What counts in study is improving a little every day, so the word must mean to persevere.
半途而废/1 | 开始了就不要停下 | Once you have started, you should not stop before the end, so the word must mean to give up halfway.
闻鸡起舞/1 | 天不亮就起床练习 | He gets up before dawn every day to practise, so the word must mean to rise at cockcrow to practise.
好学/1 | 不懂的问题总要问明白 | Whenever the child meets something he does not know, he asks until he understands, so the word must mean fond of learning.
笨鸟先飞/1 | 学得慢就早到一小时练习 | The speaker learns slowly and therefore arrives an hour early to practise, so the word must mean the slow bird sets off early.
十年寒窗/1 | 苦读多年考上理想大学 | After long years of hard study he got into the university he wanted, so the word must mean years of hard study.
恩师/1 | 获奖后第一个感谢的老师 | After winning the prize, the first person he rang to thank was his teacher, so the word must mean beloved teacher.
教诲/1 | 老师说做人要诚实 | He has always kept the teacher's words: be honest, so the word must mean teaching, instruction.
诲人不倦/1 | 学生问多少遍都耐心讲 | However often pupils ask, Ms Wang explains patiently, so the word must mean tireless in teaching.
言传身教/1 | 父母用话和行动影响孩子 | Parents shape children through both what they say and what they do, so the word must mean to teach by word and example.
因材施教/1 | 对不同学生用不同办法 | Good teachers use different methods for different pupils, so the word must mean to teach according to aptitude.
教学相长/1 | 回答学生问题自己也学到 | The teacher learns a lot himself while answering pupils' questions, so the word must mean teaching benefits teacher and learner.
启蒙/1 | 爷爷是他学书法的第一位老师 | Grandpa was the first teacher of his calligraphy, so the word must mean enlightenment, first teaching.
熏陶/1 | 在音乐家庭里慢慢爱上钢琴 | Growing up in a musical family, she came to love the piano from childhood, so the word must mean influence.
栽培/1 | 感谢老师多年培养 | The speaker thanks the teacher for years of training that led to today's success, so the word must mean to cultivate.
尊师重道/1 | 中国自古的传统 | China has long had a tradition of honouring teachers, so the word must mean to respect teachers and their teaching.
考场/1 | 进去以前把手机交给老师 | Phones must be handed to the teacher before going in to sit the exam, so the word must mean examination hall.
考砸/1 | 数学只得了五十分 | He got only fifty in maths this time, so the word must mean to flunk.
落榜/1 | 去年高考没考上，今年复读 | He did not get in last year and is retaking the exam this year, so the word must mean to fail an entrance exam.
榜单/1 | 成绩公布后找自己的名字 | When results came out he found his name on it, so the word must mean list of results.
金榜题名/1 | 祝你高考顺利 | The speaker wishes someone luck in the college entrance exam, so the word must mean to pass the exam with honours.
名落孙山/1 | 准备不够没有考上 | He was not well enough prepared, and the result was that he did not get in, so the word must mean to fail an exam.
分数线/1 | 比大学的高了二十分 | His score was twenty points above what the university requires, so the word must mean cutoff score.
中考/1 | 初三学生正在准备 | Pupils in the last year of junior middle school are preparing for it, so the word must mean senior high entrance exam.
统考/1 | 全市初二学生一起参加 | All second-year pupils in the city take the same maths exam next week, so the word must mean unified exam.
复读/1 | 高考不理想再读一年 | His entrance exam results were poor and he will study the year again, so the word must mean to repeat a year.
录取通知书/1 | 收到大学的，高兴得跳起来 | He received it from the university and jumped for joy, so the word must mean admission letter.
保送/1 | 数学比赛一等奖直接上大学 | His first prize in the national maths contest got him into university without the exam, so the word must mean to recommend for admission.
填报/1 | 高考成绩出来后考生要做的 | Once results are out, candidates list the schools they want, so the word must mean to fill in.
调剂/1 | 没被第一志愿录取被安排到别的专业 | His first choice did not take him and he was placed in another subject, so the word must mean to reassign.
慎重/1 | 选专业是大事要认真考虑 | Choosing a subject is a big decision that needs careful thought, so the word must mean prudent.
升学/1 | 家长关心孩子能不能上更高的学校 | Parents care a lot about whether their children go on to the next school, so the word must mean to go on to higher school.
择校/1 | 家长打听各个学校的情况 | Some parents start asking about every school very early, so the word must mean to choose a school.
插班/1 | 从外地转来进我们班 | He transferred from elsewhere and joined the class partway through, so the word must mean to join a class midway.
跳级/1 | 从三年级直接到五年级 | He went straight from the third year to the fifth, so the word must mean to skip a grade.
留级/1 | 生病缺课多，再读一年 | He missed many classes through illness and must stay in the same year, so the word must mean to repeat a grade.
挫折/1 | 遇到了不要怕，要从失败中学习 | The speaker says not to fear it but to learn from failure, so the word must mean setback.
屡次/1 | 多次迟到被批评 | He was late again and again and the teacher criticised him, so the word must mean repeatedly.
气馁/1 | 一次没考好不要灰心 | One bad exam is no reason to lose heart, and 不要 tells you not to, so the word must mean discouraged.
沮丧/1 | 比赛输了队员们 | The players have just lost the match, so the word must mean dejected.
丧失/1 | 失败让他失去了信心 | The failure took away his confidence, so the word must mean to lose.
被迫/1 | 雨太大比赛停止 | The rain was too heavy for the match to go on, so the word must mean to be forced.
逼迫/1 | 父母不应该强迫孩子学 | Parents should not push children to learn things they dislike, so the word must mean to force.
迫切/1 | 山区孩子很需要好老师 | Mountain children need more good teachers very badly, so the word must mean urgent.
辍学/1 | 农村孩子因为家穷不上学了 | In the past some village children left school because their families were poor, so the word must mean to drop out.
屡见不鲜/1 | 中学生戴眼镜很常见 | Middle-school pupils wearing glasses for short sight is now seen everywhere, so the word must mean commonplace.
溺爱/1 | 父母过分爱孩子 | Parents who indulge their children too much may raise children who can do nothing, so the word must mean to spoil.
娇惯/1 | 从小被爷爷奶奶宠，吃不了苦 | His grandparents spoilt him from childhood and he cannot bear any hardship, so the word must mean to pamper.
纵容/1 | 孩子犯错大人不能不管 | When a child does wrong, adults must not let it pass but explain patiently, so the word must mean to connive at.
放纵/1 | 放假也不能每天玩到半夜 | Even on holiday you should not play until midnight every day, so the word must mean to indulge.
叮嘱/1 | 妈妈说路上注意安全 | Before he goes out, Mum tells him to be careful on the way, so the word must mean to urge again and again.
娇气/1 | 走一点路就喊累 | The child cries that he is tired after walking just a little, so the word must mean delicate, fragile.
望子成龙/1 | 家长给孩子报很多补习班 | Many parents sign their children up for lots of extra classes, so the word must mean to hope one's child succeeds.
拔苗助长/1 | 三岁孩子每天学五个小时 | Making a three-year-old study five hours a day does harm by hurrying growth, so the word must mean to spoil things through haste.
栋梁/1 | 希望学生成为国家的 | The teacher hopes the pupils will hold up the nation one day, so the word must mean pillar.
逆反心理/1 | 父母越逼他越不想学 | The more his parents push him to study, the less he wants to, so the word must mean rebelliousness.
学海无涯/1 | 活到老，学到老 | The second half says we should keep learning until we are old, so the word must mean learning is boundless.
生涯/1 | 教学长达四十年 | He taught for forty years, so the word must mean career.
求知/1 | 孩子们什么都想知道 | The children want to know about everything, so the word must mean to seek knowledge.
求学/1 | 离开家乡到北京读书 | At eighteen he left home to study in Beijing, so the word must mean to pursue studies.
治学/1 | 老教授每个数据都检查 | The old professor checks every figure several times in his research, so the word must mean to do scholarship.
研讨会/1 | 专家参加的国际会议 | Over a hundred experts attended this international meeting on the environment, so the word must mean seminar.
毕业论文/1 | 大四下学期一直在写 | All through the last term of his final year he has been writing it, so the word must mean graduation thesis.
答辩/1 | 论文写完以后还要通过 | After finishing the thesis, students must still pass this before graduating, so the word must mean oral defence.
开题/1 | 写论文之前先做的报告 | Graduate students give this report before they begin writing the thesis, so the word must mean thesis proposal.
课题/1 | 研究由三位教授负责 | Three professors share responsibility for this piece of research, so the word must mean research topic.
笔试/1 | 先通过它才能面试 | Candidates must pass it before they may sit the interview, so the word must mean written examination.
求职信/1 | 介绍自己的经历和特长 | In it he describes his experience and strengths to an employer, so the word must mean cover letter.
推荐信/1 | 教授写的说他优秀 | The professor wrote saying he is an outstanding student, so the word must mean recommendation letter.
招聘会/1 | 来了两百多家公司 | Over two hundred companies came and job seekers queued, so the word must mean job fair.
人才市场/1 | 每个周末去看有没有工作 | Every weekend he goes there to see if there is a suitable job, so the word must mean talent market.
猎头/1 | 打电话问他愿不愿意换工作 | A firm rang him to ask whether he would change jobs, so the word must mean headhunter.
竞聘/1 | 五个人争部门经理的职位 | Five people are vying for the post of department manager, so the word must mean to compete for a post.
双向选择/1 | 公司挑人，人也挑公司 | Companies pick candidates and candidates pick companies, so the word must mean mutual selection.
试用期/1 | 新员工三个月表现好才录用 | New staff are hired permanently only if they do well in their first three months, so the word must mean probation period.
转正/1 | 工作认真，提前成了正式员工 | His hard work got him a permanent post a month early, so the word must mean to become a full employee.
劳动合同/1 | 上班前公司和员工签 | The company and the employee sign it before work begins, so the word must mean employment contract.
续约/1 | 合同到期公司希望再签 | The contract ends next month and the company wants to keep him, so the word must mean to renew a contract.
解约/1 | 公司不按时发工资，提前结束合同 | The company never pays on time and he will end the contract early, so the word must mean to terminate a contract.
薪酬/1 | 公司的很高吸引年轻人 | The company pays well enough to attract many young people, so the word must mean remuneration.
底薪/1 | 销售员靠提成，这个不高 | Salespeople earn mainly through commission and this part is low, so the word must mean basic salary.
津贴/1 | 高温天气工作的工人每月有 | Workers who work in the heat get an extra sum each month, so the word must mean allowance.
加班费/1 | 每天工作到十点，工资多了 | He worked until ten every night this month and his pay grew, so the word must mean overtime pay.
年终奖/1 | 公司效益好每人拿到 | The company did well this year and every employee got an extra sum, so the word must mean year-end bonus.
工资条/1 | 看了发现多了三百块 | Looking at it, he saw he had been paid three hundred more this month, so the word must mean payslip.
报酬/1 | 帮邻居修电脑没要 | He fixed the neighbour's computer and asked for nothing in return, so the word must mean reward, pay.
打卡/1 | 到公司先在门口 | On arriving at the office, staff must first record their time at the door, so the word must mean to clock in.
考勤/1 | 制度严格，迟到三次扣钱 | Being late three times costs money under the strict rules, so the word must mean attendance check.
旷工/1 | 没请假三天不来上班 | He stayed away three days without asking for leave, so the word must mean absenteeism.
早退/1 | 没到下班时间就走了 | He went home in the afternoon before work was over, so the word must mean to leave early.
调休/1 | 周末加了班这周休一天 | He worked last weekend and can have a day off this week, so the word must mean to take a day off in lieu.
年假/1 | 用了五天带家人去海边 | He took five days off to go to the seaside with his family, so the word must mean annual leave.
病假/1 | 发烧了请了两天 | He has a fever and has asked for two days off, so the word must mean sick leave.
产假/1 | 生完孩子休了三个多月 | After having her baby she was off work for over three months, so the word must mean maternity leave.
事假/1 | 家里有急事请了一天 | Something urgent at home made him ask for a day off, so the word must mean personal leave.
全勤奖/1 | 一天假也没请拿到的 | He did not take a single day off this month, so the word must mean perfect attendance bonus.
总监/1 | 公司的市场负责人管二十多人 | She heads marketing for the company and leads a team of over twenty, so the word must mean director.
总裁/1 | 从普通员工做到公司最高 | He started as an ordinary employee and twenty years later headed the company, so the word must mean president.
合伙人/1 | 和同学一起开公司 | He and a university classmate started a company together, so the word must mean partner.
创始人/1 | 当年在家里开始创业 | The company began years ago in this person's home, so the word must mean founder.
高层/1 | 重大决定是他们开会做出的 | The big decision was taken at a meeting that ordinary staff knew nothing about, so the word must mean senior management.
中层/1 | 上面有领导，下面有员工 | He has bosses above him and a dozen staff below him, so the word must mean middle management.
前台/1 | 客人到了先在这里登记 | Visitors sign in here first when they arrive, so the word must mean reception.
文员/1 | 每天整理文件、打印资料 | She files documents and prints material all day, so the word must mean clerk.
后勤/1 | 负责员工的食堂和宿舍 | This department runs the staff canteen and dormitories, so the word must mean logistics.
客服/1 | 东西坏了打电话要求换货 | What he bought broke and he phoned to ask for an exchange, so the word must mean customer service.
赴任/1 | 被派到南方分公司下个月去 | He has been posted as manager of the southern branch and goes next month, so the word must mean to go to one's post.
走马上任/1 | 新校长昨天第一天上班 | The new principal started yesterday and sat in on several lessons on day one, so the word must mean to take office.
卸任/1 | 明年从总经理的位置上下来 | He will leave the post of general manager next year, so the word must mean to leave office.
撤职/1 | 因为严重失职 | He was removed for serious neglect of duty, so the word must mean to dismiss from a post.
接替/1 | 老王退休由小李做他的工作 | When Lao Wang retires, Xiao Li will do his job, so the word must mean to take over.
留任/1 | 董事会让他再干三年 | His work is excellent and the board keeps him for three more years, so the word must mean to remain in office.
前任/1 | 新经理改变了上一任的做法 | The new manager changed many of the ways of the man before him, so the word must mean predecessor.
现任/1 | 学校的校长干了五年 | He has been the school's principal for five years, so the word must mean current.
兼任/1 | 数学老师同时当班主任 | He teaches maths and is also form teacher, so the word must mean to hold concurrently.
出任/1 | 学者被请来当所长 | The famous scholar was invited to become head of the institute, so the word must mean to take up a post.
顶替/1 | 小王生病由我替他值班 | Xiao Wang is ill and the speaker does his duty today, so the word must mean to replace, stand in.
替补/1 | 主力受伤时才上场 | He plays only when a regular player is hurt, so the word must mean substitute.
替换/1 | 旧电脑太慢该换新的 | The old computer is too slow and should give way to a new one, so the word must mean to replace.
搭档/1 | 多年的工作伙伴配合好 | The two have worked side by side for years and get on well, so the word must mean partner.
搭配/1 | 新老员工在一起工作 | New and old staff working side by side learn faster, so the word must mean to pair up.
临时工/1 | 过年太忙招了几个 | The shop is too busy at New Year and has hired a few short-term workers, so the word must mean temporary worker.
协作/1 | 几个部门一起完成项目 | Several departments must work together to finish the project, so the word must mean to cooperate.
传帮带/1 | 老员工帮新员工适应工作 | The company wants veteran staff to help new staff settle in, so the word must mean to mentor.
工位/1 | 他的在窗户边上 | His seat at work is by the window, so the word must mean workstation.
茶水间/1 | 同事们休息时在这里聊天 | Colleagues often chat there during breaks, so the word must mean pantry.
敬业/1 | 医生为了病人放弃休息 | The doctors often give up their rest for patients, so the word must mean dedicated to one's work.
踏实/1 | 交给他的工作总能按时完成 | The young man always finishes what he is given on time, so the word must mean steady.
兢兢业业/1 | 在岗位上工作了三十年 | He has worked in this post for thirty years, so the word must mean conscientious.
任劳任怨/1 | 干最累的活从不抱怨 | He does the hardest work every day and never complains, so the word must mean to work hard without complaint.
精益求精/1 | 已经很好了还要改了又改 | His work is already good, yet he keeps reworking it, so the word must mean to strive for perfection.
一丝不苟/1 | 做账每个数字核对好几遍 | She checks every figure in the accounts several times, so the word must mean meticulous.
脚踏实地/1 | 不能总想一步登天 | One should not always dream of getting to the top in one leap, so the word must mean down-to-earth.
诚恳/1 | 向客户真心道歉 | He apologised to the client from the heart, so the word must mean sincere.
职业道德/1 | 医生把病人隐私告诉别人违反了 | A doctor telling others about patients' private affairs breaks it, so the word must mean professional ethics.
骨干/1 | 工作十年成了部门的 | After ten years he has become someone the department relies on, so the word must mean backbone.
懈怠/1 | 有一点成绩就放松下来 | Easing off after a small success is dangerous, so the word must mean to slack.
敷衍/1 | 随便说两句就走 | He said a couple of words and walked off without really answering, so the word must mean perfunctory.
怠工/1 | 工人们对新规定不满 | The workers dislike the new rules and have started working slowly on purpose, so the word must mean to go slow.
怠慢/1 | 客人来了要热情招待 | Guests should be received warmly, and 不要 warns against the opposite, so the word must mean to slight.
摸鱼/1 | 上班偷偷看视频 | He often watches videos secretly at work, so the word must mean to slack off at work.
拖延/1 | 工作到最后一天才做 | He always leaves work until the last day, so the word must mean to procrastinate.
拖拉/1 | 一天的工作要三天 | A job that should take a day takes him three, so the word must mean dilatory.
马虎/1 | 报告里有很多错字 | His report is full of wrong characters, so the word must mean careless.
苟且/1 | 过一天算一天 | One should not just get through each day as it comes, so the word must mean to drift along.
内耗/1 | 部门之间互相不配合 | The departments will not cooperate and waste each other's efforts, so the word must mean internal friction.
忙碌/1 | 结束了一天的工作 | After a full day of work he can finally rest, so the word must mean busy.
疲惫/1 | 连续加班一周 | He has worked overtime for a whole week, so the word must mean exhausted.
倦怠/1 | 同一岗位干了十年 | Ten years in the same post have worn down his interest, so the word must mean weariness.
加班加点/1 | 大家干了一个月完成任务 | Everyone worked long extra hours for a month to finish on time, so the word must mean to work extra hours.
焦头烂额/1 | 几件急事一起来 | Several urgent things have come at once, so the word must mean in a terrible fix.
手忙脚乱/1 | 第一天上班什么都不熟悉 | On his first day he knows nothing and rushes about in confusion, so the word must mean in a flurry.
忙里偷闲/1 | 工作再忙周末也去爬山 | However busy he is, he goes climbing at the weekend, so the word must mean to snatch a moment of leisure.
工作狂/1 | 过年都在办公室加班 | He works in the office even at New Year, so the word must mean workaholic.
催促/1 | 老板让他快点交报告 | The boss keeps telling him to hand in the report quickly, so the word must mean to urge.
盯/1 | 看着电脑屏幕一整天 | He looked fixedly at the computer screen all day and his eyes are tired, so the word must mean to stare at.
同僚/1 | 和几位同事一起向领导提建议 | He and several people he works with made a proposal to their boss, so the word must mean colleague.
官僚主义/1 | 小事也要层层审批 | Some departments make even small matters pass through layer after layer of approval, so the word must mean bureaucracy.
管辖/1 | 区管理着十几个街道 | The district has a dozen subdistricts under it, so the word must mean to have jurisdiction over.
头衔/1 | 名片上印着好几个 | His business card is printed with several of them, so the word must mean title.
资深/1 | 干这一行二十年的记者 | She has been a journalist for twenty years, so the word must mean senior, veteran.
新手/1 | 刚开车不久 | He has only just started driving, so the word must mean novice.
老手/1 | 修电脑什么问题都难不倒他 | No computer problem defeats him, so the word must mean old hand.
师傅/1 | 跟着学了三年木工 | He learned carpentry for three years under an experienced craftsman, so the word must mean master.
徒弟/1 | 老木匠教他们做家具 | The old carpenter took on two young people to teach furniture making, so the word must mean apprentice.
平庸/1 | 不愿意普普通通地过一辈子 | He does not want an ordinary life and keeps learning new skills, so the word must mean mediocre.
规章制度/1 | 新员工先学公司的 | New employees first study the company's rules, so the word must mean rules and regulations.
守则/1 | 墙上贴着员工的 | The poster on the wall lists rules for staff, the first being to arrive on time, so the word must mean code of conduct.
处分/1 | 多次旷工受到公司的 | He was often absent without leave and the company punished him, so the word must mean disciplinary action.
奖惩/1 | 做得好有奖，做得不好要罚 | Good work is rewarded and poor work is penalised, so the word must mean rewards and punishments.
表彰/1 | 年底公司表扬十名优秀员工 | At year's end the company praised ten outstanding employees, so the word must mean to commend.
嘉奖/1 | 及时发现火灾受到上级 | He spotted the fire in time and his superiors rewarded him, so the word must mean commendation.
激励/1 | 奖金让大家更努力 | The bonus makes everyone work harder, so the word must mean to motivate.
扣钱/1 | 迟到一次五十块 | The rules take fifty yuan from pay for each late arrival, so the word must mean to dock pay.
渎职/1 | 官员造成严重损失被撤职 | The official caused serious losses by failing in his duties and was dismissed, so the word must mean dereliction of duty.
失职/1 | 保安睡着让小偷进来 | The guard fell asleep and let a thief into the building, so the word must mean neglect of duty.
窍门/1 | 用冷水洗不容易变形 | Washing these clothes in cold water keeps their shape, so the word must mean knack.
一窍不通/1 | 对电脑连开机都要问别人 | The speaker must ask others even to switch the computer on, so the word must mean to know nothing about.
门道/1 | 外行看热闹，内行看 | The saying contrasts outsiders who watch the show with insiders who see how it is done, so the word must mean know-how.
内行/1 | 说到修汽车他是 | When it comes to car repairs he knows the trade, so the word must mean expert.
外行/1 | 看不懂设计图 | The speaker cannot read these design drawings, so the word must mean layman.
匠心/1 | 作品体现了工匠的 | Every part of the work shows the craftsman's inventive care, so the word must mean ingenuity.
学徒/1 | 十六岁到饭馆学做菜 | At sixteen he went to work in a restaurant to learn cooking, so the word must mean apprentice.
摸索/1 | 没人教自己找出好方法 | No one taught him, and he worked out a good method by trial, so the word must mean to grope for.
得心应手/1 | 做了三年这份工作 | After three years he does the job with ease, so the word must mean with facility.
本行/1 | 当了几年老师又回去做医生 | After some years as a teacher he went back to being a doctor, so the word must mean one's own profession.
转行/1 | 当了五年记者后做教师 | He was a reporter for five years and then became a teacher, so the word must mean to change profession.
副业/1 | 晚上开网店 | He works by day and runs an online shop at night, so the word must mean sideline.
待业/1 | 毕业后在家半年才找到工作 | After graduating he stayed at home for half a year before finding work, so the word must mean to be unemployed.
在职/1 | 一边工作一边读研究生 | He studies for a master's while keeping his job, so the word must mean on the job.
停职/1 | 调查结束以前不能上班 | He may not work until the investigation ends, so the word must mean to be suspended.
复职/1 | 调查证明他没问题回去上班 | The investigation cleared him and he can go back to work next month, so the word must mean to be reinstated.
入职/1 | 上个月刚到公司 | He started at the company only last month, so the word must mean to join a company.
自由职业者/1 | 在家给杂志画画 | He works from home drawing for several magazines, so the word must mean freelancer.
远程办公/1 | 有了网络会议在家 | With online meetings many people can work from home, so the word must mean remote work.
铁饭碗/1 | 在国企工作 | People used to think a job at a state firm was secure for life, so the word must mean iron rice bowl.
工会/1 | 员工通过它要求提高工资 | The staff asked the company for higher pay through this body, so the word must mean trade union.
罢工/1 | 工资太低工人停止工作 | The workers stop work for three days because pay is too low, so the word must mean to strike.
劳资/1 | 双方谈判签新合同 | The two sides, workers and employers, negotiated a new contract, so the word must mean labour and capital.
纠纷/1 | 两家公司因为合同 | The two companies have fallen out over a contract, so the word must mean dispute.
仲裁/1 | 谈不出结果只好申请 | Long talks brought no result and the two sides asked a third party to decide, so the word must mean arbitration.
维权/1 | 工人依法保护自己 | The workers use the law to protect what is theirs, so the word must mean to defend one's rights.
欠薪/1 | 三个月没发的工资 | The company has paid no wages for three months and staff want them back, so the word must mean wage arrears.
拖欠/1 | 公司三个月没给工资 | The company has not paid its workers for three months, so the word must mean to be in arrears.
劳务/1 | 通过公司到国外做建筑工人 | He went abroad as a building worker through a company that sends workers, so the word must mean labour services.
劳动法/1 | 公司不能随便让员工加班 | Under this law a company may not make staff work overtime at will, so the word must mean labour law.
筹备/1 | 公司正在准备下个月的年会 | The company is getting next month's annual meeting ready, so the word must mean to prepare.
筹集/1 | 向亲戚朋友弄到一笔钱 | He gathered money from relatives and friends to start a company, so the word must mean to raise funds.
筹款/1 | 义卖为生病的同学 | The school holds a charity sale for a sick classmate, so the word must mean to raise funds.
统筹/1 | 活动由市场部安排 | The marketing department arranges the whole event, so the word must mean to coordinate.
出谋划策/1 | 大家为推广想办法 | Everyone came up with ideas for promoting the new product, so the word must mean to offer advice.
一筹莫展/1 | 面对困难没有办法 | Faced with such great difficulty he can find no way forward, so the word must mean to be at one's wits' end.
策划/1 | 晚会由她一手安排 | She planned the whole evening party herself, so the word must mean to plan.
例会/1 | 每周一上午部门要开 | The department meets every Monday morning, so the word must mean regular meeting.
纪要/1 | 开完会秘书发给每个人 | After the meeting the secretary sent everyone a record of it, so the word must mean minutes.
审批/1 | 预算还要等领导 | The project's budget is still waiting for the leader's approval, so the word must mean to examine and approve.
谋生/1 | 靠修自行车生活 | When young he earned his living repairing bicycles, so the word must mean to make a living.
谋求/1 | 到大城市找更好的发展 | He left home to look for better prospects in a big city, so the word must mean to seek.
打工人/1 | 年轻上班的人对自己的玩笑叫法 | Young office workers call themselves this as a joke, so the word must mean worker, wage slave.
白领/1 | 每天坐在办公室里 | He sits in an office all day, so the word must mean white-collar worker.
蓝领/1 | 工厂里的技术工人 | Skilled factory workers are usually called this, so the word must mean blue-collar worker.
职业病/1 | 老师长期讲课嗓子不好 | A sore throat is common among teachers who lecture loudly for years, so the word must mean occupational disease.
职场/1 | 刚走进的年轻人要学会沟通 | Young people new to working life must learn to talk with colleagues, so the word must mean workplace.
事业单位/1 | 学校和医院大多是 | Schools and hospitals are mostly this kind of body, so the word must mean public institution.
央企/1 | 公司由中央政府直接管理 | His company is run directly by the central government, so the word must mean central state-owned enterprise.
跨国公司/1 | 在三十多个国家有分公司 | The company has branches in more than thirty countries, so the word must mean multinational.
器官/1 | 眼睛和鼻子感觉外界 | Eyes and noses are parts of the body that sense the outside world, so the word must mean organ.
肾脏/1 | 人有两个，在腰的后面 | People have two of them, behind the waist, so the word must mean kidney.
肝脏/1 | 能分解进入身体的有害物质 | It breaks down many harmful substances that enter the body, so the word must mean liver.
肺部/1 | 吸烟会伤害，容易咳嗽 | Smoking harms it and brings on coughing, so the word must mean lungs.
内脏/1 | 心、肝、肺、胃、肠 | The heart, liver, lungs, stomach and intestines all lie inside the body, so the word must mean internal organs.
肠道/1 | 有好几米长，分小肠大肠 | It is several metres long and has a small and a large part, so the word must mean intestines.
大肠/1 | 食物经过小肠以后进入 | Food passes through the small intestine before entering it, so the word must mean large intestine.
小肠/1 | 营养主要在里面被吸收 | Most of the nourishment in food is absorbed there, so the word must mean small intestine.
声带/1 | 大声喊了一天，几天说不出话 | Shouting all day left him unable to speak for days, so the word must mean vocal cords.
颈部/1 | 长时间低头看手机会累 | Looking down at a phone for a long time tires it, so the word must mean neck.
脊椎/1 | 从头下面到腰下面三十多节 | It runs from below the head to below the waist in over thirty pieces, so the word must mean spine.
颈椎/1 | 整天低头看手机容易得病 | Looking down at a phone all day brings trouble in this part of the neck, so the word must mean cervical spine.
腰椎/1 | 弯腰搬重东西容易伤到 | Bending over to lift heavy things can injure this part of the back, so the word must mean lumbar spine.
手腕/1 | 打字太多有点儿疼 | She has typed a lot and it hurts where her hand meets her arm, so the word must mean wrist.
四肢/1 | 两只手臂和两条腿 | The sentence lists two arms and two legs, so the word must mean limbs.
肢体/1 | 演员不说话只用动作 | The actor does not speak and shows feelings only by moving, so the word must mean body.
筋骨/1 | 爷爷打太极拳活动 | Grandpa does tai chi every morning to loosen up his body, so the word must mean muscles and bones.
抽筋/1 | 游泳时腿突然不能动 | His leg suddenly seized up while swimming and he got out, so the word must mean cramp.
假肢/1 | 失去一条腿装上以后能走路 | He lost a leg and can walk again with an artificial one, so the word must mean prosthesis.
伤筋动骨/1 | 骨头伤了要一百天 | The saying says it takes a hundred days, since broken bones need long rest, so the word must mean to injure bones and muscles.
咳嗽/1 | 感冒了晚上睡不好 | He has a cold and keeps doing this at night and cannot sleep, so the word must mean to cough.
干咳/1 | 咳不出痰来 | He keeps coughing but brings nothing up, so the word must mean dry cough.
喉咙/1 | 医生用小灯照了照 | The doctor shone a small light into it and found some inflammation, so the word must mean throat.
咽/1 | 药片太大吞不下去 | The pill is too big for him to get down, so the word must mean to swallow.
痰/1 | 不要随地吐 | Spitting it anywhere is unhygienic, so the word must mean phlegm.
化痰/1 | 药喝了嗓子里舒服多了 | After the medicine his throat feels much clearer, so the word must mean to resolve phlegm.
止咳/1 | 咳得厉害的时候喝一点 | You take a little when coughing is bad, so the word must mean to relieve a cough.
喘气/1 | 一口气跑上十楼累得 | He ran up ten floors without stopping and is breathing hard, so the word must mean to pant.
呼吸道/1 | 冬天这类疾病比较多 | Winter brings many illnesses of breathing and people wear masks outdoors, so the word must mean respiratory tract.
气喘/1 | 不能做太激烈的运动的毛病 | He cannot do hard exercise because of this condition, so the word must mean asthma.
痒/1 | 被虫子叮了皮肤又红又 | The insect bite left his skin red and wanting to be scratched, so the word must mean itchy.
发痒/1 | 对羊毛过敏全身 | He is allergic to wool and the sweater makes his whole body want scratching, so the word must mean to itch.
湿疹/1 | 天气潮湿时又犯了 | Her skin condition comes back whenever the weather is damp, so the word must mean eczema.
水痘/1 | 小时候身上起了很多小红点 | As a child he was covered in small red spots, so the word must mean chickenpox.
麻疹/1 | 打疫苗可以预防 | Vaccination prevents this illness, so the word must mean measles.
青春痘/1 | 十几岁时脸上长了很多 | His face was covered in spots in his teens, so the word must mean acne.
疤痕/1 | 手术以后肚子上留下 | The operation left a mark on his stomach, so the word must mean scar.
伤疤/1 | 好了就忘了疼 | The saying is about forgetting the pain once the wound has healed, so the word must mean scar.
脱皮/1 | 晒了一天第二天背上 | He spent a whole day in the sun and his back began to come off in flakes, so the word must mean to peel.
皮肤科/1 | 脸上起了红点去医院看 | His face broke out in red spots and his mother took him to this department, so the word must mean dermatology.
呕吐/1 | 坐船晕得厉害 | He was badly seasick on the boat and threw up several times, so the word must mean to vomit.
干呕/1 | 一闻味道就想吐但吐不出 | The smell made him heave, but nothing came up, so the word must mean to retch.
腹泻/1 | 人们常说的拉肚子 | The sentence says it is what people call an upset stomach, so the word must mean diarrhoea.
肠胃/1 | 不好，不能吃太辣 | He cannot eat very spicy food because his digestion is weak, so the word must mean stomach and intestines.
肠炎/1 | 又拉肚子又肚子疼 | He has both diarrhoea and stomach pain, so the word must mean enteritis.
泻药/1 | 吃多了会拉肚子 | Taking too much of it gives you diarrhoea, so the word must mean laxative.
便秘/1 | 多吃蔬菜多喝水可以预防 | Eating vegetables and drinking water help prevent it, so the word must mean constipation.
胀气/1 | 吃了太多豆子肚子不舒服 | Too many beans have left his belly uncomfortable, so the word must mean flatulence.
消化不良/1 | 晚饭吃得太多太晚 | Eating too much too late at night causes this, so the word must mean indigestion.
食物中毒/1 | 夏天饭菜容易坏 | Food goes off easily in summer, so the word must mean food poisoning.
眩晕/1 | 突然一阵，赶紧扶住墙 | He suddenly felt his head spin and grabbed the wall, so the word must mean dizziness.
头晕目眩/1 | 饿了一天站起来时 | He has not eaten all day and everything spins when he stands up, so the word must mean dizzy.
晕倒/1 | 天太热有个老人在路上 | In the great heat an old man collapsed in the street, so the word must mean to faint.
发抖/1 | 穿得太少冻得直 | He is dressed too lightly and is shaking with cold, so the word must mean to shiver.
颤抖/1 | 太紧张说话的声音 | She is very nervous and her voice shakes, so the word must mean to tremble.
打颤/1 | 冷得牙齿直 | The wind is strong and his teeth are chattering with cold, so the word must mean to shiver, chatter.
抖/1 | 进门前把身上的雪弄掉 | Before going in, he shook the snow off himself, so the word must mean to shake.
抖动/1 | 洗衣机转起来整台机器 | When the washing machine spins, the whole machine shakes, so the word must mean to vibrate.
发麻/1 | 盘着腿坐太久 | He sat cross-legged too long and his legs lost feeling, so the word must mean to go numb.
麻木/1 | 看多了新闻一点儿也不关心 | After a great deal of such news some people care not at all, so the word must mean numb.
麻醉/1 | 做手术前医生打的 | Before the operation the doctor gave him an injection to stop him feeling anything, so the word must mean anaesthesia.
麻醉师/1 | 手术中一直观察病人 | During the operation this doctor watches the patient the whole time, so the word must mean anaesthetist.
局部/1 | 小手术只需要这样麻醉 | A small operation needs numbing in only one part of the body, so the word must mean local.
剖腹产/1 | 孩子太大医生建议 | The baby is too big and the doctor advises delivering it by operation, so the word must mean caesarean section.
缝合/1 | 手术后把伤口缝好 | After the operation the doctor stitched the wound closed, so the word must mean to suture.
缝针/1 | 伤口很深要去医院 | The wound is deep and needs stitching at hospital, so the word must mean to get stitches.
解剖/1 | 医学生了解人体结构的课 | Medical students take this course to learn the body's structure, so the word must mean anatomy.
切除/1 | 医生拿掉了发炎的盲肠 | The doctor took out his inflamed appendix, so the word must mean to remove surgically.
手术刀/1 | 外科医生拿起来开始做手术 | The surgeon picks it up to begin operating, so the word must mean scalpel.
术后/1 | 要好好休息按时吃药 | After the operation you must rest well and take medicine on time, so the word must mean post-operative.
纱布/1 | 护士把伤口包起来 | The nurse wrapped his wound in it, so the word must mean gauze.
敷/1 | 在伤处放了一些药 | The doctor put some medicine on the injured spot, so the word must mean to apply.
外敷/1 | 这种药只能用在外面 | This medicine may only go on the skin, never be swallowed, so the word must mean to apply externally.
冷敷/1 | 脚扭伤后马上减少肿胀 | After twisting an ankle, apply something cold to reduce swelling, so the word must mean cold compress.
热敷/1 | 腰酸背疼用热水袋 | A hot-water bottle helps an aching back, so the word must mean hot compress.
药膏/1 | 被虫子叮了擦一点儿 | An insect bit his hand and Mum rubbed something on it, so the word must mean ointment.
愈合/1 | 伤口还没有完全好 | The wound is not fully closed and needs care when washing, so the word must mean to heal.
伤痕/1 | 手臂上有一道很长的 | There is a long mark on his arm, so the word must mean scar, wound mark.
止血/1 | 伤口流了很多血要先 | The wound is bleeding heavily and that must be dealt with first, so the word must mean to stop bleeding.
红肿/1 | 伤口可能发炎了 | His wound may be inflamed, so the word must mean red and swollen.
副作用/1 | 药让人想睡觉，不要开车 | The medicine makes people sleepy and they should not drive after taking it, so the word must mean side effect.
服药/1 | 按医生说的时间 | Please take it at the times the doctor says, so the word must mean to take medicine.
用药/1 | 孩子不能随便吃大人的药 | Children must not take adults' medicine at will, so the word must mean to use medicine.
疗效/1 | 新药吃了一个星期就好多了 | Patients on the new medicine were much better within a week, so the word must mean curative effect.
口服/1 | 一天三次，每次两片 | It is taken three times a day, two tablets each time, so the word must mean oral.
外用/1 | 药水千万不能喝 | You must never drink this liquid, so the word must mean for external use.
疗程/1 | 药要吃满，不能停 | The medicine must be taken for the whole period, not stopped when you feel better, so the word must mean course of treatment.
药丸/1 | 很小容易咽下去 | It is small and easy to swallow, so the word must mean pill.
退烧药/1 | 发烧到三十九度医生开的 | He has a temperature of thirty-nine and the doctor prescribed this, so the word must mean fever reducer.
止痛药/1 | 牙疼得厉害吃了一片 | His tooth hurt badly and he took a tablet, so the word must mean painkiller.
脂肪/1 | 这种肉很多，不要多吃 | This meat has a lot of it and should not be eaten in large amounts, so the word must mean fat.
减脂/1 | 每天跑步想要 | He runs every day to slim down, so the word must mean to reduce body fat.
油脂/1 | 炸的食物含有很多 | Fried food contains a lot of it, so the word must mean grease.
高血脂/1 | 医生让他少吃肥肉 | The doctor told Dad to eat less fatty meat after his check-up, so the word must mean hyperlipidaemia.
体脂/1 | 机器能称体重还能测 | The machine measures more than just weight, so the word must mean body fat.
低脂/1 | 减肥时只喝的牛奶 | She drinks only this kind of milk while slimming, so the word must mean low-fat.
脂肪肝/1 | 吃得太油又不运动 | Eating greasy food without exercise causes a disease of the liver, so the word must mean fatty liver.
暴饮暴食/1 | 过节时要注意不要 | During festivals you should be careful not to overeat, so the word must mean to binge.
皮下/1 | 打针有的打在肌肉里，有的打在 | Some injections go into muscle and some go just under the skin, so the word must mean subcutaneous.
营养不良/1 | 孩子太挑食 | The child is such a fussy eater that he is not well fed, so the word must mean malnutrition.
肿瘤/1 | 肺部有一个小的，不严重 | A check found a small growth in his lung, luckily not serious, so the word must mean tumour.
良性/1 | 肿瘤长得慢，不会扩散 | Such tumours grow slowly and do not spread, so the word must mean benign.
恶性/1 | 肿瘤就是癌症 | The sentence says such tumours are what people call cancer, so the word must mean malignant.
脑瘤/1 | 总是头疼，检查后发现 | He always has headaches, and a scan found a growth, so the word must mean brain tumour.
化疗/1 | 用药物杀死癌细胞 | It kills cancer cells with drugs and may make hair fall out, so the word must mean chemotherapy.
放疗/1 | 用射线照射杀死癌细胞 | It kills cancer cells with rays, so the word must mean radiotherapy.
早期/1 | 很多癌症在这时发现可以治好 | Many cancers can be cured if found at this point, so the word must mean early stage.
晚期/1 | 发现得太晚 | It was found too late, so the word must mean late stage.
病变/1 | 糖尿病会引起眼睛的 | Long-term diabetes damages the eyes, so the word must mean pathological change.
扩散/1 | 发现得早，癌细胞还没有 | Luckily it was found early and the cancer cells have not moved on, so the word must mean to spread.
抑郁/1 | 失业以后不愿出门 | Since losing his job he will not leave the house, so the word must mean depressed.
抑郁症/1 | 是一种病，要看医生 | It is an illness that needs a doctor and is not cured by cheering up, so the word must mean depression.
忧郁/1 | 眼睛里总带着一点儿 | There is always a touch of sadness in her eyes, so the word must mean melancholy.
压抑/1 | 把不满放在心里不说 | He keeps his discontent inside and never says it, so the word must mean to suppress.
抑制/1 | 药可以让细菌不生长 | This medicine stops germs growing, so the word must mean to inhibit.
心理咨询/1 | 学生有烦恼可以去聊 | Pupils with worries can go to a room at school to talk, so the word must mean psychological counselling.
情绪低落/1 | 没考好话也不多 | He did badly in the exam and has hardly spoken for days, so the word must mean in low spirits.
心结/1 | 好好谈了一次终于解开 | One good talk at last undid what had been troubling them, so the word must mean emotional knot.
疏导/1 | 老师耐心地帮他平静 | The teacher patiently helped him calm down, so the word must mean to guide, ease.
心理问题/1 | 长期压力太大可能会产生 | Long-term stress may cause trouble of the mind, so the word must mean psychological problem.
聋人/1 | 用手语跟别人交流 | Many of them talk with others in sign language, so the word must mean deaf person.
耳聋/1 | 年纪大了，说话要大声点 | Grandpa is old and you must speak up, so the word must mean deaf.
聋哑/1 | 学校专门教的儿童 | The school teaches children who cannot hear or speak, so the word must mean deaf and mute.
障碍/1 | 语言不通是最大的 | Not speaking the language is the biggest thing in his way abroad, so the word must mean obstacle.
残障/1 | 公司愿意招聘这样的人士 | The company is willing to hire people with disabilities, so the word must mean disability.
视障/1 | 盲道是为他们修的 | Tactile paving is built for people who cannot see well, so the word must mean visually impaired.
无障碍/1 | 坐轮椅的人也能方便进出 | Wheelchair users can get in and out easily, so the word must mean barrier-free.
盲道/1 | 不要把自行车停在上面 | Parked bikes there block the way of blind people, so the word must mean tactile paving.
轮椅/1 | 腿受伤只能坐 | He hurt his leg and can only move around sitting in one, so the word must mean wheelchair.
助残/1 | 五月第三个星期日的全国日 | The national day on the third Sunday of May is for helping people with disabilities, so the word must mean helping the disabled.
老化/1 | 随着年龄增长皮肤会 | Skin changes slowly as people grow older, so the word must mean to age.
衰弱/1 | 大病一场以后身体 | After a serious illness his body is weak, so the word must mean weak.
耳背/1 | 外公常常听不清电视 | Grandpa often cannot make out what the television says, so the word must mean hard of hearing.
老花眼/1 | 奶奶看报纸要戴眼镜 | Grandma needs glasses to read the paper, so the word must mean presbyopia.
白内障/1 | 老人得了可以做手术 | Old people with it can have an operation, so the word must mean cataract.
骨质疏松/1 | 摔一下就可能骨折 | Old people can break a bone just by falling, so the word must mean osteoporosis.
抗衰老/1 | 护肤品说能，效果不明显 | The skin cream claims to keep you young, but it does little, so the word must mean anti-ageing.
老年病/1 | 高血压、糖尿病 | High blood pressure and diabetes are common examples, so the word must mean geriatric disease.
早衰/1 | 长期熬夜压力大 | Staying up late and too much stress can make people age early, so the word must mean premature ageing.
年迈/1 | 周末回家照顾的父母 | Every weekend he goes home to care for his old parents, so the word must mean aged.
儿科/1 | 孩子发烧了要挂 | A child with a fever is seen in this department, so the word must mean paediatrics.
眼科/1 | 看东西不清楚去查视力 | He cannot see clearly and has his eyes tested, so the word must mean ophthalmology.
骨科/1 | 摔断了腿被送到 | He broke his leg and was taken to this department, so the word must mean orthopaedics.
产科/1 | 快生孩子住进了 | She is about to give birth, so the word must mean obstetrics.
住院部/1 | 门诊在前面，它在后面的大楼 | Outpatients are in the front building and this is in the big building behind, so the word must mean inpatient department.
化验/1 | 医生让他去查一下血 | The doctor sends him first to have his blood tested, so the word must mean laboratory test.
主治医生/1 | 你的是李医生 | Dr Li is in charge of your case, so the word must mean attending doctor.
副院长/1 | 协助院长管理医院 | He helps the head run the hospital, so the word must mean vice president of a hospital.
医嘱/1 | 出院以后按时吃药 | After leaving hospital, take medicine as the doctor instructed, so the word must mean doctor's advice.
挂号/1 | 看病先做的事 | Before seeing a doctor you must first sign in, then queue, so the word must mean to register.
把脉/1 | 中医看病先给病人 | Doctors of Chinese medicine often begin by feeling the wrist, so the word must mean to take the pulse.
药材/1 | 地区出产很多名贵的 | The region produces many precious medicinal plants, so the word must mean medicinal materials.
经络/1 | 中医说人体有很多，把全身连在一起 | Chinese medicine says many channels link the whole body, so the word must mean meridians.
气血/1 | 中医说不足，所以脸色不好 | Chinese medicine blames her pale face on this being weak, so the word must mean qi and blood.
食疗/1 | 合适的饮食也能治病 | Chinese medicine holds that the right diet can also cure, so the word must mean food therapy.
补品/1 | 给生病的奶奶买了很多 | He bought his sick grandmother many things to build her up, so the word must mean tonic.
调理/1 | 病好以后吃中药养身体 | After recovering she took Chinese medicine for a month to restore her health, so the word must mean to recuperate.
上火/1 | 吃了太多辣的东西 | He has eaten too much spicy food lately, so the word must mean to have excess internal heat.
阴阳/1 | 中医用来解释身体的变化 | Chinese medicine explains the body's changes by two opposing forces, so the word must mean yin and yang.
中成药/1 | 比自己熬汤药方便 | It is much easier than boiling herbal remedies yourself, so the word must mean patent Chinese medicine.
栖息/1 | 树林里住着很多种鸟 | Many kinds of birds live in this wood, so the word must mean to inhabit.
栖息地/1 | 修路破坏了野生动物的 | Road building has destroyed where many wild animals live, so the word must mean habitat.
洞穴/1 | 人类的祖先曾经住在里面 | Long ago humans' ancestors lived in them, so the word must mean cave.
巢穴/1 | 狼带着食物回去 | At dusk the wolf brings food home, so the word must mean lair.
鸟巢/1 | 树上里面有三个鸟蛋 | Up in the tree there is one with three eggs, so the word must mean bird's nest.
筑巢/1 | 小鸟衔小树枝 | In spring little birds carry twigs in their beaks, so the word must mean to build a nest.
生态系统/1 | 一片森林里生物互相依存 | In a forest all living things depend on one another, so the word must mean ecosystem.
食物链/1 | 草被羊吃，羊被狼吃 | Sheep eat grass and wolves eat sheep, so the word must mean food chain.
候鸟/1 | 每年秋天飞到南方过冬 | Every autumn these birds fly south for the winter, so the word must mean migratory bird.
冬眠/1 | 熊在洞里到春天才出来 | Bears sleep in their dens through the winter and come out in spring, so the word must mean to hibernate.
濒危/1 | 鸟已经很少了 | Few of these birds are left and they are listed for protection, so the word must mean endangered.
稀有/1 | 全世界只有几个地方能看到 | The flower can be seen in only a few places in the world, so the word must mean rare.
偷猎/1 | 法律严禁 | The law strictly forbids hunting wild animals illegally, so the word must mean to poach.
大熊猫/1 | 中国特有，主要吃竹子 | It is found only in China and eats mainly bamboo, so the word must mean giant panda.
种群/1 | 保护多年这里的鹿越来越多 | After years of protection the deer here grow more numerous, so the word must mean population.
自然保护区/1 | 不许随便砍树的森林 | No one may cut trees in this forest freely, so the word must mean nature reserve.
救助/1 | 受伤的小鹿好了再放回山里 | They cared for an injured fawn and will release it when it is well, so the word must mean to rescue.
人工繁殖/1 | 这种动物的数量慢慢增加 | People breed the animals in captivity and their numbers slowly grow, so the word must mean captive breeding.
外来物种/1 | 到了新地方没有天敌会大量繁殖 | Some living things brought to a new place have no enemies and multiply fast, so the word must mean alien species.
入侵/1 | 草被带到别的国家占了河流 | The grass was carried to another country and took over its rivers, so the word must mean to invade.
繁殖/1 | 春天是很多动物的季节 | Spring is when many animals have their young, so the word must mean to breed.
生殖/1 | 生物产生新的个体 | Living things produce new individuals this way, generation after generation, so the word must mean reproduction.
养殖/1 | 海边养了很多鱼的场 | He set up a place by the sea where he raises many fish, so the word must mean aquaculture, breeding.
捕食/1 | 猫头鹰夜里出来抓老鼠 | Owls come out at night to catch mice, so the word must mean to prey on.
猎物/1 | 狮子慢慢靠近它的 | The lion creeps slowly up on what it is hunting, so the word must mean prey.
食草动物/1 | 牛、羊和鹿 | Cattle, sheep and deer all eat plants, so the word must mean herbivore.
食肉动物/1 | 狮子和狼 | Lions and wolves both eat other animals, so the word must mean carnivore.
群居/1 | 狼常常一起打猎 | Wolves often hunt together, so the word must mean to live in groups.
夜行/1 | 猫头鹰白天睡晚上活动 | Owls sleep by day and come out at night, so the word must mean nocturnal.
栖身/1 | 刚到城市只能在朋友家住 | When he first came to the city he could only stay at a friend's, so the word must mean to stay, shelter.
鹿/1 | 草地上吃草，听到声音就跑 | An animal grazing on the grass ran off at a sound, so the word must mean deer.
长颈鹿/1 | 世界上最高的动物 | It is the tallest animal in the world, so the word must mean giraffe.
鹿角/1 | 这只鹿的又大又漂亮 | They grow big and handsome on this deer's head, so the word must mean antler.
狼/1 | 夜里山上传来叫声 | At night its howl comes from the mountain, so the word must mean wolf.
狼群/1 | 好几只一起打猎 | Several wolves hunt together in one, so the word must mean wolf pack.
老鼠/1 | 猫会抓 | Cats catch them, so the word must mean mouse, rat.
松鼠/1 | 公园的树上抱着果子吃 | In the park a small animal in a tree is holding a nut and eating, so the word must mean squirrel.
袋鼠/1 | 澳大利亚用后腿跳着走 | It lives mainly in Australia and hops on its hind legs, so the word must mean kangaroo.
鼠疫/1 | 历史上让欧洲很多人死去 | In history this disease killed great numbers of people in Europe, so the word must mean plague.
胆小如鼠/1 | 晚上一个人不敢出门 | He dare not go out alone at night, so the word must mean cowardly.
蛇/1 | 草里有一条，小心 | Something is in the grass and everyone must take care, so the word must mean snake.
毒蛇/1 | 人被它伤了要去医院 | Anyone it bites must go to hospital at once, so the word must mean venomous snake.
爬行动物/1 | 蛇没有脚靠身体爬 | A snake has no feet and crawls along on its body, so the word must mean reptile.
两栖动物/1 | 小时候在水里，长大也能上岸 | They live in water when young and can live on land as adults, so the word must mean amphibian.
鳞片/1 | 鱼身上在阳光下闪光 | The fish's body glitters in the sun, so the word must mean scale.
鱼鳞/1 | 做鱼以前刮干净 | Before cooking a fish you scrape them off, so the word must mean fish scales.
羽翼/1 | 小鸟还没长好不能飞 | The little bird cannot fly yet because these have not grown, so the word must mean wings.
机翼/1 | 从飞机窗口看到长长的 | From the plane's window you see it stretching out, so the word must mean aircraft wing.
遍体鳞伤/1 | 小狗被救回来时全身是伤 | The puppy was hurt all over when it was rescued, so the word must mean covered in cuts.
打草惊蛇/1 | 先别说出去，免得 | We should not tell anyone yet, to avoid warning them, so the word must mean to alert the enemy.
蚊子/1 | 夏天晚上叮得人起包 | On summer nights they bite and leave bumps on the skin, so the word must mean mosquito.
蚊帐/1 | 以前夏天睡觉时挂 | People used to hang one over the bed in summer, so the word must mean mosquito net.
蚊香/1 | 屋里点了一盘 | He lit a coil of it in the room, so the word must mean mosquito coil.
驱蚊/1 | 露营别忘了带这种水 | Do not forget the spray that keeps insects off when camping, so the word must mean to repel mosquitoes.
灭蚊/1 | 社区组织大家清理积水 | The community clears standing water to stop insects breeding, so the word must mean to kill mosquitoes.
益虫/1 | 蜜蜂帮植物传花粉 | Bees help plants by carrying pollen, so the word must mean beneficial insect.
虫卵/1 | 叶子背面过几天变成小虫 | In a few days they will turn into small insects, so the word must mean insect eggs.
寄生/1 | 虫子在动物身体里让动物生病 | Some worms live inside animals and make them ill, so the word must mean parasitic.
共生/1 | 两方都得到好处的关系 | The relationship benefits both sides, like bees and flowers, so the word must mean symbiosis.
珊瑚虫/1 | 珊瑚由很多小小的它造成 | Coral is built by countless tiny creatures, so the word must mean coral polyp.
湿地/1 | 被叫做“地球之肾”，能净化水 | It is called the kidney of the earth because it cleans water, so the word must mean wetland.
沼泽/1 | 人走进去可能沉下去 | Anyone who walks in may sink, so the word must mean swamp.
沼泽地/1 | 里面生活着很多水鸟 | Many water birds live in this wet ground, so the word must mean marshland.
泥沼/1 | 公司落入经济困难的 | His company has sunk into economic trouble it cannot climb out of, so the word must mean quagmire.
沼气/1 | 农村用来做饭又干净又省钱 | Villagers cook with this gas, which is clean and cheap, so the word must mean biogas.
河滩/1 | 孩子们找漂亮的石头 | Children look for pretty stones by the river, so the word must mean riverbank flat.
沙滩/1 | 夏天海边晒太阳 | In summer many people sunbathe by the sea, so the word must mean sandy beach.
海滩/1 | 退潮以后留下小鱼和小石头 | Low tide leaves small fish and pebbles behind, so the word must mean beach.
险滩/1 | 河里开船要小心的地方 | Boats must take special care on this river, so the word must mean dangerous shoal.
泥滩/1 | 一脚下去就到了膝盖 | One step sinks you to the knee in soft mud, so the word must mean mudflat.
珊瑚/1 | 海底五颜六色的 | It grows in many colours on the sea floor, so the word must mean coral.
珊瑚礁/1 | 澳大利亚东北海岸有世界上最大的 | Australia's north-east coast has the largest in the world, so the word must mean coral reef.
礁石/1 | 海浪一次又一次地打在上面 | Waves break on it again and again, so the word must mean reef rock.
暗礁/1 | 船很容易出事故 | Ships here easily have accidents, so the word must mean hidden reef.
礁岛/1 | 很小，上面只长着几种小树 | Only a few kinds of small trees grow on it, so the word must mean reef island.
海底/1 | 船沉到了 | The ship sank there, so the word must mean seabed.
潜水/1 | 戴上工具看海底的鱼 | They put on gear to see fish on the sea floor, so the word must mean to dive.
海洋生物/1 | 珊瑚礁里生活着很多种 | Many kinds of them live on coral reefs, so the word must mean marine life.
白化/1 | 海水温度太高珊瑚会 | Water that is too warm makes coral lose its colour and die, so the word must mean to bleach.
礁盘/1 | 退潮的时候露出水面 | It rises above the water at low tide, so the word must mean reef flat.
涝灾/1 | 连着下了半个月的雨 | It rained for half a month on end, so the word must mean waterlogging.
洪涝/1 | 夏天雨多常常发生的灾害 | The region gets much rain in summer and suffers this disaster, so the word must mean flooding.
旱涝/1 | 修了水渠以后都不怕 | Since the channels were dug, the crops fear neither too little rain nor too much, so the word must mean drought and flood.
内涝/1 | 大雨以后城里路段被水淹 | After heavy rain many streets in the city were under water, so the word must mean urban waterlogging.
排涝/1 | 大雨以后工人连夜把水排走 | After heavy rain workers pumped water away all night, so the word must mean to drain waterlogged land.
积水/1 | 下完雨路上很多，开车慢点 | After the rain the roads are full of puddles and drivers should slow down, so the word must mean standing water.
决堤/1 | 河水太大，村子都进了水 | The river rose high enough to flood nearby villages, so the word must mean to burst a dyke.
枯水期/1 | 冬天河里的水很少 | In winter the river has very little water, so the word must mean dry season.
水位/1 | 下了几天雨河里涨了很多 | Days of rain have raised the river a lot, so the word must mean water level.
旱灾/1 | 很多庄稼都干死了 | Many crops have dried up and died this year, so the word must mean drought.
霜/1 | 早上地上铺了一层白白的 | In the morning a white layer covers the ground, so the word must mean frost.
霜冻/1 | 让果园里的花都冻坏了 | The cold froze the blossoms in the orchard, so the word must mean frost damage.
霜降/1 | 以后天气越来越冷 | After this solar term the weather gets colder and colder, so the word must mean Frost's Descent.
结霜/1 | 天太冷窗户上 | In the bitter cold the windows have turned white, so the word must mean to frost over.
寒潮/1 | 来了气温一天下降十几度 | The temperature fell more than ten degrees in a day, so the word must mean cold wave.
冰霜/1 | 她脸上冷若 | The set phrase 冷若 describes her cold, silent face, so the word must mean ice and frost.
风霜/1 | 老人的脸上写满了 | The old man's face shows a lifetime of hardship, so the word must mean hardships.
雪上加霜/1 | 丢了工作又生了病 | He lost his job and then fell ill as well, so the word must mean to add insult to injury.
霜叶/1 | 秋天满山红得像火 | In autumn the hills are red as fire, so the word must mean frosted leaves.
无霜期/1 | 很长，一年种两次庄稼 | Two crops a year grow here because it is long, so the word must mean frost-free period.
堤坝/1 | 为了防洪在河边修的 | People built them along the river against floods, so the word must mean dyke.
大坝/1 | 长江上的三峡 | It is the Three Gorges one on the Yangtze, so the word must mean dam.
水坝/1 | 河上修了一座用来发电 | One was built on the river to make electricity, so the word must mean dam.
河堤/1 | 晚饭后很多人在上面散步 | After supper many people stroll along it, so the word must mean river embankment.
堤岸/1 | 洪水冲坏了一段 | The flood broke a stretch of it, so the word must mean embankment.
堤防/1 | 雨季以前政府加固了 | Before the rainy season the government strengthened them, so the word must mean dyke.
筑坝/1 | 在河上会影响鱼的游动 | Doing this on a river affects how fish swim, so the word must mean to build a dam.
海堤/1 | 挡住了海水保护村子 | It keeps out the sea and protects the village behind it, so the word must mean sea wall.
水电站/1 | 发的电可以供好几个城市用 | Its electricity serves several cities, so the word must mean hydropower station.
蓄水/1 | 雨季时大坝留着旱季用 | The dam keeps water in the rainy season for the dry season, so the word must mean to store water.
肥沃/1 | 土地种什么都长得好 | Anything planted here grows well, so the word must mean fertile.
沃土/1 | 黑土地出产大量粮食 | The black earth yields great harvests of grain, so the word must mean fertile soil.
沃野/1 | 站在山上往下看千里 | From the hill the rich fields stretch beyond sight, so the word must mean fertile fields.
腐烂/1 | 落叶以后变成养分 | Fallen leaves break down into nourishment for the soil, so the word must mean to rot.
腐殖质/1 | 森林的土里很多所以很肥 | Forest soil is rich because it is full of this, so the word must mean humus.
腐叶/1 | 用它做的土适合养花 | Soil made from them is good for growing flowers, so the word must mean rotted leaves.
侵蚀/1 | 风和水长年磨着石头 | Wind and water have worn away the rocks for years, so the word must mean to erode.
水土流失/1 | 树被砍光造成了严重的 | The trees on the mountain were all cut down, so the word must mean soil erosion.
风化/1 | 石头一摸就掉沙子 | Sand comes off the rock at a touch, so the word must mean to weather.
堆肥/1 | 用厨房里的菜叶做 | She makes it from kitchen vegetable scraps, so the word must mean compost.
耕地/1 | 中国人口多，种地的地方少 | China has many people and relatively little of it, so the word must mean arable land.
耕种/1 | 一家人世世代代在这里 | The family has worked the land here for generations, so the word must mean to cultivate.
开垦/1 | 农民在山下开出一大片荒地 | Farmers have broken up a large piece of waste land below the mountain, so the word must mean to reclaim land.
垦荒/1 | 年轻人来到北方开荒地 | Decades ago many young people went north to break new ground, so the word must mean to open up wasteland.
退耕还林/1 | 为了保护环境 | Fields are given back to trees to protect the environment, so the word must mean to return farmland to forest.
农耕/1 | 中国几千年的历史 | China has a history of farming thousands of years long, so the word must mean farming.
春耕/1 | 天气暖和了农民开始忙着 | The weather has warmed and farmers are busy working the fields, so the word must mean spring ploughing.
深耕/1 | 能让土变松庄稼长得更好 | Ploughing deep loosens the soil and crops grow better, so the word must mean deep ploughing.
精耕细作/1 | 在小地上收了很多粮食 | Their careful farming yields much grain from a small plot, so the word must mean intensive cultivation.
耕牛/1 | 以前农民家里都有，现在用机器 | Farmers used to keep one but now mostly use machines, so the word must mean plough ox.
灌溉/1 | 河水用来浇两岸的农田 | The river's water is used on the fields on both banks, so the word must mean to irrigate.
浇灌/1 | 老师用心培养“小树苗” | The teacher tends her pupils like young trees, so the word must mean to water.
灌木/1 | 路边种了一排修得很好看 | A row of low bushes has been planted by the road, so the word must mean shrub.
水渠/1 | 把河水引到田里 | Farmers dug it to bring river water to the fields, so the word must mean irrigation channel.
沟渠/1 | 田间把水送到每一块地 | They carry water to every plot in the fields, so the word must mean ditch.
渠道/1 | 通过正规的买书 | You can buy the book through proper ones, so the word must mean channel.
滴灌/1 | 在缺水的地方可以省很多水 | Where water is short, it saves a great deal, so the word must mean drip irrigation.
灌水/1 | 往瓶子里放水再插花 | He poured water into the bottle before putting the flowers in, so the word must mean to fill with water.
灌输/1 | 好的教育不只是硬塞知识 | Good teaching does not just pour in knowledge but teaches pupils to think, so the word must mean to instil.
水到渠成/1 | 努力学习考上大学是自然的事 | If you study hard, getting into university will follow naturally, so the word must mean success comes naturally.
焚烧/1 | 在田里烧垃圾污染空气 | Burning rubbish in the fields pollutes the air, so the word must mean to burn.
野火/1 | 天气干燥山上容易发生 | The weather is dry and the mountain easily catches fire, so the word must mean wildfire.
腐蚀/1 | 海水会损坏铁做的船 | Seawater eats away at iron ships, so the word must mean to corrode.
酸雨/1 | 伤害植物还会损坏建筑 | It harms plants and damages buildings, so the word must mean acid rain.
重金属/1 | 河水受到污染鱼都死了 | The river was polluted and its fish died, so the word must mean heavy metal.
铅/1 | 很重的金属，进入人体损害健康 | It is a heavy metal that harms health inside the body, so the word must mean lead.
含铅/1 | 玩具对孩子健康有害 | The toy is harmful to children's health, so the word must mean lead-containing.
防腐/1 | 木头经过处理可以用很多年 | The wood was treated to last many years, so the word must mean anticorrosion.
防腐剂/1 | 面包不含，要早点吃完 | The bread has none and should be eaten soon, so the word must mean preservative.
腐败/1 | 夏天食物容易坏 | In summer food goes off easily, so the word must mean to go bad.
生态平衡/1 | 乱捕野生动物会破坏 | Catching wild animals at will upsets it, so the word must mean ecological balance.
植树造林/1 | 几十年把沙地变成森林 | Decades of planting have turned sand into forest, so the word must mean afforestation.
可持续/1 | 发展经济要走的道路 | Economic growth should follow a path that can last, so the word must mean sustainable.
荒漠化/1 | 植被破坏土地会慢慢 | Once plant cover is destroyed, land slowly turns to desert, so the word must mean desertification.
沙漠化/1 | 风沙越来越大草原正在 | The sandstorms grow and the grassland is turning to sand, so the word must mean desertification.
治沙/1 | 多年以后沙地长出草和树 | Years of work have brought grass and trees to the sand, so the word must mean sand control.
防风林/1 | 村子北边挡住风沙 | A row of trees north of the village keeps out the sand, so the word must mean windbreak forest.
碳排放/1 | 少开车可以减少 | Driving less and taking buses reduces it, so the word must mean carbon emissions.
垃圾分类/1 | 纸、塑料要分开放 | Paper and plastic must be put out separately, so the word must mean waste sorting.
节能减排/1 | 工厂换了新的机器 | The factory changed its machines to save energy and pollute less, so the word must mean energy saving and emission reduction.
颗粒/1 | 药是这种形状，用温水冲开 | The medicine comes in tiny grains dissolved in warm water, so the word must mean granule.
颗粒物/1 | 空气里太多会出现雾霾 | Too much of it in the air makes smog, so the word must mean particulate matter.
粒子/1 | 原子由更小的组成 | Atoms are made of smaller units, so the word must mean particle.
沸点/1 | 水的是一百度 | For water at one standard atmosphere it is a hundred degrees, so the word must mean boiling point.
熔点/1 | 冰的是零度 | For ice it is zero degrees, so the word must mean melting point.
沸水/1 | 把鸡蛋放进去煮十分钟 | The eggs are cooked in it for ten minutes, so the word must mean boiling water.
沸腾/1 | 水加热到一百度就会 | Water does this when heated to a hundred degrees, so the word must mean to boil.
气化/1 | 水受热变成水蒸气 | Heated water turns into steam, so the word must mean to vaporise.
液化/1 | 天然气用船运走之前 | Natural gas is changed before it can be shipped far away, so the word must mean to liquefy.
化学式/1 | 用符号表示物质由哪些元素组成 | It uses symbols to show which elements a substance is made of, so the word must mean chemical formula.
过滤/1 | 河水要经过才能喝 | River water must pass through something before it can be drunk, so the word must mean to filter.
滤网/1 | 空调的要经常清洗 | The air conditioner's one needs frequent cleaning, so the word must mean filter screen.
滤纸/1 | 实验时把水里的沙子分离 | In the experiment the teacher used it to separate sand from water, so the word must mean filter paper.
净水器/1 | 家里装了水可以直接喝 | With it fitted at home, the water can be drunk straight away, so the word must mean water purifier.
溶液/1 | 盐溶解以后就成了盐水 | Salt dissolved in water makes salt water, so the word must mean solution.
杂质/1 | 金子里含有一些 | The gold is not pure, so the word must mean impurity.
渗透/1 | 雨水慢慢到地下 | Rainwater slowly sinks into the ground, so the word must mean to seep.
渗水/1 | 下了几天雨墙角 | After days of rain the corner of the wall is wet, so the word must mean to leak water.
渗出/1 | 伤口里出来了一点儿血 | A little blood seeped from the wound, so the word must mean to ooze.
试纸/1 | 测出水是酸的还是碱的 | It shows whether water is acid or alkaline, so the word must mean test strip.
裂缝/1 | 地震以后墙上出现了一道 | After the earthquake a crack appeared in the wall, so the word must mean crack.
裂开/1 | 天太干地都 | In the dry weather the ground has cracked, so the word must mean to split open.
分裂/1 | 一个细胞变成两个 | One cell becomes two, so the word must mean to divide.
裂变/1 | 核电站利用原子核的 | Nuclear power stations use energy released when nuclei split, so the word must mean fission.
破裂/1 | 气球充气太多一下子 | The balloon was blown up too much and suddenly popped, so the word must mean to burst.
断裂/1 | 钢管受力太大已经 | The steel pipe broke under too much stress, so the word must mean to fracture.
裂痕/1 | 吵架以后友谊有了 | After that quarrel their friendship was damaged, so the word must mean rift.
四分五裂/1 | 杯子掉在地上摔得 | The cup fell to the floor and broke into pieces, so the word must mean to fall apart.
核裂变/1 | 原子弹的能量来自 | An atomic bomb's energy comes from splitting nuclei, so the word must mean nuclear fission.
裂口/1 | 嘴唇干得起了 | His lips are dry enough to crack, so the word must mean split.
氮/1 | 空气中大约百分之七十八 | It makes up about seventy-eight per cent of the air, so the word must mean nitrogen.
氮气/1 | 食品包装袋里常常充 | Food bags are often filled with this gas to keep the food fresh, so the word must mean nitrogen gas.
氯/1 | 游泳池水里加含它的东西消毒 | Swimming pools add a substance containing this element to kill germs, so the word must mean chlorine.
氯气/1 | 黄绿色，有很强的味道 | The gas is yellowish green with a strong smell, so the word must mean chlorine gas.
铝/1 | 锅又轻又不容易生锈 | The pan is light and does not rust easily, so the word must mean aluminium.
硅/1 | 电脑的芯片主要用它做 | Computer chips are made mainly from this element, so the word must mean silicon.
锂/1 | 手机电池里一般含有 | Phone batteries usually contain this metal, so the word must mean lithium.
碱/1 | 在面里放一点去掉酸味 | A little of it in dough takes away the sour taste, so the word must mean alkali.
周期表/1 | 化学课学习的元素 | In chemistry class they studied the table of the elements, so the word must mean periodic table.
化学反应/1 | 铁生锈是一种 | Iron rusting is an example of one, so the word must mean chemical reaction.
酸性/1 | 醋的味道很酸 | Vinegar tastes sour, so the word must mean acidic.
碱性/1 | 土不适合种喜欢酸性土的花 | The soil does not suit flowers that like acid soil, so the word must mean alkaline.
中和/1 | 胃酸太多吃一点药 | When there is too much stomach acid, medicine can cancel it out, so the word must mean to neutralise.
酸碱度/1 | 种花之前先测土的 | Before planting flowers, it is best to test the soil, so the word must mean pH.
烧杯/1 | 把溶液倒进去放在火上加热 | He poured the solution into a glass vessel to heat over the flame, so the word must mean beaker.
试管/1 | 滴了几滴药水液体变红 | He dripped some liquid into a small glass tube and it turned red, so the word must mean test tube.
实验报告/1 | 做完实验每个学生都要写 | Every pupil writes one after the experiment, so the word must mean lab report.
对照组/1 | 一组吃新药，另一组不吃 | One group takes the new drug and the other takes none, so the word must mean control group.
样品/1 | 把一小块送到实验室检查 | The worker sent a small piece to the lab for testing, so the word must mean sample.
精度/1 | 仪器误差不到千分之一 | The instrument's error is under one part in a thousand, so the word must mean precision.
合金/1 | 钢是铁和碳的 | Steel is iron and carbon mixed together, so the word must mean alloy.
铝合金/1 | 自行车又轻又结实 | The bicycle is both light and strong, so the word must mean aluminium alloy.
不锈钢/1 | 厨房里的锅和水池 | Kitchen pans and sinks are often made of it, so the word must mean stainless steel.
单晶硅/1 | 太阳能电池板常常用 | Solar panels are often made of it, so the word must mean monocrystalline silicon.
锂电池/1 | 电动汽车大多用 | Most electric cars use this kind, so the word must mean lithium battery.
韧性/1 | 材料弯过来也不会断 | The material bends without breaking, so the word must mean toughness.
坚韧/1 | 凭着这样的意志完成研究 | His strong will carried him through the research, so the word must mean tenacious.
柔韧/1 | 经常做体操身体会变得 | Doing gymnastics often makes the body bend easily, so the word must mean supple.
纤维/1 | 多吃蔬菜能补充，帮助消化 | Eating vegetables supplies it and helps digestion, so the word must mean fibre.
碳纤维/1 | 自行车的车架非常轻 | The bicycle frame is extremely light, so the word must mean carbon fibre.
杠杆/1 | 省力地把重的东西举起来 | It lets you lift something heavy with little effort, so the word must mean lever.
支点/1 | 给我一个，我就能移动地球 | An ancient Greek scientist said that with one he could move the earth, so the word must mean fulcrum.
轴/1 | 地球围着自己的转 | The earth turns once a day around it, so the word must mean axis.
车轴/1 | 断了轮子掉下来 | It broke and the wheel came off, so the word must mean axle.
中轴线/1 | 北京老城重要建筑都在这条线上 | Many important buildings of old Beijing stand on one line, so the word must mean central axis.
单杠/1 | 在上面做了二十个引体向上 | He did twenty pull-ups on it, so the word must mean horizontal bar.
双杠/1 | 体操运动员做出漂亮动作 | The gymnast performed fine moves on them, so the word must mean parallel bars.
旗杆/1 | 操场中间立着一根高高的 | A tall one stands in the middle of the sports ground, so the word must mean flagpole.
栏杆/1 | 过桥时小孩子要扶着 | Small children should hold on while crossing the bridge, so the word must mean railing.
电线杆/1 | 路边每隔几十米就有一根 | There is one every few dozen metres along the road, so the word must mean utility pole.
螺丝/1 | 椅子腿松了要上紧 | The chair leg is loose and these need tightening, so the word must mean screw.
螺母/1 | 螺丝另一头上好 | After passing the screw through, you fit one on the other end, so the word must mean nut.
螺丝刀/1 | 把电脑的后盖打开 | He opened the back of the computer with it, so the word must mean screwdriver.
螺旋/1 | 楼梯一圈一圈往上 | The staircase winds round and round as it climbs, so the word must mean spiral.
钉子/1 | 在墙上打了一颗挂画 | He knocked one into the wall to hang a picture, so the word must mean nail.
图钉/1 | 用四个把地图按在墙上 | He pinned the map to the wall with four of them, so the word must mean drawing pin.
钉/1 | 几块木板做成小箱子 | He fixed several boards together to make a box, so the word must mean to nail.
拆开/1 | 把旧收音机看看里面的结构 | He took the old radio to pieces to see inside, so the word must mean to take apart.
拆卸/1 | 工人们正在拆旧的机器 | The workers are taking the old machine apart, so the word must mean to dismantle.
零件/1 | 机器少了一个不能用 | The machine cannot work because one piece is missing, so the word must mean part.
水泵/1 | 地下室进水用它把水抽出去 | The basement flooded and workers pumped the water out, so the word must mean water pump.
电缆/1 | 工人们在地下铺设 | Workers are laying it underground, so the word must mean cable.
光缆/1 | 网络信号通过海底传到别的大洲 | Internet signals reach other continents along the seabed, so the word must mean optical cable.
缆车/1 | 我们坐它上了山顶 | We rode it up to the summit, so the word must mean cable car.
铸造/1 | 大钟是用铜做的 | The great bell was made by pouring bronze, so the word must mean to cast.
焊接/1 | 工人在接钢管，火花四射 | Sparks fly as the worker joins steel pipes, so the word must mean to weld.
电焊/1 | 做的时候要戴保护眼睛的面罩 | You must wear a face shield to protect your eyes when doing it, so the word must mean electric welding.
钻头/1 | 很硬，连石头都能钻开 | It is hard enough to bore through stone, so the word must mean drill bit.
钻孔/1 | 在墙上准备装架子 | He is making holes in the wall to put up a shelf, so the word must mean to drill a hole.
光纤/1 | 家里装了以后网速快多了 | Since it was installed the internet is much faster, so the word must mean optical fibre.
弧线/1 | 球在空中划出一道 | The ball traced a lovely curve through the air, so the word must mean arc.
弧形/1 | 桥像半个圆 | The bridge is shaped like half a circle, so the word must mean arc shape.
圆柱/1 | 杯子的形状一般是 | It is the usual shape of a cup, so the word must mean cylinder.
圆锥/1 | 帽子上面尖尖的 | The hat comes to a point on top, so the word must mean cone.
凹/1 | 车门被打了一下陷进去一块 | The car door was hit and sank in, so the word must mean concave, dented.
凸/1 | 吃得太多肚子出来了 | He ate too much and his belly sticks out, so the word must mean convex, bulging.
凹凸不平/1 | 山路骑车很危险 | The mountain road is bumpy and dangerous to cycle, so the word must mean uneven.
柱子/1 | 大殿里有几十根红色的 | The ancient hall has dozens of red ones, so the word must mean pillar.
凸透镜/1 | 把太阳光集中到一个点 | It can focus sunlight onto one point, so the word must mean convex lens.
凹透镜/1 | 近视眼镜用的 | Glasses for short sight use this kind, so the word must mean concave lens.
半径/1 | 圆的是直径的一半 | It is half the diameter of a circle, so the word must mean radius.
直径/1 | 圆的是十厘米，半径五厘米 | Here it is ten centimetres and the radius five, so the word must mean diameter.
周长/1 | 正方形边长五米，总长二十米 | Each side of the square is five metres and the distance round it is twenty, so the word must mean perimeter.
圆周率/1 | 大约是三点一四 | It is about 3.14, so the word must mean pi.
口径/1 | 水管的是五厘米 | The pipe measures five centimetres across inside, so the word must mean calibre, bore.
途径/1 | 读书是获得知识的重要 | Reading is an important means of gaining knowledge, so the word must mean way, channel.
径直/1 | 下了车直接走进办公室 | He got out of the car and walked right into the office, so the word must mean straight.
锥子/1 | 奶奶先打一个孔再缝 | The sole is hard and Grandma first punches a hole before sewing, so the word must mean awl.
柱形/1 | 图清楚显示每个月的数据 | The chart shows each month's sales as bars, so the word must mean column-shaped.
圆锥形/1 | 山顶尖尖的 | The mountain has a pointed peak, so the word must mean conical.
边缘/1 | 不要站在悬崖的 | The speaker warns against standing at the cliff's brink, so the word must mean edge.
绝缘/1 | 电线外面包着一层材料 | Electric wire is wrapped in a material that stops current, so the word must mean insulation.
半导体/1 | 硅是做芯片的重要材料 | Silicon is an important material for making chips, so the word must mean semiconductor.
电路/1 | 灯不亮了可能出了问题 | The light has gone out and something may be wrong with the wiring, so the word must mean circuit.
电压/1 | 电池的太低灯不亮 | The battery is too weak to light the lamp, so the word must mean voltage.
短路/1 | 电线老化容易引起，甚至着火 | Old wiring can cause this and even start fires, so the word must mean short circuit.
超导/1 | 很低温度下导电几乎没有损失 | At very low temperatures such materials conduct with almost no loss, so the word must mean superconductivity.
传感器/1 | 汽车能发现周围的障碍 | The car detects obstacles around it, so the word must mean sensor.
存储/1 | 电脑能放大量照片和视频 | The computer can hold large numbers of photos and videos, so the word must mean to store.
处理器/1 | 电脑的很快，不卡 | The computer runs large programs without lag, so the word must mean processor.
鉴定/1 | 专家看了以后说画是真的 | After examining it, the expert says the painting is genuine, so the word must mean to appraise.
鉴别/1 | 两块玉哪块是真的 | The speaker asks if you can tell which piece of jade is real, so the word must mean to distinguish.
借鉴/1 | 别的国家的成功经验 | We can learn from other countries' successes, so the word must mean to draw on.
鉴赏/1 | 一眼能看出画的好坏 | He can tell at a glance whether a painting is good, so the word must mean appreciation.
年鉴/1 | 记录全国一年的经济数据 | It records the country's economic data for the year, so the word must mean yearbook.
鉴于/1 | 天气原因比赛推迟 | Because of the weather the match is put off until tomorrow, so the word must mean in view of.
试错/1 | 科学研究不断找正确方法 | Research often finds the right method only after many failed tries, so the word must mean trial and error.
定律/1 | 牛顿提出了三大运动 | Newton set out three laws of motion, so the word must mean law.
量子/1 | 这种计算机可能快得多 | Computers of this kind may be far faster than today's, so the word must mean quantum.
硅谷/1 | 美国很多科技公司在那里 | Many famous tech companies are based in this part of America, so the word must mean Silicon Valley.
云计算/1 | 小公司不用买很多服务器 | Small companies can handle large data without buying many servers, so the word must mean cloud computing.
服务器/1 | 网站访问的人太多出了问题 | Too many visitors brought the website down, so the word must mean server.
操作系统/1 | 手机的需要定期更新 | The phone's needs regular updates, so the word must mean operating system.
宽带/1 | 家里装了上网很快 | With it installed, the internet at home is fast, so the word must mean broadband.
触屏/1 | 手机没有键盘了 | Most phones today have no keyboard, so the word must mean touchscreen.
鼠标/1 | 点一下图标打开文件 | Clicking the icon with it opens the file, so the word must mean mouse.
摄像头/1 | 视频会议前检查一下 | Check it before a video meeting, so the word must mean camera.
输入法/1 | 用拼音打汉字 | The speaker types characters by pinyin, so the word must mean input method.
基站/1 | 山区新建了很多，手机信号好多了 | Many new ones in the mountains have improved phone signal, so the word must mean base station.
自动驾驶/1 | 汽车靠传感器和电脑判断路况 | Such cars judge road conditions with sensors and computers, so the word must mean autonomous driving.
运载火箭/1 | 把卫星送上了轨道 | It put the satellite into orbit, so the word must mean carrier rocket.
月球车/1 | 在月亮上行驶拍照片 | It drove on the moon and took many photos, so the word must mean lunar rover.
新材料/1 | 航天器上又轻又结实的 | Spacecraft use many light, strong materials, so the word must mean new material.
气凝胶/1 | 世界上最轻的固体材料之一 | It is one of the lightest solids in the world, so the word must mean aerogel.
失重/1 | 在太空航天员浮在空中 | In space astronauts float in the air, so the word must mean weightlessness.
真空/1 | 没有空气，声音传不过去 | Space has almost no air and sound cannot travel there, so the word must mean vacuum.
返回舱/1 | 航天员坐着它落回地面 | The astronauts came safely back to earth in it, so the word must mean re-entry capsule.
天体/1 | 太阳、月亮和星星都属于 | The sun, moon and stars all belong to this class, so the word must mean celestial body.
小行星/1 | 火星和木星之间有很多 | A belt of them lies between Mars and Jupiter, so the word must mean asteroid.
宇航服/1 | 出舱时穿的特别衣服 | Astronauts wear it when leaving the craft, so the word must mean spacesuit.
科研/1 | 大学发表了很多论文 | The university publishes many papers, so the word must mean scientific research.
攻关/1 | 大家一起解决技术难题 | The team is working hard to solve the technical problem soon, so the word must mean to tackle a key problem.
科技成果/1 | 研究出来的东西用到了生产中 | What the research produced is already used in farming, so the word must mean scientific achievement.
试验/1 | 新药要先在病人身上试 | The new drug is being tested on patients, so the word must mean trial.
知识产权/1 | 随便复制别人的软件侵犯了 | Copying others' software at will violates it, so the word must mean intellectual property.
技术革新/1 | 工厂改进了技术效率提高 | After improving its technology the factory produces far more, so the word must mean technological innovation.
高科技/1 | 机器人和无人机这样的产品 | The company makes robots and drones, so the word must mean high technology.
前沿/1 | 科学研究最新最前面的地方 | Quantum computing is where research is newest, so the word must mean frontier.
仿生/1 | 模仿鱼的身体设计船 | Designing boats after the bodies of fish is an example, so the word must mean bionics.
科普/1 | 科学家写给孩子看的书 | The scientist often writes science books for children, so the word must mean popular science.
君主/1 | 古代统治国家的人，他的话就是法律 | In ancient times many countries were ruled by one person whose word was law, so the word must mean monarch.
天子/1 | 古人说皇帝的权力来自上天 | The ancients believed the emperor's power came from Heaven, so the word must mean Son of Heaven.
君权/1 | 皇帝一个人决定国家大事 | In ancient China the emperor alone could decide affairs of state, so the word must mean monarchical power.
朝廷/1 | 派他到南方做官 | After passing the exam he was sent south as an official, so the word must mean imperial court.
宫廷/1 | 电视剧讲皇宫里的生活 | The TV series shows life inside the palace, so the word must mean palace.
圣旨/1 | 官员们听人读皇帝的命令 | The officials stand and hear the emperor's order read out, so the word must mean imperial edict.
旨意/1 | 他按老板的意思推迟了会议 | He put off the meeting a week as his boss wished, so the word must mean wishes, instructions.
太子/1 | 老皇帝去世以后接着做皇帝 | When the old emperor died, his heir took the throne, so the word must mean crown prince.
御医/1 | 皇帝生病时请来的医生 | When the emperor fell ill, the palace sent for its doctor, so the word must mean imperial physician.
御花园/1 | 故宫北边有很多古老的树 | It lies north in the Forbidden City with many ancient trees, so the word must mean imperial garden.
大臣/1 | 每天早上和皇帝商量国家大事 | Every morning the emperor discussed affairs of state with them at court, so the word must mean minister.
臣子/1 | 古人认为应当对君主忠诚 | The ancients held that those serving a ruler should be loyal, so the word must mean official, subject.
臣民/1 | 国王命令全国的人都要交税 | The king ordered everyone in his realm to pay taxes, so the word must mean subjects.
宰相/1 | 地位只在皇帝一个人之下 | In ancient times this official ranked second only to the emperor, so the word must mean prime minister.
官吏/1 | 各地负责收税管理百姓 | They collected taxes and governed the people in each place, so the word must mean officials.
县官/1 | 管理一个县还要审案子 | Besides running a county he also tried cases, so the word must mean county magistrate.
进士/1 | 白居易二十多岁就考中了 | The Tang poet Bai Juyi passed the highest exam in his twenties, so the word must mean jinshi scholar.
举人/1 | 考上以后才能去京城考 | Under the Ming and Qing one needed this degree to sit the exam in the capital, so the word must mean juren scholar.
称臣/1 | 打了败仗只好向大国 | After losing the war the small state had to submit to the great one, so the word must mean to submit as a vassal.
臣服/1 | 周边小国都服从这个帝国 | Small neighbouring states all yielded to the powerful empire, so the word must mean to submit.
贵族/1 | 身份一代一代传下去 | In old Europe their rank passed down from generation to generation, so the word must mean nobility.
平民/1 | 没有特权，大多靠种地生活 | Ordinary people had no privileges and mostly lived by farming, so the word must mean commoner.
百姓/1 | 县官很关心他们的生活 | The magistrate cared about ordinary people's lives and was respected, so the word must mean common people.
诸侯/1 | 周朝把土地分给他们当国君 | The Zhou gave land to lords to rule as their own states, so the word must mean feudal princes.
爵位/1 | 贵族的可以传给儿子 | In Britain some nobles can pass it to their sons, so the word must mean title of nobility.
公爵/1 | 英国贵族里最高的一级 | It is the highest rank of the British nobility, so the word must mean duke.
侯爵/1 | 比公爵低一级 | Among European ranks it is one below duke, so the word must mean marquis.
封侯/1 | 将军立大功被君主 | Generals hoped great deeds would earn them a noble rank, so the word must mean to be made a marquis.
骑士/1 | 穿着铁衣服骑马打仗 | In medieval Europe they rode to battle in heavy armour, so the word must mean knight.
女王/1 | 她们自己统治国家 | Several women in British history ruled the country themselves, so the word must mean queen.
奴隶/1 | 可以被主人买卖，没有自由 | In ancient Rome they could be bought and sold and had no freedom, so the word must mean slave.
奴隶主/1 | 让奴隶干活却不给工钱 | They owned people and made them work without pay, so the word must mean slave owner.
奴隶社会/1 | 奴隶被当作财产的社会 | In such a society people were treated as property, so the word must mean slave society.
农奴/1 | 不能随便离开主人的土地 | In the Middle Ages they could not freely leave their lord's land, so the word must mean serf.
奴役/1 | 被别人控制，干活没有报酬 | People treated this way have no freedom and no pay, so the word must mean to enslave.
原始社会/1 | 用石头做工具，靠打猎生活 | People made tools of stone and lived by hunting and gathering, so the word must mean primitive society.
封建社会/1 | 土地属于地主，农民交很重的租 | Most land belonged to landlords and nobles and peasants paid heavy rent, so the word must mean feudal society.
封建/1 | 认为女孩子不用上学的老想法 | He actually thinks girls need no schooling, so the word must mean feudal.
部落/1 | 住在森林里靠打猎生活的一群人 | This group of people lives in the forest by hunting, so the word must mean tribe.
氏族/1 | 成员有共同的祖先 | Its members share an ancestor and live and work together, so the word must mean clan.
霸主/1 | 春秋时期最强大的诸侯国 | In the Spring and Autumn period several powerful states took turns leading the rest, so the word must mean overlord.
霸权/1 | 大国用力量控制别的国家 | Some great powers try to control other countries by force, so the word must mean hegemony.
称霸/1 | 球队连续五年拿第一 | The team has topped the national league five years running, so the word must mean to dominate.
霸道/1 | 总是逼别人听他的 | He always forces others to do what he says, so the word must mean overbearing.
城邦/1 | 雅典是古希腊最有名的一个 | Ancient Greece had many of them, Athens being the most famous, so the word must mean city-state.
联邦/1 | 美国和德国各州有自己的法律 | In America and Germany each state has its own laws, so the word must mean federation.
邦交/1 | 两国一九七二年建立的关系 | China and Japan established ties between their governments in 1972, so the word must mean diplomatic relations.
友邦/1 | 两国一直互相帮助 | The two countries have always helped each other, so the word must mean friendly nation.
王国/1 | 由一位国王统治 | Long ago a king ruled a small state here, so the word must mean kingdom.
帝国/1 | 古罗马统治地中海周围 | At its height ancient Rome ruled the lands around the Mediterranean, so the word must mean empire.
割让/1 | 战败以后把一部分土地给别国 | After losing the war the country had to give up part of its land, so the word must mean to cede.
割地/1 | 弱小的国家用土地求和 | Weak states could only buy peace with land and payments, so the word must mean to cede territory.
赔款/1 | 战败的一方要付的钱 | Under the treaty the losing side must pay a great sum, so the word must mean indemnity.
割据/1 | 地方军队首领不听朝廷命令 | Late in the Tang some regional commanders ruled their own areas and ignored the court, so the word must mean to set up a separatist rule.
分割/1 | 大河把城市分成两部分 | The great river cuts the city into north and south, so the word must mean to divide.
屈辱/1 | 被别国欺负的历史 | People have never forgotten the period when other countries bullied theirs, so the word must mean humiliation.
耻辱/1 | 考试作弊被发现 | Being caught cheating in an exam disgraces him, so the word must mean shame.
殖民地/1 | 非洲大部分地区成了欧洲的 | In the nineteenth century most of Africa was ruled by European countries, so the word must mean colony.
殖民/1 | 欧洲国家在世界各地占领土地 | After the fifteenth century some European countries began seizing lands abroad, so the word must mean to colonise.
侵略/1 | 人民团结起来抵抗外国 | The people united to resist the foreign attack, so the word must mean aggression.
战役/1 | 赤壁之战是有名的一场 | The Battle of Red Cliffs was a famous one of the Three Kingdoms, so the word must mean battle, campaign.
打仗/1 | 将军不仅要会这个 | Generals had to know how to wage war and also care for their soldiers, so the word must mean to fight a war.
胜仗/1 | 将军从来没有输过 | The general never lost, so the word must mean victory.
败仗/1 | 打输以后总结原因 | After losing, he carefully studied why, so the word must mean defeat.
兵役/1 | 成年男子必须服 | In some countries adult men must serve in the army, so the word must mean military service.
服役/1 | 船已经用了三十年快退役 | The ship has served thirty years and will soon be retired, so the word must mean to be in service.
劳役/1 | 修长城时百姓被叫去干活 | When the Great Wall was built, many commoners were called up for forced work, so the word must mean corvee labour.
舰队/1 | 明朝七次远航到非洲 | In the Ming a great group of ships sailed seven times as far as East Africa, so the word must mean fleet.
军舰/1 | 港口里停着灰色的 | Several grey navy ships lie in the harbour, so the word must mean warship.
航空母舰/1 | 上面可以停几十架飞机 | Dozens of aircraft can be parked on its deck, so the word must mean aircraft carrier.
颁布/1 | 国家发布了新的法律 | The state has issued a new law that takes effect next month, so the word must mean to promulgate.
颁发/1 | 学校给学生发奖状 | The school gave certificates to outstanding pupils, so the word must mean to award.
颁奖/1 | 比赛结束请市长上台 | After the contest the mayor was invited on stage to hand out prizes, so the word must mean to present awards.
变法/1 | 秦国通过改革变得强大 | In the Warring States period Qin grew stronger through reform, so the word must mean political reform.
宣言/1 | 北美十三个殖民地发表的独立 | In July 1776 thirteen North American colonies issued this about independence, so the word must mean declaration.
宗旨/1 | 组织是为了帮助孩子上学 | The organisation exists to help children in poor areas go to school, so the word must mean purpose.
主旨/1 | 用一句话说出文章的 | You are asked to state in one sentence what the article is mainly about, so the word must mean main idea.
起义/1 | 秦朝末年农民反抗朝廷 | At the end of the Qin many peasants rose against the court, so the word must mean uprising.
摄政/1 | 皇帝只有六岁，叔叔代替他 | The emperor is only six and his uncle rules for him, so the word must mean to act as regent.
复辟/1 | 清朝灭亡后有人想让皇帝回来 | After the Qing fell some people tried to bring the emperor back, so the word must mean restoration.
发掘/1 | 考古学家挖出了一座古墓 | Archaeologists dug up a tomb over two thousand years old here, so the word must mean to excavate.
古墓/1 | 农民种地时意外发现 | Farmers working the land found one by chance, so the word must mean ancient tomb.
兵马俑/1 | 西安的个个表情不同 | Each of the figures in Xi'an has a different face, so the word must mean terracotta warriors.
陶俑/1 | 汉代古墓里在跳舞弹琴的小人 | Small clay figures dancing and playing music came from a Han tomb, so the word must mean pottery figurine.
鼎/1 | 有三条腿的青铜器 | This bronze vessel in the museum has three legs and an inscription, so the word must mean ding cauldron.
铭文/1 | 青铜器上刻的字 | The words carved on the bronze record a war three thousand years ago, so the word must mean inscription.
铭刻/1 | 老师的话刻在我心里 | The teacher's words are carved in the speaker's heart, so the word must mean to engrave.
铭记/1 | 不忘历史珍惜和平 | We should never forget history and should treasure today's peace, so the word must mean to bear in mind.
拓片/1 | 把古碑上的字拓下来 | He took an ink copy of the characters on the old stone tablet, so the word must mean rubbing.
墓志铭/1 | 墓碑上介绍墓主人一生 | The words on the gravestone sum up the person's life, so the word must mean epitaph.
史书/1 | 古代记历史的书里有记载 | The event is clearly recorded in ancient books of history, so the word must mean history book.
史料/1 | 写书前查阅了大量 | He read a great many historical sources for the book, so the word must mean historical material.
史记/1 | 司马迁写的 | Sima Qian wrote it, covering history from the Yellow Emperor to Emperor Wu of Han, so the word must mean Records of the Grand Historian.
正史/1 | 官方的历史书里没有记载 | The official histories never mention him; the story lives only among the people, so the word must mean official history.
野史/1 | 民间的故事不一定是真的 | Its stories come from outside the official histories and may not be true, so the word must mean unofficial history.
编年/1 | 按年份记录的史书体例 | The Spring and Autumn Annals record Lu's history year by year, so the word must mean chronicle.
文献/1 | 论文后面列出参考 | A paper lists the works it consulted at the end, so the word must mean literature, documents.
记载/1 | 据史书桥建于一千多年前 | According to the history books the bridge was built over 1,400 years ago, so the word must mean record.
典籍/1 | 图书馆收藏的古代书 | The library holds a great many ancient books, so the word must mean classics.
史学家/1 | 司马迁是西汉著名的 | Sima Qian was a famous writer of history in the Western Han, so the word must mean historian.
公元/1 | 秦始皇统一中国是前二二一年 | The First Emperor unified China in 221 before this era began, so the word must mean the Common Era.
纪元/1 | 计算机开创了一个新 | The first electronic computer opened a new age, so the word must mean era.
年号/1 | 洪武是明朝第一位皇帝的 | Hongwu was what the first Ming emperor called his reign, so the word must mean reign title.
年间/1 | 寺庙建于明朝万历 | The temple was built during the Wanli reign of the Ming, so the word must mean period.
当代/1 | 现在最有名的作家之一 | He is one of today's most famous writers, so the word must mean contemporary.
盛世/1 | 唐朝前期国家强大社会安定 | The early Tang was strong and stable, so the word must mean prosperous age.
鼎盛/1 | 唐朝最强大的时候 | When the Tang was at its strongest, Chang'an was among the world's largest cities, so the word must mean at the height of.
春秋/1 | 孔子生活的时期 | Confucius lived in this period, so the word must mean Spring and Autumn period.
战国/1 | 七个大国最后被秦统一 | Seven great states fought in this period until Qin united them, so the word must mean Warring States.
三国/1 | 东汉以后三个国家争斗 | After the Eastern Han three states fought each other for decades, so the word must mean Three Kingdoms.
夏朝/1 | 中国历史上第一个朝代 | Ancient books say it was China's first dynasty, so the word must mean Xia dynasty.
商朝/1 | 甲骨文是这个朝代留下的 | Oracle bone script was left by this dynasty, so the word must mean Shang dynasty.
周朝/1 | 春秋时期属于这个朝代 | The Spring and Autumn period was part of this dynasty, so the word must mean Zhou dynasty.
宋朝/1 | 活字印刷术是这时发明的 | Movable type printing was invented then, so the word must mean Song dynasty.
元朝/1 | 蒙古族建立，首都在北京 | The Mongols founded it with its capital at today's Beijing, so the word must mean Yuan dynasty.
开国/1 | 汉朝的第一位皇帝 | The man who began the Han dynasty had been a minor official, so the word must mean to found a state.
改朝换代/1 | 一个朝代换成另一个 | Chinese history saw one dynasty replace another many times, so the word must mean change of dynasty.
在位/1 | 汉武帝做了五十四年皇帝 | Emperor Wu of Han ruled for fifty-four years, so the word must mean to reign.
继位/1 | 老国王去世大儿子当国王 | When the old king died his eldest son took the throne, so the word must mean to succeed.
登基/1 | 新皇帝那天全城庆祝 | The whole city celebrated the day the new emperor took the throne, so the word must mean to be enthroned.
姓氏/1 | 王、李、张最常见 | Wang, Li and Zhang are the commonest ones in China, so the word must mean surname.
宗族/1 | 一个村子的人属于同一个 | In old villages everyone often belonged to the same lineage, so the word must mean clan.
宗祠/1 | 春节村里人去祭拜祖先 | At Spring Festival the villagers honour their ancestors there, so the word must mean ancestral hall.
祠堂/1 | 为纪念清官修的 | People built it in memory of an honest official, so the word must mean memorial temple.
祭祀/1 | 皇帝举行仪式敬上天 | Every year ancient emperors held rites to honour Heaven, so the word must mean to offer sacrifices.
追溯/1 | 节日的来历可以往前找到 | The festival's origins go back over two thousand years, so the word must mean to trace back.
回溯/1 | 回头看过去十年 | Looking back over the last ten years, the city has changed a great deal, so the word must mean to look back.
诞生/1 | 第一台电子计算机一九四六年 | The world's first electronic computer came into being in 1946, so the word must mean to be born.
家谱/1 | 他家住了三百多年的记录 | It shows his family has lived here over three hundred years, so the word must mean family tree.
祖籍/1 | 出生在上海，祖上在广东 | He was born in Shanghai, but his family originally came from Guangdong, so the word must mean ancestral home.
古希腊/1 | 很多西方哲学思想起源于 | Much Western philosophy began there, so the word must mean ancient Greece.
古罗马/1 | 修了很多又长又直的大路 | Its people built long straight roads, some still visible today, so the word must mean ancient Rome.
金字塔/1 | 巨大石块建成，像汉字“金” | It is built of huge stones and shaped like the character 金, so the word must mean pyramid.
两河流域/1 | 把字刻在泥板上 | People there invented one of the earliest scripts, pressed into clay tablets, so the word must mean Mesopotamia.
古印度/1 | 佛教起源于 | Buddhism began there, so the word must mean ancient India.
中世纪/1 | 欧洲大教堂花一百多年建成 | In Europe in this period many cathedrals took over a century to build, so the word must mean the Middle Ages.
文艺复兴/1 | 意大利出现了许多伟大的画家 | Italy produced many great painters then, so the word must mean the Renaissance.
新大陆/1 | 欧洲人把美洲叫做 | After 1492 Europeans called the Americas this, so the word must mean New World.
工业革命/1 | 机器代替了手工劳动 | After it, machines in factories replaced much handwork, so the word must mean Industrial Revolution.
世界大战/1 | 二十世纪发生过两次 | The twentieth century saw two of them, so the word must mean world war.
疆域/1 | 元朝的比今天的中国还大 | The Yuan held more land than China does today, so the word must mean territory.
版图/1 | 帝国的扩大了很多 | After years of war the empire's lands grew greatly, so the word must mean domain.
扩张/1 | 公司几年内发展到全国 | The company grew fast and spread across the country in a few years, so the word must mean to expand.
远征/1 | 亚历山大带军队到了印度 | Alexander led his army as far as India, so the word must mean expedition.
开拓/1 | 汉朝开出通往西方的道路 | The Han sent envoys to the Western Regions and opened the road west, so the word must mean to open up.
拓展/1 | 多读书能让视野更宽 | Reading more broadens our view, so the word must mean to expand.
拓宽/1 | 马路正在变宽 | The road is being made wide enough for four lanes, so the word must mean to widen.
拓荒/1 | 早年来的人把荒地变成农田 | The first settlers turned waste land into fields, so the word must mean to open up wasteland.
抵御/1 | 修长城挡住北方的进攻 | The ancients built the Great Wall to hold off attacks from the north, so the word must mean to resist.
防御/1 | 城墙又高又结实 | The city walls are high and strong, so the word must mean defence.
鼎力/1 | 感谢朋友大力相助 | The speaker thanks friends for their strong support, so the word must mean wholehearted help.
大名鼎鼎/1 | 很多人都读过他的书 | Many people have read the scientist's books, so the word must mean famous.
三足鼎立/1 | 三家大公司谁也压不倒谁 | Three big companies hold the market and none can beat the others, so the word must mean three-way balance.
主宰/1 | 做自己命运的 | We should strive to be in charge of our own fate, so the word must mean master.
依仗/1 | 靠父亲的权力不把人放在眼里 | Leaning on his father's power, he looks down on everyone at the company, so the word must mean to rely on.
仗着/1 | 自己个子高抢别人东西 | He often grabs others' things because he is tall, so the word must mean relying on.
荒诞/1 | 猫怎么可能会说话 | The story asks how a cat could possibly talk, so the word must mean absurd.
圣诞节/1 | 十二月二十五日 | It falls on 25 December and is a holiday in many Western countries, so the word must mean Christmas.
诸位/1 | 来宾，欢迎大家 | The host welcomes all the guests, so the word must mean everyone.
座右铭/1 | 活到老，学到老 | The line he lives by is to keep learning until old age, so the word must mean motto.
诸子百家/1 | 春秋战国时各种思想争论 | In the Spring and Autumn and Warring States periods many schools of thought debated, so the word must mean Hundred Schools of Thought.
老子/1 | 相传写了“道德经” | Tradition says he wrote the Daodejing, so the word must mean Laozi.
庄子/1 | 在桥上争论鱼快乐不快乐 | He once argued with a friend on a bridge about whether fish are happy, so the word must mean Zhuangzi.
墨子/1 | 主张“兼爱” | He taught universal love, caring for all people alike, so the word must mean Mozi.
墨家/1 | 反对战争主张节约 | This school opposed war and urged thrift, so the word must mean Mohism.
法家/1 | 秦国用严格的法律管理国家 | Qin relied on this school and governed by strict law, so the word must mean Legalism.
中庸/1 | 做事不能太过分也不能不够 | Confucians teach that one should do neither too much nor too little, so the word must mean the doctrine of the mean.
无为/1 | 道家认为应该顺应自然 | Daoists hold that government should go along with nature, so the word must mean non-action.
仁爱/1 | 孔子要求人们关心别人 | Confucius asked people to care for others, so the word must mean benevolence.
仁义/1 | 从不做对不起朋友的事 | He never wrongs a friend, so the word must mean righteousness.
哲学家/1 | 亚里士多德是古希腊著名的 | Aristotle was a famous thinker of ancient Greece, so the word must mean philosopher.
悖论/1 | “我说的这句话是假话” | The sentence "what I say is false" is a famous one, so the word must mean paradox.
诡辩/1 | 听起来有道理其实不对 | His words sound reasonable but are really trickery, so the word must mean sophistry.
辩证法/1 | 事物总是在变化发展 | It holds that things always change and develop, so the word must mean dialectics.
范畴/1 | 不属于数学而属于哲学 | The question belongs to philosophy, not mathematics, so the word must mean category.
唯物主义/1 | 世界是由物质构成的 | It holds that the world is made of matter, so the word must mean materialism.
唯心主义/1 | 意识比物质更根本 | It holds that mind is more basic than matter, so the word must mean idealism.
伦理学/1 | 研究善恶，人应该怎样做 | It studies good and evil and how people should act, so the word must mean ethics.
神学/1 | 研究基督教的道理 | Many medieval European universities studied Christian doctrine, so the word must mean theology.
并行不悖/1 | 发展经济和保护环境可以 | Economic growth and protecting the environment can go together, so the word must mean not mutually exclusive.
伦理/1 | 用动物做实验引起的讨论 | Experiments on animals have raised questions of right and wrong, so the word must mean ethics.
人伦/1 | 孝顺父母最重要 | The ancients held that serving one's parents mattered most among human ties, so the word must mean human relationships.
天伦之乐/1 | 春节一家人团聚老人享受 | At Spring Festival the family gathers and the old people are happy, so the word must mean family joy.
宽恕/1 | 他道歉以后朋友原谅了 | He apologised sincerely and his friend let it go, so the word must mean to forgive.
忠恕/1 | 孔子的道理两个字概括 | A disciple of Confucius summed up the teaching in two words, so the word must mean loyalty and consideration.
良知/1 | 不会做伤害别人的事 | Someone with it will not hurt others, so the word must mean conscience.
善意/1 | 他这样说是出于好心 | He said it meaning well and should not be misunderstood, so the word must mean goodwill.
恶意/1 | 这是意外，他不是故意的 | It was an accident and he did not mean harm, so the word must mean malice.
罪恶/1 | 贪心被看作根源之一 | Many religions see greed as a root of wrongdoing, so the word must mean evil, sin.
邪恶/1 | 童话里的坏人很 | The villains in fairy tales are always beaten in the end, so the word must mean wicked.
欲望/1 | 人的没有止境要学会控制 | What people want has no end and must be controlled, so the word must mean desire.
食欲/1 | 他生病了，不想吃东西 | He is ill and does not want to eat, so the word must mean appetite.
求知欲/1 | 孩子什么都想知道 | The child wants to know about everything, so the word must mean curiosity.
贪欲/1 | 他被贪心害了 | His greed ruined him and he lost everything, so the word must mean greed.
随心所欲/1 | 自由不是想干什么就干什么 | Freedom does not mean doing whatever you like; rules still apply, so the word must mean to do as one pleases.
欲罢不能/1 | 小说太好看停不下来 | The novel is too good for the speaker to put down, so the word must mean unable to stop.
欲速则不达/1 | 学语言要一步一步来 | Language learning must go step by step, so the word must mean more haste, less speed.
戒备/1 | 对陌生人很小心不说地址 | He is careful with strangers and does not give out his address, so the word must mean wariness.
戒心/1 | 刚认识时她对我有一点 | When they first met she was a little guarded with the speaker, so the word must mean wariness.
警戒/1 | 台风快来了，海边进入状态 | A typhoon is coming and the coast is on watch, so the word must mean alert.
谦逊/1 | 取得很大成就却不骄傲 | He has achieved a great deal yet never boasts, so the word must mean modest.
逊色/1 | 新电影比第一部差 | The new film is much worse than the first, so the word must mean inferior.
出言不逊/1 | 在会上说话得罪了很多人 | What he said at the meeting offended many people, so the word must mean to speak rudely.
狂妄/1 | 赢了一场就说自己世界第一 | He won one match and boasted that he is the best in the world, so the word must mean arrogant.
妄想/1 | 不努力就想考第一 | Wanting to come first without studying is a vain hope, so the word must mean wishful thinking.
胆大妄为/1 | 小偷白天就敢进屋 | The thief dares to break in in broad daylight, so the word must mean reckless.
虚妄/1 | 追求的名利都是假的 | He later found that the fame and wealth he had chased were empty, so the word must mean illusory.
唯我独尊/1 | 从来不听别人的意见 | He never listens to anyone else's view, so the word must mean to think oneself above all.
唯唯诺诺/1 | 在老板面前不敢说想法 | In front of his boss he never dares say what he thinks, so the word must mean submissive.
唯命是从/1 | 不能别人说什么就做什么 | We must judge for ourselves and not just do whatever others say, so the word must mean to obey blindly.
唯一/1 | 班里只有他会说法语 | No one else in the class speaks French, so the word must mean only.
唯有/1 | 坚持下去才能成功 | The second half begins with 才能 and the first names the one condition for success, so the word must mean only.
唯独/1 | 大家都来了，只有他没来 | Everyone came except him, so the word must mean only, alone.
唯利是图/1 | 公司只想赚钱质量很差 | The company cares about nothing but money and sells poor goods, so the word must mean profit-seeking.
诡计/1 | 坏人想出的主意被识破 | The villain's scheme was seen through by a clever girl, so the word must mean trick.
诡异/1 | 半夜空房子里的声音 | Strange sounds came from the empty house at midnight, so the word must mean eerie.
邪门/1 | 手机刚放下就不见了 | The phone just put on the table has vanished, so the word must mean weird.
歪门邪道/1 | 成功靠努力，不能走 | Success comes from hard work, and 不能走 rules out dishonest routes, so the word must mean crooked ways.
无与伦比/1 | 山顶日出的美 | Nothing compares with the sunrise seen from the summit, so the word must mean incomparable.
妄言/1 | 没调查清楚不要乱说 | Nothing has been investigated yet and no one should speak carelessly, so the word must mean to speak rashly.
崇拜/1 | 古代很多民族把太阳当神 | Many ancient peoples treated the sun as a god, so the word must mean to worship.
崇高/1 | 教师是这样的职业 | Teaching is praised as a noble calling, so the word must mean lofty.
崇尚/1 | 这个民族看重勤劳和节俭 | This people values hard work and thrift, so the word must mean to uphold.
推崇/1 | 他的书受到很多学者的 | Many scholars hold his books in high regard, so the word must mean to esteem.
尊崇/1 | 孔子一直受到人们的 | Confucius has always been honoured through Chinese history, so the word must mean to revere.
崇敬/1 | 人们怀着这种心情来到纪念馆 | People come to the memorial hall full of deep respect, so the word must mean veneration.
虔诚/1 | 每天都要祷告的信徒 | The believer prays every day, so the word must mean devout.
信徒/1 | 每天很多人来寺庙烧香 | Many people come to burn incense at the temple every day, so the word must mean believer.
教徒/1 | 他是一名虔诚的佛 | He is a devout follower of Buddhism, so the word must mean adherent.
佛经/1 | 僧人从印度带回来翻译 | Many Tang monks translated Buddhist scriptures from India into Chinese, so the word must mean sutra.
祈祷/1 | 每个星期天去教堂 | Every Sunday he goes to church, so the word must mean to pray.
祷告/1 | 吃饭以前一家人先低头 | The family bow their heads before eating, so the word must mean to pray.
祈求/1 | 农民希望风调雨顺 | The farmers hope for good weather this year, so the word must mean to pray for.
祈福/1 | 春节去寺庙为家人 | At Spring Festival many people visit temples for their families, so the word must mean to pray for good fortune.
道教/1 | 中国本土的宗教，尊老子为祖师 | It began in China and honours Laozi as its founder, so the word must mean Taoism.
基督教/1 | 圣诞节是它最重要的节日之一 | Christmas is one of its most important festivals, so the word must mean Christianity.
天主教/1 | 最高领导人是罗马的教皇 | Its highest leader is the Pope in Rome, so the word must mean Catholicism.
伊斯兰教/1 | 产生于七世纪的亚洲西部 | It arose in western Asia in the seventh century, so the word must mean Islam.
圣经/1 | 由旧约和新约组成 | It is made up of the Old and New Testaments, so the word must mean the Bible.
教堂/1 | 有五百多年历史的 | This place of Christian worship is over five hundred years old, so the word must mean church.
僧人/1 | 寺庙里住着几十位 | Dozens of them live in the temple, so the word must mean monk.
高僧/1 | 唐朝到印度取经 | In the Tang a great monk went to India and brought back many sutras, so the word must mean eminent monk.
尼姑/1 | 小庙里没有和尚 | There are no monks in the little temple, so the word must mean nun.
禅宗/1 | 在中国发展后来传到日本 | It developed in China and later spread to Japan, so the word must mean Chan Buddhism.
坐禅/1 | 和尚每天早上静坐一小时 | The monks sit still for an hour every morning, so the word must mean to meditate.
禅师/1 | 说话很少但很有道理 | The old master says little but every word is wise, so the word must mean Zen master.
寺院/1 | 山上一千年历史的 | It stands on the mountain and is a thousand years old, so the word must mean monastery.
出家/1 | 他二十岁当了和尚 | At twenty he left home to become a monk, so the word must mean to become a monk.
修行/1 | 在山里小庙住了很多年 | He spent many years practising his faith in a small mountain temple, so the word must mean to practise religion.
念经/1 | 寺庙里传来的声音 | The sound of monks chanting comes from the temple, so the word must mean to chant sutras.
灵魂/1 | 很多宗教认为人死后还存在 | Many religions hold that something of a person lives on after death, so the word must mean soul.
魂魄/1 | 古人认为人死后会离开身体 | The ancients believed it left the body at death, so the word must mean soul, spirit.
鬼魂/1 | 老房子里其实只是风声 | The story says the old house is haunted, but it is only the wind, so the word must mean ghost.
鬼神/1 | 孔子说要尊敬但要远离 | Confucius said to respect them but keep one's distance, so the word must mean ghosts and gods.
天堂/1 | 对喜欢看书的人，图书馆就是 | For a book lover the library is paradise, so the word must mean heaven.
地狱/1 | 这么热的天干活 | Working in such heat feels like torment, so the word must mean hell.
轮回/1 | 佛教说人死后重新出生 | Buddhism holds that after death people are born again, so the word must mean reincarnation.
来世/1 | 死后再出生开始的生活 | He believes people are reborn and begin another existence, so the word must mean next life.
前世/1 | 一见如故是因为有缘 | Some say people who click at once were bound in an earlier existence, so the word must mean previous life.
永恒/1 | 世界上没有不变的东西 | Nothing in the world stays unchanged forever, so the word must mean eternal.
神仙/1 | 真想住在这儿像他们一样 | The scenery is lovely enough that the speaker wishes to live here like an immortal, so the word must mean immortal.
仙人/1 | 传说山上活了一千岁 | Legend says someone on this mountain has lived a thousand years, so the word must mean immortal.
仙女/1 | 穿着白裙子很美 | In her long white dress she is as lovely as a fairy, so the word must mean fairy.
八仙/1 | 过海，各显神通 | The famous saying is about them crossing the sea, each showing his powers, so the word must mean Eight Immortals.
仙境/1 | 雾中的山林很美 | The misty mountain forest is magically beautiful, so the word must mean fairyland.
魔鬼/1 | 变成老人去骗人 | In the story it turns into an old man to trick people, so the word must mean devil.
鬼怪/1 | 小时候很怕听这样的故事 | As a child he was scared of such stories, so the word must mean ghosts and monsters.
神灵/1 | 古人遇到旱灾向他们求雨 | In drought the ancients prayed to them for rain, so the word must mean deity.
天神/1 | 宙斯是众神的首领 | The Greeks held Zeus to be the leader of the gods, so the word must mean god.
上帝/1 | 基督教徒相信他创造了世界 | Christians believe the world was created by him, so the word must mean God.
占卜/1 | 商朝人用骨头 | The Shang used bones to tell the future and carved the results on them, so the word must mean to divine.
算命/1 | 有人相信但没有科学根据 | Some people believe in it though it has no scientific basis, so the word must mean to tell fortunes.
看相/1 | 看一眼你的脸就知道将来 | The man claims he can tell your future from your face, so the word must mean to read faces.
风水/1 | 建房子以前请人看 | Some people have the site judged before building a house, so the word must mean feng shui.
预兆/1 | 黑云是要下雨的 | Dark clouds show rain is coming, so the word must mean omen.
征兆/1 | 经常头疼可能是生病的 | Frequent headaches may point to illness, so the word must mean sign.
兆头/1 | 一出门遇到老朋友 | Meeting an old friend as soon as you go out seems lucky, so the word must mean omen.
吉兆/1 | 古人把彩云看作 | The ancients saw coloured clouds as a sign of good things, so the word must mean good omen.
凶兆/1 | 古人把日食看作 | The ancients thought an eclipse foretold disaster, so the word must mean ill omen.
吉凶/1 | 做大事以前先问一问 | Before big undertakings the ancients asked whether things would go well or badly, so the word must mean fortune.
灾祸/1 | 小烟头引起的大火 | A cigarette end started the great fire, so the word must mean disaster.
祸害/1 | 老鼠在田里损害庄稼 | The rats are ruining the crops in the fields, so the word must mean to damage.
祸福/1 | 好事坏事可以互相转化 | The ancients said good and bad turn into each other, so the word must mean fortune and misfortune.
祸不单行/1 | 丢了钱包又摔伤腿 | He lost his wallet and then hurt his leg, so the word must mean troubles never come singly.
因祸得福/1 | 没考上却找到喜欢的专业 | Failing to get into that university led him to a subject he loves, so the word must mean to profit from misfortune.
凶多吉少/1 | 大风浪里的小船恐怕 | A small boat in such a storm is in grave danger, so the word must mean more bad than good.
忌讳/1 | 送礼时不送钟 | In China one does not give a clock as a present, so the word must mean taboo.
讳言/1 | 不可不说存在的问题 | We must not hide the fact that our work still has many problems, so the word must mean to avoid mentioning.
讳疾忌医/1 | 有了错误不能不改 | Mistakes must be corrected, not hidden like an illness kept from the doctor, so the word must mean to hide one's illness.
直言不讳/1 | 对文章坦率提出批评 | He criticised the speaker's essay frankly, so the word must mean to speak bluntly.
魄力/1 | 新校长一上任就改革 | The new principal launched reforms the moment he arrived, so the word must mean boldness.
气魄/1 | 长城非常雄伟 | The Great Wall is magnificent, so the word must mean grandeur.
体魄/1 | 经常锻炼身体健康 | Regular exercise makes the body strong, so the word must mean physique.
失魂落魄/1 | 丢了文件整个下午都 | He lost an important document and was beside himself all afternoon, so the word must mean distraught.
魂不守舍/1 | 上课没听见老师的问题 | He was distracted in class and did not hear the teacher's questions, so the word must mean absent-minded.
惊心动魄/1 | 最后一秒才分出胜负 | The match was decided only in the last second, so the word must mean thrilling.
胆小鬼/1 | 别害怕，勇敢上台 | The speaker urges someone not to be afraid but to go on stage bravely, so the word must mean coward.
机灵鬼/1 | 一下子就猜出了答案 | The little one guessed the answer at once, so the word must mean clever kid.
鬼脸/1 | 对着镜子逗笑大家 | Little brother pulled a face in the mirror and made everyone laugh, so the word must mean grimace.
戒烟/1 | 爸爸为了健康不再抽烟 | For his health Dad has decided to stop smoking, so the word must mean to quit smoking.
戒律/1 | 寺院规定和尚不吃肉 | Under the temple's rules the monks eat no meat, so the word must mean precepts.
供奉/1 | 庙里放着佛像让人拜 | A great statue of the Buddha stands in the temple for worship, so the word must mean to enshrine.
香火/1 | 寺庙每天有很多人来 | Crowds come to the temple every day, so the word must mean incense offerings.
朝拜/1 | 佛教徒每年到名山 | Every year many Buddhists travel to this famous mountain, so the word must mean to make a pilgrimage.
灵验/1 | 求什么就能得到什么 | People say prayers here always come true, though it is only legend, so the word must mean efficacious.
禅意/1 | 小院子很安静 | The little courtyard is very quiet, so the word must mean Zen spirit.
修养/1 | 从来不对别人发脾气 | He never loses his temper with anyone, so the word must mean cultivation.
天命/1 | 皇帝说自己受了上天的命令 | Ancient emperors claimed Heaven had given them the right to rule, so the word must mean mandate of Heaven.
因果/1 | 两件事之间没有关系 | The two events are not connected, so the word must mean cause and effect.
报应/1 | 做了坏事总会得到 | Buddhism holds that wrongdoing is always paid back, so the word must mean retribution.
占有/1 | 公司拥有全国一半的市场 | The company holds half the national market, so the word must mean to occupy.
占领/1 | 军队在城墙上插上旗 | The army planted its flag on the city wall after taking the city, so the word must mean to capture.
占据/1 | 这个问题一直在他心里 | The question has filled his mind and he cannot sleep, so the word must mean to occupy.
占用/1 | 对不起用了你这么多时间 | The speaker apologises for taking up a lot of your time, so the word must mean to take up.
占线/1 | 打了好几次电话 | The speaker phoned several times and could not get through, so the word must mean busy line.
占便宜/1 | 跟朋友吃饭从来不付钱 | He never pays when he eats with friends, so the word must mean to take advantage.
戒指/1 | 手上戴着一个金 | She wears a gold one on her finger, so the word must mean ring.
兰花/1 | 香味很淡，古代文人喜欢 | Its scent is faint and many ancient scholars loved it, so the word must mean orchid.
尼龙/1 | 雨衣又轻又结实 | The raincoat is light and strong, so the word must mean nylon.
仙人掌/1 | 在沙漠里也能生长 | It survives drought and grows even in the desert, so the word must mean cactus.
吟诵/1 | 老先生摇着头慢慢读唐诗 | The old gentleman sways his head as he slowly chants a Tang poem, so the word must mean to chant.
吟咏/1 | 古代诗人写山水 | Ancient poets sang of mountains and rivers in many fine poems, so the word must mean to recite poetry.
沉吟/1 | 他想了一会儿才回答 | He thought for a while before answering, so the word must mean to mutter, ponder.
歌咏/1 | 每个班都唱两首歌的比赛 | Every class sings two songs in the yearly contest, so the word must mean singing.
颂歌/1 | 献给母亲的诗 | The poem is dedicated to the poet's mother in praise, so the word must mean ode.
歌颂/1 | 诗赞美劳动人民 | The poem praises the hard work of working people, so the word must mean to sing the praises of.
称颂/1 | 好事受到全村人的 | The whole village praised his good deed, so the word must mean to praise.
朗诵/1 | 晚会上大声读自己写的诗 | At the party she read aloud a poem of her own, so the word must mean to recite.
诗篇/1 | 李白留下的优美作品 | Li Bai left many beautiful works of verse, so the word must mean poems.
诗经/1 | 中国最早的诗歌总集 | It is China's earliest collection of poems, with over three hundred, so the word must mean Book of Songs.
韵律/1 | 诗读起来像音乐 | The poem reads like music, so the word must mean rhythm.
韵脚/1 | 每两句最后一个字读音相近 | The last character of every second line sounds alike, so the word must mean rhyme.
押韵/1 | 儿歌很容易记住 | Children's songs are easy to remember, so the word must mean to rhyme.
韵味/1 | 老歌越听越有 | The old song grows more charming the more you hear it, so the word must mean lingering charm.
音韵/1 | 研究古代汉字读音的学问 | It is the study of how ancient characters were pronounced, so the word must mean phonology.
格律诗/1 | 写的时候要遵守很多规则 | Writing it means following many rules, such as equal line lengths, so the word must mean metrical poetry.
律诗/1 | 一首有八句 | It has eight lines of five or seven characters each, so the word must mean regulated verse.
绝句/1 | 只有四句，比律诗短一半 | It has only four lines, half the length of a regulated poem, so the word must mean quatrain.
对仗/1 | 律诗中间两联要求 | The middle two couplets of a regulated poem must match each other, so the word must mean antithesis.
对偶/1 | 海内存知己，天涯若比邻 | The line pairs matching halves word for word, so the word must mean parallelism.
婉约/1 | 李清照是这一派的代表 | Li Qingzhao led the graceful school of Song ci poets, so the word must mean graceful.
委婉/1 | 他拒绝朋友时说得很客气 | He turned down his friend's request politely and indirectly, so the word must mean tactful.
婉言/1 | 她客气地谢绝了好意 | She politely declined everyone's kind offer, so the word must mean tactful words.
婉转/1 | 歌声像小鸟在唱 | Her voice is like a little bird singing, so the word must mean melodious.
风格/1 | 一看就知道是他画的 | His paintings are recognisable at a glance, so the word must mean style.
流派/1 | 中国画每个都有自己的特点 | Chinese painting has many schools, each with its own features, so the word must mean school.
浪漫主义/1 | 李白的诗充满了这种色彩 | Li Bai's poems are full of imagination and feeling, so the word must mean romanticism.
现实主义/1 | 杜甫写出了百姓的苦难 | Du Fu's poems truly show the people's suffering, so the word must mean realism.
笔调/1 | 散文用轻松的方式写童年 | The essay tells of the author's childhood in a light manner, so the word must mean tone.
文采/1 | 写的信都像散文一样美 | Even his letters read like fine prose, so the word must mean literary flair.
朦胧/1 | 月光下远处的山 | In the moonlight the distant mountains look blurred, so the word must mean hazy.
朦胧诗/1 | 二十世纪七八十年代流行的新诗 | It was a new kind of poetry popular in the 1970s and 1980s, so the word must mean Misty Poetry.
意象/1 | 月亮在古诗里表达思乡 | In classical Chinese poems the moon often stands for homesickness, so the word must mean image.
意境/1 | 读了好像身在画中 | Reading the poem makes you feel you are inside a painting, so the word must mean artistic conception.
蕴含/1 | 简单故事里有深刻的道理 | The simple story holds a deep lesson, so the word must mean to contain.
蕴藏/1 | 土地下面有丰富的石油 | Rich oil lies beneath this land, so the word must mean to hold in store.
底蕴/1 | 古城有很深的文化 | The ancient city has deep cultural roots, so the word must mean heritage.
意蕴/1 | 小诗简单但含义丰富 | The little poem reads simply but means a great deal, so the word must mean implication.
含蓄/1 | 古诗写感情不直接说 | Classical poems often express feeling without saying it outright, so the word must mean subtle.
余味/1 | 文章读完以后无穷 | After you finish the essay it stays with you, so the word must mean aftertaste.
之乎者也/1 | 说话文绉绉大家听不懂 | He always talks in such old-fashioned words that no one understands, so the word must mean pedantic language.
岂有此理/1 | 借书不还还说是我的错 | He kept the speaker's book and then blamed the speaker, so the word must mean preposterous.
岂能/1 | 大家都在工作我怎么能休息 | Everyone else is working and the speaker asks how they could rest alone, so the word must mean how could.
乃至/1 | 对中国甚至整个世界 | The discovery matters for China and beyond, for the whole world, so the word must mean and even.
乃是/1 | 诚实是做人的根本 | Honesty is the foundation of being a good person, so the word must mean is.
吾辈/1 | 保护传统文化是我们的责任 | Protecting traditional culture is the duty of people like us, so the word must mean we, our generation.
亦步亦趋/1 | 学写作不能完全照着名家 | Learning to write should not mean copying famous authors step by step, so the word must mean to imitate slavishly.
知己知彼/1 | 才能百战百胜 | The saying ends with winning every battle, so the word must mean know oneself and the enemy.
此起彼伏/1 | 观众的欢呼声 | Cheers rise from one part of the crowd after another, so the word must mean to rise one after another.
彼此/1 | 老朋友都很了解 | Old friends of many years know each other well, so the word must mean each other.
辛苦/1 | 妈妈每天工作很累 | Mum works very hard every day, so the word must mean hard.
辛勤/1 | 农民的劳动换来丰收 | The farmers' hard work brought a good harvest, so the word must mean industrious.
辛酸/1 | 小说写出普通家庭生活的 | The novel shows the hardships of an ordinary family, so the word must mean bitterness.
辛辣/1 | 鲁迅用这样的语言批评 | Lu Xun's essays attack social ills in sharp language, so the word must mean pungent.
苏醒/1 | 大地从冬天的沉睡中 | In spring the land wakes from its winter sleep, so the word must mean to wake up.
复苏/1 | 经济开始恢复 | The economy is picking up and factories are busy again, so the word must mean to recover.
深渊/1 | 悬崖下面万丈 | Below the cliff the drop is bottomless, so the word must mean abyss.
渊博/1 | 教授什么问题都能回答 | The professor can answer any question, so the word must mean erudite.
渊源/1 | 两个家族之间历史很深 | The two families share a long history, so the word must mean origin.
柳树/1 | 河边春风里枝条摆动 | Trees by the river wave their branches in the spring breeze, so the word must mean willow.
撰写/1 | 他花了三年写这本书 | He spent three years producing the text of this book, so the word must mean to write.
撰稿/1 | 杂志的特约人 | She contributes articles to the magazine by arrangement, so the word must mean to write for publication.
编撰/1 | 五十多位专家共同编词典 | Over fifty experts put the dictionary together, so the word must mean to compile.
构思/1 | 写作文前先想好结构 | Before writing an essay you should plan its structure, so the word must mean to conceive.
立意/1 | 作文的中心思想很新 | The essay's central idea is fresh, and the teacher gave it a high mark, so the word must mean main idea.
素材/1 | 生活小事可以成为写作的 | Small everyday events can all feed your writing, so the word must mean source material.
初稿/1 | 一个星期写完，又改一个月 | He finished it in a week and then spent a month revising, so the word must mean first draft.
定稿/1 | 多次修改终于完成 | After many revisions the book is at last finished, so the word must mean final draft.
誊写/1 | 把作文工工整整地抄一遍 | He copied out his corrected essay neatly, so the word must mean to make a fair copy.
润色/1 | 文章再修饰一下更好 | The essay is good and would be better with a little more touching up, so the word must mean to polish.
临摹/1 | 学书法先照着古人的字写 | Calligraphy learners first copy the writing of ancient masters, so the word must mean to copy.
描摹/1 | 文字写出江南的春天 | The author paints spring south of the Yangtze in beautiful words, so the word must mean to depict.
摹写/1 | 薄纸放在字上照着写 | Pupils lay thin paper over the characters and trace them, so the word must mean to trace.
誊抄/1 | 古时候书要靠人一本本抄 | Before printing, books had to be copied by hand one by one, so the word must mean to copy out.
眉批/1 | 在书页上方写 | He likes writing notes at the top of the page as he reads, so the word must mean top-margin note.
批注/1 | 旧书里有很多前人的 | The old book is full of earlier readers' notes, so the word must mean annotation.
圈点/1 | 读到好句子用笔画出来 | He marks good sentences with his pen as he reads, so the word must mean to mark.
评点/1 | 清代学者评论“红楼梦” | Many Qing scholars wrote comments on Dream of the Red Chamber, so the word must mean to comment on.
注释/1 | 古文书每页下面帮助理解 | The bottom of each page explains the classical text to readers, so the word must mean note.
校对/1 | 书出版以前要认真检查 | A book is carefully checked for errors before publication, so the word must mean to proofread.
序言/1 | 著名作家写的开头 | A famous writer wrote the opening of this book, so the word must mean preface.
前言/1 | 教材开头说明编写目的 | At the start of the textbook it explains why the book was written, so the word must mean foreword.
后记/1 | 作者在书最后感谢别人 | At the end of the book the author thanks those who helped, so the word must mean afterword.
目录/1 | 看看就知道书有哪些内容 | A glance at it shows what the book contains, so the word must mean table of contents.
篇章/1 | 登上月球开启了新的 | Landing on the moon opened a new stage in exploring space, so the word must mean chapter.
段落/1 | 文章分为五个 | The essay is divided into five of them, so the word must mean paragraph.
结尾/1 | 故事的结束出人意料 | The story finishes in a way no one expected, so the word must mean ending.
篇幅/1 | 文章不长但内容丰富 | The essay is short but rich in content, so the word must mean length.
书名/1 | 这本书的只有两个字 | This book's is only two characters, so the word must mean book title.
全集/1 | 鲁迅所有的作品 | He has read every work Lu Xun wrote, in many volumes, so the word must mean complete works.
文体/1 | 诗歌、小说、散文、戏剧 | Poetry, fiction, prose and drama are the four main kinds of literature, so the word must mean genre.
体裁/1 | 作文可以写成诗也可以写成故事 | The essay may be written as a poem or as a story, so the word must mean genre, form.
记叙文/1 | 写清时间、地点、人物和经过 | It must make clear the time, place, people and events, so the word must mean narrative essay.
议论文/1 | 要有明确的观点和理由 | It needs a clear view and solid reasons, so the word must mean argumentative essay.
说明文/1 | 介绍熊猫的生活习惯 | The piece explains how pandas live, so the word must mean expository essay.
应用文/1 | 通知、请假条都属于 | Notices and leave requests are of this kind, so the word must mean practical writing.
散文诗/1 | 不押韵，形式像散文内容像诗 | It does not rhyme and looks like prose but reads like poetry, so the word must mean prose poem.
小品文/1 | 五十篇很短的文章 | The book collects fifty very short pieces, so the word must mean short essay.
报告文学/1 | 真实记录科学家工作 | The work truthfully records the scientists' story, so the word must mean reportage.
叙事诗/1 | “木兰诗”讲了一个故事 | The Ballad of Mulan tells a whole story in verse, so the word must mean narrative poem.
伏笔/1 | 第一章埋下最后揭开 | The author planted a hint in chapter one and revealed it only at the end, so the word must mean foreshadowing.
衬托/1 | 绿叶让红花更美 | The red flowers look lovelier against the green leaves, so the word must mean to set off.
陪衬/1 | 他只是配角，主角是妹妹 | He plays a minor part in the story, and his sister is the lead, so the word must mean foil.
映衬/1 | 蓝天和白云互相 | The blue sky and white clouds set each other off, so the word must mean to set off.
渲染/1 | 用很多笔墨写节日的热闹 | The author spends many words building up the festive bustle, so the word must mean to play up.
排比/1 | 我爱春天的花，我爱夏天的雨 | The sentence repeats the same pattern three times, so the word must mean parallelism.
设问/1 | 春天在哪里？在孩子们眼睛里 | The sentence asks a question and then answers it, so the word must mean rhetorical question.
修辞手法/1 | 比喻和拟人是常见的 | Metaphor and personification are common examples, so the word must mean rhetorical device.
首尾呼应/1 | 开头结尾都写下雨 | The essay begins and ends with rain, so the word must mean beginning and end echo.
承上启下/1 | 这一段连接前后文 | The paragraph links what goes before with what follows, so the word must mean to link what comes before and after.
离骚/1 | 屈原写的长诗 | It is the long poem by Qu Yuan expressing love of his country, so the word must mean Li Sao.
楚辞/1 | 以屈原作品为代表的诗歌 | Qu Yuan's works are the model of this kind of poetry, so the word must mean Chu Ci.
屈原/1 | 端午节是为了纪念他 | Tradition says the Dragon Boat Festival remembers him, so the word must mean Qu Yuan.
汉赋/1 | 汉代最有代表性的文学 | It is the most typical literary form of the Han dynasty, so the word must mean Han fu.
乐府/1 | 汉代收集民间歌谣的机构 | The Han set up an office to collect folk songs, so the word must mean Yuefu.
元曲/1 | 唐诗、宋词和它 | With Tang poems and Song ci it forms the three peaks of classical literature, so the word must mean Yuan qu.
唐宋八大家/1 | 韩愈和欧阳修都属于 | Han Yu and Ouyang Xiu both belong to this group of prose masters, so the word must mean the Eight Masters of Tang and Song.
白居易/1 | 他的诗连老奶奶都能听懂 | His poems were said to be clear even to old women, so the word must mean Bai Juyi.
陶渊明/1 | 辞官回家写田园诗 | He gave up office, went home and wrote many poems of country life, so the word must mean Tao Yuanming.
词牌/1 | “水调歌头”是这样的名字 | Shui Diao Ge Tou names the tune to which a ci is written, so the word must mean ci tune title.
歌谣/1 | 奶奶会唱很多古老的 | Grandma can sing many old songs, so the word must mean ballad.
民谣/1 | 当地流传好几百年的歌 | The song has been sung in the area for hundreds of years, so the word must mean folk song.
童谣/1 | 孩子们跳绳时唱 | The children sing as they skip, so the word must mean nursery rhyme.
灯谜/1 | 元宵节看花灯猜 | On the Lantern Festival people view lanterns and guess these, so the word must mean lantern riddle.
词人/1 | 李清照是宋代有名的女 | Li Qingzhao was a famous woman writer of ci in the Song, so the word must mean ci poet.
填词/1 | 他作曲朋友写歌词 | He wrote the music and a friend wrote the words, so the word must mean to write lyrics.
词曲/1 | 歌的词和曲都是他写的 | He wrote both the words and the music of the song himself, so the word must mean lyrics and music.
古文/1 | 读的时候要多查字典 | Reading it means looking up many characters in the dictionary, so the word must mean classical prose.
白话文/1 | 一百多年前作家开始用 | Over a century ago writers began writing in everyday language, so the word must mean vernacular Chinese.
韵文/1 | 诗、词、赋都属于 | Shi, ci and fu are all rhymed forms, so the word must mean verse.
散文家/1 | 很少写小说和诗的作家 | He rarely writes fiction or poetry, so the word must mean essayist.
文豪/1 | 鲁迅被称为大 | Lu Xun is called the giant of modern Chinese literature, so the word must mean literary giant.
文人/1 | 古代一起喝茶作诗的 | Ancient scholars often drank tea and wrote poems together, so the word must mean literati.
文集/1 | 收了他一生写的散文 | The book gathers the prose he wrote all his life, so the word must mean collected works.
选集/1 | 只选了最有名的二十首 | The book includes only his twenty most famous poems, so the word must mean anthology.
稿费/1 | 用第一笔给妈妈买礼物 | With his first payment for writing he bought his mother a present, so the word must mean author's fee.
书信/1 | 几十年来用它交流 | For decades they kept in touch by post, so the word must mean letters.
随笔/1 | 每天晚上记录自己的想法 | Every evening he writes down his thoughts, so the word must mean jottings.
回忆录/1 | 老科学家讲他年轻时的经历 | The old scientist wrote about his early life, so the word must mean memoir.
短篇小说/1 | 每篇只有几千字 | Each of the ten stories is only a few thousand characters, so the word must mean short story.
讥讽/1 | 用嘲笑的口气说你真聪明 | He said "how clever you are" in a mocking tone, so the word must mean to mock.
讥笑/1 | 不要笑话犯错的同学 | We should not make fun of classmates who make mistakes, so the word must mean to sneer.
讽刺/1 | 小说批评爱慕虚荣的人 | The novel pokes fun at vain people, so the word must mean to satirise.
赏析/1 | 语文课分析欣赏一首宋词 | In today's Chinese lesson the teacher led them through a Song ci, so the word must mean to appreciate and analyse.
文学评论/1 | 在大学专门分析小说 | At university he specialises in analysing novels, so the word must mean literary criticism.
品味/1 | 好诗要慢慢体会 | A good poem must be tasted slowly to feel its beauty, so the word must mean to savour.
回味/1 | 旅行让我想了很久 | The speaker thought back over the trip for a long time, so the word must mean to recall with pleasure.
生动/1 | 讲故事孩子们听入迷 | The children were spellbound by his storytelling, so the word must mean vivid.
朴实/1 | 语言很简单但很感人 | The language is simple but very moving, so the word must mean plain.
细节/1 | 通过生活小事写母亲的爱 | The author shows a mother's love through many small things of daily life, so the word must mean detail.
鲜艳/1 | 公园里开满了花 | In spring the park is full of brightly coloured flowers, so the word must mean bright-coloured.
艳丽/1 | 鸟的羽毛有红有绿 | The bird's feathers are red and green, so the word must mean gorgeous.
紫色/1 | 红色和蓝色调出 | Mixing red and blue paint gives this colour, so the word must mean purple.
碧绿/1 | 湖水像一块大玉石 | The lake looks like a great piece of jade, so the word must mean emerald green.
翠绿/1 | 雨后山上的竹子 | After rain the bamboo on the hill looks even fresher green, so the word must mean verdant.
浅色/1 | 夏天穿吸收的热少 | It absorbs less heat and is cooler in summer, so the word must mean light-coloured.
漆黑/1 | 停电了屋子里一片 | The power went off and the room was completely dark, so the word must mean pitch-black.
浓淡/1 | 画水墨画墨要控制好 | In ink painting you must control how dark or pale the ink is, so the word must mean shade.
纯色/1 | 衣服只有一种颜色 | The garment is one colour from top to bottom, so the word must mean solid colour.
色调/1 | 画用了很多蓝和绿比较冷 | The painting uses much blue and green and feels cool, so the word must mean tone.
颜料/1 | 挤在一起调出想要的颜色 | He squeezed several together to mix the colour he wanted, so the word must mean pigment.
画布/1 | 油画画在上面再装框 | Oil paintings are usually done on it and then framed, so the word must mean canvas.
画纸/1 | 水彩落上去慢慢化开 | The watercolour slowly spreads as it touches it, so the word must mean drawing paper.
涂料/1 | 新房子墙上刷了一层白的 | The walls of the new house have a coat of white, so the word must mean coating.
油漆/1 | 门上的还没干 | It is still wet on the door and should not be touched, so the word must mean paint.
上色/1 | 先画线条再给画加颜色 | He draws the lines in pencil first and then adds colour, so the word must mean to colour.
笔触/1 | 粗粗的线能感觉到画家的激情 | The painter's passion shows in the thick strokes, so the word must mean brushstroke.
水彩画/1 | 颜色透明看起来清新 | Its colours are transparent and fresh, so the word must mean watercolour.
油画/1 | 颜料干得慢可以一层层画 | Its paint dries slowly and can be built up in layers, so the word must mean oil painting.
素描/1 | 学画画先练线条和明暗 | Art learners usually begin by practising line and shading, so the word must mean sketch.
版画/1 | 可以印出很多张 | Many nearly identical copies can be printed, so the word must mean print.
花鸟画/1 | 两只小鸟站在树枝上 | Two little birds stand on a branch in it, so the word must mean flower-and-bird painting.
人物画/1 | 画的是一位读书的老人 | It shows an old man reading, so the word must mean figure painting.
风景画/1 | 有高山大河和村庄 | His paintings show mountains, rivers and distant villages, so the word must mean landscape painting.
静物/1 | 学生们画苹果和花瓶 | The pupils are painting an apple and a vase on a table, so the word must mean still life.
写生/1 | 老师带我们到公园画画 | The art teacher took them to paint in the park, so the word must mean to sketch from life.
写实/1 | 树叶上的水珠都画出来 | Even the drops of water on the leaves are painted, so the word must mean realistic.
写意/1 | 不追求细节几笔画出神态 | Unlike fine-line painting, it catches the spirit in a few strokes, so the word must mean freehand style.
工笔/1 | 一根羽毛也画得清清楚楚 | Its brushwork is fine enough to make every feather clear, so the word must mean meticulous style.
画师/1 | 宫里专门为皇帝画像的人 | In old times the palace had artists to paint the emperor, so the word must mean painter.
线条/1 | 画很简单却很有力量 | The painting's strokes are simple yet strong, so the word must mean line.
图案/1 | 盘子上印着熊猫 | A panda is printed on the plate, so the word must mean pattern.
花纹/1 | 布上细小的图样 | The cloth has many fine designs on it, so the word must mean decorative pattern.
纹理/1 | 木桌保留了木头本来的 | The wooden table keeps the wood's natural grain, so the word must mean texture, grain.
条纹/1 | 斑马身上黑白两色 | Zebras have black and white ones, so the word must mean stripe.
斑点/1 | 小狗身上几个黑色的 | The puppy has a few black ones, so the word must mean spot.
波纹/1 | 湖面起了一圈圈 | The wind sends rings across the lake, so the word must mean ripple.
对称/1 | 人的脸大体上左右 | The two halves of a face are roughly alike, so the word must mean symmetrical.
比例/1 | 画人时头和身体的 | When drawing people, head and body must be the right size to each other, so the word must mean proportion.
边框/1 | 照片四周一圈金色的 | The photo has a gold rim around it, so the word must mean border.
质感/1 | 石头和木头摸起来不同 | Stone and wood feel completely different to the touch, so the word must mean texture.
粗糙/1 | 石头表面摸起来不舒服 | The stone's surface is unpleasant to touch, so the word must mean rough.
光滑/1 | 玉石打磨得像镜子 | The jade has been polished like a mirror, so the word must mean smooth.
均匀/1 | 刷墙不能这里多那里少 | Paint must not be thick here and thin there, so the word must mean even.
匀称/1 | 舞蹈演员身材 | The dancer moves gracefully and is well built, so the word must mean well-proportioned.
尖锐/1 | 玻璃的边小心划手 | Take care not to cut your hand on the edge of the glass, so the word must mean sharp.
敏锐/1 | 摄影师对光线的感觉 | Good photographers have a fine sense for light, so the word must mean keen.
绒毛/1 | 小鸭子身上黄色的 | Ducklings are covered in yellow down, so the word must mean fluff.
柔和/1 | 灯光看书不伤眼睛 | The lamp's light does not strain your eyes for reading, so the word must mean soft.
浓密/1 | 头发又黑又 | His hair is black and full, so the word must mean thick.
装饰/1 | 过年用红灯笼和对联 | At New Year many homes are hung with lanterns and couplets, so the word must mean to decorate.
饰品/1 | 小店卖手链戒指 | The little shop sells bracelets, rings and the like, so the word must mean accessory.
首饰/1 | 金银放在小木箱里 | She keeps her gold and silver in a small wooden box, so the word must mean jewellery.
珍珠/1 | 项链上又圆又亮 | Those on the necklace are round and glossy, so the word must mean pearl.
珠宝/1 | 钻石玉石价格很贵 | The shop sells diamonds and jade at high prices, so the word must mean jewellery.
项链/1 | 胸前戴着一条银 | She wears a silver one round her neck, so the word must mean necklace.
耳环/1 | 戴在耳上几乎看不见 | They are tiny and almost invisible on her ears, so the word must mean earring.
修饰/1 | 作文很朴实没有过多 | The essay is plain without much ornament, so the word must mean embellishment.
漆器/1 | 中国表面又亮又光滑的器物 | China has a long history of it, and its surface is glossy and smooth, so the word must mean lacquerware.
摆设/1 | 客厅里只有桌子花瓶 | The sitting room holds only a table, a vase and some chairs, so the word must mean furnishings.
衬衫/1 | 穿着白的打着领带 | He wore a white one and a tie to the interview, so the word must mean shirt.
袖子/1 | 太长盖住了手 | They are too long and cover his hands, so the word must mean sleeve.
长袖/1 | 山上早晚冷带一件 | Mornings and evenings on the mountain are cold, so the word must mean long-sleeved.
短袖/1 | 天气热换上了 | The weather has turned hot, so the word must mean short-sleeved.
服饰/1 | 各民族的衣服和装饰 | The clothes and ornaments of each people show their way of life, so the word must mean clothing and adornment.
款式/1 | 鞋有好几种 | The shoes come in several designs, so the word must mean style.
面料/1 | 衣服是纯棉的 | The clothing is pure cotton, so the word must mean fabric.
纺织/1 | 城市生产大量的布 | The city's industry produces great amounts of cloth, so the word must mean textile.
羽绒服/1 | 下雪了穿上暖和的 | It is snowing and he puts on a warm padded coat, so the word must mean down jacket.
服装设计/1 | 大学学的，现在自己做衣服卖 | She studied it and now makes clothes to sell, so the word must mean fashion design.
工艺/1 | 瓷器要经过几十道工序 | Making this porcelain takes dozens of steps, so the word must mean craft.
工艺品/1 | 旅游时买的当地手工东西 | She bought some local crafts as presents, so the word must mean handicraft.
手工/1 | 包都是人亲手做的 | Each bag is slightly different because people made them, so the word must mean by hand.
匠人/1 | 老人做了一辈子木工活 | The old man has worked wood all his life, so the word must mean craftsman.
木雕/1 | 门窗上刻着花和鸟 | Flowers and birds are carved on the doors and windows, so the word must mean wood carving.
石雕/1 | 桥头的两只狮子 | The two lions at the bridge are hundreds of years old, so the word must mean stone carving.
泥塑/1 | 用泥捏小人的民间艺术 | He shaped a little figure out of clay, so the word must mean clay sculpture.
釉色/1 | 瓷碗像雨后的天空一样青 | The bowl is the blue of the sky after rain, so the word must mean glaze colour.
扇子/1 | 夏天奶奶手里拿着 | In hot summers Grandma always holds one, so the word must mean fan.
折扇/1 | 合起来可以放进口袋 | Folded up, it fits in a pocket, so the word must mean folding fan.
美丽/1 | 西湖风景吸引游客 | West Lake's scenery draws many visitors every year, so the word must mean beautiful.
华丽/1 | 宫殿到处都是金色 | Gold is everywhere in the palace, so the word must mean gorgeous.
典雅/1 | 书房布置有书和字画 | The study is full of books and paintings, so the word must mean elegant.
简约/1 | 年轻人家里东西很少 | Many young people keep few things at home, so the word must mean simple.
美观/1 | 产品既要实用又要 | Products should be both useful and pleasing to look at, so the word must mean attractive.
魅力/1 | 老师讲课学生都喜欢 | All the students love her lessons, so the word must mean charm.
格调/1 | 咖啡馆墙上挂着油画 | Oil paintings hang on the café's walls, so the word must mean style.
古朴/1 | 小镇的房子保留几百年前的样子 | The town's houses look as they did centuries ago, so the word must mean primitive and simple.
时尚/1 | 流行什么她就穿什么 | She wears whatever the magazines say is in, so the word must mean fashionable.
潮流/1 | 人们都想跟上时代的 | Everyone wants to keep up with the times, so the word must mean trend.
佳作/1 | 比赛收到很多好作品 | The judges can hardly pick a winner among the many entries, so the word must mean fine work.
名画/1 | 每年几百万人到博物馆来看 | Millions come to the museum every year to see it, so the word must mean famous painting.
真迹/1 | 不是后人画的 | The painting in the museum was not done by later hands, so the word must mean authentic work.
审美/1 | 每个人喜欢的东西不一样 | Different people like different things, so the word must mean aesthetic sense.
品位/1 | 她买的衣服都很好看 | Everyone says she knows how to dress, so the word must mean taste.
卓越/1 | 建筑师因为成就得了大奖 | The architect won a major prize for what he achieved, so the word must mean outstanding.
名家/1 | 几十位书画大师的作品 | The exhibition shows works by dozens of master painters and calligraphers, so the word must mean famous expert.
印象派/1 | 画家到户外画光和颜色 | Its painters went outdoors to paint changing light and colour, so the word must mean Impressionism.
拍卖/1 | 古画卖出了很高的价格 | The old painting went to the highest bidder at a sale, so the word must mean auction.
珍品/1 | 博物馆平时不拿出来展览 | The museum rarely puts this porcelain on show, so the word must mean treasure.
走廊/1 | 教室外面挂着学生的画 | The pupils' paintings hang in the passage outside the classroom, so the word must mean corridor.
长廊/1 | 皇家花园里七百多米长 | In the old imperial garden it runs over seven hundred metres and bears thousands of paintings, so the word must mean long corridor.
亭子/1 | 山顶上让游人休息 | On the hilltop there is a small open shelter where walkers rest, so the word must mean pavilion.
报亭/1 | 街边卖报纸和杂志 | Newspapers and magazines used to be sold from small kiosks on the street, so the word must mean newsstand.
砖墙/1 | 老房子红色很结实 | The old house is red and very solid, so the word must mean brick wall.
园林/1 | 苏州古典的被列入世界遗产 | Suzhou's classical ones are on the World Heritage list, so the word must mean garden.
庭院/1 | 四合院中间方方的 | A siheyuan has a square open space in the middle, so the word must mean courtyard.
假山/1 | 花园里用石头堆成 | Gardens pile up stones into little hills beside a pond, so the word must mean rockery.
屋顶/1 | 下雪以后一片白 | After the snow the top of the house is all white, so the word must mean roof.
室内设计/1 | 帮别人布置房子里面 | She helps people arrange the inside of their homes, so the word must mean interior design.
平面设计/1 | 为公司设计广告和书封面 | She designs advertisements and book covers for companies, so the word must mean graphic design.
海报/1 | 电影院门口贴着 | One for the new film is pasted at the cinema door, so the word must mean poster.
标志/1 | 公司的蓝色鸟印在产品上 | The company's blue bird is printed on every product, so the word must mean logo.
字体/1 | 太小老人看不清 | The characters are too small for old people to read, so the word must mean font.
排版/1 | 报纸文章和图片放得很有条理 | The articles and pictures in the paper are laid out in good order, so the word must mean typesetting.
插画/1 | 童话书里很多可爱的 | The fairy-tale book has many lovely pictures, so the word must mean illustration.
图标/1 | 手机屏幕上点一下就打开 | Tapping one of the little images on the phone screen opens an app, so the word must mean icon.
醒目/1 | 路牌让司机远远看到 | Drivers must be able to see road signs from far away, so the word must mean eye-catching.
配色/1 | 蓝色和白色搭在一起 | The blue and white of the garment go well together, so the word must mean colour matching.
草图/1 | 设计师先画几张 | The designer drew a few rough ones first and then refined one, so the word must mean sketch.
工业设计/1 | 汽车手机的外观 | The look of cars and phones depends on it, so the word must mean industrial design.
造型/1 | 椅子看起来像一只大手 | The chair looks like a big hand, so the word must mean form.
人性化/1 | 坐轮椅的人也能按到楼层 | Even wheelchair users can reach the lift buttons for their floor, so the word must mean user-friendly.
创意/1 | 广告让人一看就记住 | The advertisement is remembered at first sight, so the word must mean creative idea.
设计图/1 | 工程师按照它做出机器 | The engineers built the machine from the drawings, so the word must mean design drawing.
外形/1 | 车像一条鱼 | The car looks like a fish, so the word must mean outer shape.
改良/1 | 工程师让机器更省电 | The engineer made the machine use less electricity, so the word must mean to improve.
结实/1 | 包用了十年还没坏 | The bag has lasted ten years without breaking, so the word must mean sturdy.
小巧/1 | 手机又薄放在口袋里方便 | The thin phone fits easily in a pocket, so the word must mean compact.
轻便/1 | 自行车一只手就能提起来 | The bicycle can be lifted with one hand, so the word must mean lightweight.
美术馆/1 | 城市收藏现代画家作品 | The city keeps works by many modern painters there, so the word must mean art gallery.
画廊/1 | 私人的也卖画 | This private place sells paintings too, at modest prices, so the word must mean gallery.
展品/1 | 请不要用手摸 | Visitors are asked not to touch what is on display, so the word must mean exhibit.
展厅/1 | 一楼正在展出瓷器 | On the ground floor ancient porcelain is now on show, so the word must mean exhibition hall.
藏品/1 | 十万多件每次只展一小部分 | The museum owns over a hundred thousand items but shows only a few at a time, so the word must mean collection.
讲解员/1 | 介绍每幅画背后的故事 | Someone told us the story behind each painting, so the word must mean docent.
参展/1 | 二十多位画家参加画展 | Over twenty painters have works in the show, so the word must mean to exhibit.
展馆/1 | 专门为世界博览会修建的 | The building was put up specially for the World Expo, so the word must mean exhibition pavilion.
闭馆/1 | 博物馆每周一不开放 | The museum is not open to the public on Mondays, so the word must mean to close.
布展/1 | 开幕前工作人员花三天 | Before the opening the staff spent three days arranging the show, so the word must mean to set up an exhibition.
壁画/1 | 古代石窟里精美的 | The ancient cave has many fine paintings on its walls, so the word must mean mural.
浮雕/1 | 墙上刻着古代农民种地 | Ancient farmers are carved into the surface of the wall, so the word must mean relief.
原作/1 | 这是印刷品，真的在法国 | This is only a print, and the real one is in France, so the word must mean original work.
复制品/1 | 真文物容易坏不能拿出来 | The real relic is too fragile to take out, so the word must mean replica.
手稿/1 | 作家的稿子上还有修改痕迹 | The writer's pages on show still bear his corrections, so the word must mean manuscript.
仿制/1 | 工厂做了一批古代家具 | The factory made a batch of furniture in the ancient style, so the word must mean to imitate.
仿品/1 | 地摊上的“古董”不值钱 | The "antiques" sold on street stalls are worth nothing, so the word must mean imitation.
落款/1 | 画右下角写着名字和年份 | The painter's name and the year are written at the lower right, so the word must mean signature.
题字/1 | 大门上有名书法家写的 | A famous calligrapher wrote the characters on the gate, so the word must mean inscription.
涂改/1 | 考试答案不要随意 | Answers in an exam should be written clearly without crossing out, so the word must mean to alter.
诉讼/1 | 两家公司打了一年多官司 | The two firms fought over the contract in court for more than a year, so the word must mean lawsuit.
起诉/1 | 告那家公司要求赔偿 | He is taking the company to court for his losses, so the word must mean to sue.
上诉/1 | 对判决不满向上一级法院 | Unhappy with the verdict, he is going to a higher court, so the word must mean to appeal.
申诉/1 | 认为处理不公平向教育部门提出 | He thinks the school treated him unfairly and has taken it to the education authority, so the word must mean to appeal.
民事/1 | 邻居因房子的纠纷属于 | A dispute between neighbours over a house is a private matter, so the word must mean civil.
刑事/1 | 诈骗受贿属于这类犯罪 | Fraud and taking bribes are crimes punished by the state, so the word must mean criminal.
立案/1 | 接到报警马上开始调查 | The police opened an investigation as soon as the report came in, so the word must mean to file a case.
结案/1 | 调查半年案子终于 | After six months of investigation the case is finally over, so the word must mean to close a case.
案情/1 | 法官了解了才判决 | The judge studied what had happened before giving a verdict, so the word must mean details of a case.
宣判/1 | 法官当庭宣布被告无罪 | The judge announced in court that the defendant was not guilty, so the word must mean to pronounce judgement.
刑法/1 | 诈骗的人要按照它处罚 | Those who cheat others of large sums are punished under it, so the word must mean criminal law.
民法/1 | 规定财产、婚姻、合同的权利 | It sets out people's rights in property, marriage and contracts, so the word must mean civil law.
法典/1 | 古罗马留下的很有影响 | Ancient Rome left one that many countries later learned from, so the word must mean code.
法规/1 | 开车要遵守交通 | Drivers must obey the traffic ones, so the word must mean regulations.
条例/1 | 城市新出台垃圾分类管理 | The city has issued new rules on sorting rubbish, so the word must mean regulations.
条款/1 | 签合同前读每一个 | Before signing a contract you should read every one of them, so the word must mean clause.
立法/1 | 国家制定法律的机关 | This state body makes the laws, so the word must mean legislation.
司法/1 | 法院是这样的机关 | Courts belong to this branch of the state, so the word must mean judiciary.
修订/1 | 法律改过好几次更完善 | The law has been changed several times and is now more complete, so the word must mean to revise.
废除/1 | 很多国家取消了奴隶制度 | Many countries ended slavery long ago, so the word must mean to abolish.
嫌疑/1 | 他可能作案但没有证据 | He may have done it, but the police have no proof yet, so the word must mean suspicion.
嫌疑人/1 | 警察正在找一名犯罪 | The police are looking for a person who may have committed the crime, so the word must mean suspect.
涉嫌/1 | 公司可能制造假商品 | The company is under investigation over possible fake goods, so the word must mean to be suspected of.
拘留/1 | 网上造谣被关了五天 | He was held by the police for five days for spreading rumours online, so the word must mean to detain.
逮捕/1 | 追查一个月终于抓住骗子 | After a month's pursuit the police finally caught the swindler, so the word must mean to arrest.
侦查/1 | 警方调查案件还没有线索 | The police are working on the case but have no leads yet, so the word must mean to investigate.
侦破/1 | 案件很快找到作案人 | The police quickly found the real culprit, so the word must mean to crack a case.
侦探/1 | 福尔摩斯是小说里的 | Sherlock Holmes is a famous one in fiction, so the word must mean detective.
证词/1 | 法官听了几位证人的 | The judge listened carefully to what the witnesses said, so the word must mean testimony.
罪名/1 | 他被指控的是诈骗 | He is accused of fraud, so the word must mean charge.
判决/1 | 法院要被告赔偿十万元 | The court has ordered the defendant to pay the plaintiff a hundred thousand yuan, so the word must mean verdict.
裁决/1 | 仲裁委员会来决定纠纷 | The arbitration committee will settle the dispute between the two firms, so the word must mean to rule.
判刑/1 | 因为诈骗被关三年 | He got three years for fraud, so the word must mean to sentence.
刑期/1 | 在监狱表现好被减少 | It was cut because he behaved well in prison, so the word must mean prison term.
缓刑/1 | 罪比较轻又真心改正 | His crime was minor and he truly reformed, so the word must mean probation.
坐牢/1 | 年轻时偷东西被关进监狱 | He was locked up for stealing when young and later turned over a new leaf, so the word must mean to be in jail.
罚金/1 | 除了坐监狱还要交五万元 | Besides prison, he must pay fifty thousand yuan, so the word must mean fine.
罪行/1 | 在法庭上承认了 | He admitted in court what he had done, so the word must mean crime.
陪审员/1 | 普通公民参加案件审理 | In some countries ordinary citizens help try cases, so the word must mean juror.
开庭/1 | 案件下个月审理 | The case will be heard next month, so the word must mean to open a court session.
盗窃/1 | 违法会受到法律处罚 | It is against the law and punished by it, so the word must mean theft.
偷窃/1 | 猴子常常拿游客的食物 | The monkeys often take visitors' food, so the word must mean to steal.
窃取/1 | 黑客偷走了客户资料 | Hackers took the company's customer data, so the word must mean to steal.
失窃/1 | 博物馆丢了一幅名画 | A famous painting is missing from the museum and the police are investigating, so the word must mean to be stolen.
赃物/1 | 小偷家里找到偷来的手机 | The phones and bicycle found in the thief's home were all taken from others, so the word must mean stolen goods.
赃款/1 | 官员把收来的钱藏在老家 | The official hid the money he had taken at his old home, so the word must mean stolen money.
挪用/1 | 会计拿公司的钱去买房 | The accountant used company money to buy a flat, so the word must mean to misappropriate.
逮住/1 | 小猫一下子抓住老鼠 | The kitten got hold of a mouse at once, so the word must mean to catch.
报案/1 | 东西被偷去派出所 | His things were stolen and he went straight to the police station, so the word must mean to report a case.
追回/1 | 警察帮他找回钱包 | The police got his lost wallet back for him, so the word must mean to recover.
贿赂/1 | 用钱请官员帮忙被拒绝 | He offered an official money for a favour and was refused, so the word must mean to bribe.
行贿/1 | 给官员送钱请他办事 | Someone gives an official money to get something done, so the word must mean to offer a bribe.
受贿/1 | 官员收了别人的钱帮人办事 | The official took money from others and did them favours, so the word must mean to accept bribes.
贪污/1 | 把公家的钱据为己有 | He took public money for himself, so the word must mean embezzlement.
廉洁/1 | 当官不能收别人礼物 | Officials must not accept gifts from others, so the word must mean honest, incorruptible.
清廉/1 | 县长去世家里没什么钱 | When the county head died his family had little money, so the word must mean upright.
反腐/1 | 国家查处了很多贪官 | The state has punished many corrupt officials, so the word must mean to fight corruption.
职权/1 | 利用它为亲戚安排工作 | He used his official power to find jobs for relatives and was punished, so the word must mean authority.
以权谋私/1 | 当官的用权力为自己 | Officials who use their power for themselves lose people's trust, so the word must mean to abuse power for personal gain.
滥用/1 | 官员乱用权力被撤职 | The official used his power wrongly and was removed, so the word must mean to abuse.
契约/1 | 古代买卖土地也要写 | Even in ancient times people put land sales in writing, so the word must mean contract.
签订/1 | 两家公司签了合作协议 | The two companies put their names to a cooperation agreement, so the word must mean to sign.
生效/1 | 合同从签字那天起 | The contract applies from the day both sides sign, so the word must mean to take effect.
失效/1 | 优惠券过期了 | The coupon is past its date, so the word must mean to become invalid.
无效/1 | 违法的合同就是 | A contract whose content breaks the law does not count, so the word must mean invalid.
履行/1 | 双方都要做到自己的义务 | Once the contract is signed, both sides must carry out their duties, so the word must mean to fulfil.
甲方/1 | 合同里买房的人 | In this contract one side is the buyer and the other is the seller, so the word must mean Party A.
公证/1 | 遗嘱在法律上很有效力 | The will has strong legal force, so the word must mean notarisation.
期满/1 | 租房合同明年三月 | The lease runs until next March and then they decide whether to renew, so the word must mean to expire.
违约金/1 | 不按时交货要付给对方 | A side that delivers late must pay the other a sum, so the word must mean penalty for breach.
肖像/1 | 画家为老人画了很多 | The painter painted many of the village's old people, so the word must mean portrait.
肖像权/1 | 没同意把照片用在广告里 | Someone's photo was used in an advertisement without consent, so the word must mean portrait right.
隐私权/1 | 看别人的日记侵犯了 | Reading someone else's diary breaks one of their rights, so the word must mean right to privacy.
商标权/1 | 用了别人的商标被告 | The company was sued for using another firm's brand mark, so the word must mean trademark right.
著作权/1 | 书属于作者，别人不能随便印 | Others may not print and sell the book without the author, so the word must mean copyright.
知情权/1 | 医生应该把病情告诉病人 | The doctor should tell the patient about the illness, so the word must mean right to know.
捍卫/1 | 律师保护当事人的权利 | Lawyers protect their clients' lawful rights, so the word must mean to defend.
剥夺/1 | 不能拿走孩子受教育的权利 | No one may take away a child's right to education, so the word must mean to deprive.
享有/1 | 每个公民都有受教育的权利 | Every citizen has the right to education, so the word must mean to enjoy.
平等权/1 | 不管男女穷富在法律面前都有 | Man or woman, rich or poor, all stand the same before the law, so the word must mean right to equality.
打扰/1 | 对不起，请问去车站怎么走 | The speaker politely interrupts a stranger to ask the way to the station, so the word must mean to disturb.
干扰/1 | 电子设备互相影响信号 | Electronic devices affect each other's signals, so the word must mean to interfere.
骚扰/1 | 天天给陌生人打推销电话 | He phones strangers with sales calls every day, so the word must mean harassment.
扰乱/1 | 大喊大叫破坏公共秩序 | Shouting in public places breaks public order, so the word must mean to disrupt.
噪声/1 | 城市里越来越大影响休息 | It keeps growing in the city and spoils people's rest, so the word must mean noise.
扰民/1 | 晚上十点以后装修 | Renovation after ten at night bothers the neighbours, so the word must mean to disturb residents.
困扰/1 | 睡不着觉的问题一直让他烦 | Being unable to sleep has long bothered him, so the word must mean to trouble.
投诉/1 | 邻居的狗天天叫，他向物业 | The neighbour's dog barks all day and he went to the property office, so the word must mean to complain.
静音/1 | 开会时把手机调成 | Phones should make no sound during the meeting, so the word must mean mute.
纷扰/1 | 搬到乡下离开城市的 | He moved to the countryside to get away from the city's bustle, so the word must mean confusion, turmoil.
隐瞒/1 | 他没告诉父母考试成绩 | He did not tell his parents his exam results, so the word must mean to conceal.
诽谤/1 | 网上编造谎言损害名声 | He made up lies online that harmed someone's name, so the word must mean slander.
诬告/1 | 向警察说邻居偷东西，是假的 | He told the police his neighbour stole from him, and it proved untrue, so the word must mean to falsely accuse.
篡改/1 | 有人改了考试成绩 | Someone changed exam results and the school found out, so the word must mean to tamper with.
冤案/1 | 二十年前的错案终于纠正 | A case judged wrongly twenty years ago has finally been put right, so the word must mean wrongful case.
冤屈/1 | 他受了委屈心里难过 | He is very upset because he was treated unjustly, so the word must mean injustice.
申冤/1 | 四处证明自己清白 | He went everywhere until he proved his innocence, so the word must mean to seek redress.
瞒报/1 | 工厂没报告事故真实情况 | The factory did not report what really happened in the accident, so the word must mean to fail to report.
谎报/1 | 他说错年龄想参加比赛 | He gave a false age to enter the competition, so the word must mean to misreport.
伪证/1 | 在法庭上作是违法的 | Giving false evidence in court is against the law, so the word must mean perjury.
泄露/1 | 不要在网上让住址被人知道 | You should not let your home address become known online, so the word must mean to leak.
泄密/1 | 把公司技术告诉别人被开除 | He was fired for telling others the company's technology, so the word must mean to leak secrets.
机密/1 | 文件是公司的不能随便看 | The company's file must not be read by just anyone, so the word must mean confidential.
窃听/1 | 电话里装了偷听的东西 | Someone put a device in his phone to listen secretly, so the word must mean to eavesdrop.
个人信息/1 | 注册时不要随便填太多 | When signing up you should not fill in too much about yourself, so the word must mean personal information.
网络安全/1 | 学校教大家怎样保护自己 | The school taught pupils how to protect themselves online, so the word must mean cybersecurity.
泄漏/1 | 厨房里有煤气的味道 | There is a smell of gas in the kitchen and the windows must be opened at once, so the word must mean to leak.
加密/1 | 文件没有密码打不开 | The file cannot be opened without a password, so the word must mean to encrypt.
监控/1 | 小区门口看到进出的人 | Cameras at the estate gate show who comes and goes, so the word must mean monitoring.
指纹/1 | 很多手机用它解锁 | Many phones unlock with a touch of the finger, so the word must mean fingerprint.
涉及/1 | 书谈到历史、地理等很多方面 | The book touches on history, geography and much else, so the word must mean to involve.
牵涉/1 | 案子跟好几家公司有关 | The case is connected with several companies, so the word must mean to implicate.
干涉/1 | 父母不应该过多管孩子交朋友 | Parents should not meddle too much in children's friendships, so the word must mean to interfere.
交涉/1 | 大使馆跟当地政府谈 | The embassy took the matter up with the local government, so the word must mean to negotiate.
旁听/1 | 公开审理的案件普通人可以去 | Ordinary people may sit in on cases heard in open court, so the word must mean to attend as an observer.
旁观/1 | 大家都在帮忙他站在一边 | Everyone was helping while he stood to one side, so the word must mean to look on.
旁观者/1 | 当局者迷，他们清 | The saying goes that those involved are confused while those outside see clearly, so the word must mean onlooker.
威胁/1 | 全球变暖影响动物生存 | Global warming endangers the survival of many animals, so the word must mean to threaten.
谴责/1 | 国际社会强烈批评破坏文物 | The international community strongly criticises the destruction of relics, so the word must mean to condemn.
胁迫/1 | 被逼签的字合同无效 | He signed under pressure and the contract is invalid, so the word must mean to coerce.
欺诈/1 | 把旧手机当新的卖 | The seller passes old phones off as new, so the word must mean fraud.
假冒/1 | 名牌包都是假的 | The brand-name bags are poorly made and not the real thing, so the word must mean counterfeit.
伪劣/1 | 这批产品被没收 | The whole batch of goods has been seized, so the word must mean fake and shoddy.
电信诈骗/1 | 电话说你中奖要先交钱 | A caller says you have won a big prize but must pay first, so the word must mean telecom fraud.
索赔/1 | 买到坏东西向商家要钱 | A buyer who gets broken goods can ask the seller to pay for them, so the word must mean to claim damages.
赔偿金/1 | 保险公司给了他一笔 | The insurance company paid him a sum for his loss, so the word must mean compensation.
法律意识/1 | 从小懂法守法 | We should learn from childhood to know and obey the law, so the word must mean legal awareness.
打官司/1 | 两家人为了一块地上法院 | The two families went to court over a plot of land, so the word must mean to go to law.
霸王条款/1 | 商品一经出售，概不退换 | The shop says goods once sold can never be returned, so the word must mean unfair clause.
售后服务/1 | 东西坏了随时上门修 | When something breaks the company sends someone to repair it any time, so the word must mean after-sales service.
派出所/1 | 钱包丢了去附近报案 | He lost his wallet and reported it at the nearby police office, so the word must mean police station.
治安/1 | 小区晚上出门很安全 | It is safe to go out at night on this estate, so the word must mean public security.
公安/1 | 办身份证要去这个局 | Identity cards are issued by this bureau, so the word must mean police.
交警/1 | 十字路口指挥交通 | An officer is directing traffic at the crossroads, so the word must mean traffic police.
巡逻/1 | 保安在小区来回走 | At night guards walk back and forth around the estate, so the word must mean to patrol.
刑警/1 | 破过很多大案 | The officer has solved many major cases, so the word must mean criminal police.
超速/1 | 开车太快会被罚款 | Driving too fast is dangerous and gets you fined, so the word must mean to speed.
交通规则/1 | 过马路看清红绿灯 | When crossing the road you must watch the lights, so the word must mean traffic rules.
检察院/1 | 代表国家向法院起诉 | In China this body brings charges against suspects in court on behalf of the state, so the word must mean procuratorate.
法警/1 | 法庭上维持秩序 | They keep order in the courtroom, so the word must mean bailiff.
牢记/1 | 记住安全常识 | We must keep safety rules firmly in mind and not panic in danger, so the word must mean to remember well.
遵纪守法/1 | 每个公民都应该 | Every citizen should obey the rules and the law, so the word must mean to abide by the law.
服兵役/1 | 一些国家成年男子必须 | In some countries adult men must serve in the army, so the word must mean to do military service.
法治/1 | 任何人都不能超越法律 | In such a society no one stands above the law, so the word must mean rule of law.
普法/1 | 社区给居民讲法律知识 | The community often explains the law to residents, so the word must mean to popularise law.
法律援助/1 | 没钱请律师的人可以申请 | People who cannot afford a lawyer can apply for it, so the word must mean legal aid.
社会保障/1 | 养老和医疗保险 | Pension and medical insurance are part of it, so the word must mean social security.
养老金/1 | 爷爷退休每月领 | Grandpa receives money every month since he retired, so the word must mean pension.
低保/1 | 政府给收入特别低的家庭 | The government gives families with very low income enough to live on, so the word must mean basic living allowance.
监护人/1 | 未成年人的父母一般是 | The parents of minors usually fill this role, so the word must mean guardian.
缩小/1 | 城乡收入差距在变小 | The income gap between town and country is slowly getting smaller, so the word must mean to narrow.
紧缩/1 | 收入不好只能少花钱 | Income is poor this year and the company must spend less, so the word must mean to tighten.
萎缩/1 | 行业市场不断变小，工厂关门 | The market keeps getting smaller and many factories have closed, so the word must mean to shrink.
缩减/1 | 经费不够减少买书数量 | There was not enough money and the school bought fewer books, so the word must mean to cut.
缩水/1 | 衣服洗一次小了一号 | The garment became a size smaller after one wash, so the word must mean to shrink.
收缩/1 | 天冷时铁轨变短 | Rails become a little shorter in cold weather, so the word must mean to contract.
压缩/1 | 文件太大才能发出去 | The file is too large to send as it is, so the word must mean to compress.
通缩/1 | 物价长期下跌人们不花钱 | Prices fall for a long time and people do not want to spend, so the word must mean deflation.
回升/1 | 股价跌了几个月开始上涨 | The share price started rising after months of falling, so the word must mean to pick up.
放缓/1 | 经济增长速度变慢 | The economy is not growing as fast this year, so the word must mean to slow down.
泡沫/1 | 房价远超真正价值 | House prices have risen far above their real value, so the word must mean bubble.
崩溃/1 | 货币大幅贬值经济几乎 | The currency lost much of its value and the economy nearly fell apart, so the word must mean to collapse.
崩盘/1 | 股市那天很多股票跌一半 | That day many shares lost half their value, so the word must mean market crash.
金融危机/1 | 从美国银行开始影响全世界 | It started in American banks and soon spread around the world, so the word must mean financial crisis.
低迷/1 | 房地产市场房子很难卖 | Houses are hard to sell at the moment, so the word must mean sluggish.
疲软/1 | 需求不足价格上不去 | The price cannot rise because few people want to buy, so the word must mean weak.
景气/1 | 经济不好时公司都不招人 | When the economy is doing badly, many companies stop hiring, so the word must mean prosperity.
牛市/1 | 股票价格一直上涨 | Share prices keep rising, so the word must mean bull market.
回暖/1 | 春节以后买车的人多了 | After Spring Festival more people started buying cars, so the word must mean to recover.
反弹/1 | 股价跌到最低点以后 | The share price rose again after hitting its lowest point, so the word must mean rebound.
贬值/1 | 货币价值大幅下降，进口变贵 | Imported goods have become very expensive because the currency is worth less, so the word must mean to depreciate.
升值/1 | 本国货币价值上升，出国便宜 | Travelling abroad is cheaper because the home currency is worth more, so the word must mean to appreciate.
昂贵/1 | 手表一般人买不起 | Most people cannot afford the watch, so the word must mean expensive.
高昂/1 | 大城市住房成本很 | Housing costs a great deal in big cities, so the word must mean high.
溢价/1 | 收购价比市场价高出一半 | The buyer paid half as much again as the market price, so the word must mean premium.
差价/1 | 农村买水果城里卖赚中间的 | He buys fruit in the country, sells it in town and earns the difference, so the word must mean price difference.
定价/1 | 书三十元网上打八折 | The book is listed at thirty yuan and sold at a discount online, so the word must mean fixed price.
还价/1 | 市场买东西不一定按标价 | In this market you need not pay the marked price, so the word must mean to bargain.
天价/1 | 名画在拍卖会上卖出 | The famous painting sold at auction for an enormous sum, so the word must mean astronomical price.
电子秤/1 | 超市称水果价格马上算出 | At the supermarket the fruit's price appears as soon as it is weighed, so the word must mean electronic scale.
畅销/1 | 小说第一年卖了一百万本 | The novel sold a million copies in its first year, so the word must mean to sell well.
热销/1 | 夏天空调卖得很好 | Summer has come and air conditioners are selling fast, so the word must mean to sell briskly.
缺乏/1 | 地区水资源不够 | Farming in the area is poor because there is too little water, so the word must mean to lack.
贫乏/1 | 读书少知识比较 | He reads very little, so the word must mean meagre.
畅通/1 | 新路修好交通更好 | Traffic flows better since the new road was built, so the word must mean unimpeded.
顺畅/1 | 新系统让付款更方便 | The new system makes paying easier, so the word must mean smooth.
断货/1 | 手机太受欢迎很多店 | The phone is very popular and many shops have none left, so the word must mean out of stock.
抢购/1 | 大米要涨价，大家去超市 | People heard that rice would go up and hurried to the supermarket, so the word must mean to rush to buy.
货源/1 | 店里的菜来自几个大农场 | The shop's vegetables come from several big farms, so the word must mean source of goods.
积压/1 | 卖不出去，冬衣堆在店里 | The winter clothes did not sell and are piled up in the shop, so the word must mean to pile up.
垄断/1 | 公司控制整个行业 | The company controls the whole industry and others can hardly get in, so the word must mean monopoly.
吞并/1 | 强国常常占领周围小国 | Strong ancient states often took over the small states around them, so the word must mean to annex.
并购/1 | 两家公司合成一家更大的 | The two companies became one bigger company, so the word must mean merger.
收购/1 | 买下小软件公司全部股份 | The company bought all the shares of a small software firm, so the word must mean acquisition.
控股/1 | 大部分股份在外国企业手里 | Most of the shares are in a foreign firm's hands, so the word must mean to hold a controlling stake.
入股/1 | 拿十万元投进朋友公司分红 | He put a hundred thousand yuan into a friend's firm and gets dividends, so the word must mean to become a shareholder.
市场份额/1 | 品牌手机占国内三成 | The brand sells three in ten of the country's phones, so the word must mean market share.
独家/1 | 只有这家报纸报道 | No other newspaper reported the news, so the word must mean exclusive.
连锁店/1 | 咖啡馆全国一千多家 | The café has over a thousand branches across the country, so the word must mean chain store.
加盟/1 | 交钱开一家有名快餐的店 | He paid a fee to open a shop under a famous fast-food brand, so the word must mean to join as a franchisee.
租赁/1 | 公司出租汽车按天付钱 | The company rents out cars by the day, so the word must mean to lease.
佣金/1 | 中介卖出房子拿的钱 | An estate agent receives a sum for each flat sold, so the word must mean commission.
雇佣/1 | 工厂雇了五十名工人 | The factory pays fifty workers a monthly wage, so the word must mean to employ.
招募/1 | 活动要找一百名志愿者 | The event is looking for a hundred volunteers, so the word must mean to recruit.
佣人/1 | 古时有钱人家里有很多 | Rich families in old times had many people working in the house, so the word must mean servant.
小费/1 | 美国饭馆给服务员 | In American restaurants people usually leave extra money for the waiter, so the word must mean tip.
服务费/1 | 酒店房价里已经包括 | The hotel's room price already includes it, so the word must mean service charge.
管理费/1 | 小区每月要交物业 | Residents of the estate pay the property company monthly, so the word must mean management fee.
承揽/1 | 公司接下大桥建设工程 | The company has taken on building the bridge, so the word must mean to undertake.
时薪/1 | 干一小时给三十元 | The job pays thirty yuan for each hour worked, so the word must mean hourly wage.
钞票/1 | 口袋里拿出几张付车钱 | He took a few notes from his pocket to pay the fare, so the word must mean banknote.
现钞/1 | 大家用手机付款，用纸钱的少 | Everyone pays by phone now and fewer people use paper money, so the word must mean cash.
验钞机/1 | 银行检查钱的真假 | Banks use a machine to tell real money from fake, so the word must mean banknote checker.
假钞/1 | 使用它是违法的 | Using fake money is against the law, so the word must mean counterfeit note.
账簿/1 | 古代商人记收入和支出 | Ancient merchants recorded each day's income and spending, so the word must mean ledger.
对账/1 | 月底会计跟银行核对数字 | At the end of the month the accountant checks the figures with the bank, so the word must mean to reconcile accounts.
查账/1 | 税务部门来公司 | People from the tax office came to examine the company's books, so the word must mean to audit accounts.
审计/1 | 政府每年检查各部门财务 | Every year the government checks the finances of each department, so the word must mean audit.
财报/1 | 上市公司每季度公布 | Listed companies publish their accounts every quarter, so the word must mean financial report.
赤字/1 | 政府支出比收入多 | The government spends more than it takes in, so the word must mean deficit.
募捐/1 | 学校帮助山区孩子的活动 | The school raised money to help children in the mountains, so the word must mean to collect donations.
募集/1 | 发行股票得到大量资金 | The company issued shares to gather a large sum, so the word must mean to raise.
融资/1 | 小公司向银行贷款解决 | The small company solved its money problem with a bank loan, so the word must mean financing.
风投/1 | 创业计划吸引了这种公司 | His business plan won a large sum from a firm that backs new ventures, so the word must mean venture capital.
初创/1 | 公司只有五名员工 | The company has only five staff, so the word must mean start-up.
证券/1 | 公司帮客户买卖股票 | His company buys and sells shares for clients, so the word must mean securities.
债券/1 | 政府向老百姓借钱到期还 | The government borrows from the people and repays with interest when due, so the word must mean bond.
合资/1 | 中国和德国公司共同出钱 | Chinese and German companies put up the money for the car factory together, so the word must mean joint venture.
独资/1 | 一个人出钱办的企业 | One person put up all the money for the factory, so the word must mean wholly owned.
外资/1 | 城市建起外国公司工厂 | Many foreign companies have built factories in the city, so the word must mean foreign investment.
配套/1 | 小区旁有学校医院超市 | The new estate has a school, a hospital and a supermarket beside it, so the word must mean supporting.
套餐/1 | 一碗饭两个菜一碗汤 | The lunch comes as rice, two dishes and a soup together, so the word must mean set meal.
套装/1 | 一身黑色西服去面试 | She wore a matching black suit to the interview, so the word must mean outfit, suit.
揽客/1 | 车站门口司机问要不要坐车 | Drivers at the station door ask people whether they want a ride, so the word must mean to tout for customers.
招揽/1 | 商店放音乐吸引顾客 | The shop plays music at its door to draw customers, so the word must mean to solicit.
一揽子/1 | 政府帮助小企业的整体计划 | The government has issued a whole set of measures to help small firms, so the word must mean package.
网店/1 | 在网上卖手工艺品 | She sells her handicrafts online, so the word must mean online shop.
电商/1 | 农民可以在网上卖水果 | Many farmers can now sell fruit online, so the word must mean e-commerce.
实体店/1 | 网购方便让它生意受影响 | Online shopping is easy and shops in the street have lost business, so the word must mean physical store.
商家/1 | 节日推出打折活动 | Many sellers offer discounts during festivals, so the word must mean merchant.
逾期/1 | 图书馆的书过了日子不还 | Library books not returned in time cost a small fine, so the word must mean overdue.
到期/1 | 存款下个月可以取 | The deposit can be withdrawn next month, so the word must mean to fall due.
罚息/1 | 信用卡没按时还款银行收 | The bank charges extra when a card is not paid on time, so the word must mean penalty interest.
借款/1 | 说好一年后还清 | He borrowed money from a friend and promised to repay it in a year, so the word must mean loan.
讨债/1 | 钱没还只好上门 | The money he lent was never returned and he went to ask for it, so the word must mean to collect a debt.
负债/1 | 公司欠得太多还不起 | The company owes more than it can repay, so the word must mean to be in debt.
坏账/1 | 借钱的公司破产了 | The company that borrowed the money went bankrupt, so the word must mean bad debt.
担保/1 | 贷款时请父亲为他 | His father stood behind his bank loan, so the word must mean to guarantee.
赖账/1 | 借了钱还说没借过 | He borrowed money and now says he never did, so the word must mean to refuse to pay.
宽限/1 | 请银行再给一个月 | He asked the bank for one more month until his pay came, so the word must mean to extend a deadline.
仓储/1 | 帮商家存放货物的服务 | The company keeps goods for sellers, so the word must mean storage.
粮仓/1 | 东北平原被称为中国的 | The fertile Northeast Plain feeds much of China, so the word must mean granary.
货仓/1 | 工人把新到的货搬进 | The workers carried the new goods inside, so the word must mean warehouse.
囤积/1 | 商人藏粮食等涨价 | Some merchants keep grain back to sell when prices rise, so the word must mean to hoard.
囤货/1 | 春节前超市提前备货 | Before Spring Festival supermarkets lay in extra goods, so the word must mean to stock up.
物流/1 | 网购两天就能送到 | Things bought online now arrive in two days, so the word must mean logistics.
货运/1 | 铁路主要运东西很少运客人 | The railway carries mainly goods and few passengers, so the word must mean freight transport.
运费/1 | 商品不收送货上门 | The item is delivered to the door for free, so the word must mean freight charge.
发货/1 | 商家今天寄出 | The seller is sending it today and it will arrive within three days, so the word must mean to ship.
集装箱/1 | 码头上五颜六色的等着装船 | Colourful ones fill the dock waiting to be loaded, so the word must mean container.
船舶/1 | 港口每天大量进出 | Many vessels enter and leave the port every day, so the word must mean ship.
舶来品/1 | 咖啡一百年前是外来的 | A century ago coffee came from abroad, so the word must mean import.
帆船/1 | 商人坐着在海上做买卖 | Long ago merchants traded at sea in wind-driven boats, so the word must mean sailing boat.
一帆风顺/1 | 祝你新工作 | The speaker wishes someone well in a new job, so the word must mean smooth sailing.
货轮/1 | 一艘大的装几千个集装箱 | A big one carries thousands of containers, so the word must mean freighter.
商船/1 | 古代来中国买丝绸瓷器 | Ancient ships came to Chinese ports to buy silk and porcelain, so the word must mean merchant ship.
远洋/1 | 货轮开一个月才到非洲 | The freighter takes a month to reach Africa, so the word must mean ocean-going.
航运/1 | 长江是重要的通道 | The Yangtze is a key route for ships, so the word must mean shipping.
吞吐量/1 | 上海港集装箱世界第一 | Shanghai port has led the world in containers handled for years, so the word must mean throughput.
海运/1 | 比空运便宜但慢很多 | It is cheaper but much slower than air freight, so the word must mean sea transport.
洽谈/1 | 两家经理正在谈合作 | The two managers are discussing cooperation, so the word must mean to negotiate.
接洽/1 | 去跟客户了解需求 | The company sent him to meet the client and learn what they need, so the word must mean to liaise.
磋商/1 | 两国代表几轮后签了协议 | After several rounds of talks the two countries signed an agreement, so the word must mean consultation.
双赢/1 | 合作让两家都赚了钱 | Both companies made money from the deal, so the word must mean win-win.
意向/1 | 签了合作书，下一步签正式合同 | The formal contract comes next, so the word must mean intention.
商机/1 | 网上卖家乡土特产 | Selling local specialities online is a good way to make money, so the word must mean business opportunity.
先机/1 | 最早进入市场抢到 | The company entered the market before anyone else, so the word must mean initiative.
让利/1 | 为订单把价格降低 | They lowered the price to win the big order, so the word must mean to cut profits.
底价/1 | 低于这个价格就不卖 | The seller will not sell below a certain price, so the word must mean floor price.
谈妥/1 | 几天商量终于定了价格 | After days of talking the two sides agreed on the price, so the word must mean to settle.
壁垒/1 | 国家设置限制外国商品 | Some countries keep foreign goods out, so the word must mean barrier.
关税/1 | 进口汽车要交 | Imported cars cost more because of a tax at the border, so the word must mean tariff.
自由贸易/1 | 两国协议大部分商品不收关税 | Most goods are no longer taxed under the two countries' agreement, so the word must mean free trade.
自贸区/1 | 进口商品享受更低的税 | Imported goods pay lower taxes there, so the word must mean free trade zone.
顺差/1 | 出口比进口多 | The country exports more than it imports, so the word must mean surplus.
逆差/1 | 进口比出口多 | The country imports more than it exports, so the word must mean deficit.
贸易战/1 | 两国互相提高关税 | The two countries keep raising taxes on each other's goods, so the word must mean trade war.
配额/1 | 每年进口十万吨，超过不能进 | Once a hundred thousand tonnes come in each year, no more may be imported, so the word must mean quota.
倾销/1 | 外国公司用很低价格卖 | Foreign firms sell here at very low prices and local factories suffer, so the word must mean to dump.
报关/1 | 货物出口前向海关 | Goods must be declared to customs before export, so the word must mean to declare at customs.
经济学/1 | 大学研究市场和价格 | At university he studied markets and prices, so the word must mean economics.
宏观/1 | 政府调整利率调控经济 | The government steers the whole economy, for example through interest rates, so the word must mean macro.
微观/1 | 研究一家企业怎样定价 | Studying how one firm sets its prices belongs to this branch, so the word must mean micro.
增长率/1 | 去年经济是百分之五 | The economy grew five per cent last year, so the word must mean growth rate.
国内生产总值/1 | 用来比较各国经济大小 | It is often used to compare the size of countries' economies, so the word must mean GDP.
失业率/1 | 经济不好时往往上升 | It tends to rise when the economy is doing badly, so the word must mean unemployment rate.
供求/1 | 价格由市场的关系决定 | Prices are often set by how much is offered and how much is wanted, so the word must mean supply and demand.
市场经济/1 | 价格主要由市场决定 | Prices are set mainly by the market, so the word must mean market economy.
产业链/1 | 从零件到整车都能生产 | The city can make everything from car parts to whole cars, so the word must mean industrial chain.
服务业/1 | 餐饮、旅游、银行都属于 | Catering, tourism and banking all belong to it, so the word must mean service industry.
`);
