// The texts of the first reading topics of grade 5 (docs/chinese-curriculum.md §18.9): narratives written for this
// subject, classical poems in the public domain with notes written for it, and expository texts written for it. The
// format is that of parsePieces in topic-kit.ts: a question's wrong options carry the reason they are wrong.

/** NARRATIVES_5 are the narratives of reading-5-narrative: their outline, and what their details show. */
export const NARRATIVES_5 = `
# 爷爷的修车摊
爷爷退休以后，在小区门口摆了一个修车摊。他的工具箱是一个旧木箱，里面的扳手、钳子摆得整整齐齐。谁的自行车坏了，推过来，爷爷戴上老花镜，蹲在地上，一会儿就修好了。补一个胎，他只收两块钱；要是学生来修，他干脆不收钱。
有一年冬天，一个送外卖的叔叔在雪地里摔了一跤，车链子断了。那天已经很晚，爷爷正要收摊，看见叔叔急得直搓手，又把工具箱打开了。雪落在爷爷的帽子上，他的手冻得通红，修了半个多小时。叔叔要多给钱，爷爷摆摆手说：“快去送吧，人家还等着吃饭呢。”
后来爷爷年纪大了，蹲不下去了，只好收了摊。可是小区里的人见了他，还是亲热地叫他“修车爷爷”。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 爷爷退休后摆修车摊，收钱少、热心肠，雪夜帮外卖员修车，收摊后大家仍叫他“修车爷爷” | 还是亲热地叫他“修车爷爷” | 在小区门口摆了一个修车摊 | 补一个胎，他只收两块钱 | 有一年冬天，一个送外卖的叔叔在雪地里摔了一跤 | 只好收了摊
- 爷爷在雪夜里帮一个送外卖的叔叔修好了车链子 ~narrow
- 爷爷是小区里最有名的人，大家都很尊敬老人 ~broad
- 爷爷修车收钱很多，后来大家都不找他了 ~reversed
?1 那个冬天的晚上，爷爷为什么又把工具箱打开了？ | Why did Grandpa open his toolbox again that winter night?
= 看见送外卖的叔叔车链子断了，急得直搓手 | 看见叔叔急得直搓手，又把工具箱打开了 | 车链子断了
- 爷爷还没有修完别人的车 ~unsaid
- 叔叔答应多给他钱 ~opposite
?1 爷爷后来为什么收了摊？ | Why did Grandpa close his stall in the end?
= 年纪大了，蹲不下去了 | 爷爷年纪大了，蹲不下去了，只好收了摊
- 小区里没有人修车了 ~unsaid
- 他的工具箱坏了 ~unsaid
?2 “扳手、钳子摆得整整齐齐”这个细节表现了爷爷什么？ | What does the detail of the neatly laid-out tools show of Grandpa?
≈ 做事认真、仔细 | 里面的扳手、钳子摆得整整齐齐 | 一会儿就修好了
- 工具很新很贵 ~opposite
- 他不常修车 ~unsaid
?2 “雪落在爷爷的帽子上，他的手冻得通红，修了半个多小时”，这个细节说明了什么？ | What does the detail of the snow and his red hands show?
≈ 爷爷不怕冷不怕累，一心帮人 | 雪落在爷爷的帽子上，他的手冻得通红，修了半个多小时 | 那天已经很晚，爷爷正要收摊
- 爷爷修车的本领不高 ~sense
- 那天晚上没有下雪 ~opposite
?2 爷爷摆摆手说“快去送吧”，表现了他怎样的想法？ | What does Grandpa's wave and “off you go” show?
≈ 不肯多收钱，替等着吃饭的人着想 | 快去送吧，人家还等着吃饭呢 | 叔叔要多给钱，爷爷摆摆手说
- 嫌叔叔给的钱太少 ~opposite
- 想早点回家休息 ~unsaid

# 一封迟到的信
六年前，姐姐在山区支教，教过一个叫阿木的男孩。阿木家里穷，常常一边放羊一边看书。姐姐走的时候，把自己的一本字典送给了他，说：“有不认识的字，就问它。”
上个星期，姐姐收到了一封信，信封上的字写得工工整整。信是阿木寄来的。他说他考上了县里最好的高中，那本字典已经翻得卷了边，他用胶带一页一页地粘好，还带在身边。他在信的最后写道：“老师，我以后也想当一名老师，回到山里去。”
姐姐读着信，读着读着就笑了，笑着笑着眼睛又湿了。她把信夹进了自己的日记本里。那天晚上，她在灯下给阿木写了一封很长很长的回信。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 姐姐支教时送给阿木一本字典，六年后阿木来信说考上了高中，也想当老师，姐姐感动地回了信 | 她在灯下给阿木写了一封很长很长的回信 | 把自己的一本字典送给了他 | 他说他考上了县里最好的高中 | 我以后也想当一名老师
- 阿木家里很穷，常常一边放羊一边看书 ~narrow
- 姐姐收到一封信，读完就把它扔了 ~reversed
- 山区的孩子都很喜欢读书 ~broad
?1 阿木在信里说了哪几件事？ | What did Amu tell in his letter?
= 考上了高中，字典还带在身边，以后想当老师 | 他说他考上了县里最好的高中 | 那本字典已经翻得卷了边，他用胶带一页一页地粘好，还带在身边 | 我以后也想当一名老师
- 考上了大学，想当医生 ~changed
- 想请姐姐再送他一本字典 ~unsaid
?1 姐姐读完信以后做了什么？ | What did the sister do after reading the letter?
= 把信夹进日记本，晚上写了很长的回信 | 她把信夹进了自己的日记本里 | 她在灯下给阿木写了一封很长很长的回信
- 马上回到山里去看阿木 ~unsaid
- 把字典寄回给阿木 ~unsaid
?2 “字典已经翻得卷了边，他用胶带一页一页地粘好”，这个细节说明了什么？ | What does the detail of the worn, taped dictionary show?
≈ 阿木常常用这本字典，十分珍惜它 | 那本字典已经翻得卷了边，他用胶带一页一页地粘好 | 还带在身边
- 这本字典质量不好 ~sense
- 阿木不爱护书 ~opposite
?2 “读着读着就笑了，笑着笑着眼睛又湿了”，表现了姐姐怎样的心情？ | What does “she smiled as she read, and her eyes grew wet as she smiled” show?
≈ 又高兴又感动 | 读着读着就笑了，笑着笑着眼睛又湿了 | 我以后也想当一名老师，回到山里去
- 很生气 ~mismatch
- 很害怕 ~mismatch
?2 信封上的字“写得工工整整”，可以看出阿木怎样？ | What does the neat handwriting on the envelope show of Amu?
≈ 写信很认真，尊敬老师 | 信封上的字写得工工整整 | 老师，我以后也想当一名老师
- 写字很匆忙 ~opposite
- 不会写字 ~opposite

# 楼道里的灯
我家住的老楼没有电梯，楼道里的灯坏了很久，一到晚上就黑乎乎的。三楼的王奶奶腿脚不好，天一黑就不敢出门。
一天放学，我看见爸爸提着一个小箱子回来，里面是新灯泡和电线。他吃完饭就搬着梯子出去了。我拿着手电筒帮他照着，看他一层一层地换灯泡、接电线，忙得满头是汗。邻居们听到声音，有的端来一杯水，有的帮忙扶梯子。
到了九点多，楼道里的灯一盏一盏地亮了。王奶奶扶着门框站在门口，看了好一会儿，说：“亮了，亮了，我明天可以下楼去买菜了。”爸爸擦了擦汗，笑了。从那以后，谁家门口的灯坏了，邻居们都会自己动手修一修。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 老楼楼道的灯坏了，爸爸和邻居一起修好了灯，王奶奶能下楼了，从此大家都主动修灯 | 邻居们都会自己动手修一修 | 楼道里的灯坏了很久 | 有的帮忙扶梯子 | 我明天可以下楼去买菜了
- 王奶奶腿脚不好，天一黑就不敢出门 ~narrow
- 爸爸买了很多新灯泡，放在了家里 ~reversed
- 老楼里住的都是老人 ~never
?1 这件事的起因是什么？ | What started it all?
= 楼道的灯坏了很久，王奶奶晚上不敢出门 | 楼道里的灯坏了很久 | 天一黑就不敢出门
- 爸爸想学习修电灯 ~unsaid
- 老楼要装电梯 ~opposite
?1 修灯的时候，邻居们做了什么？ | What did the neighbours do while the lights were mended?
= 有的端来水，有的帮忙扶梯子 | 有的端来一杯水，有的帮忙扶梯子
- 都站在旁边看热闹 ~unsaid
- 嫌声音太吵，让爸爸停下 ~opposite
?2 王奶奶“扶着门框站在门口，看了好一会儿”，这个细节表现了什么？ | What does Granny Wang standing a long while at the door show?
≈ 她看到灯亮了，又惊喜又感激 | 王奶奶扶着门框站在门口，看了好一会儿 | 亮了，亮了，我明天可以下楼去买菜了
- 她在等爸爸来修她家的门 ~unsaid
- 她不喜欢楼道太亮 ~opposite
?2 “忙得满头是汗”这个细节，写出了爸爸怎样？ | What does “sweating all over” show of Father?
≈ 修灯很辛苦，他却一直在认真地干 | 忙得满头是汗 | 看他一层一层地换灯泡、接电线
- 那天天气特别热 ~unsaid
- 他身体不舒服 ~unsaid
?2 文章最后一句写邻居们都会自己动手修灯，说明了什么？ | What does the last sentence show?
≈ 爸爸的做法带动了邻居们 | 从那以后，谁家门口的灯坏了，邻居们都会自己动手修一修 | 他吃完饭就搬着梯子出去了 | 有的端来一杯水，有的帮忙扶梯子
- 邻居们都是电工 ~unsaid
- 楼里的灯以后再也不会坏了 ~sense

# 第一次当裁判
学校举行足球赛，体育老师让我当一场比赛的裁判。我高兴极了，前一天晚上把规则读了三遍。
比赛开始了，我们班对五班。下半场，我们班的球员把五班的一个同学绊倒了。我的心怦怦直跳：吹不吹？场边，我们班的同学都在喊：“没犯规！没犯规！”我咬了咬嘴唇，还是吹响了哨子，判五班罚球。五班进了球，最后赢了我们班。
回到教室，有几个同学不理我，我心里很难受。放学的时候，体育老师拍拍我的肩膀说：“你今天判得很公正，好裁判就该这样。”第二天，班长也来找我，说：“我们想了想，那个球确实犯规了。”我们俩相视一笑。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 我第一次当裁判，公正地判了本班犯规，班级输了球，我受了委屈，后来得到老师和同学的理解 | 我们俩相视一笑 | 体育老师让我当一场比赛的裁判 | 判五班罚球 | 有几个同学不理我 | 你今天判得很公正
- 我们班和五班踢了一场足球赛，五班赢了 ~narrow
- 我当裁判时偏向自己班，大家都说我不公平 ~reversed
- 当裁判是世界上最难的事 ~broad
?1 比赛前一天晚上，我做了什么？ | What did I do the night before?
= 把规则读了三遍 | 前一天晚上把规则读了三遍
- 和同学一起练习踢球 ~unsaid
- 早早地睡觉了 ~unsaid
?1 我判了罚球以后，结果怎样？ | What came of the penalty I gave?
= 五班进了球，赢了我们班 | 五班进了球，最后赢了我们班
- 我们班进了球，赢了五班 ~opposite
- 比赛停了下来，没有踢完 ~unsaid
?2 “我咬了咬嘴唇，还是吹响了哨子”，这个细节表现了什么？ | What does “I bit my lip and still blew the whistle” show?
≈ 我心里很为难，最后还是选择了公正 | 我咬了咬嘴唇，还是吹响了哨子 | 我的心怦怦直跳：吹不吹 | 你今天判得很公正
- 我的嘴唇受伤了 ~sense
- 我很想让我们班赢 ~opposite
?2 文中写场边同学喊“没犯规！没犯规！”，有什么作用？ | What does the shouting from the side add?
≈ 写出我当时受到的压力，更显出我判得公正 | 我们班的同学都在喊 | 我的心怦怦直跳：吹不吹 | 还是吹响了哨子，判五班罚球
- 说明那个球真的没有犯规 ~opposite
- 说明同学们都很喜欢足球 ~unsaid
?2 “我们俩相视一笑”，说明了什么？ | What does our shared smile show?
≈ 班长理解了我，我们之间的不愉快消除了 | 我们俩相视一笑 | 我们想了想，那个球确实犯规了 | 有几个同学不理我，我心里很难受
- 我们俩在笑别的同学 ~unsaid
- 班长还在生我的气 ~opposite

# 妈妈的菜园
妈妈在阳台上种了一个小菜园。几个泡沫箱里装满了土，种着小葱、青菜和西红柿。
每天早上，妈妈上班前都要给菜浇水；下班回来，她顾不上换鞋，先去阳台看一看。有一次刮大风，她连夜把几个箱子搬进了屋里，自己却着了凉，咳嗽了好几天。我笑她：“几棵菜，用得着这么费劲吗？”妈妈说：“菜也是有命的，你对它好，它就对你好。”
到了夏天，西红柿结了一串又一串，红红的，像一个个小灯笼。妈妈摘下最大的几个，送给了楼下的邻居。那天晚饭，我吃着妈妈种的西红柿炒鸡蛋，觉得比哪一次都香。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 妈妈在阳台种菜，用心照顾，夏天西红柿丰收，她送给邻居，我吃得特别香 | 我吃着妈妈种的西红柿炒鸡蛋 | 妈妈在阳台上种了一个小菜园 | 有一次刮大风，她连夜把几个箱子搬进了屋里 | 西红柿结了一串又一串 | 送给了楼下的邻居
- 妈妈刮大风那天着了凉，咳嗽了好几天 ~narrow
- 妈妈不会种菜，菜都死了 ~reversed
- 种菜是一件很有意思的事，人人都应该种菜 ~broad
?1 妈妈的菜园里种了什么？ | What grew in Mother's garden?
= 小葱、青菜和西红柿 | 种着小葱、青菜和西红柿
- 小葱、黄瓜和茄子 ~changed
- 只有西红柿 ~part
?1 西红柿成熟以后，妈妈做了什么？ | What did Mother do with the ripe tomatoes?
= 摘下最大的几个送给了邻居 | 妈妈摘下最大的几个，送给了楼下的邻居
- 全部拿到市场上去卖 ~unsaid
- 一个也舍不得摘 ~opposite
?2 “她顾不上换鞋，先去阳台看一看”，这个细节表现了什么？ | What does the detail of her not even changing her shoes show?
≈ 妈妈非常牵挂她种的菜 | 她顾不上换鞋，先去阳台看一看 | 每天早上，妈妈上班前都要给菜浇水
- 妈妈的鞋子坏了 ~sense
- 妈妈下班回来很累，不想动 ~opposite
?2 妈妈说“菜也是有命的”，表达了她怎样的想法？ | What does Mother mean by “vegetables have lives too”?
≈ 对菜要用心爱护，付出就有回报 | 你对它好，它就对你好 | 菜也是有命的 | 西红柿结了一串又一串
- 菜不能吃 ~sense
- 种菜太费劲，不值得 ~opposite
?2 “我”觉得西红柿炒鸡蛋“比哪一次都香”，是因为什么？ | Why did the dish taste better than ever to me?
≈ 这是妈妈用心种出来的菜 | 我吃着妈妈种的西红柿炒鸡蛋 | 觉得比哪一次都香 | 她连夜把几个箱子搬进了屋里，自己却着了凉
- 那天妈妈多放了盐 ~unsaid
- 我那天特别饿 ~unsaid

# 借伞
放学的时候，天下起了大雨。我站在校门口，看着雨发愁。这时，传达室的李伯伯走过来，把一把黑伞递给我：“拿去用吧，明天还我。”
我撑着伞回了家。第二天早上，天晴了，我却忘了带伞。第三天，我又忘了。到了第四天，我才想起来，赶紧把伞擦干净，跑到传达室。李伯伯正在扫地，他接过伞，笑着说：“我还以为你不来了呢。”我的脸一下子红到了耳朵根。
从那以后，借了别人的东西，我都用一张小纸条记下来，贴在书桌前，还了就撕掉。我明白了，说好的事，就要说到做到。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 雨天李伯伯借伞给我，我拖了几天才还，感到惭愧，从此借东西都记下来按时还 | 说好的事，就要说到做到 | 把一把黑伞递给我 | 到了第四天，我才想起来 | 我的脸一下子红到了耳朵根 | 我都用一张小纸条记下来
- 放学的时候下起了大雨，我站在校门口发愁 ~narrow
- 我借了李伯伯的伞，一直没有还 ~reversed
- 下雨天出门一定要带伞 ~never
?1 我是第几天才把伞还给李伯伯的？ | On which day did I return the umbrella?
= 第四天 | 到了第四天，我才想起来
- 第二天 ~changed
- 第三天 ~changed
?1 从那以后，我借了别人的东西会怎么做？ | What do I do with borrowed things since then?
= 用纸条记下来，还了就撕掉 | 我都用一张小纸条记下来，贴在书桌前，还了就撕掉
- 再也不向别人借东西 ~unsaid
- 借了就送给别人 ~unsaid
?2 “我的脸一下子红到了耳朵根”，表现了我怎样的心情？ | What does my face turning red to the ears show?
≈ 非常惭愧 | 我的脸一下子红到了耳朵根 | 我还以为你不来了呢 | 到了第四天，我才想起来
- 非常生气 ~mismatch
- 跑得太累了 ~sense
?2 “赶紧把伞擦干净”这个细节，说明了什么？ | What does my wiping the umbrella clean show?
≈ 我想到自己还晚了，想弥补一点 | 赶紧把伞擦干净，跑到传达室 | 到了第四天，我才想起来
- 伞已经坏了 ~unsaid
- 我不想还伞 ~opposite
?2 李伯伯说“我还以为你不来了呢”时“笑着”，可以看出他怎样？ | What does Uncle Li's smile show of him?
≈ 宽厚，并没有责怪我 | 他接过伞，笑着说 | 我还以为你不来了呢
- 很生气，在批评我 ~opposite
- 不记得借过伞 ~opposite

# 小巷里的书店
我家附近的小巷里，有一家很小的书店。店主是一位戴眼镜的阿姨，她从来不赶看书的孩子走。冬天，她在门口放一个小炉子；夏天，她给孩子们倒凉开水。我在那里看完了好多本书。
有一天，我看见门上贴了一张纸：“本店下月关门。”原来，来买书的人越来越少，房租却越来越贵。我心里空落落的。最后一天，我和几个小伙伴凑了零花钱，买了一本书送给阿姨，在扉页上写着：“谢谢您的书店。”
阿姨接过书，半天说不出话来。她让我们每人挑一本书带走，说：“书要有人读，才算活着。”
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 小巷书店的阿姨让孩子们免费看书，书店要关门时，我们送书感谢她，她也把书送给了我们 | 她让我们每人挑一本书带走 | 她从来不赶看书的孩子走 | 本店下月关门 | 买了一本书送给阿姨
- 书店门上贴了一张纸，说下月关门 ~narrow
- 书店阿姨不喜欢孩子们在店里看书 ~reversed
- 现在的人都不爱看书了 ~broad
?1 书店为什么要关门？ | Why was the shop to close?
= 买书的人越来越少，房租越来越贵 | 来买书的人越来越少，房租却越来越贵 | 本店下月关门
- 阿姨要搬到别的城市 ~unsaid
- 书都卖完了 ~opposite
?1 最后一天，我和小伙伴们做了什么？ | What did we do on the last day?
= 凑钱买了一本书送给阿姨 | 我和几个小伙伴凑了零花钱，买了一本书送给阿姨
- 帮阿姨把书搬走 ~unsaid
- 把看过的书都还给阿姨 ~unsaid
?2 冬天放炉子、夏天倒凉开水，这些细节表现了阿姨怎样？ | What do the stove and the cool water show of her?
≈ 关心爱护来看书的孩子 | 冬天，她在门口放一个小炉子 | 夏天，她给孩子们倒凉开水 | 她从来不赶看书的孩子走
- 想让孩子们多买书 ~unsaid
- 店里的生意很好 ~opposite
?2 “我心里空落落的”，表现了怎样的心情？ | What feeling does “empty inside” show?
≈ 舍不得书店，感到失落 | 我心里空落落的 | 本店下月关门 | 我在那里看完了好多本书
- 很轻松 ~mismatch
- 很得意 ~mismatch
?2 阿姨说“书要有人读，才算活着”，意思是什么？ | What does she mean by “a book lives only when it is read”?
≈ 书只有被人读，才有它的价值 | 书要有人读，才算活着 | 她让我们每人挑一本书带走
- 书是有生命的动物 ~literal
- 书放在店里不会坏 ~sense

# 奶奶学手机
奶奶七十岁了，最近非要学用智能手机。她说：“你们都在外地，我想天天看见你们。”
教奶奶可不容易。她总是分不清哪个是返回键，按着按着就不知道跑到哪里去了。我教了一遍又一遍，有点不耐烦了。奶奶却不着急，她拿出一个小本子，把每一步都画下来：先按哪个圆圈，再点哪个绿色的小方块，旁边还写上大大的字。
一个月以后，我在学校接到了一个视频电话。屏幕上，奶奶举着手机，脸几乎贴到了镜头上，大声说：“你看见我了吗？我学会了！”我看着她，心里又好笑又感动。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 奶奶为了常看到家人学用手机，我教得不耐烦，她用本子记下步骤，一个月后学会了，给我打来视频电话 | 我学会了 | 你们都在外地，我想天天看见你们 | 我教了一遍又一遍，有点不耐烦了 | 她拿出一个小本子，把每一步都画下来 | 一个月以后，我在学校接到了一个视频电话
- 奶奶总是分不清哪个是返回键 ~narrow
- 奶奶学了一个月，还是没有学会用手机 ~reversed
- 老人都喜欢用智能手机 ~broad
?1 奶奶为什么要学用智能手机？ | Why did Granny want to learn?
= 家人在外地，她想天天看见他们 | 你们都在外地，我想天天看见你们 | 最近非要学用智能手机
- 她想用手机看新闻 ~unsaid
- 邻居们都在用 ~unsaid
?1 奶奶是怎样学会的？ | How did Granny learn?
= 把每一步都画在小本子上，写上大字 | 她拿出一个小本子，把每一步都画下来 | 旁边还写上大大的字
- 去老年大学上课 ~unsaid
- 让我一直在旁边帮她按 ~unsaid
?2 “脸几乎贴到了镜头上”，这个细节写出了奶奶怎样？ | What does her face almost touching the lens show?
≈ 刚学会用，还不熟练，又特别兴奋 | 脸几乎贴到了镜头上 | 你看见我了吗 | 她总是分不清哪个是返回键
- 手机的屏幕坏了 ~unsaid
- 奶奶不想让我看见她 ~opposite
?2 奶奶在本子上“旁边还写上大大的字”，说明了什么？ | What do the big characters in her notebook show?
≈ 她年纪大，眼睛不好，却想尽办法学 | 旁边还写上大大的字 | 奶奶七十岁了 | 她拿出一个小本子，把每一步都画下来
- 她写字写得不好 ~sense
- 她不想学了 ~opposite
?2 文章写“我”教得“有点不耐烦了”，有什么作用？ | What does my growing impatience add?
≈ 和奶奶的不着急对比，更显出她学习的决心 | 奶奶却不着急 | 我教了一遍又一遍，有点不耐烦了 | 她拿出一个小本子，把每一步都画下来
- 说明奶奶很笨 ~sense
- 说明我不喜欢奶奶 ~opposite

# 那盆仙人掌
新学期开学，同桌小林带来一盆仙人掌，放在我们两人的桌子中间。我不喜欢它，浑身是刺，一不小心就会扎手。我说：“把它拿走吧。”小林没说话，把花盆往他那边挪了挪。
有一次，我生病请了一个星期的假。回到学校，发现我的书桌干干净净，每天的作业都抄好了，整整齐齐地放在抽屉里。仙人掌又挪回了桌子中间，顶上开了一朵小小的黄花。小林说：“它一直在等你回来。”
我看着那朵花，忽然觉得，那些刺也没那么讨厌了。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 我嫌同桌的仙人掌扎手，我生病时同桌帮我抄好作业，我回来看到仙人掌开花，对它和同桌有了新的感受 | 那些刺也没那么讨厌了 | 我不喜欢它，浑身是刺 | 每天的作业都抄好了 | 顶上开了一朵小小的黄花
- 我生病请了一个星期的假 ~narrow
- 小林很生气，把仙人掌带回了家 ~reversed
- 仙人掌是最好养的植物 ~never
?1 我开始为什么不喜欢仙人掌？ | Why did I dislike the cactus at first?
= 它浑身是刺，容易扎手 | 浑身是刺，一不小心就会扎手 | 我不喜欢它
- 它长得太高了 ~unsaid
- 它的花不好看 ~unsaid
?1 我回到学校时，看到了什么？ | What did I find when I came back?
= 书桌干干净净，作业都抄好了，仙人掌开了花 | 回到学校，发现我的书桌干干净净 | 每天的作业都抄好了，整整齐齐地放在抽屉里 | 顶上开了一朵小小的黄花
- 仙人掌被拿走了 ~opposite
- 同桌换了一个人 ~unsaid
?2 “小林没说话，把花盆往他那边挪了挪”，表现了小林怎样？ | What does Xiaolin quietly moving the pot show?
≈ 宽容，体谅我的感受 | 把花盆往他那边挪了挪 | 小林没说话 | 把它拿走吧
- 很生气，不想理我 ~opposite
- 想把仙人掌藏起来 ~unsaid
?2 “它一直在等你回来”，这句话表达了什么？ | What does “it was waiting for you” express?
≈ 小林一直盼着我回来 | 它一直在等你回来 | 每天的作业都抄好了，整整齐齐地放在抽屉里
- 仙人掌真的会等人 ~literal
- 小林不想让我回来 ~opposite
?2 结尾“那些刺也没那么讨厌了”，说明我有了什么变化？ | What change does the last line show in me?
≈ 我感受到同桌的关心，对仙人掌和他的看法都变了 | 我看着那朵花，忽然觉得，那些刺也没那么讨厌了 | 我不喜欢它 | 每天的作业都抄好了
- 仙人掌上的刺都掉了 ~literal
- 我还是讨厌仙人掌 ~opposite

# 一张奖状
期末，我得了一张“劳动小能手”的奖状。我把它拿回家，想让爸爸看看。可是爸爸加班，很晚才回来，我等着等着就睡着了。
第二天早上醒来，我发现奖状已经贴在了客厅最显眼的墙上，四个角都用透明胶粘得平平整整。爸爸早已上班去了，桌上留着一张纸条：“儿子，你真棒！爸爸为你骄傲。”
那天放学，我做的第一件事，是把家里的地拖得干干净净。晚上爸爸回来，看见亮亮的地板，摸摸我的头，什么也没说，可我看见他笑得眼睛都眯成了一条缝。
?1 下面哪一项最适合作为这篇文章的梗概？ | Which is the best outline of the text?
≈ 我得了劳动奖状，爸爸加班没看到，却悄悄把它贴上墙、留了纸条，我拖干净地来回应，爸爸很高兴 | 我看见他笑得眼睛都眯成了一条缝 | 我得了一张“劳动小能手”的奖状 | 爸爸加班 | 奖状已经贴在了客厅最显眼的墙上 | 把家里的地拖得干干净净
- 我等爸爸回来，等着等着就睡着了 ~narrow
- 爸爸看不起我的奖状，把它收了起来 ~reversed
- 每个孩子都应该得奖状 ~broad
?1 我拿回奖状那天，为什么没有让爸爸看到？ | Why did Father not see the certificate that night?
= 爸爸加班，很晚才回来，我睡着了 | 可是爸爸加班，很晚才回来 | 我等着等着就睡着了
- 爸爸出差去了外地 ~unsaid
- 我把奖状弄丢了 ~unsaid
?1 那天放学，我做的第一件事是什么？ | What did I do first after school that day?
= 把家里的地拖得干干净净 | 把家里的地拖得干干净净
- 去爸爸的单位找他 ~unsaid
- 又贴了一张奖状 ~unsaid
?2 奖状“四个角都用透明胶粘得平平整整”，说明了什么？ | What do the neatly taped corners show?
≈ 爸爸很珍视我的奖状 | 四个角都用透明胶粘得平平整整 | 贴在了客厅最显眼的墙上 | 爸爸为你骄傲
- 透明胶很好用 ~sense
- 爸爸贴得很随便 ~opposite
?2 爸爸“什么也没说”却“笑得眼睛都眯成了一条缝”，表现了什么？ | What does his silent, wide smile show?
≈ 爸爸心里非常高兴、满意 | 笑得眼睛都眯成了一条缝 | 看见亮亮的地板，摸摸我的头，什么也没说
- 爸爸很累，眼睛睁不开 ~sense
- 爸爸对我不满意 ~opposite
?2 我放学后拖地，是想表达什么？ | What did I mean to say by mopping the floor?
≈ 用行动回应爸爸的鼓励，不辜负这张奖状 | 那天放学，我做的第一件事 | 把家里的地拖得干干净净 | 我得了一张“劳动小能手”的奖状 | 儿子，你真棒
- 我想再得一张奖状 ~unsaid
- 地太脏，妈妈让我拖的 ~unsaid
`;

/** POEMS_5 are the classical poems of reading-5-poems, in the public domain, with notes written for this subject. */
export const POEMS_5 = `
# 鸟鸣涧（唐·王维）
人闲桂花落，夜静春山空。
月出惊山鸟，时鸣春涧中。
注：涧，山间的小溪。时，时时、不时。
?1 诗人是在什么时候写下这些景物的？ | At what time does the poet picture these sights?
= 春天的夜里 | 夜静春山空 | 鸟鸣涧
- 秋天的早上 ~changed
- 夏天的中午 ~changed
?1 山鸟为什么被“惊”动了？ | What startled the mountain birds?
= 月亮升起来了 | 月出惊山鸟 | 时鸣春涧中
- 有人在山里砍柴 ~unsaid
- 打起了大雷 ~unsaid
?1 “人闲桂花落”写出了一种怎样的环境？ | What setting does “桂花 falls while one is idle” picture?
≈ 非常安静，连花落下都能觉察 | 人闲桂花落 | 夜静春山空
% 桂花很小，落下来几乎没有声音，诗人却觉察到了。能注意到这么轻的事，说明人很闲，四周也很静；下半句“夜静春山空”正好说出了这份静。 | Osmanthus flowers are tiny and fall almost without a sound, yet the poet notices them. To notice so slight a thing one must be at ease and all around must be still; the next words, “the night is still, the spring hills empty”, say just that stillness.
- 风很大，把花都吹落了 ~unsaid
- 人们正忙着摘花 ~opposite
?2 这首诗表达了诗人怎样的心情？ | What feeling does the poem express?
≈ 悠闲、宁静 | 人闲桂花落，夜静春山空 | 时鸣春涧中
- 焦急不安 ~nomood
- 悲伤难过 ~nomood
?2 诗中写鸟叫，是为了说明什么？ | Why does the poem tell of birdsong?
≈ 用鸟叫声衬托出山里的静 | 时鸣春涧中 | 夜静春山空 | 时，时时、不时
% 山里静得连月亮升起都能惊动山鸟，鸟儿只是不时地叫几声。在一片安静里，偶尔的鸟叫听得格外清楚，反而让人更觉出山里的静：这是用声音衬托安静。 | The hills are so still that the rising moon startles the birds, which call now and then. In such quiet an odd call is heard all the more clearly and makes the stillness felt the more: sound sets off silence.
- 说明山里非常热闹 ~opposite
- 说明鸟儿饿了 ~unsaid
?2 读这首诗，你眼前会出现怎样的画面？ | What picture does the poem bring to mind?
≈ 月光下，静静的春山里，鸟儿偶尔在溪边鸣叫 | 时鸣春涧中 | 月出惊山鸟 | 夜静春山空
- 大雨中，人们在山路上奔跑 ~never
- 白天里，孩子们在溪边打水仗 ~never

# 秋浦歌（唐·李白）
白发三千丈，缘愁似个长。
不知明镜里，何处得秋霜。
注：缘，因为。似个，像这样。秋霜，指白发。
?1 “白发三千丈”是真的有三千丈长吗？ | Is the white hair really three thousand zhang long?
≈ 不是，是夸张，说愁多 | 白发三千丈，缘愁似个长 | 缘，因为
% 人的头发不可能有三千丈长。诗人接着说“缘愁似个长”，白发是因为愁才这样长，所以“三千丈”是夸张，说的是愁有多么多、多么长。 | No one's hair could be three thousand zhang long. The poet goes on: “for sorrow it grows so long”, so the length comes of sorrow, and the three thousand zhang is an overstatement telling how much and how long the sorrow is.
- 是的，诗人的头发真的这么长 ~literal
- 不是，说的是一条白色的河 ~unsaid
?1 诗人在哪里看见了自己的白发？ | Where did the poet see his white hair?
= 镜子里 | 不知明镜里 | 何处得秋霜
- 河水里 ~unsaid
- 朋友的画里 ~unsaid
?1 诗中的“秋霜”指的是什么？ | What does 秋霜 stand for in the poem?
= 白发 | 秋霜，指白发
- 秋天早上的霜 ~literal
- 镜子上的灰 ~unsaid
?2 这首诗表达了诗人怎样的心情？ | What feeling does the poem express?
≈ 忧愁很深 | 缘愁似个长 | 白发三千丈
- 非常快乐 ~nomood
- 十分骄傲 ~nomood
?2 “不知明镜里，何处得秋霜”，表现了诗人看到镜子时怎样？ | What does the last couplet show of the poet at the mirror?
≈ 吃惊又感叹，不知不觉就老了 | 不知明镜里，何处得秋霜 | 秋霜，指白发
- 很高兴自己长了白发 ~nomood
- 在问别人镜子是从哪里买的 ~literal
?2 诗人用“三千丈”来写白发，好在哪里？ | What is gained by “three thousand zhang”?
≈ 用夸张把看不见的愁写得可以看见 | 白发三千丈 | 缘愁似个长
- 说明诗人很爱留长发 ~literal
- 说明诗人会计算长度 ~sense

# 十五夜望月（唐·王建）
中庭地白树栖鸦，冷露无声湿桂花。
今夜月明人尽望，不知秋思落谁家。
注：中庭，院子里。栖，鸟停在树上。秋思，秋天里思念亲人的心情。
?1 “中庭地白”是什么原因？ | Why is the ground of the court white?
≈ 月光照在地上 | 中庭地白树栖鸦 | 今夜月明人尽望
% 诗写的是夜里，院子里的地却是白的。第三句说“今夜月明”，月亮很亮，所以地白是月光照在地上。 | The poem is set at night, yet the ground of the courtyard is white. The third line says “tonight the moon is bright”, so the white is moonlight on the ground.
- 下了一场大雪 ~unsaid
- 地上铺着白布 ~unsaid
?1 诗中写到了哪些景物？ | Which sights are in the poem?
= 院子、树上的乌鸦、露水、桂花、明月 | 中庭地白树栖鸦 | 冷露无声湿桂花 | 今夜月明人尽望
- 大河、小船、渔夫 ~never
- 高山、白云、瀑布 ~never
?1 “今夜月明人尽望”，是什么样的夜晚？ | What kind of night is it?
= 月亮很亮，人们都在看月亮 | 今夜月明人尽望 | 十五夜望月
- 天很黑，看不见月亮 ~opposite
- 下着大雨，人们都在家里 ~unsaid
?2 这首诗表达了怎样的感情？ | What feeling does the poem express?
≈ 中秋夜思念亲人 | 不知秋思落谁家 | 秋思，秋天里思念亲人的心情 | 十五夜望月
- 看到月亮很害怕 ~nomood
- 对秋天很厌烦 ~nomood
?2 诗人说“不知秋思落谁家”，好在哪里？ | What is fine in “who knows on whose house the longing falls”?
≈ 不直说自己想家，却写出人人都在想念亲人 | 不知秋思落谁家 | 今夜月明人尽望
- 诗人真的不知道朋友住在哪里 ~literal
- 诗人在问秋天的树叶落在哪里 ~literal
?2 “冷露无声湿桂花”中的“冷”字，表现了什么？ | What does 冷 in the second line show?
≈ 夜深了，也带出一种清冷孤单的感觉 | 冷露无声湿桂花 | 中庭地白树栖鸦
- 诗人生病了 ~unsaid
- 天气热得受不了 ~opposite

# 秋思（唐·张籍）
洛阳城里见秋风，欲作家书意万重。
复恐匆匆说不尽，行人临发又开封。
注：家书，写给家里的信。意万重，要说的话很多。复恐，又怕。行人，送信的人。开封，把封好的信打开。
?1 诗人为什么要写家书？ | Why does the poet write home?
≈ 看见秋风，想念家乡 | 洛阳城里见秋风，欲作家书意万重 | 家书，写给家里的信
- 家里来信催他回去 ~unsaid
- 他要搬到洛阳去住 ~unsaid
?1 送信的人要出发了，诗人做了什么？ | What does the poet do as the messenger leaves?
= 又把封好的信打开 | 行人临发又开封
- 把信撕掉了 ~unsaid
- 自己跟着回家了 ~unsaid
?1 “意万重”是什么意思？ | What does 意万重 mean?
= 想说的话很多很多 | 意万重，要说的话很多
- 信写了一万张纸 ~literal
- 信非常重 ~literal
?2 这首诗表达了诗人怎样的感情？ | What feeling does the poem express?
≈ 对家乡和亲人深深的思念 | 欲作家书意万重 | 复恐匆匆说不尽，行人临发又开封
- 对秋天的喜爱 ~nomood
- 对送信人的不满 ~nomood
?2 “又开封”这个动作，写出了诗人怎样的心理？ | What does reopening the letter show of the poet's mind?
≈ 怕有话没说完，牵挂家人 | 复恐匆匆说不尽 | 行人临发又开封 | 开封，把封好的信打开
- 忘了把信装进信封 ~unsaid
- 不想让家人看信 ~opposite
?2 这首诗写思乡，是从哪里写起的？ | Where does the poem start its homesickness?
≈ 从写家书这件小事写起 | 欲作家书意万重 | 行人临发又开封
- 从回家路上的风景写起 ~never
- 从和家人见面写起 ~never

# 山中送别（唐·王维）
山中相送罢，日暮掩柴扉。
春草明年绿，王孙归不归？
注：罢，完了。掩，关上。柴扉，用树枝做的门。王孙，这里指远去的朋友。
?1 诗人送别朋友以后做了什么？ | What does the poet do after the parting?
= 傍晚关上了柴门 | 日暮掩柴扉 | 柴扉，用树枝做的门
- 跟着朋友一起走了 ~unsaid
- 在门口一直坐到天亮 ~unsaid
?1 送别是在什么地方？ | Where is the parting?
= 山中 | 山中相送罢
- 江边 ~changed
- 城门口 ~changed
?1 “春草明年绿”说的是什么时候？ | When is “the spring grass green” said of?
= 明年春天 | 春草明年绿 | 王孙归不归
- 今天傍晚 ~changed
- 去年秋天 ~changed
?2 “王孙归不归？”表达了诗人怎样的感情？ | What feeling is in “will you come back?”
≈ 盼着朋友早日回来 | 王孙归不归 | 春草明年绿 | 王孙，这里指远去的朋友
- 不希望朋友回来 ~opposite
- 对朋友很生气 ~nomood
?2 送别以后“掩柴扉”，透露出诗人怎样的心情？ | What does shutting the door reveal of his heart?
≈ 朋友走了，心里有些寂寞 | 日暮掩柴扉 | 山中相送罢
- 很高兴终于安静了 ~nomood
- 害怕有人来偷东西 ~unsaid
?2 这首诗的感情是从哪里看出来的？ | Where is the feeling seen?
≈ 从送别后的动作和对明年的问话里 | 春草明年绿，王孙归不归 | 日暮掩柴扉
- 从诗人大哭的样子里 ~unsaid
- 从诗里写的宴会里 ~never

# 劳劳亭（唐·李白）
天下伤心处，劳劳送客亭。
春风知别苦，不遣柳条青。
注：劳劳亭，古代送别的地方。遣，让。古人送别时常折柳相送。
?1 劳劳亭是一个什么样的地方？ | What place is the Laolao pavilion?
= 古人送别的地方 | 劳劳亭，古代送别的地方
- 卖柳条的地方 ~unsaid
- 读书的地方 ~unsaid
?1 诗中的春风做了什么？ | What does the spring wind do in the poem?
= 不让柳条变青 | 不遣柳条青 | 遣，让
- 把柳条吹断了 ~unsaid
- 让柳条变得更绿 ~opposite
?1 诗人为什么说劳劳亭是“天下伤心处”？ | Why is it “the saddest place under heaven”?
≈ 人们在这里分别 | 劳劳送客亭 | 劳劳亭，古代送别的地方
- 这里的风景不好看 ~unsaid
- 这里常常有人生病 ~unsaid
?2 这首诗表达了怎样的感情？ | What feeling does the poem express?
≈ 离别的痛苦 | 春风知别苦 | 天下伤心处
- 春天到来的欢喜 ~nomood
- 对风景的赞美 ~nomood
?2 “春风知别苦，不遣柳条青”，诗人这样写，好在哪里？ | What is fine in the wind that “knows the pain of parting”?
≈ 把春风当作人来写，连春风都不忍心看人分别 | 春风知别苦，不遣柳条青 | 古人送别时常折柳相送
- 说明那年春天特别冷 ~literal
- 说明柳树生病了 ~literal
?2 诗中提到柳条，和送别有什么关系？ | What have willow twigs to do with parting?
= 古人送别时常折柳相送 | 古人送别时常折柳相送
- 柳条可以用来编篮子 ~life
- 柳树长在每家门口 ~unsaid

# 秋词（唐·刘禹锡）
自古逢秋悲寂寥，我言秋日胜春朝。
晴空一鹤排云上，便引诗情到碧霄。
注：寂寥，冷清、孤单。春朝，春天。排云，冲开云层。碧霄，青天。
?1 诗人对秋天的看法和古人一样吗？ | Is the poet's view of autumn the same as the ancients'?
= 不一样，他认为秋天胜过春天 | 我言秋日胜春朝 | 自古逢秋悲寂寥
- 一样，他也觉得秋天冷清 ~opposite
- 一样，他觉得春天最好 ~opposite
?1 诗中写了一个什么画面？ | What picture does the poem paint?
= 晴空里，一只鹤冲开云层飞上去 | 晴空一鹤排云上 | 排云，冲开云层
- 一群大雁排成队往南飞 ~changed
- 秋风吹落了满地黄叶 ~never
?1 “自古逢秋悲寂寥”说的是什么？ | What does the first line say?
= 从古以来，人们一到秋天就悲叹冷清 | 自古逢秋悲寂寥 | 寂寥，冷清、孤单
- 诗人一到秋天就生病 ~unsaid
- 古时候秋天特别冷 ~literal
?2 这首诗表达了诗人怎样的情感？ | What feeling does the poem express?
≈ 乐观向上，对秋天充满喜爱 | 我言秋日胜春朝 | 晴空一鹤排云上，便引诗情到碧霄
- 悲伤孤单 ~opposite
- 害怕秋天 ~nomood
?2 “便引诗情到碧霄”是什么意思？ | What does the last line mean?
= 鹤带着诗人的兴致一直飞上了青天 | 便引诗情到碧霄 | 碧霄，青天
- 诗人坐着鹤飞上了天 ~literal
- 诗人把诗写在了天上 ~literal
?2 诗中的那只鹤，表现了什么？ | What does the crane stand for in the poem?
≈ 一种奋发向上的精神 | 晴空一鹤排云上 | 便引诗情到碧霄 | 我言秋日胜春朝
- 秋天的冷清 ~opposite
- 诗人想养一只鹤 ~unsaid

# 问刘十九（唐·白居易）
绿蚁新醅酒，红泥小火炉。
晚来天欲雪，能饮一杯无？
注：绿蚁，新酿的米酒面上浮着的绿色泡沫。醅，酿。无，吗。
?1 诗人准备了什么来招待朋友？ | What has the poet ready for his friend?
= 新酿的酒和红泥小火炉 | 绿蚁新醅酒 | 红泥小火炉
- 一桌好菜和新茶 ~unsaid
- 新买的书和笔 ~never
?1 这是一个什么样的傍晚？ | What evening is it?
= 天快要下雪了 | 晚来天欲雪 | 问刘十九
- 正下着大雨 ~changed
- 太阳很好，很暖和 ~opposite
?1 诗的最后一句是在做什么？ | What does the last line do?
≈ 邀请朋友来喝一杯 | 能饮一杯无 | 无，吗 | 问刘十九
- 劝朋友不要喝酒 ~opposite
- 问朋友喝了几杯 ~literal
?2 这首诗表达了诗人对朋友怎样的感情？ | What feeling for the friend is in the poem?
≈ 亲切热情，盼着朋友来 | 能饮一杯无 | 绿蚁新醅酒，红泥小火炉
- 冷淡，不想见朋友 ~opposite
- 生气，责怪朋友 ~nomood
?2 诗中“红泥小火炉”和“天欲雪”放在一起，给人什么感觉？ | What do the stove and the coming snow give together?
≈ 外面寒冷，屋里温暖 | 晚来天欲雪 | 红泥小火炉
- 屋里也很冷 ~opposite
- 火炉太热，让人难受 ~unsaid
?2 这首诗读起来像什么？ | What does the poem read like?
≈ 一张写给朋友的亲切的请帖 | 能饮一杯无 | 问刘十九 | 绿蚁新醅酒，红泥小火炉
- 一封告别的信 ~nomood
- 一篇说明怎样酿酒的文章 ~never

# 夜雨寄北（唐·李商隐）
君问归期未有期，巴山夜雨涨秋池。
何当共剪西窗烛，却话巴山夜雨时。
注：君，你，这里指家里的亲人。巴山，今天四川一带的山。何当，什么时候才能。却话，回头说起。
?1 亲人问诗人什么时候回家，诗人怎样回答？ | How does the poet answer when asked when he will return?
= 还没有确定的日子 | 君问归期未有期 | 君，你，这里指家里的亲人
- 明天就回去 ~opposite
- 永远不回去了 ~unsaid
?1 诗人写信的时候，外面是什么样子？ | What is it like outside as he writes?
= 巴山下着夜雨，池塘里的水涨了 | 巴山夜雨涨秋池 | 夜雨寄北
- 月亮很亮，满天星星 ~opposite
- 下着大雪 ~changed
?1 诗人盼望将来做什么？ | What does the poet hope to do one day?
= 和亲人在西窗下剪烛，说起今晚的雨 | 何当共剪西窗烛，却话巴山夜雨时 | 却话，回头说起
- 再去巴山看雨 ~unsaid
- 在西窗下读书 ~unsaid
?2 这首诗表达了诗人怎样的感情？ | What feeling does the poem express?
≈ 思念亲人，盼望团聚 | 何当共剪西窗烛 | 君问归期未有期
- 喜欢巴山的雨 ~nomood
- 不想回家 ~opposite
?2 “巴山夜雨”在诗中出现了两次，有什么作用？ | Why does 巴山夜雨 come twice?
≈ 现在的孤单和将来的团聚连在一起，更显思念 | 却话巴山夜雨时 | 巴山夜雨涨秋池 | 何当共剪西窗烛
- 说明巴山每天都下雨 ~literal
- 诗人写错了 ~sense
?2 “涨秋池”的雨水，让人感到诗人怎样？ | What does the rising pool make one feel of the poet?
≈ 思念像池水一样越涨越多 | 巴山夜雨涨秋池 | 君问归期未有期
- 担心池塘里的鱼 ~unsaid
- 很喜欢下雨 ~nomood

# 逢入京使（唐·岑参）
故园东望路漫漫，双袖龙钟泪不干。
马上相逢无纸笔，凭君传语报平安。
注：故园，家乡。龙钟，这里是沾湿的样子。凭，请。君，你，指去京城的使者。
?1 诗人遇见了谁？ | Whom does the poet meet?
= 去京城的使者 | 凭君传语报平安 | 君，你，指去京城的使者
- 家里的亲人 ~unsaid
- 一起打仗的朋友 ~unsaid
?1 诗人为什么请使者带口信，而不写信？ | Why a spoken message and no letter?
= 在马上相遇，没有纸和笔 | 马上相逢无纸笔 | 凭君传语报平安
- 诗人不会写字 ~unsaid
- 怕信被弄丢 ~unsaid
?1 诗人要带回家的话是什么？ | What is the message home?
= 报个平安 | 凭君传语报平安 | 马上相逢无纸笔
- 让家人来接他 ~unsaid
- 说自己生病了 ~opposite
?2 “双袖龙钟泪不干”表现了诗人怎样的感情？ | What does the tear-soaked sleeves show?
≈ 对家乡亲人深深的思念 | 双袖龙钟泪不干 | 故园东望路漫漫 | 龙钟，这里是沾湿的样子
- 被风沙吹得眼睛疼 ~literal
- 遇见使者太高兴了 ~nomood
?2 诗人只让使者说“平安”，好在哪里？ | What is fine in sending only “all is well”?
≈ 心里难过，却只报平安，怕家人担心 | 凭君传语报平安 | 双袖龙钟泪不干
- 诗人没有别的话想说 ~opposite
- 使者记不住太多的话 ~unsaid
?2 “故园东望路漫漫”写出了什么？ | What does the first line show?
≈ 离家很远，回家的路很长 | 故园东望路漫漫 | 故园，家乡
- 家就在不远的地方 ~opposite
- 诗人在看东边的太阳 ~literal
`;

/** EXPOSITORY_5 are the expository texts of reading-5-expository: their points, and the methods by which they explain. */
export const EXPOSITORY_5 = `
# 蜂鸟
蜂鸟是世界上最小的鸟。最小的蜂鸟只有五厘米长，体重不到两克，和一只大蜜蜂差不多。
蜂鸟的翅膀扇得非常快，每秒钟能扇五十次以上，快得人眼都看不清，只能听到“嗡嗡”的声音，它的名字就是这么来的。蜂鸟还是唯一能向后飞的鸟，它能像直升机一样停在空中，把长长的嘴伸进花里吸花蜜。
蜂鸟吃得很多。它每天吃下的花蜜，比它自己的体重还要多。因为它飞得太费力气了，必须不停地吃东西。
?1 第一段主要说明了蜂鸟的什么特点？ | What point does the first paragraph make?
≈ 非常小 | 蜂鸟是世界上最小的鸟 | 最小的蜂鸟只有五厘米长，体重不到两克
- 飞得很快 ~elsewhere
- 吃得很多 ~elsewhere
?1 蜂鸟为什么叫“蜂鸟”？ | Why is it called the bee bird?
= 翅膀扇得快，发出“嗡嗡”的声音 | 只能听到“嗡嗡”的声音，它的名字就是这么来的 | 蜂鸟的翅膀扇得非常快
- 它爱吃蜂蜜 ~unsaid
- 它住在蜂窝里 ~unsaid
?1 蜂鸟为什么必须不停地吃东西？ | Why must it keep eating?
= 飞得太费力气 | 因为它飞得太费力气了，必须不停地吃东西
- 花蜜一点也不甜 ~unsaid
- 它的嘴很长 ~other
?2 “最小的蜂鸟只有五厘米长，体重不到两克”，用了什么说明方法？ | What method explains “only five centimetres and under two grams”?
≈ 列数字 | 最小的蜂鸟只有五厘米长，体重不到两克
% “最小的蜂鸟只有五厘米长，体重不到两克”用确切的数字来说明，这种说明方法叫列数字。 | “最小的蜂鸟只有五厘米长，体重不到两克” gives exact figures: that method is giving figures.
- 打比方 ~nolikening
- 下定义 ~nodefine
?2 “和一只大蜜蜂差不多”，用了什么说明方法？ | What method is “about the size of a big bee”?
≈ 作比较 | 和一只大蜜蜂差不多
% “和一只大蜜蜂差不多”拿两样东西放在一起比，这种说明方法叫作比较。 | “和一只大蜜蜂差不多” sets two things side by side: that method is comparison.
- 举例子 ~noexample
- 分类别 ~nokinds
?2 “它能像直升机一样停在空中”，用了什么说明方法？ | What method is “hangs in the air like a helicopter”?
≈ 打比方 | 它能像直升机一样停在空中
% “它能像直升机一样停在空中”把要说明的东西比作另一样常见的东西，说得形象，这种说明方法叫打比方。 | “它能像直升机一样停在空中” likens the thing explained to something familiar: that method is analogy.
- 列数字 ~nonumber
- 分类别 ~nokinds

# 珊瑚
很多人以为珊瑚是一种石头，或者是一种植物，其实，我们看到的珊瑚，是由许许多多叫珊瑚虫的小动物造出来的。
珊瑚虫只有米粒那么大，它们一群一群地生活在温暖的浅海里。每个珊瑚虫都会分泌出一种石灰质的东西，把自己包起来。老的珊瑚虫死了，新的又在上面长出来，一代一代地堆积，就形成了各种形状的珊瑚，有的像鹿角，有的像蘑菇，有的像人的脑子。
珊瑚长得很慢，一年只能长几毫米到几厘米。大片的珊瑚连在一起，叫作珊瑚礁。澳大利亚东边的大堡礁，长两千多公里，是世界上最大的珊瑚礁。
?1 这篇短文主要说明了什么？ | What does the text chiefly explain?
≈ 珊瑚是珊瑚虫造出来的，以及它是怎样形成的 | 我们看到的珊瑚，是由许许多多叫珊瑚虫的小动物造出来的 | 一代一代地堆积，就形成了各种形状的珊瑚
- 珊瑚是一种好看的石头 ~opposite
- 大堡礁在澳大利亚 ~narrow
?1 珊瑚虫生活在哪里？ | Where do coral polyps live?
= 温暖的浅海里 | 它们一群一群地生活在温暖的浅海里
- 寒冷的深海里 ~opposite
- 河流和湖泊里 ~unsaid
?1 珊瑚是怎样一代一代堆积起来的？ | How does coral build up?
= 老的珊瑚虫死了，新的又在上面长出来 | 老的珊瑚虫死了，新的又在上面长出来
- 海浪把石头堆在一起 ~unsaid
- 人们把珊瑚种在海里 ~unsaid
?2 “珊瑚虫只有米粒那么大”，用了什么说明方法？ | What method is “as big as a grain of rice”?
≈ 作比较 | 珊瑚虫只有米粒那么大
% “珊瑚虫只有米粒那么大”拿两样东西放在一起比，这种说明方法叫作比较。 | “珊瑚虫只有米粒那么大” sets two things side by side: that method is comparison.
- 列数字 ~nonumber
- 下定义 ~nodefine
?2 “有的像鹿角，有的像蘑菇，有的像人的脑子”，用了什么说明方法？ | What method is “some like antlers, some like mushrooms”?
≈ 打比方 | 有的像鹿角，有的像蘑菇，有的像人的脑子
% “有的像鹿角，有的像蘑菇，有的像人的脑子”把要说明的东西比作另一样常见的东西，说得形象，这种说明方法叫打比方。 | “有的像鹿角，有的像蘑菇，有的像人的脑子” likens the thing explained to something familiar: that method is analogy.
- 列数字 ~nonumber
- 下定义 ~nodefine
?2 “大片的珊瑚连在一起，叫作珊瑚礁”，用了什么说明方法？ | What method is “joined coral is called a reef”?
≈ 下定义 | 大片的珊瑚连在一起，叫作珊瑚礁
% “大片的珊瑚连在一起，叫作珊瑚礁”用简明的话说清楚它是什么，这种说明方法叫下定义。 | “大片的珊瑚连在一起，叫作珊瑚礁” says plainly what the thing is: that method is defining.
- 打比方 ~nolikening
- 举例子 ~noexample

# 竹子的用处
竹子的用处很多，可以分成几类来说。
第一类是吃的。春天刚从土里冒出来的竹笋，又嫩又鲜，是一道好菜。第二类是用的。竹子可以编成篮子、席子、扇子，还可以做成筷子、竹椅。第三类是建房子的。在南方一些地方，人们用竹子搭房子，又结实又凉快。
竹子长得特别快。有一种毛竹，在雨季里一天能长高一米左右，几十天就能长到二十多米高。比起要长几十年的松树，竹子真是快多了。
?1 第二段主要说明了竹子的什么？ | What does the second paragraph explain?
≈ 竹子的几类用处 | 竹子的用处很多，可以分成几类来说 | 第一类是吃的 | 第二类是用的 | 第三类是建房子的
- 竹子长得特别快 ~elsewhere
- 竹笋又嫩又鲜 ~narrow
?1 文中说，南方一些地方的人用竹子搭房子，有什么好处？ | What is good about bamboo houses?
= 又结实又凉快 | 人们用竹子搭房子，又结实又凉快
- 又便宜又好看 ~changed
- 一天就能搭好 ~unsaid
?1 毛竹在雨季里长得有多快？ | How fast does mao bamboo grow in the rains?
= 一天能长高一米左右 | 在雨季里一天能长高一米左右
- 一年能长高一米 ~changed
- 一天能长高二十多米 ~figure
?2 “第一类是吃的……第二类是用的……第三类是建房子的”，用了什么说明方法？ | What method sorts the uses into first, second and third?
≈ 分类别 | 第一类是吃的
% “第一类是吃的”把事物分成几类，一类一类地说明，这种说明方法叫分类别。 | “第一类是吃的” sorts things into kinds and explains them kind by kind: that method is classifying.
- 打比方 ~nolikening
- 作比较 ~nocompare
?2 “比起要长几十年的松树，竹子真是快多了”，用了什么说明方法？ | What method sets bamboo beside the pine?
≈ 作比较 | 比起要长几十年的松树，竹子真是快多了
% “比起要长几十年的松树，竹子真是快多了”拿两样东西放在一起比，这种说明方法叫作比较。 | “比起要长几十年的松树，竹子真是快多了” sets two things side by side: that method is comparison.
- 举例子 ~noexample
- 下定义 ~nodefine
?2 “竹子可以编成篮子、席子、扇子”，用了什么说明方法？ | What method names baskets, mats and fans?
≈ 举例子 | 竹子可以编成篮子、席子、扇子
% “竹子可以编成篮子、席子、扇子”举出具体的事物来说明，这种说明方法叫举例子。 | “竹子可以编成篮子、席子、扇子” gives real examples: that method is giving examples.
- 列数字 ~nonumber
- 打比方 ~nolikening

# 冰川
冰川是在寒冷的高山和两极地区，由多年积雪变成的、能够缓慢流动的巨大冰体。
冰川看起来一动不动，其实它一直在流动，只是流得很慢，有的一天只移动几厘米，像一条凝固的大河在悄悄地往下走。
冰川是地球上最大的淡水库。地球上的淡水，有三分之二以上都存在冰川里。我国西部的高山上也有很多冰川，长江、黄河的源头，就有冰川的融水。
可是，这些年地球变暖，很多冰川正在变小。保护冰川，就是保护我们的水。
?1 冰川是由什么变成的？ | What is a glacier made from?
= 多年的积雪 | 由多年积雪变成的
- 海水 ~unsaid
- 雨水 ~unsaid
?1 第三段主要说明了冰川的什么？ | What does the third paragraph explain?
= 冰川是地球上最大的淡水库 | 冰川是地球上最大的淡水库
- 冰川流动得很慢 ~elsewhere
- 冰川正在变小 ~elsewhere
?1 很多冰川为什么正在变小？ | Why are many glaciers shrinking?
= 地球变暖 | 这些年地球变暖，很多冰川正在变小
- 人们把冰拿去用了 ~unsaid
- 冰川流到了海里 ~unsaid
?2 第一句“冰川是……巨大冰体”，用了什么说明方法？ | What method is the first sentence?
≈ 下定义 | 能够缓慢流动的巨大冰体
% “能够缓慢流动的巨大冰体”用简明的话说清楚它是什么，这种说明方法叫下定义。 | “能够缓慢流动的巨大冰体” says plainly what the thing is: that method is defining.
- 打比方 ~nolikening
- 列数字 ~nonumber
?2 “像一条凝固的大河在悄悄地往下走”，用了什么说明方法？ | What method is “like a frozen river creeping down”?
≈ 打比方 | 像一条凝固的大河在悄悄地往下走
% “像一条凝固的大河在悄悄地往下走”把要说明的东西比作另一样常见的东西，说得形象，这种说明方法叫打比方。 | “像一条凝固的大河在悄悄地往下走” likens the thing explained to something familiar: that method is analogy.
- 作比较 ~nocompare
- 分类别 ~nokinds
?2 “地球上的淡水，有三分之二以上都存在冰川里”，用了什么说明方法？ | What method is “over two thirds of fresh water”?
≈ 列数字 | 有三分之二以上都存在冰川里
% “有三分之二以上都存在冰川里”用确切的数字来说明，这种说明方法叫列数字。 | “有三分之二以上都存在冰川里” gives exact figures: that method is giving figures.
- 举例子 ~noexample
- 下定义 ~nodefine

# 种子怎样去旅行
植物不会走路，可是它们的种子会想办法去很远的地方安家。
有的种子靠风。蒲公英的种子带着一把把白色的小伞，风一吹，就飘到了远方。有的种子靠动物。苍耳的种子身上长满了小钩，挂在动物的毛上，被带到别的地方。有的种子靠水。椰子掉进海里，能在水上漂流几千公里，漂到别的海岛上发芽。还有的种子靠自己。豆荚晒干以后，“啪”的一声裂开，把种子弹出去。
种子去旅行，是为了找到更好的地方生长，不和妈妈抢阳光和水分。
?1 这篇短文主要说明了什么？ | What does the text chiefly explain?
≈ 种子靠风、动物、水和自己去远处安家 | 有的种子靠风 | 有的种子靠动物 | 有的种子靠水 | 还有的种子靠自己 | 去很远的地方安家
- 蒲公英的种子会飞 ~narrow
- 植物都会走路 ~opposite
?1 苍耳的种子是怎样旅行的？ | How does the cocklebur travel?
= 挂在动物的毛上被带走 | 挂在动物的毛上，被带到别的地方
- 被风吹走 ~other
- 在水上漂流 ~other
?1 种子为什么要去旅行？ | Why do seeds travel?
= 为了找到更好的地方生长 | 种子去旅行，是为了找到更好的地方生长
- 为了看看远方的风景 ~unsaid
- 因为妈妈不要它们了 ~unsaid
?2 “有的种子靠风……有的种子靠动物……有的种子靠水……还有的种子靠自己”，用了什么说明方法？ | What method lists wind, animals, water and themselves?
≈ 分类别 | 还有的种子靠自己
% “还有的种子靠自己”把事物分成几类，一类一类地说明，这种说明方法叫分类别。 | “还有的种子靠自己” sorts things into kinds and explains them kind by kind: that method is classifying.
- 列数字 ~nonumber
- 下定义 ~nodefine
?2 写蒲公英、苍耳、椰子和豆荚，用了什么说明方法？ | What method are the dandelion, cocklebur, coconut and pod?
≈ 举例子 | 蒲公英的种子带着一把把白色的小伞
% “蒲公英的种子带着一把把白色的小伞”举出具体的事物来说明，这种说明方法叫举例子。 | “蒲公英的种子带着一把把白色的小伞” gives real examples: that method is giving examples.
- 作比较 ~nocompare
- 下定义 ~nodefine
?2 “能在水上漂流几千公里”，用了什么说明方法？ | What method is “drifting thousands of kilometres”?
≈ 列数字 | 能在水上漂流几千公里
% “能在水上漂流几千公里”用确切的数字来说明，这种说明方法叫列数字。 | “能在水上漂流几千公里” gives exact figures: that method is giving figures.
- 打比方 ~nolikening
- 分类别 ~nokinds

# 骆驼的驼峰
很多人以为骆驼的驼峰里装的是水，其实，驼峰里装的是脂肪。
一个大驼峰里的脂肪，可以有四十多千克。在沙漠里找不到吃的时候，骆驼就靠驼峰里的脂肪过日子，驼峰就会慢慢变小、变软，甚至倒向一边。等骆驼吃饱了，驼峰又会重新鼓起来。
驼峰就像一个随身带着的“粮仓”。有了它，骆驼可以好多天不吃东西，在沙漠里走很远的路。
骆驼有两种，背上有一个驼峰的叫单峰驼，有两个驼峰的叫双峰驼。
?1 驼峰里装的是什么？ | What is in the hump?
= 脂肪 | 驼峰里装的是脂肪
- 水 ~opposite
- 空气 ~unsaid
?1 骆驼找不到吃的时候，驼峰会怎样？ | What happens to the hump when food runs out?
= 慢慢变小、变软，甚至倒向一边 | 驼峰就会慢慢变小、变软，甚至倒向一边
- 越来越大 ~opposite
- 一点也不变 ~opposite
?1 骆驼分哪两种？ | What are the two kinds of camel?
= 单峰驼和双峰驼 | 背上有一个驼峰的叫单峰驼，有两个驼峰的叫双峰驼 | 骆驼有两种
- 大骆驼和小骆驼 ~unsaid
- 沙漠骆驼和草原骆驼 ~unsaid
?2 “驼峰就像一个随身带着的‘粮仓’”，用了什么说明方法？ | What method is “a granary it carries with it”?
≈ 打比方 | 驼峰就像一个随身带着的“粮仓”
% “驼峰就像一个随身带着的‘粮仓’”把要说明的东西比作另一样常见的东西，说得形象，这种说明方法叫打比方。 | “驼峰就像一个随身带着的‘粮仓’” likens the thing explained to something familiar: that method is analogy.
- 下定义 ~nodefine
- 列数字 ~nonumber
?2 “一个大驼峰里的脂肪，可以有四十多千克”，用了什么说明方法？ | What method is “over forty kilograms”?
≈ 列数字 | 一个大驼峰里的脂肪，可以有四十多千克
% “一个大驼峰里的脂肪，可以有四十多千克”用确切的数字来说明，这种说明方法叫列数字。 | “一个大驼峰里的脂肪，可以有四十多千克” gives exact figures: that method is giving figures.
- 作比较 ~nocompare
- 举例子 ~noexample
?2 最后一段说骆驼有两种，用了什么说明方法？ | What method is the last paragraph?
≈ 分类别 | 背上有一个驼峰的叫单峰驼，有两个驼峰的叫双峰驼
% “背上有一个驼峰的叫单峰驼，有两个驼峰的叫双峰驼”把事物分成几类，一类一类地说明，这种说明方法叫分类别。 | “背上有一个驼峰的叫单峰驼，有两个驼峰的叫双峰驼” sorts things into kinds and explains them kind by kind: that method is classifying.
- 打比方 ~nolikening
- 举例子 ~noexample

# 赵州桥的拱
河北赵州有一座石桥，已经有一千四百多年了，是世界上现存最早的大石拱桥之一。
赵州桥只有一个大拱，像一道弯弯的彩虹横在河上。大拱的两头，各有两个小拱。这种设计很巧妙：发大水的时候，水可以从小拱里流过去，减轻大水对桥身的冲击；同时，小拱也让桥身轻了很多。
一千多年里，赵州桥经历了多次洪水和地震，至今还站在那里。比起后来修的许多石桥，它的设计更加巧妙。
?1 赵州桥已经有多少年了？ | How old is the Zhaozhou bridge?
= 一千四百多年 | 已经有一千四百多年了
- 一百四十多年 ~figure
- 四百多年 ~figure
?1 大拱两头的小拱有什么用处？ | What are the small arches for?
= 让水流过去、减轻冲击，还让桥身变轻 | 水可以从小拱里流过去，减轻大水对桥身的冲击 | 小拱也让桥身轻了很多
- 让人们在里面休息 ~unsaid
- 只是为了好看 ~unsaid
?1 这篇短文主要说明了赵州桥的什么？ | What does the text chiefly explain?
≈ 赵州桥历史悠久，设计巧妙 | 这种设计很巧妙 | 已经有一千四百多年了 | 至今还站在那里
- 赵州桥在河北 ~narrow
- 中国有很多石桥 ~broad
?2 “像一道弯弯的彩虹横在河上”，用了什么说明方法？ | What method is “like a rainbow over the river”?
≈ 打比方 | 像一道弯弯的彩虹横在河上
% “像一道弯弯的彩虹横在河上”把要说明的东西比作另一样常见的东西，说得形象，这种说明方法叫打比方。 | “像一道弯弯的彩虹横在河上” likens the thing explained to something familiar: that method is analogy.
- 举例子 ~noexample
- 列数字 ~nonumber
?2 “比起后来修的许多石桥，它的设计更加巧妙”，用了什么说明方法？ | What method sets it beside later bridges?
≈ 作比较 | 比起后来修的许多石桥，它的设计更加巧妙
% “比起后来修的许多石桥，它的设计更加巧妙”拿两样东西放在一起比，这种说明方法叫作比较。 | “比起后来修的许多石桥，它的设计更加巧妙” sets two things side by side: that method is comparison.
- 分类别 ~nokinds
- 下定义 ~nodefine
?2 “大拱的两头，各有两个小拱”，主要是在说明什么？ | What does “two small arches at each end” explain?
≈ 赵州桥拱的样子 | 大拱的两头，各有两个小拱 | 赵州桥只有一个大拱
- 赵州桥有多长 ~unsaid
- 赵州桥是谁修的 ~unsaid

# 雷电
夏天的雷雨中，我们常常先看到闪电，过一会儿才听到雷声。其实，闪电和雷声是同时发生的。
这是因为光跑得比声音快得多。光一秒钟能跑三十万千米，声音一秒钟只能跑三百四十米左右。所以，闪电一出现我们就看到了，雷声却要走一会儿才能传到我们的耳朵里。
我们可以用这个道理算出雷雨离我们有多远：看到闪电后，数一数过了几秒钟才听到雷声，再乘以三百四十米。比如过了三秒钟，雷雨大约就在一千米以外。
打雷的时候，不要站在大树下，也不要在空旷的地方打伞。
?1 为什么我们先看到闪电，后听到雷声？ | Why do we see lightning before we hear thunder?
= 光跑得比声音快得多 | 这是因为光跑得比声音快得多 | 闪电和雷声是同时发生的
- 闪电比雷声先发生 ~opposite
- 我们的耳朵不灵 ~unsaid
?1 怎样算出雷雨离我们有多远？ | How do we work out how far the storm is?
= 数出闪电和雷声隔了几秒，再乘以三百四十米 | 看到闪电后，数一数过了几秒钟才听到雷声，再乘以三百四十米 | 算出雷雨离我们有多远
- 看闪电有多亮 ~unsaid
- 听雷声有多大 ~unsaid
?1 打雷的时候要注意什么？ | What must one mind in a thunderstorm?
= 不站在大树下，不在空旷的地方打伞 | 不要站在大树下，也不要在空旷的地方打伞
- 赶快跑到大树下躲雨 ~opposite
- 打着伞到空地上去 ~opposite
?2 “光一秒钟能跑三十万千米，声音一秒钟只能跑三百四十米左右”，用了哪两种说明方法？ | Which two methods are in the speeds of light and sound?
≈ 列数字和作比较 | 光一秒钟能跑三十万千米，声音一秒钟只能跑三百四十米左右
% “光一秒钟能跑三十万千米，声音一秒钟只能跑三百四十米左右”用确切的数字来说明，这种说明方法叫列数字；它又拿两样东西放在一起比，这种说明方法叫作比较。 | “光一秒钟能跑三十万千米，声音一秒钟只能跑三百四十米左右” gives exact figures: that method is giving figures. It also sets two things side by side: that method is comparison.
- 打比方和下定义 ~nolikening
- 分类别和举例子 ~nokinds
?2 “比如过了三秒钟，雷雨大约就在一千米以外”，用了什么说明方法？ | What method is “say three seconds pass”?
≈ 举例子 | 比如过了三秒钟，雷雨大约就在一千米以外
% “比如过了三秒钟，雷雨大约就在一千米以外”举出具体的事物来说明，这种说明方法叫举例子。 | “比如过了三秒钟，雷雨大约就在一千米以外” gives real examples: that method is giving examples.
- 打比方 ~nolikening
- 下定义 ~nodefine
?2 文中“大约”一词能不能去掉？为什么？ | Can 大约 be dropped?
≈ 不能，算出来的只是一个接近的数 | 雷雨大约就在一千米以外 | 声音一秒钟只能跑三百四十米左右
% 声音的速度写的是“三百四十米左右”，本身就是一个接近的数，用它算出来的距离也只能是接近的。加上“大约”，说法才准确；去掉了，就成了正好一千米，和实际不符。 | The speed of sound is given as “about three hundred and forty metres”, itself a near figure, so any distance worked from it is near too. With “about” the statement is exact; without it, it would claim exactly a thousand metres, which is not so.
- 能，去掉以后更准确 ~sense
- 能，这个词没有意思 ~sense

# 企鹅
企鹅是一种不会飞的鸟，大多数生活在地球的最南边——南极。
企鹅的翅膀很短，像两只小船桨，不能用来飞，却是游泳的好帮手。它在水里游得飞快，一小时能游二三十千米。
南极非常冷，企鹅怎么不怕冷呢？原来，它的身上有一层厚厚的脂肪，外面还有密密的羽毛，就像穿了一件又厚又不透水的大衣。
企鹅有很多种。帝企鹅是最大的一种，站起来有一米多高；最小的小蓝企鹅，只有三十多厘米高。
?1 企鹅大多数生活在哪里？ | Where do most penguins live?
= 南极 | 大多数生活在地球的最南边——南极
- 北极 ~opposite
- 热带的海边 ~unsaid
?1 企鹅为什么不怕冷？ | Why does the penguin not mind the cold?
= 身上有厚厚的脂肪和密密的羽毛 | 它的身上有一层厚厚的脂肪，外面还有密密的羽毛 | 企鹅怎么不怕冷呢
- 它常常晒太阳 ~unsaid
- 它住在山洞里 ~unsaid
?1 企鹅的翅膀有什么用？ | What are its wings good for?
= 帮助游泳 | 却是游泳的好帮手 | 不能用来飞
- 用来飞 ~opposite
- 用来抓鱼 ~unsaid
?2 “就像穿了一件又厚又不透水的大衣”，用了什么说明方法？ | What method is “like a thick waterproof coat”?
≈ 打比方 | 就像穿了一件又厚又不透水的大衣
% “就像穿了一件又厚又不透水的大衣”把要说明的东西比作另一样常见的东西，说得形象，这种说明方法叫打比方。 | “就像穿了一件又厚又不透水的大衣” likens the thing explained to something familiar: that method is analogy.
- 举例子 ~noexample
- 列数字 ~nonumber
?2 “帝企鹅……有一米多高；最小的小蓝企鹅，只有三十多厘米高”，用了哪两种说明方法？ | Which two methods are in the two penguins' heights?
≈ 列数字和作比较 | 帝企鹅是最大的一种，站起来有一米多高；最小的小蓝企鹅，只有三十多厘米高
% “帝企鹅是最大的一种，站起来有一米多高；最小的小蓝企鹅，只有三十多厘米高”用确切的数字来说明，这种说明方法叫列数字；它又拿两样东西放在一起比，这种说明方法叫作比较。 | “帝企鹅是最大的一种，站起来有一米多高；最小的小蓝企鹅，只有三十多厘米高” gives exact figures: that method is giving figures. It also sets two things side by side: that method is comparison.
- 打比方和分类别 ~nolikening
- 下定义和举例子 ~nodefine
?2 第一句“企鹅是一种不会飞的鸟”，用了什么说明方法？ | What method is the first sentence?
≈ 下定义 | 企鹅是一种不会飞的鸟
% “企鹅是一种不会飞的鸟”用简明的话说清楚它是什么，这种说明方法叫下定义。 | “企鹅是一种不会飞的鸟” says plainly what the thing is: that method is defining.
- 作比较 ~nocompare
- 打比方 ~nolikening

# 古代的计时工具
古时候没有钟表，人们是怎样知道时间的呢？
最早，人们看太阳。后来，人们发明了日晷：在一个石盘中间立一根针，太阳照着针，影子落在石盘上，影子走到哪个刻度，就是什么时辰。可是，到了阴天和晚上，日晷就不管用了。
于是，人们又发明了漏刻。在一个铜壶的底部开一个小孔，水一滴一滴地漏出来，壶里有一根刻着刻度的木箭，水少了，箭就往下降，看箭上的刻度，就知道时间。漏刻不怕阴天，白天晚上都能用。
从看太阳到用漏刻，可以看出古人的聪明才智。
?1 日晷有什么不足？ | What was the sundial's weakness?
= 阴天和晚上不管用 | 到了阴天和晚上，日晷就不管用了
- 太重了，搬不动 ~unsaid
- 只能在晚上用 ~opposite
?1 漏刻是靠什么来计时的？ | What does the water clock go by?
= 水漏出后箭下降，看箭上的刻度 | 水一滴一滴地漏出来 | 水少了，箭就往下降，看箭上的刻度，就知道时间
- 看太阳的影子 ~other
- 听铜壶发出的声音 ~unsaid
?1 这篇短文是按什么顺序介绍计时工具的？ | In what order are the tools told?
≈ 按出现的先后 | 最早，人们看太阳 | 后来，人们发明了日晷 | 于是，人们又发明了漏刻 | 从看太阳到用漏刻
- 按大小 ~wrongorder
- 按好不好看 ~wrongorder
?2 写日晷“影子走到哪个刻度，就是什么时辰”，主要在说明什么？ | What does the shadow on the dial explain?
≈ 日晷是怎样计时的 | 影子走到哪个刻度，就是什么时辰 | 太阳照着针，影子落在石盘上
- 日晷是用什么做的 ~unsaid
- 日晷有多大 ~unsaid
?2 拿日晷和漏刻比，说漏刻“不怕阴天，白天晚上都能用”，用了什么说明方法？ | What method sets the water clock beside the sundial?
≈ 作比较 | 漏刻不怕阴天，白天晚上都能用
% “漏刻不怕阴天，白天晚上都能用”拿两样东西放在一起比，这种说明方法叫作比较。 | “漏刻不怕阴天，白天晚上都能用” sets two things side by side: that method is comparison.
- 打比方 ~nolikening
- 列数字 ~nonumber
?2 “水一滴一滴地漏出来”，这样写有什么好处？ | What is gained by “drop by drop”?
≈ 写出漏水又慢又均匀，才能用来计时 | 水一滴一滴地漏出来 | 水少了，箭就往下降，看箭上的刻度，就知道时间
- 说明铜壶坏了 ~sense
- 说明水很脏 ~unsaid
`;
