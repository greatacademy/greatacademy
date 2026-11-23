// The dialogues of level 8 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 8, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
女：我们小区好几位孤寡老人，平时连个说话的人都没有，我想发起一个结对帮扶的活动。
男：好主意。不过光靠热心不够，得有固定的人、固定的时间，不然坚持不了多久。
女：我打算先挨家挨户问问，看有多少邻居愿意参加，再排一个表。
男：我先报个名，每周六下午我都有空。
问：女的想发起什么活动？
据：女的说“我想发起一个结对帮扶的活动”，帮的是小区里没人说话的孤寡老人。 | The woman wants to start a pairing scheme to support the lonely elderly in the estate.
答：让邻居和孤寡老人结对帮扶
错：给老人捐款捐物 | 她说的是结对帮扶，陪老人说话，没有说捐款捐物。 | She means pairing people up to keep them company, not donations.
错：组织老人外出旅游 | 对话没有说旅游。 | Travel is never mentioned.
错：建一个社区养老院 | 她是让邻居结对，不是建养老院。 | She pairs neighbours with them, not builds a home.
问：男的认为这类活动要注意什么？
据：男的说“光靠热心不够，得有固定的人、固定的时间，不然坚持不了多久”。 | The man says goodwill is not enough; it needs fixed people and fixed times or it will not last.
答：要有固定的人和时间
错：要有足够的经费 | 他没有说经费。 | He does not mention funds.
错：要请专业的护工 | 他没有说护工。 | He does not mention professional carers.
错：要先征得政府同意 | 他没有说政府。 | He does not mention the government.
问：男的打算怎么做？
据：男的说“我先报个名，每周六下午我都有空”。 | The man signs up first and says he is free every Saturday afternoon.
答：报名每周六下午去帮忙
错：负责挨家挨户去问 | 挨家挨户问是女的的打算。 | Going door to door is the woman's plan.
错：帮女的排时间表 | 排表也是女的说要做的。 | Drawing up the rota is also hers.
错：劝女的不要做 | 他说“好主意”，还报了名，不是劝她别做。 | He calls it a good idea and signs up.

男：你听说了吗？昨天有人在小区高空抛物，差点儿砸到一个孩子。
女：太可怕了！这已经不是不文明的问题，而是违法了。物业应该尽快装摄像头，把人找出来。
问：女的认为这件事的性质是什么？
据：女的说“这已经不是不文明的问题，而是违法了”。 | The woman says this is no longer just bad manners but against the law.
答：已经违法，不只是不文明
错：只是一般的不文明行为 | 她说“已经不是不文明的问题”。 | She says it is no longer a matter of manners.
错：是物业的责任 | 她说物业应该装摄像头，可是没有说这件事是物业的责任。 | She wants management to install cameras, but does not blame them for the act.
错：孩子自己不小心 | 男的说差点儿砸到孩子，孩子是受害的一方。 | The child was nearly hit, a victim, not careless.
问：女的建议物业做什么？
据：女的说“物业应该尽快装摄像头，把人找出来”。 | The woman says management should quickly install cameras and find the person.
答：装摄像头找出抛物的人
错：给孩子的家人道歉 | 她没有说道歉。 | She does not mention an apology.
错：禁止孩子在楼下玩 | 她要找出扔东西的人，不是限制孩子。 | She wants the thrower found, not children restricted.
错：召开业主大会 | 她没有说开业主大会。 | She does not mention an owners' meeting.

女：现在网络暴力越来越严重，有的人只因为说错一句话，就被骂了好几天。
男：隔着屏幕，很多人说话就不负责任了。平台应该承担起管理的责任。
女：我倒觉得每个人也该反思，转发和评论之前先想一想，自己是不是了解事情的全部。
问：男的认为谁应该负起管理责任？
据：男的说“平台应该承担起管理的责任”。 | The man says the platforms should take responsibility for management.
答：网络平台
错：被骂的人 | 被骂的人是受害者，男的没有说他们要负责。 | Those attacked are victims; he does not blame them.
错：政府部门 | 他说的是平台，不是政府。 | He says platforms, not government.
错：每个网友 | 每个人要反思是女的补充的看法。 | Everyone reflecting is the woman's addition.
问：女的强调的是什么？
据：女的说“每个人也该反思，转发和评论之前先想一想”。 | The woman says everyone should reflect and think before sharing or commenting.
答：每个人发言前都应该先想清楚
错：平台应该关闭评论 | 她没有说关闭评论。 | She does not say close comments.
错：被骂的人应该离开网络 | 她没有说被骂的人要离开网络。 | She does not tell victims to leave.
错：网络暴力不算严重 | 她一开始就说网络暴力“越来越严重”。 | She opens by saying it is getting worse.
问：女的对男的的说法是什么态度？
据：男的说平台负责，女的说“我倒觉得每个人也该反思”。“也”表示她不否认平台的责任，是补充个人的责任。 | He blames platforms; she says everyone should also reflect. 也 shows she adds personal duty without denying the platforms'.
答：认为个人也有责任
错：完全反对 | 她用的是“也”，是补充，不是完全反对。 | She uses 也, adding to his view, not rejecting it.
错：完全同意，没有补充 | 她有补充：个人也有责任。 | She does add something: personal responsibility.
错：认为平台没有责任 | “也”说明她没有否认平台的责任。 | 也 shows she keeps the platforms' share.

男：你的论文开题报告通过了吗？
女：通过了，但评审老师说我的选题太宽泛，建议缩小范围，只研究一个城市的情况。
男：这其实是好事，范围小了，数据才能做得详细，结论也更可靠。
问：评审老师对女的的论文有什么意见？
据：女的说评审老师说“我的选题太宽泛，建议缩小范围”。 | The woman says the reviewers found her topic too broad and suggested narrowing it.
答：选题范围太大
错：选题太小 | 老师说的是太宽泛，和太小相反。 | They say too broad, the opposite of too narrow.
错：数据不够准确 | 数据是男的说缩小范围以后的好处，老师没有说数据不准。 | Data comes up in the man's reply, not as the reviewers' complaint.
错：结论不可靠 | 结论更可靠是男的说的好处，不是老师的意见。 | More reliable conclusions is his point, not the reviewers'.
问：男的对老师的建议有什么看法？
据：男的说“这其实是好事，范围小了，数据才能做得详细，结论也更可靠”。 | The man says it is good: a narrower scope allows detailed data and sounder conclusions.
答：缩小范围对研究有好处
错：老师的要求太高了 | 他说这是好事，没有说要求高。 | He calls it good, not too demanding.
错：应该换一个选题 | 他说缩小范围，不是换题。 | He says narrow it, not change it.
错：一个城市的数据不够 | 他说范围小了数据才能做得详细，一个城市正合适。 | He says a smaller scope makes the data richer, so one city suits.

女：这个实验的结果和你的假设完全相反，你打算怎么写进论文？
男：如实写。基础研究本来就有很多意外，与其想办法掩盖，不如认真分析原因，说不定会有新发现。
问：男的对实验结果是什么态度？
据：男的说“如实写……与其想办法掩盖，不如认真分析原因”。 | The man says he will report it truthfully and analyse the causes rather than hide it.
答：如实报告，并分析原因
错：重新做实验直到符合假设 | 他说如实写，不是重做到符合假设。 | He will report it, not redo it until it fits.
错：不写进论文 | 他要写进论文。 | He will put it in the paper.
错：修改数据 | 如实写就是不改数据。 | Reporting truthfully means not altering data.
问：男的认为意外的结果可能带来什么？
据：男的说“说不定会有新发现”。 | The man says it might lead to a new discovery.
答：新的发现
错：论文无法发表 | 他没有说不能发表。 | He does not say it cannot be published.
错：研究经费减少 | 他没有说经费。 | He does not mention funding.
错：别人的批评 | 他没有说批评。 | He does not mention criticism.

男：我们申请的经费批下来了，可比预算少了三分之一。
女：那只能调整计划了。先保证核心的实验，那些不是非做不可的部分以后再说。
男：我同意。另外可以看看能不能和别的学校合作，共用一些设备。
问：他们遇到了什么问题？
据：男的说“经费批下来了，可比预算少了三分之一”。 | The man says the funds were approved but a third below budget.
答：经费比预算少
错：申请没有批准 | 男的说“批下来了”。 | He says it was approved.
错：实验失败了 | 对话没有说实验失败。 | No failed experiment is mentioned.
错：设备坏了 | 共用设备是为了省钱，没有说设备坏了。 | Sharing equipment saves money; nothing is broken.
问：男的提出了什么办法？
据：男的说“可以看看能不能和别的学校合作，共用一些设备”。 | The man suggests working with other universities and sharing equipment.
答：和别的学校合作，共用设备
错：重新申请经费 | 他没有说重新申请。 | He does not suggest reapplying.
错：放弃这个项目 | 他们要调整计划，不是放弃。 | They will adjust, not abandon.
错：减少研究人员 | 他没有说减人。 | He does not suggest cutting staff.

女：我们村以前家家种小麦，现在很多人改种蔬菜大棚了。
男：大棚收入高，可投入也大，而且技术要求高。
女：所以村里请了农业专家，每个月都来指导一次，还帮大家联系城里的超市。
男：有技术、有销路，这样风险就小多了。
问：村里的人为什么改种大棚蔬菜？
据：男的说“大棚收入高”。 | The man says greenhouses bring higher income.
答：收入更高
错：小麦不让种了 | 对话没有说不让种小麦。 | Nothing bans wheat.
错：大棚投入少 | 男的说大棚“投入也大”。 | He says greenhouses cost a lot.
错：大棚技术简单 | 男的说大棚“技术要求高”。 | He says greenhouses need skill.
问：村里是怎么降低风险的？
据：女的说“村里请了农业专家，每个月都来指导一次，还帮大家联系城里的超市”，男的说有技术、有销路风险就小多了。 | She says an expert visits monthly and helps find city supermarkets; he says skill and sales cut the risk.
答：请专家指导，帮忙找销路
错：大家一起借钱 | 对话没有说借钱。 | Borrowing is never mentioned.
错：只种很少的大棚 | 对话没有说只种很少。 | Planting only a few is never mentioned.
错：改回去种小麦 | 很多人已经改种大棚了，没有改回去。 | Many have switched to greenhouses; none have switched back.

男：这家工厂引进了智能生产线，工人少了一半，产量反而提高了。
女：效率是高了，那些被替代的工人怎么办？
男：厂里给他们安排了培训，学会操作和维修设备的，可以继续留下来。
问：引进智能生产线后，有什么变化？
据：男的说“工人少了一半，产量反而提高了”。 | The man says half the workers went, yet output rose.
答：工人少了，产量提高了
错：工人多了，产量提高了 | 工人少了，不是多了。 | Fewer workers, not more.
错：工人少了，产量也降低了 | 产量提高了，不是降低。 | Output rose, not fell.
错：工人和产量都没变 | 工人少了一半，产量也提高了，都变了。 | Both changed: half the staff, more output.
问：工厂怎么安排被替代的工人？
据：男的说“厂里给他们安排了培训，学会操作和维修设备的，可以继续留下来”。 | The man says the factory trains them, and those who learn to run and repair the machines can stay.
答：培训他们操作和维修设备
错：全部解雇 | 学会了的可以留下来，不是全部解雇。 | Those trained can stay, so not all are fired.
错：送他们去其他工厂 | 对话没有说其他工厂。 | Other factories are never mentioned.
错：让他们提前退休 | 对话没有说提前退休。 | Early retirement is never mentioned.

女：今年流感来得特别早，学校里好几个班都停课了。
男：疾控中心已经提醒了，老人和孩子最好去打疫苗，平时勤洗手，人多的地方戴口罩。
女：我打算周末就带孩子去打。
问：男的提到了哪些预防办法？
据：男的说老人孩子“最好去打疫苗，平时勤洗手，人多的地方戴口罩”。 | The man says get vaccinated, wash hands often, and wear masks in crowds.
答：打疫苗、勤洗手、戴口罩
错：多吃药、少出门 | 他没有说吃药、少出门。 | He mentions neither medicine nor staying in.
错：停课、隔离 | 停课是学校的情况，不是他说的预防办法。 | Closed classes are what happened, not his advice.
错：多运动、多休息 | 他没有说运动、休息。 | He mentions neither exercise nor rest.
问：女的打算做什么？
据：女的说“我打算周末就带孩子去打”。 | The woman plans to take her child for the jab at the weekend.
答：带孩子去打疫苗
错：给孩子请假 | 她没有说请假。 | She does not mention leave.
错：带孩子去医院检查 | 她是去打疫苗，不是检查。 | She is going for a vaccine, not a check-up.
错：给学校打电话 | 她没有说给学校打电话。 | She does not mention phoning the school.

男：公共场所禁烟已经好几年了，可我们单位楼道里还是能闻到烟味。
女：规定是有，执行不到位。二手烟的危害比很多人想的大，应该有人专门检查。
问：女的认为问题出在哪里？
据：女的说“规定是有，执行不到位”。 | The woman says the rule exists but is not enforced.
答：规定没有认真执行
错：没有禁烟的规定 | 她说“规定是有”。 | She says there is a rule.
错：二手烟危害不大 | 她说二手烟的危害“比很多人想的大”。 | She says second-hand smoke is worse than people think.
错：抽烟的人太少 | 男的说楼道里还能闻到烟味，说明有人抽。 | He still smells smoke, so people do smoke.
问：男的单位有什么问题？
据：男的说“我们单位楼道里还是能闻到烟味”。 | The man says one can still smell smoke in the corridors at work.
答：楼道里有人抽烟
错：没有禁烟的规定 | 禁烟已经好几年了，有规定。 | The ban has run for years, so a rule exists.
错：楼道没人打扫 | 对话没有说打扫。 | Cleaning is never mentioned.
错：楼道里灯太暗 | 对话没有说灯光。 | Lighting is never mentioned.

女：这次检查发现，学生的近视率又上升了。
男：主要是看屏幕的时间太长，户外活动太少。我听说有的学校规定每天必须在户外活动两个小时。
女：这个办法好，不过得家长配合，回家以后也得少让孩子看手机。
问：男的认为学生近视率上升的主要原因是什么？
据：男的说“主要是看屏幕的时间太长，户外活动太少”。 | The man says it is mainly too much screen time and too little time outdoors.
答：看屏幕多，户外活动少
错：学习压力太大 | 他没有说压力。 | He does not mention pressure.
错：吃得不健康 | 他没有说饮食。 | He does not mention diet.
错：教室灯光太暗 | 他没有说教室灯光。 | He does not mention classroom lighting.
问：女的认为那个办法要取得效果还需要什么？
据：女的说“不过得家长配合，回家以后也得少让孩子看手机”。 | The woman says parents must cooperate and limit phones at home.
答：家长的配合
错：更多的老师 | 她没有说老师。 | She does not mention teachers.
错：政府的经费 | 她没有说经费。 | She does not mention funds.
错：更好的设备 | 她没有说设备。 | She does not mention equipment.

男：我们这儿夏天太阳那么好，为什么不在屋顶装太阳能板？
女：我也考虑过，但一次投入不少，要七八年才能收回成本。
男：可是能用二十多年啊，算下来还是划算的，而且政府还有补贴。
女：那我再去问问补贴的具体情况。
问：女的原来为什么犹豫？
据：女的说“一次投入不少，要七八年才能收回成本”。 | The woman says the upfront cost is high and takes seven or eight years to recover.
答：前期投入大，回本时间长
错：这里太阳不好 | 男的说这里“夏天太阳那么好”。 | The man says the summer sun is strong here.
错：太阳能板只能用几年 | 男的说能用二十多年。 | He says panels last over twenty years.
错：没有地方安装 | 他们说的是屋顶，没有说没地方装。 | They speak of the roof; space is not the issue.
问：男的认为装太阳能板怎么样？
据：男的说“能用二十多年啊，算下来还是划算的”。用二十多年，七八年回本，长期看划算。 | He says they last over twenty years, so it pays off: recover the cost in seven or eight, then gain.
答：从长期看是划算的
错：投入太大不划算 | 他说算下来还是划算的。 | He says it works out worthwhile.
错：只有补贴才划算 | 补贴是另外的好处，他说的是“而且”还有补贴。 | Subsidies are an extra, introduced by 而且.
错：会影响房子安全 | 对话没有说安全。 | Safety is never mentioned.

女：你看这份报告，我们国家的水资源人均只有世界平均水平的四分之一。
男：所以节水不能只是口号。农业用水占了大头，如果推广滴灌技术，能省下很多水。
问：男的认为节水的重点在哪里？
据：男的说“农业用水占了大头”，接着讲农业用的滴灌技术。 | The man says agriculture takes the largest share, then speaks of drip irrigation for farms.
答：农业用水
错：家庭用水 | 他没有说家庭用水。 | He does not mention households.
错：工业用水 | 他没有说工业用水。 | He does not mention industry.
错：城市绿化 | 他没有说绿化。 | He does not mention greenery.
问：男的提出了什么方法？
据：男的说“如果推广滴灌技术，能省下很多水”。 | The man says spreading drip irrigation would save much water.
答：推广滴灌技术
错：提高水价 | 他没有说水价。 | He does not mention water prices.
错：减少种地 | 他没有说少种地。 | He does not say farm less.
错：多建水库 | 他没有说建水库。 | He does not mention reservoirs.

男：这座大桥从设计到建成用了八年，难度最大的是在深水里打地基。
女：我看过纪录片，工程师们为了这一步试了好几种方案，失败了好几次。
男：正是那些失败积累下的经验，后来用到了其他大桥上。
问：建这座桥最难的是什么？
据：男的说“难度最大的是在深水里打地基”。 | The man says the hardest part was laying foundations in deep water.
答：在深水里打地基
错：设计桥的样子 | 设计是从设计到建成的开始，不是最难的。 | Design is where it began, not the hardest part.
错：找到足够的工人 | 对话没有说工人。 | Workers are never mentioned.
错：筹集资金 | 对话没有说资金。 | Funding is never mentioned.
问：这座大桥从设计到建成用了多长时间？
据：男的说“这座大桥从设计到建成用了八年”。 | The man says it took eight years from design to completion.
答：八年
错：两年 | 他说的是八年，不是两年。 | He says eight years, not two.
错：五年 | 他说的是八年，不是五年。 | He says eight years, not five.
错：二十年 | 他说的是八年，不是二十年。 | He says eight years, not twenty.
问：男的认为那些失败有什么意义？
据：男的说“正是那些失败积累下的经验，后来用到了其他大桥上”。 | The man says the experience from those failures was later used on other bridges.
答：积累了以后可以用的经验
错：浪费了大量时间 | 他说失败有用，不是浪费。 | He says the failures were useful, not wasted.
错：说明方案设计得不好 | 他没有批评方案。 | He does not fault the designs.
错：没有任何价值 | 他说经验用到了其他桥上，有价值。 | He says the lessons were reused.

女：你这个发明是怎么想出来的？
男：我奶奶眼睛不好，总是找不到眼镜，我就做了一个小装置，一拍手眼镜就会响。
问：男的为什么做这个发明？
据：男的说“我奶奶眼睛不好，总是找不到眼镜，我就做了一个小装置”。 | The man says his grandmother's eyes are poor and she keeps losing her glasses, so he made a device.
答：帮奶奶找眼镜
错：参加发明比赛 | 他没有说比赛。 | He does not mention a contest.
错：为了卖钱 | 他没有说卖钱。 | He does not mention selling it.
错：老师布置的作业 | 他没有说作业。 | He does not mention homework.
问：这个装置怎么用？
据：男的说“一拍手眼镜就会响”。 | The man says clapping makes the glasses beep.
答：拍一下手，眼镜就会响
错：按一下开关，眼镜就会亮 | 他说的是拍手，不是按开关；是响，不是亮。 | He says clap, not a switch, and beep, not light.
错：说一句话，眼镜就会动 | 他说的是拍手，不是说话。 | He says clap, not speak.
错：打一个电话，眼镜就会响 | 他说的是拍手，不是打电话。 | He says clap, not phone.
`,
  },
  {
    unit: 12,
    data: `
男：这次去埃及，最让我吃惊的不是金字塔有多高，而是几千年前的人怎么能把那么重的石头运上去。
女：这个问题到现在学术界还有争论。有人认为是用斜坡一点点拉上去的，也有人认为借助了尼罗河的水运。
男：不管哪种说法，都说明当时的组织能力已经非常了不起了。
问：最让男的吃惊的是什么？
据：男的说“最让我吃惊的不是金字塔有多高，而是几千年前的人怎么能把那么重的石头运上去”，“而是”后面是答案。 | He says what amazed him was not the height but how people moved such stones; the answer follows 而是.
答：古人如何运送巨大的石头
错：金字塔的高度 | 高度是他先排除的。 | Height is what he rules out.
错：尼罗河的风景 | 尼罗河是女的说的一种运石头的说法，不是风景。 | The Nile is her theory of transport, not scenery.
错：埃及的现代建筑 | 对话没有说现代建筑。 | Modern buildings are never mentioned.
问：关于这个问题，女的说了什么？
据：女的说“这个问题到现在学术界还有争论”。 | The woman says scholars still debate it.
答：学术界还没有定论
错：已经有了明确的答案 | 还有争论，就是没有明确答案。 | Still debated means no clear answer.
错：只有一种说法 | 她说了斜坡和水运两种说法。 | She gives two views, ramps and the river.
错：没有人研究过 | 学术界还在争论，说明有人研究。 | Scholars debate it, so it has been studied.
问：男的得出了什么结论？
据：男的说“不管哪种说法，都说明当时的组织能力已经非常了不起了”。 | The man says whichever view is right, the organisation of that time was remarkable.
答：当时的组织能力很强
错：古人的技术很落后 | 他说了不起，不是落后。 | He says remarkable, not backward.
错：金字塔不是古人建的 | 他说是“几千年前的人”运上去的。 | He says people thousands of years ago moved them.
错：水运比斜坡更可靠 | 他说“不管哪种说法”，没有比较哪种可靠。 | He says "whichever view", so he does not rank them.

女：你研究甲骨文这么多年，最大的困难是什么？
男：很多字只出现过一两次，没有上下文可以参考，只能大胆假设、小心求证，有时候一个字要琢磨好几年。
问：研究甲骨文最大的困难是什么？
据：男的说“很多字只出现过一两次，没有上下文可以参考”。 | The man says many characters appear only once or twice, with no context to go on.
答：有些字出现太少，缺少参考
错：甲骨保存得不好 | 他没有说甲骨保存。 | He does not mention preservation.
错：研究经费不足 | 他没有说经费。 | He does not mention funds.
错：没有人愿意研究 | 他研究了很多年，没有说没人研究。 | He has studied for years; he does not say no one does.
问：男的是怎样研究那些字的？
据：男的说“只能大胆假设、小心求证”。 | The man says he can only boldly hypothesise and carefully verify.
答：大胆假设，小心求证
错：直接查字典 | 字没有上下文，查不到字典。 | Without context there is nothing to look up.
错：请教外国专家 | 他没有说外国专家。 | He does not mention foreign experts.
错：放弃难认的字 | 他说一个字要琢磨好几年，没有放弃。 | He spends years on a character, not giving up.

男：古代的丝绸之路上，商人们最怕的是什么？
女：除了沙漠和强盗，还有语言不通。所以沿路的驿站不光是休息的地方，也是交换消息、找翻译的地方。
问：根据女的的话，驿站有什么作用？
据：女的说驿站“不光是休息的地方，也是交换消息、找翻译的地方”。 | The woman says the stations were not only for rest but also for exchanging news and finding interpreters.
答：休息、交换消息、找翻译
错：只是用来休息 | 她说“不光是休息的地方”。 | She says not only for rest.
错：专门卖丝绸 | 她没有说卖丝绸。 | She does not say they sold silk.
错：保护商人不被抢 | 她没有说驿站保护商人。 | She does not say stations protected merchants.
问：女的提到商人们怕什么？
据：女的说“除了沙漠和强盗，还有语言不通”。 | The woman says besides deserts and bandits, there was the language barrier.
答：沙漠、强盗和语言不通
错：天气太热 | 她说的是沙漠，没有说天气热。 | She names deserts, not heat.
错：货物太重 | 她没有说货物。 | She does not mention goods.
错：没有骆驼 | 她没有说骆驼。 | She does not mention camels.

女：我在路上发现了一个钱包，里面有不少现金，可是没有证件。
男：那还是交到派出所吧，失主丢了钱一定很着急。
女：我也是这么想的，就算没人来领，我拿着也会良心不安。
问：女的为什么要把钱包交出去？
据：女的说“就算没人来领，我拿着也会良心不安”。 | The woman says even if no one claims it, keeping it would trouble her conscience.
答：不交心里会过意不去
错：怕被别人看见 | 她没有说怕被看见。 | She does not mention being seen.
错：想得到奖励 | 她没有说奖励。 | She does not mention a reward.
错：失主是她认识的人 | 钱包里没有证件，她不知道失主是谁。 | There is no ID, so she does not know the owner.
问：男的建议女的怎么做？
据：男的说“那还是交到派出所吧”。 | The man says she should hand it in at the police station.
答：把钱包交到派出所
错：在网上发消息找失主 | 他说的是派出所，不是网上。 | He says the police, not online.
错：把钱包留下来 | 他让她交出去，不是留下。 | He says hand it in, not keep it.
错：把钱捐出去 | 他没有说捐。 | He does not mention donating.

男：老同学找我帮忙，让他儿子进我们公司，可是他儿子的条件明显不够。
女：这种事最难办了。帮了他，对其他应聘的人不公平；不帮，又怕伤了感情。
男：我想了想，还是按规定来。我可以帮他儿子分析一下哪里不足，下次再争取。
女：这样既坚持了原则，也算尽了朋友的情分。
问：男的遇到了什么难题？
据：男的说“老同学找我帮忙，让他儿子进我们公司，可是他儿子的条件明显不够”。 | The man says an old classmate wants his under-qualified son hired.
答：朋友让他帮条件不够的儿子进公司
错：老同学向他借钱 | 对话没有说借钱。 | Money is never mentioned.
错：他的儿子找不到工作 | 找工作的是老同学的儿子，不是男的的儿子。 | It is the classmate's son, not the man's.
错：公司要裁员 | 对话没有说裁员。 | Layoffs are never mentioned.
问：男的最后怎么处理这件事？
据：男的说“还是按规定来。我可以帮他儿子分析一下哪里不足，下次再争取”。 | The man says he will follow the rules and help the son see his weaknesses for next time.
答：按规定办，但帮对方分析不足
错：直接让朋友的儿子进公司 | 他说按规定来，不是直接让他进。 | He follows the rules, so he does not just hire him.
错：不再跟老同学来往 | 他还帮朋友的儿子分析，没有断绝来往。 | He still helps, so he keeps the friendship.
错：请别人去拒绝 | 他自己处理，没有请别人。 | He handles it himself.
问：女的对男的的做法是什么态度？
据：女的说“这样既坚持了原则，也算尽了朋友的情分”，是在称赞。 | The woman says this keeps to principle and honours the friendship: praise.
答：赞同
错：反对 | 她称赞这个做法，不是反对。 | She praises it.
错：无所谓 | 她说了两个好处，有明确的看法。 | She names two merits, a clear view.
错：觉得太冷漠 | 她说尽了朋友的情分，不冷漠。 | She says it honours the friendship, so it is not cold.

女：你说如果发现好朋友考试作弊，应该告诉老师吗？
男：我会先劝他自己去说。直接去告诉老师，好像出卖了朋友；可什么都不做，又等于袒护他。
问：男的会怎么做？
据：男的说“我会先劝他自己去说”。 | The man says he would first urge his friend to own up.
答：先劝朋友自己承认
错：马上告诉老师 | 他说直接告诉老师好像出卖朋友。 | He says telling the teacher directly feels like betrayal.
错：假装没看见 | 他说什么都不做等于袒护。 | He says doing nothing is shielding him.
错：和朋友一起作弊 | 他要劝朋友承认，不会一起作弊。 | He would urge confession, not join in.
问：男的认为什么都不做意味着什么？
据：男的说“可什么都不做，又等于袒护他”。 | The man says doing nothing would amount to shielding him.
答：等于袒护朋友
错：尊重朋友的选择 | 他说是袒护，不是尊重。 | He calls it shielding, not respect.
错：保护了友谊 | 他说是袒护，没有说保护友谊。 | He calls it shielding, not protecting the friendship.
错：对老师不礼貌 | 他没有说对老师不礼貌。 | He does not mention rudeness to teachers.

男：你最近怎么爱上读古诗了？
女：以前上学的时候只会背，不理解。现在经历多了，再读"举头望明月"这样的句子，才真正体会到那种思乡的心情。
男：看来读诗也得看年纪和经历。
问：女的为什么现在喜欢读古诗了？
据：女的说“现在经历多了，再读……才真正体会到那种思乡的心情”。 | The woman says with more experience she now truly feels the homesickness in the lines.
答：有了经历，更能理解诗的感情
错：老师要求她背 | 只会背是上学的时候，现在没有人要求。 | Rote learning was at school; no one requires it now.
错：她在写一本关于古诗的书 | 对话没有说写书。 | Writing a book is never mentioned.
错：她想参加诗歌比赛 | 对话没有说比赛。 | A contest is never mentioned.
问：男的的看法是什么？
据：男的说“看来读诗也得看年纪和经历”。 | The man says reading poetry depends on age and experience.
答：对诗的理解和经历有关
错：古诗只适合小孩子读 | 他说要看年纪和经历，大人读得更懂，不是只适合小孩。 | He says experience deepens it, so it is not just for children.
错：读诗应该多背 | 女的说以前只会背不理解，男的没有说要多背。 | She says rote learning failed her, and he does not urge more.
错：古诗太难懂了 | 他没有说太难懂。 | He does not call it too hard.

女：这出话剧的演员在台上一句台词都没有，全靠动作和表情，你看懂了吗？
男：一开始有点儿看不明白，后来就看进去了。没有台词，反而让观众更专注地去看演员的每一个细节。
女：我倒觉得有几段太长了，同一个动作重复了好多次。
男：那可能是导演故意的，想让观众感受到人物生活的无聊。
问：这出话剧有什么特别的地方？
据：女的说“演员在台上一句台词都没有，全靠动作和表情”。 | The woman says the actors speak no lines; it is all movement and expression.
答：演员不说台词
错：演员都是孩子 | 对话没有说孩子。 | Children are never mentioned.
错：只有一个演员 | 她说的是“演员”，不止一个。 | She says the actors, more than one.
错：演出时间特别长 | 女的嫌的是几段太长，不是整场时间特别长。 | She finds some passages long, not the whole show.
问：男的看完以后有什么感受？
据：男的说“一开始有点儿看不明白，后来就看进去了”。 | The man says he was a little lost at first, then drawn in.
答：开始不太懂，后来被吸引了
错：完全没看懂 | 他后来看进去了。 | He was drawn in later.
错：觉得很无聊 | 觉得无聊是导演想让观众感受人物的生活，不是男的对剧的感受。 | Boredom is what the director wants felt about the characters' lives, not his view of the play.
错：一直看得很明白 | 他说一开始有点儿看不明白。 | He says he was lost at first.
问：女的对这出话剧有什么不满？
据：女的说“有几段太长了，同一个动作重复了好多次”。 | The woman says some passages were too long, repeating one action many times.
答：有些部分太长、太重复
错：演员表演得不好 | 她没有说演员演得不好。 | She does not fault the acting.
错：台词太多了 | 这出戏一句台词都没有。 | The play has no lines at all.
错：票价太贵了 | 对话没有说票价。 | Price is never mentioned.

男：现在很多电影的票房靠的是明星，故事反而不重要了。
女：短期也许是这样，但观众心里有数，口碑不好的片子，第二周票房就掉下来了。
男：你是说好故事最后还是会被看到？
女：对，去年那部小成本的电影，没有一个明星，靠观众一传十、十传百，最后票房还是很高。
问：女的的观点是什么？
据：女的说口碑不好的片子第二周票房就掉，又同意“好故事最后还是会被看到”。长期看是故事更重要。 | She says films with bad word of mouth drop in week two and agrees good stories are found in the end: in the long run, story matters more.
答：长期来看，故事比明星更重要
错：明星是票房的唯一保证 | 她举的例子没有一个明星，票房还是很高。 | Her example had no stars yet did well.
错：观众只看明星 | 她说“观众心里有数”。 | She says audiences know.
错：小成本电影都不好看 | 她举的小成本电影很成功。 | Her low-budget example was a hit.
问：女的举了什么例子？
据：女的说“去年那部小成本的电影，没有一个明星……最后票房还是很高”。 | The woman cites last year's low-budget film with no stars that still earned a lot.
答：一部没有明星的小成本电影票房很高
错：一部明星很多的电影票房很低 | 她的例子没有明星，票房高。 | Her example had no stars and did well.
错：一部电影第二周票房上升 | 第二周票房是掉下来，不是上升，而且那是一般情况，不是她的例子。 | Week two is when takings fall, and that is a general point, not her example.
错：一部老电影重新上映 | 她说的是去年的电影，不是老电影重映。 | She speaks of last year's film, not a re-release.

女：你这首曲子的旋律很熟悉，是从民歌改编的吧？
男：对，我保留了原来的旋律，只是换了乐器，加了一些现代的节奏，想让年轻人也愿意听。
问：男的是怎么改编这首曲子的？
据：男的说“我保留了原来的旋律，只是换了乐器，加了一些现代的节奏”。 | The man says he kept the melody but changed instruments and added modern rhythms.
答：保留旋律，加入现代元素
错：完全重新创作了旋律 | 他保留了原来的旋律。 | He kept the melody.
错：只是重新录了一遍 | 他换了乐器、加了节奏，不只是重录。 | He changed instruments and rhythm, more than a re-recording.
错：把歌词全改了 | 他没有说歌词。 | He does not mention lyrics.
问：男的改编的目的是什么？
据：男的说“想让年轻人也愿意听”。 | The man says he wants young people to listen too.
答：吸引年轻听众
错：参加比赛 | 他没有说比赛。 | He does not mention a contest.
错：给电影配乐 | 他没有说电影。 | He does not mention films.
错：保留原来的乐器 | 他换了乐器，不是保留。 | He changed the instruments.

男：办个营业执照，以前要跑好几个部门，盖十几个章。
女：现在方便多了，网上提交材料，最快三天就能拿到。我上个月刚办过。
男：那材料不全怎么办？
女：系统会一次性告诉你缺什么，不用来回跑。
问：现在办营业执照有什么变化？
据：女的说“现在方便多了，网上提交材料，最快三天就能拿到”。 | The woman says it is much easier: submit online and get it in as little as three days.
答：可以网上办理，速度更快
错：要跑更多的部门 | 跑好几个部门是以前的情况。 | Many offices was the old way.
错：要盖更多的章 | 盖十几个章也是以前。 | A dozen stamps was the old way.
错：只能去现场办 | 现在可以网上提交。 | It can now be done online.
问：如果材料不全，会怎么样？
据：女的说“系统会一次性告诉你缺什么，不用来回跑”。 | The woman says the system tells you at once what is missing.
答：系统一次说明缺什么
错：必须重新开始申请 | 她没有说重新开始。 | She does not say start over.
错：要到窗口去问 | 她说不用来回跑。 | She says no need to go back and forth.
错：会被罚款 | 她没有说罚款。 | She does not mention fines.

女：市里打算把这条老街改成步行街，正在公开征求居民意见。
男：我觉得应该多听听住在这里的老人的想法，他们每天出门买菜、看病，不能开车会很不方便。
女：方案里好像有考虑，会留出一条供急救车和送货车通行的路线。
问：市里现在在做什么？
据：女的说市里“正在公开征求居民意见”。 | The woman says the city is publicly consulting residents.
答：征求居民对改造的意见
错：已经开始施工 | 现在还在征求意见，没有开始施工。 | It is still consulting, not building.
错：决定不改造老街 | 市里“打算”改，没有决定不改。 | The city plans to change it, not to drop it.
错：让老人搬走 | 对话没有说让老人搬走。 | Moving the elderly is never mentioned.
问：男的担心什么？
据：男的说老人“每天出门买菜、看病，不能开车会很不方便”。 | The man says the elderly shop and see doctors daily, and no cars would be inconvenient.
答：老人出行会不方便
错：老街的生意会变差 | 他没有说生意。 | He does not mention trade.
错：游客太多太吵 | 他没有说游客。 | He does not mention tourists.
错：改造费用太高 | 他没有说费用。 | He does not mention cost.
问：关于方案，女的说了什么？
据：女的说方案“会留出一条供急救车和送货车通行的路线”。 | The woman says the plan keeps a route for ambulances and delivery vans.
答：会留出急救和送货的通道
错：完全禁止车辆进入 | 留了通道，不是完全禁止车辆。 | A lane is kept, so cars are not wholly banned.
错：还没有考虑这个问题 | 她说“方案里好像有考虑”。 | She says the plan seems to allow for it.
错：老人可以免费坐车 | 她没有说免费坐车。 | She does not mention free rides.

男：最近股市涨得这么好，我也想拿点儿钱进去试试。
女：你先想清楚，这些钱是不是短期内用不着的。股市有涨就有跌，大家都赚钱的时候往往风险最大。
问：女的提醒男的注意什么？
据：女的说“这些钱是不是短期内用不着的。股市有涨就有跌”。要用短期内用不着的钱，因为有风险。 | She says to check the money will not be needed soon, as markets fall as well as rise: invest spare money, for there is risk.
答：股市有风险，要用闲钱投资
错：现在是买股票最好的时候 | 她说大家都赚钱的时候风险最大，现在正是这样。 | She says the risk peaks when everyone is winning, which is now.
错：一定能赚很多钱 | 她说有涨就有跌，不是一定赚。 | She says it can fall, so gains are not sure.
错：应该把所有存款都投进去 | 她让他先想清楚是不是短期用不着的钱，不是全投。 | She says only spare money, not all savings.
问：女的认为什么时候风险最大？
据：女的说“大家都赚钱的时候往往风险最大”。 | The woman says risk is often greatest when everyone is making money.
答：大家都在赚钱的时候
错：股市刚开始跌的时候 | 她说的是大家都赚钱，不是刚开始跌。 | She says when all are winning, not when it starts to fall.
错：没人买股票的时候 | 她说的是大家都赚钱，不是没人买。 | She says when all are winning, not when no one buys.
错：股市不涨不跌的时候 | 她说的是大家都赚钱，不是不涨不跌。 | She says when all are winning, not when it is flat.

女：我想买一个理财产品，销售人员说年收益能到百分之八，还保证不亏。
男：收益这么高还保证不亏？你得小心。收益越高，风险一般也越大，你先看看合同里是怎么写的。
女：好，我回去仔细看看。
问：男的为什么让女的小心？
据：男的说“收益这么高还保证不亏？……收益越高，风险一般也越大”。高收益和不亏不能同时有，这种说法不可信。 | He asks, so high and guaranteed? Higher returns usually mean more risk, so the claim cannot be trusted.
答：高收益又不亏的说法不可信
错：理财产品的收益太低 | 百分之八是高收益，不是低。 | Eight per cent is high, not low.
错：销售人员态度不好 | 他没有说销售人员态度。 | He does not mention the seller's manner.
错：女的不应该存钱 | 他没有说不该存钱。 | He does not say she should not save.
问：女的接下来会做什么？
据：女的说“好，我回去仔细看看”，看的是男的说的合同。 | The woman says she will go home and read the contract closely.
答：仔细看合同
错：马上买这个产品 | 她要先看合同，不是马上买。 | She will read first, not buy now.
错：去找别的银行 | 她没有说去别的银行。 | She does not mention another bank.
错：向销售人员投诉 | 她没有说投诉。 | She does not mention a complaint.

男：这家公司刚上市，股价第一天就涨了百分之九十。
女：市场太热了。我更关心它的利润能不能撑起这个价格，要不然泡沫早晚会破。
问：女的对这家公司的股价是什么看法？
据：女的说“市场太热了。我更关心它的利润能不能撑起这个价格，要不然泡沫早晚会破”。她怀疑价格太高，被高估了。 | She says the market is overheated and wonders if profits can support the price, or the bubble will burst: she thinks it overvalued.
答：可能被高估了
错：还会继续上涨 | 她说泡沫早晚会破，不是继续涨。 | She warns the bubble will burst, not that it will rise.
错：价格非常合理 | 她怀疑利润撑不起价格，不是合理。 | She doubts profits support it, so not reasonable.
错：公司利润很高 | 她是在怀疑利润够不够，没有说利润很高。 | She questions the profits, not praises them.
`,
  },
];
