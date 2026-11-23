// The speaking topics of grades 7 and 8 (docs/chinese-curriculum.md §18.9): for grade 7, hearing what is meant,
// retelling and relaying, speaking fittingly to the listener and the occasion, and speaking off the cuff; for grade 8,
// a prepared speech, interviewing, keeping to the focus of a discussion, and speaking persuasively. The scenes and the
// words said are written for this subject. Until their recordings are made, what is said is shown as text to be read as
// if heard.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageThreeFourReading } from "../reading/stage-3-4.ts";
import { stageFiveSixReading } from "../reading/stage-5-6.ts";
import { stageSevenNineReading } from "../reading/stage-7-9.ts";
import { parseRules, type RuleItem, ruleGenerator } from "../reading/topic-kit.ts";
import { rule, ruleTexts, type Spec, stageSpeakingTopics, topicOf } from "./speaking-1-2.ts";
import { stageThreeFourSpeaking } from "./speaking-3-4.ts";
import { stageFiveSixSpeaking } from "./speaking-5-6.ts";

/** checked reads the scenes of a knowledge point of grades 7 and 8, each of which carries its own check, resting on its clues. */
function checked(data: string): readonly RuleItem[] {
  const items = parseRules(data);
  const bare = items.filter((item) => item.check === undefined);
  if (bare.length > 0) throw new Error(`speaking-7: no check for ${bare.map((item) => item.scene).join("; ")}`);
  return items;
}

/** MEANT_7 are the scenes of speaking-7-intent: what a speaker means beyond the words. */
const MEANT_7 = checked(`
你在教室里大声说笑，正在看书的同桌抬起头说：“你的声音真响亮啊。”
= 你太吵了，请小声一点。
- 夸你嗓门大，适合当播音员。 ~surface
- 他再也不想和你做同桌了。 ~overread
% 线索有三个：你在“大声说笑”，同桌“正在看书”，他“抬起头”才说这句话。被吵得看不下书的人，说你“声音真响亮”不是夸奖，而是请你小声一点。至于他不想再做同桌，他的话里和当时的情形里都看不出来。 | Three clues: you are laughing loudly, your deskmate is reading, and he looks up to say it. Someone kept from his book is not praising your voice; he is asking for quiet. That he wants another deskmate shows nowhere in his words or the moment.

晚上十点了，你还在玩手机。妈妈走过来说：“都几点了？”
= 该放下手机去睡觉了。
- 妈妈想知道现在是几点。 ~surface
- 妈妈要把你的手机收走，再也不给你用了。 ~overread
% 线索是“晚上十点”“还在玩手机”，和“都……了”的口气。妈妈自己看得见钟，用不着问时间；“都几点了”是嫌太晚了，又正冲着还在玩手机的你，所以是叫你放下手机去睡觉。她只问了一句，没说要收走手机，更没说“再也不给”。 | The clues: ten at night, you still on the phone, and the tone of 都……了. Mother can see the clock; she need not ask the time. 都几点了 complains that it is late, said to you at your phone, so it means put it down and go to bed. She asks one question and says nothing of taking the phone, let alone for good.

你把作文交给老师，老师看完说：“开头很好，后面要是也这样就好了。”
= 开头写得好，后面写得还不够好，需要修改。
- 整篇作文都写得很好。 ~surface
- 这篇作文写得很差，要全部重写。 ~overread
% 老师先说“开头很好”，再说“后面要是也这样就好了”。“要是……就好了”说的是盼着做到而还没做到，所以后面写得不如开头，需要修改。说整篇都好，丢了后半句；说要全部重写，又丢了“开头很好”这半句。 | The teacher first says the opening is good, then “if only the rest were like it”. 要是……就好了 wishes for what has not been done, so the rest falls short of the opening and needs revising. “All of it is good” drops the second half; “rewrite it all” drops “the opening is good”.

你去同学家玩到很晚，同学的奶奶说：“天黑了，你家里人该着急了吧？”
= 天晚了，你该回家了。
- 奶奶想知道你家里人急不急。 ~surface
- 奶奶不欢迎你，以后别来了。 ~overread
% 线索是你“玩到很晚”、“天黑了”，奶奶又是对客人说“你家里人该着急了”。天黑了还在别人家，家里人会着急，意思就是你该回家了。奶奶的话带着关心，没有一句不欢迎你，“以后别来了”是想多了；她也不是真想知道你家里人急不急。 | The clues: you have stayed late, it is dark, and Grandma tells a guest his family must be worried. A child still out after dark worries his family: it is time to go home. Her words are kind, not one unwelcoming, so “don't come again” reads in too much; nor is she truly asking how worried they are.

小组讨论时，你一个人说了很久。组长说：“你的想法很多，我们也听听别人的吧。”
= 你说得太多了，该让别的同学说了。
- 组长觉得你的想法太多，一个也用不上。 ~overread
- 组长在表扬你想法多。 ~surface
% 线索是“你一个人说了很久”。组长先肯定“你的想法很多”，再用“我们也听听别人的吧”转过来，“也听听别人的”正是说该轮到别人了。他没有说你的想法用不上，也不只是在表扬你。 | The clue: you alone have talked a long time. The leader first grants that you have many ideas, then turns with “let's hear others too”, which says it is others' turn. He does not say your ideas are useless, nor is he only praising you.

你说要请朋友吃饭，朋友笑着说：“上次你也是这么说的。”
= 你上次说了却没有做到，这次别又只是说说。
- 朋友只是在回忆上次说过的话。 ~surface
- 朋友生气了，要和你绝交。 ~overread
% 线索是朋友说的“上次你也是这么说的”，和他“笑着”的样子。提起你上次同样的话，是说上次你只说了没做到；笑着说，是开玩笑地提醒，不是生气。只当作回忆，就漏了“也”字里的埋怨；说要绝交，又和“笑着”对不上。 | The clues: “you said that last time too”, and his smile. Recalling the same words last time says you promised then and did not do it; smiling, he teases rather than quarrels. Taking it as mere memory misses the reproach in 也; “he will end the friendship” does not fit the smile.

你借了同学的书，过了一个月还没还。同学问：“那本书好看吗？”
= 委婉地提醒你，该把书还给他了。
- 同学只是想知道你觉得书好不好看。 ~surface
- 同学认为你想把书据为己有。 ~overread
% 线索是书“过了一个月还没还”。书在你手里放了一个月，同学偏在这时问书好不好看，是借着问书委婉地提醒你还书。他只问了一句书怎么样，并没有说你想把书占为己有，那是想多了。 | The clue: the book has been with you a month. Asking now whether it is good is a gentle way to remind you to return it. He only asks about the book; that you mean to keep it is nowhere in his words.

你抢着回答，没等老师问完就说出了答案。老师说：“别急，先把问题听完。”
= 回答问题前要先听清楚问题，不要抢答。
- 老师说你回答得太慢了。 ~surface
- 老师以后不让你回答问题了。 ~overread
% 线索是你“没等老师问完”就抢着说了答案。老师说“别急，先把问题听完”，正是冲着你的抢答，要你先听清问题再答。说你答得太慢，正好相反；老师只是提醒，没有说以后不让你回答。 | The clue: you answered before the teacher finished asking. “Don't rush, hear the whole question first” is aimed at that, asking you to listen before you answer. “Too slow” is the opposite; and she only reminds you, she does not bar you from answering.

邻居阿姨看你在楼道里踢球，笑着说：“楼下的花盆可经不起你这一脚哦。”
= 在楼道里踢球不安全，可能踢坏东西，别在这里踢了。
- 阿姨在夸你的球踢得有力。 ~surface
- 阿姨认为你是故意要踢坏花盆。 ~overread
% 线索是你“在楼道里踢球”，阿姨提到“楼下的花盆”，还是“笑着”说的。楼道窄，花盆经不起一脚，说的是在这里踢会踢坏东西，劝你别在这儿踢；笑着说，是好意的提醒。她既没有夸你，也没有说你是故意的。 | The clues: you are kicking a ball on the stairs, she mentions the flowerpots below, and she smiles. On the narrow stairs a pot cannot take a kick: playing here may break things, so stop. The smile makes it a kindly warning. She neither praises you nor says you meant harm.

你考试前一直在玩，爸爸说：“看来你已经准备得很好了。”
= 你还没有好好复习，该抓紧准备了。
- 爸爸相信你已经复习好了。 ~surface
- 爸爸对你失望透了，不再管你了。 ~overread
% 线索是你“考试前一直在玩”。明明没有复习，爸爸却说“已经准备得很好了”，话和事实正好相反，是一句反话，意思是你该抓紧复习了。当成真话，就和“一直在玩”对不上；说爸爸不再管你，也不对，他说这话正是在管你。 | The clue: you have played the whole time before the exam. Unprepared as you are, Father says you are well prepared: the words are the reverse of the facts, irony, meaning get to work. Taken literally they clash with all that play; and “he has given up on you” is wrong, for saying it is minding you.
`);

/** ANSWERED_7 are the scenes of speaking-7-intent: a reply that answers what was meant. */
const ANSWERED_7 = checked(`
你在教室里大声说笑，正在看书的同桌抬起头说：“你的声音真响亮啊。”
= 对不起，打扰你看书了，我小声一点。
- 谢谢夸奖，我从小嗓门就大。 ~surface
- 嫌吵你可以出去看啊。 ~harsh
% 同桌正在看书，被你吵得抬起头来，他要的是安静。“对不起，打扰你看书了，我小声一点”先道歉，再答应小声，他就不用把话挑明了。谢他夸奖，是只听了字面；叫他嫌吵就出去，把一句好意的提醒变成了吵架。 | Your deskmate, disturbed at his book, wants quiet. Saying sorry and promising to be quieter answers that, so he need not say it outright. Thanking him for the praise hears only the words; telling him to leave turns a kind hint into a quarrel.

你去同学家玩到很晚，同学的奶奶说：“天黑了，你家里人该着急了吧？”
= 是啊，奶奶，我这就回家了，谢谢您的招待。
- 没事，我家里人不着急，我还能再玩一会儿。 ~surface
- 您是不是嫌我烦了？ ~harsh
% 天黑了，奶奶问“你家里人该着急了吧”，是委婉地说你该回家了。答“我这就回家了”，正回应了这个意思，再谢谢招待，也很有礼貌。说“家里人不着急，还能再玩”，奶奶只好把话说破；问“您是不是嫌我烦了”，就把关心当成了赶人。 | After dark, Grandma's question gently says it is time to go home. “I'm going home now” answers just that, and thanking her is polite. “They won't worry, I can stay” makes her say it plainly; “am I a nuisance?” takes her care for a dismissal.

你借了同学的书一个月还没还。同学问：“那本书好看吗？”
= 很好看，我已经看完了，明天就还给你，真不好意思拖了这么久。
- 好看，我还要再看一遍呢。 ~surface
- 你是不是怕我不还啊？ ~harsh
% 书借了一个月还没还，同学问书好不好看，是在提醒你还书。“我已经看完了，明天就还给你，真不好意思拖了这么久”说定了还书的时间，又为拖得太久道歉，正好回应了他的提醒。说“还要再看一遍”，书就更晚还了；反问“怕我不还啊”，让他难堪。 | With the book a month overdue, his question reminds you to return it. Saying you have finished it, will bring it tomorrow and are sorry for the delay sets a time and apologizes: it answers him. “I'll read it again” keeps it longer still; “afraid I won't give it back?” embarrasses him.

晚上十点了，你还在玩手机。妈妈说：“都几点了？”
= 我知道了，妈妈，这就放下手机去洗漱。
- 十点了。 ~surface
- 别管我，我玩完这一局再说。 ~harsh
% 晚上十点你还在玩手机，妈妈问“都几点了”，是叫你放下手机去睡觉。“这就放下手机去洗漱”答应了妈妈真正要你做的事。只答“十点了”，回答的是字面，手机还拿在手里；“别管我，玩完这一局再说”是在顶撞妈妈。 | At ten at night, on your phone, Mother's 都几点了 means put it down and get to bed. “Putting it down now to wash” does what she really asks. “It's ten” answers only the words, phone still in hand; “leave me alone, one more round” defies her.

你说要请朋友吃饭，朋友笑着说：“上次你也是这么说的。”
= 上次是我不对，这周六中午就请你，说到做到。
- 是啊，我记得我上次也说了。 ~surface
- 你怎么这么小气，老记着这点事。 ~harsh
% 朋友笑着说“上次你也是这么说的”，是提醒你上次说了却没做到。“上次是我不对，这周六中午就请你，说到做到”，先认错，再说出确定的时间，让他相信这一次是真的。“我记得我上次也说了”没有回应他的埋怨；说他小气，反倒怪起了朋友。 | Your friend's smiling “you said that last time” reminds you that you did not keep your word. Owning the fault and naming Saturday noon makes him believe it this time. “I remember saying it” ignores the reproach; calling him petty blames the friend instead.

同学来问你一道题，你正忙着写作业，只说了一句“嗯”。同学说：“你要是忙，我就去问别人吧。”
= 不忙不忙，你说，哪道题？
- 好的，你去问别人吧。 ~surface
- 你没看见我在写作业吗？ ~harsh
% 你正忙着写作业，只“嗯”了一声，同学说“你要是忙，我就去问别人吧”，是觉得你不想理他，有点失望。“不忙不忙，你说，哪道题？”马上留住了他，回应了他想得到帮助的心思。顺着说“你去问别人吧”，就真把他推走了；“你没看见我在写作业吗”更伤人。 | Busy, you only grunted, and his “if you're busy I'll ask someone else” shows he feels brushed off. “Not busy, which question?” keeps him and answers his wish for help. “Go and ask someone else” pushes him away for real; “can't you see I'm working?” hurts more.

你在公交车上坐着，一位提着很多东西的老奶奶站在你旁边，说：“这车晃得真厉害。”
= 奶奶，您坐这儿吧，东西我帮您放好。
- 是啊，这条路不太平。 ~surface
- 晃就扶好啊。 ~harsh
% 线索是老奶奶“提着很多东西”，又“站在你旁边”。她说车晃得厉害，是站不稳、需要座位。“奶奶，您坐这儿吧，东西我帮您放好”让了座又帮了忙，正回应了她的难处。只附和一句路不平，没听出她的意思；“晃就扶好啊”冷冰冰的，很伤人。 | The clues: the old woman is laden with bags and standing by you. Saying the bus sways means she cannot keep her feet and needs a seat. Offering your seat and stowing her bags meets her need. Agreeing that the road is rough misses it; “then hold on” is cold and wounding.

小组讨论时，你说了很久。组长说：“你的想法很多，我们也听听别人的吧。”
= 好，我先说到这里，大家说说看。
- 我的想法还有很多，我接着说。 ~surface
- 你是嫌我说得不好吧？ ~harsh
% 你说了很久，组长说“我们也听听别人的吧”，是请你停下来，让别人也说。“好，我先说到这里，大家说说看”马上把话让给了大家。说“我的想法还有很多，我接着说”，正好和组长的意思相反；问他是不是嫌你说得不好，把一句提醒当成了批评。 | After you have talked long, “let's hear others too” asks you to stop and let others speak. “I'll stop here, your turn” hands the floor over at once. “I have more, I'll go on” does the reverse; asking if he dislikes what you said takes a reminder for criticism.

邻居阿姨看你在楼道里踢球，笑着说：“楼下的花盆可经不起你这一脚哦。”
= 阿姨，对不起，我这就到楼下的空地上去踢。
- 没关系，我踢得很准的。 ~surface
- 花盆摆在楼道里本来就不对。 ~harsh
% 阿姨笑着说花盆经不起你这一脚，是劝你别在楼道里踢球。“对不起，我这就到楼下的空地上去踢”先道歉，又说出要换去的地方，正回应了她的担心。说“我踢得很准”，还要接着踢；说花盆不该摆在楼道里，是在顶撞阿姨。 | Her smiling remark about the pots asks you not to play on the stairs. Apologizing and moving to the open ground below meets her worry. “I aim well” means kicking on; “the pots shouldn't be there” talks back to her.

你在小组里说要做海报，可是一直没动手。组员说：“海报的事，你还记得吧？”
= 记得，真抱歉拖了这么久，我今晚就画好，明天带来。
- 记得啊，我记性很好的。 ~surface
- 催什么催，又不是只有我一个人。 ~harsh
% 线索是你说要做海报，却“一直没动手”。组员问“你还记得吧”，是在委婉地催你。“记得，真抱歉拖了这么久，我今晚就画好，明天带来”，道了歉，还说清了什么时候交。只答“我记性很好”，海报还是没做；“催什么催”把怨气撒到了组员身上。 | The clue: you offered to make the poster and have not begun. “You remember it, right?” gently presses you. Apologizing and promising it by tomorrow says when it will come. “I have a good memory” leaves it undone; “stop nagging” turns your fault on him.
`);

/** RETOLD_7 are the scenes of speaking-7-retelling: a retelling that keeps the content and its order. */
const RETOLD_7 = checked(`
老师讲了一个故事：一个人在路上捡到一只钱包，里面有很多钱。他在原地等了两个小时，等到了着急赶回来的失主。失主要给他钱，他摇摇头走了。
= 有个人在路上捡到一只装着很多钱的钱包，在原地等了两个小时，等到了赶回来的失主。失主要给他钱，他没要就走了。
- 有个人捡到一只钱包，他交给了警察，警察找到了失主。 ~retold
- 失主要给一个人钱，他没要；原来他在路上捡到了钱包，等了两个小时。 ~order
% 原来讲了四件事：捡到装着很多钱的钱包，在原地等了两个小时，等到赶回来的失主，失主要给钱他没要就走了。这一项四件都在，先后也一样。“交给了警察”是原来没有的事；从“失主要给他钱”讲起，把结尾放到了前头。 | The story has four events: finding a wallet full of money, waiting two hours on the spot, the owner hurrying back, and his refusing the reward and leaving. This retelling has all four in order. “Gave it to the police” never happened; beginning with the reward puts the end first.

同学讲了一件事：上周六，他和爸爸去爬山，走到半山腰下起了雨。他们在一个亭子里躲雨，遇到了一位护林员。护林员给他们讲了山上的很多树，雨停后，他们一起下了山。
= 上周六他和爸爸去爬山，半山腰下起了雨，他们在亭子里躲雨，遇到一位护林员。护林员讲了山上的很多树，雨停后他们一起下了山。
- 上周六他和爸爸去爬山，一口气爬到了山顶，在山顶看到了美丽的日出。 ~retold
- 他和爸爸去爬山，半山腰下雨了，后来一起下山了。 ~flat
% 原来的事依次是：上周六和爸爸爬山，半山腰下雨，在亭子里躲雨遇到护林员，护林员讲山上的树，雨停后一起下山。这一项样样都有，顺序不变。“爬到山顶看日出”改了发生的事；只说下雨和下山，漏了躲雨、遇到护林员、听他讲树这些要紧的事。 | In order: climbing with his father last Saturday, rain halfway up, sheltering in a pavilion and meeting a ranger, the ranger telling of the trees, and going down together after the rain. This has every one, in order. “Sunrise at the top” changes what happened; “rain and down again” drops the shelter, the ranger and his talk.

老师讲了一则寓言：一只狐狸看见葡萄架上挂着一串串葡萄。它跳了几次都够不着，最后走开了，边走边说：“这葡萄一定是酸的。”
= 狐狸看见葡萄架上的葡萄，跳了几次都够不着，只好走开，还边走边说：“这葡萄一定是酸的。”
- 狐狸看见葡萄，跳了几次就够着了，吃完说葡萄真酸。 ~retold
- 狐狸边走边说葡萄是酸的，它看见了葡萄，又跳了几次。 ~order
% 原来的寓言有四步：看见葡萄，跳了几次够不着，走开，边走边说葡萄一定是酸的。这一项四步都在，顺序也对。“跳了几次就够着了，吃完说真酸”改了结果；先说狐狸说葡萄酸、再说看见葡萄，把顺序倒过来了。 | The fable has four steps: the fox sees the grapes, jumps several times and cannot reach them, walks off, and says as it goes that they must be sour. This has all four in order. “Reached them and found them sour” changes the ending; starting with the sour remark reverses the order.

妈妈讲了她小时候的事：她小时候家里穷，买不起书，就每天放学跑到镇上的书店里，站着看半个小时书。书店的老板发现了，没有赶她走，还给她搬来一个小凳子。
= 妈妈小时候家里穷，买不起书，每天放学都到镇上的书店站着看半小时。老板发现后没有赶她，还给她搬来一个小凳子。
- 妈妈小时候家里穷，每天去书店看书，后来老板把书店送给了她。 ~retold
- 妈妈小时候去书店看书，老板对她很好。 ~flat
% 原来讲的是：家里穷买不起书，每天放学到镇上书店站着看半小时，老板发现后没赶她，还搬来小凳子。这一项每件都有，先后不变。“把书店送给了她”是原来没有的事；“老板对她很好”太笼统，漏了站着看书、搬凳子这些要紧的事。 | The story: too poor for books, she stood reading half an hour daily in the town bookshop, and the owner, finding out, let her stay and brought her a stool. This has each part in order. “Gave her the shop” never happened; “the owner was kind” is too vague and drops the standing and the stool.

科学课上老师讲：蜜蜂找到花蜜以后，会飞回蜂巢跳一种“8”字形的舞。舞的方向告诉同伴花在哪个方向，跳得快慢告诉同伴花有多远。
= 蜜蜂找到花蜜后，会飞回蜂巢跳“8”字形的舞：舞的方向告诉同伴花在哪个方向，跳得快慢告诉同伴花有多远。
- 蜜蜂找到花蜜后会跳舞，跳得越高，说明花越多。 ~retold
- 蜜蜂会跳舞，还会告诉同伴一些事。 ~flat
% 原来讲了：找到花蜜后飞回蜂巢跳“8”字舞，舞的方向说明花在哪个方向，跳得快慢说明花有多远。这一项三点都在。“跳得越高花越多”是原来没有说的；“还会告诉同伴一些事”没说清告诉什么，等于没复述。 | The talk: finding nectar, a bee flies home and dances a figure eight; the direction tells where the flowers are, the speed how far. This has all three. “Higher means more flowers” was never said; “tells its fellows something” leaves out what, so nothing is retold.

同学讲了一件事：昨天放学，他看见一个小男孩的风筝挂在了树上，小男孩急得直哭。他找来一根长竹竿，费了好大劲才把风筝取下来。小男孩破涕为笑，连声说谢谢。
= 昨天放学，他看见一个小男孩的风筝挂在树上，小男孩急哭了。他找来长竹竿，费了好大劲把风筝取了下来，小男孩笑着连声道谢。
- 昨天放学，他看见一个小男孩在放风筝，就和小男孩一起放了一下午。 ~retold
- 小男孩笑着连声道谢，因为他用竹竿取下了风筝；那时小男孩急得直哭，风筝挂在树上。 ~order
% 原来依次是：风筝挂在树上，小男孩急哭了，他找来长竹竿费劲取下风筝，小男孩笑着道谢。这一项按这个顺序说全了。“一起放了一下午风筝”改了事情；从道谢倒着讲到风筝挂在树上，顺序乱了。 | In order: the kite stuck in a tree, the boy crying, the long bamboo pole and the hard work of getting it down, the boy's smiling thanks. This tells them all in that order. “Flew kites all afternoon” changes the event; starting from the thanks and going back scrambles the order.

老师讲了一个故事：古时候有个人想学写字，可是买不起纸。他就在沙地上用树枝写，写了擦，擦了写。几年后，他的字写得非常好。
= 古时候有个人想学写字，买不起纸，就用树枝在沙地上写，写了擦，擦了写，几年后字写得非常好。
- 古时候有个人想学写字，他借了别人的纸和笔，几年后成了书法家。 ~retold
- 有个人在沙地上写字，后来字写得很好。 ~flat
% 原来讲的是：想学写字买不起纸，就用树枝在沙地上写，写了擦、擦了写，几年后字写得很好。这一项件件都有。“借了别人的纸和笔”正好改掉了买不起纸这个关键；只说“在沙地上写字，后来写得很好”，漏了买不起纸和一遍遍地练。 | The story: too poor for paper, he wrote with a stick in the sand, writing and wiping again and again, and after some years wrote very well. This has every part. “Borrowed paper and brush” changes the very point; “wrote in sand and got good” drops the poverty and the endless practice.

爷爷讲了一件事：他年轻时在山里修路。有一次下大雪，路被封了，他们十几个人在山上的小屋里住了七天，靠分着吃带去的干粮，一起等到了雪停。
= 爷爷年轻时在山里修路，有一次大雪封了路，他们十几个人在山上的小屋里住了七天，分着吃带去的干粮，一起等到雪停。
- 爷爷年轻时在山里修路，有一次下大雪，他一个人走下山去找人来帮忙。 ~retold
- 他们分着吃干粮，在小屋里住了七天；后来才下起了大雪，路被封了。 ~order
% 原来的顺序是：在山里修路，大雪封了路，十几个人在小屋住了七天，分着吃干粮，等到雪停。这一项顺序和内容都对。“一个人下山找人帮忙”改了发生的事；先说住了七天、后说下雪封路，把前因后果倒过来了。 | In order: building a mountain road, snow closing it, a dozen men in a hut for seven days sharing their rations, waiting for the snow to stop. This has it all, in order. “Went down alone for help” changes what happened; the seven days before the snow reverses cause and effect.

同学讲了一次比赛：校篮球赛决赛，他们班一直落后。最后一分钟，队长投进了一个三分球，他们班以一分的优势赢了。
= 校篮球赛决赛，他们班一直落后，最后一分钟队长投进一个三分球，他们班以一分赢了。
- 校篮球赛决赛，他们班一直领先，最后轻松赢了。 ~retold
- 他们班以一分赢了，队长投进了三分球，比赛中他们一直落后，那是校篮球赛决赛。 ~order
% 原来讲的是：决赛中他们班一直落后，最后一分钟队长投进三分球，以一分赢了。这一项按先后说全了。“一直领先，轻松赢了”改掉了落后和最后的绝杀；从“以一分赢了”倒着讲回去，顺序乱了。 | The game: behind all along in the final, the captain's three in the last minute, a one-point win. This tells it all in order. “Ahead all along, an easy win” removes the deficit and the last shot; working back from the one-point win scrambles the order.

老师讲了一个故事：有个孩子每天给一棵小树浇水。别人笑他：“这么小的树，什么时候才能乘凉？”他说：“我乘不了凉，以后的人可以。”多年后，那棵树长成了大树，村里的人都在树下乘凉。
= 有个孩子每天给小树浇水，别人笑他等不到乘凉，他说自己乘不了凉，以后的人可以。多年后，小树长成大树，村里人都在树下乘凉。
- 有个孩子每天给小树浇水，第二年他就在大树下乘凉了。 ~retold
- 有个孩子给小树浇水，后来树长大了。 ~flat
% 原来讲了：孩子每天浇水，别人笑他等不到乘凉，他说以后的人可以；多年后树长大，村里人都来乘凉。这一项每件都有，连孩子那句话的意思也保留了。“第二年他就乘凉了”改了结果，也丢了他那句话；“后来树长大了”漏掉了别人笑他和他的回答，故事最要紧的意思没了。 | The story: a boy waters a sapling daily, others laugh that he will never sit in its shade, he says those after him will, and years later the village rests beneath it. This keeps every part, his words too. “Shade the next year” changes the end and loses his words; “the tree grew” drops the mockery and his reply, the heart of the tale.
`);

/** RELAYED_7 are the scenes of speaking-7-retelling: a message relayed to its listener, the words turned round. */
const RELAYED_7 = checked(`
班主任对你说：“请你告诉李明，明天的班会改到下午第二节，让他把发言稿再改一改，写短一点。”
= 李明，班主任说明天的班会改到下午第二节，让你把发言稿再改一改，写短一点。
- 李明，明天的班会改到下午第二节，请你把发言稿再改一改，写短一点。 ~missing
- 李明，班主任说明天的班会改到下午第二节，你的发言稿写得太差，要重写。 ~added
% 原话有三点：说话的是班主任，班会改到明天下午第二节，发言稿再改一改、写短一点。这一句先说“班主任说”，三点都准确，原话的“他”也换成了对李明说的“你”。另一句没说是谁说的；“写得太差，要重写”是班主任没说过的话。 | The message has three points: it is from the head teacher, the meeting moves to the second lesson tomorrow afternoon, and the speech should be revised and shortened. This says who sent it, keeps all three, and speaks to Li Ming as “you”. The other omits the sender; “too poor, rewrite it” was never said.

外婆打电话来，对你说：“告诉你妈妈，我周六上午坐九点的车过来，不用来接，我自己能找到。”
= 妈妈，外婆说她周六上午坐九点的车过来，不用去接，她自己能找到。
- 妈妈，外婆说我周六上午坐九点的车过来，不用来接，我自己能找到。 ~person
- 妈妈，外婆说她周六过来，让你一定去车站接她。 ~added
% 原话里的“我”是外婆，转述给妈妈就要换成“她”：“外婆说她周六上午坐九点的车过来，不用去接，她自己能找到。”时间、车次、不用接，都没变。照搬“我”，听起来像是你要来；“让你一定去车站接她”和原话正好相反。 | Grandmother's “I” must become “she” for Mother: Grandma says she comes Saturday on the nine o'clock bus, needs no meeting and will find her way. Time, bus and “no need to meet” are all kept. Keeping “I” sounds as if you are coming; “be sure to meet her” says the reverse.

体育老师对你说：“你去通知三班的体育委员，下午的课改在体育馆上，大家穿运动鞋，带上跳绳。”
= 体育老师让我通知你，下午的体育课改在体育馆上，大家穿运动鞋，带上跳绳。
- 下午的体育课改在体育馆上，大家穿运动鞋，带上跳绳，我们班上次也在体育馆上过，那里的地板很滑，我还摔了一跤。 ~rambling
- 体育老师让我通知你，下午的体育课改在体育馆上，大家穿运动鞋。 ~missing
% 原话有三点：下午的课改在体育馆上，穿运动鞋，带上跳绳；还要说清是体育老师让你通知的。这一句都做到了。扯上体育馆地板滑、自己摔了一跤，是对方不需要的话；漏了“带上跳绳”，三班的同学就会空着手去。 | Three points: the afternoon class moves to the gym, wear sports shoes, bring skipping ropes; and say the PE teacher sent you. This does it all. The slippery floor and your fall are things they need not hear; leaving out the ropes sends Class 3 empty-handed.

爸爸出门前对你说：“要是王叔叔来电话，就跟他说，我明天上午十点在公司等他，让他带上合同。”
= 王叔叔，我爸爸说他明天上午十点在公司等您，请您带上合同。
- 王叔叔，我明天上午十点在公司等你，你带上合同。 ~person
- 王叔叔，我爸爸说明天在公司等您。 ~missing
% 原话的“我”是爸爸、“他”是王叔叔，对王叔叔说就是“我爸爸说他……等您，请您带上合同”。时间十点、地点公司、带上合同，一样不少。照搬“我”和“你”，像是你自己要在公司等他；只说“在公司等您”，漏了时间和合同。 | Father's “I” is Father and “him” is Uncle Wang, so to Uncle Wang: my father says he will wait for you, please bring the contract. Ten o'clock, the office and the contract are all there. Keeping “I” and “you” sounds as if you will wait for him; “waiting at the office” drops the time and the contract.

图书管理员对你说：“请你告诉你们班的同学，借的书这周五以前要还，过期一天罚抄一页书。”
= 同学们，图书管理员说，借的书这周五以前要还，过期一天罚抄一页书。
- 同学们，图书管理员说，借的书这周五以前要还，不还的话以后都不能借书了。 ~added
- 同学们，图书管理员说，借的书要还了，我前几天去图书馆，看见新来了很多科幻小说，有一本特别好看…… ~rambling
% 原话是：借的书这周五以前要还，过期一天罚抄一页书。这一句说清是图书管理员说的，两点都准确。“以后都不能借书了”是管理员没说过的处罚；扯到新来的科幻小说，是同学们这时不需要的话，还漏了罚抄。 | The message: return books by Friday, and each day late means copying out a page. This names the librarian and keeps both points. “No more borrowing” is a penalty she never set; the new science fiction is beside the point and the copying is lost.

同学小张对你说：“帮我跟王老师说一声，我发烧了，今天请假，作业让同桌帮我交。”
= 王老师，小张说他发烧了，今天请假，作业让他同桌帮他交。
- 王老师，小张说我发烧了，今天请假，作业让同桌帮我交。 ~person
- 王老师，小张说他今天不来了。 ~missing
% 原话里的“我”是小张，对王老师说就要换成“他”：“小张说他发烧了，今天请假，作业让他同桌帮他交。”发烧、请假、同桌交作业，三点都在。照搬“我”，像是你发烧了；“他今天不来了”漏了原因和作业的事。 | Xiao Zhang's “I” must become “he” for the teacher: he has a fever, is absent today, and his deskmate will hand in his homework. All three points are kept. Keeping “I” sounds as if you are ill; “he isn't coming” drops the reason and the homework.

社区的阿姨对你说：“告诉你爸爸妈妈，这周日上午小区停水，从八点到十二点，记得提前把水存好。”
= 爸爸妈妈，社区的阿姨说这周日上午八点到十二点小区停水，让我们提前把水存好。
- 爸爸妈妈，社区的阿姨说周日要停水一整天。 ~added
- 爸爸妈妈，社区的阿姨说要停水，她今天穿了一件红衣服，说话的时候还提着一袋菜…… ~rambling
% 原话有三点：这周日上午、八点到十二点停水、提前把水存好。这一句三点都在，也说清是社区的阿姨说的。“停水一整天”把时间说错了；说阿姨穿红衣服、提着菜，是爸妈不需要的话，还漏了停水的时间。 | Three points: this Sunday morning, no water from eight to twelve, store water first. This keeps all three and names the community worker. “All day” gets the time wrong; her red coat and shopping are needless, and the hours are lost.

音乐老师对你说：“你告诉合唱队的同学，明天中午十二点半到音乐教室排练，不要迟到。”
= 音乐老师说，明天中午十二点半到音乐教室排练，请大家不要迟到。
- 音乐老师说，明天到音乐教室排练。 ~missing
- 音乐老师说，明天中午十二点半到音乐教室排练，迟到的人就不能参加演出了。 ~added
% 原话是：明天中午十二点半，到音乐教室排练，不要迟到。这一句说清是音乐老师说的，时间、地点、要求都在。只说“明天到音乐教室排练”，漏了十二点半，同学们不知道几点去；“迟到的人就不能参加演出了”是老师没说过的话。 | The message: rehearsal tomorrow at half past twelve in the music room, don't be late. This names the teacher and keeps time, place and request. “Rehearse tomorrow” drops 12:30, so no one knows when; “late singers can't perform” was never said.

奶奶对你说：“你跟你哥哥说，我给他织的毛衣放在他床上了，让他试一试，小了我再改。”
= 哥哥，奶奶说她给你织的毛衣放在你床上了，让你试一试，小了她再改。
- 哥哥，奶奶说我给你织的毛衣放在他床上了，让他试一试，小了我再改。 ~person
- 哥哥，奶奶给你织了毛衣，你快去穿上，穿上就不能脱了。 ~added
% 原话里的“我”是奶奶、“他”是哥哥，对哥哥说就要换成“奶奶说她给你织的毛衣放在你床上了，让你试一试，小了她再改”。这一句全换对了。另一句的“我”“他”还照着原话，哥哥听不明白是谁织的、放在谁床上；“穿上就不能脱了”是奶奶没说过的话。 | Grandma's “I” and “him” must become “she” and “you” for the brother: she knitted you a sweater, it's on your bed, try it, and she will alter it if small. This turns them all. The other keeps “I” and “his”, so he cannot tell who knitted it or whose bed; “you can't take it off” was never said.

班长对你说：“你跟数学课代表说，明天的数学作业是练习册第三十页，周四交。”
= 班长让我告诉你，明天的数学作业是练习册第三十页，周四交。
- 班长让我告诉你，明天有数学作业。 ~missing
- 明天的数学作业是练习册第三十页，周四交，班长说这些的时候正在吃苹果，他吃的苹果特别大…… ~rambling
% 原话是：明天的数学作业是练习册第三十页，周四交。这一句说清是班长让你告诉的，两点都准确。只说“明天有数学作业”，课代表不知道是哪一页、哪天交；说班长在吃苹果，是对方不需要的话，也没说清是谁的话。 | The message: tomorrow's maths homework is page thirty of the workbook, due Thursday. This says the monitor sent it and keeps both points. “There's maths homework” leaves out the page and the day; the apple is needless, and the sender is never named.
`);

/** LISTENER_7 are the scenes of speaking-7-proper: words that fit who is spoken to. */
const LISTENER_7 = checked(`
你在学校走廊里遇到校长，想请他在读书节上给同学们讲几句话。你说：
= 校长好！下周五是我们的读书节，同学们想请您给大家讲几句话，不知道您有没有时间？
- 喂，校长，下周五读书节，你来讲两句呗。 ~casual
- 尊敬的校长阁下，兹定于下周五举办读书节，恳请您拨冗莅临指导。 ~stiff
% 听话的人是校长，是长辈，又是在学校里，要先问好、用“您”，把事说清，再客气地问“有没有时间”。这一句都做到了。“喂……你来讲两句呗”对校长太随便；“兹定于……拨冗莅临”像一份公文，不像学生当面说的话。 | The listener is the headmaster, an elder, at school: greet him, use 您, state the matter and ask politely if he has time. This does it all. “Hey, come say a few words” is far too casual; 兹定于……拨冗莅临 reads like an official notice, not a pupil speaking.

你给好朋友发消息，约他周末一起去打球。你说：
= 周六上午有空吗？一起去打球吧，九点在球场见！
- 尊敬的同学，本人诚挚地邀请您于本周六上午九时前往球场参加篮球活动。 ~stiff
- 喂，老头，周六打球。 ~address
% 听话的人是好朋友，平常怎么聊就怎么说，说清时间、地点就好：“周六上午有空吗？……九点在球场见！”“尊敬的同学，本人诚挚地邀请您”对朋友太生硬；叫朋友“老头”，称呼不合适。 | The listener is a close friend: speak as you always do, with the time and place. “尊敬的同学，本人诚挚地邀请您” is stiff with a friend; calling him “old man” is the wrong address.

你在路上迷路了，想向一位老爷爷问路。你说：
= 爷爷，您好！请问去人民医院怎么走？
- 哎，老头，人民医院在哪儿？ ~address
- 打扰了，敬请告知本人前往人民医院的具体路线。 ~stiff
% 对方是陌生的老爷爷，要称“爷爷”，先问好，用“您”，再说“请问”。这一句都有。叫他“老头”没礼貌；“敬请告知本人……”太生硬，老人听了反而别扭。 | The listener is an old stranger: call him 爷爷, greet him, use 您 and 请问. This has it all. “Old man” is rude; 敬请告知本人 is so stiff he would find it odd.

你代表班级去邀请隔壁班的同学参加联欢会。你对他们说：
= 大家好！我们班周五下午开联欢会，想邀请你们班一起来参加，人越多越热闹！
- 哎，你们周五下午来我们班玩不？爱来不来。 ~casual
- 兹定于本周五下午举行联欢会，敬请贵班全体同学届时出席。 ~stiff
% 对方是隔壁班的同学，年纪和你差不多，你又是代表班级去请人，要说得热情、清楚：什么时间、什么事、请他们来。这一句都有。“爱来不来”太随便，听着像不想请；“兹定于……敬请贵班”像贴在墙上的通知。 | The listeners are pupils your age, and you invite them for your class: warmly and clearly, with when, what and the invitation. This has it all. “Come or don't” is careless and sounds unwilling; 兹定于……敬请贵班 is a wall notice.

你给外婆打电话，祝她生日快乐。你说：
= 外婆，祝您生日快乐！身体健康，天天开心！我和妈妈周末就去看您。
- 外婆，生日快乐哈，没别的事我挂了。 ~casual
- 谨代表我们全家，向您致以最诚挚的生日祝贺。 ~stiff
% 对方是外婆，是亲人也是长辈，说话要亲切，用“您”，祝福也要说得暖。这一句有祝福、有问候，还说了周末去看她。“生日快乐哈，没别的事我挂了”太随便，外婆会觉得被敷衍；“谨代表我们全家致以最诚挚的祝贺”像在台上致辞，对外婆太生分。 | Grandma is family and an elder: warm words, 您, a heartfelt wish. This has the wish, good health and a visit at the weekend. “Happy birthday, bye” brushes her off; 谨代表我们全家…… is a speech from a stage, too distant for her.

新同学刚转来，坐在你旁边。你想跟他打个招呼。你说：
= 你好，我叫林小雨，以后我们就是同桌了，有什么不清楚的可以问我。
- 新来的，你叫啥？ ~casual
- 欢迎你加入本班，望你遵守纪律，努力学习。 ~stiff
% 对方是刚转来的同龄同学，要友好、自然：问好，说出自己的名字，主动说可以帮他。这一句都做到了。“新来的，你叫啥”太随便，新同学会觉得不被尊重；“望你遵守纪律”像老师训话，不像同学之间说的话。 | The listener is a new pupil your age: friendly and natural, a greeting, your name, an offer of help. This does it. “New kid, what's your name” is careless and slighting; “I hope you will keep the rules” is a teacher's lecture, not a classmate's words.

你想借用邻居叔叔家的梯子。你说：
= 叔叔好，我家的灯坏了，想借您家的梯子用一下，用完马上还给您，可以吗？
- 叔叔，把梯子给我用用。 ~casual
- 叔叔，本人因修理灯具需要，特向您申请借用梯子一架。 ~stiff
% 对方是邻居叔叔，是长辈。借东西要先问好，说明为什么借，说好用完就还，最后问“可以吗”。这一句都有。“把梯子给我用用”像在命令他；“特向您申请借用梯子一架”像在写申请书，当面说很别扭。 | The neighbour is an elder. To borrow: greet him, say why, promise to return it, and ask if you may. This has it all. “Give me the ladder” is an order; 特向您申请借用梯子一架 is a written application, odd face to face.

你在书店里找不到想要的书，想请店员帮忙。你说：
= 您好，请问《昆虫记》放在哪一排？我找了一圈没找到。
- 喂，《昆虫记》在哪儿？快点告诉我。 ~casual
- 您好，敬请您在百忙之中为我查找《昆虫记》所在的位置。 ~stiff
% 对方是书店的店员，是陌生人，要说“您好”“请问”，再说清要找哪本书。这一句都有，还说了自己已经找过一圈。“喂……快点告诉我”没礼貌；“敬请您在百忙之中”太生硬，问一本书用不着这样说。 | The assistant is a stranger: 您好 and 请问, and say which book. This has them, and adds that you have looked already. “Hey… tell me quick” is rude; 敬请您在百忙之中 is too stiff for asking after a book.

你要向全班同学介绍自己的读书小组。你说：
= 大家好，我们读书小组每周三下午活动，一起读书、聊书，欢迎喜欢读书的同学加入。
- 哎，有人来我们读书小组不？没人就算了。 ~casual
- 全体同学请注意：读书小组现已成立，凡有意者须于本周内报名。 ~stiff
% 听话的人是全班同学，要先问好，说清小组什么时候活动、做什么，再欢迎大家加入。这一句都有。“没人就算了”太随便，听着像不想让人来；“凡有意者须于本周内报名”像下命令的通知。 | The listeners are the whole class: greet them, say when the group meets and what it does, and welcome them. This has it all. “If nobody comes, never mind” sounds as if no one is wanted; 凡有意者须于本周内报名 is a notice giving orders.

你在公园里不小心把球踢到了一位阿姨脚边，想请她帮忙把球递过来。你说：
= 阿姨，不好意思，能麻烦您把球递给我吗？谢谢您！
- 喂，那个谁，把球踢过来！ ~address
- 阿姨，可否劳驾您将足球传递给本人？ ~stiff
% 对方是公园里陌生的阿姨，要称“阿姨”，先说“不好意思”，再问“能麻烦您……吗”，最后道谢。这一句都有。“喂，那个谁”称呼不合适；“可否劳驾您将足球传递给本人”文绉绉的，太生硬。 | The listener is a woman you do not know: call her 阿姨, say sorry, ask if you may trouble her, and thank her. This has it all. “Hey, you there” is the wrong address; 可否劳驾您将足球传递给本人 is bookish and stiff.
`);

/** OCCASION_7 are the scenes of speaking-7-proper: words that fit the occasion. */
const OCCASION_7 = checked(`
你去医院看望生病的同学。你说：
= 你好点了吗？好好休息，课上讲的内容我都记下来了，回来我讲给你听。
- 哈哈，你可真会挑时间生病，正好不用考试了。 ~unfit
- 你怎么这么不小心，又生病了。 ~harsh
% 这是在病床前，同学身体不舒服，心里也不好受，要关心他、让他安心。这一句问候他、叫他好好休息，还帮他记了课上的内容，正合这个场合。“真会挑时间生病”是在病人面前开玩笑，会伤他；“怎么这么不小心”是在责怪病人。 | At a sickbed, your classmate is unwell and low: show care and set his mind at rest. Asking after him, telling him to rest and offering your notes fits. “Good timing for being ill” jokes at a sick boy and hurts; “how careless” blames the patient.

学校举行升旗仪式，主持人请你上台发言。你开口说：
= 老师们，同学们，大家早上好！我今天发言的题目是《从小事做起》。
- 嗨，大家好呀，我来随便说两句哈。 ~casual
- 我先给大家讲个笑话，保证你们笑得肚子疼。 ~unfit
% 升旗仪式是庄重的场合，面对的是全校的老师和同学，要正式地问好，说清发言的题目。这一句正是这样开头的。“随便说两句哈”太随便；在仪式上讲笑话，和庄重的气氛不合。 | A flag-raising ceremony is solemn, before the whole school: greet them formally and name your topic. This opens just so. “I'll just say a bit” is careless; a joke breaks the solemn mood.

邻居家的老人去世了，你在楼道里遇到邻居阿姨。你说：
= 阿姨，听说爷爷走了，您多保重身体。
- 阿姨，您今天怎么没精神？笑一个嘛。 ~unfit
- 阿姨，人总是要死的，您别想太多。 ~harsh
% 邻居家刚有老人去世，阿姨正在伤心，这时要轻声安慰，请她保重。这一句做到了。问她“怎么没精神，笑一个嘛”，是在伤心的人面前说不合时宜的话；“人总是要死的”虽然是实话，对刚失去亲人的人说太冷酷。 | An old neighbour has just died and she is grieving: comfort her quietly and ask her to take care. This does. “Why so glum, smile” is out of place before the bereaved; “everyone dies” may be true but is cruel to say now.

图书馆里很安静，你想问旁边的同学借一支笔。你说：
= （小声地）能借我一支笔吗？谢谢。
- （大声地）喂，有笔吗？借我一支！ ~unfit
- （小声地）笔，给我。 ~rude
% 图书馆里很安静，大家都在看书，说话要小声，借东西也要客气。这一句小声地问，还说了谢谢，正合这个场合。大声喊“有笔吗”打扰了别人；声音虽小，只说“笔，给我”像在命令，没礼貌。 | The library is quiet, everyone reading: speak low and ask politely. This whispers and says thanks. Calling out “anyone got a pen?” disturbs them; a whispered “pen, give it here” is still an order, and rude.

全家人在饭桌上为爷爷过八十岁生日，请你说几句祝福的话。你说：
= 祝爷爷生日快乐，福如东海，寿比南山！希望您身体健康，常常给我们讲故事。
- 爷爷，八十岁了，您可真老啊。 ~unfit
- 祝您生日快乐。我吃饱了，先去玩了。 ~casual
% 这是爷爷的八十岁生日，全家人在一起，要说吉利、温暖的祝福。这一句祝寿、祝健康，还说想常听他讲故事，正合喜庆的气氛。说“您可真老啊”在寿宴上不合时宜；一句“生日快乐”就离开，太随便。 | It is Grandpa's eightieth with the family round him: auspicious, warm wishes. Long life, good health and wanting his stories fit the joy. “You're really old” jars at a birthday feast; “happy birthday, I'm off” is careless.

比赛输了，队友们都很难过。作为队长，你说：
= 大家今天都尽力了。我们回去好好找找原因，下次再来！
- 哭什么哭，输了就输了。 ~harsh
- 都怪你们，要是我一个人上，肯定赢。 ~rude
% 比赛刚输，队友们都很难过，队长要安慰大家、给大家打气。这一句先肯定大家尽力了，再说回去找原因、下次再来。“哭什么哭”在大家难过时太冲；“都怪你们”把输的责任推给队友，既没礼貌又伤人。 | The match is lost and the team is low: the captain comforts them and lifts them. Granting they did their best and planning to learn and come back does that. “Stop crying” is harsh to the hurt; “it's your fault” blames them, rude and wounding.

你在电话里向陌生的工作人员咨询博物馆开放的时间。你说：
= 您好，请问博物馆这周六几点开门？要不要提前预约？谢谢。
- 喂，博物馆几点开门啊？ ~casual
- 喂，你们博物馆怎么连开门时间都不写清楚？ ~harsh
% 这是在电话里问陌生的工作人员，要先问好，把问题说清楚，最后道谢。这一句问了开门时间，还问了要不要预约，有礼貌也有条理。“喂，几点开门啊”太随便；一开口就指责“怎么连开门时间都不写清楚”，对方听了不高兴。 | On the phone to a stranger at work: greet, ask clearly, thank. This asks the hours and about booking, politely and in order. “Hey, when do you open?” is careless; opening with “why don't you even post your hours?” offends.

新年联欢会上，你主持一个游戏，同学们都很兴奋。你说：
= 下面我们来玩“击鼓传花”！鼓声停的时候花在谁手里，谁就来表演一个节目！
- 下面进行游戏环节。请各位同学严格遵守游戏规则，不得违规。 ~stiff
- 我说一下，这个游戏，就是那个，传花，嗯，大家玩吧。 ~unclear
% 联欢会上大家很兴奋，主持游戏要说得清楚又有趣，一句话把玩法讲明白。这一句说了游戏的名字和玩法，气氛也热烈。“严格遵守游戏规则，不得违规”像在宣读纪律，和欢乐的气氛不合；“这个游戏，就是那个，传花”说不清楚，大家不知道怎么玩。 | At the party everyone is excited: run the game clearly and with fun, its rules in a sentence. This names the game and how to play, and lifts the mood. “Strictly observe the rules” reads out regulations against the joy; “this game, that, passing the flower” is unclear, so no one knows how to play.

老师在批评一位同学上课说话，那位同学低着头。下课后你对他说：
= 别难过了，以后上课我们一起注意，有话下课再说。
- 活该，谁让你上课说话。 ~harsh
- 你被老师骂了，真好笑，我要告诉大家。 ~unfit
% 同学刚被老师批评，正低着头难过，这时要安慰他，也提醒以后注意。这一句做到了。说“活该”，是在他难过时落井下石；说要告诉大家，是拿别人的难堪取乐。 | He has just been scolded and hangs his head: comfort him and suggest care next time. This does. “Serves you right” kicks him when down; telling everyone makes sport of his shame.

你在参观纪念馆，看到英雄们的遗物，同学在一旁大声说笑。你对他说：
= （小声地）这里是纪念馆，我们小声一点吧。
- （大声地）你吵死了，闭嘴！ ~rude
- （大声地）哈哈，你看这件衣服，又破又旧。 ~unfit
% 纪念馆是缅怀英雄的庄严地方，要安静、尊重。提醒同学也要小声、和气：“这里是纪念馆，我们小声一点吧。”大声喊“闭嘴”，自己也在吵，还没礼貌；大声笑英雄的遗物又破又旧，是不尊重英雄。 | A memorial hall honours heroes: be quiet and respectful, and remind a friend softly and kindly. Shouting “shut up” is noisy and rude itself; laughing aloud that the relics are old and torn disrespects the heroes.
`);

/** LINKED_7 are the scenes of speaking-7-impromptu: an opening that starts from the moment at hand. */
const LINKED_7 = checked(`
春游时，大家在山顶休息，老师突然请你说几句。你开口说：
= 站在山顶往下看，我们刚才走过的路弯弯曲曲，可我们一个也没掉队。我想说的就是：一起走，再远的路也不怕。
- 我想说说学习的重要性。学习是每个人的事，我们要好好学习。 ~unlinked
- 关于爬山，第一，第二，第三，我分三点来说，首先是…… ~noopening
% 这一句从大家此刻都看得见的“刚才走过的路”说起，又说到“一个也没掉队”，再引出“一起走，再远的路也不怕”，只能在这次春游的山顶上讲。“学习的重要性”放到哪儿都能讲，和山顶毫无关系；只说“第一，第二，第三”，还没开始说内容。 | This starts from the path everyone can see below, notes that no one fell behind, and draws the point: together no road is too far. It belongs to this hilltop alone. “The importance of study” could be said anywhere; “first, second, third” has not begun.

开学第一天，班主任请新同学每人说几句话。你说：
= 走进教室，我看到窗外的那棵大树，和我原来学校里的一样高。我希望在这里，也能交到和原来一样好的朋友。
- 人生就像一场旅行，我们每个人都是旅行者。 ~unlinked
- 我叫……嗯……那个，就说到这里吧。 ~unclear
% 这一句从走进教室看到的“窗外那棵大树”说起，连到原来的学校，再说出盼着交到朋友，正是新同学在这一天、这间教室里才会说的话。“人生就像一场旅行”放在哪里都能讲；“嗯……那个，就说到这里吧”什么也没说。 | This starts from the tree outside the window, links it to the old school and hopes for friends: words for this day and this room. “Life is a journey” fits anywhere; “um, that's all” says nothing.

参加完植树活动，老师请你说说感想。你说：
= 刚才我和同学抬水、扶苗、培土，手上都是泥。看着那一排小树，我想，十年后再来，它们会比我们还高。
- 我认为保护环境是全人类的责任，我们要从现在做起。 ~unlinked
- 首先我要感谢老师，感谢同学，感谢学校，感谢家长…… ~rambling
% 这一句从刚才“抬水、扶苗、培土”和“手上都是泥”说起，看着眼前那一排小树想到十年以后，句句都是这次植树才有的。“保护环境是全人类的责任”哪里都能讲；一连串“感谢”离了题，越说越长。 | This starts from carrying water, holding saplings and banking earth, muddy hands, and looks at the row of trees to ten years on: all of this planting day. “Protecting the environment is everyone's duty” fits anywhere; a string of thanks wanders off.

班里为一位要转学的同学送别，大家请你说几句。你说：
= 小林，这张桌子你坐了两年，桌角还有你画的小猫。你走了，我们会想你的，常回来看看。
- 转学是一件很正常的事，每年都有很多同学转学。 ~unlinked
- 我想说的有很多，从一年级说起吧，一年级的时候…… ~rambling
% 这一句叫着小林的名字，说他坐了两年的桌子和桌角画的小猫，都是在场的人知道的事，再说“我们会想你的”。“转学是一件很正常的事”对谁都能讲，暖不了小林；从一年级讲起，太长了。 | This calls Xiao Lin by name and speaks of the desk he sat at two years and the cat drawn on its corner, things everyone there knows, then “we'll miss you”. “Changing schools is normal” could be said to anyone and warms no one; starting from first grade is far too long.

运动会上，你们班得了第一名，大家请你这个班长说几句。你说：
= 刚才最后一棒，小王摔倒了又爬起来冲过终点，大家都在喊他的名字。这个第一，是我们一起跑出来的！
- 体育运动对身体有很多好处，可以增强体质。 ~unlinked
- 那个……我也不知道说什么……反正第一名了。 ~unclear
% 这一句从“刚才最后一棒”小王摔倒又爬起来说起，大家都看见了，再说“这个第一是我们一起跑出来的”。“体育运动有很多好处”和这次第一毫无关系；“我也不知道说什么”没有讲出意思。 | This starts from the last leg just run, Xiao Wang falling and getting up, which all saw, then “we ran this first place together”. “Sport is good for you” has nothing to do with this win; “I don't know what to say” makes no point.

外婆家的晚饭桌上，全家人难得聚齐，舅舅请你说几句。你说：
= 今天一桌子菜，外婆忙了一下午。我先敬外婆一杯果汁，谢谢外婆，祝大家一年比一年好！
- 中国的饮食文化历史悠久，有八大菜系。 ~unlinked
- 我先说一下，今年我的学习情况，语文多少分，数学多少分…… ~rambling
% 这一句从眼前“一桌子菜，外婆忙了一下午”说起，敬外婆、祝大家，正合这顿团圆饭。“八大菜系”是在讲知识，和这一家人无关；汇报自己的成绩，越扯越远。 | This starts from the table full of dishes Grandma cooked all afternoon, toasts her and wishes everyone well: it fits this reunion. “Eight great cuisines” is a lecture unrelated to this family; reporting your marks wanders away.

参观完科技馆，大家在门口集合，老师请你谈谈收获。你说：
= 刚才在太空展区，我第一次知道宇航员在太空里要绑着睡觉。我想以后多读些写太空的书。
- 科学技术是第一生产力，我们要学好科学。 ~unlinked
- 我觉得都挺好的，没什么特别想说的。 ~unclear
% 这一句从刚才在“太空展区”看到宇航员绑着睡觉说起，再说出自己的打算，是这次参观才有的收获。“科学技术是第一生产力”哪里都能讲；“没什么特别想说的”什么也没说。 | This starts from the space hall just seen, astronauts strapped in to sleep, and says what you will do next: a gain from this visit. “Science is the first productive force” fits anywhere; “nothing much to say” says nothing.

你是新当选的课代表，老师请你说两句。你说：
= 谢谢大家选我。以后每天早上我会提前十分钟到，把作业收齐交给老师，也请大家帮帮我。
- 我想谈谈当今社会对人才的要求。 ~unlinked
- 嗯……我……那个……就是……我会努力的吧。 ~unclear
% 这一句先谢谢大家选自己，再说当了课代表要做的事：每天早到十分钟、收齐作业，正是刚当选时该说的话。“当今社会对人才的要求”离眼前太远；“嗯……我……那个”说不清楚。 | This thanks the class for choosing you and says what you will do: come ten minutes early, collect the work. That is what a newly chosen monitor should say. “Society's demands on talent” is far from the moment; “um… I… that” is unclear.

秋游的车上，同学们请你讲几句，让大家打起精神。你说：
= 再过二十分钟就到湖边了！听说那里的枫叶正红，咱们比比谁拍的照片最好看！
- 我给大家讲讲秋天的形成原因：地球绕太阳公转…… ~unlinked
- 我分五个方面讲讲秋游的意义，第一个方面…… ~rambling
% 这一句从大家正盼着的“再过二十分钟就到湖边”说起，说到枫叶正红、比比拍照，让车上的同学马上打起精神。讲地球公转是在上课，和车上的气氛无关；分五个方面讲秋游的意义，太长，还没开头就让人犯困。 | This starts from what everyone awaits, the lake in twenty minutes, red maples and a photo contest, and wakes the bus up at once. Earth's orbit is a lesson, out of place on the bus; five aspects of the outing are too long and send them to sleep.

小区举行邻居节，主持人请你代表小朋友说几句。你说：
= 今天楼下摆了好多桌子，王奶奶带来了饺子，李叔叔带来了西瓜。我想说：有这么多好邻居，真好！
- 我们要建设和谐社会，人人有责。 ~unlinked
- 首先感谢主持人，其次感谢各位来宾，再次感谢…… ~rambling
% 这一句从今天楼下摆的桌子、王奶奶带来的饺子、李叔叔带来的西瓜说起，都是邻居们眼前的事，再说“有这么多好邻居，真好”。“建设和谐社会”是空话；一连串“感谢”还没说到正题。 | This starts from today's tables, Granny Wang's dumplings and Uncle Li's watermelon, all before the neighbours' eyes, then “so many good neighbours, how good”. “Building a harmonious society” is empty; a string of thanks never reaches the point.
`);

/** CENTRED_7 are the scenes of speaking-7-impromptu: a short off-the-cuff speech held to one point. */
const CENTRED_7 = checked(`
班会上，老师请你用一分钟谈谈“怎样珍惜时间”。你说：
= 我觉得珍惜时间就是不拖拉。比如作业，我以前总是先玩再写，现在回家先写完，一下子多出了半小时读书的时间。所以，今天的事今天做。
- 时间很宝贵。说到时间，我想起我的手表，是爸爸送的，它是蓝色的，还能防水…… ~offtopic
- 珍惜时间，就是要珍惜时间，时间很重要，所以要珍惜，我们都要珍惜时间，不要浪费时间…… ~rambling
% 这段话只讲一个意思“不拖拉”，用自己先写作业、多出半小时读书的例子来说明，最后用“今天的事今天做”收住。听的人能用一句话说出它的意思。扯到手表的颜色、防水，离了题；“珍惜时间就是要珍惜时间”翻来覆去，什么也没说。 | This holds to one point, don't put things off, shows it by doing homework first and gaining half an hour to read, and closes with “do today's work today”. A listener can say the point in a sentence. The watch's colour and waterproofing stray off; “saving time is saving time” goes round and says nothing.

体育课后，老师请你说说今天跳远的体会。你说：
= 今天我学会了起跳前要加速。前两次我跑得慢，只跳了两米多；第三次我加速冲刺，跳到了三米。原来跑得快，才能跳得远。
- 今天天气很好，阳光很强，我中午吃的饭也很好吃。 ~offtopic
- 跳远嘛，有很多要注意的，有起跑，有起跳，有落地，还有很多，各种各样的…… ~rambling
% 这段话只讲“起跳前要加速”，用前两次和第三次跳的远近作例子，最后说“跑得快才能跳得远”。说天气和午饭，跑了题；“有起跑，有起跳，有落地，还有很多”只是一串名目，没有中心。 | This holds to one point, speed up before the take-off, shows it by the first two jumps against the third, and ends “run fast to jump far”. Weather and lunch are off the topic; “run-up, take-off, landing and more” is a list with no centre.

读书交流会上，主持人请你临时推荐一本书。你说：
= 我推荐《西游记》。孙悟空不怕困难、敢打敢拼，每次遇到妖怪都想办法解决。读了它，我遇到难题也想多试几次。
- 我推荐《西游记》。另外我还喜欢看电影，最近看了一部动画片，讲的是一只小熊…… ~offtopic
- 我推荐《西游记》，它很好看，很有意思，我很喜欢，大家都应该读，真的很好看…… ~rambling
% 这段话推荐《西游记》，只讲孙悟空不怕困难这一点，再说自己读了以后遇到难题也想多试几次。扯到动画片里的小熊，离题了；“很好看，很有意思，真的很好看”重复了几遍，说不出好在哪里。 | This recommends the book on one point, the Monkey King's courage before hardship, and how it makes you try again yourself. The cartoon bear strays off; “very good, very fun, really good” repeats itself and never says why.

学校请你在家长会上代表学生说几句。你说：
= 爸爸妈妈们，谢谢你们今天来。我们在学校每天都在长大，回家后，请多听我们说说学校的事，也多给我们一点鼓励。
- 我最近买了一双新球鞋，是白色的，穿着特别舒服。 ~offtopic
- 家长们好，我想说说我们班，我们班有四十个人，男生二十个，女生二十个，有的爱唱歌，有的爱画画，有的…… ~rambling
% 这段话只讲一个意思：请家长多听我们说说学校的事、多给我们鼓励。先谢谢家长来，最后落在这个请求上。说新球鞋跑了题；数班里多少人、谁爱唱歌，列了一大串，没有中心。 | This holds to one point: please listen to us about school and encourage us. It thanks the parents for coming and ends on that request. The new trainers are off the topic; counting the class and who likes singing is a long list with no centre.

小组活动结束，组长请你说说这次合作的收获。你说：
= 这次做手抄报，我们分了工：有人写字，有人画画，有人找资料。一个人做要三天，四个人一起一个下午就做完了。合作真能把事做好。
- 我觉得今天中午食堂的饭菜不太好吃。 ~offtopic
- 合作很重要，合作就是大家一起，一起做事，做事要合作，合作才能把事做好…… ~rambling
% 这段话只讲“合作能把事做好”，用做手抄报时分工、一个下午就做完的例子来说明。说食堂的饭菜跑了题；“合作就是大家一起，一起做事，做事要合作”绕圈子，没有例子。 | This holds to one point, working together gets things done, and shows it by the poster made in an afternoon with the work shared. The canteen food is off the topic; “cooperation is together, together is cooperation” goes in circles without an example.

班里选环保小卫士，老师请你临时说说你会做什么。你说：
= 如果我当选，我会每天放学后检查教室的灯和电扇有没有关，再提醒大家把废纸放进回收箱。
- 我家住在五楼，楼下有一个小花园，里面种着很多花。 ~offtopic
- 环保的事有很多，有节约用水，有节约用电，有垃圾分类，有少用塑料袋，还有很多很多…… ~rambling
% 老师问的是你会做什么。这段话只讲两件自己会做的事：放学后检查灯和电扇、提醒大家把废纸放进回收箱，具体又简短。说家楼下的小花园，跑了题；一口气列出所有环保的事，却没说你自己会做哪一件。 | The teacher asks what you will do. This names just two things you will do, check the lights and fans after school and remind everyone to recycle paper, concrete and short. The garden downstairs is off the topic; listing every green deed never says which you will do.

演讲比赛前，评委临时出题：“说说你最感谢的人”。你说：
= 我最感谢我的语文老师。我刚转学时说话结巴，是她每天课后陪我读课文。现在我能站在这里演讲，要谢谢她。
- 我最感谢的人有很多，有爸爸，有妈妈，有爷爷，有奶奶，有老师，有同学，还有…… ~rambling
- 我最感谢我的语文老师。说到语文，我觉得数学也很有意思，特别是几何题…… ~offtopic
% 这段话只讲一个人，语文老师，用她每天课后陪自己读课文的事来说明，最后回到“要谢谢她”。列出一长串要感谢的人，哪一个都没讲；从语文扯到数学几何题，离了题。 | This speaks of one person, the Chinese teacher, shows why by her reading with you after class each day, and returns to thanking her. A long list of people to thank says nothing of any; drifting from Chinese to geometry strays off.

毕业典礼上，老师请你说一句话送给学弟学妹。你说：
= 学弟学妹们，每天读一点书吧。六年读下来，你会发现自己比想的更了不起。
- 我想送给大家一句话。说起送礼物，我上次过生日收到了一个很大的蛋糕…… ~offtopic
- 我想说的话有很多，学习要努力，身体要锻炼，要尊敬老师，要团结同学，要爱护环境，要…… ~rambling
% 题目是“一句话送给学弟学妹”，这段话只讲一个意思：每天读一点书，再说读上六年的收获，简短有力。扯到生日蛋糕，离了题；一口气说了好多个“要……”，没有中心。 | The task is one sentence for the younger pupils. This holds to one point, read a little every day, and adds what six years of it bring: short and strong. The birthday cake strays off; a run of “you must…” has no centre.

社团招新，你临时被请上台介绍你们的书法社。你说：
= 我们书法社每周二下午活动，有老师教写字。我学了一年，字从歪歪扭扭变得端端正正。欢迎大家来试一试！
- 我们书法社……对了，我还参加了合唱队，合唱队的老师特别好…… ~offtopic
- 书法社吧，就是写字的，写字嘛，有毛笔字，有钢笔字，有各种字，写字很好，大家都来写字…… ~rambling
% 这段话只介绍书法社：什么时候活动、有老师教，再用自己一年里字从歪扭变端正的例子来说明，最后欢迎大家来。扯到合唱队，离了题；“写字嘛，有毛笔字，有钢笔字，有各种字”绕来绕去，没说清书法社。 | This introduces only the club, when it meets and who teaches, shows it by your own writing straightening in a year, and invites everyone. The choir strays off; “brush writing, pen writing, all kinds” goes round and never describes the club.

国庆节前，班会上老师请你说说你眼里的祖国。你说：
= 我眼里的祖国，是假期我坐高铁回老家时窗外飞过的田野和新楼。以前要坐一天车，现在只要三个小时。我为它的变化骄傲。
- 我国庆节要去外婆家，外婆家养了一只小狗，叫豆豆，特别可爱…… ~offtopic
- 祖国很大，祖国很美，祖国很强，祖国有很多山，有很多河，有很多城市，有很多人…… ~rambling
% 这段话只讲一个意思：为祖国的变化骄傲，用自己坐高铁回老家、从一天变成三个小时的例子来说明。说外婆家的小狗，跑了题；“祖国很大，祖国很美……”只是一串空话。 | This holds to one point, pride in how the country has changed, shown by the train home that once took a day and now takes three hours. Grandma's puppy is off the topic; “the country is big, the country is beautiful…” is a string of empty words.
`);

/** SPECS_7 are the speaking topics of grade 7, in order. */
const SPECS_7: readonly Spec[] = [
  {
    grade: 7,
    id: "speaking-7-intent",
    title: t("Hearing What Is Meant", "听出话语的意图"),
    summary: t(
      "Hearing what a speaker means beyond the words, neither stopping at the surface nor reading in too much, and answering what was meant.",
      "听出话里真正的意思，既不停留在字面，也不想得太多；再针对这个意思回应。",
    ),
    intro: t(
      "People often say what they mean without saying it outright. A father who sees you playing on your phone over your homework and says “手机比作业好看多了吧？” is not asking your opinion: he means put the phone away. Taking him at his word, “是啊，好看多了”, misses it; deciding he will never let you touch a phone again reads in too much.\n\nTo hear the intent, put the words together with the moment: who speaks, what is happening, and how it is said. The first knowledge point hears what is meant, the second answers it.",
      "人们说话，常常不把意思直接说出来。爸爸看见你一边写作业一边玩手机，说“手机比作业好看多了吧？”，并不是想听你的看法，而是说该把手机放下了。照字面答一句“是啊，好看多了”，没听懂；以为爸爸再也不让你碰手机了，又想得太多。\n\n要听出话里的意思，就要把话和当时的情形放在一起想：谁在说，正在发生什么，用什么口气说。第一个知识点听出话里的意思，第二个针对这个意思回应。",
    ),
    texts: [...ruleTexts(MEANT_7), ...ruleTexts(ANSWERED_7)],
    after: ["speaking-6-responding"],
    points: [
      [
        "meaning",
        t("What Is Really Meant", "听出言外之意"),
        t(
          "Ask why the speaker says this here and now. Put the words with what you are doing and how they are said: “你们聊得真热闹啊”, said while someone is trying to nap, is a request for quiet.\n\nYou arrive an hour late to meet a friend, and he says “你来得可真早啊”: the moment, an hour's wait, tells you he means you are very late.\n\n> **Watch out.** Do not stop at the face of the words, and do not swing to the other side: a gentle hint is not a quarrel. Read in only what the moment supports.",
          "问一问自己：他为什么在这时、这里说这句话？把话和你正在做的事、说话的口气放在一起想：有人正想午睡时说“你们聊得真热闹啊”，是请你们小声一点。\n\n比如你和朋友约好八点见面，九点才到，他说“你来得可真早啊”：他等了一个小时，这个情形告诉你，他是在说你来得太晚了。\n\n> **注意。** 不要只听字面，也不要想到另一头去：委婉的提醒不是吵架。只读出当时的情形能说明的意思。",
        ),
        ruleGenerator(
          t("What does the speaker really mean?", "说话人真正的意思是什么？"),
          MEANT_7,
          rule(
            t(
              "Put the words together with the moment: who is speaking, what you are doing, and how it is said.",
              "把这句话和当时的情形放在一起想：谁在说，你正在做什么，用什么口气说。",
            ),
            t(
              "Ask whether the meaning fits both the words and the moment, without adding anything the moment does not show: it does.",
              "想一想这个意思是不是既合乎这句话，又合乎当时的情形，没有加进情形里看不出的东西：是的。",
            ),
            {
              find: t("Step 1: put the words with the moment.", "第一步：把话和当时的情形放在一起想。"),
              choose: t("Step 2: choose what is really meant.", "第二步：选出真正的意思。"),
            },
          ),
        ),
      ],
      [
        "reply",
        t("Answering What Was Meant", "针对意图回应"),
        t(
          "Once you hear what is meant, answer that, not the words: if the hint asks you to do something, say you will do it, kindly and without making the speaker say it outright.\n\nYou are bouncing a ball outside a neighbour's door, and she says “宝宝刚睡着”: “对不起，阿姨，我到楼下去拍。”\n\n> **Watch out.** Answering the surface, “没事，我拍得很轻”, leaves the speaker to say it bluntly; and turning on them, “您是不是不让我玩？”, makes a kind hint into a quarrel.",
          "听出了真正的意思，就针对这个意思回答，而不是针对字面：如果话里是请你做一件事，就和气地答应去做，不要逼得对方把话挑明。\n\n比如你在邻居家门口拍球，阿姨说“宝宝刚睡着”，你答：“对不起，阿姨，我到楼下去拍。”\n\n> **注意。** 照字面回答“没事，我拍得很轻”，对方只好把话说破；反问“您是不是不让我玩？”，又把好意的提醒变成了吵架。",
        ),
        ruleGenerator(
          t("Which reply answers what the speaker meant?", "哪一句回应了说话人真正的意思？"),
          ANSWERED_7,
          rule(
            t(
              "Hear what is meant, then answer it kindly: agree to what is asked, or offer what is hinted at.",
              "先听出真正的意思，再和气地回应：答应对方请你做的事，或者主动做对方暗示的事。",
            ),
            t(
              "Imagine the speaker hearing your reply: they need not say anything more plainly, and no one is hurt.",
              "想象说话人听了你的回答：他不用再把话说明白，谁也没有不高兴。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "speaking-7-retelling",
    title: t("Retelling and Relaying", "复述和转述"),
    summary: t(
      "Retelling a story or a talk with its content and order kept, and relaying a message to the one it is for, with who said it and “I” and “you” turned round.",
      "复述一个故事或一段话，内容和顺序都不变；把一段话转述给要听的人，说清是谁说的，把“我”“你”换过来。",
    ),
    intro: t(
      "Retelling says again what you heard, to show you have taken it in: the people, what happened and in what order, without changing or leaving out what matters. Relaying passes a message on to someone else, so it adds who said it and turns the persons round.\n\nYour aunt on the phone: “告诉你爸爸，我明天晚上七点把书送过来。” Relayed to Father: “爸爸，姑姑说她明天晚上七点把书送过来。” The first knowledge point retells, the second relays.",
      "复述是把听到的再说一遍，表明自己听懂了：人物、发生的事和先后顺序都要说对，要紧的内容不改也不漏。转述是把一段话传给别人，所以还要说清是谁说的，并把人称换过来。\n\n比如姑姑在电话里说：“告诉你爸爸，我明天晚上七点把书送过来。”转述给爸爸：“爸爸，姑姑说她明天晚上七点把书送过来。”第一个知识点学复述，第二个学转述。",
    ),
    texts: [...ruleTexts(RETOLD_7), ...ruleTexts(RELAYED_7)],
    after: ["speaking-5-key-points"],
    points: [
      [
        "retell",
        t("Retelling Faithfully", "完整地复述"),
        t(
          "Keep the people, every main event and the ending, in the order they came; you may use your own words and drop small details, but not change what happened.\n\nA hole in the pen, a sheep lost, the neighbour's advice to mend it refused, another sheep lost the next day and the pen mended at once, and no sheep lost again: all of it, in that order.\n\n> **Watch out.** A retelling that changes the ending, starts from the end, or shrinks the story to “something happened” has not been retold.",
          "人物、每一件主要的事和结果都要说到，而且按原来的顺序；可以用自己的话，可以省去小的细节，但不能改变发生的事。\n\n比如《亡羊补牢》：羊圈破了个窟窿，丢了一只羊；邻居劝他修，他不听；第二天又丢了一只，他赶紧把羊圈修好；从此再没丢过羊。这几件事都要说，顺序不变。\n\n> **注意。** 改了结果，从结尾倒着讲，或者把故事缩成一句“发生了一件事”，都不是复述。",
        ),
        ruleGenerator(
          t("Which retells it best?", "哪一项复述得最好？"),
          RETOLD_7,
          rule(
            t(
              "List the people, the main events and the ending in order, then say them again in your own words.",
              "按顺序找出人物、主要的事和结果，再用自己的话说一遍。",
            ),
            t(
              "Set the retelling beside what was told: every main event is there, in the same order, and nothing has changed.",
              "把复述和原来讲的对一对：主要的事一件不少，顺序一样，也没有改变。",
            ),
          ),
        ),
      ],
      [
        "relay",
        t("Relaying a Message", "准确地转述"),
        t(
          "Begin with who said it; keep every point, the time, the place and what is to be done, exactly; turn “I” and “you” round for the new listener; add nothing and leave out what they do not need.\n\nThe PE teacher to you: “请你告诉王小刚，明天的篮球训练改在体育馆。” To Wang Xiaogang: “王小刚，体育老师说明天的篮球训练改在体育馆。”\n\n> **Watch out.** Adding a threat or a judgement the speaker never made, such as “老师说你上次投篮太差了”, changes the message and can hurt.",
          "先说是谁说的；时间、地点、要做的事，每一点都要准确；按新的听话人把“我”“你”换过来；不添话，也不说对方不需要的话。\n\n比如体育老师对你说：“请你告诉王小刚，明天的篮球训练改在体育馆。”你对王小刚说：“王小刚，体育老师说明天的篮球训练改在体育馆。”\n\n> **注意。** 加上说话人没有说过的威胁或评价，比如“老师说你上次投篮太差了”，就改变了原话的意思，还可能伤人。",
        ),
        ruleGenerator(
          t("Which relays the message best?", "哪一句转述得最好？"),
          RELAYED_7,
          rule(
            t(
              "Say who said it, keep every point exactly, and turn “I” and “you” round for the listener.",
              "说清是谁说的，每一点都准确，把“我”“你”按听的人换过来。",
            ),
            t(
              "Imagine being the listener: you know who sent the message and exactly what to do, and nothing was added.",
              "把自己当成听的人：知道是谁带的话，也确切知道要做什么，而且没有多出原话里没有的内容。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "speaking-7-proper",
    title: t("Fitting the Listener and Occasion", "文明得体地交流"),
    summary: t(
      "Speaking in a way that fits the listener, neither too casual nor too stiff, and fits the occasion, its mood and its rules.",
      "说话要合乎对方的身份，既不随便，也不生硬；还要合乎场合的气氛和规矩。",
    ),
    intro: t(
      "The same request is put differently to a teacher and to a friend. To the librarian: “刘老师好！我们班想请您给大家推荐几本书，不知道您什么时候方便？” To a friend: “周日一起去看展览吧！” Calling the teacher “喂” is too casual; writing to a friend like an official notice is too stiff.\n\nThe occasion matters as much: a hospital visit, a ceremony, a library, a birthday each asks for its own words and voice. The first knowledge point fits the listener, the second the occasion.",
      "同样是请别人做事，对老师和对朋友说法不一样。对图书馆的老师：“刘老师好！我们班想请您给大家推荐几本书，不知道您什么时候方便？”对朋友：“周日一起去看展览吧！”对老师喊“喂”太随便；对朋友像发通知一样说话又太生硬。\n\n场合也一样要紧：看望病人、参加仪式、在图书馆里、给人祝寿，各有各该说的话、该用的声音。第一个知识点合乎对象，第二个合乎场合。",
    ),
    texts: [...ruleTexts(LISTENER_7), ...ruleTexts(OCCASION_7)],
    after: ["speaking-5-civil-language"],
    points: [
      [
        "listener",
        t("Fitting the Listener", "合乎对象"),
        t(
          "Think who the listener is to you, older or younger, close or a stranger, and choose how to address them and how formal to be: 您 and a greeting for an elder or a stranger, plain warm words for a friend.\n\nAsking a stranger at a bus stop: “阿姨，您好！请问去博物馆坐几路车？”\n\n> **Watch out.** Fitting is not the same as formal: “恳请您告知鄙人去往博物馆须乘坐之公交线路” is polite in words but so stiff that it sounds odd. Speak as a respectful pupil, not as a notice.",
          "想一想对方和你是什么关系：比你大还是比你小，熟悉还是陌生；再决定怎样称呼、说得多正式：对长辈和陌生人用“您”，先问好；对朋友用平常亲切的话。\n\n比如在车站向陌生的阿姨打听：“阿姨，您好！请问去博物馆坐几路车？”\n\n> **注意。** 得体不等于越正式越好：“恳请您告知鄙人去往博物馆须乘坐之公交线路”字面上很客气，却生硬得让人觉得奇怪。要像一个有礼貌的学生那样说话，而不是像一份通知。",
        ),
        ruleGenerator(
          t("Which way of saying it fits the listener?", "哪一种说法合乎对方的身份？"),
          LISTENER_7,
          rule(
            t(
              "Think who the listener is to you, and choose the address and the tone that suit them.",
              "想一想对方和你是什么关系，选合适的称呼和口气。",
            ),
            t(
              "Imagine the listener hearing it: it sounds neither rude nor strange to them.",
              "想象对方听到这句话：既不觉得没礼貌，也不觉得别扭。",
            ),
          ),
        ),
      ],
      [
        "occasion",
        t("Fitting the Occasion", "合乎场合"),
        t(
          "Think what the occasion is and how people there feel: sad, solemn, quiet or joyful. Let your words and your voice suit it: comfort at a sickbed, a proper greeting at a ceremony, a low voice in a library.\n\nVisiting a classmate who has hurt his leg: “腿还疼吗？别着急，我每天放学来给你讲作业。”\n\n> **Watch out.** A joke that would be fine among friends, “这下你可以不上体育课了”, hurts at a sickbed; and words true enough, “比赛总有输有赢”, are cold to a teammate in tears after a defeat.",
          "想一想这是什么场合，在场的人心里怎样：难过、庄重、安静，还是高兴；再让你的话和声音合乎它：病床前要安慰，仪式上要正式地问好，图书馆里要小声。\n\n比如看望摔伤了腿的同学：“腿还疼吗？别着急，我每天放学来给你讲作业。”\n\n> **注意。** 在朋友之间没关系的玩笑，比如“这下你可以不上体育课了”，在病床前就会伤人；“比赛总有输有赢”这话虽然不假，对刚输了比赛、正在流泪的队友说就太冷淡了。",
        ),
        ruleGenerator(
          t("Which fits the occasion?", "哪一种说法合乎这个场合？"),
          OCCASION_7,
          rule(
            t(
              "Think what the occasion is and how the people there feel, and choose the words and the voice that suit it.",
              "想一想这是什么场合、在场的人心里怎样，选合适的话和声音。",
            ),
            t(
              "Imagine everyone present hearing it: it suits the mood, and no one is hurt or disturbed.",
              "想象在场的每个人都听到了：合乎当时的气氛，没有人被伤到或打扰。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 7,
    id: "speaking-7-impromptu",
    title: t("Speaking Off the Cuff", "即席讲话"),
    summary: t(
      "Speaking without preparation: starting from the moment and the people at hand, and holding a short talk to one point with an example.",
      "不经准备当场讲话：从眼前的场合、眼前的人和事说起，讲得简短，围绕一个意思，再举一个例子。",
    ),
    intro: t(
      "Asked to say a few words with no warning, the easiest way in is what is in front of you. At the end of a class tree-planting: “大家看，我们早上种下的二十棵小树，已经站成了整整齐齐的一行。” Then one point, here, that many hands together get a thing done, and stop.\n\nA speech about the importance of study, given beside the new trees, could be given anywhere and holds no one. The first knowledge point starts from the moment, the second keeps the talk short and on one point.",
      "没有准备、突然被请上来讲几句，最好的开口是眼前的事。比如班里植树活动结束时：“大家看，我们早上种下的二十棵小树，已经站成了整整齐齐的一行。”然后只讲一个意思，这里是“大家一起动手，就能做成一件事”，说完就停。\n\n在小树旁边讲“学习的重要性”，放在哪里讲都一样，谁也打动不了。第一个知识点从眼前说起，第二个讲得简短、围绕一个意思。",
    ),
    texts: [...ruleTexts(LINKED_7), ...ruleTexts(CENTRED_7)],
    after: ["speaking-6-short-speech"],
    points: [
      [
        "moment",
        t("Starting From the Moment", "从眼前说起"),
        t(
          "Open with something everyone present can see or has just shared, a place, a moment, a person, and draw your point from it in a sentence or two.\n\nWelcoming a new classmate: “小雨，你坐的这个位置靠着窗，一抬头就能看见操场边的大槐树。欢迎你，以后我们一起在树下玩！”\n\n> **Watch out.** A general truth, “到了新学校总会有些不习惯”, could open any speech, so it reaches no one; and announcing “first, second, third” before saying anything leaves the listeners waiting.",
          "从在场的人都看得见、刚刚一起经历过的事说起：一个地方、一个时刻、一个人；再用一两句话从中引出你要说的意思。\n\n比如欢迎新同学：“小雨，你坐的这个位置靠着窗，一抬头就能看见操场边的大槐树。欢迎你，以后我们一起在树下玩！”\n\n> **注意。** 一句放之四海而皆准的话，比如“到了新学校总会有些不习惯”，哪一次讲话都能用，所以打动不了谁；还没开讲就说“第一、第二、第三”，听的人只能干等。",
        ),
        ruleGenerator(
          t("Which is the best way to begin?", "哪一种开头最好？"),
          LINKED_7,
          rule(
            t(
              "Look around: open with what everyone present has just seen or shared, and lead from it to your point.",
              "看看眼前：从在场的人刚刚看到、一起经历的事说起，再引出你的意思。",
            ),
            t(
              "Ask whether the opening could be given anywhere else: it could not, it belongs to this moment.",
              "想一想这个开头能不能放到别的场合去讲：不能，它只属于此时此地。",
            ),
          ),
        ),
      ],
      [
        "point",
        t("One Point, Briefly", "简短，有中心"),
        t(
          "Hold the talk to one point, say it plainly, back it with one example of your own, and end by saying it again in a sentence. A minute is enough.\n\nOn keeping at it: ten minutes of skipping every day took you from a hundred skips to two hundred in a month, “所以，每天坚持一点，就会有大进步。”\n\n> **Watch out.** Sliding from the topic to whatever comes to mind, the colour of your new rope, loses the point; and saying the same thing over in other words, “坚持很重要，所以要坚持”, fills the minute with nothing.",
          "整段话只讲一个意思，明明白白地说出来，用一个自己的例子来说明，最后用一句话再点一下。一分钟就够了。\n\n比如谈坚持：每天跳绳十分钟，一个月从一百下跳到了两百下，“所以，每天坚持一点，就会有大进步。”\n\n> **注意。** 从话题滑到随便想到的事上，比如新跳绳是什么颜色，意思就丢了；换着说法把同一句话说上好几遍，比如“坚持很重要，所以要坚持”，这一分钟就什么也没说。",
        ),
        ruleGenerator(
          t("Which short talk keeps best to one point?", "哪一段即席讲话最简短、有中心？"),
          CENTRED_7,
          rule(
            t(
              "Say your one point, give one example of your own, and end by coming back to the point.",
              "说出你的一个意思，举一个自己的例子，最后回到这个意思上。",
            ),
            t(
              "Ask a listener to repeat your point in a sentence: they can, and they remember the example.",
              "请听的人用一句话说出你的意思：他说得出来，还记得那个例子。",
            ),
          ),
        ),
      ],
    ],
  },
];

/** OPENING_8 are the scenes of speaking-8-speech: an opening that names the theme and draws in these listeners. */
const OPENING_8 = checked(`
学校举行“珍惜粮食”主题演讲，台下是全校同学，大家刚在食堂吃过午饭。
= 同学们，刚才在食堂，你们的餐盘里还剩下多少饭菜？今天，我想和大家谈谈珍惜粮食。
- 水稻原产于亚洲，七千多年前，我们的祖先就开始种植水稻了…… ~noopening
- 大家好，我演讲的题目是《珍惜粮食》，下面开始。 ~dull
% 线索是大家“刚吃过午饭”，听众是“全校同学”。从每个人刚刚看过的餐盘问起，一下子就把听众拉进来，接着点明要讲珍惜粮食。从水稻的来历讲起，一开口就是细节，听众不知道要讲什么；只报一个题目，平平淡淡，抓不住人。 | The clues: everyone has just eaten lunch, and the listeners are the whole school. Asking about the trays they have just seen draws them in, and the theme follows at once. Starting from where rice came from plunges into detail with no theme; only announcing the title holds no one.

社区举行敬老节活动，你代表学生演讲，台下坐着许多老人，主题是“听爷爷奶奶讲过去”。
= 爷爷奶奶们好！我小时候最爱听奶奶讲她年轻时的故事。今天，我想说说这些故事教会了我什么。
- 哥们儿姐们儿，今天咱们随便聊聊老一辈儿的事。 ~unfit
- 今天我要讲三个问题。第一个问题分三点，我们先讲第一个问题的第一点。 ~dull
% 线索是听众是“许多老人”，场合是“敬老节”。称呼“爷爷奶奶们”合乎听众，从自己听奶奶讲故事说起，又正扣住“听爷爷奶奶讲过去”这个主题。“哥们儿姐们儿”对老人太随便，不合场合；一上来就数“第一个问题的第一点”，干巴巴的，听众提不起兴趣。 | The clues: the listeners are old people, and the occasion honours them. 爷爷奶奶们 suits them, and starting from one's own grandmother's stories meets the theme. 哥们儿姐们儿 is far too casual for them; counting off “the first point of the first question” is dry and holds no one.

运动会开幕那天，升旗仪式后你作为学生代表演讲，主题是“赛出风格”。天上正下着小雨。
= 同学们，小雨没有挡住我们的热情。今天我想说：比赛场上，名次重要，风格更重要。
- 我先说一下，我昨天没睡好，稿子也没准备好，大家凑合听吧。 ~unfit
- 我最近读了一本讲古代奥运会的书，书里说，最早的比赛只有赛跑一项…… ~noopening
% 线索是“下着小雨”和“赛出风格”的主题。从眼前的小雨说到大家的热情，再一句话点明“风格更重要”，开头既切合当时，又直奔主题。在开幕式上说自己没准备好，不合场合，也让听众失了兴致；讲古代奥运会的细节，迟迟不说主题。 | The clues: the light rain, and the theme of sportsmanship. Moving from the rain at hand to everyone's spirit, then naming the theme in one sentence, fits the moment and goes straight to the point. Saying one is unprepared does not suit an opening ceremony; the ancient Olympics delays the theme.

读书节上，你给刚入学的七年级新生演讲，主题是“我和一本书”。
= 同学们，你们有没有过一本书读到半夜还舍不得放下？我有。今天，我就讲讲我和这本书的故事。
- 读书有很多好处：第一，增长知识；第二，开阔眼界；第三，陶冶情操。 ~dull
- 我读过的书比你们多多了，你们应该好好听我讲。 ~rude
% 线索是听众是“七年级新生”，主题是“我和一本书”。用一个人人可能有过的经历来问，新生容易接上话，接着点出要讲自己和一本书的故事。罗列读书的三点好处，谁都听过，平平地说吸引不了人；在新同学面前炫耀自己读书多，不礼貌，听众会反感。 | The clues: the listeners are new pupils, and the theme is “a book and I”. A question about something most have felt lets them in, then the story is named. Listing three benefits of reading is stale; boasting to newcomers is rude and puts them off.

环保演讲比赛的主题是“少用一个塑料袋”。你手里拿着一个塑料袋走上台。
= （举起塑料袋）这个塑料袋，我们用几分钟就扔了，可它要在土里待上几百年。
- 今天天气真不错，我早上吃了两个包子，下面说说环保吧。 ~offtopic
- 塑料是一种合成材料，是用石油里提炼出来的原料一步步制成的…… ~noopening
% 线索是你手里“拿着一个塑料袋”。举起它，把“用几分钟”和“待上几百年”放在一起，一开口就让听众看见问题，也点明了主题。说天气和早饭，离开了主题；讲塑料怎样制成，是一上来就讲细节，听众不知道你要说什么。 | The clue: the bag in your hand. Holding it up and setting minutes of use against centuries in the soil shows the problem and names the theme at once. The weather and breakfast stray from the theme; how plastic is made is detail before any point.

学校为九年级学长举行送别会，你代表八年级同学演讲，主题是“谢谢你们，学长”。
= 学长学姐们，还记得吗？我们刚进校时找不到教室，是你们把我们领了进去。今天，我们想对你们说一声谢谢。
- 学长们终于要走了，以后篮球场就归我们了！ ~unfit
- “谢”字是言字旁，本来的意思是认错、道歉，后来才有了感谢的意思…… ~noopening
% 线索是“送别会”和“谢谢你们”的主题。从学长领新生进教室这件小事说起，是听众都记得的经历，再自然地说出“谢谢”。“篮球场就归我们了”在送别的场合听起来像是盼着人家走，不合场合；讲“谢”字的本义，扯到了别处，没有说出要讲什么。 | The clues: a farewell, and the theme of thanks. Starting from the seniors leading lost newcomers to class, a memory all share, the thanks follow naturally. “The court is ours now” sounds glad to see them go; the origin of the character 谢 strays before any point.

安全教育班会上，你要做一个“安全过马路”的演讲。上周三放学时，校门口刚有一辆车险些撞到一位同学。
= 同学们，上周三放学，就在校门口，一辆车差点撞上我们的同学。今天，我想和大家谈谈怎样安全过马路。
- 世界上最早的红绿灯，一百多年前出现在英国伦敦…… ~noopening
- 我要讲的是过马路，这个大家都懂，我就不多说了。 ~dull
% 线索是“上周三”“校门口”刚发生的险情。从这件大家都知道、就在身边的事说起，听众立刻会警觉，接着点明主题。讲红绿灯的历史，是从远处的细节开头，迟迟不说要讲什么；说“大家都懂，我就不多说了”，把自己的演讲说得没有必要，听众也就不想听了。 | The clue: the near miss at the gate last Wednesday. Starting from what everyone knows happened right here makes them alert, then the theme follows. The history of traffic lights opens far off in detail; “you all know this” makes the speech pointless.

科技节上，你要演讲“我心中的未来学校”，听众有同学，也有来参观的家长。
= 各位家长、同学们，请想象一下：十年以后的早上，你走进教室，课桌会跟你说“早上好”。今天，我想讲讲我心中的未来学校。
- 我家的电脑是五年前买的，花了四千多块钱，后来又换了键盘…… ~noopening
- 未来的学校，就是未来的学校，大家想想就知道了。 ~dull
% 线索是听众有“同学”也有“家长”，主题是想象中的“未来学校”。先向两种听众问好，再用一个具体的想象场面引出主题，听众马上有了画面。讲家里电脑的价钱，是一开口就讲不相干的细节；“未来的学校就是未来的学校”什么也没说，平淡无味。 | The clues: both pupils and parents listen, and the theme is an imagined school. Greeting both, then a concrete imagined scene, gives them a picture and the theme. The price of a home computer is detail with no point; a tautology says nothing.

班里举行“感恩父母”主题演讲，这一天正好是母亲节。
= 同学们，今天是母亲节。早上出门的时候，你们对妈妈说了什么吗？今天，我想和大家说说我妈妈的一双手。
- 我妈妈管我太严了，今天正好借这个机会吐吐苦水。 ~offtopic
- 父母，就是生育和养育自己的人，这个词最早见于…… ~noopening
% 线索是“母亲节”和“感恩父母”的主题。借今天这个日子问大家对妈妈说了什么，人人都会想一想，再点出要讲妈妈的一双手。借感恩的演讲吐苦水，离开了主题；给“父母”下定义、讲出处，是一开口就讲细节，听众不知道你要讲什么。 | The clues: Mother's Day and the theme of gratitude. Using the day to ask what each said to Mother sets everyone thinking, then the hands are named. Complaining strays from gratitude; defining 父母 opens in detail with no point.

你刚跑完学校的三千米长跑，台下的同学都看到你最后几百米跑得很吃力。接着，你要做主题为“坚持”的演讲。
= 刚才最后那几百米，我好几次想停下来。是什么让我跑到了终点？这就是我今天想讲的：坚持。
- “坚持”的意思是坚决保持、维护或进行，下面我分几点来讲。 ~dull
- 我跑得太丢人了，大家别看我，我随便讲两句就下去。 ~unfit
% 线索是同学们都看见了你“最后几百米跑得很吃力”。从大家刚刚亲眼看到的这一幕说起，再用一个问题引出“坚持”，开头和主题扣得很紧。照着词典解释“坚持”，干巴巴的；说“随便讲两句就下去”，不合演讲的场合，也丢掉了眼前最好的例子。 | The clue: everyone has just seen you struggle through the last few hundred metres. Starting from that sight and asking what kept you going leads straight to the theme. A dictionary definition is dry; “I'll just say a few words” does not suit the occasion and wastes the best example at hand.
`);

/** SPOKEN_8 are the scenes of speaking-8-speech: sentences made to be heard, concrete and fitted to the listeners. */
const SPOKEN_8 = checked(`
你在给五年级的小同学演讲“爱护眼睛”，要说看书时眼睛离书多远。
= 看书的时候，眼睛离书要有一尺远，差不多是从你的手肘到指尖那么长。
- 阅读时应保持眼睛与书本之间约三十三厘米的距离，以避免睫状肌长期处于紧张状态。 ~stiff
- 眼睛很重要，大家要爱护眼睛，眼睛真的非常非常重要。 ~rambling
% 线索是听众是“五年级的小同学”。“一尺”再比成“从手肘到指尖”，小同学一比划就明白，句子也短，听一遍就记得住。“睫状肌”这样的书面说法太生硬，小同学听不懂；反复说“眼睛很重要”，绕来绕去，没说出到底离多远。 | The clue: the listeners are fifth-graders. One chi, likened to elbow to fingertip, is something they can measure on their own arms, in a short sentence heard once. Words such as 睫状肌 are too stiff for them; repeating “eyes matter” never says how far.

你在全校演讲“节约用水”，想让大家觉得浪费的水很多。
= 一个没关紧的水龙头，一滴一滴地漏，一天下来，能漏掉好几桶水。
- 根据相关统计数据分析，水龙头滴漏现象所造成的水资源浪费问题不容忽视。 ~stiff
- 水，我们天天都用：喝水、洗手、洗脸、洗澡、洗菜、洗碗、拖地、浇花、冲厕所…… ~rambling
% 线索是要让“全校”的同学觉得浪费的水“很多”。“一滴一滴”到“好几桶”，用大家见过的东西说数量，听得见也想得出。长长的书面句子念出来生硬，听众记不住；把用水的地方一样样数下去，越说越散，听众抓不住要点。 | The clue: the whole school must feel how much is wasted. From drop by drop to several buckets, an amount in things everyone has seen, is easy to hear and picture. The long written sentence is stiff and forgettable; the endless list of uses rambles.

你在演讲“诚信”，想用一个例子让大家信服。
= 上个月，我在操场上捡到一个钱包，里面有三百块钱。我犹豫了一会儿，还是把它交给了老师。
- 诚信是中华民族的传统美德，是做人之本、立身之基，是社会和谐的基础。 ~dull
- 诚信嘛，就是那个……怎么说呢，反正大家都懂的。 ~unclear
% 线索是要用“一个例子”。捡钱包、犹豫、交给老师，有人、有事、有心理，是听众能想象出来的具体经历。一串大道理没有例子，平平地念，听众留不下印象；“就是那个……反正都懂”，什么也没说清楚。 | The clue: an example is wanted. Finding a wallet, hesitating and handing it in has a person, an event and a thought the listeners can picture. A string of maxims has no example and leaves nothing behind; “you know what I mean” says nothing clearly.

演讲进行到一半，你想让台下的同学跟着你一起想一想。
= 大家闭上眼睛想一想：如果明天早上醒来，世界上一本书也没有了，会是什么样子？
- 请诸位同学对上述问题进行深入的思考，并得出各自的结论。 ~stiff
- 你们想不想都行，反正我接着往下讲。 ~rude
% 线索是要让听众“跟着一起想”。“闭上眼睛想一想”是直接对听众说的话，又给了一个具体的场面，大家马上就能想起来。“诸位”“上述问题”是写在纸上的说法，听起来生硬；“想不想都行”对听众不礼貌，也就没人想了。 | The clue: the listeners are to think along. “Close your eyes and imagine” speaks to them directly and gives a concrete scene. 诸位 and 上述问题 belong on paper and sound stiff; “think or don't” is rude, so no one will.

你在演讲“亲情”，讲到最感人的地方。
= 那天，爷爷一直站在村口。直到我的车拐了弯，他还在挥手。
- 那天的情景使我产生了一种难以用语言来形容的复杂的情感体验。 ~stiff
- 爷爷站在村口，村口有一棵大树，树是爷爷小时候种的，那时候村里还没通路…… ~rambling
% 线索是讲到“最感人的地方”。两句短话，一个“站着”、一个“挥手”的画面，听众自己就会被打动。长长的抽象句子念出来生硬，听众看不到画面；从大树扯到村里修路，越说越远，感人的一刻就被冲淡了。 | The clue: the most moving moment. Two short sentences, a man standing and a hand still waving, move the listeners by themselves. The long abstract sentence is stiff and shows nothing; drifting from the tree to the village road dilutes the moment.

你给全年级同学演讲“用好课间十分钟”，想说说现在的问题。
= 现在一下课，很多同学还趴在桌上写作业，十分钟过去了，连口水都没喝。
- 课间活动时间不合理利用的现象，较为普遍地存在于我校学生群体之中。 ~stiff
- 有些同学下课也不出去，真是懒得要命，跟木头一样。 ~harsh
% 线索是听众就是“全年级同学”，要说“现在的问题”。“趴在桌上写作业”“连口水都没喝”是大家每天看得见的样子，一听就明白。长长的书面句子生硬难懂；骂同学“懒得要命”，语气太冲，听的人会不高兴，也就听不进去了。 | The clues: the listeners are the grade itself, and the problem is to be named. Pupils bent over homework, not even a sip of water, is what all of them see daily. The long written sentence is stiff; calling them lazy as logs is harsh and shuts their ears.

演讲快结束了，主题是“每天读点书”，你想让大家记住它。
= 所以，同学们，从今天起，每天读二十分钟书吧，让书陪着我们长大。
- 综上所述，阅读对于青少年的健康成长具有不可替代的重要意义。 ~stiff
- 好了，我讲完了，就这样吧。 ~dull
% 线索是要让大家“记住”主题。结尾把主题变成一件人人做得到的事，“每天二十分钟”，再用一句短短的话收住，听众带得走。“综上所述”是作文的写法，念出来生硬；“就这样吧”草草收场，什么也没留给听众。 | The clue: the theme is to be remembered. Turning it into something anyone can do, twenty minutes a day, and closing on a short line gives them something to take away. 综上所述 is essay language, stiff aloud; “that's it” leaves nothing behind.

你在社区给居民讲“垃圾分类”，听众大多是老人。
= 吃剩的饭菜、果皮，放进厨余垃圾桶；废纸、塑料瓶，放进可回收物的桶。
- 依据有关标准，生活垃圾分为可回收物、有害垃圾、厨余垃圾和其他垃圾四个大类。 ~stiff
- 这个很简单，老人家也学得会，就是你们记性不太好，得多说几遍。 ~rude
% 线索是听众“大多是老人”。从他们每天手里会有的饭菜、果皮、废纸说起，告诉他们放进哪个桶，具体又好记。照着标准念条文，生硬，老人不容易记住；说老人“记性不好”，不礼貌，听的人会不高兴。 | The clue: most listeners are old. Starting from the leftovers, peel and paper in their own hands and saying which bin each goes in is concrete and memorable. Reading out the standard is stiff; saying they forget things is rude.

你在演讲中要说明“坚持锻炼”的好处。
= 我坚持跳绳一年。以前跑八百米要五分钟，现在三分半钟就跑完了。
- 体育锻炼能够有效地促进人体各项生理机能的全面协调发展。 ~stiff
- 锻炼的好处可多了，多得说也说不完，反正就是好，特别好。 ~rambling
% 线索是要说明“好处”。用自己跳绳一年、跑八百米快了一分半这样的事实和数字来说，听众一听就信。抽象的书面句子念出来生硬，听不出到底好在哪儿；“说也说不完”“反正就是好”，绕来绕去，一个好处也没说出来。 | The clue: the benefit must be shown. One's own year of skipping and a minute and a half off the 800 metres, a fact with figures, is believed at once. The abstract sentence is stiff and names nothing; “too many to tell” names none.

开学典礼上，你代表八年级同学对七年级新生讲话。
= 刚进校的时候，我也找不到食堂在哪儿。别着急，过一个星期，你们就会觉得这里像家一样。
- 新生应当尽快适应初中阶段的学习生活，树立正确的学习目标。 ~stiff
- 你们这些小孩子什么都不懂，以后多听我们的就行了。 ~rude
% 线索是听众是刚来的“七年级新生”，你是学长。从自己当初找不到食堂说起，像朋友一样安慰他们，新生听了会放下心来。像文件一样的“应当……树立……”太生硬，不像对人说话；叫他们“小孩子什么都不懂”，不礼貌，新生会不舒服。 | The clues: the listeners are newcomers, and you are a year ahead. Starting from your own lost search for the canteen and reassuring them as a friend puts them at ease. “Newcomers shall …” is stiff, like a notice; calling them know-nothing kids is rude.
`);

/** PLAN_8 are the scenes of speaking-8-interview: the question that serves the interview's aim and suits the person asked. */
const PLAN_8 = checked(`
你要为校报采访学校食堂的厨师长，目的是了解食堂怎样保证饭菜卫生。
= 每天的菜从进食堂到端上桌，要经过哪几道检查？
- 您自己最喜欢吃什么菜？ ~offtopic
- 食堂的饭菜卫生吗？ ~closed
% 线索是采访的目的：“怎样保证饭菜卫生”。问“要经过哪几道检查”，正冲着“怎样”，厨师长要一步步讲出来。问他爱吃什么菜，离开了这次采访的目的；问“卫生吗”，他只要答“卫生”就完了，什么也问不出来。 | The clue: the aim is how hygiene is kept. Asking what checks the food passes goes at that “how”, and the chef must tell them step by step. His favourite dish strays from the aim; “is it clean?” is answered with one word.

你要采访一位种了三十年地的老农，了解节气和农活的关系。
= 您种地的时候，哪个节气该干哪些农活，能给我举个例子吗？
- 您知不知道二十四节气是哪个朝代定下来的？ ~unfit
- 您种了三十年地，累不累？ ~closed
% 线索是对象是“种了三十年地的老农”，目的是“节气和农活的关系”。请他就自己种地的经验举例子，正问到他最熟悉、又最合目的的内容。节气定于哪个朝代，是考历史的问题，不合老农的身份，也不是他的经验；“累不累”只能答一个字。 | The clues: a farmer of thirty years, and the link between solar terms and farm work. Asking for an example from his own fields draws on what he knows best and what the aim needs. Which dynasty fixed the terms is a history question that does not suit him; “is it tiring?” takes one word.

你要采访获得市作文比赛一等奖的同学，想了解她怎样积累写作材料。
= 你平时是怎样把看到、听到的事记下来，后来又用到作文里的？
- 你得了一等奖，是不是觉得自己特别了不起？ ~rude
- 你知道比赛一共有多少人参加吗？ ~offtopic
% 线索是目的是“怎样积累写作材料”。问她“怎样记下来”“又怎样用到作文里”，正好让她讲出自己的做法。“是不是觉得自己特别了不起”带着讥讽，不礼貌；问参赛人数，和积累材料没有关系。 | The clue: the aim is how she gathers material. Asking how she notes things down and later uses them lets her tell her method. “Do you think you're something special?” sneers and is rude; the number of entrants has nothing to do with gathering material.

你要采访一位消防员，了解他们怎样做到随时出警。
= 警铃一响，从听到铃声到消防车开出大门，你们要做哪些事？
- 当消防员是不是很危险？ ~closed
- 你们一个月能拿多少工资？ ~rude
% 线索是目的是“怎样做到随时出警”。从“警铃一响”问到“车开出大门”，请他讲中间的每一步，正是目的要的内容。“是不是很危险”只能答是或不是；第一次见面就问人家的工资，不礼貌，也和出警无关。 | The clue: the aim is how they stay ready. Asking what happens between the alarm and the engine leaving the gate draws out each step. “Is it dangerous?” takes yes or no; asking a stranger's pay is rude and beside the point.

你要采访小区里开了二十年早点铺的阿姨，了解小区这些年的变化。
= 这二十年里，来吃早点的人和小区的样子，有哪些变化让您印象最深？
- 您家的油条是怎么炸的？能把做法告诉我吗？ ~offtopic
- 这些年小区变化大吗？ ~closed
% 线索是对象“开了二十年早点铺”，目的是“小区的变化”。从她每天看到的“来吃早点的人”问起，正是她最清楚的变化，又要她说出“印象最深”的具体事。问油条的做法，离开了目的；“变化大吗”只能答大或不大。 | The clues: twenty years at her stall, and the aim of the estate's changes. Asking about the customers she sees each morning draws on what she knows best and asks for what struck her most. Her fritter recipe strays from the aim; “has it changed much?” takes one word.

你要采访学校的图书管理员，为“读书节”写一篇报道，想了解同学们借书的情况。
= 这学期同学们借得最多的是哪几类书？和去年比有什么不同？
- 您每天几点上班，几点下班？ ~offtopic
- 同学们爱不爱借书？ ~closed
% 线索是目的是“同学们借书的情况”。问“借得最多的是哪几类”“和去年比有什么不同”，管理员要说出具体的类别和变化，报道就有了材料。上下班时间和借书情况无关；“爱不爱借书”答一个“爱”字就完了。 | The clue: the aim is what pupils borrow. Asking which kinds go out most and how this compares with last year draws out kinds and change, material for the report. Working hours are beside it; “do they like borrowing?” takes one word.

你要采访一位退休的老教师，了解他刚教书时学校是什么样子。
= 您第一次走进教室的时候，教室里是什么样的？学生们用什么上课？
- 老师，您今年多大岁数了？身体还能撑几年？ ~rude
- 您以前教书的学校好不好？ ~closed
% 线索是目的是“刚教书时学校是什么样子”。问“第一次走进教室”看到了什么、学生用什么上课，老教师会回忆出具体的情景。“身体还能撑几年”对老人很不礼貌；“好不好”只能答好或不好，问不出样子来。 | The clue: the aim is what the school was like when he began. Asking what he saw the first time he walked into class and what the pupils used calls up a concrete scene. “How many years have you left?” is very rude to an old man; “was it good?” takes one word.

你要访谈刚从外地转来的同学，了解他适应新学校的情况。他看上去有点拘谨。
= 来这里快一个月了，有没有哪件事让你觉得和原来的学校不一样？
- 你为什么转学？是不是在原来的学校犯了错？ ~rude
- 你在这里习惯了吗？ ~closed
% 线索是对方“有点拘谨”，目的是“适应新学校的情况”。从“哪件事不一样”这样轻松具体的问题问起，他容易打开话匣子，也正说到适应的情况。追问“是不是犯了错”，既不礼貌，又会让拘谨的他更紧张；“习惯了吗”只能答是或不是。 | The clues: he seems shy, and the aim is how he is settling in. A light, concrete question about what feels different lets him open up and goes to the aim. Asking whether he did something wrong is rude and makes him tenser; “are you used to it?” takes one word.

你要采访一位剪纸艺人，了解她是怎样学会剪纸的。
= 您刚开始学剪纸的时候，师傅是怎样教的？最难学的是哪一步？
- 您的剪纸一张能卖多少钱？ ~offtopic
- 剪纸难不难学？ ~closed
% 线索是目的是“怎样学会剪纸”。问师傅“怎样教”、哪一步“最难学”，她要讲出学艺的过程和难处。卖多少钱和学剪纸的过程无关；“难不难”只能答难或不难，问不出过程。 | The clue: the aim is how she learned. Asking how her teacher taught her and which step was hardest draws out the path and its difficulty. Prices are beside the point; “is it hard?” takes one word.

你要采访校篮球队的教练，了解球队怎样准备下个月的比赛。教练只给了你十分钟。
= 离比赛还有两周，这两周的训练主要练什么？为什么练这个？
- 您能从小时候讲起，说说您整个打篮球的经历吗？ ~offtopic
- 你们这次能赢吗？ ~closed
% 线索是目的是“怎样准备比赛”，时间“只有十分钟”。问这两周“练什么”“为什么”，直奔目的，十分钟里就能问清。请他从小时候讲起，离开了这次的目的，十分钟也讲不完；“能赢吗”只能答能或不能。 | The clues: the aim is the preparation, and there are only ten minutes. Asking what the next two weeks train and why goes straight to it and fits the time. His whole life in basketball strays from the aim and would never fit; “will you win?” takes one word.
`);

/** RECORD_8 are the scenes of speaking-8-interview: the note that keeps what the interviewee said, nothing added or turned round. */
const RECORD_8 = checked(`
食堂的厨师长说：“菜进来先挑掉烂叶子，再泡一泡，然后洗三遍。每天的饭菜还要留一份样品，放进冰箱存两天。”
= 菜要先挑、再泡、洗三遍；每天的饭菜都留样，在冰箱里存放两天。
- 厨师长说，我们食堂的菜是全市最干净的。 ~added
- 厨师长说，菜要洗三遍。 ~trivial
% 线索是厨师长说了两件事：洗菜的三个步骤，和“留一份样品”“存两天”。对的记录两件都记下了，顺序和数字都没错。他没有说过“全市最干净”，这是加进去的；只记“洗三遍”，丢了挑、泡和留样，抓住的是一个细节。 | The clue: he named two things, the three steps of washing and the sample kept two days. The right note keeps both, with the order and numbers right. He never said “cleanest in the city”; “washed three times” alone drops the picking, the soaking and the sample.

种地的老农说：“清明前后，种瓜点豆。我们这儿冷得晚，要过了清明才敢下种，早了怕冻坏。”
= 当地天冷得晚，要过了清明才下种，太早了怕种子冻坏。
- 老农说，清明节要去扫墓。 ~added
- 老农说，清明以前一定要把种子种下去。 ~misgrasp
% 线索是“过了清明才敢下种”和“早了怕冻坏”。对的记录写出了时间，也写出了原因。老农一句也没提扫墓，是加进去的；“清明以前一定要种下”，正好把“过了清明”说反了。 | The clues: sowing only after Qingming, and the fear of frost if earlier. The right note keeps the time and the reason. He never mentioned sweeping graves; “sow before Qingming” turns “after” round.

获奖的同学说：“我有一个小本子，看到有意思的事就记两句。写作文的时候翻一翻，常常就找到了材料。”
= 她用小本子随手记下有意思的事，写作文时从里面找材料。
- 她每天都写一篇日记，已经坚持了三年。 ~added
- 她说写好作文主要靠多读范文。 ~misgrasp
% 线索是“小本子”“记两句”“翻一翻”“找到了材料”。对的记录把这几点都概括进去了。她说的是随手记两句，不是每天写日记，“坚持了三年”更是加上去的；她也没说靠读范文，这是把她的意思理解错了。 | The clues: a small notebook, a line or two, leafing through, finding material. The right note sums these up. She spoke of jotting a line, not of a daily diary for three years; she said nothing of model essays, which misreads her.

消防员说：“铃一响，一分钟之内要穿好衣服、登上车。衣服和靴子都按顺序摆好，一套就能穿上。”
= 警铃响后，一分钟内要穿好装备上车；装备事先按顺序摆好，好快速穿上。
- 消防员说，他们一分钟就能把火扑灭。 ~misgrasp
- 消防员说，他们的靴子是放在衣服旁边的。 ~trivial
% 线索是“一分钟之内”是“穿好衣服、登上车”的时间，“按顺序摆好”是为了“一套就能穿上”。对的记录把这两层都记对了。把一分钟说成扑灭火的时间，理解错了；只记靴子放在哪儿，丢了要点。 | The clues: one minute is for dressing and boarding, and the order of the kit is for putting it on at once. The right note keeps both. Making the minute the time to put out a fire misreads him; where the boots stand drops the point.

开早点铺的阿姨说：“以前来吃早点的，都是附近厂里的工人。现在厂子搬走了，来的多是送孩子上学的家长。”
= 来吃早点的人，从过去附近工厂的工人，变成了现在送孩子上学的家长。
- 阿姨说，现在的生意比以前差多了。 ~added
- 阿姨说，厂里的工人现在都去送孩子上学了。 ~misgrasp
% 线索是“以前……工人”“现在……家长”和“厂子搬走了”。对的记录写出了顾客从谁变成了谁。阿姨没说生意好坏，“差多了”是加的；她说的是顾客换了一批人，不是工人改去送孩子，这是理解错了。 | The clues: workers then, parents now, and the factory gone. The right note says who the customers were and who they are. She said nothing of trade getting worse; she meant other people come, not that the workers now do the school run.

图书管理员说：“这学期借得最多的是科普书，比去年多了一倍；小说还是很受欢迎，不过漫画借得少了。”
= 这学期科普书借得最多，比去年多了一倍；小说仍然受欢迎，漫画借得少了。
- 管理员说，同学们已经不看小说了。 ~misgrasp
- 管理员说，学校应该多买一些科普书。 ~added
% 线索是三类书各有一句：科普书“最多”“多了一倍”，小说“还是很受欢迎”，漫画“少了”。对的记录三类都记对了。说同学们不看小说，正和“还是很受欢迎”相反；“应该多买科普书”是管理员没说过的建议。 | The clues: a sentence for each of three kinds. The right note keeps all three. “No one reads novels now” contradicts “still popular”; “the school should buy more” is advice she never gave.

退休的老教师说：“那时候一间教室坐六十多个学生。冬天没有暖气，大家轮流往炉子里添煤。”
= 当时一间教室有六十多个学生；冬天没有暖气，学生们轮流给炉子添煤取暖。
- 老教师说，那时候的学生比现在的学生更爱学习。 ~added
- 老教师说，那时候教室里有暖气，也有炉子。 ~misgrasp
% 线索是“六十多个学生”“没有暖气”“轮流往炉子里添煤”。对的记录数字和情况都没错。老教师没有比较过学生爱不爱学习，这是加的；他明明说“没有暖气”，记成“有暖气”就理解错了。 | The clues: over sixty pupils, no heating, coal added by turns. The right note keeps the number and the facts. He compared no one's love of study; he said there was no heating, so “there was heating” misreads him.

转来的同学说：“这里的同学说话快，我一开始常常听不清。不过同桌很热心，下课总给我讲笔记。”
= 他起初常听不清同学们说话，但同桌很热心，下课常给他讲笔记。
- 他说这里的同学都不愿意理他。 ~misgrasp
- 他说他很想回原来的学校。 ~added
% 线索是“听不清”是开始的难处，“不过同桌很热心”是转折后的好事。对的记录把一难一好都记下了。他说同桌热心，记成“都不愿意理他”，正好理解反了；他一句也没说想回去，是加进去的。 | The clues: trouble hearing at first, then “but” the kind deskmate. The right note keeps both. “No one will talk to him” turns his words round; he never said he wanted to go back.

剪纸艺人说：“我十二岁跟着奶奶学。先剪最简单的窗花，光是剪圆，就练了一个月。”
= 她十二岁跟奶奶学剪纸，从简单的窗花剪起，光剪圆就练了一个月。
- 她说剪纸是她家祖传的手艺，已经传了五代。 ~added
- 她说只要练一个月，就能学会剪纸。 ~misgrasp
% 线索是“十二岁”“跟着奶奶”“先剪窗花”“剪圆练了一个月”。对的记录这几点都在。她没说传了几代，“五代”是加的；“练了一个月”说的只是剪圆，说成一个月就能学会剪纸，是理解错了。 | The clues: age twelve, her grandmother, window flowers first, a month on circles alone. The right note keeps them all. Five generations is added; the month was for circles only, so “a month to learn paper-cutting” misreads her.

篮球队教练说：“这两周主要练防守。上次比赛我们就输在防守上，对方连着投进了好几个三分球。”
= 这两周主要练防守，因为上次比赛输在了防守上。
- 教练说，这次比赛我们一定能赢。 ~added
- 教练说，这两周主要练三分球投篮。 ~misgrasp
% 线索是“主要练防守”和“输在防守上”，三分球是对方投进的。对的记录写出了练什么和为什么。教练没有说一定能赢，这是加的；三分球是对方投的，说成主要练投三分，把意思弄错了。 | The clues: defence is the training, because defence lost the last game; the three-pointers were the other side's. The right note keeps what and why. “We will surely win” is added; making the drill three-point shooting misreads whose shots they were.
`);

/** FOCUS_8 are the scenes of speaking-8-discussion-focus: the point on which the speakers really differ. */
const FOCUS_8 = checked(`
班会讨论春游去哪里。小林说：“去科技馆，能学到东西。”小王说：“科技馆也不错，可春游就该到户外去，去森林公园吧。”小李说：“我也想去户外。”
= 春游是去室内学东西，还是到户外去活动。
- 森林公园离学校有多远。 ~trivial
- 科技馆里有哪些展品。 ~offtopic
% 线索是小王的“可春游就该到户外去”，小李又说“也想去户外”。大家争的是室内还是户外，这就是焦点。路远不远是次要的细节，谁也没争；科技馆有哪些展品，离开了讨论的话题。 | The clues: Xiao Wang's “but a spring outing should be outdoors”, and Xiao Li joining him. They differ on indoors or out: that is the focus. The distance is a minor detail no one argues; the exhibits stray from the topic.

小组讨论“中学生该不该带手机进校园”。甲说：“带手机方便和家里联系。”乙说：“可上课的时候总有人偷偷玩。”丙说：“那就规定上课时交给老师保管。”
= 带手机进校园，方便联系和影响学习怎样兼顾。
- 手机是哪一年发明的。 ~offtopic
- 大家都认为不应该带手机进校园。 ~misgrasp
% 线索是甲说“方便联系”，乙用“可”说出“偷偷玩”，丙想的是两边兼顾的办法。焦点是怎样既能联系、又不影响学习。手机的发明和讨论无关；甲明明赞成带手机，说“大家都认为不应该”是把大家的意思弄错了。 | The clues: A says it helps contact, B's “but” raises playing in class, and C seeks a middle way. The focus is keeping contact without harming study. The phone's invention is beside it; A is for phones, so “all are against” misreads them.

讨论班级图书角怎样借书。甲说：“每人每周只能借一本。”乙说：“一本太少了，读得快的同学不够看。”丙说：“可借多了，别人就没得借了。”
= 每人一次能借几本书。
- 图书角放在教室的哪个角落。 ~offtopic
- 大家都同意每周只借一本。 ~misgrasp
% 线索是甲说“一本”，乙说“一本太少”，丙又说“借多了别人没得借”，三个人说的都是借几本。图书角放在哪儿，没有人提；乙明明反对只借一本，说“大家都同意”就理解错了。 | The clues: one book, too few, too many and others go without: all are about how many. Where the corner stands no one raised; B opposes one book, so “all agree” misreads them.

讨论运动会的班级口号。甲说：“口号要响亮好记。”乙说：“我觉得要有我们班的特色。”丙说：“有特色也得好记啊，太长了大家喊不齐。”
= 口号是要突出班级特色，还是要简短好记，怎样兼顾。
- 运动会在哪一天开幕。 ~offtopic
- 口号要不要用成语。 ~trivial
% 线索是甲要“好记”，乙要“特色”，丙说“有特色也得好记”，两种要求碰到了一起，这就是焦点。开幕日期离开了话题；用不用成语，谁也没说，是个小细节。 | The clues: A wants it memorable, B wants it distinctive, and C says it must be both: the two demands meet there. The date strays from the topic; idioms are a small detail no one raised.

讨论小组作业怎样分工。甲说：“按各人的特长来分，谁字好谁抄写，谁会画谁画图。”乙说：“那每次都是字好的抄，别人就一直得不到锻炼了。”
= 分工是按各人的特长，还是让每个人都得到锻炼。
- 小组里谁的字写得最好。 ~trivial
- 这次的小组作业要不要做。 ~misgrasp
% 线索是甲主张“按特长”，乙担心“别人得不到锻炼”。两人分歧在分工的原则上。谁的字最好只是一个小细节；两人都在商量怎样分工，没有人说不做，说成“要不要做”是理解错了。 | The clues: A wants strengths to decide, B fears the rest never learn. They differ on the principle. Whose writing is best is a detail; both plan how to share the work, so “whether to do it” misreads them.

讨论课间要不要开放篮球场。甲说：“十分钟太短，打一会儿就满头大汗地回去上课。”乙说：“可是大家坐了一节课，需要活动一下。”
= 课间打篮球，是能活动身体，还是会影响下一节课。
- 篮球场的地面是不是太滑。 ~offtopic
- 乙同学喜不喜欢打篮球。 ~trivial
% 线索是甲说会“满头大汗地回去上课”，乙说“需要活动一下”，一个说坏处，一个说好处，焦点就在这里。地面滑不滑，没有人说到；乙喜不喜欢打篮球，和他的理由无关，只是个小问题。 | The clues: A says they come back sweating, B says they need to move: the harm against the good is the focus. The surface no one mentioned; whether B likes basketball is a small question beside his reason.

讨论毕业纪念册做成什么样。甲说：“做电子版，省钱，还能放视频。”乙说：“纸质的能拿在手里，过多少年都能翻。”
= 纪念册做电子版好，还是做纸质版好。
- 纪念册上放谁的照片。 ~offtopic
- 视频要拍多长时间。 ~trivial
% 线索是甲说“电子版”，乙说“纸质的”，各说各的好处。焦点是做哪一种。放谁的照片，两人都没提；视频拍多长，是在电子版里才有的小细节，不是两人的分歧。 | The clues: A argues for digital, B for paper, each with its merits. The focus is which. Whose photos go in neither raised; the video's length is a detail inside one side, not the difference.

讨论班里要不要设“无作业日”。甲说：“每周有一天不留作业，大家能多读点书。”乙说：“那天落下的练习谁来补？”丙说：“那天可以留阅读任务。”
= 设“无作业日”会不会耽误练习，那一天又该怎样安排。
- 哪位老师留的作业最多。 ~offtopic
- 大家都不想写作业。 ~misgrasp
% 线索是甲说能“多读点书”，乙问“落下的练习谁来补”，丙想怎样“安排”那一天。焦点是会不会耽误练习、怎样安排。哪位老师作业多，离开了话题；甲是为了多读书，不是不想写作业，说“都不想写”是理解错了。 | The clues: A wants time to read, B asks who makes up the practice, C plans the day. The focus is the practice lost and how the day is spent. Which teacher sets most strays; A wants to read, not to dodge work.

讨论班级值日怎样排。甲说：“按学号轮流最公平。”乙说：“可有的同学住得远，早上值日来不及。”
= 值日是按学号轮流，还是照顾住得远的同学。
- 值日要打扫哪些地方。 ~offtopic
- 乙同学不想值日。 ~misgrasp
% 线索是甲讲“公平”，乙讲“住得远……来不及”。分歧在于排值日时要不要照顾住得远的同学。扫哪些地方，没有人争；乙说的是有人来不及，不是自己不想值日，这是把他的意思理解错了。 | The clues: A speaks of fairness, B of those living far who cannot come early. They differ on whether to allow for distance. What is swept no one disputes; B speaks of others' trouble, not of shirking.

讨论读书会读哪本书。甲说：“读《西游记》吧，故事有意思。”乙说：“我们小学就看过动画片了，换一本没读过的吧。”
= 是选大家熟悉、有趣的书，还是选大家没读过的书。
- 《西游记》的作者是谁。 ~offtopic
- 动画片拍得好不好。 ~trivial
% 线索是甲看重“有意思”，乙看重“没读过”。焦点是选书看重哪一样。作者是谁，与选书的分歧无关；动画片拍得好不好，只是乙话里顺带提到的小事。 | The clues: A values an interesting story, B a book not read before. The focus is which matters more. The author has nothing to do with the difference; the cartoon's quality is a side remark in B's words.
`);

/** KEEP_8 are the scenes of speaking-8-discussion-focus: a remark that keeps to the focus, gives its reason and moves the talk on. */
const KEEP_8 = checked(`
讨论的焦点是：春游去室内学东西，还是到户外去活动。你想发言。
= 我赞成去户外。我们平时总坐在教室里，春游正好去走走；在森林公园里观察植物，也一样能学到东西。
- 说到户外，我上个月去爬山，山上有一块石头，长得像一只猴子…… ~offtopic
- 想去科技馆的人，都是书呆子。 ~attack
% 线索是焦点在“室内还是户外”，又有人看重“能学东西”。对的发言先表明赞成户外，说出理由，还回应了“学东西”这一点，讨论就往前走了。讲爬山看到的石头，离开了焦点；说别人是“书呆子”，针对的是人，不是观点。 | The clues: the focus is indoors or out, and some value learning. The right remark takes a side, gives a reason and answers the point about learning. The monkey-shaped rock strays; calling others bookworms goes at the people.

讨论的焦点是：每人一次能借几本书。甲主张一本，乙嫌太少。
= 能不能每人一次借两本，但一周之内必须还？这样读得快的同学够看，书也转得开。
- 我觉得图书角的书架颜色不好看，应该换一个。 ~offtopic
- 反正就借一本，别争了，我说了算。 ~pushy
% 线索是甲说一本、乙嫌少，又有人担心“别人没得借”。对的发言提出“两本、一周内还”，同时照顾了两边的担心，正扣住焦点。书架颜色离开了话题；“我说了算”只坚持自己的想法，不和别人商量。 | The clues: one book against too few, and the worry that others go without. Two books returned within a week meets both worries on the focus. The shelf's colour strays; “I decide” only insists.

讨论的焦点是：带手机进校园，方便联系和影响学习怎样兼顾。
= 可以带，但进校门就交给班主任统一保管，放学再领回去。这样能和家里联系，上课也不会分心。
- 我觉得手机很重要，就该带。 ~noreason
- 你们这些反对的人，自己在家玩得最多。 ~attack
% 线索是焦点里有两头：“方便联系”和“影响学习”。对的发言给出具体办法，并说明它怎样同时照顾这两头。只说“手机很重要”，没说为什么，也没回应影响学习的担心；说反对的人自己玩得多，是攻击人，不是讨论观点。 | The clues: the focus has two ends, contact and study. The right remark offers a way and says how it serves both. “Phones matter” gives no reason and ignores the worry; saying opponents play most attacks people, not views.

讨论的焦点是：班级口号要突出特色，还是简短好记。
= 我们班叫“飞鹰班”，口号就用“飞鹰飞鹰，展翅高飞”，八个字好记，又有我们班的特色。
- 我同意乙的看法。 ~noreason
- 口号喊什么都行，我们还是先说说运动会带什么零食吧。 ~offtopic
% 线索是焦点要兼顾“特色”和“好记”。对的发言拿出一句具体的口号，并说明它八个字好记、又带着班名的特色。只说“同意乙”，没有理由，讨论也没往前走；说零食，离开了焦点。 | The clues: the focus asks for both distinction and memory. The right remark offers an actual slogan and shows it does both. “I agree with B” gives no reason and moves nothing; snacks stray from the focus.

讨论的焦点是：小组分工按各人的特长，还是让每个人都得到锻炼。
= 可以两样结合：每次让擅长的同学负责一部分，再配一个不太擅长的跟着学，下一次轮换。
- 不管怎么分，反正我只负责画图。 ~pushy
- 你的字那么难看，当然不能让你抄。 ~attack
% 线索是焦点里一边是“特长”，一边是“锻炼”。对的发言提出把两样结合起来的具体做法，照顾了双方。“反正我只负责画图”只顾自己，不和大家商量；说别人字难看，是针对人，还会伤人。 | The clues: strengths on one side, practice on the other. The right remark joins them in a concrete way. “I only draw” insists on oneself; mocking someone's writing goes at the person.

讨论的焦点是：课间打篮球会不会影响下一节课。乙刚说了“大家需要活动一下”。
= 乙说得对，课间是该活动。不过可以只练五分钟投篮，不打全场，就不会满头大汗地进教室了。
- 乙的意见不对，不用考虑。 ~dismiss
- 我觉得打篮球没有踢足球好玩。 ~offtopic
% 线索是乙刚说了“需要活动一下”，甲担心“满头大汗”。对的发言先回应乙，再针对甲的担心提出办法，正围着焦点。说乙“不对，不用考虑”，却不说为什么，是不听别人的意见；比较篮球和足球，离开了焦点。 | The clues: B has just said they need to move, and A fears sweating. The right remark answers B, then meets A's worry with a plan. Dismissing B without a word of why ignores his view; football against basketball strays.

讨论的焦点是：毕业纪念册做电子版好，还是纸质版好。
= 纸质的留得久，电子版能放视频，可以印一本薄一点的纸质册，再附一个二维码，一扫就能看视频。
- 我就要纸质的，别的我不听。 ~pushy
- 电子版就是好，因为我喜欢电子版。 ~weak
% 线索是两种做法各有好处：纸质“留得久”，电子版“能放视频”。对的发言把两种好处合在了一起，提出具体做法。“别的我不听”只坚持自己；“因为我喜欢”算不上理由，和哪种更好没有关系。 | The clues: each has its merit, lasting paper and video. The right remark joins both in one plan. “I won't hear anything else” only insists; “because I like it” is no reason for which is better.

讨论的焦点是：设“无作业日”会不会耽误练习，那天该怎样安排。
= 可以把“无作业日”定在周五。这一周的练习前几天都做过了，周末再留一点复习，就不会落下。
- 作业太多了，老师们都太狠心了。 ~attack
- 我昨天的数学作业一直写到晚上十点。 ~offtopic
% 线索是焦点在“会不会耽误练习”和“怎样安排”。对的发言定了哪一天，又说明练习怎样不落下，两点都答到了。说老师“狠心”，针对的是人；讲自己昨天写到几点，没有回答怎样安排，离开了焦点。 | The clues: whether practice is lost, and how the day is used. The right remark names the day and says how practice is kept. Calling teachers heartless goes at people; one's late night answers neither point.

讨论的焦点是：值日按学号轮流，还是照顾住得远的同学。
= 住得远的同学可以排在放学后值日，住得近的排在早上，这样人人都轮得到，路远的同学也来得及。
- 我家住得近，所以怎么排我都无所谓。 ~weak
- 甲的办法不行，别再说了。 ~dismiss
% 线索是一边要“公平”，一边要照顾“住得远”。对的发言提出早上、放学后分开排，人人轮到，又照顾了路远的同学。“我家住得近”和怎样排得好没有关系，算不上理由；“别再说了”是不回应甲的意见。 | The clues: fairness on one side, distance on the other. Splitting mornings and afternoons keeps everyone's turn and helps those far away. One's own short walk is no reason; “say no more” brushes A aside.

讨论的焦点是：读书会选大家熟悉、有趣的书，还是选大家没读过的书。
= 可以读《西游记》的原著。动画片只讲了几个故事，原著里很多章节大家都没读过，又不会觉得陌生。
- 我最喜欢的书是一本魔法小说，它讲的是一个魔法学校的故事…… ~offtopic
- 选哪本都一样，随便吧。 ~noreason
% 线索是一边看重“有意思”，一边看重“没读过”。对的发言指出原著既有趣，又有大家没读过的章节，正好两边都照顾到。讲自己喜欢的魔法小说，离开了焦点；“随便吧”没有态度也没有理由，讨论没往前走。 | The clues: interest on one side, newness on the other. The unabridged novel is both interesting and largely unread. One's favourite magic novel strays; “whatever” gives no view and no reason.
`);

/** REASON_8 are the scenes of speaking-8-persuading: the reason that touches what the listener cares about. */
const REASON_8 = checked(`
爷爷每天抽烟，你想劝他少抽一点。爷爷最疼小孙女，天天抱着她。
= 爷爷，妹妹天天让您抱着，烟味对她的身体不好。您少抽点，她才能健健康康的。
- 爷爷，抽烟会把牙齿熏黄，不好看。 ~unmoved
- 爷爷，您再抽烟，我就不理您了。 ~harsh
% 线索是爷爷“最疼小孙女，天天抱着她”。从他最在意的小孙女说起，他为了孙女也会愿意少抽。牙齿黄不黄，爷爷未必在乎，打动不了他；“不理您了”是赌气威胁，语气太冲，爷爷听了会不高兴。 | The clue: he dotes on his granddaughter and holds her every day. Speaking of her touches what he cares for most. Yellow teeth may not matter to him; “I won't speak to you” is a sulky threat.

同桌常常熬夜打游戏，第二天上课打瞌睡。他最想进校篮球队。
= 篮球队选人要看体能，你天天熬夜，跑两圈就喘，怎么选得上？早点睡吧。
- 熬夜打游戏的人，以后都没出息。 ~harsh
- 熬夜会让家里多交电费。 ~weak
% 线索是他“最想进校篮球队”。把熬夜和他最想要的事连起来，他才会听得进去。“都没出息”语气太冲，会伤人；电费和他熬夜打瞌睡的事关系不大，算不上有力的理由。 | The clue: he wants a place on the team above all. Linking late nights to that is what he will hear. “Such people come to nothing” is harsh; the electricity bill is hardly the point.

妈妈舍不得倒掉冰箱里放了好几天的剩菜。她最关心全家人的身体。
= 妈妈，剩菜放久了会变质，吃了容易拉肚子。您总说身体最要紧，这些就别吃了吧。
- 妈妈，剩菜看上去太难看了。 ~unmoved
- 剩菜都舍不得倒，您也太小气了。 ~rude
% 线索是妈妈“最关心全家人的身体”。说剩菜会让人拉肚子，又用上她自己常说的“身体最要紧”，正说到她心上。好不好看，节省的妈妈不在乎；说妈妈“小气”，对长辈不礼貌。 | The clue: she cares most about the family's health. Spoiled food and an upset stomach, in her own words about health, reach her. Looks do not move a thrifty mother; calling her stingy is rude to a parent.

弟弟晚上不愿意刷牙。他最怕去医院打针。
= 不刷牙会长蛀牙，长了蛀牙就得去医院补牙，可疼了。还是刷吧。
- 刷牙是国家规定的，必须刷。 ~weak
- 不刷牙你就是个臭小孩。 ~harsh
% 线索是弟弟“最怕去医院”。从不刷牙到蛀牙、再到去医院，一步步说到他最怕的事，他就愿意刷了。国家并没有这样的规定，这个理由站不住；骂他“臭小孩”，语气太冲，弟弟只会更不想刷。 | The clue: he dreads the hospital. Step by step from no brushing to decay to the dentist reaches his fear. No law requires brushing, so the reason fails; calling him smelly only makes him dig in.

邻居阿姨常把电动车推进楼道里充电。她家孩子就住在楼上的房间里。
= 阿姨，楼道里充电万一起火，烟会往楼上走，孩子们都在楼上，太危险了。
- 阿姨，电动车放在楼道里，挡着我拿快递了。 ~unmoved
- 阿姨，您这样做太没素质了。 ~attack
% 线索是阿姨家“孩子就住在楼上”。说起火时烟往楼上走，危及她的孩子，她最能听进去。挡着你拿快递，是你自己的不方便，打动不了她；说她“没素质”，是针对人，她只会生气。 | The clue: her child sleeps upstairs. Smoke rising to the children is what she will hear. Your parcel is your own trouble and will not move her; calling her uncivil attacks her.

好朋友想抄你的作业。他下星期就要期中考试了。
= 抄了作业，这些题你还是不会，期中考试的时候可没人给你抄。我给你讲讲吧？
- 抄作业被老师发现了，我也要挨批评。 ~unmoved
- 自己不会做，还好意思抄？ ~harsh
% 线索是他“下星期就要期中考试”。抄了作业到考试还是不会，这和他自己的成绩直接相关，再主动帮他讲，他容易接受。你挨不挨批评是你的事，打动不了他；“还好意思”语气太冲，朋友会难堪。 | The clue: his exam is next week. Copying leaves him unable to do it in the exam, which touches him directly, and the offer to explain helps. Your own scolding will not move him; “have you no shame?” is harsh.

爸爸开车时常常低头看手机。他最在意家里人的安全。
= 爸爸，开车时看一眼手机，车就开出去好几十米，我们一家人都坐在车上呢。
- 爸爸，手机屏幕那么亮，看多了伤眼睛。 ~weak
- 您再这样开车，我就再也不坐您的车了。 ~harsh
% 线索是爸爸“最在意家里人的安全”。说一低头车就开出好几十米，而全家人都在车上，正说到他最在意的事。屏幕伤眼睛，说的不是开车看手机的真正危险；“再也不坐”是赌气，语气太冲。 | The clue: he cares most for the family's safety. A glance that covers dozens of metres with all of you aboard reaches that care. Eye strain misses the real danger; “I'll never ride with you” is a sulk.

同学想放弃学了三年的古筝，因为最近练得很苦。她一直盼着在新年晚会上表演。
= 你不是一直盼着在新年晚会上弹一曲吗？现在放弃，三年的功夫就白费了。再坚持一下吧。
- 古筝那么贵，不学太浪费钱了。 ~unmoved
- 吃一点苦就放弃，你真没用。 ~harsh
% 线索是她“一直盼着在新年晚会上表演”，又已经学了“三年”。用她自己的心愿和三年的付出来劝，最能让她重新鼓起劲。古筝贵不贵，不是她此刻在意的；骂她“没用”，只会让她更灰心。 | The clues: she has long hoped to play at the New Year show, and has studied three years. Her own wish and her three years are what will rekindle her. The cost is not her concern now; “you're useless” only discourages her.

奶奶有老年卡，坐公交不要钱，可她总是走很远的路去买菜。她的膝盖不好。
= 奶奶，您膝盖不好，每次走远路回来都喊疼。坐公交又不要钱，几站就到了。
- 奶奶，坐在公交车上还能看看风景。 ~unmoved
- 奶奶，您走得太慢了，总跟不上别人。 ~rude
% 线索是奶奶“膝盖不好”，坐公交“不要钱”。说她回来喊疼，又说不花钱，正解开她舍不得、又受罪的心结。看风景不是她走路买菜时在意的；说她走得慢、跟不上别人，对长辈不礼貌。 | The clues: her knees are bad, and the bus is free. Her pain on coming home and the free ride answer both her thrift and her suffering. Views are not her concern; saying she is slow is rude to an elder.

表弟总把零食袋随手扔在小区的草坪上。他很喜欢常在草坪上玩的几只小猫。
= 小猫常在草坪上玩，要是把塑料袋吃下去，会生病的。垃圾还是扔进桶里吧。
- 垃圾桶刷成了绿色，挺好看的。 ~weak
- 乱扔垃圾的孩子，长大了也没出息。 ~harsh
% 线索是表弟“很喜欢”草坪上的小猫。说塑料袋会让小猫生病，从他喜欢的小猫说起，他就会在意。垃圾桶好不好看，和该不该乱扔没有关系；“长大了没出息”语气太冲，表弟听了只会不高兴。 | The clue: he loves the kittens on the lawn. Plastic that makes them ill starts from what he loves. A pretty bin has nothing to do with littering; “you'll come to nothing” is harsh.
`);

/** MANNER_8 are the scenes of speaking-8-persuading: persuading with understanding and an offer, not pressure. */
const MANNER_8 = checked(`
同桌上课总找你说话，你想劝他别说了。
= 我知道你有好多话想说，咱们下课再聊好吗？上课我怕漏听了老师讲的。
- 你烦不烦啊，闭嘴！ ~harsh
- 你再说，我就告诉老师，让你写检讨。 ~rude
% 线索是要“劝”同桌，不是要和他吵。先体谅他“有好多话想说”，再商量“下课再聊”，并说出自己的担心，他容易接受。“闭嘴”语气太冲，会伤人；拿告老师来吓他，不礼貌，同桌之间也伤了和气。 | The clue: you mean to persuade, not to quarrel. Granting he has much to say, proposing after class and naming your worry makes it easy to accept. “Shut up” is harsh; threatening him with the teacher is rude and sours the friendship.

爸爸答应周末陪你去图书馆，后来又说要加班。你想劝他抽出半天。
= 爸爸，我知道您工作忙。要不周六上午您先加班，下午陪我去两个小时，好吗？
- 您每次都说话不算话！ ~harsh
- 不陪就算了，我以后什么都不跟您说了。 ~rude
% 线索是爸爸“要加班”，你想要的是“半天”。先说“我知道您工作忙”，再提一个两头都顾得上的办法，用商量的口气，爸爸容易答应。“每次都说话不算话”语气太冲；“什么都不跟您说了”是赌气，对长辈不礼貌。 | The clues: he must work, and you want half a day. Granting he is busy, then offering a plan that serves both in a questioning tone, makes yes easy. “You never keep your word” is harsh; “I'll tell you nothing” is a sulk, rude to a parent.

你是文艺委员，想劝几位不愿意周末来排练合唱的同学。
= 我知道大家周末都有安排。排练只占周六上午两个小时，比赛那天我们一起拿个好名次，好不好？
- 必须来，不来的扣班级分。 ~pushy
- 不来的人就是不爱集体。 ~attack
% 线索是同学们“不愿意”周末来。先体谅大家“都有安排”，说清只占“两个小时”，再说一起拿名次的盼头，用“好不好”来商量，大家更愿意来。“必须来”“扣分”只是硬压；说不来的人“不爱集体”，是给人扣帽子，针对的是人。 | The clue: they are unwilling to give up the weekend. Granting their plans, saying it is only two hours and sharing the hope of a prize, then asking, wins them. “You must, or lose points” only forces; “you don't care for the class” labels people.

朋友把你借给他的书弄湿了几页，现在又想再借一本。你想劝他爱惜书。
= 这本可以借你。上次那本有几页沾了水，这次看的时候包个书皮吧，我帮你一起包。
- 你上次把书弄成那样，还好意思再借？ ~harsh
- 不借，你这个人就是不爱惜东西。 ~attack
% 线索是要劝他“爱惜书”，又不想伤了朋友。先答应借，再平和地提上次的事，给出“包书皮”的办法，还主动帮忙，朋友容易接受。“还好意思”语气太冲；说他“这个人就是不爱惜”，是针对人，不是针对这件事。 | The clue: you want him to take care, and to stay friends. Lending first, mentioning last time calmly and offering to help cover it is easy to accept. “Have you the nerve?” is harsh; “you're careless” attacks the person, not the act.

妹妹看动画片，到了时间还不肯去写作业。你想劝她。
= 这一集还有五分钟就完了，看完我们就去写作业，写完了还能再看一集，好不好？
- 马上关掉！不然我告诉妈妈。 ~harsh
- 只有笨孩子才一直看动画片。 ~rude
% 线索是妹妹“不肯”停下。先让她把这一集看完，再说写完作业还能看，用商量的口气，她容易答应。“马上关掉”加上告状，是硬压，语气太冲；说她是“笨孩子”，不礼貌，还会伤她的心。 | The clue: she refuses to stop. Letting her finish the episode and promising another after homework, as a question, makes yes easy. “Off now, or I tell Mum” is harsh; calling her stupid is rude and hurts.

小组里一位同学坚持用他的方案，可他的方案要三天，你们只有两天。你想劝他改一改。
= 你的方案想得很周到，就是要花三天，我们只有两天。能不能把第三步简化一点？
- 你的方案根本不行，听我的。 ~pushy
- 你总是这么自以为是。 ~attack
% 线索是他“坚持”自己的方案，问题在于“三天”和“两天”。先肯定他想得周到，再说出时间不够这个具体的问题，并用商量的口气提出改法，他才听得进去。“根本不行，听我的”只坚持自己；说他“自以为是”，针对的是人。 | The clues: he holds to his plan, and the trouble is three days against two. Praising its care, naming the time and suggesting a change as a question lets him listen. “It's no good, do it my way” only insists; “you always think you know best” attacks him.

邻居家的小狗晚上总是叫，奶奶被吵得睡不着。你想请邻居想想办法。
= 叔叔，您家小狗挺可爱的，就是晚上一叫，我奶奶就睡不着。能不能晚上让它待在里屋？
- 你们家的狗吵死人了，再叫我们就报警。 ~harsh
- 养狗的人从来不考虑别人。 ~attack
% 线索是你是去“请”邻居想办法。先说小狗可爱，再说奶奶睡不着这个具体的困难，提出一个邻居做得到的办法，邻居容易答应。“吵死人了”“报警”语气太冲；说“养狗的人从来不考虑别人”，是冲着人去的，邻居只会生气。 | The clue: you are asking a favour. Saying the dog is sweet, naming Grandma's sleepless nights and proposing something he can do makes it easy to agree. “It's deafening, we'll call the police” is harsh; “dog owners never think of others” attacks him.

同学在作文比赛报名前想放弃，说自己写得不好。你想劝他参加。
= 你上次写的那篇《外婆的菜园》，老师还在班上读过呢。去试试吧，就当一次练习。
- 你不去，就是胆小鬼。 ~harsh
- 去不去随你，反正我看你也得不了奖。 ~rude
% 线索是他觉得“自己写得不好”。用他自己被老师读过的作文让他看到长处，再说“就当一次练习”，减轻他的压力，他才敢去。骂他“胆小鬼”语气太冲；“反正得不了奖”是泼冷水，不礼貌，也劝不动他。 | The clue: he thinks he writes badly. His own essay read in class shows him his strength, and “just as practice” lightens the load. “Coward” is harsh; “you won't win anyway” is rude and persuades no one.

妈妈要把你的旧玩具全部扔掉，你想劝她留下几件。
= 妈妈，我知道东西太多了。我自己挑几件最有纪念意义的留下，其余的送给楼下的小朋友，好吗？
- 不许扔！那是我的东西！ ~pushy
- 您就是不尊重我。 ~attack
% 线索是妈妈嫌东西多，你想“留下几件”。先承认“东西太多了”，再提出只留几件、其余送人的办法，两人的想法都照顾到了，妈妈容易答应。“不许扔”只坚持自己；说妈妈“不尊重我”，把事情变成了指责人。 | The clues: she finds too much clutter, and you want only a few. Granting the clutter, keeping a few and giving the rest away serves you both. “Don't you dare” only insists; “you don't respect me” turns it into blame.

爷爷总把药随手放在桌上，你担心常来家里的小表弟误吃。
= 爷爷，药放在桌上您拿着方便，可表弟老爱翻东西。我帮您放进抽屉，贴个标签，好找又安全。
- 爷爷，您年纪大了，记性太差了。 ~rude
- 您必须把药收起来，听见没有？ ~pushy
% 线索是爷爷把药放桌上是图“方便”，你担心的是表弟。先体谅他“拿着方便”，再说出担心，并主动帮他放好、贴标签，既方便又安全，爷爷容易接受。说爷爷“记性太差”，不礼貌；“必须……听见没有”是命令的口气，只是硬压。 | The clues: he keeps the pills out for ease, and you fear for the cousin. Granting the ease, naming the worry and offering to store and label them keeps both, which he can accept. “Your memory's gone” is rude; “you must, do you hear?” only commands.
`);

/** SPECS_8 are the speaking topics of grade 8, in order. */
const SPECS_8: readonly Spec[] = [
  {
    grade: 8,
    id: "speaking-8-speech",
    title: t("A Prepared Speech", "主题演讲"),
    summary: t(
      "Giving a prepared speech on a theme: an opening that names the theme and draws in these listeners, and sentences made to be heard, short, concrete and fitted to them.",
      "围绕一个主题做有准备的演讲：开头点明主题、吸引眼前的听众；句子要适合听，简短、具体，合乎听众的身份。",
    ),
    intro: t(
      "A speech is heard once, by particular people, on a particular day. Its opening must say what it is about and give the listeners a reason to listen; its sentences must be ones the ear can follow.\n\nA pupil speaks on “爱护课桌” to his class. He does not begin with how desks are made; he taps the desk in front of him and asks, “这张桌子上，有没有你刻下的字？” Then he tells of the desk he sat at in grade 3, with a name carved in it by someone ten years before. The first knowledge point opens the speech, the second speaks for the ear.",
      "演讲只讲一遍，讲给特定的人、在特定的日子听。开头要说清讲什么，还要让听众愿意听下去；句子要让耳朵跟得上。\n\n比如一个同学在班里演讲“爱护课桌”。他没有从课桌是怎样做成的讲起，而是敲了敲面前的桌子，问：“这张桌子上，有没有你刻下的字？”接着讲他三年级时坐过的一张课桌，上面刻着十年前一个人的名字。第一个知识点学演讲的开头，第二个学说适合听的话。",
    ),
    texts: [...ruleTexts(OPENING_8), ...ruleTexts(SPOKEN_8)],
    after: ["speaking-7-impromptu"],
    points: [
      [
        "opening",
        t("Opening a Speech", "演讲的开头"),
        t(
          "In the first two or three sentences, start from something these listeners share, the place, the day, a thing in your hand, a question they can answer in their heads, and then name the theme plainly.\n\nAt a tree-planting day, “同学们，你们脚下这片空地，明年春天会长出什么？今天我想讲讲种树。”\n\n> **Watch out.** An opening that plunges into a definition or a history, or only announces the title, loses the listeners before the speech begins; and one that does not suit the occasion, a joke at a farewell or an excuse at a ceremony, loses them as surely.",
          "在开头两三句里，先从眼前的听众都知道的东西说起：这个地方、这一天、手里的一样东西、一个大家能在心里回答的问题；再明白地说出主题。\n\n比如在植树节上说：“同学们，你们脚下这片空地，明年春天会长出什么？今天我想讲讲种树。”\n\n> **注意。** 一开口就下定义、讲历史，或者只报个题目，演讲还没开始就失去了听众；开头不合场合，比如在送别时开玩笑、在典礼上说自己没准备好，同样会失去听众。",
        ),
        ruleGenerator(
          t("Which opening fits this speech best?", "哪一个开头最适合这次演讲？"),
          OPENING_8,
          rule(
            t(
              "Look at who is listening, on what occasion, and what the theme is; then find the opening that starts from what they share and names the theme.",
              "看清听众是谁、什么场合、主题是什么；再找出从听众共同知道的东西说起、又点明了主题的开头。",
            ),
            t(
              "Imagine hearing that opening in that hall: you know what the speech is about, and you want to hear the next sentence.",
              "想象自己在那个场合听到这个开头：你知道了要讲什么，也想接着听下一句。",
            ),
            {
              find: t("Step 1: see the listeners, the occasion and the theme.", "第一步：看清听众、场合和主题。"),
              choose: t("Step 2: choose the opening that starts from them.", "第二步：选出从眼前说起的开头。"),
            },
          ),
        ),
      ],
      [
        "spoken",
        t("Speaking for the Ear", "说适合听的话"),
        t(
          "Say it as you would to a person in front of you: short sentences, words the listeners use, a number turned into something they can picture, a real example rather than a maxim, and now and then a question put to them.\n\nNot “我校图书馆藏书量较为丰富”, but “我们图书馆的书，一个人每天读一本，要读三十年”.\n\n> **Watch out.** A sentence that reads well on paper, long and full of written words, is lost on the ear; and a sentence that circles the same point, or talks down to the listeners, loses them too.",
          "像对着面前的人说话那样说：句子短，用听众平时用的词，把数字变成看得见的东西，用真实的事例代替大道理，时不时向听众提个问题。\n\n不说“我校图书馆藏书量较为丰富”，而说“我们图书馆的书，一个人每天读一本，要读三十年”。\n\n> **注意。** 写在纸上很通顺的句子，又长又满是书面词，耳朵听不进去；绕着一个意思说来说去，或者用居高临下的口气说话，也会失去听众。",
        ),
        ruleGenerator(
          t("Which sentence is better said to these listeners?", "哪一句更适合讲给这些听众听？"),
          SPOKEN_8,
          rule(
            t(
              "Think who is listening, then find the sentence that is short, concrete and in words they would use.",
              "想一想听众是谁，再找出简短、具体、用的是他们平常说的话的那一句。",
            ),
            t(
              "Say the sentence aloud once: these listeners would take it in at a single hearing and remember it.",
              "把这句话说出声来：这些听众听一遍就能明白，也记得住。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "speaking-8-interview",
    title: t("Interviewing", "采访和访谈"),
    summary: t(
      "Preparing an interview around its aim and the person asked, with questions that draw out what is wanted, and keeping a faithful note of what was said, nothing added and nothing turned round.",
      "围绕采访的目的和对象准备问题，问出想了解的内容；如实记录和整理对方的话，不添加，不曲解。",
    ),
    intro: t(
      "An interview begins before it starts, with its aim, “what do I want to know?”, and with the person: what do they know that no one else does? Questions are chosen for both. And it ends after it is over, when what was said is written down: the note must keep the speaker's points, not your own.\n\nInterviewing a bus driver about early shifts, “您每天几点出车，出车前要做哪些准备？” suits both the aim and the man; the note then reads “他每天五点半出车，出车前要检查刹车和车门”, and not “他觉得早班太辛苦”, which he never said. The first knowledge point prepares the questions, the second records the answers.",
      "采访在开始之前就开始了：先想好目的，“我想了解什么？”，再想对象，“他知道哪些别人不知道的事？”，问题要照着这两点来选。采访结束以后也还没结束：要把对方说的话整理下来，记的必须是对方的意思，而不是自己的。\n\n比如采访一位公交司机，了解早班的情况。问“您每天几点出车，出车前要做哪些准备？”，既合目的，又合对象；记录写“他每天五点半出车，出车前要检查刹车和车门”，而不是写“他觉得早班太辛苦”，因为他没这样说过。第一个知识点准备问题，第二个整理记录。",
    ),
    texts: [...ruleTexts(PLAN_8), ...ruleTexts(RECORD_8)],
    after: ["speaking-6-interview", "speaking-7-proper"],
    points: [
      [
        "plan",
        t("Questions for the Aim and the Person", "围绕目的和对象设计问题"),
        t(
          "Write the aim in one sentence, then ask what this person, from their work or their life, can tell about it. A good question asks how, what or which, so it cannot be answered in one word; it asks about what they have done or seen; and it is polite, keeping away from pay, age or blame.\n\nInterviewing a postman about his round: “您每天送信要走哪几条街？遇到地址写错的信怎么办？” rather than “送信辛苦吗？”\n\n> **Watch out.** A question asked out of curiosity that has nothing to do with the aim wastes the time you were given; and a question that does not suit the person, a scholar's question to a farmer, gets no good answer.",
          "先用一句话写下采访的目的，再想一想这个人凭他的工作或经历，能告诉你哪些和目的有关的事。好的问题问“怎样”“什么”“哪些”，不能用一个字回答；问的是他做过、见过的事；还要有礼貌，不问工资、年龄，也不问带着责怪的话。\n\n比如采访一位邮递员，了解他怎样送信，问“您每天送信要走哪几条街？遇到地址写错的信怎么办？”，而不是“送信辛苦吗？”\n\n> **注意。** 出于好奇、却和目的无关的问题，浪费了对方给你的时间；不合对方身份的问题，比如拿学者的问题去问农民，也问不出好的回答。",
        ),
        ruleGenerator(
          t("Which question best serves this interview?", "哪个问题最能达到这次采访的目的？"),
          PLAN_8,
          rule(
            t(
              "Say the aim of the interview in one sentence and think what this person can tell about it; find the open, polite question that goes straight there.",
              "用一句话说出采访的目的，想一想这个人能讲出哪些相关的事；找出直奔目的、开放又有礼貌的那个问题。",
            ),
            t(
              "Imagine the person answering it: the answer is a few sentences of just what the aim needs, and they are glad to give it.",
              "想象对方回答这个问题：他会说上几句，说的正是目的所需要的，而且乐意回答。",
            ),
          ),
        ),
      ],
      [
        "record",
        t("Recording Faithfully", "如实整理访谈"),
        t(
          "After the interview, sum up each point the person made in a sentence of your own: keep the numbers, the order of steps and any “but”, which often carries the point; add no judgement of your own, and do not let a detail stand for the whole.\n\nA shopkeeper says, “以前一天卖两百个包子，现在早上就卖完三百个，下午还要再蒸一锅。” The note: “包子的销量从一天两百个增加到上午就卖完三百个，下午还要加蒸。”\n\n> **Watch out.** A word or a number that changes its owner, the other side's shots made yours, a minute to dress made a minute to put out a fire, turns the interview round; read the note back against the words before you use it.",
          "采访结束后，把对方说的每一个要点用自己的一句话概括出来：数字、步骤的顺序、“不过”“可是”这样常常带着要点的转折都要保留；不加进自己的评价，也不拿一个细节代替全部。\n\n比如店主说：“以前一天卖两百个包子，现在早上就卖完三百个，下午还要再蒸一锅。”记录写：“包子的销量从一天两百个增加到上午就卖完三百个，下午还要加蒸。”\n\n> **注意。** 一个词、一个数字换了主人，比如把对方投进的球说成自己练的，把一分钟穿好衣服说成一分钟灭火，访谈的意思就被弄反了；用之前，要拿记录和原话对一遍。",
        ),
        ruleGenerator(
          t("Which note records what was said faithfully?", "哪一条记录如实地整理了对方的话？"),
          RECORD_8,
          rule(
            t(
              "Mark each point of what was said, its numbers and its turns; then find the note that keeps them all and adds nothing.",
              "把对方话里的每个要点、数字和转折标出来；再找出全都保留、又没有添加的那条记录。",
            ),
            t(
              "Read the note against the words: each point is there, each number belongs where it did, and there is nothing the speaker did not say.",
              "把记录和原话对一遍：每个要点都在，每个数字都在原来的位置上，也没有对方没说过的话。",
            ),
            {
              find: t("Step 1: mark the points of what was said.", "第一步：标出原话的要点。"),
              choose: t("Step 2: choose the note that keeps them.", "第二步：选出如实保留它们的记录。"),
            },
          ),
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "speaking-8-discussion-focus",
    title: t("Keeping to the Focus", "抓住讨论焦点"),
    summary: t(
      "Finding the point on which a discussion really turns, and speaking to it: taking a side or joining the sides, with a reason, without straying, attacking or insisting.",
      "找出讨论中大家真正的分歧所在，围绕这个焦点发言：表明态度或提出兼顾的办法，说出理由，不跑题，不针对人，也不固执己见。",
    ),
    intro: t(
      "A discussion has a **focus**: the point on which the speakers differ. It is often hidden behind a “可是” or a “那……”: one speaker says what is good, the next turns with “but” to what is bad. Once it is found, every remark should speak to it.\n\nA class discusses whether to keep a hamster in the classroom. One says, “养它能学会照顾小动物”; another, “可是放假的时候谁来喂？” The focus is not whether hamsters are cute but who looks after it in the holidays; a useful remark answers that, “可以排一张假期轮流带回家的表”. The first knowledge point finds the focus, the second speaks to it.",
      "讨论都有一个**焦点**：大家意见不同的地方。它常常藏在“可是”“那……”后面：一个人说了好处，下一个人用“可是”转到了坏处。找到了焦点，每一次发言都要围着它说。\n\n比如一个班讨论要不要在教室里养仓鼠。有人说：“养它能学会照顾小动物。”有人说：“可是放假的时候谁来喂？”焦点不是仓鼠可不可爱，而是放假时谁来照顾；有用的发言要回答这个问题，比如“可以排一张假期轮流带回家的表”。第一个知识点找出焦点，第二个围绕焦点发言。",
    ),
    texts: [...ruleTexts(FOCUS_8), ...ruleTexts(KEEP_8)],
    after: ["speaking-7-intent"],
    points: [
      [
        "focus",
        t("Finding the Focus", "找出讨论焦点"),
        t(
          "Listen for where one speaker turns against the last, at “可是”, “不过”, “那……”, and say in one sentence what both sides are weighing: this or that, or how to have both.\n\nOn a class trip: “坐大巴便宜。”“可是要坐四个小时。” The focus is cost against time.\n\n> **Watch out.** A detail someone happens to mention is not the focus, nor is a question nobody disputes; and do not turn a speaker's view round, taking a worry about one point for opposition to the whole plan.",
          "留心一个人在哪里转过来反对前一个人，比如说“可是”“不过”“那……”的地方；再用一句话说出两边在比较什么：是这样还是那样，或者怎样两样都顾到。\n\n比如讨论班级出游：“坐大巴便宜。”“可是要坐四个小时。”焦点是省钱和省时间哪个更重要。\n\n> **注意。** 有人顺口提到的一个细节不是焦点，没有人争的问题也不是；也不要把别人的意思弄反了，把对某一点的担心当成反对整件事。",
        ),
        ruleGenerator(
          t("What is the focus of this discussion?", "这次讨论的焦点是什么？"),
          FOCUS_8,
          rule(
            t(
              "Find where one speaker turns against another, and say what the two sides are weighing against each other.",
              "找出一个人转过来反对另一个人的地方，说出两边在比较什么。",
            ),
            t(
              "Put the focus to each speaker in turn: every one of them has said something about it.",
              "拿这个焦点去对照每一个发言的人：每个人说的话都和它有关。",
            ),
          ),
        ),
      ],
      [
        "keep",
        t("Speaking to the Focus", "围绕焦点发言"),
        t(
          "Say where you stand on the focus, or offer a way that serves both sides, and give the reason; if someone has just spoken, answer what they said. Speak to the view, not the person, and leave room to talk it over.\n\nOn the bus or the train: “我赞成坐火车。贵一点，可是只要一个半小时，省下的时间能多参观一个地方。”\n\n> **Watch out.** A story of your own that does not touch the focus pulls the talk away; “I agree” with no reason moves nothing; and “that's wrong, say no more” or a word against the speaker ends the discussion instead of moving it on.",
          "针对焦点说出自己的态度，或者提出两边都能接受的办法，并说出理由；如果有人刚发了言，就回应他说的话。针对观点，不针对人，也给商量留下余地。\n\n比如讨论坐大巴还是坐火车：“我赞成坐火车。贵一点，可是只要一个半小时，省下的时间能多参观一个地方。”\n\n> **注意。** 讲一件和焦点无关的自己的事，会把讨论带偏；只说“我同意”却没有理由，讨论就停在原地；说“不对，别说了”或者针对发言的人，是结束讨论，而不是推进讨论。",
        ),
        ruleGenerator(
          t("Which remark keeps to the focus and moves the discussion on?", "哪一句发言紧扣焦点，推进了讨论？"),
          KEEP_8,
          rule(
            t(
              "Hold the focus in mind; find the remark that takes a side on it or joins the sides, and says why.",
              "记住焦点；找出针对它表明态度或提出兼顾办法、并说出理由的那一句。",
            ),
            t(
              "Imagine the next speaker after that remark: they have something new to answer, and no one has been put down.",
              "想象这句话之后下一个人发言：他有了新的内容可以回应，也没有人受到贬低。",
            ),
          ),
        ),
      ],
    ],
  },
  {
    grade: 8,
    id: "speaking-8-persuading",
    title: t("Speaking Persuasively", "增强说服力"),
    summary: t(
      "Persuading someone by a reason that touches what they care about, and in a manner that understands them, offers a way and asks rather than orders.",
      "用对方在乎的理由去说服人，并且体谅对方，提出办法，用商量而不是命令的口气。",
    ),
    intro: t(
      "To persuade is to make someone want to do what you ask. Two things do it: a **reason** that matters to them, not to you, and a **manner** that shows you understand why they did otherwise and offers a way out.\n\nA friend keeps borrowing your pen and losing it. “笔是我爸爸送的” matters to you; “你下周要考试，自己有一支用惯了的笔，写起来更顺手” matters to him. And “我知道你总是急着用，我们去小卖部一起挑一支吧” works where “你怎么又弄丢了！” fails. The first knowledge point chooses the reason, the second the manner.",
      "说服，就是让对方心甘情愿地照你说的去做。靠两样东西：一是对方在乎的**理由**，而不是你自己在乎的；二是**态度和方式**：体谅对方为什么那样做，再给他一个台阶和办法。\n\n比如朋友总借你的笔，又总弄丢。“笔是我爸爸送的”，是你在乎的；“你下周要考试，自己有一支用惯了的笔，写起来更顺手”，才是他在乎的。“我知道你总是急着用，我们去小卖部一起挑一支吧”能说动他，“你怎么又弄丢了！”却不能。第一个知识点选理由，第二个选说法。",
    ),
    texts: [...ruleTexts(REASON_8), ...ruleTexts(MANNER_8)],
    after: ["speaking-8-discussion-focus"],
    points: [
      [
        "reason",
        t("A Reason That Moves Them", "用对方在乎的理由"),
        t(
          "Find what this person cares about, a child, a goal, their health, their pride, and link what you ask to it: if they do it, that thing is kept safe or comes nearer.\n\nA classmate who wants to be a pilot will not stop reading in the dark for “费电”, but may for “飞行员要视力好，你现在就得保护眼睛”.\n\n> **Watch out.** A reason that matters only to you, a reason with nothing to do with the matter, and a threat or an insult in place of a reason move no one; the last makes them dig in.",
          "找出这个人在乎什么，比如孩子、目标、身体、面子，把你劝他做的事和这一点连起来：照你说的做，他在乎的东西就能保住，或者离他更近。\n\n比如一个想当飞行员的同学，不会因为“费电”就不在暗处看书，却可能因为“飞行员要视力好，你现在就得保护眼睛”而改掉。\n\n> **注意。** 只有你自己在乎的理由、和这件事没关系的理由，还有用威胁、骂人代替理由，都打动不了人；最后一种还会让对方更不肯听。",
        ),
        ruleGenerator(
          t("Which reason is most likely to persuade them?", "哪一个理由最能说服对方？"),
          REASON_8,
          rule(
            t(
              "Find in the scene what the person cares about most; choose the reason that links what you ask to that.",
              "从情境里找出对方最在乎的东西；选出把你劝的事和它连起来的理由。",
            ),
            t(
              "Put yourself in their place and hear the reason: it speaks of what you care about, and it is true.",
              "站在对方的位置听这个理由：它说的正是你在乎的事，而且是实情。",
            ),
          ),
        ),
      ],
      [
        "manner",
        t("Understanding and Offering a Way", "体谅对方，商量着说"),
        t(
          "Begin by showing you understand why they do as they do; then name the trouble plainly, offer a way that is easy to take, help if you can, and ask rather than order: “……好吗？”\n\nTo a neighbour practising the drum at night: “您打得真好听，就是九点以后我弟弟要睡觉，能不能早一点练？”\n\n> **Watch out.** An order, a threat, a label such as “你就是自私” or a jab at their age or ability turns persuading into a quarrel; even a good reason is lost when it is said that way.",
          "先表示你理解对方为什么这样做；再平和地说出问题，提出一个容易做到的办法，能帮就主动帮一把，用商量的口气，比如“……好吗？”，而不是命令。\n\n比如劝晚上练鼓的邻居：“您打得真好听，就是九点以后我弟弟要睡觉，能不能早一点练？”\n\n> **注意。** 命令、威胁，给人扣上“你就是自私”这样的帽子，或者拿对方的年纪、能力说事，都会把劝说变成吵架；理由再好，这样说出来也没有用。",
        ),
        ruleGenerator(
          t("Which way of saying it are they most likely to accept?", "哪一种说法对方最容易接受？"),
          MANNER_8,
          rule(
            t(
              "Look for the words that first understand the other person, then offer a way and ask.",
              "找出先体谅对方、再提出办法、用商量的口气说的那一句。",
            ),
            t(
              "Imagine being spoken to so: you feel understood, the way offered is easy, and you could say yes without losing face.",
              "想象别人这样对你说：你觉得被理解了，办法也容易做到，答应下来不会丢面子。",
            ),
          ),
        ),
      ],
    ],
  },
];

/** stageSevenNineSpeaking are the speaking topics of grades 7 to 9, in order, each after the reading and speaking before it. */
export const stageSevenNineSpeaking: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of [...SPECS_7, ...SPECS_8])
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
          ...built,
        ].map((x) => x.topic),
      ),
    );
  return built;
})();
