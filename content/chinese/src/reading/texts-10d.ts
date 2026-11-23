// The texts of the senior required reading topic of classical prose (docs/chinese-curriculum.md §18.9): short pieces of
// the pre-Qin masters, the histories, the Six Dynasties and the Song, all in the public domain and none of them a
// passage of the national textbooks. The notes after each text and the questions are written for this subject. The
// format is that of parsePieces in topic-kit.ts: a question's wrong options carry the reason they are wrong.

/** CLASSICAL_10 are the pieces of reading-10-classical: the sense of words and sentences in context, old and new, and what each text says and how it argues. */
export const CLASSICAL_10 = `
# 南辕北辙（《战国策》）
魏王欲攻邯郸，季梁闻之，中道而反，衣焦不申，头尘不去，往见王曰：“今者臣来，见人于大行，方北面而持其驾，告臣曰：‘我欲之楚。’臣曰：‘君之楚，将奚为北面？’曰：‘吾马良。’臣曰：‘马虽良，此非楚之路也。’曰：‘吾用多。’臣曰：‘用虽多，此非楚之路也。’曰：‘吾御者善。’此数者愈善，而离楚愈远耳。今王动欲成霸王，举欲信于天下。恃王国之大，兵之精锐，而攻邯郸，以广地尊名，王之动愈数，而离王愈远耳。犹至楚而北行也。”
注：邯郸，赵国的都城。季梁，魏国的大臣。衣焦不申，衣服皱了来不及整理。大行，大路。奚为，为什么。用，路费。御者，赶车的人。霸王，称霸天下的君主。信，使人信服。恃，依仗。数，多次。
?1 “我欲之楚”中的“之”是什么意思？ | What does 之 mean in 我欲之楚?
≈ 到、往 | 我欲之楚 | 君之楚，将奚为北面
% 这里的“之”后面跟着地名“楚”，季梁接着问“君之楚，将奚为北面”：你要去楚国，为什么往北走？可见“之”是动词，到、往的意思，不是今天常用的助词。 | 之 is followed by a place, 楚, and the reply asks why one going to Chu heads north: 之 is a verb, “go to”, not today's particle.
- 的 ~literal
- 他（代词） ~sense
?1 “吾用多”中的“用”是什么意思？ | What does 用 mean in 吾用多?
≈ 路费、用度 | 吾用多 | 用虽多，此非楚之路也
% 车主先说马好，再说“用多”，又说赶车的人好，都是在说自己去楚国的条件。路远要花钱，“用多”是说带的钱多，这是古代“用”作名词的意思，不是今天“使用”的意思。 | The traveller lists his advantages: good horses, much 用, a good driver. A long road costs money, so 用 here is a noun, funds for the journey, not today's verb “use”.
- 使用 ~modern
- 用处很多 ~sense
?1 “王之动愈数，而离王愈远耳”的意思是什么？ | What does this sentence mean?
≈ 大王这样的行动越多，离称霸天下的目标就越远 | 王之动愈数，而离王愈远耳 | 今王动欲成霸王
% “数”是多次；“离王”的“王”，承接前面“成霸王”，是称王、称霸的意思。季梁是说，大王越是打仗扩地，离成就霸业反而越远，就像那个往北走的人越走离楚国越远。 | 数 is “often”; the 王 in 离王, taking up 成霸王, means ruling as overlord. The more the king campaigns, the further he is from leadership, like the traveller walking north.
- 大王行动越快，离魏国就越远 ~sense
- 大王做的事越多，就越离不开大臣 ~sense
?2 季梁讲“南辕北辙”的故事，是要说明什么道理？ | What is Ji Liang's point?
≈ 方向错了，条件越好，离目标就越远 | 此数者愈善，而离楚愈远耳 | 此非楚之路也
% 车主马好、钱多、车夫好，可他走的“非楚之路”。季梁说“此数者愈善，而离楚愈远耳”：条件越好，走错方向走得越快，离目标也越远。所以关键在方向，而不在条件。 | Good horses, money and driver, but the wrong road. The better these are, the further from Chu: direction matters more than means.
- 去楚国一定要有好马 ~detail
- 出远门要多带路费 ~detail
?2 季梁是怎样劝说魏王的？ | How does Ji Liang persuade the king?
≈ 先讲路上遇到的事，再用“犹至楚而北行也”把魏王的做法比作那个人，以事喻理，委婉而有力 | 今者臣来，见人于大行 | 犹至楚而北行也 | 今王动欲成霸王
% 季梁没有直接说魏王错了，而是先讲一个路上见到的故事，人人都能看出那个人可笑；接着用“今王……”转到魏王身上，最后一句“犹至楚而北行也”点明两者一样。用故事作比，魏王容易接受。 | He does not accuse the king; he tells of a man on the road whose folly anyone sees, turns with 今王 to the king, and ends: it is like heading north for Chu. The parable makes the point easy to take.
- 直接批评魏王不懂打仗 ~misread
- 引用古书上的话来证明 ~nocite
?2 文中写季梁“中道而反，衣焦不申，头尘不去”，有什么作用？ | What do the details of his hurried return do?
≈ 写出他听到消息后急忙赶回、来不及整理衣冠，表现他对国事的忧虑和急切 | 中道而反，衣焦不申，头尘不去 | 季梁闻之
- 说明季梁很不爱干净 ~misread
- 说明季梁出门遇到了大风 ~unsaid

# 日远日近（《世说新语》）
晋明帝数岁，坐元帝膝上。有人从长安来，元帝问洛下消息，潸然流涕。明帝问何以致泣，具以东渡意告之。因问明帝：“汝意谓长安何如日远？”答曰：“日远。不闻人从日边来，居然可知。”元帝异之。明日集群臣宴会，告以此意，更重问之，乃答曰：“日近。”元帝失色，曰：“尔何故异昨日之言邪？”答曰：“举目见日，不见长安。”
注：晋明帝，东晋第二个皇帝，元帝的儿子。洛下，洛阳，西晋的都城。潸然，流泪的样子。东渡，指西晋亡后，皇室渡过长江到南方建立东晋。居然，显然。邪，同“耶”，语气词。
?1 “居然可知”中的“居然”是什么意思？ | What does 居然 mean here?
≈ 显然 | 居然可知 | 不闻人从日边来
% 明帝的理由是“不闻人从日边来”：只听说有人从长安来，没听说有人从太阳那里来，所以太阳远是明摆着的。“居然”在这里是显然的意思，不是今天表示出乎意料的“居然”。 | His reason: no one is heard to come from the sun, so its distance is plain. 居然 here means “clearly”, not today's “unexpectedly”.
- 竟然，出乎意料 ~modern
- 居住的地方 ~sense
?1 “元帝异之”中的“异”是什么意思？ | What does 异 mean in 元帝异之?
≈ 对……感到惊奇 | 元帝异之 | 不闻人从日边来，居然可知
% 几岁的孩子回答得这样有道理，元帝感到惊奇，所以第二天还要在群臣面前再问一次。“异”在这里是意动用法，“认为……奇异”。 | A small child answers so cleverly that the emperor marvels, and asks again before his ministers next day. 异 is used as “find strange”.
- 不同 ~otheruse
- 生气 ~sense
?1 “尔何故异昨日之言邪”的意思是什么？ | What does this sentence mean?
≈ 你为什么和昨天说的话不一样呢 | 尔何故异昨日之言邪 | 乃答曰：“日近。”
% 昨天明帝说“日远”，今天却说“日近”，所以元帝问他为什么改了口。这里的“异”是“不同于”，和前面“元帝异之”的“异”意思不一样。 | Yesterday “far”, today “near”: the emperor asks why. Here 异 is “differ from”, unlike 异 in 元帝异之.
- 你为什么对昨天的话感到奇怪 ~otheruse
- 你昨天为什么不说话 ~misread
?2 明帝两次回答不同，各自的理由是什么？ | What are the reasons for the two answers?
≈ 第一次说太阳远，因为没听说有人从太阳那边来；第二次说太阳近，因为抬头能看见太阳，却看不见长安 | 不闻人从日边来，居然可知 | 举目见日，不见长安
- 第一次说错了，第二次才说对 ~misread
- 两次都是随便说的，没有理由 ~misread
?2 明帝说“举目见日，不见长安”，在当时的情境中还有什么深意？ | What deeper sense does the second answer carry?
≈ 长安已经失去，回不去了，比太阳还远，这句话说出了元帝心中失去故都的悲伤 | 举目见日，不见长安 | 元帝失色 | 潸然流涕
% 元帝一听到长安、洛下的消息就“潸然流涕”，心里放不下失去的北方。明帝当着群臣说“不见长安”，正说中了这份痛处，所以元帝“失色”。一句孩子话，含着国破家亡的悲哀。 | News of the north brings the emperor to tears. The child's “I cannot see Chang'an”, said before the court, touches that wound, and the emperor pales: a child's words hold the grief of a lost homeland.
- 说明长安的天气不好，看不见 ~face
- 说明明帝想去长安游玩 ~unsaid
?2 这则故事表现了晋明帝怎样的特点？ | What does the story show of the boy?
≈ 年纪虽小，却聪明机敏，善于从不同角度说理 | 晋明帝数岁 | 不闻人从日边来，居然可知 | 举目见日，不见长安
- 不懂礼貌，当众顶撞父亲 ~misread
- 记性不好，忘了昨天说过的话 ~misread

# 记游松风亭（宋·苏轼）
余尝寓居惠州嘉祐寺，纵步松风亭下，足力疲乏，思欲就床止息。望亭宇尚在木末，意谓是如何得到？良久忽曰：“此间有甚么歇不得处！”由是如挂钩之鱼，忽得解脱。若人悟此，虽兵阵相接，鼓声如雷霆，进则死敌，退则死法，当甚么时也不妨熟歇。
注：寓居，暂住。惠州，今广东惠州，苏轼被贬到这里。纵步，随意散步。就床，到床上。木末，树梢。甚么，什么。雷霆，响雷。死法，被军法处死。熟歇，好好休息。
?1 “望亭宇尚在木末”的意思是什么？ | What does this sentence mean?
≈ 望见松风亭还在树梢那么高的地方 | 望亭宇尚在木末 | 意谓是如何得到
% “木末”是树梢，说亭子在高处，看上去还在树林的顶上；所以下一句他才想“是如何得到”：这要怎样才走得到呢？ | 木末 is the treetops: the pavilion still stands high above the trees, so he wonders how he will ever get there.
- 亭子是用木头做的 ~sense
- 亭子在树林的尽头倒塌了 ~sense
?1 “思欲就床止息”中的“就”是什么意思？ | What does 就 mean here?
≈ 靠近、到……上 | 思欲就床止息 | 足力疲乏
% 他走累了，“足力疲乏”，想到床上躺下休息。“就”是动词，靠近、到的意思，和今天副词“就”的用法不同。 | Tired, he wants to go to a bed and rest. 就 is a verb, “approach, go to”, not today's adverb.
- 马上 ~modern
- 成就 ~sense
?1 “由是如挂钩之鱼，忽得解脱”的意思是什么？ | What does this sentence mean?
≈ 从此像挂在鱼钩上的鱼，忽然得到了解脱 | 由是如挂钩之鱼，忽得解脱 | 此间有甚么歇不得处
% “由是”是从此、因此；“挂钩之鱼”是被钩住的鱼，比喻他一心想着非到亭子不可的紧张。想通了“这里有什么不能歇的”，就好像鱼从钩上脱了下来。 | 由是, “from this”; a hooked fish is his tense need to reach the pavilion. Seeing that he can rest right here, he is like a fish slipping off the hook.
- 他钓到了一条鱼，很高兴 ~face
- 他把鱼钩挂起来不钓了 ~misread
?2 苏轼从这次散步中悟出了什么道理？ | What does Su Shi learn on this walk?
≈ 人不必执着于一个目标，随处都可以停下来歇息，放下执念，心就自由了 | 此间有甚么歇不得处 | 若人悟此 | 当甚么时也不妨熟歇
% 他本来非要走到亭子才肯休息，越想越累；忽然想到“此间有甚么歇不得处”，就像鱼脱了钩。他说即使在两军交战、进退都是死的时候，悟了这一点也“不妨熟歇”，可见他说的是放下执念的心态。 | He insisted on reaching the pavilion and grew wearier; then saw he could rest anywhere, and was freed. Even in battle, with death ahead and behind, one who sees this may rest: he speaks of letting go.
- 走路累了就要马上回家 ~misread
- 登山一定要登到山顶 ~opposite
?2 文章最后写到“兵阵相接”“进则死敌，退则死法”，有什么作用？ | What does the battle at the end do?
≈ 用最紧急危险的处境作比较，说明这种心态在任何时候都适用，把小事上升为人生的道理 | 虽兵阵相接，鼓声如雷霆 | 当甚么时也不妨熟歇
- 说明苏轼当时正在打仗 ~unsaid
- 说明惠州经常发生战争 ~unsaid
?2 联系苏轼当时被贬惠州的处境，这篇短文流露出他怎样的人生态度？ | Given his exile, what attitude does the piece show?
≈ 身处逆境，却能随遇而安、旷达乐观 | 余尝寓居惠州嘉祐寺 | 此间有甚么歇不得处 | 由是如挂钩之鱼，忽得解脱
% 注释说他是被贬到惠州的，寄住在寺里。一次散步累了，他却从中悟出“此间有甚么歇不得处”：在哪里都可以安下心来。把被贬的处境也看作可以停歇的地方，表现出他的豁达。 | Exiled to Huizhou, lodging at a temple, he draws from a tired walk the thought that anywhere is a place to rest. Seeing even exile as such a place shows his open, untroubled spirit.
- 悲观失望，觉得人生没有意义 ~misread
- 对被贬十分愤怒，想要报复 ~unsaid

# 勉学（北齐·颜之推《颜氏家训》）
人生小幼，精神专利，长成已后，思虑散逸，固须早教，勿失机也。吾七岁时，诵《灵光殿赋》，至于今日，十年一理，犹不遗忘；二十之外，所诵经书，一月废置，便至荒芜矣。然人有坎壈，失于盛年，犹当晚学，不可自弃。孔子云：“五十以学《易》，可以无大过矣。”……幼而学者，如日出之光；老而学者，如秉烛夜行，犹贤乎瞑目而无见者也。
注：专利，专一而敏锐。散逸，分散。《灵光殿赋》，汉代的一篇赋。十年一理，十年温习一次。坎壈，困顿不顺利。盛年，年轻力壮的时候。《易》，《周易》。秉烛，拿着蜡烛。贤，胜过。瞑目，闭上眼睛。
?1 “精神专利”中的“专利”是什么意思？ | What does 专利 mean here?
≈ 专一而敏锐 | 人生小幼，精神专利 | 长成已后，思虑散逸
% “专利”和下句的“散逸”相对：小时候精神集中、敏锐，长大以后心思就分散了。这和今天法律上的“专利”完全不同，是古今异义。 | 专利 is set against 散逸: young, the mind is focused and keen; grown, it scatters. It has nothing to do with today's patent: an old sense, not the new.
- 发明创造的专有权利 ~modern
- 只对自己有利 ~sense
?1 “犹贤乎瞑目而无见者也”中的“贤”是什么意思？ | What does 贤 mean here?
≈ 胜过 | 犹贤乎瞑目而无见者也 | 如秉烛夜行
% 老了才学，像拿着蜡烛走夜路，虽然光弱，总比闭着眼睛什么也看不见要强。“贤乎”是胜过，是比较，而不是今天“贤人”的“有德才”。 | Learning late is walking at night by candle: weak light, but better than seeing nothing with eyes shut. 贤乎 compares, “surpasses”, not today's “virtuous”.
- 有道德、有才能 ~modern
- 贤惠 ~sense
?1 “然人有坎壈，失于盛年，犹当晚学，不可自弃”的意思是什么？ | What does this sentence mean?
≈ 然而人如果遭遇困顿，错过了年轻时学习的机会，还是应当晚些学，不能自己放弃 | 犹当晚学，不可自弃 | 然人有坎壈，失于盛年
% “然”表示转折：前面说要早学，这里退一步说，错过了早学的人怎么办；“坎壈”是困顿，“盛年”是年轻力壮的时候；“犹当”是还应当。意思是晚学也比不学好。 | 然 turns: having urged early study, he asks about those who missed it; 坎壈 is hardship, 盛年 one's prime; 犹当, “still should”. Late study beats none.
- 人都会有不顺利的时候，所以不用学习 ~opposite
- 晚上学习，不可以自己放弃 ~literal
?2 作者用自己七岁和二十岁以后背书的经历，要说明什么？ | What do his own memories show?
≈ 小时候记性好，学的东西不容易忘，所以要早学 | 至于今日，十年一理，犹不遗忘 | 一月废置，便至荒芜矣 | 固须早教，勿失机也
% 七岁背的赋，十年温习一次还记得；二十岁以后背的书，一个月不温就荒废了。两段经历一比，就证明了前面说的“固须早教，勿失机也”。 | A poem learnt at seven stays with one review a decade; books learnt after twenty fade in a month. The comparison proves his claim: teach early, miss not the time.
- 说明作者小时候很聪明，长大后变笨了 ~misread
- 说明《灵光殿赋》比经书好背 ~misread
?2 文章的观点是怎样一步一步展开的？ | How does the argument unfold?
≈ 先说要早学，用亲身经历证明；再转一步说错过了也要晚学，引孔子的话作证；最后用比喻总结早学和晚学都比不学好 | 固须早教，勿失机也 | 然人有坎壈，失于盛年，犹当晚学 | 如秉烛夜行
- 全文只说了要早学，没有说晚学 ~onepart
- 先讲故事，最后才提出观点 ~wrongorder
?2 “幼而学者，如日出之光；老而学者，如秉烛夜行”运用了什么方法？有什么作用？ | What method is this, and what does it do?
≈ 比喻和对比，把早学比作日出的光，把晚学比作烛光，形象地说明早学最好、晚学也有用 | 幼而学者，如日出之光 | 老而学者，如秉烛夜行 | 犹贤乎瞑目而无见者也
% 日出的光又亮又长，烛光虽弱却能照路，闭眼则什么也看不见。三样东西排在一起，早学、晚学、不学的差别一目了然，劝人学习的意思也更有力。 | Sunrise is bright and long, candlelight weak but useful, shut eyes see nothing. Set in a row, early, late and no study are plain to see, and the exhortation gains force.
- 引用论证，引用了孔子的话 ~nocite
- 夸张，说明老人看不清东西 ~noexaggerate

# 诲学说（宋·欧阳修）
玉不琢，不成器；人不学，不知道。然玉之为物，有不变之常德，虽不琢以为器，而犹不害为玉也。人之性，因物则迁，不学，则舍君子而为小人，可不念哉？
注：琢，雕琢。常德，不变的本性。迁，改变。念，考虑、深思。本文是欧阳修写给儿子的。
?1 “人不学，不知道”中的“知道”是什么意思？ | What does 知道 mean here?
≈ 懂得道理 | 人不学，不知道 | 玉不琢，不成器
% “不知道”在这里是两个词：“知”是懂得，“道”是道理。和上句“不成器”对应：玉不雕琢不能成为器物，人不学习就不懂得道理。这和今天“知道”一个词的用法不同。 | Here 知 is “understand” and 道 “the Way”: two words. As jade unworked is no vessel, a man unschooled knows not the Way. Unlike today's single word.
- 了解某件事情 ~modern
- 知道路怎么走 ~literal
?1 “人之性，因物则迁”的意思是什么？ | What does this sentence mean?
≈ 人的本性会受外物影响而改变 | 人之性，因物则迁 | 玉之为物，有不变之常德
% “迁”是改变。作者把人和玉对照：玉“有不变之常德”，不雕也还是玉；人却“因物则迁”，会跟着环境变化，所以不学就可能变坏。 | 迁 is “change”. Jade keeps its nature unworked; man shifts with what surrounds him, so without study he may go wrong.
- 人的性格天生就不会改变 ~opposite
- 人要因为物品而搬家 ~literal
?1 “可不念哉”的意思是什么？ | What does 可不念哉 mean?
≈ 难道可以不深思吗 | 可不念哉 | 舍君子而为小人
- 可以不去想念 ~modern
- 不可以读出来 ~sense
?2 作者为什么说人比玉更需要学习？ | Why does man need study more than jade?
≈ 玉不雕琢仍然是玉，人不学习却会变成小人 | 虽不琢以为器，而犹不害为玉也 | 不学，则舍君子而为小人
% 作者先从相同处说起：玉要琢、人要学。再说不同处：玉的本性不变，不琢“犹不害为玉”；人的本性会变，不学“则舍君子而为小人”。所以人比玉更不能不学。 | He starts from likeness, jade to be worked and man to study, then the difference: jade's nature holds, so it remains jade; man's shifts, so unschooled he sinks. Man can less afford not to learn.
- 玉比人更珍贵 ~misread
- 人比玉更容易雕琢 ~misread
?2 本文是怎样说理的？ | How does the piece reason?
≈ 先用类比，由玉不琢不成器引出人不学不知道；再用对比，指出人与玉的不同，层层深入 | 玉不琢，不成器；人不学，不知道 | 然玉之为物 | 人之性，因物则迁
- 举了很多历史人物的事例 ~noexample
- 只讲了玉，没有讲人 ~misread
?2 欧阳修写这篇短文给儿子，用意是什么？ | Why write this for his son?
≈ 告诫儿子要努力学习，做君子而不做小人 | 不学，则舍君子而为小人 | 可不念哉
- 教儿子怎样雕琢玉器 ~face
- 告诉儿子玉比学问更值钱 ~misread

# 循表夜涉（《吕氏春秋》）
荆人欲袭宋，使人先表澭水。澭水暴益，荆人弗知，循表而夜涉，溺死者千有余人，军惊而坏都舍。向其先表之时可导也，今水已变而益多矣，荆人尚犹循表而导之，此其所以败也。
注：荆，楚国。表，做标记。澭水，河名。暴益，突然上涨。循，顺着、按照。涉，蹚水过河。坏都舍，像大房子倒塌一样崩溃。向，从前、先前。导，引导过河。
?1 “使人先表澭水”中的“表”是什么意思？ | What does 表 mean here?
≈ 做标记 | 使人先表澭水 | 循表而夜涉
% “表”在这里是动词，在河里设立标记，标出可以过河的地方。后文“循表而夜涉”的“表”是名词，指这些标记。都不是今天“手表”“表格”的意思。 | Here 表 is a verb, to mark where the river can be forded; in 循表而夜涉 it is the noun, those marks. Neither is today's watch or form.
- 手表 ~modern
- 表面 ~sense
?1 “澭水暴益”中的“益”是什么意思？ | What does 益 mean here?
≈ 增加、上涨 | 澭水暴益 | 今水已变而益多矣
% “暴益”是突然上涨：河水猛涨，可楚国人不知道，还按原来的标记过河，结果淹死了很多人。后文“益多”的“益”是更加。 | 暴益, rose suddenly: the river swelled unseen, they followed the old marks and drowned. In 益多 later, 益 means “more”.
- 好处 ~modern
- 有益 ~sense
?1 “向其先表之时可导也”的意思是什么？ | What does this sentence mean?
≈ 先前他们做标记的时候，是可以按标记引导过河的 | 向其先表之时可导也 | 今水已变而益多矣
% “向”是先前，和下句的“今”相对：从前做标记时可以照着过河，现在水已经变了。不是今天“向着”的意思。 | 向, “formerly”, answers 今: when marked it could be crossed by them; now the water has changed. Not today's “towards”.
- 向着那些标记引导过河 ~modern
- 他们先去做标记是为了引导敌人 ~misread
?2 楚军失败的原因是什么？ | Why did Chu's army fail?
≈ 河水已经变了，他们却还按照原来的标记过河 | 今水已变而益多矣，荆人尚犹循表而导之 | 此其所以败也
- 宋国的军队太强大 ~unsaid
- 楚国人不会游泳 ~unsaid
?2 这则故事说明了什么道理？ | What does the story teach?
≈ 情况变了，做法也要跟着变，不能死守旧的办法 | 今水已变而益多矣 | 荆人尚犹循表而导之
% 标记本来是对的，“向其先表之时可导也”；错在水变了，人没有变。故事讽刺的是不看变化、死守老办法的做法。 | The marks were once right; the fault is that the water changed and they did not. It mocks clinging to old ways regardless of change.
- 晚上不要过河 ~detail
- 打仗不要偷袭别人 ~misread
?2 文章最后两句在结构上有什么作用？ | What do the last two sentences do?
≈ 在叙事之后议论，分析失败的原因，点明道理 | 向其先表之时可导也 | 此其所以败也
- 补充交代宋国的情况 ~unsaid
- 继续叙述过河的经过 ~role

# 引婴投江（《吕氏春秋》）
有过于江上者，见人方引婴儿而欲投之江中，婴儿啼。人问其故，曰：“此其父善游。”其父虽善游，其子岂遽善游哉？以此任物，亦必悖矣。
注：过，经过。方，正在。引，牵、拉。啼，哭。遽，就。任物，处理事情。悖，荒谬、违背情理。
?1 “其子岂遽善游哉”的意思是什么？ | What does this sentence mean?
≈ 他的儿子难道就会游泳吗 | 其子岂遽善游哉 | 其父虽善游
% “岂……哉”是反问：难道……吗；“遽”是就。父亲会游泳，孩子难道就会吗？当然不会。用反问，把道理说得更有力。 | 岂……哉 is a rhetorical question, “surely not…?”; 遽 is “thereupon”. The father swims, but does the child? Of course not. The question makes the point strongly.
- 他的儿子游得很快 ~misread
- 他的儿子哪里都去游泳 ~sense
?1 “以此任物，亦必悖矣”中的“悖”是什么意思？ | What does 悖 mean here?
≈ 荒谬、违背情理 | 以此任物，亦必悖矣 | 其子岂遽善游哉
- 悲伤 ~sense
- 背着 ~sense
?1 “见人方引婴儿而欲投之江中”中的“方”是什么意思？ | What does 方 mean here?
≈ 正在 | 见人方引婴儿而欲投之江中 | 有过于江上者
% 路过江边的人看见的时候，那人正拉着婴儿要往江里扔，所以“方”是正在。不是今天“方形”“方向”的意思。 | When the passer-by looks, the man is just then dragging the infant to the river: 方 is “just then”, not today's square or direction.
- 方形 ~modern
- 方法 ~sense
?2 这则寓言讽刺了什么样的人？ | Whom does the fable mock?
≈ 不看具体情况、用片面的根据作推断的人 | 此其父善游 | 其父虽善游，其子岂遽善游哉
% 那人的理由是“此其父善游”：父亲会游泳，所以孩子也会。可父亲会不等于孩子会，这是拿不相干的理由办事。寓言讽刺的就是这种不顾实际、凭想当然作判断的人。 | His reason: the father swims, so the child will. But one does not follow from the other; he acts on an irrelevant reason. The fable mocks judging by assumption, not fact.
- 不会游泳的人 ~misread
- 不爱孩子的父亲 ~misread
?2 “以此任物，亦必悖矣”在文中有什么作用？ | What does the last sentence do?
≈ 由故事推到一般的处事，点明寓意 | 以此任物，亦必悖矣 | 其子岂遽善游哉
- 说明婴儿最后被淹死了 ~unsaid
- 交代那个人的身份 ~role
?2 这则寓言在写法上有什么特点？ | What marks the telling of the fable?
≈ 先简短地叙事，再用反问和议论说理，短小精悍 | 婴儿啼 | 其子岂遽善游哉 | 以此任物，亦必悖矣
- 用大量的细节描写人物的外貌 ~nolooks
- 用对话推动了曲折的情节 ~misread

# 孔子学琴（《史记》）
孔子学鼓琴师襄子，十日不进。师襄子曰：“可以益矣。”孔子曰：“丘已习其曲矣，未得其数也。”有间，曰：“已习其数，可以益矣。”孔子曰：“丘未得其志也。”有间，曰：“已习其志，可以益矣。”孔子曰：“丘未得其为人也。”
注：师襄子，鲁国的乐师。益，增加，这里指学新曲子。丘，孔子的名，孔子自称。数，弹奏的技法。有间，过了一段时间。志，曲子表达的意思。为人，作曲者的为人。
?1 “十日不进”中的“进”是什么意思？ | What does 进 mean here?
≈ 进一步学新的东西 | 十日不进 | 可以益矣
% 孔子学了十天还在练同一首曲子，没有往下学，所以师襄子说“可以益矣”，可以加学新的了。“不进”是不往前学，不是今天“不进门”的意思。 | Ten days on the same piece without moving on, so the master says he may add more. 不进 is not advancing, not today's “not enter”.
- 不进门 ~literal
- 没有进步 ~modern
?1 “丘已习其曲矣，未得其数也”的意思是什么？ | What does this sentence mean?
≈ 我已经熟悉了这首曲子，还没有掌握它的弹奏技法 | 丘已习其曲矣，未得其数也 | 已习其数，可以益矣
% “丘”是孔子自称，“习”是熟悉，“数”是技法。孔子是说，曲调我会了，可怎样弹好它的技法还没有掌握，所以不能急着学新的。 | 丘 is Confucius himself; 习, “be familiar with”; 数, technique. He knows the tune but not yet the art of playing it, so he will not move on.
- 我已经学了几首曲子，还没有数清楚 ~literal
- 我已经练习了很多次，不想再弹了 ~misread
?1 “有间”是什么意思？ | What does 有间 mean?
≈ 过了一段时间 | 有间，曰：“已习其数，可以益矣。” | 十日不进
- 有空闲 ~modern
- 有一个房间 ~literal
?2 孔子学琴经历了哪几个层次？ | Through what stages does he go?
≈ 从熟悉曲调，到掌握技法，再到领会曲意，最后体会作曲者的为人 | 丘已习其曲矣，未得其数也 | 丘未得其志也 | 丘未得其为人也
% 每次师襄子说可以学新的了，孔子都说还没有到：先是“曲”，再是“数”，再是“志”，最后是“为人”。一层比一层深，从外在的曲调一直深入到作曲者的内心。 | Each time the master says move on, he says not yet: tune, technique, meaning, and at last the man behind it, ever deeper from the outer sound to the composer's heart.
- 孔子学了四首不同的曲子 ~misread
- 孔子一直没有学会这首曲子 ~misread
?2 这段文字表现了孔子怎样的学习态度？ | What attitude to learning does it show?
≈ 精益求精，不满足于表面，追求深入透彻的理解 | 十日不进 | 丘未得其为人也 | 未得其数也
- 学得太慢，不够聪明 ~misread
- 不听老师的话 ~misread
?2 文中反复出现“可以益矣”和孔子的回答，这种写法有什么作用？ | What does the repeated exchange achieve?
≈ 反复的问答层层推进，突出孔子学习一步比一步深入 | 可以益矣 | 已习其志，可以益矣 | 孔子曰
- 说明师襄子说话很啰唆 ~misread
- 说明孔子没有听清老师的话 ~misread

# 掩耳盗钟（《吕氏春秋》）
范氏之亡也，百姓有得钟者，欲负而走，则钟大不可负；以椎毁之，钟况然有音。恐人闻之而夺己也，遽掩其耳。恶人闻之，可也；恶己自闻之，悖也。
注：范氏，春秋时晋国的贵族。亡，逃亡、败亡。负，背。椎，槌子。况然，形容钟声。遽，急忙。恶，害怕、讨厌。悖，荒谬。
?1 “欲负而走”中的“走”是什么意思？ | What does 走 mean here?
≈ 跑 | 欲负而走 | 则钟大不可负
% 古代的“走”是跑，“行”才是今天的走。这个人想背着钟跑掉，可钟太大背不动，才想把它砸碎。 | In old Chinese 走 is “run”; 行 is today's walk. He meant to run off with the bell on his back, but it was too big, so he tried to smash it.
- 慢慢地走 ~modern
- 离开家 ~sense
?1 “恶人闻之，可也”中的“恶”是什么意思？ | What does 恶 mean here?
≈ 害怕、讨厌 | 恶人闻之，可也 | 恐人闻之而夺己也
% 这里的“恶”读wù，是动词，害怕、不愿意。前文说他“恐人闻之”，怕别人听见来抢；这里说怕别人听见，还说得过去。不是“恶人”（坏人）的意思。 | Read wù, a verb, “dislike, fear”. He feared others would hear and seize it; to fear that is reasonable. Not 恶人, “wicked man”.
- 坏人 ~modern
- 凶恶 ~sense
?1 “恶己自闻之，悖也”的意思是什么？ | What does this sentence mean?
≈ 害怕自己听见，就荒谬了 | 恶己自闻之，悖也 | 遽掩其耳
% 他捂住自己的耳朵，好像自己听不见，别人也就听不见了。作者说，怕别人听见还可以理解，怕自己听见就荒唐了：钟声并不会因为自己捂耳朵就消失。 | He covers his own ears, as if others would then not hear. Fearing others hear is sense; fearing oneself hear is absurd: the sound does not vanish because he stops his ears.
- 讨厌自己的声音，是不对的 ~sense
- 自己听见钟声，就会很高兴 ~opposite
?2 这则寓言讽刺了什么样的人？ | Whom does the fable mock?
≈ 自己欺骗自己、以为别人也不知道的人 | 遽掩其耳 | 恶己自闻之，悖也
% 钟声是客观存在的，捂住自己的耳朵，别人照样听得见。偷钟的人以为自己听不见就安全了，这是自欺欺人。寓言讽刺的正是这种人。 | The sound is real; stopping his own ears, others still hear. He thinks himself safe because he hears nothing: self-deception, which the fable mocks.
- 不会敲钟的人 ~misread
- 力气太小的人 ~detail
?2 作者最后用两句话作评论，这两句是什么关系？有什么作用？ | How do the two closing comments relate, and why?
≈ 对比：怕别人听见还可以，怕自己听见就荒谬了，突出偷钟人的可笑 | 恶人闻之，可也 | 恶己自闻之，悖也
- 两句话意思一样，是重复 ~misread
- 两句都是在夸偷钟的人 ~opposite
?2 这则寓言的故事是怎样一步步发展的？ | How does the tale develop?
≈ 想背走钟，背不动；想砸碎钟，钟有响声；怕别人听见，就捂住自己的耳朵，一步比一步可笑 | 欲负而走，则钟大不可负 | 以椎毁之，钟况然有音 | 遽掩其耳
- 先写结果，再写原因 ~wrongorder
- 只写了一件事，没有发展 ~misread

# 用众（《吕氏春秋》）
物固莫不有长，莫不有短，人亦然。故善学者，假人之长以补其短。故假人者遂有天下。无丑不能，无恶不知。丑不能，恶不知，病矣。不丑不能，不恶不知，尚矣。
注：固，本来。假，借助、利用。丑，以……为耻。恶，讨厌、怕。病，毛病、困窘。尚，上，最好的。
?1 “假人之长以补其短”中的“假”是什么意思？ | What does 假 mean here?
≈ 借助、利用 | 假人之长以补其短 | 故假人者遂有天下
% “假”在这里是借的意思：借别人的长处来补自己的短处。下句“假人者”也是善于借助别人的人。不是今天“真假”的“假”。 | 假 here is “borrow”: use others' strengths to make up one's own lacks; 假人者 are those good at it. Not today's “false”.
- 虚假的 ~modern
- 放假 ~sense
?1 “物固莫不有长，莫不有短”的意思是什么？ | What does this sentence mean?
≈ 事物本来没有不存在长处的，也没有不存在短处的 | 物固莫不有长，莫不有短 | 人亦然
% “固”是本来；“莫不”是双重否定，没有不……，就是都有。意思是任何事物都既有长处又有短处，人也是这样。 | 固, “by nature”; 莫不, “none not”, a double negative meaning all. Everything has strengths and weaknesses, and so do people.
- 东西本来都是长的，没有短的 ~sense
- 坚固的东西没有长处 ~sense
?1 “丑不能，恶不知，病矣”的意思是什么？ | What does this sentence mean?
≈ 以自己不会为耻，讨厌自己无知，这就成了毛病 | 丑不能，恶不知，病矣 | 不丑不能，不恶不知，尚矣
% 这里的“丑”和“恶”都是动词：以……为耻、厌恶。作者认为，把不会当丑事、怕人知道自己不懂，就不肯向人请教，这是毛病；不以此为耻，才是最好的。 | 丑 and 恶 are verbs: be ashamed of, dislike. To be ashamed of not knowing, and so never ask, is a fault; not to be so is best.
- 长得丑，又很凶恶，就会生病 ~modern
- 不会做事的人都长得丑 ~misread
?2 本文的中心观点是什么？ | What is the central view?
≈ 善于学习的人，要借助别人的长处来弥补自己的短处 | 故善学者，假人之长以补其短 | 物固莫不有长，莫不有短
- 人只要有长处就够了 ~misread
- 有短处的人不能学习 ~misread
?2 文章开头说“物固莫不有长，莫不有短”，有什么作用？ | What does the opening do?
≈ 先讲一个普遍的事理，作为论点的根据，再由物推到人 | 物固莫不有长，莫不有短，人亦然 | 故善学者
% 文章先说万物都有长有短，“人亦然”，再用“故”引出结论：善学的人要借别人的长处补自己的短处。先立事理，再得结论，推理顺畅。 | It states that all things have strengths and lacks, people too, and then with 故 draws the lesson: borrow others' strengths. Principle first, conclusion after.
- 讲了一个故事 ~misread
- 引用了古人的话 ~nocite
?2 “不丑不能，不恶不知，尚矣”和前一句是什么关系？ | How does the last sentence relate to the one before?
≈ 正反对照，前句说以不会为耻是毛病，后句说不以此为耻才是最好的，使观点更鲜明 | 丑不能，恶不知，病矣 | 不丑不能，不恶不知，尚矣
- 两句话意思完全相同 ~misread
- 后一句推翻了全文的观点 ~misread
`;
