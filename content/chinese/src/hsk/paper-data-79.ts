// Tasks of the writing and translation papers of HSK 7–9 (docs/chinese-curriculum.md §8.5): a chart to describe and
// analyse, a question to argue in an essay, and an English text to translate into Chinese, each with a model answer.
// The charts are given as tables of figures. Written for this package: the figures are invented for practice, and no
// task of the test is copied.

import type { PaperItem } from "./paper-data.ts";

/** chartTasks are charts given as tables of figures, with a title, to describe and analyse in about 200 characters. */
export const chartTasks: readonly PaperItem[] = [
  {
    task: "图表：某市居民每天使用手机的平均时间（小时）\n\n| 年份 | 2016 | 2018 | 2020 | 2022 | 2024 |\n| :--- | ---: | ---: | ---: | ---: | ---: |\n| 平均时间 | 2.1 | 3.0 | 4.2 | 4.6 | 4.8 |",
    model:
      "这张图表反映了2016年至2024年某市居民每天使用手机的平均时间。总体来看，使用时间不断增长，从2016年的2.1小时增加到2024年的4.8小时，八年间增长了一倍多。增长最快的是2018年到2020年，两年内增加了1.2小时，这可能与这一时期网上学习、网上办公和网上购物迅速普及有关。2020年以后，增长明显放缓，2022年到2024年只增加了0.2小时。由此可见，手机在居民生活中的地位已经相当稳固，使用时间可能已接近上限。今后，如何合理安排使用时间、减少对健康的影响，值得人们重视。",
  },
  {
    task: "图表：某大学2024届毕业生的去向（%）\n\n| 去向 | 比例 |\n| :--- | ---: |\n| 进入企业工作 | 46 |\n| 继续读书 | 28 |\n| 考取公务员 | 12 |\n| 自主创业 | 4 |\n| 其他 | 10 |",
    model:
      "这张图表展示了某大学2024届毕业生的去向。从图中可以看出，进入企业工作的毕业生最多，占46%，接近一半；其次是继续读书，占28%；考取公务员的占12%；选择自主创业的最少，仅占4%；其他去向占10%。进入企业和继续读书两项合计超过七成，说明大多数毕业生仍然选择传统而稳定的道路。继续读书的比例较高，可能反映出就业竞争激烈，不少学生希望通过提高学历增强竞争力。自主创业比例偏低，则说明创业的风险和门槛仍然较高。学校可以在创业指导和资金支持方面多做一些工作。",
  },
  {
    task: "图表：甲、乙两城市各季节的平均气温（℃）\n\n| 季节 | 春 | 夏 | 秋 | 冬 |\n| :--- | ---: | ---: | ---: | ---: |\n| 甲市 | 15 | 28 | 17 | 2 |\n| 乙市 | 21 | 29 | 23 | 14 |",
    model:
      "这张图表比较了甲、乙两个城市四个季节的平均气温。两市夏季的气温非常接近，甲市为28℃，乙市为29℃，只相差1℃。但在其他季节，乙市都明显高于甲市，差距最大的是冬季：乙市平均气温为14℃，而甲市只有2℃，相差12℃。从全年来看，甲市冬夏温差达到26℃，四季分明；乙市冬夏温差只有15℃，全年都比较温暖。造成这种差别的原因，可能是乙市位置更靠南，或者靠近海洋。因此，如果怕冷，冬天去乙市旅游会更舒适。",
  },
  {
    task: "图表：某网上书店各类图书的销售量（万册）\n\n| 类别 | 2022年 | 2024年 |\n| :--- | ---: | ---: |\n| 文学 | 120 | 110 |\n| 儿童读物 | 80 | 115 |\n| 经济管理 | 60 | 55 |\n| 科学技术 | 40 | 62 |",
    model:
      "这张图表反映了某网上书店2022年和2024年各类图书的销售量。两年间，各类图书的销售情况变化不一。儿童读物增长最多，从80万册增加到115万册，增加了35万册，几乎追上了文学类；科学技术类也增长明显，从40万册增加到62万册，增幅超过一半。与此相反，文学类和经济管理类都略有下降，分别减少了10万册和5万册。儿童读物的增长，说明家长越来越重视孩子的阅读；科技类图书的增长，可能与人们对新技术的兴趣增加有关。书店可以根据这些变化调整进货和推荐。",
  },
  {
    task: "图表：某市人口的年龄构成（%）\n\n| 年龄 | 2004年 | 2024年 |\n| :--- | ---: | ---: |\n| 0—14岁 | 22 | 14 |\n| 15—59岁 | 66 | 63 |\n| 60岁及以上 | 12 | 23 |",
    model:
      "这张图表比较了某市2004年和2024年人口的年龄构成。二十年间，最大的变化是老年人口比例明显上升：60岁及以上的人口从12%增加到23%，几乎翻了一番。与此同时，0到14岁的儿童比例从22%下降到14%，减少了8个百分点。15到59岁的人口比例变化不大，只下降了3个百分点。由此可见，该市正在快速进入老龄化社会，而出生人口的减少又使这一趋势更加明显。这对养老服务、医疗保障和劳动力供给都提出了新的要求，政府需要提前做好准备。",
  },
  {
    task: "图表：某公司员工上班使用的交通方式（%）\n\n| 交通方式 | 2019年 | 2024年 |\n| :--- | ---: | ---: |\n| 开车 | 38 | 25 |\n| 地铁、公交 | 40 | 47 |\n| 骑自行车 | 7 | 16 |\n| 步行 | 15 | 12 |",
    model:
      "这张图表显示了某公司员工在2019年和2024年上班使用的交通方式。五年来，地铁和公交一直是最主要的方式，比例从40%上升到47%。开车上班的员工明显减少，从38%下降到25%，降低了13个百分点。骑自行车的比例则增长了一倍多，从7%增加到16%；步行的比例略有下降。总的来说，员工的出行方式越来越绿色。这一方面可能是因为城市地铁线路增加、共享单车普及，另一方面也可能与停车难、油价上涨有关。公司可以通过增加自行车停放处等方式继续鼓励绿色出行。",
  },
  {
    task: "图表：某景区各月的游客人数（万人次）\n\n| 月份 | 1月 | 3月 | 5月 | 7月 | 9月 | 11月 |\n| :--- | ---: | ---: | ---: | ---: | ---: | ---: |\n| 游客人数 | 3 | 6 | 15 | 22 | 12 | 4 |",
    model:
      "这张图表反映了某景区一年中各月的游客人数。从整体上看，游客人数先升后降，季节性非常明显。1月游客最少，只有3万人次；从3月开始逐渐增加，5月达到15万人次；7月到达最高点，为22万人次，是1月的7倍多。9月以后人数明显下降，11月只剩4万人次。夏季游客集中，主要是因为学生放暑假，家庭出游增多，加上天气适合户外活动。旺季人多拥挤，淡季设施空闲，景区可以在淡季推出优惠活动，吸引更多游客，使客流分布更加平衡。",
  },
  {
    task: "图表：某市家庭每月各项支出的比例（%）\n\n| 项目 | 2014年 | 2024年 |\n| :--- | ---: | ---: |\n| 食品 | 38 | 28 |\n| 住房 | 20 | 24 |\n| 教育 | 10 | 15 |\n| 交通通信 | 12 | 13 |\n| 文化娱乐 | 6 | 11 |\n| 其他 | 14 | 9 |",
    model:
      "这张图表比较了某市家庭2014年和2024年每月各项支出所占的比例。十年来，食品支出的比例下降最多，从38%降到28%，但仍然是最大的一项。与此同时，住房、教育和文化娱乐的比例都有所上升，其中文化娱乐几乎翻了一倍，从6%增加到11%；教育从10%增加到15%。交通通信的比例基本没有变化。食品比例下降，一般说明家庭生活水平提高了；而文化娱乐和教育支出增加，说明人们越来越重视精神生活和子女培养。不过，住房支出比例上升，也说明房价给家庭带来了不小的压力。",
  },
  {
    task: "图表：某国三种发电方式的发电量（亿千瓦时）\n\n| 年份 | 2015 | 2020 | 2025 |\n| :--- | ---: | ---: | ---: |\n| 煤电 | 420 | 450 | 400 |\n| 风电 | 30 | 80 | 160 |\n| 太阳能发电 | 10 | 50 | 140 |",
    model:
      "这张图表反映了某国2015年至2025年三种发电方式发电量的变化。煤电一直是发电量最大的一种，但变化不大：先从420亿千瓦时增加到450亿，2025年又回落到400亿。风电和太阳能发电则增长很快。风电十年间从30亿增加到160亿，增长了四倍多；太阳能发电从10亿增加到140亿，增长了十多倍，增速最快。到2025年，风电和太阳能发电合计达到300亿，已接近煤电的四分之三。这说明该国能源结构正在向清洁能源转变，这既与技术进步、成本下降有关，也与保护环境的政策有关。",
  },
  {
    task: "图表：某中学学生每周参加体育锻炼的时间（%）\n\n| 每周锻炼时间 | 初一 | 初三 |\n| :--- | ---: | ---: |\n| 少于2小时 | 15 | 42 |\n| 2—5小时 | 50 | 45 |\n| 5小时以上 | 35 | 13 |",
    model:
      "这张图表比较了某中学初一和初三学生每周参加体育锻炼的时间。两个年级的差别十分明显。初一学生中，每周锻炼5小时以上的占35%，少于2小时的只占15%；而初三学生中，锻炼5小时以上的只有13%，少于2小时的却高达42%，接近初一的三倍。每周锻炼2到5小时的比例两个年级相差不大。这说明随着年级升高，学生的锻炼时间明显减少，主要原因可能是初三学习任务重、升学压力大。然而，缺少锻炼会影响身体健康和学习效率，学校和家长应当保证初三学生有必要的运动时间。",
  },
  {
    task: "图表：某市新能源汽车的年销量（万辆）及占汽车总销量的比例\n\n| 年份 | 2020 | 2021 | 2022 | 2023 | 2024 |\n| :--- | ---: | ---: | ---: | ---: | ---: |\n| 销量（万辆） | 2 | 4 | 7 | 10 | 14 |\n| 占总销量的比例 | 5% | 10% | 18% | 26% | 35% |",
    model:
      "这张图表反映了2020年至2024年某市新能源汽车的年销量及其在汽车总销量中所占的比例。五年间，新能源汽车的销量持续快速增长，从2万辆增加到14万辆，增长了6倍。它在汽车总销量中的比例也不断提高，从5%上升到35%，也就是说，现在每卖出三辆汽车，就有一辆以上是新能源汽车。增长较快的是2021年到2022年，比例一年提高了8个百分点。新能源汽车的普及，既得益于充电设施的完善和购车优惠政策，也说明消费者越来越认可这种更环保的交通工具。",
  },
  {
    task: "图表：某市居民获取新闻的主要途径（%）\n\n| 途径 | 18—30岁 | 31—50岁 | 51岁以上 |\n| :--- | ---: | ---: | ---: |\n| 手机应用 | 78 | 60 | 32 |\n| 电视 | 8 | 22 | 48 |\n| 报纸 | 2 | 6 | 14 |\n| 其他 | 12 | 12 | 6 |",
    model:
      "这张图表显示了某市不同年龄段居民获取新闻的主要途径。可以看出，年龄不同，获取新闻的方式差别很大。18到30岁的居民中，78%主要通过手机应用看新闻，通过电视和报纸的合计只有10%。随着年龄增加，使用手机应用的比例逐渐下降，31到50岁为60%，51岁以上只有32%。相反，电视在51岁以上的居民中最受欢迎，占48%；报纸的读者也主要是年纪较大的人。这说明年轻人更习惯快速、随时获取信息，而老年人仍然信任传统媒体。媒体机构应当针对不同人群，选择不同的传播方式。",
  },
];

/** essayTasks are questions to argue a position on in about 600 characters. */
export const essayTasks: readonly PaperItem[] = [
  {
    task: "有人认为，大学生应该在读书期间就开始工作，积累社会经验；也有人认为，大学生应该把时间全部用于学习。你怎么看？",
    model:
      "大学生在读书期间是否应该工作，一直存在争论。我认为，大学生可以适当参加工作，但前提是不影响学业，因为合理的工作经历能让学习更有方向。\n\n首先，工作能够帮助大学生了解社会的真实需要。课堂上学到的知识大多是理论，而在实习或兼职中，学生会发现哪些知识真正有用，哪些能力还有不足。比如，一个学市场营销的学生在公司做过调查之后，往往会对统计课产生更大的兴趣，因为他知道了统计在工作中的作用。这样的经历使学习从被动变为主动。\n\n其次，工作可以培养责任心和与人合作的能力。在学校里，迟到一次也许只是被老师批评；在工作中，一个人的失误可能影响整个团队。经过这样的锻炼，学生更懂得守时、守信，也更善于沟通。这些能力是课本很难教会的，却是将来走上社会必不可少的。\n\n诚然，有人担心工作会占用学习时间，导致成绩下降。这种担心并非没有道理。如果一个学生每周工作二三十个小时，学业自然会受影响。但问题的关键不在于要不要工作，而在于如何安排。选择与专业相关的实习，利用假期集中工作，学期中把工作时间控制在每周十小时以内，就能在学习和工作之间取得平衡。\n\n由此可见，把大学时间全部用于读书，并不一定是最好的选择。在保证学业的前提下，适当参加工作，能够让大学生更早地认识社会、认识自己，为将来的发展打下更坚实的基础。",
  },
  {
    task: "随着人工智能的发展，很多人认为将来没有必要再学习外语了。你同意这种看法吗？请谈谈你的观点。",
    model:
      "如今，翻译软件已经能在几秒钟内把一段话译成几十种语言。于是有人认为，学习外语已经没有必要了。我不同意这种看法。我认为，即使在人工智能时代，学习外语仍然很有价值。\n\n第一，语言不只是交流的工具，更是理解另一种文化的途径。学习一门外语，就是学习另一种看世界的方法。比如，汉语里有许多表示亲属关系的词，学习这些词的过程，也是了解中国家庭观念的过程。机器可以把词语翻译过来，却无法替我们体会这些词语背后的文化。\n\n第二，面对面的交流需要的不仅是准确的意思，还有情感和信任。在商务谈判或者交朋友的时候，能直接用对方的语言说几句话，常常比通过机器说一百句更能拉近距离。而且，机器翻译仍然会出错，在法律、医疗等重要场合，一个小错误就可能带来严重后果，懂外语的人才能及时发现问题。\n\n第三，学习外语本身能锻炼思维。研究表明，掌握两种语言的人在注意力和解决问题方面往往表现更好。学习的过程比结果更重要，这一点是任何软件都无法代替的。\n\n当然，我并不否认人工智能的作用。对于短期旅行或者简单的信息查询，翻译软件确实方便，人们不必为此专门学习一门语言。但这只能说明学习外语的目的变了，而不能说明学习外语没有必要了。\n\n总之，人工智能可以帮助我们跨越语言的障碍，却不能代替我们去理解另一种文化、建立真正的联系。因此，外语仍然值得我们花时间认真学习。",
  },
  {
    task: "有人主张城市应该限制私家车的数量，以减少交通拥堵和空气污染；也有人认为买车、用车是个人的自由，不应该限制。谈谈你的看法。",
    model:
      "汽车给人们的出行带来了方便，也给城市带来了拥堵和污染。对于是否应该限制私家车的数量，我的看法是：在大城市，适当限制是必要的，但限制必须和改善公共交通同时进行。\n\n首先，城市道路是有限的公共资源。一辆私家车平均只坐一两个人，却要占用比公交车上每位乘客多得多的道路面积。如果不加限制，车辆增加的速度永远会超过修路的速度，最后所有人都被堵在路上。从这个意义上说，限制私家车并不是剥夺个人自由，而是为了保证大多数人都能顺利出行。\n\n其次，限制私家车有利于保护环境和居民健康。汽车尾气是城市空气污染的重要来源之一。一些城市实行限购、限行以后，交通高峰时的车速提高了，空气质量也有所改善。这说明合理的政策确实能够带来实际效果。\n\n当然，反对者的意见也值得重视。有的人住在公共交通不便的地方，或者需要接送老人、孩子，对他们来说，私家车几乎是生活的必需品。如果只是简单地限制，而不提供其他选择，这些人的生活就会受到很大影响，政策也难以得到支持。\n\n因此，我认为限制私家车应当与发展公共交通结合起来：增加地铁和公交线路，提高准点率，改善步行和骑车的环境，同时对确有需要的家庭给予照顾。只有让人们觉得不开车也很方便，限制私家车的政策才能真正被接受，城市交通也才能真正好起来。",
  },
  {
    task: "很多家长从孩子很小的时候起就为他们安排各种课外班。有人认为这能让孩子赢在起跑线上，也有人认为这剥夺了孩子的童年。你怎么看？",
    model:
      "现在，不少孩子从三四岁起就开始上英语班、钢琴班、数学班，周末比上班的父母还忙。我认为，过多的课外班弊大于利，家长应当把选择的权利更多地交给孩子，给孩子留出自由玩耍的时间。\n\n首先，童年的玩耍本身就是一种重要的学习。孩子在自由游戏中学会想象、尝试和解决问题，也学会和同伴相处。这些能力很难在课堂上教会，却会影响孩子的一生。如果孩子的时间被课外班排满，他们就失去了自己探索世界的机会。\n\n其次，被迫学习往往难以持久。很多孩子小时候学了好几年乐器，长大后却再也不碰，原因就在于当初学习并非出于兴趣。兴趣是最好的老师，家长强行安排的课程，很可能让孩子对学习本身产生厌倦。所谓“赢在起跑线上”，最后也许会输在终点。\n\n诚然，课外班并非毫无价值。对于真正感兴趣的孩子，专业的指导可以让他们进步得更快；对于双职工家庭，课外班也解决了无人照看孩子的问题。因此，我反对的不是课外班本身，而是不顾孩子意愿、越多越好的做法。\n\n由此可见，家长在安排课外班时，应该先观察孩子的兴趣，让孩子参与选择，并且控制数量，保证孩子每天都有一段属于自己的时间。教育不是一场短跑，而是一场马拉松。保护好孩子的好奇心和学习热情，比让他们早早学会多少知识更加重要。",
  },
  {
    task: "有人说：“读万卷书，不如行万里路。”你是否同意这种说法？请结合实际谈谈你的看法。",
    model:
      "“读万卷书，不如行万里路”这句话强调了亲身经历的重要。我认为，旅行和读书各有不可替代的价值，二者不是谁胜过谁的关系，而是应当相互结合。\n\n一方面，行路确实能带来书本给不了的体验。书上写着长城有多长、有多古老，但只有站在城墙上，看着它在山间延伸，人才能真正感受到古代工程的伟大。旅行还让人接触不同的风俗和生活方式，学会尊重和理解与自己不同的人。这些体会是亲身得来的，因而格外深刻。\n\n另一方面，读书是行路的基础。如果事先不了解一个地方的历史和文化，旅行很可能只是拍照和购物，看到了风景，却看不懂风景。一个读过有关丝绸之路的书的人，走在敦煌的沙漠里，看到的就不仅是沙子，而是千百年来商人和僧人留下的足迹。可见，读书决定了我们在旅途中能看到多少。\n\n还应该看到，书籍能够带我们去到脚步无法到达的地方：遥远的过去、宇宙的深处、他人的内心。一个人一生能走的路是有限的，而书中的世界几乎是无限的。在这个意义上，说读书不如行路，显然有些片面。\n\n总之，读书使人有准备地去看世界，行路使人更深地理解所读的书。两者结合，知识才会变成真正的见识。与其争论哪个更重要，不如在读书中行路，在行路中读书。",
  },
  {
    task: "越来越多的公司允许员工在家远程办公。你认为远程办公是否会成为未来工作的主要方式？请说明理由。",
    model:
      "网络技术的发展让远程办公成为可能，一些公司甚至取消了固定的办公室。不过我认为，远程办公不会完全成为未来工作的主要方式，更可能出现的是在家和到公司相结合的混合模式。\n\n首先，远程办公的优点是明显的。员工节省了上下班路上的时间，可以更灵活地安排工作和生活；公司则可以减少租用办公室的费用，还能招聘住在其他城市甚至其他国家的人才。对于需要安静、集中精力完成的工作，比如写报告、编程序，在家工作的效率往往更高。\n\n但是，远程办公也有难以克服的缺点。很多创新来自同事之间随意的交流，一次午饭时的聊天，也许就能产生一个新想法，而这种交流在视频会议中很难出现。此外，新员工需要在有经验的同事身边学习，长期远程工作不利于他们成长。还有不少人发现，在家工作很难把工作和生活分开，反而更容易感到疲劳和孤独。\n\n其次，并不是所有工作都能远程完成。医生、厨师、工人、教师等大量职业，都必须在现场工作。即使在办公室工作的行业中，重要的谈判和团队合作也常常需要面对面进行。\n\n因此，我认为未来的工作方式会更加灵活：员工每周有几天在家完成需要专心的任务，另外几天到公司开会、讨论和合作。这种模式既保留了远程办公的方便，又保留了面对面交流的价值，比单一的方式更符合大多数人和公司的需要。",
  },
  {
    task: "有人认为，保护传统文化最好的办法是让它保持原来的样子；也有人认为，传统文化只有不断创新才能传下去。你怎么看？",
    model:
      "面对快速变化的现代社会，传统文化应该原样保存，还是应该创新发展？我认为，传统文化的核心精神需要认真保护，而它的表现形式则需要创新，只有这样，它才能真正活在人们的生活中。\n\n首先，没有人使用的文化，即使保存得再完整，也只能放在博物馆里。许多传统手工艺之所以消失，不是因为不够精美，而是因为不再适应现代人的生活需要。相反，一些地方把传统刺绣用在服装和日用品的设计上，不但让老手艺找到了市场，也让年轻人愿意去学习。可见，创新恰恰是传承的动力。\n\n其次，传统文化本身就是在不断变化中形成的。今天我们视为“传统”的京剧，在历史上也吸收过多种地方戏曲的特点。如果古人只是原样保存前人的东西，也就不会有我们今天所说的传统。\n\n当然，强调保持原样的人也有他们的道理。有些所谓的创新只是为了吸引注意，把传统文化变成了简单的符号，甚至歪曲了它的意思。这样的“创新”不但没有帮助传承，反而让人误解了传统。因此，创新必须以了解为前提，尊重文化原来的精神和规律。\n\n总之，保护传统文化不应当是把它冻结起来，而应当在理解它的基础上，让它与当代生活重新连接。对于一些珍贵的技艺和资料，我们应当完整记录、认真保存；对于它们的应用和传播，则应当大胆创新。这样，传统文化才能既有根，又有生命力。",
  },
  {
    task: "有人认为，名人有义务在社会上起到榜样作用；也有人认为，名人也是普通人，不应该被要求过高。谈谈你的看法。",
    model:
      "演员、运动员、网络红人等名人拥有大量支持者，他们的一言一行常常受到公众关注。我认为，名人虽然也是普通人，但由于他们影响力大，确实应当承担比普通人更多的社会责任，在公共场合起到积极的榜样作用。\n\n首先，影响力本身就意味着责任。一个普通人说错一句话，影响的可能只是身边几个人；而一个拥有几百万支持者的名人，一句话就可能改变很多人的看法和行为。特别是青少年，常常会模仿自己喜欢的明星。如果名人公开宣传不健康的生活方式，造成的危害是普通人无法相比的。\n\n其次，名人的名声和收入在很大程度上来自公众的支持。既然从社会中得到了这么多，也就应当回报社会。许多名人参加公益活动，呼吁大家保护环境、关心弱势群体，就很好地发挥了正面作用。\n\n不过，我也认为对名人的要求应当有合理的界限。名人应当在公开言行上遵守法律和社会公德，但他们的私人生活应当受到尊重。有些人把名人当成完美的人，任何小的缺点都要放大批评，这既不公平，也没有必要。\n\n总之，名人不必成为完美的人，但应当意识到自己的影响力，在公共领域谨慎言行，起到积极的作用。而公众也应当理性看待名人，既不盲目崇拜，也不过分苛求，这样才能形成健康的社会风气。",
  },
  {
    task: "现在很多人习惯在网上购物，有人担心实体商店会因此消失。你认为实体商店还有存在的必要吗？",
    model:
      "网上购物方便、快捷，价格往往也更便宜，这使得不少实体商店经营困难，有的甚至关门。但我认为，实体商店不会消失，它们仍有存在的必要，只是需要改变自己的角色。\n\n首先，实体商店能够提供网上购物无法提供的体验。买衣服可以当场试穿，买家具可以亲手摸一摸材料、坐一坐椅子，买食品可以先尝一尝。对于这些需要亲身感受的商品，很多顾客仍然愿意去实体店。而且，在店里买东西不用等待快递，退换也更方便。\n\n其次，实体商店还是重要的社交和休闲场所。人们逛商场，常常不只是为了买东西，也是为了和家人朋友一起吃饭、看电影、消磨时间。一些书店把读书、喝咖啡和举办讲座结合起来，吸引了大量读者，就是一个很好的例子。\n\n再次，实体商店对社区生活意义重大。对于不习惯使用手机的老人来说，楼下的小超市和菜市场是生活中不可缺少的部分。小店的老板认识每一位顾客，这种人与人之间的温暖，是网上商店给不了的。\n\n当然，实体商店也必须看到挑战。如果仍然只是简单地把商品摆在货架上，它们很难和网上商店竞争。实体商店应当发挥自己的长处，注重服务和体验，同时也可以开设网上渠道，实现线上和线下的结合。\n\n总之，网上购物改变了商业的面貌，但并不意味着实体商店的终结。能够不断创新、满足顾客多种需要的实体商店，将来依然会有自己的位置。",
  },
  {
    task: "有人认为，考试成绩是评价学生最公平的方法；也有人认为，只看成绩会忽视学生其他方面的能力。请谈谈你的观点。",
    model:
      "考试几乎伴随着每个学生的成长，成绩也常常决定着升学的机会。我认为，考试在一定程度上是公平的评价方法，但只看成绩是不够的，应当建立更加全面的评价方式。\n\n首先，必须承认考试有它的长处。同样的试题、同样的标准、同样的时间，在很大程度上减少了人情和关系的影响。对于家庭条件一般的学生来说，考试常常是靠自己努力改变命运的重要途径。从这个意义上说，考试的公平性是值得珍惜的。\n\n然而，考试能衡量的能力是有限的。一张试卷可以考查知识的掌握程度，却很难考查一个人的创造力、合作精神和动手能力。有的学生成绩一般，却特别善于组织活动；有的学生考试不突出，却在艺术或体育方面很有天赋。如果只看分数，这些学生的才能就会被忽视，他们也可能因此失去自信。\n\n其次，只看成绩还会影响教育本身。当分数成为唯一的目标时，学校和学生都会把大量时间用于应试训练，阅读、运动和社会实践的时间被压缩。这样培养出来的学生，也许很会考试，却不一定能适应复杂多变的社会。\n\n因此，我认为合理的做法是：保留考试的基础作用，同时把平时表现、综合实践和特长发展纳入评价，并保证这些评价公开、透明、有据可查。这样既能保持考试的公平，又能让每个学生的长处被看到，使教育真正促进人的全面发展。",
  },
  {
    task: "一些城市在老城区改造中拆除了大量旧建筑，建起了新的高楼。你认为城市发展中应该如何对待旧建筑？",
    model:
      "城市在发展过程中，常常面临一个选择：拆掉旧建筑建设新城，还是保留旧建筑守住历史。我认为，旧建筑不应当被简单地拆除，城市应当在保护有价值的旧建筑的基础上进行改造和更新。\n\n首先，旧建筑是城市历史的见证。一条老街、一座老房子，记录着一座城市过去的生活方式和建筑技术，也承载着几代居民的共同记忆。如果把它们都拆掉，城市虽然变新了，却失去了自己的特点，到处都是相似的高楼，人们也就很难对城市产生归属感。\n\n其次，保护旧建筑同样可以带来经济效益。许多城市把老厂房改造成艺术区，把老街修缮后发展成文化旅游区，吸引了大量游客，也为当地居民创造了就业机会。可见，保护与发展并不是对立的。\n\n当然，我们也要面对现实。不少旧建筑年久失修，存在安全隐患，居民的生活条件也比较差，要求改善居住环境的愿望是完全合理的。因此，保护并不意味着一切都不能动。\n\n我认为，比较合理的做法是先进行认真的调查和评估：对于具有历史和艺术价值的建筑，应当严格保护，并在不破坏原貌的前提下改善内部设施；对于价值不大且存在安全问题的建筑，可以拆除重建，但新建筑应当与周围的环境相协调。同时，改造过程应当听取居民的意见。只有这样，城市才能既拥有现代化的生活条件，又保留自己的历史和个性。",
  },
  {
    task: "有人认为，年轻人应该先找一份稳定的工作；也有人认为，年轻人应该趁年轻多尝试、敢冒险。你更赞成哪一种看法？",
    model:
      "刚走上社会的年轻人常常面临这样的选择：是进入一个稳定的单位，还是去做自己喜欢但前途不确定的事情。我更赞成后一种看法：年轻人应当趁年轻多尝试，但这种尝试需要有准备、有方向。\n\n首先，年轻是尝试成本最低的时期。二十多岁的人，家庭负担相对较轻，即使失败了，也有足够的时间和精力重新开始。等到上有老、下有小的时候，再想改变方向就困难得多。因此，在可以承受风险的阶段多做尝试，是对自己未来的投资。\n\n其次，只有经过尝试，人才能真正了解自己。很多人在学校里选择专业时，并不清楚自己适合做什么。通过在不同的岗位、不同的城市甚至不同的行业里工作，年轻人才会发现自己的兴趣和长处在哪里。这比在一份不喜欢的工作中坚持十年更有意义。\n\n当然，追求稳定的人也有他们的理由。稳定的工作能提供可靠的收入和保障，让人可以安心生活，这对于经济条件不好的家庭尤其重要。而且，盲目跳槽、频繁更换方向，也可能让人什么都没有学精。\n\n所以，我所赞成的冒险，不是没有计划的冲动，而是在认真思考的基础上，给自己设定一个目标和期限，在每一次尝试中积累能力和经验。年轻时的经历，无论成功还是失败，都会成为将来最宝贵的财富。",
  },
];

/** translationTasks are English texts of 80 to 150 words to translate into Chinese. */
export const translationTasks: readonly PaperItem[] = [
  {
    task: "Many cities around the world are now planting trees on the roofs of buildings. These roof gardens help to cool the buildings in summer, which means people use less electricity for air conditioning. They also collect rainwater, so less water runs into the streets during heavy storms. In addition, they give birds and insects a place to live in the middle of the city. Although building a roof garden costs more at first, many owners find that it saves money in the long run.",
    model:
      "现在，世界上许多城市都在楼顶上种树。这些屋顶花园能在夏天给楼房降温，这意味着人们用于空调的电会减少。屋顶花园还能收集雨水，因此下大雨时流到街道上的水会少一些。此外，它们还在城市中心为鸟类和昆虫提供了栖息的地方。虽然建造屋顶花园一开始花费较高，但很多业主发现，从长远来看，它能节省开支。",
  },
  {
    task: "Last year, a small town in the mountains opened its first public library. Before that, the nearest library was two hours away by bus. In the first six months, more than three thousand people borrowed books, almost half of the town's population. The library also holds reading classes for children on weekends and teaches older people how to use computers. The head of the library says that her goal is not only to lend books, but to make the library a place where everyone in the town can meet and learn together.",
    model:
      "去年，山里的一个小镇开设了第一家公共图书馆。在此之前，离这里最近的图书馆坐公交车要两个小时。开馆后的头六个月里，就有三千多人借过书，差不多是全镇人口的一半。图书馆还在周末为孩子们开设读书课，并教老年人使用电脑。图书馆馆长说，她的目标不仅是借书给大家，更要让图书馆成为全镇人都能在一起交流、学习的地方。",
  },
  {
    task: "Scientists have found that taking a short walk after a meal can help to control blood sugar. In a recent study, people who walked for just ten minutes after eating had lower blood sugar levels than those who sat down. The effect was strongest when the walk began within half an hour of the meal. The researchers point out that the walk does not need to be fast: a slow, easy pace is enough. They suggest that this simple habit could be especially helpful for older people.",
    model:
      "科学家发现，饭后散一会儿步有助于控制血糖。在最近的一项研究中，饭后只走了十分钟的人，血糖水平比饭后坐着的人低。如果在饭后半小时之内开始散步，效果最明显。研究人员指出，散步不需要走得很快，慢慢地、轻松地走就够了。他们认为，这个简单的习惯对老年人可能特别有帮助。",
  },
  {
    task: "More and more young people are choosing to repair their old things instead of throwing them away. In some cities, volunteers run free repair cafés once a month, where people can bring broken lamps, clothes or bicycles and learn to fix them. Organisers say that repairing not only saves money and reduces waste, but also gives people a sense of achievement. One visitor said she used to buy a new kettle whenever the old one broke, but now she enjoys finding out what is wrong and solving the problem herself.",
    model:
      "越来越多的年轻人选择修理旧东西，而不是把它们扔掉。在一些城市，志愿者每个月开办一次免费的“修理咖啡馆”，人们可以把坏了的台灯、衣服或者自行车带来，学习自己修理。组织者说，修理不仅能省钱、减少垃圾，还能让人获得成就感。一位来访者说，她以前水壶一坏就买新的，现在却喜欢找出毛病在哪儿，自己解决问题。",
  },
  {
    task: "The company announced on Monday that it would allow all its employees to work from home two days a week, starting next month. The decision came after a survey in which more than seventy percent of staff said they would prefer a more flexible schedule. Managers will still hold team meetings in the office every Tuesday. The company expects the new policy to reduce the cost of office space and help it attract talented people who live far from the city.",
    model:
      "该公司周一宣布，从下个月起，全体员工每周可以有两天在家办公。此前公司进行了一项调查，七成以上的员工表示希望工作时间更加灵活，公司随后作出了这一决定。经理们仍将每周二在办公室召开团队会议。公司预计，这项新政策将减少办公场所的费用，并有助于吸引住在离市区较远的优秀人才。",
  },
  {
    task: "For a long time, people believed that goldfish could remember things for only three seconds. However, experiments have shown that this is not true. In one study, goldfish were trained to push a small lever to get food. Even after the lever had been removed for several weeks, the fish still went to the same place when it was put back. Researchers say that goldfish can remember information for months, and that they can even learn to recognise the person who feeds them.",
    model:
      "长期以来，人们一直以为金鱼的记忆只有三秒钟。然而，实验表明，事实并非如此。在一项研究中，金鱼经过训练，学会了推动一根小杠杆来获取食物。即使杠杆被拿走了几个星期，等它重新放回去时，金鱼仍然会游到同一个地方。研究人员说，金鱼能把信息记住好几个月，甚至能学会认出喂它们的人。",
  },
  {
    task: "Dear Ms Chen, thank you for your email of 12 March. I am pleased to confirm that our team can visit your factory on 3 April. We plan to arrive at about ten in the morning and stay until four in the afternoon. During the visit, we would like to see the production line and discuss the delivery schedule for the next six months. Could you please let us know whether you can arrange a meeting room for the afternoon? We look forward to meeting you. Best regards, David Wilson.",
    model:
      "尊敬的陈女士：您好！感谢您3月12日的来信。我很高兴地确认，我们团队可以在4月3日参观贵厂。我们计划上午十点左右到达，下午四点离开。参观期间，我们希望看一看生产线，并商讨今后六个月的交货安排。能否请您告知，下午是否可以为我们安排一间会议室？期待与您见面。此致敬礼！戴维·威尔逊",
  },
  {
    task: "Sleep is not just a time when the body rests. While we sleep, the brain sorts the information it has received during the day, keeping what is important and letting go of the rest. This is why students who sleep well after studying often remember more than those who stay up late. Experts recommend that teenagers sleep eight to ten hours a night. They also advise putting away phones an hour before bed, because the light from the screen can make it harder to fall asleep.",
    model:
      "睡眠不只是身体休息的时间。在我们睡觉的时候，大脑会整理白天接收到的信息，保留重要的内容，放下其余的部分。这就是为什么学习之后睡得好的学生，往往比熬夜的学生记住得更多。专家建议，青少年每晚应睡八到十个小时。他们还建议睡前一小时把手机放到一边，因为屏幕发出的光会让人更难入睡。",
  },
  {
    task: "The old railway station in the city centre, closed for nearly twenty years, has reopened as a museum of local history. The building's original clock tower and waiting hall have been carefully restored, while a new glass roof lets in natural light. Inside, visitors can see photographs, tickets and uniforms from the time when the station was the busiest in the region. Entry is free for children and students, and the museum is open every day except Monday.",
    model:
      "市中心的老火车站关闭了将近二十年，现在作为本地历史博物馆重新开放了。车站原有的钟楼和候车大厅经过了精心修复，新加的玻璃屋顶让自然光照了进来。在馆内，游客可以看到车站作为本地区最繁忙车站时期的照片、车票和制服。儿童和学生可免费参观，博物馆除周一外每天开放。",
  },
  {
    task: "A growing number of farmers are using small drones to look after their fields. Flying over the crops, a drone can take pictures that show which plants need more water and which ones are sick. Farmers can then treat only the parts of the field that have problems, instead of spraying the whole area. This saves time and money, and it also means that fewer chemicals end up in the soil and rivers. However, some older farmers say that the technology is still too expensive and difficult to learn.",
    model:
      "越来越多的农民开始用小型无人机照看自己的田地。无人机从庄稼上方飞过，拍下的照片能显示哪些植物需要更多的水，哪些生了病。这样，农民就可以只处理田里出问题的部分，而不必给整片地都喷药。这既节省了时间和金钱，也意味着进入土壤和河流的化学物质会减少。不过，一些年纪较大的农民说，这种技术还是太贵，也太难学。",
  },
  {
    task: "When she was eight, Maria found an injured bird in her garden and cared for it until it could fly again. That experience led her to study animal medicine. Today, at thirty-five, she runs a small hospital for wild animals on the edge of the city. Each year it treats around two thousand animals, from hedgehogs to owls, and returns most of them to nature. The hospital depends entirely on donations and on a team of forty volunteers, some of whom come every weekend.",
    model:
      "玛丽亚八岁的时候，在自家花园里发现了一只受伤的小鸟，她一直照顾它，直到它能重新飞起来。这段经历让她后来学习了动物医学。如今三十五岁的她，在城市边上经营着一家小型野生动物医院。医院每年救治大约两千只动物，从刺猬到猫头鹰都有，其中大部分被放归自然。这家医院完全依靠捐款和一支由四十名志愿者组成的队伍维持，其中有些志愿者每个周末都会来。",
  },
  {
    task: "Online courses have made it possible for anyone with an internet connection to study at a top university. Yet studies show that only a small share of the people who sign up for a free online course actually finish it, often fewer than one in ten. Researchers believe the main reason is that learning alone requires strong self-discipline. Courses that set clear deadlines, put students into small discussion groups and give regular feedback tend to have much higher completion rates.",
    model:
      "网络课程使任何能上网的人都有可能在一流大学学习。然而研究表明，报名参加免费网络课程的人中，真正学完的只占很小一部分，常常不到十分之一。研究人员认为，主要原因在于独自学习需要很强的自律能力。那些设定明确截止日期、把学生分成小组讨论并且定期给予反馈的课程，完成率往往要高得多。",
  },
];
