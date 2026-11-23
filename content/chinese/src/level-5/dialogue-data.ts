// The dialogues of level 5 with their questions (docs/chinese-curriculum.md §8.4), written for this package in the characters taught by the end of their unit; none is taken from a test.

import type { LevelDialogues } from "../level-1/dialogues.ts";

/** dialogues are the dialogue listening topics of level 5, ending its sixth and twelfth units. */
export const dialogues: readonly LevelDialogues[] = [
  {
    unit: 6,
    data: `
女：星期六社区安排大家去养老院当志愿者，你去不去？
男：去啊，上次去陪老人下棋，他们高兴得不得了，我也觉得特别有意义。
女：这次除了下棋，还要帮他们打扫房间，你可以早点儿来吗？
男：没问题，我八点就到。
问：男的上次去养老院做了什么？
据：男的说“上次去陪老人下棋，他们高兴得不得了”。 | The man says that last time he played chess with the old people, and they were delighted.
答：陪老人下棋
错：给老人捐款 | 对话没有说到捐款。 | Donating money is never mentioned.
错：帮老人打扫房间 | 打扫房间是女的说的“这次”要做的，不是上次。 | Cleaning is what the woman says they will do this time, not last time.
错：给老人做饭 | 对话没有说到做饭。 | Cooking is never mentioned.
问：这次去养老院，还要做什么？
据：女的说“这次除了下棋，还要帮他们打扫房间”。 | The woman says this time, besides chess, they will help clean the rooms.
答：帮老人打扫房间
错：给老人捐钱 | 对话没有说到捐钱。 | Giving money is never mentioned.
错：教老人上网 | 对话没有说教老人上网。 | Teaching them to go online is never mentioned.
错：给老人买菜 | 对话没有说买菜。 | Buying groceries is never mentioned.

男：你儿子考上硕士了？真为你高兴！
女：谢谢！说实话，他本科的时候成绩一般，后来突然变了，每天在图书馆待到很晚。
问：关于女的的儿子，可以知道什么？
据：女的说“他本科的时候成绩一般，后来突然变了”。“一般”就是不算好。 | The woman says his undergraduate marks were ordinary before he suddenly changed; ordinary means not good.
答：本科时成绩不算好
错：本科时成绩一直很好 | 女的说的是“成绩一般”，不是一直很好。 | She says ordinary, not consistently good.
错：他不喜欢去图书馆 | 女的说他后来“每天在图书馆待到很晚”。 | She says he later stayed in the library late every day.
错：他正在读本科 | 他已经考上硕士了，本科读完了。 | He has got into a master's, so his undergraduate years are over.
问：女的说话时心情怎么样？
据：男的说“真为你高兴”，女的说“谢谢”，讲儿子的变化时也很自豪，她很高兴。 | The man says he is happy for her, she thanks him and speaks proudly of her son, so she is glad.
答：很高兴
错：很担心 | 儿子刚考上硕士，没有让她担心的事。 | Her son has just got in, so there is nothing to worry about.
错：很失望 | 儿子考上了，她不会失望。 | He succeeded, so she is not disappointed.
错：很生气 | 对话里没有让她生气的事。 | Nothing in the dialogue angers her.

女：楼下的垃圾又要分成四种了，我每次处理垃圾都要想半天。
男：其实不难，吃不完的饭菜放厨余垃圾，塑料、玻璃和纸放可回收的，电池单独放。
女：那用过的塑料袋呢？
男：干净的可以回收，不干净的就只能放其他垃圾了。
问：男的觉得垃圾分类怎么样？
据：男的说“其实不难”，接着把怎么分说了一遍。 | The man says it is actually not hard and then explains how to sort.
答：并不难
错：太复杂了 | 觉得复杂的是女的，男的说不难。 | It is the woman who finds it complex; the man says it is easy.
错：没有用 | 男的没有说垃圾分类没有用。 | He does not say sorting is useless.
错：很浪费时间 | 要想半天的是女的，男的没有说浪费时间。 | It is the woman who spends ages; the man does not call it a waste of time.
问：根据男的的话，吃不完的饭菜应该放在哪儿？
据：男的说“吃不完的饭菜放厨余垃圾”。 | The man says leftover food goes in food waste.
答：厨余垃圾
错：可回收垃圾 | 可回收的是塑料、玻璃和纸。 | Recyclables are plastic, glass and paper.
错：其他垃圾 | 其他垃圾放的是不干净的塑料袋。 | General waste takes dirty plastic bags.
错：和电池放在一起 | 电池要单独放，不和饭菜放在一起。 | Batteries go on their own, not with food.

男：我爷爷的手机坏了，非要我修，不愿意换新的。
女：老人用惯了一样东西，就不想改变。你把新手机的字调大一点儿，再教他几遍，他也许就接受了。
问：女的建议男的怎么做？
据：女的说“你把新手机的字调大一点儿，再教他几遍”。 | The woman says to enlarge the new phone's text and teach him a few times.
答：调好新手机，多教爷爷几遍
错：把爷爷的旧手机修好 | 修旧手机是爷爷要的，女的建议的是换新的并教他。 | Repairing the old phone is what Grandpa wants; she suggests the new one and teaching him.
错：让爷爷自己去买手机 | 女的没有让爷爷自己去买。 | She does not say Grandpa should buy one himself.
错：别管这件事 | 她给出了办法，没有说别管。 | She offers a plan, not to drop it.
问：爷爷为什么不想换手机？
据：女的说“老人用惯了一样东西，就不想改变”。 | The woman says old people used to something do not want change.
答：用惯了旧的
错：新手机太贵 | 对话没有说新手机的价钱。 | The new phone's price is never mentioned.
错：旧手机还很好用 | 男的说爷爷的手机“坏了”，不是还很好用。 | The man says the phone is broken, not working well.
错：他不会打电话 | 对话没有说爷爷不会打电话。 | Nothing says Grandpa cannot make calls.

女：今年除夕你回老家过年吗？
男：回不去了，公司安排我值班。不过我已经给爸妈寄了年货，到时候跟他们视频一起吃年夜饭。
女：那也很好，一家人能见到面就行。
男：是啊，等元宵节前我再请几天假回去。
问：男的今年除夕为什么不回家？
据：男的说“回不去了，公司安排我值班”。 | The man says he cannot go because the company has put him on duty.
答：要在公司值班
错：买不到车票 | 他没有说车票的事。 | He says nothing about tickets.
错：父母要来看他 | 他要跟父母视频，父母没有来看他。 | He will video-call his parents; they are not visiting.
错：他要出国旅行 | 他要值班，不是出国旅行。 | He is on duty, not travelling abroad.
问：男的打算怎么和家人过除夕？
据：男的说“到时候跟他们视频一起吃年夜饭”。 | The man says he will eat the New Year's Eve dinner with them over video.
答：通过视频一起吃年夜饭
错：回老家吃年夜饭 | 他回不去老家。 | He cannot go home.
错：请父母到饭店吃饭 | 对话没有说饭店。 | No restaurant is mentioned.
错：元宵节以后再过年 | 元宵节前他是请假回家，不是那时候再过年。 | Before the Lantern Festival he will take leave to visit; it is not when he celebrates the New Year.

男：您好，我想办一张公交卡，需要带什么？
女：带上身份证就行，在那边窗口填一张表，交二十块钱。
问：男的想做什么？
据：男的说“我想办一张公交卡”。 | The man says he wants a transit card.
答：办公交卡
错：交罚款 | 对话没有说罚款，二十块是办卡的钱。 | No fine is mentioned; twenty kuai is the card fee.
错：买地铁票 | 他办的是公交卡，不是买地铁票。 | He wants a transit card, not an underground ticket.
错：换身份证 | 身份证是要带去的，不是要换的。 | The ID card is what he brings, not what he replaces.
问：办卡需要带什么？
据：女的说“带上身份证就行”。 | The woman says the ID card is all he needs.
答：身份证
错：照片 | 她没有说照片。 | She does not mention a photo.
错：工作证 | 她说的是身份证，不是工作证。 | She says ID card, not work pass.
错：学生证 | 她说的是身份证，不是学生证。 | She says ID card, not student card.

女：这次期中考试，我们班有个同学作弊被老师发现了。
男：真不应该。考得不好可以再努力，诚实可是最重要的。
女：他自己也很后悔，已经向老师和同学们承认错误了。
问：男的认为什么最重要？
据：男的说“考得不好可以再努力，诚实可是最重要的”。 | The man says one can work harder after a bad mark, but honesty is what matters most.
答：诚实
错：成绩 | 他说考得不好可以再努力，成绩不是最重要的。 | He says poor marks can be mended, so marks are not what matters most.
错：努力 | 努力是考得不好以后可以做的，他说最重要的是诚实。 | Effort is what follows a poor result; honesty is what matters most.
错：老师的看法 | 对话没有说老师的看法。 | The teacher's opinion is never discussed.
问：那个作弊的同学后来怎么样了？
据：女的说“他自己也很后悔，已经向老师和同学们承认错误了”。 | The woman says he regrets it and has admitted it to the teacher and class.
答：承认了错误
错：考了第一名 | 他作弊被发现了，没有说考了第一名。 | He was caught cheating; nothing says he came first.
错：离开了学校 | 对话没有说他离开学校。 | Nothing says he left school.
错：不承认作弊 | 他已经承认了错误。 | He has admitted it.

男：这个扫地机器人真不错，我出门前设好时间，回来家里就干净了。
女：我也想买一个，可是我家有好几层，机器人能自己上下楼吗？
男：那可不行，机器人只能在平的地方工作，你得每层放一个。
问：女的担心什么？
据：女的问“机器人能自己上下楼吗”，她家有好几层。 | The woman asks whether the robot can go up and down stairs, as her house has several floors.
答：机器人不能上下楼
错：机器人太贵 | 女的没有说价钱。 | She does not mention price.
错：机器人扫不干净 | 男的说回来家里就干净了，她没有担心扫不干净。 | The man says it cleans well, and she does not doubt that.
错：机器人声音太大 | 对话没有说到声音。 | Noise is never mentioned.
问：男的说扫地机器人有什么好处？
据：男的说“我出门前设好时间，回来家里就干净了”。 | The man says he sets the time before going out and comes back to a clean home.
答：可以设好时间自动打扫
错：可以自己上下楼 | 男的说“那可不行”，机器人不能上下楼。 | He says it cannot climb stairs.
错：不用充电 | 对话没有说充电。 | Charging is never mentioned.
错：可以帮忙做饭 | 机器人是扫地的，不做饭。 | The robot sweeps; it does not cook.

女：小王，这次在课堂上你回答得特别好，老师表扬你了。
男：谢谢老师！其实我昨天晚上预习了，还查了很多资料。
问：男的为什么回答得好？
据：男的说“我昨天晚上预习了，还查了很多资料”，就是提前做了准备。 | The man says he previewed last night and looked up much material: he prepared ahead.
答：他提前做了准备
错：他以前学过 | 他说的是昨天晚上预习，不是以前学过。 | He says he previewed last night, not that he had studied it before.
错：别人帮了他 | 他是自己预习、自己查资料，没有说别人帮他。 | He prepared on his own; no one helped.
错：问题很容易 | 他没有说问题容易，他是因为准备了。 | He does not say the questions were easy; he prepared.

男：最近空气太差了，雾霾这么严重，孩子们只能待在家里。
女：听说城市准备减少私家车，多建公交线路，还要把附近的工厂搬到郊区去。
男：这些措施要是能落实，几年以后情况应该会好不少。
女：我们自己也可以少开车，多坐地铁，多骑自行车。
问：他们在谈论什么问题？
据：男的说“最近空气太差了，雾霾这么严重”，后面说的措施都是为了让空气变好。 | The man says the air is bad and the smog severe, and all the measures that follow aim to clean the air.
答：空气污染
错：交通安全 | 少开车是为了空气，不是谈交通安全。 | Driving less is about air, not road safety.
错：孩子教育 | 孩子待在家里是因为雾霾，不是谈教育。 | The children stay in because of smog, not schooling.
错：工厂招工 | 工厂是要搬到郊区，没有说招工。 | The factories are moving out; hiring is never mentioned.
问：女的认为个人可以怎么做？
据：女的说“我们自己也可以少开车，多坐地铁，多骑自行车”。 | The woman says individuals can drive less and take the underground or cycle more.
答：少开车，多坐公共交通
错：把工厂搬到郊区 | 搬工厂是城市的措施，不是个人能做的。 | Moving factories is the city's measure, not an individual's.
错：让孩子待在家里 | 孩子待在家里是现在的情况，不是她的建议。 | Children staying in is the present situation, not her advice.
错：买一辆新车 | 她说少开车，不是买新车。 | She says drive less, not buy a car.
问：男的对这些措施是什么态度？
据：男的说“这些措施要是能落实，几年以后情况应该会好不少”。 | The man says that if carried out, the measures should make things much better in a few years.
答：觉得能起作用
错：觉得没有用 | 他说会好不少，不是没有用。 | He says it will help a lot.
错：表示反对 | 他说情况会好，没有反对。 | He expects improvement, so he does not object.
错：不感兴趣 | 他认真地谈了结果，不是不感兴趣。 | He discusses the outcome seriously, so he is interested.

女：明天端午节，我买了些粽子，你喜欢甜的还是有肉的？
男：我们南方人吃有肉的，里面再放一个鸡蛋，那才香呢。
问：男的喜欢什么样的粽子？
据：男的说“我们南方人吃有肉的，里面再放一个鸡蛋，那才香呢”。 | The man says southerners like him eat them with meat and an egg inside.
答：有肉和鸡蛋的粽子
错：甜的粽子 | 甜的是女的问的另一种，他选了有肉的。 | Sweet is the other kind she offers; he chooses meat.
错：什么粽子都不喜欢 | 他说那才香，是喜欢的。 | He says they are delicious, so he likes them.
错：自己包的粽子 | 粽子是女的买的，没有说自己包。 | She bought them; making them is not mentioned.

男：明天就要投票选业主委员会了，你准备选谁？
女：我想选三号楼的张阿姨，她平时很热心，小区里有什么问题她都第一个站出来。
男：我也觉得她不错，不过她年纪大了，不知道有没有那么多时间。
女：她刚退休，时间多着呢，而且她自己说愿意为大家服务。
问：女的为什么想选张阿姨？
据：女的说张阿姨“平时很热心，小区里有什么问题她都第一个站出来”。 | The woman says Auntie Zhang is warm-hearted and first to step up on any problem.
答：她对小区的事很热心
错：她年纪很大 | 年纪大是男的担心的地方，不是女的选她的理由。 | Her age is the man's worry, not the woman's reason.
错：她是女的的亲戚 | 对话没有说是亲戚。 | Nothing says they are related.
错：她刚刚搬来 | 张阿姨住在三号楼，刚退休，不是刚搬来。 | She lives in Block 3 and has just retired, not just moved in.
问：男的担心什么？
据：男的说“不过她年纪大了，不知道有没有那么多时间”。 | The man says she is old and he wonders if she has the time.
答：张阿姨没有时间
错：张阿姨不愿意 | 女的说张阿姨“愿意为大家服务”，男的也没有担心她不愿意。 | She says Auntie Zhang is willing, and he never doubts that.
错：张阿姨太年轻 | 男的说的是她年纪大了，不是太年轻。 | He says she is old, not young.
错：不知道在哪里投票 | 对话没有说投票的地方。 | The polling place is never mentioned.

女：我们公司打算给山区的学校捐一批电脑。
男：好事啊！不过那边老师会不会用？要不要请人去培训？
女：已经安排了，每个学校会有一个技术人员去待一周。
问：男的担心什么？
据：男的问“那边老师会不会用？要不要请人去培训”。 | The man asks whether the teachers there can use them and whether training is needed.
答：那边的老师不会用电脑
错：电脑不够用 | 他没有说电脑不够。 | He does not say there are too few computers.
错：公司没有钱 | 公司要捐电脑，没有说没钱。 | The company is donating, so money is not the issue.
错：路太远去不了 | 对话没有说路远。 | Distance is never mentioned.
问：公司怎么解决这个问题？
据：女的说“每个学校会有一个技术人员去待一周”。 | The woman says a technician will spend a week at each school.
答：安排技术人员去教
错：多捐一些电脑 | 问题是会不会用，多捐电脑解决不了。 | The problem is skill, which more computers would not solve.
错：让老师到城里学习 | 是技术人员去学校，不是老师到城里。 | Technicians go to the schools, not teachers to the city.
错：请学生帮忙 | 对话没有说学生帮忙。 | Students helping is never mentioned.

男：你怎么天天自己带碗去食堂？
女：食堂的碗都是一次性的，用一次就不要了，太浪费，我自己带一个可以反复用。
问：女的为什么自己带碗？
据：女的说一次性的碗“用一次就不要了，太浪费，我自己带一个可以反复用”。 | The woman says the disposable bowls are thrown away after one use, too wasteful, so she brings her own.
答：为了减少浪费
错：食堂的饭不好吃 | 对话没有说饭不好吃。 | The food is never criticised.
错：食堂没有碗 | 食堂有碗，只是一次性的。 | The canteen has bowls; they are disposable.
错：她的碗很漂亮 | 她带碗是为了不浪费，没有说碗漂亮。 | She brings it to avoid waste, not because it is pretty.
问：关于食堂的碗，可以知道什么？
据：女的说食堂的碗“都是一次性的，用一次就不要了”。 | The woman says the canteen's bowls are all disposable, used once.
答：只能用一次
错：可以反复用 | 能反复用的是她自己的碗。 | It is her own bowl that is reusable.
错：要另外交钱 | 对话没有说另外交钱。 | No extra charge is mentioned.
错：数量不够 | 对话没有说碗不够。 | No shortage is mentioned.

女：你看，这个路口的红绿灯坏了，车都不知道该怎么走。
男：我已经打电话给交通部门了，他们说半个小时内就有人过来。
女：那我们先在路边帮忙看着点儿，别让小孩子过马路。
男：好，我站这边，你站那边。
问：男的已经做了什么？
据：男的说“我已经打电话给交通部门了”。 | The man says he has already phoned the traffic department.
答：给交通部门打了电话
错：修好了红绿灯 | 红绿灯还坏着，要等人来修。 | The lights are still broken, waiting for repair.
错：送小孩过了马路 | 他们是要拦住小孩，不让他们过马路。 | They plan to stop children crossing, not to see them across.
错：开车离开了 | 他还在路口，没有开车走。 | He is still at the junction.
问：他们接下来要做什么？
据：女的说“我们先在路边帮忙看着点儿，别让小孩子过马路”，男的说“好”。 | The woman suggests they stand by the road and keep children from crossing, and he agrees.
答：在路口照看行人
错：去找交通部门 | 男的已经打过电话，不用再去找。 | He has already phoned, so no need to go.
错：自己管理车辆 | 他们看着的是行人，车辆等交通部门来管。 | They watch pedestrians; the traffic is left to the department.
错：回家等消息 | 他们留在路口，不是回家。 | They stay at the junction, not go home.

男：听说你在学书法，难不难？
女：刚开始连笔都拿不好，现在每天练一个小时，老师说我进步很快。
男：我也想学，可是工作太忙了。
女：其实每天抽二十分钟就够了，关键是要坚持。
问：女的现在每天练多长时间书法？
据：女的说“现在每天练一个小时”。 | The woman says she now practises an hour a day.
答：一个小时
错：二十分钟 | 二十分钟是她说男的每天抽出来就够的时间。 | Twenty minutes is what she says would be enough for him.
错：半个小时 | 她说的是一个小时，不是半个小时。 | She says an hour, not half an hour.
错：两个小时 | 她说的是一个小时，不是两个小时。 | She says one hour, not two.
问：女的认为学书法最重要的是什么？
据：女的说“关键是要坚持”。 | The woman says the key is to keep at it.
答：坚持
错：时间多 | 她说每天二十分钟就够了，时间多不是关键。 | She says twenty minutes is enough, so lots of time is not the key.
错：老师好 | 老师只是夸她进步快，她没有说老师是关键。 | The teacher only praised her; she does not call the teacher the key.
错：笔好 | 她刚开始连笔都拿不好，可是没有说笔要好。 | She once could not hold the brush, but never says it must be good.
问：男的为什么还没有学书法？
据：男的说“我也想学，可是工作太忙了”。 | The man says he wants to learn, but work is too busy.
答：工作太忙
错：觉得书法太难 | 男的问难不难，没有说因为难才不学。 | He asks if it is hard, but busyness is his reason.
错：找不到老师 | 对话没有说找不到老师。 | Finding a teacher is never mentioned.
错：不喜欢书法 | 他说“我也想学”，是喜欢的。 | He says he wants to learn, so he likes it.
`,
  },
  {
    unit: 12,
    data: `
男：你去过那么多国家，觉得最难适应的是什么？
女：不是语言，也不是饮食，而是时差。每次刚适应了，又要飞到别的地方去。
问：女的觉得最难适应的是什么？
据：女的说“不是语言，也不是饮食，而是时差”，“而是”后面才是答案。 | The woman says not language, nor food, but jet lag; the answer follows 而是.
答：时差
错：语言 | 语言是她先排除的。 | Language is what she rules out first.
错：饮食 | 饮食也是她排除的。 | Food is ruled out too.
错：天气 | 对话没有说到天气。 | Weather is never mentioned.
问：女的为什么觉得时差难适应？
据：女的说“每次刚适应了，又要飞到别的地方去”。 | The woman says each time she adjusts, she has to fly somewhere else.
答：刚适应又要去别的地方
错：每次飞的时间太长 | 她没有说飞的时间长。 | She does not say the flights are long.
错：她晚上总是睡得很晚 | 她没有说晚上睡得晚。 | She does not say she sleeps late.
错：她不喜欢坐飞机 | 她没有说不喜欢坐飞机。 | She does not say she dislikes flying.

女：听说你下个月要去西班牙工作了？
男：是啊，公司在那边开了一家分公司，让我去负责市场推广。
女：你会说西班牙语吗？
男：只会几句，我已经报了一个班，每天晚上上两个小时的课。
问：男的去西班牙做什么？
据：男的说公司开了分公司，“让我去负责市场推广”。 | The man says the firm opened a branch and wants him to run its marketing.
答：负责分公司的市场推广
错：去学习西班牙语 | 学西班牙语是他为工作做的准备，不是去的目的。 | Learning Spanish is preparation, not the purpose.
错：去当地旅行 | 他是去工作，不是旅行。 | He goes for work, not travel.
错：去开一家饭馆 | 对话没有说开饭馆。 | A restaurant is never mentioned.
问：男的为了这次工作做了什么准备？
据：男的说“我已经报了一个班，每天晚上上两个小时的课”。 | The man says he has signed up for a class, two hours every evening.
答：报班学习西班牙语
错：在网上找了房子 | 对话没有说找房子。 | Finding housing is never mentioned.
错：请了一位翻译 | 他自己学西班牙语，没有说请翻译。 | He is learning Spanish himself; no interpreter is mentioned.
错：先去那边看了看 | 对话没有说他先去看过。 | Nothing says he visited first.
问：男的西班牙语怎么样？
据：女的问他会不会说，男的说“只会几句”。 | Asked if he speaks Spanish, the man says only a few phrases.
答：只会说几句
错：说得很流利 | 只会几句，说不上流利。 | A few phrases is far from fluent.
错：一句也不会 | 他会几句，不是一句也不会。 | He knows a few, not none.
错：在那边学过一年 | 他还没去，在那边学过一年是没有的事。 | He has not gone yet, so he has not studied there for a year.

男：小李最近怎么了？上班总是走神，跟她说话她也不回答。
女：她家里出了点儿事，心情不太好，晚上也失眠。
男：那我这几天少给她安排些工作吧。
女：好，你也别直接问她，等她自己愿意说的时候再说。
问：小李最近怎么了？
据：女的说“她家里出了点儿事，心情不太好，晚上也失眠”。 | The woman says something happened at home; she is low and cannot sleep.
答：心情不好，睡不好觉
错：工作太多，太累了 | 男的打算少给她安排工作，说明不是工作太多造成的。 | The man will give her less work, but the cause is at home, not overwork.
错：身体生病了 | 对话没有说她生病。 | Illness is never mentioned.
错：要离职了 | 对话没有说她要离职。 | Nothing says she is leaving.
问：女的建议男的怎么做？
据：女的说“你也别直接问她，等她自己愿意说的时候再说”。 | The woman says not to ask her directly; wait until she wants to talk.
答：不要直接问小李
错：多跟小李聊天 | 女的让他别直接问，不是多找她聊。 | She says not to ask directly, not to chat with her more.
错：让小李请假回家 | 女的没有说让小李请假。 | She does not suggest leave.
错：给小李加工资 | 对话没有说加工资。 | A pay rise is never mentioned.

女：这部小说的结局太让人意外了，我一直以为主人公会留在家乡。
男：我也没想到。不过回想前面的情节，作者其实早就留下了线索。
问：男的觉得小说的结局怎么样？
据：男的说“回想前面的情节，作者其实早就留下了线索”。 | The man says that looking back, the author had left clues early on.
答：前面已经有线索了
错：完全没有道理 | 他说早有线索，说明结局有道理。 | Clues mean the ending makes sense.
错：跟他想的一样 | 他说“我也没想到”，跟他想的不一样。 | He says he did not expect it either.
错：写得太长了 | 对话没有说小说长。 | Length is never mentioned.
问：女的原来以为主人公会怎么样？
据：女的说“我一直以为主人公会留在家乡”。 | The woman says she always thought the hero would stay home.
答：留在家乡
错：离开家乡 | 离开家乡是她没想到的结局，不是她原来以为的。 | Leaving is the surprising ending, not what she expected.
错：回到家乡 | 她说的是留在家乡，不是回到家乡。 | She says stay, not return.
错：去外国工作 | 对话没有说去外国工作。 | Working abroad is never mentioned.

男：你做的这个菜真香，用了什么调料？
女：其实很简单，就是酱油、醋和一点儿白糖，关键是火候。
男：火候怎么掌握呢？
女：先用大火炒一分钟，再换小火慢慢煮，这样肉才又香又好吃。
问：女的认为做好这个菜的关键是什么？
据：女的说调料很简单，“关键是火候”。 | The woman says the seasoning is simple; the key is the heat.
答：火候
错：调料 | 调料她说“其实很简单”，不是关键。 | She calls the seasoning simple, not the key.
错：刀工 | 对话没有说刀工。 | Knife work is never mentioned.
错：食材 | 对话没有说食材。 | Ingredients are never mentioned.
问：女的是怎么做这个菜的？
据：女的说“先用大火炒一分钟，再换小火慢慢煮”。 | The woman says first stir-fry on high for a minute, then simmer on low.
答：先大火炒，再小火煮
错：先小火煮，再大火炒 | 顺序说反了：先大火炒，再小火煮。 | The order is reversed: high heat first, then low.
错：一直用大火炒 | 炒一分钟以后要换小火，不是一直大火。 | After a minute she turns it down, not high all along.
错：放进锅里蒸 | 她是炒和煮，没有说蒸。 | She fries and simmers; steaming is not mentioned.

女：你借给他的钱，他还了吗？
男：还了，比说好的时间还早了一个星期。他这个人很守信用。
问：男的觉得那个人怎么样？
据：男的说“他这个人很守信用”。 | The man says he is a man of his word.
答：讲信用
错：太小气 | 他提前还了钱，不是小气。 | He paid back early, which is not stingy.
错：不诚实 | 守信用就是诚实，正好相反。 | Keeping his word is honest, the opposite.
错：很粗心 | 他准时提前还钱，不是粗心。 | Repaying early is not careless.
问：那个人是什么时候还的钱？
据：男的说“比说好的时间还早了一个星期”。 | The man says he repaid a week earlier than agreed.
答：比说好的时间早一个星期
错：比说好的时间晚一个星期 | 是早一个星期，不是晚。 | A week early, not late.
错：正好在说好的那天 | 他是提前还的，不是正好那天。 | It was early, not on the day.
错：他还没有还钱 | 男的说“还了”。 | The man says he has repaid.

男：这次的市场调查结果出来了吗？
女：出来了，消费者普遍觉得我们的产品质量不错，可是包装太普通，不吸引人。
男：那下个季度就先在包装上想办法。
问：消费者对产品有什么看法？
据：女的说消费者“觉得我们的产品质量不错，可是包装太普通，不吸引人”。 | The woman says consumers find the quality good but the packaging plain and unappealing.
答：质量好，但包装不吸引人
错：包装好，但质量一般 | 正好说反了：质量好，包装不好。 | It is the reverse: good quality, poor packaging.
错：质量和包装都很好 | 包装太普通，不是都很好。 | The packaging is plain, so not both good.
错：价格太高 | 调查结果没有说到价格。 | The survey says nothing about price.
问：男的打算下一步做什么？
据：男的说“那下个季度就先在包装上想办法”。 | The man says next quarter they will work on the packaging.
答：改进产品的包装
错：提高产品质量 | 质量已经不错，他要改的是包装。 | The quality is already good; he will change the packaging.
错：降低产品价格 | 他没有说降价。 | He does not mention cutting prices.
错：再做一次调查 | 调查结果已经出来了，不用再做。 | The results are in; no new survey is needed.

女：我们部门的新经理怎么样？
男：他很会沟通，每次做决策之前都先听听大家的想法。
女：那太好了，比以前那位强多了。
男：是啊，以前的经理太固执，什么都是他一个人说了算。
问：关于新经理，可以知道什么？
据：男的说新经理“每次做决策之前都先听听大家的想法”。 | The man says the new manager always hears everyone out before deciding.
答：做决定前会听大家的意见
错：什么都自己一个人决定 | 什么都一个人说了算的是以前的经理。 | Deciding everything alone was the old manager.
错：不太会跟人沟通 | 男的说他“很会沟通”。 | He says the new manager communicates well.
错：性格很固执 | 固执的是以前的经理。 | The stubborn one was the old manager.
问：男的觉得以前的经理怎么样？
据：男的说“以前的经理太固执，什么都是他一个人说了算”。 | The man says the old manager was too stubborn and decided everything alone.
答：太固执
错：很会沟通 | 很会沟通的是新经理。 | Good communication is the new manager's.
错：很随和 | 一个人说了算就不是随和。 | Deciding alone is not easy-going.
错：很有能力 | 男的没有夸他有能力，只说他固执。 | The man calls him stubborn, not capable.

男：星期天的自助餐你去不去？听说有很多海鲜。
女：我最近在节食，晚上只吃蔬菜。
男：节食可不好，蛋白质和热量都不够，身体会受不了的。
女：你说得也有道理，那我少吃一点儿就行。
问：女的最近为什么晚上只吃蔬菜？
据：女的说“我最近在节食，晚上只吃蔬菜”。 | The woman says she is dieting and eats only vegetables at night.
答：她在节食
错：她不喜欢海鲜 | 她没有说不喜欢海鲜。 | She does not say she dislikes seafood.
错：她是素食者 | 她是在节食，没有说吃素。 | She is dieting, not vegetarian.
错：医生不让她吃肉 | 对话没有说到医生。 | No doctor is mentioned.
问：男的对节食是什么态度？
据：男的说“节食可不好……身体会受不了的”。 | The man says dieting is bad and the body will not stand it.
答：不赞成
错：很支持 | 他说节食不好，不是支持。 | He says it is bad, so he does not support it.
错：不关心 | 他认真地说了节食的害处，是关心的。 | He explains the harm, so he cares.
错：很羡慕 | 他说节食不好，不会羡慕。 | He calls it bad, so he is not envious.

女：你觉得人一生最重要的是什么？
男：我觉得是做一个善良的人。钱和名声都是一时的，良心才是最重要的。
问：男的认为人最重要的是什么？
据：男的说“我觉得是做一个善良的人……良心才是最重要的”。 | The man says it is to be a kind person; conscience matters most.
答：心地善良
错：有很多钱 | 他说钱是一时的，不是最重要的。 | He says money is passing, not most important.
错：有好名声 | 他说名声也是一时的。 | He says fame is passing too.
错：工作成功 | 对话没有说工作成功。 | Career success is never mentioned.
问：男的怎么看钱和名声？
据：男的说“钱和名声都是一时的”。 | The man says money and fame are both passing.
答：都只是一时的
错：比良心更重要 | 他说良心才是最重要的，钱和名声不如良心。 | He says conscience is most important, above money and fame.
错：一生都离不开 | 一时的就不是一生离不开的。 | Passing things are not lifelong needs.
错：越多越好 | 他没有说越多越好。 | He does not say the more the better.

男：这家公司给的薪资比现在高三成，你怎么还在犹豫？
女：钱是多了，可是要经常出差，我孩子还小，我怕照顾不了家里。
男：那你可以跟他们协商，看能不能少出几次差。
女：好，我明天就给他们打电话问问。
问：女的为什么犹豫要不要换工作？
据：女的说“要经常出差，我孩子还小，我怕照顾不了家里”。 | The woman says the job needs frequent travel, and with a small child she fears she cannot look after home.
答：要经常出差，照顾不了孩子
错：薪资比现在低 | 男的说薪资比现在高三成，不是低。 | The man says it pays thirty per cent more.
错：不喜欢那家公司 | 她没有说不喜欢那家公司。 | She does not say she dislikes the firm.
错：现在的工作更有意思 | 她没有比较两份工作哪个更有意思。 | She does not compare how interesting the jobs are.
问：女的接下来会做什么？
据：男的建议跟公司协商，女的说“好，我明天就给他们打电话问问”。 | The man suggests negotiating, and she says she will phone them tomorrow.
答：跟那家公司协商
错：马上离职 | 她只是打电话问，没有说离职。 | She will only ask; she is not quitting.
错：拒绝那家公司 | 她要去协商，不是拒绝。 | She will negotiate, not refuse.
错：让男的帮她照顾孩子 | 对话没有说让男的照顾孩子。 | Nothing says the man will mind the child.

女：你小时候最喜欢读什么书？
男：童话和民间故事，特别是有插图的，我能一个人看一下午。
女：难怪你现在写东西想象力这么强。
问：男的小时候喜欢读什么书？
据：男的说“童话和民间故事，特别是有插图的”。 | The man says fairy tales and folk tales, especially illustrated ones.
答：有插图的童话和民间故事
错：长篇小说 | 他说的是童话，不是长篇小说。 | He says fairy tales, not novels.
错：历史小说 | 他说的是民间故事，不是历史小说。 | He says folk tales, not historical novels.
错：诗集 | 他没有说诗集。 | He does not mention poetry.
问：女的认为男的现在写东西有什么特点？
据：女的说“难怪你现在写东西想象力这么强”。 | The woman says no wonder his writing is so imaginative.
答：想象力强
错：用词简单 | 她说的是想象力，不是用词。 | She speaks of imagination, not word choice.
错：故事很长 | 她没有说故事长。 | She does not mention length.
错：特别幽默 | 她说的是想象力，不是幽默。 | She says imagination, not humour.

男：我第一次去中国朋友家吃饭，带什么礼物最好？
女：水果、茶都可以。到了以后别急着吃，等主人请你再动筷子。
问：女的提醒男的注意什么？
据：女的说“到了以后别急着吃，等主人请你再动筷子”。 | The woman says not to rush to eat; wait for the host to invite him.
答：等主人请了再开始吃
错：一定要带很贵的礼物 | 女的说水果、茶都可以，不用很贵。 | She says fruit or tea will do; nothing costly.
错：要早点儿到 | 她没有说早点儿到。 | She does not say arrive early.
错：不要带水果 | 她说水果可以带。 | She says fruit is fine.
问：男的想知道什么？
据：男的问“带什么礼物最好”。 | The man asks what gift is best to bring.
答：带什么礼物合适
错：怎么去朋友家 | 他没有问怎么去。 | He does not ask the way.
错：朋友家几点吃饭 | 他没有问几点吃饭。 | He does not ask the time.
错：中国菜怎么做 | 他没有问做菜。 | He does not ask about cooking.

女：这次的项目没有成功，大家都很失望。
男：失败不可怕，可怕的是不知道为什么失败。我们开个会，把问题一个一个找出来。
女：好，我先把每个阶段的报告整理一下。
问：男的是什么态度？
据：男的说“可怕的是不知道为什么失败。我们开个会，把问题一个一个找出来”。 | The man says what is frightening is not knowing why it failed, so they should meet and find the problems.
答：应该找出失败的原因
错：这个项目不该做 | 他没有说项目不该做。 | He does not say the project was a mistake.
错：大家都不应该失望 | 他是要找原因，没有说大家不该失望。 | He wants causes found, not to forbid disappointment.
错：要马上开始新项目 | 他要先开会找问题，不是马上开始新项目。 | He wants a meeting first, not a new project.
问：女的要先做什么？
据：女的说“我先把每个阶段的报告整理一下”。 | The woman says she will first sort out each stage's report.
答：整理各个阶段的报告
错：通知大家开会 | 开会是男的提的，她要先整理报告。 | The meeting is his idea; she will sort the reports first.
错：开始一个新项目 | 对话没有说新项目。 | No new project is mentioned.
错：给经理写信 | 对话没有说给经理写信。 | Writing to a manager is never mentioned.

男：你最近怎么这么开朗？以前开会你都不怎么说话。
女：我参加了一个演讲班，老师常鼓励我们大胆表达，慢慢地我就不那么紧张了。
问：女的为什么变得开朗了？
据：女的说“我参加了一个演讲班……慢慢地我就不那么紧张了”。 | The woman says she joined a speaking class and slowly stopped being nervous.
答：参加演讲班，越来越不紧张
错：换了一份新工作 | 她没有说换工作。 | She does not mention a new job.
错：看了心理医生 | 鼓励她的是演讲班的老师，不是心理医生。 | It was the class teacher who encouraged her, not a therapist.
错：同事们常常表扬她 | 鼓励她的是老师，不是同事。 | The teacher encouraged her, not colleagues.
问：女的以前开会时怎么样？
据：男的说“以前开会你都不怎么说话”。 | The man says she used to hardly speak in meetings.
答：很少说话
错：常常发言 | 不怎么说话就不是常常发言。 | Hardly speaking is not speaking often.
错：经常迟到 | 对话没有说迟到。 | Lateness is never mentioned.
错：总是走神 | 男的说的是不说话，没有说走神。 | He says she was quiet, not distracted.

女：你在国外生活了十年，回来以后有什么不习惯的吗？
男：最不习惯的是大家吃饭都那么快，在那边吃一次饭要两三个小时。
女：那你现在还会慢慢吃吗？
男：早就跟大家一样了，这就叫入乡随俗。
问：男的回国后最不习惯什么？
据：男的说“最不习惯的是大家吃饭都那么快”。 | The man says what he was least used to was how fast everyone eats.
答：大家吃饭很快
错：饭菜太辣 | 对话没有说辣。 | Spice is never mentioned.
错：说话声音太大 | 对话没有说说话声音。 | Loud speech is never mentioned.
错：工作时间太长 | 对话没有说工作时间。 | Working hours are never mentioned.
问：男的现在怎么样？
据：男的说“早就跟大家一样了，这就叫入乡随俗”。 | The man says he has long since become like everyone else.
答：已经适应了
错：还是吃得很慢 | 他说跟大家一样了，不再吃得慢。 | He says he eats like everyone now.
错：又想出国了 | 他没有说想出国。 | He does not say he wants to leave again.
错：常常一个人吃饭 | 对话没有说一个人吃饭。 | Eating alone is never mentioned.
`,
  },
];
