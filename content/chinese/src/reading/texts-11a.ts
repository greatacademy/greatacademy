// The texts of the selective required reading topics of the pre-Qin masters and of the histories
// (docs/chinese-curriculum.md §18.9): short pieces of Mencius, Zhuangzi, Xunzi, Han Feizi, Mozi, the Analects and Sunzi,
// and of the Zuo Commentary, the Records of the Historian, the Book of Han, the Book of the Later Han and the
// Comprehensive Mirror, all in the public domain and none of them a passage of the national textbooks or of the
// recited texts. The notes after each text and the questions are written for this subject. The format is that of
// parsePieces in topic-kit.ts: a question's wrong options carry the reason they are wrong, and `@ words` names the words
// of the text that refute an option where they are not the clue.

/** MASTERS_11 are the pieces of reading-11-masters: the words and sentences of the masters, and their thought and art of argument. */
export const MASTERS_11 = `
# 规矩（《孟子·离娄上》）
孟子曰：“离娄之明，公输子之巧，不以规矩，不能成方圆；师旷之聪，不以六律，不能正五音；尧舜之道，不以仁政，不能平治天下。今有仁心仁闻而民不被其泽，不可法于后世者，不行先王之道也。故曰：徒善不足以为政，徒法不能以自行。”
注：离娄，传说中眼力极好的人。公输子，公输班，鲁国的巧匠。规，画圆的工具；矩，画方的工具。师旷，春秋时晋国的乐师，耳力极好。六律，古代用来定音高的标准。五音，宫、商、角、徵、羽五个音阶。仁闻，仁爱的名声。被，蒙受。泽，恩惠。法，效法。徒，只、仅仅。
?1 “不能正五音”中的“正”是什么意思？ | What does 正 mean in 不能正五音?
≈ 校正，使……准确 | 不能正五音 | 不以六律
% “正”的后面带着宾语“五音”，前面说“不以六律”：不用定音的标准，就不能把五个音定准。所以“正”在这里是动词，校正、使准确的意思，和前面“成方圆”的“成”一样，都是说做成一件事。 | 正 takes the object 五音, and before it stands “without the six pitch-pipes”: without the standard, the notes cannot be set true. 正 is a verb here, “to set right”, like 成 in 成方圆.
- 正面，跟反面相对 ~sense
- 正在，表示动作在进行 ~modern
?1 “今有仁心仁闻而民不被其泽”中的“被”是什么意思？ | What does 被 mean here?
≈ 蒙受、得到 | 民不被其泽 | 今有仁心仁闻
% “被”的后面是“其泽”，君主的恩惠。君主有仁爱的心和名声，百姓却得不到他的恩惠，所以“被”是蒙受、得到的意思。它不是今天表示被动的“被”：句中没有谁对百姓做了什么。 | 被 is followed by 其泽, the ruler's bounty: he has a kind heart and a kind name, yet the people do not receive his bounty. 被 means “receive”, not today's passive marker; no one does anything to the people here.
- 表示被动，百姓被他的恩惠所害 ~modern
- 被子，盖在身上的东西 ~sense
?1 “徒善不足以为政，徒法不能以自行”的意思是什么？ | What does this sentence mean?
≈ 只有好心不足以治理政事，只有法度也不能让它自己施行 | 徒善不足以为政，徒法不能以自行 | 今有仁心仁闻而民不被其泽
% “徒”是只、仅仅。前一句接着“有仁心仁闻而民不被其泽”说，只有善心而不行仁政，百姓得不到好处；后一句说，只有法度，没有人去推行，它也不会自己起作用。两句合起来，是说善心和法度缺一不可。 | 徒 is “only”. The first half follows the ruler whose kindness never reaches the people: a good heart alone does not govern. The second: rules alone do not carry themselves out. Both are needed.
- 徒弟善良就能管理政事，法律能自动执行 ~sense
- 善良的人不应当从政，法律也不应当推行 ~misread
?2 孟子先说离娄、公输子、师旷，用意是什么？ | Why does Mencius begin with Li Lou, Gongshu and Shi Kuang?
≈ 用巧匠、乐师也离不开规矩和六律作类比，引出治理天下离不开仁政 | 不以规矩，不能成方圆 | 尧舜之道，不以仁政，不能平治天下
% 三句话句式相同：眼力最好、手最巧的人不用规矩画不成方圆，耳力最好的人不用六律定不准五音，就连尧舜之道不行仁政也治不好天下。前两个人人都懂的事是陪衬，第三句才是要说的道理：再贤明，也要有可行的制度。 | The three clauses run alike: the sharpest eye and hand need compass and square, the finest ear needs the pipes, and even the Way of Yao and Shun needs humane government. The first two, plain to all, set up the third, the point: even the wisest needs a working rule.
- 说明离娄和公输子是天下最聪明的人 ~detail
- 说明做木工比治理国家更难 ~unsaid
?2 “徒善不足以为政，徒法不能以自行”在思想上有什么特点？ | What is distinctive in this thought?
≈ 既要有仁爱之心，又要有可以推行的制度，二者缺一不可 | 徒善不足以为政 | 徒法不能以自行 | 今有仁心仁闻而民不被其泽
- 主张只靠严刑峻法来治理国家 ~otherschool
- 认为君主只要有仁爱之心就足够了 ~opposite
?2 孟子认为“民不被其泽”的原因是什么？ | Why, says Mencius, does the bounty not reach the people?
≈ 君主虽有仁爱之心和名声，却没有实行先王的仁政 | 今有仁心仁闻而民不被其泽 | 不行先王之道也
- 君主根本没有仁爱之心 ~opposite
- 百姓不懂得感恩 ~unsaid

# 材与不材（《庄子·山木》）
庄子行于山中，见大木，枝叶盛茂，伐木者止其旁而不取也。问其故，曰：“无所可用。”庄子曰：“此木以不材得终其天年。”夫子出于山，舍于故人之家。故人喜，命竖子杀雁而烹之。竖子请曰：“其一能鸣，其一不能鸣，请奚杀？”主人曰：“杀不能鸣者。”明日，弟子问于庄子曰：“昨日山中之木，以不材得终其天年；今主人之雁，以不材死。先生将何处？”庄子笑曰：“周将处夫材与不材之间。”
注：天年，自然的寿命。夫子，指庄子。竖子，童仆。雁，这里指家养的鹅。奚，哪一个。处，立身、处世。周，庄子的名。
?1 “舍于故人之家”中的“舍”是什么意思？ | What does 舍 mean here?
≈ 住宿 | 舍于故人之家 | 夫子出于山
% 庄子从山里出来，到了老朋友家里，主人很高兴，杀雁招待他，第二天弟子又问他话：他是在朋友家住下了。“舍”在这里是动词，住宿，不是今天“舍弃”的意思。 | Zhuangzi comes out of the hills to an old friend's house, is feasted, and is questioned there next day: he lodges there. 舍 is the verb “lodge”, not today's “give up”.
- 舍弃 ~modern
- 房屋 ~sense
?1 “其一能鸣，其一不能鸣，请奚杀？”的意思是什么？ | What does the boy's question mean?
≈ 一只会叫，一只不会叫，请问杀哪一只？ | 请奚杀 | 主人曰：“杀不能鸣者。”
% “奚”是疑问代词，哪一个，放在动词“杀”的前面。主人接着回答“杀不能鸣者”，正是在回答杀哪一只，可见童仆是在请主人选。 | 奚 is the question word “which”, set before the verb 杀. The master's reply, “kill the one that cannot cackle”, answers which, so the boy is asking him to choose.
- 一只会叫，一只不会叫，请您不要杀 ~sense
- 两只都不会叫，为什么要杀 ~misread
?1 “此木以不材得终其天年”中的“以”是什么意思？ | What does 以 mean here?
≈ 因为 | 此木以不材得终其天年 | 无所可用
% 伐木的人说这棵树“无所可用”，所以不砍它；庄子说它“以不材得终其天年”，是说它因为不成材才活到了自然的寿命。“以”在这里表示原因，后面弟子说雁“以不材死”，用法相同。 | The woodcutters leave the tree because it is of no use; it lives out its years because it is worthless. 以 marks the cause, as in the disciple's 以不材死.
- 用 ~sense
- 以为 ~modern
?2 弟子为什么向庄子发问？ | Why does the disciple question Zhuangzi?
≈ 树因为不成材活了下来，雁因为不成材被杀，同样“不材”，结果相反，弟子不知道该怎样立身 | 以不材得终其天年 | 以不材死 | 先生将何处
- 弟子觉得主人不该杀雁 ~unsaid
- 弟子想知道山中的树为什么没有被砍 ~part
?2 庄子说“周将处夫材与不材之间”，表达了怎样的处世态度？ | What attitude does his answer show?
≈ 不执着于有用或无用的任何一端，随着情势变化，以求保全自己 | 周将处夫材与不材之间 | 先生将何处
% 弟子的难题是：成材的树被砍，不成材的雁被杀，两头都有危险。庄子不选任何一头，说要处在“材与不材之间”，又是笑着说的：这是道家的态度，不固守一种做法，顺着情势应变，免受伤害。 | The disciple's dilemma: the useful tree is felled, the useless goose killed. Zhuangzi chooses neither end, smiling, “between the useful and the useless”: the Daoist way, holding to no one course, bending with circumstance to come to no harm.
- 认为人一定要有才能，才能保全自己 ~misread
- 主张积极出来做官，建功立业 ~otherschool
?2 文中把山木和雁两件事放在一起写，有什么作用？ | Why set the tree beside the goose?
≈ 两件事结果相反，形成对比，引出“材与不材”的难题，使道理更深一层 | 此木以不材得终其天年 | 杀不能鸣者 | 先生将何处
- 说明雁比树更有用 ~misread
- 两件事说明不成材的东西都能得到保全 ~opposite @以不材死

# 天行有常（《荀子·天论》）
天行有常，不为尧存，不为桀亡。应之以治则吉，应之以乱则凶。强本而节用，则天不能贫；养备而动时，则天不能病；修道而不贰，则天不能祸。故水旱不能使之饥，寒暑不能使之疾，袄怪不能使之凶。本荒而用侈，则天不能使之富；养略而动罕，则天不能使之全；倍道而妄行，则天不能使之吉。
注：天行，自然的运行。常，常规、规律。尧，传说中的贤君；桀，夏朝的暴君。本，指农业生产。养备，衣食充足。动时，按时令劳作。贰，背离。袄怪，反常的自然现象。侈，浪费。略，不足。罕，少。倍，同“背”。
?1 “则天不能贫”中的“贫”是什么用法、什么意思？ | How is 贫 used here?
≈ 使动用法，使……贫穷 | 则天不能贫 | 本荒而用侈，则天不能使之富
% 后文和它相对的一句是“则天不能使之富”，把“使之”说了出来：天不能使人富。照这个句子来读前一句，“天不能贫”就是天不能使人贫穷，“贫”是形容词用作使动。 | Its counterpart later spells out 使之, “make them”: heaven cannot make them rich. Read by that, 天不能贫 is “heaven cannot make them poor”: an adjective used causatively.
- 形容词，贫穷的 ~sense
- 名词，指穷人 ~sense
?1 “应之以治则吉”的意思是什么？ | What does this clause mean?
≈ 用合理的治理去适应自然的规律，就吉利 | 应之以治则吉 | 天行有常
% “之”指前面说的“天行有常”，自然有它不变的规律；“以治”是用好的治理。人用好的办法去应对这种规律就吉，用乱的办法应对就凶，下一句“应之以乱则凶”正和它相对。 | 之 is the constant course of heaven just named; 以治 is “with good order”. Meet it with order and fare well; the next clause, “meet it with disorder and fare ill”, is its pair.
- 答应他去治理国家就会吉利 ~sense
- 天会用安定的局面来回报人 ~misread
?1 “倍道而妄行”中的“倍”是什么意思？ | What does 倍 mean here?
≈ 违背 | 倍道而妄行 | 修道而不贰
% 这一句和前面的“修道而不贰”正好相对：一个是遵循正道、不背离，一个是“倍道”而胡乱行事。所以“倍”通“背”，违背，不是今天加倍的意思。 | It answers 修道而不贰, keeping the Way without straying: here one goes against the Way and acts wildly. 倍 stands for 背, “turn one's back on”, not today's “double”.
- 加倍 ~modern
- 背诵 ~sense
?2 本文的中心观点是什么？ | What is the central claim?
≈ 自然有自己的规律，不因人事而改变；人的吉凶在于自己怎样应对它 | 天行有常，不为尧存，不为桀亡 | 应之以治则吉，应之以乱则凶
- 天会奖赏贤明的君主，惩罚残暴的君主 ~opposite
- 人只能听天由命，什么也不必做 ~misread @强本而节用，则天不能贫
?2 “强本而节用，则天不能贫”和“本荒而用侈，则天不能使之富”放在一起，构成了怎样的论证？ | What do these two clauses together make?
≈ 正反对照，从两面说明贫富吉凶取决于人的作为，而不在于天 | 强本而节用，则天不能贫 | 本荒而用侈，则天不能使之富
- 举例论证，举了两个君主的事例 ~noexample
- 说明农业生产比节约更重要 ~misread
?2 和“天能赏罚人”的旧观念相比，荀子的看法有什么进步意义？ | Against the old belief that heaven rewards and punishes, what does Xunzi's view achieve?
≈ 把自然看作有规律的客观存在，强调人的努力，破除了对天的迷信 | 袄怪不能使之凶 | 天行有常 | 应之以治则吉
- 他完全否认自然对人有任何影响 ~broad
- 他认为天的力量比人的作为更重要 ~opposite

# 老马识途（《韩非子·说林上》）
管仲、隰朋从于桓公而伐孤竹，春往冬反，迷惑失道。管仲曰：“老马之智可用也。”乃放老马而随之，遂得道。行山中无水，隰朋曰：“蚁冬居山之阳，夏居山之阴，蚁壤一寸而仞有水。”乃掘地，遂得水。以管仲之圣而隰朋之智，至其所不知，不难师于老马与蚁；今人不知以其愚心而师圣人之智，不亦过乎？
注：管仲、隰朋，齐桓公的大臣。孤竹，古国名。蚁壤，蚁穴口堆起的小土。仞，古代长度单位，七尺或八尺为一仞。过，错。
?1 “春往冬反”中的“反”是什么意思？ | What does 反 mean in 春往冬反?
≈ 同“返”，返回 | 春往冬反 | 迷惑失道
% “往”和“反”相对：春天出发，冬天回来；正因为回来的路上“迷惑失道”，才要靠老马带路。所以“反”通“返”，返回。 | 往 and 反 are set against each other: out in spring, back in winter; and it is on the way back that they lose the road. 反 stands for 返, “return”.
- 反对 ~modern
- 相反 ~sense
?1 “蚁冬居山之阳，夏居山之阴”中的“阳”“阴”指什么？ | What are 阳 and 阴 here?
≈ 山的南面和山的北面 | 蚁冬居山之阳，夏居山之阴
% “阳”“阴”跟在“山之”后面，说的是山的方位。冬天冷，蚂蚁住在向阳的一面；夏天热，住在背阴的一面。古人把山的南面叫阳，北面叫阴。 | 阳 and 阴 follow 山之: they are sides of a hill. Ants winter on the sunny side and summer on the shady one; the ancients called a hill's south 阳 and its north 阴.
- 晴天和阴天 ~sense
- 太阳和月亮 ~literal
?1 “不难师于老马与蚁”的意思是什么？ | What does this clause mean?
≈ 不把向老马和蚂蚁学习当作难堪的事 | 不难师于老马与蚁 | 至其所不知
% “师”是动词，学习、以……为师；“不难”是不以为难。管仲、隰朋遇到自己不懂的事，就跟着老马走、照着蚂蚁的习性去挖，并不觉得向它们学有失身份。 | 师 is the verb “learn from”; 不难, “not find it hard”. Faced with what they did not know, these great men followed a horse and dug by the ways of ants without shame.
- 老马和蚂蚁的老师不难找 ~sense
- 向老马和蚂蚁学习是很难的事 ~opposite
?2 韩非讲这两件事，是要批评什么？ | What is Han Fei criticising?
≈ 今人不懂得向圣人的智慧学习，愚昧又自以为是 | 今人不知以其愚心而师圣人之智 | 不亦过乎
- 批评管仲和隰朋不认识路 ~misread @以管仲之圣而隰朋之智
- 批评人们不爱护动物 ~unsaid
?2 文中是怎样推出道理的？ | How is the lesson reasoned out?
≈ 由大推小：管仲、隰朋这样的圣智之人尚且向老马和蚂蚁学习，今人更应该向圣人学习 | 以管仲之圣而隰朋之智 | 今人不知以其愚心而师圣人之智
- 用对比说明动物比人聪明 ~misread
- 用比喻把圣人比作老马 ~nolikening
?2 “乃放老马而随之，遂得道”这样的叙述有什么特点？ | How is this told?
≈ 叙事简洁，只写做法和结果，为后面的议论提供事实 | 乃放老马而随之，遂得道 | 以管仲之圣而隰朋之智
- 用大段描写写出了行军的艰苦 ~notdescribe
- 写出了管仲对老马的感情 ~unsaid

# 非攻（《墨子·非攻上》节选）
今有一人，入人园圃，窃其桃李，众闻则非之，上为政者得则罚之。此何也？以亏人自利也。至攘人犬豕鸡豚者，其不义又甚入人园圃窃桃李。是何故也？以亏人愈多，其不仁兹甚，罪益厚。……杀一人谓之不义，必有一死罪矣。……当此，天下之君子皆知而非之，谓之不义。今至大为攻国，则弗知非，从而誉之，谓之义。此可谓知义与不义之别乎？
注：园圃，种果木菜蔬的园子。亏，使……受损。攘，偷取。豕，猪。豚，小猪。兹，更加。誉，称赞。
?1 “众闻则非之”中的“非”是什么意思？ | What does 非 mean in 众闻则非之?
≈ 指责，认为……不对 | 众闻则非之 | 上为政者得则罚之
% “非”后面带着宾语“之”，指偷桃李的人；众人听说了就“非之”，当官的抓到了就“罚之”，两个动词并列，都是对他的反应。所以“非”是动词，指责、认为不对。 | 非 takes 之, the thief, as object; the crowd 非 him as the officials punish him. It is a verb: “condemn”.
- 不是 ~modern
- 非常 ~sense
?1 “以亏人自利也”的意思是什么？ | What does this mean?
≈ 因为他损害别人来使自己得利 | 以亏人自利也 | 此何也
% 这是回答前面的“此何也”：为什么众人指责、官府处罚？因为他损害了别人，让自己得到好处。“以”表示原因，“亏”是使……受损。 | It answers “why is this?”: because he harms others for his own gain. 以 marks the cause; 亏 is “cause loss to”.
- 因为他做生意亏了本 ~modern
- 用自己的利益去补偿别人 ~sense
?1 “其不仁兹甚，罪益厚”中的“厚”是什么意思？ | What does 厚 mean here?
≈ 重、大 | 罪益厚 | 以亏人愈多
% 这里接着“亏人愈多”说：损害别人越多，越不仁，罪就越重。“厚”说的是罪的轻重，是重、大的意思。 | It follows “the more harm to others”: the greater the wrong, the heavier the guilt. 厚 measures guilt: “heavy”.
- 厚道 ~modern
- 东西扁平而上下距离大 ~literal
?2 墨子是怎样一步步推出结论的？ | How does Mozi reach his conclusion?
≈ 从偷桃李到偷犬豕，再到杀人，亏人越多罪越重，层层推进，最后指出攻国是最大的不义 | 窃其桃李 | 至攘人犬豕鸡豚者 | 今至大为攻国
- 先说出结论，再举一个例子证明 ~misread
- 用比喻说明战争的可怕 ~nolikening
?2 墨子问“此可谓知义与不义之别乎”，批评的是什么？ | What does his closing question attack?
≈ 人们知道小的不义，却把攻打别国这种最大的不义称为义，是非颠倒 | 则弗知非，从而誉之，谓之义 | 此可谓知义与不义之别乎
- 批评人们偷别人的桃李 ~detail
- 称赞攻打别国的君主有本事 ~misread
?2 本文表现了墨家的哪一种主张？ | Which Mohist teaching does it show?
≈ 非攻：反对攻打别国的战争 | 今至大为攻国 | 此可谓知义与不义之别乎
- 仁政：主张君主用道德感化百姓 ~otherschool
- 无为：主张顺其自然，不加干预 ~otherschool

# 论学（《论语》四则）
子曰：“吾尝终日不食，终夜不寝，以思，无益，不如学也。”（《卫灵公》）
子曰：“学如不及，犹恐失之。”（《泰伯》）
子曰：“我非生而知之者，好古，敏以求之者也。”（《述而》）
子贡问曰：“孔文子何以谓之‘文’也？”子曰：“敏而好学，不耻下问，是以谓之‘文’也。”（《公冶长》）
注：寝，睡觉。不及，追赶不上。敏，勤勉。孔文子，卫国的大夫，“文”是他死后的谥号。下问，向地位、学问不如自己的人请教。
?1 “学如不及，犹恐失之”的意思是什么？ | What does this saying mean?
≈ 学习好像追赶什么，总怕赶不上；赶上了，还怕把它丢掉 | 学如不及，犹恐失之
% “如不及”是好像追不上，写学习时的急切；“犹恐失之”是学到了还怕丢掉，写学过以后的用心。两半合起来，说的是对学习既要追，又要守。 | 如不及, as if one could never catch up: the eagerness of learning; 犹恐失之, still afraid to lose it: the care for what is learned. Chase it and keep it.
- 学习如果比不上别人，就会失去机会 ~sense
- 学得不够好，就会被老师批评 ~unsaid
?1 “不耻下问”的意思是什么？ | What does 不耻下问 mean?
≈ 不把向地位、学问不如自己的人请教当作耻辱 | 不耻下问 | 敏而好学
% “耻”是以……为耻，“下问”是向下请教。孔文子是大夫，地位高，却肯向不如自己的人请教，孔子把这和“敏而好学”并举，作为他配得上“文”这个谥号的理由。 | 耻 is “count as shameful”; 下问, to ask those below. A high minister willing to ask his inferiors: Confucius pairs this with diligence as why he earned the name 文.
- 不怕在下面提问题 ~literal
- 不好意思向别人请教 ~opposite
?1 “我非生而知之者”中的“生而知之”是什么意思？ | What is 生而知之?
≈ 生下来就懂得道理 | 我非生而知之者 | 好古，敏以求之者也
% “生而知之”和后半句“敏以求之”相对：一个是天生就懂，一个是勤勉地去求得。孔子说自己不是前一种人，而是后一种人。 | 生而知之, knowing from birth, stands against 敏以求之, seeking with diligence. Confucius says he is not the first but the second.
- 活着就要求知 ~sense
- 一生下来就认识很多字 ~broad
?2 孔子说自己“终日不食，终夜不寝，以思，无益”，想说明什么？ | What is he showing by his days and nights of thinking?
≈ 只空想而不学习，没有收获；思考要建立在学习的基础上 | 无益，不如学也 | 吾尝终日不食
% 孔子用自己的经历现身说法：整天不吃、整夜不睡地苦想，结果“无益”，不如去学。他不是否定思考，而是说离开了学习的空想没有用。 | He speaks from his own trial: thinking without food or sleep brought nothing; better to learn. Not a rejection of thought, but of thought cut off from learning.
- 学习的时候要不吃饭、不睡觉 ~misread
- 思考没有任何用处 ~broad
?2 几则合起来看，孔子心目中的“好学”包括哪些方面？ | Taken together, what is love of learning for Confucius?
≈ 勤勉地追求、学到了要守住、肯向不如自己的人请教，以学为本而不空想 | 敏以求之者也 | 犹恐失之 | 不耻下问 | 不如学也
- 天生聪明，不用学就懂得 ~opposite @我非生而知之者
- 只向比自己强的人学习 ~opposite @不耻下问
?2 孔子说“我非生而知之者”，这句话表现了他怎样的态度？ | What attitude does this saying show?
≈ 谦虚，认为学问来自后天的勤奋 | 我非生而知之者 | 好古，敏以求之者也
- 他觉得自己什么都不懂，很自卑 ~misread
- 他认为古代的东西不值得学 ~opposite @好古

# 君子有三乐（《孟子·尽心上》）
孟子曰：“君子有三乐，而王天下不与存焉。父母俱存，兄弟无故，一乐也；仰不愧于天，俯不怍于人，二乐也；得天下英才而教育之，三乐也。君子有三乐，而王天下不与存焉。”
注：王（wàng）天下，统治天下。与，在其中。故，灾祸、变故。怍，惭愧。
?1 “而王天下不与存焉”的意思是什么？ | What does this clause mean?
≈ 而统治天下并不在这三种快乐之中 | 而王天下不与存焉 | 君子有三乐
% “王天下”是统治天下，“与存”是在其中。孟子先说君子有三种快乐，接着说统治天下不在里面，后面列出的三乐里果然没有一样是权位。 | 王天下 is to rule the world; 与存, to be among them. Three joys, and ruling is not one: the list that follows has no power in it.
- 君王和天下的人不能共同生存 ~sense
- 君王不能和这三种快乐同时存在 ~misread
?1 “兄弟无故”中的“故”是什么意思？ | What does 故 mean in 兄弟无故?
≈ 灾祸、变故 | 兄弟无故 | 父母俱存
% 这一句和“父母俱存”并列，说的都是家人平安：父母都健在，兄弟没有遭遇灾祸。所以“故”是变故、灾祸，不是原因。 | It pairs with “both parents living”: the family safe, the brothers without mishap. 故 is mishap, not cause.
- 原因 ~modern
- 故意 ~sense
?1 “仰不愧于天，俯不怍于人”用了什么句式？意思是什么？ | What form is this, and what does it mean?
≈ 对偶句，抬头对天无愧，低头对人无惭，形容光明磊落 | 仰不愧于天，俯不怍于人
% “仰”对“俯”，“愧”对“怍”，“天”对“人”，两句字数相等、结构相同，是对偶。抬头不愧对天，低头不愧对人，说的是一个人行事端正，问心无愧。 | 仰 answers 俯, 愧 answers 怍, 天 answers 人: two even, matching clauses. Nothing to be ashamed of above or below: an upright life.
- 排比句，说明天比人更重要 ~misread
- 抬头不怕天，低头不怕人 ~sense
?2 孟子说的“三乐”分别关乎什么？ | What are the three joys about?
≈ 家人平安、自身品行无愧、教育天下英才 | 父母俱存，兄弟无故 | 仰不愧于天，俯不怍于人 | 得天下英才而教育之
- 富贵、长寿和名声 ~unsaid
- 读书、交友和游玩 ~unsaid
?2 孟子两次说“而王天下不与存焉”，有什么用意？ | Why say twice that ruling is not among them?
≈ 首尾反复，强调君子的快乐在于人伦和德行，而不在权位 | 而王天下不与存焉 | 君子有三乐
% 这句话放在开头，又放在结尾，把三乐包在中间。三乐说的是家人、品行和教育，没有一样和权力有关；首尾重复，就是要让人记住：这些比统治天下更值得快乐。 | The line opens and closes, enclosing the three joys: family, conduct, teaching, none of them power. The repetition fixes the point: these are worth more than rule.
- 说明孟子不会统治天下 ~misread
- 只是重复，没有什么作用 ~role
?2 从“得天下英才而教育之”可以看出孟子怎样的志趣？ | What does the third joy show of Mencius?
≈ 以传道育人为乐，非常重视教育 | 得天下英才而教育之 | 三乐也
% 孟子把教育英才列为君子的一乐，和父母健在、问心无愧并列，地位比统治天下还高。可见在他看来，把道理传给后来的人，是人生最值得的事之一。 | He sets teaching the gifted beside living parents and a clear conscience, above ruling the world: passing on the Way is among life's best things.
- 想招揽人才，帮自己夺取天下 ~opposite @而王天下不与存焉
- 认为只有英才才值得教育 ~broad

# 牛山之木（《孟子·告子上》节选）
孟子曰：“牛山之木尝美矣，以其郊于大国也，斧斤伐之，可以为美乎？是其日夜之所息，雨露之所润，非无萌蘖之生焉，牛羊又从而牧之，是以若彼濯濯也。人见其濯濯也，以为未尝有材焉，此岂山之性也哉？虽存乎人者，岂无仁义之心哉？其所以放其良心者，亦犹斧斤之于木也，旦旦而伐之，可以为美乎？……故苟得其养，无物不长；苟失其养，无物不消。”
注：牛山，在齐国都城临淄的东南。斧斤，斧头。息，生长。萌蘖，新长出的芽。濯濯，光秃秃的样子。材，指树木。放，丢失。旦旦，天天。苟，如果。
?1 “以其郊于大国也”中的“郊”是什么用法？ | How is 郊 used here?
≈ 名词用作动词，位于……的郊外 | 以其郊于大国也 | 斧斤伐之
% “郊”的后面跟着“于大国”，说牛山在大国都城的什么地方：在它的郊外。正因为离都城近，砍柴的人多，才“斧斤伐之”。名词“郊”在这里当动词用。 | 郊 is followed by 于大国: where the hill stands, outside a great city. Being near, it is cut by many axes. The noun is used as a verb.
- 郊游，到郊外去玩 ~modern
- 名词，指城外的地方 ~sense
?1 “是以若彼濯濯也”的意思是什么？ | What does this clause mean?
≈ 因此才像那样光秃秃的 | 是以若彼濯濯也 | 牛羊又从而牧之
% 前面说，山上本来会长出新芽，可牛羊又跟着来啃，“是以”就是因此。“濯濯”是光秃秃的样子，写山被砍、被啃以后的模样，不是洗得干净。 | New shoots would grow, but cattle graze them; 是以 is “therefore”. 濯濯 is bare, the hill after axe and herd, not washed clean.
- 所以它们像那样被洗得很干净 ~literal
- 因为这样才变得非常茂盛 ~opposite
?1 “此岂山之性也哉”的意思是什么？ | What does this question mean?
≈ 这难道是山的本性吗？ | 此岂山之性也哉 | 人见其濯濯也，以为未尝有材焉
% “岂……哉”是反问，意思是难道……吗。人们看见山光秃秃的，就以为它从来没长过树，孟子反问：这难道是山本来的样子吗？答案是否定的：山本来很美，是被砍秃的。 | 岂……哉 is a rhetorical “surely not”. People see a bare hill and think it never bore trees; Mencius asks: is that its nature? No: it was lovely once, and was stripped.
- 这就是山的本性啊 ~opposite
- 这座山怎么会有性格呢 ~sense
?2 孟子用牛山之木比喻什么？ | What does the forest of Ox Mountain stand for?
≈ 比喻人本有的善心，因为不断受到伤害而丧失 | 其所以放其良心者，亦犹斧斤之于木也 | 牛山之木尝美矣
- 说明齐国的树木被砍光了 ~face
- 比喻人天生就没有善心 ~opposite @岂无仁义之心哉
?2 “人见其濯濯也，以为未尝有材焉”说的是一种怎样的看法？ | What view is this?
≈ 只看到眼前的结果，就断定本来没有，忽视了被破坏的过程 | 以为未尝有材焉 | 此岂山之性也哉 | 牛山之木尝美矣
- 认为山上本来就没有长过树 ~oneside
- 批评人们乱砍树木 ~offpoint
?2 这段文字的论证有什么特点？ | How is this argued?
≈ 先写牛山由美变秃，再由山推到人，借比喻说理，又用反问加强语气 | 牛山之木尝美矣 | 亦犹斧斤之于木也 | 可以为美乎
- 引用古人的话作为论据 ~nocite
- 直接提出观点，再分条论述 ~misread

# 鲁侯养鸟（《庄子·至乐》）
昔者海鸟止于鲁郊，鲁侯御而觞之于庙，奏九韶以为乐，具太牢以为膳。鸟乃眩视忧悲，不敢食一脔，不敢饮一杯，三日而死。此以己养养鸟也，非以鸟养养鸟也。夫以鸟养养鸟者，宜栖之深林，游之坛陆，浮之江湖，食之鳅鲦，随行列而止，委蛇而处。
注：止，停落。鲁侯，鲁国的国君。御，迎接。九韶，舜时的乐曲。太牢，牛、羊、猪三牲俱全的宴席。眩视，眼花。脔，切成块的肉。坛陆，水中的沙洲。鳅鲦，泥鳅和白鲦鱼。委蛇（yí），从容自在的样子。
?1 “鲁侯御而觞之于庙”中的“觞”是什么用法？ | How is 觞 used here?
≈ 名词用作动词，向它敬酒 | 鲁侯御而觞之于庙 | 不敢饮一杯
% “觞”本是酒杯，这里后面带着宾语“之”（海鸟），又和动词“御”连用，是给海鸟敬酒的意思。后文海鸟“不敢饮一杯”，正是不喝鲁侯敬的酒。 | 觞 is a cup; here it takes 之, the bird, as object beside the verb 御: to toast it. Later the bird dares not drink a cup: the toast refused.
- 名词，指酒杯 ~sense
- 悲伤 ~sense
?1 “此以己养养鸟也，非以鸟养养鸟也”的意思是什么？ | What does this sentence mean?
≈ 这是用供养自己的方法去养鸟，不是用适合鸟的方法养鸟 | 此以己养养鸟也，非以鸟养养鸟也 | 奏九韶以为乐，具太牢以为膳
% 鲁侯给海鸟奏的是宫廷的音乐，摆的是人吃的宴席，这些都是人自己喜欢的。“以己养”是用养自己的方法，“以鸟养”是用养鸟的方法；第二个“养”是动词。下文接着说“以鸟养养鸟”该怎么做，正是后一种。 | Court music and a feast are what a man enjoys. 以己养, by one's own nurture; 以鸟养, by a bird's; the second 养 is the verb. What follows describes the bird's way.
- 这是自己养鸟，不是鸟养自己 ~sense
- 鲁侯用养鸟的方法来养自己 ~sense
?1 “宜栖之深林”中的“栖”是什么用法？ | How is 栖 used here?
≈ 使动用法，让它栖息 | 宜栖之深林 | 游之坛陆，浮之江湖
% “栖”后面带着“之”（鸟），再接地点“深林”，和后面的“游之坛陆，浮之江湖，食之鳅鲦”句式一样，都是让鸟怎样：让它栖在深林，让它游在沙洲，给它吃鱼。 | 栖 takes 之 and then a place, like 游之坛陆, 浮之江湖, 食之鳅鲦: let it roost in the woods, wander the sandbars, eat small fish.
- 名词，指栖息的地方 ~sense
- 鲁侯自己住到深林里去 ~who
?2 海鸟为什么“三日而死”？ | Why does the bird die in three days?
≈ 鲁侯用人所喜好的音乐和宴席对待它，不合鸟的天性 | 此以己养养鸟也 | 奏九韶以为乐，具太牢以为膳 | 鸟乃眩视忧悲
- 鲁侯故意要害死它 ~misread
- 海鸟本来就生了病 ~unsaid
?2 这则寓言表达了庄子怎样的思想？ | What does Zhuangzi teach by it?
≈ 万物各有自己的天性，应当顺应它，不能把自己的好恶强加给别的事物 | 非以鸟养养鸟也 | 随行列而止，委蛇而处
- 养鸟一定要用最好的东西 ~opposite @此以己养养鸟也
- 人不应该养任何动物 ~broad
?2 文中极写鲁侯招待的隆重，有什么作用？ | Why describe the welcome so grandly?
≈ 招待越隆重，越显出好心办坏事的荒谬，和“三日而死”形成强烈的反差 | 奏九韶以为乐，具太牢以为膳 | 三日而死
- 说明鲁国非常富有 ~offpoint
- 赞美鲁侯热情好客 ~misread

# 上兵伐谋（《孙子·谋攻》节选）
孙子曰：凡用兵之法，全国为上，破国次之；全军为上，破军次之。……是故百战百胜，非善之善者也；不战而屈人之兵，善之善者也。故上兵伐谋，其次伐交，其次伐兵，其下攻城。……故曰：知彼知己，百战不殆；不知彼而知己，一胜一负；不知彼，不知己，每战必殆。
注：全国，使敌国完整地降服。破，击破。上兵，用兵的上策。伐谋，挫败敌人的谋划。伐交，瓦解敌人的盟国。殆，危险。
?1 “不战而屈人之兵”中的“屈”是什么用法？ | How is 屈 used here?
≈ 使动用法，使……屈服 | 不战而屈人之兵 | 百战百胜，非善之善者也
% “屈”后面带着宾语“人之兵”，敌人的军队。不经过交战，就让敌军屈服，这是使动用法。前面说百战百胜还不是最好的，可见这里说的是一种比打胜仗更高明的结果。 | 屈 takes 人之兵, the enemy's army: to make it yield without a battle, a causative use. Since a hundred victories are not the best, this is a result above winning.
- 委屈 ~modern
- 弯曲 ~literal
?1 “百战不殆”中的“殆”是什么意思？ | What does 殆 mean in 百战不殆?
≈ 危险 | 百战不殆 | 每战必殆 | 一胜一负
% 三种情况排在一起：知彼知己，“不殆”；只知己，“一胜一负”；都不知，“每战必殆”。“殆”是最坏的情况，危险的意思。“不殆”不是每战必胜，而是不会陷于危险。 | Three cases in a row: knowing both, 不殆; knowing oneself, win one lose one; knowing neither, 必殆 each time. 殆 is the worst, “danger”; 不殆 is not “always win” but “never in peril”.
- 懈怠 ~sense
- 疲倦 ~sense
?1 “全国为上，破国次之”的意思是什么？ | What does this mean?
≈ 使敌国完整地降服是上策，击破敌国就次一等 | 全国为上，破国次之 | 不战而屈人之兵，善之善者也
% “全”和“破”相对，“上”和“次”相对。“全国”是让敌国完整地降服，“破国”是打破它。下文说“不战而屈人之兵”最好，可见“全”是不经过破坏就让对方降服。 | 全 against 破, 上 against 次: taking a state whole is best, breaking it second. The later praise of winning without battle shows 全 is surrender without ruin.
- 全国上下团结一致是最好的 ~modern
- 保全自己的国家最重要，打破别国次之 ~sense
?2 孙子为什么说“百战百胜，非善之善者也”？ | Why are a hundred victories not the best?
≈ 打仗总有伤亡和破坏，不经过交战就使敌人屈服，才是最高明的 | 不战而屈人之兵，善之善者也 | 全国为上，破国次之
- 他认为打胜仗是坏事 ~misread
- 他认为应当多打仗，越多越好 ~opposite
?2 “上兵伐谋，其次伐交，其次伐兵，其下攻城”是按什么排列的？ | How are the four ranked?
≈ 按代价由小到大、高明程度由高到低排列 | 上兵伐谋 | 其下攻城 | 全国为上，破国次之
- 按打仗的先后时间排列 ~wrongorder
- 按用兵的多少，兵越多越好 ~misread
?2 “知彼知己，百战不殆”一段运用了什么论证方式？ | How is the last passage argued?
≈ 分三种情况层层比较，说明了解敌我双方的重要 | 知彼知己，百战不殆 | 不知彼而知己，一胜一负 | 每战必殆
- 举例论证，举了三次战争 ~noexample
- 比喻论证，把打仗比作下棋 ~nolikening
`;

/** HISTORIES_11 are the pieces of reading-11-histories: the words and sentences of the histories, and their people and the historian's art. */
export const HISTORIES_11 = `
# 李广（《史记·李将军列传》节选）
广出猎，见草中石，以为虎而射之，中石没镞，视之石也。因复更射之，终不能复入石矣。……广廉，得赏赐辄分其麾下，饮食与士共之。……广之将兵，乏绝之处，见水，士卒不尽饮，广不近水；士卒不尽食，广不尝食。宽缓不苛，士以此爱乐为用。
太史公曰：传曰“其身正，不令而行；其身不正，虽令不从”。其李将军之谓也？余睹李将军悛悛如鄙人，口不能道辞。及死之日，天下知与不知，皆为尽哀。……谚曰“桃李不言，下自成蹊”。此言虽小，可以谕大也。
注：镞，箭头。更，再。辄，总是、就。麾下，部下。乏绝，缺水断粮。苛，苛刻。为用，为他效力。传，指古书，这里是《论语》。悛悛（xún），忠厚诚恳的样子。鄙人，乡下人。蹊，小路。谕，说明。
?1 “中石没镞”中的“没”是什么意思？ | What does 没 mean in 中石没镞?
≈ 陷入、隐没 | 中石没镞 | 终不能复入石矣
% 箭射中石头，“没镞”：箭头钻进了石头里看不见了。后面说再射就“不能复入石”，“入石”和“没镞”说的是同一件事，可见“没”是陷入、隐没，不是没有。 | The arrow struck the stone and its head sank out of sight; later shots could not 入石, enter the stone, the same thing. 没 is “sink in”, not “not have”.
- 没有 ~modern
- 死去 ~sense
?1 “得赏赐辄分其麾下”中的“辄”是什么意思？ | What does 辄 mean here?
≈ 总是、就 | 得赏赐辄分其麾下 | 饮食与士共之
% 这一句写李广“廉”：每次得到赏赐，就分给部下，吃喝也和士兵一起。“辄”说的是一贯这样做，总是、就的意思，和后文“饮食与士共之”一起写他的习惯。 | It shows his honesty: each reward he at once shares with his men, and he eats with them. 辄 is “always, at once”, a habit, like the shared meals.
- 车轮压出的痕迹 ~sense
- 偶尔、有时候 ~misread
?1 “桃李不言，下自成蹊”的意思是什么？ | What does the proverb mean?
≈ 桃树李树不会说话，可人们来摘果子，树下自然踩出了小路 | 桃李不言，下自成蹊 | 此言虽小，可以谕大也
% “蹊”是小路。桃李不会招呼人，可它的花和果子引来了人，来的人多了，树下就踩出了路。司马迁说这话“虽小，可以谕大”：字面说的是树，要说的是人。 | 蹊 is a path. Peach and plum call no one, but their blossom and fruit draw people, and a path is trodden beneath. “A small saying that tells a large thing”: it speaks of trees and means men.
- 桃李不会说话，所以树下长满了草 ~sense
- 老师不说话，学生自然成材 ~modern
?2 “射石”一事表现了李广怎样的特点？ | What does the stone episode show?
≈ 臂力过人，箭术高超 | 中石没镞 | 终不能复入石矣
% 把石头当成老虎，一箭射进石头里；知道是石头以后再射，就再也射不进去了。前一箭是在以为遇到老虎时全力射出的，可见他力气和箭术都非凡；后面射不进，反衬出那一箭的不寻常。 | Taking the stone for a tiger, his arrow sank into it; knowing it for a stone, he could never do it again. The first shot, in full strength against a tiger, shows his power; the failures after set it off.
- 他眼力不好，常常看错东西 ~misread
- 他喜欢打猎胜过带兵 ~unsaid
?2 司马迁引“桃李不言，下自成蹊”评价李广，用意是什么？ | Why does Sima Qian quote the proverb of him?
≈ 说明李广不善言辞，却凭真诚和品德赢得了人心 | 口不能道辞 | 皆为尽哀 | 桃李不言，下自成蹊
- 说明李广喜欢种桃树和李树 ~face
- 批评李广不会说话，吃了亏 ~misread
?2 文中写“士卒不尽饮，广不近水；士卒不尽食，广不尝食”，用了什么写法？ | How is this written?
≈ 用两组对举的细节写出他和士卒同甘共苦，为“士以此爱乐为用”作铺垫 | 士卒不尽饮，广不近水 | 士以此爱乐为用
- 用夸张说明李广从来不吃饭 ~noexaggerate
- 写李广的生活十分贫困 ~misread

# 胯下之辱（《史记·淮阴侯列传》节选）
淮阴侯韩信者，淮阴人也。始为布衣时，贫无行，不得推择为吏，又不能治生商贾，常从人寄食饮，人多厌之者。……淮阴屠中少年有侮信者，曰：“若虽长大，好带刀剑，中情怯耳。”众辱之曰：“信能死，刺我；不能死，出我袴下。”于是信孰视之，俛出袴下，蒲伏。一市人皆笑信，以为怯。
……信至国，召辱己之少年令出胯下者，以为楚中尉。告诸将相曰：“此壮士也。方辱我时，我宁不能杀之邪？杀之无名，故忍而就于此。”
注：布衣，平民。无行，没有可称道的品行。推择，推举选拔。治生商贾，经商谋生。屠中，屠户之中。若，你。中情，内心。袴，同“胯”。俛，同“俯”。蒲伏，同“匍匐”，爬行。国，指韩信的封国楚国。中尉，武官名。无名，没有正当的理由。就，成就。
?1 “若虽长大”中的“长大”是什么意思？ | What does 长大 mean here?
≈ 身材高大 | 若虽长大，好带刀剑 | 中情怯耳
% 少年说的是：你虽然个子高大，喜欢佩带刀剑，心里却是胆小的。“长大”和“好带刀剑”都是外表，用来和“中情怯”相对，是身材高大，不是今天从小长成大人的意思。 | The youth means: you are tall and wear a sword, but inside you are a coward. 长大 and the sword are outward show set against the timid heart: “tall”, not “grown up”.
- 从小孩长成大人 ~modern
- 年纪大 ~sense
?1 “于是信孰视之”中的“孰视”是什么意思？ | What is 孰视?
≈ 仔细地看 | 于是信孰视之 | 俛出袴下
% “孰”同“熟”，仔细。少年当众逼他，韩信没有马上行动，而是盯着对方看了很久，然后才俯身钻过去。“孰视”写出他在心里掂量，不是“谁看他”。 | 孰 stands for 熟, “closely”. Pressed before the crowd, Han Xin does not act at once: he looks the youth over long, then stoops. The look is a weighing, not “who looked”.
- 谁去看他 ~sense
- 很熟悉地看着 ~modern
?1 “我宁不能杀之邪”的意思是什么？ | What does this mean?
≈ 我难道不能杀了他吗？ | 我宁不能杀之邪 | 杀之无名，故忍而就于此
% “宁……邪”是反问，难道……吗。韩信说：当时我难道不能杀他？能，只是杀了他没有正当的理由，所以忍了下来，才有今天。下一句正说明了不杀的原因。 | 宁……邪 is rhetorical: could I not have killed him? I could, but with no just cause; so I bore it, and came to this. The next clause gives the reason.
- 我宁愿不杀他 ~modern
- 我宁可没有能力杀他 ~sense
?2 韩信受胯下之辱，表现了他怎样的性格？ | What does his bearing of the insult show?
≈ 能忍一时之辱，有远大志向，不逞匹夫之勇 | 杀之无名，故忍而就于此 | 于是信孰视之
- 他胆小怕事，不敢反抗 ~oneside @一市人皆笑信，以为怯
- 他其实打不过那个少年 ~unsaid
?2 韩信后来让侮辱他的少年做中尉，还称他“壮士”，说明了什么？ | What does his later reward of the youth show?
≈ 韩信胸襟宽广，不记私仇，也说明当年忍辱是有意的选择 | 召辱己之少年 | 此壮士也 | 方辱我时，我宁不能杀之邪
- 他想找机会报复那个少年 ~opposite @此壮士也
- 那个少年本来就是他的朋友 ~unsaid
?2 司马迁写“一市人皆笑信，以为怯”，在写法上有什么作用？ | What does the laughter of the market do?
≈ 以众人的误解反衬韩信的隐忍和志向，和后文他自己的话前后照应 | 一市人皆笑信，以为怯 | 故忍而就于此
- 说明韩信真的很怯懦 ~oneside
- 写出集市的热闹景象 ~nosetting

# 宫之奇谏假道（《左传·僖公五年》节选）
晋侯复假道于虞以伐虢。宫之奇谏曰：“虢，虞之表也。虢亡，虞必从之。晋不可启，寇不可玩。一之谓甚，其可再乎？谚所谓‘辅车相依，唇亡齿寒’者，其虞、虢之谓也。”公曰：“晋，吾宗也，岂害我哉？”……公曰：“吾享祀丰洁，神必据我。”对曰：“臣闻之，鬼神非人实亲，惟德是依。……”弗听，许晋使。宫之奇以其族行，曰：“虞不腊矣。”……冬十二月丙子朔，晋灭虢。……师还，馆于虞，遂袭虞，灭之。
注：假道，借路。虞、虢，春秋时的两个小国。表，外面的屏障。启，开启，这里指助长他的贪心。辅，面颊；车，牙床。宗，同宗，晋和虞的祖先同姓。享祀，祭祀。据，依附、保佑。实，句中助词。腊，年终的祭祀。馆，住宿。
?1 “寇不可玩”中的“玩”是什么意思？ | What does 玩 mean in 寇不可玩?
≈ 轻视、忽视 | 寇不可玩 | 晋不可启
% 这一句和“晋不可启”并列：对晋国的贪心不能开个头，对来犯的敌人不能掉以轻心。“玩”是轻视、不当回事，不是玩耍。 | It pairs with “Jin must not be given an opening”: an invader must not be taken lightly. 玩 is “make light of”, not “play”.
- 玩耍 ~modern
- 玩具 ~sense
?1 “一之谓甚，其可再乎”的意思是什么？ | What does this mean?
≈ 借一次已经过分了，难道还可以借第二次吗？ | 一之谓甚，其可再乎 | 晋侯复假道于虞以伐虢
% 开头说晋侯“复假道”，是第二次来借路。“一之谓甚”是一次就已经过分，“其可再乎”是反问，难道还能再来一次。宫之奇是说，上次借路已经错了，不能再错。 | Jin asks 复, a second time. 一之谓甚: once was too much; 其可再乎, surely not again. The first loan was a mistake already.
- 一次叫做很多，两次可以吗 ~sense
- 第一次很顺利，可以再来一次 ~opposite
?1 “鬼神非人实亲，惟德是依”是什么句式？意思是什么？ | What form is this, and what does it mean?
≈ 宾语前置，鬼神不是亲近哪一个人，只是依从有德行的人 | 鬼神非人实亲，惟德是依 | 吾享祀丰洁，神必据我
% 正常的语序是“非亲人”“惟依德”，“实”“是”把宾语“人”“德”提到了动词前面。宫之奇是在回答虞公“神必据我”：鬼神不认人，只认德。 | The plain order is 非亲人, 惟依德; 实 and 是 bring the objects 人 and 德 before their verbs. He answers the duke: spirits favour no man, only virtue.
- 判断句，鬼神不是人，和人很亲近 ~sense
- 被动句，人被鬼神亲近 ~sense
?2 宫之奇是怎样说明虞国不能借路的？ | How does Gong Zhiqi argue against the loan?
≈ 用“唇亡齿寒”作比，说明虞、虢相依，虢亡虞必亡；又指出晋国已借过一次，不可再纵容 | 辅车相依，唇亡齿寒 | 虢亡，虞必从之 | 一之谓甚
- 他说晋国军队太弱，打不过虢国 ~unsaid
- 他用祭祀丰洁来说服虞公 ~who @吾享祀丰洁，神必据我
?2 虞公两次拒绝劝谏的理由，反映了他怎样的认识？ | What do the duke's two answers show of him?
≈ 迷信同宗的情分和鬼神的保佑，看不到国家的利害和德行的重要 | 晋，吾宗也，岂害我哉 | 吾享祀丰洁，神必据我
- 他认为虢国比虞国更强大 ~unsaid
- 他相信了宫之奇的话，只是不敢得罪晋国 ~opposite @弗听，许晋使
?2 文章最后只写“晋灭虢……遂袭虞，灭之”，不加评论，有什么作用？ | Why end on the bare events?
≈ 用结局证实宫之奇的预见，把褒贬寓于叙事之中，不评而是非自明 | 遂袭虞，灭之 | 虢亡，虞必从之 | 虞不腊矣
- 说明作者对这件事没有看法 ~misread
- 说明虞国最后打败了晋国 ~opposite @遂袭虞，灭之

# 曲突徙薪（《汉书·霍光传》节选）
客有过主人者，见其灶直突，傍有积薪。客谓主人：“更为曲突，远徙其薪，不者且有火患。”主人嘿然不应。俄而家果失火，邻里共救之，幸而得息。于是杀牛置酒，谢其邻人，灼烂者在于上行，余各以功次坐，而不录言曲突者。人谓主人曰：“乡使听客之言，不费牛酒，终亡火患。今论功而请宾，曲突徙薪亡恩泽，焦头烂额为上客耶？”主人乃寤而请之。
注：突，烟囱。傍，同“旁”。徙，迁移。薪，柴草。更，改。不者，否则。且，将要。嘿然，同“默然”。俄而，不久。息，熄灭。灼烂者，被烧伤的人。上行，上座。录，记，这里指邀请。乡，同“向”，从前。亡，同“无”。寤，同“悟”。
?1 “更为曲突”中的“更”是什么意思？ | What does 更 mean here?
≈ 改 | 更为曲突，远徙其薪 | 见其灶直突
% 主人家的烟囱是直的，客人劝他“更为曲突”：把它改成弯的。“更”是改换，不是更加：句中没有拿什么来比较。 | The chimney is straight, and the guest advises making it bent. 更 is “change”, not “more”: nothing is compared.
- 更加 ~modern
- 再一次 ~sense
?1 “乡使听客之言”中的“乡使”是什么意思？ | What is 乡使?
≈ 假如当初 | 乡使听客之言，不费牛酒，终亡火患
% “乡”同“向”，从前；“使”是假使。这句话说的是已经过去的事：要是当初听了客人的话，就不用花牛和酒，也根本不会有火灾。是对过去的假设。 | 乡 is 向, “formerly”; 使, “if”. It supposes the past: had you listened then, no ox, no wine, no fire.
- 乡下的使者 ~literal
- 乡里派人去 ~sense
?1 “终亡火患”中的“亡”是什么意思？ | What does 亡 mean here?
≈ 同“无”，没有 | 终亡火患 | 不者且有火患
% 客人当初说“不者且有火患”，不改就会有火灾；这里说听了客人的话，“终亡火患”。“有火患”和“亡火患”相对，“亡”就是“无”。后面“曲突徙薪亡恩泽”的“亡”也是这个意思。 | The guest warned 且有火患, there will be fire; here, had he listened, 终亡火患. 有 against 亡: 亡 is 无, “none”, as again in 亡恩泽.
- 死亡 ~modern
- 逃亡 ~sense
?2 这则故事讽刺了一种什么现象？ | What does the story mock?
≈ 只重视事后出力补救的人，却忘了事先提出防范意见的人 | 曲突徙薪亡恩泽，焦头烂额为上客耶 | 而不录言曲突者
- 讽刺邻居救火不卖力 ~misread @邻里共救之
- 讽刺客人多管闲事 ~opposite @乡使听客之言
?2 “曲突徙薪亡恩泽，焦头烂额为上客耶”用了什么手法？有什么效果？ | What figures are in this line, and to what end?
≈ 对比和反问，把出主意防火的人和救火烧伤的人对照，有力地指出主人赏罚不当 | 曲突徙薪亡恩泽，焦头烂额为上客耶
% 前半句是劝改烟囱、搬柴草的人得不到恩惠，后半句是烧得焦头烂额的人坐了上座，两种人的待遇对照鲜明；句末“耶”是反问，难道该这样吗？道理不说破，却更有力。 | The adviser gets nothing; the scorched sit in the place of honour: a sharp contrast, and 耶 makes it a rhetorical question. The point unspoken is the stronger.
- 比喻，把客人比作烟囱 ~nolikening
- 夸张，说明火势很大 ~noexaggerate
?2 这个故事在今天常用来说明什么道理？ | What lesson is it used for today?
≈ 防患于未然比事后补救更重要 | 不费牛酒，终亡火患 | 曲突徙薪
- 失火以后一定要请邻居吃饭 ~detail
- 做饭的时候要小心用火 ~face

# 兼听则明（《资治通鉴·唐纪八》）
上问魏征曰：“人主何为而明，何为而暗？”对曰：“兼听则明，偏信则暗。昔尧清问下民，故有苗之恶得以上闻；舜明四目，达四聪，故共、鲧、驩兜不能蔽也。秦二世偏信赵高，以成望夷之祸；梁武帝偏信朱异，以取台城之辱；隋炀帝偏信虞世基，以致彭城阁之变。是故人君兼听广纳，则贵臣不得拥蔽，而下情得以上通也。”上曰：“善！”
注：上，指唐太宗。明，明察是非。暗，糊涂。清问，详细地询问。有苗，古代的部落。明四目，达四聪，指广泛地看、广泛地听。共、鲧、驩兜，传说中尧舜时的坏人。望夷之祸，秦二世被赵高逼死在望夷宫。台城之辱，梁武帝被困死在台城。彭城阁之变，隋炀帝在江都被杀。
?1 “人主何为而明，何为而暗”的意思是什么？ | What does the emperor ask?
≈ 君主怎样做才能明察，怎样做就会糊涂 | 人主何为而明，何为而暗 | 兼听则明，偏信则暗
% “何为”是做什么、怎样做；“明”“暗”说的是君主对是非看得清还是看不清。魏征的回答“兼听则明，偏信则暗”正对着这两问：怎样做明，怎样做暗。 | 何为 is “by doing what”; 明 and 暗 are seeing clearly or not. The reply answers both halves: listen widely and see; trust one and be blind.
- 君主为什么白天明亮，晚上黑暗 ~literal
- 君主做什么事光明，做什么事阴暗 ~sense
?1 “故有苗之恶得以上闻”中的“上闻”是什么意思？ | What is 上闻?
≈ 使君主听到 | 故有苗之恶得以上闻 | 下情得以上通也
% 尧详细地向百姓询问，所以有苗做的坏事能传到他耳中。“上”是向上，传到在上面的君主那里；结尾“下情得以上通”说的是同一件事：下面的情况能通到上面。 | Yao asked his people closely, so the misdeeds of the Miao reached him. 上 is upward, to the ruler; the close, “what is below reaches above”, says the same.
- 在上面有了名声 ~sense
- 向上面的人打听 ~sense
?1 “则贵臣不得拥蔽”中的“拥蔽”是什么意思？ | What is 拥蔽?
≈ 蒙蔽、遮挡 | 则贵臣不得拥蔽 | 而下情得以上通也 | 故共、鲧、驩兜不能蔽也
% 君主多方面听取意见，有权势的大臣就不能挡在君主和百姓之间，下面的实情才能传上来。前面说舜广听，坏人“不能蔽”，“拥蔽”和“蔽”一样，是遮挡、蒙蔽。 | When the ruler hears widely, powerful ministers cannot stand between him and the people. Shun's wide hearing meant the wicked 不能蔽; 拥蔽, like 蔽, is “screen, blind”.
- 拥护 ~modern
- 拥抱 ~literal
?2 魏征是怎样论证“兼听则明，偏信则暗”的？ | How does Wei Zheng argue his point?
≈ 正反举例：先举尧舜兼听的例子，再举秦二世、梁武帝、隋炀帝偏信的例子，最后总结 | 昔尧清问下民 | 秦二世偏信赵高 | 是故人君兼听广纳
- 只举了正面的例子 ~part
- 用比喻来说明 ~nolikening
?2 魏征举的三个反面例子有什么共同点？ | What do the three bad examples share?
≈ 都是君主只听信一个亲近的臣子，最后招来灾祸 | 秦二世偏信赵高 | 梁武帝偏信朱异 | 隋炀帝偏信虞世基
- 都是因为国家太穷 ~unsaid
- 都是被敌国打败的 ~unsaid
?2 魏征的回答为什么能打动唐太宗？ | Why does the answer win the emperor?
≈ 观点鲜明，用历代兴亡的事实作证，又落到君主自己的得失上 | 兼听则明，偏信则暗 | 以致彭城阁之变 | 是故人君兼听广纳
- 因为魏征说话很客气 ~unsaid
- 因为他引用了很多诗句 ~nocite

# 管鲍之交（《史记·管晏列传》节选）
管仲夷吾者，颍上人也。少时常与鲍叔牙游，鲍叔知其贤。管仲贫困，常欺鲍叔，鲍叔终善遇之，不以为言。……管仲曰：“吾始困时，尝与鲍叔贾，分财利多自与，鲍叔不以我为贪，知我贫也。吾尝为鲍叔谋事而更穷困，鲍叔不以我为愚，知时有利不利也。吾尝三仕三见逐于君，鲍叔不以我为不肖，知我不遭时也。吾尝三战三走，鲍叔不以我为怯，知我有老母也。公子纠败，召忽死之，吾幽囚受辱，鲍叔不以我为无耻，知我不羞小节而耻功名不显于天下也。生我者父母，知我者鲍子也。”
注：游，交往。善遇，好好对待。不以为言，不说什么。贾，做买卖。更，更加。不肖，没有才能。遭时，遇到好时机。走，逃跑。公子纠，齐桓公的哥哥，管仲曾辅佐他和桓公争位。召忽，和管仲一起辅佐公子纠的人。死之，为他而死。幽囚，囚禁。
?1 “吾尝三战三走”中的“走”是什么意思？ | What does 走 mean here?
≈ 逃跑 | 吾尝三战三走 | 鲍叔不以我为怯
% 打了三次仗，三次“走”，鲍叔却不认为他“怯”。别人会说他胆小，是因为他临阵逃跑了；所以“走”是古义，跑、逃跑，不是今天慢慢走路的意思。 | Three battles, three times he 走, yet Bao Shu did not call him a coward. Others would, because he ran: 走 is the old sense, “run away”, not today's “walk”.
- 走路 ~modern
- 离开家乡 ~sense
?1 “鲍叔不以我为不肖”中的“不肖”是什么意思？ | What is 不肖?
≈ 没有才能 | 鲍叔不以我为不肖 | 知我不遭时也
% 管仲三次做官三次被国君赶走，别人会认为他没本事；鲍叔却知道是时机不好。“不肖”和“不遭时”相对，说的是人的才能，没有才能的意思。 | Thrice in office and thrice dismissed, he would be thought incapable; Bao Shu knew it was ill timing. 不肖, set against bad timing, is “without ability”.
- 不孝顺 ~sense
- 长得不像父母 ~literal
?1 “知我不羞小节而耻功名不显于天下也”中“羞”“耻”是什么用法？ | How are 羞 and 耻 used?
≈ 都是意动用法，以……为羞，以……为耻 | 知我不羞小节而耻功名不显于天下也
% “羞”的后面带着“小节”，“耻”的后面带着“功名不显于天下”，意思是不把小节上的失误当作羞耻，却把功名不能显扬天下当作耻辱。两个词都是“认为……是羞耻”，是意动用法。 | 羞 takes 小节 and 耻 takes “fame not shown to the world”: not counting small lapses shameful, but counting obscurity a disgrace. Both mean “regard as shameful”.
- 都是形容词，害羞的、耻辱的 ~sense
- 都是使动用法，使……害羞，使……受辱 ~sense
?2 管仲列举的几件事，有什么共同之处？ | What do the episodes he lists share?
≈ 每件事看上去都是自己的短处，鲍叔都替他看到了背后的原因 | 鲍叔不以我为贪，知我贫也 | 鲍叔不以我为怯，知我有老母也 | 鲍叔不以我为无耻
- 都是管仲帮助鲍叔的事 ~misread
- 都说明管仲确实贪财怕死 ~misread
?2 “生我者父母，知我者鲍子也”表达了管仲怎样的感情？ | What feeling is in his last words?
≈ 对鲍叔深深的感激，把他看作和父母一样重要的知己 | 生我者父母，知我者鲍子也 | 鲍叔终善遇之
- 说明鲍叔是他的亲兄弟 ~face
- 抱怨父母不了解自己 ~misread
?2 司马迁在传中大段记下管仲自己的话，有什么好处？ | Why let Guan Zhong speak at such length?
≈ 让人物自己说出来，真切地表现管鲍的相知，比作者直接评价更有感染力 | 管仲曰 | 生我者父母，知我者鲍子也 | 鲍叔知其贤
- 说明司马迁和管仲是朋友 ~unsaid
- 只是为了把文章写长 ~offpoint

# 孔子世家赞（《史记·孔子世家》）
太史公曰：《诗》有之：“高山仰止，景行行止。”虽不能至，然心乡往之。余读孔氏书，想见其为人。适鲁，观仲尼庙堂车服礼器，诸生以时习礼其家，余祗回留之不能去云。天下君王至于贤人众矣，当时则荣，没则已焉。孔子布衣，传十余世，学者宗之。自天子王侯，中国言六艺者折中于夫子，可谓至圣矣！
注：止，句末语气词。景行，大路，比喻崇高的德行。乡，同“向”。诸生，儒生们。以时，按时。祗回，恭敬地徘徊。没，同“殁”，死。六艺，指《诗》《书》《礼》《乐》《易》《春秋》。折中，判断事物的标准，这里指以孔子的话为准则。
?1 “适鲁”中的“适”是什么意思？ | What does 适 mean in 适鲁?
≈ 到……去 | 适鲁 | 观仲尼庙堂车服礼器
% “适”后面是地名“鲁”，接着写在鲁国看到的孔子庙堂和礼器：司马迁是到了鲁国。“适”在这里是动词，到……去，不是合适、舒适。 | 适 is followed by the state of Lu, and then what he saw there: he went to Lu. 适 is the verb “go to”, not “suitable”.
- 合适 ~modern
- 舒适 ~sense
?1 “当时则荣，没则已焉”的意思是什么？ | What does this mean?
≈ 在世的时候很荣耀，一死也就完了 | 当时则荣，没则已焉 | 孔子布衣，传十余世
% “当时”是在世的时候，“没”同“殁”，死；“已”是停止、完结。这是说天下的君王和贤人，活着时风光，死了就被人忘了，正好和孔子“传十余世”相对。 | 当时 is in their lifetime; 没 is 殁, death; 已, ended. Kings and worthies shine while living and are forgotten after, against Confucius honoured for ten generations.
- 那时候很繁荣，后来就没有了 ~sense
- 那时候很荣耀，从来没有停止 ~sense
?1 “学者宗之”中的“宗”是什么意思？ | What does 宗 mean here?
≈ 尊崇，奉为宗师 | 学者宗之 | 传十余世
% “宗”后面带着宾语“之”（孔子），是动词。孔子的学说传了十几代，读书人都尊崇他、把他当作宗师。不是名词“祖宗”。 | 宗 takes 之, Confucius, as object: a verb. For ten generations scholars have revered him as their master. Not the noun “ancestor”.
- 祖宗 ~sense
- 宗教 ~modern
?2 司马迁引“高山仰止，景行行止”，表达了对孔子怎样的感情？ | What feeling does the quotation carry?
≈ 像仰望高山、走上大路一样，景仰孔子崇高的德行，虽然不能达到，却一心向往 | 高山仰止，景行行止 | 虽不能至，然心乡往之
- 说他想去爬一座高山 ~face
- 说孔子的学问高不可攀，不必去学 ~misread @虽不能至，然心乡往之
?2 “天下君王至于贤人众矣……孔子布衣，传十余世”运用了什么手法？有什么作用？ | What device is this, and why?
≈ 对比：君王和贤人身死名灭，孔子一介平民却世代受尊崇，突出孔子的伟大 | 当时则荣，没则已焉 | 孔子布衣，传十余世
- 比喻，把孔子比作君王 ~nolikening
- 说明君王都不如平民 ~broad
?2 这段“太史公曰”在写法上有什么特点？ | How is this appraisal written?
≈ 由读其书、到其地、观其礼，再到总的评价，层层推进，评论中带着真挚的感情 | 余读孔氏书，想见其为人 | 余祗回留之不能去云 | 可谓至圣矣
- 是对孔子一生经历的完整叙述 ~misread
- 只交代了写作的时间和地点 ~unsaid

# 张释之执法（《史记·张释之冯唐列传》节选）
上行出中渭桥，有一人从桥下走出，乘舆马惊。于是使骑捕，属之廷尉。释之治问。曰：“县人来，闻跸，匿桥下。久之，以为行已过，即出，见乘舆车骑，即走耳。”廷尉奏当，一人犯跸，当罚金。文帝怒曰：“此人亲惊吾马，吾马赖柔和，令他马，固不败伤我乎？而廷尉乃当之罚金！”释之曰：“法者天子所与天下公共也。今法如此而更重之，是法不信于民也。且方其时，上使立诛之则已。今既下廷尉，廷尉，天下之平也，一倾而天下用法皆为轻重，民安所措其手足？唯陛下察之。”良久，上曰：“廷尉当是也。”
注：上，指汉文帝。中渭桥，渭水上的桥。乘舆，皇帝的车驾。属，交付。廷尉，掌管刑狱的长官，这里指张释之。县人，乡下人。跸，帝王出行时清道，禁止行人通过。当，判罪。令，假使。固，难道。方，当。平，公正的标准。倾，偏。措，安放。
?1 “属之廷尉”中的“属”是什么意思？ | What does 属 mean here?
≈ 交付 | 属之廷尉 | 于是使骑捕
% 骑兵抓住了那个人，“属之廷尉”：把他交给廷尉处理，接着就写“释之治问”。“属”在这里是交付、托付，读zhǔ，不是属于。 | The horsemen seize the man and 属 him to the Commandant, and the next words are Zhang's trial of him. 属 is “hand over”, not “belong to”.
- 属于 ~modern
- 下属 ~sense
?1 “令他马，固不败伤我乎”的意思是什么？ | What does this mean?
≈ 假使是别的马，难道不会让我摔伤吗？ | 令他马，固不败伤我乎 | 吾马赖柔和
% 文帝说，幸亏我的马性子温和；“令他马”是假使换成别的马，“固……乎”是反问，难道不会……吗。他是在说这个人的罪很重，不该只罚钱。 | “Luckily my horse is gentle”; 令他马, had it been another; 固……乎, surely it would have thrown me. He means the crime is grave, not a matter of a fine.
- 命令别的马不要伤害我 ~modern
- 别的马本来就不会伤害我 ~sense
?1 “民安所措其手足”的意思是什么？ | What does this mean?
≈ 百姓的手脚该往哪里放呢？意思是百姓将不知道该怎样做才好 | 民安所措其手足 | 一倾而天下用法皆为轻重
% “安所”是在哪里，“措”是安放。前面说廷尉一偏，天下用法就会忽轻忽重；那样，百姓连手脚往哪里放都不知道，就是不知道怎样做才不犯法。这是夸张的说法，不只说手脚。 | 安所, “where”; 措, “place”. If the judge leans, law everywhere goes light and heavy, and the people will not know where to put hand or foot: they will not know how to keep the law.
- 百姓把手脚放在哪里才安全 ~face
- 百姓可以安心地做事 ~sense
?2 张释之坚持“罚金”的理由是什么？ | Why does Zhang hold to the fine?
≈ 法律是天子和天下人共同遵守的，不能因个人的愤怒而加重，否则法律就会失信于民 | 法者天子所与天下公共也 | 是法不信于民也 | 廷尉，天下之平也
- 他认为那个人根本没有犯法 ~opposite @一人犯跸，当罚金
- 他想讨好那个乡下人 ~unsaid
?2 张释之说“且方其时，上使立诛之则已”，在论辩中有什么作用？ | What does this concession do?
≈ 先退一步，承认皇帝当时可以自己处置，再强调既然交给廷尉就必须依法，使皇帝容易接受 | 且方其时，上使立诛之则已 | 今既下廷尉
- 说明他赞成当场杀掉那个人 ~misread
- 是在责怪皇帝当时没有处置 ~offpoint
?2 文中写文帝从“怒”到“良久”，再到“廷尉当是也”，表现了什么？ | What does the emperor's change show?
≈ 文帝经过思考，克制了怒气，接受了依法的判决，也衬托出张释之执法的公正和勇气 | 文帝怒曰 | 良久，上曰：“廷尉当是也。”
- 说明文帝一直很生气 ~onepart
- 说明张释之很害怕皇帝 ~misread

# 项羽少时（《史记·项羽本纪》节选）
项籍少时，学书不成，去学剑，又不成。项梁怒之。籍曰：“书足以记名姓而已。剑一人敌，不足学，学万人敌。”于是项梁乃教籍兵法，籍大喜，略知其意，又不肯竟学。……秦始皇帝游会稽，渡浙江，梁与籍俱观。籍曰：“彼可取而代也。”梁掩其口，曰：“毋妄言，族矣！”梁以此奇籍。籍长八尺余，力能扛鼎，才气过人，虽吴中子弟皆已惮籍矣。
注：项籍，字羽。学书，学写字。项梁，项羽的叔父。会稽，郡名。浙江，钱塘江。族，灭族。扛，举。惮，害怕。
?1 “又不肯竟学”中的“竟”是什么意思？ | What does 竟 mean here?
≈ 完成、到底 | 又不肯竟学 | 略知其意
% 项羽学兵法，“略知其意”，懂了个大概，就不肯“竟学”了：不肯学到底。“竟”是完成、终了，和“略”相对，不是今天“竟然”的意思。 | He grasps the gist of strategy and will not 竟 it: will not see it through. 竟 is “finish”, set against 略, not today's “unexpectedly”.
- 竟然 ~modern
- 边境 ~sense
?1 “梁以此奇籍”中的“奇”是什么用法？ | How is 奇 used here?
≈ 意动用法，认为……不寻常 | 梁以此奇籍 | 彼可取而代也
% “奇”后面带着宾语“籍”。项梁看到侄子一个少年竟敢说秦始皇“可取而代”，因此认为他不同寻常。不是让项籍变得奇特，而是项梁心里这样看他。 | 奇 takes 籍 as object. Hearing a boy say the First Emperor could be replaced, Liang thinks him extraordinary: not making him so, but deeming him so.
- 名词，奇怪的人 ~sense
- 使动用法，使项籍变得奇特 ~sense
?1 “彼可取而代也”的意思是什么？ | What does this mean?
≈ 那个人（秦始皇）是可以被取代的 | 彼可取而代也 | 秦始皇帝游会稽
% “彼”指正在出游的秦始皇。项羽看着皇帝的车马说：他的位置可以夺过来，由我来代替。所以项梁赶紧捂住他的嘴，说这话会招来灭族之祸。 | 彼 is the touring First Emperor. Watching his train, Yu says his place can be taken and filled. Hence Liang's hand over his mouth: such words bring death to the clan.
- 他可以把东西拿走，再找人代替 ~sense
- 秦始皇可以代替我 ~sense
?2 项羽说“剑一人敌，不足学，学万人敌”，表现了他怎样的性格？ | What does this saying show of him?
≈ 志向远大，自负豪放 | 学万人敌 | 彼可取而代也
- 他胆小，不敢和人比剑 ~unsaid
- 他很谦虚，愿意从头学起 ~opposite @又不肯竟学
?2 “略知其意，又不肯竟学”暗示了项羽怎样的弱点？ | What weakness does this hint at?
≈ 做事有始无终，不肯深入钻研，为他后来的失败埋下伏笔 | 略知其意，又不肯竟学 | 学书不成，去学剑，又不成
- 说明他学兵法很快就学成了 ~misread
- 说明他不喜欢兵法 ~opposite @籍大喜
?2 司马迁写项羽少年时的几件小事，在写法上有什么特点？ | How are these boyhood scenes written?
≈ 以小见大，用几处典型的言行勾画出人物的性格 | 书足以记名姓而已 | 彼可取而代也 | 力能扛鼎
- 用大段的心理描写来写人物 ~nothought
- 按年份写下了他一生的经历 ~broad

# 投笔从戎（《后汉书·班超传》节选）
班超字仲升，扶风平陵人……为人有大志，不修细节。然内孝谨，居家常执勤苦，不耻劳辱。有口辩，而涉猎书传。……家贫，常为官佣书以供养。久劳苦，尝辍业投笔叹曰：“大丈夫无它志略，犹当效傅介子、张骞立功异域，以取封侯，安能久事笔研间乎？”左右皆笑之。超曰：“小子安知壮士志哉！”
注：扶风平陵，地名。不修细节，不注意小事。内，在家里。执，从事。口辩，口才。涉猎，广泛地阅读。佣书，受雇替人抄书。辍业，停下手里的工作。傅介子、张骞，西汉时出使西域、立下大功的人。异域，外国，这里指西域。研，同“砚”。小子，对人的轻蔑称呼。
?1 “不耻劳辱”中的“耻”是什么用法？ | How is 耻 used here?
≈ 意动用法，以……为耻 | 不耻劳辱 | 居家常执勤苦
% “耻”后面带着宾语“劳辱”，又紧接着“居家常执勤苦”：在家常干辛苦的活，不把劳苦和受屈当作耻辱。是“认为……是耻辱”，意动用法。 | 耻 takes 劳辱, toil and humbling, beside “at home he did hard work”: he did not count drudgery shameful. A use of “regard as”.
- 名词，耻辱 ~sense
- 使动用法，使……受辱 ~sense
?1 “常为官佣书以供养”的意思是什么？ | What does this mean?
≈ 常常受官府雇用抄书，挣钱来供养家里 | 常为官佣书以供养 | 家贫
% 前面说“家贫”，所以要挣钱。“为官”是替官府，“佣书”是受雇抄书，“以供养”是用来养家。不是做官，也不是写书。 | The house is poor, so he must earn. 为官 is “for the government”; 佣书, copying for hire; 以供养, to keep the family. Not holding office, not writing books.
- 常常做官，靠书来养家 ~sense
- 常常替官员写书 ~sense
?1 “安能久事笔研间乎”的意思是什么？ | What does this mean?
≈ 怎么能长久地在笔砚之间做事呢？ | 安能久事笔研间乎 | 尝辍业投笔叹曰
% “安能……乎”是反问，怎么能……呢；“事”是从事，“笔研”是笔和砚台，指抄书写字的事。他说这话时把笔扔了，正是不愿一辈子抄书。 | 安能……乎 is rhetorical, “how could I”; 事, to work at; 笔研, brush and inkstone, copying. He throws down the brush as he says it: he will not copy all his life.
- 怎样才能长久地研究笔呢 ~sense
- 安心地长期抄书 ~opposite
?2 班超“投笔”时说的话表现了他怎样的志向？ | What ambition do his words show?
≈ 不甘平庸，要像傅介子、张骞那样到边疆建功立业 | 犹当效傅介子、张骞立功异域 | 安能久事笔研间乎
- 他讨厌读书写字 ~misread @而涉猎书传
- 他想回家照顾家人 ~unsaid
?2 文中先写班超“不修细节”，又写他“内孝谨”“不耻劳辱”，有什么作用？ | Why set these traits side by side?
≈ 从几个方面写人，大处有志、小处不拘，又孝顺勤苦，人物形象丰满 | 为人有大志，不修细节 | 然内孝谨 | 不耻劳辱
- 说明班超是个不孝顺的人 ~opposite @然内孝谨
- 前后矛盾，说明史书写错了 ~misread
?2 “左右皆笑之”和“小子安知壮士志哉”在写法上有什么作用？ | What do the laughter and his retort do?
≈ 以旁人的嘲笑反衬班超的志向，他的回答简短而有气势 | 左右皆笑之 | 小子安知壮士志哉
- 说明班超很生气，和人吵了起来 ~unsaid
- 说明身边的人都支持班超 ~opposite
`;
