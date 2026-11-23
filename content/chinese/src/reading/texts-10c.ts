// The texts of the senior required reading topics of argument and of media (docs/chinese-curriculum.md §18.9), written
// for this subject; the people, posts and figures in them are made up. The format is that of parsePieces in topic-kit.ts:
// a question's wrong options carry the reason they are wrong.

/** ARGUMENT_10 are the pieces of reading-10-argument: the claim and line of each argument, and the logic it uses or breaks. */
export const ARGUMENT_10 = `
# 说“慢工出细活”
人们常说“慢工出细活”，意思是做事不能急，慢慢做才能做得好。这话有道理，但不能只从字面上理解。
“慢”的真正意思，不是动作慢，而是不省步骤、不走捷径。一位老木匠做一张桌子，要先把木头晾上一年，等它不再变形；榫头要一点点修，直到严丝合缝。他手上的动作其实很快，慢在他不肯跳过任何一道工序。
反过来，动作慢也不一定出细活。一个学生写作业拖拖拉拉，一边写一边玩，花了三个小时，错得一塌糊涂。他慢了，却没有出“细活”，因为他的心思根本不在上面。
可见，出细活的关键，在于用心和守规矩，而不在于时间的长短。我们说“慢工出细活”，要学的是那份不急于求成的耐心，而不是磨磨蹭蹭的拖拉。
?1 本文的中心论点是什么？ | What is the thesis?
≈ 出细活的关键在于用心和守规矩，而不在于时间的长短 | 出细活的关键，在于用心和守规矩，而不在于时间的长短 | 可见
% 文章先承认“慢工出细活”有道理，又说“不能只从字面上理解”；中间正反两个例子之后，用“可见”引出结论：关键在用心和守规矩。这句才是作者真正要证明的观点。 | The essay grants the saying some truth but warns against a literal reading; after a positive and a negative example, “so we see” brings the conclusion: what matters is care and method. That is the claim argued.
- 做事一定要慢，越慢越好 ~opposite
- 老木匠做桌子要先把木头晾上一年 ~notview
?1 文中老木匠的例子要证明什么？ | What does the carpenter's example prove?
≈ “慢”的真正意思是不省步骤、不走捷径 | “慢”的真正意思，不是动作慢，而是不省步骤、不走捷径 | 他手上的动作其实很快，慢在他不肯跳过任何一道工序
- 木匠做事很慢，所以做得好 ~misread
- 做桌子一定要用晾过的木头 ~trivial
?1 文章的论证思路是怎样的？ | How does the argument proceed?
≈ 先引出俗语，指出不能只看字面；再解释“慢”的真义，用正反两例论证；最后得出结论 | 这话有道理，但不能只从字面上理解 | “慢”的真正意思 | 反过来，动作慢也不一定出细活
- 先摆事例，最后才提出俗语 ~wrongorder
- 全文只用了一个事例 ~misread @ 反过来，动作慢也不一定
?2 学生写作业的例子运用了什么论证方法？有什么作用？ | What method is the pupil's example, and why?
≈ 举反例，从反面说明动作慢不一定出细活，使论证更全面 | 反过来，动作慢也不一定出细活 | 他慢了，却没有出“细活”
- 比喻论证，把学生比作木匠 ~nolikening
- 引用论证，引用了名人的话 ~nocite
?2 文中老木匠和学生两个例子放在一起，构成了什么关系？ | How do the two examples relate?
≈ 对比：一个动作快却出细活，一个动作慢却出不了细活，突出关键在用心而不在快慢 | 他手上的动作其实很快 | 他慢了，却没有出“细活” | 而不在于时间的长短
% 老木匠“动作其实很快”，却做出好活；学生“花了三个小时”，却“错得一塌糊涂”。快的出细活，慢的反而不出，这一比，就说明了快慢不是关键，用不用心才是。 | The carpenter is quick yet fine; the pupil takes three hours and fails. Quick turns out fine work, slow does not: speed is not the point, care is.
- 两个例子说的是同一个意思，可以删去一个 ~role
- 说明学生不如木匠聪明 ~misread @ 反过来，动作慢也不一定
?2 如果有人据此说“做事越快越好”，这个推理有什么问题？ | What is wrong with concluding “the faster the better”?
≈ 把“动作慢不一定好”错误地推成“越快越好”，走到了另一个极端，文章说的是快慢不是关键 | 而不在于时间的长短 | 他手上的动作其实很快
% 文章说的是出细活“不在于时间的长短”，快和慢都不是关键。从“慢不一定好”推出“快一定好”，是把一个否定当成了反面的肯定，推理不成立。 | The essay says length of time is not what matters, fast or slow. To go from “slow is not always good” to “fast is always good” turns a denial into its opposite claim, which does not follow.
- 这个推理完全正确 ~sound
- 问题在于文中没有提到快 ~offpoint

# 读书要有“问题意识”
读书的人很多，真正读懂的人却不多。原因之一，是许多人读书时脑子里没有问题。
没有问题的读书，像坐在车上看风景，一路过去，看了很多，记住的却很少。有了问题，就像带着地图找路，每读一页都在寻找答案，读到要紧的地方，自然会停下来想一想。
有人说，先读完了再想问题也不迟。可是，一本书读完，前面的内容早已模糊，问题也就提不出来了。问题意识不是读完以后才有的，而是要在读的过程中不断地生出来：这句话为什么这样说？作者的根据是什么？我同不同意？
当然，问题意识不是故意挑刺。提问的目的是为了读懂，而不是为了否定。一个只会说“我不同意”的读者，和一个什么都不问的读者，其实一样没有读进去。
?1 本文的中心论点是什么？ | What is the thesis?
≈ 读书要有问题意识，带着问题去读才能真正读懂 | 原因之一，是许多人读书时脑子里没有问题 | 有了问题，就像带着地图找路
% 文章从“真正读懂的人却不多”说起，指出原因是“没有问题”；接着比较有无问题的读书，再反驳“读完再想”，最后说明提问的目的是读懂。全文都在说明读书要带着问题。 | It begins with how few truly understand and blames the lack of questions; it compares reading with and without them, rebuts “think after”, and ends on asking in order to understand. All argue that reading needs questions.
- 读书时应该带着地图找路 ~likening
- 读书时要多说“我不同意” ~misread @ 一个只会说“我不同意”的读者
?1 第三段末尾连用三个问句，对论证有什么作用？ | What do the three questions closing the third paragraph do for the argument?
≈ 示范读的过程中该怎样提问，由句意到根据再到自己的判断，使“问题意识”有了具体的做法 | 这句话为什么这样说 | 作者的根据是什么 | 我同不同意
% 三个问句由浅入深：先问“这句话为什么这样说”，再问“作者的根据是什么”，最后问“我同不同意”。它们紧接在“要在读的过程中不断地生出来”之后，把问题意识落到了读者可以照着做的问法上，论点也就不空了。 | The three go deeper by steps: why it is said, on what grounds, whether I agree. Coming right after the claim that questions must arise while reading, they make it a practice the reader can follow, so the claim is not empty.
- 这是作者留给读者课后回答的三道练习题 ~role
- 说明提问就是要挑出作者的错 ~misread @ 问题意识不是故意挑刺
?1 最后一段在全文中有什么作用？ | What does the last paragraph do?
≈ 补充说明问题意识不是故意挑刺，防止误解，使论点更严密 | 当然，问题意识不是故意挑刺 | 提问的目的是为了读懂，而不是为了否定
- 提出一个新的中心论点 ~role
- 总结全文，重复前面的话 ~role
?2 第二段运用了什么论证方法？ | What method does the second paragraph use?
≈ 比喻论证和对比论证：把没有问题的读书比作坐车看风景，把有问题的读书比作带着地图找路，两相对照 | 像坐在车上看风景 | 就像带着地图找路
% 两个比喻：“坐在车上看风景”，看得多记得少；“带着地图找路”，每一步都有目的。两个比喻又放在一起对比，形象地说明了有没有问题意识的不同。 | Two likenings, sightseeing from a car and finding the way with a map, set side by side: vivid, and a contrast between reading with and without questions.
- 举例论证，列举了几位读书人的事例 ~noexample
- 引用论证，引用了古人的话 ~nocite
?2 第三段反驳“先读完再想”时，用了怎样的理由？ | What reason rebuts “think after reading”?
≈ 读完后前面的内容已经模糊，就提不出问题了 | 一本书读完，前面的内容早已模糊，问题也就提不出来了
% 作者没有简单地说“这不对”，而是指出它的后果：读完以后，前面的内容“早已模糊”，问题也就“提不出来了”。从后果说明这种做法行不通，这是有理有据的反驳。 | Rather than merely say no, the writer shows the consequence: by the end, the start is hazy and no question can be asked. Refuting by consequence is reasoned, not mere denial.
- 读完一本书要花很长时间 ~unsaid
- 作者不喜欢读完整本书 ~misread
?2 最后一句把“只会说我不同意的读者”和“什么都不问的读者”相提并论，用意何在？ | Why put the two readers together?
≈ 指出两个极端同样错误，说明问题意识要恰当，体现了思维的辩证 | 一个只会说“我不同意”的读者 | 和一个什么都不问的读者，其实一样没有读进去
- 说明这两种读者都很聪明 ~misread
- 说明作者认为提问没有用 ~opposite

# 不要被“大多数”绑架
“大家都这样做，我也这样做”，这是很多人做选择时的想法。跟着大多数走，似乎最安全。
可是，大多数人的选择不一定对。历史上，很长时间里，大多数人都相信太阳绕着地球转。人数的多少，不能决定一件事的对错，就像投票不能决定二加二等于几。
更要警惕的是，“大多数”有时只是一种错觉。网上一条消息下面有几千条相同的评论，看上去好像人人都这么想，其实也许只是几个人反复发帖。把这种声音当作“大多数”，就更容易被带着走。
当然，这并不是说大多数人的意见都不值得听。许多经验正是从大多数人的实践中来的。问题不在于听不听，而在于要用自己的头脑去想一想：他们为什么这样做？理由站得住吗？
?1 本文的中心论点是什么？ | What is the thesis?
≈ 不能盲目跟从大多数，要用自己的头脑判断 | 不要被“大多数”绑架 | 而在于要用自己的头脑去想一想
% 题目“不要被大多数绑架”已经提出观点；文中先指出大多数不一定对，再指出大多数可能是错觉，最后说明不是不听，而是“要用自己的头脑去想一想”。三层都在说同一个意思。 | The title states it; the body says the majority may be wrong, may be an illusion, and is to be heard but thought over. All three layers make one point.
- 大多数人的意见都是错的 ~broad
- 跟着大多数走最安全 ~opposite @ 人数的多少，不能决定一件事的对错
?1 第三段“更要警惕的是”提出了什么新的问题？ | What new danger does the third paragraph raise?
≈ 所谓的“大多数”有时只是错觉，几个人反复发声就可能被当作多数 | “大多数”有时只是一种错觉 | 其实也许只是几个人反复发帖
- 网上的评论都是真的 ~opposite
- 太阳绕着地球转 ~elsewhere
?1 最后一段在论证上有什么作用？ | What does the last paragraph do for the argument?
≈ 补充说明并非否定一切多数意见，使观点更全面、更严密 | 当然，这并不是说大多数人的意见都不值得听 | 许多经验正是从大多数人的实践中来的
- 推翻了前面的观点 ~opposite
- 举了一个新的事例 ~role
?2 作者拿“投票不能决定二加二等于几”作比，这个比方为什么有力？ | Why is the likening to voting on two plus two telling?
≈ 二加二等于几有确定的答案，不会因人数多少而改变；拿它作比，说明对错有自己的根据，不是人多就能决定的 | 就像投票不能决定二加二等于几 | 人数的多少，不能决定一件事的对错
% 谁都知道二加二等于四，就算多数人投票说等于五，答案也不会变。作者用这个人人认同的例子作比，让“人数的多少，不能决定一件事的对错”这个抽象的道理一下子变得不容置疑。 | All know two and two make four; a vote for five would not change it. Likening to so undisputed a case makes the abstract point, that numbers cannot settle right and wrong, hard to deny.
- 说明投票这种做法没有用，应该取消 ~likening
- 说明数学题的答案也可以由多数人决定 ~opposite
?2 作者用“太阳绕着地球转”作例子，这个例子选得好在哪里？ | Why is the sun-and-earth example well chosen?
≈ 这是大多数人相信了很长时间、后来被证明错了的事，人人都知道结果，最能说明人多不等于对 | 很长时间里，大多数人都相信太阳绕着地球转 | 可是，大多数人的选择不一定对
% 例子有两个特点：一是信的人多、时间长，正是“大多数”；二是今天人人都知道它错了，不必再争。用这样的事证明“大多数人的选择不一定对”，读者无法反驳。 | It has two marks: many believed it, for long, a true majority; and all now know it was wrong, beyond dispute. Proving that the majority may be wrong by such a case leaves no reply.
- 说明古代的人都不聪明 ~broad
- 说明作者对天文知识很熟悉 ~misread
?2 “大家都这样做，我也这样做”这种想法犯了什么推理错误？ | What error lies in “everyone does it, so I will”?
≈ 以人数多少作为判断对错的根据，把“很多人这样做”当成了“这样做是对的” | 人数的多少，不能决定一件事的对错 | 大家都这样做，我也这样做
% 这句话的推理是：很多人这样做，所以这样做是对的。可是人多不等于有理，文中已经指出“人数的多少，不能决定一件事的对错”，所以这个推理的前提和结论之间没有必然联系。 | It reasons: many do it, so it is right. But numbers are not reasons; as the essay says, how many people there are cannot decide right and wrong. The conclusion does not follow.
- 没有错误，这是正确的推理 ~sound
- 错在说的人太少了 ~offpoint

# 谈“失败是成功之母”
“失败是成功之母”，这句话激励了很多人。但仔细想想，失败本身并不会自动生出成功。
一个人考试没考好，如果只是难过几天，下次照样不复习，他会一次又一次地失败。失败要变成成功，中间少不了一步：总结。哪里错了？为什么错？下次怎样做？只有把这些想清楚了，失败才有价值。
有人反驳说，很多成功的人都失败过，这不正说明失败是成功之母吗？可是，失败过的人更多，其中大多数并没有成功。只看到成功者身上的失败，看不到失败者身上的失败，这样得出的结论是靠不住的。
所以，我们应该说：从失败中吸取教训，才是成功之母。失败只是一个机会，抓不抓得住，在于我们自己。
?1 作者对“失败是成功之母”的看法是什么？ | What is the writer's view of the saying?
≈ 失败本身不会带来成功，从失败中吸取教训才是成功之母 | 失败本身并不会自动生出成功 | 从失败中吸取教训，才是成功之母
- 作者完全同意这句话 ~opposite
- 作者认为失败没有任何价值 ~broad
?1 开头说“失败本身并不会自动生出成功”，其中“自动”一词有什么作用？ | What does “of itself” do in the opening?
≈ 表明作者并不否认失败的作用，只否认失败不经努力就能带来成功，用词准确，也为下文提出“总结”这一步埋下伏笔 | 失败本身并不会自动生出成功 | 中间少不了一步：总结
% 去掉“自动”，这句话就成了“失败不会生出成功”，和作者的意思相反。有了“自动”，作者否定的只是“失败了就会成功”这种想法；失败要变成成功，“中间少不了一步：总结”。一个词把观点的分寸定准了。 | Without “of itself” the sentence would say failure never leads to success, against the writer's meaning. With it, he denies only that failing brings success unaided; between them comes a step, reflection. One word sets the claim's measure.
- 说明失败对成功没有任何作用 ~broad
- 说明失败以后，成功会自己到来 ~opposite
?1 文章的最后一段在结构上有什么作用？ | What does the last paragraph do?
≈ 在前文分析的基础上，修正原来的说法，明确提出自己的观点 | 所以，我们应该说 | 从失败中吸取教训，才是成功之母
- 举出新的事例 ~role
- 重复了开头的俗语 ~role
?2 第三段中“有人反驳说”的推理有什么漏洞？ | What flaw is in the objector's reasoning?
≈ 只看成功者的失败，不看失败者的失败，用片面的例子得出结论 | 只看到成功者身上的失败，看不到失败者身上的失败 | 失败过的人更多，其中大多数并没有成功
% 反驳者说“成功的人都失败过”，所以失败带来成功。作者指出，失败过的人更多，大多数没有成功；只挑成功者来看，就像只挑中奖的人说买彩票能发财，例子是片面的，结论靠不住。 | The objector says the successful all failed, so failure brings success. But far more failed and never succeeded; picking only winners is a one-sided sample, and the conclusion does not hold.
- 反驳者没有举出例子 ~notflaw
- 成功的人从来没有失败过 ~opposite
?2 第二段考试的例子运用了什么论证方法？有什么作用？ | What method is the exam example, and why?
≈ 举例论证，从反面说明失败后不总结就会一再失败 | 一个人考试没考好 | 他会一次又一次地失败
- 比喻论证，把考试比作战争 ~nolikening
- 对比论证，比较了两个学生的成绩 ~nocompare
?2 本文属于哪种论证方式？ | What kind of argument is this?
≈ 驳论与立论结合：先质疑一种流行的说法，再提出自己修正后的观点 | 但仔细想想，失败本身并不会自动生出成功 | 所以，我们应该说
- 纯粹的立论文，没有反驳任何观点 ~misread
- 只破不立，没有提出自己的观点 ~misread

# 谈“专”与“博”
学问要“专”还是要“博”？有人说，现代社会分工越来越细，只有专精一门，才能有所成就；也有人说，知识越来越相互联系，只有广博，才能看得远。
其实，“专”和“博”并不矛盾。专，像一口井，挖得越深，水越多；博，像井口的那一片地，地面越宽，越容易找到挖井的地方，也越不容易在深处塌掉。只顾挖深而不管地面，井会越挖越窄；只顾扩大地面而不往下挖，永远见不到水。
许多有成就的科学家都是这样。他们在自己的领域里钻得很深，可他们也读诗、学音乐，对别的学科有浓厚的兴趣。广博的知识给了他们新的眼光，专精的研究又让这些眼光有了用武之地。
所以，“专”与“博”应当结合：在博的基础上求专，在专的指引下求博。
?1 作者的观点和开头的两种看法是什么关系？ | How does the writer's view stand to the two opening views?
≈ 不简单地赞成哪一方，而是指出两者并不矛盾，取两方合理的部分结合起来 | 其实，“专”和“博”并不矛盾 | 在博的基础上求专，在专的指引下求博
% 开头两种看法各执一端：一说只有专才有成就，一说只有博才看得远。作者用“其实”一转，说两者“并不矛盾”，结论又把二者放进同一句话里，“在博的基础上求专，在专的指引下求博”。这是在两方之上提出了更全面的看法。 | The two views each hold one end. “In fact” turns: they do not conflict, and the conclusion puts both in one sentence, depth on a base of breadth, breadth guided by depth. It is a fuller view above both sides.
- 赞成第一种看法，学问只要专就够了 ~oneside
- 认为两种看法都错了，学问既不必专也不必博 ~misread
?1 文章开头列出两种不同的看法，有什么作用？ | What do the two opening views do?
≈ 摆出争论的问题，引出作者自己的观点 | 有人说，现代社会分工越来越细 | 也有人说，知识越来越相互联系 | 其实，“专”和“博”并不矛盾
- 说明作者同意第一种看法 ~oneside
- 说明两种看法都是错的，学问不重要 ~misread @ 其实，“专”和“博”并不矛盾
?1 第三段举科学家的事例，要证明什么？ | What does the scientists' example prove?
≈ 专与博可以结合，而且结合起来才能有成就 | 他们在自己的领域里钻得很深，可他们也读诗、学音乐 | 广博的知识给了他们新的眼光
- 科学家都喜欢音乐 ~trivial
- 读诗比做研究更重要 ~misread
?2 第二段用“井”和“井口的地”作比，有什么作用？ | What does the well likening do?
≈ 比喻论证，形象地说明专与博相互依存的关系 | 专，像一口井 | 博，像井口的那一片地
% 把“专”比作井，越深水越多；把“博”比作井口的地，越宽越好找地方、越不容易塌。后面又说只挖不管地面、只扩不挖都不行。这个比喻把抽象的道理说得具体易懂。 | Depth is a well, the deeper the more water; breadth the ground round it, the wider the easier to site and the less likely to collapse. Digging without ground, or ground without digging, both fail. The likening makes an abstract point concrete.
- 说明打井需要很大的地方 ~face
- 举例论证，举了一个打井的事例 ~noexample
?2 第二段中“只顾挖深而不管地面……永远见不到水”运用了什么方法？ | What method are these two clauses?
≈ 正反假设，从两个方面说明偏于一端的害处 | 只顾挖深而不管地面，井会越挖越窄 | 只顾扩大地面而不往下挖，永远见不到水
- 引用论证 ~nocite
- 列数字说明 ~nonumber
?2 结论“在博的基础上求专，在专的指引下求博”在语言上有什么特点？ | What marks the language of the conclusion?
≈ 句式对称，前后两句互相照应，简明地说出两者的辩证关系 | 在博的基础上求专，在专的指引下求博 | 其实，“专”和“博”并不矛盾
- 前后两句意思重复，可以删去一句 ~misread
- 用了夸张的手法 ~noexaggerate

# 网络语言该不该进课堂
最近，有中学老师在作文课上提出：网络语言不能出现在作文里。这件事在网上引起了争论。
反对的人说，语言是活的，网络语言也是语言发展的一部分，禁止它就是守旧。这话有一半道理。语言确实在变化，有的网络词语已经被收进了词典，用得恰当，会让文章生动。
可是，“语言是活的”并不等于什么都可以用。有的网络语言是谐音字、缩写，只有一小群人看得懂；有的是故意写错的字，用多了会让学生分不清正确的写法。作文是学习规范语言的地方，就像学书法先要练好楷书，不能一开始就写草书。
所以，比较合理的做法不是一律禁止，也不是放任不管，而是教学生分辨：哪些已经被大家接受，可以用；哪些只是一时的流行，最好不用。
?1 作者对网络语言进课堂的态度是什么？ | What stand does the writer take?
≈ 既不一律禁止，也不放任不管，而是教学生分辨哪些可以用、哪些不用 | 比较合理的做法不是一律禁止，也不是放任不管，而是教学生分辨 | 哪些只是一时的流行，最好不用
- 作文里一律不能用网络语言 ~oneside
- 作文里可以随便用网络语言 ~oneside
?1 作者为什么说反对的意见“有一半道理”？ | Why only “half right”?
≈ 语言确实在变，有的网络词语已被接受，用得好会生动；但不能因此什么都用 | 这话有一半道理 | 有的网络词语已经被收进了词典 | 并不等于什么都可以用
% 作者先承认“语言确实在变化”，有的网络词语还“被收进了词典”，这是对的一半；接着用“可是”转折，指出“并不等于什么都可以用”，这是错的一半。肯定一部分、否定一部分，所以说“一半道理”。 | He grants that language changes and some net words are in dictionaries: the right half. “But” turns: that does not mean anything goes, the wrong half. Granting part and denying part, he calls it half right.
- 作者完全同意反对者的意见 ~misread
- 作者认为反对者的话完全错误 ~misread
?1 作者说作文是“学习规范语言的地方”，这一点在他的论证中起什么作用？ | What part does “the essay is where standard language is learned” play in his argument?
≈ 这是主张慎用的关键理由：网络语言别处可以用，用在以学规范为目的的作文里，就会妨碍学习，所以要看场合 | 作文是学习规范语言的地方 | 用多了会让学生分不清正确的写法 | 并不等于什么都可以用
% 作者并不认为网络语言本身不好，他承认有的“用得恰当，会让文章生动”。问题出在场合：作文要学的是规范的写法，而有的网络语言会“让学生分不清正确的写法”。抓住作文的目的来说，“慎用”的理由才站得住。 | He does not call net language bad in itself; used well, he grants, it enlivens. The trouble is the setting: an essay is for learning the standard, and some net words blur it. Arguing from the essay's purpose makes the case for care hold.
- 说明网络语言在任何地方都不能用 ~broad
- 说明作文比别的文章都重要 ~misread
?2 作者拿学书法先练楷书来类比，这个类比能证明什么，不能证明什么？ | What can the likening to calligraphy prove, and what not?
≈ 能证明学生应当先掌握规范的语言；但它只说先后，不能证明网络语言一概不能用，所以作者最后主张分辨而不是禁止 | 就像学书法先要练好楷书，不能一开始就写草书 | 比较合理的做法不是一律禁止
% 练书法先楷后草，说的是先后：草书并没有被禁止，只是要等楷书练好以后。用它作比，只能推出“先学规范语言”；作者也正是这样用的，所以结论是“不是一律禁止”，而是教学生分辨。 | Regular script before cursive is a matter of order: cursive is not banned, only deferred. The likening yields only “learn standard language first”, which is how the writer uses it: not a ban, but teaching to tell apart.
- 说明学生写作文以前要先练好书法 ~face
- 证明网络语言一概不能进作文 ~broad
?2 反对者说“禁止它就是守旧”，这个推理有什么问题？ | What is wrong with “banning it is old-fashioned”?
≈ 由“语言是活的”直接推出可以随便用，忽视了场合和规范；而且给对方贴上“守旧”的标签，代替了讲理 | 可是，“语言是活的”并不等于什么都可以用 | 禁止它就是守旧
% 从“语言是活的”到“什么都能用”，中间少了一步：在什么场合用、用的是什么。作者指出这一步缺失；同时，“守旧”是一个评价，不是理由，用它代替说理，论证不严密。 | From “language lives” to “anything goes” skips a step: which setting, which words. The writer names the gap; and “old-fashioned” is a label, not a reason, put in place of argument.
- 推理没有问题 ~sound
- 问题在于反对者没有上过学 ~attack
?2 文章的论证结构是怎样的？ | How is the argument built?
≈ 由一件事引出争论，先肯定对方的合理部分，再指出问题，最后提出折中合理的办法 | 这件事在网上引起了争论 | 这话有一半道理 | 可是 | 所以，比较合理的做法
- 先提出结论，再一一举例 ~wrongorder
- 只摆出了两种观点，没有自己的看法 ~misread @ 比较合理的做法不是一律禁止

# 说“偶然”
很多发明看起来来自偶然。有人在实验中不小心打翻了一瓶药水，结果发现了新的材料；有人看到苹果落地，想到了万有引力。于是有人说，发明靠的是运气。
可是，打翻药水的人很多，从中发现新材料的却很少；看见苹果落地的人更是数不清，想到万有引力的只有一个。同样的偶然，落在不同的人身上，结果完全不同。
区别在哪里？在于有没有准备。发现新材料的人，早已在这个问题上想了很多年；想到万有引力的人，脑子里装着多年的观察和计算。偶然只是一根火柴，能不能点燃，要看下面有没有柴。
所以，与其说发明靠运气，不如说机会只留给有准备的人。
?1 作者先承认“很多发明看起来来自偶然”，再反驳“发明靠运气”，这样写有什么好处？ | Why grant chance first, then refute luck?
≈ 先承认对方依据的事实，再指出这些事实推不出对方的结论，反驳有理有据，更有说服力 | 很多发明看起来来自偶然 | 可是，打翻药水的人很多，从中发现新材料的却很少
% 作者不否认打翻药水、苹果落地这些偶然；他抓住的是“同样的偶然”结果完全不同。对方的事实保留了，结论却被推翻了，这比一味否认更让人信服。 | He does not deny the spilt bottle or the falling apple; he seizes on the same chance yielding different results. The facts stand, the conclusion falls, which convinces more than flat denial.
- 说明作者也认为发明主要靠运气 ~misread
- 说明苹果落地的故事是编出来的 ~unsaid
?1 本文的中心论点是什么？ | What is the thesis?
≈ 机会只留给有准备的人 | 不如说机会只留给有准备的人 | 在于有没有准备
- 偶然在发明中没有任何作用 ~broad
- 看见苹果落地就能想到万有引力 ~misread @ 看见苹果落地的人
?1 第三段的论证思路是怎样的？ | How does the third paragraph reason?
≈ 先提出问题“区别在哪里”，再回答是有没有准备，并用两位发明者的情况具体说明，最后用比喻作结 | 区别在哪里？在于有没有准备 | 偶然只是一根火柴
- 只用了一个比喻，没有说明理由 ~misread
- 先写结论，再提出问题 ~wrongorder
?2 第二段运用了什么论证方法？ | What method does the second paragraph use?
≈ 对比论证：同样遇到偶然，大多数人没有发现，只有少数人有所发明 | 打翻药水的人很多，从中发现新材料的却很少 | 同样的偶然，落在不同的人身上，结果完全不同
- 比喻论证 ~nolikening
- 引用论证 ~nocite
?2 “偶然只是一根火柴，能不能点燃，要看下面有没有柴”运用了什么修辞？有什么作用？ | What figure is this, and what does it do?
≈ 比喻，把偶然比作火柴，把平时的准备比作柴，形象地说明偶然和准备的关系 | 偶然只是一根火柴 | 要看下面有没有柴
- 拟人，把火柴当作人来写 ~nopersonify
- 夸张，说明火柴的作用很大 ~noexaggerate
?2 “有人说发明靠的是运气”，这种看法犯了什么推理错误？ | What error lies in “invention is luck”?
≈ 只看到偶然这一表面原因，忽视了背后长期的准备，把偶然当成了决定性的原因 | 同样的偶然，落在不同的人身上，结果完全不同 | 在于有没有准备
% 如果运气决定发明，那么遇到同样偶然的人应该得到同样的结果；可事实是“结果完全不同”。这说明偶然不是决定性的原因，真正起作用的是“有没有准备”。看到表面的偶然就下结论，是因果关系没有找准。 | If luck decided, the same chance would bring the same result to all; it does not. So chance is not the deciding cause; preparation is. Judging by the surface accident mistakes the cause.
- 没有错误，发明确实靠运气 ~sound
- 错在把发明的人说得太少了 ~offpoint

# 少一点“标签”
给人贴标签，是一种很省事的思考方式。一个人数学考得不好，就说他“不聪明”；一个人不爱说话，就说他“不合群”；一个地方来的人做错了一件事，就说“那里的人都这样”。
标签省了我们了解一个人的工夫，却常常是错的。数学不好的人，也许语文很好；不爱说话的人，也许很会倾听。用一个标签概括一个人，就是用一个点代替了整个人。
更大的问题在于，“那里的人都这样”这样的话，是从一个人推到了一群人。一个人做错了事，只能说明这一个人，不能说明他身边的所有人。这样以偏概全，不但不公平，还会伤害许多无辜的人。
当然，人总要对别人有个判断。可是好的判断，是从具体的事出发，看得越多，说得越小心。少贴一点标签，多看一看真实的人，世界会公平得多。
?1 本文的中心论点是什么？ | What is the thesis?
≈ 少给人贴标签，要从具体的事出发，多看真实的人 | 少贴一点标签，多看一看真实的人 | 好的判断，是从具体的事出发
- 人不应该对别人有任何判断 ~broad
- 数学不好的人语文都很好 ~broad
?1 作者说贴标签是“一种很省事的思考方式”，“省事”二字包含了怎样的批评？ | What criticism lies in calling labels a “labour-saving” way of thinking?
≈ 贴标签省掉了了解一个人的工夫，图方便而不去看具体的事，所以常常是错的 | 标签省了我们了解一个人的工夫，却常常是错的 | 给人贴标签，是一种很省事的思考方式
% “省事”听上去像优点，作者紧接着说它省掉的是“了解一个人的工夫”，所以“常常是错的”。省下的正是不该省的那一步，这个词表面平和，其实是批评。 | Labour-saving sounds a virtue; at once he says what it saves is the work of knowing a person, and so it is often wrong. It saves the very step that should not be saved: a mild word, really a reproach.
- 批评贴标签太费时间 ~opposite
- 称赞贴标签能节省时间，值得提倡 ~misread
?1 最后一段“当然，人总要对别人有个判断”有什么作用？ | What does the last paragraph's concession do?
≈ 承认判断的必要，再说明怎样才是好的判断，使论证全面严密 | 当然，人总要对别人有个判断 | 可是好的判断，是从具体的事出发
- 推翻了前面反对贴标签的观点 ~opposite
- 说明作者自己也喜欢贴标签 ~misread
?2 同是贴标签，作者为什么说“那里的人都这样”是“更大的问题”？ | Why is “they are all like that” the greater problem?
≈ 它不只是看错一个人，而是从一个人推到一群人，以偏概全，会伤害许多无辜的人 | 是从一个人推到了一群人 | 更大的问题在于 | 还会伤害许多无辜的人
% 说一个人“不聪明”，错的只是对这个人的判断；“那里的人都这样”却把一个人的错推到了“他身边的所有人”身上。错误的范围从一个人扩大到一群人，所以说是“更大的问题”。 | Calling one person dull misjudges one; “they are all like that” lays one man's fault on all around him. The error grows from one to many, so it is the greater problem.
- 犯了偷换概念的错误，所以更严重 ~notflaw
- 因为这句话说得比别的话更难听 ~offpoint
?2 第一段列举三种贴标签的情况，有什么作用？ | What do the three opening cases do?
≈ 举例说明生活中常见的贴标签现象，引出论题 | 一个人数学考得不好，就说他“不聪明” | 一个人不爱说话，就说他“不合群” | 给人贴标签，是一种很省事的思考方式
- 说明作者被人贴过标签 ~unsaid
- 三个例子都是在批评学生 ~misread
?2 “数学不好的人，也许语文很好；不爱说话的人，也许很会倾听”运用了什么论证方法？ | What method is this?
≈ 举反例，说明标签只看到了人的一个方面 | 数学不好的人，也许语文很好 | 不爱说话的人，也许很会倾听
- 比喻论证 ~nolikening
- 引用论证 ~nocite

# 节约不是小气
有人把节约和小气混为一谈，以为节约就是什么钱都不花，什么东西都舍不得用。其实，二者有根本的不同。
节约是不浪费：该花的钱花，不该花的不花；东西用到用不了为止。小气则是该花的也不花，宁可让东西放坏，也不肯拿出来用，甚至别人需要帮助时，也一毛不拔。
一位老人一件衣服穿了十年，补了又补，可邻居家孩子生病，他拿出了自己存下的钱。这是节约。另一个人家里堆满了东西，宁可让粮食生虫，也不肯借给饿肚子的亲戚。这是小气。
可见，节约看的是东西有没有用好，小气看的是心里有没有别人。节约是一种美德，小气却是一种毛病。我们提倡节约，不能把小气也当成节约来夸。
?1 本文的中心论点是什么？ | What is the thesis?
≈ 节约和小气有根本的不同，节约是美德，小气是毛病 | 其实，二者有根本的不同 | 节约是一种美德，小气却是一种毛病
- 节约就是什么钱都不花 ~opposite
- 节约和小气是一回事 ~opposite
?1 作者是怎样区分节约和小气的？ | How does the writer tell them apart?
≈ 节约是该花的花、不浪费，小气是该花的也不花；节约看东西有没有用好，小气看心里有没有别人 | 节约是不浪费 | 小气则是该花的也不花 | 节约看的是东西有没有用好，小气看的是心里有没有别人
- 节约是有钱人做的，小气是没钱人做的 ~unsaid
- 节约是买便宜的东西，小气是买贵的东西 ~unsaid
?1 开头说有人“以为节约就是什么钱都不花”，按作者的分析，这种认识错在哪里？ | By the writer's analysis, what is wrong with that idea?
≈ 把“不浪费”误当作“什么都不花”，把小气的做法当成了节约，混淆了两个概念 | 以为节约就是什么钱都不花 | 节约是不浪费 | 小气则是该花的也不花
% 作者给节约下的定义是“不浪费”：该花的花，不该花的不花。“什么钱都不花”连该花的也不花，按第二段的界定，这恰恰是小气。所以这种认识把两个概念混在了一起。 | The writer defines thrift as not wasting: spend what should be spent, no more. Spending nothing, not even what should be, is by the second paragraph stinginess. The idea runs the two together.
- 错在节约本来就是一种毛病 ~misread
- 错在没有说清楚要花多少钱 ~offpoint
?2 第三段运用了什么论证方法？有什么作用？ | What method is the third paragraph, and why?
≈ 举例对比，用老人和另一个人的事例具体说明节约和小气的区别 | 一位老人一件衣服穿了十年 | 另一个人家里堆满了东西 | 这是节约 | 这是小气
% 两个人都舍不得用东西，看上去差不多；可老人在邻居需要时拿出了钱，另一个人宁可粮食生虫也不借。把两件事放在一起比较，节约和小气的分别就清楚了。 | Both are sparing and look alike; but the old man gives when a neighbour needs it, the other lets grain rot sooner than lend. Set side by side, the difference is plain.
- 引用论证，引用了古人的话 ~nocite
- 比喻论证，把节约比作衣服 ~nolikening
?2 本文主要采用了什么样的论证思路？ | What line of reasoning does the essay chiefly follow?
≈ 辨析概念：先指出混淆，再界定两个概念，用事例对比，最后得出结论 | 有人把节约和小气混为一谈 | 节约是不浪费 | 可见
- 先讲故事，再总结道理，没有区分概念 ~misread @ 其实，二者有根本的不同
- 只说节约的好处，没有说小气 ~misread @ 其实，二者有根本的不同
?2 有人说“他连一分钱都不肯借，真节约”，这句话的问题在哪里？ | What is wrong with this remark?
≈ 把小气当成节约来夸，混淆了两个概念 | 我们提倡节约，不能把小气也当成节约来夸 | 甚至别人需要帮助时，也一毛不拔
% 按文中的区分，别人需要帮助时“一毛不拔”，是小气的表现，而不是节约。说它是“节约”，正是文章开头批评的“混为一谈”，结尾也说不能“把小气也当成节约来夸”。 | By the essay's distinction, refusing help in need is stinginess, not thrift. Calling it thrift is the very confusion the opening names, and the close says not to praise stinginess as thrift.
- 这句话没有问题 ~sound
- 问题在于借的钱太少了 ~offpoint

# “有用”与“无用”
常常听到学生问：学这个有什么用？数学里的函数，买菜用不上；古诗背得再多，也换不来一份工作。在不少人眼里，用不上的知识就是没用的。
可是，“有用”和“无用”不能只看眼前。一个人学函数，学到的不只是几个公式，更是一种推理的习惯；背古诗，积累的不只是几首诗，更是对语言的感觉和对人生的体会。这些东西不能马上换成钱，却会在很多年后的某一天，帮你想清楚一个问题，写好一封信，或者在难过的时候安慰你。
庄子说过一个故事：一棵大树长得歪歪扭扭，木匠说它做不了任何东西，是没用的树。可正因为没用，它没有被砍掉，长成了能让很多人乘凉的大树。
所以，判断一样东西有没有用，不能只问它“现在能干什么”，还要问它“会让我成为什么样的人”。
?1 本文的中心论点是什么？ | What is the thesis?
≈ 判断有没有用不能只看眼前，还要看它会让人成为什么样的人 | 不能只问它“现在能干什么”，还要问它“会让我成为什么样的人” | 可是，“有用”和“无用”不能只看眼前
- 学数学和背古诗都没有用 ~opposite
- 用不上的知识就是没用的 ~oneside
?1 作者说学函数学到的“不只是几个公式，更是一种推理的习惯”，这种“不只是……更是……”的说法在论证中起什么作用？ | What does the “not only… but…” pattern do for the argument?
≈ 先承认知识表面的内容，再指出它深一层的用处，把“用”从眼前的用途扩大到人的能力和修养，为反驳“用不上就没用”提供根据 | 学到的不只是几个公式，更是一种推理的习惯 | 积累的不只是几首诗 | 可是，“有用”和“无用”不能只看眼前
% 对方说函数“买菜用不上”，作者不去争它能不能买菜，而是用“不只是……更是……”把话题转到看不见的用处上：推理的习惯、对语言的感觉。“用”的意思一扩大，“用不上就是没用”的说法就站不住了。 | The other side says functions are no use for shopping; he does not dispute that, but with “not only… but…” turns to unseen uses: a habit of reasoning, a feel for language. Once “use” is widened, “unused means useless” falls.
- 说明公式没有用，可以不学 ~misread
- 说明学函数能帮人找到一份好工作 ~unsaid
?1 文章开头写学生的问题，有什么作用？ | What does the pupils' question do?
≈ 摆出“用不上就没用”的普遍看法，作为全文要反驳的对象 | 学这个有什么用？ | 在不少人眼里，用不上的知识就是没用的
- 说明学生学习很努力 ~misread
- 说明作者也认为学这些没有用 ~misread @ 所以，判断一样东西有没有用
?2 第三段引用庄子的故事，运用了什么论证方法？有什么作用？ | What method is the Zhuangzi story, and why?
≈ 引用论证（举例），用古人的寓言说明“无用”之中也有大用，增强了说服力 | 庄子说过一个故事 | 可正因为没用，它没有被砍掉
- 比喻论证，把大树比作学生 ~nolikening
- 对比论证，比较了两棵树 ~nocompare
?2 第二段“这些东西不能马上换成钱，却会在很多年后的某一天……”这句话的论证作用是什么？ | What does this sentence do for the argument?
≈ 先承认知识没有眼前的用处，再指出它长远的作用，正面阐明作者的看法 | 这些东西不能马上换成钱 | 却会在很多年后的某一天
- 说明知识可以在很多年后换成很多钱 ~misread
- 推翻了文章的中心论点 ~role
?2 “用不上的知识就是没用的”这种看法有什么推理上的问题？ | What is wrong in this reasoning?
≈ 只用眼前能不能用来判断价值，标准太狭窄，忽视了长远的、看不见的作用 | 可是，“有用”和“无用”不能只看眼前 | 这些东西不能马上换成钱
% 这种看法把“现在用不上”直接等同于“没用”，只用一个狭窄的标准衡量知识。作者指出用处“不能只看眼前”，有的作用要在“很多年后”才显出来，所以这个推理忽略了另一类用处。 | It equates “of no use now” with “useless”, measuring by one narrow rule. The writer shows use cannot be judged by the moment alone; some shows years later. The reasoning ignores a whole kind of use.
- 这个推理完全正确 ~sound
- 问题在于学生不应该提问 ~offpoint
`;

/** MEDIA_10 are the pieces of reading-10-media, materials of several media on one matter: how each medium tells it, and how far each can be trusted. */
export const MEDIA_10 = `
# 一场暴雨的三种讲法
材料一（市气象台公告）：7月12日14时至18时，本市中心城区降雨量达一百二十毫米，为今年以来最大的一次降雨。气象台已于当日11时发布暴雨黄色预警。
材料二（一段短视频的文字说明）：画面里，一辆小汽车在积水中缓缓前行，水已经没过车门。配的文字是：“全城被淹！出门的赶紧回家！”视频发布两小时，播放量超过五十万。
材料三（晚报报道）：记者从市排水部门了解到，暴雨期间，全市有十一处路段出现积水，最深处约六十厘米，到当晚九点已全部排除。其余路段交通基本正常。
?1 三则材料各有什么特点？ | What marks each of the three materials?
≈ 公告数据准确、简明；短视频画面直观、传播快，但说法夸大；报道有调查，交代了范围和结果，比较全面 | 中心城区降雨量达一百二十毫米 | 全城被淹！出门的赶紧回家！ | 全市有十一处路段出现积水
% 公告只给出时间和雨量，准确而简短；短视频用一个画面打动人，两小时就有五十万次播放，可“全城被淹”说得太大；晚报写清了几处积水、多深、什么时候排完，信息最完整。 | The notice gives only times and rainfall, exact and brief; the clip moves with one image and spreads fast, but “the whole city flooded” overstates; the paper gives how many spots, how deep, and when cleared: the fullest.
- 三则材料说的是三场不同的雨 ~misread
- 短视频最准确，因为有画面 ~misread
?1 根据材料，“全城被淹”的说法是否可信？为什么？ | Is “the whole city flooded” credible, and why?
≈ 不可信。积水只出现在十一处路段，当晚就已排除，其余路段基本正常 | 全市有十一处路段出现积水 | 其余路段交通基本正常
- 可信，因为视频里水已经没过车门 ~narrow
- 可信，因为播放量超过五十万 ~misread
?1 短视频播放量很高，能不能说明它说得对？ | Does a high view count make the clip right?
≈ 不能。播放量只说明传播得广，不能证明内容真实 | 视频发布两小时，播放量超过五十万 | 其余路段交通基本正常
% 播放量是看的人多少，和说得对不对是两回事。晚报说积水只在十一处，“其余路段交通基本正常”，可见视频的说法与事实不符，看的人再多也不能让它变成真的。 | Views measure how many watched, not whether it is true. The paper says only eleven spots flooded and other roads ran normally: the clip is wrong however many watch.
- 能，看的人多就说明是真的 ~misread
- 能，因为视频是在暴雨时拍的 ~misread
?2 材料二短视频的画面是真实的，为什么仍然会误导人？ | The footage is real; why does it still mislead?
≈ 用一处的画面配上“全城被淹”的文字，以局部代替整体，夸大了事实 | 画面里，一辆小汽车在积水中缓缓前行 | 全城被淹！出门的赶紧回家！
% 画面里只有一辆车、一处积水，这是真的；可配的文字说“全城”，把一处说成了处处。画面真实不等于说法真实，以偏概全同样会误导人。 | The picture shows one car, one flooded spot, which is true; but the caption says the whole city, turning one place into everywhere. A real image does not make a true claim.
- 因为画面是电脑做出来的 ~unsaid
- 因为视频太短了 ~misread
?2 说到暴雨对交通的影响，为什么材料三比材料二更有说服力？ | On the effect on traffic, why does the third convince more than the second?
≈ 材料三有可靠的来源，说清了积水的地点数、深度和排除的时间，还交代了其余路段的情况；材料二只有一个画面和一句夸大的话 | 记者从市排水部门了解到 | 最深处约六十厘米，到当晚九点已全部排除 | 全城被淹！出门的赶紧回家！
% 材料三的信息来自“市排水部门”，有范围（十一处）、有程度（约六十厘米）、有结果（当晚九点排除），还说明了没有积水的地方。材料二只拍了一处，却说“全城”。来源清楚、数据具体、说到了整体，所以更可信。 | The third cites the drainage department and gives extent, depth and outcome, and says what was not flooded. The second shows one spot and claims the whole city. A clear source, exact figures and the whole picture make the third more credible.
- 因为报纸上的消息一定都是真的 ~broad
- 因为材料三的字数比材料二多 ~offpoint
?2 材料一说气象台“已于当日11时发布暴雨黄色预警”，这一信息有什么价值？ | What is the value of the warning time?
≈ 说明在暴雨之前已经提前预警，公众可以提前做好准备 | 气象台已于当日11时发布暴雨黄色预警 | 7月12日14时至18时
- 说明暴雨是从11时开始下的 ~figure
- 说明预警发得太晚了 ~opposite

# 一本书的两种推荐
材料一（一位读者的书评节选）：这本书写的是一个小镇上三代人的故事。作者不急着讲情节，而是花很多笔墨写镇上的街道、河流和四季。读到一半，我才明白，小镇本身就是书里的主角。这本书适合慢慢读，读得太快，会错过很多东西。
材料二（一段图书推荐短视频的解说词）：“三分钟带你看完一本神作！爷爷、爸爸、孙子，三代人的爱恨情仇，结局让人泪目！看完这个视频，你就不用读原书了！”
?1 两则材料对这本书的介绍有什么不同？ | How do the two introductions differ?
≈ 书评注重书的写法和阅读感受，建议慢慢读；短视频只概括情节、渲染情绪，还说可以不读原书 | 作者不急着讲情节 | 这本书适合慢慢读 | 看完这个视频，你就不用读原书了
- 两则材料推荐的是两本不同的书 ~misread
- 书评只讲情节，短视频讲写法 ~opposite
?1 书评说“读到一半，我才明白，小镇本身就是书里的主角”，由此可以推断这本书在写法上有什么特点？ | From “the town itself is the hero”, what can one infer of how the book is written?
≈ 情节不是重点，作者花大量笔墨写小镇的街道、河流和四季，让小镇像人物一样贯穿全书 | 小镇本身就是书里的主角 | 作者不急着讲情节，而是花很多笔墨写镇上的街道、河流和四季
% 一本写“三代人的故事”的书，主角却是小镇，说明人物和情节退到了后面；前一句“不急着讲情节，而是花很多笔墨写镇上的街道、河流和四季”正好解释了这一点。“读到一半”才明白，也说明这种写法要慢慢读才体会得到。 | A book of three generations whose hero is the town has put people and plot behind; the sentence before, on streets, river and seasons, explains it. Seeing it only halfway through shows the method reveals itself to slow reading.
- 情节曲折，结局让人流泪 ~misread
- 写的是一个大城市的故事 ~opposite
?1 短视频说“看完这个视频，你就不用读原书了”，这种说法对吗？ | Is the clip right that the book need not be read?
≈ 不对。这本书的好处在于对小镇风物的描写，三分钟的情节概括恰恰丢掉了它最重要的东西 | 读得太快，会错过很多东西 | 三分钟带你看完一本神作
% 书评说这本书“适合慢慢读”，读快了“会错过很多东西”，它的主角是小镇本身。短视频只讲“三代人的爱恨情仇”，正好把写小镇的部分都略去了，看视频代替不了读书。 | The review says read it slowly or miss much; its hero is the town. The clip gives only three generations' loves and hates, exactly dropping the town; a clip cannot replace the book.
- 对，因为视频把三代人都讲到了 ~misread
- 对，因为视频只要三分钟，省时间 ~misread
?2 短视频的解说词在语言上有什么特点？ | What marks the clip's language?
≈ 用“神作”“泪目”等夸张、煽情的词语和感叹句吸引观众 | 三分钟带你看完一本神作！ | 结局让人泪目！
- 语言平实、客观，没有感情色彩 ~opposite
- 引用了书中的原文 ~nocite
?2 两则材料分别适合什么样的读者需要？ | Which reader need does each serve?
≈ 书评适合想认真读书、了解书的价值的读者；短视频只能让人快速知道大概情节 | 这本书适合慢慢读 | 三分钟带你看完一本神作
- 两则材料适合同样的读者 ~misread
- 短视频适合想深入理解作品的读者 ~opposite
?2 从这两则材料看，我们应该怎样对待“快速读书”类的视频？ | What do the two teach about speed-reading clips?
≈ 可以把它当作了解书的入口，但不能代替阅读原书 | 看完这个视频，你就不用读原书了 | 读得太快，会错过很多东西
% 视频能让人很快知道书讲了什么，或许能引起兴趣；可书评告诉我们，读快了会错过很多东西。所以视频只能当引子，真正的理解还要靠读原书。 | A clip tells fast what a book is about and may spark interest; yet the review warns that speed misses much. A clip can lead in, but understanding needs the book.
- 应该只看视频，不看书 ~misread
- 这类视频都是骗人的，一律不能看 ~broad

# “喝冷水会伤胃”吗
材料一（一条转发很多的消息）：“医生提醒：喝冷水会伤胃，一杯冰水要胃花五个小时才能恢复！赶紧转给家人！”消息没有写是哪位医生，也没有写出处。
材料二（一位消化科医生接受采访时说）：“健康的人适量喝凉水，一般不会伤胃。胃有调节温度的能力。但本身胃不好的人，或者一下子喝很多冰水，可能会感到不舒服。所谓‘五个小时才能恢复’，没有科学依据。”
材料三（一份健康科普杂志的说明）：判断一条健康信息是否可信，可以看三点：有没有写明来源；说话的人是不是这方面的专业人员；有没有夸大的说法和催人转发的话。
?1 材料一和材料二对喝冷水的说法有什么不同？ | How do the first two materials differ on cold water?
≈ 材料一说喝冷水一定伤胃；材料二说健康的人适量喝一般不伤胃，只有胃不好或喝太多冰水才可能不舒服 | 健康的人适量喝凉水，一般不会伤胃 | 喝冷水会伤胃 | 本身胃不好的人
- 两则材料说法完全一样 ~misread
- 材料二说喝冷水对所有人都有害 ~opposite
?1 根据材料，“一杯冰水要胃花五个小时才能恢复”是否可信？ | Is the five-hour claim credible?
≈ 不可信，医生指出这种说法没有科学依据 | 所谓‘五个小时才能恢复’，没有科学依据 | 消息没有写是哪位医生，也没有写出处
- 可信，因为消息里说是医生提醒的 ~misread
- 可信，因为转发的人很多 ~misread
?1 材料二中医生的说法为什么比材料一更可信？ | Why trust the doctor in the second more?
≈ 说话人是消化科医生，有明确的身份，说法有分寸，不夸大 | 一位消化科医生接受采访时说 | 健康的人适量喝凉水，一般不会伤胃
% 按材料三的标准：材料二写明是“消化科医生”，是这方面的专业人员；他说“一般不会”“可能会”，说得有分寸。材料一没有来源，还用“赶紧转给家人”催人转发，正好不符合这些标准。 | By the third material's test: the second names a gastroenterologist, an expert in the field, who speaks with measure (“usually not”, “may”). The first has no source and urges forwarding, failing every test.
- 因为医生说的话更长 ~offpoint
- 因为材料二发表得更晚 ~unsaid
?2 运用材料三的标准，指出材料一有哪些不可信的地方。 | By the third material's test, what makes the first doubtful?
≈ 没有写明来源，说话人身份不明，有夸大的说法，还催人转发 | 消息没有写是哪位医生，也没有写出处 | 赶紧转给家人！ | 一杯冰水要胃花五个小时才能恢复！
- 材料一的字太少 ~offpoint
- 材料一没有错别字，所以可信 ~offpoint
?2 材料二中医生说“一般不会”“可能会”，这样的措辞有什么好处？ | What is gained by “usually not” and “may”?
≈ 措辞有分寸，区分了不同情况，说话严谨，更符合事实 | 一般不会伤胃 | 可能会感到不舒服
- 说明医生自己也不确定，不可信 ~misread
- 说明医生不愿意回答问题 ~misread
?2 三则材料放在一起阅读，对我们有什么启示？ | What do the three together teach?
≈ 面对网上的健康信息，要看来源、看是否专业、看有没有夸大，多方比较后再判断 | 判断一条健康信息是否可信，可以看三点 | 赶紧转给家人！ | 一位消化科医生接受采访时说
% 材料一是一条流传的说法，材料二是专业人员的回应，材料三给出了判断的标准。三者对照，我们就学会了不急着相信和转发，而是看来源、看专业、看说法，再作判断。 | The first is a rumour, the second an expert's reply, the third a test. Read together, they teach us not to believe or forward at once, but to check source, expertise and wording first.
- 不要喝冷水 ~misread
- 网上的信息都不可信 ~broad

# 一个景点的两张图
材料一（旅游网站上的宣传图文）：照片上，湖水碧蓝，湖边一个人也没有，只有一棵开满花的树。配文：“人间仙境，等你来！”
材料二（一位游客在五一假期发的照片和文字）：照片上，湖边挤满了人，几乎看不见湖水。文字：“排队两个小时才到湖边，拍张照都要等人走开。”
材料三（景区管理处的公告）：本景区平日游客约三千人，节假日最多达三万人。建议游客错峰出行，并提前在网上预约。
?1 材料一和材料二的照片为什么差别很大？ | Why are the two photographs so different?
≈ 拍摄的时间不同：宣传照可能在人少时拍的，游客的照片是在五一假期，节假日游客多 | 一位游客在五一假期发的照片和文字 | 节假日最多达三万人 | 湖边一个人也没有
% 材料三说平日约三千人，节假日最多三万人，相差十倍。游客的照片拍在“五一假期”，自然人山人海；宣传照“一个人也没有”，多半是挑了人少的时候拍的。 | Weekdays bring three thousand, holidays up to thirty: ten times as many. The visitor shot at May Day, hence the crowd; the promotional photo, empty, was probably taken at a quiet hour.
- 两张照片拍的是两个不同的湖 ~misread
- 宣传照是假的，景区根本没有湖 ~misread
?1 两张照片中，哪一张是“真实”的？ | Which photograph is “true”?
≈ 两张都可能是真实的，只是各自只反映了一个时间的情况 | 本景区平日游客约三千人，节假日最多达三万人 | 湖边挤满了人
- 只有宣传照是真实的 ~part
- 只有游客的照片是真实的 ~part
?1 打算去这个景点的人，从三则材料中可以得到什么建议？ | What should a would-be visitor take from them?
≈ 避开节假日，错峰出行，并提前在网上预约 | 建议游客错峰出行，并提前在网上预约 | 节假日最多达三万人
- 一定要在五一假期去 ~opposite
- 不要去这个景点，那里一点也不好 ~misread
?2 材料一的宣传图文有什么特点？读者应该注意什么？ | What marks the promotion, and what should readers note?
≈ 挑最美的画面、用“人间仙境”这样的词吸引人；读者要知道宣传只展示最好的一面 | 人间仙境，等你来！ | 湖边一个人也没有，只有一棵开满花的树
- 宣传图文完全客观，不用怀疑 ~misread
- 宣传图文全是假的，不能看 ~broad
?2 要判断这个景点平时拥不拥挤，为什么材料三比两张照片更可靠？ | To judge how crowded the place is, why trust the third over the photographs?
≈ 材料三给出了平日和节假日的人数，说的是一般情况；两张照片各自只拍下了某一个时刻 | 本景区平日游客约三千人，节假日最多达三万人 | 湖边一个人也没有 | 湖边挤满了人
% 宣传照挑的是“一个人也没有”的时候，游客的照片拍的是五一假期“挤满了人”的时候，都只是某一刻。景区公告说平日约三千人、节假日最多三万人，是对许多天的概括，才能回答“平时怎样”。 | One photo caught a moment with no one, the other a holiday crush: each one moment. The office's figures, ordinary days and holidays, sum up many days and so answer how it usually is.
- 游客的照片最可靠，因为那是亲身经历 ~part
- 宣传图文最可靠，因为是旅游网站发的 ~misread
?2 这组材料告诉我们，看图片信息时要注意什么？ | What does the set teach about images?
≈ 图片只反映某一时刻、某一角度，要结合拍摄的时间、来源和数据综合判断 | 一位游客在五一假期发的照片和文字 | 旅游网站上的宣传图文 | 本景区平日游客约三千人
% 宣传照和游客照片说的是同一个湖，却完全不同，因为一个是宣传，一个是假期里拍的；只有结合材料三的数据，才知道两张照片各说对了一部分。看图要问是谁拍的、什么时候拍的。 | Promoter and visitor show the same lake quite differently, one selling, one shot on a holiday; only the figures show each is partly right. Ask of any image who took it and when.
- 有图片就一定是真的 ~misread
- 只看文字，不看图片 ~misread

# 机器人能不能代替老师
材料一（一篇网络文章的标题和开头）：“十年后，老师这个职业将消失！”人工智能已经能批改作业、回答问题，有人预测，将来的课堂上将不再需要老师。
材料二（某校的一次问卷，问题是“你更愿意向谁请教问题”）：选择“老师”的学生占百分之五十二，选择“智能学习软件”的占百分之三十一，选择“同学”的占百分之十七。
材料三（一位老教师的话）：“软件能告诉学生答案是什么，可是学生为什么不想学了、为什么和同学闹别扭、为什么一次考砸就觉得自己什么都不行，这些，软件看不出来。”
?1 材料一的说法有什么问题？ | What is wrong with the first material's claim?
≈ 由人工智能能做部分工作，就推出老师将会消失，推论太绝对，也只是“有人预测” | 十年后，老师这个职业将消失！ | 有人预测
% 人工智能“能批改作业、回答问题”，只是老师工作的一部分；由此说老师“将消失”，是把部分当成了全部。而且这只是“有人预测”，没有可靠的根据，标题却说得斩钉截铁。 | AI marking and answering is only part of teaching; saying teachers will vanish takes part for whole. And it is only “some predict”, with no basis, though the headline sounds certain.
- 没有问题，这是已经发生的事实 ~sound
- 问题在于文章太短了 ~offpoint
?1 材料二的数据说明了什么？ | What do the survey figures show?
≈ 超过一半的学生仍然更愿意向老师请教，但也有不少学生愿意用学习软件 | 选择“老师”的学生占百分之五十二 | 选择“智能学习软件”的占百分之三十一
- 大多数学生更愿意用学习软件 ~figure
- 没有学生愿意向同学请教 ~figure
?1 材料三中老教师认为老师有哪些不可代替的作用？ | What, says the teacher, can no software replace?
≈ 关心学生的情绪、人际关系和信心，看出学生心里的问题 | 学生为什么不想学了 | 为什么和同学闹别扭 | 这些，软件看不出来
- 告诉学生答案是什么 ~opposite
- 批改作业比软件快 ~unsaid
?2 材料一用了一个什么样的标题？这种标题有什么特点？ | What kind of headline is the first, and what marks it?
≈ 用惊人的、绝对的说法吸引人点击，往往夸大其词 | 十年后，老师这个职业将消失！ | 有人预测
- 平实客观的标题，准确概括了内容 ~misread
- 疑问式标题，引起读者思考 ~misread
?2 材料二的问卷只在一所学校做，用它来说明全国的情况有什么问题？ | What is wrong with using one school's survey for the whole country?
≈ 调查范围太小，一所学校的结果不能代表所有学生 | 某校的一次问卷
% 问卷只是“某校的一次问卷”，范围只有一所学校，学生的情况也许和别处不同。用它说明本校的情况可以，用它说全国就是以偏概全。 | It is one school's single survey, and its pupils may differ from others. It speaks for that school, not for the country: that would be over-generalising.
- 没有问题，数据都是准确的 ~sound
- 问题在于选项太多了 ~offpoint
?2 三则材料放在一起看，对“机器人能不能代替老师”可以得出什么较为合理的看法？ | What sounder view do the three support together?
≈ 人工智能能分担老师的部分工作，但关心和理解学生的作用难以代替 | 人工智能已经能批改作业、回答问题 | 这些，软件看不出来 | 选择“老师”的学生占百分之五十二
% 材料一说明人工智能确实能做一些事；材料二说明学生对软件和老师都有需要；材料三说明理解学生的心，是软件做不到的。综合起来，不是“代替”，而是分担。 | The first shows AI can do some things; the second that pupils want both; the third that reading a pupil's heart is beyond software. Together: not replacing but sharing.
- 机器人十年后一定会代替老师 ~misread
- 人工智能对教育没有任何用处 ~broad

# 一种新零食的广告和说明
材料一（电视广告词）：“全新果蔬脆片，真正的蔬菜做成！健康零食，孩子吃了更聪明！”
材料二（包装背面的配料表和营养成分表）：配料：马铃薯、植物油、白砂糖、胡萝卜粉、食用盐。每100克含脂肪30克，钠600毫克。
材料三（营养师的提醒）：配料表是按含量从多到少排列的。排在前面的，才是主要的原料。
?1 这种零食叫“果蔬脆片”，按材料三的方法看配料表，名称和配料有什么出入？ | Read by the third material's method, how does the name square with the label?
≈ 名称突出“果蔬”，可配料里没有水果，蔬菜只有排在后面的胡萝卜粉，主要原料是马铃薯和植物油 | 配料：马铃薯、植物油、白砂糖、胡萝卜粉、食用盐 | 全新果蔬脆片 | 排在前面的，才是主要的原料
% 配料表“按含量从多到少排列”，排在最前的是马铃薯和植物油，胡萝卜粉在白砂糖之后，含量很少；整张表里也找不到一种水果。所以“果蔬”二字给人的印象，和实际的配料并不相符。 | The list runs from most to least: potato and oil come first, carrot powder after the sugar, little of it; and no fruit at all. So the “fruit and vegetable” of the name does not match what is inside.
- 没有出入，配料里有胡萝卜粉，就是果蔬做的 ~misread
- 出入在名称里的“脆”字，配料表没有写到 ~offpoint
?1 广告说“真正的蔬菜做成”，和配料表对照，是否准确？ | Is “made of real vegetables” accurate against the label?
≈ 不够准确。主要原料是马铃薯和植物油，胡萝卜粉排在后面，含量很少 | 胡萝卜粉 | 配料表是按含量从多到少排列的
% 广告让人以为它主要是蔬菜做的。可是配料表上，排在最前面的是马铃薯和植物油，“胡萝卜粉”排在白砂糖之后，含量很少。广告说的不能算完全错，却会让人误解。 | The advert suggests mostly vegetables; the label lists potato and oil first, carrot powder after sugar, in small amount. Not quite false, but misleading.
- 准确，因为马铃薯也是蔬菜 ~part
- 准确，因为广告上有蔬菜的画面 ~misread
?1 广告说“孩子吃了更聪明”，这种说法可信吗？ | Is “children grow cleverer” credible?
≈ 不可信，材料中没有任何根据，是夸大的宣传 | 孩子吃了更聪明 | 每100克含脂肪30克，钠600毫克
- 可信，因为蔬菜对身体好 ~misread
- 可信，因为是在电视上播的 ~misread
?2 广告和配料表在表达上有什么不同？ | How do advert and label differ in their telling?
≈ 广告语言夸张、有煽动性，只说好处；配料表用文字和数字客观列出成分，不加评价 | 健康零食，孩子吃了更聪明！ | 配料：马铃薯、植物油、白砂糖、胡萝卜粉、食用盐
- 广告比配料表更客观 ~opposite
- 两者没有区别 ~misread
?2 营养师的提醒对读者有什么用？ | What use is the dietitian's note?
≈ 告诉读者看配料表的方法，帮助人们识别广告的夸大 | 配料表是按含量从多到少排列的 | 排在前面的，才是主要的原料
- 告诉读者这种零食非常健康 ~unsaid
- 告诉读者不要吃任何零食 ~unsaid
?2 从材料二的营养成分看，广告中“健康零食”的说法有什么问题？ | By the nutrition figures, what is wrong with “healthy snack”?
≈ 脂肪和钠含量较高，又加了糖，不宜多吃，说它“健康”有些夸大 | 每100克含脂肪30克，钠600毫克 | 白砂糖
% 每100克就有30克脂肪、600毫克钠，配料里还有白砂糖，这些都是不宜多吃的成分。广告只说“健康”，却不提这些，说法片面，有误导之嫌。 | Thirty grams of fat and 600 milligrams of sodium per hundred, plus sugar: none to be eaten freely. The advert says “healthy” and omits them: one-sided and misleading.
- 没有问题，这种零食完全健康 ~misread
- 问题在于价格太贵 ~unsaid

# 古镇要不要开发
材料一（一篇报道）：西坪古镇有六百多年历史，保存着三十多座明清老宅。去年，有公司计划投资开发，修建停车场、酒店和商业街。
材料二（一位居民在网上的留言）：“开发了，房子就不是我们的了，满街都是卖一样东西的小店，跟别的地方有什么区别？”
材料三（另一位居民的留言）：“年轻人都出去打工了，镇上只剩老人。不开发，房子没人修，过几年就塌了。”
材料四（一位研究古建筑的学者的意见）：开发和保护不是非此即彼。关键是老宅要按原样修，居民愿意留下的可以留下，商业要有限度。
?1 材料二和材料三的居民各自的态度是什么？ | What does each resident think?
≈ 材料二的居民担心开发会让古镇失去特色，倾向于反对；材料三的居民认为不开发古镇会衰败，倾向于支持 | 跟别的地方有什么区别？ | 不开发，房子没人修，过几年就塌了
- 两位居民都支持开发 ~misread
- 两位居民都反对开发 ~misread
?1 材料四中学者的看法是什么？ | What is the scholar's view?
≈ 开发和保护可以兼顾，关键在于按原样修老宅、尊重居民意愿、限制商业 | 开发和保护不是非此即彼 | 关键是老宅要按原样修
- 古镇绝对不能开发 ~misread
- 古镇应该全部拆掉重建 ~opposite
?1 材料一只交代事实、不发表意见，放在这组材料的最前面有什么作用？ | The first gives facts and no view; why does it come first?
≈ 先让读者了解古镇的历史、现状和开发计划，后面各方的意见才有共同的事实作依据 | 西坪古镇有六百多年历史，保存着三十多座明清老宅 | 去年，有公司计划投资开发
% 后面三则材料都在回答“开发了会怎样、不开发会怎样”。只有先知道古镇有多老、有多少老宅、公司打算修什么，读者才能判断居民的担心和学者的建议说得对不对。事实在前，观点在后，判断才有依据。 | The other three all answer what happens with or without development. Only knowing how old the town is, how many houses, what the company plans, can a reader weigh the residents' fears and the scholar's advice. Facts first, views after.
- 表明写报道的人支持开发 ~misread
- 说明居民的意见不如事实重要 ~misread
?2 四则材料中，哪些是事实，哪些是观点？ | Which are facts and which views?
≈ 材料一主要是事实；材料二、三、四是不同的人的观点 | 西坪古镇有六百多年历史 | 一位居民在网上的留言 | 一位研究古建筑的学者的意见
- 四则材料都是事实 ~misread
- 四则材料都是观点 ~misread
?2 网上的两条居民留言有什么共同的特点？ | What do the two posts share?
≈ 都从自己的生活感受出发，语言口语化，表达直接，但只代表个人看法 | 开发了，房子就不是我们的了 | 年轻人都出去打工了，镇上只剩老人
% 两条留言都说自己的处境：一个担心“房子就不是我们的了”，一个看到“只剩老人”，说法都很直接，像日常说话。它们真实，但每一条只是一个人的看法，不能代表全镇。 | Both speak from their own lives: one fears losing their homes, one sees only the old left. Both are direct, like talk. Real, yet each is one voice, not the town's.
- 都引用了大量的数据 ~nonumber
- 都是专家写的 ~misread
?2 要对古镇开发作出合理的判断，阅读这组材料时应该怎样做？ | How should one read this set to judge fairly?
≈ 了解基本事实，听取不同方面的意见，再结合专业的看法综合判断，不能只听一方 | 西坪古镇有六百多年历史 | 开发和保护不是非此即彼 | 一位居民在网上的留言
- 只看支持开发的意见 ~misread
- 只要看学者的意见，居民的意见不重要 ~misread

# 同一件事的两个标题
材料一（甲网站的标题）：“某中学禁止学生带手机，家长怒了！”
材料二（乙网站的标题）：“某中学规定手机上课时统一保管，放学归还”
材料三（学校发布的通知原文节选）：“为减少上课时手机对学习的干扰，自下周起，学生进校后将手机交班主任统一保管，放学时归还。如有紧急情况，可用教室电话联系家长。”
?1 通知开头写“为减少上课时手机对学习的干扰”，这句话对理解规定有什么帮助？ | How does the notice's first clause help one understand the rule?
≈ 说明规定针对的是上课时的干扰，所以只是在校时保管、放学归还，并不是不让学生用手机 | 为减少上课时手机对学习的干扰 | 放学时归还
% 规定的目的写在开头：减少“上课时”的干扰。目的定了范围，做法也就只管在校的时间，“放学时归还”。明白了目的，就能看出“禁止带手机”的说法把规定说过头了。 | The purpose comes first: less disturbance in class. It sets the scope, so the rule covers only school hours, the phones returned after. Knowing it shows that “phones banned” overstates the rule.
- 说明学校认为手机对学生没有任何用处 ~broad
- 说明学校要把学生的手机收走，不再归还 ~misread
?1 两个标题中，哪一个更准确？为什么？ | Which headline is more accurate, and why?
≈ 乙网站的标题更准确，它和学校通知的内容一致；甲网站说“禁止带手机”与事实不符 | 某中学规定手机上课时统一保管，放学归还 | 学生进校后将手机交班主任统一保管
- 甲网站的标题更准确，因为说出了家长的态度 ~misread
- 两个标题一样准确 ~misread
?1 甲网站的标题中“家长怒了”这一说法，根据材料能不能确定？ | Can “parents furious” be confirmed from the materials?
≈ 不能确定，材料中没有任何关于家长反应的信息 | 某中学禁止学生带手机，家长怒了！ | 如有紧急情况，可用教室电话联系家长
- 能确定，所有家长都很生气 ~unsaid
- 能确定，因为学校通知里写了 ~misread
?2 甲网站的标题为什么要这样写？ | Why would the first site word it so?
≈ 用夸张、有冲突感的说法制造话题，吸引人点击 | 家长怒了！ | 某中学禁止学生带手机
% “禁止”比“统一保管”说得更严厉，“家长怒了”又制造了冲突，再加一个感叹号。这样的标题容易引起争论和点击，可是和通知原文不符。 | “Ban” is harsher than “keep”, “parents furious” invents a clash, with an exclamation mark. Such headlines draw clicks and argument, but do not match the notice.
- 为了准确传达学校的规定 ~opposite
- 因为甲网站的记者看过通知原文 ~misread
?2 学校通知中“如有紧急情况，可用教室电话联系家长”一句有什么作用？ | What does the emergency clause do?
≈ 考虑到学生和家长的担心，说明规定周全，也说明手机保管不影响紧急联系 | 如有紧急情况，可用教室电话联系家长 | 为减少上课时手机对学习的干扰
- 说明学校的电话很多 ~misread
- 说明学校经常发生紧急情况 ~misread
?2 这组材料告诉我们，读新闻时应该注意什么？ | What does the set teach about reading news?
≈ 不能只看标题，要尽量找原始材料来核对 | 学校发布的通知原文节选 | 某中学禁止学生带手机，家长怒了！
% 两个标题说的是同一件事，却给人完全不同的印象。只有读了学校通知的原文，才知道哪个标题准确、哪个夸大。看新闻时，标题只是入口，要找到原始的材料来核对。 | Two headlines on one event give opposite impressions. Only the notice itself shows which is right. A headline is a door; check the source.
- 只要看标题就够了 ~opposite
- 网站上的新闻都是假的 ~broad

# 一场比赛的直播、新闻和评论
材料一（网络直播中的弹幕节选）：“裁判眼瞎了吧！”“这球明明出界了！”“主队必胜！”
材料二（体育新闻）：昨晚的比赛中，主队以二比一战胜客队。第七十分钟，主队一个进球引起争议，裁判观看录像后判定进球有效。
材料三（一位体育评论员的文章节选）：从录像看，那个球压在边线上，按照规则，压线就是界内，裁判的判罚是正确的。比赛中情绪激动可以理解，但对判罚有疑问，应当以规则和录像为依据，而不是靠喊。
?1 三则材料各属于什么类型的信息？有什么特点？ | What kind is each, and what marks it?
≈ 弹幕是观众的即时情绪表达，简短、情绪化；新闻客观报道比赛结果和过程；评论依据规则和录像分析判断 | 裁判眼瞎了吧！ | 主队以二比一战胜客队 | 按照规则，压线就是界内
- 三则材料都是客观报道 ~misread
- 三则材料都是个人情绪的表达 ~misread
?1 那个有争议的球到底有没有出界？依据是什么？ | Was the disputed ball out, and on what ground?
≈ 没有出界。录像显示球压在边线上，按规则压线就是界内 | 那个球压在边线上 | 按照规则，压线就是界内
- 出界了，因为弹幕里很多人这样说 ~misread
- 不能确定，因为没有人看过录像 ~opposite
?1 评论员对观众在弹幕中的表现持什么态度？ | What does the commentator think of the comments?
≈ 理解观众的激动情绪，但认为对判罚有疑问应当以规则和录像为依据 | 比赛中情绪激动可以理解 | 应当以规则和录像为依据，而不是靠喊
- 完全支持观众骂裁判 ~opposite
- 认为观众不应该看比赛 ~misread
?2 弹幕“这球明明出界了”说得很肯定，能不能作为判断的依据？ | Can the confident comment be relied on?
≈ 不能。弹幕是观众凭一时的印象说的，没有依据，而录像显示球压在线上 | 这球明明出界了！ | 从录像看，那个球压在边线上
% 弹幕用了“明明”，听起来很肯定，可这只是观众在比赛中一闪而过的印象。评论员看了录像，指出球“压在边线上”。说得肯定不等于说得对，判断要靠证据。 | “Clearly” sounds certain, but it is a passing impression in the heat of play. The commentator, with the replay, shows the ball on the line. Certainty is not truth; judgment needs evidence.
- 能，因为说的人很肯定 ~misread
- 能，因为说的人很多 ~misread
?2 体育新闻对争议进球的报道有什么特点？ | What marks the news report of the goal?
≈ 只交代事实：进球引起争议，裁判看录像后判定有效，不加评论 | 第七十分钟，主队一个进球引起争议 | 裁判观看录像后判定进球有效
- 新闻支持客队的说法 ~misread
- 新闻里有很多感叹句 ~misread
?2 从这组材料看，参与网络讨论时应该注意什么？ | What do they teach about joining online talk?
≈ 控制情绪，尊重他人，以事实和规则为依据发表意见 | 裁判眼瞎了吧！ | 应当以规则和录像为依据，而不是靠喊
- 想说什么就说什么，不用管别人 ~misread
- 不要参加任何网络讨论 ~broad

# 一种说法的来龙去脉
材料一（一篇流传的网文）：“研究发现：人一生只用了大脑的百分之十！只要开发剩下的百分之九十，人人都能成为天才！”
材料二（一本科普书的说明）：“人只用了百分之十的大脑”是一个流传了一百多年的说法，但没有科学依据。用仪器观察可以发现，人在一天中会用到大脑的几乎所有部分，只是不同的部分在不同的时候更活跃。
材料三（这篇网文的结尾）：“想开发大脑潜能？报名我们的课程，原价三千九，今天只要九百九！”
?1 材料一的说法是否可信？依据是什么？ | Is the first claim credible, and why?
≈ 不可信。科普书说明这一说法没有科学依据，人会用到大脑的几乎所有部分 | 但没有科学依据 | 人在一天中会用到大脑的几乎所有部分
- 可信，因为文中说是“研究发现” ~misread
- 可信，因为这个说法流传了一百多年 ~misread
?1 联系材料三，这篇网文写这个说法的目的是什么？ | Linked with the third, what is the article for?
≈ 用夸大的说法吸引读者，目的是推销自己的课程 | 报名我们的课程 | 原价三千九，今天只要九百九！
- 为了传播科学知识 ~opposite
- 为了介绍一项新的研究 ~misread
?1 材料二是怎样纠正这一说法的？ | How does the second correct it?
≈ 指出它没有科学依据，并用仪器观察的结果说明大脑的各部分都会用到 | 用仪器观察可以发现 | 只是不同的部分在不同的时候更活跃
- 说这一说法完全正确 ~opposite
- 只说它不对，没有给出理由 ~misread
?2 材料一用“研究发现”开头，有什么问题？ | What is wrong with opening on “research shows”?
≈ 没有说明是谁做的、在哪里发表的研究，借“研究”的名义增加说服力，却没有真实的出处 | 研究发现 | 是一个流传了一百多年的说法
% “研究发现”听起来很科学，可是网文没有说是谁研究的、什么时候、在哪里发表的。科普书又指出这是“流传了一百多年的说法”，并非新研究。打着研究的旗号却没有出处，是常见的误导手法。 | “Research shows” sounds scientific, but names no researcher, date or journal; the book shows it is a century-old saying, not new work. Borrowing research's name without a source is a common trick.
- 没有问题，研究的结果一定是对的 ~sound
- 问题在于研究的时间太早了 ~offpoint
?2 材料三揭示了网文和推销之间的什么关系？ | What link does the third reveal?
≈ 前面的“科学说法”是为后面的推销铺路，读者要警惕借知识之名做广告 | 想开发大脑潜能？报名我们的课程 | 只要开发剩下的百分之九十，人人都能成为天才！
- 两者没有关系 ~misread
- 说明这门课程很便宜，值得报名 ~misread
?2 这组材料对我们辨别网络信息有什么启示？ | What does the set teach about online information?
≈ 要追问说法的来源和依据，查找可靠的资料核对，还要注意信息背后的目的 | 但没有科学依据 | 报名我们的课程 | 研究发现
- 网上的“研究发现”都是真的 ~misread
- 只要价格便宜就可以相信 ~misread
`;
