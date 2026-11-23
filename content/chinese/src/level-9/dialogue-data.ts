// The dialogues of level 9 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 9, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
男：你这篇演讲稿写得太满了，每句话都想讲道理，听的人会累。
女：那你觉得该怎么改？
男：开门见山地把观点说出来，中间放一两个真实的小故事，最后用一句话画龙点睛就够了。
女：明白了，少讲道理，多讲故事。
问：男的认为这篇演讲稿有什么问题？
据：男的说“你这篇演讲稿写得太满了，每句话都想讲道理，听的人会累”。 | The man says the speech is overstuffed: every sentence lectures, and listeners will tire.
答：道理讲得太多
错：故事太多 | 故事是男的建议加的，稿子里缺的正是故事。 | Stories are what he wants added; the draft lacks them.
错：观点不清楚 | 他让她开门见山说观点，没有说观点不清楚。 | He wants the point stated up front, not that it is unclear.
错：结尾太长 | 他说最后一句话就够，没有说结尾长。 | He says one closing line suffices, not that the ending is long.
问：男的建议的结构是什么样的？
据：男的说“开门见山地把观点说出来，中间放一两个真实的小故事，最后用一句话画龙点睛”。 | The man says state the point at once, put one or two true stories in the middle, and finish with one telling line.
答：先说观点，中间讲故事，最后点题
错：先讲故事，最后再说观点 | 他说观点在开头，不是最后。 | He puts the point first, not last.
错：从头到尾都讲道理 | 讲道理太多正是他批评的。 | Lecturing throughout is what he criticises.
错：只讲一个长故事 | 他说一两个小故事，不是一个长故事。 | He says one or two short stories, not one long one.
问：女的最后是怎么理解男的的意见的？
据：女的说“明白了，少讲道理，多讲故事”。 | The woman says she sees: less lecturing, more stories.
答：少讲道理，多讲故事
错：多讲道理，少讲故事 | 正好说反了。 | That is the reverse.
错：把稿子写得更长 | 男的说写得太满，不是要更长。 | He says it is too full, not too short.
错：不用再修改了 | 她明白了要改，不是不用改。 | She sees it needs changing.

女：外国朋友问我"差点儿摔倒"和"差点儿没摔倒"有什么区别，我一下子竟然答不上来。
男：这正是汉语有意思的地方，两句话意思一样，都是没摔倒。母语的人用得很自然，可要讲清楚道理就不容易了。
问：关于那两句话，男的说了什么？
据：男的说“两句话意思一样，都是没摔倒”。 | The man says the two sentences mean the same: no fall.
答：意思相同，都是没摔倒
错：意思完全相反 | 他说意思一样，不是相反。 | He says the same, not opposite.
错：第二句是病句 | 他说母语的人用得很自然，不是病句。 | He says native speakers use it naturally, so it is not ungrammatical.
错：第一句表示摔倒了 | 他说两句都是没摔倒。 | He says both mean no fall.
问：男的认为这说明了什么？
据：男的说“母语的人用得很自然，可要讲清楚道理就不容易了”。会用和讲清楚是两回事。 | He says natives use it naturally, but explaining why is hard: using is not explaining.
答：会说不等于能讲清楚
错：外国人学不好汉语 | 他没有说外国人学不好。 | He does not say foreigners cannot learn.
错：汉语语法没有规律 | 他说这是汉语有意思的地方，没有说没规律。 | He calls it an interesting feature, not lawless.
错：女的汉语不好 | 他说母语的人讲不清楚很正常，不是女的汉语不好。 | He says natives often cannot explain it, not that her Chinese is poor.

男：我们领导说话特别喜欢绕弯子，一件小事能说半个小时。
女：也许他是怕直接说伤人，可是说得太含糊，大家反而不知道他到底要什么。
男：所以我现在开完会都会再找他确认一遍。
问：女的认为领导说话有什么问题？
据：女的说“说得太含糊，大家反而不知道他到底要什么”。 | The woman says he is so vague that people do not know what he wants.
答：说得太含糊，大家不明白
错：说话太直接，容易伤人 | 怕直接说伤人是女的猜的原因，他的问题正是不直接。 | Fear of bluntness is her guess at why; his fault is the opposite.
错：说话太快，听不清 | 他的问题是绕弯子，不是快。 | His fault is circling, not speed.
错：从来不开会 | 男的说开完会再找他确认，说明有会议。 | The man checks after meetings, so there are meetings.
问：男的是怎么应对的？
据：男的说“所以我现在开完会都会再找他确认一遍”。 | The man says he now checks with him after every meeting.
答：会后再找领导确认
错：不参加会议 | 他开完会去确认，说明他参加。 | He checks after meetings, so he attends.
错：直接批评领导 | 他是去确认，不是批评。 | He confirms, not criticises.
错：请同事转告 | 他自己去找领导，不是请同事。 | He goes himself.
问：男的对领导的说话方式是什么态度？
据：男的说领导“特别喜欢绕弯子，一件小事能说半个小时”，带着抱怨的口气。 | He says his boss loves to talk round things, half an hour on a trifle, in a complaining tone.
答：不太满意
错：很欣赏 | 他在抱怨，不是欣赏。 | He complains, not admires.
错：无所谓 | 他想了办法去确认，不是无所谓。 | He has a workaround, so he cares.
错：非常愤怒 | 他只是抱怨并想办法，没有到愤怒的程度。 | He grumbles and copes; he is not furious.

女：这次项目失败以后，老板马上加强了检查流程。
男：这叫亡羊补牢，虽然有损失，但以后不会再出同样的问题。
女：可惜要是早点儿重视，也不会有这次的损失。
男：话是这么说，可很多问题不出一次事，大家是意识不到的。
问：男的用"亡羊补牢"想说明什么？
据：男的说“这叫亡羊补牢，虽然有损失，但以后不会再出同样的问题”。出了事及时补救，还来得及防止下次。 | He says it is mending the pen after losing a sheep: a loss, but the same problem will not recur.
答：出了问题及时改正还来得及
错：失败是不可避免的 | 他说的是补救，没有说失败不可避免。 | He speaks of repair, not inevitability.
错：老板做得太晚了 | 觉得晚的是女的，男的说这样还来得及。 | It is the woman who finds it late; he says it is still worth it.
错：这次的损失太大了 | 他说“虽然有损失”，重点在后面的不再出问题。 | He grants the loss, but stresses no repeat.
问：女的觉得什么可惜？
据：女的说“可惜要是早点儿重视，也不会有这次的损失”。 | The woman says it is a pity they did not take it seriously earlier.
答：没有早点儿重视
错：老板没有加强检查 | 老板马上加强了检查。 | The boss did tighten checks.
错：项目没有完成 | 她可惜的是没早重视，没有说项目没完成。 | Her regret is late attention, not an unfinished project.
错：损失没有找回来 | 她没有说找回损失。 | She does not mention recovering losses.

男：你看小李，总是说别人的计划不行，可让他自己拿方案，他又拿不出来。
女：这种人就是眼高手低。不过他挑出的问题有时候还真有道理，我们也不能完全不听。
问：女的怎么评价小李？
据：女的说“这种人就是眼高手低。不过他挑出的问题有时候还真有道理”。 | The woman calls him all criticism and no ability, yet says his points are sometimes right.
答：要求高、能力不够，但有时说得对
错：能力很强，方案很多 | 男的说他拿不出方案。 | The man says he cannot produce a plan.
错：说的话完全没有道理 | 她说有时候还真有道理。 | She says he is sometimes right.
错：是一个很谦虚的人 | 总说别人不行，不是谦虚。 | Always finding fault is not modest.
问：女的对小李的意见是什么态度？
据：女的说“我们也不能完全不听”。有道理的可以听。 | The woman says they cannot ignore him entirely; the sound parts deserve a hearing.
答：有道理的部分可以听
错：完全不用理会 | 她说不能完全不听。 | She says not to ignore him wholly.
错：全部都要接受 | 她说“有时候”有道理，不是全部。 | She says sometimes, not always.
错：应该向领导反映 | 她没有说反映给领导。 | She does not mention telling the boss.

女：我读到一个故事：一个人站在河边，说"人不能两次踏进同一条河流"，你怎么理解？
男：我的理解是，河水一直在流，人也一直在变，世界上没有完全不变的东西。
女：那照这么说，我们今天做的决定，明天可能就不适用了？
男：可以这么说，所以做事情要根据情况的变化不断调整。
问：男的怎么理解那句话？
据：男的说“河水一直在流，人也一直在变，世界上没有完全不变的东西”。 | The man says the river flows and people change; nothing stays the same.
答：万物都在不断变化
错：人不应该去河边 | 去不去河边不是这句话的意思。 | The saying is not about avoiding rivers.
错：河水是静止的 | 他说河水一直在流。 | He says the water always flows.
错：人的想法永远不变 | 他说人也一直在变。 | He says people change too.
问：男的从中得出了什么结论？
据：男的说“所以做事情要根据情况的变化不断调整”。 | The man concludes one must keep adjusting as things change.
答：做事要随情况变化而调整
错：做决定要一次到位 | 他说要不断调整，不是一次到位。 | He says keep adjusting, not get it right once.
错：不要轻易改变决定 | 不断调整就是要改变。 | Adjusting means changing.
错：明天的事情不用考虑 | 他说今天的决定明天可能不适用，要考虑明天。 | He says decisions may not fit tomorrow, so tomorrow matters.

男：你说人是先有了思想才去行动，还是在行动中才形成了思想？
女：我觉得是互相影响的。没有想法就不会去做，可很多真正的认识是在做的过程中才得到的。
男：能举个例子吗？
女：比如学游泳，书上的道理看得再明白，也得下了水才真正懂。
问：女的的观点是什么？
据：女的说“我觉得是互相影响的”。 | The woman says they influence each other.
答：思想和行动是相互影响的
错：先有思想才有行动 | 她说没有想法不会去做，可认识也在做中得到，不是只有先思想。 | She says ideas drive action but understanding also comes from doing, so not thought first only.
错：行动比思想重要得多 | 她没有说哪个更重要，说的是互相影响。 | She does not rank them; they interact.
错：思想和行动没有关系 | 互相影响就是有关系。 | Interacting means related.
问：女的用学游泳想说明什么？
据：女的说“书上的道理看得再明白，也得下了水才真正懂”。真正的认识在实践中得到。 | She says however well one reads about it, one truly understands only in the water: understanding comes from practice.
答：真正的认识要在实践中得到
错：游泳比看书重要 | 她是举例说明认识，不是比较游泳和看书。 | She gives an example about understanding, not ranking swimming over books.
错：学游泳非常难 | 她没有说游泳难。 | She does not say swimming is hard.
错：看书不能学会任何东西 | 她说书上的道理能看明白，只是不够。 | She grants books teach something, just not enough.

女：你发现没有，小王最近说话特别冲，一点儿小事就发脾气。
男：他母亲住院了，他白天上班，晚上去医院陪护，压力太大了。
女：原来是这样，我还以为他对我有意见呢。那我们这几天多帮他分担点儿工作吧。
问：小王最近为什么爱发脾气？
据：男的说“他母亲住院了，他白天上班，晚上去医院陪护，压力太大了”。 | The man says his mother is in hospital; he works by day and sits with her at night, under great strain.
答：母亲住院，压力太大
错：对女的有意见 | 女的“还以为”他对她有意见，原来不是。 | She thought he had a grudge, but was wrong.
错：工作做得不好 | 对话没有说工作做得不好。 | Poor work is never mentioned.
错：被领导批评了 | 对话没有说领导批评。 | No criticism from a boss is mentioned.
问：女的原来以为是什么原因？
据：女的说“我还以为他对我有意见呢”。 | The woman says she thought he had a grudge against her.
答：小王对她有意见
错：小王身体不舒服 | 她没有说他身体不舒服。 | She did not think he was ill.
错：小王工作太忙 | 她没有说他太忙。 | She did not think he was overworked.
错：小王家里出了事 | 家里出事是男的告诉她的真正原因，不是她原来以为的。 | Trouble at home is what the man reveals, not what she assumed.
问：女的打算怎么做？
据：女的说“那我们这几天多帮他分担点儿工作吧”。 | The woman says they should take on more of his work these days.
答：帮小王分担工作
错：找小王谈一谈 | 她没有说找他谈。 | She does not suggest a talk.
错：去医院看小王母亲 | 她没有说去医院。 | She does not mention visiting.
错：向领导反映 | 她没有说反映。 | She does not mention telling a boss.

男：我发现性格内向的人做事反而更专注，不容易被打扰。
女：是有这种倾向，但也不能一概而论。性格不决定一个人能不能成功，关键是能不能发挥自己的长处。
问：女的对男的的话是什么态度？
据：女的说“是有这种倾向，但也不能一概而论”。 | The woman says there is such a tendency, but one cannot generalise.
答：部分同意，但认为不能一概而论
错：完全同意 | 她说“但也不能一概而论”，不是完全同意。 | She adds "but", so not full agreement.
错：完全反对 | 她说“是有这种倾向”，不是完全反对。 | She grants a tendency, so not full rejection.
错：不感兴趣 | 她认真地回答了，不是不感兴趣。 | She engages, so she is interested.
问：女的认为成功的关键是什么？
据：女的说“关键是能不能发挥自己的长处”。 | The woman says the key is using one's strengths.
答：发挥自己的长处
错：性格外向 | 她说性格不决定成功。 | She says personality does not decide success.
错：性格内向 | 她说性格不决定成功，内向也一样。 | She says personality does not decide it, introverts included.
错：做事专注 | 专注是男的说的内向的人的特点，不是她说的关键。 | Focus is the man's point about introverts, not her key.

女：今晚有流星雨，我们去郊外看吧，城里灯光太亮，什么都看不见。
男：好啊，不过天气预报说后半夜有云，我们得早点儿出发，最好十点前到。
女：那我准备点儿吃的和厚衣服，郊外晚上肯定冷。
男：再带上望远镜吧，不过看流星其实用眼睛就够了。
问：他们为什么要去郊外？
据：女的说“城里灯光太亮，什么都看不见”。 | The woman says the city lights are too bright to see anything.
答：城里灯光太亮看不清
错：郊外的流星雨更多 | 她没有说郊外流星更多。 | She does not say more meteors fall there.
错：城里在下雨 | 对话没有说城里下雨。 | Rain in the city is never mentioned.
错：郊外有天文台 | 对话没有说天文台。 | An observatory is never mentioned.
问：男的为什么建议早点儿出发？
据：男的说“天气预报说后半夜有云，我们得早点儿出发”。 | The man says clouds are forecast after midnight, so they must leave early.
答：后半夜可能有云
错：路上会堵车 | 他没有说堵车。 | He does not mention traffic.
错：流星雨十点就结束 | 十点是他想到达的时间，不是流星雨结束的时间。 | Ten is when he wants to arrive, not when the shower ends.
错：郊外晚上很冷 | 冷是女的说的，要带厚衣服，不是早出发的原因。 | The cold is her point, about warm clothes, not his reason to leave early.
问：女的打算准备什么？
据：女的说“那我准备点儿吃的和厚衣服”。 | The woman says she will bring food and warm clothes.
答：吃的和厚衣服
错：望远镜 | 望远镜是男的说要带的。 | The telescope is the man's suggestion.
错：热水 | 她没有说热水。 | She does not mention hot water.
错：照相机 | 她没有说照相机。 | She does not mention a camera.

男：科学家又发现了一颗可能适合生命存在的行星，离我们只有四十光年。
女：四十光年听起来不远，可就算用现在最快的飞船，也得飞几十万年。
男：所以我们短期内是去不了的，但至少知道宇宙里我们可能并不孤单。
问：女的的话是什么意思？
据：女的说“四十光年听起来不远，可就算用现在最快的飞船，也得飞几十万年”。实际上非常远。 | She says forty light years sounds near, yet the fastest craft would take hundreds of thousands of years: it is very far.
答：那颗行星其实非常遥远
错：那颗行星离地球很近 | 她说“听起来不远”，接着用“可”说明其实很远。 | She says it sounds near, then 可 shows it is far.
错：现在就可以飞过去 | 要飞几十万年，现在去不了。 | Hundreds of thousands of years means it cannot be reached now.
错：那颗行星上一定有生命 | 男的说“可能”适合生命，没有说一定有。 | The man says possibly suitable for life, not certainly inhabited.
问：男的认为这个发现有什么意义？
据：男的说“至少知道宇宙里我们可能并不孤单”。 | The man says at least we know we may not be alone.
答：说明宇宙中可能还有别的生命
错：人类很快可以移居那里 | 他说短期内去不了。 | He says we cannot go soon.
错：可以找到新的能源 | 他没有说能源。 | He does not mention energy.
错：证明地球是唯一有生命的地方 | 他说我们可能不孤单，正好相反。 | He says we may not be alone, the opposite.

女：我一直以为太阳是不动的，原来它也在绕着银河系的中心转。
男：对，宇宙里几乎没有静止的东西。我们站着不动，其实也跟着地球、太阳在高速运动。
问：女的原来以为什么？
据：女的说“我一直以为太阳是不动的”。 | The woman says she always thought the sun did not move.
答：太阳是不动的
错：地球是不动的 | 她说的是太阳，不是地球。 | She says the sun, not the Earth.
错：银河系是不动的 | 她说的是太阳，不是银河系。 | She says the sun, not the galaxy.
错：太阳绕着地球转 | 她说的是太阳不动，不是绕地球转。 | She thought the sun was still, not circling the Earth.
问：男的想说明什么？
据：男的说“宇宙里几乎没有静止的东西”。 | The man says almost nothing in the universe is still.
答：宇宙里几乎一切都在运动
错：太阳是宇宙的中心 | 他说太阳也在绕银河系中心转，不是中心。 | He says the sun itself circles the galactic centre.
错：人站着时没有运动 | 他说我们站着不动其实也在高速运动。 | He says even standing still we move fast.
错：地球比太阳转得快 | 他没有比较地球和太阳的速度。 | He does not compare speeds.

男：你们实验室研究的那种小鱼，为什么能让断了的心脏组织重新长出来？
女：这正是我们想弄明白的。如果能找到起作用的基因，将来也许能帮助心脏病人恢复。
男：这离用到人身上还有多远？
女：说实话，还很远，至少要十几年。基础研究就是这样，急不得。
问：女的的研究目的是什么？
据：女的说“如果能找到起作用的基因，将来也许能帮助心脏病人恢复”。 | The woman says they hope to find the gene at work, which might one day help heart patients recover.
答：找到让心脏组织再生的基因
错：培养新品种的鱼 | 她研究的是基因，不是培养新鱼。 | She studies genes, not breeding.
错：治好所有心脏病 | 她说“也许能帮助”，不是治好所有心脏病。 | She says might help, not cure all.
错：证明鱼比人聪明 | 她没有比较鱼和人的聪明。 | She does not compare intelligence.
问：女的对研究成果用到人身上是什么看法？
据：女的说“还很远，至少要十几年”。 | The woman says it is still far off, at least ten-odd years.
答：还需要很长时间
错：明年就能实现 | 她说至少十几年，不是明年。 | She says at least ten years, not next year.
错：永远不可能 | 她说还很远，没有说不可能。 | She says far off, not impossible.
错：已经开始用了 | 她说还很远，还没有用。 | She says far off, so not in use.
问：女的的实验室研究的是什么？
据：男的问“你们实验室研究的那种小鱼”，女的接着回答。 | The man asks about the small fish her lab studies, and she replies.
答：一种小鱼
错：黑猩猩 | 黑猩猩是别的对话里的。 | Chimpanzees are not in this dialogue.
错：老鼠 | 对话没有说老鼠。 | Mice are never mentioned.
错：人的心脏 | 人的心脏是将来可能帮助的对象，不是研究的东西。 | Human hearts are a hoped-for use, not the subject.

女：都说人和黑猩猩的基因有百分之九十八以上是相同的，那差别到底在哪儿？
男：关键不是有多少基因不同，而是基因什么时候、在哪里起作用。就像同样的乐器，演奏的方式不一样，曲子就完全不同。
问：男的认为人和黑猩猩的差别关键在哪里？
据：男的说“关键不是有多少基因不同，而是基因什么时候、在哪里起作用”。 | The man says the key is not how many genes differ, but when and where genes act.
答：基因发挥作用的时间和位置
错：不同基因的数量很多 | 他说关键“不是有多少基因不同”。 | He says it is not the number of differing genes.
错：人的基因比黑猩猩多 | 他没有说人的基因更多。 | He does not say humans have more.
错：两者没有本质差别 | 他说曲子完全不同，有本质差别。 | He says the tunes differ completely.
问：男的用乐器打比方，想说明什么？
据：男的说“同样的乐器，演奏的方式不一样，曲子就完全不同”。基础相同，用法不同，结果不同。 | He says the same instruments played differently make wholly different music: same base, different results.
答：同样的基础可以产生不同的结果
错：人和黑猩猩都喜欢音乐 | 打比方不是说喜欢音乐。 | The analogy is not about liking music.
错：乐器越多曲子越好 | 他说的是同样的乐器，不是更多。 | He says the same instruments, not more.
错：基因和音乐没有关系 | 他用乐器正是为了说明基因。 | He uses instruments precisely to explain genes.
`,
  },
  {
    unit: 12,
    data: `
女：我们市和那座海滨城市结为友好城市已经二十年了，今年要办一系列纪念活动。
男：除了官方互访，我觉得更应该多搞些民间交流，比如中学生互换、艺术家驻留，这样的联系才扎实。
女：我们正在策划一个交换生项目，明年夏天第一批学生就过去。
问：男的认为什么样的交流更扎实？
据：男的说“更应该多搞些民间交流……这样的联系才扎实”。 | The man says more grassroots exchange makes the bond solid.
答：民间的交流
错：官方的互访 | 他说“除了官方互访”，更应该民间交流。 | He says besides official visits, more grassroots exchange.
错：经济上的合作 | 他没有说经济。 | He does not mention the economy.
错：纪念活动 | 纪念活动是女的说今年要办的。 | Commemorations are her plan for this year.
问：明年夏天会有什么安排？
据：女的说“明年夏天第一批学生就过去”。 | The woman says the first group of students goes next summer.
答：第一批交换生出发
错：两市领导互访 | 互访是官方的，没有说明年夏天。 | Official visits are not tied to next summer.
错：举办二十周年庆典 | 纪念活动是今年办的。 | The commemorations are this year.
错：艺术家来访 | 艺术家驻留是男的的建议，没有说明年。 | Artist residencies are his idea, not scheduled.
问：两座城市结为友好城市多久了？
据：女的说“已经二十年了”。 | The woman says it has been twenty years.
答：二十年
错：十年 | 她说的是二十年，不是十年。 | She says twenty, not ten.
错：两年 | 她说的是二十年，不是两年。 | She says twenty, not two.
错：三十年 | 她说的是二十年，不是三十年。 | She says twenty, not thirty.

男：这次国际救援队在地震灾区工作了整整十天，从废墟里救出了好几个人。
女：真了不起。我听说队员们来自不同国家，语言都不通，配合起来却很默契。
男：他们平时就按统一的标准训练，一个手势大家都明白。
问：救援队员为什么能默契配合？
据：男的说“他们平时就按统一的标准训练，一个手势大家都明白”。 | The man says they train to a common standard, so a single gesture is understood.
答：平时按统一标准训练
错：他们都说同一种语言 | 女的说他们“语言都不通”。 | She says they share no language.
错：他们来自同一个国家 | 女的说他们“来自不同国家”。 | She says they come from different countries.
错：现场有很多翻译 | 他们靠的是手势，没有说翻译。 | They rely on gestures; no interpreters are mentioned.
问：关于这次救援，可以知道什么？
据：男的说救援队“在地震灾区工作了整整十天”。 | The man says the team worked ten full days in the quake zone.
答：救援队在灾区工作了十天
错：救援队只工作了一天 | 是十天，不是一天。 | Ten days, not one.
错：没有救出任何人 | 男的说救出了好几个人。 | He says several were rescued.
错：队员们互相不配合 | 女的说配合起来很默契。 | She says they worked in harmony.

女：现在去很多国家都免签了，说走就走，太方便了。
男：方便是方便，不过免签不等于什么都不用准备，入境时还是可能被问住几天、住在哪儿、带了多少钱。
问：男的提醒女的注意什么？
据：男的说“免签不等于什么都不用准备，入境时还是可能被问”。 | The man says visa-free does not mean no preparation; one may still be questioned at entry.
答：免签也要做好入境准备
错：免签国家很少 | 女的说“很多国家”免签。 | She says many countries waive visas.
错：出国一定要办签证 | 他说的是免签也要准备，不是一定办签证。 | He says prepare even without a visa, not that one must get one.
错：入境不会被提问 | 他说入境时可能被问。 | He says one may be questioned.
问：女的为什么觉得出国方便了？
据：女的说“现在去很多国家都免签了，说走就走”。 | The woman says many countries are now visa-free, so one can just go.
答：很多国家免签了
错：机票便宜了 | 她没有说机票。 | She does not mention fares.
错：签证办得更快了 | 她说的是免签，不用办，不是办得快。 | She says no visa needed, not faster visas.
错：不用带证件了 | 男的说入境要被问，证件还是要带。 | The man says you are questioned at entry, so documents still matter.

男：气候变化的会议又开完了，各国都说要减排，可真正做到的有多少？
女：承诺和行动之间确实有差距，但有了共同的目标，至少各国在互相监督，这总比各干各的强。
男：你还挺乐观。
女：不是乐观，是现实。这类问题没有哪个国家能单独解决。
问：男的对减排承诺是什么态度？
据：男的说“各国都说要减排，可真正做到的有多少”。反问表示怀疑。 | He asks how many actually deliver; the rhetorical question shows doubt.
答：怀疑能否真正落实
错：非常乐观 | 乐观是他说女的，不是他自己。 | Optimism is what he calls her, not himself.
错：完全支持 | 他怀疑落实，不是完全支持。 | He doubts delivery, so not full support.
错：毫不关心 | 他在关心结果，不是不关心。 | He cares about results.
问：女的认为共同目标的意义是什么？
据：女的说“有了共同的目标，至少各国在互相监督”。 | The woman says a shared goal at least means countries watch one another.
答：各国可以互相监督
错：问题马上就能解决 | 她承认承诺和行动有差距，没有说马上解决。 | She admits a gap, not quick solutions.
错：每个国家都能做到 | 她承认有差距，不是都能做到。 | She admits a gap, so not all deliver.
错：可以不用行动了 | 她说要监督行动，不是不用行动。 | She stresses watching for action.
问：女的最后强调的是什么？
据：女的最后说“这类问题没有哪个国家能单独解决”。 | The woman ends by saying no country can solve this alone.
答：这类问题需要各国共同解决
错：她对未来很乐观 | 她说“不是乐观，是现实”。 | She says it is realism, not optimism.
错：有些国家可以单独解决 | 她说没有哪个国家能单独解决。 | She says none can do it alone.
错：承诺比行动更重要 | 她承认承诺和行动有差距，没有说承诺更重要。 | She notes the gap; she does not rank promises above action.

女：现在人人都能做自媒体，新闻的门槛越来越低了。
男：门槛低了，信息多了，可真假也更难分了。以前一条新闻要经过采访、核实、编辑好几道关。
女：那你觉得传统媒体还有优势吗？
男：当然，越是信息多，大家越需要一个靠得住的来源。
问：男的认为自媒体带来了什么问题？
据：男的说“门槛低了，信息多了，可真假也更难分了”。 | The man says lower barriers mean more information but harder to tell true from false.
答：信息真假难辨
错：信息太少 | 他说信息多了，不是少。 | He says more, not less.
错：新闻太贵 | 他没有说贵。 | He does not mention cost.
错：没有人看新闻 | 他没有说没人看。 | He does not say no one reads it.
问：男的认为传统媒体的优势是什么？
据：男的说“越是信息多，大家越需要一个靠得住的来源”。 | The man says the more information there is, the more people need a reliable source.
答：信息可靠
错：速度更快 | 他没有说速度。 | He does not mention speed.
错：门槛更低 | 门槛低是自媒体的特点。 | Low barriers belong to self-media.
错：内容更有趣 | 他没有说有趣。 | He does not mention entertainment.
问：男的说以前一条新闻要经过哪些环节？
据：男的说“以前一条新闻要经过采访、核实、编辑好几道关”。 | The man says a news item used to pass interviewing, checking and editing.
答：采访、核实、编辑
错：拍摄、剪辑、发布 | 他没有说拍摄、剪辑。 | He does not mention filming or cutting.
错：投稿、评论、转发 | 他没有说投稿、转发。 | He does not mention submission or sharing.
错：采访、拍照、发布 | 中间是核实，不是拍照。 | The middle step is checking, not photography.

男：这条短视频播放量过千万了，可内容其实没什么营养。
女：现在算法就是这样，谁能在前三秒抓住人，谁就能火。长久下去，大家的耐心都被磨没了。
问：女的担心什么？
据：女的说“长久下去，大家的耐心都被磨没了”。 | The woman says in the long run everyone's patience is worn away.
答：人们越来越没有耐心
错：短视频播放量太低 | 播放量过千万，不低。 | Ten million views is not low.
错：算法推荐不准确 | 她说算法“就是这样”，没有说不准。 | She describes how the algorithm works, not that it errs.
错：视频内容太长 | 她说的是前三秒，视频不长。 | She speaks of the first three seconds, not long videos.
问：女的认为什么样的视频容易火？
据：女的说“谁能在前三秒抓住人，谁就能火”。 | The woman says whoever grips viewers in three seconds goes viral.
答：一开始就能吸引人的
错：内容有营养的 | 男的说火的视频没什么营养。 | The man says the viral one has little substance.
错：时间很长的 | 她说前三秒，不是长视频。 | She says three seconds, not length.
错：经过认真核实的 | 核实是男的说新闻的，不是女的说的火的原因。 | Checking is the man's point about news, not her reason for virality.

女：老城区改造，你们设计院是打算全部推倒重建吗？
男：不是，我们的思路是"微更新"。有价值的老房子保留下来，加固改造，只把危房换掉，街道的格局不变。
女：那居民要搬走吗？
男：大部分不用，工程分片进行，住户可以就近临时安置，完工后再搬回来。
问：男的说的"微更新"是什么意思？
据：男的说“有价值的老房子保留下来，加固改造，只把危房换掉，街道的格局不变”。 | The man says valuable old houses are kept and reinforced, only unsafe ones replaced, and the street plan kept.
答：保留有价值的老房，只换危房
错：把老城区全部推倒重建 | 女的问是不是全部推倒，男的说“不是”。 | Asked about total rebuilding, he says no.
错：只修街道，不动房子 | 房子要加固改造，危房要换，不是不动房子。 | Houses are reinforced and unsafe ones replaced, so they are touched.
错：把居民全部迁到新区 | 大部分居民不用搬走。 | Most residents need not move.
问：改造期间，大部分居民怎么安排？
据：男的说“住户可以就近临时安置，完工后再搬回来”。 | The man says residents are housed nearby temporarily and return when done.
答：就近临时安置，完工后回来
错：永久搬到新区 | 是临时的，完工后搬回来。 | It is temporary; they come back.
错：住在工地里 | 工程分片进行，住户临时安置在附近，不住工地。 | Work goes by sections; residents are housed nearby, not on site.
错：自己找地方住 | 男的说是就近安置，不是自己找。 | He says they are housed nearby, not left to find places.

男：这栋楼外形很特别，可里面的人都说不好用，走廊太长，采光也差。
女：建筑不是雕塑，光好看不行。好的设计应该从使用的人出发，而不是只想着拍出来好看。
问：女的认为好的建筑设计应该怎么样？
据：女的说“好的设计应该从使用的人出发，而不是只想着拍出来好看”。 | The woman says good design starts from users, not from photographing well.
答：从使用者的需要出发
错：外形越特别越好 | 她说光好看不行。 | She says looks alone are not enough.
错：拍照一定要好看 | 她说不是只想着拍出来好看。 | She says not just for photos.
错：走廊要设计得长 | 走廊太长是这栋楼的毛病。 | Long corridors are this building's flaw.
问：关于这栋楼，可以知道什么？
据：男的说“这栋楼外形很特别，可里面的人都说不好用”。 | The man says the building looks striking but its users say it works badly.
答：外形特别，但不好用
错：外形普通，但很实用 | 外形很特别，不普通，也不实用。 | It looks striking, not plain, and is not practical.
错：采光非常好 | 男的说“采光也差”。 | He says the light is poor.
错：大家都很喜欢 | 里面的人都说不好用。 | Its users say it works badly.

女：您做了五十年的木工，现在还有年轻人跟您学吗？
男：少了。这门手艺辛苦，挣得也不多，年轻人坐不住。不过去年来了两个大学生，说想把传统做法和现代设计结合起来。
女：那您愿意教他们吗？
男：当然愿意，只要肯学，我把压箱底的本事都拿出来。
问：为什么跟男的学手艺的年轻人少了？
据：男的说“这门手艺辛苦，挣得也不多，年轻人坐不住”。 | The man says the craft is hard and pays little, and the young lack patience.
答：手艺辛苦，收入不高
错：男的不愿意教 | 他说“当然愿意”教。 | He says he is glad to teach.
错：年轻人都在上大学 | 大学生也来学了，上大学不是原因。 | University students came, so study is not the reason.
错：木工已经没人需要了 | 他没有说没人需要木工。 | He does not say no one needs carpentry.
问：那两个大学生想做什么？
据：男的说大学生“说想把传统做法和现代设计结合起来”。 | The man says the students want to combine traditional methods with modern design.
答：把传统做法和现代设计结合
错：开一家家具店 | 对话没有说开店。 | Opening a shop is never mentioned.
错：写一本关于木工的书 | 对话没有说写书。 | Writing a book is never mentioned.
错：拍一部纪录片 | 对话没有说拍纪录片。 | Filming is never mentioned.
问：男的对教这两个大学生是什么态度？
据：男的说“当然愿意，只要肯学，我把压箱底的本事都拿出来”。 | The man says of course, if they will learn he will share every last secret.
答：非常愿意倾囊相授
错：有些不情愿 | 他说“当然愿意”。 | He says of course.
错：要求他们先交学费 | 他没有说学费。 | He does not mention fees.
错：只教一些简单的 | 他说把压箱底的本事都拿出来，不只教简单的。 | He will share his best skills, not just basics.

男：我们老家正月十五有舞龙的习俗，以前全村人都参加，现在年轻人都在外地，舞龙的人都凑不齐了。
女：我们那儿也有类似的情况。后来村里把舞龙改到春节期间，大家都回来了，反而比以前更热闹。
问：女的家乡是怎么解决这个问题的？
据：女的说“后来村里把舞龙改到春节期间，大家都回来了”。 | The woman says the village moved the dragon dance to Spring Festival, when everyone is home.
答：把舞龙改到春节期间
错：请外地人来舞龙 | 她没有说请外地人。 | She does not mention outsiders.
错：取消了舞龙 | 舞龙改了时间，没有取消。 | It was moved, not cancelled.
错：让老人来舞龙 | 她没有说老人来舞。 | She does not mention the elderly dancing.
问：男的的家乡遇到了什么问题？
据：男的说“现在年轻人都在外地，舞龙的人都凑不齐了”。 | The man says the young are away, so there are not enough dancers.
答：年轻人不在家，人凑不齐
错：舞龙的道具坏了 | 对话没有说道具。 | Props are never mentioned.
错：大家不喜欢舞龙了 | 以前全村人都参加，是人不在，不是不喜欢。 | The whole village used to join; people are away, not unwilling.
错：没有地方舞龙 | 对话没有说场地。 | A venue is never mentioned.

女：这场比赛我们队一直领先，最后五分钟却被对方连追三个球，太可惜了。
男：体能是一个原因，但我觉得更大的问题是心态，领先以后就只想守，不敢进攻了。
女：教练赛后也说了，要学会在领先的时候保持压力。
问：男的认为输球的主要原因是什么？
据：男的说“更大的问题是心态，领先以后就只想守，不敢进攻了”。 | The man says the bigger problem was mindset: once ahead, they only defended.
答：领先后心态保守
错：体能完全不足 | 他说体能“是一个原因”，不是主要的，也不是完全不足。 | He calls fitness one factor, not the main one, nor wholly lacking.
错：裁判判罚不公 | 他没有说裁判。 | He does not mention the referee.
错：对方实力太强 | 他们一直领先，对方不是实力太强。 | They led throughout, so the opponents were not overwhelming.
问：教练赛后强调了什么？
据：女的说“教练赛后也说了，要学会在领先的时候保持压力”。 | The woman says the coach said they must keep up pressure when ahead.
答：领先时也要保持进攻压力
错：要加强体能训练 | 体能是男的提到的一个原因，不是教练强调的。 | Fitness is the man's side note, not the coach's point.
错：要换掉几名队员 | 对话没有说换人。 | Substitutions are never mentioned.
错：比赛结果不重要 | 她说太可惜了，结果重要。 | She calls it a shame, so the result matters.

男：你跑马拉松这么多年，成绩还能提高吗？
女：成绩已经很难再进步了。现在跑步对我来说更多是一种生活方式，跑完那种平静的感觉，比拿名次更让我享受。
问：女的现在跑步主要是为了什么？
据：女的说“跑完那种平静的感觉，比拿名次更让我享受”。 | The woman says the calm after a run pleases her more than placing.
答：享受跑步带来的平静
错：拿更好的名次 | 她说平静比名次更享受。 | She prefers calm to placings.
错：提高比赛成绩 | 她说成绩已经很难进步了。 | She says her times can hardly improve.
错：参加国际比赛 | 对话没有说国际比赛。 | International races are never mentioned.
问：女的对自己的成绩是什么看法？
据：女的说“成绩已经很难再进步了”。 | The woman says her times can hardly improve now.
答：已经很难再进步
错：还能大幅提高 | 她说很难再进步，不是大幅提高。 | She says hardly any gain, not big gains.
错：比以前差了很多 | 她说难进步，没有说变差。 | She says hard to improve, not worse.
错：明年一定能进步 | 她说很难进步，不会说一定能进步。 | She says hard to improve, so no promise.

女：这份请示报告我改了三遍，领导还是说不行。
男：我看看。你前面写了一大段背景，真正要请示的事情放在最后，领导读到一半就不耐烦了。公文最重要的是开门见山。
女：那我把请示事项放到第一段，背景压缩成两三句。
问：男的认为这份报告的问题是什么？
据：男的说“你前面写了一大段背景，真正要请示的事情放在最后”。 | The man says she opened with a long background and put the actual request last.
答：重点放得太靠后
错：内容太短 | 前面有一大段背景，不短。 | A long background means it is not short.
错：用词不正式 | 他没有说用词。 | He does not mention word choice.
错：格式有错误 | 他没有说格式。 | He does not mention format.
问：女的打算怎么修改？
据：女的说“我把请示事项放到第一段，背景压缩成两三句”。 | The woman will put the request first and cut the background to two or three lines.
答：先写请示事项，压缩背景
错：增加更多背景材料 | 她要压缩背景，不是增加。 | She will cut the background, not add.
错：换一个题目 | 她没有说换题目。 | She does not mention the title.
错：请男的帮她重写 | 她自己改，不是请男的。 | She will revise it herself.

男：这封邀请函是发给外宾的，称呼和落款你都核对过了吗？
女：核对过了，日期和地点也确认了两遍。就是开头那句客套话，我拿不准该写得正式一点还是亲切一点。
男：第一次邀请，还是正式一点比较稳妥。
问：女的拿不准的是什么？
据：女的说“就是开头那句客套话，我拿不准该写得正式一点还是亲切一点”。 | The woman says only the opening courtesy line: she is unsure whether to be formal or warm.
答：开头客套话的语气
错：活动的日期 | 她说日期确认了两遍。 | She says the date was checked twice.
错：活动的地点 | 她说地点也确认了两遍。 | She says the place was checked twice.
错：外宾的称呼 | 称呼她已经核对过了。 | The form of address is checked.
问：男的给了什么建议？
据：男的说“第一次邀请，还是正式一点比较稳妥”。 | The man says for a first invitation, formal is safer.
答：写得正式一些
错：写得亲切一些 | 他说正式一点，不是亲切。 | He says formal, not warm.
错：不写客套话 | 他没有说不写客套话。 | He does not say drop the line.
错：让外宾自己决定 | 他自己给了建议，不是让外宾决定。 | He gives advice himself.
问：女的已经核对了哪些内容？
据：男的问称呼和落款核对过了吗，女的说“核对过了，日期和地点也确认了两遍”。 | Asked about the address and signature, she says they are checked, and the date and place confirmed twice.
答：称呼、落款、日期和地点
错：只核对了日期 | 她还核对了称呼、落款和地点，不只日期。 | She checked the address, signature and place too, not just the date.
错：还什么都没核对 | 她说核对过了。 | She says they are checked.
错：只核对了客套话 | 客套话正是她还拿不准的。 | The courtesy line is what she is still unsure of.
`,
  },
];
