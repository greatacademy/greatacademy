// The texts of the grade 8 reading topics of argument and non-continuous texts (docs/chinese-curriculum.md §18.9), written
// for this subject; the figures of the non-continuous texts are made up for them. The format is that of parsePieces in
// topic-kit.ts: a question's wrong options carry the reason they are wrong.

/** ARGUMENT_8 are the pieces of reading-8-argument: the central claim and the claims under it, and the factual and reasoned material that supports them. */
export const ARGUMENT_8 = `
# 谦虚使人进步
古人说：“满招损，谦受益。”自满的人会吃亏，谦虚的人会得到好处。我认为，谦虚使人进步。
谦虚的人知道自己的不足，才会不断地学。相传唐代诗人白居易每写好一首诗，都要先念给不识字的老婆婆听，问她听不听得懂。老婆婆听不懂的地方，他就改，一直改到她听懂为止。正因为这样，他的诗明白如话，流传很广。
谦虚的人愿意听别人的意见，才能少走弯路。一个人的眼光总是有限的，别人一句提醒，往往能让我们看见自己看不见的问题。
反过来，自满的人觉得自己什么都懂，听不进意见，也就停在了原地。
所以，无论取得了多大的成绩，我们都应该保持谦虚，向身边的人学习。
?1 本文的中心论点是什么？ | What is the central claim?
= 谦虚使人进步 | 我认为，谦虚使人进步
- 白居易的诗明白如话 ~notview
- 自满的人会吃亏 ~narrow
?1 本文的中心论点是怎样提出的？ | How is the central claim put?
≈ 先引用古人的话，再由此引出自己的观点 | 古人说：“满招损，谦受益。” | 我认为，谦虚使人进步
- 先讲一个故事，再提出观点 ~wrongorder
- 文章最后才提出观点 ~elsewhere
?1 第二、三段的第一句话在文中有什么作用？ | What do the opening sentences of paragraphs two and three do?
≈ 分别提出分论点，从会不断地学、能少走弯路两方面证明中心论点 | 谦虚的人知道自己的不足，才会不断地学 | 谦虚的人愿意听别人的意见，才能少走弯路
- 讲了两个故事 ~notview
- 和中心论点没有关系 ~sense
?2 白居易念诗给老婆婆听的事例，证明了什么？ | What does the Bai Juyi example prove?
≈ 谦虚的人知道自己的不足，会不断地学习、改进 | 谦虚的人知道自己的不足，才会不断地学 | 老婆婆听不懂的地方，他就改
- 老婆婆很会写诗 ~noproof
- 白居易不识字 ~misread
?2 第一段引用“满招损，谦受益”属于什么论据？有什么作用？ | What kind of material is the old saying?
≈ 道理论据，用古人的话作依据，使观点更有说服力 | 古人说：“满招损，谦受益。” | 我认为，谦虚使人进步
- 事实论据，讲了一件真事 ~sense
- 和观点没有关系 ~noproof
?2 第四段写自满的人，用了什么论证方法？有什么作用？ | What method is paragraph four?
≈ 对比论证，从反面说明自满的害处，和前面谦虚的好处对照，使观点更鲜明 | 反过来，自满的人觉得自己什么都懂 | 也就停在了原地
% 第二、三段从正面说谦虚使人不断学习、少走弯路；第四段用“反过来”一转，写自满的人听不进意见，“停在了原地”。正反两面放在一起，谦虚的好处就显得更清楚了。 | Paragraphs two and three put the case for modesty; paragraph four turns with “conversely” to the self-satisfied, who will not listen and “stay where they are”. Set side by side, the two make the worth of modesty plainer.
- 举例论证，举了一个人的例子 ~sense
- 比喻论证，把自满比作原地 ~sense

# 不动笔墨不读书
有人读书，一本接一本，读完了却说不出什么。我认为，读书要动笔，不动笔墨不读书。
动笔，能帮我们把书读懂。读的时候圈一圈重点，在空白处写下自己的疑问，读的就不再只是字，而是在和作者对话。
动笔，能帮我们把读过的东西留住。明末清初的学者顾炎武，每天读书有了心得，就随手记下来，有了新的发现，再把以前记的改一改。这样坚持了三十多年，积成了一部《日知录》。
俗话说：“好记性不如烂笔头。”脑子记住的东西容易忘，写下来的却可以随时翻看。读书时只用眼睛不用笔，就像赶路不看地图，走过了也说不清路在哪里。
所以，拿起笔来读书吧，哪怕每次只写一两句话。
?1 本文的中心论点是什么？ | What is the central claim?
= 读书要动笔，不动笔墨不读书 | 我认为，读书要动笔，不动笔墨不读书
- 顾炎武写成了《日知录》 ~notview
- 好记性不如烂笔头 ~narrow
?1 本文第一段是怎样引出论点的？ | How does paragraph one lead in?
≈ 先指出有人读完书说不出什么的问题，再针对这个问题提出观点 | 读完了却说不出什么 | 我认为，读书要动笔
- 先引用名言，再提出观点 ~wrongorder
- 先讲顾炎武的故事 ~elsewhere
?1 第二、三段从哪两个方面论证中心论点？ | From which two sides do paragraphs two and three argue?
≈ 动笔能帮我们把书读懂，动笔能帮我们把读过的东西留住 | 动笔，能帮我们把书读懂 | 动笔，能帮我们把读过的东西留住
- 读书要快，读书要多 ~unsaid
- 写字要好看，本子要干净 ~unsaid
?2 顾炎武的事例属于什么论据？证明了什么？ | What kind of material is Gu Yanwu, and what does it prove?
≈ 事实论据，证明动笔能把读过的东西留住、积累起来 | 动笔，能帮我们把读过的东西留住 | 积成了一部《日知录》
- 道理论据，证明读书要多问 ~sense
- 证明顾炎武记性不好 ~noproof
?2 “就像赶路不看地图”用了什么论证方法？有什么作用？ | What method is the map, and to what end?
≈ 比喻论证，把只看不写比作赶路不看地图，通俗形象地说明不动笔的害处 | 就像赶路不看地图，走过了也说不清路在哪里 | 读书时只用眼睛不用笔
- 对比论证，比较了地图和书 ~sense
- 举例论证，举了一个迷路的人 ~noexample
?2 第四段引用俗语“好记性不如烂笔头”，有什么作用？ | What does the saying in paragraph four do?
≈ 作为道理论据，说明写下来比只用脑子记更可靠，增强说服力 | 好记性不如烂笔头 | 写下来的却可以随时翻看
- 说明记性好的人不用读书 ~misread
- 说明笔用旧了也要用 ~literal

# 自信不是自负
自信和自负，看起来只差一个字，其实相差很远。自信是相信自己，自负是看不起别人。我们要做一个自信的人，但不能自负。
自信的人敢于去做，也愿意听意见。一个人相信自己能做好一件事，就会认真准备，勇敢地去试，遇到困难也不轻易放弃。
自负的人却把自己看得太高。三国时，马谡熟读兵书，常常谈起打仗来头头是道。他奉命守街亭，副将王平劝他依山傍水扎营，他不听，偏要把军队驻在山上。结果水源被敌军切断，街亭失守。
自信像一盏灯，照亮自己前进的路；自负却像一堵墙，挡住了别人的帮助。
所以，相信自己，也尊重别人，这才是真正的自信。
?1 本文的中心论点是什么？ | What is the central claim?
= 我们要做一个自信的人，但不能自负 | 我们要做一个自信的人，但不能自负
- 马谡丢了街亭 ~notview
- 自信的人敢于去做 ~narrow
?1 第一段先比较自信和自负，有什么作用？ | Why does paragraph one first set the two words apart?
≈ 分清两个概念，为提出论点、展开论证打下基础 | 自信是相信自己，自负是看不起别人 | 我们要做一个自信的人，但不能自负
- 说明两个词意思一样 ~opposite
- 讲一个故事吸引读者 ~sense
?1 最后一段有什么作用？ | What does the last paragraph do?
≈ 总结全文，进一步说明什么是真正的自信，照应开头的论点 | 这才是真正的自信 | 我们要做一个自信的人，但不能自负
- 提出一个新的论点 ~sense
- 补充一个事例 ~sense
?2 马谡的事例证明了什么？ | What does the Ma Su example prove?
≈ 自负的人把自己看得太高，听不进意见，会招来失败 | 自负的人却把自己看得太高 | 他不听 | 街亭失守
- 熟读兵书没有用 ~overread
- 打仗一定要在山下扎营 ~noproof
?2 第四段用了什么论证方法？ | What method is paragraph four?
≈ 比喻论证和对比论证：把自信比作灯，把自负比作墙，两相对照，鲜明地写出两者的不同 | 自信像一盏灯 | 自负却像一堵墙
- 举例论证 ~sense
- 引用论证 ~sense
?2 第二段没有举事例，它是用什么来论证的？ | Paragraph two gives no example. How does it argue?
≈ 讲道理，一步步说明自信的人会怎样做，属于道理论证 | 一个人相信自己能做好一件事，就会认真准备
% 第二段没有讲哪一个人、哪一件事，而是顺着“相信自己能做好”往下推：会认真准备，会勇敢去试，遇到困难不放弃。这是用道理一层层地说明，属于道理论证。 | Paragraph two names no person or event; it follows “believing you can do it” step by step: you prepare, you try, you do not give up. It argues by reasoning in stages.
- 用数字来论证 ~sense
- 用名人的话来论证 ~sense

# 时间是挤出来的
常听同学说：“我也想读课外书，可是没有时间。”其实，时间是挤出来的。
一天只有二十四小时，对谁都一样。有的人做成了很多事，并不是他的时间比别人多，而是他善于把零碎的时间用起来。
三国时有个叫董遇的人，很有学问。有人向他请教，又说自己没有时间读书。董遇说，可以利用“三余”：冬天是一年里的空闲，夜晚是一天里的空闲，下雨天是平常的空闲。抓住这三种空闲，就有读书的时间了。
鲁迅先生也说过，时间就像海绵里的水，只要愿挤，总还是有的。
等车的十分钟，睡前的半小时，看起来不多，一年积下来，却能读完好几本书。时间不在于多，而在于会不会挤，肯不肯挤。
?1 本文针对什么问题提出论点？ | What problem does the claim answer?
= 有同学说想读课外书，可是没有时间 | 我也想读课外书，可是没有时间
- 有同学不喜欢读书 ~unsaid
- 有同学读书太多 ~opposite
?1 本文的中心论点是什么？ | What is the central claim?
= 时间是挤出来的 | 其实，时间是挤出来的
- 冬天是一年里的空闲 ~notview
- 一天只有二十四小时 ~narrow
?1 最后一句“时间不在于多，而在于会不会挤，肯不肯挤”有什么作用？ | What does the last sentence do?
≈ 总结全文，深化论点，说明挤时间既要有方法，也要有决心 | 时间不在于多，而在于会不会挤，肯不肯挤 | 其实，时间是挤出来的
- 提出一个和前面相反的观点 ~opposite
- 讲了一个新的事例 ~sense
?2 董遇“三余”的故事属于什么论据？证明了什么？ | What kind of material is Dong Yu?
≈ 事实论据，证明善于利用空闲，就能挤出读书的时间 | 抓住这三种空闲，就有读书的时间了 | 其实，时间是挤出来的
- 道理论据，证明下雨天适合读书 ~narrow
- 证明董遇没有时间读书 ~opposite
?2 第四段引用鲁迅的话，有什么作用？ | What does the Lu Xun quotation do?
≈ 道理论据，用名人的话说明时间可以挤出来，增强说服力 | 时间就像海绵里的水，只要愿挤，总还是有的 | 其实，时间是挤出来的
- 说明海绵里有很多水 ~literal
- 事实论据，讲了鲁迅的一件事 ~sense
?2 最后一段举等车、睡前的例子，有什么好处？ | What do the bus stop and bedtime add?
≈ 联系学生的日常生活，让读者觉得挤时间就在身边，容易做到 | 等车的十分钟，睡前的半小时 | 一年积下来，却能读完好几本书
- 说明等车很浪费时间 ~misread
- 说明睡觉不重要 ~overread

# 守规则才有真自由
有人觉得，规则是对自由的束缚，没有规则才自由自在。我却认为，守规则才有真自由。
风筝能在天上自由地飞，是因为有一根线拉着它。线断了，风筝看似挣脱了，却很快就会一头栽下来。规则就像这根线。
马路上，车辆和行人都按红绿灯走，大家才能各走各的路，又快又安全。如果人人都想怎么走就怎么走，路口就会堵成一团，谁也走不了。
孟子说：“不以规矩，不能成方圆。”规矩是画圆画方的工具，没有它，连一个圆也画不好。
可见，规则不是自由的敌人，而是自由的保障。人人守规则，每个人才能享有自由。
?1 本文的论点是怎样提出的？ | How is the claim put?
≈ 先摆出“没有规则才自由”的说法，再加以反驳，提出自己的观点 | 有人觉得，规则是对自由的束缚 | 我却认为，守规则才有真自由
- 先讲一个故事，再提出观点 ~sense
- 文章开头就引用了孟子的话 ~elsewhere
?1 本文的中心论点是什么？ | What is the central claim?
= 守规则才有真自由 | 我却认为，守规则才有真自由
- 规则是对自由的束缚 ~opposite
- 马路上要看红绿灯 ~notview
?1 最后一段和开头是什么关系？ | How does the end stand to the opening?
≈ 照应开头，回答了开头的说法，总结论点 | 规则不是自由的敌人，而是自由的保障 | 规则是对自由的束缚
- 结尾同意开头“有人”的说法 ~opposite
- 结尾和开头没有关系 ~sense
?2 第二段写风筝，用了什么论证方法？有什么作用？ | What method is the kite?
≈ 比喻论证，把规则比作拉着风筝的线，形象地说明有约束才能自由 | 规则就像这根线 | 风筝能在天上自由地飞，是因为有一根线拉着它
- 举例论证，举了放风筝的例子 ~sense
- 引用论证，引用了一句诗 ~sense
?2 第三段写马路和红绿灯，属于什么论据？ | What kind of material is the traffic?
≈ 事实论据，用生活中的事实证明守规则大家才能自由通行 | 大家才能各走各的路，又快又安全 | 路口就会堵成一团，谁也走不了
- 道理论据，引用了交通法规 ~sense
- 和论点无关，可以删去 ~noproof
?2 第三段“如果人人都想怎么走就怎么走……”用了什么论证方法？ | What method is the “if everyone…” sentence?
≈ 假设论证（反面论证），从反面说明不守规则的后果，和前面正面的情况对照 | 如果人人都想怎么走就怎么走，路口就会堵成一团 | 车辆和行人都按红绿灯走
% 前一句正面说按红绿灯走“又快又安全”，这一句用“如果”假设人人不守规则，结果“谁也走不了”。从反面设想后果，和正面对照，就更能说明规则的必要。 | The sentence before says obeying the lights is fast and safe; this one supposes, with “if”, that nobody obeys, and then no one can move. Imagining the opposite against the fact makes the need for rules plainer.
- 比喻论证，把路口比作风筝 ~sense
- 引用论证，引用了孟子的话 ~elsewhere

# 纸上得来终觉浅
陆游在给儿子的诗里写道：“纸上得来终觉浅，绝知此事要躬行。”从书上得来的知识，总觉得浅；要真正弄懂一件事，必须亲自去做。
书本上的知识，是前人实践的总结。不亲自去做，就很难真正懂得。战国时赵国的赵括，从小熟读兵书，谈起用兵来连他的父亲也难不倒他。可是，他从没有真正带兵打过仗。后来他带领赵军出战，只会照搬书上的话，结果大败。
北魏的贾思勰，为了写一部讲农业的书，不只读古书，还走访各地，向老农请教，自己也种地、养羊。他写成的《齐民要术》，直到今天还很有用。
一个只读不做，一个边读边做，结果大不一样。读书固然重要，但只有把书上的知识拿到实践中去用，才能真正变成自己的本领。
?1 本文的中心论点是什么？ | What is the central claim?
≈ 要真正弄懂一件事，必须亲自去做；书本知识要在实践中检验 | 要真正弄懂一件事，必须亲自去做 | 只有把书上的知识拿到实践中去用，才能真正变成自己的本领
- 读书没有用 ~overread
- 赵括熟读兵书 ~notview
?1 第一段是怎样提出论点的？ | How is the claim put?
≈ 引用陆游的诗句，再加以解释，提出论点 | 陆游在给儿子的诗里写道 | 从书上得来的知识，总觉得浅
- 讲了赵括的故事 ~elsewhere
- 用一个比喻 ~sense
?1 最后一段中“读书固然重要”一句有什么作用？ | What does “reading of course matters” do?
≈ 说明作者并不否定读书，使观点更全面、严密 | 读书固然重要 | 只有把书上的知识拿到实践中去用
% “固然”是先承认一面：读书是重要的；后面再用“但”转到重点：要在实践中去用。这样说，就不会被误会成“读书没有用”，观点更全面，也更站得住。 | 固然 first grants one side, that reading matters; 但 then turns to the point, use in practice. So the claim cannot be taken to mean reading is useless; it is fuller and stands firmer.
- 说明读书比实践更重要 ~opposite
- 和论点没有关系 ~sense
?2 赵括的事例属于什么论据？证明了什么？ | What kind of material is Zhao Kuo?
≈ 事实论据，从反面证明只读书、不实践，知识就用不好 | 他从没有真正带兵打过仗 | 只会照搬书上的话，结果大败
- 道理论据，证明兵书写得不好 ~noproof
- 证明赵括的父亲很厉害 ~noproof
?2 作者把赵括和贾思勰放在一起写，用了什么论证方法？ | What method sets Zhao Kuo against Jia Sixie?
≈ 对比论证，一个只读不做，一个边读边做，结果不同，有力地证明了论点 | 一个只读不做，一个边读边做，结果大不一样
% 赵括只读兵书，“结果大败”；贾思勰读书又走访、种地，写成的书“直到今天还很有用”。作者用“一个……一个……”把两人放在一起，正反对照，实践的重要就格外清楚。 | Zhao Kuo only read and was routed; Jia Sixie read, travelled and farmed, and his book is still of use. “One… the other…” sets them side by side, and the weight of practice stands out.
- 比喻论证 ~sense
- 引用论证 ~sense
?2 贾思勰的事例证明了什么？ | What does Jia Sixie prove?
≈ 把读书和实践结合起来，才能得到真正有用的知识 | 不只读古书，还走访各地 | 直到今天还很有用
- 种地比读书重要 ~overread
- 写书一定要养羊 ~literal

# 学会换位思考
生活中，很多矛盾都是因为只想着自己。我认为，我们要学会换位思考。
换位思考，就是站在别人的位置上想一想。孔子说：“己所不欲，勿施于人。”自己不愿意要的，就不要强加给别人。这句话说的正是换位思考。
换位思考能化解矛盾。小林总嫌同桌说话慢，常常打断他。有一次小组汇报，同桌一紧张就忘了词，小林在一旁急得直跺脚。轮到小林上台时，他也紧张得说不出话来，这才明白同桌的难处。从那以后，他再也不催同桌了，两人成了好朋友。
换位思考能让我们看得更全面。一件事，从自己这边看是一个样子，从别人那边看，可能是另一个样子。多换个角度，判断就会更公正。
学会换位思考，我们就会多一分理解，少一分争吵。
?1 本文的中心论点是什么？ | What is the central claim?
= 我们要学会换位思考 | 我认为，我们要学会换位思考
- 己所不欲，勿施于人 ~narrow
- 小林和同桌成了好朋友 ~notview
?1 第三、四段的第一句分别是什么？它们和中心论点是什么关系？ | What open paragraphs three and four, and how do they stand to the claim?
≈ “换位思考能化解矛盾”“换位思考能让我们看得更全面”，是两个分论点，共同证明中心论点 | 换位思考能化解矛盾 | 换位思考能让我们看得更全面
- 是两个事例 ~notview
- 是和中心论点相反的观点 ~opposite
?1 第二段在文中有什么作用？ | What does paragraph two do?
≈ 解释什么是换位思考，为下文论证打下基础 | 换位思考，就是站在别人的位置上想一想 | 这句话说的正是换位思考
- 讲了一个换位思考的故事 ~elsewhere
- 总结全文 ~role
?2 小林的事例证明了哪个观点？ | Which claim does Xiaolin's story prove?
≈ 换位思考能化解矛盾 | 换位思考能化解矛盾 | 这才明白同桌的难处 | 两人成了好朋友
- 说话要快 ~noproof
- 上台汇报不能紧张 ~noproof
?2 第二段引用孔子的话属于什么论据？ | What kind of material is the Confucius quotation?
≈ 道理论据，用古人的名言说明换位思考的道理 | 孔子说：“己所不欲，勿施于人。” | 这句话说的正是换位思考
- 事实论据，讲了孔子的一件事 ~sense
- 和换位思考没有关系 ~noproof
?2 第四段为什么没有举事例？它是怎样论证的？ | Paragraph four gives no example. How does it argue?
≈ 用道理来分析，说明从不同的角度看事情会不同，属于道理论证 | 从自己这边看是一个样子，从别人那边看，可能是另一个样子
% 第四段没有讲具体的人和事，而是说一件事从两边看“是一个样子”“是另一个样子”，所以要多换角度，判断才公正。这是用道理推出结论，属于道理论证。 | Paragraph four tells no person or event; it says a matter looks one way from here and another from there, so more angles make fairer judgments. It reasons to its conclusion.
- 用名人名言论证 ~elsewhere
- 用数字论证 ~sense

# 一心不能二用
很多同学一边写作业，一边看手机，以为这样能节省时间。其实，一心不能二用，做事要专心。
荀子说过：“目不能两视而明，耳不能两听而聪。”眼睛不能同时看两样东西而看得清楚，耳朵不能同时听两种声音而听得明白。
写作业时看一眼手机，再回到作业上，思路就断了，要花时间重新接上。这样来回几次，看似两件事一起做，其实两件事都没做好，用的时间反而更多。
专心的人却不一样。一个下棋高手对局时，周围再吵也不抬头，心思全在棋盘上，所以能看出对手的每一步棋。
放大镜能把阳光聚在一点，点燃纸片；阳光散开，就什么也点不着。我们的精力也是这样，集中起来才有力量。
?1 本文的中心论点是什么？ | What is the central claim?
= 一心不能二用，做事要专心 | 其实，一心不能二用，做事要专心
- 写作业不能看手机 ~narrow
- 下棋要专心 ~narrow
?1 本文开头针对的是什么现象？ | What habit does the opening answer?
= 一边写作业，一边看手机，以为能节省时间 | 很多同学一边写作业，一边看手机，以为这样能节省时间
- 同学们不写作业 ~unsaid
- 同学们下棋太多 ~unsaid
?1 第三段和第四段在论证上是什么关系？ | How do paragraphs three and four stand to each other?
≈ 一反一正：第三段写分心的坏处，第四段写专心的好处，形成对照 | 两件事都没做好 | 专心的人却不一样
- 两段都写分心的坏处 ~part
- 第四段提出新的论点 ~sense
?2 第二段引用荀子的话，有什么作用？ | What does the Xunzi quotation do?
≈ 道理论据，用古人的话说明不能同时做两件事，增强说服力 | 目不能两视而明，耳不能两听而聪 | 其实，一心不能二用
- 事实论据，说明荀子的眼睛不好 ~misread
- 说明耳朵比眼睛重要 ~unsaid
?2 最后一段用放大镜聚光作比，属于什么论证方法？有什么作用？ | What method is the magnifying glass?
≈ 比喻论证，把集中精力比作聚光，形象地说明专心才有力量 | 放大镜能把阳光聚在一点，点燃纸片 | 我们的精力也是这样，集中起来才有力量
- 举例论证，举了一个做实验的例子 ~sense
- 引用论证 ~sense
?2 第三段是怎样论证分心的害处的？ | How does paragraph three argue the harm?
≈ 摆出写作业时分心的过程，一步步分析，说明两件事都做不好，时间反而更多 | 思路就断了，要花时间重新接上 | 两件事都没做好，用的时间反而更多
- 引用名人的话 ~elsewhere
- 用比喻 ~elsewhere

# 知错就改
人谁能没有过错呢？《左传》里说：“人谁无过？过而能改，善莫大焉。”犯了错误并不可怕，可怕的是不肯改。我们要做一个知错就改的人。
知错就改，人才能变好。晋朝有个叫周处的年轻人，年少时横行乡里，和山上的猛虎、水里的蛟龙一起被人们叫作“三害”。后来他得知乡亲们把自己当作祸害，十分惭愧，决心改过。他刻苦读书，后来成了一名有作为的人。
知错就改，才能赢得别人的信任。一个人做错了事，坦白地承认，再认真地改，别人会觉得他诚实可靠；如果遮遮掩掩，一错再错，就会失去大家的信任。
错误就像衣服上的污点，发现了及时洗掉，衣服还是干净的；放着不管，污点只会越来越难洗。
?1 本文的中心论点是什么？ | What is the central claim?
= 我们要做一个知错就改的人 | 我们要做一个知错就改的人
- 人谁无过 ~narrow
- 周处是“三害”之一 ~notview
?1 第二、三段从哪两个方面论证中心论点？ | From which two sides do paragraphs two and three argue?
≈ 知错就改人才能变好；知错就改才能赢得信任 | 知错就改，人才能变好 | 知错就改，才能赢得别人的信任
- 犯错很可怕；犯错要遮掩 ~opposite
- 要多读书；要除三害 ~detail
?1 第一段在提出论点前，为什么先引用《左传》的话？ | Why quote the Zuo Zhuan before the claim?
≈ 用古人的话说明人人会犯错，改了就好，自然地引出论点 | 人谁无过？过而能改，善莫大焉 | 我们要做一个知错就改的人
- 说明《左传》是一本好书 ~role
- 说明犯错没有关系，不用改 ~opposite
?2 周处的事例证明了什么？ | What does Zhou Chu prove?
≈ 知错就改，人才能变好 | 知错就改，人才能变好 | 决心改过 | 后来成了一名有作为的人
- 读书能打败猛虎 ~noproof
- 年轻人都会横行乡里 ~broad
?2 第三段把坦白承认和遮遮掩掩放在一起写，用了什么论证方法？ | What method sets owning up against hiding?
≈ 对比论证，正反对照，说明知错就改能赢得信任 | 别人会觉得他诚实可靠 | 如果遮遮掩掩，一错再错，就会失去大家的信任
- 比喻论证 ~elsewhere
- 举例论证，举了周处的例子 ~elsewhere
?2 最后一段把错误比作衣服上的污点，有什么作用？ | What does the stain do?
≈ 比喻论证，形象地说明错误要及时改正，越拖越难改 | 错误就像衣服上的污点 | 放着不管，污点只会越来越难洗
- 说明衣服要常洗 ~literal
- 说明错误是洗不掉的 ~opposite

# 少一些抱怨，多一些行动
遇到不顺心的事，有的人总是抱怨：怪天气不好，怪条件太差，怪别人不帮忙。我认为，与其抱怨，不如行动。
抱怨解决不了问题。抱怨十遍，问题还在那里；动手做一遍，问题就可能少一半。
唐代的鉴真和尚，应邀东渡日本传法。他前后五次出海，都因为风浪、触礁等原因失败了，眼睛也失明了。可他没有怨天尤人，第六次终于到达日本，传去了佛经、医药和建筑等方面的知识。
如果鉴真每次失败后只是抱怨大海无情，他就永远到不了日本。正是一次次的行动，让困难一点点被克服。
抱怨像摇椅，让你一直动，却哪儿也去不了。少一些抱怨，多一些行动，路就在脚下。
?1 本文的中心论点是什么？ | What is the central claim?
= 与其抱怨，不如行动 | 我认为，与其抱怨，不如行动
- 鉴真第六次到达日本 ~notview
- 天气不好 ~unsaid
?1 第一段列举“怪天气不好，怪条件太差，怪别人不帮忙”有什么作用？ | What do the three complaints in paragraph one do?
≈ 摆出生活中爱抱怨的现象，引出论点 | 怪天气不好，怪条件太差，怪别人不帮忙 | 我认为，与其抱怨，不如行动
- 说明天气确实很坏 ~misread
- 证明别人不愿帮忙 ~noproof
?1 第二段的第一句在文中有什么作用？ | What does the first sentence of paragraph two do?
≈ 提出分论点，从抱怨无用的角度支持中心论点 | 抱怨解决不了问题 | 与其抱怨，不如行动
- 提出和中心论点相反的观点 ~opposite
- 讲了一个故事 ~elsewhere
?2 鉴真的事例属于什么论据？ | What kind of material is Jianzhen?
≈ 事实论据，证明不抱怨、坚持行动，才能克服困难 | 可他没有怨天尤人，第六次终于到达日本 | 正是一次次的行动，让困难一点点被克服
- 道理论据，引用了鉴真的话 ~sense
- 证明大海很危险，不该出海 ~noproof
?2 第四段“如果鉴真每次失败后只是抱怨……”用了什么论证方法？ | What method is the “if Jianzhen…” sentence?
≈ 假设论证，从反面设想，突出行动的重要 | 如果鉴真每次失败后只是抱怨大海无情，他就永远到不了日本 | 正是一次次的行动
% 鉴真其实没有抱怨，作者却用“如果”假设他只是抱怨，结果是“永远到不了日本”。设想的反面和真实的结果一对照，就能看出正是行动让他成功了。 | Jianzhen did not complain; the writer supposes with “if” that he had, and he would never have reached Japan. Setting that against what happened shows it was action that brought him there.
- 比喻论证 ~elsewhere
- 引用论证 ~sense
?2 “抱怨像摇椅，让你一直动，却哪儿也去不了”有什么作用？ | What does the rocking chair do?
≈ 比喻论证，形象地说明抱怨只是白费力气，不能解决问题 | 抱怨像摇椅，让你一直动，却哪儿也去不了 | 抱怨解决不了问题
- 说明摇椅坐着很舒服 ~literal
- 说明抱怨能让人前进 ~opposite
`;

/** NONCONT_8 are the pieces of reading-8-non-continuous: two or three materials a piece, read together to find, compare and apply what they say. */
export const NONCONT_8 = `
# 初二学生的睡眠
材料一：某校对初二年级300名学生做了睡眠调查，结果如下。
每天睡眠不足7小时：45人，占15%
7至8小时：120人，占40%
8至9小时：90人，占30%
9小时及以上：45人，占15%
材料二：调查中，学生说出的睡得晚的主要原因是：作业多（48%），睡前玩手机（35%），参加课外班（17%）。
材料三：国家有关规定提出，初中生每天睡眠时间应达到9小时。
?1 睡眠时间在8小时以上的学生一共占多少？ | What share sleeps over eight hours?
≈ 45% | 8至9小时：90人，占30% | 9小时及以上：45人，占15%
- 30% ~figure
- 15% ~figure
?1 学生睡得晚的原因中，排第二位的是什么？ | What is the second reason for late nights?
= 睡前玩手机 | 睡前玩手机（35%）
- 作业多 ~figure
- 参加课外班 ~figure
?1 这次调查的对象是谁？ | Who was surveyed?
= 某校初二年级300名学生 | 某校对初二年级300名学生做了睡眠调查
- 全国所有初中生 ~broad
- 某校全体老师 ~who
?2 根据三则材料，这所学校睡眠达标的学生占多少？ | By all three, what share sleeps enough?
≈ 15%，只有睡9小时及以上的才达到了要求 | 初中生每天睡眠时间应达到9小时 | 9小时及以上：45人，占15%
- 45% ~figure
- 85% ~figure
?2 从材料中可以得出什么结论？ | What conclusion do the materials support?
≈ 这所学校大多数初二学生睡眠不足，作业多和玩手机是主要原因 | 9小时及以上：45人，占15% | 作业多（48%），睡前玩手机（35%）
- 这所学校的学生都睡得太多 ~opposite
- 全国的初中生都不玩手机 ~unsaid
?2 如果要给同学们提一条改善睡眠的建议，下面哪一条最有针对性？ | Which tip fits the findings best?
≈ 睡前把手机放在卧室外面 | 睡前玩手机（35%）
% 材料二说，35%的学生睡得晚是因为“睡前玩手机”，这是学生自己能改的原因。睡前把手机放到卧室外面，正好针对这个原因，所以最有针对性。另外两条建议和调查找到的原因没有关系。 | Material two says 35% sleep late because of phones before bed, a cause pupils can change themselves. Leaving the phone outside the bedroom meets that cause directly; the other tips have nothing to do with what the survey found.
- 每天早上多吃一个鸡蛋 ~irrelevant
- 周末去公园散步 ~irrelevant

# 博物馆参观指南
材料一：开放时间。周二至周日 9:00—17:00（16:00停止入馆），周一闭馆（法定节假日除外）。
材料二：参观须知。1. 免费参观，凭身份证或学生证领票。2. 每天限6000人，团体参观请提前三天预约。3. 展厅内禁止使用闪光灯，禁止饮食。
材料三：展厅分布。一楼：古代青铜器；二楼：古代陶瓷；三楼：书画（每周三闭展更换展品）。
?1 这家博物馆每天最晚几点可以入馆？ | What is the latest time to go in?
= 16:00 | 16:00停止入馆
- 17:00 ~figure
- 9:00 ~figure
?1 想看古代陶瓷，应该去几楼？ | Which floor holds the pottery?
= 二楼 | 二楼：古代陶瓷
- 一楼 ~figure
- 三楼 ~figure
?1 怎样领取参观的票？ | How are tickets got?
= 凭身份证或学生证免费领票 | 免费参观，凭身份证或学生证领票
- 买票才能进 ~opposite
- 不用领票，直接进 ~opposite
?2 小林周三上午去博物馆，想看书画展，能看到吗？为什么？ | Can Xiaolin see the paintings on Wednesday?
≈ 看不到，三楼的书画每周三闭展更换展品 | 三楼：书画（每周三闭展更换展品） | 周二至周日 9:00—17:00
- 能看到，周三是开放日 ~part
- 看不到，周三全馆闭馆 ~misread
?2 某校40名学生想下周五去参观，他们应该怎么做？ | What must a class of forty do for next Friday?
≈ 至少提前三天预约，并带好学生证 | 团体参观请提前三天预约 | 凭身份证或学生证领票
- 当天直接去，不用预约 ~opposite
- 周一去，那天人少 ~opposite
?2 小王参观时想给青铜器拍照，他应该注意什么？ | What must Xiaowang mind in taking photos?
≈ 可以拍，但不能用闪光灯 | 展厅内禁止使用闪光灯
% 参观须知只说展厅内“禁止使用闪光灯”，并没有说不能拍照。所以小王可以拍，只是要把闪光灯关掉。 | The rules forbid only flash in the halls; they do not forbid photos. So Xiaowang may take pictures with the flash off.
- 一律不准拍照 ~overread
- 要先买拍照票 ~unsaid

# 一种饼干的营养成分表
材料一：营养成分表（每100克）。能量：2000千焦，营养素参考值24%；蛋白质：7克，12%；脂肪：25克，42%；碳水化合物：62克，21%；钠：400毫克，20%。
材料二：营养素参考值，是指每100克食品中的某种营养成分，占一个人一天所需的百分之几。
材料三：这包饼干净含量200克。
?1 每100克饼干中，含量最多的营养成分是什么？ | What is most of in 100 g?
= 碳水化合物 | 碳水化合物：62克
- 脂肪 ~figure
- 蛋白质 ~figure
?1 “脂肪：25克，42%”中的42%是什么意思？ | What does 42% beside fat mean?
≈ 100克饼干中的脂肪，占一个人一天所需脂肪的42% | 脂肪：25克，42% | 占一个人一天所需的百分之几
- 饼干里42%是脂肪 ~misread
- 有42%的人喜欢吃这种饼干 ~unsaid
?1 这包饼干一共有多少克？ | How much does the packet hold?
= 200克 | 这包饼干净含量200克
- 100克 ~figure
- 62克 ~figure
?2 一个人吃完整包饼干，摄入的脂肪约占一天所需的多少？ | Eating the whole packet, what share of a day's fat?
≈ 84%，整包是100克的两倍 | 脂肪：25克，42% | 这包饼干净含量200克
- 42% ~figure
- 25% ~figure
?2 根据材料，下面哪种说法最合理？ | Which reading is most sound?
≈ 这种饼干脂肪偏多，不宜一次吃太多 | 脂肪：25克，42% | 这包饼干净含量200克
- 这种饼干蛋白质很多，可以当正餐 ~opposite
- 这种饼干不含钠 ~figure
?2 一位需要少吃盐的老人，看这张表主要应该看哪一项？ | Which line should someone cutting salt read?
≈ 钠 | 钠：400毫克，20%
% 盐的主要成分是氯化钠，少吃盐，就是要少摄入钠。表中的“钠：400毫克，20%”告诉老人这种饼干含钠多少，所以他主要应该看这一项。 | Salt is mostly sodium chloride, so eating less salt means less sodium. The line “sodium 400 mg, 20%” tells him how much the biscuit holds, so that is the line to read.
- 能量 ~irrelevant
- 蛋白质 ~irrelevant

# 社区垃圾分类
材料一：本社区垃圾分为四类。厨余垃圾：剩菜剩饭、果皮、菜叶等；可回收物：纸箱、塑料瓶、旧衣服、易拉罐等；有害垃圾：废电池、过期药品、废灯管等；其他垃圾：用过的纸巾、烟头、陶瓷碎片等。
材料二：投放时间。每天早上7:00—9:00、晚上18:00—20:00在小区东门集中投放。大件垃圾请打电话预约上门收取。
材料三：去年本社区每天产生垃圾约5吨，实行分类后，今年每天需要送去填埋的垃圾减少到约3吨。
?1 用过的纸巾应该投放到哪一类？ | Where does a used tissue go?
= 其他垃圾 | 其他垃圾：用过的纸巾、烟头、陶瓷碎片等
- 可回收物 ~opposite
- 厨余垃圾 ~opposite
?1 晚上几点可以集中投放垃圾？ | When in the evening may rubbish be left?
= 18:00—20:00 | 晚上18:00—20:00在小区东门集中投放
- 7:00—9:00 ~figure
- 全天都可以 ~opposite
?1 分类后，每天送去填埋的垃圾减少了约多少吨？ | By how much did landfill fall each day?
≈ 约2吨 | 去年本社区每天产生垃圾约5吨 | 今年每天需要送去填埋的垃圾减少到约3吨
- 约3吨 ~figure
- 约5吨 ~figure
?2 王奶奶家有一盒过期的感冒药，应该怎样处理？ | What should Granny Wang do with old cold medicine?
≈ 在投放时间里，投进有害垃圾 | 有害垃圾：废电池、过期药品、废灯管等 | 每天早上7:00—9:00、晚上18:00—20:00
- 冲进下水道 ~unsaid
- 投进厨余垃圾 ~opposite
?2 小刚家要扔一个旧沙发，应该怎么做？ | How does Xiaogang's family get rid of an old sofa?
= 打电话预约上门收取 | 大件垃圾请打电话预约上门收取
- 早上放到东门 ~part
- 拆开扔进其他垃圾 ~unsaid
?2 材料三的数据说明了什么？ | What do the figures of material three show?
≈ 垃圾分类以后，需要填埋的垃圾明显减少了 | 实行分类后，今年每天需要送去填埋的垃圾减少到约3吨 | 去年本社区每天产生垃圾约5吨
- 社区的人越来越少 ~unsaid
- 分类以后垃圾变多了 ~opposite

# 景区门票
材料一：门票价格。成人票：80元；学生票（凭学生证）：40元；身高1.2米以下的儿童、65岁以上的老人：免票。
材料二：优惠政策。1. 每年5月19日“中国旅游日”，所有游客半价。2. 20人以上的团体，每张成人票优惠10元。
材料三：开放时间。旺季（4月至10月）7:00—18:00；淡季（11月至次年3月）8:00—17:00。
?1 学生票多少钱？需要什么？ | What is a student ticket, and what is needed?
= 40元，凭学生证 | 学生票（凭学生证）：40元
- 80元，不用证件 ~figure
- 免票 ~figure
?1 12月去景区，最早几点可以入园？ | How early can you go in in December?
≈ 8:00 | 淡季（11月至次年3月）8:00—17:00
% 材料三把一年分成旺季和淡季，12月在“11月至次年3月”之间，属于淡季。淡季的开放时间是“8:00—17:00”，所以最早8点可以入园。 | Material three splits the year; December falls within November to March, the low season, which opens 8:00 to 17:00. So the earliest is eight.
- 7:00 ~figure
- 9:00 ~figure
?1 哪些人可以免票？ | Who goes free?
= 身高1.2米以下的儿童、65岁以上的老人 | 身高1.2米以下的儿童、65岁以上的老人：免票
- 所有学生 ~opposite
- 所有儿童 ~broad
?2 爸爸、妈妈、上初二的小明和70岁的奶奶平时一起去，门票一共多少钱？ | What do Dad, Mum, Xiaoming and Granny pay on an ordinary day?
≈ 200元 | 成人票：80元 | 学生票（凭学生证）：40元 | 65岁以上的老人：免票
- 280元 ~figure
- 240元 ~figure
?2 如果他们5月19日去，门票一共多少钱？ | And on 19 May?
≈ 100元 | 每年5月19日“中国旅游日”，所有游客半价 | 成人票：80元 | 学生票（凭学生证）：40元
- 200元 ~figure
- 0元 ~figure
?2 一个由25名成人组成的旅游团平时来，每张票多少钱？ | What does each of 25 adults pay?
≈ 70元 | 20人以上的团体，每张成人票优惠10元 | 成人票：80元
- 80元 ~part
- 40元 ~figure

# 两年的图书借阅
材料一：某校图书馆借阅量（本）。
文学类：前年6000，去年5400
科普类：前年2000，去年3000
历史类：前年1500，去年1800
漫画类：前年3000，去年2400
材料二：去年，学校新建了“科学角”，每月请一位科学老师推荐好书。
材料三：去年，图书馆把漫画书的借期从两周缩短为一周。
?1 去年借阅量最多的是哪一类？ | Which kind was borrowed most last year?
= 文学类 | 文学类：前年6000，去年5400
- 科普类 ~figure
- 漫画类 ~figure
?1 和前年相比，去年借阅量增加的有哪几类？ | Which kinds rose?
= 科普类和历史类 | 科普类：前年2000，去年3000 | 历史类：前年1500，去年1800
- 文学类和漫画类 ~opposite
- 四类都增加了 ~figure
?1 科普类去年比前年增加了多少本？ | By how many did science books rise?
≈ 1000本 | 科普类：前年2000，去年3000
% 科普类前年借了2000本，去年借了3000本。用去年的数减去前年的数，3000-2000=1000，所以增加了1000本。 | Science books went from 2000 to 3000: 3000 − 2000 = 1000 more.
- 3000本 ~figure
- 500本 ~figure
?2 科普类借阅量增加，可能和什么有关？ | What may explain the rise in science books?
≈ 和学校新建“科学角”、每月推荐好书有关 | 去年，学校新建了“科学角”，每月请一位科学老师推荐好书 | 科普类：前年2000，去年3000
- 和漫画书借期缩短有关 ~irrelevant
- 和文学书变少有关 ~unsaid
?2 漫画类借阅量减少，最可能的原因是什么？ | Why did comics most likely fall?
≈ 漫画书的借期缩短了 | 去年，图书馆把漫画书的借期从两周缩短为一周 | 漫画类：前年3000，去年2400
- 学校建了科学角 ~irrelevant
- 同学们都不识字了 ~unsaid
?2 根据材料，下面哪种说法不准确？ | Which statement is not accurate?
≈ 去年同学们最喜欢读科普书 | 文学类：前年6000，去年5400 | 科普类：前年2000，去年3000
% 科普类去年借了3000本，增加得最多；可是文学类去年借了5400本，仍然比科普类多得多。增加得多，不等于借得最多，所以说“最喜欢读科普书”不准确。其余两种说法都和表中的数据相符。 | Science books rose most, to 3000, but literature still reached 5400, far more. Rising most is not being borrowed most, so “they liked science best” is inaccurate. The other two statements fit the table.
- 去年历史类借阅量比前年多 ~figure
- 去年漫画类借阅量比前年少 ~figure

# 一周天气和运动会
材料一：未来一周天气预报。周一：晴，12—22℃；周二：多云，13—21℃；周三：小雨，10—15℃；周四：中雨，9—13℃；周五：阴，11—18℃；周六：晴，12—23℃；周日：晴转多云，13—22℃。
材料二：学校通知。本周秋季运动会原定周三、周四举行。如遇下雨，顺延到天气好转的上课日。周末不安排比赛。
?1 一周中气温最低的是哪一天？ | Which day is coldest?
= 周四，最低9℃ | 周四：中雨，9—13℃
- 周三 ~figure
- 周一 ~figure
?1 一周中有几天下雨？ | How many days of rain?
≈ 两天，周三和周四 | 周三：小雨，10—15℃ | 周四：中雨，9—13℃
- 一天 ~figure
- 三天 ~figure
?1 运动会原定在哪两天举行？ | On which days was the meeting set?
= 周三、周四 | 本周秋季运动会原定周三、周四举行
- 周六、周日 ~opposite
- 周一、周二 ~unsaid
?2 根据天气预报，运动会最可能改到哪一天开始？ | To which day will it most likely move?
≈ 周五 | 周五：阴，11—18℃ | 如遇下雨，顺延到天气好转的上课日
% 周三、周四都有雨，运动会要顺延到“天气好转的上课日”。周五是阴天，不下雨，又是上课日；周六虽然晴，但通知说“周末不安排比赛”。所以最可能改到周五。 | Wednesday and Thursday bring rain, so the meeting moves to the next fine school day. Friday is overcast but dry, and a school day; Saturday is fine but “no events at the weekend”. So Friday is likeliest.
- 周六 ~opposite
- 周三照常举行 ~opposite
?2 周五参加运动会，穿什么比较合适？ | What should one wear on Friday?
≈ 带一件外套，早晚比较凉 | 周五：阴，11—18℃
% 周五最低11℃，最高18℃，早晚只有十一二摄氏度，比较凉，中午也不算热。所以带一件外套最合适，运动时可以脱下，休息时再穿上。 | Friday runs from 11 to 18 degrees: cool morning and evening, not hot at noon. A jacket to take off for events and put on to rest suits best.
- 只穿短袖短裤 ~figure
- 穿棉衣 ~figure
?2 下面哪条信息和安排运动会没有关系？ | Which fact has nothing to do with the meeting?
≈ 周日晴转多云 | 周日：晴转多云，13—22℃ | 周末不安排比赛
% 运动会只在上课日举行，通知说“周末不安排比赛”。周日是周末，那天的天气再好再坏，也不会影响运动会的安排。 | The meeting is only held on school days; there are “no events at the weekend”. Sunday's weather, good or bad, cannot affect it.
- 周四有中雨 ~irrelevant
- 周五是阴天 ~irrelevant

# 不同年级的近视率
材料一：某市学生近视率调查。小学一年级：12%；小学六年级：45%；初中二年级：68%；高中二年级：80%。
材料二：调查发现，每天户外活动2小时以上的学生，近视率比户外活动不足1小时的学生低约三分之一。
材料三：护眼建议。1. 读书写字时，眼睛离书本约一尺。2. 连续用眼40分钟，要休息一下，向远处看看。3. 每天户外活动不少于2小时。
?1 初中二年级学生的近视率是多少？ | What share of grade-eight pupils are short-sighted?
= 68% | 初中二年级：68%
- 45% ~figure
- 80% ~figure
?1 材料一的数据说明了什么？ | What do the figures of material one show?
≈ 年级越高，近视率越高 | 小学一年级：12% | 高中二年级：80%
- 年级越高，近视率越低 ~opposite
- 小学生都不近视 ~figure
?1 连续用眼多长时间就要休息？ | After how long should eyes rest?
= 40分钟 | 连续用眼40分钟，要休息一下
- 2小时 ~figure
- 1小时 ~figure
?2 材料二说明户外活动和近视有什么关系？ | What does material two show of outdoor time?
≈ 户外活动多的学生，近视的比例更低 | 每天户外活动2小时以上的学生 | 近视率比户外活动不足1小时的学生低约三分之一
- 户外活动会让人近视 ~opposite
- 户外活动和近视没有关系 ~opposite
?2 材料三的哪条建议和材料二关系最密切？ | Which tip ties closest to material two?
≈ 每天户外活动不少于2小时 | 每天户外活动不少于2小时 | 每天户外活动2小时以上的学生
- 眼睛离书本约一尺 ~irrelevant
- 连续用眼40分钟要休息 ~irrelevant
?2 小华每天放学后在家看三小时平板电脑，中间不休息，周末也很少出门。根据材料，他应该怎样改？ | How should Xiaohua change?
≈ 每看40分钟休息一下，并且每天到户外活动2小时以上 | 连续用眼40分钟，要休息一下，向远处看看 | 每天户外活动不少于2小时
- 把平板电脑换成手机 ~irrelevant
- 只要坐得离屏幕近一点 ~opposite

# 高铁时刻和购票须知
材料一：甲市到乙市的高铁时刻表。
G101：7:30开，9:10到，二等座120元
G105：9:00开，10:20到，二等座120元
G109：12:15开，14:05到，二等座120元
G113：17:40开，19:00到，二等座120元
材料二：购票须知。1. 身高1.2米至1.5米的儿童购买儿童票，为成人票价的一半；身高不足1.2米的儿童，每名成人可免费带一名。2. 请至少在开车前20分钟到达车站。
?1 哪一趟车用时最短？ | Which train is quickest?
≈ G105和G113，都只用1小时20分钟 | G105：9:00开，10:20到 | G113：17:40开，19:00到
- G101 ~figure
- G109 ~figure
?1 G109从甲市开到乙市要多长时间？ | How long does G109 take?
≈ 1小时50分钟 | G109：12:15开，14:05到
% G109是12:15开，14:05到。从12:15到14:15是2小时，14:05比14:15早10分钟，所以要用2小时减去10分钟，就是1小时50分钟。 | G109 leaves at 12:15 and arrives at 14:05. 12:15 to 14:15 is two hours; 14:05 is ten minutes earlier, so the run takes 1 hour 50 minutes.
- 2小时10分钟 ~figure
- 1小时40分钟 ~figure
?1 身高1.4米的儿童，坐二等座要多少钱？ | What does a child of 1.4 m pay?
≈ 60元 | 身高1.2米至1.5米的儿童购买儿童票，为成人票价的一半 | 二等座120元
- 120元 ~figure
- 免费 ~figure
?2 李老师要在上午10:30以前到达乙市开会，他应该坐哪一趟车？ | Which train gets Mr Li in before 10:30?
≈ G101或G105 | G101：7:30开，9:10到 | G105：9:00开，10:20到
- G109 ~figure
- G113 ~figure
?2 李老师坐G105，最晚几点要到车站？ | When must he be at the station for G105?
≈ 8:40 | G105：9:00开 | 请至少在开车前20分钟到达车站
- 9:00 ~figure
- 8:00 ~figure
?2 妈妈带着身高1米的弟弟和身高1.3米的姐姐坐G101，一共要买多少钱的票？ | What does Mum pay with a boy of 1 m and a girl of 1.3 m?
≈ 180元 | 每名成人可免费带一名 | 为成人票价的一半 | 二等座120元
- 240元 ~figure
- 120元 ~figure

# 公园的共享单车
材料一：某公园三个入口的共享单车停放点，一天里的借车和还车数量。
东门：借出300辆，还入120辆
南门：借出150辆，还入330辆
西门：借出100辆，还入100辆
材料二：公园规定，单车只能停在入口的停放点，园内禁止骑行，请推行。
材料三：管理员每天傍晚会把车从车多的停放点运到车少的停放点。
?1 一天里借出单车最多的是哪个入口？ | Which gate lends the most bikes?
= 东门 | 东门：借出300辆，还入120辆
- 南门 ~figure
- 西门 ~figure
?1 哪个入口借出和还入的数量一样？ | At which gate do lends and returns match?
= 西门 | 西门：借出100辆，还入100辆
- 东门 ~figure
- 南门 ~figure
?1 南门一天里还入的车比借出的多多少辆？ | How many more come back than go out at the south gate?
≈ 180辆 | 南门：借出150辆，还入330辆
% 南门借出150辆，还入330辆。还入的减去借出的，330-150=180，所以多了180辆。 | The south gate lends 150 and takes back 330: 330 − 150 = 180 more.
- 150辆 ~figure
- 330辆 ~figure
?2 傍晚，管理员最可能把车从哪里运到哪里？ | From where to where will the bikes most likely be moved?
≈ 从南门运到东门 | 南门：借出150辆，还入330辆 | 东门：借出300辆，还入120辆 | 管理员每天傍晚会把车从车多的停放点运到车少的停放点
- 从东门运到南门 ~opposite
- 从西门运到南门 ~figure
?2 从数据看，游客最常走的路线可能是怎样的？ | What route do visitors most likely take?
≈ 从东门借车进来，从南门还车出去 | 东门：借出300辆，还入120辆 | 南门：借出150辆，还入330辆
- 从南门借车进来，从东门还车出去 ~opposite
- 大家都从西门进出 ~figure
?2 小明在园内看到一个同学骑着单车，他可以怎样提醒？ | What might Xiaoming say to a friend riding in the park?
= 公园里不能骑车，请下来推着走 | 园内禁止骑行，请推行
- 骑快一点，免得被管理员看见 ~opposite
- 把车停在园内的草地上 ~opposite
`;
