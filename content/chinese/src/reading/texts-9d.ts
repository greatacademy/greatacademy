// The texts of the grade 9 reading topics of classical prose and classical poems (docs/chinese-curriculum.md §18.9).
// The passages and poems are classical and in the public domain; the notes and questions are written for this subject.
// The format is that of parsePieces in topic-kit.ts: a question's wrong options carry the reason they are wrong.

/** CLASSICAL_9 are the classical passages of reading-9-classical: their key sentences, and how each makes its point. */
export const CLASSICAL_9 = `
# 齐人有好猎者（《吕氏春秋》）
齐人有好猎者，旷日持久而不得兽，入则愧其家室，出则愧其知友州里。惟其所以不得之故，则狗恶也。欲得良狗，则家贫无以。于是还疾耕，疾耕则家富，家富则有以求良狗，狗良则数得兽矣，田猎之获常过人矣。非独猎也，百事也尽然。
注：旷日持久，花了很长时间。知友，朋友。州里，乡里。惟，思考。恶，不好。疾，努力。数，多次。
?1 “惟其所以不得之故，则狗恶也”的意思是什么？ | What does this sentence mean?
≈ 他想了想打不到野兽的原因，是狗不好 | 惟其所以不得之故，则狗恶也 | 欲得良狗
% “惟”是思考；“所以不得之故”是打不到野兽的原因；“恶”和后文的“良”相对，是不好。他想明白了问题出在狗身上，接下来才想“得良狗”。 | 惟 is “think over”; 所以不得之故, “the reason he caught nothing”; 恶, set against 良 later, is “poor”. He sees the fault is in the dog, so next he wants a good one.
- 他只是想打猎，所以狗很凶恶 ~modern
- 他不愿说出打不到野兽的原因 ~sense
?1 “欲得良狗，则家贫无以”中的“无以”是什么意思？ | What does 无以 mean here?
≈ 没有用来（买狗）的钱 | 欲得良狗，则家贫无以 | 家富则有以求良狗
% “无以”和后文的“有以”正好相对：家富了，就“有以求良狗”，有拿来求好狗的财力；家贫的时候，就是没有拿来买狗的东西。 | 无以 answers 有以 later: once rich, he 有以求良狗, has the means to seek a good dog; while poor he has nothing to buy one with.
- 没有办法打猎 ~sense
- 不想要好狗 ~opposite
?1 “于是还疾耕”的意思是什么？ | What does 于是还疾耕 mean?
≈ 于是回去努力耕田 | 于是还疾耕 | 疾耕则家富
% “还”是回去，“疾”是努力、用力，不是今天的“疾病”。他明白家贫买不起狗，就回家下力气种地，后文“疾耕则家富”接着说种地的结果。 | 还 is “go back”, 疾 “hard”, not today's illness. Seeing he is too poor for a dog, he goes home to farm hard, and 疾耕则家富 gives the result.
- 于是带着病去耕田 ~modern
- 于是还是去打猎 ~sense
?2 本文是怎样一步一步说明道理的？ | How does the passage reason step by step?
≈ 用“则”把耕田、家富、得良狗、多得兽一环扣一环地连起来，说明要从根本上解决问题 | 疾耕则家富，家富则有以求良狗，狗良则数得兽矣 | 非独猎也，百事也尽然
% 文章先找到打不到兽的原因是狗不好，又找到买不起好狗的原因是家贫，于是从耕田做起。“疾耕则家富，家富则……，狗良则……”一句接一句，前一句的结果是后一句的条件，像链条一样，把根本原因和最后的结果连在一起。 | It traces the poor dog to poverty and starts from the field. 疾耕则家富，家富则……，狗良则……: each result is the next condition, a chain that joins the root cause to the final result.
- 把好猎人和坏猎人作对比 ~unsaid
- 引用古人的话来证明 ~nocite
?2 “非独猎也，百事也尽然”在文中有什么作用？ | What does the last sentence do?
≈ 由打猎推到所有的事，点明全文的道理 | 非独猎也，百事也尽然 | 田猎之获常过人矣
- 说明齐人只会打猎 ~opposite
- 补充打猎的方法 ~role
?2 这则故事告诉我们什么道理？ | What does the story teach?
≈ 做事要找到根本，从根本上下功夫，事情才能做好 | 惟其所以不得之故 | 于是还疾耕 | 百事也尽然
- 打猎一定要有一条好狗 ~detail
- 家里穷就不要去打猎 ~misread

# 卫人嫁其子（《韩非子》）
卫人嫁其子而教之曰：“必私积聚。为人妇而出，常也；其成居，幸也。”其子因私积聚，其姑以为多私而出之。其子所以反者，倍其所以嫁。其父不自罪于教子非也，而自知其益富。
注：子，这里指女儿。私积聚，私下积攒财物。出，被休回娘家。成居，长久地在夫家过下去。姑，丈夫的母亲。反，同“返”，回娘家。倍，加倍。
?1 “为人妇而出，常也；其成居，幸也”的意思是什么？ | What does the father's saying mean?
≈ 做了别人的媳妇被休回家，是常有的事；能一直过下去，是侥幸 | 为人妇而出，常也；其成居，幸也 | 必私积聚
% “出”和“成居”相对：一个是被赶回娘家，一个是长久地在夫家过下去。父亲说前者是“常”，后者是“幸”，意思是被休是常事，过得长久反倒是运气。正因为这样想，他才教女儿“必私积聚”，给自己留后路。 | 出 and 成居 are set against each other: sent home, or staying for good. The father calls the first common, the second luck: being sent away is usual, lasting is chance. That is why he tells her to hoard in secret, against the day.
- 做媳妇要经常出门，能住在家里是幸福 ~modern
- 被休回家是不幸的，能过下去是平常的事 ~opposite
?1 “其姑以为多私而出之”中的“出之”是什么意思？ | What does 出之 mean here?
≈ 把她休回娘家 | 其姑以为多私而出之 | 其子所以反者
% 婆婆认为她私下藏的东西太多，接着说的是她“反”，回了娘家。可见“出之”不是让她出门走走，而是把她赶出夫家。这正应了父亲说的“为人妇而出”。 | The mother-in-law thinks she hoards too much, and next she 反, goes back home. So 出之 is not letting her out for a walk but driving her from the house, just as her father had said might happen.
- 让她出门买东西 ~modern
- 把她的东西拿出来 ~sense
?1 “其子所以反者，倍其所以嫁”的意思是什么？ | What does this sentence mean?
≈ 女儿带回娘家的财物，比出嫁时带去的多了一倍 | 其子所以反者，倍其所以嫁 | 其父不自罪于教子非也，而自知其益富
% “所以反者”是带着回娘家的东西，“所以嫁者”是出嫁时带去的东西，“倍”是加倍。女儿在夫家私藏了财物，回来时带的比去时多一倍，所以后面说父亲觉得自己“益富”。 | 所以反者 is what she brings back, 所以嫁 what she took when married, 倍 “double”. Having hoarded, she returns with twice what she took, so the father thinks himself richer.
- 女儿回娘家的原因，是嫁得太远 ~sense
- 女儿回家时带的东西比出嫁时少 ~opposite
?2 这则故事讽刺了什么样的人？ | Whom does the tale mock?
≈ 只看眼前的利益、不知道反省自己错误的人 | 其父不自罪于教子非也，而自知其益富 | 必私积聚
- 不会做家务的媳妇 ~unsaid
- 对媳妇太严厉的婆婆 ~narrow
?2 最后一句“其父不自罪于教子非也，而自知其益富”有什么作用？ | What does the last sentence do?
≈ 把父亲该认的错和他得意的事对照着写，讽刺他不知错，点明寓意 | 其父不自罪于教子非也，而自知其益富
% 女儿被休，原因正是父亲教她私藏财物，这是他该认的错；他却只看到女儿带回的东西多了，觉得自己更富了。一个“不自罪”，一个“自知”，前后对照，讽刺的意思就出来了。 | She was sent home because of his advice, which is the fault he should own; he sees only that she brought back more, and thinks himself richer. Not blaming himself, knowing only his gain: the contrast makes the mockery.
- 称赞父亲会持家，越来越富 ~misread
- 交代女儿出嫁的时间 ~role
?2 这则故事是用什么方式说明道理的？ | How does the tale make its point?
≈ 讲一个荒唐的故事，不直接说道理，让读者从父亲的得意中自己看出他的错 | 必私积聚 | 其姑以为多私而出之 | 而自知其益富
- 引用古人的话来说明 ~nocite
- 列举了许多出嫁的女子 ~unsaid

# 管宁割席（《世说新语》）
管宁、华歆共园中锄菜，见地有片金，管挥锄与瓦石不异，华捉而掷去之。又尝同席读书，有乘轩冕过门者，宁读如故，歆废书出看。宁割席分坐，曰：“子非吾友也。”
注：捉，拿起。轩冕，古代大夫的车子和礼帽，这里指做大官的人。废书，放下书。席，坐席。
?1 “管挥锄与瓦石不异”的意思是什么？ | What does this sentence mean?
≈ 管宁照样挥着锄头，把金子看得和瓦片石头没有两样 | 管挥锄与瓦石不异 | 见地有片金
- 管宁挥锄头把瓦片石头都锄掉了 ~sense
- 管宁看到金子，和华歆一样高兴 ~opposite
?1 “歆废书出看”中的“废”是什么意思？ | What does 废 mean here?
≈ 放下 | 歆废书出看 | 宁读如故
% 管宁“读如故”，照样读书；华歆却跑出去看大官的车子，那么他手里的书就被搁下了。“废”在这里是放下、停止，不是今天“废物”的意思。 | Guan reads on; Hua runs out to look at the carriage, so his book is put down. 废 here is “lay aside”, not today's “waste”.
- 废旧 ~modern
- 撕坏 ~sense
?1 “子非吾友也”的意思是什么？ | What does 子非吾友也 mean?
≈ 你不是我的朋友了 | 宁割席分坐，曰：“子非吾友也。”
% “子”是古代对对方的尊称，你；“非”是不是。管宁割开坐席，和华歆分开坐，再说这句话，表示和他断交。 | 子 is a respectful “you”; 非 “is not”. Having cut the mat to sit apart, Guan says this to break off the friendship.
- 孩子不是我的朋友 ~modern
- 你是我最好的朋友 ~opposite
?2 文章写了哪两件事，用的是什么写法？ | What two things are told, and how?
≈ 锄菜见金和同席读书两件事，每件都把管宁和华歆的表现对比着写 | 管挥锄与瓦石不异，华捉而掷去之 | 宁读如故，歆废书出看
- 只写了管宁读书一件事 ~part
- 用比喻写出两人的样子 ~nolikening
?2 “华捉而掷去之”写出了华歆怎样的心理？ | What does 华捉而掷去之 show of Hua's mind?
≈ 他心里看重金子，拿起来又扔掉，是怕别人笑话 | 华捉而掷去之 | 管挥锄与瓦石不异
% 管宁看都不看，照样锄地；华歆先“捉”，说明他动了心，后“掷去之”，又扔掉了。这一拿一扔，写出他心里想要、表面上又要装作不在乎的样子。 | Guan does not look; Hua first picks it up, so he is tempted, then throws it away. Picking and throwing show a man who wants it but must seem not to.
- 他根本不喜欢金子 ~overread
- 他把金子送给了管宁 ~unsaid
?2 管宁为什么要和华歆割席分坐？ | Why does Guan cut the mat?
≈ 华歆贪慕钱财和名利，读书不专心，和管宁志向不同 | 华捉而掷去之 | 歆废书出看 | 宁割席分坐
- 两人坐的席子太小了 ~sense
- 华歆抢了管宁的书 ~unsaid

# 师旷论学（《说苑》）
晋平公问于师旷曰：“吾年七十，欲学，恐已暮矣。”师旷曰：“何不炳烛乎？”平公曰：“安有为人臣而戏其君乎？”师旷曰：“盲臣安敢戏其君乎？臣闻之，少而好学，如日出之阳；壮而好学，如日中之光；老而好学，如炳烛之明。炳烛之明，孰与昧行乎？”平公曰：“善哉！”
注：师旷，晋国的乐师，眼睛失明，所以自称“盲臣”。暮，晚。炳烛，点上蜡烛。戏，戏弄。昧行，在黑暗中走路。
?1 “吾年七十，欲学，恐已暮矣”的意思是什么？ | What does the duke's first sentence mean?
≈ 我七十岁了，想学习，恐怕已经太晚了 | 吾年七十，欲学，恐已暮矣 | 何不炳烛乎
% “暮”本来是傍晚，这里说的是人的年纪，七十岁就像一天到了傍晚，是晚了。师旷接着说“何不炳烛”，正是顺着“天晚了”的意思来回答。 | 暮 is evening, here said of age: at seventy the day of a life is late. Shi Kuang's answer, why not light a candle, picks up the same image of nightfall.
- 我七十岁了，傍晚才想去学习 ~literal
- 我七十岁了，害怕学习 ~sense
?1 “安有为人臣而戏其君乎”的意思是什么？ | What does the duke's reply mean?
≈ 哪有做臣子的戏弄他的国君的呢 | 安有为人臣而戏其君乎 | 盲臣安敢戏其君乎
% “安”是哪里、怎么，“安有……乎”是反问，意思是哪有这样的事。平公以为师旷在拿他开玩笑：我说年纪大了，你却叫我点蜡烛。 | 安 is “where, how”, and 安有……乎 a rhetorical “how can there be”. The duke thinks he is being mocked: I speak of age, and you tell me to light a candle.
- 哪里有做臣子的人能和国君一起游戏呢 ~sense
- 臣子一定要戏弄国君 ~opposite
?1 “炳烛之明，孰与昧行乎”的意思是什么？ | What does the last question mean?
≈ 点着蜡烛的光亮，和在黑暗中走路比，哪一个好呢 | 炳烛之明，孰与昧行乎 | 老而好学，如炳烛之明
% “孰与”是“和……比，哪一个……”，用来比较；“昧行”是在黑暗中走路。烛光虽然比不上太阳，可总比摸黑走路强，答案不言自明。 | 孰与 is “compared with …, which”; 昧行 is walking in the dark. Candlelight is less than the sun, but better than groping: the answer is plain.
- 点着蜡烛的人是谁，为什么在黑暗中走路 ~sense
- 蜡烛的光比太阳还亮 ~opposite
?2 师旷用什么方法说服晋平公？ | How does Shi Kuang persuade the duke?
≈ 用比喻，把少年、壮年、老年学习比作日出、日中的阳光和烛光 | 少而好学，如日出之阳 | 壮而好学，如日中之光 | 老而好学，如炳烛之明
- 举了许多老人学习的例子 ~unsaid
- 引用国君说过的话 ~nocite
?2 师旷的三个比喻是怎样排列的，有什么作用？ | How are the three likenesses ordered, and to what end?
≈ 按少、壮、老的顺序排比，一步步说到老年，说明老年学习虽不如年轻时，仍然有益 | 少而好学，如日出之阳；壮而好学，如日中之光；老而好学，如炳烛之明 | 孰与昧行乎
% 三句句式相同，从“少”到“壮”到“老”，光也从朝阳、正午的阳光变成烛光，一句比一句弱。可师旷最后一问，把烛光和“昧行”相比：再弱的光也比没有光强。道理说到了平公的心上。 | Three like sentences go from youth to prime to age, and the light from morning sun to noon to candle, each weaker. But the last question sets the candle against darkness: the weakest light beats none. That reaches the duke.
- 说明年轻时不学习也没有关系 ~misread
- 说明太阳比蜡烛更亮 ~detail
?2 这个故事告诉我们什么道理？ | What does the story teach?
≈ 学习不分早晚，什么年纪开始学都有益处 | 老而好学，如炳烛之明 | 孰与昧行乎 | 善哉
- 晚上读书一定要点蜡烛 ~literal
- 年纪大了就不必再学习 ~reversed

# 郢书燕说（《韩非子》）
郢人有遗燕相国书者，夜书，火不明，因谓持烛者曰：“举烛。”而误书“举烛”。举烛，非书意也。燕相受书而说之，曰：“举烛者，尚明也；尚明也者，举贤而任之。”燕相白王，王大说，国以治。治则治矣，非书之意也。今世学者多似此类。
注：郢，楚国的都城。遗，给，送。燕相国，燕国的宰相。书，前一个是信，后一个是写。说，前一个是解释，后一个同“悦”。尚明，崇尚光明。白，禀告。
?1 “因谓持烛者曰”中的“因”是什么意思？ | What does 因 mean here?
≈ 于是，就 | 夜书，火不明，因谓持烛者曰 | 举烛
% 前面说夜里写信，灯火不亮，后面是他对拿蜡烛的人说“举烛”。“因”把两件事连起来：火不明，于是叫人把蜡烛举高。讲成“因为”，原因和结果就颠倒了。 | Writing at night by a dim light, he tells the candle-bearer to hold it up. 因 joins the two: the light was dim, so he spoke. Read as “because”, cause and effect are reversed.
- 因为 ~modern
- 原因 ~sense
?1 “举烛，非书意也”的意思是什么？ | What does 举烛，非书意也 mean?
≈ “举烛”这两个字，不是信里本来要说的意思 | 而误书“举烛”。举烛，非书意也 | 因谓持烛者曰：“举烛。”
- 举起蜡烛不是为了写信 ~sense
- 信里的意思就是叫人举烛 ~opposite
?1 “治则治矣，非书之意也”的意思是什么？ | What does this sentence mean?
≈ 国家治理好倒是治理好了，可这并不是信的本意 | 治则治矣，非书之意也 | 王大说，国以治
% “治则治矣”是先承认一件事，治理是治理好了；“非书之意也”再转过来，说这不是信的原意。先让一步，再说出真正要说的话，语气里带着讽刺。 | 治则治矣 first grants it: governed, yes; 非书之意也 then turns: but not what the letter meant. Granting, then turning, the sentence is wry.
- 国家没有治理好，因为误解了信 ~opposite
- 治理国家一定要按照信里说的去做 ~sense
?2 燕相国是怎样解释“举烛”的？ | How does the minister read 举烛?
= 举烛就是崇尚光明，崇尚光明就是选拔贤人、任用他们 | 举烛者，尚明也；尚明也者，举贤而任之
- 举烛就是夜里要点灯 ~literal
- 举烛就是写信要小心 ~unsaid
?2 文章最后一句“今世学者多似此类”有什么作用？ | What does the last sentence do?
≈ 由故事推到当时的读书人，讽刺他们牵强附会地解释古书 | 今世学者多似此类 | 非书之意也
% 故事里燕相把误写的两个字讲出一大番道理，结果歪打正着。最后一句把话转到“今世学者”身上，说他们读书也像这样，不管原意，只凭自己的意思去解释。这是借故事说理，故事是为最后一句服务的。 | In the tale a slip of the pen is read into a doctrine that happens to work. The last line turns to scholars of the day, who read books the same way, ignoring the sense for their own. The tale serves the last line.
- 称赞燕相国善于治理国家 ~misread
- 说明写信时一定要点灯 ~detail
?2 这则故事讽刺了什么？ | What does the tale mock?
≈ 不顾原意，牵强附会地解释文字的做法 | 举烛，非书意也 | 举贤而任之 | 今世学者多似此类
- 写信写错字的郢人 ~narrow
- 燕王不会治理国家 ~opposite

# 齐桓公好服紫（《韩非子》）
齐桓公好服紫，一国尽服紫。当是时也，五素不得一紫。桓公患之，谓管仲曰：“寡人好服紫，紫贵甚，一国百姓好服紫不已，寡人奈何？”管仲曰：“君欲止之，何不试勿衣紫也？谓左右曰：‘吾甚恶紫之臭。’”于是左右适有衣紫而进者，公必曰：“少却，吾恶紫臭。”于是日，郎中莫衣紫；其明日，国中莫衣紫；三日，境内莫衣紫也。
注：服，穿。素，白色的生绢。患，担心。衣，穿。恶，讨厌。臭，气味。少却，稍稍退后。郎中，宫中的侍从官。
?1 “五素不得一紫”的意思是什么？ | What does 五素不得一紫 mean?
≈ 五匹白绢也换不到一匹紫绢，说明紫绢非常贵 | 五素不得一紫 | 紫贵甚
% 前面说全国都穿紫衣，后面桓公又说“紫贵甚”，紫色的绸子特别贵。夹在中间的这一句，就是在说贵到什么程度：拿五匹白绢去换，也换不来一匹紫绢。 | Before it, the whole state wears purple; after it, the duke says purple is very dear. The sentence between says how dear: five rolls of white will not buy one of purple.
- 五个人里没有一个穿紫衣 ~opposite
- 五种颜色里没有紫色 ~sense
?1 “何不试勿衣紫也”中的“衣”是什么意思？ | What does 衣 mean here?
≈ 穿 | 何不试勿衣紫也 | 左右适有衣紫而进者
% “勿衣紫”里，“衣”后面跟着“紫”，前面有“勿”，是一个动作：不要穿紫衣。后文“有衣紫而进者”也是穿着紫衣进来的人。名词“衣服”放在这里讲不通，这里是名词用作动词。 | In 勿衣紫, 衣 stands between “do not” and “purple”: an action, do not wear purple. Later, 有衣紫而进者 is one who comes in wearing purple. The noun “clothes” makes no sense here; the noun is used as a verb.
- 衣服 ~modern
- 洗 ~sense
?1 “于是日，郎中莫衣紫”中的“莫”是什么意思？ | What does 莫 mean here?
≈ 没有人 | 于是日，郎中莫衣紫 | 三日，境内莫衣紫也
% 桓公一说讨厌紫色的气味，身边的人就不敢再穿。这一句说的是当天的结果：宫中的侍从官里，没有一个人再穿紫衣。“莫”在这里是“没有谁”，讲成“不要”，就成了命令，和后面一天天扩大的结果对不上。 | Once the duke says he hates the smell of purple, those around him stop wearing it. This is the first day's result: of the court officers, none wore purple. 莫 is “no one”; read as “do not”, it would be an order, which does not fit the results spreading day by day.
- 不要 ~sense
- 很多人 ~opposite
?2 管仲是怎样帮桓公解决问题的？ | How does Guan Zhong solve the duke's problem?
≈ 让桓公自己先不穿紫衣，还表示讨厌紫色，用国君的榜样带动全国 | 何不试勿衣紫也 | 吾甚恶紫之臭
- 下令禁止百姓穿紫衣 ~unsaid
- 降低紫绢的价钱 ~unsaid
?2 文章最后写“于是日……其明日……三日……”，有什么作用？ | What do the three days at the end do?
≈ 一天比一天范围大，从宫中到国中再到境内，写出国君的影响传得又快又广 | 于是日，郎中莫衣紫 | 其明日，国中莫衣紫 | 三日，境内莫衣紫也
- 说明桓公每天都换衣服 ~sense
- 说明紫绢一天比一天贵 ~opposite
?2 这则故事说明了什么道理？ | What does the story teach?
≈ 上行下效，在上位的人一举一动都会影响下面的人 | 齐桓公好服紫，一国尽服紫 | 三日，境内莫衣紫也
% 开头，桓公喜欢紫衣，全国都穿紫衣；结尾，桓公说讨厌紫色，三天之内全国都不穿了。一好一恶，结果正好相反，可见老百姓跟着国君走。要改变风气，先要改变自己。 | At the start the duke loves purple and the whole state wears it; at the end he says he hates it, and in three days no one does. Liking, then disliking, and the result reverses: the people follow their ruler. To change a custom, change yourself first.
- 紫色的衣服气味难闻 ~literal
- 穿衣服要选便宜的颜色 ~misread

# 乐羊子妻（《后汉书》）
河南乐羊子之妻者，不知何氏之女也。羊子尝行路，得遗金一饼，还以与妻。妻曰：“妾闻志士不饮盗泉之水，廉者不受嗟来之食，况拾遗求利，以污其行乎！”羊子大惭，乃捐金于野，而远寻师学。
注：遗金，别人丢失的金子。一饼，一块。妾，古代妇女的谦称。盗泉，泉水名，有志气的人嫌它名字不好，渴了也不喝。嗟来之食，带着侮辱的施舍。行，品行。捐，丢弃。
?1 “还以与妻”的意思是什么？ | What does 还以与妻 mean?
≈ 回家把金子交给了妻子 | 还以与妻 | 得遗金一饼
% “还”是回家，“以”后面省去了“之”，指拾到的那块金子，“与”是给。连起来是乐羊子回家把金子给了妻子，所以下面才有妻子说的话。 | 还 is “return home”; after 以 the word for the gold is left out; 与 is “give”. He goes home and gives his wife the gold, which is why she speaks next.
- 还给了丢金子的人 ~sense
- 和妻子一起还金子 ~sense
?1 “况拾遗求利，以污其行乎”的意思是什么？ | What does this sentence mean?
≈ 何况捡别人丢失的东西谋取私利，来玷污自己的品行呢 | 况拾遗求利，以污其行乎 | 妾闻志士不饮盗泉之水
% “况……乎”是“何况……呢”，前面两件事说的是连名字不好的泉水、带侮辱的饭都不肯要，拾别人的金子就更不该了。“遗”是别人丢的东西，“行”是品行。 | 况……乎 is “how much more”: men of spirit refuse even a badly named spring and food given with scorn, still less should one keep gold someone lost. 遗 is what is lost, 行 conduct.
- 何况走路的时候，衣服被弄脏了 ~literal
- 拾到金子能让自己的品行更好 ~opposite
?1 “羊子大惭”中的“惭”是什么意思？ | What does 惭 mean here?
≈ 惭愧 | 羊子大惭 | 乃捐金于野
% 妻子说完拾金求利会玷污品行，乐羊子马上把金子扔到野外，又离家去求学。他听了话就改，可见是觉得自己做得不对，心里惭愧。 | When his wife has said that keeping found gold stains one's conduct, he throws it into the fields and leaves to study. He changes at once, so he feels he was wrong: ashamed.
- 生气 ~sense
- 高兴 ~opposite
?2 乐羊子妻是怎样劝说丈夫的？ | How does the wife persuade her husband?
≈ 引用“志士不饮盗泉之水，廉者不受嗟来之食”的说法，再由此推到拾金，以小见大 | 妾闻志士不饮盗泉之水，廉者不受嗟来之食 | 况拾遗求利
- 讲了一个丢金子的人着急的故事 ~unsaid
- 骂丈夫贪心 ~opposite
?2 妻子说话用了“况……乎”，有什么效果？ | What does 况……乎 do in her words?
≈ 用更进一层的反问，说明拾金比前两件事更不应该，语气有力 | 况拾遗求利，以污其行乎 | 廉者不受嗟来之食
- 表示妻子不清楚该怎么办 ~misread
- 表示妻子在向丈夫请教 ~sense
?2 这个故事表现了乐羊子妻怎样的品质？ | What does the story show of the wife?
≈ 品行高洁，不贪不义之财，而且善于讲道理劝人 | 况拾遗求利，以污其行乎 | 羊子大惭，乃捐金于野
- 不喜欢金子的颜色 ~unsaid
- 不愿意丈夫去求学 ~opposite

# 五十步笑百步（《孟子》）
梁惠王曰：“寡人之于国也，尽心焉耳矣。邻国之民不加少，寡人之民不加多，何也？”孟子对曰：“王好战，请以战喻。填然鼓之，兵刃既接，弃甲曳兵而走。或百步而后止，或五十步而后止。以五十步笑百步，则何如？”曰：“不可，直不百步耳，是亦走也。”曰：“王如知此，则无望民之多于邻国也。”
注：梁惠王，战国时魏国的国君。加，更。填然，形容鼓声。鼓，击鼓进军。兵刃既接，双方的兵器已经碰上。甲，铠甲。曳，拖着。兵，兵器。走，逃跑。直，只是。
?1 “弃甲曳兵而走”中的“走”是什么意思？ | What does 走 mean here?
≈ 逃跑 | 弃甲曳兵而走 | 或百步而后止
% 打仗时扔下铠甲、拖着兵器，是败下阵来；后面又说跑了一百步、五十步才停下。可见“走”是飞快地逃跑，不是今天慢慢地“走路”。 | Throwing off armour and trailing weapons in battle is to be routed; then some stop after a hundred paces, some after fifty. So 走 is “run away”, not today's walking.
- 走路 ~modern
- 离开 ~sense
?1 “直不百步耳，是亦走也”的意思是什么？ | What does the king's answer mean?
≈ 只不过没有跑到一百步罢了，这也是逃跑啊 | 直不百步耳，是亦走也 | 以五十步笑百步
% “直”是只是，“耳”是罢了，“是”指跑五十步这件事，“亦”是也。梁惠王说，跑五十步的只是比别人少跑了些，可同样是逃跑，所以没有资格笑别人。 | 直 is “only”, 耳 “that is all”, 是 the running of fifty paces, 亦 “also”. Fifty paces is only fewer, but it is running away all the same, so it may not mock the hundred.
- 一直跑不到一百步，就不跑了 ~modern
- 跑五十步的人比跑一百步的人勇敢 ~opposite
?1 “寡人之于国也，尽心焉耳矣”的意思是什么？ | What does the king's first sentence mean?
≈ 我对于国家，真是尽心尽力了 | 寡人之于国也，尽心焉耳矣 | 邻国之民不加少，寡人之民不加多
- 我只是把国家放在心里 ~sense
- 我对国家的事不太用心 ~opposite
?2 孟子是怎样回答梁惠王的问题的？ | How does Mencius answer the king?
≈ 不直接回答，先打一个打仗逃跑的比方，让梁惠王自己说出“是亦走也”，再点明道理 | 王好战，请以战喻 | 不可，直不百步耳，是亦走也 | 王如知此，则无望民之多于邻国也
% 梁惠王问的是百姓为什么不多。孟子先说“请以战喻”，讲五十步笑百步的事，问他怎么看；梁惠王说“是亦走也”，等于自己说出了答案。孟子顺势一点：你和邻国的差别，就像五十步和一百步。 | The king asks why his people do not grow. Mencius offers a likeness from war and asks his view; the king says it is running all the same, giving the answer himself. Mencius then points it out: you differ from your neighbours as fifty paces from a hundred.
- 列举了许多邻国国君的坏事 ~unsaid
- 直接批评梁惠王不会治国 ~opposite
?2 孟子为什么选打仗来作比喻？ | Why does Mencius choose war for his likeness?
≈ 梁惠王喜欢打仗，用他熟悉的事来比，他容易接受 | 王好战，请以战喻 | 以五十步笑百步，则何如
- 孟子自己喜欢打仗 ~who
- 当时正在打仗 ~unsaid
?2 “五十步笑百步”比喻什么？ | What does fifty paces mocking a hundred stand for?
≈ 自己和别人有同样的缺点，只是程度轻一些，却去嘲笑别人 | 以五十步笑百步 | 是亦走也
- 跑得慢的人比跑得快的人好 ~misread
- 打仗时要跑得远一些 ~literal

# 荆人遗弓（《吕氏春秋》）
荆人有遗弓者，而不肯索，曰：“荆人遗之，荆人得之，又何索焉？”孔子闻之曰：“去其‘荆’而可矣。”老聃闻之曰：“去其‘人’而可矣。”故老聃则至公矣。
注：荆，楚国。遗，丢失。索，寻找。老聃，就是老子。至公，最为公正无私。
?1 “荆人遗之，荆人得之，又何索焉”的意思是什么？ | What does the man's answer mean?
≈ 楚国人丢了它，楚国人捡到它，又何必去找呢 | 荆人遗之，荆人得之，又何索焉 | 而不肯索
% “遗”是丢失，“索”是寻找，“又何……焉”是反问，意思是何必。丢弓的人觉得，弓反正还在楚国人手里，用不着去找。这就是他“不肯索”的理由。 | 遗 is “lose”, 索 “seek”, 又何……焉 a rhetorical “why should”. The bow will still be in a man of Chu's hands, so why look? That is why he will not search.
- 楚国人丢了弓，楚国人一定要找回来 ~opposite
- 楚国人送了一张弓给别人 ~modern
?1 孔子说“去其‘荆’而可矣”，意思是什么？ | What does Confucius's remark mean?
≈ 去掉“荆”字就好了，就是说人丢了，人捡到，不必分是哪国人 | 去其‘荆’而可矣 | 荆人遗之，荆人得之
% 丢弓人的话是“荆人遗之，荆人得之”。去掉“荆”字，就成了“人遗之，人得之”：弓不管落到哪国人手里都一样。孔子的心比丢弓人更宽，不分国界。 | The man said a man of Chu lost it, a man of Chu finds it. Without 荆 it reads a man lost it, a man finds it: whoever's hand it falls into, it is the same. Confucius's heart is wider, beyond borders.
- 去掉楚国就好了 ~literal
- 去找楚国人就行了 ~sense
?1 “故老聃则至公矣”中的“至公”是什么意思？ | What does 至公 mean here?
≈ 最公正无私 | 故老聃则至公矣 | 去其‘人’而可矣
% 三个人一个比一个想得宽：丢弓人想的是楚国，孔子想的是天下的人，老聃连“人”也去掉，弓丢了、被得到，都只是天地间的事。文章最后用“至公”评价他，“至”是最，“公”是公正无私。 | Each sees wider than the last: the man thinks of Chu, Confucius of all men, Lao Dan drops even “man”, so losing and finding are just things of the world. The last line calls him 至公: 至 “most”, 公 “impartial”.
- 到了公家 ~modern
- 最喜欢公开说话 ~sense
?2 这段文字是按什么方式安排三个人的话的？ | How are the three speeches arranged?
≈ 层层递进，从楚国人到天下人再到不分人和物，境界一个比一个高 | 荆人遗之，荆人得之 | 去其‘荆’而可矣 | 去其‘人’而可矣
- 三个人说的是同一个意思 ~sense
- 按时间先后讲三个人丢弓 ~unsaid
?2 文中三个人谁的境界最高？依据是什么？ | Whose view is the highest, and on what grounds?
= 老聃，文章最后评价他“至公” | 故老聃则至公矣
- 丢弓的楚国人，他最大方 ~onepart
- 孔子，他最有名 ~unsaid
?2 这段文字用的是什么说理方法？ | How does the passage make its point?
≈ 借三个人对同一件事的不同说法作比较，层层推出“至公”的道理 | 孔子闻之曰 | 老聃闻之曰 | 故老聃则至公矣
- 引用古书上的话来证明 ~nocite
- 用比喻把弓比作国家 ~nolikening

# 晋文公攻原（《韩非子》）
晋文公攻原，裹十日粮，遂与大夫期十日。至原十日而原不下，击金而退，罢兵而去。士有从原中出者，曰：“原三日即下矣。”群臣左右谏曰：“夫原之食竭力尽矣，君姑待之。”公曰：“吾与士期十日，不去，是亡吾信也。得原失信，吾不为也。”遂罢兵而去。原人闻曰：“有君如彼其信也，可无归乎？”乃降公。卫人闻曰：“有君如彼其信也，可无从乎？”乃降公。孔子闻而记之曰：“攻原得卫者，信也。”
注：原，地名。裹，带着。期，约定。下，攻下。击金，敲锣，古代用来收兵。谏，劝。姑，姑且。亡，失去。降，投降。
?1 “遂与大夫期十日”中的“期”是什么意思？ | What does 期 mean here?
≈ 约定 | 遂与大夫期十日 | 吾与士期十日
% 文公只带了十天的粮，就和大夫们说好十天为限；后文他又说“吾与士期十日”，十天不走就是失信。能“失信”的，是事先说定的话，所以“期”是约定。 | He takes ten days' grain and sets ten days with his officers; later he says he set ten days with them, and staying would break faith. Only an agreement can be broken, so 期 is “agree on”.
- 时期 ~modern
- 希望 ~sense
?1 “得原失信，吾不为也”的意思是什么？ | What does 得原失信，吾不为也 mean?
≈ 得到原地却失去信用，我不做这样的事 | 得原失信，吾不为也 | 不去，是亡吾信也
- 得到了原地，就不怕失信了 ~opposite
- 我得不到原地，也不讲信用 ~sense
?1 “有君如彼其信也，可无归乎”的意思是什么？ | What does the people of Yuan's remark mean?
≈ 有这样守信用的国君，能不归附他吗 | 有君如彼其信也，可无归乎 | 乃降公
% “如彼其信”是“像他那样守信”，“可无……乎”是反问，意思是怎么能不。原人说完就“降公”，投降了晋文公，可见他们是说一定要归附。 | 如彼其信 is “as true to his word as he”, 可无……乎 a rhetorical “how could we not”. Having said it, they surrender, so they mean they must join him.
- 有这样的国君，就可以不回家了 ~sense
- 那个国君守信，我们可以不归附 ~opposite
?2 文公在什么情况下坚持退兵？ | In what circumstances does he insist on withdrawing?
≈ 原地三天之内就能攻下，群臣也劝他再等一等，他还是守约退兵 | 原三日即下矣 | 君姑待之 | 遂罢兵而去
- 粮食吃完了，只好退兵 ~unsaid
- 原地的兵太多，打不下来 ~opposite
?2 文章写原人和卫人两次说“有君如彼其信也”，有什么作用？ | What do the two like sayings do?
≈ 用两处的人都来归降，说明守信带来的好处，为孔子的评语作证 | 原人闻曰 | 卫人闻曰 | 攻原得卫者，信也
- 说明原人和卫人说话一模一样，是在开玩笑 ~sense
- 说明卫国比原地大 ~unsaid
?2 孔子的“攻原得卫者，信也”点明了什么道理？ | What truth does Confucius's remark state?
≈ 守信用能赢得人心，得到的比失去的更多 | 攻原得卫者，信也 | 得原失信，吾不为也
- 打仗要多带粮食 ~detail
- 攻城要先攻小地方 ~misread
`;

/** POEMS_9 are the classical poems of reading-9-poems: the sense of their famous lines, and the poet and times behind their feeling. */
export const POEMS_9 = `
# 酬乐天扬州初逢席上见赠（唐·刘禹锡）
巴山楚水凄凉地，二十三年弃置身。
怀旧空吟闻笛赋，到乡翻似烂柯人。
沉舟侧畔千帆过，病树前头万木春。
今日听君歌一曲，暂凭杯酒长精神。
注：诗人因参加政治革新被贬到南方，前后二十三年，回京途中在扬州遇到白居易（字乐天），白居易写诗相赠，诗人写了这首诗回答。闻笛赋，晋人怀念亡友的文章。烂柯人，传说有人进山看人下棋，一局未完，斧柄已经烂了，回到村里，同时代的人都已不在。翻，反而。长精神，振作精神。
?1 “沉舟侧畔千帆过，病树前头万木春”字面上写了什么？ | What do these two lines say on their face?
= 沉没的船旁边有千帆驶过，枯病的树前面万木生机勃勃 | 沉舟侧畔千帆过，病树前头万木春
- 很多船都沉没了，树也都病了 ~opposite
- 诗人坐船回乡，路上看见了病树 ~real
?1 诗人用“沉舟”“病树”比喻什么？ | What do the sunken boat and the sick tree stand for?
≈ 被贬多年、远离朝廷的自己 | 沉舟侧畔千帆过 | 二十三年弃置身
% 诗的前四句写自己被丢在“巴山楚水”二十三年，回来已经物是人非。紧接着出现的“沉舟”和“病树”，一个沉了、一个病了，正好对应被弃置多年的自己；“千帆”“万木”则是不断出现的新人新事。 | The first four lines tell of twenty-three years cast off in the south and a return to a changed world. The boat that sank and the tree that sickened answer to that cast-off self; the thousand sails and ten thousand trees are the new men and things that keep coming.
- 被贬的地方风景很荒凉 ~literal
- 诗人的朋友白居易 ~who
?1 “沉舟侧畔千帆过，病树前头万木春”今天常用来说明什么道理？ | What truth do people use these lines for today?
≈ 新事物必将代替旧事物，前途总是光明的 | 沉舟侧畔千帆过，病树前头万木春
% 两句写的都是一边是衰败的，一边是兴旺的：沉舟旁千帆竞过，病树前万木争春。衰败的停在那里，兴旺的不断向前。人们从中读出的，是新的总要代替旧的、世界总在向前的道理。 | Each line sets decay beside life: sails pass the sunken boat, spring fills the trees around the sick one. What decays stays; what thrives goes on. Readers take from it that the new replaces the old and the world moves forward.
- 坐船要小心，不然会沉船 ~literal
- 病了的树一定会死去 ~misread
?2 读懂这首诗，需要知道诗人怎样的经历？ | What of the poet's life do you need to know?
≈ 他因参加政治革新被贬到南方，前后二十三年，这首诗是回京途中写的 | 二十三年弃置身 | 巴山楚水凄凉地
- 他在扬州做了二十三年官 ~unsaid
- 他第一次出远门 ~opposite
?2 “怀旧空吟闻笛赋，到乡翻似烂柯人”表达了诗人怎样的感情？ | What do these lines carry?
≈ 怀念死去的老朋友，感叹离开太久，回来已经物是人非 | 怀旧空吟闻笛赋，到乡翻似烂柯人
% 结合注释，“闻笛赋”是怀念亡友的文章，诗人只能空自吟诵，说明当年的朋友有的已经不在了；“烂柯人”是进山一趟、回来世上已过了很多年的人，诗人用这个典故说自己离开太久，回来什么都变了。 | The note says the 闻笛赋 mourns dead friends: the poet can only recite it in vain, so some of his are gone; the man of the rotted axe handle returned to find the years had passed, as the poet now finds everything changed.
- 高兴地回到家乡，和朋友一起下棋 ~nomood
- 想念家乡的亲人 ~nomood
?2 诗的最后两句表现了诗人怎样的精神？ | What spirit do the last two lines show?
≈ 虽然遭受挫折，仍然要振作精神，乐观向前 | 暂凭杯酒长精神 | 病树前头万木春
- 借酒消愁，越来越消沉 ~nomood
- 只想喝酒听歌，不再做事 ~misread

# 行路难（其一）（唐·李白）
金樽清酒斗十千，玉盘珍羞直万钱。
停杯投箸不能食，拔剑四顾心茫然。
欲渡黄河冰塞川，将登太行雪满山。
闲来垂钓碧溪上，忽复乘舟梦日边。
行路难！行路难！多歧路，今安在？
长风破浪会有时，直挂云帆济沧海。
注：李白曾被召进京城做官，想施展抱负，却受到排挤，不到两年就被迫离开长安，这首诗大约写于离京的时候。斗十千，一斗值十千钱，形容酒好。珍羞，珍贵的菜肴。箸，筷子。垂钓碧溪、乘舟梦日边，用了两个古人先不得志、后被重用的故事。济，渡过。
?1 “停杯投箸不能食，拔剑四顾心茫然”写出了诗人怎样的状态？ | What state do these lines show?
≈ 面对美酒佳肴却吃不下，拔出剑四处张望，心中一片茫然 | 停杯投箸不能食，拔剑四顾心茫然 | 金樽清酒斗十千，玉盘珍羞直万钱
% 前两句写酒好菜贵，按理该痛快地吃喝；诗人却“停杯”“投箸”，放下杯子、扔下筷子，又“拔剑四顾”，不知道该往哪里去。“停”“投”“拔”“顾”一连串动作，写出他心里的苦闷和不知所措。 | The first lines give fine wine and costly dishes, a feast to enjoy; he puts down the cup and throws down the chopsticks, draws his sword and looks round, not knowing where to turn. The run of verbs, 停, 投, 拔, 顾, shows his gloom and loss.
- 酒菜不好吃，诗人很生气 ~opposite
- 诗人要拔剑和别人比武 ~literal
?1 “欲渡黄河冰塞川，将登太行雪满山”用的是什么写法？ | How are these lines written?
≈ 借冰塞黄河、雪满太行的景象，比喻人生道路上的重重阻碍 | 欲渡黄河冰塞川，将登太行雪满山 | 行路难！行路难！
- 写诗人冬天去旅行时看到的风景 ~real
- 说明黄河和太行山离得很近 ~unsaid
?1 “长风破浪会有时，直挂云帆济沧海”这句名句表达了什么？ | What does this famous line say?
≈ 相信总有一天能乘着长风、冲破巨浪，挂起高帆渡过大海，实现远大的理想 | 长风破浪会有时，直挂云帆济沧海 | 多歧路，今安在
% “会有时”是总会有那么一天；“济沧海”是渡过大海。前面刚说“行路难”，到处是岔路，不知道路在哪里；这两句却一下振作起来，说总有一天能乘风破浪。今天人们常用它表达不怕困难、对未来充满信心。 | 会有时 is “the day will come”; 济沧海 “to cross the sea”. Just after crying how hard the road is, where is it among so many forks, the lines rise up: one day I will ride the wind and break the waves. People use them today for confidence against hardship.
- 诗人准备去海边坐船 ~literal
- 大风大浪太危险，不能出海 ~opposite
?2 读懂这首诗，需要知道诗人怎样的经历？ | What of the poet's life do you need to know?
≈ 他被召进京城，想施展抱负，却受到排挤，被迫离开长安 | 拔剑四顾心茫然 | 多歧路，今安在
- 他第一次离开家乡出去游玩 ~unsaid
- 他在长安做了很大的官，很得意 ~opposite
?2 “闲来垂钓碧溪上，忽复乘舟梦日边”表达了诗人怎样的心情？ | What feeling is in these lines?
≈ 借古人先不得志、后被重用的故事，表达自己对重新得到重用的希望 | 闲来垂钓碧溪上，忽复乘舟梦日边 | 长风破浪会有时
% 注释说这两句用了两个古人的故事，他们都是先不得志，后来被重用。诗人刚被排挤出京城，想到他们，心里又生出希望：说不定自己也有被重用的一天。所以诗的结尾才能振作起来。 | The note says the lines recall two men who were overlooked and later raised up. Just driven from the capital, the poet thinks of them and hopes again that his day may come, which is why the poem can rise at the end.
- 诗人喜欢钓鱼和坐船 ~real
- 诗人想放弃理想，去过隐居的日子 ~opposite
?2 这首诗的感情是怎样变化的？ | How does the feeling move through the poem?
≈ 从苦闷茫然，到又生希望，再到连声感叹行路难，最后坚信理想终会实现，起伏跌宕 | 拔剑四顾心茫然 | 忽复乘舟梦日边 | 行路难！行路难！ | 长风破浪会有时
- 从头到尾都很高兴 ~nomood
- 从头到尾都很悲伤 ~onepart

# 破阵子·为陈同甫赋壮词以寄之（宋·辛弃疾）
醉里挑灯看剑，梦回吹角连营。八百里分麾下炙，五十弦翻塞外声。沙场秋点兵。
马作的卢飞快，弓如霹雳弦惊。了却君王天下事，赢得生前身后名。可怜白发生！
注：辛弃疾年轻时曾领兵抗金，后来南归，却长期被闲置，不能上前线。陈同甫，作者的朋友，也主张抗金。八百里，牛名。麾下，部下。炙，烤肉。五十弦，指瑟，泛指乐器。的卢，一种快马。
?1 “醉里挑灯看剑”中的“看剑”写出了什么？ | What does 看剑 show?
≈ 喝醉了还挑亮灯来看剑，写出作者念念不忘上阵杀敌 | 醉里挑灯看剑 | 梦回吹角连营
% 一般人喝醉了会睡去，作者却挑亮灯，拿着剑看。剑是打仗用的，醉中还放不下它，下一句又梦到军营，可见他心里想的始终是上阵杀敌。 | A drunk man would sleep; he trims the lamp and looks at his sword. A sword is for war; drunk, he still cannot put it down, and the next line dreams of camp: his mind is always on battle.
- 作者喜欢收藏宝剑 ~detail
- 作者喝醉了，看不清东西 ~literal
?1 “马作的卢飞快，弓如霹雳弦惊”用了什么修辞？有什么效果？ | What figure is in these lines, and to what effect?
≈ 比喻，把战马比作的卢、弓声比作霹雳，写出战斗的激烈和将士的英勇 | 马作的卢飞快，弓如霹雳弦惊 | 沙场秋点兵
- 拟人，把马写成了人 ~nolikening
- 对比，写战马和弓的不同 ~nocompare
?1 最后一句“可怜白发生”在词中起了什么作用？ | What does the last line do?
≈ 从梦中的壮景一下回到现实，感叹年老而壮志难酬 | 可怜白发生 | 了却君王天下事，赢得生前身后名
% 前面九句都是梦中的战斗，越写越豪壮，直到“赢得生前身后名”；最后五个字突然一转：头发白了，这一切只是梦。前面写得越豪壮，这一句就越悲凉。 | Nine lines of dreamed battle grow ever bolder up to the fame won in life and after; the last five characters turn at once: the hair is white, it was a dream. The bolder the dream, the bleaker this line.
- 继续写战斗胜利的喜悦 ~nomood
- 交代作者喝醉的原因 ~role
?2 结合作者的经历，“沙场秋点兵”写的是现实还是梦境？ | Is the review of troops real or a dream?
≈ 梦境，作者南归后长期被闲置，不能上前线，只能在梦中带兵 | 梦回吹角连营 | 沙场秋点兵 | 可怜白发生
- 现实，作者正在前线带兵打仗 ~real
- 现实，作者在看别人练兵 ~real
?2 这首词表达了作者怎样的感情？ | What feeling does the poem carry?
≈ 渴望杀敌报国、收复失地的壮志，和壮志难酬的悲愤 | 了却君王天下事 | 可怜白发生 | 醉里挑灯看剑
- 对朋友陈同甫的思念 ~nomood
- 对军营生活的厌倦 ~nomood
?2 题目说“赋壮词以寄之”，写给陈同甫有什么意义？ | Why send such a poem to Chen Tongfu?
≈ 陈同甫也主张抗金，作者把壮志和苦闷说给志同道合的朋友，互相激励 | 为陈同甫赋壮词以寄之 | 了却君王天下事
- 向朋友炫耀自己打了胜仗 ~unsaid
- 请朋友帮自己找一匹好马 ~literal

# 过零丁洋（宋·文天祥）
辛苦遭逢起一经，干戈寥落四周星。
山河破碎风飘絮，身世浮沉雨打萍。
惶恐滩头说惶恐，零丁洋里叹零丁。
人生自古谁无死？留取丹心照汗青。
注：文天祥领兵抗元，兵败被俘，被押着经过零丁洋，元军要他写信劝宋将投降，他写下这首诗。起一经，因精通一种经书而考中做官。干戈，指战争。四周星，四年。惶恐滩，地名，作者曾在那里兵败。丹心，红心，指忠心。汗青，史册。
?1 “山河破碎风飘絮，身世浮沉雨打萍”用了什么修辞？有什么作用？ | What figure is in these lines, and to what effect?
≈ 比喻，把国家比作风中的柳絮，把自己比作雨打的浮萍，写出国势危急和个人的漂泊 | 山河破碎风飘絮，身世浮沉雨打萍 | 干戈寥落四周星
- 夸张，把山河写得特别大 ~nolikening
- 拟人，写柳絮和浮萍会说话 ~nolikening
?1 “惶恐滩头说惶恐，零丁洋里叹零丁”巧妙在哪里？ | What is clever in these lines?
≈ 地名和心情用了同样的词，借“惶恐”“零丁”两个地名，写出当年兵败的惶恐和如今被俘的孤苦 | 惶恐滩头说惶恐，零丁洋里叹零丁
% 注释说惶恐滩是作者兵败的地方，零丁洋是他被押着经过的地方。每句里同一个词用了两次：前一个是地名，后一个是心情。一个回忆过去，一个写眼前，对得工整，感情也很沉痛。 | The notes say Huangkong Rapids is where he was beaten and Lingding Sea where he is taken now. Each line uses one word twice, a place and then a feeling, one past, one present, in close parallel and deep grief.
- 说明两个地方离得很近 ~unsaid
- 说明作者喜欢给地方起名字 ~unsaid
?1 “人生自古谁无死？留取丹心照汗青”是什么意思？ | What do the last lines mean?
≈ 人总有一死，我要留下一颗忠心，照耀史册 | 人生自古谁无死？留取丹心照汗青 | 丹心，红心，指忠心 | 汗青，史册
- 人活着就不会死，要好好读书 ~opposite
- 我害怕死，想留下来写书 ~opposite
?2 结合写作背景，诗的最后两句是在回答什么？ | Given when it was written, what do the last lines answer?
≈ 回答元军要他写信劝降的要求，表明宁死不降 | 人生自古谁无死 | 留取丹心照汗青
% 注释交代，作者被俘后，元军逼他写信劝宋将投降，他就写了这首诗。前面写国家和自己的苦难，最后两句却说人总有一死，要留下忠心。这就是他的回答：不写劝降信，宁死也不投降。 | The note says the Yuan army pressed him, a captive, to write urging surrender, and he wrote this poem. After the grief of the country and himself, the last lines say all men die, and he will leave a loyal heart: his answer is no letter, and death before surrender.
- 回答朋友问他身体好不好 ~unsaid
- 回答别人问他读过什么书 ~unsaid
?2 这首诗前六句和后两句的感情有什么变化？ | How does the feeling move between the first six lines and the last two?
≈ 前六句写国破家亡的悲痛，后两句一转，写出视死如归的壮烈 | 山河破碎风飘絮 | 零丁洋里叹零丁 | 留取丹心照汗青
- 始终是悲伤，没有变化 ~onepart
- 前面高兴，后面悲伤 ~opposite
?2 这首诗表现了作者怎样的品格？ | What does the poem show of the poet?
≈ 坚贞不屈，以身殉国的民族气节 | 留取丹心照汗青 | 人生自古谁无死
- 喜欢游山玩水 ~nomood
- 对战争感到厌倦，想回家 ~nomood

# 夜雨寄北（唐·李商隐）
君问归期未有期，巴山夜雨涨秋池。
何当共剪西窗烛，却话巴山夜雨时。
注：李商隐当时在巴蜀一带做事，远离北方的亲人，这首诗是写给北方亲人的回信。巴山，泛指巴蜀一带的山。何当，什么时候才能。剪烛，剪去烧焦的烛芯，让烛光更亮。却话，回头说起。
?1 “君问归期未有期”这一句有什么特点？ | What is special in the first line?
≈ 用一问一答开头，两个“期”字重复，写出无法确定归期的无奈 | 君问归期未有期 | 何当共剪西窗烛
% 前半句是对方来信问“什么时候回来”，后半句是诗人的回答“还没有日子”。同一句里两次用“期”，一问一答，想回而回不去的无奈就从这一句里透出来了。 | The first half is the question in the letter, when will you come home; the second the answer, no date yet. 期 twice in one line, asked and answered: the helplessness of wanting to go and being unable to.
- 诗人马上就要回家了 ~opposite
- 诗人不想回答对方的问题 ~overread
?1 “巴山夜雨涨秋池”描写了怎样的景象？ | What scene does this line paint?
≈ 秋夜巴山大雨不停，池塘的水都涨满了，烘托诗人孤寂的心情 | 巴山夜雨涨秋池 | 君问归期未有期
- 春天的巴山风和日丽 ~opposite
- 诗人在池塘边钓鱼 ~unsaid
?1 “巴山夜雨”在诗中出现了两次，有什么作用？ | What do the two 巴山夜雨 do?
≈ 第一次是眼前的实景，第二次是想象将来团聚时回忆的内容，把现在和将来连在一起 | 巴山夜雨涨秋池 | 却话巴山夜雨时
% 第二句的“巴山夜雨”是诗人此刻听到的雨；第四句的“巴山夜雨时”却是想象中将来和亲人坐在西窗下，回头说起今夜的情景。同一个景出现两次，一次在眼前，一次在回忆里，把孤单的现在和团聚的将来连了起来。 | In the second line the rain is what he hears now; in the fourth it is what he will tell of one day by the west window with his family. One scene twice, now and in recollection, joins the lonely present to the reunion to come.
- 说明巴山常常下雨 ~detail
- 重复是因为诗人想不出别的词 ~misread
?2 结合注释，这首诗是写给谁的？ | Given the note, to whom is the poem written?
≈ 远在北方的亲人，是对来信的回答 | 君问归期未有期 | 这首诗是写给北方亲人的回信
- 和诗人一起在巴山的朋友 ~who
- 诗人自己 ~who
?2 “何当共剪西窗烛”表达了诗人怎样的心愿？ | What wish is in 何当共剪西窗烛?
≈ 盼望早日回去，和亲人在西窗下一起剪烛夜谈 | 何当共剪西窗烛 | 君问归期未有期
- 希望买到更亮的蜡烛 ~literal
- 想一个人在西窗下读书 ~sense
?2 这首诗表达了诗人怎样的感情？ | What feeling does the poem carry?
≈ 客居他乡的孤寂和对北方亲人的深切思念 | 君问归期未有期 | 何当共剪西窗烛 | 巴山夜雨涨秋池
- 对巴山秋景的喜爱 ~nomood
- 对朋友远行的不舍 ~nomood

# 月夜忆舍弟（唐·杜甫）
戍鼓断人行，边秋一雁声。
露从今夜白，月是故乡明。
有弟皆分散，无家问死生。
寄书长不达，况乃未休兵。
注：这首诗写于安史之乱时期，杜甫的几个弟弟分散在各地，音信不通。戍鼓，城楼上报时或报警的鼓。断人行，禁止行人。舍弟，自己的弟弟。况乃，何况。
?1 “露从今夜白，月是故乡明”有什么特别的地方？ | What is special in these lines?
≈ 月亮哪里都一样，诗人偏说故乡的明，把思乡之情写进了景物 | 露从今夜白，月是故乡明 | 有弟皆分散
% 月亮本来到处一样亮，诗人却说“月是故乡明”，这不是事实，是心里的感觉：心在故乡，就觉得故乡的月亮最亮。这样写，思乡的感情不说出来，也从景物里透了出来。 | The moon shines alike everywhere, yet he says it is brightest at home: not fact but feeling. His heart is at home, so home's moon seems brightest, and the longing shows through the scene without being named.
- 故乡的月亮真的比别处亮 ~real
- 今天晚上露水很多，月亮很圆 ~literal
?1 “戍鼓断人行，边秋一雁声”营造了怎样的气氛？ | What mood do the first lines make?
≈ 鼓声响起，路上断了行人，只有一只孤雁在叫，冷清而凄凉 | 戍鼓断人行，边秋一雁声 | 戍鼓，城楼上报时或报警的鼓
- 热闹欢快的节日气氛 ~opposite
- 安静美好的田园气氛 ~nomood
?1 “有弟皆分散，无家问死生”写出了怎样的处境？ | What plight do these lines show?
≈ 弟弟们都分散在各地，家也没了，连他们的死活都无处打听 | 有弟皆分散，无家问死生 | 寄书长不达
- 弟弟们都回到家里，过得很好 ~opposite
- 诗人不想打听弟弟的消息 ~opposite
?2 结合写作背景，为什么“寄书长不达”？ | Given the times, why do letters never arrive?
≈ 安史之乱期间，战乱不停，交通断绝 | 寄书长不达，况乃未休兵 | 戍鼓断人行
% 注释说这首诗写在安史之乱时，最后一句又说“况乃未休兵”，何况战争还没有停止。打仗的时候，城里击鼓戒严，路上断了行人，书信自然很难送到。 | The note sets the poem in the An Lushan rebellion, and the last line adds that the fighting has not stopped. In war, drums close the roads and travellers vanish, so letters hardly get through.
- 诗人不知道弟弟住在哪里 ~unsaid
- 弟弟们不愿意给诗人回信 ~unsaid
?2 这首诗表达了诗人怎样的感情？ | What feeling does the poem carry?
≈ 对分散的弟弟们的思念和担忧，也有对战乱的忧虑 | 有弟皆分散，无家问死生 | 况乃未休兵 | 月是故乡明
- 对边塞秋天景色的喜爱 ~nomood
- 对朋友远行的不舍 ~nomood
?2 这首诗从个人的思念写到了什么更大的内容？ | What larger matter does the poem reach from one man's longing?
≈ 战争给百姓带来的骨肉分离的苦难 | 况乃未休兵 | 有弟皆分散
- 诗人想去边塞打仗 ~unsaid
- 秋天到了，大雁要南飞 ~detail

# 无题（唐·李商隐）
相见时难别亦难，东风无力百花残。
春蚕到死丝方尽，蜡炬成灰泪始干。
晓镜但愁云鬓改，夜吟应觉月光寒。
蓬山此去无多路，青鸟殷勤为探看。
注：李商隐写了许多以“无题”为题的诗，多写相思离别之情，这是其中一首。丝，和“思”同音。蜡炬，蜡烛。云鬓，女子浓密的头发。蓬山，传说中的仙山，这里指对方住的地方。青鸟，神话中传递消息的鸟。
?1 “春蚕到死丝方尽，蜡炬成灰泪始干”字面上写了什么？ | What do these lines say on their face?
= 春蚕到死才吐完丝，蜡烛烧成了灰，蜡油才流干 | 春蚕到死丝方尽，蜡炬成灰泪始干
- 春蚕很快就吐完了丝 ~opposite
- 有人看着蜡烛流下了眼泪 ~literal
?1 “春蚕到死丝方尽”中的“丝”有什么妙处？ | What is clever in 丝?
≈ “丝”和“思”同音，表面写蚕丝，实际写相思，到死才会停止 | 春蚕到死丝方尽 | 丝，和“思”同音
% 注释说“丝”和“思”同音。春蚕吐丝，一直到死才吐完；人的相思也一样，到死才会停止。一个字两层意思，把看不见的思念写成了看得见的蚕丝。 | The note says 丝 sounds like 思, longing. The silkworm spins till it dies; so does longing, ending only with death. One word, two senses, makes an unseen longing into thread one can see.
- 说明春蚕吐的丝很长 ~literal
- 说明诗人家里养蚕 ~real
?1 “春蚕到死丝方尽，蜡炬成灰泪始干”今天常用来赞美什么？ | Whom do people praise with these lines today?
≈ 无私奉献、至死不渝的人，比如老师 | 春蚕到死丝方尽，蜡炬成灰泪始干
% 春蚕吐完了丝才死，蜡烛烧成灰才停止流泪，都是把自己的一切都献了出来，直到最后。原诗写的是到死不变的相思，今天人们借这种至死不变的精神，来赞美默默奉献的人。 | The silkworm dies only when its thread is spent, the candle stops weeping only as ash: each gives all it has to the end. The poem means longing that lasts till death; people now borrow that constancy to praise those who give quietly.
- 会养蚕、会做蜡烛的人 ~literal
- 喜欢在夜里读书的人 ~unsaid
?2 结合注释，这首诗写的是什么感情？ | Given the note, what feeling does the poem carry?
≈ 和所爱的人离别后的相思，到死也不改变 | 相见时难别亦难 | 春蚕到死丝方尽 | 多写相思离别之情
- 对家乡的思念 ~nomood
- 对春天将尽的喜爱 ~nomood
?2 “东风无力百花残”这一句景物描写起了什么作用？ | What does the scene of the second line do?
≈ 春风无力，百花凋零，烘托离别的伤感 | 东风无力百花残 | 相见时难别亦难
- 写出春天百花盛开的热闹 ~opposite
- 说明东风很大，把花吹落了 ~opposite
?2 最后两句“蓬山此去无多路，青鸟殷勤为探看”表达了怎样的心愿？ | What wish do the last lines carry?
≈ 虽然难以相见，仍盼望有人替自己去看望对方、传递消息 | 青鸟殷勤为探看 | 蓬山此去无多路
% 注释说“蓬山”指对方住的地方，“青鸟”是传递消息的鸟。诗人和对方不能相见，只好请青鸟替自己勤勤恳恳地去看望。见不到，还念着，盼着，相思之情更深了一层。 | The note says 蓬山 is where the beloved lives, and the blue bird carries messages. Unable to meet, he begs the bird to go and see her for him. Kept apart, still longing and hoping, his love grows deeper.
- 诗人想去蓬山游玩 ~literal
- 诗人想养一只青鸟 ~literal

# 武陵春·春晚（宋·李清照）
风住尘香花已尽，日晚倦梳头。物是人非事事休，欲语泪先流。
闻说双溪春尚好，也拟泛轻舟。只恐双溪舴艋舟，载不动许多愁。
注：李清照晚年经历了国破、家亡、丈夫去世，流落到金华时写了这首词。尘香，花落在尘土上，尘土也带着香气。拟，打算。双溪，金华的一处名胜。舴艋舟，小船。
?1 “只恐双溪舴艋舟，载不动许多愁”好在哪里？ | What is good in the last lines?
≈ 把看不见的愁写成有重量的东西，连小船都载不动，写出愁的深重 | 只恐双溪舴艋舟，载不动许多愁
% 愁本来看不见、摸不着，词人却说小船“载不动”它，好像愁有分量，多得能把船压住。这样，愁就变得具体可感，读者一下子就体会到它有多重。 | Sorrow cannot be seen or held, yet she says the little boat cannot carry it, as if it had weight enough to sink the boat. Sorrow becomes something felt, and the reader grasps at once how heavy it is.
- 说明双溪的船太小，坐不了人 ~literal
- 说明词人不喜欢坐船 ~unsaid
?1 “物是人非事事休，欲语泪先流”写出了什么？ | What do these words show?
≈ 东西还是原来的，人却已经不在了，一切都完了，想说话眼泪就先流了下来 | 物是人非事事休，欲语泪先流 | 风住尘香花已尽
- 东西都坏了，人却还在 ~opposite
- 词人和别人说话说得很高兴 ~opposite
?1 “日晚倦梳头”写出了词人怎样的状态？ | What does 日晚倦梳头 show of her?
≈ 太阳很高了还懒得梳头，写出她心情沉重、无心打扮 | 日晚倦梳头 | 物是人非事事休
- 她起得很早，梳头很认真 ~opposite
- 她的头发很长，梳起来很累 ~literal
?2 结合词人的经历，“物是人非”中的“人非”指什么？ | Given her life, what is 人非?
≈ 丈夫已经去世，家人离散 | 物是人非事事休 | 欲语泪先流
% 注释说词人晚年经历了国破、家亡、丈夫去世。“物是”是东西还在，“人非”是人已经不在。眼前的东西都是旧的，和她一起看这些东西的丈夫却没了，所以“事事休”，一切都没有意思了。 | The note tells of her country lost, home gone, husband dead. 物是, things remain; 人非, the person does not. The old things are there, but the husband who shared them is gone, so all is over.
- 她不认识身边的人了 ~literal
- 她做错了很多事 ~sense
?2 “闻说双溪春尚好，也拟泛轻舟”和后两句之间，感情有什么变化？ | How does the feeling turn between these lines and the last?
≈ 听说双溪春光好，想去散散心，可又怕小船载不动愁，一扬一抑，愁更深了 | 也拟泛轻舟 | 只恐双溪舴艋舟
- 从悲伤变成了高兴 ~onepart
- 一直很高兴地游玩 ~nomood
?2 这首词表达了词人怎样的感情？ | What feeling does the poem carry?
≈ 国破家亡、丈夫去世以后的深重哀愁 | 载不动许多愁 | 物是人非事事休 | 欲语泪先流
- 对春天美景的喜爱 ~nomood
- 对朋友的思念 ~nomood

# 十一月四日风雨大作（宋·陆游）
僵卧孤村不自哀，尚思为国戍轮台。
夜阑卧听风吹雨，铁马冰河入梦来。
注：陆游一生主张抗金，这首诗写于他六十八岁闲居乡村的时候。僵卧，躺着不能动，形容年老体弱。戍轮台，守卫边疆。夜阑，夜深。铁马，披着铁甲的战马。
?1 “僵卧孤村不自哀”中的“不自哀”说明了什么？ | What does 不自哀 tell?
≈ 诗人年老体弱、独居孤村，却不为自己悲哀，心里想的是国家 | 僵卧孤村不自哀，尚思为国戍轮台
% “僵卧”写出他老了，身体不好；“孤村”写出他冷清地住在乡下。这样的处境，本该为自己难过，诗人偏说“不自哀”，接着说“尚思为国戍轮台”：他不为自己发愁，想的是还要去守卫边疆。 | 僵卧 shows him old and frail, 孤村 alone in the country: reason enough to pity himself. But he says he does not, and adds that he still thinks of guarding the frontier: not his own sorrows, but the country.
- 诗人病好了，很高兴 ~unsaid
- 诗人不知道自己身体不好 ~overread
?1 “夜阑卧听风吹雨，铁马冰河入梦来”是怎样把风雨和梦连起来的？ | How do the wind and rain lead to the dream?
≈ 夜里听到风雨声，像战马奔腾的声音，于是梦见了披甲的战马踏过冰河 | 夜阑卧听风吹雨 | 铁马冰河入梦来
- 风雨太大，诗人一夜没睡着 ~opposite
- 诗人梦见下了一场大雨 ~literal
?1 “铁马冰河入梦来”这句名句写出了什么？ | What does this famous line show?
≈ 诗人日夜想着上阵杀敌，连做梦都梦见自己骑着战马驰过冰河 | 铁马冰河入梦来 | 尚思为国戍轮台
- 诗人害怕打仗，做了噩梦 ~nomood
- 冬天到了，河面结了冰 ~literal
?2 结合诗人的经历，他为什么连做梦都梦到战场？ | Given his life, why does he dream of battle?
≈ 他一生主张抗金，到老闲居乡村，壮志仍然没有实现 | 尚思为国戍轮台 | 铁马冰河入梦来
- 他年轻时最喜欢骑马 ~unsaid
- 他住的村子在河边 ~unsaid
?2 这首诗表达了诗人怎样的感情？ | What feeling does the poem carry?
≈ 年老仍想报国杀敌的爱国热情 | 尚思为国戍轮台 | 铁马冰河入梦来 | 不自哀
- 独居乡村的孤独 ~nomood
- 对风雨天气的厌烦 ~nomood
?2 诗中“僵卧”和“铁马冰河”放在一起，有什么作用？ | Why set 僵卧 beside 铁马冰河?
≈ 现实中老病不能动，梦中却驰骋沙场，对比中更显出报国的心愿强烈和无法实现的悲凉 | 僵卧孤村不自哀 | 铁马冰河入梦来
- 说明诗人身体越来越好了 ~opposite
- 说明诗人梦里也睡得很香 ~sense

# 己亥杂诗（其五）（清·龚自珍）
浩荡离愁白日斜，吟鞭东指即天涯。
落红不是无情物，化作春泥更护花。
注：龚自珍不满当时朝廷的腐败，辞官离开北京回南方，路上写了一组诗，这是其中一首。浩荡，广大无边。吟鞭，诗人的马鞭。落红，落花。
?1 “落红不是无情物，化作春泥更护花”字面上写了什么？ | What do these lines say on their face?
= 落花不是没有感情的东西，它变成春天的泥土，还要保护花朵 | 落红不是无情物，化作春泥更护花
- 落花很无情，再也不管别的花了 ~opposite
- 春天的泥土把花都盖住了 ~sense
?1 诗人用“落红”比喻什么？ | What does the fallen petal stand for?
≈ 辞官离开朝廷的诗人自己 | 落红不是无情物 | 吟鞭东指即天涯
% 花落了，离开了枝头，就像诗人辞了官，离开了北京。诗人说落花“不是无情物”，还要化作泥土去护花，是借落花说自己：虽然离开了官场，仍然关心着国家。 | A fallen petal has left its branch, as the poet has left office and the capital. Saying it is not unfeeling and will turn to soil to guard the flowers, he speaks of himself: out of office, still caring for his country.
- 春天开得最美的花 ~opposite
- 路上看到的风景 ~literal
?1 “化作春泥更护花”今天常用来比喻什么？ | What do people use this line for today?
≈ 甘愿奉献，为培养下一代付出自己的一切，比如赞美老师 | 化作春泥更护花 | 落红不是无情物
- 种花要多施肥 ~literal
- 花落了就应该扫掉 ~misread
?2 结合诗人的经历，“浩荡离愁”是怎样的愁？ | Given his life, what is this vast sorrow?
≈ 辞官离开京城，告别多年的官场和朋友，心里的离愁无边无际 | 浩荡离愁白日斜 | 吟鞭东指即天涯
- 第一次离开家乡去京城的愁 ~opposite
- 和恋人分别的愁 ~unsaid
?2 诗的前两句和后两句的感情有什么不同？ | How do the first two lines and the last two differ in feeling?
≈ 前两句写离别的愁苦，后两句一转，写出虽然离开仍要报国的心愿 | 浩荡离愁白日斜 | 化作春泥更护花
% 前两句有“离愁”，有夕阳西斜，有远去天涯，是伤感的；后两句却说落花不是无情物，还要护花，变得积极起来。由愁到志，正是诗人的心情变化：伤心离开，却没有放下国家。 | The first two lines have sorrow, the setting sun, the road to the world's end: grief. The last two say the petal is not heartless and will guard the flowers: resolve. From sorrow to purpose: he leaves in grief, but does not let go of his country.
- 前后都是高兴 ~nomood
- 前两句写志向，后两句写离愁 ~opposite
?2 这首诗表达了诗人怎样的感情？ | What feeling does the poem carry?
≈ 离开官场的愁绪，和虽然辞官仍要为国家出力的献身精神 | 化作春泥更护花 | 浩荡离愁白日斜
- 对京城生活的留恋，不想回乡 ~nomood
- 对落花凋谢的惋惜 ~nomood
`;
