// The speaking topics of grade 7 (docs/chinese-curriculum.md §18.9): hearing what is meant, retelling and relaying,
// speaking fittingly to the listener and the occasion, and speaking off the cuff. The scenes and the words said are
// written for this subject. Until their recordings are made, what is said is shown as text to be read as if heard.

import { t } from "@ga/content";

import type { GradeTopic } from "../grammar/index.ts";
import { stageThreeFourReading } from "../reading/stage-3-4.ts";
import { stageFiveSixReading } from "../reading/stage-5-6.ts";
import { stageSevenNineReading } from "../reading/stage-7-9.ts";
import { parseRules, type RuleItem, ruleGenerator } from "../reading/topic-kit.ts";
import { rule, ruleTexts, type Spec, stageSpeakingTopics, topicOf } from "./speaking-1-2.ts";
import { stageThreeFourSpeaking } from "./speaking-3-4.ts";
import { stageFiveSixSpeaking } from "./speaking-5-6.ts";

/** checked reads the scenes of a knowledge point of grade 7, each of which carries its own check, resting on its clues. */
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

/** stageSevenNineSpeaking are the speaking topics of grades 7 to 9, in order, each after the reading and speaking before it. */
export const stageSevenNineSpeaking: readonly GradeTopic[] = (() => {
  const built: GradeTopic[] = [];
  for (const spec of SPECS_7)
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
