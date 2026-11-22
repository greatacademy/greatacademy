// The planning topic of grade 7 (docs/chinese-curriculum.md §18.9): an outline before writing, choosing the one that
// serves the centre and putting its parts in order. Every task and outline is written for this subject; the wrong
// outlines are the usual faults of a plan, material off the centre, detail in the wrong place, parts out of order.

import { type Text, t } from "@ga/content";
import { point } from "@ga/subject-chinese";

import type { GradeTopic } from "../grammar/index.ts";
import { bilingual, type Choice, choice, choiceTopicGenerator, type Heads, rows } from "./choice-kit.ts";

/**
 * CENTRED are the outlines to choose by the centre, each on a line `title | the centre, Chinese ~ English | the right
 * outline | why, Chinese ~ English | a wrong outline | why, Chinese ~ English | another | why, Chinese ~ English`.
 */
const CENTRED = `
那一次，我学会了坚持 | 学骑车时摔了很多次，仍然坚持，终于学会 ~ keeping on through many falls until one can ride a bike | 开头：暑假想学骑车；中间：一次次摔倒，想放弃又爬起来（详写）；结尾：终于骑稳了，懂得了坚持 | 每部分都围绕坚持，最能表现坚持的摔倒又爬起来写得最详细 ~ every part serves keeping on, and the falls and getting up, which show it best, are told in most detail | 开头：暑假想学骑车；中间：摔倒又爬起来；和表哥去海边游泳（详写）；结尾：学会了骑车 | 去海边游泳和坚持学骑车没有关系，还写得最详细，偏离了中心 ~ the swim at the seaside has nothing to do with keeping on, yet it is told in most detail | 开头：详细介绍新自行车的颜色和样子（详写）；中间：摔了几次；结尾：学会了骑车 | 详写的是自行车的样子，最能表现坚持的摔倒和爬起来反而一笔带过 ~ the new bike's looks get the detail, while the falls that show keeping on are passed over
我的爷爷 | 爷爷节俭，却舍得帮助别人 ~ a grandfather thrifty with himself yet generous to others | 开头：爷爷的一件旧棉袄穿了二十年；中间：爷爷把攒下的钱捐给受灾的村子（详写）；结尾：我明白了爷爷的节俭 | 先写节俭，再详写他舍得帮人，两件事合起来正好表现中心 ~ first his thrift, then in detail his giving, the two together making the centre | 开头：爷爷的一件旧棉袄穿了二十年；中间：爷爷爱下象棋，常常赢（详写）；结尾：我爱爷爷 | 下象棋表现不了节俭和帮人，选的材料不合中心 ~ playing chess shows neither thrift nor generosity, so the material misses the centre | 开头：爷爷舍不得买新衣服；中间：爷爷舍不得吃肉；爷爷舍不得坐车（详写）；结尾：爷爷很节俭 | 只写了节俭，中心的另一半，舍得帮助别人，完全没有写到 ~ it shows only thrift and leaves out the other half of the centre, his generosity
一张旧照片 | 一张旧照片让我想起和好朋友分别时的不舍 ~ an old photograph bringing back the sadness of parting from a friend | 开头：整理抽屉，翻出一张旧照片；中间：回忆照片上的那天，朋友第二天就要搬走（详写）；结尾：看着照片，又想起了他 | 由照片引出回忆，详写分别前的那一天，结尾回到照片，紧扣不舍 ~ the photo leads to the memory, the day before parting is told in detail, and the end returns to the photo | 开头：整理抽屉，翻出一张旧照片；中间：介绍照相机的用法（详写）；结尾：照片要好好保存 | 照相机的用法和分别的不舍无关，整篇都离开了中心 ~ how a camera works has nothing to do with the sadness of parting | 开头：翻出一张旧照片；中间：照片上的公园有多少种花草（详写）；朋友搬走了；结尾：我很想他 | 详写的是公园的花草，分别这件最能表现不舍的事只有一句 ~ the flowers of the park get the detail, and the parting that shows the sadness has one line
第一次做饭 | 第一次做饭才知道妈妈每天的辛苦 ~ cooking for the first time and learning how hard mother works every day | 开头：妈妈生病，我决定做晚饭；中间：洗菜、切菜、炒菜，手忙脚乱，还被油溅到（详写）；结尾：端上饭菜，懂得了妈妈的辛苦 | 详写做饭的忙乱和辛苦，结尾由自己的体会想到妈妈，扣住中心 ~ the hurry and toil of cooking are told in detail, and the end turns from the writer's own trouble to mother's | 开头：妈妈生病，我决定做晚饭；中间：去超市挑零食，买了很多好吃的（详写）；结尾：妈妈很高兴 | 详写的是挑零食，和做饭的辛苦无关，体会不到妈妈的辛苦 ~ choosing snacks at the supermarket is told in detail, which has nothing to do with the toil of cooking | 开头：妈妈生病，我决定做晚饭；中间：很快就把饭做好了；结尾：做饭真容易 | 写成做饭很容易，结尾的意思和中心正好相反 ~ it makes cooking easy, so its ending says the opposite of the centre
我们班的“小书虫” | 同桌爱读书，读得入迷 ~ a deskmate who loves books and gets lost in them | 开头：同桌外号叫“小书虫”；中间：课间读书听不见铃声；排队时也捧着书，差点撞到树上（详写）；结尾：在她的影响下我也爱上了读书 | 两件事都表现爱读书、读得入迷，最有趣的一件写得最详细 ~ both episodes show her lost in books, the funniest told in most detail | 开头：同桌外号叫“小书虫”；中间：她的个子很高，跑步很快（详写）；结尾：我很喜欢她 | 个子高、跑得快和爱读书无关，材料不合中心 ~ being tall and fast has nothing to do with loving books | 开头：同桌外号叫“小书虫”；中间：她读过很多书，比如……（列出二十本书名）；结尾：她很爱读书 | 只列书名，没有一件表现她读得入迷的事，中心没有落到实处 ~ a list of book titles has no episode that shows her lost in reading
雨中的那把伞 | 一个陌生人雨中送伞，让我感受到温暖 ~ the warmth of a stranger sharing an umbrella in the rain | 开头：放学下大雨，我没带伞；中间：一位阿姨把伞撑到我头顶，自己半边身子淋湿了（详写）；结尾：没来得及问她的名字，却一直记得那把伞 | 详写阿姨送伞和她淋湿的样子，这正是温暖的来源 ~ the stranger's umbrella and her soaked side, the source of the warmth, are told in detail | 开头：放学下大雨，我没带伞；中间：阿姨送我回家；回家后看了一部电影（详写）；结尾：那天很开心 | 看电影和陌生人送伞的温暖无关，还写得最详细 ~ watching a film has nothing to do with the stranger's kindness, yet it gets the detail | 开头：详细写天上的乌云、大风和雷声（详写）；中间：一位阿姨送我回家；结尾：她真好 | 详写的是天气，最能表现温暖的送伞只有一句 ~ the weather gets the detail, and the umbrella that shows the warmth has one line
校园里的银杏树 | 银杏树陪伴我们成长 ~ a ginkgo tree that keeps the pupils company as they grow | 开头：校门口有一棵老银杏树；中间：春天在树下读书，秋天捡叶子做书签，毕业的哥哥姐姐在树下合影（详写）；结尾：它看着一届届同学长大 | 按季节和人写树与同学们的故事，扣住陪伴成长 ~ the tree's seasons are told with the pupils beside it, keeping to growing up together | 开头：校门口有一棵老银杏树；中间：银杏树的学名、科属和产地（详写）；结尾：银杏树很有用 | 写成了介绍银杏树的说明文，没有写它和同学们的成长 ~ it turns into an exposition of the tree, with nothing of the pupils growing up | 开头：校门口有一棵老银杏树；中间：在树下读书；学校新修了操场（详写）；结尾：我爱我的学校 | 新修的操场和银杏树陪伴成长无关，详写它就跑题了 ~ the new playground has nothing to do with the tree, and telling it in detail leaves the subject
一次难忘的比赛 | 拔河比赛让我懂得了团结的力量 ~ a tug of war teaching the strength of pulling together | 开头：学校举行拔河比赛；中间：开始落后，大家听口令一起用力，最后反败为胜（详写）；结尾：明白了团结就是力量 | 详写大家一起用力反败为胜，正好表现团结的力量 ~ the team pulling as one and winning from behind, which shows the strength of unity, is told in detail | 开头：学校举行拔河比赛；中间：我一个人用力最大，带领全班赢了（详写）；结尾：我很厉害 | 写成了一个人的本领，表现不了团结的力量 ~ it becomes one pupil's strength, which cannot show the strength of pulling together | 开头：比赛前一周，每天放学练习，练习的经过（详写）；中间：比赛赢了；结尾：比赛很有意思 | 详写的是练习，最能表现团结的比赛过程只有一句 ~ the practising gets the detail, and the contest that shows unity has one line
家乡的小河 | 家乡的小河给我的童年带来快乐 ~ the river of home that filled childhood with joy | 开头：村前有一条小河；中间：夏天在河里摸鱼、打水仗，冬天在冰上滑冰（详写）；结尾：离开家乡后，常常梦见那条小河 | 详写在河边玩的快乐，结尾的想念也从这份快乐里来 ~ the joys of playing by the river are told in detail, and the longing at the end grows from them | 开头：村前有一条小河；中间：小河的长度、宽度和水深（详写）；结尾：小河很美 | 只写小河的数字，没有写它带来的快乐 ~ the river's measurements say nothing of the joy it gave | 开头：村前有一条小河；中间：在河里摸鱼；城里的大商场很热闹（详写）；结尾：我喜欢家乡 | 城里的商场和小河给童年的快乐无关，详写它偏离了中心 ~ the city's shopping centre has nothing to do with the river, and telling it in detail leaves the centre
我学会了道歉 | 弄坏同学的东西后鼓起勇气道歉，懂得了诚实面对错误 ~ breaking a classmate's thing, finding the courage to say sorry, and learning to own a mistake | 开头：不小心弄坏了同桌的尺子，偷偷放回去；中间：心里不安，几次想开口又不敢，终于说了对不起（详写）；结尾：同桌原谅了我，我懂得了要诚实面对错误 | 详写不敢开口到鼓起勇气的心理变化，这是表现中心最重要的部分 ~ the struggle from not daring to speak to finding courage, the heart of the centre, is told in detail | 开头：不小心弄坏了同桌的尺子；中间：赶快买了一把新的放回去，没有告诉他（详写）；结尾：他没有发现 | 没有道歉，也没有诚实面对错误，结局和中心相反 ~ there is no apology and no owning up, so the ending goes against the centre | 开头：不小心弄坏了同桌的尺子；中间：我说了对不起；结尾：详细介绍这把尺子的刻度和用法（详写） | 详写尺子的刻度和用法，最能表现中心的鼓起勇气道歉反而一句带过 ~ the ruler's markings get the detail, and the courage to apologize has one line
一件小事 | 一位清洁工的认真让我改变了乱扔垃圾的习惯 ~ a street cleaner's care that cured the writer of littering | 开头：我随手扔了一个瓶子；中间：清洁工阿姨弯腰捡起，又把附近的纸片一张张捡干净（详写）；结尾：从那以后，我再也不乱扔垃圾了 | 详写清洁工认真捡垃圾的动作，正是它改变了我 ~ the cleaner's careful picking up, which changed the writer, is told in detail | 开头：我随手扔了一个瓶子；中间：清洁工阿姨捡了起来；我去书店买了一本书（详写）；结尾：那天很充实 | 去书店买书和改变乱扔垃圾的习惯无关，还写得最详细 ~ buying a book has nothing to do with the change of habit, yet it gets the detail | 开头：我随手扔了一个瓶子；中间：清洁工阿姨捡了起来；结尾：我想，反正有人会捡 | 结尾没有改变习惯，反而觉得扔了也没关系，和中心相反 ~ the end finds littering harmless, the opposite of the centre
难忘的一课 | 一节实验课让我明白了做事要细心 ~ a science lesson teaching care in what one does | 开头：科学课上做溶解的实验；中间：我粗心看错了刻度，实验失败；重新细心做了一遍，终于成功（详写）；结尾：明白了做事要细心 | 失败和重做成功的对比最能表现细心，所以详写 ~ the failure set against the careful second try shows care best, so it is told in detail | 开头：科学课上做实验；中间：实验室里有哪些仪器，一样一样介绍（详写）；结尾：科学课真有趣 | 详写的是仪器，没有写出粗心和细心的经过，中心不明确 ~ the instruments get the detail, with nothing of carelessness and care, so the centre is lost | 开头：科学课上做实验；中间：我一次就做成功了，老师表扬了我（详写）；结尾：我很高兴 | 没有因粗心而失败的经过，就表现不出细心的重要 ~ without a failure from carelessness, the worth of care cannot show
`;

/**
 * ORDERED are the outlines to put in order, each on a line `title | the parts, numbered, split by ; | the right order |
 * why, Chinese ~ English | a wrong order | why, Chinese ~ English | another | why, Chinese ~ English`.
 */
const ORDERED = `
第一次登台演讲 | ①站在台上腿发抖，看到老师鼓励的目光，慢慢说顺了；②听说要在全校演讲，又兴奋又紧张；③演讲结束，台下响起了掌声；④每天对着镜子练习 | ②④①③ | 按事情发展的顺序：得知消息，练习，台上紧张又说顺，结束时的掌声 ~ in the order of events: hearing the news, practising, nerves then fluency on stage, applause at the end | ④②①③ | 还不知道要演讲，就先对着镜子练习，起因被放到了后面 ~ the practising comes before the writer even knows of the speech, so the cause is put after it | ②①④③ | 已经上台演讲了才回头去练习，经过的先后颠倒了 ~ the practising comes after the speech has been given, so the steps are out of order
我家的阳台 | ①走进阳台，左边是爸爸种的几盆花；②右边挂着鸟笼，里面有一只会说话的鹦鹉；③阳台正中摆着一张小桌，是我写作业的地方；④站在阳台上，能看见远处的小山 | ①③②④ | 按空间顺序：从左边到正中再到右边，最后望向远处 ~ in order of place: from the left to the middle and the right, then out to the distance | ②①③④ | 先写右边再写左边，接着又回到正中，空间顺序是乱的 ~ it goes right, then left, then back to the middle, so the order of place is muddled | ④①③② | 一开头就写远处的小山，还没走进阳台就望到了远处 ~ it opens with the distant hills, looking far away before stepping onto the balcony
种向日葵 | ①把种子埋进土里，每天浇水；②七月，向日葵开出了金黄的花；③过了一个星期，小芽钻出了土；④秋天，收获了一大把瓜子 | ①③②④ | 按时间顺序：播种，出芽，开花，结籽 ~ in order of time: sowing, sprouting, flowering, seeding | ①②③④ | 开花写在出芽前面，可没有出芽就不会开花 ~ it puts the flowers before the sprout, but nothing flowers before it sprouts | ③①②④ | 小芽钻出土写在播种前面，还没埋种子就出了芽 ~ the sprout comes before the seed is sown
一次迷路 | ①看到路边的警察，鼓起勇气去问路；②跟着妈妈逛庙会，人太多，一转身就找不到她了；③在警察的帮助下找到了妈妈；④又急又怕，在人群里到处乱跑 | ②④①③ | 按事情发展的顺序：走散，着急乱跑，问路，找到妈妈 ~ in the order of events: getting lost, running about in fear, asking the way, finding mother | ②①④③ | 已经鼓起勇气问路之后又乱跑，心情的变化颠倒了 ~ the frightened running comes after the brave asking, so the change of feeling is reversed | ④②①③ | 还没走散就先着急乱跑，起因放到了后面 ~ the frightened running comes before getting lost, so the cause is put after it
我的书包 | ①书包是蓝色的，上面印着一只小熊；②打开书包，前面的小袋装着文具；③中间的大袋里放着课本和作业本；④它陪我上学三年了，我很爱惜它 | ①②③④ | 先写外观，再由外到里写各个袋子，最后写感情 ~ first its looks, then its pockets from the front inward, and last the feeling | ②①③④ | 还没写书包的样子，就先打开写里面的小袋，由外到里的顺序乱了 ~ it opens the bag before describing it, breaking the order from outside to inside | ④③②① | 一开头就写感情，然后从里往外写，最后才说书包的样子，读的人一直不知道写的是什么样的书包 ~ it begins with the feeling and ends with the looks, so the reader learns last what bag it is
校运动会 | ①运动员入场，各班举着班牌走过主席台；②比赛开始，赛道上你追我赶；③颁奖时，我们班拿了团体第二名；④清晨，操场上彩旗飘飘 | ④①②③ | 按时间顺序：清晨的操场，入场，比赛，颁奖 ~ in order of time: the field at dawn, the parade, the races, the prizes | ①②③④ | 颁奖以后才写清晨的操场，把开头的环境放到了最后 ~ it ends with the field at dawn, after the prizes, putting the opening scene last | ④②①③ | 比赛开始后才入场，活动的先后颠倒了 ~ the parade comes after the races have begun, so the events are out of order
帮奶奶学用手机 | ①奶奶想和远方的孙子视频，却不会用手机；②奶奶第一次看到孙子的脸，笑得合不拢嘴；③我一步一步教，奶奶记在小本子上；④奶奶总是忘，我耐着性子教了一遍又一遍 | ①③④② | 按事情发展的顺序：起因，教，反复教，成功 ~ in the order of events: why, teaching, teaching again and again, success | ①②③④ | 奶奶已经和孙子视频了，后面才开始教，结果放到了经过前面 ~ the video call comes before the teaching, so the result is put before the steps | ③①④② | 还不知道奶奶想做什么，就先开始教，起因放到了后面 ~ the teaching comes before we know what grandma wants, so the cause is put after it
参观科技馆 | ①进门大厅里，一个机器人向我们问好；②二楼是太空展区，可以坐进模拟飞船；③三楼的声音展区里，对着管子说话，另一头的同学能听见；④离开时，我还想再来 | ①②③④ | 按参观的顺序：大厅，二楼，三楼，离开 ~ in the order of the visit: the hall, the second floor, the third, leaving | ②①③④ | 先写二楼再回到进门大厅，参观的路线乱了 ~ it starts on the second floor and then returns to the hall, so the route is muddled | ③②①④ | 从三楼往下写到大厅，和进馆的先后正好相反 ~ it goes down from the third floor to the hall, the reverse of entering
妈妈的手 | ①小时候，妈妈的手又白又软；②现在妈妈的手粗糙了，指头上有好几道口子；③为了这个家，妈妈每天洗衣、做饭，手泡在冷水里；④我想，长大了一定要好好照顾妈妈 | ①②③④ | 先对比过去和现在，再写手变粗的原因，最后抒发感情 ~ first then against now, then why the hands grew rough, and last the feeling | ③①②④ | 还没写手变粗，就先写变粗的原因，读的人不知道原因说的是什么 ~ the reason comes before the change it explains, so the reader cannot tell what it is a reason for | ①②④③ | 感情已经抒发了，后面才交代原因，结尾落在了叙述上 ~ the feeling comes before its cause, so the piece ends on a mere fact
一场春雨 | ①天空忽然暗下来，刮起了风；②雨停了，树叶绿得发亮；③细细的雨丝落下来，打在窗户上沙沙响；④几声春雷响过 | ①④③② | 按雨的过程：变天，打雷，下雨，雨停 ~ in the course of the rain: the sky darkens, thunder, rain, and the rain stopping | ①③②④ | 雨已经停了，后面才响起春雷，雷声应在下雨前 ~ the thunder comes after the rain has stopped, though it comes before | ③①④② | 先下雨，后变天和打雷，下雨前的样子放到了后面 ~ the rain falls before the sky darkens and thunders
我的心爱之物 | ①生日那天，爸爸送了我一个地球仪；②地球仪蓝色的是海洋，绿色的是陆地，轻轻一拨就能转动；③我常常转着它，找爸爸出差去过的城市；④它让我明白世界很大，我想去看看 | ①②③④ | 先写怎么得到，再写样子，然后写我和它的故事，最后写它的意义 ~ first how it came, then its look, then the writer's time with it, and last what it means | ②③①④ | 样子和故事都写完了，才交代它是怎么来的，来历应放在开头 ~ how it came is told after its look and its story, though it belongs at the start | ①④②③ | 意义写在了样子和故事前面，还没写出我和它的故事就讲意义 ~ the meaning is said before the look and the story it must come from
包饺子 | ①把面粉和成面团，揉得光滑；②把饺子下进开水锅里煮；③擀出圆圆的饺子皮，放上馅，捏紧；④热腾腾的饺子出锅了，一家人围坐着吃 | ①③②④ | 按做事的步骤：和面，包，煮，吃 ~ in the order of the steps: making the dough, filling, boiling, eating | ③①②④ | 还没和面就先擀皮包馅，没有面团就擀不出皮 ~ the wrappers are rolled before the dough is made, and there is no wrapper without dough | ①②③④ | 饺子还没包，就先下进锅里煮，步骤颠倒了 ~ the dumplings go into the pot before they are filled, so the steps are reversed
`;

/** centredChoices are the questions of choosing the outline that serves the centre. */
const centredChoices: readonly Choice[] = rows(CENTRED, 8).map(([title, centre, right, why, w1, why1, w2, why2]) => {
  const c = bilingual(centre!);
  const w = bilingual(why!);
  const a = bilingual(why1!);
  const b = bilingual(why2!);
  return choice({
    ask: t(
      `This composition is meant to show ${c.en}. Which outline serves its centre best?`,
      `这篇作文要表现的中心是：${c["zh-CN"]}。哪一份提纲最能围绕中心？`,
    ),
    shown: `《${title}》`,
    right: right!,
    wrong: [
      [w1!, t(`${a.en}.`, `${a["zh-CN"]}。`)],
      [w2!, t(`${b.en}.`, `${b["zh-CN"]}。`)],
    ],
    find: t(
      `The centre is ${c.en}. Every part must serve it, and the part that shows it best is the one to tell in detail.`,
      `中心是：${c["zh-CN"]}。每一部分都要为它服务，最能表现它的部分要详写。`,
    ),
    choose: t(`The right outline: ${w.en}.`, `正确的提纲：${w["zh-CN"]}。`),
    check: t(
      "Cover the title and read the outline alone: a reader could still say what the centre is, and the part marked 详写 is where it shows most.",
      "遮住题目，只读提纲：读的人仍然说得出中心是什么，而且标着“详写”的部分正是最能表现中心的地方。",
    ),
  });
});

/** orderedChoices are the questions of putting the parts of an outline in order. */
const orderedChoices: readonly Choice[] = rows(ORDERED, 8).map(([title, parts, right, why, w1, why1, w2, why2]) => {
  const w = bilingual(why!);
  const a = bilingual(why1!);
  const b = bilingual(why2!);
  const lines = parts!.split("；");
  if (lines.length !== [...right!].length) throw new Error(`planning: ${title} needs one number a part`);
  return choice({
    ask: t(
      "These are the parts of an outline, out of order. In which order should they go?",
      "下面是一份作文提纲的几个部分，顺序打乱了。应该按哪个顺序排列？",
    ),
    shown: [`《${title}》`, ...lines].join("\n"),
    right: right!,
    wrong: [
      [w1!, t(`${a.en}.`, `${a["zh-CN"]}。`)],
      [w2!, t(`${b.en}.`, `${b["zh-CN"]}。`)],
    ],
    find: t(
      "Find the part that must come first, the start of the events, the first place or the first step, and ask what kind of order the rest follows: time, place, steps, or the course of a feeling.",
      "先找出必须放在最前面的部分：事情的开端、最先到的地方或第一步；再想想其余部分按什么顺序排：时间、空间、步骤，还是感情的变化。",
    ),
    choose: t(`${right} is right: ${w.en}.`, `排成${right}，${w["zh-CN"]}。`),
    check: t(
      `Read the parts in the order ${right}: each follows from the one before, and none needs a later part to be understood.`,
      `按${right}的顺序读一遍：每一部分都接得上前一部分，没有哪一部分要读了后面的才明白。`,
    ),
  });
});

/** CENTRED_HEADS and ORDERED_HEADS are the headings of the steps of choosing and ordering an outline. */
const CENTRED_HEADS: Heads = {
  find: t("**Step 1: find the centre.**", "**第一步：找准中心。**"),
  choose: t("**Step 2: choose the outline whose every part serves it.**", "**第二步：选出每一部分都为中心服务的提纲。**"),
};
const ORDERED_HEADS: Heads = {
  find: t("**Step 1: find the part that comes first and the kind of order.**", "**第一步：找出开头的部分和排列的顺序。**"),
  choose: t("**Step 2: line the rest up after it.**", "**第二步：把其余部分接着排好。**"),
};

/** explanation is the shared form of a knowledge point's explanation: what to do, an instance, and a callout. */
const explanation = (how: Text, instance: Text, watch: Text): Text =>
  t(
    `${how.en}\n\n${instance.en}\n\n> **Watch out.** ${watch.en}`,
    `${how["zh-CN"]}\n\n${instance["zh-CN"]}\n\n> **注意。** ${watch["zh-CN"]}`,
  );

/** planningTopics are the planning topics of grade 7. */
export const planningTopics: readonly GradeTopic[] = [
  {
    grade: 7,
    topic: {
      id: "planning-7-outline",
      title: t("An Outline", "列提纲"),
      summary: t(
        "Planning a composition before writing it: choosing the outline whose every part serves the centre, with detail where the centre shows most, and putting its parts in order.",
        "动笔前先列提纲：选出每一部分都为中心服务、在最能表现中心的地方详写的提纲，并把各部分排好顺序。",
      ),
      intro: t(
        "An outline is the plan of a composition in a few lines: what the beginning, the middle and the end will say, and which part will be told in detail. Writing it first keeps the piece on its centre.\n\nFor 《我学会了游泳》, whose centre is overcoming fear: beginning, afraid of the water; middle, the coach holds me up, I let go of the side for the first time (详写); end, I swim across the pool. A swimming outline that spends its middle on buying goggles has already lost the centre. The first knowledge point chooses the outline that serves the centre, the second puts its parts in order.",
        "提纲就是用几行字写出的作文计划：开头、中间、结尾各写什么，哪一部分详写。先列提纲，文章才不会离开中心。\n\n比如《我学会了游泳》，中心是克服害怕：开头，我怕水；中间，教练托着我，我第一次松开池边（详写）；结尾，我游过了泳池。如果提纲的中间写的是去买泳镜，还没动笔就已经离开了中心。第一个知识点选出围绕中心的提纲，第二个把提纲的各部分排好顺序。",
      ),
      prerequisites: ["revising-6"],
      encompasses: [],
      xp: 12,
      strand: "writing",
      knowledgePoints: [
        point(
          "planning-7-outline-centre",
          t("The Outline That Serves the Centre", "围绕中心列提纲"),
          explanation(
            t(
              "Read the centre, then test each part of an outline against it: does this part show the centre? Keep only the parts that do, and mark for detail the one that shows it most.",
              "先读懂中心，再用它检查提纲的每一部分：这一部分能表现中心吗？只留下能表现的，并把最能表现中心的一部分标为详写。",
            ),
            t(
              "For 《我的妈妈》 with the centre “mother is strict but caring”, the middle should hold a scene of her strictness and one of her care, not her favourite television show.",
              "比如《我的妈妈》，中心是“妈妈严格又关心我”，中间就要有一件表现严格的事和一件表现关心的事，不能写她爱看的电视剧。",
            ),
            t(
              "An outline can go wrong even when every part is on the subject: if the detail falls on a part that only leads in, such as the weather, the part that shows the centre is starved.",
              "就算每一部分都和题目有关，提纲也可能出错：如果详写落在只是引出事情的部分上，比如天气，最能表现中心的部分就写不充分了。",
            ),
          ),
          choiceTopicGenerator(centredChoices, CENTRED_HEADS),
        ),
        point(
          "planning-7-outline-order",
          t("The Parts in Order", "排好提纲的顺序"),
          explanation(
            t(
              "Decide which kind of order the piece follows, time, place, the steps of a task, or the course of a feeling, and find the part that must come first. Then each part follows from the one before.",
              "先想好文章按哪种顺序写：时间、空间、做事的步骤，还是感情的变化；找出必须放在最前面的部分，再让每一部分都接着上一部分。",
            ),
            t(
              "Planting beans goes by time: soak the beans, sow them, the shoots come up, the pods are picked. Each step needs the one before it.",
              "比如种豆子按时间顺序：泡豆子，播种，出苗，摘豆荚。每一步都要先有前一步。",
            ),
            t(
              "A part that explains or follows another, a reason, a result, a feeling, cannot be put before what it explains: the reader would not yet know what it is about.",
              "解释另一部分的、或者由另一部分引出的内容，比如原因、结果、感受，不能放在它所说的那部分前面：读的人还不知道它说的是什么。",
            ),
          ),
          choiceTopicGenerator(orderedChoices, ORDERED_HEADS),
        ),
      ],
    },
  },
];
