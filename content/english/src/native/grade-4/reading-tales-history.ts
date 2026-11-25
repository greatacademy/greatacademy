// Grade 4: the reading units of tall tales and tricksters, life in the Middle Ages and the Silk Road.

import { type ReadingUnitDef, t } from "@ga/content";
import { edge, passage, q } from "./reading-kit.ts";

const tall = edge("words-of-tall-tales");
const tricks = edge("words-for-tricks-and-tricksters");
const retelling = edge("words-for-retelling");
const size = edge("words-for-size-and-strength");
const pattern = edge("same-pattern-different-cultures", 0.3);
const motives = edge("why-characters-act", 0.3);
const summary = edge("summarizing-a-story", 0.3);
const castles = edge("words-of-castles-and-knights");
const towns = edge("words-of-medieval-towns-and-villages");
const power = edge("words-for-rules-and-power");
const silk = edge("words-of-the-silk-road");
const trade = edge("words-for-trade-and-travel");
const ideas = edge("words-for-sharing-ideas-and-beliefs");
const support = edge("how-authors-support-points", 0.3);
const chains = edge("cause-and-effect-chains", 0.3);
const academic1 = edge("academic-words-1");
const details = edge("supporting-details", 0.3);

/** talesUnit is the reading unit of tall tales and trickster tales. */
export const talesUnit: ReadingUnitDef = {
  id: "tall-tales-and-tricksters",
  title: t("Tall Tales and Tricksters", "荒诞故事与机智的捣蛋鬼"),
  passages: [
    passage(
      "the-girl-who-lassoed-a-tornado",
      ["The Girl Who Lassoed a Tornado", "用套索套住龙卷风的女孩"],
      `On the dusty plains of Texas lived a girl named Daisy Dawes, who could throw a rope better than any cowhand alive. By the age of five, she could lasso a jackrabbit on the run. By ten, she could rope a whole herd of cattle with a single throw and tie them up in a bow.

      One summer afternoon, the sky turned green, and a giant tornado came spinning across the prairie. It tore up fences, swallowed a barn and sucked the water right out of the creek. The cowhands dove into the ditches, but Daisy just shook out her rope.

      She swung it three times around her head and sent it sailing. The loop dropped over the top of the tornado and pulled tight. The twister bucked and kicked like a wild horse, but Daisy held on. She rode it all the way to New Mexico and back, and by sundown it was as tame as a kitten.

      Daisy led it home and set it to work. Every afternoon it spun the windmills and swept the dust off the town. And that is why, to this day, the wind blows across Texas every single afternoon.`,
      [tall, size],
      [
        q(
          ["Which detail shows that Daisy's skill is exaggerated?", "哪个细节表明戴西的本领被夸大了？"],
          ["She could rope a whole herd with one throw", "她一次就能套住一整群牛"],
          [
            ["She lived on the plains of Texas", "她住在得克萨斯州的平原上"],
            ["The cowhands hid in the ditches", "牛仔们躲进了沟里"],
            ["The sky turned green on one summer afternoon", "一个夏日午后天空变绿了"],
          ],
          [
            "Roping a whole herd with a single throw is far beyond what a real person could do; that is the exaggeration of a tall tale.",
            "一次就套住一整群牛远远超出了真人的能力，这就是荒诞故事的夸张。",
          ],
          [
            ["Living in Texas is an ordinary fact, not an exaggeration.", "住在德州是普通的事实，不是夸张。"],
            ["Cowhands hiding in ditches is what real people might do.", "牛仔躲进沟里是真人也会做的事。"],
            ["A green sky before a storm is a real weather sign, not a stretch.", "暴风雨前天变绿是真实的天气迹象，不是夸张。"],
          ],
        ),
        q(
          ["What does the tornado do after Daisy tames it?", "戴西驯服龙卷风之后，它做了什么？"],
          ["It spins the windmills and sweeps the town", "它转动风车，清扫小镇"],
          [
            ["It swallows a barn and the creek", "它吞掉了谷仓和小溪"],
            ["It carries Daisy away to New Mexico", "它把戴西带去新墨西哥州"],
            ["It turns into a wild horse", "它变成了一匹野马"],
          ],
          [
            "The last paragraph says that every afternoon the tamed tornado spun the windmills and swept the dust off the town.",
            "最后一段说，被驯服的龙卷风每天下午转动风车，扫去小镇的尘土。",
          ],
          [
            ["Swallowing a barn is what it did before she tamed it.", "吞掉谷仓是她驯服它之前的事。"],
            ["Riding to New Mexico was how she tamed it, not after.", "骑到新墨西哥是驯服它的过程，不是之后。"],
            ["Turning into a horse is wrong. It only bucked like one.", "变成马不对。它只是像马一样乱蹦。"],
          ],
        ),
        q(
          ["What does the ending of the tale explain?", "这个故事的结尾解释了什么？"],
          ["Why the wind blows across Texas every afternoon", "为什么得克萨斯每天下午都刮风"],
          [
            ["Why tornadoes turn the sky green", "为什么龙卷风会让天空变绿"],
            ["Why cowhands use ropes", "为什么牛仔要用绳子"],
            ["Why there are so many creeks across the prairie", "为什么草原上有这么多小溪"],
          ],
          [
            "The last sentence says that this is why the wind blows across Texas every single afternoon, an ending that explains something in nature.",
            "最后一句说，这就是得克萨斯每天下午都刮风的原因，这是一个解释自然现象的结尾。",
          ],
          [
            ["A green sky is in the story, but the ending does not explain it.", "天变绿在故事里，但结尾没解释它。"],
            ["Cowhands' ropes are not what the ending explains.", "牛仔的绳子不是结尾要解释的。"],
            ["Creeks are not what the ending explains.", "小溪不是结尾要解释的。"],
          ],
        ),
        q(
          ["What color did the sky turn before the tornado came?", "龙卷风来之前天空变成了什么颜色？"],
          ["Green", "绿色"],
          [
            ["Red", "红色"],
            ["Black", "黑色"],
            ["Yellow", "黄色"],
          ],
          [
            "The tale says the sky turned green, and a giant tornado came spinning across the prairie.",
            "故事说天空变绿了，一股巨大的龙卷风旋转着穿过草原。",
          ],
          [
            ["Red is not named.", "文中没说红色。"],
            ["Black is not named.", "文中没说黑色。"],
            ["Yellow is not named.", "文中没说黄色。"],
          ],
        ),
      ],
      { names: ["Daisy", "Dawes", "Texas", "Mexico"] },
    ),
    passage(
      "the-lumberjack-who-combed-the-forest",
      ["The Lumberjack Who Combed the Forest", "给森林梳头的伐木工"],
      `Big Ole Larsen was the largest lumberjack who ever lived. When he was a baby, it took six geese to carry him to his mother. As a boy, he used a wagon wheel for a dinner plate and a rowboat for a soup bowl. By the time he was grown, his head brushed the clouds, and eagles nested in his beard.

      Ole worked in the great north woods, where the trees grew so thick that sunlight could not get through. One spring, the trees had grown so tangled that the deer could not walk between them and the rivers could not find their way to the sea.

      Ole thought for a while. Then he pulled a giant comb out of his pocket, one he had made from the jawbone of a whale, and began to comb the forest. He combed from the mountains to the lakes, untangling the trees and lining them up in neat rows. Wherever the comb passed, it left a long, straight line through the woods.

      The deer were grateful, and the rivers ran free. And those straight lines are still there today. People call them valleys, and the rivers run along them to the sea.`,
      [tall, size],
      [
        q(
          ["Why did Ole decide to comb the forest?", "奥勒为什么决定给森林梳头？"],
          ["Deer and rivers could not get through the tangled trees", "树太乱，鹿和河流都过不去"],
          [
            ["He wanted to make a comb from a whale", "他想用鲸鱼做一把梳子"],
            ["The eagles asked him to tidy their nests", "老鹰请他整理它们的巢"],
            ["He needed wood from the trees to make a new dinner plate", "他需要树上的木头做新的餐盘"],
          ],
          [
            "The second paragraph says the trees had grown so tangled that the deer could not walk and the rivers could not reach the sea.",
            "第二段说，树缠得太乱，鹿走不过去，河流也到不了大海。",
          ],
          [
            ["Making a comb is how he solved it, not why.", "做梳子是他解决的办法，不是原因。"],
            ["Eagles asking him is not in the tale. They only nested in his beard.", "老鹰请他帮忙故事里没有。它们只是在他胡子里筑巢。"],
            ["A new dinner plate is wrong. He used a wagon wheel as a boy.", "新餐盘不对。他小时候用的是车轮。"],
          ],
        ),
        q(
          ["Which detail is an exaggeration of Ole's size?", "哪个细节夸大了奥勒的身材？"],
          ["Eagles nested in his beard", "老鹰在他的胡子里筑巢"],
          [
            ["He worked in the north woods", "他在北方的森林里工作"],
            ["He thought for a while", "他想了一会儿"],
            ["The deer were grateful", "鹿很感激"],
          ],
          [
            "Only a man as tall as the clouds could have eagles nesting in his beard; the other details could be true of anyone.",
            "只有像云一样高的人，胡子里才会有老鹰筑巢；其他细节放在任何人身上都可能是真的。",
          ],
          [
            ["Working in the north woods is an ordinary detail.", "在北方森林干活是普通的细节。"],
            ["Thinking for a while is something anyone does.", "想了一会儿是谁都会做的事。"],
            ["Grateful deer are not about his size.", "感激的鹿和他的个子无关。"],
          ],
        ),
        q(
          ["According to the tale, what are the straight lines Ole's comb left?", "根据故事，奥勒的梳子留下的直线是什么？"],
          ["Valleys where rivers run", "河流流经的山谷"],
          [
            ["Roads for the lumberjacks", "伐木工走的路"],
            ["Rows of new trees", "一排排新树"],
            ["Paths for the deer", "鹿走的小路"],
          ],
          [
            "The last paragraph says people call the straight lines valleys, and the rivers run along them to the sea.",
            "最后一段说，人们把这些直线叫作山谷，河流沿着它们流向大海。",
          ],
          [
            ["Roads for lumberjacks are not in the tale.", "伐木工的路故事里没有。"],
            ["Rows of trees are what he lined up, not the lines left.", "一排排树是他排整齐的，不是留下的线。"],
            ["Paths for deer are not what the tale calls them.", "鹿走的小路不是故事里的说法。"],
          ],
        ),
        q(
          ["What was Ole's comb made from?", "奥勒的梳子是用什么做的？"],
          ["The jawbone of a whale", "鲸的颌骨"],
          [
            ["A wagon wheel", "一个车轮"],
            ["A tall pine tree", "一棵高大的松树"],
            ["Eagle feathers", "鹰的羽毛"],
          ],
          ["He pulled out a giant comb he had made from the jawbone of a whale.", "他掏出一把用鲸的颌骨做成的巨梳。"],
          [
            ["A wagon wheel was his dinner plate.", "车轮是他的餐盘。"],
            ["A pine tree is not what the comb was made of.", "松树不是做梳子的材料。"],
            ["Eagle feathers are not in the tale. Eagles nested in his beard.", "鹰的羽毛故事里没有。老鹰在他胡子里筑巢。"],
          ],
        ),
      ],
      { names: ["Ole", "Larsen"] },
    ),
    passage(
      "the-fastest-mail-carrier-in-the-west",
      ["The Fastest Mail Carrier in the West", "西部最快的邮差"],
      `In the days before trains and telephones, the only way to send a letter across the West was by horse. Most riders took ten days to carry the mail from one side of the territory to the other. Then along came Lightning Lou.

      Lou was so fast that she did not need a horse at all. She could run the whole route in a single morning and be back in time for lunch. She ran so fast that the letters in her bag arrived before the ink had dried, and sometimes before they had been written.

      One winter, a terrible blizzard blocked every trail. A doctor in a far-off town needed medicine, and no rider could get through. Lou tied the package to her back and set off. She ran so fast that the snow melted under her boots, and she left a trail of warm, green grass behind her through the white hills.

      She reached the town before the doctor had finished asking for help. The medicine saved a whole family. And the green trail she left is still there. In spring it is the first grass to grow, and people call it Lightning Lou's Road.`,
      [tall, retelling],
      [
        q(
          ["How long did most riders take to carry the mail across the territory?", "大多数骑手要多久才能把邮件送过这片地区？"],
          ["Ten days", "十天"],
          [
            ["A single morning", "一个上午"],
            ["Until lunch", "到午饭时"],
            ["One winter", "一个冬天"],
          ],
          [
            "The first paragraph says most riders took ten days; Lou ran the whole route in a single morning.",
            "第一段说，大多数骑手要十天；卢一个上午就能跑完全程。",
          ],
          [
            ["A single morning was how fast Lou ran.", "一个上午是露跑的速度。"],
            ["Until lunch is Lou's time again, not the riders'.", "到午饭前又是露的时间，不是骑手的。"],
            ["One winter is when the blizzard came.", "一个冬天是暴风雪来的时候。"],
          ],
        ),
        q(
          ["Why did Lou set off in the blizzard?", "卢为什么要在暴风雪中出发？"],
          ["A doctor needed medicine and no rider could get through", "一位医生需要药，骑手都过不去"],
          [
            ["She wanted to melt the snow on the hills", "她想融化山上的雪"],
            ["Her horse had run away in the storm", "她的马在风暴中跑了"],
            ["The letters in her bag had to arrive before they were written", "她包里的信必须在写好之前送到"],
          ],
          [
            "The third paragraph says a doctor needed medicine, and no rider could get through the blizzard.",
            "第三段说，一位医生需要药，而暴风雪中没有骑手能通过。",
          ],
          [
            ["Melting the snow was a result, not her reason.", "融化雪是结果，不是她的原因。"],
            ["A runaway horse is wrong. Lou never needed a horse.", "马跑掉了不对。露从来不需要马。"],
            ["Letters arriving early is a joke about her speed, not why she went.", "信提前到是夸她速度的玩笑，不是她出发的原因。"],
          ],
        ),
        q(
          ["Which sentence best sums up the tale?", "哪一句最能概括这个故事？"],
          [
            "A runner faster than any horse carries medicine through a blizzard and leaves a green trail",
            "一个比马还快的跑者冒着暴风雪送药，留下一条绿色的小路",
          ],
          [
            [
              "A doctor in a far-off town saves a whole family with medicine that arrives in the middle of a blizzard",
              "偏远小镇的一位医生在暴风雪中用送到的药救了一家人",
            ],
            ["Trains and telephones replace the mail riders", "火车和电话取代了邮差骑手"],
            ["A blizzard blocks every trail in the West", "暴风雪堵住了西部的每条小路"],
          ],
          [
            "A good summary names the hero, her feat and the ending; the other options give only one detail.",
            "好的概括要说出主人公、她的壮举和结局；其他选项只说了一个细节。",
          ],
          [
            ["The doctor's family is one part, without Lou or her trail.", "医生的家人只是一部分，没讲露和她的路。"],
            ["Trains replacing riders is not in the tale.", "火车取代骑手故事里没有。"],
            ["The blizzard is only the problem, not the whole tale.", "暴风雪只是问题，不是整个故事。"],
          ],
        ),
        q(
          ["What happened to the snow under Lou's boots?", "卢的靴子下面的雪怎样了？"],
          ["It melted", "融化了"],
          [
            ["It froze harder", "冻得更硬了"],
            ["It turned into ice", "变成了冰"],
            ["It piled up behind her", "在她身后堆了起来"],
          ],
          ["She ran so fast that the snow melted under her boots.", "她跑得太快，靴子下面的雪都融化了。"],
          [
            ["Freezing harder is backwards.", "冻得更硬是反的。"],
            ["Turning to ice is backwards. Green grass grew.", "结成冰是反的。长出了绿草。"],
            ["Piling up behind her is wrong. She left a trail of grass.", "在她身后堆起来不对。她留下的是一条草路。"],
          ],
        ),
      ],
      { names: ["Lou", "Lou's", "West"] },
    ),
    passage(
      "spider-and-the-sky-kings-stories",
      ["Spider and the Sky King's Stories", "蜘蛛和天王的故事"],
      `Long ago, the people of the world had no stories. All the stories belonged to the Sky King, who kept them in a golden box beside his throne. Spider, who was small but clever, wanted them for everyone.

      Spider climbed his silver thread up to the sky. "What price will you take for your stories?" he asked.

      The Sky King laughed. "Bring me three things: the hornets that sting like fire, the python that is longer than a river, and the leopard with teeth like knives. Then the stories are yours." He was sure the little spider would fail.

      Spider went to the hornets with a gourd of water and splashed it over their nest. "It's raining!" he called. "Hide in my dry gourd!" They flew in, and he plugged it shut. Next he told the python, "Your wife says you are shorter than this branch." The proud python stretched out along it to prove her wrong, and Spider tied him to it. Last, he dug a deep pit on the leopard's path, and the leopard fell in.

      The Sky King could hardly believe it. He kept his word and handed over the box. Spider carried it down and shared the stories with everyone, and that is why stories are told all over the world.`,
      [tricks, motives],
      [
        q(
          ["Why did Spider want the Sky King's stories?", "蜘蛛为什么想要天王的故事？"],
          ["He wanted them for everyone", "他想把故事给所有人"],
          [
            ["He wanted to sell them to the leopard", "他想把故事卖给豹子"],
            ["He wanted to sit on the throne", "他想坐上王座"],
            ["He wanted a golden box of his own", "他想要一个自己的金盒子"],
          ],
          [
            "The first paragraph says Spider, who was small but clever, wanted the stories for everyone.",
            "第一段说，蜘蛛个子小但很聪明，他想把故事给所有人。",
          ],
          [
            ["Selling to the leopard is not in the tale.", "卖给豹子故事里没有。"],
            ["Sitting on the throne is not in the tale.", "坐上王位故事里没有。"],
            ["A golden box of his own is wrong. He shared the stories.", "自己要金盒子不对。他把故事分享给大家了。"],
          ],
        ),
        q(
          ["How did Spider trick the python?", "蜘蛛是怎样骗过蟒蛇的？"],
          ["He used the python's pride to make it stretch along a branch", "他利用蟒蛇的骄傲，让它沿树枝伸直"],
          [
            ["He splashed water over its nest", "他往它的窝上泼水"],
            ["He dug a deep pit on its path", "他在它的路上挖了深坑"],
            ["He offered it a dry gourd to hide in when he said it was raining", "他说下雨了，给它一个干葫芦躲进去"],
          ],
          [
            "The fifth paragraph says Spider told the proud python it was shorter than a branch, so it stretched out to prove it wrong and was tied up.",
            "第五段说，蜘蛛说骄傲的蟒蛇比树枝还短，它就伸直身子要证明不是这样，结果被绑住了。",
          ],
          [
            ["Splashing water was the trick for the hornets.", "泼水是对付马蜂的计策。"],
            ["The pit was for the leopard.", "陷阱是对付豹子的。"],
            ["The dry gourd was for the hornets.", "干葫芦是给马蜂的。"],
          ],
        ),
        q(
          ["Why did the Sky King set such hard tasks?", "天王为什么出这么难的任务？"],
          ["He was sure the little spider would fail", "他确信小蜘蛛会失败"],
          [
            ["He wanted to share the stories too", "他也想分享故事"],
            ["He was afraid of the leopard", "他害怕豹子"],
            ["He needed the hornets for honey", "他需要黄蜂来产蜜"],
          ],
          [
            "The third paragraph says the Sky King laughed and was sure the little spider would fail.",
            "第三段说，天王笑了，他确信小蜘蛛会失败。",
          ],
          [
            ["Sharing the stories is wrong. The King kept them in his box.", "分享故事不对。天王把故事锁在盒子里。"],
            ["Fear of the leopard is not in the tale.", "怕豹子故事里没有。"],
            ["Honey is not in the tale.", "蜂蜜故事里没有。"],
          ],
        ),
        q(
          ["How did Spider catch the leopard?", "蜘蛛怎样抓住了豹子？"],
          ["He dug a deep pit on its path", "他在它的路上挖了一个深坑"],
          [
            ["He tied it to a branch", "他把它绑在树枝上"],
            ["He trapped it in a gourd", "他把它关在葫芦里"],
            ["He splashed water on it", "他往它身上泼水"],
          ],
          ["Last, he dug a deep pit on the leopard's path, and the leopard fell in.", "最后，他在豹子的路上挖了个深坑，豹子掉了进去。"],
          [
            ["Tying to a branch was the python.", "绑在树枝上的是蟒蛇。"],
            ["Trapping in a gourd was the hornets.", "关进葫芦的是马蜂。"],
            ["Splashing water was also for the hornets.", "泼水也是对付马蜂的。"],
          ],
        ),
      ],
      { names: ["Spider", "Sky King", "Sky King's"] },
    ),
    passage(
      "rabbit-and-the-foxs-dinner",
      ["Rabbit and the Fox's Dinner", "兔子和狐狸的晚餐"],
      `Fox had been trying to catch Rabbit all summer, and Rabbit had slipped away every time. So Fox came up with a plan. He invited Rabbit to dinner.

      "Come over tonight," said Fox with a toothy smile. "I am making a wonderful carrot stew."

      Rabbit was no fool. He knew that the only thing Fox wanted for dinner was a rabbit. But he also knew that if he refused, Fox would only try something else. So Rabbit said, "Thank you kindly. I will come at sunset."

      At sunset, Rabbit crept up to Fox's house and peeked through the window. There was no stew on the stove, only an empty pot and a big wooden spoon. Fox was hiding behind the door.

      Rabbit called through the window, "Fox! I am so sorry I am late. I met a hunter with his dogs on the road, and he asked me where you live. I told him I did not know, but he is coming this way."

      Fox leaped out of the back door and ran into the hills without looking back. Rabbit hopped into the kitchen, filled the empty pot with fresh carrots from Fox's garden and ate the finest stew of the summer.`,
      [tricks, motives],
      [
        q(
          ["Why did Fox invite Rabbit to dinner?", "狐狸为什么请兔子吃晚饭？"],
          ["He wanted to catch and eat Rabbit", "他想抓住兔子吃掉"],
          [
            ["He wanted to share his carrot stew", "他想分享他的胡萝卜炖菜"],
            ["He wanted to say sorry to Rabbit", "他想向兔子道歉"],
            ["He was afraid of the hunter", "他害怕猎人"],
          ],
          [
            "The third paragraph says Rabbit knew the only thing Fox wanted for dinner was a rabbit.",
            "第三段说，兔子知道狐狸晚餐唯一想吃的就是兔子。",
          ],
          [
            ["Sharing stew is what Fox said, not what he wanted.", "分享炖菜是狐狸嘴上说的，不是他真想的。"],
            ["Saying sorry is not in the tale.", "道歉故事里没有。"],
            ["Fear of the hunter came later, from Rabbit's trick.", "怕猎人是后来兔子用计吓的。"],
          ],
        ),
        q(
          ["Why did Rabbit accept the invitation?", "兔子为什么接受了邀请？"],
          ["If he refused, Fox would only try something else", "如果他拒绝，狐狸只会换别的办法"],
          [
            ["He believed that Fox was his friend", "他相信狐狸是他的朋友"],
            ["He was very hungry for stew", "他很想吃炖菜"],
            ["He wanted to meet the hunter", "他想见那个猎人"],
          ],
          [
            "The third paragraph says Rabbit knew that if he refused, Fox would only try something else.",
            "第三段说，兔子知道，如果他拒绝，狐狸只会换别的办法。",
          ],
          [
            ["Believing Fox was a friend is wrong. Rabbit was no fool.", "相信狐狸是朋友不对。兔子可不傻。"],
            ["Hunger for stew is not the reason given.", "想喝炖菜不是文中给的原因。"],
            ["Meeting a hunter is wrong. The hunter was made up.", "想见猎人不对。猎人是编出来的。"],
          ],
        ),
        q(
          ["How did Rabbit trick Fox?", "兔子是怎样骗过狐狸的？"],
          ["He said a hunter with dogs was coming", "他说带狗的猎人要来了"],
          [
            ["He hid behind the door with a spoon", "他拿着勺子躲在门后"],
            ["He brought a pot of poisoned stew", "他带来了一锅有毒的炖菜"],
            ["He locked Fox inside the kitchen", "他把狐狸锁在厨房里"],
          ],
          [
            "The fifth paragraph shows Rabbit telling Fox that a hunter with dogs was asking where Fox lived and was coming that way.",
            "第五段写兔子告诉狐狸，一个带狗的猎人在打听狐狸住在哪里，正往这边来。",
          ],
          [
            ["Hiding behind the door is what Fox did.", "躲在门后的是狐狸。"],
            ["Poisoned stew is not in the tale.", "有毒的炖菜故事里没有。"],
            ["Locking Fox in is wrong. Fox ran out the back.", "把狐狸锁在里面不对。狐狸从后门跑了。"],
          ],
        ),
        q(
          ["What did Rabbit see through the window?", "兔子从窗户里看到了什么？"],
          ["An empty pot and a big wooden spoon", "一口空锅和一把大木勺"],
          [
            ["A pot of carrot stew", "一锅胡萝卜炖菜"],
            ["A hunter with dogs", "一个带着狗的猎人"],
            ["Fox asleep in bed", "狐狸睡在床上"],
          ],
          ["There was no stew on the stove, only an empty pot and a big wooden spoon.", "炉子上没有炖菜，只有一口空锅和一把大木勺。"],
          [
            ["Stew is wrong. The pot was empty.", "炖菜不对。锅是空的。"],
            ["A hunter is only in Rabbit's made-up story.", "猎人只在兔子编的话里。"],
            ["Fox asleep is wrong. He was hiding behind the door.", "狐狸睡着了不对。他躲在门后面。"],
          ],
        ),
      ],
      { names: ["Fox", "Rabbit", "Fox's"] },
    ),
    passage(
      "monkey-makes-trouble-in-heaven",
      ["Monkey Makes Trouble in Heaven", "猴王大闹天宫"],
      `Long ago, a monkey was born from a stone on a mountain by the sea. He was bold and clever, and he soon became king of all the monkeys. He learned magic from a wise teacher: he could change into seventy-two different shapes and leap across the sky on a cloud.

      The Jade Emperor, who ruled heaven, heard about this troublesome monkey and invited him up to heaven to keep him out of mischief. He gave Monkey a job looking after the heavenly horses. When Monkey found out that this was one of the lowest jobs in heaven, he was furious. He kicked over his desk and flew home.

      Next, the Emperor put him in charge of the Peach Garden, where the peaches of long life grew. But Monkey ate the finest peaches himself, then crashed a royal feast and gobbled up the food and wine meant for the guests.

      The armies of heaven could not catch him, so the Emperor asked the Buddha for help. The Buddha made Monkey a bet: "If you can leap out of my hand, you may rule heaven." Monkey leaped and leaped until he reached five great pillars at the end of the world. But when he came back, he saw that the pillars were the Buddha's fingers. He had never left the Buddha's palm.`,
      [tricks, pattern],
      [
        q(
          ["Why was Monkey furious about his first job in heaven?", "猴王为什么对他在天宫的第一份工作很生气？"],
          ["It was one of the lowest jobs in heaven", "那是天宫里最低微的差事之一"],
          [
            ["The horses kicked over his desk", "马踢翻了他的桌子"],
            ["He was not allowed to eat peaches", "他不被允许吃桃子"],
            ["The Buddha had made him a bet", "佛祖和他打了个赌"],
          ],
          [
            "The second paragraph says Monkey was furious when he found out that looking after the horses was one of the lowest jobs in heaven.",
            "第二段说，猴王发现看管天马是天宫里最低微的差事之一时，非常生气。",
          ],
          [
            ["Horses kicking the desk is wrong. Monkey kicked it.", "马踢翻桌子不对。是猴子踢的。"],
            ["Not being allowed peaches came later, in the Peach Garden.", "不让吃桃是后来在蟠桃园的事。"],
            ["The Buddha's bet came at the end.", "佛祖的赌约在最后。"],
          ],
        ),
        q(
          ["What did Monkey do in the Peach Garden?", "猴王在蟠桃园里做了什么？"],
          ["He ate the finest peaches himself", "他自己吃掉了最好的桃子"],
          [
            ["He planted new peach trees", "他种了新的桃树"],
            ["He guarded the peaches for the Emperor", "他为玉帝看守桃子"],
            ["He gave the peaches to the monkeys", "他把桃子给了猴子们"],
          ],
          [
            "The third paragraph says Monkey ate the finest peaches himself, then crashed a royal feast.",
            "第三段说，猴王自己吃掉了最好的桃子，然后又大闹了一场御宴。",
          ],
          [
            ["Planting trees is not in the tale.", "种桃树故事里没有。"],
            ["Guarding the peaches was his job, but he did not do it.", "看守桃子是他的工作，但他没做到。"],
            ["Giving peaches to monkeys is not in the tale.", "把桃子分给猴子们故事里没有。"],
          ],
        ),
        q(
          ["What did Monkey learn at the end of the tale?", "故事结尾，猴王发现了什么？"],
          ["He had never left the Buddha's palm", "他根本没有离开佛祖的手掌"],
          [
            ["He could rule heaven after all", "他终究可以统治天宫"],
            ["The pillars were made of stone", "那些柱子是石头做的"],
            ["The armies of heaven had caught him", "天兵抓住了他"],
          ],
          [
            "The last paragraph says the pillars were the Buddha's fingers, so Monkey had never left the Buddha's palm.",
            "最后一段说，那些柱子是佛祖的手指，所以猴王根本没有离开佛祖的手掌。",
          ],
          [
            ["Ruling heaven is wrong. He lost the bet.", "统治天庭不对。他输了赌约。"],
            ["Stone pillars is wrong. They were fingers.", "石头柱子不对。它们是手指。"],
            ["Being caught by armies is wrong. The armies could not catch him.", "被天兵抓住不对。天兵抓不到他。"],
          ],
        ),
        q(
          ["How many shapes could Monkey change into?", "猴子能变成多少种样子？"],
          ["Seventy-two", "七十二种"],
          [
            ["Five", "五种"],
            ["Twelve", "十二种"],
            ["One hundred", "一百种"],
          ],
          ["He could change into seventy-two different shapes.", "他能变成七十二种不同的样子。"],
          [
            ["Five is the number of pillars.", "五是柱子的数量。"],
            ["Twelve is not in the tale.", "十二故事里没有。"],
            ["One hundred is not in the tale.", "一百故事里没有。"],
          ],
        ),
      ],
      { names: ["Monkey", "Jade Emperor", "Emperor", "Peach Garden", "Buddha", "Buddha's"] },
    ),
    passage(
      "coyote-brings-the-summer",
      ["Coyote Brings the Summer", "郊狼带来夏天"],
      `Long ago, it was winter all year round. Snow covered the hills, the rivers were frozen, and the animals were always cold and hungry. Coyote, who was clever and always curious, heard a rumor that an old woman far to the north kept summer hidden in a leather bag.

      Coyote gathered his friends: Eagle, who could fly the highest, Deer, who could run the fastest, and Turtle, who was slow but steady. Together they traveled north to the old woman's lodge.

      Coyote went in alone and made the old woman laugh with his jokes until she fell asleep by the fire. Then he grabbed the bag and ran. The old woman woke up and chased him. Just as she was about to catch him, Coyote threw the bag to Eagle, who carried it high over the mountains. When Eagle grew tired, he dropped it to Deer, who raced across the plains with it. At last Deer passed it to Turtle, who hid it in his shell and crawled slowly home.

      When Turtle opened the bag, warm air poured out. The snow melted, and the rivers ran again. But the old woman still wants summer back, so every year she takes it home for a while. That is why winter still comes.`,
      [tricks, pattern],
      [
        q(
          ["How did Coyote get the bag from the old woman?", "郊狼是怎样从老妇人那里拿到袋子的？"],
          ["He made her laugh until she fell asleep, then grabbed it", "他逗她笑到睡着，然后抢走袋子"],
          [
            ["He traded his jokes for the bag", "他用笑话换了袋子"],
            ["He asked her for it politely", "他礼貌地向她讨要"],
            ["Eagle flew in and stole it", "老鹰飞进去偷走了它"],
          ],
          [
            "The third paragraph says Coyote made the old woman laugh until she fell asleep by the fire, then grabbed the bag and ran.",
            "第三段说，郊狼逗老妇人笑，直到她在火边睡着，然后抓起袋子就跑。",
          ],
          [
            ["Trading jokes for the bag is wrong. The jokes put her to sleep.", "用笑话换袋子不对。笑话是让她睡着。"],
            ["Asking politely is not in the tale.", "礼貌地要故事里没有。"],
            ["Eagle stealing it is wrong. Coyote went in alone.", "老鹰偷走不对。土狼是一个人进去的。"],
          ],
        ),
        q(
          ["In what order did the animals carry the bag?", "动物们是按什么顺序传递袋子的？"],
          ["Coyote, Eagle, Deer, then Turtle", "郊狼、老鹰、鹿，然后是乌龟"],
          [
            ["Eagle, Coyote, Turtle, then Deer", "老鹰、郊狼、乌龟，然后是鹿"],
            ["Coyote, Deer, Eagle, then Turtle", "郊狼、鹿、老鹰，然后是乌龟"],
            ["Turtle, Deer, Eagle, then Coyote", "乌龟、鹿、老鹰，然后是郊狼"],
          ],
          [
            "The third paragraph says Coyote threw the bag to Eagle, Eagle dropped it to Deer, and Deer passed it to Turtle.",
            "第三段说，郊狼把袋子扔给老鹰，老鹰丢给鹿，鹿再传给乌龟。",
          ],
          [
            ["Eagle first is wrong. Coyote grabbed it first.", "老鹰第一不对。土狼最先抓到袋子。"],
            ["Deer before Eagle is wrong. Eagle carried it over the mountains first.", "鹿在老鹰前面不对。老鹰先带它飞过山。"],
            ["Turtle first is backwards. Turtle was last.", "乌龟第一是反的。乌龟是最后一个。"],
          ],
        ),
        q(
          ["What does the tale explain at the end?", "这个故事在结尾解释了什么？"],
          ["Why winter still comes every year", "为什么每年仍然有冬天"],
          [
            ["Why turtles have hard shells", "为什么乌龟有硬壳"],
            ["Why eagles fly so high", "为什么老鹰飞得那么高"],
            ["Why coyotes tell jokes", "为什么郊狼会讲笑话"],
          ],
          [
            "The last paragraph says the old woman takes summer home for a while each year, and that is why winter still comes.",
            "最后一段说，老妇人每年都把夏天拿回去一阵子，所以冬天仍然会来。",
          ],
          [
            ["Turtle shells are in the tale but not explained.", "乌龟壳在故事里，但没被解释。"],
            ["Eagles flying high is a fact used, not explained.", "老鹰飞得高是用到的事实，不是被解释的。"],
            ["Coyote's jokes are not what the ending explains.", "土狼讲笑话不是结尾要解释的。"],
          ],
        ),
      ],
      { names: ["Coyote", "Eagle", "Deer", "Turtle"] },
    ),
    passage(
      "the-biggest-pumpkin-in-iowa",
      ["The Biggest Pumpkin in Iowa", "艾奥瓦州最大的南瓜"],
      `Farmer Hattie Mae planted a single pumpkin seed one spring morning in Iowa. By lunchtime, a vine had shot up out of the ground. By supper, it had wrapped itself twice around the barn. By the next morning, there was a pumpkin in the field as big as a hay wagon.

      It kept growing. In a week it was as big as the farmhouse, and the chickens moved inside it to roost. In a month, it was so big that it blocked the sun from the whole valley, and the neighbors had to light their lamps at noon.

      Everyone had an idea. The mayor wanted to carve it into a town hall. The children wanted to roll it down the hill. Hattie Mae just sharpened her biggest knife and cut a door in the side.

      She threw the biggest pie party Iowa had ever seen. Every family brought a pie dish, and she filled them all. There was so much pie that people ate it for breakfast, lunch and dinner until spring. When the last slice was gone, Hattie Mae used the empty shell as a barn. They say the cows inside it give the sweetest milk in the state.`,
      [tall, summary],
      [
        q(
          ["How big was the pumpkin after a week?", "一周后南瓜有多大？"],
          ["As big as the farmhouse", "和农舍一样大"],
          [
            ["As big as a hay wagon", "和运干草的马车一样大"],
            ["As big as the whole valley", "和整个山谷一样大"],
            ["As big as a pie dish", "和派盘一样大"],
          ],
          [
            "The second paragraph says that in a week the pumpkin was as big as the farmhouse; it was as big as a hay wagon after one night.",
            "第二段说，一周后南瓜和农舍一样大；一夜之后它和运干草的马车一样大。",
          ],
          [
            ["A hay wagon was its size the first morning.", "干草车是第一天早上的大小。"],
            ["The whole valley was in shadow after a month.", "一个月后整个山谷都被遮住了。"],
            ["A pie dish is what families brought.", "派盘是各家带来的。"],
          ],
        ),
        q(
          ["How does the exaggeration in the tale grow?", "故事中的夸张是怎样增长的？"],
          ["The pumpkin grows bigger at each step of time", "南瓜随着时间一步步越长越大"],
          [
            ["The farmer grows taller every day", "农夫每天都长高"],
            ["The neighbors bring bigger pies", "邻居们带来更大的派"],
            ["The vine grows smaller and smaller", "藤蔓越来越小"],
          ],
          [
            "The tale moves from lunchtime to supper to the next morning to a week to a month, and the pumpkin grows bigger each time.",
            "故事从午饭到晚饭，到第二天早上，再到一周、一个月，南瓜每次都变得更大。",
          ],
          [
            ["The farmer growing taller is not in the tale.", "农夫长高故事里没有。"],
            ["Bigger pies are not in the tale.", "更大的派故事里没有。"],
            ["Smaller and smaller is backwards.", "越来越小是反的。"],
          ],
        ),
        q(
          ["Which is the best summary of the tale?", "哪一个是这个故事最好的概括？"],
          [
            "A farmer grows a giant pumpkin and turns it into pies for everyone and a barn",
            "一位农夫种出巨大的南瓜，把它做成大家吃的派，还当了谷仓",
          ],
          [
            ["The chickens move into a pumpkin to roost", "鸡搬进南瓜里栖息"],
            ["The mayor and the children each have a plan for the giant pumpkin in the field", "镇长和孩子们对田里的大南瓜各有打算"],
            ["Pumpkin pie is the best pie in Iowa", "南瓜派是艾奥瓦州最好吃的派"],
          ],
          [
            "A summary gives the beginning, the middle and the end: the pumpkin grows, Hattie Mae makes pies, and the shell becomes a barn.",
            "概括要写出开头、经过和结尾：南瓜长大，哈蒂·梅做派，南瓜壳变成谷仓。",
          ],
          [
            ["Chickens roosting is one small detail.", "鸡在里面栖息是一个小细节。"],
            ["The mayor's and children's plans are only ideas, not what happened.", "镇长和孩子们的计划只是想法，不是结果。"],
            ["Best pie in Iowa is not what the tale says.", "爱荷华最好的派不是故事说的。"],
          ],
        ),
      ],
      { names: ["Hattie", "Mae", "Iowa"] },
    ),
  ],
};

/** middleAgesUnit is the reading unit of life in the Middle Ages. */
export const middleAgesUnit: ReadingUnitDef = {
  id: "life-in-the-middle-ages",
  title: t("Life in the Middle Ages", "中世纪的生活"),
  passages: [
    passage(
      "lords-knights-and-peasants",
      ["Lords, Knights and Peasants", "领主、骑士和农民"],
      `In Europe during the Middle Ages, about a thousand years ago, most people lived in a system called feudalism. It was like a pyramid of promises, with the king at the top and the peasants at the bottom.

      The king owned all the land, but he could not run it alone. So he gave large pieces of it to lords. In return, each lord promised to be loyal to the king and to send knights to fight for him in times of war.

      The lords then gave smaller pieces of land to knights. In return, the knights promised to protect the lord and his land. A knight trained for years to fight on horseback in heavy armor.

      At the bottom were the peasants, who were by far the largest group. Most of them farmed the lord's land. They grew the food, cared for the animals and gave part of every harvest to the lord. In return, the lord let them live on his land and protected them from attack.

      Life was very different depending on where you stood. A lord lived in a stone castle and feasted in a great hall. A peasant family lived in a small hut and worked from sunrise to sunset.`,
      [power, details],
      [
        q(
          ["What did a lord promise the king in return for land?", "领主得到土地后向国王承诺什么？"],
          ["To be loyal and send knights in times of war", "保持忠诚，并在战时派出骑士"],
          [
            ["To build him a stone castle with a great hall", "为他建一座带大厅的石头城堡"],
            ["To farm the land and care for animals", "耕种土地，照料牲畜"],
            ["To train for years in heavy armor", "穿着重甲训练多年"],
          ],
          [
            "The second paragraph says each lord promised to be loyal to the king and to send knights to fight for him in times of war.",
            "第二段说，每个领主都承诺效忠国王，并在战时派骑士为他作战。",
          ],
          [
            ["A castle with a hall is how a lord lived, not his promise.", "带大厅的城堡是领主的生活，不是他的承诺。"],
            ["Farming and animals is what peasants did.", "种地和照看牲畜是农民做的。"],
            ["Training in armor is what knights did.", "穿盔甲训练是骑士做的。"],
          ],
        ),
        q(
          ["What did peasants get from the lord in return for their work?", "农民为领主劳动，得到了什么回报？"],
          ["A place to live and protection from attack", "住的地方和免受攻击的保护"],
          [
            ["Large pieces of land of their own", "属于自己的大片土地"],
            ["Horses and armor for battle", "作战用的马匹和盔甲"],
            ["A seat at every feast in the lord's great hall", "领主大厅里每场宴会的座位"],
          ],
          [
            "The fourth paragraph says the lord let the peasants live on his land and protected them from attack.",
            "第四段说，领主让农民住在他的土地上，并保护他们免受攻击。",
          ],
          [
            ["Land of their own is wrong. They farmed the lord's land.", "自己的土地不对。他们种的是领主的地。"],
            ["Horses and armor belong to knights.", "马和盔甲属于骑士。"],
            ["Feasting is what lords did in the great hall.", "宴饮是领主在大厅里做的事。"],
          ],
        ),
        q(
          ["Why does the author compare feudalism to a pyramid?", "作者为什么把封建制度比作金字塔？"],
          ["Few were at the top, and most were at the bottom", "顶端的人少，大多数人在底部"],
          [
            ["People in the Middle Ages built pyramids for their kings", "中世纪的人为国王建造金字塔"],
            ["The king lived inside a pyramid", "国王住在金字塔里"],
            ["Peasants and lords were equal", "农民和领主地位平等"],
          ],
          [
            "The passage puts the king at the top and says peasants, at the bottom, were by far the largest group, like the wide base of a pyramid.",
            "文章把国王放在顶端，并说底部的农民是人数最多的群体，就像金字塔宽大的底座。",
          ],
          [
            ["Building pyramids is too literal.", "建金字塔太按字面理解了。"],
            ["Living inside a pyramid is too literal.", "住在金字塔里太按字面理解了。"],
            ["Being equal is the opposite. The pyramid shows who stood higher.", "平等正好相反。金字塔显示的是谁的地位高。"],
          ],
        ),
        q(
          ["Who owned all the land under feudalism?", "在封建制度下，谁拥有所有的土地？"],
          ["The king", "国王"],
          [
            ["The lords", "领主"],
            ["The knights", "骑士"],
            ["The peasants", "农民"],
          ],
          [
            'The text says, "The king owned all the land, but he could not run it alone."',
            "短文说：“国王拥有所有的土地，但他无法独自管理。”",
          ],
          [
            ["The lords got pieces from the king.", "领主的土地是国王给的。"],
            ["The knights got smaller pieces from lords.", "骑士从领主那里得到小块土地。"],
            ["The peasants farmed land that was not theirs.", "农民种的地不是他们自己的。"],
          ],
        ),
      ],
      { names: ["Europe", "Middle Ages"], glossed: ["feudalism"] },
    ),
    passage(
      "building-a-castle",
      ["Building a Castle", "建造城堡"],
      `Building a stone castle was a huge job. A large one could take ten years or more, and hundreds of workers. Masons cut and laid the stone, carpenters built wooden frames and roofs, and blacksmiths made tools and nails. Many peasants dug the ground and carried the heavy loads.

      The first step was choosing the right place. A good spot was high, such as the top of a hill or a cliff, so that guards could see enemies coming from far away. Some castles were built beside a river or a lake, which gave them water and made them harder to attack.

      Next came the walls. They were often three meters thick or more, built of stone blocks filled with rubble. Along the top was a narrow walkway with gaps, so archers could shoot while staying behind cover. Tall towers stood at the corners.

      Many castles were circled by a moat, a deep ditch usually filled with water. To reach the gate, visitors had to cross a drawbridge, which could be raised in an instant. Behind it hung the portcullis, a heavy iron gate that slid down to block the entrance.

      Inside the walls stood the keep, the strongest tower, where the lord and his family lived.`,
      [castles, support],
      [
        q(
          ["Why were castles often built on high ground?", "为什么城堡常常建在高处？"],
          ["Guards could see enemies coming from far away", "守卫能远远看到敌人过来"],
          [
            ["It was easier to carry the heavy stone up a hill", "把沉重的石头运上山更容易"],
            ["The ground was softer for digging", "那里的地更软，好挖"],
            ["Peasants lived at the tops of hills", "农民住在山顶"],
          ],
          [
            "The second paragraph says a high spot let guards see enemies coming from far away.",
            "第二段说，在高处守卫能远远看到敌人过来。",
          ],
          [
            ["Carrying stone uphill would be harder, not easier.", "把石头运上山更难，不是更容易。"],
            ["Softer ground is not the reason given.", "地更软不是文中给的原因。"],
            ["Peasants living on hilltops is not in the passage.", "农民住在山顶文中没有。"],
          ],
        ),
        q(
          ["How did the walkway along the top of the walls help defenders?", "城墙顶上的走道怎样帮助守城的人？"],
          ["Archers could shoot while staying behind cover", "弓箭手能躲在掩体后射箭"],
          [
            ["It let visitors reach the gate", "它让来访者能到达城门"],
            ["It held the water that was used to fill the deep moat", "它装着用来灌满深护城河的水"],
            ["It was where the lord lived", "那是领主住的地方"],
          ],
          [
            "The third paragraph says the walkway had gaps so archers could shoot while staying behind cover.",
            "第三段说，走道上有缺口，弓箭手可以躲在掩体后射箭。",
          ],
          [
            ["Visitors reached the gate by the drawbridge.", "访客是通过吊桥到达大门的。"],
            ["Holding water for the moat is not in the passage.", "给护城河蓄水文中没有。"],
            ["The lord lived in the keep.", "领主住在主塔里。"],
          ],
        ),
        q(
          ["What is the keep?", "主堡（keep）是什么？"],
          ["The strongest tower, where the lord lived", "最坚固的塔楼，领主住在那里"],
          [
            ["A deep ditch filled with water", "一条注满水的深沟"],
            ["An iron gate that slid down", "一道能滑落的铁门"],
            ["A bridge that could be raised", "一座可以升起的桥"],
          ],
          [
            "The last paragraph defines the keep as the strongest tower, where the lord and his family lived.",
            "最后一段把主堡定义为最坚固的塔楼，领主和家人住在那里。",
          ],
          [
            ["A ditch with water is a moat.", "有水的深沟是护城河。"],
            ["An iron gate is the portcullis.", "铁闸门是吊闸。"],
            ["A bridge that rises is the drawbridge.", "能升起的桥是吊桥。"],
          ],
        ),
        q(
          ["What was a portcullis?", "吊闸门是什么？"],
          ["A heavy iron gate that slid down to block the entrance", "一扇滑下来堵住入口的沉重铁门"],
          [
            ["A deep ditch filled with water", "一条灌满水的深沟"],
            ["A bridge that could be raised", "一座可以升起的桥"],
            ["The strongest tower of the castle", "城堡最坚固的塔楼"],
          ],
          [
            "Behind the drawbridge hung the portcullis, a heavy iron gate that slid down to block the entrance.",
            "吊桥后面挂着吊闸门，那是一扇滑下来就能堵住入口的沉重铁门。",
          ],
          [
            ["A ditch with water is the moat.", "有水的沟是护城河。"],
            ["A bridge that can be raised is the drawbridge.", "能升起的桥是吊桥。"],
            ["The strongest tower is the keep.", "最坚固的塔是主塔。"],
          ],
        ),
      ],
      { glossed: ["masons", "rubble", "portcullis", "keep"] },
    ),
    passage(
      "under-siege",
      ["Under Siege", "被围困"],
      `When an army could not break into a castle, it often tried a different plan. It surrounded the castle and waited. This was called a siege. No food or help could get in, and no one inside could get out. The attackers hoped that hunger would make the people inside surrender.

      A castle was prepared for this. Its cellars were stored with grain, salted meat, dried beans and barrels of water. A well inside the walls gave fresh water. A castle with enough food could hold out for months.

      The attackers did not just sit still, though. They built huge machines. A catapult could throw heavy stones to smash the walls. A tall wooden siege tower on wheels could be rolled up to the walls so soldiers could climb across. Some armies dug tunnels under the walls to make them collapse.

      The defenders fought back. Archers shot arrows from the towers, and soldiers dropped rocks on anyone trying to climb the walls.

      A siege ended in one of three ways. The attackers broke in, the people inside ran out of food and gave up, or the attackers grew tired, sick or hungry themselves and went home. Often, the castle with the most food simply won.`,
      [castles, chains],
      [
        q(
          ["What did attackers hope would happen during a siege?", "围城时进攻者希望发生什么？"],
          ["Hunger would make the people inside surrender", "饥饿会让城里的人投降"],
          [
            ["The castle well would fill with water", "城堡的井会注满水"],
            ["The defenders would build a siege tower of their own", "守城的人会自己建一座攻城塔"],
            ["The lord would invite them to a feast", "领主会请他们赴宴"],
          ],
          [
            "The first paragraph says the attackers hoped that hunger would make the people inside surrender.",
            "第一段说，进攻者希望饥饿会让城里的人投降。",
          ],
          [
            ["Filling the well is not what attackers wanted.", "让井装满水不是进攻者想要的。"],
            ["Defenders building a siege tower is backwards. Attackers built them.", "守城者造攻城塔是反的。攻城塔是进攻者造的。"],
            ["A feast is not in the passage.", "宴会文中没有。"],
          ],
        ),
        q(
          ["What was a siege tower for?", "攻城塔是做什么用的？"],
          ["Letting soldiers climb across onto the walls", "让士兵爬过去登上城墙"],
          [
            ["Throwing heavy stones at the walls", "向城墙投掷重石"],
            ["Storing grain and salted meat", "储存粮食和咸肉"],
            ["Digging tunnels under the walls", "在城墙下挖地道"],
          ],
          [
            "The third paragraph says a siege tower on wheels could be rolled up to the walls so soldiers could climb across.",
            "第三段说，带轮子的攻城塔可以推到城墙边，让士兵爬过去。",
          ],
          [
            ["Throwing stones is a catapult's job.", "抛石头是投石机的工作。"],
            ["Storing food is what cellars did.", "储存食物是地窖的作用。"],
            ["Digging tunnels was another plan, without a tower.", "挖地道是另一种办法，不用塔。"],
          ],
        ),
        q(
          ["Why did the castle with the most food often win?", "为什么食物最多的城堡常常获胜？"],
          ["Whoever ran out of food first had to give up or leave", "先吃光食物的一方只好投降或离开"],
          [
            ["Food could be thrown at the attackers", "食物可以扔向进攻者"],
            ["Food made the walls thicker", "食物让城墙更厚"],
            ["The attackers were never allowed to eat during a siege", "进攻者在围城期间不准吃东西"],
          ],
          [
            "The last paragraph says the people inside could run out of food and give up, or the attackers could grow hungry and go home.",
            "最后一段说，城里的人可能吃光食物而投降，进攻者也可能饿了而回家。",
          ],
          [
            ["Throwing food is not in the passage.", "扔食物文中没有。"],
            ["Food making walls thicker is not in the passage.", "食物让墙变厚文中没有。"],
            [
              "Never being allowed to eat is wrong. Attackers grew hungry when food ran short.",
              "进攻者不许吃饭不对。他们是因为缺粮才挨饿。",
            ],
          ],
        ),
        q(
          ["How did some armies try to make castle walls collapse?", "有些军队怎样设法让城墙倒塌？"],
          ["They dug tunnels under the walls", "在城墙下挖地道"],
          [
            ["They poured water on them", "往城墙上浇水"],
            ["They set the moat on fire", "放火烧护城河"],
            ["They climbed over with ropes", "用绳子翻过去"],
          ],
          ["The text says some armies dug tunnels under the walls to make them collapse.", "短文说有些军队在城墙下挖地道，让城墙倒塌。"],
          [
            ["Pouring water is not in the passage.", "浇水文中没有。"],
            ["Setting the moat on fire is not in the passage.", "放火烧护城河文中没有。"],
            [
              "Climbing with ropes is not the way named. Siege towers let them climb across.",
              "用绳子爬不是文中说的方法。攻城塔才能让他们爬过去。",
            ],
          ],
        ),
      ],
    ),
    passage(
      "becoming-a-knight",
      ["Becoming a Knight", "成为骑士"],
      `In the Middle Ages, a boy did not simply decide to become a knight one day. It took about fourteen years of training, and it usually began when he was only seven.

      At seven, the boy was sent to live in the castle of a lord, where he became a page. A page served the lord's family at the table, ran errands and learned good manners. He also began to learn to ride and to fight with a wooden sword.

      At about fourteen, the page became a squire. Each squire served one knight. He cared for the knight's horse, polished his armor and helped him dress for battle. He practiced with real weapons and even followed his knight into war, carrying his shield and spare lances.

      At about twenty-one, if the squire had proved himself, he was made a knight in a ceremony called dubbing. He spent the night before praying in a chapel. In the morning, the lord tapped his shoulder with a sword.

      A knight was expected to follow a code called chivalry. He promised to be brave in battle, loyal to his lord and kind to the weak. Not every knight kept these promises, but the best ones tried.`,
      [castles, details],
      [
        q(
          ["What did a page do?", "侍童（page）做什么？"],
          ["Served the lord's family and learned manners", "服侍领主一家并学习礼仪"],
          [
            ["Cared for a knight's horse and armor", "照料骑士的马和盔甲"],
            ["Led the lord's knights into battle", "带领领主的骑士作战"],
            ["Tapped each new squire's shoulder with a sword", "用剑轻拍每个新侍从的肩膀"],
          ],
          [
            "The second paragraph says a page served the lord's family at the table, ran errands and learned good manners.",
            "第二段说，侍童在餐桌旁服侍领主一家，跑腿，并学习礼仪。",
          ],
          [
            ["Caring for a horse and armor is what a squire did.", "照料马和盔甲是侍从做的事。"],
            ["Leading knights into battle is not a page's job.", "带领骑士作战不是侍童的工作。"],
            ["Tapping with a sword is what the lord did at dubbing.", "用剑轻拍是领主在授封仪式上做的。"],
          ],
        ),
        q(
          ["At about what age did a boy become a squire?", "男孩大约在多大时成为侍从？"],
          ["Fourteen", "十四岁"],
          [
            ["Seven", "七岁"],
            ["Twenty-one", "二十一岁"],
            ["Ten", "十岁"],
          ],
          [
            "The third paragraph says that at about fourteen, the page became a squire; he became a page at seven and a knight at about twenty-one.",
            "第三段说，大约十四岁时侍童成为侍从；他七岁成为侍童，大约二十一岁成为骑士。",
          ],
          [
            ["Seven is when a boy became a page.", "七岁是男孩成为侍童的年龄。"],
            ["Twenty-one is when a squire became a knight.", "二十一岁是侍从成为骑士的年龄。"],
            ["Ten is not named in the passage.", "十岁文中没提。"],
          ],
        ),
        q(
          ["What did the code of chivalry ask of a knight?", "骑士精神的准则要求骑士做什么？"],
          ["To be brave, loyal and kind to the weak", "勇敢、忠诚，善待弱者"],
          [
            ["To pray in a chapel every night", "每晚在小教堂祈祷"],
            ["To polish his own armor and lances", "自己擦亮盔甲和长矛"],
            ["To live in a castle of his own", "住在自己的城堡里"],
          ],
          [
            "The last paragraph says a knight promised to be brave in battle, loyal to his lord and kind to the weak.",
            "最后一段说，骑士承诺在战斗中勇敢，对领主忠诚，善待弱者。",
          ],
          [
            ["Praying every night is wrong. He prayed the night before dubbing.", "每晚祈祷不对。他是在授封前一晚祈祷。"],
            ["Polishing armor is what a squire did for a knight.", "擦亮盔甲是侍从为骑士做的事。"],
            ["A castle of his own is not part of the code.", "自己的城堡不是骑士准则的一部分。"],
          ],
        ),
        q(
          ["Where did a squire spend the night before he was made a knight?", "侍从在受封骑士的前一晚待在哪里？"],
          ["Praying in a chapel", "在小教堂里祈祷"],
          [
            ["Feasting in the great hall", "在大厅里宴饮"],
            ["Guarding the castle gate", "守卫城堡大门"],
            ["Riding in the woods", "在树林里骑马"],
          ],
          ["He spent the night before praying in a chapel.", "他在前一晚到小教堂里祈祷。"],
          [
            ["Feasting in the hall is not in the passage.", "在大厅宴饮文中没有。"],
            ["Guarding the gate is not in the passage.", "守城门文中没有。"],
            ["Riding in the woods is not in the passage.", "在林中骑马文中没有。"],
          ],
        ),
      ],
      { names: ["Middle Ages"], glossed: ["dubbing"] },
    ),
    passage(
      "life-on-a-manor",
      ["Life on a Manor", "庄园里的生活"],
      `Most people in the Middle Ages lived and worked on a manor. A manor was the land a lord owned, with a village, fields, woods, a mill and often a church. Nearly everything the people needed was grown or made right there.

      The day began at sunrise. Peasant families lived in small huts with walls of mud and straw and a single room. There was a fire in the middle of the floor and a hole in the roof to let out the smoke. In winter, the family's animals often slept inside with them for warmth.

      The fields were divided into long strips. Each family farmed some strips for itself and also had to work several days a week on the lord's strips. Men plowed with oxen, women and children planted and weeded, and at harvest time everyone helped to cut the grain.

      The peasants also owed the lord other payments. They had to grind their grain at the lord's mill and give him part of the flour. They paid him in eggs, chickens or cheese.

      Life was hard, but it was not all work. On holy days, villagers rested. There were fairs, dancing, games and feasts to celebrate the end of the harvest.`,
      [towns, details],
      [
        q(
          ["What was a manor?", "庄园是什么？"],
          ["The land a lord owned, with a village, fields and a mill", "领主拥有的土地，有村庄、田地和磨坊"],
          [
            ["A small hut with walls of mud and straw", "用泥和稻草砌墙的小屋"],
            ["A long strip of land for one family", "给一户人家的一长条土地"],
            ["A fair held at the end of the harvest", "丰收后举行的集市"],
          ],
          [
            "The first paragraph defines a manor as the land a lord owned, with a village, fields, woods, a mill and often a church.",
            "第一段把庄园定义为领主拥有的土地，有村庄、田地、树林、磨坊，往往还有教堂。",
          ],
          [
            ["A mud hut is where peasant families lived.", "泥草屋是农民家庭住的地方。"],
            ["A long strip is one part of the fields.", "长条地只是田地的一部分。"],
            ["A fair is a celebration, not the land.", "集市是庆祝活动，不是土地。"],
          ],
        ),
        q(
          ["Why did animals sometimes sleep inside the huts in winter?", "为什么冬天牲畜有时睡在小屋里？"],
          ["For warmth", "为了取暖"],
          [
            ["To guard the family's grain", "为了看守家里的粮食"],
            ["Because the lord ordered it", "因为领主下了命令"],
            ["To keep the fire burning", "为了让火一直烧着"],
          ],
          [
            "The second paragraph says that in winter, the family's animals often slept inside with them for warmth.",
            "第二段说，冬天，家里的牲畜常常和人睡在一起取暖。",
          ],
          [
            ["Guarding grain is not the reason given.", "看守粮食不是文中给的原因。"],
            ["The lord ordering it is not in the passage.", "领主下令文中没有。"],
            ["Keeping the fire burning is not the reason given.", "让火一直烧着不是文中给的原因。"],
          ],
        ),
        q(
          ["Which detail supports the idea that peasants owed the lord a great deal?", "哪个细节支持“农民欠领主很多”这一观点？"],
          ["They worked his strips and gave him flour", "他们耕种他的田，还给他面粉"],
          [
            ["They rested on holy days", "他们在宗教节日休息"],
            ["They danced at fairs", "他们在集市上跳舞"],
            ["They lived together in a hut with a single room", "他们一家住在只有一间屋子的小屋里"],
          ],
          [
            "The third and fourth paragraphs say peasants worked several days a week on the lord's strips and gave him part of their flour, eggs and cheese.",
            "第三、四段说，农民每周要在领主的田上干几天活，还要把一部分面粉、鸡蛋和奶酪交给他。",
          ],
          [
            ["Resting on holy days shows time off, not what they owed.", "节日休息说明有空闲，不是他们欠的。"],
            ["Dancing at fairs shows fun, not what they owed.", "在集市跳舞说明有乐趣，不是他们欠的。"],
            ["A one-room hut shows they were poor, not what they owed.", "一间屋的小屋说明他们穷，不是他们欠的。"],
          ],
        ),
        q(
          ["What did peasants have to do at the lord's mill?", "农民在领主的磨坊必须做什么？"],
          ["Grind their grain and give him part of the flour", "磨谷物并把一部分面粉交给他"],
          [
            ["Sell their eggs", "卖他们的鸡蛋"],
            ["Build new strips of field", "开辟新的条田"],
            ["Sleep with the animals", "和牲畜一起睡"],
          ],
          [
            "They had to grind their grain at the lord's mill and give him part of the flour.",
            "他们必须在领主的磨坊磨谷物，并把一部分面粉交给他。",
          ],
          [
            ["Selling eggs is wrong. They paid him in eggs.", "卖鸡蛋不对。他们是用鸡蛋交租。"],
            ["Building strips is not in the passage.", "开新田文中没有。"],
            ["Sleeping with animals happened in their huts.", "和牲畜睡在一起是在他们的小屋里。"],
          ],
        ),
      ],
      { names: ["Middle Ages"] },
    ),
    passage(
      "towns-and-guilds",
      ["Towns and Guilds", "城镇与行会"],
      `As the Middle Ages went on, more and more people left the manors and moved to towns. Towns grew up where roads met, beside rivers and around markets. They were crowded, noisy and busy, with narrow streets, wooden houses and a market square in the middle.

      In towns, people did not farm. They made and sold things instead. There were bakers, weavers, shoemakers, carpenters and many other craftsmen. People who made the same thing often joined together in a guild.

      A guild set the rules for its trade. It decided how good the goods must be and what price they should sell for. A baker who sold bread that was too small could be fined by the bakers' guild. Guilds also helped their members. If a craftsman fell ill or died, the guild cared for his family.

      Learning a trade took years. A boy became an apprentice and lived with a master craftsman, who taught him the skills of the trade. After about seven years, he became a journeyman and was paid for his work. To become a master himself, he had to make a piece of work so fine that the guild approved it: his masterpiece.`,
      [towns, details],
      [
        q(
          ["Where did towns grow up?", "城镇在哪里兴起？"],
          ["Where roads met, beside rivers and around markets", "道路交会处、河边和集市周围"],
          [
            ["On the tops of high hills and cliffs", "在高高的山顶和悬崖上"],
            ["Inside the thick stone walls of the lord's castle", "在领主城堡厚厚的石墙内"],
            ["In the middle of the manor's fields", "在庄园的田地中间"],
          ],
          [
            "The first paragraph says towns grew up where roads met, beside rivers and around markets.",
            "第一段说，城镇在道路交会处、河边和集市周围兴起。",
          ],
          [
            ["High hills and cliffs are where castles were built.", "高山和悬崖是建城堡的地方。"],
            ["Inside castle walls is not where towns grew.", "城堡墙内不是城镇形成的地方。"],
            ["The manor's fields are where peasants farmed.", "庄园的田地是农民种地的地方。"],
          ],
        ),
        q(
          ["What could happen to a baker who sold bread that was too small?", "卖的面包太小的面包师会怎样？"],
          ["The bakers' guild could fine him", "面包师行会可以罚他钱"],
          [
            ["He became a journeyman", "他成为了雇工"],
            ["The lord took his house", "领主收走了他的房子"],
            ["He had to make a masterpiece", "他必须做出一件杰作"],
          ],
          [
            "The third paragraph says a baker who sold bread that was too small could be fined by the bakers' guild.",
            "第三段说，卖的面包太小的面包师会被面包师行会罚款。",
          ],
          [
            ["Becoming a journeyman came after seven years of training.", "成为熟练工是学徒七年后的事。"],
            ["The lord taking his house is not in the passage.", "领主收走房子文中没有。"],
            ["Making a masterpiece is how one became a master.", "做出杰作是成为师傅的途径。"],
          ],
        ),
        q(
          ["What was a masterpiece in the Middle Ages?", "中世纪的“杰作”是什么？"],
          ["A fine piece of work that made a journeyman a master", "让雇工成为师傅的一件精品"],
          [
            ["A famous painting for a church", "一幅给教堂的名画"],
            ["The first thing an apprentice made", "学徒做的第一件东西"],
            ["A rule set by a guild", "行会定下的一条规矩"],
          ],
          [
            "The last paragraph says that to become a master, a journeyman had to make a piece of work so fine that the guild approved it: his masterpiece.",
            "最后一段说，雇工要成为师傅，必须做出一件精美得能被行会认可的作品，这就是他的杰作。",
          ],
          [
            ["A famous painting is today's meaning, not the Middle Ages'.", "著名的画作是今天的意思，不是中世纪的。"],
            ["The first thing made is backwards. It came at the end of training.", "最先做的东西是反的。它是在学徒期结束时做的。"],
            ["A guild's rule is not a piece of work.", "行会的规定不是一件作品。"],
          ],
        ),
        q(
          ["What did a guild do when a craftsman fell ill or died?", "工匠生病或去世时，行会怎么做？"],
          ["It cared for his family", "照顾他的家人"],
          [
            ["It closed his shop", "关掉他的店"],
            ["It fined his family", "罚他家人的钱"],
            ["It sent him to a manor", "把他送到庄园"],
          ],
          ["If a craftsman fell ill or died, the guild cared for his family.", "工匠生病或去世时，行会会照顾他的家人。"],
          [
            ["Closing his shop is not in the passage.", "关掉店铺文中没有。"],
            ["Fining his family is backwards. The guild helped them.", "罚他的家人是反的。行会帮助他们。"],
            ["Sending him to a manor is not in the passage.", "把他送到庄园文中没有。"],
          ],
        ),
      ],
      { names: ["Middle Ages"] },
    ),
    passage(
      "monks-and-their-books",
      ["Monks and Their Books", "修道士和他们的书"],
      `In the Middle Ages, there were no printing machines in Europe. Every book had to be copied by hand, one letter at a time. Much of this work was done by monks, men who lived together in a monastery and spent their lives in prayer and work.

      In many monasteries, there was a special room called the scriptorium, where the monks copied books. They sat at slanted desks by the windows to catch the daylight, because candles might set the precious pages on fire. They wrote with quill pens made from goose feathers, dipping them in ink made from crushed oak galls and iron.

      The pages were not paper but parchment, made from the skins of sheep or calves, which were scraped thin and dried. A single large book could need the skins of more than a hundred animals.

      Some books were decorated with bright pictures and patterns. The first letter of a page might be painted in red, blue and even real gold. These books are called illuminated, because the gold seems to light up the page.

      Copying one book could take a monk a year or more. Because of this patient work, many ancient writings survived to be read today.`,
      [ideas, chains],
      [
        q(
          ["Why did monks work by the windows?", "修道士为什么在窗边工作？"],
          ["To use daylight, as candles might burn the pages", "为了用日光，因为蜡烛可能烧坏书页"],
          [
            ["To watch the animals in the fields", "为了看田里的动物"],
            ["To dry the wet parchment in the wind and sunshine", "为了让湿羊皮纸在风和阳光中晾干"],
            ["To keep warm in the sunshine", "为了在阳光下取暖"],
          ],
          [
            "The second paragraph says the monks sat by the windows to catch the daylight, because candles might set the pages on fire.",
            "第二段说，修道士坐在窗边借日光，因为蜡烛可能会让书页着火。",
          ],
          [
            ["Watching animals is not the reason given.", "看动物不是文中给的原因。"],
            ["Drying parchment is not in the passage.", "晾干羊皮纸文中没有。"],
            ["Keeping warm is not the reason given.", "取暖不是文中给的原因。"],
          ],
        ),
        q(
          ["What was parchment made from?", "羊皮纸是用什么做的？"],
          ["The skins of sheep or calves", "绵羊或小牛的皮"],
          [
            ["Goose feathers and ink", "鹅毛和墨水"],
            ["Crushed oak galls and iron", "压碎的橡树虫瘿和铁"],
            ["Paper and real gold", "纸和真金"],
          ],
          [
            "The third paragraph says parchment was made from the skins of sheep or calves, scraped thin and dried.",
            "第三段说，羊皮纸是用绵羊或小牛的皮刮薄晒干做成的。",
          ],
          [
            ["Goose feathers made the pens.", "鹅毛是做笔的。"],
            ["Oak galls and iron made the ink.", "栎瘿和铁是做墨水的。"],
            ["Paper and gold are wrong. Parchment was not paper.", "纸和金子不对。羊皮纸不是纸。"],
          ],
        ),
        q(
          ["Why are some books called illuminated?", "为什么有些书被称为“泥金装饰”的？"],
          ["The gold seems to light up the page", "金色仿佛照亮了书页"],
          [
            ["They were read by candlelight", "人们在烛光下读它们"],
            ["They were copied very quickly", "它们抄写得非常快"],
            ["They had no pictures at all", "它们根本没有图画"],
          ],
          [
            "The fifth paragraph says these books are called illuminated because the gold seems to light up the page.",
            "第五段说，这些书叫作泥金装饰手抄本，因为金色仿佛照亮了书页。",
          ],
          [
            ["Candlelight is wrong. Monks avoided candles.", "烛光不对。修士们避免用蜡烛。"],
            ["Being copied quickly is backwards. One book took a year.", "抄得很快是反的。一本书要一年。"],
            ["No pictures is the opposite. They had bright pictures.", "没有图画正好相反。它们有鲜艳的图画。"],
          ],
        ),
      ],
      { names: ["Middle Ages", "Europe"], glossed: ["scriptorium", "parchment", "illuminated"] },
    ),
    passage(
      "the-great-plague",
      ["The Great Plague", "大瘟疫"],
      `In 1347, ships sailed into the harbors of Italy carrying more than silk and spices. They also carried rats, and the rats carried fleas. The fleas carried a deadly disease called the plague. Within a few years, it had spread across all of Europe. People later called it the Black Death.

      The plague spread fast. When an infected flea bit a person, that person soon fell sick with a high fever and painful swellings. Many died within days. In crowded towns, where people lived close together and rats were everywhere, the disease moved from house to house.

      No one at the time knew about germs, so no one understood where it came from. Some people blamed bad air and carried flowers to sweeten it. Others thought it was a punishment. Doctors tried many cures, but none of them worked.

      By 1351, the plague had killed about a third of the people of Europe. Whole villages were left empty. With so few people left to work the land, the peasants who survived could ask for higher wages. Some left their manors for good. In this way, a terrible disaster helped bring the old feudal system to an end.`,
      [power, chains],
      [
        q(
          ["How did the plague reach Europe?", "瘟疫是怎样传到欧洲的？"],
          ["On ships, through rats that carried infected fleas", "通过船上的老鼠，老鼠身上带着染病的跳蚤"],
          [
            ["Through bad air that blew in from the sea at night", "通过夜里从海上吹来的污浊空气"],
            ["In bundles of flowers sold at markets", "藏在市场上卖的花束里"],
            ["In bolts of silk from the East", "藏在来自东方的丝绸里"],
          ],
          [
            "The first paragraph says ships carried rats, the rats carried fleas, and the fleas carried the plague.",
            "第一段说，船上有老鼠，老鼠身上有跳蚤，跳蚤携带着瘟疫。",
          ],
          [
            ["Bad air is what some people blamed, but it was wrong.", "坏空气是一些人归咎的原因，但那是错的。"],
            ["Flowers were carried to sweeten the air, not the cause.", "花是用来让空气变香的，不是病因。"],
            ["Silk came on the ships, but the fleas carried the disease.", "丝绸在船上，但传播疾病的是跳蚤。"],
          ],
        ),
        q(
          ["Why did no one at the time understand the cause of the plague?", "为什么当时没有人明白瘟疫的起因？"],
          ["No one knew about germs", "没有人知道病菌"],
          [
            ["The doctors were too busy", "医生们太忙了"],
            ["The rats were hidden", "老鼠藏起来了"],
            ["It killed people too slowly", "它致人死亡太慢"],
          ],
          [
            "The third paragraph says no one at the time knew about germs, so no one understood where it came from.",
            "第三段说，当时没有人知道病菌，所以没有人明白起因。",
          ],
          [
            ["Busy doctors is not the reason given.", "医生太忙不是文中给的原因。"],
            ["Hidden rats is wrong. Rats were everywhere.", "老鼠藏起来不对。到处都是老鼠。"],
            ["Too slowly is backwards. Many died within days.", "杀人太慢是反的。很多人几天内就死了。"],
          ],
        ),
        q(
          ["How did the plague help end the feudal system?", "瘟疫是怎样帮助终结封建制度的？"],
          ["Few workers were left, so peasants could ask for more", "剩下的劳力很少，农民可以要求更多"],
          [
            ["The lords all moved to Italy", "领主们都搬去了意大利"],
            ["The king gave every peasant who survived a castle and land", "国王给每个幸存的农民一座城堡和土地"],
            ["Doctors found a cure for it", "医生找到了治疗方法"],
          ],
          [
            "The last paragraph explains the chain: so many died that few were left to work, so survivors could ask for higher wages or leave their manors.",
            "最后一段解释了这条因果链：死的人太多，干活的人很少，于是幸存者可以要求更高的工钱，或者离开庄园。",
          ],
          [
            ["Lords moving to Italy is not in the passage.", "领主搬到意大利文中没有。"],
            ["The king giving castles is not in the passage.", "国王赐城堡文中没有。"],
            ["Finding a cure is wrong. None of the cures worked.", "找到疗法不对。没有一种疗法有效。"],
          ],
        ),
      ],
      { names: ["Italy", "Europe", "Black Death"] },
    ),
  ],
};

/** silkRoadUnit is the reading unit of the Silk Road. */
export const silkRoadUnit: ReadingUnitDef = {
  id: "the-silk-road",
  title: t("The Silk Road", "丝绸之路"),
  passages: [
    passage(
      "a-road-that-was-not-one-road",
      ["A Road That Was Not One Road", "不是一条路的路"],
      `The name Silk Road makes it sound like a single road paved with stone. It was nothing of the kind. The Silk Road was a huge web of routes that linked China to Central Asia, India, the Middle East and Europe. Some routes crossed deserts and mountains, and others crossed the sea.

      Very few travelers ever made the whole journey of more than six thousand kilometers. Instead, goods were passed along in stages. A merchant from China might carry silk to a market in Central Asia and sell it there. Another merchant would buy it and carry it farther west. By the time a bolt of silk reached Rome, it might have changed hands a dozen times, and its price would have risen at every stop.

      The routes were in use for more than fifteen hundred years. Along them grew busy towns, where travelers could rest, trade and find water for their camels.

      The name itself is quite new. A German scholar first called it the Silk Road in 1877, long after the great days of the routes were over. The people who traveled them never used the name at all.`,
      [trade, support],
      [
        q(
          ["What was the Silk Road really?", "丝绸之路实际上是什么？"],
          ["A huge web of routes over land and sea", "一张遍布陆地和海洋的巨大路线网"],
          [
            ["A single road paved with stone", "一条用石头铺成的路"],
            ["A river that ran from China to Rome", "一条从中国流到罗马的河"],
            ["A market town in Central Asia", "中亚的一个集市城镇"],
          ],
          [
            "The first paragraph says the Silk Road was not one road but a huge web of routes, some over land and some across the sea.",
            "第一段说，丝绸之路不是一条路，而是一张巨大的路线网，有的在陆地上，有的跨越大海。",
          ],
          [
            [
              "A single stone road is what the name suggests, but the passage says it was not.",
              "一条石头路是名字给人的印象，但文中说不是。",
            ],
            ["A river is not in the passage.", "河流文中没有。"],
            ["A market town is one stop along the routes.", "集镇只是路线上的一站。"],
          ],
        ),
        q(
          ["Why did the price of silk rise on its way west?", "丝绸往西运的路上为什么越来越贵？"],
          ["It changed hands many times, rising at each stop", "它多次转手，每到一站都涨价"],
          [
            ["Camel drivers charged more the farther they walked", "赶骆驼的人走得越远收费越高"],
            ["Rome made a law that silk must be expensive", "罗马立法规定丝绸必须昂贵"],
            ["The silk grew longer as it traveled", "丝绸在路上变长了"],
          ],
          [
            "The second paragraph says a bolt of silk might change hands a dozen times, and its price would rise at every stop.",
            "第二段说，一匹丝绸可能转手十几次，每到一站价格都会上涨。",
          ],
          [
            ["Camel drivers charging more is not the reason given.", "驼夫越走收费越高不是文中给的原因。"],
            ["A Roman law is not in the passage.", "罗马的法律文中没有。"],
            ["Silk growing longer is not in the passage.", "丝绸变长文中没有。"],
          ],
        ),
        q(
          ["Which detail supports the point that the name is quite new?", "哪个细节支持“这个名字很新”的说法？"],
          ["A scholar first used it in 1877", "一位学者在1877年首次使用它"],
          [
            ["The routes were used for fifteen hundred years", "这些路线用了一千五百年"],
            ["Few travelers made the whole journey", "很少有旅人走完全程"],
            ["Towns grew up along the routes", "路线沿途兴起了城镇"],
          ],
          [
            "The last paragraph supports the point with a fact: a German scholar first called it the Silk Road in 1877, after its great days were over.",
            "最后一段用一个事实支持这个观点：一位德国学者在1877年首次称它为丝绸之路，那时它的鼎盛时期早已过去。",
          ],
          [
            ["Fifteen hundred years shows the routes were old, not the name.", "一千五百年说明路线古老，不是名字。"],
            ["Few travelers making the whole trip is about stages.", "很少有人走完全程说的是分段运输。"],
            ["Towns along the routes are not about the name.", "沿途的城镇和名字无关。"],
          ],
        ),
        q(
          ["How long were the routes of the Silk Road in use?", "丝绸之路的路线使用了多久？"],
          ["More than fifteen hundred years", "一千五百多年"],
          [
            ["About fifty years", "大约五十年"],
            ["Since 1877", "从1877年开始"],
            ["About one hundred years", "大约一百年"],
          ],
          ["The text says the routes were in use for more than fifteen hundred years.", "短文说这些路线使用了一千五百多年。"],
          [
            ["Fifty years is far too short.", "五十年太短了。"],
            ["Since 1877 is when the name began.", "1877年是名字开始使用的时候。"],
            ["One hundred years is far too short.", "一百年太短了。"],
          ],
        ),
      ],
      { names: ["Silk Road", "China", "Central Asia", "India", "Middle East", "Europe", "Rome", "German"] },
    ),
    passage(
      "silk-the-secret-of-china",
      ["Silk, the Secret of China", "丝绸：中国的秘密"],
      `For thousands of years, only the people of China knew how to make silk. They guarded the secret so closely that anyone caught carrying silkworms out of the country could be put to death.

      Silk comes from a small caterpillar called the silkworm. It eats nothing but the leaves of the mulberry tree. When it is ready to change into a moth, it spins a cocoon around itself from a single thread. That thread can be more than a kilometer long.

      To make silk, workers drop the cocoons into hot water, which loosens the thread. Then they carefully unwind it. Several threads are twisted together to make one strong yarn, and the yarn is woven into cloth. The finished silk is soft, light and shiny, and it takes bright dyes beautifully.

      In faraway Rome, people were amazed by silk. It was so valuable that it was sometimes worth its weight in gold, and only the rich could afford it.

      Legends say the secret finally escaped when travelers hid silkworm eggs inside hollow walking sticks and carried them west. However it happened, by about fifteen hundred years ago, silk was being made outside China at last.`,
      [silk, chains],
      [
        q(
          ["What does the silkworm eat?", "蚕吃什么？"],
          ["Only the leaves of the mulberry tree", "只吃桑树的叶子"],
          [
            ["Any green leaf it can find", "它能找到的任何绿叶"],
            ["The threads of other cocoons", "其他茧的丝"],
            ["Small moths and caterpillars", "小飞蛾和毛毛虫"],
          ],
          ["The second paragraph says the silkworm eats nothing but the leaves of the mulberry tree.", "第二段说，蚕只吃桑树的叶子。"],
          [
            ["Any green leaf is wrong. It eats only mulberry leaves.", "任何绿叶不对。它只吃桑叶。"],
            ["Threads of other cocoons are not in the passage.", "别的茧的丝文中没有。"],
            ["Moths and caterpillars are not what it eats.", "飞蛾和毛毛虫不是它的食物。"],
          ],
        ),
        q(
          ["Why do workers drop the cocoons into hot water?", "工人为什么把蚕茧放进热水里？"],
          ["The water loosens the thread", "热水能让丝松开"],
          [
            ["The water dyes the silk bright colors", "热水能把丝染成鲜艳的颜色"],
            ["The water makes the moths fly away", "热水能让飞蛾飞走"],
            ["The water twists the threads together", "热水能把丝拧在一起"],
          ],
          [
            "The third paragraph says workers drop the cocoons into hot water, which loosens the thread so it can be unwound.",
            "第三段说，工人把蚕茧放进热水里，让丝松开，这样就能抽丝了。",
          ],
          [
            ["Dyeing comes later, on the finished cloth.", "染色是之后对织好的布做的。"],
            ["Making moths fly away is not in the passage.", "让飞蛾飞走文中没有。"],
            ["Twisting threads comes after unwinding.", "捻丝是在抽丝之后。"],
          ],
        ),
        q(
          ["How do legends say the secret of silk escaped China?", "传说中养蚕的秘密是怎样流出中国的？"],
          ["Travelers hid silkworm eggs in hollow walking sticks", "旅人把蚕卵藏在空心的手杖里"],
          [
            ["A Roman emperor bought the secret with a chest of gold", "一位罗马皇帝用一箱黄金买下了这个秘密"],
            ["Silkworms flew west as moths", "蚕变成飞蛾飞到了西方"],
            ["The Chinese gave it away for free", "中国人免费送出了它"],
          ],
          [
            "The last paragraph says legends tell of travelers hiding silkworm eggs inside hollow walking sticks.",
            "最后一段说，传说旅人把蚕卵藏在空心的手杖里。",
          ],
          [
            ["A Roman emperor buying it is not in the passage.", "罗马皇帝买下秘密文中没有。"],
            ["Moths flying west is not in the legend.", "飞蛾往西飞不在传说里。"],
            ["Giving it away is wrong. China guarded the secret.", "免费送出去不对。中国严守这个秘密。"],
          ],
        ),
        q(
          ["How long can the thread of one cocoon be?", "一个蚕茧的丝能有多长？"],
          ["More than a kilometer", "超过一公里"],
          [
            ["About a meter", "大约一米"],
            ["About ten centimeters", "大约十厘米"],
            ["Six thousand kilometers", "六千公里"],
          ],
          ["The cocoon is spun from a single thread that can be more than a kilometer long.", "蚕茧由一根丝织成，这根丝可以超过一公里长。"],
          [
            ["A meter is far too short.", "一米太短了。"],
            ["Ten centimeters is far too short.", "十厘米太短了。"],
            ["Six thousand kilometers is the length of the whole Silk Road.", "六千公里是整条丝绸之路的长度。"],
          ],
        ),
      ],
      { names: ["China", "Rome"] },
    ),
    passage(
      "caravans-across-the-desert",
      ["Caravans Across the Desert", "穿越沙漠的商队"],
      `Some of the hardest parts of the Silk Road crossed great deserts, such as the Taklamakan in western China. Its name is often said to mean "go in and you will not come out." No one crossed it alone.

      Instead, merchants traveled in caravans, long lines of travelers and animals journeying together. A large caravan might have hundreds of camels, each carrying heavy bundles of cargo. Traveling in a group was safer, because bandits were less likely to attack.

      The two-humped Bactrian camel was perfect for the job. It could carry about two hundred kilograms and go for days without drinking. Its thick coat protected it from freezing nights, and it could close its nostrils against blowing sand. Some travelers said the camels could even sense a sandstorm coming before the people could.

      Caravans moved slowly, often only about thirty kilometers a day. They traveled from one oasis to the next, where they could find water and rest. Some towns built large inns called caravanserais, with a courtyard for the animals and rooms for the travelers.

      Crossing a desert could take weeks. Merchants faced heat, cold, thirst and storms, all for the chance of a good trade at the end.`,
      [trade, details],
      [
        q(
          ["Why did merchants travel in caravans?", "商人为什么结成商队出行？"],
          ["It was safer, as bandits were less likely to attack", "这样更安全，因为强盗不太敢攻击"],
          [
            ["Camels refused to walk alone", "骆驼不肯单独走"],
            ["The law said they must travel in groups", "法律规定必须成群出行"],
            ["A caravan moved faster than a traveler on his own could", "商队比单独一个旅人走得快"],
          ],
          [
            "The second paragraph says traveling in a group was safer, because bandits were less likely to attack.",
            "第二段说，成群出行更安全，因为强盗不太敢攻击。",
          ],
          [
            ["Camels refusing to walk alone is not in the passage.", "骆驼不肯独行文中没有。"],
            ["A law is not in the passage.", "法律文中没有。"],
            ["Moving faster is wrong. Caravans moved slowly.", "走得更快不对。商队走得很慢。"],
          ],
        ),
        q(
          ["Which detail shows that the Bactrian camel was suited to the desert?", "哪个细节说明双峰驼适应沙漠？"],
          ["It could close its nostrils against blowing sand", "它能关闭鼻孔挡住风沙"],
          [
            ["It traveled about thirty kilometers every single day", "它每天都走大约三十公里"],
            ["It rested at inns with courtyards", "它在有院子的客栈里休息"],
            ["It was owned by merchants", "它属于商人"],
          ],
          [
            "The third paragraph lists its features for the desert: it could carry heavy loads, go days without water and close its nostrils against sand.",
            "第三段列出了它适应沙漠的特点：能驮重物，几天不喝水，还能关闭鼻孔挡住沙子。",
          ],
          [
            ["Thirty kilometers a day is about the caravan's speed, not the camel's body.", "每天三十公里说的是商队速度，不是骆驼的身体。"],
            ["Resting at inns is about travelers, not the camel.", "在客栈休息说的是旅人，不是骆驼。"],
            ["Being owned by merchants does not show it suits the desert.", "属于商人并不说明它适合沙漠。"],
          ],
        ),
        q(
          ["What was a caravanserai?", "商队客栈（caravanserai）是什么？"],
          ["A large inn for travelers and their animals", "供旅人和牲畜住的大客栈"],
          [
            ["A desert that no one could cross", "一片没人能穿越的沙漠"],
            ["A kind of desert camel with two humps and a thick coat", "一种有两个驼峰、毛很厚的沙漠骆驼"],
            ["A bundle of cargo on a camel", "骆驼背上的一捆货物"],
          ],
          [
            "The fourth paragraph says caravanserais were large inns with a courtyard for the animals and rooms for the travelers.",
            "第四段说，商队客栈是大客栈，有给牲畜的院子和给旅人的房间。",
          ],
          [
            ["A desert no one could cross describes the Taklamakan's name.", "无人能穿越的沙漠说的是塔克拉玛干的名字。"],
            ["A two-humped camel is the Bactrian camel.", "双峰驼是巴克特里亚骆驼。"],
            ["A bundle of cargo is what a camel carried.", "一捆货物是骆驼驮的东西。"],
          ],
        ),
        q(
          ["How far did a caravan often travel in a day?", "驼队一天常常走多远？"],
          ["Only about thirty kilometers", "只有大约三十公里"],
          [
            ["About three hundred kilometers", "大约三百公里"],
            ["About three kilometers", "大约三公里"],
            ["More than a thousand kilometers", "一千多公里"],
          ],
          ["Caravans moved slowly, often only about thirty kilometers a day.", "驼队走得很慢，常常一天只走大约三十公里。"],
          [
            ["Three hundred is ten times too far.", "三百公里远了十倍。"],
            ["Three is far too little.", "三公里太少了。"],
            ["A thousand is far too much.", "一千公里太多了。"],
          ],
        ),
      ],
      { names: ["Silk Road", "Taklamakan", "China", "Bactrian"], glossed: ["caravanserais"] },
    ),
    passage(
      "the-markets-of-samarkand",
      ["The Markets of Samarkand", "撒马尔罕的集市"],
      `In the middle of Central Asia, where many routes of the Silk Road met, stood the city of Samarkand. For centuries it was one of the busiest trading cities in the world.

      Its markets were crowded from dawn to dusk. Merchants from China spread out bolts of shining silk and delicate porcelain. Traders from India sold pepper, cotton and precious stones. From Persia came carpets and silver, and from the lands to the north came furs and amber. Local farmers sold melons, grapes and apricots so sweet that they were famous far away.

      Buying and selling took time. A good merchant never accepted the first price. Buyer and seller would argue, laugh, sip tea and argue again until they reached a price both could accept. Some traders did not use money at all. They bartered, swapping one kind of good for another.

      Samarkand was also a city of skilled craftspeople. Its workshops were famous for paper, metalwork and fine cloth.

      All this trade made Samarkand rich. Its rulers built grand buildings covered with blue tiles that shone in the sun. Some of them still stand today, reminding visitors of the city's days of wealth and glory.`,
      [trade, support],
      [
        q(
          ["Why was Samarkand such a busy trading city?", "撒马尔罕为什么是这样繁忙的商业城市？"],
          ["Many routes of the Silk Road met there", "丝绸之路的许多路线在那里交会"],
          [
            ["It was the capital of China", "它是中国的都城"],
            ["It was the only city with markets", "它是唯一有集市的城市"],
            ["It was built on the coast", "它建在海边"],
          ],
          [
            "The first paragraph says Samarkand stood where many routes of the Silk Road met.",
            "第一段说，撒马尔罕位于丝绸之路许多路线交会的地方。",
          ],
          [
            ["The capital of China is wrong. Samarkand is in Central Asia.", "中国的都城不对。撒马尔罕在中亚。"],
            ["The only city with markets is not in the passage.", "唯一有市场的城市文中没有。"],
            ["The coast is wrong. It is in the middle of Central Asia.", "海边不对。它在中亚腹地。"],
          ],
        ),
        q(
          ["What does it mean to barter?", "barter 是什么意思？"],
          ["To swap one kind of good for another", "用一种货物换另一种货物"],
          [
            ["To accept the first price offered", "接受第一次报的价"],
            ["To sip tea while you sell", "边卖东西边喝茶"],
            ["To pay with silver coins", "用银币付钱"],
          ],
          [
            "The third paragraph says traders who bartered swapped one kind of good for another instead of using money.",
            "第三段说，以物易物的商人用一种货物换另一种，而不用钱。",
          ],
          [
            ["Accepting the first price is what a good merchant never did.", "接受第一个价格是好商人从不做的事。"],
            ["Sipping tea is part of bargaining, not bartering.", "喝茶是讨价还价的一部分，不是以物易物。"],
            ["Silver coins is wrong. Barter uses no money.", "银币不对。以物易物不用钱。"],
          ],
        ),
        q(
          ["Which detail supports the point that trade made Samarkand rich?", "哪个细节支持“贸易使撒马尔罕富裕”的观点？"],
          ["Its rulers built grand buildings covered with blue tiles", "它的统治者建造了贴满蓝色瓷砖的宏伟建筑"],
          [
            ["Its farmers sold melons and grapes so sweet they were famous", "它的农民卖的瓜和葡萄甜得出名"],
            ["Buyers and sellers argued over prices", "买家和卖家讨价还价"],
            ["Traders from India sold pepper", "来自印度的商人卖胡椒"],
          ],
          [
            "The last paragraph says all this trade made Samarkand rich, and its rulers built grand buildings with blue tiles.",
            "最后一段说，这些贸易使撒马尔罕富裕，它的统治者建造了贴着蓝色瓷砖的宏伟建筑。",
          ],
          [
            ["Sweet fruit shows good farming, not the city's wealth.", "甜水果说明农业好，不是城市的财富。"],
            ["Arguing over prices shows how they traded.", "讨价还价说明他们怎样交易。"],
            ["Pepper from India shows what was sold.", "印度的胡椒说明卖的是什么。"],
          ],
        ),
        q(
          ["What did traders from India sell in Samarkand?", "来自印度的商人在撒马尔罕卖什么？"],
          ["Pepper, cotton and precious stones", "胡椒、棉花和宝石"],
          [
            ["Carpets and silver", "地毯和银器"],
            ["Furs and amber", "毛皮和琥珀"],
            ["Silk and porcelain", "丝绸和瓷器"],
          ],
          ["Traders from India sold pepper, cotton and precious stones.", "来自印度的商人卖胡椒、棉花和宝石。"],
          [
            ["Carpets and silver came from Persia.", "地毯和白银来自波斯。"],
            ["Furs and amber came from the north.", "毛皮和琥珀来自北方。"],
            ["Silk and porcelain came from China.", "丝绸和瓷器来自中国。"],
          ],
        ),
      ],
      { names: ["Central Asia", "Silk Road", "Samarkand", "Samarkand's", "China", "India", "Persia"] },
    ),
    passage(
      "paper-travels-west",
      ["Paper Travels West", "造纸术西传"],
      `Before paper, people wrote on many things: clay tablets, strips of bamboo, silk, and parchment made from animal skins. Each had problems. Bamboo was heavy, silk was costly, and parchment took a long time to make.

      Paper was invented in China about two thousand years ago. According to tradition, an official named Cai Lun found a way to make it from tree bark, old rags, hemp and fishing nets. These were soaked, beaten into a pulp, spread thin on a screen and dried in the sun. The result was light, cheap and easy to write on.

      For hundreds of years, papermaking stayed in China and nearby lands. Then, in the year 751, an army from the Middle East fought a Chinese army near the city of Talas in Central Asia. According to one story, some of the prisoners taken in the battle knew how to make paper, and they taught their captors.

      Soon there were paper mills in Samarkand and Baghdad. From there, the skill spread slowly across North Africa and into Spain, reaching the rest of Europe hundreds of years later. Paper made books cheaper, which helped ideas spread faster than ever before.`,
      [ideas, chains],
      [
        q(
          ["What was one problem with writing on bamboo?", "在竹简上写字有什么问题？"],
          ["It was heavy", "它很重"],
          [
            ["It was costly", "它很贵"],
            ["It took a long time to make", "制作要花很长时间"],
            ["It was made from rags", "它是用破布做的"],
          ],
          [
            "The first paragraph says bamboo was heavy, silk was costly, and parchment took a long time to make.",
            "第一段说，竹简重，丝绸贵，羊皮纸制作费时。",
          ],
          [
            ["Costly was silk's problem.", "昂贵是丝绸的问题。"],
            ["Taking long to make was parchment's problem.", "制作费时是羊皮纸的问题。"],
            ["Rags are what paper was made from.", "破布是造纸的材料。"],
          ],
        ),
        q(
          ["According to one story, how did papermaking leave China?", "根据一种说法，造纸术是怎样传出中国的？"],
          ["Prisoners taken in a battle taught their captors", "战斗中被俘的人教会了俘虏他们的人"],
          [
            ["Cai Lun carried it to Spain himself", "蔡伦亲自把它带到西班牙"],
            ["Traders sold the secret in Rome", "商人在罗马出售了这个秘密"],
            ["It was written down in a book and sent west to Europe", "它被写进书里送往西方的欧洲"],
          ],
          [
            "The third paragraph says that, according to one story, prisoners taken in the battle of 751 knew how to make paper and taught their captors.",
            "第三段说，根据一种说法，751年那场战斗中的俘虏会造纸，教会了俘虏他们的人。",
          ],
          [
            ["Cai Lun going to Spain is not in the passage.", "蔡伦去西班牙文中没有。"],
            ["Traders in Rome is not in the passage.", "罗马的商人文中没有。"],
            ["A book sent west is not in the passage.", "把书送到西方文中没有。"],
          ],
        ),
        q(
          ["What was one effect of paper reaching Europe?", "纸传到欧洲带来了什么影响？"],
          ["Books became cheaper, and ideas spread faster", "书变便宜了，思想传播得更快"],
          [
            ["People stopped writing on paper", "人们不再在纸上写字"],
            ["Bamboo became more popular", "竹简变得更流行"],
            ["The army returned to China", "军队回到了中国"],
          ],
          [
            "The last paragraph says paper made books cheaper, which helped ideas spread faster than ever before.",
            "最后一段说，纸让书变得更便宜，帮助思想以前所未有的速度传播。",
          ],
          [
            ["Stopping writing on paper is backwards.", "不再用纸写字是反的。"],
            ["Bamboo becoming popular is backwards. Bamboo was heavy.", "竹简更流行是反的。竹简很重。"],
            ["The army returning is not in the passage.", "军队回国文中没有。"],
          ],
        ),
        q(
          ["Who, by tradition, found a way to make paper?", "按照传统说法，是谁发明了造纸的方法？"],
          ["An official named Cai Lun", "一位名叫蔡伦的官员"],
          [
            ["A merchant from Samarkand", "一位撒马尔罕的商人"],
            ["A prisoner at Talas", "怛罗斯的一名俘虏"],
            ["A German scholar", "一位德国学者"],
          ],
          [
            "According to tradition, an official named Cai Lun found a way to make paper.",
            "按照传统说法，一位名叫蔡伦的官员发明了造纸的方法。",
          ],
          [
            ["A merchant from Samarkand is not named.", "撒马尔罕的商人文中没提。"],
            ["A prisoner at Talas taught papermaking later.", "怛罗斯的俘虏是后来传授造纸的。"],
            ["A German scholar named the Silk Road, not paper.", "德国学者给丝绸之路起了名，和纸无关。"],
          ],
        ),
      ],
      {
        names: [
          "China",
          "Cai",
          "Lun",
          "Middle East",
          "Chinese",
          "Talas",
          "Central Asia",
          "Samarkand",
          "Baghdad",
          "North Africa",
          "Spain",
          "Europe",
        ],
      },
    ),
    passage(
      "spices-and-stories",
      ["Spices and Stories", "香料与故事"],
      `Silk was not the only treasure carried along the trade routes. Spices were just as valuable. Pepper, cinnamon, ginger, nutmeg and cloves came from India and the islands of Southeast Asia. In Europe, they were so precious that pepper was sometimes counted out by the single grain and used to pay rent.

      People wanted spices for many reasons. They made food taste better, and some helped to keep meat from spoiling. They were used as medicines and in perfumes. Owning spices was also a sign of wealth.

      Merchants who traded in spices often kept their sources secret. To keep prices high, some told wild stories about where spices came from. One tale said cinnamon was gathered from the nests of giant birds on high cliffs, and that collectors had to trick the birds to get it. Listeners who believed such tales were happy to pay more.

      Travelers also carried stories of a different kind. Around the fires of the caravanserais, merchants from many lands traded folk tales as well as goods. Some stories that began in India or Persia traveled all the way to Europe and turned up, changed a little, in books of tales read today.`,
      [trade, support, academic1],
      [
        q(
          ["Which detail supports the point that spices were precious in Europe?", "哪个细节支持“香料在欧洲很珍贵”的观点？"],
          ["Pepper was sometimes used to pay rent", "胡椒有时被用来付房租"],
          [
            ["Spices came from India", "香料来自印度"],
            ["Spices made food taste better", "香料让食物更美味"],
            ["Merchants told stories at night", "商人在夜里讲故事"],
          ],
          [
            "The first paragraph says pepper was so precious that it was counted out by the grain and used to pay rent.",
            "第一段说，胡椒珍贵到要一粒一粒地数，还被用来付房租。",
          ],
          [
            ["Coming from India is where spices came from, not how precious they were.", "来自印度是香料的产地，不是它多珍贵。"],
            ["Tasting better is why people wanted them, not how precious.", "更好吃是人们想要的原因，不是多珍贵。"],
            ["Stories at night are about another kind of trade.", "夜里讲故事说的是另一种交流。"],
          ],
        ),
        q(
          ["Why did some merchants tell wild stories about where spices came from?", "为什么有些商人编造香料来源的离奇故事？"],
          ["To keep their sources secret and prices high", "为了隐瞒来源，保持高价"],
          [
            ["To make their listeners laugh at dinner", "为了让听众在晚餐时发笑"],
            ["To teach children about giant birds", "为了教孩子们认识巨鸟"],
            ["To warn people that some spices were dangerous to eat", "为了警告人们有些香料吃了很危险"],
          ],
          [
            "The third paragraph says merchants kept their sources secret and told wild stories to keep prices high.",
            "第三段说，商人隐瞒来源，并编造离奇的故事来保持高价。",
          ],
          [
            ["Making listeners laugh is not the reason given.", "逗听众笑不是文中给的原因。"],
            ["Teaching children is not in the passage.", "教孩子文中没有。"],
            ["Warning of danger is not in the passage.", "警告危险文中没有。"],
          ],
        ),
        q(
          ["What other kind of stories did travelers carry?", "旅人还带着什么样的故事？"],
          ["Folk tales that traveled from land to land", "在各地流传的民间故事"],
          [
            ["Stories about giant birds' nests", "关于巨鸟巢的故事"],
            ["Reports about the price of pepper", "关于胡椒价格的报告"],
            ["Stories about how to keep meat fresh", "关于怎样保持肉新鲜的故事"],
          ],
          [
            "The last paragraph says merchants traded folk tales as well as goods, and some traveled from India or Persia all the way to Europe.",
            "最后一段说，商人既交换货物，也交换民间故事，有些故事从印度或波斯一路传到了欧洲。",
          ],
          [
            ["Giant birds' nests are the merchants' wild stories, already described.", "巨鸟巢是商人编的离奇故事，前面讲过了。"],
            ["Pepper prices are not stories.", "胡椒价格不是故事。"],
            ["Keeping meat fresh is a use of spices.", "保存肉类是香料的用途。"],
          ],
        ),
        q(
          ["Where did pepper, cinnamon and cloves come from?", "胡椒、肉桂和丁香来自哪里？"],
          ["India and the islands of Southeast Asia", "印度和东南亚的岛屿"],
          [
            ["Rome and Spain", "罗马和西班牙"],
            ["The deserts of China", "中国的沙漠"],
            ["The lands to the north", "北方的土地"],
          ],
          ["These spices came from India and the islands of Southeast Asia.", "这些香料来自印度和东南亚的岛屿。"],
          [
            ["Rome and Spain are where goods went, not where spices grew.", "罗马和西班牙是货物去的地方，不是香料产地。"],
            ["The deserts of China are not named.", "中国的沙漠文中没提。"],
            ["The lands to the north sent furs and amber.", "北方送来的是毛皮和琥珀。"],
          ],
        ),
      ],
      { names: ["India", "Southeast", "Asia", "Europe", "Persia"], glossed: ["caravanserais"] },
    ),
    passage(
      "ideas-on-the-move",
      ["Ideas on the Move", "流动的思想"],
      `The most important things that traveled the Silk Road could not be packed into a bundle or loaded onto a camel. They were ideas.

      Religions spread along the routes. Buddhism began in India and was carried by monks and merchants to Central Asia, China, Korea and Japan. Along the way, travelers carved huge statues of the Buddha into cliffs and painted caves with bright pictures. The caves at Dunhuang, at the edge of the desert in western China, hold thousands of these paintings.

      Inventions traveled too. Papermaking moved west from China, and so did the compass and, later, gunpowder. From the west came new kinds of glassmaking. Farmers along the routes learned to grow new crops, such as grapes, which reached China from Central Asia.

      Knowledge of the stars, of numbers and of medicine was shared and studied in cities such as Baghdad, where scholars translated books from many languages. The numbers we use today, with their zero, were first developed in India and then carried west.

      Music, art and food mixed as well. Instruments, dances and recipes changed hands just as easily as silk. In this way, the Silk Road connected people's minds, not only their markets.`,
      [ideas, support],
      [
        q(
          ["What is the main idea of the passage?", "这篇文章的主要意思是什么？"],
          ["Ideas, not only goods, traveled along the Silk Road", "沿丝绸之路传播的不只是货物，还有思想"],
          [
            ["Buddhism began in India", "佛教起源于印度"],
            ["Grapes reached China from the lands of Central Asia", "葡萄从中亚各地传入中国"],
            ["Scholars in Baghdad translated books", "巴格达的学者翻译书籍"],
          ],
          [
            "The first and last paragraphs state the main idea: ideas traveled the Silk Road, connecting people's minds as well as their markets. The other options are details.",
            "第一段和最后一段说出了主要意思：思想沿丝绸之路传播，连接了人们的思想和市场。其他选项都是细节。",
          ],
          [
            ["Buddhism beginning in India is one example of an idea.", "佛教起源于印度只是思想传播的一个例子。"],
            ["Grapes reaching China is one example among many.", "葡萄传到中国是众多例子之一。"],
            ["Scholars in Baghdad are one detail, not the main idea.", "巴格达的学者是一个细节，不是中心思想。"],
          ],
        ),
        q(
          ["What do the caves at Dunhuang hold?", "敦煌的石窟里有什么？"],
          ["Thousands of paintings", "成千上万幅壁画"],
          [
            ["Bundles of silk", "一捆捆丝绸"],
            ["Barrels of gunpowder", "一桶桶火药"],
            ["Books from Baghdad", "来自巴格达的书"],
          ],
          [
            "The second paragraph says the caves at Dunhuang, in western China, hold thousands of paintings.",
            "第二段说，位于中国西部的敦煌石窟里有成千上万幅壁画。",
          ],
          [
            ["Bundles of silk are goods, not what the caves hold.", "成捆的丝绸是货物，不在石窟里。"],
            ["Gunpowder traveled west, but it is not in the caves.", "火药传到了西方，但不在石窟里。"],
            ["Books from Baghdad are not in the caves.", "巴格达的书不在石窟里。"],
          ],
        ),
        q(
          ["Where were the numbers we use today first developed?", "我们今天使用的数字最早是在哪里发展起来的？"],
          ["In India", "在印度"],
          [
            ["In Baghdad", "在巴格达"],
            ["In China", "在中国"],
            ["In Japan", "在日本"],
          ],
          [
            "The fourth paragraph says the numbers we use today, with their zero, were first developed in India and then carried west.",
            "第四段说，我们今天使用的带零的数字最早在印度发展起来，然后传到西方。",
          ],
          [
            ["Baghdad is where scholars studied them, not where they began.", "巴格达是学者研究它们的地方，不是起源地。"],
            ["China sent paper and the compass, not these numbers.", "中国传出的是纸和指南针，不是这些数字。"],
            ["Japan is where Buddhism reached, not where numbers began.", "日本是佛教传到的地方，不是数字的起源地。"],
          ],
        ),
      ],
      { names: ["Silk Road", "Buddhism", "India", "Central Asia", "China", "Korea", "Japan", "Buddha", "Dunhuang", "Baghdad"] },
    ),
    passage(
      "the-road-fades",
      ["The Road Fades", "道路的衰落"],
      `For more than a thousand years, the Silk Road carried goods and ideas across Asia and into Europe. But by about five hundred years ago, the busy land routes had begun to grow quiet. Why did the great road fade?

      One reason was the sea. Sailors learned to build bigger, stronger ships and to steer them across open oceans. A ship could carry far more cargo than a caravan of camels, and it did not have to stop at dozens of markets where the price rose each time. In 1498, a Portuguese sailor reached India by sailing around Africa. Soon, ships were carrying spices and silk straight to Europe.

      Another reason was danger. As great empires broke apart, the land routes became less safe. Wars and bandits made the long journey even riskier than before, and fewer merchants were willing to try it.

      Slowly, the caravanserais emptied, and some of the oasis towns were swallowed by the sand.

      The Silk Road did not disappear completely, though. Its towns, its stories and the ideas it carried live on. Today, new railways and highways follow some of its old paths, carrying goods between China and Europe once again.`,
      [trade, chains],
      [
        q(
          ["Why could ships carry goods more cheaply than caravans?", "为什么船运货比商队更便宜？"],
          ["They carried more and did not stop at many markets", "它们装得更多，也不用在许多市场停留"],
          [
            ["They were pulled across the sea by teams of camels", "它们由成群的骆驼拉着过海"],
            ["They never had to sail around Africa", "它们从不用绕过非洲"],
            ["They were safer than oasis towns", "它们比绿洲城镇更安全"],
          ],
          [
            "The second paragraph says a ship could carry far more cargo and did not have to stop at dozens of markets where the price rose.",
            "第二段说，船能装多得多的货物，也不用在几十个会涨价的市场停留。",
          ],
          [
            ["Camels pulling ships is not in the passage.", "骆驼拉船文中没有。"],
            ["Never sailing around Africa is wrong. A sailor did just that in 1498.", "从不绕过非洲不对。1498年就有水手这样做了。"],
            ["Being safer than oasis towns is not the reason given.", "比绿洲城镇更安全不是文中给的原因。"],
          ],
        ),
        q(
          ["What was another reason the land routes faded?", "陆上路线衰落的另一个原因是什么？"],
          ["Wars and bandits made them less safe", "战争和强盗让它们不再安全"],
          [
            ["The camels all went to sea", "骆驼都下了海"],
            ["People stopped wanting silk", "人们不再想要丝绸"],
            ["The deserts turned green", "沙漠变成了绿洲"],
          ],
          [
            "The third paragraph says that as empires broke apart, wars and bandits made the land routes less safe.",
            "第三段说，随着帝国解体，战争和强盗让陆上路线变得不再安全。",
          ],
          [
            ["Camels going to sea is not in the passage.", "骆驼出海文中没有。"],
            ["People stopping wanting silk is wrong. Ships still carried silk.", "人们不再想要丝绸不对。船还在运丝绸。"],
            ["Green deserts is wrong. Some towns were swallowed by sand.", "沙漠变绿不对。有些城镇被沙子吞没了。"],
          ],
        ),
        q(
          ["How do the old paths of the Silk Road carry goods today?", "如今丝绸之路的古道怎样运送货物？"],
          ["New railways and highways follow some of them", "新的铁路和公路沿着其中一些古道修建"],
          [
            ["Caravans of camels still travel along all of them", "骆驼商队仍沿着所有古道行走"],
            ["Ships sail along them through the desert", "船沿着它们穿过沙漠"],
            ["They are no longer used at all", "它们完全不再使用了"],
          ],
          [
            "The last paragraph says new railways and highways follow some of the old paths, carrying goods between China and Europe.",
            "最后一段说，新的铁路和公路沿着一些古道修建，在中国和欧洲之间运送货物。",
          ],
          [
            ["Camels on all the paths is wrong. Railways and highways follow some.", "骆驼走所有的路不对。是铁路和公路沿着其中一些。"],
            ["Ships through the desert is not in the passage.", "船穿过沙漠文中没有。"],
            ["Not used at all is wrong. Goods travel them again.", "完全不用不对。货物又在这些路上运输了。"],
          ],
        ),
      ],
      { names: ["Silk Road", "Asia", "Europe", "Portuguese", "India", "Africa", "China"], glossed: ["caravanserais"] },
    ),
  ],
};
