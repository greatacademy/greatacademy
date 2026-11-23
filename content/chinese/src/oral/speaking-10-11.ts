// The speaking topics of the senior required course (docs/chinese-curriculum.md §18.9): a speech that opens on its
// listeners and argues its view, a debate that names the other side's fault in logic and sums up the clash, and an
// interview that follows up an answer and reports what was said faithfully; and, in the selective required course, a
// seminar that builds on what was said and answers a challenge, and a research presentation that reports a finding
// within its reach and answers questions on it. The scenes and the words said are written for this subject. Until
// their recordings are made, what is said is shown as text to be read as if heard.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageThreeFourReading } from "../reading/stage-3-4.ts";
import { stageFiveSixReading } from "../reading/stage-5-6.ts";
import { stageSevenNineReading } from "../reading/stage-7-9.ts";
import { stageTenElevenReading } from "../reading/stage-10-11.ts";
import { parseRules, type RuleItem, ruleGenerator } from "../reading/topic-kit.ts";
import { rule, ruleTexts, type Spec, stageSpeakingTopics, topicOf } from "./speaking-1-2.ts";
import { stageThreeFourSpeaking } from "./speaking-3-4.ts";
import { stageFiveSixSpeaking } from "./speaking-5-6.ts";
import { stageSevenNineSpeaking } from "./speaking-7-9.ts";

/** checked reads the scenes of a knowledge point of the senior courses, each of which carries its own check. */
function checked(data: string): readonly RuleItem[] {
  const items = parseRules(data);
  const bare = items.filter((item) => item.check === undefined);
  if (bare.length > 0) throw new Error(`speaking-10: no check for ${bare.map((item) => item.scene).join("; ")}`);
  return items;
}

/** OPENING_10 are the scenes of speaking-10-speech: an opening that draws these listeners in and names the theme. */
const OPENING_10 = checked(`
你要在全校的“节约用水”主题活动上演讲，台下是一千多名同学。
= 同学们，你们知道吗？我们学校一天用掉的水，能装满两个游泳池。今天，我想和大家谈谈这些水去了哪里。
- 我今天演讲的题目是节约用水，下面开始。 ~dull
- 尊敬的各位领导、各位来宾、各位专家学者，大家上午好。 ~unfit
% 台下是同学，题目是节约用水。好的开头用一个和同学们自己有关的惊人数字引起注意，再说清要讲什么。“下面开始”平平地说，抓不住人；一串“领导、来宾、专家”，不合台下都是同学的场合。 | The listeners are pupils and the theme is saving water. A good opening holds them with a striking figure about their own school, then names the subject. “Here I begin” is flat; a string of officials and experts does not suit a hall of pupils.

你要在社区敬老活动上，对一屋子老人讲“智能手机并不难学”。
= 爷爷奶奶们，我奶奶七十岁才学会用手机，现在天天和我视频。今天我就讲讲她是怎么学会的。
- 智能手机的操作系统分为好几种，界面的设计原理是这样的…… ~noopening
- 嘿，各位老铁，今天带你们玩转手机！ ~casual
% 听的人是老人，题目是手机不难学。好的开头用自己奶奶的经历拉近距离，也说明了要讲什么。一开口就讲操作系统和设计原理，没有先说清要讲什么，老人也听不懂；“老铁”是网上的说法，对长辈太随便。 | The listeners are old people. A good opening draws them close with the speaker's own grandmother and names the subject. Plunging into operating systems names no subject and loses them; slang from the internet is too casual for elders.

学校开运动会前，你代表运动员在开幕式上发言，时间只有两分钟。
= 跑道就在我们脚下，今天，我们不只为名次而跑，更为了跑出最好的自己。我代表全体运动员保证：赛出风格，赛出水平。
- 我先讲讲运动会的历史，最早的运动会是在古希腊举行的，那时候…… ~rambling
- 我们一定拿第一，别的班都不是我们的对手！ ~harsh
% 场合是开幕式，时间只有两分钟，发言的人代表全体运动员。好的发言直接点明主题，再代表大家表态。从古希腊讲起，又散又长，两分钟讲不完；说别的班“都不是对手”，只代表了自己一个班，还伤了别人。 | It is an opening ceremony, two minutes, speaking for every athlete. A good speech names its point at once and pledges for all. Starting from ancient Greece rambles past the time; boasting that no class can match yours speaks for one class and offends the rest.

你在班会上演讲，题目是“我们为什么要读一点难懂的书”，同学们刚上完体育课，有点累。
= 大家刚跑完八百米，腿还酸着吧？读一本难懂的书，也像跑八百米：开头很累，跑完了，才知道自己能跑多远。
- 读书分为精读和略读两种，精读的要求有五点…… ~noopening
- 同学们，请大家打起精神，认真听我演讲，不许睡觉。 ~stiff
% 同学们刚上完体育课，有点累。好的开头就从刚跑完的八百米说起，把读难书比作跑步，一下子抓住了大家，又点明了题目。一开口就讲精读略读的要求，没有先说清要讲什么；命令大家“不许睡觉”，生硬，也不能让人愿意听。 | The class has just run and is tired. A good opening starts from that run and likens a hard book to it, holding them and naming the theme. Listing rules of reading names no theme; ordering them not to sleep is stiff and wins no one.

你在毕业典礼上代表高三学生向老师们致谢，台下坐着老师和家长。
= 三年前的九月，我们拖着行李箱走进校门，是老师们在门口帮我们找教室。今天，我们要离开了，想对你们说一声：谢谢。
- 感谢老师，感谢家长，感谢学校，感谢所有人。 ~dull
- 终于毕业了，再也不用写作业了，太好了！ ~unfit
% 场合是毕业典礼，要向老师致谢。好的开头用三年前开学的一个画面引出感谢，具体，有感情。一连串的“感谢”平平地说，什么也没有让人记住；“再也不用写作业了”不合致谢的场合，也让老师听了难过。 | It is a graduation, thanking teachers. A good opening finds a picture from the first day three years ago and leads into thanks. A run of “thank you” is flat; cheering the end of homework does not suit thanks and would sadden the teachers.

你在市里的中学生环保论坛上演讲，台下是各校的学生代表和几位环保专家。
= 上个月，我们小组在城边的河里捞了一个下午，捞上来的塑料袋有四十多个。我今天想讲的，就是这四十多个塑料袋告诉我们的事。
- 环境保护很重要，我们每个人都应该保护环境。 ~dull
- 我对环保了解得不多，可能讲得不好，请大家多多包涵。 ~weak
% 台下有学生代表，也有专家。好的开头用自己小组亲手做的一件事和一个具体的数字开头，专家和同学都会想听下去。“环境保护很重要”谁都会说，抓不住人；一开口就说自己“了解得不多”，让听众先就不信你要讲的了。 | The listeners are pupils and experts. A good opening starts from what the group did with its own hands, and a figure. “Protecting the environment matters” is what anyone says; opening with “I know little” makes the listeners doubt what follows.

你要在家长会上代表学生发言，题目是“请多听听我们的想法”，台下都是家长。
= 叔叔阿姨们，你们上一次认真听孩子讲完一件事，是什么时候？今天，我想替同学们说几句平时不好意思说的话。
- 家长们，你们总是不听我们的，这样是不对的。 ~harsh
- 首先，我介绍一下我们班的基本情况：全班四十五人，男生二十三人…… ~noopening
% 台下是家长，题目是请家长多听孩子的想法。好的开头用一个问题请家长自己想一想，语气诚恳，又点明了要讲什么。一开口就指责家长“不对”，语气太冲，家长听了不会高兴；先介绍班级人数，没有说清要讲什么。 | The listeners are parents. A good opening asks them a question to reflect on, earnestly, and names the theme. Blaming them at once is sharp; reciting class numbers names no theme.

你要在校科技节上演讲，介绍你们小组做的“雨水收集装置”，台下是低年级的同学。
= 下雨的时候，屋顶上的水哗哗地流走了，你们想过它能拿来浇花吗？我们小组就做了一个能把雨水存起来的装置。
- 本装置由集水槽、过滤层、储水箱和导管四部分组成，其工作原理如下…… ~noopening
- 我们的装置得了一等奖，比别的组都好。 ~unfit
% 台下是低年级的同学，要介绍一个装置。好的开头从下雨时看得见的情景说起，用一个问题引起好奇，再说出要介绍什么。一开口就列部件和原理，没有先说清要讲什么，低年级同学也听不懂；夸自己比别的组好，不合介绍的场合。 | The listeners are younger pupils. A good opening starts from rain they have seen and a question, then names the device. Listing parts first names nothing and loses them; boasting of beating other groups misfits the occasion.

你要在班会上演讲，题目是“我们和手机的距离”，开头想用一个故事。
= 上周日，我决定一天不碰手机。上午十点，我已经下意识地摸了十一次口袋。今天就从这十一次说起。
- 我要讲一个故事，这个故事很有意思，大家一定要认真听。 ~dull
- 手机是一种通信工具，它的发明可以追溯到一百多年前…… ~noopening
% 开头要用一个故事抓住同学。好的开头直接讲一件自己的事，还有一个具体的数字，又引到主题上。只说“这个故事很有意思”，故事还没开始，平平地说，抓不住人；从手机的发明讲起，离题太远，没有先说清要讲什么。 | The opening is to be a story. A good one tells the speaker's own day at once, with a figure, and leads to the theme. Announcing an interesting story is flat; the history of the telephone names no theme.

你要在读书节上对全校同学演讲，推荐一本你喜欢的书，时间是三分钟。
= 有一本书，我读到最后一页，在操场上坐了很久。它讲的是一个少年和一匹马。今天，我想把它推荐给你们。
- 这本书的作者出生于一九零几年，他一生写了很多书，其中…… ~rambling
- 这本书写得好，大家都应该去读。 ~dull
% 场合是读书节，时间是三分钟，要推荐一本书。好的开头用读完以后的一个画面引起好奇，再点明要推荐。从作者的生平讲起，散而长，三分钟讲不到书本身；“写得好，都应该读”平平地说，什么也没有让人想读。 | Three minutes to commend a book. A good opening gives a moment after the last page and names the aim. The author's life rambles past the time; “it's good, read it” is flat.
`);

/** ARGUING_10 are the scenes of speaking-10-speech: a view in a speech carried by a reason and an example the listeners know. */
const ARGUING_10 = checked(`
你在演讲中提出“每天运动半小时，学习效率反而更高”，接下来要说理由。
= 我们班上学期做过记录：坚持晨跑的十二个同学，期末有九个成绩进步了。运动让大脑得到休息，再学习时更专心。
- 运动很好，大家都应该运动，这是没有疑问的。 ~noreason
- 我爸爸年轻时是篮球队的，他身体特别好。 ~noproof
% 观点是运动能让学习效率更高。好的理由给出了班上的记录，又说明了运动为什么有帮助。“没有疑问”只是表态，没有理由；爸爸身体好，说的是健康，证明不了学习效率。 | The view is that exercise makes study more efficient. A good reason gives the class's record and says why it helps. “Beyond doubt” asserts without reason; a father's fitness bears on health, not study.

你在演讲中提出“遇到不懂的问题，要敢于向同学请教”，台下的同学有的觉得问别人丢面子。
= 有人担心问了丢面子。可是，不懂装懂，到考试的时候丢的面子更大。问一句话，只要一分钟；不问，可能要糊涂一个学期。
- 觉得丢面子的人，就是太爱面子了，这样不好。 ~harsh
- 请教同学有很多好处，比如可以增进友谊，还可以……还有就是…… ~rambling
% 线索是台下有人觉得问别人丢面子。好的说理先说出这种担心，再把“丢面子”反过来讲，又用一分钟和一个学期作对比，听的人容易接受。说别人“太爱面子”，语气太冲，听的人会不高兴；东一点西一点地列好处，抓不住要点。 | Some listeners fear losing face. A good argument names that fear, turns it round, and sets one minute against a term. Calling them vain is sharp; a rambling list of benefits has no point to hold.

你在演讲中提出“垃圾分类要从每个家庭做起”，要举一个例子。
= 我们楼里的王阿姨，开始也嫌麻烦，后来在厨房放了两个桶，一个装剩菜，一个装别的。她说，习惯了，一点也不麻烦。
- 有的国家垃圾分类做得很好，他们分得非常细。 ~noproof
- 垃圾分类是国家的规定，必须做。 ~noreason
% 观点是垃圾分类从家庭做起。好的例子是身边一个家庭的事，又回答了“麻烦”的担心，正好证明这个观点。别的国家分得细，说的不是家庭怎样做起；“必须做”只是搬出规定，没有说服人。 | The view is that sorting begins at home. A good example is a household nearby, which also meets the worry that it is a bother. Another country's fine sorting does not show how a home starts; “it is the rule” persuades no one.

你在演讲的结尾，要再次点明“读书要有自己的思考”这个观点。
= 所以，读书不是把别人的话装进脑子，而是让别人的话在脑子里碰出火花。愿我们每一本书，都读出自己的一句话。
- 好了，我的演讲就到这里，谢谢大家。 ~abrupt
- 总之，读书很重要，大家要多读书。 ~misgrasp
% 结尾要再次点明“读书要有自己的思考”。好的结尾用一个比喻收住全篇，又发出号召，回到了观点。只说“就到这里”，没有收住观点就结束了；“多读书”说的是读的数量，不是要有自己的思考，偏离了自己的观点。 | The end must restate the view that reading needs one's own thought. A good end closes on an image and a call that return to it. “That's all” stops without closing; “read more” is about quantity, not thought, and drifts from the view.

你在演讲中引用了一句名言来支持“坚持”的观点，接下来要说明它。
= “锲而舍之，朽木不折；锲而不舍，金石可镂。”刻一下就停，连烂木头都刻不断；一直刻下去，金子石头也能刻出花来。
- 这句话是荀子说的，荀子是战国时期的思想家。 ~trivial
- 这句名言大家都知道，我就不解释了。 ~noreason
% 引了名言，要说明它怎样支持观点。好的说明用浅白的话讲出句子的意思，正好落在“坚持”上。介绍荀子是谁，抓住的是次要的东西；“就不解释了”，名言和观点之间的联系就断了。 | Having quoted a saying, the speaker must show how it supports persistence. A good gloss puts it plainly and lands on the point. Who Xunzi was is beside the point; declining to explain leaves the quotation hanging.

你在演讲中说“网络让我们更容易获取知识”，台下有同学小声说“网上假消息也多”。
= 有同学说网上假消息多，这是真的。所以获取知识，不只要会搜，还要会辨：看来源，比一比几个说法。会辨的人，网络才真是一座图书馆。
- 请不要在下面说话，等我讲完再说。 ~dismiss
- 假消息是少数，不用管它。 ~dismiss
% 线索是台下有人提出了“假消息多”的反对意见。好的演讲接住这个意见，承认它，再把它变成自己观点的一部分：会辨真假，网络才有用。叫人不要说话，和说“不用管它”，都没有回应别人的意见，听的人不会被说服。 | A listener objects that the web is full of false news. A good speaker takes the objection, grants it, and makes it part of the view: one who can tell true from false finds a library there. Hushing the listener or waving the point away answers nothing.

你在演讲中提出“犯了错要敢于承认”，要举一个例子让同学们信服。
= 去年，我不小心打碎了实验室的烧杯，没有说。第二天另一个同学被怀疑了，我才站出来。那一天我明白了，不承认，错就会落到别人身上。
- 有一位古代的皇帝，也承认过自己的错误。 ~noproof
- 承认错误是一种美德，这是人人都知道的。 ~noreason
% 观点是犯了错要敢于承认。好的例子是自己亲身经历的一件事，具体，又说出了不承认的后果，正好支持观点。只说有位皇帝承认过错误，没有具体内容，证明不了同学们为什么要这样做；“人人都知道”只是表态，没有理由。 | The view is to own one's mistakes. A good example is the speaker's own, specific, with the cost of silence. A vague emperor proves nothing for pupils; “everyone knows” gives no reason.

你在演讲中提出“学校应该多开放操场”，接下来要说理由。
= 放学后，操场一直锁着，我们只能在走廊里活动。上学期开放了一个月，打篮球、跑步的同学每天有一百多人。需要的人这么多，操场就该开放。
- 别的学校的操场都开放了，我们也应该开放。 ~weak
- 开放操场有好处，好处有很多很多。 ~noreason
% 观点是多开放操场。好的理由说出了现在的情况和开放时的人数，用事实说明有需要。别的学校开放，不能说明本校为什么需要；“好处有很多”没有说出任何一个好处。 | The view is to open the field more. A good reason gives the present lock and the numbers when it was open. Other schools doing so says nothing of this one's need; “many benefits” names none.

你在演讲中说“志愿服务不在于做大事”，台下有同学问：“那陪老人聊天也算吗？”
= 当然算。社区的李奶奶一个人住，她说，我们每周去陪她聊一个小时，是她一周里最盼着的事。对她来说，这就是很大的事。
- 这个问题我们以后再讨论。 ~dismiss
- 陪老人聊天很简单，谁都会做。 ~misgrasp
% 线索是同学问“陪老人聊天也算吗”。好的回答正面说“算”，再用李奶奶的话说明这件小事的意义，正好支持了自己的观点。“以后再讨论”没有回答；说“谁都会做”，没有说到算不算服务，弄错了同学要问的。 | A listener asks whether chatting with the old counts. A good answer says yes and gives Grandma Li's words, supporting the view. “Later” dodges; “anyone can do it” misses what was asked.

你在演讲中提出“考试失利不等于失败”，要在结尾再次点明观点。
= 一次考试，只是路上的一块石头。绊倒了，看一看它，记住它，再站起来往前走。考砸的不是我们，只是那一天。
- 好了，就说这么多，谢谢。 ~abrupt
- 所以，大家一定要考好每一次考试。 ~misgrasp
% 结尾要再次点明“考试失利不等于失败”。好的结尾用石头作比喻收住全篇，最后一句回到观点。“就说这么多”没有收住观点；“一定要考好每一次”和自己的观点相反，把意思说偏了。 | The end must restate that a bad exam is not failure. A good end closes on the stone image and returns to the view. “That's all” stops without closing; “do well in every exam” runs against the view.
`);

/** FALLACY_10 are the scenes of speaking-10-debate: naming the fault in the other side's reasoning. */
const FALLACY_10 = checked(`
辩题是“高中生该不该参加课外辅导班”。对方说：“我们班考第一的同学就上了辅导班，可见辅导班有用。”
= 对方用一个同学的例子，推出辅导班对所有人都有用，这是以偏概全。同一个班里，上了辅导班成绩没有进步的同学也不少。
- 对方辩友自己一定也上了辅导班吧。 ~attack
- 对方辩友是说不上辅导班就考不了第一，这不对。 ~misgrasp
% 线索是对方只举了“考第一的同学”一个例子。好的反驳点明这是以偏概全，再举出相反的情况。猜对方上没上辅导班，针对的是人；对方并没有说“不上就考不了第一”，把他的意思说过了头。 | The clue: one top pupil is their only case. A good reply names the hasty generalisation and gives counter-cases. Guessing at their own tutoring attacks them; they never said none can top the class without it.

辩题是“网络游戏是不是导致青少年成绩下降的主要原因”。对方说：“很多成绩下降的同学都玩游戏，所以游戏是主要原因。”
= 两件事同时出现，不等于一件是另一件的原因。也可能是学习遇到困难、心里烦闷，才去玩游戏，因果可能正好反过来。
- 玩游戏的同学也有成绩好的，所以游戏没有坏处。 ~misgrasp
- 对方辩友是不是从来没玩过游戏，才这么说？ ~attack
% 线索是对方从“同时出现”推出了“是原因”。好的反驳指出相关不等于因果，还说出因果可能颠倒。说游戏“没有坏处”，把辩题的“主要原因”变成了“有没有坏处”，弄错了要辩的东西；问对方玩没玩过，针对的是人。 | The clue: they leap from the two going together to cause. A good reply says correlation is not cause, and the cause may run backwards. “Games do no harm” mistakes what is in dispute; asking whether they play attacks the person.

辩题是“学校该不该统一校服”。对方说：“要么统一校服，要么大家比穿名牌，没有别的选择。”
= 对方只给了两种可能，可是还有别的办法：比如规定朴素的着装要求，不必穿同一件衣服。非此即彼，漏掉了中间的路。
- 穿名牌也没什么，有钱就可以穿。 ~offtopic
- 对方辩友这样说，是因为自己家买不起名牌吧。 ~attack
% 线索是“要么……要么……没有别的选择”。好的反驳点明对方只给了两种可能，再举出第三种办法。有没有钱穿名牌，已经离开了该不该统一校服的辩题；猜对方家里的情况，针对的是人，也伤人。 | The clue: “either … or …, no other choice”. A good reply names the false dilemma and offers a third way. Whether the rich may wear brands strays from the motion; guessing at their family attacks and wounds.

辩题是“读书是不是越多越好”。对方前面说“读书”指读一切书，后来又说“读书越多越好，因为好书能让人进步”。
= 对方开头说的“读书”是读一切书，后来说的却只是好书。好书多读当然好，可这推不出一切书都越多越好，对方偷换了概念。
- 对方辩友读的书一定很少。 ~attack
- 好书确实能让人进步，我方也同意。 ~yield
% 线索是对方前后说的“读书”不是同一个意思。好的反驳把两处说法摆在一起，指出偷换了概念。说对方读书少，针对的是人；只说“我方也同意”，等于顺着对方的偷换，放弃了己方的立场。 | The clue: their “reading” means all books at first and good books later. A good reply sets the two side by side and names the shifted term. Saying they read little attacks them; simply agreeing follows their shift and gives up the stand.

辩题是“传统节日要不要保留旧习俗”。对方说：“这些习俗流传了几千年，所以一定是对的。”
= 流传得久，只能说明它有过价值，不能证明今天每一样都还合适。缠足也流传过很久，后来被废除了。时间长，不是对错的理由。
- 几千年太久了，谁也说不清。 ~dismiss
- 对方辩友太守旧了，跟不上时代。 ~attack
% 线索是对方从“流传了几千年”推出“一定是对的”。好的反驳指出“久”不等于“对”，再举出流传很久却被废除的例子。说“谁也说不清”，没有回应对方的理由；说对方“太守旧”，针对的是人。 | The clue: they argue from long tradition to rightness. A good reply says age is not rightness and gives a long custom later abolished. “No one can say” answers nothing; “you are old-fashioned” attacks them.

辩题是“中学生该不该有手机”。对方说：“很多专家都说中学生不该有手机，所以不该有。”
= 专家怎么说，要看他们的理由。我们应该比较的是理由，而不是人数和名头；对方说出专家的理由，我们才能讨论。
- 专家也不一定都对，有的专家就是乱说。 ~harsh
- 我方也找了很多专家，他们都说该有。 ~noreason
% 线索是对方只说“很多专家都说”，没有说专家的理由。好的反驳指出该比较的是理由，不是名头。说“有的专家乱说”，语气太冲，也没有说出道理；自己也搬出专家，同样没有理由，和对方犯了一样的错。 | The clue: they cite experts and no reasons. A good reply says it is reasons that must be weighed, not names. “Some experts talk nonsense” is sharp and reasonless; citing your own experts repeats their fault.

辩题是“中学生该不该学做家务”。对方说：“做家务会耽误学习，所以中学生不该学做家务。”后来又说：“家务就是洗衣做饭这些大事，太花时间。”
= 对方把“学做家务”说成了每天包下洗衣做饭。学做家务，可以是周末做一顿饭、每天整理自己的房间，用不了多少时间。对方把辩题说大了再来反对。
- 对方辩友在家一定什么都不干。 ~attack
- 做家务确实花时间，我方也承认。 ~yield
% 线索是对方把“学做家务”换成了“包下洗衣做饭这些大事”。好的反驳点明对方把辩题说大了，再说出学做家务实际花的时间。说对方在家什么都不干，针对的是人；顺着对方说“确实花时间”，放弃了己方的立场。 | The clue: they turn learning chores into doing all the washing and cooking. A good reply names the inflated motion and gives what learning really takes. Mocking their idleness attacks them; agreeing that it takes time gives up the stand.

辩题是“城市要不要禁放烟花”。对方说：“去年禁放以后，空气变好了，所以禁放是空气变好的原因。”
= 去年空气变好，还有工厂减排、车辆限行这些原因。只看到禁放在前、空气变好在后，就说禁放是原因，是把先后当成了因果。
- 空气好不好，和烟花一点关系也没有。 ~misgrasp
- 对方辩友是不是从来不过年？ ~attack
% 线索是对方从“禁放以后空气变好”推出“禁放是原因”。好的反驳举出别的原因，点明这是把先后当成了因果。说“一点关系也没有”，说过了头，烟花确实会影响空气；问对方过不过年，针对的是人。 | The clue: air improved after the ban, so the ban did it. A good reply names other causes and the post hoc fault. “No connection at all” overreaches; asking whether they celebrate the New Year attacks them.

辩题是“该不该提倡中学生读网络小说”。对方说：“网络小说有那么多人读，说明它一定是好的。”
= 读的人多，说明它受欢迎，不能说明它一定好。好不好要看内容，受欢迎和有价值是两回事。
- 读网络小说的人都没有文化。 ~harsh
- 我方认为网络小说一本也不能读。 ~misgrasp
% 线索是对方从“读的人多”推出“一定是好的”。好的反驳指出人多只说明受欢迎，分清了受欢迎和有价值。说读的人“没有文化”，语气太冲，也伤了很多人；说“一本也不能读”，把己方的观点说过了头，辩题问的是该不该提倡。 | The clue: many read it, so it must be good. A good reply separates popular from valuable. Calling readers uncultured is harsh; “not a single one may be read” overstates the side's own view.

辩题是“学生会干部该不该由老师指定”。对方说：“如果不由老师指定，就只能让同学们乱选，选出来的人肯定不行。”
= 不由老师指定，不等于乱选：可以先由同学报名演讲，再投票，老师把关。对方只说了指定和乱选两种，漏掉了有规则的选举。
- 同学们选出来的人当然比老师指定的好。 ~misgrasp
- 对方辩友是怕自己选不上吧。 ~attack
% 线索是对方只给出“老师指定”和“乱选”两种可能。好的反驳点明这是非此即彼，再说出有规则的选举这条路。说同学选的“当然比老师指定的好”，只是换了一个绝对的说法，也没有指出对方的错；猜对方怕选不上，针对的是人。 | The clue: only appointment or a free-for-all. A good reply names the false dilemma and offers an orderly election. “Of course ours are better” swaps one absolute for another; guessing they fear losing attacks them.
`);

/** SUMMING_10 are the scenes of speaking-10-debate: a closing statement that sums up the clash and restates the stand. */
const SUMMING_10 = checked(`
辩题是“城市该不该限制私家车”，你方是正方。双方争得最多的是“限车会不会给市民出行带来不便”。你做总结陈词。
= 今天双方争的焦点是出行便不便。对方说限车不方便，可他们也承认堵车更不方便；公交更快了，不便就少了。所以我方坚持：城市应该限制私家车。
- 我再补充一个新的理由：私家车还会造成噪音污染。 ~needless
- 对方辩友今天表现得很差，几个问题都没有答上来。 ~attack
% 总结陈词要抓住双方争的焦点，归结出己方为什么赢，再重申立场。好的总结点明“出行便不便”这个焦点，用对方承认的话说明己方占理。到总结时才提新理由，对方已经没有机会回应，评委也不看重；评价对方“表现得很差”，针对的是人。 | A closing statement names the clash, shows why your side has the better of it, and restates the stand. A good one names convenience as the clash and uses the other side's own admission. A new reason at the close cannot be answered and counts for little; grading their performance attacks them.

辩题是“学生该不该给老师打分”，你方是反方。比赛中对方一直强调“打分能促进老师改进”。你做总结陈词。
= 对方说打分能促进改进，可是改进靠的是具体的意见，不是一个分数；而分数会让老师只想讨好学生。我方主张用意见交流代替打分，所以学生不该给老师打分。
- 我们的老师都很好，根本不需要改进。 ~misgrasp
- 打分这件事，说来话长，我先从古代的考核制度讲起…… ~rambling
% 对方一直强调的是“能促进改进”，这就是要回应的焦点。好的总结抓住这一点，说明改进靠意见不靠分数，再重申立场。说老师“根本不需要改进”，把对方的意思弄错了，也说过了头；从古代考核讲起，又散又长，总结的时间根本不够。 | Their constant point is that marks help teachers improve. A good close meets it: improvement needs specific comments, not a number, and restates the stand. “Our teachers need no improving” mistakes the point and overreaches; starting from ancient examinations rambles past the time.

辩题是“读纸质书还是读电子书更好”，你方认为纸质书更好。双方争的焦点是“哪一种更能让人读得深”。你做总结陈词。
= 今天的焦点是谁更能让人读得深。电子书方便，这一点我方承认；可是读得深要的是专注，纸质书没有弹窗和消息。方便是为了读，读得深才是目的。所以我方认为纸质书更好。
- 电子书伤眼睛，看久了会近视。 ~trivial
- 总之我方是对的，对方是错的。 ~noreason
% 焦点是“哪一种更能让人读得深”。好的总结先承认对方的长处，再抓住焦点说明纸质书为什么更能让人专注，最后重申立场。伤不伤眼睛是次要的一点，不是今天的焦点；“我方对，对方错”只是表态，没有理由。 | The clash is which makes reading deeper. A good close grants the other side's merit, then shows why paper keeps the mind on the page, and restates. Eyesight is a side issue; “we are right, they are wrong” has no reason.

辩题是“青少年追星利大于弊还是弊大于利”，你方认为利大于弊。对方举了很多为追星花大钱的例子。你做总结陈词。
= 对方举的例子，说的都是不理智的追星。我方从开始就说，追的是偶像身上的努力和善良，学的是他们的长处。弊在方法，不在追星本身；用对了方法，利就大于弊。
- 花钱是自己的事，别人管不着。 ~offtopic
- 对方举的例子太多了，我们记不住。 ~dismiss
% 对方用很多例子说追星有弊。好的总结把这些例子归为一类“不理智的追星”，说明弊在方法，再回到己方的立场。花钱是不是自己的事，离开了利弊的辩题；说“记不住”，没有回应对方的例子。 | They piled up cases of reckless spending. A good close groups them as unwise fandom, places the harm in the method, and returns to the stand. Whose money it is strays from the motion; “too many to remember” answers none of them.

辩题是“该不该取消期中考试”，你方是反方。总结前，评委提醒你“请回应对方说的考试压力问题”。你做总结陈词。
= 对方说期中考试压力大，这一点我们重视。可是压力来自怎样对待分数，不来自考试本身；取消期中考试，压力只会全部压到期末。所以，该改的是对待考试的方式，期中考试不该取消。
- 压力大是因为对方辩友心理素质不好。 ~attack
- 我们就不回应压力的问题了，时间有限，说说别的。 ~dismiss
% 评委提醒要回应“考试压力”。好的总结正面接住这个问题，说明压力的真正来源，又指出取消的后果，最后重申立场。说对方心理素质不好，针对的是人；不回应、说别的，正好躲开了评委要你回答的焦点。 | The judge asks for an answer on exam stress. A good close meets it, locates the stress in how marks are treated, shows what abolishing would do, and restates. Blaming their nerves attacks them; skipping the point dodges exactly what was asked.

辩题是“中学该不该开设烹饪课”，你方是正方。全场下来，对方的主要理由是“占用学习时间”。你做总结陈词。
= 对方的理由只有一个：占用学习时间。可是会做饭本身就是学习，学的是生活的本领，还要用到计算和科学。一周一节课，换来一辈子用得上的本领，所以我方坚持应该开设。
- 对方辩友是不是在家从来不做饭？ ~attack
- 烹饪课还可以学做蛋糕、做饺子、做汤，内容很丰富…… ~rambling
% 对方的主要理由是“占用学习时间”，总结就要回应这一点。好的总结把“学习”的意思说宽，说明烹饪本身就是学习，再算一笔账，重申立场。问对方在家做不做饭，针对的是人；一样一样地列菜名，散而长，没有回应对方的理由。 | Their one ground is lost study time. A good close widens what learning is, shows cooking is learning, weighs one lesson a week against a lifetime's skill, and restates. Asking whether they cook attacks them; listing dishes rambles and answers nothing.

辩题是“高中该不该分文理科”，你方认为不该分。双方争的焦点是“分科能不能让学生学得更专”。你做总结陈词。
= 今天的焦点是专与全。对方说分科能学得更专，我方承认；可是高中是打基础的时候，基础不全，将来想专也专不深。所以我方坚持：高中不该过早分科。
- 文科和理科哪个更难，大家心里都有数。 ~offtopic
- 我再说一个新的理由：分科会让同学之间产生隔阂。 ~needless
% 焦点是“分科能不能让学生学得更专”。好的总结先承认对方的道理，再说明高中打基础的意义，最后重申立场。文科理科哪个更难，离开了辩题；总结时才提新理由，对方没有机会回应。 | The clash is whether streaming deepens study. A good close grants their point, then shows why foundations come first, and restates. Which stream is harder is off the motion; a new reason at the close cannot be answered.

辩题是“该不该在教室里安装监控”，你方认为不该。比赛中对方的主要理由是“安全”。你做总结陈词。
= 对方的理由是安全，我们同样看重。可是教室的安全，靠门口和走廊的监控就能保证；装进教室，看住的是每一个同学的一举一动。安全不必拿隐私来换，所以我方认为不该安装。
- 安全根本不是问题，学校一直很安全。 ~dismiss
- 对方辩友是不是想偷看别人？ ~attack
% 对方的主要理由是安全，总结就要回应这一点。好的总结先说己方也看重安全，再说明保证安全不必装进教室，最后重申立场。说安全“根本不是问题”，把对方的理由一笔抹掉，没有回应；问对方是不是想偷看，针对的是人。 | Their ground is safety. A good close shares the concern, shows safety needs no camera inside the room, and restates. “Safety is no issue” brushes it aside; insinuating they want to spy attacks them.

辩题是“青少年该不该有自己的偶像”，你方认为该有。全场双方各说了很多例子。你做总结陈词，时间只有一分钟。
= 一分钟，我只说一点：双方争的，是偶像会不会让人迷失自己。我们看到，选对了偶像，人会照着他的努力走向更好的自己。所以青少年应该有自己的偶像。
- 第一，……第二，……第三，……第四，……第五，…… ~rambling
- 今天我方的表现非常精彩，大家都看到了。 ~noreason
% 时间只有一分钟，全场例子又多。好的总结只抓一个焦点，说明己方的道理，再重申立场。一条一条地列五点，散而长，一分钟说不完，也抓不住要点；夸己方表现精彩，没有说出任何理由。 | One minute after many examples. A good close takes one clash, gives the reason, and restates. Five numbered points ramble past the time; praising one's own side gives no reason.

辩题是“学校该不该禁止学生带零食”，你方是反方。比赛中你方一位辩手说错了一个数据，对方抓住不放。你做总结陈词。
= 我方刚才的一个数据说错了，我们更正。但是这个数据并不影响我们的道理：零食的问题在于吃什么、吃多少，不在于带不带。引导比禁止更有用，所以我方认为不该禁止。
- 数据说错了没关系，对方辩友不要揪着不放。 ~harsh
- 既然数据错了，那我方也不坚持了。 ~yield
% 线索是己方说错了数据，对方一直抓住这一点。好的总结坦然更正，再说明这个错误不影响己方的道理，最后重申立场。叫对方“不要揪着不放”，语气太冲，也没有更正；因为一个数据错了就不坚持了，是放弃了己方的立场。 | Your side misstated a figure and they pressed it. A good close corrects it frankly, shows the argument stands without it, and restates. “Stop harping on it” is sharp and corrects nothing; giving up over one figure abandons the stand.
`);

/** FOLLOW_10 are the scenes of speaking-10-interview: a follow-up question that goes deeper into what was just said. */
const FOLLOW_10 = checked(`
你在采访一位在老街开了三十年裁缝铺的师傅。他说：“这些年，来做衣服的人越来越少了。”
= 人少了，您为什么还一直开着这个铺子？
- 您觉得人少是不是很不好？ ~closed
- 您平时喜欢看什么电视节目？ ~offtopic
% 线索是师傅说“来做衣服的人越来越少了”，可铺子还开着。好的追问抓住这一点问下去，能问出他的坚持和想法。问“是不是很不好”，只能答“是”或“不是”；问看什么电视，离开了要谈的话题。 | He says fewer and fewer come, yet the shop stays open. A good follow-up asks why, and draws out his reasons. “Isn't that bad?” invites yes or no; television is off the subject.

你在采访一位乡村教师。她说：“刚来的时候，我差点就走了。”
= 那时候是什么让您想走，后来又是什么让您留了下来？
- 您后悔来这里吗？ ~closed
- 那时候想走，那您现在一个月工资多少？ ~offtopic
% 线索是“差点就走了”，这里面有一个转折的故事。好的追问把“想走”和“留下”都问到，能让她讲出这段经历。“后悔吗”只能答是或不是；问工资，离开了她刚说的话，也不礼貌。 | The clue is “I nearly left”, which hides a turn. A good follow-up asks what made her want to go and what kept her. “Do you regret it?” is yes or no; asking her salary leaves what she said and is rude.

你在采访一位获得科技创新奖的同学。他说：“这个装置，我们失败了十几次。”
= 失败了十几次，哪一次最难？后来是怎么找到问题的？
- 失败十几次，你们是不是很笨？ ~harsh
- 你们最后得奖了，开心吗？ ~closed
% 线索是“失败了十几次”。好的追问抓住失败，问最难的一次和怎样找到问题，能问出具体的过程。说对方“是不是很笨”，太冲，伤人；“开心吗”只能答是或不是，也离开了失败这个话头。 | The clue: a dozen failures. A good follow-up asks which was hardest and how they found the fault, drawing out the process. “Were you stupid?” wounds; “Were you happy?” is yes or no and leaves the failures.

你在采访社区的一位志愿者。他说：“做志愿者，其实我得到的比给出去的多。”
= 您说得到的更多，能讲一件让您有这种感觉的事吗？
- 您是说做志愿者能赚钱吗？ ~misgrasp
- 对，做志愿者很光荣。好，下一个问题。 ~dismiss
% 线索是“得到的比给出去的多”，这句话需要事例来说明。好的追问请他讲一件具体的事。把“得到”理解成赚钱，弄错了他的意思；一句“很光荣”就跳到下一个问题，放过了最值得问的地方。 | The clue: he gets more than he gives, which wants an example. A good follow-up asks for one event. Taking “gets” as money mistakes him; “how glorious” and moving on lets the best point go.

你在采访一位做了二十年公交车司机的阿姨。她回答你的第一个问题时说：“开车不难，难的是天天一个样。”
= “天天一个样”，您是怎么让自己不厌烦的？
- 那您开车的时候，最快开到过多少？ ~offtopic
- 阿姨，您先等一下，我还没问完，我的第二个问题是…… ~cutin
% 线索是“难的是天天一个样”，这是她自己说出的真正的难处。好的追问接住这句话问下去。问最快开到多少，离开了她说的难处；打断她去念下一个准备好的问题，没有听她把话说完，也放过了这个话头。 | The clue: the hard part is sameness. A good follow-up takes that up. Top speed is off the point; breaking in with the next prepared question ignores what she said.

你在采访一位研究地方方言的大学老师。他说：“有些词，现在只有八十岁以上的老人还会说了。”
= 能举一两个这样的词吗？这些词消失了，会丢掉些什么？
- 那老人们去世了，这些词就没了，对吧？ ~closed
- 老师，您是哪一年开始当老师的？ ~offtopic
% 线索是“只有八十岁以上的老人还会说了”。好的追问请他举出例子，又往深处问这些词消失的意义。“对吧”只能答是或不是；问哪一年当老师，离开了方言这个话题。 | The clue: only people over eighty still say some words. A good follow-up asks for examples and what is lost with them. “Right?” is yes or no; his starting year is off the subject.

你在采访一位快递员。他说：“最难忘的是那个下大雪的晚上。”
= 那个下大雪的晚上，发生了什么事？
- 您一天要送多少个快递？ ~offtopic
- 那天晚上一定很冷吧？ ~closed
% 线索是“最难忘的是那个下大雪的晚上”，这里面有一个故事。好的追问直接问那天晚上发生了什么。问一天送多少快递，放过了他刚提起的话头；“一定很冷吧”只能答是或不是，问不出故事。 | The clue: the night of heavy snow, a story waiting. A good follow-up asks what happened. The daily count drops what he raised; “it must have been cold?” is yes or no.

你在采访一位刚退休的老校长。她说：“当了三十年校长，我最大的遗憾，不是没有做成的事。”
= 不是没有做成的事，那您最大的遗憾是什么？
- 那您做成了哪些大事？ ~offtopic
- 您是说您没有遗憾吗？ ~misgrasp
% 线索是“最大的遗憾，不是没有做成的事”，她话只说了一半，留下了悬念。好的追问顺着这半句问下去。问做成了哪些大事，离开了“遗憾”这个话头；问“没有遗憾吗”，把她的意思弄错了，她说的是有遗憾。 | She leaves her sentence half said. A good follow-up asks for the other half. Her achievements leave the thread; “so you have no regrets?” mistakes her.

你在采访一位学校食堂的厨师。他说：“同学们剩下什么菜，我每天都看。”
= 您每天看剩菜，看出了什么？后来做菜有什么变化吗？
- 剩菜多，您是不是很生气？ ~closed
- 师傅，您先别说这个，我想问您最拿手的菜是什么。 ~cutin
% 线索是“每天都看”剩菜，这说明他很用心，背后一定有故事。好的追问问他看出了什么、做了什么改变。“是不是很生气”只能答是或不是；打断他去问拿手菜，放过了这个最好的话头。 | The clue: he studies the leftovers daily. A good follow-up asks what he learned and changed. “Are you angry?” is yes or no; cutting him off for his best dish drops the thread.

你在采访一位视障的钢琴调音师。他说：“看不见，耳朵反而帮了我。”
= 耳朵是怎么帮了您的？能讲讲您刚学调音时的一件事吗？
- 看不见一定很不方便吧？ ~closed
- 您看不见，怎么还能工作？ ~harsh
% 线索是“耳朵反而帮了我”，这句话需要具体的事来说明。好的追问问耳朵怎样帮了他，并请他讲一件事。“很不方便吧”只能答是或不是，也只盯着困难；“怎么还能工作”语气太冲，会伤人。 | The clue: his ears helped him. A good follow-up asks how, and for a story from his apprenticeship. “It must be hard?” is yes or no; “how can you even work?” is harsh.
`);

/** REPORT_10 are the scenes of speaking-10-interview: relaying what the interviewee said, faithfully and to the point. */
const REPORT_10 = checked(`
采访中，老裁缝说：“现在买衣服方便，做衣服的少了，可总有人要改衣服、要合身的，我这手艺就还有用。”你在班上转述他的话。
= 老师傅说，做衣服的人少了，可改衣服、要合身的人还有，所以他觉得自己的手艺还有用。
- 老师傅说，他的铺子快要关门了。 ~added
- 老师傅说，现在买衣服很方便。 ~trivial
% 转述要忠实，又要抓住要点。好的转述保留了“做的人少了”和“手艺还有用”这一转折。“快要关门了”是原话里没有的；只说“买衣服方便”，抓住的是次要的一句，丢了他的意思。 | A relay must be faithful and keep the point. A good one keeps the turn from fewer customers to a craft still of use. “Closing soon” is never said; “clothes are easy to buy” keeps a side remark and drops his point.

采访中，乡村教师说：“我不觉得自己伟大，只是孩子们需要老师，我正好在这里。”你写采访记录的要点。
= 她不认为自己伟大，留下来是因为孩子们需要老师。
- 她认为自己做出了伟大的牺牲。 ~misgrasp
- 她说她正好在这里。 ~trivial
% 记要点要忠实于原意。好的记录保留了“不觉得伟大”和“孩子们需要老师”两层。说她认为自己“伟大”，把意思弄反了；只记“正好在这里”，丢了最重要的原因。 | Notes must keep her meaning. A good note keeps both “not great” and “the children need a teacher”. Calling it a great sacrifice reverses her; “I happened to be here” drops the reason.

采访中，获奖同学说：“奖是我们组四个人一起拿的，最难的那段，是小李熬夜查出了电路的问题。”你在校报上转述。
= 他说，奖是组里四个人一起拿的，最难的时候是小李熬夜查出了电路的问题。
- 他说，奖是他自己拿的，小李也帮了点忙。 ~misgrasp
- 他说，他们组每天都熬夜。 ~added
% 转述要忠实。好的转述保留了“四个人一起”和“小李查出问题”。说“奖是他自己拿的”，把他的意思弄错了，对小李也不公平；“每天都熬夜”是原话里没有的。 | The relay must be faithful. A good one keeps “the four of us” and Li's night finding the fault. “He won it, Li helped a bit” gets him wrong and is unfair to Li; “up every night” is never said.

采访中，公交司机阿姨说：“我在车上放了一本小本子，记下每天遇到的好玩的事，这样天天就不一样了。”你转述她的办法。
= 她在车上放了一个小本子，每天记下遇到的好玩的事，觉得这样每天就不一样了。
- 她说，开公交车一点也不枯燥。 ~misgrasp
- 她说，她喜欢写日记，还想出一本书。 ~added
% 转述的是她让自己不厌烦的办法。好的转述说清了小本子和她的用意。说“一点也不枯燥”，和她前面说的“天天一个样”相反，弄错了她的意思；“想出一本书”是加进去的。 | The relay is of her way to beat sameness. A good one gives the notebook and its purpose. “Not dull at all” contradicts what she said; “wants to publish a book” is added.

采访中，方言老师说：“方言不必人人都会说，可是应该有人把它记下来。”你在小组汇报中转述。
= 老师认为，不一定人人都要会说方言，但应该有人把方言记录下来。
- 老师认为，每个人都应该学会说方言。 ~misgrasp
- 老师认为，方言比普通话更重要。 ~added
% 转述要忠实于原话的分寸。好的转述保留了“不必人人会说”和“应该有人记下来”。说“每个人都应该学会”，正好和原话相反；说“比普通话更重要”，是原话里没有的。 | The relay must keep his measure. A good one keeps “not everyone need speak it” and “someone should record it”. “Everyone should learn it” reverses him; “more important than Mandarin” is added.

采访结束，志愿者说：“我最想说的是，帮人不一定要做大事，陪老人聊半个小时也是帮。”你写采访稿的结尾。
= 采访最后，他说帮人不一定要做大事，陪老人聊半个小时也是帮。
- 采访最后，他说陪老人聊天很无聊。 ~misgrasp
- 采访最后，他号召大家都去做志愿者，每周至少去三次。 ~added
% 他说这是自己“最想说的”，采访稿就该把这句话忠实地写进去。好的结尾保留了“不一定做大事”和“聊半个小时也是帮”。说“很无聊”，弄错了他的意思；“每周至少三次”是加进去的。 | He calls this what he most wants to say, so the piece should keep it. A good end keeps both halves. “Chatting is boring” gets him wrong; “three times a week” is added.

采访中，快递员说：“那天雪很大，车开不动，我推着车走了两个小时，就为了给一位老人送药。”你在班上转述。
= 他说，那天雪很大，车开不动，他推着车走了两个小时，给一位老人送药。
- 他说，他每天都要推着车走好几个小时。 ~added
- 他说，那天雪很大。 ~trivial
% 转述要忠实，又要抓住要点。好的转述保留了雪大、推车两小时、给老人送药这几层。“每天都要推好几个小时”是原话里没有的；只说“雪很大”，丢了最重要的事。 | A good relay keeps the snow, the two-hour push and the medicine. “Hours every day” is added; “it snowed hard” keeps a side detail and drops the point.

采访中，老校长说：“我最大的遗憾，是没能多记住几个学生的名字。”你写采访稿。
= 她说，她最大的遗憾是没能多记住几个学生的名字。
- 她说，她当校长时一个学生的名字也记不住。 ~misgrasp
- 她说，她最大的遗憾是工作太忙，没有陪家人。 ~added
% 转述要忠实于原话。好的转述原原本本地保留了她的遗憾。说她“一个名字也记不住”，把“没能多记住几个”说成了一个也没记住，改变了分寸；“没有陪家人”是原话里没有的。 | The relay must keep her words. A good one keeps the regret as said. “Remembered none” changes “not more” into “none”; family is never mentioned.

采访中，食堂厨师说：“青菜剩得最多，我就改成先焯水再炒，现在剩得少多了。”你在校报上转述。
= 他说，青菜剩得最多，他改成先焯水再炒，现在剩得少多了。
- 他说，现在同学们一点菜也不剩了。 ~misgrasp
- 他说，青菜剩得最多。 ~trivial
% 转述要保留要点和分寸。好的转述说清了问题、办法和结果。“一点也不剩”把“少多了”说成了绝对，改变了分寸；只说“青菜剩得最多”，丢了他的办法和结果。 | A good relay keeps problem, method and result. “None left at all” turns “much less” absolute; the first clause alone drops what he did.

采访中，调音师说：“我能调好，一半靠耳朵，一半靠师傅教我的耐心。”你在小组汇报中转述。
= 他说，他能调好琴，一半靠耳朵，一半靠师傅教给他的耐心。
- 他说，他能调好琴，全靠天生的好耳朵。 ~misgrasp
- 他说，他的师傅是全国最好的调音师。 ~added
% 转述要保留原话的分寸。好的转述保留了“一半靠耳朵，一半靠耐心”。说“全靠天生的好耳朵”，丢了另一半，也改变了意思；师傅是不是“全国最好”，原话里没有。 | The relay must keep his measure. A good one keeps half ears, half patience. “All down to his ears” drops a half and changes him; “the best tuner in the country” is added.
`);

/** SPECS_10 are the speaking topics of the senior required course, in order. */
const SPECS_10: readonly Spec[] = [
  {
    grade: 10,
    id: "speaking-10-speech",
    title: t("Speeches", "演讲"),
    summary: t(
      "Giving a speech: an opening that draws these listeners in and names the theme, and a view carried by a reason and an example they know, meeting their doubts and closing on the view.",
      "演讲：开头吸引台下的听众，点明主题；用听众熟悉的理由和事例支持观点，回应听众的疑问，结尾回到观点。",
    ),
    intro: t(
      "A speech is argued aloud to particular listeners. The opening must win them: a question, a picture or a figure from their own lives, then the theme in a sentence. The body carries the view on a reason and an example the listeners know, takes up the doubt they may hold, and the end returns to the view.\n\nSpeaking to a class about saving electricity: “昨晚离开教室时，有几个人回头看了一眼灯？” Then the figure of the school's monthly bill, then the theme. The first knowledge point opens, the second argues.",
      "演讲是对着具体的听众把道理讲出来。开头要抓住他们：一个问题、一个画面，或者一个和他们自己有关的数字，再用一句话点明主题。主体要用听众熟悉的理由和事例支持观点，接住他们可能有的疑问，结尾再回到观点。\n\n比如对全班讲节约用电：“昨晚离开教室时，有几个人回头看了一眼灯？”接着说出学校一个月的电费，再点明主题。第一个知识点学开头，第二个学说理。",
    ),
    texts: [...ruleTexts(OPENING_10), ...ruleTexts(ARGUING_10)],
    after: ["speaking-9-hosting"],
    points: [
      [
        "opening",
        t("An Opening for These Listeners", "抓住听众的开头"),
        t(
          "Ask who is listening and where: pupils in a hall, elders in a community room, a panel of experts. Open on something from their lives, a question, a scene, a figure, then name the theme in one sentence. Keep within the time and the occasion.\n\nTo parents at a school open day, on reading at home: “各位家长，您还记得上一次和孩子一起读完一本书，是什么时候吗？”\n\n> **Watch out.** A flat “我今天演讲的题目是……” wins no one; a string of formal greetings or slang can both misfit the listeners; and an apology for speaking badly makes them doubt the rest.",
          "先想清楚听的是谁、在什么场合：礼堂里的同学，社区里的老人，还是一排专家。从他们生活中的东西开头：一个问题，一个场景，一个数字，再用一句话点明主题。不超出时间，合乎场合。\n\n比如在学校开放日对家长讲亲子阅读：“各位家长，您还记得上一次和孩子一起读完一本书，是什么时候吗？”\n\n> **注意。** 平平地说“我今天演讲的题目是……”，抓不住人；一长串正式的称呼，或者网上的俗语，都可能不合听众；一开口就说自己讲不好，听众就不信后面的话了。",
        ),
        ruleGenerator(
          t("Which opening suits this speech best?", "哪一种开头最合适？"),
          OPENING_10,
          rule(
            t(
              "Note who the listeners are, the occasion and the theme; choose the opening that starts from their lives and names the theme.",
              "看清听众是谁、什么场合、讲什么主题；选出从听众的生活说起、又点明主题的开头。",
            ),
            t(
              "Imagine sitting among those listeners: the first sentence makes you want to hear the next, and you know what the speech is about.",
              "想象自己坐在台下：听了第一句，就想听下一句，也知道这次演讲要讲什么。",
            ),
            {
              find: t("Step 1: see who is listening.", "第一步：看清听众和场合。"),
              choose: t("Step 2: choose the opening that wins them.", "第二步：选出能抓住他们的开头。"),
            },
          ),
        ),
      ],
      [
        "arguing",
        t("Carrying the View", "用理由和事例说服听众"),
        t(
          "Give the reason for your view and an example the listeners know: a record from your class, a neighbour, a saying explained in plain words. If they may doubt you, say the doubt yourself and answer it. End by returning to the view, in a line they will remember.\n\nOn “早睡比熬夜复习更有用”: “上次月考前，我熬了三个晚上，考场上却连会做的题都看错了。”\n\n> **Watch out.** “大家都知道”“这是没有疑问的” give no reason; an example that proves something else, however vivid, does not help; and hushing a listener who objects answers nothing.",
          "说出支持观点的理由，再举一个听众熟悉的事例：班上的记录、身边的人、用浅白的话讲清的一句名言。听众可能会怀疑的地方，自己先说出来，再回答。结尾回到观点，用一句让人记得住的话。\n\n比如讲“早睡比熬夜复习更有用”：“上次月考前，我熬了三个晚上，考场上却连会做的题都看错了。”\n\n> **注意。** “大家都知道”“这是没有疑问的”都不是理由；事例再生动，证明的是别的东西，也没有用；听众提出不同意见，叫他别说话，什么也没有回答。",
        ),
        ruleGenerator(
          t("Which is the best thing to say here?", "这时怎样说最好？"),
          ARGUING_10,
          rule(
            t(
              "Note the view and what this part of the speech must do: give a reason, an example, an answer to a doubt, or the end; choose the line that does it.",
              "看清观点，和这一部分要做什么：说理由，举事例，回应疑问，还是结尾；选出做到这一点的一句。",
            ),
            t(
              "Ask whether a doubting listener, hearing the line, would move toward the view: it bears on the view itself, not on something near it.",
              "想一想，一个心存怀疑的听众听了这句话，会不会更接近这个观点：它说的正是这个观点，不是旁边的事。",
            ),
            {
              find: t("Step 1: see what this part must do.", "第一步：看这一部分要做什么。"),
              choose: t("Step 2: choose the line that persuades.", "第二步：选出能说服人的一句。"),
            },
          ),
        ),
      ],
    ],
  },
  {
    grade: 10,
    id: "speaking-10-debate",
    title: t("Debate", "辩论"),
    summary: t(
      "Debating in the senior course: naming the fault in the other side's reasoning, a hasty generalisation, a false cause, a false either-or, a shifted term, an appeal to age or authority, and a closing statement that sums up the clash and restates the stand.",
      "高中的辩论：指出对方推理中的错误，如以偏概全、强加因果、非此即彼、偷换概念、诉诸传统或权威；总结陈词抓住双方争论的焦点，重申己方立场。",
    ),
    intro: t(
      "A senior debate is won on reasoning. The sharpest rebuttal names the fault in the other side's argument: one case taken for all, two things that go together taken for cause and effect, two choices offered as the only two, a key word used in two senses, a claim held true because it is old or because experts say so.\n\nAt the end, each side sums up. A good closing does not add new reasons; it names the point both sides fought over, shows why its side has the better of it, and restates the stand. The first knowledge point names the fault, the second sums up.",
      "高中的辩论，靠推理取胜。最有力的反驳，是点明对方论证中的错误：拿一个例子代表全部；把同时出现的两件事当成因果；只给出两种选择，好像没有别的路；一个关键词前后用成了两个意思；因为一种说法很古老，或者因为专家这样说，就认为它是对的。\n\n最后，双方各作总结陈词。好的总结不再提新的理由，而是点出双方争论的焦点，说明己方为什么更有道理，再重申立场。第一个知识点学指出推理的错误，第二个学总结陈词。",
    ),
    texts: [...ruleTexts(FALLACY_10), ...ruleTexts(SUMMING_10)],
    after: ["speaking-9-debate", "reading-10-argument"],
    points: [
      [
        "fallacy",
        t("Naming the Fault in Their Reasoning", "指出对方推理的错误"),
        t(
          "Listen for how the other side gets from their reason to their view, and test that step. One case does not prove all; going together is not causing (and the cause may run the other way); “either … or” may hide a third way; a word may change sense between two sentences; long custom and famous names are not reasons in themselves. Name the fault plainly, then show it with a counter-case or the missing third way.\n\nThe other side says, “这个办法我们学校用了十年，所以是最好的办法。” A rebuttal: “用了十年，说明它行得通，不能说明没有更好的办法。”\n\n> **Watch out.** Going at the speaker names no fault; nor does pinning on them a view they never held. And answering one authority with another repeats the fault instead of exposing it.",
          "仔细听对方怎样从理由推到观点，检验这一步。一个例子证明不了全部；同时出现不等于因果（因果还可能是反的）；“要么……要么……”可能藏着第三条路；一个词在两句话里可能换了意思；流传得久、名气大，本身都不是理由。把错误直接说出来，再用一个反例或者被漏掉的第三条路来证明。\n\n比如对方说：“这个办法我们学校用了十年，所以是最好的办法。”反驳可以说：“用了十年，说明它行得通，不能说明没有更好的办法。”\n\n> **注意。** 针对说话的人，指不出任何推理错误；把对方没说过的观点安到他头上，也不算。用另一个权威去对付对方的权威，是重复了同样的错误，而不是揭露它。",
        ),
        ruleGenerator(
          t("Which rebuttal names the fault in their reasoning?", "哪一句反驳指出了对方推理的错误？"),
          FALLACY_10,
          rule(
            t(
              "Find the step from the other side's reason to their view, and ask what kind of fault it is; choose the rebuttal that names that fault and shows it.",
              "找出对方从理由到观点的那一步，想一想这是哪一种错误；选出点明这个错误、又加以证明的那一句。",
            ),
            t(
              "Put the rebuttal to the other side's own words: the fault it names is really in them, and the case it gives shows it.",
              "拿这句反驳对照对方的原话：它指出的错误确实在对方的话里，举出的例子也证明了这一点。",
            ),
            {
              find: t("Step 1: find the step in their reasoning.", "第一步：找出对方推理的那一步。"),
              choose: t("Step 2: choose the rebuttal that names its fault.", "第二步：选出点明错误的反驳。"),
            },
          ),
        ),
      ],
      [
        "summing",
        t("The Closing Statement", "总结陈词"),
        t(
          "In the closing statement, name the point the two sides fought over most, or the one the judges asked about. Show why your side has the better of it, using where you can what the other side granted. Then restate your stand in a sentence. Add no new reason, since no one can answer it now.\n\nOn “暑假该不该布置作业”, if the clash was rest against forgetting: “今天的焦点是休息和遗忘。对方也承认两个月不学会忘；少量作业，既能休息，又不忘记。所以我方坚持应该布置。”\n\n> **Watch out.** Grading the other side's performance, rambling through every point of the day, and skipping the question the judges set all lose the close.",
          "总结陈词时，点出双方争得最多的焦点，或者评委要求回应的问题；说明己方为什么更有道理，能用上对方承认过的话最好；再用一句话重申立场。不要提新的理由，因为对方已经没有机会回应。\n\n比如辩题是“暑假该不该布置作业”，双方争的是休息和遗忘：“今天的焦点是休息和遗忘。对方也承认两个月不学会忘；少量作业，既能休息，又不忘记。所以我方坚持应该布置。”\n\n> **注意。** 评价对方表现得好不好，把全场每一点都散散地再说一遍，或者躲开评委要你回答的问题，都会让总结失分。",
        ),
        ruleGenerator(
          t("Which closing statement is best?", "哪一段总结陈词最好？"),
          SUMMING_10,
          rule(
            t(
              "Find the point the two sides fought over, or the one the judges raised; choose the closing that meets it and restates the stand.",
              "找出双方争论的焦点，或者评委提出的问题；选出回应了它、又重申立场的总结。",
            ),
            t(
              "Check the closing: it names the clash, shows why your side has the better of it, adds no new reason, and ends on your stand.",
              "检查这段总结：点出了焦点，说明了己方为什么占理，没有提新的理由，最后落在己方的立场上。",
            ),
            {
              find: t("Step 1: find the clash.", "第一步：找出争论的焦点。"),
              choose: t("Step 2: choose the closing that sums it up.", "第二步：选出抓住焦点的总结。"),
            },
          ),
        ),
      ],
    ],
  },
  {
    grade: 10,
    id: "speaking-10-interview",
    title: t("Interviews", "访谈"),
    summary: t(
      "Interviewing for a piece on today's life: a follow-up question that takes up what was just said and goes deeper, and a relay of the answers that keeps the speaker's meaning and measure, adding nothing.",
      "为了解当代生活而访谈：追问要接住对方刚说的话，往深处问；转述对方的回答要保留原意和分寸，不添加内容。",
    ),
    intro: t(
      "The best question in an interview is often not one prepared beforehand but the one that takes up what was just said: a turn (“我差点就走了”), a puzzle (few customers, yet the shop stays open), a claim that wants an example. Ask it open, so it draws out a story.\n\nAfterwards the answers are relayed, in a class report or a school paper. The relay keeps the speaker's meaning and measure: “不一定人人都要会” is not “人人都应该会”; nothing is added and the main point is not dropped for a side remark. The first knowledge point follows up, the second relays.",
      "访谈中最好的问题，常常不是事先准备好的，而是接住对方刚说的话问下去的那一个：一个转折（“我差点就走了”），一个让人好奇的地方（客人少了，铺子却一直开着），一句需要事例说明的话。问得开放一些，才能问出故事来。\n\n访谈以后，要在班上汇报，或者写进校报，转述对方的回答。转述要保留原意和分寸：“不一定人人都要会”不等于“人人都应该会”；不添加原话里没有的内容，也不抓住次要的话而丢了要点。第一个知识点学追问，第二个学转述。",
    ),
    texts: [...ruleTexts(FOLLOW_10), ...ruleTexts(REPORT_10)],
    after: ["speaking-8-interview", "speaking-9-reporting"],
    points: [
      [
        "follow",
        t("Following Up an Answer", "接住回答往下追问"),
        t(
          "Listen for the part of the answer that holds more than it says: a turn, a puzzle, a feeling, a claim. Take it up in an open question, why, how, what happened, can you give an example, and let the speaker finish before you ask.\n\nA beekeeper says, “那一年，蜂箱差点全空了。” Follow-up: “那一年发生了什么？您是怎么让蜂群慢慢回来的？”\n\n> **Watch out.** A question that can be answered yes or no draws out nothing; jumping to the next prepared question lets the best point go; and a question off the subject, or a sharp one, closes the speaker up.",
          "仔细听对方的回答里哪一部分话里有话：一个转折，一个让人好奇的地方，一种感情，一个说法。用开放的问题接住它：为什么，怎么做的，发生了什么，能举个例子吗；等对方说完再问。\n\n比如一位养蜂人说：“那一年，蜂箱差点全空了。”追问：“那一年发生了什么？您是怎么让蜂群慢慢回来的？”\n\n> **注意。** 只能答“是”或“不是”的问题，问不出东西；急着念下一个准备好的问题，就放过了最好的话头；离开话题，或者问得太冲，对方就不愿意说了。",
        ),
        ruleGenerator(
          t("Which follow-up question is best?", "哪一个追问最好？"),
          FOLLOW_10,
          rule(
            t(
              "Find the part of the answer that holds more than it says; choose the open question that takes it up.",
              "找出回答里话里有话的那一部分；选出接住它的开放的问题。",
            ),
            t(
              "Imagine the speaker answering: the question draws out a story or a reason about what was just said, not a yes or a no.",
              "想象对方怎样回答：这个问题能问出和刚才的话有关的故事或原因，而不只是“是”或“不是”。",
            ),
            {
              find: t("Step 1: find what holds more.", "第一步：找出话里有话的地方。"),
              choose: t("Step 2: choose the question that takes it up.", "第二步：选出接住它的追问。"),
            },
          ),
        ),
      ],
      [
        "relay",
        t("Relaying the Answers Faithfully", "忠实地转述回答"),
        t(
          "In relaying what was said, keep the main point and its measure: a turn (“少了，可是还有用”), a limit (“不一定人人”), credit given to others (“我们四个人”). Shorten, but add nothing the speaker did not say, and do not keep a side remark in place of the point.\n\nA beekeeper says, “蜂蜜少了一半，可我不打算换行，蜜蜂比我更难。” Relay: “他说蜂蜜少了一半，但不打算换行，觉得蜜蜂比他更难。”\n\n> **Watch out.** Turning a limited claim into an absolute one, or a modest one into a boast, changes the meaning; a plan or a feeling the speaker never stated is an addition, however likely.",
          "转述别人的话，要保留要点和分寸：一个转折（“少了，可是还有用”），一个限定（“不一定人人”），对别人的肯定（“我们四个人”）。可以说得简短，但不能加进对方没说的内容，也不能用次要的话代替要点。\n\n比如养蜂人说：“蜂蜜少了一半，可我不打算换行，蜜蜂比我更难。”转述：“他说蜂蜜少了一半，但不打算换行，觉得蜜蜂比他更难。”\n\n> **注意。** 把有限定的说法说成绝对的，把谦虚的话说成自夸，都改变了原意；对方没有说出的打算或感受，再像真的，也是添加。",
        ),
        ruleGenerator(
          t("Which relay is faithful to what was said?", "哪一种转述忠实于原话？"),
          REPORT_10,
          rule(
            t(
              "Find the main point of what was said, with its turn or limit; choose the relay that keeps both and adds nothing.",
              "找出原话的要点，以及其中的转折或限定；选出两样都保留、又没有添加内容的转述。",
            ),
            t(
              "Set the relay beside the words said: every part of it is in them, and the main point and its measure are kept.",
              "把转述和原话放在一起对照：转述的每一部分原话里都有，要点和分寸也都保留了。",
            ),
            {
              find: t("Step 1: find the main point and its measure.", "第一步：找出要点和分寸。"),
              choose: t("Step 2: choose the faithful relay.", "第二步：选出忠实的转述。"),
            },
          ),
        ),
      ],
    ],
  },
];

/** BUILDING_11 are the scenes of speaking-11-seminar: a turn that takes up what was said and moves the discussion on. */
const BUILDING_11 = checked(`
研讨课上讨论《论语》“君子和而不同”。小林刚说：“‘和而不同’就是大家关系好，但想法可以不一样。”轮到你发言。
= 我接着小林的话说：孔子还说“小人同而不和”，可见只会附和、没有自己的看法，反而算不上真正的“和”。
- 我也觉得“和而不同”就是关系好，想法可以不一样，小林说得对。 ~repeat
- 我想说说孔子的生平：他三岁丧父，后来周游列国十四年。 ~offtopic
% 好的发言先接住小林的话，再用原文“小人同而不和”往前推进一步，说出新的意思。照着小林的话再说一遍，没有增加任何东西；讲孔子的生平，离开了正在讨论的这句话。 | A good turn takes up what Xiao Lin said and moves it on with the text's own “小人同而不和”. Saying his words again adds nothing; the life of Confucius strays from the line being discussed.

小组研讨“鲁迅为什么要写看客”。小周说：“因为鲁迅讨厌这些人。”你觉得这个说法不够准确。
= 小周注意到了鲁迅对看客的态度。不过《呐喊》自序里说，他弃医从文是想改变人的精神，所以与其说是讨厌，不如说是想唤醒他们。
- 你这么说太幼稚了，一看就没有好好读书。 ~attack
- 小周说鲁迅讨厌看客，那就是说鲁迅讨厌所有的中国人。 ~misgrasp
% 好的发言先肯定对方看到的东西，再用《呐喊》自序作依据修正它。说对方“幼稚”“没有好好读书”，针对的是人，不是观点；把“讨厌看客”说成“讨厌所有的中国人”，曲解了小周的意思。 | A good turn grants what the other saw, then corrects it from the preface to Call to Arms. Calling him childish goes at the person; turning “he disliked the onlookers” into “he disliked all Chinese” twists what Xiao Zhou said.

研讨“二十四节气在今天还有没有用”。已经有三位同学讲了节气和种地的关系，讨论停在了原地。
= 前面大家都谈到了种地，我想换个角度：现在不少城市的学校按节气安排自然观察，节气也在帮城里人认识季节。
- 我也认为节气对种地很重要，农民种地离不开它。 ~repeat
- 我觉得这个话题没什么好讨论的，我们换一个吧。 ~dismiss
% 讨论停在一处时，好的发言先点出前面说过什么，再换一个角度、带一个实例，把讨论往前推。又说一遍“对种地重要”，只是重复；说“没什么好讨论的”，是把大家的发言撇在一边。 | When a discussion stalls, a good turn names what has been said, then brings a new angle with an example. Saying again that the terms matter for farming only repeats; “nothing to discuss” brushes everyone's turns aside.

研讨《史记》中“太史公曰”的作用。小陈说：“它就是作者发表议论的地方。”你想补充自己读到的一个例子。
= 我补充一个例子：《孔子世家》的“太史公曰”写了司马迁到鲁国参观孔子旧居的经历，可见它不只是议论，也记下了作者自己的见闻。
- 我补充一下：“太史公曰”就是作者发表议论的地方，里面有很多议论。 ~repeat
- 我补充一下：《史记》一共一百三十篇，是一部纪传体通史。 ~irrelevant
% 补充要拿出新的东西：举出《孔子世家》的例子，说明“太史公曰”还有记见闻的作用。换个说法重复小陈的话，什么也没有补充；《史记》有多少篇是真的，但和“太史公曰”的作用无关。 | Adding means bringing something new: the example from the house of Confucius shows the passage also records what the author saw. Rewording Xiao Chen adds nothing; the number of chapters is true but says nothing of what the passage does.

研讨“网络流行语会不会破坏汉语”。小王激动地说：“流行语就是垃圾，应该全部禁止！”
= 小王担心语言会变得粗糙，这一点我理解；不过“潜水”“灌水”这些词用的是比喻，这是汉语本来就有的办法，未必是破坏。
- 你这样说太极端了，根本不讲道理，没法和你讨论。 ~harsh
- 对，应该全部禁止，网上的东西都不好。 ~noreason
% 对方说得激动时，好的发言先说出对方担心的是什么，再拿出具体的词作依据，平和地提出不同的看法。说对方“太极端”“不讲道理”，语气太冲；跟着说“全部禁止”，只表了态，没有说为什么。 | When the other speaks hotly, a good turn names his worry, then calmly offers another view resting on particular words. Calling him extreme and unreasonable is too sharp; agreeing to ban them all states a view with no reason.

研讨《项链》的结尾。小赵说：“结尾的意外是作者故意捉弄读者。”你不同意，但还不清楚小赵为什么这样想。
= 小赵，你说“捉弄读者”，是指结尾和前面没有联系吗？我觉得前面佛来思节夫人那么爽快地把项链借出去，其实已经埋下了伏笔。
- 你说错了，结尾一点也不是在捉弄读者。 ~noreason
- 小赵是觉得这篇小说写得不好，我也不太喜欢它。 ~misgrasp
% 好的发言先问清对方的意思，再用文中的细节说明结尾早有伏笔。只说“你说错了”，没有理由；把“捉弄读者”说成“小说写得不好”，理解错了小赵的意思。 | A good turn first asks what the other means, then shows from a detail that the ending was prepared. “You are wrong” gives no reason; turning “teasing the reader” into “a bad story” gets Xiao Zhao wrong.

研讨快结束了，老师请你归纳大家的发言。问题是“古诗中的柳为什么常和送别有关”，同学们分别谈了谐音、折柳的风俗和柳枝的样子。
= 大家从三个方面作了解释：“柳”和“留”谐音，古人有折柳送别的风俗，柳枝柔长像依依不舍。还没讨论的是：古诗里的柳是不是都和离别有关？
- 刚才大家都说得很好，发言很积极，这次讨论很成功。 ~needless
- 刚才小李说柳枝像头发，很有意思，我觉得写得最好的是《诗经》。 ~trivial
% 归纳要把各方的要点都说到，再指出还没有解决的问题。只夸“说得很好”，听的人不知道大家讲了什么；抓住一个比喻和自己的喜好，丢掉了三个要点。 | A summing-up names every point made and the question still open. Praise alone tells no one what was said; one likening and a personal preference drop the three points.

研讨“成语中的数字是不是实指”，你是主持人。小孙已经连着讲了五分钟，别的同学还没有开口。
= 小孙举的“三顾茅庐”很有说服力，我们先记下来。时间有限，也请其他同学说说自己找到的成语。
- 小孙，你能不能别说了，大家都等烦了。 ~harsh
- 不打断他，让小孙一直讲下去，反正他讲得也对。 ~noturn
% 主持人要让每个人都有机会发言：先肯定小孙的要点，再把话头交给别人。叫他“别说了”，语气太冲；任由他一直讲，别的同学就没有机会开口了。 | A chair gives everyone a turn: grant Xiao Sun's point, then pass the word on. Telling him to stop is too sharp; letting him run on leaves the others no turn.

研讨《二十年后》的结尾。小吴说：“警察吉米亲手抓了自己的朋友，所以他是个冷酷的人。”你觉得这个判断不够全面。
= 吉米没有亲自出面，而是请另一个警察去抓，还留了一张纸条说明原因。这说明他守住了职责，也顾念旧情，不能只说冷酷。
- 吉米确实很冷酷，连朋友都抓，真是太无情了。 ~repeat
- 这篇小说的作者是欧·亨利，他的结尾总是出人意料。 ~offtopic
% 好的发言用文中的细节补上小吴没有看到的一面：吉米请别人去抓，又留了纸条。跟着说“太无情了”，只是重复小吴的判断；谈作者的结尾风格，离开了吉米是个怎样的人这个问题。 | A good turn adds from the text the side Xiao Wu missed: Jimmy sends another man and leaves a note. Calling him heartless only repeats the judgment; the author's endings stray from what kind of man Jimmy is.

研讨“手机阅读和纸质阅读”。小郑说：“我们班的调查发现，读纸质书的同学读得多，所以纸质书能让人读得更多。”
= 小郑的数据很有用。不过这只说明两者同时出现，也可能是本来爱读书的人更喜欢纸质书；要证明纸质书的作用，还得另找证据。
- 小郑说得对，纸质书就是比手机好，大家都应该读纸质书。 ~noreason
- 小郑，你们班才几个人，这种调查有什么用？ ~dismiss
% 好的发言肯定对方的数据，再指出从“同时出现”推不出“是原因”，并说明还缺什么证据。跟着说“纸质书就是好”，没有理由；说调查“有什么用”，是把对方的依据一笔抹掉，没有回应它。 | A good turn grants the data, then shows that going together is not causing, and says what evidence is missing. “Paper is simply better” gives no reason; “what use is it” waves the evidence away without answering it.
`);

/** CHALLENGE_11 are the scenes of speaking-11-seminar: asking for the grounds of a view, and answering a challenge to one's own. */
const CHALLENGE_11 = checked(`
你在研讨中说“唐诗里的月亮都表现思乡”。小许问：“李白《月下独酌》也写月亮，那首也是思乡吗？”
= 你说得对，《月下独酌》写的是孤独，不是思乡。我的说法太绝对了，应该改成：写思乡的唐诗常常写到月亮。
- 那首不算，我说的是大部分的诗，你别抬杠。 ~dismiss
- 李白喝酒的时候一定也在想家，所以那首也是思乡。 ~added
% 别人举出反例时，好的回应承认反例成立，把自己的说法收窄到依据能支持的范围。说“你别抬杠”，没有回应质疑；说李白喝酒时也在想家，是给诗加上了诗里没有的意思。 | When someone brings a counterexample, a good answer grants it and narrows the claim to what the evidence bears. “Stop quibbling” answers nothing; saying Li Bai was homesick adds what the poem never says.

小冯在研讨中说：“很多诗都把柳和离别联系在一起。”你想知道他的依据。
= 小冯，你能举出一两首具体的诗吗？是哪一句把柳和离别连在一起的？
- 小冯，很多诗是不是真的都这样？ ~closed
- 我不相信，你肯定是随口说的。 ~attack
% 追问依据，要请对方说出具体的诗句，对方答了，大家就能核对。“是不是真的都这样”只能答“是”或“不是”，问不出依据；说他“随口说的”，针对的是人。 | To ask for grounds, ask for the lines themselves, which everyone can then check. “Is it really so” draws only a yes or no; “you just said it” goes at the person.

你在研讨中说：“本班四十二人中，二十六人主要用手机阅读。”小韩问：“那能说用手机阅读的人读得少吗？”
= 不能。调查只显示用手机阅读的人多，没有证明他们读得少；要回答这个问题，得比较两组人的阅读时间。
- 能，用手机阅读肯定读得少，这是大家都知道的。 ~noreason
- 这个问题和我的调查没有关系，下一个问题。 ~dismiss
% 好的回应分清调查发现了什么、没有发现什么，并说出回答这个问题还需要什么。“大家都知道”不是理由；说“没有关系”，是回避了对方的问题，其实它正是从你的数据引出来的。 | A good answer keeps apart what the survey found and what it did not, and says what would be needed. “Everyone knows” is no reason; “nothing to do with it” dodges a question that comes straight from the figures.

小许质疑你：“你说‘太史公曰’是为了评价人物，可《孔子世家》那一段主要写的是司马迁自己参观的经历。”
= 这个质疑有道理。《孔子世家》那一段确实以写见闻为主，评价是借见闻表达的。我把“评价人物”改成它的作用之一。
- 那一段也是在评价，你没有读懂。 ~dismiss
- 司马迁写《史记》用了十几年，非常辛苦。 ~offtopic
% 质疑说中了的地方，要坦然承认，并修正自己的说法。只说“你没有读懂”，没有回应对方举出的那一段；讲司马迁写书辛苦，离开了“太史公曰”的作用。 | Where a challenge hits, grant it and amend the claim. “You did not understand” leaves his example unanswered; how hard Sima Qian worked strays from what the passage does.

小组讨论“汉字简化好不好”。小沈说：“简化字破坏了汉字的文化。”你想追问，让他说得更具体。
= 你说的“破坏文化”，能举一个具体的字吗？比如哪个字简化以后，原来的意思就看不出来了？
- 你是不是觉得简化字不好？ ~closed
- 简化字是国家规定的，你这样说不对。 ~dismiss
% 追问要让对方把笼统的说法落到具体的字上，讨论才能继续。“是不是觉得不好”只能答“是”或“不是”，问不出具体的内容；拿“国家规定”压人，没有回应他的看法。 | A follow-up brings a vague claim down to particular characters. “Do you think they are bad” draws only yes or no; “the state decided it” does not answer his view.

你在研讨中说“节气用在南方不准”。小杜反驳：“节气本来就是按黄河流域的气候定的，不能说不准。”
= 这一点我同意，节气是按黄河流域定的。那我换个说法：节气反映的是黄河流域的物候，用在南方，要按当地的情况调整。
- 我说不准就是不准，这是我外公说的。 ~pushy
- 黄河流域在北方，长江流域在南方。 ~irrelevant
% 对方的反驳有道理时，好的回应接受它，并用更准确的说法表达自己原来的意思。“我说不准就是不准”，只是坚持自己；说出黄河、长江在哪里，是事实，却对回应反驳毫无帮助。 | When a rebuttal holds, a good answer accepts it and puts one's own point more exactly. “It is wrong because I say so” only insists; where the rivers lie is true but does nothing for the reply.

研讨《飞鸟集》。小葛说：“这些短句没有押韵，所以不算诗。”你想提出不同意见。
= 押韵是诗常见的特点，但不是唯一的标准。《飞鸟集》的短句有凝练的意象和跳跃的联想，这也是诗的特点。
- 你连诗是什么都不懂，就别发言了。 ~attack
- 我觉得《飞鸟集》很好看，我很喜欢。 ~noreason
% 提出不同意见，要先承认对方说对的部分，再说出自己判断的标准和理由。叫对方“别发言了”，针对的是人；只说自己喜欢，没有说出它为什么算诗。 | To differ, grant what is right in the other view, then give your own standard and reason. Telling him to keep quiet goes at the person; liking the book is no reason it is poetry.

研讨中有人问：“你说网络流行语多用谐音，到底有多少个？”你手上的材料是：四十个词里有十四个是谐音。
= 在我收集的四十个词里，有十四个是谐音，是几种方式里最多的。不过这些只是我们班同学常用的词。
- 绝大多数网络流行语都是谐音，几乎全都是。 ~overclaim
- 有很多很多，我也记不清了，反正很多。 ~unclear
% 回答“有多少”，要说出确切的数字和它的范围。四十个里有十四个，说不上“绝大多数”，更说不上“几乎全都是”；“很多很多”，听的人还是不知道到底有多少。 | Asked how many, give the exact figure and its scope. Fourteen of forty is not nearly all; “very many” still leaves the listener not knowing how many.

研讨《胖子和瘦子》。小程说：“小说讽刺的是胖子。”小宁马上说：“不对，讽刺的是瘦子！”两个人争了起来。你想让讨论继续下去。
= 两位各看到了一面：瘦子一听对方官大就变了样，胖子也被这副样子弄得很不自在。我们回到原文，看作者分别是怎样写两个人的。
- 小宁说得对，小程你错了。 ~noreason
- 你们别吵了，这个问题根本不重要。 ~dismiss
% 两种意见相持不下时，好的发言说出双方各看到了什么，再把大家引回原文找依据。只判一方对，没有理由；说“根本不重要”，是把两个人的意见都撇在一边。 | When two views deadlock, a good turn names what each sees, then leads everyone back to the text. Ruling for one side gives no reason; “it does not matter” brushes both views aside.

你在发言中说：“我们班的调查说明，学生作业太多。”老师问：“调查问的是什么？”你的问卷问的是“影响你课外阅读的主要原因”，四十二人中有二十人答“作业多”。
= 问卷问的是影响课外阅读的原因，四十二人中有二十人答“作业多”。所以准确地说，是近一半同学觉得作业影响了课外阅读。
- 调查说明作业太多，这是全班同学的共同感受。 ~overclaim
- 调查是我设计的，一共五道题，花了一个星期。 ~off
% 被问到依据时，好的回应如实说出调查问了什么、多少人这样答，再把结论改到依据所及的范围。二十人不是“全班”，问的也不是作业多不多；讲问卷有几道题、花了多久，没有回答老师的问题。 | Asked for the grounds, a good answer says what was asked and how many answered so, and narrows the claim to fit. Twenty is not the whole class, and the question was not whether there is too much homework; how the survey was made does not answer the teacher.
`);

/** REPORTING_11 are the scenes of speaking-11-presenting-research: stating the question, the method and the finding to listeners. */
const REPORTING_11 = checked(`
你要向全班报告“唐诗中的月亮与思乡”这项研究，只有三分钟。怎样开头？
= 我研究的问题是：唐诗里的月亮为什么常和思乡连在一起。我读了五首诗，找到了三个原因，下面一个一个说。
- 月亮是地球的卫星，离地球大约三十八万公里，本身不发光。 ~noopening
- 我先讲讲我是怎么想到这个题目的：那天晚上，我在阳台上吃月饼…… ~rambling
% 时间短，开头就要说出研究的问题、用了什么材料、有几个发现，让听众知道后面怎么听。一开口讲月亮的天文知识，没有先说清要讲什么；从吃月饼讲起，又散又长，三分钟就过去了。 | With little time, the opening states the question, the material and how many findings, so the listeners know how to follow. Astronomy says nothing of the subject; the story of the evening rambles away the three minutes.

你在报告银杏树的观察结果，幻灯片上有五周的数据表。怎样说最清楚？
= 简单地说：南边的甲树比北边的乙树早一周左右开始变黄，也早一周左右落完。每周的具体数字都在表上。
- 第一周甲树百分之五，乙树几乎没有；第二周甲树百分之三十，乙树百分之五；第三周…… ~rambling
- 我发现银杏树秋天会变黄，后来叶子就落下来了。 ~trivial
% 听的人记不住一串数字，口头报告要先说出数字说明了什么，细节留给表格。把每周的数字逐一念出来，听众抓不住要点；“秋天会变黄”谁都知道，丢掉了两棵树相差一周这个发现。 | Listeners cannot hold a string of figures: say what the figures show, and leave the detail to the table. Reading out every week loses the point; that ginkgos turn yellow is known to all and drops the finding of the week's difference.

你要向初一的学弟学妹报告“简化字中的同音代替”，先要解释什么是同音代替。
= 同音代替，就是用一个读音相同、笔画少的字去代替另一个字。比如头发的“髮”，现在就写成出发的“发”。
- 同音代替是指在文字规范化过程中，以音同或音近之字形兼并他字的字际关系调整方式。 ~jargon
- 同音代替就是把字的笔画减少，比如把“國”写成“国”。 ~wrongcase
% 给初一的同学解释，要用浅白的话说清意思，再举一个真正的例子。一长串术语，他们听不懂；“國”变成“国”是减少了笔画，却不是用另一个同音的字来代替，例子举错了。 | For younger pupils, say it in plain words and give a true case. A string of terms loses them; 國 to 国 cuts strokes but puts no other character of the same sound in its place, so the example is wrong.

你报告调查结果，说到读纸质书的同学阅读时间更多。怎样说才不超出你的发现？
= 读纸质书的同学阅读时间更多，但这只说明两者同时出现，不能说明读纸质书会让人读得更多。
- 这说明读纸质书能让人爱上阅读，大家都应该改读纸质书。 ~overclaim
- 读纸质书的同学阅读时间更多，看来用手机阅读会让人变笨。 ~added
% 报告发现时，要说清它是什么，也说清它不是什么。“能让人爱上阅读”把同时出现说成了原因，超出了调查；“会让人变笨”，调查里根本没有涉及。 | Report what the finding is and what it is not. “Makes people love reading” turns going together into causing; “makes people stupid” is nowhere in the survey.

报告快要结束，你要说结论。你的研究只调查了本班四十二名同学。
= 总结一下：本班大多数同学每周课外阅读一到三小时。因为只调查了一个班，这个结论不能推广到全年级。
- 总结一下：现在的高中生普遍读书太少，必须引起全社会的重视。 ~overclaim
- 总结一下：我的报告就到这里，谢谢大家。 ~nofinding
% 结论要重述最主要的发现，并说出它适用的范围。一个班的调查，说不上“高中生普遍”；只说“就到这里”，听众还没听到发现，报告就结束了。 | The conclusion restates the main finding and how far it reaches. One class says nothing of all senior pupils; “that is all” ends before the listeners hear what was found.

你在报告“成语中的数字”，有一张幻灯片上列了三十个成语。
= 三十个成语都在讲义上，这里只说三个典型的例子：“三顾茅庐”是实指，“千方百计”表示多，“七上八下”表示乱。
- 下面我把这三十个成语一个一个读一遍，再逐一解释。 ~rambling
- 大家自己看幻灯片吧，我就不多说了。 ~needless
% 材料多时，口头报告挑几个有代表性的例子，各说明一种情况，其余的留给讲义。三十个逐一讲，听众抓不住要点；让大家自己看，又没有说出他们需要听的分类。 | With much material, a spoken report picks a few cases that each show one kind and leaves the rest to the handout. Going through all thirty loses the point; “read it yourselves” leaves out the kinds the listeners need.

你在报告南北农谚的比较，要向听众说明材料是从哪里来的。
= 我的材料有两个来源：一是一本农谚集，二是我对外公和奶奶的访问，他们分别是江苏南部和河北的农民。
- 我的材料都是真实可靠的，请大家放心。 ~needless
- 农谚是劳动人民智慧的结晶，有着悠久的历史。 ~offtopic
% 说明材料来源，要具体说出是什么书、访问了谁，听众才能判断材料可不可靠。只说“真实可靠”，听众需要知道的来源反而没有说；夸农谚的历史，离开了材料从哪里来这个问题。 | Name the sources: which book, whom you asked, so listeners can judge them. “It is all reliable” leaves out the very sources they need; praise of the sayings' history strays from where the material came from.

你在报告“鲁迅小说中的看客”，想引用《呐喊》自序中的经历来支持你的观点。
= 鲁迅在《呐喊》自序里说，他在日本看到一段影片，一群中国人神情麻木地围观同胞被杀，这使他决定弃医从文。这和小说里的看客正好可以对照。
- 鲁迅小时候一定被人围观过，所以他才这么恨看客。 ~added
- 鲁迅原名周树人，是浙江绍兴人。 ~irrelevant
% 引用材料支持观点，要说出材料的出处和内容，再说明它和观点的关系。说鲁迅“小时候一定被人围观过”，是自序里没有的说法；鲁迅的原名和籍贯是真的，但和看客没有关系。 | To support a view, give the source and what it says, then how it bears on the view. That he was stared at as a child appears nowhere in the preface; his birth name and home town are true but beside the point.

你在报告“方言中的入声与古诗的押韵”，想让同学们听出入声是什么样的。
= 请大家听我用普通话和粤语各读一遍“绝、灭、雪”：用粤语读，三个字都很短，一发出来就收住了，这就是入声。
- 入声是古代四声之一，属于仄声，《广韵》中有入声韵三十四部。 ~jargon
- 入声在普通话里已经没有了，所以不用管它。 ~off
% 讲声音，最好让听众亲耳听到，再用一句话点明特点。说出四声、仄声、韵部，没学过音韵的同学还是听不出入声是什么样；“不用管它”，正好丢掉了这次报告要讲的东西。 | To explain a sound, let the listeners hear it, then name the feature in a sentence. Tones, oblique tones and rhyme groups still leave them unable to hear it; “never mind it” drops what the talk is about.

你在报告唐诗中的月亮，正要讲第三个原因，却发现时间只剩一分钟了。
= 时间不多了，第三个原因简单说一句：夜晚安静，人最容易想家。最后用一句话总结：月亮是两地共见的，圆月象征团圆，夜晚又最安静。
- 时间不多了，第三个原因我就不讲了，谢谢大家。 ~nofinding
- 第三个原因比较复杂，我得先从夜晚人的心理说起…… ~rambling
% 时间不够时，把剩下的内容压成一句，并留出时间说结论。直接结束，第三个发现和结论都没有说出来；从头细讲，一分钟里讲不完，也就说不到结论了。 | When time runs short, press what is left into a sentence and keep time for the conclusion. Stopping leaves the third finding and the conclusion unsaid; starting at length cannot finish in a minute.
`);

/** ANSWERING_11 are the scenes of speaking-11-presenting-research: answering questions after a report, within what the research found. */
const ANSWERING_11 = checked(`
你报告完银杏树的观察，一位同学问：“你怎么知道变黄早是光照造成的？”
= 我不能确定。光照是一种可能，但土壤、水分、树龄也都可能有影响；我只观察了两棵树，还不能排除这些因素。
- 当然是光照，南边的阳光多，这是常识。 ~overclaim
- 这个问题问得很好，谢谢你的提问。 ~off
% 回答要守住研究的界限：观察只能说明有差别，说不出原因，就如实说“不能确定”，并说出还有哪些可能。说“当然是光照”，把推测说成了定论；只道谢，没有回答问题。 | Keep within what the research found: the observation shows a difference, not its cause, so say you cannot be sure and name the other possibilities. “Of course it is the light” turns a guess into a fact; thanks alone answer nothing.

你报告了《论语》中“君子”的研究，一位同学问：“你说‘君子’多数指德行，你统计过有多少处吗？”
= 没有统计全部的用例，我只分析了“君子”和“小人”对举的章句。“多数”是就这些章句说的，全书的情况还需要统计。
- 统计过，大概九成都是指德行。 ~added
- 统计不重要，读《论语》要靠体会。 ~dismiss
% 被问到研究没有做的事，要如实说没有做，并说明自己的结论建立在什么材料上。说“统计过，大概九成”，是编出了研究里没有的数字；说“统计不重要”，回避了对方的问题。 | Asked about what the research did not do, say so, and what the conclusion does rest on. “About nine in ten” invents a figure the research never had; “counting does not matter” dodges the question.

报告结束后，有人问：“你的调查只有一个班，有什么意义？”
= 一个班确实不能代表全校，我在结语里也说了。它的意义是了解我们自己班的阅读情况，也可以为更大的调查做个准备。
- 一个班也能代表全校，大家其实都差不多。 ~overclaim
- 你这样问，是不尊重我花的工夫。 ~harsh
% 对方指出局限时，好的回答承认局限，再说出研究在这个范围里的价值。说“一个班也能代表全校”，结论超出了调查；把提问当成不尊重，语气太冲，也没有回答。 | When a limit is pointed out, grant it and say what the work is worth within it. “One class stands for the school” goes past the survey; taking the question as disrespect is too sharp and answers nothing.

报告后，一位同学提了问题，你没有听清楚他问的是什么。
= 不好意思，我没有听清楚。你是问调查的方法，还是问调查的结果？
- 嗯，你说得对，下一个问题。 ~off
- 我的报告已经讲得很清楚了，你再看看幻灯片吧。 ~dismiss
% 没听清就问清楚，最好给出两种可能，让对方容易回答。随口说“你说得对”，根本没有回答他的问题；让他“再看看幻灯片”，是把提问推开了。 | If you did not hear, ask, and offer two readings to make answering easy. “You are right” answers nothing; “look at the slides again” pushes the question away.

你报告的是“方言中的入声与古诗的押韵”。一位同学问：“入声在普通话里已经消失了，为什么还要了解它？”
= 因为古诗是按古音写的。知道“绝、灭、雪”是入声字，就能明白《江雪》为什么用它们押韵，也能听出诗的节奏。
- 因为考试可能会考，所以要了解。 ~weak
- 普通话是以北京语音为标准音的，北京话受过很多语言的影响。 ~offtopic
% 回答“为什么要了解”，要用报告里的例子说明它对读古诗有什么用。“考试可能会考”，和入声对读诗的用处无关；讲普通话的标准音，离开了对方问的问题。 | To answer why it matters, show from the report's own example what it does for reading the poems. “It may be examined” has nothing to do with that use; the standard of Putonghua strays from the question.

一位同学问：“你说网络流行语没有破坏汉语，那小学生学了‘酱紫’这样的写法怎么办？”
= 这个担心有道理。我的研究只说明这些词的构成用的是汉语原有的办法，没有研究它们对学习的影响，那是另一个问题。
- 小学生不会学这种词的，你想多了。 ~dismiss
- 我的意思是网络流行语全都是好的，应该推广。 ~overclaim
% 对方问到研究没有涉及的方面，好的回答承认问题有道理，并说清研究回答了什么、没有回答什么。说“你想多了”，把对方的担心推开了；说流行语“全都是好的，应该推广”，远远超出了研究的发现。 | Asked about what the research did not cover, grant the question and say what was and was not answered. “You worry too much” pushes the concern away; “all good, spread them” goes far past the finding.

你只研究了《诗经》和唐诗里的柳。一位同学问：“那宋词里的柳也一样吗？”
= 我只研究了《诗经》和唐诗，宋词没有系统地看过。我读过的柳永《雨霖铃》里也写到杨柳和离别，但要下结论还得多看一些。
- 一样的，所有朝代的诗词都是这样。 ~overclaim
- 宋词不在我的研究范围里，这个问题不用讨论。 ~dismiss
% 问题超出研究范围时，要说明范围，可以说出自己知道的一点线索，但不下结论。“所有朝代都这样”，结论远超出材料；“不用讨论”，把一个好问题推开了。 | When a question goes past the scope, say so; offer a lead you know, but conclude nothing. “All ages are so” goes far past the material; “no need to discuss it” pushes a good question away.

你报告南北农谚时说，南方霜降时很少见霜。一位同学说：“我在杭州见过霜降那天下霜。”
= 谢谢你的补充。我的材料只来自我外公的家乡，各地的情况可能不同，“霜降很少见霜”应该限定在他那个地方。
- 你看到的一定是特殊情况，不能算数。 ~dismiss
- 杭州的冬天其实很冷，有时还会下雪。 ~offtopic
% 别人提出和你不同的事实时，好的回答感谢补充，并把自己的说法限定在材料来源的范围里。说“不能算数”，没有理由就否定了对方的事实；讲杭州冬天会下雪，离开了霜降有没有霜这个问题。 | When someone brings a fact that differs, thank them and narrow the claim to where the material came from. “It does not count” dismisses the fact without reason; snow in winter strays from frost at Frost's Descent.

报告后，老师说：“你的摘要只写了研究什么，没有写发现了什么。”
= 谢谢老师。我的发现是：南边的银杏比北边的早一周左右变黄。我把这一句加进摘要里。
- 发现在后面的正文里写了，摘要就不用再写了吧。 ~pushy
- 我觉得摘要不重要，反正大家都不看。 ~weak
% 接受合理的意见，说出要补的内容，并说明怎样改。坚持“正文里写了就不用写”，只坚持自己，没有听进意见；“大家都不看”不是理由，摘要本来就是为了让人一眼看到发现。 | Accept a fair point, say what to add and how. Insisting the body already has it only holds one's ground; “no one reads it” is no reason, for an abstract exists to show the finding at a glance.

一位同学的问题很长，最后问：“所以你觉得‘太史公曰’到底是不是司马迁的真心话？”
= 我只能根据文本说：这些话感情很强烈，比如写孔子说“心乡往之”，可以看出他的景仰；至于是不是“真心”，文本之外我没有证据。
- 当然是真心话，司马迁是一个正直的人。 ~overclaim
- 你的问题太长了，我没听懂，请下一位。 ~harsh
% 回答要从文本出发：能从文本看出的就说，看不出的就说没有证据。“司马迁正直”不能证明这些话都是真心，结论超出了依据；嫌对方问题太长，语气太冲，也没有回答。 | Answer from the text: say what it shows, and that beyond it there is no evidence. Sima Qian's honesty does not prove every word sincere; complaining of the question's length is too sharp and answers nothing.
`);

/** SPECS_11 are the speaking topics of the senior selective required course, in order. */
const SPECS_11: readonly Spec[] = [
  {
    grade: 11,
    id: "speaking-11-seminar",
    title: t("Speaking in a Seminar", "研讨发言"),
    summary: t(
      "Taking part in a seminar on a text or question: building on what others said with new grounds, asking for the evidence behind a view, and answering a challenge by granting what is right and narrowing one's claim.",
      "参加对一篇作品或一个问题的研讨：接着别人的发言，用新的依据把讨论往前推；追问一个观点的依据；面对质疑，承认对方说对的地方，把自己的说法改得更准确。",
    ),
    intro: t(
      "A seminar is thinking aloud together. Each turn takes up what was said, “我接着小林的话说”, and adds something: a line of the text, an example, a new angle. When a view is vague, ask for its grounds: which line, which figure. When your own view is challenged, the strongest answer often begins “你说得对”, and then says the claim again, narrower and truer.\n\nWhat a seminar is not: repeating the last speaker, going at the person, or winning. The first knowledge point builds on others, the second asks for and answers challenges.",
      "研讨是大家一起出声地思考。每一次发言都接住前面的话，“我接着小林的话说”，再增加一点东西：原文的一句、一个例子、一个新的角度。观点说得笼统时，就追问依据：是哪一句，哪个数字。自己的观点受到质疑时，最有力的回答往往从“你说得对”开始，再把说法改得更集中、更准确。\n\n研讨不是重复上一位的话，不是针对人，也不是争输赢。第一个知识点学接着别人的话往前推，第二个学追问和回应质疑。",
    ),
    texts: [...ruleTexts(BUILDING_11), ...ruleTexts(CHALLENGE_11)],
    after: ["speaking-10-debate"],
    points: [
      [
        "building",
        t("Building on What Was Said", "接着别人的话往前推"),
        t(
          "Begin from the last speaker: name what they said, then add what is new, a line of the text, an example, another angle, a correction resting on evidence. When the talk stalls, sum up where it stands and open a new side. Chairing, give everyone a turn.\n\nAfter “节气对种地很重要” has been said three times: “前面大家都谈到了种地，我想换个角度……”\n\n> **Watch out.** Agreeing in other words adds nothing; a true fact that does not bear on the question is still off the topic; and correcting someone by calling them careless goes at the person, not the view.",
          "从上一位的发言说起：先说出他讲了什么，再增加新的东西：原文的一句、一个例子、另一个角度，或者有依据的修正。讨论停在原地时，归纳一下说到了哪里，再打开新的一面。做主持人时，要让每个人都有机会发言。\n\n比如“节气对种地很重要”已经说了三遍，就说：“前面大家都谈到了种地，我想换个角度……”\n\n> **注意。** 换个说法表示同意，什么也没有增加；说的事实再真，和问题无关，仍然是离题；纠正别人时说他粗心，针对的是人，不是观点。",
        ),
        ruleGenerator(
          t("Which is the best thing to say in the seminar?", "研讨中这时怎样说最好？"),
          BUILDING_11,
          rule(
            t(
              "Note what was just said and where the discussion stands; choose the turn that takes it up and adds something new, on evidence.",
              "看清刚才说了什么、讨论进行到了哪里；选出接住这句话、又用依据增加新东西的发言。",
            ),
            t(
              "Ask what the discussion has after the turn that it did not have before: a line, an example, an angle or a correction.",
              "想一想，这句话说完以后，讨论多了什么以前没有的东西：一句原文、一个例子、一个角度，还是一处修正。",
            ),
            {
              find: t("Step 1: see where the discussion stands.", "第一步：看清讨论进行到了哪里。"),
              choose: t("Step 2: choose the turn that moves it on.", "第二步：选出把讨论往前推的发言。"),
            },
          ),
        ),
      ],
      [
        "challenge",
        t("Asking for Grounds and Answering a Challenge", "追问依据，回应质疑"),
        t(
          "When a view is vague or wide, ask for the grounds in a question that cannot be answered yes or no: which poem, which character, what figure. When your own view is challenged, weigh the challenge: if it holds, say so and narrow your claim; if it does not, answer it from the text or the data. When two views deadlock, say what each sees and lead back to the evidence.\n\nChallenged with a counterexample: “你说得对，那首写的是孤独。我的说法太绝对了，应该改成……”\n\n> **Watch out.** Holding a claim because it is yours, or because an elder or someone famous said it, answers nothing; and conceding is not losing: a claim made narrower and true is the gain of the seminar.",
          "观点笼统或说得太宽时，用不能只答“是”或“不是”的问题追问依据：哪一首诗、哪一个字、什么数字。自己的观点受到质疑时，先掂量质疑：说中了，就承认，并收窄自己的说法；没有说中，就用文本或数据回答。两种意见相持不下时，说出双方各看到了什么，再回到依据。\n\n比如别人举出反例：“你说得对，那首写的是孤独。我的说法太绝对了，应该改成……”\n\n> **注意。** 因为是自己说的、或者是长辈和名人说的，就坚持不改，什么也没有回答；承认不是认输：把说法改得更集中、更准确，正是研讨的收获。",
        ),
        ruleGenerator(
          t("Which is the best thing to say here?", "这时怎样说最好？"),
          CHALLENGE_11,
          rule(
            t(
              "Note the view in question and its grounds, and whether a challenge holds; choose the line that asks for the evidence, or answers the challenge on it.",
              "看清争论的是哪个观点、它有什么依据，质疑有没有说中；选出追问依据、或者用依据回应质疑的一句。",
            ),
            t(
              "Ask whether, after the line, the claim on the table rests more firmly on evidence than before: grounds asked for, a challenge granted or answered.",
              "想一想，这句话说完以后，讨论中的观点是不是比原来更有依据了：追问了依据，承认或者回答了质疑。",
            ),
            {
              find: t("Step 1: see the view and its grounds.", "第一步：看清观点和它的依据。"),
              choose: t("Step 2: choose the line that tests it fairly.", "第二步：选出公平地检验它的一句。"),
            },
          ),
        ),
      ],
    ],
  },
  {
    grade: 11,
    id: "speaking-11-presenting-research",
    title: t("Presenting Research", "学术报告"),
    summary: t(
      "Presenting a small piece of research aloud: the question, the material and the finding said plainly for these listeners and within the time, and questions afterwards answered within what the research found.",
      "口头报告一项小研究：用听众听得懂的话，在规定的时间里说清问题、材料和发现；报告后回答提问，不超出研究的发现。",
    ),
    intro: t(
      "A research report is heard once. So it says at the start what was asked, what material was used and how many findings there are; it says what figures show rather than reading them out; and it ends on the finding and how far it reaches, “因为只调查了一个班，这个结论不能推广到全年级”.\n\nThe questions afterwards test the research. Answer what it found, say plainly what it did not, and do not invent a figure or a cause to fill the gap. The first knowledge point presents, the second answers.",
      "学术报告，听众只听一遍。所以开头就要说清研究的问题、用了什么材料、有几个发现；说出数字表明了什么，而不是把数字一个个念出来；结尾回到发现和它适用的范围，比如“因为只调查了一个班，这个结论不能推广到全年级”。\n\n报告后的提问是对研究的检验。研究发现了的就回答，没有研究的就如实说，不要编一个数字或原因来填补空白。第一个知识点学报告，第二个学答问。",
    ),
    texts: [...ruleTexts(REPORTING_11), ...ruleTexts(ANSWERING_11)],
    after: ["speaking-10-interview", "speaking-11-seminar"],
    points: [
      [
        "reporting",
        t("Question, Material and Finding, Said Plainly", "说清问题、材料和发现"),
        t(
          "Open on the question, the material and how many findings, so the listeners can follow. Say what the figures show and leave the detail to a table or handout; explain a term in plain words with a true example; pick a few typical cases rather than all. Close on the finding and its reach, and when time runs short, press the rest into a sentence and keep the conclusion.\n\nNot every week's percentages read aloud, but “南边的甲树比北边的乙树早一周左右开始变黄”.\n\n> **Watch out.** A finding said wider than the material, “高中生普遍……” from one class, is wrong however well it is delivered; and a report that ends on “谢谢大家” before the finding has not reported.",
          "开头说清研究的问题、材料和有几个发现，让听众跟得上。说出数字表明了什么，细节留给表格或讲义；用浅白的话加一个真正的例子解释术语；只挑几个典型的例子，不必样样都讲。结尾回到发现和它适用的范围；时间不够时，把剩下的内容压成一句，留出时间说结论。\n\n不要把每一周的百分比都念出来，而说“南边的甲树比北边的乙树早一周左右开始变黄”。\n\n> **注意。** 发现说得比材料宽，比如凭一个班的调查说“高中生普遍……”，讲得再好也是错的；还没说出发现就“谢谢大家”的报告，等于没有报告。",
        ),
        ruleGenerator(
          t("Which is the best thing to say in the report?", "报告中这时怎样说最好？"),
          REPORTING_11,
          rule(
            t(
              "Note who is listening, how much time there is, and what this part of the report must do; choose the line that says it plainly and no wider than the research.",
              "看清听众是谁、时间有多少、报告的这一部分要做什么；选出说得浅白、又不超出研究的一句。",
            ),
            t(
              "Imagine hearing the line once, with no slide: you know what was asked or found, and nothing in it goes beyond the material.",
              "想象只听一遍、不看幻灯片：你知道了研究的问题或者发现，而且这句话没有一点超出材料。",
            ),
            {
              find: t("Step 1: see what this part of the report must do.", "第一步：看这一部分报告要做什么。"),
              choose: t("Step 2: choose the line that says it plainly.", "第二步：选出说得清楚的一句。"),
            },
          ),
        ),
      ],
      [
        "answering",
        t("Answering Questions Within the Research", "在研究的范围里答问"),
        t(
          "Hear the question out, and if it was unclear, ask which of two things was meant. Answer from what the research found; where it did not look, say so, and offer a lead without a conclusion. Grant a fair objection or a new fact, and narrow the claim to fit. Take a point about the form, such as an abstract with no finding, and say how you will mend it.\n\nAsked whether light made the tree turn early: “我不能确定。光照是一种可能，但……我只观察了两棵树。”\n\n> **Watch out.** A figure or cause made up on the spot to sound sure is worse than “我没有研究这一点”; and a question pushed away, “你再看看幻灯片”, is a question left unanswered.",
          "把问题听完，没听清就问清楚是两种意思中的哪一种。从研究的发现出发回答；研究没有涉及的，就如实说，可以说出一点线索，但不下结论。对方的反驳有道理、或者补充了新的事实，就承认，并把自己的说法收窄。对格式提出的意见，比如摘要没写发现，就接受，并说出怎样改。\n\n比如被问到是不是光照让树变黄早：“我不能确定。光照是一种可能，但……我只观察了两棵树。”\n\n> **注意。** 为了显得有把握，当场编一个数字或原因，比说“这一点我没有研究”更糟；把问题推开，比如“你再看看幻灯片”，等于没有回答。",
        ),
        ruleGenerator(
          t("Which is the best answer to the question?", "怎样回答这个提问最好？"),
          ANSWERING_11,
          rule(
            t(
              "Note what is asked and what the research did and did not find; choose the answer that keeps to the findings and grants what it cannot say.",
              "看清对方问的是什么，研究发现了什么、没有发现什么；选出守住研究的发现、又承认它说不了什么的回答。",
            ),
            t(
              "Set the answer beside the research: every claim in it rests on what was found, and the question asked is the one answered.",
              "把回答和研究对照着看：回答中的每一个说法都有研究的发现作依据，回答的也正是对方问的问题。",
            ),
            {
              find: t("Step 1: see what is asked and what the research found.", "第一步：看清问的是什么、研究发现了什么。"),
              choose: t("Step 2: choose the answer within the findings.", "第二步：选出不超出发现的回答。"),
            },
          ),
        ),
      ],
    ],
  },
];

/** stageTenElevenSpeaking are the speaking topics of the senior courses, in order, each after the reading and speaking before it. */
export const stageTenElevenSpeaking: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of [...SPECS_10, ...SPECS_11])
    built.push(
      topicOf(
        spec,
        [
          ...stageSpeakingTopics,
          ...stageThreeFourReading,
          ...stageThreeFourSpeaking,
          ...stageFiveSixReading,
          ...stageFiveSixSpeaking,
          ...stageSevenNineReading,
          ...stageSevenNineSpeaking,
          ...stageTenElevenReading,
          ...built,
        ].map((x) => x.topic),
      ),
    );
  return built;
})();
