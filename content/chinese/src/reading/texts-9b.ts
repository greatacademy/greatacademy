// The texts of the grade 9 reading topics of drama and of modes and forms (docs/chinese-curriculum.md §18.9), written
// for this subject; the people in them are made up. The format is that of parsePieces in topic-kit.ts: a question's
// wrong options carry the reason they are wrong.

/** DRAMA_9 are the scenes of reading-9-drama: the conflict each turns on, and what its lines and stage directions show. */
export const DRAMA_9 = `
# 搬家
（城里一套新房的客厅，纸箱堆了一地。儿子正在拆箱子，老父亲坐在一只旧木箱上，一动不动。）
儿子：爸，您起来一下，这箱子我搬到阳台去。
父亲：（不动）搬哪儿去？
儿子：阳台。新房子，放这么个旧箱子，不好看。
父亲：不好看？你小时候的衣服、你的奖状，都在这里头。
儿子：（笑）那些早就用不上了。
父亲：（站起来，摸着箱子上的铜锁）你娘在的时候，每年过年都要把它擦一遍。
（儿子愣住，半天没说话。他走过去，从口袋里掏出手帕，蹲下来擦箱子上的灰。）
儿子：爸，就放客厅吧。正好，缺个茶几。
父亲：（转过脸去，声音有点哑）……随你。
?1 这一场戏的矛盾冲突是什么？ | What is the conflict of the scene?
≈ 儿子嫌旧箱子不好看，要搬到阳台；父亲舍不得，因为箱子里装着一家人的记忆 | 新房子，放这么个旧箱子，不好看 | 你小时候的衣服、你的奖状，都在这里头
- 父子两人为了买新房吵架 ~unsaid
- 儿子不想搬到新房子里住 ~unsaid
?1 冲突是怎样解决的？ | How is the conflict resolved?
≈ 父亲说出母亲每年擦箱子，儿子明白了箱子的分量，主动把它留在客厅 | 你娘在的时候，每年过年都要把它擦一遍 | 爸，就放客厅吧
- 父亲同意把箱子搬到阳台 ~opposite
- 两人吵了一架，谁也不理谁 ~opposite
?1 这场戏的冲突在哪一句话那里出现了转折？ | Where does the conflict turn?
= 你娘在的时候，每年过年都要把它擦一遍 | 你娘在的时候，每年过年都要把它擦一遍
- 爸，您起来一下 ~elsewhere
- 那些早就用不上了 ~elsewhere
?2 父亲最后说“……随你”，这句台词的潜台词是什么？ | What lies under the father's “As you like”?
≈ 表面上说随儿子的便，其实心里很感动，只是不好意思说出来 | （转过脸去，声音有点哑）……随你 | 爸，就放客厅吧
% 儿子已经决定把箱子留在客厅，这正是父亲想要的。可父亲只说“随你”，好像无所谓。舞台说明写他“转过脸去，声音有点哑”，说明他忍着眼泪。这两个字背后，是说不出口的感动。 | The son has chosen to keep the box, which is what the father wanted, yet he says only “as you like”, as if it did not matter. The direction has him turn away, his voice husky: he is holding back tears. Under the two words lies a feeling he cannot say.
- 父亲还在生儿子的气 ~nomood
- 父亲真的不在乎箱子放在哪里 ~surface
?2 舞台说明“儿子愣住，半天没说话”有什么作用？ | What does the direction of the son's silence do?
≈ 用动作写出儿子内心受到触动，为他态度的转变作准备 | 儿子愣住，半天没说话 | 蹲下来擦箱子上的灰
- 说明儿子没听清父亲的话 ~sense
- 交代客厅里的布置 ~role
?2 儿子说“正好，缺个茶几”，这句台词表现了他怎样的心思？ | What does “we need a coffee table” show of the son?
≈ 他找一个轻松的理由留下箱子，照顾父亲的面子，不让气氛太沉重 | 正好，缺个茶几 | 爸，就放客厅吧
- 他真的只是想要一个茶几 ~surface
- 他嫌家里的家具太少 ~overread

# 一封信
（傍晚，乡村小学的办公室。年轻的林老师在收拾行李，老校长推门进来，手里拿着一封信。）
校长：林老师，城里学校的调令来了。
林老师：（停下手）这么快？
校长：（把信放在桌上）你在这儿三年，够辛苦了。孩子们……我会跟他们说的。
林老师：（拿起信，又放下）校长，小石头的作文，我还没改完。
校长：我来改。
林老师：他写的是“我的老师”，写的是我。
（窗外传来孩子们的读书声。林老师走到窗前，站了很久。）
林老师：校长，这封信……能不能先放在您那儿？
校长：（看着她，慢慢点了点头）放多久？
林老师：（笑了）等他们毕业。
?1 这场戏中林老师内心的矛盾是什么？ | What is the conflict inside Miss Lin?
≈ 一边是回城里的调令，一边是舍不得山村的孩子 | 城里学校的调令来了 | 他写的是“我的老师”，写的是我 | 林老师走到窗前，站了很久
- 她不喜欢城里的学校 ~unsaid
- 她和校长之间有矛盾 ~misread
?1 林老师最后作出了什么选择？ | What does she choose?
≈ 暂时不走，留下来，等孩子们毕业 | 这封信……能不能先放在您那儿 | 等他们毕业
- 马上回城里去 ~opposite
- 把孩子们都带到城里去 ~unsaid
?1 是什么让林老师下了决心？ | What decides her?
≈ 小石头写她的作文和窗外孩子们的读书声 | 他写的是“我的老师”，写的是我 | 窗外传来孩子们的读书声
% 她先想起小石头的作文还没改完，而那篇作文写的正是她；接着窗外传来读书声，她在窗前站了很久。这两件事都把她和孩子们连在一起，她心里的天平就倒向了孩子们这一边。 | She first remembers Stone's composition, which is about her; then reading voices come through the window and she stands there long. Both tie her to the children, and the balance tips their way.
- 校长不让她走 ~opposite
- 城里学校的条件不好 ~unsaid
?2 林老师说“小石头的作文，我还没改完”，潜台词是什么？ | What lies under “I have not marked Stone's essay”?
≈ 她舍不得离开孩子们，作文只是一个借口 | 小石头的作文，我还没改完 | 他写的是“我的老师”，写的是我
- 她担心校长不会改作文 ~surface
- 她嫌改作文太累 ~misread
?2 校长问“放多久？”，这句台词表现了他怎样的心情？ | What does the headmaster's “How long?” show?
≈ 他明白林老师的心思，心里感动，又不愿勉强她，所以只是轻轻一问 | （看着她，慢慢点了点头）放多久？ | 你在这儿三年，够辛苦了
- 他不同意林老师留下 ~opposite
- 他急着要林老师离开 ~opposite
?2 舞台说明“林老师走到窗前，站了很久”有什么作用？ | What does the direction at the window do?
≈ 用动作表现她内心的犹豫和斗争，推动她作出决定 | 林老师走到窗前，站了很久 | 校长，这封信……能不能先放在您那儿
- 说明窗外的风景很美 ~unsaid
- 说明她累了，想休息一下 ~misread

# 摊位
（夜市。两个摊位挨着，左边是卖烤肠的老马，右边是新来的卖烤串的小伙子阿亮。）
老马：（冲着阿亮）哎，你这烟，全往我这边飘！
阿亮：风往那边刮，我有什么办法？
老马：我在这儿摆了八年了，你一来，我的客人都被你熏跑了。
阿亮：（不服气）那你说怎么办？
（一个小女孩跑过来，手里攥着五块钱，站在两个摊位中间，不知道买哪个好。）
小女孩：叔叔，我妈妈病了，她想吃点热乎的，五块钱……够吗？
（老马和阿亮对看了一眼。）
老马：（拿了两根烤肠）够，够。
阿亮：（往袋子里放了几串烤串）我这儿再送几串。
（小女孩跑远了。两个人谁也没说话。过了一会儿，阿亮把烤炉往旁边挪了挪。）
老马：（递过去一个小板凳）坐会儿吧，忙一晚上了。
?1 这场戏开头的冲突是什么？ | What is the conflict at the start?
≈ 阿亮烤串的烟飘到老马的摊位上，老马觉得客人被熏跑了，两人争吵起来 | 你这烟，全往我这边飘 | 我的客人都被你熏跑了
- 两人争着要给小女孩东西 ~elsewhere
- 两人比谁的东西卖得便宜 ~unsaid
?1 小女孩的出现对冲突有什么作用？ | What does the girl do to the conflict?
≈ 让两人一起帮助她，在共同的善意中化解了矛盾 | 老马和阿亮对看了一眼 | 我这儿再送几串
- 让两人的矛盾更激烈了 ~opposite
- 和冲突没有关系 ~role
?1 冲突是怎样化解的？ | How is the conflict settled?
≈ 阿亮主动把烤炉挪开，老马递给他板凳，两人和解了 | 阿亮把烤炉往旁边挪了挪 | 坐会儿吧，忙一晚上了
% 帮完小女孩以后，两人“谁也没说话”，可接着阿亮把烤炉挪了挪，烟就不会再往老马那边飘；老马递过去小板凳，让他坐会儿。两人都没有说“对不起”，用动作就和好了。 | After helping the girl neither speaks, but Aliang moves his grill, so the smoke no longer drifts to Ma; Ma hands him a stool to sit. No one says sorry: they make peace by what they do.
- 老马换了一个地方摆摊 ~unsaid
- 两人又吵了一架才和好 ~opposite
?2 老马说“我在这儿摆了八年了”，表现了他怎样的心理？ | What does “eight years here” show of Ma?
≈ 觉得自己是老摊主，有点看不起新来的人，也担心生意被抢 | 我在这儿摆了八年了 | 我的客人都被你熏跑了
- 他想告诉别人自己很累 ~unsaid
- 他想把摊位让给阿亮 ~opposite
?2 结尾老马说“坐会儿吧，忙一晚上了”，这句台词的潜台词是什么？ | What lies under Ma's last line?
≈ 表示和解，原谅了阿亮，也向他表示友好 | 坐会儿吧，忙一晚上了 | 阿亮把烤炉往旁边挪了挪
- 老马想让阿亮早点收摊 ~surface
- 老马自己累了，想休息 ~who
?2 舞台说明“老马和阿亮对看了一眼”有什么作用？ | What does their exchanged glance do?
≈ 无声地写出两人在那一刻想到了一起，是情节转变的关键 | 老马和阿亮对看了一眼 | 够，够
- 说明两人还在生气 ~misread
- 交代夜市的环境 ~role

# 借书
（图书馆借书处。管理员王阿姨坐在柜台后，初三学生小宇抱着一摞书走过来。）
小宇：阿姨，我借这五本。
王阿姨：（翻了翻）一次只能借三本，这是规定。
小宇：就多两本嘛，下个月考试，我要复习。
王阿姨：规定就是规定。
小宇：（把书往柜台上一放）什么破规定！
（王阿姨抬起头，看了他一眼，没说话，拿出一张卡片，在上面写了几个字。）
王阿姨：这三本你先借走。另外两本，我放在柜台下面，给你留着，谁来借都不给。下周你还了书，再来拿。
小宇：（愣了一下，脸红了）阿姨，刚才……对不起。
王阿姨：（把卡片塞进书里）复习别熬太晚。
?1 这场戏的冲突是什么？ | What is the conflict?
≈ 小宇想一次借五本书，王阿姨坚持规定只能借三本 | 我借这五本 | 一次只能借三本，这是规定
- 小宇的书丢了，王阿姨要他赔 ~unsaid
- 王阿姨不让小宇进图书馆 ~unsaid
?1 冲突的高潮是哪一句？ | Where is the climax?
= 什么破规定 | （把书往柜台上一放）什么破规定！
- 阿姨，我借这五本 ~elsewhere
- 复习别熬太晚 ~elsewhere
?1 王阿姨是怎样解决矛盾的？ | How does she resolve it?
≈ 不破坏规定，只借三本，却把另外两本替他留着，既守规矩又体谅他 | 这三本你先借走 | 另外两本，我放在柜台下面，给你留着
% 王阿姨没有因为小宇发脾气就让步，三本还是三本；可她又想到小宇要复习，把剩下的两本藏在柜台下，谁来也不给。规定没破，小宇的难处也照顾到了。 | She does not yield to his temper: three is three. But thinking of his revision, she keeps the other two under the counter for no one else. The rule stands, and his need is met.
- 她让小宇一次借走了五本 ~opposite
- 她批评了小宇一顿 ~opposite
?2 王阿姨说“规定就是规定”，表现了她怎样的性格？ | What does “a rule is a rule” show?
≈ 做事讲原则，坚持规定 | 规定就是规定 | 一次只能借三本，这是规定
- 她不喜欢学生 ~misread
- 她不了解图书馆的规定 ~opposite
?2 王阿姨最后说“复习别熬太晚”，有什么作用？ | What does her last line do?
≈ 不提刚才的不愉快，只关心他的身体，表现她的宽容和关爱 | 复习别熬太晚 | 阿姨，刚才……对不起
- 批评小宇复习太晚 ~nomood
- 提醒小宇图书馆要关门了 ~surface
?2 舞台说明“王阿姨抬起头，看了他一眼，没说话”有什么作用？ | What does her silent look do?
≈ 制造悬念，让人以为她要生气，结果她却替小宇着想，情节出人意料 | 王阿姨抬起头，看了他一眼，没说话 | 给你留着，谁来借都不给
- 说明王阿姨没听见小宇的话 ~sense
- 说明王阿姨很生气，不想理他 ~onepart

# 渡口
（江边渡口，傍晚，风很大。老船工和他的儿子站在船边。）
儿子：爹，桥修好了，明天就通车。以后，没人坐船了。
老船工：（望着江面）嗯。
儿子：县里说了，给您安排到桥头看车站，一个月三千。
老船工：我不去。
儿子：您都六十五了，还撑什么船？
老船工：（抚摸着船桨）这条船，你爷爷撑过，我撑了四十年。江那边的孩子上学，江这边的人赶集，都是这条船送过去的。
儿子：可是现在有桥了呀！
（江对岸传来喊声：“船——！过江——！”）
老船工：（一把解开缆绳）听见没有？还有人要过江。
（老船工撑船离岸，儿子站在岸上，看着父亲的背影，慢慢摘下了帽子。）
?1 这场戏的冲突是什么？ | What is the conflict?
≈ 儿子要父亲放下撑船，去桥头上班；父亲舍不得撑了一辈子的船和渡口 | 给您安排到桥头看车站 | 我不去 | 这条船，你爷爷撑过，我撑了四十年
- 儿子反对修桥 ~unsaid
- 父子两人为了钱吵架 ~misread
?1 江对岸的喊声在冲突中起了什么作用？ | What does the call from across the river do?
≈ 说明还有人需要渡船，让老船工有了坚持的理由，推动冲突走向结局 | 江对岸传来喊声 | 听见没有？还有人要过江
- 说明对岸有人遇到了危险 ~unsaid
- 让父子两人吵得更厉害 ~opposite
?1 结尾儿子“慢慢摘下了帽子”，说明冲突有了怎样的结果？ | What does the son's removing his cap say of the outcome?
≈ 儿子理解并敬重父亲的选择，不再劝他 | 看着父亲的背影，慢慢摘下了帽子 | 老船工撑船离岸
% 摘下帽子是表示敬意的动作。父亲撑船走了，儿子没有再拦，也没有再说话，只是看着他的背影摘下帽子。可见儿子明白了父亲对这条船、对渡口的人的感情，从劝阻变成了敬重。 | Removing a cap is a mark of respect. The father pushes off; the son neither stops him nor speaks, but watches him go and takes off his cap. He has understood what the boat and its passengers mean to his father, and his urging turns to respect.
- 儿子生气了，转身回家 ~nomood
- 风太大，帽子快被吹掉了 ~literal
?2 老船工只说“嗯”“我不去”，台词很短，有什么作用？ | Why are the boatman's lines so short?
≈ 简短的台词写出他话少倔强，也写出他心里不好受 | 老船工：（望着江面）嗯 | 我不去
- 说明他没听懂儿子的话 ~sense
- 说明他身体不好，说不动话 ~unsaid
?2 老船工说“这条船，你爷爷撑过，我撑了四十年”，表达了什么？ | What does his line about the boat say?
≈ 这条船承载着几代人的生活和他对渡口的感情，他不愿意放下 | 这条船，你爷爷撑过，我撑了四十年 | 都是这条船送过去的
- 船太旧了，应该换一条新的 ~misread
- 他想让儿子也来撑船 ~unsaid
?2 舞台说明“风很大”有什么作用？ | What does the strong wind do?
≈ 交代环境，渲染气氛，也衬托老船工坚持撑船的不易 | 江边渡口，傍晚，风很大 | 老船工撑船离岸
- 说明第二天不能通车 ~unsaid
- 和剧情没有关系 ~role

# 选举
（初三（二）班教室，班长选举刚结束。黑板上写着票数：李明18票，赵亮17票。赵亮走到李明桌前。）
赵亮：恭喜你。
李明：（站起来）其实……我数票的时候，发现有一张票写的是“赵高”，我算成了废票。
赵亮：那是写错的吧？
李明：应该是投给你的。要是算上，就是十八比十八。
（全班安静下来。）
赵亮：（想了想）你为什么要说出来？没人知道。
李明：我知道。
（赵亮看着他，忽然伸出手。）
赵亮：那就再投一次。不管谁当，我都服。
李明：（握住他的手）一言为定。
?1 这场戏的矛盾是怎样产生的？ | How does the conflict arise?
≈ 李明发现一张写错名字的票被算成了废票，算上的话两人票数相同，选举结果有了问题 | 我算成了废票 | 要是算上，就是十八比十八
- 赵亮不服气，要求重新选举 ~opposite
- 有同学投了两次票 ~unsaid
?1 赵亮问“你为什么要说出来？没人知道”，李明回答“我知道”，这一问一答把冲突推向了哪里？ | Where does this exchange take the conflict?
≈ 推向高潮，显出李明宁可失去班长也要诚实，赢得了赵亮的敬佩 | 你为什么要说出来？没人知道 | 我知道 | 赵亮看着他，忽然伸出手
- 让两人吵了起来 ~opposite
- 说明李明后悔说出了真相 ~opposite
?1 这场戏的冲突是怎样解决的？ | How is it resolved?
= 两人约定重新投票，不管谁当选都服气 | 那就再投一次。不管谁当，我都服
- 李明把班长让给了赵亮 ~unsaid
- 老师宣布两人都当班长 ~unsaid
?2 李明的台词“我知道”有什么含义？ | What does “I know” mean?
≈ 即使别人不知道，自己心里清楚，诚实不是做给别人看的 | 我知道 | 你为什么要说出来？没人知道
% 赵亮的意思是：废票的事只有你知道，不说也不会被发现。李明只回了三个字“我知道”：别人不知道，可我自己知道。他说出真相，不是怕被发现，而是对得起自己。这三个字很短，却最能表现他的为人。 | Zhao means: only you knew; keep quiet and no one would find out. Li answers in two words: I know. Others may not, but he does. He spoke not for fear of discovery but to be true to himself; the shortest line shows him best.
- 李明知道自己一定会当选 ~sense
- 李明知道是谁投的票 ~surface
?2 舞台说明“全班安静下来”有什么作用？ | What does the silence of the class do?
≈ 渲染紧张的气氛，突出李明的话出人意料 | 全班安静下来 | 要是算上，就是十八比十八
- 说明同学们都睡着了 ~sense
- 说明下课了 ~unsaid
?2 赵亮最后说“不管谁当，我都服”，表现了他怎样的性格？ | What does Zhao's last line show?
≈ 为人大度，看重公平，被李明的诚实打动 | 不管谁当，我都服 | 赵亮看着他，忽然伸出手
- 他不在乎当不当班长 ~overread
- 他觉得自己一定能赢 ~unsaid

# 老屋
（老屋的院子里，枣树下。姐姐和弟弟在商量卖房子的事，母亲在屋里收拾东西。）
弟弟：买家出价不低，下周就签合同。
姐姐：妈知道吗？
弟弟：跟她说了，她说“你们看着办”。
姐姐：（摇头）她说“你们看着办”，就是不愿意。
弟弟：那怎么办？妈一个人住这里，我们都不放心。
（母亲端着一个旧瓷盆从屋里出来，盆里装着几个红枣。）
母亲：今年的枣，甜着呢，你们尝尝。（把盆放在石桌上）这棵树是你爸栽的，栽的那年，你刚会走路。
（弟弟拿起一个枣，没有吃，看着姐姐。）
姐姐：妈，合同的事，先不签了。我们想想别的办法。
母亲：（低头擦着盆沿）随你们……枣，多吃几个。
?1 这场戏的冲突是什么？ | What is the conflict?
≈ 姐弟俩为了照顾母亲想卖掉老屋，母亲心里舍不得 | 买家出价不低，下周就签合同 | 她说“你们看着办”，就是不愿意 | 这棵树是你爸栽的
- 姐姐和弟弟为了卖房的钱争吵 ~unsaid
- 母亲急着想把老屋卖掉 ~opposite
?1 姐姐最后为什么改变了主意？ | Why does the sister change her mind?
≈ 母亲端出枣、说起父亲栽树的事，姐姐明白老屋对母亲意义重大 | 这棵树是你爸栽的 | 妈，合同的事，先不签了
- 买家不想买了 ~unsaid
- 弟弟不同意卖房 ~misread
?1 这场戏的冲突解决了吗？ | Is the conflict resolved?
≈ 暂时缓和了，合同先不签，但怎样照顾母亲的问题还没有解决 | 合同的事，先不签了。我们想想别的办法 | 妈一个人住这里，我们都不放心
% 姐姐说“先不签了”，卖房的事放下了；可又说“想想别的办法”，说明他们担心母亲一个人住的问题还在。冲突没有完全结束，只是姐弟俩选择先顺着母亲的心意，再找别的路。 | 先不签了, not for now, sets the sale aside; 想想别的办法, “we will think of something”, shows the worry about her living alone remains. The conflict is not over; they choose to follow her wish first and seek another way.
- 完全解决了，母亲搬去和儿子住 ~unsaid
- 没有解决，房子还是卖了 ~opposite
?2 母亲说“你们看着办”，潜台词是什么？ | What lies under “You decide”?
≈ 她不愿意卖，但不想让孩子为难，所以不直接说出来 | 她说“你们看着办”，就是不愿意 | 这棵树是你爸栽的
- 她真的无所谓卖不卖 ~surface
- 她让孩子们自己去看房子 ~literal
?2 母亲说“这棵树是你爸栽的”，有什么作用？ | What does her line about the tree do?
≈ 不直接反对，而是借枣树说出老屋里的家人和回忆，委婉地表达不舍 | 这棵树是你爸栽的，栽的那年，你刚会走路 | 今年的枣，甜着呢
- 介绍枣树的品种 ~role
- 说明枣树太老，应该砍掉 ~misread
?2 舞台说明“弟弟拿起一个枣，没有吃，看着姐姐”表现了什么？ | What does the brother's look show?
≈ 弟弟心里也被触动了，在用眼神和姐姐商量 | 弟弟拿起一个枣，没有吃，看着姐姐 | 妈，合同的事，先不签了
- 弟弟不喜欢吃枣 ~misread
- 弟弟在生姐姐的气 ~nomood

# 比赛之前
（体育馆后台。明天是全市中学生乒乓球决赛。教练老周和队员小雨。）
小雨：周教练，我想退出。
教练：（放下手里的球拍）为什么？
小雨：对手是去年的冠军，我打不过她。输了，丢人。
教练：你跟她打过吗？
小雨：没有。
教练：没打过，你怎么知道打不过？
小雨：大家都这么说。
教练：（从包里拿出一个旧笔记本，翻开）这是我记的她去年每一场比赛。她反手强，正手急了容易出错。你的正手，全队最稳。
（小雨接过笔记本，一页一页地看。）
小雨：（抬起头）教练，您早就准备了？
教练：（笑）我等你自己来问。
?1 这场戏的冲突是什么？ | What is the conflict?
≈ 小雨害怕输给冠军想退出，教练希望她上场 | 周教练，我想退出 | 没打过，你怎么知道打不过
- 教练不让小雨参加比赛 ~opposite
- 小雨和对手吵了一架 ~unsaid
?1 教练是怎样化解小雨的畏难情绪的？ | How does the coach dispel her fear?
≈ 先问她有没有交过手，指出她只是听别人说；再拿出笔记本，分析对手的弱点和她的长处 | 没打过，你怎么知道打不过 | 她反手强，正手急了容易出错。你的正手，全队最稳
% 教练没有一开始就讲大道理，而是一问一答：“你跟她打过吗？”“没有。”这让小雨自己发现，“打不过”只是听来的。接着他拿出笔记本，用事实告诉她对手哪里弱、她自己哪里强。先破除她的顾虑，再给她信心。 | He does not lecture; he asks: have you played her? No. She sees for herself that “I can't win” is hearsay. Then the notebook shows by fact where the rival is weak and she is strong. First the doubt goes, then confidence comes.
- 批评小雨胆小 ~opposite
- 答应她输了也不要紧 ~unsaid
?1 结尾教练说“我等你自己来问”，说明了什么？ | What does his last line reveal?
≈ 教练早就看出小雨的顾虑，提前做好了准备，等她主动来找自己 | 我等你自己来问 | 教练，您早就准备了
- 教练不愿意帮小雨 ~opposite
- 教练刚刚才想到办法 ~opposite
?2 教练的台词“没打过，你怎么知道打不过？”有什么特点？ | What marks the coach's question?
≈ 用反问，抓住小雨话里的漏洞，简短有力 | 没打过，你怎么知道打不过 | 你跟她打过吗
- 是在嘲笑小雨 ~nomood
- 说明教练也不知道结果 ~misread
?2 舞台说明“小雨接过笔记本，一页一页地看”有什么作用？ | What does her reading the notebook do?
≈ 写出小雨被吸引、慢慢有了信心，是她态度转变的过程 | 小雨接过笔记本，一页一页地看 | 教练，您早就准备了
- 说明笔记本上的字很小 ~unsaid
- 说明小雨想把笔记本拿走 ~unsaid
?2 小雨说“大家都这么说”，表现了她怎样的心理？ | What does “everyone says so” show of her?
≈ 没有自己的判断，被别人的说法吓住了 | 大家都这么说 | 对手是去年的冠军，我打不过她
- 她和大家关系很好 ~unsaid
- 她已经认真研究过对手 ~opposite

# 门铃
（深夜，一套公寓里。独居的老人赵奶奶坐在沙发上看电视。门铃响了。）
赵奶奶：（警惕地）谁呀？
门外：奶奶，我是楼上的，我家水管漏了，可能渗到您家了，我来看看。
赵奶奶：（不开门）这么晚了，明天再说吧。
门外：（着急）水已经漏了一个小时了，再不看，您家天花板要泡坏了！
（赵奶奶抬头看天花板，一块水渍正在慢慢变大。她拿起电话。）
赵奶奶：（拨号）是物业吗？我是三楼的赵兰英，楼上有人说漏水，你们来个人看看。
（过了一会儿，门外传来另一个声音：“赵奶奶，我是物业小李，您开门吧。”赵奶奶从猫眼里看了看，才打开门。）
赵奶奶：（笑着）小伙子，别怪奶奶，一个人住，得小心。
楼上的青年：（擦着汗）奶奶，您做得对。
?1 这场戏的冲突是什么？ | What is the conflict?
≈ 楼上的青年急着进门查看漏水，独居的赵奶奶出于警惕不肯开门 | 我来看看 | （不开门）这么晚了，明天再说吧
- 赵奶奶和楼上的人吵架 ~misread
- 物业不肯来修水管 ~unsaid
?1 赵奶奶是怎样解决这个矛盾的？ | How does she resolve it?
≈ 先打电话叫物业来，确认身份后才开门，既安全又没有耽误修水管 | 是物业吗 | 赵奶奶从猫眼里看了看，才打开门
- 她一直不开门，等到天亮 ~opposite
- 她马上就开了门 ~opposite
?1 “一块水渍正在慢慢变大”在冲突中起什么作用？ | What does the spreading stain do?
≈ 证明漏水是真的，让情况变得紧急，推动赵奶奶想办法 | 一块水渍正在慢慢变大 | 她拿起电话
% 门外的人说漏水，赵奶奶不能确定是真是假；抬头一看，水渍真的在变大，可见事情是真的，而且越拖越糟。可她还是不能确定门外是谁，于是想出打电话给物业的办法。这块水渍让冲突更紧，也逼出了她的办法。 | She cannot tell if the leak is real; looking up, she sees the stain growing: it is, and getting worse. Still not sure who is at the door, she thinks to call the building office. The stain tightens the conflict and draws out her solution.
- 说明赵奶奶家的房子太旧 ~misread
- 交代时间是深夜 ~role
?2 青年最后说“奶奶，您做得对”，表现了他怎样的态度？ | What does his last line show?
≈ 理解老人的谨慎，没有埋怨 | 奶奶，您做得对 | 别怪奶奶，一个人住，得小心
- 他在讽刺赵奶奶 ~nomood
- 他嫌赵奶奶开门太慢 ~opposite
?2 赵奶奶在电话里说出自己的名字和楼层，这句台词有什么作用？ | What does giving her name and floor do?
≈ 表现她遇事冷静、做事有条理 | 我是三楼的赵兰英 | 你们来个人看看
- 说明她和物业很熟 ~overread
- 说明她记性不好 ~sense
?2 开头舞台说明交代“深夜”“独居的老人”，有什么作用？ | Why give the late hour and that she lives alone?
≈ 交代背景，使赵奶奶不开门的谨慎合情合理 | 深夜，一套公寓里 | 独居的老人赵奶奶 | 一个人住，得小心
- 说明赵奶奶睡不着觉 ~unsaid
- 和剧情没有关系 ~role

# 毕业照
（初三毕业前一天，教室里。同学们在排队拍毕业照，阿峰坐在最后一排，不肯过去。）
班长：阿峰，快来，就差你了。
阿峰：我不拍。
班长：为什么？
阿峰：（低着头）我又没考上高中，拍什么照。
（同学们都安静了。班主任刘老师走过来，在阿峰旁边坐下。）
刘老师：阿峰，你还记得初一那年，班里的鱼缸破了，是谁半夜跑回来，把鱼一条一条捞到水盆里的？
阿峰：（小声）……我。
刘老师：照片上不写分数，写的是我们这个班。少了你，这个班就不完整。
（阿峰抬起头，看见同学们都在看着他。班长朝他招手。）
阿峰：（站起来，擦了擦眼睛）那……我站哪儿？
刘老师：（笑）你站中间。
?1 这场戏的冲突是什么？ | What is the conflict?
≈ 阿峰没考上高中，觉得自卑，不肯拍毕业照；同学和老师希望他一起拍 | 我又没考上高中，拍什么照 | 阿峰，快来，就差你了
- 阿峰和班长吵架了 ~misread
- 阿峰不喜欢拍照 ~surface
?1 刘老师是怎样打动阿峰的？ | How does the teacher move him?
≈ 提起他初一时救鱼的往事，告诉他照片不写分数，班里不能少了他 | 是谁半夜跑回来，把鱼一条一条捞到水盆里的 | 照片上不写分数，写的是我们这个班
- 答应帮他考上高中 ~unsaid
- 批评他不懂事 ~opposite
?1 阿峰问“那……我站哪儿？”，说明冲突有了怎样的结果？ | What does his question say of the outcome?
≈ 他放下了自卑，愿意和同学们一起拍照 | 那……我站哪儿 | 阿峰抬起头，看见同学们都在看着他
- 他还是不愿意拍照 ~opposite
- 他不知道拍照的地方在哪里 ~surface
?2 刘老师说“你站中间”，这句台词有什么含义？ | What does “stand in the middle” mean?
≈ 让阿峰站在中间，表示他是班里重要的一员，给了他尊重和温暖 | 你站中间 | 少了你，这个班就不完整
% 阿峰觉得自己没考上高中，抬不起头，本想躲在后面。刘老师却让他站在最显眼的中间。这句话很短，意思是：你不是可有可无的人，你是这个班的一部分，而且是重要的一部分。 | Feeling ashamed, Afeng wanted to hide at the back; the teacher puts him in the middle, the most visible place. The short line says: you are not to be left out, you belong to this class, and you matter.
- 中间的位置正好空着 ~surface
- 阿峰个子最矮 ~unsaid
?2 舞台说明“同学们都安静了”有什么作用？ | What does the silence do?
≈ 写出阿峰的话让大家心里难过，气氛一下子沉重起来 | 同学们都安静了 | 我又没考上高中，拍什么照
- 说明要开始拍照了 ~misread
- 说明同学们不想理阿峰 ~misread
?2 阿峰小声回答“……我”，表现了他怎样的心理？ | What does his whispered “me” show?
≈ 没想到老师还记得这件事，有些意外和感动，也有些不好意思 | （小声）……我 | 你还记得初一那年
- 他不记得这件事了 ~opposite
- 他觉得救鱼是一件丢人的事 ~misread
`;

/** FORMS_9 are the pieces of reading-9-forms: the modes of expression and literary forms they use, and what in them is real or made up. */
export const FORMS_9 = `
# 秋天的田野
十月，我回到了老家。田野里，稻子熟了，金黄金黄的，风一吹，稻浪一层层地涌向远方。
爷爷弯着腰，在田里割稻子。镰刀一挥，一把稻子就倒下了。我也学着割，没割几把，手就磨红了。
稻子是从春天就开始种的。先育秧，再插秧，然后除草、施肥，要忙上大半年，才能收获。
看着这一片金黄，我忽然明白，那句“谁知盘中餐，粒粒皆辛苦”，说的就是这样的日子。
我爱这片田野，爱它的金黄，也爱在田野里弯着腰的爷爷。
?1 第一段主要用了什么表达方式？ | What mode is paragraph one mainly?
≈ 描写，具体写出稻田金黄、稻浪翻涌的景色 | 稻子熟了，金黄金黄的 | 稻浪一层层地涌向远方
- 议论，说出作者的看法 ~notargue
- 说明，介绍种稻的过程 ~elsewhere
?1 第三段用的是什么表达方式？ | What mode is paragraph three?
≈ 说明，介绍稻子从种到收的过程 | 先育秧，再插秧，然后除草、施肥 | 要忙上大半年，才能收获
- 抒情，表达对田野的爱 ~notlyric
- 描写，写出稻子的颜色 ~notdescribe
?1 最后一段用了什么表达方式？ | What mode is the last paragraph?
= 抒情 | 我爱这片田野，爱它的金黄，也爱在田野里弯着腰的爷爷
- 记叙 ~notnarrate
- 说明 ~elsewhere
?2 这篇文章是散文，它写的内容是写实的还是虚构的？ | Is this prose piece real or made up?
≈ 写实的，写的是作者回老家亲眼看到、亲身经历的事 | 十月，我回到了老家 | 我也学着割，没割几把，手就磨红了
- 虚构的，像童话一样 ~real
- 虚构的，爷爷是想象出来的人物 ~real
?2 文中引用“谁知盘中餐，粒粒皆辛苦”，在写实的散文中起什么作用？ | What does the quoted line do in this true account?
≈ 由眼前的真实情景联想到古诗，加深对农民辛苦的理解 | 谁知盘中餐，粒粒皆辛苦 | 我忽然明白
% 作者先写了自己看到爷爷割稻、自己割了几把手就磨红，这是真实的经历；然后才“忽然明白”古诗的意思。引诗不是在编故事，而是从真事里得出的体会，让散文的感情更深一层。 | He first tells of watching his grandfather and blistering his own hands, a true experience; then he suddenly understands the old poem. The quotation invents nothing: it is what he draws from what happened, and it deepens the feeling.
- 说明这首诗是作者写的 ~who
- 说明古代也有稻田 ~misread
?2 这篇散文和小说相比，最主要的不同是什么？ | How does this prose differ most from fiction?
≈ 散文多写真人真事和作者的真实感受，小说的人物和情节可以虚构 | 十月，我回到了老家 | 我爱这片田野
- 散文一定比小说短 ~misread
- 散文里不能写人物 ~opposite

# 会说话的书包
小明的书包会说话。
早上，小明把书包往背上一甩，书包就叫起来：“哎哟，轻点儿！我肚子里装着你的课本呢。”
放学了，小明把书包往地上一扔，书包又叫：“我也要休息，可你不能把我扔在泥里呀！”
小明不好意思了。从那以后，他每天都把书包轻轻地放好，还把里面的书摆得整整齐齐。
书包再也没叫过。不过，小明总觉得，它在笑。
?1 这篇短文主要用了什么表达方式？ | What mode does the piece mainly use?
≈ 记叙，讲了小明和书包之间发生的事 | 早上，小明把书包往背上一甩 | 从那以后，他每天都把书包轻轻地放好
- 议论，讲了要爱护书包的道理 ~notargue
- 说明，介绍书包的用法 ~notargue
?1 这篇短文属于什么文学样式？ | What literary form is it?
≈ 童话，书包会说话，是想象出来的故事 | 小明的书包会说话 | 书包就叫起来
- 新闻，报道了一件真事 ~imagined
- 说明文，介绍书包 ~imagined
?1 短文中书包的话，用了什么修辞？ | What figure are the satchel's words?
= 拟人 | 书包就叫起来：“哎哟，轻点儿！我肚子里装着你的课本呢。”
- 比喻 ~nolikening
- 排比 ~sense
?2 文中哪一件事是虚构的？ | What in the piece is made up?
= 书包会说话 | 小明的书包会说话
- 小明把书包扔在地上 ~real
- 小明把书摆得整整齐齐 ~real
?2 作者为什么要虚构“书包会说话”？ | Why make the satchel talk?
≈ 借书包的话，生动有趣地告诉读者要爱护自己的东西 | 我也要休息，可你不能把我扔在泥里呀 | 从那以后，他每天都把书包轻轻地放好
% 一个人随手扔书包，生活里很常见，直接说“要爱护书包”，读者未必听得进去。让书包自己叫疼、自己抱怨，读者就像听见了它的感受，道理就变得有趣、好懂。虚构是为了把道理讲得更动人。 | Tossing a satchel is common, and “take care of your things” might go unheard. Let the satchel cry out and complain, and the reader seems to hear it feel; the lesson becomes lively and clear. The invention serves the lesson.
- 因为书包真的会说话 ~real
- 为了介绍书包的结构 ~misread
?2 结尾“它在笑”是写实还是想象？有什么作用？ | Is “it was smiling” real or imagined, and why?
≈ 是小明的想象，写出小明改正了坏习惯后心里的愉快 | 不过，小明总觉得，它在笑 | 书包再也没叫过
- 是写实，书包真的笑了 ~real
- 是写实，有人在旁边笑 ~unsaid

# 校园里的银杏
我们学校的大门口，有两棵银杏树，据说是建校那年栽的，到今年已经六十年了。
银杏是一种很古老的树，在地球上已经生活了两亿多年，所以有人叫它“活化石”。
深秋的时候，银杏叶全黄了，像一把把小扇子，风一吹，满地金黄。同学们最爱在这时捡叶子，夹在书里当书签。
有人说，银杏太慢了，栽下去要二十多年才结果。我却觉得，慢一点没什么不好。一所学校，也像一棵银杏，要一年一年地长，才能长得高大。
?1 第二段用了什么表达方式？ | What mode is paragraph two?
≈ 说明，介绍银杏是很古老的树 | 在地球上已经生活了两亿多年 | 有人叫它“活化石”
- 描写，写出银杏叶的样子 ~elsewhere
- 抒情，表达对银杏的喜爱 ~notlyric
?1 第三段用了什么表达方式？ | What mode is paragraph three?
≈ 描写，写出深秋银杏叶的颜色和形状 | 银杏叶全黄了，像一把把小扇子 | 风一吹，满地金黄
- 议论 ~notargue
- 说明 ~notargue
?1 最后一段“我却觉得，慢一点没什么不好”用了什么表达方式？ | What mode is this sentence?
= 议论 | 我却觉得，慢一点没什么不好
- 描写 ~notdescribe
- 说明 ~notargue
?2 文中“到今年已经六十年了”“已经生活了两亿多年”是写实还是虚构？ | Are the figures real or made up?
≈ 写实，是关于银杏的真实情况，说明要准确 | 到今年已经六十年了 | 在地球上已经生活了两亿多年
- 虚构，是作者编出来的数字 ~real
- 虚构，是童话里的说法 ~real
?2 这篇文章综合用了多种表达方式，有什么好处？ | What is gained by mixing modes?
≈ 既让读者了解银杏，又写出了它的美，还表达了作者的看法，内容更丰富 | 银杏是一种很古老的树 | 像一把把小扇子 | 我却觉得，慢一点没什么不好
% 第二段介绍银杏古老，是说明；第三段写黄叶像扇子，是描写；最后由银杏的慢说到学校的成长，是议论。说明让人长知识，描写让人看见美，议论让人想得深，几种方式合在一起，文章就不单调。 | Paragraph two explains its age; three paints the fans of gold; the last moves from the tree's slowness to a school's growth, arguing. Knowledge, beauty, thought: mixed, the piece is not flat.
- 说明作者不会只用一种表达方式 ~misread
- 让文章变得很长 ~misread
?2 最后一段把学校比作银杏，这是事实还是作者的联想？ | Is the school-as-ginkgo a fact or the author's thought?
≈ 作者由眼前的银杏产生的联想，表达自己的看法 | 一所学校，也像一棵银杏 | 我却觉得
- 是事实，学校真的会长高 ~literal
- 是别人说的话 ~who

# 爷爷的烟袋
爷爷有一杆烟袋，铜烟锅，竹烟杆，杆上挂着一个旧布袋。
爷爷抽烟的样子很特别。他先把烟丝塞进烟锅，用大拇指按紧，划一根火柴，点上，深深地吸一口，然后眯着眼，慢慢地吐出一团白烟。
后来，爷爷病了，医生说不能再抽烟。他把烟袋挂在墙上，再也没碰过。可是每天晚饭后，他都要把烟袋取下来，擦一擦，再挂回去。
爷爷去世那年，我把烟袋收进了自己的抽屉。现在，每次拉开抽屉，我好像还能闻到那股淡淡的烟味。
?1 第二段写爷爷抽烟，主要用了什么描写方法？ | What kind of description is paragraph two?
≈ 动作描写，用“塞”“按”“划”“吸”“吐”等动词写出爷爷抽烟的样子 | 他先把烟丝塞进烟锅，用大拇指按紧 | 深深地吸一口
- 语言描写 ~nospeech
- 外貌描写 ~nolooks
?1 第一段用了什么表达方式？ | What mode is paragraph one?
≈ 描写，写出烟袋的样子 | 铜烟锅，竹烟杆，杆上挂着一个旧布袋 | 爷爷有一杆烟袋
- 议论 ~notargue
- 抒情 ~notlyric
?1 第三段主要用了什么表达方式？ | What mode is paragraph three mainly?
≈ 记叙，交代爷爷病后不再抽烟却每天擦烟袋的事 | 后来，爷爷病了 | 他都要把烟袋取下来，擦一擦，再挂回去
- 议论 ~notargue
- 说明 ~notargue
?2 结尾“我好像还能闻到那股淡淡的烟味”是写实还是想象？ | Is the smell at the end real or imagined?
≈ 是“我”的感觉和想象，“好像”说明不是真的闻到，表达对爷爷的怀念 | 我好像还能闻到那股淡淡的烟味 | 爷爷去世那年
% 爷爷去世已经有些年了，烟袋也早就没人用，按理说不会还有烟味。“好像”两个字说明这是“我”的感觉：一拉开抽屉，就想起爷爷抽烟的样子。这是由真实的物件引起的想象，写出了“我”的怀念。 | Grandfather has been dead for years and the pipe long unused, so no smell should remain. 好像, “as if”, marks it as feeling: opening the drawer, he recalls the old man smoking. A real object stirs an imagined smell, and shows his longing.
- 是写实，抽屉里真的有烟味 ~real
- 是写实，“我”也开始抽烟了 ~unsaid
?2 这篇文章是叙事散文，它的内容来自哪里？ | Where does this narrative prose come from?
≈ 来自作者真实的生活和对爷爷的回忆 | 爷爷有一杆烟袋 | 爷爷去世那年，我把烟袋收进了自己的抽屉
- 来自作者编的童话 ~real
- 来自历史书 ~unsaid
?2 爷爷每天擦烟袋这个细节说明了什么？ | What does his daily polishing tell?
≈ 爷爷虽然戒了烟，心里还是舍不得这杆陪了他多年的烟袋 | 他把烟袋挂在墙上，再也没碰过 | 每天晚饭后，他都要把烟袋取下来，擦一擦
- 爷爷还在偷偷抽烟 ~opposite
- 烟袋很脏，需要每天擦 ~surface

# 月亮上的兔子
很久以前，月亮上住着一只白兔。它每天在桂花树下捣药，捣出来的药，能治好人间的病。
有一年，人间闹瘟疫，很多人病倒了。白兔着急了，日夜不停地捣药，捣得两只前爪都磨破了。
药捣好了，可是月亮离人间太远，怎么送下去呢？白兔想了一个办法：它把药撒在月光里。那天夜里，月光特别亮，照到哪里，哪里的病人就好了起来。
从那以后，人们每到中秋，都要抬头看看月亮，说是在看那只捣药的兔子。
?1 这篇短文属于什么文学样式？ | What form is this piece?
≈ 神话传说，讲的是月亮上的白兔捣药救人的故事 | 很久以前，月亮上住着一只白兔 | 捣出来的药，能治好人间的病
- 科学小品，介绍月亮的知识 ~imagined
- 新闻报道，报道一次瘟疫 ~imagined
?1 全文主要用了什么表达方式？ | What mode does it mainly use?
≈ 记叙，按时间顺序讲了白兔捣药、送药的经过 | 有一年，人间闹瘟疫 | 药捣好了 | 从那以后
- 说明 ~notargue
- 议论 ~notargue
?1 “捣得两只前爪都磨破了”用了什么描写方法？有什么作用？ | What description is this, and to what end?
≈ 细节描写，写出白兔日夜捣药的辛苦，表现它的善良 | 捣得两只前爪都磨破了 | 日夜不停地捣药
- 外貌描写，写出白兔长得很可爱 ~nolooks
- 环境描写，写出月亮上的景色 ~nosetting
?2 文中哪件事是现实中真的有的？ | What in it is real?
= 人们每到中秋，都要抬头看看月亮 | 从那以后，人们每到中秋，都要抬头看看月亮
- 月亮上住着一只白兔 ~imagined
- 白兔把药撒在月光里 ~imagined
?2 这个传说为什么要虚构白兔救人的故事？ | Why invent the tale of the rescuing hare?
≈ 寄托人们战胜疾病的愿望，也解释了中秋看月亮的习俗 | 照到哪里，哪里的病人就好了起来 | 人们每到中秋，都要抬头看看月亮
% 瘟疫让很多人病倒，人们盼着有药能治好所有人，这个愿望在现实里很难实现，就放进了故事里。故事最后落到中秋看月亮的习俗上，又给这个真实的习俗一个美丽的来历。虚构的故事寄托着真实的愿望。 | Plague struck many, and people longed for a cure for all, a wish hard to meet in life, so it went into a tale. The tale ends with the real custom of moon-gazing at mid-autumn and gives it a lovely origin. The invented story holds a real wish.
- 因为月亮上真的有兔子 ~real
- 为了介绍治病的药方 ~misread
?2 读神话传说，应该怎样看待其中虚构的内容？ | How should one read what such a tale invents?
≈ 知道它不是真事，体会其中寄托的愿望和感情 | 很久以前，月亮上住着一只白兔 | 人们每到中秋，都要抬头看看月亮
- 把它当成真实的历史来读 ~real
- 认为它是假的，没有价值 ~misread

# 一张照片
我的书桌上放着一张照片：一个穿军装的年轻人，站在雪地里，眉毛上结着霜，却笑得很灿烂。
这是我舅舅。他在西藏当兵，守边防，那地方海拔四千多米，冬天零下三十多度。
有一年春节，他打电话回家，说他们在雪地里包饺子，饺子冻得像石头，可大家吃得很香。外婆在电话这头哭了，舅舅在那头还笑着说：“妈，别哭，我们这儿可热闹了。”
我常常看着这张照片想：他为什么能笑得那么灿烂？也许，守着祖国的边疆，就是一件让人骄傲的事吧。
?1 第一段写照片上的舅舅，用了什么描写方法？ | What description is paragraph one?
≈ 外貌和神态描写，写出舅舅眉毛结霜却笑得灿烂的样子 | 一个穿军装的年轻人 | 眉毛上结着霜，却笑得很灿烂
- 心理描写 ~nothought
- 语言描写 ~nospeech
?1 第二段“海拔四千多米，冬天零下三十多度”用了什么表达方式？有什么作用？ | What mode is this, and to what end?
≈ 说明，用数字写出边防环境的艰苦 | 那地方海拔四千多米，冬天零下三十多度 | 他在西藏当兵，守边防
- 抒情，表达对舅舅的想念 ~notlyric
- 描写，写出照片的颜色 ~notdescribe
?1 最后一段用了什么表达方式？ | What mode is the last paragraph?
≈ 议论和抒情，由照片想到守边的意义，表达对舅舅的敬佩 | 也许，守着祖国的边疆，就是一件让人骄傲的事吧 | 我常常看着这张照片想
- 说明 ~notargue
- 记叙 ~notnarrate
?2 舅舅说“我们这儿可热闹了”，这是不是真实的情况？ | Is “it's lively here” the truth?
≈ 不完全是，他是为了让外婆放心才这样说的，实际上环境很艰苦 | 妈，别哭，我们这儿可热闹了 | 饺子冻得像石头 | 外婆在电话这头哭了
% 前面说那里零下三十多度，饺子冻得像石头，生活很苦。舅舅听见外婆哭了，才说“这儿可热闹了”。大家一起包饺子也许是真的热闹，可他特意这样说，主要是不让母亲担心。 | It is thirty below, the dumplings freeze like stones: a hard life. Hearing his mother cry, he says it is lively. Making dumplings together may be lively, but he says it chiefly so she will not worry.
- 是真实的，那里人很多，很热闹 ~surface
- 舅舅在骗外婆，自己过得很好 ~opposite
?2 这篇文章写的是真人真事吗？从哪里可以看出来？ | Is it true, and how can one tell?
≈ 是，写的是作者的舅舅，有具体的地点、数字和亲人的通话 | 这是我舅舅 | 他在西藏当兵 | 海拔四千多米
- 不是，是作者想象出来的童话 ~real
- 不是，照片是作者画的 ~unsaid
?2 结尾的“也许”说明了什么？ | What does 也许 at the end show?
≈ 这是作者自己的推想和体会，不是舅舅亲口说的 | 也许，守着祖国的边疆，就是一件让人骄傲的事吧 | 他为什么能笑得那么灿烂
- 作者不知道舅舅在哪里当兵 ~sense
- 作者不相信舅舅守边防 ~misread

# 星期五的梦
星期五晚上，我做了一个梦。
梦里，我变成了一本数学书，被放在书包里。书包里黑乎乎的，挤得要命。语文书在旁边抱怨：“你那些公式，硌得我腰疼。”英语书说：“别吵了，明天考试，主人还没复习呢！”
我一听，急了：明天考数学！我拼命翻开自己，想让主人看看我。可是主人在打游戏，根本不理我们。
我急得大叫一声，醒了。窗外天已经亮了。我一骨碌爬起来，翻开数学书。幸好，今天是星期六，考试在下周一。
?1 这篇短文主要用了什么表达方式？ | What mode does it mainly use?
≈ 记叙，讲了“我”做梦和醒来的经过 | 星期五晚上，我做了一个梦 | 我急得大叫一声，醒了
- 议论 ~notargue
- 说明 ~notargue
?1 梦里书本说话，用了什么写法？ | How are the talking books written?
≈ 拟人，让书本像人一样说话，生动有趣 | 语文书在旁边抱怨 | 英语书说
- 比喻 ~nolikening
- 对比 ~nocompare
?1 结尾“幸好，今天是星期六”有什么作用？ | What does the ending do?
≈ 从紧张的梦中回到现实，结尾轻松幽默，也暗示“我”要抓紧复习 | 幸好，今天是星期六，考试在下周一 | 我一骨碌爬起来，翻开数学书
- 说明“我”星期六不用上学，可以玩 ~misread
- 交代考试的科目 ~role
?2 文中哪部分是虚构的？ | What part is made up?
≈ 梦里“我”变成数学书、书本说话的情节 | 梦里，我变成了一本数学书 | 语文书在旁边抱怨
- “我”醒来翻开数学书 ~real
- 窗外天亮了 ~real
?2 作者借梦虚构这些情节，想表达什么？ | What does the invented dream serve?
≈ 借梦写出“我”心里对考试的担心，提醒自己不能贪玩 | 主人在打游戏，根本不理我们 | 我一骨碌爬起来，翻开数学书
% 梦里的“主人”在打游戏不复习，其实就是“我”自己；书本着急，其实是“我”心里着急。醒来后“我”马上翻开数学书，说明梦把心里的担心说了出来。虚构的梦，写的是真实的心情。 | The owner gaming instead of revising is the narrator himself; the books' worry is his own. Waking, he opens the maths book at once: the dream spoke his worry. An invented dream tells a real feeling.
- 说明书本真的会说话 ~real
- 说明数学书比语文书好 ~misread
?2 这篇短文的虚构和童话里的虚构有什么不同？ | How does this invention differ from a fairy tale's?
≈ 它借“做梦”来虚构，梦醒后回到真实的生活，虚构是为了写真实的心理 | 我做了一个梦 | 我急得大叫一声，醒了。窗外天已经亮了
- 没有不同，都是真事 ~real
- 它比童话更长 ~misread

# 戏台
镇上有个老戏台，青砖垒的台基，木头搭的台顶，台口两边挂着一副对联。
小时候，每到正月，戏班子就来唱戏。台下挤满了人，大人坐长凳，小孩爬到墙头上。锣鼓一响，满场的人都不说话了。
后来，人们有了电视，有了手机，来看戏的人越来越少，戏班子也不来了。戏台空了，台顶长出了草。
去年，镇上把戏台修好了，每个周末都有人上台唱几段。台下坐的，大多是头发白了的老人。他们跟着锣鼓，轻轻地打着拍子。
我想，一个戏台，留住的不只是戏，还有一个镇子的记忆。
?1 第一段用了什么表达方式？ | What mode is paragraph one?
≈ 描写，写出老戏台的样子 | 青砖垒的台基，木头搭的台顶 | 台口两边挂着一副对联
- 议论 ~notargue
- 抒情 ~notlyric
?1 第二段到第四段是按什么顺序记叙的？ | In what order do paragraphs two to four tell?
≈ 时间顺序，从小时候到后来再到去年，写戏台的变化 | 小时候，每到正月 | 后来，人们有了电视 | 去年，镇上把戏台修好了
- 空间顺序，从台下写到台上 ~wrongorder
- 倒叙，先写结果再写原因 ~notflashback
?1 最后一段用了什么表达方式？有什么作用？ | What mode is the last paragraph, and to what end?
≈ 议论，点明戏台留住的是一个镇子的记忆，深化主旨 | 一个戏台，留住的不只是戏，还有一个镇子的记忆 | 我想
- 描写，写出戏台的样子 ~notdescribe
- 说明，介绍戏台的历史 ~notargue
?2 这篇散文写的是真实的事吗？ | Is the piece true?
≈ 是，写的是作者家乡戏台的真实变化和作者的真实感受 | 镇上有个老戏台 | 小时候 | 我想
- 不是，是作者想象出来的童话 ~real
- 不是，是一出戏的剧本 ~unsaid
?2 “他们跟着锣鼓，轻轻地打着拍子”这个细节写出了什么？ | What does the tapping show?
≈ 老人们对戏的喜爱和对过去的怀念 | 台下坐的，大多是头发白了的老人 | 他们跟着锣鼓，轻轻地打着拍子
% 来看戏的大多是头发白了的老人，他们小时候正是挤在台下看戏的人。锣鼓一响，他们不由自主地打起拍子，说明这些戏他们熟悉，也喜欢；跟着节拍，他们好像又回到了从前。 | Most in the audience are white-haired, those who once crowded below the stage as children. When the drums sound they tap along unbidden: they know and love these plays, and with the beat seem to go back in time.
- 老人们在跳舞 ~literal
- 老人们觉得戏太吵 ~opposite
?2 文章写“台顶长出了草”，有什么作用？ | What does the grass on the roof do?
≈ 用真实的细节写出戏台被冷落后的荒凉 | 戏台空了，台顶长出了草 | 来看戏的人越来越少
- 说明戏台的屋顶是用草盖的 ~literal
- 说明镇上的人喜欢种草 ~unsaid

# 小草的旅行
一阵风吹过，一粒小草的种子离开了妈妈。
它飞呀飞，飞过了小河，飞过了山坡，落在了一条石头缝里。石缝里很黑，只有一点点土。
种子想：“这里这么挤，我能长大吗？”它没有灰心，把根一点一点地往下扎，把芽一点一点地往上顶。
春天来了，一棵小草从石缝里钻了出来，绿绿的，在风里点着头。
路过的人看见了，都停下脚步：“这么硬的石头，它都钻出来了！”
?1 这篇短文属于什么文学样式？ | What form is it?
≈ 童话，种子会想、会说话，是想象出来的故事 | 种子想 | 一粒小草的种子离开了妈妈
- 说明文，介绍草的生长 ~imagined
- 新闻，报道一棵草 ~imagined
?1 “把根一点一点地往下扎，把芽一点一点地往上顶”用了什么修辞？ | What figure is this sentence?
= 对偶 | 把根一点一点地往下扎，把芽一点一点地往上顶
- 比喻 ~nolikening
- 夸张 ~sense
?1 第二段主要用了什么表达方式？ | What mode is paragraph two mainly?
≈ 记叙和描写，交代种子飞行的经过，写出石缝里的环境 | 它飞呀飞，飞过了小河，飞过了山坡 | 石缝里很黑，只有一点点土
- 议论 ~notargue
- 抒情 ~notlyric
?2 文中哪些内容符合真实的自然现象？ | What in it fits real nature?
≈ 草的种子随风飘落，能在石缝里扎根、发芽 | 一阵风吹过，一粒小草的种子离开了妈妈 | 落在了一条石头缝里 | 一棵小草从石缝里钻了出来
- 种子会想事情 ~imagined
- 种子会说话 ~imagined
?2 作者把种子写得会想事情，有什么用意？ | Why give the seed thoughts?
≈ 借种子的想法，写出它面对困难不灰心的精神，让读者受到鼓舞 | 种子想：“这里这么挤，我能长大吗？” | 它没有灰心
% 种子当然不会想事情，作者让它在石缝里问“我能长大吗”，又写它“没有灰心”，就把种子写成了一个遇到困难的人。读者看到它最后钻出了石缝，就像看到一个人战胜了困难。虚构让道理变得生动。 | A seed cannot think; given a question, can I grow?, and no despair, it becomes a person meeting hardship. Seeing it break from the rock, the reader sees a person overcome. The invention makes the lesson live.
- 因为种子真的会想 ~real
- 为了说明石头很硬 ~misread
?2 这篇童话和《会说话的书包》有什么相同的地方？ | What does it share with the talking satchel?
≈ 都把物写得像人一样，用虚构的故事讲道理 | 种子想 | 它没有灰心
- 都是写真人真事 ~real
- 都是新闻报道 ~real

# 外婆的菜园
外婆家的后院有一个菜园，不大，却种了十几样菜。
春天，外婆种下黄瓜和豆角，在旁边插上竹竿，让藤蔓顺着往上爬。夏天，黄瓜一根根垂下来，顶着小黄花，上面还带着刺。外婆摘下一根，在衣服上擦擦，递给我：“尝尝，比城里买的甜。”
菜园旁边有一口井。外婆说，井水浇的菜长得好。每天傍晚，她都要提着水桶，一棵一棵地浇。
外婆今年八十岁了，腰弯得更厉害了，可还是每天去菜园。妈妈劝她少种点，她说：“种惯了，一天不去，心里就空落落的。”
我知道，那个菜园里种的，不只是菜。
?1 第二段写黄瓜“顶着小黄花，上面还带着刺”，用了什么表达方式？ | What mode is this?
≈ 描写，具体写出黄瓜新鲜的样子 | 黄瓜一根根垂下来，顶着小黄花，上面还带着刺 | 外婆摘下一根，在衣服上擦擦
- 议论 ~notargue
- 说明 ~notargue
?1 外婆说“种惯了，一天不去，心里就空落落的”，用了什么描写方法？ | What kind of description is this?
= 语言描写 | 种惯了，一天不去，心里就空落落的
- 动作描写 ~noaction
- 外貌描写 ~nolooks
?1 最后一句“那个菜园里种的，不只是菜”属于什么表达方式？ | What mode is the last sentence?
≈ 抒情，含蓄地表达菜园里有外婆对生活的热爱和对家人的爱 | 我知道，那个菜园里种的，不只是菜 | 种惯了，一天不去，心里就空落落的
- 说明 ~notargue
- 描写 ~notdescribe
?2 这篇散文写的是真实的生活吗？从哪里能看出来？ | Is it true to life, and how can one tell?
≈ 是，写的是外婆的菜园和外婆真实的话语、动作 | 外婆家的后院有一个菜园 | 外婆今年八十岁了
- 不是，菜园是作者梦见的 ~unsaid
- 不是，外婆是童话里的人物 ~real
?2 外婆说黄瓜“比城里买的甜”，这是事实还是外婆的感受？ | Is “sweeter than the city's” fact or feeling?
≈ 主要是外婆的感受，带着她对自己种的菜的喜爱和自豪 | 尝尝，比城里买的甜 | 在衣服上擦擦，递给我
% 外婆并没有拿两种黄瓜比过，这句话说的是她心里的感觉：自己一棵棵种出来、一桶桶浇大的菜，吃着当然最甜。读这句话，要读出外婆的自豪和对“我”的疼爱，不必去查哪种黄瓜更甜。 | She has not compared two cucumbers; it is how she feels. Vegetables she sowed and watered by the bucket taste sweetest to her. Read it for her pride and her love for the child, not as a claim to check.
- 是经过测量的事实 ~real
- 是城里人说的话 ~who
?2 “那个菜园里种的，不只是菜”中，“不只是菜”还有什么？ | What more than vegetables grows there?
≈ 外婆勤劳的习惯、对生活的热爱和对家人的爱 | 种惯了，一天不去，心里就空落落的 | 递给我：“尝尝，比城里买的甜。”
- 还有花和草 ~literal
- 还有外婆养的鸡 ~unsaid
`;
