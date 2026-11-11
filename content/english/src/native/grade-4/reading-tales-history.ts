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
        ),
      ],
      { names: ["Silk Road", "Asia", "Europe", "Portuguese", "India", "Africa", "China"], glossed: ["caravanserais"] },
    ),
  ],
};
